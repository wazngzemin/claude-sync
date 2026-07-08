座舱Planner OnePage
背景介绍

一、传统车载座舱架构特点
优势：聚焦核心场景可靠性，(1) 响应效率高，预设任务链路简洁，实现毫秒级反馈；(2) 任务准确性优，高频功能（导航、媒体控制等）通过固化逻辑精准执行；(3) 交互可控性强，预设剧本多轮对话稳定，成熟场景极少出错。
局限：随智能化需求升级凸显瓶颈，成为体验提升障碍。

二、传统架构核心缺陷
模块协同性不足：各模块独立闭环，缺乏全局信息共享，跨域任务（如“带我去兜风”涉及多个模块协同,传统架构无法实现）衔接差或报错。
场景感知能力薄弱：未集成用户记忆（历史偏好）与实时环境（车内状态、路况），无法自适应智能交互。
成本与泛化瓶颈：长尾场景需单独定制逻辑，研发成本高、周期长，系统泛化能力有限。

三、引入RAG-multi-agent架构
为解决上述问题并保留传统效率优势，参考现存的各家多agent架构，提出“句法RAG+情景RAG+简单/复杂Planner+agents”的混合方案。句法RAG作为前置模块，可配置，可平台化；引入planner模型作为系统“大脑”，配合情景RAG的知识注入，引导planner模型整合全局状态信息（情景信息、用户记忆、环境信息），减少大模型的任务拆解不稳定问题。前期planner模型作为teacher，引导收集数据回流至句法RAG模块，中后期使用RAG模块积累的数据，训练planner，完成系统闭环。

核心思想：
句法RAG确保系统稳定，高效，planner模型+情景RAG 确保复杂case的拆解，灵活，智能。
句法RAG车厂可配置，帮助我们回流宝贵链路数据。
体验地址 - 目前最新 planner_release 0.0.15（需向文档作者申请空间权限）：https://fornax.bytedance.net/space/7545036775916322817/prompt/develop/7590052514306457602
Planner能力定位
作为多agent系统的中枢大脑角色，统筹规划调度系统的各个子agent：
句法RAG引擎匹配指令，将简单指令直接通过工程解析下发结果，提升系统响应速度。
planner+情景RAG主要负责模糊任务，复杂任务的规划，提升用户疑难case的体验。
Planner设计原则
边界明了，能力清晰：planner能力边界应简单清晰，且与下游agent能力不存在冲突及重复，确保planner与agent之间的迭代可独立进行，保障高效训练，此外planner与下游agent数据流可串联，组成完整的系统数据流，确保数据面向未来可复用。
数据可闭环：当前基于语言模型的中枢agent方案大概率不是最终的AGI方案，为了后续基于新技术的端到端架构，当前设计的句法RAG数据格式应整合完整的环境感知信息及多模态信息构成的完整的数据流，方便后续模型的升级迭代。
可拓展：合理的中枢planner+多agent架构应具备可拓展性，易于拓展更多的子agent能力，承接更多的业务。
整体架构

能力

说明

多智能体架构

包括句法RAG、情景RAG、简单任务Planner、复杂任务Planner、agents等多个重要角色。

特殊工具建设

planner特有的特殊工具，如：plan describe，search memory，search env status，plan update，形成planner特殊工具调用的底层能力，加强思考，环境感知，记忆感知，任务管理等能力。

下游agent建设

表示planner层面可感知到的agent粒度，确保agent能力边界清晰，可插拔，可调度。

自动任务规划（Auto-planning）

当前暂不考虑：自动工具生成工厂，自动生成prompt并打包成可调度的Agent

情景RAG（knowHow filter）

建设知识库，为planner规划提供规范流程知识，指导planner进行任务拆解和任务管理。

上下文管理（Context manager）

包括上下文压缩，选择，总结，隔离；Agent上下文同步等。（兄弟组负责，属于planner依赖项）
模型选型
主观评测下来，doubao-1.8效果明显好于kimi-k2；由于seed-1.8 force发布时间为12.18，因此s07暂时使用kimi，加入闲聊功能后，kimi会有一些稳定性问题；12.18 即 s08 第一周切换doubao-1.8模型。后续所有迭代训练任务均在doubao家族模型上进行。
架构图
引用：planner架构思考
句法RAG以及情景RAG设计方案
句法匹配引擎&情景匹配引擎(WIP)

