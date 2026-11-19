# F 章事实研究

研究日期：2026-11-17。只研究，不写正文、不改网页、不启动浏览器。来源路径相对 `座舱业务学习站/research/`，行号为本地副本 1 基物理行。原始工作簿位置另见 sop-items.md。所有状态按来源时点，不能从“计划”“启用”推断今日已上线；条目计数是证据与边界条目，不是独立能力数。

逐文件读完即增量保存，以下只是把已保存证据归组；编号保持，便于和案例及补证对照。会议以文字记录优先，AI摘要/二手笔记仅作线索；未取到原文的点明确保留缺口。工具描述写法和新概念供下一步设计使用，本阶段不形成正文或公共卡片修改。

## 读取台账

### F 原文：15/15 全文完成

| 文件 | 全文物理行数 | 提取编号 | 范围 |
|---|---:|---|---|
| agent-protocol.txt | 1077 | AP | 全文含表格/示例/版本记录；完成后立即追加再读下一份 |
| agent-sop.txt | 273 | AS | 全文含表格/示例/版本记录；完成后立即追加再读下一份 |
| agentserver.txt | 86 | SV | 全文含表格/示例/版本记录；完成后立即追加再读下一份 |
| agentserver-opt.txt | 266 | AO | 全文含表格/示例/版本记录；完成后立即追加再读下一份 |
| capability.txt | 115 | CP | 全文含表格/示例/版本记录；完成后立即追加再读下一份 |
| director-prd-tools.txt | 186 | DP | 全文含表格/示例/版本记录；完成后立即追加再读下一份 |
| dynamic-tools.txt | 287 | DY | 全文含表格/示例/版本记录；完成后立即追加再读下一份 |
| h2-excerpt.txt | 227 | H2 | 全文含表格/示例/版本记录；完成后立即追加再读下一份 |
| m1012s-excerpt.txt | 72 | M12 | 全文含表格/示例/版本记录；完成后立即追加再读下一份 |
| planner-tool-accuracy.txt | 7 | AC | 全文含表格/示例/版本记录；完成后立即追加再读下一份 |
| proto.txt | 274 | PT | 全文含表格/示例/版本记录；完成后立即追加再读下一份 |
| saic-sp-0731-tools.txt | 201 | SP | 全文含表格/示例/版本记录；完成后立即追加再读下一份 |
| tool-list.txt | 63 | TL | 全文含表格/示例/版本记录；完成后立即追加再读下一份 |
| tools-io-excerpt.txt | 42 | IO | 全文含表格/示例/版本记录；完成后立即追加再读下一份 |
| user-feedback-excerpt.txt | 33 | UF | 全文含表格/示例/版本记录；完成后立即追加再读下一份 |

### 基线、旁证与复核

- V-STANDARD.md、component-cards.md 已核对，重点卡片 20、24～25、34～45；不改公共部件卡。
- E-v2/facts.md、cases.md、components.md、DESIGN.md 已读；E/raw 按接入、协议、注册、动态工具、流式、取消、幂等、错误、测试定位复核，详细逐文件范围与原文引用见 overlap.md 的读取台账与 X-F/X-C。
- V/R/I/W/M/C/D/E/K 已写章节逐章检查并读 F 相关完整段，87条前章回指与5条后章边界见 overlap.md。
- 当前 v70 的F阅读页、总图、old-page.json、diagrams.json和5个SVG已逐项对照；319条保全底表含重复含义和图内标签，详见 destinations-base.md。
- 功能工作簿用 python3 -I + openpyxl 只读遍历13个sheet，4条主归F和12条依赖/回指见 sop-items.md；环境无python命令，python3是相同隔离模式。
- research全目录按“准入、接入协议、动态工具、工具描述、工具定义、流式、取消、幂等、错误码、灰度、联调”检索非正文整理，相关原文及排除同词命中说明见本文件末尾补证范围。

## 01 准入：能力边界、工具定义、参数与示例

