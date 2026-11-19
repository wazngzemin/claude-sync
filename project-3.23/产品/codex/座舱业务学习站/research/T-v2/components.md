# T 章待补部件与概念候选

只登记候选，不修改全站卡片；已有卡片的展开概念注明关系。部署或数字未给出时如实留空，不能把技术方案写成上线事实。来源路径相对 research/。

## [C01] 任务系统与任务类型（卡片 33 的长期托管展开）
- 是什么：保存需后续恢复与跟进的用户事项；四类显式产品类型为单次/循环的定时/条件任务，持续目标、视觉和 GUI 需与技术设计分层。
- 在哪里运行：云端任务系统，最新版未给具体进程。
- 收到什么：用户延期或条件请求及账号、车辆。
- 输出什么：持久化任务、触发和状态；不是所有耗时动作都创建任务。
- 关键数字：定时类合计 20、条件类合计 20；计数主体及历史/终态是否计入未明；定时 1min–2周；地理围栏不支持。
- 来源：T-v2/feishu/task-product-intro-v1.2.md:8–47

## [C02] 任务与账号车辆绑定
- 是什么：任务归属当前账号与当前车辆的组合，对应账号在对应车退出后清空并停止推送；物理删除方式与完成时限未规定。
- 在哪里运行：任务系统，账号退出信号来自账号链路。
- 收到什么：账号、车辆及退出事件。
- 输出什么：原车不继续推送、同车重登不恢复、换车不迁移。
- 关键数字：未给清理时限。
- 来源：T-v2/feishu/task-product-intro-v1.2.md:38–43

## [C03] Task Service（自研任务托管边界）
- 是什么：统一接入、结构化、存储、触发协调、运行和查询通知的工程边界，复用 Planner 主链。
- 在哪里运行：云端 AIDV 的 task 域。
- 收到什么：Task Agent 文本、触发回调、GUI 请求、结果、端状态和查询。
- 输出什么：Task/Run 状态、任务视图、消息和执行请求。
- 关键数字：开发估算 24 人日；非上线状态。
- 来源：case-rewrite-20261029/async/T-management.md:718–953、1075、2449–2623

## [C04] 一期任务入口工具 Task Agent / task_manage
- 是什么：一期重构设计中Planner的纯入口，只透传任务文本及runtime_hint；与卡片37单次调用层不同，二期独立Agent见C24。
- 在哪里运行：云端 Agent Server 自建系统工具入口。
- 收到什么：action 参数 query、运行提示、公共信息。
- 输出什么：交 Task Ingress 的请求及给 Planner 的工具反馈。
- 关键数字：未给数值配额。
- 来源：case-rewrite-20261029/async/T-management.md:1098–1127、1697–1700、2126–2162

## [C05] Task Spec Builder（任务规格生成与目标定位）
- 是什么：模型把自然语言转 create/update/cancel/query 并在修改取消时定位原任务。
- 在哪里运行：云端 Task Service。
- 收到什么：任务文本、当前 TaskView、任务类型/运行提示。
- 输出什么：TaskCommand 和创建/修改所需 TaskSpec。
- 关键数字：开发估算 2 人日，未指定模型型号。
- 来源：case-rewrite-20261029/async/T-management.md:806–821、1853–1876、2499–2504

## [C06] TaskSpec（任务规格）
- 是什么：可保存的目标与执行条件定义，不是一次运行结果。
- 在哪里运行：云端随 Task 持久化。
- 收到什么：user_goal、execute_text、RuleSpec、RuntimeSpec、EndPolicy。
- 输出什么：Manager 使用的正式任务定义。
- 关键数字：结束策略含最大运行/失败次数但未给默认值。
- 来源：case-rewrite-20261029/async/T-management.md:1300–1326、1768–1770

## [C07] Run（一次运行）
- 是什么：Task 的一次实际执行，多个 GUI step 共用同一 Run。
- 在哪里运行：云端任务事实存储。
- 收到什么：任务激活、外部执行结果。
- 输出什么：运行状态、等待阶段、起止时间、原因。
- 关键数字：5 状态、4 阶段；等待规则可还没有 Run。
- 来源：case-rewrite-20261029/async/T-management.md:612–622、1346–1363、1384–1395、1772–1774

