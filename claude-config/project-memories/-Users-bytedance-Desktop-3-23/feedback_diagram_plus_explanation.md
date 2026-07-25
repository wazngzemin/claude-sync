---
name: feedback_diagram_plus_explanation
description: "交付讲解类产物必须\"图+解释\"双轨——是流程就画流程图（带菱形判断/泳道/线上标\"为什么\"），是概念就给解释；纯文字表格堆满=不合格"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: ddf869f8-26a9-4361-ad9b-97afdb1ee68e
---

泽民 2026-07-23 批评 FC 详解 v1（纯文字表格）："我说了该画流程图的画图，该解释的进行解释啊"。

**Why:** 他是非技术背景产品，纯文字/表格的长页面读不动链路逻辑；流程性的东西必须一眼看到走向和分支。

**How to apply:**
- 交付讲解类 HTML 时先问：这块内容是"流程/链路/状态机/泳道"吗？是→必须出流程图（页面内嵌 SVG 即可，菱形=判断节点、矩形=动作、箭头带文字说明"为什么走这条"）。
- 是概念/对比/清单→继续用表格+解释框。
- 一图配一文：每张图下面跟一段"讲给你听"的解释，图管直觉、文管细节。
- 与 [[feedback_trigger_diagram]]（线标为什么/按流程分色/别换他骨架）和 [[feedback_html_numbering]]（版本递增）配套执行。
- 已落地样例：`车控SFT-FC模型详解_v2.html`（图①仲裁流程/图②五组件/图③SFT数据流/图④四泳道case）。
