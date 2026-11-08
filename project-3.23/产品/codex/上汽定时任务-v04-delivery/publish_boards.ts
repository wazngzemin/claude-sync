import { loadEnvFile } from 'node:process';
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { createService } from '/Users/bytedance/Documents/Codex/2026-08-04/w/feishu-knowledge-assistant/src/server.ts';
loadEnvFile('.env');
void(async()=>{
const dir='/Users/bytedance/Desktop/3.23/产品/codex/上汽定时任务-v04-delivery';
const assets='/Users/bytedance/Desktop/3.23/产品/codex/上汽定时任务-v04-assets';
const api=createService().api;const opts={token:'user' as const,userId:'ou_d35304ddd7e37a06ebac58f7f60b6522'};
const boards=JSON.parse(readFileSync('/Users/bytedance/Desktop/3.23/产品/codex/上汽定时任务-v03-delivery/current-boards.json','utf8'));const only=process.argv[2]==='all'?undefined:process.argv[2];const force=process.argv[3]==='refresh';const receipts:any[]=[];
function normalized(nodes:any[]){return JSON.stringify(nodes.map(n=>({id:n.id,text:n.text, x:n.x,y:n.y,width:n.width,height:n.height,rotation:n.rotation,type:n.type})).sort((a,b)=>a.id.localeCompare(b.id)));}
async function getReady(path:string){for(let i=0;i<8;i++){try{return await api.requestJson(path,opts);}catch(e){if(!String(e).includes('2890007')||i===7)throw e;await new Promise(r=>setTimeout(r,2000));}}}
for(const b of boards){if(only&&(only.endsWith('+')?b.index<parseInt(only):Number(only)!==b.index))continue;
const no=String(b.index).padStart(2,'0');const path=`/open-apis/board/v1/whiteboards/${b.whiteboard_id}/nodes`;
const receiptExists=existsSync(dir+'/'+no+'-board-write-receipt.json');const alreadyWritten=receiptExists&&!force;
if(!alreadyWritten){const fresh:any=await getReady(path);const old=JSON.parse(readFileSync(dir+'/'+no+(existsSync(dir+'/'+no+'-latest-user-nodes.json')?'-latest-user-nodes.json':receiptExists?'-after-nodes.json':'-before-nodes.json'),'utf8'));
if(normalized(fresh.nodes)!==normalized(old.nodes))throw new Error('Whiteboard changed since backup: '+no+'; reconcile user edits before replacing.');}
const file=readdirSync(assets).find(x=>x.startsWith(no+'-')&&x.endsWith('-native.json'));if(!file)throw new Error('Missing converter output '+no);
const converted=JSON.parse(readFileSync(assets+'/'+file,'utf8'));const nodes=converted.nodes??converted.data?.result?.nodes;if(!nodes?.length)throw new Error('Invalid converted nodes '+no);
if(!alreadyWritten){const receipt:any=await api.requestJson(path,{...opts,method:'POST',body:{nodes,overwrite:true}});
writeFileSync(dir+'/'+no+'-board-write-receipt.json',JSON.stringify(receipt,null,2));}
const after:any=await getReady(path);writeFileSync(dir+'/'+no+'-after-nodes.json',JSON.stringify(after,null,2));
if(after.nodes.length!==nodes.length)throw new Error('Node count mismatch '+no);
const text=(ns:any[])=>ns.map(n=>n.text?.text??'').sort();
if(JSON.stringify(text(nodes))!==JSON.stringify(text(after.nodes)))throw new Error('Text mismatch '+no);
receipts.push({index:b.index,whiteboard_id:b.whiteboard_id,node_count:after.nodes.length,verified:true});
writeFileSync(dir+'/board-write-verification.json',JSON.stringify(receipts,null,2));console.log(JSON.stringify(receipts.at(-1)));
}
process.exit(0);
})().catch(e=>{console.error(String(e));process.exit(1)});
