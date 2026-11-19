from pathlib import Path
import json, re, html, heapq, math
import xml.etree.ElementTree as ET

OUT=Path(__file__).resolve().parent
COLORS={
 'gray':('#f0f4f7','#688399','#243d50','输入 / 结果'),
 'teal':('#e7f6f3','#268d87','#174c49','处理环节'),
 'purple':('#f0eafa','#8970b4','#4b3768','背景 / 数据'),
 'blue':('#eaf2fb','#4f7ea9','#1f4565','车端 / 推理'),
 'orange':('#fff3df','#bf8736','#77501f','方案 / 条件'),
}

def n(id,col,row,title,sub='',color='teal',w=310):
 return dict(id=id,x=45+400*col,y=145+230*row,w=w,h=120,title=title,subtitle=sub,color=color)
def e(a,b,label='',dashed=False):return dict(from_=a,to=b,label=label,dashed=dashed)
S=[]
def spec(unit,title,nodes,edges,note=''):
 S.append(dict(unit=unit,key=f'v54-unit-{unit:02d}',title=title,nodes=nodes,edges=edges,note=note))

spec(1,'唤醒与全时聆听：先决定是否进入交互',[
 n('input',1,0,'车内有人说话',color='gray'),n('wake',0,1,'喊唤醒词'),n('always',2,1,'全时免唤醒已开启',color='purple'),n('active',0,2,'进入激活态'),n('judge',2,2,'本地先判断是否应接话'),n('upload',2,3,'有效输入上云'),n('next',1,4,'后续识别与理解')],
 [e('input','wake','唤醒入口'),e('input','always','按开关与状态'),e('wake','active','唤醒'),e('always','judge','候选输入'),e('judge','upload','值得接话'),e('active','next','进入后续处理'),e('upload','next','进入后续处理')],
 '箭头表示进入后续处理，不表示动作已经执行。')
spec(2,'声学前端：把声音与来源整理好',[
 n('input',1,0,'人声 + 环境噪声',color='gray'),n('mic',1,1,'麦克风采集'),n('noise',1,2,'降噪'),n('aec',1,3,'回声消除'),n('ref',0,3,'扬声器参考声音',color='purple'),n('zone',1,4,'声音 + 音区',color='gray'),n('asr',1,5,'语音识别')],
 [e('input','mic','声音'),e('mic','noise','采集音频'),e('noise','aec','处理音频'),e('ref','aec','参考声音'),e('aec','zone','整理后声音'),e('zone','asr','声音与来源')],
 '这是职责示意，不宣称降噪和回声消除的工程算法严格串行。')
spec(3,'ASR：过程文字与定稿分别交给谁',[
 n('audio',1,0,'处理后声音',color='gray'),n('local',0,1,'端侧 ASR','本地识别文字'),n('cloud',2,1,'云端 ASR'),n('partial',1,2,'过程文字 partial','仍可能修订',color='gray'),n('final',2,2,'二遍定稿 final',color='gray'),n('early',1,3,'提前判断'),n('formal',2,3,'正式请求')],
 [e('audio','local','声音'),e('audio','cloud','声音'),e('cloud','partial','过程文字'),e('cloud','final','整段音频定稿'),e('partial','early','变化中的文字'),e('final','formal','最终文字')],
 '当前采纳哪路文字依项目规则；文字出现不等于动作已经执行。')

hot=[n('names',0,0,'通讯录人名',color='purple',w=250),n('poi',0,0,'导航地点',color='purple',w=250),n('media',0,0,'正在播放',color='purple',w=250),n('page',0,0,'当前页面按钮',color='purple',w=250)]
for i,a in enumerate(hot):a['x']=30+295*i
hot += [n('library',1,1,'云端热词库','按类别限量，最近的优先','purple'),n('read',1,2,'AIDV 在识别开始前读取','热词 + 最近 5 轮对话'),n('asr',1,3,'云端 ASR 写成文字','发音相近时，倾向选热词'),n('voice',0,3,'主驾的声音','车上处理后上传','gray'),n('text',1,4,'识别出的文字','交给判停、拒识、Planner','gray')]
spec(4,'热词：从名字来源到识别文字',hot,
 [e(x,'library','名字来源') for x in ['names','poi','media','page']]+[e('library','read','热词'),e('read','asr','本次识别线索'),e('voice','asr','声音'),e('asr','text','识别结果')],
 '按用户确认样稿绘制；热词数据为紫色，处理环节为青色。具体口径见样稿外校注。')
