[concepts] SP 压缩策略
SP 压缩策略
背景
当前 System Prompt (SP) 约 32,800 tokens（含变量约 34,000），导致模型注意力分散、性能不稳定、幻觉增加。
压缩目标
从 ~34,000 tokens 压缩到 15,000 以下（减少 > 50%）
压缩方法
1. 字段精简


字段

优化方式

预估节省

speaker_name → speaker

缩短字段名

~1000 tokens

sp_position → 音序

缩短字段名

~1000 tokens

tool_name → tool

缩短字段名

~1000 tokens
2. 静态 + 动态示例拆分
静态示例：保留 10-15 个核心 case（优先选第一轮交互）
动态示例：根据工具返回结果动态加载相关示例
动态加载方式：基于 query 检索 + 基于工具返回匹配
3. 知识动态注入
将 know-how 从固定内容改为动态检索
按任务类型加载相关知识
控制注入量
4. 模块化
Director 核心主逻辑（不常改）
工具描述模块
知识 & Context 模块
示例模块
延时影响
节省的 ~90ms 可用于做一次 VikingDB 检索，最终延时不变。
关联页面
director
planner
evaluation-system
planner-sp-structure
planner-prompt-evolution
