# -*- coding: utf-8 -*-
# 30节点骨架不变；按《业务流程讲解稿》4条路径分色，加路径图例，㉔标待建，保留字段级细化
L=[]; REG={}
def esc(s): return s.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;')
def box(nid,x,y,w,h,title,lines,fill='#eaf1fd',stroke='#475569',fs=10,tfs=12,need=None):
    REG[nid]=(x,y,w,h)
    L.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="{fill}" stroke="{stroke}" stroke-width="1.3" filter="url(#sh)"/>')
    L.append(f'<text x="{x+w/2}" y="{y+15}" text-anchor="middle" font-size="{tfs}" font-weight="bold" fill="#0f172a">{esc(title)}</text>')
    yy=y+29
    for ln in lines: L.append(f'<text x="{x+7}" y="{yy}" font-size="{fs}" fill="#334155">{esc(ln)}</text>'); yy+=13
    if need:
        L.append(f'<rect x="{x+w-46}" y="{y-9}" width="44" height="16" rx="8" fill="#fde68a" stroke="#d97706"/>')
        L.append(f'<text x="{x+w-24}" y="{y+3}" text-anchor="middle" font-size="9" font-weight="bold" fill="#92400e">{esc(need)}</text>')
def diamond(nid,cx,cy,w,h,title,lines):
    REG[nid]=(cx-w/2,cy-h/2,w,h)
    L.append(f'<path d="M {cx},{cy-h/2} L {cx+w/2},{cy} L {cx},{cy+h/2} L {cx-w/2},{cy} Z" fill="#fff7ed" stroke="#ea580c" stroke-width="1.5" filter="url(#sh)"/>')
    L.append(f'<text x="{cx}" y="{cy-2}" text-anchor="middle" font-size="11" font-weight="bold" fill="#9a3412">{esc(title)}</text>')
    yy=cy+12
    for ln in lines: L.append(f'<text x="{cx}" y="{yy}" text-anchor="middle" font-size="9" fill="#7c2d12">{esc(ln)}</text>'); yy+=11
