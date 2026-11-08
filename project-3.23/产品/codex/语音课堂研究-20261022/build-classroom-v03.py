#!/usr/bin/env python3
"""Build an offline classroom. Never overwrite a published HTML version."""
from pathlib import Path
import json, re, base64, mimetypes, html, argparse, heapq
from markdown_it import MarkdownIt

ROOT=Path(__file__).parent
OUT=ROOT.parent/'HTML'/'01-进行中'
SOURCES={
'one':['语音基础体验 OnePager','https://bytedance.larkoffice.com/wiki/GBcCw5c6xiWvGukPMQgcMiuKnEc'],
'inside':['车内语音 PRD','https://bytedance.larkoffice.com/wiki/UIcgwzzo9iCQ2tkDz44cSjXXnBf'],
'immune':['多音区全时免唤醒 PRD','https://bytedance.larkoffice.com/docx/KSWtdjsmwoJ1TzxcIv4c57vinle'],
'multi':['多人同时交互 PRD','https://bytedance.larkoffice.com/wiki/U4xLwmQNki1Pu5kpyAGcHWtmngf'],
'offline':['离在线仲裁 PRD','https://bytedance.larkoffice.com/wiki/DZzYwDOiviwAqHkeVx1cSFKinnh'],
'gate':['上汽语音禁止交互 PRD','https://bytedance.larkoffice.com/wiki/AKJdwrR6LixFCQkJLNEcqTGdn0d'],
'vad':['多级 VAD PRD（旧版待评审）','https://bytedance.larkoffice.com/wiki/FzViwCNb2iF43QkB5eDcD3D2nJh'],
'plan':['AIDV Planner OnePage','https://bytedance.larkoffice.com/wiki/EWziwFVftiGvnlk0FA4cadqonud'],
'context':['Context OnePage','https://bytedance.larkoffice.com/wiki/OjGMwBX8fiLS0ikDWqVceVjhnPg'],
'outside':['车外语音 PRD（施工中）','https://bytedance.larkoffice.com/wiki/Wc2PwD8Pei0MZGkav4ecn4Jankh']}
N=[]
def node(id,c,y,title,short,why,inp,out,example,bad,src='one'):
 N.append(dict(id=id,x=42+c*440,y=y,title=title,short=short,why=why,inp=inp,out=out,example=example,bad=bad,src=src))

