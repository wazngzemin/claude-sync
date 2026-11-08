# impact_engines.md — 架构与总览组调研产出

范围：架构与总览组 17 篇 + Director PRD / 静态 Advisor PRD 精读 + E68 评审决策补读。
产物口径：按六官方引擎（Context / Trigger / Director / Advisor / Reflector / HAI）与 N1–N17、映射章，整理"资料有、副本缺或需要修正"的事实。每条标注来源链接、状态、车型。
状态标注：已确认（文档白纸黑字）/ 讨论中或长期方案（文档标 TBD、规划、长期）/ 已废弃或删除（文档划线）。

---

## 0. 顶层框架事实（决定全部映射）

- **六引擎官方出处 = AI汽车产品 one page 的 FeatureList 大表**（https://bytedance.larkoffice.com/wiki/XNy1dc03QorjiOxnmC5cZy3fnhc ，已确认）：上下文感知处理(Context)9 项 / 交互触发管理(Trigger)5 项 / 对话与任务推理(Director)3 项（异步任务推理、即时任务推理、离线简单任务）/ 目标驱动(Advisor)2 项（静态目标、动态目标）/ 学习沉淀(Reflector)1 项（自主优化 skill）/ 交互表达(HAI)10 项。产品架构节 4.4 Reflector 只有标题无内容——**Reflector 在 one page 正文是空节，FL 里才有"基于用户交互识别偏好与负向体验、主动调节记忆偏好并沉淀任务经验"一句**。
- **E68 评审决策（赛力斯，机密）定版的是四引擎**：信息感知引擎、对话推理引擎、目标驱动引擎、交付表达引擎（https://bytedance.larkoffice.com/wiki/CZbQw8VzmiZ3x3kXizjctYvrnpb ，已确认）。**没有独立的 Trigger 引擎，也没有 Reflector**。→ 副本若把六引擎写成"E68 定版"，口径需修正为：E68=四引擎，六引擎是产品 one page FL 的后来细化（Trigger 从 Context 拆出、Reflector 独立）。
- **长期架构蓝图（豆包incar1.0-长期架构梳理）用的是另一套五段表述**：Perception / Attention（含拒识）/ Thinking / Memory / Action+Express；豆包 Engine = Watcher + 主 Agent + 功能向子 Agent + 内心向子 Agent（https://bytedance.larkoffice.com/wiki/XM8GdtFsTok8CwxcMrKcywMmnQg ，长期方案）。→ N 系列章若只写六引擎，建议补一句"长期蓝图的 Watcher≈Context+Trigger、内心向子 Agent≈Reflector"的映射，否则长期架构与 N 章两套词对不上。
- **用户点名的 10/24 Director PRD 不存在**：最新为 v1.7 2026-10-12（编辑人郝晓伟）https://bytedance.larkoffice.com/wiki/XRuKwJ0VPisdUhkxH0ecY1rRn9g 。静态 Advisor PRD 最新为 v0.7 2026-10-12（用户说的 v0.6 是 2026-08-04 版）https://bytedance.larkoffice.com/wiki/QU0PwxnaQiT9ZhkH2bwcwiuBnQg 。
- **AIVA 需求管理**（EOQQwWRQ3ig56OkuQx4c3qYrnOg）fetch 无输出，权限不足，已跳过。

---

## 1. Context（信息感知引擎）

资料有、副本缺或需修正：