## [C08] TaskEvent（任务事件）
- 是什么：影响 Task/Run 的追加事实，同时用于审计、状态推进和通知。
- 在哪里运行：云端任务存储及 Manager。
- 收到什么：触发命中、执行结果、取消、下电、超时。
- 输出什么：带幂等键、外部编号、时间和摘要的事实。
- 关键数字：未给保留时长。
- 来源：case-rewrite-20261029/async/T-management.md:629–639、1397–1409、1449

## [C09] TaskBinding（外部关联）
- 是什么：把现有外部请求编号恢复为内部 Task/Run，避免要求车端新增任务编号。
- 在哪里运行：云端 Repository/Binding。
- 收到什么：vehicle_id、trigger/recommend/gui/provider/edge 外部编号。
- 输出什么：对应 task_id/run_id。
- 关键数字：通用运行要求先保存 recommend 关联再推送。
- 来源：case-rewrite-20261029/async/T-management.md:1170–1180、1411–1418、1980–1985

## [C10] TaskView 与 TaskMessage（查询与通知）
- 是什么：前者从事实生成只读当前视图，后者按状态事件主动通知；Snapshot 是可选优化。
- 在哪里运行：云端 Task Query / Message Dispatcher。
- 收到什么：Task/Run/Event 和分发策略。
- 输出什么：给 Planner、HMI、任务中心的视图或经 Frontier/SSE 的消息。
- 关键数字：查询上限可配置、未给默认值。
- 来源：case-rewrite-20261029/async/T-management.md:916–953、1279、1420–1445

## [C11] Trigger Adapter 与任务触发回调
- 是什么：任务侧注册/更新/撤销等待规则并接收命中，匹配由 G 章触发器负责。
- 在哪里运行：云端 Task Service，对接现有 Trigger。
- 收到什么：公共 RuleSpec、Task 变化、task_id/callback_id/触发时间。
- 输出什么：规则注册关系和可运行 Task/Run。
- 关键数字：命中不二次匹配；额外执行守卫可跳过。
- 来源：case-rewrite-20261029/async/T-management.md:872–887、1368、1702–1708、1929–1961

## [C12] 任务生命周期与结束策略
- 是什么：Task 主状态与 Run 执行状态分开，Run 成功不代表循环 Task 结束。
- 在哪里运行：云端 Manager 确定性编排。
- 收到什么：创建、激活、运行结果、取消、离线及策略。
- 输出什么：Task waiting/running/closed 和关闭原因、下一轮等待。
- 关键数字：Task 3 状态、关闭原因 5 类；Run 5 状态。
- 来源：case-rewrite-20261029/async/T-management.md:1305–1363、1455–1550

## [C13] Runtime Dispatcher 与生态 Provider
- 是什么：按任务运行类型选择通用执行或 GUI/第三方生态执行，不自行替代 Planner。
- 在哪里运行：云端 Task Service。
- 收到什么：Task/Run、general 或 ecosystem 及 provider。
- 输出什么：通用 Recommend 回 Planner 或 Provider 继续步骤，结果回 Ingress。
- 关键数字：GUI 多个 HTTP step 共一 Run；第三方扩展属后续。
- 来源：case-rewrite-20261029/async/T-management.md:894–909、1966–1992、2383–2397

## [C14] Task Result Hook（可靠结果回写）
- 是什么：用结构化结果可靠更新运行和任务，不依赖尽力而为 afterFlow。
- 在哪里运行：云端 Flow 完整响应收敛后与 Task Manager。
- 收到什么：AgentObservation、Tool/GUI 结果、TaskRef。
- 输出什么：幂等事务写 Run/Task/Event，失败重试补偿。
- 关键数字：未给重试次数或超时。
- 来源：case-rewrite-20261029/async/T-management.md:1192–1197、1994–2021

