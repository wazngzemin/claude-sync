import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { chromium } from '/Users/bytedance/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const out = path.dirname(fileURLToPath(import.meta.url));
const dist = process.argv[2] || '/tmp/trigger-prd-render.c3mGJl/node_modules/mermaid/dist';
const names = ['D2-配置校验保存流程','D3-Workflow三态与汇合','D4-闪念一期运行链路','D5-视觉配置选择逻辑'];
const codes = await Promise.all(names.map(name=>fs.readFile(path.join(out,`${name}.mmd`),'utf8')));
const server = http.createServer(async(req,res)=>{
  if(req.url==='/'){res.setHeader('Content-Type','text/html; charset=utf-8');res.end('<!doctype html><meta charset="utf-8"><style>body{margin:0;background:white}#canvas{padding:24px;display:inline-block;background:white}svg{max-width:none!important}</style><div id="canvas"></div>');return;}
  const target=path.resolve(dist,decodeURIComponent(req.url).replace(/^\//,''));
  if(!target.startsWith(path.resolve(dist)+'/'))return res.writeHead(403).end();
  try{res.setHeader('Content-Type','text/javascript');res.end(await fs.readFile(target));}catch{res.writeHead(404).end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
try{
  browser=await chromium.launch({headless:true,channel:'chrome'});
  const page=await browser.newPage({viewport:{width:2200,height:1800},deviceScaleFactor:1.5});
  const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  await page.evaluate(async()=>{window.mermaid=(await import('/mermaid.esm.min.mjs')).default;window.mermaid.initialize({startOnLoad:false,securityLevel:'loose',theme:'base',themeVariables:{fontFamily:'PingFang SC, Arial, sans-serif',fontSize:'18px',primaryColor:'#eeedfe',primaryTextColor:'#3c3489',primaryBorderColor:'#7f77dd',lineColor:'#5f5e5a',edgeLabelBackground:'#ffffff'},flowchart:{useMaxWidth:false,htmlLabels:true,curve:'linear',nodeSpacing:28,rankSpacing:34,padding:14,wrappingWidth:320}});});
  const report=[];
  const d1=await fs.readFile(path.join(out,'D1-VLM来源与使用边界.svg'),'utf8');
  await page.evaluate(svg=>document.querySelector('#canvas').innerHTML=svg,d1);
  await page.locator('#canvas svg').evaluate(el=>{el.setAttribute('width','1020');el.setAttribute('height','1050');});
  await page.locator('#canvas').screenshot({path:path.join(out,'D1-VLM来源与使用边界.png')});
  const d1check=await page.evaluate(()=>{const svg=document.querySelector('svg');return [...svg.querySelectorAll('text')].filter(el=>{const b=el.getBBox();return b.x<0||b.x+b.width>680||b.y<0||b.y+b.height>700;}).map(el=>el.textContent);});
  report.push({name:'D1-VLM来源与使用边界',width:680,height:700,overflow:d1check});
  for(let i=0;i<codes.length;i++){
    const result=await page.evaluate(async({code,i})=>{await window.mermaid.parse(code);const{svg}=await window.mermaid.render(`diagram-${i}`,code);document.querySelector('#canvas').innerHTML=svg;await document.fonts.ready;const el=document.querySelector('#canvas svg');const vb=el.viewBox.baseVal;el.setAttribute('width',vb.width);el.setAttribute('height',vb.height);const overflow=[...el.querySelectorAll('.node foreignObject')].filter(n=>{const c=n.firstElementChild;return c&&(c.scrollHeight>n.height.baseVal.value+4||c.scrollWidth>n.width.baseVal.value+4);}).map(n=>n.textContent);return{svg:el.outerHTML,width:vb.width,height:vb.height,nodes:el.querySelectorAll('.node').length,overflow};},{code:codes[i],i});
    await fs.writeFile(path.join(out,`${names[i]}.svg`),result.svg);
    await page.locator('#canvas').screenshot({path:path.join(out,`${names[i]}.png`)});
    report.push({name:names[i],...result,svg:undefined});
  }
  const checks={diagrams:report,browserErrors:errors};await fs.writeFile(path.join(out,'图解检查结果.json'),JSON.stringify(checks,null,2));console.log(JSON.stringify(checks,null,2));if(errors.length||report.some(d=>d.overflow.length))process.exitCode=1;
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