- [AP01] 纯车端自闭环且不依赖座舱云链路的能力建议优先走 Function Calling，三方 Agent 先沟通能力形态再提供中英文名、功能描述、Query 描述、HTTPS URL 与鉴权方式。（来源：chapters/F/raw/agent-protocol.txt:52–68；v1.4协议）
- [AS01] 定义保存唯一英文名、中文名、用户UI名和能力描述，建议snake_case且描述列举具体控制/查询功能，不能把UI名与给Planner看的名字混用。（来源：chapters/F/raw/agent-sop.txt:19–25、81–93）
- [CP02] 原子能力知识包含工具子能力、功能描述、前置条件、特殊说明和query示例，当时为大规模效果/性能评测临时写入代码map，产品化应转工具平台维护。（来源：chapters/F/raw/capability.txt:50–65）
- [DP01] v1.7标准化表对通用工具原则上只允许下游协议适配、不接受工具本身定制，记忆操作与检索直接不接受定制，而上汽三专用工具例外。（来源：chapters/F/raw/director-prd-tools.txt:11–175；摘自10/12 PRD，须与项目实现覆盖描述区分）
- [DY06] current_page_specific描述必须注入当前页可操作项，入参自然语言只允许选择页面内已有操作，动态工具SP模块与静态模块分隔且单独从1编号。（来源：chapters/F/raw/dynamic-tools.txt:173–185）
- [SP01] 7/31上汽SP快照实际包含27个工具定义但编号到28且缺7，每个定义采用工具名/描述/入参/注意事项/tips结构，不能沿根AGENTS的23个说成当前数量。（来源：chapters/F/raw/saic-sp-0731-tools.txt:2–196；逐项数名称）
- [SP02] vehicle_basic_control用自然语言query描述车窗空调座椅等控制，要求参数在可调范围、可按说话人推断位置且明确不支持开关车门。（来源：chapters/F/raw/saic-sp-0731-tools.txt:4–9）
- [SP03] vehicle_system_settings覆盖无线连接、屏幕声音、权限账号与应用页面，用户要求退出语音也交它，不能因含“控制”就全部交车辆控制。（来源：chapters/F/raw/saic-sp-0731-tools.txt:11–16）
- [SP04] vehicle_communication只支持主驾的车载蓝牙电话/视频控制、不支持短信且联系人称呼无需改写。（来源：chapters/F/raw/saic-sp-0731-tools.txt:18–23）
- [SP05] vehicle_status_search查实时车况，Planner满足用户目标需要未知状态时可先查；weather_search描述当前/目的地/沿途与小时级天气及生活指数。（来源：chapters/F/raw/saic-sp-0731-tools.txt:25–37）
- [SP06] poi_search负责类别/模糊地址与条件查找、route_planning负责精确地点新路线和途经点、navi_basic_control负责导航过程/界面/播报/收藏，三者须写清相邻边界。（来源：chapters/F/raw/saic-sp-0731-tools.txt:39–62）
- [SP07] 沿途搜须已有导航路线、多个POI先选再导航，POI/路线/导航控制/行程记录禁止并行，用户按红绿灯等属性选路线时需转换为实际列表序号且选后自动发起导航。（来源：chapters/F/raw/saic-sp-0731-tools.txt:42–61；并串决策回指D章）
- [SP09] video_search当时只支持抖音短视频与腾讯长视频、可找无版权音乐的MV，music_search仅做精确/模糊类目查询且搜后自动播第一首，不擅长需要推理的歌曲问题。（来源：chapters/F/raw/saic-sp-0731-tools.txt:64–76）
- [SP10] media_basic_control管理媒体播控收藏清晰度等，K歌模式切换、预约与点播明确归系统设置工具。（来源：chapters/F/raw/saic-sp-0731-tools.txt:78–83）
- [SP11] user_memory_search与user_memory_operate限注册用户，face_id_register负责注册和昵称变更且名字/座位必填缺则追问，记忆更新须确认不确定信息并覆盖旧值。（来源：chapters/F/raw/saic-sp-0731-tools.txt:85–104；语义细节回K）
- [SP12] web_search用于联网中间决策材料且时间敏感/日期/总结类问题优先查询，goal_list_update入参则为JSON字符串add_goal/delete_goal并避重复目标与离谱目标。（来源：chapters/F/raw/saic-sp-0731-tools.txt:106–118；任务细节留T）
- [SP13] ai_broadcast_generate接话题生成播客且需耗时，broadcast_search查播客/有声并控制播放，auto_drive专管智驾行车泊车，ambient_light_control包揽氛围灯开关模式与任意颜色要求。（来源：chapters/F/raw/saic-sp-0731-tools.txt:120–146）
- [SP14] car_log查时间段/行程用车报告，vehicle_manual_qa查通用功能方法，car_care_qa查绑定本车的非实时长周期生产/维养信息，实时状态仍归vehicle_status_search。（来源：chapters/F/raw/saic-sp-0731-tools.txt:148–167）
- [SP15] audio_record处理录音纪要开关查看，image_generate区分文生图/图生图且需操作类型与描述，visual_qa查车内外视觉但不具屏幕理解/联网且有方向限制。（来源：chapters/F/raw/saic-sp-0731-tools.txt:169–188）
- [SP16] restaurant_reserve处理订座增查改取消且此快照允许人数时间未说时直接调用，由下游接续澄清而非Planner先补齐所有字段。（来源：chapters/F/raw/saic-sp-0731-tools.txt:191–196）
- [IO01] 工具输入标准要求写可处理范围、示例Query、易混淆但不归本工具的范围，工具输出标准必须同时写正常与异常结果，且这里是工具输入而非用户原话。（来源：chapters/F/raw/tools-io-excerpt.txt:26–27）
- [IO05] IO表要求POI不支持具体商家详情而7/31SP宣称支持详情，两份对相同poi_search能力范围冲突且IO表未标该行更新日，不能只按整表8/27版本强行判断该行更晚。（来源：chapters/F/raw/tools-io-excerpt.txt:33；saic-sp-0731-tools.txt:41–46）
- [IO06] 美团餐厅服务必须先确认完整餐厅名、订座时间人数“最好”先确认，多轮第N个要转为完整餐厅名，排队仅收人数/桌型且不支持指定时间、无需联系人。（来源：chapters/F/raw/tools-io-excerpt.txt:42）
- [SF01] 主线 POI 选点工具 7/3 工程链路调通、7/8 弋途上线，但当时 SFT 工具部分未使用 Agent 平台且 SP 中没有选点工具，预计下一周才能支持；这是工程接入和模型可选择分离的真实接入缺口。（11825～11830；周报当时现状，非单次用户事故）（原文文件：chapters/W/raw/server-weekly.txt；范围见本条末尾括号，独立补证可能与F原文复述。）
- [SF07] 原子能力说明内容包含工具子能力、功能描述、前置条件、特殊说明和 Query 示例，映射 key 为工具能力名，value 为多条原子能力。（56～65；临时评测方案）（原文文件：chapters/C/raw/capability-boundary.txt；范围见本条末尾括号，独立补证可能与F原文复述。）
- [SF16] 动态示例用检索注入 SP 处理低频且无法归类的单点问题，共性规则应提炼进静态示例，不能靠每个接入错误都补动态示例。（3～16；产品修复指南）（原文文件：chapters/C/raw/dyn-example-bug.txt；范围见本条末尾括号，独立补证可能与F原文复述。）
- [SF17] 该工具附录把工具定义拆为 tool_name、tool_describe、param、notice、tips，描述能力、参数格式与示例、限制及使用策略是不同字段。（38～45、71～89；历史工具说明范例）（原文文件：chapters/C/raw/dyn-example-bug.txt；范围见本条末尾括号，独立补证可能与F原文复述。）
- [SF18] POI 工具明确不做精确地点导航，路线工具处理精确地点与路线，导航基础控制处理地图/播报/收藏但不做新目的地搜索，工具边界以正向能力和排除项共同表达。（71～89）（原文文件：chapters/C/raw/dyn-example-bug.txt；范围见本条末尾括号，独立补证可能与F原文复述。）
- [SF20] 用户模糊目的地先搜具体地点，沿途搜要求已有导航路线，工具说明还要求相关导航工具串行，接入方不能只声明输入是 string 就忽略前置条件。（75～89）（原文文件：chapters/C/raw/dyn-example-bug.txt；范围见本条末尾括号，独立补证可能与F原文复述。）
- [SF23] 部分工具本身能力弱，音乐工具只做精准或类别搜索，不能把需要推理的完整任务直接丢过去，模型侧说明需要明确这种能力边界。（98～103）（原文文件：chapters/C/raw/dyn-example-bug.txt；范围见本条末尾括号，独立补证可能与F原文复述。）
- [GAP04] 现有材料能支持能力边界清楚、与相邻工具分工明确、输入输出可约定和整体SP评测的准入思路，但未给统一工具价值评分、准入量化线或最优工具数。（来源：chapters/F/raw/agent-protocol.txt:52–68；tools-io-excerpt.txt:27；v-lesson-20261105/director-talk.md:358–377、423–436；研究归纳与缺口）
- [XC07] 能力边界问题分析给出POI收到“新天地附近人均200元左右的火锅店的用户评价”而实际无此能力，以及音乐收到“最近热门抖音神曲”但模糊搜索弱，归因Planner不清楚下游调用规范。（来源：chapters/D/raw/capability-product.txt:46–55、136–142；缺完整调用与回执）

本组：32 条。

## 02 本轮出现哪些工具：配置加载与场景条件

- [AS02] 租户按channel+channel_app_id隔离，实现还配置是否参与Director推理、车端/云端、提供方、生效环境及notice/覆盖描述/param_desc/tips。（来源：chapters/F/raw/agent-sop.txt:27–29、191–202）
- [AO02] AgentDefine全系统一份，AgentConfig仅保存发布实现且channel+channel_app_id+agent_id唯一，AgentVersion每租户同工具有1发布+多草稿，草稿按环境唯一生效。（来源：chapters/F/raw/agentserver-opt.txt:44–54）
- [AO03] 自建/离线Agent多版本依赖云端或车端代码部署，生态Agent可配置多版本，离线结果同步还需改用云端下发AgentID。（来源：chapters/F/raw/agentserver-opt.txt:51–55、102–104）
- [AO06] 主链按环境匹配查询同工具唯一且版本号最大的版本，Planner构造SP时动态加载工具信息。（来源：chapters/F/raw/agentserver-opt.txt:97–101）
- [CP01] 能力边界检查设计在Flow准备阶段异步调用模型、提前通知系统所需字段，Planner等待一次结果后按需改写query并注入capability，完整流仍读至EOF供上报。（来源：chapters/F/raw/capability.txt:7–14、37–49、66–85；技术方案非上线证明）
- [CP03] can_implement=true可立即通知，false须解析reason和required_capabilities后通知，只有false且相应字段非空才追加系统提示或注入工具Knowhow。（来源：chapters/F/raw/capability.txt:40–49、66–74）
- [DY01] 动态工具在每次Planner推理前由条件引擎批量判定是否暴露，目的是把仅特定场景可用的工具从普通对话列表移开以减少选择干扰。（来源：chapters/F/raw/dynamic-tools.txt:3–13）
- [DY02] 本期条件源只支持param，条件用and/or组合并支持exist/not_exist/in/not_in，表达式编译或运行报错示例返回false，端状态条件复用Trigger属于后续规划。（来源：chapters/F/raw/dynamic-tools.txt:15–75）
- [DY03] agent_meta已有director_invisible与need_user_permission_check并新增dynamic_condition，因此模型可见性、权限校验、动态加载条件是不同属性而非所有权限都必然前置过滤。（来源：chapters/F/raw/dynamic-tools.txt:76–98）
- [DY04] 纯文本列real_time_card存在与trip_plan_switch=open两项示例，但带格式原始副本将后者整段划除，现可采信卡片条件、行程开关只能留作已划除设计记录。（来源：chapters/F/raw/dynamic-tools.txt:99–130；case-rewrite-20261029/async/F-dynamic.md:151–166）
- [SF06] 能力边界检查在主链准备阶段异步启动，Planner 等结果后按所需能力 key 注入原子能力说明；所需 key 示例为 media_basic_control、music_search。（8～14、38～49、66～74；评测技术方案）（原文文件：chapters/C/raw/capability-boundary.txt；范围见本条末尾括号，独立补证可能与F原文复述。）
- [SF26] 示例的主要作用是教 Planner 怎样使用工具，车型有没有功能由单独能力边界判断，少量车型范围变化可删除不适用示例，不能用示例代替配置准入。（396～415，00:59:42～01:00:19；文字记录）（原文文件：v-lesson-20261105/director-talk.md；范围见本条末尾括号，独立补证可能与F原文复述。）
- [GAP03] 离线、行车/停车、账号状态可成为能力或执行限制，但本期动态工具原文只证实param条件及卡片/行程开关示例，没有证明所有这些条件均已接入统一前置工具过滤。（来源：chapters/F/raw/dynamic-tools.txt:30–36、74–130；saic-sp-0731-tools.txt:21–22、88–103）
- [XC12] 未登录QQ音乐的路测被模型一概判不能搜英文歌，原分析要求区分登录、版权与实际播放结果，因此不能把账号未登录一律写成所有音乐工具前置隐藏条件。（来源：chapters/D/raw/capability-issue.txt:106–115；未给完整工具记录）

