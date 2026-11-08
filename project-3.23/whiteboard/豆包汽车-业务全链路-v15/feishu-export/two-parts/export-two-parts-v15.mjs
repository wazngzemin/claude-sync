import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { JSDOM } from '/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/jsdom/lib/api.js';

const dir = path.dirname(fileURLToPath(import.meta.url));
const sourcePath = path.resolve(dir, '../业务全链路-v15.drawio');
const sourceRaw = fs.readFileSync(sourcePath, 'utf8');
const sourceSvgPath = path.resolve(dir, '../../业务全链路-v15.svg');
const sourceSvgRaw = fs.readFileSync(sourceSvgPath, 'utf8');
const parse = raw => new JSDOM(raw, { contentType: 'application/xml' }).window.document;
const sourceDoc = parse(sourceRaw);
const all = [...sourceDoc.querySelectorAll('mxCell')];
const cells = all.filter(c => !['0', '1'].includes(c.id));
const byId = new Map(all.map(c => [c.id, c]));
const cut = 21450;
const canvas = { width: 13700, height: 48466 };
const failures = [];
const check = (ok, msg) => { if (!ok) failures.push(msg); };
const n = (e, k) => Number(e?.getAttribute(k) || 0);
const geom = c => [...c.children].find(e => e.tagName === 'mxGeometry');
const isGroup = c => (c.getAttribute('style') || '').startsWith('group;');
const canonical = e => ({ tag: e.tagName, attrs: Object.fromEntries([...e.attributes].map(a => [a.name, a.value]).sort(([a], [b]) => a.localeCompare(b))), children: [...e.childNodes].filter(c => c.nodeType === 1 || c.nodeType === 3 && c.textContent.trim()).map(c => c.nodeType === 1 ? canonical(c) : c.textContent) });
const hash = raw => crypto.createHash('sha256').update(raw).digest('hex');
const close = (a, b) => Math.abs(a - b) < 1e-7;
const ptClose = (a, b) => close(a[0], b[0]) && close(a[1], b[1]);
function origin(c, map = byId) {
  if (!c || ['0', '1'].includes(c.id)) return [0, 0];
  const p = origin(map.get(c.getAttribute('parent')), map), g = geom(c);
  return [p[0] + n(g, 'x'), p[1] + n(g, 'y')];
}
function normalize(original) {
  const c = original.cloneNode(true);
  for (const a of [...c.attributes]) if (a.name.startsWith('source')) c.removeAttribute(a.name);
  let style = c.getAttribute('style') || '';
  style = style.replace(/([=;])white(?=;|$)/g, '$1#FFFFFF').replace(/([=;])black(?=;|$)/g, '$1#000000');
  if (isGroup(c)) style += 'fillColor=none;strokeColor=none;strokeWidth=0;';
  c.setAttribute('style', style);
  return c;
}
function points(c, map = byId) {
  const g = geom(c), p = origin(map.get(c.getAttribute('parent')), map);
  return [g.querySelector('mxPoint[as="sourcePoint"]'), ...g.querySelectorAll('Array[as="points"] > mxPoint'), g.querySelector('mxPoint[as="targetPoint"]')].map(q => [n(q, 'x') + p[0], n(q, 'y') + p[1]]);
}
function lengths(pts) {
  const result = [0];
  for (let i = 1; i < pts.length; i++) result.push(result.at(-1) + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return result;
}
function atDistance(pts, cum, d) {
  if (d <= 0) return [...pts[0]];
  if (d >= cum.at(-1)) return [...pts.at(-1)];
  let i = 1;
  while (cum[i] < d) i++;
  const ratio = (d - cum[i - 1]) / (cum[i] - cum[i - 1]);
  return [pts[i - 1][0] + ratio * (pts[i][0] - pts[i - 1][0]), pts[i - 1][1] + ratio * (pts[i][1] - pts[i - 1][1])];
}
function subpath(pts, cum, start, end) {
  return [atDistance(pts, cum, start), ...pts.filter((p, i) => cum[i] > start && cum[i] < end), atDistance(pts, cum, end)];
}
function geometryForPoints(original, pts) {
  const p = origin(byId.get(original.getAttribute('parent')));
  const g = sourceDoc.createElement('mxGeometry'); g.setAttribute('relative', '1'); g.setAttribute('as', 'geometry');
  const point = (q, as) => { const e = sourceDoc.createElement('mxPoint'); e.setAttribute('x', String(q[0] - p[0])); e.setAttribute('y', String(q[1] - p[1])); if (as) e.setAttribute('as', as); return e; };
  g.appendChild(point(pts[0], 'sourcePoint')); g.appendChild(point(pts.at(-1), 'targetPoint'));
  if (pts.length > 2) { const array = sourceDoc.createElement('Array'); array.setAttribute('as', 'points'); for (const q of pts.slice(1, -1)) array.appendChild(point(q)); g.appendChild(array); }
  return g;
}
function setStyle(c, key, value) {
  const entries = (c.getAttribute('style') || '').split(';').filter(Boolean).filter(s => !s.startsWith(`${key}=`));
  entries.push(`${key}=${value}`); c.setAttribute('style', `${entries.join(';')};`);
}
const emissions = new Map();
const mapping = [];
const crossedEdges = [];
const dashRestorations = [];
for (const original of cells) {
  if (isGroup(original)) continue;
  const g = geom(original), parentOrigin = origin(byId.get(original.getAttribute('parent')));
  const outputs = [];
  if (original.getAttribute('edge') === '1') {
    const pts = points(original), cum = lengths(pts), total = cum.at(-1);
    const intersections = [];
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i];
      if ((a[1] - cut) * (b[1] - cut) < 0) intersections.push(cum[i - 1] + (cum[i] - cum[i - 1]) * Math.abs((cut - a[1]) / (b[1] - a[1])));
    }
    if (!intersections.length) {
      const side = pts.every(p => p[1] <= cut) ? 0 : 1;
      check(pts.every(p => side === 0 ? p[1] <= cut : p[1] >= cut), `Unsplit edge crosses boundary: ${original.id}`);
      outputs.push({ side, cell: normalize(original), range: [0, total], mode: 'original' });
    } else {
      crossedEdges.push({ sourceCellId: original.id, intersections: intersections.map(d => ({ distance: d, point: atDistance(pts, cum, d) })), originalPoints: pts, totalLength: total });
      const stops = [0, ...intersections, total];
      let pieceIndex = 0;
      const dashed = /(?:^|;)dashed=1;/.test(original.getAttribute('style'));
      if (dashed) check(/fixDash=1;/.test(original.getAttribute('style')) && /dashPattern=10 8;/.test(original.getAttribute('style')), `Unsupported dash pattern: ${original.id}`);
      for (let i = 1; i < stops.length; i++) {
        const start = stops[i - 1], end = stops[i], side = atDistance(pts, cum, (start + end) / 2)[1] < cut ? 0 : 1;
        const intervals = [];
        let cursor = start;
        // Preserve the original 10-on/8-off dash phase at a newly cut start.
        // Short partial-dash/gap pieces occupy exactly their original path.
        if (dashed && start > 0) {
          let phase = start % 18;
          if (close(phase, 18)) phase = 0;
          if (phase > 0) {
            const phaseReport = { sourceCellId: original.id, cutDistance: start, phase, side, prefixPieces: [] };
            if (phase < 10) { const stop = Math.min(end, cursor + 10 - phase); intervals.push({ start: cursor, end: stop, mode: 'partial-dash' }); phaseReport.prefixPieces.push({ mode: 'partial-dash', start: cursor, end: stop }); cursor = stop; phase = 10; }
            if (cursor < end) { const stop = Math.min(end, cursor + 18 - phase); intervals.push({ start: cursor, end: stop, mode: 'original-dash-gap' }); phaseReport.prefixPieces.push({ mode: 'original-dash-gap', start: cursor, end: stop }); cursor = stop; }
            dashRestorations.push(phaseReport);
          }
        }
        if (cursor < end) intervals.push({ start: cursor, end, mode: 'original' });
        for (const interval of intervals) {
          const c = normalize(original);
          c.setAttribute('id', `${original.id}__part${side + 1}_${++pieceIndex}`);
          c.replaceChild(geometryForPoints(original, subpath(pts, cum, interval.start, interval.end)), geom(c));
          if (interval.mode === 'partial-dash') setStyle(c, 'dashed', '0');
          if (interval.mode === 'original-dash-gap') setStyle(c, 'strokeColor', 'none');
          outputs.push({ side, cell: c, range: [interval.start, interval.end], mode: interval.mode });
        }
      }
    }
  } else {
    const y = parentOrigin[1] + n(g, 'y'), end = y + n(g, 'height');
    if (y < cut && end > cut) {
      check(original.id === 'v15_1' && /strokeColor=none;/.test(original.getAttribute('style')), `Visible vertex intersects cut: ${original.id}`);
      for (const side of [0, 1]) {
        const c = normalize(original), cg = geom(c), top = side === 0 ? y : cut, bottom = side === 0 ? cut : end;
        c.setAttribute('id', `${original.id}__part${side + 1}`);
        cg.setAttribute('y', String(top - parentOrigin[1])); cg.setAttribute('height', String(bottom - top));
        outputs.push({ side, cell: c, mode: 'background-crop' });
      }
    } else outputs.push({ side: end <= cut ? 0 : 1, cell: normalize(original), mode: 'original' });
  }
  emissions.set(original.id, outputs);
  mapping.push({ sourceCellId: original.id, sourceTag: original.getAttribute('sourceTag'), fragments: outputs.map(({ side, cell, range, mode }) => ({ part: side + 1, targetCellId: cell.id, range, mode })) });
}
const presence = new Map(cells.map(c => [c.id, new Set()]));
for (const [id, outputs] of emissions) for (const { side } of outputs) {
  let c = byId.get(id);
  while (c && c.id !== '1' && c.id !== '0') { presence.get(c.id)?.add(side); c = byId.get(c.getAttribute('parent')); }
}
const outputParts = [[], []];
const structuralGroups = [];
for (const original of cells) {
  if (isGroup(original)) {
    const sides = [...presence.get(original.id)];
    check(sides.length > 0, `Original group has no retained descendants: ${original.id}`);
    for (const side of sides) outputParts[side].push(normalize(original));
    structuralGroups.push({ sourceCellId: original.id, parts: sides.map(s => s + 1), repeatedPureStructure: sides.length === 2 });
  } else for (const e of emissions.get(original.id)) outputParts[e.side].push(e.cell);
}
if (failures.length) throw new Error(failures.join('\n'));
const files = [];
for (const [side, result] of outputParts.entries()) {
  const name = side === 0 ? '业务全链路-v15-上半.drawio' : '业务全链路-v15-下半.drawio';
  const model = `<mxGraphModel grid="0" page="0" background="#F8FAFD" pageWidth="13700" pageHeight="48466"><root><mxCell id="0"/><mxCell id="1" parent="0"/>${result.map(c => c.outerHTML).join('')}</root></mxGraphModel>`;
  const raw = `<mxfile host="app.diagrams.net"><diagram id="v15-part-${side + 1}" name="v15 ${side === 0 ? '上半' : '下半'} 原坐标">${zlib.deflateRawSync(Buffer.from(encodeURIComponent(model))).toString('base64')}</diagram></mxfile>`;
  fs.writeFileSync(path.join(dir, name), raw);
  files.push({ file: name, path: path.join(dir, name), bytes: Buffer.byteLength(raw), sha256: hash(raw), editableCellsExcludingScaffolds: result.length, originalSourceCellsRepresented: cells.filter(c => presence.get(c.id).has(side)).length, originalTextLineCells: result.filter(c => /^text;/.test(c.getAttribute('style') || '')).length });
}

