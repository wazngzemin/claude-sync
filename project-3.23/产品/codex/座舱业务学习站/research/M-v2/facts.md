# M 章事实库

研究日期：2026-11-16。仅研究、未写章节正文、未改网页/部件卡片、未启动浏览器。共 **355 条有来源的事实记录**，按指定的九个主题及车型灰度、指标观测、排期现状归组；同一机制的多源互证各保留来源，不把记录数当独立功能数。

本次按文件逐份阅读、读完即追加，最后只做归组和核对。运行设计以 `chapters/I/raw/input-tech.txt` 的现行快照为基准；产品目标、历史实现、会议观点、设计场景和上线结果分别标识。技术方案自身未闭合处照列两边，未自行裁定。会议结论来自文字记录。来源相对 `座舱业务学习站/research/`；HTML 路径相对项目根；XLSX 为用户指定下载文件。JSON 单行或复杂内容用字段路径和消息 ID 定位。

证据边界：CHAT 三份检索副本都存在截断，不得据“本地文件读完”宣称原始消息全覆盖；三份 guide JSON 是较早加工稿，已遍历全结构并阅读全文中的 M 相关页面、节点、关系和引文；多份指向同源的加工稿不构成独立互证。notes 引到但本次未具备原件的周报、内审及群聊，只记二次取证线索，不伪装本次原文核验。

| 分组 | 事实记录数 |
|---|---:|
| 一、四路输入与统一格式 | 33 |
| 二、对话三态与每条输入的位置 | 19 |
| 三、准入矩阵 | 23 |
| 四、执行重放边界与起播边界 | 15 |
| 五、本轮输入组装 | 31 |
| 六、执行身份、预跑与输出许可 | 35 |
| 七、结束路径、播放事件、超时和接管 | 52 |
| 八、演进与新旧链路 | 25 |
| 九、真实 badcase 与排查 | 47 |
| 车型与灰度 | 16 |
| 指标与观测 | 31 |
| 排期与现状 | 28 |


## 一、四路输入与统一格式

- **TECH-F001** 输入管理统一接住并发、乱序、多源输入，替代多音区缓存、Planner、主动推荐各自处理的合并、打断与等待。（来源：`chapters/I/raw/input-tech.txt:L5-38`）

- **TECH-F002** 首期覆盖有效用户 Query、主动推荐、有效 Event、同步工具反馈续轮，目标为兼容豆包 IP 与非 IP 的主线通用模块。（来源：`chapters/I/raw/input-tech.txt:L87-89`）

- **TECH-F003** 单音区、多音区和模拟 Query 为 P0，主动服务（Task Service 与静态 advice）为 P1，高优任务 P0 只预留且当前无场景。（来源：`chapters/I/raw/input-tech.txt:L101-139`）

- **TECH-F004** 首期没有独立异步工具 callback，现有同步 action_list 要收齐完整批次后由输入管理取得下一次模型调用许可。（来源：`chapters/I/raw/input-tech.txt:L141-155`）

- **TECH-F005** 播放状态、客户端接管属于控制事件而非业务输入，不进入 waiting；拒识后确需重新推理的恢复 Event 才形成新业务输入。（来源：`chapters/I/raw/input-tech.txt:L157-182,475-481`）

- **TECH-F006** 首期排除独立 UI 推送且不进播报链路的 AIGC，不启用高优任务抢占，也不设业务队列长度上限。（来源：`chapters/I/raw/input-tech.txt:L184-187`）

- **TECH-F007** 接入适配层只统一 Input 并补来源身份、优先级和合并属性，来源身份为 source_type + source_id，不做模型推理。（来源：`chapters/I/raw/input-tech.txt:L271-277`）

- **TECH-F008** 用户输入复用非空 request_id，Task Service 复用 task_run_id，未来云端异步反馈复用 tool_call_id，简单车控异步结果复用原 request_id，输入管理不另造 Input ID。（来源：`chapters/I/raw/input-tech.txt:L521,706-707`）

- **TECH-F009** request_id 当前非强制且 RTC 等链路未携带，因此缺非空身份的渠道继续旧链路，不能以空 ID 进入新链路。（来源：`chapters/I/raw/input-tech.txt:L521`）

- **TECH-F010** 映射固定为 Query=P0/mergeable、主动消息=P1/mergeable、工具反馈=P1/isolated、有效 Event=P1/mergeable，不由模型临时选属性。（来源：`chapters/I/raw/input-tech.txt:L443-473,522`）

- **TECH-F011** 每个 Task Run 独立入队且相同 task_run_id 回流只命中幂等，静态 advice 不用 advisor 类型或空 task_run_id 判重。（来源：`chapters/I/raw/input-tech.txt:L139,523`）

- **TECH-F012** 主动服务完整内容和来源关联应先交适配层，再清理旧推荐缓存。（来源：`chapters/I/raw/input-tech.txt:L139`）

- **TECH-F013** 已结束 Input 在 runtime Key 过期前仍保留去重记录，业务输入不单独设置 TTL。（来源：`chapters/I/raw/input-tech.txt:L743,755`）

- PRD-F001｜主题 1｜只有一个豆包且同一时刻只能对一个人讲话，上次操作后的车况会成为下一请求的环境上下文。（来源：`chapters/I/raw/input-prd.txt:79-87`）

- PRD-F003｜主题 1｜四类有效输入是用户输入、工具反馈、建议与事件，有效话打断信息随 last_talk_content 传入，无效话打断的恢复信息作为独立 event。（来源：`chapters/I/raw/input-prd.txt:91-95,165-169`）

- PRD-F014｜主题 1｜历史曾允许车控和记忆工具反馈合并，与现行卡片 13 的工具反馈单独处理有版本差异。（来源：`chapters/I/raw/input-prd.txt:568-569`；`component-cards.md` 卡片 13）

- PRD-F020｜主题 1｜历史排除生图、AI light 等独立界面 push 且无语音的任务，它们无需进入 Planner。（来源：`chapters/I/raw/input-prd.txt:519-521`）

- PRD-F028｜主题 1｜Planner 的触发输入明确列用户、建议、工具反馈、事件，输入项示例分别带说话人/音区/时间、advisor、tool_name、event 时间等来源属性。（来源：`chapters/I/raw/director-prd.txt:148-162,186-196`）

- PRD-F052｜主题 1｜语音链路 request_id 标识一次端云请求，round_id 在同一 request_id 内随多次预请求及正式请求递增，不能与输入管理执行身份混称。（来源：`chapters/I/raw/voice-onepager.txt:82-96`）

- PRD-F063｜主题 1｜接入要求用户非空 request_id，原 CoordinationInfo 校验未强制且 RTC 曾不带此字段，这类渠道保持旧链路而非用空 ID 进入新状态。（来源：`lecture-rewrite-20261029/source-补查-input-management.md:251-252,346-349`）

- PRD-F069｜主题 1｜该整理用 source_type+source_id 去重、每个 TaskRun 独立输入且重复 task_run_id 不新增等待项，不引入业务 TTL，任务 DeadlineAt 仍属 Task Service。（来源：`lecture-rewrite-20261029/source-补查-input-management.md:251-259`）

- PRD-F088｜主题 1｜M 页面旧整理已要求非空 request_id，并将用户/建议/事件/同步完整工具批次纳首期，独立 callback 与持久结果回流列后续扩展。（来源：`guide-rewrite-20261030/input-main.json` JSON Pointer `/pages/2/teaching/intro/2`、`/pages/2/sections/0/paragraphs/0`、`/modules/2/nodes/0`）

- MT-F022【1 统一输入】10 月 19 日主交互宣讲把手点卡片描述成模拟 query 送 Planner，需与较新输入技术方案的 event / 来源保留规则并列核对。（来源：chapters/I/raw/m1019.txt:158-159、200-201）

- MT-F031【1 统一输入】VGUI 手动卡片操作需同步 Planner 上下文，否则模型不知道操作已发生；建议控件直接接底层原子信号减少同步问题。（来源：chapters/I/raw/m1019.txt:200-201、230-231）

- MT-F037【1 统一输入】长时任务推进在动态 Advisor 中完成，它只给 Director 建议，后者推理并调动作、复用主交互卡，不由 Advisor 自建一套弹窗链。（来源：chapters/I/raw/m1020.txt:724-849）

- MT-F066【1 统一输入】SOP 多人语音对话要求任一人唤醒后其他音区无需再唤醒、支持四音区同时交互，输入管理需保存音区/来源而不是扩为四个 Planner。（来源：AI汽车SOP功能清单 (1).xlsx，【子功能】输入触发管理!D13:J13）

- CHAT-F001｜统一输入｜该方案围绕 query 和主动服务的生命周期定义加载、展示与退出，尚非统一输入调度方案。（来源：chapters/I/raw/aiva-vui-1104.txt:50–60）

- CHAT-F012｜统一输入｜Planner 工具卡片手点直接执行并上报事件，静态 Advisor 卡片手点仍模拟 query，系统通知卡片手点直接执行并上报事件，两条点击路径并存。（来源：chapters/I/raw/aiva-vui-1104.txt:482–487）

- CHAT-F015｜统一输入｜静态 Advisor 由触发器按等级送 Director 或 AIbar，规则主动服务可直接端侧出卡、不经 Director。（来源：chapters/I/raw/aiva-vui-1104.txt:558–561）

- CHAT-F016｜统一输入｜三方通知卡片排队播 TTS，低延迟业务走端侧可见即可说，需要泛化则上报卡片按钮并注册动态选择工具。（来源：chapters/I/raw/aiva-vui-1104.txt:584–601）

- CHAT-F054｜统一输入｜任务建议和静态 Advisor 建议均走 advice 但来源不同，前者保持 Task/Run 归属，后者维护顾问服务目标，不能因类型相同而混为用户已确认命令。（来源：guide-rewrite-20261030/input-async.json，$.pages[3].sections[2].paragraphs[0–1]、$.modules[5].nodes[5].detail）

- CHAT-F056｜统一输入｜Agent 协议用 chat_id/question_id/conversation_id/agent_id/trace_id 关联流式回包、末帧必须 is_finish=true，但协议终包不表示车辆动作或用户目标已完成。（来源：guide-rewrite-20261030/input-async.json，$.modules[2].nodes[8].detail；不能把协议字段直接等同输入管理执行身份）

- CHAT-F061｜统一输入｜早期事件整理区分成为 Context 背景、插入历史、生成记忆、业务订阅和特定 event 触发新轮五种用途，普通事件保存不自动唤起 Planner。（来源：guide-rewrite-20261030/input-support.json，$.pages[5].sections[3].paragraphs[0–4]、$.pages[5].flows[1]）


## 二、对话三态与每条输入的位置

- **TECH-F014** Chat 是使用现有 chat_id 的连续对话，状态共享范围为 channel + vehicle_id + chat_id，原文没有规定每辆车永远只有一个 Chat。（来源：`chapters/I/raw/input-tech.txt:L263-265,751`）

- **TECH-F015** 单输入位置为 RECEIVED 正在准入、WAITING 等待、PROCESSING 处理、FINISHED 结束；整段对话状态为 IDLE 空闲、PROCESSING 未出首段展示文字、RESPONDING 已输出或仍在播报。（来源：`chapters/I/raw/input-tech.txt:L279-285,369-384`）

- **TECH-F016** 首段可展示文本是已经通过身份校验且可交给用户的文本，不包括思维过程、中间状态和工具调用。（来源：`chapters/I/raw/input-tech.txt:L299-301`）

- **TECH-F017** Input 与 Chat 各保留自己的状态字段，不再增加第三套执行阶段字段。（来源：`chapters/I/raw/input-tech.txt:L705`）

- **TECH-F018** 结束原因至少区分正常完成、合入新执行、客户端接管、重复输入、执行失败、实例失联且不可重放、人工清理。（来源：`chapters/I/raw/input-tech.txt:L708`）

- **TECH-F019** 前序输出播放期间下一候选可预跑，Chat 仍处 RESPONDING，不能把计算开始当作前序播放失效。（来源：`chapters/I/raw/input-tech.txt:L577-584`）

- PRD-F061｜主题 2｜旧定义以“用户首 token”分 PROCESSING 与 RESPONDING，而较新段落又说不能只看两种忙态，要看模型完成和启播，文件内部有演进痕迹。（来源：`lecture-rewrite-20261029/source-补查-input-management.md:120-123,176-189,296-301`）

- PRD-F071｜主题 2｜旧存储按一 Chat 两个 Key：runtime HASH 保存输入/执行/工具事实，waiting LIST 按到达顺序存身份；mergeable 与 isolated 是同一列表出队策略。（来源：`lecture-rewrite-20261029/source-补查-input-management.md:370-390`）

- MT-F016【2 状态】主交互状态机在用户侧区分禁用、静默、全时聆听和激活后的强聆听、拒识、思考/工具调用、播报、延时聆听，不能与输入管理三态混为一套。（来源：chapters/I/raw/m1019.txt:71-81）

- MT-F017【2 状态】Planner 边思考边输出且可一边说话一边调工具，因此界面思考和执行区间可能重叠。（来源：chapters/I/raw/m1019.txt:74-78）

- MT-F023【2 状态】端侧模型从前置分流改为兜底后，主交互只应由实际采纳的端云仲裁结果驱动，未采用本地结果不应抢先变状态。（来源：chapters/I/raw/m1019.txt:80-81）

- MT-F036【2 状态】上汽音频焦点拟由主驾改整车以保证头枕模式下媒体降音，豆包 TTS 仍整车发声，语音交互结束后媒体恢复。（来源：chapters/I/raw/m1020.txt:173-174）

- MT-F071【2 状态】SOP 子表允许设置连续对话时长，与 10 月 19 日主交互宣讲固定 30 秒不可自定义并存，清单缺逐项更新时间需保留范围差异。（来源：AI汽车SOP功能清单 (1).xlsx，【子功能】输入触发管理!D12:J12；【子功能】账号、记忆与任务底座!C15:J15；chapters/I/raw/m1019.txt:116-123）

- CHAT-F002｜状态｜端侧主交互分静默/全时、聆听、介入判断、思考、工具调用、播报、延时聆听，职责不同于云端空闲/处理中/输出中。（来源：chapters/I/raw/aiva-vui-1104.txt:76–80、998–1084）

- CHAT-F010｜状态｜详细定义规定延时聆听默认 30 秒且不可自定义，结果未返回和 TTS 中暂停计时，末尾说话延长到 VAD 结束。（来源：chapters/I/raw/aiva-vui-1104.txt:454–473）

- CHAT-F011｜状态｜免唤醒关闭的概述残留默认 60 秒，后部详细定义和附录为 30 秒，文件内冲突应优先详细定义但不证明所有车型现网一致。（来源：chapters/I/raw/aiva-vui-1104.txt:167–171 对 454–469、1082–1084）

- CHAT-F022｜状态｜HAI 的 P0 安全警示/P1 语音状态不等于输入管理的用户 P0/建议 P1，优先级编号应附模块范围。（来源：chapters/I/raw/aiva-vui-1104.txt:836–866）

