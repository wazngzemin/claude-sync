from pathlib import Path
import json, re
from html import escape

ROOT = Path(__file__).resolve().parent
CSS = re.search(r'<style>(.*?)</style>', (ROOT.parent/'K-v2/figures/k2-overview.svg').read_text(), re.S).group(1)

class Figure:
    def __init__(self,id,title,subtitle,w=1200,h=1000):
        self.id,self.title,self.subtitle,self.w,self.h=id,title,subtitle,w,h
        self.parts=[]
        self.text(32,44,title,'title');self.text(32,72,subtitle,'subtitle')
    def text(self,x,y,s,cls='node-sub'):
        self.parts.append(f'<text class="v56-{cls}" x="{x}" y="{y}" text-anchor="start">{escape(s)}</text>')
    def node(self,id,x,y,w,h,title,lines,color='cloud',pending=False):
        self.parts.append(f'<g data-node="true" id="{self.id}-{id}"><rect class="v56-{color}{" v56-pending" if pending else ""}" x="{x}" y="{y}" width="{w}" height="{h}" rx="8" stroke-width="1.6"/>')
        self.text(x+14,y+28,title,'node-title')
        for i,line in enumerate(lines):self.text(x+14,y+56+i*24,line)
        self.parts.append('</g>')
    def arrow(self,*points,pending=False):
        d='M '+' L '.join(f'{x} {y}' for x,y in points)
        self.parts.append(f'<path class="v56-arrow{" v56-pending" if pending else ""}" d="{d}" marker-end="url(#{self.id}-arr)"/>')
    def rule(self,y):self.parts.append(f'<path class="v56-rule" d="M 32 {y} L {self.w-32} {y}"/>')
    def footer(self,y,summary,legend):
        self.rule(y);self.text(32,y+36,summary,'node-title')
        for i,(color,label) in enumerate(legend):
            x=32+i*(self.w-64)/len(legend)
            self.parts.append(f'<rect data-decoration="true" class="v56-{color}" x="{x}" y="{y+64}" width="18" height="18" rx="8" stroke-width="1.6"/>')
            self.text(x+28,y+78,label,'subtitle')
    def save(self):
        s=f'<svg xmlns="http://www.w3.org/2000/svg" class="v56-figure" id="{self.id}" width="{self.w}" height="{self.h}" viewBox="0 0 {self.w} {self.h}" role="img" aria-labelledby="{self.id}-title {self.id}-desc">\n<title id="{self.id}-title">{escape(self.title)}</title><desc id="{self.id}-desc">{escape(self.subtitle)}</desc>\n<style>{CSS}</style>\n<defs><marker id="{self.id}-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" class="v56-arrow"/></marker></defs>\n'+'\n'.join(self.parts)+'\n</svg>\n'
        (ROOT/'figures'/f'{self.id}.svg').write_text(s)
        (ROOT/'figures'/f'{self.id}.json').write_text(json.dumps(dict(id=self.id,title=self.title,subtitle=self.subtitle),ensure_ascii=False,indent=2)+'\n')
        print('saved',self.id,flush=True)

def overview():
    f=Figure('t2-overview','一句以后才办的话，怎样等到、送回、办完','赛力斯主驾 15:00 说“三十分钟后提醒我去接小宝”；任务系统接下等待，15:30 再交回 Planner。',1200,900)
    nodes=[('speech','主驾说出目标',['“三十分钟后提醒我','去接小宝”'],'local'),('entry','任务入口工具',['Planner 只交原话','可附运行提示'],'cloud'),('save','任务服务',['识别新增、完成检查','先保存任务'],'cloud'),('register','登记等待条件',['交给触发器（G 章）','等到 15:30'],'cloud'),('callback','15:30 触发回调',['触发器通知任务服务','带任务与回调编号'],'cloud'),('run','执行前检查',['通过后生成一次运行','保留这次执行的身份'],'decision'),('return','建议回到 Planner',['车端上行后进入','输入管理排队（M 章）'],'local'),('planner','Planner 决定',['结合当时情况','决定说什么、做什么'],'decision'),('write','结果回写',['按运行身份写回','单次成功后关闭任务'],'cloud')]
    for i,(id,title,lines,c) in enumerate(nodes):
        row,col=divmod(i,3)
        if row%2:col=2-col
        x,y=40+395*col,180+210*row
        f.node(id,x,y,330,140,title,lines,c)
        if i%3:
            if row%2:f.arrow((x+395,y+70),(x+330,y+70))
            else:f.arrow((x-65,y+70),(x,y+70))
        elif i:f.arrow((x+165,y-70),(x+165,y))
    f.parts.append('<path class="v56-rule" d="M 995 180 L 995 130 L 1160 130" marker-end="url(#t2-overview-arr)"/>')
    f.text(620,112,'车端状态同步：任务消息 / 上电补查','label')
    f.text(32,780,'主线：保存 → 等到 → 回流 → 执行 → 记结果','label')
    f.footer(802,'任务系统负责记住和送回来，Planner 负责到点那一刻怎么办。',[('local','蓝：车上输入与建议回流'),('cloud','绿：任务保存、等待与回写'),('decision','黄：执行前检查与当下决策')])
    f.save()

