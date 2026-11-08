import {loadEnvFile} from 'node:process';
import {readFileSync,writeFileSync} from 'node:fs';
import {createService} from '/Users/bytedance/Documents/Codex/2026-08-04/w/feishu-knowledge-assistant/src/server.ts';
loadEnvFile('.env');
const dir='/Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/触发器包含条件/飞书补充-MRv-v08';
const api=createService().api,doc='EGw0dWj5kowzuIxlrLScBppsnWO';
const opts={token:'user' as const,userId:'ou_d35304ddd7e37a06ebac58f7f60b6522'};
const fetchBody=JSON.parse(readFileSync(dir+'/fetch.json','utf8'));
const esc=(s:string)=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
void(async()=>{
 const before:any=await api.requestJson(`/open-apis/docs_ai/v1/documents/${doc}/fetch`,{...opts,body:fetchBody});
 let revision=before.document.revision_id;
 const xml=before.document.content;
 const paragraphs=[...xml.matchAll(/<p\b[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/p>/g)].map(m=>({id:m[1],text:m[2].replace(/<[^>]+>/g,'')}));
 const edits=[
  {prefix:'读法：左边是判断依据',text:'读法：左边提供端状态、VLM、账号开关和单车状态；中间 Trigger 判断并提交命中；右边系统预设走主动推荐／DT，闪念走 Frontier 普通通知。车辆执行由下游负责。保留的原技术画板中“排队／过期”表示目标边界，不代表已完成；当前能力与待确认项按 4.7、6.1 验收。'},
  {prefix:'读法：产品在后台选模式',text:'配置时先填全基础范围、判断、动作和执行策略，再校验与提交。服务端校验合法后注册不可变定义并关联场景，成功后回读；保存、发布、车辆生效分别验证。上方保留原技术示意，定义注册后的连线不表示动作等到注册后才填写；完整操作顺序以图 3-B 为准。'},
  {prefix:'图 P3-A｜同一乘客关联',text:'图 P3-A｜同一乘客关联（v08 差异示意）：旧图 Position in 不作为正式支持；目录仅等于时按等于组合配置。'},
  {prefix:'闪念与系统预设带卡任务分开：',text:'闪念与系统预设带卡任务分开：①读取已有 VLM 描述，预配置监听单独接通，不能拿动态任务通路替代；②命中后不进入 DT／VQA，经 Frontier 发普通通知；③低优先级、不抢占语音和正在交互内容，容器排队仍属规划；④一期固定正文，已有模型仅用于条件判断。保留原画板中的“≥1 分钟”为示例而非正式默认，“统一排队／过期”为目标而非上线现状；一期完整链路与验收见图 6-A。'},
 ];
 const receipts=[];
 for(const e of edits){
  const found=paragraphs.filter(p=>p.text.startsWith(e.prefix));if(found.length!==1)throw new Error('Not unique '+e.prefix);
  const r:any=await api.requestJson(`/open-apis/docs_ai/v1/documents/${doc}`,{...opts,method:'PUT',body:{command:'block_replace',block_id:found[0].id,format:'xml',content:'<p>'+esc(e.text)+'</p>',revision_id:revision}});
  if(r.result!=='success')throw new Error('Not confirmed');revision=r.document.revision_id;receipts.push({prefix:e.prefix,revision});
 }
 const after:any=await api.requestJson(`/open-apis/docs_ai/v1/documents/${doc}/fetch`,{...opts,body:fetchBody});
 writeFileSync(dir+'/最终回读.json',JSON.stringify(after,null,2));writeFileSync(dir+'/口径收敛回执.json',JSON.stringify(receipts,null,2));
 const original=JSON.parse(readFileSync(dir+'/补充前-完整备份.json','utf8')).document.content;
 const keep=[...original.matchAll(/<(?:img|sheet|whiteboard|figure|source)\b[^>]*\bid="([^"]+)"/g)].map(m=>m[1]);
 const images=JSON.parse(readFileSync(dir+'/图片写入回执.json','utf8')).records;
 const missing=keep.filter(id=>!after.document.content.includes('id="'+id+'"'));
 const summary={revision,originalAssetsPreserved:missing.length===0,originalAssets:keep.length,newImages:images.length,newImagesRetained:images.every((r:any)=>after.document.content.includes('id="'+r.block+'"')),sheets:(after.document.content.match(/<sheet /g)||[]).length,whiteboards:(after.document.content.match(/<whiteboard /g)||[]).length};
 writeFileSync(dir+'/最终检查.json',JSON.stringify(summary,null,2));console.log(JSON.stringify(summary));
 process.exit(0);
})().catch(e=>{console.error(String(e));process.exit(1)});