- CHAT-F053｜状态｜consumed 表示建议进入 Planner、done 同步端侧完成/关闭显示，关闭 Extour 目标需要独立接口，播放完成也不承担关闭 Task Run 的业务语义。（来源：guide-rewrite-20261030/input-async.json，$.modules[3].nodes[11].detail、nodes[13].detail）

- **PAGE-F003** 【2. 对话状态与输入位置】当前正文开篇与三分钟稿说同一时刻只有一次推理算数是概要，新方案精确定义允许一个有效候选与一个未撤销正式输出分别引用不同执行，不能讲成全 Chat 仅容一个有效 ID。（来源：`HTML/01-进行中/豆包汽车-业务学习站-v63.html:L269，M.v34.intro / m-retell；chapters/I/raw/input-tech.txt:L531-535`）


## 三、准入矩阵

- **TECH-F020** 空闲时 P0、mergeable P1 立即执行，isolated P1 立即单独执行。（来源：`chapters/I/raw/input-tech.txt:L408-414`）

- **TECH-F021** 处理中遇 P0 时，可重放旧输入则撤销旧执行并合并重推，越过工具边界则只执行新 Query，旧输入作中断上下文。（来源：`chapters/I/raw/input-tech.txt:L416-423`）

- **TECH-F022** 输出中遇 P0 时客户端先停播，新执行只执行新 Query，旧输入与已播未播内容作中断上下文。（来源：`chapters/I/raw/input-tech.txt:L425-431`）

- **TECH-F023** 准入表规定处理中和输出中的 P1 都排队，mergeable/isolated 只决定出队后合批或独立，不能赋予抢占权。（来源：`chapters/I/raw/input-tech.txt:L421-432`）

- **TECH-F024** 【内部冲突 C01】范围表让未完成且未起播的 Event 参与合并重推，准入表让忙时所有 P1 排队，消费规则又让有效新 Input 废弃未发布候选并合算，三处尚无统一解释。（来源：`chapters/I/raw/input-tech.txt:L163,421-432,967`）

- **TECH-F025** 【内部冲突 C02】范围表按模型未完成允许合并旧输入，准入表及 S2 在 RESPONDING 只执行新 Query，旧输入作上下文，两种边界不能视作同一句规则。（来源：`chapters/I/raw/input-tech.txt:L107,427,546`）

- **TECH-F026** 全部等待项共用一条按到达顺序的 LIST，出队时 mergeable 合批、isolated 单独；主动服务当前等待项一起合并推理。（来源：`chapters/I/raw/input-tech.txt:L524,749-753`）

- **TECH-F027** 输入管理首期无业务 TTL，TaskRun 的 DeadlineAt 仍由 Task Service 负责，不能将排队超时自行等同提醒失效。（来源：`chapters/I/raw/input-tech.txt:L527`）

- PRD-F004｜主题 3｜主文规定无推理无播报就新推理，未完整输出且尚未起播就合并重推，其中“未完整输出”隐含尚未调用工具。（来源：`chapters/I/raw/input-prd.txt:104-111`）

- PRD-F005｜主题 3｜主文对罕见“未完整输出但已起播”仍允许用户或尚不存在的高优任务打断并合并旧输入，其他输入排队。（来源：`chapters/I/raw/input-prd.txt:112-120,205-235`；需与现行技术方案核对）

- PRD-F013｜主题 3｜历史 P1 策略首 token 未出可合并、已出则排队，长程任务反馈因独立界面交互不参与合并。（来源：`chapters/I/raw/input-prd.txt:506-521`）

- PRD-F015｜主题 3｜历史要求同一 Advisor 排队期间仅保留最新 advice，超过有效期丢弃并通知 Advisor。（来源：`chapters/I/raw/input-prd.txt:589-604`；历史段）

- PRD-F025｜主题 3｜多人 PRD 执行中按任务类型区分：新控制需播报则打断后恢复、不需播报则提示音，文本打断文本，控制之后的文本排队并展示排队信息。（来源：`chapters/I/raw/multi-prd.txt:9-17`；2026-08-24 设计，不覆盖新矩阵）

- PRD-F026｜主题 3｜处理中的有效请求遇到拒识指令不得被取消，单人和多人均继续原请求正常执行与结果下发。（来源：`chapters/I/raw/multi-prd.txt:121-125`）

- PRD-F062｜主题 3｜旧矩阵让 P1 在 PROCESSING 和 RESPONDING 均排队不抢占，但同文件范围和状态章节又允许未完整未起播时的 mergeable P1 合并，存在内部冲突。（来源：`lecture-rewrite-20261029/source-补查-input-management.md:54-57,194-207,296-297`）

- PRD-F091｜主题 3｜同一 input-main 内 M5 仍写同 Advisor 只留最新、过期丢弃并通知，而 M 页面又写每条任务运行独立保留、无通用 TTL，是二次整理未清理干净的旧新混杂。（来源：`guide-rewrite-20261030/input-main.json:5540-5570`，`/modules/2/nodes/4/paragraphs/0` 与 `/pages/2/sections/0/paragraphs/1,4,5`；以 input-tech 现行版为准）

- MT-F018【3 准入】10 月 19 日宣讲仍以第二句拒识通过时第一句是否已出首 token 决定合并或打断，这是早期讲法而非现行技术方案的完整重放边界。（来源：chapters/I/raw/m1019.txt:89-90）

- MT-F020【3 准入】主动服务低于 query，需排队等用户 query 处理完；未激活时主动服务也应拉起全车音区进入播报并支持二次交互。（来源：chapters/I/raw/m1019.txt:158-159）

- MT-F067【3 准入】SOP 对话节奏管理描述明确覆盖多人插队、多任务反馈合并与异常兜底，但未把它们分别列成独立二级功能行。（来源：AI汽车SOP功能清单 (1).xlsx，全量功能清单!B5:J5；【子功能】输入触发管理!B12:J15）

- CHAT-F005｜准入矩阵｜旧主交互规则仍以首 token 为界，之前第二条有效指令合并，之后第二条打断并丢弃第一条。（来源：chapters/I/raw/aiva-vui-1104.txt:291–293；不能覆盖 input-tech 现行规则）

- CHAT-F013｜准入矩阵｜旧主动服务规则写全部 advice 同级且低于 query、排队无丢弃，并写首 token 前取消当前任务与 advice 合并、首 token 后等待输出完整。（来源：chapters/I/raw/aiva-vui-1104.txt:563–574；与 input-tech 现行版对照）

- CHAT-F065｜准入矩阵｜该整理要求普通 event/advice 不抢正在播放的用户答复，并再次强调无首文字也不意味着旧工具可以合并重放。（来源：guide-rewrite-20261030/input-support.json，$.pages[5].sections[4].paragraphs[3]；早期整理）

- **PAGE-F002** 【3. 准入矩阵】当前原始 12 节点图 M8 仍写同 Advisor 仅留最新和 advice 有效期，但当前正文 m-plan-evo 已将其标成历史“先不看”，图文版本存在残留冲突。（来源：`HTML/01-进行中/豆包汽车-业务学习站-v63.html:L269，$.base.modules[id=M].nodes[id=M8] 对 $.pages[id=M].v34.sections[id=m-plan-evo]；input-tech.txt:L523-527`）


## 四、执行重放边界与起播边界

- **TECH-F028** 首 token 前也可能已经调用工具，因此安全重放边界为新业务 Tool call 被放行，不能只看是否已经说话。（来源：`chapters/I/raw/input-tech.txt:L391-397`）

- **TECH-F029** 技术方案明确把禁止重放作为对产品目标新增的工程约束，目的为防止车控、下单等重复副作用。（来源：`chapters/I/raw/input-tech.txt:L393`）

- **TECH-F030** 新执行初始可重放，工具下发前原子校验许可和身份、登记 tool_call_id、标记不可重放，再真正调用工具，重试复用同一个调用身份。（来源：`chapters/I/raw/input-tech.txt:L394-397,534`）

- **TECH-F031** 旧输入不可重放后仍可被新用户输入打断，但仅作为中断上下文，不能重新塞回可执行数组。（来源：`chapters/I/raw/input-tech.txt:L526,543-546`）

- **TECH-F032** 撤销执行不会回滚已经发生的工具副作用，新反悔动作由 Planner 决定是否另发工具，前后真实反馈都保留。（来源：`chapters/I/raw/input-tech.txt:L528,562-569`）

- **TECH-F033** 临时语音造成的可恢复暂停、有效 P0 造成的永久停止和工具是否可重放是三种不同判断。（来源：`chapters/I/raw/input-tech.txt:L190-192,961`）

- PRD-F006｜主题 4｜主文对已完整输出但未起播按可能已下发工具处理，用户插话只携带旧输出中断信息，并注明动作已下发、仅播报。（来源：`chapters/I/raw/input-prd.txt:121-128,311-345`）

- PRD-F012｜主题 4｜历史以首 token 为合并/打断边界，主文改为完整输出和 TTS 起播双判断。（来源：`chapters/I/raw/input-prd.txt:104-128,460-464`）

- PRD-F021｜主题 4｜多人 PRD 以 FC/工具尚未下发作为同时说合并条件，FC 已输出但任务或播报未完视为执行中。（来源：`chapters/I/raw/multi-prd.txt:5-16,70-73`）

- PRD-F054｜主题 4｜11 月 9 日 OnePager 仍把多音区合并写为前请求未出“任何有效信息”时取消并合并，没有界定是否已放行工具，术语不如现行 input-tech 精确。（来源：`chapters/I/raw/voice-onepager.txt:130-134`）

- PRD-F064｜主题 4｜旧技术整理已经要求新工具调用前先原子核对执行身份并标不可重放，再调用 Tool，重试沿用 tool_call_id；未出首 token 也可能早已放行工具。（来源：`lecture-rewrite-20261029/source-补查-input-management.md:184-189,263-267`）

- PRD-F089｜主题 4｜M4 明确工具放行同一原子操作校验 OutputPermit、CommittedOutputExecutionID 和未撤销，登记 tool_call_id 后不可重放，重试复用原调用身份。（来源：`guide-rewrite-20261030/input-main.json:5507-5538`，`/modules/2/nodes/3`）

- CHAT-F046｜执行重放边界｜早期 I 页把“语音尚未起声”与“工具尚未放行”拆开，后者一旦发生则旧输入只保留中断上下文，不得合并重发动作。（来源：guide-rewrite-20261030/input-async.json，$.pages[0].sections[0].paragraphs[1]、$.modules[0].nodes[0].detail）

- CHAT-F060｜执行重放边界｜该整理 I13 节点正文写“未发工具且未开始输出可合并”，边 I13→I8 仍写“首 token 前合并”，与 M 技术方案放宽边界必须分版本保留。（来源：guide-rewrite-20261030/input-async.json，$.modules[0].nodes[0].detail、$.modules[0].edges[1]；早期整理有残留旧边界）

- CHAT-F067｜执行重放边界｜车辆上电拉取有效任务只恢复任务岛显示，旧新闻/车控不得因重新渲染列表重放，显示恢复和后台生命周期恢复分开。（来源：guide-rewrite-20261030/input-support.json，$.pages[4].sections[4].paragraphs[0–3]、$.modules[4].nodes[13].detail）


## 五、本轮输入组装

- **TECH-F034** 每次推理使用结构化数组保留 query、speaker_name、speaker_position、原时间、advisor、Event、工具反馈各自来源，不覆盖为无身份字符串。（来源：`chapters/I/raw/input-tech.txt:L713-725`）

- **TECH-F035** 取得模型许可后刷新环境上下文，但不刷新每条输入的原始时间，中断上下文通过 last_talk_content 接旧回复且不带内部思维。（来源：`chapters/I/raw/input-tech.txt:L713`）

- **TECH-F036** 设计示例把主驾“找附近的充电站”、副驾“要快充”和 advisor 低续航建议作为三条有来源的内容。（来源：`chapters/I/raw/input-tech.txt:L715-719`）

- **TECH-F037** 工具后续轮被补话时待重推的是本轮反馈、新用户和 waiting，第一轮查询与已执行动作留在历史或效果事实中，tool_feedback 字段仅为逻辑示意。（来源：`chapters/I/raw/input-tech.txt:L720-725`）

- **TECH-F038** 正式 timestamp 按来源使用 RFC3339，示例里的说明文本不能当成真实测试时间。（来源：`chapters/I/raw/input-tech.txt:L720`）

- **TECH-F039** 中断上下文保存原输入、已播文本、未播文本、播放位置和原执行身份，只随新 Query 交给 Planner且不独立排队。（来源：`chapters/I/raw/input-tech.txt:L323-325,684-689`）

- **TECH-F040** 旧多音区每音区单独上行，先补说话人并保留现有意图改写，再把 QueryList 转为 UserContents 和 AdvisorContents 的结构化数组。（来源：`chapters/I/raw/input-tech.txt:L819-825`）

- **TECH-F041** 旧缓存异常兜底 TTL 为 1 分钟、Query 只留最近 4 条、Advisor 后到覆盖、每 100ms 轮询，分组受输出与锁影响而非明确说话时间窗。（来源：`chapters/I/raw/input-tech.txt:L822-828`）

- **TECH-F042** 旧逻辑首个 Planner item 前 Query 或 Advisor 可触发打断，之后只有 Query 可触发，该 item 不一定是用户可见文本且 log_id 只滤重发。（来源：`chapters/I/raw/input-tech.txt:L824-828`）

- **TECH-F043** 旧执行用 CAD 只删除自己读过的缓存版本，MergeSoundZoneQuery 不是完整 QueryList，不能凭此历史字段还原全部多音区原话。（来源：`chapters/I/raw/input-tech.txt:L826`）

- **TECH-F044** 新链路每音区先独立准入再组装，多音区模块不再决定等待或打断，log_id 只追踪，数量限制不能静默删除已准入输入。（来源：`chapters/I/raw/input-tech.txt:L840-847`）

- PRD-F007｜主题 5｜单用户、单建议及混合输入均以数组传入，用户项保留 query、speaker_name、speaker_position、timestamp，建议项保留 advisor 身份与内容。（来源：`chapters/I/raw/input-prd.txt:129-145`）

- PRD-F008｜主题 5｜主文要求用户打断时带已排队任务一起推理，多个排队建议在下一窗口合并。（来源：`chapters/I/raw/input-prd.txt:237-265,298-309,330-372`）

- PRD-F022｜主题 5｜多人 PRD 只合并未被拒识的有效指令，以音区角色标注来源，暂定最多 4 个合并且不先做简单/复杂任务仲裁。（来源：`chapters/I/raw/multi-prd.txt:73-79`）

- PRD-F023｜主题 5｜多人 PRD 的角色标注只说明来源，不默认主驾优先，明确安全规则除外，冲突指令倾向澄清；该段标期望体验、由 Planner 另行定义。（来源：`chapters/I/raw/multi-prd.txt:80-83`）

- PRD-F024｜主题 5｜多人 PRD 使用“主驾驶说 X、副驾驶说 Y”文本拼接，而较新的 input-prd 使用来源分项数组，是输入结构演进差异。（来源：`chapters/I/raw/multi-prd.txt:75-76`；`chapters/I/raw/input-prd.txt:129-145`）

