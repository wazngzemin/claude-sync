# F 章当前网页知识点底表

本表登记既有网页的说法，不把网页断言当成已核实原文事实；事实取舍见 facts.md。未改网页、未启动浏览器。

## 基线与定位

- 当前页：`HTML/01-进行中/豆包汽车-业务学习站-v70.html`；主体 JSON 全部位于物理第 269 行，用 `DATA.pages[id=F]`、`DATA.base.modules[id=F]` 的 JSON 路径精确定位。
- 已逐字段比较：`DATA.pages[id=F]` 与 `research/chapters/F/old-page.json` 完全一致；旧页文件为可读换行版，后文同时给它的行号。
- `research/chapters/F/` 没有 notes 文件；含 old-page.json、diagrams.json、diagrams.py、5 个 SVG 和对应 5 个 PNG、15 个 raw。
- 本表知识点按同义段落去重；同一文字在 sections 和 teaching.lessons 重复时保留两个位置索引，不增加条目数；句内独立判断用分号保留在同一条中。

## 当前 F 阅读页的知识点

- [DEST-001] 工具定义告诉 Director 能做什么，渠道实现决定由谁执行，统一协议把实际结果送回主链。
  - 定位：`DATA.pages[id=F].summary`；锚点 `F`；网页 L269；旧页 L5。
- [DEST-002] 用户要求“播放我喜欢的歌”，Director 需要知道本车接入了哪项音乐能力，以及这项能力是否支持用户要求的操作。同一个工具名可以在不同项目对应不同提供方，后台中存在这个名字，只是接入的起点。
  - 定位：`DATA.pages[id=F].scenario`；锚点 `F`；网页 L269；旧页 L6。
- [DEST-003] **一个工具能不能被调用，先看它在当前这辆车、这个项目里有没有正式启用。**Director PRD 里列了 33 个标准化业务行，但不是每个项目都全量开通。必选工具包括车辆控制、车辆状态查询、车书查询、POI 查询、路线规划、地图控制、人脸身份注册、记忆操作、记忆检索、音乐查询推荐、媒体控制、联网信息搜索、任务管理；可选工具包括视频搜索、天气查询、AI 播客生成、图片生成、VQA、录音纪要、行程规划、餐厅订座、停车缴费等。
  - 定位：`DATA.pages[id=F].sections[0].paragraphs[0]`；锚点 `f-lesson-available`；网页 L269；旧页 L39。
- [DEST-004] 正常联网、本地规则命中、云端超时和断网，应按R章对应车型及版本的采信规则选结果。早期白名单本地优先和9月30日确定性缓存独立优先不是同一口径。本章判断工具能否在本项目调用，不再把“FC生成一个候选”写成它必然优先执行。生成参数、获得执行权、车辆完成动作是三个不同进度。
  - 定位：`DATA.pages[id=F].sections[0].paragraphs[1]`；锚点 `f-lesson-available`；网页 L269；旧页 L40。
