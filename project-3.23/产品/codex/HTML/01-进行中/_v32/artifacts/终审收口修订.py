from pathlib import Path
import json,copy,shutil,datetime
ROOT=Path('/Users/bytedance/Desktop/3.23/产品/codex/HTML/01-进行中')
P=ROOT/'豆包汽车-业务学习站-v31-工作副本.html'
s=P.read_text();start=s.index('const DATA=')+len('const DATA=');d,end=json.JSONDecoder().raw_decode(s[start:]);before=copy.deepcopy(d)
pages={p['id']:p for p in d['pages']};changes=[]
ME='https://aka.doubaocdn.com/s/68EV2Q9r4X'
MEM='https://bytedance.larkoffice.com/wiki/CbJVw4ACzilvvBkRxkqcQVfAnLh'
POI='https://bytedance.larkoffice.com/wiki/Aj7AwwY5hifYvRkWxsxcR9cGnKb?from=from_copylink'
VLM='https://bytedance.larkoffice.com/wiki/NuunwklpIiGS91kg7lRcAprqnMd?from=lark_search_qa&ccm_open_type=lark_search_qa#TvdtdyavUoaSltxkMcsc9mGCnvb'
def lesson(pid,lid):return next(l for l in pages[pid]['teaching']['lessons'] if l['id']==lid)
def put(pid,lid,index,needle,new):
 a=lesson(pid,lid)['paragraphs'];assert needle in a[index],(pid,lid,index);changes.append({'page':pid,'location':lid+f'/paragraph/{index}','old':a[index],'new':new});a[index]=new
def guide(pid,index,needle,new):
 a=pages[pid]['teaching']['guides']['base']['paragraphs'];assert needle in a[index],(pid,index);changes.append({'page':pid,'location':f'guide/base/{index}','old':a[index],'new':new});a[index]=new
