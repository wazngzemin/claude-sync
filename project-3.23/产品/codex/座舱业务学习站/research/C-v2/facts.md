# C 章事实库

研究日期：2026-11-16。本阶段只研究：不写章节正文、不改网页、不启动浏览器。

475 条带来源的取证登记按用户要求的 9 个主题及车型差异、指标与观测、排期与现状分组；这是逐来源记录数，跨来源同一事实可能重复，便于比较版本。每条保留原编号，设计、讨论、测试、周报状态和二手线索均明确标注。

来源路径以 `座舱业务学习站/research/` 为基准；`chapters/C/raw/` 为指定原文副本。原文行号是物理行；上汽 `sp.md` 是单行 JSON，单独标注为 JSON.content 解码逻辑行。编辑日期仅说明文档更新时间，不自动证明各段内容的方案形成时间或上线时间。

40 份 raw 文本已全部处理；29 份有正文，5 份标题占位，6 份错误响应。附表集中列本轮输入块的来源/长度/更新节奏、28 项冲突和待补证。阅读明细见 [read-ledger.md](read-ledger.md)，案例、SOP、旧页、跨章边界另见同目录文件。

## 一、Planner 每次模型调用的输入结构（44 条）

- **F001｜输入结构｜2026-09-10 OnePage**：Context源包括情景描述、事件日志、短期历史压缩、短期情景、长期情景、长期语义、画像、端状态、联网基本信息，数据形态含结构化文本与多模态。（来源：`chapters/C/raw/context-onepage.txt:13-75`）
- **B016｜输入结构｜工具提示**：时间相关推理应使用当前输入的 timestamp，其他时间日期需查 web_search，避免模型凭旧知识猜日期。（来源：`chapters/C/raw/dyn-example-bug.txt:13-16`）
- **B018｜输入结构｜工具提示**：持续目标创建或删除要参考现有 goal_list，已有或相似目标不重复创建，原有目标的补充也不另建。（来源：`chapters/C/raw/dyn-example-bug.txt:143-148`）
- **F014｜输入结构｜2026-04-21方案**：最新query旁增加goal_list目标及进展和env_info最新端状态，舱内外视觉与用户记忆仍放SP。（来源：`chapters/C/raw/dt-context-adjust.txt:5-21`）
- **F017｜输入结构｜方案**：query增加当前时间戳及同一说话人距上次query间隔，未注册按座位统计、已注册按身份统计。（来源：`chapters/C/raw/dt-context-adjust.txt:33-39`）
- **F018｜输入结构｜UP示例非统一线上事实**：仅query、仅advise及二者合并三种UP示例都把目标队列、车辆状态、动态专业知识knowledge置于背景信息；query含speaker_name、speaker_position、time_stamp、last_query_time。（来源：`chapters/C/raw/dt-context-adjust.txt:42-79`）
- **F020｜输入结构｜历史设计**：1.0列出情景、对话、事件、最新端状态、5分钟屏幕截图、在场人物长期记忆、任务状态、联网信息，并预留探索、任务经验、工具知识、专有知识和性格设定。（来源：`chapters/C/raw/public-context-prd.txt:12-255`）
- **B033｜输入结构｜9/3 讨论未确认**：舱内外来源标记的接入位置尚未明确，会上先说可区分，后澄清 Director 当时应该没有标记，端上是否已报及云端归谁管理未确认。（来源：`chapters/C/raw/meeting-0903-dyn.txt:244-290；00:15:52–00:16:46`）
- **F035｜输入结构｜实现说明**：Planner先等Context的MsgKeyContextResult提示词变量，再把多音区query、advisor/event、last_talk_content、说话人、音区、时间戳包装成JSON数组。（来源：`chapters/C/raw/planner-onepage.txt:110-114`）
- **F036｜输入结构｜实现说明**：在线工具来自agent_registry，经BuildToolPrompt把中文名、tool_name、描述、参数、notice、tips注入tool_list，工具集并非由永久固定23个数量定义。（来源：`chapters/C/raw/planner-onepage.txt:116-120,187-191`）
- **F038｜输入结构｜历史模型表与项目说明冲突**：本OnePage模型表列基模2.1-turbo和SFT/RL的2.0-lite，并区分上汽PE/SFT与赛力斯PE提示词，不能用AGENTS的Seed1.8覆盖所有项目版本。（来源：`chapters/C/raw/planner-onepage.txt:308-360`）
- **F052｜输入结构｜车书变量冲突证据**：车书方案明确只把答案注入SP的knowledge，与动态专业知识同名，当前合并优先级原文未说明。（来源：`chapters/C/raw/manual-qa-tech.txt:27-29,195-199,304-309`）
- **B041｜输入结构｜4/29 历史方案**：动态专业知识以 knowledge 加载在 SP；文末同时列出 status、goal_list、env_info、memory 动态变量，不能用此历史模板证明今天实际位置。（来源：`chapters/C/raw/dyn-knowledge-prd.txt:388-396,1229-1266`）
- **A063｜输入结构｜HOLD历史方案**：Director SFT 版工具描述曾固定写死，动态加载方案拟用 tool_list 占位符按租户替换，但该期因重大演示 HOLD，不能与其他版本工具动态加载混写。（来源：`chapters/C/raw/car-weekly.txt:9360-9368`）
- **A067｜输入结构｜重构排期**：Context 内部链路与 RPC 定义于 7/08～7/09 重构并统一收敛到 IDL，便于其他调用方维护。（来源：`chapters/C/raw/car-weekly.txt:11699-11703`）
- **A068｜输入结构｜平台能力**：Director SP 工具信息从写死切动态加载后，Agent 管理平台于 7/02 开发、7/03 测试支持快速获取工具部分 Prompt。（来源：`chapters/C/raw/car-weekly.txt:11850-11857`）
- **A084｜输入结构｜实验阶段**：4 月 Context 信息由 SP 搬到 UP 的改造仍为配合算法实验，6/11 UP 代码已改且部署但算法效果仍验证，不能直接推定所有项目都已采用同一摆放位置。（来源：`chapters/C/raw/car-weekly.txt:16707-16707；13103-13103`）
- **F062｜输入结构｜2026-07-21 MVP方案**：event是一种主动UP输入，用于告知重要事件并让Planner判断是否反应，此期事件无需检索不等于所有事件都会主动触发推理。（来源：`chapters/C/raw/event-dt-input.txt:1-8`）
- **F108｜输入结构｜记忆源更新及有效期快照**：短期情景每20分钟或20个文本总结、有效1天；长期情景按天合并；长期语义按天提取默认无过期策略；短期历史依业务提交且表列1天有效，均非Planner历史窗口。（来源：`chapters/C/raw/memory-onepage.txt:223-300`）
- **B090｜输入结构｜历史方案 HOLD**：SFT 工具描述从固定写死改为 tool_list 动态占位并按租户加载被列为重大演示后再变更的 HOLD，不能把后续动态工具机制倒推成当时均已支持。（来源：`chapters/C/raw/h2-biweekly.txt:7900-7908`）
- **B093｜输入结构｜动态工具接入方案**：仅满足触发条件才向 DT 暴露当前页动态工具，目的是提高工具选择准确性，不能把每次全部工具全量注入当作固定规则。（来源：`chapters/C/raw/h2-biweekly.txt:1795-1804`）
- **A102｜输入结构｜四期职责**：Context 与 Planner、Agent 同级，提供记忆、端状态、历史等子模块检索整合并可做写入校验，但不负责存储或实际数据写入。（来源：`chapters/C/raw/context-tech-review.txt:1969-1987`）
- **A103｜输入结构｜四期职责**：各上下文源自己负责存储、检索接口、实时性与准确性，下游调用方按chat_id/message_id保存本轮用过的上下文用于追溯。（来源：`chapters/C/raw/context-tech-review.txt:1978-1980`）
- **A112｜输入结构｜四期接口原型**：Context查询参数包括Query、VehicleUser、ContextScope和Scene，ContextScope不填默认搜全部，Scene用于选择场景定制配置。（来源：`chapters/C/raw/context-tech-review.txt:2005-2025`）
- **A114｜输入结构｜历史接口示例**：Context测试响应将 long_memory、short_memory和vehicle_resource分别返回文本列表，示例中的“当前车速300码”等仅是接口占位，不能当实车状态或事故。（来源：`chapters/C/raw/context-tech-review.txt:2057-2084`）
- **A126｜输入结构｜项目说明待原文核验**：SP约30K～35K token、UP约10K～15K token、23工具、69示例、示例约占SP50%的说法来自项目说明，当前技术评审全文没有这些规模统计，须由其余原文或实际模板计数核验。（来源：`/Users/bytedance/Desktop/3.23/AGENTS.md:41-49`；核对：`chapters/C/raw/context-tech-review.txt:1-2134`）
- **A129｜输入结构｜项目说明待原文核验**：项目说明同时将goal_list/env_info列为SP动态变量又列在用户Query中，不能据此锁定现行唯一摆放位置，需与4月Director调整和7月SLS等原文分版本比较。（来源：`/Users/bytedance/Desktop/3.23/AGENTS.md:41-49`；核对：`chapters/C/raw/context-tech-review.txt:1-2134`）
- **F122｜输入结构｜会议设计取舍**：视觉放UP曾有乱发挥，会上建议强化SP持续视觉意识并评估高频动作变事件、低频外观留变量，未给已完成实施证据。（来源：`v-lesson-20261105/memory/meeting-1104-transcript.md:181-197；00:30:20-00:33:46`）
- **A130｜输入结构｜PRD要求**：Director接收有效user input、advice、tool feedback和event，结合当前情境、端状态与用户记忆规划任务，工具反馈回来后再推理。（来源：`chapters/C/raw/director-prd.txt:147-160；185-213`）
- **A131｜输入结构｜输入示例**：当前用户输入示例含query、speaker_name、speaker_position与timestamp，建议和用户输入可以拼为数组；此文未给各部分固定token长度。（来源：`chapters/C/raw/director-prd.txt:156-161`）
- **A132｜输入结构｜上下文要素清单**：PRD将人设风格、可用工具和emoji、静态/动态示例、场景知识、能力边界、车辆知识、世界/乘员/人人/人机/工具/屏幕/端状态感知、记忆画像列为上下文组成。（来源：`chapters/C/raw/director-prd.txt:185-195`）
- **A135｜输入结构｜跨章回指**：打断信息可以作为独立event或当前Query的last_talk_content带入，内容区分已播与未播，属于I/M章已讲的输入背景来源。（来源：`chapters/C/raw/director-prd.txt:236-250`）
- **A140｜输入结构｜人名与空间指代**：Planner需将人名和相对方位改写成工具能执行的座位目标，例如给明骏加热改为副驾座椅加热、右边一排改为副驾和二排右。（来源：`chapters/C/raw/director-prd.txt:658-674`）
- **A146｜输入结构｜条件触发输入设计**：定时或条件任务到点后给Planner的输入包含任务原文与条件已触发，当前温度超过26/28度只是例子，条件注册和判定归任务/触发器章节。（来源：`chapters/C/raw/director-prd.txt:802-857`）
- **A150｜输入结构｜工具命名版本差异**：该PRD标准化列表使用vehicle_status_search、user_memory_search与visual_qa，与项目说明和早期材料的search_vehicle_status_info、search_user_memory与search_visual_info不同，不能擅自当作完全同一接口原名。（来源：`chapters/C/raw/director-prd.txt:1293-1299；1366-1372；1440-1447`）
- **A151｜输入结构｜规模核验边界**：本PRD有完整的上下文要素与项目提示词key，但没有SP30K～35K、UP10K～15K、69示例、KV缓存或远区近区收益的数值证据，工具表也不是固定23项的同一快照。（来源：`chapters/C/raw/director-prd.txt:185-195；1245-1555`）
- **F130｜输入结构｜上汽7月31快照实物核对**：该SP快照是role:system的JSON，content共63714字符、2186逻辑行，程序计数27个工具定义及25个参考示例标题（编号有缺号及重复），不能按最大编号28计算示例数。（来源：`/Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/sp.md:JSON.content全文结构计数；逻辑行34-251,253-1736`）
- **F131｜输入结构｜固定SP内容快照**：SP包含角色、4类输入格式、工具名/描述/参数/限制/tips、输出JSON规范、6条注意事项、示例、表情、车型能力边界、其他知识、唤醒词及聊天风格。（来源：`/Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/sp.md:content逻辑行1-252,1737-2053`）
- **F132｜输入结构｜已填变量SP快照**：快照尾部依次包含基础QA、动态专业知识、3条场景示例、日期天气、成员身份、memory与画像、进行中任务目标、车端状态，说明至少此上汽快照的目标和车况位于SP末尾。（来源：`/Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/sp.md:content逻辑行2055-2186`）
- **A154｜输入结构｜探索职责**：Context manager在探索方案中负责压缩、选择、总结、隔离与Agent上下文同步，属于Planner的外部依赖而非Planner模型自身凭空记忆。（来源：`chapters/C/raw/planner-explore.txt:55-57；525-535`）
- **A158｜输入结构｜工具原名**：探索版记忆工具原名是search_user_preferences，环境/车辆状态工具是search_vehicle_status_info，均以自然语言Query查询；与后续search_user_memory/user_memory_search的名字须按版本区分。（来源：`chapters/C/raw/planner-explore.txt:461-498`）
- **A167｜输入结构｜训练数据示例**：“我好困”训练示例先以get_extra_info查询环境、role:tool返回车速0/车窗开/空调关，再并行车控并把各工具结果以role:tool交回，属于旧训练格式而非现行JSON输入结构。（来源：`chapters/C/raw/planner-explore.txt:757-867`）
- **F140｜输入结构｜轮次边界不可混同**：Planner首次准备等待Context变量并建图，工具后续轮把observation回灌图状态；该文没有证明每次LLM续轮都会重新取所有车况或记忆。（来源：`chapters/C/raw/planner-onepage.txt:104-144`）
- **A172｜输入结构｜10/22宣讲解释**：advice当时主要来自静态Advisor主动服务与触发的定时/条件/长时任务，记忆前置检索不应被误解释成advice输入。（来源：`v-lesson-20261105/director-talk.md:331-357`；文字记录00:56:13～00:57:19）

## 二、预注入与动态检索（42 条）

