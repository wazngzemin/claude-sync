# E 章事实研究

研究日期：2026-11-16。只研究，不写正文、不改网页；历史状态按来源时点记录，不推定为今日上线状态。

来源路径以本目录上一级 research 为根（写成 research/... 的同样相对于座舱业务学习站）；原文行号为本地副本1基物理行号。会议以文字记录为准，既有笔记转述标辅助。事实、设计方案、静态风险和研究推论保留身份。各编号是证据条目，跨来源复述同一机制会保留，数量不是独立产品能力总数。

## 01 动作交出后由谁接手、按项目找实现

- [F001] Agent Server 是云端单 Agent 管理与调用层，屏蔽各实现的调用细节，Planner 多动作编排由独立 LLM 调度模块负责。（来源：chapters/E/raw/agentserver.txt:2–4，9/10 One Page）
- [F002] 单次调用先用 agent_id 查请求端点和来源类型，再按元信息补上下文依赖，经对应 Executor 调用后统一转成座舱 Agent 回包。（来源：chapters/E/raw/agentserver.txt:11–19）

- [F007] 7/28 优化方案针对部分 Agent 在 Agent Server 外硬编码接入、租户隔离依赖硬编码和缺少可视化全生命周期管理三个问题。（来源：chapters/E/raw/agentserver-opt.txt:2–6、16–26；当时问题及分期方案）
- [F008] 租户可以选择需要的 Agent，并为同一个 Agent 配置隔离实现，以免上汽与赛力斯等项目互相影响。（来源：chapters/E/raw/agentserver-opt.txt:27–43）
- [F009] AgentDefine 保存系统唯一的能力定义，AgentConfig 按 channel+channel_app_id+agent_id 唯一保存租户已发布实现，AgentVersion 保留一个发布版本和多个环境限定草稿。（来源：chapters/E/raw/agentserver-opt.txt:44–54）
- [F010] 发布草稿时事务内软删旧发布版本、提升指定草稿、移除对应环境绑定并覆盖生效配置，避免只改一半的发布状态。（来源：chapters/E/raw/agentserver-opt.txt:70–76；方案）
- [F011] 运行时按租户和环境查询唯一生效实现，Planner 构造系统提示词时动态加载工具信息，租户已发布列表缓存5分钟。（来源：chapters/E/raw/agentserver-opt.txt:97–101；方案）
- [F012] 自建和离线 Agent 仍由云端或车端代码实现，生态 Agent 可通过接入配置实现多版本，自建 Agent 需先取得平台 AgentID 再映射实现对象。（来源：chapters/E/raw/agentserver-opt.txt:51、102–104）

- [F015] 8/28 平台 SOP 采用定义—实现两层架构，工具定义描述能力，实现保存租户、参数、版本与接入点，租户隔离键是 channel+channel_app_id。（来源：chapters/E/raw/agent-sop.txt:2–8、23–33）
- [F016] Agent 实现可配置是否参与 Planner 推理、云端或车端集成、提供方、限制说明、覆盖描述、参数说明和使用提示，后四项直接影响模型如何调用。（来源：chapters/E/raw/agent-sop.txt:195–206、272）
- [F017] 平台接入方式列 http、kitex、mcp、frontier 四种，禁用只影响当前渠道的当前实现，上线至少需要相应渠道一个启用且已发布实现。（来源：chapters/E/raw/agent-sop.txt:207–224；协议准入细节归 F）

- **B-F001**：执行层解析 action_list 完成工具调用、执行与结果反馈，Planner 收到反馈后结合上下文再推理。（来源：`research/chapters/D/raw/director-prd.txt` 第 207～213 行；状态：2026-10-12 v1.7 产品规则。）

- **B-F021**：干预规则按渠道、环境和 app_id 区分，规则函数结果和泛化问分别存储。（来源：`research/v-lesson-20261107/raw/offline-intervene.txt` 第 18～42 行；状态：技术方案及计划，未由本副本验证上线。）

## 02 工具清单、实现方与输入输出

- [F006] 客户自有 Agent 需要按座舱对外 Agent 协议实现并提供接入点，注册后才纳入整体链路调用。（来源：chapters/E/raw/agentserver.txt:81–83；接入细节归 F 章）

- [F020] 动态加载型工具只在触发场景满足时暴露给 Planner，解决端侧可见即可说仅匹配白名单文本、难以泛化到卡片按钮语义的问题。（来源：chapters/E/raw/dynamic-tools.txt:2–8；10/22技术方案）
- [F021] 条件引擎在每次 Planner 推理前批量判断工具，条件可且/或组合，本期字段源只支持param，判断支持exist/not_exist/in/not_in，端状态判断复用Trigger属于后续规划。（来源：chapters/E/raw/dynamic-tools.txt:9–36、74–75）
- [F022] 当前页特有操作工具 current_page_specific 的描述按卡片标题、正文、按钮和触发原因动态生成，只允许操作当前页面可操作项。（来源：chapters/E/raw/dynamic-tools.txt:152–185）
- [F023] 即时卡片数据经query上行vehicle_biz_params.ext.real_time_card传递，包含title/content/button/reason/card_id，未来归Context统一管理。（来源：chapters/E/raw/dynamic-tools.txt:154–172、195–212；本期与后续分开）
- [F024] 卡片工具模型输出select_button，向客户端返回chunk_type=1/content_type=9和按钮选择结果，文内agent_id仍待定。（来源：chapters/E/raw/dynamic-tools.txt:189–222；方案）

- **B-F009**：10/12 标准化工具表共 33 个业务行，分 14 必选、16 可选与 3 上汽定制，不能等同数据库配置数或某个车型实际可见数。（来源：`research/chapters/D/raw/director-prd.txt` 第 1245～1555 行；状态：2026-10-12 v1.7 产品规则。）

- **B-F010**：标准化表中普通工具本身不接受项目定制，只允许下游协议适配，记忆操作和检索则直接标不接受定制。（来源：`research/chapters/D/raw/director-prd.txt` 第 1257～1531 行；状态：2026-10-12 v1.7 产品规则。）

- **B-F014**：项目根 AGENTS 的 23 个工具和旧名 search_poi_qa 等是该文件的历史描述，10/12 版标准化表已采用 poi_search、music_search 等新名。（来源：`research/chapters/D/raw/director-prd.txt` 第 168～176、1320～1338、1383～1400 行；状态：2026-10-12 v1.7 产品规则。）

- [F049] 11/4工具实现快照覆盖225条配置、50个AgentID，其中212条启用涉及49个AgentID，不能用此数充当Planner本轮可见工具数。（来源：chapters/E/raw/tool-list.txt:48–58）
- [F050] 快照“全部”仅指已配置渠道的实现一致，不表示所有渠道已配置，启用配置也不证明已验证可调用。（来源：chapters/E/raw/tool-list.txt:54–58）
- [F051] DPFM提供车书、音乐、Query改写、导航控制、系统设置、车载通讯、媒体控制、智驾、前车识别和氛围灯等多类能力，宜称内部能力平台而非只称车控服务。（来源：chapters/E/raw/tool-list.txt:5–31）
- [F052] AIDV自建提供记忆、人脸、录音纪要、停车支付、车辆状态查询、目标跟踪和问题反馈等，离线车控与离线可见即可说标车端离线，豆包提供联网搜索、图片生成和s2s。（来源：chapters/E/raw/tool-list.txt:10–45）
- [F053] 弋途提供POI、路线规划、LBS、AI播客生成、导航基础AINavi、行程规划记录、订座、选点、行程与内容编排及高德两工具，视觉问答提供方为方舟智能体。（来源：chapters/E/raw/tool-list.txt:9、13–14、20–22、28–47）
- [F054] 生态执行器支持HTTP/SSE、MCP、Frontier，但本次快照的生态配置全部使用HTTP，不能把框架支持当作当前配置。（来源：chapters/E/raw/tool-list.txt:62）

