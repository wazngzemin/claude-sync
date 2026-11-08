---
title: 新手引导结果分层与计次
date: 2026-11-05
updated: 2026-11-05
tags: [concept, product, architecture]
sources:
  - raw/articles/onboarding-2026-11-05/11-02-transcript.md
  - raw/articles/onboarding-2026-11-05/11-04-evening-transcript.md
status: draft
---

# 新手引导结果分层与计次

条件命中、advice 发出、DT 采用并推理、端侧开口、播报完成或中断、功能实际成功是不同结果。后一步没有证据时，不能以前一步代填。

11 月 2 日曾讨论以端侧开口计次；本期按 11 月 4 日晚间后段方案，以 DT 开始本条引导建议的对应推理作为处理成功计次依据，由触发器维护。实际回传及关联接口仍需联调。

产品需要将功能档案、本次执行记录、注册或记忆业务结果分开。采用本期 DT 对应推理口径时，只能说系统处理过建议，不能说用户已知晓。已有触发器一次性限制不等于已有下游闭环。

每条场景统一按本期处理成功口径计次，重复和乱序回传不得重复计次；拒绝范围、状态未知与晚到处理需要明确。这些补充规则为[新 PRD](../synthesis/onboarding-agent-prd.md)建议，尚待评审。

关联：[Agent](../entities/onboarding-agent.md)、[会议核验](../summaries/onboarding-meetings-2026-11-04.md)。

