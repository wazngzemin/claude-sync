[summaries] 【AI汽车-PRD】多级VAD产品体验
概述
本文档定义了AI汽车语音交互中的三级VAD（Voice Activity Detection，语音活动检测）产品体验规范，包括Soft VAD、Hard VAD和Semantic VAD三个层级，以及预执行和语义完整性判断逻辑。
关键章节
1. 三级VAD定义


VAD级别

超时时间

作用

Soft VAD

300ms

检测语音开始，用于快速响应

Hard VAD

500ms

检测语音结束，基础断句

Semantic VAD

1000ms

语义完整性判断，决定是否等待更多内容
2. 预执行逻辑
在Soft VAD检测到语音开始后，可进行预执行准备
提前分配资源、预热模型，降低整体响应延迟
3. 语义完整性判断
Semantic VAD负责判断用户是否说完了完整的一句话
避免过早截断导致语义不完整
避免过晚等待导致响应延迟增加
核心要求
Soft VAD 300ms：快速检测语音开始，触发预执行
Hard VAD 500ms：基础语音结束检测
Semantic VAD 1000ms：结合语义判断是否真正结束
预执行需在Soft VAD触发后启动，但需控制资源消耗
语义完整性判断需平衡准确率和延迟
提取的实体
Soft VAD：300ms超时语音活动检测
Hard VAD：500ms超时语音活动检测
Semantic VAD：1000ms语义级语音活动检测
提取的概念
预执行：在确认用户指令完整前提前准备执行资源的优化策略
语义完整性：通过语义理解判断用户话语是否完整的机制
多级VAD：分层语音活动检测架构，兼顾快速响应和语义准确