### 全量工具逐项输入输出（40行，含8条弃用，不是当轮可见数）
- [TOOL-01] 车辆控制工具（vehicle_basic_control；项目：主线,赛力斯,上汽；实现：本快照未给同名映射）接收车窗、空调、座椅等明确车控指令，返回改写query+函数名+状态，失败加原因，超时“执行失败，请勿重复调用，需要告知用户”。（来源：chapters/E/raw/tools-io.txt:27）
- [TOOL-02] 系统设置工具（vehicle_system_settings；项目：主线,赛力斯,上汽；实现：内部DPFM）接收系统无线连接、屏幕、声音、权限、应用/页面开关等指令，返回本行未填写独立输出。（来源：chapters/E/raw/tools-io.txt:28；提供方来源tool-list.txt:26）
- [TOOL-03] 车载通讯工具（vehicle_communication；项目：主线,赛力斯,上汽；实现：内部DPFM）接收拨打/挂断/接听电话或视频通话指令，返回本行未填写独立输出。（来源：chapters/E/raw/tools-io.txt:29；提供方来源tool-list.txt:27）
- [TOOL-04] 智能辅助驾驶工具（auto_drive；项目：主线,赛力斯,上汽；实现：内部DPFM）接收泊车、巡航速度、跟车时距、变道、智驾风格指令，返回本行未填写独立输出。（来源：chapters/E/raw/tools-io.txt:30；提供方来源tool-list.txt:24）
- [TOOL-05] 路线规划工具（AiNavi版）（route_planning；项目：主线,赛力斯,上汽；实现：弋途）接收明确目的地、路线约束、途经点和选路线指令，返回带poiId/名称/地址/位置的POI列表，或带route_id/时间/里程/费用/红绿灯数的路线列表，仅填非空字段。（来源：chapters/E/raw/tools-io.txt:31；提供方来源tool-list.txt:14）
- [TOOL-06] POI查询工具（AINavi版）（poi_search；项目：主线,赛力斯,上汽；实现：弋途）接收按类别、附近/中间/沿途及多条件查地点，返回按序POI列表及可选个数，失败区分普通无结果、沿途无结果、缺导航路线。（来源：chapters/E/raw/tools-io.txt:32；提供方来源tool-list.txt:13）
- [TOOL-07] 行程规划记录工具（AINavi版）（trip_plan_record；项目：主线,赛力斯,上汽；实现：弋途）接收含标题、日程地点顺序的创建/预览或编辑指令，返回保存/新增/删除/更新的具体对象，创建/修改失败或追问出发时间。（来源：chapters/E/raw/tools-io.txt:33；提供方来源tool-list.txt:28）
- [TOOL-08] 选点工具（map_location_pick；项目：主线,上汽；实现：弋途）接收具体地点名称或当前定位的选点指令，返回本行样例为“搜索到多个地点，需用户选择”，描述另约定地点名/地址/经纬度。（来源：chapters/E/raw/tools-io.txt:34；提供方来源tool-list.txt:39）
- [TOOL-09] 本地生活查询工具（豆包版）（search_local_life；项目：弃用；实现：历史行，勿作为当前提供方）接收美食/景点/娱乐/住宿搜索条件，返回弃用行保留POI JSON、联网兜底与报错样例。（来源：chapters/E/raw/tools-io.txt:35）
- [TOOL-10] 导航基础控制（FC版）（navi_basic_control；项目：主线,赛力斯,上汽；实现：内部DPFM）接收导航启停、地图、播报、收藏和设置指令，返回执行成功或三种失败（无法执行/不在导航/不支持），无结果“执行失败，请勿重复调用”。（来源：chapters/E/raw/tools-io.txt:36；提供方来源tool-list.txt:16）
- [TOOL-11] 车辆状态查询工具（vehicle_status_search；项目：主线,赛力斯,上汽；实现：内部AIDV）接收需要的实时端状态问题，返回带空调/除霜/音量等状态的文本，无数据“结果为空”。（来源：chapters/E/raw/tools-io.txt:37；提供方来源tool-list.txt:33）
- [TOOL-12] 天气查询工具（weather_search；项目：主线,赛力斯,上汽；实现：上汽DPFM、赛力斯弋途）接收城市、小时级时间及天气维度，返回天气文本，无数据“结果为空”。（来源：chapters/E/raw/tools-io.txt:38；提供方来源tool-list.txt:3）
- [TOOL-13] 车书查询工具（vehicle_manual_qa；项目：主线,赛力斯,上汽；实现：内部DPFM）接收通用车辆功能和用车方法问题，返回输出本行空白且标需要工具播报，不能补造结构。（来源：chapters/E/raw/tools-io.txt:39；提供方来源tool-list.txt:6）
- [TOOL-14] 声音演绎工具（voice_acting；项目：弃用；实现：历史行，勿作为当前提供方）接收唱歌、方言、翻译和角色声音要求，返回弃用行直接下发并中断后续Planner，不返回Planner。（来源：chapters/E/raw/tools-io.txt:40）
- [TOOL-15] 视频搜索推荐工具（video_search；项目：主线,赛力斯,上汽；实现：短视频：抖音 / 长视频：爱优腾Bili的开放接口）接收短视频关键词/类型或长视频剧名/演员/类型，返回短视频返回N条待手动点击或无结果，长视频返回函数+状态/原因，后排屏未开须先澄清。（来源：chapters/E/raw/tools-io.txt:41；提供方来源tool-list.txt:5）
- [TOOL-16] 音乐查询播放工具（豆包版）（music_search；项目：弃用；实现：历史行，勿作为当前提供方）接收歌曲名、歌手或类型，返回弃用豆包版保留album/playlist/track JSON或无版权短视频音频替代。（来源：chapters/E/raw/tools-io.txt:42；提供方来源tool-list.txt:8）
- [TOOL-17] 音乐查询播放工具（FC版）（music_search；项目：主线,赛力斯,上汽；实现：内部DPFM）接收歌曲名、歌手或类型，返回成功songName/singerName/albumName，失败函数+状态+原因，无返回禁止重复调用。（来源：chapters/E/raw/tools-io.txt:43；提供方来源tool-list.txt:8）
- [TOOL-18] 媒体控制工具（media_basic_control；项目：主线,赛力斯,上汽；实现：内部DPFM）接收暂停播放、切歌、收藏、进度倍速等媒体指令，返回函数+状态，失败加未登录/已是当前状态等原因，超时禁止重复调用。（来源：chapters/E/raw/tools-io.txt:44；提供方来源tool-list.txt:31）
- [TOOL-19] 记忆检索工具（user_memory_search；项目：主线,赛力斯,上汽；实现：内部AIDV）接收完整人名与要查询的记忆问题，返回未注册身份不可查，已注册返回记忆内容/时间记录或未查到。（来源：chapters/E/raw/tools-io.txt:45；提供方来源tool-list.txt:34）
- [TOOL-20] 基础信息记忆工具（user_memory_operate；项目：主线,赛力斯,上汽；实现：内部AIDV）接收明确对象的新增或修改记忆内容，返回操作完成，未注册人脸须先注册，其他错误无法操作。（来源：chapters/E/raw/tools-io.txt:46；提供方来源tool-list.txt:11）
- [TOOL-21] 人脸记忆工具（face_id_register；项目：主线,赛力斯,上汽；实现：内部AIDV）接收昵称、座位、关系的注册修改查看，返回注册成功或账号/缺槽/昵称重复/无人脸/无人落座等细分失败。（来源：chapters/E/raw/tools-io.txt:47；提供方来源tool-list.txt:12）
- [TOOL-22] 联网信息搜索工具（web_search；项目：主线,赛力斯,上汽；实现：豆包）接收用于中间决策的联网问题，返回搜索文本或“结果为空”。（来源：chapters/E/raw/tools-io.txt:48；提供方来源tool-list.txt:10）
- [TOOL-23] 联网问答工具（web_qa；项目：弃用；实现：历史行，勿作为当前提供方）接收直接答复的联网问题，返回弃用行保留直接答案或空结果。（来源：chapters/E/raw/tools-io.txt:49）
- [TOOL-24] 定时提醒工具（operate_conditional_task；项目：弃用；实现：历史行，勿作为当前提供方）接收提醒的增删改查信息，返回弃用行保留各动作成功/未找到匹配提醒等回执。（来源：chapters/E/raw/tools-io.txt:50）
- [TOOL-25] AI播客工具（临时）（search_and_control_ai_broadcast；项目：弃用；实现：历史行，勿作为当前提供方）接收深入研究话题的播客搜索播放请求，返回弃用行保留标题或未搜索到结果。（来源：chapters/E/raw/tools-io.txt:51）
- [TOOL-26] GUIAgent（gui_agent_operation；项目：弃用；实现：历史行，勿作为当前提供方）接收咖啡、外卖、餐厅或缴费完整任务信息，返回弃用行返回clarify/handoff/finish或任务异常，并区分提交订单与手机待支付。（来源：chapters/E/raw/tools-io.txt:52）
- [TOOL-27] 录音纪要工具（audio_record；项目：主线,赛力斯,上汽；实现：内部AIDV）接收车内录音纪要开始、结束、查看，返回8种开始/结束/查看成功失败及重复启停回执。（来源：chapters/E/raw/tools-io.txt:53；提供方来源tool-list.txt:18）
- [TOOL-28] 图片生成工具（image_generate；项目：主线,赛力斯,上汽；实现：豆包）接收图片描述或多轮改图指令，返回受理“这就帮你生成”、生成完成、生成错误三个阶段。（来源：chapters/E/raw/tools-io.txt:54；提供方来源tool-list.txt:17）
- [TOOL-29] 视觉问答（visual_qa；项目：主线,赛力斯,上汽；实现：方舟智能体）接收车内外目标视觉问题，返回识别文本或缺图/函数不符/超时/无LBS/不支持方向/上汽屏幕不支持。（来源：chapters/E/raw/tools-io.txt:55；提供方来源tool-list.txt:9）
- [TOOL-30] 氛围灯控制工具（ambient_light_control；项目：上汽；实现：内部DPFM）接收氛围灯开关模式颜色或结合视觉的调节，返回编排中、改写query+编排完成/失败、无流水灯/无氛围灯配置。（来源：chapters/E/raw/tools-io.txt:56；提供方来源tool-list.txt:15）
- [TOOL-31] 播客搜索工具（broadcast_search；项目：主线,赛力斯,上汽；实现：上汽弋途、赛力斯DPFM）接收长音频类型、作者、节目、喜马拉雅播放器及多轮选择，返回播放/换批成功、无结果、搜索异常、未同意隐私协议、未先搜索/缺节目/序号越界。（来源：chapters/E/raw/tools-io.txt:57；提供方来源tool-list.txt:22）
- [TOOL-32] AI播客生成工具（ai_broadcast_generate；项目：主线,赛力斯,上汽；实现：弋途）接收生成播客的话题或长文本，返回正在生成并播放或生成错误，受理不等于最终播放验收。（来源：chapters/E/raw/tools-io.txt:58；提供方来源tool-list.txt:21）
- [TOOL-33] 车况维养及查询工具（car_care_qa；项目：上汽；实现：上汽）接收绑定本车的生产、历史、维修保养、权益等查询，返回输出“依赖客户提供”，非实时/长周期查询。（来源：chapters/E/raw/tools-io.txt:59；提供方来源tool-list.txt:30）
- [TOOL-34] 用车报告工具（car_log；项目：上汽；实现：上汽）接收时间段或事件名称，返回正在生成用车报告或生成错误，未给最终报告结果格式。（来源：chapters/E/raw/tools-io.txt:60；提供方来源tool-list.txt:25）
- [TOOL-35] 停车费查询及支付工具（parking_fee_pay；项目：主线,赛力斯,上汽；实现：内部AIDV）接收已确认的车牌号，返回停车场/时长/待扫码支付金额，或无缴费信息/车牌注册失败。（来源：chapters/E/raw/tools-io.txt:61；提供方来源tool-list.txt:32）
- [TOOL-36] 美团餐厅服务工具（meituan_restaurant_service；项目：主线,赛力斯,上汽；实现：实现快照使用restaurant_reserve，由弋途提供（同ID需核映射））接收完整餐厅名及订座日期人数位置联系人，排队只需人数/桌型，返回餐厅列表、登录/澄清/定金手动操作、已提交待商家确认/商家确认预约成功/取消或失败。（来源：chapters/E/raw/tools-io.txt:62；提供方来源tool-list.txt:38）
- [TOOL-37] 个性化技能记录工具（personal_skill_record；项目：弃用；实现：历史行，勿作为当前提供方）接收本行未填写，返回弃用且本行未填写。（来源：chapters/E/raw/tools-io.txt:63）
- [TOOL-38] 持续目标管理工具（goal_list_update；项目：主线,赛力斯,上汽；实现：内部AIDV）接收新增目标原文或删除实际goal_id列表，返回创建中/删除成功或手动删除提示，后续结果才确认创建成功。（来源：chapters/E/raw/tools-io.txt:64；提供方来源tool-list.txt:35）
- [TOOL-39] 高德复杂规划工具（amap_complex_planning；项目：赛力斯；实现：弋途）接收具体道路走避约束或非枚举路线风格，返回POI列表或路线列表，不能与route_planning/导航交互并行。（来源：chapters/E/raw/tools-io.txt:65；提供方来源tool-list.txt:46）
- [TOOL-40] 高德导航交互工具（amap_navigation_interaction；项目：赛力斯；实现：弋途）接收算路/导航状态下动作或道路交通路线原因问题，返回高德纯文本结果，与其他导航域工具不能并行。（来源：chapters/E/raw/tools-io.txt:66；提供方来源tool-list.txt:47）

- **B-F049**：11/3 分工要求汇总非车控原子工具的进展与 Planner 配合关系，新增媒体、美团和停车是重点。（来源：`research/v-lesson-20261105/memory/meeting-1103-transcript.md` 第 1011～1017（00:30:21～00:31:14） 行；状态：2026-11-03 文字记录，当时现状/会议决定。）

- A-F062：SLS 调试 prompt 副本的可用工具从 1 编到 30，含两个高德工具、GUI 和选点，且同时存在 tool_list 占位符，不能把它当成当前项目最终生效工具总数。（来源：chapters/E/raw/sls-vc-eval.txt:42–246；调试 SP 内容时点未完全可定）
- A-F063：该调试副本中多数工具接收自然语言 string，生图使用 type/query，目标跟踪使用 add_goal/delete_goal 及目标内容或 ID，工具参数结构并不全是同一种字符串。（来源：chapters/E/raw/sls-vc-eval.txt:45–246；SP 示例）

