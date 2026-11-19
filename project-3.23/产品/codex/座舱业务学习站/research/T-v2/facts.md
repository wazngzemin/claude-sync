# T 章事实研究底稿

仅研究；不作为已上线承诺。来源路径默认相对 research/，行号以本地转存为准。每条保留“产品约束 / 技术设计 / 当时现状 / 讨论 / 推断”的证据等级；新旧冲突并列，不用转存日期代替内容发布日期。

现状阅读提醒：09 月的一页说明说二期“尚未实施”；10 月 22 日周报已报座椅按摩/VLM限定场景上线，11 月 3 日文字记录仍在安排验收，11 月 15 日有初测残留问题；下文每条“现状”只限对应来源与时间，不用旧说明覆盖后续进展。

## 1. 什么算任务与任务类型
- [F001] 【产品 v1.2】任务要求无法在一轮即时连续 ReAct 内闭环，且被插入话题打断后恢复价值高、需要后续跟进；打开车窗、同轮演示彩虹氛围灯和下发后独立研究 SKILL 分别属于三个反例。L8–18（来源：`T-v2/feishu/task-product-intro-v1.2.md`）
- [F002] 【产品 v1.2】显式列出的四类为单次定时、循环定时、单次条件、循环条件，例子分别是 30 分钟后关音乐、每 5 分钟播 NBA、续航低于 100km 提醒充电、每次电量低于 10% 加最近充电站为途经点。L20–24（来源：`T-v2/feishu/task-product-intro-v1.2.md`）
- [F012] 【技术设计】Task 是用户发起后无法在当前同步会话一次完成、仍需等待、持续运行、多轮交互或后续管理的实体，目标用唯一顶层业务抽象统一异步、周期、条件和 GUI 任务。L234–240、391–393（来源：`case-rewrite-20261029/async/T-management.md`）
- [F013] 【技术设计】本期包括延时开窗、温度条件开空调、每小时按摩、取消按摩、GUI 瑞幸下单和宝宝哭泣视觉条件，即时开窗排除；周期按摩示例持续到车辆下电或用户取消。L244–385（来源：`case-rewrite-20261029/async/T-management.md`）
- [F014] 【技术设计】GUI Agent 管内部步骤，Task 管外层一次运行，不能用 HTTP 请求次数当任务运行次数。L341–351、612–622（来源：`case-rewrite-20261029/async/T-management.md`）
- [F056] 【现状说明】赛力斯自研 Task Service 承接原动态 Advisor 的时间、条件、周期及 GUI 多步任务，具体动作归 Planner、Agent/Tool 或 GUI Runtime。L3–13（来源：`case-rewrite-20261029/async/T-service.md`）
- [F057] 【09月说明时的二期边界】通用长时复杂任务需要跨同步会话、结合新信息调整多个动作，独立 Task Agent 编排与 Runtime 执行尚未实施。L11–13、268–272（来源：`case-rewrite-20261029/async/T-service.md`）
- [F102] 【视觉设计】动态感知借舱内高频 AlwaysOn 承载，按任务编号与改写的感知目标让 VLM 每轮同时输出默认和动态任务结果，可观察乘客状态、行为、物品、安全因素和上下车。L132–146（来源：`case-rewrite-20261029/async/T-visual.md`）
- [F174] 【10-22文字记录】即时任务现在能做完无需后续跟进，一轮可一项或多项动作；持续任务用于当下无法闭环需跟进，如订座、观察二排老人、介绍沿途风景，不等于宣讲列例都上线。L57–62、187–207，00:08:21–09:05、00:28:59–33:38（来源：`v-lesson-20261105/director-talk.md`）
- [F175] 【多步区分】逐个开主副驾后窗、依次彩虹颜色是在连续ReAct中等反馈再下一步的即时多步例，不因步骤多就成为长期任务。L197–202，00:31:52–32:42（来源：`v-lesson-20261105/director-talk.md`）
- [F223] 【早期上汽局限】当时泛化沿途风景/逐个国君/持续夸副驾尚不能实现，长时仅若干特调query如讲笑话逗笑、介绍按摩模式，不能用设计例推断泛化能力。L111–169（来源：`case-rewrite-20261029/coverage-summary-20261030.json → extraReads[2].content.content（DNA-616二期OnePage，内嵌行）`）


## 2. 创建与任务入口
- [F015] 【技术设计】Planner 只通过 task_manage 传任务文本及可选 runtime_hint，Task Agent 是纯入口，不判断新增/修改/取消、不生成任务规格。L740–777、1098–1127、2126–2162（来源：`case-rewrite-20261029/async/T-management.md`）
- [F016] 【技术设计】入口先读取当前 TaskView，Spec Builder 用模型识别 create/update/cancel/query 并定位目标任务，创建/修改才生成 TaskSpec，Manager 执行确定的操作。L806–843、1851–1895（来源：`case-rewrite-20261029/async/T-management.md`）
- [F017] 【技术设计】创建先 Repository 保存 Task 及必要 Run，再注册 Trigger，再启动立即运行的生态任务，最后发状态事件。L1899–1922（来源：`case-rewrite-20261029/async/T-management.md`）
- [F018] 【失败边界】创建伪代码在持久化、触发注册或启动失败时直接返回错误，未写清“已存任务但注册失败”的补偿、用户回报文本及最终状态。L1907–1918、1847–1849（来源：`case-rewrite-20261029/async/T-management.md`）
- [F058] 【现有流程】主对话由 Planner 选 Task Agent 入口，任务服务结合已有任务生成定义并校验，先保存 Task 再注册 Trigger，返回创建结果；明确 GUI 请求走专门分支。L232、248–250（来源：`case-rewrite-20261029/async/T-service.md`）
- [F077] 【上汽已接入】Planner 用长时工具 type=add_goal、goal_content 创建，AIDV 补 query/history/车辆身份调 Extour create_goal，creating 仅受理，当轮不播成功、等创建回调。L42–52、126–136、165–175（来源：`case-rewrite-20261029/async/T-dynamic.md`）
- [F078] 【上汽操作】语音 delete_goal 用 g-<id> 形式目标编号，车端详情/操作用数值 goal_id，需做边界适配而不能直接混用。L59–86（来源：`case-rewrite-20261029/async/T-dynamic.md`）
- [F103] 【视觉创建校验】舱内视觉感知总开关（此视觉原文的 AlwaysOn）是动态观察下发前提，关闭时须告知功能未开并引导开启，超出并发应反馈而不能答应持续观察。L148–176、232–246（来源：`case-rewrite-20261029/async/T-visual.md`）
- [F104] 【视觉改写】TaskService 将“感知+推理”请求改成纯感知目标并消解座位指代，VLM 只承担观察，用户一分钟一次反馈由任务侧计时而不是要求 VLM 精确一分钟。L236–244（来源：`case-rewrite-20261029/async/T-visual.md`）
- [F117] 【视觉技术设计】任务类型 spec.task_kind 暂定 cabin_vision，创建先查 AlwaysOn，未开或同时超过 3 个拒绝创建；类型名仍待随 Agent 输出对齐。L173–185（来源：`case-rewrite-20261029/async/A-task.md`）
- [F167] 【SOP核心】异步任务推理二级项含定时、条件、定义管理、运行结果、事件步骤关联、视图同步和Script调整；任务入口工具行二级名空白但父功能明列持续目标管理/任务管理工具，不可漏掉。工作表【子功能】对话推理 行10–16；【子功能】座舱工具集合 行3（来源：`/Users/bytedance/Downloads/yx-files/AI汽车SOP功能清单 (1).xlsx`）
- [F176] 【创建合理性】Director 先判任务逻辑合理、下游能承接，条件任务尤其要能检测条件、能执行动作、符合价值观；“能听懂”不能代替真实观察与执行能力。L192、207，00:30:23、00:33:38（来源：`v-lesson-20261105/director-talk.md`）
- [F215] 【PRD五检查】创建条件任务须确认可感知、有触发可能、动作符合价值观、可执行、条件与动作无矛盾，例副驾吃饭不可感知、外温200℃不可能、空调50℃不可执行、污染时开窗矛盾。L815–822（来源：`chapters/D/raw/director-prd.txt`）
- [F216] 【模糊语义示例】明确阈值但动作模糊可保留目标“28度让我凉快”；模糊“温度高”示例落26度、疲劳播放林俊杰是原PRD演示选择，不是所有用户请求默认阈值/歌曲。L824–856（来源：`chapters/D/raw/director-prd.txt`）
- [F224] 【上汽导航前提】08-05澄清无系统地理围栏、只拿到导航途经点/终点，无有效导航点则任务不可执行，用户指定地点不在导航时要求先加入途经点/终点。L386–420（来源：`case-rewrite-20261029/coverage-summary-20261030.json → extraReads[2].content.content（DNA-616二期OnePage，内嵌行）`）
- [F225] 【旧异步交互】原流程先肯定承诺、后台异步创建5–10秒，失败再报不支持，成功静默；616 off改造方案才要求中性垫句、补明条件动作并成功补报，不能写成当前全渠道统一行为。L637–669（来源：`case-rewrite-20261029/coverage-summary-20261030.json → extraReads[2].content.content（DNA-616二期OnePage，内嵌行）`）
- [F239] 【07-31旧工具定义】goal_list_update 用 params.query 内JSON字符串表达 add_goal/goal_content 或 delete_goal/goal_id，覆盖持续、条件、定时目标；已有相似目标或原目标补充不再新建，离谱条件或危险动作不创建。L113–119（来源：`chapters/F/raw/saic-sp-0731-tools.txt`）
- [F241] 【11-04配置快照】task_agent和task-agent为兼容到独立vehicle.agent.task的新旧任务入口，goal_list_update是AIDV内部长时目标管理，两条实现链不同，“本地”在此是服务内而不是车端离线。L35、61（来源：`chapters/F/raw/tool-list.txt`）
- [F242] 【工具快照边界】表注明快照只核对配置与工作区实现，未验证线上部署或逐一调用，启用不等于可调用，“全部”只指已配渠道而非所有渠道。L50–64（来源：`chapters/F/raw/tool-list.txt`）
- [F343] 【目标工具定义】持续目标管理工具新增仅传目标内容，删除须传实际goal_id，全部删除将当前goal_list转换成英文逗号分隔全部ID，模糊“取消这个”必须先定位。L64（来源：`chapters/E/raw/tools-io.txt`）
- [F344] 【复合请求拆分】“帮我开5分钟空调”先查空调状态，已开只建5分钟后关闭，未开先打开再建关闭目标，交给目标工具的内容只能是延后关闭部分。L64（来源：`chapters/E/raw/tools-io.txt`）
- [F345] 【目标工具回包】创建中应中性表达、不得提前承诺，后续结果才算创建成功；删除成功回任务清理，删除失败提示去任务中心手删。L64（来源：`chapters/E/raw/tools-io.txt`）


## 3. 数据结构、归属与限制
- [F003] 【产品 v1.2】定时加循环定时合计最多 20 个，条件加循环条件合计最多 20 个，原文没有进一步说明计数包含哪些终态记录。L30–33（来源：`T-v2/feishu/task-product-intro-v1.2.md`）
- [F004] 【产品 v1.2】定时仅支持 1 分钟至 2 周，当前不支持地理围栏类任务，理由标为下游限制。L34–36（来源：`T-v2/feishu/task-product-intro-v1.2.md`）
- [F005] 【产品 v1.2】任务绑定账号与车辆，账号在当前车退出时清空，在同车重登不恢复、换车登录不迁移。L38–43（来源：`T-v2/feishu/task-product-intro-v1.2.md`）
- [F019] 【技术设计】Task 是聚合根，TaskSpec 定义用户目标、执行文本、触发规则、运行方和结束策略，Run 记录一次执行，Event 是追加事实，Binding 关联外部标识，TaskView 查询和 TaskMessage 通知分离。L1277–1319、1397–1445（来源：`case-rewrite-20261029/async/T-management.md`）
- [F020] 【技术设计】Task 保存 common_info、状态、结束原因、运行次数、版本和创建/更新时间，Run 保存 task_id、vehicle_id、运行方、状态、阶段、原因、幂等键和起止时间。L1370–1395（来源：`case-rewrite-20261029/async/T-management.md`）
- [F021] 【技术设计】结束策略支持成功即关闭、车辆离线关闭、到期时间、最大运行次数、最大失败次数，用户取消是通用能力而不是规格字段。L1305–1311（来源：`case-rewrite-20261029/async/T-management.md`）
- [F022] 【技术设计】任务等待时可以没有 Run，激活或 GUI 开始执行才生成 Run，TaskRuntime 只是单次服务内存上下文、不能整份落库。L1738–1797（来源：`case-rewrite-20261029/async/T-management.md`）
- [F023] 【技术设计】Binding 用 vehicle_id 加外部标识关联 Task/Run，类型包括 trigger_rule、recommend、gui_request、provider_session、edge_command，客户端无需新增内部任务编号。L1170–1180、1411–1418（来源：`case-rewrite-20261029/async/T-management.md`）
- [F024] 【技术设计】所有任务数据库读写必须携带 vehicle_id，细化并发、幂等及补偿在编码阶段补充；安全配置只有活跃任务上限和查询条数上限且没有给默认数字。L2026、2032–2040（来源：`case-rewrite-20261029/async/T-management.md`）
- [F059] 【对象分层】Task/TaskSpec 是目标定义，Run 是一次执行，Script 及 Step/Action 属二期执行编排，Event 现有、扩展事件与 Snapshots 属二期，TaskView 可查询而生命周期通知独立。L15–104（来源：`case-rewrite-20261029/async/T-service.md`）
- [F079] 【上汽对象】Goal 是持续管理目标，一次 trigger 是单次通知，各次有效触发生成不同 recommend_id，某条建议进入 Planner 不代表整个 Goal 完成。L11–15（来源：`case-rewrite-20261029/async/T-dynamic.md`）
- [F080] 【上汽关联时限】request_id 创建关联缓存 60 秒，recommend_id 回流关联缓存 10 分钟，不同触发应不同幂等键、同事件重试复用原键，不能只按 goal_id 去重。L341（来源：`case-rewrite-20261029/async/T-dynamic.md`）
- [F095] 【上汽接口】POST /aidv/v1/goal-list 的 Body 是空对象，Query 必带 channel=saic-dna、channel_app_id=99220、vehicle_id、vehicle_type、app_id、account_id、login_doubao_uid、device_id，查询当前账号有效目标。L7–22、50–219（来源：`case-rewrite-20261029/async/T-goal.md`）
- [F105] 【视觉配额】视觉原文限同时 3 个动态观察、编号不重复，产品另列定时/条件各 20；二者是否共占逻辑任务配额未说明，需分层呈现而不能直接叠加（研究区分）。L148、232（来源：`case-rewrite-20261029/async/T-visual.md`）
- [F143] 【任务岛协议】任务分类有 execution_type=active_planner/ecology、trigger_type=time/condition/continuous、schedule_type=once/cycle，和 Task 生命周期三个不同维度。L152–310（来源：`case-rewrite-20261029/support/task-island.md`）
- [F144] 【状态协议代际】任务岛载荷含任务编号、执行/触发/循环类型、status、毫秒 updated_at、task_version，生命周期枚举 created/waiting/running/closed，比核心设计多 created。L918–1069（来源：`case-rewrite-20261029/support/task-island.md`）
- [F154] 【界面PRD】我的任务上限写 46=定时20+条件20+通用长时6，静态主动服务/系统预设不设此数量限制；后者不是所有后端对象无限的证据。L214–228（来源：`case-rewrite-20261029/support/U.md`）
- [F168] 【SOP旧限额】持续目标管理工具描述仍写最多6个定时/条件任务、1个持续目标，与10-24产品各20不同。全量功能清单 行27；【子功能】座舱工具集合 行3（来源：`/Users/bytedance/Downloads/yx-files/AI汽车SOP功能清单 (1).xlsx`）
- [F206] 【配额缺口】最新产品只给定时类/条件类各合计20，未显式规定计数主体是每车、账号或账号×车，也未规定终态/历史记录是否计入，绑定规则不能代替配额实现细则。L30–43（来源：`T-v2/feishu/task-product-intro-v1.2.md`）
- [F226] 【旧时间规则】历史方案最小循环1分钟、提醒分钟级合并不承诺秒级、超365天不能建；模糊日期需澄清，只有日期或日期时段转首次上车/在车条件，未区分上下午钟点取最近未来。L490–548（来源：`case-rewrite-20261029/coverage-summary-20261030.json → extraReads[2].content.content（DNA-616二期OnePage，内嵌行）`）
- [F227] 【已删除限制】循环最多30次已划删除线，不可当现行配额。L571–573（来源：`case-rewrite-20261029/coverage-summary-20261030.json → extraReads[2].content.content（DNA-616二期OnePage，内嵌行）`）


