# impact_M（03 输入管理 / DT 相关）— 资料里有、副本还缺

> 本组与端侧 DT 链路耦合最紧。状态：【已落地】【2.6目标】【讨论中】【待核】。

## M1 本地上下文窗口的硬规则（副本没写数字）
- 窗口 = 30 分钟内、最多 10 轮。
- 超出窗口：历史对话只保留摘要，不保留全文。
- 公共 context 只同步子集，不是全量历史。
- 链接：https://bytedance.larkoffice.com/wiki/JXC3wPYxziUiJLk9ZlOcYSZ2nsg 【讨论中】赛力斯

## M2 上下文同步字段清单（副本没有）
每轮本地 DT 与云端同步的字段：
request_id / session_id / sound_zone（音区）/ local_asr_text / cloud_asr_text / final_result_type / function_name / function_arguments / nlg / timestamp。
用途：云端判断「这一轮到底以哪边为准」。
- 链接：https://bytedance.larkoffice.com/wiki/JXC3wPYxziUiJLk9ZlOcYSZ2nsg

## M3 继承规则：什么时候沿用上面那轮、什么时候清空
- 音区继承：副驾说「继续」，沿用副驾上一轮。
- 设备继承、功能继承。
- **跨拒识 query 继承**：中间一句被拒识（如跟人说话），不清空上一轮有效上下文；紧接着说「那现在去哪」，仍继承之前的导航话题。
- 夹杂新指令：优先级上云，不继承。
- 链接：https://bytedance.larkoffice.com/wiki/JXC3wPYxziUiJLk9ZlOcYSZ2nsg

## M4 干预缓存（前置规则层抢跑云端）
- 命中白名单正则 → 直出，抢在云端返回前执行。
- 例：「我的心很冷」→ unsupported_cloud（不上云）。
- 例：「（打开|开启）车窗」→ windows_open 直出。
- 链接：https://bytedance.larkoffice.com/wiki/JXC3wPYxziUiJLk9ZlOcYSZ2nsg

## M5 埋点与离线模型输出协议
- 埋点字段 local_cloud_fusion_result。
- 离线模型输出：classify（REJECT / WAIT / ATTEND）+ functionCall + replyTts。
- 链接：https://bytedance.larkoffice.com/wiki/JXC3wPYxziUiJLk9ZlOcYSZ2nsg

## M6 本地 TTS 缓存
- 思必驰；高频 NLG 缓存 1000 条滚动。
- 链接：https://bytedance.larkoffice.com/wiki/JXC3wPYxziUiJLk9ZlOcYSZ2nsg

## M7 验收指标（副本完全没有）
- 本地端到端 < 300ms。
- 意图精确率 > 98%、召回 > 70%。
- 拒识精确率 > 98%、召回 > 70%。
- 打断准确率 > 80%。
- 链接：https://bytedance.larkoffice.com/wiki/JXC3wPYxziUiJLk9ZlOcYSZ2nsg

## M8 多人同时说时的输入合并规则
- 同时说 = FC 未下发（正在识别中）。
- 合并格式：「主驾驶说'X'，副驾驶说'Y'」。
- 上限 4 人同时。
- 合并后**不再做简单复杂仲裁**，直接给 Planner。
- 冲突（两人要不同的车控）→ Planner 负责澄清。
- 链接：https://bytedance.larkoffice.com/wiki/U4xLwmQNki1Pu5kpyAGcHWtmngf
