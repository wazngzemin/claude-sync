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

body = []
body += [panel(70, 185, 480, "对话与上下文", ["当前请求、近期语境", "账号与当前交互对象"])]
body += [panel(590, 185, 480, "状态与业务事件", ["注册、使用、同步完成", "实际可取得的事实"])]
body += [panel(1110, 185, 480, "工具与执行反馈", ["前置条件不足、读写结果", "DT 处理与端侧结果"])]
for cx in (310, 830, 1350):
    body.append(arrow(cx, 325, cx, 402))
body.append(rect(70, 410, 1520, 244, LIME))
body.append(txt(104, 458, "新手引导 Agent", 34, 700))
for xx, title, detail in (
    (104, "场景选择", "识别哪项能力有介绍机会"),
    (480, "账号功能档案", "检查告知、拒绝与使用事实"),
    (856, "能力编排", "只调用此场景需要的模块"),
    (1232, "结果追踪", "关联本次处理与最终结果"),
):
    body.append(txt(xx, 520, title, 28, 650))
    # wrap longer details deliberately
    detail_lines = {"识别哪项能力有介绍机会":["识别相关场景","与资格信息"],
                    "检查告知、拒绝与使用事实":["检查告知、拒绝","与使用事实"],
                    "只调用此场景需要的模块":["按需复用","已有能力"],
                    "关联本次处理与最终结果":["记录阶段结果","按规则结束"]}[detail]
    for j, line in enumerate(detail_lines):
        body.append(txt(xx, 565 + j*33, line, 25))
for cx in (310, 830, 1350):
    body.append(arrow(cx, 658, cx, 730, "按需调用"))
body += [panel(70, 740, 480, "触发器", ["注册与持续监测条件", "复用频次与事件判断"])]
body += [panel(590, 740, 480, "上下文／身份／记忆", ["提供所需信息与真实结果", "输入来源及接线需确认"])]
body += [panel(1110, 740, 480, "任务等已有能力", ["仅在场景确有需要时复用", "不把所有预设任务迁入"])]
body.append(txt(70, 940, "执行主链路", 30, 700))
body += [panel(70, 980, 480, "Agent 发出引导建议", ["说明目的、依据、关联请求", "用户原任务继续保留"])]
body += [panel(590, 980, 480, "DT 决策与工具执行", ["生成回复或 action_list", "消费 tool_feedback 后再判断"])]
body += [panel(1110, 980, 480, "端侧交互", ["沿用既有播报／卡片链路", "注册等动作需用户同意"])]
body += [arrow(554,1048,584,1048), arrow(1074,1048,1104,1048)]
body.append(rect(70, 1180, 1520, 128))
body.append(txt(100, 1224, "结果返回 Agent", 29, 650))
body.append(txt(100, 1267, "DT 采用、播报开始／结束、用户拒绝、工具业务成功分别记录，不能用一个“完成”代替。", 27))
body.append(arrow(830,1120,830,1174))
save("01-agent-architecture", "新手引导 Agent 业务架构", "统一承接业务；按需复用能力；用户交互经 DT 主链路完成", "".join(body), 1370)

flow("02-runtime-flow", "从输入到结果的运行主链路", "主干从上往下读；未满足与未知分支在右侧结束本次主动引导", [
 n("接收相关输入", "用户对话、工具反馈或业务事件", "带上来源、账号、当前请求和场景版本"),
 n("账号与当前对象能否准确关联？", "区分登录账号、当前乘客与车辆", "不把无记录当成从未使用", decision=True,
   branch=b("无法归属", "退出本次主动引导", "原请求照常处理"), next_label="可以"),
 n("该功能是否仍有引导资格？", "核对使用、拒绝、次数、启停与有效范围", "按账号读取功能档案", decision=True,
   branch=b("无需引导／无法判断", "不生成建议", "保留明确原因"), next_label="有资格"),
 n("选择场景所需判断", "语义场景判断相关性，必要时取近期语境", "事件或工具入口不强制重复语义判断"),
 n("本场景组合条件是否全部成立？", "检查身份、同步、功能可用性等真实条件", "同一功能的并发入口在此去重", decision=True,
   branch=b("条件未满足／未知", "结束本次机会", "不扣成功次数"), next_label="成立"),
 n("向 DT 发出可关联的引导建议", "携带引导目的、依据与动作限制", "与原用户请求一并处理"),
 n("是否赶上 DT 可接受的处理窗口？", "实际交接机制需与 DT 确认", "不假定能够随时重启推理", decision=True,
   branch=b("未采用／已经过时", "结束旧建议", "不跨话题补播"), next_label="采用"),
 n("DT 执行并产生真实结果", "回复、action_list、tool_feedback、端侧交互", "功能操作按真实成功与失败处理"),
 n("Agent 更新阶段记录与账号档案", "只在评审选定的阶段计次", "达到结束条件后停止该引导实例"),
])

