import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {readerOriginalSvg} from './reader-svg.mjs';
import {caseFlowDiagram} from './case-diagrams.mjs';
import {validateGeometry} from './diagrams.mjs';
const root=path.dirname(fileURLToPath(import.meta.url));
const work=path.join(root,'research/case-rewrite-20261029');
const htmlRoot=path.resolve(root,'../HTML');
const baseline=path.join(htmlRoot,'01-进行中/豆包汽车-业务学习站-v27.html');
const original=fs.readFileSync(baseline,'utf8');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
if(process.argv.includes('--publish')){
 const manifest=JSON.parse(fs.readFileSync(path.join(work,'candidate-manifest.json')));
 const data=JSON.parse(fs.readFileSync(path.join(work,'candidate-data.json'),'utf8'));
 const script=fs.readFileSync(path.join(work,'candidate-app.js'),'utf8');
 const html=compose(data,script);
 const checks=JSON.parse(fs.readFileSync(path.join(work,'verification.json')));
 const reviews=JSON.parse(fs.readFileSync(path.join(work,'review-summary.json')));
 if(checks.errors.length||checks.contentHash!==manifest.sha256||hash(html)!==manifest.sha256||manifest.pagesUpdated.length!==24||reviews.contentHash!==manifest.sha256||reviews.openFindings?.length||reviews.reviewedModules?.length!==24)throw Error('Unverified or unreviewed candidate');
 if(fs.existsSync(manifest.output)||fs.existsSync(manifest.svgOutput))throw Error('Version already exists');
 fs.writeFileSync(manifest.output,html,{flag:'wx'});
 fs.writeFileSync(manifest.svgOutput,data.originalSvg,{flag:'wx'});
 fs.writeFileSync(path.join(root,'case-rewrite-latest.json'),JSON.stringify(manifest,null,2));
 console.log(JSON.stringify({output:manifest.output,sha256:manifest.sha256,version:manifest.version},null,2));process.exit(0);
}
const before=JSON.parse(original.match(/<script>const DATA=([\s\S]*?);<\/script>/)[1]),data=structuredClone(before);
const pageMap=new Map(data.pages.map(p=>[p.id,p])),sourceMap=new Map(data.sources.map(s=>[s.id,s]));
const nodes=new Map(data.base.modules.flatMap(m=>m.nodes).map(n=>[n.id,n]));
const pagesUpdated=[],nodesUpdated=[];
for(const group of ['main','async','support']){
 const file=path.join(root,'content',`case-${group}-20261029.json`);
 if(!fs.existsSync(file)){if(process.argv.includes('--partial'))continue;throw Error('Missing '+file);}
 const patch=JSON.parse(fs.readFileSync(file,'utf8'));
 for(const p of patch.pages){if(!pageMap.has(p.id)||pagesUpdated.includes(p.id))throw Error('Invalid/duplicate page '+p.id);Object.assign(pageMap.get(p.id),p);pagesUpdated.push(p.id);}
 for(const s of patch.sources||[])sourceMap.set(s.id,{...(sourceMap.get(s.id)||{}),...s});
 for(const n of patch.baseNodePatches||[]){if(!nodes.has(n.id))throw Error('Unknown node '+n.id);if(['x','y','w','h'].some(k=>k in n))throw Error('Unexpected original geometry change');Object.assign(nodes.get(n.id),n);nodes.get(n.id).detail=nodes.get(n.id).paragraphs.join('\n\n');nodesUpdated.push(n.id);}
}
const toolsFile=path.join(root,'content/case-tools-20261029.json');
if(fs.existsSync(toolsFile)){
 const patch=JSON.parse(fs.readFileSync(toolsFile));for(const t of patch.tools){const tool=[...data.base.tools,...data.base.supplementalDefinitions].find(x=>x.id===t.id);if(!tool)throw Error('Unknown tool '+t.id);Object.assign(tool,t);}
 for(const s of patch.sources||[])sourceMap.set(s.id,{...(sourceMap.get(s.id)||{}),...s});
}
if(!process.argv.includes('--partial')&&pagesUpdated.length!==24)throw Error('Only '+pagesUpdated.length+' modules ready');
data.sources=[...sourceMap.values()];
const diagrams={},geometry=[],retiredFlows=[];
for(const p of data.pages){
 const prior=before.pages.find(x=>x.id===p.id);
 if(pagesUpdated.includes(p.id)){
  // Keep old deep links as aliases, without retaining obsolete reader sections.
  const oldTargets=p.legacyChapterTargets||{};
  for(const s of p.sections||[])if(s.teachingTarget)oldTargets[s.id]=s.teachingTarget;
  p.legacyChapterTargets=oldTargets;
  p.sections=p.teaching.lessons.map(l=>({id:l.id,title:l.title,paragraphs:l.paragraphs,teachingTarget:l.id,sourceIds:l.sourceIds||p.sourceIds}));
  for(const key of ['terms','questions','metrics','roadmap','related','cases','referenceTables'])p[key]=[];
  for(const f of prior.flows||[])if(!p.flows.some(n=>n.id===f.id))retiredFlows.push(f.id);
 }
 for(const flow of p.flows||[]){const rendered=caseFlowDiagram(p,flow);const errors=validateGeometry(rendered);if(errors.length)throw Error(flow.id+' '+errors.join('; '));diagrams[flow.id]=rendered.svg;geometry.push({id:flow.id,nodes:flow.nodes.length,edges:flow.edges.length,width:rendered.width,height:rendered.height});}
}
data.diagrams=diagrams;
const redraw=readerOriginalSvg(before.originalSvg,data.base);data.originalSvg=redraw.svg;
execFileSync(process.execPath,[path.join(work,'patch-app.mjs')],{cwd:root});
let script=fs.readFileSync(path.join(work,'candidate-app.js'),'utf8');
const homeFile=path.join(work,'home-function.js');if(fs.existsSync(homeFile))script=script.replace(/  function renderCourseLecture\(\) \{[\s\S]*?\n  function renderWalkthroughList/,fs.readFileSync(homeFile,'utf8')+'\n\n  function renderWalkthroughList');
fs.writeFileSync(path.join(work,'candidate-app.js'),script);
let highest=0;for(const dir of ['01-进行中','02-已交付','03-历史版本'])for(const f of fs.readdirSync(path.join(htmlRoot,dir))){const m=f.match(/^豆包汽车-业务学习站-v(\d+)\.html$/);if(m)highest=Math.max(highest,+m[1]);}
const version='v'+String(highest+1).padStart(2,'0');
data.meta={...data.meta,version,previousVersion:'v27',builtAt:new Date().toISOString(),asOf:'2026-10-30',refinement:'按用户长案例逐章解释业务过程，删除重复附录及低信息量概括图。'};
const html=compose(data,script);
const output=path.join(htmlRoot,'01-进行中',`豆包汽车-业务学习站-${version}.html`);
const chapterStats=data.pages.map(p=>({id:p.id,title:p.title,lessons:p.teaching.lessons.length,chars:[...p.teaching.intro,...p.teaching.lessons.flatMap(l=>l.paragraphs)].join('').replace(/\s/g,'').length,paragraphs:p.teaching.intro.length+p.teaching.lessons.reduce((n,l)=>n+l.paragraphs.length,0),flows:p.flows.length}));
const svgOutput=path.join(htmlRoot,'01-进行中',`豆包汽车-全部模块节点与工具-全景图-${version}.svg`);
const manifest={version,baseline,output,svgOutput,baselineSha256:hash(original),sha256:hash(html),pagesUpdated,nodesUpdated,chapterStats,retiredFlows,geometry,svgTextOverflow:redraw.report.errors};
fs.writeFileSync(path.join(work,'candidate-data.json'),JSON.stringify(data));
fs.writeFileSync(path.join(work,'candidate-manifest.json'),JSON.stringify(manifest,null,2));
fs.writeFileSync(path.join(work,'candidate-prose.md'),data.pages.map(p=>[p.title,...p.teaching.intro,...p.teaching.lessons.flatMap(l=>[l.title,...l.paragraphs]),...Object.values(p.teaching.guides).flatMap(g=>[g.title,...g.paragraphs]),...p.teaching.closing].join('\n\n')).join('\n\n'));
console.log(JSON.stringify({version,output,pagesUpdated,chapterStats,retiredFlows,svgTextOverflow:manifest.svgTextOverflow},null,2));

function compose(data,script){
 const payload=JSON.stringify(data).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
 let html=original.replace(/<script>const DATA=[\s\S]*?<\/script>/,()=>'<script>const DATA='+payload+';</script>');
 html=html.replace(/(<\/script>\s*<script>)[\s\S]*?(<\/script>\s*<\/body>)/,(_,a,b)=>a+script+b);
 return html.replace('</style>',fs.readFileSync(path.join(work,'reader.css'),'utf8')+'\n</style>');
}
