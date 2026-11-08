# C 章（Context 上下文）研究笔记

取证日期：2026-11-08（飞书只读，lark-cli 用户身份 + 飞书只读 MCP）。原文副本存于本目录 `raw/`。
时间口径：会议、群聊时间按北京时间；文档编辑时间取 wiki 节点 obj_edit_time（北京时间）。

## 一、读取清单

| # | 标题 | 链接 | 编辑时间 | 读到哪 |
|---|---|---|---|---|
| 1 | Context OnePage（V2 预注入 + 动态检索） | https://bytedance.larkoffice.com/wiki/OjGMwBX8fiLS0ikDWqVceVjhnPg | 2026-09-10 | 全文（架构图为图片，未读） |
| 2 | AI汽车context模块技术评审（一至五期） | https://bytedance.larkoffice.com/wiki/ZJNXwI8mpiB7B9kDlhfcCZ2Hnrh | 2026-06-05 | 全文；细读四期（context 主模块）、五期（记忆预注入 n+1 次调用） |
| 3 | 服务端技术方案【Context优化v1.0】 | https://bytedance.larkoffice.com/wiki/JX3nwExopitdpKkToqdcv1hTnHT | 2026-05-02 | 全文 |
| 4 | SLS-Context需求 v1.0（吴仁杰） | https://bytedance.larkoffice.com/docx/RLW7dLbgBoc9TyxMX8hcdMddnuh | 2026-07-03 初稿 | 全文 |
| 5 | Director上下文调整-需求说明 | https://bytedance.larkoffice.com/wiki/Q75hww98KiC3KZkAUMRc5Bten9b | 2026-04-21 | 全文 |
| 6 | 公共Context管理-豆包【AI car 1.0】 | https://bytedance.larkoffice.com/wiki/Ip1kwhsLhioyegkuf9bcIUspnpb | 2025-10-29 | 全文（历史方案） |
| 7 | 【主线&AI汽车】座舱大模型-知识&状态检索需求 | https://bytedance.larkoffice.com/wiki/BZeCwPtcZi3QFpkwCwCcKoLGn0g | 2026-04-27 | 全文 |
| 8 | Director(对话推理引擎) PRD | https://bytedance.larkoffice.com/wiki/XRuKwJ0VPisdUhkxH0ecY1rRn9g | 2026-11-02 | 定位精读：感知/信息层 context 清单、结合 context 推理示例、性能目标、工具清单 |
| 9 | 记忆系统 PRD | https://bytedance.larkoffice.com/wiki/CbJVw4ACzilvvBkRxkqcQVfAnLh | 2026-11-05 | 变更日志、对话摘要、画像、情境感知、记忆开关、记忆露出 |
| 10 | 记忆 OnePage | https://bytedance.larkoffice.com/wiki/KAAMwb7vsiHpd0k7PVPctGfKnHf | 2026-10-20 | 全文 |
| 11 | AIDV Planner One Page | https://bytedance.larkoffice.com/wiki/EWziwFVftiGvnlk0FA4cadqonud | 2026-09-10 | 定位精读：上下文组装、输入输出 |
| 12 | 座舱Planner探索 | https://bytedance.larkoffice.com/wiki/K8Ihw3a4niaDNck7FEkcDXcOnfb | 2026-10-29 | 定位精读：Context管理、长期记忆、环境信息（早期方案） |
| 13 | 动态示例与动态知识技术方案 (One Page) | https://bytedance.larkoffice.com/wiki/EIc5w4ljUiMeyEktcuycaB6In1f | 2026-09-10 | 全文 |
| 14 | 动态知识检索&使用 需求说明 | https://bytedance.larkoffice.com/wiki/EZ0PwsuFjiCg85kJqu8cmQRinLb | 2026-04-29 | 前 400 行（输入输出、知识分类、使用方式） |
| 15 | 动态示例解bug指南 | https://bytedance.larkoffice.com/wiki/LKSKwWCoJiE4SHk8xb7c842Dnrf | 2026-05-29 | 前半（静态 vs 动态、写法） |
| 16 | 【AI 汽车】车书 QA 技术方案 | https://bytedance.larkoffice.com/wiki/Vp7cwOgx5i49s8kIxHacd9Ggnkd | 2026-05-08 | 全文 |
| 17 | AI 汽车能力边界注入技术方案 | https://bytedance.larkoffice.com/wiki/DNjVwAgXZiBL0akgs7mcnjywnJb | 2026-09-08 | 全文 |
| 18 | AIDV Planner 模型风控标记与历史过滤技术方案 | https://bytedance.larkoffice.com/wiki/QMeNwRQAjiWnQOkT9fzcfRYbntc | 2026-09-07 | 全文 |
| 19 | 端状态&事件日志上报 One Page | https://bytedance.larkoffice.com/wiki/PRf0wRd3Uic0omkiiiGc70wanQN | 2026-09-12 | 全文 |
| 20 | 端状态上报链路与 Context 查询端状态链路技术方案 | https://bytedance.larkoffice.com/wiki/XROEw3Ns0iiwyqko7G4cVhqpnlg | 2026-10-20 | 全文（第 4 节 Context 查询为重点） |
| 21 | 事件生产与使用迭代-技术方案 | https://bytedance.larkoffice.com/wiki/SiedwOaRPiNhHpkLXjucucUgnBc | 2026-10-19 | 全文 |
| 22 | 事件——Director新增输入（MVP版） | https://bytedance.larkoffice.com/wiki/XO3DwVkOCi1l16kqyROc7boEnFb | 2026-07-21 | 全文 |
| 23 | 情景描述（20 条车内外感知样例） | https://bytedance.larkoffice.com/wiki/WKMOwO0EuinLxrk6e29cwOmznQf | 2026-04-03 | 抽读格式 |
| 24 | 2026年H2服务端工程双周报（10/20–11/02 期为最新） | https://bytedance.larkoffice.com/wiki/MvTIwiTZGif70SkNdtrcrM0lnsg | 2026-11-02 | Context/Memory/状态段全读；全文按关键词检索 |
| 25 | 汽车服务端周报（11/02–11/13 期） | https://bytedance.larkoffice.com/wiki/FouOwkkXZihfATk4edEcclsln6g | 2026-11-06 | 耗时表、Context 段 |
| 26 | AI汽车耗时指标周报 10/18–10/25、10/25–11/01 | https://bytedance.larkoffice.com/wiki/PvzJwSXnVil1PMk8nXwcxknjn2f ；https://bytedance.larkoffice.com/wiki/V1eJwKruQiIlvWkBKXtcxgfPnrb | 10/25、11/01 | 全文 |
| 27 | 【AI汽车】【context整体性能摸底】测试集&测试报告（sheet） | https://bytedance.larkoffice.com/wiki/QQ6JwBa4YiqsgFkr7MhcZMaMnxc | 2026-08-03 | 第一张表（5/27 优化前后） |
| 28 | 文字记录：对下动态示例车型分库 9/3 | https://bytedance.larkoffice.com/docx/YXzMdAbUxo7YGcxX7VUcna1znxc | 9/3 | 全文 |
| 29 | 文字记录：车机AI核心事项专项讨论会 11/4 | 本地副本 research/v-lesson-20261105/memory/meeting-1104-transcript.md（原链接 https://aka.doubaocdn.com/s/68EV2Q9r4X） | 11/4 | 00:00–00:41 逐字读（历史对话、摘要、视觉 context、记忆命名） |
| 30 | 文字记录：11/3 产品周会 | https://bytedance.larkoffice.com/docx/I8evd4smzoW6QmxV5Nac1ZV5nvb（本地副本） | 11/3 | 定位精读（动态示例召回、视觉 context） |
| 31 | 文字记录：10/22 DT 宣讲 | https://bytedance.larkoffice.com/docx/Is0mdygy3oQmEixHRUNcolvXnRb（本地副本） | 10/22 | 定位精读 00:27–00:29、00:56–00:58 |
| 32 | 10/28 记忆宣讲文字记录 | https://bytedance.larkoffice.com/docx/Ytzbd2OoNoMk0xxi099c1t9CnHh | 10/28 | 复用 v-lesson-20261106/notes-lectures-memory.md 已核对段落（摘要、隐私、开关） |
| 33 | 群聊（lark-cli 消息搜索） | 见下文各条 message_id | — | 关键词：事件流、context耗时、端状态筛选、对话摘要、动态知识、env_info、DefaultTimeLimit、上下文窗口、context 精筛 |
| 34 | 已有研究笔记 | v-lesson-20261106/notes-wiki-v.md、notes-lectures-memory.md；v-lesson-20261107/notes-chat.md、notes-meetings.md | — | Context/记忆相关段全读 |