- [DEST-005] 模型名称与工具接入是不同问题。1.7B FC、30B视觉任务、Edge_DT和云端Director的具体职责已在R章按输入输出单独讲清；这里继续看模型本轮能获得哪些工具说明。即使本车部署了视觉或文本模型，也不意味着地图、媒体、车控和记忆接口全部接入，更不表示当前用户已获授权。[VLM任务定义](https://bytedance.larkoffice.com/wiki/NuunwklpIiGS91kg7lRcAprqnMd?from=lark_search_qa&ccm_open_type=lark_search_qa#TvdtdyavUoaSltxkMcsc9mGCnvb)
  - 定位：`DATA.pages[id=F].sections[0].paragraphs[2]`；锚点 `f-lesson-available`；网页 L269；旧页 L41。
- [DEST-006] 当前车型、渠道、应用、环境、已发布实现和权限，决定工具能否参与这一轮。某个后台里存在定义，只证明曾建立过一项能力；还要找到当前项目启用的实现与版本。车型没有设备、账号无权、现在不宜执行，需要不同结果，不能都归成模型没听懂。
  - 定位：`DATA.pages[id=F].sections[0].paragraphs[3]`；锚点 `f-lesson-available`；网页 L269；旧页 L42。
- [DEST-007] **工具什么时候出现，由当前请求的条件决定，不是所有工具都同时摆在面前。**Director 的 context 里有「可用工具及 emoji」这一项，但它是按需注入的，不是 33 个工具全塞进去。当前车型不支持的工具、当前账号没权限的工具、当前状态不满足的工具，不会出现在这一轮的可用列表里。
  - 定位：`DATA.pages[id=F].sections[1].paragraphs[0]`；锚点 `f-lesson-dynamic`；网页 L269；旧页 L59。
- [DEST-008] 车型配置决定工具有没有。氛围灯工具 ambient_light_control 是上汽项目定制，其他项目没有；用车报告工具 car_log 是上汽定制；车辆维养问答工具 car_care_qa 也是上汽定制。这些工具的本身不接受定制，仅允许下游适配（如协议层）。
  - 定位：`DATA.pages[id=F].sections[1].paragraphs[1]`；锚点 `f-lesson-dynamic`；网页 L269；旧页 L60。
- [DEST-009] 人脸注册工具帮助建立身份，不应因为尚未注册人脸就笼统判定注册工具不可用。要核对的是本车有无注册能力、当前流程是否允许以及是否取得对应授权。记忆读写则依赖它自己的账号、身份和开关规则：开关关闭时先请求授权或提示开启，不能因工具在列表里就绕过这些条件。
  - 定位：`DATA.pages[id=F].sections[1].paragraphs[2]`；锚点 `f-lesson-dynamic`；网页 L269；旧页 L61。
- [DEST-010] 当前状态决定工具合不合适。用户说「车里好热」，端状态显示空调已经是最低温度，就不该再拆解出调低空调；用户说「外面好吵」，端状态显示车窗已经关了，就不该再拆解出关窗。结合端状态推理，是避免无效动作的关键。
  - 定位：`DATA.pages[id=F].sections[1].paragraphs[3]`；锚点 `f-lesson-dynamic`；网页 L269；旧页 L62。
- [DEST-011] 当前情景决定工具选哪个。外面正在下大雨，用户说「车里闷」，就不能拆解出开窗透气；后排有老人和宝宝，用户说「车里热」，就不能把大风量对着后排吹。这些不是写死的规则，是 Director 结合 context 推理出来的。
  - 定位：`DATA.pages[id=F].sections[1].paragraphs[4]`；锚点 `f-lesson-dynamic`；网页 L269；旧页 L63。
- [DEST-012] 记忆决定工具的参数。用户说「去昨天那个游泳馆」，记忆里有昨天去的游泳馆地址，就直接发起导航；记忆里没有，就先调记忆查询工具。用户说「给明骏把座椅加热开了」，基于乘客关系记录，知道明骏坐副驾，就把参数改成打开副驾座椅加热。
  - 定位：`DATA.pages[id=F].sections[1].paragraphs[5]`；锚点 `f-lesson-dynamic`；网页 L269；旧页 L64。
- [DEST-013] **把一次工具调用交给下游，必须带清楚它属于谁。**AgentServer 是根代理，浏览器核正常、Fallback、Redirect 三种状态，按 Agent 执行而非全计划编排。它能把一个 Agent 调通，但不会因此接管整套多工具规划——泳馆地址查完以后是否导航，仍由外层 Director 决定。
  - 定位：`DATA.pages[id=F].sections[2].paragraphs[0]`；锚点 `f-lesson-protocol`；网页 L269；旧页 L77。
- [DEST-014] 三方 Agent 接入协议是 POST/SSE 模式，三路内容、终包、预请求与取消。不能从协议推定全工具实现，每个 Agent 的输入输出要单独核。AI 汽车下游工具输入输出整理表里有 40 行业务定义和反馈，但含重复 ID 和弃用，不等于当前可调用工具数。
  - 定位：`DATA.pages[id=F].sections[2].paragraphs[1]`；锚点 `f-lesson-protocol`；网页 L269；旧页 L78。
- [DEST-015] 同轮互不依赖、也不争抢资源的工具可以并发；导航状态互斥的调用仍需分开。Director 已经决定的本轮动作，不能借执行重试重新提交一份用户没有要求的旧计划。
  - 定位：`DATA.pages[id=F].sections[2].paragraphs[2]`；锚点 `f-lesson-protocol`；网页 L269；旧页 L79。
- [DEST-016] 工具结果为什么必须经输入管理回到 Director，而非执行层内自循环？因为插话优先级、旧轮取消和模型责任要统一。能沿反馈回到输入管理、再到 Director 的反馈判断口，讲清新一轮，才是完整闭环。
  - 定位：`DATA.pages[id=F].sections[2].paragraphs[3]`；锚点 `f-lesson-protocol`；网页 L269；旧页 L80。
- [DEST-017] 迟到回包仍归旧调用。用户刚打断旧轮，迟到的旧计算就不能又发一次操作。用户若明确取消未来提醒，需要另发管理动作进执行入口，停声不等于删任务。
  - 定位：`DATA.pages[id=F].sections[2].paragraphs[4]`；锚点 `f-lesson-protocol`；网页 L269；旧页 L81。
- [DEST-018] 已经产生车控或订单等副作用时，更不能为了显得积极就重来。部分车控、视觉等工具还明确要求失败后不要重复调用。可行的替代方案交 Director 再判断，无法恢复则说明限制或引导手动完成。
  - 定位：`DATA.pages[id=F].sections[2].paragraphs[5]`；锚点 `f-lesson-protocol`；网页 L269；旧页 L82。
- [DEST-019] **流式返回里，给用户看的和给模型判断的内容各是什么，要分开。**Agent 回应流结束，不代表车窗已关；任务创建应答，只能说明保存和注册达到相应阶段；图片仍在生成，也不能说图片已经交付。用户承诺必须停在已有证据的那一层。
  - 定位：`DATA.pages[id=F].sections[3].paragraphs[0]`；锚点 `f-lesson-stream`；网页 L269；旧页 L95。
- [DEST-020] Director输出里的talk_content用于组织回复文字，action_list描述本轮计划调用的动作。下游Agent返回的业务数据和实际结果，是执行反馈；它们不是action_list的另一种叫法。模型计划、调用受理、实际执行以及再次判断要按同一次调用关联。字段集合和具体格式按当前项目协议核对，不能把输出动作列表当成已经完成的工具反馈。
  - 定位：`DATA.pages[id=F].sections[3].paragraphs[1]`；锚点 `f-lesson-stream`；网页 L269；旧页 L96。
- [DEST-021] 为满足 TTS 的快速合成，第一个标点符号前的内容应该尽量简短。性能目标是 P50 首 token 500 毫秒内，P90 首 token 800 毫秒内。但首 token 不等于用户可听首音，也不等于全部工具完成。
  - 定位：`DATA.pages[id=F].sections[3].paragraphs[2]`；锚点 `f-lesson-stream`；网页 L269；旧页 L97。
- [DEST-022] 首音和播完是不同的验收点。文字已生成、音频已生成、已起播、真实执行，是四个不同的阶段。导航真启动了吗，卡片真上屏了吗，声音真播到用户了吗——这些要逐项比对，不能只看接口回包就给体验打勾。
  - 定位：`DATA.pages[id=F].sections[3].paragraphs[3]`；锚点 `f-lesson-stream`；网页 L269；旧页 L98。
- [DEST-023] E10 说明最新主链路统一由 Director 组织话语；历史明确配置的直返、下游回退、指定转交，则按版本和合同分支展开。它不是从执行层直接跨过模型另生成一份话术。
  - 定位：`DATA.pages[id=F].sections[3].paragraphs[4]`；锚点 `f-lesson-stream`；网页 L269；旧页 L99。
- [DEST-024] 打断恢复是独立于 Director 之外的一套工程逻辑。如果在 TTS 播报时用户主动讲话打断了播报，被打断的信息会返回给 Director，由它判断后续是否继续交互。判断信息价值、话题合并、长内容提炼核心，是打断恢复的三条规则。
  - 定位：`DATA.pages[id=F].sections[3].paragraphs[5]`；锚点 `f-lesson-stream`；网页 L269；旧页 L100。
- [DEST-025] **失败以后，系统应该补哪一层的信息，要分清。**未接入、无权、车辆条件不满足、第三方超时和部分完成，需要不同解释。不能为使故事顺利而猜一个默认结果。
  - 定位：`DATA.pages[id=F].sections[4].paragraphs[0]`；锚点 `f-lesson-exceptions`；网页 L269；旧页 L115。
- [DEST-026] 没查到、没有权限、暂时异常，不能都被改写成「没有这个事实」。工具文字也不能不经判断就直接拿去播。查询结果要带真实地点、候选及必要时间范围；执行结果要指出哪个对象、哪项动作成功，失败也要保留原因和部分结果。
  - 定位：`DATA.pages[id=F].sections[4].paragraphs[1]`；锚点 `f-lesson-exceptions`；网页 L269；旧页 L116。
- [DEST-027] 强多轮任务闭环率是官方准出目标 92%，统计口径是任务完成或因下游原因失败并正确结束话题；不等于真实履约成功率。工具错误应答满意率是 95%，统计口径是合理替代或自然简洁地告知失败。
  - 定位：`DATA.pages[id=F].sections[4].paragraphs[2]`；锚点 `f-lesson-exceptions`；网页 L269；旧页 L117。
- [DEST-028] 离线简单任务是端侧的兜底能力。地库或隧道无网络时，用户说「开空调」「打开车窗」「音量大一点」等简单车控指令，端侧小模型直接理解执行；基础问答如「续航多少」也可离线响应，联网后自动恢复完整能力。
  - 定位：`DATA.pages[id=F].sections[4].paragraphs[3]`；锚点 `f-lesson-exceptions`；网页 L269；旧页 L118。
- [DEST-029] 用户说「播放我喜欢的歌」，Director即使理解了意思，也要知道这辆车接了哪家音乐服务、是否支持搜索和播放、当前账号有没有权限。一份工具定义只说明如何请求某项能力，真正接入的业务实现、当前可用范围和执行回执还要分别确认。否则模型看似计划完整，下一步却找不到可以办事的服务。
  - 定位：`DATA.pages[id=F].teaching.intro[0]`；锚点 `F`；网页 L269；旧页 L138。
- [DEST-030] 能力准入负责让推理拿到当前项目可使用的工具定义；Agent协议负责把一次调用交给执行方，把内容、结果和异常带回主链。端云结果由谁采信，见入口与端云采信章；本章不会再给同一句话定义第二套本地优先规则。先看当前工具与车型、渠道、账号的关系，再看调用和回流，才能分清“模型没有选对工具”和“选对了但业务不支持”。
  - 定位：`DATA.pages[id=F].teaching.intro[1]`；锚点 `F`；网页 L269；旧页 L139。
- [DEST-031] 模型分工和端云采信在R章说明，本章继续处理工具定义、可用实现、调用参数及结果回流。先确认这辆车是否有当前能力，再核对调用协议，最后追到真实结果，避免把“模型生成调用”直接解释成用户的事情已经办成。
  - 定位：`DATA.pages[id=F].teaching.intro[2]`；锚点 `F`；网页 L269；旧页 L140。
- [DEST-032] 这一章讲能力准入与 Agent 协议。读图顺序：先看工具有没有在当前项目启用，再看端云采信规则决定由谁承接，然后看 Agent 协议怎样调用、怎样回流，最后看失败了走哪条兜底。
  - 定位：`DATA.pages[id=F].teaching.guides.base.paragraphs[0]`；锚点 `F`；网页 L269；旧页 L213。
- [DEST-033] 模型规模、任务和部署设备分三件事看。R章按原文分开说明1.4B与1.7B的项目配置；30B MoE视觉任务和Edge_DT文本任务见V1.3及模型规划。Edge_DT已有CDC文本输入、文本输出和时间预估，不能再写成只找到名字；同样不能从一个表格条目推出量产全能力已交付。[VLM输入输出定义V1.3](https://bytedance.larkoffice.com/wiki/NuunwklpIiGS91kg7lRcAprqnMd?from=lark_search_qa&ccm_open_type=lark_search_qa#TvdtdyavUoaSltxkMcsc9mGCnvb)
  - 定位：`DATA.pages[id=F].teaching.guides.base.paragraphs[1]`；锚点 `F`；网页 L269；旧页 L214。
- [DEST-034] 结果采信统一以R章的车型与版本规则解释，本章只继续看当前工具的准入和协议。定义了某项能力、模型生成了参数、业务执行成功，要分别有证据，不以先返回的候选决定车辆已经动作。
  - 定位：`DATA.pages[id=F].teaching.guides.base.paragraphs[2]`；锚点 `F`；网页 L269；旧页 L215。
- [DEST-035] 工具是否在项目启用、当前渠道是否接入和当前操作是否有权限，需要分别核验。首页的AI Launcher只提供推荐与技能入口，它的生成、字段和点击流程见U章，不用首页推荐数量判断工具准入。
  - 定位：`DATA.pages[id=F].teaching.guides.base.paragraphs[3]`；锚点 `F`；网页 L269；旧页 L216。
- [DEST-036] Agent 协议是 POST/SSE 模式，三路内容、终包、预请求与取消。AgentServer 能把一个 Agent 调通，但不会接管整套多工具规划——查完地址以后是否导航，仍由 Director 决定。
  - 定位：`DATA.pages[id=F].teaching.guides.base.paragraphs[4]`；锚点 `F`；网页 L269；旧页 L217。
- [DEST-037] 流式返回先分内容归属：Director的talk_content是计划对用户说的文字，action_list是计划动作；下游返回的查询内容和执行回执供后续判断。流结束只说明这次传输完成，不能直接替代业务结果，也不能拿准备发出的动作当作已经发生的事实。
  - 定位：`DATA.pages[id=F].teaching.guides.base.paragraphs[5]`；锚点 `F`；网页 L269；旧页 L218。
- [DEST-038] 失败处理要分清：未接入、无权、车辆条件不满足、第三方超时和部分完成，需要不同解释。强多轮任务闭环率 92% 是对话正确收束率，不是真实履约成功率。
  - 定位：`DATA.pages[id=F].teaching.guides.base.paragraphs[6]`；锚点 `F`；网页 L269；旧页 L219。
- [DEST-039] 排查口径：遇到 badcase 先定位是端云采信错了、工具没启用、Agent 协议问题，还是端侧模型能力不够。端侧 30B 做弱化 DT 是实验方向，不是已上线能力，不能写进验收。
  - 定位：`DATA.pages[id=F].teaching.guides.base.paragraphs[7]`；锚点 `F`；网页 L269；旧页 L220。
- [DEST-040] 这一章定义的是工具怎样被准入、怎样被调用、结果怎样按协议交回，不定义 Director 怎样排任务顺序、怎样决定下一个动作。
  - 定位：`DATA.pages[id=F].teaching.closing[0]`；锚点 `F`；网页 L269；旧页 L262。
- [DEST-041] 评审时盯三条：四道闸门有没有逐层给出当前请求证据、终包和业务完成有没有分开、直返回退转交给取消有没有按四种不同去向分别统计。
  - 定位：`DATA.pages[id=F].teaching.closing[1]`；锚点 `F`；网页 L269；旧页 L263。
- [DEST-042] 讲清工具定义、项目接入与回流协议怎样共同决定一次能力调用。
  - 定位：`DATA.pages[id=F].feynman.goal`；锚点 `F`；网页 L269；旧页 L281。
- [DEST-043] 同样说‘播放音乐’，一款车可以办理，另一款车却提示能力不可用。
  - 定位：`DATA.pages[id=F].feynman.scenario`；锚点 `F`；网页 L269；旧页 L282。
- [DEST-044] 不从工具总表推定所有车型全量开放；具体名称与接口仍以项目原文为准。
  - 定位：`DATA.pages[id=F].feynman.scope`；锚点 `F`；网页 L269；旧页 L283。
- [DEST-045] Director看到音乐工具定义，才知道可以请求搜索或播放。但定义只是约定，背后仍要有当前车型接入的服务、账号权限与可用资源。一本说明书存在，不等于设备和服务已经装好。
  - 定位：`DATA.pages[id=F].feynman.sections[0].p[0]`；锚点 `f-definition`；网页 L269；旧页 L289。
- [DEST-046] 因此准入要决定本轮给模型哪些真实可用能力。否则模型能生成看似合理的调用，却在下一站找不到实现。
  - 定位：`DATA.pages[id=F].feynman.sections[0].p[1]`；锚点 `f-definition`；网页 L269；旧页 L290。
- [DEST-047] 同名工具在不同项目可能有不同下游适配。车型有没有设备、渠道有没有启用、账号能否使用和此刻状态是否允许，需要分别核对。‘没接入’不应都归成模型没选对。
  - 定位：`DATA.pages[id=F].feynman.sections[1].p[0]`；锚点 `f-project`；网页 L269；旧页 L297。
- [DEST-048] 动态页面工具还可能只在这张卡片存在时可用。卡片退出后再拿旧工具办理，会把过去的操作范围带进当前请求。
  - 定位：`DATA.pages[id=F].feynman.sections[1].p[1]`；锚点 `f-project`；网页 L269；旧页 L298。
- [DEST-049] 请求携带业务所需对象、动作和关联，执行方才能知道改哪一个设备、查哪一次经历。返回时保留原关联，主链才不会把上一轮结果当成本轮。字段格式正确与业务语义正确仍需分别检查。
  - 定位：`DATA.pages[id=F].feynman.sections[2].p[0]`；锚点 `f-contract`；网页 L269；旧页 L305。
- [DEST-050] 流式内容可能供界面展示，也可能供模型继续判断，终包只说明协议到某个结束点。要看业务回执才知道设备是否完成，不能把连接关闭解释成车辆动作成功。
  - 定位：`DATA.pages[id=F].feynman.sections[2].p[1]`；锚点 `f-contract`；网页 L269；旧页 L306。
- [DEST-051] 没查到、不支持、无权、超时、部分完成不是同一种空结果。它们决定该澄清、补条件、换路径还是如实收尾。用一个成功布尔值遮住这些差别，Director就很难正确解释。
  - 定位：`DATA.pages[id=F].feynman.sections[3].p[0]`；锚点 `f-failure`；网页 L269；旧页 L313。
- [DEST-052] 协议承担交接，不接管整个目标规划。查到地点后是否导航仍由Director按当前目标决定，不能因为Agent能返回多段内容就让它私自重写用户计划。
  - 定位：`DATA.pages[id=F].feynman.sections[3].p[1]`；锚点 `f-failure`；网页 L269；旧页 L314。
- [DEST-053] 为什么写对tool_name仍然不等于能力可用？
  - 定位：`DATA.pages[id=F].feynman.retell.q`；锚点 `F`；网页 L269；旧页 L319。
- [DEST-054] 工具名是定义入口，真实办理还依赖当前车型实现、渠道启用、账号权限、对象参数和车辆状态。调用交出后，还要通过带原关联的业务回执确认结果。
  - 定位：`DATA.pages[id=F].feynman.retell.a`；锚点 `F`；网页 L269；旧页 L320。
- [DEST-055] 流式返回结束了，能否把空调状态写已调整？
  - 定位：`DATA.pages[id=F].feynman.transfer[0].q`；锚点 `F`；网页 L269；旧页 L324。
- [DEST-056] 只有业务结果能支持才可以，协议结束不等于设备完成。
  - 定位：`DATA.pages[id=F].feynman.transfer[0].a`；锚点 `F`；网页 L269；旧页 L325。
- [DEST-057] 换登录账号后同一能力不可用，为什么不一定是模型退化？
  - 定位：`DATA.pages[id=F].feynman.transfer[1].q`；锚点 `F`；网页 L269；旧页 L329。
- [DEST-058] 账号权限或资源可用性可能变化，应先核准入和实际下游。
  - 定位：`DATA.pages[id=F].feynman.transfer[1].a`；锚点 `F`；网页 L269；旧页 L330。
- [DEST-059] 模型想调一个工具，先要问这辆车有没有。这一章讲工具怎么被准入：车型、渠道、账号、当前状态逐层过滤，缺一项这一轮就不出现；调用时按 Agent 协议带上身份和参数，回来时把计划、受理、执行三种进度分开。工具存在，不等于这台车能用。
  - 定位：`DATA.pages[id=F].bridge`；锚点 `F`；网页 L269；旧页 L362。
- [DEST-060] 用户说「播放我喜欢的歌」，Director 理解了，但还要知道这辆车接的是哪家音乐服务、当前账号有没有权限。一份工具定义只说明怎么请求能力，真正接入的实现、可用范围和回执要分别确认。这一章讲工具从准入到交回的整条协议。
  - 定位：`DATA.pages[id=F].mainline[0]`；锚点 `F`；网页 L269；旧页 L364。
- [DEST-061] 准入是逐层的。车型决定有没有这个功能：氛围灯、用车报告、车辆维养问答是上汽定制，别的项目没有。渠道、应用、环境、已发布实现决定这个项目有没有启用。账号与授权决定当前这个人能不能用，记忆读写还受开关约束。当前状态决定合不合适：空调已经最低，就不该再拆出「调低」；车窗已经关了，就不该再拆出「关窗」。缺任何一层，这一轮的工具列表里就不出现它。
  - 定位：`DATA.pages[id=F].mainline[1]`；锚点 `F`；网页 L269；旧页 L365。
- [DEST-062] 工具不是 33 个全摆在模型面前，而是按当前请求的条件动态注入。这一轮用不上的不进去，既减少注意力干扰，也避免模型选中一个本车办不到的能力。
  - 定位：`DATA.pages[id=F].mainline[2]`；锚点 `F`；网页 L269；旧页 L366。
- [DEST-063] 调用按 Agent 协议走：POST/SSE，带清楚这次调用属于谁、参数是什么、结果回到哪个请求。工具结果要经输入管理回到 Director，不能在执行层里自循环——插话优先级、旧轮取消和话术责任都统一在主链，执行层另起一个大脑会让同一次操作出现两个说法。
  - 定位：`DATA.pages[id=F].mainline[3]`；锚点 `F`；网页 L269；旧页 L367。
- [DEST-064] 异常按类型分，不能都写成「没办成」：没接入、没有权限、车辆条件不满足、第三方超时、部分完成，需要不同的解释和不同的下一步。已经产生副作用的失败不盲目重试；可行的替代方案交回 Director 判断，无法恢复就说明限制或引导手动完成。
  - 定位：`DATA.pages[id=F].mainline[4]`；锚点 `F`；网页 L269；旧页 L368。
- [DEST-065] 流式返回里还要分清给用户看的和给模型判断的。回应流结束不等于动作完成，任务创建应答不等于未来提醒已送达，图片还在生成不等于已交付。计划和受理、执行、再判断按同一次调用关联，字段格式按当前项目协议核对。这一章交出去的是「这一轮模型真正能用哪些工具，以及每个调用走到了哪一步」。
  - 定位：`DATA.pages[id=F].mainline[5]`；锚点 `F`；网页 L269；旧页 L369。

## 当前总图 F01～F15 的知识点


### F01 分别定义工具做什么与在哪里执行

- [DEST-066] 定义说明名称与业务能力
  - 定位：`DATA.base.modules[id=F].nodes[id=F01].lines[0]`；节点 `F01`；网页 L269。
- [DEST-067] 实现说明接入参数、渠道和版本
  - 定位：`DATA.base.modules[id=F].nodes[id=F01].lines[1]`；节点 `F01`；网页 L269。
- [DEST-068] 同一定义可以对应多个实现
  - 定位：`DATA.base.modules[id=F].nodes[id=F01].lines[2]`；节点 `F01`；网页 L269。
- [DEST-069] 有工具名称还不等于当前可调用
  - 定位：`DATA.base.modules[id=F].nodes[id=F01].lines[3]`；节点 `F01`；网页 L269。
- [DEST-070] 工具定义告诉模型这个能力做什么，包含标识、中文名和描述；具体实现则说明在哪个项目、通过什么参数与接入点执行。同一种音乐搜索能力可以有多个实现，未必意味着模型看见多个不同工具名。
  - 定位：`DATA.base.modules[id=F].nodes[id=F01].paragraphs[0]`；节点 `F01`；网页 L269。
- [DEST-071] Agent Server 在管理面保存 Agent 定义、租户实现、版本环境和动态工具信息，运行时按 agent_id、租户和环境选出当前渠道已启用、已发布的实现。只有定义而没有可用接入，用户的需求仍无法落地。
  - 定位：`DATA.base.modules[id=F].nodes[id=F01].paragraphs[1]`；节点 `F01`；网页 L269。

### F02 选中当前渠道与环境允许使用的实现

- [DEST-072] 渠道和应用隔离具体实现
  - 定位：`DATA.base.modules[id=F].nodes[id=F02].lines[0]`；节点 `F02`；网页 L269。
- [DEST-073] 已发布且启用才进入可用集合
  - 定位：`DATA.base.modules[id=F].nodes[id=F02].lines[1]`；节点 `F02`；网页 L269。
- [DEST-074] 集成位置与提供方分别记录
  - 定位：`DATA.base.modules[id=F].nodes[id=F02].lines[2]`；节点 `F02`；网页 L269。
- [DEST-075] 是否参与模型推理单独配置
  - 定位：`DATA.base.modules[id=F].nodes[id=F02].lines[3]`；节点 `F02`；网页 L269。
- [DEST-076] 同一能力可以保留多个测试草稿，运行时却要按渠道、应用、环境和启用状态选中具体发布实现。后台曾创建一个版本，不意味着当前请求已经使用它。
  - 定位：`DATA.base.modules[id=F].nodes[id=F02].paragraphs[0]`；节点 `F02`；网页 L269。
- [DEST-077] 车端或云端描述集成位置，内部或第三方描述提供方，不能混成同一种分类。是否参与 Director 推理还有独立开关，未向模型展示不等于底层能力不存在。明确选中的实现后，继续检查当前用户权限与车辆条件。
  - 定位：`DATA.base.modules[id=F].nodes[id=F02].paragraphs[1]`；节点 `F02`；网页 L269。

### F03 调用前核可信权限与当前车辆能力

- [DEST-078] 读取可信账号角色与项目权限
  - 定位：`DATA.base.modules[id=F].nodes[id=F03].lines[0]`；节点 `F03`；网页 L269。
- [DEST-079] 检查设备、音区和驾驶状态
  - 定位：`DATA.base.modules[id=F].nodes[id=F03].lines[1]`；节点 `F03`；网页 L269。
- [DEST-080] 工具可见不保证每次都能执行
  - 定位：`DATA.base.modules[id=F].nodes[id=F03].lines[2]`；节点 `F03`；网页 L269。
- [DEST-081] 拒绝时保留具体原因
  - 定位：`DATA.base.modules[id=F].nodes[id=F03].lines[3]`；节点 `F03`；网页 L269。
- [DEST-082] 模型看得见一个工具，只说明它知道有这项能力。当前用户是否有权调用、这辆车有没有设备、驾驶状态是否允许，还需要独立校验，不能由模型凭感觉认定应该放行。
  - 定位：`DATA.base.modules[id=F].nodes[id=F03].paragraphs[0]`；节点 `F03`；网页 L269。
- [DEST-083] 权限来自可信账号与项目规则。设备不存在、语音暂不支持和此刻条件不满足，应分别返回，方便 Director 解释或给出允许的手动方法。被拒绝时不能伪造成功，也不能为了执行而扩大用户角色或能力范围。
  - 定位：`DATA.base.modules[id=F].nodes[id=F03].paragraphs[1]`；节点 `F03`；网页 L269。

### F04 满足本轮条件后再加载动态工具

- [DEST-084] 推理前检查当前请求参数
  - 定位：`DATA.base.modules[id=F].nodes[id=F04].lines[0]`；节点 `F04`；网页 L269。
- [DEST-085] 支持存在、集合及与或条件
  - 定位：`DATA.base.modules[id=F].nodes[id=F04].lines[1]`；节点 `F04`；网页 L269。
- [DEST-086] 条件不符则不加入本轮工具
  - 定位：`DATA.base.modules[id=F].nodes[id=F04].lines[2]`；节点 `F04`；网页 L269。
- [DEST-087] 任意状态触发需另有接入能力
  - 定位：`DATA.base.modules[id=F].nodes[id=F04].lines[3]`；节点 `F04`；网页 L269。
- [DEST-088] 动态工具按当前请求条件加载。例如请求带有 real_time_card 时，本轮才加载 current_page_specific，让 Director 可以理解用户对这张卡片的补充操作。条件配置支持字段存在、属于某个集合，以及多个条件的且或组合。
  - 定位：`DATA.base.modules[id=F].nodes[id=F04].paragraphs[0]`；节点 `F04`；网页 L269。
- [DEST-089] 没有有效卡片时，这项页面工具不会加入本轮工具说明。当前条件来自请求参数；端状态和 Trigger 条件的统一接入属于后续扩展。通过加载条件后，卡片标题、内容、按钮和 card_id 一起提供给本轮调用。
  - 定位：`DATA.base.modules[id=F].nodes[id=F04].paragraphs[1]`；节点 `F04`；网页 L269。

### F05 用当前卡片内容明确页面可操作对象

- [DEST-090] 端侧提供卡片标识与按钮内容
  - 定位：`DATA.base.modules[id=F].nodes[id=F05].lines[0]`；节点 `F05`；网页 L269。
- [DEST-091] 用户序号选择对应当前卡片
  - 定位：`DATA.base.modules[id=F].nodes[id=F05].lines[1]`；节点 `F05`；网页 L269。
- [DEST-092] 无卡片不能猜出页面操作
  - 定位：`DATA.base.modules[id=F].nodes[id=F05].lines[2]`；节点 `F05`；网页 L269。
- [DEST-093] 卡片更新后旧对象须失效
  - 定位：`DATA.base.modules[id=F].nodes[id=F05].lines[3]`；节点 `F05`；网页 L269。
- [DEST-094] 端侧把当前卡片标识、标题、内容和按钮名放进请求，页面工具才知道眼前可以操作什么。用户说“选第二个”，必须对应这张有效卡片中的真实按钮，不能从旧历史猜一个对象。
  - 定位：`DATA.base.modules[id=F].nodes[id=F05].paragraphs[0]`；节点 `F05`；网页 L269。
- [DEST-095] 这条方式依赖请求里的实时卡片信息，不能默认所有页面都已自动进入 Context。用户说话期间卡片可能变化，因此执行前仍需核有效性。当前按钮可以操作，也不意味着整个应用的任意界面操作都已开放。
  - 定位：`DATA.base.modules[id=F].nodes[id=F05].paragraphs[1]`；节点 `F05`；网页 L269。

### F06 把符合条件的工具描述放入本轮输入

- [DEST-096] 静态与动态工具按各自条件注入
  - 定位：`DATA.base.modules[id=F].nodes[id=F06].lines[0]`；节点 `F06`；网页 L269。
- [DEST-097] 描述和参数来自实际发布配置
  - 定位：`DATA.base.modules[id=F].nodes[id=F06].lines[1]`；节点 `F06`；网页 L269。
- [DEST-098] 调试改动需同步管理配置
  - 定位：`DATA.base.modules[id=F].nodes[id=F06].lines[2]`；节点 `F06`；网页 L269。
- [DEST-099] 当前页面能力仅在满足条件时出现
  - 定位：`DATA.base.modules[id=F].nodes[id=F06].lines[3]`；节点 `F06`；网页 L269。
- [DEST-100] 可用定义与实现参数会转成 Director 本轮能读到的工具说明，动态条件成立的能力再放入对应位置。这样模型才能依据当前允许范围选择动作，而无需假设所有工具一直存在。
  - 定位：`DATA.base.modules[id=F].nodes[id=F06].paragraphs[0]`；节点 `F06`；网页 L269。
- [DEST-101] 提示词里调通的新描述，还需同步到实际管理配置并发布，参数、提示与限制才会一致生效。当前页面工具尤其依赖有效卡片和接入配置，不能仅因说明中有这个名字，就算成每辆车永久可用的一项能力。
  - 定位：`DATA.base.modules[id=F].nodes[id=F06].paragraphs[1]`；节点 `F06`；网页 L269。

### F07 模型选中工具后再校验实际参数

- [DEST-102] 核工具名、必填项、类型与范围
  - 定位：`DATA.base.modules[id=F].nodes[id=F07].lines[0]`；节点 `F07`；网页 L269。
- [DEST-103] 页面操作对应真实卡片按钮
  - 定位：`DATA.base.modules[id=F].nodes[id=F07].lines[1]`；节点 `F07`；网页 L269。
- [DEST-104] 车控明确设备、动作与对象
  - 定位：`DATA.base.modules[id=F].nodes[id=F07].lines[2]`；节点 `F07`；网页 L269。
- [DEST-105] 错误参数不能靠默认值补发
  - 定位：`DATA.base.modules[id=F].nodes[id=F07].lines[3]`；节点 `F07`；网页 L269。
- [DEST-106] Director 选中工具后，调用参数仍需符合该工具的定义。车控请求要说明设备、位置和动作；用户没有说清哪个座位时，应先补齐对象，不能用默认座位代替。参数缺失、类型错误和数值超出范围，都会阻止正确执行。
  - 定位：`DATA.base.modules[id=F].nodes[id=F07].paragraphs[0]`；节点 `F07`；网页 L269。
- [DEST-107] 页面工具的分工更具体：Director 用自然语言说明希望在当前卡片上做什么，current_page_specific 内部模型再返回 select_button，选中真实按钮。执行层把该选择与 card_id 一起发到客户端。用户点击的目标和当前卡片对应上以后，页面业务才继续执行。
  - 定位：`DATA.base.modules[id=F].nodes[id=F07].paragraphs[1]`；节点 `F07`；网页 L269。

### F08 补齐单个 Agent 的依赖并选择执行器

- [DEST-108] 读取元信息与所需背景
  - 定位：`DATA.base.modules[id=F].nodes[id=F08].lines[0]`；节点 `F08`；网页 L269。
- [DEST-109] 填充请求并绑定业务后处理
  - 定位：`DATA.base.modules[id=F].nodes[id=F08].lines[1]`；节点 `F08`；网页 L269。
- [DEST-110] 按提供方选择对应执行器
  - 定位：`DATA.base.modules[id=F].nodes[id=F08].lines[2]`；节点 `F08`；网页 L269。
- [DEST-111] 总体多步计划仍由 Director 负责
  - 定位：`DATA.base.modules[id=F].nodes[id=F08].lines[3]`；节点 `F08`；网页 L269。
- [DEST-112] Agent Server 先按 Agent ID 读取具体实现配置，再从请求或 Context 准备这个 Agent 声明的依赖。历史、端状态按各自实现传入；长短期记忆的传递方式仍需单独接入。SP 和 UP 由 Agent 内部自行从 Fornax 获取，不再由调用方传入。
  - 定位：`DATA.base.modules[id=F].nodes[id=F08].paragraphs[0]`；节点 `F08`；网页 L269。
- [DEST-113] 准备完成后，按提供方选择执行器，发出本次能力请求。执行器把不同提供方的协议差异整理好，业务后处理再将结果转换为统一返回。Agent Server 只负责单次调用，外层 Director 继续负责这轮目标及其他工具的安排。
  - 定位：`DATA.base.modules[id=F].nodes[id=F08].paragraphs[1]`；节点 `F08`；网页 L269。

### F09 把流式返回整理成可关联的统一协议

- [DEST-114] 关联会话、问题、Agent 和调用
  - 定位：`DATA.base.modules[id=F].nodes[id=F09].lines[0]`；节点 `F09`；网页 L269。
- [DEST-115] 接收流式内容与明确结束标志
  - 定位：`DATA.base.modules[id=F].nodes[id=F09].lines[1]`；节点 `F09`；网页 L269。
- [DEST-116] 错误码和终止原因继续保留
  - 定位：`DATA.base.modules[id=F].nodes[id=F09].lines[2]`；节点 `F09`；网页 L269。
- [DEST-117] 流结束不代替业务完成
  - 定位：`DATA.base.modules[id=F].nodes[id=F09].lines[3]`；节点 `F09`；网页 L269。
- [DEST-118] 下游流式内容到来时，通用层按 chat_id、question_id、conversation_id、agent_id 和 trace_id 关联这次请求，再整理成统一格式。is_finish 为 true 的最后一帧必须发出，座舱依赖它做端上发送和历史落表，缺少结束信息时不能悄悄当作正常完结。
  - 定位：`DATA.base.modules[id=F].nodes[id=F09].paragraphs[0]`；节点 `F09`；网页 L269。
- [DEST-119] 错误原因与已返回部分也要保存，供后续决定如何处理。即使收到正常终包，车窗是否关闭、订单是否成立仍要看业务内容。协议结束只完成了通信这一层，不能直接向用户宣布所有目标已经达成。
  - 定位：`DATA.base.modules[id=F].nodes[id=F09].paragraphs[1]`；节点 `F09`；网页 L269。

### F10 分别整理给界面、声音和模型的内容

- [DEST-120] 界面内容保留展示结构
  - 定位：`DATA.base.modules[id=F].nodes[id=F10].lines[0]`；节点 `F10`；网页 L269。
- [DEST-121] 语音内容用于相应播报链
  - 定位：`DATA.base.modules[id=F].nodes[id=F10].lines[1]`；节点 `F10`；网页 L269。
- [DEST-122] 模型内容提供继续判断的事实
  - 定位：`DATA.base.modules[id=F].nodes[id=F10].lines[2]`；节点 `F10`；网页 L269。
- [DEST-123] 页面透传不等于自行抢占声音
  - 定位：`DATA.base.modules[id=F].nodes[id=F10].lines[3]`；节点 `F10`；网页 L269。
- [DEST-124] 统一协议后还可能有业务加工。例如音乐返回结构化歌曲列表，界面要保留列表结构，模型则需要能理解的候选事实。content 面向界面，tts_content 提供可播文字、为 null 时回退 content，model_content 供 Director 继续总结上下文。
  - 定位：`DATA.base.modules[id=F].nodes[id=F10].paragraphs[0]`；节点 `F10`；网页 L269。
- [DEST-125] 另有 reasoning_content 记录思考，command 承载跳转或降级命令；chunk_type 区分回答与命令，content_type 区分纯文本、卡片 JSON 和透传数据。三路内容不能一律当成最终回答直接播放，整理之后按各自出口交付。
  - 定位：`DATA.base.modules[id=F].nodes[id=F10].paragraphs[1]`；节点 `F10`；网页 L269。

### F11 保存本次 Agent 历史并交回业务结果

- [DEST-126] 保存真实内容与结构化观察
  - 定位：`DATA.base.modules[id=F].nodes[id=F11].lines[0]`；节点 `F11`；网页 L269。
- [DEST-127] 终包结束当前 Agent 请求
  - 定位：`DATA.base.modules[id=F].nodes[id=F11].lines[1]`；节点 `F11`；网页 L269。
- [DEST-128] 业务状态交执行层继续核对
  - 定位：`DATA.base.modules[id=F].nodes[id=F11].lines[2]`；节点 `F11`；网页 L269。
- [DEST-129] 下一动作由 Director 再决定
  - 定位：`DATA.base.modules[id=F].nodes[id=F11].lines[3]`；节点 `F11`；网页 L269。
- [DEST-130] 响应正常结束时，保存本 Agent 生成的内容与结构化观察，再把结果交回执行层。例如导航给出几条路线，下一句“选红绿灯少的”需要引用这份真实候选，不能只保留一句概括话术。
  - 定位：`DATA.base.modules[id=F].nodes[id=F11].paragraphs[0]`；节点 `F11`；网页 L269。
- [DEST-131] 历史保存也要遵守身份、隐私和会话范围。保存成功或终包结束都不会自动触发后一步，如果用户目标还差导航选择，仍由 Director 读反馈再决定。这样连续对话有依据，也不会让工具内部越过总体计划直接行动。
  - 定位：`DATA.base.modules[id=F].nodes[id=F11].paragraphs[1]`；节点 `F11`；网页 L269。

### F12 仅在明确配置时直接交付工具结果

- [DEST-132] direct_return 是条件化交付方式
  - 定位：`DATA.base.modules[id=F].nodes[id=F12].lines[0]`；节点 `F12`；网页 L269。
- [DEST-133] 可跳过再次模型总结
  - 定位：`DATA.base.modules[id=F].nodes[id=F12].lines[1]`；节点 `F12`；网页 L269。
- [DEST-134] 界面、文字和声音分别按协议处理
  - 定位：`DATA.base.modules[id=F].nodes[id=F12].lines[2]`；节点 `F12`；网页 L269。
- [DEST-135] 未配置时继续正常反馈主链
  - 定位：`DATA.base.modules[id=F].nodes[id=F12].lines[3]`；节点 `F12`；网页 L269。
- [DEST-136] 启用 direct_return 的工具，可以按配置直接交付本次结果，而不再强制送 Director 总结。它适用于明确约定的渠道与工具，不能因系统支持这个字段，就让所有执行方自行决定直返。
  - 定位：`DATA.base.modules[id=F].nodes[id=F12].paragraphs[0]`；节点 `F12`；网页 L269。
- [DEST-137] 还要分清交付的到底是界面、文字还是声音，透传卡片不自然获得自主播报权。无论是否经过再次总结，说法仍应与真实业务状态一致。未满足直返配置时继续正常反馈路径，避免同一结果又直出又重复生成回复。
  - 定位：`DATA.base.modules[id=F].nodes[id=F12].paragraphs[1]`；节点 `F12`；网页 L269。

### F13 下游无法继续时把原因交回重新规划

- [DEST-138] Fallback 带着无法承接原因回主链
  - 定位：`DATA.base.modules[id=F].nodes[id=F13].lines[0]`；节点 `F13`；网页 L269。
- [DEST-139] 保留已有结果和外部效果
  - 定位：`DATA.base.modules[id=F].nodes[id=F13].lines[1]`；节点 `F13`；网页 L269。
- [DEST-140] Director 决定替代、澄清或结束
  - 定位：`DATA.base.modules[id=F].nodes[id=F13].lines[2]`；节点 `F13`；网页 L269。
- [DEST-141] 不默认重试相同工具
  - 定位：`DATA.base.modules[id=F].nodes[id=F13].lines[3]`；节点 `F13`；网页 L269。
- [DEST-142] Fallback 表示下游无法继续办理，把原因和已有结果交回座舱侧重新安排。框架不提供通用自动重规划，是否换允许的工具、补问或结束，由 Director 依据真实状态决定。比如能力不支持当前要求，回传限制比单纯报一个失败更有助于后续判断。
  - 定位：`DATA.base.modules[id=F].nodes[id=F13].paragraphs[0]`；节点 `F13`；网页 L269。
- [DEST-143] 如果此前已经形成订单或车辆动作，也必须一并说明，避免换工具再做一份相同操作。各 Agent 是否支持这种回退及何时使用，取决于实际接入。回退不是自动重试许可，后续仍要依据真实状态重新规划。
  - 定位：`DATA.base.modules[id=F].nodes[id=F13].paragraphs[1]`；节点 `F13`；网页 L269。

### F14 下游明确指定下一 Agent 时由调用方转交

- [DEST-144] Redirect 指出明确转交目标
  - 定位：`DATA.base.modules[id=F].nodes[id=F14].lines[0]`；节点 `F14`；网页 L269。
- [DEST-145] 调用方核目标实现与权限
  - 定位：`DATA.base.modules[id=F].nodes[id=F14].lines[1]`；节点 `F14`；网页 L269。
- [DEST-146] 携带原问题和已发生状态
  - 定位：`DATA.base.modules[id=F].nodes[id=F14].lines[2]`；节点 `F14`；网页 L269。
- [DEST-147] 转交成功不等于目标执行成功
  - 定位：`DATA.base.modules[id=F].nodes[id=F14].lines[3]`；节点 `F14`；网页 L269。
- [DEST-148] Redirect 是下游明确指定下一 Agent 的转交指令，跳转最多两次。调用方取得目标后，按目标实现和权限继续发起请求，同时带上原问题及已发生的业务状态。两者分工不同，Fallback 把问题交回座舱重新安排，Redirect 已经给出下一站。
  - 定位：`DATA.base.modules[id=F].nodes[id=F14].paragraphs[0]`；节点 `F14`；网页 L269。
- [DEST-149] 转交后，原调用还要等待目标 Agent 的实际结果，再向上游说明办理情况。框架定义了这个控制出口，具体第三方是否支持、允许转交到哪些服务，仍由对应接入协议确定。
  - 定位：`DATA.base.modules[id=F].nodes[id=F14].paragraphs[1]`；节点 `F14`；网页 L269。

### F15 取消连接时仍保留业务真实状态

- [DEST-150] 先通知下游取消再结束连接
  - 定位：`DATA.base.modules[id=F].nodes[id=F15].lines[0]`；节点 `F15`；网页 L269。
- [DEST-151] 保留已经生成的内容和结果
  - 定位：`DATA.base.modules[id=F].nodes[id=F15].lines[1]`；节点 `F15`；网页 L269。
- [DEST-152] 预请求需要单独约定才可启用
  - 定位：`DATA.base.modules[id=F].nodes[id=F15].lines[2]`；节点 `F15`；网页 L269。
- [DEST-153] 超时重试遵守具体工具规则
  - 定位：`DATA.base.modules[id=F].nodes[id=F15].lines[3]`；节点 `F15`；网页 L269。
- [DEST-154] 取消调用时，先向下游发取消要求，再断开相应连接，同时保存已经生成的内容。车辆动作、订单或文件生成如果已经发生，不会随连接关闭自动回滚，后续还需核实际业务状态。
  - 定位：`DATA.base.modules[id=F].nodes[id=F15].paragraphs[0]`；节点 `F15`；网页 L269。
- [DEST-155] 预请求也不是默认开放的正式调用，需要双方明确允许范围。超时多久、是否可重试，应按工具分别定义。尤其取消与结果同时到达时，要保住真实结果，防止新轮恢复后把旧副作用再执行一次。
  - 定位：`DATA.base.modules[id=F].nodes[id=F15].paragraphs[1]`；节点 `F15`；网页 L269。

## 当前总图的评审题与指标

- [DEST-156] 工具已在表里，为什么运行时仍看不到？；定义、渠道实现、发布启用、权限和动态条件是不同门。；逐层给当前请求证据，而非只展示工具清单。；把同一轮的输入、实际配置、判断结果和下游反馈按时间排在一起，与预期行为逐项对照；同时核对这辆车实际发生了什么。
  - 定位：`DATA.base.modules[id=F].questions[0]`；网页 L269；标为建议的指标只作既有网页建议，未视为官方上线门槛。
- [DEST-157] Fallback、Redirect、direct_return 分别到哪里？；混为“重试”会画错责任和副作用。；回 D 重规划、指定下一Agent、按配置直接返回，三条分开且标版本。；把同一轮的输入、实际配置、判断结果和下游反馈按时间排在一起，与预期行为逐项对照；同时核对这辆车实际发生了什么。
  - 定位：`DATA.base.modules[id=F].questions[1]`；网页 L269；标为建议的指标只作既有网页建议，未视为官方上线门槛。
- [DEST-158] 为什么 Agent 终包不证明车辆或订单完成？；协议传输终态与业务履约状态不同。；找到工具业务字段与实际结果，再决定用户话术。；把同一轮的输入、实际配置、判断结果和下游反馈按时间排在一起，与预期行为逐项对照；同时核对这辆车实际发生了什么。
  - 定位：`DATA.base.modules[id=F].questions[2]`；网页 L269；标为建议的指标只作既有网页建议，未视为官方上线门槛。
- [DEST-159] 我在 Fornax 把工具描述调好了，为什么正式请求仍按旧规则调用？；调试提示词副本和运行时从 Agent 管理平台加载的 tool_info 不是同一个发布对象。；先回读正式请求实际注入的 tool_info，再比对 Agent 管理平台中该渠道实现的 param_desc、notice、tips、发布/启用状态和版本。SOP 要求调试完成后同步管理平台；调试界面改动本身不能证明线上工具描述已更新。配置修正后仍需用真实运行请求做回归。；查看《Agent 管理平台使用 SOP》产品流程；提供调试副本、变更前后管理配置、已发布版本和本轮模型输入的差异，不只展示 Fornax 测试成功。
  - 定位：`DATA.base.modules[id=F].questions[3]`；网页 L269；标为建议的指标只作既有网页建议，未视为官方上线门槛。
- [DEST-160] 卡片、给模型看的事实、要播的文字应该怎么分开，谁最后决定说话？；把展示 JSON 当语音、把礼貌话术当执行证据，或工具与 D 同时开口，会破坏理解和统一交互。；按协议区分 content、model_content、tts_content 及内容类型，保留结构化卡片和真实业务事实。新 Director 主链由 D 统一组织话语；历史 direct_return 或特定渠道直返必须查当前配置。协议允许某字段或回退方式，不等于本渠道授权下游抢播。；对照同一个结果的 Agent 原始响应、服务端后处理、模型实际输入、界面渲染和音频播放，检查字段在交接中是否丢失或被误解。
  - 定位：`DATA.base.modules[id=F].questions[4]`；网页 L269；标为建议的指标只作既有网页建议，未视为官方上线门槛。
- [DEST-161] 动态工具一期能直接写“下雨且车速超过某值时加载”吗？；字段名写进配置不等于条件引擎能从那个来源取数；把规划能力当现状会使工具误加载或永不加载。；这套动态加载实现的 field_source 只支持 param，也就是从本次请求参数取值；例如检查 real_time_card 是否存在。端状态取数与 Trigger 复用仍是扩展方向。新增“下雨且车速超过某值”前，先确认这辆车运行的实现能取得这些字段、识别字段类型并完成组合判断，配置里写出条件本身还不足以启用它。；核对已部署实现支持的数据来源、字段类型和判断器，保存规则配置、本次请求参数及真实判断结果；扩展中的来源与已可用来源分开记录。
  - 定位：`DATA.base.modules[id=F].questions[5]`；网页 L269；标为建议的指标只作既有网页建议，未视为官方上线门槛。
- [DEST-162] 旧示例调用的工具和现在工具表不一致，我到底按哪一份判断模型对错？；工具名字相同不代表职责未变，混用历史合同会制造假错或假通过。；先锁车型、渠道、环境和模型/Prompt/工具发布版本，再以当轮实际注入定义与真实实现为基准；旧示例只作为冲突线索，不能自动覆盖当前合同。若定义和实现不一致，先报合同缺陷，而不是直接判模型推理差。；核对当轮实际注入的工具定义、注册与发布配置、调用参数、返回样本和实际实现。若工具说明与实现不一致，先定位接口约定的冲突，再评价模型是否选错工具。
  - 定位：`DATA.base.modules[id=F].questions[6]`；网页 L269；标为建议的指标只作既有网页建议，未视为官方上线门槛。
- [DEST-163] 这项能力当前停在哪个关口，能否给出对应车型和版本的证据？；概念、需求评审、研发完成、验收和发布不是同一个状态。；指出已完成的具体关口和未决项，给出可对应的协议、版本、测试与运行记录；未发布或未验证的内容继续按方案描述。；查看本项目的接口约定、生效配置、模型及车端版本、验收记录和发布后回归结果。
  - 定位：`DATA.base.modules[id=F].questions[7]`；网页 L269；标为建议的指标只作既有网页建议，未视为官方上线门槛。
- [DEST-164] 能力准入一致性；提示词可见、权限合法、已发布启用实现和车型能力一致。；至少按车型、版本、入口和成功/失败分组；不能用整体平均值掩盖异常场景。；建议验收口径；先核对本车实际部署与开放的能力。
  - 定位：`DATA.base.modules[id=F].metrics[0]`；网页 L269；标为建议的指标只作既有网页建议，未视为官方上线门槛。
- [DEST-165] 协议完整性；终包覆盖、错误原因保留、模型/界面/语音内容映射及取消结果归属。；至少按车型、版本、入口和成功/失败分组；不能用整体平均值掩盖异常场景。；按接口约定与实车闭环验收，阈值需项目确认。
  - 定位：`DATA.base.modules[id=F].metrics[1]`；网页 L269；标为建议的指标只作既有网页建议，未视为官方上线门槛。
- [DEST-166] 动态工具条件准确性；应加载/不应加载的卡片和参数组合，检查旧页面误调用与权限。；至少按车型、版本、入口和成功/失败分组；不能用整体平均值掩盖异常场景。；建议验收口径；按已接入的字段来源和判断器范围验收。
  - 定位：`DATA.base.modules[id=F].metrics[2]`；网页 L269；标为建议的指标只作既有网页建议，未视为官方上线门槛。
- [DEST-167] 工具定义变更回归覆盖率；以一次工具定义或实现变更影响的合同项为分母，检查是否覆盖合法调用、缺参/越界、目标渠道加载、未适用渠道隔离和真实返回解释的测试。另记录调试描述、管理平台发布版本与本轮 tool_info 是否一致；覆盖不等于所有测试通过，二者分别报告。；按 param_desc/notice/tips/执行器/版本变更类型、工具与受影响渠道分组；不把单次快速测试替代全链路回归。；建议验收口径；先确认变更影响范围与目标渠道，再确定门槛。
  - 定位：`DATA.base.modules[id=F].metrics[3]`；网页 L269；标为建议的指标只作既有网页建议，未视为官方上线门槛。
- [DEST-168] 单 Agent 依赖补全正确率；以明确声明需要历史、记忆、端状态或提示词依赖的 Agent 调用为分母，逐项核对 AgentServer 是否按当前元信息拿到正确主体、会话和时点的数据并填入请求。缺依赖应按合同报缺或降级，不能静默取另一用户数据；依赖不存在的调用不计为成功补全。；按 Agent 类型、依赖种类、主体/会话切换、正常/缺失/过期/无权限场景分组；不等同于 Director 整体 Context 质量。；建议验收口径；按 Agent 实际声明的数据依赖验收。
  - 定位：`DATA.base.modules[id=F].metrics[4]`；网页 L269；标为建议的指标只作既有网页建议，未视为官方上线门槛。
- [DEST-169] Redirect 目标校验与循环保护通过率；在测试环境构造目标未注册、未发布、无权限以及互相跳转的 Redirect 响应；以已由项目明确处理规则的异常样本为分母，检查是否拒绝非法转交、保留原请求与既有事实，并按约定终止。没有统一最大跳转或超时合同的项列为未定义，不能自行填写次数再宣称支持。；按来源 Agent、目标 Agent、渠道/环境、是否已产生副作用及异常类型分组；此项是补齐合同后的验收建议，不证明当前各 Agent 已具备循环保护。；建议验收口径；先明确跳转合法性、超时及循环终止规则。
  - 定位：`DATA.base.modules[id=F].metrics[5]`；网页 L269；标为建议的指标只作既有网页建议，未视为官方上线门槛。
- [DEST-170] 可用能力证据完整性；对每项宣称可用的能力核是否有对应车型范围、当前合同、部署版本及验收/运行证据，缺一项即单列缺口。；按概念、需求、实现、验收、发布及回归阶段拆分，不把它们合并为已完成。；建议验收口径；阈值需项目确认。
  - 定位：`DATA.base.modules[id=F].metrics[6]`；网页 L269；标为建议的指标只作既有网页建议，未视为官方上线门槛。

## 旧版图件清点及图内知识点

5 个 SVG 与 diagrams.json 对应条目逐字一致；5 个 PNG 是对应预览副本。当前 v70 源码中这 5 个图 ID、5 个图标题均未出现，故它们属于需保留的研究旧图，不应声称当前阅读页已展示这 5 图。当前总图里的 F01～F15 已在上一节单列。


### 图件 f-count

- 文件：`research/chapters/F/svg/f-count.svg`；JSON：`research/chapters/F/diagrams.json["f-count"]`；PNG：`research/chapters/F/png/f-count.png`。
- 图题：“我们有多少个工具”：五个数字，五种口径。

- [DEST-171] 从上到下，越往下范围越大；数字不能互相比，先问是哪一份、哪一天、哪个项目
  - 定位：`research/chapters/F/svg/f-count.svg` L1，text 第 2 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-172] 23 个
  - 定位：`research/chapters/F/svg/f-count.svg` L1，text 第 3 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-173] 项目知识库里的旧说法
  - 定位：`research/chapters/F/svg/f-count.svg` L1，text 第 4 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-174] 更早一版说明书；工具名是旧名（如 search_poi_qa），现已换成标准化名
  - 定位：`research/chapters/F/svg/f-count.svg` L1，text 第 5 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-175] 27 个
  - 定位：`research/chapters/F/svg/f-count.svg` L1，text 第 6 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-176] 上汽说明书里写给 DT 看的（7 月 31 日快照，D 章用）
  - 定位：`research/chapters/F/svg/f-count.svg` L1，text 第 7 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-177] 一个项目、一个时间点，DT 真正能选的；编号写到 28，中间缺 7 号；美团订座在第 28 号
  - 定位：`research/chapters/F/svg/f-count.svg` L1，text 第 8 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-178] 33 行
  - 定位：`research/chapters/F/svg/f-count.svg` L1，text 第 9 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-179] Director PRD 标准化表：允许接什么
  - 定位：`research/chapters/F/svg/f-count.svg` L1，text 第 10 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-180] 14 行必选、16 行可选、3 个上汽定制；“允许接”不等于“已经接”
  - 定位：`research/chapters/F/svg/f-count.svg` L1，text 第 11 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-181] 40 行
  - 定位：`research/chapters/F/svg/f-count.svg` L1，text 第 12 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-182] 下游工具输入输出整理表（10 月 30 日查看）
  - 定位：`research/chapters/F/svg/f-count.svg` L1，text 第 13 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-183] 产品维护的定义和回包写法；其中 8 行已标弃用；最新版本记录是 8 月 27 日
  - 定位：`research/chapters/F/svg/f-count.svg` L1，text 第 14 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-184] 50 个编号
  - 定位：`research/chapters/F/svg/f-count.svg` L1，text 第 15 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-185] 数据库快照（11 月 4 日，E 章用）
  - 定位：`research/chapters/F/svg/f-count.svg` L1，text 第 16 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-186] 225 条配置、50 个编号；212 条启用、涉及 49 个；含问句改写这类内部工具、车上离线工具、停用的配置
  - 定位：`research/chapters/F/svg/f-count.svg` L1，text 第 17 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-187] 为什么对不上
  - 定位：`research/chapters/F/svg/f-count.svg` L1，text 第 18 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-188] 时间不同（7/31 对 11/4）；对象不同（一个项目的说明书对全部渠道的数据库）；口径不同（允许接 / 配了 / DT 看得见）。
  - 定位：`research/chapters/F/svg/f-count.svg` L1，text 第 19 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。