spec(5,'VAD：利用停顿准备，也接住补话',[
 n('sound',1,0,'持续声音',color='gray'),n('pause',1,1,'出现停顿'),n('soft',1,2,'Soft VAD','短停顿判断'),n('pre',2,3,'可先预处理',color='purple'),n('listen',1,3,'继续收音'),n('hard',1,4,'Hard VAD','本段收尾门槛'),n('final',1,5,'分句定稿',color='gray')],
 [e('sound','pause','声音活动'),e('pause','soft','停顿信号'),e('soft','pre','先做准备'),e('soft','listen','仍接收声音'),e('listen','hard','停顿达到门槛'),e('hard','final','本段收尾'),e('listen','sound','用户继续补话',True)],
 '不把不同文档的阈值画成一个统一的已上线常量。')
spec(6,'预请求：准备结果要与最终请求对上',[
 n('soft',0,0,'Soft 时的文字',color='gray'),n('pre',0,1,'预请求'),n('calc',0,2,'拒识 / Context 预处理'),n('cache',0,3,'暂存结果',color='purple'),n('final',2,0,'最终文字',color='gray'),n('match',2,2,'同轮且文字一致？'),n('formal',1,4,'正式链路')],
 [e('soft','pre','过程文字'),e('pre','calc','允许的准备'),e('calc','cache','计算结果'),e('final','match','核对最终文字'),e('cache','match','已有准备'),e('cache','formal','符合条件：复用'),e('match','formal','不匹配：重算')],
 '图用 OnePager 的一致性规则；历史相似度口径另见查阅区，准备本身不执行。')
spec(7,'流式打断：规则分支与模型分支',[
 n('playing',0,0,'豆包正在播报',color='gray'),n('words',2,0,'用户过程文字',color='gray'),n('condition',1,1,'打断触发条件','人数、唤醒词等条件','purple'),n('model',2,2,'流式拒识判断'),n('stop',0,3,'先停当前播报',color='gray'),n('wait',2,3,'继续等待',color='gray'),n('listen',1,4,'继续收音到正式判断')],
 [e('playing','condition','播报状态'),e('words','condition','当前文字'),e('condition','stop','命中直接停播规则'),e('condition','model','符合模型调用条件'),e('model','stop','当前判断可接'),e('model','wait','暂不停止播报'),e('stop','listen','让用户继续说')],
 '单人或规定的唤醒词规则可直接停播；停播箭头不通向车辆执行。')
spec(8,'最终拒识：完整请求该不该接',[
 n('text',0,0,'最终文字',color='gray'),n('context',2,0,'相关背景',color='purple'),n('rules',1,1,'规则条件检查',color='purple'),n('model',2,2,'最终拒识模型'),n('accept',0,3,'召回，继续处理',color='gray'),n('reject',2,3,'拒识，不作本轮指令执行',color='gray'),n('restore',2,4,'播报恢复判断')],
 [e('text','rules','完整请求'),e('context','rules','交互背景'),e('rules','accept','符合直通规则'),e('rules','model','需要模型判断'),e('model','accept','召回'),e('model','reject','拒识'),e('reject','restore','结合打断原因与结果')],
 '最终接话判断与播报恢复各有规则，不能把拒识直接等同于统一恢复。')
spec(9,'固定说法与 FC：候选指令仍需采信',[
 n('text',1,0,'最终指令文字',color='gray'),n('rules',1,1,'固定说法规则',color='purple'),n('config',0,2,'配置的函数结果',color='gray'),n('model',2,2,'本地 FC 模型'),n('func',1,3,'函数与参数',color='gray'),n('reject',2,3,'reject','不该接为指令','gray'),n('unsupported',2,4,'unsupported','本地不支持','gray'),n('arb',0,5,'端云仲裁')],
 [e('text','rules','指令文字'),e('rules','config','命中'),e('rules','model','未命中'),e('model','func','可办理候选'),e('model','reject','不该接'),e('model','unsupported','本地做不了'),e('config','arb','规则结果'),e('func','arb','函数候选')],
 '函数和参数是候选结果；只有按对应规则采信，才进入实际执行。')
