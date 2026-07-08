---
name: project_director_sp_groundtruth
description: Director 真实 SP 事实校正——存在多版本；06-09版26工具/5字段/情绪状态机，06-12版28工具/4字段/14emoji；端状态表格式、skill列表污染
metadata: 
  node_type: memory
  type: project
  originSessionId: 6bb93d1e-2e43-4f32-882f-194c538fdd9c
---

用户 2026-06-09 提供了 Director（=Planner）**当前生产环境真实 SP**，它是权威一手资料，纠正了 CLAUDE.md schema 和旧版 promptv3.md 的多处说法。讲架构/做评测时以此为准：

- **工具 = 26 个**（CLAUDE.md 说23、旧 promptv3 说18，都过时）。新增/回归：vehicle_system_settings、vehicle_communication_control、personal_skill_record、trip_plan_record、ai_broadcast_generate、auto_drive、ambient_light_control、car_log、car_care_qa、recording_minutes、image_generate(真可用)、search_visual_info(含屏幕内容问答)。
- **车型 = 上汽荣威 D6X，五座 SUV**（不是"6座增程版"）。后排空调不可调温/风量、座椅按摩仅前排、无HUD、车门/雨刮/儿童锁/智驾开关不支持语音——这些是车控幻觉的护栏。
- **输出 5 字段**：talk_or_not / talk_content / **emoji_id**(17个形象动画) / **emotional_state_change**(情绪状态机:平静/欣喜/关切/低落/生气/好奇,有转换规则,不突变) / action_list[{action_id,params,tool_name}]。
- **输入 user_query 新字段**：timestamp(自我时间感知,>30天好久不见)、assistant_emotional_state(情绪连贯)、goal_list、env_info(后两者随输入直传,可免调工具)。
- **易混点(评测重点)**：媒体播控(上一首/暂停)归 vehicle_system_settings 不归音乐工具；记忆分两类(客观事实→operate_user_memory，交互习惯→personal_skill_record)；**navi/route/poi/trip 4个工具不可并行**。
- **SP 末尾「动态专业知识」块 = 前置筛选模块注入点**，对应"知识筛选专家"SP（6类专家EXP/DRV/COM/ENT/LIFE/EMO×四段式知识ID），是 token 优化核心落点。

**2026-06-12 用户又贴了一版真实 SP，与上面 06-09 版有差异（存在多版本，讲解前确认是哪版）：**
- **工具 = 28 个**（编号到29缺18）。命名与06-09版不同：vehicle_communication（非_control）、user_memory_search/user_memory_operate、audio_record（非recording_minutes）、visual_qa（非search_visual_info）、broadcast_search 等。
- **输出 = 4 字段**：talk_or_not / talk_content（情绪用[]标签如[开心地说]写在话里）/ emoji_id（**14个**）/ action_list。**这版没有 emotional_state_change 独立字段，也不是17个emoji**——与06-09版的"5字段/情绪状态机/17emoji"冲突，说明版本在演进。
- **车端状态确实是表格式**`_参数顺序_:[模式,位置,状态,开关,温度]`+位置对齐行 → 实锤"模型读不懂端状态"(A2根因)；**当前播放音频在端状态里有歌名** → 歌名幻觉可改 music_search.notice 一行修复。
- **个性化skill列表(用户个性化需求)严重污染**：大量重复(s-90/91、s-102/103、s-144/145)、矛盾、无效"记录希望优化UI…后续反馈优化"skill → 占context稀释注意力，需 personal_skill_record 加去重+按说话人过滤。
- **可立即改 = 所有固定段纯文本**(工具notice/tips、注意事项、能力边界、参考示例)；端状态改造/skill清洗要工程；方位映射等要训练。
- 实修方案产物：`planner 架构/SP实修方案_基于真实SP_20260612.html`（逐工具before/after）；另有 系统大图_深度版、全量Bug逐例详细分析、流程图全景 等聚合报告。

陪读产物在 `planner 架构/planner_round1~4_*.html`（round4 是 SP 真身解剖）。相关 [[project_trigger_system]] [[user_profile]] [[project_planner_bug_taxonomy]]。
