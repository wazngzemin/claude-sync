import json,pathlib,fcntl,sys
ROOT=pathlib.Path(__file__).resolve().parents[1]
THEMES=['1. 身份','2. 记忆分层','3. 记忆怎样产生','4. 记忆怎样被用','5. 记忆怎样被改','6. 隐私与权限','7. 记忆和车上功能的同步','8. 评测、测试、真实问题和排查','9. 演进','车型差异','指标与观测','排期与现状','资料冲突与证据缺口']
batch=json.loads(pathlib.Path(sys.argv[1]).read_text())
with (ROOT/'_work/.lock').open('w') as lock:
 fcntl.flock(lock,fcntl.LOCK_EX)
 path=ROOT/'_work/records.jsonl'
 if not batch.get('_render_only'):
  with path.open('a') as f:f.write(json.dumps(batch,ensure_ascii=False)+'\n')
 records=[json.loads(x) for x in path.read_text().splitlines()]
 for kind,title in [('facts','K 章事实研究'),('cases','K 章真实问题与设计场景'),('components','K 章新增部件与概念候选')]:
  out=[f'# {title}','', '研究日期：2026-11-17；仅研究，不代表正文或当前全量线上状态。来源路径均相对于座舱业务学习站/research/，L 为原文件行号；事实保留原材料的时间、车型和确定程度。','']
  entries=[]
  for r in records:
   for e in r.get(kind,[]):entries.append((e,r.get('source','')))
  if kind=='facts':
   for theme in THEMES:
    out.extend(['## '+theme,''])
    for i,(e,s) in enumerate(entries,1):
     if e['theme']==theme:out.extend([f'- **F{i:03d}** {e["text"]}（来源：{e.get("source",s)}）',''])
  else:
   for i,(e,s) in enumerate(entries,1):
    if isinstance(e,str):e={'text':e}
    out.extend([f'## {"CASE" if kind=="cases" else "COMP"}-{i:03d} {e.get("title", "条目")}','',e['text'],f'来源：{e.get("source",s)}',''])
  if kind=='facts':
   conflicts=[e for r in records for e in r.get('conflicts',[])]
   if conflicts:
    out.extend(['## 资料冲突清单（集中索引）','','这里区分真正矛盾、时间演进和对象不同；没有可比发布时间时明确保留未决，不按文件排序猜新旧。','', '| 编号 | 主题 | 双方说法 | 哪份更新与研究判断 | 原始依据 |','|---|---|---|---|---|'])
    for i,e in enumerate(conflicts,1):out.append(f'| CF-{i:02d} | {e["topic"]} | {e["sides"]} | {e["judgment"]} | {e["source"]} |')
    out.append('')
  (ROOT/(kind+'.md')).write_text('\n'.join(out))
 out=['# 逐文件研究登记','','每个批次在读完对应原文后写入，并同时刷新 facts.md、cases.md、components.md。','']
 for i,r in enumerate(records,1):out.append(f'{i}. {r.get("source", "未指定")} — {r.get("read_note", "已读，提取写入")}；事实 {len(r.get("facts",[]))}，案例 {len(r.get("cases",[]))}，部件 {len(r.get("components",[]))}。')
 (ROOT/'_work/read-register.md').write_text('\n'.join(out)+'\n')
 print('appended',batch.get('source'),{k:len(batch.get(k,[])) for k in ['facts','cases','components']})
