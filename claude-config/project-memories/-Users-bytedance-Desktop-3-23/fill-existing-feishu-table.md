---
name: fill-existing-feishu-table
description: 用户给出已建好的飞书表格时，只往他负责的空格里填内容，不改表结构，不拿方案给他审
metadata:
  node_type: memory
  type: feedback
  originSessionId: 55133df1-e818-4f59-9a43-c40e49c0e09e
  modified: 2026-11-19T03:24:43.997Z
---

2026-11-19 做上汽主动服务表时，我先让 Codex 出改表方案、新增行，又准备再续一轮 Codex。用户打断说“表格已经建好了，你直接往里面填内容就行了，不要修改啊”。他只负责“系统预设任务”那一行。

**Why:** 表是团队共用的，结构和别人的行都不能动。用户要的是把内容填进去，不是一份改表方案。
**How to apply:** 先查表里哪些行归用户负责（看“负责产品”“实现方式”列），只填这些行里空着的格子；不加行、不加列、不覆盖别人写的内容；填完回读核对。相关：[[lark-cli-feishu-write]]、[[claude-directs-codex-implements]]
