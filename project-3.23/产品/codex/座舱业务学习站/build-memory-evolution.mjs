import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {flowDiagram,validateGeometry} from './diagrams.mjs';
const root=path.resolve('.'),htmlRoot=path.resolve('../HTML');
const baseline=path.join(htmlRoot,'01-进行中/豆包汽车-业务学习站-v23.html');
const original=fs.readFileSync(baseline,'utf8');
const data=JSON.parse(original.match(/<script>const DATA=([\s\S]*?);<\/script>/)[1]);
const before=structuredClone(data),changes=[],flowChanges=[],geometryErrors=[];
const patchFiles=['memory','evolution','adjacent'].map(s=>`content/${s}-deepening-20261028.json`);
const patches=patchFiles.map(p=>JSON.parse(fs.readFileSync(p,'utf8')));
const unique=a=>[...new Set(a)];
for(const patch of patches){
 for(const source of patch.sources){const existing=data.sources.find(s=>s.id===source.id);if(existing&&existing.url!==source.url)throw Error('Conflicting source '+source.id);if(!existing)data.sources.push(source);}
 for(const addition of patch.pages){
  const p=data.pages.find(p=>p.id===addition.id);if(!p)throw Error('Missing page '+addition.id);
  for(const lesson of addition.lessons){const index=p.teaching.lessons.findIndex(l=>l.id===lesson.id);if(index<0){p.teaching.lessons.push(lesson);changes.push({page:p.id,lesson:lesson.id,type:'added'});}else{p.teaching.lessons[index]={...p.teaching.lessons[index],...lesson};changes.push({page:p.id,lesson:lesson.id,type:JSON.stringify(before.pages.find(x=>x.id===p.id).teaching.lessons[index])===JSON.stringify(p.teaching.lessons[index])?'retained':'expanded'});}}
  for(const flow of addition.flows||[]){const index=p.flows.findIndex(f=>f.id===flow.id);if(index<0)p.flows.push(flow);else p.flows[index]=flow;const rendered=flowDiagram(p,flow);geometryErrors.push(...validateGeometry(rendered).map(e=>flow.id+': '+e));data.diagrams[flow.id]=rendered.svg;flowChanges.push({page:p.id,id:flow.id,type:index<0?'added':'corrected',nodes:flow.nodes.length});}
  Object.assign(p.teaching.guides,addition.guides||{});
  for(const flow of addition.flows||[]){const g=p.teaching.guides[flow.id];if(!g?.paragraphs?.length)throw Error('Missing guide '+flow.id);g.nodeIds=flow.nodes.map(n=>n.id);}
  p.sourceIds=unique([...p.sourceIds,...addition.lessons.flatMap(l=>l.sourceIds||[]),...(addition.flows||[]).flatMap(f=>f.sourceIds||[])]);
  p.teaching.sourceIds=unique([...(p.teaching.sourceIds||[]),...p.sourceIds]);
 }
 for(const edit of patch.pageEdits||[]){let target=data.pages.find(p=>p.id===edit.pageId);for(const key of edit.path.slice(0,-1))target=target[key];if(!(edit.path.at(-1) in target))throw Error('Missing edit path');target[edit.path.at(-1)]=edit.value;}
 if(patch.nodeEdits?.length||patch.toolEdits?.length)throw Error('Graph or tool edits require explicit layout review');
}
const se=data.pages.find(p=>p.id==='SE');se.teaching.closing.push('专家知识补充场景做法，个人指导表达未来的服务约定；它们经过各自定义的保存与检索入口，才有机会影响下一次判断。长时任务的持续检查和自动知识生产按材料所处阶段理解，再接回任务、Advisor、Context 和工具执行链路。');
for(const p of data.pages)for(const section of p.sections||[]){const lesson=p.teaching.lessons.find(l=>l.id===section.teachingTarget);if(lesson){section.title=lesson.title;section.paragraphs=lesson.paragraphs;}}
// Preserve the original site and graph. Newly read evidence extends the existing modules.
const sources=new Set(data.sources.map(s=>s.id));
for(const p of data.pages){for(const id of p.sourceIds)if(!sources.has(id))throw Error('Unknown source '+id);for(const l of p.teaching.lessons)for(const id of l.sourceIds||[])if(!sources.has(id))throw Error('Unknown lesson source '+id);}
if(geometryErrors.length)throw Error(geometryErrors.join('\n'));
let highest=0;for(const dir of ['01-进行中','02-已交付','03-历史版本'])for(const name of fs.readdirSync(path.join(htmlRoot,dir))){const m=name.match(/^豆包汽车-业务学习站-v(\d+)\.html$/);if(m)highest=Math.max(highest,+m[1]);}
const version='v'+String(highest+1).padStart(2,'0');
data.meta={...data.meta,version,baseVersion:'v14',previousVersion:'v23',builtAt:new Date().toISOString(),refinement:'保留 v14 页面及 v23 定向修订，依据新增飞书原文细化记忆、专家知识及相邻链路。'};
const payload=JSON.stringify(data).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
const html=original.replace(/<script>const DATA=[\s\S]*?<\/script>/,()=>'<script>const DATA='+payload+';</script>');
const output=path.join(htmlRoot,'01-进行中',`豆包汽车-业务学习站-${version}.html`);
fs.writeFileSync(output,html,{flag:'wx'});
const manifest={version,baseline,output,baselineSha256:crypto.createHash('sha256').update(original).digest('hex'),sha256:crypto.createHash('sha256').update(html).digest('hex'),sameStyles:html.match(/<style>([\s\S]*?)<\/style>/)[1]===original.match(/<style>([\s\S]*?)<\/style>/)[1],changes,flowChanges,geometryErrors,modules:data.pages.length,lessons:data.pages.reduce((n,p)=>n+p.teaching.lessons.length,0),sources:data.sources.length,coverage:patches.map(p=>p.coverage),browserVisual:'pending'};
fs.writeFileSync('memory-evolution-latest.json',JSON.stringify(manifest,null,2));
const preview=path.join(root,'previews',version);fs.mkdirSync(preview,{recursive:true});
for(const f of flowChanges){fs.writeFileSync(path.join(preview,f.id+'.svg'),data.diagrams[f.id]);fs.writeFileSync(path.join(preview,f.id+'-plan.md'),`# ${f.id}\n\n位置：${f.page} 模块。沿用 v14 的纵向流程卡片样式，侧边通道处理分支；每条线描述交接内容或判断条件。图下保留连续带读。\n\n${JSON.stringify(data.pages.find(p=>p.id===f.page).flows.find(x=>x.id===f.id),null,2)}\n`);}
console.log(JSON.stringify({version,output,modules:manifest.modules,lessons:manifest.lessons,changedLessons:changes.length,flows:flowChanges.length,geometryErrors},null,2));
