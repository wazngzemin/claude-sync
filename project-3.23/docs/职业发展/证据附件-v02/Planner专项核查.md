# Planner / Director 原始工作证据审计

交付：2026-09-23。范围：本地 `/Users/bytedance/Desktop/3.23` 及主代理提供的 3 份 `/tmp` 证据；没有访问飞书，没有修改原文件。用户要求收束后停止新增取证。下文“用户”指材料中的王泽民；没有署名、发言或当前用户标志支持时，不把团队工作归到个人。

## 先给判断

原件支持的优势是：用户参与真实车载问题排查，能提供现象和日志、讨论工具及状态边界、编写针对性动态示例，并主持示例平台的需求取舍。有部分原表记录的实车复测通过结果，也有明确失败和空白结果。证据不足以把这些工作概括成“已经全面优化 Planner”“完成模型训练或上下文架构改造”“建立并验收整套机器人闭环”。

向具身智能迁移，较可信的是高层任务规划、状态与执行反馈的产品定义、失败归因、测试设计和数据运营能力。这里的高层规划是“根据任务、当前状态和工具结果决定下一步”，不是机械臂轨迹或电机控制。迁移判断是基于工作内容的推论，不是已有机器人项目经历的证明。

## 取证范围、阅读数量与引用规则

遍历清单记录 **550 个候选文件路径**，其中 **486 个文本文件完成提取**；另对 **16 个 Excel 文件做只读单元格提取**。这些是覆盖范围，不能写成“深读 550 份”。本报告列出的实际全文阅读或重点核读来源为 **32 个文件：29 个本地文件 + 3 个补充证据文件**。同一资料的 Markdown / HTML / Excel 导出副本不等于独立项目成果。

本次清单与哈希见 [候选文件清单](/tmp/planner-audit-0923-evidence/manifest.json)。文本引用采用原文件一基行号；HTML 导出常把一个长章节放在同一物理行，因此同时给章节名。Excel 没有文本行号，使用真实工作表名和单元格坐标。提取文件的行号不冒充原件行号。主代理最后补充的 revision 327 原表复核属于明确标注的外部核验回传，本审计没有再次访问该表。

### A. 全文阅读：11 个本地文件

| 文件 | 阅读内容与证据等级 |
|---|---|
| [Planner 2.6整体目标 和 s7迭代目标-1776676468.md](</Users/bytedance/Desktop/3.23/raw/articles/Planner 2.6整体目标 和 s7迭代目标-1776676468.md>) | 整体与 S7 目标；目标值不是验收结果。 |
| [公共Context管理-豆包 【AI car 1.0】-1776676465.md](</Users/bytedance/Desktop/3.23/raw/articles/公共Context管理-豆包 【AI car 1.0】-1776676465.md>) | 公共上下文输入、状态、任务与压缩设计；无压缩收益实测。 |
| [对话推理引擎(Director) PRD.html](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/对话推理引擎(Director) PRD.html>) | Director 正式 PRD；逐段区分设计与明确“已上线”章节。 |
| [Sp 优化专项.html](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/Sp 优化专项.html>) | SP 优化专项及结果表；有团队实验汇总，无个人归属证明。 |
| [【AI汽车-PRD】离线LLM指令解析.html](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/车控/【AI汽车-PRD】离线LLM指令解析.html>) | 离线 LLM 指令解析 PRD；模型路径、缓存路径和目标要求。 |
| [Director评测重点与打分指南 (1).html](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/Director评测重点与打分指南 (1).html>) | Director 评测重点及 0–4 分标准；标准不是通过率。 |
| [工具返回结果优化.html](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/planner 指标/工具返回结果优化.html>) | 工具返回结果优化；成功、失败、能力边界与替代动作。 |
| [【Director 训练&评测】会议.md](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/【Director 训练&评测】会议.md>) | 6 月 11 日训练评测会议逐字内容；主要发言为其他同事。 |
| [【Director】PE动态示例对齐 2026年6月2日.md](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/【Director】PE动态示例对齐 2026年6月2日.md>) | 6 月 2 日动态示例对齐逐字稿；含王泽民明确发言。 |
| [对话推理引擎Director knowhow.html](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/对话推理引擎Director knowhow.html>) | knowhow 原始导出；涉及特定车辆能力，不混同其他车型。 |
| [planner-问题点.md](</Users/bytedance/Desktop/3.23/raw/articles/planner-问题点.md>) | Planner 问题原始条目及 logID；没有个人作者及修复闭环证明。 |

