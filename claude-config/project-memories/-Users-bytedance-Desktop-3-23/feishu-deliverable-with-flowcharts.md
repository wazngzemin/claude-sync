---
name: feishu-deliverable-with-flowcharts
description: 宣讲稿/PRD 类交付必须带流程图，并直接给可导入飞书的格式，不要只给 Markdown
metadata:
  node_type: memory
  type: feedback
  originSessionId: 1761c757-b426-4906-8c68-9ae96568e27f
  modified: 2026-11-11T09:37:57.673Z
---

用户的文档交付要直接是飞书可用格式，并且必须带流程图——流程图是他文档的“经典内容”。只给纯文字 Markdown 会被打回。

**Why:** 2026-11-11 强化触发器宣讲稿时只交了 Markdown，用户反馈“里面也没有流程图啊，那是我的经典内容啊，还有你要直接给我飞书文档格式啊”。

**How to apply:** 改写/强化飞书文档时，每个关键链路（架构、时序、判断分支、模式切换）配一张图；feishu-readonly 无法写入，就输出 .docx（图片内嵌，飞书「导入 → Word」可转在线文档），并提醒原文档里的图读取工具看不到、需保留位置。宣讲稿篇幅：以图为主、每章 1 张图 + 3～5 条要点（约 6 千字）用户确认“合适”；4.9 万字的逐条展开版被评“过于详细”，只作备查。给作者看的改正清单不放进宣讲稿，放在回复里。相关：[[learning-site-detail-standard]]
