[summaries] Planner Prompt 版本演进
Planner Prompt 版本演进
概述
Planner（又称 Director）是豆包车载 AI 的核心推理模块，其 System Prompt (SP) 从 v1 到 v3 经历了三个版本的迭代。本文档梳理各版本的核心变化、工具列表、指令约束，以及配套的问题点和优化方案。
SP 整体结构（所有版本共有）
每个版本的 SP 由以下模块组成：
角色定义与输入格式 — 定义 Planner 为"豆包 AI 汽车个人助手"，描述三类输入格式（user_query、advisor、tool_feedback）
工具定义（18 个工具） — 完整的工具描述、参数和注意事项
输出格式约束 — JSON 格式：talk_or_not / talk_content / action_list
注意事项（行为规则） — 核心行为约束列表
Few-shot 示例 — 多轮对话参考示例
车辆设备知识 — 空调、座椅、氛围灯等硬件参数知识库
工具使用 tips — 各工具的使用技巧和边界说明
其他知识 — 导航技巧、冥想体验、互动游戏、隐私管理等场景知识
聊天风格 — 人设和语音情绪表达原则
动态注入模块 — 舱内视觉感知、目标队列、车辆状态、用户记忆（模板变量）
工具列表（18 个工具，各版本一致）


序号

工具名

功能

1

vehicle_basic_control

车辆控制：空调、座椅、门窗、灯光、导航、播控

2

search_vehicle_status_info

车辆状态查询：温度、胎压、续航等

3

search_weather

天气查询：实时天气、沿途气象、生活指数

4

search_poi_qa

POI 搜索：餐饮、景点、加油站等

5

route_planning_qa

路线规划：多目的地、途经点、路线选择

6

navi_basic_control

导航基础控制：开始/暂停/结束导航、视角切换

7

vehicle_manual_qa

车书查询：OTA、保养、故障排查

8

search_and_control_short_video

短视频搜索推荐

9

search_and_control_music

音乐搜索推荐

10

search_user_memory

记忆检索

11

face_id_register

人脸注册

12

operate_user_memory

长期记忆更新

13

web_search

联网信息搜索

14

goal_list_update

持续目标管理（新增/删除）

15

search_and_control_ai_broadcast

AI 播客搜索播放

16

gui_agent_operation

GUI 操作：通过小程序完成星巴克、捷停车、美团、美味不用等

17

image_generate

图片生成（文生图、图生图）

18

search_visual_info

视觉问答：车内/外摄像头识别
版本演进对比
v1 (98KB, 3000 行) — 基础版本
注意事项：10 条基本规则
工具知识：11 条 tips，GUI Agent 仅有基础使用说明
示例数量：约 60 个 few-shot 示例
特点：结构完整但 GUI Agent 相关规则不完善，缺少状态管理、type 参数规范等关键约束
v2 (107KB, 3214 行) — GUI Agent 专项强化
注意事项：新增至 13 条，新增 3 条 GUI 相关规则：
第 11 条：任务独立执行，不受历史失败影响（防历史污染）
第 12 条：新任务参数不默认沿用历史信息（防地址污染）
第 13 条：打断后用 new_task 而非 add_info
工具知识：大幅扩充，新增以下完整规则块：
type 参数完整规范：new_task / add_info / delete_task 的触发时机和决策规则
GUI Agent 任务状态管理：状态识别规则（等待补充信息的特征判断）和处理规则
GUI Agent 返回状态播报规则：禁止超前播报，状态关键词与播报措辞的映射
小程序登录方式约束：美团/捷停车/美味不用等/星巴克的实际支持登录方式
延迟澄清原则：优先调用 GUI Agent 执行，而非主动预判澄清
混合指令处理规则：A 类即时动作 vs B 类 GUI 长时任务的拆分规则
示例数量：新增示例 61-64，覆盖 GUI 验证码回传、打断后恢复、混合指令拆分、中间状态播报
v2-alt (106KB, 3214 行) — v2 备选方案
与 v2 结构基本相同
差异：GUI 工具知识部分采用了不同的表达方式
使用"GUI长时任务 / 即时任务"的简洁分类说明替代 v2 的详细规则块
新增【美团小程序登录方式说明】作为独立的精简知识条目
整体更简洁，但规则覆盖度不如 v2 完整
定位：作为 v2 规则块的轻量替代方案，试图在规则完整性和 token 开销之间取得平衡
v3 (109KB, 3261 行) — 最新版本
注意事项：缩减为 12 条，v2 的第 11-13 条合并精简为：
第 11 条：GUI 等待状态优先判断（合并 v2 的状态管理核心逻辑）
第 12 条：当前轮信息优先于历史（合并 v2 的历史隔离逻辑）
工具知识：保留 v2 的全部规则块（type 规范、状态管理、播报规则、登录约束、延迟澄清、混合指令）
示例数量：示例 64 扩展为完整四轮对话（新增"提交成功后删除 goal"的闭环示例）
特点：相比 v2 更精炼，注意事项从 13 条压缩到 12 条但信息密度更高
问题点摘要
来源于 planner-问题点.md，归纳为 8 类问题：


编号

问题类别

核心描述

1

GUI 澄清指令被当闲聊

验证码、登录方式选择、订单确认等被忽略

2

澄清内容与页面不符

登录方式选项错误（如推荐微信登录但页面不支持）

3

受对话历史影响

历史失败污染、历史地址污染、打断后 type 参数传错

4

GUI Agent type 传错 + 播报过度承诺

中间状态被总结为"已完成"

5

advisor 上报问题

已结束任务的消息仍上报、误触发强制结束

6

Goal 创建/拆分问题

混合指令中非长时任务未被拆分

7

多任务互相影响

符合当前产品定义，暂不处理

8

POI 定位问题

美味不用等跨城市定位异常
优化方案摘要
来源于 planner-优化方案.md，针对 6 类问题提供 Prompt 级优化：


问题

优化方向

优先级

问题 1：GUI 澄清被当闲聊

新增"GUI Agent 任务状态管理"规则块 + 验证码 few-shot

P0

问题 2：澄清内容与页面不符

新增小程序登录方式约束 + 延迟澄清原则

P1-P2

问题 3：受对话历史影响

新增"历史隔离与任务重启规则" + 打断恢复 few-shot

P0-P1

问题 4：type 传错 + 播报过度承诺

替换 param 说明为完整 type 规范 + 播报状态映射表

P0-P1

问题 5：advisor 上报

标记为持续优化项，由 GUI Agent 侧处理

—

问题 6：Goal 拆分

新增"混合指令处理规则" + 拆分 few-shot

P2
优化方案的核心思路：通过规则显式化 + few-shot 示例强化来解决 Planner 的行为问题，而非修改模型或架构。v2/v3 的 SP 已经将优化方案中的大部分规则直接嵌入。
关联页面
director — Planner 所属的核心引擎
planner — 任务规划子模块
sp-compression-strategy — SP 压缩策略，与 SP 膨胀问题直接相关
planner-sp-structure — SP 模块结构分析
pullover-tools — 工具体系概述
gui-agent — GUI Agent 工具模块
planner-tool-simplification — Planner 职责分离方案
