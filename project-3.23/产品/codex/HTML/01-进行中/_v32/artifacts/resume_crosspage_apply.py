import pathlib,json,shutil,datetime,copy
r=pathlib.Path('/Users/bytedance/Desktop/3.23/产品/codex/HTML/01-进行中');p=r/'豆包汽车-业务学习站-v31-工作副本.html';s=p.read_text();i=s.index('const DATA=')+11;d,n=json.JSONDecoder().raw_decode(s[i:]);old=copy.deepcopy(d);ps={p['id']:p for p in d['pages']};ME='https://aka.doubaocdn.com/s/68EV2Q9r4X';V='https://bytedance.larkoffice.com/wiki/NuunwklpIiGS91kg7lRcAprqnMd?from=lark_search_qa&ccm_open_type=lark_search_qa#TvdtdyavUoaSltxkMcsc9mGCnvb'
for pid,lid,needle,new in [
 ('M','m-playback','上下文压缩的现状和新要求也分开',f'旧PRD从第3轮开始随新增人机对话压缩，Director保留5轮，摘要上限22轮、最长500token。11月4日口头反馈一次处理约1.7至1.8秒，并认为实际摘要未达到500token；加入人人和事件以后，22轮是否足以衔接记忆侧总结，仍要求研发核对。不能把22轮和500token一起说成已经调整的偏大参数。历史对话的新名称是历史输入，摘要另经讨论称摘要记忆，两者分别是近期原话与压缩结果。[11月4日文字记录00:09至00:15]({ME})'),
 ('SE','se-lesson-release','30B 做弱化的 DT 是会上提出',f'端侧业务能力需要按任务规格和实际接入验证。V1.3已经列出Edge_DT的CDC文本输入、文本输出、TOPIC_DT与时间预估，并引用「AI Box 30B MoE 离线语音增强」方案。它不能继续被说成只有名字、没有原文；但完整方案本轮无权限，任务表也不能证明全部车型的离线能力、所有工具范围和云端Director已经等价迁移。实验方向、规格定义和实车交付仍需分开。[VLM任务定义V1.3]({V})')]:
 l=next(l for l in ps[pid]['teaching']['lessons'] if l['id']==lid);hits=[j for j,z in enumerate(l['paragraphs']) if needle in z];assert len(hits)==1;l['paragraphs'][hits[0]]=new
for pg in d['pages']:
 ls={l['id']:l for l in pg['teaching']['lessons']}
 for sec in pg['sections']:
  if sec.get('teachingTarget') in ls:sec['paragraphs']=copy.deepcopy(ls[sec['teachingTarget']]['paragraphs'])
# Extra sources use directly read URLs, not internal generated research notes.
for pg in d['pages']:
 for obj in [pg,pg['teaching'],*pg['sections'],*pg['teaching']['lessons']]:
  if 'sourceIds' in obj:obj['sourceIds']=[x for x in obj['sourceIds'] if x not in ['dir-spec','src-model-spec']]
# Formatting metadata only: source-check progress cannot be reported as a passed full audit.
d['meta']['asOf']='2026-11-04';d['meta']['validation']='本轮原文核验与全24页路由检查完成，关键页视觉和独立内容审读持续核对；不以字数或搜索命中证明事实完整。'
assert old['originalSvg']==d['originalSvg'];b=p.with_name(p.name+'.bak-cross-page-'+datetime.datetime.now().strftime('%Y%m%d%H%M%S'));shutil.copy2(p,b)
p.write_text(s[:i]+json.dumps(d,ensure_ascii=False,separators=(',',':'))+s[i+n:]);print('M/SE corrected, source-note backing removed',b)