结合架构图的 QA List：
Q：核心思路：
A：整体这套框架的核心设计思路有三个，(1) 层层过滤，能通过简单方法搞定的不要漏到后面复杂模型去处理，(2) 在不同阶段选择合适的节点注入知识，注入的方式也是从简单（固定）到复杂（泛化），保证整套系统的流畅和稳定；(3) 通过用户数据回流逐步把后面复杂任务的处理推到前面知识注入环节。
Q：句法RAG的定位？
A：可以分成几个阶段，如果是最简单的应用是只支持单轮，后面如果加入scenario和condition可以支持多轮进入，和embedding原理一样。这个有三个作用：
1）项目初期可以快速把功能放上去，并且保证稳定性；
2）针对重点功能，比如某些新车强调零重力座椅，可以保证任何情况下都是稳定响应；
3）后期减少维护成本，这个是可以开放给客户自己去配置和运营，如果新功能呢，赶不上我们发版，客户也可以快速自行配置；
句法rag配置示例：

Q：情景rag职责定位？是否理解为是目前广泛使用的agent系统rag知识注入方案？
A：注入可以是多种形式，知识图谱，描述，few shot，甚至SFT都可以，形式不重要。前期简单做可以先做好few shot的聚合。

Q：planner模型的定位
A：用于处理复杂任务或者通用任务，这个有两个定位，一个是针对前面全部被漏过了，可以兜底，一个是可以认为是一个云端的teacher，不断对用户数据进行check和迭代，逐步增强面前处理模块的能力。

总结：
系统核心：漏斗原则各层级分工明确确保稳定，车厂可配置，数据可闭环。
原因是实际基于语音或者多模的交互和manus之类基于文字的交互其用户体验关键点是不同的，基于语音和多模的交互，流畅性和稳定性才是第一要素，当前的大模型技术水平达不到能兼顾速度和对复杂任务的处理，所以这是一个过渡方案，如果后面模型能力提升起来了，把漏斗的下层提到前面去就行了，这个可以根据技术发展逐步推进，而且工作量非常小，是一个可以持续演进的架构。
image.png

交互时序图
image.png

两种RAG详细介绍
两种RAG类型
详细说明：

触发条件

适用规则

使用范围

举例

问题点

备注

句法RAG

用户query匹配

明确的单轮query匹配
（不支持上下文的多轮匹配；不支持情景描述；不支持记忆信息；不支持车机状态）

拒识

输入：妈妈帮我拿一下水杯 -> 拒识
句法RAG输出：
{
"type": "directExecute",
"reject_ornot":"reject",
"talk_content":"",
"task_list": []
}

车书

输入：空调怎么开 -> 调用车书agent
句法RAG输出：
{
"type": "directExecute",
"reject_ornot":"react",
"talk_content":"",
"task_list": [{"task_id":"1","task_content":"用户原query",
"tool_name":"vehicle_manual_qa"}]
}

音乐搜播

输入：播放xxx的歌 -> 调用音乐agent
输入：搜索xxx的音乐 -> 调用音乐agent

有上文的多轮case：“换一个”，如何匹配成功，应该交由系统中的哪部分处理

音色演绎

输入：扮演xx跟我说话 -> 调用s2s 闲聊agent
输入：讲个笑话 -> 调用s2s 闲聊agent

有上文的多轮case：“再来一个”，如何匹配成功，应该交由系统中的哪部分处理

出行规划

输入：做一个北京的行程规划 -> 调用出行agent

简单车控

打开车窗 -> 调用sft-fc模型

情景RAG

用户query匹配

模糊的单轮query，类似于给模型注入知识，辅助模型拆解任务，具体拆解还是看模型自己的输出，类似于使用rag匹配注入few shot

复杂车控

输入：我好热
{
"type": "modelExecute",
"knowledge": "见下面示例",
"agentLimit": ["vehicle_basic_control"]
}

knowledge示例:
输入记忆：xx不能吹空调；
输入情景：空调打开状态温度设为27度
情景rag输出：
【常规拆解】：vehicle_basic_control（打开空调设为二十三度）+ vehicle_basic_control（打开座椅通风）。 
【有记忆的拆解】：用户不能吹空调，因此拆解 vehicle_basic_control（打开座椅通风）+ vehicle_basic_control（打开车窗）。
【有情景的拆解】：情景描述中若空调已经打开，拆解为 vehicle_basic_control（空调调到22度）

感觉很难支持次轮需要继承指代的query

各任务的模块划分：

类别

细分类别

举例

负责模块

备注

简单车控

导航剧本

导航去xx，第一个，开始

简单任务planner，下游sft fc承接

简单车控多轮

打开车窗，关了吧

简单任务planner，下游sft fc承接

简单多媒体

播放xxx的歌，换一首

特殊，产品梳理方案由yifang承接，sft fc未承接

播放，暂停，继续

