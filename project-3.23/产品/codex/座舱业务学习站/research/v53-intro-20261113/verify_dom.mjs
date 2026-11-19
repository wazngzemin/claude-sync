import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import crypto from 'node:crypto';import {createRequire} from 'node:module';import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url),{JSDOM,VirtualConsole}=require('/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/jsdom');
const dir=path.dirname(fileURLToPath(import.meta.url)),read=f=>JSON.parse(fs.readFileSync(path.join(dir,f),'utf8'));
const meta=read('integrity.json'),base=read('baseline-data.json'),data=read('candidate-data.json'),html=fs.readFileSync(meta.output,'utf8');
const errors=[],downloads=[],doms=[],tick=()=>new Promise(r=>setTimeout(r,30));
function boot(text,name,storage={}){
 const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));vc.on('error',e=>errors.push(String(e)));
 const dom=new JSDOM(text,{url:'https://offline.invalid/'+name+'#module/V',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){
  w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=function(){w.lastScrolledId=this.id;};w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
  w.URL.createObjectURL=blob=>{downloads.push(blob);return 'blob:offline-export'};w.URL.revokeObjectURL=()=>{};w.HTMLAnchorElement.prototype.click=function(){if(!this.download)this.dispatchEvent(new w.MouseEvent('click',{bubbles:true,cancelable:true}));};
  for(const [k,v]of Object.entries(storage))w.localStorage.setItem(k,v);
 }});doms.push(dom);return dom;
}
const dom=boot(html,'v53.html');await tick();const w=dom.window,doc=w.document;
async function route(hash){w.location.hash=hash;await tick();assert(!w.__siteLastError);assert(!doc.querySelector('.error-box'));}
const oldV=base.pages.find(p=>p.id==='V'),newV=data.pages.find(p=>p.id==='V');
assert.deepEqual(newV.v34.sections.slice(5),oldV.v34.sections);
assert.deepEqual(newV.sections.slice(5),oldV.sections);assert.deepEqual(newV.teaching.lessons.slice(5),oldV.teaching.lessons);
assert.deepEqual(data.pages.filter(p=>p.id!=='V'),base.pages.filter(p=>p.id!=='V'));
for(const k of Object.keys(base).filter(k=>k!=='pages'))assert.deepEqual(data[k],base[k]);
const introNodes=meta.introIds.map(id=>doc.getElementById(id));assert(introNodes.every(Boolean));assert.equal(introNodes.reduce((n,s)=>n+s.querySelectorAll('details').length,0),0);
for(const id of meta.introIds){
 assert(doc.querySelector('.v34-toc a[href="#'+id+'"]'));assert(doc.querySelector('#page-section-select option[value="'+id+'"]'));
 const select=doc.getElementById('page-section-select');select.value=id;select.dispatchEvent(new w.Event('change',{bubbles:true}));assert.equal(w.lastScrolledId,id);
}
const search={};for(const q of ['端云仲裁','打断','TTS']){await route('#search?q='+encodeURIComponent(q));search[q]=[...doc.querySelectorAll('#search-results a')].map(a=>a.getAttribute('href')).filter(h=>h.includes('/section/v53-intro-'));assert(search[q].length);await route(search[q][0]);assert(doc.getElementById(search[q][0].split('/').at(-1)));}
for(const p of data.pages){await route('#module/'+p.id);assert(doc.querySelector('#page-root h1'));}
await route('#module/V');doc.getElementById('learning-doc-edit').click();
const sentinel='【v53 临时编辑验收】',target=doc.querySelector('#v53-intro-1 p');target.textContent+=sentinel;doc.getElementById('page-root').dispatchEvent(new w.Event('input',{bubbles:true}));doc.getElementById('learning-doc-save').click();await tick();
const key='cockpit-learning-document:/v53.html',stored=w.localStorage.getItem(key);assert(stored);assert.equal(JSON.parse(stored).revision,'v53');
const reloaded=boot(html,'v53.html',{[key]:stored});await tick();assert(reloaded.window.document.querySelector('#v53-intro-1').textContent.includes(sentinel));
reloaded.window.document.getElementById('learning-doc-export').click();await tick();assert(downloads.length);
const exported=await new Promise((resolve,reject)=>{const r=new reloaded.window.FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsText(downloads.at(-1));});
const reopened=boot(exported,'export-v53.html');await tick();assert(reopened.window.document.querySelector('#v53-intro-1').textContent.includes(sentinel));
const oldSnapshot=JSON.stringify({...JSON.parse(stored),revision:'v52'});
const isolated=boot(html,'v53.html',{'cockpit-learning-document:/v52.html':oldSnapshot,[key]:oldSnapshot});await tick();assert(!isolated.window.document.querySelector('#v53-intro-1').textContent.includes(sentinel));
const old=boot(fs.readFileSync(meta.basePath,'utf8'),'v52.html',{[key]:stored});await tick();assert(!old.window.document.getElementById('v53-intro-1'));
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(meta.basePath)).digest('hex'),meta.baseSha256);assert.deepEqual(errors,[]);
const report={method:'JSDOM execution; browser layout is checked separately',introSections:5,introDetails:0,chapterToc:true,pageJump:true,search,renderedChapters:24,editSaveReload:true,exportReopen:true,v52v53SnapshotsIsolated:true,originalVSectionsUnchanged:16,otherChaptersUnchanged:23,baselineFileUnchanged:true,consoleAndRuntimeErrors:errors};
fs.writeFileSync(path.join(dir,'verification-dom.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));doms.forEach(d=>d.window.close());