本组：14 条。

## 03 单个 Agent 接入协议：归属字段与同步/流式边界

- [AP02] POST/SSE 请求必填 chat_id、question_id、conversation_id、agent_id、protocol_version、query、agent_context、common_info、trace_id，Header 的 trace-id 同样必填。（来源：chapters/F/raw/agent-protocol.txt:69–188）
- [AP03] chat_id 是贯穿多轮的话题 ID、question_id 是单轮 QA ID、conversation_id 是会话列表一组对话的 ID，而 query.round_id 被定义为 ASR 过程轮次，不能直接当成 Planner 轮次。（来源：chapters/F/raw/agent-protocol.txt:88–128、449–505）
- [AP04] CommonInfo 必填 channel、channel_app_id、vehicle_id、vehicle_type、vehicle_name，而经纬度、account_id、doubao_uid、city、district 选填。（来源：chapters/F/raw/agent-protocol.txt:506–603）
- [AP05] Query 的 trigger_method、query_type、content、round_id 必填，user_input_scene_type 选填，触发来源覆盖用户、用户状态、车况、环境、定时、预留和紧急七类。（来源：chapters/F/raw/agent-protocol.txt:449–505、893–967）
- [AP06] AgentContext 可选传历史、长短期记忆、车辆状态和用户状态，历史含 Planner 综合回答及 tool_id/query/model_content 工具记录，车辆信号支持原始与中文参数。（来源：chapters/F/raw/agent-protocol.txt:604–873）
- [SV01] Agent Server只管单Agent管理调用而不负责Planner多动作编排，单调用按agent_id读端点/来源元信息、补请求或Context依赖、选Executor并统一回包。（来源：chapters/F/raw/agentserver.txt:4、11–21；E章回指）
- [SV03] One Page中的Memory传递和使用仍标待定，部分Agent可自行从Fornax取SP/UP并按其特殊格式渲染，统一IDL被指定在代码仓库管理。（来源：chapters/F/raw/agentserver.txt:29–49、72–73；文件未标独立更新时间）
- [DY05] 即时卡片通过query上行vehicle_biz_params.ext.real_time_card携title/content/button/reason/card_id且实际值为JSON字符串，未来由Context托管。（来源：chapters/F/raw/dynamic-tools.txt:154–172、194–212）
- [PT02] 端云ext的key/value均为字符串，vehicle_biz_params携vehicle_id/type/channel/app_id及coordination_info中的client_version、request_id、round_id、sound_zone、TTS选项和direct_agent。（来源：chapters/F/raw/proto.txt:28–54）
- [PT03] 端云request_id用于端云结果仲裁，每帧下行vehicle_coordination_metadata含request_id与tts_audio_id，这组外层身份不等同于第三方协议的chat/question/conversation命名。（来源：chapters/F/raw/proto.txt:47–72；不同层字段关系需实现映射证明）
- [TL05] 生态执行器支持HTTP/SSE、MCP、Frontier，但11/4生态配置全是HTTP，框架支持范围与实际渠道接入方式不同。（来源：chapters/F/raw/tool-list.txt:62）
- [EX01] 反馈Runner将Planner的params.query映射到Query.Content，report_id/status由服务端按活动任务读取而不是端上传或模型猜测，入口input_scene另作来源映射。（来源：chapters/E/raw/user-feedback.txt:184–220）
- [EX10] AgentServer消息协议与控制协议分开，控制列预请求协商、Fallback、指定下一跳A2A，原文并未展开Redirect字段或跳数。（来源：chapters/F/raw/agentserver.txt:50–69）
- [SF19] 多轮指代需在参数中补全：如“第二家口味怎么样”要转换为具体商家名称；“选择红绿灯少的路线”需根据已返回列表转成具体路线序号。（74～82；接入定义承担参数要求）（原文文件：chapters/C/raw/dyn-example-bug.txt；范围见本条末尾括号，独立补证可能与F原文复述。）
- [SF21] 人脸工具参数必须包含名字与座位，缺失先问询；技能工具 update/delete 必须带已有 skill_id，add 不带且由系统分配。（117～135；K 语义回指，F 仅示范参数契约）（原文文件：chapters/C/raw/dyn-example-bug.txt；范围见本条末尾括号，独立补证可能与F原文复述。）
- [SF22] 行程工具创建必须给日期、目标、每日行程与地点序号，修改必须给操作类型，口头展示行程不等于已经持久保存。（198～203；T 语义回指，F 用作接入输入约束示范）（原文文件：chapters/C/raw/dyn-example-bug.txt；范围见本条末尾括号，独立补证可能与F原文复述。）
- [GAP01] 本次取得的三方协议只定义POST/SSE多帧返回，没有普通HTTP同步单JSON响应完整契约，不能把HTTP接入配置或M章同步批次等同于已取得同步接口协议。（来源：chapters/F/raw/agent-protocol.txt:69–76、189–191、381–382；全文范围核查）
- [GAP06] CommonInfo里account_id选填是通用传输协议要求，而需登录的反馈业务仍要求request_id/log_id属于当前channel/vehicle_id/account_id并由服务端查任务，不能用“账号字段选填”推成无需归属校验。（来源：chapters/F/raw/agent-protocol.txt:573–587；chapters/E/raw/user-feedback.txt:1470–1478）
- [XC13] 4度/24度路测实际vehicle_basic_control调用与反馈都含4度、纠正轮改24度，但首轮导出用户事件只写我要通风，故无法判错误起于ASR还是Planner填参。（来源：v-lesson-20261107/raw/issues-0914.txt:41；LogID20260914151809F48F6B7A2BD930F87B88、2026091415182058804B03F9587E4A444B）

本组：19 条。

## 04 流式返回：展示、播报、模型反馈与卡片

- [AP07] SSE 帧的 content 给展示、tts_content 给播报、model_content 给 Planner 总结上下文、reasoning_content 表示思考，另含流类型、Agent、结束标记、命令、扩展和错误信息。（来源：chapters/F/raw/agent-protocol.txt:189–281）
- [AP08] 数据返回完必须发 is_finish=true 末帧且可携正文，座舱靠它最终发送和落历史，因而流结束本身不等于业务成功。（来源：chapters/F/raw/agent-protocol.txt:1010–1013；末句是协议语义解释）
- [AP09] content_type=1/6/9 分别为文本、卡片 JSON、透传，卡片需约定 widget_id/widget_data，类型9由车端按 agent_id 路由。（来源：chapters/F/raw/agent-protocol.txt:402–448、982–999）
- [AP10] 无法处理可主动 Fallback 交座舱再选方式，正常响应不应带 command，自定义端信息可用 ext.delta_extra_info 的 JSON 字符串由端方解释。（来源：chapters/F/raw/agent-protocol.txt:257–269、1000–1020）
- [SV02] 音乐等仅给结构化数据的Agent需自定义后处理转成模型上下文文本，正常调用在IsFinish=true帧落历史并结束。（来源：chapters/F/raw/agentserver.txt:18–21）
- [DY07] 即时卡片选择模型输出select_button，回端chunk_type=1/content_type=9、content内序列化按钮指令，但示例agent_id仍待定且出参没有展示card_id对应字段。（来源：chapters/F/raw/dynamic-tools.txt:189–222）
- [H206] 联网展示改为所有渠道直接展示web_search原始输出的图文混排，历史记8/6上线且不再按渠道差异展示。（来源：chapters/F/raw/h2-excerpt.txt:143–150）
- [IO07] 美团反馈区分登录扫码、定金去手机处理、日期人数位置联系人澄清、提交待商家确认与商家确认成功，部分失败原因/查询修改数据仍待弋途补齐。（来源：chapters/F/raw/tools-io-excerpt.txt:42）
- [UF01] 反馈Agent先校验模型决策并执行业务生成agent_result，再序列化入内部ChatResponse.ModelContent/model_content，Planner汇总为tool_name+tool_feedback后才生成最终显示和TTS。（来源：chapters/F/raw/user-feedback-excerpt.txt:4–23、32）
- [UF02] tool_feedback是Planner上下文字段而非ChatResponse字段，Feedback Model输出协议也没有model_content，禁止把未经校验和业务执行的模型原JSON直接返回当真实结果。（来源：chapters/F/raw/user-feedback-excerpt.txt:12–23）
- [EX02] 最终Planner响应中的content/tts_content给客户端，最终model_content为后续上下文，不等于内部Agent同名model_content或tool_feedback，成功文案必须晚于业务执行。（来源：chapters/E/raw/user-feedback.txt:763–789）