# Each column is a business stage; horizontal bands identify ownership.
node('permission',0,85,'现在允许语音交互吗？','先查权限、通话、系统状态','听见唤醒词，不代表此刻允许接管交互。','麦克风权限、蓝牙电话、CarPlay、OTA、宠物模式','允许→收音；禁用→按场景提示/退出','通话中喊豆包：提示不可用，不播唤醒应答。','OTA 期间无反馈；无麦K歌删除项仍待评审。','gate')
node('blocked',0,195,'禁用时给出正确反馈','不可用提示／强制退出','让用户知道是场景限制，而不是没听见。','禁止交互原因、当前是否正在对话','提示或静默；关闭语音交互界面','手机按键唤醒 Siri，是豆包退出的特殊分支。','不能把所有不可用场景统一成一句唤醒失败。','gate')
node('mic',0,305,'麦克风采集原始声音','同时收到人声、音乐、路噪','后面每一步只能处理采到的声音，入口质量是基础。','乘员声音及车内环境声','连续音频→声学处理','高速行驶，用户说“把温度调低”。','麦克风没授权、被占用，要先查入口。','inside')
node('clean',0,415,'降噪与回声消除','减少路噪和车机自己的声音','避免把导航播报和豆包自己的声音误当成用户指令。','原始音频、扬声器参考音','较清晰人声→音区与识别','豆包正在讲故事，副驾插话。','要覆盖音响不同音量；安静环境通过不等于全部通过。','inside')
node('zone',0,525,'定位哪个座位在说','音区：说话位置；声纹：身份','同一句“开窗”，需要知道来源位置；多人输入也要标来源。','声音定位、座椅、人脸等信息','音区位置、音区是否开启','主驾躺倒后仍应识别为主驾。','无人/关闭音区不接交互；车型音区数要单独确认。','immune')
node('wake',1,85,'唤醒／免唤醒入口','有没有在和豆包建立对话','唤醒模式和免唤醒模式的接入条件不同。','唤醒事件、免唤醒开关、音区','进入本次语音处理','“豆包豆包”；或免唤醒时直接说“下一首”。','旧“主驾免唤醒无需拒识”章节已删除。','immune')
node('listenstate',1,195,'免唤醒的两种状态','未激活 ↔ 连续对话','开着免唤醒，不等于始终把全部聊天放到屏幕上。','当前状态、有效指令、计时','激活后显示实时文字；无效超时退出激活','有效请求重计时，PRD 暂定 30 秒。','30 秒是暂定设计，不是已核验全部车型配置。','immune')
node('frames',1,305,'边说边上传音频','OnePager：每 200 ms 一片','不用等整句话说完才开始听成字。','处理后的连续音频','音频分片→ASR 服务','用户还在说“去昨天那家”，云端已收到前半句。','200 ms 是分片长度，不是出字或回答保证。')
node('pause',1,415,'检测说话与停顿（VAD）','这段话还要不要继续等？','文字识别和结束判断要并行，不能把停顿都当说完。','音频的说话/静音状态','较短停顿 Soft；结束阈值 Hard','“去……昨天那家游泳馆。”','计时看停顿，不从开口开始算；300+600 不等于900。')
node('soft',1,525,'短停顿先准备（Soft）','300 ms；仍然继续收音','把等待间隙用来提前算一部分，用户继续说也能接住。','当前过程文字、本次请求编号','预请求；不结束 ASR','第一次“去”，第二次“去昨天那家游泳馆”。','不能在预请求阶段提前开窗或导航。')
node('hard',2,85,'确认本段结束（Hard）','OnePager：600 ms','正式业务应当以本段最后确认的文字为依据。','当前段的停顿与结束判断','结束分段→等待二遍 final','用户停顿达到该版阈值，系统让这一段识别收尾。','语义延长与600 ms优先关系未展开；不是600 ms就能播答。')
node('partial',2,195,'过程文字（partial）','边听边出，还可能修改','尽早反馈，也供流式判断；不能当永久定稿。','ASR 流式返回','屏幕文字、预请求候选文字','暂时识别“播放音月”。','过程文字正确/错误都可能被 final 修正。')
node('screen',2,305,'显示用户说的话','按交互状态决定怎么显示','及时反馈要兼顾不把乘客聊天都呈现在屏幕上。','过程或最终文字、免唤醒激活状态','实时文字或召回后的最终文字','未激活免唤醒：拒识聊天不显示实时文字。','上屏先离线后在线 final，与二遍识别不是同一维度。','immune')
node('stopstream',2,415,'插话时是否先停播？','主图：云端判断，端侧停播','用户开口时先让出说话机会，但不要误把闲聊当新任务。','流式文字、单/多人、豆包前缀、正在播报状态','满足对应条件→端侧停播','多人时听到“豆包……”走明确称呼分支。','主图支持AIDV云判、端侧停；正文与另一恢复图仍有归属差异。')
node('local',3,85,'本地有没有命中？','可见即可说／当前支持控制','本地能完成的请求可减少等待；但必须命中当前能力。','端侧识别候选、本地能力、网络状态','命中本地执行；未命中进入云端','某条已配置本地能力的控制请求。','别把教学“打开车窗”理解为所有车型都本地。')
node('localdo',3,195,'本地执行并取得结果','动作、回复、实际结果分开记录','用户说了什么和最终做成什么不是一件事。','命中的本地指令','执行结果、给用户的回复','实际执行成功，才记录成功的反馈。','没执行成功不能只凭话术说已完成。')
node('network',3,305,'无网／超时怎样兜底','本地能办的办，不能办的说明','云端不可达时仍应给用户可理解的结果。','网络、白名单、心跳/模块超时','离线结果或兜底话术','“没有网络时，我只能支持一些基础功能。”','2秒无心跳不是所有请求统一2秒超时。','offline')
node('sync',3,415,'把本地经历告诉云端','同步问题、回复、执行结果','否则“再开一点”到了云端，会缺少上一句对象。','Query、Answer、Observation','context/sync 上报→云端历史','本地完成后，下一句云端能接上“刚才那个”。','已读文档没有给出完整重试、去重保证。')
node('feedbackui',4,85,'屏幕反馈：听／想／做','接受指令与执行成功分开','让用户不用靠猜测判断系统到哪一步。','状态与任务结果','文字、状态、结果卡片','多人排队时展示排队信息。','“正在处理”不等于完成；失败也要有结果。','multi')
node('pull',5,85,'按音频标识拉取声音','端侧接收已合成音频','云端合成与车端真实播放是两个动作。','音频标识、音频拉流通道','音频分片→播放器','车端来取时，云端可能已经提前合成部分音频。','收到标识不等于用户已经听到了声音。')
node('play',5,195,'扬声器实际播放','播放器把合成音频播出来','到这一步，用户才真的听到系统回复。','音频分片、播放请求','声音、播放进度','“好的，已找到两个地点……”','音频下载、合成、播放问题要分开排查。')
node('axis',5,305,'记录已经播到哪儿（打轴）','把文字和音频进度对应起来','插话后要知道哪些听过、哪些没听，避免重复或遗漏。','逐字时间信息、播放位置','已播/未播文本→下一轮上下文','“上海天气晴，但是”已播，下午下雨提醒未播。','缺时间信息可按100 ms/字估算；不是精确实测。','plan')
node('interrupt',5,415,'记录为什么停播','先辨打断原因，再谈恢复','新播报替换、系统挂起、插话，不是一种处理。','打断原因、播放位置','允许恢复／不允许恢复','单人ASR>2字直接打断，OnePager表标不恢复。','暂停声音不等于撤销已执行车控。')
node('norecover',5,525,'这些停播不自动恢复','新播报替换／挂起／第三方等','避免刚结束的声音又无故回来。','不允许恢复的原因','结束旧播报','第三方停止全部TTS；豆包退到静默态。','别画成“所有打断→最终拒识→续播”。')
node('outside',0,1645,'车外语音单独走分支','施工中；唤醒单音区','车外有不同硬件、授权与场景条件，不宜照搬车内。','车外麦克风、必要条件、声纹设置','自身必要条件→唤醒单音区；后续复用段未确认','车门/车窗/后备箱范围仍待细化。','图内条件需取图；不支持免唤醒/多人同时是草案口径。','outside')
node('hot',0,735,'热词与最近对话','先帮助“听成正确的字”','联系人、地点、歌名容易同音，提前提供候选有助识别。','通讯录、导航、媒体、页面词、车辆词、最近对话','识别辅助信息→ASR','“云和/云河”要结合地域等信息。','热词不是强制替换，注入也不保证100%生效。')
node('asr',1,735,'语音识别（ASR）','输入声音，输出文字','后续业务先需要知道用户究竟说了什么。','流式音频、热词、最近对话','partial + 最终 final','一边说话，一边出字。','听错字与理解错意图区别排查。')
node('second',2,735,'二遍重识别这段声音','系统再识别，不是人再说','完整一段音频有助修正一遍的临时文字。','分段后的音频与结束信号','final：本次识别最终文字','“播放音月”修正为“播放音乐”。','final仍可能错；二遍超时兜底本次未确认。')
node('pre',1,845,'预请求：只做前置准备','同次输入可以准备多次','提前跑允许的前置任务，不能产生正式业务动作。','临时文字、同次编号、请求次序','拒识/Context等可提前结果','用户停一下又继续，下一份准备更完整。','不能把准备轮次 round_id 当成用户对话轮次。')
node('cache',1,955,'保存前置判断结果','临时准备不进入正式历史','防止中间文字污染已经确认的对话。','支持预请求的模块结果','等待正式请求校验','上次准备的文字还是“去游泳馆”。','不是所有模块都可缓存，也不是模型 KV Cache。')
node('match',2,845,'和上一份准备完全一致吗？','同次 request_id + 前一轮同文本','文字一旦变了，旧判断可能不再适用。','final、前一轮预请求文字、本次编号','相同→复用；不同→重算','最终增加“附近的餐厅”，目的对象已变。','不是语义差不多就复用，也不是任意历史命中。')
node('reuse',2,955,'可复用就少算一次','只复用有可用匹配结果的模块','把准备阶段省下的等待带入正式链路。','通过校验的前置结果','正式拒识/上下文阶段继续','final和前一份预请求完全相同。','准备未完成/超时细则需按具体模块确认。')
node('recalc',2,1065,'没有可用匹配准备：正式判断','以最终输入和可用结果为准','避免按旧文字理解甚至执行错误对象。','无预请求、文本/编号不匹配等','走正式前置；缓存未就绪细则待确认','“音月”变“音乐”，旧准备不能直接套用。','预请求没命中不等于故障；可能是在保护正确性。')
node('semantic',1,1065,'意思还没说全，要不要多等？','语义 VAD；旧版策略另列','静音只说明停顿，未必已经表达完整。','已有识别文字、完整性判断','按配置延长等待或继续','“我想去……”还缺目的地。','旧PRD300/500/1000暂定；不可拼进当前300/600。','vad')
node('refuse',3,735,'这是在对豆包说吗？','拒识：听到了，但不该接话','免唤醒的自然感来自该回应时回应，不该回应时保持安静。','最终文字、上下文、场景','对豆包→继续；非请求→静默','乘客之间聊假期，豆包不应抢答。','手持通话音区强拒识是感知状态规则。','immune')
node('silent',3,845,'拒识：不发起新的业务动作','别取消之前的有效任务','后到的无关语音，不该让正在执行的有效需求消失。','非人机对话判断','保持安静；已停播时另看恢复规则','先要求讲笑话，再说无意义语音，笑话仍应完成。','静默不意味着完全没识别到文字。','multi')
node('nlu',3,955,'理解意图与处理路径','这句话要办什么事？','“我冷”与“空调设24度”对情景信息的依赖不同。','最终文字、上下文、能力定义','按当前链路送对应能力/Planner','“我冷”需要结合空调、车窗等判断。','不能凭一个技术简称假定所有车型都走同一分流。','offline')
node('merge',3,1065,'多人还没执行：合并输入','只合并有效指令；暂定4条','避免后一人把前一人的请求覆盖。','工具未下发前多个有效请求+音区','结构化合并→Planner','主驾要加油站，副驾补充附近充电桩。','角色不是默认优先级；冲突应澄清。','multi')
node('context',4,735,'补齐当前场景（Context）','常用信息先给，缺的再查','“昨天那家”无法只凭字面确定目的地。','历史、车况、位置、情景、记忆等','本次所需上下文→Planner','先检查有没有唯一明确的游泳馆。','不等于每次把所有车内数据都塞进模型。','context')
node('planner',4,845,'规划下一步（Planner）','决定说什么，以及让谁做什么','把一句需求拆成有前后依赖的动作，并跟踪结果。','最终诉求、Context、工具说明、历史反馈','回复话术 + 动作列表','地点未知先查记忆；明确后才导航。','“好嘞”不是任务已成功；缺信息不能编造。','plan')
node('clarify',4,955,'信息不足／冲突：先澄清','不把猜测当成执行依据','多个候选或互斥请求都可能使直接执行出错。','多地点、目标缺失、冲突指令','向用户确认→下一轮输入','一人开空调，一人关空调，先问具体执行哪项。','具体授权和优先级仍需项目规则。','multi')
node('retrieve',4,1065,'需要时再查询信息','记忆／车况／地点等工具','先取得缺少的事实，再决定实际动作。','明确的信息缺口与查询参数','查询结果→工具反馈','查询昨天去过的游泳馆。','没有结果或多个结果都不能直接当唯一成功。','context')
node('talk',5,735,'生成要对用户说的话','talk_content：回复内容','话术负责沟通；动作列表负责办事，两条要分开。','本轮模型决策','回复文本→语音合成','“我先帮你找一下昨天去的地方。”','不能将过程话术写成执行成功反馈。','plan')
node('emotion',5,845,'按情绪分段处理','高兴地说／解释；唱歌另路','说什么和怎么说是不同的决策。','回复文字、情绪标签或用户query','分段话术与对应表达方式','标签为高兴地说，标签本身不会被照念。','唱歌不能当普通朗读；S2S等边界见正文。')
node('sing',5,955,'“唱”标签走唱歌处理','独立能力入口','唱歌的生成方式与普通文本朗读不同。','含唱标签的文本','唱歌处理链路','用户请豆包唱一段。','细节按实际能力定义，不把所有TTS称S2S。')
node('tts',5,1065,'提前合成语音（TTS）','回复文字→可播放音频','在车端来取声音前先做合成，减少后续等待。','分段文本、情绪等','音频与音频标识→端侧拉取','一句话逐段合成并播放。','预期省100 ms来自历史方案，不是每次实测保证。')
node('action',4,1285,'动作列表（action_list）','让下游具体做哪些事','Planner本身不直接操纵车窗和地图。','工具名、明确参数、次序','下游查询/车控/导航/媒体等执行','查到游泳馆后再发导航动作。','工具调用已发出不等于车辆已执行。','plan')
node('execute',4,1395,'下游真实执行','查信息／控制车辆／打开导航','只有执行方能报告实际发生了什么。','具体工具请求','成功、失败、候选或查询数据','地图启动路线；车控返回结果。','能力不支持、状态不允许、网络失败需回传。','plan')
node('feedback',4,1505,'结果回来（tool_feedback）','做成没做成，查到了什么','把执行结果带回下一轮判断，闭环才成立。','下游实际返回','observation→Planner再判断','多个地点→请用户选；唯一地点→下一动作。','允许直接返回的工具可直接收口，并非全都再规划。','plan')
node('round',5,1285,'播报进度与轮次协调','这一轮是否已播完？','避免下一轮话术和上一轮衔接混乱。','本轮是否发TTS、端侧播完通知','按该实现协调后续轮次','源码梳理描述：发过TTS时相应分支等播完。','最多1分钟是该分支实现，不是所有动作都等播完。','plan')
node('recover',5,1395,'允许恢复后再看新话','拒识／真实新需求，走不同路','能恢复不等于机械重放同一段声音。','打断原因、已播未播、新话最终判断','拒识→Event；非拒识→Planner融合','聊天误打断与用户另提要求应区分。','旧实验PCM续播与新OnePager策略分版本讲。')
node('event',5,1505,'最终拒识：事件衔接旧话','带上谁插话、已播和未播','告诉系统这不是新业务请求，接回之前没说完的内容。','恢复事件、上条已播未播','触发新Query衔接','刚才是副驾和别人说话，天气提醒尚未结束。','仅适用于允许恢复的打断原因。')
node('fuse',5,1615,'有效新需求：重新组织回复','新需求＋上条未播内容','回答新问题时考虑旧信息，自然衔接而不是强行拼接。','新用户需求、last_talk_content','Planner生成下一轮回复','“好无聊”加未播天气提醒，综合判断怎么说。','不保证每条未播内容都再次讲完。')
node('done',4,1725,'确认结果／继续下一轮','完成、失败或等待用户','成功条件是需求被处理且有明确状态，不是只播了一句话。','模型收口或直返结果、界面反馈','用户可理解的结果→后续对话','目的地确认后导航启动，用户可接着改路线。','如果仍待澄清，不能把任务标完成。','plan')

