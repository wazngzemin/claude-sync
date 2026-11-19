from pathlib import Path
import json,re,xml.etree.ElementTree as ET
BASE=Path(__file__).resolve().parents[2]
OUT=Path(__file__).resolve().parent
WEB=BASE.parents[1]/'HTML/01-进行中/豆包汽车-业务学习站-v65.html'
s=WEB.read_text(); data,_=json.JSONDecoder().raw_decode(s[s.index('const DATA=')+11:])
N='{http://www.w3.org/2000/svg}'; ET.register_namespace('',N[1:-1])
IDS=['d-overview','d-react','d-tasks','d-sp','d-eval']
changes=['# 原图清理逐项记录','', '五张均从 v65 网页 DATA.diagrams 提取。D 模块的 fig 占位由渲染函数传入 DATA.diagrams[key]；与 research/chapters/D/svg 同名原文件逐字一致。网页和原文件未修改。','', '节点按实际流程框、判断菱形与信息卡统计；背景、分区和图例不计节点。背景及分区改用 path 标明 data-decoration；无框注释不计节点。','']
reports=[]
def txt(g,x,y,s,size=13,color='#5d7183',weight='400',anchor='start'):
 e=ET.SubElement(g,N+'text',{'x':str(x),'y':str(y),'font-size':str(size),'fill':color,'font-weight':weight,'text-anchor':anchor});e.text=s;return e
def path_rect(e):
 x=float(e.get('x','0'));y=float(e.get('y','0'));w=float(e.get('width'));h=float(e.get('height'))
 e.tag=N+'path';e.set('d',f'M{x:g},{y:g} H{x+w:g} V{y+h:g} H{x:g} Z')
 for k in ['x','y','width','height','rx']:e.attrib.pop(k,None)
 e.set('data-decoration','true')
def note(msg): changes.append('- '+msg)
def repl(e,new):
 old=e.text or ''
 if old!=new: note('`'+old+'` → `'+new+'`');e.text=new
