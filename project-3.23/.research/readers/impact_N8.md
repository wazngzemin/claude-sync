# impact_N8（Always on 感知 / 情景描述）——资料有、副本缺

来源：公共Context管理（全文+2画板）、事件日志PRD（全文+2画板）、PHUD PRD（全文）。

## 缺：情景描述是 Always on 的产物且有压缩节拍
公共 Context 管理：情景描述=按时间线记录 Always on 完成的舱内/舱外情景（示例"明骏上车了，竟然剪了寸头！还染了灰色！"），来源=感知模块，P0。压缩：每 10 轮情景描述总结一次（画板：描述1-10 → 前置情景总结 + 最新情景总结）。
- 事件日志 PRD 的架构画板里也画了同一架构：信号采集（当下端状态）+ Always on（连续视觉/端状态理解）+ 用户输入（含人人对话、手势、表情、动作）+ 事件日志 → context（不同 agent 不同组合）→ 子/主 agent → 指令解析/任务规划/执行表达。
- 链接：https://bytedance.larkoffice.com/wiki/Ip1kwhsLhioyegkuf9bcIUspnpb ｜ https://bytedance.larkoffice.com/wiki/Gt9qwfzlHiIKLgkWKCfcqYsYngg ｜ 状态：全文。

## 缺：感知上报周期的真实数字
PHUD PRD：VLM 舱内 AlwaysOn 高频约 5 秒、低频约 5min；舱外大件物品非周期约 0.6 秒上报。感知 4 路源=DMS/OMS/热成像/舱外视觉；字节侧做 VLM 推理输出标签，赛力斯做 CV 链路。
- 链接：https://bytedance.larkoffice.com/docx/H5xDdjkpvoHLepxHshucQqMGn64 ｜ 状态：全文 ｜ 车型：赛力斯。

## 缺：情景描述进事件日志的位置
事件日志列表里"情景描述"列来源=watcher（示例"当前在小区车库，已停车，车上没有人"/"明骏和雨晴上车了，他们看上去精神状态不错，满面笑容……明骏穿着浅蓝色印有猫咪图案的长袖T恤"）。即 watcher 持续产出自然语言情景，与毫秒时间戳、端状态并排落在事件日志一行里。
- 链接：https://bytedance.larkoffice.com/wiki/Gt9qwfzlHiIKLgkWKCfcqYsYngg ｜ 状态：全文。
