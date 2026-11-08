import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {corePages} from './core-content.mjs';
import {flowDiagram,overviewDiagram,validateGeometry} from './diagrams.mjs';
import {applyReaderEdition} from './reader-edition.mjs';
import {readerOriginalSvg} from './reader-svg.mjs';

const root=path.dirname(fileURLToPath(import.meta.url));
const workspace=path.resolve(root,'../../..');
const prior=path.join(workspace,'whiteboard/豆包汽车-业务全链路-v15');
const json=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const base=json(path.join(prior,'graph-v15.json'));
const packages=['memory-events','evolution','event-register','walkthrough-memory','walkthrough-trigger','driver-agent','endcloud-flows'].map(name=>json(path.join(root,'content',name+'.json')));
for(const name of ['qa-planner','qa-trigger','coverage-memory','coverage-evaluation','coverage-core','coverage-memory-followup','coverage-evaluation-followup','coverage-core-followup','sweep-core','sweep-config','sweep-evaluation','sweep-root']){
 const file=path.join(root,'content',name+'.json');
 if(fs.existsSync(file))packages.push(json(file));
}
const pageMap=new Map(corePages(base).map(p=>[p.id,p]));
for(const pack of packages) for(const p of pack.pages||[]) pageMap.set(p.id,p);
const order=['V','R','M','C','D','E','DR','O','I','W','F','K','T','B','A','G','S','P','L','H','U','EV','EL','SE'];
if(order.some(id=>!pageMap.has(id)))throw Error('Missing module page');
const pages=order.map(id=>pageMap.get(id));
const walkthroughs=packages.flatMap(pack=>pack.walkthroughs||[]);
if(new Set(walkthroughs.map(w=>w.id)).size!==walkthroughs.length)throw Error('Duplicate walkthrough id');
for(const walkthrough of walkthroughs){
 const steps=walkthrough.steps||[];
 if(!walkthrough.id||!walkthrough.title||!walkthrough.query||!walkthrough.scope||!walkthrough.boundary||steps.length<9)throw Error('Incomplete walkthrough '+walkthrough.id);
 if(new Set(steps.map(s=>s.id)).size!==steps.length)throw Error('Duplicate step id in '+walkthrough.id);
 for(const step of steps){
  for(const field of ['id','title','actor','input','decision','output','next','evidence','failure'])if(typeof step[field]!=='string'||!step[field].trim())throw Error('Missing walkthrough field '+walkthrough.id+'.'+step.id+'.'+field);
  for(const field of ['known','unknown','moduleIds','sourceIds'])if(!Array.isArray(step[field])||!step[field].length)throw Error('Missing walkthrough array '+walkthrough.id+'.'+step.id+'.'+field);
  for(const id of step.moduleIds)if(!pageMap.has(id))throw Error('Unknown walkthrough module '+id);
 }
}
for(const pack of packages){
 for(const [id,additions]of Object.entries(pack.pageAdditions||{})){
  for(const [key,items]of Object.entries(additions))pageMap.get(id)[key].push(...items);
 }
 for(const [id,directions]of Object.entries(pack.coreRoadmaps||{})){
  if(!pageMap.has(id))throw Error('Unknown roadmap module '+id);
  // Deep-topic content already has a more detailed roadmap; retain it.
  if(id==='K')pageMap.get(id).roadmap.push(...directions);
  else pageMap.get(id).roadmap=directions;
 }
}
// Author the lessons separately from immutable source notes and original diagrams.
// Every retained chapter and every diagram must have a deliberate teaching home.
const teachingPacks=['voice','main','support','async'].map(name=>json(path.join(root,'content',`teaching-${name}.json`)));
const allBaseNodes=new Set(base.modules.flatMap(m=>m.nodes.map(n=>n.id)));
const taught=new Set();
for(const teaching of teachingPacks.flatMap(pack=>pack.modules||[])){
 const page=pageMap.get(teaching.id);
 if(!page||taught.has(teaching.id))throw Error('Unknown or duplicate teaching module '+teaching.id);
 taught.add(teaching.id);
 if(teaching.intro?.length<2||teaching.lessons?.length<3||!teaching.closing?.length)throw Error('Incomplete teaching narrative '+teaching.id);
 const sectionIds=new Set(page.sections.map(s=>s.id));
 const covered=new Set(teaching.lessons.flatMap(l=>l.covers||[]));
 for(const id of sectionIds)if(!covered.has(id))throw Error('Chapter missing teaching coverage '+teaching.id+'/'+id);
 for(const lesson of teaching.lessons){
  if(!lesson.id||!lesson.title||lesson.paragraphs?.length<2)throw Error('Incomplete lesson '+teaching.id);
  for(const id of lesson.covers||[])if(!sectionIds.has(id))throw Error('Unknown covered chapter '+id);
 }
 const diagramKeys=page.flows.map(f=>f.id);
 if(base.modules.some(m=>m.id===teaching.id))diagramKeys.push('base');
 for(const key of diagramKeys){
  const guide=teaching.guides?.[key];
  const allowed=key==='base'?allBaseNodes:new Set(page.flows.find(f=>f.id===key).nodes.map(n=>n.id));
  if(!guide?.title||guide.paragraphs?.length<4||!guide.nodeIds?.length)throw Error('Missing substantive diagram guide '+teaching.id+'/'+key);
  for(const id of guide.nodeIds)if(!allowed.has(id))throw Error('Unknown guide node '+teaching.id+'/'+key+'/'+id);
 }
 page.teaching=teaching;
}
if(taught.size!==pages.length)throw Error('Not all modules have coherent teaching narratives');
const sourceMap=new Map(base.sources.map(s=>[s.id,s]));
for(const pack of packages)for(const s of pack.sources||[]){
 const old=sourceMap.get(s.id);
 if(old&&old.url!==s.url)throw Error('Conflicting source id '+s.id);
 sourceMap.set(s.id,s);
}
const sources=[...sourceMap.values()];
// Corrections apply to this new edition only; the prior v15 source file stays unchanged.
for(const pack of packages)for(const correction of pack.metricCorrections||[]){
 const page=pageMap.get(correction.moduleId);
 const metric=page?.metrics.find(item=>item.name===correction.name);
 if(!metric)throw Error('Unknown metric correction '+correction.moduleId+' / '+correction.name);
 metric.targetStatus=correction.targetStatus;
 metric.sourceIds=correction.sourceIds;
 const original=base.modules.find(item=>item.id===correction.moduleId)?.metrics.find(item=>item.name===correction.name);
 if(original)original.status=correction.targetStatus;
}
const missing=[];
function checkSources(value,location){
 if(!value||typeof value!=='object')return;
 if(value.sourceIds)for(const id of value.sourceIds)if(!sourceMap.has(id))missing.push(location+': '+id);
 for(const [key,v]of Object.entries(value))if(v&&typeof v==='object')checkSources(v,location+'.'+key);
}
checkSources(pages,'pages');checkSources(walkthroughs,'walkthroughs');checkSources(base.tools,'tools');checkSources(base.supplementalDefinitions,'supplements');
if(missing.length)throw Error('Unresolved sources\n'+missing.join('\n'));
const readerEdition=applyReaderEdition({root,base,pages,walkthroughs});
checkSources(pages,'reader.pages');checkSources(walkthroughs,'reader.walkthroughs');checkSources(base.modules,'reader.modules');checkSources(base.tools,'reader.tools');checkSources(base.supplementalDefinitions,'reader.supplements');
if(missing.length)throw Error('Unresolved reader sources\n'+missing.join('\n'));
const originalReader=readerOriginalSvg(fs.readFileSync(path.join(prior,'业务全链路-v15.svg'),'utf8'),base);
fs.writeFileSync(path.join(root,'reader-full.svg'),originalReader.svg);
fs.writeFileSync(path.join(root,'reader-svg-layout.json'),JSON.stringify(originalReader.report,null,2));
fs.mkdirSync(path.join(root,'diagrams'),{recursive:true});
// Keep prior generated SVGs recoverable, just as HTML versions are retained.
const previousManifest=path.join(root,'latest-build.json');
if(fs.existsSync(previousManifest)){
 const previousVersion=json(previousManifest).version;
 const backup=path.join(root,'diagram-history',previousVersion);
 fs.mkdirSync(backup,{recursive:true});
 for(const file of fs.readdirSync(path.join(root,'diagrams')).filter(name=>name.endsWith('.svg'))){
  const target=path.join(backup,file);
  if(!fs.existsSync(target))fs.copyFileSync(path.join(root,'diagrams',file),target,fs.constants.COPYFILE_EXCL);
 }
}
const diagrams={},diagramGeometry={};
for(const p of pages)for(const f of p.flows){
 if(diagrams[f.id])throw Error('Duplicate flow '+f.id);
 const output=flowDiagram(p,f);
 const issues=validateGeometry(output);
 if(issues.length)throw Error(f.id+' geometry: '+issues.join(', '));
 diagrams[f.id]=output.svg;diagramGeometry[f.id]={geometry:output.geometry,edges:output.edges,routes:output.routes,height:output.height};
 fs.writeFileSync(path.join(root,'diagrams',f.id+'.svg'),output.svg);
}
const overview=overviewDiagram();
if(validateGeometry(overview).length)throw Error('Overview geometry: '+validateGeometry(overview).join(', '));
fs.writeFileSync(path.join(root,'diagrams/overview.svg'),overview.svg);
const coverage=json(path.join(prior,'research-coverage.json'));
coverage.newFlowEntries=['sweep-core','sweep-config','sweep-evaluation','sweep-root'].flatMap(name=>{
 const file=path.join(root,'content',name+'.json');
 if(!fs.existsSync(file))return [];
 return Object.entries(json(file).pageAdditions||{}).flatMap(([moduleId,additions])=>(additions.flows||[]).map(flow=>({moduleId,id:flow.id,title:flow.title,caption:flow.caption})));
});
const scanWrapper=json(path.join(workspace,'产品/codex/全源重读-20261023/search-inventory-gap.json'));
const scan=scanWrapper.inventory?scanWrapper:JSON.parse(scanWrapper.content.find(c=>c.type==='text').text);
const token=url=>String(url).split(/[?#]/)[0].replace(/\/$/,'').split('/').at(-1);
coverage.inventory=(scan.inventory||[]).map(item=>({title:item.title,url:item.url,type:item.type,sourceIds:sources.filter(s=>token(s.url)===token(item.url)).map(s=>s.id)}));
coverage.inventoryStatus={query:scan.search_query,pagesScanned:scan.pages_scanned,scanComplete:scan.scan_complete,uniqueHits:scan.unique_hits,note:'这是“豆包汽车”这一查询的完整命中清单，不是公司全部汽车文档。列入清单不表示已读正文；未作为本站来源的条目不据摘要补造业务结论。其他专题检索有重叠，不相加计数。'};
coverage.researchNotes=packages.flatMap(p=>p.researchNotes||[]);
const expansionAudit=path.join(root,'research/coverage-expansion/inventory-audit.json');
if(fs.existsSync(expansionAudit))coverage.expansionAudit=json(expansionAudit);
coverage.websiteBoundary='本网站在 v15 已审读材料基础上补充 Memory、事件、事件日志、自进化、手车互联与司机 Agent 专题，并回溯端云原始画板和不同版本 PRD。全站引用来源数量不是独立文档已读量，也不是公司全部文档量。历史 PRD、会议当时状态、规划与产品验收建议保留各自边界；完整检索元数据和实际审读范围逐项分列。';
coverage.domains.push({name:'本次新增专题审读',description:coverage.websiteBoundary});
const htmlDir=path.resolve(root,'../HTML');
let highest=0;
for(const dir of ['01-进行中','02-已交付','03-历史版本']){
 const full=path.join(htmlDir,dir);fs.mkdirSync(full,{recursive:true});
 for(const file of fs.readdirSync(full)){const match=file.match(/^豆包汽车-业务学习站-v(\d+)\.html$/);if(match)highest=Math.max(highest,Number(match[1]));}
}
const version='v'+String(highest+1).padStart(2,'0');
const meta={title:'从一句话，读懂整套座舱 AI',version,asOf:'2026-10-23',teachingEditedAt:'2026-10-26',builtAt:new Date().toISOString(),delivery:'本地单文件；不上传内部资料',validation:'构建成功不等于实际浏览器验收；详见验证报告。'};
const referenceSources=sources.map(({id,title,url})=>({id,title,url}));
base.sources=base.sources.map(({id,title,url})=>({id,title,url}));
const data={base,pages,walkthroughs,sources:referenceSources,overviewSvg:overview.svg,diagrams,originalSvg:originalReader.svg,meta,readerEdition};
const template=fs.readFileSync(path.join(root,'shell.html.template'),'utf8');
const css=fs.readFileSync(path.join(root,'styles.css'),'utf8');
const script=fs.readFileSync(path.join(root,'app.js'),'utf8');
if(/<\/script/i.test(script)||/<\/style/i.test(css))throw Error('Unsafe inline closing tag');
const payload=JSON.stringify(data).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
const html=template.replace('/*APP_STYLE*/',()=>css).replace('/*SITE_DATA*/',()=>payload).replace('/*APP_SCRIPT*/',()=>script);
if(/\/\*(APP_STYLE|SITE_DATA|APP_SCRIPT)\*\//.test(html))throw Error('Unexpanded placeholder');
const output=path.join(htmlDir,'01-进行中',`豆包汽车-业务学习站-${version}.html`);
fs.writeFileSync(output,html,{flag:'wx'});
fs.writeFileSync(path.join(root,'site-data.json'),JSON.stringify(data,null,2));
fs.writeFileSync(path.join(root,'diagram-geometry.json'),JSON.stringify({flows:diagramGeometry,overview:{nodes:overview.nodes,edges:overview.edges,routes:overview.routes}},null,2));
const counts={modules:pages.length,oldNodes:base.modules.reduce((a,m)=>a+m.nodes.length,0),originalEdges:base.edges.length,sourceIds:sources.length,toolRows:base.tools.length,supplementalDefinitions:base.supplementalDefinitions.length,chapters:pages.reduce((a,p)=>a+p.sections.length,0),flows:Object.keys(diagrams).length,cases:pages.reduce((a,p)=>a+p.cases.length,0),questions:pages.reduce((a,p)=>a+p.questions.length,0),metrics:pages.reduce((a,p)=>a+p.metrics.length,0),directions:pages.reduce((a,p)=>a+p.roadmap.length,0),walkthroughs:walkthroughs.length,walkthroughSteps:walkthroughs.reduce((total,w)=>total+w.steps.length,0)};
counts.teachingLessons=pages.reduce((n,p)=>n+p.teaching.lessons.length,0);
counts.diagramGuides=pages.reduce((n,p)=>n+Object.keys(p.teaching.guides).length,0);
Object.assign(counts,readerEdition);
const manifest={version,output,sha256:crypto.createHash('sha256').update(html).digest('hex'),bytes:Buffer.byteLength(html),counts,builtAt:meta.builtAt,verificationStatus:'pending'};
fs.writeFileSync(path.join(root,'latest-build.json'),JSON.stringify(manifest,null,2));
console.log(JSON.stringify(manifest,null,2));