### 实现快照另有的13个入口名称（与前表是版本并集，不相加成当前可见工具总数）
- [TOOL-41] Query改写（query_rewrite）由内部DPFM提供，对当前用户问题改写；输入输出精确结构本快照未展开。（来源：chapters/E/raw/tool-list.txt:7）
- [TOOL-42] 懂车帝前车识别（vehicle_recognition_dcd）由内部DPFM提供，前车识别能力；输入图片/目标及返回字段本快照未展开，不能补造品牌车型结构。（来源：chapters/E/raw/tool-list.txt:19）
- [TOOL-43] LBS识别（navi_lbs）由弋途提供，位置相关识别；输入输出精确字段本快照未展开。（来源：chapters/E/raw/tool-list.txt:20）
- [TOOL-44] 导航基础工具AINavi（navi_basic_tool）由弋途提供，导航基础能力入口；本快照未展开其与navi_basic_control的具体边界及输入输出。（来源：chapters/E/raw/tool-list.txt:29）
- [TOOL-45] 语音转语音（s2s）由豆包提供，语音转语音能力；输入输出精确字段本快照未展开。（来源：chapters/E/raw/tool-list.txt:36）
- [TOOL-46] 离线车载基础控制（offline_vehicle_basic_control）由车端离线提供，车端已执行车控的入口；端侧执行与回写回指R，当前快照未展开协议。（来源：chapters/E/raw/tool-list.txt:37）
- [TOOL-47] 美团订座旧入口（restaurant_reserve）由弋途提供，美团订座能力；与输入输出表meituan_restaurant_service并存，不能未核ID就当两个独立业务。（来源：chapters/E/raw/tool-list.txt:38）
- [TOOL-48] 任务Agent（task_agent）由内部TaskAgent提供，任务工具入口，兼容独立vehicle.agent.task；具体任务输入输出归T，本快照未展开。（来源：chapters/E/raw/tool-list.txt:40）
- [TOOL-49] 行程规划（trip_planning）由弋途提供，完整行程规划能力；不能等同保存编辑行程的trip_plan_record，具体输入输出本快照未展开。（来源：chapters/E/raw/tool-list.txt:41）
- [TOOL-50] 内容编排（customised_playlist）由弋途提供，节目/内容编排能力；精确参数和结果格式本快照未展开。（来源：chapters/E/raw/tool-list.txt:42）
- [TOOL-51] 问题反馈（issue_report）由内部AIDV提供，接收params.query，返回success/action/report_id/status/message经model_content包装为tool_feedback，详见F070–F088。（来源：chapters/E/raw/tool-list.txt:43、user-feedback.txt:142–286）
- [TOOL-52] 离线可见即可说（offline_page_view）由车端离线提供，本地页面操作入口；输入与端侧结果回写回指W/R，具体字段本快照未展开。（来源：chapters/E/raw/tool-list.txt:44）
- [TOOL-53] 当前弹出页特有操作（current_page_specific）由内部AIDV提供，接收当前页自然语言操作与real_time_card，模型输出select_button后客户端执行，详见F020–F025。（来源：chapters/E/raw/tool-list.txt:45、dynamic-tools.txt:175–222）

## 03 车控翻译、动态参数、下发与执行

- [F033] 上汽动态参数方案服务用户自装应用和自定义座椅位置、场景、用车习惯名称，车端上报可用值供车控参数提取使用。（来源：chapters/E/raw/saic-dynparam.txt:2–4、37–43；7/17方案）
- [F034] 动态参数按渠道、车型、车辆编号、功能编码和参数名存储，还保留上报日志编号，不能把一辆车自定义名称套给另一辆车。（来源：chapters/E/raw/saic-dynparam.txt:20–35）
- [F035] 词典映射包括应用名→指定应用开关app、自定义场景→指定模式开关mode、座椅位置→保存/复位value、用车习惯→驾驶习惯mode、联系人→拨打电话name。（来源：chapters/E/raw/saic-dynparam.txt:37–43）
- [F036] 动态参数上报接口POST /aidv/v1/report/dynamic_vehicle_control接收list内func_code/params/values，success=true只确认这次参数上报，不能当车辆动作成功。（来源：chapters/E/raw/saic-dynparam.txt:44–113）

- [F038] 赛力斯云端车控采用ToB主线一步SFT+RAG筛选，优先用SFT；输出函数不在白名单或枚举参数越界时才用RAG结果。（来源：chapters/E/raw/sls-vc-debug.txt:60–62；10/26排查指南，勿外推上汽/端侧1.7B）
- [F039] 赛力斯日志样例把“回到地图首页”经navi_basic_control翻成function_code“位置复位”，说明地图控制也经过FC翻译。（来源：chapters/E/raw/sls-vc-debug.txt:99–130）
- [F040] Frontier下发样例携带functions、sound_zone、is_simple_vehicle_control、request_id和planner_round_id，车端回执以req_id对应。（来源：chapters/E/raw/sls-vc-debug.txt:128–137）

- **B-F016**：所谓离线车控干预在此方案是接入云端 AIDV 的规则匹配直出，并非把整个方案放到车机运行。（来源：`research/v-lesson-20261107/raw/offline-intervene.txt` 第 1～7、171～175 行；状态：技术方案及计划，未由本副本验证上线。）

- **B-F017**：干预与拒识并行准备，但拒识命中时先拒识并取消预启动 Planner，干预不能绕过拒识。（来源：`research/v-lesson-20261107/raw/offline-intervene.txt` 第 214～234、449～453 行；状态：技术方案及计划，未由本副本验证上线。）

- **B-F018**：干预命中直接返回 functions、sound_zone 和 is_simple_vehicle_control=true 的车控协议，取消预启动 Planner并使用端侧播报。（来源：`research/v-lesson-20261107/raw/offline-intervene.txt` 第 221～234、384～414 行；状态：技术方案及计划，未由本副本验证上线。）

- **B-F019**：干预优先级低于 DirectAgent/SyntaxRAG，高于 AlwaysPlanner/SimpleIntent/Planner，干预未命中才继续原链路。（来源：`research/v-lesson-20261107/raw/offline-intervene.txt` 第 214～220 行；状态：技术方案及计划，未由本副本验证上线。）

## 04 回执转tool_feedback、错误与长结果

- A-F001：执行成功的反馈应写明实际完成的动作和对象，避免只给“收藏地址+成功”让 Planner 把收藏当前地址误判为收藏用户指定店铺。（来源：chapters/E/raw/tool-return-opt.txt:19–38；6/29 优化方案，非统一上线证明）
- A-F002：失败反馈统一区分“已是当前状态”“车辆无此配置”“音区没有操作权限”，权限失败应明确哪个音区。（来源：chapters/E/raw/tool-return-opt.txt:43–51；6/29 方案）
- A-F003：超出能力边界的反馈要区分“车上不支持此功能”和“车上有此功能但不支持语音控制”。（来源：chapters/E/raw/tool-return-opt.txt:57–65；6/29 方案）
- A-F004：用近似方案时，调节幅度小于请求应解释原因与实际调节情况，扩大幅度或范围则应先请用户确认替代方案。（来源：chapters/E/raw/tool-return-opt.txt:69–77；6/29 方案）
- A-F005：工具返回除事实结果，还可携带成功后简洁回复、失败后勿重复调用并告知用户、待确认后请用户选择等下一步提示。（来源：chapters/E/raw/tool-return-opt.txt:79–104；6/29 方案）
- A-F006：地点检索反馈应分别说明是在 A 到 B 沿路、A 附近或目的地 B 附近找到结果，避免混淆搜索范围。（来源：chapters/E/raw/tool-return-opt.txt:110–158；6/29 方案）

- [F003] 音乐等只有结构化结果的 Agent 需要业务后处理，把结构化数据转成模型可读文本。（来源：chapters/E/raw/agentserver.txt:18–20）
- [F004] IsFinish=true 触发结果存入历史并结束该次 Agent 调用，它表示调用输出结束，不证明车上动作成功。（来源：chapters/E/raw/agentserver.txt:21，后半句为字段语义边界）

- **B-F002**：tool_feedback 示例采用 tool_name 和 tool_feedback 两个字段，正文允许输入输出随车型提示词变化。（来源：`research/chapters/D/raw/director-prd.txt` 第 156～176 行；状态：2026-10-12 v1.7 产品规则。）

- [F041] 赛力斯云端读取车控ACK的function_code、msg、status而忽略tts_code/tts_content，status=0且msg为空时补“执行成功，可简洁回复做好了｜完成”给Planner。（来源：chapters/E/raw/sls-vc-debug.txt:78–84、137；项目特定现状）

- **B-F026**：避人吹 case 的理想回执被要求明确实际结果，如副驾打开避开模式，而非切换到 mode 模式。（来源：`research/v-lesson-20261107/raw/fake-success.txt` 第 85～139 行；状态：8 月问题汇编分析。）

- [F058] 车控反馈成功格式为改写query+函数名称+执行状态，失败需附原因，但系统设置、通讯、智驾及车书行没有独立填写输出，不能自动按车控格式补全。（来源：chapters/E/raw/tools-io.txt:27–30、39）
- [F059] 在未弃用工具行中只有车书标“是否要工具播报=是”，弃用声音演绎和联网问答也标是，需区分有效与历史行。（来源：chapters/E/raw/tools-io.txt:26–66）
- [F060] 停车工具回“待扫码支付”、订座“已提交待商家确认”、目标工具“创建中”、用车报告“正在生成”分别是中间状态，不能一律转成业务已完成。（来源：chapters/E/raw/tools-io.txt:60–64）
- [F061] POI表样例包含389920km等异常距离值，属于来源样例数值，不能当正常真实门店距离或可用业务事实。（来源：chapters/E/raw/tools-io.txt:32）

- **B-F035**：0914 音乐结果包含实际 songName/singerName/albumName，使 Planner 能明确说明播放的是替代歌曲而非原指定歌曲。（来源：`research/v-lesson-20261107/raw/issues-0914.txt` 第 35 行；状态：路测记录。）

- **B-F037**：0914 退出语音工具回执含执行失败、请勿重复调用和需要告知用户，后续话术如实告知退出失败。（来源：`research/v-lesson-20261107/raw/issues-0914.txt` 第 47 行；状态：路测记录。）

- **B-F039**：0915 路线 case 指出上游要求朱家角起点而下游使用当前位置，结果必须带实际起点而不仅是成功。（来源：`research/v-lesson-20261107/raw/issues-0914.txt` 第 61 行；状态：路测记录。）

- A-F057：10/19 宣讲说工具名输出至返回结果之间展示工具调用过程，结果卡在工具反馈返回且定义需出卡后才生成，多个结果卡可流式逐个出现，卡片展示节奏不能混同于统一语音总结。（来源：chapters/E/raw/m1019.txt:88–110；文字记录 00:16:08–00:19:21）

- [F081] 反馈Agent先校验并执行业务生成agent_result，再序列化进ChatResponse.ModelContent（JSON名model_content），Planner汇总各响应后包装成tool_name+tool_feedback，不能把内部模型原始JSON直接回传。（来源：chapters/E/raw/user-feedback.txt:221–286）
- [F082] Feedback Agent逻辑结果含success/action/report_id/status/message，而Planner最终面向车端的content/tts_content/model_content是另一层输出，三者不应混为同一协议。（来源：chapters/E/raw/user-feedback.txt:223–286、767–789）
- [F083] 反馈错误码UNAUTHENTICATED/FORBIDDEN_TARGET/INVALID_ARGUMENT/TARGET_NOT_FOUND/DRAFT_NOT_FOUND/DRAFT_EXPIRED均不可重试，INTERNAL_ERROR可重试，不能推广成所有车控的统一错误码。（来源：chapters/E/raw/user-feedback.txt:1099–1155）

- **B-F043**：11/3 周会把 feedback 梳理与 DM 逻辑视为同一件事，举例包括主驾权限、档位限制和二次确认，而非只换一句失败文案。（来源：`research/v-lesson-20261105/memory/meeting-1103-transcript.md` 第 771～837（00:23:46～00:25:16） 行；状态：2026-11-03 文字记录，当时现状/会议决定。）

- **B-F044**：11/3 左晨区分用户能理解的业务前提和研发代码异常，连接器异常等代码层问题被归作未知原因错误。（来源：`research/v-lesson-20261105/memory/meeting-1103-transcript.md` 第 861～887（00:25:54～00:26:30） 行；状态：2026-11-03 文字记录，当时现状/会议决定。）

