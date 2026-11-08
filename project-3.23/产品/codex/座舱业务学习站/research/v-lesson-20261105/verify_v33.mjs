import {createRequire} from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url);
const {JSDOM,VirtualConsole}=require('/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/jsdom');
const root=path.dirname(fileURLToPath(import.meta.url));
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const data=JSON.parse(read('candidate-data.json'));
const original=JSON.parse(read('baseline-data.json'));
const app=read('candidate-app.js');
const prefix=read('candidate.prefix');
const html=prefix+'<script>const DATA='+JSON.stringify(data).replaceAll('</','<\/')+';</script><script>'+app+'</script></body></html>';
const errors=[];
const vc=new VirtualConsole();
vc.on('jsdomError',e=>errors.push(e.message));
const dom=new JSDOM(html,{url:'https://local.invalid/',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){
  w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};
  w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
}});
const {window:w}=dom;const doc=w.document;
const tick=()=>new Promise(r=>setTimeout(r,40));
await tick();
assert.equal(w.location.hash,'#module/V');
assert.equal(doc.querySelector('.voice-lesson')!==null,true);
assert.equal(doc.querySelectorAll('.voice-lesson>.section').length,14);
assert.equal(doc.querySelectorAll('.voice-lesson .flow-figure[data-diagram-theme=adaptive]').length,4);
assert.equal(doc.querySelectorAll('.voice-lesson table').length,5);
assert.equal(doc.querySelectorAll('.voice-lesson textarea,.voice-lesson input,.voice-lesson .chapter-practice').length,0);
const vtext=doc.querySelector('.voice-lesson').textContent;
for(const term of ['热词','1.7B','30B','AI Launcher','人人对话','瞬时记忆','500 token','短期情景','长期语义','request_id','tool_feedback','副驾座椅'])assert(vtext.includes(term),term);
for(const id of ['v-listen','v-hotwords','v-asr-vad','v-prepare','v-models','v-memory','v-h2h','v-finish','v-memory-poi','v-memory-seat'])assert(doc.getElementById(id),id);
assert(vtext.indexOf('回到餐厅主例')<vtext.indexOf('新文档中的“记住我家”'));
assert(!doc.querySelector('.error-box'));
// Interaction checks use DOM only. They do not represent a browser layout acceptance.
const zoom=doc.querySelector('.voice-lesson [data-figure-zoom=in]');
zoom.click();assert(Number(zoom.closest('figure').dataset.scale)>1);
const modalButton=doc.querySelector('.voice-lesson [data-open-diagram]');modalButton.click();await tick();
assert(doc.querySelector('.dialog-canvas svg'),'SVG modal content');
const rendered=[];
async function route(hash){w.location.hash=hash;await tick();assert(!w.__siteLastError,JSON.stringify(w.__siteLastError));assert(!doc.querySelector('#page-root>.empty-state h2')?.textContent?.includes('暂时无法'),'route error');}
for(const p of data.pages){await route('#module/'+p.id);assert(doc.querySelector('#page-root h1'));rendered.push(p.id);}
for(const id of ['V1','V2','V8','V9','V10','V12','V16','V18']){await route('#node/'+id);assert(!doc.querySelector('.error-box'),id);}
for(const q of ['热词','1.7B','瞬时记忆','AI Launcher']){await route('#search?q='+encodeURIComponent(q));assert([...doc.querySelectorAll('#search-results a')].some(x=>x.getAttribute('href').startsWith('#module/V')),q);}
await route('#module/V/section/v-memory-poi');assert(doc.getElementById('v-memory-poi'));
// Route/source consistency and unchanged neighboring data.
assert.deepEqual(data.pages.filter(x=>x.id!=='V'),original.pages.filter(x=>x.id!=='V'));
assert.deepEqual(data.base,original.base);
assert.equal(data.originalSvg,original.originalSvg);
assert.deepEqual(data.walkthroughs,original.walkthroughs);
for(const [key,svg]of Object.entries(data.diagrams).filter(([key])=>key.startsWith('voice-'))){
 const xml=new w.DOMParser().parseFromString(svg,'image/svg+xml');assert(!xml.querySelector('parsererror'),key);assert(!xml.querySelector('script,foreignObject,image'),key);
}
const integrity=JSON.parse(read('baseline-integrity.json'));
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(integrity.path)).digest('hex'),integrity.sha256);
assert.equal(errors.length,0,errors.join('\n'));
const report={date:'2026-11-05',method:'Offline JSDOM execution; XML parse; native SVG raster review. No browser visual acceptance.',changedChapter:'V',renderedModules:rendered,checkedNodeRoutes:8,checkedSearchQueries:4,diagrams:4,sections:14,tables:5,other23PagesUnchanged:true,baseGraphUnchanged:true,previousHtmlUnchanged:true,errors};
fs.writeFileSync(path.join(root,'verification.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
w.close();
