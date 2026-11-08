from pathlib import Path
from datetime import datetime
from zoneinfo import ZoneInfo
root=Path('/Users/bytedance/Desktop/3.23'); work=Path(__file__).resolve().parent
sources=[('memory-talk.md','memory-product-lecture.md','记忆产品宣讲','https://bytedance.larkoffice.com/docx/Ytzbd2OoNoMk0xxi099c1t9CnHh'),('director-talk.md','director-product-lecture.md','Director 产品宣讲','https://bytedance.larkoffice.com/docx/Is0mdygy3oQmEixHRUNcolvXnRb'),('director-prd.md','director-prd.md','Director 产品需求','https://bytedance.larkoffice.com/wiki/XRuKwJ0VPisdUhkxH0ecY1rRn9g'),('planner-exploration.md','planner-exploration-prd.md','Planner 探索需求','https://bytedance.larkoffice.com/wiki/K8Ihw3a4niaDNck7FEkcDXcOnfb'),('memory-prd.md','memory-prd.md','记忆产品需求','https://bytedance.larkoffice.com/wiki/CbJVw4ACzilvvBkRxkqcQVfAnLh')]
raw=root/'raw/articles/product-lectures/2026-10-29';raw.mkdir(parents=True,exist_ok=True)
for src,name,title,url in sources:
 dest=raw/name
 if dest.exists():raise RuntimeError('Raw snapshot already exists: '+str(dest))
 with dest.open('x') as f:f.write(f'# {title}\n\n原文：{url}\n\n读取日期：2026-10-29\n\n'+(work/src).read_text())
base='raw/articles/product-lectures/2026-10-29/'
def newdoc(rel,title,tags,refs,body):
 p=root/'wiki'/rel;p.parent.mkdir(parents=True,exist_ok=True)
 if p.exists():raise RuntimeError('Derived page exists: '+str(p))
 p.write_text('---\ntitle: '+title+'\ndate: 2026-10-29\nupdated: 2026-10-29\ntags: ['+', '.join(tags)+']\nsources:\n'+''.join('  - '+base+r+'\n' for r in refs)+'status: active\n---\n\n# '+title+'\n\n'+body+'\n')
