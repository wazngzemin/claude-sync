from pathlib import Path
import json,re,hashlib
R=Path('/Users/bytedance/Desktop/3.23/产品/codex/座舱业务学习站'); D=R/'research/case-rewrite-20261029/async'
p=json.loads((R/'content/case-async-20261029.json').read_text()); b=json.loads((R/'research/case-rewrite-20261029/baseline-data.json').read_text())
ss={s['id']:s for s in b['sources']+p['sources']}
def unwrap(d):
 for _ in range(5):
  if isinstance(d,dict) and isinstance(d.get('content'),list):
   try:d=json.loads(next(x['text'] for x in d['content'] if x.get('type')=='text'))
   except:break
  else:break
 return d
fileurl={}
for f in D.glob('*.json'):
 if f.name.startswith('search') or f.name in ['inventory-candidates.json','coverage.json']:continue
 try:
  x=unwrap(json.loads(f.read_text()));u=x.get('source_url')
  if u:fileurl[u.split('#')[0]]=f.with_suffix('.md').name
 except:pass
manual={'CASE-ADVISOR-ACTIONLIST':'S-actionlist.md','CASE-ADVISOR-PROGRESS':'S-progress.md','CASE-SIGNAL-HUB':'B-signal-hub.md','CASE-SIGNAL-ONEPAGE':'B-signal-onepage.md','ASY-A44':'A-vqa-prd.md','ASY-A47':'A-cloud-legacy.md','ASY-A84':'../..//lecture-rewrite-20261029/async-source-compact/A84.md'}
partial={'A-vlm-all.md':'MCP returned status=partial and truncated=true; not complete document.', 'F-layer.md':'MCP returned status=partial and truncated=true; not complete document.'}
sections={'I-1019.md':'主交互输入合并、打断与补话相关逐字稿段落。','I-1020.md':'端云采信、网络恢复与历史同步相关逐字稿段落。','I-aiva.md':'多音区、打断、端云采信和可见即可说相关需求段落。','S-prd.md':'场景类别、生成策略、开关、确认、子目标与回流相关主体章节；未将每个附表逐格视为已验收。','S-progress.md':'2026-10-27 进展段及前提说明；未声称逐周历史全读。','T-management.md':'任务规范、生命周期、Run、执行和结果回写主体方案；未把全部后续设计视为已接入。','F-protocol.md':'输入身份、流式输出、取消、命令和异常控制协议主体；附录示例未逐条作为独立事实。'}
# Inventory is metadata from prior same-task searches. It is not a full-text corpus.
candidates=json.loads((D/'inventory-candidates.json').read_text())
modules=[]
for pg in p['pages']:
 mid=pg['id']; allids=list(dict.fromkeys(pg['teaching']['sourceIds']+[s for l in pg['teaching']['lessons'] for s in l['sourceIds']]))
 initial=unwrap(json.loads((D/f'search-{mid}.json').read_text()))
 if 'result' in initial: initial=unwrap(initial['result'])
 retry=json.loads((D/f'search-retry-{mid}.json').read_text())
 evidence=[]
 for sid in allids:
  s=ss.get(sid,{'id':sid});f=manual.get(sid) or fileurl.get(s.get('url','').split('#')[0])
  if f:
   path=D/f
   if path.exists():
    text=path.read_text(); state='partial_response' if f in partial else 'relevant_sections_read' if f in sections else 'full_text_read'
    if f.startswith('../'):state='full_text_read'
    evidence.append(dict(sourceId=sid,title=s.get('title'),url=s.get('url'),file=str(path.relative_to(R) if path.is_relative_to(R) else path),status=state,readScope=partial.get(f) or sections.get(f) or '正文已读；材料内部的链接仍作为独立来源，不自动视为已读。',characters=len(text)))
   else:evidence.append(dict(sourceId=sid,title=s.get('title'),url=s.get('url'),status='source_in_shared_corpus',readScope='来自本轮已有公共原文库；本组未重新抓取，不计入本组全文已读统计。'))
  else:evidence.append(dict(sourceId=sid,title=s.get('title'),url=s.get('url'),status='source_in_shared_corpus',readScope='来源已登记于公共原文库；请结合其他分组覆盖核对，本组不另算全文阅读。'))
 body=''.join(pg['teaching']['intro'])+''.join(''.join(l['paragraphs']) for l in pg['teaching']['lessons'])
 modules.append(dict(module=mid,query=initial.get('query') or json.loads((D/f'search-{mid}.json').read_text()).get('query'),search=dict(initialStatus=initial.get('status'),initialScanComplete=initial.get('scan_complete'),initialPagesScanned=initial.get('pages_scanned'),retryStatus=retry.get('status'),retryReportedTotal=retry.get('total'),retryReturnedResultCount=len(retry.get('results',[])),rawFiles=[f'search-{mid}.json',f'search-retry-{mid}.json'],limitation='重试文件保存可返回的前 3 条结果与总命中数。success 仅指检索执行，不证明全部命中已展开全文；W 重试仍为 partial。'),candidateMetadata=[x for x in candidates if mid in x.get('possibleModules',[])],evidence=evidence,lessonIds=[l['id'] for l in pg['teaching']['lessons']],introAndLessonCharactersWithoutWhitespace=len(re.sub(r'\s','',body)),guideParagraphs=len(pg['teaching']['guides']['base']['paragraphs']),removedRedundantFlows=True))
