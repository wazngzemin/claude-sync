from pathlib import Path
import json,html,heapq
R=Path(__file__).parent
F={}
def flow(k,title,scope,nodes,edges,explain,source):F[k]=dict(title=title,scope=scope,nodes=[dict(id=i,c=c,r=r,title=t,sub=sub,kind=kind) for i,c,r,t,sub,kind in nodes],edges=[dict(a=a,b=b,label=l) for a,b,l in edges],explain=explain,source=source)
one='https://bytedance.larkoffice.com/wiki/GBcCw5c6xiWvGukPMQgcMiuKnEc'
plan='https://bytedance.larkoffice.com/wiki/EWziwFVftiGvnlk0FA4cadqonud'
flow('overview','一句“去昨天那家游泳馆”，完整经过哪些站','教学总览 · 本例走需要补信息的复杂请求',[
('say',0,0,'用户表达诉求','去昨天那家游泳馆','user'),('hear',1,0,'把声音听成文字','ASR识别；VAD判断句末','work'),('understand',2,0,'判断是否接话、怎么处理','有效请求进入对应能力','decision'),('plan',2,1,'先补地点，再决定动作','上下文 + Planner规划','work'),('do',1,1,'交给工具真正办事','查记忆；地点明确后导航','work'),('back',0,1,'带着真实结果继续判断','多个候选就问；失败就说明','decision'),('reply',0,2,'呈现结果并播放回复','界面 + TTS + 车端播放','result'),('next',1,2,'用户继续补充或插话','从新输入开始下一轮','user')],[('say','hear','声音'),('hear','understand','最终文字'),('understand','plan','需要补信息'),('plan','do','明确工具和参数'),('do','back','实际执行结果'),('back','plan','还需要判断'),('back','reply','有结果可沟通'),('reply','next','继续对话')],[('say','先记住用户的目标：找到昨天去的那家游泳馆并发起导航。她没有提供地址，因此系统不能一听到“导航”就随便选一个地点。'),('hear','听音阶段先把声音转成字，再确认这一段输入结束了。系统此时只是知道用户说了什么，目的地仍然可能不明确。'),('understand','接下来确认这句话是对豆包说的，再决定走哪条能力链路。本例要结合历史找地点，因此继续进入复杂规划。'),('plan','Planner先看上下文里有没有唯一地点；缺少时安排查询。规划的产物既包括要说的话，也包括真正交给下游的动作。'),('do','工具负责查询或操作，结果必须回来。发出导航指令与地图真正开始导航，是两个状态。'),('back','结果决定下一步：两个地点就澄清，唯一且已确认的地点才继续导航，失败则继续处理或说明。这个回环是把事情办成的关键。'),('reply','有了可沟通的结果，屏幕和语音分别呈现。TTS把文字变成声音，但只有车端播放器真正播放，用户才听见。'),('next','用户可以继续说“换个入口”。新话要结合刚才的结果理解；如果正在播报，还要处理停播与恢复。')],one)
flow('entry','在听见之前，先确认此刻能不能接话','车内入口 · 具体禁用条件与音区配置按车型',[
('gate',0,0,'现在允许交互吗','权限、通话、系统状态','decision'),('mic',1,0,'采集并处理声音','降噪、回声消除','work'),('zone',2,0,'确认说话音区','来自哪个座位、是否开启','decision'),('stop',0,1,'按原因提示或退出','不把所有限制都叫唤醒失败','end'),('mode',2,1,'按唤醒模式接入','普通唤醒／免唤醒','work'),('listen',1,1,'进入这一次听音处理','后面开始识别与句末判断','result')],[('gate','mic','允许'),('gate','stop','不允许'),('mic','zone','处理后人声'),('zone','mode','音区有效'),('mode','listen','满足入口规则')],[('gate','先判断当前系统能否接管交互。通话或权限限制可能使声音被检测到，却仍不允许拉起对话。'),('mic','允许进入后，麦克风会收到人声、音乐和路噪。降噪与回声消除减少这些干扰，尤其避免把车机自己播的声音当成用户。'),('zone','确认说话来自哪个位置，后续才知道“打开我的车窗”里的“我”指向哪个音区。关闭或无效音区的请求不能沿正常路径接入。'),('mode','普通唤醒与免唤醒有不同入口。免唤醒开启并不表示每句话都会交给云端执行，后面仍要判断是否在对豆包说。'),('listen','到这里，我们只完成了进入条件和收音准备。下一张图才回答“具体说了哪些字”和“这一句是否说完”。')],'https://bytedance.larkoffice.com/wiki/UIcgwzzo9iCQ2tkDz44cSjXXnBf')
flow('hearing','同一段声音，同时做“听成字”和“判断说完没”','主 OnePager · 300/600 ms从停顿计；不是回答总耗时',[
('audio',0,0,'用户仍在说话','去……昨天那家游泳馆','user'),('asr',1,0,'一遍识别持续出字','ASR：声音变成文字','work'),('partial',2,0,'过程文字会继续变化','还不能当作最终定稿','work'),('vad',0,1,'VAD观察人声与停顿','不是理解目的地的模块','decision'),('soft',1,1,'短停顿300 ms：先准备','Soft；不结束识别','work'),('pre',2,1,'拿当前文字做预请求','只做允许提前的计算','work'),('hard',0,2,'停顿600 ms：本段收尾','Hard；等待二遍结果','work'),('final',1,2,'二遍给出最终文字','用户不用重说一遍','work'),('formal',2,2,'按最终文字正式处理','与上一份准备核对后继续','result')],[('audio','asr','音频'),('asr','partial','边听边出字'),('audio','vad','同一段声音'),('vad','soft','较短停顿'),('soft','pre','触发准备'),('partial','pre','当前识别文字'),('vad','hard','达到本版判停'),('hard','final','分段后再识别'),('final','formal','最终文字')],[('audio','这两路处理的是同一段声音。用户还在说时，系统一边识别文字，一边观察人声和停顿，不是先做完一件才开始另一件。'),('asr','ASR负责把声音听成字。它先给过程结果，所以屏幕上的字可能随着后文到来而修正。'),('vad','VAD负责观察这一段是否还在说。停顿不一定意味着意思表达完整，语义延长属于另外需要对齐版本的策略。'),('soft','按主OnePager，停顿到300毫秒时可以先准备，但ASR继续听。用户补上“昨天那家游泳馆”，仍可更新当前识别文字。'),('pre','提前准备使用当时的过程文字，不应提前执行导航或车控。接下来的图会解释为什么正式请求还要再核对。'),('hard','同一段停顿达到该版600毫秒时，系统让本段识别收尾。这里不是在300毫秒之后再额外加600毫秒。'),('final','二遍利用这一整段声音形成最终文字。它到达和后续业务处理都还需要时间，不能说600毫秒时答案已经播出来。'),('formal','只有拿到最终文字，才按正式链路继续。前面的准备能否复用，还要看它是不是同一次输入、是不是同一份文字。')],one)
flow('precache','提前准备能省等待，为什么不能直接拿来执行','主 OnePager · 同次编号 + 前一轮文字完全一致',[
('pre',0,0,'Soft时先做准备','保存当时文字与前置结果','work'),('final',0,1,'Hard后二遍final到达','最终表达终于确定','work'),('match',1,1,'有可用的匹配准备吗','同次请求、前一轮、同文本','decision'),('reuse',2,0,'复用允许缓存的结果','少做一次重复计算','work'),('redo',2,2,'按最终文字重新判断','无准备或不匹配不能硬套','work'),('formal',2,1,'进入正式业务处理','到这里才继续安排动作','result')],[('pre','match','上一份准备'),('final','match','最终文字'),('match','reuse','符合复用条件'),('match','redo','没有可用匹配'),('reuse','formal','校验通过'),('redo','formal','取得有效结果')],[('pre','准备阶段可能拿到“播放音月”这样的临时文字。它的价值是提前计算，不是替用户提前拍板。'),('final','如果二遍把文字修正成“播放音乐”，用户最终说的对象就与那份准备不同了。'),('match','正式请求检查同次请求编号、前一轮文字是否完全相同，并使用可用的前置结果。不能仅凭“意思差不多”复用。'),('reuse','条件满足时，支持缓存的模块可以省掉重复计算。只有这条条件分支叫复用，不是每条请求必然命中。'),('redo','如果没有准备或文字不匹配，就按最终输入重新判断。这是在保护正确性，不一定是系统故障。'),('formal','无论从哪条分支汇合，正式业务都应以最终表达为准。省时不能以执行旧意图为代价。')],one)
flow('routing','听成字之后，先确认要不要接，再选谁来处理','业务分流示意 · 车型决定本地候选是否被采信',[
('query',0,0,'最终文字与交互状态','用户到底在和谁说话','user'),('valid',1,0,'是否是有效人机请求','拒识：听见但不该接话','decision'),('route',2,0,'按能力和版本选择路径','本地、规则快路、复杂规划','decision'),('silent',1,1,'不发起新的业务动作','与人聊天不应抢答','end'),('local',0,2,'本地能力或规则快路','命中且允许采信才执行','work'),('planner',2,2,'复杂需求交给Planner','缺背景、多步、需跟进结果','work'),('choose',1,2,'只采信本轮有效结果','端云候选不可重复执行','decision')],[('query','valid','结合场景'),('valid','silent','非请求'),('valid','route','有效请求'),('route','local','符合当前快路规则'),('route','planner','需要规划'),('local','choose','有效候选'),('planner','choose','有效候选')],[('query','相同一句话在不同状态下可能有不同含义。还要结合音区、是否已激活、前后文，不能只看孤立文字。'),('valid','拒识解决“要不要接话”。如果只是乘客之间聊天，豆包应该安静，不因此取消之前已经接受的有效任务。'),('route','确认是请求后，再决定“交给谁”。规则明确、能力命中的可以走快路；需要查历史地点的例子继续进入Planner。'),('local','本地能计算出结果，不代表每个车型都允许采纳它。通用历史白名单策略与赛力斯AIVA的等云策略需要分别讲。'),('planner','复杂需求不是简单看句子长短。本例只有一句话，但缺了目的地事实，所以需要补上下文并跟踪工具结果。'),('choose','仲裁最终要选定这一轮采用哪份结果，让执行、上屏和播报对齐，不能端云各自成功一次而让用户收到重复动作。')],'https://bytedance.larkoffice.com/wiki/DZzYwDOiviwAqHkeVx1cSFKinnh')
flow('context','“昨天那家”从哪里来：先找事实，再让模型判断','Context是本轮所需背景；查不到不能编',[
('request',0,0,'用户只给了相对说法','昨天那家游泳馆','user'),('known',1,0,'汇集当前已知信息','历史、车况、位置、情景','work'),('enough',2,0,'是否已有唯一可靠地点','能定位不等于凭印象猜','decision'),('memory',1,1,'按缺口查询用户记忆','只查本次需要的事实','work'),('found',2,1,'得到唯一或多个候选','仍需判断是否明确','decision'),('ask',2,2,'没有／不唯一就澄清','请用户补名称或选地点','user'),('sync',0,1,'本地已发生的经历','问题、回复、执行结果','work'),('cloud',0,2,'同步给云端后续使用','同步失败不代表已知','work')],[('request','known','理解当前缺口'),('known','enough','检查已有依据'),('enough','memory','信息不足'),('memory','found','真实查询结果'),('found','ask','没有或不唯一'),('sync','cloud','上报实际经历'),('cloud','known','作为后续背景')],[('request','“昨天那家”省略了名称和地址。用户这样说很自然，但系统必须从已有背景或工具里找到事实，不能靠语言流畅补一个地点。'),('known','Context把本轮用得上的背景组织起来。对话历史、现在的车况、之前去过的地点，各有自己的来源和时效。'),('enough','如果当前已有唯一且可靠的地点，就不必重复查询。如果仍不明确，Planner需要主动补信息。'),('memory','查询返回的是查到了什么，不保证一定有答案。有多个地点或没有结果，都不能直接当作唯一目的地。'),('ask','这时澄清是业务流程的一部分。用户补充之后，新信息再进入下一轮判断，才能决定导航动作。'),('sync','还有一种缺信息发生在端云之间：车端已经处理过上一句，但云端没收到那段经历。'),('cloud','因此同步和查询是两个方向：同步告诉云端刚发生了什么，查询为当前任务取背景。已读材料没有证明同步失败都有可靠重试。')],'https://bytedance.larkoffice.com/wiki/OjGMwBX8fiLS0ikDWqVceVjhnPg')
flow('planner','Planner怎么把一句诉求办完：思考、行动、观察、再思考','教学案例 · 不是每次都固定查同一批工具',[
('think',0,0,'思考：目的地还不明确','先决定缺什么信息','work'),('lookup',1,0,'行动：查询相关记忆','action_list下发查询','work'),('observe',2,0,'观察：工具返回真实结果','tool_feedback回传候选','work'),('judge',2,1,'再思考：足够继续吗','唯一？多个？没有？','decision'),('clarify',1,1,'不明确：向用户澄清','得到补充后继续判断','user'),('navigate',2,2,'明确后：交给导航工具','地址来自已确认信息','work'),('result',1,2,'观察导航执行结果','成功、失败都要回传','work'),('done',0,2,'确认完成或继续处理','不能只凭“好的”算完成','result')],[('think','lookup','需要查记忆'),('lookup','observe','执行查询'),('observe','judge','带结果回来'),('judge','clarify','多个或没有'),('clarify','think','用户补充'),('judge','navigate','地点已明确'),('navigate','result','实际执行'),('result','done','按结果收口')],[('think','第一轮Planner看到地点缺口，因此先查询，不急着导航。它在决定下一步，不直接控制地图。'),('lookup','动作列表把工具名和参数交给下游。这里发的是查询请求，不是已经知道目的地，更不是已经开始导航。'),('observe','工具把结果作为tool_feedback带回。这个反馈可能是一家、两家，或者没有找到；不同结果会改变计划。'),('judge','第二轮Planner重新判断。规划不是把第一轮计划机械做到底，而是根据观察到的新事实调整。'),('clarify','如果有两家，就把选择权交回用户。等待澄清时任务仍未完成，但这是正确推进的一种状态。'),('navigate','地点明确后，才把导航动作交给下游。参数必须来自真实查询或用户确认，不能由模型补一个地址。'),('result','导航工具回传是否真正启动、是否失败。收到调用请求只说明有人接单，不能替代执行结果。'),('done','成功就向用户确认并展示路线；失败就解释或继续处理。允许直接返回的工具可按规则收口，本图演示需要多轮判断的情况。')],plan)
flow('outputs','同一轮结果分成三路：给人看、给人听、给系统继续判断','展示内容、播报内容、模型反馈的职责不同',[
('tool',0,1,'下游返回实际结果','例如两个游泳馆候选','work'),('screen',1,0,'给界面展示的内容','地点卡片、状态、可操作项','work'),('speak',1,1,'给语音表达的内容','组织成用户听得懂的话','work'),('model',1,2,'给Planner继续判断的信息','候选数据、状态、错误原因','work'),('see',2,0,'用户看见并能选择','卡片出现不等于导航启动','result'),('hear',2,1,'后续经语音生成与播放','有文字不等于已听见','result'),('next',2,2,'下一轮规划或按规则收口','结果结束不等于动作成功','result')],[('tool','screen','展示分支'),('tool','speak','播报分支'),('tool','model','判断分支'),('screen','see','渲染界面'),('speak','hear','组织回复'),('model','next','结果驱动')],[('tool','工具完成一次查询后，返回的数据有不同用途。不能把一段接口JSON直接当成用户该听见的话。'),('screen','界面可以展示两个地点，让用户比较或选择。卡片展示成功，只说明呈现这一关成功。'),('speak','语音需要组织成适合听的句子，例如“找到两家，你说的是哪一家”。具体由谁生成，仍取决于接入协议与路由。'),('model','Planner需要更完整的结构化事实来决定下一步。展示给用户的短文案，未必足够支持后续判断。'),('next','三路最终要对齐同一份结果：屏幕第一项、播报第一项以及Planner理解的候选，不能各说各的。')],'https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d')
flow('tts','从回复文字到用户听见，中间还要过这些站','TTS负责合成；车端播放器负责真正播放',[
('text',0,0,'确定回复内容与表达方式','普通回复、情感表达或唱歌','work'),('audio',1,0,'相应能力生成音频','普通文本可走TTS','work'),('queue',2,0,'按本轮采信来源取音频','不是哪个来源先到就播谁','decision'),('fetch',2,1,'车端按标识拉取音频','收到分片仍不等于播放','work'),('play',1,1,'播放器真实播放','用户此刻才听到','result'),('axis',0,1,'记录实际播到哪里','打轴：文字与播放进度对应','work'),('end',0,2,'分清发完与播完','网络结束不能冒充听完','decision')],[('text','audio','适合说出的内容'),('audio','queue','音频及来源'),('queue','fetch','采信后拉流'),('fetch','play','可播放的音频'),('play','axis','实际播放进度'),('axis','end','持续记录状态')],[('text','先决定说什么，再决定怎么说。情感化TTS、唱歌、S2S是不同能力或路由，不能把它们合成一个没有边界的名词。'),('audio','TTS把文字变成音频。生成成功说明声音已产出，不说明车端已经拿到，更不说明用户听过。'),('queue','多条来源可能产生候选声音，要按本轮采信结果读取对应队列，避免把不该采用的答案播出来。'),('fetch','车端收到音频标识后拉取分片。此时还可能排队、缓冲或被停止，因此不能把拉取成功算作播放成功。'),('play','直到播放器把音频真正送出去，用户才听见。排查“没有声音”时，要沿合成、采信、传输、播放逐站定位。'),('axis','打轴把文字对应到声音的进度。插话之后，系统才知道哪部分讲过、哪部分还没讲。'),('end','云端发完音频与车端播完不是同一个事件。新输入管理拟改造进一步要求用真实播放状态控制下一段输出，不能拿最后一个网络包替代。')],one)
flow('interrupt','用户插话后，先决定停，再决定旧话如何收尾','主 OnePager恢复分支 · AIVA车型差异见讲稿',[
('playing',0,0,'豆包正在播放回复','用户开始插话','user'),('stop',1,0,'满足对应条件先停播','流式判断；记录打断原因','work'),('progress',2,0,'保留已播和未播信息','打轴提供进度依据','work'),('allowed',2,1,'本次原因允许恢复吗','不能把所有打断都当可恢复','decision'),('no',1,1,'不恢复旧播报','例如该表单人直接打断','end'),('valid',2,2,'再看新话最终判断','前提是该原因允许恢复','decision'),('event',1,2,'最终拒识：事件衔接','带着未播信息接回旧内容','work'),('new',0,2,'有效新需求：重新组织','Planner考虑新需求与旧信息','work')],[('playing','stop','符合停播条件'),('stop','progress','保存现场'),('progress','allowed','先查原因表'),('allowed','no','不允许'),('allowed','valid','允许且有未播'),('valid','event','最终拒识'),('valid','new','有效请求')],[('playing','用户开口时还不知道是不是新的有效请求。如果只是乘客聊天，系统不应把它当成新的业务任务。'),('stop','流式判断可以先处理停播，让用户有机会说话。但停了声音不代表撤销了车控，也不代表最终一定接受这句请求。'),('progress','先把停止的位置记下来，否则后面无法判断哪些内容需要衔接、哪些已经讲过。'),('allowed','先看原因是否允许恢复。主OnePager把单人ASR超过两字直接打断列为不恢复，所以不能画成“最后拒识就一律续播”。'),('valid','只有通过原因门槛，再看新话最终是否有效。这里把停播时机与最终业务判断分成了两步。'),('event','如果最终被拒识，按该版规则通过事件携带已播、未播信息衔接，不要与旧版直接续播原音频混为一谈。'),('new','如果是有效的新需求，Planner按新需求重新组织回复，并参考旧的未播信息，不保证每句旧话都必须讲完。')],one)
flow('cancellation','“算了，别开”到来时，先查旧动作发出去没有','输入管理拟改造原则 · 不是已上线能力承诺',[
('new',0,0,'用户补充或反悔','旧一轮可能还没出声音','user'),('issued',1,0,'旧工具命令已经放行吗','不能只看有没有首字','decision'),('before',2,0,'还没放行：可合并重算','按新要求重新决定动作','work'),('after',1,1,'已放行：旧请求不重放','作为已发生的背景保存','work'),('feedback',2,1,'已接单工具仍回真实结果','成功、失败或部分完成','work'),('judge',2,2,'按新要求和结果再判断','不默认自动撤销旧动作','decision'),('sound',0,1,'声音与执行分别处理','停播不等于车窗已停或复原','end')],[('new','issued','检查真实阶段'),('issued','before','尚未放行'),('issued','after','已经放行'),('after','feedback','不能抹掉已发动作'),('feedback','judge','结合新要求'),('new','sound','分别记录状态')],[('new','用户说“算了，别开”时，也许还没听到豆包说一个字。但模型可能已经把开窗命令发给工具，因此不能用是否出声判断有没有执行。'),('issued','拟改造方案用工具是否已放行区分能否重放旧输入。这个条件比“是不是输出首字”更能防止重复动作。'),('before','旧动作尚未放行时，可以结合补充内容重新理解。本例按“别开”的最新要求决定后续动作。'),('after','旧命令已经放行时，旧请求只能作为中断背景，不能再当一条待执行指令重跑，否则可能重复操作。'),('feedback','已经接单的工具仍要返回真实结果。只有知道做到了哪一步，系统才能决定新要求接下来怎么处理。'),('judge','方案不保证自动回滚已经发生的动作。是否需要反向操作、业务是否支持，还要根据实际能力与新的判断处理。')],'https://bytedance.larkoffice.com/wiki/UsHgwkm2Sig3blkAttBclYb0n4g')
flow('outside','车外入口：先看能否启用，再看身份与指令','施工中历史原图复述 · 尚未补齐正文四项必要条件',[
('gate',0,0,'已解锁 或 数字钥匙近场','旧图数字钥匙3米内','decision'),('audio',1,0,'开始采音与声学处理','车外噪声与覆盖另验','work'),('voice',2,0,'按开关校验声纹','开启仅声纹唤醒时','decision'),('off',0,1,'不启用该入口','未满足图示门槛','end'),('fail',2,1,'校验失败：提示原因','声纹不匹配，按图提示注册','end'),('lock',2,2,'连续失败进入暂锁','3分钟10次，锁5分钟并告警','end'),('command',1,2,'成功唤醒后接指令','车控或查询，再下发反馈','result')],[('gate','audio','满足图示条件'),('gate','off','不满足'),('audio','voice','开启仅声纹唤醒'),('voice','fail','失败'),('fail','lock','达到旧图阈值'),('voice','command','成功')],[('gate','这张图对应车外施工中旧稿。数字钥匙近场3米是启用门槛，不能拿来保证人在3米外说话的识别效果。'),('audio','声学处理和硬件覆盖仍影响声音能否被听清。车内免唤醒的规则不能直接复制给车外。'),('voice','声纹回答是不是登记用户，ASR回答说了什么字。未开启声纹时的跳过路径，原图没有完整展开，所以这里不补猜。'),('fail','失败之后要让用户知道是身份校验没过，而不只说识别失败。旧图还单独规定连续失败的处理。'),('lock','达到旧图的次数和时间条件，会锁定功能并告警。这些数值是该历史图的方案，不能当当前所有车型配置。'),('command','成功之后才继续接车控或问答请求。原图没有展开完整执行反馈，仍须确认“下发”后是否真的做成。')],'https://bytedance.larkoffice.com/wiki/Wc2PwD8Pei0MZGkav4ecn4Jankh')
flow('proactive','用户没说话时，主动服务从哪里进入同一个闭环','架构关系示意 · 具体触发与建议调度按当前项目',[
('state',0,0,'车辆状态或场景发生变化','信号、时间、位置、情景','work'),('event',1,0,'条件或事件满足','触发器检查条件','decision'),('advice',2,0,'带着事件或建议进入规划','Advisor可提供建议','work'),('plan',2,1,'Planner决定是否处理','结合当前对话与实际状态','decision'),('do',1,1,'安排执行或反馈用户','按业务需要确认与呈现','work'),('back',0,1,'结果回来更新状态','注册成功不等于提醒已播','result')],[('state','event','实际变化'),('event','advice','条件成立'),('advice','plan','供判断的输入'),('plan','do','选择合适行动'),('do','back','真实执行反馈')],[('state','用户语音只是输入的一种。时间到了、位置变化或某个车辆状态满足，也可能带来一次需要处理的事件。'),('event','触发器负责检查已定义条件是否成立。条件成立不是替用户作完整决策，还要看这个事件后面接的是哪条业务链路。'),('advice','Advisor是提供建议的一方，可以围绕舒适、出行等目标给Planner输入。不是所有事件都必须先经过全部Advisor。'),('plan','Planner仍要结合正在发生的对话、任务和车况判断要不要处理、怎么处理。进入判断不等于必然执行。'),('do','需要执行时交给相应能力；需要告知时才安排相应呈现。具体授权和确认规则要按该项业务。'),('back','条件注册成功、条件发生、提醒实际播放，是三个完成点。结果必须回到状态里，后续才能知道这件事做到了哪一步。')],'https://bytedance.larkoffice.com/docx/XM8GdtFsTok8CwxcMrKcywMmnQg')
flow('triage','遇到“没反应”，沿同一条请求找到第一次偏离','培训排查方法 · 不凭现象直接判模型问题',[
('audio',0,0,'原音频完整吗','采音／音区／句末边界','decision'),('words',1,0,'最终文字正确吗','ASR／热词／二遍结果','decision'),('route',2,0,'有效判断和分流正确吗','拒识／端云采信／快路','decision'),('context',2,1,'这轮拿到了必要事实吗','历史／记忆／车辆状态','decision'),('action',1,1,'动作与参数正确吗','Planner输出及工具输入','decision'),('result',0,1,'执行和反馈一致吗','实际动作／回传／界面','decision'),('voice',0,2,'音频是否最终被播放','生成／采信／传输／播放器','decision')],[('audio','words','完整再往下查'),('words','route','文字正确'),('route','context','路径正确'),('context','action','必要信息齐'),('action','result','指令明确'),('result','voice','结果已到达')],[('audio','先看原音频里有没有用户的完整表达。如果从采音时就少了后半句，不能要求后面的Planner凭空恢复。'),('words','音频完整但最终文字错，先定位识别；如果只有过程字错、final已修正，就要确认正式业务究竟用了哪一版文字。'),('route','文字正确但系统不该接却接了，查拒识；端云重复执行或旧结果上屏，则继续查轮次关联和采信。'),('context','分流正确后，看本次上下文有没有昨天的地点。没有提供与提供了但没用，是不同问题。'),('action','事实足够，再检查Planner下发了哪个工具、参数是否来自可靠依据。不要只看它说了一句顺口的话。'),('result','工具接单、真实执行、结果回传、界面刷新要分别核对。“已发送”不能证明车真的做了。'),('voice','最后检查回复有没有合成音频、有没有被采信、车端有没有真实播放。耗时要放在同一时间轴上看，不能重复相加并行阶段。')],'https://bytedance.larkoffice.com/wiki/WwpFwoUNLikhxmkIhKwciSCEnYy')