1. **Context 的官方 9 项细分**（产品 one page FL，已确认）：语音感知 / 视觉感知 / 身份感知 / 端状态感知 / 事件感知 / 世界信息（天气日历）/ 对话上下文 / 用户记忆 / 知识库。→ N6（Context 加工）目前按"筛选-打分-压缩"工序写，建议补这 9 类原料清单作为输入侧总表，与工序图对齐。
2. **端状态知识库的打法**（产品 one page 核心体验节，已确认）："维护车里详细的端状态知识库，用自然语言描述每一条端状态什么意思、每种值对用户体验意味着什么，再动态注入模型"——case："车里好冷啊"（空调已最高制热风量最大）→ 不重复开空调，改开座椅加热。这就是 Context-FT 筛选/注入的产品级原型，可引用。
3. **长期架构的 Memory 分层**（长期架构梳理，长期方案）：短时记忆=视觉流式文本（舱内身份/关系/行为/物品/位置+屏幕）+当前对话+AI 在做/已做的任务+环境+设备端状态；长时记忆=习惯偏好+状态类语义记忆+持久化视觉+长期情景记忆；且每个 Agent 有独立记忆（专注、减少主 bot 噪音）。→ 副本若讲 Context 只讲端状态，缺"AI 自己正在做的任务"这一类（N6 已写"豆包自我认知/执行中任务"两类 context，方向正确，可补"垂直 Agent 独立记忆"这一长期设计）。
4. **Watcher 的端侧三功能**（长期架构梳理，长期方案）：(1) 观察当前情景为云端思考提供 context；(2) 发现值得注意的事件触发思考和行动；(3) **全时多模聆听，替代 ASR 和拒识模块**。→ 这是"端+云两级"架构的长期目标，副本 N3 讲端云仲裁时应标注：当前是端云并行仲裁，长期 Watcher 要直接替代 ASR/拒识。
5. **身份感知双因子**（产品 one page 4.1.4，已确认）：赛力斯方案=赛力斯车主/授权用车人关联火山豆包账号+车内 Face ID；关键权限操作时 Face ID+声纹双因子绑定。
6. **场景感知状态信号库**（产品 one page Roadmap 节引用）：旧方案 sheet"「主线」场景感知状态信号库（旧方案不维护）"https://bytedance.larkoffice.com/sheets/Pbw4sSfIRhhc2EthDUicfRr1nWb ——search digest 里的 235 条信号库是旧方案，副本引用时注意标"旧方案不维护"。

## 2. Trigger（交互触发管理）

1. **Trigger 官方 5 项**（产品 one page FL，已确认）：对话节奏管理（VAD/多音区多人/免唤醒人机识别/语音打断/快速接话/异常兜底+NLG）、语音拒识（语音+视线共同判断召回还是拒识）、手势（指着说）、触发器（端侧+云端，触发条件任务或 advisor）、系统通知（卡片插入对话流）。→ 副本 Trigger 章若缺"语音+视线双信号拒识"和"系统通知插入对话"两项，需补。
2. **拒识三态 + 语音四事件**（长期架构梳理，长期方案）：拒识模块输出 reject/listen/reply；语音侧事件四态 Reject / Interrupt / Response / Listen。Attention 模块=工程触发（注册事件：到点/到家附近/用户离车 200m/有人打喷嚏/唤醒）+ 多模态模型自主触发混合，一期全工程触发。
3. **预设任务的五步端云协同**（主动服务 onepage + 03 副本，已确认）：开关校验→触发判断→交互承接→执行前复核→车控执行回读；**触发器只判断"场景何时发生"发业务事件，不直接出卡片、不直接执行车控**（责任边界，已确认）。首批 4 任务：天气/路况保护（端侧自闭环+语音确认）、后排儿童/宠物关怀（云端协作+语音确认）、后视镜自动加热（端云/静默执行）、充电口盖智能开启（云端协作+视觉确认）。
4. **交互策略三档**（03 副本，已确认）：静默执行 / 告知执行 / 语音确认；底线=需车辆动作时用户保留确认权、车端保留最终安全门禁、动作前复核车况、动作后回读真实状态。
5. **仲裁历史口径**（座舱大模型 PRD 对外公版 v1，2024/12，已确认）：domain 仲裁给大小模型（车控/导航/多媒体等高频垂类给 NLU），剩余冲突 domain 按简单/复杂仲裁；简单=命令格式规范+控制对象清晰；复杂=模糊/口语/不完整/隐式；**多轮依赖上文（指代类）一律走 LLM，NLU 强多轮除外**。→ 与 13_planner_s7 的"合并 TOB 线简单复杂和意图、S7 不加意图 router、S9-11 目标 ACC≥96% P50≤150ms P90≤250ms"连起来，就是仲裁模块的演进线。

## 3. Director（对话推理引擎）★ 与副本 05 D / N3 的口径差异逐条