- **B003｜预注入与动态检索｜技术方案**：动态示例在 pre-query 阶段并行检索以避免拖慢主链路，原文没有把该时机等同于 VAD 的预请求。（来源：`chapters/C/raw/dyn-example-onepage.txt:20-23`）
- **F004｜预注入与动态检索｜OnePage当前方案**：V2取消统一精筛并把质量控制下放各源，预注入只带常用信息，Planner判断不足后才调用检索工具。（来源：`chapters/C/raw/context-onepage.txt:101-106`）
- **F005｜预注入与动态检索｜方案覆盖声称非实测**：OnePage称预注入覆盖80%常规请求、动态检索覆盖剩余20%，没有给出样本或计算方法。（来源：`chapters/C/raw/context-onepage.txt:105-106,167`）
- **B013｜预注入与动态检索｜工具定义**：缺少当前车辆状态时 Planner 可调用 search_vehicle_status_info，以自然语言查询温度、空调、座椅、车窗、续航等特定状态。（来源：`chapters/C/raw/dyn-example-bug.txt:58-63`）
- **B014｜预注入与动态检索｜工具定义**：search_user_memory 以需要查询的细节或偏好为参数，例子包括某人奶茶甜度和上周去过的餐厅。（来源：`chapters/C/raw/dyn-example-bug.txt:111-114`）
- **B021｜预注入与动态检索｜评测临时方案**：能力边界检查由 Flow 在 runPrepare 异步启动，Planner 前置等一次结果，再用于 query 改写及动态 capability 上下文注入。（来源：`chapters/C/raw/capability-boundary.txt:8-14`）
- **B022｜预注入与动态检索｜评测临时方案**：能力检查解析到 can_implement=true 即可通知；false 时等 reason 和 required_capabilities 齐备才通知，后台仍消费完整流供观测。（来源：`chapters/C/raw/capability-boundary.txt:37-41`）
- **F022｜预注入与动态检索｜历史设计**：长期记忆不全量加载，随场景提前取部分并复用近期任务已取结果，按场景、人物、任务过滤后分发。（来源：`chapters/C/raw/public-context-prd.txt:256-282`）
- **F042｜预注入与动态检索｜历史需求的定位**：RAG只是Context的必要非充分工具，动态知识还可按分类标签等确定方式或模型驱动选取，缺上下文时可用知识切片临时干预。（来源：`chapters/C/raw/knowledge-status.txt:522-535`）
- **F048｜预注入与动态检索｜2026-05车书方案**：约2000条静态车书QA由Planner下游工具前置为Context初筛，若它不是最慢并行源可隐藏耗时，并减少独立工具RPC。（来源：`chapters/C/raw/manual-qa-tech.txt:5-31`）
- **F051｜预注入与动态检索｜车书方案参数**：车书query可结合历史改写再检索Top3，score_threshold与dense_weight待评测确定，低置信不注入且无结果时knowledge为空。（来源：`chapters/C/raw/manual-qa-tech.txt:176-199,263-271`）
- **A050｜预注入与动态检索｜已上线（周报）**：语义记忆引入打分与排序于 9/01 上线，目的明确为防止召回过多。（来源：`chapters/C/raw/car-weekly.txt:6755-6766`）
- **A056｜预注入与动态检索｜已上线（周报）**：上汽端状态工具检索切 RAG 的改造 8/10～8/11 开发并于 8/25 跟版上线，预期召回更快且 bug 更容易修复。（来源：`chapters/C/raw/car-weekly.txt:7939-7944`）
- **A065｜预注入与动态检索｜优化设计**：情景记忆召回过多推动新增记忆打分、过滤及排序，量化召回过程，而非无限扩大输入。（来源：`chapters/C/raw/car-weekly.txt:11631-11638`）
- **A078｜预注入与动态检索｜合码未开启**：6 月有记忆功能跟版合入但保持关闭，原因是召回条数太多、待打分筛选评测完成，说明代码合入不等于功能开启。（来源：`chapters/C/raw/car-weekly.txt:13151-13157`）
- **A086｜预注入与动态检索｜历史设计方向**：3 月周报提出画像具备后先给 Planner 注入画像、判断不够再调用记忆查询工具，是随后预注入加动态检索的前期设计。（来源：`chapters/C/raw/car-weekly.txt:17614-17615`）
- **F099｜预注入与动态检索｜PRD明确已实现**：语义画像当前固定注入未做检索，按车上实际在场人输入Director；长篇自然语言画像另标长期未实现。（来源：`chapters/C/raw/memory-prd.txt:277-307`）
- **F101｜预注入与动态检索｜召回设计及已实现子集**：召回流程是LLM推场景标签、标签内按相似度/重要性/时效/情感排序、取TopN，明确已实现的是标签推理、长期语义时效/相似度、长期情景重要性/时效/相似度。（来源：`chapters/C/raw/memory-prd.txt:356-404`）
- **F107｜预注入与动态检索｜记忆服务职责**：记忆服务可按query语义检索及标签取数据，但明确可能过召且调用业务方需自行处理，不能把返回数据全当本轮应采纳事实。（来源：`chapters/C/raw/memory-onepage.txt:3-9`）
- **F109｜预注入与动态检索｜召回风险说明**：口语相似度可能落0.39边界，纯向量难处理模糊指令、定向调badcase及时序优先，服务采用标签召回评分排序。（来源：`chapters/C/raw/memory-onepage.txt:380-388`）
- **B077｜预注入与动态检索｜9/1 已上线**：语义记忆增加打分排序以防召回过多，8/12–14 开发、8/18 提测并于 9/1 上线。（来源：`chapters/C/raw/h2-biweekly.txt:4168-4180`）
- **A096｜预注入与动态检索｜历史查询设计**：通用记忆模块早期按 Query 直接在向量数据库匹配，搜索个数与稠密向量权重可由调用方指定。（来源：`chapters/C/raw/context-tech-review.txt:825-826`）
- **A099｜预注入与动态检索｜历史接口定义**：短期记忆查询有 Query 时才按向量相关性匹配，Query 长度小于512、limit取0～100且默认10条，属于接口检索限制而非本轮固定注入10条。（来源：`chapters/C/raw/context-tech-review.txt:1259-1294`）
- **A100｜预注入与动态检索｜历史接口定义**：长期记忆查询 Query 长度小于512、limit取0～100，可按毫秒 start_time 过滤，返回文本和仅有Query时存在的score。（来源：`chapters/C/raw/context-tech-review.txt:1657-1736`）
- **A104｜预注入与动态检索｜四期原则**：Context 主模块只接受原始或业务改写后的当前 Query，不自行处理调用方多轮需求，多轮语义由业务方改写后传入。（来源：`chapters/C/raw/context-tech-review.txt:1971-1972`）
- **A105｜预注入与动态检索｜四期可定制**：调用方可指定查询哪些上下文源、总结所用 SP、返回原始还是总结结果，而输出默认是可直接放入 SP/UP 的检索信息。（来源：`chapters/C/raw/context-tech-review.txt:1973-1977`）
- **A110｜预注入与动态检索｜四期查询隔离**：即使两次 Query 字面完全相同，四期也每次重新生成检索信息，因为当时状态可变，且允许一次业务生命周期内多次调 Context 补子Agent/子函数背景。（来源：`chapters/C/raw/context-tech-review.txt:2001-2002`）
- **A118｜预注入与动态检索｜五期设计**：模糊语义仅改写一次搜索词难以召回完整信息，因此拟并行多路改写产生多条关键词，提高召回完整性与准确性。（来源：`chapters/C/raw/context-tech-review.txt:2099-2100`）
- **A119｜预注入与动态检索｜五期n+1设计**：调 Planner 之前先返回驾驶风格、车控偏好和美食偏好等基础记忆，Planner判断已足够答复时本轮结束，否则改写请求再调记忆工具。（来源：`chapters/C/raw/context-tech-review.txt:2104-2108`）
- **A120｜预注入与动态检索｜五期重试边界**：记忆工具可在多次改写后继续查找，直到达到最大尝试轮次或找到满意答案，但本文件未给最大轮次的数值。（来源：`chapters/C/raw/context-tech-review.txt:2108-2108`）
- **A121｜预注入与动态检索｜五期分工**：五期拟把画像全量交下游，工具暂时维持向量检索，所以画像直接注入和按Query检索记忆是两条不同通路。（来源：`chapters/C/raw/context-tech-review.txt:2111-2111`）
- **A123｜预注入与动态检索｜五期代价**：预注入过少会缺材料、过多会失焦且不同用户不一定都获益，后续拟按有效期、使用次数、相似度和重要性动态计算记忆权重。（来源：`chapters/C/raw/context-tech-review.txt:2116-2119`）
- **A139｜预注入与动态检索｜设计要求**：用户不喜欢吹风、讨厌紫色以及昨天烤鸭店地址等记忆影响本轮动作选择，但记忆生成与存储没有在这些示例中展开。（来源：`chapters/C/raw/director-prd.txt:643-656`）
- **A144｜预注入与动态检索｜设计场景**：“去昨天那个游泳馆”示例先从记忆取地址再导航，说明定位旧地点是当前决策依赖，不等于历史动作可直接重放。（来源：`chapters/C/raw/director-prd.txt:784-797`）
- **F133｜预注入与动态检索｜工具名称版本差异**：此快照车况工具名是vehicle_status_search、记忆是user_memory_search、视觉是visual_qa，与项目说明的search_vehicle_status_info/search_user_memory/search_visual_info命名不同，应按实际tool_list映射而非混为同一版函数名。（来源：`/Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/sp.md:content逻辑行57-62,117-122,215-220`）
- **B114｜预注入与动态检索｜二手机制样例；9/3 前后**：短期记忆示例按时间戳逐条叙述谁做什么，长期情景是时段聚合叙述，进入本轮时应让 Planner 区分记录时间与事件时间。（来源：`v-lesson-20261107/notes-chat.md:126`；消息定位：om_x100b66b69de7a0a4c3f340d98470e4a；本轮未重取群消息原文）
- **A155｜预注入与动态检索｜探索边界**：句法RAG当时仅匹配明确单轮Query，不支持多轮上下文、情景描述、记忆和车机状态；“换一个”“再来一个”属于需要补上文的开放问题。（来源：`chapters/C/raw/planner-explore.txt:107-113；160-180`）
- **A156｜预注入与动态检索｜情景RAG设计**：情景RAG为模糊单轮请求注入few-shot等知识并可给agentLimit，但最终拆解仍由模型输出决定，文中承认次轮指代继承困难。（来源：`chapters/C/raw/planner-explore.txt:212-236`）
- **A157｜预注入与动态检索｜旧notes修正**：Planner探索既写按需调用记忆与环境工具，也写可直接根据SP状态信息答车况/记忆问题并展示RAG注入背景，因此不能概括成“早期完全没有预注入、全靠工具查”。（来源：`chapters/C/raw/planner-explore.txt:355-372；461-498；547-562`）
- **A160｜预注入与动态检索｜记忆调用职责**：探索版长期记忆泛指画像、偏好、高频控制历史和车控设置记录，由Planner判断查什么、记忆模块匹配返回，规则可辅助判断。（来源：`chapters/C/raw/planner-explore.txt:547-554`）
- **A171｜预注入与动态检索｜10/22宣讲当时陈述**：郝晓伟明确说Query进Director时同步前置检索Context且包含用户记忆，第一次推理已有部分记忆，足够则直接推理，不足再调工具查别的记忆。（来源：`v-lesson-20261105/director-talk.md:356-357`；文字记录00:57:19）
- **A176｜预注入与动态检索｜证据边界**：10/22逐字稿只确认Query首轮有前置Context及必要时工具补查，没有说明每次工具续轮是否重新跑全部Context、固定刷新周期或跨轮缓存复用规则。（来源：`v-lesson-20261105/director-talk.md:356-357；196-197`；文字记录00:57:19、00:31:52）

## 三、车况、位置、导航、屏幕与视觉环境（75 条）

- **F010｜车况与环境｜方案**：核心端状态按必返白名单取回，端状态自然语言拼接按文本去重，极值/安全值/相关知识字段仍列待确认。（来源：`chapters/C/raw/context-opt-v1.txt:63-116`）
- **F012｜车况与环境｜P1方案**：世界信息拟接和风实时天气，并增加12类头条榜单每类Top3新闻标题，每5分钟刷新一次。（来源：`chapters/C/raw/context-opt-v1.txt:118-158`）
- **B015｜车况与环境｜工具定义**：search_visual_info 支持车内、车外及屏幕视觉问答；氛围灯所需视觉理解直接交给 ambient_light_control。（来源：`chapters/C/raw/dyn-example-bug.txt:210-214`）
- **B019｜车况与环境｜工具提示**：“第二家口味怎么样”必须从历史列表还原具体商家名后查询，顺路搜索必须先处于有效导航路线。（来源：`chapters/C/raw/dyn-example-bug.txt:71-76`）
- **F015｜车况与环境｜方案明确优先级**：车辆状态背景明确声明比对话历史更新、更准确，覆盖空调、座椅、驾驶、导航、媒体娱乐等状态。（来源：`chapters/C/raw/dt-context-adjust.txt:17-21`）
- **F021｜车况与环境｜历史设计非当前屏幕上线证明**：1.0端状态仅保留最新值，屏幕界面计划记录最近5分钟截图及时间戳，来源为端侧采集。（来源：`chapters/C/raw/public-context-prd.txt:71-100`）
- **F025｜车况与环境｜赛力斯方案**：端状态筛选模型读取3轮历史、核心端状态名及知识，输出信号名称/id与限100字的筛选理由。（来源：`chapters/C/raw/sls-context.txt:36-48`）
- **F026｜车况与环境｜赛力斯方案**：常驻13项为导航状态、收藏地址、目的地、播放模式和状态、当前音频、行进状态、空调状态/风向/循环/制冷开关、车窗、续航、途经点，和筛选结果去重后默认注入SP。（来源：`chapters/C/raw/sls-context.txt:49-137`）
- **F027｜车况与环境｜赛力斯方案**：端状态屏蔽座椅位置，输出YAML并合并空调、导航、音频、视频类信号以改善注意力。（来源：`chapters/C/raw/sls-context.txt:138-157`）
- **F028｜车况与环境｜赛力斯方案**：世界信息用YAML输出当前城市和风实时天气、日历、当前车辆位置，舱外AlwaysOn的路面及所见文字以自然语言进入世界信息。（来源：`chapters/C/raw/sls-context.txt:160-184,257-261`）
- **F045｜车况与环境｜原主线历史上报机制**：车辆上电且语音可用时上传可获取的全量状态，低频信号可监听增量或10秒轮询，高频信号2秒轮询。（来源：`chapters/C/raw/knowledge-status.txt:560-571`）
- **F046｜车况与环境｜原主线历史存储机制**：云端按车辆唯一ID保存初始化全量状态，并用增量新增或替换，原文称实时有效但没有失效时间或丢报兜底规则。（来源：`chapters/C/raw/knowledge-status.txt:572-574`）
- **B037｜车况与环境｜4/29 历史方案**：知识筛选优先参考最新 env_info，范围聚焦空调温度、乘员、行驶速度档位、导航目的地及 ETA、播放内容。（来源：`chapters/C/raw/dyn-knowledge-prd.txt:64-83`）
- **B047｜车况与环境｜版本冲突**：旧动态知识提示词说 search_visual_info 无法查看屏幕，而动态示例解 bug 指南明确其支持屏幕问答，两份工具能力范围不同。（来源：`chapters/C/raw/dyn-knowledge-prd.txt:1154-1156；对照 dyn-example-bug.txt:210-214`）
- **A022｜车况与环境｜HOLD**：屏幕信息上云进入 Context 的方案已初步对齐，但最新期仍 HOLD，依赖客户提供能力接入，目标是支持依赖屏幕信息的问答。（来源：`chapters/C/raw/car-weekly.txt:492-497`）
- **A028｜车况与环境｜待排期**：人数识别和人数变化感知的新增能力在最新期排期待定。（来源：`chapters/C/raw/car-weekly.txt:547-549`）
- **A035｜车况与环境｜已上线（周报）**：FaceID 与 VLM 乘客列表信息融合在 10/14 测试通过、10/20 上线，目标是准确体现乘客且不丢信息。（来源：`chapters/C/raw/car-weekly.txt:2999-3005`）
- **A040｜车况与环境｜车型方案限制**：赛力斯屏幕识别方案只允许娱乐搭子空间下使用，旧期端到端测试还被赛力斯页面未开发完成阻塞，不能外推成一般屏幕 Context 已全面接入。（来源：`chapters/C/raw/car-weekly.txt:4427-4436`）
- **A045｜车况与环境｜已上线（周报）**：事件生产与使用迭代于 9/08 上线，补充事件源和消费方，让 Context 与 Planner 感知更多用户行为。（来源：`chapters/C/raw/car-weekly.txt:5433-5440`）
- **A047｜车况与环境｜发版排期记录**：接入弋途 AINavi、记忆开关等事件的迭代排期 9/04～9/09 开发联调、9/10 发版，目的是避免 DT 不知道开关操作而答错。（来源：`chapters/C/raw/car-weekly.txt:5504-5511`）
- **A048｜车况与环境｜已上线（周报）**：云端触发器生产部分事件日志并经事件服务补给 Context 的能力于 9/08 测试通过上线。（来源：`chapters/C/raw/car-weekly.txt:5841-5850`）
- **A051｜车况与环境｜链路建设先行**：将 VLM 信息送 Planner 的当期目标先搭链路、再基于实车调效果，8/22 开发、9/01 QA 介入并预计 9/08 上线，不能把链路通等同模型会使用视觉。（来源：`chapters/C/raw/car-weekly.txt:6792-6801`）
- **A053｜车况与环境｜已上线（周报）**：端侧固定频次 VLM 信息上云的生产侧于 8/20 上线，而 Context 消费侧另排 8/22～8/24，生产与消费交付不能混为一项。（来源：`chapters/C/raw/car-weekly.txt:7868-7875`）
- **A054｜车况与环境｜已上线（周报）**：端状态补齐“清空”的语义以减少 badcase，8/04～8/06 开发并测试上线，解决旧值可能残留的技术空白。（来源：`chapters/C/raw/car-weekly.txt:7891-7895`）
- **A060｜车况与环境｜已上线（周报）**：端状态针对协议设计失误做过修改，目标避免端云数据不同步造成 Planner 理解错误。（来源：`chapters/C/raw/car-weekly.txt:9132-9134`）
- **A061｜车况与环境｜已上线（周报）**：端状态请求因网络乱序使旧状态覆盖新状态的问题于 7/30 修正，收到的过期数据会被主动丢弃。（来源：`chapters/C/raw/car-weekly.txt:9150-9157`）
- **A066｜车况与环境｜已开发（周报）**：ToB 主线端状态二次筛选已上线后，AI汽车于 6/29～6/30 同步该能力，使端状态正确被筛出。（来源：`chapters/C/raw/car-weekly.txt:11683-11690`）
- **A072｜车况与环境｜已下线（上汽）**：上汽因硬件无法提前缓存截图、后置取图会截入 AI 画布，双方产品同意下掉屏幕理解功能并于 6/26 发版。（来源：`chapters/C/raw/car-weekly.txt:12688-12695`）
- **A077｜车况与环境｜已上线（周报）**：端状态输出从 Markdown 改为 YAML，并合并空调状态、风向、循环和制冷开关等同类信号以改善输入组织。（来源：`chapters/C/raw/car-weekly.txt:13164-13169`）
- **A079｜车况与环境｜真实风险记录**：位置获取频率可能受合规约束，导致实时经纬度不准，6 月周报记解决方式仍讨论中。（来源：`chapters/C/raw/car-weekly.txt:13763-13767`）
- **A082｜车况与环境｜已上线（周报）**：Context 接入弋途行程信息在 5/14 已上线，但同周期仍记当前位置、目的地、途经点缺失，两个能力不能因名称相近而当作全部就绪。（来源：`chapters/C/raw/car-weekly.txt:14939-14942；15023-15025`）
- **A083｜车况与环境｜事故记录**：五一 ToB 死循环向记忆服务写入两亿多重复数据，周报记已恢复数据、后续排期防复发，属于上下文上游质量事故。（来源：`chapters/C/raw/car-weekly.txt:15330-15330`）
- **F063｜车况与环境｜MVP事件清单**：重要事件包括拒识后播报打断、唤醒、手选路线、手改终点/途经点、手选歌曲、上车、内部开门、手开智驾/加热、页面弹窗。（来源：`chapters/C/raw/event-dt-input.txt:21-125`）
- **F065｜车况与环境｜屏幕设计例非已交付证据**：保养弹窗event示例可携带卡片正文和可选按钮供Planner理解用户指代，未证明具备任意屏幕视觉理解。（来源：`chapters/C/raw/event-dt-input.txt:116-125`）
- **F066｜车况与环境｜2026-10-19方案定义**：端状态是设备最新值，事件是某时刻发生的变化或行为；事件包含时间、来源、resource及在场人，二者不可互相替代。（来源：`chapters/C/raw/event-iter-tech.txt:30-68`）
- **F067｜车况与环境｜方案**：事件来自触发器匹配端状态变化、客户端上报操作、云端人人/人车对话或记忆开关，各自按预定义信号生成结构化数据和自然语言。（来源：`chapters/C/raw/event-iter-tech.txt:86-96`）
- **F071｜车况与环境｜OnePage汇编设计**：车辆情境底座把端状态作为最新快照、VLM作为空间乘员感知、事件作为时间线，只有符合定义/白名单/规则的上报才进入事件及模型输入。（来源：`chapters/C/raw/endstate-event-onepage.txt:3-34`）
- **F072｜车况与环境｜汇编设计**：状态按全量/增量/删除、事件时间及主键合并，事件只追加不覆盖，Context Query按scope可返回结构化数据或模型可读文本。（来源：`chapters/C/raw/endstate-event-onepage.txt:33-54`）
- **F075｜车况与环境｜2026-10-20 v2技术设计**：启动全量/变化增量由SDK经frontier长连与Gateway到端状态微服务，服务负责校验合并双表及通知，Context/aidv只组织查询和消费格式。（来源：`chapters/C/raw/endstate-query-tech.txt:4-56`）
- **F076｜车况与环境｜v2设计**：按event_ts拒绝旧状态覆盖新值，full全覆盖、struct递归合并、array整体替换，途经点清空需上报空数组。（来源：`chapters/C/raw/endstate-query-tech.txt:78-121`）
- **F078｜车况与环境｜v2查询设计**：Context按渠道/车辆/来源/信号/system/subsystem调QueryVehicleSignal，新增端状态2.0数据源，结构化IDL对象直接透传，文本沿用1.0拼接规则。（来源：`chapters/C/raw/endstate-query-tech.txt:159-228`）
- **F079｜车况与环境｜时效字段**：SignalState包含newValue、oldValue、metadata、event_ts和expiration_time，当前值与变更前值及过期时间应分清。（来源：`chapters/C/raw/endstate-query-tech.txt:163-191,216-228`）
- **F100｜车况与环境｜明确未实现**：实时情境buffer拟追踪物理、逻辑和心理背景并固定给Director，但该节标未实现，不能等同已接入AlwaysOn视觉描述。（来源：`chapters/C/raw/memory-prd.txt:309-329`）
- **B056｜车况与环境｜10/20–11/02 已测试/计划**：端状态 2.0 的 M0.5 已测通过并登记 11/3 发版，M1 已提测以便东风通过 Context 向 Planner 查询。（来源：`chapters/C/raw/h2-biweekly.txt:502-511`）
- **B058｜车况与环境｜10/20–11/02 HOLD**：屏幕信息上云进入 Context 仍暂停，初步方案已一致但依赖客户提供接入能力，不能把独立视觉问答或卡片上报等同于已实现通用屏幕上下文。（来源：`chapters/C/raw/h2-biweekly.txt:519-524`）
- **B063｜车况与环境｜10/20–11/02 未排期**：多轮 ReAct 需要刷新端状态值被单列待办且排期待定，不能笼统写成每次工具续轮都已取到最新状态。（来源：`chapters/C/raw/h2-biweekly.txt:577-579`）
- **B067｜车况与环境｜9/8 已上线**：端状态接入事件日志及 E68 事件进 Context 于 9/8 上线，扩大 Context 与 Planner 可见用户行为。（来源：`chapters/C/raw/h2-biweekly.txt:2890-2897`）
- **B071｜车况与环境｜10/19 周期测试通过/计划上线**：FaceID 与 VLM 乘员列表融合在 10/13–14 开发、10/14 测试通过，预计 10/20 上线，原文未在该条确认实际上线。（来源：`chapters/C/raw/h2-biweekly.txt:1761-1767`）
- **B072｜车况与环境｜7/30 已上线**：端状态网络乱序会让先发后至的旧 A 覆盖后发先至的新 B，7/30 上线的修正会主动丢弃过期数据。（来源：`chapters/C/raw/h2-biweekly.txt:7615-7622`）
- **B073｜车况与环境｜7/23 DONE**：端状态协议设计失误导致端云不同步并使 Planner 理解错误，7/23 对协议进行修正。（来源：`chapters/C/raw/h2-biweekly.txt:7597-7604`）
- **B074｜车况与环境｜8 月已上线**：端状态补充“清空”语义以填补技术空白，避免清空后旧值残留引发 badcase。（来源：`chapters/C/raw/h2-biweekly.txt:6059-6064`）
- **B091｜车况与环境｜8/20 生产侧已上线**：赛力斯固定频次 VLM 数据上云生产侧 8/20 已上线，消费侧另排 8/22–24；9 月将数据给 Planner 的链路条目列 DONE，但仍要求实车调效果。（来源：`chapters/C/raw/h2-biweekly.txt:6036-6043,4207-4215`）
- **F113｜车况与环境｜2026-04-03设计样本**：情景描述包含20组舱外天气/风景/道路/车辆/行人与舱内位置/动作/表情/互动样本，不能当作模型能力测试或线上真实事件。（来源：`chapters/C/raw/scene-desc.txt:1-252`）
- **A101｜车况与环境｜四期设计**：Context 统筹记忆、事件与端状态等信息，按调用方 Query 筛选与加工后供业务方使用。（来源：`chapters/C/raw/context-tech-review.txt:1954-1957`）
- **A106｜车况与环境｜四期选择步骤**：Context 按 vehicle_user_id和Query等条件调用各源检索接口并聚合返回，不要求各源使用同一种向量或数据库检索方案。（来源：`chapters/C/raw/context-tech-review.txt:1988-1990`）
- **F119｜车况与环境｜会议陈述当时接入**：舱内视觉已与FaceID乘客信息拼在一起、舱外与世界信息拼接，但讨论重点是Planner没有有效消费已有视觉。（来源：`v-lesson-20261105/memory/meeting-1104-transcript.md:111-112,166-187；00:18:18-00:31:26`）
- **F120｜车况与环境｜讨论中的周期有不稳定边界**：会议描述舱内/舱外交替3+2秒，又指出输出长短可为3点几到5至6秒，不能把视觉描述写成稳定严格5秒刷新。（来源：`v-lesson-20261105/memory/meeting-1104-transcript.md:141-157；00:22:15-00:24:25`）
- **F126｜车况与环境｜设计场景说明**：撤销误召车控也需参考原端状态，例如误开家里空调后不能简单把车内空调关掉，否则原本已开的状态会被破坏。（来源：`v-lesson-20261105/memory/meeting-1104-transcript.md:521-522；01:37:12`）
- **B104｜车况与环境｜11/3 文字记录：当前现状**：视觉 caption 已进入 Context 且可在车上问到，但主模型仍不能很好参考，需专门优化 DT 示例和提示并再测。（来源：`v-lesson-20261105/memory/meeting-1103-transcript.md:1021-1048；00:32:35–00:33:16`）
- **A137｜车况与环境｜设计要求**：空调已开且温度最低、车窗已关或氛围灯已开时，Planner应避免再规划重复的打开或降低操作，依据是当前端状态。（来源：`chapters/C/raw/director-prd.txt:628-641`）
- **A138｜车况与环境｜设计要求**：下雨不应规划开窗，老人或宝宝所在后排不应规划大风量，说明车外环境与乘员情境共同约束车控策略。（来源：`chapters/C/raw/director-prd.txt:613-626`）
- **A142｜车况与环境｜综合设计场景**：“我好热”需要综合降雨、空调最低温与不爱吹风的偏好制定降温策略，21度和3档仅为示例动作而非所有车型固定规则。（来源：`chapters/C/raw/director-prd.txt:708-720`）
- **A143｜车况与环境｜综合设计场景**：前挡起雾或车里闷时，外部下雨、外循环已开与不爱开窗分别限制开窗和重复外循环；示例中的3分钟定时和车窗下降50%不是通用Context参数。（来源：`chapters/C/raw/director-prd.txt:736-760`）
- **A145｜车况与环境｜可感知能力边界**：副驾是否吃过饭被列为感知不到的条件，200℃外界温度与50℃空调为不可触发/不可执行示例，不能把用户描述当实际可用信号。（来源：`chapters/C/raw/director-prd.txt:812-820`）
- **A147｜车况与环境｜事件与持续任务设计**：持续介绍功能时若用户已手动开启该功能，应停止机械讲开启步骤并衔接新话题，要求本轮上下文感知用户实际操作与话题变化。（来源：`chapters/C/raw/director-prd.txt:883-903`）
- **F134｜车况与环境｜快照规则**：注意事项明确当前车况比历史更新准确；示例18在当前歌/目的地/车窗/空调与2分钟前历史冲突时全部按当前状态回答。（来源：`/Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/sp.md:content逻辑行243-249,969-1027`）
- **B115｜车况与环境｜二手产品争议；8/13、9/15**：三方 APP 状态接入受隐私协议和登录状态限制，端状态与事件不可能按每个车控指令无限配套增加；这是产品提出的覆盖边界观点而非证明所有缺状态场景无法解决。（来源：`v-lesson-20261107/notes-chat.md:129`；消息定位：原笔记仅保留部分消息ID：6c4482dc、18ae06fc、c1d5bd43；本轮未重取群消息原文）
- **B116｜车况与环境｜二手群聊设计；8/26**：同一场景事件可合并成一个模板并用 action 参数区分收藏和取消收藏等操作。（来源：`v-lesson-20261107/notes-chat.md:130`；消息定位：原笔记仅部分ID：a38ca081、85411892；本轮未重取群消息原文）
- **B124｜车况与环境｜二手研发说明；10/10–12**：当前位置放基础世界信息是因为车端信息与上传经纬度可能不一致，和风天气为分钟级且约1km分辨率预报，不能当作摄像头所见实时天气。（来源：`v-lesson-20261107/notes-chat.md:158`；消息定位：原笔记仅部分ID：c3a0be1e、5fcc9ca5；本轮未重取群消息原文）
- **B129｜车况与环境｜二手拒识旁支设计；9/20–21**：卡片上有稍后提醒按钮时用户说稍后提醒应被召回，拟把当前端状态页面加进拒识背景而不是跳过拒识；此处是拒识上下文，不是 Context 主模块自动屏幕感知已完成。（来源：`v-lesson-20261107/notes-chat.md:82`；消息定位：om_x100b65ccd6e57918c2aba40fa3b7879；本轮未重取群消息原文）
- **A159｜车况与环境｜环境定义**：探索版环境信息包括车机状态、车内乘客状态以及舱内外图像感知，Planner通过Search env info tool判断是否需要并告知模块要查什么。（来源：`chapters/C/raw/planner-explore.txt:555-562`）
- **A164｜车况与环境｜探索挂起设计**：探索版挂起任务的触发条件和状态由工程维护，AlwaysOn持续感知满足后通知Planner恢复，状态更新再写回ToolMessage；这不是每轮重执行旧任务。（来源：`chapters/C/raw/planner-explore.txt:678-690`）
- **B139｜车况与环境｜二手技术讨论；9/24 M32 00:49:02–53:21**：断网端状态上报丢失会造成条件任务漏执行与事件缺失，拟缓存合并补报，但补报晚到又可能误触发已过期条件，需区分事实补齐与当前触发。（来源：`v-lesson-20261107/notes-meetings.md:198`；会议链接及时间见该笔记第1节；原始临时逐字稿目录本轮不存在，保留二手证据层）
- **B143｜车况与环境｜二手数据源说明；9/24 M32 00:24:54–25:26**：ASR 热词用导航目的地与当前歌曲等端状态生成但独立存表并走老上报接口，端状态2.0本期不改热词链，不能视作新状态源一改所有消费者自动更新。（来源：`v-lesson-20261107/notes-meetings.md:79-80`；会议链接及时间见该笔记第1节；原始临时逐字稿目录本轮不存在，保留二手证据层）
- **A177｜车况与环境｜设计解释**：空调外循环执行失败后，Planner可结合低车速或驻车背景重新考虑开窗，不能把失败feedback当成已达成用户透气目标。（来源：`v-lesson-20261105/director-talk.md:81-82`；文字记录00:12:11）

