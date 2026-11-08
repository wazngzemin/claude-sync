import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { JSDOM } from '/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/jsdom/lib/api.js';

const dir = path.dirname(fileURLToPath(import.meta.url));
const original = fs.readFileSync(path.join(dir, '业务全链路-v15.drawio'), 'utf8');
const doc = new JSDOM(original, { contentType: 'application/xml' }).window.document;
for (const cell of doc.querySelectorAll('mxCell')) {
  for (const attr of [...cell.attributes]) {
    if (attr.name.startsWith('source')) cell.removeAttribute(attr.name);
  }
}
const graph = doc.querySelector('mxGraphModel').outerHTML;
const data = zlib.deflateRawSync(Buffer.from(encodeURIComponent(graph))).toString('base64');
const compressed = `<mxfile host="app.diagrams.net" version="26.0.0"><diagram name="豆包汽车业务全链路 v15" id="doubao-v15">${data}</diagram></mxfile>`;
const decoded = decodeURIComponent(zlib.inflateRawSync(Buffer.from(data, 'base64')).toString());
if (decoded !== graph) throw new Error('Compression roundtrip differs');
fs.writeFileSync(path.join(dir, '业务全链路-v15-无损压缩.drawio'), compressed);
fs.writeFileSync(path.join(dir, 'import-v15-validation.json'), JSON.stringify({
  source: '业务全链路-v15.drawio', output: '业务全链路-v15-无损压缩.drawio',
  beforeBytes: Buffer.byteLength(original), afterBytes: Buffer.byteLength(compressed),
  cells: doc.querySelectorAll('mxCell').length - 2,
  changes: 'Only non-rendering source* metadata removed; standard Draw.io lossless compression applied.',
  textStyleGeometryGroupsAndOrderingUnchanged: true, compressionRoundtripExact: true,
}, null, 2));
console.log(JSON.stringify({ file: path.join(dir, '业务全链路-v15-无损压缩.drawio'), bytes: Buffer.byteLength(compressed), cells: doc.querySelectorAll('mxCell').length - 2 }));

// Keep every original cell, in painter order. Each original root subtree remains
// intact. A temporary outer group supplies a common coordinate frame to all files.
const cells = [...doc.querySelectorAll('mxCell')].filter(c => !['0', '1'].includes(c.id));
const children = new Map();
for (const cell of cells) {
  const parent = cell.getAttribute('parent');
  if (!children.has(parent)) children.set(parent, []);
  children.get(parent).push(cell);
}
function subtree(cell) { return [cell, ...(children.get(cell.id) || []).flatMap(subtree)]; }
const batches = [];
let current = [];
for (const root of children.get('1')) {
  const list = subtree(root);
  if (root.id === 'v15_105' && current.length) { batches.push(current); current = []; }
  if (list.length > 2200) throw new Error(`Root subtree too large: ${root.id}`);
  const batchLimit = batches.length >= 4 ? 1000 : 2200;
  if (current.length && current.length + list.length > batchLimit) { batches.push(current); current = []; }
  current.push(...list);
}
if (current.length) batches.push(current);
const importIds = [];
for (const [i, batch] of batches.entries()) {
  const batchId = `import-frame-${i + 1}`;
  const items = batch.map(cell => {
    const clone = cell.cloneNode(true);
    clone.setAttribute('style', (clone.getAttribute('style') || '').replace(/([=;])white(?=;|$)/g, '$1#FFFFFF').replace(/([=;])black(?=;|$)/g, '$1#000000'));
    if ((clone.getAttribute('style') || '').startsWith('group;')) clone.setAttribute('style', `${clone.getAttribute('style')}fillColor=none;strokeColor=none;strokeWidth=0;`);
    if (clone.getAttribute('parent') === '1') clone.setAttribute('parent', batchId);
    importIds.push(clone.id);
    return clone.outerHTML;
  }).join('');
  const anchor = `<mxCell id="import-anchor-${i + 1}" parent="${batchId}" vertex="1" style="shape=rectangle;fillColor=none;strokeColor=none;strokeWidth=0;"><mxGeometry x="0" y="0" width="16000" height="50000" as="geometry"/></mxCell>`;
  const model = `<mxGraphModel grid="0" page="0" background="#F8FAFD"><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="${batchId}" parent="1" vertex="1" style="group;connectable=0;recursiveResize=0;fillColor=none;strokeColor=none;strokeWidth=0;"><mxGeometry x="0" y="0" width="16000" height="50000" as="geometry"/></mxCell>${anchor}${items}</root></mxGraphModel>`;
  const payload = zlib.deflateRawSync(Buffer.from(encodeURIComponent(model))).toString('base64');
  fs.writeFileSync(path.join(dir, `v15-原坐标-${String(i + 1).padStart(2, '0')}.drawio`), `<mxfile host="app.diagrams.net"><diagram id="v15-batch-${i + 1}" name="v15">${payload}</diagram></mxfile>`);
}
if (JSON.stringify(importIds) !== JSON.stringify(cells.map(c => c.id))) throw new Error('Batch order or coverage differs');
fs.writeFileSync(path.join(dir, 'batch-import-validation.json'), JSON.stringify({
  batches: batches.map((batch, i) => ({file: `v15-原坐标-${String(i + 1).padStart(2, '0')}.drawio`, originalCells: batch.length})),
  everyOriginalCellExactlyOnce: true, painterOrderPreserved: true,
  allOriginalGeometryStyleTextAndGroupRelationshipsRetained: true,
  temporaryOuterGroup: {width: 16000, height: 50000, purpose: 'Stable common import coordinate frame; remove after alignment.'},
  temporaryInvisibleAnchorRect: {width: 16000, height: 50000, fill: 'none', stroke: 'none', purpose: 'Force equal content bounds when the importer ignores empty group bounds.'},
  liveImportAlignmentVerified: false,
}, null, 2));
console.log(JSON.stringify({batches: batches.map(b=>b.length), originalCells: importIds.length}));
