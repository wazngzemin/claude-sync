from pathlib import Path
from html import escape
import json
import re

ROOT = Path(__file__).resolve().parent
CSS = re.search(r'<style>(.*?)</style>', (ROOT.parent / 'T-v2/figures/t2-overview.svg').read_text(), re.S).group(1)


class Figure:
    def __init__(self, id, title, subtitle, h):
        self.id, self.title, self.subtitle, self.h = id, title, subtitle, h
        self.parts = []
        self.text(32, 44, title, 'title')
        self.text(32, 72, subtitle, 'subtitle')

    def text(self, x, y, s, cls='node-sub', anchor='start'):
        self.parts.append(f'<text class="v56-{cls}" x="{x}" y="{y}" text-anchor="{anchor}">{escape(s)}</text>')

    def node(self, id, x, y, w, h, title, lines, color='cloud', pending=False):
        self.parts.append(f'<g data-node="true" id="{self.id}-{id}"><rect class="v56-{color}{" v56-pending" if pending else ""}" x="{x}" y="{y}" width="{w}" height="{h}" rx="8" stroke-width="1.6"/>')
        self.text(x + 14, y + 28, title, 'node-title')
        for i, line in enumerate(lines):
            self.text(x + 14, y + 56 + i * 24, line)
        self.parts.append('</g>')

    def path(self, points, cls='arrow', arrow=False, pending=False):
        d = 'M ' + ' L '.join(f'{x} {y}' for x, y in points)
        marker = f' marker-end="url(#{self.id}-arr)"' if arrow else ''
        self.parts.append(f'<path class="v56-{cls}{" v56-pending" if pending else ""}" d="{d}"{marker}/>')

    def arrow(self, *points, pending=False):
        self.path(points, arrow=True, pending=pending)

    def dot(self, x, y, color='cloud', pending=False):
        self.parts.append(f'<circle class="v56-{color}{" v56-pending" if pending else ""}" cx="{x}" cy="{y}" r="8" stroke-width="1.6"/>')

    def footer(self, y, summary, legend):
        self.path([(32, y), (1168, y)], 'rule')
        self.text(32, y + 34, summary, 'node-title')
        for i, item in enumerate(legend):
            color, label, *pending = item
            x = 32 + i * 1136 / len(legend)
            cls = f'v56-{color}' + (' v56-pending' if pending and pending[0] else '')
            self.parts.append(f'<rect data-decoration="true" class="{cls}" x="{x}" y="{y+60}" width="18" height="18" rx="8" stroke-width="1.6"/>')
            self.text(x + 28, y + 74, label, 'subtitle')

    def save(self):
        svg = f'<svg xmlns="http://www.w3.org/2000/svg" class="v56-figure" id="{self.id}" width="1200" height="{self.h}" viewBox="0 0 1200 {self.h}" role="img" aria-labelledby="{self.id}-title {self.id}-desc">\n'
        svg += f'<title id="{self.id}-title">{escape(self.title)}</title><desc id="{self.id}-desc">{escape(self.subtitle)}</desc>\n<style>{CSS}</style>\n'
        svg += f'<defs><marker id="{self.id}-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" class="v56-arrow"/></marker></defs>\n'
        svg += '\n'.join(self.parts) + '\n</svg>\n'
        target = ROOT / 'figures'
        target.mkdir(exist_ok=True)
        (target / f'{self.id}.svg').write_text(svg)
        (target / f'{self.id}.json').write_text(json.dumps(dict(id=self.id, title=self.title, subtitle=self.subtitle), ensure_ascii=False, indent=2) + '\n')
        print('saved', self.id, flush=True)