- A-F064：该调试副本的工具反馈输入外层为 tool_feedback 和 tool_name 两个字段，反馈正文可以是自然语言，也可以承载结构化 JSON 的字符串。（来源：chapters/E/raw/sls-vc-eval.txt:36–38、797–800；SP 格式与示例）
- A-F065：示例22把同批氛围灯、地点搜索反馈以数组送回，也把工具反馈与新用户话混在同一数组，这只证明示例设计，和新版 M 章 isolated 不一致时按较新方案分层记录。（来源：chapters/E/raw/sls-vc-eval.txt:1190–1212、1242–1265；SP 设计示例）
- A-F066：车书长结果在示例中由 Planner 简洁总结，属于读结果后的表达，不构成执行适配层固定截断上限或通用压缩算法的证据。（来源：chapters/E/raw/sls-vc-eval.txt:1061–1085；设计示例）

- [F089] 历史重建将非最后一轮的车辆手册和联网搜索工具反馈省略为“...”，这是C章的历史保留规则，未见E当次回执统一摘要或截断上限。（来源：chapters/C/raw/planner-onepage.txt:106–108；与卡片30对应）
- [F090] 原Planner实现说明先repairJson解析动作、改写ActionID、映射工具名并注入answer_source，再建工具任务、逐帧适配响应与采集ExecutionFeedback，收尾合成tool_name/tool_feedback回灌模型。（来源：chapters/C/raw/planner-onepage.txt:140–144；该实现快照使用每动作uuid，不应覆盖M新版重试复用身份的方案）
- [F091] 工具执行结果存planner_task_list，模型整次输出另存planner_histories，不能只查播报历史判断工具是否执行。（来源：chapters/C/raw/planner-onepage.txt:144–152）

## 05 同批汇总、超时与经输入管理回Planner

- [F005] 调用方被用户打断时可先通过 Context 发 cancel 再断开连接，Agent Server 通知下游结束请求并记录已生成内容。（来源：chapters/E/raw/agentserver.txt:64–71）

- A-F021：输入管理是 Director 前置的组织模块，管理四类有效输入，其中工具反馈属于独立的输入类别。（来源：chapters/E/raw/input-mgmt.txt:95–98、163–167；v0.5 2026/10/13）
- A-F022：当前有效段将“未输出完整”解释为还未调用工具，已经下发的 action 在被打断上下文中需标明“已下发、仅播报”，以免再执行。（来源：chapters/E/raw/input-mgmt.txt:102–126；v0.5）
- A-F023：允许工具反馈异步返回在输入管理中是附带条件的衍生需求，若实施，交互卡时机需从工具自己控制改为工具输出被 Director 处理时控制。（来源：chapters/E/raw/input-mgmt.txt:145–146；条件方案）
- A-F024：旧段提出工具超时由工程生成超时反馈，Director 告知用户后重试，重试仍失败则结束，但该内容位于“以下内容无需查看/先不看”区，不能与更新方案等权当作当前策略。（来源：chapters/E/raw/input-mgmt.txt:389、431、493–497；旧方案，和勿重复调用回执冲突）
- A-F025：旧段把长程订座/停车/外卖反馈设为不合并，把车控/记忆反馈设为可合并，但此段属于“先不看”的旧策略，不能替代新输入管理对工具反馈 isolated 的规定。（来源：chapters/E/raw/input-mgmt.txt:389、431、506–519、544–567；旧方案）
- A-F026：旧段将生图、ailight 完成结果设为独立界面推送、无语音、无需进入 Director，该项是历史例外设计，具体车型线上路径仍需核实。（来源：chapters/E/raw/input-mgmt.txt:517–519；“先不看”旧段）
- A-F027：输入被端侧接管后，应拒绝对应云端结果并只保留端侧处理历史，其他被合并输入恢复排队；此规则在本篇亦位于旧段，现行接管细节回指 M/R 章。（来源：chapters/E/raw/input-mgmt.txt:630–663；旧方案）

- **B-F003**：同轮动作同时下发，执行方应承接无先后依赖的动作批次，依赖关系需由 Planner 分轮表达。（来源：`research/chapters/D/raw/director-prd.txt` 第 590～603 行；状态：2026-10-12 v1.7 产品规则。）

- **B-F004**：10/12 版要求同一轮所有工具反馈返回后统一推理播报，不按每个返回单独播一次。（来源：`research/chapters/D/raw/director-prd.txt` 第 590～592 行；状态：2026-10-12 v1.7 产品规则。）

- A-F058：10/19 宣讲将调工具阶段描述为 Director 可响应新 query，结果回来再合并交 Director 总结，但同时说输入管理正在优化统一回复节奏，属于当时链路解释而非新版异步回流已准出证明。（来源：chapters/E/raw/m1019.txt:421–434；00:57:08–00:59:56）
- A-F059：10/19 对长时风景任务被临时车控打断、随后按未完成目标恢复的描述，会上明确主线仍在做、未准出且暂不对客承诺。（来源：chapters/E/raw/m1019.txt:439–476；01:00:10–01:01:26）

- **B-F053**：8/5 工具反馈被打断后返回需求暂缓的群聊记录是历史决定，不能作为新版输入管理支持独立异步回流的证明。（来源：`research/v-lesson-20261107/notes-chat.md` 第 104 行；证据等级：已有取证笔记，本次未重新拉群消息或对应会议原文，保留为辅助线索。）

- [F092] 原实现说明最多轮询一分钟等端侧播完再继续，属于旧播放衔接设计，M新版改为真实播放事件与软硬期限，不能误写成工具统一超时一分钟。（来源：chapters/C/raw/planner-onepage.txt:136–138；M新版见overlap.md）

- [F094] 新M章与卡片22固定将同轮完整工具结果标为P1、单独处理（isolated），以调用身份关联原步骤；播放事件和客户端接管是控制消息，不进入业务等待队列。（来源：M-v2/full.md:85–108；component-cards.md卡片22；新旧差异见X07）

## 06 不支持指令、车控播报与车书

- A-F007：简单车控（逻辑单一、流程固定）无论端或云触发，8/24 播报方案要求使用端上固定 NLG 模板覆盖动作和状态，并调用端侧 TTS。（来源：chapters/E/raw/vc-tts.txt:2–7；方案）
- A-F008：复杂车控仅云端触发，先由 Planner 生成执行中的过渡话术，完成后由云端按各模块真实结果生成结果话术并合成语音。（来源：chapters/E/raw/vc-tts.txt:8–16；方案）
- A-F009：多意图全成功走端上汇总模板和端侧 TTS，任意失败则上报每意图状态、由云端说清成功项、失败项与原因并同步上屏，包含复杂车控时走云端。（来源：chapters/E/raw/vc-tts.txt:21–33；方案）
- A-F010：复杂车控任意失败一节标有 Pending，但前面的 Update 段已将全部状态上报和失败原因播报纳入方案，不能把 Pending 标题单独解读为全功能未做。（来源：chapters/E/raw/vc-tts.txt:13–20；同文版本痕迹）

- A-F011：7/10 不支持指令方案将“车无功能”和“有功能但不支持语音”分开，但 FC 支持标记本身暂不细分这两类。（来源：chapters/E/raw/vc-unsupported.txt:14–22；方案）
- A-F012：不支持语音时的替代操作路径必须来自用户手册，当前车型配置表在该方案中标为暂不考虑。（来源：chapters/E/raw/vc-unsupported.txt:23–26；方案）
- A-F013：早期方案按车书能否检索到内容概率判断“有功能但不支持语音”或“无功能”，但 SOP 阶段改成“未查到可用信息，可能未配备或不支持语音”的保守答复。（来源：chapters/E/raw/vc-unsupported.txt:27–39、70–74；同文更新未标日期）
- A-F014：不支持播报需明确说出对应功能，不能把“没有尾翼”误说为“尾翼不支持语音控制”。（来源：chapters/E/raw/vc-unsupported.txt:37–39、70–74；方案）

- [F032] 播放离线车控结果会触发PlayOfflineVehicleControl并且该类打断不恢复原TTS，最终拒识召回或流式非拒识暂停则列为可恢复。（来源：chapters/E/raw/proto.txt:181–219；此表交互恢复细节回指I/R/M）

- **B-F005**：10/12 版总体播报策略规定下游工具不自主播报，需要语音交互的内容返回 Planner 统一播报。（来源：`research/chapters/D/raw/director-prd.txt` 第 590～592 行；状态：2026-10-12 v1.7 产品规则。）

- **B-F006**：简单单指令和多指令车控无需无意义首轮话术，执行后可以简短确认。（来源：`research/chapters/D/raw/director-prd.txt` 第 253～271 行；状态：2026-10-12 v1.7 产品规则。）

- **B-F007**：若确需首轮话术，应避免预设工具成功，首轮与次轮减少重复。（来源：`research/chapters/D/raw/director-prd.txt` 第 261～271 行；状态：2026-10-12 v1.7 产品规则。）

- **B-F008**：下游按 talk_content 的语气标签选择播报能力，唱歌走唱歌工具，其余走 sami TTS。（来源：`research/chapters/D/raw/director-prd.txt` 第 272～283 行；状态：2026-10-12 v1.7 产品规则。）

- A-F067：同一调试副本既有音乐成功后因用户已听到而不再播报的规则，也有“音乐 Summer 开始演出”的示例，不能把其中任一例当成全车型统一规则。（来源：chapters/E/raw/sls-vc-eval.txt:797–800 对比 927–929；同文示例差异）

- **B-F050**：10/20 群聊取证笔记保留了 FC 结果回 Planner 以保持情绪一致与直接固定 NLG 提速的争论，不能把讨论中的替代路由写成统一现状。（来源：`research/v-lesson-20261107/notes-chat.md` 第 172 行；证据等级：已有取证笔记，本次未重新拉群消息或对应会议原文，保留为辅助线索。）

## 07 执行与回执侧假成功

- A-F016：8/24 假成功修复方案要求理想工具回执包含具体执行结果，并在每条工具反馈后拼接“仔细检查执行结果是否满足你下发的指令”的核对提醒。（来源：chapters/E/raw/fake-success-fix.txt:23–32；方案，未证明全量上线）
- A-F017：同一修复方案列出按模块动态注入调用规范和能力边界、ASR 容错澄清、恢复做错动作等方向，其中“恢复做错的动作”只有标题没有展开。（来源：chapters/E/raw/fake-success-fix.txt:2–22、33–46；方案）

- [F042] Frontier推送日志、传输层BaseResp.StatusCode=0和设备实际执行是不同层级，设备Results.Code=30001表示离线，排查须看单设备Code=30000及执行ACK。（来源：chapters/E/raw/sls-vc-debug.txt:131–137、200–201）
- [F043] ACK成功但车辆未动作时，先核FC是否匹配用户诉求，再查车控App、车服务和硬件，不应把ACK成功直接当最终业务成功。（来源：chapters/E/raw/sls-vc-debug.txt:6、193–199）

- **B-F023**：虚假成功分析收录 23 个去重 case，工具/执行回执缺陷命中 12 个（52.2%），同一个 case 可有多标签，因此分类比例不能相加解释为事故分布。（来源：`research/v-lesson-20261107/raw/fake-success.txt` 第 3～77、436～437 行；状态：8 月问题汇编分析。）

- **B-F025**：回执为空、笼统成功、模式占位值和执行错误未回传，都可能让 Planner 缺少区分真完成与未完成的信息。（来源：`research/v-lesson-20261107/raw/fake-success.txt` 第 80～139 行；状态：8 月问题汇编分析。）

- **B-F027**：分区风量、按摩模式、导航终点与媒体歌单等假成功常同时涉及能力配置不匹配和回执缺陷。（来源：`research/v-lesson-20261107/raw/fake-success.txt` 第 143～203、489～616 行；状态：8 月问题汇编分析。）

