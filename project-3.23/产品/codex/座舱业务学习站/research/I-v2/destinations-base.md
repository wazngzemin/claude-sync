# I 章现网页知识点去向底表

研究用途：登记旧章覆盖范围，条目不作为已核验的产品事实；本轮不写正文、不改网页。来源为 v61 模块 I；D 编号为知识点，后附旧版快照与图示核对。

## 读取记录
- 已完整读取 V-STANDARD.md 和 component-cards.md；沿用全站统一叫法，后续写作应保留原图并逐条登记去向。

## v61 模块 I 正文知识点

定位方法：HTML 第 269 行为完整 `const DATA`，以下用 JSON 路径精确定位；数组下标从 0 开始。`sections` 与 `teaching.lessons` 的 39 段内容一致，只登记一次。

| 编号 | 当前网页知识点 | 位置 |
|---|---|---|
| D001 | 第二句要不要和第一句合并，取决于第一句已经走到哪个阶段，不是按座位拍板。 | `pages[I].sections[0](i-lesson-arrival).paragraphs[0]` |
| D002 | 新声音到达先进 I13（有效新话到来：先判断旧推理到哪一步）。 | `pages[I].sections[0](i-lesson-arrival).paragraphs[0]` |
| D003 | 10 月 19 日口径是：第一句还没有输出首 token，也就是还没有开始交付模型输出时，可以停掉尚未输出的那次推理，把两条有效输入一起重新处理；一旦首 token 已经出来，第二个有效指令打断第一个，第一个指令丢弃。 | `pages[I].sections[0](i-lesson-arrival).paragraphs[0]` |
| D004 | 首 token 可能只是一句过渡话术、工具调用还没发出，按两种旧定义会得到不同处理结果。 | `pages[I].sections[0](i-lesson-arrival).paragraphs[0]` |
| D005 | 旧多人 PRD 曾以「函数调用还没输出或下发」划定合并窗口，还把最多合并四条写成暂定。 | `pages[I].sections[0](i-lesson-arrival).paragraphs[1]` |
| D006 | 它和 10 月的「首 token 前后」不是同一个边界，讲解时要先说清依据哪份规则，具体合并条数也不能从历史暂定值推成当前产品容量。 | `pages[I].sections[0](i-lesson-arrival).paragraphs[1]` |
| D007 | 首 token 之后工具已经在外部检索，Director 可能已经空闲，能够处理副驾的新输入，但那次检索并不会因为 Director 接了新话就消失。 | `pages[I].sections[0](i-lesson-arrival).paragraphs[1]` |
| D008 | 工具在外部检索时进入 I15（工具已发出：新话可以接，旧结果仍要收）。 | `pages[I].sections[0](i-lesson-arrival).paragraphs[2]` |
| D009 | 结果回来后仍要按原请求和轮次关联，由输入管理安排怎样交回 Director 总结，它可能需要结合副驾的口味要求再判断，而不是把旧结果冒充成对新要求已经筛过的结果。 | `pages[I].sections[0](i-lesson-arrival).paragraphs[2]` |
| D010 | 10 月 19 日逐字稿把统一回复节奏列为正在优化的事情，不能把所有在途结果讲成已经拥有无缝自动合并的能力。 | `pages[I].sections[0](i-lesson-arrival).paragraphs[2]` |
| D011 | 两句有效指令冲突时，例如一个说打开车窗、一个说关闭同一个车窗，多人 PRD 期望先发起澄清，而不是按座位拍板。 | `pages[I].sections[0](i-lesson-arrival).paragraphs[3]` |
| D012 | 任务互补才合并成一条带角色标注的内部请求交给 Planner，角色用于说清来源，不充当默认优先级。 | `pages[I].sections[0](i-lesson-arrival).paragraphs[3]` |
| D013 | 音区提供说话来源，不自动意味着主驾永远压过副驾，安全相关的车辆控制另有专门规则。 | `pages[I].sections[0](i-lesson-arrival).paragraphs[3]` |
| D014 | 如果副驾说的是「你昨天吃得太多了」，那是在和主驾聊天，应当保持原来的餐厅查询，不参与合并。 | `pages[I].sections[0](i-lesson-arrival).paragraphs[4]` |
| D015 | 多人 PRD 明确要求，新来的拒识话语不得打断原来尚未完成的有效任务；否则系统表面上正确拒绝了闲聊，却把真正的需求一起丢掉。 | `pages[I].sections[0](i-lesson-arrival).paragraphs[4]` |
| D016 | 产品验收要同时看新句子有没有被错误接话、原请求有没有被误取消，只统计新句子的拒识对错，看不见后面这一半损失。 | `pages[I].sections[0](i-lesson-arrival).paragraphs[4]` |
| D017 | I16（界面同时表达聆听、思考、工具与播报）说明这些活动可能重叠，不是固定串行。 | `pages[I].sections[0](i-lesson-arrival).paragraphs[5]` |
| D018 | 豆包可能一边说「我找找看」，一边等待检索工具，用户插话时它同时在收听新输入。 | `pages[I].sections[0](i-lesson-arrival).paragraphs[5]` |
| D019 | 按上汽主交互新方案，工具展示的结束时机已经从工具返回首个字改为工具结果全部返回；展示一个「搜索中」图标是为了让用户知道在等什么，只有需要出卡的业务拿到有效结果后才展示结果卡，不能靠图标消失证明事情办成。 | `pages[I].sections[0](i-lesson-arrival).paragraphs[5]` |
| D020 | 多音区和多屏再叠加一层。 | `pages[I].sections[0](i-lesson-arrival).paragraphs[6]` |
| D021 | AIVA 方案把主驾与左后放在同侧识别区域，副驾与右后放在另一侧，同侧和跨侧合并时文字的替换或并存方式不同。 | `pages[I].sections[0](i-lesson-arrival).paragraphs[6]` |
| D022 | 后排有独立屏幕时，普通无关请求可以分别保留前后排卡片；出行和美团等连续交互优先在首个业务容器接续，避免选项和结果散到不同屏幕。 | `pages[I].sections[0](i-lesson-arrival).paragraphs[6]` |
| D023 | 并不是后排一开口就清掉前排餐厅卡，也不是任何相关话语都新建一张一样的卡。 | `pages[I].sections[0](i-lesson-arrival).paragraphs[6]` |
| D024 | 停声是为了给用户讲话空间，不是宣布旧任务已经结束。 | `pages[I].sections[1](i-lesson-stop).paragraphs[0]` |
| D025 | 餐厅已经找到，豆包正在说「第二家在游泳馆东侧，步行……」，用户插了一句「别说了，我自己看」。 | `pages[I].sections[1](i-lesson-stop).paragraphs[0]` |
| D026 | 播报过程中系统仍然持续收音，用户不必等豆包讲完才有机会表达；TTS 只是把回复文字变成声音，播报时仍接收新的用户语音。 | `pages[I].sections[1](i-lesson-stop).paragraphs[0]` |
| D027 | 进入这一步先记录原问题、说话音区和播放进度，任何新声音都不自动获得一条有效指令的身份。 | `pages[I].sections[1](i-lesson-stop).paragraphs[0]` |
| D028 | 要不要及时停播，由 I2（按当前场景决定是否及时停播）按当前场景判断。 | `pages[I].sections[1](i-lesson-stop).paragraphs[1]` |
| D029 | 按语音基础体验链路 OnePager，流式拒识触发提前打断的前提是多人场景、ASR 过程文字超过两个字、前缀不包含「豆包」、TTS 正在播放；多人一句话以「豆包」开头可以立即打断。 | `pages[I].sections[1](i-lesson-stop).paragraphs[1]` |
| D030 | 单人直接打断是另一条分支，规则另行区分。 | `pages[I].sections[1](i-lesson-stop).paragraphs[1]` |
| D031 | 这既不是任意响声都停止，也不必等整句话定稿才停。 | `pages[I].sections[1](i-lesson-stop).paragraphs[1]` |
| D032 | 打断时机本身经历过几版方案。 | `pages[I].sections[1](i-lesson-stop).paragraphs[2]` |
| D033 | 2.6 短期方案规定非拒识且非简单车控的指令立刻停止当前播报，收到非拒识结果后 1.5 秒暂定未等到简单车控内容就打断；二月底实验版改成 ASR 超过两个字先停，拒识则续播缓存音频；长期 SOP 方案仍待结合流式结果、场景和恢复策略确定。 | `pages[I].sections[1](i-lesson-stop).paragraphs[2]` |
| D034 | 三版属于不同阶段设计，不能拼成一套所有车型都在运行的配置。 | `pages[I].sections[1](i-lesson-stop).paragraphs[2]` |
| D035 | 满足打断条件后进入 I3（停止声音，记下当时已经发生什么）。 | `pages[I].sections[1](i-lesson-stop).paragraphs[3]` |
| D036 | 播放层真正停下旧声音，同时记下原来在回答谁、已经说过哪段、还剩哪段、为什么停，新旧说话人和音区不得丢失。 | `pages[I].sections[1](i-lesson-stop).paragraphs[3]` |
| D037 | 这里停的只是声音：餐厅检索可能早已完成，导航也可能已经启动，提醒任务可能仍然存在，它们不会因为扬声器安静下来而自动消失。 | `pages[I].sections[1](i-lesson-stop).paragraphs[3]` |
| D038 | 如果用户只是要安静看卡片，不继续念餐厅介绍是合理的，但不能因此告诉他「导航已经取消」。 | `pages[I].sections[1](i-lesson-stop).paragraphs[3]` |
| D039 | I18（系统抢占与淡出讨论，不是用户恢复规则）把系统声音单独拎出来。 | `pages[I].sections[1](i-lesson-stop).paragraphs[4]` |
| D040 | 导航提示转弯、电话通话或更高优先级提示进入时，是车型音频管理决定抢占还是拒播，并不是又来了一个用户 Query。 | `pages[I].sections[1](i-lesson-stop).paragraphs[4]` |
| D041 | 10 月 20 日需求评审逐字稿讨论过打断太突兀、200 毫秒淡出和按字边界停止，但最后仍要求再看效果定结论；靠打轴结果在字边界停声和人工加一段淡出是两件事，实际停声时刻与合成完成时刻要分别记时，不能把讨论中的优化写成已上线规则。 | `pages[I].sections[1](i-lesson-stop).paragraphs[4]` |
| D042 | 沉浸模式阈值切换是端侧配置：沉浸模式开时用高阈值、少误打断，沉浸关时用低阈值、更灵敏，误打断靠阈值控制。 | `pages[I].sections[1](i-lesson-stop).paragraphs[5]` |
| D043 | 这一条和 I2 的多人判据不冲突，它管的是「多小的声音就算有人开口」，I2 管的是「开口之后要不要停旧播报」。 | `pages[I].sections[1](i-lesson-stop).paragraphs[5]` |
| D044 | 两层叠加之后才是完整的停声决策，评审时不能只看一层就下结论。 | `pages[I].sections[1](i-lesson-stop).paragraphs[5]` |
| D045 | 早一点停声是为了给用户讲话空间，最后如何处理要依靠完整信息。 | `pages[I].sections[2](i-lesson-resume).paragraphs[0]` |
| D046 | 新声音停了旧播报之后，进入 I6（拿最终文字判断这次插话）。 | `pages[I].sections[2](i-lesson-resume).paragraphs[0]` |
| D047 | 过程文字可能改字，不能拿来定新任务，也不能用过程文字代替最终判断；最终文字还要和当前有效界面、请求编号、说话座位关联起来。 | `pages[I].sections[2](i-lesson-resume).paragraphs[0]` |
| D048 | 过程文字只能用于抢停声的时机，不能用于决定旧话要不要恢复、新诉求要不要办。 | `pages[I].sections[2](i-lesson-resume).paragraphs[0]` |
| D049 | 最终确认是有效新诉求，进入 I8（有效插话：新诉求和旧话一起交入）。 | `pages[I].sections[2](i-lesson-resume).paragraphs[1]` |
| D050 | 新话带着自己的说话人、音区和目标交输入管理，旧播报的未说内容一起附上；系统不是把两个说话人合成同一个用户，有效新 Query 保留自己的归属。 | `pages[I].sections[2](i-lesson-resume).paragraphs[1]` |
| D051 | 比如用户说「直接去第二家」，新目标已经改变，系统应优先完成选择，不能坚持从头念完三家餐厅；用户说「别说了，我自己看」，也不能把恢复机制做成过一会儿又自动开口。 | `pages[I].sections[2](i-lesson-resume).paragraphs[1]` |
| D052 | 最终只是旁人闲聊，进入 I14（被拒识的新话：保住原来的有效工作）：主驾原问题和已发出的工具保留，旁人闲聊不被改造成正式任务。 | `pages[I].sections[2](i-lesson-resume).paragraphs[2]` |
| D053 | 走查记录里「今天上海天气、今天北京天气、第三句吧啦吧啦」的场景，预期就是继续播报前两条有效结果，闲聊不参与合并。 | `pages[I].sections[2](i-lesson-resume).paragraphs[2]` |
| D054 | 拒识根因分两类：一类是语音识别不准，一类是把话截断了；被截断的话不直接拒识，应互动询问确认。 | `pages[I].sections[2](i-lesson-resume).paragraphs[2]` |
| D055 | 能不能进入恢复检查，先过 I17（恢复版本门槛：通用方案与 AIVA 分开）。 | `pages[I].sections[2](i-lesson-resume).paragraphs[3]` |
| D056 | 先确定目标车型和软件版本：通用 OnePager 方案在最终拒识时可以构造恢复事件；AIVA VUI 的跨音区流式打断条款写明，最终拒识后 NLG 不恢复、识别区域清空并转入延时聆听。 | `pages[I].sections[2](i-lesson-resume).paragraphs[3]` |
| D057 | 两套资料确实并存，不能用同一个验收预期评判两种车型配置，也不能把另一版结果判成偶发故障。 | `pages[I].sections[2](i-lesson-resume).paragraphs[3]` |
| D058 | 版本通过后，I4（恢复第一关：停播原因是否允许）先按中断原因筛选，不是让模型自由决定。 | `pages[I].sections[2](i-lesson-resume).paragraphs[4]` |
| D059 | OnePager 的原因表里，收到云端未拒识消息、流式结果非拒识、多人以「豆包」开头这几类允许进入恢复检查；新播报替换、服务挂起、第三方主动停止、离线车控反馈、退到静默态、单人打断等原因不恢复。 | `pages[I].sections[2](i-lesson-resume).paragraphs[4]` |
| D060 | 通过这道门槛只代表获得判断资格，不等于一定补播；剩余信息值不值得补，由后面 Director 判断，两层责任分开。 | `pages[I].sections[2](i-lesson-resume).paragraphs[4]` |
| D061 | 原因不允许时进入 I5（不满足恢复条件：结束旧播报）：本轮旧声音到此结束，不自动补播；车辆已完成动作保持真实状态，长期任务也不因此自动删除；如果最终存在新的有效 Query，仍走正常主链路。 | `pages[I].sections[2](i-lesson-resume).paragraphs[5]` |
| D062 | 通用方案下最终拒识、且原因允许时，走 I7（通用恢复分支：构造事件交 Director）。 | `pages[I].sections[2](i-lesson-resume).paragraphs[5]` |
| D063 | 这个 event 是一个系统事件，不是替乘客新造的一条需求；事件要告诉 Director 刚才在回答谁、说过哪些内容、哪些内容被打断。 | `pages[I].sections[2](i-lesson-resume).paragraphs[5]` |
| D064 | 两条路进入 I9（Director 判断剩余信息还有价值吗）。 | `pages[I].sections[2](i-lesson-resume).paragraphs[6]` |
| D065 | 取舍分成四种：重点已经讲完、只剩尾句，可以在 I10（无需补充：自然结束旧话题）自然结束；旧信息和新话题重合，合并成一句更及时的话；剩余内容太长，先提炼；确有独立价值的信息，才在 I11（需要补充：简短衔接后统一输出）简短接回。 | `pages[I].sections[2](i-lesson-resume).paragraphs[6]` |
| D066 | 餐厅选择已经落实，没念完的「已为你选择」通常没必要重复；尚未告诉用户的「这家今天不营业」不能因为插话就永远丢掉。 | `pages[I].sections[2](i-lesson-resume).paragraphs[6]` |
| D067 | 这里的恢复主要是重新组织需要表达的信息，不必原封不动重播旧音频。 | `pages[I].sections[2](i-lesson-resume).paragraphs[7]` |
| D068 | 历史打断 PRD 还保留过 2.6 短期方案和二月底实验版：有的先等拒识与简单车控分类，有的听到超过两个字先停、最终拒识再续播缓存音频；不能拿旧实验里的标点续播规则盖掉后来按信息价值重新组织的做法，也不能看到旧文写过恢复，就认定当前 AIVA 最终拒识也必然恢复。 | `pages[I].sections[2](i-lesson-resume).paragraphs[7]` |
| D069 | 「别说了」只是让声音停下来，不等于取消任何任务。 | `pages[I].sections[3](i-lesson-execution).paragraphs[0]` |
| D070 | 真要取消某件事，进入 I12（明确取消任务时，另走任务操作）。 | `pages[I].sections[3](i-lesson-execution).paragraphs[0]` |
| D071 | 用户说「取消刚才设的泳镜提醒」，系统要先定位那条提醒，交给对应工具办理，等待取消回执后再确认结果；若说「别找餐厅了」，还要看这次查询是否已经完成、执行方是否支持取消在途工作。 | `pages[I].sections[3](i-lesson-execution).paragraphs[0]` |
| D072 | 已经下发或完成的车控要撤回，取决于执行方有没有能力，必要时还涉及另一个补偿动作。 | `pages[I].sections[3](i-lesson-execution).paragraphs[1]` |
| D073 | 停止播报、停止尚未交付的推理、取消后台任务、撤销已执行动作是四件不同的事，不能合成一个「取消成功」。 | `pages[I].sections[3](i-lesson-execution).paragraphs[1]` |
| D074 | 停止播报只改扬声器；停止推理只让本次云端计算不再产出；取消后台任务要等任务工具回执；撤销已执行动作可能需要一个反向操作。 | `pages[I].sections[3](i-lesson-execution).paragraphs[1]` |
| D075 | 客户端打断后，下一句可能已经到云端处理，上一句部分回答还没来得及写入。 | `pages[I].sections[3](i-lesson-execution).paragraphs[2]` |
| D076 | 因此非生成结果要及时同步，生成内容随交付过程持续写入，不能等整段播报结束才记历史。 | `pages[I].sections[3](i-lesson-execution).paragraphs[2]` |
| D077 | 已经下发的工具，仍然要收回真实回执，不能因为声音停了就当任务也停了。 | `pages[I].sections[3](i-lesson-execution).paragraphs[2]` |
| D078 | 但「已经写进历史」和「用户已经听到」仍要分开：云端可能已经生成三家餐厅文字，播放器只说到第二家就被打断。 | `pages[I].sections[3](i-lesson-execution).paragraphs[3]` |
| D079 | 历史保存已交付内容，I3（停止声音，记下当时已经发生什么）另存播放位置，Director 才知道哪些无需重复、哪些尚未表达。 | `pages[I].sections[3](i-lesson-execution).paragraphs[3]` |
| D080 | 这两个状态分开存，恢复时才不会重复播报或漏掉关键信息。 | `pages[I].sections[3](i-lesson-execution).paragraphs[3]` |
| D081 | 计划话术也不能替代真实结果：先写「正在为你打开车窗」，执行失败后把「打开失败」追加到同一轮。 | `pages[I].sections[3](i-lesson-execution).paragraphs[4]` |
| D082 | 端云各算一份候选时，未被最终采信的答案不进入下一轮业务事实。 | `pages[I].sections[3](i-lesson-execution).paragraphs[4]` |
| D083 | 拒识内容进入情景上下文，不放进普通任务对话。 | `pages[I].sections[3](i-lesson-execution).paragraphs[4]` |
| D084 | 任务的完整创建、存续、取消和回执归任务生命周期那一章，本章只确认停声不自动撤销已下发动作。 | `pages[I].sections[3](i-lesson-execution).paragraphs[4]` |
| D085 | 静默接管是已落地能力：家人闲聊时豆包保持沉默，之后有人说「要不叫豆包帮看看」，直接接管上文继续答。 | `pages[I].sections[3](i-lesson-execution).paragraphs[5]` |
| D086 | 多人跨音区上下文继承标注为 2.6 目标、已打通：两个乘客先后说话，合并时各自的音区和身份都保留，不串音区、不串身份。 | `pages[I].sections[3](i-lesson-execution).paragraphs[5]` |
| D087 | 这条能力的验收要分别测主驾唤醒后接副驾的话、副驾说完后主驾追问两种方向。 | `pages[I].sections[3](i-lesson-execution).paragraphs[5]` |
| D088 | 合并两条输入时，归属要保留到角色标注里，不能合成一个匿名用户。 | `pages[I].sections[4](i-lesson-multiple).paragraphs[0]` |
| D089 | 主驾提出地点需求，副驾补充口味要求，Director 要知道「去望京」和「不要辣」分别来自谁，I8（有效插话：新诉求和旧话一起交入）保证每条信息带上说话人标识、座位和音区。 | `pages[I].sections[4](i-lesson-multiple).paragraphs[0]` |
| D090 | 否则后续「再近一点」分不清是主驾在改距离还是副驾在改方向。 | `pages[I].sections[4](i-lesson-multiple).paragraphs[0]` |
| D091 | 多屏再叠加一层。 | `pages[I].sections[4](i-lesson-multiple).paragraphs[1]` |
| D092 | 后排显示到某块屏幕也不代表后排获得或失去某项车辆控制权限。 | `pages[I].sections[4](i-lesson-multiple).paragraphs[1]` |
| D093 | 后排有独立屏幕时，普通无关请求可以分别保留前后屏各自的上下文，车辆控制权限仍按座位和账号关系判断，不因屏幕位置自动放开。 | `pages[I].sections[4](i-lesson-multiple).paragraphs[1]` |
| D094 | 前后屏各自的上下文隔离要单独测试，不能只测主驾单屏场景。 | `pages[I].sections[4](i-lesson-multiple).paragraphs[1]` |
| D095 | 越强调随时插话，越容易在交接处丢掉上文。 | `pages[I].sections[4](i-lesson-multiple).paragraphs[2]` |
| D096 | 用户已经选中餐厅，中途停止过介绍，接着说「就去这里」，系统要知道「这里」指哪一家，还要知道刚才只是选中、已经开始导航还是导航失败。 | `pages[I].sections[4](i-lesson-multiple).paragraphs[2]` |
| D097 | 这些状态都要在历史和任务队列里留痕，不能只靠当前屏幕显示推断。 | `pages[I].sections[4](i-lesson-multiple).paragraphs[2]` |
| D098 | 无关对话误打断率统计没有提出新诉求却让旧播报不必要停止的比例。 | `pages[I].sections[4](i-lesson-multiple).paragraphs[3]` |
| D099 | 恢复决策正确率按版本允许恢复且有剩余内容的案例，分别核对应补、应融合、应摘要、应跳过是否正确。 | `pages[I].sections[4](i-lesson-multiple).paragraphs[3]` |
| D100 | 这两个指标要分人群、音区、唤醒词和网络条件；高噪声、弱网、多音区场景最容易暴露问题。 | `pages[I].sections[4](i-lesson-multiple).paragraphs[3]` |
| D101 | 取消状态一致率核对用户取消意图、任务工具返回、任务实际存续和后续是否再次触发。 | `pages[I].sections[4](i-lesson-multiple).paragraphs[4]` |
| D102 | 合并边界正确率按项目明确的首结果边界分桶，检查两条输入是该并列、该先后、还是该放弃其中一条。 | `pages[I].sections[4](i-lesson-multiple).paragraphs[4]` |
| D103 | 这些指标的基线和目标值由项目测试方案给出，不在本章拍数。 | `pages[I].sections[4](i-lesson-multiple).paragraphs[4]` |
| D104 | 多人同车的隐私边界另见身份与记忆章。 | `pages[I].sections[4](i-lesson-multiple).paragraphs[5]` |
| D105 | 本章只保证多人输入合并不丢角色、不串上下文；哪些记忆能被谁召回、哪些偏好不能跨座位引用，由身份链路单独判断。 | `pages[I].sections[4](i-lesson-multiple).paragraphs[5]` |
| D106 | 评审时不要把输入合并的正确率和记忆召回的权限判断混为一谈，两者的验收用例和指标都不同。 | `pages[I].sections[4](i-lesson-multiple).paragraphs[5]` |
| D107 | 走查一次插话要同时讲清三件事：新话被怎样理解，旧声音怎样处理，旧动作现在处于什么真实状态。 | `pages[I].sections[5](i-lesson-check).paragraphs[0]` |
| D108 | 餐厅列表可以留在屏幕上，介绍声音可以结束，导航是否继续要单独看导航的实际结果；这三件事经常被混在一句「我刚才打断了」里讲，但它们是三条独立状态，必须分别核对。 | `pages[I].sections[5](i-lesson-check).paragraphs[0]` |
| D109 | 排查时先问四个问题：用户说的是停止说话、停止当前任务，还是取消整个会话；这次停止之后，当前播报有没有未播完的尾部；当前任务是继续执行、暂停还是已经结束；下一步如果恢复，要从哪里接着说。 | `pages[I].sections[5](i-lesson-check).paragraphs[1]` |
| D110 | 把分叉点定错，后面所有恢复和取消判断都会跟着错。 | `pages[I].sections[5](i-lesson-check).paragraphs[1]` |
| D111 | 长期任务因插话暂时退出前台不等于任务被删除。 | `pages[I].sections[5](i-lesson-check).paragraphs[2]` |
| D112 | 10 月 19 日逐字稿明确当时相关长时恢复能力还在建设，不能普遍对外承诺。 | `pages[I].sections[5](i-lesson-check).paragraphs[2]` |
| D113 | 评审时要区分「声音停了」和「任务停了」：导航在后台继续算路、音乐在后台继续播放，这些都属于声音停了但任务还活着。 | `pages[I].sections[5](i-lesson-check).paragraphs[2]` |
| D114 | 每次停播还要留下真实原因、请求归属、实际静音时间和恢复门槛，区分用户插话、系统抢占、新播报替换和退出。 | `pages[I].sections[5](i-lesson-check).paragraphs[3]` |
| D115 | 没有这些留痕，事后复盘只能看到「声音停了」，说不清是用户说「别说了」、系统自己切了频道、还是新播报自然替换，也无法判断这次停播该不该恢复。 | `pages[I].sections[5](i-lesson-check).paragraphs[3]` |
| D116 | 恢复后遗漏与重复率单独统计重要信息丢失和已说内容重复，这两个指标最能暴露 Director 取舍判断的偏差。 | `pages[I].sections[5](i-lesson-check).paragraphs[4]` |
| D117 | 停顿后的语音补全率看云端在停顿后能不能正确判断哪些该说、哪些不该说。 | `pages[I].sections[5](i-lesson-check).paragraphs[4]` |
| D118 | 这组指标要按任务类型分桶：导航播报、餐厅介绍、音乐推荐各自的恢复难度不同。 | `pages[I].sections[5](i-lesson-check).paragraphs[4]` |
| D119 | 任务取消成功率核对用户说取消之后，任务工具是否真的收回了在途请求、已下发动作是否真的撤销。 | `pages[I].sections[5](i-lesson-check).paragraphs[5]` |
| D120 | 常见失败是声音停了但工具还在跑，下一轮又冒出一个迟到的结果。 | `pages[I].sections[5](i-lesson-check).paragraphs[5]` |
| D121 | 整章的最终口径是：停声、合并、恢复、取消四条支路各自独立判断、独立留痕，不能用一个「打断成功」盖过所有分支。 | `pages[I].sections[5](i-lesson-check).paragraphs[5]` |

