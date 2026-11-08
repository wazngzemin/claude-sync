import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {validateGeometry} from './diagrams.mjs';
const require=createRequire(import.meta.url);
const {JSDOM,VirtualConsole}=require('/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/jsdom');
const root=path.dirname(fileURLToPath(import.meta.url));
const read=name=>JSON.parse(fs.readFileSync(path.join(root,name),'utf8'));
const manifest=read('latest-build.json'),data=read('site-data.json'),geo=read('diagram-geometry.json');
const html=fs.readFileSync(manifest.output,'utf8');
const results=[];
function check(name,ok,details=''){results.push({name,pass:!!ok,...(details?{details}:{} )});if(!ok)console.log('FAIL',name,details);}
const pageIds=new Set(data.pages.map(p=>p.id));
const sourceIds=new Set(data.sources.map(s=>s.id));
const walkthroughIds=new Set((data.walkthroughs||[]).map(item=>item.id));
check('Four complete business walkthroughs retained',data.walkthroughs?.length===4&&walkthroughIds.size===4);
check('48 scenario steps with evidence and exception branches',data.walkthroughs?.reduce((n,item)=>n+item.steps.length,0)===48);
for(const item of data.walkthroughs||[]){
 check(item.id+' scenario boundary and sources',item.scope.length>50&&item.boundary.length>50&&item.sourceIds.every(id=>sourceIds.has(id)));
 for(const step of item.steps){
  check(item.id+'/'+step.id+' complete business contract',['actor','input','decision','output','next','evidence','failure'].every(field=>typeof step[field]==='string'&&step[field].length>0)&&step.known.length&&step.unknown.length);
  check(item.id+'/'+step.id+' module and source references',step.moduleIds.every(id=>pageIds.has(id))&&step.sourceIds.every(id=>sourceIds.has(id)));
 }
}
const eventPack=read('content/event-register.json');
check('12 event source worksheets retain read-range notes',eventPack.sources.length===12&&eventPack.sources.every(s=>s.note.includes('范围')||s.note.includes('返回')));
const registerSections=eventPack.pageAdditions.EV.sections;
const eventRows=registerSections.filter(s=>!['EV-register-scope','EV-register-empty'].includes(s.id)).flatMap(s=>s.table?.rows||[]);
check('66 source event definition rows preserved, not declared online capabilities',eventRows.length===66&&registerSections[0].paragraphs.join('').includes('64'));
check('Unsupported source events remain explicitly unsupported',eventRows.some(r=>r[0].includes('tri_boarding')&&r[0].includes('未支持'))&&eventRows.some(r=>r[0].includes('tri_seatbelt')&&r[0].includes('未支持')));
check('Duplicate Advisor event IDs remain visible instead of silently renamed',eventRows.filter(r=>r[0].includes('dyna_advisor_002')).length===2);
check('24 complete module pages including specialist Driver Agent',data.pages.length===24&&pageIds.size===24&&pageIds.has('DR'));
check('291 original detailed nodes retained',data.base.modules.reduce((n,m)=>n+m.nodes.length,0)===291);
check('40 source-table rows plus 6 separate definitions',data.base.tools.length===40&&data.base.supplementalDefinitions.length===6);
check('All original graph edges retained',data.base.edges.length===459);
check('Complete 322-entry query inventory remains separate from reviewed sources',data.coverage.inventory?.length===322&&data.coverage.inventoryStatus?.scanComplete===true);
const sourceToken=url=>String(url).split(/[?#]/)[0].replace(/\/$/,'').split('/').at(-1);
check('Source matching ignores query strings and anchors',data.coverage.inventory.every(item=>{
 const expected=data.sources.filter(s=>sourceToken(s.url)===sourceToken(item.url)).map(s=>s.id);
 return expected.every(id=>item.sourceIds.includes(id));
}));
check('No external script or stylesheet dependencies',!/<script[^>]+src=|<link[^>]+rel=["']stylesheet/.test(html));
check('No build placeholders',!/\/\*(SITE_DATA|APP_STYLE|APP_SCRIPT)\*\//.test(html));
check('No raw credential assignments in delivered data',!/(?:app_secret|user_access_token|tenant_access_token|Authorization)\s*["']?\s*[:=]\s*["'](?:Bearer\s+)?[a-zA-Z0-9_-]{12}/i.test(JSON.stringify(data)));
check('No disposable login tokens copied into delivered links',!/[?&](?:disposable_login_token|access_token|refresh_token)=/i.test(JSON.stringify(data)));
check('Source sweep retains 322 original identities',data.coverage.expansionAudit?.items.length===322&&new Set(data.coverage.expansionAudit.items.map(x=>x.index)).size===322);
check('Sweep processing is not claimed as complete company-wide reading',data.coverage.expansionAudit?.summary.sweep?.meaning.includes('绝不等于全文审读数'));
check('Original 180-source candidate denominator is retained',data.coverage.expansionAudit?.summary.originalSourceCandidateScope.count===180);
check('Historical quality targets keep unfilled actuals and project limits',data.pages.find(p=>p.id==='E').metrics.filter(m=>['强多轮任务闭环率','工具错误应答满意率'].includes(m.name)).every(m=>m.targetStatus.includes('更新时间为空')&&m.targetStatus.includes('待核')));
const guiFlow=data.pages.find(p=>p.id==='E').flows.find(f=>f.id==='E-gui-state-flow');
check('GUI new-task branch requires explicit new intent',guiFlow.edges.some(e=>e.from==='GS2'&&e.to==='GS3'&&e.label.includes('新办意图明确')));
check('Unmatched GUI supplements or cancellations cannot silently create a task',guiFlow.edges.some(e=>e.from==='GS2'&&e.to==='GS10'&&e.planned)&&guiFlow.nodes.find(n=>n.id==='GS10')?.status==='验收建议');
check('GUI progress and unknown feedback can return without marking terminal success',guiFlow.edges.some(e=>e.from==='GS4'&&e.to==='GS9'&&e.label.includes('保留目标'))&&guiFlow.edges.some(e=>e.from==='GS7'&&e.to==='GS4'));
check('Missing perception input has a recorded failure path instead of disappearing',data.pages.find(p=>p.id==='SE').flows.find(f=>f.id==='SE-two-stage-evaluation').edges.some(e=>e.from==='TS3'&&e.to==='TS7'&&e.label.includes('不归作 Planner')));
for(const entry of data.coverage.newFlowEntries||[]){
 const flow=data.pages.find(p=>p.id===entry.moduleId).flows.find(f=>f.id===entry.id);
 check(entry.id+' source/version boundary is preserved inside the SVG',!!flow.scopeLabel&&data.diagrams[flow.id].includes(flow.scopeLabel));
}
for(const p of data.pages){
 check(p.id+' explained, not a fallback',p.summary.length>20&&p.why.problem&&p.why.cause&&p.sections.length>=5&&p.cases.length>=1&&p.questions.length>=4&&p.metrics.length>=4&&p.roadmap.length>=2);
 check(p.id+' source references resolve',p.sourceIds.length>0&&p.sourceIds.every(s=>sourceIds.has(s)));
 check(p.id+' related modules resolve',p.related.every(r=>pageIds.has(r.id)));
 check(p.id+' actionable roadmaps with status',p.roadmap.every(r=>r.status&&r.change&&r.why&&r.verify&&r.sourceIds.length));
 if(['K','EV','EL','SE','DR'].includes(p.id))check(p.id+' deep-topic coverage',p.sections.length>=6&&p.sections.every(s=>s.paragraphs.join('').length>=200)&&p.flows.length>=2&&p.cases.length>=2&&p.questions.length>=5&&p.metrics.length>=4&&p.roadmap.length>=3);
 for(const f of p.flows){
  const ids=new Set(f.nodes.map(n=>n.id));
  check(f.id+' endpoints and unique ids',ids.size===f.nodes.length&&f.edges.every(e=>ids.has(e.from)&&ids.has(e.to)));
  check(f.id+' bounded readable flow',f.nodes.length<=12&&f.nodes.length>=4&&f.nodes.every(n=>n.title&&n.body?.length));
  check(f.id+' no box overlap or line through unrelated node',validateGeometry(geo.flows[f.id]).length===0,validateGeometry(geo.flows[f.id]).join('; '));
  check(f.id+' SVG present',data.diagrams[f.id]?.includes('<svg'));
 }
}
check('Overview covers every authored module',geo.overview.nodes.length===pageIds.size&&geo.overview.nodes.every(n=>pageIds.has(n.id)));
check('Overview nodes and routes avoid unrelated boxes',validateGeometry(geo.overview).length===0,validateGeometry(geo.overview).join('; '));
check('Planner can answer without calling tools',geo.overview.edges.some(([from,to])=>from==='D'&&to==='O'));
const seen=new Set(['V']);for(let i=0;i<pageIds.size;i++)for(const [a,b]of geo.overview.edges)if(seen.has(a)||seen.has(b)){seen.add(a);seen.add(b);}
check('Overview is connected',seen.size===pageIds.size);

const errors=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>{if(!/navigation \(except hash changes\)/.test(e.message))errors.push(e.message);});
const exports=[];
const dom=new JSDOM(html,{url:'https://offline-validation.invalid/index.html',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){
 w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
 w.URL.createObjectURL=b=>{exports.push(b);return 'blob:offline-validation';};w.URL.revokeObjectURL=()=>{};
}});
const w=dom.window,d=w.document,api=w.CockpitLearningSite;
const settle=()=>new Promise(resolve=>setTimeout(resolve,24));
await settle();
check('App booted without route exception',!!api&&!w.__siteLastError);
check('All authored pages are present without fallbacks',api?.getPages().length===pageIds.size&&api?.getPages().every(p=>!p.fallback&&!p.missing));
async function go(hash){api.navigate(hash);await settle();if(w.__siteLastError)throw Error(JSON.stringify(w.__siteLastError));}
await go('#walkthrough');
check('Walkthrough index renders all four scenarios',d.querySelectorAll('[data-walkthrough-entry]').length===4);
check('Walkthrough navigation exists on the sidebar',!!d.querySelector('#sidebar-content a[href="#walkthrough"]'));
for(const item of data.walkthroughs||[]){
 await go('#walkthrough/'+item.id);
 check(item.id+' full scenario heading and educational boundary',d.querySelector('h1')?.textContent===item.title&&d.querySelector('#page-root').textContent.includes('非线上运行日志'));
 check(item.id+' keeps every step visible in the article',d.querySelectorAll('[data-walkthrough-step]').length===item.steps.length);
 check(item.id+' renders all six handoff evidence fields',d.querySelectorAll('[data-walkthrough-field]').length===item.steps.length*6);
 for(const step of item.steps){
  const el=d.querySelector(`[data-walkthrough-step="${step.id}"]`);
  check(item.id+'/'+step.id+' renders source and module links',!!el&&step.moduleIds.every(id=>!!el.querySelector(`a[href="#module/${id}"]`))&&step.sourceIds.every(id=>!!el.querySelector(`a[href="#source/${id}"]`)));
  check(item.id+'/'+step.id+' is searchable',api.search(step.id,'walkthrough').some(result=>result.href.endsWith('/step/'+step.id)));
 }
 const step=item.steps[5];await go('#walkthrough/'+item.id+'/step/'+step.id);
 check(item.id+' step deep link preserves whole scenario and focuses correct step',d.querySelectorAll('[data-walkthrough-step]').length===item.steps.length&&d.activeElement?.dataset.walkthroughStep===step.id);
 await go('#walkthrough/'+item.id+'/notes');
 const editor=d.querySelector(`[data-note-key="walkthrough:${item.id}"]`);
 if(editor){editor.value='走查笔记：受理不等于真实完成。';editor.dispatchEvent(new w.Event('input',{bubbles:true}));await settle();}
 check(item.id+' dedicated local note persists',api.getState().notes['walkthrough:'+item.id]?.text==='走查笔记：受理不等于真实完成。');
}
await go('#module/EV');
check('Event register chapter and conflicts render with full source links',d.querySelector('#page-root').textContent.includes('dyna_advisor_002')&&d.querySelector('#page-root').textContent.includes('hmi_sysnavi_oute_select')&&!!d.querySelector('a[href="#source/ER-JjAZED"]'));
check('Event IDs search directly to the relevant chapter',api.search('dyna_advisor_002','chapter').some(result=>result.href==='#module/EV/section/EV-register-advisor'));
await go('#module/EV/section/EV-register-advisor');
check('Event chapter deep link resolves to full detail',d.querySelector('.highlight-target')?.textContent.includes('dyna_advisor_002'));
await go('#module/DR');
check('Driver Agent has its own sidebar entry and explains the separate auto_drive responsibility',!!d.querySelector('#sidebar-content a[href="#module/DR"]')&&[...d.querySelectorAll('[data-teaching-lesson] p')].some(p=>p.textContent.includes('司机 Agent 接住导航与停泊车的专项关系')&&p.textContent.includes('auto_drive 承接具体智驾控制')));
check('Driver Agent retains D2D, POI stop and cancel-before-change flows',['DR-d2d-flow','DR-poi-flow','DR-change-flow'].every(id=>!!d.querySelector('#flow-'+id)));
check('End-cloud ASR and independent audio return flows exist',data.pages.find(p=>p.id==='R').flows.some(f=>f.id==='R-endcloud-input')&&data.pages.find(p=>p.id==='O').flows.some(f=>f.id==='O-endcloud-speech'));
check('Audio generation does not depend on text being displayed',data.pages.find(p=>p.id==='O').flows.find(f=>f.id==='O-endcloud-speech').edges.some(e=>e.from==='OC1'&&e.to==='OC4')&&!data.pages.find(p=>p.id==='O').flows.find(f=>f.id==='O-endcloud-speech').edges.some(e=>e.from==='OC3'&&e.to==='OC4'));
for(const p of data.pages){
 await go('#module/'+p.id);
 check(p.id+' rendered article heading',d.querySelector('h1')?.textContent===p.title);
 check(p.id+' rendered chapters and cases',d.querySelectorAll('.case-article').length===p.cases.length&&d.querySelectorAll('.question-item').length===p.questions.length);
 const base=data.base.modules.find(m=>m.id===p.id);
 if(base){
  check(p.id+' full original node list',d.querySelectorAll('[data-base-node]').length===base.nodes.length);
  check(p.id+' detailed original diagram remains visible',!!d.querySelector('#detailed-flow svg'));
 }
 const target=p.flows[0].nodes[0];
 await go('#module/'+p.id+'/flow/'+p.flows[0].id+'/step/'+target.id);
 check(p.id+' flow step deep link',!![...d.querySelectorAll('.flow-step')].find(n=>n.textContent.includes(target.title)));
 const source=p.sourceIds[0];
 check(p.id+' source link reachable',!!d.querySelector(`a[href="#source/${source}"]`));
}
// Every tool is inexpensive to render and must retain its actual contract.
for(const tool of [...data.base.tools,...data.base.supplementalDefinitions]){
 await go('#tool/'+tool.id);
 check(tool.id+' full contract route',d.querySelector('h1')?.textContent.includes(tool.label||tool.name)&&!!d.querySelector('#input')&&!!d.querySelector('#mechanism')&&!!d.querySelector('#output')&&!!d.querySelector('#completion'));
}
// Check one real detailed node from each original module; all endpoints were checked structurally above.
for(const m of data.base.modules){const n=m.nodes[0];await go('#node/'+n.id);check(n.id+' detailed node route and contract',d.querySelector('h1')?.textContent===n.title&&d.querySelector('#page-root').textContent.includes(n.detail));}
await go('#sources');check('Coverage and limitations visible',d.querySelector('#page-root').textContent.includes('322')&&d.querySelector('#page-root').textContent.includes('不是')&&d.querySelectorAll('.source-item').length===data.sources.length);
check('Per-batch full, partial, index and failed states remain visible',d.querySelector('#source-sweep')?.textContent.includes('不能合称')&&d.querySelector('#source-sweep')?.textContent.includes('局部'));
await go('#home');
for(const flow of data.coverage.newFlowEntries||[])check(flow.id+' new flow has a home entry',!!d.querySelector(`a[href="#module/${flow.moduleId}/flow/${flow.id}"]`));
for(const flow of data.coverage.newFlowEntries||[]){
 await go('#module/'+flow.moduleId+'/flow/'+flow.id);
 check(flow.id+' newly authored full diagram and detailed steps render',!!d.querySelector('#flow-'+flow.id+' svg')&&d.querySelector('#flow-'+flow.id)?.textContent.includes(flow.title));
}
await go('#module/E/flow/E-gui-state-flow');
d.querySelector('#flow-E-gui-state-flow [data-open-diagram]').click();await settle();
check('Zoomed diagram keeps historical scope and source caveats visible',d.querySelector('#diagram-dialog-caption')?.textContent.includes('历史机制图')&&d.querySelector('#diagram-dialog-caption')?.textContent.includes('验收建议'));
d.querySelector('#diagram-close').click();await settle();
await go('#sources');
check('Research notes are readable prose rather than raw JSON',!d.querySelector('#research-notes')?.textContent.includes('"sourceIds"')&&d.querySelector('#research-notes')?.textContent.includes('事件日志模板逐表审读'));
for(const id of ['K','EV','EL','SE'])check(id+' appears in relevant search',api.search({K:'Memory',EV:'事件',EL:'事件日志',SE:'自进化'}[id]).some(x=>x.id===id));
for(const n of data.base.modules.flatMap(m=>m.nodes))check(n.id+' indexed for search',api.search(n.id).some(x=>x.id===n.id));
await go('#search?q='+encodeURIComponent('工具反馈'));check('Search results rendered',d.querySelectorAll('.search-result').length>0);
await go('#module/K');
const note=d.querySelector('[data-note-key="module:K"]');note.value='验收记录：已生成 ≠ 已召回 ≠ 已采用。';note.dispatchEvent(new w.Event('input',{bubbles:true}));await settle();
check('Notes persist in local state',api.getState().notes['module:K']?.text===note.value&&w.localStorage.length>0);
d.querySelector('[data-complete="K"]').click();await settle();check('Completion is explicit, not inferred from views',api.getState().completed.includes('K')&&!api.getState().completed.includes('EV'));
api.exportNotes();check('Markdown notes export creates a file payload',exports.length===1);
await go('#study');check('Saved note appears in study page',d.querySelector('#page-root').textContent.includes('已生成 ≠ 已召回'));
await go('#map');check('Overview and original detailed graph both present',d.querySelectorAll('.svg-shell svg').length===2);
const canvas=d.querySelector('#diagram-canvas');
Object.defineProperty(canvas,'clientWidth',{configurable:true,value:1480});
Object.defineProperty(canvas,'clientHeight',{configurable:true,value:800});
canvas.scrollLeft=400;canvas.scrollTop=300;
d.querySelector('[data-open-diagram^="original-map-"]').click();await settle();check('Diagram modal opens',!d.querySelector('#diagram-modal').hidden&&!!d.querySelector('#diagram-canvas svg'));
check('Full map initially stays at top-left instead of jumping to center',canvas.scrollLeft===0&&canvas.scrollTop===0);
canvas.scrollLeft=125;canvas.scrollTop=200;
const before=d.querySelector('#diagram-canvas svg').style.width;d.querySelector('[data-modal-zoom="in"]').click();check('Diagram zoom changes display width',d.querySelector('#diagram-canvas svg').style.width!==before);
check('User-requested zoom preserves the current viewport center',canvas.scrollLeft>125&&canvas.scrollTop>200);
d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));check('Escape closes modal',d.querySelector('#diagram-modal').hidden);
d.querySelector('#menu-toggle').click();check('Mobile menu action opens accessible navigation',d.body.classList.contains('nav-open')&&d.querySelector('#menu-toggle').getAttribute('aria-expanded')==='true');
d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));check('Escape closes navigation',!d.body.classList.contains('nav-open'));
await go('#module/SE');await go('#module/EL');w.history.back();await new Promise(r=>setTimeout(r,60));check('Browser-style hash history back',api.getRoute().parts[0]==='SE');w.history.forward();await new Promise(r=>setTimeout(r,60));check('Browser-style hash history forward',api.getRoute().parts[0]==='EL');
check('No offline DOM runtime errors',errors.length===0,errors.join('\n'));
dom.window.close();
const report={version:manifest.version,output:manifest.output,scope:'结构、来源、SVG 几何与离线 JSDOM 交互。JSDOM 不渲染页面，不能替代真实浏览器视觉验收。',passed:results.filter(r=>r.pass).length,failed:results.filter(r=>!r.pass).length,results,limitations:['未将公司全库搜索命中冒充全文阅读。','未取得全部车型的当前发布配置和实车结果。','真实浏览器渲染需单独核验；不得以此报告宣称已完成。'],checkedAt:new Date().toISOString()};
fs.writeFileSync(path.join(root,'verification-'+manifest.version+'.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({version:report.version,passed:report.passed,failed:report.failed,limitations:report.limitations},null,2));
if(report.failed)process.exitCode=1;
