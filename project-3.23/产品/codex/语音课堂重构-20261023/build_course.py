from pathlib import Path
import re,json,html,importlib.util,zipfile
from markdown_it import MarkdownIt
R=Path(__file__).parent
ROOT=R.parent
OLD=ROOT/'语音课堂研究-20261022'
spec=importlib.util.spec_from_file_location('flows',OLD/'lesson_flows.py'); lf=importlib.util.module_from_spec(spec);spec.loader.exec_module(lf)
OUT=ROOT/'HTML/01-进行中';OUT.mkdir(exist_ok=True,parents=True)
versions=[]
for p in (ROOT/'HTML').rglob('豆包座舱语音闭环-图文课堂版-v*.html'):
 m=re.search(r'-v(\d+)\.html$',p.name)
 if m:versions.append(int(m[1]))
V=max(versions+[0])+1
md=MarkdownIt('commonmark',{'html':True}).enable('table')
source=(ROOT/'HTML/02-已交付/豆包座舱语音闭环-培训讲稿-v06.md').read_text()
source=source.replace('资料核验截至 2026-10-22','资料核验截至 2026-10-23')
start=source.index('## 第一讲')
source=(R/'课程补充.md').read_text()+'\n<!-- FLOW:overview -->\n\n'+source[start:]
# The first hearing lesson is replaced by a continuous, freshly verified explanation.
a=source.index('## 第二讲'); b=source.index('## 第三讲')
oldsecond=source[a:b]
voice=(R/'voice-lesson.md').read_text().split('## 先把这句话放进车里',1)[1].split('## 第五站：端云选择',1)[0]
voice='## 第二讲：听清、等够、提前准备——ASR、VAD 与预请求\n\n'+voice
voice=re.sub(r'## (第一站.*?)\n',r'### 2.1 \1\n',voice)
voice=re.sub(r'## (第二站.*?)\n',r'### 2.2 \1\n',voice)
voice=re.sub(r'## (第三站.*?)\n',r'### 2.3 \1\n',voice)
voice=re.sub(r'## (第四站.*?)\n',r'### 2.4 \1\n',voice)
voice=voice.replace('### 2.2 第二站','<!-- FLOW:hearing -->\n\n### 2.2 第二站')
voice=voice.replace('### 2.4 第四站','### 2.4 第四站')
voice+='\n<!-- FLOW:precache -->\n\n'
# Preserve hotword explanations and detailed version rules from the previous edition.
hot=oldsecond[oldsecond.index('为了少听错'):oldsecond.index('接着看用户说')]
voice+='### 2.5 名字为什么听错：热词在这一段帮什么忙\n\n'+hot
voice+=oldsecond[oldsecond.index('<details>'):]
voice+='\n现在我们拿到了最终文字，也知道提前准备能否复用。请回到“去昨天那家游泳馆”：下一步先判断它是否真的是对豆包的要求，再确认由哪条能力链办理。\n\n'
voice=re.sub(r'\[S[^\]]+\]', '[本段原文依据](https://bytedance.larkoffice.com/wiki/GBcCw5c6xiWvGukPMQgcMiuKnEc)',voice)
# ASR implementation nuance is specifically tied to ASR best practices, not only OnePager.
voice=voice.replace('两路结果输出节奏不同。','两路结果输出节奏不同。')
voice=voice.replace('不是两次用户输入。','不是两次用户输入。[ASR 最佳实践](https://bytedance.larkoffice.com/docx/AL7tdY8ShoA92NxJB7Ac6PyKnX5)')
source=source[:a]+voice+source[b:]
# Correct stale AIVA and conflicting deployment claims in the old edition.
stale='赛力斯 AIVA 的 0930 更新写，当时本地 LLM 拒识和语义结果不采纳，状态机等云端。这里的**状态机**是“在听、在想、在说”在什么事件下切换的规则；本地返回 unsupported，只能说明本地不支持，不代表整轮失败。不能用通用白名单优先覆盖这个车型口径。'
replacement='AIVA 本地链路 0930 更新区分确定性缓存和本地 LLM：缓存规则优先，常规采用云端，本地 LLM 仅在断网或云端超时条件下兜底；后部仲裁章节写云端 3 秒未返回进入超时，超时后晚到结果不再执行。这里的**状态机**是“在听、在想、在说”在什么事件下切换的规则；unsupported 说明本地不能完成，不等于整轮需求无效。该文仍保留旧段，课程采用明确的 0930 更新与后部仲裁节，不代表全部车型现网配置。[AIVA 本地链路](https://bytedance.larkoffice.com/wiki/JXC3wPYxziUiJLk9ZlOcYSZ2nsg)。'
source=source.replace(stale,replacement)
source=source.replace('课堂据主链路原图讲“云端判断、端侧停播”，但归属冲突仍待研发确认','本课确认“端侧实际停播”，判断部署位置按车型和待核验文图冲突保留')
source=source.replace('普通唤醒是先叫豆包，再说需求','普通唤醒是先说项目配置的唤醒词，再说需求')
# Every diagram receives a lecturer's explanation of the handoff, not only a box label.
extras={}
for k,body in re.findall(r'^## (\w+)\n(.*?)(?=^## \w+\n|\Z)',(R/'节点细讲.md').read_text(),re.M|re.S):extras[k]=body
for k,body in extras.items():
 if k in ['hearing','precache']:continue
 marker='<!-- FLOW:'+k+' -->'
 source=source.replace(marker,marker+'\n\n'+body+'\n')