put('G','g-judge',1,'大小等于',lesson('G','g-judge')['paragraphs'][1].replace('大小等于','大于等于、小于等于'))
guide('K',0,'生产走最近对话',f'先从图左侧确认当前说话人、座位和可信账号关系，再分清本次是记录、查询还是删除。近期原话与摘要供当前对话接续；记忆服务另行组织经历和个人事实，供后续合法查询。图中生产与取回的箭头说明交接位置，不表示所有信息都要先过摘要、再过短期、最后进入长期。开关与多人隐私限制贯穿每一种操作。[记忆系统 PRD]({MEM})')
guide('K',6,'联动更新画像',f'记录与查询先过 K03（按入口检查记忆使用条件）。K11（关闭后冻结已有记忆）停止记录、生成和召回，近期原话仍可用于当前对话。删除时在 K13（按入口选择删除对象和范围）分清语义、情景、按人或按时间；K14（清理源内容并更新关联产物）核实际删除结果。删除语义记忆要更新画像，清空历史输入和摘要另走对应接口，不能承诺删一条就清掉所有日志。[记忆系统 PRD]({MEM})')
pages['K']['teaching']['closing'][1]='评审时分别核对：设家或公司是否受记忆开关限制，座椅是否只在用途明确时建立个人映射，历史输入和摘要是否按约定纳入人人对话及事件。11 月 4 日讨论的改造需用实际提测和发布记录确认，不能仅凭排期当成线上现状。'
put('K','k-lesson-quality',5,'联动到画像和压缩摘要',f'复核本例时，先看权限核对是否发生在检索前，再看召回范围是否符合当前在场人规则。删除另查对象和影响：语义记忆删除后更新画像，历史输入与摘要单独清理。用户说“你不记得了”，要说明信息丢在记录、生成、检索还是回答采用这一段；用户说“你怎么还记得”，则核对删除结果和残留来源。[记忆系统 PRD]({MEM})')
put('B','b-facts',7,'挡位等于 P',f'结构化视觉标签可以供触发器判断观察目标，自然语言 caption 则描述乘员动作、物品或环境细节。挡位等于 P 也是结构化条件，但它来自车辆信号，不能列作 VLM 的识别结果。同一规则可以需要不同来源，接入时要分别核任务、对象、时间和输出约定；画面遮挡或推理失败时，不能强行补一个确定标签。[VLM任务定义]({VLM})')
guide('B',3,'安全默认值','对齐以后检查缺失、过期、权限撤回与设备断连，四类异常分别留证据。旧采样可以带时间作为历史参考，但不能伪装当前温度、车速或挡位。依赖当前状态才能执行时，要补查或保持未知；不能把缓存值叫作安全默认值，再据此继续操作。每个字段的有效期按本车接口与场景规则核对。')
guide('B',5,'看过且没问题',f'视觉上传分任务状态和识别内容：控制通道说明是否启动、成功、失败或停止，数据通道提供这次观察。空输出只有在任务正常完成且画面有效时，才可解释为本次未检出目标；它不保证全车没有该对象。未取到画面、失败和超时必须另记，不能用空包覆盖有效观察。周期和一次性任务按各自上传策略处理，不能由人人对话补报推导所有视觉都补传。[VLM任务定义]({VLM})')
pages['B']['teaching']['closing'][0]='这一章讲事实如何采集、对齐、校验并供给后续模块，执行之后又怎样更新。视觉已经上报、进入 Context、被 DT 采用、被 Advisor 采用，是分别需要证据的状态；人人对话按当时讨论的接入规则和实际版本核对。'
pages['S']['teaching']['closing'][1]='评审分别检查顾问有没有绕过执行与授权链路，各开关影响哪一项任务，以及建议实际用了哪些来源。DT 在某个案例里未采用视觉，不代表 Advisor 也不可用；要查对应顾问的订阅、实际输入和建议结果。'
guide('S',5,'仅展示五类','舒适建议的交互策略在本章列为静默执行、告知执行、语音确认、界面确认四种；其他顾问按自己的业务定义处理。需要即时卡时，是否出卡及按钮文字由工程字段消费，不能把“仅展示”另加成一项已经确认的统一执行策略。规划器收到建议后还要结合当前请求决定下一步，卡片出现不代表动作已执行。')
guide('L',3,'连续三个周期','订阅后先粗筛运行时段，再检查对应事件是否满足规则。天气保护的进入、退出确认按该车型已发布版本核对，不能把不同旧稿的观察周期和样本数拼成当前标准，也不能由样本数直接推算固定等待时间。任务优先级与 TTS 音频焦点是两套规则；本章 P0 到 P3 是任务队列的目标口径，不能扩写成所有车型已实现。')
guide('L',6,'看过且没问题',f'到 L08（执行车控并读取真实状态）才检查设备变化。确认按钮命中、指令受理、灯真正亮起分别留结果。识别正常但未检出目标，只覆盖本次有效画面；失败、超时和抢占各自记录。更新结果以后，是否继续监听、结束当次交互或停止任务，按任务生命周期处理；这不自动撤销已经完成的车控。[VLM任务定义]({VLM})')
# SE starts from the chapter's real scope; memory definitions and address details remain in K.
t=pages['SE']['teaching'];t['intro']=[
 '用户说“不要再推荐辣的餐厅”，这次要保存的是个人偏好；维护人员修正“结束录音该调用哪个工具”，更新的是处理方法；研发训练新模型，改变的又是模型能力。这三种改动都可能改善下一次回答，但保存位置、使用条件和验证方式不同。本章按这些差别讲自进化与专家知识。',
 f'记忆服务保存个人事实和经历，历史输入与摘要帮助接续当前对话，知识和示例提供处理方法。PRD列出对话摘要、瞬时记忆、短期记忆、长期语义记忆、长期情景记忆五类，其中瞬时记忆在该稿标为未使用。它们不是五级串行存储，短期记忆也不等于模型的 context window。具体关系已在K章展开。[记忆系统 PRD]({MEM})',
 '本章沿一项改动追到下一次真实请求：内容有没有保存、当前车型和场景是否适用、是否实际加载进模型输入、模型有没有采用，以及工具最后是否办成。不能只因为后台出现一条记录，就认定助手已经学会；也不能把加入个人记忆说成模型已经重新训练。'
]
put('SE','se-knowledge-purpose',1,'这些都存在 context',f'模型本轮的上下文可以同时包含车况、观察、历史输入、摘要和检索出的记忆，这说明它们被送进同一次推理，不说明它们属于同一种记忆。context window 是这次模型能容纳的输入范围，短期记忆是产品记忆类型。原始日志存在、记忆生成完成、检索命中、正文进入当前输入，是需要分别核对的状态。[记忆系统 PRD]({MEM})')
put('SE','se-knowledge-purpose',2,'持久化的视觉记忆',f'长期语义记忆可保存明确的个人事实或偏好，长期情景记忆保留某次经历中的人物、时间、地点和活动。识别人脸的身份标识、视觉观察和个人记忆另有数据范围，不能笼统把它们都列为长期记忆，也不能凭“每个智能体”推定已经建好独立个人数据库。使用规则及账号隔离按K章的原文核对。[记忆系统 PRD]({MEM})')
put('SE','se-knowledge-purpose',8,'包含时可直接写入',f'个人地址的具体闭环在K章：先确认城市和完整POI名称，地点仍含糊就搜索、请用户选定，再保存；后续调用导航时带回精确地点。11月4日采用DT先补信息的讨论方向，指定PRD仍展示历史三方案，不能写成所有版本已按同一方式运行。[打通方案]({POI}) [11月4日文字记录]({ME})')
put('SE','se-knowledge-purpose',9,'包含 POI 名称',f'指定打通方案把城市与完整POI名称列为必选，同时列出POI ID、经纬度和地址。ID未标必选不等于禁止保存，完整名称是否足以精确导航仍需跨城同名等测试。自进化在这里关注的是保存对象和下一次使用一致，具体存取字段与选点体验见K章。[打通方案]({POI})')
HIST=f'11月4日讨论保留最近5轮人机对话，再补入往前5次混合输入中的非人机部分，包括人人对话与事件。摘要也拟扩大输入范围，但22轮上限与记忆侧20轮或20分钟的计数衔接仍需研发核对。删除独立旧事件流变量只调整提示入口，不等于删掉采集和日志；不能把最近5次混合输入写成额外固定5轮人人对话。[11月4日文字记录]({ME})'
put('SE','se-knowledge-types',1,'最新 5 轮',HIST)
put('SE','se-knowledge-types',2,'采集上传正在外审',f'上报把端上记录传给接收服务。激活态实时上报，降级时每10句打包，未满10句但沉默30秒也报；有效query携带未报内容。真正断网先暂存，恢复后补报，按发生时间组织。它是输入供给步骤，是否进入本轮历史、摘要和后续记忆，还要继续查各自处理结果，不把讨论排期当作全车已上线。[11月4日文字记录]({ME})')
put('SE','se-knowledge-types',9,'短期记忆的更新方式',f'更新记忆时要核对生成对象、输入来源、保存结果和后续检索，而不只看模型是否输出过一段文本。VLM流式描述、任务状态表和主模型上下文是不同产物；PRD没有把“放进任意Agent的context window”定义为短期记忆更新方式。经历如何生成、归谁、何时可查，按对应版本的记忆服务核对。[记忆系统 PRD]({MEM})')
# Remove address/upload padding from a lesson about oral teaching; use the same business case end to end.
l=lesson('SE','se-teach-by-voice');changes.append({'page':'SE','location':l['id'],'old':l['paragraphs'],'new':'同一偏好案例连续讲解，删除地址和上传硬塞'});l['paragraphs']=[
 '用户说“以后找餐厅别推荐辣的”，给出了一条可用于后续推荐的个人要求。先确定这句话是谁说的、是否在可记录的授权范围、是不是稳定要求；“今天胃不舒服，先别吃辣”只说明当下情况，不能去掉时间条件后存成永久偏好。',
 f'有合法记录条件时，按语义记忆流程保存主体、要求和来源。记忆服务受理、完成生成并落库，是不同阶段。工具返回已受理时只能按实际回执说明，不能因为助手已经说“记住了”就认定以后一定查得到。[记忆系统 PRD]({MEM})',
 '下一次用户说“找附近餐厅”，系统先按本轮权限取相关背景；没有带出该偏好时，再按需要显式查询。模型必须拿到保存的要求，才能在这次候选中考虑它。不能把上一次输出里的偏好当成今天已经注入，也不能从没有召回直接判定记录被删了。',
 '检索到了“不推荐辣的”以后，还要查候选餐厅的信息是否足够支持判断。菜品和口味不明确时，补查或向用户说明信息不足，不凭餐厅名字就声称满足偏好。记忆给的是选择依据，搜索工具给候选，Director组织本次建议，导航执行还要有用户当前要求。',
 f'验证沿同一条要求检查：原话有没有保留主体和条件，记忆有没有生成，下一次是否合法召回，模型是否按它筛选，以及用户修改或删除后是否更新画像。关掉记忆开关会停止记录、生成和召回，不能把开关关闭误报成模型遗忘；近期原话仍可能支持当前回答。[记忆系统 PRD]({MEM})'
]
# Weather scenario is a boundary example, not a second unofficial specification.
l=lesson('SE','se-expert-quality');assert '天气保护一期' in l['paragraphs'][6];changes.append({'page':'SE','location':l['id']+'/weather','old':l['paragraphs'][6:],'new':'移除互斥防抖数字，保留版本核对'});l['paragraphs']=l['paragraphs'][:6]+[
 '天气保护可以检验同一原则：知识里写“雾天建议开后雾灯”，并不证明当前画面确有浓雾、灯仍关闭、车辆允许动作或用户已确认。具体判定和确认规则应回到本车发布版本，不从专家知识例子补造执行条件。',
 '进入、退出、重复触发与观察周期是不同参数。旧稿之间有不防抖与连续多次确认的不同口径，未核当前版本时不能把数字拼成现行规则。L章保留这种版本边界，实际验证要同时看有效观察、触发判定、卡片确认与灯光回读。'
]
put('SE','se-learning-boundary',8,'可独立完成基础车控与问答','离线能力要按本车部署与接入逐项验证。1.7B FC负责把约定范围内的文字转换成调用参数，不自动具备所有问答；视觉任务与Edge_DT另按R章说明。即使模型在端侧运行，基础车控仍需要本地设备、接口、权限及结果回读，不能由模型规模推定全车离线能力。')
guide('SE',0,'先看记忆分几层','先认清改动对象：个人记忆保存事实，专家知识给处理方法，动态示例提供参考决策，模型训练改变模型能力。图上的保存与加载关系要追到下一次真实请求，不能按框的位置推定记忆逐层搬运。知识只提供方法，当前车辆事实和用户要求仍要由实际输入确定。')
guide('SE',2,'最新 5 轮',HIST)
guide('SE',3,'固定 10 句',f'人人对话上报与摘要是不同处理阶段：上报把记录传给接收服务，摘要压缩已纳入的历史输入。激活、降级批量、断网暂存和恢复补报按各自规则看；摘要覆盖轮次、耗时和生成完成另查。一次压缩约1.7至1.8秒是会上反馈，不是1.7B模型规模或稳定性能承诺。[11月4日文字记录]({ME})')
guide('SE',4,'ID 待确认',f'地点记忆以城市和完整POI名称确认对象，POI ID未标必选也未被禁止。保存、下一次取回与导航定位分别验证，具体三种写入方案及选点体验在K章讲，不把这些地址规则扩成全部个人记忆的生产流程。[打通方案]({POI})')
t['closing']=['这一章用保存、适用性筛选、加载、采用和真实执行结果检查知识改动；个人记忆、运行规则与模型训练分别核验。','评审看改动是否解决原问题，是否误伤相近或相反请求，修改和删除能否更新到后续使用。未验证的车型、输入或执行环节，保留明确范围。']
# Update legacy sections by explicit teaching target, not by array position.
for pg in d['pages']:
 ls={l['id']:l for l in pg.get('teaching',{}).get('lessons',[])}
 for sec in pg.get('sections',[]):
  target=sec.get('teachingTarget')
  if target in ls:sec['paragraphs']=copy.deepcopy(ls[target]['paragraphs'])
