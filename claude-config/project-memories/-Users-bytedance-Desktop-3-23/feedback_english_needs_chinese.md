---
name: feedback_english_needs_chinese
description: 泽民要求所有英文/代码术语后面必须带中文备注(括号)；中英文混杂读着难受，已多次强调仍被忽略
metadata: 
  node_type: memory
  type: feedback
  originSessionId: ecbba5d1-83f1-4a65-912c-c99679c3a1a9
---

给泽民写的任何产出（HTML/文档/表格/对话），**每一个英文或代码术语，后面必须紧跟中文备注（括号形式）**。他明确说"中英文参杂我读的很难受，我之前也说过，每次都要在英文后面带上中文备注，你怎么就是记不住"——2026-07-15 因为一份满是 `HandleTaskAction`/`RuleSpec`/`recommend_id`/`Runtime Dispatcher` 裸英文的模块详解表当场发火。

**Why:** 他是非技术背景的产品经理（见 [[user_profile]]），一堆裸英文代码名夹在中文里，阅读节奏被打断、看不懂、很难受。带中文备注不是可选润色，是他能不能读下去的硬门槛。这跟 [[feedback_detail_means_real_signals]] 同源——他要的是"能读懂的详细"，不是堆术语显专业。

**How to apply:** 写产出时，每个英文术语第一次及反复出现都写成 `英文（中文）`。示例统一译名：Planner（规划器）/ Task（任务）/ Task Service（任务服务）/ Task Agent（任务代理）/ Spec Builder（规格构建器）/ Task Manager（任务管理器）/ Repository（存储库）/ Trigger Adapter（触发器适配器）/ Runtime Dispatcher（运行时调度器）/ Message Dispatcher（消息分发器）/ Trigger（触发器）/ VLM（视觉大模型）/ callback（回调）/ RuleSpec（规则规格）/ TaskSpec（任务规格）/ TaskView（任务视图）/ Run（执行轮次）/ Guard（前置校验）/ Context（上下文）/ Frontier（端云消息通道）/ HMI（人机界面）/ Client（客户端）。代码函数名（HandleTaskAction 等）也要跟一句中文说明。交付前 grep 一遍抽查有没有漏网的裸英文。
