# Karpathy LLM Wiki — 项目 Schema

本项目是 **字节跳动豆包上车（Driver Agent 2.0）智能座舱** 的产品知识库，采用 Karpathy LLM Wiki 方法论维护。用户是该产品的 AI 产品经理，负责 Planner 模块。

---

## 领域知识：Driver Agent 2.0 Planner 系统

### 系统定位

豆包上车是搭载在上汽荣威 D6X 上的车载 AI 助手。Planner 是系统的"大脑"——不直接控制车辆，而是理解用户意图 → 制定计划 → 调度下游 Agent 执行 → 跟踪进度反馈。底层模型为豆包 Seed 1.8，部署在云端。

### 三层漏斗架构

```
用户语音 → ASR
    ↓
第一层：句法 RAG（毫秒级，规则匹配，处理"打开车窗"等明确指令）
    ↓ 处理不了
第二层：情景 RAG + 仲裁模型（注入用户记忆/车况/情景，判断简单/复杂分流）
    ↓ 复杂需求
第三层：Planner（云端 LLM 深度推理，多步规划，调用多工具）
    ↓
底层：下游 Agent 执行（车控/音乐/导航/搜索等），返回 tool_feedback
```

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

```
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
```

## 页面命名规范

- 使用小写英文 + 连字符：`my-topic.md`
- 中文主题可用拼音或英文翻译命名
- 文件名应简短、描述性强、可排序
- 同一主题的不同角度用子目录区分，不用后缀

## Frontmatter 格式

每个 wiki 页面必须包含以下 YAML frontmatter：

```yaml
---
title: 页面标题
date: YYYY-MM-DD          # 创建日期
updated: YYYY-MM-DD       # 最后更新日期
tags: [tag1, tag2]        # 分类标签
sources:                  # 引用的 raw/ 文件路径列表
  - raw/articles/xxx.md
status: draft | active | archived
---
```

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
