import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { JSDOM } from '/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/jsdom/lib/api.js';

// New prototype artifacts only. Existing conversion/import files are read-only.
const dir = path.dirname(fileURLToPath(import.meta.url));
const sourceName = '业务全链路-v15.drawio';
const outputName = '业务全链路-v15-原生多行.drawio';
const parse = s => new JSDOM(s, { contentType: 'application/xml' }).window.document;
const sha = s => crypto.createHash('sha256').update(s).digest('hex');
const sourceRaw = fs.readFileSync(path.join(dir, sourceName), 'utf8');
const sourceDoc = parse(sourceRaw);
const sourceCells = [...sourceDoc.querySelectorAll('mxCell')].filter(c => !['0', '1'].includes(c.id));
const sourceAllById = new Map([...sourceDoc.querySelectorAll('mxCell')].map(c => [c.id, c]));
const sourcePosition = new Map(sourceCells.map((c, i) => [c.id, i]));
const geometry = c => [...c.children].find(e => e.tagName === 'mxGeometry');
const num = (e, k) => Number(e?.getAttribute(k) || 0);
const textGroups = new Map();
for (const c of sourceCells) if (c.hasAttribute('sourceTextIndex')) {
  const key = c.getAttribute('sourceTextIndex');
  textGroups.set(key, [...(textGroups.get(key) || []), c]);
}
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const canonical = e => ({
  tag: e.tagName,
  attrs: Object.fromEntries([...e.attributes].map(a => [a.name, a.value]).sort(([a], [b]) => a.localeCompare(b))),
  children: [...e.childNodes].filter(c => c.nodeType === 1 || c.nodeType === 3 && c.textContent.trim()).map(c => c.nodeType === 1 ? canonical(c) : c.textContent),
});
function normalize(c) {
  const copy = c.cloneNode(true);
  for (const a of [...copy.attributes]) if (a.name.startsWith('source')) copy.removeAttribute(a.name);
  let style = copy.getAttribute('style') || '';
  style = style.replace(/([=;])white(?=;|$)/g, '$1#FFFFFF').replace(/([=;])black(?=;|$)/g, '$1#000000');
  if (style.startsWith('group;')) style += 'fillColor=none;strokeColor=none;strokeWidth=0;';
  copy.setAttribute('style', style);
  return copy;
}
const mergedMap = [];
const consumed = new Set();
const resultCells = [];
for (const original of sourceCells) {
  if (consumed.has(original.id)) continue;
  const target = normalize(original);
  const rows = textGroups.get(original.getAttribute('sourceTextIndex'));
  if (rows?.length > 1) {
    for (const field of ['parent', 'style', 'sourceBaselineX', 'sourceFontSize', 'sourceFontWeight']) {
      check(new Set(rows.map(c => c.getAttribute(field))).size === 1, `Ineligible multiline field ${field}: ${original.id}`);
    }
    const size = num(original, 'sourceFontSize');
    const gap = num(rows[1], 'sourceBaselineY') - num(rows[0], 'sourceBaselineY');
    for (let i = 1; i < rows.length; i++) {
      check(sourcePosition.get(rows[i].id) === sourcePosition.get(rows[i - 1].id) + 1, `Non-adjacent rows: ${original.id}`);
      check(num(rows[i], 'sourceBaselineY') - num(rows[i - 1], 'sourceBaselineY') === gap, `Irregular baseline gap: ${original.id}`);
    }
    const g = geometry(target);
    const rowHeight = num(geometry(original), 'height');
    g.setAttribute('width', String(Math.max(...rows.map(c => num(geometry(c), 'width')))));
    g.setAttribute('height', String((rows.length - 1) * gap + rowHeight));
    target.setAttribute('style', `${target.getAttribute('style')}lineHeight=${gap};absoluteLineHeight=1;`);
    // A raw br-based label would change first-line leading. Keep each original
    // span inside its original default mxGraph 1.2*fontSize line box, while the
    // surrounding row blocks enforce the exact original baseline increments.
    target.setAttribute('value', `<div style="font-size:${size}px;line-height:${gap}px;white-space:pre;">${rows.map((r, i) => `<div style="height:${i === rows.length - 1 ? rowHeight : gap}px;line-height:${size * 1.2}px;white-space:pre;">${r.getAttribute('value')}</div>`).join('')}</div>`);
    mergedMap.push({ sourceTextIndex: original.getAttribute('sourceTextIndex'), sourceCellIds: rows.map(c => c.id), targetCellId: target.id, gap, size, rowHeight });
    for (const row of rows) consumed.add(row.id);
  }
  resultCells.push(target);
}
if (failures.length) throw new Error(failures.join('\n'));
const makeModel = cells => `<mxGraphModel grid="0" page="0" pageWidth="13700" pageHeight="48466" background="#F8FAFD"><root><mxCell id="0"/><mxCell id="1" parent="0"/>${cells.map(c => typeof c === 'string' ? c : c.outerHTML).join('')}</root></mxGraphModel>`;
const encode = (model, id) => `<mxfile host="app.diagrams.net"><diagram id="${id}" name="v15 原生多行原坐标">${zlib.deflateRawSync(Buffer.from(encodeURIComponent(model))).toString('base64')}</diagram></mxfile>`;
const decode = raw => parse(decodeURIComponent(zlib.inflateRawSync(Buffer.from(parse(raw).querySelector('diagram').textContent.trim(), 'base64')).toString('utf8')));
const output = encode(makeModel(resultCells), 'v15-native-multiline');
fs.writeFileSync(path.join(dir, outputName), output);

