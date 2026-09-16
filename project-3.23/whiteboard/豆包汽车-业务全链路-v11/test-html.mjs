import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire('/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/jsdom/package.json');
const {JSDOM,VirtualConsole}=require('jsdom');
const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
const html=fs.readFileSync('/Users/bytedance/Desktop/3.23/产品/codex/HTML/02-已交付/豆包汽车-业务全链路-v11.html','utf8');
// DOM-only unit tests. No page is visited and no external resource is loaded.
const dom=new JSDOM(html,{runScripts:'dangerously',url:'https://artifact.invalid/',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){Object.defineProperty(w.HTMLElement.prototype,'clientWidth',{get(){return this.id==='stage'?1280:390}});Object.defineProperty(w.HTMLElement.prototype,'clientHeight',{get(){return this.id==='stage'?820:820}});w.URL.createObjectURL=()=> 'blob:test';w.URL.revokeObjectURL=()=>{};w.HTMLAnchorElement.prototype.click=function(){w.__download=this.download}}});
await new Promise(r=>setTimeout(r,60));
const w=dom.window,d=w.document,api=w.flowState;assert(api,'script initialization');assert.equal(api.data.nodes.length,235);
api.focusNode('P1');assert(d.querySelector('#inspector').textContent.includes('完整目标成功率'));assert(d.querySelector('[data-node-id="P1"]').classList.contains('selected'));
api.focusNode('T7');assert(d.querySelector('#inspector').textContent.includes('自动导航'));
d.querySelector('#search').value='visual_qa';d.querySelector('#search').dispatchEvent(new w.Event('input'));d.querySelector('#searchNext').click();assert(d.querySelector('#inspector').textContent.includes('visual_qa'));
api.chooseView('learn');assert(d.querySelector('#inspector').textContent.includes('不是离职硬门槛'));const ta=d.querySelector('textarea[data-note]');ta.value='本地测试记录';ta.dispatchEvent(new w.Event('input'));assert(w.localStorage.getItem('doubao-flow-v11-notes').includes('本地测试记录'));
d.querySelector('#exportNotes').click();assert(w.__download.endsWith('.md'));
api.focusNode('U6');assert(d.querySelector('#inspector').textContent.includes('消歧'));api.chooseView('all');assert.equal(d.querySelector('#zoomLabel').textContent,'12%');
assert.deepEqual(errors,[]);const report={mode:'DOM-only; not a real-browser render',initialization:true,nodeSelection:true,toolDetails:true,search:true,questions:true,localNoteState:true,markdownExport:true,errors};
fs.writeFileSync('/Users/bytedance/Desktop/3.23/whiteboard/豆包汽车-业务全链路-v11/html-dom-tests.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));w.close();