- PRD-F030｜主题 5｜有效新话附 last_talk_content，无效新话触发独立中断 event，二者均要区分旧话已说与未说部分。（来源：`chapters/I/raw/director-prd.txt:237-245`）

- PRD-F031｜主题 5｜Planner 决定剩余内容是否值得恢复：仅余 1–3 个无关字或用户不想听则跳过，相关新问题融为完整回答，剩余≥3 句提炼核心，并按需称呼原说话人。（来源：`chapters/I/raw/director-prd.txt:246-251`）

- PRD-F041｜主题 5｜旧 formatContentMessage 已把多音区、advisor 和 event 包为结构化数组，并带 last_talk_content、说话人、音区和时间戳。（来源：`chapters/I/raw/planner-onepage.txt:110-114,277-279`）

- PRD-F046｜主题 5｜旧历史组装重建用户、assistant 与工具反馈时序，按真实时间稳定排序，近 10 分钟最多并入 3 条白名单事件。（来源：`chapters/I/raw/planner-onepage.txt:104-108,277-279`）

- PRD-F058｜主题 5｜TTS 多情绪文本按情绪分段合成并保证下发顺序，tts_audio_id 是音频流标识而不是工具或执行身份。（来源：`chapters/I/raw/voice-onepager.txt:146-164,358-378`）

- PRD-F066｜主题 5｜中断上下文保留旧输入、已播/未播及原执行身份，只随新 query 进入 Planner，不独立排队、不重新触发旧工具，也不带内部思维过程。（来源：`lecture-rewrite-20261029/source-补查-input-management.md:142-145,257,355-368`）

- MT-F019【5 组装】多人合并时取消前请求，把两句 query 一起送入重新推理，并要求两句 ASR 同时上屏。（来源：chapters/I/raw/m1019.txt:89-90）

- MT-F030【5 组装】前后排无关任务应分别出卡和保持，相关话题或音区合并才联动刷新；这是显示关联规则，不等于每个音区各有独立 Planner 流。（来源：chapters/I/raw/m1019.txt:212-216）

- CHAT-F004｜本轮组装｜默认拉起全车四音区，多音区合并后的 HMI 以较后音区展示，四音区共用左右两个 ASR 胶囊。（来源：chapters/I/raw/aiva-vui-1104.txt:255–260、282–286）

- CHAT-F006｜本轮组装｜跨音区合并时同侧 ASR 替换、跨侧并存，但上屏分区不等于多条独立交互流。（来源：chapters/I/raw/aiva-vui-1104.txt:299–307；后半为职责解释）

- CHAT-F018｜本轮组装｜多屏各自展示 ASR、工具、打断及保持，语义接续和音区合并可联动刷新，显示独立不等于任务独立。（来源：chapters/I/raw/aiva-vui-1104.txt:722–735、780–790；最后半句为职责解释）

- CHAT-F047｜本轮组装｜早期 I 节点明确旧工具已在途时新输入可以继续承接，而首期方案需收齐同批结果后再安排 feedback 续轮。（来源：guide-rewrite-20261030/input-async.json，$.modules[0].nodes[2].detail；整理标注首期）

- CHAT-F048｜本轮组装｜早期 I 节点把最终拒识后的恢复事件与有效新 query 分路，前者不把旁人闲聊变用户任务，后者保留自身说话人与音区并携旧话进度。（来源：guide-rewrite-20261030/input-async.json，$.modules[0].nodes[10].detail、nodes[12].detail、nodes[13].detail）

- CHAT-F069｜本轮组装｜事件发生时间、写入时间、规则匹配时间不同，晚到旧事件应保留真实顺序而非覆盖当前状态，网络重报与用户再次操作也不能仅凭内容相同判为同一件事。（来源：guide-rewrite-20261030/input-support.json，$.pages[6].sections[0].paragraphs[1]、$.pages[6].sections[3].paragraphs[0–1]）

- **PAGE-F006** 【5. 本轮输入组装】旧字段中最近5轮混合输入、摘要22轮500token、30分钟10轮与最近5话题是历史与上下文内容，不能当输入队列长度、去重窗口或播放超时参数。（来源：`chapters/M/old-page.json:$.sections[0].paragraphs[1-2]、$.sections[3].paragraphs[1,8]；chapters/M/notes.md:L164`）


## 六、执行身份、预跑与输出许可

- **TECH-F045** 每次新推理、反馈续轮、打断重算都取全局唯一 DirectorExecutionID，TaskRoundID 与之同值，同候选预跑转发布或同次重传复用 ID。（来源：`chapters/I/raw/input-tech.txt:L287-313,388`）

- **TECH-F046** 发号复用现有 GenTID 并序列化为十进制字符串，ID 只比相等不比大小、不递增计算，失败或 0 不得启动且不回退时间戳。（来源：`chapters/I/raw/input-tech.txt:L388,589-604`）

- **TECH-F047** 每 Chat 同时最多一个有效候选和一个未撤销正式输出，ActiveComputeExecutionID 与 CommittedOutputExecutionID 可指向不同执行。（来源：`chapters/I/raw/input-tech.txt:L531-536`）

- **TECH-F048** 发号不是执行授权，只有来源幂等、失效旧候选、切换新候选和依赖登记原子成功后才能启动，提交结果未知时先查询。（来源：`chapters/I/raw/input-tech.txt:L600-604`）

- **TECH-F049** 候选按 ActiveComputeExecutionID 校验，文本/TTS/新工具/已交付派生历史按 OutputPermit 与正式输出身份校验，不能只凭最新候选否定旧播放。（来源：`chapters/I/raw/input-tech.txt:L532-535,774-796`）

- **TECH-F050** 首段输出发布时同时确认候选、许可、前序依赖与正式输出切换，预跑阶段不登记或下发新播放对象，无音频记 NO_AUDIO。（来源：`chapters/I/raw/input-tech.txt:L533,605`）

- **TECH-F051** 单执行文本分段、多个 TTS Provider 和工具直返音频共用 TaskRoundID，前序播放依赖用 WaitForTaskRoundID 显式指向，不能取 ID 减一或最近轮。（来源：`chapters/I/raw/input-tech.txt:L605-606`）

- **TECH-F052** 失效执行的新文本、新 TTS、新工具与派生历史被拦，Go Context cancel 只加快退出，真实已受理工具反馈不被身份拦截。（来源：`chapters/I/raw/input-tech.txt:L535-536`）

- **TECH-F053** 完整工具批次可提前取得 ComputePermit 预跑续轮，正式输出等前序播放门解除，预跑候选无权调用新业务工具。（来源：`chapters/I/raw/input-tech.txt:L561,966-968`）

- **TECH-F054** 未发布候选结束只转 READY，不结束前序输出，其 talk_content 不能记成用户已听历史。（来源：`chapters/I/raw/input-tech.txt:L790,966-968`）

- **TECH-F055** 每 Chat 主体为 runtime HASH 与 waiting LIST 两个同 scope Key，共享 Redis 原子迁移，空闲且 waiting 空才整体过期，lease 不是业务有效期。（来源：`chapters/I/raw/input-tech.txt:L727-757`）

- **TECH-F056** owner 定期续租，失联只触发恢复检查；可重放才用新 ID 重跑，不可重放则结束并等工具反馈或新 Query，不新增 MySQL 业务表。（来源：`chapters/I/raw/input-tech.txt:L809-817`）

- **TECH-F092** 【6. 执行身份与输出许可】原文允许首文本前或纯工具执行，却只在首段文本放行路径明确切换 CommittedOutputExecutionID，工具出口又要求匹配此正式输出身份，纯工具怎样先取得身份与许可尚缺说明。（来源：`chapters/I/raw/input-tech.txt:L391-397,774-784`；研究识别的设计缺口，不自行补造实现）

- PRD-F009｜主题 6｜允许工具异步反馈后，交互卡出现时机应由“工具输出被 Planner 处理”控制，不再由工具自身决定。（来源：`chapters/I/raw/input-prd.txt:147-148`）

- PRD-F029｜主题 6｜Planner 交出 talk_or_not、talk_content、emoji_id 与 action_list，工具执行结果回传后再次推理，不等于输入管理自行生成回复。（来源：`chapters/I/raw/director-prd.txt:163-174,208-214`）

- PRD-F032｜主题 6｜下游工具没有自主播报权，同轮多个工具反馈全部返回后由 Planner 统一推理播报，不是一个工具回来就播一次。（来源：`chapters/I/raw/director-prd.txt:591-593`；与异步反馈新方案需划清范围）

- PRD-F033｜主题 6｜同轮 action_list 工具会同时下发，因此彼此有先后依赖的动作应分轮；首轮话术不能预先承诺未取得的工具结果。（来源：`chapters/I/raw/director-prd.txt:266-272,595-604`）

- PRD-F040｜主题 6｜旧实现每个 action 以 UUID 重写 ActionID，并建立 tool_call_id→task_id 映射，模型输出写 planner_histories、工具任务与结果写 planner_task_list。（来源：`chapters/I/raw/planner-onepage.txt:140-152,305-307`）

- PRD-F044｜主题 6｜旧工具执行合并本轮 observation 回灌 LLM，命中 ReturnDirectlyTools 则直接结束图；图 END 只代表图收口，不等于客户端播完。（来源：`chapters/I/raw/planner-onepage.txt:48-87,140-144`）

- PRD-F053｜主题 6｜Soft VAD 300 ms 的预请求只抢跑拒识和 Context 等无状态前置任务、不入正式历史，Hard VAD 600 ms 后正式请求只在 request_id 相同且 query 完全一致时复用。（来源：`chapters/I/raw/voice-onepager.txt:45-57,98-120,232-235,351-356`；需区别新输入管理预跑）

- PRD-F059｜主题 6｜端侧可见即可说或简单车控命中后直接执行并把 Query、Answer、Observation 经 context/sync 回写，输入管理接管应保留实际结果事实。（来源：`chapters/I/raw/voice-onepager.txt:238-239`）

- PRD-F060｜主题 6｜较早整理以同一 Chat 每次启动递增的 int64 DirectorExecutionVersion 识别执行，与现行全局唯一执行身份不同，不能把递增序号继续当唯一凭证。（来源：`lecture-rewrite-20261029/source-补查-input-management.md:122-137,181-188,323-352`）

- PRD-F065｜主题 6｜旧执行失效拦新文字、新 TTS、新工具和派生落库，但不丢已被工具接受的真实反馈，Go Context cancel 只加快退出不替代出口校验。（来源：`lecture-rewrite-20261029/source-补查-input-management.md:259-267`）

- PRD-F067｜主题 6｜首期继续同步工具、同模型轮结果收成完整批次再准入续轮，独立异步 callback/持久回流在该整理中写“当前不存在”，但其后多处又保留异步入队旧文字，需以现行版裁定。（来源：`lecture-rewrite-20261029/source-补查-input-management.md:46-53,66-69,103-104,256,284-287`）

- PRD-F081｜主题 6｜该整理后加预跑章节允许完整工具批次先获 ComputePermit，播放终态后释放同一 RUNNING/READY 候选而不再调模型；新有效输入使未发布候选 STALE 后重算。（来源：`lecture-rewrite-20261029/source-补查-input-management.md:546-549`；与前面的单递增执行说明不可混读）

- PRD-F090｜主题 6｜M9 已使用 DirectorExecutionID、ActiveComputeExecutionID、CommittedOutputExecutionID，首次/续轮/重算/恢复新 ID，同次重传和预跑转发布复用 ID，只比相等不比大小。（来源：`guide-rewrite-20261030/input-main.json:5668-5700`，`/modules/2/nodes/8`）

- MT-F012【6 执行身份与许可】问 A 到 B 时长却实际更新导航途经点说明必须核对真实副作用，不能只信响应话术或把错误统归输入调度。（来源：chapters/I/raw/m0813.txt:128-239）

- MT-F033【6 执行身份与许可】会上要求网络重试按音频上云、action 下发、feedback 返回各节点和动作有效时长设计，过期 action 再发已无意义。（来源：chapters/I/raw/m1020.txt:110-126）

- MT-F045【6 执行身份与许可】车控 feedback 缺失被列为本周重点，左晨称已评审 8 个头部一级功能、当天建 Meego、补产品待办，目标本周提测并入 10 月 20 日版。（来源：chapters/I/raw/m1013-sls.txt:478-515、655-659）

- MT-F068【6 执行身份与许可】SOP 二级任务事件与步骤关联要求把触发事件、工具与 GUI 回调关联到具体任务/执行步骤，任务运行结果需保存。（来源：AI汽车SOP功能清单 (1).xlsx，【子功能】对话推理!D13:J14）

- CHAT-F017｜执行身份与输出许可｜手点卡片需要同步 Planner 上下文，卡片消失时动态选择工具随之删除。（来源：chapters/I/raw/aiva-vui-1104.txt:598–601）

- CHAT-F051｜执行身份与输出许可｜Extour 任务触发在 AIDV 生成 recommend_id、车端用 vehicle_recommend_id 回流并关联 goal_id，循环每次触发是独立推荐，同次通知重试复用幂等键。（来源：guide-rewrite-20261030/input-async.json，$.modules[3].nodes[8].detail；车型相关早期整理）

- CHAT-F055｜执行身份与输出许可｜ActionList 透传早期整理限定静态 Advisor 身份与车辆匹配、等 Planner 整轮不再调用工具后合并成功结果，混合用户输入或多 advice 的归因暂不支持。（来源：guide-rewrite-20261030/input-async.json，$.modules[5].nodes[6].detail、nodes[9].detail；非输入管理通用输出规则）

- CHAT-F057｜执行身份与输出许可｜direct_return 只允许按渠道工具配置直接交付，卡片透传不自动获得播报权，Fallback 也不是同工具自动重试许可。（来源：guide-rewrite-20261030/input-async.json，$.modules[2].nodes[11].detail、nodes[12].detail）

- CHAT-F068｜执行身份与输出许可｜删除/停用任务后应让后续触发和待展示通知失效，在途卡片/回调按当前任务状态结束，取消未来安排不反向回滚已完成车控。（来源：guide-rewrite-20261030/input-support.json，$.modules[4].nodes[11].detail；任务侧失效边界，不等于输入管理执行状态定义）


## 七、结束路径、播放事件、超时和接管

- **TECH-F057** 静默、纯工具、首 token 前失败在无待播输出时直接结束；有字无音频发送结束即结束；有音频等合法播放终态，完成与取下一批原子提交。（来源：`chapters/I/raw/input-tech.txt:L491-507,581-583`）

- **TECH-F058** 客户端接管按原 request_id 结束对应输入并撤销相关云执行，保留其他 waiting；实例失联先恢复状态再出队。（来源：`chapters/I/raw/input-tech.txt:L509-519,556-558`）

- **TECH-F059** TaskRound 级播放事件走临时事件接口写 Redis 驱动调度，request 级原 progress 仍写历史库支撑恢复，两条按职责并行。（来源：`chapters/I/raw/input-tech.txt:L850-883`）

