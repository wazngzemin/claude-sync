---
name: project_planner_bug_taxonomy
description: Planner/Director bug 六大类框架(A-F)+33逐例case+分层解法L0-L6+实修物料，2026-06-12 排查会产物
metadata: 
  node_type: memory
  type: project
  originSessionId: 77475d17-a937-40f7-9e49-962d10e93c8a
---

2026-06-12 凌晨 Planner Bug 排查会（1h23m）后，为用户做了一整套 bug 聚合分析+解法落地。核心框架（讲 Planner 质量/给立委汇报时复用）：

**六大类分诊框架（A–F）**——拿到任何 bug 走"分诊决策树"6步定责：
- **A 推理**（大脑想错，真该修）：A1空间关系 / A2端状态读不懂 / A3上下文该调不调
- **B 幻觉**（编造工具没返回的信息，如歌名）
- **C 改写合理但下游接不住**（如"开始导航到XX"被意图分到算路）→ 转弋途
- **D 非Planner**（ASR/UI/手动点击/FC/无log）→ 转走，约35%
- **E 低优功能缺失** → 走干预/补能力边界
- **F 严重性误标**（钓鱼case/POI联网/已闭环）→ 降级

**关键结论**：33个逐例里真该Planner修(A+B)约17个，纯顽固模型问题仅3-4个（方位映射"主驾右=副驾"、温度反、坚持事实）；导航40+条真问题仅2-3条；Director官方177条里≈35%非自身。**"Planner没有太大问题"有数据支撑**。

**分层解法 L0-L6**（越靠前越轻、剥离越多）：L0流程治理→L1干预平台(硬规则绕过模型)→L2注意事项→L3工具描述/知识→L4端状态改造(★治本,表格→自然语言)→L5下游/弋途→L6训练。性价比最高=L4端状态改造+L3补空间知识，都不用重训模型。

**P级定义共识**：P0=高频域阻塞不可闭环 / PR=能闭环体验差 / P2-3=能完成不够好。红线：只有不可用才算bug。

**评测缺口**（需产品先给definition）：情绪标签scope / emoji输出时机 / 下游TTS支持边界——否则评测兜不住、模型没法训。

产物（planner 架构/）：会议纪要、全量Bug聚合分析报告、全量Bug逐例详细分析(33 case)、流程图全景、系统大图_深度版(含L0-L6解法+RACI+物料库)、SP实修方案_基于真实SP(逐工具before/after)。相关 [[project_director_sp_groundtruth]] [[project_trigger_system]] [[career_embodied_ai]]。
