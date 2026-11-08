# impact_F —（按推断：触发器/主动服务/条件任务/长时任务编排）：资料有、副本可能缺的点

注：本组未拿到 10 F 节锚点，按章节序列（05 D→06 E→07 O）与材料归属推断 F=触发器/主动服务/条件任务/长时任务编排。若实际 F 为其他节，本文条目仍可按主题迁移。

来源：d02 座舱AI编排引擎需求、d04 触发器支持推理触发技术方案、d05 触发器-Planner条件任务需求、d03 Director PRD、t11 事件日志 PRD。

## 1. 触发器分类（PRD 口径）
- 触发器分离线触发器与在线触发器；在线=规则触发+模型触发；下游=触发主动服务、静态 advisor、推理触发、定时/条件/长时任务。
- 来源：https://bytedance.larkoffice.com/wiki/XRuKwJ0VPisdUhkxH0ecY1rRn9g【已确认 PRD】

## 2. 条件任务链路（d05 完整协议示例）
- Planner 拆出 If-Then → 调条件任务 Agent；条件任务 Agent 本质是分类器（日程提醒 vs 条件任务二分类）；触发器执行动作固定="通知 Planner 条件任务触发"，真正动作由 Planner 推理调度；需传任务 ID/用户 ID/车辆 ID；执行周期默认 1 次（"每天/每当"语义不限制；"明天/周一到周三"默认每天 1 次）；任一条件不存在则整任务注册失败；修改仅改条件/周期，改动作则触发器只改写任务原文。
- 来源：https://bytedance.larkoffice.com/wiki/GCfiwlJJei6fY7kYIOhcBXcxnlc【已确认需求】

## 3. 推理触发的端到端流程（d04 时序）
- Planner 识别长时任务（如"后排宝宝哭了提醒我"）→ TaskService → RegisterScene(model_inference) → 端侧 VLM 周期扫描上报识别结果 → 模型判断 → ACHIEVED 才回调；NOT_ACHIEVED/UNKNOWN/ERROR 记录观测 no-op。
- 来源：https://bytedance.larkoffice.com/wiki/Q11CwtB7mitzckkxmnmcKvIDnNg【已确认技术方案】

## 4. 原子能力四层底座（d02）
- 触发事件/条件/动作三类原子能力标准化封装；编排执行层端云协同、弱网/无网仍可运行（痛点：当前触发器部署在云端，弱网即"场景失灵"）；配置发布层（远期可视化拖拽）；数据闭环层（执行日志回传）。P0=场景原子能力。
- 来源：https://bytedance.larkoffice.com/docx/IPOldxmWloNCITxtVnXcZBGAnfc【已确认需求】

## 5. 高优事件直接触发新一轮 query（新分支）
- TTS 播报被拒识 query 打断、手动操作车机、上下车等高优事件，可直接以 event 输入触发 Planner 新一轮判断。
- 来源：https://bytedance.larkoffice.com/wiki/PRf0wRd3Uic0omkiiiGc70wanQN【已确认 One Page】

## 6. 事件日志作为触发器/记忆的原始素材
- 事件=能被车内人类感知、非规律、人/车/豆包行为变化；简单事件与复杂事件，复杂事件发生后替换之前的简单事件；事件字段含毫秒时间戳/事件ID/Face ID/交互形式/任务ID/端状态/情景描述。
- 来源：https://bytedance.larkoffice.com/wiki/Gt9qwfzlHiIKLgkWKCfcqYsYngg【已确认 PRD】