# Core case workshop completes the relation between definite command, feeling, feedback and cancellation.
pl=(R/'planner-output-lesson.md').read_text()
workshop=pl[pl.index('## 第五段：'):pl.index('## 第七段：')]
workshop=workshop.replace('## 第五段：','### 换一个表达：').replace('## 第六段：','### 再换一个结果：')
idx=source.index('## 第五讲')
source=source[:idx]+workshop+'\n'+source[idx:]
# Cover the training's own semantic boundaries, without presenting an old lesson as a source.
source=source.replace('本稿依据已核读正文、真实培训逐字稿及三份补查报告重写。OnePager 原画板及 Planner、Context、车外等本地原图已有核读，但不代表飞书相关文档和全部图片均已穷尽。','本版以 v06 七讲为底稿，重读真实产品培训逐字稿、本地原始材料，并由子 agent 实时飞书检索核验 ASR/VAD、Director 和 AIVA 关键口径。正文完整阅读、正文片段、仅元数据和权限缺口分别记录。课程流程图是教学重绘，案例与动画是教学示意；没有把全部搜索命中或所有原图声称为已经读完。')
source=source.replace('原图已有核读','原图的历史核读状态保留在旧研究档案')
# Inject live simulations at the exact point where the explanation requires them.
source=source.replace('<!-- FLOW:hearing -->','<!-- FLOW:hearing -->\n\n<!-- LAB:voice -->')
source=source.replace('<!-- FLOW:planner -->','<!-- FLOW:planner -->\n\n<!-- LAB:planner -->')
source=source.replace('<!-- FLOW:tts -->','<!-- FLOW:tts -->\n\n<!-- LAB:output -->')
# Preserve original chapter structure; add explicit one-line handoff position for first-time learners.
chapter_hint={
'课前':'先看到一轮正确结果，再倒回用户刚开口时。',
'第一讲':'用户声音 → 可用音频与说话来源；还没有最终文字。',
'第二讲':'同一段声音 → ASR/VAD并行 → 收尾与最终文字 → 正式请求。',
'第三讲':'最终文字 → 有效性判断 → 本轮采用哪条处理路径。',
'第四讲':'有效请求 + 背景 → Planner动作 → 工具反馈 → 再判断。',
'第五讲':'回复文字 → 选定音频来源 → TTS → 取流 → 实际播放。',
'第六讲':'新输入到来 → 分开处理声音、推理和已经发生的动作。',
'第七讲':'车外与主动事件经自己的入口，接回后面的判断和执行。',
'结课':'从用户现象出发，找到同一请求中第一个没有接好的节点。'}
# Glossary definitions are instructional, not claims that every listed module exists as an independent service.
G=[
('asr','ASR','Automatic Speech Recognition · 语音识别','把音频认成文字。它回答用户说了什么，不负责决定执行哪个动作。','你说“二十四度”，ASR 给出“24度”；温度听错先对原声与 final。'),
('stream','流式','Streaming · 陆续返回','材料尚在到来，系统就陆续交出已经处理好的部分。识别、生成、合成、播放都可以各自采用流式。','用户还没说完，屏上已有过程文字；不代表可以正式执行。'),
('partial','partial','过程识别结果','同一段语音的临时听写稿，可能随续说或识别修正而变化。','先出现“去游泳馆”，后补成“去游泳馆附近的餐厅”。'),
('final','final','本段识别定稿','识别服务最终采用的这段文字；定稿仍可能有错。正式处理需知道采用的是哪份文字。','过程稿是24度，final是26度，后续不能继续按24度办理。'),
('twopass','流式二遍 ASR','及时出字 + 本段定稿','用户说一次，同一段声音由两类识别处理兼顾时效与准确；通用最佳实践可同时接收音频，定稿在分句/结束后返回。','不要求用户再说一次，也不代表执行业务两次。'),
('vad','VAD','Voice Activity Detection · 语音活动检测','观察人声活动和停顿，辅助判断一段话的边界；与 ASR 同时工作。','“我想去……”停一下，不一定说完；收早了丢半句，等太久显得慢。'),
('soft','Soft VAD','较短停顿后的准备点','按本课 OnePager 基线，停顿300ms可发预请求，仍继续识别，允许再次触发。','先准备拒识/背景，不提前开窗、导航或播正式答案。'),
('hard','Hard VAD','本段收尾判断','按本课 OnePager 基线，停顿600ms确认本段收尾，再取得二遍final并发送正式请求。','600ms是停顿阈值，不是整轮完成时间，也不与300ms相加。'),
('semantic','语义 VAD','意思是否完整的补充判断','结合已有文字判断表达像不像还缺后半句。优先关系和最长等待按项目版本核对。','“把空调调到……”没温度；不照搬旧文1000ms为现网值。'),
('prequery','预请求','pre_query · 提前准备','用当前草稿文字提前做允许的计算，正式请求到来后再检查是否可复用。','准备可以作废；准备成功不代表任务已执行。'),
('query','Query','用户本轮请求','交给后续处理的这轮用户输入。本课语音主线最终形成请求文字；事件输入不是新录音。','“去昨天那家游泳馆”是请求，车内温度是背景。'),
('request','request_id','本次输入的关联编号','用来关联同次输入的预请求、正式请求及相关历史；不是每个系统字段都可机械互换。','文字相同但编号不同，不能当作同一次准备。'),
('round','round_id','同次输入内请求的次序','OnePager中区分同一次输入里的多次预请求和正式请求。','不是用户又讲了几轮独立对话。'),
('hotword','热词','识别辅助候选词','把当前更可能出现的人名、地点、功能名提供给识别服务，帮助听对；不是强制替换。','名字在后台存在还不够，要确认本轮实际注入ASR。'),
('aec','AEC','Acoustic Echo Cancellation · 回声消除','处理扬声器播放声音又进入麦克风的影响，属于声学前处理。','避免豆包把自己刚说的内容再次当成用户输入。'),
('zone','音区','sound_zone · 说话座位区域','标记声音来自哪个座位区域，和姓名、账号、动作目标位置分别理解。','主驾说“打开副驾车窗”：说话来源主驾，控制对象副驾。'),
('voiceprint','声纹','声音身份匹配','判断声音是否匹配登记的人；不等于确定当前座位，也不自动获得全部数据权限。','认出某人声音后，仍需按账号与授权确定可查记忆。'),
('rejection','拒识','Reject / Recall · 接不接这句话','判断是否应该作为对助手的有效输入；不是字准率，也不是能力和安全校验。','乘客之间聊天可以听得很准，但不该抢答。'),
('streamreject','流式拒识','过程文字阶段的有效性判断','可参与播报中是否尽早停声的判断；最终是否接纳新请求仍需后续判断。','中间停过播报，最后仍可能判断只是旁人聊天。'),
('arbitration','端云仲裁','决定采用哪一路结果','端侧和云端可能并行准备，按车型版本、能力和网络条件采纳本轮结果。','本地已兜底后，不能让失效云端结果又执行一次。'),
('nlu','NLU','Natural Language Understanding · 自然语言理解','理解用户表达的意思，具体可分布在规则、意图和Planner等环节，不必是独立服务。','识别出“有点热”后，仍要理解感受与场景，不能固定变成24度。'),
('context','Context','上下文 · 本轮办理背景','为判断提供当前车况、说话来源、近期历史、记忆和能力等相关材料。','听清“昨天那家”仍缺地址，需要已有背景或再查询。'),
('sync','context/sync','把本地经历同步给云端','同步用户原话Query、回复Answer和实际观察Observation，使后续理解能接上。','同步和查询方向不同；同步失败的重试保证需看项目。'),
('planner','Planner / Director','规划与对话决策职责','利用需求、背景和工具反馈决定做什么、说什么；不是自己替代地图或车辆执行器。','缺地点先查，多个候选先澄清，反馈回来再决定下一步。'),
('actions','action_list','本轮动作清单','写交给下游的能力调用和要求；参数必须有依据。','“查记忆”的结果决定“导航到哪里”，两步不能无视依赖一起发。'),
('feedback','tool_feedback','工具实际返回的信息','把查到了什么、执行到了哪一步、成功还是失败带回后续判断。','受理、执行完成、超时未确认是不同结果。'),
('observation','Observation','实际观察到的结果','在相关协议中承载工具和执行事实；与系统对用户说的话分别记录。','“我帮你查”是回复，“查到两家”才是观察结果。'),
('react','ReAct','思考—行动—观察—再思考','用结果推动下一步决策的回环。内部多轮不一定让用户多说几次。','先查昨天地点，读反馈，再安排导航。'),
('nlg','NLG / talk_content','组织要说的话','把事实、进度或澄清写成用户能理解的文字；可能由模型或模板产生。','工具只受理时，不抢先写“已经完成”。'),
('tts','TTS','Text to Speech · 语音合成','把允许播报的文字和适用表达要求合成音频，不负责证明业务成功。','合成成功以后，还要取到音频并由播放器真正播出。'),
('wss','TTS WSS','持续接收音频的安全连接','本课 OnePager 的车端取音频通道。具体接口和异常策略按项目协议。','有音频标识不等于声音已经送到耳朵。'),
('axis','打轴','文本与音频进度对应','帮助知道停播时哪些字已经说过、哪些还未说。精确时间与估算必须区分。','记录“已播/未播”后，下一轮才能自然衔接，非自动恢复命令。'),
('eof','EOF','End of File / Stream · 当前流结束标记','表示这一路数据已经到末尾；端上可能仍有待播缓冲。','不是报错，也不是用户已听完的证明。'),
('s2s','S2S','Speech to Speech · 语音到语音能力','材料中也用于声音演绎分支；是否保留文字和Planner要按对应接入方案。','不能看见S2S三个字就删除当前ASR/TTS链路。'),
('hmi','HMI','Human–Machine Interface · 人机交互界面','用户看见、听见和能够操作的状态及界面呈现。','在听、在想、工具加载、结果卡要与真实处理阶段对应。'),
('dm','DM','Dialogue Management · 对话管理','管理当前交互状态与衔接规则；本课按职责解释，不另发明统一服务归属。','何时进入聆听、播报后等多久、何时退出要按项目。'),
('fc','FC / Function Call','结构化能力调用','把设备、位置、动作、数值等组织为下游可校验的要求。','产生FC不等于车已经执行。'),
('event','Event','事件输入','系统报告某件事发生了，可成为后续决策输入，不必有用户新录音。','定时到点、允许恢复的播报事件，不需要再经过ASR。'),
('trigger','Trigger','触发器 · 检查约定条件','检查时间或信号条件是否成立，并通知对应消费者。','条件命中不等于提醒已经实际播放。'),
('advisor','Advisor','建议模块','围绕相关目标或情景提供服务建议；后续按场景进入决策或对应出口。','不是每条用户语音都串行经过所有Advisor。'),
('token','首 token','模型开始输出的首个片段','表示模型开始交出输出片段；不能据此证明此前没有工具动作。','首token、首音频、真实起播是三个时间点。'),
('inputmanager','输入管理','决定本轮何时开始与如何协调','拟改造材料中用于协调用户、事件和工具反馈，区分计算与输出许可。','本课标拟改造；具体车型上线与回执仍需核验。')
]
# Link the first explicit definition to the dictionary; retain readable terms in the main prose.
for gid,name,eng,definition,example in G:
 for alias in [name]+({'asr':['ASR'],'vad':['VAD'],'tts':['TTS'],'context':['Context'],'planner':['Planner'],'soft':['Soft VAD'],'hard':['Hard VAD']}.get(gid,[])):
  pattern=r'\*\*('+re.escape(alias)+r')([，、][^*]*?)?\*\*'
  source,n=re.subn(pattern,lambda m:'<a class="term" href="#term-'+gid+'">'+m[1]+'</a>'+(m[2] or ''),source,count=1)
  if n:break
