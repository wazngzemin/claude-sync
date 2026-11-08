# 模块定位

<callout emoji="💡" background-color="light-orange" border-color="light-orange">

Planner 是 AIDV 的决策中枢：它在 Flow 编排中被**预启动**，基于 cloudwego/eino 的 ReAct 图完成上下文组装、模型推理、工具执行与流式回复；规则与简单意图在到达它之前就会被快路径截断，只有复杂任务进入完整闭环
</callout>

<whiteboard token="PaDGwv0L7hKa06biwdWcDfe8nEc"/>

# 整体执行链路

入口是 **DoPlan，**它返回一个缓冲 channel，全部逻辑在单个 goroutine 内流式产出。DoPlan 在 Flow 编排器里被**预启动**——早于推荐、单座、拒识等 Processor 运行，内部先等 MsgKeyPlannerContinue 信号；句法 RAG / SimpleIntent 规则快路径、Recommend 回流、intent_and_refusal 拒识等一旦命中，预启动的 Planner 会被直接取消，只有 AlwaysPlannerProcessor（OEM 强制）或最终回退 PlannerProcessor 时才放行，因此它只承接真正需要推理编排的复杂请求。

<whiteboard token="W3Wjw786Zh1d3GbhOymcHVn7n8f" width="611" height="542"/>

放行之后，DoPlan 沿下表五个阶段推进，其中「文本规划」的内部就是下一节的 ReAct 闭环：

<lark-table rows="6" cols="3" header-row="true" column-widths="130,230,460">

  <lark-tr>
    <lark-td>
      阶段
    </lark-td>
    <lark-td>
      代码位置
    </lark-td>
    <lark-td>
      做什么
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      预启动与放行
    </lark-td>
    <lark-td>
      DoPlan / flow.Orchestrate
    </lark-td>
    <lark-td>
      Flow 先 PreStartPlanner，DoPlan 内部等 MsgKeyPlannerContinue；PlannerProcessor / AlwaysPlannerProcessor 决定走 Planner 时才发信号并转发 PlanChan，否则 cancel 退出
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      输入预处理
    </lark-td>
    <lark-td>
      sound_zone_merge
    </lark-td>
    <lark-td>
      四音区 query 经 Redis 合并；操作手册类意图（IntentOperationManual）把 query 改写为「请查询后回答：…」；keepCheckShouldBreak 每 100ms 轮询新 query 打断，首 token 后不再打断
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      旁路异步任务
    </lark-td>
    <lark-td>
      querySummary / RelevanceCheck
    </lark-td>
    <lark-td>
      query 摘要、当前 query 相关性检查异步执行，结果经 frontier 推端侧；相关性结果在流结束时最多等 20ms
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      文本规划
    </lark-td>
    <lark-td>
      AnalyzeTaskWithText
    </lark-td>
    <lark-td>
      进入 Eino ReAct 图（下一节展开），并立即下发仲裁 chunk，约定 use_agent=vehicle（进 Planner 即走 aidv）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      流式主循环
    </lark-td>
    <lark-td>
      DoPlan select
    </lark-td>
    <lark-td>
      三路 select：ctx.Done 清四音区缓存、breakChan 把执行中任务置 Interrupted、re 流逐帧转发；首 token 回写会话阶段，「reject」前缀识别拒识，多音区场景补 MultiSoundZoneChunk
    </lark-td>
  </lark-tr>
</lark-table>

# ReAct 决策闭环

上一阶段的「文本规划」进入 **AnalyzeTaskWithText → runTextPlanner**，后者基于 cloudwego/eino 编出一张 ReAct 图：模型每轮输出严格 JSON，有 action_list 就执行工具、把结果作为 observation 回灌再推理，无 action 或命中直返工具则收口。先看拓扑：

<whiteboard token="FZUTw1rIfhypbvbNF7ucePd2nEe" width="583" height="471"/>

