import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const require=createRequire(import.meta.url);
const {JSDOM,VirtualConsole}=require('/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/jsdom');
const dir=path.dirname(fileURLToPath(import.meta.url));
const read=f=>fs.readFileSync(path.join(dir,f),'utf8');
const original=JSON.parse(read('baseline-data.json')), data=JSON.parse(read('candidate-data.json'));
const integrity=JSON.parse(read('baseline-integrity.json'));
const html=fs.readFileSync(integrity.output,'utf8'),baselineHtml=fs.readFileSync(integrity.path,'utf8');
const oldV=original.pages.find(x=>x.id==='V').v34, newV=data.pages.find(x=>x.id==='V').v34;
const errors=[],downloads=[];
const tick=()=>new Promise(r=>setTimeout(r,30));
function boot(text,pathname,storage={}){
 const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 return new JSDOM(text,{url:'https://offline.invalid/'+pathname+'#module/V',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){
  w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
  w.URL.createObjectURL=blob=>{downloads.push(blob);return 'blob:offline-export'};w.URL.revokeObjectURL=()=>{};
  w.HTMLAnchorElement.prototype.click=function(){if(!this.download)this.dispatchEvent(new w.MouseEvent('click',{bubbles:true,cancelable:true}));};
  for(const [key,value]of Object.entries(storage))w.localStorage.setItem(key,value);
 }});
}
const old=boot(baselineHtml,'v49.html');await tick();
const dom=boot(html,'v50.html');await tick();
const w=dom.window,doc=w.document;
async function route(hash){w.location.hash=hash;await tick();assert(!w.__siteLastError,JSON.stringify(w.__siteLastError));assert(!doc.querySelector('.error-box'));}
assert(doc.querySelector('.voice-lesson.v34'));
const sectionIds=[...doc.querySelectorAll('.voice-lesson.v34>section')].map(x=>x.id);
assert.deepEqual(sectionIds,oldV.sections.map(x=>x.id));
// The source of every diagram is unchanged byte for byte; no new wrapper hides it.
assert.deepEqual(data.diagrams,original.diagrams);assert.equal(data.originalSvg,original.originalSvg);assert.equal(data.overviewSvg,original.overviewSvg);
const marker=h=>h.match(/<!--fig:[\s\S]*?-->|<!--original-->/g)||[];
for(const s of newV.sections)assert.deepEqual(marker(s.html),marker(oldV.sections.find(x=>x.id===s.id).html),s.id);
const structure=d=>[...d.querySelectorAll('.voice-lesson figure[data-diagram]')].map(f=>({title:f.querySelector('figcaption h3')?.textContent,ancestorDetails:[...function*(el){for(let p=el.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')yield p.id;}(f)]}));
assert.deepEqual(structure(doc),structure(old.window.document));
const charts=structure(doc);assert.equal(charts.length,10);assert.equal(charts.filter(x=>x.ancestorDetails.length===0).length,9);
const detailIds=[...doc.querySelectorAll('details.v49-detail')].map(x=>x.id);assert.equal(new Set(detailIds).size,detailIds.length);assert(detailIds.length>30);
assert(!doc.querySelector('details.v49-detail figure'));
for(const details of doc.querySelectorAll('details.v49-detail')){assert(!details.open);details.querySelector('summary').click();assert(details.open);details.querySelector('summary').click();assert(!details.open);}
for(const id of detailIds){await route('#module/V/section/'+id);assert(doc.getElementById(id)?.open,id);}
const searches=['Qwen3','热词','0.75','1.36','prefetch','人人对话','AI Launcher','30B','500 token'];
for(const q of searches){await route('#search?q='+encodeURIComponent(q));assert([...doc.querySelectorAll('#search-results a')].some(a=>a.getAttribute('href').startsWith('#module/V')),q);}
await route('#search?q='+encodeURIComponent('0.75'));
const hit=[...doc.querySelectorAll('#search-results a')].find(a=>a.getAttribute('href').includes('/section/v49-'));
assert(hit,'folded content has direct search target');await route(hit.getAttribute('href'));assert(doc.querySelector('details.v49-detail[open]'));
await route('#module/V');
const zoom=doc.querySelector('.voice-lesson [data-figure-zoom=in]');zoom.click();assert(Number(zoom.closest('figure').dataset.scale)>1);
doc.querySelector('.voice-lesson [data-open-diagram]').click();await tick();assert(doc.querySelector('.dialog-canvas svg'));
for(const p of data.pages){await route('#module/'+p.id);assert(doc.querySelector('#page-root h1'));}
// Edit a mainline paragraph and a paragraph inside an expansion, save, reload, export and reopen.
await route('#module/V');doc.querySelector('#learning-doc-edit').click();
const mainText='离线验收：正文编辑保留。', detailText='离线验收：展开内编辑保留。';
doc.querySelector('.voice-opening p').textContent+=mainText;
const detail=doc.querySelector('details.v49-detail');detail.open=true;detail.querySelector('p').textContent+=detailText;
doc.querySelector('#page-root').dispatchEvent(new w.Event('input',{bubbles:true}));
doc.querySelector('#learning-doc-save').click();await tick();
const key='cockpit-learning-document:/v50.html';const stored=w.localStorage.getItem(key);assert(stored);assert.equal(JSON.parse(stored).revision,'v50');
assert(doc.querySelector('#page-root').textContent.includes(detailText));
const loaded=boot(html,'v50.html',{[key]:stored,'cockpit-learning-document:/v49.html':'{"revision":"v49","pages":{}}'});await tick();
assert(loaded.window.document.querySelector('#page-root').textContent.includes(mainText));assert(loaded.window.document.querySelector('#page-root').textContent.includes(detailText));
assert.deepEqual(structure(loaded.window.document),charts);
loaded.window.document.querySelector('#learning-doc-export').click();await tick();assert(downloads.length);
const blob=downloads.at(-1);const exported=await new Promise((resolve,reject)=>{const r=new loaded.window.FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsText(blob);});
assert(exported.includes('我的修订-v50.html'));
const exportedDom=boot(exported,'exported-v50.html');await tick();assert(exportedDom.window.document.querySelector('#page-root').textContent.includes(mainText));assert(exportedDom.window.document.querySelector('#page-root').textContent.includes(detailText));assert.deepEqual(structure(exportedDom.window.document),charts);
const oldState='{"revision":"v49","pages":{"module/V":{"signature":"invalid"}}}';
const isolated=boot(html,'v50.html',{[key]:oldState});await tick();assert(!isolated.window.document.querySelector('#page-root').textContent.includes(mainText));assert.deepEqual(structure(isolated.window.document),charts);
assert.deepEqual(data.pages.filter(x=>x.id!=='V'),original.pages.filter(x=>x.id!=='V'));
for(const key of Object.keys(data).filter(k=>k!=='pages'))assert.deepEqual(data[key],original[key],key);
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(integrity.path)).digest('hex'),integrity.sha256);
assert.deepEqual(errors,[]);
const report={method:'Offline JSDOM execution only. No browser visual/layout acceptance; no browser, localhost server or headless browser launched.',sections:sectionIds.length,chartsTotal:charts.length,chartsDirectlyVisible:9,allDiagramSourcesByteIdentical:true,diagramLocationAndVisibilityUnchanged:true,expansions:detailIds.length,searchQueries:searches.length,allFoldAnchorsOpened:true,zoomAndDialogDOMPass:true,renderedChapters:data.pages.length,editSaveReloadExportReopen:true,oldSnapshotIsolated:true,otherPagesAndAllOtherDataUnchanged:true,baselineHtmlUnchanged:true,errors};
fs.writeFileSync(path.join(dir,'verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
for(const d of [dom,old,loaded,exportedDom,isolated])d.window.close();