F['context']['nodes'].append(dict(id='ready',c=1,r=3,title='明确地点交给下一步规划',sub='已有唯一事实就不重复查询',kind='result'))
F['context']['edges'] += [dict(a='enough',b='ready',label='已有唯一地点'),dict(a='found',b='ready',label='查询后已明确')]

# Separate end/cloud selection from the cloud's fast-path/planning split.
flow('routing','先分清采用端还是云，再看云内需不需要复杂规划','业务判断关系图 · 不代表端云串行等待；候选可以并行准备',[
('query',0,0,'最终文字与交互状态','说了什么、是否对豆包说','user'),('valid',1,0,'是否是有效人机请求','拒识结合状态判断有效性','decision'),('route',2,0,'按项目决定端云采信','白名单、云端结果与兜底规则','decision'),('silent',1,1,'不发起新的业务动作','与人聊天不应抢答','end'),('cloud',2,1,'采用云端路径时再分流','云端也有规则快路','decision'),('local',0,2,'采用本地结果办理','本地命中且允许采信','work'),('fast',1,2,'云端快路处理明确请求','不必每句都进Planner','work'),('planner',2,2,'复杂需求进入Planner','缺背景、多步或需跟进','work'),('result',1,3,'完成动作后回传实际结果','同一请求不重复执行','result')],[('query','valid','结合场景'),('valid','silent','非请求'),('valid','route','有效请求'),('route','local','按项目采用本地'),('route','cloud','按项目采用云端'),('cloud','fast','符合规则快路'),('cloud','planner','需要复杂规划'),('local','result','本地执行反馈'),('fast','result','快路执行反馈'),('planner','result','规划与工具反馈')],[('query','先带上最终文字和交互状态，判断用户是否在向豆包提需求。这里只画业务关系，不要求端云的前置处理串行发生。'),('valid','拒识解决要不要接这句话。被判为乘客聊天时，不发起新业务，也不因此取消之前已经接受的任务。'),('route','端云采信解决采用哪边的结果。车型白名单、是否取得云端结果与超时兜底都会影响它；本地候选不因先产生就一定先执行。'),('local','采用本地结果且能力允许时，车端办理对应动作，并把实际经历同步给后续对话。'),('cloud','采用云端路径也不等于一定进入Planner。云端内部还会根据规则命中、信息缺口和需求复杂程度分流。'),('fast','明确且命中规则的云端请求可走快路。因此不能把本地等同快路、把云端等同复杂规划。'),('planner','昨天那家游泳馆缺少明确地点，需要背景和查询，这个教学例子继续进入Planner。'),('result','不同路径都要以实际反馈确认结果，并按本轮采信规则避免重复执行。具体车型的白名单与超时规则在正文展开区。')],one)
for n in F['context']['nodes']:
 if n['id']=='ask':n['sub']='用户补充后回到上方判断'
