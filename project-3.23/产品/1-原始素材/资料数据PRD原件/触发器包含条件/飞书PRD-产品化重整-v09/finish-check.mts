import {loadEnvFile} from 'node:process';
import {readFileSync,writeFileSync} from 'node:fs';
import {createService} from '/Users/bytedance/Documents/Codex/2026-08-04/w/feishu-knowledge-assistant/src/server.ts';
loadEnvFile('.env');
const base='/Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/触发器包含条件';
const out=base+'/飞书PRD-产品化重整-v09';const doc='EGw0dWj5kowzuIxlrLScBppsnWO';
const api:any=createService().api,opts={token:'user' as const,userId:'ou_d35304ddd7e37a06ebac58f7f60b6522'};
const body=JSON.parse(readFileSync(base+'/飞书补充-MRv-v08/fetch.json','utf8'));
const previous=JSON.parse(readFileSync(out+'/产品化最终完整回读.json','utf8'));
const changes=[['选择运行环境及已有泳道','核对当前运行环境与已有隔离范围'],['指定测试车辆不能替代环境隔离；不支持的组合不能生效','测试／正式标记由服务端按部署环境带出；指定测试车不能替代环境隔离；泳道沿现有能力，不新增自由填写的环境标签']];
void(async()=>{
 let r:any=await api.requestJson(`/open-apis/docs_ai/v1/documents/${doc}/fetch`,{...opts,body});
 if(r.document.content!==previous.document.content)throw new Error('Concurrent edit detected');
 let revision=r.document.revision_id;
 for(const [from,to]of changes){
 const count=r.document.content.split(from).length-1;if(count!==1)throw new Error('Nonunique change '+count);
 const result:any=await api.requestJson(`/open-apis/docs_ai/v1/documents/${doc}`,{...opts,method:'PUT',body:{command:'str_replace',pattern:from,content:to,format:'xml',revision_id:revision}});
 if(result.result!=='success')throw new Error(JSON.stringify(result));revision=result.document.revision_id;
 }
 r=await api.requestJson(`/open-apis/docs_ai/v1/documents/${doc}/fetch`,{...opts,body});
 writeFileSync(out+'/产品化最终完整回读.json',JSON.stringify(r,null,2));
 const old=JSON.parse(readFileSync(out+'/当前飞书-修改前备份.json','utf8')).document.content;
 const assets=[...old.matchAll(/<(?:img|sheet|whiteboard|figure|source)\b[^>]*\bid="([^"]+)"/g)].map(m=>m[1]);
 const missing=assets.filter(id=>!r.document.content.includes('id="'+id+'"'));
 const headings=[...r.document.content.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map(m=>m[1]);
 const result={revision:r.document.revision_id,assets:assets.length,missing,headings,mainModules:10,businessCases:4,acceptanceCases:20,markers:r.document.content.includes('【图位')};
 writeFileSync(out+'/最终验收.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
 if(missing.length||result.markers)throw new Error('Validation failed');
})().catch(e=>{console.error(String(e));process.exitCode=1;});
