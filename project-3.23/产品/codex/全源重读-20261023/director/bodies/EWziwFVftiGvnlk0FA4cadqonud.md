AIDV Planner One Page
模块定位

Planner 是 AIDV 的决策中枢：它在 Flow 编排中被预启动，基于 cloudwego/eino 的 ReAct 图完成上下文组装、模型推理、工具执行与流式回复；规则与简单意图在到达它之前就会被快路径截断，只有复杂任务进入完整闭环


整体执行链路
入口是 DoPlan，它返回一个缓冲 channel，全部逻辑在单个 goroutine 内流式产出。DoPlan 在 Flow 编排器里被预启动——早于推荐、单座、拒识等 Processor 运行，内部先等 MsgKeyPlannerContinue 信号；句法 RAG / SimpleIntent 规则快路径、Recommend 回流、intent_and_refusal 拒识等一旦命中，预启动的 Planner 会被直接取消，只有 AlwaysPlannerProcessor（OEM 强制）或最终回退 PlannerProcessor 时才放行，因此它只承接真正需要推理编排的复杂请求。

放行之后，DoPlan 沿下表五个阶段推进，其中「文本规划」的内部就是下一节的 ReAct 闭环：


阶段

代码位置

做什么

预启动与放行

DoPlan / flow.Orchestrate

Flow 先 PreStartPlanner，DoPlan 内部等 MsgKeyPlannerContinue；PlannerProcessor / AlwaysPlannerProcessor 决定走 Planner 时才发信号并转发 PlanChan，否则 cancel 退出

输入预处理

sound_zone_merge

四音区 query 经 Redis 合并；操作手册类意图（IntentOperationManual）把 query 改写为「请查询后回答：…」；keepCheckShouldBreak 每 100ms 轮询新 query 打断，首 token 后不再打断

旁路异步任务

querySummary / RelevanceCheck

query 摘要、当前 query 相关性检查异步执行，结果经 frontier 推端侧；相关性结果在流结束时最多等 20ms

文本规划

AnalyzeTaskWithText

进入 Eino ReAct 图（下一节展开），并立即下发仲裁 chunk，约定 use_agent=vehicle（进 Planner 即走 aidv）

流式主循环

DoPlan select

三路 select：ctx.Done 清四音区缓存、breakChan 把执行中任务置 Interrupted、re 流逐帧转发；首 token 回写会话阶段，「reject」前缀识别拒识，多音区场景补 MultiSoundZoneChunk
ReAct 决策闭环
上一阶段的「文本规划」进入 AnalyzeTaskWithText → runTextPlanner，后者基于 cloudwego/eino 编出一张 ReAct 图：模型每轮输出严格 JSON，有 action_list 就执行工具、把结果作为 observation 回灌再推理，无 action 或命中直返工具则收口。先看拓扑：



图节点 / 分支

处理函数

职责

llm

llmNodeHandler / processLLMStream

调方舟豆包并边流边解析，详见下方「一次循环的四阶段」

llm 分支

llmBranchHandler

action_list 非空且 Step≤20 → tools，否则 direct_return（JSON 解析失败也直返）；本轮发过 TTS 时先等端侧播完再走

tools

toolsNodeHandler

执行 action、逐帧转发、合成 observation，详见下方四阶段

tools 分支

task.State.ReturnDirectlyToolCallID

命中 aidv_agent_list.ReturnDirectlyTools 的工具不再回 LLM，直接 direct_return 结束

direct_return

空节点

结果已在 llm/tools 节点流式产出，这里只做图收口 → END
拓扑是骨架，真正的复杂度在节点内部。顺着一次循环，代码按 ①准备 → ②llm → ③分支 → ④tools 四阶段推进，下图与下表一一对应



阶段

函数

实现要点

① 准备

AnalyzeTaskWithText

闭环对外入口：建缓冲 ch，goroutine 内执行并 defer Recover；runTextPlanner 报错时发 NewChatError(ErrorPlannerAnalyze)，统计 KeyPlannerAnalyzeTaskText 耗时

① 准备

buildHistoryMessages

用 chat_history + planner_histories + planner_task_list 重建 ReAct 时序（user → assistant observation → user[feedback]），并入近 10 分钟最多 3 条事件日志后按时间稳定排序；非最后一轮的车辆手册 / 联网搜索反馈脱敏为「...」；失败降级 History.ToEinoMessages

① 准备

waitForSystemPromptVariables / formatContentMessage

前者阻塞等 Context 经 ctx_msg(MsgKeyContextResult) 下发的提示词变量；后者把多音区输入、advisor: / event: 内容包成结构化 JSON 数组，附 last_talk_content、说话人、音区与时间戳

① 准备

GetPlannerAgentList / injectToolInfos