## 四、对话历史、工具消息、裁剪与事件（49 条）

- **F016｜历史拼接｜方案**：本轮变历史后删除context变量以省窗口，但完整保留工具返回input、工具返回后播报与执行、用户query时完整tool调用输出。（来源：`chapters/C/raw/dt-context-adjust.txt:22-32`）
- **F031｜历史拼接｜赛力斯暂定方案**：独立事件流变量拟倒序注入10分钟最多30条并先进先出，重要事件另按最旧query到当前query的时间段插入对话历史。（来源：`chapters/C/raw/sls-context.txt:262-285`）
- **F033｜历史拼接｜2026-09-10实现说明**：buildHistoryMessages合并chat_history、planner_histories、planner_task_list重建user→assistant observation→user feedback，插近10分钟最多3条白名单事件并按真实时间稳定排序。（来源：`chapters/C/raw/planner-onepage.txt:104-108,277-279`）
- **F034｜历史拼接｜实现说明**：除最后一轮外车辆手册/联网搜索反馈压成省略号，组装失败降级History.ToEinoMessages，故排查需比较正常与降级历史。（来源：`chapters/C/raw/planner-onepage.txt:108,301-303`）
- **F037｜历史拼接｜实现说明**：每次模型完整输出写planner_histories，每个工具任务及结果写planner_task_list，工具反馈合成为tool_feedback与tool_name observation后再回LLM。（来源：`chapters/C/raw/planner-onepage.txt:132-152`）
- **F040｜历史拼接｜9月旧实现边界**：打断续说先用逐字打轴，缺打轴默认100ms/字估算，把已播和未播拼入last_talk_content；后写M章对未知播放进度的规范更严格，需分版本。（来源：`chapters/C/raw/planner-onepage.txt:146-150,293-299`）
- **F056｜历史拼接｜技术方案终态**：finish_type枚举为未完成-1、成功0、业务拒识1、执行错误2、模型风控3，普通历史仅接受成功，Planner另过滤风控记录。（来源：`chapters/C/raw/risk-history.txt:46-95`）
- **B036｜历史拼接｜4/29 历史方案**：知识筛选的最近 10 轮历史只含人和豆包的说话内容与 timestamp，不含工具使用。（来源：`chapters/C/raw/dyn-knowledge-prd.txt:44-55`）
- **B044｜历史拼接｜提示词规则**：历史任务失败不能被当作新任务也会失败的依据，用户重发同类任务应 new_task，终止后重发也须 new_task 而不是 add_info。（来源：`chapters/C/raw/dyn-knowledge-prd.txt:537-539`）
- **B046｜历史拼接｜提示词规则**：进行中 GUI 目标加最近要求补信息的工具反馈，构成“确认/好/验证码”优先路由为 add_info 的上下文，只有新需求或取消才跳出。（来源：`chapters/C/raw/dyn-knowledge-prd.txt:540`）
- **A016｜历史拼接｜分项已发版、整体仍DOING**：SP 中人车闲聊事件日志会影响 DT 表达，事件展示白名单于 9/18 发版，但开关事件同步弋途仍依赖对方接口。（来源：`chapters/C/raw/car-weekly.txt:469-474`）
- **A031｜历史拼接｜开发中（上游边界）**：输入管理最新期开发进度为 55%，计划 11/16～11/18 实车验证及提测、11/23～11/27 验收，说明学习站策略解释不能直接当作当时全线上现状。（来源：`chapters/C/raw/car-weekly.txt:699-713`）
- **A038｜历史拼接｜已上线（周报）**：赛力斯端侧本地链路的云端对话历史同步与拉取逻辑于 9/15 上线。（来源：`chapters/C/raw/car-weekly.txt:4199-4208`）
- **A039｜历史拼接｜已上线（周报）**：端侧直接上传 QA 对会影响 Planner 输出，9/15 上线的改造将端侧车控和可见即可说分别组织成 Planner 的 toolcall 格式。（来源：`chapters/C/raw/car-weekly.txt:4209-4216`）
- **A042｜历史拼接｜优化项**：DT 已将车控请求依上下文改写成具体指令，下游再带历史会干扰车控模型，因此 9/08 开发减少历史上下文影响的调整。（来源：`chapters/C/raw/car-weekly.txt:4482-4485`）
- **A064｜历史拼接｜已改造（周报）**：乱码若写入历史会导致后续轮次继续学习输出乱码，因此 7 月周报列出乱码后处理以阻断传播。（来源：`chapters/C/raw/car-weekly.txt:11546-11554`）
- **A070｜历史拼接｜已发版（周报）**：Planner 因参考历史而不再调用工具的问题于 6/16 调整历史输入，周报粗略估计解决约 90% 此类问题，不能当作严格实验通过率。（来源：`chapters/C/raw/car-weekly.txt:12537-12545`）
- **A071｜历史拼接｜已发版（周报）**：车控工具反馈于 6/23 增加车控指令，使 Planner 能在多指令场景区分哪个成功、哪个失败。（来源：`chapters/C/raw/car-weekly.txt:12635-12643`）
- **A073｜历史拼接｜真实修复记录**：离线车控 Answer 因未落 PlannerHistory 被过滤，修正历史构造以补入 Answer；正常 Query 打断后未及时落库的 Answer 则由 HistoryCache 补入。（来源：`chapters/C/raw/car-weekly.txt:13105-13111`）
- **A074｜历史拼接｜真实问题记录**：Advisor 打断用户 Query 后历史中曾出现两个同样 Query 的 UP，周报指向专项问题分析但未提供根因和修正细节。（来源：`chapters/C/raw/car-weekly.txt:13112-13112`）
- **F064｜历史拼接｜MVP中断设计**：拒识后的打断event包含位置/说话人、已播played及未播not_played，让Planner知道没说完的内容，和普通车况快照用途不同。（来源：`chapters/C/raw/event-dt-input.txt:126-132`）
- **F068｜历史拼接｜事件消费设计**：Context关注白名单可查10分钟暂定30条独立事件流，UP关注白名单可按时序穿插user间，静态Advisor默认查20分钟的n条，属于三种消费窗口。（来源：`chapters/C/raw/event-iter-tech.txt:97-128`）
- **F098｜历史拼接｜11月5编辑版PRD要求非线上实测**：对话摘要从第3轮起每新增1轮压缩用车周期QA，最多28轮、最长500token，放memory变量开头以补Planner5轮历史到后续记忆更新的空档。（来源：`chapters/C/raw/memory-prd.txt:269-274`）
- **B064｜历史拼接｜9/15 已上线**：端侧上报历史从直接 QA 对改为 Planner toolcall 格式，并按端侧车控和可见即可说构造不同格式，9/15 上线以防历史格式带偏输出。（来源：`chapters/C/raw/h2-biweekly.txt:2953-2961`）
- **B065｜历史拼接｜9/18 已发版记录**：闲聊时间日志进入 SP 影响 DT 表达，因此用事件白名单限制展示，9/17 开发、9/18 发版。（来源：`chapters/C/raw/h2-biweekly.txt:2962-2967`）
- **B068｜历史拼接｜9/15 云端已上线**：赛力斯本地对话的云端历史同步与拉取逻辑于 9/15 上线，目的为保证端云历史一致；此前记录仍待客户端接入联调。（来源：`chapters/C/raw/h2-biweekly.txt:2935-2944；对照4216-4223`）
- **B082｜历史拼接｜拒识旁支问题**：拒识模型最多 10 轮上下文会因超出窗口而丢历史并误判，其摘要语义情境实验不等于 Planner 的历史窗口。（来源：`chapters/C/raw/h2-biweekly.txt:2633-2636`）
- **A098｜历史拼接｜历史补充用途**：短期记忆被设计为对超出历史上下文的短时数据做合并总结，不能把记忆生成任务的输入数量当成 Planner 当前保留历史轮数。（来源：`chapters/C/raw/context-tech-review.txt:754-788`）
- **F115｜历史拼接｜2026-11-04讨论方向非已上线**：讨论保留5轮人机历史并加入最新5轮混合输入中的非人机内容（人人对话及事件），同时停止调用原SP事件流变量并改称历史输入。（来源：`v-lesson-20261105/memory/meeting-1104-transcript.md:26-62；00:01:25-00:07:32`）
- **F116｜历史拼接｜会议讨论**：摘要拟从仅QA扩为全部人机/人人/事件输入；旧需求22轮≤500token，会中确认旧超限丢前面，并要求先与20轮/20分钟短期记忆的计数单位对齐。（来源：`v-lesson-20261105/memory/meeting-1104-transcript.md:66-87；00:09:02-00:14:40`）
- **F118｜历史拼接｜计数尚需评审确认**：会上倾向人或豆包每句话、每事件各算一项，但同时要求评审与研发核对，不能把5轮直接改写为5个QA对或5条事件。（来源：`v-lesson-20261105/memory/meeting-1104-transcript.md:76-87；00:11:41-00:14:40`）
- **B106｜历史拼接｜11/3 文字记录：口头疑问**：会上出现“之前那个30轮的已经上了一版，也可以试试了，对吧”的问句，回答仍说明天提测、争取5号体验，因此 30 轮不能作为已确定摘要长度。（来源：`v-lesson-20261105/memory/meeting-1103-transcript.md:1071-1088；00:34:35–00:34:51`）
- **A134｜历史拼接｜产品要求**：用户询问时间天气、车辆参数/配置/状态或车内外感知时，必须依真实情况作答并降低基于历史对话给出过期答案的概率。（来源：`chapters/C/raw/director-prd.txt:224-234`）
- **A136｜历史拼接｜反馈聚合要求**：同轮多个工具调用要求待全部feedback返回后统一推理播报，而不是返回一个播一个；PRD另列允许tool feedback异步返回为未宣讲工程需求，两者须分阶段。（来源：`chapters/C/raw/director-prd.txt:590-592；914-918`）
- **A141｜历史拼接｜设计要求**：人人对话提到火锅后，后续“附近找个评分高点的”可以补全为找火锅店，说明历史背景可补省略但不是再次执行旧请求。（来源：`chapters/C/raw/director-prd.txt:676-681`）
- **B110｜历史拼接｜二手群聊取证；10/15 14:10–16**：研发在东风 S33 群引用 AIDV Planner 的默认规则为同一 channel、vehicle_id、chat_id 最近 30 分钟最多 5 轮历史加当前问题，事件插入但不计轮数，不能由此定义每轮如何计数。（来源：`v-lesson-20261107/notes-chat.md:128`；消息定位：om_x100b6232b27c6cbcdd769f36db16077；本轮未重取群消息原文）
- **B127｜历史拼接｜二手真实故障；8/20 20:17**：离线恢复在线时积压消息一起上云被合并成闲聊，历史补传和新指令混同会改变本轮意图，原消息讨论以降级处理。（来源：`v-lesson-20261107/notes-chat.md:45`；消息定位：om_x100b675b49c634a8c2f07caede30262；本轮未重取群消息原文）
- **B128｜历史拼接｜二手真实故障；10/9**：本地链路测试出现 history 只有端侧数据而没有云端数据、跨音区继承失败，说明端云历史同步的保存成功不等于双方实际采用一致。（来源：`v-lesson-20261107/notes-chat.md:114`；消息定位：原笔记仅部分ID：7a49ef7e；本轮未重取群消息原文）
- **A161｜历史拼接｜多Agent背景原则**：上下文管理需要剔除无用信息、及时加入其他Agent结果、按当前任务选择知识/记忆/工具格式，并在过长时选择压缩，不能把所有Agent所有结果无差别共享。（来源：`chapters/C/raw/planner-explore.txt:527-535`）
- **A162｜历史拼接｜探索任务视图**：探索版每个Query对应唯一plan_id，工程全局State保存任务状态并放入messages，工具反馈和状态更新因此进入后续模型背景。（来源：`chapters/C/raw/planner-explore.txt:658-663；688-690`）
- **A163｜历史拼接｜探索重规划**：下游执行失败时回传原任务描述和具体失败原因，Planner结合当前上下文重规划；中断恢复曾设计把未完成任务填SP并携checkpoint进入新Query。（来源：`chapters/C/raw/planner-explore.txt:665-677`）
- **B132｜历史拼接｜二手真实分析；8/13 M14 00:24:08**：水果店问题被解释为最近 5 轮目的地已设但途经点动作未完成，Planner 因未完成状态继续推进，不能仅凭用户看到重复动作就断言没理解。（来源：`v-lesson-20261107/notes-meetings.md:179`；会议链接及时间见该笔记第1节；原始临时逐字稿目录本轮不存在，保留二手证据层）【后续已在I章找到原始逐字稿补证，优先读B146–B148；该条保留旧取证层级用于追溯。】
- **B133｜历史拼接｜二手会议现状；10/20 M31 00:06:12、00:17:08**：DT 五轮上下文承接不了较长导航加泊车交互，讨论把任务移给司机 Agent 后下游仍面临五轮限制，拆 Agent 本身不自动解决历史容量。（来源：`v-lesson-20261107/notes-meetings.md:181`；会议链接及时间见该笔记第1节；原始临时逐字稿目录本轮不存在，保留二手证据层）
- **B134｜历史拼接｜二手会议讨论；9/2 M28 00:13:47**：feedback 干预话术会在五轮内持续影响 Planner，超出窗口便不再参考，说明工具结果的历史寿命决定补丁有效范围。（来源：`v-lesson-20261107/notes-meetings.md:183`；会议链接及时间见该笔记第1节；原始临时逐字稿目录本轮不存在，保留二手证据层）
- **B137｜历史拼接｜二手现状；9/1 M3 02:53:45**：事件有独立事件流变量和直接插历史两种进入 Context 的方式，当时云端事件仅记忆开关，不能说所有事件均用同一管道。（来源：`v-lesson-20261107/notes-meetings.md:196`；会议链接及时间见该笔记第1节；原始临时逐字稿目录本轮不存在，保留二手证据层）
- **B138｜历史拼接｜二手设计；9/1 M3 03:03:54**：记忆开关事件让模型知道已提醒过关闭，下次再调记忆时参考此前状态，历史应记操作和提示而不把关闭失败当新用户需求。（来源：`v-lesson-20261107/notes-meetings.md:197`；会议链接及时间见该笔记第1节；原始临时逐字稿目录本轮不存在，保留二手证据层）
- **A173｜历史拼接｜10/22当时现状**：宣讲明确说人人对话当时尚未接入，前面聊火锅后“附近找个评分高的”的例子属于后续能力设想，不能仅凭PRD设计例宣称已经上线。（来源：`v-lesson-20261105/director-talk.md:186-187`；文字记录00:28:59）
- **A174｜历史拼接｜10/22工具续轮解释**：按次序开主驾、副驾、左后、右后车窗的例子要求每次先收前一步成功feedback再React下一步，说明续轮消费真实结果，不是同时重放全部旧动作。（来源：`v-lesson-20261105/director-talk.md:196-197`；文字记录00:31:52）
- **A175｜历史拼接｜10/22当时播报策略**：当时同轮并行多个工具需待全部feedback返回才统一播报，工具自身不具备自主语音播报权限；不能将后续允许异步feedback的需求倒写为当时现状。（来源：`v-lesson-20261105/director-talk.md:151-152`；文字记录00:24:24）

