---
title: Director 产品宣讲与需求对照
date: 2026-10-29
updated: 2026-10-29
tags: [summary, meeting, product, architecture]
sources:
  - raw/articles/product-lectures/2026-10-29/director-product-lecture.md
  - raw/articles/product-lectures/2026-10-29/director-prd.md
  - raw/articles/product-lectures/2026-10-29/planner-exploration-prd.md
status: active
---

# Director 产品宣讲与需求对照

Director 与 Planner 在这套材料中指同一对话推理职能。用户请求、主动建议、工具反馈和事件提供不同输入；Director 结合当前背景生成话术与动作清单。

宣讲用多步依赖解释工具调用。缺少“昨天的泳馆”时先查记忆，返回确定地点后再导航。同批工具可以同时交办，结果汇集后统一决定回复；有前后依赖的动作分轮执行。

用户记忆、车况和当前请求共同影响决策。当前明确要求优先，旧偏好用于补足未说清部分；人员名称需要对应当前座位，车辆知识不会自动增加本车执行能力。

10 月 22 日宣讲中，人人对话未接入，若干端侧或高德复杂能力仍处测试阶段。P50 不超过 500 毫秒、P90 不超过 800 毫秒是推理时延目标，不能表述为线上实测成绩。

输入管理首期的续轮准入和独立异步 callback 范围需结合专门方案解释。同步工具反馈延续原目标；独立 callback 不能仅凭概念图写成当前实现。

相关页面：[Director](../entities/director.md)、[宣讲写法](../concepts/product-lecture-explanation.md)。