node('queue',3,1175,'按采信来源读取播报队列','规划器／工具／语音到语音模型','多个来源可能产生声音，要按当前采信结果读取对应内容，避免播错回复。','各来源音频、来源标记、采信结果','跳过不采信来源；当前段读完再切下一队列','Planner与Agent都有声音候选时，不能谁先到就默认播谁。','原图确认队列存在；未定义所有优先级和取消竞态。')

node('entry',4,195,'按模式决定先走哪条','普通唤醒／免唤醒未激活／已激活','不同交互状态影响端侧预处理和上云时机，不能一开口就一律上云。','交互状态、网络、音区规则','本地识别候选；满足条件才进入上云链路','普通唤醒可端云并行；未激活免唤醒先在端侧拦截。','无网与本地执行不依赖云二遍final。','immune')
node('localasr',4,305,'端侧语音识别','本地把声音转成文字','离线候选和免唤醒预处理需要自己的识别入口。','音频、本地识别能力','本地文字→能力命中或免唤醒预处理','无网时仍可识别本地支持的指令。','离线ASR与云端两遍识别是不同维度。','inside')
node('prefilter',4,415,'未激活免唤醒：先端侧拦截','明确指令／明确拒识／无法处理','避免把所有乘客聊天都当作云端业务请求。','端侧识别文字、场景','明确指令走本地；明确拒识静默；其余按规则上云','刚才在和副驾聊天，豆包保持安静。','激活后可端云并行，不能照搬未激活规则。','immune')
node('proactive',0,1175,'主动服务／事件建议入口','不是每次都从用户语音开始','系统事件或建议也可能发起Planner判断，需要和用户语音入口分开画。','满足条件的事件或建议、相关场景','进入Planner判断是否响应、如何执行','触发条件满足后，由相应事件或建议进入决策。','恢复图便签中的后续Trigger改造不是已上线证明。','plan')
E=[]
def edge(a,b,label='',kind='main'):E.append(dict(a=a,b=b,label=label,kind=kind))
for a,b,l in [('permission','mic','允许'),('permission','blocked','不允许'),('mic','clean','原始音频'),('clean','zone','处理后人声'),('zone','wake','音区有效'),('wake','entry','交互模式'),('entry','localasr','本地候选'),('entry','frames','普通唤醒/已激活且允许上云'),('localasr','prefilter','未激活免唤醒'),('localasr','local','普通唤醒/已激活'),('prefilter','local','明确本地指令'),('prefilter','silent','明确拒识'),('prefilter','frames','无法处理且允许上云'),('wake','listenstate','免唤醒状态'),('frames','asr','持续上传'),('frames','pause','并行检测'),('hot','asr','辅助识别'),('asr','partial','过程文字'),('partial','screen','按状态上屏'),('partial','stopstream','当前有播报'),('pause','soft','停顿300 ms'),('soft','pre','预请求触发'),('partial','pre','数据：当前过程文字'),('pre','cache','临时结果'),('soft','frames','继续收音'),('pause','hard','该版600 ms'),('hard','second','分段收尾'),('asr','second','同段音频'),('second','match','最终文字'),('cache','match','前一轮结果'),('match','reuse','完全一致'),('match','recalc','无可用匹配准备'),('reuse','refuse','正式云处理'),('recalc','refuse','正式云前置'),('local','localdo','本地命中'),('local','frames','未命中且允许上云'),('local','network','无网/异常'),('localdo','sync','记录实际结果'),('sync','context','数据：供后续请求使用'),('localdo','feedbackui','本地执行结果'),('refuse','silent','非人机请求'),('refuse','nlu','有效请求'),('nlu','context','补齐场景'),('nlu','merge','多人未发工具'),('merge','planner','直接统一规划'),('context','planner','本次场景'),('planner','clarify','冲突/不唯一'),('planner','retrieve','缺事实'),('retrieve','feedback','查询结果'),('planner','action','要办的事'),('action','execute','调下游工具'),('execute','feedback','实际返回'),('feedback','planner','需要再判断'),('feedback','done','允许直返'),('planner','talk','要说的话'),('planner','done','无更多动作'),('talk','emotion','分段表达'),('emotion','sing','唱标签'),('sing','queue','唱歌音频及来源'),('emotion','tts','普通语音'),('tts','queue','音频及来源'),('queue','pull','按采信来源拉流'),('pull','play','音频分片'),('play','axis','播放进度'),('axis','round','本轮协调'),('play','feedbackui','用户可感知'),('stopstream','interrupt','端侧停播'),('interrupt','norecover','原因不允许'),('interrupt','recover','尚有未播且原因允许'),('axis','interrupt','数据：已播/未播进度'),('recover','event','最终拒识'),('recover','fuse','有效新需求'),('event','planner','事件衔接'),('fuse','planner','新需求再判断'),('done','feedbackui','结果状态'),('proactive','planner','事件/建议输入')]:edge(a,b,l)
edge('pause','semantic','语义延长另看版本','uncertain');edge('semantic','frames','未完整时继续等','uncertain')

# Route every edge on clear orthogonal rails. No line may run through another card.
def route_edges():
 lookup={n['id']:n for n in N}
 rects=[(n['x']-7,n['y']-7,n['x']+307,n['y']+89) for n in N]
 def clear(p,q):
  for l,t,r,b in rects:
   if p[0]==q[0] and l<p[0]<r and max(min(p[1],q[1]),t)<min(max(p[1],q[1]),b):return False
   if p[1]==q[1] and t<p[1]<b and max(min(p[0],q[0]),l)<min(max(p[0],q[0]),r):return False
  return True
 for e in E:
  a,b=lookup[e['a']],lookup[e['b']]
  if a['x']==b['x']:
   start=(a['x']+300,a['y']+41);finish=(b['x']+300,b['y']+41)
   p=(start[0]+22,start[1]);q=(finish[0]+22,finish[1])
  elif b['x']>a['x']:
   start=(a['x']+300,a['y']+41);finish=(b['x'],b['y']+41);p=(start[0]+22,start[1]);q=(finish[0]-22,finish[1])
  else:
   start=(a['x'],a['y']+41);finish=(b['x']+300,b['y']+41);p=(start[0]-22,start[1]);q=(finish[0]+22,finish[1])
  xs=sorted(set([16,2670,p[0],q[0]]+[v for n in N for v in (n['x']-22,n['x']+322)]))
  ys=sorted(set([30,1845,p[1],q[1]]+[v for n in N for v in (n['y']-22,n['y']+104)]))
  src=(xs.index(p[0]),ys.index(p[1]));dst=(xs.index(q[0]),ys.index(q[1]))
  heap=[(0,src)];cost={src:0};prev={}
  while heap:
   d,u=heapq.heappop(heap)
   if d!=cost[u]:continue
   if u==dst:break
   for v in [(u[0]-1,u[1]),(u[0]+1,u[1]),(u[0],u[1]-1),(u[0],u[1]+1)]:
    if not(0<=v[0]<len(xs) and 0<=v[1]<len(ys)):continue
    pp=(xs[u[0]],ys[u[1]]);qq=(xs[v[0]],ys[v[1]])
    if not clear(pp,qq):continue
    nd=d+abs(pp[0]-qq[0])+abs(pp[1]-qq[1])
    if nd<cost.get(v,10**9):cost[v]=nd;prev[v]=u;heapq.heappush(heap,(nd,v))
  if dst not in cost:raise RuntimeError('Cannot route '+str(e))
  u=dst;pts=[q]
  while u!=src:u=prev[u];pts.append((xs[u[0]],ys[u[1]]))
  pts=[start]+list(reversed(pts))+[finish]
  compressed=[]
  for pnt in pts:
   while len(compressed)>1 and ((compressed[-2][0]==compressed[-1][0]==pnt[0]) or (compressed[-2][1]==compressed[-1][1]==pnt[1])):compressed.pop()
   compressed.append(pnt)
  e['points']=compressed;e['d']='M'+' L'.join(f'{x},{y}' for x,y in compressed)
  # A source-side label remains close to the decision that owns its condition.
  e['labelX']=start[0]+(10 if p[0]>start[0] else -10);e['labelY']=start[1]-11
  e['anchor']='start' if p[0]>start[0] else 'end'
 # Avoid labels sharing the same source port; branch conditions remain individually readable.
 counts={}
 for e in E:
  key=(e['a'],e['anchor']);k=counts.get(key,0);counts[key]=k+1;e['labelY']+=k*17
 main=[('permission','mic'),('mic','clean'),('clean','zone'),('zone','wake'),('wake','entry'),('entry','localasr'),('entry','frames'),('frames','asr'),('frames','pause'),('pause','hard'),('hard','second'),('second','match'),('match','reuse'),('reuse','refuse'),('refuse','nlu'),('nlu','context'),('context','planner'),('planner','action'),('action','execute'),('execute','feedback'),('feedback','planner'),('planner','talk'),('talk','emotion'),('emotion','tts'),('tts','queue'),('queue','pull'),('pull','play')]
 for e in E:
  e['primary']=(e['a'],e['b']) in main
  if e['label'].startswith('数据：'):e['kind']='data'
