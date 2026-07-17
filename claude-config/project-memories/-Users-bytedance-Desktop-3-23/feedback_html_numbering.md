---
name: feedback-html-numbering
description: Every new HTML must increment version on top of the previous one — never start fresh or overwrite; always check existing versions first
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 1bc22f45-c525-4efa-bd55-81bcea6e7677
---

生成 HTML 时，**必须在上一个版本的基础上递增版本号**，绝不从零开始、绝不覆盖。

**铁律：**
1. **先查再写**：生成前，先 `ls` 目标目录，找到同主题已有的最高版本号
2. **在已有版本上递增**：新文件 = 上一版内容 + 本次改动，版本号 +1（如 `v3` → `v4`，或 `3-xxx.html` → `4-xxx.html`）
3. **不能从头写**：即使用户说"重新生成"，也要基于上一版迭代，而非另起炉灶
4. **不能覆盖**：旧版本文件保留不动，新版本是新文件
5. 文件名必须带版本号或序号，无编号的 HTML 不允许产出
6. **【2026-07-15 血泪补充】文档内部版本标注必须同步改成当前号** —— 不只是文件名。cp+Edit 做增量迭代时最易犯：文件名从 v2 一路递增到 v6，但文档内部 header 和底部 `.version` 一直停在 v2，用户打开 -v6.html 看到内容标 v2，等于版本号白带。规则：① 顶部 header 放醒目版本徽标（如"📌 当前版本 v6"）一打开就看到；② 底部 `.version` 写当前号 + 版本历史（每版一句话改了啥）；③ 每次 +1 时这两处跟文件名一起改。

**Why:** 用户多次强调这一点仍被忽略。每个版本代表一次迭代决策，必须可追溯。覆盖或重写会丢失历史。用户 2026-07-15 明确发火"v6是哪个啊，你为什么就是不记"——根因就是内部标注没跟文件名同步，让文件名的版本号形同虚设。

**How to apply:** 每次要生成 HTML：第一步 `ls` 查已有版本 → cp 最新版为版本号+1的新文件 → 在其上修改 → **同步改顶部版本徽标和底部 version 标注为当前号** → `open` 打开。收尾前 `grep` 一次内部版本号，确认和文件名一致再交付。