spec(10,'端云仲裁：只采纳对应的有效结果',[
 n('query',1,0,'同一轮请求',color='gray'),n('local',0,1,'本地规则 / 模型结果',color='gray'),n('cloud',2,1,'云端结果',color='gray'),n('state',1,2,'网络与等待状态',color='purple'),n('arb',1,3,'端云采纳判断'),n('adopt',1,4,'采用一个结果'),n('exec',1,5,'执行并同步')],
 [e('query','local','本地输入'),e('query','cloud','云端输入'),e('local','arb','本地候选'),e('cloud','arb','云端候选'),e('state','arb','当前状态'),e('arb','adopt','采信结果'),e('adopt','exec','实际处理')],
 '迟到结果止于采纳判断：已完成采纳后不重复执行。具体优先级按车型与版本核对。')
spec(11,'模型全景：按职责辨认模型',[
 n('input',1,0,'用户输入',color='gray'),n('stream',0,1,'流式拒识','是否先停播'),n('fc',1,1,'端侧 FC','函数候选'),n('reject',2,1,'云端最终拒识','完整话语是否接'),n('dt',2,3,'云端 DT','结合背景安排任务','blue'),n('vlm',1,3,'端侧 VLM 观察结果','视觉场景描述','purple'),n('offline',0,3,'离线 DT 评估方向','评估不等于上线','orange')],
 [e('input','stream','过程文字'),e('input','fc','指令文字'),e('input','reject','完整请求'),e('reject','dt','接话后处理'),e('vlm','dt','场景描述')],
 '橙色虚线框单列评估方向，不接入已上线实线；基座与版本以正文对照表为准。')
spec(12,'DT 接手：背景、检索与工具反馈',[
 n('query',0,0,'完整请求及说话人',color='gray'),n('context',2,0,'常用背景',color='purple'),n('dt',1,1,'DT 判断','当前已知与未知','blue'),n('memory',0,2,'按需查记忆 / 状态',color='purple'),n('tool',2,2,'业务工具'),n('result',2,3,'真实结果',color='gray'),n('reply',1,4,'回复 / 下一步',color='gray')],
 [e('query','dt','本轮请求'),e('context','dt','可用背景'),e('dt','memory','缺信息再查'),e('memory','dt','检索结果'),e('dt','tool','工具调用'),e('tool','result','实际返回'),e('result','dt','反馈再判断'),e('dt','reply','交互或后续动作')],
 '背景提供事实，工具返回执行结果；背景箭头不等于执行指令。')
spec(13,'记忆体系：不同形态共同供给背景',[
 n('input',1,0,'获准记录的输入',color='gray'),n('near',0,1,'近期历史 / 瞬时资料',color='purple'),n('back',2,1,'后台整理'),n('dt',0,4,'本轮 DT',color='blue'),n('summary',1,2,'输入摘要',color='purple'),n('short',2,2,'短期情景',color='purple'),n('episode',1,3,'长期情景',color='purple'),n('semantic',2,3,'长期语义',color='purple')],
 [e('input','near','近端资料'),e('input','back','待整理信息'),e('near','dt','当前背景'),e('back','summary','压缩内容'),e('back','short','近期经历'),e('back','episode','较远经历'),e('back','semantic','事实与偏好'),e('summary','dt','按需提供'),e('short','dt','按需提供'),e('episode','dt','按需提供'),e('semantic','dt','按需提供')],
 '不是当前请求必须依次等待的关卡；各层生成、保留与使用条件见正文。')
spec(14,'人人对话：两条上报路线再汇合',[
 n('talk',1,0,'乘员聊天',color='gray'),n('judge',1,1,'识别与人机判断'),n('active',0,2,'已激活实时上传',color='blue'),n('offline',2,2,'未激活 / 降级本地积累',color='orange'),n('batch',2,3,'批量 / 沉默 / 有效请求 / 联网恢复补报',color='orange'),n('organize',1,4,'云端按发生时间组织',color='purple'),n('history',0,5,'本轮历史输入',color='purple'),n('memory',2,5,'摘要 / 记忆整理',color='purple')],
 [e('talk','judge','对话声音'),e('judge','active','激活路径'),e('judge','offline','本地积累路径'),e('offline','batch','满足补报时机'),e('active','organize','文本及归属'),e('batch','organize','文本及归属'),e('organize','history','近期输入'),e('organize','memory','整理材料')],
 '橙色表示改造方案，不代表已全量上线；上传记录不等于把聊天当命令。')
