import fs from 'node:fs';
import {createRequire}from'node:module';
const require=createRequire(import.meta.url),{JSDOM,VirtualConsole}=require('/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/jsdom');
const data=JSON.parse(fs.readFileSync('source-site-data.json')),manifest=JSON.parse(fs.readFileSync('source-latest-build.json'));
const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(String(e)));
const dom=new JSDOM(fs.readFileSync(manifest.output,'utf8'),{runScripts:'dangerously',url:'file://'+manifest.output,pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLDialogElement.prototype.showModal=function(){this.open=true};w.HTMLDialogElement.prototype.close=function(){this.open=false};}});
const w=dom.window,d=w.document;let checks=0;
function assert(ok,msg){checks++;if(!ok)errors.push(msg);}
function route(hash){w.history.replaceState(null,'','#'+hash);w.dispatchEvent(new w.HashChangeEvent('hashchange'));}
for(const page of data.pages){route('module/'+page.id);assert(d.querySelector('h1')?.textContent===page.title,'title '+page.id);assert(d.querySelectorAll('.step').length===page.steps.length,'steps '+page.id);assert(d.querySelectorAll('svg [data-step]').length===page.steps.length,'svg '+page.id);assert(!/多练几个场景|你需要能回答的关键问题|接下来可以怎样改进|需要逐项对照时|方案一：视觉输出开放描述/.test(d.querySelector('main').textContent),'removed filler '+page.id);for(const s of page.steps)assert(d.getElementById('step-'+s.id),'missing step '+s.id);for(const e of page.edges)assert(d.querySelector(`a[href="#module/${page.id}/step/${e.to}"]`),'missing handoff '+e.to);}
for(const tool of data.tools){route('tool/'+tool.id);assert(d.querySelector('h1')?.textContent===(tool.label||tool.name),'tool '+tool.id);}
route('search/Trigger');assert(d.querySelectorAll('.search-result').length>0,'search');
for(const hash of ['home','map','tools']){route(hash);assert(d.querySelector('h1'),'route '+hash);}
route('module/A');d.querySelector('[data-enlarge]').click();assert(d.querySelector('#dialog').open,'modal');d.querySelector('#close').click();assert(!d.querySelector('#dialog').open,'close');
const geometry=JSON.parse(fs.readFileSync('source-diagram-geometry.json'));const crossings=[];
for(const [id,g]of Object.entries(geometry)){for(const e of g.edges)for(const sec of e.sections||[]){const points=[sec.startPoint,...(sec.bendPoints||[]),sec.endPoint];for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i];for(const n of g.children){if(e.sources.includes(n.id)||e.targets.includes(n.id))continue;const inset=2;if(a.x===b.x&&a.x>n.x+inset&&a.x<n.x+n.width-inset&&Math.max(a.y,b.y)>n.y+inset&&Math.min(a.y,b.y)<n.y+n.height-inset||a.y===b.y&&a.y>n.y+inset&&a.y<n.y+n.height-inset&&Math.max(a.x,b.x)>n.x+inset&&Math.min(a.x,b.x)<n.x+n.width-inset)crossings.push({page:id,edge:e.id,node:n.id});}}}}
assert(crossings.length===0,'edges cross unrelated nodes '+JSON.stringify(crossings));
const report={checks,errors,crossings,browserVisual:'not completed; browser calls timed out',scope:'DOM routes, node completeness, handoff targets, removed elements, SVG path versus node bounds',version:manifest.version};
fs.writeFileSync('source-verification-'+manifest.version+'.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));dom.window.close();if(errors.length)process.exitCode=1;
