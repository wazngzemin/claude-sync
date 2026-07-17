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

已多次因未及时open被批评（2026-07-16 连续两次发火"我之前一直告诉你生成完成就直接给我打开，你为什么不听"）。根因=常把open拖到一串编辑/验证命令之后，或埋在grep验证命令末尾被输出冲掉，看着像没打开。

**How to apply:** 每次 Write 或 Edit 完 .html，**紧接着一条独立、干净的 `open "<路径>"` Bash 调用**——不拖到最后、不跟 grep/验证混在一条命令里、不等所有编辑做完。哪怕还要继续改，也先 open 当前状态。
