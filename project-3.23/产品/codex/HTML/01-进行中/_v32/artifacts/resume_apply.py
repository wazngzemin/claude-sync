import json,pathlib,shutil,datetime,copy,re,hashlib
ROOT=pathlib.Path('/Users/bytedance/Desktop/3.23/产品/codex/HTML/01-进行中')
PATH=ROOT/'豆包汽车-业务学习站-v31-工作副本.html'
s=PATH.read_text(encoding='utf-8'); start=s.index('const DATA=')+len('const DATA='); data,length=json.JSONDecoder().raw_decode(s[start:]); original=copy.deepcopy(data)
pages={p['id']:p for p in data['pages']}
M='https://bytedance.larkoffice.com/wiki/CbJVw4ACzilvvBkRxkqcQVfAnLh'
MEET='https://aka.doubaocdn.com/s/68EV2Q9r4X'
SYNC='https://bytedance.larkoffice.com/wiki/Aj7AwwY5hifYvRkWxsxcR9cGnKb?from=from_copylink'
VLM='https://bytedance.larkoffice.com/wiki/NuunwklpIiGS91kg7lRcAprqnMd?from=lark_search_qa&ccm_open_type=lark_search_qa#TvdtdyavUoaSltxkMcsc9mGCnvb'
changes=[]
def lesson(pid,lid): return next(x for x in pages[pid]['teaching']['lessons'] if x['id']==lid)
def setlesson(pid,lid,title,paras):
 l=lesson(pid,lid);l['title']=title;l['paragraphs']=paras;changes.append({'page':pid,'lesson':lid,'action':'rewrite','paragraphs':len(paras)})
def replace_para(pid,lid,needle,new):
 l=lesson(pid,lid);matches=[i for i,p in enumerate(l['paragraphs']) if needle in p]
 if len(matches)!=1: raise ValueError((pid,lid,needle,matches))
 old=l['paragraphs'][matches[0]];l['paragraphs'][matches[0]]=new
 # update exact duplicate wording elsewhere, including old sections and node text
 def walk(x):
  if isinstance(x,dict):return {k:walk(v) for k,v in x.items()}
  if isinstance(x,list):return [walk(v) for v in x]
  return new if x==old else x
 for key in ['base','readerEdition']:data[key]=walk(data[key])
 changes.append({'page':pid,'lesson':lid,'action':'paragraph','needle':needle})

