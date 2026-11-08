import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {JSDOM,VirtualConsole}=require('/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/jsdom');
const root=path.dirname(fileURLToPath(import.meta.url));
const data=JSON.parse(fs.readFileSync(path.join(root,'site-data.json'),'utf8'));
const manifest=JSON.parse(fs.readFileSync(path.join(root,'latest-build.json'),'utf8'));
const results=[];
const check=(name,pass,details='')=>results.push({name,pass:!!pass,...(details?{details}:{})});
const allNodes=new Map(data.base.modules.flatMap(m=>m.nodes.map(n=>[n.id,{...n,moduleId:m.id}])));
const baseEdges=new Set(data.base.edges.map(e=>e.from+'>'+e.to));
const pathReview=[];
let paragraphs=0;
for(const p of data.pages){
 const t=p.teaching;
 check(p.id+' has a connected teaching narrative',t?.intro.length>=2&&t.lessons.length>=3&&t.closing.length>0);
 const covered=new Set(t.lessons.flatMap(l=>l.covers));
 check(p.id+' original chapters accounted for',p.sections.every(s=>covered.has(s.id)));
 for(const [key,g]of Object.entries(t.guides)){
  paragraphs+=g.paragraphs.length;
  const flow=p.flows.find(f=>f.id===key);
  const ids=key==='base'?new Set(allNodes.keys()):new Set(flow.nodes.map(n=>n.id));
  const edgeSet=key==='base'?baseEdges:new Set(flow.edges.map(e=>e.from+'>'+e.to));
  check(p.id+'/'+key+' substantive guide with real node identifiers',g.paragraphs.length>=4&&g.nodeIds.length>0&&g.nodeIds.every(id=>ids.has(id)));
  check(p.id+'/'+key+' declared identifiers appear in the explanation',g.nodeIds.every(id=>g.paragraphs.join('\n').includes(id)));
  for(const text of g.paragraphs){
   const sequences=text.match(/[A-Z][A-Za-z0-9_-]*(?:\s*→\s*[A-Z][A-Za-z0-9_-]*)+/g)||[];
   for(const sequence of sequences){
    const route=sequence.split(/\s*→\s*/);
    for(let i=0;i<route.length-1;i++){
     if(!ids.has(route[i])&&!ids.has(route[i+1]))continue;
     if(edgeSet.has(route[i]+'>'+route[i+1]))continue;
     // Explicit corrections are not claims that a nonexistent edge exists.
     const start=text.indexOf(sequence);
     const context=text.slice(Math.max(0,start-50),start+sequence.length+55);
     const denied=/没有|不能读成|并无|不存在|不要.*读成/.test(context);
     pathReview.push({module:p.id,guide:key,from:route[i],to:route[i+1],denied,context});
     check(p.id+'/'+key+' route '+route[i]+'>'+route[i+1]+' is a stated correction',denied,context);
    }
   }
  }
 }
}
const errors=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
const dom=new JSDOM(fs.readFileSync(manifest.output,'utf8'),{url:'https://offline-teaching-validation.invalid/',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});}});
const w=dom.window,d=w.document;
const settle=()=>new Promise(r=>setTimeout(r,24));
await settle();
const go=async hash=>{w.CockpitLearningSite.navigate(hash);await settle();};
const closedAncestors=el=>{const out=[];for(let a=el?.parentElement;a;a=a.parentElement)if(a.tagName==='DETAILS'&&!a.open)out.push(a);return out;};
check('Home begins with a continuous whole-course explanation',d.querySelector('#course-lecture .lecture-prose')?.textContent.includes('昨天那家游泳馆'));
check('Home explains every module in the same business story',data.pages.every(p=>d.querySelector(`#course-lecture a[href="#module/${p.id}"]`)));
for(const p of data.pages){
 await go('#module/'+p.id);
 check(p.id+' renders all lessons without requiring expansion',d.querySelectorAll('[data-teaching-lesson]').length===p.teaching.lessons.length&&[...d.querySelectorAll('[data-teaching-lesson]')].every(e=>closedAncestors(e).length===0));
 check(p.id+' legacy chapters resolve to a new lesson or rule table',p.sections.every(s=>d.getElementById('content-'+s.id)||d.getElementById(p.legacyChapterTargets[s.id])));
 check(p.id+' source records do not flood the reading table of contents',![...d.querySelectorAll('#page-toc a')].some(a=>a.dataset.scrollTo?.startsWith('content-')));
 for(const key of Object.keys(p.teaching.guides)){
  const el=d.querySelector(`[data-diagram-guide="${key}"]`);
  check(p.id+'/'+key+' explanation directly follows its diagram',el?.previousElementSibling?.classList.contains('flow-figure')&&closedAncestors(el).length===0);
  check(p.id+'/'+key+' paragraphs and node links render',el?.querySelectorAll('p').length===p.teaching.guides[key].paragraphs.length&&el.querySelectorAll('.guide-node-link').length>0);
 }
 const flow=p.flows[0];const node=flow.nodes[0];
 await go('#module/'+p.id+'/flow/'+flow.id+'/step/'+node.id);
 const target=d.getElementById('step-'+flow.id+'-'+node.id);
 check(p.id+' flow deep link opens its folded node record',target&&closedAncestors(target).length===0&&target.classList.contains('highlight-target'));
 const first=p.sections[0];
 await go('#module/'+p.id+'/section/'+first.id);
 const section=d.getElementById('content-'+first.id)||d.getElementById(p.legacyChapterTargets[first.id]);
 check(p.id+' older chapter deep link opens its new teaching destination',section&&closedAncestors(section).length===0&&section.classList.contains('highlight-target'));
 const original=data.base.modules.find(m=>m.id===p.id)?.nodes[0];
 if(original){
  await go('#module/'+p.id+'/node/'+original.id);
  const el=d.getElementById('base-node-'+original.id);
  check(p.id+' original node deep link opens both disclosure levels',el?.open&&closedAncestors(el).length===0);
 }
}
await go('#module/V');
const visibleLecture=[...d.querySelectorAll('.lecture-prose')].map(e=>e.textContent).join('\n');
check('Screenshot audit asides removed from the spoken lesson',!['AIVA 端云语义规则另有','车内 PRD 提到 5/6 座','OnePager 给出分类型词量'].some(text=>visibleLecture.includes(text)));
check('Voice lesson explains the actual V12 R1 R12 C5 and V8 V18 distinction',visibleLecture.includes('V12 → R1')&&visibleLecture.includes('V8 → V18')&&visibleLecture.includes('R12'));
d.querySelector('#detailed-flow [data-open-diagram]').click();await settle();
check('Enlarged detail diagram keeps the connected explanation beside it',!d.querySelector('#diagram-reading').hidden&&d.querySelector('#diagram-reading').textContent.includes('V12 → R1')&&d.querySelector('#diagram-content').classList.contains('has-reading'));
check('Enlarged diagram source asides are optional',!d.querySelector('#diagram-evidence').open&&d.querySelector('#diagram-dialog-caption').textContent.length>0);
d.querySelector('#diagram-reading-toggle').click();await settle();
check('Reader can give the enlarged diagram full width',d.querySelector('#diagram-reading').hidden&&!d.querySelector('#diagram-content').classList.contains('has-reading'));
d.querySelector('#diagram-reading-toggle').click();await settle();
check('Reader can restore the explanation without leaving the diagram',!d.querySelector('#diagram-reading').hidden&&d.querySelector('#diagram-reading-toggle').getAttribute('aria-expanded')==='true');
d.querySelector('#diagram-close').click();await settle();
check('No JavaScript errors during teaching routes',errors.length===0&&!w.__siteLastError,errors.join('\n'));
dom.window.close();
const report={version:manifest.version,environment:'Offline JSDOM and graph-identity checks; not browser layout acceptance',counts:{modules:data.pages.length,lessons:data.pages.reduce((n,p)=>n+p.teaching.lessons.length,0),guides:data.pages.reduce((n,p)=>n+Object.keys(p.teaching.guides).length,0),guideParagraphs:paragraphs},pass:results.filter(r=>r.pass).length,fail:results.filter(r=>!r.pass).length,pathReview,results};
fs.writeFileSync(path.join(root,'teaching-verification-'+manifest.version+'.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({version:report.version,counts:report.counts,pass:report.pass,fail:report.fail,failures:results.filter(r=>!r.pass),pathReview},null,2));
if(report.fail)process.exitCode=1;