## 4. 两套托管与项目选择
- [F025] 【技术设计】Task Service 是整体工程边界，内部包括 Ingress、Spec Builder、Manager、Repository、Trigger Adapter、Runtime Dispatcher、Query 和 Message Dispatcher，不是新增一条 Planner 主链。L718–953、1073–1075（来源：`case-rewrite-20261029/async/T-management.md`）
- [F026] 【技术设计】静态预设 Advisor 继续由 extour 负责，本期计划将动态 Advisor 融合进任务管理，之后不再保留动态 Advisor 概念；这是自研重构设计，不能直接覆盖上汽 Extour 现行分支。L244–248（来源：`case-rewrite-20261029/async/T-management.md`）
- [F081] 【上汽现状】saic-dna 由 Extour Goal 托管创建、条件判断和目标状态，AIDV 负责回调/推送，Planner 主链继续规划与执行，有效列表注入 goal_list。L3–15、140–142（来源：`case-rewrite-20261029/async/T-dynamic.md`）


## 5. 等待与触发回流
- [F027] 【技术设计】Task 复用 Trigger 公共 RuleSpec，首期由适配器序列化为旧注册接口的 conditions/actions/execute_policy，Task 不再维护第二套规则语言。L1136–1146、1368（来源：`case-rewrite-20261029/async/T-management.md`）
- [F028] 【技术设计】Trigger 匹配延时、条件、周期及 VLM 语义后回调 task_id、callback_id，Task 恢复任务并新建一次 Run，不重复判断原条件。L960–975、1449、1929–1949（来源：`case-rewrite-20261029/async/T-management.md`）
- [F029] 【技术设计】触发后只有额外执行前约束才读取 Context 作执行/跳过判断，例如座位无人跳过本轮按摩，这是执行守卫而不是重复触发匹配。L674、1931、1952–1959（来源：`case-rewrite-20261029/async/T-management.md`）
- [F030] 【技术设计】通用运行先生成 recommend_id 并持久化绑定，再经 Recommend/Frontier 唤醒车端，车端上行进 beforeFlow 还原 Task/Run 后回 Planner 重算本轮动作。L1170–1180、1980–1990（来源：`case-rewrite-20261029/async/T-management.md`）
- [F031] 【技术设计】视觉观察配置及语义目标归 Trigger RuleSpec，车端按观察任务周期报描述，Trigger 完成语义匹配后回调 Task，Task 不作二次条件匹配。L1556（来源：`case-rewrite-20261029/async/T-management.md`）
- [F060] 【现有流程】时间/条件回调或 GUI 步骤请求驱动推进，回调需校验有效性与执行前提，普通任务经 Recommend/Frontier→车端→推荐标识上行→主链恢复任务关联→Planner。L234、252–254（来源：`case-rewrite-20261029/async/T-service.md`）
- [F082] 【上汽回调】create_success 直接发创建卡且不进 Planner，create_failed 将原因变推荐、trigger 将建议带目标关联，经 Frontier 下发后等车端携 vehicle_recommend_id 上行回 Planner。L98–120、136、266–335（来源：`case-rewrite-20261029/async/T-dynamic.md`）
- [F083] 【上汽身份】请求需保持 channel/车辆/设备/用户一致并补应用车型，回调校验有效账号车辆和设备当前登录账号，occurred_at 须为正值。L126、341（来源：`case-rewrite-20261029/async/T-dynamic.md`）
- [F084] 【上汽同步】QA 完成后 /planner_event/qa_finish 异步发问答和历史，拒识或缺车辆账号跳过，问答同步、建议消费和目标修改独立观测。L138（来源：`case-rewrite-20261029/async/T-dynamic.md`）
- [F106] 【视觉时序】预计 6–7 秒一轮感知但会波动，高优先任务抢占可能使其无法推理/上报，所以此数字不是保证触发时延。L134、188–194（来源：`case-rewrite-20261029/async/T-visual.md`）
- [F107] 【视觉输入输出】云下发含任务编号与 user_query，默认感知和动态感知由 VLM-SDK 拆两 Topic，所有动态任务合一个 Topic，动态空数组不发布。L196–224、250–275（来源：`case-rewrite-20261029/async/T-visual.md`）
- [F108] 【视觉关联】动态结果整包返回，含任务编号，TaskService 接收后需关联已下发观察目标。L279–304（来源：`case-rewrite-20261029/async/T-visual.md`）
- [F118] 【视觉任务链】TaskService 生成/下发观察 UP，接 VLM 数据同步 Trigger，Trigger 推理命中后 callback TaskService，再走主动推荐回 Planner。L82–84、187–209、596–608、807–815（来源：`case-rewrite-20261029/async/A-task.md`）
- [F119] 【视觉注册】复用 RegisterScene，SceneType=vlm_inference，旧 conditions/dynamic_conditions 合入 condition_params，inference_params.goal 带语义目标。L187–210（来源：`case-rewrite-20261029/async/A-task.md`）
- [F120] 【视觉下发】Frontier Method=13、message_type=4 下发全量 dynamic_watch_tasks，实际字段为 occurred_at、task_id、task_version、target，版本用于防旧覆盖新。L213–242、248–381（来源：`case-rewrite-20261029/async/A-task.md`）
- [F121] 【视觉回报】车端 POST /aidv/v1/task/vlm/result/report，以毫秒 occurred_at、任务数组、task_id/result、可选 task_version 上报，结果数组须转换成实际接口参数。L384–594（来源：`case-rewrite-20261029/async/A-task.md`）
- [F122] 【转发隔离】TriggerRun 一次只接一条任务，按 VLM 数组逐条调用且单条失败不影响其他条；已关闭任务只落库不转发并重下最新观察列表。L596–606（来源：`case-rewrite-20261029/async/A-task.md`）
- [F123] 【过期保护】上报时间与服务端时间差超过 20 秒只落库不转发，不能让旧观察重新触发任务。L608（来源：`case-rewrite-20261029/async/A-task.md`）
- [F177] 【10-22链路确认】Planner 模型本身不能持续跟进，任务系统作为工具接下目标并注册触发器，到条件时任务侧以 advice 把信息/要做动作送回 Director 再处理。L207、347，00:33:38、00:56:23（来源：`v-lesson-20261105/director-talk.md`）
- [F178] 【输入区分】主动服务和任务定时/条件/长时触发都走 advice，但工具结果 feedback 另路继续 ReAct，记忆也不是 advice，来自 Context预检索或工具补查。L77–92、347–357，00:11:16–13:29、00:56:23–57:19（来源：`v-lesson-20261105/director-talk.md`）
- [F211] 【新输入管理契约】每个Task Run形成一条独立Input，相同task_run_id的重复回流仅幂等、不新增等待项，任务有效期DeadlineAt由Task Service管而非输入管理通用TTL。L1370–1382（来源：`case-rewrite-20261029/main/source-M-tech.md`）
- [F212] 【异步反馈扩展】新技术契约预留异步feedback无论旧执行身份是否失效都成新Input，但当前已写M章把独立长时异步工具结果列后续扩展，T不可把预留契约写成全部已接。L1370–1382；对照M-v2/full.md L96、338–340、536–540（来源：`case-rewrite-20261029/main/source-M-tech.md`）
- [F350] 【前章边界】用户亲设提醒到点采用P0打断还是P1排队需产品预先选择，不能仅因用户创建就视为高优先；同任务不同task_run_id各自独立，TaskRoundID是语音整轮/执行身份而非业务Run。L216–228、368、782、788（来源：`M-v2/full.md（已写正文，用于交接边界回指）`）
- [F351] 【期限边界】输入管理不设业务队列TTL/容量不代表任务无限有效或可无限创建，Task有效期与配额归任务服务；推理时可刷新车况但保留原触发发生时间。L222–228、298（来源：`M-v2/full.md（已写正文，用于交接边界回指）`）


## 6. 运行与结果
- [F032] 【技术设计】Task 只有 waiting/running/closed 三个主状态，关闭原因分 finished/canceled/expired/failed/vehicle_offline。L1328–1344（来源：`case-rewrite-20261029/async/T-management.md`）
- [F033] 【技术设计】Run 状态为 running/succeeded/failed/skipped/canceled，运行阶段分 executing、等待用户确认、等待客户端、等待外部。L1346–1363（来源：`case-rewrite-20261029/async/T-management.md`）
- [F034] 【技术设计】成功 Run 按结束策略关闭任务或回到 waiting，失败 Run 达失败策略才关任务，周期任务跳过后回 waiting，单次任务跳过按策略结束。L1489–1533（来源：`case-rewrite-20261029/async/T-management.md`）
- [F035] 【技术设计】GUI RUNNING 映射运行中并携带阶段，多个 GUI HTTP 步骤沿 request_id 恢复同一个 Task/Run，SUCCESS/FAIL 才转对应执行结果。L1472–1482、1992（来源：`case-rewrite-20261029/async/T-management.md`）
- [F036] 【技术设计】Flow 完整响应收敛后用 AgentObservation 和结构化工具结果构建 RunResult，经独立 Task Result Hook 幂等事务更新 Run/Task/Event，写入失败需重试或补偿。L1187–1197、1994–2021（来源：`case-rewrite-20261029/async/T-management.md`）
- [F037] 【技术设计】现有 afterFlow 是异步尽力而为收尾，不能提供可靠任务状态写入；单轮 planner_task 表只审计工具调用，不承担跨轮任务事实。L1192–1197、1221–1231（来源：`case-rewrite-20261029/async/T-management.md`）
- [F061] 【结果依据】车控以结构化执行状态判断，内容任务以有效内容结果判断，结果回写后按次数/期限/结束策略继续或清规则关闭；Run 完成不代表音频已播完。L256–258（来源：`case-rewrite-20261029/async/T-service.md`）
- [F062] 【GUI现状】GUI 创建即有 Task/Run，后续 request 标识加步骤号关联同一 Run，运行中续接，成功/失败结束，启动成功只表示开始。L260–262（来源：`case-rewrite-20261029/async/T-service.md`）
- [F063] 【二期设计】周期按摩每次触发生新 Run，而比赛持续播报计划在同一 Run 内等待/查询/播报/修订 Script，确认终场总结交付才结束。L104、216–226、246、270–280（来源：`case-rewrite-20261029/async/T-service.md`）
- [F085] 【上汽状态】creating 仅创建受理，consumed 仅进入 Planner，done 是端侧状态同步且完成/关闭共用，callback 无 updated 或完成事件。L343（来源：`case-rewrite-20261029/async/T-dynamic.md`）
- [F086] 【上汽消费缺口】trigger 推荐消费通知待接通，回调处理成功不代表用户听到播报，不能用 consumed 声称目标执行成功。L308–335（来源：`case-rewrite-20261029/async/T-dynamic.md`）
- [F096] 【Goal状态】接口枚举 creating/pending/running/done，分别创建中/待执行/执行中/已结束，不能与自研 Task 三状态或上汽推荐 consumed 状态硬映射为同一状态机。L503–587（来源：`case-rewrite-20261029/async/T-goal.md`）
- [F124] 【视觉输出类型】周期汇报由 Trigger 定时触发；目标达成如讲故事哄睡则关闭、推荐回 Planner 并重下有效观察列表；持续看护遇需介入时汇报；对象离车或任务已关闭则关闭并重下列表。L813–953（来源：`case-rewrite-20261029/async/A-task.md`）


