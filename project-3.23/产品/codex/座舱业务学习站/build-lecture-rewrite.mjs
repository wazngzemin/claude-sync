import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {readerOriginalSvg} from './reader-svg.mjs';
import {flowDiagram,overviewDiagram,validateGeometry} from './diagrams.mjs';
const root=path.dirname(fileURLToPath(import.meta.url));
const work=path.join(root,'research/lecture-rewrite-20261029');
const htmlRoot=path.resolve(root,'../HTML');
const baseline=path.join(htmlRoot,'01-进行中/豆包汽车-业务学习站-v25.html');
const original=fs.readFileSync(baseline,'utf8');
if(process.argv.includes('--publish')){
 const manifest=JSON.parse(fs.readFileSync(path.join(work,'candidate-manifest.json')));
 const data=JSON.parse(fs.readFileSync(path.join(work,'candidate-data.json')));
 const script=fs.readFileSync(path.join(work,'candidate-app.js'),'utf8');
 const payload=JSON.stringify(data).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
 let html=original.replace(/<script>const DATA=[\s\S]*?<\/script>/,()=>'<script>const DATA='+payload+';</script>');
 html=html.replace(/(<\/script>\s*<script>)[\s\S]*?(<\/script>\s*<\/body>)/,(_,a,b)=>a+script+b);
 const checked=JSON.parse(fs.readFileSync(path.join(work,'verification.json')));
 if(checked.errors.length||checked.contentHash!==manifest.sha256||crypto.createHash('sha256').update(html).digest('hex')!==manifest.sha256)throw Error('candidate not verified');
 fs.writeFileSync(manifest.output,html,{flag:'wx'});
 manifest.verification='structural and DOM checks passed; browser visual access policy blocked';
 fs.writeFileSync(path.join(root,'lecture-rewrite-latest.json'),JSON.stringify(manifest,null,2));
 console.log(JSON.stringify({version:manifest.version,output:manifest.output,sha256:manifest.sha256},null,2));process.exit(0);
}
const before=JSON.parse(original.match(/<script>const DATA=([\s\S]*?);<\/script>/)[1]);
const data=structuredClone(before);
const read=name=>JSON.parse(fs.readFileSync(path.join(root,'content',name+'.json'),'utf8'));
const sourceMap=new Map(data.sources.map(s=>[s.id,s]));
const pageMap=new Map(data.pages.map(p=>[p.id,p]));
const nodeMap=new Map(data.base.modules.flatMap(m=>m.nodes).map(n=>[n.id,n]));
const changes={pages:[],baseNodes:[],flows:[],tools:[],walkthroughs:[]};
const applyNode=patch=>{const target=nodeMap.get(patch.id);if(!target)throw Error('unknown node '+patch.id);if(['x','y','w','h','row','col'].some(k=>k in patch))throw Error('node layout mutation '+patch.id);Object.assign(target,patch);target.detail=target.paragraphs.join('\n\n');changes.baseNodes.push(patch.id);};
for(const name of ['lecture-main-20261029','lecture-async-20261029','lecture-support-20261029','lecture-se-20261029']){
 const patch=read(name);
 for(const s of patch.sources||[]){const old=sourceMap.get(s.id);if(old?.url&&s.url&&old.url!==s.url)throw Error('source collision '+s.id);sourceMap.set(s.id,{...old,...s});}
 for(const p of patch.pages){if(changes.pages.includes(p.id))throw Error('duplicate page '+p.id);const target=pageMap.get(p.id);if(!target)throw Error('unknown page '+p.id);Object.assign(target,p);changes.pages.push(p.id);}
 for(const n of patch.baseNodePatches||[])applyNode(n);
}
for(const name of ['lecture-async-nodes-20261029','lecture-nodes-20261029'])for(const n of read(name).nodes)applyNode(n);
sourceMap.set('LECTURE-MEMORY-20261028',{id:'LECTURE-MEMORY-20261028',title:'记忆产品宣讲文字记录（2026-10-28）',url:'https://bytedance.larkoffice.com/docx/Ytzbd2OoNoMk0xxi099c1t9CnHh'});
data.sources=[...sourceMap.values()];
const allTools=[...data.base.tools,...data.base.supplementalDefinitions];
for(const t of read('lecture-tools-20261029').tools){const target=allTools.find(x=>x.id===t.id);if(!target)throw Error('unknown tool '+t.id);Object.assign(target,t);changes.tools.push(t.id);}
for(const id of ['TOOL19','TOOL20']){const t=allTools.find(x=>x.id===id);t.sourceIds=[...new Set([...(t.sourceIds||[]),'LECTURE-MEMORY-20261028'])];}
for(const item of read('lecture-walkthroughs-20261029').walkthroughs){const target=data.walkthroughs.find(x=>x.id===item.id);if(!target)throw Error('unknown walkthrough '+item.id);Object.assign(target,item);changes.walkthroughs.push(item.id);if(['memory-nav','event-memory'].includes(item.id))target.sourceIds=[...new Set([...(target.sourceIds||[]),'LECTURE-MEMORY-20261028'])];}
const allSourceIds=new Set([...data.sources,...(data.base.sources||[])].map(s=>s.id));
const scanRefs=(obj,where)=>{if(Array.isArray(obj)){obj.forEach((x,i)=>scanRefs(x,where+'['+i+']'));return;}if(!obj||typeof obj!=='object')return;for(const [k,v]of Object.entries(obj)){if(k==='sourceIds'&&Array.isArray(v)){for(const id of v)if(!allSourceIds.has(id))throw Error('unknown source '+id+' at '+where);}else if(k==='sourceId'&&v){if(!allSourceIds.has(v))throw Error('unknown source '+v+' at '+where);}else scanRefs(v,where+'.'+k);}};
for(const p of data.pages){
 for(const s of p.sections||[]){const l=p.teaching.lessons.find(x=>x.id===s.teachingTarget);if(l){s.title=l.title;s.paragraphs=l.paragraphs;}}
 const gather=[...(p.sourceIds||[]),...(p.teaching.sourceIds||[]),...p.teaching.lessons.flatMap(l=>l.sourceIds||[]),...Object.values(p.teaching.guides).flatMap(g=>g.sourceIds||[]),...p.flows.flatMap(f=>f.sourceIds||[])];p.sourceIds=[...new Set(gather)];
 for(const flow of p.flows){const rendered=flowDiagram(p,flow),errors=validateGeometry(rendered);if(errors.length)throw Error(flow.id+' geometry '+errors.join(';'));data.diagrams[flow.id]=rendered.svg;changes.flows.push({page:p.id,id:flow.id,nodes:flow.nodes.length});}
}
scanRefs(data.pages,'pages');scanRefs(data.walkthroughs,'walkthroughs');scanRefs(data.base.modules,'base.modules');scanRefs(allTools,'tools');
const full=readerOriginalSvg(before.originalSvg,data.base);data.originalSvg=full.svg;
const overview=overviewDiagram();data.overviewSvg=overview.svg;
const asynchronous=data.base.edges.find(e=>e.id==='X09');asynchronous.label='后续方案：独立异步反馈重新准入';asynchronous.relation='planned';
const require=createRequire(import.meta.url),{JSDOM}=require('/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/jsdom');
const fullDom=new JSDOM(data.originalSvg,{contentType:'image/svg+xml'}),fullDoc=fullDom.window.document;
for(const edge of fullDoc.querySelectorAll('.edge[data-edge="X09"] path,.edge[data-edge="X09"] polyline'))edge.setAttribute('stroke-dasharray','12 10');
const caption=fullDoc.querySelector('.edge-label[data-edge="X09"] text');
if(caption){caption.replaceChildren();for(const [i,line]of ['后续方案：独立异步反馈','经输入管理重新准入'].entries()){const span=fullDoc.createElementNS('http://www.w3.org/2000/svg','tspan');span.setAttribute('x',caption.getAttribute('x'));span.setAttribute('dy',i?'28':'0');span.textContent=line;caption.appendChild(span);}}
data.originalSvg=fullDoc.documentElement.outerHTML;fullDom.window.close();
let script=original.match(/<script>const DATA=[\s\S]*?<\/script>\s*<script>([\s\S]*?)<\/script>/)[1];
const home=fs.readFileSync(path.join(root,'content/lecture-home-20261029.js'),'utf8');
script=script.replace(/  function renderCourseLecture\(\) \{[\s\S]*?\n  function renderWalkthroughList/,home+'\n  function renderWalkthroughList');
const copyChanges=[['把刚才的过程放回完整图','模块完整流程'],['把关键分支再走一遍','分支与详细机制'],['沿图把整个过程走一遍','完整流程与讲解'],['这一课的结果，接着交给谁','向下游交付什么'],['查一个具体节点','节点说明'],['用什么指标检查效果','评测指标'],['继续看前后相连的模块','相关模块'],['放回完整场景理解','贯穿案例'],['需要核对某一格时，展开节点与连线记录','展开节点与连线'],['先把这一次出行，完整讲给你听','从请求到结果'],['换成具体场景，从头走一遍','贯穿案例'],['按你卡住的问题找模块','模块目录']];
for(const [a,b]of copyChanges)script=script.replaceAll(a,b);
script=script.replace('<h4>${esc(node.title)} ${node.status','<h4>${esc(node.id)} · ${esc(node.title)} ${node.status');
let highest=0;for(const dir of ['01-进行中','02-已交付','03-历史版本'])for(const file of fs.readdirSync(path.join(htmlRoot,dir))){const m=file.match(/^豆包汽车-业务学习站-v(\d+)\.html$/);if(m)highest=Math.max(highest,+m[1]);}
const version='v'+String(highest+1).padStart(2,'0');
data.meta={...data.meta,version,previousVersion:'v25',baseVersion:'v14',asOf:'2026-10-29',teachingEditedAt:'2026-10-29',builtAt:new Date().toISOString(),refinement:'按记忆与 Director 产品宣讲重写全部模块，保持 v14 页面结构、原图节点与连接。'};
const payload=JSON.stringify(data).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
let html=original.replace(/<script>const DATA=[\s\S]*?<\/script>/,()=>'<script>const DATA='+payload+';</script>');
html=html.replace(/(<\/script>\s*<script>)[\s\S]*?(<\/script>\s*<\/body>)/,(_,a,b)=>a+script+b);
const output=path.join(htmlRoot,'01-进行中',`豆包汽车-业务学习站-${version}.html`);
const manifest={version,baseline,output,baselineSha256:crypto.createHash('sha256').update(original).digest('hex'),sha256:crypto.createHash('sha256').update(html).digest('hex'),sameStyles:html.match(/<style>([\s\S]*?)<\/style>/)[1]===original.match(/<style>([\s\S]*?)<\/style>/)[1],modules:data.pages.length,lessons:data.pages.reduce((n,p)=>n+p.teaching.lessons.length,0),nodes:nodeMap.size,edges:data.base.edges.length,tools:allTools.length,walkthroughs:data.walkthroughs.length,walkthroughSteps:data.walkthroughs.reduce((n,w)=>n+w.steps.length,0),changes,svgTextOverflow:full.report.errors,verification:'pending'};
fs.writeFileSync(path.join(work,'candidate-data.json'),JSON.stringify(data));fs.writeFileSync(path.join(work,'candidate-app.js'),script);fs.writeFileSync(path.join(work,'candidate-manifest.json'),JSON.stringify(manifest,null,2));
const prose=data.pages.map(p=>[p.title,...p.teaching.intro,...p.teaching.lessons.flatMap(l=>[l.title,...l.paragraphs]),...Object.values(p.teaching.guides).flatMap(g=>[g.title,...g.paragraphs]),...p.teaching.closing].join('\n\n')).join('\n\n')+'\n\n'+allTools.map(t=>[t.label||t.name,t.intro,...t.paragraphs,t.status].join('\n\n')).join('\n\n')+'\n\n'+data.walkthroughs.map(w=>[w.title,...w.intro,...w.steps.flatMap(s=>[s.title,...s.paragraphs]),...w.closing].join('\n\n')).join('\n\n');
fs.writeFileSync(path.join(work,'candidate-prose.md'),prose);
console.log(JSON.stringify({...manifest,changes:{pages:changes.pages,baseNodes:[...new Set(changes.baseNodes)].length,flows:changes.flows.length,tools:changes.tools.length,walkthroughs:changes.walkthroughs.length}},null,2));
export {html,data,before,manifest};