- **TECH-F060** 播放事件带音频 Fetch 的 request_id 仅校验归属，FINISHED 要结束边界证明，ABORTED 要原因，进度缺失与显式 0 必须区分。（来源：`chapters/I/raw/input-tech.txt:L899-927`）

- **TECH-F061** 【内部冲突 C03】事件示例和实施计时使用 played_media_ms，字段表与 PROGRESS 说明使用 duration_ms，正式字段名需接口对齐。（来源：`chapters/I/raw/input-tech.txt:L887-915,1020`）

- **TECH-F062** STARTED 是首个非空样本进入播放器渲染，PROGRESS 是真实媒体消费，FINISHED 是轮结束标记已见且全部 Provider 与渲染队列耗尽，ABORTED 是永久清队列且不可恢复。（来源：`chapters/I/raw/input-tech.txt:L937-959`）

- **TECH-F063** 子流结束、整轮服务端下发结束、HTTP/WSS 断开、尾包或估算时长均非播放完成，临时暂停后拒识可续原对象，有效 P0 才永久结束。（来源：`chapters/I/raw/input-tech.txt:L960-961`）

- **TECH-F064** 播放路由索引先写后在 runtime 原子发布时重新校验，索引只定位不授予许可，索引孤立或撤销后不得发音频。（来源：`chapters/I/raw/input-tech.txt:L964`）

- **TECH-F065** STARTED/PROGRESS 只更新播放事实不换候选，FINISHED/ABORTED/NO_AUDIO 触发 Evaluate，播放控制事件不入队也不增 InputRevision。（来源：`chapters/I/raw/input-tech.txt:L966-968`）

- **TECH-F066** 客户端需统一跟踪 TaskRound、按实际消费计时、统一协调上报、持久化终态重试并在重启后恢复，暂停和缓冲不累计媒体时长。（来源：`chapters/I/raw/input-tech.txt:L1012-1052`）

- **TECH-F067** 音频总长与已播时长仅用于动态超时，只有 TaskRoundEnd 后总长稳定，客户端显式终态才是正常结束证据。（来源：`chapters/I/raw/input-tech.txt:L1055-1086`）

- **TECH-F068** 有进度时软期限为最后进度时间 + 剩余时长/最低倍速 + 弱网宽限，无进度时为内容结束时间 + 总长/最低倍速 + 首播缓冲 + 弱网宽限，硬期限再加最大未确认阻塞时长。（来源：`chapters/I/raw/input-tech.txt:L1088-1104`）

- **TECH-F069** 新有效进度按单调增加的时长滚动重算期限，接近完成可缩宽限，无进度或明确断连仍使用保守软硬期限。（来源：`chapters/I/raw/input-tech.txt:L1104,1144-1147`）

- **TECH-F070** 软期限只记 FINISH_UNCONFIRMED 不推进，硬期限以 PLAYBACK_STATUS_TIMEOUT 结束并解除播放门，迟到进度或完成只补审计、不重复推进、不伪装 FINISHED。（来源：`chapters/I/raw/input-tech.txt:L1126-1142`）

- **TECH-F071** 新 P0 不受超时限制，超时检查依赖 Redis 持久状态不依赖原进程，非法进度不覆盖有效值，超时只解队列堵塞不代表工具失败或回滚。（来源：`chapters/I/raw/input-tech.txt:L1148-1154`）

- **TECH-F072** Redis 原子更新有限重试后故障关闭，不能绕过输入管理直调 Planner；不可重放的失联输入不自动重跑。（来源：`chapters/I/raw/input-tech.txt:L530,813-815`）

- **TECH-F073** 【内部待统一 C04】故障恢复段写无法恢复终态时由受控人工确认推进，后增超时段又规定硬期限自动推进，两条适用条件需要明确。（来源：`chapters/I/raw/input-tech.txt:L814,1132-1136`）

- **TECH-F074** 硬超时仍可能遇到旧端本地在播，新端需显式按指定 TaskRound 取消缓存，旧端用更保守期限并按车型版本灰度，不能凭 ID 大小停播。（来源：`chapters/I/raw/input-tech.txt:L1153`）

- **TECH-F091** 【7. 播完才算完与故障】播放消费时长在事件示例与客户端计时中叫 played_media_ms、字段表叫 duration_ms、超时数据结构叫 played_duration_ms，三者是否仅内外映射原文未明示。（来源：`chapters/I/raw/input-tech.txt:L889,911-915,947,1020,1072-1074`）

- **TECH-F093** 【7. 播完才算完与故障】现行软硬期限与旧副本都采用 hard_deadline=soft_deadline+max_unconfirmed_block_ms 且有效进度滚动重算，未给固定绝对阻塞上限，因此不能宣称硬期限永远锚在首次下发时间。（来源：`chapters/I/raw/input-tech.txt:L1088-1104,1144-1147`；`lecture-rewrite-20261029/source-补查-input-management.md:L596-629`）

- PRD-F010｜主题 7｜PRD 背景把 ReAct 看作不同推理轮次，旧流程要等上一轮 TTS 播完再推理下一轮。（来源：`chapters/I/raw/input-prd.txt:90-95`；区别于现行可提前算、待许可再发）

- PRD-F016｜主题 7｜历史端侧接管要撤销对应云端 query、拒收晚到云端结果、被合并的其他输入恢复排队，历史只记端侧实际处理信息。（来源：`chapters/I/raw/input-prd.txt:632-644`）

- PRD-F017｜主题 7｜历史异常设计包含上传失败后端侧兜底、工具超时反馈后 Planner 重试及再失败结束，队列过多先观察而暂不限制。（来源：`chapters/I/raw/input-prd.txt:489-503`）

- PRD-F042｜主题 7｜旧 ReAct 本轮发过 TTS 时轮询等客户端播完再走后续，等待上限 1 分钟，和新双期限协议不同。（来源：`chapters/I/raw/planner-onepage.txt:65-69,134-138,289-291`）

- PRD-F043｜主题 7｜打断已播/未播切分优先按 WordTimestamp 打轴，缺打轴用默认 100 ms/字估算，此数是估算参数而非播放上报周期。（来源：`chapters/I/raw/planner-onepage.txt:146-150,293-295`）

- PRD-F050｜主题 7｜历史续播以打断前最近一个逗号、句号、感叹号或问号为界，没有这四种标点就从被打断词开头续播，不等于新方案永久中止后可复活。（来源：`chapters/I/raw/interrupt-prd.txt:36-39`）

- PRD-F055｜主题 7｜旧恢复分流在最终 Reject 时通过 Event 再触发新 Query，Recall 则由 Planner 融合新话和未播内容，和暂停缓存续播是两条不同恢复路径。（来源：`chapters/I/raw/voice-onepager.txt:240-242,461-476`）

- PRD-F056｜主题 7｜新播放抢占、服务挂起、第三方停指定/全部播放、离线车控结果播放、静默和单人打断均标不恢复，最终未拒识、流式非拒识及多人以豆包开头打断标可恢复。（来源：`chapters/I/raw/voice-onepager.txt:477-567`；表中“是”只表允许恢复，不等于无条件复活）

- PRD-F057｜主题 7｜ComeNewPlay 表示新 TTS 优先级不低于当前播放而取消旧 request，客户端会回调旧请求被新播放打断。（来源：`chapters/I/raw/voice-onepager.txt:488-495`）

- PRD-F068｜主题 7｜旧结束路径覆盖静默、纯 Tool、首字前失败、纯文字与 TTS，并要求结束及取下一批等待项原子完成；实例 lease 到期不是业务完成。（来源：`lecture-rewrite-20261029/source-补查-input-management.md:232-250,269,298-303`）

- PRD-F072｜主题 7｜旧恢复要求先使失联执行失效，再检查重放资格，已放行工具的输入不能自动重做；Redis 原子失败有限重试后 fail-closed，禁止绕过输入管理。（来源：`lecture-rewrite-20261029/source-补查-input-management.md:261,415-426`）

- PRD-F076｜主题 7｜TaskRound 播放事件写 Redis 供调度，request 级播放进度仍写数据库供历史恢复，两者并行，一个 request 可跨多个模型轮。（来源：`lecture-rewrite-20261029/source-补查-input-management.md:461-480,550-552`）

- PRD-F077｜主题 7｜TaskRoundID 从 SubTTSState.reply_value 原样取用，客户端不解析不造 ID；服务端按车辆公参和 TaskRound 路由核对归属，不能绑定最近一轮。（来源：`lecture-rewrite-20261029/source-补查-input-management.md:481-511`）

- PRD-F078｜主题 7｜旧整理已定义 STARTED 真渲染、PROGRESS 实际消费、FINISHED 全轮边界与队列耗尽、ABORTED 永久清队列，网络尾包/断链/Provider 子流结束不等于播完。（来源：`lecture-rewrite-20261029/source-补查-input-management.md:512-529`）

- PRD-F079｜主题 7｜播放事件重复合法上报为空操作，进度单调，首个合法终态锁定，冲突终态报错，未知最终进度不拿旧进度冒充，FINISH_PENDING 等服务端轮边界补齐。（来源：`lecture-rewrite-20261029/source-补查-input-management.md:530-544`）

- PRD-F080｜主题 7｜旧建议播放活跃 TTL 与终态保留至少 30 分钟且需压测，不能沿用临时事件 1 分钟 TTL，更不能将过期当播完。（来源：`lecture-rewrite-20261029/source-补查-input-management.md:545`；参数建议不是现行交付数字）

- PRD-F083｜主题 7｜终态上报应先持久化身份和原 payload 再发送，重试不变 payload，重启不能恢复对象且无待确认终态时上报 PLAYER_RESTART 的 ABORTED。（来源：`lecture-rewrite-20261029/source-补查-input-management.md:510-511,571-595`）

- PRD-F084｜主题 7｜补查整理与现行 input-tech 均写 hard_deadline=soft_deadline+max_unconfirmed_block_ms，且新有效 progress 重算期限，原文未给绝对累计硬上限，不能声称新旧有固定锚点差异，也不能把此公式解释为无限延期保证。（来源：`lecture-rewrite-20261029/source-补查-input-management.md:596-629,649-654`；现行对照 `chapters/I/raw/input-tech.txt:1088-1104,1145`）

- PRD-F085｜主题 7｜软超时标 FINISH_UNCONFIRMED 且暂不推进，硬超时以 PLAYBACK_STATUS_TIMEOUT 结束并推进，迟到事件只补审计不回滚不重复推进，超时绝不伪装 FINISHED。（来源：`lecture-rewrite-20261029/source-补查-input-management.md:630-661`）

- PRD-F092｜主题 7｜M10 要真实 STARTED/PROGRESS/FINISHED/ABORTED、永久中止不可复活，M11“记录未确认或超时并释放”省略软期限暂不推进条件，不能直接照搬成软超时即出队。（来源：`guide-rewrite-20261030/input-main.json:5702-5764`，`/modules/2/nodes/9,10`）

- MT-F024【7 播放结束】主交互 TTS 播完默认进入 30 秒延时聆听，末尾用户正在说话需延长收音、有效输入刷新计时、拒识则退出，该 30 秒不是输入管理硬期限。（来源：chapters/I/raw/m1019.txt:95-96、116-123）

- MT-F032【7 播放结束】10 月 20 日网络专项讨论的云端 3 秒无结果属于端云超时定义，不是输入管理播放软期限或硬期限。（来源：chapters/I/raw/m1020.txt:17-21）

- MT-F035【7 播放结束】打断时现状为直接把音量降到 0，200 毫秒淡出与依靠 TTS 打轴避开半个字是两项不同优化，会上未决定已上线。（来源：chapters/I/raw/m1020.txt:128-159）

- CHAT-F007｜播放结束｜该文件写打断后最终拒识时 NLG 不恢复、ASR 清空并转延时聆听，与暂停续播设计存在版本/车型分歧。（来源：chapters/I/raw/aiva-vui-1104.txt:306–307）

- CHAT-F008｜播放结束｜工具名到工具 feedback 返回期间展示工具过程，TTS 播放时仍收全车音区输入。（来源：chapters/I/raw/aiva-vui-1104.txt:309–320）

- CHAT-F009｜播放结束｜语音、导航、系统等新 NLG 下发均可打断旧 TTS。（来源：chapters/I/raw/aiva-vui-1104.txt:318–322）

- CHAT-F014｜播放结束｜主动服务发声时拉起所有音区，静默展示不拉起，该段写播完进入强聆听而前部写延时聆听，术语不一致。（来源：chapters/I/raw/aiva-vui-1104.txt:575–583 对 454–469）

- CHAT-F049｜播放结束｜该整理保留 AIVA 拒识后不恢复、事件恢复和二月底缓存 PCM 续播三种配置，不能从某一个入口存在推定所有车型启用同一种恢复。（来源：guide-rewrite-20261030/input-async.json，$.modules[0].nodes[1].detail、nodes[5].detail、nodes[7].detail）

- CHAT-F050｜播放结束｜声音资源抢占来自音频管理，指令送达、合成结束与扬声器静音时间不同，不能用合成结束代替实际停声。（来源：guide-rewrite-20261030/input-async.json，$.modules[0].nodes[8].detail；早期整理）

- CHAT-F063｜播放结束｜临时链路查不到原打断记录时不能编造剩余内容，是否等待迟到上报仍是原方案待对齐项，没有统一重试次数或时限。（来源：guide-rewrite-20261030/input-support.json，$.pages[5].sections[5].paragraphs[2]；早期整理）

- CHAT-F066｜播放结束｜恢复成功最终要看客户端真实播放，不以服务端生成回复、发恢复消息或结束标记代替用户听完。（来源：guide-rewrite-20261030/input-support.json，$.pages[5].sections[5].paragraphs[4]、$.pages[5].teaching.guides.EV-tts.paragraphs[4]）

- **PAGE-F005** 【7. 播完才算完与故障】旧字段将软期限描述为“播放完成但通知未确认”，现行方案只承认播放状态未知，软超时不能推定已经播放完成。（来源：`chapters/M/old-page.json:$.sections[3].paragraphs[6] / $.concepts[4]；chapters/I/raw/input-tech.txt:L1055,1126-1136`）


## 八、演进与新旧链路

- **TECH-F075** 新模块运行 AIDV 进程内，Redis 跨实例协调；可复用底层原子工具，但现有 ChatHistory.ID + Round 与多音区时间戳不能承担新执行有效性。（来源：`chapters/I/raw/input-tech.txt:L570-573`）

- **TECH-F076** managed 路径 GetRoundID 返回分配的执行 ID，去掉 Round-1 等待改显式依赖，旧链路已下发 ID 保留原契约不改写。（来源：`chapters/I/raw/input-tech.txt:L645-646`）

- **TECH-F077** 新链路收编多音区 ShouldBreak、Query/Advisor 版本与推荐等待，保留现有输入内容格式、改写和历史兼容身份。（来源：`chapters/I/raw/input-tech.txt:L829-847`）

