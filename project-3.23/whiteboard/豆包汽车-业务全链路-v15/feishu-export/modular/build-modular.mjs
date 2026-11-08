import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { JSDOM } from '/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/jsdom/lib/api.js';
const require = createRequire(import.meta.url);
const sharp = require('/Users/bytedance/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const dir = path.dirname(fileURLToPath(import.meta.url));
const base = path.resolve(dir, '../..');
const moduleDir = path.join(dir, 'modules');
fs.mkdirSync(moduleDir, { recursive: true });
const sourcePaths = { graph: path.join(base, 'graph-v15.json'), svg: path.join(base, '业务全链路-v15.svg'), drawio: path.join(base, 'feishu-export/业务全链路-v15.drawio') };
const raw = Object.fromEntries(Object.entries(sourcePaths).map(([k, p]) => [k, fs.readFileSync(p, 'utf8')]));
const sha = s => crypto.createHash('sha256').update(s).digest('hex');
const sourceHashes = Object.fromEntries(Object.entries(raw).map(([k, s]) => [k, sha(s)]));
const graph = JSON.parse(raw.graph);
const parse = (s, contentType = 'application/xml') => new JSDOM(s, { contentType }).window.document;
const svgDoc = parse(raw.svg, 'image/svg+xml');
const nativeDoc = parse(raw.drawio);
const sourceCells = [...nativeDoc.querySelectorAll('mxCell')];
const sourceById = new Map(sourceCells.map(c => [c.id, c]));
const sourceChildren = new Map();
for (const c of sourceCells) sourceChildren.set(c.getAttribute('parent'), [...(sourceChildren.get(c.getAttribute('parent')) || []), c]);
const subtree = c => [c, ...(sourceChildren.get(c.id) || []).flatMap(subtree)];
const attrs = c => JSON.parse(c.getAttribute('sourceAttributes') || '{}');
const nativeGroups = sourceCells.filter(c => c.getAttribute('sourceTag') === 'g');
const frames = new Map(nativeGroups.filter(c => attrs(c).class === 'module-frame').map(c => [attrs(c)['data-module'], c]));
const nodes = new Map(nativeGroups.filter(c => attrs(c).class === 'node').map(c => [attrs(c)['data-node'], c]));
const edges = new Map(nativeGroups.filter(c => (attrs(c).class || '').startsWith('edge ')).map(c => [attrs(c)['data-edge'], c]));
const labels = new Map(nativeGroups.filter(c => attrs(c).class === 'edge-label').map(c => [attrs(c)['data-edge'], c]));
const sourceOrder = new Map(sourceCells.map((c, i) => [c.id, i]));
const n = (e, k) => Number(e?.getAttribute(k) || 0);
const geom = c => [...c.children].find(e => e.tagName === 'mxGeometry');
function absoluteOrigin(cell, map = sourceById) {
  if (!cell || ['0', '1'].includes(cell.id)) return [0, 0];
  const p = absoluteOrigin(map.get(cell.getAttribute('parent')), map), g = geom(cell);
  return [p[0] + n(g, 'x'), p[1] + n(g, 'y')];
}
const close = (a, b) => Math.abs(a - b) < 1e-7;
const htmlDoc = new JSDOM('').window.document;
const html = htmlDoc.createElement('div');
const plainText = value => { html.innerHTML = value; return html.textContent; };
const scaledStyle = (style, scale) => style.split(';').map(part => {
  const i = part.indexOf('='); if (i < 0) return part;
  const key = part.slice(0, i), value = part.slice(i + 1);
  if (['fontSize', 'strokeWidth', 'arcSize', 'lineHeight'].includes(key) && /^-?[\d.]+$/.test(value)) return `${key}=${Number(value) * scale}`;
  if (key === 'dashPattern') return `${key}=${value.split(/\s+/).map(n => Number(n) * scale).join(' ')}`;
  return part;
}).join(';').replace(/([=;])white(?=;|$)/g, '$1#FFFFFF').replace(/([=;])black(?=;|$)/g, '$1#000000');
const scaledHtml = (value, scale) => value.replace(/((?:font-size|line-height)\s*:\s*)(-?[\d.]+)px/g, (_, prefix, value) => `${prefix}${Number(value) * scale}px`);
const nodeModule = new Map(graph.modules.flatMap(m => m.nodes.map(node => [node.id, m.id])));
const nodeById = new Map(graph.modules.flatMap(m => m.nodes.map(node => [node.id, node])));
const edgeRecord = edge => {
  const svg = [...svgDoc.querySelectorAll('g[data-edge]')].find(g => g.getAttribute('data-edge') === edge.id && (g.getAttribute('class') || '').startsWith('edge '));
  const visible = svg?.querySelector('polyline[marker-end]') || svg?.querySelector('polyline');
  const label = [...svgDoc.querySelectorAll('g.edge-label')].find(g => g.getAttribute('data-edge') === edge.id);
  return { ...edge, fromModule: nodeModule.get(edge.from), toModule: nodeModule.get(edge.to), fromNodeTitle: nodeById.get(edge.from)?.title, toNodeTitle: nodeById.get(edge.to)?.title, originalLabelLines: [...(label?.querySelectorAll('tspan') || [])].map(t => t.textContent), originalLineStyle: visible ? Object.fromEntries([...visible.attributes].map(a => [a.name, a.value])) : null };
};
const crossEdges = graph.edges.filter(e => nodeModule.get(e.from) !== nodeModule.get(e.to)).map(edgeRecord);
const failures = [];
const check = (ok, msg) => { if (!ok) failures.push(msg); };
const filenames = { V: '声音成为正式Query', R: '入口与端云采信', I: '多人打断与恢复', W: '可见即可说', M: '输入管理', C: '上下文', D: 'Director决策', E: '工具执行', K: '身份与记忆', F: '能力准入与单Agent协议', T: '任务系统', G: '云端触发器', L: '端侧触发与本地闭环', S: '主动服务', P: '配置平台', A: '视觉感知', H: '静默展示与PHUD', O: '输出与真实结果', B: '信号与状态', U: '任务中心与卡片' };
const requestedOrder = ['V', 'R', 'M', 'C', 'D', 'E', 'O', 'I', 'W', 'F', 'K', 'T', 'G', 'L', 'S', 'P', 'A', 'H', 'B', 'U'];
const modules = [];
const allNodeIds = [];
const allInternalEdgeIds = [];
for (const id of requestedOrder) {
  const module = graph.modules.find(m => m.id === id);
  const nodeIds = new Set(module.nodes.map(n => n.id));
  const internalEdges = graph.edges.filter(e => nodeIds.has(e.from) && nodeIds.has(e.to));
  const internalIds = new Set(internalEdges.map(e => e.id));
  allNodeIds.push(...nodeIds); allInternalEdgeIds.push(...internalIds);
  const roots = [frames.get(id), ...[...nodeIds].map(id => nodes.get(id)), ...internalEdges.flatMap(e => [edges.get(e.id), labels.get(e.id)])].sort((a, b) => sourceOrder.get(a.id) - sourceOrder.get(b.id));
  check(roots.every(Boolean), `Missing native semantic group for ${id}`);
  const selectedCells = roots.flatMap(subtree);
  check(new Set(selectedCells.map(c => c.id)).size === selectedCells.length, `Duplicate native selection: ${id}`);
  const selectedSet = new Set(selectedCells.map(c => c.id));
  const rootSet = new Set(roots.map(c => c.id));
  const edgePoints = internalEdges.flatMap(e => e.points || []);
  const boxes = internalEdges.map(e => e.labelBox).filter(Boolean);
  const minX = Math.min(module.x, ...edgePoints.map(p => p[0]), ...boxes.map(b => b.x));
  const maxX = Math.max(module.x + module.w, ...edgePoints.map(p => p[0]), ...boxes.map(b => b.x + b.w));
  const minY = Math.min(module.y, ...edgePoints.map(p => p[1]), ...boxes.map(b => b.y));
  const contentMaxY = Math.max(...module.nodes.map(n => n.y + n.h), ...edgePoints.map(p => p[1]), ...boxes.map(b => b.y + b.h));
  const frameHeight = contentMaxY - module.y + 80;
  const bounds = { x: minX - 40, y: minY - 40, width: maxX - minX + 80, height: module.y + frameHeight + 40 - (minY - 40) };
  const scale = 1600 / bounds.width;
  const outputHeight = bounds.height * scale;
  const copies = selectedCells.map(original => {
    const c = original.cloneNode(true), g = geom(c);
    for (const attr of [...c.attributes]) if (attr.name.startsWith('source')) c.removeAttribute(attr.name);
    let style = scaledStyle(c.getAttribute('style') || '', scale);
    if (style.startsWith('group;')) style += 'fillColor=none;strokeColor=none;strokeWidth=0;';
    c.setAttribute('style', style);
    if (c.hasAttribute('value')) c.setAttribute('value', scaledHtml(c.getAttribute('value'), scale));
    for (const element of [g, ...g.querySelectorAll('mxPoint')]) for (const key of ['x', 'y', 'width', 'height']) if (element.hasAttribute(key)) element.setAttribute(key, String(n(element, key) * scale));
    if (rootSet.has(c.id)) {
      const p = absoluteOrigin(original);
      c.setAttribute('parent', '1');
      g.setAttribute('x', String((p[0] - bounds.x) * scale));
      g.setAttribute('y', String((p[1] - bounds.y) * scale));
    }
    if (c.id === frames.get(id).id) g.setAttribute('height', String(frameHeight * scale));
    if (original.getAttribute('parent') === frames.get(id).id && original.getAttribute('sourceTag') === 'rect' && n(geom(original), 'height') === module.h) g.setAttribute('height', String(frameHeight * scale));
    return c;
  });
  const stem = `${id}-${filenames[id]}`;
  const background = `<mxCell id="${id}-background" parent="1" vertex="1" value="" style="shape=rectangle;fillColor=#F8FAFD;strokeColor=none;"><mxGeometry x="0" y="0" width="1600" height="${outputHeight}" as="geometry"/></mxCell>`;
  const model = `<mxGraphModel grid="0" page="0" background="#F8FAFD"><root><mxCell id="0"/><mxCell id="1" parent="0"/>${background}${copies.map(c => c.outerHTML).join('')}</root></mxGraphModel>`;
  const drawio = `<mxfile host="app.diagrams.net"><diagram id="v15-module-${id}" name="${id} ${module.title}">${zlib.deflateRawSync(Buffer.from(encodeURIComponent(model))).toString('base64')}</diagram></mxfile>`;
  const drawioPath = path.join(moduleDir, `${stem}.drawio`); fs.writeFileSync(drawioPath, drawio);
  const selectedSvg = [...svgDoc.querySelectorAll('g')].filter(g => g.getAttribute('data-module') === id || nodeIds.has(g.getAttribute('data-node')) || internalIds.has(g.getAttribute('data-edge'))).map(g => g.cloneNode(true));
  const frame = selectedSvg.find(g => g.getAttribute('data-module') === id); frame.querySelector('rect').setAttribute('height', String(frameHeight));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="${outputHeight}" viewBox="${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}" font-family="-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif">${svgDoc.querySelector('defs').outerHTML}<rect x="${bounds.x}" y="${bounds.y}" width="${bounds.width}" height="${bounds.height}" fill="#F8FAFD"/>${selectedSvg.map(g => g.outerHTML).join('')}</svg>`;
  const svgPath = path.join(moduleDir, `${stem}.svg`), pngPath = path.join(moduleDir, `${stem}.png`); fs.writeFileSync(svgPath, svg);
  const pngInfo = await sharp(Buffer.from(svg), { limitInputPixels: 16000000 }).png().toFile(pngPath);

  // Independent decompression/readback, matching every original selected cell.
  const envelope = parse(fs.readFileSync(drawioPath, 'utf8'));
  const readDoc = parse(decodeURIComponent(zlib.inflateRawSync(Buffer.from(envelope.querySelector('diagram').textContent, 'base64')).toString('utf8')));
  const readMap = new Map([...readDoc.querySelectorAll('mxCell')].map(c => [c.id, c]));
  let textLines = 0;
  for (const original of selectedCells) {
    const c = readMap.get(original.id), g = geom(c), oldG = geom(original), actualOrigin = absoluteOrigin(c, readMap), expectedOrigin = absoluteOrigin(original);
    check(!!c, `Missing selected source cell ${id}/${original.id}`);
    check(close(actualOrigin[0], (expectedOrigin[0] - bounds.x) * scale) && close(actualOrigin[1], (expectedOrigin[1] - bounds.y) * scale), `Scaled absolute position differs ${id}/${original.id}`);
    check(close(n(g, 'width'), n(oldG, 'width') * scale), `Scaled width differs ${id}/${original.id}`);
    const frameHeightException = original.id === frames.get(id).id || original.getAttribute('parent') === frames.get(id).id && original.getAttribute('sourceTag') === 'rect' && n(oldG, 'height') === module.h;
    check(close(n(g, 'height'), (frameHeightException ? frameHeight : n(oldG, 'height')) * scale), `Scaled height differs ${id}/${original.id}`);
    const parent = rootSet.has(original.id) ? '1' : original.getAttribute('parent');
    check(c.getAttribute('parent') === parent, `Business group hierarchy differs ${id}/${original.id}`);
    let expectedStyle = scaledStyle(original.getAttribute('style') || '', scale); if (expectedStyle.startsWith('group;')) expectedStyle += 'fillColor=none;strokeColor=none;strokeWidth=0;';
    check(c.getAttribute('style') === expectedStyle, `Style/font/weight/color/line-width differs ${id}/${original.id}`);
    if (original.hasAttribute('value')) check(c.getAttribute('value') === scaledHtml(original.getAttribute('value'), scale), `HTML text or span style differs ${id}/${original.id}`);
    if (original.getAttribute('sourceTag') === 'tspan') {
      textLines++;
      check(plainText(c.getAttribute('value')) === plainText(original.getAttribute('value')), `Original string differs ${id}/${original.id}`);
    }
    const oldPoints = [...oldG.querySelectorAll('mxPoint')], newPoints = [...g.querySelectorAll('mxPoint')];
    check(oldPoints.length === newPoints.length, `Line point count differs ${id}/${original.id}`);
    check(oldPoints.every((p, i) => close(n(newPoints[i], 'x'), n(p, 'x') * scale) && close(n(newPoints[i], 'y'), n(p, 'y') * scale) && p.getAttribute('as') === newPoints[i].getAttribute('as')), `Internal path differs ${id}/${original.id}`);
  }
  const sourceSvgTexts = selectedSvg.flatMap(g => [...g.querySelectorAll('tspan')]).map(t => t.textContent);
  const sourceNativeTexts = selectedCells.filter(c => c.getAttribute('sourceTag') === 'tspan').map(c => plainText(c.getAttribute('value')));
  check(JSON.stringify(sourceSvgTexts) === JSON.stringify(sourceNativeTexts), `SVG/native text coverage differs ${id}`);
  check([...readMap.keys()].filter(id => !['0', '1', `${module.id}-background`].includes(id)).every(id => selectedSet.has(id)), `Extraneous source node/crossmodule line imported: ${id}`);
  check(!/shape=image|data:image|<image/.test(model), `Embedded raster/SVG masquerading as native elements: ${id}`);
  const incoming = crossEdges.filter(e => e.toModule === id), outgoing = crossEdges.filter(e => e.fromModule === id);
  const result = { id, title: module.title, subtitle: module.subtitle, files: { drawio: drawioPath, png: pngPath, svg: svgPath }, sourceModuleBounds: { x: module.x, y: module.y, width: module.w, height: module.h }, selectedSourceBounds: bounds, translationBeforeScaling: { x: -bounds.x, y: -bounds.y }, scale, outputPixels: { width: pngInfo.width, height: pngInfo.height }, originalBody25pxScaledTo: 25 * scale, originalNodeIds: [...nodeIds], internalEdgeIds: [...internalIds], originalCellIds: selectedCells.map(c => c.id), sourceNativeCellCount: selectedCells.length, addedBackgroundCells: 1, nativeEditableCellCount: selectedCells.length + 1, originalTextLineCount: textLines, frameBottomWhitespaceTrim: { originalHeight: module.h, newHeight: frameHeight, originalNodeAndLineCoordinatesUnchangedBeforeUniformTransform: true }, incoming, outgoing };
  modules.push(result);
  console.log(JSON.stringify({ module: id, nodes: nodeIds.size, edges: internalIds.size, textLines, nativeCells: copies.length + 1, png: [pngInfo.width, pngInfo.height] }));
}
check(allNodeIds.length === 291 && new Set(allNodeIds).size === 291, 'Not all original 291 business nodes covered exactly once');
check(new Set([...allInternalEdgeIds, ...crossEdges.map(e => e.id)]).size === graph.edges.length, 'Original graph relationships not fully represented');
check(allInternalEdgeIds.length + crossEdges.length === 459, 'Edge coverage count differs');
for (const [key, p] of Object.entries(sourcePaths)) check(sha(fs.readFileSync(p, 'utf8')) === sourceHashes[key], `Source file modified: ${p}`);
const sources = new Map(graph.sources.map(s => [s.id, s]));
const docGuide = {
  title: graph.title, version: graph.version, baseline: graph.baseline,
  readingOrder: requestedOrder,
  statusBoundary: '以下业务原文直接保留v15资料状态。历史、弃用、方案、待核验与渠道差异均保持原文，不代表当前全部车型线上能力。',
  modules: modules.map(result => {
    const m = graph.modules.find(m => m.id === result.id), sourceIds = [...new Set([...(m.sourceIds || []), ...m.nodes.flatMap(n => n.sourceIds || [])])];
    return { id: m.id, title: m.title, subtitle: m.subtitle, files: result.files, nodes: m.nodes, questions: m.questions, metrics: m.metrics, sourceIds, sourceEntries: sourceIds.map(id => sources.get(id) || { id, unresolved: true }), incoming: result.incoming, outgoing: result.outgoing, upstreamSummary: result.incoming.map(e => `${e.fromModule} · ${e.fromNodeTitle} → ${e.toNodeTitle}：${e.label}`), downstreamSummary: result.outgoing.map(e => `${e.fromNodeTitle} → ${e.toModule} · ${e.toNodeTitle}：${e.label}`) };
  }),
  toolDetails: path.join(dir, 'tools/tools-detail.md'), toolCountExplanation: graph.toolCountExplanation, toolCounts: graph.toolCounts, criticalUnknowns: graph.criticalUnknowns,
};
const manifest = { title: graph.title, sourcePaths, sourceHashes, layout: 'Semantic extraction, not global geometric cropping. Original three-column node layouts and internal routes are translated and uniformly scaled to 1600px canvas width. Only the module frame trailing blank height is trimmed. Explicit internal-label spill margins are retained. Original per-line native text is used, without multiline merging.', modules, crossModuleRelationships: crossEdges, relationshipCoverage: { originalEdges: graph.edges.length, retainedInternalEdges: allInternalEdgeIds.length, movedToExplicitHandoffManifest: crossEdges.length, allSourceEdgesRepresentedExactlyOnce: failures.length === 0 }, sources: graph.sources, toolDetails: 'tools/tools-detail.md', limitations: ['PNG images are source SVG semantic previews, not proof of Feishu import or persistence.', 'Native Draw.io rendering and font substitution in Feishu require live acceptance. The importer can translate/scale content.', 'Long cross-module lines are intentionally removed only from module canvases; their exact labels, rendered lines, source endpoints, types, original paths and line styles remain in the manifest and per-module incoming/outgoing lists.', 'Pure global connections/labels wrapper groups are omitted during semantic extraction; original business/card and per-edge/per-label groups are retained. Root groups are reparented with explicit original absolute coordinates before the uniform transform.', 'Original graph/title/tool-count/status source text is retained in doc-guide.json and tools-detail.md; it is not rewritten as currently deployed capability.'] };
const validation = { sourceHashes, localValidationPassed: failures.length === 0, failures, businessNodesExactlyOnce: allNodeIds.length, nativeTextLineCellsCompared: modules.reduce((s, m) => s + m.originalTextLineCount, 0), nativeEditableCells: modules.reduce((s, m) => s + m.nativeEditableCellCount, 0), retainedInternalEdges: allInternalEdgeIds.length, crossModuleRelationshipsPreservedInManifest: crossEdges.length, originalEdgeTotal: graph.edges.length, moduleCount: modules.length, originalNodeTextAndMetadataInDocGuide: graph.modules.reduce((s, m) => s + m.nodes.length, 0), transformationsChecked: ['Every selected original cell ID', 'Every original HTML span and text string', 'Absolute x/y under one uniform transform per module', 'Widths/heights except explicit frame blank-space trim', 'Font size, numeric weight, colors, stroke widths, dash patterns, corner radii', 'Every original internal edge control point and arrowhead cell', 'Original business/card and edge/label group hierarchy', 'SVG/native text sequence coverage', 'No other module nodes or crossmodule long edge cells included', 'All 459 original relationships retained on-module or in manifest'], feishuOnlineImportVerified: false, perModule: modules.map(m => ({ id: m.id, nodes: m.originalNodeIds.length, internalEdges: m.internalEdgeIds.length, textLines: m.originalTextLineCount, nativeCells: m.nativeEditableCellCount, scale: m.scale, outputPixels: m.outputPixels })), sourcesUnchanged: true };
fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(manifest, null, 2));
fs.writeFileSync(path.join(dir, 'doc-guide.json'), JSON.stringify(docGuide, null, 2));
fs.writeFileSync(path.join(dir, 'modular-validation.json'), JSON.stringify(validation, null, 2));
console.log(JSON.stringify({ complete: true, validation }, null, 2));
if (failures.length) process.exitCode = 1;