def overview():
    f = Figure('g2-overview', '一条规则怎样等到条件成立，再交回 Planner', '主驾说“续航低于 100 公里的时候提醒我充电”；从任务服务登记规则这一刻开始看。', 930)
    rows = [
        ('register', '01 · 任务服务登记', ['等待“续航 < 100 公里”', '条件任务来自 T 章'], 'cloud'),
        ('save', '02 · 触发器保存规则', ['属于这个账号 × 这辆车', '订阅剩余续航信号'], 'cloud'),
        ('report', '03 · 车端上报续航', ['101 公里 → 99 公里', '每次上报带来一次检查机会'], 'local'),
        ('wake', '04 · 叫醒这条规则', ['按渠道和信号挑出相关场景', '叫醒不代表已经命中'], 'cloud'),
        ('judge', '05 · 判断全部条件', ['当前值条件 / 变化条件', '成立、不成立、未知分开记'], 'decision'),
        ('limit', '06 · 频控放行吗', ['检查次数与最小执行间隔', '这次还能不能发出去'], 'decision'),
        ('callback', '07 · 回调任务服务', ['带任务编号、回调编号', '按登记的出口交出去'], 'cloud'),
        ('run', '08 · 任务服务生成一次运行', ['经车端送回 Planner', '后续执行接回 T 章'], 'cloud'),
        ('planner', '09 · Planner 决定怎么提醒', ['“续航不到 100 公里了……”', '结合当时情况说话、执行'], 'local'),
    ]
    for i, (id, title, lines, color) in enumerate(rows):
        row, col = divmod(i, 3)
        if row % 2:
            col = 2 - col
        x, y = 40 + col * 395, 150 + row * 200
        f.node(id, x, y, 330, 132, title, lines, color)
        if i % 3:
            f.arrow(*([(x + 395, y + 66), (x + 330, y + 66)] if row % 2 else [(x - 65, y + 66), (x, y + 66)]))
        elif i:
            f.arrow((x + 165, y - 68), (x + 165, y))
    f.path([(40, 727), (1160, 727)], 'rule')
    f.text(40, 755, '每一步都记账：命中、拦下、未知、出口接收；下游结果继续回写。', 'label')
    f.footer(792, '触发器等条件、按登记交出去；说什么、做什么归 Planner。', [('local', '蓝：车端输入与最终表达'), ('cloud', '绿：规则保存、交接与记录'), ('decision', '黄：判断与放行')])
    f.save()


def position():
    f = Figure('g2-position', '同一个触发器，在三条链路里等不同的条件', '用户任务回到任务服务；业务预设按出口派发；语义条件把预配建议并入本轮对话。', 960)
    f.text(40, 115, '用户任务 · T 章', 'label')
    f.node('user', 40, 130, 190, 110, '用户说出以后要办的事', ['Planner 理解诉求', '交给任务服务'], 'local')
    f.node('task', 260, 130, 190, 110, '任务服务', ['保存任务', '登记等待规则'])
    f.arrow((230, 185), (260, 185))
    f.arrow((450, 185), (520, 185), (520, 300))
    f.text(40, 300, '业务预设 · 产品预先配置', 'label')
    f.node('vehicle', 40, 320, 360, 110, '车况变化', ['例如：座位从空变为有人', '叫醒“上车问候”场景'], 'local')
    f.arrow((400, 375), (490, 375))
    f.node('trigger', 490, 300, 210, 140, '触发器', ['等条件、判断、过频控', '按登记的出口交接', '三条链路共用这个服务'])
    f.node('callback', 740, 130, 190, 110, '回调任务服务', ['生成一次运行', '再送回 Planner'])
    f.arrow((650, 300), (650, 270), (835, 270), (835, 240))
    f.node('advisor', 740, 320, 190, 110, '静态 Advisor', ['决定是否生成建议', '可以正常静默'], 'decision')
    f.arrow((700, 350), (740, 350))
    f.node('planner', 950, 300, 210, 140, 'Planner', ['结合当时情况', '决定说什么、做什么'], 'decision')
    f.arrow((930, 185), (1055, 185), (1055, 300))
    f.arrow((930, 375), (950, 375))
    f.node('flash', 740, 520, 420, 100, '闪念通知卡', ['另一出口：普通通知卡，不进 Planner、不播语音'], 'local', True)
    f.arrow((650, 440), (650, 570), (740, 570), pending=True)
    f.text(40, 550, '语义条件 · 新方向，尚未验收', 'label')
    f.node('semantic', 40, 570, 360, 130, '用户说完话 → 快速场景判断', ['从后台预设场景里选出命中项', '触发器取得相应的预配建议', '详细流程见语义条件图'], 'local', True)
    f.arrow((400, 635), (460, 635), (460, 420), (490, 420), pending=True)
    f.arrow((550, 440), (550, 750), (1180, 750), (1180, 420), (1160, 420), pending=True)
    f.text(580, 732, '预配建议 + 本轮话 + 上下文，一起交给 Planner', 'label')
    f.text(40, 802, '虚线：语义条件新方向，以及闪念改造设计；两者都不能据此认定已上线。', 'subtitle')
    f.footer(835, '触发器的位置相同，交给谁取决于登记的出口。', [('local', '蓝：车上输入与展示'), ('cloud', '绿：任务服务与触发器'), ('decision', '黄：建议与当下决策')])
    f.save()