## [C15] 执行前守卫与本轮跳过
- 是什么：触发已命中后检查额外执行前提，避免无人座椅仍按摩。
- 在哪里运行：云端 Task Manager/Guard，读取 Context。
- 收到什么：本轮任务和最新执行约束。
- 输出什么：执行或 skipped 及原因。
- 关键数字：周期 skipped 后回 waiting；单次按策略结束。
- 来源：case-rewrite-20261029/async/T-management.md:674、1523–1533、1931–1959

## [C16] Script、Step/Action 与任务内事件推进（二期）
- 是什么：Script 是接下来有限步骤与等待条件的计划；Step 可调用能力、等事件、重新推理，执行步由 Runtime 转为 Action，不能和 Planner 一轮 action_list 等同。
- 在哪里运行：规划中的独立 Task Agent 与云端 Runtime；09月说明时尚未实施；10-22周报已报限定的座椅按摩/VLM上线，未证明通用Script全场景交付（SF-109.md:1626–1646）。
- 收到什么：已有任务、用户约束、能力、工具反馈/用户补充/车辆行程新事实。
- 输出什么：修订的后续计划、动作和等待；仍推进当前 Run。
- 关键数字：每 5 分钟播比赛是设计场景，非已交付指标；未给步骤上限。
- 来源：case-rewrite-20261029/async/T-service.md:57–104、232–238、246、268–298

## [C17] Extour Goal 目标引擎与动态 Advisor（上汽分支）
- 是什么：Extour 是上汽未来目标的托管及条件判断方；动态 Advisor 是用户创建的未来目标回流链路，不是预设静态主动服务。
- 在哪里运行：Extour 外部目标引擎；AIDV Goal 层做接入、回调、Frontier 推送。
- 收到什么：add_goal/goal_content、query/history/车辆账号；Goal 触发事件。
- 输出什么：Goal 列表与创建/失败/trigger 回调，触发建议回主链 Planner。
- 关键数字：request 创建关联 60s，推荐回流缓存 10min；09-08 正文，09-18 最后编辑。
- 来源：case-rewrite-20261029/async/T-dynamic.md:7–15、42–138、341–343

## [C18] Goal List 与 Goal 生命周期回调
- 是什么：Goal List 查询当前有效目标用于 Planner 背景和车端；callback 将创建成功卡、失败原因和触发推荐分路。
- 在哪里运行：上汽 AIDV Goal 接口对接 Extour。
- 收到什么：POST /goal-list；POST /goal/lifecycle_callback 三事件、目标/请求/推荐编号。
- 输出什么：goal_list；create_success 卡片、create_failed/trigger 推荐；不表示实际执行成功。
- 关键数字：创建/推荐缓存分别 60s/10min；无 updated/完成回调。
- 来源：case-rewrite-20261029/async/T-dynamic.md:76–126、266–343

## [C19] 视觉长时观察 dynamic_watch_tasks（A 章能力的任务侧）
- 是什么：将感知需求改成可重复观察的目标，混入舱内高频视觉感知 AlwaysOn（此处不是全时语音免唤醒），每轮返回各目标结果；感知模型能力留 A 章。
- 在哪里运行：TaskService 云端管理；车端 VLM/SDK 执行观察，结果上云。
- 收到什么：全量任务列表，任务编号与 user_query/感知目标；舱内视觉感知总开关（本视觉原文的 AlwaysOn）。
- 输出什么：带编号的动态感知整包，通过独立于默认感知的 Topic 上报。
- 关键数字：并发最多 3；预计周期 6–7s，有抢占漏报；修改编号不变、关闭发空列表。
- 来源：case-rewrite-20261029/async/T-visual.md:132–182、188–244、250–315