kt=pages['K']['teaching']
pages['K']['summary']='先确认本轮能使用谁的资料，再区分最近历史输入、对话摘要、短期经历与长期记忆。人人对话补充输入来源，地点与座椅用途记忆还要经过各自的确认和执行链路。'
kt['intro']=[
 '主驾说「带我去昨天那家游泳馆附近的餐厅」。系统先要弄清昨天去了哪一家，才有位置可以查附近餐厅。如果主驾紧接着说「就去第二家」，需要的是刚才的候选列表；如果问的是昨天的经历，可能要查情景记忆；如果补一句「我不吃香菜」，则要保留这位乘客明确表达的偏好。三种信息都和过去有关，用途却不同，不能只用一个「记忆」概括。',
 '本章先讲说话人、账号和授权怎样决定可用数据，再讲历史输入、摘要和记忆服务分别提供什么。最近原话帮助接上当前对话；对话摘要帮助保住已经退出原话窗口的内容；短期和长期记忆用于保存、归纳和查询经历及事实。查到一条记忆以后，仍由 Director 结合当前需求决定下一步，记忆服务不会因为查到泳馆就自行开始导航。',
 f'11 月 4 日讨论把人人对话和事件补进历史输入，并扩大摘要处理的内容。这次改变的是输入范围及处理规则，不能凭名字把它讲成又增加一个数据库。PRD 在开关部分列出对话摘要、瞬时记忆、短期记忆、长期语义记忆和长期情景记忆，并把瞬时记忆标为当时未使用。下面按用途逐项解释，同时把旧 PRD、当天讨论与未验证的上线状态分开。[记忆系统 PRD]({M}) [11月4日文字记录]({MEET})'
]
setlesson('K','k-lesson-produce','历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题',[
 f'先从同一段用车经历看。乘客刚选过一家餐厅，下一句「就这家」需要能对回原来的选项；途中聊了很久，后来追问前面说过什么，就需要保住已经离开最近窗口的内容；第二天再问「昨天吃过的那家」，则需要能够跨对话查询的经历。历史输入、对话摘要和记忆服务分别承担这些不同需求，不能把它们画成必须逐级流过的五个存储站。[记忆系统 PRD]({M})',
 f'历史输入原来叫历史对话，指送给 Director 的近期原始交互记录。PRD 的旧口径是保留 5 轮人机对话，记录用户问什么和助手怎样回复。比如刚搜索出两家泳馆，用户说「第二家」，模型要拿到真实候选与选择关系，不能只看到「用户在找泳馆」这句概括。这里的 5 轮是该文档的窗口规则，不是长期记忆的保存期限。[记忆系统 PRD]({M})',
 f'人人对话指乘客之间的交谈。例如副驾对主驾说「今天想吃清淡一点」，当时未必是在向豆包下指令；后来主驾叫豆包找餐厅，这段话可能帮助理解口味。成为背景信息不等于成为执行授权，也不等于可以把副驾的偏好记到主驾名下。11 月 4 日讨论的方案保留最近 5 轮人机对话，再补入当前往前 5 次混合输入中的非人机部分，包括人人对话和事件。它既不是额外固定加 5 轮人人对话，也不是所有类型合计只留 5 条。[文字记录00:01:50至00:07:32]({MEET})',
 f'事件是另一种输入来源。用户点击一个视频、执行一次车控、某项任务返回结果，都可能形成一条带发生时间和来源的记录。当天讨论不再单独调用 DT 提示中的旧事件流变量，而把相关事件纳入历史输入。取消重复的提示入口，不等于取消事件采集和日志服务；哪些事件值得进入模型的近期背景，会上仍要求逐项评审。[文字记录00:04至00:16]({MEET})',
 f'对话摘要把较早的对话压成短文本。旧 PRD 规定从第 3 轮开始，每新增 1 轮对话压缩一次，本次用车周期内最多压缩 22 轮、最长 500 token，摘要拼在记忆变量的起始位置。token 是模型处理文本的计量单位，500 token 不能直接当作 500 个汉字。提前从第 3 轮处理，是给压缩留出时间，避免原话退出 Director 的 5 轮窗口时，摘要还没准备好。[记忆系统 PRD·增加对话摘要压缩]({M})',
 f'摘要保留的是与后续理解相关的内容，不能代替所有原始记录。比如原始列表明确第二家是某个地点，摘要只写「讨论了两个地点」，后面仍无法凭「第二家」正确选择。测试摘要既要看信息有没有保住，也要看人物、时间、否定和已完成动作有没有压错；不能因为文本更短就认为处理成功。PRD 增加摘要的背景明确写的是瞬时记忆当时不可用造成缺口，并不是要求摘要先写进瞬时记忆再转往下一层。[记忆系统 PRD]({M})',
 f'瞬时记忆是 PRD 使用的名称，开关一节明确标注「当前没用」。用户提到的「顺时」先与资料中的这个近音名称对照，但不据读音推导业务定义。当前可读 PRD 正文没有把「20 分钟或 20 轮事件日志」定义为瞬时记忆，不能继续把这个阈值写成该 PRD 的正式结论。它与历史输入、摘要的准确工程关系，需要结合对应版本的实现定义，不能把当时未使用的能力当成本轮已经在取用的来源。[记忆系统 PRD·记忆开关]({M})',
 f'短期记忆用来保留近期经历，长期情景记忆用来保存可回忆的经历片段；两者都与事件发生的场景有关。例如「昨天与家人去了某家泳馆」要保留人物、时间、地点和活动，才能在第二天查「昨天那家」。PRD 指出旧方案按固定轮数压缩、过于流水账和没有按用车人及场景隔离，都是待改问题。因此不能把短期记忆简单等同于模型本次收到的 context window，也不能把存有原始日志等同于已经生成了可召回的经历。[记忆系统 PRD·情景记忆生成优化]({M})',
 f'长期语义记忆保存能用于以后判断的事实、关系或明确偏好，例如某位乘客说自己的公司在哪里、不吃什么。它和「昨天去哪了」这样的情景经历不同：前者是这位用户的事实，后者保留发生在某次场景中的事件。PRD 要求保留信息是谁说的，例如别人介绍某位乘客的联系方式，不能抹掉来源后变成这位乘客亲口确认。由行为归纳偏好是另一路能力，PRD 所列情景记忆画像方案当时已实现但实际未使用，不能写成夜间必然自动生成习惯。[记忆系统 PRD·语义记忆生成优化及情景画像]({M})',
 f'11 月 4 日还讨论把摘要输入从人机问答扩大到人人对话和事件。会上对「一轮」的定义进行对齐，并要求核实旧摘要 22 轮上限与记忆侧 20 轮或 20 分钟的总结节奏是否会出现覆盖空档。这里仍有待研发核对项，不能把 20 轮、20 条和 20 分钟互相替换。当时口头反馈的一次摘要耗时约 1.7 至 1.8 秒，是处理耗时，不是 1.7B 模型规模，也不是正式性能承诺。[文字记录00:09至00:15]({MEET})'
])
setlesson('K','k-lesson-poi-sync','先确认要记的地点，再让导航使用同一份地址',[
 f'用户说「记下我家在麦当劳」，实际要求是保存一个以后可用的地点。不能只记下这几个字，就宣称下一次能够准确回家：同一个城市可能有多家麦当劳，另一个城市也可能同名。指定的《豆包记忆和车机记忆打通方案》要求完整 POI 名称和城市必选，并列出 POI ID、经纬度、地址等结构化字段。POI 指地图里的地点对象，名称是显示给人的名称，ID 是地点标识，二者不能互相混叫。[打通方案·导航相关记忆同步]({SYNC})',
 f'旧方法通过 FC 输出常用地址设置函数，把家、公司或常用地址存在导航应用内。打通方案转为通过豆包记忆保存这些内容，地图展示和快捷导航再使用这份数据。它解决的是个人记忆与地图各存一份、彼此不同步的问题；不能因此说地图不再有本地数据，后续离线方案恰恰需要把可使用的地址结构化同步到端上。[打通方案]({SYNC})',
 f'写入前谁负责补地点，文档保留了三条方案。第一条由 DT 先判断核心信息是否完整，缺少则先调用 POI 搜索，再存记忆；第二条让记忆工具内部去调用 POI 搜索；第三条由记忆工具返回缺项，DT 根据返回消息再搜索和写入。三条区别在谁发现缺项、谁调用搜索，目的都是先确定实际地点。11 月 4 日会中01:03:30收口采用了 DT 先判断、缺项先搜索确认再存的方向；文档仍并列展示历史方案，不能把三条写成同时执行，也不能据讨论方向宣称全部已上线。[打通方案]({SYNC}) [文字记录01:03:30]({MEET})',
 f'例如用户说公司在某个街道门牌，POI 搜索返回两个地点，DT 应让用户确认要保存哪一个，拿到确认后的城市和完整名称再调用记忆工具。搜索工具完成表示找到候选；用户选点表示确认一个对象；记忆写入成功才表示存下了这条地址。搜索结果、用户确认和写入回执要分别留在这一轮中，不能拿「已找到」替代「已记住」。[打通方案]({SYNC})',
 f'选点界面还存在实际体验问题。原导航卡可能在用户手点候选后继续算路，用户本来只是想保存地址，却进入导航流程。11 月 4 日讨论中，这正是语音选点和手点是否同等支持的争议；不能简单写成「语音说第三个或手点都可以，选完就存」。验收必须分别看语音确认、手动点击以及用户转去闲聊三条路径，确认选点结果能返回本次保存流程，不会擅自把保存意图改成出发。[文字记录01:04至01:13]({MEET})',
 f'后续用户说「导航回家」，先取当前可使用的这位用户的家地址。文档给出的改写格式是「导航去{{城市名}}{{完整POI名称}}，直接开始导航」，再调用 Navi 导航工具。城市不能省略，否则去外地时，同名地点可能匹配到当前位置附近。无需二次选点是方案目标，仍要用跨城同名地点、多个家庭成员和记忆修改后的数据验证，不能用一次成功演示当全场景保证。[打通方案·用户后续消费需求]({SYNC})',
 f'文档没有把 POI ID 标成必选，也没有写禁止保存 ID。会中有人认为完整名称可以强匹配，有人担忧跨城同名和地图变化。这意味着应分别核对记忆存什么、导航输入接受什么、下游如何精确定位。不能把「名称目前能用」改写成「不用ID」，也不能把一个图商的地点 ID 当作跨图商永久通用标识。[打通方案]({SYNC}) [文字记录00:58至01:03]({MEET})',
 f'地图端的设置入口和显示入口是不同改动。指定文档划掉了原手动填写或修改家、公司的方案，保留显示位置、已有位置时点击导航，并写点击事件模拟「导航回家」请求。模拟请求是在用户点击后生成一条等价的业务输入，不需要用户真的再说一遍，也不用重新走语音识别。是否已完成车企端改造，仍需对应版本的交付证据。[打通方案·待定项及手动点击]({SYNC})',
 f'离线消费是11月4日讨论的另一条路线：联网时把授权范围内的个人地址转成端侧结构化映射，包含身份与家、公司等地点；断网后按当前身份选取已有地址，多人对应多个家时再澄清。这不等于断网时能够新增、修改云端记忆。同步时间、更新失败、删除后本地副本清理和身份无法确认时的行为，都要成为落地规则，不能只写「同步一份就能离线回家」。[文字记录01:28至01:35]({MEET})',
 f'记忆开关关闭时，用户要求保存家或公司，指定文档要求先提示打开记忆开关。会中早段曾讨论让地址例外保存，但后段01:35:46收口仍为统一受开关限制。不能把早段提议改写成关闭后也记录，更不能把会议中的合规意见当成已核验法律条款。这里使用产品已写明的授权与开关规则。[打通方案]({SYNC}) [文字记录01:35:46]({MEET})'
])
setlesson('K','k-lesson-seat-mem','车机保存物理位置，豆包记住这个位置的用途',[
 f'「把座椅存到坐姿2」和「这个姿势是我午休用的」提供了不同信息。前一句把当前物理位置保存到一个槽位；后一句把槽位与用户说出的用途联系起来。指定打通方案写明豆包只记位置 ID，不记座椅、方向盘、后视镜的具体位置数据，物理数据留在车机本地账号体系，动作通过车企提供的原子接口完成。[打通方案·驾驶相关记忆同步]({SYNC})',
 f'文档给出了保存到指定位置、保存当前位置、位置改名、调整到指定位置四类接口。用户调好座椅后说「帮我把这个位置保存，这是我的驾驶位置」，先经车控保存当前位置，同时获取当前位置 ID；保存结果及这个 ID 回来以后，才把「这个人的驾驶位置对应坐姿1」存入记忆。当前位置 ID 来自车企保存或位置接口，不能写成记忆工具自行读取座椅当前位置。[打通方案·用户场景1]({SYNC})',
 f'后续用户说「调到我的驾驶位置」，DT 先查用途对应的槽位，再把请求改写为「把座椅位置调整成坐姿1」，调用位置调整接口。查到映射不表示座椅已经移动；调用被受理不表示已到位，仍要等车控返回实际结果，并遵守本车当前状态与安全限制。缺少映射时，可以澄清是哪个已保存位置，不能凭「午休」猜一组物理坐标。[打通方案]({SYNC})',
 f'用户仅手动按保存，没有说用途，车机照常保存物理槽位，不必每次主动追问「这个位置是干什么的」。11 月 4 日会中明确担心这种反复问话打扰用户；指定文档也划掉了手动保存后模拟请求写豆包记忆的旧场景。以后用户说「坐姿2是我的午休位置」时，才有证据建立用途映射。按了一次保存不能被自动归纳成长期偏好。[文字记录01:42至01:45]({MEET}) [打通方案]({SYNC})',
 f'方向盘和后视镜要按日期看。文档保留的10月21日背景说二者没有账号绑定记忆；11月3日补充却说可与座椅位置配套，并列出驾驶位打包保存的暂定方案。两段不能同时作为当前现状。讲本次方向时以较新的配套说明为依据，保留尚待最终方案同步的状态，不把旧背景当作永远不支持。[打通方案·沟通记录及驾驶能力]({SYNC})',
 f'11 月 4 日讨论自由语义用途记忆时，对离线支持保持限制。这限制的是断网后能否完成「我午休的位置」这类语义查询与记忆闭环，不等于车端位置1、2、3的物理保存不能离线。两套能力需要分别验收：本地槽位保存和调整、联网记忆写入、用途查询、身份切换后的映射使用。不能用「离线DT推理不了语义」这种没有模型评测支持的解释替代当前项目的能力边界。[文字记录01:46至01:47]({MEET})'
])
kt['guides']['base']['paragraphs'][3]=f'生产与取回要分开看：原始输入可以供当前对话使用；较早内容由摘要保持连续性；记忆服务保存并组织近期或跨对话的经历和事实。PRD 列出的各记忆类型并非五个串行数据库，瞬时记忆在该稿标为未使用。11 月 4 日新增人人对话和事件的范围、计数及覆盖衔接，应按本章对应说明核对，不从图的箭头反推已上线顺序。[记忆系统 PRD]({M})'
kt['guides']['base']['paragraphs'][5]=f'地点支路先确认城市和完整 POI 名称，再保存和消费；名称能匹配不代表已经排除同名或无需 ID。座椅支路先由车机保存物理位置并返回位置 ID，用户表达用途时再存个人用途映射。新接口和端侧同步是打通方案，实际可用范围需按车辆版本验证。[打通方案]({SYNC})'
replace_para('C','c-lesson-2','记忆不是一口大锅',f'这一轮背景需要分清原话、摘要和可查询的记忆。历史输入保留最近的真实交互；摘要把较早内容压成短文本，减少原话窗口退出后的断层；短期与长期情景记忆保留经历，长期语义记忆保留事实、关系和偏好。PRD 另列瞬时记忆但标为当时未使用，没有把20分钟或20轮定义成它的正式阈值。11月4日扩充的是人人对话和事件的输入范围，不能因此新增一层存储。召回先推相关标签，再在标签内检索和排序；PRD 示例仍使用向量与关键词混合检索，不能误说标签方案已经完全替代向量检索。[记忆系统 PRD]({M}) [11月4日文字记录]({MEET})')
replace_para('C','c-current-snapshot','事件流窗口暂定',f'过去的动作由 C5（接最近对话工具事实和摘要）承接，和此刻车况分开放。刚才查到两家泳馆，用户说「第二家」，需要真实候选关系；一句「讨论了泳馆」的摘要不够。旧事件上报资料曾写10分钟内最多30条的独立窗口，11月4日讨论把近期非人机事件并入历史输入、不再单独调旧事件流变量。这里要按版本辨认背景入口，不把两套窗口都写成当前必经步骤。[11月4日文字记录00:04至00:07]({MEET})')
replace_para('C','c-lesson-4','最近对话层存最近5轮',f'旧PRD保留最近5轮人机交互，11月4日讨论补入近期5次混合输入中的非人机内容，并扩大摘要的输入范围。摘要处理与记忆生成的覆盖衔接仍需核对，不能把历史输入、摘要、短期和长期讲成自动按次序搬运的固定流水线。输入管理还要保留已交付内容和工具实际结果，播放器另记说到哪里，下一轮才既接得上目标，也不会误认用户已经听到全部回答。[记忆系统 PRD]({M}) [11月4日文字记录]({MEET})')

