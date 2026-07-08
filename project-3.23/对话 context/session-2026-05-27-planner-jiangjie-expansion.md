# 会话上下文记录

> 会话时间：2026-05-22 ~ 2026-05-27
> 会话 ID：4f11f3bc-3746-44f2-b8b4-679c95ad9265（延续）
> 模型：claude-opus-4-6

---

## 一、会话初始加载的文件上下文

### 1.1 wiki/log.md（操作日志）

```
---
title: Wiki Log
date: 2026-04-14
---

# Wiki Log

> Append-only 操作日志。记录所有 ingest / query / lint 事件。

| 时间 | 操作 | 目标 | 说明 |
|------|------|------|------|
| 2026-04-14 | init | — | 知识库初始化，建立三层架构目录结构 |
| 2026-04-14 | ingest | GUI_Agent问题分类.md | 创建 summary: gui-agent-problem-classification |
| 2026-04-14 | ingest | planner 会议.md | 创建 summary: director-optimization-meeting |
| 2026-04-14 | ingest | 会议记录.md | 创建 summary: meeting-notes-0327 |
| 2026-04-14 | ingest | 项目优化完整方案.md | 创建 summary: project-optimization-plan |
| 2026-04-14 | ingest | 小区图书馆管理系统 PRD | 创建 summary: library-management-system-prd |
| 2026-04-14 | ingest | 多篇素材 | 创建 entity: director, planner, gui-agent |
| 2026-04-14 | ingest | 多篇素材 | 创建 concept: sp-compression-strategy, planner-tool-simplification, evaluation-system |
| 2026-04-14 | ingest | 全部素材 | 更新 index.md，完成首轮 ingest |
| 2026-04-15 | ingest | 舱驾融合评测Query集方案 | 创建 synthesis: driver-agent-eval-query-set，101条评测case |
| 2026-04-20 | ingest | planner-prompt-v1~v3 + 问题点 + 优化方案 | 创建 summary: planner-prompt-evolution, concept: planner-sp-structure, 更新 sp-compression-strategy 关联链接 |
| 2026-04-20 | ingest | 司机Agent_统一评测集.md | 创建 summary: driver-agent-eval-unified，113条统一评测case |
| 2026-04-20 | ingest | 中自机.md | 创建 summary: seed-data-context-meeting，种子数据补 context 会议纪要 |
| 2026-04-20 | ingest | 中自机.md | 创建 entity: seed-data，种子数据实体页 |
| 2026-04-20 | ingest | PRD-智能座舱.md | 创建 summary: prd-pullover, entity: pullover-feature, concept: query-routing/pullover-state-machines/pullover-tools, 更新 director/planner 实体页 |
| 2026-04-20 | ingest | 会议纪要-0330.md | 创建 summary: meeting-0330-director, 更新 gui-agent/evaluation-system 页面 |
| 2026-04-20 17:14 | sync-feishu | car Wiki 空间 | 新增56篇，更新0篇 |
| 2026-04-20 17:14 | sync-feishu | car Wiki 空间 | 新增0篇，更新0篇 |
| 2026-04-21 10:21 | sync-feishu | car Wiki 空间 | 新增0篇，更新0篇 |
| 2026-04-21 14:30 | ingest | 功能详述/基础语音 + 任务拆解 + 主链路 共16篇 | 创建 summaries: in-car-voice-prd, multi-user-simultaneous-voice-interaction, multi-level-vad-product-experience, multi-zone-wake-free-interaction, online-offline-arbitration, voice-interaction-interruption-strategy, see-and-say-framework, task-planner-prd, public-context-management, cot-fast-slow-thinking-architecture, intent-understanding-task-planning-prompt-experiment, goal-driven-task-management, planner-2.6-goals-and-s7-iteration, tob-simple-complex-arbitration-upgrade, simple-complex-arbitration-test-analysis, offline-llm-command-parsing; 更新 index.md |
| 2026-04-21 15:30 | ingest | 功能详述/基础语音 + 任务拆解 补2篇 | 创建 summaries: out-car-voice-prd, cockpit-planner-onepage; 更新 index.md |
| 2026-04-21 15:45 | ingest | 功能详述全量素材 | 创建 entity: asr, vad, advisor, always-on; 创建 concept: wake-free, multi-zone-interaction, task-replan, funnel-principle; 更新 index.md |
| 2026-04-21 17:22 | sync-feishu | car Wiki 空间 | 批量上传 wiki 全量 52 篇到 Feishu（index/log/entities/concepts/summaries/synthesis），全部成功 |
| 2026-04-27 | ingest | 座舱Planner OnePage-1776677662.md + 1776677809.md | 新增两版本，更新 cockpit-planner-onepage.md：doubao-1.8切换计划、全局State管理、拒识思考机制 |
| 2026-04-27 | update | 用户调研（与赛力斯共创） round3.md | 创建 summary: user-research-seres-round3（文档为空模板）；创建 entity: seres；创建 concept: emotional-value |
| 2026-04-28 10:56 | sync-feishu | car Wiki 空间 | 新增191篇，更新0篇 |
| 2026-04-29 | ingest | 舱驾融合 2.0【AICar主线】司机Agent（舱驾融合）产品需求文档PRD 副本.md | 创建 summary: cabin-drive-fusion-2-0-prd；更新 entity: pullover-feature（2.0行车/泊车场景、豆包猎手）；更新 index.md |
| 2026-05-07 | query | 端侧触发器 PRD 会议复盘 | 创建 concept: meeting-communication-strategy，基于触发器方案评审会实际表现总结的语速、逻辑、压力应对改进策略 |
| 2026-05-20 15:30 | ingest | 三文档PM讲解_产品经理版.html + System Prompt + 测试案例 | 创建 concept: planner-system-deep-dive，综合三源素材深度拆解 Planner 全链路：漏斗架构、SP/UP结构、缓存机制、上下文优化方案、四种任务类型、Goal List + Advisor |
| 2026-05-21 10:00 | ingest | 座舱Planner OnePage 训练方案章节 | 创建 concept: planner-training-pipeline.html，Function Call 训练全流程可视化讲解：蒸馏管线、数据格式、并行/串行样例、两阶段目标 |
| 2026-05-21 15:30 | ingest | TOB简单复杂仲裁升级 + 测试结果分析 + OnePage 情景RAG 章节 | 创建 concept: scenario-rag-arbitration.html，情景RAG知识注入机制+仲裁模型SP四版演进+8类问题分类+90条评测数据对比 |
```