- **B-F028**：播放切歌错误回执在用户打断后未交到 Planner，用户却已经看见错误前端结果，形成执行事实与模型信息不一致。（来源：`research/v-lesson-20261107/raw/fake-success.txt` 第 529～544、642～654 行；状态：8 月问题汇编分析。）

- **B-F029**：跳舞表情无执行回执和地图工具空返回是两个不同的反馈缺口，不能只靠 Planner 话术约束修复。（来源：`research/v-lesson-20261107/raw/fake-success.txt` 第 561～601、655～668 行；状态：8 月问题汇编分析。）

- **B-F030**：歌曲未播却说开唱的 C23 在 Fornax 找不到数据，原分析明确归为证据不足尚未定位。（来源：`research/v-lesson-20261107/raw/fake-success.txt` 第 744～756 行；状态：8 月问题汇编分析。）

- **B-F032**：0914 的自动空调 case 第一轮未记回执，第二轮查到副驾手动后再次下发，唯一成功回执把切自动写成空调开关，不能倒推第一轮回执。（来源：`research/v-lesson-20261107/raw/issues-0914.txt` 第 34 行；状态：路测记录。）

- **B-F033**：0914 人脸注册反复失败时系统设置回执多次报 OMS 摄像头开关成功，而人脸工具仍报车内智能感知未开启。（来源：`research/v-lesson-20261107/raw/issues-0914.txt` 第 29 行；状态：路测记录。）

- **B-F034**：0914 温度 case 确认 Planner 下发 4 度并收到成功回执，表题与本轮事件文字不完全一致，且未给数值合理性校验实现。（来源：`research/v-lesson-20261107/raw/issues-0914.txt` 第 41 行；状态：路测记录。）

- **B-F038**：0914 公司地址设置最后把确认添加解析成播放列表新增，体现同一工具执行翻译错误可隐藏在多轮确认流程里。（来源：`research/v-lesson-20261107/raw/issues-0914.txt` 第 38 行；状态：路测记录。）

- **B-F041**：0811 典型库把车控回执与实车不一致（V01）、媒体收藏/歌单/定时播放假成功（M03）、应用存在性与执行结果不可靠（A01）分开归因，执行侧需要按不同实现保留真实结果。（来源：`research/v-lesson-20261107/raw/typical-0811.txt` 第 243～271、360～445 行；状态：实测问题分类。）

- **B-F052**：群聊笔记记录上汽服务端在记忆工具中判断需确认则再次下发，10/15 带二次更正仍可能走错 POI 路由的遗留问题上线。（来源：`research/v-lesson-20261107/notes-chat.md` 第 160～161 行；证据等级：已有取证笔记，本次未重新拉群消息或对应会议原文，保留为辅助线索。）

- **B-F055**：9/23 记忆选号死循环在既有会议取证笔记中被归于多轮继承“找到多个结果，需确认第几个”的 feedback，E 只研究反馈内容和执行衔接，历史继承回指 C。（来源：`research/v-lesson-20261107/notes-meetings.md` 第 211～215 行；证据等级：已有取证笔记，本次未重新拉群消息或对应会议原文，保留为辅助线索。）

## 08 问题建议上报与用户反馈工具

- **B-F015**：问题上报工具 issue_report 在 10/12 标准化表列为主线、上汽和赛力斯可选工具。（来源：`research/chapters/D/raw/director-prd.txt` 第 1524～1531 行；状态：2026-10-12 v1.7 产品规则。）

- [F064] 8/18问题建议上报方案针对D6X内部40名非技术种子用户，目标是让即时语音反馈保留语境、截图/日志/端状态并降低上报门槛。（来源：chapters/E/raw/issue-report.txt:2–4；当时测试背景）
- [F065] 问题上报记录以vehicle_id+report_id唯一，report_status区分0新建、1车端收到FC、2车端上报成功，受理与采集成功是不同阶段。（来源：chapters/E/raw/issue-report.txt:10–39）
- [F066] 上报Agent结合用户原话、Planner前5轮问题总结和记忆快照分析问题/建议类别及P0/P1/P2，记录日志与截图URI供诊断。（来源：chapters/E/raw/issue-report.txt:22–33、51–67）
- [F067] 采集FC包含report_id、reply_id、longest_time=600、start_time和“问题和建议反馈”函数，车端随后POST /report_agent/sync_info异步上传日志URI列表。（来源：chapters/E/raw/issue-report.txt:69–120）
- [F068] 问题上报配置默认回溯600秒、同步接口超时1000ms、日志URI上限200，不能混作全部工具超时或车控执行时限。（来源：chapters/E/raw/issue-report.txt:122–147）

- [F070] 10/27用户反馈方案区分卡片点踩与语音反馈，卡片消失后最终点踩才走HTTP提交，语音走Planner→Issue Report Agent→内部Feedback Model→执行→工具反馈。（来源：chapters/E/raw/user-feedback.txt:2–13、104–141；方案）
- [F071] Planner对反馈工具只转发本轮query且不自行追问或预告成功，Agent从服务端读取归属和任务状态，内部模型只输出clarify/review/submit/cancel候选决策。（来源：chapters/E/raw/user-feedback.txt:142–220、281–290）
- [F072] 首次进入反馈时由Agent创建report_id并下发start_collect，澄清期间CDC持续采集，最多追问3轮，完整后生成不超过100汉字的总结与固定类别，再下发review待确认。（来源：chapters/E/raw/user-feedback.txt:124–136、287–449）
- [F073] 用户明确确认才允许submit，任务必须REVIEW_READY；取消仅可在COLLECTING/REVIEW_READY，确认页内容修改应重新review，终态冲突返回当前状态。（来源：chapters/E/raw/user-feedback.txt:133–136、407–449、538–545）
- [F074] 反馈任务由云端按channel/vehicle_id/account_id、source、状态和过期时间找最近一条，端侧后续ChatRequest不回传report_id，模型不能生成或猜测任务身份。（来源：chapters/E/raw/user-feedback.txt:133–141、183–220、335–336、726–765）
- [F075] 用户反馈的start_collect/review/submit/cancel复用Frontier车控FunctionResponse通道，function_code固定“问题和建议反馈”，动作位于functions[].params[].action、业务字段位于functions[].data。（来源：chapters/E/raw/user-feedback.txt:627–633、790–842；以6.2为最终协议，6.1顶层字段示例非最终载荷）
- [F076] 语音反馈submit后由端侧/CDC补userid、PDID、VIN、log_uri和attachments并提交VSHD，卡片点踩则由AIDV补字段并提交VSHD，两个入口责任不同。（来源：chapters/E/raw/user-feedback.txt:906–1032、1156–1211）
- [F077] 语音反馈确认submit后才组装最多20个已完成历史轮次及完整反馈澄清对话，反馈历史不含Widget、FunctionCall、Planner observation或tool_feedback。（来源：chapters/E/raw/user-feedback.txt:1031–1077）
- [F078] 反馈内部成功由Agent业务实际处理结果决定，Frontier Push成功仅表示消息被Frontier接受，不证明CDC已启动或完成采集。（来源：chapters/E/raw/user-feedback.txt:239–267、475–476、1028–1030）
- [F079] 用户反馈创建按vehicle_id+request_id+source去重、动作按report_id+action幂等，状态更新须同时核当前状态并检查更新行数。（来源：chapters/E/raw/user-feedback.txt:1444–1477）
- [F080] 新反馈表issue_reports区分10收集中、20待确认、30提交中、100已提交、110已取消、120已过期，提交先原子认领并保存不可变上下文快照，再以完成状态收口。（来源：chapters/E/raw/user-feedback.txt:1249–1255、1395–1443）

- **B-F048**：11/3 提出把异常 error code 捕捉接入问题反馈工具、形成双方可分流的工单，但明确偏长期且不着急，不能写成已上线闭环。（来源：`research/v-lesson-20261105/memory/meeting-1103-transcript.md` 第 1021～1022（00:31:16） 行；状态：2026-11-03 文字记录，当时现状/会议决定。）

## 09 排查、端云协议与真实问题

- [F018] 平台快速测试指定 Agent 时跳过 Planner，不指定时才让 Planner 选工具并总结，且当时只支持天气、车书、闲聊等纯文本，不能替代真实车控验收。（来源：chapters/E/raw/agent-sop.txt:242–249）

- [F026] 端云协议以vehicle_biz_params携带vehicle_id、vehicle_type、渠道、请求编号、轮次和音区等，ext键值均为字符串。（来源：chapters/E/raw/proto.txt:28–54；10/30版）
- [F027] 云端每帧vehicle_coordination_metadata携带request_id和tts_audio_id，分别用于请求对应与语音对应，不能混作工具执行成功码。（来源：chapters/E/raw/proto.txt:56–72）
- [F028] 协议汇总只列Frontier method及消息格式的引用标题，没有展开完整枚举，不能从该副本还原全部下发协议。（来源：chapters/E/raw/proto.txt:74–75）

- [F037] 动态参数分隔符存在文内冲突：数据库注释称英文分号，结构注释和请求示例却用逗号，落地时需核当前接口实现。（来源：chapters/E/raw/saic-dynparam.txt:12、28、100；同一文内无法判更新先后）

- [F044] 赛力斯排查先收LogID、用户原话、预期/实际、时间和视频，再按拒识打断→Query语义→Planner→FC→下发→ACK→车端执行逐层定位。（来源：chapters/E/raw/sls-vc-debug.txt:3–7、64–71）
- [F045] Planner改写错交Planner算法，改写正确但FC错交车控算法，cannot_process也转FC算法，ACK超时或正确ACK却没动作交客户端。（来源：chapters/E/raw/sls-vc-debug.txt:74–84、175–199）
- [F046] 已下发10秒无结果转客户端分析是排查交接阈值，系统工具超时秒数未在指南中定义。（来源：chapters/E/raw/sls-vc-debug.txt:5；与notes第6节更正一致）
- [F047] ACK超时还应检查测试环境AIDV_RPC是否三机房部署，Fornax不可用时可用Argos日志追拒识、打断、Planner输出、FC及回执。（来源：chapters/E/raw/sls-vc-debug.txt:5、85–137）

- **B-F020**：规则超时或空结果应自动回落原链路，验收还需同时检查拒识优先、Planner取消、端侧简单车控标记。（来源：`research/v-lesson-20261107/raw/offline-intervene.txt` 第 449～454 行；状态：技术方案及计划，未由本副本验证上线。）

- [F056] 11/4快照发现一条上汽启用配置缺Agent定义、赛力斯driver_agent启用ID缺当前工厂映射，属于配置/代码一致性风险而非已证实线上事故。（来源：chapters/E/raw/tool-list.txt:59–60）
- [F057] task_agent与task-agent为兼容独立vehicle.agent.task的新旧入口，goal_list_update则是本地长时目标管理，不能混成同一任务实现。（来源：chapters/E/raw/tool-list.txt:61；深入归T章）

- A-F048：海外车控模型单元异常缩容会使车控和车设相关功能整体异常，最新周报仍在查缩容原因。（来源：chapters/E/raw/h2.txt:1088–1094；线上/交付风险记录）
- A-F049：Agent 管理后台删除定义接口曾有水平越权问题，后续段记开发完成且 10/14 安全工单关闭。（来源：chapters/E/raw/h2.txt:2077–2079，对比 3379–3383 9/18开发中；前者更新）

- **B-F031**：C15 的 UI 未同步与 C04 的静音/关闭播报是否一致都是原分析问句，不能写成已确认根因。（来源：`research/v-lesson-20261107/raw/fake-success.txt` 第 476～488、629～641 行；状态：8 月问题汇编分析。）