取在线工具集 compose.NewToolNode；BuildToolPrompt 把每个工具的中文名 / tool_name / 描述 / 参数 / notice / tips 拼成 tool_list 注入提示词变量，随后 NewGraph 建图并 runnable.Stream 启动

② llm

llmNodeHandler

Round++，提前预建 TTS Sami 连接以降首字延迟；调方舟豆包（FuncPlannerAnalyzeText、60s 超时、SPHardening、ResponseFormat JSONSchema strict）

② llm

processLLMStream

StreamExtractor 增量抽 talk_content / emoji_id；parseEmotionContentAndTalkContent 解析「[情感]文本」，一段情感结束即 StartTTS（首轮复用预建连接，TaskRoundID=GetRoundID），情感含「唱」改走 S2S；收尾发 FinishChunk、savePlannerModelOutput 落 planner_histories 并回写 PlannerID，assistant 消息只留 ExtractFirstJSON

③ 分支

llmBranchHandler

本轮发过 TTS 时先下发 TTS 结束、轮询（最多 1 分钟）等端侧播完再继续，实现轮次间等播报；ActionList 非空且 Step≤20 → tools，否则（含 JSON 解析失败）→ direct_return

④ tools

toolsNodeHandler

repairJson 容错解析；每个 action 用 uuid 重写 ActionID、toolNameMap 改名（navi_control→vehicle_basic_control）、params 注入 answer_source=cloud_planner；frontier 下发「工具调用中」Widget；对照 ReturnDirectlyTools 判直返；createTask 落 planner_task_list；toolsNode.Stream 执行并逐帧 ToolRespToChatResp 转发、采集 ExecutionFeedback；收尾 updateTaskResponse，mergeToolOutputs 合成 {"tool_feedback","tool_name"} observation 回灌 llm，形成闭环

辅助

parseEmotionContentAndTalkContent / buildTTSPlayAndNotPlayedSentence

前者按「[情感]文本」切分以驱动分情感 TTS；后者处理打断续说——优先按 TTS 逐字打轴 WordTimestamp 切已播 / 未播，缺打轴时按 millisPerRune（默认 100ms / 字）估算，拼成「已播内容（这里被用户打断了，后面没说完：未播内容）」作为下一轮 last_talk_content

流式双通道与落库：模型话术走两条通道——NewDisableDisplayAnswerChunk 进主流（端侧屏显禁用）、AnswerChunk 进 ttsChan 驱动 TTS 播报；工具执行帧经 ToolRespToChatResp 进主流下发。落库分两张表：每次模型完整输出写 planner_histories，每个工具任务及结果写 planner_task_list（state.go 的 createTask / updateTaskResponse，该文件约定 state 内函数不开协程读数据）。
输入输出格式
闭环每一轮的模型输出都是严格结构化的，而 Planner 整体的输入由 Flow 与 Context / Memory 侧汇聚、输出分别流向播报、工具与目标系统，如下：


方向

内容

来源 / 去向

输入

当前 query（多音区合并后）、历史对话与工具反馈

chat_history、planner_histories、planner_task_list 重建 ReAct 时序

输入

场景变量 env_info、端状态、车辆事件

Context 模块，经 ctx_msg(MsgKeyContextResult) 传入

输入

用户偏好、短期 / 长期记忆

Memory

输入

Goal List / Advisor/Event

长时任务、advisor推荐、event事件

输入

在线工具清单与描述

agent_registry → BuildToolPrompt → tool_list 注入提示词

输出

talk_content、emoji_id

流式 TTS 播报与端侧展示（屏显禁用文本帧除外）

输出

action_list[]

Tools 节点 → Agent Server 执行（下一节展开）

type PlannerTextOutput struct {
    TalkOrNot      string       `json:"talk_or_not"`      // 云端不使用，仅产品侧需要
    TalkContent    string       `json:"talk_content"`     // 话术，流式驱动 TTS
    ActionList     []ActionItem `json:"action_list"`      // 动作清单
    GoalListUpdate []any        `json:"goal_list_update"` // 长时目标更新
    EmojiID        string       `json:"emoji_id"`
}

type ActionItem struct {
    ActionID string         `json:"action_id"`
    ToolName string         `json:"tool_name"`
    Params   map[string]any `json:"params"`
}
工具执行：从 Graph 到 Agent Server
action_list 里的 tool_name 并不是一次普通函数调用。业务上说「Planner 调用 Agent」，但在 Eino Graph 内部每个 Agent 都被包装成 tool.BaseTool 放进 ToolsNode——Graph 只看见 tool，真正的 Agent 调用藏在工具的 StreamableRun 背后，链路如下：

