import { loadEnvFile } from 'node:process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { basename } from 'node:path';
import { createService } from '/Users/bytedance/Documents/Codex/2026-08-04/w/feishu-knowledge-assistant/src/server.ts';
loadEnvFile('.env');
const dir='/Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/触发器包含条件/飞书补充-MRv-v08';
const api:any=createService().api;
const doc='EGw0dWj5kowzuIxlrLScBppsnWO',userId='ou_d35304ddd7e37a06ebac58f7f60b6522';
const opts={token:'user' as const,userId};
const fetchBody=JSON.parse(readFileSync(dir+'/fetch.json','utf8'));
const plan=JSON.parse(readFileSync(dir+'/待写入计划.json','utf8'));
const records:any[]=existsSync(dir+'/图片写入回执.json')?JSON.parse(readFileSync(dir+'/图片写入回执.json','utf8')).records:[];
const save=()=>writeFileSync(dir+'/图片写入回执.json',JSON.stringify({doc,records},null,2));
const decode=(s:string)=>s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#xA;/g,'\n');
async function upload(item:any){
 const bytes=readFileSync(item.file);
 const token=await api.accessToken('user',userId);
 const form=new FormData();
 form.set('file_name',basename(item.file));form.set('parent_type','docx_image');
 form.set('parent_node',item.block);form.set('size',String(bytes.length));
 form.set('extra',JSON.stringify({drive_route_token:doc}));
 form.set('file',new Blob([Uint8Array.from(bytes)],{type:'image/png'}),basename(item.file));
 const r=await fetch(new URL('/open-apis/drive/v1/medias/upload_all',api.options.baseUrl),{method:'POST',headers:{Authorization:`Bearer ${token}`},body:form,signal:AbortSignal.timeout(60000)});
 const data:any=await r.json();
 if(!r.ok||data.code!==0||!data.data?.file_token)throw new Error('Media upload failed '+r.status+' '+JSON.stringify({code:data.code,msg:data.msg}));
 return data.data.file_token;
}
async function main(){
 const before:any=await api.requestJson(`/open-apis/docs_ai/v1/documents/${doc}/fetch`,{...opts,body:fetchBody});
 const xml=before.document.content;
 const paras=[...xml.matchAll(/<p\b[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/p>/g)].map(m=>({id:m[1],text:decode(m[2].replace(/<[^>]+>/g,''))}));
 for(const item of plan.images){
  let rec=records.find(r=>r.caption===item.caption);
  if(rec)continue;
  const matches=paras.filter(p=>p.text.trim()===item.caption.trim());
  if(matches.length!==1)throw new Error('Caption not uniquely located: '+item.caption+' count='+matches.length);
  const root:any=await api.requestJson(`/open-apis/docx/v1/documents/${doc}/blocks/${doc}`,opts);
  const children=root.block.children;
  const at=children.indexOf(matches[0].id);
  if(at<0)throw new Error('Caption is not top-level');
  const create:any=await api.requestJson(`/open-apis/docx/v1/documents/${doc}/blocks/${doc}/children`,{...opts,method:'POST',body:{children:[{block_type:27,image:{}}],index:at+1}});
  rec={...item,block:create.children[0].block_id,status:'created'};records.push(rec);save();
  console.log(JSON.stringify({created:basename(item.file),block:rec.block}));
 }
 for(let start=0;start<records.length;start+=3){
  const batch=records.slice(start,start+3).filter(r=>r.status!=='bound');
  await Promise.all(batch.map(async item=>{if(!item.file_token){item.file_token=await upload(item);item.status='uploaded';save();}}));
  if(batch.length){
   await api.requestJson(`/open-apis/docx/v1/documents/${doc}/blocks/batch_update`,{...opts,method:'PATCH',body:{requests:batch.map(item=>({block_id:item.block,replace_image:{token:item.file_token}}))}});
   for(const item of batch)item.status='bound';save();console.log(JSON.stringify({bound:batch.map(i=>basename(i.file))}));
  }
 }
 const after:any=await api.requestJson(`/open-apis/docs_ai/v1/documents/${doc}/fetch`,{...opts,body:fetchBody});
 writeFileSync(dir+'/补充后-完整回读.json',JSON.stringify(after,null,2));
 const original=JSON.parse(readFileSync(dir+'/补充前-完整备份.json','utf8')).document.content;
 const keep=[...original.matchAll(/<(?:img|sheet|whiteboard|figure|source)\b[^>]*\bid="([^"]+)"/g)].map(m=>m[1]);
 const missing=keep.filter(id=>!after.document.content.includes('id="'+id+'"'));
 const imageIds=[...after.document.content.matchAll(/<img\b[^>]*\bid="([^"]+)"/g)].map(m=>m[1]);
 const mediaMissing=records.filter(r=>!imageIds.includes(r.block));
 const result={revision:after.document.revision_id,originalMediaAndSheets:keep.length,preserved:missing.length===0,missing,newImages:records.length,imagesPresent:mediaMissing.length===0,allBound:records.every(r=>r.status==='bound')};
 writeFileSync(dir+'/发布检查.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
 if(missing.length||mediaMissing.length)throw new Error('Preservation or image check failed');
}
main().catch(e=>{save();console.error(String(e));process.exitCode=1;});