## 原图节点中补充的知识点

下列条目记录节点详情中比正文更细的约束；节点与正文冲突时保留双方，等待 raw 核验。

| 编号 | 当前网页知识点 | 位置 |
|---|---|---|
| D122 | 未放行工具且尚无输出的候选可合并重算；已发工具只能作为中断上下文，避免重发。 | `base.modules[I].nodes[id=I13].detail / paragraphs` |
| D123 | 同一批工具结果收齐后，再安排对应续轮推理。 | `base.modules[I].nodes[id=I15].detail / paragraphs` |
| D124 | 开窗已被执行方接收时，是否中止由执行方决定；已打开需另办关闭。 | `base.modules[I].nodes[id=I15].detail / paragraphs` |
| D125 | 二月底实验有语音打断开关，拒识时用缓存 pcm 续播、召回时等待新 TTS。 | `base.modules[I].nodes[id=I3].detail / paragraphs` |
| D126 | 系统停止指令、TTS 合成结束、扬声器静音和音频资源释放是不同时间点。 | `base.modules[I].nodes[id=I18].detail / paragraphs` |
| D127 | 需核对音频焦点真的让出，还是旧声只被压低。 | `base.modules[I].nodes[id=I18].detail / paragraphs` |
| D128 | 有效用户新话属 P0，优先于普通建议。 | `base.modules[I].nodes[id=I8].detail / paragraphs` |
| D129 | 普通建议排队时，须等必要输出真正结束或按规则终止。 | `base.modules[I].nodes[id=I10].detail / paragraphs` |
| D130 | 跨音区恢复应交代回答对象，例如叫出原提问人后再补天气。 | `base.modules[I].nodes[id=I11].detail / paragraphs` |
| D131 | 恢复新话术仍走同一合成与播放路径，也接受后续打断。 | `base.modules[I].nodes[id=I11].detail / paragraphs` |
| D132 | 工具状态随调用开始、相应反馈后结束；界面隐藏或聆听超时不必然取消工具。 | `base.modules[I].nodes[id=I16].detail / paragraphs` |
| D133 | 失败不必然出结果卡，可能只需话术；有效结果且有卡片定义才出卡。 | `base.modules[I].nodes[id=I16].detail / paragraphs` |