### 图件 f-dynamic

- 文件：`research/chapters/F/svg/f-dynamic.svg`；JSON：`research/chapters/F/diagrams.json["f-dynamic"]`；PNG：`research/chapters/F/png/f-dynamic.png`。
- 图题：这一轮 DT 面前有哪些工具：常驻的，加上条件满足才出现的。

- [DEST-189] 以屏幕上弹出一张带按钮的卡片为例；动态工具的技术方案 8 月底评审，10 月中旬测试中
  - 定位：`research/chapters/F/svg/f-dynamic.svg` L1，text 第 2 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-190] 这一轮的请求
  - 定位：`research/chapters/F/svg/f-dynamic.svg` L1，text 第 3 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-191] 用户说的话
  - 定位：`research/chapters/F/svg/f-dynamic.svg` L1，text 第 4 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-192] 车上一起报上来的卡片信息：
  - 定位：`research/chapters/F/svg/f-dynamic.svg` L1，text 第 5 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-193] 标题、正文、按钮名、
  - 定位：`research/chapters/F/svg/f-dynamic.svg` L1，text 第 6 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-194] 为什么弹出这张卡
  - 定位：`research/chapters/F/svg/f-dynamic.svg` L1，text 第 7 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-195] 卡片信息在
  - 定位：`research/chapters/F/svg/f-dynamic.svg` L1，text 第 8 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-196] 请求里吗？
  - 定位：`research/chapters/F/svg/f-dynamic.svg` L1，text 第 9 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-197] 在：加一个“当前页特有操作”工具
  - 定位：`research/chapters/F/svg/f-dynamic.svg` L1，text 第 10 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-198] 说明里写着这张卡片能点什么
  - 定位：`research/chapters/F/svg/f-dynamic.svg` L1，text 第 11 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-199] DT 选中它，回一个“点哪个按钮”
  - 定位：`research/chapters/F/svg/f-dynamic.svg` L1，text 第 12 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-200] 车上替用户点
  - 定位：`research/chapters/F/svg/f-dynamic.svg` L1，text 第 13 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-201] 不在：这个工具不出现
  - 定位：`research/chapters/F/svg/f-dynamic.svg` L1，text 第 15 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-202] 平时说话时 DT 看不到它，
  - 定位：`research/chapters/F/svg/f-dynamic.svg` L1，text 第 16 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-203] 不会被它干扰选错工具
  - 定位：`research/chapters/F/svg/f-dynamic.svg` L1，text 第 17 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-204] 常驻的工具：本渠道已发布、标了“参与 DT 推理”的实现
  - 定位：`research/chapters/F/svg/f-dynamic.svg` L1，text 第 19 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-205] “是否参与 DT 推理”是每份实现里的一个开关（平台 SOP），配了不等于 DT 看得见。
  - 定位：`research/chapters/F/svg/f-dynamic.svg` L1，text 第 20 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-206] 说明书版（研发叫 PE 版）的工具段从平台填入；训练版（研发叫 SFT 版）工具段写死，改成填入的需求在 H2 双周报里是暂缓。
  - 定位：`research/chapters/F/svg/f-dynamic.svg` L1，text 第 21 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-207] 两部分合起来，才是这一轮 DT 面前的工具列表。
  - 定位：`research/chapters/F/svg/f-dynamic.svg` L1，text 第 22 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-208] 还没做到 / 不归这里管的
  - 定位：`research/chapters/F/svg/f-dynamic.svg` L1，text 第 23 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-209] 条件现在只能看请求里带的参数；要看车况，计划复用触发器的判断（方案“后续规划”）。
  - 定位：`research/chapters/F/svg/f-dynamic.svg` L1，text 第 24 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-210] 原方案里“用户开关控制行程规划工具是否出现”的例子，现行文档已划掉。
  - 定位：`research/chapters/F/svg/f-dynamic.svg` L1，text 第 25 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-211] 工具在列表里，不代表这辆车有这个功能：车型能力边界另有一套（D 章，前置检查未准出）。
  - 定位：`research/chapters/F/svg/f-dynamic.svg` L1，text 第 26 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。