Sft fc承接，简单复杂模型未承接，暂时planner做分发

后续由简单任务planner负责

其他的简单意图

车书

座椅通风怎么调
后视镜调节在哪

句法RAG匹配，直接下发agent执行及播报

音色演绎

扮演xx跟我说话
讲个笑话

句法RAG匹配，直接下发agent执行及播报

出行规划

做一个故宫的行程规划

句法RAG匹配，直接下发agent执行及播报

GUI agent

用小红书给我做个xxx
帮我交一下停车费
帮我买个麦当劳巨无霸套餐

句法RAG匹配，直接下发agent执行及播报

风险，该类agent特殊，有与用户的交互流程，与planner配合是个问题，状态管理负责流程控制会好一些

查天气

查一下北京的天气

句法RAG匹配，直接下发agent执行及播报

看agent有没有这个能力，没有的话，planner处理

查车机状态

座椅加热现在几档，空调开没开

复杂任务planner模型做，需要查端状态信息，或根据sp的状态信息直接回复

句法RAG承接一部分，直接调用s2s回复，漏进模型的由planner自行处理

查记忆

我昨天听得什么歌

复杂任务planner模型做，需要查端状态信息，或根据sp的状态信息直接回复

句法RAG承接一部分，直接调用s2s回复，漏进模型的由planner自行处理

视觉查询

前面是什么车，它旁边的楼是什么公司

需要确定视觉agent能力范围，agent若能自己回答，可以由句法RAG做

闲聊（开放域闲聊）

你叫啥，我帅吗，你认识xxx吗

复杂任务planner模型做，看模型发挥情况

开放域较为特殊，前期demo阶段还好，后期planner吃闲聊有一定的风险

复杂意图

复合意图（单句多意图，任务间无依赖关系）

打开车窗再给我查下外面多少度

情景RAG+复杂任务planner模型做，需要结合情景，端状态，记忆才能完成任务拆解

车控模糊意图

好热啊

情景RAG+复杂任务planner模型做，需要结合情景，端状态，记忆才能完成任务拆解

其他模糊意图（调用除车控外其他的agent才能完成，agent之间有依赖关系）

带我兜个风

情景RAG+复杂任务planner模型做，需要结合情景，端状态，记忆才能完成任务拆解

advisor主动服务

-

advisor：明骏上车了，他今天戴了个大墨镜，可以吐槽下他装帅，另外车里很热，可以打开座椅通风和强劲制冷几分钟后再关掉

复杂任务planner模型做，看模型发挥情况

对advior要求较高，输出的内容越清晰合理，planner模型表现越好，需要多试
Planner tools & agents设计
Tools design
(1) Plan describe
主要用于调度agent前的思考，好的think tool可以让模型输出的调度流程更精细，更准确，更高效。

{
  "name": "plan_describe",
  "description": "描述展示功能，用于将planner制定的计划方案以清晰、易懂的方式展示给用户。系统会将规划逻辑转化为用户友好的语言描述，包含计划步骤、调用那些agent、调用agent或function工具的原因，帮助用户理解和确认生成的计划方案。",
  "parameters": {
    "type": "object",
    "properties": {
      "tts": {
        "type": "string",
        "description": "用于描述输出的计划内容，包含规划的具体步骤、调用的agent或工具名称、调用工具的简要原因描述即调用agent有哪些好处来规划出最好的计划，以自然语言形式呈现给用户"
      }
    },
    "required": [
      "tts"
    ]
  }
}
(2) Search memory tool
记忆信息获取工具，用于触发查询用户长短期记忆的时机判断。

{
  "name": "search_user_preferences",
  "description": "智能用户偏好搜索系统，支持搜索用户的历史导航偏好、音乐喜好、媒体娱乐偏好、车辆设置习惯、常用地点、温度偏好、驾驶模式选择、娱乐内容偏好等长期记忆数据。系统会基于用户历史行为分析个人偏好模式，提供个性化的偏好信息查询服务。",
  "parameters": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "用户的偏好搜索指令，如'搜索我过去常去的地点'、'搜索我喜欢的音乐类型'、'显示我常用的导航设置'、'查找我上个月最常的歌曲'、'分析我的驾驶习惯'、'显示我上周常听的有声书'等。系统支持自然语言输入，会自动识别搜索意图并返回相应的用户偏好信息。"
      }
    },
    "required": [
      "query"
    ]
  }
}
(3) Search env info tool
环境信息获取工具，用于触发查询环境，车机状态等信息的时机判断。