读不到（记为缺口，不能当作资料不存在）：
- 对话历史压缩隐私隔离技术方案 https://bytedance.larkoffice.com/docx/TJtNdPsENowepTxZ34Lc5xtTnkf ：forBidden。
- 【WIP】屏幕上下文上云与 Context 链路技术方案 https://bytedance.larkoffice.com/docx/C9xFdZEz3oS8FjxOWr3cwuzbnRe ：forBidden。
- Context时空情境建模（PRD） https://bytedance.larkoffice.com/wiki/ZtFDwrAAUiuckHkgmmvcVGVxnih ：无节点权限。
- 端侧召回历史对话模拟（对齐 DT 云端） https://bytedance.larkoffice.com/wiki/PzkGwXd3zifxhXkv8FxcpxGunVf ：读取失败。
- 模型命中风控时，优化上下文格式（需求） https://bytedance.larkoffice.com/wiki/ZVzGw3jY7isazSka5GtcwlPZnCg ：读取失败（只读到技术方案）。
- saicaudi 渠道 9-1 车控 & 端状态 token 消耗对比两份报告：forBidden。
- history-compression、memory-privacy、11/5 会议纪要：forBidden（前序研究已记录）。
- “Context 运行方案”：飞书搜索与 wiki 目录都没有这个标题；前序研究把 Context OnePage 存成 context-runtime.md，推测指它。
- 11/4 逐字稿的说话人全部被转写成“薛灵钥”，不能按说话人引用。
- Context OnePage 的“新架构完整链路”是图片，未读。