## 五、动态示例与动态知识（26 条）

- **B001｜动态示例与动态知识｜技术方案（2026-09-10 编辑）**：动态示例用当前 query 从 VikingDB 按文本与向量混合检索 Top 3 相似 SFT 案例，格式化成“用户输入—处理逻辑”后注入 SP 的 scenario_sample。（来源：`chapters/C/raw/dyn-example-onepage.txt:3-23`）
- **B002｜动态示例与动态知识｜技术方案**：动态示例教具体工具调用的原子处理，动态知识教复杂场景的业务逻辑与多步骤 SOP，两者解决的问题不同。（来源：`chapters/C/raw/dyn-example-onepage.txt:3-5`）
- **B004｜动态示例与动态知识｜技术方案**：动态示例以 VikingDB 为线上检索源、MySQL 为元数据台账，并通过双写与补偿保持一致。（来源：`chapters/C/raw/dyn-example-onepage.txt:16-18`）
- **B006｜动态示例与动态知识｜技术方案**：动态知识不用向量检索而用 Seed-2.0-mini 小模型读取近两轮对话选择场景 ID，再从缓存 skillConfig 取内容换行拼接到 SP 的 knowledge。（来源：`chapters/C/raw/dyn-example-onepage.txt:25-35`）
- **B007｜动态示例与动态知识｜技术方案**：skillConfig 以代码配置保存儿童安抚、车内观影、急速调温等 8 个核心场景，每段包含触发、边界及分步执行逻辑。（来源：`chapters/C/raw/dyn-example-onepage.txt:28-32`）
- **B008｜动态示例与动态知识｜维护机制**：静态示例改 Fornax SP，动态示例后台在线热更新，动态知识需代码发版更新。（来源：`chapters/C/raw/dyn-example-onepage.txt:40-89`）
- **B011｜动态示例与动态知识｜设计准则**：静态示例常驻 SP 并教授可抽象的一类能力，动态示例按检索注入以解决低频且难抽象的单点问题。（来源：`chapters/C/raw/dyn-example-bug.txt:3-5`）
- **B012｜动态示例与动态知识｜设计准则**：动态示例只需用户 query 和执行答案，不需要静态示例的完整 input/output；能提炼共性的一组问题应放静态示例。（来源：`chapters/C/raw/dyn-example-bug.txt:8-16`）
- **B023｜动态示例与动态知识｜评测临时方案**：当 CanImplement=false 时非空 reason 被追加为 query 系统提示，所需能力列表对应的原子能力说明拼入 SP 变量 capability。（来源：`chapters/C/raw/capability-boundary.txt:66-74`）
- **B030｜动态示例与动态知识｜9/3 待开发**：动态示例二期提出新增查重拦截、批量导入导出、审核上线以及车型车系和舱内外定向维护。（来源：`chapters/C/raw/meeting-0903-dyn.txt:235-242；00:11:50–00:14:28`）
- **B031｜动态示例与动态知识｜9/3 维护流程提案**：批量变更多时拟先在 Excel 统一维护，再由指定人员批量导入，并对重复、已删除和不存在的 ID 报错。（来源：`chapters/C/raw/meeting-0903-dyn.txt:238-239；00:13:03`）
- **B032｜动态示例与动态知识｜9/3 维护流程提案**：动态示例审核用于拦下不规范写法，审核入口与飞书统一审批如何衔接当时仍需确认。（来源：`chapters/C/raw/meeting-0903-dyn.txt:241-242,292-320；00:14:28、00:17:04–00:18:32`）
- **F049｜动态示例与动态知识｜车书方案**：vehicle_knowledge独立VikingDB collection/index与记忆及场景RAG隔离，query向量化，answer作为knowledge变量给Director。（来源：`chapters/C/raw/manual-qa-tech.txt:40-94`）
- **B035｜动态示例与动态知识｜4/29 历史方案**：动态知识检索输入包括当前 query、最近 10 轮仅含说话内容的历史、当前目标队列、最新车辆状态及已加载知识 ID，输出增删 ID，reason 只用于分析不参与解析。（来源：`chapters/C/raw/dyn-knowledge-prd.txt:4-107`）
- **B038｜动态示例与动态知识｜4/29 历史方案**：知识库按 EXP 体验官、DRV 司机导游、COM 舒适管家、ENT 娱乐、LIFE 助理、EMO 伙伴六类专家和四段式场景 ID 组织。（来源：`chapters/C/raw/dyn-knowledge-prd.txt:144-245`）
- **B039｜动态示例与动态知识｜4/29 筛选原则**：知识选择先判断具体场景、关注变量变化趋势，并持续保留进行中目标所需知识。（来源：`chapters/C/raw/dyn-knowledge-prd.txt:261-275`）
- **B040｜动态示例与动态知识｜4/29 筛选原则**：动态知识只增删变化部分，场景失效则删除，信息不足且无法判断场景时新增列表保持为空而不虚构。（来源：`chapters/C/raw/dyn-knowledge-prd.txt:276-281`）
- **A037｜动态示例与动态知识｜已上线（周报）**：动态示例按车型信息维护的功能于 9/15 上线，目标是区分车型配置场景。（来源：`chapters/C/raw/car-weekly.txt:4131-4135`）
- **A059｜动态示例与动态知识｜已上线（周报）**：动态示例维护后台于 7/27 上线，产品可自主维护而无需每次工程手动发版。（来源：`chapters/C/raw/car-weekly.txt:9012-9020`）
- **A075｜动态示例与动态知识｜已上线（周报）**：动态示例在 6/09 已上线，早于 7/27 管理后台和 9/15 按车型分库，应将能力本体与管理迭代分开。（来源：`chapters/C/raw/car-weekly.txt:13136-13136`）
- **A085｜动态示例与动态知识｜开发完评测阶段**：3 月底动态示例已区分静态和动态，并按 Query 与工具返回动态加载，但当时只是开发完成、PPE 环境评测中。（来源：`chapters/C/raw/car-weekly.txt:17144-17144`）
- **B103｜动态示例与动态知识｜11/3 文字记录：排查分层**：动态示例问题必须先区分 Context 没召回和已召回但 DT 未采纳，后视镜讨论明确当前先查检索，并仍要补事件日志。（来源：`v-lesson-20261105/memory/meeting-1103-transcript.md:341-393；00:11:14–00:13:02`）
- **B109｜动态示例与动态知识｜11/3 文字记录：设想**：将 knowhow 比既有动态示例升级、先做简单落地方案被作为后续思路讨论，因为本周聚焦内核可能顺延下周，并无已落地机制。（来源：`v-lesson-20261105/memory/meeting-1103-transcript.md:1361-1378；00:42:30–00:43:20`）
- **B123｜动态示例与动态知识｜二手群聊调整；10/10–12**：为消除“记一下”和“设置一下”地址路由混淆，删除动态示例中记忆家、记忆公司、设置家、设置公司地址例子，改用静态示例15区分。（来源：`v-lesson-20261107/notes-chat.md:158`；消息定位：原笔记仅部分ID：97eebf2a、3ac87a14；本轮未重取群消息原文）
- **A181｜动态示例与动态知识｜职责澄清**：few-shot主要教Director何时怎样调用工具，是否具有某项功能由能力边界说明承担；车型不支持氛围灯时可删除相关few-shot。（来源：`v-lesson-20261105/director-talk.md:396-417`；文字记录00:59:42～01:00:19）
- **A182｜动态示例与动态知识｜工具变更验证**：新增或调整工具时先改名称、英文名和工具描述，再连同Director整体提示词评测，不能只改示例而不核工具能力描述。（来源：`v-lesson-20261105/director-talk.md:366-377`；文字记录00:58:37～00:58:52）

## 六、上下文的速度、token 成本与缓存（35 条）

- **B009｜速度与成本｜预期收益**：方案预计将 1000 多条示例移出 SP 后每次只注入 Top 3，以降低基础 token 成本；原文没有给出实测 token 降幅或延迟降幅。（来源：`chapters/C/raw/dyn-example-onepage.txt:91-94`）
- **F003｜速度与成本｜历史数据/目标**：V1的Context目标P90为800ms而实际1.2s，端状态两次模型筛选是主要瓶颈。（来源：`chapters/C/raw/context-onepage.txt:98-100`）
- **B025｜速度与成本｜性能初评**：能力边界检查与 Context 及车书改写并行，但作为 Planner 前置仍可能增加用户等待。（来源：`chapters/C/raw/capability-boundary.txt:94-97`）
- **B026｜速度与成本｜9/8 补充更新**：初评认为 2.0 lite 过慢而 mini 可能可行，9/8 补充称申请白名单后的 2.0 lite 单元速度基本满足；两结论对应不同模型单元而非同一次测试。（来源：`chapters/C/raw/capability-boundary.txt:94-112`）
- **F041｜速度与成本｜实现限额非token预算**：模型调用超时60秒、action_list非空且Step≤20继续工具，本文件未给SP/UP固定token长度。（来源：`chapters/C/raw/planner-onepage.txt:69,126,138`）
- **A010｜速度与成本｜已发版（周报）**：DT 删除多余输出 Token 已测试发版，周报声称首字约减少 150ms、单轮推理减少 150ms 以上，但这不是输入上下文缩短的收益。（来源：`chapters/C/raw/car-weekly.txt:342-345`）
- **A030｜速度与成本｜PENDING方案**：地图与智驾统一由司机 Agent 承接可降低 DT 工具量和输入 Token，但长期司机 Agent 方案在最新期仍 PENDING。（来源：`chapters/C/raw/car-weekly.txt:607-620`）
- **A043｜速度与成本｜ToB历史优化观测**：saicaudi 渠道 9/01 车控与端状态方案优化的周报记录日 Token 从 10.87B 降至 4.69B（-57%），是该渠道整体方案收益，不是 AI汽车 Context 全站成本。（来源：`chapters/C/raw/car-weekly.txt:7325-7327`）
- **A049｜速度与成本｜风险与观测**：Planner 从独立部署切换低延迟 TPM 保障包后 P50/P90 均慢约 100ms，且共享资源可能受其他应用大量请求影响 P99。（来源：`chapters/C/raw/car-weekly.txt:6461-6461；6655-6663`）
- **A055｜速度与成本｜已上线（周报）**：Context 预跑阶段 Redis key 压缩于 8/14 上线，目标是减小大 key 风险、提升稳定性，不是 KV Cache 优化。（来源：`chapters/C/raw/car-weekly.txt:7897-7900`）
- **A062｜速度与成本｜已上线（周报）**：动态示例 VikingDB 检索移到预跑处理并上线，开发窗口为 7/29～7/30，目标是避免检索长尾拉高 Context 总耗时。（来源：`chapters/C/raw/car-weekly.txt:9182-9189`）
- **A076｜速度与成本｜优化待办**：6 月周报拟将世界信息天气接口并行化，并基于 metric 分析 Context 长尾及增加整体超时控制。（来源：`chapters/C/raw/car-weekly.txt:13139-13140`）
- **A080｜速度与成本｜已上线（周报）**：Context 于 5/26 接入预跑、5/28 提速优化，并计划在情景打标完成后去粗筛、让各源并发运行。（来源：`chapters/C/raw/car-weekly.txt:14030-14036`）
- **B052｜速度与成本｜7/29–30 已上线**：Viking 动态示例查询移到预跑阶段，避免检索长尾响应时间拖慢 Context 总耗时。（来源：`chapters/C/raw/h2-biweekly.txt:7647-7654`）
- **B075｜速度与成本｜8/14 已上线**：Context 预跑缓存压缩 Redis key 大小并于 8/14 上线，以减少大 key 的稳定性风险；这不是模型 KV Cache 命中率优化。（来源：`chapters/C/raw/h2-biweekly.txt:6065-6070`）
- **B076｜速度与成本｜7–8 月模型迁移风险**：Context 迁到 2.0 mini 低延迟大池时原文明确当阶段 SLA 不保证，不能以低延迟模式名称推断尾延迟稳定。（来源：`chapters/C/raw/h2-biweekly.txt:6044-6053；对照7623-7630`）
- **B085｜速度与成本｜9/1 渠道优化统计**：saicaudi 车控及端状态联合优化记录日 token 从 10.87B 降到 4.69B、约减 57%，此数是该渠道联合方案而非单独 Context 的节省。（来源：`chapters/C/raw/h2-biweekly.txt:4827-4833`）
- **B098｜速度与成本｜视觉模型旁支实验**：端侧 VLM 将图片前置改为 prompt 前置以利用 prefix cache，再附任务重述可提升约 1 分却增加 token 并降低缓存利用率，实车速度仍需测，不可套成 Planner 实测。（来源：`chapters/C/raw/h2-biweekly.txt:1505-1509`）
- **A109｜速度与成本｜四期取舍**：为处理跨源重复和通用检索质量不足，四期拟在选择之后增加总结，但同时承认额外总结模型可能增加整链耗时、需实际业务评估。（来源：`chapters/C/raw/context-tech-review.txt:1993-2000`）
- **A122｜速度与成本｜设计预估**：五期写预注入预计解决90%的情况、其余10%调整检索策略，整体预计提速约800ms，准确性收益仍写xx%，这些都不能当线上实测。（来源：`chapters/C/raw/context-tech-review.txt:2113-2132`）
- **A125｜速度与成本｜缓存分层澄清**：四期不对相同Query复用Context检索结果与AGENTS所述模型KV前缀缓存属于不同对象，本文件没有KV Cache命中、失效阈值或时延实测。（来源：`chapters/C/raw/context-tech-review.txt:2001-2002；对照项目AGENTS.md:64-73`）
- **A127｜速度与成本｜项目说明待原文核验**：第2/3次模型调用仅算几百增量token、跨请求固定SP约30K可命中、长对话超过20轮缓存易被挤出的数字在本技术评审全文均无支持，不能把这些说明当已验证阈值。（来源：`/Users/bytedance/Desktop/3.23/AGENTS.md:64-69`；核对：`chapters/C/raw/context-tech-review.txt:1-2134`）
- **A128｜速度与成本｜项目说明待原文核验**：10轮拆远1～8近9～10、历史省40%～70%、总输入省10%、计算省约19%的方案和数字仅见项目说明，本技术评审全文未给该方案或评测；0.9平方得到0.81只是理论比例，不能当端到端实测提速19%。（来源：`/Users/bytedance/Desktop/3.23/AGENTS.md:71-73`；核对：`chapters/C/raw/context-tech-review.txt:1-2134`）
- **F127｜速度与成本｜2026-05-15补充历史测试**：PE1/PE2/PE3 token总计分别13224402/5332544/7172255，按planner-0407.xlsx整表累加且单行多ChatModel先求和，不能当单次SP/UP长度。（来源：`chapters/D/raw/pe-perf-tokens.txt:80-119`）
- **B100｜速度与成本｜11/3 文字记录：测量口径有争议**：去除 talk_or_not 输出字段后报告 P50 1.6→1.53 秒、只降 70ms，会上对是首 token、首中文及是否包含前链路存在争议，不能按省 6–8 token 理论推断实际降 200ms。（来源：`v-lesson-20261105/memory/meeting-1103-transcript.md:46-226；00:02:01–00:05:26`）
- **B101｜速度与成本｜11/3 文字记录：能力边界实验**：能力边界三分类用 Jev 超过 2000 token 输入时报告 P50 约 800ms，拟将提示词压至约 500 token 以争取首 token 300ms，后者是预期而非已测结果。（来源：`v-lesson-20261105/memory/meeting-1103-transcript.md:261-263；00:07:45`）
- **F137｜速度与成本｜字符非token**：63714是JSON解码后字符长度而非token数，未指定tokenizer不能据此确认SP30–35K或UP10–15K。（来源：`/Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/sp.md:JSON.content全文字符统计；对照/Users/bytedance/Desktop/3.23/AGENTS.md:41-49`）
- **F138｜速度与成本｜2026-10-21技术方案口径**：PE Planner当前输入约4万token、SFT约1.5万token是方案总输入量，未拆SP/UP，不能替代项目说明的固定分项数字。（来源：`chapters/D/raw/load-balance.txt:6-25`）
- **B125｜速度与成本｜二手补丁争议；10/8–13**：家/公司地址同步曾按效果与 SP token 增量评估静态示例，后续认为补丁占了很多 token，最终改为记忆工具识别二次确认再下发，说明加背景有成本且不能替代下游闭环。（来源：`v-lesson-20261107/notes-chat.md:157-160`；消息定位：原笔记仅部分ID：58b4abfa、c17cebb3、bc2472a1；本轮未重取群消息原文）
- **B130｜速度与成本｜二手前置覆盖取舍；10/9**：能力边界前置若内置全部能力描述会增加 token 与时延，当时临时只保留车控内容，以覆盖范围换速度。（来源：`v-lesson-20261107/notes-chat.md:173`；消息定位：原笔记仅部分ID：9dc0a007；本轮未重取群消息原文）
- **A168｜速度与成本｜探索取舍**：子Agent若要先完整生成出行总结再由Planner总结，探索文档指出等待时长很长，但没有给token规模与延迟数值。（来源：`chapters/C/raw/planner-explore.txt:1116-1126`）
- **A170｜速度与成本｜规模核验边界**：Planner探索全文没有SP30K～35K/UP10K～15K、69示例、KV Cache、远区1～8轮近区9～10轮或40%～70%节省数据，不能用此原文验证项目说明这些数字。（来源：`chapters/C/raw/planner-explore.txt:1-1701`）
- **F141｜速度与成本｜研究判断需观测验证**：按项目说明的前缀复用前提，动态字段提前可能缩短相同前缀，但其影响需结合实际模型路由/缓存命中token验证，不能只由SP和UP角色名称判断缓存收益。（来源：`chapters/C/raw/planner-onepage.txt:110-120；对照/Users/bytedance/Desktop/3.23/AGENTS.md:64-69,chapters/D/raw/load-balance.txt:13-25`）
- **B144｜速度与成本｜二手评审取舍；10/27 M11 00:10:20**：能力边界前置因速度影响更大而决定暂不上，此结论是后于9月性能试验的产品取舍。（来源：`v-lesson-20261107/notes-meetings.md:244`；会议链接及时间见该笔记第1节；原始临时逐字稿目录本轮不存在，保留二手证据层）
- **A180｜速度与成本｜优化方向**：10/22宣讲说正在通过SP精简等方式提升模型推理速度，没有给SP输入总token或精简百分比。（来源：`v-lesson-20261105/director-talk.md:106-107`；文字记录00:16:31）