flow("03-identity-case", "Case 1  身份感知补引导", "原表第 2 行的主动补引导；工具前置不足的必要处理另按正文说明", [
 n("用户聊到称呼、偏好或希望被记住", "例如：以后叫我小王，我喜欢吃川菜", "先识别当前说话人与账号的关联"),
 n("原场景的身份资格是否可确认？", "有提车时跳过注册记录，当前仍未注册", "不能用未注册代替跳过注册", decision=True,
   branch=b("不满足／缺少证据", "不命中原表补引导", "必要工具处理继续"), next_label="成立"),
 n("该账号是否仍需身份能力引导？", "检查实际使用、告知次数与明确拒绝", "按功能档案抑制重复", decision=True,
   branch=b("无需引导／未知", "不再自动介绍", "原用户诉求继续"), next_label="需要"),
 n("Agent 给 DT 身份引导指引", "结合当前诉求介绍注册作用", "提供适用的轻量卡片内容"),
 n("DT 回应用户并询问是否愿意注册", "说明需要看哪里、说什么", "交互步骤以车型注册能力为准"),
 n("用户是否明确同意？", "同意后再进入身份注册", "主动请求注册也走正常功能流程", decision=True,
   branch=b("拒绝／稍后", "停止当轮注册", "记录拒绝的范围", label="否"), next_label="同意"),
 n("DT 调用身份注册能力", "工具返回真实 tool_feedback", "成功前不声称已经注册"),
 n("注册是否成功？", "依据工具业务结果判断", "失败不等于已经使用", decision=True,
   branch=b("失败／结果未知", "如实回应并记录", "不连续自动重试"), next_label="成功"),
 n("Agent 分别记录告知与注册结果", "成功使用后停止重复补注册引导", "账号或乘客切换时旧实例失效"),
])

flow("04-memory-guidance", "Case 2  记忆能力引导", "介绍怎样使用记忆；与检索旧记忆生成开箱问候分别处理", [
 n("用户说出个人信息、偏好或记忆诉求", "先区分当前说话人与信息指向", "不把转述他人的偏好写入当前账号"),
 n("是否属于明确的记忆读写请求？", "例如：记住我喜欢吃川菜", "明确请求优先执行，不反复介绍功能", decision=True,
   branch=b("DT 正常执行读写", "按真实工具反馈回应", "成功后更新使用事实", label="是"), next_label="否"),
 n("是否属于适合介绍记忆的相关话题？", "结合当前表达与必要的近期语境", "不先强制检索一条已有记忆", decision=True,
   branch=b("无关／语境不足", "不插入能力介绍", "不自动保存信息"), next_label="相关"),
 n("该账号是否仍有引导资格？", "检查使用、告知、拒绝与次数", "检索为空不能证明首次使用", decision=True,
   branch=b("无需引导／未知", "正常对话继续", "不计一次告知"), next_label="有资格"),
 n("Agent 建议 DT 介绍记忆能力", "用当前场景说明能解决什么问题", "询问是否希望记住这项信息"),
 n("用户是否同意进行记忆操作？", "按照记忆模块的身份与授权要求处理", "不把随口表达自动当授权", decision=True,
   branch=b("拒绝／依赖不足", "不写入记忆", "记录真实处理结果", label="否"), next_label="同意"),
 n("DT 调用记忆能力并接收反馈", "工具成功才说明已经记住", "超时与无结果分别处理"),
 n("Agent 分开记录告知与业务成功", "未实际说出的其他引导不扣次数", "同轮与身份引导冲突时只保留适当一段"),
])

