---
name: feedback-article-absorption-format
description: 泽民每天读多领域文章要的产物=「文章吸收解析」固定格式;不是fork工具/不是梁宁复盘/不是晨读判级门
metadata: 
  node_type: memory
  type: feedback
  originSessionId: f178f9f8-caec-4d40-913a-4cd4fe536182
---

泽民每天读大量文章(五个方向:自我成长/职场/技术/架构/产品方法论),核心诉求 = **帮他完全吸收、揉进自己的能力提升**,尤其晦涩难懂的文档。要的产物是**固定格式的「文章吸收解析」**。

**Why:** 有的文档难吸收;他要的是"理解透 + 能用出去",不是收藏一个 artifact。2026-07-17 一篇车企生态位文,我连续三次跑偏——先卡晨读判级门要报告、再做 fork 工具(source/concept/tool.html)、再甩梁宁复盘 complaint 格式——全被否。他第四次才把真需求说清:**帮我解析文章让我吸收**。

**How to apply(每篇文章默认按此七段格式解析):**
1. **一句话讲透** —— 去晦涩,大白话把全文说破
2. **完全吸收式拆解** —— 把论证一层层剥开;难懂/抽象处用**类比**重讲
3. **金点提取** —— 3-5 个最锋利可复用的点,每个 = 点 + 为什么好 + 怎么用
4. **第一性原理:连问 5+ 个为什么** —— 一层层 drill 到根 principle(那块"铁")
5. **总结一套方法论** —— 命名 + 步骤 + 可重复(能脱离原文套到别处)
6. **mermaid 流程图** —— 专门给难懂的部分画;**每张图必须配逐图讲解**(他明确要讲解,只画不讲=违规)
7. **揉进他五个维度** —— 诚实标 strong/weak,别硬凑

**输出形态(2026-07-17 定死):产物 = 一个 HTML 阅读页,不是 chat markdown。**
- 存 `脚本-article-forker/解析/<date>-<slug>-吸收解析.html`,生成后立即 open。
- 设计系统 = **暖夜·内容优先**(他从 qiaomu 三方向里选的):暖褐深色底(#17130e,禁纯黑) + 琥珀/赤褐单一重音 + 衬线大标题(Songti)+无衬线正文 + 阅读列宽~720px/行高1.75 + 左侧 sticky 目录 + 顶部进度条。
- **难懂处配 inline SVG 图,暖调低饱和(非fork工具那种亮色),每张图必配"图讲解"文字。**
- **必须先调两个 skill 再动手:**① `renwei-writing`(人话)——按其 post-edit-checklist 清 AI 味儿,**破折号 `——` 硬约束=0**,"不是X而是Y"/排比三连/格言体/加粗滥用/万能展望结尾都清;② `qiaomu-design-advisor`——它要"先定方向再执行",压成一个 AskUserQuestion 带 preview 让他选方向(别自己拍),反套路禁令(禁紫蓝AI渐变/禁纯黑/禁Inter字体/禁居中Hero/禁三等分卡片横排)。

**禁止(除非他当轮明确要):** 不走 fork 管线(source/concept/tool.html)、不做晨读判级门/要内化报告、不甩梁宁六公理复盘格式。默认就是吸收解析 HTML 页。梁宁复盘只在他要"复盘某场评审会议"时才用(见 [[feedback_review_coaching_framework]])。

关联 [[user_content_creator_system]] [[feedback_qa_first_principles_format]] [[user_core_career_diagnosis]]