{
  "name": "search_vehicle_status_info",
  "description": "车辆信息查询系统，支持温度、空气质量、空调状态、座椅功能、车窗车门锁、胎压胎温、车速、驾驶模式、充电续航、里程、保养、音量、连接、流量、系统信息等全方位车辆状态查询。系统会自动解析用户查询意图并返回相应信息。",
  "parameters": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "用户的车辆信息查询指令，如'现在车内温度多少'、'胎压正常吗'、'剩余电量多少'、'总里程多少'、'车窗关好了吗'、'座椅加热开了吗'等。系统支持自然语言输入，会自动识别用户查询意图并返回相应车辆信息。"
      }
    },
    "required": [
      "query"
    ]
  }
}
(4) Todo write-update tool
任务状态的更新，输出结构化的任务状态列表。

{
  "name": "plan_update",
  "description": "任务状态更新功能，用于动态更新和展示任务完成情况。将任务状态变更信息以简洁明了的方式展示给用户，帮助用户了解当前任务执行进度和状态变化。",
  "parameters": {
    "type": "object",
    "properties": {
      "update_data": {
        "type": "string",
        "description": "JSON格式的任务更新数据，只使用任务名称，无需任务ID。结构如下：{\"completed_tasks\":[\"任务名称1\",\"任务名称2\"],\"current_tasks\":[\"进行中的任务\"],\"pending_tasks\":[\"待完成任务1\",\"待完成任务2\"],\"failed_tasks\":[\"失败任务\"]}"
      }
    },
    "required": [
      "update_data"
    ]
  }
}
Agent design
(1) 下游Agent设计原则：
下游agent设计应符合 能力专业，必要的复合能力，某些特殊agent也应该存在必要的调用小范围子agent能力，边界清晰等特点，保障整体链路高效稳定。
(2) 可调度Agent枚举：
具体以产品定义和梳理为准，参考：对下今天的sp 2025年11月25日。
Planner模型内部工具节点调用流程
image.png

Context管理
上下文管理
(1) 上下文管理在座舱中的作用
解决多轮情况下，任务的延续性，直接决定大模型多轮的效果
解决multi-agent协同的信息传输，保证关键信息无丢失，提升agent协同能力
(2) 上下文管理需要解决的问题
如何做上下文隔离，将无用信息从上文中剔除
如何将其它sub-Agent 获取的信息有效地及时加入当前sub-Agent的上下文中。 
如何根据当前sub-Agent要处理的任务，把适的外部的知识库/记忆/工具用合理的格式放到当前sub-Agent中。 
如果当前sub-Agent上下文过长，还需合理选择或压缩这些信息。 
如何把当前 Agent 对其它子任务有帮助的信息保存下来，以便其它子 Agent 能利用这些信息更好地完成它们的任务。 
...
(3) 上下文管理的几种哲学范式
方式一：四种context管理，即Write Context、Select Context、Compress Context、Isolate Context。
image.png

引用：https://rlancemartin.github.io/2025/06/23/context_engineering/

方式二：三种功能类别，即context retrieval and generation，context processing，context management。
image.png

引用：《A Survey of Context Engineering for Large Language Models》
长期记忆
解决跨session，跨时间的对话延续黑魔法
(1) 长期记忆定义
用户的信息，包括：画像，偏好，高频对话控制历史等；车机控制记录，包括：空调，后视镜等设置记录等。
(2) 调用时机
由planner的Search memory tool判断当前是否需要记忆信息，同时由一定的规则辅助
(3) 调用方式
由planner告诉记忆模块需要查的信息是什么，记忆模块自行匹配返回内容
环境多模态信息
解决感知环境信息，车机状态信息的黑魔法
(1) 环境信息定义
车机的状态信息，车内的乘客状态信息，车内的图像感知信息，车外的图像感知信息等。
(2) 调用时机
由planner的Search env info tool判断当前是否需要环境信息，同时由一定的规则辅助
(3) 调用方式
由planner告诉环境信息模块需要查的信息是什么，该模块自行匹配返回内容
任务管理
任务定义
对用户复杂指令拆分到下游子Agent可执行的维度，满足：
原子性：一个Agent只能执行一个任务，Planner模型依靠FunctionCall能力输出Agent执行列表。
可改写：下游Agent执行失败时能被Planner重新描述而不改变用户原始目标。
可追踪：每个任务的状态在Plan维度可以被Planner模型完全感知到。

字段

类型 

说明

示例

agent_name

str

注册到平台的agent名称

SmartVehicleAgent

task_desc

str

给到agent 的指令（自然语言）

打开车窗

status

Status

三值状态：PENDING/FAILED/COMPLETED

COMPLETED

failure_reason

str

下游agent执行失败返回的原因