<lark-table rows="6" cols="3" header-row="true" column-widths="150,200,470">

  <lark-tr>
    <lark-td>
      图节点 / 分支
    </lark-td>
    <lark-td>
      处理函数
    </lark-td>
    <lark-td>
      职责
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      llm
    </lark-td>
    <lark-td>
      llmNodeHandler / processLLMStream
    </lark-td>
    <lark-td>
      调方舟豆包并边流边解析，详见下方「一次循环的四阶段」
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      llm 分支
    </lark-td>
    <lark-td>
      llmBranchHandler
    </lark-td>
    <lark-td>
      action_list 非空且 Step≤20 → tools，否则 direct_return（JSON 解析失败也直返）；本轮发过 TTS 时先等端侧播完再走
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      tools
    </lark-td>
    <lark-td>
      toolsNodeHandler
    </lark-td>
    <lark-td>
      执行 action、逐帧转发、合成 observation，详见下方四阶段
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      tools 分支
    </lark-td>
    <lark-td>
      task.State.ReturnDirectlyToolCallID
    </lark-td>
    <lark-td>
      命中 aidv_agent_list.ReturnDirectlyTools 的工具不再回 LLM，直接 direct_return 结束
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      direct_return
    </lark-td>
    <lark-td>
      空节点
    </lark-td>
    <lark-td>
      结果已在 llm/tools 节点流式产出，这里只做图收口 → END
    </lark-td>
  </lark-tr>
</lark-table>

拓扑是骨架，真正的复杂度在节点内部。顺着一次循环，代码按 ①准备 → ②llm → ③分支 → ④tools 四阶段推进，下图与下表一一对应

<whiteboard token="GZrIwNDXUheWV9bNwqAcKW2SnHW" width="525" height="501"/>

<lark-table rows="10" cols="3" header-row="true" column-widths="80,210,530">

  <lark-tr>
    <lark-td>
      阶段
    </lark-td>
    <lark-td>
      函数
    </lark-td>
    <lark-td>
      实现要点
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ① 准备
    </lark-td>
    <lark-td>
      AnalyzeTaskWithText
    </lark-td>
    <lark-td>
      闭环对外入口：建缓冲 ch，goroutine 内执行并 defer Recover；runTextPlanner 报错时发 NewChatError(ErrorPlannerAnalyze)，统计 KeyPlannerAnalyzeTaskText 耗时
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ① 准备
    </lark-td>
    <lark-td>
      buildHistoryMessages
    </lark-td>
    <lark-td>
      用 chat_history + planner_histories + planner_task_list 重建 ReAct 时序（user → assistant observation → user[feedback]），并入近 10 分钟最多 3 条事件日志后按时间稳定排序；非最后一轮的车辆手册 / 联网搜索反馈脱敏为「...」；失败降级 History.ToEinoMessages
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ① 准备
    </lark-td>
    <lark-td>
      waitForSystemPromptVariables / formatContentMessage
    </lark-td>
    <lark-td>
      前者阻塞等 Context 经 ctx_msg(MsgKeyContextResult) 下发的提示词变量；后者把多音区输入、advisor: / event: 内容包成结构化 JSON 数组，附 last_talk_content、说话人、音区与时间戳
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ① 准备
    </lark-td>
    <lark-td>
      GetPlannerAgentList / injectToolInfos
    </lark-td>
    <lark-td>
      取在线工具集 compose.NewToolNode；BuildToolPrompt 把每个工具的中文名 / tool_name / 描述 / 参数 / notice / tips 拼成 tool_list 注入提示词变量，随后 NewGraph 建图并 runnable.Stream 启动
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ② llm
    </lark-td>
    <lark-td>
      llmNodeHandler
    </lark-td>
    <lark-td>
      Round++，提前预建 TTS Sami 连接以降首字延迟；调方舟豆包（FuncPlannerAnalyzeText、60s 超时、SPHardening、ResponseFormat JSONSchema strict）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ② llm
    </lark-td>
    <lark-td>
      processLLMStream
    </lark-td>
    <lark-td>
      StreamExtractor 增量抽 talk_content / emoji_id；parseEmotionContentAndTalkContent 解析「[情感]文本」，一段情感结束即 StartTTS（首轮复用预建连接，TaskRoundID=GetRoundID），情感含「唱」改走 S2S；收尾发 FinishChunk、savePlannerModelOutput 落 planner_histories 并回写 PlannerID，assistant 消息只留 ExtractFirstJSON
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ③ 分支
    </lark-td>
    <lark-td>
      llmBranchHandler
    </lark-td>
    <lark-td>
      本轮发过 TTS 时先下发 TTS 结束、轮询（最多 1 分钟）等端侧播完再继续，实现轮次间等播报；ActionList 非空且 Step≤20 → tools，否则（含 JSON 解析失败）→ direct_return
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ④ tools
    </lark-td>
    <lark-td>
      toolsNodeHandler
    </lark-td>
    <lark-td>
      repairJson 容错解析；每个 action 用 uuid 重写 ActionID、toolNameMap 改名（navi_control→vehicle_basic_control）、params 注入 answer_source=cloud_planner；frontier 下发「工具调用中」Widget；对照 ReturnDirectlyTools 判直返；createTask 落 planner_task_list；toolsNode.Stream 执行并逐帧 ToolRespToChatResp 转发、采集 ExecutionFeedback；收尾 updateTaskResponse，mergeToolOutputs 合成 {"tool_feedback","tool_name"} observation 回灌 llm，形成闭环
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      辅助
    </lark-td>
    <lark-td>
      parseEmotionContentAndTalkContent / buildTTSPlayAndNotPlayedSentence
    </lark-td>
    <lark-td>
      前者按「[情感]文本」切分以驱动分情感 TTS；后者处理打断续说——优先按 TTS 逐字打轴 WordTimestamp 切已播 / 未播，缺打轴时按 millisPerRune（默认 100ms / 字）估算，拼成「已播内容（这里被用户打断了，后面没说完：未播内容）」作为下一轮 last_talk_content
    </lark-td>
  </lark-tr>
