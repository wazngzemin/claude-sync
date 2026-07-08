---
name: feedback_fork_internalization_format
description: "How the user wants articles/forks turned into something he can actually use — workflow remodel, not analysis"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 6f4179a3-b5f0-426f-b5bc-b967bad378b0
---

fork 文章时，用户要的是**严格按 article-forker SKILL** 输出，且**每次必须同时给两份：详细教程(concept.md) + 工具(tool.html)**，不要只给一个、不要留着等确认。深度对标 forks/2026-05-27-markdown-is-programming/concept.md（369 行、贴他真实 SP/23工具/触发清单、带真实模板+本周P0/P1/P2）。

**最致命的教训（2026-06-08 反复翻车）：必须先读透"他给的实际原文"，忠实于文章真正的论点，不能套模板。** 数据治理那篇：我做成了"怎么把 Skill 治理做得更好"，但黄钊的题眼是反转——"关键恰恰不是数据治理（那是无底洞陷阱），真出路是 AI First 重设计让数据从源头按规则产生"。把 fork 做成了作者明确否定的结论 = 没读他的文档。务必抓住作者**真正强调/反对**的是什么，再落到他工作上。

他明确拒绝/踩过的雷：
- 学术拆解（论证链/隐含假设/破绽单独堆给他看）——看不懂、带不进工作（但 source.md 内部仍按 deep-read-guide 做）
- 自作主张加戏（如"对内/对外""X 草稿"——没让写就别写）
- 把"深"丢掉换成几张薄卡片——"一点也不深、没按 skill"
- 套通用模板而不读原文真实论点

**Why**：他评判产出看两条——①是否忠实文章真正想说的；②是否够深且能内化进他 Planner/触发器日常工作 + 喂养输出闭环（见 [[user-content-creator-system]]）。
**How to apply**：① 先逐字读他给的原文，提炼作者真正的 thesis（尤其反转/否定句）；② 严格按 skill 出 source+concept+tool 三件套，每次都给 concept+tool 两份；③ concept 深度对标 markdown-is-programming，贴他真实工作内容。关联 [[feedback_fork_workflow]]。