// Batch only along complete original root subtrees, preserving painter order.
const children = new Map();
for (const c of resultCells) children.set(c.getAttribute('parent'), [...(children.get(c.getAttribute('parent')) || []), c]);
const subtree = c => [c, ...(children.get(c.id) || []).flatMap(subtree)];
const batches = [];
let current = [];
for (const root of children.get('1')) {
  const list = subtree(root);
  check(list.length <= 1998, `Root subtree exceeds import prototype cap: ${root.id}`);
  if (current.length && current.length + list.length > 1998) { batches.push(current); current = []; }
  current.push(...list);
}
if (current.length) batches.push(current);
const batchFiles = [];
for (const [i, batch] of batches.entries()) {
  const frame = `multiline-import-frame-${i + 1}`;
  const anchor = `multiline-import-anchor-${i + 1}`;
  const auxiliary = `<mxCell id="${frame}" parent="1" vertex="1" style="group;connectable=0;recursiveResize=0;fillColor=none;strokeColor=none;strokeWidth=0;"><mxGeometry x="0" y="0" width="16000" height="50000" as="geometry"/></mxCell><mxCell id="${anchor}" parent="${frame}" vertex="1" style="shape=rectangle;fillColor=none;strokeColor=none;strokeWidth=0;"><mxGeometry x="0" y="0" width="16000" height="50000" as="geometry"/></mxCell>`;
  const copies = batch.map(c => { const copy = c.cloneNode(true); if (copy.getAttribute('parent') === '1') copy.setAttribute('parent', frame); return copy; });
  const file = `v15-多行原坐标-${String(i + 1).padStart(2, '0')}.drawio`;
  const raw = encode(makeModel([auxiliary, ...copies]), `v15-native-multiline-${i + 1}`);
  fs.writeFileSync(path.join(dir, file), raw);
  batchFiles.push({ file, originalRepresentationCells: batch.length, auxiliaryCells: 2, allImportCellsExcludingScaffolds: batch.length + 2, sha256: sha(raw) });
}

