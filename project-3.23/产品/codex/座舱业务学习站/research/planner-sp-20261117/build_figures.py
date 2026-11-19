"""Build SP diagrams one at a time; reuse the preceding chapters' SVG style."""
from pathlib import Path
import importlib.util
import json
import re
import sys

ROOT = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('t_figures', ROOT.parent / 'T-v2/build_figures.py')
base = importlib.util.module_from_spec(spec)
spec.loader.exec_module(base)
base.ROOT = ROOT
base.CSS = re.search(r'<style>(.*?)</style>', (ROOT.parent / 'F-v2/figures/f2-layers.svg').read_text(), re.S).group(1)
Figure = base.Figure


def overview():
    f = Figure('sp2-overview', 'Planner 这一轮怎样读系统提示词', '本轮输入带来新问题或变化；固定部分和每轮注入一起约束四项输出。', 1200, 900)
    f.text(32, 122, '本轮发生了什么', 'label')
    f.text(340, 108, '系统提示词', 'label')
    f.text(888, 244, '这一轮交出什么', 'label')
    f.node('input', 32, 242, 250, 206, '本轮输入 · 4 类', [
        '用户说话', 'Advisor 建议', '工具回执', '事件：已经发生的变化'], 'local')
    f.node('fixed', 340, 126, 490, 242, '固定部分 · 定规矩、教做法', [
        '身份与输入说明；输出格式；6 条注意事项',
        '28 个固定工具；24 个参考示例块',
        '49 条表情；能力边界与用车安全',
        '其他知识；唤醒词；聊天风格',
        '安全加固插槽嵌在其他知识段'], 'cloud')
    f.node('dynamic', 340, 472, 490, 216, '尾部 · 每轮注入的 11 个插槽', [
        '成员身份、相关记忆、用户画像',
        '车端状态、近期事件历史、日期节日天气',
        '专业知识、场景示例、基础车辆问答',
        '当前页可操作项、临时工具',
        '事件历史 ≠ 本轮事件'], 'cloud')
    f.text(438, 408, 'Planner 按本轮条件判断', 'node-title')
    f.node('output', 888, 272, 280, 176, '四项输出', [
        '说不说；说什么', '表情：可以为空', '动作列表：可以为空'], 'decision')
    f.node('execute', 888, 520, 280, 106, '工具执行', ['有动作才执行', '返回实际结果'], 'local')
    f.arrow((282, 430), (888, 430))
    f.arrow((585, 368), (585, 386))
    f.arrow((585, 472), (585, 434))
    f.arrow((1028, 448), (1028, 520))
    f.text(1044, 488, '动作', 'label')
    f.arrow((1028, 626), (1028, 740), (157, 740), (157, 448))
    f.text(372, 726, '工具回执作为下一轮输入回来', 'label')
    f.footer(792, '固定部分定规矩，注入部分给现场，示例教做法。', [
        ('local', '蓝：输入、执行与回执'), ('cloud', '绿：提示词内容'), ('decision', '黄：本轮输出')])
    f.save()


def structure():
    f = Figure('sp2-structure', '这一版系统提示词，示例占了一半', '赛力斯 ME7 · 2026-11-17 · 共 75,661 个非空白字符；占比按字符数计算，不是 token 数。', 1200, 850)
    f.text(32, 126, '各部分占比 · 分段宽度按实际字符数绘制', 'label')
    values = [39999, 14368, 9882, 3704, 3574, 2111, 2023]
    names = ['参考示例', '工具定义', '能力边界', '其他知识', '表情', '聊天风格', '其余']
    x = 32
    centers = []
    for i, (v, name) in enumerate(zip(values, names)):
        w = 1136 * v / 75661
        color = 'cloud' if i == 0 else 'neutral'
        f.parts.append(f'<g data-node="true" id="sp2-structure-part-{i}"><rect class="v56-{color}" x="{x:.5f}" y="174" width="{w:.5f}" height="86" rx="8" stroke-width="1.6"/></g>')
        centers.append(x + w / 2)
        if i < 3:
            f.text(x + 14, 207, name, 'node-title')
            f.text(x + 14, 235, f'{v / 75661 * 100:.2f}%', 'node-sub')
        x += w
    for i in range(3, 7):
        cy = 300 + (i - 3) * 30
        cx = centers[i]
        f.parts.append(f'<path class="v56-rule" d="M {cx:.5f} 260 L {cx:.5f} {cy - 5} L 944 {cy - 5}"/>')
        f.text(740, cy, f'{names[i]}  {values[i] / 75661 * 100:.2f}%', 'subtitle')
    f.text(32, 306, '24 个参考示例块 · 39,999 个字符', 'node-title')
    f.text(32, 338, '其余：身份与输入、输出、注意事项、唤醒词和动态尾部', 'subtitle')
    f.text(32, 404, '动态插槽放在哪里 · 共 12 个', 'label')
    f.node('tail', 32, 430, 704, 246, '尾部 · 11 个插槽', [
        '成员身份 / 相关记忆 / 用户画像',
        '车端状态 / 近期事件历史 / 日期节日天气',
        '专业知识 / 场景示例 / 基础车辆问答',
        '当前页可操作项 / 临时工具',
        '固定内容在前，变化内容主要放尾部'], 'local')
    f.node('embedded', 784, 430, 384, 246, '其他知识段 · 1 个插槽', [
        '安全加固', '嵌在固定章节中', '不在动态尾部', '插槽存在 ≠ 本轮已有注入值'], 'local')
    f.footer(736, '示例占一半，模型主要跟着示例学。', [
        ('cloud', '绿：参考示例'), ('neutral', '灰：其他内容部分'), ('local', '蓝：动态插槽的位置')])
    f.save()


