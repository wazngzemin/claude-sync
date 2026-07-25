# -*- coding: utf-8 -*-
# 触发器全模块图 · 飞书画板原生 SVG（Raw Grid 底 + 4路径连线色）
# 只用 rect/line/polyline/text + 单个 marker；无 filter/gradient/polygon/font-family
L=[]
BLACK="#0A0A0A"; GRAY="#F5F5F5"; SAGE="#E5EDD6"; BLUSH="#F2D4CF"; DGRAY="#333333"
P1="#2563eb"; P2="#0f9f6e"; P3="#e2630f"; P4="#7c3aed"; SIG="#a16207"
def esc(s): return s.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;')
def shadow(x,y,w,h,off=6):
    L.append(f'<rect x="{x+off}" y="{y+off}" width="{w}" height="{h}" fill="{BLACK}"/>')
def node(x,y,w,h,num,title,subs,fill="#FFFFFF",tcol=BLACK,off=6):
    shadow(x,y,w,h,off)
    L.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{fill}" stroke="{BLACK}" stroke-width="3"/>')
    if num:
        L.append(f'<text x="{x+14}" y="{y+30}" font-size="17" font-weight="700" fill="{tcol}">{esc(num)}</text>')
        L.append(f'<text x="{x+46}" y="{y+30}" font-size="16" font-weight="700" fill="{tcol}">{esc(title)}</text>')
    else:
        L.append(f'<text x="{x+w/2}" y="{y+30}" text-anchor="middle" font-size="16" font-weight="700" fill="{tcol}">{esc(title)}</text>')
    ty=y+52
    for s in subs:
        L.append(f'<text x="{x+14}" y="{ty}" font-size="13.5" fill="{DGRAY}">{esc(s)}</text>'); ty+=21
def engine(x,y,w,h,title,atoms,fill):
    shadow(x,y,w,h,6)
    L.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{fill}" stroke="{BLACK}" stroke-width="3"/>')
    L.append(f'<text x="{x+w/2}" y="{y+34}" text-anchor="middle" font-size="20" font-weight="700" fill="{BLACK}">{esc(title)}</text>')
    # 2-col grid of atom cells
    cols=2; pad=16; gx=14; gy=12; top=y+50
    cw=(w-2*pad-(cols-1)*gx)/cols; ch=(h-50-pad-(6-1)*gy)/6
    for i,(aid,at) in enumerate(atoms):
        c=i%cols; r=i//cols
        ax=x+pad+c*(cw+gx); ay=top+r*(ch+gy)
        L.append(f'<rect x="{ax}" y="{ay}" width="{cw}" height="{ch}" fill="#FFFFFF" stroke="{BLACK}" stroke-width="2"/>')
        L.append(f'<text x="{ax+10}" y="{ay+24}" font-size="14" font-weight="700" fill="{BLACK}">{esc(aid)}</text>')
        L.append(f'<text x="{ax+10}" y="{ay+45}" font-size="13" fill="{DGRAY}">{esc(at)}</text>')