def create():
    f=Figure('t2-create','创建任务，要先保存、再登记、最后确认','“三十分钟后提醒我去接小宝”：只有保存回执，还不能说“安排好了”。',1200,1160)
    f.node('entry',80,118,660,80,'任务入口工具',['交入用户原话与可选运行提示'])
    f.node('identify',80,234,660,122,'任务规格生成：先读当前任务列表',['识别新增 / 修改 / 取消 / 查询','修改、取消先定位原任务；定位不到就澄清','新增、修改才生成任务规格'])
    f.node('checks',80,392,660,222,'新增 / 修改：五项检查 + 数量与时长限制',['条件能感知；条件可能发生','动作合价值观；动作能执行；条件与动作不矛盾','定时 + 循环定时：最多 20 个','条件 + 循环条件：最多 20 个','定时：1 分钟～2 周；视觉观察另限同时 3 个','视觉需全时视觉感知开启；目的地提醒需有导航'], 'decision')
    f.node('save',80,650,660,80,'先保存任务',['先有任务，规则命中时才找得到它'])
    f.node('register',80,766,660,80,'再登记等待条件',['把“三点半”登记给触发器'])
    f.node('reply',80,882,660,116,'最后回话：进行中只中性受理',['先启动需要立即开始的任务，再发状态消息','上汽异步创建：等创建回调再确认'],'local')
    f.node('reject',840,392,328,116,'检查不过：澄清或拒绝',['说明具体原因','不承诺做不到的事'],'reject')
    f.node('failure',840,750,328,164,'登记失败：不能说“安排好了”',['保存成功 ≠ 登记成功','补救方式要在评审里定','虚线：补救方式仍需对齐'],'reject',True)
    for a,b in [(198,234),(356,392),(614,650),(730,766),(846,882)]:f.arrow((410,a),(410,b))
    f.arrow((740,450),(840,450));f.text(764,432,'不通过','risk')
    f.arrow((740,806),(840,806));f.text(764,788,'失败','risk')
    f.footer(1030,'保存、登记和回话是三个动作，逐个核对实际结果。',[('cloud','绿：创建与登记'),('decision','黄：创建约束'),('local','蓝：用户回话'),('reject','红：失败；虚线：仍在对齐')])
    f.save()

def objects():
    f=Figure('t2-objects','一件任务，怎样留下目标、执行和状态','主例：“15:30 提醒主驾去接小宝”；任务保存整件事，一次运行只记录某一次执行。',1200,1140)
    f.node('task',420,366,360,148,'任务：整件事',['状态、结束原因','运行次数、版本','属于这个账号 × 这辆车'])
    f.node('spec',420,130,360,184,'任务规格',['用户目标、到时要执行的话','等待规则、由谁执行、结束策略','主例：15:30 提醒主驾去接小宝'])
    f.node('run',32,344,320,126,'一次运行',['某一次真正执行','等待时可以还没有运行'])
    f.node('events',32,566,320,102,'任务事件',['每次状态变化的事实','用于审计和推进'])
    f.node('association',848,344,320,126,'外部关联',['用已有请求编号、推荐编号','对回任务和运行'])
    f.node('view',848,566,320,102,'任务视图：查询',['只读当前样子','供 Planner 和车端查询'],'local')
    f.node('message',420,622,360,102,'任务消息：通知',['状态变化时主动推给车端','用于车端更新'],'local')
    f.arrow((600,366),(600,314));f.arrow((420,410),(352,410));f.arrow((780,410),(848,410))
    f.arrow((420,478),(384,478),(384,616),(352,616));f.arrow((780,478),(816,478),(816,616),(848,616));f.arrow((600,514),(600,622))
    f.text(32,782,'三个状态层，各自描述不同对象，不能一一对应','node-title')
    cols=[(32,'自研任务 · 3 态',['等待 / 进行中 / 已关闭']),(420,'一次运行 · 5 态',['进行中 / 成功 / 失败','跳过 / 取消']),(848,'上汽目标 · 4 态',['创建中 / 待执行','执行中 / 已结束'])]
    for x,title,lines in cols:
        f.text(x,824,title,'label')
        for i,line in enumerate(lines):f.text(x,856+i*24,line)
    f.text(32,938,'主例：任务先等待；15:30 到点并通过检查后，才生成这一次提醒的运行。','subtitle')
    f.footer(998,'查询是主动来取，通知是状态变化后推过去。',[('cloud','绿：保存目标、执行与关联'),('local','蓝：车端查询与通知')])
    f.save()