spec(15,'记忆打通：地址同步与座椅 ID 分开',[
 n('voice',0,0,'语音设置',color='gray'),n('manual',1,0,'地图手动设置',color='gray'),n('identify',0,1,'补齐具体地点 / 识别人'),n('memory',0,2,'本人豆包记忆',color='purple'),n('profile',0,3,'本人 Profile 同步块',color='purple'),n('map',1,3,'车机导航数据',color='blue'),n('seat',2,1,'用途 ↔ 座椅位置 ID',color='purple'),n('interface',2,3,'车辆位置接口',color='blue')],
 [e('voice','identify','语音表达'),e('manual','identify','设置归属'),e('identify','memory','明确资料'),e('memory','profile','提取同步字段'),e('profile','memory','反写记忆'),e('profile','map','车主分支'),e('manual','profile','按车主身份归属'),e('seat','interface','位置 ID'),e('interface','seat','实际保存返回的 ID')],
 '非车主分支止于本人记忆与 Profile，不同步车机导航；座椅具体机械参数保留车端。')
spec(16,'AI Launcher：桌面入口怎样接上业务',[
 n('content',1,0,'问候、引导、场景、技能',color='purple'),n('desktop',1,1,'Launcher 桌面',color='gray'),n('click',1,2,'用户点入口',color='gray'),n('direct',0,3,'直接业务接口'),n('simulate',2,3,'模拟用户请求 → Planner'),n('result',1,4,'实际业务结果',color='gray'),n('update',1,5,'界面更新与结果上报')],
 [e('content','desktop','展示内容'),e('desktop','click','可见入口'),e('click','direct','按具体入口协议',True),e('click','simulate','按具体入口协议',True),e('direct','result','处理结果'),e('simulate','result','处理结果'),e('result','update','真实结果')],
 '两条路径用于解释入口协议差异，不代表所有 Launcher 入口已经接通两路。')
spec(17,'回写：本地完成之后，下一句怎样接住',[
 n('query',1,0,'本轮请求',color='gray'),n('adopt',1,1,'端云采纳结果'),n('actual',1,2,'本地实际执行 / 拒识结果',color='gray'),n('record',1,3,'整理请求、回答、执行观察',color='purple'),n('sync',1,4,'同步接口'),n('cloud',1,5,'云端对应上下文',color='purple'),n('next',1,6,'下一轮读取')],
 [e('query','adopt','本轮输入'),e('adopt','actual','被采纳的处理'),e('actual','record','执行了什么、成功没有'),e('record','sync','对应记录'),e('sync','cloud','同步结果'),e('cloud','next','按范围读取')],
 '任务承接信息与仅供情景判断的信息分别使用；同步失败后的补同步是否实现，须按版本核验。')
spec(18,'TTS：停播之后，不是统一从头再说',[
 n('text',1,0,'Planner 可播文本',color='gray'),n('tts',1,1,'TTS 合成'),n('play',1,2,'车端拉取并播放',color='gray'),n('interrupt',1,3,'用户插话、触发停播'),n('record',1,4,'记录已播 / 未播内容',color='purple'),n('judge',1,5,'最终判断新话要不要接'),n('reject',0,6,'拒识后以事件触发恢复'),n('accept',2,6,'接话后由 Planner 融合新话与未播内容')],
 [e('text','tts','待播文字'),e('tts','play','音频'),e('play','interrupt','新的插话'),e('interrupt','record','播放进度'),e('record','judge','新请求及背景'),e('judge','reject','最终拒识'),e('judge','accept','接住新话'),e('reject','text','按规则恢复',True),e('accept','text','重新组织可播文本',True)],
 '某些打断原因不恢复；是否恢复受打断原因与版本规则约束。')