# F separates capability interface concerns from model route explanation.
pages['F']['teaching']['intro']=[
 '用户说「播放我喜欢的歌」，Director即使理解了意思，也要知道这辆车接了哪家音乐服务、是否支持搜索和播放、当前账号有没有权限。一份工具定义只说明如何请求某项能力，真正接入的业务实现、当前可用范围和执行回执还要分别确认。否则模型看似计划完整，下一步却找不到可以办事的服务。',
 '能力准入负责让推理拿到当前项目可使用的工具定义；Agent协议负责把一次调用交给执行方，把内容、结果和异常带回主链。端云结果由谁采信，见入口与端云采信章；本章不会再给同一句话定义第二套本地优先规则。先看当前工具与车型、渠道、账号的关系，再看调用和回流，才能分清“模型没有选对工具”和“选对了但业务不支持”。',
 f'1.7B、30B描述模型规模，FC和DT描述处理任务，AIbox描述车上的算力设备。它们不是同一维度的名称。下面先把小语言模型、30B视觉任务、Edge_DT离线文本任务与云端Director的职责分清，再回到工具协议。同一个算力设备可以承接不同任务，不能见到30B就认定只能处理图像，也不能看到DT名字就认为云端全套能力已经复制到车端。[VLM输入输出定义V1.3]({VLM})'
]
lf=lesson('F','f-lesson-available')
lf['paragraphs'][1]='正常联网、本地规则命中、云端超时和断网，应按R章对应车型及版本的采信规则选结果。早期白名单本地优先和9月30日确定性缓存独立优先不是同一口径。本章判断工具能否在本项目调用，不再把“FC生成一个候选”写成它必然优先执行。生成参数、获得执行权、车辆完成动作是三个不同进度。'
lf['paragraphs'][3]='用户说的「1.7B FC模型」，可以拆成模型规模和任务：B表示十亿参数，1.7B约为17亿参数；FC是Function Calling，即把自然语言转换为约定的函数名和参数。例如「开副驾座椅加热两档」需要产出设备、座位、动作和档位，由执行接口处理。FC不是语音转文字，也不是直接操纵电机；模型可以生成调用，车辆是否有配置、状态是否允许、调用是否成功，仍由业务校验和回执说明。具体1.7B部署按R章已列的车企和硬件资料区分，不能说所有车型同一位置、同一版本。'
lf['paragraphs'][5]=f'Edge_DT现在有可读的任务定义。V1.3任务表写它是CDC输入的一次性任务，输入为FSP、DSP、DUP三部分文本提示，输出文本，经TOPIC_DT返回；时间预估列写Prefill 1300ms、Decode 25token/s。Prefill指处理输入文本，Decode指逐步生成输出，这两个数不能相加成固定总时延，也不代表用户听到首音的实测成绩。表中引用的完整业务方案标题明确是「Edge - DT：AI Box 30B MoE 离线语音增强」。因此可确认这是AIbox上面向离线语音业务的文本任务，并非只能看图的任务。[VLM输入输出定义V1.3·Edge_DT行]({VLM})'
lf['paragraphs'][6]=f'这里要把三个层次分开：ASR先把声音识别成文字；Edge_DT拿到文本提示做本地处理；回复怎样播出、动作怎样适配车控、哪些结果能优先采信，是另外的工程和业务链路。任务表引用了30B MoE方案，但不证明每条视觉任务与Edge_DT必然共用同一权重，也不证明云端Director的联网检索和多工具能力都能离线运行。完整Edge_DT业务方案本轮没有查看权限，FSP/DSP/DUP内部内容、调用范围和落地车型不能仅凭缩写反推；当前讲清任务表已明确的输入输出，保留完整方案边界。[VLM输入输出定义V1.3]({VLM})'
pages['F']['teaching']['guides']['base']['paragraphs'][1]=f'模型规模、任务和部署设备分三件事看。R章按原文分开说明1.4B与1.7B的项目配置；30B MoE视觉任务和Edge_DT文本任务见V1.3及模型规划。Edge_DT已有CDC文本输入、文本输出和时间预估，不能再写成只找到名字；同样不能从一个表格条目推出量产全能力已交付。[VLM输入输出定义V1.3]({VLM})'
pages['F']['teaching']['guides']['base']['paragraphs'][2]='结果采信统一以R章的车型与版本规则解释，本章只继续看当前工具的准入和协议。定义了某项能力、模型生成了参数、业务执行成功，要分别有证据，不以先返回的候选决定车辆已经动作。'
replace_para('F','f-lesson-dynamic','如果当前没注册人脸','人脸注册工具帮助建立身份，不应因为尚未注册人脸就笼统判定注册工具不可用。要核对的是本车有无注册能力、当前流程是否允许以及是否取得对应授权。记忆读写则依赖它自己的账号、身份和开关规则：开关关闭时先请求授权或提示开启，不能因工具在列表里就绕过这些条件。')
replace_para('F','f-lesson-stream','给用户看的 talk_content' if False else 'Director 的输出有四个字段','Director输出里的talk_content用于组织回复文字，action_list描述本轮计划调用的动作。下游Agent返回的业务数据和实际结果，是执行反馈；它们不是action_list的另一种叫法。模型计划、调用受理、实际执行以及再次判断要按同一次调用关联。字段集合和具体格式按当前项目协议核对，不能把输出动作列表当成已经完成的工具反馈。')
pages['F']['teaching']['guides']['base']['paragraphs'][5]='流式返回先分内容归属：Director的talk_content是计划对用户说的文字，action_list是计划动作；下游返回的查询内容和执行回执供后续判断。流结束只说明这次传输完成，不能直接替代业务结果，也不能拿准备发出的动作当作已经发生的事实。'

