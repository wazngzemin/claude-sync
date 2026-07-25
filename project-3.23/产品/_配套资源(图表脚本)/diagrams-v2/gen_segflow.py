# -*- coding: utf-8 -*-
# 为讲稿每一段重画一张"只含该段模块"的干净流程图(不是大图截框)
# 同样的模块/配色,但每段只保留它讲到的节点,按该段流程重新排布连线
import json, os
HERE=os.path.dirname(os.path.abspath(__file__))

def esc(s): return s.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;')

GY='#64748b';P1='#2563eb';P2='#16a34a';P3='#ea580c';P4='#7c3aed';SIG='#a16207';CY='#0891b2';RED='#dc2626';PU='#6d28d9'
COLORS=[GY,P1,P2,P3,P4,SIG,CY,RED,PU]
ZONE={
 'entry':('#f1f5f9','#475569'),'signal':('#fef9c3','#a16207'),'cloud':('#e8f1ff','#2563eb'),
 'edge':('#fff3e6','#ea580c'),'advisor':('#f3e8ff','#7c3aed'),'director':('#ede9fe','#6d28d9'),
 'context':('#ecfeff','#0891b2'),'exec':('#dcfce7','#16a34a'),'before':('#fee2e2','#dc2626'),'vlm':('#faf5ff','#9333ea'),
}