# Section parsing preserves the seven original lectures.
chunks=re.split(r'^## (.+)\n',source,flags=re.M)
chapters=[]
for i in range(1,len(chunks),2):
 title,body=chunks[i],chunks[i+1]
 if title.startswith('参数旁注'):continue
 chapters.append((title,body))
# diagrams are conceptual redraws with source context; stale short notes updated.
lf.F['routing']['scope']='业务判断关系图；不同车型规则分开讲，端云候选可并行准备'
for f in lf.F.values():
 for n in f['nodes']:
  n['sub']=n['sub'].replace('等云策略','项目采信策略')
for i,(nid,t) in enumerate(lf.F['routing']['explain']):
 lf.F['routing']['explain'][i]=(nid,t.replace('赛力斯AIVA的等云策略','AIVA的缓存优先、云端常规与本地LLM兜底策略'))
# Timeline labs have a persistent state ledger and no hidden auto-execution claims.
LABS={
'voice':dict(title='实验一：用户停一下，系统能不能开始执行？',intro='教学示意。选一个分支，逐帧看声音、过程文字、判停、准备和动作。动画不是实车耗时；300/600ms仅对应本课OnePager基线。',choices=[('continue','停顿后继续补话'),('revise','二遍把草稿修正'),('same','草稿与定稿完全相同')],lanes=['用户声音','ASR 文字','VAD 判停','前置准备','正式处理']),
'planner':dict(title='实验二：同一句要求，工具结果不同，下一步就不同',intro='教学案例“去昨天那家游泳馆”。先用唯一地点走一遍，再切换多个候选、无记录和查询失败，观察导航条件是否具备。',choices=[('unique','找到唯一可靠地点'),('two','返回两个候选'),('none','没有相关记录'),('failure','查询执行失败')],lanes=['当前用户目标','已知事实','Planner 决定','工具执行 / 反馈','用户看到听到']),
'output':dict(title='实验三：声音停了，导航也取消了吗？',intro='教学状态实验。区分文字生成、音频合成、实际播放和导航状态。取消分支是假设存在取消能力的演示，不是车型能力承诺。',choices=[('playing','正常流式播放'),('interrupt','用户插话：仅观察停播'),('cancelok','另发取消且返回成功'),('cancelfail','取消未成功或未确认')],lanes=['文字生成','TTS 音频','车端播放器','导航真实状态','后续处理'])}
def lab(k):
 d=LABS[k]
 return '<section class="lab" data-lab="'+k+'"><div class="lab-tag">可暂停的课堂实验</div><h3>'+d['title']+'</h3><p class="lab-intro">'+d['intro']+'</p><label>切换分支 <select aria-label="'+d['title']+'分支">'+''.join('<option value="'+v+'">'+t+'</option>' for v,t in d['choices'])+'</select></label><div class="lab-steps"></div><div class="state-ledger">'+''.join('<div class="lane"><span>'+x+'</span><b>等待开始</b><i></i></div>' for x in d['lanes'])+'</div><div class="lab-controls"><button data-prev>← 上一帧</button><button data-play>自动演示</button><button data-next>下一帧 →</button><button data-reset>重播</button><span class="frame-count"></span></div><div class="teacher" aria-live="polite"><strong>老师带你看这一帧</strong><p></p></div></section>'
