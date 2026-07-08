[wiki] Wiki Index
Wiki Index
本索引列出了 wiki 中所有页面及其一行摘要。由 LLM 在每次 ingest/lint 操作时自动更新。
实体页 (entities/)


页面

摘要

director

车载语音助手核心对话推理引擎，以 SP 驱动，当前面临 PE 过长问题

planner

Director 的任务规划子模块，负责意图拆解和工具调用决策

gui-agent

负责图形界面操作的工具模块（外卖/订座/咖啡/停车费），3-30 前紧急优化

pullover-feature

临停功能（Pullover）：智驾场景下即时/条件/目标三种靠边停车模式

seed-data

种子数据：为 Planner 构造的高质量结构化数据集，用于评测和数据泛化

asr

语音识别：在线/离线/方言三种模式，首字延迟≤200ms，句准率≥95%

vad

语音活动检测：Soft/Hard/Semantic三级VAD及预执行机制

advisor

主动服务模块：基于Always On事件发现主动发起交互推荐

always-on

全时监听模块：端侧持续多模态聆听、情景理解、事件发现
概念页 (concepts/)


页面

摘要

sp-compression-strategy

SP 压缩策略：从 34K tokens 压到 15K 以下，静态+动态示例拆分

planner-tool-simplification

Planner 职责分离方案：自然语言规划 + Flash 模型参数转换

evaluation-system

评测体系建设：评测集扩充、自动化脚本、核心指标定义、150条种子数据

planner-sp-structure

SP 模块结构分析与 token 膨胀根源：7 个模块拆解、示例库占 50%

query-routing

Query 三层路由策略：句法RAG(<500ms) → 情景RAG(<1s) → 云侧Planner(1-3s)

pullover-state-machines

临停五场景状态机设计：即时/条件/POI/视觉/手势，工程侧独立运行

pullover-tools

临停 5 个新增 Tool 体系：poi_search/visual_detect/gesture_resolve/condition_monitor/pullover_execute

wake-free

全时免唤醒：无需唤醒词直接下达指令的交互模式，当前主驾已上线

multi-zone-interaction

多音区交互：按座位划分的音频区域识别与交互决策，定位精度±20cm

task-replan

任务重规划Replan：下游agent失败或任务打断后重新生成执行计划

funnel-principle

漏斗原则：句法RAG→情景RAG→复杂Planner的三层分层处理架构
对比分析 (comparisons/)


页面

摘要

—

—
源文件摘要 (summaries/)


页面

来源

摘要

in-car-voice-prd

【AI汽车-PRD】车内语音.md

车内语音全链路PRD：唤醒、免唤醒、降噪、音区识别、语音识别、声纹识别

multi-user-simultaneous-voice-interaction

【AI汽车-PRD】多人同时语音交互体验.md

多人同时语音交互：任务分类、合并策略、打断/恢复/排队机制

multi-level-vad-product-experience

【AI汽车-PRD】多级VAD产品体验.md

三级VAD（Soft/Hard/Semantic）及预执行、语义完整性判断

multi-zone-wake-free-interaction

【AI汽车-PRD】多音区全时免唤醒交互.md

多音区全时免唤醒：上下文继承、交互决策、反馈类型、安全确认

online-offline-arbitration

【AI汽车-PRD】离在线仲裁.md

离在线仲裁逻辑、离线白名单、降级策略

voice-interaction-interruption-strategy

【AI汽车-PRD】语音交互打断策略.md

TTS打断策略：短期打断、实验性立即打断、恢复机制

see-and-say-framework

【AI汽车】可见即可说框架需求文档.md

可见即可说框架：UI解析、命令生成、ASR匹配、优先级排序

task-planner-prd

任务Planner - PRD 【豆包 in car1.0】.md

任务Planner核心PRD：任务拆解类型、工具库、性能/准确率目标

public-context-management

公共Context管理-豆包 【AI car 1.0】.md

公共Context管理：13类Context、压缩与过滤策略

cot-fast-slow-thinking-architecture

基于COT的新快慢思考架构实验.md

COT快慢思考实验：感知-思考-执行三层架构、实验A-D、阶段目标

intent-understanding-task-planning-prompt-experiment

任务规划&意图理解 prompt 实验.md

Prompt工程实验：XML结构、任务队列JSON、子Agent建议处理

goal-driven-task-management

目标驱动的任务管理和对话管理体系.md

目标驱动管理：目标列表、顾问体系、Planner职责、任务定义

planner-2.6-goals-and-s7-iteration

Planner 2.6整体目标 和 s7迭代目标.md

Planner 2.6目标：性能/准确率、S7细化目标、仲裁意图规划

tob-simple-complex-arbitration-upgrade

TOB简单复杂仲裁 针对AI汽车升级.md

TOB仲裁升级：长期方案、覆盖场景、评测数据对比

simple-complex-arbitration-test-analysis

简单复杂仲裁 测试结果分析.md

仲裁测试结果：8类问题点、处理措施、情景推理示例

offline-llm-command-parsing

【AI汽车-PRD】离线LLM指令解析.md

离线LLM指令解析：支持场景、拒识模块、指令缓存

out-car-voice-prd

【施工中】【AI汽车-PRD】车外语音.md

车外语音PRD（施工中）：麦克风布置、唤起条件、控制范围、测试场景

cockpit-planner-onepage

座舱Planner-OnePage.md

座舱Planner架构：句法RAG+情景RAG+简单/复杂Planner+多agent调度

gui-agent-problem-classification

GUI_Agent问题分类.md

GUI Agent 三大类问题（指令理解/参数混淆/任务难度）及优化策略

director-optimization-meeting

planner 会议.md

Director 优化讨论会纪要：四大问题、SP 压缩方案、分工与目标

meeting-notes-0327

会议记录.md

注意力分散问题三大方案：示例浓缩/工具简化/知识补充

project-optimization-plan

项目优化完整方案.md

完整优化方案文档：三大方案详解、GUI 专项、成功标准

library-management-system-prd

小区图书馆管理系统 PRD

小区图书馆管理系统产品需求文档，纯前端 LocalStorage 方案

prd-pullover

PRD-智能座舱.md

临停功能 PRD：即时/条件/目标三种停车模式，5个新Tool，51条评测Query

meeting-0330-director

会议纪要-0330.md

3.30 Director进展对齐：评测集构建、SP优化、GUI bug分析、分工

planner-prompt-evolution

planner-prompt-v1~v3 + 问题点 + 优化方案

Planner SP 从 v1 到 v3 的版本演进、8 类问题点、6 类优化方案

driver-agent-eval-unified

司机Agent_统一评测集.md

舱驾融合统一评测集：113条 case，三级场景分类，覆盖靠边临停+泊车

seed-data-context-meeting

中自机.md

种子数据补 Context 分工会议：数据模块划分、字段规范、分工安排
综合分析 (synthesis/)


页面

摘要

driver-agent-eval-query-set

舱驾融合司机Agent评测Query集：101条case，覆盖条件任务/目的地任务/异常边界三大类