spec(19,'全链路口述：把一次请求讲完整',[
 n('speak',1,0,'用户开口',color='gray'),n('words',1,1,'声音成为文字'),n('full',1,2,'接完整句话'),n('adopt',1,3,'接话与端云采信',color='orange'),n('context',1,4,'背景交给 Planner',color='purple'),n('tool',1,5,'工具返回真实结果'),n('feedback',1,6,'展示、播报与回写',color='gray')],
 [e('speak','words','录音'),e('words','full','过程文字'),e('full','adopt','最终请求'),e('adopt','context','本轮背景'),e('context','tool','工具调用'),e('tool','feedback','结果'),e('feedback','context','供下一轮使用',True)],
 '拒识或失败按对应规则退出；不能把所有输入都画成成功。')
spec(20,'术语速查：先看输入与输出',[
 n('sound',0,0,'声音','VAD 观察发声与停顿','gray'),n('words',1,0,'文字','ASR 识别结果','gray'),n('judge',2,0,'交互与采信判断','拒识 / 仲裁'),n('context',2,2,'请求和背景','Context / DT','purple'),n('actions',1,2,'动作与反馈','FC / tool feedback / TTS / 回写')],
 [e('sound','words','ASR'),e('words','judge','识别文字'),e('judge','context','有效请求与背景'),e('context','actions','处理与反馈')],
 '按主要职责定位；颜色不表示所有车型都在同一位置运行。')

def units(s):return sum(1 if ord(c)>127 else .55 for c in s)
def wrap(s,max_units):
 lines=[];current=''
 for ch in s:
  if ch=='\n' or units(current+ch)>max_units:
   if current:lines.append(current)
   current='' if ch=='\n' else ch
  else:current+=ch
 if current:lines.append(current)
 return lines
def inside(p,r):return r[0]<p[0]<r[2] and r[1]<p[1]<r[3]
def crossed(a,b,r):
 if a[0]==b[0]:return r[0]<a[0]<r[2] and max(min(a[1],b[1]),r[1])<min(max(a[1],b[1]),r[3])
 if a[1]==b[1]:return r[1]<a[1]<r[3] and max(min(a[0],b[0]),r[0])<min(max(a[0],b[0]),r[2])
 return False
def box(node,pad=0):return (node['x']-pad,node['y']-pad,node['x']+node['w']+pad,node['y']+node['h']+pad)
def port(node,side,offset):
 x,y,w,h=(node[k] for k in ['x','y','w','h'])
 return {'top':(x+w/2,y-offset),'bottom':(x+w/2,y+h+offset),'left':(x-offset,y+h/2),'right':(x+w+offset,y+h/2)}[side]

def route(a,b,nodes,height):
 # Choose directions that follow the supplied conceptual layout; route orthogonally around all boxes.
 if a['y']+a['h']<b['y']:sa,sb='bottom','top'
 elif b['y']+b['h']<a['y']:sa,sb=('left','left') if a['x']>=b['x'] else ('right','right')
 elif a['x']<b['x']:sa,sb='right','left'
 else:sa,sb='left','right'
 start,end=port(a,sa,24),port(b,sb,24)
 xs={18,1182,start[0],end[0]};ys={110,height-92,start[1],end[1]}
 for nn in nodes:
  xs.update([nn['x']-24,nn['x']+nn['w']/2,nn['x']+nn['w']+24])
  ys.update([nn['y']-24,nn['y']+nn['h']/2,nn['y']+nn['h']+24])
 xs=sorted(x for x in xs if 15<=x<=1185);ys=sorted(y for y in ys if 108<=y<=height-90)
 obstacles=[box(nn,15) for nn in nodes]
 points={(x,y) for x in xs for y in ys if not any(inside((x,y),r) for r in obstacles)}
 assert start in points and end in points,(a['id'],b['id'],start,end)
 graph={p:[] for p in points}
 for yy in ys:
  row=sorted([p for p in points if p[1]==yy])
  for p,q in zip(row,row[1:]):
   if not any(crossed(p,q,r) for r in obstacles):graph[p].append((q,0));graph[q].append((p,0))
 for xx in xs:
  col=sorted([p for p in points if p[0]==xx],key=lambda p:p[1])
  for p,q in zip(col,col[1:]):
   if not any(crossed(p,q,r) for r in obstacles):graph[p].append((q,1));graph[q].append((p,1))
 queue=[(0,start,-1)];dist={(start,-1):0};prev={};found=None
 while queue:
  cost,p,d=heapq.heappop(queue)
  if cost!=dist[(p,d)]:continue
  if p==end:found=(p,d);break
  for q,nd in graph[p]:
   val=cost+abs(q[0]-p[0])+abs(q[1]-p[1])+(35 if d!=-1 and d!=nd else 0)
   if val<dist.get((q,nd),1e30):dist[(q,nd)]=val;prev[(q,nd)]=(p,d);heapq.heappush(queue,(val,q,nd))
 assert found,(a['id'],b['id'])
 path=[];key=found
 while key in prev:path.append(key[0]);key=prev[key]
 path.append(start);path.reverse();path=[port(a,sa,0)]+path+[port(b,sb,0)]
 # Remove redundant collinear grid vertices.
 result=[]
 for p in path:
  while len(result)>1 and ((result[-2][0]==result[-1][0]==p[0]) or (result[-2][1]==result[-1][1]==p[1])):result.pop()
  result.append(p)
 return result