F['context']['explain'].append(('ready','已有或查到的唯一可靠地点，交给后续规划。无需重复查询，但导航动作仍需调用工具并等真实结果。'))
for n in F['interrupt']['nodes']:
 if n['id']=='allowed':n.update(title='还有未播且允许恢复吗',sub='先看实际进度与停止原因')
 if n['id']=='no':n.update(c=0,sub='有效新请求仍然正常处理')
 if n['id']=='new':n.update(sub='按有效新诉求继续判断')
for e in F['interrupt']['edges']:
 if e['b']=='no':e['label']='已播完或不允许恢复'
F['interrupt']['edges'].append(dict(a='no',b='new',label='新话有效仍办理'))
F['interrupt']['explain']=[(i,('恢复资格只决定怎样处理旧的未播内容。无论旧话能否恢复，有效的新请求都应按正常业务继续办理。' if i=='valid' else t)) for i,t in F['interrupt']['explain']]
F['interrupt']['explain'].insert(4,('no','如果旧话已播完，或停止原因不允许恢复，就不自动拉回旧播报。这不妨碍新的有效请求进入正常处理。'))
F['proactive']['edges'].append(dict(a='back',b='plan',label='需继续判断'))
F['cancellation']['title']='“等等，先别去了”到来时，先查旧动作发出去没有'
F['cancellation']['explain']=[(i,t.replace('“别开”','“先别去了”').replace('开窗命令','导航命令')) for i,t in F['cancellation']['explain']]