- A-F052：10/12 讨论指出同一车控能力在不同车上有通有不通，项目拟优先用 OPSE 车并统一 CCM 车控域控制器版本，不能把单车成功当车型完成。（来源：chapters/E/raw/m1012s.txt:1153–1187；00:51:40–00:53:39）
- A-F053：10/12 车控高频六项 feedback 正在整理，系统设置实际项与原子能力需求有差距，需要核对实车接口而非只看二级功能有无。（来源：chapters/E/raw/m1012s.txt:1153–1154、1192–1205；当时待办）
- A-F054：10/12 媒体基础搜播已通，但用户自建歌单因无接口暂不支持，只能打开应用，首页固定歌单与“我的收藏”是另一类支持范围。（来源：chapters/E/raw/m1012s.txt:1009–1046；当时现状）
- A-F055：10/12 行程规划仍开发且不完整，讨论同意路测临时关闭该工具，不能把模型能调用到工具当作功能准出。（来源：chapters/E/raw/m1012s.txt:931–977；当时决策）

- **B-F036**：0914 阅读灯、全车车窗和座椅通风三例只有口头承诺且本轮无工具调用，排查应先与执行失败分开。（来源：`research/v-lesson-20261107/raw/issues-0914.txt` 第 42～44 行；状态：路测记录。）

- **B-F042**：0811 典型库记录“声称已开窗但现场未执行”后仍按错误状态关窗，表明单次误报成功会把后续操作继续带偏。（来源：`research/v-lesson-20261107/raw/typical-0811.txt` 第 266～271 行；状态：实测观察，底层根因未展开。）

- [F084] 反馈业务Frontier示例TTL=5秒、QoS=2、AllIDC=true，与函数执行超时不是同一指标；request_id关联当前轮，report_id关联跨轮反馈任务。（来源：chapters/E/raw/user-feedback.txt:790–842）
- [F085] 反馈任务过期由服务端expires_at=now+feedback_task_ttl决定，建议默认10分钟、review后可延长而clarify不刷新，明确不由客户端时钟或longest_time推导。（来源：chapters/E/raw/user-feedback.txt:1394；与同文1142错误描述“超过longest_time”有冲突，详细设计约束优先）
- [F086] 反馈方案前部允许在REVIEW_READY修改并再review，末部状态流转却只允许COLLECTING→REVIEW_READY，需补同状态更新规则，文内无更新先后可判。（来源：chapters/E/raw/user-feedback.txt:426–449、1441）

- A-F068：调试示例1在添加花店后，把回执工具写为 navi_basic_control、下一步又重复添加途经点且工具名拼成 route planning，因此此尾段有内部不一致，适合教学只取已纠正的前半链路。（来源：chapters/E/raw/sls-vc-eval.txt:333–355；示例缺陷，非线上事故）
- A-F069：调试副本工具描述写车控“不支持开关车门”，但后文能力表写电动门支持开闭，零重力也同时写“仅驻车”和副驾无档位限制，应按车型协议核对，不能当统一安全规则。（来源：chapters/E/raw/sls-vc-eval.txt:49、1923–1929、2102–2106；同文冲突）
- A-F070：生图示例完成后再次回 Planner 说“生成啦”，与输入管理旧段“完成后仅界面push不进director”不同，需确认项目、版本和任务路径后选用。（来源：chapters/E/raw/sls-vc-eval.txt:550–558 对比 chapters/E/raw/input-mgmt.txt:517–519；路径差异）

- **B-F054**：事件日志无法随每个 FC 无限扩充，三方 App 状态接入受接口和隐私限制，因此不能把逐个补端状态当作所有假成功的通用修复。（来源：`research/v-lesson-20261107/notes-chat.md` 第 129 行；证据等级：已有取证笔记，本次未重新拉群消息或对应会议原文，保留为辅助线索。）

- **B-F056**：notes-depth-docs 曾把4度例直接归为 ASR错和下游无数值校验，但 E 的审稿更正指出未找到该数值校验方案，事实应收窄为确有下发4度和成功回执。（来源：`research/v-lesson-20261107/notes-depth-docs.md` 第 113～116 行；证据等级：已有取证笔记，本次未重新拉群消息或对应会议原文，保留为辅助线索。）

- **B-F058**：0916 算法分析副本在用户要求“每次执行完自动退下”的记录中写明 goal_list_update 没有执行，并归下游工具问题，不能只因助手回答“记住了”认定已创建任务。（来源：`research/v-lesson-20261107/raw/ux-algo.txt` 第 17～18 行，2026-09-12 原 Log ID 20260912154254EB951B4960F5B9D7431B；状态：实测归因摘要。）

- **B-F059**：服务区提醒未发生的原分析将“goal_list_update没有执行”归为可能的工程链路问题，其中“可能”必须保留，任务系统内部根因尚未由该条证明。（来源：`research/v-lesson-20261107/raw/ux-algo.txt` 第 13 行；状态：实测归因摘要。）

- A-F073：10/12 舱内 VQA 只有部分车打通，会上提到可确认的一辆车以及镜像、过滤、灌装版本/环境等多种疑点，未完成逐车根因定论。（来源：chapters/E/raw/m1012s.txt:412–530；00:20:16–00:23:51）
- A-F074：10/12 智驾实车可体验以装有智驾版本为前提，会上同时承认部分端到端链路未通、延迟方案未做，因此不能凭工具存在承诺路测车辆全通。（来源：chapters/E/raw/m1012s.txt:1216–1262；00:55:12–00:57:12）

## 10 演进与设计取舍

- [F019] 工具描述已由提示词固定值改为平台动态加载，产品调优需在提示词变量或测试副本验证后同步平台，正式提示词工具模块用{{tool_info}}占位。（来源：chapters/E/raw/agent-sop.txt:259–264；SOP记载流程）

- A-F028：H2 较新周报记录赛力斯车控分支合主线为 DONE，开发/验证 9/16–10/12、10/14 上线，目的含避免在非赛力斯环境产生无效缺陷。（来源：chapters/E/raw/h2.txt:1823–1826；历史上线记录）
- A-F029：动态加载型工具在 H2 记录 8/31 评审、9/3–9/10 开发、9/18 端联调、10/16 测试中，早于副本编辑日期 10/22，编辑日期不等于起始日期。（来源：chapters/E/raw/h2.txt:1797–1804；DOING）
- A-F030：司机 Agent 统一承接导航与智驾的长期方案在最新周报为 Pending，产品算法另有考虑、10/23 讨论取消并待新产品加入后再讨论。（来源：chapters/E/raw/h2.txt:649–662；10/20–11/2 周报）
- A-F031：赛力斯问题反馈工具在最新周报是 DOING，写 10/24 提测、10/26 发版且仍在 bugfix，不能仅按发版日期声称验收完成。（来源：chapters/E/raw/h2.txt:688–693；10/20–11/2）
- A-F032：车控 FC 不支持时自动兜底到车书会产生不相关或误导回答，对应改动在最新周报记为 DONE/已上线，但未展开修改后具体策略。（来源：chapters/E/raw/h2.txt:700–705；10/20–11/2）
- A-F033：输入管理最新周报开发进度 30%，排期 10/23–11/13 开发、11/16–18 实车验证和提测、11/23–27 测试与产品验收，均是当时计划。（来源：chapters/E/raw/h2.txt:727–741；10/20–11/2）
- A-F034：上汽车控切 ToB 主线 2.0mini SFT 最新仍记 DOING，已测一版且有 bug 待修复复测，旧段只写开发完成待测试。（来源：chapters/E/raw/h2.txt:935–938 对比 2121–2123；前者更新）
- A-F035：离线模型支持函数从 52 扩至 140 在周报中仍处于数据补充、标注 review 和训练，离线引擎还需扩 List 与后处理，不能读成 140 个均已上线。（来源：chapters/E/raw/h2.txt:1447–1451；训练中）
- A-F036：车控干预曾受预请求影响偶尔不命中，修复在预请求并行干预并使主链路最多等待 200ms，周报明确 7/30 已上线，覆盖车型和开关未写。（来源：chapters/E/raw/h2.txt:7417–7428；DONE，补足旧 notes 上线缺口）
- A-F037：云端与 Planner 并行车控 SFT 需求在早期周报标 HOLD，原因是 SFT Director 与干预上线后该需求不突出，与空白技术方案不能拼成已落地架构。（来源：chapters/E/raw/h2.txt:9044–9052；历史搁置）
- A-F038：上汽车控动态参数服务端在历史周报已完成，但客户端部分数据未接入，因此“服务端完成”不能代表动态词全量可用。（来源：chapters/E/raw/h2.txt:6253–6259、7823–7832；历史 DOING）
- A-F039：Agent 管理平台曾新增用户权限校验开关、资源上传、HTTP 测试环境地址配置，周报标 8/7 上线。（来源：chapters/E/raw/h2.txt:7888–7899；DONE）
- A-F040：Director SFT 版按租户动态加载工具说明在历史周报标 HOLD、重大演示后变更，使用 tool_list 占位符属于配置加载，不能和按当前页条件暴露动态工具混为一项。（来源：chapters/E/raw/h2.txt:7900–7908 对比 1797–1804；历史状态不同）
- A-F041：美团任务进度接入任务岛在最新周报为 DOING，写 11/2 联调和预期 1/5 上线，但未给年份且与该周报时段不连续，应保留日期疑点。（来源：chapters/E/raw/h2.txt:782–788；计划非上线）
- A-F042：上汽车书联网兜底曾在车书查询失败后直接调联网搜、不经 Planner，周报同时记 7/17 上线、7/22 回退，不能作为当前通用链路。（来源：chapters/E/raw/h2.txt:9402–9411；已回退历史方案）

- [F062] 输入输出表于10/30获取，但最新版本管理记录是8/27 v1.21，不能把获取日期当每一行更新或上线日期。（来源：chapters/E/raw/tools-io.txt:1–24；获取时间见chapters/E/notes.md读取清单）
- [F063] 工具演进包括5/19车控拆成车辆控制/系统设置/通讯、5/26新增媒体/缴费/订座、6/30新增选点、8/27订座改美团餐厅服务并加排队。（来源：chapters/E/raw/tools-io.txt:11–24）

- **B-F046**：11/3 讨论要求本周锁定车控变更，后续新增由双方产品负责人评估是否进入 SOP，属于版本管理决定而非所有问题已解决。（来源：`research/v-lesson-20261105/memory/meeting-1103-transcript.md` 第 841～852、946～962（00:25:17～00:29:02） 行；状态：2026-11-03 文字记录，当时现状/会议决定。）

## 11 车型差异

- A-F015：上汽典型验证将车内 NFC 识别开关列为有功能但不支持语音，替代路径到中控屏数字钥匙页面且需二次确认，而空气悬架和尾翼列为无功能。（来源：chapters/E/raw/vc-unsupported.txt:55–74；特定车型设计验证）

- [F029] 协议中的主线渠道为master/1000、赛力斯为seres/99210、上汽为saic-dna/99220。（来源：chapters/E/raw/proto.txt:2–27）

- **B-F011**：行程规划与节目编排的可选范围为主线和赛力斯，而高德两工具在标准化表允许主线、上汽和赛力斯选配。（来源：`research/chapters/D/raw/director-prd.txt` 第 1469～1522 行；状态：2026-10-12 v1.7 产品规则。）

- **B-F012**：氛围灯、用车报告和车辆维养问答三工具在标准化表为上汽定制且仅以提示词接入。（来源：`research/chapters/D/raw/director-prd.txt` 第 1533～1555 行；状态：2026-10-12 v1.7 产品规则。）

