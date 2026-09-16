#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const DEFAULT_URL = 'http://127.0.0.1:8765/02-%E5%B7%B2%E4%BA%A4%E4%BB%98/%E8%B1%86%E5%8C%85%E6%B1%BD%E8%BD%A6-%E8%AF%AD%E9%9F%B3Query%E5%88%B0%E6%89%A7%E8%A1%8C%E9%97%AD%E7%8E%AF-v06.html';
const DEFAULT_OUTPUT = '/Users/bytedance/Desktop/3.23/whiteboard/豆包汽车-语音到执行闭环-全中文可编辑-v08/diagram-from-v06.svg';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const sourceUrl = process.argv[2] || DEFAULT_URL;
const outputPath = path.resolve(process.argv[3] || DEFAULT_OUTPUT);
const debugPort = 9300 + Math.floor(Math.random() * 500);
const profileDir = await mkdtemp(path.join(tmpdir(), 'codex-v06-svg-'));

let chrome;
let socket;
let nextId = 1;
const pending = new Map();

const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

async function waitForJson(url, timeoutMs = 15000) {
  const deadline = Date.now() + timeoutMs;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return await response.json();
      lastError = new Error(`${response.status} ${response.statusText}`);
    } catch (error) {
      lastError = error;
    }
    await pause(120);
  }
  throw new Error(`Chrome DevTools 未就绪：${lastError?.message || 'timeout'}`);
}

function cdp(method, params = {}) {
  const id = nextId++;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(expression) {
  const result = await cdp('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
    userGesture: false,
  });
  if (result.exceptionDetails) {
    const message = result.exceptionDetails.exception?.description
      || result.exceptionDetails.text
      || '页面脚本执行失败';
    throw new Error(message);
  }
  return result.result.value;
}

