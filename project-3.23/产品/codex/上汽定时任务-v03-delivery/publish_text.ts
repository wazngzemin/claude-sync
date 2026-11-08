import { loadEnvFile } from 'node:process';
import { readFileSync, writeFileSync } from 'node:fs';
import { createService } from '/Users/bytedance/Documents/Codex/2026-08-04/w/feishu-knowledge-assistant/src/server.ts';
loadEnvFile('.env');
void(async()=>{
 const dir='/Users/bytedance/Desktop/3.23/产品/codex/上汽定时任务-v03-delivery';
 const api=createService().api;const userId='ou_d35304ddd7e37a06ebac58f7f60b6522';
 const doc='MqRhdW4GQo2YbmxHLx6cEUIfnte';const opts={token:'user' as const,userId};
 const plan=JSON.parse(readFileSync(dir+'/edit-plan.json','utf8'));
 const fetchBody=JSON.parse(readFileSync('/Users/bytedance/Desktop/3.23/产品/codex/上汽定时任务-v02-delivery/fetch.json','utf8'));
 const fresh:any=await api.requestJson(`/open-apis/docs_ai/v1/documents/${doc}/fetch`,{...opts,body:fetchBody});
 const backup=JSON.parse(readFileSync(dir+'/用户修改后-原文备份.json','utf8'));
 if(fresh.document.content!==backup.document.content)throw new Error('Document changed since backup; preserve user edits and reconcile before writing.');
 let revision=fresh.document.revision_id;let receipts:any[]=[];
 const save=()=>writeFileSync(dir+'/text-write-receipts.json',JSON.stringify({revision,receipts},null,2));
 for(let i=0;i<plan.text_batches.length;i++){
  const r:any=await api.requestJson(`/open-apis/docx/v1/documents/${doc}/blocks/batch_update?document_revision_id=${revision}`,{...opts,method:'PATCH',body:{requests:plan.text_batches[i]}});
  revision=r.document_revision_id;receipts.push({kind:'text_batch',index:i,revision,count:plan.text_batches[i].length});save();console.log(JSON.stringify(receipts.at(-1)));
 }
 for(const h of plan.headings){
  const r:any=await api.requestJson(`/open-apis/docs_ai/v1/documents/${doc}`,{...opts,method:'PUT',body:{command:'block_replace',block_id:h.block_id,content:h.content,format:'xml',revision_id:revision}});
  if(r.result!=='success')throw new Error('Heading update not confirmed: '+JSON.stringify(r));
  revision=r.document.revision_id;receipts.push({kind:'heading',block_id:h.block_id,revision});save();console.log(JSON.stringify(receipts.at(-1)));
 }
 for(const id of plan.deletes){
  const r:any=await api.requestJson(`/open-apis/docs_ai/v1/documents/${doc}`,{...opts,method:'PUT',body:{command:'block_delete',block_id:id,revision_id:revision}});
  if(r.result!=='success')throw new Error('Deletion not confirmed: '+JSON.stringify(r));
  revision=r.document.revision_id;receipts.push({kind:'remove_non_prd_text',block_id:id,revision});save();console.log(JSON.stringify(receipts.at(-1)));
 }
 const final:any=await api.requestJson(`/open-apis/docs_ai/v1/documents/${doc}/fetch`,{...opts,body:fetchBody});
 writeFileSync(dir+'/text-final-fetch.json',JSON.stringify(final,null,2));console.log(JSON.stringify({complete:true,revision:final.document.revision_id}));process.exit(0);
})().catch(e=>{console.error(String(e));process.exit(1)});
