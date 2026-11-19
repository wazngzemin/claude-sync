"""Create one requested D figure per invocation; preserve the v56 style verbatim."""
from pathlib import Path
import sys, re, json
from xml.sax.saxutils import escape

BASE = Path(__file__).resolve().parent
STYLE = re.search(r'<style>(.*?)</style>', (BASE.parent/'v56-figures/v56-three-decisions.svg').read_text(), re.S).group(1)

class Figure:
    def __init__(self, id, title, subtitle, height):
        self.id, self.title, self.subtitle, self.height = id, title, subtitle, height
        self.parts = []
        self.text(32,44,title,'v56-title')
        self.text(32,72,subtitle,'v56-subtitle')
    def text(self,x,y,s,cls='v56-node-sub',anchor='start'):
        self.parts.append(f'<text class="{cls}" x="{x}" y="{y}" text-anchor="{anchor}">{escape(s)}</text>')
    def node(self,id,x,y,w,h,cls,title,lines=()):
        self.parts.append(f'<g data-node="true" id="{self.id}-{id}"><rect class="{cls}" x="{x}" y="{y}" width="{w}" height="{h}" rx="8" stroke-width="1.6"/>')
        self.text(x+14,y+27,title,'v56-node-title')
        for i,s in enumerate(lines): self.text(x+14,y+52+i*21,s)
        self.parts.append('</g>')
    def arrow(self,points,pending=False):
        d='M '+' L '.join(f'{x} {y}' for x,y in points)
        self.parts.append(f'<path class="v56-arrow'+(' v56-pending' if pending else '')+f'" d="{d}" marker-end="url(#{self.id}-arr)"/>')
    def legend(self,y,items):
        for x,cls,label in items:
            if cls=='dash':
                self.parts.append(f'<path class="v56-arrow v56-pending" d="M {x} {y-6} L {x+20} {y-6}"/>')
            else:
                self.parts.append(f'<rect data-decoration="true" class="{cls}" x="{x}" y="{y-20}" width="18" height="18" rx="8" stroke-width="1.6"/>')
            self.text(x+28,y-6,label,'v56-subtitle')
    def save(self):
        svg=f'''<svg xmlns="http://www.w3.org/2000/svg" class="v56-figure" id="{self.id}" width="1200" height="{self.height}" viewBox="0 0 1200 {self.height}" role="img" aria-labelledby="{self.id}-title {self.id}-desc">
<title id="{self.id}-title">{escape(self.title)}</title><desc id="{self.id}-desc">{escape(self.subtitle)}</desc>
<style>{STYLE}</style>
<defs><marker id="{self.id}-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" class="v56-arrow"/></marker></defs>
'''+ '\n'.join(self.parts)+'\n</svg>\n'
        out=BASE/'figures';out.mkdir(exist_ok=True)
        (out/f'{self.id}.svg').write_text(svg)
        (out/f'{self.id}.json').write_text(json.dumps(dict(id=self.id,title=self.title,subtitle=self.subtitle),ensure_ascii=False,indent=2)+'\n')
        print(f'SAVED {self.id}.svg + {self.id}.json; nodes={svg.count(chr(100)+"ata-node="+chr(34)+"true") }')

def parallel():
    f=Figure('d2-parallel-serial','同一轮一起发，有依赖的分轮办','“我好热，顺便找个附近能停车的咖啡店”：先发独立动作，再根据结果推进。',660)
    f.text(32,124,'同一轮一起发：第一轮','v56-node-title')
    f.text(840,124,'下一轮再发：先等结果','v56-node-title')
    f.text(32,154,'Planner 同时下发四个动作','v56-label')
    f.parts.append('<path class="v56-rule" d="M 114 184 L 114 174 L 678 174 L 678 184 M 302 174 L 302 184 M 490 174 L 490 184"/>')
    for i,(t,s) in enumerate([('查车况','查当前状态'),('开空调','执行开启动作'),('调风量','执行风量调整'),('搜咖啡店','搜附近的候选')]):
        f.node(str(i+1),32+i*188,194,164,98,'v56-local',t,[s])
    f.node('parking',840,194,328,86,'v56-decision','看停车',['第二轮：读搜索结果，筛能停车的店'])
    f.node('choose',840,342,328,86,'v56-decision','让用户选',['第二轮回复：推荐有停车场的两家'])
    f.node('navigation',840,490,328,86,'v56-decision','导航',['用户选定后，第三轮才发导航'])
    f.arrow([(760,243),(800,243),(800,237),(840,237)],True)
    f.arrow([(1004,280),(1004,342)],True)
    f.text(1020,315,'等筛选结果','v56-label')
    f.arrow([(1004,428),(1004,490)],True)
    f.text(1020,463,'等用户选择','v56-label')
    f.text(32,350,'同一轮的动作同时下发，不能互相依赖。','v56-node-title')
    f.text(32,383,'看停车要等搜索结果；导航还要等用户选定。')
    f.text(32,544,'车型规则：上汽导航类工具不在同一轮并行。','v56-label')
    f.text(32,569,'搜地点、算路线、导航控制，按先后依赖分轮安排。')
    f.legend(624,[(32,'v56-local','蓝：本轮一起下发'),(300,'v56-decision','黄：依赖满足后推进'),(600,'dash','虚线箭头：等待结果或选择')])
    f.save()