本组：11 条。

## 05 取消、超时、重试与幂等

- [AP11] query_type=1 是标准查询、2 是默认关闭且须额外对齐的预查询、3 是取消当前对话，全文未定义专用取消确认、目标匹配、生效时限或物理动作撤回。（来源：chapters/F/raw/agent-protocol.txt:928–945；后半为全文证据边界）
- [SV04] 用户操作打断时调用方通过Context发cancel再断连接，Agent Server通知下游结束并将已生成内容存历史，但该页没有描述各Executor的取消投递确认与超时。（来源：chapters/F/raw/agentserver.txt:71）
- [PT05] TTS打断分类区分新播放、低功耗、指定/全部停止、拒识结果、离线车控、静默、流式非拒识及单双人插话，这些停止播放规则不证明取消下游Agent业务动作。（来源：chapters/F/raw/proto.txt:124–240；播放策略回指I章）
- [SP08] 7/31路线规划说明允许导航发起失败最多重试2次，但该例外不是全工具统一自动重试规则。（来源：chapters/F/raw/saic-sp-0731-tools.txt:53–55）
- [UF03] 反馈模型只能提clarify/review/submit/cancel决策，首次start_collect由Agent生成，业务取消要校验活动任务、清数据并通过Frontier停止CDC采集且不提交VSHD，这与通用请求取消不同。（来源：chapters/F/raw/user-feedback-excerpt.txt:24–32）
- [EX04] 反馈创建按vehicle_id+request_id+source去重、语音动作按report_id+action幂等，状态变更以vehicle_id+report_id+当前状态条件更新且重复创建回读已有记录不重复提交。（来源：chapters/E/raw/user-feedback.txt:1439–1478；单应用设计）
- [EX05] 反馈cancel只允许COLLECTING/REVIEW_READY到CANCELED、SUBMITTED/CANCELED/EXPIRED终态不反转，submit在REVIEW_READY→SUBMITTING的同次CAS认领中原子保存不可变上下文快照且允许同submit安全重试。（来源：chapters/E/raw/user-feedback.txt:1394–1443）
- [EX07] 反馈统一表默认report_status=0对应卡片待提交，而语音start显式写COLLECTING=10，两者按source区分不是状态冲突。（来源：chapters/E/raw/user-feedback.txt:1241–1255、1392、1404–1439）
- [SF30] 旧输入管理策略提出工具超时先交超时 feedback，再由 Director 告知并重试、重试失败结束任务；这一段没有给重试次数、幂等键和副作用保护。（495～503；旧产品设想，不能直接变成当前全工具规则）（原文文件：chapters/D/raw/input-mgmt-strategy.txt；范围见本条末尾括号，独立补证可能与F原文复述。）
- [GAP02] 已有Context cancel和query_type=3两层取消约定，但未找到各Executor映射、ACK时限、断连必停、已发指令补偿或跨重启全链持久幂等确证。（来源：chapters/F/raw/agentserver.txt:71；agent-protocol.txt:928–945；R-v2/full-v62.md:389–403仅作章节边界）

- [EX15] 语音反馈任务expires_at由服务端now+feedback_task_ttl产生、建议默认10分钟可配，review可延确认窗口而clarify不落库不刷新，不能套作所有Agent调用超时。（来源：chapters/E/raw/user-feedback.txt:1394）

本组：11 条。

## 06 错误与失败：分层定位与应补的信息

- [AP12] 响应 error_code=0 且 error_message 为空表示成功，错误响应也用这两字段，但三方协议未列非零码全集与统一重试规则。（来源：chapters/F/raw/agent-protocol.txt:271–301）
- [H209] 周报风险明确弋途美团Agent不稳定且经常连接报错，处理方向是同项目推动弋途排查，未提供准确错误码或底层连接根因。（来源：chapters/F/raw/h2-excerpt.txt:181–207）
- [TL04] 快照查到上汽99220的config_id66启用却缺agent_define、赛力斯99210的driver_agent/config_id355启用却缺当前工作区本地工厂ID映射，均为配置/代码核查而非线上事故。（来源：chapters/F/raw/tool-list.txt:59–60）
- [IO03] 车控回执用改写query+实际函数+状态、失败补原因，超时明确“执行失败，请勿重复调用，需要告知用户”，导航控制还区分无法执行/不在导航/暂不支持。（来源：chapters/F/raw/tools-io-excerpt.txt:28、37；E章回指）
- [IO04] POI反馈将普通未找到、沿途未找到且勿重调、缺导航路线三类失败分开，车辆状态和天气的无数据仅回结果为空，不能把空、失败、超时混作同一种错误。（来源：chapters/F/raw/tools-io-excerpt.txt:33、38–39）
- [EX03] 反馈业务错误表的UNAUTHENTICATED、FORBIDDEN_TARGET、INVALID_ARGUMENT、TARGET_NOT_FOUND、DRAFT_NOT_FOUND、DRAFT_EXPIRED均retryable=false，只有INTERNAL_ERROR=true，不能推广为所有工具码表。（来源：chapters/E/raw/user-feedback.txt:1099–1155）
- [SF13] Agent 管理后台删除 Agent 定义接口曾存在水平越权，9/18 仍在开发，后续记录已完成且 10/14 安全工单关闭。（3379～3383、2077～2082；后者时点更新）（原文文件：chapters/C/raw/h2-biweekly.txt；范围见本条末尾括号，独立补证可能与F原文复述。）
- [SF28] 车控工具成功、失败及失败原因由各项目产品按功能定义；赛力斯当时接收车企反馈，能判断成败和原因，但没有统一细化所有硬件失败分类。（1585～1634，01:20:30～01:22:08；文字记录）（原文文件：chapters/W/raw/m0901w.txt；范围见本条末尾括号，独立补证可能与F原文复述。）
- [SF29] 成功/失败的业务判定不仅用于 Planner feedback，也用于车外语音灯效等用户反馈，接入评审应确认消费方需要的层级；会议没有提供统一错误码表。（1580～1634；讨论边界）（原文文件：chapters/W/raw/m0901w.txt；范围见本条末尾括号，独立补证可能与F原文复述。）
- [XC08] 一次路测用户要求暂停音乐而系统答搞定后承认听成暂停导航，原分析归对象判断/指令错误及回执含糊，但未提供首轮工具名和实际参数。（来源：v-lesson-20261107/raw/fake-success.txt:451–462）
- [XC09] 遮阳帘路测出现说拉上却实际打开，原分析明确归Planner下发错误指令而非车控翻译，但未给实际action_list和函数。（来源：v-lesson-20261107/raw/fake-success.txt:463–475）
- [XC10] 路测用户明确搜索喀什景点真实照片或BNC绿色袋子实拍却先得到生图，文本只证结果类型违背请求、未给工具名不能定位为某一条工具定义导致。（来源：v-lesson-20261107/raw/issues-0914.txt:13–15、20）
- [XC11] 路测“换成刚推荐的潮汕糖水铺”却重搜换另一店，“当前歌放完插下一首、不立即切歌”却立刻切歌，原文未给参数与回执不能确定是Planner漏约束还是工具能力/执行问题。（来源：v-lesson-20261107/raw/issues-0914.txt:11、23）
- [XC14] 能力边界问题摘录还记AI画布关闭、避高架、浏览器百度、自适应巡航/自动泊车、导航收藏夹、网易云及等灯少路线多例前后承诺不一致，但未给实际动作与回执，不能唯一归因定义或填参。（来源：chapters/D/raw/capability-issue.txt:57–143；二手分析保留真实对话和LogID）

- [EX13] 10/12文字记录所说error code是导航搜不到的错误页面、上汽计划10/20合入后迁赛力斯另排期，不是通用Agent错误码体系已统一。（来源：chapters/E/raw/m1012s.txt:904–923，00:39:55–00:40:30）
- [EX14] 车控排查要求已下发但10秒未收到结果转客户端并核测试服务三机房部署，10秒是排查分工阈值而非所有Agent统一执行超时。（来源：chapters/E/raw/sls-vc-debug.txt:3–7）

本组：16 条。

## 07 接入和上线流程：材料、职责、配置与测试

