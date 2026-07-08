---
title: Wiki Log
date: 2026-04-14
---

# Wiki Log

> Append-only 操作日志。记录所有 ingest / query / lint 事件。

| 时间 | 操作 | 目标 | 说明 |
|------|------|------|------|
| 2026-04-14 | init | — | 知识库初始化，建立三层架构目录结构 |
| 2026-04-14 | ingest | GUI_Agent问题分类.md | 创建 summary: gui-agent-problem-classification |
| 2026-04-14 | ingest | planner 会议.md | 创建 summary: director-optimization-meeting |
| 2026-04-14 | ingest | 会议记录.md | 创建 summary: meeting-notes-0327 |
| 2026-04-14 | ingest | 项目优化完整方案.md | 创建 summary: project-optimization-plan |
| 2026-04-14 | ingest | 小区图书馆管理系统 PRD | 创建 summary: library-management-system-prd |
| 2026-04-14 | ingest | 多篇素材 | 创建 entity: director, planner, gui-agent |
| 2026-04-14 | ingest | 多篇素材 | 创建 concept: sp-compression-strategy, planner-tool-simplification, evaluation-system |
| 2026-04-14 | ingest | 全部素材 | 更新 index.md，完成首轮 ingest |
| 2026-04-15 | ingest | 舱驾融合评测Query集方案 | 创建 synthesis: driver-agent-eval-query-set，101条评测case |
| 2026-04-20 | ingest | planner-prompt-v1~v3 + 问题点 + 优化方案 | 创建 summary: planner-prompt-evolution, concept: planner-sp-structure, 更新 sp-compression-strategy 关联链接 |
| 2026-04-20 | ingest | 司机Agent_统一评测集.md | 创建 summary: driver-agent-eval-unified，113条统一评测case |
| 2026-04-20 | ingest | 中自机.md | 创建 summary: seed-data-context-meeting，种子数据补 context 会议纪要 |
| 2026-04-20 | ingest | 中自机.md | 创建 entity: seed-data，种子数据实体页 |
| 2026-04-20 | ingest | PRD-智能座舱.md | 创建 summary: prd-pullover, entity: pullover-feature, concept: query-routing/pullover-state-machines/pullover-tools, 更新 director/planner 实体页 |
| 2026-04-20 | ingest | 会议纪要-0330.md | 创建 summary: meeting-0330-director, 更新 gui-agent/evaluation-system 页面 |
| 2026-04-20 17:14 | sync-feishu | car Wiki 空间 | 新增56篇，更新0篇 |
| 2026-04-20 17:14 | sync-feishu | car Wiki 空间 | 新增0篇，更新0篇 |
| 2026-04-21 10:21 | sync-feishu | car Wiki 空间 | 新增0篇，更新0篇 |
| 2026-04-21 14:30 | ingest | 功能详述/基础语音 + 任务拆解 + 主链路 共16篇 | 创建 summaries: in-car-voice-prd, multi-user-simultaneous-voice-interaction, multi-level-vad-product-experience, multi-zone-wake-free-interaction, online-offline-arbitration, voice-interaction-interruption-strategy, see-and-say-framework, task-planner-prd, public-context-management, cot-fast-slow-thinking-architecture, intent-understanding-task-planning-prompt-experiment, goal-driven-task-management, planner-2.6-goals-and-s7-iteration, tob-simple-complex-arbitration-upgrade, simple-complex-arbitration-test-analysis, offline-llm-command-parsing; 更新 index.md |
| 2026-04-21 15:30 | ingest | 功能详述/基础语音 + 任务拆解 补2篇 | 创建 summaries: out-car-voice-prd, cockpit-planner-onepage; 更新 index.md |
| 2026-04-21 15:45 | ingest | 功能详述全量素材 | 创建 entity: asr, vad, advisor, always-on; 创建 concept: wake-free, multi-zone-interaction, task-replan, funnel-principle; 更新 index.md |
| 2026-04-21 17:22 | sync-feishu | car Wiki 空间 | 批量上传 wiki 全量 52 篇到 Feishu（index/log/entities/concepts/summaries/synthesis），全部成功 |
| 2026-04-27 | ingest | 座舱Planner OnePage-1776677662.md + 1776677809.md | 新增两版本，更新 cockpit-planner-onepage.md：doubao-1.8切换计划、全局State管理、拒识思考机制 |
| 2026-04-27 | update | 用户调研（与赛力斯共创） round3.md | 创建 summary: user-research-seres-round3（文档为空模板）；创建 entity: seres；创建 concept: emotional-value |
| 2026-04-28 10:56 | sync-feishu | car Wiki 空间 | 新增191篇，更新0篇 |
| 2026-04-29 | ingest | 舱驾融合 2.0【AICar主线】司机Agent（舱驾融合）产品需求文档PRD 副本.md | 创建 summary: cabin-drive-fusion-2-0-prd；更新 entity: pullover-feature（2.0行车/泊车场景、豆包猎手）；更新 index.md |
| 2026-05-07 | query | 端侧触发器 PRD 会议复盘 | 创建 concept: meeting-communication-strategy，基于触发器方案评审会实际表现总结的语速、逻辑、压力应对改进策略 |
| 2026-05-20 15:30 | ingest | 三文档PM讲解_产品经理版.html + System Prompt + 测试案例 | 创建 concept: planner-system-deep-dive，综合三源素材深度拆解 Planner 全链路：漏斗架构、SP/UP结构、缓存机制、上下文优化方案、四种任务类型、Goal List + Advisor |
| 2026-05-21 10:00 | ingest | 座舱Planner OnePage 训练方案章节 | 创建 concept: planner-training-pipeline.html，Function Call 训练全流程可视化讲解：蒸馏管线、数据格式、并行/串行样例、两阶段目标 |
| 2026-05-21 15:30 | ingest | TOB简单复杂仲裁升级 + 测试结果分析 + OnePage 情景RAG 章节 | 创建 concept: scenario-rag-arbitration.html，情景RAG知识注入机制+仲裁模型SP四版演进+8类问题分类+90条评测数据对比 |
| 2026-05-22 | update | planner-jiangjie.md + 4篇补充素材 | 深度扩写 concept: planner-jiangjie（1490→1968行）：句法RAG输出格式、任务模块划分全景、情景RAG+仲裁详细拆解、4个内部工具JSON Schema、任务数据结构+工程流程、13类Context体系、FC训练管线详述 |
| 2026-05-26 17:30 | synthesis | 5份外部评测资料(AI Agent评测入门/Agent评测方法论梳理/Director评测重点/车载评测2.0/豆包汽车如何更像人) | 创建 synthesis: planner-eval-methodology-outline,对外分享方法论详细大纲,演进叙事8章,HTML嵌入式骨架图与流程图,部分脱敏(产品名/竞品),含场景化×过程归因×像人三重构 |
| 2026-05-26 19:00 | ingest | Planner SP 讨论.html (5.22会议) | 创建 summary: meeting-0522-planner-sp-discussion (草稿，仅捕获开场约5分钟转录)；议题：注意事项 #5/#8合并、合规规则缺失、自我时间感知双处重复；待补议题二的11个例子可用率评测 |
| 2026-05-26 19:30 | update | meeting-0522-planner-sp-discussion | 全量补完会议转录 (1h20min)：注意事项 4 大问题、16 个示例逐条评审、9 条全场决议 (D1=用户必回/D2=advisor询问优先/D3=Harmony工程硬限制等)、11 项 TODO、PM 视角 4 个 takeaway；状态 draft→active |
| 2026-05-26 20:00 | synthesis | 同 5 份外部评测资料 + planner-eval-methodology-outline | 创建 synthesis: planner-eval-methodology (正文)，Part 0-8 + 附录全量；10 个 HTML 嵌入式图表 (骨架/产品演进/场景定义/搭建原则/三层视角/7类归因/对抗vs全局打分/像人三层/5阶段流水线/飞轮)；5+ 真实 case 拆解 (多指令并行/Context 冲突/任务节奏失控/记忆感知冲突/过度执行)；5 条对外建议 |
| 2026-05-26 20:45 | sync-feishu | planner-eval-methodology.md | 推送到飞书 ai car 空间 wiki/concepts 节点；新建 doc (doc_id: ZO8QdCgFvo86zSxpdF9cj5dqnOb, URL: feishu.cn/wiki/MlUEwNZY1ixd0Eka1sGcCd1LnFe)；分 6 段 append 完成 (87KB)；HTML 块按预期被剥成纯文本 (用户已确认接受此退化)，结构与内容完整 |
| 2026-05-26 21:30 | synthesis | meeting-0522 + Planner SP 全文 + planner-jiangjie + planner-sp-structure | 创建 synthesis: sp-revision-analysis-0522，会议决议对 SP 的修改影响分析：Part 1 (9 条决议精确定位+改前/改后/作用/理由)、Part 2 (16 个示例改动清单)、Part 3 (13 项会议未讨论但应优化的点：双 param bug/notice 覆盖不均/动态变量边界/goal_list 注入污染等)、Part 4 (修改后 token 预算 + badcase 消除沙盘 + 遗留张力)、Part 5 (整改 P0-P3 优先级) |
| 2026-05-27 12:00 | update | sp-revision-analysis-0522 | 用户提供会议后修改版 SP，重写为新旧 SP 严格 diff 分析：Part 1 已落地 8 项修改（双 param 修复/示例编号连续/工具描述精简/输出 schema+emoji_id 必填/聊天风格+8 主动性原则等）、Part 2 未落地决议 6 条 (D1/D2/D3/D5/D6/D8 全未落地，D7 部分但本质未改)、Part 3 新引入问题 8 项（核心：【静默记忆】原则与 D7 决议正面冲突，示例 17/18 直接示范违反；示例 5/8 bug 未修）、Part 4 13 优化点状态表+10 新优化建议、Part 5 P0-P3 优先级矩阵 |
| 2026-05-27 12:15 | lint | 项目根目录全量归档 | 把根目录 25 个散文件 + `场景知识/` 63 个 + `培训/` 4 个 + `端侧触发器 - PRD_2026-05-06.../` 13 个对象全部分类到顶层中文前缀目录（产品-/场景知识-/Prompts-/脚本-/元数据-）。删除旧壳 01_/02_/03_/04_/99_/培训/场景知识/端侧触发器dump。raw/ raw_cleaned/ wiki/ Recordly/ 未动。旧版本进 _archive/ 全部保留。详见根目录 MIGRATION_LOG.md |
| 2026-05-27 13:45 | synthesis | planner-eval-methodology + planner-jiangjie + planner-system-deep-dive + planner-sp-structure + scenario-rag-arbitration | 创建 synthesis: planner-eval-methodology-internal（内部版）。基于对外版 8 Part 骨架，全量去脱敏：豆包/Driver Agent 2.0/D6X/Seed 1.8/23 工具/SP 11 模块/UP/4 任务类型/Goal List+Advisor/KV Cache 全部按真名出现。每 Part 末尾新增"钉入 Planner"业务子节(共 11 个子节)：1.4(1.0 在 Planner 12 个模块的盲区)、2.4(3 个产品变化↔Planner 模块映射)、3.8/3.9(场景元素↔SP/UP 字段 + 4 任务类型分布)、4.8/4.9(Badcase 4 层↔7 类归因 + SP ⑤ 条款作检查点)、5.7(像人 8 维度↔SP ⑩⑪/Goal List 监控点)、6.6(5 阶段流水线↔Byteval/Fornax/PromptPilot)、7.6(Planner 7 个业务挑战↔评测覆盖)、8 钉入(5 条建议↔Q2/Q3 5 个动作)、附录全文索引。生成完整 HTML 渲染版(planner-eval-methodology-internal.html, 144KB, 32 卡片块/19 表格/11 章节)。橙色"📌 钉入 Planner"子节明显标识。 |
| 2026-05-29 15:38 | synthesis | planner-eval-methodology.md/.html + 司机Agent_统一评测集 + 评测体系建设 + driver-agent-eval-query-set | 补强对外分享版评测方法论:基于项目内全部评测素材(经回源核对)新增 4 个落地小节,不动 8-Part 骨架与编号——3.8 场景库工程化(三级分类法/P0P1P2优先级↔准出门槛/8 字段 case 数据规范)、4.8 可落地评分卡(结果70%+过程30%、二值/分级/扣分制-30-20-5/安全一票否决、通过定义=结果≥80%且无安全违规、"打分形态匹配维度性质"原则)、4.9 归因→修复四段式闭环模板(现象/根因/修复/验证Case + 4 条可复用纪律)、6.6 模拟器vs实车分层执行 + Mock 真实性瓶颈。全部脱敏、HTML 卡片风格与原文一致。重新生成 HTML(96KB→122KB,h3 33→40,无转义) |
| 2026-06-01 11:30 | ingest | 文字记录：赛力斯需求梳理对齐 2026年5月31日.md (8350行/446KB,6h17min) | 复制原始转录到 raw/articles/meeting-0531-seres-requirement-alignment.md；5 路并行精读全文。创建 summary: meeting-0531-seres-requirement-alignment——逐场景纪要(舒适空间/PHUD/出行/娱乐/停车支付/熟路PLUS/展销/AI导演/生活服务/迎宾情感/always-on账号隐私/工具手势规范/HMI灯语)、四大需求类型分工、双方责任边界总表、6 条决议(D1 移除COT黑框/D2 沉浸态独立工具/D3 PHUD连续感知四小人/D4 always-on≠主动服务/D5 赛力斯=豆包一方应用/D6 声纹存账号)、与上汽差异汇总、T1-T20 行动项、11 项 open issues、周议题清单制。更新 entity: seres(责任边界+与上汽差异+竞品参照扩充)。更新 index.md |
| 2026-06-01 12:10 | query | meeting-0531-seres-requirement-alignment.md | 二次以"需求项"维度全文重扫(5路并行)，去重合并约100条离散需求。产出根目录 HTML 全景骨架图：赛力斯需求全景骨架图_2026-05-31.html——含3层架构骨架图(产品/三层漏斗/四大需求类型/15评审组/责任边界)+按A-Q评审组的全量需求表(每条标 谁做/怎么做/做到什么程度，责任方配色，差异/TODO/已定标签) |
| 2026-06-01 12:40 | update | 赛力斯需求全景骨架图_2026-05-31.html + meeting-0531 summary | 用户(王泽民/wzm)指出遗漏其触发器需求。回源核对第2636行+5042-5078：补「触发器/条件任务/场景引擎」独立能力域(R组6项)——触发器核心条件梳理(张航交办泽民,音乐播放状态/导航状态切换等)、AI电台节目链事件驱动、条件二次判断能力缺口(电量够不够到目的地,现框架不支持)、端侧闭环与条件任务同一场景引擎、天气保护并入条件任务、熟路PLUS条件归属。骨架图加触发器底层底座band;需求总数~100→~106 |
| 2026-06-02 15:00 | ingest | 触发器需求-全链路详解.html | 摄入触发器 13 条需求全链路详解（1087行HTML卡片）。创建 summary: trigger-requirements-full-chain-detail（需求总览+依赖链+角色分工+术语+优先级）；创建 entity: trigger-engine（触发器引擎定位/能力矩阵/五段式协议/端云铁律）；创建 concept: trigger-condition-taxonomy（三种取值判断/条件类型维度/清单标准字段/条件组合）。更新 index.md |
| 2026-06-08 | ingest | anthropic-data-governance-ai-first-hanniman.md（黄钊解读 Anthropic 自助分析博客） | 复制原文到 raw/articles/。创建 summary: anthropic-data-governance-ai-first（核心论点 a-f + 21/95/65 曲线 + 三类错误 + 与项目场景知识 Skill 质量的镜像关联）。创建 concept: data-governance-over-model-capability（命题：模型是最后一层接口、数据治理是主导变量；论证骨架 5 节；"钉入 Planner/场景知识"映射表，把实体歧义/陈旧/检索失败映射到 SP工具定义/触发条件清单/情景RAG；可作评测方法论过程归因论据）。更新 index.md（concepts + summaries 两区） |
