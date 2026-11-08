---
title: 上汽定时任务与触发器产品分工
date: 2026-10-13
updated: 2026-10-13
tags: [product, architecture, synthesis]
sources:
  - raw/articles/saic-timed-trigger-20261013/doc0.md
  - raw/articles/saic-timed-trigger-20261013/partner_first.md
  - raw/articles/saic-timed-trigger-20261013/partner1.md
  - raw/articles/saic-timed-trigger-20261013/external0.md
status: draft
---

# 上汽定时任务与触发器产品分工

上汽纯定时任务由弋途定时能力承接。用户条件任务由动态 Advisor 向豆包触发器注册场景；条件满足后回调动态 Advisor，再由其向 Planner 提交执行建议。后台预置场景按配置的下游动作处理，不默认等于用户任务。

本次读取飞书正式 SOR、DNA-530、DNA-616、Director PRD 与内外触发器接口正文，并按用户指定赛力斯文档结构形成完整评审稿，包含 3 张业务图、6 个案例、状态变化、修改取消与证据表。

完整交付：[产品定义 Markdown](../../产品/codex/PRD-上汽定时任务与触发器整体流程-v01.md)、[Word 文档](../../产品/codex/PRD-上汽定时任务与触发器整体流程-v01.docx)。

DNA-616 的分钟粒度、循环最小间隔 1 分钟、超过 365 天拒绝、模糊日期转条件任务作为产品规则；端侧计时和断网提醒是版本演进依据，不等于当前实车全部已验收。跨下电、旧回调拦截、循环锚点和状态回写需确认。

当前飞书《任务系统》和《动态 advisor-感知订阅【技术设计】》无读取权限；必过集只能读表结构，记录行缺授权。完整交付已逐项披露，未使用会议 AI 纪要推定结论。

## 2026-10-13 v02 飞书交付

用户要求标准 PRD 并细化流程图。v02 已写入当前字节账号的[飞书文档](https://bytedance.larkoffice.com/wiki/M9JewRfhLi5ZGvkGMTocWuUKnFg)，正文为 8 章、15 条功能需求、13 项待确认决定、17 条候选验收，配有 6 张原生可编辑白板。文档和 6 张白板均已回读，520 个图形/文本/连接节点数量及全部文字匹配；正文 17 张表、8 个主章节和来源链接保留，未遗留图片占位。已在浏览器查看正文目录、架构及创建注册白板。

补充通用[任务中心 PRD](https://bytedance.larkoffice.com/wiki/LUKKwMTNaiAd53kdmpkc5oILn5e) v0.3 2026-09-15；其状态、容量、暂停、删除确认均须核对上汽适用阶段。产品规则和建议分开，文档发布不代表车端实现或联合验收完成。本地正文保留于 `产品/codex/PRD-上汽定时任务与触发器整体流程-v02.md`，发布回执、回读与预览保留于 `产品/codex/上汽定时任务-v02-delivery/`。