class F:
    def __init__(self,W,H):
        self.W=W;self.H=H;self.reg={}
        self.l=[f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" font-family="-apple-system,PingFang SC,Microsoft YaHei,sans-serif">']
        self.l.append('<defs>')
        for c in COLORS:
            self.l.append(f'<marker id="a-{c[1:]}" markerWidth="11" markerHeight="9" refX="8.5" refY="4.2" orient="auto"><path d="M0,0 L10,4.2 L0,8.4 z" fill="{c}"/></marker>')
        self.l.append('<filter id="sh" x="-5%" y="-6%" width="110%" height="124%"><feDropShadow dx="0" dy="1" stdDeviation="1.1" flood-color="#000" flood-opacity="0.13"/></filter></defs>')
        self.l.append(f'<rect width="{W}" height="{H}" fill="#ffffff"/>')
    def box(self,nid,x,y,w,h,title,subs=None,zone='cloud',tfs=13,fs=10.5):
        fill,stroke=ZONE[zone]; self.reg[nid]=(x,y,w,h)
        self.l.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="9" fill="{fill}" stroke="{stroke}" stroke-width="1.7" filter="url(#sh)"/>')
        ty=y+(20 if subs else h/2+4)
        self.l.append(f'<text x="{x+w/2}" y="{ty}" text-anchor="middle" font-size="{tfs}" font-weight="bold" fill="#0f172a">{esc(title)}</text>')
        if subs:
            yy=y+38
            for s in subs:
                self.l.append(f'<text x="{x+w/2}" y="{yy}" text-anchor="middle" font-size="{fs}" fill="#475569">{esc(s)}</text>'); yy+=16
    def diamond(self,nid,cx,cy,w,h,title,subs=None):
        self.reg[nid]=(cx-w/2,cy-h/2,w,h)
        self.l.append(f'<path d="M {cx},{cy-h/2} L {cx+w/2},{cy} L {cx},{cy+h/2} L {cx-w/2},{cy} Z" fill="#fff7ed" stroke="{P3}" stroke-width="1.8" filter="url(#sh)"/>')
        self.l.append(f'<text x="{cx}" y="{cy+(4 if not subs else -4)}" text-anchor="middle" font-size="12" font-weight="bold" fill="#9a3412">{esc(title)}</text>')
        if subs:
            yy=cy+12
            for s in subs: self.l.append(f'<text x="{cx}" y="{yy}" text-anchor="middle" font-size="9.5" fill="#7c2d12">{esc(s)}</text>'); yy+=12
    def group(self,x,y,w,h,title,color):
        self.l.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="11" fill="none" stroke="{color}" stroke-width="1.6" stroke-dasharray="6,4"/>')
        self.l.append(f'<rect x="{x+12}" y="{y-11}" width="{len(title)*15+16}" height="22" rx="11" fill="{color}"/>')
        self.l.append(f'<text x="{x+20}" y="{y+4}" font-size="12" font-weight="bold" fill="#fff">{esc(title)}</text>')
    def atom(self,nid,x,y,w,title,stroke):
        h=26; self.reg[nid]=(x,y,w,h)
        self.l.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="5" fill="#fff" stroke="{stroke}" stroke-width="1.1"/>')
        self.l.append(f'<text x="{x+8}" y="{y+17}" font-size="10.2" fill="#1f2937">{esc(title)}</text>')
    def A(self,spec):
        nid,side=spec; x,y,w,h=self.reg[nid]
        return {'t':(x+w/2,y),'b':(x+w/2,y+h),'l':(x,y+h/2),'r':(x+w,y+h/2)}[side]
    def arr(self,a,b,color=GY,label='',via=None,dash='',bold=False,lx=None,ly=None):
        pa=self.A(a) if isinstance(a,tuple) and isinstance(a[0],str) else a
        pb=self.A(b) if isinstance(b,tuple) and isinstance(b[0],str) else b
        pts=[pa]+(via or [])+[pb]
        d='M '+' L '.join(f'{p[0]},{p[1]}' for p in pts)
        da=f' stroke-dasharray="{dash}"' if dash else ''; wd=3.0 if bold else 1.9
        self.l.append(f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{wd}"{da} marker-end="url(#a-{color[1:]})"/>')
        if label:
            mx=lx if lx is not None else (pts[0][0]+pts[-1][0])/2
            my=ly if ly is not None else (pts[0][1]+pts[-1][1])/2
            bw=len(label)*11.2+10
            self.l.append(f'<rect x="{mx-bw/2}" y="{my-10}" width="{bw}" height="19" rx="4" fill="#fff" opacity="0.97" stroke="{color}" stroke-width="0.6"/>')
            self.l.append(f'<text x="{mx}" y="{my+3.5}" text-anchor="middle" font-size="10.5" font-weight="bold" fill="{color}">{esc(label)}</text>')
    def note(self,x,y,lines,color='#713f12',bg='#fef9c3',bc='#eab308'):
        h=len(lines)*16+14; w=max(len(s) for s in lines)*11+24
        self.l.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{bg}" stroke="{bc}" stroke-width="1.1"/>')
        for i,s in enumerate(lines): self.l.append(f'<text x="{x+12}" y="{y+22+i*16}" font-size="10.5" fill="{color}">{esc(s)}</text>')
    def svg(self): return '\n'.join(self.l)+'\n</svg>'

S={}  # seg svg

# ===== 第1段:目的(短期→长期升级) =====
f=F(1060,250)
f.box('a',50,70,420,120,'短期方案(逻辑写死)',['信号直连动作 · 规则不可配','弱网不稳 · VLM结果不可复用','Advisor/Director 拿不到统一事件'],'before',fs=11)
f.box('b',610,70,400,120,'长期方案 · 端云协同触发器',['可配置 DSL · 端云分工','弱网本地履约 · 结果回 Context','统一标准事件 → Advisor/Director'],'exec',fs=11)
f.arr(('a','r'),('b','l'),P2,'量产化升级',bold=True)
S[1]=f.svg()

# ===== 第2段:四区域全貌 =====
f=F(1340,470)
f.box('z1',40,80,290,340,'① 入口区',['拿事实','① 用户语音 query','② ASR 转文字','③ 端信号源 / ④ 端信号库','⑪ 云信号源 / ⑫ 云信号库'],'entry',tfs=14,fs=11)
f.box('z2',390,80,300,340,'② 触发器',['判时机(今天主角)','⑬ 规则平台 / ⑭ 条件解析','⑮ 云端触发器(云)','㉔ 端侧触发器(端)','㉕ 感知订阅 / VLM'],'cloud',tfs=14,fs=11)
f.box('z3',750,80,290,340,'③ 智能决策',['决定说不说/做什么','⑯/⑰ Advisor 建议','⑱ Goal List 看板','⑲/⑳ Director 大脑','㉑ Context 事实'],'advisor',tfs=14,fs=11)
f.box('z4',1100,80,200,340,'④ 执行触达',['说·做·反馈','㉒ 工具 / ㉓ 任务中心','㉖ TTS / ㉗ 机器人','㉘ 车控 / ㉙ 输出'],'exec',tfs=14,fs=11)
f.arr(('z1','r'),('z2','l'),GY,'')
f.arr(('z2','r'),('z3','l'),GY,'')
f.arr(('z3','r'),('z4','l'),GY,'')
f.note(390,430,['横向还有云端/端侧分界:⑮在云端、㉔在端侧;上面登记裁决,下面本地履约'])
S[2]=f.svg()

# ===== 第3段:入口 =====
f=F(1080,430)
f.box('n1',40,70,180,58,'① 用户语音 query',['speaker / position'],'entry',fs=10)
f.box('n2',280,70,160,58,'② ASR 转文字',[],'entry')
f.box('n9',520,62,200,74,'⑨ 拒识 / 意图分流',['所有语音第一关'],'cloud')
f.box('n3',40,200,180,64,'③ 端信号源',['车门/座椅/温度/VLM…'],'signal',fs=10)
f.box('n4',300,202,160,58,'④ 端侧信号库',['标准化快照'],'signal')
f.box('n11',40,310,180,52,'⑪ 云信号源',[],'signal')
f.box('n12',300,308,160,58,'⑫ 云端信号库',['端信号同步上来(全集)'],'signal',fs=9.5)
f.box('rd',560,232,220,90,'触发器只读信号库',['⑮/㉔ 只读标准信号','不碰原始信号源','→ 规则可跨车型复用'],'cloud',fs=10)
f.arr(('n1','r'),('n2','l'),GY,'开口→转文字')
f.arr(('n2','r'),('n9','l'),GY,'上云判意图')
f.arr(('n3','r'),('n4','l'),SIG,'入库')
f.arr(('n11','r'),('n12','l'),SIG,'入库')
f.arr(('n4','b'),('n12','t'),SIG,'端信号同步上云',via=[(380,290)],bold=True)
f.arr(('n12','r'),('rd','l'),SIG,'快照供判定')
S[3]=f.svg()

# ===== 第4段:⑨分流 =====
f=F(1120,450)
f.box('n9',50,180,210,100,'⑨ 拒识 / 仲裁 / 意图',['ASR 后第一分流口','判错→后面全错'],'cloud',tfs=14,fs=11)
f.box('t1',440,55,360,56,'① 简单车控 → ⑤ 端侧闭环',['例:"打开车窗" · 尽量端侧毫秒级'],'entry',fs=10)
f.box('t2',440,140,360,56,'② 复杂对话 → ⑲ Director 大脑',['例:"我好热" / "附近招行"'],'entry',fs=10)
f.box('t3',440,225,360,56,'③ 条件/定时 → ⑩→⑬ 触发器注册',['例:"超25度开空调" / "10分钟后…"'],'entry',fs=10)
f.box('t4',440,310,360,56,'④ 拒识 → ㉚ Context 日志',['没听懂/能力不支持 → 沉淀排查'],'entry',fs=10)
f.arr(('n9','r'),('t1','l'),P1,'',via=[(360,208),(360,83)])
f.arr(('n9','r'),('t2','l'),P2,'',via=[(380,230),(380,168)])
f.arr(('n9','r'),('t3','l'),P3,'',via=[(380,252),(380,253)])
f.arr(('n9','r'),('t4','l'),GY,'',via=[(360,252),(360,338)])
S[4]=f.svg()

# ===== 第5段:蓝线 简单车控 =====
f=F(1120,400)
f.box('n1',40,70,130,52,'① 语音',[],'entry')
f.box('n2',210,70,130,52,'② ASR',[],'entry')
f.box('n9',380,62,180,68,'⑨ 判=简单车控',['不进大脑/不注册'],'cloud',fs=10)
f.box('n5',600,68,190,58,'⑤ 离线fc+白名单',['弱网端ASR直驱'],'edge',fs=10)
f.diamond('n6',940,98,170,84,'⑥ 命中白名单?',['是→端 / 否→云'])
f.box('n7',840,230,200,54,'⑦ 原子车控执行',['毫秒级·不进大脑'],'exec',fs=10)
f.box('n8',840,320,200,52,'⑧ 生效+卡片→用户',[],'exec')
f.box('n24',560,300,200,54,'㉔ 未命中→回云处理',[],'edge',fs=10)
f.arr(('n1','r'),('n2','l'),GY)
f.arr(('n2','r'),('n9','l'),GY)
f.arr(('n9','r'),('n5','l'),P1,'甩回端(快)')
f.arr(('n5','r'),('n6','l'),P1,'白名单匹配')
f.arr(('n6','b'),('n7','t'),P1,'是')
f.arr(('n7','b'),('n8','t'),P1)
f.arr(('n6','l'),('n24','t'),P1,'否',via=[(855,140),(660,140),(660,300)],dash='5,3')
S[5]=f.svg()

# ===== 第6段:绿线 复杂对话 =====
f=F(1200,440)
f.box('n9',40,190,170,68,'⑨ 判=复杂对话',['表达感受非指令'],'cloud',fs=10)
f.box('n19',260,170,220,100,'⑲ Director 汇入',['query/建议/反馈','通知/GoalList/Context'],'director',fs=10)
f.box('n21',260,320,220,56,'㉑ Context',['偏好/端状态/记忆/日志'],'context',fs=9.5)
f.box('n20',540,180,200,84,'⑳ Director 推理(大脑)',['talk_or_not','talk_content / action_list'],'director',fs=9.5)
f.box('n26',810,55,330,46,'㉖ TTS 播报 → 用户听到',[],'exec',fs=10)
f.box('n22',810,135,330,46,'㉒ 工具库 → tool_feedback',[],'exec',fs=10)
f.box('n27',810,215,330,46,'㉗㉘ 机器人 / 车控执行',[],'exec',fs=10)
f.box('n23',810,295,330,46,'㉓ 任务中心 / 卡片岛',[],'exec',fs=10)
f.arr(('n9','r'),('n19','l'),P2,'进大脑')
f.arr(('n21','t'),('n19','b'),CY,'注入')
f.arr(('n19','r'),('n20','l'),P2,'汇入推理')
f.arr(('n20','r'),('n26','l'),P2,'要说的话',via=[(770,78)])
f.arr(('n20','r'),('n27','l'),P2,'要做的动作',via=[(770,238)])
f.arr(('n20','r'),('n23','l'),P2,'',via=[(775,318)])
f.arr(('n22','l'),('n19','b'),P2,'工具结果→二次推理',via=[(560,158),(420,290)],dash='5,3',lx=590,ly=150)
S[6]=f.svg()

# ===== 第7段:橙线 条件/定时 =====
f=F(1260,470)
f.box('n9',40,70,160,60,'⑨ 判=条件话',[],'cloud',fs=10)
f.box('n10',240,66,180,68,'⑩ 意图解析',['拆成 条件+动作'],'cloud',fs=10)
f.box('n13',460,60,220,80,'⑬ 规则配置平台',['生成DSL/scene','查信号·查动作'],'cloud',fs=10)
f.box('n15',720,60,210,80,'⑮ 云端触发器引擎',['登记/判定/分类/下发'],'cloud',fs=10)
f.box('n159',720,190,210,54,'15-9 端云分类',['按任务类型分流'],'cloud',fs=10)
f.box('o1',980,150,250,44,'留云端(复杂语义)',[],'cloud',fs=10)
f.box('o2',980,200,250,44,'下发 ㉔(弱网/定时)',[],'edge',fs=10)
f.box('o3',980,250,250,44,'转 VLM 视觉订阅',[],'vlm',fs=10)
f.box('o4',980,300,250,44,'命中→回 ⑳ Director',[],'director',fs=10)
f.box('n3',40,330,150,50,'③ 端信号',[],'signal',fs=10)
f.box('n4',210,330,150,50,'④ 信号库',[],'signal',fs=10)
f.box('n12',380,330,170,50,'⑫ 云信号库',[],'signal',fs=10)
f.arr(('n9','r'),('n10','l'),P3)
f.arr(('n10','r'),('n13','l'),P3,'译成协议')
f.arr(('n13','r'),('n15','l'),P3,'注册成场景')
f.arr(('n15','b'),('n159','t'),P3)
f.arr(('n159','r'),('o1','l'),P3,'',via=[(950,172)])
f.arr(('n159','r'),('o2','l'),P3,'',via=[(950,217)])
f.arr(('n159','r'),('o3','l'),P3,'',via=[(950,250)])
f.arr(('n159','r'),('o4','l'),P3,'',via=[(950,255),(950,322)])
f.arr(('n3','r'),('n4','l'),SIG)
f.arr(('n4','r'),('n12','l'),SIG)
f.arr(('n12','t'),('n15','b'),SIG,'信号供判定',via=[(465,300),(825,250)])
S[7]=f.svg()

# ===== 第8段:15引擎 12原子 分阶段 =====
f=F(1300,360)
stages=[('注册登记',P1,40,['15-1 注册校验·iCanDo','15-2 场景库·静/动/预设','15-3 信号扫描·只读']),
        ('判定',P3,360,['15-4 条件判定·运算符','15-5 模型推理·VLM语义','15-6 抖动过滤','15-7 冷却频控']),
        ('仲裁分类',PU,690,['15-8 优先级仲裁·P0-P4','15-9 端云分类·云/端/VLM']),
        ('输出下发',P2,960,['15-10 标准事件·snapshot','15-11 Callback路由','15-12 场景下发·全/增/灰'])]
gx=[]
for name,col,x,atoms in stages:
    gh=60+len(atoms)*32
    f.group(x,90,290,gh,name,col); gx.append((x,col,gh))
    for i,at in enumerate(atoms): f.atom(f's{x}_{i}',x+16,120+i*32,258,at,col)
for i in range(len(stages)-1):
    x1=stages[i][2]; x2=stages[i+1][2]
    f.arr((x1+290,170),(x2,170),GY)
f.box('out',520,300,260,46,'→ 命中:回Director / 下发㉔ / 写Context',[],'cloud',fs=9.5)
S[8]=f.svg()

# ===== 第9段:24引擎 12原子 分阶段 =====
f=F(1320,430)
stages=[('接收·持久',P3,40,['24-1 规则接收·灰度/回滚','24-2 本地持久化·重启恢复']),
        ('扫描判定',P1,300,['24-3 信号扫描·500ms','24-4 两级判定·时段→触发']),
        ('定时·防抖·仲裁',P4,560,['24-5 本地定时器·弱网','24-6 防抖冷却·Always-on 3s/5s','24-7 优先级·互斥·抢占恢复']),
        ('VLM',PU,860,['24-8 VLM调度·7字段','24-9 VLM五态·超时不伪果','24-10 阈值穿越·F→T']),
        ('回写·执行',P2,1120,['24-11 结果回写·Context','24-12 动作执行·白名单'])]
for name,col,x,atoms in stages:
    gh=60+len(atoms)*32; w=250 if x<1120 else 180
    f.group(x,90,w,gh,name,col)
    for i,at in enumerate(atoms): f.atom(f't{x}_{i}',x+14,120+i*32,w-28,at,col)
xs=[s[2] for s in stages]; ws=[250,250,250,250,180]
for i in range(len(stages)-1):
    f.arr((xs[i]+ws[i],168),(xs[i+1],168),GY)
f.note(40,330,['常开感知 Always-on:摄像头持续盯(二排宝宝/副驾) → 24-6 给冷却(P0不冷却·其余 3s/5s)',
               '它一直占着摄像头 → 高优先级 VQA 来 → 24-7 抢占 → 执行 → 再恢复 Always-on'],color='#7c2d12',bg='#fef3c7',bc='#d97706')
S[9]=f.svg()

# ===== 第10段:VLM链路(顺链) =====
f=F(1340,440)
# 云端行
r1=[('n17','⑰ 提目标',P4),('a151','15-1 校验',P1),('a152','15-2 入库',P1),('a155','15-5 转VLMtask',P1),('a159','15-9 分类',P1),('a1512','15-12 下发',P1)]
for i,(nid,t,c) in enumerate(r1): f.box(nid,40+i*210,70,180,52,t,[],'vlm' if i==0 else 'cloud',fs=10)
for i in range(len(r1)-1): f.arr((r1[i][0],'r'),(r1[i+1][0],'l'),P4)
# 端侧行
r2=[('a241','24-1 接收',P3),('a247','24-7 仲裁',P3),('a248','24-8 调度',P3),('n25','㉕ 执行VQA',P2),('a249','24-9 五态',P3),('a2410','24-10 阈值穿越',P3),('a2411','24-11 回写Context',P2)]
for i,(nid,t,c) in enumerate(r2): f.box(nid,40+i*186,250,166,52,t,[],'edge' if c==P3 else ('exec' if c==P2 else 'cloud'),fs=9.5)
for i in range(len(r2)-1): f.arr((r2[i][0],'r'),(r2[i+1][0],'l'),P4)
f.arr(('a1512','b'),('a241','t'),P4,'下发到端',via=[(1090,160),(123,210)],bold=True,lx=600,ly=185)
f.box('cons',520,360,300,52,'⑰ Advisor / ⑲ Director 从 Context 消费',['端侧不直接通知 Advisor'],'context',fs=9.5)
f.arr(('a2411','b'),('cons','r'),CY,'',via=[(1175,330),(830,386)])
S[10]=f.svg()

# ===== 第11段:Advisor/Director/Context =====
f=F(1140,430)
f.box('n16',40,70,220,60,'⑯ 静态Advisor',['预置:舒适/出行/情感/内容'],'advisor',fs=10)
f.box('n17',40,165,220,76,'⑰ 动态Advisor',['一目标一监控','订阅㉕ VLM 结果'],'advisor',fs=10)
f.box('n18',40,290,220,54,'⑱ Goal List',['目标队列·防打架'],'advisor',fs=10)
f.box('n19',340,140,210,96,'⑲ Director 汇入',['统一收口 6 路'],'director',fs=10)
f.box('n20',600,150,200,76,'⑳ Director 推理',['说不说/说什么/做什么'],'director',fs=10)
f.box('n21',340,300,210,58,'㉑ Context',['统一事实源'],'context',fs=10)
f.box('edge',840,290,260,68,'㉔ 端侧结果',['写信号库 → 上报 ㉑Context','红线:不直接通知 Advisor'],'edge',fs=9.5)
f.arr(('n16','r'),('n19','l'),P4,'建议')
f.arr(('n17','r'),('n19','l'),P4,'建议')
f.arr(('n18','r'),('n19','l'),P4,'目标',via=[(300,317),(300,210)])
f.arr(('n21','t'),('n19','b'),CY,'注入')
f.arr(('n19','r'),('n20','l'),PU,'推理')
f.arr(('edge','l'),('n21','r'),RED,'经Context',via=[(560,324)])
S[11]=f.svg()

# ===== 第12段:异常/降级/待拍板(5问) =====
f=F(1240,520)
rows=[('弱网怎么办?',['已下发端侧定时/白名单 → ㉔ 本地履约','未下发/需复杂语义 → 不假装执行成功'],P3),
      ('VLM 异常怎么办?',['㉕ failed / timeout · 24-9 归一五态','timeout 禁写"无异常" · 24-11 都回写Context'],PU),
      ('冲突怎么办?',['云端 15-8 业务优先级+互斥仲裁','端侧 24-7 只做本地资源抢占(CABIN/FRONT)'],P4),
      ('端侧能执行啥?',['白名单:TTS/卡片/AI Push/低风险车控 直执','涉安全/确认/复杂语义 → 回 ⑳ Director'],P2),
      ('接口/DSL 拍板',['15-4 range/持续/group · 15-5 VLM字段','15-12→24-1 规则包 · 一期/二期?'],RED)]
for i,(q,hs,col) in enumerate(rows):
    y=60+i*88
    f.box(f'q{i}',40,y,250,62,q,[],'entry',tfs=13)
    f.l.append(f'<rect x="40" y="{y}" width="6" height="62" rx="3" fill="{col}"/>')
    f.box(f'h{i}',360,y,820,62,'',hs,'cloud',fs=11)
    f.arr((f'q{i}','r'),(f'h{i}','l'),col)
S[12]=f.svg()

for i in range(1,13):
    open(os.path.join(HERE,f'segflow{i:02d}.svg'),'w',encoding='utf-8').write(S[i])
json.dump({str(k):v for k,v in S.items()},open(os.path.join(HERE,'segflow_manifest.json'),'w',encoding='utf-8'),ensure_ascii=False)
print('done 12 seg-flow svgs')
for i in range(1,13): print(f'  segflow{i:02d}.svg  {len(S[i])}b')
