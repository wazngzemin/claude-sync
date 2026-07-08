---
title: Planner（任务规划模块）
date: 2026-04-14
updated: 2026-04-20
tags: [entity, technology]
sources:
  - raw/articles/planner 会议.md
  - raw/articles/项目优化完整方案.md
  - raw/articles/PRD-智能座舱.md
status: active
---

# Planner（任务规划模块）

## 定义
Planner 是 Director 的子模块，负责将用户意图拆解为具体任务，并决定调用哪些工具、以什么顺序执行。

## 核心问题
1. **参数混淆**：需同时输出"创建任务"和"补充信息"两种参数，模型经常混淆
2. **任务拆解不完整**：错拆、漏拆、多拆
3. **示例过多**：当前有 61 个示例，导致 SP 膨胀

## 优化方案
- **职责分离**：Planner 只输出自然语言规划，Flash 模型做参数转换
- **动态示例**：根据当前工具返回动态加载相关示例（类似 skill 机制）
- **静态 + 动态示例拆分**：保留 10-15 个核心静态示例，其余动态检索

## 优化目标
- 指令分发准确率 ≥ 95%
- 建任务准确率 ≥ 90%

## 临停功能中的角色
Planner 在临停功能中编排 5 个新增 Tool 的调用链：
- 条件临停：解析条件语义 → 调用 `condition_monitor(register)` → 不参与持续监控
- POI 临停：调用 `poi_search` → 选择最佳 POI → 调用 `pullover_execute`
- 视觉临停：调用 `visual_reference_detect` → 判断结果 → 调用 `pullover_execute`
- 手势临停：调用 `gesture_direction_resolve` → 确认方向 → 调用 `pullover_execute`
- 子场景 B：仅下发 `waypoint_pullover_intent` 信号，不调用 Tool

**注意**：即时临停不走 Planner，句法 RAG directExecute 直接调 `pullover_execute`。

## 关联页面
- [[director]]
- [[planner-tool-simplification]]
- [[sp-compression-strategy]]
- [[pullover-feature]]
- [[pullover-tools]]
- [[query-routing]]