route_edges()

def small_diagram(index):
 specs={
  1:('第一讲：先判断交互资格，再处理声音',[(0,0,'允许交互吗？','权限／电话／系统状态'),(1,0,'采集并清理声音','麦克风 → 降噪／消回声'),(2,0,'确认说话音区','哪个座位？该音区开着吗？'),(3,0,'唤醒或免唤醒入口','按当前模式继续听'),(0,1,'提示不可用／退出','不同禁用场景表现不同'),(2,1,'不开启该音区交互','无人／音区关闭等条件')],[(0,1,'允许'),(1,2,'人声'),(2,3,'音区有效'),(0,4,'不允许'),(2,5,'不满足')],'“被检测到唤醒”与“允许进入对话”是两个判断；禁用分支不会继续流向麦克风业务。','inside'),
  2:('第二讲：一边识别，一边判断要不要继续等',[(0,0,'一遍 ASR 过程文字','边听边出字，还可能变化'),(1,0,'短停顿 Soft 300 ms','只先准备，不结束识别'),(2,0,'预请求做前置判断','不执行车控／导航动作'),(3,0,'保存本次准备结果','同次编号 + 第几次准备'),(0,1,'Hard 600 ms 分段','该版结束判定，等待二遍'),(1,1,'二遍 final 最终文字','系统重识别，不需人重说'),(2,1,'和上一份完全相同？','同时检查本次请求编号'),(3,1,'复用允许缓存的结果','继续正式业务'),(2,2,'文字变化就重算','以最终表达为准')],[(0,1,'停顿'),(1,2,'当前文字'),(2,3,'临时结果'),(4,5,'同段音频收尾'),(5,6,'最终文字'),(3,6,'前一份准备'),(6,7,'完全一致'),(6,8,'不一致')],'上下两行是并行配合的路径，不是让用户说两遍；语义延长与各版阈值见下文。','one'),
  3:('第三讲：先问“是不是叫我”，再问“要我干什么”',[(0,0,'最终文字与场景','输入不是只有一句孤立文字'),(1,0,'是否对豆包说？','拒识判断：该不该接话'),(2,0,'理解意图（NLU）','识别要办的事与参数'),(3,0,'进入相应处理路径','结合能力与复杂程度'),(1,1,'保持安静','不发起新业务动作'),(2,1,'已有有效任务继续','后来的闲聊不该取消它')],[(0,1,'结合上下文'),(1,2,'有效请求'),(2,3,'任务明确'),(1,4,'人人聊天等'),(4,5,'不破坏旧任务')],'拒识不是完全没听见；它可能已经听成字，但判定此刻不该回应。','immune'),
  4:('第四讲：本地做过什么，后续云端也要接上',[(0,0,'本地能力命中吗？','按车型／配置和网络判断'),(1,0,'本地执行并取结果','不能只记录用户说了什么'),(2,0,'同步这次实际经历','问题 + 回复 + 执行结果'),(3,0,'云端组装后续上下文','让“刚才那个”有依据'),(0,1,'进入云端正式链路','本地没命中不等于没能力'),(1,1,'离线结果或明确兜底','无网／异常按对应策略处理')],[(0,1,'命中'),(1,2,'实际结果'),(2,3,'上报历史'),(0,4,'未命中且可用'),(0,5,'无网／异常')],'context/sync 是同步上报；已读材料未给出完整失败重试和去重保证。','one'),
  5:('第五讲：表达方式不同，音频生成入口也不同',[(0,0,'确定回复内容','先决定要告诉用户什么'),(1,0,'识别情绪与表达方式','标签不会作为正文念出'),(2,0,'普通文本合成语音','TTS：文字 → 声音'),(3,0,'按采信来源进入播报','生成声音与实际播放分开'),(1,1,'唱标签走唱歌处理','不是把歌词当普通文字念'),(2,1,'语音到语音（S2S）','能力边界按当前接入确认')],[(0,1,'回复文本'),(1,2,'普通语音'),(2,3,'合成音频'),(1,4,'唱标签'),(4,3,'唱歌音频'),(5,3,'被采信的音频')],'S2S、唱歌与情感化 TTS 不能合成一个词；它们的入口、作用和接入状态要分别说明。','one'),
  6:('第六讲：不是“说了就算”，而是执行结果回来再判断',[(0,0,'Planner 判断下一步','现有信息够不够？还缺什么？'),(1,0,'下发明确动作','action_list：工具与参数'),(2,0,'下游真实执行','查询／车控／导航／媒体'),(3,0,'工具回传实际结果','成功、失败或候选信息'),(0,1,'先查询／先澄清','没有唯一依据时不猜着做'),(1,1,'并行输出对用户的话','talk_content → 播报链路'),(3,1,'继续判断或收口','直返工具可按规则结束')],[(0,1,'能行动'),(1,2,'调工具'),(2,3,'执行反馈'),(0,4,'缺信息'),(0,5,'需要沟通'),(3,6,'结果决定下一步'),(6,0,'需继续：带反馈再判断')],'反馈回来后，Planner 根据结果重新判断。开口说“好嘞”，不是任务成功证明。','plan'),
  7:('第七讲：停播之后，先看原因，再看新话',[(0,0,'回复文本 → TTS 合成','先生成可播放音频'),(1,0,'按采信队列拉流播放','用户真正听到声音'),(2,0,'打轴记录已播／未播','知道已经说到哪里'),(3,0,'打断原因允许恢复吗？','不是所有停播都恢复'),(3,1,'不恢复：结束旧播报','替换／挂起／单人直接打断等'),(2,1,'再看新话最终判断','只针对允许恢复的原因'),(1,2,'最终拒识：Event 衔接','带上已播和未播信息'),(3,2,'有效新需求：Planner 融合','按新需求组织下一段话')],[(0,1,'音频标识／分片'),(1,2,'播放进度'),(2,3,'发生插话等事件'),(3,4,'不允许'),(3,5,'允许'),(5,6,'最终拒识'),(5,7,'有效请求')],'停播不等于撤销车控；“打轴”也不是“打断”，它负责说明播到了哪里。','one')}
 title,nodes,links,caption,src=specs[index];w=1020;h=(max(n[1] for n in nodes)+1)*150+70
 parts=[f'<svg class="lesson-svg" viewBox="0 0 {w} {h}" role="img" aria-label="{html.escape(title)}"><defs><marker id="mini-arrow-{index}" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#328a82"/></marker></defs>']
 pos=[(30+c*250,35+r*150) for c,r,*_ in nodes]
 for i,j,label in links:
  x,y=pos[i];xx,yy=pos[j]
  if yy==y:
   a=(x+210,y+35);b=(xx,y+35);d=f'M{a[0]},{a[1]} L{b[0]},{b[1]}';tx=(a[0]+b[0])/2;ty=y+22
  elif xx==x:
   a=(x+105,y+70);b=(xx+105,yy);d=f'M{a[0]},{a[1]} L{b[0]},{b[1]}';tx=x+119;ty=(a[1]+b[1])/2
  else:
   a=(x+105,y+70 if yy>y else y);b=(xx+105,yy if yy>y else yy+70);mid=(a[1]+b[1])/2;d=f'M{a[0]},{a[1]} L{a[0]},{mid} L{b[0]},{mid} L{b[0]},{b[1]}';tx=(a[0]+b[0])/2;ty=mid-7
  parts.append(f'<path d="{d}" fill="none" stroke="#328a82" stroke-width="2" marker-end="url(#mini-arrow-{index})"/><text x="{tx}" y="{ty}" text-anchor="middle" fill="#315c63" font-size="13" paint-order="stroke" stroke="white" stroke-width="5">{html.escape(label)}</text>')
 for (x,y),(_,_,label,sub) in zip(pos,nodes):
  parts.append(f'<rect x="{x}" y="{y}" width="210" height="70" rx="12" fill="white" stroke="#91bfb9"/><text x="{x+105}" y="{y+28}" text-anchor="middle" fill="#164b51" font-size="16" font-weight="bold">{html.escape(label)}</text><text x="{x+105}" y="{y+52}" text-anchor="middle" fill="#527076" font-size="12">{html.escape(sub)}</text>')
 parts.append('</svg>');source=SOURCES[src]
 return '<figure class="lesson-map"><figcaption><b>'+title+'</b><span class="small">按条件看箭头；图较宽，可左右滚动查看</span></figcaption><div class="lesson-map-scroll">'+''.join(parts)+'</div><p>'+caption+f' <a href="{source[1]}" target="_blank" rel="noopener">查看依据</a></p></figure>'