def overlaps(r,s,pad=0):return r[0]<s[2]+pad and r[2]>s[0]-pad and r[1]<s[3]+pad and r[3]>s[1]-pad
def label_position(points,text,nodes,labels,height):
 lines=wrap(text,11);w=max(36,max((units(s) for s in lines),default=0)*13+12);h=18*len(lines)+10
 segments=sorted(zip(points,points[1:]),key=lambda z:abs(z[1][0]-z[0][0])+abs(z[1][1]-z[0][1]),reverse=True)
 candidates=[]
 for a,b in segments:
  length=abs(a[0]-b[0])+abs(a[1]-b[1])
  for frac in [.5,.3,.7]:
   cx=a[0]+(b[0]-a[0])*frac;cy=a[1]+(b[1]-a[1])*frac
   offsets=[(0,-h/2-5),(0,h/2+5)] if a[1]==b[1] else [(w/2+7,0),(-w/2-7,0)]
   for ox,oy in offsets:
    r=(cx+ox-w/2,cy+oy-h/2,cx+ox+w/2,cy+oy+h/2)
    if r[0]<20 or r[2]>1180 or r[1]<95 or r[3]>height-95:continue
    if not any(overlaps(r,box(nn),6) for nn in nodes) and not any(overlaps(r,z,5) for z in labels):return r,lines
 return None,lines

def text_lines(lines,x,y,font,color,weight=400,anchor='middle',lineheight=None):
 lineheight=lineheight or font+7
 return ''.join(f'<text x="{x:g}" y="{y+i*lineheight:g}" text-anchor="{anchor}" style="fill:{color};font-size:{font}px;font-weight:{weight};font-family:PingFang SC,Microsoft YaHei,Noto Sans CJK SC,Arial,sans-serif">{html.escape(line)}</text>' for i,line in enumerate(lines))

