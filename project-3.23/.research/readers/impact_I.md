# impact_I（08 多人插话、打断与恢复）— 资料里有、副本还缺

## I1 打断的短期方案（2.6）与实验版差异
- 短期方案：TTS 播报中，用户说的话**非拒识 + 非简单车控** → 立刻打断；1.5 秒内还没到简单车控判定，也打断。
- 实验版：ASR 识别 > 2 个字就停 TTS；判定为拒识则续播。
- 链接：https://bytedance.larkoffice.com/wiki/FLlSwl1GoicNugkWWLCcFxtmnhl 【2.6目标】

## I2 拒识后怎么续播（副本完全没讲）
- TTS 被打断时，pcm 缓存保留之前的音频。
- 判定拒识 → 从打断前**最后一个有效标点**（，。！？）后续播，不是从头重来。
- 判定召回 → 等新的 TTS，不续播旧的。
- 打断开关：可关。
- 链接：https://bytedance.larkoffice.com/wiki/FLlSwl1GoicNugkWWLCcFxtmnhl

## I3 激活态打断主流程（端云链路图下半段）
- TTS 播报中 → 本地打断模型（partial asr）→ 打断成功？等 vadend：
  - 成功 → vadend 进入主对话链路 → **端云双跑**（on-device + cloud 并行）。
  - 失败 → 继续 TTS 播报。
- 本地对话输出三分支同 R2（functioncall 直接采纳 / reject 不采信等云端 / 不支持等云端拒识+Planner）。
- 链接：https://bytedance.larkoffice.com/wiki/JXC3wPYxziUiJLk9ZlOcYSZ2nsg

## I4 多人同时说时任务执行中的三类规则
任务已在执行中，又有人说话：
- **控制 + 控制**：新指令需要 NLG 播报 → 打断旧任务，执行完恢复。
- **文本 + 文本**：后说的打断前说的。
- **控制 + 文本**：排队，界面显示「排队中」。
- **拒识不打断**：处理中的有效指令不能被拒识打断。
- 链接：https://bytedance.larkoffice.com/wiki/U4xLwmQNki1Pu5kpyAGcHWtmngf

## I5 车外语音的打断
- 播报中重说唤醒词 → 打断上一语音进程。
- 播报中下达新指令 → 打断当前播报。
- 链接：https://bytedance.larkoffice.com/wiki/U1P7wWnpbii8qdkRP5dcPG1YnCf

## I6 多模态拒识倾向信号（与 M/R 共用）
- 注视屏幕 = 强召回倾向。
- 单人 = 强召回倾向。
- 离线模型走高准低召，云端高召回兜底。
- 链接：https://bytedance.larkoffice.com/wiki/JXC3wPYxziUiJLk9ZlOcYSZ2nsg
