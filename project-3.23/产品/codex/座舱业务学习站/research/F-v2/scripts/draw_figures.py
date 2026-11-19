from pathlib import Path
import json,re,sys,html
BASE=Path(__file__).resolve().parents[1]
REF=BASE.parent/'E-v2/figures/e2-resolve.svg'
STYLE=re.search(r'<style>(.*?)</style>',REF.read_text(),re.S).group(1)
STYLE+='\n.v56-risk{font-size:14px;font-weight:400;fill:var(--red,#9c4148)}\n'
def esc(s):return html.escape(str(s),quote=True)
class Figure:
 def __init__(self,id,title,subtitle,h):
  self.id=id;self.title=title;self.subtitle=subtitle;self.h=h;self.items=[];self.count=0
  self.text(32,44,title,'v56-title');self.text(32,72,subtitle,'v56-subtitle')
 def text(self,x,y,s,cls='v56-node-sub',anchor='start'):
  self.items.append(f'<text class="{cls}" x="{x}" y="{y}" text-anchor="{anchor}">{esc(s)}</text>')
 def node(self,x,y,w,h,title,lines,kind='neutral',pending=False):
  self.count+=1
  self.items.append(f'<g data-node="true" id="{self.id}-n{self.count}"><rect class="v56-{kind}{" v56-pending" if pending else ""}" x="{x}" y="{y}" width="{w}" height="{h}" rx="8" stroke-width="1.6"/>')
  self.text(x+14,y+28,title,'v56-node-title')
  for i,t in enumerate(lines):self.text(x+14,y+55+i*22,t)
  self.items.append('</g>')
 def arrow(self,pts,both=False):
  d='M '+' L '.join(f'{x} {y}' for x,y in pts)
  self.items.append(f'<path class="v56-arrow" d="{d}" marker-end="url(#{self.id}-arr)"'+(f' marker-start="url(#{self.id}-arr)"' if both else '')+'/>')
 def rule(self,x,y,x2,y2):self.items.append(f'<path class="v56-rule" d="M {x} {y} L {x2} {y2}"/>')
 def legend(self,y,entries):
  for x,kind,label,pending in entries:
   self.items.append(f'<rect data-decoration="true" class="v56-{kind}{" v56-pending" if pending else ""}" x="{x}" y="{y}" width="18" height="18" rx="8" stroke-width="1.6"/>')
   self.text(x+28,y+14,label,'v56-subtitle')
 def save(self):
  assert self.count<=9
  defs=f'<defs><marker id="{self.id}-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" class="v56-arrow"/></marker></defs>'
  svg=f'<svg xmlns="http://www.w3.org/2000/svg" class="v56-figure" id="{self.id}" width="1200" height="{self.h}" viewBox="0 0 1200 {self.h}" role="img" aria-labelledby="{self.id}-title {self.id}-desc">\n<title id="{self.id}-title">{esc(self.title)}</title><desc id="{self.id}-desc">{esc(self.subtitle)}</desc>\n<style>{STYLE}</style>\n{defs}\n'+'\n'.join(self.items)+'\n</svg>\n'
  target=BASE/'figures'/f'{self.id}.svg'
  if target.exists():raise SystemExit('Already exists: '+str(target))
  target.write_text(svg)
  target.with_suffix('.json').write_text(json.dumps(dict(id=self.id,title=self.title,subtitle=self.subtitle),ensure_ascii=False,indent=2)+'\n')
  print(f'SAVED {self.id}: {self.count} nodes')