article=[];toc=[]
for ci,(title,body) in enumerate(chapters):
 cid='chapter-'+str(ci);toc.append((cid,title))
 key=next((k for k in chapter_hint if title.startswith(k)),None)
 rendered=md.render(body)
 for k in lf.F:
  rendered=rendered.replace('<!-- FLOW:'+k+' -->',lf.render(k))
 for k in LABS:rendered=rendered.replace('<!-- LAB:'+k+' -->',lab(k))
 prev=f'<a href="#chapter-{ci-1}">← 上一讲</a>' if ci else '<a href="#home">课程首页</a>'
 nxt=f'<a href="#chapter-{ci+1}">下一讲 →</a>' if ci+1<len(chapters) else '<a href="#dictionary">查名词与来源 →</a>'
 hint=chapter_hint.get(key,'沿着同一条请求，把输入、判断和实际结果对起来。')
 article.append(f'<section class="chapter" id="{cid}" data-chapter="{ci}"><div class="chapter-eyebrow">课堂 {ci+1:02d} / {len(chapters):02d}</div><h2>{title}</h2><div class="handoff"><span>这一讲走到哪</span>{hint}</div>{rendered}<nav class="chapter-bottom">{prev}<a href="#home">回课程导览</a>{nxt}</nav></section>')
links={}
for title,url in re.findall(r'\[([^\]]+)\]\((https://[^)]+)\)',source):links.setdefault(url,title)
for title,url in [('ASR 最佳实践','https://bytedance.larkoffice.com/docx/AL7tdY8ShoA92NxJB7Ac6PyKnX5'),('豆包语音识别模型2.0','https://bytedance.larkoffice.com/wiki/BPFiwY9WKizW59kRKiBcOM6Ynxf'),('Director PRD','https://bytedance.larkoffice.com/wiki/XRuKwJ0VPisdUhkxH0ecY1rRn9g'),('AIVA 本地对话链路','https://bytedance.larkoffice.com/wiki/JXC3wPYxziUiJLk9ZlOcYSZ2nsg')]:links[url]=title
live=['GBcCw5c6xiWvGukPMQgcMiuKnEc','AL7tdY8ShoA92NxJB7Ac6PyKnX5','BPFiwY9WKizW59kRKiBcOM6Ynxf']
partial=['XRuKwJ0VPisdUhkxH0ecY1rRn9g','JXC3wPYxziUiJLk9ZlOcYSZ2nsg']
sources='<section class="chapter" id="sources"><div class="chapter-eyebrow">给评审留出处</div><h2>来源、版本与还需要确认的内容</h2><p>主课采用语音基础体验 OnePager 的300/600ms口径，配合原始产品培训的讲法。下列状态说明的是本次取证方式，不是能力上线状态。相关来源曾经读取过，不等于本轮实时复查全文；搜索命中数也不等于正文已读数。</p><div class="table-wrap"><table><thead><tr><th>资料</th><th>本次证据状态</th></tr></thead><tbody>'
for url,title in links.items():
 status='本地原始材料 / 旧版讲稿引用；本轮未重验全文'
 if any(x in url for x in live):status='子 agent 本轮实时读取原始正文'
 elif any(x in url for x in partial):status='本轮飞书正文片段 + 本地原文相应章节核对'
 elif 'W9VLd0' in url or 'YsMJd5' in url:status='本地培训 / 会议文字记录；未用 AI 摘要替代'
 sources+='<tr><td><a href="'+html.escape(url)+'" target="_blank" rel="noopener">'+html.escape(title)+'</a></td><td>'+status+'</td></tr>'
sources+='</tbody></table></div><h3>需要保留的版本边界</h3><p>旧多级VAD PRD 的 Hard 500ms、语义1000ms是暂定方案，通用ASR模型默认800ms是另一层配置，不能与汽车OnePager的600ms相加或混用。输入管理中的计算许可、输出许可和新的播放状态定义属于拟改造内容。AIVA的本地缓存/本地LLM采信按0930更新单独讲，不用旧白名单策略覆盖。</p><p>流式拒识的部署位置存在文图差异；不同车型最终拒识后的恢复策略不一致；车外语音必要条件尚未补齐；一般改口时已下发动作如何取消、二遍失败如何降级等仍需对应团队确认。未取得权限的打断恢复OnePage、拒识和热词专项材料，不写成已经完整核验。</p><details><summary>查看三组子 agent 的核验记录与教学审校</summary>'+md.render((R/'voice-evidence.md').read_text().split('## 本轮飞书搜索返回元数据')[0]) + md.render((R/'planner-output-evidence.md').read_text())+md.render((R/'style-audit.md').read_text())+'</details></section>'
dictionary='<section class="chapter" id="dictionary"><div class="chapter-eyebrow">不用背缩写，回到场景理解</div><h2>名词随用随查</h2><p>第一次阅读先跟故事走。卡在哪个词，就点正文带下划线的词，或在这里搜索中文、英文和例子。定义描述职责，不表示每个名词都是一个独立服务。</p><label class="search-label">查词 <input type="search" id="term-search" placeholder="例如：hard、打轴、tool_feedback" aria-label="搜索名词"></label><p id="term-count"></p><div class="terms">'
for gid,name,eng,definition,example in G:
 dictionary+='<article class="term-card" id="term-'+gid+'"><h3>'+html.escape(name)+'</h3><small>'+html.escape(eng)+'</small><p>'+html.escape(definition)+'</p><p class="example"><b>回到车里：</b>'+html.escape(example)+'</p></article>'