def render(s):
 nodes=s['nodes'];height=max(nn['y']+nn['h'] for nn in nodes)+185+(100 if s['unit']==15 else 0);s['width']=1200;s['height']=height
 marker=s['key']+'-arrow';chunks=[f'<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="{height}" viewBox="0 0 1200 {height}" role="img" aria-label="{html.escape(s["title"])}"><title>{html.escape(s["title"])}</title><defs><marker id="{marker}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1L9 5L1 9" fill="none" stroke="#476c8d" stroke-width="1.8"/></marker></defs><rect width="1200" height="{height}" rx="14" style="fill:#ffffff"/>']
 chunks.append(text_lines([s['title']],32,42,25,'#16344a',650,'start'))
 chunks.append(text_lines(['沿箭头读：上一环交出什么，下一环凭什么继续'],32,72,15,'#5d7183',400,'start'))
 byid={nn['id']:nn for nn in nodes};labels=[];missing=[]
 if s['unit']==10:
  late=e('cloud','arb','迟到：已采纳则不重复执行',True)
  late['points']=[[1155,435],[1182,435],[1182,895],[755,895]]
  s['edges'].append(late)
 for edge in s['edges']:
  edge['from']=edge.pop('from_');points=edge.get('points') or route(byid[edge['from']],byid[edge['to']],nodes,height);edge['points']=points
  dashed=' stroke-dasharray="7 5"' if edge['dashed'] else ''
  path='M'+' L'.join(f'{x:g},{y:g}' for x,y in points)
  chunks.append(f'<path d="{path}" fill="none" stroke="#476c8d" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" marker-end="url(#{marker})"{dashed}/>')
  if edge['label']:
   r,lines=label_position(points,edge['label'],nodes,labels,height)
   if r:
    labels.append(r);edge['labelBox']=dict(x=r[0],y=r[1],w=r[2]-r[0],h=r[3]-r[1]);edge['labelLines']=lines
    chunks.append(f'<rect x="{r[0]:g}" y="{r[1]:g}" width="{r[2]-r[0]:g}" height="{r[3]-r[1]:g}" rx="4" style="fill:#ffffff;fill-opacity:.98"/>')
    chunks.append(text_lines(lines,(r[0]+r[2])/2,r[1]+18,13,'#3d5a70',500,lineheight=18))
   else:missing.append(edge['label'])
 s['annotations']=[]
 def exit_annotation(nodeid,label,color='#ab7130'):
  nn=byid[nodeid];yy=nn['y']+nn['h']/2
  path=[[nn['x'],yy],[100,yy]]
  s['annotations'].append(dict(kind='exit',fromNode=nodeid,label=label,points=path))
  chunks.append(f'<path d="M{nn["x"]},{yy:g} H100" stroke="{color}" stroke-width="2" stroke-dasharray="7 5" fill="none" marker-end="url(#{marker})"/>')
  chunks.append(text_lines(wrap(label,18),(nn['x']+100)/2,yy-14,14,color,500,lineheight=20))
 if s['unit']==17:exit_annotation('sync','补同步是否实现：按版本核验')
 if s['unit']==19:
  exit_annotation('adopt','拒识出口')
  exit_annotation('tool','失败出口')
 if s['unit']==15:
  nn=byid['profile'];xx=nn['x']+nn['w']/2;yy=nn['y']+nn['h'];end_y=yy+52
  pts=[[xx,yy],[xx,end_y],[540,end_y]]
  s['annotations'].append(dict(kind='blocked-branch',fromNode='profile',label='非车主：不向车机同步',points=pts))
  chunks.append(f'<path d="M{xx:g},{yy:g} V{end_y:g} H540 M540,{end_y-9:g} V{end_y+9:g}" stroke="#b04444" stroke-width="2.5" fill="none"/>')
  chunks.append(text_lines(['非车主：不向车机同步'],390,end_y+28,14,'#963737',600))
 for nn in nodes:
  fill,stroke,color,_=COLORS[nn['color']];dash=' stroke-dasharray="7 5"' if nn['color']=='orange' else ''
  chunks.append(f'<g data-node-id="{nn["id"]}"><rect x="{nn["x"]}" y="{nn["y"]}" width="{nn["w"]}" height="{nn["h"]}" rx="10" style="fill:{fill};stroke:{stroke};stroke-width:1.8"{dash}/>')
  title=wrap(nn['title'],(nn['w']-36)/20);sub=wrap(nn['subtitle'],(nn['w']-36)/16)
  total=len(title)*27+len(sub)*22+(6 if sub else 0);start=nn['y']+(nn['h']-total)/2+20
  nn['textLines']=[dict(text=t,x=nn['x']+nn['w']/2,y=start+i*27,font=20,kind='title') for i,t in enumerate(title)]
  chunks.append(text_lines(title,nn['x']+nn['w']/2,start,20,color,650,lineheight=27))
  if sub:
   sy=start+len(title)*27+6
   nn['textLines'] += [dict(text=t,x=nn['x']+nn['w']/2,y=sy+i*22,font=16,kind='subtitle') for i,t in enumerate(sub)]
   chunks.append(text_lines(sub,nn['x']+nn['w']/2,sy,16,color,400,lineheight=22))
  chunks.append('</g>')
 used=list(dict.fromkeys(nn['color'] for nn in nodes));ly=height-132;lx=32
 for color in used:
  fill,stroke,fg,label=COLORS[color]
  if s['unit']==4 and color=='purple':label='热词数据'
  chunks.append(f'<rect x="{lx}" y="{ly}" width="18" height="18" rx="4" fill="{fill}" stroke="{stroke}"/>')
  chunks.append(text_lines([label],lx+27,ly+15,14,'#33495b',400,'start'));lx+=218
 note=s['note']+('；'+ '；'.join(missing) if missing else '')
 chunks.append(text_lines(wrap(note,72),32,height-79,15,'#5d7183',400,'start',22))
 chunks.append('</svg>');s['svg']=''.join(chunks)
 # Geometry checks are embedded in the artifact, with all labels available for parent inspection.
 node_overlap=[];text_overflow=[];edge_cross=[]
 for i,a in enumerate(nodes):
  for b in nodes[i+1:]:
   if overlaps(box(a),box(b)):node_overlap.append([a['id'],b['id']])
  for ln in a['textLines']:
   half=units(ln['text'])*ln['font']/2
   if ln['x']-half<a['x']+12 or ln['x']+half>a['x']+a['w']-12 or ln['y']-ln['font']<a['y']+6 or ln['y']>a['y']+a['h']-6:text_overflow.append([a['id'],ln['text']])
 for edge in s['edges']:
  for a,b in zip(edge['points'],edge['points'][1:]):
   for nn in nodes:
    if nn['id'] not in (edge['from'],edge['to']) and crossed(a,b,box(nn)):edge_cross.append([edge['from'],edge['to'],nn['id']])
 s['checks']=dict(nodeCount=len(nodes),nodeOverlaps=node_overlap,textOverflow=text_overflow,edgeCrossesNode=edge_cross,labelsMovedToNote=missing)
 assert not node_overlap and not text_overflow and not edge_cross,s['checks']
 assert s['unit']==4 or len(nodes)<=8
 return s