for m in modules:
 if m['module']=='A':m['additionalPartialSources']=[dict(file='A-vlm-all.md',status='partial_response',reason=partial['A-vlm-all.md'])]
 if m['module']=='F':m['additionalPartialSources']=[dict(file='F-layer.md',status='partial_response',reason=partial['F-layer.md'])]
coverage=dict(date='2026-10-29',group='async',completeModules=[p['id'] for p in p['pages']],claimBoundary='八章重写完成；不声称已读全部知识库或全部搜索命中。已获取全文、阅读相关段落、返回截断和候选元数据分开统计。',candidateInventoryCount=len(candidates),candidateInventoryFile='inventory-candidates.json',modules=modules,materialDecisions={
'I':['输入合并需旧轮尚未发外部工具；不同语音打断版本保持范围。','停止声音、取消计算、已发动作与恢复分别讲解。'],
'W':['不将“6个以上”推定为候选数量。','简短失败语音与系统 Toast 详细文案不机械播读分别处理。'],
'F':['定义/实现/渠道/环境/本轮可见性区分。','Fallback 与最多两次 Redirect 区分；未承诺订座打断后自动恢复。'],
'T':['Task 与 Run、创建/触发/执行/展示四种状态区分。','上汽 Goal 回调缓存时间不当作任务有效期；二期通用长任务保留设计范围。'],
'B':['状态、变化事件、Query、advice 和 tool_feedback 按实际输入意义区分。'],
'A':['E68 AlwaysOn 下分持续聆听与持续观察；主动 VQA 不受持续观察子开关影响。','赛力斯舱内文本回传，不自动云兜底；提前缓存取图写为可推动方向。','20 秒视觉结果时效与最多 3 条观察目标均限定长时视觉方案。'],
'G':['旧草案三分钟、TaskService 二十秒不合并为统一门槛。','推理并发方案不承诺自动取消在途请求；语义三态保留不足/未满足/已满足差别。'],
'S':['10/27 进展表：24 事件中 13 实车验收、6 依赖 VLM、5 依赖状态；短期会话记忆/历史建议反馈仍待办。','ActionList 透传只含实际成功动作，整轮 Planner 无更多工具后汇总一次；合并来源不擅自归因。']},verification=dict(sourceIdsResolved=all(e['sourceId'] in ss for m in modules for e in m['evidence']),flowRemovedModules=[p['id'] for p in p['pages'] if not p.get('flows')],nodePatchCount=len(p['baseNodePatches']),patchSha256=hashlib.sha256((R/'content/case-async-20261029.json').read_bytes()).hexdigest()))
(D/'coverage.json').write_text(json.dumps(coverage,ensure_ascii=False,indent=2)+'\n')
print('coverage written',len(modules),'modules',coverage['verification'])
for m in modules:print(m['module'],m['introAndLessonCharactersWithoutWhitespace'],'chars;',[(e['sourceId'],e['status']) for e in m['evidence'] if e['status']=='source_in_shared_corpus'])
