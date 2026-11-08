import json
from pathlib import Path
root=Path('.')

def audit_file(name,ids,count):
 return {'reviewed':[{'file':f'content/lecture-{name}-20261029.json','pageIds':ids,'scope':'逐段审读 intro、全部 lesson、全部 guide、closing、metrics；核对局部流程标题、caption 与关键分支节点。对关键冲突回查一手原文。','lessonCount':count}],'findings':[],'notes':[]}

def add(out,name,page,path,problem,evidence,replacement,severity='medium'):
 f=f'content/lecture-{name}-20261029.json'
 d=json.loads(Path(f).read_text())
 value=d
 for k in path:value=value[k]
 if callable(replacement):replacement=replacement(value)
 out['findings'].append({'severity':severity,'file':f,'pageId':page,'path':path,'match':value,'problem':problem,'evidence':evidence,'replaceWith':replacement})

async_audit=audit_file('async',['I','W','F','T','B','A','G','S'],31)
add(async_audit,'async','I',['pages',0,'teaching','lessons',0,'paragraphs',0],
 '“尚未开始输出”仍可能已经发起工具调用；重组窗口必须同时限定未发起外部工具，避免已执行动作被重新规划重放。',
 'research/lecture-rewrite-20261029/source-补查-input-management.md 第 120–145 行：工具外部执行是不可重放边界；已进入外部 Tool 调用后保留事实并中断旧输入，不再无副作用合并。',
 '在允许合并的窗口里，旧请求尚未开始对用户输出、也没有发起外部工具调用，新来的有效请求才可以与它一起交给 Director。例如主驾问上海天气、副驾问北京天气，合并后的输入保留两个说话人和各自的问题，Director 才能分别回答。若一人要求开大空调、另一人要求关闭，则要处理这个冲突，座位标识本身不等于默认优先权。')
add(async_audit,'async','F',['pages',2,'teaching','guides','base','paragraphs',2],
 'F13→M1 仅写“重新决策”，容易与独立异步 callback 作为新输入混淆；应交代这是原目标的后续判断以及续轮准入。',
 'research/lecture-rewrite-20261029/source-补查-input-management.md 第 51–69 行：同步工具完整批次经 Input Manager 取得续轮调用，独立异步 callback 是后续设计。',
 '正常返回从 F10→F11→E5 回原工具链。Fallback 沿 F13 将不能继续的原因交回主链；采用输入管理首期方案时，经 M1 取得续轮准入后，Director 仍接着原目标判断。明确转交其他 Agent 时走 F14→F02，重新选择目标实现；单独配置的直返走 F12→O01。')
add(async_audit,'async','G',['pages',6,'teaching','lessons',2,'paragraphs',0],
 '以“宝宝持续哭闹”解释通用重复派发，会和上一节语义目标首次达成后停止再次推理及动作的规则混在一起。更换为持续状态场景，明确两层控制。',
 'research/lecture-rewrite-20261029/async-source-compact/A15.md 第 80–84 行：目标达成后标记场景已达成，每次执行前检查并跳过后续推理和 action；A11 为通用执行次数与间隔。',
 '车内持续高温时，多次状态更新都可能满足同一个主动服务场景。执行策略用总次数、单日次数、单次上电次数和间隔限制重复派发。条件成立但频控拦截，本轮不再通知；条件未成立则继续等待。视觉目标首次达成后的停止推理，由前述已达成标记处理，与这组通用次数和间隔控制分别生效。')
add(async_audit,'async','B',['pages',4,'teaching','lessons',0,'paragraphs',2],
 '统一写所有状态超过有效期即失效，容易被理解为已有全量一致的时效治理机制；各类状态的更新和消费规则应按其定义说明。',
 'research/lecture-rewrite-20261029/async-source-compact/A13.md 按信号上报与消费合同组织；A19 的条件判断将未知值单独处理。已读材料没有统一定义每种状态的同一有效期机制。',
 '进入状态系统时，字段、位置、单位和采样时间按各信号的定义对齐。配置了有效期的状态超时后失效，其他状态按来源更新和消费规则使用。Director 在当前轮据此判断这份温度或车窗信息是否仍能代表对应车辆、对应座位的现状。',severity='low')
async_audit['notes']=['其余 31 节的主体业务顺序、工具及 Task Service 的状态交接、视觉目标与观测关系保留；无需为精简删掉具体机制。','本审核不把历史回归数字或方案目标改成现网指标。S 中 10/14 数据已注明历史范围；Input Manager 为首期方案的局部标识保留。']

