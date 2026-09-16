import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {fileURLToPath} from 'node:url';
import {chromium} from '/Users/bytedance/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
const dist='/tmp/preset-prd-diagram-check.WTilFx/node_modules/mermaid/dist';
const server=http.createServer(async(req,res)=>{if(req.url==='/'){res.setHeader('Content-Type','text/html; charset=utf-8');res.end('<html><head><meta charset="utf-8"></head><body></body></html>');return;}const p=path.resolve(dist,decodeURIComponent(req.url).slice(1));if(!p.startsWith(dist+'/')){res.writeHead(403).end();return;}try{res.setHeader('Content-Type','text/javascript');res.end(await fs.readFile(p));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
let browser;
try{
 browser=await chromium.launch({headless:true,channel:'chrome'});
 const page=await browser.newPage({viewport:{width:720,height:1100},deviceScaleFactor:2,colorScheme:'light'});
 await page.goto(`http://127.0.0.1:${server.address().port}/`);
 await page.evaluate(async()=>{window.mermaid=(await import('/mermaid.esm.min.mjs')).default;window.mermaid.initialize({startOnLoad:false});});
 const report=[];
 for(const slug of ['01-总业务框架','02-端侧天气','03-云端充电']){
  const dir=path.join(here,slug),svg=await fs.readFile(path.join(dir,'diagram.svg'),'utf8'),code=await fs.readFile(path.join(dir,'diagram.mmd'),'utf8');
  await page.evaluate(async({svg,code})=>{await window.mermaid.parse(code);document.body.innerHTML='<style>body{margin:0;background:white}svg{width:680px;display:block}</style>'+svg;await document.fonts.ready;},{svg,code});
  const checks=await page.evaluate(()=>{
   const s=document.querySelector('svg'),all=[...s.querySelectorAll('text')];
   const nodes=[...s.querySelectorAll('g[data-node]')].map(g=>({id:g.dataset.node,g,box:g.querySelector('rect,polygon').getBBox()}));
   const out=all.filter(t=>{const b=t.getBBox();return b.x<0||b.x+b.width>680||b.y<0||b.y+b.height>s.viewBox.baseVal.height;}).map(t=>t.textContent);
   const labelOverflow=[];
   for(const n of nodes){for(const t of n.g.querySelectorAll('text')){const b=t.getBBox(),r=n.box;let avail=r.width-20;if(n.g.querySelector('polygon')){const yy=Math.max(Math.abs(b.y-(r.y+r.height/2)),Math.abs(b.y+b.height-(r.y+r.height/2)));avail=r.width*(1-yy/(r.height/2))-12;}if(b.width>avail||b.y<r.y||b.y+b.height>r.y+r.height)labelOverflow.push({id:n.id,text:t.textContent,width:b.width,avail});}}
   const crossing=[];
   for(const p of s.querySelectorAll('path[data-from]')){const pts=[...p.getAttribute('d').matchAll(/[ML]([\d.]+) ([\d.]+)/g)].map(m=>[+m[1],+m[2]]);for(let i=1;i<pts.length;i++){const[a,b]=[pts[i-1],pts[i]];for(const n of nodes){if(n.id===p.dataset.from||n.id===p.dataset.to)continue;const r=n.box;if(a[0]===b[0]&&a[0]>r.x+1&&a[0]<r.x+r.width-1&&Math.max(a[1],b[1])>r.y+1&&Math.min(a[1],b[1])<r.y+r.height-1||a[1]===b[1]&&a[1]>r.y+1&&a[1]<r.y+r.height-1&&Math.max(a[0],b[0])>r.x+1&&Math.min(a[0],b[0])<r.x+r.width-1)crossing.push({edge:p.dataset.from+'-'+p.dataset.to,node:n.id});}}}
   return {nodes:nodes.length,out,labelOverflow,crossing};
  });
  await page.locator('svg').screenshot({path:path.join(dir,'diagram.png')});
  await page.screenshot({path:path.join(dir,'check-top.png')});
  await page.evaluate(()=>window.scrollTo(0,1600));
  await page.screenshot({path:path.join(dir,'check-middle.png')});
  report.push({slug,...checks});
 }
 await fs.writeFile(path.join(here,'check-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser?.close();await new Promise(r=>server.close(r));}