来源：Director PRD v1.7（https://bytedance.larkoffice.com/wiki/XRuKwJ0VPisdUhkxH0ecY1rRn9g ）。

1. **输入类型 PRD 明列 4 种**：user input / advice / tool feedback / **event**（event 示例="用户刚打断播报，已播/未播内容"，含拼接输入）。→ 副本 05 D 的输入只讲了"用户 query、上下文、工具能力、执行结果"，**未列 event 这一类输入**；N3 补充画板讲了打断，但"打断/播报中断是 Director 的第四类结构化输入"这个点需补进 05 D。
2. **播报策略口径**：PRD 明确"同一轮多工具 feedback 到齐后统一推理播报（非返回一个播报一次）"，且"**下游工具不具备自主播报权限，所有交互内容必须返回 Director 统一播报**"。→ 副本 05 写"话语和表情走 O01 呈现链，两路并行，不必等工具全部完成才开始准备说话"。**两者口径需对齐修正**：可以并行准备 TTS 资源，但"播报内容本身"是等齐 feedback 后由 Director 一次推理产出，不是逐工具逐次播报。
3. **条件任务仲裁 PRD 列 5 条重点关注**：条件是否可感知 / 触发可能性 / 价值观合规 / 可执行性 / 条件与动作是否矛盾。→ 副本 05 D5 只覆盖"条件不可感知+越界危险"，缺"价值观合规""条件动作矛盾"两条，需补。
4. **v1.7 新增人设与讲话风格切换**（tbd），且每种风格下维护"长期且动态的独特对话记忆"。→ 副本未覆盖，属新增待补。
5. **高阶能力评测 6 维 24 项**（人格与价值观/情绪情感/语言艺术/认知与智力/自主性/关系与记忆）。→ 副本 05 验收指标只有基础维度（首 token/ACC/回复 ACC），需补高阶评测大表作为目标态。
6. **项目标准化工具层 32 工具表**：分必选/可选，主线+saic+seres 三列，含 restaurant_reserve（美团餐厅订座）、parking_fee_pay、amap_complex_planning、amap_navigation_interaction、issue_report、trip_planning、customised_playlist。→ 与 search digest 的"FC 协议 1115 条"是两层：1115 条是后训练 FC 协议规模，32 个是项目标准化清单；注意 digest 里"停车缴费（停简单）"与 PRD 工具表的 parking_fee_pay **供应商口径不一致**，需向 PRD 核对。
7. **打断恢复 5 条规则**（信息价值判断/话题合并/长内容提炼/补说话人称呼/执行结果确认不补）：副本 N3 补充图已覆盖，但 05 D10 只有一句话简提，建议在 05 D 补链接到 N3 图。
8. **Director 支持弱网/无网环境专节**（cite OQLMwrr9giojtqkflT6c1ItYnqf）。→ 副本若未提"Director 自身有弱网降级"，需补（与 Watcher 端侧兜底是两条线：Watcher 兜底语音，Director 兜底推理）。
9. **性能目标一致**：P50 首 token 500ms / P90 800ms（PRD）= 13_planner_s7 的 2.6 整体目标（首字 P50≤500/P90≤800；S7 过渡期 P90≤1200）。无冲突，可互证。
10. **Director 演进三步走**（PRD 画板 d_director_00，已亲眼看）：Step1 director 替代意图分类/简单复杂仲裁/NLG → Step2 内心世界建立、人格情绪养成、自学习能力 → Step3 更强推理能力、更小推理窗口、想象力上限。→ 副本应标注"Director 当前在 Step1，Reflector（Step2）是后续方向"。
11. **Director 内部流**（PRD 画板 d_director_01，已亲眼看）：user query + advisor input → 流式对话响应→任务拆解→结构化任务序列（task1/2/3）→ tool call；tool response 回流"总结和反思"再回流式对话响应；context 顶置；agent/tool 栈=车控fc/s2s/poi及导航/音乐/视频/车书/gui/vqa/联网/状态查询/记忆/face id/条件任务。
12. **主观感**：PRD 里"advisor"以 advice 形式作为 Director 的输入之一——与静态 Advisor PRD 的边界一致（advisor 只出建议，planner/Director 决定怎么办成）。

