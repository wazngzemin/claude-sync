# impact_V（01 声音成为正式请求）— 资料里有、副本还缺

> 来源：语音组 PRD / 评审。状态标注：【已落地】【2.6目标】【讨论中】【待核】。车型：路特斯 D6X / 赛力斯 SLS / 通用。

## V1 唤醒与 ASR 的全套量化口径（副本未收录具体数值）
- 唤醒响应 ≤350ms；唤醒成功率安静 ≥98%、嘈杂 ≥95%；误唤醒 ≤12 小时 1 次；唤醒抑制成功率 ≥95%。
- ASR 首字 ≤200ms、尾字 ≤500ms；句准率安静 ≥95%、嘈杂 ≥90%；支持热词 ≥3000 条。
- 二遍识别：粤语/上海话/闽南语 + 陕西/山西/江淮/四川口音，CER 7–10%。
- 回声消除 ≤50ms、信噪比 ≥20dB、4 路参考信号；麦克风未授权 → 播报「未获取麦克风权限」+ 引导「去设置」。
- 链接：https://bytedance.larkoffice.com/wiki/UIcgwzzo9iCQ2tkDz44cSjXXnBf 【2.6目标】通用

## V2 唤醒抑制与音区细节（副本只有概念）
- 车外人喊「豆包」不唤醒，给 Toast 提示（供应商不支持电子设备音频声源抑制）；靠背放倒 >120 度不误判为二排有人。
- 音区识别：5 座 5 音区 / 6 座 6 音区；声源定位误差 ±20cm；关闭某音区后该音区不响应并 Toast「该音区已关闭」。
- 链接：https://bytedance.larkoffice.com/wiki/UIcgwzzo9iCQ2tkDz44cSjXXnBf 【讨论中】

## V3 VAD 时间口径存在两套（副本按 OnePager 写，需标注差异）
- 副本口径（v14/服务端评审图）：Soft VAD+语义 0.6s 可能停顿 → pre_query；Hard+语义判停 0.3s。
- PRD《多级VAD产品体验》口径：Soft 300ms / Hard 500ms / 语义 VAD 1000ms。
- 语义完整性判断双路径：Soft 结果完整→LLM 意图/拒识；Hard 结果完整→与 Soft 文本比对，不一致则用 Hard 结果重请求拒识意图。
- 【待核】两套口径并存，讲课版应说明「PRD 与 OnePager 数字不同」。
- 链接：https://bytedance.larkoffice.com/wiki/FzViwCNb2iF43QkB5eDcD3D2nJh 、https://bytedance.larkoffice.com/wiki/PJMUwwRCNiC2A8kjXCjcs4Bun7Y

## V4 全时免唤醒的音区与状态（副本 02 R 已有部分，V 侧缺「声音何时成为输入」的前半段）
- 全时免唤醒开关默认开启（陪伴模式）；四音区按「座椅传感器检测有人 + Face ID」判定该音区可用。
- 手持电话的音区强拒识、不上云；连续对话 30 秒后退回未激活；话题分类每 5 轮一次。
- 链接：https://bytedance.larkoffice.com/docx/KSWtdjsmwoJ1TzxcIv4c57vinle 【2.6目标】通用

## V5 声纹的录制约束（副本只提了「声纹识人」）
- 显性录入：3 次说「豆包豆包」，单车上限 5 个；录制过程中不支持语义打断（其他话只当音频质量判断）。
- 检测到重复声纹 → 终止注册不占新槽位；昵称 2–6 个中文字符、禁英文数字特殊字符、敏感词校验。
- 声纹不绑定身份、不进对话系统，仅用于唤醒校验，本次语音数据验证后即删。
- 链接：https://bytedance.larkoffice.com/wiki/K5ZlwSCS0iVchUkwQbvcFQPqn8d 【已落地】赛力斯

## V6 车外语音的声音入口（副本没有这一节）
- 车外麦克风前后左右 4 阵列、识别距离 5 米；车外不支持免唤醒、单音区；信噪比要求 >5dB。
- 状态机 S0–S5；双重验证（钥匙/车辆已解锁 + 声纹通过）；P 挡 + 车内无人才允许车外唤醒；距离门禁 + ISD 灯反馈。
- 车内外互斥以「车内是否有人」为唯一依据；500ms 内同时唤醒不允许同时进入。
- 指标：唤醒响应 ≤500ms、端到端 ≤1200ms。
- 链接：https://bytedance.larkoffice.com/wiki/U1P7wWnpbii8qdkRP5dcPG1YnCf 【2.6目标】赛力斯
