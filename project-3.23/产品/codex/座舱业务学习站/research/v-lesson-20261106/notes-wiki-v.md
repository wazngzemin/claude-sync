# V 章补充调研：AI Car 主线 wiki（space 7554961122303098899）

- 调研日期：2026-11-06
- 方法：用 lark-cli 遍历整个空间，共 1097 个节点（清单见 `wiki-tree.tsv`）→ 取回 691 篇 docx 的正文（排除 GUI Agent、效果评测、人力、BKS、车控 AI Coding 等无关目录），其中 679 篇取到、12 篇无权限 → 按关键词全文打分 → 精读下表文档。sheet / bitable 只记标题，没有读取正文。
- 时间说明：`obj_edit_time` 按本机时区换算。

## 0. register 文档的新鲜度检查

- register 里有 25 篇，其中 13 篇在本空间内。这 13 篇的最后编辑时间都早于 2026-11-05，不需要重读：
  - 编辑时间最新的是 H2 双周报（11-02 01:49）、语音基础体验 OnePager（10-30）、AIDV 端云 OnePager（10-27）、记忆方案（10-28）。
  - H2 双周报在 register 里标的是“部分正文”，本次补读了 10.20–11.02 这一期，结论见第 2 节。
- 另外 12 篇不在本空间，节点遍历拿不到它们的编辑时间，未核对：本地对话 PRD、VUI PRD、Director PRD、DT 宣讲、0825、端侧模型规划、产品 OnePage、HMI、记忆 PRD、1103/1104 文字记录、记忆打通、POI 同步。

## 1. 相关文档表