## 4. Advisor（目标驱动引擎）

1. **SLS 主动服务完整构成**（静态 Advisor PRD 开头 callout，已确认）：**静态 advisor（舒适/出行/情感/内容）+ 系统预设条件任务 + 赛力斯自闭环**。与预设任务的边界三条件（满足其一即走预设任务）：场景非常明确 / 推荐窗口期要求高 / 个性化需求低。
2. **Advisor vs Planner 边界**（两篇 onepage 一致，已确认）：advisor 主动挖掘"该不该关心、关心什么、建议什么"；planner 被动承接"拿到目标后怎么办成"；planner 第一性原则是快速响应，advisor 可牺牲推理时间多轮 react。
3. **Roadmap 三期量化指标**（PRD，已确认）：1 期=端到端跑通，舒适 50%+出行 40%+情感 50%，依赖触发器/端状态/世界信息/记忆/视觉；2 期=动态事件模块+子目标接任务中心+动态 adv goal list 接入，舒适 100%+出行 80%+情感 100%+内容 50%，满意度 60%；3 期=全 100%，满意度 80%。v0.6 会议结论：子目标与动态 advisor goal list 冲突机制 3 期考虑；子目标接任务中心时间待定。
4. **动态事件是 Context→Advisor 的枢纽**（PRD，2 期）：承担筛选+加工+分发；input=人人对话/人机对话/端状态事件日志/即时端状态/推荐 history；案例：识别"益红晕车了"→舒适 adv；聊《李白》版权→内容 adv。→ 这是 Context-FT 与 Advisor 之间的官方桥接描述，N6 与 Advisor 章应互相引用。
5. **整车频控**（PRD 分层架构画板 a_01，已亲眼看）：预设事件/动态事件/目标 Review 之上有"整车频控=去重/冷却/打扰预算"。→ 副本 Advisor 章若缺频控层（多条主动服务同时触发时怎么取舍），需补。
6. **多事件合并规则**（PRD 画板 a_03，已亲眼看）：事件 B 到来时判断事件 A 的建议是否已输出给 planner；未输出→打断 A 推理，合并 A+B 一起推理。
7. **AI bar 双链路**（PRD 画板 a_08，已亲眼看）：语音确认/告知执行/静默执行→Director 走豆包即时交互卡；界面确认→AI bar Agent（端侧，仅舒适/出行涉及）→火山（云/端）；Director 的 action 执行失败时降级走 AI bar；AI bar 有按钮态/展示态两态切换。→ 这是"策略分发"到端侧呈现的完整链路图。
8. **执行结果评估四指标**（画板 a_01）：执行成功率 / 采纳率 / 误打扰率 / 静默正确率。
9. **v0.7 新增**：临时记忆-短期对话记忆（位置：产品定义-信息层）。

## 5. Reflector（学习沉淀引擎）

1. **FL 里 Reflector 只有一句**（产品 one page，已确认）："基于用户和用户的交互，识别用户的要求偏好与负向体验，主动调节记忆偏好并沉淀任务经验"。4.4 节正文为空。
2. **长期蓝图里 Reflector 的真身=内心向子 Agent 组**（长期架构梳理，长期方案）：人设三观 Agent（定时更新动机价值观）/ 记忆 Agent（定时总结+用户主动记+事件触发）/ 情绪状态 Agent（情感递归算法 new_state=current×inertia+event×sensitivity+memory×recall，含衰减模型）/ 自我探索 Agent（用户离车时上网冲浪积累谈资）。
3. **Director PRD Step2 就是 Reflector 化**（见 §3.10）：内心世界、人格情绪、自学习。→ 副本 Reflector 章建议按"当前=记忆/偏好沉淀一句（FL）+ 长期=内心向四子 Agent 蓝图"双层写。

## 6. HAI（交互表达引擎）