def eng(nid,x,y,w,h,title,cells,fill,stroke,need=None):
    REG[nid]=(x,y,w,h)
    L.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{fill}" stroke="{stroke}" stroke-width="2" filter="url(#sh)"/>')
    L.append(f'<text x="{x+w/2}" y="{y+17}" text-anchor="middle" font-size="12" font-weight="bold" fill="#0f172a">{esc(title)}</text>')
    if need:
        L.append(f'<rect x="{x+w-60}" y="{y-10}" width="58" height="17" rx="8" fill="#fecaca" stroke="#dc2626"/>')
        L.append(f'<text x="{x+w-31}" y="{y+3}" text-anchor="middle" font-size="9" font-weight="bold" fill="#991b1b">{esc(need)}</text>')
    cy=y+26; col=0; cw=(w-24)/2
    for text,span in cells:
        if span==2:
            if col==1: cy+=27; col=0
            L.append(f'<rect x="{x+8}" y="{cy}" width="{w-16}" height="24" rx="4" fill="#fff" stroke="{stroke}" stroke-width="0.8"/>')
            L.append(f'<text x="{x+14}" y="{cy+15}" font-size="8.6" fill="#1f2937">{esc(text)}</text>'); cy+=27
        else:
            cxx=x+8+col*(cw+8)
            L.append(f'<rect x="{cxx}" y="{cy}" width="{cw}" height="24" rx="4" fill="#fff" stroke="{stroke}" stroke-width="0.8"/>')
            L.append(f'<text x="{cxx+5}" y="{cy+15}" font-size="8.2" fill="#1f2937">{esc(text)}</text>')
            if col==1: cy+=27; col=0
            else: col=1
def AN(nid,s):
    x,y,w,h=REG[nid]; return {'t':(x+w/2,y),'b':(x+w/2,y+h),'l':(x,y+h/2),'r':(x+w,y+h/2)}[s]
def edge(p,col,label='',dash='',wd=1.6,lx=None,ly=None,bold=False):
    if bold: wd=3.0
    d='M '+' L '.join(f'{a},{b}' for a,b in p); da=f' stroke-dasharray="{dash}"' if dash else ''
    L.append(f'<path d="{d}" fill="none" stroke="{col}" stroke-width="{wd}"{da} marker-end="url(#ar-{col[1:]})"/>')
    if label:
        mx=lx if lx is not None else (p[0][0]+p[-1][0])/2; my=ly if ly is not None else (p[0][1]+p[-1][1])/2
        bw=len(label)*5.8+8
        L.append(f'<rect x="{mx-bw/2}" y="{my-8}" width="{bw}" height="15" rx="3" fill="#fff" opacity="0.96"/>')
        L.append(f'<text x="{mx}" y="{my+3}" text-anchor="middle" font-size="9" font-weight="bold" fill="{col}">{esc(label)}</text>')

GY='#64748b'; P1='#2563eb'; P2='#16a34a'; P3='#ea580c'; P4='#7c3aed'; SIG='#a16207'; RED='#dc2626'; CY='#0891b2'
W,H=2160,1580
L.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" font-family="-apple-system,PingFang SC,Microsoft YaHei,sans-serif">')
L.append('<defs>')
for c in [GY,P1,P2,P3,P4,SIG,RED,CY]:
    L.append(f'<marker id="ar-{c[1:]}" markerWidth="10" markerHeight="8" refX="8" refY="4" orient="auto"><path d="M0,0 L9,4 L0,8 z" fill="{c}"/></marker>')
L.append('<filter id="sh" x="-4%" y="-4%" width="108%" height="120%"><feDropShadow dx="0" dy="1" stdDeviation="1.1" flood-color="#000" flood-opacity="0.13"/></filter></defs>')
L.append(f'<rect width="{W}" height="{H}" fill="#ffffff"/>')
L.append(f'<text x="{W/2}" y="26" text-anchor="middle" font-size="18" font-weight="bold" fill="#0f172a">端云协同触发器 · 全模块大图（你的原图 + 三处加工:①每条线标为什么 ②按流程分色 ③触发器15/24拆原子级(15-1~12 / 24-1~12)）</text>')
L.append('<line x1="10" y1="392" x2="2150" y2="392" stroke="#94a3b8" stroke-width="1.4" stroke-dasharray="8,5"/>')
L.append('<text x="20" y="386" font-size="13" font-weight="bold" fill="#1d4ed8">云端</text>')
L.append('<text x="20" y="408" font-size="13" font-weight="bold" fill="#15803d">端侧</text>')

# ---- 路径图例（评审讲解主线）----
lx,ly=350,40
L.append(f'<rect x="{lx}" y="{ly}" width="640" height="86" rx="9" fill="#f8fafc" stroke="#cbd5e1"/>')
L.append(f'<text x="{lx+12}" y="{ly+20}" font-size="12.5" font-weight="bold" fill="#0f172a">评审讲解主线 · 4条路径（一条一个例子）</text>')
paths=[('路径①简单车控',P1,'"打开车窗"·不进大脑·端侧毫秒闭环'),('路径②对话/复杂',P2,'"我好热"·走Director大脑·结合情景推理'),('路径③条件/定时任务',P3,'"超25度开空调"·走触发器注册+命中'),('路径④主动服务',P4,'"上车打招呼"·车自己动·Advisor主动')]
for i,(t,c,ex) in enumerate(paths):
    yy=ly+38+(i//2)*22; xx=lx+12+(i%2)*320
    L.append(f'<line x1="{xx}" y1="{yy-4}" x2="{xx+26}" y2="{yy-4}" stroke="{c}" stroke-width="3"/>')
    L.append(f'<text x="{xx+32}" y="{yy}" font-size="10.5" font-weight="bold" fill="{c}">{esc(t)}</text>')
    L.append(f'<text x="{xx+128}" y="{yy}" font-size="9.5" fill="#475569">{esc(ex)}</text>')
L.append(f'<text x="{lx+12}" y="{ly+82}" font-size="9.5" fill="#64748b">灰=信号底座/同步 · 加粗=端云传输(橙粗线) · ⚠=研发待确认</text>')

# ===== 云端节点 =====
diamond('n9',250,74,200,76,'9.拒识仲裁意图',['分流: 车控/非车控/拒识'])
box('n10',152,148,150,56,'10.意图模型解析[需2]',['条件话→触发器协议'],fs=9.5)
box('n11',20,250,96,54,'11.云信号源',['后端服务/事件服务'],fs=9)
box('n12',176,250,124,54,'12.云端信号库(全集)',['端信号同步上来'],fs=9)
box('n30',150,316,170,42,'30.拒识后→Context事件日志',[],tfs=10)
eng('n13',430,134,262,176,'13.规则配置平台·新建场景(原子级)',[
 ('13-1 基础信息·名/优先级',1),('13-2 发布范围·scope⚠',1),
 ('13-3 动态条件·VLM订阅⚠',1),('13-4 静态条件·车态24类',1),
 ('13-5 条件DSL·运算符⚠',1),('13-6 执行动作·Advisor⚠',1),
 ('13-7 执行策略·频控',1),('13-8 注册校验·生成下发⚠',1),
],'#eef6ff','#2563eb')
box('n14',430,316,250,42,'14.条件提槽&解析[需2]',['Planner条件任务·常识判断'],fs=9.5)
eng('n15',724,148,380,236,'15.触发器引擎(云端·原子级)',[
 ('15-1 注册校验·iCanDo/create',1),('15-2 场景库·静/动/预设/灰度',1),
 ('15-3 信号扫描·更新/5s',1),('15-4 条件判定·运算符⚠/变更为',1),
 ('15-5 模型推理·VLM语义',1),('15-6 抖动过滤·区间/周期',1),
 ('15-7 冷却频控·execute_policy',1),('15-8 优先级仲裁·P0-P4·互斥',1),
 ('15-9 端云分类[需9]·云/端/VLM',1),('15-10 标准事件·snapshot',1),
 ('15-11 Callback·Director/Advisor',1),('15-12 场景下发·全/增/灰',1),
],'#e8f1ff','#2563eb')
box('n16',1108,140,168,92,'16.静态Advisor[需3]',['(主动服务)·永久预设场景','舒适/出行·情感/内容','上汽:无→直连Director⚠'],fs=9)
box('n17',1108,242,168,116,'17.动态Advisor[需10]',[
 '(感知订阅)·临时·一目标一','注册→触发器(task_id/script','/max_exec)·响应iCanDo·','select(已有)/create(脚本)',
 '4任务:长时2/持续1/条件6/定时6','命中→callback→advice·DNA616'],fs=8.3)
box('n18',1470,66,156,48,'18.Goal List 共享看板',['目标队列·goal_list_update'],fs=9)
box('n19',1410,140,250,98,'19.Director汇入(6路)+前置筛选',['query·静态建议·动态建议','tool_feedback·触发通知·GoalList','前置筛选(工具/示例/knowhow)+Context'],fs=9)
box('n20',1410,250,250,56,'20.Director 推理(大脑)',['{talk_or_not, talk_content(情绪/emoji),','  action_list}'],fs=9)
box('n21',1410,318,250,42,'21.Context',['情境/端状态/记忆/日志·可筛选可查'],fs=9)
box('n22',1882,140,162,88,'22.工具库(云·23工具)',['车控/搜索/导航/音乐','记忆/播报','→tool_feedback回写Director'],fs=9)
box('n23',1882,242,162,52,'23.任务中心(云·端)',['widget卡片/任务岛/AI PUSH'],fs=9)

# ===== 端侧节点 =====
box('n1',16,512,96,48,'1.用户语音query',['speaker/position'],fs=9)
box('n2',164,512,150,48,'2.ASR 转文字(端)',[],tfs=11)
box('n3',84,624,124,110,'3.端信号源',['端状态/视觉VLM/埋点','导航[围栏][需10·11]','音频[需13]/时间[需7]','6类信号→④信号库'],fs=9)
box('n4',378,624,118,58,'4.端侧信号库',['标准化快照+任务状态[需1]'],fs=9)
box('n5',524,506,122,54,'5.离线fc+白名单',['简单车控召回·弱网端ASR直驱'],fs=8.8)
diamond('n6',712,620,150,78,'6.命中白名单?',['是→端 / 否→云'])
box('n7',648,712,132,50,'7.原子车控执行(端)',['毫秒级·不进大脑'],fs=9)
box('n8',648,812,132,48,'8.车控生效+卡片→用户',[],tfs=10.5)
eng('n24',974,500,380,248,'24.触发器引擎(端侧·VLM任务调度·原子级)',[
 ('24-1 规则接收·灰度/回滚',1),('24-2 本地持久化·重启恢复',1),
 ('24-3 信号扫描·500ms对齐',1),('24-4 两级判定·时段→触发',1),
 ('24-5 本地定时器·弱网⚠',1),('24-6 防抖冷却·Always-on 3s/5s',1),
 ('24-7 优先级·互斥CABIN/FRONT',1),('24-8 VLM调度·7字段·抢占',1),
 ('24-9 VLM五态·超时不写伪果',1),('24-10 阈值穿越·last=F&this=T',1),
 ('24-11 结果回写·二次触发→Context',1),('24-12 动作执行·车控/TTS/弱网',1),
],'#fff3e6','#ea580c',need='需9·待建')
box('n25',980,752,170,68,'25.感知订阅→感知器(端)',['二排宝宝/周边/风景·vlm定时捞图','阈值穿越:last=F&this=T才触发','event(瞬时)/state(持续)→VQA'],fs=8.5)
box('n26',1882,512,162,48,'26.TTS播报→端+卡片(端)',[],tfs=10.5)
box('n27',1882,622,162,58,'27.机器人[需4]',['选形象→圆屏/云台·表情↔TTS并行'],fs=8.5)
box('n28',1882,724,162,48,'28.车控执行(端)',[],tfs=11)
box('n29',1700,824,100,48,'29.输出',[],tfs=12)
L.append('<rect x="338" y="712" width="184" height="96" rx="8" fill="#fef9c3" stroke="#eab308" stroke-width="1.2"/>')
for i,s in enumerate(['触发器只读信号库，绝','不直接监听原始信号源','—这样解耦，信号源怎','么变触发器不用改。','        — 王泽民']):
    L.append(f'<text x="348" y="{732+i*16}" font-size="10" fill="#713f12">{esc(s)}</text>')

# ===== 连线（按4路径分色） =====
# 共用入口（灰）
edge([AN('n1','r'),AN('n2','l')],GY,'①开口→转文字',lx=140,ly=532)
edge([AN('n2','t'),(239,420),(250,150)],GY,'②上云·判意图',lx=270,ly=430,bold=True)
# 信号底座（amber）
edge([AN('n3','r'),(360,653),AN('n4','l')],SIG,'信号→入库',lx=345,ly=645)
edge([AN('n11','r'),AN('n12','l')],SIG,'云信号并入库',lx=146,ly=273)
edge([AN('n4','t'),(437,560),(239,470),(239,304),AN('n12','b')],SIG,'端信号同步上云(全集)',lx=300,ly=580,bold=True)
edge([AN('n12','r'),(330,277),(700,300),(730,300)],SIG,'快照→供引擎判定',lx=520,ly=300)
# 路径① 简单车控（蓝）
edge([AN('n9','b'),(250,210),(250,490),AN('n5','l')],P1,'判明简单车控→甩回端(快)',bold=True,lx=300,ly=480)
edge([AN('n5','r'),(680,520),(665,595)],P1,'白名单匹配',lx=672,ly=540)
edge([AN('n6','b'),AN('n7','t')],P1,'是',lx=712,ly=690)
edge([AN('n7','b'),AN('n8','t')],P1,'',)
edge([AN('n6','r'),(900,620),(960,575),AN('n24','l')],P1,'未命中→回云处理',dash='4,3',lx=890,ly=576)
# 路径② 对话/复杂（绿）
edge([AN('n9','r'),(850,74),(1410,160)],P2,'复杂对话→直达大脑',bold=True,lx=940,ly=66)
edge([AN('n19','b'),AN('n20','t')],P2,'汇入→大脑推理',lx=1540,ly=246)
edge([AN('n20','r'),(1745,260),AN('n22','b')],P2,'推理出动作→调工具',lx=1740,ly=250)
edge([AN('n22','b'),(1864,260),(1662,250)],P2,'工具结果→回大脑二次推理',lx=1772,ly=300)
edge([AN('n20','r'),AN('n23','l')],P2,'推卡片/任务岛',lx=1760,ly=278)
edge([AN('n20','b'),(1535,306),(1745,480),AN('n26','t')],P2,'要说的话→端侧TTS',bold=True,lx=1740,ly=478)
edge([AN('n20','b'),(1535,306),(1810,510),AN('n27','t')],P2,'要做的动作→端机器人/车控',bold=True,lx=1660,ly=430)
edge([AN('n26','b'),(1760,560),(1740,820)],P2,'播报→用户听到',lx=1772,ly=620)
# 路径③ 条件/定时任务（橙）
edge([AN('n9','l'),(120,74),(120,170),AN('n10','l')],P3,'判明条件话→送意图解析',lx=150,ly=172)
edge([AN('n10','r'),(355,176),AN('n13','l')],P3,'译成协议→注册成场景',lx=375,ly=166)
edge([AN('n13','r'),AN('n15','l')],P3,'场景=引擎判定依据',lx=705,ly=212)
edge([AN('n24','r'),(1362,560),(1382,330),AN('n20','b')],P3,'命中→通知大脑执行(经Context⚠)',lx=1190,ly=400)
edge([AN('n20','l'),(1392,290),(1330,386),(1092,300)],P3,'对话产生条件任务→注册(经云端中转⚠)',lx=1230,ly=290)
edge([AN('n15','b'),(910,358),(910,492),AN('n24','t')],P3,'规则下发端侧(弱网也能跑)',bold=True,lx=910,ly=458)
edge([AN('n3','b'),(146,750),(146,995),(1010,995),(1100,734)],P3,'端信号→端侧引擎扫描',lx=600,ly=987)
# 路径④ 主动服务（紫）
edge([AN('n15','r'),(1095,180),AN('n16','l')],P4,'命中→唤起静态Advisor',lx=1096,ly=170)
edge([AN('n16','r'),(1300,162),(1410,165)],P4,'想完→建议回大脑',lx=1342,ly=152)
edge([AN('n15','r'),(1100,320),AN('n17','l')],P4,'命中→唤起动态Advisor',lx=1098,ly=320)
edge([AN('n17','r'),(1342,280),(1410,210)],P4,'动态建议回大脑',lx=1360,ly=266)
edge([AN('n18','b'),(1540,118),AN('n19','t')],P4,'目标看板→汇入',lx=1562,ly=128)
edge([AN('n17','b'),(1150,480),AN('n25','t')],P4,'下发视觉订阅给感知器',lx=1300,ly=500)
edge([AN('n25','r'),(1216,786),(1216,372),(1180,358)],P4,'识别结果回Advisor',lx=1248,ly=500)
# Context注入（青）
edge([AN('n21','r'),(1700,340),(1700,300),(1662,288)],CY,'Context注入大脑',lx=1690,ly=332)

# ===== 底部：4路径讲解 + 关键依据 =====
by=1030
L.append(f'<rect x="20" y="{by}" width="1060" height="530" rx="9" fill="#ffffff" stroke="#cbd5e1"/>')
L.append(f'<text x="34" y="{by+22}" font-size="14" font-weight="bold" fill="#0f172a">评审讲解脚本 · 4条路径逐条走（出自《业务流程讲解稿》）</text>')
scripts=[
 (P1,'路径① 简单车控（最快·不进大脑）  例:"打开车窗"',['①说话→②ASR→L2上云→⑨拒识=简单车控→L3甩回端→⑤离线fc+白名单','→⑥命中?→是→⑦原子车控执行→⑧生效+卡片→用户。全程不进大脑,端侧毫秒级。']),
 (P2,'路径② 对话/复杂（走大脑）  例:"我好热""附近有招行吗"',['①→②→⑨拒识=复杂→L5直达⑲Director汇入(注入㉑Context:车内28度/记忆)→⑳推理','→扇出: L29 TTS / L27工具→L32回⑲二次推理 / L30机器人车控 / L28任务中心。']),
 (P3,'路径③ 条件/定时任务（走触发器）  例:"超25度开空调""10分钟后关加热"',['①→②→⑨=条件话→L4→⑩意图解析成协议→L11→⑬后台注册成"场景"→L13→⑮引擎;','信号线 ③→④→L9→⑫→L12→⑮; ⑮命中→L21通知⑲执行; ⑳也会L33注册条件任务回⑮。']),
 (P4,'路径④ 主动服务（用户不开口·车自己动）  例:上车打招呼/副驾睡着调音乐',['信号同前→⑮命中→L17→⑯静态Advisor(舒适/出行/情感/内容)→L19建议回⑲;','→L18→⑰动态Advisor(一目标一·订阅㉕感知器VLM阈值穿越)→L20建议回⑲→⑳执行。']),
]
yy=by+40
for c,t,ls in scripts:
    L.append(f'<rect x="34" y="{yy-12}" width="10" height="{14+len(ls)*14}" rx="2" fill="{c}"/>')
    L.append(f'<text x="52" y="{yy}" font-size="11.5" font-weight="bold" fill="{c}">{esc(t)}</text>')
    yy+=16
    for s in ls: L.append(f'<text x="52" y="{yy}" font-size="10" fill="#334155">{esc(s)}</text>'); yy+=14
    yy+=12
L.append(f'<text x="34" y="{by+500}" font-size="10.5" fill="#64748b">端侧触发器㉔=需求9待建(全堆云,弱网就废)·5条回环:L32工具→大脑/L33注册/L16 VLM回写/L19-21建议回灌/L9端云同步</text>')

def panel(x,y,w,h,t,tc,rows):
    L.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="9" fill="#ffffff" stroke="{tc}" stroke-width="1.4"/>')
    L.append(f'<rect x="{x}" y="{y}" width="{w}" height="24" rx="9" fill="{tc}"/><rect x="{x}" y="{y+12}" width="{w}" height="12" fill="{tc}"/>')
    L.append(f'<text x="{x+10}" y="{y+17}" font-size="11.5" font-weight="bold" fill="#fff">{esc(t)}</text>')
    yy=y+40
    for r in rows:
        cc='#dc2626' if '⚠' in r else '#334155'
        L.append(f'<text x="{x+10}" y="{yy}" font-size="9.4" fill="{cc}">{esc(r)}</text>'); yy+=14.5
panel(1100,by,1040,170,'对外接口/DSL（节点13·逐字核对接口文档·DSL定义）','#0891b2',[
 '6 REST · /aidv/v1/trigger · HMAC-SHA256(AK:sign)   ·   actions: comfort_advisor/emotion_advisor/recommend/custom_callback',
 'GET /signals  GET /actions(vehicle_id=trigger)  POST /scene  POST /scene/update  GET /scene  POST /scene/update_status(1生效2失效3删)',
 'Condition{code,operator,value,logic,group_index,group_logic}  Option{type,value}  Action{code,params,execute_info{repeat_num,repeat_interval(纳秒)}}',
 'operator: = > >= < <=  ⚠range ⚠持续时长 ⚠group   ·   dynamic_conditions:operator_name=变更为/等于   ·   priority 1-10(Planner默认最高)',
 'execute_policy{total_count,daily_count,power_count,execute_interval(秒)}   effective_scope{vehicle_type,client(版本),vehicle_id(VIN)}',
 '真实信号: vehicle_control_0013空调/0004速度/0021温度/0028车门  ·  vlm: people(位置/性别)、cabin_contents(儿童座椅)',
])
panel(1100,by+182,515,180,'端云职责边界 + 运行指令','#ea580c',[
 '云端触发器(15): 注册校验·扫云信号·条件判定','  ·去抖冷却·优先级仲裁·标准事件·Callback路由',
 '端侧触发器(24): 本地定时器·弱网AIPUSH·持久化','  ·两级判定·五态·抢占恢复·网络恢复同步',
 'VLM调度(25): 视觉订阅·阈值穿越·VQA·终态回写',
 '运行指令7字段: task_id/task_goal/priority/timeout/','  mutex_group/trigger_source/expire_at',
 '互斥组: VLM_CABIN / VLM_FRONT',
])
panel(1625,by+182,515,180,'三处修正(对齐5/7西钺) + 8项待确认','#dc2626',[
 '① 动态注册(L33)经云端触发器中转,非17直连24',
 '② 端侧结果(L21)走信号库→Context,不直推上层',
 '③ 判定不双判:上汽走云15/赛力斯走端24',
 '④阈值穿越 ⑤Always-on闲时持续 ⑥timeout禁写无异常',
 '待确认⚠: range/持续时长/group · VLM并发1? ·',
 '  端侧定时器持久化 · 图片服务 · callback重试 · CDC边界',
 '红线: 触发器只管"何时唤醒",复杂决策回Director',
])
L.append('</svg>')
out='/Users/bytedance/Desktop/3.23/产品-端侧触发器/diagrams-v2/触发器全模块大图-终版.svg'
open(out,'w').write('\n'.join(L)); print('written',len(L),'lines')