| 标题 | 链接 | 编辑时间 | 在 register 中 | 读取情况 | 与 V 章哪个主题相关 |
|---|---|---|---|---|---|
| 对话事件日志生成链路总结 | https://bytedance.larkoffice.com/wiki/K1DOwplkCiletAk9b7jcx622nDb | 2026-11-06 02:17 | 否（新文档） | 全文 | 人人对话 / 人机对话事件、context/sync、answer_source |
| 2026Q4研发进展同步 | https://bytedance.larkoffice.com/wiki/Eldewz5fniZ6k8kRiDWcMBylnTg | 2026-11-06 02:33 | 否 | 读 11.06 / 10.30 / 10.23 / 10.14 四期 | 端到端 3 秒目标、ASR prefetch、预请求命中率、成本 |
| 汽车服务端周报 | https://bytedance.larkoffice.com/wiki/FouOwkkXZihfATk4edEcclsln6g | 2026-11-06 02:23 | 否 | 细读 1102–1113 期，其余期按关键词抽读 | 耗时看板、ASR、Seeduplex、拒识 2.0、人人对话、历史压缩、记忆同步、输入管理 |
| 2026年H2服务端工程双周报 | https://bytedance.larkoffice.com/wiki/MvTIwiTZGif70SkNdtrcrM0lnsg | 2026-11-02 01:49 | 是（原为部分正文） | 补读 10.20–11.02 期 | 端侧 1.7B、流式拒识、AIBOX VLM、离线 NLU |
| [技术方案]输入管理模块设计 | https://bytedance.larkoffice.com/wiki/UsHgwkm2Sig3blkAttBclYb0n4g | 2026-10-23 05:02 | 否 | 全文（约 33K 字） | 输入管理、打断恢复、多音区合并、request_id |
| 云端ASR优化方案分析 | https://bytedance.larkoffice.com/wiki/KMiuwzIVRiknt7kTKpvchhPbn4c | 2026-10-30 04:43 | 否 | 全文 | 一遍/二遍、prefetch、definite、endpoint、预请求 |
| 端云交互协议汇总 | https://bytedance.larkoffice.com/wiki/WUIUwt0A3iiopekzU0Vc22HWn7c | 2026-10-30 02:49 | 否 | 全文 | request_id / round_id / sound_zone、edge-to-edge 指标、TTS 打断分类 |
| 云端离在线仲裁技术方案 | https://bytedance.larkoffice.com/wiki/BRtRwHgo4ivfr3k46LSciQi7nyd | 2026-08-18 04:55 | 否 | 全文 | 端云仲裁、request_id、白名单配置表 |
| 端侧离在线仲裁技术方案 | https://bytedance.larkoffice.com/wiki/PtGPwsX4iiFDAEkKMNYcUYYjnph | 2025-09-29 03:25 | 否 | 全文（短） | 端云 VAD 一致、taskId（历史方案） |
| 【AI汽车-PRD】离在线仲裁 | https://bytedance.larkoffice.com/wiki/DZzYwDOiviwAqHkeVx1cSFKinnh | 2026-08-03 03:02 | 否 | 全文 | 离线白名单、2 秒心跳、feel 意图 |
| 【AI汽车-PRD】多音区全时免唤醒交互 | https://bytedance.larkoffice.com/wiki/W7kxwMqwmitpjSkv9BAcakO1nSR | 2026-08-24 02:12 | 否 | 全文 | 全时免唤醒、多音区、强召回/强拒识、soft/hard vad 上云 |
| 【AI汽车-PRD】多人同时语音交互体验 | https://bytedance.larkoffice.com/wiki/U4xLwmQNki1Pu5kpyAGcHWtmngf | 2026-08-24 02:11 | 否 | 全文 | 多音区合并、排队、打断 |
| 【AI汽车-PRD】语音交互打断策略 | https://bytedance.larkoffice.com/wiki/FLlSwl1GoicNugkWWLCcFxtmnhl | 2026-02-10 22:55 | 否 | 全文 | 打断与续播 |
| 离线指令解析实验报告 | https://bytedance.larkoffice.com/wiki/RkKFwgMa3iUGAjkhklIcyc2MnSd | 2026-07-22 03:13 | 否 | 全文 | 端侧 Qwen3 0.05B/0.6B/1.7B 的 FC 与拒识指标 |
| AI Launcher：generate_input 与 skills 接口交接文档 | https://bytedance.larkoffice.com/wiki/UPraw6oy2iTmmfkT600cDdlKnRd | 2026-11-04 03:25 | 否 | 全文 | AI Launcher |
| AIDV task service 与 任务岛 & 即时交互卡技术方案 | https://bytedance.larkoffice.com/wiki/HzAtw3ABQif5c8kwKS8cL1x9nhf | 2026-10-29 07:22 | 否 | 前半部分（任务分类与展示） | 任务岛 / 即时卡 |
| 端状态&事件日志上报 One Page | https://bytedance.larkoffice.com/wiki/PRf0wRd3Uic0omkiiiGc70wanQN | 2026-09-12 09:48 | 否 | 全文 | 事件日志、Context 窗口 |
| 端到端性能分析 | https://bytedance.larkoffice.com/wiki/Sni4wDPIcizfHTkP0N4ccbq6nbg | 2026-09-03 13:06 | 否 | 全文 | VAD→TTS 各段耗时 |
| AI汽车2.6目标拆解 | https://bytedance.larkoffice.com/wiki/QiHywkYUeidVQwkhNDccCzPNndd | 2026-10-26 07:58 | 否 | 全文 | 历史目标：VAD 时长、瞬时/短期记忆、ASR 指标 |
| 可见即可说 - 问题分析流程 | https://bytedance.larkoffice.com/wiki/XGsTwmdzEitMoQkMquTcEbKMnjh | 2026-09-19 03:38 | 否 | 前半部分 | 热词（可见即可说） |
| 车端豆包会话隔离技术方案 | https://bytedance.larkoffice.com/wiki/VOxkwADeEiBOlwkIXLXc8Oj8n2f | 2026-09-01 22:31 | 否 | 前半部分 | 历史对话归属（每车一个会话） |
| 短期记忆总结摘要 | https://bytedance.larkoffice.com/wiki/JuhRwd4V6iVK3SkYYktcTSjKnsg | 2026-06-08 22:18 | 否 | 全文（只有配置，无规则） | 摘要记忆（没有新的数字） |
| 拒识（端云主链路下） | https://bytedance.larkoffice.com/wiki/CztmwYrnsi7wlBkVaUPcP4bQnrV | 2026-07-02 23:55 | 否 | 全文（只有标题，是目录页） | — |

以下文档已列出但没有精读（宁多勿少，供后续补读）：

