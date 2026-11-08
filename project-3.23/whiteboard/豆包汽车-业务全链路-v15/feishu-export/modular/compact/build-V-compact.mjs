import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { JSDOM } from '/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/jsdom/lib/api.js';
const require = createRequire(import.meta.url);
const sharp = require('/Users/bytedance/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const dir = path.dirname(fileURLToPath(import.meta.url)), base = path.resolve(dir, '../../..');
const sourcePath = path.join(base, 'graph-v15.json'), raw = fs.readFileSync(sourcePath, 'utf8'), graph = JSON.parse(raw);
const svgSource = new JSDOM(fs.readFileSync(path.join(base, '业务全链路-v15.svg'), 'utf8'), { contentType: 'image/svg+xml' }).window.document;
const docGuide = JSON.parse(fs.readFileSync(path.resolve(dir, '../doc-guide.json'), 'utf8'));
const fullManifest = JSON.parse(fs.readFileSync(path.resolve(dir, '../manifest.json'), 'utf8'));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const sha = s => crypto.createHash('sha256').update(s).digest('hex');
function measure(text, size) {
  return [...text].reduce((total, ch) => total + (/[^\u0000-\u007f]/u.test(ch) ? 1.02 : /\s/.test(ch) ? 0.35 : /[A-ZMW]/.test(ch) ? 0.75 : 0.6) * size, 0);
}
function wrap(text, size, width) {
  const result = []; let line = '', used = 0;
  // Preserve English identifiers and numeric units such as ASR/300 ms intact.
  for (const ch of text.match(/[A-Za-z0-9_]+(?:[ \t]+[A-Za-z0-9_]+)*|[^A-Za-z0-9_]/gu) || []) {
    const next = measure(ch, size);
    if (line && used + next > width) { result.push(line); line = ''; used = 0; }
    line += ch; used += next;
  }
  if (line) result.push(line);
  return result;
}
function titleWrap(text) {
  const initial = wrap(text, 24, 360);
  if (initial.length !== 2) return initial;
  const chars = [...text], candidates = [];
  for (let i = 1; i < chars.length; i++) {
    if (/[A-Za-z0-9_]/.test(chars[i - 1]) && /[A-Za-z0-9_]/.test(chars[i])) continue;
    if (/[、，。：；！？）】》]/.test(chars[i])) continue;
    const a = chars.slice(0, i).join(''), b = chars.slice(i).join(''), wa = measure(a, 24), wb = measure(b, 24);
    if (wa <= 360 && wb <= 360) candidates.push({ lines: [a, b], score: Math.abs(wa - wb) + (/[：，；]/.test(chars[i - 1]) ? -80 : 0) + (/\s/.test(chars[i - 1]) || /\s/.test(chars[i]) ? -100 : 0) });
  }
  candidates.sort((a, b) => a.score - b.score);
  return candidates[0]?.lines || initial;
}
async function build(module, rowGap = 130) {
const ids = new Set(module.nodes.map(n => n.id));
const originalEdges = graph.edges.filter(e => ids.has(e.from) && ids.has(e.to));
const nodes = module.nodes.map(n => {
  const titleLines = titleWrap(n.title), bodyLines = n.lines.flatMap((s, i) => wrap(s, 20, 360).map(text => ({ sourceLine: i, text })));
  const height = 18 + 24 + 10 + titleLines.length * 30 + 14 + bodyLines.length * 26 + 18;
  const sourceSvg = [...svgSource.querySelectorAll('g.node')].find(g => g.getAttribute('data-node') === n.id);
  return { ...n, sourceDetail: n.detail, sourceSvg, titleLines, bodyLines, compactHeightNeeded: height };
});
const rowCount = Math.max(...nodes.map(n => n.row)) + 1;
const longestNarrowLabelToken = Math.max(0, ...originalEdges.filter(e => e.labelBox.w <= 160).flatMap(e => (e.label.match(/[A-Za-z0-9_]+(?:[ \t]+[A-Za-z0-9_]+)*|[^A-Za-z0-9_]/gu) || []).map(t => measure(t, 20))));
const columnGap = longestNarrowLabelToken + 12 > 118 ? Math.ceil(longestNarrowLabelToken + 40) : 130;
function baseMapX(x) {
  for (let c = 0; c < 3; c++) {
    const start = module.x + 100 + c * 910, end = start + 720;
    if (x <= end) return 60 + c * (400 + columnGap) + (x - start) * 400 / 720;
    if (c < 2 && x < start + 910) return 60 + c * (400 + columnGap) + 400 + (x - end) * columnGap / 190;
  }
  return 1260 + 2 * columnGap + (x - module.x - 2640) * 400 / 720;
}
const leftShift = Math.max(0, Math.ceil(24 - Math.min(60, ...originalEdges.map(e => baseMapX(e.labelBox.x)))));
const columnLefts = [60, 460 + columnGap, 860 + 2 * columnGap].map(x => x + leftShift), nodeWidth = 400, width = 1760 + leftShift + 2 * (columnGap - 130);
const subtitleLines = wrap(module.subtitle, 20, width - 88);
const rowHeights = Array.from({ length: rowCount }, (_, row) => Math.max(...nodes.filter(n => n.row === row).map(n => n.compactHeightNeeded)));
const rowTops = []; for (let r = 0; r < rowCount; r++) rowTops.push(r === 0 ? 140 + (subtitleLines.length - 1) * 26 : rowTops[r - 1] + rowHeights[r - 1] + rowGap);
const height = rowTops.at(-1) + rowHeights.at(-1) + 70;
const cards = nodes.map(n => ({ id: n.id, x: columnLefts[n.col], y: rowTops[n.row], w: nodeWidth, h: rowHeights[n.row] }));
const cardById = new Map(cards.map(c => [c.id, c]));
function mapX(x) {
  return baseMapX(x) + leftShift;
}
function mapY(y) {
  for (let r = 0; r < rowCount; r++) {
    const start = module.y + 360 + r * 1010, end = start + 780;
    if (y <= end) return rowTops[r] + (y - start) * rowHeights[r] / 780;
    if (r < rowCount - 1 && y < start + 1010) return rowTops[r] + rowHeights[r] + (y - end) * rowGap / 230;
  }
  return rowTops.at(-1) + rowHeights.at(-1) + (y - module.y - 360 - (rowCount - 1) * 1010 - 780) * rowHeights.at(-1) / 780;
}
const hit = (a, b, margin = 0) => a.x < b.x + b.w + margin && a.x + a.w > b.x - margin && a.y < b.y + b.h + margin && a.y + a.h > b.y - margin;
const segmentHitsCard = (a, b, card) => {
  if (Math.abs(a[0] - b[0]) < 1e-7) return a[0] > card.x + 0.1 && a[0] < card.x + card.w - 0.1 && Math.max(a[1], b[1]) > card.y + 0.1 && Math.min(a[1], b[1]) < card.y + card.h - 0.1;
  if (Math.abs(a[1] - b[1]) < 1e-7) return a[1] > card.y + 0.1 && a[1] < card.y + card.h - 0.1 && Math.max(a[0], b[0]) > card.x + 0.1 && Math.min(a[0], b[0]) < card.x + card.w - 0.1;
  throw new Error('Unexpected nonorthogonal source segment');
};
const pointSegmentDistance = (p, a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy || 1))); return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy); };
const labelBoxes = [];
const edges = originalEdges.map(e => {
  const points = e.points.map(p => [mapX(p[0]), mapY(p[1])]);
  const longestToken = Math.max(0, ...(e.label.match(/[A-Za-z0-9_]+(?:[ \t]+[A-Za-z0-9_]+)*|[^A-Za-z0-9_]/gu) || []).map(t => measure(t, 20)));
  const w = Math.max(100, longestToken + 12, Math.min(240, mapX(e.labelBox.x + e.labelBox.w) - mapX(e.labelBox.x)));
  const labelLines = wrap(e.label, 20, w - 12), h = labelLines.length * 24 + 12;
  const anchor = { x: mapX(e.labelBox.x), y: mapY(e.labelBox.y), w, h };
  const offsets = [0, -12, 12, -24, 24, -36, 36, -48, 48, -72, 72, -96, 96, -120, 120, -160, 160, -200, 200, -240, 240, -280, 280, -320, 320, -360, 360];
  const candidates = offsets.flatMap(dx => offsets.map(dy => ({ ...anchor, x: anchor.x + dx, y: anchor.y + dy, dx, dy }))).filter(b => b.x >= 24 && b.x + b.w <= width - 24 && b.y >= 112 && b.y + b.h <= height - 20 && !cards.some(c => hit(b, c, 6)) && !labelBoxes.some(c => hit(b, c, 5))).map(b => {
    const center = [b.x + b.w / 2, b.y + b.h / 2], distance = Math.min(...points.slice(1).map((q, i) => pointSegmentDistance(center, points[i], q)));
    return { ...b, distance, score: b.dx * b.dx + b.dy * b.dy + distance * distance * 0.2 };
  }).sort((a, b) => a.score - b.score);
  if (!candidates.length) throw new Error(`LABEL_SPACE:${module.id}:${e.id}`);
  const box = candidates[0]; labelBoxes.push(box);
  const originalSvg = [...svgSource.querySelectorAll('g[data-edge]')].find(g => g.getAttribute('data-edge') === e.id && (g.getAttribute('class') || '').startsWith('edge '));
  const stroke = originalSvg.querySelector('polyline[marker-end]') || originalSvg.querySelector('polyline');
  return { ...e, points, labelLines, compactLabelBox: { x: box.x, y: box.y, w, h }, labelShiftFromMappedOriginal: { x: box.dx, y: box.dy }, color: stroke.getAttribute('stroke'), strokeWidth: Number(stroke.getAttribute('stroke-width') || 3), dashPattern: stroke.getAttribute('stroke-dasharray') };
});
const failures = [];
for (const e of edges) for (let i = 1; i < e.points.length; i++) for (const card of cards) if (![e.from, e.to].includes(card.id) && segmentHitsCard(e.points[i - 1], e.points[i], card)) failures.push(`Edge ${e.id} crosses unrelated card ${card.id}`);
for (const [i, b] of labelBoxes.entries()) { for (const card of cards) if (hit(b, card, 0)) failures.push(`Label ${edges[i].id} overlaps card ${card.id}`); for (let j = i + 1; j < labelBoxes.length; j++) if (hit(b, labelBoxes[j], 0)) failures.push(`Labels overlap ${edges[i].id}/${edges[j].id}`); }
if (failures.length) throw new Error(failures.join('\n'));