## 七、隐私、风险上下文与过滤（41 条）

- **B020｜隐私与风险｜记忆写入边界**：基础信息记忆只记录客观事实，不确定信息须用户确认，纠正信息覆盖旧记录，偏好技能由另一工具处理。（来源：`chapters/C/raw/dyn-example-bug.txt:124-135`）
- **F023｜隐私与风险｜历史设计**：多人场景过滤非共同长期记忆以避免隐私泄露，并减少噪声。（来源：`chapters/C/raw/public-context-prd.txt:279-280`）
- **F029｜隐私与风险｜身份一致性设计**：舱内情景的乘客列表必须与FaceID对齐，以FaceID为准过滤多出人物，动态查询结果暂不注入通用舱内描述。（来源：`chapters/C/raw/sls-context.txt:185-189`）
- **F044｜隐私与风险｜设计风险**：向量匹配准确率及可解释性较弱，知识召回后仍需过滤，检索命中不等于Planner能正确利用。（来源：`chapters/C/raw/knowledge-status.txt:539-541`）
- **F054｜隐私与风险｜2026-09-07技术分支**：风控事实存在planner_histories.debug_info，轮次终态存在chat_histories.finish_type，MainFlow预置共享状态后afterFlow同步写Redis/MySQL。（来源：`chapters/C/raw/risk-history.txt:9-25,35-45`）
- **F055｜隐私与风险｜技术方案**：任意chunk的finish_reason=content_filter都会记录，只有首包正文非JSON才随机替换6条合法安全兜底JSON之一，避免覆盖合法输出。（来源：`chapters/C/raw/risk-history.txt:29-34`）
- **F057｜隐私与风险｜已知未覆盖分支**：风控过滤放buildHistoryMessages内，当前版本暂未覆盖其失败后的降级构造路径。（来源：`chapters/C/raw/risk-history.txt:90-95`）
- **F059｜隐私与风险｜修正建议未证实合入**：建议区分缓存异常与正常空结果、初始记录用未完成态、双存储终态加一致性日志并评估脏数据回填。（来源：`chapters/C/raw/risk-history.txt:144-148,180-182`）
- **F061｜隐私与风险｜PPE自测**：ppe_dt_filter自测先输入敏感问题后问天气，称上一句未进历史且有安全TTS，但不代表全部降级风险已修复或生产上线。（来源：`chapters/C/raw/risk-history.txt:183-248`）
- **B043｜隐私与风险｜提示词规则**：当别人查询指定人的历史行为与行程时应保护隐私，查询说话人自己的记忆或同车人的共同记忆可被允许。（来源：`chapters/C/raw/dyn-knowledge-prd.txt:1189-1192`）
- **B045｜隐私与风险｜提示词规则**：新任务地址和收货人等关键参数不得静默沿用历史，除非用户明确说和上次一样；GUI 根据实际页面处理默认值。（来源：`chapters/C/raw/dyn-knowledge-prd.txt:538`）
- **A014｜隐私与风险｜开发中**：多人场景不同语义记忆的隔离策略最新期仍为 DOING，排期列 10/22～10/26 开发，不能由计划结束推成全面上线。（来源：`chapters/C/raw/car-weekly.txt:452-456`）
- **A023｜隐私与风险｜DOING**：新用户上车后过滤对话敏感信息的隐私隔离方案 10/21 评审、10/21～10/24 开发，最新期仍为 DOING，收益写满足上汽合规。（来源：`chapters/C/raw/car-weekly.txt:498-504`）
- **A029｜隐私与风险｜DONE（周报）**：云端舱内视频和图像属于敏感个人信息，方案要求加密存储并及时删除，舱内图片有效期不超过 T+1 的改造最新期标 DONE。（来源：`chapters/C/raw/car-weekly.txt:573-578`）
- **A036｜隐私与风险｜已发版（周报）**：模型命中风控后输出不遵循 SP、没有 TTS 且会干扰后续轮次，风控标记与历史过滤方案 9/15 发版。（来源：`chapters/C/raw/car-weekly.txt:4113-4117`）
- **A046｜隐私与风险｜分层上线**：情景记忆隐私隔离 9/14 上线，短期记忆打标及隔离 9/22 上线，但后续语义记忆与呈现隔离仍继续开发。（来源：`chapters/C/raw/car-weekly.txt:5441-5454；4152-4167`）
- **A069｜隐私与风险｜已发版（周报）**：6/26 发版的 SP 加固支持变量注入或尾部追加防护，以防用户构造请求窃取提示词，覆盖用户能看到输出的模型。（来源：`chapters/C/raw/car-weekly.txt:12528-12536`）
- **F069｜隐私与风险｜事件身份绑定设计**：事件服务按event_time查当时user_in_car而非读取现在在场人，未登录account时没有这项身份数据。（来源：`chapters/C/raw/event-iter-tech.txt:152-155`）
- **F073｜隐私与风险｜治理要求待定非上线证明**：事件定义需分别明确进Context、触发主动响应、进记忆三种用途，人人对话及视觉描述仍需授权、脱敏、白名单和保留周期策略。（来源：`chapters/C/raw/endstate-event-onepage.txt:74-84,166-170`）
- **F077｜隐私与风险｜v2级联设计**：上汽车门打开时可清理对应位置FaceID端状态，以避免上一位乘客身份沿用；此为级联举例，非所有车型规则。（来源：`chapters/C/raw/endstate-query-tech.txt:80-83`）
- **F102｜隐私与风险｜记忆开关规则**：记忆关闭时停止记录生成、已有内容保留但冻结不召回，包含对话摘要；当前5轮普通历史仍可用于回答刚刚说过的信息。（来源：`chapters/C/raw/memory-prd.txt:410-424`）
- **F103｜隐私与风险｜除痕接口设计**：一键除痕通过新chat_id清空Director历史与对话摘要，清普通历史、清摘要及删除长期记忆是不同接口和范围。（来源：`chapters/C/raw/memory-prd.txt:634-658`）
- **F106｜隐私与风险｜未来方案边界**：情感显著性与共鸣排序、敏感标签过滤列未来迭代，不能把完整情感公式当当前Context必有环节。（来源：`chapters/C/raw/memory-prd.txt:695-751`）
- **B053｜隐私与风险｜9/15 发版记录**：模型命中风控后置处理于 9/15 发版，处理不遵循 SP、没有 TTS 回复及污染后续历史的问题。（来源：`chapters/C/raw/h2-biweekly.txt:2850-2858`）
- **B059｜隐私与风险｜10/20–11/02 DOING**：新用户上车过滤对话敏感信息的历史压缩隐私隔离在 10/21 评审、10/21–24 开发，收益为满足上汽合规，此周期仍非 DONE。（来源：`chapters/C/raw/h2-biweekly.txt:525-531`）
- **B069｜隐私与风险｜9/14 已上线**：多人情景记忆隔离在 9/14 上线，而语义记忆隔离当时仍调优及待测试，两类记忆不能共用一个“已支持隔离”结论。（来源：`chapters/C/raw/h2-biweekly.txt:2898-2914`）
- **B070｜隐私与风险｜10/20–11/02 DOING**：语义记忆隔离较新周期继续登记 10/22–26 开发支持，说明情景隔离已上线不代表全部语义召回已验收。（来源：`chapters/C/raw/h2-biweekly.txt:479-483`）
- **B089｜隐私与风险｜10/20–11/02 DONE**：云端舱内图片按敏感个人信息加密并在目的完成后及时删除，新增有效期不超过 T+1 的能力列 DONE。（来源：`chapters/C/raw/h2-biweekly.txt:602-608`）
- **B094｜隐私与风险｜9/15 已上线**：车端会话按 vehicle_id 与豆包手机主会话隔离，避免跨端上下文互相影响或打断。（来源：`chapters/C/raw/h2-biweekly.txt:2766-2773`）
- **A097｜隐私与风险｜历史职责边界**：通用记忆模块的权限查询定制由业务调用方自行管理，核心记忆模块不代为实现全部隐私隔离。（来源：`chapters/C/raw/context-tech-review.txt:706-715`）
- **A107｜隐私与风险｜机制风险定义**：错误幻觉进入上下文会污染后续推理，被技术评审定义为上下文中毒，不能把该定义写成某个已发生具体事故。（来源：`chapters/C/raw/context-tech-review.txt:1993-1994`）
- **A108｜隐私与风险｜机制风险定义**：信息量过大使模型偏离核心任务、无关背景影响响应、互相矛盾背景扰乱决策分别被定义为上下文分心、混淆与冲突。（来源：`chapters/C/raw/context-tech-review.txt:1995-1997`）
- **A111｜隐私与风险｜边界澄清**：四期所谓“隔离”指每次 Query 的 Context 结果不共享，不足以证明跨乘客、账号、隐私级别的记忆隔离天然已经完成。（来源：`chapters/C/raw/context-tech-review.txt:2001-2002；706-715`）
- **F124｜隐私与风险｜会议最终倾向与中途意见区分**：关闭记忆仍记地址曾在会上被提出，后于01:35:46明确回到统一需先开记忆开关，不能摘中途建议当结论。（来源：`v-lesson-20261105/memory/meeting-1104-transcript.md:421-442,501-507；01:21:18-01:35:46`）
- **A149｜隐私与风险｜高阶评测维度**：超长对话后人格稳定、信息不足时最少必要澄清、工具和记忆边界自知、记忆自然使用及避免滥用隐私都是评测维度而非已证明达成的指标。（来源：`chapters/C/raw/director-prd.txt:1078-1107；1184-1234`）
- **F135｜隐私与风险｜快照授权和能力界限**：快照记忆工具限注册用户，视觉工具不具备屏幕理解及联网能力，隐私策略允许自己的记忆与同车共同记忆但保护他人历史行程。（来源：`/Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/sp.md:content逻辑行117-135,215-220,1965-1967`）
- **B117｜隐私与风险｜二手群聊决策；9/21**：非 IP 方案当时只允许客户用 query 或语义标签检索记忆而不做数据库同步，后续如有数据同步项目须另按版本和合规边界判断。（来源：`v-lesson-20261107/notes-chat.md:132`；消息定位：原笔记仅部分ID：fc4eec78、f12bffd3；本轮未重取群消息原文）
- **B136｜隐私与风险｜二手讨论；8/18、9/1**：人人对话接入依赖离线 ASR且有隐私和无意插话风险，9/1仍未想好具体用法，不能把后来全部人机历史方案倒推为当时已完成。（来源：`v-lesson-20261107/notes-meetings.md:186-191`；会议链接及时间见该笔记第1节；原始临时逐字稿目录本轮不存在，保留二手证据层）
- **B140｜隐私与风险｜二手身份接入讨论；10/21 M29 00:52:57–56:06**：东风多人上车若不说话拿不到声纹而查不到记忆，拟给查询加 UserID 并支持手机验证，此时属于方案讨论。（来源：`v-lesson-20261107/notes-meetings.md:199`；会议链接及时间见该笔记第1节；原始临时逐字稿目录本轮不存在，保留二手证据层）
- **B145｜隐私与风险｜二手会议现状；9/15 M8 00:18:29**：对话摘要压缩历史几十轮时发现隐私问题并拟周五内审，长期情景隔离已开发不能替代摘要隐私隔离。（来源：`v-lesson-20261107/notes-meetings.md:180`；会议链接及时间见该笔记第1节；原始临时逐字稿目录本轮不存在，保留二手证据层）
- **A178｜隐私与风险｜工程要求**：风控命中内容不应进入上下文，因为可能污染格式并使后续Director输出不遵循既定格式；逐字稿本身未说明具体过滤代码或已完成日期。（来源：`v-lesson-20261105/director-talk.md:226-227`；文字记录00:36:39）

## 八、Context 的历史演进（17 条）

- **F002｜演进｜历史线上问题**：V1由写入、各源并行粗筛、统一精筛组成，统一模型为提速最多输出5项，存在靠前优先及各源效果相互挤占。（来源：`chapters/C/raw/context-onepage.txt:78-100`）
- **F008｜演进｜职责表述差异**：OnePage总述把标准化存储维护查询列为公共服务能力，但V2职责写各源自治，需与技术评审的主模块不存储原则分层理解。（来源：`chapters/C/raw/context-onepage.txt:5-7,103`）
- **F009｜演进｜2026-05-02技术方案**：Context优化v1.0针对端状态和世界信息，采用端状态自筛选与原有精筛并行再合并，尚不是V2取消统一精筛。（来源：`chapters/C/raw/context-opt-v1.txt:50-85`）
- **F019｜演进｜2025-10-29 AI car 1.0历史设计**：公共Context最早承担公共信息结构化维护存储及压缩、打标分类、提前过滤，以服务不同Agent并减少噪声和token。（来源：`chapters/C/raw/public-context-prd.txt:5-9`）
- **F024｜演进｜2026-07-03初稿含0707增补**：SLS-Context把端状态、记忆、世界信息、情景、事件组织给DT，端状态及记忆注明与DNA保持一致，不能据此证明所有车型线上完全相同。（来源：`chapters/C/raw/sls-context.txt:13-35,158-159`）
- **F047｜演进｜日期需区分**：知识与状态检索文件版本记录是2025-07-28 V0.1，而notes列2026-04-27编辑日期，两者分别是创建记录与后续编辑不能混作同一天。（来源：`chapters/C/raw/knowledge-status.txt:1-19`）
- **A013｜演进｜计划变化**：座椅能力动态化旧期计划 11/02 上线且被端侧配置上报 bug 阻塞，最新期改记 11/03 已上线。（来源：`chapters/C/raw/car-weekly.txt:2924-2927；407-413`）
- **A021｜演进｜排期变化**：端状态 2.0 的 M0.5 旧期开发窗口为 10/08～10/14、M1 为 10/15～10/30，后续改排 M0.5 至 10/16、M1 至 10/24 后继续联调，不能直接按旧期截止日判断交付。（来源：`chapters/C/raw/car-weekly.txt:4223-4236；475-489`）
- **A044｜演进｜ToB已上线（周报）**：上汽荣威名爵端状态方案上线后，原端状态筛选模型因三天无流量已下线，不能将所有渠道仍用同一筛选模型写成统一现状。（来源：`chapters/C/raw/car-weekly.txt:4782-4784`）
- **A081｜演进｜历史变更**：5/19 端状态更新去掉五一临时增加的未来天气预报、调整必返状态和拼接格式，显示世界信息范围会随版本收敛。（来源：`chapters/C/raw/car-weekly.txt:14460-14462`）
- **F082｜演进｜端状态2.0管理设计**：信号管理从多渠道Excel和脚本入代码转向统一元数据中心、项目字段差异配置及发布单管理，服务只接v2、旧协议由aidv适配。（来源：`chapters/C/raw/endstate2-signal.txt:1-21`）
- **A095｜演进｜多期历史技术设计**：技术评审最初长期记忆生成只按单 UID 提取文本偏好，短期记忆与背景信息等分期补齐，不可将开篇 doing/规划中等同后续全部版本状态。（来源：`chapters/C/raw/context-tech-review.txt:22-98`）
- **A124｜演进｜五期后续方向**：将预注入方式迁移端状态以及在Context内设计预注入模块，以确认记忆收益后再推进为条件，不能倒写为该期已全量迁移。（来源：`chapters/C/raw/context-tech-review.txt:2130-2132`）
- **B107｜演进｜11/3 文字记录：早期版与新版分开**：情境早期版本被描述为基本只看 30 分钟且本周开发，新版本内部尚未对齐，应区分开发中的旧简版与正在讨论的新方案。（来源：`v-lesson-20261105/memory/meeting-1103-transcript.md:1101-1183；00:35:05–00:36:27`）
- **B113｜演进｜二手群聊决策；8/14、9/8**：SLS Advisor 对接提出请求时刻前 5–10 分钟至多 100 条事件日志并取消瞬时记忆，9/8 再称改为事件，须与 Planner 独立历史窗口分开记录。（来源：`v-lesson-20261107/notes-chat.md:125`；消息定位：om_x100b68dd6efda0a0c253d3fd11cd612；om_x100b66c81b20a4a0c07b8451a664ae8；本轮未重取群消息原文）
- **A152｜演进｜探索方案**：早期座舱Planner探索采用句法RAG、情景RAG、简单/复杂Planner与下游Agent的漏斗架构，情景RAG负责将记忆、情境与环境知识注入规划。（来源：`chapters/C/raw/planner-explore.txt:13-27`）
- **A153｜演进｜年代边界**：Planner探索正文含2025年11月25日提示词参考、250905/250910排期以及12/18切Seed1.8的历史计划，后续文件编辑时间不能直接当各段方案形成或上线日期。（来源：`chapters/C/raw/planner-explore.txt:58-59；521-522；1231-1237；1311-1315`）

