---
title: 豆包汽车记忆系统
date: 2026-10-29
updated: 2026-10-29
tags: [entity, product, architecture]
sources:
  - raw/articles/product-lectures/2026-10-29/memory-product-lecture.md
  - raw/articles/product-lectures/2026-10-29/memory-prd.md
status: active
---

# 豆包汽车记忆系统

记忆系统把获准保存的对话、操作和车辆事件整理成经历、事实与偏好，在后续请求中返回相关内容。当前请求先由 Context 预取，信息不足时由 Director 显式查询。

生产侧区分情景经历、语义记忆和对话摘要；检索侧按人物、同乘范围、标签及相关性选择内容；管理侧提供开关、可见范围和删除。用户关闭记忆时冻结既有数据，删除才清理选定内容并更新受影响画像。

语音删除仍在开发、行为画像已做未用、家与公司单向同步等状态以 10 月 28 日宣讲为时点。原文和具体边界见[记忆宣讲摘要](../summaries/memory-product-lecture.md)。