### B. 重点章节、原始行或单元格核读：11 个本地文件

以下不是全文件逐字阅读。Excel 做了全量单元格提取，但人工式内容判断只覆盖下述相关区域。

| 文件 | 实际阅读范围 |
|---|---|
| [planner bugg晚上 3 点.md](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/planner bugg晚上 3 点.md>) | 窗口开度、风量及历史状态污染的逐字发言，含原件 L433–530、L679–728、L1301–1323、L1440–1451。 |
| [【Director】动态示例(for badcases修复）.xlsx](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/【Director】动态示例(for badcases修复）.xlsx>) | 动态示例汇总表全量计数，按提出人/复测字段统计，并核读王泽民相关行，重点 A422:I510。 |
| [Director评估维度和准出指标.xlsx](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/planner 指标/Director评估维度和准出指标.xlsx>) | v0.2!A1:L19 全表指标、当前值与准出口径。 |
| [Director种子数据.xlsx](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/planner 指标/Director种子数据.xlsx>) | Change Log!A2:C10 及测试表结构、行数；不声称通读所有测试项。 |
| [Director高优事项评测集.xlsx](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/planner 指标/Director高优事项评测集.xlsx>) | 工具反馈评测表及安全、能力、上下文等表结构和相关案例；不是全部 5 表逐项评审。 |
| [评测集-14个维度.xlsx](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/planner 指标/评测集-14个维度.xlsx>) | 16 个工作表结构、行数及选定上下文样本；不将汇总表行数当示例库存。 |
| [能力边界评测结果_带判断0623.xlsx](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/能力边界评测结果_带判断0623.xlsx>) | 28 个样本的判断列计数及部分输入/输出；“带判断”标注来源未充分确认。 |
| [动态示例解bug指南.html](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/动态示例解bug指南.html>) | 动态示例使用边界、归因规则及沿途搜工具提示章节。 |
| [sp.md](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/sp.md>) | 单行 JSON 中 poi_search / route_planning 相关工具提示，非通读全 SP。 |
| [座舱Planner探索.html](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/座舱Planner探索.html>) | 状态及上下文压缩相关章节，非全文。 |
| [Planner SP 讨论.html](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/Planner SP 讨论.html>) | SP 讨论中的相关目标与规则段落，非完整提示词复核。 |

### C. 数字追溯与排除：7 个本地文件

| 文件 | 用途 |
|---|---|
| [jira_bug_list_2026-07-14.csv](</Users/bytedance/Desktop/3.23/planner bug/jira_bug_list_2026-07-14.csv>) | 原始导出 CSV 全量记录计数、唯一 Key 与差集核对；140 条。 |
| [jira_bug_list_2026-07-14.md](</Users/bytedance/Desktop/3.23/planner bug/jira_bug_list_2026-07-14.md>) | 导出日期、JQL、状态及总数核对；不是 140 条已解决。 |
| [jira_bug_triage_2026-07-14.csv](</Users/bytedance/Desktop/3.23/planner bug/jira_bug_triage_2026-07-14.csv>) | 分诊 CSV 全量计数、分类统计与原始导出差集；分类判断不自动视为人工确认。 |
| [jira_bug_triage_2026-07-14.md](</Users/bytedance/Desktop/3.23/planner bug/jira_bug_triage_2026-07-14.md>) | 只核读范围与 138 条声明，属于后续分诊产物。 |
| [流程图_Planner-Director_Bug全景_20260612.html](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/流程图_Planner-Director_Bug全景_20260612.html>) | 只追溯“35%”及图表自述的示意性质，不采纳为事实。 |
| [系统大图_Planner-Director_深度版_20260612.html](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/系统大图_Planner-Director_深度版_20260612.html>) | 只追溯“35%”重复说法，不作为独立佐证。 |
| [planner-jiangjie.md](</Users/bytedance/Desktop/3.23/wiki/concepts/planner-jiangjie.md:1128>) | L1128–1166 的 40–70% / 19% 估算来源；Wiki 为生成解释材料，排除为实绩证据。 |

### D. 补充证据：3 个文件

| 文件 | 阅读范围及使用方式 |
|---|---|
| [embodied-chat-eval.json](</Users/bytedance/Desktop/3.23/docs/职业发展/证据附件-v02/飞书读取快照/embodied-chat-eval.json>) | 39 条消息正文及内嵌评测表相关内容；主代理又直接核验了原表 revision 327 的 S01–S20。 |
| [embodied-chat-status.json](</Users/bytedance/Desktop/3.23/docs/职业发展/证据附件-v02/飞书读取快照/embodied-chat-status.json>) | 50 条消息正文及发送方标志；全部 sent_by_current_user=false，禁止归为用户本人定位。 |
| [embodied-meeting-examples.md](</Users/bytedance/Desktop/3.23/docs/职业发展/证据附件-v02/飞书读取快照/embodied-meeting-examples.md>) | 8 月 12 日会议完整逐字稿，1769 行；读取了后半程对前半程方案的修正。 |

简历不承担事实证明作用。检索定位时遇到的简历数字、AI 会议摘要、Wiki 讲解及生成全景图，仅用于追踪待核实说法；不计为原始工作完成证据。记忆只用于定位旧线索。

## 8 个可用于职业评估的具体案例

### 1. 算路页沿途搜索：确有用户修补动作，但专项走查仍大量失败

**问题。** 用户还在看算路结果，提出“沿途找充电站”等需求，系统先强行发起导航，再执行沿途搜索。该轮预期是基于算路结果搜索并在 AI 地图展示，不先启导航。

**用户行动。** 当前用户消息明确写“配置了 2 条，有时间测一下”；后续讨论 query 匹配、上汽环境和未覆盖表达是否要枚举。可以归为用户配置并推动测试。不能把聊天中其他人写出的整段“优先使用已有路线”的最终规则归为用户独立提出。证据：[embodied-chat-eval.json](</Users/bytedance/Desktop/3.23/docs/职业发展/证据附件-v02/飞书读取快照/embodied-chat-eval.json:4275>) 的消息对象，以及同文件 L4300、L4433、L4623；L4756 起的规则消息由其他人发送。

**决策。** 先区分已有算路结果、正在导航、两者都没有的状态，再选择搜索或必要的补充询问。既有 SP 快照的 poi_search 提示仍包含“需要先处于导航，未导航先发起导航”的逻辑，提示需求与旧规则可能冲突；但快照时间和实际线上版本未确认，不能据此定论本次线上根因。旧规则位置：[sp.md](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/sp.md:1>)，poi_search 工具 tips；另见 [动态示例解bug指南.html](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/动态示例解bug指南.html:179>) 对应工具章节。

**证据结果。** 主代理直接读取[原表“算路态发起沿途搜”](https://pq3b44yw2t9.feishu.cn/sheets/CCEcsvp9ihyd1HtOnZ3cwJ5RnLw?sheet=D5v6bL)，revision 327：**S01–S20 共 20 行，9 pass、11 fail，45%**；11 个失败均是先发起导航再沿途搜。这是特定专项、特定版本上下文未充分标注的走查结果，不能当总体 Planner 成功率，也不能当 2 条示例的因果收益。尚无改动版本或正式回归证明。

**阶段。** 已配置、已推动测试；专项存在失败；未形成修复验收闭环。

### 2. 音乐平台名丢失：有原表复测通过，也有同类残留失败

**问题。** 用户指定 QQ 音乐、网易云或酷我听歌时，系统可能把“打开 App”和“找歌”拆开，后续找歌丢失平台约束。

**用户行动。** 原始动态示例表的提出人字段记为王泽民，加入把平台名称保留在 music_search 决策内的示例，而不是先调用打开 App。证据：[【Director】动态示例(for badcases修复）.xlsx](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/【Director】动态示例(for badcases修复）.xlsx>)，`动态示例汇总表(SFT）!A440:H444`、`A446:H448`。

**决策。** 让承担音乐检索的工具在同一次请求内携带平台约束，避免由工具拆分造成用户约束丢失。

**证据结果。** 440–442、446–448 行共 **6 条**标注 `0723实车复测pass`；同类 443–444 行千千静听、咪咕是 **2 条 fail**。这是表内记录的部分复测结果；未重放实车日志，不能写“指定平台播放全面修复”或归因于某个模型升级。

**阶段。** 针对性数据修补 + 部分复测通过，仍有同类失败。

### 3. 车辆能力边界：把“没硬件”“不支持语音”“手动操作”分开

**问题。** 助手可能对不存在的配置承诺执行，或把不能语音操作的设备说成完全不具备该功能。

**用户行动。** 王泽民作为提出人，编写越野模式、香氛、雨刮、前遮阳帘、AutoHold、方向盘调节等具体边界示例。证据：[【Director】动态示例(for badcases修复）.xlsx](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/【Director】动态示例(for badcases修复）.xlsx>)，`动态示例汇总表(SFT）!A426:H431`。

**决策。** 根据特定车辆的能力，分别拒绝不存在的硬件/模式、说明手动入口、保留适用音区约束；不是统一输出“不支持”。正式反馈设计也要求区分硬件不存在、无语音控制、无权限等原因，见 [工具返回结果优化.html](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/planner 指标/工具返回结果优化.html:189>) 的失败反馈章节。

**证据结果。** 426–431 行均标注 7 月 23 日实车复测 pass。但 423–424 行涉及儿童锁情况下车窗操作、看不见后备厢等边界仍标注 fail。不能把几个能力提示通过扩写成车辆安全约束已验收。其他车型/早期文档对雨刮等能力可能不同，不能混用。

**阶段。** 特定车型、特定表达的部分验收；整体安全边界未证明完成。

### 4. 一次取消两个途经点：识别动作之间要等反馈，但缺少实测闭环

**问题。** 用户说“我不去星巴克也不去肯德基了”，两个删除动作若一起发出，可能遇到路线状态更新依赖。

**用户行动。** 原表 464 行提出人为王泽民，示例明确先调用 route_planning 删除一个途经点，等待成功反馈后再删下一个，最后统一回复。证据：[【Director】动态示例(for badcases修复）.xlsx](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/【Director】动态示例(for badcases修复）.xlsx>)，`动态示例汇总表(SFT）!A464:H464`。

**决策。** 串行处理存在状态依赖的动作，后一步以实际工具反馈作为条件。这里展示了用户理解“说出计划”“请求执行”“执行完成”是不同阶段。

**证据结果。** 该行复测结果为空。原始其他 badcase 也记录“界面开始任务就声称完成”“删除任务未实际取消订单”，支持这个问题真实存在，但没有个人修复证据，见 [planner-问题点.md](</Users/bytedance/Desktop/3.23/raw/articles/planner-问题点.md:30>)。

**阶段。** 有明确示例方案/数据产物；无该条实车复测或全链路验收证据。不能写成已完成稳定的多步规划能力。

### 5. “车窗调高 10%”：用户贡献现象与日志，根因是联合澄清

**问题。** 车窗“开度百分比”与口语“玻璃升高”方向相反。开度已是 100% 时，“调高 10%”不能机械理解为开度再加 10%。

**用户行动。** 王泽民在逐字稿里归集问题、发送日志并指出系统作了加 10 的处理；左晨进一步明确应按减开度理解；其他同事讨论规则修改。证据：[planner bugg晚上 3 点.md](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/planner bugg晚上 3 点.md:433>)、[planner bugg晚上 3 点.md](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/planner bugg晚上 3 点.md:487>)、[planner bugg晚上 3 点.md](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/planner bugg晚上 3 点.md:506>)、[planner bugg晚上 3 点.md](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/planner bugg晚上 3 点.md:515>)，完整相关段 L433–530。

**决策。** 工具字段的数字含义必须与用户语义对齐，必要时把相反的方向表达显式编码成规则。

**证据结果。** 会上出现次日修改计划，未在已读材料里找到对应版本和复测关闭记录。可以证明用户参与定位和推动，不足以证明其独立发现根因或完成修复。

**阶段。** 联合排查与修复安排；没有验收闭环。

### 6. 风量依据旧对话而非当前车况：用户提交证据，架构收益不能归个人

**问题。** 系统回复的风量与实际值不一致，一类原因是读错状态表达，另一类是历史对话中的旧值干扰最新车况。

**用户行动。** 王泽民报告“说 9 档实际 8 档”等现象，并在另一段说明已把 log 发群里；其他同事分析状态矩阵、历史 7 档与实际 2 档的冲突。证据：[planner bugg晚上 3 点.md](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/planner bugg晚上 3 点.md:679>)（L679–728）、[planner bugg晚上 3 点.md](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/planner bugg晚上 3 点.md:1301>)（L1301–1323，用户发日志见 L1310）。

**决策。** 判断当前动作时，应使用可信、最新的车辆状态，并明确历史值只是当时记录。会上还提出更容易理解的状态表达和分类收集，但这些建议不能都归为用户提出。

**证据结果。** 公共 Context 原件有状态、历史、短期记忆及压缩/过滤设计，见 [公共Context管理-豆包 【AI car 1.0】-1776676465.md](</Users/bytedance/Desktop/3.23/raw/articles/公共Context管理-豆包 【AI car 1.0】-1776676465.md:38>)、[公共Context管理-豆包 【AI car 1.0】-1776676465.md](</Users/bytedance/Desktop/3.23/raw/articles/公共Context管理-豆包 【AI car 1.0】-1776676465.md:71>)、[公共Context管理-豆包 【AI car 1.0】-1776676465.md](</Users/bytedance/Desktop/3.23/raw/articles/公共Context管理-豆包 【AI car 1.0】-1776676465.md:256>)、[公共Context管理-豆包 【AI car 1.0】-1776676465.md](</Users/bytedance/Desktop/3.23/raw/articles/公共Context管理-豆包 【AI car 1.0】-1776676465.md:270>)；未找到用户已实现“远区精简、近区完整”或实际节省 40–70% 的验证记录。

**阶段。** 现象与日志贡献成立，归因协作成立；上下文架构落地和收益未获证明。

### 7. 动态示例重复治理：最终改成相似提示，不能沿用会议前半程的硬拦截

**问题。** 示例增多后，相同或近似 query 可能重复；但同一 query 在不同车企下也可能需要不同决策，直接按相似度禁新增会误伤合理数据。

**用户行动。** 8 月 12 日逐字稿显示王泽民主持需求讨论，提出查重、修改/覆盖等流程，并在同事补充多车企场景后接受调整。证据：[embodied-meeting-examples.md](</Users/bytedance/Desktop/3.23/docs/职业发展/证据附件-v02/飞书读取快照/embodied-meeting-examples.md:1>)，重点会议时间约 00:00–11:00，以及 **46:00–50:00** 后半程修订；王泽民约 49:28、49:36 的回应。

**决策。** 前半程出现相似度阈值、Top N、拦截新增及编辑原示例等设想；后半程改为**相似内容提示，由使用者判断**，不再把相似即禁止新增作为最终结论。显示 3 条还是 5 条等细节仍需补齐。

**证据结果。** 有完整的需求讨论和取舍，没有上线后重复率下降、误拦截率或操作成功率。不能用“讨论过”替代“平台已支持”。

**阶段。** 需求方案经评审收敛，未见验收。

### 8. 批量操作、审核和环境：能根据现状调整范围，但隔离能力没有被证明交付

**问题。** 大量示例逐条录入成本高，同时需要控制谁能修改、如何审核、如何区分车企与环境；Excel 导入如果直接生效，会放大误操作。

**用户行动。** 同一场 8 月 12 日会议中，王泽民讨论批量导入导出、审核白名单、车企标签及环境选择；接受先做导入检查报告，再由使用者确认执行，并在得知共用平台的当前机制后调整优先级。证据：[embodied-meeting-examples.md](</Users/bytedance/Desktop/3.23/docs/职业发展/证据附件-v02/飞书读取快照/embodied-meeting-examples.md:1>)，会议约 **13:00–21:00** 审核；**22:00–30:00** 车企/环境；**31:00–40:00** 批量操作；**41:00–45:00** 范围调整。

**决策。** 采用可检查的批量变更流程；区分全量管理与本人数据权限；公司可多标签、环境单选。不能把同事提出后由用户接受的改法描述成用户独立设计。ID、空 query、删除与错误行之间的含义在讨论中仍有歧义，不应宣称全套导入规范已经严密闭合。

**证据结果。** 徐冉说明当时 PROD 配置会下发各环境，这是**当时现状**，不是严格隔离已实现。后续研发排期、提单和界面需求仍是推进事项，没有上线截图、实际导入回读或权限验收记录。

**阶段。** 产品需求与交付范围推进；没有平台完整交付证明。

## 数字逐项核实

| 数字 | 核查结果 | 可用表述与限制 |
|---|---|---|
| **138 条** | 7 月 14 日分诊 CSV 有 138 个唯一单号。此前原始导出有 140 个唯一单号；差集为 **DNA-2086、DNA-2135**。 | “对 138 条分诊记录进行整理/分析”需要再证明个人行动；仅凭文件能确认记录数，不能写“修复/关闭 138 条”。 |
| **35%** | 138 条表内 A102、B3、C9、D4、E3、F17；D+F 为 21/138=**15.22%**，所有非 A/B 为 33/138=**23.91%**，都不是 35%。35% 出现在生成全景图，其自注承认示意量级，不能当精确统计。 | 没有可追溯分母、逐条归因和原始统计，不能说“用户发现 35% 非 Planner 问题”。不排除别的未提供样本曾有此比例，但本次未获证明。 |
| **40–70%** | Wiki 章节明确是“优化效果估算”，以假设轮数和每轮 token 估算历史区压缩；正式 Context 原件没有对应实验结果。 | 若保留，只能写“方案估算历史对话 token 可减少”，不能改为总 input、响应时延或实测收益，也不能归为用户已实现。 |
| **19%** | 源头为假设 input 减少约 10%，再做 `1−0.9²=19%` 的平方项计算。 | 数学计算在假设内成立；不能据此说整次推理计算量或端到端时延下降 19%。缓存、生成阶段及其他开销均未实测。 |
| **1200 / 1200+** | 已读原始动态示例表主表有 **520 条数据行、518 个非空 Query**，不是 1200。未找到可核验的 1200+ 示例库存快照。另一个明确出现的 1200 是 S7 **首 token P90≤1200ms 的目标**。 | 示例规模与毫秒指标不可混淆；本地表不是所有环境的全量库存，不能据此断言线上从未达到 1200；只能说该成果未被原件支持。 |
| **45%** | 9 月算路态沿途搜原表 revision 327，20 条，9 pass、11 fail；11 个失败均先导航后搜索。 | 限定为该专项走查；不代表整体 Planner，不证明示例修复后的提升，无正式回归。 |

138 条的范围证据：[jira_bug_list_2026-07-14.md](</Users/bytedance/Desktop/3.23/planner bug/jira_bug_list_2026-07-14.md:3>)、[jira_bug_list_2026-07-14.md](</Users/bytedance/Desktop/3.23/planner bug/jira_bug_list_2026-07-14.md:7>)、[jira_bug_triage_2026-07-14.md](</Users/bytedance/Desktop/3.23/planner bug/jira_bug_triage_2026-07-14.md:1>)；计数与差集以 [jira_bug_list_2026-07-14.csv](</Users/bytedance/Desktop/3.23/planner bug/jira_bug_list_2026-07-14.csv>) 和 [jira_bug_triage_2026-07-14.csv](</Users/bytedance/Desktop/3.23/planner bug/jira_bug_triage_2026-07-14.csv>) 的 CSV 解析为准。35% 的生成来源及自述见 [流程图_Planner-Director_Bug全景_20260612.html](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/流程图_Planner-Director_Bug全景_20260612.html:313>)、[流程图_Planner-Director_Bug全景_20260612.html](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/流程图_Planner-Director_Bug全景_20260612.html:373>)，重复说法见 [系统大图_Planner-Director_深度版_20260612.html](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/系统大图_Planner-Director_深度版_20260612.html:790>)。40–70% / 19% 见 [planner-jiangjie.md](</Users/bytedance/Desktop/3.23/wiki/concepts/planner-jiangjie.md:1128>)（L1128–1166），不是原始测量。1200ms 目标见 [Planner 2.6整体目标 和 s7迭代目标-1776676468.md](</Users/bytedance/Desktop/3.23/raw/articles/Planner 2.6整体目标 和 s7迭代目标-1776676468.md:119>)（L119–131）。

### 另外几个容易被包装成个人实绩的数字

- **王泽民提出的示例 59 行**：在 [【Director】动态示例(for badcases修复）.xlsx](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/【Director】动态示例(for badcases修复）.xlsx>) 主表按 C 列提出人统计。H 列中 **30 pass、7 fail、22 空白**。只能说“原表记录 37 条有复测标记，其中 30 通过、7 失败”，不能称整体通过率或提升率；表内结果不是本次独立实车复验。全部 520 条数据行中，H 列为 30 pass、8 fail、482 空白。
- **SP 优化表有真实结果汇总，但未证明是用户个人完成**：[Sp 优化专项.html](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/Sp 优化专项.html:348>)（L348–351）记录 Baseline ACC **79.38%（154/194）**，PE3-0415 **88.38%（175/198）**；首响 P50 **2309→998ms**，P90 **3438.6→1316.8ms**；全程 P50 **12231→6179ms**，P90 **24403.6→15108ms**。准确率分母不同，延迟表有效量另为各 **197/201**，不能直接说同一固定样本实现纯因果提升；未读取链接后的逐条实验记录。可以证明团队材料包含测评工作，不证明个人主导。
- **评测阈值不是当前表现**：[Director评估维度和准出指标.xlsx](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/planner 指标/Director评估维度和准出指标.xlsx>) `v0.2!F2:F8` 的 95%、92%、90% 等是要求，当前值大多空白。`E6` 还把“因下游原因失败而结束话题”计入闭环，故这里的对话闭环不能等同物理任务成功。[Director种子数据.xlsx](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/planner 指标/Director种子数据.xlsx>) `Change Log!A2:C10` 的维护署名是郝晓伟，不应移植为用户搭建整套评测体系。
- **“带判断”表 13/28**：[能力边界评测结果_带判断0623.xlsx](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/能力边界评测结果_带判断0623.xlsx>) 判断列 O2:O29 为 13 是、15 否，但判断标签的来源未充分确认，API 状态 success 也不等于答案正确。本报告不将其作为用户验收成果。

## 评测与离线模型：有资料接触，个人实施证据有限

正式 Director 指南按话术/动作一致、漏动作、多动作、错动作、车内状态和安全等评测，而不是只看模型是否输出了 JSON。来源：[Director评测重点与打分指南 (1).html](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/Director评测重点与打分指南 (1).html:179>)、[Director评测重点与打分指南 (1).html](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/Director评测重点与打分指南 (1).html:210>)、[Director评测重点与打分指南 (1).html](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/Director评测重点与打分指南 (1).html:238>)。工具反馈规范还要求表达动作、对象和执行结果，而非一个空泛 success，见 [工具返回结果优化.html](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/planner 指标/工具返回结果优化.html:179>)。这些可以作为理解用户工作所在系统复杂性的背景，但不能由“资料在文件夹里”推导其作者、owner 或交付人。

6 月 11 日训练评测会议有完成度、效率、体验、安全等讨论，但关键发言及标准制定承诺来自其他同事，见 [【Director 训练&评测】会议.md](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/【Director 训练&评测】会议.md:21>)、[【Director 训练&评测】会议.md](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/【Director 训练&评测】会议.md:149>)。6 月 2 日会议中，王泽民被安排支持 CQC、提出核实下游能力与构造 query 的问题，见 [【Director】PE动态示例对齐 2026年6月2日.md](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/【Director】PE动态示例对齐 2026年6月2日.md:413>)、[【Director】PE动态示例对齐 2026年6月2日.md](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/【Director】PE动态示例对齐 2026年6月2日.md:710>)、[【Director】PE动态示例对齐 2026年6月2日.md](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/【Director】PE动态示例对齐 2026年6月2日.md:731>)；这证明协作参与，不等于亲自训练 reward model 或建立全部数据管线。对构造 query 的来源，会上还存在不同说法，不能单方面定论其全部来自测试或 CQC。

离线 LLM PRD 区分：弱网/无网等条件下走离线指令解析；不支持的复杂联网任务走拒识/其他；另有对单轮、唯一映射、无上下文依赖指令的缓存路径。“暂停/继续”“就选它”等不能当纯静态缓存。[【AI汽车-PRD】离线LLM指令解析.html](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/车控/【AI汽车-PRD】离线LLM指令解析.html:179>) 的响应≤200ms、日常意图准确率≥95%，以及 [【AI汽车-PRD】离线LLM指令解析.html](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/车控/【AI汽车-PRD】离线LLM指令解析.html:202>) 的缓存 50ms、命中正确性 100%，都是**要求或目标**。未看到用户完成权重压缩、量化部署、芯片适配、实车端测或这些阈值的验收证据。不能以此声称用户有端侧模型工程交付经历。

Director PRD 有少数明确“当前方案，已上线”的段落，例如推理打断合并 [对话推理引擎(Director) PRD.html](</Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/对话推理引擎(Director) PRD.html:547>)；这只能限定到该段功能，不能反推全文 Goal List、Advisor、长期任务设计全部上线，更不能归为用户个人成果。

## 当前车况路由证据的归属纠偏

[embodied-chat-status.json](</Users/bytedance/Desktop/3.23/docs/职业发展/证据附件-v02/飞书读取快照/embodied-chat-status.json>) 中早先判断倾向“Director 路由正确，是 car_care_qa 的问题”，后续出现“SP 已有 vehicle_status_search，查询当前车况却仍走 car_care_qa”的修正。对照同文件 L646、L665 附近早期消息与 L101 附近后续消息，这是一次**归因变化**，不是单一已证实的修复结论。

该文件 50 条消息的 `sent_by_current_user` 全部为 false。因此可以说“用户工作相关讨论显示归因曾被修正”，不能说“用户本人定位并纠正了路由”。L63 附近提及要求王泽民反馈修复计划，也只能证明被要求跟进，不证明完成修复。

## 迁移到具身智能：优势、边界与可补的证明

| 由原件支持的能力 | 可迁移的具体工作（推论） | 当前材料没有证明的部分 |
|---|---|---|
| 能从错误工具选择、对象约束、状态冲突拆问题 | 机器人任务层的需求拆解、技能调用边界、执行反馈约定 | 机器人运动规划、动力学、连续控制、抓取策略 |
| 知道多步动作要等前一步反馈，注意口头完成与实际完成的区别 | 任务执行状态机、失败中断、重试与回查的产品验收 | 真实机器人上的感知—动作—状态闭环、动作成功检测及长时任务可靠性 |
| 有本人署名的动态示例及部分实车复测记录 | 失败案例运营、数据版本、任务/场景覆盖和回归管理 | 具身数据采集、遥操作、轨迹质量、VLA 训练与评估 |
| 能参与硬件能力、音区、车型差异的边界定义 | 把硬件约束纳入产品范围，设计可执行的拒绝与替代方案 | 机器人传感器误差、碰撞风险、接触失败、急停恢复等验证 |
| 主持数据平台需求，能根据多人反馈改变方案与优先级 | 机器人数据/评测平台产品、跨算法与执行团队协作 | 平台整体上线、规模化使用效率、权限和环境隔离验收 |

因此，最稳妥的职业表述是：**“我做过车载 Agent 的任务与工具决策产品工作，参与状态/执行问题定位，维护过有本人署名和部分复测结果的动态示例，并推动过示例管理平台需求评审。”** 可以继续给出音乐平台名、窗口方向、旧风量干扰等具体案例，再说希望把这些能力迁移到机器人高层任务与评测产品。不要直接说已经有完整具身智能经验。

主代理后续综合时，最关键的待补证据是每个案例的版本、owner、回归结果和关闭记录；如果要证明机器人方向能力，需要额外的真实机器人任务、感知/动作反馈、失败恢复及验收材料。此处列的是证据缺口，不是本轮继续检索计划。

## 可直接带入主报告的结论边界

**已经确认：** 用户参与问题复现、日志供给、示例编写和需求评审；部分示例在原表被记为实车复测通过；沿途搜专项仍为 9/20 通过。

**属于推进或方案：** 串行删除途经点示例、车窗方向修正规则、上下文优先级调整讨论、动态示例平台查重/审核/批量操作等。方案提出、接受和排期均不等于交付。

**未获证明：** 用户修复了 138 条；35% 的精确归因比例；个人实现 40–70% / 19% 实测收益；1200+ 库存；整体 Planner 通过率 45%；完整评测体系、离线模型工程或机器人执行闭环由用户主导完成。
