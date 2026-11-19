---
name: learning-site-chapter-pipeline
description: 学习站其他章节都要按 V 章 v60 的标准做，只能比 V 章好；标准文件、部件卡片、流程和章节顺序
metadata:
  node_type: memory
  type: project
  originSessionId: d1d6888c-c947-4227-bbf6-6d61c9195d26
  modified: 2026-11-16T03:46:11.240Z
---

2026-11-15 用户认可 V 章 v60，要求严格按 V 章的方式指挥 Codex 做其余 23 章，质量只能比 V 章好，不能差一点。

- 标准：`产品/codex/座舱业务学习站/research/V-STANDARD.md`（讲法、结构、例子和案例的数量、图、加粗、覆盖范围、流程）
- 全站部件卡片：`research/component-cards.md`。出现新部件时，由 Claude 先写进卡片，再交给 Codex 写正文。
- 每章流程：Codex 研究（facts / cases / overlap / sop-items）→ Claude 定大纲、补卡片、设计图 → Codex 并行写作和画图 → Claude 审核（最多 3 轮）→ Codex 生成页面 → Claude 用浏览器验收。
- 章节顺序按链路往下走：R → I → W → M → C → D → E → K → F → T → G → L → S → P → A → H → O → B → U → EL/EV/SE/DR。研究目录是 `research/<章>-v2/`。

- 用户偏好：章节做完、验收通过后直接打开，不用先问。
- 原图上的文字也要检查：除了禁用词，还要查有没有指向已经删掉的章节（比如“见方案专题三”）。要扫描 V/R/I 等全部已改章节，确保没有悬空引用。
- 进度：V（v60）、R（v61）、I（v62）、W（v63）、M（v64）、C（v65）、D（v66）、E（v67）已完成；v68–v69 给 D 章补了第十一段“从意图分类到快慢思考”（原排查段改为十二，新图 d2-fast-slow）；K（v70）已完成，v71 是误删原始全图折叠的错误版本、已撤回；F（v72，以 v70 为底稿）、T（v73）已完成；v74 新增 SP 章（现行 Planner 系统提示词，放在 D 后，材料在 research/planner-sp-20261117/：原文、gap-analysis、DESIGN），并按现行 SP 修正了 V/D/E/T 共 22 处（fix-log.md）。G（v75，云端触发器，主例“续航低于 100 公里提醒我充电”）已完成。L（v76，端侧触发与本地闭环，主例“浓雾里车上自己问要不要开后雾灯”，首次全程用 gpt-6.2-sol max）已完成。S（v77，Advisor 主动服务，主例“中午上车车里 38 度，舒适 Advisor 建议极速制冷”）已完成。下一步：新增“情境理解”“豆包内核”两个模块（v78，材料 research/CK-v2/，放在 EL 后），之后按 P 继续。全站部件卡片已到 144 号（131～144 是 SI/KN）。新模块设计在 research/CK-v2/DESIGN.md（两章共用：SI 情境理解、KN 豆包内核，主例“周五傍晚去吃涮肉”，裁决：现行 ME7 Planner 未接这两份产物、开发联调中、归属在定；真实案例少，允许标“（验收推演）”的案例）。没有 raw/ 的章节可用 lark-cli docs +search / +fetch 批量把飞书 PRD 和文字记录转存到 X-v2/feishu/（参考草稿目录 fetch-L.py）。以后写各章要以 planner-sp.md（赛力斯 ME7，2026-11-17 线上版）为工具名和规则的现行依据。同一个问题只在一个段落当案例，其他段一句点回。没有 raw/ 的章节（如 T）要先从 case-rewrite-20261029/async、support 和飞书补齐原文，飞书内容转存到 X-v2/feishu/ 给 Codex 读。网页模块里由 base 数据渲染的原图（如 T 的 18 节点图）也算原图：由画图任务导出清理成 figures-orig/，放进“原始全图”折叠；新总图放开篇和收尾。新图宽度统一 1200，过宽会在页面里看不清。原章节已有的图（chapters/X/svg/）即使网页里没嵌，也要清理后保留放进对应段落（F 章旧图 5 张，f-overview 作总图）。Codex 偶尔报 model at capacity / 429：不要并行跑多个 Codex 任务（gpt-6.2-sol 并行必触发 429），用 run-seq2.sh 串行、失败等 600 秒重试最多 6 次。注意：V-STANDARD 规定每章两个折叠（原始全图、附二），附二前那张总图折叠是标准，不是多插。章节多于 10 个 h2 时可开 4 个并行写手（part-5 放倒数段落），合稿顺序写进 build 任务。build 任务里不要写“英文名只在附二出现”这种宽泛说法：G 章 v75 首版因此把 Planner、Advisor、Agent 全换成了自造中文名，要写明只限工具英文名和字段名，Planner、Advisor、Agent 等通用叫法照常用。浏览器复查时 http.server 有缓存，要在 URL 加 ?r=N。
- 原图常印着来源、日期、“待确认”，画图任务要同时出清理版（figures-orig/），并在图库页逐张看。

**Why:** V 章前后返工了十几轮才达标，期间踩过的坑都写进了标准，后面的章节不能再踩一遍。
**How to apply:** 开始做任何一章之前，先读标准和部件卡片。相关：[[learning-site-detail-standard]] [[claude-directs-codex-implements]]