- [AP13] 鉴权支持 API Key Bearer 或指定 AK/SK 的 HMAC-SHA256/Base64 签名，后者用时间戳与随机数并记载超过30秒丢弃。（来源：chapters/F/raw/agent-protocol.txt:1021–1075）
- [AS03] 接入点支持http/kitex/mcp/frontier，认证选项有APIKey、X-Signature、VAuth-V1、SAIC-OpenAPI，表单把AK/SK和Method/Host/Path标必填而Port选填。（来源：chapters/F/raw/agent-sop.txt:203–210；表单约定不等于每种认证都要同一组密钥）
- [AS04] 平台顺序是创建定义→创建实现→快速测试→测试环境验证→按需代码Review发版→测试通过发布草稿，自建或非标准协议Agent先取AgentID再开发。（来源：chapters/F/raw/agent-sop.txt:247–254）
- [AS05] 系统视角能改删定义、租户视角只查看，定义删除前要禁用关联实现，禁用只影响当前实现且保留配置，上线要求对应渠道至少一个启用且已发布实现。（来源：chapters/F/raw/agent-sop.txt:40–49、98–102、215–237）
- [AS06] 快速测试不指定工具时经Planner选择和总结、指定工具时跳过Planner直调并展示结果，目前仅支持天气、车书、闲聊等部分纯文本交互。（来源：chapters/F/raw/agent-sop.txt:238–245）
- [AS07] 产品在Fornax变量或Prompt副本调好工具说明后必须同步改管理平台，正式Prompt用{{tool_info}}占位符，因为Fornax无法自动取得动态工具内容。（来源：chapters/F/raw/agent-sop.txt:255–260）
- [SV05] 客户自有Agent须按座舱对外协议实现服务接入点，座舱注册后才纳入整体链路调用。（来源：chapters/F/raw/agentserver.txt:81–83）
- [AO01] AgentServer优化针对游离Agent硬编码拼列表、租户硬编码裁剪与同能力重复建Agent，本期只收拢游离Agent而提供方Wrapper统一协议适配是理想方向。（来源：chapters/F/raw/agentserver-opt.txt:2–43）
- [AO04] 定义每2小时定时刷新并在创建更新启动时主动刷新、缓存有效3小时，租户发布列表缓存5分钟，不能承诺配置保存后全链瞬时切换。（来源：chapters/F/raw/agentserver-opt.txt:62、97–101；末句为缓存语义解释）
- [AO05] 发布草稿以事务软删旧发布、提升新发布、移除对应草稿环境绑定并覆盖生效配置，切测试环境只更新版本绑定无需新建版本。（来源：chapters/F/raw/agentserver-opt.txt:63–76）
- [DY08] 后台条件选项通过GET /aidv/v1/web/condition/options获取预置字段与关系，Agent实现增改查接口需新增dynamic_condition。（来源：chapters/F/raw/dynamic-tools.txt:223–286）
- [H202] 管理后台渠道隔离与数据归属权限一期记10/8提测、10/13上线，目标是客户按授权渠道访问与运营只改自己数据。（来源：chapters/F/raw/h2-excerpt.txt:32–37）
- [H207] 管理平台8/7上线项包含用户权限校验开关、静动态图片资源上传与HTTP测试环境地址，以替代TCC配置、手动TOS及代码写死URL。（来源：chapters/F/raw/h2-excerpt.txt:151–162）
- [M1201] 10/12文字记录确认行程规划仍开发且不完整，路测会自然触发它影响体验，因此现场同意从Director拿掉该工具或临时关闭，而非要求测试者避说某类需求。（来源：chapters/F/raw/m1012s-excerpt.txt:3–49，00:40:47–00:42:50）
- [IO02] 全量工具表分别登记产品与研发负责人，车辆控制/系统设置/通讯为左晨与俞昭志、路线/POI/行程记录/选点为陈敏与王兴、美团服务为徐腾飞与吕鹏浩，责任应按该来源时点而非当成今日组织名单。（来源：chapters/F/raw/tools-io-excerpt.txt:28–35、42）
- [SF04] 赛力斯即时交互卡服务端于 8/28 上线后，9/8 联调又变更推送结构，9/10 提测仍因客户端版本而被反复打回，服务端上线不能视为全链交付。（3218～3224；真实联调过程）（原文文件：chapters/W/raw/h2-biweekly.txt；范围见本条末尾括号，独立补证可能与F原文复述。）
- [SF09] Planner 注入 capability 还需要产品同步修改 Planner SP，单有服务端透传不能证明模型已消费。（66～74；跨团队交接条件）（原文文件：chapters/C/raw/capability-boundary.txt；范围见本条末尾括号，独立补证可能与F原文复述。）
- [SF11] Agent 平台 8/7 升级记录新增用户权限校验开关、Agent 展示资源上传、HTTP 接入点测试环境地址，分别替代 TCC 配置、手工 TOS URL 与 TCC 弋途域名控制。（7888～7900；DONE 历史状态）（原文文件：chapters/C/raw/h2-biweekly.txt；范围见本条末尾括号，独立补证可能与F原文复述。）
- [SF14] 管理后台原先仅控模块访问，缺渠道隔离和数据归属校验；权限一期支持外部客户按授权渠道访问、运营仅修改自建数据，记录 10/13 上线。（608～614；DONE）（原文文件：chapters/C/raw/h2-biweekly.txt；范围见本条末尾括号，独立补证可能与F原文复述。）
- [SF25] 10/22 宣讲明确新增/调整工具先维护名称、英文名、描述和 Query，再用 Director 整体提示词评测；发言者承认下游工具输入输出整理当时“缺失维护”。（358～377，00:58:10～00:58:52；文字记录）（原文文件：v-lesson-20261105/director-talk.md；范围见本条末尾括号，独立补证可能与F原文复述。）
- [GAP05] SOP给创建、联调、测试环境、发布与禁用操作，功能清单要求项目先给明确诉求和材料再一事一议评估，但本次未取得全工具统一申请表、评审签字链、灰度比例/天数与回退SLA。（来源：chapters/F/raw/agent-sop.txt:247–272；AI汽车SOP功能清单 (1).xlsx之【必读】清单说明&change log!B10:E15，精确原名与位置见sop-items.md）

本组：21 条。

## 08 评测、真实问题和排查：工具选择与参数质量

- [AS08] param_desc、notice、tips变更会直接影响模型调用，SOP要求每次配置变更先快速测试再正式发布且操作前确认渠道。（来源：chapters/F/raw/agent-sop.txt:262–272）
- [AC04] 这份报告只提供意图评测通过率，没有工具数量变化的对照实验、独立参数准确率或统一接入准出阈值，不能由其中数字证明工具越多准确率具体下降多少。（来源：chapters/F/raw/planner-tool-accuracy.txt:1–7；全文证据范围）
- [EX11] “33个标准化业务行”是14必选+16可选+3定制，另外goal_list_update还有一行搭载为斜杠的占位，不能把34个工具名称行与33个明确搭载行混数。（来源：chapters/F/raw/director-prd-tools.txt:11–175；本轮逐项计数）
- [SF24] 11/3 三模型盲测第 8 例（样本 102）评价称 lite 正常调用工具且参数更详细，turbo 虽调用但只写“主驾驶位的人穿的什么衣服”，SFT 未调用工具就直接夸用户；原始用户 Query 和模型完整输出仅有图片占位，本地文本不足还原。（1～4、567～582；真实离线评测记录，非线上事故）（原文文件：chapters/D/raw/blind-1103.txt；范围见本条末尾括号，独立补证可能与F原文复述。）
- [FMT03] 2026/3/21运营双周报把GUI主链联调因Planner理解、任务分类及工具参数错误导致提测延迟2天，并定位复杂任务中偶现漏识别更换商品品类补充而使端云任务状态错乱。（来源：coverage-expansion/sweep-config/SF-201.md:332–336；历史项目风险）
- [XC04] 11/2模拟评测里“92的油跑100公里要多少钱”被SFT用vehicle_status_search同时取油价油耗、乘法约46.4元虽正确仍工具分0/最终1分，说明模拟器有返回不能证明工具真实具备该数据能力。（来源：chapters/D/raw/eval-1102-sft.txt:342–357，SMALL-000124）
- [XC05] “4A以下别讲、只介绍4A5A”评测真值为纯回答，turbo/lite却新增goal_list_update、SFT直接确认得3.83分，问题是已有任务补充与新增目标边界。（来源：chapters/D/raw/eval-1102-sft.txt:176–191，SMALL-000382）
- [XC06] D挡下“靠背放倒一点”的评测中SFT仍发主驾靠背调用、被拒才改口得0分，而lite先提示停稳挂P挡，该例不能证明工具本身应该从列表消失。（来源：chapters/D/raw/eval-1102-sft.txt:286–301，SMALL-000437）