- 主链路与架构：服务端 AIDV 架构梳理（SwaPw…，10-21）、AI汽车自建平台化链路（DxV9w…，10-16）、AIDV Planner One Page（EWziw…，09-10）。
- 事件与 query：事件(event)触发新一轮query技术方案（A3jYw…，10-08）、事件生产与使用迭代-技术方案（SiedwOa…，10-19）、上汽-query总结-技术方案（H0hdw…，04-20）。
- 端状态与指标：端状态上报链路与 Context 查询（XROEw…，10-20）、AIDV Metric 指标与 Argos 看板映射（WxQpw…，10-28，含 pre_query 指标）。
- 语音与 TTS：【AI汽车-PRD】离在线车载TTS服务（KlRgw…，10-20）、ASR与TTS 日志排查（WwpFw…，09-16）、VAD前置到客户端后云端音频协议变更（Ana1w…，2025-09）、自有语音链路技术调研（IO34w…，2025-11）。
- 测试与周会：AI 汽车测试周会（FwpPw…，11-02）。
- 测试报告 sheet（只有标题）：ASR识别（11-05）、拒识（10-29）、ASR热词&替换词（10-14）、离在线仲裁&离线指令解析（09-01）、离线cache（2025-12）、短期&情景记忆（10-29）。

## 2. 事实笔记