// Independent readback: expand each multiline into original line cells and
// compare every original string/span/style/baseline plus all non-text geometry.
const readDoc = decode(fs.readFileSync(path.join(dir, outputName), 'utf8'));
const readCells = [...readDoc.querySelectorAll('mxCell')].filter(c => c.id.startsWith('v15_'));
const readById = new Map([...readDoc.querySelectorAll('mxCell')].map(c => [c.id, c]));
const mergedByTarget = new Map(mergedMap.map(m => [m.targetCellId, m]));
const expandedIds = [];
const htmlDoc = new JSDOM('').window.document;
const host = htmlDoc.createElement('div');
function origin(cell, byId) {
  if (!cell || ['0', '1'].includes(cell.id)) return [0, 0];
  const p = origin(byId.get(cell.getAttribute('parent')), byId);
  return [p[0] + num(geometry(cell), 'x'), p[1] + num(geometry(cell), 'y')];
}
let lineComparisons = 0;
let nonTextComparisons = 0;
for (const cell of readCells) {
  const merge = mergedByTarget.get(cell.id);
  const original = sourceAllById.get(cell.id);
  if (!merge) {
    expandedIds.push(cell.id);
    check(JSON.stringify(canonical(cell)) === JSON.stringify(canonical(normalize(original))), `Unmerged cell changed: ${cell.id}`);
    if (original.hasAttribute('sourceTextIndex')) lineComparisons++; else nonTextComparisons++;
    continue;
  }
  host.innerHTML = cell.getAttribute('value');
  const outer = host.firstElementChild;
  const rowBlocks = [...outer.children];
  check(rowBlocks.length === merge.sourceCellIds.length, `Row count changed: ${cell.id}`);
  check(outer.style.lineHeight === `${merge.gap}px`, `Outer line-height differs: ${cell.id}`);
  check(cell.getAttribute('style') === `${normalize(original).getAttribute('style')}lineHeight=${merge.gap};absoluteLineHeight=1;`, `Merged cell style differs: ${cell.id}`);
  check(cell.getAttribute('parent') === original.getAttribute('parent'), `Merged parent differs: ${cell.id}`);
  const g = geometry(cell);
  const parentOrigin = origin(readById.get(cell.getAttribute('parent')), readById);
  let offset = 0;
  for (const [i, rowId] of merge.sourceCellIds.entries()) {
    const old = sourceAllById.get(rowId);
    const block = rowBlocks[i];
    expandedIds.push(rowId);
    const expectedHtml = htmlDoc.createElement('div'); expectedHtml.innerHTML = old.getAttribute('value');
    check(block.innerHTML === expectedHtml.innerHTML, `Text string or complete original span changed: ${rowId}`);
    check(block.style.lineHeight === `${merge.size * 1.2}px`, `Original row line box differs: ${rowId}`);
    check(num(g, 'x') + parentOrigin[0] === num(old, 'sourceBaselineX'), `Absolute baseline X differs: ${rowId}`);
    check(Math.abs(num(g, 'y') + parentOrigin[1] + offset + merge.size - num(old, 'sourceBaselineY')) < 1e-8, `Intended absolute baseline Y differs: ${rowId}`);
    const expectedHeight = i === rowBlocks.length - 1 ? merge.rowHeight : merge.gap;
    check(parseFloat(block.style.height) === expectedHeight, `Row height differs: ${rowId}`);
    offset += parseFloat(block.style.height);
    lineComparisons++;
  }
  check(Math.abs(offset - num(g, 'height')) < 1e-8, `Merged geometry height differs: ${cell.id}`);
  check(num(g, 'width') === Math.max(...merge.sourceCellIds.map(id => num(geometry(sourceAllById.get(id)), 'width'))), `Merged text no-wrap editing width differs: ${cell.id}`);
}
check(JSON.stringify(expandedIds) === JSON.stringify(sourceCells.map(c => c.id)), 'Expanded text/nontext painter order differs');
check(lineComparisons === 4775, 'Not all original text lines compared');
check(nonTextComparisons === 4245, 'Not all nontext cells compared');
check(readCells.length === 6539, 'Unexpected total multiline cell count');
const batchIds = [];
for (const [i, item] of batchFiles.entries()) {
  const doc = decode(fs.readFileSync(path.join(dir, item.file), 'utf8'));
  const frame = `multiline-import-frame-${i + 1}`;
  const anchor = `multiline-import-anchor-${i + 1}`;
  const cells = [...doc.querySelectorAll('mxCell')];
  check(cells.length - 2 <= 2000, `Batch exceeds 2000 including helpers: ${item.file}`);
  for (const id of [frame, anchor]) {
    const c = doc.getElementById(id), g = geometry(c);
    check(num(g, 'x') === 0 && num(g, 'y') === 0 && num(g, 'width') === 16000 && num(g, 'height') === 50000, `Batch helper geometry differs: ${id}`);
    check(c.getAttribute('style').includes('fillColor=none;strokeColor=none;strokeWidth=0;'), `Batch helper transparency differs: ${id}`);
  }
  for (const cell of cells.filter(c => c.id.startsWith('v15_'))) {
    batchIds.push(cell.id);
    if (cell.getAttribute('parent') === frame) cell.setAttribute('parent', '1');
    check(JSON.stringify(canonical(cell)) === JSON.stringify(canonical(readById.get(cell.id))), `Batch differs from complete multiline source: ${cell.id}`);
  }
}
check(JSON.stringify(batchIds) === JSON.stringify(readCells.map(c => c.id)), 'Batch coverage/order differs');
const report = {
  source: sourceName, sourceSha256: sha(sourceRaw), output: outputName, outputSha256: sha(output),
  result: { passed: failures.length === 0, failures, originalCells: 9020, multilineCells: readCells.length, originalTextLineCells: 4775, nativeTextCells: textGroups.size, mergedMultilineBlocks: mergedMap.length, reducedCells: 9020 - readCells.length, reductionPercent: (9020 - readCells.length) / 9020 * 100, originalLineStringAndSpanComparisons: lineComparisons, nonTextCellsComparedUnchanged: nonTextComparisons, expandedOriginalPainterOrderPreserved: true, intendedAbsoluteBaselineTargetsPreserved: true, originalGroupHierarchyPreserved: true },
  batches: batchFiles,
  representation: 'Original adjacent equal-style tspan cells sharing sourceTextIndex become one editable multiline mxCell. Native lineHeight is exact original baseline spacing, absoluteLineHeight=1. Explicit HTML row heights retain each full original span and original default 1.2*fontSize line box. No original words, hard line breaks, font sizes, numeric weights, colors, nontext cells or parent groups are removed or changed.',
  allowedNormalization: ['Remove source* metadata from import payloads', 'Normalize white/black to #FFFFFF/#000000', 'Make original groups explicitly fill/stroke transparent', 'Use the union editing geometry for merged text while keeping every intended absolute baseline target', 'Add zero-origin transparent group and transparent 16000x50000 anchor per batch'],
  limitations: [
    'Local source equivalence is validated. Actual glyph baselines and exact native-multiline line positions have not been measured in Draw.io or Feishu.',
    'The explicit row-line boxes use the original standard mxGraph default line-height 1.2. A Feishu HTML sanitizer may flatten block rows, ignore fixed row heights/absoluteLineHeight or normalize leading.',
    'The complete original font stack and numerical font weights are retained inside every original span; actual Feishu font availability and weight rendering are unverified.',
    'The importer may translate, scale or reflow batches. Live overlay, complete text, per-line positions, colors and editing must be inspected before use on the main board.',
    'Temporary frame groups and anchor rectangles must be removed only after live batch alignment. Existing original triangle arrows remain independent native triangle cells as before.',
    'This script writes only new multiline prototype artifacts; it does not overwrite original Draw.io files, original seven batch files or the main prepare-import script.'
  ],
  mergedTextSourceMap: mergedMap,
};
fs.writeFileSync(path.join(dir, 'native-multiline-validation.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ output: path.join(dir, outputName), result: report.result, batches: batchFiles }, null, 2));
if (failures.length) process.exitCode = 1;
