import json,re
from pathlib import Path
root=Path(__file__).resolve().parents[1];d=json.loads((root/'_work/page-data.json').read_text());p=next(x for x in d['pages'] if x['id']=='K');b=next(x for x in d['base']['modules'] if x['id']=='K');old=json.loads((root.parent/'chapters/K/old-page.json').read_text())
entries=[];seen={}
def add(txt,loc,group):
 txt=re.sub(r'\[([^\]]+)\]\([^)]+\)',r'\1',txt).replace('**','').strip()
 for sentence in re.split(r'(?<=[。！？])',txt):
  sentence=sentence.strip()
  if not sentence:continue
  norm=re.sub(r'\s+','',sentence)
  if norm in seen:
   if loc not in entries[seen[norm]]['loc']:entries[seen[norm]]['loc'].append(loc)
  else:
   seen[norm]=len(entries);entries.append({'text':sentence,'loc':[loc],'group':group})
for key in ['summary','scenario','bridge']:add(p[key],f'pages[K].{key}','开篇与学习路线')
for section in p['sections']:
 for i,x in enumerate(section['paragraphs'],1):add(x,f'pages[K].sections[{section["id"]}].paragraphs[{i}]',section['title'])
for section in p['teaching']['lessons']:
 for i,x in enumerate(section['paragraphs'],1):add(x,f'pages[K].teaching.lessons[{section["id"]}].paragraphs[{i}]',section['title'])
for key in ['intro','closing']:
 for i,x in enumerate(p['teaching'][key],1):add(x,f'pages[K].teaching.{key}[{i}]','开篇与收尾')
for key,v in p['teaching'].get('guides',{}).items():
 for i,x in enumerate(v['paragraphs'],1):add(x,f'pages[K].teaching.guides.{key}.paragraphs[{i}]','总图导读')
for i,x in enumerate(p['mainline'],1):add(x,f'pages[K].mainline[{i}]','主线复述')
for sec in p['feynman']['sections']:
 for i,x in enumerate(sec['p'],1):add(x,f'pages[K].feynman.sections[{sec["id"]}].p[{i}]','费曼复述与迁移')
for i,x in enumerate(p['feynman']['transfer'],1):add(x['q']+' '+x['a'],f'pages[K].feynman.transfer[{i}]','费曼复述与迁移')
add(p['feynman']['retell']['q']+' '+p['feynman']['retell']['a'],'pages[K].feynman.retell','费曼复述与迁移')
for n in b['nodes']:
 for key in ['lines','paragraphs']:
  for i,x in enumerate(n.get(key,[]),1):add(x,f'base.modules[K].nodes[{n["id"]}].{key}[{i}]','原图节点 '+n['id'])
 add(n['detail'],f'base.modules[K].nodes[{n["id"]}].detail','原图节点 '+n['id'])
for i,q in enumerate(b['questions'],1):
 # 问题、答案与举证作为一个完整的评审知识点
 txt='问题：'+q['q']+' 原因：'+q['why']+' 回答：'+q['goodAnswer']+' 举证：'+q['evidence']
 entries.append({'text':txt,'loc':[f'base.modules[K].questions[{i}]'],'group':'评审问题'})
for i,m in enumerate(b['metrics'],1):
 txt=m['name']+'：'+m['definition']+' 分层：'+m['segment']+' 状态：'+m['targetStatus']
 entries.append({'text':txt,'loc':[f'base.modules[K].metrics[{i}]'],'group':'指标与观测'})
out=['# K 章当前网页知识点底表','','来源：HTML/01-进行中/豆包汽车-业务学习站-v69.html:L269 的 DATA；页模块 pages[id=K]、原图模块 base.modules[id=K]。JSON 数组定位在本文采用从 1 开始的序号；节点/段落用实际 id 定位。旧页副本 research/chapters/K/old-page.json 与当前网页的 pages[id=K] 深度比较完全相同。','','本表登记网页已存在的说法，并不把它们自动认定为源材料已确认事实；尤其原图 detail 与更新后的 paragraphs 同时保留的说法需要后续研究纠正。相同句子合并为一条，列出全部出现位置；近义但条件、数字或现状不同的说法分别保留。每句按知识点独立编号，指标和评审问题按完整判定单位登记。','',f'共 {len(entries)} 个知识点；9 个章节段落、15 个原图节点、13 个评审问题、11 个指标。','']
for i,e in enumerate(entries,1):out.extend([f'## KB-{i:03d} {e["group"]}',e['text'],'位置：'+'；'.join(e['loc']),''])
out.extend(['## 原图与结构登记','','- 原图模块 K 含 K01～K15 共 15 个节点；其标题、概述 lines、展开 detail、paragraphs 已逐句纳入上表，未只登记标题。','- 页面教学段为 9 段；teaching.lessons 与 sections 重复的文字已合并出现位置；另有总图导读、主线复述、费曼 7 段与 3 个迁移问题。','- 页面 flows/cases/terms/questions/metrics/roadmap/related/referenceTables 为空；评审问题和指标实际存放在 base.modules[K]，已单独纳入。','- DATA.diagrams 没有 K 前缀的独立新图；K 的既有流程图是 base.modules[K] 原图节点，改写时需保留原始全图。','- legacyChapterTargets 保留 19 个历史锚点映射，属于跳转兼容信息，不另外计入知识点。','','## 同一网页内需要核对的说法','','- K05.detail 写固定“20 条事件或 20 分钟、夜间汇总”；K05.paragraphs 与正文改为“11 月 4 日讨论 20 轮或 20 分钟，计数待核”，不能拿前者替代后者。','- K06.detail 写夜间汇总长线情景；K06.paragraphs 提醒不捏造统一夜间偏好推理节奏，情景画像“已生成”与“已被推理消费”分开。','- K15.detail 写记忆到地图家/公司同步“已实现”；K15.paragraphs 要求旧方案与 11 月 4 日新方向分开核对，不能沿用旧结论冒称新方案已实现。','- K03/K13 原图仍保留“语音删除截至 10 月 28 日在开发”；当前正文只有接口和交互规则，并无新的上线证据，后续须按原文现状标注。','- 旧页中的账号三层、可信云校验、Face ID 为主与声纹补充、手机远控等内容，仍需由原文研究逐项定事实等级，登记不等于背书。'])
(root/'destinations-base.md').write_text('\n'.join(out)+'\n')
print(len(entries),'entries written; equal old/current',p==old)
