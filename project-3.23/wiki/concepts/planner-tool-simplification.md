---
title: Planner 工具简化方案
date: 2026-04-14
tags: [concept, architecture, technology]
sources:
  - raw/articles/项目优化完整方案.md
  - raw/articles/会议记录.md
status: active
---

# Planner 工具简化方案

## 核心理念：职责分离
将"规划"和"参数构造"分离开来，降低单个模型的认知负荷。

## 改造前
```
Planner输出 → {
  type: "create_task" | "supplement_info",
  task_description: "...",
  context: {...},
  dependencies: [...]
}
```
模型需要同时做任务规划 + 参数区分 + 结构化输出，错误率高。

## 改造后
```
用户请求
  ↓
Director (主模型)
  ↓
Planner (只输出自然语言规划)
  "我需要创建一个任务来处理用户的登录请求，需要先验证用户名和密码"
  ↓
Flash模型 (参数转换 + 知识注入)
  ↓
工具调用 (结构化参数)
  ↓
执行结果
```

## Flash 模型职责
1. 接收 Planner 的自然语言输出
2. 判断是"创建任务"还是"补充信息"
3. 转换为结构化工具参数
4. 注入 GUI 相关专业知识

## 适用范围
- 所有双参数输出的工具（Planner、生图工具等）
- 原则：大模型做决策，小模型做细节

## 关联页面
- [[director]]
- [[planner]]
- [[gui-agent]]