| 主题 | 事实 | 来源 + 段落 | 状态 |
|---|---|---|---|
| ASR 一遍/二遍 | 火山 ASR 每帧带三个字段：<br>- source：`stream` 表示一遍流式结果，`two_pass` 表示二遍结果。<br>- prefetch：按分句判断语义是否完整，阈值低；为 true 时可以用来做预请求。<br>- definite：触发云端 end_window_size（类似 hard vad）后的切句标识。<br>另有 endpoint，按整句语义完整（高阈值）加静默时长判断一句话是否说完。<br>样例“导航回家”（request_id e09b3e27…）：1024ms 时出现 stream“导航”；1360ms 时 stream“导航回家”且 prefetch=true；1584ms 时 two_pass 且 prefetch=true；1712ms 时 definite=true；最后是 is_last_package。 | 云端ASR优化方案分析 · 名词介绍、请求返回示例 | 线上协议字段（已有） |
| ASR 现状问题 | - 线上是一句话对应一个音频流，用户不说话时不发流。<br>- 基于流式中间结果做 TTS 打断和预请求，最终以尾包结果发起正式请求。<br>- 问题有三个：ASR 识别耗时长；预请求只看端侧 Soft VAD、没用 ASR 的语义完整性，**命中率 12%**；固定 VAD 切句过细，会触发 TTS 打断恢复。 | 同上 · 背景 / 当前问题 | 当时线上现状 |
| ASR 优化方案（选定方案二） | - 端侧新增上报 soft vad 信令，云端返回 prefetch / source / definite。<br>- 收到 hard vad 时，直接返回 prefetch=true 且 source=two_pass 那一帧的文本作为最终 ASR，不再等后面的空白帧。<br>- 方案二另加“火山强制判停事件”，强制提前过二遍。<br>- 预期提前约 300ms（P90）拿到正式文本，**待实测**。<br>- 方案三（小模型延长 VAD）不推荐。<br>- 方案四（长期）：判停交给 ASR endpoint，端侧 Hard VAD 只兜底；端侧要缓存每路近 1 秒音频；endpoint 之后的人声用新 request_id 重发。但火山暂不支持、只有豆包 ASR 支持；经验上 endpoint 也要约 800ms 静音。 | 同上 · 优化方案；Q4研发进展同步 11.06（1029 评审通过，1102–1103 开发，1104 联调）；服务端周报 1102 期 | 方案二：开发/联调中；方案四：长期方案 |
| 预请求规则（新） | - 所有 prefetch=true 帧的文本都会发预请求。<br>- 下一个 prefetch=true 帧的文本和上一个相同时，不再重复发。 | 云端ASR优化方案分析 · 多轮请求与预请求 | 已定方案（随方案二） |
| 预请求成本 | 上汽 DNA 复用 ToB 资源池的合并模型（意图 / 拒识 / 提槽）后，成本升到 ToB 车企第三：1600+ 活跃设备的调用量接近 200 万台 Tesla 的量级。主因是每次预请求都调一次 ToB 意图模型，正式请求没命中时还要再调一次（命中率 12%）。 | Q4研发进展同步 2026.11.06 · 成本优化 | 当时线上现状 / 问题 |
| 端到端耗时口径 | edge-to-edge 指标包括：vad_end_2_tts_play、vad_end_2_first_word、vad_start_2_asr_first_word、vad_end_2_asr_end_word、asr_end_word_2_tts_play、asr_end_word_2_first_word。 | 端云交互协议汇总 · 端侧 metrics | 已上线 |
| 端到端目标与现状 | - 目标：说完话到 TTS 首字 3 秒以内。<br>- 10.25–10.30 多次告警 P90>5500ms，最高 28.4 秒；1031–1102 定位为端侧上报偏差。<br>- 风险：DT 首字如果不能优化 400ms 以上，3 秒目标达不成。<br>- 本周看板 P50 / P90：拒识 215 / 254ms，上下文 275 / 362ms，Planner 首字 1020 / 1187ms，Planner 单轮推理 2142 / 2553ms，ASR VAD 结束到识别结束 117 / 266ms，TTS 首 Token 467 / 544ms。 | Q4研发进展同步 10.30 / 11.06；服务端周报 1102 期 · 数据看板 | 线上现状 |
| 端到端分段（历史） | 0615 实车数据：VAD 固定 500ms，ASR 300ms，拒识 210ms，Context 250ms，Planner 首字 900ms，TTS 首帧 450ms，合计约 3310ms；约 1/10 流量命中 soft vad 抢跑。 | 端到端性能分析 · 全链路0615 | 历史现状（2026-06） |
| VAD 目标（历史） | 2.6 目标里写的是 soft-VAD 200ms、hard-VAD 500ms、语义 VAD（语义不完整时多等）1000ms。 | AI汽车2.6目标拆解 · 语义VAD 行 | 历史目标（旧排期 S5–S11），和现口径不一致 |
| 热词 | - 可见即可说：车机用无障碍能力读取当前页可见控件文本 → 建立映射 → 注册为豆包热词 → 页面变化时刷新 ASR Context。<br>- 运行时：ASR 输出 → 归一化（“停一下”→“暂停”）→ 和已注册热词匹配 → 走无障碍点击或抖音 SDK 直调。<br>- 未命中只表示不触发快捷控制，不保证会走 GUI Agent 兜底。<br>- 另一项：个人 ASR 热词新增 POI 名称对应的地址信息，10.13 开发完成。 | 可见即可说-问题分析流程 · 一、二；服务端周报 1008 期 | 已上线（POI 地址热词：已完成开发） |
| 端云请求标识 | - 豆包链路 ext 里的 `vehicle_biz_params.coordination_info` 带：request_id（用于端云结果仲裁）、round_id、sound_zone（音区）、tts_emotion、force_sami_tts、direct_agent。<br>- 云端每帧下发 `vehicle_coordination_metadata`，包括 request_id 和 tts_audio_id。<br>- 渠道：master=1000，seres=99210，saic-dna=99220。 | 端云交互协议汇总 | 已上线 |
| request_id 语义 | - 端侧 ASR 识别文本的唯一标识，也是一次端云交互的唯一凭证，用于对话历史更新和语义仲裁。<br>- 一个 request_id 对应一个 question_id（豆包侧叫 message_id）。<br>- 字段对照：会话 conversation_id，话题 chat_id（豆包侧 section_id），一轮 question_id。 | 云端离在线仲裁技术方案 · 字段说明 | 已定方案 |
| 端云仲裁配置 | - 新表 `edge_side_dependency_config`，按 channel_app_id + vehicle_type + category + version 区分。<br>- category 包括：arbitration_white-list_vehicle-control（离线白名单车控）、offline_agent（offline_vehicle_basic_control 虚拟 Agent）、agent_register。<br>- 接口：GET /aidv/v1/edge_config。<br>- chat_histories 计划新增 history_source（0 云 / 1 端），标“待定”。 | 同上 · 详细设计 | 已定方案（部分待定） |
| 离在线仲裁 PRD | - 无网：用离线结果，理解不了时给兜底话术。<br>- 有网、非免唤醒：音频同时进离线和在线两条链路。命中端侧白名单就立刻执行；没命中就等云端；2 秒内没有心跳时，端侧兜底非白名单内容。<br>- 端侧意图为 feel（例如“我有点冷”）时必须等云端。<br>- 白名单包括：通讯录拨号、紧急电话、本地 / U盘 / 蓝牙音乐、媒体源切换、退出语音、应用开关、地图缩放、开始 / 结束导航、导航设置、倒车影像、危险警报灯。<br>- 常规车控**不进白名单**，例子：大夏天说“开座椅加热”，需要结合情景判断。 | 【AI汽车-PRD】离在线仲裁 v0.1（2025-09-15 已评审） | 已评审 PRD（早期版本） |
| 端侧仲裁（历史） | - 唤醒后同时建 RTC、建 IM、启动离线对话、拉配置。<br>- 难点：云端 VAD 要和端侧一致，否则 Speech 判不了停、RTC 超时。<br>- 端云用 taskId 标识同一轮。<br>- 云端结果先到时，要 block 住等端侧 LLM。 | 端侧离在线仲裁技术方案（2025-09） | 历史方案 |
| 端侧模型（1.7B） | 离线指令解析实验：<br>- Qwen3 1.7B Q4_K_M 跑在 Orin-X（AiBox）上：P50 234ms / P90 331ms / P99 427ms。<br>- 车控简单集完全准确 93.54%（20251023 版 95.4%，云端 97.6%），复杂集 81.84%，拒识准确率 90.42%。<br>- 0.05B CPU Q8_0：P50 282ms、完全准确 65.67%。<br>- token 压缩：例子从 12 个 token 降到 8 个，词典从 6400 扩到 7086。<br>- 20251030 版本按领域对比：1.7B 平均 93.6%、拒识 93.5%；云端平均 97.4%、拒识 97.32%。 | 离线指令解析实验报告 · 20250920–20251119 各版本 | 实验结论（2025 年数据） |
| 端侧 1.7B 近况 | - 新增支持智驾函数；QA 评测集函数准确率 90.38%（未 review）。<br>- 部署后掉点 2%，主要来自规则和白名单问题，量化本身掉点 <0.5%。<br>- 已按离线车控 FC 协议更新离线白名单（functions.jsonl）。<br>- “流式四合一”离线 NLU 引擎在造数据，并新增通信协议。<br>- 小语种（英 / 泰）缓存匹配在开发中。 | H2双周报 10.20–11.02 · 端侧LLM | 开发中 |
| 流式 / 语义拒识模型 | - 云端流式拒识用 **Qwen3 1.7B**：上汽线上 500 条流式打断，打断正确率 74.75%。<br>- 上汽端侧流式拒识模型已部署到 H20，和 SLS 最新端侧模型对齐。<br>- 语义拒识用 Seed-2.0-Lite：准确率 92.5%，过召 4.0%，过拒 3.1%。<br>- 另一期记录：流式拒识准确率 87.39%。 | H2双周报 · 拒识 / 算法段 | 线上 + 迭代中 |
| 拒识 2.0 | - 视线（gaze_state）辅助区分人人 / 人机：已联调，但赛力斯效果不达预期。<br>- 全时免唤醒态和延时聆听态两种模式：已开发完成，但产品调低了优先级。<br>- 模拟点击产生的 query 绕过拒识：未评审。<br>- 拒识模型调用约减少 30%：1109–1110 开发。 | 服务端周报 1102 期 · 语义理解 | 讨论中 / 开发中 |
| AI Box / VLM | - SLS AIBOX：DVT 共 34 台车装了带模型的 AIBOX；远程灌装成功率 1/3，单次约 7.5 小时。<br>- PVT 计划 1110 主链路联调、1115 提测、1122/1128 交付（风险高）。<br>- 模型有 seed 模型和 **Qwen3-VL-4B**（ViT W8A16 / LLM W4A16，高通 8797/8397）两条，综合评分初步持平 Doubao-Seed-1.6-flash。<br>- 2.6 目标：端侧 VLM TTFT≤3000ms，TPS≥50。 | H2双周报 · VLM / 风险表；2.6目标拆解 · 视觉感知 | 开发中 |
| 离线 / 端侧 DT | 全空间全文检索“离线DT / 端侧DT / 端侧 Director”的结果为 0，“30B”只出现在 2025-09 到 2026-04 的运营双周报里。本空间没有新的离线 DT 方案文档。 | 全文检索 | 证据缺口 |
| 输入管理（新） | - 位于各输入入口和 Director 之间，同一 Chat 同一时刻只允许一次 Director 执行生效。<br>- 输入优先级：用户 Query（单 / 多音区）是 P0；主动服务 advice、有效 Event、同步 ToolFeedback 是 P1。<br>- Chat 状态有三种：IDLE；PROCESSING（已启动但还没有首 Token）；RESPONDING（已在输出或播报）。<br>- P0 在 PROCESSING 时：旧输入还能重放就打断、合并后重推；已经放行 Tool call 就只处理新 Query，旧内容作中断上下文。P0 在 RESPONDING 时：客户端先停播，旧内容作中断上下文。<br>- P1 不抢占，排队等待；主动消息、Event 出队时合并处理，ToolFeedback 单独处理。<br>- 客户端接管：端侧召回并执行后，携带原 request_id 上报，云端结束该 Input 并让对应执行失效。<br>- 用户 Query 的幂等身份复用 CoordinationInfo.RequestID；新链路要求 request_id 非空（RTC 上行暂未携带）。<br>- 每次执行有唯一的 DirectorExecutionID，并且 TaskRoundID 等于它。<br>- 新 TTS 事件：STARTED / PROGRESS / FINISHED / ABORTED。临时人声只本地暂停；形成有效 P0 时上报 ABORTED；被拒识时继续原播报。 | 输入管理模块设计 · 本期范围、调度规则、客户端相关 | 开发中：10.23–11.13 开发（55%），11.16–18 实车，11.23–27 验收 |
| 打断恢复 | - 多人场景：流式拒识判为非拒识时打断，可恢复；以“豆包”开头时立即打断，可恢复。<br>- 单人场景：ASR 超过 2 个字立即打断，不恢复。<br>- 其他打断原因：ComeNewPlay、离线车控结果播报、退到静默态等，都不恢复。<br>- PRD 的续播规则：从被打断处前一个“，。！？”之后续播。<br>- 短期方案：收到非拒识结果后 1.5 秒内没有简单车控，就打断。 | 端云交互协议汇总 · TTS打断场景；打断策略 PRD；输入管理 · 其它背景输入 | 已上线（表中测试通过；VoiceSilence 待补充） |
| 多音区合并 | - 同时说：FC 下发前其他人还在说。合并格式为“主驾驶说'X'，副驾驶说'Y'”，只合并非拒识指令，最多 4 条，直接交 Planner，不走简单复杂仲裁。<br>- 有冲突时先澄清。<br>- 有效指令处理中又来了拒识语音时，不打断。<br>- 输入管理上线后，合并改由 Input Manager 交付 Inputs，多音区模块不再读 Redis 合并窗口。 | 多人同时语音交互 PRD；输入管理 · 多音区改造 | PRD 已定；改造开发中 |
| 全时免唤醒 | - 开关名暂定“陪伴模式”，默认开，四音区都支持。<br>- 音区开启：靠座椅传感器 + Face ID 判断座位有没有人，没人就不开该音区。<br>- 强召回：句首或句尾出现“豆包”。强拒识：摄像头识别到手持打电话时，拒识该音区。<br>- 激活后进入 30 秒连续对话，有效指令重新计时。<br>- 每 5 轮拒识做一次话题分类和总结，召回时带上前 5 个话题总结。<br>- 上云：端侧识别文本作为 soft vad 结果，先发云端 LLM，只跑到拒识意图模块；音频流式上云后的 ASR 作为 hard vad 结果；两者一致不重发，不一致重发。 | 多音区全时免唤醒 PRD v0.2 | PRD 已评审；话题总结属于 PRD 设想 |
| 人人 / 人机对话事件（新） | - chat_history 用 finish_type 区分：1=拒识 → 人人对话（resource_id `human_dialogue_content`，只保留用户 Query）；0=成功 → 人机对话（`bot_dialogue_chat` / `bot_dialogue_tool_call`）。<br>- answer_source：-1=云端拒识，1=端侧，0=Cloud，2=Planner，4=Agent。<br>- 在线链路：拒识 SFT 模型打分 → afterFlow 异步调用 ReportByChat。<br>- 端侧链路：离线或 Always-on 时端侧模型判拒识 → POST /context/sync 批量同步 → HistorySync 强制填 answer_source=1 → 新增的拒识记录按原始 CreatedAt 调用 ReportByChat。<br>- 端侧成功的对话目前**不生成**人机事件，也不触发短期记忆任务。 | 对话事件日志生成链路总结（基于 feature/20261102_event 分支代码） | 已确认的代码现状（分支）；在线 + 离线人人对话 1110 发版 |
| 事件使用 | - Context 按时间窗口注入事件，例如最近 10 分钟、最多 30 条。<br>- 高优事件可以作为 event 输入触发新一轮 query，例如 TTS 被拒识 query 打断、手动操作、上下车。 | 端状态&事件日志 One Page · 4.2 | 已定方案 |
| 历史 / 摘要 | - 对话历史压缩隐私隔离（新用户上车时过滤敏感信息，满足上汽合规）：10.21 评审，10.21–24 开发。<br>- 支持 yitu 查询历史压缩记忆：11.06–07。<br>- 端侧召回的历史对话按云端 DT 格式模拟，车控函数和可见即可说用不同 toolcall 格式。<br>- 事件白名单控制哪些事件进 SP。<br>- 短期记忆总结摘要文档只有 MQ 消费组 short_digest_memory 和 Redis 存取，**没有轮数或 token 数字**。 | 服务端周报 1102 期 · Context；短期记忆总结摘要 | 开发中 / 已上线（白名单 9.18 发版） |
| 瞬时 / 短期记忆（历史目标） | 瞬时记忆 = 前 20 分钟内的 20 条事件日志；短期记忆 = 上电到 20 分钟前（或 20 条之前）的事件日志压缩；短期记忆生成目标 ACC≥98%、耗时≤5 秒。 | AI汽车2.6目标拆解 · 长短期记忆 | 历史目标 |
| 记忆与车机同步 | - 记忆部分数据传给 SLS：10.20 开启合规审核。<br>- 客户 App 数据同步到车机记忆：11.6–11.16 梳理方案，计划 11.16 技术评审。<br>- 多人语义记忆隔离：开发支持中。<br>- 记忆支持改名：DONE。 | 服务端周报 1102 期 | 讨论中 / 开发中 |
| 会话归属 | - 每辆车一个独立的豆包会话：表 vehicle_conversation，以 doubao_uid + vehicle_id + channel 为唯一键。<br>- 会话名为“来自 xxx 的对话”；上汽 DNA 没有 VIN 尾号，只显示车型名。 | 车端豆包会话隔离技术方案 | 已定方案 |
| AI Launcher | - POST /input/generate：scene_type 取 launcher 或 showroom；generate_type 取 greeting / guiding / scene。模型温度 0.01；scene_task 最多 2 条；图片 URL 由服务端按 scene_type 查 TCC 补齐，不由模型生成。<br>- GET /skills 直接返回 TCC launcher.skill，有明暗两套图标和背景。<br>- 展示迭代 10.26 发版给 SLS。 | AI Launcher 交接文档；H2双周报 | 已上线 |
| 任务岛 | - 定时任务、条件任务只弹即时卡。<br>- 循环定时任务、常规长时任务（如“一路介绍热点新闻”）弹即时卡并进 AI Bar 任务岛。<br>- 按 execution_type / trigger_type / schedule_type 判断类型。 | task service 与任务岛技术方案 · 1.2 | 已定方案 |
| 全双工新方向 | 火山 S2T / Seeduplex 全双工：1030–1103 出链路方案，1104–1113 尝试接入主链路；context 和端状态的获取时机待定。 | 服务端周报 1102 期 | 讨论中 / 探索 |