def export_board_svg(path):
 parts=['<svg xmlns="http://www.w3.org/2000/svg" width="3950" height="2200" viewBox="0 0 3950 2200"><style>text{font-family:Arial,"PingFang SC","Microsoft YaHei",sans-serif}</style><rect width="3950" height="2200" fill="#f7fafb"/><text x="35" y="40" font-size="28" fill="#163f49" font-weight="bold">豆包座舱语音闭环｜完整业务大画板</text><text x="35" y="69" font-size="17" fill="#526c73">实线：正式业务流转；虚线：版本或归属待确认。点击节点可打开直接来源；交互讲解见同版本 HTML。</text><g transform="translate(0,90)"><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#658c94"/></marker></defs>']
 for y,h,label,color in [(45,610,'车端 · 输入与播放','#edf5f8'),(675,595,'云端／跨端协同 · 识别、理解、规划','#edf7f1'),(1280,580,'下游执行与反馈','#f7f2e9')]:parts.append(f'<rect y="{y}" width="2700" height="{h}" fill="{color}"/><text x="16" y="{y+23}" font-size="16" fill="#49646b">{label}</text>')
 for e in E:
  parts.append(f'<path d="{e["d"]}" fill="none" stroke="#6e919a" stroke-width="1.5" opacity="0.55" '+('stroke-dasharray="7 5" ' if e['kind']=='uncertain' else '')+'marker-end="url(#arrow)"/>')
 for n in N:
  source=SOURCES[n['src']];x=n['x'];y=n['y'];tip=n['why']+' 输入：'+n['inp']+' 输出：'+n['out']+' 边界：'+n['bad']
  parts.append(f'<a href="{html.escape(source[1])}" target="_blank"><title>{html.escape(tip)}</title><rect x="{x}" y="{y}" width="300" height="82" rx="12" fill="white" stroke="#8ab7b8"/><text x="{x+13}" y="{y+29}" font-size="17" font-weight="bold" fill="#164653">{html.escape(n["title"])}</text><text x="{x+13}" y="{y+57}" font-size="13" fill="#506a72">{html.escape(n["short"])}</text></a>')
 parts.append('</g><text x="2730" y="110" font-size="23" font-weight="bold" fill="#174f55">完整连线条件表</text><text x="2730" y="140" font-size="15" fill="#586e75">每行对应一条有方向的连线；数据线不代表立即执行。</text>')
 names={n['id']:n['title'] for n in N}
 for i,e in enumerate(E):
  yy=175+i*25
  parts.append(f'<text x="2730" y="{yy}" font-size="14" fill="#345b64">{i+1:02d} · {html.escape(names[e["a"]])} → {html.escape(names[e["b"]])} ｜ {html.escape(e["label"])}</text>')
 parts.append('</svg>')
 with path.open('x') as f:f.write(''.join(parts))

CSS=r'''
:root{--ink:#18333d;--muted:#546b73;--blue:#176b9a;--teal:#127c75;--line:#d6e4e6;--paper:#fff;--soft:#f3f8f8;--orange:#b65b19}*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:90px}body{margin:0;color:var(--ink);background:#f7fafb;font:17px/1.85 -apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft Yahei",sans-serif}button,select,input{font:inherit}button,.pill{border:1px solid var(--line);background:white;border-radius:10px;padding:8px 14px;cursor:pointer;color:var(--ink)}button:hover,button.active{background:#e3f1f0;border-color:var(--teal)}button:focus-visible,a:focus-visible{outline:3px solid #e2a43a;outline-offset:3px}a{color:#096b9c;text-underline-offset:3px}header{position:sticky;top:0;z-index:20;background:#fffffff2;backdrop-filter:blur(10px);border-bottom:1px solid var(--line);padding:12px 24px;display:flex;gap:18px;align-items:center;justify-content:space-between}header strong{font-size:17px}header nav{display:flex;gap:6px;flex-wrap:wrap}header a{text-decoration:none;font-size:14px;padding:5px 9px}.wrap{max-width:1190px;margin:auto;padding:0 28px}.hero{padding:65px 0 38px}.eyebrow{letter-spacing:.08em;color:var(--teal);font-size:14px;font-weight:700}h1{font-size:clamp(32px,4.4vw,56px);line-height:1.25;margin:16px 0 22px;max-width:1050px}h2{font-size:30px;line-height:1.4;margin:8px 0 22px}h3{font-size:23px;line-height:1.5}h4{font-size:19px}.lede{font-size:21px;max-width:930px;color:#365963}.tagrow{display:flex;gap:10px;flex-wrap:wrap;margin:22px 0}.tag{font-size:13px;padding:5px 12px;border:1px solid #bedbd9;border-radius:99px;background:#eef8f7}.callout{border-left:4px solid var(--teal);padding:17px 22px;background:#edf6f5;margin:20px 0;border-radius:0 12px 12px 0}.warn{border-color:#c48337;background:#fff7e8}.section{margin:30px 0;padding:36px;background:white;border:1px solid var(--line);border-radius:20px}.section-kicker{font-size:13px;color:var(--teal);font-weight:700;letter-spacing:.07em}.route{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:30px 0}.route a{display:block;text-decoration:none;padding:18px;border:1px solid var(--line);border-radius:14px;background:white;color:var(--ink)}.route b{display:block;font-size:19px}.route small{font-size:13px;color:var(--muted)}.flowline{display:flex;gap:10px;flex-wrap:wrap;align-items:center}.flowline span{padding:8px 12px;background:#eaf5f4;border-radius:8px}.flowline i{color:var(--teal)}.small{font-size:14px;color:var(--muted)}.board-controls{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:20px 0 12px}.board-shell{position:relative;overflow:auto;max-height:72vh;min-height:460px;border:1px solid #b9d5d7;border-radius:14px;background:#f5f9fa}.board-sized{position:relative}.board{position:absolute;left:0;top:0;transform-origin:0 0;width:2700px;height:1870px}.board svg{position:absolute;inset:0;overflow:visible}.lane{position:absolute;left:0;width:2700px;border-top:1px solid #c9dddf;background:#f3f8f9}.lane.cloud{background:#eef7f3}.lane.tools{background:#f7f3eb}.lane-name{position:sticky;left:14px;display:inline-block;margin:10px 14px;font-size:15px;letter-spacing:.05em;font-weight:700;background:#ffffffce;padding:3px 10px;border-radius:8px}.colhead{position:absolute;top:4px;font-size:17px;font-weight:700;color:#38636d}.node{position:absolute;width:300px;height:82px;padding:9px 13px;border-radius:12px;border:1.5px solid #96bbc2;background:white;text-align:left;box-shadow:0 3px 9px #1737400a;font-size:15px;line-height:1.45;z-index:3}.node strong{display:block;font-size:17px;color:#143e4a;margin-bottom:5px}.node small{font-size:13px;color:#506d74}.node.selected{border:3px solid #147b74;box-shadow:0 0 0 6px #147b741c}.edge{display:none;fill:none;stroke:#72939b;stroke-width:1.5;opacity:.6}.edge.visible{display:block}.edge.data{stroke-dasharray:3 5;stroke:#537ca5}.edge.uncertain{stroke:#ad792a;stroke-dasharray:7 5}.edge.on{stroke:#067f75;stroke-width:3;opacity:1}.edge-label{font-size:12px;fill:#466b74;paint-order:stroke;stroke:#fff;stroke-width:5px;stroke-linejoin:round}.board-info{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:18px;padding:24px;background:#f4f9f9;border-radius:14px;border:1px solid var(--line)}.board-info h3{grid-column:1/-1;margin:0}.next-steps{grid-column:1/-1;border-top:1px solid #cadddc;padding-top:16px}.next-steps ul{list-style:none;padding:0;margin:10px 0;display:grid;gap:8px}.next-steps button{width:100%;text-align:left;font-size:16px}.detail-label{font-size:12px;color:#087d73;letter-spacing:.08em;font-weight:800}.detail-value{margin:5px 0;font-size:16px}.sim{margin:24px 0;padding:26px;border:1px solid #bcd9d7;background:#f7fbfb;border-radius:16px}.sim-controls{display:flex;flex-wrap:wrap;gap:8px;align-items:center}.sim-display{margin:18px 0;display:grid;grid-template-columns:1.05fr 1fr;gap:15px}.sim-panel{background:white;border:1px solid var(--line);border-radius:12px;padding:20px;min-height:175px}.sim-title{font-size:13px;color:var(--teal);font-weight:700}.sim-main{font-size:25px;font-weight:700;line-height:1.6;margin:10px 0}.sim-note{font-size:15px;color:var(--muted)}.progress{height:8px;border-radius:9px;background:#dbe9e8;margin:16px 0;overflow:hidden}.progress>div{height:100%;background:#15867c;transition:width .4s}.stepdots{display:flex;gap:6px;flex-wrap:wrap}.stepdots button{width:30px;height:30px;padding:0;font-size:13px;border-radius:50%}.sim-caption{min-height:80px;font-size:17px;padding:16px 0 0}.spoken{background:#caece1;padding:2px 0}.unspoken{background:#ffedce;padding:2px 0}.two{display:grid;grid-template-columns:1fr 1fr;gap:18px}article p{margin:14px 0}article h2{border-top:1px solid var(--line);padding-top:30px;margin-top:45px}article h3{margin-top:30px}article table{border-collapse:collapse;width:100%;font-size:15px;line-height:1.7;margin:24px 0;display:block;overflow:auto}article th{background:#e7f1f1;text-align:left}article td,article th{padding:12px 14px;border:1px solid #cbdedf;min-width:110px}article blockquote{margin:20px 0;padding:12px 20px;border-left:4px solid #78b6b0;background:#f1f8f7}article pre{overflow:auto;background:#18333d;color:#f0f7f5;padding:20px;border-radius:10px;font-size:14px}article code{font-size:.87em;background:#edf3f3;padding:2px 5px;border-radius:4px}article pre code{background:none}.toc{display:flex;flex-wrap:wrap;gap:7px}.toc a{font-size:14px;background:#f0f7f6;padding:7px 12px;border-radius:8px;text-decoration:none}.source-list{font-size:15px}.source-list li{margin:8px 0}.gallery{display:grid;grid-template-columns:1fr 1fr;gap:18px}.gallery figure{margin:0;border:1px solid var(--line);border-radius:12px;overflow:hidden;background:white}.gallery img{display:block;width:100%;height:260px;object-fit:contain;background:#fafafa;cursor:zoom-in}.gallery figcaption{padding:14px;font-size:14px;line-height:1.65}.modal{position:fixed;inset:0;background:#0d202ce8;z-index:60;display:none;overflow:auto;padding:70px 24px 30px}.modal.open{display:block}.modal img{display:block;max-width:none;margin:auto;background:white}.modal button{position:fixed;right:24px;top:18px}.lesson-map{margin:26px 0 32px;padding:18px;border:1px solid #badbd7;border-radius:15px;background:#f0f8f6}.lesson-map figcaption{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;font-size:18px}.lesson-map-scroll{overflow:auto}.lesson-svg{display:block;width:100%;min-width:780px;height:auto;font-family:inherit}.lesson-map p{font-size:15px;color:#42636b;margin:8px 0}.download-link{padding:9px 13px;border:1px solid #b1d1cf;border-radius:10px;background:#edf7f5;text-decoration:none}article h1{font-size:32px;line-height:1.4;margin:30px 0}article img{max-width:100%}.reading{max-width:100%}details{border:1px solid var(--line);border-radius:12px;padding:16px 20px;margin:14px 0}summary{cursor:pointer;font-weight:700}footer{text-align:center;padding:45px;color:var(--muted);font-size:14px}.inventory{max-height:500px;overflow:auto}.inventory table{width:100%;border-collapse:collapse;font-size:13px}.inventory td{padding:8px;border-bottom:1px solid var(--line)}@media(max-width:760px){header{display:block;padding:10px 15px}header nav{margin-top:4px}.wrap{padding:0 15px}.hero{padding:32px 0}.route{grid-template-columns:1fr 1fr}.section{padding:22px 18px}.sim-display,.two,.board-info,.gallery{grid-template-columns:1fr}.sim{padding:18px}.board-info h3{grid-column:auto}h2{font-size:26px}.board-shell{min-height:420px}body{font-size:16px}.sim-main{font-size:22px}}@media print{header,.board-controls,.sim-controls,.stepdots{display:none}.wrap{max-width:none}.section{break-inside:avoid;border:none}.board-shell{height:620px;overflow:hidden}.board{transform:scale(.4)!important}.board-sized{width:1080px!important;height:750px!important}}
'''