const extractionExpression = String.raw`(async () => {
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  for (let i = 0; i < 200 && !window.__diagram; i += 1) await sleep(50);
  const source = document.querySelector('#diagram');
  if (!source) throw new Error('未找到 #diagram');
  if (!window.__diagram) throw new Error('#diagram 动态节点尚未完成');

  const NS = 'http://www.w3.org/2000/svg';
  const clone = source.cloneNode(true);
  const originals = [source, ...source.querySelectorAll('*')];
  const copies = [clone, ...clone.querySelectorAll('*')];
  if (originals.length !== copies.length) throw new Error('克隆节点数量不一致');

  const normalizePaint = value => {
    if (!value) return null;
    if (value === 'none') return 'none';
    const urlMatch = value.match(/url\([^#]*#([^)"']+)[^)]*\)/);
    if (urlMatch) return 'url(#' + urlMatch[1] + ')';
    const rgb = value.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
    if (!rgb) return value;
    const [, r, g, b, a] = rgb;
    if (a !== undefined && Number(a) === 0) return 'none';
    return '#' + [r, g, b].map(n => Number(n).toString(16).padStart(2, '0')).join('').toUpperCase();
  };

  const setIf = (el, name, value, reject = null) => {
    if (value == null || value === '' || (reject && reject.has(value))) return;
    el.setAttribute(name, value);
  };

  for (let i = 0; i < originals.length; i += 1) {
    const original = originals[i];
    const copy = copies[i];
    if (!(original instanceof Element) || !(copy instanceof Element)) continue;
    const computed = getComputedStyle(original);
    const originalClass = original.getAttribute('class') || '';
    copy.setAttribute('data-original-tag', original.localName);
    if (originalClass) copy.setAttribute('data-original-class', originalClass);

    copy.removeAttribute('class');
    copy.removeAttribute('style');
    copy.removeAttribute('opacity');
    copy.removeAttribute('fill-opacity');
    copy.removeAttribute('stroke-opacity');

    if (originalClass.split(/\s+/).includes('node-shadow')) {
      copy.setAttribute('data-drop', 'shadow');
      continue;
    }

    if (['svg', 'g', 'defs', 'marker'].includes(original.localName)) continue;

    setIf(copy, 'fill', normalizePaint(computed.fill));
    setIf(copy, 'stroke', normalizePaint(computed.stroke));
    setIf(copy, 'stroke-width', computed.strokeWidth, new Set(['0px']));
    setIf(copy, 'stroke-dasharray', computed.strokeDasharray, new Set(['none']));
    setIf(copy, 'stroke-linejoin', computed.strokeLinejoin, new Set(['miter']));
    setIf(copy, 'stroke-linecap', computed.strokeLinecap, new Set(['butt']));

    const markerStart = normalizePaint(computed.markerStart);
    const markerEnd = normalizePaint(computed.markerEnd);
    setIf(copy, 'marker-start', markerStart, new Set(['none']));
    setIf(copy, 'marker-end', markerEnd, new Set(['none']));

    if (original.localName === 'text' || original.localName === 'tspan') {
      setIf(copy, 'font-size', computed.fontSize);
      setIf(copy, 'font-weight', computed.fontWeight, new Set(['400', 'normal']));
      setIf(copy, 'font-style', computed.fontStyle, new Set(['normal']));
      setIf(copy, 'letter-spacing', computed.letterSpacing, new Set(['normal', '0px']));
      setIf(copy, 'text-anchor', computed.textAnchor, new Set(['start']));
      copy.removeAttribute('font-family');
    }

    if (original.localName === 'path' && !original.closest('marker')) {
      const b = original.getBBox();
      copy.setAttribute('data-bbox', [b.x, b.y, b.width, b.height].join(','));
    }
  }

  clone.querySelectorAll('[data-drop="shadow"]').forEach(el => el.remove());
  clone.querySelectorAll('style,title,desc,pattern,linearGradient,radialGradient,filter,clipPath,mask').forEach(el => el.remove());

  // The second page-sized rectangle is only the unsupported grid pattern.
  clone.querySelectorAll('[fill^="url("]').forEach(el => {
    const ref = el.getAttribute('fill') || '';
    if (ref.includes('#grid')) el.remove();
    else el.setAttribute('fill', 'none');
  });

  const parseOrthogonalPath = d => {
    const tokens = d.match(/[MLHVZmlhvz]|[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/gi);
    if (!tokens || !tokens.length) return null;
    if (tokens.some(token => /^[CQASTcqast]$/.test(token))) return null;
    let i = 0, cmd = '', x = 0, y = 0, sx = 0, sy = 0;
    const points = [];
    const number = () => Number(tokens[i++]);
    while (i < tokens.length) {
      if (/^[A-Za-z]$/.test(tokens[i])) cmd = tokens[i++];
      if (!cmd) return null;
      switch (cmd) {
        case 'M': x = number(); y = number(); sx = x; sy = y; points.push([x, y]); cmd = 'L'; break;
        case 'm': x += number(); y += number(); sx = x; sy = y; points.push([x, y]); cmd = 'l'; break;
        case 'L': x = number(); y = number(); points.push([x, y]); break;
        case 'l': x += number(); y += number(); points.push([x, y]); break;
        case 'H': x = number(); points.push([x, y]); break;
        case 'h': x += number(); points.push([x, y]); break;
        case 'V': y = number(); points.push([x, y]); break;
        case 'v': y += number(); points.push([x, y]); break;
        case 'Z': case 'z': points.push([sx, sy]); cmd = ''; break;
        default: return null;
      }
    }
    if (points.length < 2 || points.some(p => p.some(n => !Number.isFinite(n)))) return null;
    return points;
  };

  const copyPresentation = (from, to) => {
    for (const name of ['fill','stroke','stroke-width','stroke-dasharray','stroke-linejoin','stroke-linecap','marker-start','marker-end']) {
      if (from.hasAttribute(name)) to.setAttribute(name, from.getAttribute(name));
    }
  };

  clone.querySelectorAll('path').forEach(pathEl => {
    if (pathEl.closest('marker')) return;
    const originalClass = pathEl.getAttribute('data-original-class') || '';
    const d = pathEl.getAttribute('d') || '';
    if (originalClass.split(/\s+/).includes('module-head')) {
      const [x, y, width, height] = (pathEl.getAttribute('data-bbox') || '').split(',').map(Number);
      if (![x, y, width, height].every(Number.isFinite)) throw new Error('module-head 缺少 bbox');
      const rounded = document.createElementNS(NS, 'rect');
      rounded.setAttribute('x', x);
      rounded.setAttribute('y', y);
      rounded.setAttribute('width', width);
      rounded.setAttribute('height', height);
      rounded.setAttribute('rx', Math.min(14, height / 2));
      copyPresentation(pathEl, rounded);
      pathEl.replaceWith(rounded);
      return;
    }
    const points = parseOrthogonalPath(d);
    if (!points) throw new Error('defs 外存在无法转换的 path: ' + d.slice(0, 120));
    const polyline = document.createElementNS(NS, 'polyline');
    polyline.setAttribute('points', points.map(p => p.join(',')).join(' '));
    copyPresentation(pathEl, polyline);
    pathEl.replaceWith(polyline);
  });

  clone.querySelectorAll('*').forEach(el => {
    [...el.attributes].forEach(attr => {
      if (attr.name.startsWith('data-') || attr.name === 'class' || attr.name === 'style') el.removeAttribute(attr.name);
      if (['opacity','fill-opacity','stroke-opacity','font-family','filter','clip-path','mask'].includes(attr.name)) el.removeAttribute(attr.name);
      if ((attr.name === 'fill' || attr.name === 'stroke') && /url\(/.test(attr.value)) el.setAttribute(attr.name, 'none');
    });
  });

  clone.setAttribute('xmlns', NS);
  clone.removeAttribute('style');
  clone.removeAttribute('class');
  clone.removeAttribute('role');
  clone.removeAttribute('aria-labelledby');
  clone.setAttribute('width', '16600');
  clone.setAttribute('height', '9300');

  const allowed = new Set(['svg','rect','circle','ellipse','line','polyline','text','tspan','g','defs','marker','path']);
  const illegal = [...clone.querySelectorAll('*')].filter(el => !allowed.has(el.localName)).map(el => el.localName);
  const externalPaths = [...clone.querySelectorAll('path')].filter(el => !el.closest('marker'));
  const unsupportedRefs = [...clone.querySelectorAll('*')].filter(el => [...el.attributes].some(a => /url\(/.test(a.value) && !a.value.includes('#arrow-')));
  if (illegal.length) throw new Error('存在不允许的元素: ' + [...new Set(illegal)].join(', '));
  if (externalPaths.length) throw new Error('defs/marker 外仍有 path: ' + externalPaths.length);
  if (unsupportedRefs.length) throw new Error('仍有不支持的 url() 引用: ' + unsupportedRefs.length);

  const all = [...clone.querySelectorAll('*')];
  const counts = Object.fromEntries([...new Set(all.map(el => el.localName))].sort().map(tag => [tag, all.filter(el => el.localName === tag).length]));
  return {
    svg: new XMLSerializer().serializeToString(clone),
    counts,
    sourceQa: window.__qa || null,
    totalElements: all.length,
    externalPathCount: externalPaths.length,
  };
})()`;