- **TECH-F078** 旧端旧服务沿用旧行为；旧端新服务可映射 LEGACY_FINISHED 但缺起播与中止精度；新端旧服务不兼容所以必须先升级服务；新端新服务支持结构化事件并写旧完成键。（来源：`chapters/I/raw/input-tech.txt:L978-1001`）

- **TECH-F079** 迁移需收口 ShouldBreak 与 ShouldBreakInRecommend 两种打断判断，同一 Chat 不能同时启两套并发协调。（来源：`chapters/I/raw/input-tech.txt:L1181-1183`）

- PRD-F002｜主题 8｜输入管理是 Planner 前置模块，覆盖全部有效输入的打断、排队与合并，既有背景链路包括多音区近时判停合并和打断恢复。（来源：`chapters/I/raw/input-prd.txt:90-100`）

- PRD-F011｜主题 8｜391 行以后明确标为“无需查看”或“先不看”，其中首 token 边界、反馈可合并、建议过期与接管例子应作历史设计。（来源：`chapters/I/raw/input-prd.txt:391-439`）

- PRD-F034｜主题 8｜Director 总 PRD 将旧冲突策略标废弃并转向输入管理，异步 tool feedback 另列暂未宣讲工程需求。（来源：`chapters/I/raw/director-prd.txt:911-919`）

- PRD-F038｜主题 8｜旧 Flow 在推荐、单座、拒识等处理前预启动 DoPlan，但内部等待 MsgKeyPlannerContinue，快路径命中则取消，只有最终选 Planner 才放行。（来源：`chapters/I/raw/planner-onepage.txt:4-23`）

- PRD-F039｜主题 8｜旧 sound_zone_merge 用 Redis 合并同一 ChatID 四音区 query，keepCheckShouldBreak 每 100 ms 查新 query 且首 token 后不再中断。（来源：`chapters/I/raw/planner-onepage.txt:25-29,297-299`）

- PRD-F048｜主题 8｜2.6 短期设计在非拒识且非简单车控时立刻停播，非拒识后等待简单车控结果暂定 1.5 s，晚到导致多余打断可接受。（来源：`chapters/I/raw/interrupt-prd.txt:10-13`）

- PRD-F049｜主题 8｜二月底实验版改为 ASR 超过两个字先停播，最终拒识则续播 PCM，召回则等新 TTS，开关启用，体现从听清再停到先停后判的演进。（来源：`chapters/I/raw/interrupt-prd.txt:31-41`）

- PRD-F070｜主题 8｜较早新建边界称 ChatRuntimeState、执行版本和 owner lease 当时仓库未实现，仅 Redis CAS2/CAD/SetNX/Eval 原语可复用，该结论是当时审查而非当前代码验收。（来源：`lecture-rewrite-20261029/source-补查-input-management.md:292-294`）

- PRD-F073｜主题 8｜旧多音区用 log_id 去重、最近 4 条、1 分钟缓存、100 ms 轮询、QueryVersion/AdvisorVersion 时间戳变化判打断，Advisor 后值覆盖前值，首个 Planner item 不一定可见文本。（来源：`lecture-rewrite-20261029/source-补查-input-management.md:427-436`）

- PRD-F074｜主题 8｜统一模块迁移后每音区独立 Input，request_id 作业务幂等、log_id 仅追踪，多音区只组装选中内容，保留 UserContents/AdvisorContents 和 MergeSoundZoneID。（来源：`lecture-rewrite-20261029/source-补查-input-management.md:437-459`）

- PRD-F093｜主题 8｜旧图含 12 个节点、16 条章内箭头和 10 条跨章关系，跨章覆盖 R8 用户入口、M9→C1 背景、E8 后续异步、T08/T16/S06 建议、O04 播放、I7 恢复 Event、I8 有效打断、F13 Fallback。（来源：`guide-rewrite-20261030/input-main.json` `/modules/2/edges` 及 `/edges` 中 M-1…M-16、X03/X05/X09/X14/X18/X22/X44/X46/X47/X70）

- PRD-F094｜主题 8｜跨章 X09 将 E8 独立异步反馈标 planned，X46 将 I7 拒识后恢复 Event 接 M1，讲图必须区分后续扩展与旧恢复链路。（来源：`guide-rewrite-20261030/input-main.json` `/edges` ID X09、X46；X46 位置 23322 行）

- MT-F003【8 演进】8 月 13 日认为 BAB 根治需要调整输入管理策略和架构，提示词只能减少啰嗦和改善衔接。（来源：chapters/I/raw/m0813.txt:22-35）

- MT-F010【8 演进】8 月讨论用重要事件上报和事件穿插人机对话替代旧摘要，会上没有给出已上线结论。（来源：chapters/I/raw/m0813.txt:98-113）

- MT-F028【8 演进】10 月 19 日对工具期间新输入的解释区分未首 token 合并、已出工具名可接新 query、结果返回再合并给 DT，总结节奏优化当时仍有需求在跟。（来源：chapters/I/raw/m1019.txt:422-435）

- MT-F034【8 演进】当时上下文仅 query 完成时同步一次，失败不重试，拟在轮询或新 query 检出恢复时补同步。（来源：chapters/I/raw/m1020.txt:20-21）

- CHAT-F059｜演进｜早期跨章边明确 E8 到 M1 的“独立异步反馈重新准入”为 planned，不能把该后续方案写成首期反馈现状。（来源：guide-rewrite-20261030/input-async.json，$.edges[378]，id=X09、relation=planned）

- CHAT-F062｜演进｜误打断临时链路由客户端按被打断原 request_id 暂存已播/未播信息，云端最终拒识后查记录、构造恢复 event，经 Frontier 下发再由客户端推荐入口回流 query。（来源：guide-rewrite-20261030/input-support.json，$.pages[5].sections[5].paragraphs[0–1]、$.pages[5].flows[2].nodes[1]、nodes[4]；旧临时方案）

- CHAT-F064｜演进｜8 月 11 日事件评审仅讨论把临时恢复纳入统一事件消费/输入管理，整理图把该关系标 planned，不能声称所有 event 都已统一在线调度。（来源：guide-rewrite-20261030/input-support.json，$.pages[5].sections[5].paragraphs[3]、$.pages[5].flows[1].edges[9].planned；这是整理对评审的转述，非本次重读文字记录）

- **PAGE-F001** 【8. 演进与新旧链路】当前 v63 的可见正文使用 M.v34 的 15 区块，旧 sections/teaching/mainline/concepts/feynman 仍内嵌，保留字段的旧规则不能当作本页当前讲法。（来源：`HTML/01-进行中/豆包汽车-业务学习站-v63.html:L269，$.pages[id=M].v34 与 L619-651 渲染选择`）


## 九、真实 badcase 与排查

- **TECH-F080** 旧分散调度导致优先级/合并窗口/完成条件不一、播放生命周期割裂、取消后晚到输出或工具及历史仍可能生效。（来源：`chapters/I/raw/input-tech.txt:L16-38`）

- **TECH-F081** 技术方案列明的客户端接管 badcase 是本地已接管却未及时上报，云端仍在推理，不等同有具体事故记录。（来源：`chapters/I/raw/input-tech.txt:L176-182`）

- **TECH-F082** 原文共八组设计场景，不只六组，另含工具完成但仍在播报和执行中反悔，均应标设计而非路测事故。（来源：`chapters/I/raw/input-tech.txt:L334-355,541-564`）

- PRD-F047｜主题 9｜历史问题是非简单车控要等下一轮 TTS 起播才停旧播报，导致紧急或重要需求响应迟；简单车控则提示音而不打断。（来源：`chapters/I/raw/interrupt-prd.txt:5-9`；是问题陈述，无单次事故明细）

- PRD-F098｜主题 9｜旧整理提醒 ASR 正确而 answer 为空只能先记有效需求无可见响应，需串起拒识、入站、Planner 输出和播放后才能归因过拒。（来源：`guide-rewrite-20261030/input-main.json` `/modules/2/questions/6`）

- MT-F001【9 badcase】路测实际出现 BAB 与 BABA 的回答交错，导航任务互斥时旧任务答案重新插回来尤其影响体验。（来源：chapters/I/raw/m0813.txt:14-35）

- MT-F002【9 badcase】BAB 的口头解释为新 query 先响应、旧 query feedback 随后播报、再到新 query feedback，而 BABA 是否另有工程 bug 当场未定。（来源：chapters/I/raw/m0813.txt:23-35）

- MT-F004【9 badcase】实测同时有被打断任务未恢复完成和本应丢弃的旧内容又恢复两类相反损点。（来源：chapters/I/raw/m0813.txt:19-20、37-47、70-71）

- MT-F006【9 badcase】恢复评测按信息查询、控制、多结果搜索分类型，并检查核心信息已播完与新旧任务覆盖或补充关系。（来源：chapters/I/raw/m0813.txt:61-68）

- MT-F007【9 badcase】用户从搜幼儿园改问饭店或自己打断自己时旧结果仍可能被捞回，产品认为已失去恢复价值。（来源：chapters/I/raw/m0813.txt:64-71）

- MT-F009【9 badcase】已删除途经点半小时后仍被播报，会议怀疑陈旧历史或摘要，但该条具体根因仍需查记录。（来源：chapters/I/raw/m0813.txt:97-116）

- MT-F011【9 badcase】现场另一条水果店记录显示规划已完成而历史仍是未完成，情景记忆又带旧地点，执行事实与记忆状态不一致。（来源：chapters/I/raw/m0813.txt:148-152）

- MT-F013【9 badcase】收藏地点口头答应未操作被定位为误调用户记忆而非 Navi control，会上称改了注释、仍需端上复核。（来源：chapters/I/raw/m0813.txt:85-98）

- MT-F014【9 badcase】音乐收藏、30 秒切歌和车控均有话术与事实相反表现，会议分别归能力边界或客户端执行，未证明都是 feedback 丢失。（来源：chapters/I/raw/m0813.txt:940-962、1018-1031）

- MT-F021【9 badcase】上汽发生主动服务主动打招呼后用户无法接茬，驱动新增主动服务拉起全音区的要求。（来源：chapters/I/raw/m1019.txt:158-159）

- MT-F025【9 badcase】赛力斯实测中副驾继续说话未上屏，用户无法判断系统是否响应；这条表现不能直接证明 Planner 没收到输入。（来源：chapters/I/raw/m1019.txt:29-42）

- MT-F039【9 badcase】美团取号提醒与 query 结果卡可能同时出现/需合并是会上指出的设计风险，非已发生事故。（来源：chapters/I/raw/m1020.txt:689-705）

- MT-F041【9 badcase】人数识别误判会把车内真实用户挡在唤醒外，被会上列为 P0 风险，不应把该方案写成确定准入规则。（来源：chapters/I/raw/m1020.txt:572-606）

- MT-F043【9 badcase】导航途经点顺序变化可能触发错误任务或让旧任务悬挂，会上讨论以 POI 名称注册和监听变更清理，但自动删除还是询问用户未定。（来源：chapters/I/raw/m1020.txt:203-249）

- MT-F047【9 badcase】当天实车多人体验里打断不恢复被描述为大概率发生的体验回退，要求排查整个链路而非只看单个已提 bug。（来源：chapters/I/raw/m1013-sls.txt:811-848）

- MT-F048【9 badcase】会上确认打断过于敏感且测试有异常打断数据，但即使流式误打断、最终拒识仍应恢复旧内容；未恢复是另一独立问题。（来源：chapters/I/raw/m1013-sls.txt:856-887）

- MT-F049【9 badcase】开窗再放歌的一语多意图可能被离线开窗抢走、放歌不响应，音区和复现概率还需进一步抓取。（来源：chapters/I/raw/m1013-sls.txt:910-946）

- MT-F050【9 badcase】实车 ASR 有 5 到 10 秒不出字后批量出现，定位者称可能是交互而非 ASR 准确率问题，仍需转正确模块追查。（来源：chapters/I/raw/m1013-sls.txt:982-1013）

- MT-F052【9 badcase】主驾说开心、副驾说难过时只回应副驾而不联系主驾，是换模型后的主观情境关联变差观察，会上明确需评测而非已定因果。（来源：chapters/I/raw/m1013-sls.txt:1048-1055）

- MT-F053【9 badcase】车窗无法语音控制的部分实车原因是下电后未完成车窗学习，可通过手动最低/最高往返完成学习，不能归为输入被吞。（来源：chapters/I/raw/m1013-sls.txt:598-635）

- MT-F056【9 badcase】非定时条件任务实车不触发的报障在会上被解释为 Director 分发问题并已流转，仍需整链实车复测，不能直接断言全是触发器故障。（来源：chapters/I/raw/m1013-sls.txt:2176-2207）

- MT-F058【9 badcase】全时免唤醒体验中机器人频繁在延时抽象态与人物形象间跳变，被确认已提 bug，金龙称与当时升降级无关。（来源：chapters/I/raw/m1013-sls.txt:2440-2459）

- MT-F061【9 badcase】用户打开手机无线充电时豆包又补上轮第二第三家西餐厅，原始路测标为打断/交互问题，单条记录未给唯一技术根因。（来源：v-lesson-20261107/raw/road-0811.txt:1753-1767）

- MT-F062【9 badcase】用户切换制冷模式时豆包插入旧停车场信息，再报告调好后又追问急诊停车路线，呈新旧任务交错。（来源：v-lesson-20261107/raw/road-0811.txt:2657-2671）

- MT-F063【9 badcase】同一恢复过度条目还记录问台风先续青浦天气、导航对象小区却续台风尾巴，均是原始记录中的实际回答。（来源：v-lesson-20261107/raw/road-0811.txt:2672-2677）

- MT-F064【9 badcase】9 月 14 日空调避人吹成功的反馈与整段约会推荐同时出现，说明本轮车控完成并不自动阻止旧话题串入。（来源：v-lesson-20261107/raw/issues-0914.txt:30）

- MT-F065【9 badcase】9 月 14 日腰托后调因非 P 档失败，却只口头答应并补播旧充电站，没有向用户交代失败。（来源：v-lesson-20261107/raw/issues-0914.txt:32）

- CHAT-F020｜badcase｜当前一句话多工具展示缺少分区、和 query 关联弱，提出 DT 改写单工具 query 作标题并加分隔符，未提供修复验收。（来源：chapters/I/raw/aiva-vui-1104.txt:926–941）

- CHAT-F025｜badcase｜11 月 6 日测试汇总报告同音区重复查询 Planner 无回复、车控动作成功但播报失败和暂停后语音续播失败，但未给出逐条根因。（来源：chapters/I/raw/chat-search-dadunhuifu.txt:10–51，message_id=om_x100b61ebe2a71ca4cfe74749f7c4422）

- CHAT-F030｜badcase｜附带导航报告记录多轮残留途经点/终点、重复播报和可见即可说后云端上下文缺动作等现象，多数只标“第三方问题”，并无输入管理执行串线的直接归因证据。（来源：chapters/I/raw/chat-search-dadunhuifu.txt:1048–1055、1696–1703、2669–2677、4046–4054）