1. **HAI 官方 10 项**（产品 one page FL）：主交互管理（对话状态机+生命周期显示策略）/ 任务交互卡片（即时+长时）/ 语音播报合成（情感化 TTS、风格切换、固定话术轮播、离线基础播报）/ 感知可视化（PHUD）/ 交互氛围灯 / AI launcher / 核心三应用（导航/舒适/媒体三页信息）/ AI 任务岛（dock 栏持续任务入口）/ 豆包闪念（无交互时冒自我思绪）/ 豆包机器人。
2. **主交互=对话状态的呈现**（AI汽车-主交互能力介绍，已确认）：唤醒/识别/聆听等基础对话状态及流转规则；ASR 胶囊清空=音频中止、流式打字机=听见了、最终高亮或清空=是否拒识、"媒体搜索中"=工具调用状态、NLG 时 query 保持上屏；**交互规则不定制，视觉可调，业务卡片可扩展**。
3. **赛力斯主交互作为公版的理由**（同上文，已确认）：上汽设计强行加画布导致语音展示容器割裂；赛力斯对主动服务/多屏交互覆盖更完整。
4. **E68 定版里 HAI 叫"交付表达引擎"**（TTS、任务卡片、感知可视化、豆包机器人，多屏/HUD/灯光多维反馈）。

## 7. N1–N17 / 映射章缺口速查

- N1（总览）：补"E68 四引擎 vs 产品 one page 六引擎 vs 长期蓝图五段（Perception/Attention/Thinking/Memory/Action+Express）三套口径并存，各自出处与阶段"。
- N3（介入判断与任务意图）：补 §3.1（event 第四类输入）、§3.7（打断恢复 5 规则链到 05 D10）；补"语音侧四事件 Reject/Interrupt/Response/Listen"。
- N4（工具执行三类）：补 §3.6（32 工具标准化清单与 1115 条协议的层级关系、供应商口径冲突待核）；长期架构明确"GUI 操作是高难度长程任务，建议做成可调用 Agent 而非主 bot 工具，占 SP 大、不好打断"——与 N4 的 GUI agent 定位一致，可引用。
- N5：见 §3.1–§3.12 全部。
- N6（Context 加工）：补 §1.1（9 类原料总表）、§1.3（短时/长时记忆分层+Agent 独立记忆）；动态事件枢纽（§4.4）是 N6 与 Advisor 的交界线。
- Advisor 章：补 §4.5 整车频控、§4.7 AI bar 双链路。
- Reflector 章：补 §5.2 内心向四子 Agent 蓝图。

## 8. 用户点名文档命中情况

- 10/24 Director PRD：未命中（最新 v1.7=10/12）。
- 静态 Advisor PRD v0.6：命中且已到 v0.7。
- AI car 主动服务 onepage：命中（=组内 01）。
- 豆包座舱助手产品说明（JceadMlTuoWG2qx7EqxcqBOFnNf）/ AI汽车核心产品功能概述（B1ZYw6prNiC2tDkqJgBcXnmAnzf）：在 06 中以 cite 出现，不在 17 篇清单内，未深读（标记给主代理）。
- 豆包上车方案说明（BAgQdR9liouBVmxKj1hcJrXLnlf）：同上。
- E68 核心方案评审决策：补读命中（§0、§6）。
- AIVA 需求管理：权限不足跳过。
- "AI 汽车文档汇总/索引"递归链接：已列（见 TASK 记录），重复项=AI汽车产品one page、产品知识库、静态Advisor PRD、FeatureList×2、任务Planner PRD（search 组已读）；新指向=输入管理模块设计 UsHgwkm2Sig3blkAttBclYb0n4g、AI介入判断PRD MHa1wgc9piBcVgkmqnHchCNAnLc、Context OnePage OjGMwBX8fiLS0ikDWqVceVjhnPg、记忆OnePage KAAMwb7vsiHpd0k7PVPctGfKnHf、触发器OnePage Xk6xwM3l8iK4oCkXIMlcIo4hnFc、AIDV Planner OnePage EWziwFVftiGvnlk0FA4cadqonud、【内部】AI汽车技术架构 SupzdFrzjoXqhpxiYevcGsO0nXb、AI汽车产品架构 LLuKd30sfoTyMvxnriVcbKJBnMf。