## 评审问题、指标与讲解附属内容

| 编号 | 当前网页知识点 | 位置 |
|---|---|---|
| D134 | 用户刚开口到旧声音真正停止，中间在等哪项判断？ 识别出字、拒识返回和播放器实际停止是不同时间点。 验收：能以单人、多人、带唤醒词和不带唤醒词案例说明条件，并给出实际停播时间。 | `base.modules[I].questions[0]` |
| D135 | 这次没恢复，是原因不允许，还是模型判断不值得补？ 两层判断的责任不同，合在一起会找不到误丢信息的根因。 验收：日志同时记录停播原因、恢复门槛结果、提交给 Director 的剩余内容和最终判断。 | `base.modules[I].questions[1]` |
| D136 | “别说了”和“取消十分钟后的提醒”分别改变什么状态？ 停止声音不能证明提醒已删除，停止推理也不能撤销已执行车控。 验收：分别验收播报停止、未下发推理停止、任务取消回执和已下发动作的实际状态。 | `base.modules[I].questions[2]` |
| D137 | 跨音区插话后，补回来的内容有没有对错人？ 合并输入容易丢说话人、任务归属和原回答对象。 验收：主驾问天气、副驾插话的案例中，系统能正确归属新旧诉求，避免错误称呼和操作位置。 | `base.modules[I].questions[3]` |
| D138 | 这辆车拒识了新一句话后，旧播报会怎样处理？ 允许恢复旧播报和保持停播会产生不同体验，必须先明确项目采用哪一种策略。 验收：按目标车型、版本确认预期，验收用例明确引用对应规则，不能把另一版结果判成偶发故障。 | `base.modules[I].questions[4]` |
| D139 | 首 token、FC 下发、end frame 三个时间点各管什么？ 多人输入的归属与卡片内容是否仍相关，是两个判断，混在一起可能取消错误任务或提前清掉卡片。 验收：分别给出输入合并截止、工具可撤销边界、卡片更新触发；附当前版本的时序证据。 | `base.modules[I].questions[5]` |
| D140 | 天气正在查询时，旁人闲聊被拒识会不会导致天气也不答？ 拒识本身正确但取消了原有效请求，整体仍是失败。 验收：原请求、工具、最终答复保持完整；若误停声音，恢复符合车型版本而非随意补播。 | `base.modules[I].questions[6]` |
| D141 | 工具已下发后用户插话，迟到反馈还能找到原任务吗？ 取消推理不能撤销外部动作；丢反馈会造成模型不知道真正发生了什么。 验收：同一请求的工具回执正确回流，分别展示新对话、旧动作结果和取消请求的实际状态。 | `base.modules[I].questions[7]` |
| D142 | 动画显示思考/聆听/调用中，分别由什么事实触发结束？ 视觉状态不能代替工具真实结果，折叠界面不等于停执行。 验收：每个 UI 状态可对应请求、首 token、调用、反馈、播放等事件；覆盖同时进行和部分失败。 | `base.modules[I].questions[8]` |
| D143 | 有效插话停播时长：从有效用户语音起点到旧 TTS 实际停止的分布，分人群、音区、唤醒词和网络条件统计。 至少按车型、版本、入口和成功/失败分组；不能用整体平均值掩盖异常场景。 状态：建议验收口径；阈值需项目确认。 | `base.modules[I].metrics[0]` |
| D144 | 无关对话误打断率：没有对助手提出新诉求却让旧 TTS 不必要停止的比例；误打断后是否自然恢复另计。 至少按车型、版本、入口和成功/失败分组；不能用整体平均值掩盖异常场景。 状态：建议验收口径；阈值需项目确认。 | `base.modules[I].metrics[1]` |
| D145 | 恢复决策正确率：按版本允许恢复且有剩余内容的案例，分别判断应补、应融合、应摘要、应跳过是否正确。 至少按车型、版本、入口和成功/失败分组；不能用整体平均值掩盖异常场景。 状态：建议验收口径；阈值需项目确认。 | `base.modules[I].metrics[2]` |
| D146 | 恢复后遗漏与重复率：统计重要信息丢失和已经说过的信息重复出现的比例，不能只统计是否重新发声。 至少按车型、版本、入口和成功/失败分组；不能用整体平均值掩盖异常场景。 状态：建议验收口径；阈值需项目确认。 | `base.modules[I].metrics[3]` |
| D147 | 取消状态一致率：用户取消意图、任务工具返回、任务实际存续及后续是否再次触发保持一致的比例。 至少按车型、版本、入口和成功/失败分组；不能用整体平均值掩盖异常场景。 状态：建议验收口径；阈值需项目确认。 | `base.modules[I].metrics[4]` |
| D148 | 多请求合并边界正确率：以当前项目明确的首 token 等边界分桶，统计合并/独立处理是否符合预期，保留各说话人和音区，排除被拒识的新话。 至少按车型、版本、入口和成功/失败分组；不能用整体平均值掩盖异常场景。 状态：建议验收口径；阈值需项目确认。 | `base.modules[I].metrics[5]` |
| D149 | 在途工具反馈保全率：打断或新输入后，旧工具的真实结果仍能关联原请求并进入后续判断的比例；与用户是否听到旧确认话术分开。 至少按车型、版本、入口和成功/失败分组；不能用整体平均值掩盖异常场景。 状态：建议验收口径；阈值需项目确认。 | `base.modules[I].metrics[6]` |
| D150 | 用户与系统停播原因可追溯性：每次停播记录真实原因、请求归属、实际静音时间及恢复门槛，区分用户插话、系统抢占、新 TTS 替换和退出。 至少按车型、版本、入口和成功/失败分组；不能用整体平均值掩盖异常场景。 状态：建议验收口径；阈值需项目确认。 | `base.modules[I].metrics[7]` |
| D151 | 把停播耗时、最终文字定稿、旧工具结果回流分别计时，区分播放、识别和回执层瓶颈。 | `pages[I].teaching.guides.base.paragraphs[7]` |
| D152 | “别说了，直接去第二家”同时包含停止旧声和新选择，须保留旧候选列表及播放进度。 | `pages[I].feynman.retell` |
| D153 | 闲聊最终被拒识后是否恢复，仍由停止原因和车型版本决定。 | `pages[I].feynman.transfer[0]` |
| D154 | 停介绍后再问“这家远吗”，仍需保留原列表、选择对象和真实结果。 | `pages[I].feynman.transfer[1]` |
| D155 | 本章不展开工具回执分类、任务创建/取消完整生命周期和记忆权限；分别交其他章。 | `pages[I].teaching.closing[0] / sections[3].paragraphs[4] / sections[4].paragraphs[5]` |

