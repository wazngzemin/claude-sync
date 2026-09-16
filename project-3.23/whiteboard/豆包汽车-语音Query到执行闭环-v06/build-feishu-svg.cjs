const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom');

const input = process.argv[2];
const output = process.argv[3];
if (!input || !output) {
  throw new Error('Usage: node build-feishu-svg.cjs <input.html> <output.svg>');
}

const html = fs.readFileSync(input, 'utf8');
const virtualConsole = new VirtualConsole();
virtualConsole.on('jsdomError', (error) => {
  if (!String(error.message).includes('Not implemented')) throw error;
});

const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  url: 'https://local.invalid/diagram',
  virtualConsole,
  beforeParse(window) {
    window.requestAnimationFrame = (callback) => callback(Date.now());
    window.cancelAnimationFrame = () => {};
    window.HTMLElement.prototype.scrollTo = () => {};
  },
});

const { document } = dom.window;
const NS = 'http://www.w3.org/2000/svg';
const svg = document.getElementById('diagram');
if (!svg || !svg.dataset.qa) throw new Error('The source diagram did not render');

const qa = JSON.parse(svg.dataset.qa);
if (qa.duplicates.length || qa.missingTools.length || qa.extraTools.length || qa.nonOrthogonal.length || qa.toolCount !== 27) {
  throw new Error(`Source invariant failed: ${JSON.stringify(qa)}`);
}

