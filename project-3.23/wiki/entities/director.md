---
title: Director（对话推理引擎）
date: 2026-04-14
updated: 2026-10-29
tags: [entity, technology]
sources:
  - raw/articles/product-lectures/2026-10-29/director-product-lecture.md
  - raw/articles/product-lectures/2026-10-29/director-prd.md
  - raw/articles/planner 会议.md
  - raw/articles/项目优化完整方案.md
  - raw/articles/GUI_Agent问题分类.md
  - raw/articles/PRD-智能座舱.md
status: active
---

# Director（对话推理引擎）

## 定义
Director 是车载语音助手中的核心对话推理模块，负责理解用户意图、规划任务、调用工具并生成响应。整个系统以 SP（System Prompt）为核心驱动。

## 2026 年 10 月宣讲中的职责

Director 与 Planner 是同一对话推理职能的名称。收到用户请求及相关背景后，它选择工具、解释返回结果并决定下一轮动作。前一步缺少的信息由工具补齐后，再进行依赖它的下一步。

用户请求与背景 → Director / Planner → 工具调用 → tool_feedback → 原目标下一轮判断。

下列优化与临停笔记保留原记录时点，不作为 10 月全部现行能力清单。最新宣讲见[Director 产品宣讲](../summaries/director-product-lecture.md)。

## 核心问题
- **PE 过长**：当前 SP 约 32,800 tokens（含变量约 34,000），导致注意力分散和性能不稳定
- **幻觉问题**：回答时产生不存在的信息（如虚假记忆）
- **工具调用决策错误**：错误调用/重复调用/无限试错
- **多任务丢失**：混合任务中丢掉部分子任务

## 优化方向
1. SP 压缩（目标 15,000 tokens 以下）
2. 动态示例加载
3. 模块化拆分（工具模块、知识模块、示例模块）
4. 长期：模型训练替代 SP

## 相关人员
- 主责人：晓伟（产品）、明骏（开发）
- 算法：李强、赵磊、华健

## 临停功能中的角色
Director 在临停功能中是总调度入口。Query 经过路由后：
- 即时临停：**不经过 Director**，句法 RAG 直接调 `pullover_execute`
- 条件/目标临停：经过 Director → Planner 编排 Tool 调用链
- 子场景 B（途经点临停）：Director 仅做意图识别，下发信号给 AD 侧 VLA

## 关联页面
- [[planner-tool-simplification]]
- [[sp-compression-strategy]]
- [[evaluation-system]]
- [[pullover-feature]]
- [[query-routing]]
