import json
from pathlib import Path
D=Path(__file__).parent
files={n:json.loads((D/(n+'-patch.json')).read_text()) for n in ['root','models','support']}
changes=json.loads((D/'review-fixes.json').read_text())
def fix(name,sid,old,new,why):
 s=next(s for s in files[name]['sections'] if s['id']==sid);assert old in s['html'],old
 s['html']=s['html'].replace(old,new);changes.append({'file':name,'section':sid,'before':old,'after':new,'reason':why})
fix('models','v39-s3','图上每次返回几个字只是示意。实际情况里，模型常常要等更多次才敢判，这正是后面要讲的难点。','图上的四格表示同一次说话的四个时刻。第一格“帮我”只说明此刻信息不足，不表示两个字已经触发模型调用；实际调用仍须满足前面的“超过两个字”等条件。第三格“播报已停，继续收音”只说明收音继续，不能据此认定模型此后一定不再调用，具体停止条件仍待核对。','在原图下解释触发条件疑点，不重画')
fix('models','v39-s3','每一次判断用的都是<b>当时那一版</b>字和背景。事后复盘不能拿整句话去评价第一次判断，那时模型只看到了两个字。','满足调用条件后，每次模型判断用的都是<b>当时那一版</b>文字和背景。事后复盘应还原那一刻的输入，不能把用户后来补全的整句话当成模型当时已经知道的信息。','去掉两字已调用断言')
fix('models','v39-s3','系统先过规则：车上两个人，开头不是“豆包”，豆包在播报，要请模型。负责流式拒识的模型读“当前的过程文字 + 最近对话”：只有“帮我”时信息不够，继续等；到“帮我把副驾”时判为对豆包说，车上停掉豆包的播报。','系统先过规则：车上两个人、开头不是“豆包”、豆包正在播报。只有“帮我”两个字时继续等；过程文字超过两个字后，满足调用条件，流式拒识模型才读“当前过程文字 + 最近对话”。假设到“帮我把副驾”时判为对豆包说，车上就停掉豆包的播报。','复述遵守触发门槛，示例判断非必然')
fix('support','v39-s5','<td>车上小模型的结果</td>','<td>符合采纳条件的本地车控候选；已上云超时后本地 reject 是否采纳仍待确认，见第二段</td>','与PRD冲突标注一致')
fix('support','v39-s5','从顶部读，两条路同时启动。','按这张赛力斯方案图从顶部读，两条路同时启动。','限定图解范围')
fix('support','v39-plan-arb','对车上模型的要求是“低召回、高准确”：宁可少接，接了就要对。','对车上模型的要求是“低召回、高准确”：少承接拿不准的本地车控，把它交给云端；已经承接的车控要做对。这里说的是车控承接范围，与拒识阶段尽量接住有效用户请求是两项要求。','区分车控覆盖与拒识召回')
fix('root','v39-retell','热词是识别前提供的人名、地名等候选词，帮助减少同音错字。用户报出具体人名、店名时，热词帮助减少同音错字。','热词是识别前提供的人名、地名等候选词。用户报出具体人名、店名时，它帮助减少同音错字。','合并重复句')
for n,p in files.items():(D/(n+'-patch.json')).write_text(json.dumps(p,ensure_ascii=False,indent=2))
(D/'review-fixes.json').write_text(json.dumps(changes,ensure_ascii=False,indent=2))