flow("05-memory-sync", "Case 3  记忆同步完成后问候", "准确触发点是同步完成；FaceID 可以跳过；记忆由 DT 检索", [
 n("用户在开箱流程选择记忆授权与同步", "按授权范围建立本次同步和问候关联", "不授权则不创建这项问候实例"),
 n("是否收到真实的同步完成事件？", "激活完成不代表记忆同步完成", "事件协议及接入可用性需确认", decision=True,
   branch=b("同步中／失败／未知", "等待准确结果", "不提前个性化问候"), next_label="完成"),
 n("事件是否属于当前账号与本次同步？", "核对账号、批次、重复与有效范围", "不额外要求完成 FaceID 注册", decision=True,
   branch=b("旧事件／无法归属", "不影响当前账号", "重复事件不再处理"), next_label="属于"),
 n("Agent 核对次数与当前交互条件", "必要时由触发器返回条件达成", "尚未实际执行时不提前记为已告知"),
 n("Agent 建议 DT 基于真实记忆问候", "事件说明记忆可检索", "不要求触发器承载记忆正文"),
 n("DT 检索并取得可用记忆了吗？", "由真实 tool_feedback 确定", "已同步不代表本次一定检索到", decision=True,
   branch=b("无结果／检索失败", "不编造个性化事实", "普通问候另按规则"), next_label="取得"),
 n("DT 选取一到两个合适的记忆点", "基于授权内容与当前乘员场合组织问候", "不编造天数、餐厅或偏好"),
 n("沿既有主链路播报", "实际采用、开口、完成与中断分别回传", "时机已过则不在后续无关会话补播"),
 n("Agent 更新本次结果并按规则收尾", "同一执行阶段只计一次", "账号切换或失效后停止旧实例"),
])

flow("06-feedback-loop", "执行结果如何回到新手引导业务", "记录走到哪一步，再按唯一口径计次；各阶段不能互相代填", [
 n("Agent 发出本次引导建议", "关联账号、场景版本与原请求", "此时仅证明建议已交接"),
 n("DT 是否采用并进入对应推理？", "回传必须能关联到这次引导", "这一步只证明系统开始处理", decision=True,
   branch=b("未采用／状态未知", "不写已触达", "不立即重复下发"), next_label="采用"),
 n("端侧是否开始播报？", "需要真实可用的播报开始信号", "不能用 DT 已推理补填", decision=True,
   branch=b("未开口／回传缺失", "记录未触达或未知", "按已定口径处理"), next_label="开口"),
 n("记录播报完成或中断", "只记录实际观察到的结局", "不推断用户已经理解或使用"),
 n("如有功能操作，记录真实业务结果", "注册、记忆读写等分别接收工具反馈", "拒绝、失败与成功保持区别"),
 n("Agent 按唯一计次阶段更新记录", "重复或乱序回传不重复扣次数", "只更新属于该账号的实例"),
 n("是否达到结束条件？", "次数、明确停止、停用或有效期结束", "具体口径由场景配置确定", decision=True,
   branch=b("等待新的有效机会", "保留未完成状态", "不自动无限重试", label="否"), next_label="达到"),
 n("结束当前引导实例", "清理相关监听与待执行建议", "后续用户主动请求仍正常执行"),
])

flow("07-lightweight-option", "晚间轻量方案的独立链路", "语义匹配与组合条件分开；不固定再加一个二次校验模型", [
 n("后台配置场景与候选描述", "同步场景条件、语义描述和示例", "功能档案如何接入仍需明确"),
 n("用户 query 到达语义入口", "输入范围和上下文接入需确认", "不把每句话变成一个新注册任务"),
 n("单模型匹配到相关候选场景吗？", "模型只判断相关性", "不负责猜测历史首次或使用次数", decision=True,
   branch=b("无关／未知", "退出本次引导", "正常对话继续"), next_label="匹配"),
 n("触发器组合条件是否共同满足？", "检查身份、首次／次数、端状态等", "各项需要真实可取得的信息", decision=True,
   branch=b("不满足／信息缺失", "不向 DT 下发", "不扣成功次数"), next_label="满足"),
 n("建议能否赶上 DT 当前处理窗口？", "触发器发出已配置 advice", "保留原用户 query", decision=True,
   branch=b("迟到／无法交接", "结束旧机会", "不跨话题补播"), next_label="可以"),
 n("DT 结合原请求执行与回复", "按指引完成引导或必要工具操作", "执行仍走现有主链路"),
 n("下游回传可关联的处理阶段", "晚间讨论至少关注 DT 是否开始推理", "触达信号与功能成功另记"),
 n("触发器按确认口径计次", "达到次数后结束该配置实例", "不能与 Agent 另有一套冲突次数"),
])

print(f"Generated {len(list(OUT.glob('*.svg')))} SVG diagrams")