</lark-table>

<callout emoji="satellite_antenna" background-color="light-orange" border-color="light-orange">

**流式双通道与落库**：模型话术走两条通道——NewDisableDisplayAnswerChunk 进主流（端侧屏显禁用）、AnswerChunk 进 ttsChan 驱动 TTS 播报；工具执行帧经 ToolRespToChatResp 进主流下发。落库分两张表：每次模型完整输出写 planner_histories，每个工具任务及结果写 planner_task_list（state.go 的 createTask / updateTaskResponse，该文件约定 state 内函数不开协程读数据）。
</callout>

# 输入输出格式

闭环每一轮的模型输出都是严格结构化的，而 Planner 整体的输入由 Flow 与 Context / Memory 侧汇聚、输出分别流向播报、工具与目标系统，如下：

<lark-table rows="8" cols="3" header-row="true" column-widths="90,330,400">

  <lark-tr>
    <lark-td>
      方向
    </lark-td>
    <lark-td>
      内容
    </lark-td>
    <lark-td>
      来源 / 去向
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      输入
    </lark-td>
    <lark-td>
      当前 query（多音区合并后）、历史对话与工具反馈
    </lark-td>
    <lark-td>
      chat_history、planner_histories、planner_task_list 重建 ReAct 时序
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      输入
    </lark-td>
    <lark-td>
      场景变量 env_info、端状态、车辆事件
    </lark-td>
    <lark-td>
      Context 模块，经 ctx_msg(MsgKeyContextResult) 传入
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      输入
    </lark-td>
    <lark-td>
      用户偏好、短期 / 长期记忆
    </lark-td>
    <lark-td>
      Memory
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      输入
    </lark-td>
    <lark-td>
      Goal List / Advisor/Event
    </lark-td>
    <lark-td>
      长时任务、advisor推荐、event事件
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      输入
    </lark-td>
    <lark-td>
      在线工具清单与描述
    </lark-td>
    <lark-td>
      agent_registry → BuildToolPrompt → tool_list 注入提示词
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      输出
    </lark-td>
    <lark-td>
      talk_content、emoji_id
    </lark-td>
    <lark-td>
      流式 TTS 播报与端侧展示（屏显禁用文本帧除外）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      输出
    </lark-td>
    <lark-td>
      action_list[]
    </lark-td>
    <lark-td>
      Tools 节点 → Agent Server 执行（下一节展开）
    </lark-td>
  </lark-tr>
</lark-table>

```go
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
```

# 工具执行：从 Graph 到 Agent Server

action_list 里的 tool_name 并不是一次普通函数调用。业务上说「Planner 调用 Agent」，但在 Eino Graph 内部每个 Agent 都被包装成 tool.BaseTool 放进 ToolsNode——Graph 只看见 tool，真正的 Agent 调用藏在工具的 StreamableRun 背后，链路如下：

<whiteboard token="YWNnwGLodhEampbrip4caAYnnXH" width="547" height="569"/>

