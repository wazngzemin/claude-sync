from pathlib import Path
import json
R=Path('/Users/bytedance/Desktop/3.23/产品/codex/座舱业务学习站')
p=R/'content/case-async-20261029.json'
d=json.loads(p.read_text())
d['sources']=[
 {'id':'CASE-ADVISOR-ACTIONLIST','title':'【AI 汽车】静态 Advisor 来源标识与 ActionList 透传方案','url':'https://bytedance.larkoffice.com/wiki/Es9YwYYRzijcWBkNJSyc20P6nyh'},
 {'id':'CASE-ADVISOR-PROGRESS','title':'AIVA-静态 Advisor 进展盘点（2026-10-27 进度段）','url':'https://pq3b44yw2t9.feishu.cn/docx/L3e6d2Cv1oW3F3xnz7nc3cxZneh'},
 {'id':'CASE-SIGNAL-HUB','title':'火山引擎座舱大模型「信号中枢」产品方案','url':'https://bytedance.larkoffice.com/docx/NmDRdTctfolAKqxHGKvcCIsZnLg'},
 {'id':'CASE-SIGNAL-ONEPAGE','title':'端状态&事件日志上报 One Page','url':'https://bytedance.larkoffice.com/wiki/PRf0wRd3Uic0omkiiiGc70wanQN'}
]
b=json.loads((R/'research/case-rewrite-20261029/baseline-data.json').read_text())
nodes={n['id']:n for m in b['base']['modules'] for n in m['nodes']}
patches={}
def patch(id,paragraphs): patches[id]={'id':id,'paragraphs':paragraphs}
patch('W05',[
 '匹配服务拿最终文字与当前页面注册词比较。直接说按钮名称走精确匹配；模糊匹配允许前面加“点击”“点一下”“帮我选”“选择”等前缀，句末可以带“吧”“啦”等语气词。局部匹配还受原框架的长度与连续匹配规则约束，不能把表达相近直接当作语义理解成功。',
 nodes['W05']['paragraphs'][1]])
patch('W09',[nodes['W09']['paragraphs'][0],
 '如果一次操作涉及多项结果，应保留各自完成与失败，不能用一句成功覆盖全部。结果与需要播报的内容交豆包统一处理：框架提供简短失败话术，同时要求系统 Toast 的详细失败文案不机械逐字播报。接下来由统一输出链分别处理声音和界面。'])
patch('S06',[
 '静态 Advisor 与任务触发的建议，都以 advice 类型进入输入管理。首期输入调度方案将它们设为普通优先级：空闲时处理，忙时等待，再按可合并属性安排推理。前者提出当下值得提供的服务，后者兑现已登记的安排，输入时要保留各自来源与身份。',
 '需要车企 AI Bar 先让用户确认的分支，可先展示卡片；需 Director 推理的建议则进入本轮判断。用户有效 Query 可以改变当前对话安排，已发工具仍保留真实结果。新的舒适建议不能把原导航反馈当成自己已经完成的动作。'])
patch('S07',[
 nodes['S07']['paragraphs'][0],
 '舒适车控返回后，服务端先保留实际成功动作。ActionList 透传方案要求等本轮 Planner 明确不再调用工具，再按调用顺序合并成功结果，上报一次 AI Bar。它只适用于建议身份与车辆匹配、归属明确的静态 Advisor 调用；混合用户输入或多条建议尚不能按同样规则归因。',
 '失败调用不贡献成功动作，列表内容由客户端提供，模型不补写。AI Bar 更新失败不会撤回已经完成的车控，回复与卡片仍须保留成功和失败的真实范围。'])
patch('S10',[
 nodes['S10']['paragraphs'][0],
 '状态型 AI Bar 接续真实执行反馈。ActionList 透传方案先按每次车控调用收集成功回包，等 Planner 整轮不再调工具后统一上报；没有成功车控结果时不报。建议上下文有效且归属清楚，才可以把这些结果用于原建议的状态更新。卡片显示、用户确认与车辆变化分别发生，计划动作不能提前变成完成状态。'])
patch('A13',[
 'Task Service 把用户要求改写为可观察目标，并明确“那边的宝宝”所指位置。长时视觉方案在创建前检查 AlwaysOn 是否开启，同时最多承接三条目标；开关不允许或超过额度时，拒绝创建并返回结果，不能只保存任务却不提供观察能力。',
 '新增、修改或删除后，服务端重新下发当前完整目标列表，端侧全量替换，不做增量合并。关闭持续观察时，要清除相关动态目标并结束对应任务；再次打开只恢复后续创建条件，不能自行恢复用户已终止的安排。'])
patch('A14',nodes['A14']['paragraphs'][:2])
patch('A15',[
 nodes['A15']['paragraphs'][0],
 '相机或端侧模型不可用时，本次问图返回失败兜底，不自动改用云端模型。舱内画布只展示文本；其他适用场景可以展示图片加文本。这个差异来自舱内隐私和端侧处理约定，不能据此推导所有车型、所有镜头都走同一路径。'])
patch('A16',[
 '适用的舱外问图先由客户端按所需视角抓拍，上传图片引用。车辆识别交专用接口；通用图片理解交内容定制联网智能体。沿途地点问答另由弋途提供答案，图片只用于交互展示，不能把沿途答案误认成视觉模型识别的结果。',
 '取图、上传和识别分别提供下一步所需信息；任一步失败都要回到原调用。上传成功只说明拿到了图片引用，仍需等待对应工具答案。Planner 取得答案后再判断是否继续查信息、向用户解释或调用其他动作。'])
patch('B10',[
 '状态告诉系统当前温度或开关值，事件说明某时发生了开门、点击或停播，用户 Query 表达希望做什么。它们共同提供判断背景，不能互相替代。例如播报被打断只是事件，用户随后说“先导航”才提出新的目标。',
 '进入 Director 时，用户请求、变化事件、工具结果和建议分别保留 user query、event、tool_feedback、advice 等类型及来源。这样下一轮才能判断是在补事实、更新进度，还是收到新的安排。工具返回已调温与车内温度仍偏高，也描述不同阶段：前者是动作结果，后者是仍需考虑的当前状态。'])
d['baseNodePatches']=list(patches.values())
# Keep the documented redirect limit alongside the distinction from Fallback.
f=next(x for x in d['pages'] if x['id']=='F')
l=next(x for x in f['teaching']['lessons'] if x['id']=='f-lesson-exceptions')
l['paragraphs']=[x.replace('后者已经给出转交目标。它们都不是','后者已经给出转交目标，框架限制最多跳转两次，调用方仍要核对目标实现与权限。它们都不是') for x in l['paragraphs']]
p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
print('registered',len(d['sources']),'sources;',len(d['baseNodePatches']),'node patches')
