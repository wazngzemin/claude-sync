import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const require=createRequire(import.meta.url);
const {JSDOM,VirtualConsole}=require('/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/jsdom');
const dir=path.dirname(fileURLToPath(import.meta.url));
const read=n=>JSON.parse(fs.readFileSync(path.join(dir,n),'utf8'));
const {html}=read('candidate-page.json'),data=read('candidate-data.json'),baseline=read('baseline-data.json');
const manifest=read('unit-manifest.json'),diagrams=read('new-diagrams.json'),integrity=read('baseline-manifest.json');
const basePath=path.resolve(dir,'../../../HTML/01-进行中/豆包汽车-业务学习站-v52.html');
const baselineHtml=fs.readFileSync(basePath,'utf8');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const errors=[],downloads=[],downloadNames=[],scrollTargets=[];
const tick=(ms=25)=>new Promise(r=>setTimeout(r,ms));
function boot(text,name,storage={}){
 const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 return new JSDOM(text,{url:'https://offline.invalid/'+name+'#module/V',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){
  w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=function(){scrollTargets.push(this.id)};
  w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
  w.document.execCommand=()=>true;w.confirm=()=>true;
  w.URL.createObjectURL=b=>{downloads.push(b);return 'blob:offline-export'};w.URL.revokeObjectURL=()=>{};
  w.HTMLAnchorElement.prototype.click=function(){if(this.download)downloadNames.push(this.download);else this.dispatchEvent(new w.MouseEvent('click',{bubbles:true,cancelable:true}))};
  for(const[k,v]of Object.entries(storage))w.localStorage.setItem(k,v);
 }});
}
const dom=boot(html,'v54.html');await tick();const w=dom.window,doc=w.document;
assert(html.includes('<title>豆包汽车业务学习站 v54</title>'));
assert(doc.title.startsWith(data.pages.find(x=>x.id==='V').title));
assert(w.CockpitLearningSite,'runtime API missing');
const sections=[...doc.querySelectorAll('#chapter-reading>section')];assert.equal(sections.length,21);
assert.deepEqual(sections.map(x=>x.querySelector(':scope>h2').textContent),manifest.map(x=>x.title));
assert.equal(doc.querySelectorAll('#chapter-reading h2').length,21);
let citations=0;
for(const [i,s]of sections.entries()){
 assert.equal(s.querySelectorAll('details').length,1,'details '+i);
 assert.equal(s.querySelector('summary').textContent,'旧资料与历史口径（不用背，查的时候看）');
 assert.equal(s.querySelector('details').open,false,'history must start closed');
 assert.equal(s.querySelectorAll('figure svg').length,manifest[i].svg_count,'SVG '+i);
 assert(s.querySelector('.voice-prose').firstElementChild.matches('figure'),'diagram must come first '+i);
 assert.equal(s.querySelectorAll('.v54-unit-body h2').length,0);
 const questions=[...s.querySelectorAll('.v54-unit-body h3')].filter(x=>/^(What|Why|Who|When|Where|How(?: much)?)[：:]/.test(x.textContent));
 assert.equal(questions.length,7,'seven questions '+i);
 assert(s.querySelector('.v54-unit-body table'),'5W2H table '+i);
 assert(s.querySelector('.v54-unit-body blockquote'),'retell quote '+i);
 assert(s.querySelector('.v54-reference'),'reference '+i);
 for(const a of s.querySelectorAll('.v54-cite a')){
  const id=a.getAttribute('href').split('/').at(-1);assert(s.querySelector('#'+id),'citation not in own unit '+i+' '+id);citations++;
 }
 assert(!/\[(?:V\d{2}-[FUC]|LAT-F)\d+[^\]]*\]/.test(s.textContent),'raw citation '+i);
}
assert.equal(doc.querySelectorAll('#chapter-reading figure svg').length,30);
assert.equal(new Set([...doc.querySelectorAll('[id]')].map(x=>x.id)).size,doc.querySelectorAll('[id]').length,'duplicate IDs');
assert.equal(data.originalSvg,baseline.originalSvg);
for(const [k,v] of Object.entries(baseline.diagrams))assert.equal(data.diagrams[k],v,'changed legacy SVG '+k);
assert.equal(sha(baselineHtml),integrity.v52_sha256);
for(const d of diagrams){
 const svg=new w.DOMParser().parseFromString(d.svg,'image/svg+xml');assert(!svg.querySelector('parsererror'));
 assert(d.nodes.length<=(d.unit===4?9:8));assert(d.checks.passed!==false);
 for(const n of d.nodes){
  assert(n.x>=0&&n.y>=0&&n.x+n.w<=d.width&&n.y+n.h<=d.height,'node bounds');
  for(const t of n.textLines)assert(t.y>=n.y&&t.y<=n.y+n.h,'text y bounds');
 }
}
async function route(hash,win=w){win.location.hash=hash;await tick();assert(!win.__siteLastError,JSON.stringify(win.__siteLastError));assert(!win.document.querySelector('.error-box'));}
// Inline citation and in-page jump retain the module route and reach their targets.
const cite=doc.querySelector('#v54-unit-11 .v54-cite a');const citeId=cite.dataset.scrollTo;cite.click();await tick();assert(scrollTargets.includes(citeId));assert(doc.querySelector('#'+citeId));
const tocLink=doc.querySelector('.v34-toc a[href$="v54-unit-15"]');tocLink.click();await tick();assert(scrollTargets.includes('v54-unit-15'));
const select=doc.querySelector('#page-section-select');select.value='v54-unit-20';select.dispatchEvent(new w.Event('change',{bubbles:true}));await tick();assert(scrollTargets.includes('v54-unit-20'));
// Actual search index includes new core and archived old material.
for(const query of ['Seed 1.8','瞬时记忆','旧资料与历史口径','冷热点']){
 if(query==='冷热点')continue;
 assert(w.CockpitLearningSite.search(query).length>0,'search '+query);
}
await route('#module/V/section/v54-history-4');assert(doc.querySelector('#v54-history-4').open);
doc.querySelector('#v54-history-4').open=false;
// Zoom and modal interactions use the inherited figure runtime.
const fig=doc.querySelector('#v54-unit-04 figure');fig.querySelector('[data-open-diagram]').click();await tick();
assert(!doc.querySelector('#diagram-modal').hidden);assert(doc.querySelector('#diagram-canvas svg'));
doc.querySelector('[data-modal-zoom="in"]').click();doc.querySelector('#diagram-close').click();assert(doc.querySelector('#diagram-modal').hidden);
fig.querySelector('[data-figure-zoom="in"]').click();assert(Number(fig.dataset.scale)>1);
// Other 23 chapters: deep data equality and rendered DOM equality, including their diagrams.
const old=boot(baselineHtml,'v52.html');await tick();let otherChapters=0;
for(const p of baseline.pages.filter(x=>x.id!=='V')){
 assert.deepEqual(data.pages.find(x=>x.id===p.id),p);
 await route('#module/'+p.id);await route('#module/'+p.id,old.window);
 assert.equal(doc.querySelector('#page-root').innerHTML,old.window.document.querySelector('#page-root').innerHTML,'other chapter DOM '+p.id);
 otherChapters++;
}
old.window.close();
await route('#module/V');
// Edit, save, rerender, fresh page restoration, export/reopen, and revision isolation.
doc.querySelector('#learning-doc-edit').click();
const target=doc.querySelector('#v54-unit-00 .v54-unit-body p');assert(target);
target.append(' V54_EDIT_CHECK');doc.querySelector('#page-root').dispatchEvent(new w.Event('input',{bubbles:true}));
doc.querySelector('#learning-doc-save').click();await tick();assert(doc.querySelector('#v54-unit-00').textContent.includes('V54_EDIT_CHECK'));
const key='cockpit-learning-document:/v54.html';const snapshot=w.localStorage.getItem(key);assert(snapshot);assert.equal(JSON.parse(snapshot).revision,'v54');
const restored=boot(html,'v54.html',{[key]:snapshot});await tick();assert(restored.window.document.querySelector('#v54-unit-00').textContent.includes('V54_EDIT_CHECK'));
assert(restored.window.document.querySelector('#v54-unit-11 .v54-cite a[href]'));
restored.window.document.querySelector('#learning-doc-export').click();await tick();assert(downloads.length);assert.equal(downloadNames.at(-1),'豆包汽车-业务学习站-我的修订-v54.html');
const exported=await new Promise((resolve,reject)=>{const r=new restored.window.FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsText(downloads.at(-1));});
const reopened=boot(exported,'export-v54.html');await tick();assert(reopened.window.document.querySelector('#v54-unit-00').textContent.includes('V54_EDIT_CHECK'));assert.equal(reopened.window.document.querySelectorAll('#chapter-reading>section').length,21);
const isolated=boot(html,'v54.html',{[key]:JSON.stringify({...JSON.parse(snapshot),revision:'v52'}),'cockpit-learning-document:/v52.html':snapshot});await tick();assert(!isolated.window.document.querySelector('#v54-unit-00').textContent.includes('V54_EDIT_CHECK'));
for(const x of [dom,restored,reopened,isolated])x.window.close();
assert.deepEqual(errors,[],'jsdom runtime errors');
const result={passed:true,candidate_sha256:sha(html),units:21,svg_total:30,legacy_svg_unchanged:10,new_svg:20,details_per_unit:manifest.map(x=>({unit:x.unit,count:1})),raw_bracket_citations:0,citation_links_checked:citations,other_chapters_data_equal:otherChapters,other_chapters_rendered_dom_equal:otherChapters,tests:['21个h2及每单元7个问题h3','每单元仅1个默认收起details','30张SVG解析和分布','旧SVG原字符串不变','上标本单元目标全覆盖','引用点击、本章目录与下拉跳转','搜索新正文及历史折叠','历史锚点自动展开','图内缩放与弹窗放大','其他23章数据和DOM逐字一致','编辑保存及重载恢复','另存HTML含快照及重新打开','v52/v54路径与revision隔离','无运行时错误'],browser_launched:false,limitations:['JSDOM不进行真实字体排版与像素绘制，未冒充浏览器视觉验收。','新图防溢出与遮挡采用SVG几何检查，仍需Claude做真实浏览器复核。','JSDOM中的导出验证截获Blob并重新打开其内容，未操作系统下载面板。']};
fs.writeFileSync(path.join(dir,'verification.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
