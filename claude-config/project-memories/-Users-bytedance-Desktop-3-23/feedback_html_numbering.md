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

**Why:** 用户多次强调这一点仍被忽略。每个版本代表一次迭代决策，必须可追溯。覆盖或重写会丢失历史。

**How to apply:** 每次要生成 HTML 时，第一步永远是 `ls` 目标目录查已有版本 → 读取最新版内容 → 在其基础上修改 → 写入版本号+1的新文件 → `open` 打开浏览器。
