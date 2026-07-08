[entities] Director（对话推理引擎）
Director（对话推理引擎）
定义
Director 是车载语音助手中的核心对话推理模块，负责理解用户意图、规划任务、调用工具并生成响应。整个系统以 SP（System Prompt）为核心驱动。
当前架构
用户请求 → Director(主模型) → Planner(任务规划) → 工具调用 → 执行结果

核心问题
PE 过长：当前 SP 约 32,800 tokens（含变量约 34,000），导致注意力分散和性能不稳定
幻觉问题：回答时产生不存在的信息（如虚假记忆）
工具调用决策错误：错误调用/重复调用/无限试错
多任务丢失：混合任务中丢掉部分子任务
优化方向
SP 压缩（目标 15,000 tokens 以下）
动态示例加载
模块化拆分（工具模块、知识模块、示例模块）
长期：模型训练替代 SP
相关人员
主责人：晓伟（产品）、明骏（开发）
算法：李强、赵磊、华健
临停功能中的角色
Director 在临停功能中是总调度入口。Query 经过路由后：
即时临停：不经过 Director，句法 RAG 直接调 pullover_execute
条件/目标临停：经过 Director → Planner 编排 Tool 调用链
子场景 B（途经点临停）：Director 仅做意图识别，下发信号给 AD 侧 VLA
关联页面
planner-tool-simplification
sp-compression-strategy
evaluation-system
pullover-feature
query-routing