## 7. 修改、取消、关闭与清理
- [F006] 【产品 v1.2】语音禁用不改变已建任务的触发策略，仍触发但只出卡片、不播语音。L45–46（来源：`T-v2/feishu/task-product-intro-v1.2.md`）
- [F007] 【产品 v1.2】关闭 AI 功能需弹窗告知将清空定时、循环定时、条件、循环条件任务，用户确认才清空、取消则保留。L47（来源：`T-v2/feishu/task-product-intro-v1.2.md`）
- [F038] 【技术设计】修改替换允许变动的 TaskSpec 并同步 Trigger，取消关闭当前 Run、停止 Trigger/生态 Provider、设 closed(canceled) 并发状态消息。L1927（来源：`case-rewrite-20261029/async/T-management.md`）
- [F039] 【技术设计】首期 vehicle_offline 强状态进入 Task Handler，关闭本次行程 Task；普通车况只供触发或执行判断，不在 Context 维护生命周期。L1158–1163、2026、2281–2292（来源：`case-rewrite-20261029/async/T-management.md`）
- [F040] 【技术设计】新旧实现不能对同一任务安全切换，回滚需先停建新任务、等待或关闭存量任务并注销 Trigger，再回滚服务。L2032–2043（来源：`case-rewrite-20261029/async/T-management.md`）
- [F064] 【现状限制】普通任务可查询、修改等待任务、取消并清规则，但普通取消链路目前未覆盖直接创建的 GUI 任务。L264–266（来源：`case-rewrite-20261029/async/T-service.md`）
- [F065] 【未定能力】暂停/继续只面向指定类型，状态与恢复方式未明确；二期还需理解用户补充对原目标的影响，下电、离线、中断恢复也需逐场景明确。L236、280（来源：`case-rewrite-20261029/async/T-service.md`）
- [F087] 【上汽管理】循环 switch 开关可 on/off，close 与语音 delete_goal 关闭目标并通知端侧 done，但开关重开补触发、关闭生效时点、在途推荐处理仍需 Extour 联调。L132、216–226（来源：`case-rewrite-20261029/async/T-dynamic.md`）
- [F088] 【上汽修改缺口】update_goal_by_id 只有服务封装，无车端业务入口且 Extour 协议 TODO，不能讲为所有项目都支持语音修改已有目标。L126、233–243（来源：`case-rewrite-20261029/async/T-dynamic.md`）
- [F089] 【上汽结束缺口】/goal/finish 只发 done、不改 Extour 状态，推送错误未反馈，结束通知仍标待联调。L250–260（来源：`case-rewrite-20261029/async/T-dynamic.md`）
- [F109] 【视觉增删改】VLM 无独立增删改接口，每次全量新列表覆盖旧列表，新增要带原任务、删除移除目标、修改保留编号换目标、清空发空列表。L311–401（来源：`case-rewrite-20261029/async/T-visual.md`）
- [F110] 【视觉关闭】舱内视觉感知总开关 AlwaysOn ON→OFF 立即发空观察列表清掉执行中长时观察，并告知用户已终止；OFF→ON 恢复下发权限，未规定自动恢复旧任务。L178–182（来源：`case-rewrite-20261029/async/T-visual.md`）
- [F111] 【视觉样例】任务 8 从宝宝醒了改为宝宝哭了时保持编号不变，全量下发；任务 8 已满足后仅保留任务 7，不可把删除误作全删。L407–475（来源：`case-rewrite-20261029/async/T-visual.md`）
- [F125] 【视觉更新取消】修改同时更新 Task、Trigger 场景并全量重发观察列表，用户结束同时关闭任务、注销 Trigger 并下发最新有效列表，不能只改卡片状态。L960–976（来源：`case-rewrite-20261029/async/A-task.md`）
- [F158] 【界面操作分期】一期任务/AI 服务删除、预设暂停，二期另加循环定时/循环条件暂停，删除需二次确认，不能概括成当前所有任务均可暂停恢复。L353–363、393（来源：`case-rewrite-20261029/support/U.md`）
- [F186] 【06-23旧设置设计】AI总开关关闭时清动态任务、清静态任务及子目标且不再触发，系统预设任务保留仍可触发但不播TTS；需与10-24用户任务清四类及语音禁用区别。L30–48（来源：`lecture-rewrite-20261029/async-source-compact/A84.md`）
- [F187] 【旧设置归属】设置随豆包账号、本地退出清空、跨车不继承，讲的是设置本身，不能直接当Task归属依据。L16–20（来源：`lecture-rewrite-20261029/async-source-compact/A84.md`）
- [F217] 【PRD修改取消】改唱另一首需定位原“副驾上车唱歌”并按需更新触发注册或动作；取消需触发器解注册及任务删除，不能只取消这次语音回复。L865–873（来源：`chapters/D/raw/director-prd.txt`）


## 8. 车端状态与同步
- [F041] 【技术设计】Task Query 从 Task/Run/Event 生成只读 TaskView 给 Planner、HMI 和任务中心，Snapshot 只是可选查询优化、不必独立建表。L916–931、1279、1420–1431（来源：`case-rewrite-20261029/async/T-management.md`）
- [F042] 【技术设计】Message Dispatcher 按任务事件、状态、分发策略生成 TaskMessage，经 Frontier/SSE/业务适配器下发，传输通道不承担任务生命周期。L938–953、1026–1041（来源：`case-rewrite-20261029/async/T-management.md`）
- [F043] 【技术设计】TaskView 带活跃运行、运行状态/阶段、下一次触发时间，TaskMessage 带消息编号、任务/运行编号、状态和发生时间，查询视图不能替代通知。L1420–1445（来源：`case-rewrite-20261029/async/T-management.md`）
- [F066] 【同步现状】通知失败不回滚已保存任务状态，车端展示需结合查询更新，已有任务数量限制与账号退登清理。L282–288（来源：`case-rewrite-20261029/async/T-service.md`）
- [F067] 【界面边界】任务岛暂不含直接 GUI 和持续条件任务，完整任务中心及特定类型暂停继续依赖端侧，二期技术方案只聚焦服务端。L296（来源：`case-rewrite-20261029/async/T-service.md`）
- [F090] 【上汽查询】/goal-list 返回有效目标状态、卡片与操作，不含进度/清单；/goal/detail 返回标题详情状态且 check_list 是 JSON 字符串。L182–209（来源：`case-rewrite-20261029/async/T-dynamic.md`）
- [F097] 【列表字段】goal_id 为 int64，列表返回原始目标、详情进展/关闭原因、状态、短标题、摘要、图标、场景、操作组件和 enabled；无目标为成功空数组，与参数失败 data=null/errno=10001 区分。L238–497、704–724（来源：`case-rewrite-20261029/async/T-goal.md`）
- [F098] 【交互字段】component_type 的 button 默认取消/关闭，switch 用 enabled 表当前开关，scene 共出行/服务/娱乐/舒适/情感/内容/其他七类。L594–638（来源：`case-rewrite-20261029/async/T-goal.md`）
- [F133] 【历史工程进展】上汽任务中心状态栏需启动拉有效任务列表决定图标，08-27 联调提测后标 HOLD 等上汽开发且由 yitu 验收，不能因接口完成宣称界面上线。L3301–3308（来源：`chapters/E/raw/h2.txt`）
- [F134] 【历史工程进展】上汽豆包登录/退出调整任务展示在 08-25 标开发完成，收益是随账号切换变化，未附账号清理实测。L6138–6145（来源：`chapters/E/raw/h2.txt`）
- [F145] 【状态来源】任务岛聚合 Task Service 有效长时/长程子集，任务创建、关闭/完成同步车端，不能把任务岛无图标解释为所有任务都不存在。L5、108–112、319、370–377（来源：`case-rewrite-20261029/support/task-island.md`）
- [F146] 【展示矩阵设计】单次定时/条件仅即时卡，循环定时/常规持续/视觉任务即时卡加任务岛，生态长程仅任务岛；与后续 Task Service 一页说明“暂不含直接 GUI 与持续条件”的现状分层。L387–538（来源：`case-rewrite-20261029/support/task-island.md`）
- [F147] 【补同步设计】车机下电导致创建推送失败后，重上电 POST /aidv/v1/task/island/list 按更新时间倒序取长时/长程任务纠正端云不一致，这是设计场景而非事故报告。L548–554（来源：`case-rewrite-20261029/support/task-island.md`）
- [F148] 【状态通道】任务消息复用 Frontier PushMethodMsg，Method=13、create/close/update=1/2/3，card 与 ui_control 可分别缺省，弹卡与更新任务岛是两件事。L1161–1186、1332–1369（来源：`case-rewrite-20261029/support/task-island.md`）
- [F149] 【身份协议】Task 来源 goal_id 可空、task_id 必填，CommonInfo 必带渠道应用/渠道/加密VIN车辆/车型/车企账号，豆包 uid 选填而 IsLogin 内部计算。L1403–1440、2289、2339–2442、2757–2794、2868（来源：`case-rewrite-20261029/support/task-island.md`）
- [F150] 【界面状态】show_state=0/1/2 表隐藏/展示/刷新、form=button/status 表可点/只展示，均不能当 waiting/running 等业务状态。L720–779、1806–1865（来源：`case-rewrite-20261029/support/task-island.md`）
- [F155] 【任务中心状态】任务中心 PRD 仅展示任务管理模块 running/paused，状态表却定义 waiting为创建中、running进行中、paused暂停中、closed结束；静态服务子目标和预设全展示。L194–206（来源：`case-rewrite-20261029/support/U.md`）
- [F156] 【状态三来源】我的任务来自 task_agent，AI 服务来自静态 Advisor 子目标，场景预设来自系统预设，界面聚合不能反推三者归同一托管对象。L214–228（来源：`case-rewrite-20261029/support/U.md`）
- [F157] 【状态同步设计】任务更新云主动推一次，上电客户端拉一次，“或账号登录”已划掉；退登清空任务中心长时跟进和条件任务的描述本身只证明车端展示策略。L397–403（来源：`case-rewrite-20261029/support/U.md`）
- [F163] 【协议增量】相对同源任务岛方案，本转存增加 task.source=user/meituan 必填、order_type=queue/reserve、order_id、strong_remind、jump_url，把美团业务单与任务展示关联，不意味着所有长期任务都有订单。L439–480（来源：`chapters/W/raw/task-card-tech.txt`）
- [F164] 【状态协议】Method13、create1/close2/update3 与 created/waiting/running/closed 的主体状态协议和 support/task-island 同源，不能作为第二个独立实现证据。L381–437、574–584（来源：`chapters/W/raw/task-card-tech.txt`）