try {
  chrome = spawn(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-background-networking',
    '--disable-component-update',
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${profileDir}`,
    sourceUrl,
  ], { stdio: ['ignore', 'ignore', 'ignore'] });

  await waitForJson(`http://127.0.0.1:${debugPort}/json/version`);
  const targets = await waitForJson(`http://127.0.0.1:${debugPort}/json/list`);
  const target = targets.find(item => item.type === 'page' && item.url === sourceUrl)
    || targets.find(item => item.type === 'page');
  if (!target?.webSocketDebuggerUrl) throw new Error('没有可用的 Chrome page target');

  socket = new WebSocket(target.webSocketDebuggerUrl);
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) return;
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
  });
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });

  await cdp('Page.enable');
  await cdp('Runtime.enable');
  let ready = false;
  for (let attempt = 0; attempt < 160; attempt += 1) {
    try {
      const state = await evaluate(`({href: location.href, ready: document.readyState, built: Boolean(window.__diagram)})`);
      if (state.href === sourceUrl && state.ready === 'complete' && state.built) {
        ready = true;
        break;
      }
    } catch (error) {
      if (!/Execution context was destroyed|Cannot find context/.test(error.message)) throw error;
    }
    await pause(100);
  }
  if (!ready) throw new Error('v06 页面或动态 SVG 在超时前未完成');
  const result = await evaluate(extractionExpression);
  await writeFile(outputPath, `${result.svg}\n`, 'utf8');
  process.stdout.write(`${JSON.stringify({
    outputPath,
    totalElements: result.totalElements,
    counts: result.counts,
    sourceQa: result.sourceQa,
    externalPathCount: result.externalPathCount,
  }, null, 2)}\n`);
} finally {
  for (const { reject } of pending.values()) reject(new Error('Chrome connection closed'));
  pending.clear();
  try { socket?.close(); } catch {}
  if (chrome && chrome.exitCode == null) {
    try { chrome.kill('SIGTERM'); } catch {}
    await Promise.race([
      new Promise(resolve => chrome.once('exit', resolve)),
      pause(1200),
    ]);
  }
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      await rm(profileDir, { recursive: true, force: true, maxRetries: 2, retryDelay: 100 });
      break;
    } catch (error) {
      if (attempt === 4) process.stderr.write(`临时目录清理失败：${error.message}\n`);
      await pause(250);
    }
  }
}
