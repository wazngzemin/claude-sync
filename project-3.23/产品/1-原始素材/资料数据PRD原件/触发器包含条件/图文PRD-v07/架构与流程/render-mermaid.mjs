import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { chromium } from '/Users/bytedance/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const out = path.dirname(fileURLToPath(import.meta.url));
const prd = path.resolve(out, '../../PRD-触发器配置平台改造-完整评审稿-v07.md');
const dist = process.argv[2];
if (!dist) throw new Error('Pass the installed Mermaid dist directory');
const text = await fs.readFile(prd, 'utf8');
let codes = [...text.matchAll(/```mermaid\n([\s\S]*?)\n```/g)].map(m => m[1]);
const names = ['A2-配置与保存流程', 'A3-输入到动作运行链路', 'C1-儿童锁判断关系'];
if (!codes.length) codes = await Promise.all(names.map(name => fs.readFile(path.join(out, `${name}.mmd`), 'utf8')));
if (codes.length !== names.length) throw new Error(`Expected ${names.length} diagrams, got ${codes.length}`);

const server = http.createServer(async (req, res) => {
  if (req.url === '/') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end('<!doctype html><meta charset="utf-8"><style>body{margin:0;background:white}#canvas{padding:24px;display:inline-block;background:white}svg{max-width:none!important}</style><div id="canvas"></div>');
    return;
  }
  const target = path.resolve(dist, decodeURIComponent(req.url).replace(/^\//, ''));
  if (!target.startsWith(`${path.resolve(dist)}/`)) return res.writeHead(403).end();
  try {
    res.setHeader('Content-Type', 'text/javascript');
    res.end(await fs.readFile(target));
  } catch { res.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 2200, height: 1600 }, deviceScaleFactor: 1.5 });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  await page.evaluate(async () => {
    window.mermaid = (await import('/mermaid.esm.min.mjs')).default;
    window.mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'loose',
      theme: 'base',
      themeVariables: {
        fontFamily: 'PingFang SC, Arial, sans-serif', fontSize: '18px',
        primaryColor: '#eeecfc', primaryTextColor: '#433996', primaryBorderColor: '#9188de',
        lineColor: '#64625e', edgeLabelBackground: '#fff',
      },
      flowchart: { useMaxWidth: false, htmlLabels: true, curve: 'linear', nodeSpacing: 36, rankSpacing: 44, padding: 16, wrappingWidth: 330 },
    });
  });
  const report = [];
  for (let i = 0; i < codes.length; i++) {
    const result = await page.evaluate(async ({ code, i }) => {
      await window.mermaid.parse(code);
      const { svg } = await window.mermaid.render(`diagram-${i}`, code);
      document.querySelector('#canvas').innerHTML = svg;
      await document.fonts.ready;
      const el = document.querySelector('#canvas svg');
      const vb = el.viewBox.baseVal;
      el.setAttribute('width', vb.width);
      el.setAttribute('height', vb.height);
      const overflow = [...el.querySelectorAll('.node foreignObject')].filter(n => {
        const c = n.firstElementChild;
        return c && (c.scrollHeight > n.height.baseVal.value + 4 || c.scrollWidth > n.width.baseVal.value + 4);
      }).map(n => n.textContent);
      return { svg: el.outerHTML, width: vb.width, height: vb.height, nodes: el.querySelectorAll('.node').length, overflow };
    }, { code: codes[i], i });
    await fs.writeFile(path.join(out, `${names[i]}.mmd`), codes[i] + '\n');
    await fs.writeFile(path.join(out, `${names[i]}.svg`), result.svg);
    await page.locator('#canvas').screenshot({ path: path.join(out, `${names[i]}.png`) });
    report.push({ name: names[i], ...result, svg: undefined });
  }
  const result = { diagrams: report, browserErrors: errors };
  await fs.writeFile(path.join(out, 'Mermaid检查结果.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
  if (errors.length || report.some(d => d.overflow.length)) process.exitCode = 1;
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