newdoc('summaries/memory-product-lecture.md','记忆产品宣讲与需求对照',['summary','meeting','product'],['memory-product-lecture.md','memory-prd.md'],'''用户说“去昨天那家游泳馆”，记忆负责提供历史地点，Director 再将确定的地点交给导航。宣讲沿原料、生产、召回、管理展开。

情景记忆先按乘客上下车分段，再在各段内按 20 条事件或 20 分钟聚合；日级任务进一步整理长期经历。近期对话摘要从第三轮开始滚动，补足近五轮完整对话与较早生成记忆之间的空白。

车辆和豆包账号共同隔离记忆空间。隐私筛选进一步考虑询问者和当前在场人。白名单内容可取包含询问者的经历；敏感内容要求历史同乘范围覆盖当前已注册乘客。

10 月 28 日宣讲区分了当前状态。语义画像已经使用；行为画像已实现但未供当前推理使用；完整情境 buffer 未实现；语音删除仍在开发。记忆关闭停止相关事件记录、生成和召回，已有内容保留冻结，近五轮多轮对话继续可用。

记忆页面只展示长期语义记忆，按当前已注册乘客交集筛选，按人筛选入口已去除；服务端按人操作接口仍存在。家、公司已做记忆到车机地图的单向同步，扩展其他数据和改变地图存储方式属于讨论方案。

相关页面：[记忆系统](../entities/memory-system.md)、[宣讲写法](../concepts/product-lecture-explanation.md)。''')
newdoc('summaries/director-product-lecture.md','Director 产品宣讲与需求对照',['summary','meeting','product','architecture'],['director-product-lecture.md','director-prd.md','planner-exploration-prd.md'],'''Director 与 Planner 在这套材料中指同一对话推理职能。用户请求、主动建议、工具反馈和事件提供不同输入；Director 结合当前背景生成话术与动作清单。

宣讲用多步依赖解释工具调用。缺少“昨天的泳馆”时先查记忆，返回确定地点后再导航。同批工具可以同时交办，结果汇集后统一决定回复；有前后依赖的动作分轮执行。

用户记忆、车况和当前请求共同影响决策。当前明确要求优先，旧偏好用于补足未说清部分；人员名称需要对应当前座位，车辆知识不会自动增加本车执行能力。

10 月 22 日宣讲中，人人对话未接入，若干端侧或高德复杂能力仍处测试阶段。P50 不超过 500 毫秒、P90 不超过 800 毫秒是推理时延目标，不能表述为线上实测成绩。

输入管理首期的续轮准入和独立异步 callback 范围需结合专门方案解释。同步工具反馈延续原目标；独立 callback 不能仅凭概念图写成当前实现。

相关页面：[Director](../entities/director.md)、[宣讲写法](../concepts/product-lecture-explanation.md)。''')
newdoc('entities/memory-system.md','豆包汽车记忆系统',['entity','product','architecture'],['memory-product-lecture.md','memory-prd.md'],'''记忆系统把获准保存的对话、操作和车辆事件整理成经历、事实与偏好，在后续请求中返回相关内容。当前请求先由 Context 预取，信息不足时由 Director 显式查询。

生产侧区分情景经历、语义记忆和对话摘要；检索侧按人物、同乘范围、标签及相关性选择内容；管理侧提供开关、可见范围和删除。用户关闭记忆时冻结既有数据，删除才清理选定内容并更新受影响画像。

语音删除仍在开发、行为画像已做未用、家与公司单向同步等状态以 10 月 28 日宣讲为时点。原文和具体边界见[记忆宣讲摘要](../summaries/memory-product-lecture.md)。''')
newdoc('concepts/product-lecture-explanation.md','按真实业务讲解产品模块',['concept','methodology','product'],['memory-product-lecture.md','director-product-lecture.md'],'''讲解从用户遇到的问题开始。例如“系统听懂了去昨天的游泳馆，却不知道具体地点”，自然引出记忆检索；找到地点后还要导航，自然引出工具依赖和反馈。

每段推进一个实际变化。先交代谁收到什么信息，再说明为什么需要判断，接着讲处理结果交给谁。出现新术语时立即说明它在当前场景中的用途。参数、状态和异常只在影响产品行为时展开，但不省略关键顺序。

现行能力、开发中功能和讨论方案分别交代适用范围。出处保留在参考入口，正文直接讲机制，避免反复介绍取证过程、要求读者自行核验或添加没有具体业务内容的总结。

图下讲解按可见节点编号串起输入、分支和下游，不只复述方框标题。跨页沿同一目标继续讲，避免每页重设一个抽象话题。''')
# Existing entity receives a current-source correction; older notes remain as dated context.
p=root/'wiki/entities/director.md';s=p.read_text();s=s.replace('updated: 2026-04-20','updated: 2026-10-29');s=s.replace('sources:\n','sources:\n  - '+base+'director-product-lecture.md\n  - '+base+'director-prd.md\n',1);s=s.replace('## 当前架构\n```\n用户请求 → Director(主模型) → Planner(任务规划) → 工具调用 → 执行结果\n```','''## 2026 年 10 月宣讲中的职责

Director 与 Planner 是同一对话推理职能的名称。收到用户请求及相关背景后，它选择工具、解释返回结果并决定下一轮动作。前一步缺少的信息由工具补齐后，再进行依赖它的下一步。

用户请求与背景 → Director / Planner → 工具调用 → tool_feedback → 原目标下一轮判断。

下列优化与临停笔记保留原记录时点，不作为 10 月全部现行能力清单。最新宣讲见[Director 产品宣讲](../summaries/director-product-lecture.md)。''');p.write_text(s)
index=root/'wiki/index.md';s=index.read_text();s=s.replace('updated: 2026-06-01','updated: 2026-10-29');s=s.replace('| [[planner]] | Director 的任务规划子模块，负责意图拆解和工具调用决策 |','| [[planner]] | 与 Director 对应的规划职能名称；10 月宣讲按同一对话推理模块理解 |')
s=s.replace('## 概念页 (concepts/)','| [记忆系统](entities/memory-system.md) | 生产、检索与管理用户经历和偏好，区分 10 月宣讲中的使用状态 |\n\n## 概念页 (concepts/)')
s=s.replace('## 综合分析 (synthesis/)','| [按真实业务讲解产品模块](concepts/product-lecture-explanation.md) | 按用户问题、输入缺口、判断、动作、反馈讲清业务交接 |\n\n## 综合分析 (synthesis/)')
s += '\n| [记忆产品宣讲与需求对照](summaries/memory-product-lecture.md) | 10 月 28 日逐字稿及记忆 PRD | 同乘分段、分层召回、开关和删除、画像与跨端状态 |\n| [Director 产品宣讲与需求对照](summaries/director-product-lecture.md) | Director 逐字稿、PRD 及探索需求 | 工具依赖、批内反馈、背景使用与能力范围 |\n';index.write_text(s)
with (root/'wiki/log.md').open('a') as f:f.write('\n| '+datetime.now(ZoneInfo('Asia/Shanghai')).strftime('%Y-%m-%d %H:%M')+' | ingest | product-lectures/2026-10-29；记忆与 Director 宣讲摘要 | 追加两份逐字稿与三份需求快照；更新记忆实体和讲解方法，纠正 Director/Planner 串行误解，用于现有 HTML 的宣讲式改写。 |\n')
print('5 immutable source snapshots, 2 summaries, 1 new entity, 1 concept, Director correction, index and log updated')