W,H=240,92
COLORS={'user':('#eaf1ff','#627fae'),'work':('#ffffff','#86ada7'),'decision':('#fff5dc','#bb8932'),'result':('#e4f4eb','#36835f'),'end':('#fcece6','#bb7560')}
def geometry(f):
 for n in f['nodes']:n.update(x=40+n['c']*330,y=38+n['r']*176)
 ns={n['id']:n for n in f['nodes']};rects=[(n['x']-8,n['y']-8,n['x']+W+8,n['y']+H+8) for n in f['nodes']]
 def clear(p,q):
  return not any((p[0]==q[0] and l<p[0]<r and max(min(p[1],q[1]),t)<min(max(p[1],q[1]),b)) or (p[1]==q[1] and t<p[1]<b and max(min(p[0],q[0]),l)<min(max(p[0],q[0]),r)) for l,t,r,b in rects)
 for e in f['edges']:
  a,b=ns[e['a']],ns[e['b']]
  if a['c']==b['c']:
   direction=1 if b['y']>a['y'] else -1
   start=(a['x']+W/2,a['y']+(H if direction>0 else 0));end=(b['x']+W/2,b['y']+(0 if direction>0 else H));p=(start[0],start[1]+direction*20);q=(end[0],end[1]-direction*20)
  else:
   direction=1 if b['x']>a['x'] else -1
   start=(a['x']+(W if direction>0 else 0),a['y']+H/2);end=(b['x']+(0 if direction>0 else W),b['y']+H/2);p=(start[0]+direction*20,start[1]);q=(end[0]-direction*20,end[1])
  xs=sorted(set([12,968,p[0],q[0]]+[v for n in f['nodes'] for v in (n['x']-20,n['x']+W+20)]));ys=sorted(set([14,p[1],q[1]]+[v for n in f['nodes'] for v in (n['y']-20,n['y']+H+20)]))
  src=(xs.index(p[0]),ys.index(p[1]));dst=(xs.index(q[0]),ys.index(q[1]));todo=[(0,src)];cost={src:0};prev={}
  while todo:
   score,u=heapq.heappop(todo)
   if u==dst:break
   if score!=cost[u]:continue
   for dx,dy in [(1,0),(-1,0),(0,1),(0,-1)]:
    v=(u[0]+dx,u[1]+dy)
    if not(0<=v[0]<len(xs) and 0<=v[1]<len(ys)):continue
    pp=(xs[u[0]],ys[u[1]]);qq=(xs[v[0]],ys[v[1]])
    if not clear(pp,qq):continue
    new=score+abs(pp[0]-qq[0])+abs(pp[1]-qq[1])+3
    if new<cost.get(v,1e12):cost[v]=new;prev[v]=u;heapq.heappush(todo,(new,v))
  if dst not in cost:raise ValueError(e)
  u=dst;pts=[q]
  while u!=src:u=prev[u];pts.append((xs[u[0]],ys[u[1]]))
  pts=list(reversed(pts));pts=[start]+pts+[end];out=[]
  for pt in pts:
   if out and pt==out[-1]:continue
   while len(out)>1 and (out[-2][0]==out[-1][0]==pt[0] or out[-2][1]==out[-1][1]==pt[1]):out.pop()
   out.append(pt)
  
  if f is F['planner'] and e['a']=='clarify' and e['b']=='think':out=[(370,260),(320,260),(320,172),(160,172),(160,130)]
  if f is F['context'] and e['a']=='enough' and e['b']=='memory':out=[(820,130),(820,172),(490,172),(490,214)]
  if f is F['routing'] and e['a']=='route' and e['b']=='local':out=[(820,130),(820,172),(642,172),(642,348),(160,348),(160,390)]
  if f is F['overview'] and e['a']=='back' and e['b']=='plan':out=[(160,214),(160,172),(820,172),(820,214)]
  if f is F['proactive'] and e['a']=='back' and e['b']=='plan':out=[(160,214),(160,172),(820,172),(820,214)]
  if f is F['context'] and e['a']=='enough' and e['b']=='ready':out=[(940,84),(958,84),(958,612),(610,612)]
  if f is F['context'] and e['a']=='found' and e['b']=='ready':out=[(760,306),(760,336),(650,336),(650,612),(610,612)]
  if f is F['outside'] and e['a']=='voice' and e['b']=='command':out=[(760,130),(760,168),(650,168),(650,436),(610,436)]
  if f is F['interrupt'] and e['a']=='valid' and e['b']=='new':out=[(820,482),(820,504),(160,504),(160,482)]
  e['points']=out;e['d']='M'+' L'.join(f'{x},{y}' for x,y in out)
  # Put condition labels in open space between cards.
  pairs=list(zip(out,out[1:]));aa,bb=max(pairs,key=lambda pair:abs(pair[0][0]-pair[1][0])+abs(pair[0][1]-pair[1][1]))
  e['lx']=(aa[0]+bb[0])/2+(9 if aa[0]==bb[0] else 0);e['ly']=(aa[1]+bb[1])/2+(-9 if aa[1]==bb[1] else 4);e['anchor']='start' if aa[0]==bb[0] else 'middle'
  if f is F['context'] and e['b']=='ready':
   e['lx'],e['ly'],e['anchor']=(935,560,'end') if e['a']=='enough' else (637,530,'end')
  if f is F['outside'] and e['a']=='voice' and e['b']=='command':e['lx'],e['ly'],e['anchor']=638,355,'end'
 return ns

