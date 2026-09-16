import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const dir=path.dirname(fileURLToPath(import.meta.url)),g=JSON.parse(fs.readFileSync(path.join(dir,'graph-v13.json'))),svg=fs.readFileSync(path.join(dir,'业务全链路-v13.svg'),'utf8');
const group=id=>g.groups.find(x=>x.id===id),node=id=>g.nodes.find(x=>x.id===id);
const cuts=[['voice',group('voice'),1600],['planner',group('planner'),1600],['dynamic',group('dynamic'),1600],['events',group('events'),1600],['tools',group('family-1'),1600],['main',{x:140,y:g.layout.mainY-50,w:16300,h:3800},3200]];
for(const [name,r,pw] of cuts){const box={x:r.x-55,y:r.y-45,w:r.w+110,h:r.h+95},cut=svg.replace(/width="[\d.]+" height="[\d.]+" viewBox="[^"]+"/,`width="${box.w}" height="${box.h}" viewBox="${box.x} ${box.y} ${box.w} ${box.h}"`),fp=path.join(dir,'preview-'+name+'.svg');fs.writeFileSync(fp,cut);execFileSync('/opt/homebrew/bin/rsvg-convert',['-w',String(pw),fp,'-o',path.join(dir,'preview-'+name+'.png')]);}
execFileSync('/opt/homebrew/bin/rsvg-convert',['-w','2600',path.join(dir,'业务全链路-v13.svg'),'-o',path.join(dir,'overview-v13.png')]);
const cli='/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/.bin/whiteboard-cli';
const cv=JSON.parse(execFileSync(cli,['-i',path.join(dir,'业务全链路-v13.svg'),'--to','openapi','--format','json'],{maxBuffer:64*1024*1024}));assert.equal(cv.code,0);const native=cv.data.result;fs.writeFileSync(path.join(dir,'native-v13.json'),JSON.stringify(native,null,2));
const require=createRequire('/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/jsdom/package.json'),{JSDOM,VirtualConsole}=require('jsdom');
const html=fs.readFileSync('/Users/bytedance/Desktop/3.23/产品/codex/HTML/02-已交付/豆包汽车-业务全链路-v13.html','utf8'),errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
const dom=new JSDOM(html,{runScripts:'dangerously',url:'https://artifact.invalid/',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){Object.defineProperty(w.HTMLElement.prototype,'clientWidth',{get(){return this.id==='stage'?1440:420}});Object.defineProperty(w.HTMLElement.prototype,'clientHeight',{get(){return this.id==='stage'?850:800}});w.URL.createObjectURL=()=>'blob:test';w.URL.revokeObjectURL=()=>{};w.HTMLAnchorElement.prototype.click=function(){w.__download=this.download};}});
await new Promise(r=>setTimeout(r,80));const w=dom.window,d=w.document,api=w.flowState;assert(api);assert.equal(api.getSelected(),'V1');assert(api.getView().w<3000);assert.equal(d.querySelectorAll('#groupSelect option').length,33);
d.querySelector('#next').click();assert.equal(api.getSelected(),'V2');d.querySelector('#previous').click();assert.equal(api.getSelected(),'V1');
api.focusNode('DY5');assert(d.querySelector('#insContent').textContent.includes('按钮'));api.selectEdge('E001');assert(d.querySelector('[data-edge-id="E001"]').classList.contains('connected'));
api.showTools();assert.equal(d.querySelectorAll('.tool-list [data-jump]').length,27);api.focusNode('T7');assert(d.querySelector('#insContent').textContent.includes('自动导航'));
api.focusGroup('events',true);assert(api.getView().h>=group('events').h);api.showLearning();assert(d.querySelector('#insContent').textContent.includes('不需要平均钻研'));api.showSources();assert(d.querySelector('#insContent').textContent.includes('逐字稿'));
api.focusNode('P1');d.querySelector('[data-tab="learn"]').click();assert(d.querySelector('textarea[data-note]'));const area=d.querySelector('textarea[data-note]');area.value='完成一条真实 Trace 复盘';area.dispatchEvent(new w.Event('input'));assert(w.localStorage.getItem('doubao-business-v13-notes').includes('真实 Trace'));d.querySelector('#exportNotes').click();assert(w.__download.endsWith('.md'));
for(const c of api.data.cases)for(const id of c.nodes)assert(node(id));assert.deepEqual(errors,[]);
const types=native.nodes.reduce((a,n)=>(a[n.type]=(a[n.type]||0)+1,a),{});assert(!types.image&&!types.image_shape);
// 每个业务框至少一条入/出连接；非运行说明框另列。
const disconnected=g.nodes.filter(n=>!g.edges.some(e=>e.from===n.id||e.to===n.id)).map(n=>n.id);
const report={...g.coverage,nativeNodes:native.nodes.length,nativeTypes:types,domTests:'passed; not browser visual testing',caseRoutes:api.data.cases.length,toolDirectory:27,searchableNodes:g.nodes.length,disconnected,errors};
fs.writeFileSync(path.join(dir,'flow-verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));w.close();
