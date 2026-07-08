---
title: Advisor 主动服务模块
date: 2026-04-21
updated: 2026-04-21
tags: [entity, product, agent, ai-car]
sources:
  - raw/articles/功能详述/任务拆解/座舱Planner-OnePage.md
  - raw/articles/功能详述/任务拆解/目标驱动的任务管理和对话管理体系.md
status: active
---

# Advisor 主动服务模块

## 定义

AI汽车的主动服务（Proactive Service）模块，负责在特定场景下主动发起交互，而非被动等待用户指令。例如识别用户上车后主动打招呼、推荐打开座椅通风等。

## 属性

| 属性 | 说明 |
|------|------|
| 触发来源 | Always On模块的事件发现、定时任务、位置触发等 |
| 典型场景 | 上车问候、舒适建议、安全提醒、内容推荐 |
| 执行方式 | 生成主动服务计划，由[[planner]]调度执行 |
| 能力要求 | 输出内容需清晰合理，planner模型才能准确执行 |

## 示例

> 明骏上车了，他今天戴了个大墨镜，可以吐槽下他装帅，另外车里很热，可以打开座椅通风和强劲制冷几分钟后再关掉。

## 关联

- 上游触发：[[always-on]]（事件发现和场景理解）
- 执行依赖：[[planner]]（任务规划和agent调度）