### 1.2 wiki/index.md（内容索引）

```
---
title: Wiki Index
date: 2026-04-14
updated: 2026-04-29
status: active
---

# Wiki Index

> 本索引列出了 wiki 中所有页面及其一行摘要。由 LLM 在每次 ingest/lint 操作时自动更新。

## 实体页 (entities/)

| 页面 | 摘要 |
|------|------|
| [[director]] | 车载语音助手核心对话推理引擎，以 SP 驱动，当前面临 PE 过长问题 |
| [[planner]] | Director 的任务规划子模块，负责意图拆解和工具调用决策 |
| [[gui-agent]] | 负责图形界面操作的工具模块（外卖/订座/咖啡/停车费），3-30 前紧急优化 |
| [[pullover-feature]] | 临停功能（Pullover）：智驾场景下即时/条件/目标三种靠边停车模式 |
| [[seed-data]] | 种子数据：为 Planner 构造的高质量结构化数据集，用于评测和数据泛化 |
| [[asr]] | 语音识别：在线/离线/方言三种模式，首字延迟≤200ms，句准率≥95% |
| [[vad]] | 语音活动检测：Soft/Hard/Semantic三级VAD及预执行机制 |
| [[advisor]] | 主动服务模块：基于Always On事件发现主动发起交互推荐 |
| [[always-on]] | 全时监听模块：端侧持续多模态聆听、情景理解、事件发现 |
| [[seres]] | 赛力斯：AI Car核心OEM合作伙伴，联合用户调研和产品共创 |

## 概念页 (concepts/)

| 页面 | 摘要 |
|------|------|
| [[sp-compression-strategy]] | SP 压缩策略：从 34K tokens 压到 15K 以下，静态+动态示例拆分 |
| [[planner-tool-simplification]] | Planner 职责分离方案：自然语言规划 + Flash 模型参数转换 |
| [[evaluation-system]] | 评测体系建设：评测集扩充、自动化脚本、核心指标定义、150条种子数据 |
| [[planner-sp-structure]] | SP 模块结构分析与 token 膨胀根源：7 个模块拆解、示例库占 50% |
| [[query-routing]] | Query 三层路由策略：句法RAG(<500ms) → 情景RAG(<1s) → 云侧Planner(1-3s) |
| [[pullover-state-machines]] | 临停五场景状态机设计：即时/条件/POI/视觉/手势，工程侧独立运行 |
| [[pullover-tools]] | 临停 5 个新增 Tool 体系：poi_search/visual_detect/gesture_resolve/condition_monitor/pullover_execute |
| [[wake-free]] | 全时免唤醒：无需唤醒词直接下达指令的交互模式，当前主驾已上线 |
| [[multi-zone-interaction]] | 多音区交互：按座位划分的音频区域识别与交互决策，定位精度±20cm |
| [[task-replan]] | 任务重规划Replan：下游agent失败或任务打断后重新生成执行计划 |
| [[funnel-principle]] | 漏斗原则：句法RAG→情景RAG→复杂Planner的三层分层处理架构 |
| [[emotional-value]] | 情绪价值：用户对车载语音助手情感陪伴 vs 工具理性的期望与平衡 |
| [[meeting-communication-strategy]] | 会议表达改进策略：语速控制、句子逻辑训练、被质疑时的反应训练、会前准备清单 |
| [[planner-system-deep-dive]] | Planner 系统全景深度拆解：三层漏斗、SP/UP结构、缓存机制、上下文优化、四种任务类型、Goal List + Advisor |
| [[planner-training-pipeline]] | Planner 模型训练全流程：Function Call 数据范式、蒸馏管线（Kimi K2→GPT-4o→SFT→RL）、并行/串行任务训练样例 |
| [[scenario-rag-arbitration]] | 情景RAG+仲裁模型深度拆解：知识注入四维信息源、仲裁SP四版演进、车控vs推理判断维度、8类问题分类、评测数据对比 |

## 对比分析 (comparisons/)

| 页面 | 摘要 |
|------|------|
| —    | —    |

## 源文件摘要 (summaries/)

| 页面 | 来源 | 摘要 |
|------|------|------|
| [[in-car-voice-prd]] | 【AI汽车-PRD】车内语音.md | 车内语音全链路PRD：唤醒、免唤醒、降噪、音区识别、语音识别、声纹识别 |
| [[multi-user-simultaneous-voice-interaction]] | 【AI汽车-PRD】多人同时语音交互体验.md | 多人同时语音交互：任务分类、合并策略、打断/恢复/排队机制 |
| [[multi-level-vad-product-experience]] | 【AI汽车-PRD】多级VAD产品体验.md | 三级VAD（Soft/Hard/Semantic）及预执行、语义完整性判断 |
| [[multi-zone-wake-free-interaction]] | 【AI汽车-PRD】多音区全时免唤醒交互.md | 多音区全时免唤醒：上下文继承、交互决策、反馈类型、安全确认 |
| [[online-offline-arbitration]] | 【AI汽车-PRD】离在线仲裁.md | 离在线仲裁逻辑、离线白名单、降级策略 |
| [[voice-interaction-interruption-strategy]] | 【AI汽车-PRD】语音交互打断策略.md | TTS打断策略：短期打断、实验性立即打断、恢复机制 |
| [[see-and-say-framework]] | 【AI汽车】可见即可说框架需求文档.md | 可见即可说框架：UI解析、命令生成、ASR匹配、优先级排序 |
| [[task-planner-prd]] | 任务Planner - PRD 【豆包 in car1.0】.md | 任务Planner核心PRD：任务拆解类型、工具库、性能/准确率目标 |
| [[public-context-management]] | 公共Context管理-豆包 【AI car 1.0】.md | 公共Context管理：13类Context、压缩与过滤策略 |
| [[cot-fast-slow-thinking-architecture]] | 基于COT的新快慢思考架构实验.md | COT快慢思考实验：感知-思考-执行三层架构、实验A-D、阶段目标 |
| [[intent-understanding-task-planning-prompt-experiment]] | 任务规划&意图理解 prompt 实验.md | Prompt工程实验：XML结构、任务队列JSON、子Agent建议处理 |
| [[goal-driven-task-management]] | 目标驱动的任务管理和对话管理体系.md | 目标驱动管理：目标列表、顾问体系、Planner职责、任务定义 |
| [[planner-2.6-goals-and-s7-iteration]] | Planner 2.6整体目标 和 s7迭代目标.md | Planner 2.6目标：性能/准确率、S7细化目标、仲裁意图规划 |
| [[tob-simple-complex-arbitration-upgrade]] | TOB简单复杂仲裁 针对AI汽车升级.md | TOB仲裁升级：长期方案、覆盖场景、评测数据对比 |
| [[simple-complex-arbitration-test-analysis]] | 简单复杂仲裁 测试结果分析.md | 仲裁测试结果：8类问题点、处理措施、情景推理示例 |
| [[offline-llm-command-parsing]] | 【AI汽车-PRD】离线LLM指令解析.md | 离线LLM指令解析：支持场景、拒识模块、指令缓存 |
| [[out-car-voice-prd]] | 【施工中】【AI汽车-PRD】车外语音.md | 车外语音PRD（施工中）：麦克风布置、唤起条件、控制范围、测试场景 |
| [[cockpit-planner-onepage]] | 座舱Planner-OnePage.md | 座舱Planner架构：句法RAG+情景RAG+简单/复杂Planner+多agent调度 |
| [[gui-agent-problem-classification]] | GUI_Agent问题分类.md | GUI Agent 三大类问题（指令理解/参数混淆/任务难度）及优化策略 |
| [[director-optimization-meeting]] | planner 会议.md | Director 优化讨论会纪要：四大问题、SP 压缩方案、分工与目标 |
| [[meeting-notes-0327]] | 会议记录.md | 注意力分散问题三大方案：示例浓缩/工具简化/知识补充 |
| [[project-optimization-plan]] | 项目优化完整方案.md | 完整优化方案文档：三大方案详解、GUI 专项、成功标准 |
| [[library-management-system-prd]] | 小区图书馆管理系统 PRD | 小区图书馆管理系统产品需求文档，纯前端 LocalStorage 方案 |
| [[prd-pullover]] | PRD-智能座舱.md | 临停功能 PRD：即时/条件/目标三种停车模式，5个新Tool，51条评测Query |
| [[meeting-0330-director]] | 会议纪要-0330.md | 3.30 Director进展对齐：评测集构建、SP优化、GUI bug分析、分工 |
| [[planner-prompt-evolution]] | planner-prompt-v1~v3 + 问题点 + 优化方案 | Planner SP 从 v1 到 v3 的版本演进、8 类问题点、6 类优化方案 |
| [[driver-agent-eval-unified]] | 司机Agent_统一评测集.md | 舱驾融合统一评测集：113条 case，三级场景分类，覆盖靠边临停+泊车 |
| [[seed-data-context-meeting]] | 中自机.md | 种子数据补 Context 分工会议：数据模块划分、字段规范、分工安排 |
| [[user-research-seres-round3]] | 用户调研（与赛力斯共创） round3.md | Round3用户访谈：驾驶习惯、情绪情感需求、豆包语音助手接受度调研 |
| [[cabin-drive-fusion-2-0-prd]] | 舱驾融合 2.0 司机Agent PRD 副本.md | 2.0 PRD：行车4类临停模式、泊车VLM参照泊入、豆包猎手抢车位 |

## 综合分析 (synthesis/)

| 页面 | 摘要 |
|------|------|
| [[driver-agent-eval-query-set]] | 舱驾融合司机Agent评测Query集：101条case，覆盖条件任务/目的地任务/异常边界三大类 |
```

