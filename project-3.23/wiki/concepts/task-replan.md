---
title: 任务重规划 Replan
date: 2026-04-21
updated: 2026-04-21
tags: [concept, architecture, planner, ai-car]
sources:
  - raw/articles/功能详述/任务拆解/座舱Planner-OnePage.md
  - raw/articles/功能详述/任务拆解/任务Planner - PRD 【豆包 in car1.0】.md
status: active
---

# 任务重规划 Replan

## 定义

Planner在下游agent执行失败或任务被打断后，重新评估当前状态并生成新的可行执行计划的能力。

## 触发条件

1. **下游Agent执行失败**：agent无法成功执行planner下发的任务，返回失败原因
2. **用户主动打断**：新query打断未完成的plan
3. **挂起任务恢复**：条件满足后从挂起状态恢复执行

## 处理流程

1. 接收失败信息 / 新query / 恢复通知
2. 综合失败原因、当前上下文、前一轮checkpoint
3. 调用 `plan_describe` 生成新计划
4. 下发给下游agent执行

## 关键设计

- **Checkpoint机制**：保存中断时的plan状态和任务进度
- **任务可改写**：重新描述任务但不改变用户原始目标
- **状态追踪**：每个任务状态（PENDING/COMPLETED/FAILED）对planner完全可见

## 关联

- 依赖：[[planner]]（中枢调度能力）
- 相关概念：[[funnel-principle]]（漏斗原则下的分层处理）
