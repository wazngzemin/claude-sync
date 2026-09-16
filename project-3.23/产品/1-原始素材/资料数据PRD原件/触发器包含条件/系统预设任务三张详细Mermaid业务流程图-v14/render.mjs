import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { chromium } from '/Users/bytedance/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const sharp = createRequire(import.meta.url)('/Users/bytedance/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const out = path.dirname(fileURLToPath(import.meta.url));
const names = [
  '01-系统预设任务完整业务框架',
  '02-端侧天气路况保护完整业务链路',
  '03-云端充电设备识别开盖完整业务链路',
];
const diagrams = await Promise.all(names.map((name) => fs.readFile(path.join(out, `${name}.mmd`), 'utf8')));
const dist = '/tmp/preset-prd-diagram-check.WTilFx/node_modules/mermaid/dist';

const server = http.createServer(async (req, res) => {
  if (req.url === '/') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end('<!doctype html><meta charset="utf-8"><style>body{margin:0;background:white}#canvas{padding:32px;display:inline-block;background:white}svg{max-width:none!important}</style><div id="canvas"></div>');
    return;
  }
  const target = path.resolve(dist, decodeURIComponent(req.url).replace(/^\//, ''));
  if (!target.startsWith(`${dist}/`)) {
    res.writeHead(403).end();
    return;
  }
  try {
    res.setHeader('Content-Type', 'text/javascript');
    res.end(await fs.readFile(target));
  } catch {
    res.writeHead(404).end();
  }
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 2200, height: 1400 }, deviceScaleFactor: 1 });
  const browserErrors = [];
  page.on('pageerror', (error) => browserErrors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  await page.evaluate(async () => {
    window.mermaid = (await import('/mermaid.esm.min.mjs')).default;
    window.mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'loose',
      theme: 'base',
      themeVariables: {
        fontFamily: 'Arial, PingFang SC, sans-serif',
        fontSize: '19px',
        lineColor: '#62778d',
        edgeLabelBackground: '#ffffff',
        clusterBkg: '#fafbfd',
        clusterBorder: '#bdc9d6',
      },
      flowchart: {
        useMaxWidth: false,
        htmlLabels: true,
        curve: 'linear',
        nodeSpacing: 30,
        rankSpacing: 40,
        padding: 18,
        diagramPadding: 28,
        wrappingWidth: 520,
      },
    });
  });

  const report = [];
  for (let index = 0; index < diagrams.length; index += 1) {
    const result = await page.evaluate(async ({ code, index }) => {
      await window.mermaid.parse(code);
      const { svg } = await window.mermaid.render(`flow-${index}`, code);
      const canvas = document.querySelector('#canvas');
      canvas.innerHTML = svg;
      await document.fonts.ready;
      const element = canvas.querySelector('svg');
      const viewBox = element.viewBox.baseVal;
      element.setAttribute('width', viewBox.width);
      element.setAttribute('height', viewBox.height);
      const nodes = element.querySelectorAll('.node').length;
      const edges = element.querySelectorAll('.flowchart-link').length;
      const truncated = [...element.querySelectorAll('.node foreignObject')]
        .filter((item) => {
          const content = item.firstElementChild;
          return content && (content.scrollHeight > item.height.baseVal.value + 3 || content.scrollWidth > item.width.baseVal.value + 3);
        })
        .map((item) => item.textContent.slice(0, 80));
      return { svg: element.outerHTML, width: viewBox.width, height: viewBox.height, nodes, edges, truncated };
    }, { code: diagrams[index], index });

    await fs.writeFile(path.join(out, `${names[index]}.svg`), result.svg);
    const pngPath = path.join(out, `${names[index]}.png`);
    await page.locator('#canvas').screenshot({ path: pngPath });
    await sharp(pngPath)
      .resize({ width: 1800, withoutEnlargement: true })
      .toFile(path.join(out, `${names[index]}-预览.png`));
    report.push({ name: names[index], ...result, svg: undefined });
  }

  await fs.writeFile(path.join(out, '检查结果.json'), JSON.stringify({ diagrams: report, browserErrors }, null, 2));
  console.log(JSON.stringify({ diagrams: report, browserErrors }, null, 2));
  if (browserErrors.length || report.some((item) => item.truncated.length)) process.exitCode = 1;
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