## 二、按链路步骤整理的事实

### 步骤 1：接住输入（上游 M 章交来）
| 事实 | 出处 | 状态 |
|---|---|---|
| DT 的触发输入四种：user input、advice、tool feedback、event | DT PRD 感知/信息层 | 已上线 |
| Context 在 query 进入 DT 时同步做“前置检索”，第一次推理就带着记忆 | 10/22 DT 宣讲 00:57:19 郝晓伟 | 已上线 |
| Planner 等 Context 下发的提示词变量后再建图推理；动态示例在 pre-query 阶段并行检索，避免拖慢主链路 | Planner OnePage；动态示例 OnePage 2.3 | 已上线 |
| 当前轮输入带说话人、位置、时间戳、距上次 query 间隔（注册用户按身份算，非注册按位置算） | Director 上下文调整需求（4/21） | 已定方案（上线情况未单独核实） |
| Context 不考虑调用方多轮，只按当前 query 检索；不负责存储，各源自管存储与质量 | 技术评审四期 | 设计原则 |

### 步骤 2：历史输入（研发仍叫历史对话）
| 事实 | 出处 | 状态 |
|---|---|---|
| 同一 channel+车辆+chat_id 下，最近 30 分钟内最多 5 轮有效历史（DefaultHistoryLength=5、DefaultTimeLimit），部分无效空历史被过滤，实际可能少于 5；事件消息插入但不算轮数 | 东风S33群 10/15 14:16 王子豪 om_x100b6232b27c6cbcdd769f36db16077 | 已上线（代码口径） |
| 历史重建：chat_history + planner_histories + planner_task_list 拼成“用户→豆包→工具反馈”时序；并入近 10 分钟最多 3 条白名单事件，按时间排序；非最后一轮的车书、联网搜索反馈脱敏为“...” | Planner OnePage（9/10） | 已上线（9 月口径） |
| 历史保留工具 input 与工具返回后的播报和执行；当前轮的 goal_list/env_info/knowledge 成为历史后不保留，节省窗口 | Director 上下文调整需求（4/21） | 已定方案 |
| 模型命中风控：finish_type=3，下一轮不进历史；首包非 JSON 时替换为 6 条安全话术之一 | 风控标记与历史过滤技术方案（9/7）；H2 双周报 [DONE] | 已上线 |
| badcase：LogID 202609061616408D45EB1BECA1A5425319，Redis 已过滤为空→被当错误降级查 MySQL→MySQL 仍为成功→旧敏感输入“复活”进入 Planner | 同上 5.1 | 已发现；修正建议见原文，合入状态未单独核实 |
| 拒识的话 finish_type=1，作为人人对话事件，不进普通人机历史 | notes-wiki-v（对话事件日志生成链路总结 11/6） | 已定方案 |
| 记忆开关关闭不影响 5 轮历史；“刚说过”仍能答 | 记忆 PRD 记忆开关 | 已定方案 |
| 11/4 讨论：在 5 轮人机对话基础上，加入“最新 5 轮里的非人机内容”（人人对话 + 事件）；原 SP 里的事件流变量不再调用；名字改为“历史输入” | 11/4 逐字稿 00:01:50–00:07:32 | 讨论中（会上对齐方向，PRD 未同步） |
| 11/4：“轮”的定义未定，倾向每一句话（人或豆包）都算一条 | 11/4 逐字稿 00:13:23 | 讨论中 |
| badcase（10/15 东风S33）：相同 query 在 5 轮内，系统不重复调车书工具，只播报无屏显卡片 | notes-chat 2.6 #4 | 现状 |