### 图件 f-layers

- 文件：`research/chapters/F/svg/f-layers.svg`；JSON：`research/chapters/F/diagrams.json["f-layers"]`；PNG：`research/chapters/F/png/f-layers.png`。
- 图题：一个工具定义，几份实现：同一个名字，不同项目背后是谁。

- [DEST-212] 上面一层写给 DT 看（是什么），下面一层写给系统看（怎么跑）；按渠道隔开，互不影响
  - 定位：`research/chapters/F/svg/f-layers.svg` L1，text 第 2 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-213] 定义：每个工具在系统里只有一份
  - 定位：`research/chapters/F/svg/f-layers.svg` L1，text 第 3 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-214] 天气查询工具
  - 定位：`research/chapters/F/svg/f-layers.svg` L1，text 第 4 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-215] 能查哪些天气信息
  - 定位：`research/chapters/F/svg/f-layers.svg` L1，text 第 5 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-216] 例句、注意事项
  - 定位：`research/chapters/F/svg/f-layers.svg` L1，text 第 6 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-217] 美团订座工具
  - 定位：`research/chapters/F/svg/f-layers.svg` L1，text 第 7 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-218] 订座、查询、修改、取消
  - 定位：`research/chapters/F/svg/f-layers.svg` L1，text 第 8 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-219] 8/27 表里加了排队
  - 定位：`research/chapters/F/svg/f-layers.svg` L1，text 第 9 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-220] POI 查询工具
  - 定位：`research/chapters/F/svg/f-layers.svg` L1，text 第 10 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-221] 附近、顺路、多点中间搜
  - 定位：`research/chapters/F/svg/f-layers.svg` L1，text 第 11 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-222] 注意事项、使用技巧
  - 定位：`research/chapters/F/svg/f-layers.svg` L1，text 第 12 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-223] 实现：按渠道各建一份；有一个发布版，可以有多个草稿
  - 定位：`research/chapters/F/svg/f-layers.svg` L1，text 第 13 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-224] 上汽渠道
  - 定位：`research/chapters/F/svg/f-layers.svg` L1，text 第 14 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-225] 提供方：内部能力平台
  - 定位：`research/chapters/F/svg/f-layers.svg` L1，text 第 15 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-226] （研发叫 DPFM）
  - 定位：`research/chapters/F/svg/f-layers.svg` L1，text 第 16 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-227] 赛力斯渠道
  - 定位：`research/chapters/F/svg/f-layers.svg` L1，text 第 17 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-228] 提供方：弋途（采买）
  - 定位：`research/chapters/F/svg/f-layers.svg` L1，text 第 18 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-229] 各已配置渠道一致
  - 定位：`research/chapters/F/svg/f-layers.svg` L1，text 第 19 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-230] 提供方：弋途（采买）
  - 定位：`research/chapters/F/svg/f-layers.svg` L1，text 第 20 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-231] 11/4 快照写“全部”
  - 定位：`research/chapters/F/svg/f-layers.svg` L1，text 第 21 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-232] “全部”不等于每个项目都配了
  - 定位：`research/chapters/F/svg/f-layers.svg` L1，text 第 22 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-233] 只表示配了的渠道实现相同
  - 定位：`research/chapters/F/svg/f-layers.svg` L1，text 第 23 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-234] 上汽：发布版
  - 定位：`research/chapters/F/svg/f-layers.svg` L1，text 第 24 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-235] AI-Navi 版，所有环境生效
  - 定位：`research/chapters/F/svg/f-layers.svg` L1，text 第 25 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-236] 上汽：两个草稿
  - 定位：`research/chapters/F/svg/f-layers.svg` L1，text 第 26 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-237] 一方版本只在环境 1 生效
  - 定位：`research/chapters/F/svg/f-layers.svg` L1，text 第 27 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-238] ToB 版本只在环境 2 生效
  - 定位：`research/chapters/F/svg/f-layers.svg` L1，text 第 28 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-239] 为什么这样分
  - 定位：`research/chapters/F/svg/f-layers.svg` L1，text 第 29 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-240] 改造以前（7 月技术方案写的现状）：有的工具硬编码拼进 DT 的工具列表；项目不要的工具只能改代码删；
  - 定位：`research/chapters/F/svg/f-layers.svg` L1，text 第 30 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-241] 同一工具要两种做法只能再建一个相似工具。
  - 定位：`research/chapters/F/svg/f-layers.svg` L1，text 第 31 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-242] 分两层以后：加项目不改代码，换供应商只换实现；代价是要多维护“哪个渠道发布了哪一版”。POI 草稿的例子出自 7 月技术方案的举例。
  - 定位：`research/chapters/F/svg/f-layers.svg` L1，text 第 32 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。