### 1.3 .claude/CLAUDE.md（项目 Schema）

```
# Karpathy LLM Wiki — 项目 Schema

本项目是 **字节跳动豆包上车（Driver Agent 2.0）智能座舱** 的产品知识库，采用 Karpathy LLM Wiki 方法论维护。用户是该产品的 AI 产品经理，负责 Planner 模块。

---

## 领域知识：Driver Agent 2.0 Planner 系统

### 系统定位

豆包上车是搭载在上汽荣威 D6X 上的车载 AI 助手。Planner 是系统的"大脑"——不直接控制车辆，而是理解用户意图 → 制定计划 → 调度下游 Agent 执行 → 跟踪进度反馈。底层模型为豆包 Seed 1.8，部署在云端。

### 三层漏斗架构

用户语音 → ASR
    ↓
第一层：句法 RAG（毫秒级，规则匹配，处理"打开车窗"等明确指令）
    ↓ 处理不了
第二层：情景 RAG + 仲裁模型（注入用户记忆/车况/情景，判断简单/复杂分流）
    ↓ 复杂需求
第三层：Planner（云端 LLM 深度推理，多步规划，调用多工具）
    ↓
底层：下游 Agent 执行（车控/音乐/导航/搜索等），返回 tool_feedback

### Planner 单次调用的输入结构

每次调用 = 向 LLM 发送一条 `[SP, UP]` 请求，获取 JSON 决策。

**SP（System Prompt，~30K-35K tokens）：**
- ①角色定义 → ②输入类型（user_query/advisor/tool_feedback）→ ③23个工具定义 → ④输出格式（talk_or_not/talk_content/action_list）→ ⑤10条注意事项 → ⑥69个参考示例（占SP约50%）→ ⑦车辆设备知识（D6X规格）→ ⑧工具使用tips → ⑨其他知识 → ⑩聊天风格（温柔高知女生）
- ⑪动态模板变量：{{status}}视觉感知 / {{goal_list}}目标队列 / {{env_info}}车辆状态 / {{memory}}用户记忆

**UP（User Prompt，~10K-15K tokens）：**
- 最近N轮 role:user / role:assistant 交替的对话历史
- 当前轮输入（用户query + advisor建议，以数组形式同时传入）
- user 侧有三种形态：用户query（含speaker_name/position/timestamp/goal_list/env_info）、advisor建议、tool_feedback
- assistant 侧：Planner的JSON输出（talk_or_not/talk_content/action_list）

### 23个下游工具

vehicle_basic_control / search_vehicle_status_info / search_weather / search_poi_qa / route_planning_qa / navi_basic_control / vehicle_manual_qa / search_and_control_short_video / search_and_control_music / search_user_memory / face_id_register / operate_user_memory / web_search / goal_list_update / ai_broadcast_generate / search_and_control_broadcast / recording_minutes / image_generate / search_visual_info / ambient_light_control / auto_drive / car_log / car_care_qa

### 四种任务类型

| 类型 | 说明 | 排期 |
|------|------|------|
| 单步复杂 | 一句话拆多动作并行（"我好热"→查车况+开空调+调风量） | S7 |
| 多步 | 串行依赖（"去昨天游泳馆"→查记忆→拿地址→导航） | S8 |
| 条件 | 设定触发条件（"10分钟后关座椅加热"） | S8 |
| 持续 | 持续运行（"帮我介绍沿途风景"） | S9-S10 |

### 缓存机制

- KV Cache（Prompt Cache）：输入前缀完全匹配时复用已算好的KV向量
- 同一请求内多轮调用：第2/3轮复用前序全部token的KV，只算增量（几百token），显著更快
- 跨请求：仅SP固定部分（~30K tokens）可命中；动态变量不同则缓存断裂
- 长对话（>20轮）→ KV Cache占用大 → 易被挤出 → 命中率下降 → 更慢

### 上下文优化方案（远区精简+近区完整）

将10轮历史分两区：远区（1-8轮）只保留 user query + talk_content，删除 tool_feedback 和 action_list；近区（9-10轮）完整保留。节省对话历史 40-70% token，总 input 减少约10%，但因 Attention O(n²) 实际计算量减少~19%。

### Goal List + Advisor 演进

从"Planner一人包揽"→"团队协作"：Planner管快速响应+执行，4个静态Advisor（舒适/出行/情感/内容）+ 动态Advisor管深度思考+目标监控，Goal List为共享看板。

### Badcase 排查路径

链路问题（走错模块）→ 工具描述问题（SP工具定义不清）→ 上下文问题（缺记忆/车况/情景）→ 模型能力问题（信息全但推理错）

### 已知挑战

任务拆解不稳定 / 简单复杂误分类 / 长对话上下文捕捉弱 / 车控幻觉 / 话术生硬 / Planner过载 / 性能vs质量矛盾

---

## Wiki 知识库结构

raw/                    # 第 1 层：原始素材（不可变，LLM 只读不写）
├── assets/             # 图片、附件等本地资源
└── articles/           # 文章、网页剪藏等原始文件

wiki/                   # 第 2 层：Wiki 层（LLM 生成和维护）
├── index.md            # 内容索引：所有 wiki 页面的目录
├── log.md              # 操作日志：append-only 记录
├── entities/           # 实体页：人物、组织、工具、产品
├── concepts/           # 概念页：抽象概念、方法论、框架
├── comparisons/        # 对比分析页：A vs B 类型分析
├── summaries/          # 源文件摘要：每篇原始素材的摘要
└── synthesis/          # 综合分析：跨素材的深度综合

.claude/CLAUDE.md       # 第 3 层：Schema（本文件）

## 页面命名规范

- 使用小写英文 + 连字符：`my-topic.md`
- 中文主题可用拼音或英文翻译命名
- 文件名应简短、描述性强、可排序
- 同一主题的不同角度用子目录区分，不用后缀

## Frontmatter 格式

每个 wiki 页面必须包含以下 YAML frontmatter：

---
title: 页面标题
date: YYYY-MM-DD          # 创建日期
updated: YYYY-MM-DD       # 最后更新日期
tags: [tag1, tag2]        # 分类标签
sources:                  # 引用的 raw/ 文件路径列表
  - raw/articles/xxx.md
status: draft | active | archived
---

### 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| title | 是 | 页面标题 |
| date | 是 | 创建日期 |
| updated | 否 | 最后更新日期，lint 时更新 |
| tags | 是 | 至少一个标签 |
| sources | 是 | 引用的 raw/ 文件，`synthesis/` 页面至少两个 |
| status | 是 | 生命周期状态 |

## 三种操作流程

### 1. Ingest（摄入）

当用户提供新的原始素材或要求处理已有素材时：

1. 将新素材存入 `raw/articles/`（如果是新文件）
2. 阅读素材内容
3. 在 `wiki/summaries/` 创建对应的摘要页
4. 提取关键实体，在 `wiki/entities/` 创建或更新实体页
5. 提取关键概念，在 `wiki/concepts/` 创建或更新概念页
6. 更新 `wiki/index.md` 中的索引表
7. 在 `wiki/log.md` 追加一条 ingest 记录

### 2. Query（查询）

当用户提问关于知识库中的内容时：

1. 搜索相关 wiki 页面（通过 index.md 定位）
2. 必要时回溯 raw/ 中的原始素材
3. 如果涉及多个素材的比较，在 `wiki/comparisons/` 创建对比页
4. 在 `wiki/log.md` 追加一条 query 记录

### 3. Lint（整理）

当用户要求整理知识库或定期维护时：

1. 检查所有 wiki 页面的 frontmatter 完整性
2. 更新 `index.md` 确保索引完整
3. 检查是否有孤立的 wiki 页面（无 incoming/outgoing links）
4. 标记长期未更新的页面为 `status: archived`
5. 在 `wiki/log.md` 追加一条 lint 记录

## index.md 更新规则

- 每次 ingest 操作后必须更新
- 每次 lint 操作后必须更新
- 保持表格格式，每行包含页面链接和一行摘要
- 按子目录分区展示

## log.md 更新规则

- **append-only**：永远不修改或删除已有条目
- 每次操作追加一行到表格末尾
- 格式：`| YYYY-MM-DD HH:MM | 操作类型 | 目标文件 | 简要说明 |`

## raw/ 不可变规则

- `raw/` 下的文件是原始素材，**LLM 绝不修改**
- 如果需要修正，在对应的 wiki 页面中添加注释
- 新素材只能追加，不能覆盖已有文件

## 标签体系

使用以下标签分类（可扩展）：

- `entity` — 实体类页面
- `concept` — 概念类页面
- `comparison` — 对比分析
- `summary` — 源文件摘要
- `synthesis` — 综合分析
- `technology` — 技术相关
- `product` — 产品相关
- `methodology` — 方法论
- `meeting` — 会议记录
- `architecture` — 架构设计
```

