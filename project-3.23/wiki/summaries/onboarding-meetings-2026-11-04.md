---
title: 新手引导三场会议核验
date: 2026-11-05
updated: 2026-11-06
tags: [summary, meeting, product, architecture]
sources:
  - raw/articles/onboarding-2026-11-05/11-02-transcript.md
  - raw/articles/onboarding-2026-11-05/11-04-afternoon-user.txt
  - raw/articles/onboarding-2026-11-05/11-04-evening-user.txt
  - raw/articles/onboarding-2026-11-05/11-06-semantic-trigger-alignment.md
status: active
---

# 新手引导三场会议核验

11 月 2 日先讨论用条件任务做功能告知，明确已有“只推一次”能力，缺少下发后的结果关注。原表记忆场景是介绍记忆能力，不是检索历史记忆。

11 月 4 日下午，刘杨提出按账号管理功能档案，由独立新手引导 Agent 统一承接业务，按需调用触发器、任务、DT 和上下文。端侧交互仍经 DT 主链路。下午要求产品细化后再评审，不代表已上线。

晚间 29:08 明确本期不做独立新手引导 Agent；34:07 取消固定二次校验；35:34–37:04 收敛为“单模型语义相关性 → 触发器组合条件 → DT → 结果计次”。本期 PRD 采用晚间方案，下午架构仅为历史提案。会后沟通事项不改变当前需求方向。

37:19–38:11、40:14–40:26 明确由触发器按 DT 是否开始本条建议的对应推理计次；播报和功能成功另外记录。回传关联机制仍需联调。

记忆同步后问候是另一场景：准确触发点为同步完成，不是激活完成；FaceID 可跳过；由 DT 检索真实记忆后组织问候。账号、授权、同步状态与功能档案分别处理。

相关页面：[新手引导 Agent](../entities/onboarding-agent.md)、[结果分层](../concepts/onboarding-outcome-stages.md)、[方案对照](../comparisons/onboarding-agent-vs-trigger.md)、[本次 PRD](../synthesis/onboarding-agent-prd.md)。


## 11 月 6 日补充：语义触发功能逻辑对齐会议

依据用户粘贴的文字记录（raw/articles/onboarding-2026-11-05/11-06-semantic-trigger-alignment.md），参会人为单如水、王泽民、张嘉锋。

- **已确认结论**：语义触发是后台预设的静态入口，不像动态 Advisor 或长时任务那样实时解析 query 来生成条件。产品在配置平台配置判断逻辑和示例，语义识别模型就多一个选项；全流量 query 在已有选项中做选择题。这条链路可以承接新手引导。
- **讨论中观点**：新选项通过变量注入逐个加入同一个模型。多条语义条件之间的冲突校验不是最优先，等功能跑通后再补。静态 Advisor 目前没有基于对话的判断，以后如果有了可以复用。
- **待办**：11/9（周一）19:00–20:00 与刘杨、超伟对齐。“超伟”按逐字稿原样记录，未核实是谁。
