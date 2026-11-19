---
name: codex-no-browser
description: 下发给 Codex 的任务要禁止它启动 Chrome/Playwright，否则用户桌面反复弹“Google Chrome 意外退出”
metadata:
  node_type: memory
  type: feedback
  originSessionId: 8dd7d7ad-e8f7-4a56-b0c7-ff3578d8a2ca
  modified: 2026-11-17T11:57:14.698Z
---

Codex 在 workspace-write 沙箱里启动 Google Chrome / headless shell 会崩溃，macOS 每次都会给用户弹“Google Chrome 意外退出”对话框，用户 2026-11-13 问“为什么每次都弹这个”。

**Why:** 弹窗打扰用户，且 Codex 的浏览器自检本来就跑不通。
2026-11-17 补充：Codex 自带 browser 插件的 iab（内置浏览器）后端在 `codex exec` 模式下不可用，报错 "The browser access host is unavailable"；它只能联网搜索。Codex 打不开的网页，由 Claude 用浏览器面板打开再交给它；必须明确告诉用户哪些页面打不开及原因（用户要求）。

**How to apply:** 给 Codex 的任务说明里写明不得启动任何浏览器；打印页数、屏宽等检查由 Claude 自己做，优先用内置浏览器面板或 Playwright 的 chrome-headless-shell，不调用用户的 /Applications/Google Chrome。相关：[[claude-directs-codex-implements]]