### 1.4 Memory: User Profile

```
---
name: User profile
description: ByteDance AI PM on Doubao in-car intelligent cockpit (Driver Agent 2.0), non-technical, wants systematic/visual outputs
type: user
---
User is a **product manager at ByteDance (字节跳动)**, working on the **Doubao (豆包) in-car intelligent cockpit** — specifically the **Driver Agent 2.0 Planner system**, deployed on SAIC Roewe D6X (上汽荣威 D6X).

Key context:
- Role: AI 产品经理, responsible for the Planner module (task planning, tool orchestration, context management)
- Currently focused on: Planner latency optimization, context compression, badcase analysis
- Works with: Doubao Seed 1.8 model, 23 downstream tools, Goal List + Advisor architecture

Communication preferences:
- Systematic structure over fragments — content should flow as a connected learning path
- Visual logic diagrams (flowcharts, concept maps, decision trees) — not just text
- "Plugin-style learning" — modular, each module self-contained but building on the previous
- Immediately usable outputs — "看完就能用" is the standard
- Prefers very detailed breakdowns with concrete examples, real data, and step-by-step flows
- Frequently reads and shares articles, needs efficient retrieval of past analyses
```

---

## 二、前序会话摘要（Context Continuation Summary）

> 本会话是从前一个用完上下文的对话继续的。以下是前序会话的完整摘要。