## 9. 评测、测试、真实问题与排查
- [F044] 【测试线索】方案列出任务测试集及 2026-07-30 用例评审纪要链接，但正文未附通过率，纪要没有核验文字记录不能当会议结论。L212–219（来源：`case-rewrite-20261029/async/T-management.md`）
- [F045] 【排查设计】完整链路应串 task_id/run_id/request_id/recommend_id、事件和错误，定位任务、触发、传输、回流、执行及结果写入的断点。L1048–1063、1170–1197（来源：`case-rewrite-20261029/async/T-management.md`）
- [F068] 【可靠性现状】一页说明称已有回调去重、修改/回写校验、异常记录、部分状态修复，未给覆盖率或实车成功率。L284–286（来源：`case-rewrite-20261029/async/T-service.md`）
- [F069] 【联调缺口】GUI 有启动、续接、回写，但保留单用户兼容，正式多用户、并发重试和用户取消仍需验证。L294（来源：`case-rewrite-20261029/async/T-service.md`）
- [F099] 【实测仅创建】本接口原文记录 Planner 成功创建 3 分钟喝水、距目的地 1 公里、未来 10 天每天 19 点打电话三项，证据仅到创建，未证明触发/执行/播报。L644–700（来源：`case-rewrite-20261029/async/T-goal.md`）
- [F179] 【排队设计目的】输入管理在模型外统一管理用户/advice/feedback，车内一个语音流，正在说时建议先存或排队，防止建议打断工具反馈结果播报；这是规则目的示例非事故。L97、212–222，00:14:14、00:35:17–36:14（来源：`v-lesson-20261105/director-talk.md`）
- [F196] 【11-15初测】专项总结上半周摸底共82例：定时23例通过15（原文65%），条件24例通过13（54%），长时35例通过13（37%），不是修复后复测或量产通过率。content_excerpt/messages[6].text，message_id om_x100b60a18f919904b375ae1dfe11ed1（来源：`T-v2/feishu/msgs-条件任务-30d.json`）
- [F197] 【修复与验收】总结称许多问题看似已修复，计划周一集中复测，长时复测可能需2天以上且单人困难，不能把“修了”写成验收通过。content_excerpt/messages[6].text（来源：`T-v2/feishu/msgs-条件任务-30d.json`）
- [F245] 【问题记录 R001】定时触发只说“做好了”：到点听到“做好了”，提醒内容缺失。；逐项根因证据、原文处理与研究建议见 cases.md R001，记录数不是独立事故数。（来源：`T-v2/feishu/msgs-条件任务-30d.json → content_excerpt/messages[6].text，message_id=om_x100b60a18f919904b375ae1dfe11ed1。`）
- [F246] 【问题记录 R002】条件任务音区搞错：条件任务作用于错误座位或提及错误对象，具体表现未给出。；逐项根因证据、原文处理与研究建议见 cases.md R002，记录数不是独立事故数。（来源：`T-v2/feishu/msgs-条件任务-30d.json → content_excerpt/messages[6].text，message_id=om_x100b60a18f919904b375ae1dfe11ed1。`）
- [F247] 【问题记录 R003】没有导航也创建目的地任务：用户被答应“快到目的地提醒”，但当前没有有效目的地。；逐项根因证据、原文处理与研究建议见 cases.md R003，记录数不是独立事故数。（来源：`T-v2/feishu/msgs-条件任务-30d.json → content_excerpt/messages[6].text，message_id=om_x100b60a18f919904b375ae1dfe11ed1。`）
- [F248] 【问题记录 R004】视觉条件链路 VLM 报错：视觉条件任务可能不触发，消息未给出具体用户表现。；逐项根因证据、原文处理与研究建议见 cases.md R004，记录数不是独立事故数。（来源：`T-v2/feishu/msgs-条件任务-30d.json → content_excerpt/messages[6].text，message_id=om_x100b60a18f919904b375ae1dfe11ed1。`）
- [F249] 【问题记录 R005】条件任务受离线过召影响：具体用户表现未给出。；逐项根因证据、原文处理与研究建议见 cases.md R005，记录数不是独立事故数。（来源：`T-v2/feishu/msgs-条件任务-30d.json → content_excerpt/messages[6].text，message_id=om_x100b60a18f919904b375ae1dfe11ed1。`）
- [F250] 【问题记录 R006】任务请求走到记忆：应登记未来要办的事，却进入记忆路径。；逐项根因证据、原文处理与研究建议见 cases.md R006，记录数不是独立事故数。（来源：`T-v2/feishu/msgs-条件任务-30d.json → content_excerpt/messages[6].text，message_id=om_x100b60a18f919904b375ae1dfe11ed1。`）
- [F251] 【问题记录 R007】标准长时语义未创建任务：说“接下来行程… / 一路上… / 直到…”后没有持续跟进。；逐项根因证据、原文处理与研究建议见 cases.md R007，记录数不是独立事故数。（来源：`T-v2/feishu/msgs-条件任务-30d.json → content_excerpt/messages[6].text，message_id=om_x100b60a18f919904b375ae1dfe11ed1。`）
- [F252] 【问题记录 R008】典型持续承诺场景未创建：体验功能不同模式、照顾乘客或宝宝、哄孩子睡觉、订座、导游等承诺未被持续托管。；逐项根因证据、原文处理与研究建议见 cases.md R008，记录数不是独立事故数。（来源：`T-v2/feishu/msgs-条件任务-30d.json → content_excerpt/messages[6].text，message_id=om_x100b60a18f919904b375ae1dfe11ed1。`）
- [F253] 【问题记录 R009】兜风任务创建慢：用户要兜风，任务登记等待长。；逐项根因证据、原文处理与研究建议见 cases.md R009，记录数不是独立事故数。（来源：`T-v2/feishu/msgs-条件任务-30d.json → content_excerpt/messages[6].text，message_id=om_x100b60a18f919904b375ae1dfe11ed1。`）
- [F254] 【问题记录 R010】长时任务被下游行程规划阻断：长时任务不能顺利继续，具体现象未给出。；逐项根因证据、原文处理与研究建议见 cases.md R010，记录数不是独立事故数。（来源：`T-v2/feishu/msgs-条件任务-30d.json → content_excerpt/messages[6].text，message_id=om_x100b60a18f919904b375ae1dfe11ed1。`）
- [F255] 【问题记录 R011】用例 1：新增任务-车控：表内实际问题为“DT回复话术问题，不影响功能；逐项根因证据、原文处理与研究建议见 cases.md R011，记录数不是独立事故数。（来源：`T-v2/feishu/msgs-条件任务-30d.json → 第 7 条消息 linked_content[0].content.sheets[0] → NTHb5Y 第 2 行、用例编号 1，问题备注及链接如上。`）
- [F256] 【问题记录 R012】用例 36：异常-小于1分钟边界：表内实际问题为“DT回复话术问题，不影响功能；逐项根因证据、原文处理与研究建议见 cases.md R012，记录数不是独立事故数。（来源：`T-v2/feishu/msgs-条件任务-30d.json → 第 7 条消息 linked_content[0].content.sheets[0] → NTHb5Y 第 37 行、用例编号 36，问题备注及链接如上。`）
- [F257] 【问题记录 R013】用例 37：异常-大于2周边界：表内实际问题为“DT回复话术问题，不影响功能；逐项根因证据、原文处理与研究建议见 cases.md R013，记录数不是独立事故数。（来源：`T-v2/feishu/msgs-条件任务-30d.json → 第 7 条消息 linked_content[0].content.sheets[0] → NTHb5Y 第 38 行、用例编号 37，问题备注及链接如上。`）
- [F258] 【问题记录 R014】用例 51：新增任务-比赛播报：表内实际问题为“未弹出即时卡片，不影响链路功能；逐项根因证据、原文处理与研究建议见 cases.md R014，记录数不是独立事故数。（来源：`T-v2/feishu/msgs-条件任务-30d.json → 第 7 条消息 linked_content[0].content.sheets[0] → NTHb5Y 第 52 行、用例编号 51，问题备注及链接如上。`）
- [F259] 【问题记录 R015】用例 66：新增任务-指定时间范围循环：表内实际问题为“任务触发内容混乱；逐项根因证据、原文处理与研究建议见 cases.md R015，记录数不是独立事故数。（来源：`T-v2/feishu/msgs-条件任务-30d.json → 第 7 条消息 linked_content[0].content.sheets[0] → NTHb5Y 第 67 行、用例编号 66，问题备注及链接如上。`）
- [F260] 【问题记录 R016】用例 71：异常-小于最小边界：表内实际问题为“https://meego.larkoffice.com/telematics/issue/detail/7390693629”；最近备注为“回复话术不正确”，未说明的界面/语音表现不作推断。；逐项根因证据、原文处理与研究建议见 cases.md R016，记录数不是独立事故数。（来源：`T-v2/feishu/msgs-条件任务-30d.json → 第 7 条消息 linked_content[0].content.sheets[0] → NTHb5Y 第 72 行、用例编号 71，问题备注及链接如上。`）
- [F261] 【问题记录 R017】用例 86：删除任务：表内实际问题为“https://meego.larkoffice.com/telematics/issue/detail/7390687623；逐项根因证据、原文处理与研究建议见 cases.md R017，记录数不是独立事故数。（来源：`T-v2/feishu/msgs-条件任务-30d.json → 第 7 条消息 linked_content[0].content.sheets[0] → NTHb5Y 第 87 行、用例编号 86，问题备注及链接如上。`）
- [F262] 【问题记录 R018】用例 94：多条件任务：表内实际问题为“未触发；逐项根因证据、原文处理与研究建议见 cases.md R018，记录数不是独立事故数。（来源：`T-v2/feishu/msgs-条件任务-30d.json → 第 7 条消息 linked_content[0].content.sheets[0] → NTHb5Y 第 95 行、用例编号 94，问题备注及链接如上。`）
- [F263] 【问题记录 R019】用例 98：新增任务-目的地提醒：表内实际问题为“https://meego.larkoffice.com/telematics/issue/detail/7396205766”；最近备注为“分析中”，未说明的界面/语音表现不作推断。；逐项根因证据、原文处理与研究建议见 cases.md R019，记录数不是独立事故数。（来源：`T-v2/feishu/msgs-条件任务-30d.json → 第 7 条消息 linked_content[0].content.sheets[0] → NTHb5Y 第 99 行、用例编号 98，问题备注及链接如上。`）
- [F264] 【问题记录 R020】用例 128：新增任务-副驾抽烟打开车窗：表内实际问题为“无法创建；逐项根因证据、原文处理与研究建议见 cases.md R020，记录数不是独立事故数。（来源：`T-v2/feishu/msgs-条件任务-30d.json → 第 7 条消息 linked_content[0].content.sheets[0] → NTHb5Y 第 129 行、用例编号 128，问题备注及链接如上。`）
- [F265] 【问题记录 R021】用例 130：修改任务：表内实际问题为“https://meego.larkoffice.com/telematics/issue/detail/7390637150”；最近备注为“分析中”，未说明的界面/语音表现不作推断。；逐项根因证据、原文处理与研究建议见 cases.md R021，记录数不是独立事故数。（来源：`T-v2/feishu/msgs-条件任务-30d.json → 第 7 条消息 linked_content[0].content.sheets[0] → NTHb5Y 第 131 行、用例编号 130，问题备注及链接如上。`）
- [F266] 【问题记录 R022】用例 138：删除任务：表内实际问题为“https://meego.larkoffice.com/telematics/issue/detail/7396228786”；最近备注为“新问题，未触发；逐项根因证据、原文处理与研究建议见 cases.md R022，记录数不是独立事故数。（来源：`T-v2/feishu/msgs-条件任务-30d.json → 第 7 条消息 linked_content[0].content.sheets[0] → NTHb5Y 第 139 行、用例编号 138，问题备注及链接如上。`）
- [F267] 【问题记录 R023】用例 159：新增任务：表内实际问题为“https://meego.larkoffice.com/telematics/issue/detail/7390473169”；最近备注为“分析中”，未说明的界面/语音表现不作推断。；逐项根因证据、原文处理与研究建议见 cases.md R023，记录数不是独立事故数。（来源：`T-v2/feishu/msgs-条件任务-30d.json → 第 7 条消息 linked_content[0].content.sheets[0] → NTHb5Y 第 160 行、用例编号 159，问题备注及链接如上。`）
- [F268] 【问题记录 R024】目标工具启动了定时任务，后面没有执行【真实评测问题】：定时任务被启动，后续动作没有执行；原文没有给具体用户话或时间。；逐项根因证据、原文处理与研究建议见 cases.md R024，记录数不是独立事故数。（来源：`chapters/D/raw/ux-0916-analysis.txt:257-269。`）
- [F269] 【问题记录 R025】“只介绍 4A/5A”被误判为新增持续目标【真实单例评测】：“4A 以下的就别讲了，只介绍 4A5A 的吧。”原本在限定当前讲解范围，部分模型却新增持续任务。；逐项根因证据、原文处理与研究建议见 cases.md R025，记录数不是独立事故数。（来源：`chapters/D/raw/eval-1102-sft.txt:175-196，SMALL-000382、原表第 384 行。`）
- [F270] 【问题记录 R026】没有任务，状态栏仍显示任务中心图标【真实联调问题】：任务列表为空，状态栏依旧显示任务图标。；逐项根因证据、原文处理与研究建议见 cases.md R026，记录数不是独立事故数。（来源：`chapters/W/raw/m0901w.txt:652-653，00:27:37；测试边界见 1156-1160，当时动态 Advisor 任务岛测试用例尚未编写完成。`）
- [F271] 【问题记录 R027】下车拿伞提醒没有成功【真实用户反馈，根因未明】：“他的那个下车提醒我带伞也没有成功。”；逐项根因证据、原文处理与研究建议见 cases.md R027，记录数不是独立事故数。（来源：`v-lesson-20261107/raw/d6x-issues.txt:27,31；工单 7372470784。`）
- [F272] 【问题记录 R028】十分钟提醒未到达【真实用户反馈，根因未明】：“让你之前十分钟提醒我，没有提醒。”；逐项根因证据、原文处理与研究建议见 cases.md R028，记录数不是独立事故数。（来源：`v-lesson-20261107/raw/d6x-issues.txt:37；工单 7373240009。`）
- [F273] 【问题记录 R029】没有设置广汽股价提醒却收到任务【真实用户反馈，疑似归属问题】：“我这个豆包账号应该没有设置过这个广汽什么提醒，为什么会有这个任务？”；逐项根因证据、原文处理与研究建议见 cases.md R029，记录数不是独立事故数。（来源：`v-lesson-20261107/raw/d6x-issues.txt:250-252，触发请求 202609152247309AC4523A6ADFF598E336。`）
- [F274] 【问题记录 R030】先答应一分钟看后排是否睡着，再报视觉不支持【真实轨迹】：先听到“会每隔一分钟看后排同学有没有睡着”，约 10 秒后被告知需要视觉识别，目前不支持。；逐项根因证据、原文处理与研究建议见 cases.md R030，记录数不是独立事故数。（来源：`v-lesson-20261107/raw/d6x-issues.txt:55，请求 202609012023098139158CAA406066E185、2026090120231898446A1A76D6255C9F4A。`）
- [F275] 【问题记录 R031】10 秒后变道被拒后再次改造目标调用【真实轨迹】：先答应“10秒后帮你看看能不能向左变道”；系统随后说最少 1 分钟，Planner 又改口“现在盯着路况，一有空就帮你变”。；逐项根因证据、原文处理与研究建议见 cases.md R031，记录数不是独立事故数。（来源：`v-lesson-20261107/raw/d6x-issues.txt:63，请求 20260903144846B7A6D80EC0D04BD18B03、20260903144858869724AD59909E2616FA。`）
- [F276] 【问题记录 R032】猜十首歌游戏先宣布开始，任务拒绝创建后没有解释【真实轨迹】：要求播放 10 首周杰伦歌曲猜歌名，Planner 说游戏开始；后续任务能力拒绝消息对应输出为空。；逐项根因证据、原文处理与研究建议见 cases.md R032，记录数不是独立事故数。（来源：`v-lesson-20261107/raw/d6x-issues.txt:161-165，请求 20260909125048FCF76F8C06706C903878、20260909125103145E36B1C96EB3036618。`）
- [F277] 【问题记录 R033】经过服务区没有按约提醒【真实问题定义样例】：“我刚刚不是叫你经过服务区的时候提醒我吗，你就没提醒我。”；逐项根因证据、原文处理与研究建议见 cases.md R033，记录数不是独立事故数。（来源：`v-lesson-20261107/raw/problem-def.txt:19。`）
- [F278] 【问题记录 R034】承诺报告生成后告知，却需用户一直追问【外部体验汇总】：承诺行程报告生成后立即告知，后续追问仍“生成中”或空答。；逐项根因证据、原文处理与研究建议见 cases.md R034，记录数不是独立事故数。（来源：`v-lesson-20261107/raw/ext-report.txt:59-63；汇总性证据，优先补原始聊天再写详细案例。`）
- [F279] 【问题记录 R035】新增跟进任务时，会重复创建：新增跟进任务时，会重复创建；未附用户原话、界面和具体音区。；逐项根因证据、原文处理与研究建议见 cases.md R035，记录数不是独立事故数。（来源：`v-lesson-20261107/raw/test-weekly.txt:4829（日期段自 4788 起，2026-05-18）。`）
- [F280] 【问题记录 R036】director没有理解跟进任务语意，没有创建对应的跟进任务：director没有理解跟进任务语意，没有创建对应的跟进任务；未附用户原话、界面和具体音区。；逐项根因证据、原文处理与研究建议见 cases.md R036，记录数不是独立事故数。（来源：`v-lesson-20261107/raw/test-weekly.txt:4830（日期段自 4788 起，2026-05-18）。`）
- [F281] 【问题记录 R037】director回复受up中goal list影响    未提bug：director回复受up中goal list影响    未提bug；未附用户原话、界面和具体音区。；逐项根因证据、原文处理与研究建议见 cases.md R037，记录数不是独立事故数。（来源：`v-lesson-20261107/raw/test-weekly.txt:4831（日期段自 4788 起，2026-05-18）。`）
- [F282] 【问题记录 R038】Advisor建议与用户query合并后，会影响director判断，拆出错误的目标  未提bug：Advisor建议与用户query合并后，会影响director判断，拆出错误的目标  未提bug；未附用户原话、界面和具体音区。；逐项根因证据、原文处理与研究建议见 cases.md R038，记录数不是独立事故数。（来源：`v-lesson-20261107/raw/test-weekly.txt:4832（日期段自 4788 起，2026-05-18）。`）
- [F283] 【问题记录 R039】未表达删除目标的场景下director仍会错误删除跟进任务：未表达删除目标的场景下director仍会错误删除跟进任务；未附用户原话、界面和具体音区。；逐项根因证据、原文处理与研究建议见 cases.md R039，记录数不是独立事故数。（来源：`v-lesson-20261107/raw/test-weekly.txt:4833（日期段自 4788 起，2026-05-18）。`）
- [F284] 【问题记录 R040】当前已存在一个VLM定时任务时再次新增任务，没有新增成功：当前已存在一个VLM定时任务时再次新增任务，没有新增成功；未附用户原话、界面和具体音区。；逐项根因证据、原文处理与研究建议见 cases.md R040，记录数不是独立事故数。（来源：`v-lesson-20261107/raw/test-weekly.txt:4834（日期段自 4788 起，2026-05-18）。`）
- [F285] 【问题记录 R041】询问当前存在的任务时，director没有严格参考up中的goal list 回复，导致回复的数量对不上：询问当前存在的任务时，director没有严格参考up中的goal list 回复，导致回复的数量对不上；未附用户原话、界面和具体音区。；逐项根因证据、原文处理与研究建议见 cases.md R041，记录数不是独立事故数。（来源：`v-lesson-20261107/raw/test-weekly.txt:4835（日期段自 4788 起，2026-05-18）。`）
- [F286] 【问题记录 R042】处理跟进任务时幻觉回复：处理跟进任务时幻觉回复；未附用户原话、界面和具体音区。；逐项根因证据、原文处理与研究建议见 cases.md R042，记录数不是独立事故数。（来源：`v-lesson-20261107/raw/test-weekly.txt:4836（日期段自 4788 起，2026-05-18）。`）
- [F287] 【问题记录 R043】多任务场景仅拆出一个跟进任务：多任务场景仅拆出一个跟进任务；未附用户原话、界面和具体音区。；逐项根因证据、原文处理与研究建议见 cases.md R043，记录数不是独立事故数。（来源：`v-lesson-20261107/raw/test-weekly.txt:4837（日期段自 4788 起，2026-05-18）。`）
- [F288] 【问题记录 R044】取消当前存在的任务后，又自动新增一个同样的任务：取消当前存在的任务后，又自动新增一个同样的任务；未附用户原话、界面和具体音区。；逐项根因证据、原文处理与研究建议见 cases.md R044，记录数不是独立事故数。（来源：`v-lesson-20261107/raw/test-weekly.txt:4838（日期段自 4788 起，2026-05-18）。`）
- [F289] 【问题记录 R045】当需要创建的条件任务与已有任务冲突时，director没有给出提示：当需要创建的条件任务与已有任务冲突时，director没有给出提示；未附用户原话、界面和具体音区。；逐项根因证据、原文处理与研究建议见 cases.md R045，记录数不是独立事故数。（来源：`v-lesson-20261107/raw/test-weekly.txt:4839（日期段自 4788 起，2026-05-18）。`）
- [F290] 【问题记录 R046】满足任务条件后，动态advisor没有给出建议（VLM、条件、定时均有问题）：满足任务条件后，动态advisor没有给出建议（VLM、条件、定时均有问题）；未附用户原话、界面和具体音区。；逐项根因证据、原文处理与研究建议见 cases.md R046，记录数不是独立事故数。（来源：`v-lesson-20261107/raw/test-weekly.txt:4840（日期段自 4788 起，2026-05-18）。`）
- [F291] 【问题记录 R047】偶现advisor提示解析失败：偶现advisor提示解析失败；未附用户原话、界面和具体音区。；逐项根因证据、原文处理与研究建议见 cases.md R047，记录数不是独立事故数。（来源：`v-lesson-20261107/raw/test-weekly.txt:4841（日期段自 4788 起，2026-05-18）。`）
- [F292] 【问题记录 R048】任务删除后，advisor仍在关注并给出建议：任务删除后，advisor仍在关注并给出建议；未附用户原话、界面和具体音区。；逐项根因证据、原文处理与研究建议见 cases.md R048，记录数不是独立事故数。（来源：`v-lesson-20261107/raw/test-weekly.txt:4842（日期段自 4788 起，2026-05-18）。`）
- [F293] 【问题记录 R049】advisor会下发重复的建议：advisor会下发重复的建议；未附用户原话、界面和具体音区。；逐项根因证据、原文处理与研究建议见 cases.md R049，记录数不是独立事故数。（来源：`v-lesson-20261107/raw/test-weekly.txt:4843（日期段自 4788 起，2026-05-18）。`）
- [F294] 【问题记录 R050】自动切歌长时任务在换话题后仍抢播放器：已经聊其他话题，播放器仍自动开音乐、切歌，直到明确取消。；逐项根因证据、原文处理与研究建议见 cases.md R050，记录数不是独立事故数。（来源：`v-lesson-20261107/raw/road-0811.txt:698-700。`）
- [F295] 【问题记录 R051】每次执行后自动退下没有稳定生效：说“之后每次说完指令执行后自动退下”，助手答应，下一轮还要追问“又忘记什么”。；逐项根因证据、原文处理与研究建议见 cases.md R051，记录数不是独立事故数。（来源：`v-lesson-20261107/raw/ux-algo.txt:17-18，请求 20260912154254EB951B4960F5B9D7431B。`）
- [F296] 【问题记录 R052】每次上车开座椅按摩没有执行：用户追问既定的“每次上车打开座椅按摩”，助手认领后立即补开，但之前上车未自动执行。；逐项根因证据、原文处理与研究建议见 cases.md R052，记录数不是独立事故数。（来源：`v-lesson-20261107/raw/ux-algo.txt:22，请求 20260912213200B542A523735BE2A77BAF。`）
- [F297] 【问题记录 R053】33 分的定时提醒漏掉【真实体验问题】：19:39 追问“刚让你在 33 分叫我，怎么没叫我”；助手承认错过并再承诺。；逐项根因证据、原文处理与研究建议见 cases.md R053，记录数不是独立事故数。（来源：`v-lesson-20261107/raw/ux-algo.txt:69，请求 20260909193953FBF3BCA8D5FC6041060A。`）
- [F298] 【问题记录 R054】缺陷表 #3：删除所有任务：【赛力斯】【Planner】“删除所有任务” ，删除长时任务后，又创建另外一个长时任务。；逐项根因证据、原文处理与研究建议见 cases.md R054，记录数不是独立事故数。（来源：`coverage-expansion/sweep-evaluation/SV-220.md:12，原表编号 3。`）
- [F299] 【问题记录 R055】缺陷表 #4：现在有什么任务啊：【赛力斯】【长时任务】query：哈喽豆包很高兴认识你，豆包会自动创建一个长时任务；再去询问现在有什么任务时，豆包回复没有任务。；逐项根因证据、原文处理与研究建议见 cases.md R055，记录数不是独立事故数。（来源：`coverage-expansion/sweep-evaluation/SV-220.md:13，原表编号 4。`）
- [F300] 【问题记录 R056】缺陷表 #6：帮我新建两个提醒一个是那个呃4点的开会的提醒一个是5点的那个学习的提醒：【Planner】让豆包新建两个提醒，但在回答中出现三个operate_conditional_task。。；逐项根因证据、原文处理与研究建议见 cases.md R056，记录数不是独立事故数。（来源：`coverage-expansion/sweep-evaluation/SV-220.md:15，原表编号 6。`）
- [F301] 【问题记录 R057】缺陷表 #7："query":"advisor:交互助手可以用温和关切的语气提醒主驾注意安全，比如‘先生，下车注意安全，小心周围车辆和行人哦’；：【赛力斯】【Planner】adviser进入到planner后，planner直接“使用”adviser的“示例”回复。。；逐项根因证据、原文处理与研究建议见 cases.md R057，记录数不是独立事故数。（来源：`coverage-expansion/sweep-evaluation/SV-220.md:16，原表编号 7。`）
- [F302] 【问题记录 R058】缺陷表 #18：导航去公司：【赛力斯】【长时任务】已创建任务： “导航去公司” 时告知剩余时间；说出导航去公司时有导航任务了，但是实际没有播报剩余时间。；逐项根因证据、原文处理与研究建议见 cases.md R058，记录数不是独立事故数。（来源：`coverage-expansion/sweep-evaluation/SV-220.md:27，原表编号 18。`）
- [F303] 【问题记录 R059】缺陷表 #27：给我讲笑话一直到我哈哈大笑：【赛力斯】【长时任务】讲笑话的长时任务，概率输出：[ ]。；逐项根因证据、原文处理与研究建议见 cases.md R059，记录数不是独立事故数。（来源：`coverage-expansion/sweep-evaluation/SV-220.md:36，原表编号 27。`）
- [F304] 【问题记录 R060】缺陷表 #35：查看全部日程：【赛力斯】【日程提醒】已经设置多个日程提醒，query：查看全部日程；豆包播报了但是没有全部提醒的卡片内容，偶现卡片以文本显示。；逐项根因证据、原文处理与研究建议见 cases.md R060，记录数不是独立事故数。（来源：`coverage-expansion/sweep-evaluation/SV-220.md:44，原表编号 35。`）
- [F305] 【问题记录 R061】缺陷表 #41：查看我的日程：【主线】【日程提醒】无法查看日程。；逐项根因证据、原文处理与研究建议见 cases.md R061，记录数不是独立事故数。（来源：`coverage-expansion/sweep-evaluation/SV-220.md:50，原表编号 41。`）
- [F306] 【问题记录 R062】缺陷表 #42：今天的nba新闻：【主线】【长时任务】 长时任务功能“推荐M9” 的专场非常打扰，连续推荐、想进行正常交互也被打断。；逐项根因证据、原文处理与研究建议见 cases.md R062，记录数不是独立事故数。（来源：`coverage-expansion/sweep-evaluation/SV-220.md:51，原表编号 42。`）
- [F307] 【问题记录 R063】缺陷表 #50：给主驾讲一个笑话讲到他笑为止：【赛力斯】【长时任务】query：给主驾讲一个笑话讲到他笑为止；长时任务创建失败，灵动岛无任务卡片。；逐项根因证据、原文处理与研究建议见 cases.md R063，记录数不是独立事故数。（来源：`coverage-expansion/sweep-evaluation/SV-220.md:59，原表编号 50。`）
- [F308] 【问题记录 R064】缺陷表 #51：提醒我晚上8点钟开会：【赛力斯】【日程】query：提醒我晚上8点钟开会；没有日程卡片。；逐项根因证据、原文处理与研究建议见 cases.md R064，记录数不是独立事故数。（来源：`coverage-expansion/sweep-evaluation/SV-220.md:60，原表编号 51。`）
- [F309] 【问题记录 R065】缺陷表 #61：你给我讲一个笑话呗：【长时任务】query“你给我讲一个笑话呗”，会自动创建长时任务。；逐项根因证据、原文处理与研究建议见 cases.md R065，记录数不是独立事故数。（来源：`coverage-expansion/sweep-evaluation/SV-220.md:70，原表编号 61。`）
- [F310] 【问题记录 R066】缺陷表 #62：查看我全部的日程：【赛力斯】【日程】query：查看我全部的日程；没有创建过相关的工作日程，豆包给出一些不属于我的工作日程。；逐项根因证据、原文处理与研究建议见 cases.md R066，记录数不是独立事故数。（来源：`coverage-expansion/sweep-evaluation/SV-220.md:71，原表编号 62。`）
- [F311] 【问题记录 R067】缺陷表 #69：帮我把这两个提醒调个个：【Planner】“帮我把这两个提醒调个个”发现两个提醒都是一样的。。；逐项根因证据、原文处理与研究建议见 cases.md R067，记录数不是独立事故数。（来源：`coverage-expansion/sweep-evaluation/SV-220.md:78，原表编号 69。`）
- [F312] 【问题记录 R068】缺陷表 #71：接下来的行程里给我介绍沿途的风景：【赛力斯】【Planner】“接下来的行程里给我介绍沿途的风景”，创建两个 长时任务。；逐项根因证据、原文处理与研究建议见 cases.md R068，记录数不是独立事故数。（来源：`coverage-expansion/sweep-evaluation/SV-220.md:80，原表编号 71。`）
- [F313] 【问题记录 R069】缺陷表 #72：帮我记一下我要给我老婆买烤鸭：（未来修复）【赛力斯】【planner】帮我记一下我要给我老婆买烤鸭，调了goal_list_update工具，应该调记忆工具。；逐项根因证据、原文处理与研究建议见 cases.md R069，记录数不是独立事故数。（来源：`coverage-expansion/sweep-evaluation/SV-220.md:81，原表编号 72。`）
- [F314] 【问题记录 R070】缺陷表 #85：那个那个帮我新建一个提醒 那个标题是2月5号晚上9点从望京 Soho 出发去青龙峡玩然后呢呃小队记得戴好口粮：【Planner】新建提醒的标题错误，和query的要求不一致。。；逐项根因证据、原文处理与研究建议见 cases.md R070，记录数不是独立事故数。（来源：`coverage-expansion/sweep-evaluation/SV-220.md:94，原表编号 85。`）
- [F315] 【问题记录 R071】缺陷表 #90：现在外面天气怎么样：【主线】【planner】"你不要再给我介绍这辆车了" 删除长时任务前后，一样的话术播报了两次。；逐项根因证据、原文处理与研究建议见 cases.md R071，记录数不是独立事故数。（来源：`coverage-expansion/sweep-evaluation/SV-220.md:99，原表编号 90。`）
- [F316] 【问题记录 R072】缺陷表 #96：查看全部日程：暂时不修【赛力斯】【提醒】query：查看全部日程；类似的多种query：内容展示\n且把\n播报出来了。；逐项根因证据、原文处理与研究建议见 cases.md R072，记录数不是独立事故数。（来源：`coverage-expansion/sweep-evaluation/SV-220.md:105，原表编号 96。`）
- [F317] 【问题记录 R073】缺陷表 #115：讲笑话一直到我大笑：【赛力斯】【长时任务】长时任务未创建成功时被用户query打断，yitu会继续创建长时任务但端上没有长时任务图标。；逐项根因证据、原文处理与研究建议见 cases.md R073，记录数不是独立事故数。（来源：`coverage-expansion/sweep-evaluation/SV-220.md:124，原表编号 115。`）
- [F318] 【问题记录 R074】缺陷表 #122：现在有哪些任务：【赛力斯】【长时任务】查询当前有哪些任务，回复了两个任务，实际只有一个（根据历史回复了，没有按照context信息回）。；逐项根因证据、原文处理与研究建议见 cases.md R074，记录数不是独立事故数。（来源：`coverage-expansion/sweep-evaluation/SV-220.md:131，原表编号 122。`）
- [F319] 【问题记录 R075】缺陷表 #133：你现在有什么任务呀将这个任务删除：【赛力斯】【长时任务】任务删除成功，返回显示内容为失败。；逐项根因证据、原文处理与研究建议见 cases.md R075，记录数不是独立事故数。（来源：`coverage-expansion/sweep-evaluation/SV-220.md:142，原表编号 133。`）
- [F320] 【问题记录 R076】缺陷表 #140：再帮我看一下我今天和明天的全部日程提醒：【赛力斯】【日程提醒】已经添加完明天的日程，再次询问豆包：再帮我看一下我今天和明天的全部日程提醒，豆包只回复了当天的。；逐项根因证据、原文处理与研究建议见 cases.md R076，记录数不是独立事故数。（来源：`coverage-expansion/sweep-evaluation/SV-220.md:149，原表编号 140。`）
- [F321] 【问题记录 R077】缺陷表 #152：advisor:你当前的目标是**讲笑话逗主驾笑**，接下来你可以：你当前的目标是讲笑话逗主驾笑，已经讲了一个小鸭子的冷笑话，接下来可以讲一个谐音梗笑话：‘有一天我问我的钱包：“你为什么这么瘦啊？”钱包说：“我饿了好几个月了，能不瘦吗？”我定睛一看，它的拉链都饿成了闪电⚡’：【赛力斯】【长时任务】讲笑话一直到我笑为止，模型输出了很多：哈哈哈哈哈哈哈哈哈哈...。；逐项根因证据、原文处理与研究建议见 cases.md R077，记录数不是独立事故数。（来源：`coverage-expansion/sweep-evaluation/SV-220.md:161，原表编号 152。`）
- [F322] 【问题记录 R078】缺陷表 #163：导航去那个江北机场然后再回家：【赛力斯】【Planner】导航去那个江北机场然后再回家，创建长时任务。；逐项根因证据、原文处理与研究建议见 cases.md R078，记录数不是独立事故数。（来源：`coverage-expansion/sweep-evaluation/SV-220.md:172，原表编号 163。`）
- [F323] 【问题记录 R079】缺陷表 #168：帮我点一份吉野家的招牌牛肉饭套餐再营造一个浪漫的氛围：【主线】【GUI主链路】点外卖指令包含其他任务的复杂操作时，Planner创建长时任务时，没有去掉其他“非长时任务”的复杂操作。；逐项根因证据、原文处理与研究建议见 cases.md R079，记录数不是独立事故数。（来源：`coverage-expansion/sweep-evaluation/SV-220.md:177，原表编号 168。`）
- [F324] 【问题记录 R080】缺陷表 #175：给我讲笑话一直到我大笑：【赛力斯】【长时任务】新建长时任务后 重启车辆，长时任务存在，但没有长时任务图标&长按豆包头像隐藏任务岛在打开已有的长时任务小卡片就没了。；逐项根因证据、原文处理与研究建议见 cases.md R080，记录数不是独立事故数。（来源：`coverage-expansion/sweep-evaluation/SV-220.md:184，原表编号 175。`）
- [F325] 【问题记录 R081】缺陷表 #180：带我复习一下昨天学的单词直到我都答对：【赛力斯】【Planner】长时任务创建时没去重，导致可能存在多个一样的任务，同时执行，tts回复多次。；逐项根因证据、原文处理与研究建议见 cases.md R081，记录数不是独立事故数。（来源：`coverage-expansion/sweep-evaluation/SV-220.md:189，原表编号 180。`）
- [F326] 【问题记录 R082】缺陷表 #181：我明天有什么日程：【赛力斯】【日程提醒】我明天有什么日程 没有弹出日程卡片。；逐项根因证据、原文处理与研究建议见 cases.md R082，记录数不是独立事故数。（来源：`coverage-expansion/sweep-evaluation/SV-220.md:190，原表编号 181。`）
- [F327] 【问题记录 R083】副驾创建讲解任务被改写为左后乘客：副驾要求介绍车的亮点，创建目标却写“为左后乘客介绍问界 M9”。；逐项根因证据、原文处理与研究建议见 cases.md R083，记录数不是独立事故数。（来源：`coverage-expansion/sweep-evaluation/SV-200.md:1410，原表 109、请求 20260129152212C8A88DC6604714297280。`）
- [F328] 【问题记录 R084】背单词目标干扰当下电量问答：用户问当前电量，助手答完又催背单词，喧宾夺主。；逐项根因证据、原文处理与研究建议见 cases.md R084，记录数不是独立事故数。（来源：`coverage-expansion/sweep-evaluation/SV-100-transcript.md:700；对应体验原例 sweep-core/SC-8.md:124。`）
- [F329] 【问题记录 R085】任务复用主动链路，先唤醒导致延迟：定时等需要及时提醒的事可能晚到。；逐项根因证据、原文处理与研究建议见 cases.md R085，记录数不是独立事故数。（来源：`coverage-expansion/sweep-evaluation/SV-120-transcript.md:160-165。`）
- [F330] 【问题记录 R086】长时冥想或锻炼缺少流程和状态反馈：持续服务陷入无效循环，用户不知进度。；逐项根因证据、原文处理与研究建议见 cases.md R086，记录数不是独立事故数。（来源：`coverage-expansion/sweep-config/SF-201.md:214；sweep-core/SC-8.md:207。`）
- [F331] 【问题记录 R087】任务中心同一任务显示多行：用户看到三个任务里有老记录和新记录说同一件事。；逐项根因证据、原文处理与研究建议见 cases.md R087，记录数不是独立事故数。（来源：`coverage-expansion/sweep-evaluation/SV-138.md:115；汇总性证据，未附截图原图和原始对话。`）
- [F332] 【问题记录 R088】任务类能力缺少可查看列表和开关：车机找不到查看任务 list 和开关的位置，点左上角没响应，口头询问也答不上来。；逐项根因证据、原文处理与研究建议见 cases.md R088，记录数不是独立事故数。（来源：`coverage-expansion/sweep-evaluation/SV-138.md:90；汇总性证据。`）
- [F333] 【问题记录 R089】时间过去 29 分钟，卡片仍写 30 分钟后：任务卡时间表达没有随经过时间更新。；逐项根因证据、原文处理与研究建议见 cases.md R089，记录数不是独立事故数。（来源：`case-rewrite-20261029/coverage-summary-20261030.json → extraReads[2].content.content，解码 L129–147（主代理分工全文核读）。`）
- [F334] 【问题记录 R090】弱网断网时任务提醒不到达：任务到点但弱断网情况下提醒没有送达。；逐项根因证据、原文处理与研究建议见 cases.md R090，记录数不是独立事故数。（来源：`case-rewrite-20261029/coverage-summary-20261030.json → extraReads[2].content.content，解码 L129–147。`）
- [F335] 【问题记录 R091】云端定时触发不准：提醒与用户设定的时刻不一致。；逐项根因证据、原文处理与研究建议见 cases.md R091，记录数不是独立事故数。（来源：`case-rewrite-20261029/coverage-summary-20261030.json → extraReads[2].content.content，解码 L129–147。`）
- [F336] 【问题记录 R092】创建成败卡片区别和信息过简：用户不易从卡片判断任务创建是否成功、失败为何。；逐项根因证据、原文处理与研究建议见 cases.md R092，记录数不是独立事故数。（来源：`case-rewrite-20261029/coverage-summary-20261030.json → extraReads[2].content.content，解码 L129–147。`）
- [F337] 【问题记录 R093】先答应，5～10 秒后又说不支持：用户先得到承诺，等待后收到创建失败或能力不支持。；逐项根因证据、原文处理与研究建议见 cases.md R093，记录数不是独立事故数。（来源：`case-rewrite-20261029/coverage-summary-20261030.json → extraReads[2].content.content，解码 L637 起。`）
- [F338] 【问题记录 R094】3:58 开会提醒没有触发【2026-08-04 实车问题】：要求 3:58 提醒开会，助手确认“准时提醒”，到了时间未提醒。；逐项根因证据、原文处理与研究建议见 cases.md R094，记录数不是独立事故数。（来源：`coverage-expansion/sweep-evaluation/SV-257.md:348-359；20260804154943EDEA8F6CCC54615FAE55、20260804155819DA8ED395A7E6916A65F7。`）
- [F349] 【05-18实车摸底】动态Advisor当期43例通过23，通过率原文53.5%，周报列重复/漏建、误删、删除残留/重建、VLM第二任务失败、条件无建议及重复建议等，逐条R035–R049；这是5月历史测试不是11月现状。L4787、4826–4843（来源：`v-lesson-20261107/raw/test-weekly.txt`）
- [F352] 【问题记录 R095】用户更换GUI商品品类的补充被Planner偶现漏接，导致端云任务状态错乱，相关GUI主链理解/分类/参数问题使提测延迟2天，研发配测与下周一提测仍是安排、原文无最终验收。L332–336；详情见cases.md R095（来源：`coverage-expansion/sweep-config/SF-201.md`）


