---
name: lark-cli-feishu-write
description: 写飞书用本机 lark-cli（用户说的“飞书个人助手”），feishu-readonly MCP 只能读
metadata:
  node_type: memory
  type: reference
  originSessionId: 1761c757-b426-4906-8c68-9ae96568e27f
  modified: 2026-11-11T09:40:58.210Z
---

本机 `/Users/bytedance/.npm-global/bin/lark-cli` 已以用户身份授权（王泽民），可创建/更新 docx、导入文件、建白板、改 wiki。用户称它为“飞书个人助手”，要求直接操作飞书而不是给本地文件。

常用：`lark-cli drive +import --file x.docx --type docx --name ...`（图片表格保留）；`lark-cli docs +fetch --doc <url>` 回读核对；`docs +update` / `+media-insert` / `+whiteboard-update`（mermaid/plantuml 可生成原生白板）。token 会过期，`lark-cli auth status` 查看。


建文档最稳的做法（2026-11-17 验证）：`docs +create --api-version v2 --doc-format xml --content @./file.xml`（文件须在当前目录），正文里直接写 `<whiteboard type="mermaid">…</whiteboard>` 生成原生画板；返回的 new_blocks 里有画板 token，可用 `docs +media-download --type whiteboard` 看缩略图，`docs +whiteboard-update --input_format mermaid --overwrite --yes` 重画。格式参考在 ~/.workbuddy/connectors-marketplace/connectors/feishu/skills/lark-doc/references/lark-doc-xml.md。命令前加 LARK_CLI_NO_PROXY=1 可去掉代理告警。

**How to apply:** 涉及飞书写入时先用它，别再说“只能读”。新建文档优先；覆盖用户原文档前先确认。相关：[[feishu-deliverable-with-flowcharts]]