### 图件 f-overview

- 文件：`research/chapters/F/svg/f-overview.svg`；JSON：`research/chapters/F/diagrams.json["f-overview"]`；PNG：`research/chapters/F/png/f-overview.png`。
- 图题：一个新能力从“想接”到“DT 能用、结果能回来”：9 个步骤。

- [DEST-243] 以上汽接入美团订座为例；左列一次性做完（准入），右列每次用户说话都会走（运行）
  - 定位：`research/chapters/F/svg/f-overview.svg` L1，text 第 2 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-244] 接进来：一次性，产品和研发在平台上做
  - 定位：`research/chapters/F/svg/f-overview.svg` L1，text 第 3 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-245] 用起来：每次用户说话，在云端
  - 定位：`research/chapters/F/svg/f-overview.svg` L1，text 第 4 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-246] 定性：算标准工具还是项目定制
  - 定位：`research/chapters/F/svg/f-overview.svg` L1，text 第 6 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-247] 查 Director PRD 标准化表：必选 / 可选 / 定制
  - 定位：`research/chapters/F/svg/f-overview.svg` L1，text 第 7 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-248] 标准工具不许改定义，只许下游适配
  - 定位：`research/chapters/F/svg/f-overview.svg` L1，text 第 8 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-249] 写定义：给 DT 看的说明
  - 定位：`research/chapters/F/svg/f-overview.svg` L1，text 第 10 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-250] 名字、能办什么、怎么传参数、注意事项
  - 定位：`research/chapters/F/svg/f-overview.svg` L1，text 第 11 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-251] 输入输出整理表：正常 / 异常各回什么
  - 定位：`research/chapters/F/svg/f-overview.svg` L1，text 第 12 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-252] 建实现：这个项目由谁来办
  - 定位：`research/chapters/F/svg/f-overview.svg` L1，text 第 14 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-253] 按渠道（上汽、赛力斯、主线）各建一份
  - 定位：`research/chapters/F/svg/f-overview.svg` L1，text 第 15 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-254] 提供方：自研 / 内部平台 / 豆包 / 三方
  - 定位：`research/chapters/F/svg/f-overview.svg` L1，text 第 16 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-255] 接协议：三方按座舱 Agent 协议对接
  - 定位：`research/chapters/F/svg/f-overview.svg` L1，text 第 18 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-256] 座舱云发什么、对方怎么一帧帧回
  - 定位：`research/chapters/F/svg/f-overview.svg` L1，text 第 19 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-257] 纯车上自己办完的，建议走函数调用协议
  - 定位：`research/chapters/F/svg/f-overview.svg` L1，text 第 20 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-258] 测：快速测试、测试环境、评测、路测
  - 定位：`research/chapters/F/svg/f-overview.svg` L1，text 第 22 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-259] 美团订座：联调、批量测试、对齐调用预期
  - 定位：`research/chapters/F/svg/f-overview.svg` L1，text 第 23 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-260] 6 月下旬开发 → 8 月 3 日一期完成
  - 定位：`research/chapters/F/svg/f-overview.svg` L1，text 第 24 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-261] 发布；不行就禁用或临时摘掉
  - 定位：`research/chapters/F/svg/f-overview.svg` L1，text 第 26 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-262] 草稿只在指定环境生效，发布后主链路才用
  - 定位：`research/chapters/F/svg/f-overview.svg` L1，text 第 27 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-263] 10 月 12 日：行程规划效果差，路测先摘掉
  - 定位：`research/chapters/F/svg/f-overview.svg` L1，text 第 28 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-264] 这一轮，DT 面前有哪些工具
  - 定位：`research/chapters/F/svg/f-overview.svg` L1，text 第 30 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-265] 读本渠道已发布、参与推理的实现
  - 定位：`research/chapters/F/svg/f-overview.svg` L1，text 第 31 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-266] 动态工具：条件满足才出现（开发中）
  - 定位：`research/chapters/F/svg/f-overview.svg` L1，text 第 32 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-267] 调用：按渠道找到实现，按协议请求
  - 定位：`research/chapters/F/svg/f-overview.svg` L1，text 第 34 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-268] 带上问题、历史、记忆、车况、渠道
  - 定位：`research/chapters/F/svg/f-overview.svg` L1，text 第 35 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-269] 用户打断时发取消
  - 定位：`research/chapters/F/svg/f-overview.svg` L1，text 第 36 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-270] 回包：一帧帧回来，最后一帧收尾
  - 定位：`research/chapters/F/svg/f-overview.svg` L1，text 第 38 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-271] 上屏的、播报的、给 DT 的分开写
  - 定位：`research/chapters/F/svg/f-overview.svg` L1，text 第 39 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-272] 给 DT 的那段变成工具反馈
  - 定位：`research/chapters/F/svg/f-overview.svg` L1，text 第 40 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-273] “帮我在四季民福订个座”
  - 定位：`research/chapters/F/svg/f-overview.svg` L1，text 第 41 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-274] 美团订座的接入点
  - 定位：`research/chapters/F/svg/f-overview.svg` L1，text 第 42 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-275] 发布以后，右边第 7 步才看得到它
  - 定位：`research/chapters/F/svg/f-overview.svg` L1，text 第 43 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-276] 交给 E 章：执行、回执、统一播报
  - 定位：`research/chapters/F/svg/f-overview.svg` L1，text 第 44 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-277] 给 DT 的那段经输入管理回到 DT（M 章）
  - 定位：`research/chapters/F/svg/f-overview.svg` L1，text 第 45 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-278] “说的和做的对不对得上”由 O 章核对
  - 定位：`research/chapters/F/svg/f-overview.svg` L1，text 第 46 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-279] 这一章不管什么
  - 定位：`research/chapters/F/svg/f-overview.svg` L1，text 第 47 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-280] DT 怎么选工具、怎么写参数：D 章。车控一句话怎么翻成函数、下发到车、回执怎么写：E 章。
  - 定位：`research/chapters/F/svg/f-overview.svg` L1，text 第 48 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-281] 车上固定说法和端侧 1.7B 小模型能办什么：R 章。司机 Agent 内部怎么调高德和智驾：DR 章。
  - 定位：`research/chapters/F/svg/f-overview.svg` L1，text 第 49 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-282] 状态：平台“定义 / 实现”两层已上线；说明书工具段动态加载在说明书版已用、训练版暂缓；动态工具开发中。
  - 定位：`research/chapters/F/svg/f-overview.svg` L1，text 第 50 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。