## 3. 与已知口径的冲突或更新

1. **Soft VAD 300ms / Hard VAD 600ms**
   - 本空间里新的文档没有出现这组数字。
   - 2.6 目标拆解里写的是 soft 200ms / hard 500ms / 语义 VAD 1000ms，属于旧排期里的目标。
   - 0615 性能分析把 VAD 记为固定 500ms。
   - 建议：上课时把 300/600 标注为“register 来源的当前配置”，并说明历史目标值不同。来源：2.6目标拆解、端到端性能分析。
2. **预请求复用规则**
   - 和已知口径不冲突，补充了两点：
     - 云端 ASR 优化后，所有 prefetch=true 帧都会触发预请求，文本和上一帧相同则不重发。
     - 现状命中率只有 12%，ASR 优化的目标之一就是提高命中率。
   - 预请求的触发源会从“只看端侧 Soft VAD”变成“Soft VAD 加 ASR prefetch 语义完整”。目前处于开发 / 联调中（1104 联调），不能写成已上线。
3. **热词 7 类**
   - 本空间没有找到 7 类配额清单，无法核对。
   - 新增两点：个人热词加入了 POI 地址信息（10.13 开发完成）；可见即可说热词是按页面动态注册、动态刷新的。
4. **AIVA 9/30 后端侧本地 LLM 只在断网或云端 3 秒超时时兜底**
   - 离在线仲裁 PRD（2025-09 v0.1）写的是“2 秒内无心跳则端侧兜底非白名单内容”，白名单内的指令命中就立刻执行。
   - 时间阈值 2 秒 vs 3 秒存在差异，PRD 版本更早，应以 register 中更晚的 AIVA 文档为准，并标注历史差异。
   - 本空间没有找到“正则缓存抢跑”的原文；离线 cache 只有一个测试 sheet（2025-12）。