JS=r'''
const nodes=__NODES__,edges=__EDGES__,sources=__SOURCES__;
const board=document.getElementById('board'), shell=document.getElementById('board-shell'), sized=document.getElementById('board-sized');
let scale=.82;
function esc(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
const ns={};nodes.forEach(n=>ns[n.id]=n);
let paths='',labels='';
edges.forEach((e,i)=>{paths+=`<path id="edge${i}" class="edge ${e.kind}" data-primary="${e.primary}" data-a="${e.a}" data-b="${e.b}" d="${e.d}" marker-end="url(#arrow)"/>`;labels+=`<text class="edge-label" data-primary="${e.primary}" data-a="${e.a}" data-b="${e.b}" x="${e.labelX}" y="${e.labelY}" text-anchor="${e.anchor}" style="display:none">${esc(e.label)}</text>`;});
function edgeView(id=null){document.querySelectorAll('.edge').forEach(x=>{const on=id?(x.dataset.a===id||x.dataset.b===id):x.dataset.primary==='true';x.classList.toggle('visible',on);x.classList.toggle('on',Boolean(id)&&on);});document.querySelectorAll('.edge-label').forEach(x=>x.style.display=(id?(x.dataset.a===id||x.dataset.b===id):x.dataset.primary==='true')?'':'none');document.getElementById('edge-mode').textContent=id?'当前仅显示所选节点的进出分支':'当前仅显示主线；点击节点展开它的分支';}
function mainView(){edgeView();document.querySelectorAll('.node').forEach(x=>x.classList.remove('selected'));}
board.insertAdjacentHTML('beforeend',`<svg width="2700" height="1870" aria-label="业务节点之间的流向"><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#608b91"/></marker></defs>${paths}${labels}</svg>`);
nodes.forEach(n=>board.insertAdjacentHTML('beforeend',`<button class="node" id="n-${n.id}" style="left:${n.x}px;top:${n.y}px" onclick="selectNode('${n.id}')"><strong>${esc(n.title)}</strong><small>${esc(n.short)}</small></button>`));
function setScale(v){scale=Math.min(1.5,Math.max(.25,v));board.style.transform=`scale(${scale})`;sized.style.width=2700*scale+'px';sized.style.height=1870*scale+'px';document.getElementById('zoom-value').textContent=Math.round(scale*100)+'%';}
function selectNode(id){const n=ns[id];document.querySelectorAll('.node').forEach(x=>x.classList.toggle('selected',x.id==='n-'+id));edgeView(id);const s=sources[n.src];document.getElementById('board-info').innerHTML=`<h3>${esc(n.title)}</h3>`+[['为什么有这一步',n.why],['收到什么',n.inp],['交给下一步什么',n.out],['放到车上怎么理解',n.example],['异常与证据边界',n.bad]].map(x=>`<div><div class="detail-label">${x[0]}</div><div class="detail-value">${esc(x[1])}</div></div>`).join('')+`<div><div class="detail-label">直接出处</div><a target="_blank" rel="noopener" href="${s[1]}">${s[0]}</a><div class="small">文档描述／产品设计，不等于已核验量产状态</div></div>`+`<div class="next-steps"><div class="detail-label">接下来怎么走</div>${edges.filter(e=>e.a===id).length?'<ul>'+edges.filter(e=>e.a===id).map(e=>`<li><button onclick="goNode('${e.b}')"><b>${esc(e.label||'继续')}</b> → ${esc(ns[e.b].title)} <span class="small">定位节点 ↗</span></button></li>`).join('')+'</ul>':'<p class="detail-value">本图未继续展开下一步，请结合本节点的异常与证据边界阅读。</p>'}</div>`;}
function goNode(id){const n=ns[id];selectNode(id);setScale(.9);shell.scrollTo({left:Math.max(0,n.x*scale-40),top:Math.max(0,n.y*scale-70),behavior:'smooth'});}
function focusPart(col){setScale(.9);shell.scrollTo({left:col*440*scale,top:0,behavior:'smooth'});}
document.getElementById('node-search').addEventListener('input',e=>{let q=e.target.value.trim().toLowerCase();if(!q)return;let n=nodes.find(n=>(n.title+n.short).toLowerCase().includes(q));if(n){selectNode(n.id);setScale(.9);shell.scrollTo({left:Math.max(0,n.x*scale-40),top:Math.max(0,n.y*scale-70),behavior:'smooth'});}});
setScale(scale);selectNode('mic');mainView();

const vadScenarios={
pause:[['用户开始说话','“去……”','收音继续 · ASR 过程文字','当前文字：去','还不知道最终目的地。ASR在听成字，VAD同时观察停顿。',0],['短停顿达到 300 ms','“去……”','Soft：发出临时准备','请求1：只做允许的前置工作','没有结束ASR，没有导航。语义不完整时的延长策略另见版本说明。',300],['用户接着说','“昨天那家游泳馆”','仍属于当前语音段的教学示意','文字更新：去昨天那家游泳馆','Soft没有截断收音，因此后半句可以继续进入；不能据动画保证任意停顿都不会截断。',0],['再次短停顿 300 ms','“去昨天那家游泳馆”','Soft：再次准备','请求2：使用更完整的文字','本次输入编号不变，准备次序增加。不是第二轮用户对话。',300],['本段停顿到 600 ms','用户已停止说话','Hard：让这一段识别收尾','等待二遍最终文字','600 ms是本版判停节点，不等于已经拿到回答，更不是再加300 ms。',600],['二遍最终文字到达','去昨天那家游泳馆','final：本次识别定稿','与前一份准备完全一致','同次编号且文字完全相同，支持缓存的模块可复用。',600],['进入正式业务','查记忆，再确定地点','正式请求 → Planner','临时准备没有提前导航','地点唯一才能继续，缺信息时查询或澄清。',600]],
revise:[['用户说“播放音乐”','过程文字：播放音月','一遍先出字','过程文字可能修正','以下使用原PRD示例，展示机制，不是实车录屏。',0],['停顿 300 ms','预请求文字：播放音月','Soft：先准备','临时准备结果已保存','这份结果只对当时的文字成立。',300],['停顿 600 ms','结束本段，等待二遍','Hard：分段','尚未正式执行业务','用户不用再重复说一遍。',600],['二遍 final 修正','最终文字：播放音乐','文字不一样了','旧准备结果不能复用','同一次输入也不够；还必须与前一轮预请求文字完全一致。',600],['按新文字正式判断','播放音乐','重新做必要前置处理','再进入实际播放任务','宁可重算，也不能按“音月”的旧判断执行。',600]],
same:[['用户说完','“今天天气怎么样”','ASR已有过程文字','收音继续','先准备不等于已经提交完整业务。',0],['停顿 300 ms','Soft预请求','提前准备拒识/Context等','当前文字已保存','这段工作可以与等待判停重叠。',300],['停顿 600 ms','Hard分段，二遍收尾','final返回相同文字','和前一轮准备完全一致','只有支持预请求缓存的模块复用。',600],['正式处理','复用准备结果并继续','仍要完成后续判断和回复','省掉一部分重复计算','不保证每条都固定省200 ms，方案预期与实测分开。',600]]};
const plannerSteps=[['用户：“去昨天那家游泳馆”','先检查当前信息','输入：用户诉求 + 已知场景','如果已有唯一地点，可省掉查询；本例假设还不知道。'],['Planner 第一轮：先查记忆','动作列表：查询相关记忆','对用户：我先找一下','话术与查询动作是两路输出，开口回答不等于开始导航。'],['工具返回：找到两个候选','tool_feedback：候选A、候选B','实际结果回到 Planner','工具负责回报查到了什么，不能把“查到候选”当目的地确认。'],['Planner 第二轮：澄清是哪一家','对用户：你说的是哪一家？','等待用户确认','本例演示信息不唯一时的产品逻辑，不是固定话术。'],['用户确认后：调用导航','动作列表：导航到已确认地点','下游导航开始执行','具体参数要来自已确认信息，不能擅自编地点。'],['导航工具回报实际结果','成功／失败由下游返回','成功后确认；失败后继续判断','成功时展示路线；失败不能只说“已经导航”。'],['结果闭环','需求状态明确','可继续调整途经点或路线','有些允许直返工具可直接收口；本例仅演示需要多步的情况。']];
const interruptModes={valid:[['豆包正在说天气','上海天气晴，但是','下午可能下雨哦','音频与文字的对应关系帮助记录进度。'],['多人插话触发允许恢复的原因','上海天气晴，但是','下午可能下雨哦','先停播并保存已播/未播；本例选择允许恢复的原因，不覆盖所有打断。'],['新话最终确认是有效请求','新问题：“好无聊”','未播提醒仍可供参考','Planner同时收到新需求和上一条没说完的内容。'],['Planner重新组织下一轮回复','按新需求生成内容','考虑怎样自然带上旧提醒','不是机械续播，也不保证所有旧内容必讲完。']],reject:[['豆包正在说天气','上海天气晴，但是','下午可能下雨哦','先看播报进度。'],['允许恢复原因触发暂停','上海天气晴，但是','下午可能下雨哦','暂停声音，仍不等于撤销已经做过的动作。'],['最后发现是乘客间聊天','这句被拒识','没有新的业务需求','只在本次打断原因允许恢复的前提下继续。'],['事件触发衔接','携带已播/未播信息','接回未完成的内容','按新OnePager走Event触发新Query，别混成旧实验PCM原音频续播。']],no:[['单人插话 ASR > 2字','当前播放停止','记录打断原因 SingleInterrupt','OnePager恢复表：该原因不恢复。'],['不要默认恢复旧话','已播内容保留','旧播报停止','即使后来结果不同，也不能凭通用“拒识就续播”覆盖原因表。'],['评审需要对齐体验','单人误触发是否也不恢复？','按当前版本请负责人确认','这是需要明确的产品边界，不在动画里替系统发明例外。']]};
function setupPlayer(key,getSteps,render){let i=0,timer=null;const root=document.getElementById(key);function update(){let steps=getSteps();i=Math.max(0,Math.min(i,steps.length-1));render(root,steps[i]);root.querySelector('.progress>div').style.width=((i+1)/steps.length*100)+'%';root.querySelector('.stepdots').innerHTML=steps.map((_,n)=>`<button aria-label="第${n+1}步" class="${n===i?'active':''}" data-step="${n}">${n+1}</button>`).join('');root.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>{i=+b.dataset.step;update();});root.querySelector('.counter').textContent=`${i+1} / ${steps.length}`;}function pause(){clearInterval(timer);timer=null;root.querySelector('[data-act="play"]').textContent='▶ 播放演示';}root.querySelector('[data-act="play"]').onclick=()=>{if(timer){pause();return}root.querySelector('[data-act="play"]').textContent='Ⅱ 暂停';if(i>=getSteps().length-1)i=0;update();timer=setInterval(()=>{i++;if(i>=getSteps().length){i=getSteps().length-1;pause();}update();},2800);};root.querySelector('[data-act="prev"]').onclick=()=>{pause();i--;update();};root.querySelector('[data-act="next"]').onclick=()=>{pause();i++;update();};root.querySelector('[data-act="reset"]').onclick=()=>{pause();i=0;update();};root.querySelectorAll('select').forEach(s=>s.onchange=()=>{pause();i=0;update();});update();return pause;}
const pauses=[];
pauses.push(setupPlayer('vad-demo',()=>vadScenarios[document.getElementById('vad-choice').value],(r,s)=>{r.querySelector('.panel1').innerHTML=`<div class="sim-title">${s[0]}</div><div class="sim-main">${esc(s[1])}</div><div class="sim-note">当前停顿示意：${s[5]} ms</div>`;r.querySelector('.panel2').innerHTML=`<div class="sim-title">系统这一步</div><div class="sim-main">${esc(s[2])}</div><div class="sim-note">${esc(s[3])}</div>`;r.querySelector('.sim-caption').textContent=s[4];}));
pauses.push(setupPlayer('planner-demo',()=>plannerSteps,(r,s)=>{r.querySelector('.panel1').innerHTML=`<div class="sim-title">这一轮发生什么</div><div class="sim-main">${esc(s[0])}</div>`;r.querySelector('.panel2').innerHTML=`<div class="sim-title">输入与输出</div><div class="sim-main">${esc(s[1])}</div><div class="sim-note">${esc(s[2])}</div>`;r.querySelector('.sim-caption').textContent=s[3];}));
pauses.push(setupPlayer('interrupt-demo',()=>interruptModes[document.getElementById('interrupt-choice').value],(r,s)=>{r.querySelector('.panel1').innerHTML=`<div class="sim-title">${esc(s[0])}</div><div class="sim-main"><span class="spoken">${esc(s[1])}</span></div><div class="sim-note">绿色：已播或已确认状态</div>`;r.querySelector('.panel2').innerHTML=`<div class="sim-title">尚未播报／下一步</div><div class="sim-main"><span class="unspoken">${esc(s[2])}</span></div>`;r.querySelector('.sim-caption').textContent=s[3];}));
document.addEventListener('visibilitychange',()=>{if(document.hidden)pauses.forEach(p=>p());});
document.querySelectorAll('.gallery img').forEach(im=>im.onclick=()=>{document.getElementById('full-image').src=im.src;document.getElementById('image-modal').classList.add('open');});function closeImage(){document.getElementById('image-modal').classList.remove('open');}document.addEventListener('keydown',e=>{if(e.key==='Escape')closeImage();});
'''