### 步骤 3：对话摘要（11/4 提议改叫摘要记忆）
| 事实 | 出处 | 状态 |
|---|---|---|
| 从第 3 轮起，每新增 1 轮压缩一次本次用车的人机 QA，最多 28 轮、最长 500 token，拼在记忆变量起始位置；目的：补 5 轮历史与 20 分钟短期记忆之间的空档 | 记忆 PRD（11/5 版） | 已上线（PRD v1.5 6/23 加入；28 轮为最新版） |
| 22 轮口径：本地旧副本与 11/4 会上口头都说 22 轮（“超出22轮，把前面直接丢了”） | 11/4 逐字稿 00:11:41；notes-lectures-memory | 冲突待确认 |
| 11/4：摘要输入扩到所有事件流（人机、人人、事件） | 11/4 逐字稿约 00:09–00:11 | 讨论中 |
| 新的人上车（FaceID：未注册人数增加或新注册用户上车）清除摘要中敏感信息；人数不变换人识别不了 | 10/28 记忆宣讲 00:45–00:48 | 已定方案 |
| 对话历史压缩隐私隔离：10/21 评审，10/21–24 开发，收益“满足上汽合规”，11/6 周报仍为 DOING | H2 双周报；汽车服务端周报 1102–1113 | 开发中 |
| badcase 8/13 路测：豆包用半小时前的途经点回答，来源可能是历史对话或摘要 | notes-meetings M14 | 历史 |
| 摘要清空接口（一键除痕，新起 chat_id） | 记忆 PRD | 已定方案 |