5. **端侧 1.7B 做语义拒识 / 意图 / FC**
   - 基本一致，有一处需要区分：H2 双周报里**云端**流式拒识也用 Qwen3 1.7B（部署在 H20，和 SLS 端侧模型对齐），而云端语义拒识用的是 Seed-2.0-Lite。
   - 建议把“流式拒识”和“语义拒识”拆开讲：1.7B 同时用在端侧和云端流式拒识。
6. **30B MoE 在 AI-Box 上做 VLM**
   - **有疑点。** H2 双周报 10.20–11.02 期写的 SLS AIBOX VLM 是 seed 模型和 Qwen3-VL-4B 两条路线，没有出现“30B”。
   - 建议标为“待确认：AIBOX VLM 的最终选型（seed 30B 还是 Qwen3-VL-4B）”。
   - 离线 DT 在本空间没有方案文档，维持“评估中”。
7. **摘要记忆从第 3 轮起滚动压缩，最多 22 轮 / 500 token**
   - 本空间没有这组数字，无法核对。
   - 新增“对话历史压缩隐私隔离”（新用户上车时过滤敏感信息），正在开发中。
8. **人人对话降级上报（10 句一包 / 沉默 30 秒 / 有效 query 时补报 / 网络恢复时补报）**
   - 本空间没有这组规则。
   - 新文档给出了云端落库口径：端侧通过 /context/sync 同步，answer_source=1，按原始 CreatedAt 生成人人对话事件；端侧成功的对话不生成人机事件。
   - 在线 + 离线人人对话计划 1110 发版。可以作为“补报到云端之后发生什么”的补充。