## 10. 演进与方案边界
- [F008] 【版本】产品介绍 v1.0 为 2026-09-25、v1.1 为 10-02 增加开关影响、v1.2 为 10-24 依据 10-23 评审更新；其“同日核查”附录是 11-17 转存补充，不能与 10-24 正文版本混为一谈。L1–6、49–52（来源：`T-v2/feishu/task-product-intro-v1.2.md`）
- [F046] 【演进设计】计划复用 HTTP/RPC→Flow→Planner→Agent/Tool 的现有链路，用 TaskView 替换 goal_list 输入，并将旧 long_term_task.go 动态目标逻辑迁移下线。L1073–1163、1243–1271（来源：`case-rewrite-20261029/async/T-management.md`）
- [F047] 【后续规划】触发平台化、第三方 Provider 注册/鉴权/继续/取消/查询协议、端云优先端与排重、所有交互统一 Task 均是后续方向。L2333–2443（来源：`case-rewrite-20261029/async/T-management.md`）
- [F070] 【能力依赖】赛事持续播报需稳定赛事数据源，通用搜索尚不足；车控依赖车型知识/真实工具/反馈，导航依赖路线行程事件，视觉情绪依赖真实感知。L238、298（来源：`case-rewrite-20261029/async/T-service.md`）
- [F071] 【二期设计】新增用户补充、工具反馈和车辆/行程事件驱动，按计划能继续就推进、需新判断才叫模型改 Script，均不能写成一期已实施。L234、268–272、290–298（来源：`case-rewrite-20261029/async/T-service.md`）
- [F135] 【历史重构】上汽长时任务由同步创建改异步闭环，周报标 08-06 上线并增加消费 advice ACK yitu，和较后动态一页说明“消费通知待接通”存在环境/版本差异。L7967–7974（来源：`chapters/E/raw/h2.txt`）
- [F136] 【历史自研】统一 Task、融合动态 Advisor、GUI 纳入链路在 08-01 提测/08-04 DDL，开发与客户端方案完成但 GUI 仅接口测试，不能当实车 GUI 验收。L7975–7988（来源：`chapters/E/raw/h2.txt`）
- [F228] 【旧演进方向】当时触发时决定执行策略，方案想改成提前决策、先云后端侧，属于规划且不能替代现有触发后Planner重判链路。L135–139（来源：`case-rewrite-20261029/coverage-summary-20261030.json → extraReads[2].content.content（DNA-616二期OnePage，内嵌行）`）


