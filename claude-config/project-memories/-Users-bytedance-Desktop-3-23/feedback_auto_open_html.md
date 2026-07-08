---
name: feedback-auto-open-html
description: 生成HTML文件后自动用open命令在浏览器打开，不要等用户要求
metadata: 
  node_type: memory
  type: feedback
  originSessionId: bcc66689-3261-4336-a773-15cbb750b206
---

生成HTML文件后，立即用 `open` 命令在浏览器中打开，不要等用户要求。

**Why:** 用户明确说了"你以后生成完成就会直接帮我打开好吗"，每次都要手动打开很烦。

**How to apply:** 每次 Write 完 .html 文件后，紧跟一个 `open "<路径>"` 的 Bash 调用。