- [F055] 天气查询在上汽由内部DPFM提供、赛力斯由弋途提供，播客搜索在上汽由弋途提供、赛力斯由内部DPFM提供，用车报告和车况维养由上汽提供。（来源：chapters/E/raw/tool-list.txt:3–4、22–25、30）

- A-F050：10/12 会上赛力斯相对上汽四个导航工具另加两个高德工具，陈敏答已接但仍在跑通/记得测试中，不能改写成全项目已上线。（来源：chapters/E/raw/m1012s.txt:979–1001；文字记录 00:42:53–00:43:37）
- A-F051：10/12 导航 error code 讨论明确指“搜不到的错误页”，上汽计划 10/20 合入后再议迁赛力斯，和车控原子能力错误码不是同一项。（来源：chapters/E/raw/m1012s.txt:904–923；文字记录 00:39:55–00:40:30）

- **B-F040**：0914 路测副本没有为全部行统一标注车型项目，个别回答提及荣威不构成全部条目项目归属的证明。（来源：`research/v-lesson-20261107/raw/issues-0914.txt` 第 1～101 行；状态：路测记录。）

- A-F060：赛力斯车控控件由车企开发，字节负责卡片整体组装，执行控件建议直连底层原子能力实时状态，避免手动调节后还靠额外上下文同步维持显示。（来源：chapters/E/raw/m1019.txt:130–158、226–230；00:27:04–00:28:30、00:42:07–00:43:33）
- A-F061：10/19 会上明确没有独立的“垫句”标签，对链路而言是 talk 与 action 的组合，不能假设执行方收到每句“过渡/结果”的专用类型。（来源：chapters/E/raw/m1019.txt:298–308；00:50:31–00:50:53）

- A-F071：调试 SP 的高频车控能力表说明只覆盖高频子集、未提到的功能不能主观判不存在，后排空调请求按对应主副驾区执行并需明确反馈，不能泛化为所有车型都有后排独立能力。（来源：chapters/E/raw/sls-vc-eval.txt:1732–1759、2115–2117；调试说明非实车接口验收）
- A-F072：调试 SP 标出的温度 16.5–30.5℃、车窗精度10%、座椅加热/通风3档等是该副本能力描述，不能替代全域 FC 协议或视为所有车型的通用硬件限制。（来源：chapters/E/raw/sls-vc-eval.txt:1743–1751、1768–1771、1804–1809；调试能力表）

- **B-F051**：上汽家/公司同步的系统地图二次确认与赛力斯没有该确认逻辑是群聊笔记明确列出的项目差异。（来源：`research/v-lesson-20261107/notes-chat.md` 第 153～161 行；证据等级：已有取证笔记，本次未重新拉群消息或对应会议原文，保留为辅助线索。）

## 12 指标与观测

- [F013] Agent 定义缓存定时每2小时刷新、有效期3小时，新增更新及服务启动也触发刷新，租户发布列表另用5分钟缓存。（来源：chapters/E/raw/agentserver-opt.txt:62、101；配置方案，非工具执行超时）

- [F030] edge-to-edge上报六项毫秒耗时，分别覆盖VAD结束到语音首帧/文字首帧、VAD开始到ASR首字、VAD结束到ASR尾字、ASR尾字到语音首帧/文字首帧。（来源：chapters/E/raw/proto.txt:77–108；是用户端端到端指标，不等于单工具执行耗时）
- [F031] 单case可通过logID找到traceID，再查看edge2edge-time-cost span定位耗时。（来源：chapters/E/raw/proto.txt:112–120）

- [F048] 日志单样例中FC使用Doubao-Seed-2.0-lite、模型耗时1041ms、RAG检索115ms并返回6个候选、总耗时1183ms，这不是总体性能或SLA。（来源：chapters/E/raw/sls-vc-debug.txt:121）

- A-F043：上汽 DNA 新车控摸底必过集（含新增协议）92.36%是模型测试口径，不能等同于实车执行成功率。（来源：chapters/E/raw/h2.txt:3517–3521；历史测试）
- A-F044：三合一端侧模型的车控召后准确率 90.40%、离线车控召后准确率 92.62%是模型训练评测口径，不能代替云端到硬件闭环成功率。（来源：chapters/E/raw/h2.txt:2620–2623；历史模型评测）
- A-F045：H2 最新记录赛力斯手车互联状态 90%实车联调通过、车控 50%联调通过，并另记缺 2 字段、4 返回有误、4 FC 不支持，这组数字仅属手车互联联调范围。（来源：chapters/E/raw/h2.txt:638–648；10/12 联调记录）
- A-F046：新车控主线 SFT 准确率 96.56%（99/2878 fail）、漏召 1.35%（39/2878）、过召 0.92%（51/5492）出自一段历史自评，需保留分母和自测性质。（来源：chapters/E/raw/h2.txt:4771–4773；算法自评）
- A-F047：工具执行链追踪基建在最新周报记录 Fornax Trace 双写 BMQ 10/26 交付上线，以及 Trace 结构化入 Bytehouse、Grafana 明细查询 10/30 交付。（来源：chapters/E/raw/h2.txt:901–907、920–926；工程交付记录）

- **B-F024**：以 0811 路测计算的“影响劝退率约 25%”是原分析的特定样本口径，不是当前总体用户流失率。（来源：`research/v-lesson-20261107/raw/fake-success.txt` 第 2～3 行；状态：8 月问题汇编分析。）

- A-F056：10/12 评审要求每个模块建立核心必过集、贴走查结果和视频并持续看通过率，已入 Meego 的问题标必解与时间，未提测或外部阻塞的问题继续列表追踪。（来源：chapters/E/raw/m1012s.txt:1102–1142、1342–1349；评审动作）

- [F087] 反馈观测覆盖意图识别、Frontier下发、上下文组装及最终操作结果并使用统一Trace，观测失败不得阻塞业务，未给成功率或时延实测。（来源：chapters/E/raw/user-feedback.txt:1478–1480）

- **B-F057**：既有深度取证笔记记载11/6 E68离线车控2898条、仲裁通过率69.12%、最终通过率69.57%、P50 171/P90 278ms，这些是离线评测摘要而非云端工具执行成功率。（来源：`research/v-lesson-20261107/notes-depth-docs.md` 第 323～325 行；证据等级：已有取证笔记，本次未重新拉群消息或对应会议原文，保留为辅助线索。）

## 13 排期与现状

- [F014] Agent Server 优化分类型收敛、租户隔离与平台、主链路切新体系并删旧代码三期，本文没有各期上线日期。（来源：chapters/E/raw/agentserver-opt.txt:240–263）

- [F025] 动态工具加载条件和平台增改查扩展属于10/22技术方案，本文本身不构成已上线证明。（来源：chapters/E/raw/dynamic-tools.txt:7–8、269–286；来源日期以notes读取清单为准）

- A-F018：能力边界检查技术方案是为大规模评测快速发布的临时实现，能力知识写在代码映射里，上线需基于评测另提产品化需求并考虑统一放到工具平台管理。（来源：chapters/E/raw/capability.txt:50–74；研发自测/评测）
- A-F019：能力检查前置于 Planner 并与上下文、车书改写并行，早期性能判断认为 2.0 lite 不可行，但 9/8 补充模型单元后改为速度基本满足，后者更新。（来源：chapters/E/raw/capability.txt:94–112；性能初评及 9/8 更新）
- A-F020：“云端和 planner 并行车控 SFT 模型”原文副本只有标题及空行，不能据此确立并行车控的执行流程、仲裁或上线状态。（来源：chapters/E/raw/parallel-sft.txt:1–3；证据空缺）

- **B-F013**：允许 tool feedback 异步返回在 10/12 版仍列为暂未宣讲的工程需求，不能写成当前普遍能力。（来源：`research/chapters/D/raw/director-prd.txt` 第 914～918 行；状态：2026-10-12 v1.7 产品规则。）

- **B-F022**：离线车控干预方案写 7/20 提测和计划 7/24 上线，但未给实际完成记录。（来源：`research/v-lesson-20261107/raw/offline-intervene.txt` 第 455～505 行；状态：技术方案及计划，未由本副本验证上线。）

- [F069] 8/18上报方案待办包括端状态/记忆获取、5轮内完成澄清、白名单校验与特定ppe发布，AgentName和AgentID仍空白，不能据此认定全项目已上线。（来源：chapters/E/raw/issue-report.txt:78–80、148–159）

- [F088] 10/27反馈新版依据9/17 PRD V1.3设计供联合评审，任务身份、三轮澄清、提交确认和新状态表不能与8月种子版五轮上下文/0-1-2状态直接混用，本文未给上线完成证明。（来源：chapters/E/raw/user-feedback.txt:2、11–13、1392–1443；对比issue-report.txt:13、23、156）

- **B-F045**：11/3 既有两次新增之前的 feedback 已梳理完，但当天仍有20多条原子能力变更，新增场景逻辑尚未处理完。（来源：`research/v-lesson-20261105/memory/meeting-1103-transcript.md` 第 901～947（00:27:11～00:28:11） 行；状态：2026-11-03 文字记录，当时现状/会议决定。）

- **B-F047**：11/3 离线函数扩至140的发言紧接着明确第二批还没上，所以140是扩充范围而非当时线上可用函数数。（来源：`research/v-lesson-20261105/memory/meeting-1103-transcript.md` 第 971～987（00:29:11～00:29:47） 行；状态：2026-11-03 文字记录，当时现状/会议决定。）


- [F093] 动态工具服务端在较新周报明确10/22已上线，E旧H2的10/16测试中是较早进度，各车型仍分别接入且不能与SFT工具Prompt按租户加载混为一项。（来源：chapters/W/raw/server-weekly.txt:3074–3081；对比chapters/E/raw/h2.txt:1797–1804、7900–7908；卡片20已有）

- [F095] 当前M章将统一输入管理描述为实车验证、按渠道和车辆灰度启用，同车只用一套链路；这是学习站较新基线，不把E旧页的开发中或11月底计划当唯一现状。（来源：M-v2/full.md:9、530–540；未在本轮逐车验收）

## 14 资料冲突、口径差异与更正清单

表内区分真正未解冲突、版本迭代、统计口径和旧笔记误读；更新日期不明确的明确保留，不能仅凭文件名日期强定先后。

