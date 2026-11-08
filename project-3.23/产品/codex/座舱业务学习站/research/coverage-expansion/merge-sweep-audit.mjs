import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const site=path.resolve(here,'../..');
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const baseline=path.join(here,'inventory-audit-before-sweep.json');
const target=path.join(here,'inventory-audit.json');
if(!fs.existsSync(baseline))fs.copyFileSync(target,baseline,fs.constants.COPYFILE_EXCL);
const audit=read(baseline);
const baselineCategories=new Map(audit.items.map(item=>[item.index,item.classificationCode]));
const token=url=>String(url||'').split(/[?#]/)[0].replace(/\/$/,'').split('/').at(-1);
const count=(rows,key)=>rows.reduce((o,r)=>(o[r[key]]=(o[r[key]]||0)+1,o),{});
const labels={body_reviewed:'recorded_business_text_reviewed',partial_review:'partial_body_or_table_review',index_reviewed:'index_body_reviewed',not_relevant:'scope_excluded_after_review',failed:'read_failed_or_unsupported',cached_review_pending:'body_cached_review_pending'};
const statusNames={recorded_business_text_reviewed:'本次返回业务文字已审读（附件/图像与上线另核）',partial_body_or_table_review:'部分文字、表格或浏览器可见范围已审',index_body_reviewed:'只审索引/字段/入口，非链接内完整机制',scope_excluded_after_review:'按明确范围排除出主链；不等于全文已读',read_failed_or_unsupported:'读取失败/无权限/不支持，缺正文',body_cached_review_pending:'已有正文缓存，业务审读尚待完成'};
const categories={secondary:'AI生成或二手整理',primary_prd:'原始产品需求/能力协议',primary_evaluation:'原始评测/体验材料',primary_project_config:'项目/配置候选',historical:'历史版本资料',primary_architecture:'原始架构候选',marketing_unrelated:'营销/其他业务/不纳入主链',meeting:'会议资料，须追文字记录',unclassified:'题名不足，待正文判断'};
const sourceIds=new Set(read(path.join(site,'site-data.json')).sources.map(x=>x.id));
for(const file of fs.readdirSync(path.join(site,'content')).filter(f=>f.endsWith('.json'))){
 for(const s of read(path.join(site,'content',file)).sources||[])sourceIds.add(s.id);
}
const batches=['sweep-core/read-status.json','sweep-config/records.json','sweep-evaluation/records.json','sweep-root/records.json'];
const used=[],outside=[];
for(const name of batches){
 const file=path.join(here,name);
 if(!fs.existsSync(file))throw Error('Required sweep ledger missing: '+name);
 const payload=read(file),records=Array.isArray(payload)?payload:payload.records;
 if(!Array.isArray(records))throw Error('Invalid ledger: '+name);
 for(const r of records){
  const item=audit.items.find(x=>x.index===r.index);
  if(!item||token(item.url)!==token(r.url))throw Error('Inventory identity mismatch '+name+' / '+r.index);
  if(!labels[r.status])throw Error('Unknown review state '+r.status+' / '+r.index);
  const oldStatus=item.status,oldCategory=item.classificationCode;
  item.status=labels[r.status];item.statusLabel=statusNames[item.status];
  if(r.classificationCode){item.classificationCode=r.classificationCode;item.classification=categories[r.classificationCode]||r.classificationCode;}
  item.reason=[r.readScope,...(r.findings||[]),...(r.limitations||[])].filter(Boolean).join('；');
  item.readScope=r.readScope;
  const fieldsOnly=/只读[取到]*字段|只返回字段|只读取表结构|仅取得表结构|仅取得.*表结构|无.*记录.*正文|只返回.*结构/.test(item.reason)&&/99991679|授权错误|记录权限|无.*记录/.test(item.reason);
  const titleOnly=/仅返回\d*字符标题|未返回业务正文/.test(r.readScope||'');
  if(typeof r.hasBusinessBodyEvidence==='boolean')item.hasBodyEvidence=r.hasBusinessBodyEvidence;
  else if(r.status==='failed'||fieldsOnly||titleOnly)item.hasBodyEvidence=false;
  else if(r.status==='not_relevant'&&/按题名|未读取|未缓存/.test(r.readScope||''))item.hasBodyEvidence=false;
  else item.hasBodyEvidence=Boolean(r.bodyPath||r.evidenceKind==='browser_visible_segments'||r.status==='body_reviewed'||r.status==='partial_review');
  item.hasBusinessMechanismReview=['body_reviewed','partial_review'].includes(r.status)&&!fieldsOnly;
  if(r.sourceId&&sourceIds.has(r.sourceId))item.sourceIds=[...new Set([...item.sourceIds,r.sourceId])];
  item.sourceEvidence.push({kind:'sweep_business_review',path:'research/coverage-expansion/'+name,sourceId:r.sourceId||null,status:r.status,scope:r.readScope,findings:r.findings||[],limitations:r.limitations||[],bodyPath:r.bodyPath||null,bodyChars:r.bodyChars??null});
  item.diagramStatus=r.visualStatus==='not_assessed'?'本批未视检嵌入画板/图片；保留既有具体证据':item.diagramStatus;
  item.sweep={ledger:name,status:r.status,previousStatus:oldStatus,previousCategory:oldCategory};
  used.push({...r,ledger:name});
  if(oldCategory!==item.classificationCode)audit.summary.classificationCorrections.push({index:r.index,from:oldCategory,to:item.classificationCode,reason:r.classificationReason||r.readScope});
 }
 outside.push(...(payload.outsideInventory||[]));
}
const complete=new Set(['full_returned_business_text_reviewed_this_pass','recorded_business_text_reviewed']);
const s=audit.summary;
s.categoryCounts=count(audit.items,'classificationCode');s.readStatusCounts=count(audit.items,'status');
s.primaryCandidateEntries=audit.items.filter(x=>x.classificationCode.startsWith('primary_')).length;
s.remainingPrimaryWithoutCompleteReadRecord=audit.items.filter(x=>x.classificationCode.startsWith('primary_')&&!complete.has(x.status)&&x.status!=='scope_excluded_after_review').length;
s.unknownTitleEntries=audit.items.filter(x=>x.classificationCode==='unclassified').length;
s.meetingEntries=audit.items.filter(x=>x.classificationCode==='meeting').length;
s.uncitedButHasPriorReadEvidence=audit.items.filter(x=>!x.sourceIds.length&&['recorded_business_text_reviewed','partial_body_or_table_review'].includes(x.status)).length;
const main=audit.items.filter(x=>x.mainChainCandidate);
s.mainChainCandidates={...s.mainChainCandidates,noBodyEvidenceCount:main.filter(x=>!x.hasBodyEvidence).length,noBodyEvidenceEntries:main.filter(x=>!x.hasBodyEvidence).map(x=>({index:x.index,title:x.title,url:x.url,status:x.status})),partialTextCount:main.filter(x=>x.status==='partial_body_or_table_review').length,cachedNotFullyReviewedCount:main.filter(x=>/body_cached/.test(x.status)).length,statusCounts:count(main,'status')};
const original=s.originalSourceCandidateScope;
const candidate=audit.items.filter(x=>original.entryIds.includes(x.index));
s.originalSourceCandidateScope={...original,definition:'322 条中按题名与已有正文证据圈定的原始架构、PRD、评测、项目配置、历史资料与会议候选。本轮保留原 180 条分母以便对照；正文后重分类及排除不缩小分母。原先 16 条题名不足项另行核验并分类，逐项范围见清单；候选不等于每篇直接相关或已全读。',statusCounts:count(candidate,'status'),hasAnyBodyEvidenceCount:candidate.filter(x=>x.hasBodyEvidence).length,noBodyEvidenceCount:candidate.filter(x=>!x.hasBodyEvidence).length,completeReturnedBusinessBodyReviewRecordCount:candidate.filter(x=>complete.has(x.status)).length,partialBodyCount:candidate.filter(x=>x.status==='partial_body_or_table_review').length,indexOnlyCount:candidate.filter(x=>x.status==='index_body_reviewed').length,excludedAfterScopeReviewCount:candidate.filter(x=>x.status==='scope_excluded_after_review').length,withoutCompleteBusinessBodyReviewRecordCount:candidate.filter(x=>!complete.has(x.status)).length};
const uniqueUsed=new Map(used.map(x=>[x.index,x]));
s.sweep={reviewedAt:'2026-10-23',batches:batches.length,processedEntries:uniqueUsed.size,statusCounts:count([...uniqueUsed.values()],'status'),stillMetadataOnlyOriginalCandidates:candidate.filter(x=>x.status==='metadata_only').map(x=>({index:x.index,title:x.title,url:x.url})),unclassifiedEntriesProcessed:[...uniqueUsed.values()].filter(r=>baselineCategories.get(r.index)==='unclassified').length,meaning:'逐项处理包括完整返回文字、局部范围、索引、失败、明确排除和待审缓存；处理数绝不等于全文审读数。'};
audit.methodology.push('以四份追加审读台账合并本批结果，保留旧版快照 inventory-audit-before-sweep.json；正文审读、图像、记录权限和部署范围分别记录。');
audit.methodology.push('遇到多维表外层success但records权限错误，不以字段或错误消息字节数冒充业务正文；排除与本链路无关内容后不继续采集个人/商务资料。');
audit.limits=[...new Set([...audit.limits,'本批仍有截断表格、未读行列、未视检画板、缺段逐字稿和无权限附件；不存在“322份全部全文已读”或“公司全库已读”的结论。'])];
audit.outsideInventorySupplementalReadings=[...(audit.outsideInventorySupplementalReadings||[]),...outside];
audit.sweepLedgerFiles=batches;
fs.writeFileSync(target,JSON.stringify(audit,null,2));
fs.writeFileSync(path.join(here,'sweep-summary.json'),JSON.stringify(s,null,2));
console.log(JSON.stringify({sweep:s.sweep,originalCandidates:s.originalSourceCandidateScope,main:s.mainChainCandidates,readStatus:s.readStatusCounts},null,2));