# Preserve all SVG payloads across all data, not only the overall map.
def svg_values(x,path='D',out=None):
 if out is None:out={}
 if isinstance(x,dict):
  for k,v in x.items():svg_values(v,path+'.'+k,out)
 elif isinstance(x,list):
  for i,v in enumerate(x):svg_values(v,path+f'[{i}]',out)
 elif isinstance(x,str) and '<svg' in x:out[path]=x
 return out
assert svg_values(before)==svg_values(d),'SVG changed'
d['meta']['validation']='已修订本轮独立审读发现的正文与指南残留；完整事实与全源覆盖不以路由或字数检查代替。'
bak=ROOT/'_backup';bak.mkdir(exist_ok=True);backup=bak/('学习站-终审收口前-'+datetime.datetime.now().strftime('%Y%m%d%H%M%S')+'.html');shutil.copy2(P,backup)
P.write_text(s[:start]+json.dumps(d,ensure_ascii=False,separators=(',',':'))+s[start+end:])
(ROOT/'_v32/artifacts/终审收口修改记录.json').write_text(json.dumps({'backup':str(backup),'changes':changes,'originalSvgPayloadsPreserved':len(svg_values(before))},ensure_ascii=False,indent=2))
focus=[]
for pg in d['pages']:
 if pg['id'] in ['B','L','S','K','SE','G']:
  focus.append('# '+pg['id']+' '+pg['title']+'\n\n'+'\n\n'.join(pg['teaching']['intro']))
  for l in pg['teaching']['lessons']:
   if any(c['page']==pg['id'] and c['location'].startswith(l['id']) for c in changes):focus.append('## '+l['id']+'\n\n'+'\n\n'.join(l['paragraphs']))
  for key,g in pg['teaching']['guides'].items():focus.append('## guide '+key+'\n\n'+'\n\n'.join(g['paragraphs']))
  focus.append('## closing\n\n'+'\n\n'.join(pg['teaching']['closing']))
(ROOT/'_v32/artifacts/终审修后重点.md').write_text('\n\n'.join(focus))
print(json.dumps({'written':str(P),'changes':len(changes),'svgPayloadsPreserved':len(svg_values(before)),'backup':str(backup),'auditCharacters':sum(map(len,focus))},ensure_ascii=False))