support_audit=audit_file('support',['P','L','H','U','K','EV','EL'],33)
add(support_audit,'support','P',['pages',0,'teaching','intro',0],
 '“发现儿童就开锁”容易读成解除儿童锁，方向与儿童安全场景相反。',
 'research/lecture-rewrite-20261029/async-source-compact/A19.md 的儿童锁场景：儿童在车内时提示开启儿童锁。根代理冷读也指出此歧义。',
 lambda s:s.replace('儿童锁却还没打开','儿童锁却还没启用').replace('发现儿童就开锁','发现儿童就启用儿童锁'))
add(support_audit,'support','P',['pages',0,'teaching','guides','base','paragraphs',2],
 '把 P11→A10 的运行时问图放在 P06/P07/P08 发布之前讲，会让读者以为编辑模板时要先取摄像头识别结果。需要区分配置依赖与场景触发后的实际调用。',
 'research/lecture-rewrite-20261029/async-source-compact/A19.md 的充电场景通过模型 Tool 问图后询问，配置平台负责模板依赖与发布；同页 p-rules 正文已经区分运行时。',
 'P11 记录模板依赖的外部能力，例如充电场景需要 A10 的视觉问答。配置时先确认该车型已接入这项能力；真正触发后，再由 Director 调用问图，发现充电设施才继续询问。P06 配置次数、间隔和结束规则，P07 校验后由 P08 发布。')
add(support_audit,'support','EV',['pages',5,'teaching','lessons',4,'paragraphs',0],
 '“出现新的声音，播放层先停止”将任意噪声或语音都写成停播条件。实际依车型/模式采用流式拒识、唤醒前缀或单人文本长度等判断。',
 '/Users/bytedance/Desktop/3.23/产品/codex/全源重读-20261023/voice/body-onepager.md 第 153–187 行；research/lecture-rewrite-20261029/source-补查-input-management.md 第 70–78 行，分别规定流式打断与可恢复性。',
 '豆包介绍路线时，车内出现新的语音。语音模块先按当前车型的流式打断规则判断是否停播；满足条件后，播放器停止旧声音，并记录已经说出与尚未说出的内容。最终拒识随后确定新话是否向豆包提出请求，系统再决定接新诉求还是处理旧播报。')
add(support_audit,'support','EV',['pages',5,'teaching','lessons',4,'paragraphs',2],
 '新话被拒识并不总能恢复旧播报，单人长度阈值打断及显式叫停存在不可恢复分支。',
 'research/lecture-rewrite-20261029/source-补查-input-management.md 第 70–78 行：多人流式拒识非拒识或豆包前缀打断可恢复，单人 ASR 长度超过 2 的直接打断不可恢复；同内容包 I 已保留这一产品分支。',
 '新话被拒识后，先按本次中断原因和车型策略判断是否允许恢复。允许恢复时，再把打断事件及已播、未播内容交给 Director，决定是否补充有价值的信息；用户明确叫停或被标为不可恢复的播放则直接结束。')
add(support_audit,'support','EL',['pages',6,'teaching','lessons',3,'paragraphs',1],
 '统一称“按实际发生时间还原”会抹掉 Trigger 事件使用规则匹配时刻的来源差异，与 EV 的正确解释不一致。',
 '/Users/bytedance/Desktop/3.23/产品/codex/全源重读-20261023/async/bodies/A40.md 第 295 行：【触发时间】指 Trigger 规则匹配成功的时间，不是端状态上报时间；同补丁 ev-lesson-produce 第 4 段已经明确。',
 '事件晚到时，保存层保留记录携带的事件时间，并按生产来源解释：客户端操作使用操作时刻，Trigger 生成的事件使用规则匹配时刻。Context、记忆和订阅业务再按各自窗口决定怎样使用。一小时前的开窗记录可以补全历史，此刻是否提醒则使用最新车窗状态。')
support_audit['notes']=['P/L/H/U/K/EV/EL 共 33 节保持了具体场景和状态交接，没有发现需要整节删除的泛泛教学区块。','K 保留明确的画像、语义检索、身份、开关和异步生成路径；500 ms 查询目标、90 秒生成目标与实时完成分开。EV 的临时方案状态应继续保留。']
for name,data in [('audit-async.json',async_audit),('audit-support.json',support_audit)]:
 path=Path('research/lecture-rewrite-20261029',name)
 path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
 print(path, len(data['findings']))