def condition():
    f = Figure('g2-condition', '冷却只管间隔，一轮只提醒一次还要重新布防', '同一条电量曲线：① 当前值反复满足；② 只在跌破时提醒；③ 恢复到不满足以后才恢复提醒资格。', 1050)
    f.text(40, 131, '电量变化示意（纵轴不按比例）', 'label')
    f.text(320, 131, '同一次上报时刻，分别观察三种规则', 'label')
    xs = [350, 470, 590, 710, 830, 950, 1070]
    ys = [300, 350, 350, 350, 165, 270, 350]
    f.path([(320, 150), (320, 410), (1140, 410)], 'rule')
    f.path([(320, 325), (1140, 325)], 'arrow', pending=True)
    f.text(196, 330, '阈值：30%', 'label')
    f.path(list(zip(xs, ys)), 'arrow')
    for x, y, s in zip(xs, ys, ['31%', '29%', '29%', '29%', '55%', '35%', '29%']):
        f.dot(x, y, 'local')
        f.text(x, y - 20, s, 'node-title', 'middle')
    for x, s in zip(xs, ['起点', '30 秒', '60 秒', '90 秒', '充电后', '再次下降', '再次跌破']):
        f.text(x, 441, s, 'subtitle', 'middle')
    f.text(350, 478, '低电量持续成立', 'risk')
    f.text(830, 478, '恢复到不满足', 'label', 'middle')
    f.node('current', 40, 510, 260, 110, '① 当前值 + 30 秒冷却', ['每次上报仍低于 30%', '且间隔已过，就可能再发'], 'reject')
    f.node('edge', 40, 670, 260, 110, '② 跌破阈值时只发一次', ['从不满足变为满足', '已对齐方向，尚未验收'], 'cloud', True)
    f.node('rearm', 40, 830, 260, 110, '③ 恢复后重新布防', ['电量回到 ≥30% 后', '下一次跌破才可再提醒'], 'decision', True)
    for y in [565, 725, 885]:
        f.path([(320, y), (1140, y)], 'rule')
    for x in [470, 590, 710, 1070]:
        f.dot(x, 565, 'reject')
    f.text(470, 605, '一直低于 30% 时反复打扰', 'risk')
    for x in [470, 1070]:
        f.dot(x, 725, 'cloud', True)
        f.text(x, 762, '提醒', 'subtitle', 'middle')
    f.text(590, 706, '持续满足，不再发', 'label')
    f.dot(830, 885, 'decision', True)
    f.dot(1070, 885, 'cloud', True)
    f.text(830, 922, '恢复资格', 'subtitle', 'middle')
    f.text(1070, 922, '再提醒', 'subtitle', 'middle')
    f.arrow((846, 885), (1054, 885), pending=True)
    f.footer(958, '“变更为”比较新值与设定值；跌破阈值的一次提醒属于边沿触发方向。', [('local', '蓝：实际电量'), ('reject', '红：重复打扰'), ('cloud', '绿虚线：边沿方向，未验收', True), ('decision', '黄虚线：重新布防', True)])
    f.save()


