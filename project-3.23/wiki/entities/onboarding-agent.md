---
title: 新手引导 Agent
date: 2026-11-05
updated: 2026-11-05
tags: [entity, product, architecture]
sources:
  - raw/articles/onboarding-2026-11-05/11-04-afternoon-transcript.md
  - raw/articles/onboarding-2026-11-05/11-04-evening-transcript.md
status: archived
---

# 新手引导 Agent（历史提案，本期不采用）

11 月 4 日下午曾提出独立业务模块，统一管理账号引导状态并编排已有能力。晚间 28:59–29:08 明确当前无需该模块，本期不做独立新手引导 Agent。

此前生成稿错误地将该架构作为主方案，现已纠正。当前职责为：语义模型判断场景相关性；触发器检查组合条件、下发建议和计次；DT 沿既有链路处理对话及工具操作。不得将历史提案当作当前架构或已上线模块。

见[当前 PRD](../synthesis/onboarding-agent-prd.md)及[方案演变](../comparisons/onboarding-agent-vs-trigger.md)。