### 步骤 4：“现在”的事实——端状态、世界信息、舱内外情景
| 事实 | 出处 | 状态 |
|---|---|---|
| 端状态：常驻 13 个信号（导航状态、收藏地址、目的地、播放模式、当前音频、行进状态、空调四项、车窗、续航、途经点[7/7 新增]）与 LLM 筛选结果去重后默认注入；屏蔽座椅位置状态 | SLS-Context 需求 | 已定方案（SLS；“和 DNA 保持一致”） |
| 筛选模型输入：多轮对话历史（3 轮）+ 核心端状态名称 + 状态知识；输出：信号名 + 不超过 100 字理由 | SLS-Context 需求 | 已定方案 |
| 输出 YAML；空调四合一、导航二合一、音频二合一、视频二合一，为优化模型对同类信号的注意力 | SLS-Context 需求 | 已定方案 |
| Context 优化 v1.0：端状态自筛选与原精筛并行再合并；注入核心端状态；世界信息加头条热榜（每 5 分钟） | Context 优化 v1.0（5/2） | 历史方案（部分是否上线未核实） |
| 车辆状态放在“当前轮用户输入”里，并提示“这是最新的车辆状态，相比对话历史要优先参考”；goal_list 同样放当前轮；视觉和记忆仍在 SP | Director 上下文调整需求（4/21） | 已定方案 |
| 世界信息：和风 API 实时天气、日历（公历/农历/星期/节日/节气/季节）、车辆位置，YAML | SLS-Context 需求 | 已定方案 |
| 情景描述：端侧视觉模型输出；乘客要和 FaceID 乘客列表比对，以 FaceID 为准，多出的人物过滤；“动态查询结果”不注入；上汽 status 变量只有“主驾坐着小明”，赛力斯 status 变量含乘客列表（FaceID 结果+性别年龄造型动态）、物品、不安全因素、整体描述；舱外路面与所见文字进世界信息 | SLS-Context 需求 | 已定方案 |
| 11/3 吴仁杰：视觉 context 已经进来了，“但是那个主模型就不会用它” | 11/3 周会逐字稿 00:32:52 | 现状 |
| 11/4：VLM 3 秒+2 秒交替（舱内/舱外），单帧“搓手”判断不了冷；不能放 UP，否则模型乱发挥；要在 SP 结构上让 DT 意识到自己有一路持续视觉；先拿历史数据看 badcase、上车调 SP | 11/4 逐字稿 00:18–00:35 | 讨论中 / 待办 |
| 9/16 待办：Face ID 和 Always On 结果在 Context 的拼接，Due 9/29 | notes-chat 2.6 #11 | 待办（结果未核实） |
| 屏幕信息上云进 context：HOLD，依赖客户提供能力 | H2 双周报 | 暂停 |
| 端状态 2.0：Context 新增 2.0 数据源，结构化透传，文本按 1.0 拼接规则；M0.5 11/3 发版，M1 东风经 context 给 planner，整体预计 11/30 前落地 | 端状态查询技术方案；H2 双周报 | 开发中 |
| 测试：Context-端状态筛选通过率 90%（目标 95%），多筛无关信号、少筛关键信号 | 测试周报群 11/7 00:05 om_x100b61ebe2a71ca4cfe74749f7c4422 | 现状（赛力斯 E68） |

### 步骤 5：“长期”的事实——画像与相关记忆
| 事实 | 出处 | 状态 |
|---|---|---|
| 预注入：调 DT 前先返回最基础的记忆（驾驶风格、车控偏好、美食偏好等）；不够则 DT 改写后调工具再查，直到最大轮次 | 技术评审五期 | 已上线（宣讲印证） |
| 画像：按车上实际坐的人固定注入，未做检索 | 记忆 PRD | 已上线 |
| 召回：模型按 query 推场景标签 → 标签内打分 → 每标签 top-n | 记忆宣讲；记忆 PRD | 已上线 |
| 隔离：车+豆包账号；白名单标签取询问人最大集，非白名单取在场人最小集 | 记忆宣讲；记忆 PRD v1.8 | 已定方案 |
| 准确率快照 2026-09-09：长期记忆召回 96.3%，长期情景召回 90.79%，画像生成 83.3% 等 | 记忆 OnePage | 历史测试 |
| 测试：Context-记忆通过率 90%（目标 95%）；实车依赖 FaceID，前一天注册第二天不认识 | 测试周报 11/7 | 现状 |
| badcase 9/3：问“我们第一次见面是什么时候”，前置检索拉出大量短期、长期情景记忆和无关人物 | 座舱大模型助手产品群 9/3 郝晓伟（notes-chat 2.6 #3） | 已知问题，记忆重构中 |
| 早期设计：记忆和环境信息都只靠 Planner 调查询工具，无预取 | 座舱Planner探索 | 历史方案 |
| 五期预计：预注入可解决 90% 情况，整体提速约 800ms | 技术评审五期 | 设计预估 |

