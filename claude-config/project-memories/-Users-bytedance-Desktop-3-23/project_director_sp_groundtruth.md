---
name: project_director_sp_groundtruth
description: Director 真实 SP 事实校正——存在多版本；06-09版26工具/5字段/情绪状态机，06-12版28工具/4字段/14emoji，07-22家越07版工具外置{{tool_list}}/情绪机砍掉/{{scenario_sample}}动态示例槽；端状态表格式、skill列表污染
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

**2026-07-22 第三版真实SP（家越07版）+ 陪读 round5/6：**
- 八大差异：车型D6X→家越07（新增冰箱/吸顶屏90-110°/腿托腰托/零重力·大床·折叠·大躺/20+外语12方言）；情绪状态机砍掉（无emotional_state_change，emoji 15个，示例断号10/14）；工具外置{{tool_list}}，工具名向"领域_动作"短名收敛，新增parking_fee_pay、vehicle_manual_qa回归；新增{{scenario_sample}}动态示例槽=动态示例V2出口；记忆拆{{query_related_memory}}+{{user_profile}}；注意事项14→6；能力边界四段式+用车安全（音量21档/单次5档须确认、R档禁调、零重力主驾须P档+左后无人、"文档未提及≠不存在要调工具试"）；唤醒词"豆包豆包"。
- 7处内部矛盾（可提SP owner）：①示例17"极速制冷"与边界"没有极速制冷"直接冲突（高危，修法=改成"最低温+最大风量+内循环"参数组合）②{{security_hardening_prompt}}未渲染 ③风格区引用已删除的speaking/chin_hand_think ④dancing重复 ⑤示例1成功后重复调action ⑥示例13删g-2/g-3话术复制残留 ⑦示例19中文引号。
- round6 深潜要点：远区精简会保留talk_content错误宣告（"空调已关闭"）反而提纯干扰源；情绪机砍掉后情感能力靠scenario_sample补（97条加3-5条情感示例）；advisor三洞（建议错了/被拒还问/紧急建议无直执通道）；安全区应升级"默认拒绝+白名单"；动态示例检索键要三元组（场景标签+工具+反义禁区，"我好热/我好冷"防embedding错配）；注入上限3条。

**Director PRD（剪存版 v1.0-v1.5, 02~04月）+ round7 串讲：**
- 对话需求：说做一致（内容+节奏）/无意义话术禁令（"我帮你查一下"=bad）/响应总结重复率要低/[情绪]标签；讲话风格7种可切换（草稿，未落地）。
- 推理需求：五结合（情景/端状态/记忆/人名改写/人人对话，全是"不拆什么"的减法case）；四任务类型。
- 条件任务=触发器母定义：合理性仲裁5条（可感知/可触发/价值观/可执行/不矛盾）；模糊条件Director主动明确化（"温度比较高"→26度）。
- 跟进任务=goal list+动态advisor：正例=无法一轮react闭环+打断后恢复价值高；数量仲裁6/6/1/2（定时6含vlm1/条件6/长程gui1/长时2）；goal list字段维护（创建=Director、状态进展=动态advisor）；感知订阅模块三类需求推理（动态感知/条件/定时）+信号组装=触发器产品定义；生命周期=车下电/完成/取消。
- 冲突处理：推理阶段首token未出=合并重推理、已出=user query打断、advisor等播报完+睡眠2s+同advisor只处理最新；交互阶段6策略矩阵（扔弃/排队/静默/整合/插队/停止），优先级 安全>导航>系统>复杂query>条件任务>主动服务。
- 节奏控制："豆包豆包"无含义→沉默/嗯你说我在；"豆包小公主/臭豆包"有含义→接话；附和"哦"→不回复继续；免唤醒多人不直接打断。
- 评测：首token P50 500ms/P90 800ms；推理ACC≥90%、端状态ACC≥93%；三fail字典=缺失/冗余/错误（泽民bug分诊的祖宗）。
- SP地图10组件：fc模型+白名单/拒识仲裁/Director SP/静态advisor×4/动态advisor模板/感知订阅模块(=触发器)/感知器/知识筛选专家SP/goal_list_update/播报层(sami TTS)。

陪读产物在 `planner 架构/planner_round1~7_*.html`（round4=D6X版解剖，round5=家越07版解剖，round6=作者视角8案例深潜，round7=Director PRD分模块串讲）。泽民反馈"round5不够深"——他要的是：真实case重放+作者设计意图+怎么解bug+体验抓手，不是结构清单。相关 [[project_trigger_system]] [[user_profile]] [[project_planner_bug_taxonomy]] [[project_dynamic_examples_v2]]。
