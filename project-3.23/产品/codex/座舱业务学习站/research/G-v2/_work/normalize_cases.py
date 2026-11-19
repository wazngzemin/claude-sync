from pathlib import Path
import re,collections,json
r=Path(__file__).resolve().parent.parent
s=(r/'cases.md').read_text()
pattern=re.compile(r'^#{2,3}\s+((?:CORE|NOV|EVT|ROOT|SUP)-[CD]\d{3})[^\n]*',re.M)
ms=list(pattern.finditer(s));blocks={}
for i,m in enumerate(ms):
 b=s[m.start():ms[i+1].start() if i+1<len(ms) else len(s)].strip()
 # 去掉上一批中的来源分组标题，保留案例自身全文
 b=re.sub(r'^## (?!'+re.escape(m.group(1))+r')[^\n]*\n?', '',b,flags=re.M)
 b=re.sub(r'^### ', '### ', b)
 if m.group(1)=='CORE-C023':b=b.replace('e68-weekly.txt:21','e68-weekly.txt:23')
 if m.group(1).startswith('EVT-D'):
  expected=re.search(r'- 预期过程 / 用户结果：([^\n]+)',b)
  ex=expected.group(1) if expected else '按原表预期处理'
  if '异常' in b.splitlines()[0]:risk='越界、缺执行前提或执行失败时仍登记/继续执行'
  elif '循环' in b.splitlines()[0]:risk='把持续满足或回调重传重复计次，或漏掉下一次合法触发'
  elif '修改' in b.splitlines()[0] or '删除' in b.splitlines()[0]:risk='原任务与旧等待规则未同步更新，迟到回调继续生效'
  else:risk='登记条件、触发时机与实际交付结果未按同一目标关联'
  extra=f'\n- 用户看到了什么（设计预期）：{ex}\n- 系统里发生了什么（设计）：本例规定登记对应时间/状态/视觉条件，触发后回原任务办理；表内Pass/Fail只保留为当次记录，不能单靠预期推定实际链路。\n- 根因/风险：设计场景未给已发生事故根因；需要验证{risk}。\n- 怎么改/验收：按本例原话、前提、预期时刻/动作和结束条件分别验证登记、匹配、回调与用户结果；证据不足的断点先记录，不声明已修。\n'
  if '30天' in b or '30 天' in b or '一年' in b:extra+='- 参数版本限制：本例的30天/一年属于原测试设计，与10月24产品1分钟～2周并列保留，不当现行统一上限。\n'
  if m.group(1)=='EVT-D001':extra+='- 源表自身错误：用户要关按摩，前提却写加热开启，须先修测试对象，不能将这种对象不一致归模型失败。\n'
  b+=extra
 blocks[m.group(1)]=b
assert len(blocks)==len(ms)
blocks.pop('NOV-C027')
merges={'EVT-C003':'CORE-C004','EVT-C058':'NOV-C047','EVT-C059':'NOV-C048','EVT-C054':'CORE-C010','CORE-C014':'ROOT-C001','CORE-C015':'ROOT-C003'}
for old,new in merges.items():
 oldblock=blocks.pop(old)
 sources='；'.join(x.removeprefix('- 来源：').strip() for x in oldblock.splitlines() if x.startswith('- 来源：'))
 blocks[new]+=f'\n- 合并证据：原{old}为同源记录，补充来源：{sources}\n'
# 上汽二期的三个现象各自保留为独立问题条目，撤销合并旧条
old=blocks.pop('CORE-C009')
sources='；'.join(x.removeprefix('- 来源：').strip() for x in old.splitlines() if x.startswith('- 来源：'))
for new in ['EVT-C051','EVT-C052','EVT-C053']:blocks[new]+=f'\n- 同源归并：原CORE-C009同时描述三个现象，本条按自身现象独立登记，来源另见{sources}\n'
blocks['CORE-C004']=blocks['CORE-C004'].replace('设计缺口','真实能力/协议缺口（无用户事故样本）',1)
groups={'已观测的用户反馈、测试与联调问题':[],'能力缺口、评审风险与来源未完整的问题线索':[],'设计场景、原表预期与提示词验证例':[]}
for fid,b in blocks.items():
 title=b.splitlines()[0]
 if fid in ['NOV-C001','NOV-C005','NOV-C008','NOV-C012','CORE-C004','CORE-C005','CORE-C006','CORE-C007','CORE-C012','CORE-C018','EVT-C005','EVT-C006','EVT-C060'] or '缺口' in title or '评审' in title or '风险' in title or '线索' in title:
  key='能力缺口、评审风险与来源未完整的问题线索'
 elif '设计' in title or fid.startswith('EVT-D'):key='设计场景、原表预期与提示词验证例'
 else:key='已观测的用户反馈、测试与联调问题'
 # 设计风险有完整设计预期但没有发生样本，按设计集中收录，协议/评审缺口除外
 if ('设计风险' in title or '设计验收' in title or '设计限制' in title) and fid not in ['CORE-C004','CORE-C006']:key='设计场景、原表预期与提示词验证例'
 groups[key].append((fid,b))
header='''# G 章真实问题与设计场景

研究日期：2026-11-17；只研究。下列按“已观测问题 / 能力缺口与评审线索 / 设计场景”分开，保留根因未知、未修复及来源partial等限制；不把测试预期当事故，不把修复建议当已完成。

路径约定：`research/`相对于座舱业务学习站，`raw/articles/`与`wiki/`相对于`/Users/bytedance/Desktop/3.23/`；原T研究转引的`v-lesson-.../`、`T-v2/`等路径补`research/`即可定位。每条至少含用户结果、系统过程、根因/风险、改法/验收、来源。

## 记录统计

|类别|条目数|
|---|---:|
'''
for k,v in groups.items():header+=f'|{k}|{len(v)}|\n'
header+=f'|合计|{len(blocks)}|\n'
header+='\n这些是去除明确同源重复后的问题/场景记录，不代表同等证据等级的独立实车事故；T章已有问题仍保留用于G侧定位，任务和界面机制回指overlap。\n'
for k,v in groups.items():
 header+='\n## '+k+'\n\n'
 for fid,b in v:
  b=re.sub(r'^#{2,3}', '###',b,count=1)
  header+=b+'\n\n'
header+='''## 同源合并与撤销登记（不计条目数）

|旧编号|保留编号|处理|
|---|---|---|
'''
for old,new in merges.items():header+=f'|{old}|{new}|同源合并，全部来源保留|\n'
header+='|CORE-C009|EVT-C051 / EVT-C052 / EVT-C053|倒计时显示、弱网未到达、云端定时不准分成三条，保留各自断点|\n|NOV-C027|撤销|源表第16行只有残留字段，不构成完整场景|\n'
(r/'cases.md').write_text(header)
(r/'_work/case-stats.json').write_text(json.dumps({k:len(v) for k,v in groups.items()},ensure_ascii=False))
print(len(blocks),{k:len(v) for k,v in groups.items()})