### 2.1 主要请求与意图

用户是字节跳动 AI 产品经理，负责豆包上车智能座舱 Driver Agent 2.0 的 Planner 模块。

**前序会话的最后待办（本会话已完成）：** 创建情景RAG+仲裁模型的详细 HTML 文档。已完成为 `wiki/concepts/scenario-rag-arbitration.html`。

**本会话的显式请求：** 用户说：`'/Users/bytedance/Desktop/3.23/wiki/concepts/planner-jiangjie.md'这个文档还是不够足够详细啊` — planner-jiangjie.md 文档还不够详细，需要扩写。

### 2.2 关键技术概念

- **三层漏斗架构**: 句法RAG → 情景RAG + 仲裁模型 → Planner
- **情景RAG**: 知识注入层，4种信息源（用户记忆、车辆状态、情景、KnowHow）
- **仲裁模型**: Seed 1.6 Flash SFT 模型，二分类（车控 vs 推理），4版SP（V0.1-V0.4）
- **8类问题分类**: 条件任务, 持续任务, Face ID, 记忆增删改查, 需要记忆推理, 需要情景推理, 需要联网推理, 组合指令
- **SP/UP结构**: SP (~30K-35K tokens, 11个组件) + UP (~10K-15K tokens)
- **Planner 4个内部工具**: plan_describe, search_user_preferences, search_vehicle_status_info, plan_update
- **任务数据结构**: Status/Task/Plan/Checkpoint dataclasses
- **13类Context**: P0(情景描述/历史对话/事件日志/端状态/屏幕界面/用户记忆/任务状态/基础联网信息), P1(豆包探索/通用任务经验), P2(工具知识/特定专有知识/豆包性格)
- **Function Call训练管线**: Kimi K2蒸馏 → GPT-4o打分 → SFT → 评测 → RL
- **KV Cache / Prompt Cache**: 前缀匹配复用机制
- **上下文优化**: 远区精简(1-8轮) + 近区完整(9-10轮)

