import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { chromium } from '/Users/bytedance/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const base = path.dirname(new URL(import.meta.url).pathname);
const name = '端侧开关完整链路-v02';
const code = await fs.readFile(path.join(base, name + '.mmd'), 'utf8');
const dist = '/tmp/edge-diagram-render.TPFQCi/node_modules/mermaid/dist';
const server = http.createServer(async(req,res)=>{
  if(req.url==='/') {res.setHeader('Content-Type','text/html;charset=utf-8');res.end('<meta charset="utf-8"><style>body{margin:0;background:#fff}#canvas{padding:24px;display:inline-block}svg{max-width:none!important}</style><div id="canvas"></div>');return;}
  const p = path.resolve(dist, '.'+req.url);
  if(!p.startsWith(dist+'/')){res.writeHead(403).end();return;}
  try{res.setHeader('Content-Type','text/javascript');res.end(await fs.readFile(p));}catch{res.writeHead(404).end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
let browser;
try {
  browser=await chromium.launch({channel:'chrome',headless:true});
  const page=await browser.newPage({viewport:{width:2000,height:1600},deviceScaleFactor:1});
  await page.goto('http://127.0.0.1:'+server.address().port);
  const result=await page.evaluate(async(code)=>{
    const mermaid=(await import('/mermaid.esm.min.mjs')).default;
    mermaid.initialize({startOnLoad:false,securityLevel:'loose',theme:'base',themeVariables:{fontFamily:'Arial, PingFang SC, sans-serif',fontSize:'20px',lineColor:'#64758a',edgeLabelBackground:'#ffffff'},flowchart:{htmlLabels:true,useMaxWidth:false,curve:'linear',nodeSpacing:25,rankSpacing:38,padding:16}});
    await mermaid.parse(code);
    const {svg}=await mermaid.render('edgeFlow',code);
    document.querySelector('#canvas').innerHTML=svg;
    await document.fonts.ready;
    const s=document.querySelector('svg');
    s.setAttribute('width',s.viewBox.baseVal.width);
    s.setAttribute('height',s.viewBox.baseVal.height);
    const truncated=[...s.querySelectorAll('.node foreignObject')].filter(e=>e.firstElementChild&&(e.firstElementChild.scrollWidth>e.width.baseVal.value+3||e.firstElementChild.scrollHeight>e.height.baseVal.value+3)).map(e=>e.textContent);
    return {svg:s.outerHTML,width:s.viewBox.baseVal.width,height:s.viewBox.baseVal.height,nodes:s.querySelectorAll('.node').length,edges:s.querySelectorAll('.flowchart-link').length,truncated};
  },code);
  await fs.writeFile(path.join(base,name+'.svg'),result.svg);
  await page.locator('#canvas').screenshot({path:path.join(base,name+'.png')});
  const report={...result,svg:undefined};
  await fs.writeFile(path.join(base,name+'-检查.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify(report));
} finally {await browser?.close();await new Promise(r=>server.close(r));}