## 九、真实 badcase 与排查证据（34 条）

- **B017｜真实问题与排查｜设计准则**：需要推理分析的找歌问题超出音乐搜索工具能力，Planner 应先完成推理再将可检索名称交给工具。（来源：`chapters/C/raw/dyn-example-bug.txt:98-103`）
- **B027｜真实问题与排查｜9/3 文字记录真实问题**：上汽低配车型没有座椅按摩，车书按车型配置回答正确，但动态示例仍含按摩信息，二者冲突导致模型答错。（来源：`chapters/C/raw/meeting-0903-dyn.txt:43-44；00:02:22`）
- **F032｜真实问题与排查｜原文自相矛盾**：SLS事件流称倒序但列表示例按9分28秒前到2秒前排列且出现97号，和暂定最多30条不一致，不能把示例当精确格式。（来源：`chapters/C/raw/sls-context.txt:264-280`）
- **F058｜真实问题与排查｜已观察badcase**：202609061616408D45EB1BECA1A5425319中Redis正确过滤拒识历史后为空被当错误而查MySQL，库内旧记录仍成功，敏感旧输入重新进入Planner。（来源：`chapters/C/raw/risk-history.txt:136-143`）
- **B042｜真实问题与排查｜原文内部冲突**：“去医院”知识检索示例返回 DRV-01-01-05，但同文件索引将该 ID 对应送小孩上学，送医院对应 DRV-01-01-08，属于示例与目录不一致而非已发生线上事故。（来源：`chapters/C/raw/dyn-knowledge-prd.txt:105-107,181-184`）
- **B048｜真实问题与排查｜原文内部冲突**：导航示例把路线规划和目的地附近搜索并行并称沿途搜索，但同文件工具 tips 要求沿途搜先有导航；示例不是当前沿途检索规则的可靠执行模板。（来源：`chapters/C/raw/dyn-knowledge-prd.txt:546-610,1105-1111`）
- **B049｜真实问题与排查｜原文内部冲突**：火锅示例在问“要现在导航吗”的同一轮已调用路线规划，与文末“避免询问但未获答就执行”的规则冲突。（来源：`chapters/C/raw/dyn-knowledge-prd.txt:749-762,1222-1224`）
- **A034｜真实问题与排查｜已修正上线（周报）**：模型无限自我否定会导致当前轮无 TTS 并干扰后续轮次，历史上下文输入优化按周报于 10/15 发版。（来源：`chapters/C/raw/car-weekly.txt:2912-2916`）
- **F070｜真实问题与排查｜示例中的事实边界**：灯光指令事件同时出现话术已做好和tool_result未响应，说明自然语言答复不能替代工具真实执行结果；原文仅格式示例不能称真实事故。（来源：`chapters/C/raw/event-iter-tech.txt:69-85`）
- **F084｜真实问题与排查｜技术方案内部冲突**：总目标写自动IDL校验/Git提交/Overpass打包验证，详细6.3又明确Overpass自动流程本期不做，接口节仍展示自动阶段，需按范围澄清。（来源：`chapters/C/raw/endstate2-signal.txt:14,68-72,1077-1127`）
- **F086｜真实问题与排查｜技术方案内部格式不一致**：应用列表示例同时使用map定义、array子树及最终map<string,AppInfo> IDL，生成规则需以实际发布版本核对，不宜在C章展开未定字段细节。（来源：`chapters/C/raw/endstate2-signal.txt:472-617`）
- **F105｜真实问题与排查｜历史问题总结**：旧记忆更新延迟导致超历史轮数后失忆、纯表层向量/关键词造成过漏召，已有豆包通话会突然提多天前无关话题的问题。（来源：`chapters/C/raw/memory-prd.txt:157-182`）
- **B080｜真实问题与排查｜8 月算法验证**：历史对话与端状态冲突时模型过度遵循旧历史，RL 实验 reward 从 PE 0.5912 到 RL 0.8061，提升 0.2149；该数是专项 reward 而非上下文整体准确率。（来源：`chapters/C/raw/h2-biweekly.txt:6571-6577`）
- **B092｜真实问题与排查｜8/24–9/4 现状**：记忆开关等操作未进入 Director 感知导致回答错误，修复方向是增加相应事件产出和上下文注入。（来源：`chapters/C/raw/h2-biweekly.txt:4227-4233`）
- **F114｜真实问题与排查｜样本一致性风险**：部分情景先称主驾独自一人又描述后排乘客，且视觉文案含汽油气味等非图像直接可见信息，使用时要区分描述设想和可核验感知事实。（来源：`chapters/C/raw/scene-desc.txt:27-37,63-73,123-133,219-229`）
- **A116｜真实问题与排查｜五期问题观察**：记忆只依赖向量检索时，查询某一类别需要多次检索且仍不能保证拿全，是五期改造的已发现问题而非某次用户实车逐案。（来源：`chapters/C/raw/context-tech-review.txt:2094-2097`）
- **A117｜真实问题与排查｜五期问题观察**：精筛为控制耗时只输出5条数据，可能把本来相关的记忆错误筛掉，是五期提出的召回缺口。（来源：`chapters/C/raw/context-tech-review.txt:2098-2098`）
- **F121｜真实问题与排查｜会议现状反馈**：询问衣着或副驾是谁时Planner仍调VQA而不使用已有描述或FaceID，VQA本身不提供真实身份，根因可能提示词结构未认识持续视觉或长SP注意不足。（来源：`v-lesson-20261105/memory/meeting-1104-transcript.md:166-192；00:26:29-00:32:24`）
- **F125｜真实问题与排查｜设计风险非事故**：只存POI名称可能在跨城被同名地点带偏，会上讨论存城市/精准名或POIID并让下游确认唯一性，尚无统一已落地结论。（来源：`v-lesson-20261105/memory/meeting-1104-transcript.md:301-332；00:57:03-01:03:30`）
- **B102｜真实问题与排查｜11/3 文字记录：后视镜真实体验**：已加入动态 knowhow 的典型后视镜指令在独立分支反复体验较稳，但语义近似且措辞变化时效果差，会上将问题定位为前置动态示例未召回。（来源：`v-lesson-20261105/memory/meeting-1103-transcript.md:336-393；00:10:29–00:13:02`）
- **F136｜真实问题与排查｜快照自身内容风险**：基础QA有相同Momenta答案连续3条、开门说明连续3条，且一处说方向盘支持加热而另一份低配可能无此能力，需按车型配置核对而非把快照当普适配置。（来源：`/Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/sp.md:content逻辑行1886-1888,2055-2064`）
- **B111｜真实问题与排查｜二手真实问题；10/15**：相同 query 仍在上下文窗口时不再调用车书工具，只有 TTS 而无屏显，是历史影响工具是否重调的实际问题。（来源：`v-lesson-20261107/notes-chat.md:128`；消息定位：om_x100b6232a9d0e4b4de8a3a2e12afaa8；本轮未重取群消息原文）
- **B112｜真实问题与排查｜二手真实问题；9/3 11:43–12:00**：问第一次见面日期时第一轮前置召回了大量短期和长期情景且带出无关人物，已有记忆并无明确日期，属于过召噪声而非没有做前置检索。（来源：`v-lesson-20261107/notes-chat.md:127`；消息定位：om_x100b66bab6fe78bcb4b85ff90a6f057；本轮未重取群消息原文）
- **B120｜真实问题与排查｜二手 QA 周报；11/6**：注册 FaceID 次日不认识、改名后查历史错、已有明确风量偏好却反向调节，都表明身份或偏好进入决策链仍有实际故障，原笔记未给逐个根因日志。（来源：`v-lesson-20261107/notes-chat.md:134`；消息定位：om_x100b61ebe2a71ca4cfe74749f7c4422；本轮未重取群消息原文）
- **A165｜真实问题与排查｜探索模型观察**：仅靠SP调用强基模时仍见不调Agent、指令跟随不稳、严格示例输出随机、长上下文抓不到挂起/失败任务与轮次增加后错误增多。（来源：`chapters/C/raw/planner-explore.txt:715-725`）
- **A166｜真实问题与排查｜探索模型观察**：回复总结出现幻觉和任务拆解每次不同是探索阶段模型观察，原文未提供具体用户逐案、错误率或确定由长度导致的因果实验。（来源：`chapters/C/raw/planner-explore.txt:725-728`）
- **B131｜真实问题与排查｜二手机制解释；8/13 M14 00:15:01–18:17**：路测用半小时前途经点回答，郝晓伟说来源可能是历史对话也可能是塞进 SP 的摘要，所以“删除的途经点被摘要带回”只是风险解释而非已确定根因。（来源：`v-lesson-20261107/notes-meetings.md:178`；会议链接及时间见该笔记第1节；原始临时逐字稿目录本轮不存在，保留二手证据层）【后续已在I章找到原始逐字稿补证，优先读B146–B148；该条保留旧取证层级用于追溯。】
- **B141｜真实问题与排查｜二手真实问题；9/23 M24 00:05:08**：用户选第二个 POI 又被送回记忆工具，是多轮继承“找到多个结果需确认第几个”的反馈造成循环。（来源：`v-lesson-20261107/notes-meetings.md:214`；会议链接及时间见该笔记第1节；原始临时逐字稿目录本轮不存在，保留二手证据层）
- **B142｜真实问题与排查｜二手真实问题；9/23 M24 00:00:29–01:23**：把所有设家请求都路由记忆工具后，记忆开关关闭会使“设置一下我的家”也报记忆工具关闭，背景/开关边界影响实际工具流程。（来源：`v-lesson-20261107/notes-meetings.md:212`；会议链接及时间见该笔记第1节；原始临时逐字稿目录本轮不存在，保留二手证据层）
- **B146｜真实问题与排查｜8/13 原始逐字稿补证**：半小时前途经点问题已由原始记录确认，体验方明确路测全程纯语音，历史过长与摘要残留仍是推测，会上要求拿日志而未确定唯一根因。（来源：`chapters/I/raw/m0813.txt:97-116`，00:15:01–00:19:12；升级 B131 的二手证据）
- **B147｜真实问题与排查｜8/13 原始逐字稿补证**：水果店在最近五轮仍是选了多家却未下一步操作的状态，会上同时看到路线问询工具参数为“多久”而反馈却为“更新路线成功”，不能把导航误操作全归因上下文。（来源：`chapters/I/raw/m0813.txt:148-179`，00:24:08–00:27:05；升级 B132 并补下游责任）
- **B148｜真实问题与排查｜8/13 原始逐字稿**：用户只是问从当前地点到辰山植物园多久，后续查看时已变途经点，原始讨论要求检查算路与更新路线工具边界及用户确认，尚未定位为单一模型错误。（来源：`chapters/I/raw/m0813.txt:127-185`，00:20:51–00:27:56）
- **A179｜真实问题与排查｜当时模型问题**：复杂计算时模型可能不断否定自己的答案直到超过输出token上限并破坏格式，需要工程兜底，但宣讲未给具体token上限数字。（来源：`v-lesson-20261105/director-talk.md:231-232`；文字记录00:37:14）
- **A185｜真实问题与排查｜早期真实现象**：宣讲回顾工具出错后Director会一直道歉或一直重试，故需单独评测工具错误应答满意率；未给逐案Query、重试上限或最终修复验收。（来源：`v-lesson-20261105/director-talk.md:246-247`；文字记录00:40:09）

## 十、车型与渠道差异（24 条）

- **B005｜车型差异｜技术方案**：动态示例有 env 的 prod/ppe 环境隔离与 channel 渠道参数，非生产检索会合并 prod 和当前环境数据。（来源：`chapters/C/raw/dyn-example-onepage.txt:19`）
- **B028｜车型差异｜9/3 会议方案**：动态示例车型隔离倾向在同一库增加字段并在检索时匹配 ALL 或当前车型，而非每种组合拆一个库。（来源：`chapters/C/raw/meeting-0903-dyn.txt:85-101；00:04:49–00:06:01`）
- **B029｜车型差异｜9/3 已有能力**：当时动态示例管理后台已按主线、上汽、赛力斯三个渠道和环境维护，车型车系及舱内外隔离还未开发。（来源：`chapters/C/raw/meeting-0903-dyn.txt:217-242,343-356；00:10:31、00:19:13–00:19:38`）
- **F030｜车型差异｜2026-07方案快照**：上汽status示例仅主驾坐着小明，赛力斯status包括FaceID人物及位置/性别/年龄/造型/动态、物品动物、不安全因素、整体描述。（来源：`chapters/C/raw/sls-context.txt:239-256`）
- **F043｜车型差异｜暂定隔离设计**：AI汽车RAG数据暂按渠道、车型、模型隔离；复用未学过参考知识的SFT模型可能需要重构训练数据。（来源：`chapters/C/raw/knowledge-status.txt:537-541`）
- **F050｜车型差异｜车书检索过滤规则**：先按渠道+租户或单车过滤，车型/版本存在差异再加vehicle_type，防止取到别款车辆知识。（来源：`chapters/C/raw/manual-qa-tech.txt:264-270`）
- **A012｜车型差异｜已上线（周报）**：上汽 DT 主 SP 固定的座椅能力边界造成配置不适配，按车型动态注入改造于 11/03 上线。（来源：`chapters/C/raw/car-weekly.txt:407-413`）
- **A015｜车型差异｜DONE（周报）**：东风接入记忆在最新期标为 DONE，记录 10/12～10/13 开发联调和 10/16～10/20 测试验证。（来源：`chapters/C/raw/car-weekly.txt:457-462`）
- **A020｜车型差异｜待排期**：端状态 2.0 的 M3 赛力斯落地及 IP 线客户端 Frontier 打通时间待定，11/30 只是整体落地预计。（来源：`chapters/C/raw/car-weekly.txt:488-489`）
- **A041｜车型差异｜已上线（周报）**：车书按选配信息针对性回答的端云上报链路于 9/18 上线，解决此前车书无法按客户选配回答的问题。（来源：`chapters/C/raw/car-weekly.txt:4461-4467`）
- **A057｜车型差异｜车型方案限制**：上汽低配车没有后周视摄像头而只有有畸变的后环视摄像头，因此只开放前方视觉识别，8/28 上线。（来源：`chapters/C/raw/car-weekly.txt:7012-7019`）
- **A058｜车型差异｜已上线（周报）**：上汽车书增加说话人音区字段于 8/14 上线，目标是按用户位置给出针对性回答。（来源：`chapters/C/raw/car-weekly.txt:7042-7046`）
- **F083｜车型差异｜v2管理设计**：同一信号可按项目只开放部分座位或一级字段，发布单草稿和已生效基线隔离，通过版本及操作人追溯。（来源：`chapters/C/raw/endstate2-signal.txt:9-18,52-66,821-879`）
- **F104｜车型差异｜SLS共享乘客定义**：赛力斯共享乘客在人脸跨账号认识与共享乘客账号同步生成记忆两个维度有不同含义，不能直接推断所有在场记忆可被所有人看。（来源：`chapters/C/raw/memory-prd.txt:687-692`）
- **B055｜车型差异｜10/20–11/02 DOING**：上汽 DT 主 SP 固定座椅能力描述不适配部分配置，按车型动态化被端上配置上报 bug 阻塞，产品换判断逻辑后仍待复测，排期写 10/20 不等于已经交付。（来源：`chapters/C/raw/h2-biweekly.txt:447-453`）
- **B060｜车型差异｜10/20–11/02 DONE**：东风记忆接入在 10/12–13 开发联调、10/16–20 测试验证后标 DONE，不能将旧未接入状态沿用至该周期。（来源：`chapters/C/raw/h2-biweekly.txt:484-489`）
- **B084｜车型差异｜9 月 ToB 交付记录**：上汽奥迪、荣威、名爵端状态切 RAG 筛选后旧筛选模型三天无流量被下线，该 ToB 交付记录不能直接当作全部 AIDV Context 的统一架构。（来源：`chapters/C/raw/h2-biweekly.txt:3587-3591`）
- **B087｜车型差异｜8/28 已上线**：上汽低配车只有畸变后环视而无后周视摄像头，因而低配只开放前方视觉识别，该限制 8/28 上线。（来源：`chapters/C/raw/h2-biweekly.txt:4407-4415`）
- **B088｜车型差异｜赛力斯设计/测试状态**：赛力斯屏幕视觉依赖娱乐搭子开关，非该空间不支持，9 月周期因客户页面未完成而端到端测试阻塞。（来源：`chapters/C/raw/h2-biweekly.txt:3120-3128`）
- **A133｜车型差异｜PRD提示词分流**：上汽与赛力斯分别使用planner.task.analyze_text_saic_dna和planner.task.analyze_text_seres，且文中说明输入输出变动以提示词为准。（来源：`chapters/C/raw/director-prd.txt:174-176；1563-1565`）
- **B118｜车型差异｜二手身份限制；10/28**：东风声纹只有唤醒时刻身份，主驾唤醒后乘客直接问偏好时无法正确识别询问人，记忆召回体验因此受限。（来源：`v-lesson-20261107/notes-chat.md:133`；消息定位：om_x100b6122346e18b8de1bd3b4c2cd677；本轮未重取群消息原文）
- **B126｜车型差异｜二手群聊说明；10/7–8**：上汽地图已有家/公司地址时需要二次确认但 SLS 不需要，因此同一 Planner 地址流程不能不分项目复用。（来源：`v-lesson-20261107/notes-chat.md:156`；消息定位：原笔记未保留完整消息ID；本轮未重取群消息原文）
- **B135｜车型差异｜二手已确认结论；9/1 M3 02:54:33**：人人对话因敏感先在赛力斯实验，上汽暂不放主链路，这是当时项目范围而非永久产品限制。（来源：`v-lesson-20261107/notes-meetings.md:188`；会议链接及时间见该笔记第1节；原始临时逐字稿目录本轮不存在，保留二手证据层）
- **A183｜车型差异｜10/22项目边界**：工具搭载表当时仍是暂定、需按项目调整，已有项目不支持人脸识别，因此“身份感知”不能默认为每车型一定具备FaceID。（来源：`v-lesson-20261105/director-talk.md:301-317`；文字记录00:50:41～00:54:00）

