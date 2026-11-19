"""Build one M figure per invocation, using the v56 visual vocabulary."""
from pathlib import Path
import json
import sys
from html import escape
import xml.etree.ElementTree as ET

BASE = Path(__file__).resolve().parents[1]
REF = BASE.parent / 'v56-figures/v56-three-decisions.svg'
STYLE = ET.parse(REF).getroot().find('{http://www.w3.org/2000/svg}style').text

class Figure:
    def __init__(self, ident, title, subtitle, height):
        self.id, self.title, self.subtitle, self.height = ident, title, subtitle, height
        self.parts = []
        self.text(32, 44, title, 'v56-title')
        self.text(32, 72, subtitle, 'v56-subtitle')

    def text(self, x, y, s, cls='v56-node-sub', anchor='start'):
        self.parts.append(f'<text class="{cls}" x="{x}" y="{y}" text-anchor="{anchor}">{escape(s)}</text>')

    def node(self, name, x, y, w, h, title, lines=(), cls='v56-neutral', pending=False):
        self.parts.append(f'<g data-node="true" data-name="{name}"><rect class="{cls}{" v56-pending" if pending else ""}" x="{x}" y="{y}" width="{w}" height="{h}" rx="8" stroke-width="1.6"/>')
        self.text(x+14, y+27, title, 'v56-node-title')
        for i, line in enumerate(lines):
            self.text(x+14, y+52+i*23, line)
        self.parts.append('</g>')

    def path(self, points, cls='v56-arrow', arrow=True, **attrs):
        d = 'M ' + ' L '.join(f'{x} {y}' for x,y in points)
        extra = ' '.join(f'{k.replace("_", "-")}="{v}"' for k,v in attrs.items())
        self.parts.append(f'<path class="{cls}" d="{d}" fill="none" {"marker-end="+chr(34)+"url(#"+self.id+"-arr)"+chr(34) if arrow else ""} {extra}/>')

    def legend(self, entries):
        y = self.height - 54
        for x, cls, label in entries:
            self.parts.append(f'<rect data-legend="true" class="{cls}" x="{x}" y="{y}" width="18" height="18" rx="8" stroke-width="1.6"/>')
            self.text(x+28, y+14, label, 'v56-subtitle')

    def save(self):
        dest = BASE / 'figures'
        dest.mkdir(parents=True, exist_ok=True)
        svg = f'''<svg xmlns="http://www.w3.org/2000/svg" class="v56-figure" id="{self.id}" width="1200" height="{self.height}" viewBox="0 0 1200 {self.height}" role="img" aria-labelledby="{self.id}-title {self.id}-desc">
<title id="{self.id}-title">{escape(self.title)}</title><desc id="{self.id}-desc">{escape(self.subtitle)}</desc>
<style>{STYLE}</style>
<defs><marker id="{self.id}-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" class="v56-arrow" fill="none"/></marker></defs>
<rect data-background="true" x="0" y="0" width="1200" height="{self.height}" style="fill:var(--v56-bg,#fff)"/>
{chr(10).join(self.parts)}
</svg>
'''
        ET.fromstring(svg)
        (dest / f'{self.id}.svg').write_text(svg)
        (dest / f'{self.id}.json').write_text(json.dumps(dict(id=self.id, title=self.title, subtitle=self.subtitle), ensure_ascii=False, indent=2)+'\n')
        print(f'{self.id}.svg + .json saved; nodes={svg.count("data-node=")}' )