GetPlannerAgentList（GetToolsByIDs 补充联网搜索等特殊工具）拿到一批 Eino tool，compose.NewToolNode 建 ToolsNode；
模型 action_list 命中后，Eino 调 tool 的 StreamableRun（agent_server.AgentStreamHelper）；
内部 NewAgentStreamRunner → RunAgent，这一步才真正进入 Agent Server；
Agent Server 按 agent_registry 的 AgentType 选 executor 执行，结果转成 observation 回灌 llm 继续推理；命中直返工具则 direct_return 结束。


AgentType

Executor

能力域

AIDV (0)

aidv_agent_list.NewAidvExecutor

服务内置 Agent，本仓库直接实现，不走外部 agent 服务

DPFM (1)

dpfm.NewDpfmExecutor

车控、车辆领域工具与部分 ToB 模型能力（以 agent_registry 配置为准）

Doubao (2)

doubao.NewDoubaoExecutor

豆包云能力：通用内容、搜索、豆包生态

Ecology (3)

ecology.NewEcologyExecutor

生态 / 第三方服务能力

Offline (4)

端侧离线

虚拟 Agent，端侧离线处理，无需加入 Planner

InternalRPC (5)

internal_rpc.NewInternalRPCExecutor

内部 RPC 服务型 Agent
代码位置：biz/service/agent_server/base.go（GetExecutor 按类型分发）、helper.go（AgentStreamHelper）、runner.go（RunAgent）。Planner 侧 Prompt 统一在 Fornax 管理（FuncPlannerAnalyzeText），线上链路 trace 看 Fornax、服务日志看 Argos。
关键机制
以下机制横跨上面多个阶段，是理解 Planner 行为的横切设计：


机制

实现要点

上下文组装

buildHistoryMessages 重建 ReAct 时序并并入近 10 分钟最多 3 条车辆事件（resource_id 白名单走 TCC 配置），按真实时间稳定排序；formatContentMessage 把当前输入包成结构化 JSON（query / advisor / event、说话人、音区、时间戳）

系统提示词与工具注入

Context 产出经 ctx_msg(MsgKeyContextResult) 传入；GetPlannerAgentList 取在线工具集，BuildToolPrompt 拼成 tool_list 注入提示词变量；Prompt 本体在 Fornax 维护

结构化输出

固定五字段 talk_or_not / talk_content / emoji_id / action_list / goal_list_update，JSONSchema strict；ExtractFirstJSON 保证入图消息只保留 JSON，破损 JSON 经 jsonrepair 修复

流式 TTS 与轮次协调

talk_content 用 StreamExtractor 增量抽取，一段 [情感] 结束即 StartTTS；文本帧对屏显禁用、对 TTS 走 AnswerChunk；HasSendTTS / PlayTTSFinished 消息协调轮次，轮间等端侧播完

TTS 打断续说

优先按逐字打轴 WordTimestamp 切已播 / 未播，缺打轴按 millisPerRune（默认 100ms / 字）估算，拼成「已播内容（这里被用户打断了，后面没说完：未播内容）」作为 last_talk_content 进下一轮上下文

四音区合并与可中断

sound_zone_merge 基于 Redis 锁 + 缓存聚合同一 ChatID 多音区 query；ShouldBreak 检测更新 query，首 token 前允许打断，中断时执行中任务 Pending→Interrupted

拒识与兜底

模型在首 token 位置输出 reject 前缀即判拒识（StreamChecker.HasPrefix），发 RefusalChunk 但不 return，让模型走完以保留完整信息；历史组装失败降级 History.ToEinoMessages，runTextPlanner 失败发 NewChatError

状态与落库

图状态 GraphState（Messages / Round / Step）+ Eino 本地态 task.State（PlannerID、tool_call_id→task_id 映射、ReturnDirectlyToolCallID）；模型输出落 planner_histories，工具任务落 planner_task_list（AlwaysFinishedTools 直接置 finished）
模型相关


EP

类型

模型/基座

部署方式

ep-20260623151246-89zn2

基模

2.1-turbo

独立部署(模型单元)

ep-20260731162346-bsgms

基模

2.1-turbo

低延迟保障包

ep-20260710075059-8mjjb
ep-20260720093313-g5b7d

sft/rl


2.0-lite

模型单元


SP



planner.task.analyze_text_saic_dna

上汽PE版本SP fornax.bytedance.net

director.task.analyze_text_saic_dna

上汽SFT版本SP fornax.bytedance.net

planner.task.analyze_text_seres

赛力斯PE版本SP fornax.bytedance.net
监控和看板
https://cloud.bytedance.net/argos/dashboard/691c619c2d02e1fcf8339791?dashboard_from=now-24h&dashboard_to=now&last_case_id&psm=vehicle.model.data_provider_for_model&region=China-North&site=cn&var-channel=&var-env=&x-bc-region-id=bytedance&x-resource-account=public
image.png

相关文档
座舱Planner探索
【Planner】服务端技术评审 250910
Planner json输出保障
Planner模型资源评估和升级