### 步骤 6：“知识”——车书、动态示例、动态知识、能力边界
| 事实 | 出处 | 状态 |
|---|---|---|
| 车书：约 2000 条常用 QA 从独立工具前置到 Context 初筛；改写→按租户/车辆/车型过滤→Top3→低于阈值不注入；VikingDB 独立 collection | 车书 QA 技术方案（5/8） | 已定方案 |
| 9/22：先下掉车书多轮改写，因为“车书qa对检索这块拉低了整个链路的context耗时” | 群聊 9/22 14:11 om_x100b6415f10330a4b2455f92718a6d2 | 已决定 |
| 动态示例：按 query 混合检索 Top3 SFT case，注入 scenario_sample；VikingDB+MySQL，后台热更新；把 1000+ 示例移出 SP | 动态示例 OnePage | 已上线 |
| 动态示例分车型维护：9/15 上线（计划），[DONE] | H2 双周报；9/3 会议 | 已上线 |
| badcase 9/3：低配车无座椅按摩，车书按配置答对，动态示例残留座椅按摩，模型答错（单如水） | 9/3 文字记录 00:02:22 | 历史 badcase |
| 动态知识：小模型 Seed-2.0-mini 读近两轮对话选场景 SOP（8 大场景，如儿童安抚、急速调温），拼进 knowledge 变量；代码配置，发版更新 | 动态示例 OnePage 3 | 已上线（9 月口径） |
| 旧版动态知识 PRD（4 月）：输入 query、最近 10 轮、goal_list、env_info、已加载知识 ID，输出 add/remove 知识 ID；按专家角色树（EXP/DRV/COM/ENT/LIFE） | 动态知识 PRD（4/29） | 历史方案 |
| 11/3：动态示例召回问题——相似度不够召不回，还是召回了 DT 不采纳，需区分 | 11/3 逐字稿 00:11:14 陈芮婷 | 讨论中 |
| 能力边界：Flow 侧异步调能力检查模型，can_implement=false 时改写 query 并把所需能力的原子能力说明注入 capability 变量；知识当前写死在代码 map，“不能作为上线方案” | 能力边界注入技术方案（9/8） | 评测阶段 |

### 步骤 7：拼装与按需检索
| 事实 | 出处 | 状态 |
|---|---|---|
| SP 与 UP 分工：动态知识、动态示例、记忆（摘要在最前）、视觉 status、能力边界在 SP 变量；goal_list、env_info、knowledge 背景信息随当前轮 UP | Director 上下文调整需求；动态示例 OnePage；能力边界方案；记忆 PRD | 已定方案（个别变量位置随版本变，待确认） |
| 注意：车书 QA 结果与动态知识都叫 knowledge 变量（车书方案写“Context 加到 director 的变量，只包含 answer”） | 车书 QA 技术方案；动态示例 OnePage | 待确认两者如何共存 |
| DT 判断够不够：够则直接答；不够调查询工具（search_user_memory、vehicle_status_search、search_visual_info 等），结果作为 tool feedback 进下一轮 | Context OnePage V2；DT PRD 工具清单 | 已上线 |
| 对客：DT 只提供粗颗粒度 feature list，context 也不对客 | notes-chat 2.6 #12（10/24） | 决策 |

### 步骤 8：性能
| 事实 | 出处 | 状态 |
|---|---|---|
| V1 设计目标 P90 800ms，实际 P90 1.2s；端状态筛选调两次模型是主瓶颈 | Context OnePage | 历史 |
| V2 P90 564ms（OnePage 对比表） | Context OnePage | 方案文档口径 |
| 5/27 测试环境：context 查询耗时（不含网络）P90 1086→771ms；端状态筛选 P90 约 633ms 仍是最慢；车书检索 P90 568→402ms | context 整体性能摸底 sheet | 历史测试 |
| 6/15 实车分段：Context 250ms | notes-wiki-v（全链路 0615） | 历史 |
| 线上看板“上下文”P50/P90：10/18–10/25 273.2/358.9ms；10/25–11/01 272.8/366.3ms；1102 期周报 275.3/361.9ms | 耗时周报；汽车服务端周报 | 现状 |
| DT 首包目标 P50 500ms / P90 800ms | DT PRD | 目标 |

