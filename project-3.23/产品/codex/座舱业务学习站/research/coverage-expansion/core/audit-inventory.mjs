import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const site=path.resolve(here,'../../..');
const broad=path.resolve(site,'../全源重读-20261023');
const earlier=path.resolve(site,'../语音课堂研究-20261022');
const dataPath=path.join(site,'site-data.json');
const dataText=fs.readFileSync(dataPath,'utf8');
const data=JSON.parse(dataText);
const input=data.coverage.inventory;
if(input.length!==322)throw new Error('Expected original 322-entry inventory; inspect changed input before re-running.');
const token=u=>String(u||'').split(/[?#]/)[0].replace(/\/$/,'').split('/').at(-1);
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const relative=p=>path.relative(path.resolve(site,'..'),p);
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const scanned=[...files(broad),...files(earlier),...files(path.join(site,'research'))].filter(p=>/\.(json|md)$/.test(p)&&!p.endsWith('/inventory-audit.json')&&!p.endsWith('/core/inventory-evidence-detail.json'));
const alias=new Map();
function root(k){if(!alias.has(k))alias.set(k,k);if(alias.get(k)!==k)alias.set(k,root(alias.get(k)));return alias.get(k);}
function union(a,b){if(a&&b)alias.set(root(b),root(a));}
const direct=[];
function unpack(v,file,depth=0,hint=null){
 if(!v||typeof v!=='object'||depth>7)return;
 if(Array.isArray(v)){for(const x of v)unpack(x,file,depth+1,hint);return;}
 hint=v.request?.url||hint;
 if(v.source_url){
  union(token(v.source_url),v.token);union(token(v.source_url),v.node?.node_token);union(token(v.source_url),v.node?.obj_token);
  const body=typeof v.content?.content==='string'?v.content.content:typeof v.body==='string'?v.body:'';
  direct.push({url:v.source_url,file:relative(file),apiStatus:v.status||'unknown',bodyChars:body.length,bodyHash:body?sha(body):null,bodyPresent:body.length>100,truncated:Boolean(v.truncated||v.content?.truncated||v.has_more),title:v.node?.title||body.match(/^#\s+(.+)/)?.[1]||null,error:v.error||null});
  return;
 }
 if((v.status==='failed'||v.status==='error')&&hint)direct.push({url:hint,file:relative(file),apiStatus:v.status,bodyChars:0,bodyHash:null,bodyPresent:false,truncated:false,error:v.error||null});
 for(const [key,value]of Object.entries(v))if(key!=='content'&&value&&typeof value==='object')unpack(value,file,depth+1,hint);
 if(Array.isArray(v.content))for(const c of v.content)if(c.type==='text'&&c.text){try{unpack(JSON.parse(c.text),file,depth+1,hint);}catch{}}
}
const textFiles=[];
for(const file of scanned){
 const text=fs.readFileSync(file,'utf8');
 if(file.endsWith('.json')){try{unpack(JSON.parse(text),file)}catch{}}
 else {
  const origin=text.match(/^#?\s*来源[：:]\s*(https:\/\/\S+)/m)?.[1];
  if(origin)direct.push({url:origin,file:relative(file),apiStatus:'cached_markdown',bodyChars:text.length,bodyHash:sha(text),bodyPresent:text.length>100,truncated:false,title:null,error:null});
 }
 textFiles.push({file:relative(file),text});
}
const previous=[];
for(const domain of ['voice','director','async']){
 const file=path.join(broad,domain,'inventory.json');
 const docs=JSON.parse(fs.readFileSync(file,'utf8')).documents;
 for(const d of docs)previous.push({...d,auditFile:relative(file),domain});
}
// Same-turn peer agents own these ledgers. Preserve exact scope instead of rereading their documents.
const peerLedgers=[
 ['memory','inventory.json'],['memory','followup-inventory.json'],
 ['evaluation','read-status.json'],['evaluation','followup-read-status.json']
];
const peerReadings=[];
for(const [domain,name]of peerLedgers){
 const file=path.join(site,'research/coverage-expansion',domain,name);
 if(!fs.existsSync(file))continue;
 const ledger=JSON.parse(fs.readFileSync(file,'utf8'));
 for(const d of ledger.documents||[]){
  union(token(d.url),d.objectToken);
  const bodyFile=d.bodyFile?relative(path.join(path.dirname(file),d.bodyFile)):d.localFile?relative(path.join(site,d.localFile)):null;
  const r={...d,url:d.url,title:d.actualTitle||d.title,read_status:d.readStatus||d.status,review_status:d.readScope||null,body_chars:d.returnedChars||d.returnedCharacters||d.bodyChars||d.normalizedTextCharacters||0,body_file:bodyFile,review_note:[d.reviewNote,d.note,d.readScope,d.boundary].filter(Boolean).join('；'),diagram_status:d.imageStatus||'嵌入图像未由本条审读记录完整核验；保留边界原文。',auditFile:relative(file),domain:'coverage-expansion/'+domain};
  previous.push(r);peerReadings.push(r);
 }
}
// The earlier coverage report records read scope independently from current site citations.
const earlierCoverage=path.join(earlier,'coverage.md');
for(const line of fs.readFileSync(earlierCoverage,'utf8').split('\n')){
 if(!line.startsWith('|'))continue;
 const match=line.match(/\[([^\]]+)\]\((https:\/\/[^)]+)\)\|([^|]+)\|/);
 if(!match)continue;
 const [,title,url,note]=match;
 const status=/403|权限拒绝/.test(note)?'read_failed_or_unsupported':/截断|部分|相关片段|前约|范围|重点段落|专题核读/.test(note)?'partial_body_or_table_review':/已读|完整返回/.test(note)?'recorded_business_text_reviewed':'metadata_only';
 previous.push({url,title,read_status:status,review_note:note,auditFile:relative(earlierCoverage),domain:'voice-20261022',diagram_status:'保留 2026-10-22 覆盖报告原有图像边界；本轮未重新看图。'});
}
const supplemental=[
 {key:'end-cloud-onepage',id:'CORE-ENDCLOUD-ONEPAGE',url:'https://bytedance.larkoffice.com/wiki/DBRnwrLFNiPxV5kZZOXcBYxqnCl',title:'豆包 × AIDV 端云链路 One Page',boundary:'文档明确 202607 为当前方案，非豆包 IP 自建链路为建设中；文档状态不替代指定车型、客户端版本和渠道的上线验收。',diagram:'正文中的架构与历史方案原图位置未返回像素；本次未做画板视觉核验。'},
 {key:'knowledge-status-retrieval',id:'CORE-KNOWLEDGE-STATUS',url:'https://bytedance.larkoffice.com/docx/HtkadRB8DocbSFx4NQNcjX8wnhg',title:'【主线&AI汽车】座舱大模型-知识&状态检索需求',boundary:'修订记录为 2025-07-28 V0.1；包含原主线项目与 AI 汽车需求，2 秒/10 秒等历史频次不外推当前项目。',diagram:'产品链路、知识梳理和知识类型等位置有空白；本次只读返回正文与表格，没有看见嵌入图。'},
 {key:'capability-model',id:'CORE-CAPABILITY-MODEL',url:'https://bytedance.larkoffice.com/wiki/JxAXwMcpdiriTdkdDyOc5vE6nve',title:'豆包汽车能力建模',boundary:'能力定义、L1-L4 行为举例与评测框架，不是模型当前能力评分或功能上线清单；目标值栏多处空白。',diagram:'可返回文字与表格已审读；原文黄色高亮的视觉状态未核验。'},
 {key:'driver-agent-prd',id:'CORE-DRIVER-PRD',url:'https://bytedance.larkoffice.com/wiki/M8n2wAHP0i36wukldtncEy2bnhh',title:'【AI汽车】司机 Agent（舱驾融合）产品需求 PRD',boundary:'V1.1 修订记录至 2026-03-26；正文含完整愿景、目标、部分空节及后附细化草案，澄清支持与取消优先级存在内部冲突，不作当前车辆生效合同。',diagram:'返回文本流程图、状态机和接口示例已读；早期系统架构/业务流嵌入图未返回像素，未视觉核验。'},
 {key:'mainchain-upgrade',id:'CORE-RTC-HISTORICAL',url:'https://bytedance.larkoffice.com/wiki/GHALwJeDbi8F7kkj4uRcLZLmnjf',title:'AI汽车主链路升级豆包模块技术方案',boundary:'描述 RTC、Speech 与座舱竞速的历史升级方案；相较端云 One Page 的 202607 当前方案，只用作历史对照，不并入当前链路。',diagram:'业务流程、系统交互和时序图位置未返回像素；只核正文协议描述。'},
 {key:'dynamic-knowledge',id:'CORE-DYNAMIC-KNOWLEDGE',url:'https://bytedance.larkoffice.com/wiki/EZ0PwsuFjiCg85kJqu8cmQRinLb',title:'动态知识检索&使用 需求说明',boundary:'需求和提示词参考；正文明确知识 Excel 待补、知识仍在产出，知识 ID 例子和目录存在冲突；18 个工具定义只是此提示词快照，不等于全站或线上工具总数。',diagram:'可返回文字、知识目录、示例、JSON 和 SP 已审读；没有独立画板视觉核验。'}
].map(x=>{const j=JSON.parse(fs.readFileSync(path.join(here,x.key+'.raw.json'),'utf8'));return {...x,readStatus:'full_returned_business_text_reviewed_this_pass',apiStatus:j.status,bodyChars:j.content.content.length,bodyCompleteAsReturned:true,wholeDocumentVisualComplete:false,reviewScope:'全部可返回业务文字、表格、提示词及状态/接口例子已审读；未做代码运行、接口调用或量产验收。',rawFile:relative(path.join(here,x.key+'.raw.json')),bodyHash:sha(j.content.content),objectToken:j.token};});
const followupLedgerPath=path.join(here,'followup-read-status.json');
const followupLedger=JSON.parse(fs.readFileSync(followupLedgerPath,'utf8'));
for(const d of followupLedger.documents){
 const rawPath=path.join(here,d.rawFile);const j=JSON.parse(fs.readFileSync(rawPath,'utf8'));
 supplemental.push({...d,apiStatus:d.returnStatus,readStatus:d.readStatus,bodyCompleteAsReturned:d.bodyCompleteAsReturned,wholeDocumentVisualComplete:false,reviewScope:d.boundary,rawFile:relative(rawPath),bodyHash:sha(j.content.content),boundary:d.boundary,diagram:d.diagramStatus,reviewLedger:relative(followupLedgerPath)});
}
const visualLedgerPath=path.join(here,'visual-review-reported.json');
const visualLedger=JSON.parse(fs.readFileSync(visualLedgerPath,'utf8'));
const onepage=supplemental.find(x=>x.id==='CORE-ENDCLOUD-ONEPAGE');
onepage.diagram='根代理于 2026-10-23 在浏览器检查三张画板：①四方端云全图关键节点/箭头；②豆包内部图仅 IM→三方 Agent 支路；③四泳道语音时序上下两半。第二图非全图核验；未检查生产调用或部署。';
onepage.visualReviewLedger=relative(visualLedgerPath);
onepage.visualBoardsReviewed=3;
onepage.wholeDocumentVisualComplete=false;

const ids=a=>new Set(a);
const secondary=ids([1,2,3,4,5,6,7,37,43,53,54,63,74,86,93,163,222,240,241,242,248,96]);
const originalArchitecture=ids([17,62,75,97,99,101,151,283]);
const originalPrd=ids([8,9,25,26,30,35,39,45,46,48,52,55,56,58,59,64,71,72,78,79,83,86,87,88,90,96,98,114,119,123,127,129,133,135,136,143,144,149,150,206,211,214,247,271,279,298,305,318]);
const evaluation=ids([10,11,18,23,24,27,29,36,57,81,82,92,103,105,106,108,111,122,124,125,132,137,138,140,141,142,154,159,161,164,165,179,181,187,191,199,200,217,220,223,224,227,249,257,258,259,285,300,315,316]);
const project=ids([12,13,14,15,19,20,21,22,28,33,49,51,67,68,73,84,102,107,109,116,128,145,157,166,180,183,184,202,210,239,278,280,281,287,311]);
const historical=ids([16,34,61,69,89,95,104,110,112,113,114,115,148,167,168,171,185,189,201,243,263,298,308]);
const meetings=ids([38,47,66,70,100,120,130,152,162,182,186,192,221,246,260,261,273,276,277,290]);
const marketingUnrelated=ids([31,32,40,41,42,44,50,60,65,76,77,80,85,91,94,118,121,126,131,134,146,147,153,155,156,158,169,170,172,173,174,175,176,177,178,188,190,193,194,195,196,198,203,204,205,207,212,213,215,216,218,225,228,229,230,231,232,233,234,235,245,250,251,252,253,254,255,256,262,264,265,266,267,268,269,270,272,274,275,282,284,286,288,289,291,292,293,294,295,296,297,301,302,303,304,306,309,313,314,317,319,320,321,322]);
const categories={primary_architecture:'原始架构/技术设计',primary_prd:'原始产品需求/能力协议',primary_evaluation:'原始评测/质量/用研材料',primary_project_config:'项目配置/交付管理/索引',meeting:'会议资料：需核逐字稿',historical:'历史/旧版本/废弃资料',secondary:'AI 生成或二手整理稿',marketing_unrelated:'营销/其他业务/主链路无关',unclassified:'题名不足，需正文判定'};
function classify(i){for(const [code,set]of [['secondary',secondary],['meeting',meetings],['historical',historical],['primary_architecture',originalArchitecture],['primary_prd',originalPrd],['primary_evaluation',evaluation],['primary_project_config',project],['marketing_unrelated',marketingUnrelated]])if(set.has(i))return code;return 'unclassified';}
function normalizeStatus(d){const s=[d.read_status,d.review_status].filter(Boolean).join(' ');
 if(/index_body_reviewed/.test(s))return 'index_body_reviewed';
 if(/body-read/.test(s)&&!/partial/.test(s))return 'recorded_business_text_reviewed';
 if(['recorded_business_text_reviewed','partial_body_or_table_review','read_failed_or_unsupported'].includes(d.read_status))return d.read_status;
 if(/body_partially_reviewed|table_requested_ranges|partial/.test(s))return 'partial_body_or_table_review';
 if(/full_text_body_read|full_body_read|business_text_reviewed|business_body_and_protocol_reviewed|business_body_reviewed|body_reviewed/.test(s))return 'recorded_business_text_reviewed';
 if(/fetched.*(pending|not_reviewed)|body_fetched_review_pending/.test(s))return 'body_cached_review_pending';
 if(/title_only_board/.test(s))return 'title_only_prior_board_note';
 if(/directory|empty/.test(s))return 'directory_or_empty';
 if(/failed|denied|unsupported|forbidden/.test(s))return 'read_failed_or_unsupported';
 return 'metadata_only';
}
const priority=['full_returned_business_text_reviewed_this_pass','recorded_business_text_reviewed','partial_body_or_table_review','index_body_reviewed','body_cached_review_pending','source_note_reviewed_scope','body_cached_review_unconfirmed','title_only_prior_board_note','directory_or_empty','read_failed_or_unsupported','metadata_only'];
const inventory=input.map((item,index)=>{
 const k=root(token(item.url));
 const matches=previous.filter(d=>root(token(d.url))===k);
 const snapshots=direct.filter(d=>root(token(d.url))===k);
 const sources=data.sources.filter(s=>root(token(s.url))===k);
 const fresh=supplemental.find(s=>root(token(s.url))===k);
 const states=matches.map(normalizeStatus);
 if(fresh)states.push(fresh.readStatus);
 if(snapshots.some(s=>s.bodyPresent))states.push('body_cached_review_unconfirmed');
 if(snapshots.some(s=>s.apiStatus==='failed'||s.apiStatus==='error'))states.push('read_failed_or_unsupported');
 if(sources.some(s=>/已读|审读|完整.*正文|核验/.test(s.note||'')))states.push('source_note_reviewed_scope');
 const status=priority.find(s=>states.includes(s))||'metadata_only';
 const cat=classify(index+1);
 const relatedFiles=textFiles.filter(f=>f.text.includes(token(item.url))).map(f=>f.file);
 const primary=cat.startsWith('primary_');
 const transcript=/^文字记录/.test(item.title);
 return {index:index+1,title:item.title,url:item.url,type:item.type,category:cat,categoryLabel:categories[cat],classificationBasis:fresh?'本次完整可返回正文+题名':matches.length||snapshots.length?'题名+已有取证记录；非全部重读后的内容分类':'题名初筛；不声称已读正文',classificationConfidence:cat==='unclassified'?'low':fresh?'high':'medium',readStatus:status,siteSourceIds:item.sourceIds||[],matchedSourceIds:sources.map(s=>s.id),sourceNotes:sources.map(s=>({id:s.id,note:s.note})),priorAuditRecords:matches.map(d=>({auditFile:d.auditFile,domain:d.domain,readStatus:d.read_status,reviewStatus:d.review_status||null,bodyChars:d.body_chars||0,bodyFile:d.body_path||d.body_file||d.local_text||null,sourceId:d.id||null,diagramStatus:d.diagram_status||null,reviewNote:d.review_note||null})),bodySnapshots:snapshots,searchOrLinkMentions:relatedFiles,mentionWarning:'URL 出现在搜索清单、索引、正文链接中只证明被定位或引用，不证明该链接正文已读。',supplemental:fresh?{sourceId:fresh.id,bodyChars:fresh.bodyChars,bodyCompleteAsReturned:true,diagramStatus:fresh.diagram,boundary:fresh.boundary,reviewLedger:fresh.reviewLedger||'座舱业务学习站/research/coverage-expansion/core/README.md',visualReviewLedger:fresh.visualReviewLedger||null}:null,needsFollowUp:cat==='meeting'?(transcript?'逐字稿文档已定位；需按读取状态确认完整审读，不能只看同场 AI 纪要':'需要打开文末相关链接或会议检索定位文字记录；本清点不以纪要替代逐字稿'):status==='metadata_only'&&primary?'原始相关材料尚未发现正文取证证据，待按主链路优先级续读':status==='partial_body_or_table_review'?'已有局部文字或表格审读，按记录补足未读部分；不能计作整篇已读':status==='index_body_reviewed'?'只读索引正文；所列链接内机制仍需逐篇取证':status==='read_failed_or_unsupported'?'已定位原入口，但读取失败或类型不支持；仍缺可审正文':status==='body_cached_review_pending'||status==='body_cached_review_unconfirmed'?'已有正文缓存，优先补审读，避免重复拉取':cat==='unclassified'?'题名不足，暂不判成无关或已覆盖':null,transcriptEvidence:cat==='meeting'?{isTranscriptDocument:transcript,pairedInventoryEntries:input.map((x,n)=>({x,n})).filter(({x,n})=>n!==index&&item.title.replace(/^(智能纪要|文字记录)：/,'')===x.title.replace(/^(智能纪要|文字记录)：/,'')).map(({x,n})=>({index:n+1,title:x.title,url:x.url})),completeTranscriptReviewConfirmed:transcript&&['full_returned_business_text_reviewed_this_pass','recorded_business_text_reviewed'].includes(status)&&!matches.some(d=>/未出现在|全时段|开头|结尾/.test(d.review_note||''))}:null};
});
const count=(rows,key)=>rows.reduce((a,r)=>(a[r[key]]=(a[r[key]]||0)+1,a),{});
const out={asOf:'2026-10-23',scope:'仅核对 site-data.json 中“豆包汽车”查询去重的 322 条目录；不是公司全部汽车文档全集。',input:{path:relative(dataPath),sha256:sha(dataText),inventoryCount:input.length,sourceCount:data.sources.length},methodology:['保留全部 322 条原始条目，不删除营销/历史/二手稿；按相关性分类而非以引用数量充当阅读覆盖。','去除 URL query/hash 后按 token 比对；由成功 read_link 响应中的 node_token/obj_token 建立 Wiki 与 Docx 的显式别名，禁止仅按相似标题自动合并。','合并 voice/director/async 既有 inventory 阅读状态与直接原文快照；全文抓取、业务审读、仅索引命中、图像看过分别记录。','来源注记的“已读/审读”只保留其原有范围；没有 sourceIds 不等于没读，URL 出现在索引或搜索中不等于正文已读。','本轮未重复已成功的全量检索。core 本组直读 6 篇基础正文、4 个定向司机入口、对应会议逐字稿及关键 D2D 依赖；会议仅为查缺逐字稿作一次定向搜索。合并同轮 memory/evaluation 的逐项审读记录，不重复读取。根代理另检查端云 OnePage 三张画板的明确范围，未执行车辆接口。','分类主要基于题名和取证记录；未读内容的初筛分类不是事实性原文结论。题名不足单列待判，会议与历史属性可以通过正文继续修正。'],counts:{category:count(inventory,'category'),readStatus:count(inventory,'readStatus'),citedInSite:inventory.filter(x=>x.siteSourceIds.length).length,uncitedButHasPriorReadEvidence:inventory.filter(x=>!x.siteSourceIds.length&&['recorded_business_text_reviewed','partial_body_or_table_review','source_note_reviewed_scope'].includes(x.readStatus)).length,uncitedButHasCachedBody:inventory.filter(x=>!x.siteSourceIds.length&&x.bodySnapshots.some(s=>s.bodyPresent)).length,supplementalRead:supplemental.length,fullReturnedTextReviewedThisPass:supplemental.length,boardVisualsInspectedThisPass:3},categoryDefinitions:categories,remainingPrimary:inventory.filter(x=>x.category.startsWith('primary_')&&!['full_returned_business_text_reviewed_this_pass','recorded_business_text_reviewed'].includes(x.readStatus)).map(x=>({index:x.index,title:x.title,url:x.url,category:x.category,readStatus:x.readStatus,next:x.needsFollowUp})),meetingRequirements:inventory.filter(x=>x.category==='meeting').map(x=>({index:x.index,title:x.title,url:x.url,readStatus:x.readStatus,...x.transcriptEvidence})),supplementalReadings:supplemental,limits:['core 本组 12 个原文/整理稿入口的全部可返回业务文字已读；其中含二手整理和不完整副本，不按来源数量推定机制覆盖。其余同轮来源依 memory/evaluation 记录，部分提示词/表格截断或仅样本审读，另有一篇机器人索引只读入口正文。均不等于所有附件/子页/画板已读。','read_link success 只表示读取成功；未以此推定车辆上线或当前全渠道可用。','司机 Agent PRD 与动态知识原文存在内部冲突，保留为待澄清问题，不能任选一处写成唯一现网规则。','旧资料的秒数、阈值、工具数量、能力目录和里程碑不替代当前项目配置与发布验收。','正文缓存对应的 priorAuditRecords 可能只审业务段落；网站来源注记需保留具体范围，不将 cached/full-return 合并为全读。'],inventory};
const mainChainIds=ids([9,16,17,25,30,48,52,55,58,59,62,64,75,83,87,88,90,95,97,98,99,114,119,127,129,133,135,136,151,247,283,298,305,318]);
const statusLabels={index_body_reviewed:'索引正文已读，链接内机制未读',full_returned_business_text_reviewed_this_pass:'本轮可返回业务正文完整审读',recorded_business_text_reviewed:'已有业务正文审读记录（看记录日期与范围）',partial_body_or_table_review:'仅部分正文/表格范围有读取证据',body_cached_review_pending:'正文已抓取，审读未完成',source_note_reviewed_scope:'网站来源注记有审读记录，按注记范围',body_cached_review_unconfirmed:'已有正文缓存，尚不能确认完整审读',title_only_prior_board_note:'仅标题与历史看板说明',directory_or_empty:'目录/空正文',read_failed_or_unsupported:'读取失败/无权限/不支持',metadata_only:'现有研究记录仅定位到元数据或链接'};
const noBody=x=>!x.bodySnapshots.some(s=>s.bodyPresent)&&!x.priorAuditRecords.some(r=>r.bodyChars>100||/recorded_business_text_reviewed|full_.*body_read|body_reviewed|business_body_and_protocol_reviewed|body-read|partial_body_or_table_review|partial_body_read|partial_sheet/.test(r.readStatus))&&!['source_note_reviewed_scope','full_returned_business_text_reviewed_this_pass'].includes(x.readStatus);
const main=inventory.filter(x=>mainChainIds.has(x.index));
const missingBody=main.filter(noBody);
const items=inventory.map(x=>({index:x.index,title:x.title,url:x.url,type:x.type,classification:x.categoryLabel,classificationCode:x.category,classificationConfidence:x.classificationConfidence,status:x.readStatus,statusLabel:statusLabels[x.readStatus],reason:x.classificationBasis+'；'+(x.needsFollowUp||'保留来源具体范围，不由此推定当前上线。'),sourceIds:[...new Set([...x.siteSourceIds,...x.matchedSourceIds,...x.priorAuditRecords.filter(r=>r.domain?.startsWith('coverage-expansion/')).map(r=>r.sourceId).filter(Boolean),...(x.supplemental?[x.supplemental.sourceId]:[])])],sourceEvidence:[...x.priorAuditRecords.map(r=>({kind:'prior_read_audit',path:r.auditFile,status:r.readStatus,scope:r.reviewNote||r.reviewStatus||r.diagramStatus,sourceId:r.sourceId,bodyPath:r.bodyFile,bodyChars:r.bodyChars})),...x.bodySnapshots.map(s=>({kind:'direct_body_snapshot',path:s.file,status:s.apiStatus,bodyChars:s.bodyChars,completeVisual:false})),...x.sourceNotes.map(s=>({kind:'website_source_note',sourceId:s.id,scope:s.note})),...(x.supplemental?[{kind:'review_this_pass',path:x.supplemental.reviewLedger,sourceId:x.supplemental.sourceId,scope:x.supplemental.boundary},...(x.supplemental.visualReviewLedger?[{kind:'team_browser_visual_review',path:x.supplemental.visualReviewLedger,scope:x.supplemental.diagramStatus,productionVerified:false}]:[])]:[])],hasBodyEvidence:!noBody(x),mainChainCandidate:mainChainIds.has(x.index),diagramStatus:x.supplemental?.diagramStatus||x.priorAuditRecords.filter(r=>r.diagramStatus).map(r=>r.diagramStatus).join('；')||'未取得本条图像阅读证据',releaseStatus:'本清点未检查目标车型/版本/渠道实车上线证据',transcript:x.transcriptEvidence,mentionFilesCount:x.searchOrLinkMentions.length}));
const summary={inventoryCount:322,categoryCounts:out.counts.category,readStatusCounts:out.counts.readStatus,quotedSourcesDoNotEqualReadDocuments:true,uncitedButHasPriorReadEvidence:out.counts.uncitedButHasPriorReadEvidence,supplementalReadThisPass:supplemental.length,fullReturnedBusinessTextReviewedThisPass:supplemental.length,peerSupplementalReadRecords:peerReadings.length,boardVisualsInspectedThisPass:3,boardVisualScope:'OnePage 第 1 图关键节点/箭头与第 3 图上下两半已视检，第 2 图只查 IM→三方 Agent 支路；非全文件视觉验收',mainChainCandidates:{count:main.length,noBodyEvidenceCount:missingBody.length,noBodyEvidenceEntries:missingBody.map(x=>({index:x.index,title:x.title,url:x.url,status:x.readStatus})),partialTextCount:main.filter(x=>x.readStatus==='partial_body_or_table_review').length,cachedNotFullyReviewedCount:main.filter(x=>/body_cached/.test(x.readStatus)).length,basis:'从 322 条中按题名筛出直接涉及输入/端云/Context/Planner/工具/身份/司机/事件交接的 34 个原始/历史入口（原 35 个中，内部澄清经正文确认是二手整理，已移出原始候选）；包含不同项目、旧版本与副本，未按同名擅自去重。',meaning:'尚未取得正文=在所核 2026-10-22/23 研究目录、直接快照和审读记录中未发现该 URL 或显式对象别名的正文证据；不是全公司从未读取的断言。'},primaryCandidateEntries:inventory.filter(x=>x.category.startsWith('primary_')).length,remainingPrimaryWithoutCompleteReadRecord:out.remainingPrimary.length,meetingEntries:out.meetingRequirements.length,unknownTitleEntries:inventory.filter(x=>x.category==='unclassified').length,actuallyOnlineEvidence:'本轮为资料审读与分类及明确范围图像核验，不查询或执行线上配置；原文和画板均不因此自动被标成当前全车型上线。'};
const originalCandidates=items.filter(x=>x.classificationCode.startsWith('primary_')||['historical','meeting'].includes(x.classificationCode));
const completeStatuses=new Set(['full_returned_business_text_reviewed_this_pass','recorded_business_text_reviewed']);
summary.originalSourceCandidateScope={
 definition:'322 条中按题名与已有正文证据，保留原始架构/PRD/评测/项目配置、历史资料和会议的有限候选范围；排除明确二手整理/营销等作为机制事实源，16 条题名不足仍保留待判。候选不等于每篇直接相关或已全读。',
 count:originalCandidates.length,
 entryIds:originalCandidates.map(x=>x.index),
 statusCounts:count(originalCandidates,'status'),
 hasAnyBodyEvidenceCount:originalCandidates.filter(x=>x.hasBodyEvidence).length,
 noBodyEvidenceCount:originalCandidates.filter(x=>!x.hasBodyEvidence).length,
 completeReturnedBusinessBodyReviewRecordCount:originalCandidates.filter(x=>completeStatuses.has(x.status)).length,
 partialBodyCount:originalCandidates.filter(x=>x.status==='partial_body_or_table_review').length,
 indexOnlyCount:originalCandidates.filter(x=>x.status==='index_body_reviewed').length,
 withoutCompleteBusinessBodyReviewRecordCount:originalCandidates.filter(x=>!completeStatuses.has(x.status)).length,
 interpretation:'“完整”只指该次接口返回的可审业务文字，不包含未返回图片/附件；会议记录仍按实际返回时段，索引不等于其链接已读。逐项状态和原因见 items。'
};
summary.classificationCorrections=[{index:96,from:'primary_prd',to:'secondary',reason:'直接读正文后确认是会议二手整理和工程视角；已追原逐字稿，不把扩写当会议原文。'},{index:114,from:'primary_prd',to:'historical',reason:'不同对象的 5 月旧版，不能按同名等同 8 月内部 PRD。'},{index:298,from:'primary_prd',to:'historical',reason:'独立旧副本，多个关键章节为空；正文读完不等于需求完整。'}];
const outsideInventorySupplemental=supplemental.filter(s=>!items.some(x=>root(token(x.url))===root(token(s.url))));
summary.supplementalReadingsOutside322=outsideInventorySupplemental.map(s=>({sourceId:s.id,title:s.title,url:s.url,reason:'原文关键依赖或会议逐字稿，按直接链接补读；不偷偷并入 322 分母。'}));
out.peerReadings=peerReadings;out.summary=summary;out.visualReview=visualLedger;
fs.writeFileSync(path.join(here,'inventory-evidence-detail.json'),JSON.stringify(out,null,2)+'\n');
fs.writeFileSync(path.resolve(here,'../inventory-audit.json'),JSON.stringify({asOf:out.asOf,scope:out.scope,input:out.input,summary,methodology:out.methodology,limits:out.limits,supplementalReadings:supplemental,peerReadings:peerReadings.map(x=>({sourceId:x.id,title:x.title,url:x.url,status:x.read_status,bodyChars:x.body_chars,auditFile:x.auditFile,scope:x.review_note})),outsideInventorySupplementalReadings:outsideInventorySupplemental,visualReview:visualLedger,items},null,2)+'\n');
console.log(JSON.stringify({summary,snapshots:direct.length,scannedFiles:scanned.length},null,2));
