# impact_A（17 视觉感知 / VQA）— 资料里有、副本还缺

## A1 VQA 六个功能与优先级（副本只有流程没有功能清单）
- 前车识别 P0 / LBS 识别 P1 / 通用识别 P1 / 舱内识别 P2 / 观影搭子 P1 / 游戏搭子 P1。
- 链接：https://bytedance.larkoffice.com/wiki/H80iw85YwiSS5Rkr6cccKAofnBc

## A2 提槽模型的输出结构
- direction（8 方位）+ target 分类（车 / LBS / 空 / 人物 / 物品 / 视频）。
- 摄像头方位映射：前 / 左前 / 右前 / 左 / 右 / 旁边 → 前视；后 / 左后 / 右后 → 后视。
- 舱内识别只用 OMS 摄像头。
- 上汽高配后排屏策略：屏降下来取双图。
- 链接：https://bytedance.larkoffice.com/wiki/H80iw85YwiSS5Rkr6cccKAofnBc

## A3 负例边界（哪些问题 VQA 不该接）
- 车书问答 / 路况查询 / 端状态问答 → 走别的工具，不走 VQA。
- 链接：https://bytedance.larkoffice.com/wiki/H80iw85YwiSS5Rkr6cccKAofnBc

## A4 异常处理表（副本没有）
摄像头关闭 / 摄像头故障 / 请求方位不支持 / 夜晚地库拍摄质量差 / 版权黑屏 / FC 输出非定义格式 → 各自对应兜底话术。
- 链接：https://bytedance.larkoffice.com/wiki/H80iw85YwiSS5Rkr6cccKAofnBc

## A5 全套验收指标
- 端到端满足度 ≥90 分。
- 车辆识别准确率 ≥90%；LBS ≥90%；通用 ≥80%；舱内 ≥85%；观影搭子 ≥85%。
- Planner 分发准确率 ≥95%；提槽模型准确率 ≥95%。
- 车辆场景响应 6s P90；LBS 场景响应 2.5s P90。
- 测试集比例：前车 : LBS : 通用 : 舱内 = 4 : 4 : 1 : 1。
- 链接：https://bytedance.larkoffice.com/wiki/H80iw85YwiSS5Rkr6cccKAofnBc

## A6 识别技术合作方
- 车辆识别由懂车帝「汽车 AI」提供，固定展示文本。
- 链接：https://bytedance.larkoffice.com/wiki/H80iw85YwiSS5Rkr6cccKAofnBc

## A7 SQ 项目 vs SLS 项目的 VQA 分叉（画板 FOMkwUFByhqEFMbmi77cFMV6ndh）
- SQ（无端侧模型）：Context → Planner → 提槽模型 → 车外 LBS 类 → 高德 Agent（暂定）；车内/车外非 LBS → VLM 模型。
- SLS（ORIN 端侧模型）：多一个「屏幕？」分支——屏幕 → 舱内视觉模型；非屏幕 → 车内/车外 → VLM。
- 持续任务：用户 Query → Planner → 动态 Advisor → 感知订阅模块 → 定时重发 attention → VQA 工具回传结果。
- 链接：https://bytedance.larkoffice.com/wiki/H80iw85YwiSS5Rkr6cccKAofnBc

## A8 端侧视觉感知的大小模型分工（画板 CsGbws7A3hgeIvb1JqBca7wanqb）
- 小模型：训练后识别既定高优标签，作为大模型兜底和补充。
- 大模型：不训练，只引导，SP 动态生成（例：识别人是否睡着）。
- 注意力管理模块：输出任务类型 / 触发条件（触发器适配 JSON）/ 端侧 LLM 所用 SP。
- 任务优先级：即时查询 P0 / 单次任务 P2 / 循环任务 P3 / 循环+条件 P1。
- 触发器在端侧的功能：单次感知（用提示词）/ 循环感知（基于计时器 / 信号状态）；主动服务 = 控制指令 + 播报指令。
- 云侧：手工配置规则下发；注意力管理 agent；face ID / 角色名称 / 位置三者关系；context 模块订阅或主动查询 → Adviser；Planner 判断是否为条件任务 → 任务管理。
- 链接：https://bytedance.larkoffice.com/docx/O39md6TNNoGeaxxiKdUcmd9qnT0

## A9 赛力斯 VQA 舱内完全端侧（画板 NWcDwBAcxhzTMublho9cc2fhnBf / Hy2uwslIMhq6rxbsxFccEqa9nif）
- 舱内识别完全端侧：云端下发 SP + Query → 端侧采集图片 → 端侧 VLM 推理 → 只回传 edge_vlm_result 文本，不回传原始图片。
- 端侧识别失败 → 兜底话术，**不 fallback 云端**（隐私保护）。
- 舱外 / LBS / 观影搭子仍走云端 VLM。
- 参数：拍照指令加 edge_vlm_up；回传 capture_details 里加 edge_vlm_result。
- 链路上 vqa.go 新增 isCabinEdgeVLMScene()，按 customConfig.VQAConfig.EnableCabinEdgeVLM 判断。
- 链接：https://bytedance.larkoffice.com/docx/OT9bdwF59oWYaWxhptbceLsunkb 【讨论中】赛力斯

## A10 1 月节点短期方案约束
- 端侧触发器短期无法开发完成，先让云端 Adviser 所需状态能正常上报。
- 演示场景：有眼力见的车控助手（冬天上车检测乘客着装 → 调空调）；副驾打电话自动调小音量；擤鼻涕/抽烟主动服务。
- 链接：https://bytedance.larkoffice.com/docx/O39md6TNNoGeaxxiKdUcmd9qnT0 【2.6目标】