def svg(k,standalone=False):
 f=F[k];geometry(f);height=max(n['y'] for n in f['nodes'])+H+35
 head=78 if standalone else 0
 parts=[f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 980 {height+head}" width="980" height="{height+head}" role="img" aria-label="{html.escape(f["title"])}" class="teaching-svg"><style>text{{font-family:"PingFang SC","Microsoft YaHei",sans-serif}}</style><rect width="980" height="{height+head}" rx="14" fill="#f5f8f6"/><defs><marker id="f-arrow-{k}" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#5c8d84"/></marker></defs>']
 if standalone:parts += [f'<text x="30" y="32" font-size="22" font-weight="700" fill="#183c36">{html.escape(f["title"])}</text><text x="30" y="58" font-size="13" fill="#5f7169">{html.escape(f["scope"])}</text>']
 parts.append(f'<g transform="translate(0,{head})">')
 for e in f['edges']:parts.append(f'<path class="flow-edge" data-from="{e["a"]}" data-to="{e["b"]}" d="{e["d"]}" fill="none" stroke="#6c958b" stroke-width="2" marker-end="url(#f-arrow-{k})"/>')
 for e in f['edges']:parts.append(f'<text x="{e["lx"]}" y="{e["ly"]}" text-anchor="{e["anchor"]}" font-size="12" fill="#526c62" paint-order="stroke" stroke="#f5f8f6" stroke-width="6" stroke-linejoin="round">{html.escape(e["label"])}</text>')
 for n in f['nodes']:
  fill,stroke=COLORS[n['kind']];x,y=n['x'],n['y'];cat={'user':'用户','work':'处理','decision':'判断','result':'结果','end':'分支'}[n['kind']]
  parts.append(f'<g class="flow-point" data-point="{n["id"]}" role="button" tabindex="0" aria-label="{html.escape(n["title"])}"><rect x="{x}" y="{y}" width="{W}" height="{H}" rx="13" fill="{fill}" stroke="{stroke}" stroke-width="1.5"/><text x="{x+14}" y="{y+21}" font-size="11" fill="{stroke}">{cat}</text><text x="{x+14}" y="{y+47}" font-weight="700" font-size="16" fill="#203f35">{html.escape(n["title"])}</text><text x="{x+14}" y="{y+72}" font-size="12" fill="#587266">{html.escape(n["sub"])}</text></g>')
 parts.append('</g></svg>');return ''.join(parts)

def render(k):
 f=F[k]
 return f'''<figure class="teaching-flow" id="flow-{k}" data-flow="{k}"><figcaption><span class="diagram-tag">跟着箭头读</span><h3>{html.escape(f['title'])}</h3><p>{html.escape(f['scope'])}</p></figcaption><div class="flow-scroll">{svg(k)}</div><div class="flow-toolbar"><button type="button" data-flow-prev>← 上一步</button><button type="button" data-flow-next>下一步 →</button><button type="button" data-flow-all>看全图</button><span class="flow-count"></span></div><div class="flow-narration" aria-live="polite"><b>{html.escape(f['nodes'][0]['title'])}</b><p>{html.escape(f['explain'][0][1])}</p></div><a class="flow-source" href="{f['source']}" target="_blank" rel="noopener">查看这张图的依据 ↗</a></figure>'''

CSS='''
.teaching-flow{margin:36px -12px;padding:24px;border:1px solid #c4d8cc;border-radius:20px;background:#f5f8f6;box-shadow:0 8px 24px #173c2710}.teaching-flow figcaption h3{margin:9px 0;font-size:23px;line-height:1.5}.teaching-flow figcaption p{font-size:14px;color:#5a7063;margin:0 0 18px}.diagram-tag{font-size:12px;letter-spacing:.1em;color:#3b715d}.flow-scroll{overflow:auto}.teaching-svg{display:block;width:100%;min-width:790px;height:auto}.flow-point{cursor:pointer;outline:none}.flow-point rect{transition:stroke-width .18s,filter .18s}.flow-point.active rect,.flow-point:focus rect{stroke:#08704f;stroke-width:4;filter:drop-shadow(0 3px 6px #286b4f33)}.flow-edge.active{stroke:#08704f;stroke-width:4;stroke-dasharray:9 5;animation:flow-run 1.4s linear infinite}.flow-toolbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding-top:17px}.flow-count{font-size:14px;color:#5a7063}.flow-narration{background:white;border-left:4px solid #328267;padding:18px 24px;margin:16px 0 7px;border-radius:0 12px 12px 0;min-height:140px}.flow-narration b{display:block;font-size:18px}.flow-narration p{margin:9px 0 0!important;font-size:17px;line-height:1.95}.flow-source{font-size:13px}.reading article>p,.reading article>h3,.reading article>h4,.reading article>ul,.reading article>ol{max-width:880px;margin-left:auto;margin-right:auto}.reading article>p{margin-top:20px;margin-bottom:20px;line-height:2.05}.reading article>h2{margin-top:70px;padding-top:36px;border-top:2px solid #d5e3da}.reading article>details{margin:30px 0;background:#f7faf9;padding:20px 24px;border:1px solid #d8e3de;border-radius:14px}.reading article>details summary{font-size:17px;font-weight:600;cursor:pointer}.reading article>details p{line-height:1.95}.chapter-pause{background:#eaf3ee;border-radius:14px;padding:20px 25px;margin:30px 0}.toc{display:grid;grid-template-columns:repeat(2,1fr);gap:7px}.toc a{padding:10px 14px;background:#f2f7f3;border-radius:10px;font-size:15px;text-decoration:none}.backlink{display:block;text-align:right;font-size:14px;margin-top:28px}.diagram-note{font-size:14px;color:#6b7c71}.hero h1{max-width:900px}.section.reading{padding:38px 48px}.course-tag{font-size:13px;letter-spacing:.08em;color:#49785e}@keyframes flow-run{to{stroke-dashoffset:-28}}@media(prefers-reduced-motion:reduce){.flow-edge.active{animation:none}}@media(max-width:720px){.section.reading{padding:25px 20px}.teaching-flow{padding:15px;margin:28px -9px}.toc{grid-template-columns:1fr}.flow-narration{padding:15px}}
'''
JS='''
const teachingFlows=__FLOWS__;
for(const root of document.querySelectorAll('[data-flow]')){
 const spec=teachingFlows[root.dataset.flow];let step=0;
 const titles=Object.fromEntries(spec.nodes.map(n=>[n.id,n.title]));
 function show(i){step=Math.max(0,Math.min(i,spec.explain.length-1));const [id,narration]=spec.explain[step];root.querySelectorAll('.flow-point').forEach(n=>n.classList.toggle('active',n.dataset.point===id));root.querySelectorAll('.flow-edge').forEach(e=>e.classList.toggle('active',e.dataset.from===id));root.querySelector('.flow-narration b').textContent=titles[id];root.querySelector('.flow-narration p').textContent=narration;root.querySelector('.flow-count').textContent=`讲解 ${step+1} / ${spec.explain.length}`;root.querySelector('[data-flow-prev]').disabled=step===0;root.querySelector('[data-flow-next]').disabled=step===spec.explain.length-1;}
 root.querySelector('[data-flow-prev]').onclick=()=>show(step-1);root.querySelector('[data-flow-next]').onclick=()=>show(step+1);root.querySelector('[data-flow-all]').onclick=()=>{root.querySelectorAll('.active').forEach(n=>n.classList.remove('active'));root.querySelector('.flow-narration b').textContent='沿着带条件的箭头，先分清每一条出口';root.querySelector('.flow-narration p').textContent=spec.scope+'。点选节点，或用“上一步／下一步”查看这一站为什么流向下一站。';};
 for(const el of root.querySelectorAll('.flow-point')){const select=()=>{const i=spec.explain.findIndex(x=>x[0]===el.dataset.point);if(i>=0)show(i);else{root.querySelectorAll('.active').forEach(n=>n.classList.remove('active'));el.classList.add('active');root.querySelector('.flow-narration b').textContent=titles[el.dataset.point];root.querySelector('.flow-narration p').textContent=spec.nodes.find(n=>n.id===el.dataset.point).sub+'。请结合进入本节点的条件与上下文阅读。';}};el.addEventListener('click',select);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select();}});}
 show(0);
}
'''
if __name__=='__main__':
 out=R/'教学流程图-v06';out.mkdir(exist_ok=True)
 for k in F:(out/(k+'.svg')).write_text(svg(k,True))
 (R/'教学流程图数据-v06.json').write_text(json.dumps(F,ensure_ascii=False,indent=2))
 print(len(F),'diagrams')
