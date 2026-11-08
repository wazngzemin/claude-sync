import {loadEnvFile} from 'node:process';
import {readFileSync,writeFileSync} from 'node:fs';
import {createService} from '/Users/bytedance/Documents/Codex/2026-08-04/w/feishu-knowledge-assistant/src/server.ts';
loadEnvFile('.env');
const base='/Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/触发器包含条件';
const out=base+'/飞书PRD-产品化重整-v09';
const doc='EGw0dWj5kowzuIxlrLScBppsnWO';
const api:any=createService().api;
const opts={token:'user' as const,userId:'ou_d35304ddd7e37a06ebac58f7f60b6522'};
const fetchBody=JSON.parse(readFileSync(base+'/飞书补充-MRv-v08/fetch.json','utf8'));
const backup=JSON.parse(readFileSync(out+'/当前飞书-修改前备份.json','utf8'));
const original=backup.document.content;
const md=readFileSync(base+'/PRD-触发器配置平台改造-产品评审版-v09.md','utf8');
const chunks=md.split(/^## /m).slice(1).map(s=>({title:s.slice(0,s.indexOf('\n')).trim(),body:s.slice(s.indexOf('\n')+1).trim()}));
const h2=[...original.matchAll(/<h2 id="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g)].map(m=>({id:m[1],title:m[2]}));
const oldHeadings=h2.slice(0,8);
const appendix=h2[8].id;
const media=[...original.matchAll(/<(whiteboard|img)\b[^>]*\bid="([^"]+)"[^>]*>/g)].map(m=>({kind:m[1],id:m[2],name:(m[0].match(/name="([^"]+)"/)||[])[1]||'原有画板'}));
const sourceMedia=[...original.matchAll(/<(?:img|sheet|whiteboard|figure|source)\b[^>]*\bid="([^"]+)"/g)].map(m=>m[1]);
const selections:any={
 CONFIG:{id:'doxcnZ6owt00fr1AooR1tddJcNd',caption:'图 3-1 配置、校验与生效流程。先核对完整配置，再保存和关联；保存与实际生效分别验证。'},
 LIST:{id:'doxcn8pTYXkAjsyMATuF50fAgoh',caption:'图 4-1 现有场景列表主图。保留原有查询与范围使用习惯，补充分类型筛选和 Workflow 查看入口。'},
 VLM:{id:'doxcnfREFyKcBRYVxejPLe6EPUe',caption:'图 4-2 视觉输入职责。直接比较结构化结果、理解已有描述、DT 新调用视觉问答是不同处理方式。'},
 CHILD:{id:'doxcnXBz5XHmYhEv0vXVhGu4Qde',caption:'图 5-1 儿童锁主图。儿童或宠物分支放行后仍检查对应锁状态，目标位置与比较符按正文收口。'},
 MIRROR:{id:'doxcnUtLiw0Dg7yk9J0jBxkmWff',caption:'图 5-2 后视镜主图。红框表示输入缺口；未接分支不启用，挡位和车速以场景会签结果为准。'},
 FLASH:{id:'doxcnaiRKiQauNyluVUzOBJSN0d',caption:'图 5-3 闪念一期流程。已有描述判断后发送固定正文，接收和真实展示分别验证，排队能力不视为已具备。'}
};
const supplemental:any={
 'D3-Workflow三态与汇合.png':'B.5 判断结果与汇合。对应 4.5，前驱通过后仍判断后继；最终成立才进入动作。',
 'D5-视觉配置选择逻辑.png':'B.6 视觉配置路径。对应 4.4，先确认实际来源，再选字段比较或描述推理。',
 'S02-基础定义与适用范围.png':'B.7 基础信息区域。对应 4.2，分类、来源和判断类型分开；示例值不代表正式默认。',
 'S02b-渠道车型版本环境与泳道.png':'B.8 适用范围区域。对应 4.2，范围共同限定，测试车不替代环境隔离。',
 'S03-简单条件字段级联.png':'B.9 简单条件区域。对应 4.3，逐级选字段，变更上级时清理不兼容值。',
 'S04-简单视觉目标与VLM入口.png':'B.10 简单视觉目标。对应 4.4，一个目标不强制使用复杂 Workflow；真实接入需核验。',
 'S06c-结构化VLM位置与年龄字段.png':'B.11 同一乘客关联。对应 4.4，位置与年龄不能取自不同对象；旧图位置多选以正式目录限制为准。',
 'S06d-同一对象的AgeRange枚举.png':'B.12 年龄类别区域。对应 4.4，使用类别枚举，不把年龄类别当任意数字阈值。',
 'S07a-推理节点输入来源与目标.png':'B.13 推理节点输入。对应 4.4、4.5，选择已有描述并写判断目标，不代表新拍画面。',
 'S07b-推理节点目标与UNKNOWN边界.png':'B.14 无法判断边界。对应 4.4，缺少有效输入或判断失败不能按成立处理。',
 'S08-前驱OR与节点内部AND.png':'B.15 两层条件关系。对应 4.5，前驱汇合与本节点内部判断分别配置。',
 'S09-闪念固定正文与普通通知.png':'B.16 闪念动作区域。对应 4.6、5.4，仅固定正文，无标题、按钮和播报。',
 'S09b-共用执行策略.png':'B.17 共用策略区域。对应 4.7，原型数值是演示，正式统计口径和参数需会签。',
 'S12c-普通通知发送接收展示分层.png':'B.18 通知结果。对应 4.10，发送、接收、展示分别记录；没有回执不写成功。',
 'S13b-历史结果分层与操作时间线.png':'B.19 历史结果。对应 4.10，保留当时定义和输入，修改配置不改写旧结果。'
};
const boards=['B.1 原总体架构画板（保留查阅）。职责以正文第 3 章为准，旧图不扩展本期能力。','B.2 原配置发布画板（保留查阅）。云端规则生效与任务中心列表刷新分开理解。','B.3 原运行技术画板（保留查阅）。节点实现状态与并发参数不作为运营配置项。','B.4 原闪念画板（保留查阅）。排队、时效及 PHUD 联动以本期范围和会签结果为准。'];
const esc=(s:string)=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
let revision=backup.document.revision_id;
const log:any[]=[];
const save=()=>writeFileSync(out+'/产品化写入回执.json',JSON.stringify({doc,revision,log},null,2));
async function fetchDoc(){const r:any=await api.requestJson(`/open-apis/docs_ai/v1/documents/${doc}/fetch`,{...opts,body:fetchBody});revision=r.document.revision_id;return r;}
async function root(){const r:any=await api.requestJson(`/open-apis/docx/v1/documents/${doc}/blocks/${doc}`,opts);return r.block.children as string[];}
async function mutate(body:any){const r:any=await api.requestJson(`/open-apis/docs_ai/v1/documents/${doc}`,{...opts,method:'PUT',body:{...body,revision_id:revision}});if(r.result!=='success')throw new Error('Unconfirmed write '+JSON.stringify(r));revision=r.document.revision_id;log.push({command:body.command,id:body.block_id,revision});save();return r;}
function findParagraph(xml:string,text:string){const a=[...xml.matchAll(/<p\b[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/p>/g)].filter(m=>m[2].replace(/<[^>]*>/g,'')===esc(text));if(a.length!==1)throw new Error('Ambiguous paragraph '+text+' '+a.length);return a[0][1];}
async function main(){
 if(chunks.length!==8||oldHeadings.length!==8||media.length!==25)throw new Error('Unexpected structure');
 const archiveOnly=process.argv.includes('--resume-archive');
 const resume=process.argv.includes('--resume-after-main-cleared')||archiveOnly;
 if(resume){const prior=JSON.parse(readFileSync(out+'/产品化写入回执.json','utf8'));log.push(...prior.log);}
 const initial=await fetchDoc();if(!resume&&initial.document.content!==original)throw new Error('User changed document; reconcile before writing');
 let archiveAnchor:string;
 if(!resume){
 writeFileSync(out+'/发布前二次完整备份.json',JSON.stringify(initial,null,2));
 const r=await root();
 await mutate({command:'block_insert_after',block_id:r.at(-1),format:'markdown',content:'## 附录 B 原有画板与原型区域图\n\n本附录保留原有资产，供查阅页面位置及历史方案。演示值、旧路线和技术实现不扩展本期需求；正式规则按正文第 1 至 8 章。'});
 let fresh=await fetchDoc();
 archiveAnchor=findParagraph(fresh.document.content,'本附录保留原有资产，供查阅页面位置及历史方案。演示值、旧路线和技术实现不扩展本期需求；正式规则按正文第 1 至 8 章。');
 await mutate({command:'block_move_after',block_id:archiveAnchor,src_block_ids:media.map(m=>m.id).join(',')});
 console.log(JSON.stringify({phase:'media-safely-moved',count:media.length,revision}));
 // Only old main-body text and tables are removed. Headings and every media block are preserved.
 for(let i=7;i>=0;i--){
   const children=await root(),start=children.indexOf(oldHeadings[i].id)+1,end=children.indexOf(i===7?appendix:oldHeadings[i+1].id);
   if(start<1||end<start)throw new Error('Invalid deletion interval');
   const deleting=children.slice(start,end);
   if(deleting.some(id=>sourceMedia.includes(id)||oldHeadings.some(h=>h.id===id)))throw new Error('Protected asset in deletion range');
   if(end>start){await api.requestJson(`/open-apis/docx/v1/documents/${doc}/blocks/${doc}/children/batch_delete`,{...opts,method:'DELETE',body:{start_index:start,end_index:end}});await fetchDoc();log.push({command:'remove-redundant-main-section',section:i+1,count:deleting.length,revision});save();}
 }
 }else{archiveAnchor=findParagraph(initial.document.content,'本附录保留原有资产，供查阅页面位置及历史方案。演示值、旧路线和技术实现不扩展本期需求；正式规则按正文第 1 至 8 章。');}
 if(!archiveOnly)for(let i=0;i<8;i++){
   let current=await fetchDoc();
   let headings=[...current.document.content.matchAll(/<h2 id="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g)];
   let target=headings[i];
   if(target[2]!==esc(chunks[i].title)){
     await mutate({command:'block_replace',block_id:target[1],format:'xml',content:'<h2>'+esc(chunks[i].title)+'</h2>'});
     current=await fetchDoc();headings=[...current.document.content.matchAll(/<h2 id="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g)];target=headings[i];
   }
   await mutate({command:'block_insert_after',block_id:target[1],format:'markdown',content:chunks[i].body});
   console.log(JSON.stringify({phase:'chapter-written',chapter:i+1,revision}));
 }
 let fresh=await fetchDoc();
 if(!archiveOnly)for(const [key,item] of Object.entries(selections) as any){
   const p=[...fresh.document.content.matchAll(/<p\b[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/p>/g)].find(m=>m[2].includes('【图位 '+key+'】'));
   if(!p)throw new Error('Missing image marker '+key);
   await mutate({command:'block_replace',block_id:p[1],format:'xml',content:'<p><b>'+esc(item.caption)+'</b></p>'});
   const updated=await fetchDoc();const newCaption=findParagraph(updated.document.content,item.caption);
   await mutate({command:'block_move_after',block_id:newCaption,src_block_ids:item.id});
 }
 // Pair the archived assets with short requirements references rather than duplicate full explanations.
 const selected=new Set(Object.values(selections).map((v:any)=>v.id));
 const remaining=media.filter(m=>!selected.has(m.id));
 let previous=archiveAnchor,board=0;
 for(const item of remaining){
   const caption=item.kind==='whiteboard'?boards[board++]:supplemental[item.name];
   if(!caption)throw new Error('Missing archival caption '+item.name);
   const now=await fetchDoc();let cap:string|undefined;
   try{cap=findParagraph(now.document.content,caption);}catch{}
   if(!cap){await mutate({command:'block_insert_after',block_id:previous,format:'xml',content:'<p><b>'+esc(caption)+'</b></p>'});const children=await root();cap=children[children.indexOf(previous)+1];}
   const children=await root();
   if(children[children.indexOf(cap)+1]!==item.id)await mutate({command:'block_move_after',block_id:cap,src_block_ids:item.id});
   previous=item.id;
 }
 await mutate({command:'block_replace',block_id:appendix,format:'xml',content:'<h2>附录 A 旧字段与验收底稿（正文优先）</h2>'});
 const end=await fetchDoc();
 writeFileSync(out+'/产品化最终完整回读.json',JSON.stringify(end,null,2));
 const missing=sourceMedia.filter(id=>!end.document.content.includes('id="'+id+'"'));
 const markers=[...end.document.content.matchAll(/【图位 [^】]+】/g)].map(m=>m[0]);
 const finalHeadings=[...end.document.content.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map(m=>m[1]);
 const result={revision,oldAssets:sourceMedia.length,missing,unresolvedMarkers:markers,headings:finalHeadings,mainChineseChars:md.match(/[\u4e00-\u9fff]/g)?.length,assetCaptions:remaining.length};
 writeFileSync(out+'/产品化发布检查.json',JSON.stringify(result,null,2));
 console.log(JSON.stringify(result));
 if(missing.length||markers.length)throw new Error('Final validation failed');
}
main().catch(e=>{save();console.error(String(e));process.exitCode=1;});