def line(pts,col,w=3):
    if len(pts)==2:
        (x1,y1),(x2,y2)=pts
        L.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{col}" stroke-width="{w}" marker-end="url(#arw)"/>')
    else:
        p=' '.join(f'{x},{y}' for x,y in pts)
        L.append(f'<polyline points="{p}" fill="none" stroke="{col}" stroke-width="{w}" marker-end="url(#arw)"/>')
def lbl(x,y,t,col):
    bw=len(t)*15+18
    L.append(f'<rect x="{x}" y="{y-19}" width="{bw}" height="26" fill="#FFFFFF" stroke="{col}" stroke-width="2"/>')
    L.append(f'<text x="{x+8}" y="{y-1}" font-size="15" font-weight="700" fill="{col}">{esc(t)}</text>')

W,H=2720,1980
L.append(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">')
L.append('<defs><marker id="arw" markerWidth="12" markerHeight="12" refX="9" refY="4" orient="auto" markerUnits="strokeWidth"><path d="M0 0 L10 4 L0 8 z"/></marker></defs>')
L.append(f'<rect x="0" y="0" width="{W}" height="{H}" fill="#FFFFFF"/>')
# 标题
L.append(f'<text x="40" y="56" font-size="30" font-weight="700" fill="{BLACK}">端云协同触发器 · 全模块流程图</text>')
# 图例（内容,非元信息）
lx=1180
items=[("简单车控",P1),("对话/复杂",P2),("条件/定时任务",P3),("主动服务",P4),("信号底座/同步",SIG)]
for i,(t,c) in enumerate(items):
    x=lx+i*300
    L.append(f'<rect x="{x}" y="38" width="34" height="18" fill="{c}"/>')
    L.append(f'<text x="{x+42}" y="53" font-size="16" font-weight="700" fill="{BLACK}">{esc(t)}</text>')
# 云端/端侧分界
DIV=1010
L.append(f'<line x1="20" y1="{DIV}" x2="{W-20}" y2="{DIV}" stroke="{BLACK}" stroke-width="3" stroke-dasharray="14 10"/>')
L.append(f'<rect x="20" y="{DIV-30}" width="92" height="30" fill="{BLACK}"/><text x="30" y="{DIV-9}" font-size="17" font-weight="700" fill="#FFFFFF">云端</text>')
L.append(f'<rect x="20" y="{DIV}" width="92" height="30" fill="{BLACK}"/><text x="30" y="{DIV+21}" font-size="17" font-weight="700" fill="#FFFFFF">端侧</text>')

# ===== 云端节点 =====
node(40,100,290,86,"9","拒识仲裁意图",["分流:车控/非车控/拒识"],GRAY)
node(40,210,250,72,"10","意图模型解析[需2]",["条件话→触发器协议"])
node(40,300,150,72,"11","云信号源",["后端/事件服务"])
node(208,300,222,72,"12","云端信号库",["端信号同步(全集)"])
node(40,396,290,62,"30","拒识→Context日志",[])
node(470,170,310,176,"13","火山后台/规则配置",["/aidv/v1/trigger·HMAC签名","6API: signals/actions/scene","场景=条件+动作+优先级+频控","actions:advisor/recommend"])
node(470,372,290,72,"14","条件提槽&解析[需2]",["Planner条件任务·常识判断"])
engine(800,130,470,520,"15 云端触发器（12原子）",[
 ("15-1","注册校验·iCanDo"),("15-2","场景库·灰度"),
 ("15-3","信号扫描·5s"),("15-4","条件判定·变更为⚠"),
 ("15-5","模型推理·VLM语义"),("15-6","抖动过滤·区间/周期"),
 ("15-7","冷却频控·policy"),("15-8","优先级仲裁·互斥"),
 ("15-9","端云分类[需9]"),("15-10","标准事件·snapshot"),
 ("15-11","Callback路由"),("15-12","场景下发·全/增/灰")],SAGE)
node(1310,170,300,150,"16","静态Advisor[需3]",["舒适/出行·情感/内容","上汽无→直连Director"],BLUSH)
node(1310,340,300,170,"17","动态Advisor[需10]",["感知订阅·一目标一","注册→触发器(校验)","4任务:条件/定时/VLM/长时","命中→callback→advice"],BLUSH)
node(1640,100,300,76,"18","Goal List 共享看板",["目标队列·goal_list_update"])
node(1640,196,300,150,"19","Director汇入(6路)",["query·建议·feedback","触发通知·GoalList·Context","前置筛选(工具/示例/knowhow)"])
node(1640,366,300,96,"20","Director 推理(大脑)",["{talk_or_not, talk_content,","  action_list}"])
node(1640,482,300,80,"21","Context",["情境/端状态/记忆/日志"])
node(2000,170,300,110,"22","工具库(云·23工具)",["车控/搜索/导航/音乐","记忆/播报→feedback"])
node(2000,310,300,86,"23","任务中心(云·端)",["widget/任务岛/AI PUSH"])

# ===== 端侧节点 =====
node(40,1060,200,72,"1","用户语音query",["speaker/position"])
node(40,1162,200,62,"2","ASR 转文字(端)",[])
node(40,1250,260,120,"3","端信号源",["端状态/视觉VLM/埋点","导航[围栏][需10·11]","音频[需13]/时间[需7]","6类信号→信号库"])
node(330,1250,230,86,"4","端侧信号库[需1]",["标准化快照+任务状态"])
node(600,1060,230,72,"5","离线fc+白名单",["简单车控召回·弱网直驱"],GRAY)
node(600,1180,230,86,"6","命中白名单?",["是→端 / 否→云"],GRAY)
node(600,1320,230,72,"7","原子车控执行(端)",["毫秒级·不进大脑"])
node(600,1440,230,62,"8","车控生效+卡片",[])
engine(900,1080,470,560,"24 端侧触发器（12原子）",[
 ("24-1","规则接收·回滚"),("24-2","本地持久化⚠"),
 ("24-3","信号扫描·500ms"),("24-4","两级判定·时段"),
 ("24-5","本地定时器·弱网⚠"),("24-6","防抖/Always-on"),
 ("24-7","优先级·互斥CABIN"),("24-8","VLM调度·7字段"),
 ("24-9","VLM五态·不写伪果"),("24-10","阈值穿越F→T"),
 ("24-11","结果回写→Context"),("24-12","动作执行·弱网闭环")],BLUSH)
node(1420,1320,290,96,"25","感知订阅→感知器(端)",["二排宝宝/周边/风景","vlm定时捞图→VQA"])
node(2000,1060,300,72,"26","TTS播报+卡片(端)",[])
node(2000,1180,300,86,"27","机器人[需4]",["选形象→圆屏/云台·表情"])
node(2000,1320,300,72,"28","车控执行(端)",[])
node(2360,1440,240,72,"29","输出",[])
# 铁律便签
node(330,1400,250,150,"","铁律(王泽民)",["触发器只读信号库,绝不","直接监听原始信号源—","这样解耦,信号源变了","触发器规则不用改。"],"#FFF7DC")

# ===== 连线（4路径色 + marker箭头）=====
# 入口共用(灰)
line([(140,1132),(140,1162)],SIG)
line([(140,1224),(220,1224),(220,300)],SIG)  # 端信号同步上云近似
# 路径①蓝
line([(165,186),(165,1010),(600,1096)],P1); lbl(300,560,"①简单车控 云→端",P1)
line([(830,1096),(900,1180)],P1)
line([(715,1356),(715,1320)],P1); lbl(640,1300,"是",P1)
# 路径②绿
line([(290,140),(1640,150)],P2); lbl(900,120,"②非车控→Director",P2)
line([(1790,346),(1790,366)],P2)
line([(1940,404),(2000,225)],P2); lbl(1950,360,"调工具",P2)
line([(2150,310),(2150,260),(1940,250)],P2); lbl(1960,250,"tool_feedback",P2)
# 路径③橙
line([(165,246),(20,246),(20,170)],P3); lbl(40,150,"条件话→意图",P3)
line([(290,206),(470,250)],P3); lbl(300,210,"解析→注册",P3)
line([(760,250),(800,250)],P3); lbl(765,240,"场景库",P3)
line([(428,336),(700,300),(800,330)],SIG); lbl(470,310,"信号→引擎",SIG)
line([(1035,650),(1035,1010),(1100,1080)],P3,4); lbl(1040,950,"场景下发 云→端",P3)
line([(1135,1640),(1135,1700),(1700,1700),(1720,470)],P2); lbl(1200,1700,"命中→通知大脑",P2)
# 路径④紫
line([(1270,260),(1320,245)],P4); lbl(1275,235,"命中→静态",P4)
line([(1580,245),(1640,210)],P4); lbl(1585,225,"建议→大脑",P4)
line([(1270,400),(1320,420)],P4); lbl(1275,392,"命中→动态",P4)
line([(1450,510),(1450,1320)],P4); lbl(1455,900,"下发感知订阅",P4)
# 执行(粉/紫归并用紫)
line([(1790,414),(1790,1010),(2000,1096)],P4); lbl(1800,560,"talk/动作 云→端",P4)
line([(1710,1368),(2000,1356)],P3); lbl(1715,1340,"VLM指令",P3)
line([(2300,1356),(2360,1440)],P1)
line([(2150,1132),(2360,1132),(2470,1440)],P1)

L.append('</svg>')
open('/Users/bytedance/Desktop/3.23/产品-端侧触发器/feishu-board/board.svg','w',encoding='utf-8').write('\n'.join(L))
print('SVG written, elements:',len(L))
