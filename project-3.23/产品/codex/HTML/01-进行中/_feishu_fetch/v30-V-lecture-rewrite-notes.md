# v30 V 章讲课重写笔记（2026-10-30）

## 写入确认
- 目标文件：`豆包汽车-业务学习站-v30-工作副本.html`（仅此文件）
- v29：未改（sha256 前缀 `5d19109d7d6232d3`，mtime/size 不变）
- 结构：仍为 2 个 `<script>`（① `const DATA={...};` ② 应用逻辑）；无 `}{ crumbs` 粘连
- 自检：两段脚本 `node --check` OK；`new Function` OK
- 备份：`*.bak-v-lecture-180145`（本轮写入前）

## 字数对比（汉字）

| 区块 | 重写前 v30 | 重写后 v30 | v29 同章 |
|------|-----------|-----------|---------|
| intro | 275 | 446 | 374 |
| lessons（paragraphs 合计） | 1024 | 3320 | 3025 |
| guides.base | 9348 | 12594 | 5184 |
| closing | 75 | 84 | （v29 无独立 closing 或 0） |

要点：lessons 3320 ≥ v29 3025；guide 12594 落在 1.2万–2万目标内。

## 重写做了什么
1. `teaching.intro` + 4 lessons + `closing`：同一句「游泳馆→附近餐厅」贯穿；每段先场景再规则；点明用户感知 / 系统决定 / 不做什么。
2. PRD 重点写透：权限互斥、声学回声、音区≠操控≠身份记忆、热词、一遍/二遍、Soft300/Hard600 同起点、预请求三不、复用三条件、失败出口。
3. `guides.base`：10 个 section 沿节点顺序串讲；ASR∥VAD、汇合点、复用/重算分叉、失败线；图下可当一堂课读。
4. `base.modules[0].nodes`：只改 `paragraphs`/`detail`（关键节点 3–5 段有场景）；未改 x/y/w/h/lines 等几何。
5. `page.sections` 与 lessons 对齐（同 id / 同 paragraphs）。
6. 边界一句：记忆/自进化不在本步；Director/Planner 只交接到入口。

## 删掉的废话类型
- 元话语：「本章将介绍」「综上所述」「值得注意的是」等（写入前正则清扫）
- 同义反复：把「过程字≠定稿≠执行」拆成多段空转的句子合并为一次钉死
- 黑话堆叠：接口字段名改为「板书记用途，字段以协议为准」
- 把 R/I/M/D 职责整章重讲 → 改为交接边界一句
- 把待核数值擅自统一 → 保留【待核】（旧 500/1000 vs OnePager 300/600）
- 为凑字数的空泛形容词 / 「很重要」类评价句

## 依据（本地 clean + 飞书只读）
本地：`_feishu_fetch/lecture_style_20261030/clean/` 下宣讲样例A、宣讲3DT、OnePager、车内语音PRD、v15讲课版、语音工作地图、Director/Planner、记忆/自进化摘录；以及 `豆包座舱语音闭环-培训讲稿-v07.md`、`activation-lecture.md`、`input-lecture.md`。

飞书 URL：
- https://bytedance.larkoffice.com/docx/Ytzbd2OoNoMk0xxi099c1t9CnHh
- https://bytedance.larkoffice.com/docx/Is0mdygy3oQmEixHRUNcolvXnRb
- https://bytedance.larkoffice.com/wiki/XRuKwJ0VPisdUhkxH0ecY1rRn9g
- https://bytedance.larkoffice.com/wiki/K8Ihw3a4niaDNck7FEkcDXcOnfb
- https://bytedance.larkoffice.com/wiki/CbJVw4ACzilvvBkRxkqcQVfAnLh
- https://bytedance.larkoffice.com/docx/Se8jdNrxSob93XxLowzck351n9c
- https://bytedance.larkoffice.com/docx/BLgJd0WUeohjoVxTiqlcigpinch
- https://bytedance.larkoffice.com/wiki/space/7554961122303098899

知识库 space `7554961122303098899`：本轮以已拉取 OnePager/PRD 为准串讲；未把搜索到的无关页塞进语音章。

## 未改
- SVG 几何 / 节点坐标
- v29 文件
- 【待核】口径
- 双 script 结构以外的章节（本轮只 V）