# R: replace inaccurate claim that only the Edge_DT task name could be read.
replace_para('R','r-arb','「30B」出现在不同语境',f'30B要同时对照模型规划和业务任务。模型规划把30B MoE视觉模型列在AIbox上；V1.3的Edge_DT行则明确CDC提供文本提示、模型输出文本，并引用「AI Box 30B MoE 离线语音增强」方案。这说明端侧除了看图，也有面向离线语音业务的文本处理任务，不能再说只核到一个名字。至于它能否承担本例的历史记忆检索和实时餐厅搜索，任务表没有给出全量能力范围，不能按30B更大就推定全部支持。[模型规划](https://bytedance.larkoffice.com/wiki/EAPzwycYZiNzagkeTgochxBHnwh?from=lark_search_qa&ccm_open_type=lark_search_qa#JJpqd1Ayio5buSxdWxDcY89Cneh) [VLM输入输出定义V1.3]({VLM})')
replace_para('R','r-arb','别把算力盒上那路离线语音增强',f'云端Director在10月22日宣讲中也称Planner或对话推理引擎，是该主链的理解、规划和工具调度模块。Edge_DT属于AIbox上的本地文本任务；两者部署和服务范围不同，不能因都做文本推理就认为拥有同一套联网工具、历史输入和任务能力。小模型生成函数调用、Edge_DT的本地文本处理和云端Director，应分别问输入是什么、能调用哪些业务、结果由哪层采信，而不能只用参数量排成优先级。[10月22日宣讲](https://bytedance.larkoffice.com/docx/SqLNdeh4Zo84ScxL7iIcn7hgnXg) [V1.3任务表]({VLM})')
# remove two irrelevant visual additions from interruption chapter
for lid,needle in [('i-lesson-arrival','插话交接还带一条会上暴露'),('i-lesson-resume','恢复旧播报时，视觉那一帧')]:
 l=lesson('I',lid);l['paragraphs']=[p for p in l['paragraphs'] if not p.startswith(needle)];changes.append({'page':'I','lesson':lid,'action':'remove unrelated visual paragraph'})