本组：8 条。

## 09 演进：工具边界与模型/协议版本

- [AP14] 协议由2025-08-27 v1.0演进至2026-08-13 v1.4，2026-02-12加卡片、2026-05-13将account_id改选填、v1.4更新端状态去冗余。（来源：chapters/F/raw/agent-protocol.txt:2–49）
- [DP03] 通用工具表列SP+post-training、上汽氛围灯/用车报告/维养只列SP，表中训练接入方式不等于某个模型版本已经学会了所有新增工具。（来源：chapters/F/raw/director-prd-tools.txt:11–175）
- [M1202] 同次会议对赛力斯额外两高德工具仅说已接、跑通中或测试中，并提议通后路测，未确认准上线。（来源：chapters/F/raw/m1012s-excerpt.txt:51–70，00:42:53–00:43:24）
- [TL06] task_agent与task-agent为兼容独立vehicle.agent.task的新旧入口，goal_list_update仍为本地长时目标管理，不能因名字相近就视为同链路。（来源：chapters/F/raw/tool-list.txt:61）
- [IO08] 工具边界演进包括4/24加智驾、4/27加行程并弃GUIAgent、5/19将车控拆为车控/系统/通讯、5/25进一步清系统媒体职责与模糊地点先搜、5/26加媒体/停车支付/订座。（来源：chapters/F/raw/tools-io-excerpt.txt:5–6、12–14；2026版本）
- [IO09] 接入结果约定还先后补音乐输出5/13、停车注册车牌失败5/28、视觉函数不符6/1、全工具英文名对齐6/3、播客tool_feedback6/5、目标输入输出6/10、上汽屏幕理解下线6/12、选点6/30、无流水灯7/17、后排视频7/24、播客隐私7/30及8/27订座扩为美团餐厅服务含排队。（来源：chapters/F/raw/tools-io-excerpt.txt:11、15–25）
- [SF08] 该能力知识当时为快速效果/性能评测写死在代码 map，原文明确不能作为上线方案，产品应先评测再提产品化，研发建议统一收进工具平台并提供录入管理页面。（50～60；明确产品化边界，不能写成现有平台已具备）（原文文件：chapters/C/raw/capability-boundary.txt；范围见本条末尾括号，独立补证可能与F原文复述。）

本组：7 条。

## 10 车型差异

- [DP02] 标准化33业务行中包含14必选、16可选和3上汽定制，goal_list_update只写斜杠、task_agent必选、trip_planning与customised_playlist可选主线/赛力斯，不能把33当任何车本轮工具数。（来源：chapters/F/raw/director-prd-tools.txt:11–175；逐行计数）
- [DP04] 表中上汽与赛力斯Planner使用不同Prompt key，工具层标准化不意味着两项目提示词完全相同。（来源：chapters/F/raw/director-prd-tools.txt:181–183）
- [H205] 赛力斯基于上汽适配的地图车控8/4交付后仍遗留效果bug，行程规划因上汽HOLD而赛力斯需要无法直接搬运，须产品补齐内容。（来源：chapters/F/raw/h2-excerpt.txt:130–141）
- [PT01] 端云渠道示例为主线master/1000、赛力斯seres/99210、上汽saic-dna/99220，channel与channel_app_id必须成对识别。（来源：chapters/F/raw/proto.txt:2–27）
- [TL01] 同名weather_search在上汽用内部DPFM、赛力斯用弋途，broadcast_search则上汽弋途/赛力斯DPFM，提供方选择属于项目实现配置不应靠Planner改工具名。（来源：chapters/F/raw/tool-list.txt:3–4、22–23）
- [TL03] 工具表“全部”只表示已有配置渠道的实现一致、不代表所有渠道都已配置，启用状态也不代表验证可调用，task_agent行还单列seres。（来源：chapters/F/raw/tool-list.txt:40、54–58）
- [SF03] 同段赛力斯 Ainavi 适配写明“在 agent 工具平台配置即可，无需代码开发”，但服务端适配的联调提测仍跟随车端。（10631～10645；项目接入状态）（原文文件：chapters/W/raw/server-weekly.txt；范围见本条末尾括号，独立补证可能与F原文复述。）

本组：7 条。

## 11 指标与观测

- [AC01] 工具调用意图评测2025/12/11、12/18、12/25直请算法模型分别为279/339=82.30%、311/338=92.01%、322/337=95.54%，12/25剔除一次调用当时并不存在的行程规划工具。（来源：chapters/F/raw/planner-tool-accuracy.txt:1–5）
- [AC02] 2026/3/27 ppe_aidv_dev1评测500/584=85.62%，2026/5/28 ppe_aidv_saic_dev表记总608、pass434、fail60、block/NA109、通过率86.97%，不同环境与样本不可直接横比为模型退步。（来源：chapters/F/raw/planner-tool-accuracy.txt:6–7）
- [AC03] 5/28表434+60+109=603比总608少5条，434/(434+60)=87.85%而434/(608-109)=86.97%可复现报告值，可能用总数减阻塞作分母但5条分类仍缺失、不得自行补定。（来源：chapters/F/raw/planner-tool-accuracy.txt:7；算术核对）
- [PT04] edge-to-edge列六个毫秒指标，分别覆盖VAD结束到首播/首字、VAD开始到ASR首字、VAD结束到ASR尾字、ASR尾字到首播/首字，单例可从logID找traceID再查edge2edge-time-cost span。（来源：chapters/F/raw/proto.txt:77–120）
- [TL02] 11/4数据库快照覆盖225配置/50个AgentID、212启用配置/49个启用AgentID，仅核工作区代码且未验证线上部署或逐工具调用，不能充当本轮可见数或实车通过率。（来源：chapters/F/raw/tool-list.txt:48–58、63）
- [EX09] 反馈方案要求用统一Trace记录意图、Frontier下发、上下文组装、最终操作结果，观测失败不得阻塞主链且日志不打印正文、身份、PDID、附件地址。（来源：chapters/E/raw/user-feedback.txt:1479–1480）

本组：6 条。

## 12 排期与现状

- [AO07] 优化开发分三期：类型收敛、租户隔离与平台、主链切新体系及删除旧代码，分期表未给完成日期。（来源：chapters/F/raw/agentserver-opt.txt:240–263）
- [CP04] 能力检查初评只看随机query性能不考准确率且认为2.0lite太慢，9/8补充账号加白申请lite模型单元后称速度基本满足，但没有正式上线证据。（来源：chapters/F/raw/capability.txt:94–112）
- [H201] 双周报记AI电台内容编排Agent为DONE且开发8/12–14、联调9/1–3，但风险栏仍说弋途与客户端联调慢，不能将DONE理解为端云全链已验收。（来源：chapters/F/raw/h2-excerpt.txt:12–19、88–95；历史条目未逐项标年）
- [H203] 动态工具历史状态是8/31评审、9/3–10开发、9/10给后台接口、9/18端联调、10/16测试，收益才是按触发条件暴露工具提升选择准确性。（来源：chapters/F/raw/h2-excerpt.txt:96–103）
- [H204] DNA美团订座经历6/23–24开发、7/2–4联调、7/14–16修经纬度空并对齐调用预期、7/19–22批测、7/23–29修问题，7/30–8/3记一期全部完成。（来源：chapters/F/raw/h2-excerpt.txt:115–129）
- [H208] SFT版工具Prompt动态加载曾为HOLD且计划重大演示后变更，方案用{{tool_list}}占位符与平台SFT专用描述，不能用通用SOP推出所有SFT均已动态化。（来源：chapters/F/raw/h2-excerpt.txt:163–171）
- [H210] 上汽按车型动态注入座椅能力原排10/20上线，但最新附注仍为端上配置上报bug阻塞、调整判断后待重测，计划日期不能当实车完成证据。（来源：chapters/F/raw/h2-excerpt.txt:218–224）
- [H211] 美团任务进度上AI Bar任务岛当时DOING、11/2联调且预期1/5上线，司机临停测试则只验证指令能否下发地图，不等于司机内部全功能完成。（来源：chapters/F/raw/h2-excerpt.txt:38–44、69–75；留给T/DR展开）
- [SF02] 后续周报把该选点工具工程侧标完成，仍把 7/24 后产品细化场景和 SFT 诉求留为下一步，故“工程完结”不证明产品链路可用。（10623～10630；较后状态）（原文文件：chapters/W/raw/server-weekly.txt；范围见本条末尾括号，独立补证可能与F原文复述。）
- [SF05] 即时任务卡 9/20 重新打包后出现无法上云，9/21 10:42 定位解决并开始正常测试，当时客户端 bug 仍未修完且未上线；后续记录 10/13 上线。（3218～3224、1934～1941；后者较新）（原文文件：chapters/W/raw/h2-biweekly.txt；范围见本条末尾括号，独立补证可能与F原文复述。）
- [SF10] 性能初评先认为 2.0 lite 不可行、mini 可能可行，而 9/8 补充称申请新的 lite 模型单元后速度基本满足；这些是配置变更后的自测状态，不是工具准确率结果。（94～112；后者更新）（原文文件：chapters/C/raw/capability-boundary.txt；范围见本条末尾括号，独立补证可能与F原文复述。）
- [SF12] SFT Planner 切换后工具信息曾固定写死，改造方案是 SP 使用 {{tool_list}} 占位符并在 Agent 平台创建 SFT 版工具说明，按租户动态加载；较早记录 TODO、稍后记录 HOLD 且等重大演示后再改。（7900～7910、9348～9358；后者行号靠后是较早周报，不能按物理行号判新旧）（原文文件：chapters/C/raw/h2-biweekly.txt；范围见本条末尾括号，独立补证可能与F原文复述。）
- [SF15] AI 电台的内容编排 Agent 对接依赖弋途 Agent 和播放列表端状态，即使周报标 DONE，同一段风险仍称弋途与客户端仍在联调且进度慢，不能只看状态标签判完整交付。（588～597；状态文本内部张力）（原文文件：chapters/C/raw/h2-biweekly.txt；范围见本条末尾括号，独立补证可能与F原文复述。）
- [SF27] 高德复杂规划与导航交互两个工具 10/22 仍在测试、未达准上线标准，因它们与基础工具边界模糊，方向是合为司机/出行 Agent，当时只在赛力斯评测。（423～436，01:00:39～01:00:47；当时现状与演进方向）（原文文件：v-lesson-20261105/director-talk.md；范围见本条末尾括号，独立补证可能与F原文复述。）
- [FMT02] 旧工具库/生态配置与IoT设备接入迭代日历只列Q4P1且缺提测上线值，不能证明某个新工具已交付。（来源：coverage-expansion/sweep-config/SF-67.md:12）

