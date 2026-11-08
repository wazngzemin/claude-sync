import fs from 'node:fs';import {createRequire}from'node:module';
const require=createRequire(import.meta.url),{JSDOM,VirtualConsole}=require('/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/jsdom');
const m=JSON.parse(fs.readFileSync('v14-refinement-latest.json')),before=fs.readFileSync(m.baseline,'utf8'),after=fs.readFileSync(m.output,'utf8');
const parse=s=>JSON.parse(s.match(/<script>const DATA=([\s\S]*?);<\/script>/)[1]);const b=parse(before),a=parse(after);
const errors=[];let checks=0;const check=(ok,label)=>{checks++;if(!ok)errors.push(label)};
check(m.sameStyles,'original v14 styles');
check(JSON.stringify(b.pages.map(p=>p.id))===JSON.stringify(a.pages.map(p=>p.id)),'module order preserved');
check(JSON.stringify(b.base.modules.map(p=>[p.id,p.nodes.map(n=>[n.id,n.x,n.y,n.w,n.h])]))===JSON.stringify(a.base.modules.map(p=>[p.id,p.nodes.map(n=>[n.id,n.x,n.y,n.w,n.h])])),'original nodes and layout preserved');
check(JSON.stringify(b.base.edges.map(e=>[e.id,e.from,e.to]))===JSON.stringify(a.base.edges.map(e=>[e.id,e.from,e.to])),'original graph endpoints preserved');
check(a.walkthroughs.length===4&&a.walkthroughs.reduce((n,p)=>n+p.steps.length,0)===48,'four complete walkthroughs retained');
check(a.pages.reduce((n,p)=>n+p.teaching.lessons.length,0)===b.pages.reduce((n,p)=>n+p.teaching.lessons.length,0),'all lessons retained');
const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
const mockHtml=after.replace('    mountFigures();','    /* batch DOM check skips SVG mounting; actual figures checked separately */');
const options={runScripts:'dangerously',pretendToBeVisual:true,url:'file://'+m.output,virtualConsole:vc,beforeParse(w){w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});}};
const dom=new JSDOM(mockHtml,options),w=dom.window,d=w.document;
const route=hash=>{w.history.replaceState(null,'','#'+hash);w.dispatchEvent(new w.HashChangeEvent('hashchange'));check(!w.__siteLastError,'route error '+hash)};
for(const p of a.pages){route('module/'+p.id);check(d.querySelector('h1')?.textContent===p.title,'title '+p.id);check(!/多练几个场景|你需要能回答的关键问题|接下来可以怎样改进|需要逐项对照时，打开这张表/.test(d.querySelector('#page-root').textContent),'removed sections '+p.id);check(d.querySelectorAll('[data-teaching-lesson]').length===p.teaching.lessons.length,'lessons '+p.id);const base=a.base.modules.find(n=>n.id===p.id);if(base)check(d.querySelectorAll('[data-base-node]').length===base.nodes.length,'node disclosures '+p.id);}
for(const n of a.base.modules.flatMap(p=>p.nodes)){route('node/'+n.id);check(d.querySelector('h1')?.textContent===n.title,'node '+n.id);}
for(const t of [...a.base.tools,...a.base.supplementalDefinitions]){route('tool/'+t.id);check(d.querySelector('h1')?.textContent===(t.label||t.name),'tool '+t.id);}
for(const scene of a.walkthroughs){route('walkthrough/'+scene.id);check(d.querySelectorAll('[data-walkthrough-step]').length===scene.steps.length,'walkthrough '+scene.id);}
dom.window.close();
const live=new JSDOM(after,options);for(const id of ['A','C','E']){live.window.history.replaceState(null,'','#module/'+id);live.window.dispatchEvent(new live.window.HashChangeEvent('hashchange'));check(live.window.document.querySelectorAll('.svg-shell svg').length>0,'mounted SVG '+id);check(!live.window.__siteLastError,'real mounting '+id);}
const paths=s=>{const dom=new JSDOM(s,{contentType:'image/svg+xml'});const values=[...dom.window.document.querySelectorAll('path,polyline')].map(n=>n.getAttribute('d')||n.getAttribute('points'));dom.window.close();return values;};
check(JSON.stringify(paths(b.originalSvg))===JSON.stringify(paths(a.originalSvg)),'original full diagram paths retained');live.window.close();
const report={version:m.version,baseline:'v14',checks,errors,preservation:{modules:a.pages.length,nodes:a.base.modules.reduce((n,p)=>n+p.nodes.length,0),tools:a.base.tools.length+a.base.supplementalDefinitions.length,walkthroughs:a.walkthroughs.length,styleIdentical:m.sameStyles},browserVisual:'pending'};
fs.writeFileSync('v14-refinement-verification.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(errors.length)process.exitCode=1;