// Read each actual output back and reconstruct original geometry and path.
const docs = files.map(f => {
  const envelope = parse(fs.readFileSync(f.path, 'utf8'));
  return parse(decodeURIComponent(zlib.inflateRawSync(Buffer.from(envelope.querySelector('diagram').textContent, 'base64')).toString('utf8')));
});
const targetMaps = docs.map(d => new Map([...d.querySelectorAll('mxCell')].map(c => [c.id, c])));
let textLineChecks = 0, originalVertexChecks = 0, originalEdgeChecks = 0;
const dashChecks = [];
for (const original of cells) {
  if (isGroup(original)) {
    for (const side of presence.get(original.id)) check(JSON.stringify(canonical(targetMaps[side].get(original.id))) === JSON.stringify(canonical(normalize(original))), `Structural group differs: ${original.id}`);
    continue;
  }
  const outputs = emissions.get(original.id);
  if (original.getAttribute('edge') === '1') {
    originalEdgeChecks++;
    const sourcePts = points(original), sourceCum = lengths(sourcePts), total = sourceCum.at(-1);
    const intervals = [];
    for (const e of outputs) {
      const c = targetMaps[e.side].get(e.cell.id), actual = points(c, targetMaps[e.side]), expected = subpath(sourcePts, sourceCum, ...e.range);
      if (e.cell.id === original.id) check(JSON.stringify(canonical(c)) === JSON.stringify(canonical(normalize(original))), `Uncut edge differs: ${original.id}`);
      else {
        check(actual.length === expected.length && actual.every((p, i) => ptClose(p, expected[i])), `Fragment path differs: ${c.id}`);
        const expectedStyle = normalize(original);
        if (e.mode === 'partial-dash') setStyle(expectedStyle, 'dashed', '0');
        if (e.mode === 'original-dash-gap') setStyle(expectedStyle, 'strokeColor', 'none');
        check(c.getAttribute('style') === expectedStyle.getAttribute('style'), `Fragment paint style differs: ${c.id}`);
        const restored = c.cloneNode(true); restored.setAttribute('id', original.id); restored.replaceChild(geom(normalize(original)).cloneNode(true), geom(restored));
        if (e.mode === 'partial-dash') restored.setAttribute('style', normalize(original).getAttribute('style'));
        if (e.mode === 'original-dash-gap') restored.setAttribute('style', normalize(original).getAttribute('style'));
        check(JSON.stringify(canonical(restored)) === JSON.stringify(canonical(normalize(original))), `Fragment nongeometry attributes differ: ${c.id}`);
      }
      check(actual.every(p => e.side === 0 ? p[1] <= cut + 1e-7 : p[1] >= cut - 1e-7), `Fragment outside its half: ${c.id}`);
      intervals.push(e.range);
      if (/dashed=1;/.test(original.getAttribute('style'))) {
        const [start, end] = e.range;
        if (e.mode === 'original') check(close(start % 18, 0) || start === 0, `Dash cycle restart differs: ${c.id}`);
        else if (e.mode === 'partial-dash') check(start % 18 < 10 && end - start <= 10 - start % 18 + 1e-7, `Partial dash ink differs: ${c.id}`);
        else if (e.mode === 'original-dash-gap') check(start % 18 >= 10 && end - start <= 18 - start % 18 + 1e-7, `Original dash gap differs: ${c.id}`);
        dashChecks.push({ sourceCellId: original.id, targetCellId: c.id, range: e.range, mode: e.mode });
      }
    }
    intervals.sort((a, b) => a[0] - b[0]);
    check(close(intervals[0][0], 0) && close(intervals.at(-1)[1], total) && intervals.slice(1).every((r, i) => close(r[0], intervals[i][1])), `Original path coverage gap/overlap: ${original.id}`);
  } else if (outputs[0].mode === 'background-crop') {
    const a = targetMaps[0].get(outputs[0].cell.id), b = targetMaps[1].get(outputs[1].cell.id);
    check(n(geom(a), 'y') === 0 && n(geom(a), 'height') === cut && n(geom(b), 'y') === cut && n(geom(b), 'height') === canvas.height - cut, 'Background coverage differs');
    check([a, b].every(c => n(geom(c), 'x') === 0 && n(geom(c), 'width') === canvas.width), 'Background horizontal coverage differs');
    for (const c of [a, b]) { const restored = c.cloneNode(true); restored.setAttribute('id', original.id); restored.replaceChild(geom(normalize(original)).cloneNode(true), geom(restored)); check(JSON.stringify(canonical(restored)) === JSON.stringify(canonical(normalize(original))), 'Background paint differs'); }
  } else {
    check(outputs.length === 1, `Original vertex duplicated: ${original.id}`);
    const e = outputs[0], c = targetMaps[e.side].get(e.cell.id);
    check(JSON.stringify(canonical(c)) === JSON.stringify(canonical(normalize(original))), `Original vertex/text differs: ${original.id}`);
    const expectedOrigin = origin(original), actualOrigin = origin(c, targetMaps[e.side]);
    check(ptClose(actualOrigin, expectedOrigin), `Original absolute coordinate differs: ${original.id}`);
    originalVertexChecks++;
    if (original.hasAttribute('sourceTextIndex')) textLineChecks++;
  }
}
for (const [side, doc] of docs.entries()) {
  const actual = [...doc.querySelectorAll('mxCell')].filter(c => !['0', '1'].includes(c.id));
  check(actual.length === outputParts[side].length, `Part cell count differs: ${side + 1}`);
  check(new Set(actual.map(c => c.id)).size === actual.length, `Duplicate target ID: part ${side + 1}`);
  check(JSON.stringify(actual.map(c => c.id)) === JSON.stringify(outputParts[side].map(c => c.id)), `Paint order differs: part ${side + 1}`);
  check(actual.every(c => c.getAttribute('parent') === '1' || targetMaps[side].has(c.getAttribute('parent'))), `Missing parent group: part ${side + 1}`);
  check(actual.length < 6000, `Part exceeds target 6000: ${side + 1}`);
  check(!/shape=image|data:image|<image/.test(doc.documentElement.outerHTML), `Embedded image detected: part ${side + 1}`);
}
check(textLineChecks === 4775, 'Not all original 4775 native single-line text cells checked');
check(originalEdgeChecks === 1349, 'Not all original 1349 edge paths checked');
const moduleBoundaries = cells.filter(c => c.getAttribute('sourceTag') === 'g' && JSON.parse(c.getAttribute('sourceAttributes') || '{}').class === 'module-frame').map(c => { const a = JSON.parse(c.getAttribute('sourceAttributes')), p = origin(c), g = geom(c); return { module: a['data-module'], y: p[1], endY: p[1] + n(g, 'height') }; });
const report = {
  sourcePath, sourceSha256: hash(sourceRaw), sourceSvgPath, sourceSvgSha256: hash(sourceSvgRaw), sourceSvgMatchesPreviouslyKnownPrefix99e4060: hash(sourceSvgRaw).startsWith('99e4060'), sourceOriginalCellCount: cells.length,
  cut: { y: cut, noVisibleCardOrTextIntersectsCut: true, safeGap: [21406, 21508.4], canvas, absoluteCoordinatesRetainedInBothParts: true, lowerPartCoordinatesAreNotTranslated: true },
  moduleBoundaries, files,
  result: { localValidationPassed: failures.length === 0, failures, sourceCellsRepresented: presence.size, allOriginalTextLinesPreservedExactlyOnce: textLineChecks === 4775, nativeSingleLineTextCellsCompared: textLineChecks, originalNontextVerticesComparedUnchanged: originalVertexChecks - textLineChecks, originalEdgePathsReconstructed: originalEdgeChecks, edgePathsCrossingCut: crossedEdges.length, splitDashPathsRequiringPhaseRecovery: dashRestorations.length, repeatedPureStructuralGroups: structuralGroups.filter(g => g.repeatedPureStructure).length, backgroundCoverageReconstructed: true, originalPainterOrderWithinEachHalfPreserved: true, originalColorsWidthsTextValuesFontsAndWeightsRetained: true, noNewVisibleArrowsOrSeamBorders: true, noEmbeddedImages: true },
  structuralGroups, sourceToFragments: mapping, crossedEdges, dashPhaseRestorations: dashRestorations, dashPhaseChecks: dashChecks,
  representationNotes: [
    'The horizontal cut is y=21450. Original coordinates are unchanged in both files, including the lower half retaining y>=21450.',
    'Every original single-line native text cell is retained exactly once with complete original HTML span, font size, numeric font weight, color, parent group and geometry. No multiline merging is used.',
    'Original structural groups needed in both halves are copied as pure transparent structure with their original full geometry. These are excluded from content-duplication counts; no original group is deleted.',
    'Background is the original stroke-free #F8FAFD rectangle split into two adjacent rectangles. No visible border is drawn at the seam.',
    'Crossing edges are split exactly on their original straight segments. Arrowhead triangles remain unchanged solely in the half containing the original endpoint; no arrow is added at the seam.',
    'Three crossing 10-on/8-off dashed paths begin their new fragment midcycle. A short original partial-dash segment and/or an invisible original gap segment preserves the exact dash phase before the unchanged dashed path resumes at its original cycle boundary. All path intervals remain covered with zero overlap or missing length.',
    'Only nonrendering source* metadata is omitted, white/black style colors are normalized to their exact hex equivalents, and groups are explicitly transparent as in the successfully imported original batches.',
    'The two compressed Draw.io files include no temporary outer group or alignment anchor. They contain editable native text, rectangles, groups, edges and triangle arrowheads.'
  ],
  limitations: [
    'This is a local file/source reconstruction validation. It is not a confirmation of successful Feishu import, accurate Feishu rendering, native editability in Feishu, or live two-board alignment.',
    'Feishu may translate the imported content, replace fonts, normalize numeric font weights, ignore dash settings, or change grouping. These require live acceptance; no browser was used for this export.',
    'The original Draw.io conversion already used estimated text editing widths and baseline geometry. This export retains that source exactly rather than claiming new pixel identity to the original SVG.',
    'Reassembly equivalence is in the shared original coordinate system. The importer must not introduce unaccounted translation or scaling when presenting the two halves.',
    'Separate boards show partial cross-boundary lines. Only recombining the upper and lower halves at the original y=21450 boundary reconstructs those complete paths.'
  ],
};
fs.writeFileSync(path.join(dir, 'two-parts-validation.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ files, result: report.result, report: path.join(dir, 'two-parts-validation.json') }, null, 2));
if (failures.length) process.exitCode = 1;