def layers():
 f=Figure('f2-layers','这一轮看得见哪些工具，要分四层看','前两层决定本轮列表；后两层约束模型判断与执行，不能互相替代。',870)
 f.text(80,122,'逐层核对','v56-label');f.text(840,122,'这一层没过，会怎样','v56-label')
 rows=[(80,680,'01 · 项目里有可用的实现',['本项目、本环境：唯一已发布、已启用','并勾选“参与 Planner 推理”'],'cloud','Planner 看不见','先核对项目与环境'),(120,640,'02 · 本轮场景允许暴露',['动态工具条件满足，才加入本轮列表','条件算出错，按不满足处理'],'cloud','本轮不出现','核对本轮输入与动态条件'),(160,600,'03 · 模型知道这辆车能做什么',['车型能力说明 + 能力知识','约束 Planner 对这辆车的能力判断'],'decision','可能答应做不到的事','能力说明不能代替执行校验'),(200,560,'04 · 执行时允许',['下游检查权限、档位、登录等条件','不满足时拒绝，并回具体原因'],'local','下游拒绝并回原因','未登录不一定让工具消失')]
 for i,(x,w,t,lines,kind,a,b) in enumerate(rows):
  y=154+i*150;f.node(x,y,w,110,t,lines,kind)
  f.text(840,y+37,a,'v56-node-title');f.text(840,y+70,b,'v56-subtitle')
  if i<3:f.arrow([(460,y+110),(460,y+150)])
 f.rule(32,754,1168,754);f.text(80,788,'登记了 ≠ 看得见 ≠ 允许执行 ≠ 做成','v56-node-title')
 f.legend(822,[(80,'cloud','绿：本轮列表',False),(380,'decision','黄：能力判断',False),(700,'local','蓝：执行校验',False)])
 f.save()
def protocol():
 f=Figure('f2-protocol','一次调用，怎样说清“这是谁的哪一次”','以美团订座为例：四组信息一起随请求发送；不同链路的编号要能对应。',1180)
 f.text(32,118,'座舱云 → 三方 Agent：接入协议 1.4 版','v56-label')
 f.node(32,144,732,152,'01 · 归属信息',['话题编号：贯穿多轮的话题；单轮编号：这一问一答','会话编号：会话列表中的一组对话；工具编号：调用谁','追踪编号：请求和请求头都带；协议版本：必带'],'cloud')
 f.node(32,336,732,218,'02 · 本次输入',['必带：触发方式、请求类型、内容、轮次编号','触发方式示例：用户说话','请求类型：1 查询；2 预查询（默认关闭）；3 取消当前对话','内容：帮我在附近那家本帮菜馆订今晚七点四个人的位子','轮次编号 = 语音识别过程的轮次，不能当成 Planner 轮次'],'neutral')
 f.node(32,594,732,218,'03 · 公共信息',['必带：渠道 + 渠道应用编号、车辆编号、车型、车辆名称','上汽成对使用：saic-dna / 99220','选填：经纬度、车企账号、豆包账号、城市、区县','订座场景仍要用位置；需登录时仍要核对项目、车辆与账号','通用协议选填，不代表业务可以省掉必要条件'],'decision')
 f.node(32,852,732,130,'04 · 上下文',['上下文必带；其中的历史、记忆、车况、用户状态可选','历史可含 Planner 回答与工具记录'],'neutral')
 for a,b in [(296,336),(554,594),(812,852)]:f.arrow([(398,a),(398,b)])
 f.node(900,144,268,218,'车云之间的另一层编号',['请求编号','轮次编号、音区','各管各的链路','不是左侧那一组编号'],'local')
 f.arrow([(764,220),(900,220)],True)
 f.text(832,254,'要有对应关系','v56-label','middle')
 f.text(900,408,'同一次订座请求','v56-label');f.text(900,436,'沿记录对回同车、同问')
 f.rule(32,1024,1168,1024)
 f.text(32,1060,'少了位置，“附近那家”就算不出来。','v56-risk')
 f.legend(1110,[(32,'cloud','绿：调用归属',False),(302,'neutral','灰：输入与上下文',False),(592,'decision','黄：车辆与业务条件',False),(912,'local','蓝：车云编号',False)])
 f.save()
