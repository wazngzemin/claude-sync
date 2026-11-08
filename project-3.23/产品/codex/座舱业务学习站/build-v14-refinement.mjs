import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire}from'node:module';
import {fileURLToPath}from'node:url';
import {readerOriginalSvg}from'./reader-svg.mjs';
import {flowDiagram}from'./diagrams.mjs';
const root=path.dirname(fileURLToPath(import.meta.url)),htmlRoot=path.resolve(root,'../HTML');
const require=createRequire(import.meta.url),{JSDOM}=require('/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/jsdom');
const baseline=path.join(htmlRoot,'01-进行中/豆包汽车-业务学习站-v14.html');
const original=fs.readFileSync(baseline,'utf8');
const read=name=>JSON.parse(fs.readFileSync(path.join(root,'content',name+'.json'),'utf8'));
const data=JSON.parse(original.match(/<script>const DATA=([\s\S]*?);<\/script>/)[1]);
const originalData=structuredClone(data);
const patches=read('v14-targeted-corrections');
const pages=new Map(data.pages.map(p=>[p.id,p]));
const allNodes=data.base.modules.flatMap(m=>m.nodes),nodes=new Map(allNodes.map(n=>[n.id,n]));
const sourceIds=new Set(data.sources.map(s=>s.id));
for(const patch of patches.nodes){const n=nodes.get(patch.id);if(!n)throw Error('unknown node '+patch.id);Object.assign(n,patch);n.detail=n.paragraphs.join('\n\n');}
for(const edit of patches.edits){let obj=pages.get(edit.pageId);for(const key of edit.path.slice(0,-1))obj=obj?.[key];const key=edit.path.at(-1);if(!obj||!(key in obj))throw Error('invalid edit '+JSON.stringify(edit));obj[key]=edit.value;}
for(const remove of patches.removeFlows){const p=pages.get(remove.pageId);p.flows=p.flows.filter(f=>f.id!==remove.id);delete p.teaching.guides[remove.id];delete data.diagrams[remove.id];}
for(const edit of patches.edgeLabels||[]){const edge=data.base.edges.find(e=>e.id===edit.id);if(!edge||edge.from!==edit.from||edge.to!==edit.to)throw Error('bad edge correction '+edit.id);edge.label=edit.label;for(const m of data.base.modules)for(const e of m.edges||[])if(e.id===edit.id||(e.from===edit.from&&e.to===edit.to))e.label=edit.label;}
const toolAudit=read('source-rebuild-tool-audit'),tools=[...data.base.tools,...data.base.supplementalDefinitions];
for(const change of toolAudit.corrections){const t=tools.find(t=>t.id===change.id);if(!t)throw Error('unknown tool');Object.assign(t,change);}
for(const item of toolAudit.quarantine){const t=tools.find(t=>t.id===item.id);t.intro='此项在资料中有能力入口定义。';t.paragraphs=['当前取得的内容只说明了能力名称或入口，尚未提供可核对的内部处理合同。','保留这一项便于查找对应资料；具体输入、执行过程和返回方式需要以该项目接入定义为准。'];t.status='能力入口已列出，内部机制未核实。';}
for(const t of tools)t.paragraphs=t.paragraphs.map(s=>s.replace('工具表记录的车控回包','车控回包').replace('工具表对超时明确要求','超时时').replace('智驾、专属氛围灯在工具表中另有入口','智驾和专属氛围灯由各自独立工具处理').replace('把乘客名字换成座位属于调用前的理解，不能据此臆造工具内部的人脸查询流程。','调用前先把乘客名字对应到明确座位，再交付车控参数。'));
const toolProse=read('v14-tool-prose');for(const tool of tools)if(toolProse[tool.id])tool.paragraphs=toolProse[tool.id];
// Retain all source fields for deep links; remove only the unwanted reader panels and their search entries.
let script=original.match(/<script>const DATA=[\s\S]*?<\/script>\s*<script>([\s\S]*?)<\/script>/)[1];
script=script.split('\n').filter(line=>!/^\s*if \(arr\(page\.(cases|questions|roadmap|referenceTables)\)\.length\) html \+= section/.test(line)&&!/^\s*arr\(page\.(questions|referenceTables)\)\.forEach/.test(line)&&!/^\s*html \+= section\('learning-rule'/.test(line)).join('\n');
script=script.replace('<a class="button-link" href="${routeHref(\'module\', id, \'section\', \'questions\')}">关键问题</a>','');
script=script.replace("${navItem('#roadmap', '后续方向', '', currentRoute.name === 'roadmap')}",'');
script=script.replace("case 'roadmap': content = renderAllRoadmap(); break;","case 'roadmap': content = renderHome(); break;");
script=script.replace("question:'关键问题',",'');
// Changed passages must be reflected in legacy chapter text as well as module lessons.
for(const p of data.pages)for(const section of p.sections||[]){const lesson=p.teaching.lessons.find(l=>l.id===section.teachingTarget);if(lesson){section.title=lesson.title;section.paragraphs=lesson.paragraphs;}}
const changedFlows=[];
for(const p of data.pages)for(const flow of p.flows){const previous=originalData.pages.find(q=>q.id===p.id).flows.find(f=>f.id===flow.id);if(JSON.stringify(flow)!==JSON.stringify(previous)){const rendered=flowDiagram(p,flow);data.diagrams[flow.id]=rendered.svg;changedFlows.push(flow.id);}}
const full=readerOriginalSvg(originalData.originalSvg,data.base);data.originalSvg=full.svg;
const svgDom=new JSDOM(data.originalSvg,{contentType:'image/svg+xml'}),svgDoc=svgDom.window.document;
const shortLabels={'E-12':['普通工具结果','继续当前推理'],'X09':['独立异步反馈 → 输入管理重新准入']};
for(const change of patches.edgeLabels||[]){const text=svgDoc.querySelector(`.edge-label[data-edge="${change.id}"] text`);if(!text)throw Error('missing SVG edge '+change.id);text.replaceChildren();for(const [i,line]of(shortLabels[change.id]||[change.label]).entries()){const span=svgDoc.createElementNS('http://www.w3.org/2000/svg','tspan');span.setAttribute('x',text.getAttribute('x'));span.setAttribute('dy',i?'28':'0');span.textContent=line;text.appendChild(span);}}
data.originalSvg=svgDoc.documentElement.outerHTML;svgDom.window.close();
let highest=0;for(const dir of ['01-进行中','02-已交付','03-历史版本'])for(const file of fs.readdirSync(path.join(htmlRoot,dir))){const m=file.match(/^豆包汽车-业务学习站-v(\d+)\.html$/);if(m)highest=Math.max(highest,+m[1]);}
const version='v'+String(highest+1).padStart(2,'0');data.meta={...data.meta,version,baseVersion:'v14',builtAt:new Date().toISOString(),refinement:'在用户指定 v14 原页面上定向优化；保留原导航、详细图、节点、工具、场景。'};
const payload=JSON.stringify(data).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
let html=original.replace(/<script>const DATA=[\s\S]*?<\/script>/,()=>'<script>const DATA='+payload+';</script>');
html=html.replace(/(<\/script>\s*<script>)[\s\S]*?(<\/script>\s*<\/body>)/,(_,a,b)=>a+script+b);
const output=path.join(htmlRoot,'01-进行中',`豆包汽车-业务学习站-${version}.html`);fs.writeFileSync(output,html,{flag:'wx'});
for(const p of data.pages)for(const id of p.sourceIds)if(!sourceIds.has(id))throw Error('unknown source '+id);
const manifest={version,baseVersion:'v14',baseline,baselineSha256:crypto.createHash('sha256').update(original).digest('hex'),output,sha256:crypto.createHash('sha256').update(html).digest('hex'),sameStyles:html.match(/<style>([\s\S]*?)<\/style>/)[1]===original.match(/<style>([\s\S]*?)<\/style>/)[1],modules:data.pages.length,nodes:allNodes.length,tools:tools.length,walkthroughs:data.walkthroughs.length,updatedNodes:patches.nodes.map(n=>n.id),updatedFields:patches.edits.length,changedFlows,removedFlows:patches.removeFlows,toolCorrections:toolAudit.corrections.map(t=>t.id),svgTextOverflow:full.report.errors,verification:'pending'};
fs.writeFileSync(path.join(root,'v14-refinement-latest.json'),JSON.stringify(manifest,null,2));console.log(JSON.stringify(manifest,null,2));