### 2.3 文件操作记录

**已创建的文件：**

- **`wiki/concepts/scenario-rag-arbitration.html`** — 情景RAG+仲裁模型综合HTML文档，11个章节，覆盖系统定位、知识注入机制、4种信息源、"我好热"示例、仲裁SP结构、4版SP演进、车控vs推理判断维度、8类问题分类、~90条评测数据对比、问题/改进措施、一页总结

**已大幅修改的文件：**

- **`wiki/concepts/planner-jiangjie.md`**（核心工作对象，从1490行扩写到1968行）
  - Frontmatter更新：新增4个source引用（OnePage, TOB仲裁, 测试分析, 公共Context管理），日期更新至2026-05-22
  - §3扩写：新增3.4（句法RAG输出格式，含directExecute JSON示例）、3.6（各任务类型模块划分全景，14行任务路由表）
  - §4大幅扩写（从~40行到~150+行）：新增4.2-4.10，覆盖四种信息源、输出格式JSON、"我好热"三种拆解完整示例、仲裁模型技术实现、仲裁SP结构、SP四版演进表、8类问题分类表、评测数据对比表（含从错到对/仍存在问题/过度召回三个表格）、长期方向
  - §10扩写：新增10.2，含4个Planner内部工具的完整JSON Schema定义（plan_describe, search_user_preferences, search_vehicle_status_info, plan_update）
  - §12扩写：新增任务数据结构（Python dataclass定义：Status, Task, Plan, Checkpoint），增强双侧更新机制、Replan/打断恢复/挂起的详细工程流程
  - §14扩写：从6类Context替换为13类（按P0/P1/P2分级组织），新增Context智能过滤策略，扩展SP/UP映射
  - §17扩写：新增FC训练动机（对比表）、训练数据格式（messages+tools JSON，含loss_weight机制）、并行/串行任务训练样例、5步训练管线