replace_para('T','t-goal-run-feedback-detail','记忆写入任务要区分位置类和身体类','一轮运行如果同时涉及记忆写入，要把两个结果分别记回：任务动作已经执行，不表示记忆已经写入；记忆写入失败，也不能抹掉车辆动作已完成的事实。导航地址与座椅用途的确认和保存规则见K章，本章继续处理原任务这次运行的结果和后续状态。')
# SE repeated memory conflations
oldnew={
 '「瞬时记忆」是另一个具体概念：截取 20 分钟或 20 条事件日志的聚合，当前暂未实际使用。它和短期记忆有重叠，但不是同一个东西——短期记忆是 context window 里的滚动内容，瞬时记忆是对一段时间事件日志的压缩。':f'历史输入供模型接上当前交互，对话摘要压缩较早内容，记忆服务另管经历与事实。PRD把瞬时记忆列为当时未使用，没有在可读正文中给它定义20分钟或20条阈值。短期记忆不能直接等同context window，自进化也不是把全部历史逐层搬到长期库。各类信息的用途与版本，见K章。[记忆系统 PRD]({M})',
 '瞬时记忆是截取 20 分钟或 20 条事件日志的聚合，当前暂未实际使用。':f'瞬时记忆在已读PRD标为当时未使用，具体阈值不能从其他事件窗口反推；本次用户口头教法能否留下，仍要检查是否实际保存、后续检索并加载。[记忆系统 PRD]({M})',
 '记忆分三层：长期记忆存偏好属性，短期记忆存当前对话上下文，瞬时记忆是 20 分钟或 20 条事件聚合（当前暂未实际使用）。':f'自进化使用的用户教法、场景知识和个人记忆要按用途分开；历史输入与摘要支持当前连续理解，记忆服务保存可查询的事实和经历。不能把短期等同当前上下文，或把一个20分钟事件窗口当作瞬时记忆定义。完整关系见K章。[记忆系统 PRD]({M})'
}
def rewrite(x):
 if isinstance(x,dict):return {k:rewrite(v) for k,v in x.items()}
 if isinstance(x,list):return [rewrite(v) for v in x]
 return oldnew.get(x,x) if isinstance(x,str) else x