def onboard():
 f=Figure('f2-onboard','从申请到上线，每一步由谁交出什么','快速测试、整体评测和实车验收分别证明不同的事；通过后再发布正式版本。',1400)
 centers=[168,456,744,1032]
 for x,label in zip([32,320,608,896],['产品','接入方','研发与平台','项目与车端']):
  f.text(x+136,120,label,'v56-label','middle')
 for x in [312,600,888]:f.rule(x,136,x,1250)
 f.node(32,154,272,128,'01 · 评估需求，写定义',['写清能力边界、名称与参数','交出典型说法与正常异常结果','自建或非标准接入先申请编号'],'decision')
 f.node(320,328,272,106,'02 · 实现协议与服务',['按接入协议实现 HTTPS 服务','交出端点、鉴权与返回约定'],'cloud')
 f.node(608,480,272,106,'03 · 建定义和项目实现',['配置项目、环境与参与推理','测试和正式环境分开'],'neutral')
 f.node(608,632,272,150,'04 · 快速测试',['不指定：测 Planner 会选会说','指定：跳过 Planner，只测通路','指定模式仅支持部分纯文本','不代表已经完成实车验收'],'neutral')
 f.node(608,828,272,106,'05 · 测试环境验证',['核对实际请求与返回','有代码变更，走评审发版'],'neutral')
 f.node(32,980,272,106,'06 · 整体评测',['用整体提示词回归','分别核对选工具与填参数'],'decision')
 f.node(896,980,272,106,'07 · 联调与实车验收',['项目协同车端联调','核对车上动作与用户结果'],'local')
 f.node(608,1132,272,106,'08 · 发布；下线时禁用',['测试通过，草稿发布为正式版','下线只禁用本项目实现'],'neutral')
 f.node(896,1132,272,106,'每次接入单独约定',['灰度比例、持续多久','回退条件与具体做法'],'neutral',True)
 paths=[[(168,282),(168,306),(456,306),(456,328)],[(456,434),(456,458),(744,458),(744,480)],[(744,586),(744,632)],[(744,782),(744,828)],[(744,934),(744,958),(168,958),(168,980)],[(304,1033),(896,1033)],[(1032,1086),(1032,1110),(744,1110),(744,1132)]]
 for p in paths:f.arrow(p)
 f.text(600,1020,'评测结果交给项目，进入联调与实车','v56-subtitle','middle')
 f.rule(32,1272,1168,1272)
 f.text(32,1308,'服务端上线 ≠ 全链路交付；修改工具说明后，先测再发布。','v56-node-title')
 f.legend(1346,[(32,'decision','黄：产品评估与评测',False),(300,'cloud','绿：接入服务',False),(530,'neutral','灰：配置、验证与发布',False),(840,'local','蓝：车上验收',False)])
 f.text(896,1260,'虚线：本次接入仍需约定','v56-subtitle')
 f.save()
def debug():
 f=Figure('f2-debug','订座没订上，从哪一层开始查','先对齐同一次调用的记录，再逐层定位；每一层都要看实际输入和结果。',1190)
 f.text(100,122,'从登记一路查到真实结果','v56-label');f.text(790,122,'找谁：按职责协作','v56-label')
 rows=[('登记了吗',['本项目、本环境有已发布、启用、参与推理的实现'],'neutral','研发与平台','核对定义、项目实现和生效状态'),('这一轮看得见吗',['本轮工具列表里有它吗；动态条件是否满足'],'neutral','平台与条件配置方','核对本轮输入和实际加载的工具'),('Planner 选对、参数对吗',['选餐厅服务；店名、时间、人数保留用户要求'],'decision','产品与 Planner 团队','先补定义与参数示例，再判断模型问题'),('请求字段齐吗',['位置、车辆与项目归属、对话编号能否对应'],'cloud','研发与接入方','对照本次输入，定位字段丢在哪一层'),('连得上吗',['网络、连接、鉴权有没有报错'],'cloud','接入方与链路研发','美团连接报错，先定位连接层'),('业务办成了吗',['已提交、等商家确认、确认成功要分开看'],'cloud','服务商；项目协同','核对订单状态与具体失败原因'),('回执写清了吗',['屏幕、语音、模型反馈是否如实表达订单状态'],'local','接入方与车端；产品核验','对照车上显示和用户实际要的结果')]
 for i,(t,lines,kind,who,detail) in enumerate(rows):
  y=150+i*126
  f.node(100,y,620,88,f'{i+1:02d} · {t}',lines,kind)
  f.text(790,y+29,'找谁：'+who,'v56-node-title');f.text(790,y+58,detail,'v56-subtitle')
  if i<6:f.arrow([(410,y+88),(410,y+126)])
 f.rule(32,1036,1168,1036);f.text(100,1074,'先查链路和配置，再怀疑模型。','v56-node-title')
 f.legend(1122,[(100,'neutral','灰：登记与可见性',False),(370,'decision','黄：选择与参数',False),(640,'cloud','绿：下游调用与业务',False),(940,'local','蓝：回执落地',False)])
 f.save()
{'f2-layers':layers,'f2-protocol':protocol,'f2-onboard':onboard,'f2-debug':debug}[sys.argv[1]]()