| 编号 | 类型 | 问题 | 双方说法 | 较新依据/研究处理 | 来源与位置 |
|---|---|---|---|---|---|
| X01 | 口径差异 | 工具总数 | 项目AGENTS 23；D/C正文当前提示词27；调试SP30；PRD标准化33行；I/O40行含8弃用；数据库50 ID/49启用 | 版本与分母不同，不作加减推导；11/4快照更新但不等于Planner可见数 | /Users/bytedance/Desktop/3.23/AGENTS.md“23个下游工具”；chapters/E/raw/sls-vc-eval.txt:45–246；tools-io.txt:26–66；tool-list.txt:51–58；chapters/D/raw/director-prd.txt:1245–1555；C-v2/full.md:657 |
| X02 | 名称/范围差异 | 美团与任务入口 | I/O用meituan_restaurant_service；实现快照用restaurant_reserve；task_agent/task-agent与goal_list_update并存 | 保留名称与ID映射缺口，不计作完全独立新增工具；11/4为较新静态快照 | chapters/E/raw/tools-io.txt:62、64；tool-list.txt:35、38、40、61 |
| X03 | 项目/范围差异 | 高德两工具 | PRD可选主线/saic/seres；I/O只写赛力斯；快照写全部 | 10/12文字记录指赛力斯比上汽多两个，接入测试中；全部仅指已配置渠道实现一致，不证上汽已接 | chapters/E/raw/m1012s.txt:997–1025；tools-io.txt:65–66；tool-list.txt:46–54；chapters/E/notes.md:182–183 |
| X04 | 分层冲突 | 谁生成车控播报 | 10/12 PRD要求工具不自主播报、反馈统一回Planner；8/24车控策略要求简单/多意图全成功走端上固定NLG；10/20仍讨论 | 10/12较新通则不自动覆盖项目专用低时延路径；按车型/指令类型标边界，未取得全车型统一现状 | chapters/D/raw/director-prd.txt:590–592；chapters/E/raw/vc-tts.txt:2–33；v-lesson-20261107/notes-chat.md:172（辅助） |
| X05 | 旧页误读 | 简单车控首轮话术 | 旧E主例先念正在调4度再说调好；PRD简单单/多车控不需无意义首轮话术 | 以10/12 PRD和D新正文为准；不预设结果不等于必须先说过渡话 | chapters/D/raw/director-prd.txt:254–265；chapters/E/review.md:S1-2；D-v2/full.md第四段 |
| X06 | 旧段与有效规则 | 工具超时是否重试 | I/O超时要求请勿重复调用；旧输入策略告知后重试再失败结束 | 输入策略389行后/431行先不看区降低权重；不写统一自动重试，按具体工具可重试性 | chapters/E/raw/tools-io.txt:27、36；input-mgmt.txt:389、431、493–497 |
| X07 | 迭代 | 工具结果可否混用户话 | 旧输入策略车控/记忆可合并；SP例混反馈与用户话；卡片22与M新版结果isolated | M新版/卡片22为当前章节标准，同轮完整工具批单独接入 | chapters/E/raw/input-mgmt.txt:544–567；sls-vc-eval.txt:1190–1212；component-cards.md卡片22；M-v2/full.md:96、338 |
| X08 | 范围/成熟度 | 独立异步结果 | Director暂未宣讲需求和10/19宣讲说结果回后合并；M新版本期仅同步完整批 | 10/23新输入管理本期不做独立异步；不能把业务长程任务直接等同输入管理已支持异步回流 | chapters/E/raw/input-mgmt.txt:145–146；m1019.txt:402–438；M-v2/full.md:96、338、539 |
| X09 | 旧页误读 | 10秒是什么 | 旧页把10秒写执行超时；指南只说已下发10秒无回转客户端 | 以指南原句为准；当前未得统一车控超时秒数，5秒TTL/60秒模型超时也不是同一指标 | chapters/E/raw/sls-vc-debug.txt:5；user-feedback.txt:841；component-cards.md卡片32 |
| X10 | 状态更正 | 离线52→140 | 旧notes正文说已扩到140；H2训练中；11/3文字记录第二批还没上 | 11/3明确仍未上齐，较训练进度/旧笔记更直接；不当作云端函数数 | chapters/E/notes.md:134、181；chapters/E/raw/h2.txt:8155–8159；v-lesson-20261105/memory/meeting-1103-transcript.md:901–947 |
| X11 | 补齐证据 | 车控干预是否上线 | 旧notes缺上线证据；H2写预请求车控干预漏命中修复7/30已上线 | H2提供上线记录，覆盖该修复；车型与开关范围仍未知 | chapters/E/notes.md:173；chapters/E/raw/h2.txt:7417–7428；v-lesson-20261107/raw/offline-intervene.txt:449–505 |
| X12 | 状态迭代 | 动态工具测试/上线 | E旧H2按条件暴露工具测试中；W卡片20和较新研究显示10/22服务上线 | 须核较新周报已DONE；上线不证明各车型接完，另SFT工具Prompt加载HOLD是另一事项 | chapters/E/raw/h2.txt:1797–1804、7900–7908；W-v2/full.md:633；component-cards.md卡片20；chapters/W/raw/server-weekly.txt:3074–3081 |
| X13 | 成熟度范围 | 统一调用/归一是否已有 | 平台已有HTTP/kitex/MCP/Frontier入口与统一Agent回包；SOP把调用协议适配/执行结果归一标内部预研 | 局部适配已存在，与跨业务通用底座已成熟不是一回事；以子能力状态描述 | chapters/E/raw/agent-sop.txt:208；agentserver.txt:19–20；sop-items.md工具表D62:J63；M-v2/full.md:338、400 |
| X14 | 同文更新 | 车书检索不到能否判无功能 | 早期按车书是否命中推断配置有无；SOP改成可能未配备或不支持语音 | 同文SOP阶段较新但无更新日，采用保守答复，不把检索空当硬件无配置 | chapters/E/raw/vc-unsupported.txt:27–39、70–74 |
| X15 | 设计与修复 | 不支持自动兜底车书 | 7/10设计遇不支持查车书；H2称自动兜底易给不相关或误导回答、对应改动已上线 | 上线改动比早期统一兜底更新，但未展开新具体触发规则，不能补成全面取消 | chapters/E/raw/vc-unsupported.txt:14–39；h2.txt:700–705 |
| X16 | 同文性能更新 | 能力检查2.0lite能否用 | 技术方案早期速度不满足；9/8补充模型单元后基本满足 | 9/8更新较新；临时写死能力知识仍非产品化上线方案 | chapters/E/raw/capability.txt:50–74、94–112 |
| X17 | 路径差异 | 生图完成是否回Planner | SP例生图完成回去说生成啦；输入管理旧段只推界面不进Director | 两条均保留版本和场景；旧段非新统一规则，不能写所有AIGC都不回或都回 | chapters/E/raw/sls-vc-eval.txt:550–558；input-mgmt.txt:517–519 |
| X18 | 同文差异 | 音乐成功是否复述 | SP规则成功播放不必再告知；示例又说音乐Summer开始演出 | 无先后可判，属调试例差异；播放可听不等于每项都必须语音复述 | chapters/E/raw/sls-vc-eval.txt:797–800、927–929 |
| X19 | 同文未解 | 车门是否支持 | SP工具描述不支持开关车门；能力表列电动门开闭 | 同文无版本/车型标定，留给具体车型FC协议核对，不作统一能力承诺 | chapters/E/raw/sls-vc-eval.txt:49、1923–1929 |
| X20 | 同文未解 | 零重力档位限制 | SP写零重力仅驻车，又写副驾无档位限制 | 不自行选安全边界，按车型已验协议；无更新顺序可判 | chapters/E/raw/sls-vc-eval.txt:2102–2106 |
| X21 | 同文未解 | 动态参数分隔符 | 数据库注释英文分号；结构/请求例用逗号 | 无更新先后，需按实际接口和存储转换核定 | chapters/E/raw/saic-dynparam.txt:12、28、100 |
| X22 | 版本演进 | 8月与10月问题上报 | 8月前5轮总结/0-1-2上报状态；10月最多3轮澄清/100字总结/确认提交/新状态表 | 10/27新版较新且面向联合评审；不同版本方案不拼成一个实现 | chapters/E/raw/issue-report.txt:13、23、156；user-feedback.txt:2、11–13、1249–1255、1395–1443 |
| X23 | 同文未解 | 反馈过期依据 | 错误表DRAFT_EXPIRED说超过longest_time；末部明确expires_at独立TTL、不由longest_time推导 | 详细字段设计约束更明确，采用独立服务端TTL；同文仍需修错误说明 | chapters/E/raw/user-feedback.txt:1138–1142、1394 |
| X24 | 同文未解 | 确认页修改再review | 动作约束允许REVIEW_READY再review；状态流转只允许COLLECTING→REVIEW_READY | 需补同状态review更新规则，不能自称实现已支持 | chapters/E/raw/user-feedback.txt:426–449、1441 |
| X25 | 同文未解 | 反馈活动状态枚举 | 定位任务提CONTEXT_COLLECTING；正式状态表用SUBMITTING且未定义前者 | 以明确表为讲解框架并留协议核对，不能自行等同两个状态 | chapters/E/raw/user-feedback.txt:134、1395–1443 |
| X26 | 版本表矛盾 | 车书曾弃用与仍有效 | 4/24版本记录说弃用车书查询；当前范围仍列vehicle_manual_qa且需工具播报 | 后列有效范围与11/4实现证明有车书入口，早期“弃用”不表示今天无车书 | chapters/E/raw/tools-io.txt:4、39；tool-list.txt:6 |
| X27 | 排期疑点 | 美团任务岛1/5上线 | H2写11/2联调，预期1/5上线但未写年份 | 按原文保留排期，不自动纠正成11/5或已上线 | chapters/E/raw/h2.txt:782–788 |
| X28 | 归因更正 | 24度变4度 | 旧深度笔记直接归ASR错及缺数值校验；路测表该行原话记我要通风、分类VAD打断 | 只确认下发4度/成功回执和用户纠正，具体ASR链与校验实现未证实 | v-lesson-20261107/notes-depth-docs.md:113–116；v-lesson-20261107/raw/issues-0914.txt:41；chapters/E/notes.md:139、174–175 |
| X29 | 轮次更正 | 空调自动模式回执属于哪轮 | 旧笔记说第一轮回空调开关成功；原表把15:51/15:52写一起且回执排在第二轮后 | 不能认定第一轮收到该回执；可确认改写切自动却函数空调开关，对最终状态无证据 | v-lesson-20261107/raw/issues-0914.txt:34；chapters/E/review.md:S1-6；notes.md:140 |
| X30 | 工作簿迭代 | TTS/氛围灯/卡片交付状态 | 旧架构依赖表TTS和氛围灯内部预研，新子表可量产；总表任务卡预研，新子表即时可量产/长时预研 | 10/27change log指向新子功能表校准；按子能力及项目落地范围，保留旧值 | sop-items.md“清单自身冲突与使用限制”；原Excel架构依赖!25/27、交互表达!9–11/20–21及5/7/8行 |
| X31 | 示例错误 | 买花尾段工具与重复添加 | SP买花添加花店回执工具名不对应，又写route planning并重复添加 | 这是设计样例瑕疵，无线上事故；正确链只取选路→导航成功→沿途搜→推荐一家并征求添加 | chapters/E/raw/sls-vc-eval.txt:270–355；chapters/E/notes.md:184 |
| X32 | 实现/方案迭代 | 动作UUID与重试复用编号 | 旧实现每action改写uuid；M新方案同次调用重试复用tool_call_id | 两者不同版本且新动作/重试有别；编号复用需下游识别重复，不能单凭编号承诺只执行一次 | chapters/C/raw/planner-onepage.txt:144；M-v2/full.md:254–262、783 |

## 15 证据缺口与后续设计限制

- 未取得客户租户完整车控错误码表、SLS/上汽全域FC协议及DNA逐项NLG原表；现有错误码只能按具体通道列，不补造统一码全集。
- sls车控工具onepage独立本地正文未找到，FC Owner/DM Owner完整职责只有旧notes转述；11/3文字记录直接支持DM业务逻辑，但不替代该onepage全文。
- 未得统一车控工具超时秒数、聚合器在部分超时后的实现细节、晚到ACK是否续轮和全工具统一重试策略；10秒、5秒TTL、60秒模型调用、反馈TTL10分钟各有独立含义。
- 未得当前tool_feedback统一长度上限/摘要/截断机制；可确认的历史“...”归C章，反馈conversation_context超限INVALID_ARGUMENT仅适用其通道。
- 工具表有输出空白、依赖客户提供和待弋途提供部分，逐项保留；本表不宣称每项I/O已完整定义。
- 数据库快照只能证注册配置，SOP可量产只能证至少一个项目落地；未逐车型调用验收，不推为所有车辆现状。
- 路测多数仅有行为描述，无车端回执、状态变化或修复验证；cases.md明确根因未定位及研究建议，未把假设写成事故定论。
- 群聊与部分既有会议笔记只作辅助线索，当前未重新在线检索；11/3、10/12、10/19所用结论已优先核文字记录。