for ID in IDS:
 root=ET.fromstring(data['diagrams'][ID]); g=root.find(N+'g');changes+=['## '+ID+'.svg','']
 for e in root.iter():
  for key in ['aria-label']:
   if key in e.attrib:e.set(key,e.get(key).replace('DT','Planner').replace('清单','列表'))
  if e.tag not in [N+'text',N+'title']:continue
  old=e.text or '';new=old.replace('DT','Planner').replace('动作清单','动作列表').replace('明骏','主驾')
  if ID=='d-overview':
   new=new.replace('同一件事最多 20 轮','步数超过 20 就不再调工具').replace('即时、多步：现在办','即时任务：单步或多步，现在办')
  elif ID=='d-react':
   new=new.replace('按 PRD 和说明书规则推演，不是一条真实日志','按规则推演的示意')
   new=new.replace('每一轮说了话，下一轮会等车上播完再开始；','每一轮说了话，下一轮的话要等车上播完才能发出；')
  elif ID=='d-tasks':new=new.replace('登记前 Planner 必查的五件事（PRD）','登记前 Planner 必查的五件事').replace('多步任务','即时任务的多步办法')
  elif ID=='d-sp':
   new=new.replace('可用工具（27 个）','可用工具（随车型和版本变化）').replace('Planner 的说明书（系统提示词）由哪几块组成：上汽 7 月 31 日快照','Planner 的说明书（系统提示词）由哪几块组成：上汽的一份快照').replace('7 月仍写死在说明书里','仍写死在说明书里')
  elif ID=='d-eval':
   new=new.replace('现在用来准出的口径（评估维度表 v0.2）','现在用来准出的指标').replace('黄赌毒','违规内容').replace('复杂任务 / 结合背景推理准确率','结合背景推理准确率')
   if old.startswith('现值只填了'):new=''
  repl(e,new)
 # Convert full-canvas backgrounds, partition containers, and arrow-label plates to paths.
 for e in list(g):
  if e.tag!=N+'rect':continue
  is_bg='x' not in e.attrib
  is_partition=e.get('fill-opacity')=='.35'
  is_label=e.get('fill-opacity')=='.92'
  if is_bg or is_partition or is_label:
   path_rect(e)
   if is_partition:e.attrib.pop('stroke-dasharray',None)
 # Explicit actual node geometry and minimal consolidation.
 if ID=='d-overview':
  side=[]
  for e in list(g):
   if e.tag==N+'rect' and float(e.get('x','0'))>=790 and float(e.get('y','0'))>=414: side.append(e)
  for e in side:g.remove(e)
  r=ET.Element(N+'rect',{'x':'790','y':'414','width':'400','height':'330','rx':'8','fill':'#ffffff','stroke':'#9fb2c2','stroke-width':'1.6','data-node':'true'})
  # Insert behind all texts and arrows but over partition backgrounds.
  g.insert(5,r)
  note('版式：任务系统、播报、工具执行的 3 个下游边框合并为 1 个下游节点，内部文字和各路箭头保留；加上上游与 7 个主步骤，共 9 个节点。')
  # Namespace long outgoing response phrase remains within 190 px segment.
  legend='绿：Planner 决策步骤　　灰：上下游交接　　实线箭头：交办　　虚线箭头：结果或任务回流'
  txt(g,32,1170,legend)
 elif ID=='d-react':
  for e in list(g):
   if e.tag==N+'rect' and float(e.get('y','0')) in [268,528]:g.remove(e)
  note('版式：四列的“说”和“为什么”改为无框行注释，保留“收到”和“做”共 8 个节点；原文字、相对位置和箭头保留。')
  # The third-round no-op box uses a solid border, not a research convention.
  for e in g:
   if e.tag==N+'rect':e.attrib.pop('stroke-dasharray',None)
  txt(g,32,750,'白：收到输入　　橙：发出动作　　灰：不发动作　　实线箭头：本轮处理　　虚线箭头：工具结果回流')
 elif ID=='d-tasks':
  for e in list(g):
   if e.tag==N+'rect' and e.get('x')=='450' and e.get('y')=='680':g.remove(e)
  note('版式：登记前五项检查改为无框注释，保留 6 个任务/处理框与 3 个判断菱形，共 9 个节点；五项检查分两列排版避免溢出。')
  for e in g:
   if e.tag!=N+'text':continue
   t=e.text or ''
   if t.startswith('条件满足：'):
    repl(e,'条件触发：任务原文 + 条件已触发，作为系统建议送回 Planner')
   elif t.startswith('1 条件能不能被感知'):
    repl(e,'1 条件能不能被感知（副驾吃没吃饭感知不到）');txt(g,850,732,'2 条件有没有可能发生（外面 200℃）',14,'#33495b')
   elif t.startswith('3 动作是否符合价值观'):
    repl(e,'3 动作是否符合价值观');txt(g,850,753,'4 动作能不能执行（空调调到 50℃）',14,'#33495b')
  txt(g,32,842,'绿：现在办理或登记　　橙：以后办理　　黄：条件判断　　红：拒绝不合理任务　　白：任务系统　　虚线箭头：触发回流')
 elif ID=='d-sp':
  for e in g:
   if e.tag==N+'rect' and e.get('stroke-dasharray'):e.attrib.pop('stroke-dasharray',None)
  note('版式：固定部分边框改为实线；这些是固定输入，不是预研内容。六块组成与读图说明共 7 个节点，条形是占比刻度。')
  txt(g,32,804,'灰：固定部分　　绿：按本轮填写的部分　　黄：读图说明　　条形长度：各块字数占比')
 elif ID=='d-eval':
  root.set('height','920');root.set('viewBox','0 0 1240 920')
  # extend background only
  for e in g:
   if e.tag==N+'path' and e.get('d')=='M0,0 H1240 V880 H0 Z':e.set('d','M0,0 H1240 V920 H0 Z')
  note('版式：画布高度从 880 延至 920，为颜色及预研图例留出位置；3 个基础指标框、2 个预研框和打分说明共 6 个节点。')
  txt(g,32,898,'绿：功能与交互指标　　红：安全指标　　黄：打分规则　　灰色虚线框：预研中的评测方向')
 # Assign real node markers; data-decoration paths cover backgrounds/legend plates.
 for e in g:
  if e.tag==N+'rect':
   # d-sp proportional bars are charts, not flow nodes.
   if ID=='d-sp' and float(e.get('x','0'))==690:e.set('data-decoration','true')
   else:e.set('data-node','true')
  elif e.tag==N+'polygon':e.set('data-node','true')
 root.set('data-node-count',str(sum(e.get('data-node')=='true' for e in root.iter())))
 # Delete empty text after source-specific numeric snapshot removal.
 for e in list(g):
  if e.tag==N+'text' and not(e.text or '').strip():g.remove(e)
 forbidden=['资料','PRD','技术方案','宣讲','周报','逐字稿','口径','待确认','DT','小模型','OnePage','明骏','黄赌毒','《','》','清单','没有展开','未展开']
 visible='\n'.join((e.text or '') for e in root.iter() if e.tag in [N+'text',N+'title'])
 assert not [v for v in forbidden if v in visible],(ID,[v for v in forbidden if v in visible])
 assert int(root.get('data-node-count'))<=9
 ET.indent(root,space='  ')
 dest=OUT/(ID+'.svg');dest.write_text(ET.tostring(root,encoding='unicode')+'\n');ET.parse(dest)
 report={'file':dest.name,'web_identical_to_source':data['diagrams'][ID]==(BASE/'chapters/D/svg'/dest.name).read_text(),'nodes':int(root.get('data-node-count')),'xml_parse':'pass','forbidden_text':'pass'}
 reports.append(report);print(json.dumps(report,ensure_ascii=False),flush=True)
 changes+=['','共用版式清理：背景、分区与箭头文字底片由 rect 改为 path 并标记 data-decoration；真实框与菱形标记 data-node；补充颜色和箭头图例。','']
 (OUT/'changes.md').write_text('\n'.join(changes)+'\n')
(OUT/'cleanup-report.json').write_text(json.dumps(reports,ensure_ascii=False,indent=2)+'\n')
