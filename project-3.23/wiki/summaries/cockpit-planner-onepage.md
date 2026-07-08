---
title: 座舱Planner-OnePage
date: 2026-04-21
updated: 2026-04-27
tags: [summary, architecture, planner, agent, ai-car]
sources:
  - raw/articles/座舱Planner OnePage-1776677662.md
  - raw/articles/座舱Planner OnePage-1776677809.md
  - raw/articles/座舱Planner OnePage.md
status: active
---

## 概述

本文档是座舱Planner的OnePage总结，系统阐述了传统车载座舱架构的局限，提出基于"句法RAG + 情景RAG + 简单/复杂Planner + agents"的混合多智能体架构，作为多agent系统的中枢大脑统筹调度各个子agent。

## 关键章节

### 1. 传统架构缺陷
- **模块协同性不足**：各模块独立闭环，缺乏全局信息共享，跨域任务衔接差
- **场景感知能力薄弱**：未集成用户记忆与实时环境，无法自适应智能交互
- **成本与泛化瓶颈**：长尾场景需单独定制逻辑，研发成本高、周期长

### 2. 核心架构设计
采用混合方案：句法RAG作为前置可配置模块，planner模型作为系统"大脑"，配合情景RAG知识注入，整合全局状态信息。

**核心思想**：
- 句法RAG确保系统稳定、高效、车厂可配置
- planner模型 + 情景RAG确保复杂case的拆解、灵活、智能
- 漏斗原则：能通过简单方法搞定的不要漏到复杂模型处理

### 3. Planner能力定位
- **句法RAG引擎**：匹配指令，简单指令直接工程解析下发，提升响应速度
- **planner + 情景RAG**：负责模糊任务、复杂任务的规划
- **特殊工具**：plan_describe、search_user_preferences、search_vehicle_status_info、plan_update

### 4. 两种RAG类型

| 类型 | 触发条件 | 适用规则 | 举例 |
|------|----------|----------|------|
| 句法RAG | 用户query匹配 | 明确单轮query，不支持上下文/情景/记忆 | 拒识、车书、音乐搜播、音色演绎、出行规划、简单车控 |
| 情景RAG | 用户query匹配 | 模糊单轮query，注入知识辅助模型拆解 | 复杂车控（"我好热"）、复合意图、模糊意图 |

### 5. 任务模块划分

| 类别 | 细分类别 | 负责模块 |
|------|----------|----------|
| 简单车控 | 导航剧本、简单车控多轮 | 简单任务planner + SFT FC |
| 简单多媒体 | 播放/暂停/换歌 | 特殊处理/简单任务planner |
| 车书/音色演绎/出行规划/GUI agent/查天气 | 明确单轮 | 句法RAG匹配，直接下发agent |
| 查车机状态/查记忆 | 需要端状态信息 | 复杂任务planner |
| 视觉查询 | 前方车辆识别等 | 句法RAG或planner |
| 闲聊（开放域） | 开放对话 | 复杂任务planner |
| 复杂意图 | 复合意图、车控模糊意图、其他模糊意图 | 情景RAG + 复杂任务planner |
| advisor主动服务 | 主动推荐/执行 | 复杂任务planner |

### 6. 上下文管理
解决多轮任务延续性和multi-agent协同信息传输：
- 上下文隔离、选择、压缩、隔离
- Agent上下文同步
- 引用 Context Engineering 方法论（《A Survey of Context Engineering for Large Language Models》）

### 7. 长期记忆
- 用户画像、偏好、高频对话控制历史
- 车机控制记录（空调、后视镜等）
- 由planner的search memory tool判断调用时机

### 8. 环境多模态信息
- 车机状态、车内乘客状态、车内/车外图像感知
- 由planner的search env info tool判断调用时机

### 9. 任务管理
**任务定义**：原子性、可改写、可追踪
**任务状态**：PENDING / COMPLETED / FAILED
**关键机制**：
- **Replan**：下游agent执行失败时，planner重新生成可行计划
- **打断&恢复**：新query打断未完成的plan，保存checkpoint后恢复
- **挂起**：定时/条件触发的任务，由Always On模块监听条件后触发执行

### 10. 全局State管理（新增强节）
- **核心机制**：Planner模型 + 工程侧全局State配合。每一个query对应唯一plan_id
- **原理**：Planner将复杂任务拆解到agent list维度后，依赖plan_update function call输出"失败/已完成/待完成"状态，工程端解析存入全局State，同时放入messages，做到每个任务可被追踪
- **场景**：
  - 用户主动/advisor中断：前一个query对应的plan未全部执行完毕，被新的query打断
  - 条件触发任务：用户下达的指令包含未来特定时间或条件触发的动作，任务"挂起"直到满足预设条件后再继续执行

### 11. Planner仲裁&拒识
- **Planner前仲裁**：端上接得住的query直接本地处理；接不住的上云，经拒识判断后由仲裁模型路由
- **Planner内拒识**（新增强）：在Plan Describe阶段之前，引入拒识思考。content直接输出reject，不进行后续拆解等其他逻辑。当前存在格式输出不符合规定等缺点

### 12. 模型评测与切换计划（新增强）
- **主观评测结论**：doubao-1.8效果明显好于kimi-k2
- **切换计划**：s07暂时使用kimi（加入闲聊功能后kimi有稳定性问题）；12.18（s08第一周）切换doubao-1.8模型
- **后续训练**：所有迭代训练任务均在doubao家族模型上进行

### 13. Planner训练
- **模型选型**：Seed 1.6 flash SFT实现
- **训练方式**：Function Call模式SFT精调 + RL强化
- **数据管线**：从Kimi K2蒸馏 → GPT-4o打分 → Doubao-Seed-1.6训练 → Kimi K2评测的闭环

### 14. 阶段规划
- **第一阶段**：基线能力建设
- **第二阶段**：能力深化与优化

## 提取的实体

- **句法RAG**：基于规则匹配的简单指令处理引擎
- **情景RAG**：基于知识注入辅助复杂任务拆解的引擎
- **简单任务Planner**：处理明确简单指令的 planner
- **复杂任务Planner**：处理模糊/复杂指令的 planner
- **Plan Describe**：Planner的特殊工具，用于调度前思考并展示计划
- **Always On**：持续监听车辆状态的模块，用于触发挂起任务
- **doubao-1.8**：豆包1.8模型，新一代Planner主用模型
- **kimi-k2**：过渡期Planner模型，存在稳定性问题

## 提取的概念

- **漏斗原则**：简单方法优先，复杂模型兜底的分层处理原则
- **Replan**：任务执行失败后重新规划的能力
- **挂起任务**：需等待特定条件（时间/地点/车速）触发的延迟执行任务
- **Function Call模式**：Planner通过函数调用输出agent执行列表的交互模式
- **数据闭环**：通过用户数据回流持续增强前端处理模块的迭代机制
- **拒识思考**：Plan Describe阶段前对query进行拒识判断的机制
- **全局State**：每个query对应唯一plan_id，工程端管理的任务状态数据结构