### 结构核对（不计知识点）
- 当前模块包含 6 个讲解节、39 个正文段落、18 个原图节点、20 条原图连线、9 条评审问答、8 项指标。
- `flows`、`cases`、`terms`、`questions`、`metrics`、`roadmap`、`related` 和 `referenceTables` 在 `pages[I]` 顶层均为空；评审题和指标实际保存在 `base.modules[I]`。
- `teaching` 的 3 段导读、8 段读图、2 段收尾，`feynman` 的 4 节、1 道复述题和 2 道迁移题，以及 `bridge/mainline` 均已完整读取；重复机制已合并登记。
- 原图全部 18 节点及 20 连线已读取；节点与正文出现合并边界差别：正文按“首 token”，I13 节点和连线同时强调“工具未发且无有效输出”。
- 本底表仅登记旧内容，不认定网页中的能力成熟度、数值和示例均已由原文证实。

当前累计知识点：155 条。
## old-page.json 逐文件核对
- 已完整读取 `research/chapters/I/old-page.json` 的 407 行，并按解析后的所有字段递归比较；它与 v61 `DATA.pages[id=I]` 完全相同，没有知识点增删或文字差异。
- 该快照只含 page 对象，不含 v61 `base.modules[I]` 的原图节点、连线、评审题和指标，后者已在本表单独登记。