UNKNOWN

priority

enum

agent执行优先级

low

@dataclass
class Status(Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    
@dataclass
class Task:
    agent_name: str
    task_desc: str
    status: Status
    failure_reason: str
    priority: enum # low, mid, high
    
@dataclass
class Plan:
    plan_id: str
    query: str
    status: Status
    tasks: list[Task]
    interrupted_at: Task | None = None  # 最后中断的任务

    
 @dataclass
 class Checkpoint:
     plan: Plan
     failed_task: Task
任务状态管理
意义：
planner首次拆解出的子任务，下游agent由于能力受限无法承接（据识），需要将下游agent执行状态（traceback, nlg等）回流到planner，planner进行再次规划（改写）到下游agent/Tool可承接的状态。
任务的打断：持续型任务（如新闻播放、行程规划等）时，被用户主动触发的新任务打断的处理。
挂起：定时任务的处理。

讨论点：
目前基于FunctionCall的任务拆解，链路比较长，在这个过程中如果有打断的处理？
支持/不支持任务恢复的下游agent有哪些？

方案：

参考Claude Code，cursor中对任务规划、拆分后使用Todo工具记录任务的内容以及状态。

前提：在query级别上进行处理，每一个query对应唯一plan_id。
思路：Planner模型+工程侧全局State配合。Planner将复杂任务拆解到agent list维度后，Planner model依靠plan_update function call输出失败 ， 已完成，待完成任务的结构化数据，工程端解析结果，将每个任务的状态存入全局State，同时放入messages，做到每个任务可被追踪。

Replan
下游agent能力受限接不住
下游 Agent 无法成功执行 Planner 下发的任务。
执行失败后，端上将未成功执行的原始任务描述以及具体的失败原因回传给 Planner 服务。
Planner 模型在接收到失败信息后，会综合失败原因和当前上下文，调用 plan_describe Function Call，重新生成一个更可行的新计划（Replan），并下发给下游 Agent 执行。
打断&恢复
场景描述：用户主动/advisor中断：若前一个query对应的plan未全部执行完毕，被新的query打断
处理流程：
端上请求中断接口（携带未完成任务，planner sp对未完成任务占位符进行内容填充）
planner服务标记当前plan的状态是interrupted，并且保存当前的checkpoint。
端上携带新的query请求chat接口
planner服务基于新一轮的query以及前一轮query对应的checkpoint请求planner模型
planner模型调用plan_describe function call触发replan。
挂起
场景描述：当用户下达的指令包含未来特定时间或条件触发的动作时，任务需要被“挂起”，直到满足预设条件后再继续执行。这类任务通常涉及持续性的状态监听和条件判断。
处理流程：
识别挂起条件：Planner在解析用户指令时，识别出需要延迟执行或依赖特定未来条件（如“明天早上8点提醒我”、“到公司后打开空调”）的任务。
创建挂起任务：Planner将该任务标记为“挂起”状态，并存储相关的执行条件（如时间、地点、车速等）。
持续监听：Always On模块会持续监听车辆状态或外部环境信息，以判断挂起任务的触发条件是否满足。
触发执行：一旦条件满足，Always On模块将通知Planner服务。
恢复并执行：Planner服务接收到通知后，将挂起任务恢复为“进行中”状态，并调用相应的Agent来执行任务。
状态更新：任务执行完毕后，Planner会通过plan_update工具更新任务状态，并向用户播报结果。
image.png

状态更新
模型侧更新：planner模型 调用plan_update function Call输出JSON String表示的每个Task(Step)的状态。
工程侧更新：planner服务解析plan_update的输出结果，对所有任务的状态进行update，随后在messagesappend一条 ToolMessage进入上下文。
时序图
image.png

Planner仲裁&拒识
背景：
AI Car实现的是端云协同的技术链路，因此大部分明确表达的流量在端侧完成闭环，部分偏口语化表达/模糊的指令会进到云侧各模型的处理逻辑里；
Planner的需要有兼备快慢思考的能力以提高在处理“简单”表达上的性能表现；
端侧有拒识模块，但仍应考虑少量误召回到云侧Planner的流量，需要予以拒识。
方案
image.png

Planner前的仲裁
用户的查询被分成两类：
“端上接得住的 query”→ 直接由端侧 LLM处理，本地快速响应，通常适用于简单直接的控车表达，要求很低时延的性能表现
“端上接不住的 query”→ 上到云侧，先经过云侧的拒识判断是否召回：需要拒识的进到advisor/主动服务；召回的则进到仲裁模型进行判别&路由
端上接不接得住如何判断 → 端侧的LLM模型+白名单来区分
补充端侧的判断Query分流逻辑：
image.png

仲裁模型的输出把请求分发到云端不同能力：
明确指令 → 直接调用云侧 LLM生成指令下发，时延比较低。需要进一步完善云侧模型的推理能力，增加更多泛化/口语化表达的支持
复杂任务 → 云侧 Planner 走“慢思考”（分解、工具调用、检索、执行计划）
仲裁模型的仲裁规则更新 待补充
模型选型：Seed 1.6 flash SFT实现
Planner内的拒识
在Plan Describe阶段之前，引入拒识思考。content直接输出reject，不进行后续的拆解等其他逻辑，在当前语境下，判断是否为应当拒识的Query：若是，则直接输出reject，结束回复，不再进入后续plan流程。该方式存在一些缺点，包括格式输出不符合规定等，暂时没有想到好的解决办法
Planner训练

在仅采用 SP 的情况下，强如deepseek agent 模型存在以下几类较为突出的问题：
不使用 agent 模式进行调用（严重级别）：表现为不调用 agent，直接输出文本，流程完全失败。
指令跟随能力欠缺（较严重级别）
不遵循内部工具的整体流程定义，仅依靠 SP 时，模型能力不足，有时无法按照既定流程推进任务。
依据提供的样例，严格遵循样例进行拆解和多轮交互流程的输出能力不足，仍存在随机性。
上文捕捉能力薄弱（较严重级别）
在长上下文环境中，捕捉挂起任务、失败任务的能力不足，模型会忽略必须关注的部分。
多轮交互能力不足，轮次增加后，会出现上述各类错误情况。
任务拆解稳定性不足（较严重级别）：任务拆解存在随机性，每次拆解结果均不相同。
存在回复总结的幻觉输出问题（需解决）

不考虑时延的情况下，kimi-k2模型对上述问题处理能力虽有减轻但还是无法避免，虽然demo阶段任务拆分效果暂时够用，但随着业务的扩展，上下文复杂性的增多，和对时延的高要求，蒸馏和训练变成了必要的选择，蒸馏到豆包等小尺寸模型上存在一定的技术挑战性。
阶段目标
第一阶段：
确定座舱典型Agent（5个）+ 典型工具（Plan，search_info等）
搭建数据蒸馏管线，完成从强基模数据蒸馏，保证数据质量
外部车企真实线上数据收集
走通数据生成、模型训练，评测迭代全流程
第二阶段：
确定量产版本Agent全覆盖+座舱大模型所需全部工具
训练可量产上线的Planner模型
模型提优、量化、压缩
详细训练方案
训练所用Agent/Tool
第一阶段
第二阶段
数据生成管线
Step1: 以产品集为核心，从Kimi K2模型蒸馏Planner任务拆解数据，泛化后制作训练集，开发集
Step2: GPT-4o模型打分数据生成效果， 满足要求后加入训练集，不满足要求舍弃
Step3: 基于Doubao-Seed-1.6 模型，训练集训练Planner模型
Step4: 微调的Planner 模型预测结果，Kimi K2模型打分评测
Step5: 模型不满足精度要求，bad case泛化数据后，继续迭代模型，形成模型迭代闭环
SFT精调
RL 强化
Planner数据范式构建
Function call模式（选用该方案）
参考：
数据构建：https://cloud.bytedance.net/docs/ark/docs/664afad9e16ff302cb5c0706/67e3c6e6a31d120509ebd99f?x-resource-account=public&x-bc-region-id=bytedance
火山接口使用：https://cloud.bytedance.net/docs/ark/docs/664afad9e16ff302cb5c0706/664afaf23c82fe026aad1ca2?x-resource-account=public&x-bc-region-id=bytedance
使用function call方式训练
并行任务 @李晨延@赵磊

{
    "messages": [
        {
            "role": "system",
            "content": "#火山车载助手Volcano。"
        },
        {
            "role": "user",
            "content": "我好困呀"
        },
        {
            "role": "assistant",
            "content": "好呀，我来帮你操作一下",
            "loss_weight": 1
        },
        {
            "role": "assistant",
            "content": "",
            "tool_calls": [ 
                { 
                  "type": "function", 
                  "function": { 
                    "name": "get_extra_info", 
                    "arguments": "{\"need_env\": \"true\", \"need_mem\": \"false\"}"
                  }
              ],
            "loss_weight": 1
        },
        {
            "role": "tool",
            "content": "车辆速度:{速度:0km/h}\n车窗状态:{开关:on}\n空调状态:{开关:off}",
        },
        {
            "role": "assistant",
            "content": "",
            "tool_calls": [
                { 
                  "type": "function", 
                  "function": { 
                    "name": "vehicleAgent", 
                    "arguments": "{\"query\": \"打开休憩模式\"}" 
                  } 
                },
                { 
                  "type": "function", 
                  "function": { 
                    "name": "vehicleAgent", 
                    "arguments": "{\"query\": \"关闭车窗\"}" 
                  } 
                },
                { 
                  "type": "function", 
                  "function": { 
                    "name": "vehicleAgent", 
                    "arguments": "{\"query\": \"打开空调\"}" 
                  } 
                }
              ],
            "loss_weight": 1
        },
        {
            "role": "tool",
            "content": "休憩模式已经打开了"
        },
        {
            "role": "tool",
            "content": "车窗关闭了"
        },
        {
            "role": "tool",
            "content": "空调打开了"
        },
        {
            "role": "assistant",
            "content": "休憩模式，车窗，空调都调好了", // 具体形式参考 Plan watching & Replan
            "loss_weight": 1
        }
    ],
    "tools": [
        { 
          "type": "function", 
          "function": { 
            "name": "get_extra_info", 
            "description": "记忆或环境信息查询agent", 
            "parameters": { 
              "type": "string", 
              "properties": { 
                "query": {"type": "string", "description": ""} 
              }, 
              "required": ["query"] 
            } 
          } 
        },
        { 
          "type": "function", 
          "function": { 
            "name": "vehicleAgent", 
            "description": "车控agent", 
            "parameters": { 
              "type": "string", 
              "properties": { 
                "query": {"type": "string", "description": ""} 
              }, 
              "required": ["query"] 
            } 
          } 
        } 
      ]
}
依赖任务拆多轮 @李晨延@赵磊

{
    "messages": [
        {
            "role": "system",
            "content": "#火山车载助手Volcano。"
        },
        {
            "role": "user",
            "content": "做一个北京的出行规划有好的结果帮我记录成代办"
        },
        {
            "role": "assistant",
            "content": "别急，这就帮你做个北京的出行规划"
        },
        {
            "role": "assistant",
            "content": "",
            "tool_calls": [ 
                { 
                  "type": "function", 
                  "function": { 
                    "name": "travel_agent", 
                    "arguments": "{\"query\": \"做一个北京的出行规划\"}" 
                  }
              ],
            "loss_weight": 1
        },
        {
            "role": "tool",
            "content": "北京的形成规划xxxxx",
        },
        {
            "role": "assistant",
            "content": "搞定啦",
            "loss_weight": 1
        }
    ],
    "tools": [
        { 
          "type": "function", 
          "function": { 
            "name": "get_extra_info", 
            "description": "记忆或环境信息查询agent", 
            "parameters": { 
              "type": "", 
              "properties": { 
                "": {"type": "string", "description": ""} 
              }, 
              "required": [""] 
            } 
          } 
        },
        { 
          "type": "function", 
          "function": { 
            "name": "travel_agent", 
            "description": "出行agent", 
            "parameters": { 
              "type": "", 
              "properties": { 
                "": {"type": "string", "description": ""} 
              }, 
              "required": [""] 
            } 
          } 
        },
        { 
          "type": "function", 
          "function": { 
            "name": "task_agent", 
            "description": "定时任务agent", 
            "parameters": { 
              "type": "", 
              "properties": { 
                "": {"type": "string", "description": ""} 
              }, 
              "required": [""] 
            } 
          } 
        }
      ]
}
座舱Planner任务拆解
case参考：任务Planner - PRD 【豆包 in car1.0】任务planner种子数据

能力

说明

产品负责人

算法负责人

工程负责人

备注

任务拆解

拆解任务

@李晨延

简单任务识别

识别简单任务还是复杂任务

复杂任务填参

模糊意图等复杂任务为下游agent填写调用参数

挂起任务识别

需要持续监听车机状态的持续任务，需要特殊识别，调用always on

context管理

挂起任务需单独存一份，等待always on调用，always on持续任务与挂起任务需标识对应；挂起任务已完成，需更改context

困难任务，需考虑多轮对话下的多轮取消如何做，context管理细节较多

多轮指代继承

针对上轮任务或用户请求，次轮的模糊说法能准确规划

唤醒轮次内修改挂起任务

唤醒状态内，且上文未弹出，用户要修改挂起的持续任务

唤醒轮次外修改挂起任务

重新唤醒，用户要修改或取消挂起的持续任务

困难任务，如挂起任务较多，不一定能准确找到对应的挂起任务

铺垫话术生成

生成铺垫话术

生成的tts话术影响时延，貌似只有复杂plan才会用到，不然重复回复体验不一定好

信息询问话术生成

信息不足的情况下，进一步引导用户澄清，或询问用户是否对结果满意

可能会打扰用户，建议简单做或不做，收窄范围

子任务依赖识别

识别串行任务还是并行任务

很困难，风险高

任务检查&状态更新 

对调用的工具检查任务完成情况，涉及replan和话术总结

@赵磊

总结话术生成

根据任务检查结果，生成总话术

子agent若有出行等总结类，需要等待全部生成完毕，再进行总结，等待时长非常长
评测体系
详见：座舱Planner评测体系
相关的评测接口文档：
[OpenAPI]Fornax 观测开放接口说明
数据集构成
产品集类型算法拆解

单次调用

多次调用

备注

单轮

多轮

资源依赖

依赖项

负责人

相关方对接人

备注

任务拆解&排期

任务项

任务说明

进度&进展

负责人

Deadline

备注

930周期

Planner - 集合构建

建设930产研测试集 - 简单指令

需包含必要的单轮多轮：
产品集
研发泛化集

@张嘉锋
@李晨延

250905

初拍产品集共计100，研发自测集共计1k，根据需求再调整增加数量

建设930产研测试集 - 复杂指令

需包含必要的单轮多轮：
产品集
研发泛化集

@张嘉锋
@赵磊

250905

建设930产研测试集 - 多轮

需多样化，拒识case必需穿插进多轮

@张嘉锋@李晨延

250905

建设上线测试集

可能包括仅供参考：
无采样线上集
有采样线上高频集
KOL体验集
产品集

@测试同学

暂无

930周期不考虑

根据产品集，建设930研发训练集

待定

Planner - 脚本构建

数据泛化脚本

Day 1：已完成100%

@李晨延

250910

单轮测试脚本

Day 2：已完成100%

@李晨延

待定

多轮推理脚本

Day 2：已完成100%

@李晨延

250911

多轮测试脚本

Day 4：todo

@李晨延

250911

多轮训练集构建脚本

@李晨延

待定

workflow框架搭建

工程实现

暂无

Planner - SP实验 参见：【AI汽车】Planner系统提示词修改记录

Planner 总SP定义

Day 1：完成sp空间创建，完成sp总体框架搭建

@赵磊

@赵磊Fornax空间补充产品权限，嘉锋，明俊（Done）

Planner 任务拆解SP定义(Task)

Day 3：完成

@赵磊

记忆，环境信息tool call SP定义

Day 3：完成

@赵磊

子agent SP定义

Day 2：完成

@赵磊

多轮SP定义

待定

铺垫话术SP定义

待定

总结话术SP定义

待定

Replan SP定义

待定

fc 输出格式指令追随 SP定义

待定

Planner - sft能力建设

简单困难任务识别

识别简单困难任务，简单任务直接出单一plan，困难任务出plan列表

暂无

任务拆解

暂无

铺垫话术

暂无

总结话术

暂无

replan

收集tool call信息，建设replan能力

暂无

Workflow - 能力建设

work-flow搭建

框架搭建，未来支持展车，新用户上车时，语音教学能力

暂无

work-flow planner能力建设

根据work flow流程，planner智能识别当前work flow流程是够跳过

暂无

Planner - 测试

测试：指令追随-fc-json格式追随准确率

暂无

测试：指令追随-任务拆解满足率

暂无

测试：指令追随-环境信息识别满足率

暂无

测试：指令追随-记忆信息识别满足率

暂无

测试：回复话术满足率

暂无

备注及杂项
暂无
附录及引用
[1] Embodied AI Agents Modeling the World.pdf[J].
[2] XING E, DENG M, HOU J, et al. Critiques of World Models[J].
[3] 【内部】技术架构
[4] Manus 内部的 Context 工程经验 https://zhuanlan.zhihu.com/p/1929862808893383604
[5] 长期记忆链路设计v2
[6] HUANG X, LIU W, CHEN X, et al. Understanding the planning of LLM agents: A survey[J].
[7] 豆包长期记忆设计方案
[8] Aime：DevInfra 面向复杂现实任务的智能体探索
[9] 基于MCP 的多Agent、多轮对话应用实战
[10] 任务Planning - PRD 【豆包 in car1.0】
[11] 【AI汽车】座舱侧技术方案
[12] 【AI汽车0.5】豆包车载版-产品需求文档 V3.0版本 （0.5旧版本）
[13] 【仅对内】场景感知状态信号库
[14] 【Planner】服务端技术评审
[15] [F.I.R.E] Multi-Agent协作系统——研究进展与算法实践
TODO LIST
