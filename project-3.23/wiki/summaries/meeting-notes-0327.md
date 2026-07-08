---
title: 会议记录 2026-03-27
date: 2026-04-14
tags: [summary, meeting]
sources:
  - raw/articles/会议记录.md
status: active
---

# 会议记录 2026-03-27

> 针对上次问题的优化方向讨论

## 核心问题：注意力分散
模型注意力会丧失或不聚焦，无法很好参考其他 context。

## 三大解决方案

### 方案一：示例浓缩提纯
- 精简核心示例，保留 10+ 个最核心 case
- 核心示例需覆盖：多工具协同、串行/并行判断、困难场景处理、个性化需求理解
- 其他内容转为动态知识 + 示例模式，前置筛选层

### 方案二：工具复杂度简化
- Planner 只输出自然语言描述
- 用单独 Flash 模型做二次思考，区分"补充信息"还是"新任务"
- 将 GUI 相关知识放入 Flash 模型
- 所有复杂工具（生图等双参数输出工具）应用相同思路

### 方案三：补充知识和示例
- 针对 badcase 补充缺失知识、增加思考方法示例
- 采用动态检索方式

## 重点任务

### 紧急：GUI Agent 优化（截止 3-30）
1. 把澄清指令当成闲聊 → 补充知识 + 示例
2. 工具参数混淆 → 拆 agent 处理

### 中期：示例和知识浓缩提纯
- 先思考方案，后续讨论确定

## 分工
- GUI Agent 问题：优先处理
- Prompt 优化（知识和示例浓缩提纯）：并行推进

## 关联页面
- [[director-optimization]]
- [[planner-tool-simplification]]
- [[sp-compression-strategy]]
- [[gui-agent-problem-classification]]