### 图件 f-protocol

- 文件：`research/chapters/F/svg/f-protocol.svg`；JSON：`research/chapters/F/diagrams.json["f-protocol"]`；PNG：`research/chapters/F/png/f-protocol.png`。
- 图题：三方 Agent 怎么回话：一次请求，一帧一帧回来。

- [DEST-283] 左边座舱云，右边三方 Agent。协议 v1.4（8 月 13 日）；用美团订座套着讲，它是否按这份协议接入待确认
  - 定位：`research/chapters/F/svg/f-protocol.svg` L1，text 第 2 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-284] 座舱云（调工具的服务）
  - 定位：`research/chapters/F/svg/f-protocol.svg` L1，text 第 3 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-285] 三方 Agent
  - 定位：`research/chapters/F/svg/f-protocol.svg` L1，text 第 4 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-286] ① 发出请求
  - 定位：`research/chapters/F/svg/f-protocol.svg` L1，text 第 5 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-287] 这一轮的话：“帮我在四季民福订个座”
  - 定位：`research/chapters/F/svg/f-protocol.svg` L1，text 第 6 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-288] 话题和这一问的编号、协议版本
  - 定位：`research/chapters/F/svg/f-protocol.svg` L1，text 第 7 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-289] 历史对话、长短期记忆、车况、谁坐哪
  - 定位：`research/chapters/F/svg/f-protocol.svg` L1，text 第 8 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-290] 渠道、车型、位置；账号 5 月起改为选填
  - 定位：`research/chapters/F/svg/f-protocol.svg` L1，text 第 9 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-291] 对方先回过程帧
  - 定位：`research/chapters/F/svg/f-protocol.svg` L1，text 第 11 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-292] 只上屏：“正在为您查询...”
  - 定位：`research/chapters/F/svg/f-protocol.svg` L1，text 第 12 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-293] 不播报，也不进历史
  - 定位：`research/chapters/F/svg/f-protocol.svg` L1，text 第 13 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-294] 最后一帧：收尾标记必须有
  - 定位：`research/chapters/F/svg/f-protocol.svg` L1，text 第 14 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-295] 上屏的内容（文字或卡片）
  - 定位：`research/chapters/F/svg/f-protocol.svg` L1，text 第 15 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-296] 播报的内容：一般留空，由 DT 来说
  - 定位：`research/chapters/F/svg/f-protocol.svg` L1，text 第 16 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-297] 给 DT 的内容：比如找到哪几家店
  - 定位：`research/chapters/F/svg/f-protocol.svg` L1，text 第 17 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-298] 出错时写错误码
  - 定位：`research/chapters/F/svg/f-protocol.svg` L1，text 第 18 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-299] ② 收到收尾帧才算这次调用结束
  - 定位：`research/chapters/F/svg/f-protocol.svg` L1，text 第 20 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-300] 发给车上、写进历史都等这一帧
  - 定位：`research/chapters/F/svg/f-protocol.svg` L1，text 第 21 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-301] 上屏的直接去屏幕（O 章）
  - 定位：`research/chapters/F/svg/f-protocol.svg` L1，text 第 22 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-302] 给 DT 的那段，变成工具反馈
  - 定位：`research/chapters/F/svg/f-protocol.svg` L1，text 第 23 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-303] ③ 交给 E 章和 M 章
  - 定位：`research/chapters/F/svg/f-protocol.svg` L1，text 第 24 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-304] 工具反馈经输入管理回到 DT
  - 定位：`research/chapters/F/svg/f-protocol.svg` L1，text 第 25 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-305] DT 读完再决定说什么、要不要下一轮
  - 定位：`research/chapters/F/svg/f-protocol.svg` L1，text 第 26 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-306] 可选：办不了就主动退回
  - 定位：`research/chapters/F/svg/f-protocol.svg` L1，text 第 27 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-307] 回一个“降级”命令，交还座舱
  - 定位：`research/chapters/F/svg/f-protocol.svg` L1，text 第 28 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-308] 由座舱决定换谁来答
  - 定位：`research/chapters/F/svg/f-protocol.svg` L1，text 第 29 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-309] 用户打断了怎么办
  - 定位：`research/chapters/F/svg/f-protocol.svg` L1，text 第 30 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-310] 调用方发取消信号，再断开连接
  - 定位：`research/chapters/F/svg/f-protocol.svg` L1，text 第 31 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-311] 调工具的服务通知对方结束
  - 定位：`research/chapters/F/svg/f-protocol.svg` L1，text 第 32 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-312] 已经生成的内容照样记进历史
  - 定位：`research/chapters/F/svg/f-protocol.svg` L1，text 第 33 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-313] 还有两种回法
  - 定位：`research/chapters/F/svg/f-protocol.svg` L1，text 第 35 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-314] 卡片数据：交给车上按卡片编号渲染
  - 定位：`research/chapters/F/svg/f-protocol.svg` L1，text 第 36 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-315] 透传：原样转给车上对应的程序
  - 定位：`research/chapters/F/svg/f-protocol.svg` L1，text 第 37 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-316] （屏幕卡片选按钮就是这种回法）
  - 定位：`research/chapters/F/svg/f-protocol.svg` L1，text 第 38 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-317] 协议管不到的
  - 定位：`research/chapters/F/svg/f-protocol.svg` L1，text 第 39 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-318] 协议只保证“这次调用怎么开始、怎么结束”。最后一帧说“订座成功”，是对方写的；真没真成，要看对方的订单状态。
  - 定位：`research/chapters/F/svg/f-protocol.svg` L1，text 第 40 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。