## 十一、指标、观测与证据缺口（52 条）

- **F006｜指标与观测｜方案对比数字**：V2对比表P90为564ms，文中未标观测时间、环境、样本或是否包含网络，不能直接充当2026年11月线上数。（来源：`chapters/C/raw/context-onepage.txt:109-150`）
- **F011｜指标与观测｜实验开关**：vehicle_resource_params.skip_self_llm_filter默认false，可用于跳过自筛选实验。（来源：`chapters/C/raw/context-opt-v1.txt:61`）
- **F039｜指标与观测｜实现排查入口**：Prompt在Fornax维护，模型链路trace看Fornax、服务日志看Argos，历史需对照模型输出表与工具任务表。（来源：`chapters/C/raw/planner-onepage.txt:268,305-307`）
- **F060｜指标与观测｜建议观测**：需看content_filter数量、debug_info与终态3一致性、Redis空结果降级比、过滤后Messages污染、兜底JSON解析失败及空回复率。（来源：`chapters/C/raw/risk-history.txt:173-179`）
- **A001｜指标与观测｜周报观测**：20261102～20261113 期看板的 Context P50 为 275.3ms、P90 为 361.9ms，上期为 275.0/370.0ms，且原文提醒数据仍需人工复制计算环比。（来源：`chapters/C/raw/car-weekly.txt:10-72`）
- **A002｜指标与观测｜周报观测**：20261026～20261106 期与下一期列出的上下文及 Planner 指标完全相同，不能据此当作两个独立测量样本。（来源：`chapters/C/raw/car-weekly.txt:1281-1391`）
- **A003｜指标与观测｜周报观测**：20261102～20261113 期 Planner 首 Token P50/P90 为 1203.1/1413.8ms，首字为 1019.7/1186.7ms，单轮推理为 2141.9/2553.4ms，须与 Context 获取耗时分开。（来源：`chapters/C/raw/car-weekly.txt:76-120`）
- **A004｜指标与观测｜历史周报观测**：20260921～20260930 期 Context P90/P50 为 551/520ms，前期为 536/518ms。（来源：`chapters/C/raw/car-weekly.txt:3713-3777`）
- **A005｜指标与观测｜历史周报观测**：20260824～20260904 期 Context P90/P50 为 415/404ms，前期为 392/381ms。（来源：`chapters/C/raw/car-weekly.txt:6298-6360`）
- **A006｜指标与观测｜历史周报观测**：20260727～20260807 期 Context 本周/上周 Avg 为 516/466ms，P90 栏未填值。（来源：`chapters/C/raw/car-weekly.txt:8679-8740`）
- **A007｜指标与观测｜历史周报观测**：20260713～20260724 期 Context 本周/上周 Avg 为 462/374ms，P90 栏未填值。（来源：`chapters/C/raw/car-weekly.txt:10005-10058`）
- **A008｜指标与观测｜历史周报观测**：20260629～20260710 期 Context 本周 Avg/Max 为 47/139ms，前期为 144/777ms，原文未交代与后续 P50/P90 看板的采样范围差别。（来源：`chapters/C/raw/car-weekly.txt:11220-11268`）
- **A009｜指标与观测｜历史周报观测**：20260615～20260626 期 Context 本周 Avg/Max 为 134/777ms，前期为 106/712ms。（来源：`chapters/C/raw/car-weekly.txt:12297-12346`）
- **A032｜指标与观测｜建设中**：基于 Context 梳理依赖与降级已有 9/30 第一版，10/20 起优先处理进入 Planner 前模块的模型失效降级。（来源：`chapters/C/raw/car-weekly.txt:856-861`）
- **A033｜指标与观测｜部分交付**：Fornax Trace 双写 BMQ SDK 于 10/26 交付上线，结构化 Trace 到 Bytehouse 及 Grafana 基础查询于 10/30 交付，端云全链路 Trace 则仍建设中。（来源：`chapters/C/raw/car-weekly.txt:862-897`）
- **A052｜指标与观测｜已上线（周报）**：模拟器允许记忆用真实数据、世界信息用模拟数据的半模拟能力，8/28 开发、8/31 提测并记已上线，适合隔离数据源排查。（来源：`chapters/C/raw/car-weekly.txt:7225-7229`）
- **F080｜指标与观测｜v2建议监控**：端状态排查需看上报校验失败、缺失字段、乱序、无变化、缓存回源、过期信号、结构转换失败及订阅通知成功率和耗时。（来源：`chapters/C/raw/endstate-query-tech.txt:234-287`）
- **A087｜指标与观测｜冻结窗口周报**：10/18～10/25 期 Context P50/P90 为 273.2/358.9ms，前期为 274.3/367.4ms，分别环比 -0.4%/-2.3%。（来源：`chapters/C/raw/lat-1025.txt:37-49`）
- **A088｜指标与观测｜冻结窗口周报**：同窗口 Planner 首 Token P50/P90 为 1160.9/1374.3ms、首字为 980.1/1148.2ms、单轮推理为 2083.6/2500.0ms，不能将这些分段值相加就等同用户端到端等待。（来源：`chapters/C/raw/lat-1025.txt:53-97`；最后一项为指标使用边界判断）
- **A089｜指标与观测｜统计口径**：该周报覆盖 China-North，按 counter 对 pctXX 加权平均、10 分钟均值降采样，表格用冻结窗口而趋势图用实时滚动窗口，P90 不是对全量请求直接重算的同一分位数。（来源：`chapters/C/raw/lat-1025.txt:164-173`；末句为公式含义）
- **A090｜指标与观测｜窗口限定**：该期表格实际 UTC 起止为 2026-10-18T16:04:59Z～2026-10-25T16:04:59Z，标题日期不能代替实际冻结时间边界。（来源：`chapters/C/raw/lat-1025.txt:164-169`）
- **A091｜指标与观测｜冻结窗口周报**：10/25～11/01 期 Context P50/P90 为 272.8/366.3ms，前期为 273.8/359.5ms，分别环比 -0.4%/+1.9%。（来源：`chapters/C/raw/lat-1101.txt:37-49`）
- **A092｜指标与观测｜冻结窗口周报**：10/25～11/01 期 Planner 首 Token P50/P90 为 1130.8/1360.8ms、首字为 1012.0/1189.6ms、单轮推理为 2038.4/2479.1ms，延迟优化需分别观察 Context、首 Token、首字与整轮。（来源：`chapters/C/raw/lat-1101.txt:53-97`）
- **A093｜指标与观测｜统计口径**：10/25～11/01 期实际时间戳为 2026-10-25T16:01:53Z～2026-11-01T16:01:53Z，China-North 按 counter 加权 pctXX 并以 10 分钟均值降采样，冻结表与实时趋势因查询时刻不同可小幅不一致。（来源：`chapters/C/raw/lat-1101.txt:165-174`）
- **A094｜指标与观测｜跨报告差异**：10/25～11/01 报告的“上周”Context 为 273.8/359.5ms，而上一份 10/18～10/25 报告的“本周”为 273.2/358.9ms，两份冻结时刻相差约 3 分钟且为加权降采样结果，不能把微差当作架构效果冲突。（来源：`chapters/C/raw/lat-1101.txt:37-49`、`chapters/C/raw/lat-1101.txt:165-174`、`chapters/C/raw/lat-1025.txt:37-49`、`chapters/C/raw/lat-1025.txt:164-173`；微差解释为统计边界推断）
- **F087｜指标与观测｜证据缺口**：context-mgmt.txt为标题占位，无正文，不能作为功能、数字或上线证据。（来源：`chapters/C/raw/context-mgmt.txt:1-4`）
- **F088｜指标与观测｜证据缺口**：context-root-old.txt为标题占位，无正文，不能作为功能、数字或上线证据。（来源：`chapters/C/raw/context-root-old.txt:1-3`）
- **F089｜指标与观测｜证据缺口**：context-svc-mingjun.txt为标题占位，无正文，不能作为功能、数字或上线证据。（来源：`chapters/C/raw/context-svc-mingjun.txt:1-3`）
- **F090｜指标与观测｜证据缺口**：ctx-test-report.txt为标题占位，无正文，不能作为功能、数字或上线证据。（来源：`chapters/C/raw/ctx-test-report.txt:1-3`）
- **F091｜指标与观测｜证据缺口**：endstate-xiyue.txt为标题占位，无正文，不能作为功能、数字或上线证据。（来源：`chapters/C/raw/endstate-xiyue.txt:1-2`）
- **F092｜指标与观测｜证据缺口**：history-privacy.txt为权限错误1770032 forBidden，只有截断错误信息无原文，不能作为功能、数字或上线证据。（来源：`chapters/C/raw/history-privacy.txt:1-16`）
- **F093｜指标与观测｜证据缺口**：history-sim-wiki.txt为参数错误99992402 document_id长度校验失败，无原文；不能写成已确认无权限，不能作为功能、数字或上线证据。（来源：`chapters/C/raw/history-sim-wiki.txt:1-16`）
- **F094｜指标与观测｜证据缺口**：risk-ctx-prd-wiki.txt为参数错误99992402 document_id长度校验失败，无原文；不能写成已确认无权限，不能作为功能、数字或上线证据。（来源：`chapters/C/raw/risk-ctx-prd-wiki.txt:1-16`）
- **F095｜指标与观测｜证据缺口**：screen-context.txt为权限错误1770032 forBidden，只有截断错误信息无原文，不能作为功能、数字或上线证据。（来源：`chapters/C/raw/screen-context.txt:1-16`）
- **F096｜指标与观测｜证据缺口**：token-0901.txt为权限错误1770032 forBidden，只有截断错误信息无原文，不能作为功能、数字或上线证据。（来源：`chapters/C/raw/token-0901.txt:1-16`）
- **F097｜指标与观测｜证据缺口**：token-0901b.txt为权限错误1770032 forBidden，只有截断错误信息无原文，不能作为功能、数字或上线证据。（来源：`chapters/C/raw/token-0901b.txt:1-16`）
- **F110｜指标与观测｜2026-09-09历史测试**：记忆召回96.3%、情景召回90.79%、记忆提取91.29%、情景提取93.6%、标签95.7%、画像83.3%是不同环节指标，非Context整体准确率。（来源：`chapters/C/raw/memory-onepage.txt:389-419`）
- **B078｜指标与观测｜8/24–9/4 DONE**：模拟器已支持部分 Context 数据用真实源、其他用模拟源，例如真实记忆配模拟世界信息，便于隔离来源排查。（来源：`chapters/C/raw/h2-biweekly.txt:4604-4610`）
- **B079｜指标与观测｜10/13 已上线**：端状态同步给触发器增加旧值后，单信号变化场景及单信号生成事件可不再请求 Context，降低查询频率。（来源：`chapters/C/raw/h2-biweekly.txt:1991-2000`）
- **B081｜指标与观测｜10/16 评测发现**：DT 825 条评测中 43 条占 5.21% 是 SP、动态示例和评测标准未对齐，另 10 条占 1.2% 为能力边界需实车核实，不能全部算模型推理能力失败。（来源：`chapters/C/raw/h2-biweekly.txt:1523-1529`）
- **B083｜指标与观测｜拒识旁支实验**：语义情境 500 条实验原始 Context 84.0%（420/500）、改进 83.4%（417/500），虽登记开发上线但此评测没有显示准确率提升。（来源：`chapters/C/raw/h2-biweekly.txt:2633-2636`）
- **B086｜指标与观测｜8 月 ToB 自评**：RAG 端状态筛选加车书 PE 总结在荣威不同项目准确率分别为 98.9%、98.1%、97.8%、97.3%、98.5%、93.3%，不可当作主线 Context 统一准确率。（来源：`chapters/C/raw/h2-biweekly.txt:5554-5557`）
- **B097｜指标与观测｜10 月端侧旁支**：四合一 SP 输入超过端侧 Context Length 会崩溃，CL 从 2048 调到 4096 已提测；该上限属于离线 NLU 而不是云端 Planner。（来源：`chapters/C/raw/h2-biweekly.txt:1455-1459`）
- **A113｜指标与观测｜历史测试接口**：GET /aidv/v1/context/query供QA输入Query和vehicle_user_id查看具体检索信息，该原型Query长度上限128，与记忆底层接口512上限不属于同一接口。（来源：`chapters/C/raw/context-tech-review.txt:2026-2056`）
- **F117｜指标与观测｜会议口头观测非全面测量**：会上说摘要一次约1.7至1.8秒并纠正之前数据有误，第3轮开始压缩的缓冲设计要与实际完成时点核对。（来源：`v-lesson-20261105/memory/meeting-1104-transcript.md:66-67；00:09:02`）
- **F128｜指标与观测｜不同PPE版本测试**：PE1/PE2/PE3铺垫首包P50/P90为2309/3416、872/1307、1853/2496ms，样本197/197/227且环境不同，不能单凭表判断token减少是全部时延收益根因。（来源：`chapters/D/raw/pe-perf-tokens.txt:19-48`）
- **F129｜指标与观测｜历史测试口径**：Planner总耗时P50/P90为12231/24404、4755/13355、4301/14169ms，统计仅纳数值样本并剔除空值文本。（来源：`chapters/D/raw/pe-perf-tokens.txt:50-79,115-119`）
- **A148｜指标与观测｜验收目标**：PRD给Planner首Token性能目标P50小于500ms、P90小于800ms，这是目标而非实测，也不是Context获取耗时指标。（来源：`chapters/C/raw/director-prd.txt:920-922`）
- **F139｜指标与观测｜性能归因边界**：PE公共资源池共享负载会导致时延尖刺，SFT模型单元固定成本及扩容弹性不同，长输入或长对话不是慢的唯一原因。（来源：`chapters/D/raw/load-balance.txt:24-25,61-64`）
- **B119｜指标与观测｜二手 QA 周报；11/6**：赛力斯 Context 记忆通过率 90% 对目标 95%，端状态筛选通过率 90% 且存在多选无关和少选关键状态，不能用这两个数代替整套 Context 正确率。（来源：`v-lesson-20261107/notes-chat.md:134`；消息定位：om_x100b61ebe2a71ca4cfe74749f7c4422；本轮未重取群消息原文）
- **A169｜指标与观测｜探索评测维度**：环境信息识别满足率、记忆信息识别满足率与多轮夹杂拒识case被列为测试建设内容，但表内多项状态为暂无，不能当已有准确率。（来源：`chapters/C/raw/planner-explore.txt:1254-1262；1645-1665`）
- **A184｜指标与观测｜高阶评测要求**：背景或输入不足以直接出动作时，Director主动澄清是计划评测项，而记忆须结合当下情境自然使用、避免过度关联。（来源：`v-lesson-20261105/director-talk.md:281-287；56-57`；文字记录00:46:17～00:47:01、00:08:21）

## 十二、排期与现状（36 条）

