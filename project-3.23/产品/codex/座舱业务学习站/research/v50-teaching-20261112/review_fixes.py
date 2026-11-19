import json,re
from pathlib import Path
D=Path(__file__).parent
files={n:json.loads((D/(n+'-patch.json')).read_text()) for n in ['root','voice','models','context']};changes=[]
def fix(n,sid,old,new,reason):
 s=next(s for s in files[n]['sections'] if s['id']==sid);assert old in s['html'],(sid,old)
 s['html']=s['html'].replace(old,new);changes.append({'section':sid,'before':old,'after':new,'reason':reason})
fix('root','v39-map','本地候选指令或无法办理的结果','本地能办、不该接或办不了的判断','补齐本地三类输出')
fix('root','v39-retell','回到找餐厅：云端接下请求后，为 Planner 带上可用背景。如果仍缺游泳馆的位置，Planner 先查询记忆；拿到具体地点，才能接着搜附近餐厅。没有查到就仍然缺信息，需要澄清，不能编一个地点。餐厅列表真正返回并展示后，下一句“第二个”才有明确对象。','回到找餐厅：本地发现需要查询记忆、联网搜索，返回办不了，继续交给云端；这与拒识不同。云端为 Planner 带上可用背景。按这个教学示例应有的处理分支，如果仍缺游泳馆的位置，Planner 可以把记忆查询放进动作清单（action_list），工具返回地点后再安排餐厅搜索。没有查到就仍缺信息，需要澄清，不能编地点。搜索工具交回真实列表（tool_feedback），展示并保留顺序后，“第二个”才有明确对象。','工具交接、分流和教学分支限定')
fix('root','v39-glossary','ASR；过程文字 partial，定稿 final；一遍 / 二遍（two_pass）是识别阶段术语','ASR；流式识别指边接收声音边返回文字；过程文字 partial，定稿 final；一遍 / 二遍（two_pass）是识别阶段术语','术语别名统一承接避免正文重复')
fix('voice','v39-s1','若豆包正在播报，插话判断会利用它决定是否停播；判停则继续观察主驾是否还会开口。','若豆包正在播报，插话判断会利用当时可用的过程文字决定是否停播，具体取在线还是离线结果仍待核实；判停则继续观察主驾是否还会开口。','不把在线识别前文误接成已确认流式输入')
for sid,key,text in [
 ('v39-s5','v34-memory','这张图区分系统提前带入的记忆与 DT 发现缺口后主动查询的记忆，帮助理解“昨天那家”的地点信息在哪一步补齐。'),
 ('v39-s5','v34-edge','这张图把本地与云端的候选结果放在一起，看固定规则、正常联网和断网超时分别怎样决定执行。'),
 ('v39-s5','v34-h2h','这张图追踪乘员之间的一句话：谁先记录、什么时候上报，以及记录后还缺哪一步才能用于回答。')]:
 s=next(s for s in files['context']['sections'] if s['id']==sid);marker=re.search('<!--fig:'+key+r'\|.*?-->',s['html']).group();fix('context',sid,marker,'<p>'+text+'</p>'+marker,'补图前目的，图marker不变')
s=next(s for s in files['models']['sections'] if s['id']=='v39-s3');marker=re.search(r'<!--fig:v45-bargein\|.*?-->',s['html']).group();fix('models',s['id'],marker,'<p>这张时间图跟着同一次插话，看哪一版文字触发了停播，以及停播后为什么还要继续收音。</p>'+marker,'图前交代阅读目的')
# Place the FC explanation before the comparison that uses it.
s=next(s for s in files['models']['sections'] if s['id']=='v39-s3');p=re.search(r'<p>“把话翻成函数和参数”叫[\s\S]*?</p>',s['html']).group();table='<div class="v34-table" id="v49-model-role-comparison">';assert table in s['html'];s['html']=s['html'].replace(p,'').replace(table,p+table,1);changes.append({'section':s['id'],'reason':'FC先解释功能和参数，再读模型对照表','movedParagraph':p})
fix('models','v39-s3','车上的对话历史只是云端的一部分，保留范围是 30 分钟内最多 10 轮，更早的只留摘要。','车上只保留有限的对话历史，缺失的前文就无法参与这次判断。','将历史参数留在现有展开，正文保留输入限制')
# Ensure the removed parameters remain accessible in the original detail material.
s=next(s for s in files['models']['sections'] if s['id']=='v39-s3');detailtext=''.join(re.findall(r'<details\b[\s\S]*?</details>',s['html']))
if not ('30 分钟' in detailtext and '10 轮' in detailtext):
 id='v50-s3-local-history-scope';s['html']+='<details class="v49-detail" id="'+id+'"><summary>查本地历史范围：30 分钟和 10 轮对应什么限制？</summary><div class="v49-detail-body"><p>本节所引本地方案保留 30 分钟内最多 10 轮历史，更早内容只留摘要。该范围不等于全部车型当前统一配置，也不代表模型必然拿到了车内所有人的聊天。</p></div></details>'
fix('context','v39-s5','如果返回结果的顺序与展示顺序不一致，或者列表没有进入后续上下文，即使保存了游泳馆记忆，也会选错餐厅。','按这个教学分支，DT 应从实际展示的列表中取出第二家，再用这家餐厅的地点信息安排后续动作。如果返回结果的顺序与展示顺序不一致，或者列表没有进入后续上下文，即使保存了游泳馆记忆，也会选错餐厅。','补第二个解析后交出什么')
for n,p in files.items():(D/(n+'-patch.json')).write_text(json.dumps(p,ensure_ascii=False,indent=2))
(D/'review-fixes.json').write_text(json.dumps(changes,ensure_ascii=False,indent=2))