- CHAT-F033｜badcase｜“打断不恢复”检索的可见内容是若干“请升级客户端”卡片加已在 chat-search-dadunhuifu.txt 出现的同一条 11 月 6 日测试汇总和同一份实车报告，没有新增可独立核实的输入管理根因。（来源：chapters/I/raw/chat-search-dadunbuhuifu.json:1，$.content_excerpt，message_id=om_x100b61ebe2a71ca4cfe74749f7c4422）

- CHAT-F040｜badcase｜10 月 23 日 Smoke 列记录通话中收到了内容 Advisor、query 执行成功且调用工具后仍播“当前网络不好”，但没有给准入/许可链上的具体根因。（来源：chapters/I/raw/chat-search-yingdalv.json:1，$.content_excerpt，sheet=dZ9yv7，Smoke 行，20261023 列）

- CHAT-F041｜badcase｜10 月 30 日主交互汇总记录后排交互时 ASR 前后都显示、卡片混乱，多屏通过率 42.8%，与 11 月 6 日 54% 是不同测试时点。（来源：chapters/I/raw/chat-search-yingdalv.json:1，$.content_excerpt，message_id=om_x100b617ebbd1e8a4c135d7ed24e5d56.text，第 16 项；较新数据见 chat-search-dadunhuifu.txt:245–252）

- CHAT-F042｜badcase｜10 月 30 日汇总记录调用工具时豆包嘴巴仍保持播报态，此为端侧表现状态与实际执行阶段不同步的症状，未给输入管理根因。（来源：chapters/I/raw/chat-search-yingdalv.json:1，$.content_excerpt，同 message_id.text，第 14 项）

- CHAT-F071｜badcase｜温度被调回旧值的排查路线依次核原始状态与操作、当轮 Context/历史输入、Planner action_list、真正下发与回执，模型无新动作时继续查旧任务/晚到回包/重复下发及其他来源。（来源：guide-rewrite-20261030/input-support.json，$.pages[6].sections[4].paragraphs[0–4]；教学排查框架，非已确认事故根因）

- **PAGE-F007** 【9. badcase 与排查】旧图 M3 把不同座位的进行中状态要求隔离记录容易误读成各有独立交互流，现行调度共享粒度为 channel+vehicle_id+chat_id，音区是输入来源信息。（来源：`HTML/01-进行中/豆包汽车-业务学习站-v63.html:L269，$.base.modules[id=M].nodes[id=M3]；chapters/I/raw/input-tech.txt:L265,751,819-847`）

- **NOTE-F004** 【9. badcase 与排查】笔记另记录 11/3 合并来源安全标识、10/23 query 触发器、11/6 外部 advice 接口、10/27 静态 advice 时效与消费回执等未定项，所涉原始聊天或逐字稿需区分是否已在本地复核。（来源：`chapters/M/notes.md:L148-154`）

- **AUDIT-F001** 旧审稿指出主例中 P1 提醒入场时点、isolated 反馈被用户补话重推、预跑与排队的差异必须分别解释，不能用一条示意时间线同时写成互斥路径。（来源：`chapters/M/review.md:L13-32`；该项是审稿意见，不是上线证据）

- **AUDIT-F002** 旧审稿核对 PRD 后已纠正“PRD 以首字为界”的误述，线上旧规则、PRD 的未输出完整/未调工具、技术方案的原子工具放行三者要分开。（来源：`chapters/M/review.md:L34-40`）

- **AUDIT-F003** 旧自查声称 11/9 已修改主例、预跑说明、边界、日期和车型诉求等，但这只是初稿改动记录，当前 v63 是否保留要从实际页面逐项重建。（来源：`chapters/M/selfcheck.md:L38-66`）

- **AUDIT-F004** 旧审稿明确多人 PRD 的任务分型、冲突澄清和可感知排队只是产品要求，1/13 发版仅能支持多人合并已合入，不能把该 PRD 所有策略一并称上线。（来源：`chapters/M/review.md:L110-113`）

- **AUDIT-F005** 旧审稿指出“输入管理上线就没有 BAB”缺乏验证，输入组织与 Planner 恢复策略仍需分别验收。（来源：`chapters/M/review.md:L48-52`）


## 车型与灰度

- **TECH-F083** 模块设计兼容豆包 IP/非 IP，以 channel + vehicle_id 灰度且新旧互斥，RTC 缺身份继续旧路，文内未给出哪款车已正式验收。（来源：`chapters/I/raw/input-tech.txt:L89,521,847,1207`）

- **TECH-F084** 旧端新服务的播放精度弱于新端，硬超时按车型和客户端版本保守灰度，不能把协议能力当所有车型已具备。（来源：`chapters/I/raw/input-tech.txt:L984-1001,1153`）

- PRD-F036｜主题 10 车型与灰度｜上汽与赛力斯分别使用 planner.task.analyze_text_saic_dna 与 planner.task.analyze_text_seres，工具可选性也有车型差异，不能据此推断输入管理均已上线。（来源：`chapters/I/raw/director-prd.txt:175-177,1246-1556,1564-1566`）

- PRD-F075｜主题 10 车型与灰度｜旧整理要求新旧链路按 channel+vehicle_id 灰度互斥，同范围只能一套机制决定打断及执行有效性。（来源：`lecture-rewrite-20261029/source-补查-input-management.md:456-460,685-687`）

- PRD-F082｜主题 10 车型与灰度｜新客户端配旧服务端因完成事件键带前缀不能唤醒旧轮询而不兼容，须先服务端升级；新端只发新完成事件，服务端兼写旧完成键，原数据库进度仍继续发。（来源：`lecture-rewrite-20261029/source-补查-input-management.md:553-570`）

- MT-F015【车型与灰度】8 月车控以 910 顶配能力编写，高低配与选装尚未细分，错误动态示例让座椅按摩模式与实车不符。（来源：chapters/I/raw/m0813.txt:959-989）

- MT-F026【车型与灰度】10 月 19 日赛力斯主交互仍在联调和需求优化，较上汽补充主动服务、卡片三方调用和多屏特殊策略。（来源：chapters/I/raw/m1019.txt:47-48、221-234、350-354）

- MT-F027【车型与灰度】四音区裁为双音区在产品形态上可移除后排，代码能否快速配置需研发确认；六音区需要重设计，当时尚未统一标准。（来源：chapters/I/raw/m1019.txt:374-411）

- MT-F040【车型与灰度】10 月 20 日车内外两套唤醒引擎会同时收到事件且强度缺少规律，按车内人数互斥的方案最终先不加、继续找供应商确认。（来源：chapters/I/raw/m1020.txt:461-606）

- MT-F069【车型与灰度】SOP 的可量产定义为至少一个项目交付落地与 feature 准出集，不证明新版统一输入管理已全车型上线。（来源：AI汽车SOP功能清单 (1).xlsx，【必读】清单说明&change log!B9:E11）

- CHAT-F003｜车型与灰度｜赛力斯 0930 更新规定本地 LLM 拒识和语义结果不采纳、状态机等云端，旧句“本地 reject/functioncall 驱动状态机”仍在同段保留。（来源：chapters/I/raw/aiva-vui-1104.txt:173–176；较新的是段内 0930 更新）

- CHAT-F019｜车型与灰度｜赛力斯 Advisor/系统通知卡片默认中控屏，界面展示按发话音区而非被控制座椅的位置。（来源：chapters/I/raw/aiva-vui-1104.txt:780–796）

- CHAT-F037｜车型与灰度｜附带周报 10 月 30 日列同时记录上汽 NLG 长时间恢复与赛力斯 TTS 打断不能恢复，两者都仍在 bug 跟踪，不能混为同一根因。（来源：chapters/I/raw/chat-search-yingdalv.json:1，$.content_excerpt，message_id=om_x100b617ebbd1e8a4c135d7ed24e5d56.linked_content，sheet=dZ9yv7，在线拒识行，20261030 列）

- CHAT-F044｜车型与灰度｜同一周报记录不同车辆对车窗和零重力座椅的支持不一致、FC 下发且功能实际开启但设置页仍显示关闭，不能把状态展示当动作执行真值。（来源：chapters/I/raw/chat-search-yingdalv.json:1，$.content_excerpt，同 message_id.text，第 15 项及附带表车控原子能力行）

- CHAT-F052｜车型与灰度｜Extour 推荐关联缓存写 10 分钟、回流检查当前账号，关联过期或账号切换不得当当前用户新要求，此 10 分钟不是输入等待队列 TTL。（来源：guide-rewrite-20261030/input-async.json，$.modules[3].nodes[8].detail；早期整理，需原始任务方案验证）

- CHAT-F072｜车型与灰度｜端云场景如两端都有同服务必须核实际执行权并专项测试，本整理明确禁止凭空编统一幂等字段或以“会仲裁”代替证据。（来源：guide-rewrite-20261030/input-support.json，$.modules[1].questions[6].goodAnswer）


## 指标与观测

- **TECH-F085** 计划建设 queue_depth、oldest_age、lease、stale output、recovery 及新旧 Shadow 对比，并允许按渠道车辆整体回退，未给这些指标实测值或告警阈值。（来源：`chapters/I/raw/input-tech.txt:L187,1203-1207`）

- **TECH-F086** 每条输入需可审计位置、准入动作、执行身份、结束原因与时间，异常与人工推进写 Fornax Trace、结构化日志和指标。（来源：`chapters/I/raw/input-tech.txt:L537,708,815`）

- **TECH-F087** 最低播放倍速、首播缓冲、弱网宽限、最大未确认阻塞、完成误差阈值为服务端配置，原文没有固定数值，不能编造秒数。（来源：`chapters/I/raw/input-tech.txt:L1088-1104`）

- **TECH-F088** 【内部冲突 C05】概述与场景正文共八类 Case，验收工作包末尾写七类，验收数量以八组实际场景保留并列出此编辑差异。（来源：`chapters/I/raw/input-tech.txt:L60,539,1205`）

- PRD-F027｜主题 11 指标与观测｜多人界面设想同时显示主副驾识别指令，并依 Planner 输出顺序显示或替换结果，具体交互另定。（来源：`chapters/I/raw/multi-prd.txt:113-120`）

- PRD-F035｜主题 11 指标与观测｜总 PRD 首 token 性能目标为 P50 500 ms 内、P90 800 ms 内，该数衡量生成性能而非起播或整轮完成。（来源：`chapters/I/raw/director-prd.txt:921-923`）

- PRD-F045｜主题 11 指标与观测｜旧链路模型和提示词 trace 看 Fornax、服务日志看 Argos，当前文件还给出 Argos 看板，query 相关性流末最多等 20 ms、模型调用超时 60 s。（来源：`chapters/I/raw/planner-onepage.txt:31-35,122-126,268,361-362`）

- PRD-F086｜主题 11 指标与观测｜旧拆分列 queue_depth、oldest_age、lease、stale output、recovery，并要求 Fornax Trace、结构化日志和指标，版本变化与结束原因都可审计。（来源：`lecture-rewrite-20261029/source-补查-input-management.md:268,424,662-687`）

- PRD-F095｜主题 11 指标与观测｜该整理建议六项验收观测：重复副作用/串轮、队列等待/终态覆盖、输入语义保真、取消与发布竞争、无音频可终结、输入合并与优先级矩阵符合率，均写建议且阈值需确认，未提供实测值。（来源：`guide-rewrite-20261030/input-main.json:5927-5961`，`/modules/2/metrics/0`…`5`）

- PRD-F096｜主题 11 指标与观测｜取消与发布竞争用全部竞争用例作分母，需同时看候选身份、正式许可、撤销状态、调用登记及旧工具事实保存，不能只看 cancel 返回。（来源：`guide-rewrite-20261030/input-main.json` `/modules/2/metrics/3`）

- PRD-F097｜主题 11 指标与观测｜无音频可终结率分别覆盖静默、纯工具、首字前失败、仅文字和 TTS 失败，结束原因正确且能推进队列、纯工具事实不丢才通过。（来源：`guide-rewrite-20261030/input-main.json` `/modules/2/metrics/4`）

- MT-F005【指标与观测】8 月 13 日口头历史指标为打断线上跑批通过率约 75%、拒识 query 早期约 53% 后来约 60%，不能当现行验收成绩。（来源：chapters/I/raw/m0813.txt:40-47）

- MT-F046【指标与观测】P0 车控 95% 被明确为近期整体推进目标且本周未必达到，不能写成已经稳定达到 95%。（来源：chapters/I/raw/m1013-sls.txt:664-665、2569-2606）

- MT-F051【指标与观测】2.1 lite 当时统计从 VAD 结束到首字符快约 400 到 500 毫秒，但产品体感未明显变快，会上要求联合端侧日志查等待话术与全链路损耗。（来源：chapters/I/raw/m1013-sls.txt:1018-1103）

- MT-F054【指标与观测】会议要求全量产品验收 case 集加每周新增通过目标，明确不能用点检或冒烟集替代完整体验验收。（来源：chapters/I/raw/m1013-sls.txt:1168-1205、1267-1274）

- MT-F059【指标与观测】视线信号连续 10 次均为 not looking 的 0% 观察被认为存在工程链路问题，尚需复测，10 月 20 日前 90% 不现实是当时判断。（来源：chapters/I/raw/m1013-sls.txt:2363-2366、2464-2477）

- CHAT-F021｜指标与观测｜feedback 谁先回谁先展示会使同工具 query 顺序与组件顺序不一致、车控组件少于标题，文件标为体验可接受。（来源：chapters/I/raw/aiva-vui-1104.txt:933–939）

- CHAT-F024｜指标与观测｜“打断恢复”搜索文件头明确只保留前 60000 字，正文在视觉测试表图片元数据中断，内部 success/has_more=false 不代表这份本地副本已保留全部 15 条返回消息。（来源：chapters/I/raw/chat-search-dadunhuifu.txt:1–2、5226–5228；JSON 未闭合）

- CHAT-F026｜指标与观测｜同次测试报告流式拒识准确率 90.31%/目标 95%、尚有 3 个 P0、TTS 概率性打断不恢复，此为整条打断链路测试，不能当输入管理模块的独立通过率。（来源：chapters/I/raw/chat-search-dadunhuifu.txt:71–82，同 message_id）

- CHAT-F027｜指标与观测｜该测试汇总主交互通过率 85%、多屏 54%，并写不合理恢复已与产品对齐、修改后再测，未证明后续已验收通过。（来源：chapters/I/raw/chat-search-dadunhuifu.txt:245–252，同 message_id）

- CHAT-F029｜指标与观测｜聊天附带实车导航报告测试时间为 10 月 15–20 日、版本 CDC1010/1014 与豆包1013，不能把转发时间当该报告的测试时间。（来源：chapters/I/raw/chat-search-dadunhuifu.txt:345–388、439–446）

- CHAT-F031｜指标与观测｜附带 AI Bot 报告表格 Fail23/Block27 与说明 Fail26/Block24 不一致，但该表属于表情测试，不能拿来量化 M 章输入管理质量。（来源：chapters/I/raw/chat-search-dadunhuifu.txt:4423–4484）