- [EX12] 较新服务端周报将动态加载工具标DONE且10/22已上线，但只说条件满足才暴露、提升选择准确性，没有提升百分点也没有所有车型实车验收结论。（来源：chapters/W/raw/server-weekly.txt:3074–3081；比F/raw/h2-excerpt.txt:96–103的10/16测试记录更新）

本组：16 条。

## 13 原文直接冲突与证据缺口索引

- [AP15] 字段表必填 conversation_id/common_info/trace_id 和 query 枚举，而 Sample Request 缺这些字段且残留 app_id、vechile_id/vechile_type，示例未标独立更新时间。（来源：chapters/F/raw/agent-protocol.txt:88–188、320–379、449–603）
- [AP16] 字段说明称 tts_content=null 时使用 content，而进度示例称仅 content 不播报且通常由 Planner 总结后播，默认TTS路由存在文内冲突。（来源：chapters/F/raw/agent-protocol.txt:233–249、381–410）
- [AO08] 同页文字说AgentEnv环境维度唯一，DDL却把target_env注释为逗号分隔且唯一键仍含target_env，环境究竟按单值行还是字符串集合存储不能只由示意表确认。（来源：chapters/F/raw/agentserver-opt.txt:54、68–69、163–175）
- [SP17] 记忆操作描述说仅客观陈述，入参和注意又包含偏好且注意写“查询”，visual_qa入参混双引号、goal_list_update嵌套JSON与car_log入参有括号引号残缺，属于静态定义质量发现而非已证模型事故。（来源：chapters/F/raw/saic-sp-0731-tools.txt:99–104、113–118、148–153、183–188）
- [TL07] 7/31上汽SP视频只写抖音/腾讯，11/4工具提供方表写抖音及爱优腾Bili开放接口，后者较新但仍不能推出某车已支持全部视频源。（来源：chapters/F/raw/saic-sp-0731-tools.txt:64–69；tool-list.txt:5、54–58）
- [IO10] 版本记录4/24称弃用车书，但全量范围仍列车书为主线/赛力斯/上汽且需工具播报，7/31SP与11/4提供方表也保留车书，应标版本记录与实际保留条目冲突而非宣布当前车书已弃。（来源：chapters/F/raw/tools-io-excerpt.txt:5、40；saic-sp-0731-tools.txt:155–160；tool-list.txt:6）
- [IO11] 导航控制IO描述仍引用旧名route_planning_qa/search_poi_qa，版本记录却说6/3已对齐英文名，说明模板可能残留旧工具名不可直接复制为当前注册名。（来源：chapters/F/raw/tools-io-excerpt.txt:17、37）
- [EX06] 三方v1.4将user_input_scene_type的1/2/3定义为GUI/VUI/Vision，而10/27反馈方案同字段1/2/3是Audio/Guiding/Scene且另有9=Button，后者较新但应用/内部枚举不能无映射直接覆盖外部协议。（来源：chapters/F/raw/agent-protocol.txt:946–967；chapters/E/raw/user-feedback.txt:214、1096–1097）
- [EX08] 错误表把DRAFT_EXPIRED归因超过longest_time，而详细任务过期约定明确expires_at由服务端独立TTL生成且不由longest_time推导，同文无可靠更新顺序但后者约束更明确。（来源：chapters/E/raw/user-feedback.txt:1138–1142、1394）
- [GAP07] 同份平台SOP删除说明一处允许禁用关联实现后删定义、注意事项又要求无关联实现，禁用与解除关联的实际前置条件需要接口验证。（来源：chapters/F/raw/agent-sop.txt:98–102、262–267；未标两段更新时间）
- [FMT01] 带Markdown格式的动态工具原始副本把trip_plan_switch示例整段划除，而F/raw纯文本保留其文字却丢失删除线，前者保留更完整编辑语义，不能据后者判行程开关已生效。（来源：case-rewrite-20261029/async/F-dynamic.md:151–166；chapters/F/raw/dynamic-tools.txt:116–130；不是可靠日期先后差异）
- [FMT04] 当前F总图声称Redirect最多两次，但所读AgentServer仅有Redirect流程标题、三方协议与旧原文副本均无可见跳数规则且流程图文字缺失，因此这一旧页数字没有本次可核实依据。（来源：chapters/F/raw/agentserver.txt:64–69；case-rewrite-20261029/async/F-agent.md:150；destinations-base.md总图F14及差异登记）

本组：12 条。

证据与边界条目合计：**180 条**；下方冲突表是对照索引，不重复计事实数。

## 14 资料冲突、版本差异与旧页无证据断言清单

以下保留两边证据，并明确能否判断更新；“范围差异”“演进”“缺口”不冒充真正逻辑冲突。不能按文件mtime或周报物理行号判断条目时间。

