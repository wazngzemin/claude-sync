# v30 V 章 — 给审稿 agent 的对照单

审稿时请**精读**这两份产品宣讲（讲话风格 / 怎么讲重点 / 产品思维 / 逻辑串法），再对照 V 章：

1. https://bytedance.larkoffice.com/docx/Ytzbd2OoNoMk0xxi099c1t9CnHh （产品宣讲6-记忆）  
   本地 clean：`_feishu_fetch/lecture_style_20261030/clean/宣讲样例A_Ytzbd2OoNoMk0xxi099c1t9CnHh.md`
2. https://bytedance.larkoffice.com/docx/Is0mdygy3oQmEixHRUNcolvXnRb （产品宣讲3-DT）  
   本地 clean：`_feishu_fetch/lecture_style_20261030/clean/宣讲3DT_Is0mdygy3oQmEixHRUNcolvXnRb.md`

目标 HTML（只审 V）：`…/豆包汽车-业务学习站-v30-工作副本.html`  
质量下限：v29 同章 lessons ≈ 3025 汉字；本轮 lessons ≈ 3320，guide ≈ 12594。

## 必查项
### 风格 / 句式
- [ ] 像老师串讲，不像词条列表；同一句「游泳馆→附近餐厅」是否贯穿 intro/lessons/guide/nodes
- [ ] 有无元话语（「本章将介绍」「综上所述」「值得注意的是」）
- [ ] 有无同义反复、黑话堆叠、为凑字而加的空句
- [ ] 每段是否「先场景 → 规则 → 用户感知/系统决定/不做什么」

### 产品讲解方向
- [ ] 权限互斥、声学回声、音区（≠操控≠身份记忆）、热词、一遍/二遍、Soft300/Hard600 **同起点**、预请求三不、复用三条件、失败出口 — 是否讲透且可验收
- [ ] 有无把【待核】写成已上线 / 擅自统一旧 VAD 数值
- [ ] 有无把 R/I/M/D 或 Planner 整章搬进语音章（只应有交接边界）
- [ ] 记忆/自进化是否只点边界（音区≠身份记忆；本轮不讲自进化）

### 图下讲法（guides.base）
- [ ] 是否沿节点顺序；ASR∥VAD 并行、汇合点、复用/重算分叉、失败线是否讲清
- [ ] 点击节点 `paragraphs`/`detail` 是否与图下讲法一致；关键节点是否 3–5 段有场景
- [ ] `page.sections` 与 lessons 是否同一套口径

### 结构安全
- [ ] 仍为 2 个 script；无 `}{ crumbs`；未改 SVG 几何；未动 v29

## 事实材料（串讲用，勿割裂堆砌）
- OnePager / 车内语音PRD / v15讲课版 / 语音工作地图
- DirectorPRD、座舱Planner（只交边界）
- 记忆 wiki/docx、自进化 docx（只点边界）
- Wiki：XRuK…、K8Ih…、CbJV…；docx：Se8j…、BLgJ…

## 审稿产出建议
列出：必须改 / 建议改 / 可保留；每条引用宣讲中的句式或产品切法作对照，避免空泛「再口语化一点」。