def wake():
    f = Figure('g2-wake', '信号先叫醒相关规则，再判断全部条件', '这次上报只带续航；其他条件要用当前值补齐，叫醒并不代表命中。', 900)
    rows = [
        ('report', '01 · 车端上报', ['渠道 + 车辆 + 续航', '例如：101 公里 → 99 公里'], 'local'),
        ('filter', '02 · 按渠道和信号粗筛', ['挑出订阅续航的相关场景', '不把所有场景都算一遍'], 'cloud'),
        ('wake', '03 · 叫醒主例规则', ['进入本次检查', '此时尚未判定条件成立'], 'cloud'),
        ('fetch', '04 · 补齐其他当前值', ['条件里的信号不同时到', '账号开关只查值、不叫醒'], 'cloud'),
        ('judge', '05 · 判断全部条件', ['核对续航和其他条件', '不能只看这次上报的那一项'], 'decision'),
        ('result', '06 · 分开记录结果', ['成立 / 不成立 / 未知', '只有成立才继续检查频控'], 'decision'),
    ]
    for i, (id, title, lines, color) in enumerate(rows):
        row, col = divmod(i, 3)
        if row % 2:
            col = 2 - col
        x, y = 40 + col * 395, 170 + row * 230
        f.node(id, x, y, 330, 140, title, lines, color)
        if i % 3:
            f.arrow(*([(x + 395, y + 70), (x + 330, y + 70)] if row % 2 else [(x - 65, y + 70), (x, y + 70)]))
        elif i:
            f.arrow((x + 165, y - 90), (x + 165, y))
    f.text(40, 610, '较新叫醒设计', 'node-title')
    f.text(40, 646, '有变化条件：只被变化信号叫醒；没有变化条件：被全部条件信号叫醒。')
    f.text(40, 676, '有视觉节点：另外订阅视觉字段；叫醒以后仍判断全部条件。')
    f.text(40, 717, '上报带旧值：单信号场景可少查一次车况；几个条件不会保证同时上报。', 'label')
    f.footer(766, '叫醒选错会漏触：挂 D 挡、识别儿童的两种先后顺序都要测。', [('local', '蓝：车端输入'), ('cloud', '绿：筛选、叫醒与补值'), ('decision', '黄：判断结果')])
    f.save()


def judge():
    f = Figure('g2-judge', '三种判断各回答一个问题，失败原因分开记', '规则比较看结构值；判断图组织依赖；视觉语义判断读这一次观察文字。', 970)
    f.node('rule', 40, 145, 350, 350, '规则比较：现在满足吗', ['输入：结构化的当前值或变化', '例如：续航 99 公里 < 100 公里', '输出：是 / 否', '规则引擎做确定的比较', '', '条件组之间可用且、或', '不支持任意趋势或地理围栏'], 'cloud')
    f.node('graph', 425, 145, 350, 350, '判断图：最后能通过吗', ['输入：多个条件与视觉判断节点', '节点内条件是且；上游可且或', '每张图只看一个终点', '终点：通过 / 不通过 / 未知', '', '或放行后，其他分支不取消', '改造设计，尚未验收'], 'decision', True)
    f.node('visual', 810, 145, 350, 350, '视觉语义：这个目标达成吗', ['输入：一份观察文字 + 一个目标', '输出：达成 / 未达成 / 无法判断', '附不超过 15 个字的依据', '不看图，不跨帧，不输出置信度', '', '未达成：也包括证据不足', '不决定回调、提醒或删除'], 'local')
    f.text(40, 548, '三种“没成立”要分开记，不能全部写成“未命中”', 'node-title')
    f.node('no', 40, 580, 350, 170, '明确不满足', ['值拿到了，但条件为否', '例如：续航 120 公里', '视觉证据不足也属于未达成'], 'reject')
    f.node('unknown', 425, 580, 350, 170, '未知', ['缺输入、查询失败', '模型失败、超时', '不能拿通过节点数代替终点结果'], 'neutral')
    f.node('outside', 810, 580, 350, 170, '无法判断', ['目标超出视觉可判断的范围', '例如：仅凭面色判断是否发烧', '这不是“目标已经明确不成立”'], 'decision')
    f.text(40, 799, '视觉并发：首个达成后封住场景，后面不再启动推理和动作，等任务服务删除。', 'label')
    f.footer(845, '先区分是哪一层的结果，再决定补输入、改条件，还是调整目标。', [('cloud', '绿：确定比较'), ('local', '蓝：观察文字判断'), ('decision', '黄：汇合与能力边界'), ('reject', '红：明确不满足'), ('neutral', '灰：缺输入或失败')])
    f.save()