| 编号 | 两边说法与来源位置 | 哪份更新／差异性质 | F 研究处理 |
|---|---|---|---|
| CF01 | v1.4必填表要求conversation_id/common_info/trace_id及query枚举；Sample Request却缺失且用app_id/vechile_id旧结构：chapters/F/raw/agent-protocol.txt:88–188、320–379、449–603 | 同文；字段表有v1.4=2026-08-13版本锚点，示例未独立标日 | 联调按字段表，旧样例不能原样照抄 |
| CF02 | tts_content=null则用content：同上:233–249；仅content进度帧注释说不播报、正常由Planner总结：381–410 | 同文；无可靠段落更新时间 | 必验实际展示/TTS/模型三路，默认值不能只凭示例定 |
| CF03 | user_input_scene_type 1/2/3=GUI/VUI/Vision：同上:946–967；反馈方案1/2/3=Audio/Guiding/Scene并有9=Button：chapters/E/raw/user-feedback.txt:214、1096–1097 | 反馈10/27较v1.4新，但属内部应用/外部协议不同层，不能直接替换 | 明确枚举映射后接入 |
| CF04 | 删除定义只须逐一禁用关联实现：chapters/F/raw/agent-sop.txt:98–102；注意事项要求无关联实现：262–267 | 同文无时间先后 | 禁用与解除关联不是一回事，需核实际删除接口前置条件 |
| CF05 | POI支持具体商家详细信息：chapters/F/raw/saic-sp-0731-tools.txt:41–46；IO表明确不支持详情：tools-io-excerpt.txt:33 | SP是7/31；IO整表有8/27版本但该行没独立更新日，不能硬判该行更晚 | 核项目实际详情能力与描述，真实错误见X-C07 |
| CF06 | 4/24记录弃用车书：chapters/F/raw/tools-io-excerpt.txt:5；同表仍保留车书三项目:40，7/31 SP与11/4清单亦有 | 后两来源较晚，且同表内部不一致 | 不宣布当前车书已弃用 |
| CF07 | 6/3版本记英文名对齐：同上:17；导航说明仍用route_planning_qa/search_poi_qa旧名：37 | 同文残留旧模板，行内版本未知 | 注册与提示词用本项目实际工具名，旧名映射不能猜 |
| CF08 | 记忆操作描述仅客观陈述，入参又含偏好，注意还写“查询”：chapters/F/raw/saic-sp-0731-tools.txt:99–104 | 7/31同快照内部语义不一致 | 作为定义质量问题登记，语义回K，不声称已造成某事故 |
| CF09 | 平台SOP说工具动态加载：chapters/F/raw/agent-sop.txt:255–260；SFT专用动态加载曾HOLD：h2-excerpt.txt:163–171，选点SFT缺说明：chapters/W/raw/server-weekly.txt:11825–11830 | 模型版本/阶段差异；HOLD条历史时间不由行号推定 | 平台动态说明、SFT版本接入、场景动态暴露分开 |
| CF10 | W-v2/full.md:229称按渠道/应用/环境选择工具仍预研；E-v2/full.md:73–95及平台SOP按已有操作讲 | 跨章归纳不一致；原文优先，不按正文版本投票 | 已有平台配置与通用标准化未完成分开讲 |
| CF11 | 工作簿座舱工具D61:J64四项均内部预研；平台权限/资源/测试地址已有8/7上线：chapters/F/raw/h2-excerpt.txt:151–162 | 产品总项与历史具体子项范围差异；不是一边必错 | 原样保留功能清单状态，具体实现另附时点 |
| CF12 | chapters/F/raw/dynamic-tools.txt:116–130保留行程开关示例；带格式F-dynamic.md:151–166整段删除线 | 格式丢失，Markdown保留更多编辑语义，非可靠日期差异 | 行程开关标已划除设计，不能作生效条件 |
| CF13 | 5/28总608、pass434、fail60、NA109、通过率86.97%：chapters/F/raw/planner-tool-accuracy.txt:7 | 同一行算术缺口，分类少5；434/(608-109)可复现86.97%，pass/(pass+fail)=87.85% | 保留原值与可能分母，5条归属未知，不改报告 |
| CF14 | 旧策略超时后Director重试：chapters/D/raw/input-mgmt-strategy.txt:495–503；7/31导航允许最多2次：chapters/F/raw/saic-sp-0731-tools.txt:53–55；IO超时勿重调：tools-io-excerpt.txt:28、37 | 旧设想、特定业务例外、执行层默认是不同版本/责任层；旧段更新日不能可靠确定 | 不自动重放副作用；按具体工具契约及原调用身份，2次不是通用次数 |
| CF15 | DRAFT_EXPIRED写超过longest_time：chapters/E/raw/user-feedback.txt:1138–1142；详细expires_at规定独立服务端TTL且不由longest_time推导：1394 | 同文无可靠更新顺序，详细状态约束更明确 | 按独立TTL解释，错误表措辞需核 |
| CF16 | REVIEW_READY可修改再review：同上:426–449；状态约束只列COLLECTING→REVIEW_READY：1441 | 同文无可靠更新先后 | 是否允许同态更新需补协议，不假设已实现 |
| CF17 | AI电台内容编排标DONE却同段称仍在联调且慢：chapters/F/raw/h2-excerpt.txt:12–19、88–95 | 同条交付层不清，无可裁定新旧 | 工程完成与端云联调/车型验收分开 |
| CF18 | 能力检查初评lite不可行：chapters/F/raw/capability.txt:94–108；9/8新单元加白后称速度基本满足：110–112 | 明确后者更新，是资源配置后的性能演进 | 不能沿用旧“lite不行”，也不能推成已上线或准确率已验证 |
| CF19 | AgentEnv环境维度唯一：chapters/F/raw/agentserver-opt.txt:54、68–69；DDL将target_env注释为逗号分隔且唯一键仍含该列：163–175 | 同文数据表示含糊，无更新时间证据 | 只采用每环境唯一生效的业务约束，不固化存储模型 |
| CF20 | 当前F总图F14写Redirect最多两次；AgentServer原文仅Redirect标题：chapters/F/raw/agentserver.txt:64–69，旧F-agent.md:150也无跳数 | 旧网页断言缺原文支撑，图像文字未取得 | 不保留为确定规则，补IDL/原图前只记录缺口 |
| CF21 | 旧页称账号/状态不满足就不出工具：chapters/F/old-page.json:59；agent_meta将visible/权限校验/动态条件分开：chapters/F/raw/dynamic-tools.txt:77–98，通讯工具仍写主驾限制：saic-sp-0731-tools.txt:21–22 | 旧页过度归纳，原文更细；未证明通用前置过滤所有状态 | 可见、可选、允许执行分层，最低温/雨天属决策约束 |
| CF22 | 根AGENTS写23工具；7/31 SP实数27；10/12标准化33明确搭载+1个goal占位；11/4有225配置/50ID：各见SP01、EX11、TL02 | 日期与分母不同，属于计数差异而非彼此冲突 | 每个数字同时说时间、范围与分母，未取得准确率-工具数曲线 |
| CF23 | 通用协议account_id选填：chapters/F/raw/agent-protocol.txt:573–587；反馈按当前账号校验并要求归属：chapters/E/raw/user-feedback.txt:1470–1478 | 通用传输和具体业务前提不同，后者10/27应用方案较晚 | 选填不代表业务可匿名访问，身份由可信上下文传递 |
| CF24 | 卡片入参card_id称要对应出参：chapters/F/raw/dynamic-tools.txt:154–163；出参只示select_button且agent_id待定：189–222 | 不完整示例造成关联协议缺口，无字段更新顺序 | 不补造取消/过期/卡ID回执字段；联调须补有效对象确认 |

共24项对照；其中CF09、CF11、CF14、CF18、CF22、CF23包含版本、层级或统计范围差异，不应在正文渲染成系统自相矛盾。

## 15 补证范围与不可伪造的缺项

- 原文补证来自W/raw/server-weekly.txt:10623–10645、11825–11830、3074–3081；chapters/W/raw/h2-biweekly.txt:1934–1941、3218–3224；chapters/C/raw/h2-biweekly.txt:608–614、2077–2082、3379–3383、7888–7910、9348–9358；chapters/C/raw/dyn-example-bug.txt:1–220；chapters/D/raw/blind-1103.txt:567–583；chapters/D/raw/eval-1102-sft.txt:176–191、286–301、342–357；chapters/D/raw/capability-product.txt:46–55、136–142；chapters/D/raw/capability-issue.txt:57–143；v-lesson-20261105/director-talk.md:340–445；chapters/W/raw/m0901w.txt:1578–1640；chapters/D/raw/input-mgmt-strategy.txt:470–512；v-lesson-20261107/raw/fake-success.txt:438–489及issues-0914.txt:11–23、38–42；均由具体段落核原文后增量保存。
- case-rewrite-20261029/async/F-protocol.md、F-agent.md、F-sop.md、F-dynamic.md及main/source-E-protocol.md完成结构/文本去重，前后协议副本仅末尾换行不同；F-dynamic删除线作为额外证据保留。compact/F-layer.md及async/F-layer.md为partial/truncated通用参考框架，既非本系统上线事实，也非行业标准，不采其“工具超过30”等为准入门槛。
- coverage-expansion/sweep-config全目录关键词命中11个Markdown（SF-67、110、167、116、113、73、189、61、201、109、168），均读相关完整段落；其中SF-201:332–336补GUI联调，SF-67:12只补排期。其余“取消会议/取消硬件选型/订单取消”“声学台架准入”与Agent请求取消/工具准入异义，排除；SF-116若干灰度30%属具体车控/拒识优化，不是全工具通用灰度。
- 本次未取得统一普通HTTP同步单JSON协议、取消ACK/时限/Executor全覆盖、全链持久幂等保证、统一Agent非零码全集、统一准入评分或最优工具上限、统一灰度比例/周期/回退SLA；不能用通用工程常识补成内部既有约定。
- 真实案例中缺少完整“流式内容混用”“取消失效副作用”“身份缺失串车/用户”“错误码不清导致重复订单”的事故链；空缺保留，设计场景单列。