dictionary+='</div></section>'
check='<section class="chapter" id="practice"><div class="chapter-eyebrow">把课堂带回评审会</div><h2>四道产品练习：沿图找证据</h2><p>先自己判断，点击展开后看讲师怎样把问题问具体。答案是培训分析方法，不代替车型策略。</p>'
for q,a in [
('屏上字都对，用户却一直没听见声音，是 ASR 慢吗？','不能只看屏幕判断。把用户说完、final返回、正式请求、工具等待、回复生成、首个非空音频和真实起播放在同一request_id时间轴，先找到等待在哪一段；并行阶段不重复相加。可以问：“最终文字已返回，后面主要是在等业务结果，还是在等音频或播放器？”'),
('豆包说导航成功，工具只返回受理，能算办完吗？','受理只说明请求被接收。需要看导航开始的真实回执或目标端状态，再核对话术和屏幕。可以问：“当前成功话术依据的是受理还是实际启动？能否把工具回包与车端状态一起看？”'),
('用户说别去了，声音停了，导航还在走，是打断失败吗？','先明确用户要停什么。停播、停止旧推理、取消已下发动作分别核对；导航若已执行，取消还要有对应能力和结果。不能只因喇叭安静就标任务已取消。'),
('主驾说自己冷，后排空调变了，先改 Planner 提示词吗？','先对同次请求的原始音区、最终文字、Context、Planner动作参数和车辆执行记录。音区错、参数映射错、模型未用正确背景、下游执行错要分别定位，找到第一次偏离再分责任。')]:check+='<details class="quiz"><summary>'+q+'</summary><p>'+a+'</p></details>'
check+='</section>'
hero='''<section class="hero" id="home"><div class="eyebrow">豆包上车 · 产品新人培训 · 图文课堂 v%02d</div><h1>从用户开口，<br>讲到事情真的办完。</h1><p class="hero-lead">今天跟着一句“去昨天那家游泳馆”，把每次交接讲清楚：刚拿到什么，还缺什么，为什么交给下一站，结果又怎样回来。</p><div class="hero-meta"><span>保留原来的七讲主线</span><span>14 张可逐节点讲解的流程图</span><span>3 个可换分支的状态动效</span><span>42 个随用随查的名词</span></div><div class="hero-actions"><a class="primary" href="#chapter-0">开始这堂课 →</a><a href="#lab-voice-anchor">先看 ASR / VAD 动效</a><a href="#dictionary">我卡在一个名词</a></div><p class="scope-note">案例和动画为教学示意。参数与策略保留来源和适用版本，不代表所有车型当前实配或实测结果。</p><div class="learning-map"><span>声音</span><b>→</b><span>最终文字</span><b>→</b><span>有效请求</span><b>→</b><span>判断与行动 ↔ 反馈</span><b>→</b><span>声音与界面</span></div></section>'''%V
hero=hero.replace('42 个',str(len(G))+' 个')
nav=''.join('<a href="#'+cid+'" data-nav="'+str(i)+'"><small>'+str(i).zfill(2)+'</small>'+html.escape(t.split('：')[0])+('</a>') for i,(cid,t) in enumerate(toc))
CSS=r'''
:root{--paper:#f8f6f0;--ink:#203b36;--green:#236a54;--gold:#b48734;--line:#dbdfd5;--muted:#66756c;--white:#fffefb}*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:92px}body{margin:0;color:var(--ink);background:var(--paper);font-family:"PingFang SC","Microsoft YaHei",system-ui,sans-serif;font-size:18px;line-height:1.95}a{color:#246d57;text-underline-offset:4px}button,input,select{font:inherit}button,select{padding:9px 14px;border:1px solid #b7c9bf;border-radius:8px;background:white;color:var(--ink);cursor:pointer}button:hover{background:#e6f1e9}button:disabled{opacity:.38;cursor:default}button:focus-visible,a:focus-visible,select:focus-visible,input:focus-visible{outline:3px solid #c19c48;outline-offset:3px}header{position:sticky;top:0;z-index:20;background:#f8f6f0f5;backdrop-filter:blur(12px);border-bottom:1px solid var(--line);height:70px;display:flex;align-items:center;justify-content:space-between;padding:0 30px;gap:16px}header strong{font-size:17px}header nav{display:flex;gap:22px;font-size:14px}header nav a{text-decoration:none}.progress{height:3px;background:#236a54;width:0;position:absolute;bottom:-1px;left:0}.layout{display:grid;grid-template-columns:205px minmax(0,1120px);max-width:1430px;margin:auto;gap:42px;padding:0 32px}.sidebar{position:sticky;top:98px;height:calc(100vh - 120px);padding-top:22px;overflow:auto;font-size:14px}.sidebar>strong{font-size:12px;letter-spacing:.15em;color:var(--muted)}.sidebar a{display:flex;gap:10px;padding:10px 6px;text-decoration:none;border-left:2px solid transparent;line-height:1.6}.sidebar a.active{background:#e8eee6;border-left-color:var(--green);font-weight:650}.sidebar small{color:#8b9a8e;min-width:18px}.sidebar .aside-links{border-top:1px solid var(--line);margin-top:20px;padding-top:10px}main{min-width:0}.hero{padding:65px 4px 45px}.eyebrow,.chapter-eyebrow{font-size:12px;letter-spacing:.16em;color:var(--green);font-weight:650}.hero h1{font-size:clamp(38px,4.3vw,62px);line-height:1.3;letter-spacing:-.035em;margin:20px 0 25px;font-weight:760}.hero-lead{font-size:21px;max-width:800px;line-height:1.9}.hero-meta{display:flex;flex-wrap:wrap;gap:8px 20px;font-size:13px;color:var(--muted)}.hero-actions{display:flex;flex-wrap:wrap;align-items:center;gap:12px 22px;margin:28px 0 18px;font-size:15px}.hero-actions a{text-decoration:none}.hero-actions .primary{padding:11px 22px;background:var(--green);color:white;border-radius:8px}.scope-note{font-size:13px;color:var(--muted)}.learning-map{display:flex;flex-wrap:wrap;align-items:center;gap:12px;margin:28px 0;padding:21px;background:#e9eee6;font-size:15px;border-radius:9px}.learning-map b{color:#9aaa9a}.chapter{padding:42px 0 54px;border-top:1px solid #c9d3c6;scroll-margin-top:85px}.chapter h2{font-size:30px;line-height:1.5;margin:12px 0 25px;letter-spacing:-.025em}.chapter h3{font-size:23px;line-height:1.65;margin:40px 0 14px}.chapter p{margin:21px 0;line-height:2.05}.chapter>p,.chapter>h3,.chapter>h4,.chapter>ul,.chapter>ol{max-width:880px}.chapter>p{font-size:18px}.handoff{border-left:3px solid var(--green);background:#edf1e8;padding:14px 20px;margin:23px 0 30px;font-size:16px;line-height:1.9}.handoff span{display:block;color:var(--green);font-size:12px;font-weight:650}.chapter-bottom{display:flex;justify-content:space-between;gap:12px;margin-top:38px;font-size:14px;flex-wrap:wrap}.chapter details{border:1px solid #d9ded3;border-radius:9px;padding:16px 20px;margin:28px 0;background:#f1f3ed}.chapter summary{cursor:pointer;font-size:16px;font-weight:650;line-height:1.8}.chapter details p{font-size:16px}.chapter details h3{font-size:20px}.chapter details table{font-size:13px}.chapter table{border-collapse:collapse;width:100%;font-size:15px;line-height:1.8;margin:24px 0;background:white}.chapter td,.chapter th{padding:12px 14px;text-align:left;border:1px solid #dce3d7;vertical-align:top}.chapter th{background:#edf1e8}.table-wrap{max-width:100%;overflow:auto}.chapter code{font-size:.87em;background:#eaf0e8;border-radius:4px;padding:2px 5px}.term{font-weight:700;text-decoration-style:dotted;text-decoration-thickness:2px}.teaching-flow{margin:32px 0!important;box-shadow:none!important;border-radius:12px!important;padding:22px!important;background:#f0f4ee!important}.teaching-svg{min-width:780px!important}.teaching-flow h3{margin-top:10px!important}.flow-narration{min-height:170px!important;border-left-color:var(--gold)!important}.flow-source{display:inline-block;margin-top:5px}.lab{background:#fffdf7;border:1px solid #c9b990;border-radius:12px;padding:25px;margin:40px 0;scroll-margin-top:100px}.lab h3{margin:6px 0 10px!important;font-size:25px}.lab-tag{font-size:12px;color:#96702c;letter-spacing:.13em}.lab-intro{font-size:15px!important;line-height:1.9!important;color:#657165}.lab label{display:flex;gap:14px;align-items:center;flex-wrap:wrap;font-size:15px;margin:18px 0}.lab select{max-width:100%}.lab-steps{display:flex;gap:5px;margin:20px 0}.lab-steps i{flex:1;height:6px;border-radius:5px;background:#e0e5dc;transition:background .3s}.lab-steps i.done{background:#41846a}.state-ledger{display:grid;gap:9px}.lane{display:grid;grid-template-columns:132px minmax(0,1fr);position:relative;gap:15px;align-items:center;padding:14px 15px;background:#f0f3ec;border-radius:8px;overflow:hidden;min-height:65px}.lane span{font-size:13px;color:#617465}.lane b{font-size:16px;line-height:1.65;font-weight:600;z-index:1}.lane i{position:absolute;bottom:0;left:0;width:0;height:3px;background:#9fbd9e;transition:width .45s}.lane.changing{animation:flash .65s ease}.lab-controls{display:flex;flex-wrap:wrap;align-items:center;gap:9px;margin:20px 0}.lab-controls button{font-size:14px;padding:8px 13px}.frame-count{font-size:13px;color:var(--muted)}.teacher{padding:18px 22px;background:#f5edda;border-radius:8px;min-height:170px}.teacher>strong{font-size:12px;letter-spacing:.06em;color:#8a662d}.teacher p{margin:10px 0 0!important;font-size:17px!important;line-height:2!important}.search-label{display:flex;gap:15px;align-items:center}.search-label input{padding:12px 15px;width:min(100%,550px);border:1px solid #afc3b5;border-radius:8px;background:white}.terms{display:grid;grid-template-columns:1fr 1fr;gap:16px}.term-card{background:white;padding:22px;border:1px solid #dae1d5;border-radius:9px;scroll-margin-top:100px}.term-card h3{margin:0 0 8px!important;font-size:22px}.term-card small{font-size:12px;color:var(--muted)}.term-card p{font-size:16px;line-height:1.9;margin:16px 0}.term-card .example{font-size:14px;padding-top:13px;border-top:1px solid #e6ebe1}.term-card[hidden]{display:none}.quiz summary{font-size:18px!important}footer{padding:35px 32px;background:#e7ede3;font-size:13px;color:#64745f;text-align:center}.floating-top{position:fixed;bottom:20px;right:20px;background:#fffef9;padding:9px 15px;border:1px solid #c5d3bf;border-radius:7px;font-size:13px;text-decoration:none;z-index:10}body.lecture-mode .chapter[data-chapter]{display:none}body.lecture-mode .chapter[data-chapter].selected{display:block}body.lecture-mode .hero{display:none}body.lecture-mode .chapter.selected{border-top:0}.flow-point.active rect{filter:none!important}@keyframes flash{50%{background:#deebda}}@media(min-width:1500px){.layout{gap:55px}}@media(max-width:1100px){.layout{grid-template-columns:155px minmax(0,1fr);gap:25px;padding:0 23px}.sidebar{font-size:12px}.hero h1{font-size:46px}.chapter h2{font-size:27px}.terms{grid-template-columns:1fr}}@media(max-width:760px){body{font-size:17px}.layout{display:block;padding:0 19px}.sidebar{position:static;height:auto;display:none}header{height:auto;min-height:64px;padding:12px 18px;flex-wrap:wrap}header nav{gap:15px;font-size:12px}header strong{font-size:15px}.hero{padding:35px 0}.hero h1{font-size:39px}.hero-lead{font-size:18px}.chapter h2{font-size:25px}.chapter h3{font-size:21px}.chapter>p{font-size:17px}.teaching-flow{padding:14px!important}.flow-toolbar button{font-size:13px;padding:8px 10px}.flow-narration{padding:15px!important;min-height:190px!important}.flow-narration p{font-size:16px!important}.lab{padding:17px}.lane{grid-template-columns:95px minmax(0,1fr);padding:12px 10px;gap:9px}.lane b{font-size:14px}.lane span{font-size:12px}.teacher p{font-size:16px!important}.lab h3{font-size:21px}.chapter table{font-size:13px}.chapter td,.chapter th{padding:9px}.chapter details{padding:14px}.search-label{display:block}.terms{grid-template-columns:1fr}.learning-map{font-size:13px;gap:8px}.floating-top{bottom:12px;right:12px}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*:before,*:after{animation:none!important;transition:none!important}}@media print{header,.sidebar,.floating-top,.lab-controls,.flow-toolbar,.chapter-bottom{display:none!important}.layout{display:block;padding:0}.chapter{page-break-before:always}.hero{padding:20px}body{background:white;font-size:12pt}.chapter details{display:block}.lab{break-inside:avoid}.teaching-svg{min-width:0!important}.flow-narration{min-height:0!important}}
'''
JS=r'''
const lessonLabSpec=__LABS__;
function voiceFrames(mode){
const tail=mode==='continue'?'把空调调到24度，只调主驾':mode==='revise'?'把空调调到26度':'把空调调到24度';
const changed=mode!=='same';
return [
{v:['用户开始说：把空调……','partial：把空调','持续有语音','尚未触发准备','动作未下发'],t:'先看同一段声音分出去的两条路。ASR边听边出字，VAD同时观察人声和停顿。这里有过程文字，用户还没有把温度要求讲完。'},
{v:['用户说完温度后停一下','partial：把空调调到24度','停顿开始计时；仍可续说','尚未达到Soft准备点','动作未下发'],t:'停顿从最后一段人声结束处观察，不是从第一个字开始计时。此刻我们还不能确认用户会不会补充“只调主驾”。'},
{v:['仍处于这一次停顿','过程稿保留，仍可能改','Soft：本课基线300ms','用当前文字发一次预请求','动作未下发；没有车控'],t:'现在点亮Soft。它只允许提前准备，ASR仍继续。请特别看最后一行：温度还没有被改变，正式回复也没有抢先播出来。'},
{v:[mode==='continue'?'用户继续补：只调主驾':'用户没有继续补话',mode==='continue'?'partial更新：把空调调到24度，只调主驾':'partial仍是：把空调调到24度',mode==='continue'?'再次有语音；后续重新观察停顿':'停顿继续，尚未收尾',changed?'原准备后续需核对，不能直接套用':'准备保留，等待定稿核对','动作仍未下发'],t:mode==='continue'?'用户补话了，当前意思发生变化。收音没有被Soft关闭，下一次停顿仍可继续准备；旧准备最终能否用，要等final来比较。':'用户没有补话，但我们仍要走到本段收尾和定稿。即使过程文字没变，也不能跳过后面的身份与文字核对。'},
{v:['本段已达到收尾条件','过程稿等待二遍定稿','Hard：本课基线600ms','保留准备，不代替最终文字','本段识别收尾，尚未执行业务'],t:'Hard表示按本方案让这一段收尾。300和600是同一次停顿上的两个阈值，不是等300后再额外等600；也不表示600时就已经开始播放答案。'},
{v:['不用用户再说一遍','final：'+tail,'本段边界已确定','等待与前一轮准备进行核对','已有正式文字，待后续办理'],t:mode==='revise'?'二遍把过程稿24度修成了26度。这个变化是教学示意；final也可能错，但后续必须知道最终采用的是26度，不能偷偷用草稿24度执行。':'二遍对同一段声音给出final，不是让用户再录一遍。通用二遍识别可同时接收声音，过程输出与定稿输出节奏不同。'},
{v:['这次输入的声音阶段完成','采用final：'+tail,'Hard与final不等于整轮成功',changed?'同次编号，但文字不同：必要模块重算':'同次编号且文字完全相同：可复用支持的准备','提交正式请求；仍需理解与执行'],t:changed?'文字比对没有通过，按最终要求重新处理必要模块。这是保护用户最新意思；准备没用上不等于故障。提交正式请求以后，还要走有效性、采信和业务判断。':'同一次request_id，且与前一轮预请求文字完全相同，支持缓存的模块才复用。复用节省准备工作，不能跳过能力校验、真实执行和结果反馈。'}];}
function plannerFrames(mode){
const result={unique:'一个可靠地点：A游泳馆及地址',two:'两个候选：A馆、B馆',none:'没有相关到访记录',failure:'查询失败：本轮未取得结果'}[mode];
const unique=mode==='unique';
return [
{v:['去昨天那家游泳馆','“昨天那家”具体地址未知','先判断缺什么','尚未调用','等待查询结果'],t:'最终文字已经听对，但还没有目的地事实。ASR这一步完成，不代表地点已经补齐。我们先检查Context里有没有可靠且唯一的目标。'},
{v:['用户目标保持不变','当前背景仍缺地址','action_list：安排记忆查询','查询工具处理中','可提示“帮你查一下”，不是成功'],t:'Planner把缺口转为具体查询。这里的工具名字和返回是教学业务描述，具体接口按项目。发出查询不等于找到地点，所以导航仍不能启动。'},
{v:['用户目标保持不变',result,'读tool_feedback，重新判断','查询结果回到Planner','根据真实查询结果决定下一步'],t:'现在看回来的箭头。tool_feedback给出实际查到了什么，而不是让模型猜。切换下拉框，可以看到同一句话因反馈不同，后面走向不同。'},
{v:['用户目标保持不变',result,unique?'唯一目标足够明确：可安排导航':mode==='two'?'目标不唯一：请用户选择':mode==='none'?'信息不足：请用户补地点':'查询失败：如实说明或按能力继续',unique?'导航动作已下发；尚未确认完成':'不发导航动作',unique?'可说明正在办理，不抢报成功':mode==='two'?'问：你说的是A馆还是B馆？':mode==='none'?'请补充名称或位置':'说明这次没有查到结果'],t:unique?'现在才具备下一步的目的地参数。查记忆和导航有先后依赖，不能把地址未知的导航与查询一起发。注意动作已发仍不是实际启动。':'这条分支没有足够依据导航。澄清、缺信息、查询失败是不同结果，但都不能让动画自动跳到“导航成功”。'},
{v:['用户目标保持不变',result,unique?'读取导航工具真实反馈':'等待用户补充或后续处理',unique?'地图仅受理：尚未确认导航开始':'导航保持未下发',unique?'暂不能说“已经开始导航”':'不假装已经完成'],t:unique?'导航工具目前只确认受理。受理表示接到请求，不能当作已经启动。我们还需要真正的执行结果或目标端状态。':'用户可能需要补一句话，但前面的系统内部几轮并不都要求用户再说。先把缺的事实明确，下一轮才有可靠依据。'},
{v:['本轮走到明确结果',result,unique?'以导航成功反馈组织回复':'保留事实，等待合法下一步',unique?'教学假设：收到导航已开始的真实反馈':'没有执行导航',unique?'NLG组织结果 → TTS合成 → 实际播放':'按本分支如实澄清或解释'],t:unique?'现在用教学假设的真实成功反馈收口。回复、屏幕和导航目标要一致；音频还要合成和实际播放。成功依据来自执行事实，不来自一句“好的”。':'本分支停在合理的未完成状态，不强求每次都办成。可靠地解释缺口，比没有依据地告诉用户已完成更重要。'}];}
function outputFrames(mode){
const stopped=mode!=='playing';const cancel=mode==='cancelok'||mode==='cancelfail';
return [
{v:['首段结果文字已生成；后段仍在生成','前段开始合成','尚未开始播放','教学假设：导航已有真实成功反馈','文字与动作分别记状态'],t:'这个实验从导航确实开始之后切入。生成一句话、合成一段声音、实际播放是三条进度，不能合成一个“系统完成”的灯。'},
{v:['后段文字继续生成','前段音频已到；后段合成中','首段真实起播','导航仍在进行','播放时系统仍可接收新输入'],t:'现在播放器开始播前段，TTS还能合成后段。三条工作可重叠，这就是流式体验；这里没有给出虚构的毫秒承诺。'},
{v:['文字生成结束','音频已陆续生成和传输','仍在播缓冲内容，尚未播完','导航仍在进行','生成结束不能当作播放完成'],t:'请暂停在这一帧：云端字已经生成完，用户仍在听。最后一包到达也不能替播放器报告真实播完，进度要按实际播放记。'},
{v:['保留已经生成的文字','已生成的音频不等于还应播放',stopped?'新话命中相应停播条件：声音停止':'正常继续播放后段','导航仍在进行',stopped?'记录已播/未播；后续判断新诉求':'等待真实播放结束'],t:stopped?'用户插话后，我们仅展示停声这一结果。看看导航一行：它仍在进行。因为停止扬声器并没有自动向地图发出取消请求；实际停播条件与恢复资格按项目。':'正常播放分支继续推进。系统不应因云端流已结束，就提前把车端队列里尚未播的内容标成已听完。'},
{v:['新回复需要依据后续事实','根据当前许可决定是否继续合成',stopped?'旧声音保持停止':'播放队列尾部已耗尽',cancel?'另发导航取消；等待结果':'导航仍在进行',cancel?'示意前提：车型有相应取消能力':stopped?'是否恢复、如何衔接另行判断':'实际播放完成'],t:cancel?'现在才单独发起取消动作。我们明确把它和停声拆成两步；若车型没有取消能力，这条示意分支就不能直接变成产品承诺。':stopped?'停播以后，还要结合停止原因、新话有效性与项目规则决定怎样接。不把所有情况都画成自动续播，也不写成导航已取消。':'只有实际播完，才能记播放完成。导航执行结果和播报结束仍然是分别验收的两个状态。'},
{v:['后续话术与真实结果一致','TTS只负责合成这份正确话术',stopped?'旧播报已停止；新话按规则处理':'本段实际播放完成',mode==='cancelok'?'收到真实取消成功：导航结束':mode==='cancelfail'?'取消失败或结果未知：不能写成功':'导航仍在进行',mode==='cancelok'?'有取消依据，才说明已停止导航':mode==='cancelfail'?'如实说明失败/未确认，继续核实':stopped?'停声、停推理、取消动作分别核对':'声音和业务结果各自完成'],t:mode==='cancelok'?'只有拿到对应取消结果，才能更新为导航结束。整个过程保留导航启动过、后来取消的事实，后续Context才知道真实发生了什么。':mode==='cancelfail'?'如果取消失败或没有确认，就不能因为声音停了而告诉用户全部取消。超时只说明未取得确定结果，是否已取消要继续按协议核对。':'实验完成。你应能指出文字完成、音频完成、实际播放结束、车辆动作状态分别在哪里，不能用一个成功覆盖全部。'}];}
for(const root of document.querySelectorAll('[data-lab]')){
const kind=root.dataset.lab;root.id='lab-'+kind+'-anchor';let n=0,timer=null;const select=root.querySelector('select');
let frames;const build=()=>kind==='voice'?voiceFrames(select.value):kind==='planner'?plannerFrames(select.value):outputFrames(select.value);
function stop(){if(timer){clearInterval(timer);timer=null;}root.querySelector('[data-play]').textContent='自动演示';}
function show(i){const old=n;n=Math.min(Math.max(i,0),frames.length-1);root.querySelector('.lab-steps').innerHTML=frames.map((_,j)=>'<i class="'+(j<=n?'done':'')+'"></i>').join('');root.querySelectorAll('.lane').forEach((el,j)=>{const b=el.querySelector('b');const changed=b.textContent!==frames[n].v[j];b.textContent=frames[n].v[j];el.querySelector('i').style.width=((n+1)/frames.length*100)+'%';el.classList.remove('changing');if(changed){void el.offsetWidth;el.classList.add('changing');}});root.querySelector('.teacher p').textContent=frames[n].t;root.querySelector('.frame-count').textContent=`第 ${n+1} / ${frames.length} 帧`;root.querySelector('[data-prev]').disabled=n===0;root.querySelector('[data-next]').disabled=n===frames.length-1;if(n===frames.length-1)stop();}
function reset(){stop();frames=build();show(0);}
root.querySelector('[data-prev]').onclick=()=>{stop();show(n-1)};root.querySelector('[data-next]').onclick=()=>{stop();show(n+1)};root.querySelector('[data-reset]').onclick=reset;select.onchange=reset;
root.querySelector('[data-play]').onclick=()=>{if(timer){stop();return}if(n===frames.length-1)show(0);root.querySelector('[data-play]').textContent='暂停演示';timer=setInterval(()=>show(n+1),5500);};reset();
}
const search=document.getElementById('term-search');function filterTerms(){const q=search.value.trim().toLowerCase();let n=0;document.querySelectorAll('.term-card').forEach(el=>{const ok=!q||el.textContent.toLowerCase().includes(q);el.hidden=!ok;if(ok)n++});document.getElementById('term-count').textContent=`找到 ${n} 个名词`;}search.addEventListener('input',filterTerms);filterTerms();
let lectureMode=false;let selectedChapter=0;const sections=[...document.querySelectorAll('[data-chapter]')];
function selectChapter(i){selectedChapter=i;sections.forEach((el,j)=>el.classList.toggle('selected',i===j));document.querySelectorAll('[data-nav]').forEach(el=>el.classList.toggle('active',+el.dataset.nav===i));}
function checkHash(){const h=location.hash;const target=h?document.getElementById(h.slice(1)):null;if(target){const sec=target.closest('[data-chapter]');if(sec){selectChapter(+sec.dataset.chapter)}else if(lectureMode){document.body.classList.remove('lecture-mode');lectureMode=false;document.getElementById('mode-toggle').textContent='逐讲模式';}if(lectureMode)target.scrollIntoView();}}
document.getElementById('mode-toggle').onclick=()=>{lectureMode=!lectureMode;document.body.classList.toggle('lecture-mode',lectureMode);document.getElementById('mode-toggle').textContent=lectureMode?'连续阅读':'逐讲模式';selectChapter(selectedChapter);if(lectureMode)sections[selectedChapter].scrollIntoView();};window.addEventListener('hashchange',checkHash);selectChapter(0);checkHash();
let ticking=false;window.addEventListener('scroll',()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{const h=document.documentElement.scrollHeight-innerHeight;document.querySelector('.progress').style.width=(h?scrollY/h*100:0)+'%';if(!lectureMode){let i=0;sections.forEach((el,j)=>{if(el.getBoundingClientRect().top<180)i=j});selectChapter(i)}ticking=false;});});
'''.replace('__LABS__',json.dumps(LABS,ensure_ascii=False))
page='<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>豆包座舱语音闭环 · 图文培训课堂 v%02d</title><style>'%V+lf.CSS+CSS+'</style></head><body><header><strong>豆包上车 · 一次语音的完整课堂</strong><nav><a href="#home">课程导览</a><a href="#dictionary">名词解释</a><a href="#practice">评审练习</a><a href="#sources">资料依据</a><button id="mode-toggle" style="font-size:12px;padding:4px 9px">逐讲模式</button></nav><div class="progress"></div></header><div class="layout"><aside class="sidebar"><strong>顺着一条请求学</strong>'+nav+'<div class="aside-links"><a href="#lab-voice-anchor">ASR / VAD 动效</a><a href="#lab-planner-anchor">Planner 回流动效</a><a href="#lab-output-anchor">合成、播放与取消</a><a href="#dictionary">名词随用随查</a><a href="#practice">产品评审练习</a><a href="#sources">依据与待核验</a></div></aside><main>'+hero+''.join(article)+dictionary+check+sources+'</main></div><footer>图文课堂 v%02d · 2026-10-23<br>沿用户问题、节点交接和真实结果讲解；案例与动效为教学示意。</footer>'%V+'<a class="floating-top" href="#home">回课程首页 ↑</a><script>'+lf.JS.replace('__FLOWS__',json.dumps(lf.F,ensure_ascii=False))+JS+'</script></body></html>'
path=OUT/f'豆包座舱语音闭环-图文课堂版-v{V:02d}.html'
with path.open('x') as f:f.write(page)
lecture=OUT/f'豆包座舱语音闭环-培训讲稿-v{V:02d}.md'
with lecture.open('x') as f:f.write('# 豆包座舱语音闭环：逐节点产品培训\n\n'+source+'\n\n## 名词表\n\n'+'\n\n'.join('### '+n+'\n'+d+'\n\n'+e for _,n,_,d,e in G))
with zipfile.ZipFile(OUT/f'豆包座舱语音闭环-教学流程图-v{V:02d}.zip','x',zipfile.ZIP_DEFLATED) as z:
 for k in lf.F:z.writestr(k+'.svg',lf.svg(k,True))
(R/f'course-script-v{V:02d}.js').write_text(lf.JS.replace('__FLOWS__',json.dumps(lf.F,ensure_ascii=False))+JS)
(R/f'course-content-v{V:02d}.md').write_text(source)
(R/'build-result.json').write_text(json.dumps(dict(version=V,path=str(path),lecture=str(lecture),flowcharts=len(lf.F),labs=len(LABS),terms=len(G),chapters=len(chapters),chars=len(re.sub(r'<[^>]+>','',source)),bytes=path.stat().st_size),ensure_ascii=False,indent=2))
print((R/'build-result.json').read_text())