data=rewrite(data);pages={p['id']:p for p in data['pages']}
# Preserve legacy section IDs, update by semantic ID or explicit legacy mapping.
legacy={'V':{'v-listen':'V-L1','v-text':'V-L2','v-pause':'V-L3','v-handoff':'V-L4'},'R':{'r-entry':'r-activation','r-select':'r-reject','r-fallback':'r-arb','r-cloud':'r-channel'},'M':{'m-lesson-1':'m-types','m-lesson-2':'m-interrupt','m-lesson-3':'m-identity','m-lesson-4':'m-playback'},'D':{'d-lesson-1':'d-intake','d-lesson-2':'d-plan','d-lesson-3':'d-talk','d-lesson-4':'d-feedback'}}
for p in data['pages']:
 ls={x['id']:x for x in p.get('teaching',{}).get('lessons',[])}; covered=set()
 for sec in p.get('sections',[]):
  target=sec.get('teachingTarget')
  if target not in ls:target=sec['id'] if sec['id'] in ls else legacy.get(p['id'],{}).get(sec['id'])
  if target not in ls:raise ValueError(('unmapped section',p['id'],sec['id'],target))
  l=ls[target];sec['title']=l['title'];sec['paragraphs']=copy.deepcopy(l['paragraphs']);sec['teachingTarget']=target
  sec['sourceIds']=copy.deepcopy(l.get('sourceIds',sec.get('sourceIds',[])));covered.add(target)
 for lid,l in ls.items():
  if lid not in covered:p['sections'].append({'id':lid,'title':l['title'],'paragraphs':copy.deepcopy(l['paragraphs']),'teachingTarget':lid,'sourceIds':copy.deepcopy(l.get('sourceIds',[]))})
