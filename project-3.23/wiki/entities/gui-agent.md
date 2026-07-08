---
title: GUI Agent
date: 2026-04-14
tags: [entity, technology]
sources:
  - raw/articles/GUI_Agent问题分类.md
  - raw/articles/会议记录.md
status: active
---

# GUI Agent

## 定义
GUI Agent 是负责图形界面操作的工具模块，能通过理解界面元素来完成操作任务（如在小程序中搜索、点击、填写等）。

## 核心问题
1. **指令理解错误**：把澄清指令当闲聊，不执行任务
2. **工具参数混淆**：创建任务 vs 补充信息参数混淆
3. **任务难度高**：GUI 操作涉及复杂界面交互，错误容忍度低
4. **下游工具能力不足**：如搜索能力差（搜"川菜馆"无结果，搜"川菜"才有）

## 当前用途（3.30会议确认）
- 点外卖、订座、订咖啡、交停车费（仅4个用途）

## 紧急程度
- 截止日期：2026-03-30（最高优先级）
- 需要交付成果

## 优化方向
- 短期：补充知识 + 示例，解决指令理解
- 中期：工具链路重构，Planner 职责分离
- 建议：去上海体验 Pad 实际使用场景

## 关联页面
- [[gui-agent-problem-classification]]
- [[planner-tool-simplification]]
- [[director]]
