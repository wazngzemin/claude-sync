[concepts] 临停 Tool 体系
临停 Tool 体系
概述
临停功能新增 5 个 Tool，与现有 18 个 AgentTool 体系兼容，遵循统一 JSON Schema 规范。
Tool 清单
1. poi_search — POI 搜索
职责：根据用户描述搜索前方/附近 POI，返回可停靠位置信息
核心参数：query（用户描述）、search_radius_m（默认 250m，视距内约束）、search_direction（forward/both）
返回：POI 列表（名称、距离、坐标、建议停靠点、是否安全）
调用方：Planner（条件临停、POI 目标临停）
依赖：地图服务 REST API
2. visual_reference_detect — 视觉参照物检测
职责：VLM 识别用户口述的视觉参照物（大树、路灯、建筑、招牌等）
核心参数：reference_description、camera_source（front/front_left/front_right/all_external）、confidence_threshold（默认 0.7）
返回：参照物标签、置信度、方位、估计距离、边界框、建议停靠点
调用方：Planner（视觉参照物临停）
依赖：车载摄像头 + VLM 模型（gRPC）
3. gesture_direction_resolve — 手势方向解析
职责：融合手势数据 + 语音语义，解析目标方向
核心参数：gesture_data（手势类型/角度/座位/置信度）、voice_query（同步语音）
返回：解析方向、置信度、TTS 提示语
调用方：Planner（手势多模态临停）
数据源：复用现有手势识别 API（非新建感知模块）
注意：置信度阈值 0.5 待手势识别团队提供评测基线后校准
4. condition_monitor — 条件监控
职责：注册/查询/取消条件临停的监控条件，工程侧持续运行
核心参数：action（register/query/cancel）、condition（type/target/value/timeout）
支持条件类型：poi / distance / time / geo_fence / destination_proximity
返回：条件 ID、状态、剩余估计
关键：不依赖 Planner 多轮记忆，触发回调固定为 pullover_execute
5. pullover_execute — 靠边停车执行（最终执行器）
职责：向智驾系统下发靠边停车指令
三种模式：
immediate：就近立即靠边
target_position：指定坐标位置停靠
target_direction：指定方向最近可停靠点
核心参数：mode、target（坐标/POI）、direction（侧/角度）、urgency（normal/urgent）、source_scene
返回：执行状态、实际停靠点、拒绝原因、HMI 信号
调用方：directExecute（即时）或 Planner（条件/目标）
依赖：智驾控制系统（CAN 总线 / SOA）
调用时序
即时：句法RAG → directExecute → pullover_execute(mode=immediate)
条件：Planner → condition_monitor(register) → [等待] → pullover_execute
POI：Planner → poi_search → pullover_execute(mode=target_position)
视觉：Planner → visual_reference_detect → pullover_execute(mode=target_position)
手势：Planner → gesture_direction_resolve → pullover_execute(mode=target_direction)

子场景 B（途经点/目的地临停）
不在本 Tool 体系内：由 AD 侧 VLA 自主处理
Planner 仅下发 waypoint_pullover_intent 信号，不调用任何 Tool
与现有系统兼容性
5 个新 Tool 与现有 18 个 Tool 名称不冲突
pullover_execute 走智驾 SOA 通道，与 vehicle_basic_control 车控通道独立
Planner prompt 更新后需回归测试
关联页面
pullover-feature
pullover-state-machines
query-routing
director
planner
planner-tool-simplification