## 车型差异
- [F072] 【渠道】本一页说明明确适用于 Seres 赛力斯，自研运行链路不能直接推广为上汽 Extour 链路。L3、13（来源：`case-rewrite-20261029/async/T-service.md`）
- [F091] 【上汽设计记录】Goal List r39 有距目的地 1 公里、连续 10 天每天 19 点提醒的创建记录，但触发执行仍待联调，不承诺任意复杂条件或车控结果。L15（来源：`case-rewrite-20261029/async/T-dynamic.md`）
- [F169] 【SOP方案差异】任务管理Ultra/Standard勾选、Air写“无长程任务”，旧架构动态目标Ultra/Standard勾选、Air不支持，此方案包标记不能直接当某一车型实车状态。全量功能清单 行55；全量功能清单-架构依赖 行17/21/61（来源：`/Users/bytedance/Downloads/yx-files/AI汽车SOP功能清单 (1).xlsx`）
- [F193] 【上汽历史资源风险】动态Advisor开发期记录“持续取图上云”的带宽性能无法承受，可能导致其他应用被kill、VLM类感知可能无法量产，这是当时风险而非11月全部视觉能力结论。L212–217（来源：`v-lesson-20261107/raw/prod-weekly.txt`）
- [F219] 【非IP改造方案】上汽Goal从vehicle_id+encrypted_doubao_uid迁至vehicle_id+VolcAccountID、回调由映射反查，赛力斯task_record以VolcAccountID替DoubaoUID；方案涉及Goal及AdviceConsumed，不证明全渠道已经迁完。L435–483（来源：`coverage-expansion/memory/COV-MEM-NONBEAN.md`）
- [F220] 【改造阻塞】弋途侧适配阻塞Goal改造，账号通用方案不能替代每项目实际接入状态。L25、1283（来源：`coverage-expansion/memory/COV-MEM-NONBEAN.md`）


## 指标与观测
- [F048] 【观测设计】Task Manager 统一注入 log_id/vehicle_id/task_id/run_id/input_source/operation，状态迁移记 event_type/from_status/to_status/close_reason，外部依赖单独建 Span。L2045–2061（来源：`case-rewrite-20261029/async/T-management.md`）
- [F049] 【观测规划】后续以 task_id/run_id/log_id 聚合 Fornax Trace、日志及事实表形成执行时间线，文中没有已实现的完整任务链路成功率。L2074（来源：`case-rewrite-20261029/async/T-management.md`）
- [F112] 【视觉数字】6–7 秒是预计上报周期，用户每分钟反馈是业务计时，3 是视觉并发，三者应分别观测，原文未给实际识别准确率。L134–148、190、232–246（来源：`case-rewrite-20261029/async/T-visual.md`）
- [F126] 【结果计数】VLM 接收接口分别返回 received_count、forwarded_count、skipped_count、failed_count，样例 errno=0 仍可能 2 条全转发失败，接口成功不等于条件链成功。L577–589（来源：`case-rewrite-20261029/async/A-task.md`）
- [F127] 【视觉观测】task_vlm_result_log 每任务结果一行、按 vehicle_id 分片，保存 channel/task_id/vlm_result/status/log_id/上报与接收时间，状态分 forwarded/expired/task_closed/forward_failed/task_not_found。L783–804（来源：`case-rewrite-20261029/async/A-task.md`）
- [F128] 【观测限制】转发后用 goroutine 异步落库、日志写失败不影响接口结果，因此不能以 HTTP 成功保证观察历史已持久化。L783–785（来源：`case-rewrite-20261029/async/A-task.md`）
- [F204] 【观测分层归纳】研究应分创建记录、规则登记、条件观测、回调到达、Planner入队、实际动作、结果回写、车端状态，避免用单个测试Pass或接口0码代表整链成功，具体真实问题逐条见cases.md。基于上述专项总结与NTHb5Y表的研究归纳（来源：`T-v2/feishu/msgs-条件任务-30d.json`）
- [F229] 【旧可观测问题】倒计时29分钟后仍写30分钟、弱断网不到达、云端定时延迟、创建成功失败体验差与卡片简略是该原文明确列出的当时问题。L129–147（来源：`case-rewrite-20261029/coverage-summary-20261030.json → extraReads[2].content.content（DNA-616二期OnePage，内嵌行）`）
- [F234] 【旧页建议指标】现有T列创建闭环率、取消后新增执行次数、触发到用户结果时延、修改对象与规则一致率、结果可归属率、结束策略一致率6项，均为建议定义，无已达标数字或统一阈值。metrics[1:6]，destinations-base D223–D228（来源：`HTML/01-进行中/豆包汽车-业务学习站-v72.html → DATA.modules[id=T]（相对codex目录）`）