def hosts():
    f=Figure('t2-two-hosts','同一个任务，只选一套托管','赛力斯由自研任务服务管理；上汽由目标引擎托管。到点后的建议都交回同一个 Planner。',1200,1190)
    f.text(80,128,'赛力斯 · 自研任务服务','label');f.text(700,128,'上汽 · 目标引擎','label')
    f.node('service',80,170,420,126,'任务服务保存任务',['管理时间、条件、周期和多步界面任务','任务入口工具交入原话'])
    f.node('trigger',80,346,420,102,'向触发器登记等待条件',['触发器负责等待条件命中'])
    f.node('run',80,512,420,146,'触发回调 → 任务服务生成运行',['先做有效性与执行前检查','保存推荐关联，再推给车上','建议经车上回流'])
    f.node('tool',700,170,420,90,'持续目标管理工具',['新增传内容；删除传实际目标编号'])
    f.node('access',700,314,420,102,'豆包侧接入',['补齐历史、车辆和身份后请求创建'])
    f.node('engine',700,470,420,102,'目标引擎保存目标',['托管目标，并判断条件'])
    f.node('callback',700,626,420,154,'豆包侧处理回调',['创建成功：直接给车上发创建卡片','创建失败 / 到点触发：变成推荐','推荐经车上回流'])
    f.node('card',820,818,348,90,'车上显示创建卡片',['创建成功这一支直接到车端'],'local')
    f.node('planner',420,910,360,102,'同一个 Planner',['结合当时情况，决定说什么、做什么'],'decision')
    for x,a,b in [(290,296,346),(290,448,512),(910,260,314),(910,416,470),(910,572,626)]:f.arrow((x,a),(x,b))
    f.arrow((80,584),(48,584),(48,961),(420,961));f.text(80,892,'推荐回流','label')
    f.arrow((700,704),(640,704),(640,856),(800,856),(800,961),(780,961));f.text(650,838,'推荐回流','label')
    f.arrow((1000,780),(1000,818));f.text(1016,804,'创建成功','label')
    f.text(32,1060,'同一个任务只能有一个托管方，否则可能重复提醒。','risk')
    f.footer(1084,'按项目选择托管方，再检查各自的回调结果。',[('cloud','绿：托管、等待与回调'),('local','蓝：车端显示'),('decision','黄：当下决策'),('reject','红字：唯一托管约束')])
    f.save()

def return_():
    f=Figure('t2-return','到点以后，建议怎样回到 Planner','触发器判断原条件；任务服务检查这次回调能不能执行，并保留任务、运行与推荐的关联。',1200,1100)
    data=[('hit','触发器命中',['等待条件满足（G 章）','例如到了 15:30'],'cloud'),('callback','回调任务服务',['带任务编号、回调编号','任务服务不重判原条件'],'cloud'),('valid','有效性检查',['任务还在吗；取消或过期了吗','回调是不是重复'],'decision'),('check','执行前检查',['例如：座位上有人吗','无人则跳过这一轮按摩'],'decision'),('run','生成一次运行',['先生成推荐编号','并保存推荐关联'],'cloud'),('frontier','Frontier 推到车上',['云到车的长连接通道','把建议与推荐编号交给车端'],'local'),('upload','车上带推荐编号上行',['用推荐编号还原任务和运行','回到 Planner 主链'],'local'),('queue','输入管理排队（M 章）',['作为一条 Advisor 输入','同一次运行重复回流只算一次'],'cloud'),('planner','Planner 处理这条建议',['结合当下情况','决定说什么、做什么'],'decision')]
    for i,(id,title,lines,c) in enumerate(data):
        row,col=divmod(i,3);x=40+395*col;y=150+290*row
        f.node(id,x,y,330,160,title,lines,c)
        if col:f.arrow((x-65,y+80),(x,y+80))
    for y in [150,440]:f.arrow((1160,y+80),(1180,y+80),(1180,y+230),(20,y+230),(20,y+370),(40,y+370))
    f.text(830,344,'检查不过 → 拦截；不复活已关闭任务','risk')
    f.text(40,634,'执行前不满足 → 跳过这一轮','risk')
    f.text(40,948,'循环任务每次有效触发生成新运行；提醒打断还是排队，要产品预先定。','subtitle')
    f.footer(982,'建议进了 Planner，还要继续核对车上实际说了什么、做了什么。',[('cloud','绿：回调、关联与排队'),('local','蓝：云车传递'),('decision','黄：校验与当下决策'),('reject','红字：拦截或跳过')])
    f.save()