known={x['id'] for x in data['sources']}|{x['id'] for x in data['base'].get('sources',[])}
removed=[]
def cleanrefs(x,path='DATA'):
 if isinstance(x,dict):
  for k,v in x.items():
   if k=='sourceIds' and isinstance(v,list):
    bad=[z for z in v if z not in known]
    if bad:removed.append({'path':path,'ids':bad})
    x[k]=list(dict.fromkeys(z for z in v if z in known))
   else:cleanrefs(v,path+'.'+k)
 elif isinstance(x,list):
  for a,v in enumerate(x):cleanrefs(v,path+f'[{a}]')
cleanrefs(data)
# Register directly read VLM and user wiki if absent (canonical returned URLs retained).
for sid,title,url in [('RESUME-VLM-DEFINITION','端侧VLM模型能力与输入输出定义 V1.3（全文核读）',VLM),('RESUME-MEMORY-INTEGRATION','豆包记忆和车机记忆打通方案（用户指定）',SYNC),('RESUME-MEMORY-PRD','记忆系统 PRD',M),('RESUME-MEETING-RAW','11月4日车机AI专项讨论会用户提供文字记录',MEET)]:
 if sid not in known:data['sources'].append({'id':sid,'title':title,'url':url});known.add(sid)
for pid,ids in {'K':['RESUME-MEMORY-PRD','RESUME-MEMORY-INTEGRATION','RESUME-MEETING-RAW'],'C':['RESUME-MEMORY-PRD','RESUME-MEETING-RAW'],'F':['RESUME-VLM-DEFINITION'],'R':['RESUME-VLM-DEFINITION']}.items():
 pages[pid]['sourceIds']=list(dict.fromkeys(pages[pid].get('sourceIds',[])+ids))
