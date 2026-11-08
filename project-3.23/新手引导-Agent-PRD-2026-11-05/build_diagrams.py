from pathlib import Path
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "diagrams"
OUT.mkdir(exist_ok=True)
BLUE = "#0055A4"
LIME = "#DCF4A2"
WHITE = "#FFFFFF"
W = 1660

def txt(x, y, value, size=26, weight=400, anchor="start"):
    return f'<text x="{x}" y="{y}" fill="{BLUE}" font-size="{size}" font-weight="{weight}" text-anchor="{anchor}">{escape(value)}</text>'

def rect(x, y, w, h, fill=WHITE):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{fill}" stroke="{BLUE}" stroke-width="2"/>'

def arrow(x1, y1, x2, y2, label=None):
    result = f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{BLUE}" stroke-width="3" marker-end="url(#arrow)"/>'
    if label:
        if x1 == x2:
            result += txt(x1 + 18, (y1 + y2) / 2 + 8, label, 22)
        else:
            result += txt((x1 + x2) / 2, y1 - 13, label, 22, anchor="middle")
    return result

def panel(x, y, w, title, lines, fill=WHITE, h=136, small=False):
    parts = [rect(x, y, w, h, fill), txt(x + 28, y + 40, title, 26 if not small else 25, 650)]
    for i, line in enumerate(lines):
        parts.append(txt(x + 28, y + 78 + i * 31, line, 24 if not small else 23))
    return "".join(parts)

def save(name, title, subtitle, body, height):
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{height}" viewBox="0 0 {W} {height}">
<defs><marker id="arrow" markerWidth="12" markerHeight="12" refX="9" refY="4" orient="auto" markerUnits="strokeWidth"><path d="M0 0 L10 4 L0 8 z"/></marker></defs>
<rect width="{W}" height="{height}" fill="{WHITE}"/>
{txt(70, 67, title, 38, 700)}
{txt(70, 111, subtitle, 25)}
<line x1="70" y1="140" x2="1590" y2="140" stroke="{BLUE}" stroke-width="2"/>
{body}
</svg>'''
    (OUT / (name + ".svg")).write_text(svg, encoding="utf-8")

def flow(name, title, subtitle, nodes):
    x, w, y, h, gap = 100, 920, 185, 136, 67
    bx, bw = 1190, 400
    body = []
    for i, n in enumerate(nodes):
        body.append(panel(x, y, w, n["title"], n.get("lines", []), LIME if n.get("decision") else WHITE, h))
        if "branch" in n:
            b = n["branch"]
            body.append(arrow(x + w, y + h / 2, bx - 4, y + h / 2, b.get("label", "否／未知")))
            body.append(panel(bx, y, bw, b["title"], b.get("lines", []), WHITE, h, True))
        if i < len(nodes) - 1:
            body.append(arrow(x + w / 2, y + h + 2, x + w / 2, y + h + gap - 4, n.get("next_label")))
        y += h + gap
    save(name, title, subtitle, "".join(body), y - gap + 65)

def n(title, *lines, decision=False, branch=None, next_label=None):
    r = {"title": title, "lines": list(lines), "decision": decision}
    if branch: r["branch"] = branch
    if next_label: r["next_label"] = next_label
    return r

def b(title, *lines, label="否／未知"):
    return {"title": title, "lines": list(lines), "label": label}
# Current release: semantic relevance, trigger conditions, DT and processing feedback.
body=[]
body.append(panel(70,185,1520,'场景配置平台',['语义描述与示例、组合条件、引导建议、次数及启停','配置变更同步到模型候选与触发器规则']))
body.append(arrow(310,325,310,390,'候选配置生效'))
body.append(panel(70,400,480,'对话入口 → 语义匹配模型',['用户表达与已配置场景匹配','只输出相关场景或无匹配']))
body.append(panel(590,400,480,'明确业务事件',['记忆同步完成等真实事件','直接作为条件输入']))
body.append(panel(1110,400,480,'账号及功能模块',['注册、授权、使用等状态','提供实际可取得的事实']))
for x in (310,830,1350): body.append(arrow(x,540,x,610))
body.append(panel(70,620,1520,'触发器：组合条件判断',['结合相关性或事件，检查状态、次数与适用范围；条件未知或不满足则退出','条件满足并去重后，向 DT 提供当前场景的预设引导建议'],LIME))
body.append(arrow(830,760,830,835,'建议关联本轮请求'))
body.append(panel(70,845,1520,'DT／Planner：结合原请求处理建议',['在当前轮有效窗口内接收建议，组织回复、生成动作并调用既有工具','工具反馈返回 DT 后继续判断；明确记忆同步事件由 DT 检索真实记忆']))
body.append(arrow(400,985,400,1065,'对应推理已开始'))
body.append(arrow(1210,985,1210,1065,'回复或工具动作'))
body.append(panel(70,1075,700,'触发器：成功计次与结束',['关联本条建议，仅计一次','达到配置上限后停止主动引导'],LIME))
body.append(panel(890,1075,700,'既有工具与端侧交互',['真实执行，返回工具与播放结果','处理成功、用户触达、功能成功分开记录']))
save('01-trigger-architecture','新手引导触发链路','语义模型识别场景，触发器核对条件与计次，DT 承接对话和执行',''.join(body),1280)
flow('02-runtime-flow','对话类场景运行主链路','每个节点只承担对应判断；不增加独立的新手引导业务编排层',[
 n('用户表达进入已配置场景匹配','输入当前表达及相关场景描述、示例','原请求仍按既有对话链路承接'),
 n('单模型是否匹配到相关场景？','只判断语义相关性','不判断首次、次数或授权',decision=True,branch=b('无匹配／异常','结束本次引导机会','原对话继续'),next_label='相关'),
 n('触发器检查组合条件是否成立','核对真实账号、身份、使用及次数条件','按场景处理去重与冲突',decision=True,branch=b('不成立／未知','不下发引导建议','不扣成功次数'),next_label='成立'),
 n('触发器向 DT 提供预设建议','关联当前请求与场景','保留用户原需求，说明引导目的和限制'),
 n('建议能否进入当前轮接收窗口？','DT 结合建议与原请求进入对应推理','实际交接时点由联调确定',decision=True,branch=b('迟到／未处理','结束旧机会','不跨话题补播'),next_label='进入对应推理'),
 n('DT 判断是否需要采用引导建议','明确功能请求无需介绍时，只执行原请求','不把正常功能推理记作引导处理',decision=True,branch=b('不采用引导建议','正常承接原请求','不扣引导次数',label='无需介绍'),next_label='采用并开始对应处理'),
 n('DT 回传本条建议的处理开始状态','触发器校验关联，成功计次一次','达到上限后停止该账号场景的主动引导'),
 n('DT 继续既有工具与回复链路','工具返回真实结果，DT 再判断和回应','端侧播放与功能成功分别记录，不重复计次')])
flow('03-identity-case','身份感知补引导','相关对话触发介绍；注册操作沿用既有流程',[
 n('用户聊到称呼、偏好或希望被记住','例如：以后叫我小王，我喜欢吃川菜','语义模型返回身份场景相关'),
 n('触发器能否确认身份场景资格？','提车时跳过注册，当前仍未注册','账号与当前对象关联明确',decision=True,branch=b('条件不成立／未知','不触发原表补引导','正常功能处理继续'),next_label='能确认'),
 n('触发器检查次数与场景可用性','补引导次数尚未耗尽，注册能力可用','通过后下发身份引导建议',decision=True,branch=b('不满足','不再主动补引导','主动注册仍可使用'),next_label='满足'),
 n('DT 处理建议并回传，触发器计次','DT 结合原诉求说明注册价值','询问是否愿意注册，呈现适用指引'),
 n('用户是否明确同意注册？','引导计次与注册授权分别判断','不因语义命中自动执行注册',decision=True,branch=b('拒绝／稍后','停止当轮注册','不伪造成功结果',label='否'),next_label='同意'),
 n('DT 调用身份注册工具并读取反馈','成功才告知注册完成，失败则如实说明','注册结果单独记录，不重复扣引导次数')])
flow('04-memory-guidance','记忆能力引导','介绍功能不要求先读取历史记忆；实际操作由 DT 执行',[
 n('用户表达个人信息或偏好','区分当前用户信息与转述内容','例如：我平时比较喜欢吃川菜'),
 n('语义模型是否匹配记忆相关场景？','依据配置描述与示例判断相关性','不要求检索旧记忆',decision=True,branch=b('无关／无法判断','原对话继续','不增加引导'),next_label='相关'),
 n('触发器检查真实状态及次数','适用条件满足、次数尚未耗尽','检索为空不等于首次使用',decision=True,branch=b('不满足／未知','不下发建议','不计处理成功'),next_label='满足'),
 n('建议到达 DT：是否仍需能力介绍？','DT 识别明确功能请求并避免重复介绍','例如：记住我喜欢吃川菜，应正常执行',decision=True,branch=b('DT 只执行原请求','不采用本条引导建议','不回传引导处理成功',label='无需介绍'),next_label='需要介绍'),
 n('DT 处理引导建议并回传','触发器按对应反馈计次','DT 结合当前话题介绍能力并承接选择'),
 n('用户愿意使用时由 DT 调用工具','遵循记忆功能既有身份和授权要求','工具返回成功才说明已经记住'),
 n('分别记录处理、触达和功能结果','当轮拒绝则停止操作，失败则如实回应','不由触发器读取或写入记忆正文')])
flow('05-memory-sync','记忆同步完成后问候','明确事件直接进入规则；DT 查询真实记忆并组织问候',[
 n('用户选择记忆授权并同步','未授权时不启动这项记忆问候','开箱 FaceID 注册可以跳过'),
 n('是否收到真实的同步完成事件？','激活、授权或开始同步不能替代完成','事件需关联账号与本次同步',decision=True,branch=b('未完成／失败','不提前个性化问候','等待准确结果'),next_label='完成'),
 n('触发器核对事件与组合条件','当前账号、本次有效同步、次数及交互时机','无需经过语义匹配模型',decision=True,branch=b('重复／过期／未知','退出本次问候','不影响新账号'),next_label='成立'),
 n('触发器向 DT 下发配置好的建议','请检索可用记忆，选一到两个点问候','不要求触发器承载记忆正文'),
 n('DT 开始对应推理并回传','触发器关联本条建议计次','DT 继续调用既有记忆检索工具'),
 n('工具是否返回可用真实记忆？','DT 根据真实反馈选择内容','同步完成不保证本次检索一定有结果',decision=True,branch=b('空结果／失败','不编造记忆内容','按既有开箱流程继续'),next_label='有结果'),
 n('DT 组织简短问候，端侧播放','仅选一到两个适合提及的真实信息','另记检索与播放结果，不重复计次')])
flow('06-feedback-loop','处理反馈与触发器计次','本期成功指 DT 开始处理对应建议；实际触达与功能结果另记',[
 n('触发器发出引导建议','关联账号、场景及原请求或业务事件','此时只证明已下发，不增加成功次数'),
 n('DT 是否开始处理这条建议？','必须关联本条建议的对应推理','其他用户请求引起的推理不能代替',decision=True,branch=b('未处理／未知','不计成功','不立即重复下发'),next_label='对应推理已开始'),
 n('触发器核对处理反馈是否重复','接口重试与回传重试关联同一建议','乱序到达也不能串到其他账号',decision=True,branch=b('已处理过该反馈','保持原计数','不重复扣次数',label='重复'),next_label='首次有效反馈'),
 n('触发器增加一次处理成功计数','达到配置上限则结束本场景主动引导','未达上限则等待新的有效机会'),
 n('DT 继续执行，端侧呈现真实交互','播放开始、完成或中断单独记录','没有播放证据就不标记已触达'),
 n('功能模块返回注册或记忆结果','工具成功、失败或未知分别记录','不将已引导等同已注册、已记住')])
flow('07-timing-boundary','引导建议进入当前轮的时序边界','建议必须及时影响当前回复；过期机会不转移到下一话题',[
 n('当前用户请求到达','原对话流程与引导判断按接入方案协同','具体交接方式需与 DT 联调'),
 n('语义相关性与组合条件共同成立','触发器形成关联本轮的引导建议','只下发仍然有效的建议'),
 n('DT 当前轮是否仍可接收建议？','目标是赶在当前回复前影响处理','不假设已有任意时刻回滚或重启能力',decision=True,branch=b('已越过接收窗口','结束本次机会','不跨话题补播'),next_label='可以接收'),
 n('DT 同时保留原请求与引导目的','结合当前语境生成适当回复或工具动作','不能将用户原诉求替换成引导文本'),
 n('是否进入对应建议的处理推理？','回传可关联的处理开始状态','由触发器消费该反馈',decision=True,branch=b('未处理／无法确认','不计处理成功','保留实际原因'),next_label='已处理'),
 n('触发器计次，DT 沿原链路执行','处理次数和端侧播放结果分开记录','账号切换后旧建议失效，反馈归原记录')])
print('Generated 7 current-chain diagrams')
