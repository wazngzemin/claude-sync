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
const dom=boot(html,'v52.html');await tick();const w=dom.window,doc=w.document;
async function route(hash){w.location.hash=hash;await tick();assert(!w.__siteLastError);assert(!doc.querySelector('.error-box'));}
assert(doc.querySelector('.voice-lesson'));
const originalDom=boot(baselineHtml,'v50.html');await tick();
const ref=t=>t.replace(/第([二三四五])段/g,(_,n)=>'第'+({二:'五',三:'二',四:'三',五:'四'}[n])+'段').replace('第四、五段','第三、四段');
const text=h=>new JSDOM(h).window.document.body.textContent;
let preserved=0;
for(const s of oldV.sections){const d=new JSDOM(s.html).window.document,now=text(newV.sections.find(n=>n.id===s.id).html);for(const detail of d.querySelectorAll('details')){preserved++;assert(now.includes(ref(detail.querySelector('.v49-detail-body').textContent)),detail.id);}}
for(const row of JSON.parse(read('preservation-ledger.json'))){assert(doc.getElementById(row.target).textContent.includes(ref(text(row.original))),row.target);}
assert.deepEqual(data.pages.filter(x=>x.id!=='V'),original.pages.filter(x=>x.id!=='V'));
for(const key of Object.keys(data).filter(k=>k!=='pages'))assert.deepEqual(data[key],original[key]);
const svg=d=>[...d.querySelectorAll('.voice-lesson figure svg')].map(x=>x.outerHTML.replace(/inline-\d+-\d+-/g,"inline-normalized-")).sort();assert.deepEqual(svg(doc),svg(originalDom.window.document));
const role=doc.querySelector('#v49-model-role-comparison');assert(role&&!role.closest('details'));assert.equal(role.outerHTML,originalDom.window.document.querySelector('#v49-model-role-comparison').outerHTML);
const count=t=>t.replace(/\s/g,'').length;
const counts=['v39-s1','v39-s2','v39-s4','v39-s5','v39-s3'].map(id=>{const el=doc.getElementById(id).cloneNode(true);el.querySelectorAll('details,figure,h2').forEach(x=>x.remove());return{id,characters:count(el.textContent),caveats:(el.textContent.match(/待确认|待核实|仍需|不能据此/g)||[]).length};});
const detailIds=[...doc.querySelectorAll('.voice-lesson details.v49-detail')].map(x=>x.id),total=doc.querySelectorAll('.voice-lesson details').length;
assert(counts.reduce((a,x)=>a+x.characters,0)>=10000);assert(counts.reduce((a,x)=>a+x.caveats,0)<=4);assert(total<=60);
const headingThenDetails=[...doc.querySelectorAll('.voice-lesson h3,.voice-lesson h4')].filter(x=>x.nextElementSibling?.tagName==='DETAILS').map(x=>x.textContent);assert.deepEqual(headingThenDetails,[]);
assert(!doc.querySelector('.v51-guide,.v51-takeaway,#v51-short'));assert(![...doc.querySelectorAll('.voice-lesson summary')].some(x=>/展开看解释与例子|更多信息|原讲解与复述对照/.test(x.textContent)));
for(const id of detailIds){await route('#module/V/section/'+id);assert(doc.getElementById(id).open,id);}
await route('#search?q='+encodeURIComponent('0.75'));const hit=[...doc.querySelectorAll('#search-results a')].find(a=>a.getAttribute('href').includes('/section/'));assert(hit);await route(hit.getAttribute('href'));assert(doc.querySelector('details.v49-detail[open]'));
await route('#module/V');const sectionOrder=[...doc.querySelectorAll('.voice-lesson>section')].map(x=>x.id);assert.deepEqual(sectionOrder,newV.sections.map(x=>x.id));
const options=[...doc.querySelectorAll('#page-section-select option')].map(x=>x.value);for(const id of ['v39-s1','v39-s2','v39-s4','v39-s5','v39-s3'])assert(options.includes(id));
const selects=doc.querySelector('#page-section-select');selects.value='v39-s3';selects.dispatchEvent(new w.Event('change',{bubbles:true}));
for(const p of data.pages){await route('#module/'+p.id);assert(doc.querySelector('#page-root h1'));}
await route('#module/V');doc.querySelector('#learning-doc-edit').click();const sentinel='v52 正文编辑验收。',folded='v52 折叠编辑验收。';doc.querySelector('.voice-opening p').textContent+=sentinel;doc.querySelector('details.v49-detail p').textContent+=folded;doc.querySelector('#page-root').dispatchEvent(new w.Event('input',{bubbles:true}));doc.querySelector('#learning-doc-save').click();await tick();
const key='cockpit-learning-document:/v52.html',stored=w.localStorage.getItem(key);assert(stored);assert.equal(JSON.parse(stored).revision,'v52');
const loaded=boot(html,'v52.html',{[key]:stored});await tick();assert(loaded.window.document.querySelector('#page-root').textContent.includes(sentinel));assert(loaded.window.document.querySelector('#page-root').textContent.includes(folded));
loaded.window.document.querySelector('#learning-doc-export').click();await tick();assert(downloads.length);const blob=downloads.at(-1);const exported=await new Promise((res,rej)=>{const r=new loaded.window.FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsText(blob);});const reopened=boot(exported,'export-v52.html');await tick();assert(reopened.window.document.querySelector('#page-root').textContent.includes(sentinel));assert(reopened.window.document.querySelector('#page-root').textContent.includes(folded));
const oldSnapshot=boot(html,'v52.html',{'cockpit-learning-document:/v50.html':stored,'cockpit-learning-document:/v51.html':stored});await tick();assert(!oldSnapshot.window.document.querySelector('#page-root').textContent.includes(sentinel));
assert.deepEqual(errors,[]);assert.equal(svg(doc).length,10);assert.equal(doc.querySelectorAll('.voice-lesson details figure').length,1);
const report={method:'JSDOM execution. Real browser blocked: Chrome SIGABRT; CUA browser host unavailable. Mobile layout not verified.',counts,bodyCharacters:counts.reduce((a,x)=>a+x.characters,0),caveats:counts.reduce((a,x)=>a+x.caveats,0),beforeDetails:originalDom.window.document.querySelectorAll('.voice-lesson details').length,afterDetails:total,preservedOriginalDetails:preserved,preservedMoves:JSON.parse(read('preservation-ledger.json')).length,headingThenDetails,allSvgIdentical:true,svgCount:10,foldedSvgCount:1,modelTableVisibleAndIdentical:true,otherChaptersIdentical:23,allDisclosureTargetsOpen:true,searchAutoExpand:true,pageJumpOptions:true,editSaveReloadExportReopen:true,snapshotsIsolated:true,renderedChapters:24,errors,sectionOrder};
fs.writeFileSync(path.join(dir,'verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));for(const d of [dom,originalDom,loaded,reopened,oldSnapshot])d.window.close();
