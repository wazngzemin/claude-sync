---
title: Driver Agent 2.0 Planner 系统概览
date: 2026-07-21
updated: 2026-07-21
tags: [concept, architecture, product, planner]
sources:
  - raw/articles/planner-sp-ground-truth.md
status: active
---

## 系统定位

豆包上车是搭载在上汽荣威 D6X 上的车载 AI 助手。Planner 是系统的"大脑"——不直接控制车辆，而是理解用户意图 → 制定计划 → 调度下游 Agent 执行 → 跟踪进度反馈。底层模型为豆包 Seed 1.8，部署在云端。

## 三层漏斗架构

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

## Planner 单次调用的输入结构

每次调用 = 向 LLM 发送一条 `[SP, UP]` 请求，获取 JSON 决策。

**SP（System Prompt，~30K-35K tokens）：**
- ①角色定义 → ②输入类型（user_query/advisor/tool_feedback）→ ③23个工具定义 → ④输出格式（talk_or_not/talk_content/action_list）→ ⑤10条注意事项 → ⑥69个参考示例（占SP约50%）→ ⑦车辆设备知识（D6X规格）→ ⑧工具使用tips → ⑨其他知识 → ⑩聊天风格（温柔高知女生）
- ⑪动态模板变量：{{status}}视觉感知 / {{goal_list}}目标队列 / {{env_info}}车辆状态 / {{memory}}用户记忆

**UP（User Prompt，~10K-15K tokens）：**
- 最近N轮 role:user / role:assistant 交替的对话历史
- 当前轮输入（用户query + advisor建议，以数组形式同时传入）
- user 侧有三种形态：用户query（含speaker_name/position/timestamp/goal_list/env_info）、advisor建议、tool_feedback
- assistant 侧：Planner的JSON输出（talk_or_not/talk_content/action_list）

## 23个下游工具

vehicle_basic_control / search_vehicle_status_info / search_weather / search_poi_qa / route_planning_qa / navi_basic_control / vehicle_manual_qa / search_and_control_short_video / search_and_control_music / search_user_memory / face_id_register / operate_user_memory / web_search / goal_list_update / ai_broadcast_generate / search_and_control_broadcast / recording_minutes / image_generate / search_visual_info / ambient_light_control / auto_drive / car_log / car_care_qa

## 四种任务类型

| 类型 | 说明 | 排期 |
|------|------|------|
| 单步复杂 | 一句话拆多动作并行（"我好热"→查车况+开空调+调风量） | S7 |
| 多步 | 串行依赖（"去昨天游泳馆"→查记忆→拿地址→导航） | S8 |
| 条件 | 设定触发条件（"10分钟后关座椅加热"） | S8 |
| 持续 | 持续运行（"帮我介绍沿途风景"） | S9-S10 |

## 缓存机制

- KV Cache（Prompt Cache）：输入前缀完全匹配时复用已算好的KV向量
- 同一请求内多轮调用：第2/3轮复用前序全部token的KV，只算增量（几百token），显著更快
- 跨请求：仅SP固定部分（~30K tokens）可命中；动态变量不同则缓存断裂
- 长对话（>20轮）→ KV Cache占用大 → 易被挤出 → 命中率下降 → 更慢

## 上下文优化方案（远区精简+近区完整）

将10轮历史分两区：远区（1-8轮）只保留 user query + talk_content，删除 tool_feedback 和 action_list；近区（9-10轮）完整保留。节省对话历史 40-70% token，总 input 减少约10%，但因 Attention O(n²) 实际计算量减少~19%。

## Goal List + Advisor 演进

从"Planner一人包揽"→"团队协作"：Planner管快速响应+执行，4个静态Advisor（舒适/出行/情感/内容）+ 动态Advisor管深度思考+目标监控，Goal List为共享看板。

## Badcase 排查路径

链路问题（走错模块）→ 工具描述问题（SP工具定义不清）→ 上下文问题（缺记忆/车况/情景）→ 模型能力问题（信息全但推理错）

## 已知挑战

任务拆解不稳定 / 简单复杂误分类 / 长对话上下文捕捉弱 / 车控幻觉 / 话术生硬 / Planner过载 / 性能vs质量矛盾
