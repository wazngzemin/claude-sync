[entities] VAD 语音活动检测
VAD 语音活动检测
定义
Voice Activity Detection，用于检测用户语音起始和结束的关键模块，决定何时开始/停止语音识别及后续处理。
属性


属性

说明

Soft VAD

检测到人声即触发，灵敏度最高

Hard VAD

检测到有效语音内容后触发，过滤无意义声音

Semantic VAD

检测到完整语义后触发，用于判断语句完整性

预执行

在VAD检测到语音但未结束时，提前开始意图识别以减少整体延迟
多级VAD工作流
Soft VAD：检测到人声，唤醒ASR开始收音
Hard VAD：检测到有效语音，确认进入正式识别流程
Semantic VAD：判断语义完整性，决定何时结束识别并提交下游
关联
下游：asr（触发语音识别）
相关概念：voice-interruption-strategy（语音打断策略与VAD协同）
