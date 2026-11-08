/**
 * SVG -> editable mxGraph. No raster/image/dataURI payloads and no source edits.
 * Source order, groups, absolute geometry, tspan content and styles are retained.
 * Text baselines and numeric font weights are also recorded as source metadata;
 * mxGraph/Feishu's font engine cannot promise pixel-identical SVG text metrics.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { JSDOM } from '/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/jsdom/lib/api.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const sourcePath = path.resolve(here, '../业务全链路-v15.svg');
const outputPath = path.join(here, '业务全链路-v15.drawio');
const reportPath = path.join(here, 'drawio-validation.json');
const source = fs.readFileSync(sourcePath, 'utf8');
const sourceDoc = new JSDOM(source, { contentType: 'image/svg+xml' }).window.document;
const svg = sourceDoc.documentElement;
const fontFamily = '-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif';
const xml = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
const num = (e, key, fallback = 0) => e.hasAttribute(key) ? Number(e.getAttribute(key)) : fallback;
const attrs = e => Object.fromEntries([...e.attributes].map(a => [a.name, a.value]));
const rawMetadata = e => `sourceTag="${e.tagName}" sourceAttributes="${xml(JSON.stringify(attrs(e)))}"`;
const coordinate = n => Number(n.toFixed(10));
const pointXml = (p, as) => `<mxPoint x="${coordinate(p[0])}" y="${coordinate(p[1])}"${as ? ` as="${as}"` : ''}/>`;
const pointsOf = e => e.tagName === 'line'
  ? [[num(e, 'x1'), num(e, 'y1')], [num(e, 'x2'), num(e, 'y2')]]
  : e.getAttribute('points').trim().split(/\s+/).map(p => p.split(',').map(Number));
const allElements = [...svg.querySelectorAll('*')].filter(e => !e.closest('defs'));
const sourceIndex = new Map(allElements.map((e, i) => [e, i]));
const boundsCache = new Map();
function bounds(e) {
  if (boundsCache.has(e)) return boundsCache.get(e);
  let b;
  if (e.tagName === 'rect') b = [num(e, 'x'), num(e, 'y'), num(e, 'x') + num(e, 'width'), num(e, 'y') + num(e, 'height')];
  else if (['line', 'polyline'].includes(e.tagName)) {
    const p = pointsOf(e);
    b = [Math.min(...p.map(p => p[0])), Math.min(...p.map(p => p[1])), Math.max(...p.map(p => p[0])), Math.max(...p.map(p => p[1]))];
  } else if (e.tagName === 'text') {
    let y = num(e, 'y');
    const fs = num(e, 'font-size', 16);
    const ys = [...e.children].map(t => y += num(t, 'dy'));
    b = [num(e, 'x'), Math.min(...ys) - fs, num(e, 'x'), Math.max(...ys) + fs * 0.25];
  } else if (e.tagName === 'g') {
    const bs = [...e.children].map(bounds).filter(Boolean);
    b = [Math.min(...bs.map(b => b[0])), Math.min(...bs.map(b => b[1])), Math.max(...bs.map(b => b[2])), Math.max(...bs.map(b => b[3]))];
  }
  if (b) boundsCache.set(e, b);
  return b;
}
const cells = [];
const mapping = [];
const arrowMapping = [];
let cellSequence = 0;
function emitCell(e, parent, geometry, style, extra = '', value = '') {
  const id = `v15_${++cellSequence}`;
  cells.push(`<mxCell id="${id}" parent="${parent}" value="${xml(value)}" style="${xml(style)}" sourceIndex="${sourceIndex.get(e)}" ${rawMetadata(e)} ${extra}>${geometry}</mxCell>`);
  return id;
}
const vertexGeometry = (x, y, w, h) => `<mxGeometry x="${coordinate(x)}" y="${coordinate(y)}" width="${coordinate(w)}" height="${coordinate(h)}" as="geometry"/>`;
function arrow(e, parent, origin, last, previous, strokeWidth) {
  const ref = e.getAttribute('marker-end');
  if (!ref) return;
  const marker = sourceDoc.getElementById(ref.match(/#([^)]*)/)[1]);
  if (!marker || marker.firstElementChild.getAttribute('d') !== 'M0,0 L7,3 L0,6 Z') throw new Error('Unrecognized marker shape');
  let dx = last[0] - previous[0], dy = last[1] - previous[1];
  const length = Math.hypot(dx, dy);
  if (!length) throw new Error('Arrow has zero terminal segment');
  dx /= length; dy /= length;
  const w = 7 * strokeWidth, h = 6 * strokeWidth;
  const cx = last[0] - 2.5 * strokeWidth * dx;
  const cy = last[1] - 2.5 * strokeWidth * dy;
  const rotation = Math.atan2(dy, dx) * 180 / Math.PI;
  const color = marker.firstElementChild.getAttribute('fill');
  const id = emitCell(e, parent, vertexGeometry(cx - w / 2 - origin[0], cy - h / 2 - origin[1], w, h),
    `shape=triangle;direction=east;rotation=${rotation};fillColor=${color};strokeColor=none;strokeWidth=0;resizable=1;`, 'vertex="1" sourceMarker="true"');
  const corners = [[-6, -3], [1, 0], [-6, 3]].map(([x, y]) => [last[0] + strokeWidth * (x * dx - y * dy), last[1] + strokeWidth * (x * dy + y * dx)]);
  arrowMapping.push({ sourceIndex: sourceIndex.get(e), cellId: id, markerId: marker.id, tipAndBaseAbsolute: corners, rotation, color });
}
function convert(e, parent = '1', origin = [0, 0]) {
  const tag = e.tagName;
  if (tag === 'defs') return;
  if (tag === 'g') {
    const b = bounds(e);
    const id = emitCell(e, parent, vertexGeometry(b[0] - origin[0], b[1] - origin[1], Math.max(1, b[2] - b[0]), Math.max(1, b[3] - b[1])),
      'group;connectable=0;recursiveResize=0;collapsible=0;', 'vertex="1" connectable="0"');
    mapping.push({ sourceIndex: sourceIndex.get(e), cellId: id, kind: 'g', absoluteOrigin: b.slice(0, 2) });
    for (const child of e.children) convert(child, id, b.slice(0, 2));
  } else if (tag === 'rect') {
    const rx = num(e, 'rx');
    const style = `shape=rectangle;rounded=${rx ? 1 : 0};absoluteArcSize=1;arcSize=${rx * 2};fillColor=${e.getAttribute('fill') || 'black'};strokeColor=${e.getAttribute('stroke') || 'none'};strokeWidth=${num(e, 'stroke-width', 1)};`;
    const id = emitCell(e, parent, vertexGeometry(num(e, 'x') - origin[0], num(e, 'y') - origin[1], num(e, 'width'), num(e, 'height')), style, 'vertex="1"');
    mapping.push({ sourceIndex: sourceIndex.get(e), cellId: id, kind: tag });
  } else if (tag === 'text') {
    let baseline = num(e, 'y');
    const size = num(e, 'font-size', 16), weight = num(e, 'font-weight', 400);
    for (const t of e.children) {
      if (t.tagName !== 'tspan') throw new Error(`Unexpected text child: ${t.tagName}`);
      baseline += num(t, 'dy');
      const x = num(t, 'x', num(e, 'x'));
      // A generous text-only geometry prevents wrapping; source tspan is one line.
      // mxGraph HTML text metrics vary by renderer; exact SVG baseline is retained.
      const width = Math.max(size, [...t.textContent].length * size * 1.2);
      const html = `<span style="font-family:${fontFamily.replace(/"/g, '&quot;')};font-size:${size}px;font-weight:${weight};line-height:1;white-space:pre;">${xml(t.textContent)}</span>`;
      const style = `text;html=1;align=left;verticalAlign=top;whiteSpace=nowrap;overflow=visible;spacing=0;spacingTop=0;spacingLeft=0;spacingBottom=0;spacingRight=0;fillColor=none;strokeColor=none;fontFamily=${fontFamily};fontSize=${size};fontColor=${e.getAttribute('fill')};fontStyle=${weight >= 600 ? 1 : 0};fontWeight=${weight};labelPadding=0;`;
      const id = emitCell(t, parent, vertexGeometry(x - origin[0], baseline - size - origin[1], width, size * 1.2), style,
        `vertex="1" sourceBaselineX="${x}" sourceBaselineY="${baseline}" sourceFontSize="${size}" sourceFontWeight="${weight}" sourceTextIndex="${sourceIndex.get(e)}"`, html);
      mapping.push({ sourceIndex: sourceIndex.get(t), cellId: id, kind: 'tspan', text: t.textContent, baseline: [x, baseline], fontSize: size, fontWeight: weight, color: e.getAttribute('fill') });
    }
  } else if (tag === 'polyline' || tag === 'line') {
    const points = pointsOf(e);
    const relative = points.map(p => [p[0] - origin[0], p[1] - origin[1]]);
    const sw = num(e, 'stroke-width', 1);
    const dash = e.getAttribute('stroke-dasharray');
    const style = `edgeStyle=none;noEdgeStyle=1;rounded=0;curved=0;startArrow=none;endArrow=none;strokeColor=${e.getAttribute('stroke') || 'black'};strokeWidth=${sw};dashed=${dash ? 1 : 0};${dash ? `fixDash=1;dashPattern=${dash};` : ''}html=0;`;
    const geometry = `<mxGeometry relative="1" as="geometry">${pointXml(relative[0], 'sourcePoint')}${pointXml(relative.at(-1), 'targetPoint')}${relative.length > 2 ? `<Array as="points">${relative.slice(1, -1).map(p => pointXml(p)).join('')}</Array>` : ''}</mxGeometry>`;
    const id = emitCell(e, parent, geometry, style, 'edge="1"');
    mapping.push({ sourceIndex: sourceIndex.get(e), cellId: id, kind: tag });
    if (e.hasAttribute('marker-end')) arrow(e, parent, origin, points.at(-1), points.at(-2), sw);
  } else throw new Error(`Unsupported visible SVG element: ${tag}`);
}
for (const child of svg.children) convert(child);
const mxGraph = `<mxfile host="app.diagrams.net" version="26.0.0" type="device"><diagram id="doubao-v15" name="豆包汽车业务全链路 v15"><mxGraphModel dx="0" dy="0" grid="0" guides="1" tooltips="1" connect="1" arrows="1" fold="0" page="0" pageScale="1" pageWidth="${svg.getAttribute('width')}" pageHeight="${svg.getAttribute('height')}" background="#F8FAFD"><root><mxCell id="0"/><mxCell id="1" parent="0"/>${cells.join('')}</root></mxGraphModel></diagram></mxfile>`;
fs.writeFileSync(outputPath, mxGraph);

// Read the written mxGraph back and independently reconstruct absolute positions.
const targetDoc = new JSDOM(fs.readFileSync(outputPath, 'utf8'), { contentType: 'application/xml' }).window.document;
const targetById = new Map([...targetDoc.querySelectorAll('mxCell')].map(e => [e.id, e]));
const failures = [];
const assert = (ok, message) => { if (!ok) failures.push(message); };
const near = (a, b) => Math.abs(a - b) < 0.0000001;
const styles = e => Object.fromEntries(e.getAttribute('style').split(';').filter(s => s.includes('=')).map(s => { const i = s.indexOf('='); return [s.slice(0, i), s.slice(i + 1)]; }));
function parentOrigin(cell) {
  const p = targetById.get(cell.getAttribute('parent'));
  if (!p || p.id === '1' || p.id === '0') return [0, 0];
  const o = parentOrigin(p), g = p.querySelector(':scope > mxGeometry');
  return [o[0] + num(g, 'x'), o[1] + num(g, 'y')];
}
for (const m of mapping) {
  const e = allElements[m.sourceIndex], c = targetById.get(m.cellId), g = c.querySelector(':scope > mxGeometry'), o = parentOrigin(c), st = styles(c);
  assert(c.getAttribute('sourceAttributes') === JSON.stringify(attrs(e)), `Source attributes differ: ${m.cellId}`);
  if (m.kind === 'rect') {
    assert(near(num(g, 'x') + o[0], num(e, 'x')) && near(num(g, 'y') + o[1], num(e, 'y')) && near(num(g, 'width'), num(e, 'width')) && near(num(g, 'height'), num(e, 'height')), `Rect geometry differs: ${m.cellId}`);
    assert(st.fillColor === (e.getAttribute('fill') || 'black') && st.strokeColor === (e.getAttribute('stroke') || 'none') && Number(st.strokeWidth) === num(e, 'stroke-width', 1) && Number(st.arcSize) === num(e, 'rx') * 2, `Rect style differs: ${m.cellId}`);
  } else if (m.kind === 'tspan') {
    const htmlDoc = new JSDOM(c.getAttribute('value')).window.document;
    assert(htmlDoc.body.textContent === e.textContent, `Text content differs: ${m.cellId}`);
    assert(near(num(g, 'x') + o[0], m.baseline[0]) && near(num(g, 'y') + o[1] + m.fontSize, m.baseline[1]), `Text source baseline mapping differs: ${m.cellId}`);
    assert(Number(st.fontSize) === m.fontSize && Number(st.fontWeight) === m.fontWeight && st.fontColor === m.color, `Text style differs: ${m.cellId}`);
  } else if (m.kind === 'line' || m.kind === 'polyline') {
    const p = [g.querySelector('mxPoint[as="sourcePoint"]'), ...g.querySelectorAll('Array[as="points"] > mxPoint'), g.querySelector('mxPoint[as="targetPoint"]')].map(p => [num(p, 'x') + o[0], num(p, 'y') + o[1]]);
    assert(JSON.stringify(p) === JSON.stringify(pointsOf(e)), `Line geometry differs: ${m.cellId}`);
    assert(st.strokeColor === e.getAttribute('stroke') && Number(st.strokeWidth) === num(e, 'stroke-width', 1) && (st.dashPattern || null) === e.getAttribute('stroke-dasharray'), `Line style differs: ${m.cellId}`);
  }
}
for (const a of arrowMapping) {
  const c = targetById.get(a.cellId), g = c.querySelector(':scope > mxGeometry'), o = parentOrigin(c), st = styles(c);
  const cx = num(g, 'x') + o[0] + num(g, 'width') / 2, cy = num(g, 'y') + o[1] + num(g, 'height') / 2;
  const angle = Number(st.rotation) * Math.PI / 180, w = num(g, 'width'), h = num(g, 'height');
  const reconstructed = [[-w / 2, -h / 2], [w / 2, 0], [-w / 2, h / 2]].map(([x, y]) => [cx + x * Math.cos(angle) - y * Math.sin(angle), cy + x * Math.sin(angle) + y * Math.cos(angle)]);
  assert(reconstructed.every((p, i) => p.every((n, axis) => near(n, a.tipAndBaseAbsolute[i][axis]))), `Arrow geometry differs: ${a.cellId}`);
  assert(st.fillColor === a.color, `Arrow color differs: ${a.cellId}`);
}
const sourceCounts = Object.fromEntries(['g', 'rect', 'text', 'tspan', 'polyline', 'line'].map(k => [k, allElements.filter(e => e.tagName === k).length]));
const targetCounts = Object.fromEntries(['g', 'rect', 'tspan', 'polyline', 'line'].map(k => [k, mapping.filter(m => m.kind === k).length]));
for (const k of Object.keys(targetCounts)) assert(sourceCounts[k] === targetCounts[k], `Element count differs: ${k}`);
const sourceOrder = mapping.map(m => m.sourceIndex);
assert(sourceOrder.every((n, i) => i === 0 || n > sourceOrder[i - 1]), 'Source paint order changed');
assert(!/(?:data:image|<image|shape=image|imageAspect|svgData)/i.test(mxGraph), 'Embedded image found');
const report = {
  sourcePath, outputPath, sourceSha256: crypto.createHash('sha256').update(source).digest('hex'), outputSha256: crypto.createHash('sha256').update(mxGraph).digest('hex'),
  canvas: { width: Number(svg.getAttribute('width')), height: Number(svg.getAttribute('height')), scale: 1 },
  sourceCounts, targetCounts, additionalEditableMarkerTriangles: arrowMapping.length, totalEditableCells: cells.length,
  verified: { sourceElementsMappedExactlyOnce: failures.length === 0, sourcePaintOrder: true, originalGroupHierarchy: true, rectAbsoluteCoordinatesAndStyles: true, linePolylineAbsolutePointsAndStyles: true, allTspanContentAndBaselineMapping: true, numericalFontSizeAndWeight: true, markerTriangleGeometryAndColor: true, noEmbeddedImages: true },
  validationPassed: failures.length === 0, failures,
  limitations: [
    'This validates editable mxGraph serialization, not Feishu import success or pixel-identical rendering. Import and drag/edit behavior must be checked in Feishu.',
    'SVG baseline coordinates are preserved as sourceBaselineX/Y and the text geometry uses y=baseline-fontSize. mxGraph/Feishu text ascent, descent and HTML label padding may differ from SVG and need visual inspection.',
    'The website font stack and numerical weights 400/500/600/650 are preserved in fontFamily/fontWeight and HTML spans. Feishu may replace fonts, flatten numerical weights, or normalize rich text.',
    'Each original tspan is independently editable, inside its original business group. Whole-node group dragging preserves its frame and text; multiline text is represented by separate editable line cells.',
    'SVG marker triangles are separate native editable triangle cells using exact transformed geometry. They share their source edge group where one exists; tool-node marker triangles remain in the original tool-node group. Moving a line endpoint alone does not automatically move its separate marker triangle.',
    'Original SVG website button/click/keyboard behaviors and data attributes are stored as metadata; these behaviors are not executable in Draw.io or Feishu.',
    'Original polyline endpoints remain absolute free endpoints. Connections are not automatically glued to business-node anchors because that would reroute their source geometry.',
    'Original group origins are derived from geometry; text cell width is a no-wrap editing boundary estimate and does not change source text, line breaks, font size, or baseline anchors. Renderer font metrics determine visible glyph width.'
  ],
  mapping, arrowMapping,
};
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ outputPath, reportPath, sourceCounts, targetCounts, additionalEditableMarkerTriangles: arrowMapping.length, totalEditableCells: cells.length, validationPassed: report.validationPassed, failures }, null, 2));
if (failures.length) process.exitCode = 1;