def exits():
    f = Figure('g2-exits', '五种出口，五种需要核对的成功结果', '条件成立、频控放行，只说明可以交出去；出口接收与用户真正收到，要分层核对。', 1130)
    f.node('trigger', 40, 390, 220, 140, '触发器放行', ['条件成立 + 频控通过', '按登记关系选择出口', '自己不说话、不控车'])
    f.node('task', 350, 120, 810, 110, '回调任务服务', ['成功＝任务服务接收；带任务编号、回调编号', '后面生成一次运行、回到 Planner，接 T 章'])
    f.node('advisor', 350, 270, 810, 150, '静态 Advisor', ['出口接收后，继续看是否出了建议；没建议可以是正常静默', '建议下发前，再查登录账号一致、对话和播报已经结束', '也可能被新请求替换；“命中”与“最终推送”是两道门'], 'decision')
    f.node('event', 350, 460, 810, 110, '事件日志', ['成功＝事件服务入库；通知订阅方另算', '只有配置了“生成事件日志”动作，命中后才生成'])
    f.node('third', 350, 610, 810, 110, '第三方回调', ['成功＝对方已经接收', '后面做没做到，继续看对方回执'])
    f.node('flash', 350, 760, 810, 110, '闪念通知卡', ['成功＝车端真实展示；不进 Planner、不播语音', '改造设计，展示结果由车端反馈'], 'local', True)
    f.path([(260, 460), (300, 460)], 'arrow')
    f.path([(300, 175), (300, 815)], 'arrow')
    for y in [175, 345, 515, 665, 815]:
        f.arrow((300, y), (350, y), pending=y == 815)
    f.text(40, 920, '涉及 Planner 的链路，结果还要继续往后核对；其他出口按各自业务回执判断。', 'label')
    for x, s in [(40, '出口接收'), (340, 'Planner 收到'), (640, '说出来 / 做到'), (950, '用户感知')]:
        f.text(x, 967, s, 'node-title')
    for x in [180, 500, 810]:
        f.arrow((x, 960), (x + 100, 960))
    f.footer(1000, '越往后，越需要下游回执；命中也不等于用户已经授权。', [('cloud', '绿：回调与事件记录'), ('decision', '黄：建议生成与下发检查'), ('local', '蓝虚线：通知卡改造设计', True)])
    f.save()


def semantic():
    f = Figure('g2-semantic', '引导机会，按账号在车端播完回调后才计次', '新方向，尚未验收：语义判断与上下文准备并行，交给 Planner 的是后台预配建议。', 1060)
    f.node('speech', 40, 160, 300, 140, '用户说完话，识别文字上报', ['“放点适合开车听的”', '准备判断是否引导 AI 电台'], 'local', True)
    f.node('model', 440, 160, 320, 170, '快速场景判断模型', ['本句话 + 前几轮对话', '只从本账号有资格的候选里选', '输出场景编号，不生成话术', '不命中则不加建议'], 'cloud', True)
    f.node('context', 440, 390, 320, 100, '上下文准备', ['与快速场景判断并行'], 'cloud', True)
    f.arrow((340, 230), (440, 230), pending=True)
    f.arrow((380, 230), (380, 440), (440, 440), pending=True)
    f.node('merge', 840, 160, 320, 190, '触发器命中 → 输入合并', ['取出后台预先配好的建议', '与本轮话、上下文一起交入', '复用输入管理，不另做打断', '触发编号一路传到车端'], 'cloud', True)
    f.arrow((760, 245), (840, 245), pending=True)
    f.arrow((760, 440), (800, 440), (800, 310), (840, 310), pending=True)
    f.node('planner', 840, 420, 320, 110, 'Planner 接收本轮输入', ['结合本轮诉求与引导建议', '组织这次表达'], 'decision', True)
    f.arrow((1000, 350), (1000, 420), pending=True)
    f.node('play', 840, 620, 320, 140, '车端播完这句话 → 上报', ['带本次触发编号', '播完结果上报仍在对齐', '尚未验收'], 'decision', True)
    f.arrow((1000, 530), (1000, 620), pending=True)
    f.node('count', 440, 620, 320, 170, '车机服务代理回调触发器', ['触发器按豆包账号读写次数', '播完后才用掉一次引导机会', '次数用完，在回调时移出候选', '同车换账号，重新获得引导资格'], 'cloud', True)
    f.arrow((840, 690), (760, 690), pending=True)
    f.arrow((600, 620), (600, 565), (790, 565), (790, 115), (600, 115), (600, 160), pending=True)
    f.text(40, 122, '移出后，下次只判断剩余候选', 'label')
    f.node('time', 40, 400, 300, 100, '生效时间：这次不做', ['与语义条件分开处理'], 'neutral', True)
    f.node('history', 40, 550, 300, 100, '工具使用历史：这次不做', ['“最近用没用过”不加入条件'], 'neutral', True)
    f.text(40, 850, '现有计次：调了动作就按车辆记一次；本图展示的新方向改为按账号、播完后回调计次。', 'label')
    f.text(40, 886, '虚线：新方向与接入安排尚未验收；约 300 毫秒是目标，候选增多后的耗时仍要实测。', 'subtitle')
    f.footer(930, '让用户真正听到一次，才消耗一次引导机会。', [('local', '蓝：用户话语'), ('cloud', '绿：已定做法，尚未验收', True), ('decision', '黄：表达与播完结果', True), ('neutral', '灰：这次不做', True)])
    f.save()