## 三、演进、取舍、badcase、争议
1. 架构演进：早期“全靠工具查”（Planner探索）→ 2025 公共 Context（写入/压缩/检索分发，按场景、人物过滤）→ V1 写入-粗筛-精筛（统一模型精筛只出 5 个，位置偏好、源间此消彼长；P90 1.2s）→ V2 筛选权下放各源 + 预注入/动态检索（OnePage 写 80%/20%，五期写 90%/10%）。
2. 端状态：全塞挤注意力且费 token，全筛选高频状态反复调模型→ 常驻 + 筛选；后处理合并同类信号；放当前轮并声明“最新优先”，成为历史后删除。
3. 事件进 DT 的口径一直在变：SLS PRD/端状态 OnePage 10 分钟 30 条独立事件流变量（暂定）；8/14 群聊 5–10 分钟至多 100 条、瞬时记忆不用了；Planner 代码近 10 分钟 3 条插历史；9/22 群聊“事件流配置只有赛力斯有”；9/17–18 白名单控制哪些事件进 SP；11/4 讨论去掉事件流变量，事件并入历史输入的最新 5 轮。
4. 争议：视觉 caption 进 context 但 DT 不用（11/3、11/4）；动态示例召回 vs 采纳（11/3）；“轮”怎么数（11/4）；摘要 22/28 轮（11/4 会上口头 vs PRD）。
5. badcase：9/6 风控历史复活；9/3 低配车座椅按摩；9/3 第一次见面过召；8/13 半小时前途经点；10/15 车书重复 query 无卡片。

## 四、与旧版内容的冲突
| 旧版说法 | 核实结果 |
|---|---|
| “九路来源”（身份、车况、情景、最近历史、任务视图、记忆、车型能力、适用经验、示例） | 原文没有“九路”这个分法；OnePage 列的 9 个上下文源是：情景描述、事件日志、短期历史压缩、短期情景、长期情景、长期语义、画像、端状态、联网基本信息。旧版是自行归纳 |
| “背景组装 P90 约 564 毫秒”当作当前数 | 564 是 OnePage 方案对比表口径；线上看板“上下文”P90 约 360ms；5/27 测试环境 771ms。需分口径 |
| 端状态筛选正确率≥96%、≤230ms，背景包整体正确性≥85% | 本次读到的 Context 文档都没有这组数，无法证实 |
| 身份硬门槛“校验失败只用匿名上下文” | 未在原文找到这条 Context 规则；记忆隔离规则在 K 章 |
| “跨源冲突保留出处，不在 Context 内裁决”写成现行做法 | OnePage 把“解决跨源数据冲突问题”列为长期规划，不是现行能力 |
| 动态示例“当时已上线只有分车企和分环境” | 9/3 会议时如此；之后“动态示例分车型维护”9/15 上线（H2 [DONE]） |
| 车书前置“召回最多 3 条”无后续 | 9/22 已决定先下掉车书多轮改写，因拖慢 context 耗时 |
| 预注入覆盖 80% | OnePage 80/20；技术评审五期 90/10，两处口径不同 |

## 五、缺口（写作时标“待确认”）
- 对话历史压缩隐私隔离方案正文、屏幕上云方案、Context 时空情境建模 PRD 无权限。
- 摘要上限 22 还是 28；“轮”的新定义；历史输入扩充是否已排期开发。
- 车书 knowledge 与动态知识 knowledge 变量是否同名并存。
- 当前线上事件进 DT 的口径（10 分钟 3 条插历史 / 独立事件流 / 白名单），各项目差异。
- V2 中“动态检索”的工具清单是否只有记忆、端状态、视觉三类。
- 上汽与赛力斯 status 变量差异是否仍是 7 月口径。
- Context OnePage 架构图未读。