**已更新的文件：**

- `wiki/index.md` — 新增scenario-rag-arbitration条目到concepts区
- `wiki/log.md` — 新增scenario-rag-arbitration.html和planner-jiangjie.md更新的ingest记录

**已读取的源文件（未修改，遵守raw/不可变规则）：**

- `raw_cleaned/座舱Planner-OnePage.cleaned.md` — 架构、工具JSON Schema、任务定义、上下文管理、任务状态管理工程流程
- `raw_cleaned/TOB简单复杂仲裁 针对AI汽车升级.cleaned.md` — 4版仲裁SP、~90条评测query、8类问题分类
- `raw_cleaned/简单复杂仲裁 测试结果分析.cleaned.md` — 8个问题点和改进措施
- `raw_cleaned/公共Context管理-豆包 【AI car 1.0】.cleaned.md` — 13类Context（P0/P1/P2优先级）、压缩/过滤策略
- `raw_cleaned/三文档PM讲解_产品经理版.html` — 原始PM版讲解文档（14个章节）

### 2.4 问题解决方法

- **已完成**: 创建 scenario-rag-arbitration.html（前序会话待办）
- **已完成**: 扩写 planner-jiangjie.md — 识别4个薄弱区域（§4, §10, §14, §17）加上§3和§12，全部用5份源文档的具体数据扩写
- 方法：读取所有源文件 → 逐章节与现有wiki文档对比 → 识别差距 → 用实际数据（JSON、代码、表格、评测结果）扩充

---

## 三、本轮会话交互记录

### 3.1 用户请求

> `'/Users/bytedance/Desktop/3.23/wiki/concepts/planner-jiangjie.md'这个文档还是不够足够详细啊`

### 3.2 Assistant 操作

1. 统计 planner-jiangjie.md 行数：1968 行
2. 读取 wiki/log.md 尾部确认最新记录
3. 向 wiki/log.md 追加 update 记录：

```
| 2026-05-22 | update | planner-jiangjie.md + 4篇补充素材 | 深度扩写 concept: planner-jiangjie（1490→1968行）：句法RAG输出格式、任务模块划分全景、情景RAG+仲裁详细拆解、4个内部工具JSON Schema、任务数据结构+工程流程、13类Context体系、FC训练管线详述 |
```

### 3.3 Assistant 回复

planner-jiangjie.md 扩写完成，从 **1490 行 → 1968 行**（+478 行，增幅 32%）。补充了以下 6 个维度的具体细节：

| 扩写章节 | 新增内容 | 数据来源 |
|----------|----------|----------|
| §3 三层漏斗 | 句法RAG输出JSON格式、14行任务模块划分全景表 | OnePage |
| §4 情景RAG+仲裁 | 四种信息源、仲裁模型技术实现、SP四版演进表、8类问题分类、90条评测数据对比（三张表） | TOB仲裁升级 + 测试分析 |
| §10 工具体系 | plan_describe / search_user_preferences / search_vehicle_status_info / plan_update 四个内部工具的完整JSON Schema | OnePage |
| §12 任务状态管理 | Status/Task/Plan/Checkpoint 四个 dataclass 定义、双侧更新机制、Replan/打断恢复/挂起三条工程流程 | OnePage |
| §14 上下文管理 | 从6类→13类Context（P0/P1/P2分级）、智能过滤策略、SP/UP映射 | 公共Context管理 |
| §17 训练管线 | FC训练动机对比表、训练数据格式（messages+tools+loss_weight）、并行/串行任务样例、5步管线 | OnePage |

如果还有某个章节需要进一步展开，告诉我具体方向。

---

## 四、会话后续操作记录（log.md 已修改的后续条目）

> 以下是本会话结束后到2026-05-27期间，wiki/log.md 中追加的操作记录：