# Freeze data-only changes; maintain exact diagram payloads and all JS/CSS.
for key in ['originalSvg','overviewSvg','diagrams']:assert data[key]==original[key]
data['meta']['version']='v32-evidence-corrected';data['meta']['validation']='模型任务表、记忆PRD及打通方案正文已核读；本轮修改后页面和独立内容复验中。'
data['meta']['refinement']='在原工作副本修订记忆关系、地点/座椅链路、Edge_DT及准入口径；保留原图与历史锚点，按ID同步旧正文。'
backup=PATH.with_name(PATH.name+'.bak-resume-verified-'+datetime.datetime.now().strftime('%Y%m%d%H%M%S'));shutil.copy2(PATH,backup)
new=s[:start]+json.dumps(data,ensure_ascii=False,separators=(',',':'))+s[start+length:]
# protect raw-text script terminator in inline data
assert '</script>' not in new[start:start+len(json.dumps(data,ensure_ascii=False,separators=(',',':')))]
PATH.write_text(new,encoding='utf-8')
report={'backup':str(backup),'target':str(PATH),'changes':changes,'removedUnknownRefs':removed,'beforeBytes':len(s.encode()),'afterBytes':len(new.encode()),'svgUnchanged':True}
(ROOT/'_v32/artifacts/resume_change_record.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(report,ensure_ascii=False,indent=2))
