[summaries] 座舱Planner-OnePage
概述
本文档是座舱Planner的OnePage总结，系统阐述了传统车载座舱架构的局限，提出基于"句法RAG + 情景RAG + 简单/复杂Planner + agents"的混合多智能体架构，作为多agent系统的中枢大脑统筹调度各个子agent。
关键章节
1. 传统架构缺陷
模块协同性不足：各模块独立闭环，缺乏全局信息共享，跨域任务衔接差
场景感知能力薄弱：未集成用户记忆与实时环境，无法自适应智能交互
成本与泛化瓶颈：长尾场景需单独定制逻辑，研发成本高、周期长
2. 核心架构设计
采用混合方案：句法RAG作为前置可配置模块，planner模型作为系统"大脑"，配合情景RAG知识注入，整合全局状态信息。
核心思想：
句法RAG确保系统稳定、高效、车厂可配置
planner模型 + 情景RAG确保复杂case的拆解、灵活、智能
漏斗原则：能通过简单方法搞定的不要漏到复杂模型处理
3. Planner能力定位
句法RAG引擎：匹配指令，简单指令直接工程解析下发，提升响应速度
planner + 情景RAG：负责模糊任务、复杂任务的规划
特殊工具：plan_describe、search_user_preferences、search_vehicle_status_info、plan_update
4. 两种RAG类型


类型

触发条件

适用规则

举例

句法RAG

用户query匹配

明确单轮query，不支持上下文/情景/记忆

拒识、车书、音乐搜播、音色演绎、出行规划、简单车控

情景RAG

用户query匹配

模糊单轮query，注入知识辅助模型拆解

复杂车控（"我好热"）、复合意图、模糊意图
5. 任务模块划分


类别

细分类别

负责模块

简单车控

导航剧本、简单车控多轮

简单任务planner + SFT FC

简单多媒体

播放/暂停/换歌

特殊处理/简单任务planner

车书/音色演绎/出行规划/GUI agent/查天气

明确单轮

句法RAG匹配，直接下发agent

查车机状态/查记忆

需要端状态信息

复杂任务planner

视觉查询

前方车辆识别等

句法RAG或planner

闲聊（开放域）

开放对话

复杂任务planner

复杂意图

复合意图、车控模糊意图、其他模糊意图

情景RAG + 复杂任务planner

advisor主动服务

主动推荐/执行

复杂任务planner
6. 上下文管理
解决多轮任务延续性和multi-agent协同信息传输：
上下文隔离、选择、压缩、隔离
Agent上下文同步
引用Context Engineering方法论
7. 长期记忆
用户画像、偏好、高频对话控制历史
车机控制记录（空调、后视镜等）
由planner的search memory tool判断调用时机
8. 环境多模态信息
车机状态、车内乘客状态、车内/车外图像感知
由planner的search env info tool判断调用时机
9. 任务管理
任务定义：原子性、可改写、可追踪任务状态：PENDING / COMPLETED / FAILED关键机制：
Replan：下游agent执行失败时，planner重新生成可行计划
打断&恢复：新query打断未完成的plan，保存checkpoint后恢复
挂起：定时/条件触发的任务，由Always On模块监听条件后触发执行
10. Planner仲裁&拒识
Planner前仲裁：端上接得住的query直接本地处理；接不住的上云，经拒识判断后由仲裁模型路由
Planner内拒识：Plan Describe阶段前引入拒识思考，直接输出reject
11. Planner训练
模型选型：s07用kimi-k2，s08切换doubao-1.8
训练方式：Function Call模式SFT精调 + RL强化
数据管线：从Kimi K2蒸馏 → GPT-4o打分 → Doubao-Seed-1.6训练 → Kimi K2评测的闭环
提取的实体
句法RAG：基于规则匹配的简单指令处理引擎
情景RAG：基于知识注入辅助复杂任务拆解的引擎
简单任务Planner：处理明确简单指令的 planner
复杂任务Planner：处理模糊/复杂指令的 planner
Plan Describe：Planner的特殊工具，用于调度前思考并展示计划
Always On：持续监听车辆状态的模块，用于触发挂起任务
提取的概念
漏斗原则：简单方法优先，复杂模型兜底的分层处理原则
Replan：任务执行失败后重新规划的能力
挂起任务：需等待特定条件（时间/地点/车速）触发的延迟执行任务
Function Call模式：Planner通过函数调用输出agent执行列表的交互模式
数据闭环：通过用户数据回流持续增强前端处理模块的迭代机制