def sim(id,title,select=''):
 return f'''<div class="sim" id="{id}"><h3>{title}</h3><p class="small">教学示意：按步骤演示因果关系；播放节奏不是系统实际耗时，不包含真实录音。</p><div class="sim-controls">{select}<button data-act="prev">← 上一步</button><button data-act="play">▶ 播放演示</button><button data-act="next">下一步 →</button><button data-act="reset">重置</button><span class="small counter"></span></div><div class="progress"><div></div></div><div class="sim-display"><div class="sim-panel panel1"></div><div class="sim-panel panel2"></div></div><div class="stepdots"></div><div class="sim-caption" aria-live="polite"></div></div>'''

def render_md(text):
 md=MarkdownIt('commonmark',{'html':True}).enable('table')
 # Bare URLs remain clickable, including source listings in research notes.
 text=re.sub(r'(?m)^(链接[：:]\s*)(https?://\S+)\s*$',lambda m:m[1]+'<'+m[2]+'>',text)
 out=md.render(text)
 return out

def build(version=None):
 content_path=ROOT/'课堂正文.md'
 if not content_path.exists():
  raise SystemExit('等待课堂正文.md；不生成不完整HTML。')
 if version is None:
  nums=[int(m[1]) for p in OUT.parent.rglob('豆包座舱语音闭环-图文课堂版-v*.html') if (m:=re.search(r'-v(\d+)\.html$',p.name))];version=max(nums,default=0)+1
 svg_name=f'豆包座舱语音闭环-完整大画板-v{version:02d}.svg'
 article=render_md(content_path.read_text())
 headings=[]
 def heading(m):
  i=len(headings)+1;title=re.sub('<[^>]+>','',m[1]);headings.append((f'lesson-{i}',title));chapter=next((j for j,c in enumerate('一二三四五六七',1) if title.startswith('第'+c+'讲')),None);return f'<h2 id="lesson-{i}">{m[1]}</h2>'+(small_diagram(chapter) if chapter else '')
 article=re.sub(r'<h2>(.*?)</h2>',heading,article,flags=re.S)
 toc=''.join(f'<a href="#{id}">{html.escape(title)}</a>' for id,title in headings)
 inventory=json.loads((ROOT/'inventory-list.json').read_text())
 inv=''.join(f'<tr><td>{x.get("rank",i+1)}</td><td><a href="{html.escape(x["url"])}" target="_blank" rel="noopener">{html.escape(x["title"])}</a></td><td>{html.escape(x.get("type",""))}</td></tr>' for i,x in enumerate(inventory))
 gallery=''
 manifest=ROOT/'assets-manifest.json'
 image_items=json.loads(manifest.read_text()) if manifest.exists() else [dict(path='assets/'+name+'.png',title=title,url=SOURCES['one'][1],caption=caption) for name,title,caption in [('原图-预请求与正式请求','原文截图：预请求与正式请求','Soft先准备、Hard后最终文字确认。'),('原图-热词处理','原文截图：热词处理','热词在识别前或上行中注入，辅助把话听成字。'),('原图-预请求流程','原文截图：同次输入的多份准备','请求次序不是用户对话轮次。'),('原图-TTS合成与拉流','原文截图：合成、队列与端侧拉流','按采信来源读取音频队列，端侧实际播放另有进度。'),('原图-打断恢复分支','原文截图：打断后的恢复分支','判断原因、已播未播和最终拒识。'),('原图-恢复条件流程下','原文截图：恢复条件与重新组织','后续改造便签不能当作已上线事实。')] if (ROOT/'assets'/(name+'.png')).exists()]
 if image_items:
  for item in image_items:
   p=ROOT/item['path'];mime=mimetypes.guess_type(p)[0] or 'image/png';data=base64.b64encode(p.read_bytes()).decode();title=html.escape(item.get('title',p.name));caption=html.escape(item.get('caption',''));src=item.get('url','')
   gallery+=f'<figure><img loading="lazy" src="data:{mime};base64,{data}" alt="{title}"><figcaption><b>{title}</b><br>{caption}<br><a href="{html.escape(src)}" target="_blank" rel="noopener">查看飞书出处</a> · 点击图片查看原尺寸</figcaption></figure>'
 research=''
 for f,title in [('voice-inventory.md','入口、多音区、禁止交互与车外：全文研究'),('vad-research.md','VAD、二遍识别与预请求：全文研究'),('context-tts-research.md','上下文、Planner、TTS与恢复：全文研究')]:
  if (ROOT/f).exists():research+=f'<details><summary>{title}</summary><article>{render_md((ROOT/f).read_text())}</article></details>'
 lanes='<div class="lane" style="top:45px;height:610px"><span class="lane-name">车端 · 用户看得见、听得见的交互</span></div><div class="lane cloud" style="top:675px;height:595px"><span class="lane-name">云端／跨端协同 · 识别、理解与准备</span></div><div class="lane tools" style="top:1280px;height:580px"><span class="lane-name">下游执行与反馈 · 查询、车辆动作、回传和恢复</span></div>'
 cols=''.join(f'<div class="colhead" style="left:{42+i*440}px">{i+1:02d} · {s}</div>' for i,s in enumerate(['允许交互与听音','边听边准备','最终文字与确认','是否接话与端云','规划、工具和结果','声音播放与插话']))
 vselect='<label>场景 <select id="vad-choice"><option value="pause">没说完，继续说</option><option value="revise">二遍修正，旧准备失效</option><option value="same">文字相同，复用准备</option></select></label>'
 iselect='<label>分支 <select id="interrupt-choice"><option value="valid">有效新需求：重新组织</option><option value="reject">最终拒识：事件衔接</option><option value="no">单人直接打断：不恢复</option></select></label>'
 sources=''.join(f'<li><a target="_blank" rel="noopener" href="{u}">{t}</a></li>' for t,u in SOURCES.values())
 body=f'''<header><strong>豆包座舱语音 · 图文课堂</strong><nav><a href="#start">开始上课</a><a href="#map">完整画板</a><a href="#demos">动态演示</a><a href="#classroom">逐讲讲义</a><a href="#evidence">原图与证据</a></nav></header><main class="wrap"><section class="hero" id="start"><div class="eyebrow">产品培训 · 独立重新绘制版 · 2026-10-22</div><h1>从“听见你”，到“把事情办成”<br>把豆包座舱语音一站一站讲清楚</h1><p class="lede">我们用一次“去昨天那家游泳馆”的真实业务场景串起来：车怎么听、何时算说完、为什么先准备、谁决定做什么，以及你插话后，豆包应该停在哪里。</p><div class="tagrow"><span class="tag">中文解释先行 · 术语就近说明</span><span class="tag">{len(N)} 个可点节点 · 有条件的连线</span><span class="tag">3 组可暂停的逐步演示</span><span class="tag">按原文区分现状、方案与未确认</span></div><div class="callout">这份是原「豆包座舱语音闭环」的独立重新绘制版，保留七讲脉络，并补入新 OnePager 的两遍 ASR、Soft / Hard VAD、预请求、打轴与恢复。</div><div class="route"><a href="#map"><small>先找位置</small><b>完整业务大画板</b>点击节点，看输入、去向与原因</a><a href="#vad-demo"><small>最容易混淆</small><b>ASR 与 VAD 演示</b>停顿、继续说、定稿、复用</a><a href="#planner-demo"><small>把事情办成</small><b>规划与反馈闭环</b>先查、再确认、再执行</a><a href="#classroom"><small>像开会一样讲</small><b>七讲完整讲义</b>逐块解释，配例子和评审问题</a></div></section>
<section class="section" id="map"><div class="section-kicker">先看位置，再点开节点</div><h2>完整大画板：每条线，都有一个流转理由</h2><p>默认保留可读字号，向右、向下滚动看全图；默认只显示主线。点击任一节点，只显示它的进出分支和条件；画板下方随即展开这一站的详细讲解。想看某一段，可用下方定位。全图缩览只是找位置，讲解请放大阅读。</p><div class="board-controls"><button onclick="mainView()">回到主线</button><a class="download-link" href="{svg_name}" target="_blank" rel="noopener">打开独立 SVG 大画板 ↗</a><button onclick="setScale(scale-.1)">− 缩小</button><strong id="zoom-value"></strong><button onclick="setScale(scale+.1)">＋ 放大</button><button onclick="setScale(shell.clientWidth/2700);shell.scrollTo(0,0)">全图缩览</button><button onclick="focusPart(0)">听音入口</button><button onclick="focusPart(1)">ASR / VAD</button><button onclick="focusPart(3)">端云与拒识</button><button onclick="focusPart(4)">Planner</button><button onclick="focusPart(5)">TTS / 恢复</button><button onclick="document.getElementById('board-info').scrollIntoView({{behavior:'smooth',block:'center'}})">读节点讲解 ↓</button><input id="node-search" aria-label="搜索节点" placeholder="搜节点，如：二遍、打轴"></div><p class="small">浅蓝：车端交互；浅绿：云端／跨端协同；米色：下游与反馈。虚线：版本或实现归属需确认。泳道用于教学分层，流式拒识具体端云归属仍待确认。</p><p class="small" id="edge-mode"></p><div class="board-shell" id="board-shell"><div class="board-sized" id="board-sized"><div class="board" id="board">{lanes}{cols}</div></div></div><div class="board-info" id="board-info" aria-live="polite"></div></section>
<section class="section" id="demos"><div class="section-kicker">可以暂停，退回前一步看</div><h2>三个关键时刻，动起来看才不容易混</h2>{sim('vad-demo','① 听完整：短停顿先准备，最终文字再确认',vselect)}{sim('planner-demo','② 办事情：用户诉求 → 判断 → 工具 → 反馈 → 再判断')}{sim('interrupt-demo','③ 插话后：记录播到哪儿，先看原因再决定恢复',iselect)}</section>
<section class="section reading" id="classroom"><div class="section-kicker">按原有七讲展开 · 图文课堂正文</div><h2>我们从用户开口那一刻，顺着链路讲</h2><div class="toc">{toc}</div><article>{article}</article></section>
<section class="section" id="evidence"><div class="section-kicker">原图、事实范围与未确认项</div><h2>这堂课依据什么，哪些还不能当成事实</h2><div class="callout warn">已读原文的方案描述，不自动等于全部车型已上线。参数、开关与恢复策略，要对应车型和交付版本。下方研究保留了删除线旧规则、待评审内容与权限缺口，避免把不同年代的设计拼成一套“当前实现”。</div><h3>实际查看并取得的原文画板截图</h3><p class="small">以下是飞书页面中原画板的截图，不是原始可编辑文件。保留来源，点击放大阅读；长图按已查看区域分段。</p><div class="gallery">{gallery or '<p>图像清单尚未加入；请结合下方已核验文字来源阅读。</p>'}</div><h3>核心一手来源</h3><ul class="source-list">{sources}</ul><h3>正文与检索覆盖分开计算</h3><p>本研究线的广义检索扫描了 <b>19 页、365 条去重命中元数据</b>。这表示该关键词的命中清单已翻页，不表示读完飞书所有文档。搜索自动展开前 8 篇且截断，不能记作完整精读。7 篇入口与体验 PRD 已另行全文读取；技术线的逐篇阅读与缺口详见下方研究记录。</p><details><summary>查看本轮广义检索完整 365 条命中清单（含噪声，非全部已读）</summary><div class="inventory"><table><tbody>{inv}</tbody></table></div></details><h3>可追溯研究与未确认项</h3>{research}</section></main><footer>豆包座舱语音闭环 · 独立重新绘制版<br>教学动画不代表实车日志或实际耗时。原始来源保留版本与权限边界。</footer><div class="modal" id="image-modal"><button onclick="closeImage()">关闭原图 ×</button><img id="full-image" alt="原图放大查看"></div>'''
 page='<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>豆包座舱语音闭环 · 图文课堂版</title><style>'+CSS+'</style></head><body>'+body+'<script>'+JS.replace('__NODES__',json.dumps(N,ensure_ascii=False)).replace('__EDGES__',json.dumps(E,ensure_ascii=False)).replace('__SOURCES__',json.dumps(SOURCES,ensure_ascii=False))+'</script></body></html>'
 OUT.mkdir(parents=True,exist_ok=True)
 if version is None:
  nums=[int(m[1]) for p in OUT.parent.rglob('豆包座舱语音闭环-图文课堂版-v*.html') if (m:=re.search(r'-v(\d+)\.html$',p.name))];version=max(nums,default=0)+1
 target=OUT/f'豆包座舱语音闭环-图文课堂版-v{version:02d}.html'
 with target.open('x') as f:f.write(page)
 export_board_svg(OUT/svg_name)
 print(json.dumps({'path':str(target),'svg':str(OUT/svg_name),'nodes':len(N),'edges':len(E),'chapters':len(headings),'images':len(re.findall('<figure>',gallery)),'bytes':target.stat().st_size},ensure_ascii=False))

if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--version',type=int);args=p.parse_args();build(args.version)