9. **新增的 V 章主题：输入管理（Input Manager）**
   - 它定义了打断、合并、排队、客户端接管的统一规则，是 V 章“交接给 DT”最后一跳的新方案。
   - 状态是开发中，11 月底验收，不能写成已上线。

## 4. 读取清单与失败项

- 遍历：1097 个节点，所有父节点都成功取到，没有报错。
- 正文：尝试取回 691 篇 docx，679 篇成功；初次遇到限流（99991400）的 20 篇改串行重试后已成功。
- 无权限（1770032 forBidden），共 12 篇：AI Car核心场景、yolo数据生成和预标注、yolo训练进度、事件日志算法文档、豆包汽车Director-RL技术分享、端侧模型-豆包 incar 1.0、Always on需求-豆包 incar 1.0、[豆包自我探索] 需求说明（2 篇）、AI介入判断-PRD、离线反思-需求沟通、生成式UI 任务管理 PRD。
- 没有读取：所有 sheet / bitable / file 节点；GUI Agent、效果评测、人力、BKS、车控 AI Coding 目录下的文档。
- 没有试用搜索接口：全空间正文已经本地取回并做了全文检索，这一步已覆盖搜索的需要。
- 证据缺口：
  - 热词 7 类配额、摘要 22 轮 / 500 token、人人对话降级上报规则、正则缓存抢跑、30B，在本空间都没有原文。
  - 这些口径大概率来自 register 中不在本空间的文档（AIVA PRD、1103/1104 文字记录等），本次没有重核。