def validate_all_text(s):
 # Independent check over rendered SVG text, including annotations, legends and footnotes.
 from PIL import ImageFont
 candidates=list(Path('/System/Library/AssetsV2/com_apple_MobileAsset_Font7').glob('*/AssetData/PingFang.ttc'))
 fontpath=str(candidates[0] if candidates else Path('/System/Library/Fonts/Supplemental/Arial Unicode.ttf'))
 fonts={};text_boxes=[];issues=[]
 for el in ET.fromstring(s['svg']).iter('{http://www.w3.org/2000/svg}text'):
  size=int(re.search(r'font-size:(\d+)px',el.attrib['style'])[1])
  if size not in fonts:fonts[size]=ImageFont.truetype(fontpath,size)
  font=fonts[size];text=''.join(el.itertext());x=float(el.attrib['x']);y=float(el.attrib['y'])
  width=font.getlength(text);anchor=el.attrib.get('text-anchor')
  x-=width/2 if anchor=='middle' else width if anchor=='end' else 0
  left,top,right,bottom=font.getbbox(text,anchor='ls')
  text_boxes.append((text,(x+left,y+top,x+right,y+bottom)))
 for i,(text,r) in enumerate(text_boxes):
  for other,q in text_boxes[i+1:]:
   if overlaps(r,q):issues.append([text,other])
 labels=[(ed['label'],(ed['labelBox']['x'],ed['labelBox']['y'],ed['labelBox']['x']+ed['labelBox']['w'],ed['labelBox']['y']+ed['labelBox']['h'])) for ed in s['edges']]
 label_issues=[]
 for i,(name,r) in enumerate(labels):
  for other,q in labels[i+1:]:
   if overlaps(r,q):label_issues.append([name,other])
  for node in s['nodes']:
   if overlaps(r,box(node)):label_issues.append([name,node['id']])
 s['checks'].update(actualFont='PingFang' if 'PingFang' in fontpath else 'Arial Unicode',allSvgTextCount=len(text_boxes),allSvgTextOverlaps=issues,labelBoxOverlaps=label_issues)
 assert not issues and not label_issues,(s['unit'],issues,label_issues)

if __name__=='__main__':
 result=[render(s) for s in S]
 for s in result:validate_all_text(s)
 (OUT/'new-diagrams.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
 print(json.dumps({'diagrams':len(result),'nodes':[len(s['nodes']) for s in result],'labelsMovedToNote':sum(len(s['checks']['labelsMovedToNote']) for s in result),'allGeometryChecksPassed':True},ensure_ascii=False))
