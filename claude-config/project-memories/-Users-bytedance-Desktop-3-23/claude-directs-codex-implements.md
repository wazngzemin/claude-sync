---
name: claude-directs-codex-implements
description: 用户要求的协作模式——Claude 定验收标准并审查，Codex CLI 负责改文件，最多 3 轮修复
metadata:
  node_type: memory
  type: feedback
  originSessionId: d1d6888c-c947-4227-bbf6-6d61c9195d26
  modified: 2026-11-14T10:32:01.219Z
---

从 2026-11-13 起，用户要求按“Claude 指挥与验收、Codex 实现”工作：Claude 把需求整理成验收清单，通过 `/Users/bytedance/.local/bin/codex exec` 下发；同一任务保存并续接 Codex 会话 ID（`codex exec resume <id>`）；只有 Codex 改项目文件；Claude 必须亲自检查结果（网页用浏览器、桌面应用用 computer use，内容要核对事实/逻辑/来源）；最多 3 轮修复，未检查项标“未验证”，不以 Codex 自报完成为证据。

**Why:** 避免双方同时改文件冲突，并确保交付经过独立验收。
**选模型（2026-11-18 更新）：** 用户指定以后所有 Codex 任务都用 GPT-6.2 Sol Max，即 `-m gpt-6.2-sol -c model_reasoning_effort=max`（11-18 实测可用；日志里 Responses WebSocket 连不上的报错可忽略，会自动改走别的连接）。以下为旧记录——**（2026-11-13）：** Codex 默认用的是 gpt-6-astra，用户嫌它太笨。写作类任务改用 `-m gpt-6.1-sol -c model_reasoning_effort=max`，要对比哪个模型效果好，不能只盯着当前这个。给 Codex 的任务说明里，要写清它常犯的错（爱套模板、爱做表格、压缩成结论、堆限定语、把核验过程放进页面），并附上标杆样稿。

**Claude 是大脑（2026-11-14）：** 用户批评我“丢三落四、推一推才往前走、让 Codex 牵着走”。起因是多个 Codex 并行写作，各写各的，同一个部件（比如车上的 1.7B 模型）第一次出现时没讲清，到后面才补全。规矩是：并行写作之前，我先写一份“部件卡片”，作为全章唯一标准，列出每个部件的模型、位置、输入、输出、训练、数字；再规定每个部件第一次出现在哪里、要讲全哪些内容，之后出现都用统一叫法点回前文；交付后我逐个核对第一次出现的位置。

**How to apply:** 用户提到用 Codex 做任务时默认此流程；最终交付给出位置、验收结果、截图、未解决问题。相关：[[learning-site-detail-standard]]
