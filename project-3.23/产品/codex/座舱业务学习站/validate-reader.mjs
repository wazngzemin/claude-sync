#!/usr/bin/env node
// Run after build.mjs. This validates the delivered HTML, not a stale site-data.json.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';

const root=path.dirname(fileURLToPath(import.meta.url));
const require=createRequire(import.meta.url);
const argv=process.argv.slice(2);
if(argv.includes('--help')){
 console.log('Usage: node validate-reader.mjs [--manifest path] [--report path] [--no-report]\nDefaults to latest-manifest.json, with latest-build.json as the existing build compatibility fallback.');
 process.exit(0);
}
function option(name){const i=argv.indexOf(name);if(i<0)return null;if(!argv[i+1]||argv[i+1].startsWith('--'))throw Error('Missing value for '+name);return path.resolve(argv[i+1]);}
const explicitManifest=option('--manifest');
const manifestPath=explicitManifest||['latest-manifest.json','latest-build.json'].map(name=>path.join(root,name)).find(file=>fs.existsSync(file));
if(!manifestPath)throw Error('Build first: no latest-manifest.json or latest-build.json exists.');
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const manifest=read(manifestPath);
const output=path.resolve(path.dirname(manifestPath),manifest.output);
const html=fs.readFileSync(output,'utf8');
const payload=html.match(/<script\b[^>]*>\s*const\s+DATA\s*=\s*([\s\S]*?);\s*<\/script\s*>/i);
if(!payload)throw Error('Delivered HTML has no parseable inline DATA payload.');
const data=JSON.parse(payload[1]);
const {JSDOM,VirtualConsole}=(()=>{
 for(const name of [process.env.JSDOM_PATH,'jsdom','/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/jsdom'].filter(Boolean)){
  try{return require(name);}catch(error){if(error.code!=='MODULE_NOT_FOUND')throw error;}
 }
 throw Error('JSDOM is unavailable. Set JSDOM_PATH to the installed jsdom module directory.');
})();
const started=Date.now(),results=[],runtimeErrors=[],visits=[];
const counts={modules:0,nodes:0,tools:0,walkthroughs:0,walkthroughSteps:0,stepDeepLinks:0,legacyChapters:0,guides:0,parsedSvgs:0};
const check=(name,pass,details)=>results.push({name,pass:!!pass,...(details===undefined?{}:{details})});
const arr=value=>Array.isArray(value)?value:[];
const uid=value=>String(value).replace(/[^\w\u4e00-\u9fff-]/g,'-');
const plain=value=>String(value??'').replace(/`|\*\*/g,'').replace(/\s+/g,'');
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const setSame=(a,b)=>same([...new Set(a)].sort(),[...new Set(b)].sort());
const pages=arr(data.pages),modules=arr(data.base?.modules);
const nodes=modules.flatMap(module=>arr(module.nodes).map(node=>({...node,moduleId:module.id})));
const nodeMap=new Map(nodes.map(node=>[node.id,node]));
const tools=[...arr(data.base?.tools),...arr(data.base?.supplementalDefinitions)];
const edges=arr(data.base?.edges),walkthroughs=arr(data.walkthroughs);
const guides=pages.flatMap(page=>Object.entries(page.teaching?.guides||{}).map(([key,guide])=>({page,key,guide})));
const sourceIds=new Set(arr(data.sources).map(source=>source.id));
const pack=name=>read(path.join(root,'content',name+'.json'));
const authoredNodes=[...pack('reader-nodes-main').nodes,...pack('reader-nodes-async').nodes];
const authoredNodeMap=new Map(authoredNodes.map(node=>[node.id,node]));
const authoredTools=pack('reader-tools').tools;
const authoredToolMap=new Map(authoredTools.map(tool=>[tool.id,tool]));
const authoredWalkthroughs=pack('reader-walkthroughs').walkthroughs;
const authoredWalkthroughMap=new Map(authoredWalkthroughs.map(item=>[item.id,item]));
const chapters=pages.flatMap(page=>arr(page.sections).map(section=>({page,section})));

// Source titles remain legitimate inside the source appendix. All reading content,
// including closed node records and tables, is checked outside that appendix.
const asideRules=[
 ['document-title narration',/One\s*Pager|One\s*Page\b|\bPRD\b|标准化\s*PRD|文档/gi],
 ['source-as-author narration',/(?:原文|材料|资料|纪要)(?:中|里|记录|提到|给出|写明|指出|写到|显示|明确|要求|规定|口径|未|没有|不足|仅|可见|补充|另)/g],
 ['reading or version audit',/(?:本轮|本次)(?:读取|检索|审读|核验|回读|复核)|逐表审读|版本审计|审读范围|历史证据缺口/g],
 ['reported screenshot asides',/AIVA\s*端云语义规则另有|9\s*月改版/g]
];
function asideHits(text){
 const hits=[];
 for(const [rule,pattern]of asideRules){
  pattern.lastIndex=0;
  for(const match of String(text).matchAll(pattern)){
   hits.push({rule,text:match[0],context:String(text).slice(Math.max(0,match.index-35),match.index+match[0].length+80)});
   if(hits.length>=20)return hits;
  }
 }
 return hits;
}
const cleanProse=(label,text)=>{const hits=asideHits(text);check(label+' contains business narration without source-audit asides',hits.length===0,hits.length?hits:undefined);};
function paragraphsMatch(container,expected){
 const actual=container?[...container.children].filter(node=>node.tagName==='P').map(node=>plain(node.textContent)):[];
 return same(actual,arr(expected).map(plain));
}
function closedAncestors(element){
 const closed=[];
 for(let ancestor=element?.parentElement;ancestor;ancestor=ancestor.parentElement)if(ancestor.tagName==='DETAILS'&&!ancestor.open)closed.push(ancestor);
 return closed;
}
function nodeNarrationMatches(actual,expected){
 return !!expected&&same(actual.paragraphs,expected.paragraphs)&&actual.title===expected.title&&same(actual.lines,expected.lines)&&same(actual.sourceIds,expected.sourceIds);
}

check('Manifest points at this exact HTML hash',!manifest.sha256||manifest.sha256===crypto.createHash('sha256').update(html).digest('hex'));
check('24 unique module routes',pages.length===24&&new Set(pages.map(page=>page.id)).size===24);
check('291 unique original nodes',nodes.length===291&&nodeMap.size===291);
check('459 real original connections',edges.length===459&&new Set(edges.map(edge=>edge.id)).size===459&&edges.every(edge=>nodeMap.has(edge.from)&&nodeMap.has(edge.to)));
check('46 tool definition routes',tools.length===46&&new Set(tools.map(tool=>tool.id)).size===46);
check('4 full walkthroughs and 48 steps',walkthroughs.length===4&&new Set(walkthroughs.map(item=>item.id)).size===4&&walkthroughs.reduce((n,item)=>n+arr(item.steps).length,0)===48);
check('226 legacy chapters remain addressable',chapters.length===226);
check('62 diagram guides retained',guides.length===62);
check('Reader node pack is the complete 291-node set',authoredNodes.length===291&&authoredNodeMap.size===291&&setSame(authoredNodes.map(n=>n.id),nodes.map(n=>n.id)));
check('Reader tool pack is the complete 46-tool set',authoredTools.length===46&&authoredToolMap.size===46&&setSame(authoredTools.map(t=>t.id),tools.map(t=>t.id)));
check('Delivered page uses the reader edition',data.readerEdition?.rewrittenNodes===291&&data.readerEdition?.rewrittenTools===46&&data.readerEdition?.rewrittenWalkthroughSteps===48);
check('No external script or stylesheet dependency',!/<script[^>]+src=|<link[^>]+rel=["']stylesheet/.test(html));
check('No unexpanded build placeholder',!/\/\*(SITE_DATA|APP_STYLE|APP_SCRIPT)\*\//.test(html));

const originalGraph=path.resolve(root,'../../../whiteboard/豆包汽车-业务全链路-v15/graph-v15.json');
if(fs.existsSync(originalGraph)){
 const original=read(originalGraph);
 const edgeIdentity=list=>list.map(edge=>[edge.id,edge.from,edge.to]).sort((a,b)=>a[0].localeCompare(b[0]));
 check('Reader preserves original edge identities and endpoints',same(edgeIdentity(edges),edgeIdentity(original.edges)));
 check('Reader preserves original node identities',setSame(nodes.map(n=>n.id),original.modules.flatMap(m=>m.nodes.map(n=>n.id))));
 check('Reader preserves original tool identities',setSame(tools.map(t=>t.id),[...original.tools,...original.supplementalDefinitions].map(t=>t.id)));
}else check('Original graph is available for independent identity comparison',false,originalGraph);

for(const node of nodes){
 check(node.id+' embedded data uses its authored reader paragraphs',nodeNarrationMatches(node,authoredNodeMap.get(node.id))&&arr(node.paragraphs).length>=2);
 check(node.id+' sources resolve',arr(node.sourceIds).length>0&&node.sourceIds.every(id=>sourceIds.has(id)));
}
for(const tool of tools){
 const expected=authoredToolMap.get(tool.id);
 check(tool.id+' embedded data uses its authored reader paragraphs',!!expected&&tool.intro===expected.intro&&same(tool.paragraphs,expected.paragraphs)&&tool.status===expected.status&&arr(tool.paragraphs).length>=4);
}
for(const item of walkthroughs){
 const expected=authoredWalkthroughMap.get(item.id);
 check(item.id+' new opening and closing are embedded',!!expected&&same(item.intro,expected.intro)&&same(item.closing,expected.closing));
 for(const step of arr(item.steps)){
  const replacement=expected?.steps.find(candidate=>candidate.id===step.id);
  check(item.id+'/'+step.id+' embedded data uses new step paragraphs',!!replacement&&step.title===replacement.title&&same(step.paragraphs,replacement.paragraphs)&&arr(step.paragraphs).length>=2);
 }
}

// Only the in-memory test copy is instrumented. Disable repeated 291-node SVG
// mounts during text routes, then re-enable the genuine renderer for map/modal
// checks. The original artifact and app.js are never modified.
const mountPattern=/function\s+mountFigures\s*\(scope\s*=\s*root\)\s*\{/g;
const mountMatches=[...html.matchAll(mountPattern)];
check('Exactly one diagram mount function can be instrumented',mountMatches.length===1);
if(mountMatches.length!==1)throw Error('Cannot safely instrument diagram mounts; inspect the new renderer.');
const testHtml=html.replace(mountPattern,match=>match+'\n    if(window.__readerValidationSkipFigures)return;');
const vc=new VirtualConsole();
vc.on('jsdomError',error=>runtimeErrors.push({kind:'jsdomError',message:error.message}));
vc.on('error',(...args)=>runtimeErrors.push({kind:'console.error',message:args.map(String).join(' ')}));
let dom;
try{
 dom=new JSDOM(testHtml,{
  url:'https://offline-reader-validation.invalid/',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,
  beforeParse(window){
   // Same browser gaps as validate-teaching.mjs; no network or persistence calls.
   window.scrollTo=()=>{};
   window.HTMLElement.prototype.scrollIntoView=()=>{};
   window.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
   window.__readerValidationSkipFigures=true;
   window.addEventListener('error',event=>runtimeErrors.push({kind:'window.error',message:event.message}));
   window.addEventListener('unhandledrejection',event=>runtimeErrors.push({kind:'unhandledrejection',message:String(event.reason)}));
  }
 });
 const window=dom.window,document=window.document,api=window.CockpitLearningSite;
 await new Promise(resolve=>setTimeout(resolve,24));
 check('Reader app boots without runtime errors',!!api&&!window.__siteLastError&&runtimeErrors.length===0,runtimeErrors.length?runtimeErrors:undefined);
 if(!api)throw Error('CockpitLearningSite API was not created.');
 const removedControlSelector='textarea,[data-complete],[data-question-check],[data-note-key],[data-note-node],[data-export-notes]';
 function checkControls(route){
  const obsolete=[...document.querySelectorAll(removedControlSelector)].map(element=>element.outerHTML.slice(0,220));
  const notes=[...document.querySelectorAll('a,button')].filter(element=>{
   // An original source called "Release Note" is not a personal-note action.
   if(element.tagName==='A'&&element.closest('.source-list')&&/^https?:\/\//i.test(element.getAttribute('href')||''))return false;
   return /笔记|记笔记|\bnotes?\b/i.test([element.textContent,element.getAttribute('aria-label'),element.getAttribute('href')].filter(Boolean).join(' '))||/^#study(?:[/?]|$)/.test(element.getAttribute('href')||'');
  }).map(element=>element.outerHTML.slice(0,220));
  check(route+' has no note editor, progress controls or note actions',obsolete.length===0&&notes.length===0,obsolete.length||notes.length?{obsolete,notes}:undefined);
 }
 function checkBody(route){
  const body=document.getElementById('page-root')?.cloneNode(true);
  if(!body){check(route+' has a reading body',false);return;}
  body.querySelectorAll('.source-appendix,.source-list,.source-strip,script,style,noscript').forEach(element=>element.remove());
  cleanProse(route+' reading body',body.textContent);
 }
 async function go(route,{scan=true}={}){
  const previousErrorCount=runtimeErrors.length;
  api.navigate(route,true);
  await Promise.resolve();
  const actual=api.getRoute(),parts=route.slice(1).split('/').map(decodeURIComponent);
  check(route+' resolves without runtime or route error',actual.name===parts[0]&&same(actual.parts,parts.slice(1))&&!window.__siteLastError&&runtimeErrors.length===previousErrorCount,window.__siteLastError||runtimeErrors.slice(previousErrorCount)||undefined);
  visits.push(route);checkControls(route);if(scan)checkBody(route);
 }

 await go('#home');
 check('Home keeps continuous course narration',document.querySelector('#course-lecture .lecture-prose')?.textContent.includes('游泳馆'));
 for(const page of pages){
  await go('#module/'+page.id);counts.modules++;
  check(page.id+' module heading renders',document.querySelector('#page-root h1')?.textContent===page.title);
  const lessonElements=[...document.querySelectorAll('[data-teaching-lesson]')];
  check(page.id+' all lessons remain immediately readable',lessonElements.length===page.teaching.lessons.length&&lessonElements.every(element=>closedAncestors(element).length===0));
  for(const lesson of page.teaching.lessons){
   const element=lessonElements.find(candidate=>candidate.dataset.teachingLesson===lesson.id);
   check(page.id+'/'+lesson.id+' renders the whole lesson',paragraphsMatch(element,lesson.paragraphs));
  }
  for(const [key,guide]of Object.entries(page.teaching.guides)){
   const element=[...document.querySelectorAll('[data-diagram-guide]')].find(candidate=>candidate.dataset.diagramGuide===key);
   check(page.id+'/'+key+' guide directly follows its diagram',element?.previousElementSibling?.classList.contains('flow-figure')&&closedAncestors(element).length===0);
   check(page.id+'/'+key+' guide retains every paragraph',paragraphsMatch(element,guide.paragraphs));
   check(page.id+'/'+key+' diagram identifiers remain clickable',arr(guide.nodeIds).length>0&&guide.nodeIds.every(id=>[...element?.querySelectorAll('.guide-node-link')||[]].some(link=>link.textContent===id)));
   counts.guides++;
  }
  const module=modules.find(candidate=>candidate.id===page.id);
  for(const node of arr(module?.nodes)){
   const element=document.getElementById('base-node-'+uid(node.id));
   check(page.id+'/'+node.id+' folded node also uses reader paragraphs',paragraphsMatch(element?.querySelector('.node-body'),authoredNodeMap.get(node.id)?.paragraphs));
  }
 }

 for(const node of nodes){
  await go('#node/'+node.id);counts.nodes++;
  check(node.id+' standalone node shows its own full reader narration',document.querySelector('#page-root h1')?.textContent===node.title&&paragraphsMatch(document.querySelector('#explanation .lecture-prose'),authoredNodeMap.get(node.id)?.paragraphs));
  const expectedAdjacent=new Set(edges.filter(edge=>edge.from===node.id||edge.to===node.id).map(edge=>edge.from===node.id?edge.to:edge.from));
  const actualAdjacent=[...document.querySelectorAll('#connections a[href^="#node/"]')].map(link=>decodeURIComponent(link.getAttribute('href').slice(6)));
  check(node.id+' adjacency links match real graph edges',setSame(actualAdjacent,[...expectedAdjacent]));
 }
 await go('#tools');
 check('All 46 tool routes are available in the catalog',tools.every(tool=>document.querySelector(`a[href="#tool/${tool.id}"]`)));
 for(const tool of tools){
  await go('#tool/'+tool.id);counts.tools++;
  check(tool.id+' tool route shows its full new mechanism paragraphs',document.querySelector('#page-root h1')?.textContent===(tool.label||tool.name)&&paragraphsMatch(document.querySelector('#mechanism .lecture-prose'),authoredToolMap.get(tool.id)?.paragraphs));
  check(tool.id+' tool intro and business conditions remain visible',plain(document.getElementById('page-root').textContent).includes(plain(tool.intro))&&plain(document.getElementById('scope')?.textContent).includes(plain(tool.status)));
 }
 await go('#walkthrough');
 check('Walkthrough index exposes all four scenes',document.querySelectorAll('[data-walkthrough-entry]').length===4);
 for(const item of walkthroughs){
  await go('#walkthrough/'+item.id);counts.walkthroughs++;
  const stepElements=[...document.querySelectorAll('[data-walkthrough-step]')];
  check(item.id+' retains all steps in one readable article',stepElements.length===item.steps.length&&stepElements.every(element=>closedAncestors(element).length===0));
  for(const step of item.steps){
   const element=stepElements.find(candidate=>candidate.dataset.walkthroughStep===step.id);
   const expected=authoredWalkthroughMap.get(item.id)?.steps.find(candidate=>candidate.id===step.id);
   check(item.id+'/'+step.id+' renders the new connected step paragraphs',paragraphsMatch(element?.querySelector('.lecture-prose'),expected?.paragraphs));
   counts.walkthroughSteps++;
  }
  for(const step of item.steps){
   await go('#walkthrough/'+item.id+'/step/'+step.id,{scan:false});counts.stepDeepLinks++;
   const target=document.querySelector('.highlight-target');
   check(item.id+'/'+step.id+' step link keeps the full scene and focuses the correct step',target?.dataset.walkthroughStep===step.id&&document.activeElement===target&&document.querySelectorAll('[data-walkthrough-step]').length===item.steps.length);
  }
 }
 for(const {page,section}of chapters){
  await go('#module/'+page.id+'/section/'+encodeURIComponent(section.id),{scan:false});counts.legacyChapters++;
  const lesson=page.teaching.lessons.find(candidate=>arr(candidate.covers).includes(section.id));
  const target=document.querySelector('.highlight-target');
  const reference=arr(page.referenceTables).some(item=>item.id===section.id);
  const allowed=new Set([lesson?.id,...(reference?['content-'+uid(section.id)]:[])]);
  check(page.id+'/'+section.id+' old chapter link opens the replacement lesson or reference table',!!target&&allowed.has(target.id)&&closedAncestors(target).length===0,{actual:target?.id||null,expected:[...allowed].filter(Boolean)});
 }

 // Parse every SVG independently of route mounting, including its real data IDs.
 function parseSvg(key,markup){
  const document=new window.DOMParser().parseFromString(String(markup||''),'image/svg+xml');
  const valid=document.documentElement?.localName==='svg'&&!document.querySelector('parsererror');
  check(key+' SVG parses',valid,valid?undefined:document.querySelector('parsererror')?.textContent);
  counts.parsedSvgs++;
  if(!valid)return null;
  const viewBox=String(document.documentElement.getAttribute('viewBox')||'').trim().split(/\s+/).map(Number);
  check(key+' SVG has a usable viewBox',viewBox.length===4&&viewBox.every(Number.isFinite)&&viewBox[2]>0&&viewBox[3]>0);
  const text=[...document.querySelectorAll('text,title,desc')].map(element=>element.textContent).join('\n');
  cleanProse(key+' SVG text',text);
  check(key+' SVG contains no active or embedded external content',!document.querySelector('script,foreignObject,iframe,object,embed')&&![...document.querySelectorAll('*')].some(element=>[...element.attributes].some(attribute=>attribute.name.startsWith('on'))));
  return document;
 }
 const original=parseSvg('full original graph',data.originalSvg);
 if(original){
  const actualNodes=[...original.querySelectorAll('g.node[data-node]')],actualTools=[...original.querySelectorAll('g[data-tool]')],actualEdges=[...original.querySelectorAll('g.edge[data-edge][data-from][data-to]')];
  const svgNodes=new Map(actualNodes.map(element=>[element.dataset.node,element]));
  const svgTools=new Map(actualTools.map(element=>[element.dataset.tool,element]));
  const svgEdges=new Map(actualEdges.map(element=>[element.dataset.edge,element]));
  check('Full SVG contains all 291 distinct nodes',actualNodes.length===291&&svgNodes.size===291&&setSame([...svgNodes.keys()],nodes.map(node=>node.id)));
  check('Full SVG contains all 46 distinct tools',actualTools.length===46&&svgTools.size===46&&setSame([...svgTools.keys()],tools.map(tool=>tool.id)));
  check('Full SVG contains all 459 distinct connections',actualEdges.length===459&&svgEdges.size===459&&setSame([...svgEdges.keys()],edges.map(edge=>edge.id)));
  for(const node of nodes){
   const element=svgNodes.get(node.id),text=plain(element?.textContent);
   check(node.id+' full diagram uses its new title, short points and paragraphs',!!element&&[node.title,...node.lines,...node.paragraphs].every(value=>text.includes(plain(value))));
  }
  for(const tool of tools){
   const element=svgTools.get(tool.id),text=plain(element?.textContent);
   check(tool.id+' full diagram contains the new tool explanation',!!element&&[tool.intro,...tool.paragraphs,tool.status].every(value=>text.includes(plain(value))));
  }
  for(const edge of edges){
   const element=svgEdges.get(edge.id),line=element?.querySelector('polyline[marker-end],path[marker-end]');
   const actualPoints=line?.getAttribute('points')?.trim().split(/\s+/).map(point=>point.split(',').map(Number));
   check(edge.id+' SVG connection preserves its real endpoints and routed geometry',element?.dataset.from===edge.from&&element?.dataset.to===edge.to&&!!line&&(!edge.points||same(actualPoints,edge.points)));
  }
 }
 for(const page of pages)for(const flow of arr(page.flows)){
  const svg=parseSvg(flow.id,data.diagrams?.[flow.id]);if(!svg)continue;
  const steps=[...svg.querySelectorAll('[data-step]')];
  check(flow.id+' SVG retains every flow step and destination',steps.length===flow.nodes.length&&setSame(steps.map(element=>element.dataset.step),flow.nodes.map(node=>node.id))&&steps.every(element=>element.dataset.page===page.id&&element.dataset.flow===flow.id));
  const flowIds=new Set(flow.nodes.map(node=>node.id));
  check(flow.id+' flow connections resolve to real steps',flow.edges.every(edge=>flowIds.has(edge.from)&&flowIds.has(edge.to)));
 }
 const overview=parseSvg('learning overview',data.overviewSvg);
 if(overview)check('Overview reaches all 24 modules',setSame([...overview.querySelectorAll('[data-page]')].map(element=>element.dataset.page),pages.map(page=>page.id)));

 // Exercise the actual SVG renderer after all batch text routes have completed.
 window.__readerValidationSkipFigures=false;
 await go('#map');
 check('Map route genuinely mounts the overview and full graph',document.querySelectorAll('#page-root .svg-shell svg').length===2&&document.querySelectorAll('#page-root .svg-shell g.node[data-node]').length===291&&document.querySelectorAll('#page-root .svg-shell g.edge[data-edge][data-from][data-to]').length===459&&document.querySelectorAll('#page-root .svg-shell g[data-tool]').length===46);
 window.__readerValidationSkipFigures=true;
 await go('#module/V');
 const openButton=document.querySelector('#detailed-flow [data-open-diagram]');
 check('Voice detail diagram has a working open action',!!openButton);
 if(openButton){
  openButton.click();await Promise.resolve();
  const guide=pages.find(page=>page.id==='V').teaching.guides.base;
  check('Enlarged detail diagram renders SVG and the complete reading guide',!document.getElementById('diagram-modal').hidden&&!!document.querySelector('#diagram-canvas svg')&&!document.getElementById('diagram-reading').hidden&&paragraphsMatch(document.getElementById('diagram-reading'),guide.paragraphs));
  cleanProse('enlarged diagram guide',document.getElementById('diagram-reading').textContent);
  cleanProse('enlarged diagram caption',document.getElementById('diagram-dialog-caption').textContent);
  document.getElementById('diagram-close').click();
 }
 await go('#sources',{scan:false});
 check('Source appendix retains usable original titles',document.querySelectorAll('.source-item').length===data.sources.length);
 check('All expected route and guide totals were exercised',counts.modules===24&&counts.nodes===291&&counts.tools===46&&counts.walkthroughs===4&&counts.walkthroughSteps===48&&counts.legacyChapters===226&&counts.guides===62,counts);
 check('No JavaScript errors across the entire regression',runtimeErrors.length===0&&!window.__siteLastError,runtimeErrors.length||window.__siteLastError?{runtimeErrors,lastError:window.__siteLastError}:undefined);
}catch(error){
 check('Regression execution completes',false,{message:error.message,stack:error.stack});
}finally{dom?.window.close();}

const failures=results.filter(result=>!result.pass);
const report={version:manifest.version,output,manifest:manifestPath,scope:'Offline JSDOM route/content checks and SVG identity checks. This does not claim browser layout or visual acceptance.',instrumentation:'The in-memory test copy temporarily skips repeated diagram mounts. The original HTML is unchanged; the genuine map and modal renderer are exercised separately.',counts,routes:{total:visits.length,unique:new Set(visits).size},passed:results.length-failures.length,failed:failures.length,runtimeErrors,results,elapsedMs:Date.now()-started,checkedAt:new Date().toISOString()};
const reportPath=option('--report')||path.join(root,'reader-verification-'+manifest.version+'.json');
if(!argv.includes('--no-report'))fs.writeFileSync(reportPath,JSON.stringify(report,null,2));
console.log(JSON.stringify({version:report.version,report:argv.includes('--no-report')?null:reportPath,counts:report.counts,routes:report.routes,passed:report.passed,failed:report.failed,elapsedMs:report.elapsedMs,failures:failures.slice(0,60),moreFailures:Math.max(0,failures.length-60)},null,2));
if(failures.length)process.exitCode=1;