## 排期与现状
- [F009] 【接入现状】附录引用 2026-11-10 接入说明把异步任务推理、持续目标管理/任务管理工具、任务管理列为 IP/非 IP 均可选、不可定制、不可配置，但其余接入细节仍为模板占位。L49–50（来源：`T-v2/feishu/task-product-intro-v1.2.md`）
- [F050] 【估算非承诺】Task Service 九项开发估算为 3+2+4+3+2+2+2+3+3=24 人日，GUI 接入另 3 开发人日、2 联调人日，表中未给 Task Service 联调合计或上线日期。L2449–2658（来源：`case-rewrite-20261029/async/T-management.md`）
- [F051] 【成熟度】打断与恢复段仍 TODO，Input Manager 对接节奏未明确，核心逻辑为伪代码、并发幂等补偿需编码补齐，不能当已量产实现。L680–686、1849、2026（来源：`case-rewrite-20261029/async/T-management.md`）
- [F137] 【历史工程进展】视觉长时任务 08-31 方案评审、09-09 开发完成、09-11 Trigger 联调、09-20 客户端联调后标已上线；这是具体视觉子能力，不能推及所有二期长时任务。L3309–3315（来源：`chapters/E/raw/h2.txt`）
- [F138] 【历史工程排期】赛力斯任务中心 10-10 服务端开发完开始联调、预期 10-20 上线仍 DOING，不可将预期改写成已上线。L3316–3322（来源：`chapters/E/raw/h2.txt`）
- [F139] 【历史 UI 分层】任务岛 08-28 服务端上线并完成联调，即时交互卡 09-08 联调，此两个状态不等于完整任务中心交付。L4510–4515（来源：`chapters/E/raw/h2.txt`）
- [F140] 【历史依赖】任务模块有效列表供 yitu 查询避免静态 Advisor 冲突，09-03 链路明确/09-11 提测，但产品与赛力斯未对齐阻塞舒适开发。L4502–4509（来源：`chapters/E/raw/h2.txt`）
- [F159] 【界面版本】任务中心初版08-31、v0.3 09-15、v0.4 10-20、v0.5 10-28，正文通用长时仍有“目标915”字样，不证明09-15已交付。L31–134、168–174（来源：`case-rewrite-20261029/support/U.md`）
- [F170] 【SOP成熟度】任务管理与异步任务核心行标可量产，任务中心、长时卡片、任务岛交互标内部预研，可量产定义仅至少一个项目已落地可标准交付。子功能交互表达 行6/7/26；清单说明&change log 行10–11（来源：`/Users/bytedance/Downloads/yx-files/AI汽车SOP功能清单 (1).xlsx`）
- [F171] 【SOP选配】异步任务推理与工具集合入口IP/非IP均必选，底座任务管理工具IP/非IP均可选，与11-10接入说明三项可选不同层且未给解释。子功能对话推理 行10–16；座舱工具集合 行3；账号记忆任务底座 行11–14（来源：`/Users/bytedance/Downloads/yx-files/AI汽车SOP功能清单 (1).xlsx`）
- [F189] 【较后工程进展】10-08至10-23汇集记录中赛力斯任务中心标DONE、10-20已上线，比h2较早“预期10-20”更近；这是服务端周报转存的项目进展，未含本轮实车验收。L1598–1610（来源：`coverage-expansion/sweep-config/SF-109.md`）
- [F190] 【其他渠道排期】东风任务迁移和显示扩展预期10-30开发完，停车大师GUI仍DOING且方案待评审，均非已交付。L1385–1409、1612–1620（来源：`coverage-expansion/sweep-config/SF-109.md`）
- [F194] 【旧工具状态】日程提醒工具在上汽环境已下线，记录时量产替代方案未明确，不能把旧日程工具缺陷直接当现行TaskService同一链路问题。L205–210（来源：`v-lesson-20261107/raw/prod-weekly.txt`）
- [F198] 【11-16项目待办】奇瑞EHV海外消息提触发器中间件与平台服务迁移、可能新增条件配置，是迁移待办而非可用证明。content_excerpt/messages[0..5]，详见cases.md证据边界与现状段（来源：`T-v2/feishu/msgs-条件任务-30d.json`）
- [F208] 【10月限定上线】较后周报将通用长时任务建设标DONE、10-22上线，Task Agent迁出独立服务承担创建/修改/执行而数据接口保留AIDV，当时只支持座椅按摩档位和VLM场景，“带我兜风”仍对接，赛事实时数据取不到。L1626–1646（来源：`coverage-expansion/sweep-config/SF-109.md`）
- [F209] 【功能范围】“预期交付5个核心case”是该项背景目标，不能用DONE字样声称5个场景全部完成。L1630–1636（来源：`coverage-expansion/sweep-config/SF-109.md`）
- [F222] 【11-03文字记录】“长时任务这周应该可以验收，晚上去看”是计划验收和待查看，并非已经完成验收。L1332（来源：`v-lesson-20261105/memory/meeting-1103-transcript.md`）


## 资料冲突与证据缺口
- [F010] 【缺口】“典型示例”段为空，不能声称该最新版覆盖持续目标、视觉任务和 GUI 任务的完整运行设计；绑定说明举了沿途风景目标，AI 关闭清空范围却只显式枚举四类任务。L26–28、40、47（来源：`T-v2/feishu/task-product-intro-v1.2.md`）
- [F052] 【范围差异】技术方案将 GUI 多步纳入 Task、周期按摩到车辆下电结束，而 10-24 产品只显式定义四类定时/条件任务并用账号退出清空作归属策略，两者不能合并成“所有任务下电即删除”。L244–393、1305–1311；对照 task-product-intro-v1.2.md L20–47（来源：`case-rewrite-20261029/async/T-management.md`）
- [F053] 【接口代际】自研设计将操作识别下沉 Spec Builder 并以 task_manage 为纯入口，旧 goal_list_update 的选择操作和 TaskView 改造需分代说明，不能把两套字段拼成同一已上线协议。L1108、1853、2126–2162（来源：`case-rewrite-20261029/async/T-management.md`）
- [F073] 【设计与实现差距】Task 管理设计要求取消停止生态 Provider，但较后的 Task Service 一页说明明确普通取消尚不覆盖直接 GUI，多用户、并发重试、取消仍待验证，应以后者描述现状并保留前者为目标。L266、294；对照 T-management.md L1927（来源：`case-rewrite-20261029/async/T-service.md`）
- [F074] 【成熟度冲突】本页明确 Script、Step/Action 和独立 Task Agent 为二期尚未实施，SOP 相关行将功能标为可量产；交付标签与具体实现需双列核对。L57–74、270、292（来源：`case-rewrite-20261029/async/T-service.md`）
- [F075] 【结束策略差异】早期按摩场景到下电/取消结束，本页允许按次数/截止日期/持续保留，并要求离线下电恢复逐场景明确，不能统一写成所有周期任务当次行程即终止。L175、278–280；对照 T-management.md L324–334（来源：`case-rewrite-20261029/async/T-service.md`）
- [F092] 【地理条件冲突】9 月上汽动态 Advisor 引用“距目的地 1 公里”的创建记录但未验收触发，10-24 最新产品明确地理围栏暂不支持，写作应按新产品收窄并保留旧试验记录。L15；对照 task-product-intro-v1.2.md L35–36（来源：`case-rewrite-20261029/async/T-dynamic.md`）
- [F093] 【修改能力车型差异】自研 Task 设计有 update 并同步规则，上汽 update_goal_by_id 无业务入口且协议 TODO，应按托管方分开讲。L233–243；对照 T-management.md L1927（来源：`case-rewrite-20261029/async/T-dynamic.md`）
- [F100] 【字段冲突】字段表规定 enabled，返回示例却用 enable 且附未列字段 operate_msg，接入需以当前协议确认，不照抄示例；这两种拼写不能悄悄统一后隐藏差异。L487–497、662–663、675–676、688–689（来源：`case-rewrite-20261029/async/T-goal.md`）
- [F113] 【职责冲突】视觉产品原文说 TaskService 接收分析 VLM 结果，Task 管理目标态说 VLM 语义匹配归 Trigger、Task 不二次匹配，需区分接收传输与条件判断归属，不默认为同一实现。L279–283；对照 T-management.md L1556（来源：`case-rewrite-20261029/async/T-visual.md`）
- [F114] 【协议字段差异】正式输入代码写 user_query，后续示例写“感知目标”，联调须确认真实协议字段，不能把中文演示字段直接当线协议。L201–224、288–296、412–457（来源：`case-rewrite-20261029/async/T-visual.md`）
- [F115] 【开关边界】此处 AlwaysOn 是舱内视觉感知总开关，与 V/R 的全时语音免唤醒开关重名但不是同一概念，关闭清视觉观察列表，最新版 AI 关闭清四类任务、语音禁用仍触发但静音，是三种不同控制，不能用“关语音任务停了”替代。L150–182；对照 task-product-intro-v1.2.md L45–47（来源：`case-rewrite-20261029/async/T-visual.md`）
- [F129] 【字段精化】技术方案将产品示意的“任务编号/user_query/感知目标”明确为线上推送 task_id/task_version/target 与回报 result，讲任务侧协议时优先具体技术字段，产品示意保留为概念。L248–381、479–553；对照 T-visual.md L201–224（来源：`case-rewrite-20261029/async/A-task.md`）
- [F130] 【版本校验未落定】方案将 task_version 设为选填并说明可防旧覆盖，但“老版本任务不转发”的条件被划掉，不能声称所有旧版本 VLM 回报已强校验丢弃。L322–332、506–526、606（来源：`case-rewrite-20261029/async/A-task.md`）
- [F131] 【正文未完整承载图片】流程图与测试评审为空或只保留标题，不能从缺失图推断重试、频控或生命周期完整策略。L64–90（来源：`case-rewrite-20261029/async/A-task.md`）
- [F141] 【消费通知冲突】周报称 08-06 上汽 advice 消费 ACK 已上线，09 月动态 Advisor 一页说明仍写消费通知待接通；缺环境与版本信息，两边并列，不擅定统一现状。L7967–7974；对照 T-dynamic.md L335（来源：`chapters/E/raw/h2.txt`）
- [F151] 【任务岛示例冲突】create 枚举是 1，创建成功示例却 message_type=2（关闭也是2），应以枚举字段定义作设计依据并保留示例错误。L1183、2161–2166、2251–2255（来源：`case-rewrite-20261029/support/task-island.md`）
- [F152] 【任务岛分类不齐】分类表含 continuous，字段表只列 time/condition，持续笑话示例写 condition；首条列表样例缺必填 task_version，变更任务推送段空白，均不能用示例补成完整协议。L248–250、979–981、1091–1117、2065–2067、2281（来源：`case-rewrite-20261029/support/task-island.md`）
- [F160] 【限额证据优先级】10-28界面PRD比10-24产品介绍日期新但用途不同，本轮按用户指定以10-24产品任务数量/时长/绑定/开关规则为准，长时6仅保留界面PRD声称且未见新产品对应条款。L214–228；对照 task-product-intro-v1.2.md L30–47（来源：`case-rewrite-20261029/support/U.md`）
- [F161] 【状态层冲突】任务中心 waiting=创建中且有paused，任务岛 created/waiting/running/closed，自研Task仅waiting/running/closed，上汽Goal为creating/pending/running/done，必须标来源层不能硬映射。L194–206；对照 task-island.md L918–1069、T-management.md L1328–1363、T-goal.md L503–587（来源：`case-rewrite-20261029/support/U.md`）
- [F165] 【卡片示例错误】任务卡片“每3小时提醒休息”示例却含meituan排队订单并缺task_version，创建推送又message_type=2、持续笑话type=condition且更新推送空白，均属协议样例不齐，不是实际订单事故。L493–529、945、1055（来源：`chapters/W/raw/task-card-tech.txt`）
- [F172] 【Script成熟度冲突】SOP两张表将Script动态调整列可量产，而09月Task Service说明列二期尚未实施；保留文档日期和具体功能粒度，不能用清单标签推定通用长时全部完成。子功能对话推理 行16；账号记忆任务底座 行14；对照T-service.md L57–74、270–292（来源：`/Users/bytedance/Downloads/yx-files/AI汽车SOP功能清单 (1).xlsx`）
- [F180] 【混合条件口述】“每天早上上车”被口述为循环定时示例，但实际兼具时间与上车条件，不能据此断言纯时间规则能观察上车。L192，00:30:23（来源：`v-lesson-20261105/director-talk.md`）
- [F182] 【时长冲突】早期定时触发器建议相对单次最多24h、绝对单次最多7天、循环1min–24h、视觉定时最多4h待定，与10-24任务产品统一1min–2周不同；前者是触发器设计建议，不作为新任务创建限制。L69、96、125–126、153（来源：`case-rewrite-20261029/async/G-time.md`）
- [F183] 【修改编号边界】早期触发设计说重复任务/改时间/改类型/内容/触发类型均删旧建新、任务ID变，任务管理设计要求定位并更新原Task；可能属触发规则与Task不同层，但原文未明确，不能擅自消除冲突。L423–526；对照T-management.md L1927（来源：`case-rewrite-20261029/async/G-time.md`）
- [F184] 【结束暂停内部矛盾】触发设计既写关开关满足结束又写暂停可恢复，既写下电本趟结束又写下电跳过明天继续；以新版产品的开关规则与逐任务结束策略约束，不统一推广旧描述。L295–301、373–377（来源：`case-rewrite-20261029/async/G-time.md`）
- [F191] 【标题误归属风险】本转存“任务管理模块”条目的背景和链接实为输入管理，10-23至11-03排期不能直接归Task；另任务管理器接主链属具身智能R11，不属于车载T现状。L1506–1532、2395（来源：`coverage-expansion/sweep-config/SF-109.md`）
- [F199] 【本地消息截断】外层status=partial且truncated=true，content_excerpt只有前60000字符，内层称returned_count=78但本地只保存前7条消息和第7条测试用例1–176（NTHb5Y表行2–177），不能声称读到全部78条。content_excerpt/messages[6].linked_content[0].content.sheets[0]（来源：`T-v2/feishu/msgs-条件任务-30d.json`）
- [F200] 【时长新旧分歧】用例37写最大2周又括注“改为一年”，用例40仍认为1个月过长；10-24产品明确2周，本轮以用户指定产品约束为基准，11月测试注释只作变更线索，不直接宣称一年已生效。NTHb5Y 用例37/40、表行38/41（来源：`T-v2/feishu/msgs-条件任务-30d.json`）
- [F201] 【环境越界】测试用例36/71预期最小1分钟，但36备注task环境能创建30秒，测试环境行为与产品限制不一致。NTHb5Y 用例36/71、表行37/72（来源：`T-v2/feishu/msgs-条件任务-30d.json`）
- [F202] 【测试表自身错误】用例90 query22度而触发列28度、94 query低于29度而触发列低于22度、70 query电量却预期车速，均不能直接算模型错误。NTHb5Y 用例70/90/94（来源：`T-v2/feishu/msgs-条件任务-30d.json`）
- [F203] 【能力边界】地理围栏用例108/173、舱外视觉用例144标不支持或待定，相邻设计用例不证明已支持。NTHb5Y 用例108/144/173（来源：`T-v2/feishu/msgs-条件任务-30d.json`）
- [F207] 【同句不同运行边界】“每5分钟播赛况”在最新产品是循环定时例，每次有效触发可新Run；Task Service二期则把同一场比赛的等待/查询/播报编入同一Run，Run边界取决于托管运行设计，不能只看时间间隔。产品L22；T-service.md L50、104、246、270–280（来源：`T-v2/feishu/task-product-intro-v1.2.md；case-rewrite-20261029/async/T-service.md`）
- [F210] 【二期时间冲突的解释边界】09月Task Service说明Script/独立Task Agent尚未实施，10-22周报称限定场景已上线，11-03文字记录仍说本周应该能验收；应保留“设计—限定上线—计划验收—11月摸底问题”四个状态，不能笼统写二期全未实施或全已交付。L1626–1646；T-service.md L270–292；meeting-1103-transcript.md L1332（来源：`coverage-expansion/sweep-config/SF-109.md`）
- [F213] 【旧建议覆盖新任务运行】旧输入PRD同一Advisor排队仅保留最新，新输入技术契约每个task_run_id独立且同ID幂等，不得把旧覆盖规则直接用于循环任务各次Run导致丢任务。L1370–1382；source-M-prd.md L721–723（来源：`case-rewrite-20261029/main/source-M-tech.md`）
- [F230] 【旧时长与新产品冲突】616方案用365天上限，10-24产品用2周，11月测试表又括注改一年；本轮仍按指定最新产品约束保留2周，另外两方列变更线索与旧设计。L536；对照task-product-intro-v1.2.md L35、NTHb5Y用例37（来源：`case-rewrite-20261029/coverage-summary-20261030.json → extraReads[2].content.content（DNA-616二期OnePage，内嵌行）`）
- [F231] 【地理围栏不是导航距离】上汽无地理围栏但可考虑已有导航点距离条件，最新产品不支持地理围栏不应被讲成所有导航条件都不存在，也不能从导航创建成功推广任意地点感知。L386–420（来源：`case-rewrite-20261029/coverage-summary-20261030.json → extraReads[2].content.content（DNA-616二期OnePage，内嵌行）`）
- [F232] 【生态提醒未验收】用户2分钟未回应提醒继续GUI是二期设计要求，不是接入已完成或统一任务超时。L671–701（来源：`case-rewrite-20261029/coverage-summary-20261030.json → extraReads[2].content.content（DNA-616二期OnePage，内嵌行）`）
- [F235] 【旧页额外限额】旧页同段既写46=20定时+20条件+6长时，又写“常识跟进≤6、条件触发≤40”，须保留知识点而不把不同分类数字相加。sections[id=t-manage].paragraphs[6]，D101–D102（来源：`HTML/01-进行中/豆包汽车-业务学习站-v72.html → DATA.modules[id=T]（相对codex目录）`）
- [F236] 【旧页措辞错误】旧页把进行中与成功/失败/跳过/取消统称Run终止状态，原始Run枚举中running是非终态，应在后续写作修正，不照搬。sections[id=t-channels-results].paragraphs[6]，D076（来源：`HTML/01-进行中/豆包汽车-业务学习站-v72.html → DATA.modules[id=T]（相对codex目录）`）
- [F237] 【旧页证据缺口】旧页称任一条件不存在则整个条件任务注册失败并回原因，但当前核心技术伪代码未给完整校验/补偿契约，先保留旧知识点，再以原始接口和实际注册失败回包补证。sections[id=t-create].paragraphs[5]；T-management.md L1907–1918（来源：`HTML/01-进行中/豆包汽车-业务学习站-v72.html → DATA.modules[id=T]（相对codex目录）`）
- [F243] 【任务入口代际】07月上汽SP把goal_list_update当创建删除入口，11月工具快照已区分独立task_agent/task-agent与AIDV内部goal_list_update，T应标项目与版本，不把三个工具名当完全同义。L35、61；对照saic-sp-0731-tools.txt L113–119（来源：`chapters/F/raw/tool-list.txt`）
- [F339] 【数量冲突总列】SOP旧工具6个定时/条件+1持续、任务中心46=20+20+6、旧页另有常识跟进6/条件触发40，与10-24产品定时类20/条件类20并存；按用户指定新产品处理定时条件约束，持续容量与配额主体仍不补造。产品L30–43；SOP座舱工具集合行3；U.md L214–228；旧页D101–D102（来源：`T-v2/feishu/task-product-intro-v1.2.md；T-v2/sop-items.md S08/H06；case-rewrite-20261029/support/U.md；T-v2/destinations-base.md`）
- [F346] 【工具定义能力冲突】较完整目标工具定义将依赖视觉/VLM排除，07-31上汽SP却列宝宝照看/副驾睡着为可交目标，视觉专门方案又有cabin_vision类型；应分工具实现和项目版本，不因存在视觉Task就把goal_list_update在所有项目开放视觉。L64；对照F/raw/saic-sp-0731-tools.txt L113–119、A-task.md L173–185（来源：`chapters/E/raw/tools-io.txt`）
- [F347] 【工具时长冲突】本工具说明允许一年内、拒超过365天，产品10-24为1min–2周、11月测试又括注一年；保留三方来源，不静默扩大产品限制。L64；对照task-product-intro-v1.2.md L35、NTHb5Y用例37（来源：`chapters/E/raw/tools-io.txt`）