## diagrams.json 图示知识点（研究目录图稿，单独登记）

`diagrams.json` 已完整读取，包括 5 段 SVG 的全部文本和连线；v61 的 `DATA.diagrams` 未包含这 5 个键，故不能把图稿误报成当前已显示的网页内容。图上的“线上现状”“开发中”等是图稿自己的时点声明，仍须 raw 核验。

| 编号 | 图示知识点 | 来源位置 |
|---|---|---|
| G001 | 总图按端侧与云端分列，起点是豆包已经停播，终点是新回答播出。 | `diagrams.json["i-overview"]` 标题、泳道、页脚 |
| G002 | 总图列出停播记因、最终拒识、判旧轮进度、切分已说/未说、按两种形态交回、判断价值 6 步。 | 同上，节点 1–6 |
| G003 | 图称 10 种停播原因中只有 3 种可以进入恢复。 | 同上，节点 1 |
| G004 | 已说/未说按播放时长和逐字时间点切分，没有时间点只能估算。 | 同上，节点 4 |
| G005 | 图把恢复解释为重生成，已发导航、车控、查询继续并回结果。 | 同上，右下角 |
| G006 | 图称新输入管理开发中、计划 11 月底验收，会改变第 1、3、5 步。 | 同上，页脚 |
| G007 | 四个插话时刻分别为：DT 首输出前、已输出但工具查询中、结果回待总结、结果播报中。 | `diagrams.json["i-timing"]` 四列 |
| G008 | 首输出前取消旧推理、合并两条话重想，用户听到一个回答。 | 同上，第一列 |
| G009 | 已输出且工具在查时第二句打断第一句，但已发查询不撤回、结果仍交 DT。 | 同上，第二列 |
| G010 | 结果回来待总结时 DT 可接新话；旧结果与新话合并后总结，统一回复节奏当时仍在优化。 | 同上，第三列、注释 |
| G011 | 线上实际分界是 DT 第一个输出，可能是文字，也可能是工具调用。 | 同上，分界注释 |
| G012 | 新输入管理改用工具是否已发和端侧是否开播两条边界，已发工具的旧话只作背景，防重复执行。 | 同上，下方方案框 |
| G013 | 有效插话把未说内容附在新输入，字段名为 last_talk_content。 | `diagrams.json["i-forms"]` 左支 |
| G014 | 拒识插话本身不成为新诉求，另构造事件携带打断者、已说和未说，触发 DT 续轮。 | 同上，右支 |
| G015 | 有效支路同时回应新话与判断旧话；拒识事件支路只判断旧话，不值得补时不出声。 | 同上，两支末端 |
| G016 | 图排除单人插话、高优播报替换、对话退出三种情况，且提示赛力斯“不恢复”分支与事件恢复不同。 | 同上，页脚 |
| G017 | 恢复规则的输入包括未说内容、新话（若有）和对话历史。 | `diagrams.json["i-rules"]` 起点 |
| G018 | 只剩 1–3 个无关紧要的字、语气词、用户不想听或只有执行结果确认时不补。 | 同上，“不补”框 |
| G019 | 新旧话题相关时合成一个回答，不刻意说“刚才被打断了我接着说”。 | 同上，“合成一个回答”框 |
| G020 | 不相关且未说内容有三句以上时只提炼评分、距离、结论等核心。 | 同上，“只提炼核心”框 |
| G021 | 不相关且较短的知识、新闻、天气、操作说明可补完关键内容，并补称呼明确对象。 | 同上，“把关键信息说完”框 |
| G022 | 这套恢复规则是给 DT 的提示规则，不是单独模型或程序。 | 同上，页脚 |
| G023 | 对照图的旧方案为直接停播，拒识后另起轮由 DT 判断。 | `diagrams.json["i-newold"]` 第一行左侧 |
| G024 | 对照图的新方案为端侧先暂停，拒识且允许恢复时续原音频，有效插话才永久停止。 | 同上，第一行右侧 |
| G025 | 旧方案按 DT 首输出丢弃旧推理，新方案按工具与开播边界保留旧话为背景。 | 同上，第二行 |
| G026 | 旧方案上报时长并用临时标记表达播完，新方案上报开始、进度、播完、永久停止四种事件且永久停止带原因。 | 同上，第三行 |
| G027 | 新方案减少回答交错的效果需等验收后的路测数据。 | 同上，页脚 |

读取记录：完成 diagrams.json 后即追加 G001–G027，未修改图稿或网页。
- 已完整读取 `svg/i-overview.svg`，与 `diagrams.json["i-overview"]` 字节完全一致，覆盖 G001–G006，无新增知识点。
- 已完整读取 `svg/i-timing.svg`，与 `diagrams.json["i-timing"]` 字节完全一致，覆盖 G007–G012，无新增知识点。
- 已完整读取 `svg/i-forms.svg`，与 `diagrams.json["i-forms"]` 字节完全一致，覆盖 G013–G016，无新增知识点。
- 已完整读取 `svg/i-rules.svg`，与 `diagrams.json["i-rules"]` 字节完全一致，覆盖 G017–G022，无新增知识点。
- 已完整读取 `svg/i-newold.svg`，与 `diagrams.json["i-newold"]` 字节完全一致，覆盖 G023–G027，无新增知识点。

底表计数：网页知识点 D001–D155，共 155 条；另有研究图稿 G001–G027，共 27 条；合计 182 条登记。当前未分配新正文去向，留给后续设计步骤。