```
| 2026-05-26 17:30 | synthesis | 5份外部评测资料(AI Agent评测入门/Agent评测方法论梳理/Director评测重点/车载评测2.0/豆包汽车如何更像人) | 创建 synthesis: planner-eval-methodology-outline,对外分享方法论详细大纲,演进叙事8章,HTML嵌入式骨架图与流程图,部分脱敏(产品名/竞品),含场景化×过程归因×像人三重构 |
| 2026-05-26 19:00 | ingest | Planner SP 讨论.html (5.22会议) | 创建 summary: meeting-0522-planner-sp-discussion (草稿，仅捕获开场约5分钟转录)；议题：注意事项 #5/#8合并、合规规则缺失、自我时间感知双处重复；待补议题二的11个例子可用率评测 |
| 2026-05-26 19:30 | update | meeting-0522-planner-sp-discussion | 全量补完会议转录 (1h20min)：注意事项 4 大问题、16 个示例逐条评审、9 条全场决议 (D1=用户必回/D2=advisor询问优先/D3=Harmony工程硬限制等)、11 项 TODO、PM 视角 4 个 takeaway；状态 draft→active |
| 2026-05-26 20:00 | synthesis | 同 5 份外部评测资料 + planner-eval-methodology-outline | 创建 synthesis: planner-eval-methodology (正文)，Part 0-8 + 附录全量；10 个 HTML 嵌入式图表 (骨架/产品演进/场景定义/搭建原则/三层视角/7类归因/对抗vs全局打分/像人三层/5阶段流水线/飞轮)；5+ 真实 case 拆解 (多指令并行/Context 冲突/任务节奏失控/记忆感知冲突/过度执行)；5 条对外建议 |
| 2026-05-26 20:45 | sync-feishu | planner-eval-methodology.md | 推送到飞书 ai car 空间 wiki/concepts 节点；新建 doc (doc_id: ZO8QdCgFvo86zSxpdF9cj5dqnOb, URL: feishu.cn/wiki/MlUEwNZY1ixd0Eka1sGcCd1LnFe)；分 6 段 append 完成 (87KB)；HTML 块按预期被剥成纯文本 (用户已确认接受此退化)，结构与内容完整 |
| 2026-05-26 21:30 | synthesis | meeting-0522 + Planner SP 全文 + planner-jiangjie + planner-sp-structure | 创建 synthesis: sp-revision-analysis-0522，会议决议对 SP 的修改影响分析：Part 1 (9 条决议精确定位+改前/改后/作用/理由)、Part 2 (16 个示例改动清单)、Part 3 (13 项会议未讨论但应优化的点：双 param bug/notice 覆盖不均/动态变量边界/goal_list 注入污染等)、Part 4 (修改后 token 预算 + badcase 消除沙盘 + 遗留张力)、Part 5 (整改 P0-P3 优先级) |
| 2026-05-27 12:00 | update | sp-revision-analysis-0522 | 用户提供会议后修改版 SP，重写为新旧 SP 严格 diff 分析：Part 1 已落地 8 项修改（双 param 修复/示例编号连续/工具描述精简/输出 schema+emoji_id 必填/聊天风格+8 主动性原则等）、Part 2 未落地决议 6 条 (D1/D2/D3/D5/D6/D8 全未落地，D7 部分但本质未改)、Part 3 新引入问题 8 项（核心：【静默记忆】原则与 D7 决议正面冲突，示例 17/18 直接示范违反；示例 5/8 bug 未修）、Part 4 13 优化点状态表+10 新优化建议、Part 5 P0-P3 优先级矩阵 |
| 2026-05-27 12:15 | lint | 项目根目录全量归档 | 把根目录 25 个散文件 + `场景知识/` 63 个 + `培训/` 4 个 + `端侧触发器 - PRD_2026-05-06.../` 13 个对象全部分类到顶层中文前缀目录（产品-/场景知识-/Prompts-/脚本-/元数据-）。删除旧壳 01_/02_/03_/04_/99_/培训/场景知识/端侧触发器dump。raw/ raw_cleaned/ wiki/ Recordly/ 未动。旧版本进 _archive/ 全部保留。详见根目录 MIGRATION_LOG.md |
| 2026-05-27 13:45 | synthesis | planner-eval-methodology + planner-jiangjie + planner-system-deep-dive + planner-sp-structure + scenario-rag-arbitration | 创建 synthesis: planner-eval-methodology-internal（内部版）。基于对外版 8 Part 骨架，全量去脱敏：豆包/Driver Agent 2.0/D6X/Seed 1.8/23 工具/SP 11 模块/UP/4 任务类型/Goal List+Advisor/KV Cache 全部按真名出现。每 Part 末尾新增"钉入 Planner"业务子节(共 11 个子节)：1.4(1.0 在 Planner 12 个模块的盲区)、2.4(3 个产品变化↔Planner 模块映射)、3.8/3.9(场景元素↔SP/UP 字段 + 4 任务类型分布)、4.8/4.9(Badcase 4 层↔7 类归因 + SP ⑤ 条款作检查点)、5.7(像人 8 维度↔SP ⑩⑪/Goal List 监控点)、6.6(5 阶段流水线↔Byteval/Fornax/PromptPilot)、7.6(Planner 7 个业务挑战↔评测覆盖)、8 钉入(5 条建议↔Q2/Q3 5 个动作)、附录全文索引。生成完整 HTML 渲染版(planner-eval-methodology-internal.html, 144KB, 32 卡片块/19 表格/11 章节)。橙色"📌 钉入 Planner"子节明显标识。 |
```

---

## 五、用户当前请求

> 将这个终端窗口里面的上下文,全部原文不动的整理成markdown文档,并且放在这个文件夹中'/Users/bytedance/Desktop/3.23/对话 context'