- CHAT-F032｜指标与观测｜该文件外层 status=partial、truncated=true，并明示“不得据此声称已完整读取”，content_excerpt 仅 60000 字符，必须把本地文件读完与原始消息结果完整两件事分开。（来源：chapters/I/raw/chat-search-dadunbuhuifu.json:1，$.status、$.truncated、$.notice、$.content_excerpt）

- CHAT-F035｜指标与观测｜“打断恢复后应答率”检索只有一条命中，但外层 status=partial 且仅存 60000 字符；命中数为一仍不代表附带测试表被完整保存。（来源：chapters/I/raw/chat-search-yingdalv.json:1，$.status、$.truncated、$.notice、$.content_excerpt）

- CHAT-F036｜指标与观测｜10 月 30 日聊天报告赛力斯流式打断后最终 query 被拒识比例约 30%、打断恢复后应答率低，但没有给“应答率”的分子分母或具体值。（来源：chapters/I/raw/chat-search-yingdalv.json:1，$.content_excerpt，message_id=om_x100b617ebbd1e8a4c135d7ed24e5d56.text，第 8 项）

- CHAT-F039｜指标与观测｜周报 10 月 23 日列用流式拒识 90% 目标判 90.31% 达标，11 月 6 日列改以 95% 为目标判同值不达标，指标目标有演进而非准确率算错。（来源：chapters/I/raw/chat-search-yingdalv.json:1，$.content_excerpt，sheet=dZ9yv7，离线拒识/流式打断/离线车控行，对应两日期列）

- CHAT-F058｜指标与观测｜早期整理建议分别统计多请求合并边界正确率、在途反馈保全率、恢复遗漏重复率及停播原因可追溯性，且明确阈值需项目确认，不能当已上线指标或目标值。（来源：guide-rewrite-20261030/input-async.json，$.modules[0].metrics[3]、metrics[5–7]）

- CHAT-F070｜指标与观测｜早期排障接口以 request_id/log_id/设备/事件时间定位客户端记录，query 至少一个非时间条件、limit 默认 20 最大 50，首批未查到不证明从未上报。（来源：guide-rewrite-20261030/input-support.json，$.pages[6].sections[2].paragraphs[1–3]；这些数字属于客户端排障查询，不属于输入队列容量）

- CHAT-F073｜指标与观测｜input-support 与 input-async 复用同一组 M 内部边和跨章边，不是两份独立证据；其中 X44 把真实 STARTED/PROGRESS/FINISHED/ABORTED 送往 M10，X09 仍是 planned 异步 feedback。（来源：guide-rewrite-20261030/input-support.json，$.edges[75–90]、$.edges[378]、$.edges[413]；与 input-async 同节点/边 ID）

- **PAGE-F004** 【指标与观测】旧字段 m-lesson-4 仍有意图理解>98%、拒识召回>98%、打断体验>80%，指定输入技术方案和 PRD 未提供该三值的输入管理验收依据，本章不直接继承该指标。（来源：`chapters/M/old-page.json:$.sections[3].paragraphs[5]；chapters/M/notes.md:L163`）

- **NOTE-F005** 【指标与观测】已有笔记记录废弃冲突策略与异步反馈文档无权限、技术图与历史策略为图片、无测试报告与线上队列指标，不能从缺图文字补造接口。（来源：`chapters/M/notes.md:L167-173`）


## 排期与现状

- **TECH-F089** 技术方案正文按 2026-10-23 17:02 编辑快照研究，工作包列的是建设内容与完成标准，文件本身未证明模块已上线。（来源：`chapters/I/raw/input-tech.txt:L1,1157-1207`）

- **TECH-F090** 独立异步 callback、高优任务抢占与不进播报的 AIGC 不属于首期上线前置，不能按预留设计宣称已经支持。（来源：`chapters/I/raw/input-tech.txt:L141-147,184-187`）

- PRD-F018｜主题 12 排期与现状｜版本表为 7 月 11 日 v0.1/v0.2、7 月 13 日 v0.3、9 月 20 日 v0.4、10 月 13 日 v0.5，v0.5 补充排队和拼接，编辑时间不是上线时间。（来源：`chapters/I/raw/input-prd.txt:2,6-55`）

- PRD-F019｜主题 12 排期与现状｜主文高优 advice 多次标“当前无”，高优任务保持标“先不看”，不属于已交付事实。（来源：`chapters/I/raw/input-prd.txt:118-128,269-272,670-674`）

- PRD-F037｜主题 12 排期与现状｜版本表 v1.7 为 10 月 12 日，补打断恢复、emoji、分场景验收等，文件快照 edit 为 11 月 2 日，两种时间不应混当上线日期。（来源：`chapters/I/raw/director-prd.txt:1,75-93`）

- PRD-F051｜主题 12 排期与现状｜旧文估打断 1–2 天、续播 4 天，长期 SOP 流式拒识与恢复方案仍写待定，不能作为现行交付状态。（来源：`chapters/I/raw/interrupt-prd.txt:55-58`）

- PRD-F087｜主题 12 排期与现状｜该整理为工作包评审清单，客户端协议先确认再排期，不能由“设计了两 Key/租约/超时”推断已经上线。（来源：`lecture-rewrite-20261029/source-补查-input-management.md:662-687`）

- PRD-F099｜主题 12 排期与现状｜input-main 是已加工学习站输入，来源只映射标题与 URL，M 页面及节点的设计不能替代 input-tech 或真实文字记录证明上线与事故。（来源：`guide-rewrite-20261030/input-main.json` `/pages/2/sourceIds`、`/sources`；本次递归遍历 1972 个对象、3855 个数组、8303 条字符串、8185 个其余标量）

- MT-F008【排期与现状】8 月 13 日决定 Alex 演示前不改打断策略，另开专项识别量产前必解问题，此结论不证明后续已完成。（来源：chapters/I/raw/m0813.txt:49-74）

- MT-F029【排期与现状】长时导览被打断后按未完成目标重新拉起是讨论的设计，会上明确主线还在做、赛力斯未提测、未向东风承诺，提问其实来自奇瑞交流。（来源：chapters/I/raw/m1019.txt:440-477）

- MT-F038【排期与现状】美团任务岛信息透传与到号/订座提醒最终建议分两期，先透传 AI Bar，再补业务知识与提醒卡，不能把原型当已实现。（来源：chapters/I/raw/m1020.txt:808-891）

- MT-F042【排期与现状】生成式 AI HMI 与长时任务当时分别在做、尚未打通，自动触发还是按钮跳转仍需统一。（来源：chapters/I/raw/m1020.txt:824-876）

- MT-F044【排期与现状】10 月 13 日专项以 10 月 20 日全功能提测和现场体验为目标，会上多处仍是承诺与待测，不能据日期推断已完成。（来源：chapters/I/raw/m1013-sls.txt:1-8）

- MT-F055【排期与现状】主动服务测试当时按实车可测、mock 可测、未完成依赖 block 分类，本周计划全面摸底而非所有设计均可实车演示。（来源：chapters/I/raw/m1013-sls.txt:2083-2093）

- MT-F057【排期与现状】动态任务 P0 约 20 条中有七八条依赖风险，P0/P1/P2 总计百余条，会上最终澄清目标是先测暴露问题，未必全部实现。（来源：chapters/I/raw/m1013-sls.txt:2098-2099、2215-2297）

- MT-F060【排期与现状】多屏交互整体需求跨过 10 月 20 日，最多先上一部分，各客户端模块还需对排期。（来源：chapters/I/raw/m1013-sls.txt:1939-1973）

- MT-F070【排期与现状】SOP 系统通知接入与播报规则为内部预研，配置范围含通知类型、展示优先级、播报与是否允许打断，未定义所有通知统一 P1。（来源：AI汽车SOP功能清单 (1).xlsx，【子功能】规则、知识与安全干预!D15:J16）

- MT-F072【排期与现状】SOP 总表任务交互卡片为内部预研，但即时卡片子项为可量产、长时卡片子项为内部预研，父子状态不能直接互相覆盖。（来源：AI汽车SOP功能清单 (1).xlsx，全量功能清单!B18:J18；【子功能】交互表达!D5:J8）

- MT-F073【排期与现状】SOP 总表 TTS 和交互氛围灯为可量产而架构依赖表对应旧条目为内部预研，2026 年 10 月 27 日清单校准记录没有证明架构表已同步。（来源：AI汽车SOP功能清单 (1).xlsx，全量功能清单!B19:G22；全量功能清单-架构依赖!B25:G27；【必读】清单说明&change log!G6:I13）

- CHAT-F023｜排期与现状｜修订表记录 7 月建稿和补充、9 月 10 日补多人多屏，11 月 4 日编辑时间不能证明每条正文规则都已升级。（来源：chapters/I/raw/aiva-vui-1104.txt:1、15–49）

- CHAT-F028｜排期与现状｜该测试汇总说任务创建后频繁打扰、满足条件却不触发等问题仍在，不能用“任务创建成功”替代触发与播报闭环验收。（来源：chapters/I/raw/chat-search-dadunhuifu.txt:138–155，同 message_id）

- CHAT-F034｜排期与现状｜11 月 12 日新卡片只显示媒体专项 Bug 看板标题和“请升级至最新版本客户端”，不能据此认定 11 月 6 日恢复问题已经修复。（来源：chapters/I/raw/chat-search-dadunbuhuifu.json:1，$.content_excerpt，message_id=om_x100b60667c7f28bcb0761e49c9b6627.text）

- CHAT-F038｜排期与现状｜同张周报说 QNN 新包 10 月 27 日在 310 车加载成功、现场 P0 打断恢复链路验证通畅，而 11 月 6 日列仍记 TTS 概率不恢复和 3 个 P0，局部验证通过不等于全场景修复。（来源：chapters/I/raw/chat-search-yingdalv.json:1，$.content_excerpt，sheet=dZ9yv7，离线拒识/流式打断/离线车控行，20261030 与 20261106 列；11 月 6 日较新）

- CHAT-F043｜排期与现状｜周报 10 月 23 日写即时卡片/AIbar 有条件上线、任务中心通过，但部分触发取消循环入口放大未实现，10 月 30 日说定时条件功能测试完成/bug 修复、整体进度 62%，11 月 6 日又有长时任务问题，范围和日期必须一起标注。（来源：chapters/I/raw/chat-search-yingdalv.json:1，$.content_excerpt，sheet=dZ9yv7，动态 advisor 行各日期列）

- CHAT-F045｜排期与现状｜附带专家任务集列出 P0 展车 11 月 27 日（精确节点待确认）、P1 先锋用户 12 月 25 日、P2 最终验证 1 月 28 日，这些是项目节点而非输入管理单模块上线承诺。（来源：chapters/I/raw/chat-search-yingdalv.json:1，$.content_excerpt，sheet=dZ9yv7，专家任务集行）

- **NOTE-F001** 【排期与现状】已有笔记记载 7/11 v0.1、7/14 评审、7/20 0804 高风险，8/18 计划后 HOLD、9/18 重启、10/13 评审、10/16–23 技术评审；这些周报与部分逐字稿不在本次指定 raw，作为二次取证线索。（来源：`chapters/M/notes.md:L114-121`）

- **NOTE-F002** 【排期与现状】已有笔记引 11/2–11/13 周报：10/23–11/13 开发 55%，计划 11/16–18 实车验证及提测、11/23–27 测试验收，负责人吕鹏浩、牛超、于庆磊，不能视为 11/16 已达成。（来源：`chapters/M/notes.md:L121-121`）

- **NOTE-F003** 【排期与现状】已有笔记指出两个连续周报均为开发 55% 未更新，因此该百分比不是本日进度。（来源：`chapters/M/notes.md:L181-181`）

## 资料冲突与设计缺口清单

共 27 项对照，包含真正未统一的规则、已经辨清的版本差异、范围差异和原文缺口；不是 27 项都待产品拍板。表内 raw 文件名默认位于 `chapters/I/raw/`，`source-补查-input-management.md` 位于 `lecture-rewrite-20261029/`，XLSX 默认用户指定下载文件。