## 阅读与副本核查记录
- [F011] 已逐行读完本文件 52 行，附录引用的 SOP 将以实际工作簿复核。L1–52（来源：`T-v2/feishu/task-product-intro-v1.2.md`）
- [F054] 已逐段读完 2658 行，保留表格所有实质文本与代码；图组多个标题后无可读图内容，图中未转存的信息不能凭标题补足。L1–2658、664–688（来源：`case-rewrite-20261029/async/T-management.md`）
- [F055] 同名 JSON 解包 content[0].text→content.content 并还原换行/转义后与 MD 一致，compact 只是表格压缩及 HTML 实体转换、非第二证据；以下其他五份异步原文亦逐一比对，同名 JSON 均与 MD 等价。JSON 元数据 obj_edit_time 对本文件为 2026-09-03 UTC，不能从 10-29 文件夹日期推定内容更新日期。（来源：`case-rewrite-20261029/async/T-management.md`）
- [F076] 已逐行读完 347 行；同名 JSON 正文与 MD 仅末尾换行不同，compact 去表格标签/分隔符后正文一致；JSON obj_edit_time 为 2026-09-20 UTC。L1–347（来源：`case-rewrite-20261029/async/T-service.md`）
- [F094] 已读完 357 行；compact 删除了取消目标编号占位 g-<id> 中的 HTML 转义片段，使用完整版；同名 JSON 正文等价，正文自述更新时间 09-08、JSON 最后编辑 09-18 UTC。L7、69、341（来源：`case-rewrite-20261029/async/T-dynamic.md`）
- [F101] 已读完 726 行；JSON 同正文、compact 为表格压缩等价；JSON obj_edit_time 为 2026-08-26 UTC，早于 10-24 产品限制。L1–726（来源：`case-rewrite-20261029/async/T-goal.md`）
- [F116] 已读完 488 行；修订记录从 07-01 初版到 08-24 加 AlwaysOn，JSON 最后编辑 09-16 UTC，同名 JSON 等价，compact 是实体与表格压缩副本。L3–106、1–488（来源：`case-rewrite-20261029/async/T-visual.md`）
- [F132] 已读完 990 行（尾部为空/表格结束），同名 JSON 正文等价，compact 是 HTML 实体/表格压缩；JSON obj_edit_time 为 2026-09-02 UTC。L1–990（来源：`case-rewrite-20261029/async/A-task.md`）
- [F142] 已读任务相关完整段，包括 HOLD任务中心、视觉上线、任务岛、登录切换、上汽异步闭环与自研任务；本周报汇集多期记录，未逐句精读无关服务模块。L3280–3335、4485–4520、6120–6152、7940–7995（来源：`chapters/E/raw/h2.txt`）
- [F153] 已由状态研究分工逐项读完整 2873 行（去空行及表格标签，不丢单元格实质文本），无具体整车验收日期。L1–2873（来源：`case-rewrite-20261029/support/task-island.md`）
- [F162] 已完整读取414行有效内容，任务界面入口/卡片设计留U不在T展开。L1–414（来源：`case-rewrite-20261029/support/U.md`）
- [F166] 已完整读取1272行有效内容，和support/task-island主体同源但保留美团独有字段，不按完全重复略过。L1–1272（来源：`chapters/W/raw/task-card-tech.txt`）
- [F173] 以python3 -I+openpyxl只读逐单元格检查全部13个sheet，12核心来源行、26关联二级项、14一级/旧架构对照详见sop-items.md；12是原始行数非去重能力数。（来源：`/Users/bytedance/Downloads/yx-files/AI汽车SOP功能清单 (1).xlsx`）
- [F181] 已核读指定任务/Advisor完整文字记录段，以逐字稿为证据而非智能纪要；其无任务数量、时长、绑定、开关或T专属线上指标。L57–97、187–222、347–357（来源：`v-lesson-20261105/director-talk.md`）
- [F185] 补读完整554行，触发器匹配/信号/频控细节留G，只提任务接口边界、冲突与设计案例。L1–554（来源：`case-rewrite-20261029/async/G-time.md`）
- [F188] 已核读旧设置源相关段并标06-23版本，未以它覆盖10-24产品任务规则。L16–48（来源：`lecture-rewrite-20261029/async-source-compact/A84.md`）
- [F192] 已核读任务相关工程段，源为partial清理副本，不能声称完整周报；只保留可读段所述状态。L1385–1409、1506–1532、1598–1620、2395（来源：`coverage-expansion/sweep-config/SF-109.md`）
- [F195] 已读上汽动态目标资源及日程工具相关段；无精确季度日期处不从430排期自行推定实际交付日期。L195–225（来源：`v-lesson-20261107/raw/prod-weekly.txt`）
- [F205] 已由案例分工逐字读完本地JSON可用正文及176条完整测试用例，全部设计/测试条目保存在cases.md，后续78条搜索结果不能从截断恢复；仅证据内问题列实际结果，空结果不推成通过。（来源：`T-v2/feishu/msgs-条件任务-30d.json`）
- [F214] 已核读任务上行通用规则完整段，并与旧输入PRD对应条件比对。L1368–1390；source-M-prd.md L721–723（来源：`case-rewrite-20261029/main/source-M-tech.md`）
- [F218] 已核读任务定义/示例完整段含定时、条件、持续及冲突处理转接，不重复D已写正文细节。L780–915（来源：`chapters/D/raw/director-prd.txt`）
- [F221] 已核读动态Goal账号改造相关完整段，账号配置本身的跨车粒度变化不挪作任务取消/迁移策略。L435–483（来源：`coverage-expansion/memory/COV-MEM-NONBEAN.md`）
- [F233] 分工完整读完内嵌749行，主代理复读关键段；内容确实嵌在JSON extraReads[2]，不是仅来源摘要。L1–749（来源：`case-rewrite-20261029/coverage-summary-20261030.json → extraReads[2].content.content（DNA-616二期OnePage，内嵌行）`）
- [F238] 已逐段读取当前T并和old-page.json对照，256叶节点完全相同；249条登记另39段旧版对照，原图18节点/30连线、8评审问题、6建议指标均入destinations-base，网页只读未改。（来源：`HTML/01-进行中/豆包汽车-业务学习站-v72.html → DATA.modules[id=T]（相对codex目录）`）
- [F240] 已读目标管理完整工具定义及前后边界，原表的“新增/删除”不推断出上汽update接口可用。L108–133（来源：`chapters/F/raw/saic-sp-0731-tools.txt`）
- [F244] 已核读Task/目标工具行及完整统计说明，快照日期2026-11-04，不冒充本轮在线核验。L35、50–64（来源：`chapters/F/raw/tool-list.txt`）
- [F340] 广搜以用户所列原关键词忽略大小写匹配，排除本次T-v2产出后788个候选（JSON308/MD300/TXT108/其他72），按原文、转存、压缩副本、正文与索引区分，47个主要非正文来源的任务相关段精读及其余coverage命中说明见cases.md末尾；未把788个候选声称为788份独立全文。（来源：`T-v2/cases.md → 检索审计与来源覆盖`）
- [F341] 初轮先遍历前章目录/关键词并深读T相关段，随后按分工补齐十章全部正文、例子案例、术语表与历史附录；最终103条回指和未来7章边界见overlap.md。（来源：`T-v2/overlap.md → 阅读方法与范围`）
- [F342] 既有页面引用ASY-A31《DNA主动服务主交互技术方案》仅找到索引/引用，未找到独立完整本地正文；已用T-dynamic/T-goal及周报覆盖可见主干，仍保留原协议正文缺口。（来源：`T-v2/destinations-base.md；case-rewrite-20261029/async/T-dynamic.md`）
- [F348] 已读目标工具整行完整定义/输入输出（含长时/条件/定时、删除、排除项、模糊时间与复合任务），其他工具不作为T事实扩写。L64（来源：`chapters/E/raw/tools-io.txt`）
- [F353] 完整性补读完成：V 1–1361、R 1–773、I 1–713、W 1–664、M 1–809、C 1–716、D 1–990、E 1–968、K 1–803、F 1–986，合8783行1353088字节；逐文件分块无截断阅读并在overlap保存新增点，最终103条回指。（来源：`v57-rewrite/full-v59.md；R-v2/full-v62.md；I/W/M/C/D/E/K/F-v2/full.md（各自目录）`）
