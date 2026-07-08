[summaries] GUI Agent 问题分类
GUI Agent 问题分类
截止日期：2026-03-30
概要
对 GUI Agent 融入主链路后的问题进行分类和解决方向梳理，识别出三大类问题。
三大类问题
1. 指令理解错误
把澄清指令当成闲聊处理
解决方向：补充知识、增加示例、强化任务处理意识
2. 工具参数混淆
Planner 需输出"创建任务"和"补充信息"两种参数，经常弄混
根因：下游工具难度高
解决方向：简化 planner 输出为自然语言、用 Flash 模型做二次思考、拆分 agent
3. 任务难度高
GUI 任务本身复杂度高，导致各类问题频发
优化策略


阶段

方案

短期

补充知识和示例，解决指令理解；工具链路重构

中期

用小模型处理下游工具细节；减轻主 director 压力；所有复杂工具前置模型思考
行动建议
体验 Pad 实际使用场景
参考 badcase 清单逐个分析
多讨论解决思路
关联页面
gui-architecture-refactoring
director-optimization
planner-tool-simplification
