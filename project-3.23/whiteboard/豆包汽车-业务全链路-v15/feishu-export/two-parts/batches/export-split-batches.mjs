import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { JSDOM } from '/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/jsdom/lib/api.js';

const dir = path.dirname(fileURLToPath(import.meta.url));
const parse = raw => new JSDOM(raw, { contentType: 'application/xml' }).window.document;
const decode = raw => parse(decodeURIComponent(zlib.inflateRawSync(Buffer.from(parse(raw).querySelector('diagram').textContent.trim(), 'base64')).toString('utf8')));
const hash = raw => crypto.createHash('sha256').update(raw).digest('hex');
const n = (e, k) => Number(e?.getAttribute(k) || 0);
const geom = c => [...c.children].find(e => e.tagName === 'mxGeometry');
const canonical = e => ({ tag: e.tagName, attrs: Object.fromEntries([...e.attributes].map(a => [a.name, a.value]).sort(([a], [b]) => a.localeCompare(b))), children: [...e.childNodes].filter(c => c.nodeType === 1 || c.nodeType === 3 && c.textContent.trim()).map(c => c.nodeType === 1 ? canonical(c) : c.textContent) });
const failures = [];
const check = (ok, msg) => { if (!ok) failures.push(msg); };
function origin(cell, map, seen = new Set()) {
  if (!cell || ['0', '1'].includes(cell.id)) return [0, 0];
  if (seen.has(cell.id)) throw new Error(`Parent cycle ${cell.id}`);
  seen.add(cell.id);
  const p = origin(map.get(cell.getAttribute('parent')), map, seen), g = geom(cell);
  return [p[0] + n(g, 'x'), p[1] + n(g, 'y')];
}
function absolute(cell, map) {
  const g = geom(cell), p = origin(map.get(cell.getAttribute('parent')), map);
  const result = { x: p[0] + n(g, 'x'), y: p[1] + n(g, 'y'), width: n(g, 'width'), height: n(g, 'height'), relative: g.getAttribute('relative') };
  if (cell.getAttribute('edge') === '1') result.points = [...g.querySelectorAll('mxPoint')].map(q => ({ x: p[0] + n(q, 'x'), y: p[1] + n(q, 'y'), as: q.getAttribute('as') }));
  return result;
}
const report = {
  purpose: 'Independent decompressed per-cell comparison of small import batches against the unchanged complete upper/lower Draw.io files',
  maximumCellsPerBatchIncludingHelpers: 1800,
  parts: [],
  limitations: [
    'Local file equivalence is checked; Feishu persistence, timeout behavior, overlay coordinates, font rendering, dash rendering and editability are unverified.',
    'Each batch adds one transparent zero-origin group and one transparent 16000x50000 anchor. These require live alignment and later removal by the primary agent.',
    'Each original root subtree is retained intact. No original source cell is removed, merged, reworded, resized, recolored or duplicated within its half.',
    'The source two-part files already contain exact cut fragments and three dash-phase recovery representations. These batches retain those cells and styles unchanged.',
    'Original two-part files, the original full diagram and the existing prepare scripts are never overwritten by this script.'
  ],
};
for (const [partIndex, name] of ['上半', '下半'].entries()) {
  const sourcePath = path.resolve(dir, `../业务全链路-v15-${name}.drawio`);
  const sourceRaw = fs.readFileSync(sourcePath, 'utf8'), sourceDoc = decode(sourceRaw);
  const all = [...sourceDoc.querySelectorAll('mxCell')], source = all.filter(c => !['0', '1'].includes(c.id));
  const sourceMap = new Map(all.map(c => [c.id, c]));
  const children = new Map();
  for (const c of source) children.set(c.getAttribute('parent'), [...(children.get(c.getAttribute('parent')) || []), c]);
  const subtree = c => [c, ...(children.get(c.id) || []).flatMap(subtree)];
  const batches = [];
  let current = [];
  for (const root of children.get('1')) {
    const list = subtree(root);
    check(list.length <= 1798, `Oversized intact root subtree: ${name} ${root.id} ${list.length}`);
    if (current.length && current.length + list.length > 1798) { batches.push(current); current = []; }
    current.push(...list);
  }
  if (current.length) batches.push(current);
  check(JSON.stringify(batches.flat().map(c => c.id)) === JSON.stringify(source.map(c => c.id)), `Original subtree/painter order differs: ${name}`);
  const partResult = { name, sourcePath, sourceSha256: hash(sourceRaw), originalCellCount: source.length, files: [], verifiedOriginalCells: 0, duplicateSourceCells: [], missingSourceCells: [], originalRootSubtreesSplit: 0, duplicatedStructuralSourceGroups: 0 };
  const collected = [];
  for (const [i, batch] of batches.entries()) {
    const number = String(i + 1).padStart(2, '0');
    const file = `${name}-原坐标-${number}.drawio`, filePath = path.join(dir, file);
    const frame = `import-frame-${partIndex + 1}-${i + 1}`, anchor = `import-anchor-${partIndex + 1}-${i + 1}`;
    const copies = batch.map(c => { const copy = c.cloneNode(true); if (copy.getAttribute('parent') === '1') copy.setAttribute('parent', frame); return copy; });
    const helpers = `<mxCell id="${frame}" parent="1" vertex="1" style="group;connectable=0;recursiveResize=0;fillColor=none;strokeColor=none;strokeWidth=0;"><mxGeometry x="0" y="0" width="16000" height="50000" as="geometry"/></mxCell><mxCell id="${anchor}" parent="${frame}" vertex="1" style="shape=rectangle;fillColor=none;strokeColor=none;strokeWidth=0;"><mxGeometry x="0" y="0" width="16000" height="50000" as="geometry"/></mxCell>`;
    const model = `<mxGraphModel grid="0" page="0" background="#F8FAFD"><root><mxCell id="0"/><mxCell id="1" parent="0"/>${helpers}${copies.map(c => c.outerHTML).join('')}</root></mxGraphModel>`;
    const raw = `<mxfile host="app.diagrams.net"><diagram id="v15-${partIndex + 1}-batch-${i + 1}" name="v15 ${name} 第${i + 1}批 原坐标">${zlib.deflateRawSync(Buffer.from(encodeURIComponent(model))).toString('base64')}</diagram></mxfile>`;
    fs.writeFileSync(filePath, raw);
    const readDoc = decode(fs.readFileSync(filePath, 'utf8'));
    const readCells = [...readDoc.querySelectorAll('mxCell')], map = new Map(readCells.map(c => [c.id, c]));
    check(map.size === readCells.length, `Duplicate ID in ${file}`);
    for (const [id, expectedStyle, parent] of [[frame, 'group;connectable=0;recursiveResize=0;fillColor=none;strokeColor=none;strokeWidth=0;', '1'], [anchor, 'shape=rectangle;fillColor=none;strokeColor=none;strokeWidth=0;', frame]]) {
      const c = map.get(id), g = geom(c);
      check(n(g, 'x') === 0 && n(g, 'y') === 0 && n(g, 'width') === 16000 && n(g, 'height') === 50000, `Helper geometry differs: ${id}`);
      check(c.getAttribute('style') === expectedStyle && c.getAttribute('parent') === parent, `Helper transparency/parent differs: ${id}`);
    }
    const originals = readCells.filter(c => !['0', '1', frame, anchor].includes(c.id));
    check(originals.length + 2 <= 1800, `Batch exceeds 1800 cells: ${file}`);
    check(JSON.stringify(originals.map(c => c.id)) === JSON.stringify(batch.map(c => c.id)), `Batch painter order differs: ${file}`);
    for (const c of originals) {
      const original = sourceMap.get(c.id), restored = c.cloneNode(true);
      collected.push(c.id);
      if (restored.getAttribute('parent') === frame) restored.setAttribute('parent', '1');
      check(!!original && JSON.stringify(canonical(restored)) === JSON.stringify(canonical(original)), `Original cell content/style/geometry/group differs: ${file} ${c.id}`);
      check(JSON.stringify(absolute(c, map)) === JSON.stringify(absolute(original, sourceMap)), `Absolute geometry/line points differ: ${file} ${c.id}`);
      check(c.getAttribute('parent') === '1' || map.has(c.getAttribute('parent')), `Missing native group: ${file} ${c.id}`);
      partResult.verifiedOriginalCells++;
    }
    partResult.files.push({ file, path: filePath, bytes: Buffer.byteLength(raw), sha256: hash(raw), originalCells: batch.length, auxiliaryCells: 2, editableCellsIncludingHelpersExcludingScaffolds: batch.length + 2, originalTextLineCells: batch.filter(c => /^text;/.test(c.getAttribute('style') || '')).length });
  }
  const seen = new Set(collected);
  partResult.duplicateSourceCells = collected.filter((id, i) => collected.indexOf(id) !== i);
  partResult.missingSourceCells = source.filter(c => !seen.has(c.id)).map(c => c.id);
  check(partResult.duplicateSourceCells.length === 0 && partResult.missingSourceCells.length === 0 && collected.length === source.length, `Source coverage differs: ${name}`);
  check(JSON.stringify(collected) === JSON.stringify(source.map(c => c.id)), `Global original painter order differs: ${name}`);
  check(hash(fs.readFileSync(sourcePath, 'utf8')) === partResult.sourceSha256, `Original two-part file changed: ${name}`);
  partResult.localPerCellEquivalencePassed = !failures.some(f => f.includes(name) || partResult.files.some(item => f.includes(item.file)));
  report.parts.push(partResult);
}
report.result = { localValidationPassed: failures.length === 0, failures, originalPartCellsVerified: report.parts.reduce((s, p) => s + p.verifiedOriginalCells, 0), allOriginalCellsExactlyOnceWithinEachPart: report.parts.every(p => !p.duplicateSourceCells.length && !p.missingSourceCells.length && p.verifiedOriginalCells === p.originalCellCount), nativeSingleLineTextsStylesAbsoluteCoordinatesSizesPathsAndPainterOrderPreserved: failures.length === 0, originalRootSubtreesPreservedIntact: true, sourcePartFilesUnchanged: true, feishuOnlineImportVerified: false };
fs.writeFileSync(path.join(dir, 'split-batches-validation.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ parts: report.parts.map(p => ({ part: p.name, files: p.files.map(f => ({ file: f.file, originalCells: f.originalCells, withHelpers: f.editableCellsIncludingHelpersExcludingScaffolds })) })), result: report.result, report: path.join(dir, 'split-batches-validation.json') }, null, 2));
if (failures.length) process.exitCode = 1;