def talk():
    f=Figure('d2-talk-act','先说过渡，结果回来再确认','说话和执行可以同时推进；同一轮多个工具的结果等齐后，再统一交代。',790)
    f.text(32,132,'时间向右推进 →','v56-label')
    for x,s in [(168,'第一轮'),(526,'执行期间'),(884,'第二轮')]: f.text(x,157,s,'v56-label')
    f.text(58,236,'说','v56-node-title')
    f.text(58,446,'做','v56-node-title')
    f.node('transition',168,184,280,120,'v56-local','过渡话术',['“先帮你把空调打开，','再找找附近的咖啡店。”'])
    f.node('wait',526,184,280,120,'v56-decision','等结果',['不提前声称“已经开好了”'])
    f.node('report',884,184,280,120,'v56-cloud','统一交代',['空调已开、风量已调；','推荐能停车的两家，等用户选'])
    f.node('dispatch',168,394,280,98,'v56-local','动作下发',['四个互不依赖的动作一起发'])
    f.node('execute',526,394,280,98,'v56-local','工具执行',['开空调、调风量、查询等'])
    f.node('return',884,394,280,98,'v56-cloud','结果回来',['同一轮多个工具，等结果都回来'])
    for y in [244,443]:
        f.arrow([(448,y),(526,y)])
        f.arrow([(806,y),(884,y)])
    f.arrow([(1024,394),(1024,304)])
    f.text(1040,356,'读齐再说','v56-label')
    f.node('wrong',526,594,638,86,'v56-reject','错误做法：提前说成功',['动作还没回结果，就说“已经开好了”。'])
    f.text(168,543,'结果回来后，对照用户目标，再决定怎么答。','v56-label')
    f.text(32,710,'下一轮的话，要等车上上一轮播完才能发。','v56-subtitle')
    f.legend(758,[(32,'v56-local','蓝：开始说或开始做'),(310,'v56-decision','黄：等待'),(490,'v56-cloud','绿：读结果后交代'),(800,'v56-reject','红：提前声称成功')])
    f.save()

def fake():
    f=Figure('d2-fake-success','工具说成功，还要对照用户的目标','先读真实结果，再确认办成的是不是用户要的那件事；失败或部分成功也要如实说。',780)
    f.node('success',32,150,252,98,'v56-local','工具回执：成功',['成功状态不是最终答案'])
    f.node('check',384,150,384,98,'v56-decision','办成的是不是用户要的那件事？',['拿用户目标对照真实结果'])
    f.node('confirm',904,150,264,98,'v56-cloud','如实确认',['只确认真实办成的部分'])
    f.arrow([(284,199),(384,199)])
    f.text(304,182,'读结果','v56-label')
    f.arrow([(768,199),(904,199)])
    f.text(816,182,'是','v56-label')
    f.node('correct',430,316,338,86,'v56-cloud','纠正或换办法',['目标没达成，就不能说办好了'])
    f.arrow([(576,248),(576,316)])
    f.text(592,286,'否','v56-label')
    f.node('failure',32,446,338,86,'v56-local','工具回执：失败或部分成功',['不能把失败改写成成功'])
    f.node('honest',430,446,738,86,'v56-cloud','如实说，能换办法就换',['说明哪些办成、哪些没办成；不无限道歉、不无限重试。'])
    f.arrow([(370,489),(430,489)])
    f.text(32,583,'真实例子：下面三种话都属于假成功','v56-label')
    f.node('music',32,604,352,86,'v56-reject','音乐没暂停',['却说“搞定”'])
    f.node('playlist',424,604,352,86,'v56-reject','歌单没建',['却编了一个歌单名字'])
    f.node('ac',816,604,352,86,'v56-reject','空调避人吹没生效',['却说“调好了”'])
    f.legend(748,[(32,'v56-local','蓝：真实回执'),(280,'v56-decision','黄：目标核对'),(538,'v56-cloud','绿：按结果答复'),(832,'v56-reject','红：假成功')])
    f.save()

def fix():
    f=Figure('d2-fix-levers','改提示词、改示例、做 SFT，各修什么','先判断错误属于规则、具体问法还是大量同类问题；三种改法都要回到准出评测。',790)
    f.node('prompt',32,138,352,420,'v56-local','改提示词',['规则、工具描述'])
    f.node('examples',424,138,352,420,'v56-decision','改示例',['静态示例、动态示例'])
    f.node('sft',816,138,352,420,'v56-cloud','做 SFT（监督微调）',['用标好答案的样本训练模型'])
    for x,fit,speed,risk in [
        (46,['规则说不清、工具说明有歧义','例如：没等结果就说成功'],['三种改法中最快','改完规则和描述后评测'],['说明越写越长，会增加输入','规则冲突也可能带偏其他场景']),
        (438,['具体问法容易选错工具','适合低频、零散的错法'],['动态示例库可热更新','静态示例随提示词更新'],['示例必须匹配工具和车型','带错示例，会把正确回答带偏']),
        (830,['大量同类错误','也适合压缩提示词、提速'],['周期最长','要准备样本、训练，再评测'],['样本偏差可能被一起学进去','训练后仍可能影响其他场景'])
    ]:
        for y,label,lines in [(242,'适合修什么',fit),(338,'多快见效',speed),(434,'副作用',risk)]:
            f.text(x,y,label,'v56-label')
            for i,s in enumerate(lines): f.text(x,y+26+21*i,s)
    f.node('evaluation',32,620,1136,86,'v56-neutral','改完都要回到准出评测',['看 14 项基础指标和关键场景；效果、速度分别评测，再决定是否上线。'])
    for x in [208,600,992]: f.arrow([(x,558),(x,620)])
    f.legend(758,[(32,'v56-local','蓝：规则与工具说明'),(310,'v56-decision','黄：具体问法示范'),(600,'v56-cloud','绿：样本训练'),(870,'v56-neutral','灰：共同评测')])
    f.save()

if __name__=='__main__':
    {'d2-parallel-serial':parallel,'d2-talk-act':talk,'d2-fake-success':fake,'d2-fix-levers':fix}[sys.argv[1]]()