def before_after():
    f=Figure('m2-before-after', '四路输入，先排成一条交互流', '统一之前各处自己找 Planner；统一之后，输入管理先排顺序，再交给 Planner。', 730)
    f.text(32, 125, '统一之前', 'v56-node-title')
    f.text(650, 125, '统一之后', 'v56-node-title')
    f.path([(600,105),(600,620)], 'v56-rule', False)
    for i,(title,line) in enumerate([
        ('多音区缓存','合并各个座位的话'),
        ('打断恢复链路','处理插话和恢复'),
        ('主动推荐自己等','各自判断何时开口'),
        ('工具自己续轮','结果回来就接着推理')]):
        f.node(f'old-{i}',32,165+i*110,250,90,title,[line], 'v56-local')
    f.node('old-planner',430,325,140,100,'Planner',['接住多路请求'],'v56-cloud')
    # Crossing occurs only in the empty gap, never through a card.
    f.path([(282,210),(430,400)])
    f.path([(282,320),(430,375)])
    f.path([(282,430),(430,350)])
    f.path([(282,540),(430,335)])
    f.text(340,575,'自己打断自己','v56-node-title')
    f.parts[-1]=f.parts[-1].replace('class="v56-node-title"','class="v56-node-title" style="fill:var(--red,#9c4148)"')
    f.node('four-inputs',650,165,518,175,'四路输入各自保留身份',[
        '用户的话　　主动建议',
        '同一轮工具的完整结果　　有效事件',
        '每条保留来源；同一个身份只收一次'], 'v56-local')
    f.node('input-management',650,410,230,110,'输入管理',['决定谁先进、谁等一等','只排顺序，不理解意图'],'v56-cloud')
    f.node('new-planner',970,410,198,110,'Planner',['接收本轮输入','理解意图、决定动作'],'v56-cloud')
    f.path([(765,340),(765,410)])
    f.path([(880,465),(970,465)])
    f.text(650,565,'一条交互流：同一时刻只有一次执行生效','v56-label')
    f.legend([(32,'v56-local','蓝：输入与分散处理'),(350,'v56-cloud','绿：排顺序与正式处理'),(700,'v56-reject','红：交互冲突')])
    return f

def three_states():
    f=Figure('m2-three-states','对话三态，决定新输入怎么进','给调度用的是空闲、处理中、输出中；车机上的聆听、思考、播报给用户看。',730)
    f.text(32,136,'给调度用 · 云端对话三态','v56-label')
    f.node('idle',32,200,250,130,'空闲',['没有有效的推理','也没有待播完的回复'])
    f.node('processing',475,200,250,130,'处理中',['Planner 已经开始推理','用户还没看到第一段文字'])
    f.node('output',918,200,250,130,'输出中',['已经开始输出文字','或者车上还在播'])
    f.path([(282,265),(475,265)])
    f.text(378,243,'开始推理','v56-label','middle')
    f.path([(725,265),(918,265)])
    f.text(821,221,'出第一段文字','v56-label','middle')
    f.text(821,243,'或开始播','v56-label','middle')
    f.node('tool-record',475,355,250,65,'另记：工具放行了没有',[], 'v56-decision')
    f.path([(600,330),(600,355)], 'v56-rule', False)
    f.path([(1043,330),(1043,460),(157,460),(157,330)])
    f.text(800,442,'车上报播完（或播放状态超时）','v56-label','middle')
    f.node('visible-phases',32,520,1136,105,'给用户看 · R 章车机交互阶段',[
        '聆听　→　思考　→　播报　　两套状态要对得上，但不是一一对应'], 'v56-neutral', True)
    f.legend([(32,'v56-neutral','灰：调度状态'),(280,'v56-decision','黄：另记工具放行'),(600,'v56-neutral v56-pending','虚线：另一套交互阶段')])
    return f

def two_gates():
    f=Figure('m2-two-gates','旧话能否重放，要过两道门','用户的新话来了：工具还没放行、语音还没起播，才把旧话和新话合并重推。',690)
    f.text(32,122,'一轮执行的示例时间轴','v56-label')
    for name,x,title,line in [
        ('start',32,'开始推理','旧输入进入 Planner'),
        ('tool',335,'工具放行','登记为不能重放'),
        ('text',640,'首段文字','开始向用户展示'),
        ('speech',940,'语音起播','车上真正开始播放')]:
        f.node(name,x,220,210,100,title,[line])
    for a,b in [(242,335),(545,640),(850,940)]: f.path([(a,270),(b,270)])
    for x,label in [(310,'工具门'),(915,'起播门')]:
        f.path([(x,160),(x,370)],'v56-arrow',False,style='stroke:var(--amber,#865b1a);stroke-width:2.4')
        f.text(x,145,label,'v56-node-title','middle')
    f.node('merge',32,425,400,110,'两道门都没过 → 合并重推',[
        '旧话与新话一起交给 Planner', '旧推理失效，换新的执行身份'], 'v56-cloud')
    f.node('new-only',475,425,693,110,'过了任一道门 → 只办新话',[
        '旧话和已发工具当背景；语音起播后还要带上已播、未播内容',
        '已经执行的动作不撤销'], 'v56-reject')
    f.text(32,582,'原因：重推可能再发一次同样的工具，造成重复车控、重复下单。','v56-node-sub')
    f.legend([(32,'v56-decision','黄：两道边界'),(320,'v56-cloud','绿：可以合并重推'),(680,'v56-reject','红：旧话不能重办')])
    return f