function toHex(value) {
  if (!value) return value;
  if (value === 'none' || value.startsWith('url(') || value.startsWith('#')) return value;
  const match = value.match(/^rgba?\(\s*(\d+)\D+(\d+)\D+(\d+)/i);
  if (!match) return value;
  return `#${[match[1], match[2], match[3]].map((part) => Number(part).toString(16).padStart(2, '0')).join('').toUpperCase()}`;
}

const presentation = [
  ['fill', 'fill'],
  ['stroke', 'stroke'],
  ['stroke-width', 'strokeWidth'],
  ['stroke-dasharray', 'strokeDasharray'],
  ['stroke-linecap', 'strokeLinecap'],
  ['stroke-linejoin', 'strokeLinejoin'],
  ['marker-start', 'markerStart'],
  ['marker-end', 'markerEnd'],
  ['font-size', 'fontSize'],
  ['font-weight', 'fontWeight'],
  ['font-style', 'fontStyle'],
  ['text-anchor', 'textAnchor'],
  ['letter-spacing', 'letterSpacing'],
];

for (const element of [...svg.querySelectorAll('*')]) {
  const computed = dom.window.getComputedStyle(element);
  for (const [attribute, property] of presentation) {
    let value = computed[property];
    if (!value || value === 'normal' || value === 'auto' || value === 'none' && !['fill', 'stroke', 'marker-start', 'marker-end'].includes(attribute)) continue;
    if (attribute === 'fill' || attribute === 'stroke') value = toHex(value);
    if ((attribute === 'marker-start' || attribute === 'marker-end') && value.includes('local.invalid')) {
      value = value.replace(/url\(["']?https:\/\/local\.invalid\/diagram/g, 'url(');
    }
    element.setAttribute(attribute, value);
  }
  if (element.classList.contains('node-shadow')) element.setAttribute('fill', '#E9EEF4');
  element.removeAttribute('opacity');
  element.removeAttribute('fill-opacity');
  element.removeAttribute('stroke-opacity');
  element.removeAttribute('style');
}

// The grid pattern and alpha-based background do not survive Feishu import reliably.
svg.querySelector('pattern#grid')?.remove();
svg.querySelector('rect[fill="url(#grid)"]')?.remove();

function parseOrthogonalPath(d) {
  const commands = d.match(/[MHV][^MHV]*/g) || [];
  let x = 0;
  let y = 0;
  const points = [];
  for (const command of commands) {
    const op = command[0];
    const numbers = (command.slice(1).match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
    if (op === 'M') [x, y] = numbers;
    else if (op === 'H') x = numbers[0];
    else if (op === 'V') y = numbers[0];
    else return null;
    points.push([x, y]);
  }
  return points;
}

// Convert every business connector from SVG path syntax to a native right-angled polyline.
for (const path of [...svg.querySelectorAll('path[data-edge-id]')]) {
  const points = parseOrthogonalPath(path.getAttribute('d'));
  if (!points || points.length < 2) throw new Error(`Unsupported edge path: ${path.dataset.edgeId}`);
  const polyline = document.createElementNS(NS, 'polyline');
  for (const attribute of [...path.attributes]) {
    if (!['d', 'class'].includes(attribute.name)) polyline.setAttribute(attribute.name, attribute.value);
  }
  polyline.setAttribute('points', points.map(([px, py]) => `${px},${py}`).join(' '));
  polyline.setAttribute('fill', 'none');
  path.replaceWith(polyline);
}

// Module headers used a rounded freeform path in the web version. Rebuild each as a native rect.
for (const group of [...svg.querySelectorAll('g[data-module-id]')]) {
  const header = group.querySelector('path.module-head');
  const body = group.querySelector('rect.module');
  if (!header || !body) continue;
  const rect = document.createElementNS(NS, 'rect');
  for (const attribute of [...header.attributes]) {
    if (!['d', 'class'].includes(attribute.name)) rect.setAttribute(attribute.name, attribute.value);
  }
  rect.setAttribute('x', body.getAttribute('x'));
  rect.setAttribute('y', body.getAttribute('y'));
  rect.setAttribute('width', body.getAttribute('width'));
  rect.setAttribute('height', '86');
  rect.setAttribute('rx', '14');
  header.replaceWith(rect);
}

// Remove CSS classes only after the two structural conversions above.
for (const element of [...svg.querySelectorAll('[class]')]) element.removeAttribute('class');

// The Feishu text container heuristic assigns this far-right stage note too tightly.
// Keep the meaning while shortening the label so the live board does not clip it.
for (const element of [...svg.querySelectorAll('text')]) {
  if (element.textContent === 'NO action_list → done SHORTCUT') {
    element.textContent = 'NO action_list → done';
    // Keep this stage note clear of the nearby FEEDBACK_UPLINK connector badge.
    element.setAttribute('x', String(Number(element.getAttribute('x')) - 550));
  }
}

// Make the title part of the board (web-only zoom controls are intentionally omitted).
const titleGroup = document.createElementNS(NS, 'g');
titleGroup.setAttribute('data-board-header', 'true');
const headerBackground = document.createElementNS(NS, 'rect');
Object.entries({ x: 40, y: 20, width: 16520, height: 145, rx: 18, fill: '#FFFFFF', stroke: '#CBD5E1', 'stroke-width': 2 }).forEach(([key, value]) => headerBackground.setAttribute(key, value));
titleGroup.appendChild(headerBackground);
const title = document.createElementNS(NS, 'text');
Object.entries({ x: 80, y: 72, fill: '#172033', 'font-size': 34, 'font-weight': 900 }).forEach(([key, value]) => title.setAttribute(key, value));
title.textContent = '豆包汽车：语音 Query → Planner / Director → Tool / Agent → 结果回流与真实生效验收';
titleGroup.appendChild(title);

const pills = [
  ['当前 SP：4 输入 / 4 输出 / 27 工具', '#EFF6FF', '#2563EB'],
  ['Planner = Director', '#EFF6FF', '#2563EB'],
  ['Tool ≠ Agent', '#F8FAFC', '#475569'],
  ['历史性能目标 ≠ 当前 SLA', '#FFFBEB', '#A16207'],
  ['Task Service 单列 WIP', '#F5F3FF', '#7C3AED'],
  ['action_list ≠ 已完成', '#FFF1F2', '#DC2626'],
];
let pillX = 80;
for (const [label, fill, stroke] of pills) {
  const width = Math.max(190, [...label].length * 17 + 34);
  const rect = document.createElementNS(NS, 'rect');
  Object.entries({ x: pillX, y: 98, width, height: 38, rx: 19, fill, stroke, 'stroke-width': 1.5 }).forEach(([key, value]) => rect.setAttribute(key, value));
  const text = document.createElementNS(NS, 'text');
  Object.entries({ x: pillX + width / 2, y: 123, fill: stroke, 'font-size': 14, 'font-weight': 800, 'text-anchor': 'middle' }).forEach(([key, value]) => text.setAttribute(key, value));
  text.textContent = label;
  titleGroup.append(rect, text);
  pillX += width + 18;
}

const SCALE = 1.6;
const movableIds = ['stageLayer', 'edgeLayer', 'nodeLayer', 'labelLayer', 'overlayLayer'];
const movableLayers = movableIds.map((id) => document.getElementById(id)).filter(Boolean);
const xAttributes = ['x', 'x1', 'x2', 'cx'];
const yAttributes = ['y', 'y1', 'y2', 'cy'];
const sizeAttributes = ['width', 'height', 'rx', 'ry', 'r', 'stroke-width', 'font-size', 'letter-spacing'];

function numeric(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function scaleTree(root, yOffset) {
  for (const element of [root, ...root.querySelectorAll('*')]) {
    if (element.closest('defs')) continue;
    for (const attribute of xAttributes) {
      if (!element.hasAttribute(attribute)) continue;
      const value = numeric(element.getAttribute(attribute));
      if (value !== null) element.setAttribute(attribute, String(value * SCALE));
    }
    for (const attribute of yAttributes) {
      if (!element.hasAttribute(attribute)) continue;
      const value = numeric(element.getAttribute(attribute));
      if (value !== null) element.setAttribute(attribute, String((value + yOffset) * SCALE));
    }
    for (const attribute of sizeAttributes) {
      if (!element.hasAttribute(attribute)) continue;
      const value = numeric(element.getAttribute(attribute));
      if (value !== null) element.setAttribute(attribute, String(value * SCALE));
    }
    if (element.hasAttribute('stroke-dasharray')) {
      const value = element.getAttribute('stroke-dasharray');
      if (value !== 'none') element.setAttribute('stroke-dasharray', value.replace(/-?\d+(?:\.\d+)?/g, (part) => String(Number(part) * SCALE)));
    }
    if (element.tagName.toLowerCase() === 'polyline') {
      const points = (element.getAttribute('points') || '').trim().split(/\s+/).filter(Boolean).map((pair) => pair.split(',').map(Number));
      element.setAttribute('points', points.map(([px, py]) => `${px * SCALE},${(py + yOffset) * SCALE}`).join(' '));
    }
    element.removeAttribute('transform');
  }
}

scaleTree(titleGroup, 0);
for (const layer of movableLayers) scaleTree(layer, 185);

for (const child of [...svg.children]) {
  if (!['title', 'desc', 'defs'].includes(child.tagName.toLowerCase())) child.remove();
}
const canvas = document.createElementNS(NS, 'rect');
Object.entries({ x: 0, y: 0, width: 26560, height: 15176, fill: '#FFFFFF' }).forEach(([key, value]) => canvas.setAttribute(key, value));
svg.appendChild(canvas);
svg.appendChild(titleGroup);
for (const layer of movableLayers) svg.appendChild(layer);

// Feishu treats grouped SVG content as embedded images. Flatten every group while
// preserving document order so each rect, text and polyline remains independently editable.
for (const group of [...svg.querySelectorAll('g')].reverse()) {
  while (group.firstChild) group.parentNode.insertBefore(group.firstChild, group);
  group.remove();
}
svg.setAttribute('xmlns', NS);
svg.setAttribute('viewBox', '0 0 26560 15176');
svg.setAttribute('width', '26560');
svg.setAttribute('height', '15176');
svg.removeAttribute('style');
svg.removeAttribute('class');
svg.removeAttribute('role');
svg.removeAttribute('aria-labelledby');

const remainingPaths = [...svg.querySelectorAll('path')].filter((path) => !path.closest('marker'));
if (remainingPaths.length) throw new Error(`Non-marker paths remain: ${remainingPaths.length}`);
const forbidden = ['pattern', 'filter', 'linearGradient', 'radialGradient', 'clipPath', 'mask'];
const violations = forbidden.flatMap((tag) => [...svg.querySelectorAll(tag)].map(() => tag));
if (violations.length) throw new Error(`Forbidden SVG nodes remain: ${violations.join(', ')}`);

fs.writeFileSync(output, `<?xml version="1.0" encoding="UTF-8"?>\n${svg.outerHTML}\n`);
console.log(JSON.stringify({
  sourceQa: qa,
  output,
  bytes: fs.statSync(output).size,
  elementCount: svg.querySelectorAll('*').length,
  rects: svg.querySelectorAll('rect').length,
  polylines: svg.querySelectorAll('polyline').length,
  texts: svg.querySelectorAll('text').length,
  remainingPaths: svg.querySelectorAll('path').length,
}, null, 2));