1. GetPlannerAgentList（GetToolsByIDs 补充联网搜索等特殊工具）拿到一批 Eino tool，compose.NewToolNode 建 ToolsNode；
1. 模型 action_list 命中后，Eino 调 tool 的 StreamableRun（agent_server.AgentStreamHelper）；
1. 内部 NewAgentStreamRunner → RunAgent，这一步才真正进入 Agent Server；
1. Agent Server 按 agent_registry 的 AgentType 选 executor 执行，结果转成 observation 回灌 llm 继续推理；命中直返工具则 direct_return 结束。

<lark-table rows="7" cols="3" header-row="true" column-widths="150,260,410">

  <lark-tr>
    <lark-td>
      AgentType
    </lark-td>
    <lark-td>
      Executor
    </lark-td>
    <lark-td>
      能力域
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      AIDV (0)
    </lark-td>
    <lark-td>
      aidv_agent_list.NewAidvExecutor
    </lark-td>
    <lark-td>
      服务内置 Agent，本仓库直接实现，不走外部 agent 服务
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      DPFM (1)
    </lark-td>
    <lark-td>
      dpfm.NewDpfmExecutor
    </lark-td>
    <lark-td>
      车控、车辆领域工具与部分 ToB 模型能力（以 agent_registry 配置为准）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      Doubao (2)
    </lark-td>
    <lark-td>
      doubao.NewDoubaoExecutor
    </lark-td>
    <lark-td>
      豆包云能力：通用内容、搜索、豆包生态
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      Ecology (3)
    </lark-td>
    <lark-td>
      ecology.NewEcologyExecutor
    </lark-td>
    <lark-td>
      生态 / 第三方服务能力
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      Offline (4)
    </lark-td>
    <lark-td>
      端侧离线
    </lark-td>
    <lark-td>
      虚拟 Agent，端侧离线处理，无需加入 Planner
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      InternalRPC (5)
    </lark-td>
    <lark-td>
      internal_rpc.NewInternalRPCExecutor
    </lark-td>
    <lark-td>
      内部 RPC 服务型 Agent
    </lark-td>
  </lark-tr>
</lark-table>

代码位置：biz/service/agent_server/base.go（GetExecutor 按类型分发）、helper.go（AgentStreamHelper）、runner.go（RunAgent）。Planner 侧 Prompt 统一在 Fornax 管理（FuncPlannerAnalyzeText），线上链路 trace 看 Fornax、服务日志看 Argos。

# 关键机制

以下机制横跨上面多个阶段，是理解 Planner 行为的横切设计：

<lark-table rows="9" cols="2" header-row="true" column-widths="170,650">

  <lark-tr>
    <lark-td>
      机制
    </lark-td>
    <lark-td>
      实现要点
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      上下文组装
    </lark-td>
    <lark-td>
      buildHistoryMessages 重建 ReAct 时序并并入近 10 分钟最多 3 条车辆事件（resource_id 白名单走 TCC 配置），按真实时间稳定排序；formatContentMessage 把当前输入包成结构化 JSON（query / advisor / event、说话人、音区、时间戳）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      系统提示词与工具注入
    </lark-td>
    <lark-td>
      Context 产出经 ctx_msg(MsgKeyContextResult) 传入；GetPlannerAgentList 取在线工具集，BuildToolPrompt 拼成 tool_list 注入提示词变量；Prompt 本体在 Fornax 维护
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      结构化输出
    </lark-td>
    <lark-td>
      固定五字段 talk_or_not / talk_content / emoji_id / action_list / goal_list_update，JSONSchema strict；ExtractFirstJSON 保证入图消息只保留 JSON，破损 JSON 经 jsonrepair 修复
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      流式 TTS 与轮次协调
    </lark-td>
    <lark-td>
      talk_content 用 StreamExtractor 增量抽取，一段 [情感] 结束即 StartTTS；文本帧对屏显禁用、对 TTS 走 AnswerChunk；HasSendTTS / PlayTTSFinished 消息协调轮次，轮间等端侧播完
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      TTS 打断续说
    </lark-td>
    <lark-td>
      优先按逐字打轴 WordTimestamp 切已播 / 未播，缺打轴按 millisPerRune（默认 100ms / 字）估算，拼成「已播内容（这里被用户打断了，后面没说完：未播内容）」作为 last_talk_content 进下一轮上下文
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      四音区合并与可中断
    </lark-td>
    <lark-td>
      sound_zone_merge 基于 Redis 锁 + 缓存聚合同一 ChatID 多音区 query；ShouldBreak 检测更新 query，首 token 前允许打断，中断时执行中任务 Pending→Interrupted
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      拒识与兜底
    </lark-td>
    <lark-td>
      模型在首 token 位置输出 reject 前缀即判拒识（StreamChecker.HasPrefix），发 RefusalChunk 但不 return，让模型走完以保留完整信息；历史组装失败降级 History.ToEinoMessages，runTextPlanner 失败发 NewChatError
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      状态与落库
    </lark-td>
    <lark-td>
      图状态 GraphState（Messages / Round / Step）+ Eino 本地态 task.State（PlannerID、tool_call_id→task_id 映射、ReturnDirectlyToolCallID）；模型输出落 planner_histories，工具任务落 planner_task_list（AlwaysFinishedTools 直接置 finished）
    </lark-td>
  </lark-tr>
