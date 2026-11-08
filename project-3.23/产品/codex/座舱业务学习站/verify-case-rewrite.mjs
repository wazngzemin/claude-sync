import fs from 'node:fs';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{JSDOM,VirtualConsole}=require('/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/jsdom');
const work='research/case-rewrite-20261029',manifest=JSON.parse(fs.readFileSync(work+'/candidate-manifest.json'));
const original=fs.readFileSync(manifest.baseline,'utf8'),before=JSON.parse(original.match(/<script>const DATA=([\s\S]*?);<\/script>/)[1]);
const data=JSON.parse(fs.readFileSync(work+'/candidate-data.json')),script=fs.readFileSync(work+'/candidate-app.js','utf8');
const payload=JSON.stringify(data).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
let html=original.replace(/<script>const DATA=[\s\S]*?<\/script>/,()=>'<script>const DATA='+payload+';</script>');
html=html.replace(/(<\/script>\s*<script>)[\s\S]*?(<\/script>\s*<\/body>)/,(_,a,b)=>a+script+b).replace('</style>',fs.readFileSync(work+'/reader.css','utf8')+'\n</style>');
const errors=[],warnings=[];let checks=0;
const check=(ok,label)=>{checks++;if(!ok)errors.push(label);};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
check(crypto.createHash('sha256').update(html).digest('hex')===manifest.sha256,'candidate hash');
check(same(before.pages.map(p=>p.id),data.pages.map(p=>p.id)),'all module IDs/order');
check(manifest.pagesUpdated.length===24,'all 24 chapters updated');
check(same(before.base.modules.map(m=>[m.id,m.nodes.map(n=>[n.id,n.x,n.y,n.w,n.h])]),data.base.modules.map(m=>[m.id,m.nodes.map(n=>[n.id,n.x,n.y,n.w,n.h])])),'original nodes and geometry preserved');
check(same(before.base.edges.map(e=>[e.id,e.from,e.to]),data.base.edges.map(e=>[e.id,e.from,e.to])),'original edge topology preserved');
check(manifest.svgTextOverflow.length===0,'original SVG text fits');
const example=fs.readFileSync(work+'/user-case.md','utf8').split('## ')[0].replace(/\s/g,'').length;
const allNodes=data.base.modules.flatMap(m=>m.nodes),codes=allNodes.map(n=>n.id).sort((a,b)=>b.length-a.length);
const codeRegex=new RegExp('(^|[^A-Za-z0-9_.-])('+codes.join('|')+')(?=$|[^A-Za-z0-9_.-])','g');
const sources=new Set([...data.sources,...data.base.sources].map(s=>s.id));
for(const p of data.pages){
 const t=p.teaching,chars=[...t.intro,...t.lessons.flatMap(l=>l.paragraphs)].join('').replace(/\s/g,'').length;
 check(chars>=example,'chapter meets supplied V example depth floor '+p.id+' '+chars+'/'+example);
 check(t.lessons.every(l=>l.paragraphs.length>=2),'substantive lessons '+p.id);
 const prior=before.pages.find(x=>x.id===p.id);
 for(const l of prior.teaching.lessons)check(t.lessons.some(x=>x.id===l.id),'old section anchor retained '+p.id+'/'+l.id);
 for(const g of Object.values(t.guides||{})){check(g.paragraphs?.length>=3,'continuous guide '+p.id+'/'+g.title);const text=[g.title,...g.paragraphs].join('\n');codeRegex.lastIndex=0;check(!codeRegex.test(text),'guide uses business names, not bare codes '+p.id);}
 for(const s of [...p.sourceIds||[],...t.sourceIds||[],...t.lessons.flatMap(l=>l.sourceIds||[]),...p.flows.flatMap(f=>f.sourceIds||[])])check(sources.has(s),'known source '+p.id+'/'+s);
 const guideKeys=new Set(['base',...p.flows.map(f=>f.id)]);
 for(const key of Object.keys(t.guides||{}))check(guideKeys.has(key),'no orphaned guide '+p.id+'/'+key);
 for(const f of p.flows){check(!!data.diagrams[f.id],'rendered flow '+f.id);check(!!t.guides[f.id],'matching guide '+f.id);check(f.nodes.length>=3,'flow has business stages '+f.id);const doc=new JSDOM(data.diagrams[f.id],{contentType:'image/svg+xml'});check(!doc.window.document.querySelector('parsererror'),'valid SVG '+f.id);for(const n of f.nodes){const el=doc.window.document.querySelector('[data-step="'+n.id+'"]');check(!!el&&el.textContent.includes(n.title),'flow business title '+f.id+'/'+n.id);check(!el?.textContent.includes(n.id+' ·'),'no reader-facing stage code '+f.id+'/'+n.id);}doc.window.close();}
}
const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push('DOM: '+e.message));
const options={url:'file://'+manifest.output,runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});}};
const dom=new JSDOM(html.replace('    mountFigures();','    /* batch DOM checks */'),options),w=dom.window,d=w.document;
function route(hash){w.history.replaceState(null,'','#'+hash);w.dispatchEvent(new w.HashChangeEvent('hashchange'));check(!w.__siteLastError,'route '+hash);}
for(const p of data.pages){
 route('module/'+p.id);const root=d.querySelector('#page-root');check(root.querySelector('h1')?.textContent===p.title,'module title '+p.id);
 check(root.querySelectorAll('[data-teaching-lesson]').length===p.teaching.lessons.length,'all lessons visible '+p.id);
 check(!root.querySelector('#terms,#related,#whole-scenarios,#sources,.article-footer,textarea,.source-appendix'),'requested panels removed '+p.id);
 check(!root.querySelector('.flow-reference,#nodes,#metrics'),'duplicate reference blocks removed '+p.id);
 check(!root.textContent.includes('与本模块存在有来源的输入、输出或条件关系'),'no filler relation copy '+p.id);
 for(const l of p.teaching.lessons)check(!!d.getElementById(l.id),'lesson deep link '+p.id+'/'+l.id);
 if(data.base.modules.some(m=>m.id===p.id))check(!!root.querySelector('#detailed-flow'),'full module diagram retained '+p.id);
 const intro=root.querySelector('[data-teaching-intro]'),firstFigure=root.querySelector('.flow-figure');if(intro&&firstFigure)check(!!(intro.compareDocumentPosition(firstFigure)&4),'prose precedes diagrams '+p.id);
}
for(const t of [...data.base.tools,...data.base.supplementalDefinitions]){route('tool/'+t.id);check(d.querySelector('h1')?.textContent===(t.label||t.name),'tool '+t.id);check(!d.querySelector('#page-root #in-chain,#page-root .source-appendix'),'tool clutter removed '+t.id);}
for(const n of allNodes){route('node/'+n.id);check(d.querySelector('h1')?.textContent===n.title,'original node route '+n.id);}
for(const name of ['home','tools','map','sources','search?q=预请求','search?q=儿童锁','walkthrough'])route(name);
check(d.querySelector('h1')?.textContent==='从一句话，读懂整套座舱 AI','retired case route leads to continuous overview');
check(!d.querySelector('script[src],link[rel=stylesheet][href^=http]'),'standalone offline content');
dom.window.close();
const live=new JSDOM(html,options),ld=live.window.document;
for(const id of ['V','M','K','G','SE']){live.window.history.replaceState(null,'','#module/'+id);live.window.dispatchEvent(new live.window.HashChangeEvent('hashchange'));check(ld.querySelectorAll('.svg-shell svg').length>0,'SVG mounts '+id);check(!live.window.__siteLastError,'SVG route '+id);const open=ld.querySelector('[data-open-diagram]');if(open){open.click();check(!ld.querySelector('#diagram-modal')?.hidden||!!ld.querySelector('.modal-backdrop:not([hidden])'),'diagram can open '+id);ld.querySelector('[data-close-diagram],#diagram-close')?.click();}}
live.window.close();
const pathValues=s=>{const doc=new JSDOM(s,{contentType:'image/svg+xml'});const p=[...doc.window.document.querySelectorAll('path,polyline')].map(n=>n.getAttribute('d')||n.getAttribute('points'));doc.window.close();return p;};
check(same(pathValues(before.originalSvg),pathValues(data.originalSvg)),'original connector geometry preserved');
const prose=fs.readFileSync(work+'/candidate-prose.md','utf8');
for(const phrase of ['本轮未读','本次取得材料','与本模块存在有来源的输入','OnePager 给出'])check(!prose.includes(phrase),'no audit filler '+phrase);
for(const pattern of [/这一章(?:围绕|沿|将|会)/g,/下面按.+?讲/g,/读完.+?应该/g]){const matches=prose.match(pattern);if(matches)warnings.push({type:'possible metanarrative',matches});}
const report={version:manifest.version,contentHash:manifest.sha256,checks,errors,warnings,exampleChars:example,chapterStats:manifest.chapterStats,counts:{modules:data.pages.length,lessons:data.pages.reduce((n,p)=>n+p.teaching.lessons.length,0),nodes:allNodes.length,edges:data.base.edges.length,tools:data.base.tools.length+data.base.supplementalDefinitions.length,flows:Object.keys(data.diagrams).length},browserVisual:'not performed: prior local browser access policy block retained',svgVisual:'offline rendering reviewed separately'};
fs.writeFileSync(work+'/verification.json',JSON.stringify(report,null,2));console.log(JSON.stringify({checks,errors,warnings,counts:report.counts},null,2));if(errors.length)process.exitCode=1;
