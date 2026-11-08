# impact_N17 — 端状态 / VLM / 事件日志（车辆情境数据底座）：资料有、副本可能缺的点

来源：t12 端状态&事件日志上报 One Page、t11 事件日志 PRD、t08 S2S闲聊+端状态、t10 端状态&事件日志 wiki（空壳跳过）。

## 1. 三源定位（One Page 最新口径）
- 不是"三条接口"，而是 AI 汽车的车辆情境数据底座：端状态=实时快照、VLM=舱内外空间与乘员感知、事件日志=变化串成的时间线。
- 消费方：触发器规则判断、Context Query、Planner/Director、短期/长期记忆、下游订阅研发查询。
- 来源：https://bytedance.larkoffice.com/wiki/PRf0wRd3Uic0omkiiiGc70wanQN【已确认 One Page】

## 2. 协议与语义
- 一套抽象：资源定义+子资源参数+事件时间+上报类型；状态按新旧合并（全量/增量/删除三类上报，乱序按事件时间处理，带主键子资源合并）；事件只按时间线追加，不覆盖事实。
- 进入模型输入要经过事件定义/白名单/去噪，避免高频噪声直接灌给模型。
- 来源：t12【已确认 One Page】

## 3. Context 注入窗口
- 事件流按时间窗注入：最近 10 分钟、最多 30 条；高优事件（TTS 被拒识打断/手动操作/上下车）直接以 event 触发新一轮 query。
- 来源：t12【已确认 One Page】

## 4. 事件定义与分类（t11 PRD）
- 事件=发生的、能被车内人类感知的、非规律的、人/车/豆包行为或变化；轻微空气流动/常规转方向盘/眨眼不算事件。
- 简单事件（原子不可拆，耸肩抬手）vs 复杂事件（上车=迈步×N+开门+坐下）；复杂事件检测后替换之前的简单事件。
- 事件来源：端状态满足触发器规则生成、客户端直报用户操作/设备事件、云端业务记录人/人对话与任务执行。
- 来源：https://bytedance.larkoffice.com/wiki/Gt9qwfzlHiIKLgkWKCfcqYsYngg【已确认 PRD】

## 5. 事件列表字段
- 时间戳（毫秒）/事件ID/Face ID（车端识别）/交互形式（手动/语音）/触发任务ID与所属任务ID（从 Planner 获取）/端状态/情景描述（从 watcher 获取）/1-4 级分类/信号ID+信号名称；自然语言拼接不涉及大模型（11.18 更新）。
- 来源：t11【已确认 PRD】

## 6. S2S 侧端信号消费口径（t08）
- 信号只保留名称+状态、limit 50；普通聊天不透露信号信息；未知信号如实回复；当前状态优先。
- 来源：https://bytedance.larkoffice.com/docx/MCLWdWAoQokmQtxlGAbcWDShn2e【已确认 SP 模板】

## 7. 缺口记录
- t10 端状态&事件日志 wiki 入口为空壳 docx（仅标题），无正文；无权限不申请，按跳过处理。
- 来源：https://bytedance.larkoffice.com/wiki/ELfEwkzrpicwKckLbvVcn1Oenyh【空壳】
