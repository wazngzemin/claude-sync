import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { JSDOM } from '/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/jsdom/lib/api.js';
const require = createRequire(import.meta.url);
const sharp = require('/Users/bytedance/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const dir = path.dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'compact-manifest.json'), 'utf8'));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const key = (x, y, text) => `${Number(x).toFixed(5)}|${Number(y).toFixed(5)}|${text}`;
const records = [];
const inputHashes = {};
const hashes = raw => crypto.createHash('sha256').update(raw).digest('hex');
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
for (const module of manifest.modules) {
  const raw = fs.readFileSync(module.files.svg, 'utf8'); inputHashes[module.module] = hashes(raw);
  const doc = new JSDOM(raw, { contentType: 'image/svg+xml' }).window.document;
  const ownership = new Map();
  for (const node of module.nodes) {
    const c = node.compactCard;
    ownership.set(key(c.x + 20, c.y + 28, node.id), { scope: 'node-id', id: node.id, box: c });
    node.renderedTitleLines.forEach((s, i) => ownership.set(key(c.x + 20, c.y + 62 + i * 30, s), { scope: 'node-title', id: node.id, box: c }));
    const start = 62 + (node.renderedTitleLines.length - 1) * 30 + 39;
    node.renderedSummaryLines.forEach((s, i) => ownership.set(key(c.x + 20, c.y + start + i * 26, s.text), { scope: 'node-summary', id: node.id, box: c }));
  }
  for (const edge of module.edges) edge.renderedLabelLines.forEach((s, i) => ownership.set(key(edge.labelBox.x + 6, edge.labelBox.y + 24 + i * 24, s), { scope: 'edge-label', id: edge.id, box: edge.labelBox }));
  for (const text of doc.querySelectorAll('text')) {
    const x = Number(text.getAttribute('x')), y = Number(text.getAttribute('y'));
    records.push({ module: module.module, text: text.textContent, x, y, size: Number(text.getAttribute('font-size')), weight: Number(text.getAttribute('font-weight')), owner: ownership.get(key(x, y, text.textContent)) || { scope: 'header', id: module.module, box: { x: 0, y: 0, w: module.dimensions.width, h: module.dimensions.height } }, canvas: module.dimensions });
  }
}
const checks = [];
const failures = [];
const sheetWidth = 2200, lineHeight = 64, chunkSize = 64;
for (let start = 0; start < records.length; start += chunkSize) {
  const part = records.slice(start, start + chunkSize);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${sheetWidth}" height="${part.length * lineHeight}" font-family="-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif">${part.map((r, i) => `<text x="20" y="${i * lineHeight + 48}" font-size="${r.size}" font-weight="${r.weight}" fill="#000000" xml:space="preserve">${esc(r.text)}</text>`).join('')}</svg>`;
  const { data, info } = await sharp(Buffer.from(svg), { limitInputPixels: 16000000 }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < part.length; i++) {
    const r = part[i]; let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (let y = i * lineHeight; y < (i + 1) * lineHeight; y++) {
      let index = (y * info.width) * info.channels + info.channels - 1;
      for (let x = 0; x < info.width; x++, index += info.channels) if (data[index]) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
    }
    if (!Number.isFinite(minX)) { if (r.text.trim()) failures.push({ module: r.module, id: r.owner.id, text: r.text, reason: 'No visible glyph rasterized' }); continue; }
    const ink = { x: r.x + minX - 20, y: r.y + minY - i * lineHeight - 48, w: maxX - minX + 1, h: maxY - minY + 1 };
    const b = r.owner.box;
    const withinOwner = ink.x >= b.x - 0.01 && ink.y >= b.y - 0.01 && ink.x + ink.w <= b.x + b.w + 0.01 && ink.y + ink.h <= b.y + b.h + 0.01;
    const withinCanvas = ink.x >= 0 && ink.y >= 0 && ink.x + ink.w <= r.canvas.width && ink.y + ink.h <= r.canvas.height;
    const result = { module: r.module, id: r.owner.id, scope: r.owner.scope, text: r.text, size: r.size, weight: r.weight, actualLocalGlyphInkBounds: ink, intendedOwnerBounds: b, withinOwner, withinCanvas };
    if (!withinOwner || !withinCanvas) failures.push(result);
    checks.push(result);
  }
}
for (const module of manifest.modules) if (hashes(fs.readFileSync(module.files.svg, 'utf8')) !== inputHashes[module.module]) failures.push({ module: module.module, reason: 'SVG changed during measurement' });
const report = { method: 'Every actual SVG text line is independently rasterized at its original font family/weight/size on a transparent temporary SVG sheet. Nonzero alpha pixels reconstruct its actual local glyph-ink bounds. No files or assets are changed by measurement.', result: { localActualGlyphBoundsPassed: failures.length === 0, modules: manifest.modules.length, actualTextLinesMeasured: checks.length, expectedTextLines: records.length, minimumFontSize: Math.min(...records.map(r => r.size)), glyphsClippedByCanvasOrOwner: failures.length, failures, feishuFontMetricsOrImportVerified: false }, perModule: manifest.modules.map(m => ({ module: m.module, lines: checks.filter(c => c.module === m.module).length, failures: failures.filter(c => c.module === m.module).length })), svgSha256: inputHashes, limitations: ['Local glyph metrics use the exact same font stack as the PNG previews. Feishu may substitute fonts or normalize metrics; live inspection remains necessary.', 'This checks visible glyph bounds rather than invisible text-editing frame estimates. Oversized editing frames do not imply clipped glyphs, and are distinguished from visible content.', 'The source business strings and compact route semantics are validated in the separate independent coverage report.'], checks };
fs.writeFileSync(path.join(dir, 'compact-text-metrics-validation.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ report: path.join(dir, 'compact-text-metrics-validation.json'), result: report.result }, null, 2));
if (failures.length) process.exitCode = 1;
