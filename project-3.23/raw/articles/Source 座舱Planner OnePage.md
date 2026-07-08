Source: 座舱Planner OnePage
Source: 座舱Planner OnePage

类型: source
创建时间: 2026-04-21 18:10
最后更新: 2026-04-21 18:10
原始来源: 座舱Planner OnePage
关联: Planner/整体架构/RAG/多Agent
摘要
本文档是座舱Planner系统的OnePage概览，全面介绍了从传统车载座舱架构到RAG-Multi-Agent架构的演进。传统架构虽然响应效率高、任务准确、交互可控，但存在模块协同性不足、场景感知薄弱、成本与泛化瓶颈等问题。新方案采用"句法RAG+情景RAG+简单/复杂Planner+Agents"的混合架构，句法RAG确保简单指令的稳定高效执行，Planner+情景RAG负责复杂任务拆解，前期Planner作为Teacher引导数据回流至句法RAG，中后期利用积累数据训练Planner完成系统闭环。文档详细定义了Planner的能力定位、设计原则、整体架构和各模块职责。
关键要点
传统架构三大局限：模块协同不足（跨域任务衔接差）、场景感知薄弱（无记忆和环境感知）、成本与泛化瓶颈（长尾场景定制成本高）
新架构核心思想：句法RAG确保稳定高效，Planner+情景RAG确保复杂case的拆解灵活智能，句法RAG车厂可配置
Planner设计三大原则：边界明了能力清晰（与下游Agent无冲突）、数据可闭环（面向未来可复用）、可拓展（易于承接新业务）
数据闭环路径：前期Planner作为Teacher引导收集数据回流至句法RAG，中后期用RAG数据训练Planner
句法RAG作为前置模块，可配置、可平台化，帮助回流宝贵链路数据
提取的实体
句法RAG引擎：基于句法匹配的简单指令处理引擎，可配置可平台化
情景RAG：基于情景信息的检索增强生成，为Planner提供知识注入
Planner模型：多Agent系统的中枢大脑，负责模糊/复杂任务的规划调度
子Agent体系：车控Agent、导航Agent、媒体Agent、s2s、GUI Agent、VQA Agent等
Fornax平台：Prompt开发和评测平台
提取的概念
RAG-Multi-Agent混合架构：句法RAG+情景RAG+Planner+Agents的分层混合方案
句法RAG vs 情景RAG：前者处理确定性指令，后者为Planner提供环境感知知识
Teacher-Student数据闭环：前期Planner作为Teacher引导数据回流，后期数据反哺Planner
平台化设计：句法RAG可配置、可平台化，支持不同车企定制
边界明了原则：Planner与下游Agent能力边界清晰，可独立迭代
