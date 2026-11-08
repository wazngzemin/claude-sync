---
title: 按真实业务讲解产品模块
date: 2026-10-29
updated: 2026-10-29
tags: [concept, methodology, product]
sources:
  - raw/articles/product-lectures/2026-10-29/memory-product-lecture.md
  - raw/articles/product-lectures/2026-10-29/director-product-lecture.md
  - raw/articles/product-lectures/2026-10-29/user-case-rewrite-standard.md
status: active
---

# 按真实业务讲解产品模块

讲解从用户遇到的问题开始。例如“系统听懂了去昨天的游泳馆，却不知道具体地点”，自然引出记忆检索；找到地点后还要导航，自然引出工具依赖和反馈。

每段推进一个实际变化。先交代谁收到什么信息，再说明为什么需要判断，接着讲处理结果交给谁。出现新术语时立即说明它在当前场景中的用途。参数、状态和异常只在影响产品行为时展开，但不省略关键顺序。

现行能力、开发中功能和讨论方案分别交代适用范围。出处保留在参考入口，正文直接讲机制，避免反复介绍取证过程、要求读者自行核验或添加没有具体业务内容的总结。

图下讲解以中文业务动作串起输入、分支和下游，编号只作图内索引，不把“V12 → R1”当成解释。跨页沿同一目标继续讲，避免每页重设一个抽象话题。每章正文都应达到[用户案例](../summaries/user-case-rewrite-standard.md)的展开程度；删除重复附录，保留影响判断的条件、异常和实际结果。