def permits():
    f=Figure('m2-permits','下一轮可以先算，等上一轮播完再发','找充电站时，E2 还在播，工具结果触发 E3 先算；E3 拿到输出许可后才发出去。',750)
    f.text(32,155,'计算（候选）','v56-node-title')
    f.text(32,400,'输出（正式）','v56-node-title')
    f.path([(32,345),(880,345)],'v56-rule',False)
    f.node('e3-candidate',450,190,410,120,'E3 先算 · 计算许可',[
        '工具结果回来，先准备下一轮',
        '预跑时不能调用新的业务工具'], 'v56-local')
    f.node('e2-output',170,420,260,110,'E2 在播 · 输出许可',[
        '“我帮你找找”', '合法播放继续'], 'v56-cloud')
    f.node('e3-output',600,420,260,110,'E3 正式发出',[
        '拿到输出许可', '才发文字、语音、工具调用'], 'v56-cloud')
    f.path([(430,475),(600,475)])
    f.text(515,450,'车上报 E2 播完','v56-label','middle')
    f.path([(730,310),(730,420)])
    f.text(746,382,'输出许可','v56-label')
    f.node('exit-check',925,190,243,365,'出口核对',[
        '发出前比对执行身份',
        '失效执行一律拦下：',
        '文字、语音、工具调用、',
        '历史写入',
        '',
        '真实工具结果不丢',
        '放行回历史',
        '已发生的动作不撤销'], 'v56-decision')
    f.text(32,600,'同一对话：最多一个有效候选 + 一个未撤销的正式输出。','v56-node-sub')
    f.text(32,626,'E2、E3 是不同执行身份的示意名；身份只比是否相同，不比大小。','v56-subtitle')
    f.legend([(32,'v56-local','蓝：先算的候选'),(350,'v56-cloud','绿：允许正式输出'),(700,'v56-decision','黄：出口身份核对')])
    return f

def finish():
    f=Figure('m2-finish','有语音的一轮，车上报播完才正常结束','没收到回执时，软期限只记状态；硬期限才以超时结束，新的用户的话随时可以进来。',850)
    f.node('start',32,240,180,100,'开始播',['第一个有声音的样本','真正进入播放器'], 'v56-neutral')
    f.text(300,132,'收到回执','v56-label')
    f.node('reported',300,155,220,90,'车上报播完',['结束标记已到且队列空'], 'v56-cloud')
    f.node('normal-end',640,155,200,90,'正常结束',['记录为播完'], 'v56-cloud')
    f.node('next',950,250,218,100,'叫下一位',['取出下一批输入'], 'v56-cloud')
    f.path([(212,270),(250,270),(250,200),(300,200)])
    f.path([(520,200),(640,200)])
    f.path([(840,200),(900,200),(900,285),(950,285)])
    f.text(300,382,'没收到回执','v56-label')
    f.node('soft',300,405,180,90,'软期限',['按剩余音频时长算'], 'v56-decision')
    f.node('unconfirmed',550,405,235,90,'记“完成未确认”',['不推进，继续等回执'], 'v56-decision')
    f.node('hard',550,565,235,90,'硬期限',['仍没收到播完回执'], 'v56-decision')
    f.node('timeout',900,565,268,90,'以“播放状态超时”结束',['不写成正常播完'], 'v56-reject')
    f.path([(212,310),(250,310),(250,450),(300,450)])
    f.path([(480,450),(550,450)])
    f.path([(667,495),(667,565)])
    f.path([(785,610),(900,610)])
    f.path([(1034,565),(1034,350)])
    f.node('new-user',32,565,400,90,'新的用户的话随时可以进来',['不受软期限、硬期限限制'], 'v56-local')
    f.text(32,545,'旁路','v56-label')
    f.text(32,710,'结束这一轮与取出下一批，一次提交。','v56-node-sub')
    f.text(32,741,'这些都不能当播完：断网、收到最后一个包、按时长估计。','v56-node-sub')
    f.legend([(32,'v56-cloud','绿：正常结束与推进'),(330,'v56-decision','黄：等待兜底'),(590,'v56-reject','红：超时结束'),(860,'v56-local','蓝：用户插话')])
    return f

BUILDERS={f'm2-{k.replace("_","-")}':v for k,v in [('before_after',before_after),('three_states',three_states),('two_gates',two_gates),('permits',permits),('finish',finish)]}
if __name__ == '__main__':
    BUILDERS[sys.argv[1]]().save()