## [C20] 视觉结果接收、逐条转发与过期保护
- 是什么：任务侧将车端动态观察整包拆成逐任务调用 TriggerRun 接口（不是生成 Task Run 对象），并记录有效/过期/关闭/转发失败。
- 在哪里运行：车端 AI Service→云端 TaskService→Trigger。
- 收到什么：POST VLM result/report 的 task_id、可选版本、毫秒时间戳、result。
- 输出什么：对 TriggerRun 的单次接口调用、计数和异步结果日志；命中再 callback 回主链。
- 关键数字：上报差超过 20s 仅落库；并发3；Method13、message_type4；errno0不保证转发成功。
- 来源：case-rewrite-20261029/async/A-task.md:384–608、783–815

## [C21] 唯一托管方选择与渠道边界
- 是什么：按项目选唯一目标事实与生命周期托管：赛力斯Task Service，上汽Extour Goal；不同于同工具多项目实现（卡片38），不可同一目标双写双触发。
- 在哪里运行：云端项目配置与各托管系统；具体选择配置字段在已读源未给出。
- 收到什么：渠道、项目、车辆账号与任务请求。
- 输出什么：路由到唯一托管方，再复用主Planner；状态不能直接跨实现硬映射。
- 关键数字：seres与saic-dna；上汽应用99220。
- 来源：case-rewrite-20261029/async/T-service.md:3–13；case-rewrite-20261029/async/T-dynamic.md:7–15、140–142；case-rewrite-20261029/async/T-goal.md:65–87；按渠道选唯一托管是本轮给定研究范围与避免重复执行的归纳原则；实际选择配置字段未给出

## [C22] 任务状态同步与查询修复（不含U界面设计）
- 是什么：云端保存的任务事实经消息推给车端，失败后上电主动查询修正视图；状态通知不是任务执行命令。
- 在哪里运行：TaskService云端→Frontier→车端；任务岛/list补查。
- 收到什么：Task事件、状态及版本，或上电查询。
- 输出什么：创建/关闭/更新消息、只读任务列表；TaskMessage与ui_control分开。
- 关键数字：Method13；message_type1/2/3，视觉观察4；毫秒更新时间。
- 来源：case-rewrite-20261029/support/task-island.md:548–554、918–1069、1161–1186；case-rewrite-20261029/support/U.md:397–403；case-rewrite-20261029/async/A-task.md:213–242

## [C23] goal_list_update 持续目标入口与 task_agent 代际
- 是什么：07月上汽SP用此工具创建/删除持续、条件、定时目标，query里是JSON；E工具说明L64另将VLM目标排除且写365天限制，与旧SP及10-24产品冲突，须按实现分层；11月快照区分AIDV内部goal_list_update与调用独立服务的task_agent/task-agent，不能直接等同Task Service纯入口task_manage。
- 在哪里运行：上汽AIDV接入Extour；内部长时目标实现也在AIDV云端，不是车端离线。
- 收到什么：add_goal+goal_content 或 delete_goal+goal_id；当前goal_list用于相似/补充识别。
- 输出什么：目标创建/关闭请求、工具反馈和后续异步生命周期回调。
- 关键数字：创建关联60s、推荐回流10min为上汽支路缓存；11-04只是静态配置快照。
- 来源：chapters/F/raw/saic-sp-0731-tools.txt:113–119；chapters/F/raw/tool-list.txt:35、50–64；case-rewrite-20261029/async/T-dynamic.md:341

## [C24] 独立 Task Agent（二期限定能力，区别一期纯入口）
- 是什么：任务理解/修改/执行迁到独立服务的二期形态；09月方案由模型生成Script、Runtime推进，10-22周报只确认按摩档位/VLM限定场景上线，不能把整个方案都视为完成。
- 在哪里运行：云端独立任务服务；数据接口仍保留AIDV；具体模型型号未给出。
- 收到什么：Planner分发的任务文本、已有任务、约束与用户补充/观察结果；完整新协议原文未找到。
- 输出什么：限定任务创建/修改/执行及结果；Script/Step/恢复能力以方案和实际交付逐项区分。
- 关键数字：周报预期5核心case，实际当期仅按摩/VLM、兜风对接；赛事数据获取不到。
- 来源：case-rewrite-20261029/async/T-service.md:13、57–104、270–298；coverage-expansion/sweep-config/SF-109.md:1626–1646