def cancel():
    f=Figure('t2-cancel','说“算了不用提醒了”，要一起停哪几样','先定位去接小宝的原任务；取消要同时处理保存的状态、等待条件、正在执行的部分和车端显示。',1200,1000)
    f.node('cancel',420,370,360,130,'取消：先定位原任务',['“算了不用提醒了”','定位不到就澄清'],'decision')
    f.node('state',420,140,360,122,'任务状态 → 已关闭（取消）',['保存取消结果','迟到触发不能重新激活'])
    f.node('rule',32,330,300,120,'撤掉等待规则',['从触发器撤掉该任务的规则','停止后续条件触发'])
    f.node('run',32,560,300,120,'结束在途的运行',['关闭当前运行','结果仍按运行身份归属'])
    f.node('vision',868,330,300,144,'视觉任务：重发观察列表',['新列表不再包含它','全量覆盖旧列表','全部取消就发空列表'])
    f.node('message',868,584,300,120,'推状态消息到车端',['通知车端更新','上电时补查有效任务列表'],'local')
    f.arrow((600,370),(600,262));f.arrow((420,406),(332,406));f.arrow((420,466),(380,466),(380,620),(332,620));f.arrow((780,406),(868,406));f.arrow((780,466),(820,466),(820,644),(868,644))
    f.text(32,770,'普通取消目前还没覆盖直接创建的多步界面操作任务。','risk')
    f.footer(846,'少停一样，就可能到点又提醒，或者界面上还挂着。',[('cloud','绿：关闭状态与停止后续执行'),('local','蓝：车端状态同步'),('decision','黄：找到要取消的原任务'),('reject','红字：取消能力边界')])
    f.save()

def debug():
    f=Figure('t2-debug','“你怎么没提醒我”，沿一次提醒逐层查','每层核对实际输入和结果；接口返回成功或单个步骤通过，都不能代表用户收到了提醒。',1200,1330)
    f.text(80,122,'从受理，一直查到车上实际结果','label');f.text(800,122,'这一层找谁、核对什么','label')
    rows=[('创建受理了吗','原话变成了正确的提醒任务吗','任务服务','核对任务内容、创建结果','cloud'),('规则登记上了吗','保存后，等待条件真的登记成功了吗','任务服务 + 触发器（G 章）','分别核对保存与登记回执','cloud'),('条件观察到了吗','到点或条件变化，有没有被正确观察','触发器（G 章）+ 车端','核对时间、信号与观察结果','cloud'),('回调到了吗','任务、回调编号是否齐全；是否被拦截','任务服务 + 触发器（G 章）','核对回调到达和有效性检查','cloud'),('进 Planner 了吗','推荐是否上行、还原身份并排队进入','车端 + Planner','对上推荐编号，查排队与去重','decision'),('说了、做了吗','提醒是否含“去接小宝”；车控是否成功','Planner + 车端','核对有效内容与实际执行结果','local'),('结果写回了吗','运行、任务、事件是否按身份写回','任务服务','核对回写结果及失败重试','cloud'),('车端状态对吗','通知是否到达；上电是否主动补查','任务服务 + 车端','核对状态消息和有效任务列表','local')]
    for i,(title,line,who,check,c) in enumerate(rows):
        y=150+126*i
        f.node('n'+str(i+1),80,y,640,88,f'{i+1:02d} · {title}',[line],c)
        f.text(800,y+29,'找谁：'+who,'node-title');f.text(800,y+58,check,'subtitle')
        if i<7:f.arrow((400,y+88),(400,y+126))
    f.text(80,1170,'用任务编号、运行编号、请求编号、推荐编号，把一次提醒串起来。','node-title')
    f.footer(1206,'先找到断在哪一层，再判断是哪一方的问题。',[('cloud','绿：创建、触发与回写'),('decision','黄：进入 Planner'),('local','蓝：实际结果与车端状态')])
    f.save()

if __name__=='__main__':
    for draw in [overview,create,objects,hosts,return_,cancel,debug]:
        draw()  # 每张成图与 JSON 保存完成后，才开始下一张。