const cells = [], svg = [];
let sequence = 0;
const vertex = (id, parent, value, style, x, y, w, h) => cells.push(`<mxCell id="${id}" parent="${parent}" vertex="1" value="${esc(value)}" style="${esc(style)}"><mxGeometry x="${x}" y="${y}" width="${w}" height="${h}" as="geometry"/></mxCell>`);
const text = (parent, text, x, baseline, size, weight, color, nativeX = x, nativeY = baseline) => {
  const id = `compact-text-${++sequence}`;
  svg.push(`<text x="${x}" y="${baseline}" font-size="${size}" font-weight="${weight}" fill="${color}" xml:space="preserve">${esc(text)}</text>`);
  const value = `<span style="font-family:-apple-system,BlinkMacSystemFont,&quot;PingFang SC&quot;,&quot;Microsoft YaHei&quot;,sans-serif;font-size:${size}px;font-weight:${weight};line-height:1;white-space:pre;">${esc(text)}</span>`;
  vertex(id, parent, value, `text;html=1;align=left;verticalAlign=top;whiteSpace=nowrap;overflow=visible;spacing=0;fontSize=${size};fontWeight=${weight};fontStyle=${weight >= 600 ? 1 : 0};fontColor=${color};fillColor=none;strokeColor=none;`, nativeX, nativeY - size, Math.max(60, measure(text, size) + 2), size * 1.2);
};
const markers = [...new Set(edges.map(e => e.color))].map(color => `<marker id="arrow-${color.slice(1)}" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0 L10 4 L0 8 Z" fill="${color}"/></marker>`).join('');
svg.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" font-family="-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif"><defs>${markers}</defs><rect width="${width}" height="${height}" fill="#F8FAFD"/>`);
vertex('compact-background', '1', '', 'shape=rectangle;fillColor=#F8FAFD;strokeColor=none;', 0, 0, width, height);
text('1', `${module.id} · ${module.title}`, 44, 48, 30, 650, '#163352');
subtitleLines.forEach((line, i) => text('1', line, 44, 84 + i * 26, 20, 400, '#62758A'));
for (const e of edges) {
  svg.push(`<polyline points="${e.points.map(p => p.join(',')).join(' ')}" fill="none" stroke="white" stroke-width="${Math.max(7, e.strokeWidth + 4)}"/><polyline points="${e.points.map(p => p.join(',')).join(' ')}" fill="none" stroke="${e.color}" stroke-width="${e.strokeWidth}"${e.dashPattern ? ` stroke-dasharray="${e.dashPattern}"` : ''} marker-end="url(#arrow-${e.color.slice(1)})"/>`);
  const point = (p, as) => `<mxPoint x="${p[0]}" y="${p[1]}"${as ? ` as="${as}"` : ''}/>`;
  cells.push(`<mxCell id="${e.id}" parent="1" edge="1" value="" originalFrom="${e.from}" originalTo="${e.to}" style="edgeStyle=none;noEdgeStyle=1;rounded=0;curved=0;startArrow=none;endArrow=block;endFill=1;endSize=10;strokeColor=${e.color};strokeWidth=${e.strokeWidth};dashed=${e.dashPattern ? 1 : 0};${e.dashPattern ? `fixDash=1;dashPattern=${e.dashPattern};` : ''}"><mxGeometry relative="1" as="geometry">${point(e.points[0], 'sourcePoint')}${point(e.points.at(-1), 'targetPoint')}${e.points.length > 2 ? `<Array as="points">${e.points.slice(1, -1).map(p => point(p)).join('')}</Array>` : ''}</mxGeometry></mxCell>`);
}
for (const node of nodes) {
  const c = cardById.get(node.id), r = node.sourceSvg.querySelector('rect'), fill = r.getAttribute('fill'), stroke = r.getAttribute('stroke');
  const sourceTexts = [...node.sourceSvg.querySelectorAll('text')], titleColor = sourceTexts[1].getAttribute('fill');
  vertex(`group-${node.id}`, '1', '', 'group;connectable=0;recursiveResize=0;fillColor=none;strokeColor=none;strokeWidth=0;', c.x, c.y, c.w, c.h);
  vertex(`shape-${node.id}`, `group-${node.id}`, '', `shape=rectangle;rounded=1;absoluteArcSize=1;arcSize=16;fillColor=${fill};strokeColor=${stroke};strokeWidth=1.5;`, 0, 0, c.w, c.h);
  svg.push(`<rect x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`);
  text(`group-${node.id}`, node.id, c.x + 20, c.y + 28, 20, 600, '#62758A', 20, 28);
  node.titleLines.forEach((line, i) => text(`group-${node.id}`, line, c.x + 20, c.y + 62 + i * 30, 24, 600, titleColor, 20, 62 + i * 30));
  const bodyStart = 62 + (node.titleLines.length - 1) * 30 + 39;
  node.bodyLines.forEach((line, i) => text(`group-${node.id}`, line.text, c.x + 20, c.y + bodyStart + i * 26, 20, 500, '#163352', 20, bodyStart + i * 26));
}
for (const e of edges) {
  const b = e.compactLabelBox;
  svg.push(`<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="3" fill="#FFFFFF"/>`);
  vertex(`label-${e.id}`, '1', '', 'group;connectable=0;recursiveResize=0;fillColor=none;strokeColor=none;strokeWidth=0;', b.x, b.y, b.w, b.h);
  vertex(`label-bg-${e.id}`, `label-${e.id}`, '', 'shape=rectangle;rounded=1;absoluteArcSize=1;arcSize=6;fillColor=#FFFFFF;strokeColor=none;', 0, 0, b.w, b.h);
  e.labelLines.forEach((line, i) => text(`label-${e.id}`, line, b.x + 6, b.y + 24 + i * 24, 20, 500, e.color, 6, 24 + i * 24));
}
svg.push('</svg>');
const svgRaw = svg.join(''), stem = module.id === 'V' ? 'V-语音-compact' : `${module.id}-compact`;
const svgPath = path.join(dir, `${stem}.svg`), drawioPath = path.join(dir, `${stem}.drawio`), pngPath = path.join(dir, `${stem}.png`);
fs.writeFileSync(svgPath, svgRaw);
const model = `<mxGraphModel grid="0" page="0" background="#F8FAFD"><root><mxCell id="0"/><mxCell id="1" parent="0"/>${cells.join('')}</root></mxGraphModel>`;
const drawio = `<mxfile host="app.diagrams.net"><diagram id="${module.id}-compact" name="${module.id} compact：${nodes.length}节点${edges.length}内部关系">${zlib.deflateRawSync(Buffer.from(encodeURIComponent(model))).toString('base64')}</diagram></mxfile>`;
fs.writeFileSync(drawioPath, drawio);
const info = await sharp(Buffer.from(svgRaw), { limitInputPixels: 16000000 }).png().toFile(pngPath);
const sourceStill = fs.readFileSync(sourcePath, 'utf8');
const validation = { localPrototypeOnly: true, sourcePath, sourceSha256: sha(raw), sourceUnchanged: sha(raw) === sha(sourceStill), module: 'V', sourceNodeCount: 18, compactNodeCount: nodes.length, sourceInternalRelationshipCount: 20, compactInternalRelationshipCount: edges.length, allOriginalIdsTitlesSummaryLinesRetained: nodes.every(n => n.titleLines.join('') === n.title && n.lines.every((s, i) => n.bodyLines.filter(l => l.sourceLine === i).map(l => l.text).join('') === s)), allOriginalEdgeLabelsAndDirectionRetained: edges.every(e => e.labelLines.join('') === e.label && originalEdges.find(o => o.id === e.id)?.from === e.from && originalEdges.find(o => o.id === e.id)?.to === e.to), detailRemovedOnlyFromCanvas: true, detailStillPresentInSourceAndDocGuide: true, excludedDetailNodeIds: nodes.map(n => n.id), noEdgeThroughUnrelatedNodes: !failures.length, noLabelNodeOrLabelLabelOverlap: !failures.length, failures, dimensions: { width: info.width, height: info.height }, originalFullModulePng: { width: 1600, height: 3320 }, heightReductionPercent: (3320 - info.height) / 3320 * 100, fonts: { minimum: 20, summary: 20, title: 24, edgeLabels: 20, nodeId: 20, header: 30 }, nodeWidth: 400, rowHeights, rowTops, columnLefts, rowGap: 130, nativeEditableCells: cells.length, nativeDrawioHasNoEmbeddedImages: !/shape=image|data:image|<image/.test(model), files: { svg: svgPath, drawio: drawioPath, png: pngPath }, limitations: ['Compact layout is a new local prototype, not a replacement for any full module or source diagram.', 'SVG/PNG are local layout previews; Feishu native import, text metrics, persistence and edit behavior are unverified.', 'Text wrapping uses conservative font-width estimates; inspect the rendered PNG before approving.', 'Original detail paragraphs remain in the source graph and the parent-authored native document; this graphic omits those paragraphs deliberately.', 'Original internal polyline topology is retained using strictly monotone piecewise mappings for node bands and gutters. Labels are repositioned only within free space without changing their text.', 'Native connectors retain explicit free endpoints and do not automatically reroute when a user moves a card.'], nodes: nodes.map(n => ({ id: n.id, title: n.title, lines: n.lines, originalRow: n.row, originalCol: n.col, compactCard: cardById.get(n.id), renderedTitleLines: n.titleLines, renderedSummaryLines: n.bodyLines, fullDetailInSource: n.detail })), edges: edges.map(e => ({ id: e.id, from: e.from, to: e.to, label: e.label, renderedLabelLines: e.labelLines, originalType: e.type, points: e.points, labelBox: e.compactLabelBox, labelShiftFromMappedOriginal: e.labelShiftFromMappedOriginal })) };
validation.module = module.id;
validation.sourceNodeCount = module.nodes.length;
validation.sourceInternalRelationshipCount = originalEdges.length;
validation.originalFullModulePng = fullManifest.modules.find(m => m.id === module.id).outputPixels;
validation.heightReductionPercent = (validation.originalFullModulePng.height - info.height) / validation.originalFullModulePng.height * 100;
validation.rowGap = rowGap;
validation.columnGap = columnGap;
validation.detailStillPresentInSourceAndDocGuide = nodes.every(n => docGuide.modules.find(m => m.id === module.id)?.nodes.find(m => m.id === n.id)?.detail === n.detail);
validation.manufacturingHintRemoved = !svgRaw.includes('节点完整解释见本节正文');
fs.writeFileSync(path.join(dir, `${module.id}-compact-validation.json`), JSON.stringify(validation, null, 2));
console.log(JSON.stringify({ files: validation.files, dimensions: validation.dimensions, fonts: validation.fonts, nodes: nodes.length, edges: edges.length, heightReductionPercent: validation.heightReductionPercent, noUnrelatedNodeCrossing: !failures.length, labelCollisions: failures, editableCells: cells.length }, null, 2));
return validation;
}
const order = ['V', 'R', 'M', 'C', 'D', 'E', 'O', 'I', 'W', 'F', 'K', 'T', 'G', 'L', 'S', 'P', 'A', 'H', 'B', 'U'];
const only = process.argv.indexOf('--only');
const selected = only >= 0 ? process.argv[only + 1].split(',') : order;
const results = [];
for (const id of selected) {
  let result;
  for (let spacing = 130; spacing <= 270; spacing += 20) {
    try { result = await build(graph.modules.find(m => m.id === id), spacing); break; }
    catch (error) { if (!String(error.message).startsWith('LABEL_SPACE:') || spacing === 270) throw error; }
  }
  results.push(result);
}
if (only >= 0 && fs.existsSync(path.join(dir, 'compact-manifest.json'))) {
  const current = JSON.parse(fs.readFileSync(path.join(dir, 'compact-manifest.json'), 'utf8'));
  current.modules = current.modules.map(m => results.find(r => r.module === m.module) || m);
  current.totals.editableCells = current.modules.reduce((s, m) => s + m.nativeEditableCells, 0);
  fs.writeFileSync(path.join(dir, 'compact-manifest.json'), JSON.stringify(current, null, 2));
}
if (only < 0) {
  const manifest = { sourcePath, sourceSha256: sha(raw), readingOrder: order, modules: results, totals: { modules: results.length, nodes: results.reduce((s, m) => s + m.compactNodeCount, 0), internalEdges: results.reduce((s, m) => s + m.compactInternalRelationshipCount, 0), editableCells: results.reduce((s, m) => s + m.nativeEditableCells, 0) }, crossModuleRelationships: fullManifest.crossModuleRelationships, fullDetailGuide: path.resolve(dir, '../doc-guide.json'), compactScope: 'Only id/title/lines plus complete internal relationships are drawn. Detail remains in the original native document and local doc-guide. No graph source or full-module asset is changed.', feishuOnlineImportVerified: false };
  fs.writeFileSync(path.join(dir, 'compact-manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(JSON.stringify({ manifest: path.join(dir, 'compact-manifest.json'), totals: manifest.totals }));
}