- [DEST-319] 美团订座的失败原因，10 月 30 日查看的输入输出表里还写着“待弋途提供失败原因”。
  - 定位：`research/chapters/F/svg/f-protocol.svg` L1，text 第 41 项（图内节点/注释）；同名 diagrams.json 条目；既有图件断言仍需原文核验。

## 去向判断前必须处理的既有矛盾

- `DATA.pages[F].bridge/mainline[1]` 说车型、渠道、账号、状态缺任意一项就不出工具；`DATA.base.modules[F].nodes[F03]` 又说工具可见不保证每次都能执行。F 研究应区分“工具列表加载条件”和“调用时权限/业务前提校验”，不能把二者合成万能过滤器。
- `f-lesson-protocol` 第一段出现“AgentServer 是根代理，浏览器核正常”明显病句；只登记其单 Agent 调用、不接管全计划编排的意图，未来写作不能复用病句。
- `DATA.base.modules[F].nodes[F14]` 已说 Redirect 最多两次；同模块指标“Redirect 目标校验与循环保护通过率”仍说没有统一最大跳转时不得自行填次数。研究应核原协议的两次适用范围，保留框架约定与项目落地差别。
- `f-lesson-dynamic` 前段把账号、状态不满足直接写成工具不可见，后段例子“空调最低不再调低”“下雨不开窗”实际是 Planner 的决策约束，主归 D/B，不是动态加载技术已支持这些来源的证明。
- 阅读页大部分停在概念，接入协议具体字段、取消端点、错误码、发布操作和快速测试范围主要来自后续原文研究，应补足，而非仅保留旧页短句。

## 读取台账与数量

- 已读取：V-STANDARD、component-cards 37～45；当前 v70 的 DATA.pages[F] 和 DATA.base.modules[F]；old-page.json 全部；diagrams.json 5 条全部；5 个 SVG 全部文本与结构。
- 当前阅读页/总图知识点登记 170 条；旧图的节点/注释登记 149 条；合计 **319 条**。这是保全用底表条目数，含重复意涵和图内标签，不代表独立产品事实数量。
- 本任务没有改写目标网页，也没有生成新 HTML；本表的去向将在设计阶段分配，当前只做“存量在哪里、说了什么”的底表。
