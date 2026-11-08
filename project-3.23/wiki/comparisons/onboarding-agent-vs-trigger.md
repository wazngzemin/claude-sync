---
title: 新手引导 Agent 与轻量触发方案
date: 2026-11-05
updated: 2026-11-05
tags: [comparison, product, architecture]
sources:
  - raw/articles/onboarding-2026-11-05/11-04-afternoon-user.txt
  - raw/articles/onboarding-2026-11-05/11-04-evening-user.txt
status: draft
---

# 新手引导方案演变：晚间链路替代下午 Agent 提案

| 项目 | 下午 Agent 主张 | 晚间本期方案 |
| --- | --- | --- |
| 入口 | Agent 统一承接新手引导 | 语义相关性进入触发器组合条件 |
| 判断 | 按场景编排所需原子能力 | 一个相关性模型加已有状态条件 |
| 触发器 | 按需复用，不是所有场景必经 | 主要负责组合条件与成功次数 |
| 结果 | Agent 管理业务档案和下游结果 | 继续补充触发器到 DT 的回传 |
| 关注点 | 新功能、车型复用和业务边界 | 本期复杂度、响应时点和交付压力 |
| 状态 | 历史提案，本期不采用 | 当前需求基线：不做独立新手引导 Agent |

两者都要求用户交互走 DT 主链路；都不能凭空获得历史上下文、首次工具状态或播报回执。不能以“存在一个模型”证明这些输入已经接通。

当前[触发链路 PRD](../synthesis/onboarding-agent-prd.md)只采用晚间方案。此前将下午 Agent 提案作为主方案的生成稿有误，已纠正；会末提到需与下午参会方沟通，不构成恢复旧方案的依据。参见[历史 Agent 提案](../entities/onboarding-agent.md)和[结果分层](../concepts/onboarding-outcome-stages.md)。