def navi():
    f = Figure('sp2-navi', '一句导航相关的话，交给谁', '这一版先按诉求选工具；涉及智驾时整段交给智驾，导航域内同一轮只发一个工具。', 1200, 1170)
    f.text(40, 122, '用户怎么说', 'label')
    f.text(610, 122, '交给哪个工具 · 为什么', 'label')
    rows = [
        ('“导航去公司” / “少收费”', '路线规划', ['目的地、途经点、固定路线偏好', '选路线后自动导航']),
        ('“别走中环”', '高德复杂规划', ['指定走或避开某条具体道路', '也处理“沿河”“风景好”等路线风格']),
        ('“地图放大”', '导航基础控制', ['地图显示、视角、播报', '收藏、家与公司地址、导航设置']),
        ('“前面堵多少”', '高德导航交互', ['导航中的路况与路线原因问询', '也承接导航中的路线动作']),
        ('“沿途找花店”', '地点搜索', ['沿途搜必须已经在导航', '多个结果先让用户选，再导航']),
        ('“智驾去公司，经幼儿园接人”', '智驾', ['涉及智驾：目的地、途经动作整段交入', '不拆给纯导航工具'])]
    for i, (example, title, lines) in enumerate(rows):
        y = 146 + 124 * i
        f.text(40, y + 58, example, 'node-title')
        f.arrow((516, y + 54), (610, y + 54))
        f.node('tool-' + str(i), 610, y, 558, 104, title, lines, 'cloud')
    f.node('unify', 40, 920, 1128, 108, '三处归属需统一', [
        '开始 / 结束导航；路口转向；模糊目的地',
        '先统一规则与示例，再固定工具选择'], 'decision', True)
    f.text(40, 1068, '这几个工具同一轮只能发一个，必须串行。', 'risk')
    f.footer(1086, '先分清诉求，再看是否满足工具的前提条件。', [
        ('cloud', '绿：已写明的工具分工'), ('decision', '黄 + 虚线：归属需统一'), ('reject', '红字：同轮串行约束')])
    f.save()


def safety():
    f = Figure('sp2-safety', '用户说了，也不能直接照做的条件', '先看说话人、车速、挡位和其他条件；不执行时说明原因，不能假报已经办成。', 1200, 930)
    f.node('speaker', 32, 142, 548, 258, '谁在说 · 权限先过关', [
        '驾驶类、底盘动力转向、通讯：仅主驾',
        '非主驾不能控制主驾车门',
        '行车中：任何人都不能移动主驾座椅',
        '“前排后挪”：跳过主驾，只动副驾并说明'], 'reject')
    f.node('speed', 620, 142, 548, 258, '车在动吗 · 阈值都是“超过”', [
        '> 3 公里/小时：吸顶屏只能左右调',
        '> 30 公里/小时：不能语音关驾驶员监测',
        '也不能语音关大灯',
        '> 80 公里/小时：车窗不全开，改通风'], 'reject')
    f.node('gear', 32, 450, 548, 258, '挡位与驻车 · 不能只看可逆', [
        'R 挡：不能调多媒体、来电铃声、K 歌人声音量',
        '前后备箱、充电口盖：主驾且驻车才可控',
        'P 挡：才允许折叠后视镜'], 'reject')
    f.node('other', 620, 450, 548, 258, '其他条件 · 组合条件都要满足', [
        '儿童锁开：非主驾不能控制后门',
        '夜间行车：不能语音关车外灯',
        '前排影院：后排无人且驻车'], 'reject')
    f.text(32, 764, '这些限制先于“可逆、低风险就直接做”的原则。', 'label')
    f.footer(812, '先做后确认，不能绕过这些规则。', [
        ('reject', '红框：明确的用车限制')])
    f.save()


def review():
    f = Figure('sp2-review', '评审这一版，先看模型会学到什么错', '把问题分成五组：一处写错，可能让模型选错工具、填错参数，或重复执行已经成功的动作。', 1200, 1020)
    f.node('conflict', 32, 142, 548, 218, '01 · 规则互相打架', [
        '任务规则：建议、事件、回执不建改任务',
        '示例却让建议触发创建任务',
        '学偏：收到建议就自行建任务',
        '需统一：哪些输入可以发起任务'], 'decision', True)
    f.node('mapping', 620, 142, 548, 218, '02 · 映射写错', [
        '“入弯灵活度调小”',
        '动作却写成“动能回收强度调小”',
        '学偏：把用户的操作对象换成另一项'], 'reject')
    f.node('names', 32, 402, 548, 218, '03 · 名字对不上', [
        '工具定义：task_agent',
        '示例调用：task_agent_update',
        '学偏：照搬不匹配的工具名'], 'reject')
    f.node('format', 620, 402, 548, 218, '04 · 格式错误', [
        '121 个输出块中，6 个 JSON 无法解析',
        '例如缺括号、中文逗号或中文引号',
        '学偏：生成接收方无法解析的输出'], 'reject')
    f.node('behavior', 32, 662, 1136, 190, '05 · 示例行为错', [
        '同一轮并行两个导航域工具 → 学偏：忽略串行限制',
        '添加途经点已经成功，又重复发一次 → 学偏：成功后仍重复执行',
        '逐轮核对：原调用、工具回执和下一步动作是否衔接'], 'reject')
    f.footer(902, '示例和规则不一致时，模型往往跟示例走，先修示例。', [
        ('decision', '黄 + 虚线：规则需统一'), ('reject', '红：具体错误及其行为影响')])
    f.save()


DRAW = {f.__name__: f for f in [overview, structure, navi, safety, review]}
if __name__ == '__main__':
    (ROOT / 'figures').mkdir(exist_ok=True)
    for name in sys.argv[1:] or DRAW:
        DRAW[name]()  # Finish saving this SVG and JSON before constructing the next figure.
