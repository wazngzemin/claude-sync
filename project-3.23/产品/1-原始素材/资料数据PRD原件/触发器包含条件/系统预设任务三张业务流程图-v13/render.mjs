import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { chromium } from '/Users/bytedance/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const sharp = createRequire(import.meta.url)('/Users/bytedance/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const out = path.dirname(fileURLToPath(import.meta.url));
const md = await fs.readFile(path.join(out,'三张业务流程图-逐步交接版.md'),'utf8');
const diagrams = [...md.matchAll(/```mermaid\n([\s\S]*?)```/g)].map(m=>m[1]);
const names = ['01-完整业务框架','02-端侧天气保护','03-云端充电任务'];
if(diagrams.length!==3) throw new Error('Must contain exactly three business flowcharts');
const dist='/tmp/preset-prd-diagram-check.WTilFx/node_modules/mermaid/dist';
const server=http.createServer(async(req,res)=>{
  if(req.url==='/') {res.setHeader('Content-Type','text/html; charset=utf-8');res.end('<!doctype html><meta charset="utf-8"><style>body{margin:0;background:white}#canvas{padding:28px;display:inline-block;background:white}svg{max-width:none!important}</style><div id="canvas"></div>');return;}
  const target=path.resolve(dist,decodeURIComponent(req.url).replace(/^\//,''));
  if(!target.startsWith(dist+'/')) {res.writeHead(403).end();return;}
  try{res.setHeader('Content-Type','text/javascript');res.end(await fs.readFile(target));}catch{res.writeHead(404).end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
try{
  browser=await chromium.launch({headless:true,channel:'chrome'});
  const page=await browser.newPage({viewport:{width:1800,height:1200},deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  await page.evaluate(async()=>{
    window.mermaid=(await import('/mermaid.esm.min.mjs')).default;
    window.mermaid.initialize({startOnLoad:false,securityLevel:'loose',theme:'base',themeVariables:{fontFamily:'Arial, PingFang SC, sans-serif',fontSize:'20px',primaryColor:'#eef3fa',primaryTextColor:'#19324b',primaryBorderColor:'#708ba7',lineColor:'#647c92',clusterBkg:'#f8fafc',clusterBorder:'#becbd7',edgeLabelBackground:'#ffffff'},flowchart:{useMaxWidth:false,htmlLabels:true,curve:'linear',nodeSpacing:28,rankSpacing:36,padding:18,diagramPadding:24,wrappingWidth:540}});
  });
  const report=[];
  for(let i=0;i<diagrams.length;i++){
    const r=await page.evaluate(async({code,i})=>{
      await window.mermaid.parse(code);
      const {svg}=await window.mermaid.render('flow'+i,code);
      const c=document.querySelector('#canvas');c.innerHTML=svg;await document.fonts.ready;
      const s=c.querySelector('svg'),v=s.viewBox.baseVal;s.setAttribute('width',v.width);s.setAttribute('height',v.height);
      const b=s.getBoundingClientRect();
      const overflow=[...s.querySelectorAll('foreignObject,text')].filter(e=>{const r=e.getBoundingClientRect();return r.left<b.left-3||r.top<b.top-3||r.right>b.right+3||r.bottom>b.bottom+3;}).map(e=>e.textContent.slice(0,70));
      const truncated=[...s.querySelectorAll('.node foreignObject')].filter(e=>{const n=e.firstElementChild;return n&&(n.scrollHeight>e.height.baseVal.value+3||n.scrollWidth>e.width.baseVal.value+3)}).map(e=>e.textContent.slice(0,70));
      return {svg:s.outerHTML,width:v.width,height:v.height,nodes:s.querySelectorAll('.node').length,edges:s.querySelectorAll('.flowchart-link').length,overflow,truncated};
    },{code:diagrams[i],i});
    await fs.writeFile(path.join(out,names[i]+'.mmd'),diagrams[i]);
    await fs.writeFile(path.join(out,names[i]+'.svg'),r.svg);
    const png=path.join(out,names[i]+'.png');await page.locator('#canvas').screenshot({path:png});
    await sharp(png).resize({width:1400,withoutEnlargement:true}).toFile(path.join(out,names[i]+'-预览.png'));
    const focus=['接入业务提供真实任务状态','天气业务建立本次询问','待会签的关键交接'][i];
    await page.locator('g.node').filter({hasText:focus}).screenshot({path:path.join(out,names[i]+'-文字检查.png')});
    report.push({name:names[i],...r,svg:undefined});
  }
  let index=0;
  const rendered=md.replace(/```mermaid\n[\s\S]*?```/g,()=>{const name=names[index++];return `![${name}](${path.join(out,name+'.png')})\n\n[打开可放大矢量图](${path.join(out,name+'.svg')}) · [Mermaid 源码](${path.join(out,name+'.mmd')})`;});
  await fs.writeFile(path.join(out,'三张业务流程图-看图版.md'),rendered);
  await fs.writeFile(path.join(out,'检查结果.json'),JSON.stringify({diagrams:report,browserErrors:errors},null,2));
  console.log(JSON.stringify({diagrams:report,browserErrors:errors},null,2));
  if(errors.length||report.some(r=>r.overflow.length||r.truncated.length))process.exitCode=1;
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