| ID | 冲突或缺口 | 说法 A | 说法 B | 哪份更新/更适用 | 研究判断 | 来源位置 |
|---|---|---|---|---|---|---|
| C01 | P1 处理中排队还是重算 | PRD v0.5 未完整未起播不分输入类型就合并；技术范围 Event 行也允许合并。 | 技术准入表规定忙时 P1 排队；后部预跑消费又允许新 Input 废弃候选合算。 | PRD 正文版本10/13；技术快照10/23，但技术内部仍有分歧。 | 未统一；需区分“撤销未发布候选”和“抢占正式输出”。 | input-prd.txt:104-111,190-203；input-tech.txt:163,421-432,967 |
| C02 | 已起播而未完整输出，旧输入是否可执行合并 | PRD 允许用户打断推理/播报并合并新旧输入；技术范围表按未完成允许合并。 | 技术准入表及 S2 只执行 B，A 仅作中断上下文。 | 技术较新，但自身范围表与 S2 不一致。 | 未统一；工具已放行不可重放是必须守住的边界。 | input-prd.txt:112-120,205-235；input-tech.txt:107,427,546 |
| C03 | “PRD 以首字为界”的误述 | 技术方案转述 PRD 为首 token 前合并。 | PRD 自己写未完整输出且未起播，并用尚未调用工具解释。 | PRD 原话优先；首 token 是旧实现/10月19日宣讲边界。 | 已辨清；不可把技术转述当 PRD 引文。 | input-tech.txt:393；input-prd.txt:104-111；m1019.txt:89-90；chapters/M/review.md:34-40 |
| C04 | 执行版本每次加一 vs 全局唯一 | 10/29 路径的早期副本为 DirectorExecutionVersion 递增。 | 现行 DirectorExecutionID 由 GenTID 生成，全局唯一，仅比相等。 | 以现行技术正文为新；副本保存日期不等内容修订日期。 | 已辨清；不做 ID-1 或数值先后比较。 | lecture-rewrite-20261029/source-补查-input-management.md:122-137,323-352；input-tech.txt:388,588-607 |
| C05 | 同 Advisor 覆盖与 advice TTL | PRD 历史段、旧图 M8、input-main M5 保留同 Advisor 最新覆盖及过期丢弃。 | 现行每 Task Run 独立保留，task_run_id 幂等，无输入业务 TTL。 | PRD 旧段明确“先不看”；input-tech 现行为基准。 | 已辨清历史残留；任务 DeadlineAt 与输入 TTL 分开。 | input-prd.txt:589-604；input-tech.txt:523-527；input-main.json:/modules/2/nodes/4；当前v63:DATA.base.modules[id=M].nodes[id=M8] |
| C06 | 工具反馈单独处理 vs 与用户补话重推 | 现行映射 feedback=isolated；旧 PRD 还曾允许简单反馈合并。 | 现行示例本轮 feedback 可和新用户、waiting 重算。 | 旧反馈合并是历史；现行“isolated 出队”与“当前轮被 P0 重推”是不同场景。 | 已解释边界；不能写反馈在任何阶段都绝对单独。 | input-prd.txt:568-569；input-tech.txt:459-465,432,720-725 |
| C07 | 多人输入文本拼接 vs 结构化数组 | 多人 PRD 写主驾驶说X、副驾驶说Y。 | 输入 PRD 与技术实现保留每条来源的数组。 | 多人 PRD 编辑8/24；输入PRD正文10/13及技术10/23更具体。 | 已辨清结构演进；音区不默认决定优先级。 | multi-prd.txt:73-83；input-prd.txt:129-145；input-tech.txt:713-725,825 |
| C08 | 同步工具续轮 vs 独立异步 callback | 技术字典/S7、旧整理多处泛称异步反馈新 Input。 | 首期范围明确只有同步工具完整批次续轮，没有独立持久 callback 能力。 | 现行技术范围明确；同文泛称与未来预留需分层。 | 范围差异；禁止把流式返回写成持久异步已支持。 | input-tech.txt:141-155,184-186,329,525,561；input-main.json:/edges[id=X09] |
| C09 | 最终拒识后的恢复路径 | AIVA 写最终拒识 NLG 不恢复；V章讲 Event重推。 | 打断PRD含缓存PCM续播；I章与现行技术分暂停同对象续播和停止后新Event。 | 按车型/分支和演进区分，11/4文件编辑时间不能让旧段自动成最新。 | 未有统一全车型现网结论；ABORTED 永不复活。 | aiva-vui-1104.txt:306-307；interrupt-prd.txt:35-60；input-tech.txt:549,961；overlap.md:O-X01 |
| C10 | 首文本前/纯工具执行怎样取得正式许可 | 技术明确可能先 Tool call 后文字。 | 工具出口要求匹配 CommittedOutputExecutionID，明确赋值路径却仅首段文本放行。 | 同一现行技术文件内部缺口。 | 未展开；需补纯工具发布身份路径，不凭空实现。 | input-tech.txt:391-397,774-784 |
| C11 | 播放消费时长三个字段名 | 事件示例/客户端计时为 played_media_ms。 | 字段表为 duration_ms，超时数据结构为 played_duration_ms。 | 同一现行技术文件。 | 接口映射未明示；不能默认三者是同一个外部字段。 | input-tech.txt:889,911-915,947,1020,1072-1074 |
| C12 | 丢终态后的人工推进 vs 硬超时自动推进 | 恢复段说重连仍无法恢复时告警并受控人工确认结束。 | 后部超时段规定 hard_deadline 到后自动以独立超时原因解门。 | 同文件后部新增更细超时路径，但适用关系没有完全说明。 | 需确认自动兜底与人工操作边界。 | input-tech.txt:814,1126-1136 |
| C13 | 八类场景 vs 验收七类 | 场景一至八、正文和阅读说明都按8类。 | 工作包验收一行写七类。 | 同一技术快照。 | 编辑差异；研究保留8类，不漏第7/8场景。 | input-tech.txt:60,334-355,539-564,1205 |
| C14 | 旧首token与首Planner item并非同一证据 | 宣讲/旧OnePager用首 token 边界简述。 | 现行技术对旧代码复盘明确首个 item 可能是工具、并非用户可见字。 | 技术10/23对实现更细；仍不能由此宣称所有旧实现一致。 | 已辨清粒度；起播、首展示字、工具放行分开观测。 | m1019.txt:89-90；planner-onepage.txt:297-299；input-tech.txt:824-828 |
| C15 | 出卡时机与语音输出许可 | PRD异步反馈衍生要求由工具结果被Planner处理决定出卡。 | I章允许即时卡随工具返回展示，语音另等调度。 | PRD原文为异步衍生设计；I章是已写教学稿而非上线证据。 | 范围未统一；区分即时卡和异步交互卡，不能以语音许可拦所有卡片。 | input-prd.txt:147-148；I-v2/full.md:240,428；overlap.md:O-X03 |
| C16 | 一个有效执行 vs 候选与正式输出双引用 | 旧设计和当前开篇简述同一时刻一次推理生效。 | 现行允许一个有效候选+一个未撤销正式输出，ID可以不同。 | 技术现行详细约束优先。 | 已解释；新候选不使前序合法播放失效。 | input-tech.txt:5,201,531-535,604；source-补查-input-management.md:122-137 |
| C17 | 旧页面指标能否继承 | 旧字段列意图理解>98%、拒识召回>98%、打断体验>80%。 | 本次输入技术/PRD未找到该三值为输入管理验收指标的依据。 | 没有源更新关系可证明；旧加工数字不具准出效力。 | 证据缺口；不作为本章现行目标。 | chapters/M/old-page.json:$.sections[3].paragraphs[5]；chapters/M/notes.md:163；input-tech.txt:1203-1207 |
| C18 | 量产标签 vs 新统一模块开发状态 | SOP 对话节奏管理标可量产。 | 笔记引周报新版统一输入管理仍开发55%、计划11月底验收。 | 两者范围不同；周报快照也不是11/16实测刷新。 | 非直接矛盾；分散已有能力不等新版模块已上线。 | XLSX:全量功能清单!B5:J5；chapters/M/notes.md:114-121,159,181 |
| C19 | SOP 父子/总表/架构交付状态 | TTS/灯效总表可量产，任务卡父项预研、即时子项量产，触发运行子项量产。 | 架构TTS/灯效旧项预研、运营触发配置面预研。 | 10/27 change log证明校准过总表/子表，但无逐项时间证明架构同步。 | 保留每项状态和范围，不能一键统一。 | XLSX:全量功能清单!B18:G22；全量功能清单-架构依赖!B25:G27；【子功能】交互表达!D5:J8；输入触发管理!D21:J22；规则、知识与安全干预!D5:J6 |
| C20 | 连续聆听30/60秒、能否配置、强/延时叫法 | AIVA前文60秒，详细定义30秒不可自定义，主动服务段还写播完强聆听。 | SOP连续对话支持设置时长；宣讲固定30秒；其他段称延时聆听。 | AIVA详细定义更具体，SOP缺逐项更新时间，不能硬判已覆盖。 | 与 M 软硬期限无关；车型现网需另核。 | aiva-vui-1104.txt:167-171,454-473,575-583,1082-1084；m1019.txt:116-123；XLSX:输入触发管理!D12:J12 |
| C21 | 点击应为event还是模拟query | 10/19宣讲泛称点击模拟query。 | AIVA区分工具/系统卡点击直接执行报event、静态Advisor仍模拟query；W章概括手点event。 | AIVA11/4快照较细但含分支；不能将W教学稿当原始事实覆盖一切。 | 需按卡片类型和车型保留入口来源，不把所有手点一刀切。 | m1019.txt:158-159,200-201；aiva-vui-1104.txt:482-487；W-v2/full.md:285-301 |
| C22 | 合并后车控来源安全标签 | 逐条输入有 query/advisor 原来源，郝晓伟说可区分。 | 11/3内审暂倾向合并时整体按更安全主动推荐下发。 | 11/3晚于技术快照，只有notes/review二次取证，未本次重读内审原件。 | 未落定接口粒度；赛力斯除雾时推荐关空调应拒，用户指令另论。 | chapters/M/notes.md:149,179；chapters/M/review.md:76-81 |
| C23 | query触发器直接打断还是走主动服务 | 10/23群讨论倾向用户触发应直接打断并加特殊标识。 | 同群后续同意走主动服务链路，但未解释该链路最终P0/P1。 | 同日11:58-14:17不同发言；本次原件未纳指定聊天副本。 | 仅二次线索；不能把“走主动服务”直接等同已定排队。 | chapters/M/notes.md:73,150；当前v63:m-plan-p1表 |
| C24 | 补查旧场景三标题和技术正文不符 | 标题为最终拒识后恢复Event。 | 旧S3正文却复用有效B作为执行输入的描述。 | 现行技术S3已明确暂停续播与独立恢复Event分开。 | 以现行修正；不能把无效闲聊当新可执行任务。 | source-补查-input-management.md:157,276-277；input-tech.txt:547-549 |
| C25 | 软超时是否意味着用户已经听完 | 旧页面把软期限解释为播放完成但通知未确认。 | 现行只标 FINISH_UNCONFIRMED，无法确认，暂不推进。 | 现行技术详细规则优先。 | 已纠正；硬超时解门同样不证明播完。 | chapters/M/old-page.json:$.sections[3].paragraphs[6]；input-tech.txt:1055,1126-1142 |
| C26 | 全车一流与按座位隔离状态 | 旧M3文本强调别把另座位状态当前台占用，易读成每音区一流。 | 现行共享范围为 channel+vehicle_id+chat_id，音区只是输入来源，屏幕可独立保持。 | 现行技术粒度明确。 | 已辨清；不新造每车一个Chat或每座位一个Planner限制。 | 当前v63:DATA.base.modules[id=M].nodes[id=M3]；input-tech.txt:265,751,819-847 |
| C27 | 指标判断和排期看起来互相否定 | 10/23流式90.31%相对90%达标；10/27局部链路通过。 | 11/6相同准确率按95%目标不达标，恢复故障仍在，开发55%两期未更新。 | 后日期较新，目标/范围/样本不同。 | 非同一成绩被改写；局部通过不等全链修复，旧进度不当本日实测。 | chat-search-yingdalv.json:$.content_excerpt周报各日期列；chapters/M/notes.md:181 |

## 尚缺原始证据的开放项

- 10/27 advice 消费回执、静态打招呼仅未交互时输出、11/6 上汽外部 mock advice 接口：当前只在 `chapters/M/notes.md:L151-154` 与旧网页中取得，未用作已经实现的产品事实。
- 当前车型/渠道/客户端升级名单、模块测试报告、正式上线验收结果、现网 queue_depth 等数值：指定材料未给；计划时间不能替代验收。
- 已废弃冲突策略、允许异步 tool feedback 文档：已有笔记记录无权限，本次没有重新获取，不能声称已读。
- 原始技术方案8张场景图/架构图和PRD历史策略图片：本地txt只保留标题或空白，无法由文字补造图中细节；本地M的6张SVG是旧教学图，不是原始方案图片。

## 读取账与证据边界

以下是本次指定文本/JSON/本地SVG的读取账，正文文本逐份全文阅读后增量写入；较早guide JSON完整解析所有结构，精读全部M相关文本与来源映射，布局数字不作为业务事实；SVG只离线读文字与关系，未做浏览器视觉验收。SHA256用于标识本次快照，不代表原始网页现网内容已刷新。

| 文件 | 本地行数 | 读取范围/限制 | SHA256前12位 |
|---|---:|---|---|
| `V-STANDARD.md` | 48 | 全文 | `c42609f9c346` |
| `component-cards.md` | 200 | 全文 | `0353d75241c9` |
| `chapters/M/notes.md` | 182 | 全文 | `b3d8dcf33610` |
| `chapters/M/review.md` | 195 | 全文 | `b0c9233bfdc8` |
| `chapters/M/selfcheck.md` | 66 | 全文 | `c5b332418e84` |
| `chapters/M/old-page.json` | 395 | 全文 | `b3cf15fb1407` |
| `chapters/M/diagrams.json` | 1 | 全文 | `58d2356e524f` |
| `chapters/M/svg/m-evolution.svg` | 1 | XML全部文字和关系，未验视觉布局 | `d698a9e42f42` |
| `chapters/M/svg/m-matrix.svg` | 1 | XML全部文字和关系，未验视觉布局 | `d5ebc8f5bf35` |
| `chapters/M/svg/m-multizone.svg` | 1 | XML全部文字和关系，未验视觉布局 | `f57f96571d2e` |
| `chapters/M/svg/m-overview.svg` | 1 | XML全部文字和关系，未验视觉布局 | `79560aaa44c4` |
| `chapters/M/svg/m-replay.svg` | 1 | XML全部文字和关系，未验视觉布局 | `38442ecfdc4b` |
| `chapters/M/svg/m-timeline.svg` | 1 | XML全部文字和关系，未验视觉布局 | `634cf4afc874` |
| `chapters/I/raw/input-tech.txt` | 1210 | 全文 | `db341a4cd665` |
| `chapters/I/raw/input-prd.txt` | 706 | 全文 | `95e37461d2e3` |
| `chapters/I/raw/multi-prd.txt` | 127 | 全文 | `b8abf306e6b4` |
| `chapters/I/raw/director-prd.txt` | 1577 | 全文 | `949d61d44d54` |
| `chapters/I/raw/planner-onepage.txt` | 370 | 全文 | `2eb5f5f55eb2` |
| `chapters/I/raw/interrupt-prd.txt` | 61 | 全文 | `91887cefc31a` |
| `chapters/I/raw/voice-onepager.txt` | 571 | 全文 | `0ed4018d16a2` |
| `chapters/I/raw/aiva-vui-1104.txt` | 1194 | 全文 | `c38ef51f8757` |
| `chapters/I/raw/m0813.txt` | 1092 | 全文 | `a6070dec0060` |
| `chapters/I/raw/m1013-sls.txt` | 2766 | 全文 | `b1e7b1e685b5` |
| `chapters/I/raw/m1019.txt` | 538 | 全文 | `6b6e1b2baa23` |
| `chapters/I/raw/m1020.txt` | 925 | 全文 | `f406225cfb1b` |
| `chapters/I/raw/chat-search-dadunbuhuifu.json` | 1 | 本地文件全文；原始检索已截断/partial | `2db664d6fd3b` |
| `chapters/I/raw/chat-search-dadunhuifu.txt` | 5228 | 本地文件全文；原始检索已截断/partial | `8b34005c066d` |
| `chapters/I/raw/chat-search-yingdalv.json` | 1 | 本地文件全文；原始检索已截断/partial | `c945daa54168` |
| `lecture-rewrite-20261029/source-补查-input-management.md` | 688 | 全文 | `fb24f43b8904` |
| `guide-rewrite-20261030/input-main.json` | 28067 | 全结构/全字符串遍历；全部M相关正文、节点、边及引文精读；二次加工稿 | `903da3e7b5d4` |
| `guide-rewrite-20261030/input-async.json` | 27472 | 全结构/全字符串遍历；全部M相关正文、节点、边及引文精读；二次加工稿 | `599f06220211` |
| `guide-rewrite-20261030/input-support.json` | 27053 | 全结构/全字符串遍历；全部M相关正文、节点、边及引文精读；二次加工稿 | `ff2fcc8159ad` |
| `v57-rewrite/full-v59.md` | 1361 | 全文 | `0b9bb53f8cfa` |
| `R-v2/full-v62.md` | 773 | 全文 | `bc57ab4ac6c5` |
| `I-v2/full.md` | 713 | 全文 | `bd5b5bede686` |
| `W-v2/full.md` | 664 | 全文 | `dc6c13978a22` |

补核 `v-lesson-20261107/raw/road-0811.txt:L1753-1767,L2657-2677`、`issues-0914.txt:L30,L32` 的明确相关记录，未宣称两文件全文研究；v63整份DATA离线解析，重点M可见15区块、6配图、原12节点及隐藏旧字段，完整位置见 destinations-base.md；XLSX全部13表逐行遍历，逐单元格对照与原表SHA见 sop-items.md。