def debug():
    f = Figure('g2-debug', '该提醒没提醒、不该提醒却提醒了，从哪层查', '先锁定同一次触发，再从上往下找停在哪层；每层成功只代表这一层。', 1390)
    f.text(80, 121, '按同一次触发逐层核对', 'label')
    f.text(790, 121, '找谁：按职责协作', 'label')
    rows = [
        ('生效范围和开关', '渠道、车辆、车型、客户端版本；账号开关是否允许', '触发器 / 配置负责人', '范围不符、开关不符分开记', 'neutral'),
        ('规则登记、有效状态', '登记成功了吗；规则是有效、失效，还是已删除', '触发器 / 任务服务 T 章', '用户任务核对原任务与登记回执', 'cloud'),
        ('信号到没到', '车端是否真的上报；信号版本、单位、时间是否正确', '车端 / 信号负责人 B 章', '端云值与单位要能对应', 'local'),
        ('有没有叫醒', '上报的这个信号，会不会叫醒这条规则', '触发器', '两个信号的先后顺序都要测', 'cloud'),
        ('判断结果是什么', '明确不满足 / 未知 / 无法判断，要分开记', '触发器 / 视觉判断负责人', '补输入、改条件、改目标分别处理', 'decision'),
        ('有没有被频控拦下', '总次数、单日、单次上电周期、最小执行间隔', '触发器', '条件成立但拦下，也要留下记录', 'decision'),
        ('出口有没有接收', '任务回调、建议、事件、第三方、通知卡逐个核对', '任务服务 T 章 / Advisor S 章', '触发器与对应出口一起查回执', 'cloud'),
        ('下游有没有真正完成', '真实展示、真实执行、播完，各看自己的回执', 'Planner / 车端 / 业务出口', '已接收不代表用户已经收到', 'local'),
    ]
    for i, (title, line, owner, note, color) in enumerate(rows):
        y = 150 + i * 130
        f.node(str(i + 1), 80, y, 650, 90, f'{i+1:02d} · {title}', [line], color)
        f.text(790, y + 29, owner, 'node-title')
        f.text(790, y + 60, note, 'subtitle')
        if i < len(rows) - 1:
            f.arrow((405, y + 90), (405, y + 130))
    f.text(80, 1224, '用场景编号、任务编号、车辆、时间、日志编号，把一次触发串起来。', 'label')
    f.footer(1262, '触发看规则匹配；触达看下游接收；用户感知还要继续核对。', [('neutral', '灰：范围与前提'), ('cloud', '绿：登记与交接'), ('local', '蓝：车端与实际结果'), ('decision', '黄：判断与频控')])
    f.save()


if __name__ == '__main__':
    for draw in [overview, position, condition, wake, judge, exits, semantic, debug]:
        draw()