</lark-table>

# 模型相关

<lark-table rows="4" cols="4" column-widths="227,100,100,191">

  <lark-tr>
    <lark-td>
      EP
    </lark-td>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      模型/基座
    </lark-td>
    <lark-td>
      部署方式
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ep-20260623151246-89zn2
    </lark-td>
    <lark-td>
      基模
    </lark-td>
    <lark-td>
      2.1-turbo
    </lark-td>
    <lark-td>
      独立部署(模型单元)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ep-20260731162346-bsgms
    </lark-td>
    <lark-td>
      基模
    </lark-td>
    <lark-td>
      2.1-turbo
    </lark-td>
    <lark-td>
      低延迟保障包
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ep-20260710075059-8mjjb
      ep-20260720093313-g5b7d
    </lark-td>
    <lark-td>
      sft/rl
    </lark-td>
    <lark-td>
      2.0-lite
    </lark-td>
    <lark-td>
      模型单元
    </lark-td>
  </lark-tr>
</lark-table>

<lark-table rows="4" cols="2" column-widths="272,281">

  <lark-tr>
    <lark-td>
      SP
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      planner.task.analyze_text_saic_dna
    </lark-td>
    <lark-td>
      上汽PE版本SP [fornax.bytedance.net](https%3A%2F%2Ffornax.bytedance.net%2Fspace%2F7522018773168046082%2Fprompt%2Fdevelop%2F7590069223222469634)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      director.task.analyze_text_saic_dna
    </lark-td>
    <lark-td>
      上汽SFT版本SP [fornax.bytedance.net](https%3A%2F%2Ffornax.bytedance.net%2Fspace%2F7522018773168046082%2Fprompt%2Fdevelop%2F7590106024016269314)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      planner.task.analyze_text_seres
    </lark-td>
    <lark-td>
      赛力斯PE版本SP [fornax.bytedance.net](https%3A%2F%2Ffornax.bytedance.net%2Fspace%2F7522018773168046082%2Fprompt%2Fdevelop%2F7590107091699654914%3Fversion%3D0.0.67)
    </lark-td>
  </lark-tr>
</lark-table>

# 监控和看板

https://cloud.bytedance.net/argos/dashboard/691c619c2d02e1fcf8339791?dashboard_from=now-24h&dashboard_to=now&last_case_id&psm=vehicle.model.data_provider_for_model&region=China-North&site=cn&var-channel=&var-env=&x-bc-region-id=bytedance&x-resource-account=public

<image token="HkDIbHRomoHsZbx3g6ccYaW5nSb" width="2794" height="1254" align="center"/>

# 相关文档

<mention-doc token="K8Ihw3a4niaDNck7FEkcDXcOnfb" type="wiki">座舱Planner探索</mention-doc>

<mention-doc token="W8NYw7pGTi4RgEkPVyEcMqhinLh" type="wiki">【Planner】服务端技术评审 250910</mention-doc>

<mention-doc token="PNjwwtwtaiFG2VkGI5gcO3UjnSc" type="wiki">Planner json输出保障</mention-doc>

<mention-doc token="ZZfgwG6Iii09vBkwxascB9I5ny5" type="wiki">Planner模型资源评估和升级</mention-doc>