- **B010｜排期与现状｜展望**：赛力斯动态知识扩充及模型自动总结用户个性化知识被列为展望，不能当作现有交付。（来源：`chapters/C/raw/dyn-example-onepage.txt:96-98`）
- **F007｜排期与现状｜长期规划**：新增profile、解决跨源冲突、推动结构化返回并废弃非结构化数据均列在长期规划中。（来源：`chapters/C/raw/context-onepage.txt:173-176`）
- **F013｜排期与现状｜开发估时非完成记录**：端状态自筛选估1人天、自然语言拼接0.5、世界信息0.5、头条热榜1，文中上线方案仅列QA/CR/接口上线步骤，无完成日期。（来源：`chapters/C/raw/context-opt-v1.txt:179-205`）
- **B024｜排期与现状｜评测阶段**：能力边界知识暂时硬编码在 map 以验证效果与性能，正式上线须产品化并统一由工具平台管理。（来源：`chapters/C/raw/capability-boundary.txt:50-65`）
- **B034｜排期与现状｜9/3 优先级**：量产前上汽动态示例车型车系隔离被定为最紧急 P0，检索逻辑、审批及批量导入导出为 P1/P2；会上未定明确上线日。（来源：`chapters/C/raw/meeting-0903-dyn.txt:364-398；00:19:58–00:21:39`）
- **F053｜排期与现状｜旧计划非通用兜底策略**：本次不处理图片、初筛前改写且不做下游兜底、拟禁用车书工具，5月7评审/8至9开发/11提测仅为排期，不能覆盖后续车型工具现状。（来源：`chapters/C/raw/manual-qa-tech.txt:312-342`）
- **A011｜排期与现状｜试接入中**：Seeduplex S2T 计划 11/04～11/13 试接主链路，Context 与端状态获取时机仍待同语音团队讨论。（来源：`chapters/C/raw/car-weekly.txt:320-328`）
- **A017｜排期与现状｜部分发版**：端状态 2.0 的 M0.5 后台版本已测试通过并于 11/03 发版。（来源：`chapters/C/raw/car-weekly.txt:475-482`）
- **A018｜排期与现状｜云端链路已通、实车联调计划**：端状态 2.0 的 M1 东风链路已打通，11/09 为实车联调计划，目标是经 Context 查询供 Planner 使用。（来源：`chapters/C/raw/car-weekly.txt:483-484`）
- **A019｜排期与现状｜开发中**：端状态 2.0 的 M2 在最新期开发中并计划 11/13 提测，要将触发器、Advisor 等下游依赖切新版协议、先落东风。（来源：`chapters/C/raw/car-weekly.txt:486-487`）
- **A024｜排期与现状｜讨论与开发中**：将赛力斯 App 数据同步车机记忆的方案计划 11/06～11/16 梳理并于 11/16 技术评审，尚非已可进入本轮上下文的数据源。（来源：`chapters/C/raw/car-weekly.txt:511-520`）
- **A025｜排期与现状｜DOING**：弋途查询历史压缩记忆的能力排期 11/06～11/07，目标满足 Advisor 获取上下文，最新期仍标 DOING。（来源：`chapters/C/raw/car-weekly.txt:521-525`）
- **A026｜排期与现状｜待产品评估**：主动推荐偏好进入画像仍待产品评估，同上电周期推荐反馈同步弋途则 HOLD 且未排期。（来源：`chapters/C/raw/car-weekly.txt:526-536`）
- **A027｜排期与现状｜开发完待联调、发版计划**：新增在线及离线人人对话事件的服务端开发完成、与客户端联调中，最新期计划 11/10 发版，不能将此计划视为已合入历史输入。（来源：`chapters/C/raw/car-weekly.txt:543-546`）
- **F074｜排期与现状｜OnePage建议规划**：P0统一接入/P1闭合事件消费/P2治理平台化是建议分阶段路线，文末模型窗口排序去重及订阅机制仍列待定，不能作已交付依据。（来源：`chapters/C/raw/endstate-event-onepage.txt:131-170`）
- **F081｜排期与现状｜设计待决项**：批量部分失败与历史写入范围仍列待确认，建议合法信号可成功、乱序及无变化只打点，不能把建议写成全量实施事实。（来源：`chapters/C/raw/endstate-query-tech.txt:288-319`）
- **F085｜排期与现状｜管理方案范围**：本方案不覆盖上报查询运行链路，只定义后台协议管理及发布；后台发版不能直接证明车辆上报和Planner已收到。（来源：`chapters/C/raw/endstate2-signal.txt:15-21,945-946`）
- **F111｜排期与现状｜OnePage快照**：记忆表列短期历史2026年6月完成、情景绑定人8月完成，但情景隐私施工中、语义隐私规划中，与PRD要求及后续周报实施需分开。（来源：`chapters/C/raw/memory-onepage.txt:572-678`）
- **F112｜排期与现状｜规划**：情境情绪融合、混合检索、动态静态标签区分、多模态记忆列规划或暂缓，不能当本轮Context已默认接入。（来源：`chapters/C/raw/memory-onepage.txt:702-744`）
- **B050｜排期与现状｜10/20–11/02 周报 DONE**：动态示例车型筛选在 9/7 评审、9/7–11 开发、9/14–15 测试并于 9/15 上线，更新了 9/3 会上尚未开发的状态。（来源：`chapters/C/raw/h2-biweekly.txt:2868-2873`）
- **B051｜排期与现状｜7/27 上线记录**：动态示例管理后台于 7/27 上线，使产品能自行维护示例，替代每次由工程手动上线。（来源：`chapters/C/raw/h2-biweekly.txt:7476-7484`）
- **B054｜排期与现状｜10/15 发版记录**：同一 MR1012 在较新周期又登记“模型无限自我否定”历史输入优化于 10/15 发版，不能仅凭同 MR 推断两次变更完全相同。（来源：`chapters/C/raw/h2-biweekly.txt:434-439；对照2850-2858`）
- **B057｜排期与现状｜10/20–11/02 计划**：端状态 2.0 M2 排 10/29–11/6 把触发器、Advisor 等依赖切到新版并先在东风落地，赛力斯 M3 仍待定，整体预计 11/30 完整落地。（来源：`chapters/C/raw/h2-biweekly.txt:513-518`）
- **B061｜排期与现状｜10/20–11/02 DOING**：弋途查询历史压缩记忆排在 11/3–5，以满足 Advisor 获取上下文的诉求。（来源：`chapters/C/raw/h2-biweekly.txt:548-552`）
- **B062｜排期与现状｜10/20–11/02 DOING**：在线与离线人人对话事件新增已开发待联调并计划 11/5 发版，人数识别及人数变化感知拟 11/3–5 出方案。（来源：`chapters/C/raw/h2-biweekly.txt:569-576`）
- **B066｜排期与现状｜状态拆分**：较新周期同一白名单事项仍 DOING，是因为开关事件同步弋途还依赖弋途接口文档；白名单已发版和后续同步未完应分开记。（来源：`chapters/C/raw/h2-biweekly.txt:496-501`）
- **B095｜排期与现状｜10/20–11/02 DOING**：输入管理在 10/23–11/13 开发、进度 30%，拟 11/16–18 实车验证并 11/23–27 测试验收，不能因学习站已写 M 章就视为线上全部落地。（来源：`chapters/C/raw/h2-biweekly.txt:727-741`）
- **B096｜排期与现状｜10 月降级建设**：9/30 已先以 Context 输出依赖与降级梳理，10/20 起优先补 Planner 前置模块的模型失效降级，具体降级策略不可凭周报自行补全。（来源：`chapters/C/raw/h2-biweekly.txt:879-886`）
- **B099｜排期与现状｜10/20–11/02 DOING**：推荐偏好入画像及本次上电周期推荐反馈同步弋途均未排期，分别等待产品评估或人力，属于将来可进入上下文的来源而非当前输入保证。（来源：`chapters/C/raw/h2-biweekly.txt:553-562`）
- **A115｜排期与现状｜四期后续规划**：四期当期拟先接长期记忆、短期记忆、端状态三个源，后续才规划评估体系、提前按场景压缩和外部写入能力。（来源：`chapters/C/raw/context-tech-review.txt:2085-2091`）
- **F123｜排期与现状｜会议待办**：先拉实际舱内外历史上报检查准确性/时效，再车上调SP验证消费，正向构造case不代表负向不受干扰。（来源：`v-lesson-20261105/memory/meeting-1104-transcript.md:131-152,166-207；00:20:41-00:35:29`）
- **B105｜排期与现状｜11/3 文字记录：开发计划**：人人对话全量上报在开发，拟翌日提测并争取 11/5 体验，同时还要把新人人对话接入原瞬时记忆方案，不能写成当天已全部上线。（来源：`v-lesson-20261105/memory/meeting-1103-transcript.md:1066-1088；00:33:42–00:34:51`）
- **B108｜排期与现状｜11/3 文字记录：会议安排**：记忆融合方案拟 11/4 内部对齐后再与赛力斯确认和外审，不能将融合方向写成已交付。（来源：`v-lesson-20261105/memory/meeting-1103-transcript.md:1186-1193；00:36:28–00:36:47`）
- **B121｜排期与现状｜二手待办；9/16**：FaceID 与 AlwaysOn 结果在 Context 拼接的待办 Due 9/29，须用后续融合测试/上线记录更新，不能把待办日当完成日。（来源：`v-lesson-20261107/notes-chat.md:135`；消息定位：原笔记仅部分ID：5f1cc1ff；本轮未重取群消息原文）
- **B122｜排期与现状｜二手对客决策；10/24**：DT 对客只提供粗颗粒 feature list，Context 当时约定不对客暴露，不能把内部字段结构当作客户交付接口。（来源：`v-lesson-20261107/notes-chat.md:136`；消息定位：原笔记仅部分ID：660ce712；本轮未重取群消息原文）
- **B149｜排期与现状｜9/22 群聊二手线索**：既有 C 笔记记载 9/22 14:11 决定先下掉车书多轮改写以免拖慢 Context，但本轮在指定补充聊天笔记中未找到原消息正文，保留为带消息 ID 的二手线索。（来源：`chapters/C/notes.md:127`；消息 om_x100b6415f10330a4b2455f92718a6d2；未重取原群消息）

## 本轮输入各块：来源、长度与更新节奏核对表

“每一轮”必须先区分一次用户请求与同一请求内的模型续轮；9月实现是先等Context变量建图，再追加工具结果继续推理，未证明每一次LLM调用都刷新全部背景。M章写“拿到推理许可再刷新当前背景”是设计规则，11月周报输入管理仍在开发/验证；不能当作所有车型已采用的实现。来源：`chapters/C/raw/planner-onepage.txt:104-144`；`M-v2/full.md:284-301`；`chapters/C/raw/car-weekly.txt:699-713`。

| 输入块 | 谁提供、放在哪里 | 可核实长度/规模 | 更新时机与尚缺信息 |
|---|---|---|---|
| SP固定部分 | Fornax维护角色、输入格式、工具约束、输出格式、示例、能力边界与风格，在线工具经注册表注入 | 上汽7/31已填SP为63714字符，27工具定义、25示例标题、6注意事项；字符不是token | 提示词/配置版本更新；原文未给统一更新周期，AGENTS的23工具/69例不是本快照计数 |
| status：人员/视觉情景 | 端侧VLM+FaceID，云端Context对齐；7月SLS输出与上汽结构不同 | 本轮原文没给token上限；动态查询结果不进通用情景 | 按上报更新；11/4口述3+2交替但长短输出不稳定，不是保证5秒新快照 |
| goal_list | 目标任务系统；4月随本轮UP，7月上汽SP快照在尾部 | 没有统一任务条数或token上限 | 随任务创建/删除/进度变化；是否每个工具续轮重新读取未证实 |
| env_info：最新车况 | 车辆上报、端状态服务查询、Context筛选；SP/UP位置分版本 | SLS 13项常驻+模型筛选；筛选读3轮历史、理由≤100字 | 历史主线上电全量、监听/10秒/2秒上报；v2启动/变化上报及event_ts保护；不是所有信号都2秒刷新 |
| 世界信息 | 和风天气、日历、位置、舱外环境描述 | 无统一token上限 | 天气以当前城市实时API为目标，但缓存/实际刷新周期未给；热榜v1.0设计5分钟/类Top3是P1方案 |
| memory中的摘要 | 摘要链路生成，放memory最前 | PRD28轮、最长500token；旧22与会上30需看冲突表 | 第3轮起每新增1轮压缩；关记忆时不再使用摘要；完成延迟会造成空档 |
| memory中的画像/相关记忆 | 在场人画像固定注入；其他结果按query/标签检索 | TopN由接口/场景决定，不能统一写3条；无总token上限 | 画像随源更新，相关记忆按请求检索；生成频率细节留K，仅交代异步结果未必覆盖刚才 |
| knowledge：动态场景知识 | Seed-2.0-mini读近两轮选场景；9月注入SP，4月方案在本轮UP | 8大场景；原文无总token上限；旧PRD另有66个目录场景登记 | 每次选场景取代码中知识正文；知识内容更新需发版，不等于每次query重新生成知识 |
| 车书knowledge | vehicle_knowledge取车型QA答案；5月方案放SP | 约2000条库，最多Top3且低置信过滤；阈值待评测 | 按query检索，改写耗时后有下掉多轮改写的二手线索；各车型前置/工具并存状态待核 |
| scenario_sample：动态示例 | pre-query并行检索，VikingDB+MySQL，注入SP | Top3；外部1000+示例是方案规模表述 | 随当前query选取，管理后台可热更新；pre-query是否等于V章Soft VAD预请求未证实 |
| 对话历史 | Planner从chat_history、planner_histories、planner_task_list重建 | 云端5轮/30分钟来自主线代码聊天证据；R章本地10轮/30分钟是不同对象 | 收尾写表；下一次建消息；历史工具调用/反馈保留，非末轮车书/联网反馈可缩成省略号 |
| 当前输入 | M/接入层交query、advisor、event、feedback，保留来源/时间/说话人 | 可为JSON数组，不能把条数等于对话轮数；没有统一token上限 | 有效输入准入/合并时更新；历史旧输入不得再次作为新任务执行，调度细节回指M |
| 工具反馈/中断背景 | 工具真实返回及播放进度，回灌模型历史/续轮 | 没有统一长度；旧实现缺打轴可估，M新规则未知不能作已播 | 工具完成后追加；中断保留真实已执行结果和已/未播区分，非重放许可 |
| 事件背景 | 白名单事件服务/Planner历史重建；另有独立事件变量和主动event | 10分钟3条实现、10分钟30条暂定、5–10分钟100条二手、最新5轮非人机讨论不是同一配置 | 按事件发生时刻排序；插历史不自动触发推理；是否去掉独立事件流需查项目版本 |
| capability | Flow能力检查与按车型能力说明 | 泛化检查没有可读稳定耗时准出数字 | 泛化前置有暂不上取舍；11/3按车型座椅能力已上线是范围更小的功能 |

来源定位：SP快照见本文件F130–F137及原JSON.content逻辑行；其余逐条依据在相应主题事实项。这里“未给”指本轮可读原文缺口，不以经验补成固定值。

## 资料冲突与适用范围清单

| 编号 | 两边的说法与来源 | 哪份更新/如何处理 |
|---|---|---|
| X01 | 4月车况/目标在本轮UP，`dt-context-adjust.txt:9-22`；7月SLS写SP `sls-context.txt:49-51`；7/31上汽快照也在SP末尾 | 7月两份比4月晚，但车型/模板有别；最新线上摆放仍需实际Prompt确认，不能讲成通用唯一结构 |
| X02 | 4月动态专业知识在UP `dt-context-adjust.txt:46-52`；9月动态知识在SP `dyn-example-onepage.txt:25-35`；车书也占knowledge `manual-qa-tech.txt:27-29,304-309` | 9月比4月更新；车书与场景知识同名变量如何合并没有可读规则 |
| X03 | OnePage预注入80%/20% `context-onepage.txt:105-106`；技术五期90%/10%、预计800ms `context-tech-review.txt:2113-2132` | OnePage后编辑，但两边均非附样本实测覆盖率；保留不同方案表述，不择一当现网指标 |
| X04 | R本地10轮/30分钟，C主线云端5轮/30分钟，M旧排队4条/1分钟 | 对象不同，非谁替代谁；出处见overlap.md，不能把排队数量当历史轮数 |
| X05 | SLS独立流10分钟暂定30条 `sls-context.txt:262-278`；Planner近10分钟3白名单事件 `planner-onepage.txt:108,279`；11/4拟并入最新5轮并去原变量 | 11/4讨论更晚但不是已上线；另5–10分钟100条仅二手群聊口径，项目/消费口分开 |
| X06 | 旧摘要22轮、11/5版PRD28轮；11/3问到之前30轮是否已上一版，回答明天提测争取5号体验 | PRD编辑晚于两会；30是提问涉及版本、未证实上线长度；V正文把22/30当长度选择不能作为C来源；详B100起及F116 |
| X07 | 项目说明Seed1.8、23工具、69示例、10注意事项；Planner OnePage模型表2.1-turbo/2.0-lite；7/31上汽快照27工具/25例/6事项 | 都是版本/车型快照，原文优先；不能保持旧数字又说是当前全部项目 |
| X08 | AGENTS SP30–35K、UP10–15K；10/21负载方案总输入PE约4万、SFT约1.5万 `D/raw/load-balance.txt:13-25` | 后者更新但仅总输入估计，不能反推SP/UP分项；快照字符数也不能充token |
| X09 | AGENTS远1–8/近9–10、省40%–70%/总量10%/计算19%；9月实现仅压非末轮车书/联网反馈 `planner-onepage.txt:108` | 不同范围；指定原文未给前者完整评测，19%是平方比例推算不是实测等待时间收益 |
| X10 | AGENTS跨请求固定前缀复用；四期同query也重新取Context `context-tech-review.txt:2001-2002` | 缓存对象不同；Context结果、预跑Redis、固定正则与模型KV必须分开；>20轮挤出阈值未核验 |
| X11 | 1.0/OnePage泛称公共服务存储维护 `public-context-prd.txt:5-9`, `context-onepage.txt:5-7`；技术四期主模块不存储 `context-tech-review.txt:1978-1987` | 总服务能力与主模块职责分层且历史演进；收尾写历史属于Planner/Flow，不应画成Context存储 |
| X12 | 四期Context只按本query `context-tech-review.txt:1971-1972`；SLS状态筛选读3轮、动态知识读近2轮 | Context主模块不替调用方处理多轮，与各源自己读历史可并存，不应删任一条件 |
| X13 | V1目标800ms/实际1.2s、V2表564ms；早期测试不含网络771ms；10月线上表P90约360ms | 时间、环境和统计边界不同；771来自notes二手测试摘要而raw测试报告只有标题，不可说本轮读到测试表原件 |
| X14 | 9/3动态示例只有env/channel无车型，会议 `meeting-0903-dyn.txt`；周报9/15分车型已完成 | 9/15状态更新，不能继续写尚无车型隔离；仍不代表按所有软硬件配置精确隔离 |
| X15 | 9月能力检查lite太慢/9月8白名单单元基本满足；10/27仍因速度暂不上；11/3按车型座椅能力上线 | 模型单元与功能范围不同；泛化检查不能借局部上线升级状态，参考B144与A/B周报项 |
| X16 | 1.0屏幕截图5分钟、W动态卡片已接入、示例工具有屏幕；SOP二级边界不支持、上汽6/26下线，通用屏幕Context仍HOLD | 不同车型、版本与能力对象；屏幕视觉问答、页面词注册、卡片结构上报、任意屏幕入Context分开 |
| X17 | SOP VQA总描述提屏幕，但VQA二级能力边界写暂不具备；全量身份非IP可选，子功能表必选 | 同一工作簿内部差异，无可信修改先后；保留原单元格与两边状态，见sop-items.md |
| X18 | SOP多来源上下文检索标内部预研，但Context已有调用实现 | 清单交付包装范围与已有内部聚合不必相同；不能改写原状态，也不能据状态否认实现 |
| X19 | 风控MR1012在不同周报出现9/15和10/15发版；技术分支仍写空结果降级修正建议 `risk-history.txt:136-182` | 晚期周报不证明所有一致性风险已修；区分基础风控过滤上线与具体复活分支修复 |
| X20 | 记忆PRD定义完整隔离；OnePage情景隐私施工中、语义规划；周报多人情景9/14完成而摘要隔离仍DOING | 按记忆类别和日期记录，不能汇总成隐私隔离全完成；摘要与长期记忆不是同一改造 |
| X21 | SLS称事件倒序但例按较远到较近且编号到97超过30 `sls-context.txt:264-280` | 同文示例不自洽，无更新证据；精确格式按实现/协议核验，不照抄示意编号 |
| X22 | 动态知识医院例选DRV-01-01-05，目录该ID对应送孩子上学，医院应DRV-01-01-08 | 同文内部ID冲突，无更新先后；已在B事实/66场景目录登记，写作例子不能沿用错ID |
| X23 | 动态知识导航例并行搜索，与同文沿途搜需先导航冲突；火锅例边问是否导航边已发导航，与等待确认规则冲突 | 同文设计不一致；按案例保留矛盾，不能把示例自动当高于规则的正确答案 |
| X24 | 旧notes把探索版归纳全靠工具无预取；探索原文已有SP车况和情景RAG背景 `planner-explore.txt:13-27,355-372,547-562` | 原文优先，修正演进起点为“已有注入与按需查，后来形成V2两阶段”，不是无→有的绝对分期 |
| X25 | 动态示例pre-query并行 `dyn-example-onepage.txt:17-23`；V的Soft VAD预请求 | 名称相似不足以证明同一触发时点，暂不画成必定由300ms判停启动 |
| X26 | 11/4中途提关记忆仍记地址，后面01:35:46又明确统一需打开 | 采用同场较后对齐；中途设想保留为讨论，不当现行规则或法规结论 |
| X27 | “终态事件”在任务要求出现；C原文只有端状态/事件日志与会话finish_type，I/M另有播放终态 | 未找到该统一概念的直接定义；列为缺口，不能把endstate文件译成终态；见components.md末尾 |
| X28 | 周报标题11/02–11/13，条目含11/16以后计划；M正文描述完善调度，周报仍55%开发 | 标题和设计文本都不证明实际完成；按条目的状态、计划日期和验证证据读，不以当前日期自动升级 |

## 研究结论的证据边界与待补

1. raw共40个文件：29个有实质正文，5个只有标题，6个是错误响应；权限错误1770032有4个，参数校验错误99992402有2个，后者不能归为“确认无权限”。全部文件文本均已处理，长周报完全重复行的折叠读取方法详read-ledger.md。
2. 图片、sheet嵌入内容在txt中仅为占位时没有可用图像证据；Context完整架构图、初期测试报告实表、token两份原报告、隐私隔离和屏幕上云技术正文均未补造。
3. 群聊和部分会议仍以旧笔记作二手线索，逐条保留message_id/会议时间及未重取声明；11/3、11/4、10/22、9/3已读逐字稿，8/13已找到I章原始逐字稿并补核相关段；同事提问不升级为结论。
4. 主机厂上报、感知生成、Context检索、Planner消费、工具执行与用户见到效果是不同验收层；本阶段只研究，不做页面、车型、工具真实执行验收。
5. 下一步设计前最需补证的是：每项目实际SP/UP与工具续轮刷新、摘要计数/线上配置、当前事件消费窗口、knowledge多源合并、实际token/KV观测及“终态事件”指代；这些缺口不妨碍本次把已有事实和冲突完整登记。
