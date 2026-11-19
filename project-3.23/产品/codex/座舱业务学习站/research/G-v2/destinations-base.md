# G 章现行知识点底表

研究日期：2026-11-17；仅研究，不写正文、不修改网页。来源位置优先使用文件行号，JSON 使用字段路径或记录编号。

## 核对范围

现行 v74 的 `DATA.pages[id=G]` 与 `research/chapters/G/old-page.json` 逐字段完全相同；以下将重复文字合并登记全部位置，不把旧网页当作当前能力证据。原图另读取 `DATA.base.modules[id=G]` 与 `DATA.originalSvg`，包含 12 个节点、16 条内部边和跨章连线；正文与原图不一致处保留两边。

## 正文、导读与复述知识点

- **DG-P001** 云端触发器
  - 位置：`pages[G].title`；sourceIds：`ASY-A05`、`ASY-A06`、`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A40`、`ASY-A47`、`CTA-TRIGGER`、`VOICE-V15-LECTURE`、`RESUME-TRIGGER-ONEPAGE`。
- **DG-P002** 云端触发
  - 位置：`pages[G].shortTitle`；sourceIds：`ASY-A05`、`ASY-A06`、`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A40`、`ASY-A47`、`CTA-TRIGGER`、`VOICE-V15-LECTURE`、`RESUME-TRIGGER-ONEPAGE`。
- **DG-P003** 把已登记的条件和新到信号对上，产生一次有业务归属的触发；真正说话和控车交给下游。
  - 位置：`pages[G].summary`；sourceIds：`ASY-A05`、`ASY-A06`、`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A40`、`ASY-A47`、`CTA-TRIGGER`、`VOICE-V15-LECTURE`、`RESUME-TRIGGER-ONEPAGE`。
- **DG-P004** 用户说“宝宝哭了告诉我”——后排观察不断到达，哪一份描述符合条件、符合后通知谁。
  - 位置：`pages[G].scenario`；sourceIds：`ASY-A05`、`ASY-A06`、`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A40`、`ASY-A47`、`CTA-TRIGGER`、`VOICE-V15-LECTURE`、`RESUME-TRIGGER-ONEPAGE`。
- **DG-P005** 一条场景配好了，谁来发现它该在什么时候发生。这一章先圈定适用车辆和信号，再判断条件是否达成，过次数与间隔限制后按配置好的出口交出去。它只通知「条件命中了」，不直接控车，也不替任务服务决定这条安排还在不在。
  - 位置：`pages[G].bridge`；sourceIds：`ASY-A05`、`ASY-A06`、`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A40`、`ASY-A47`、`CTA-TRIGGER`、`VOICE-V15-LECTURE`、`RESUME-TRIGGER-ONEPAGE`。
- **DG-P006** 场景先绑定业务与适用车辆，再选择能观察到的触发来源
  - 位置：`pages[G].sections[0].title`、`pages[G].teaching.lessons[0].title`；sourceIds：`RESUME-TRIGGER-ONEPAGE`。
- **DG-P007** 一条触发场景先要说明它属于谁、在哪些车辆上生效。G01（接收场景与业务关系）承接业务安排，G02（这辆车能用这个场景吗）核对生效范围。OnePage列出渠道、车型、车辆ID与客户端版本等范围条件。后台保存规则只是配置完成，不代表每台车都已经收到或能执行；测试要选目标车型、环境与版本，不能拿其他车辆的成功记录证明本车已支持。[触发器 OnePage·生效范围](https://bytedance.larkoffice.com/docx/KdBzd7uzXonxOZxXJW9cHSKonld)
  - 位置：`pages[G].sections[0].paragraphs[0]`、`pages[G].teaching.lessons[0].paragraphs[0]`；sourceIds：`RESUME-TRIGGER-ONEPAGE`。
- **DG-P008** 接着看G03（哪个信号叫醒这次检查）。信号触发可以判断端状态当前快照，也可以监听状态变为目标值。例如「车速为0」是当前状态，「车速变更为0」是从其他值切到0的那次变化。若车一直停着，反复上报0不应被解释为又停车一次。这两种条件的触发次数和去重依据不同，产品要先选准想观察的是状态还是变化。[触发器 OnePage·静态判断和变更为](https://bytedance.larkoffice.com/docx/KdBzd7uzXonxOZxXJW9cHSKonld)
  - 位置：`pages[G].sections[0].paragraphs[1]`、`pages[G].teaching.lessons[0].paragraphs[1]`；sourceIds：`RESUME-TRIGGER-ONEPAGE`。
- **DG-P009** 上报是把端上或业务服务产生的信息传给指定接收方，不表示助手已经采取动作。车况上报的是设备值及相关信息，视觉上报的是模型观察或任务结果；事件服务还可接应用点击和业务过程。G12（把有意义的状态变化写业务事件）帮助保留可供后续消费的事实。只有来源、对象和时间明确，规则才知道这次信息应更新哪个状态，不能把不同座位、不同设备的同名字段混在一起。具体字段和上报策略见B与EL章。
  - 位置：`pages[G].sections[0].paragraphs[2]`、`pages[G].teaching.lessons[0].paragraphs[2]`；sourceIds：`RESUME-TRIGGER-ONEPAGE`。
- **DG-P010** 云端不是只在用户说话时工作。定时计划、业务事件和相关端状态都可能让它开始检查，但持续视觉、任务服务和端侧业务也可能独立运行。旧稿把触发器说成「没人说话时唯一工作的层」会误导分工，应删掉。触发器只消费自己需要的来源，任务是否存在、视觉是否运行以及用户能否接受主动打扰，由相应模块承担。
  - 位置：`pages[G].sections[0].paragraphs[3]`、`pages[G].teaching.lessons[0].paragraphs[3]`；sourceIds：`RESUME-TRIGGER-ONEPAGE`。
- **DG-P011** G04（取本轮真正需要的状态）读取当前场景的必要信息。例如上车问候要关联乘客或占座变化，而不是拿空调温度触发。未收到、过期、格式错误或来源不可信应保留为缺少依据，不能统一改写成“没有人”。确定值与未知值要分开，具体缺项怎样终止或等待，需按场景实现核对。OnePage不支持连续趋势分析，因此不能只凭几条温度值就声称已支持「温度持续上升」。[触发器 OnePage·能力边界](https://bytedance.larkoffice.com/docx/KdBzd7uzXonxOZxXJW9cHSKonld)
  - 位置：`pages[G].sections[0].paragraphs[4]`、`pages[G].teaching.lessons[0].paragraphs[4]`；sourceIds：`RESUME-TRIGGER-ONEPAGE`。
- **DG-P012** 视觉观察的采集周期、语义条件的判断频率和场景执行间隔是三个不同参数。一次观察可以供多个场景使用，同一场景也可能收到多份观察。OnePage的默认30秒限制作用于场景执行，不是“同一人物同一动作30秒只保留一次”，也不意味着30秒拍一次画面。没有读到对应视觉去重规则时，不得自行规定描述丢弃、人物坐标阈值或采样周期。[触发器 OnePage·执行策略](https://bytedance.larkoffice.com/docx/KdBzd7uzXonxOZxXJW9cHSKonld)
  - 位置：`pages[G].sections[0].paragraphs[5]`、`pages[G].teaching.lessons[0].paragraphs[5]`；sourceIds：`RESUME-TRIGGER-ONEPAGE`。
- **DG-P013** 当前值、状态变化和视觉推理，要按各自规则判断
  - 位置：`pages[G].sections[1].title`、`pages[G].teaching.lessons[1].title`；sourceIds：`RESUME-TRIGGER-ONEPAGE`。
- **DG-P014** G05（逐步判断条件是否达成）处理的是已经定义好的判据。当前值比较可以判断车速、温度或开关是否达到目标；“有变更”判断新旧值不同；“变更为”还要求新值等于配置目标。多个条件可以组成条件组，组间支持且、或。这里组合的是同类条件表达，不等于能够把定时、结构化条件与视觉推理任意混在同一触发方式中。[触发器 OnePage·概念澄清](https://bytedance.larkoffice.com/docx/KdBzd7uzXonxOZxXJW9cHSKonld)
  - 位置：`pages[G].sections[1].paragraphs[0]`、`pages[G].teaching.lessons[1].paragraphs[0]`；sourceIds：`RESUME-TRIGGER-ONEPAGE`。
- **DG-P015** OnePage所列条件运算符包括等于、不等于、大于、小于、大于等于、小于等于以及有变更、变更为；扩展条件库是否还支持包含、持续时长或计数，应查当前配置接口，不能用另一份清单的数量盖过本版。评审「连续切歌十次」时，要明确是否有对应计数能力和事件来源，不能因为能够判断一次切歌就承诺连续行为条件也成立。[触发器 OnePage](https://bytedance.larkoffice.com/docx/KdBzd7uzXonxOZxXJW9cHSKonld)
  - 位置：`pages[G].sections[1].paragraphs[1]`、`pages[G].teaching.lessons[1].paragraphs[1]`；sourceIds：`RESUME-TRIGGER-ONEPAGE`。
- **DG-P016** G11（语义推理只判断目标是否可见）在旧图中提供视觉语义判断位置。实际OnePage描述的是通过VLM判断画面中的目标情况，例如婴儿哭闹、儿童是否在车内；不止“目标可见”这一种问题。模型观察、条件成立、最终动作依次分开。一次画面未见目标可能是遮挡、角度不足或任务失败，不能不看结果类型就变成“目标不存在”。[触发器 OnePage·推理触发](https://bytedance.larkoffice.com/docx/KdBzd7uzXonxOZxXJW9cHSKonld)
  - 位置：`pages[G].sections[1].paragraphs[2]`、`pages[G].teaching.lessons[1].paragraphs[2]`；sourceIds：`RESUME-TRIGGER-ONEPAGE`。
- **DG-P017** 混合触发是本版明确限制。FAQ写暂不支持“定时+条件”“条件+推理”“定时+推理”的混合触发。如果用户要求「晚上八点、宝宝还醒着才提醒」，先检查业务是否有独立任务编排或其他经验证路径，不能在云端触发器中直接拼一个没有实现的规则。旧稿给出打哈欠叠加车速就必然在同一条规则成立，超出了这份OnePage的边界。[触发器 OnePage·常见问题](https://bytedance.larkoffice.com/docx/KdBzd7uzXonxOZxXJW9cHSKonld)
  - 位置：`pages[G].sections[1].paragraphs[3]`、`pages[G].teaching.lessons[1].paragraphs[3]`；sourceIds：`RESUME-TRIGGER-ONEPAGE`。
- **DG-P018** 条件成立以后仍要过G06（本次允许发出去吗）。总次数、自然日次数、单次上电周期次数和最小执行间隔分别限制不同范围：同场景可在条件仍满足时多次得到候选，但没有执行资格就不应再次打扰。触发条件描述“为什么现在值得做”，执行策略描述“这次是否还允许做”，两个判断不能合成一项成功率。[触发器 OnePage·执行策略](https://bytedance.larkoffice.com/docx/KdBzd7uzXonxOZxXJW9cHSKonld)
  - 位置：`pages[G].sections[1].paragraphs[4]`、`pages[G].teaching.lessons[1].paragraphs[4]`；sourceIds：`RESUME-TRIGGER-ONEPAGE`。
- **DG-P019** 默认30秒内同一场景只执行一次，是OnePage的执行间隔口径。管理后台可以设置具体间隔，终值以发布的场景配置为准。它不是视觉事件去重窗，也没有证明所有场景只能固定30秒。若条件多次成立却没有再次发出，先看间隔和次数限制，再查漏触发，不能第一时间归因模型没识别到。[触发器 OnePage·执行策略及后台](https://bytedance.larkoffice.com/docx/KdBzd7uzXonxOZxXJW9cHSKonld)
  - 位置：`pages[G].sections[1].paragraphs[5]`、`pages[G].teaching.lessons[1].paragraphs[5]`；sourceIds：`RESUME-TRIGGER-ONEPAGE`。
- **DG-P020** 命中后按配置出口交付，回调成功与业务办成分开记录
  - 位置：`pages[G].sections[2].title`、`pages[G].teaching.lessons[2].title`；sourceIds：`RESUME-TRIGGER-ONEPAGE`。
- **DG-P021** G08（统一派发场景配置的Action）按场景已定义的动作交出去。OnePage目前列出静态Advisor、主动推荐、回调第三方等方式。Action是触发后调用的出口，并非必然是一个车辆控制指令。欢迎场景可以给建议，下车提醒可以通知任务业务，订单结算场景可以回调指定服务。谁拥有车辆动作或支付权限，需要沿对应业务继续判断。[触发器 OnePage·动作](https://bytedance.larkoffice.com/docx/KdBzd7uzXonxOZxXJW9cHSKonld)
  - 位置：`pages[G].sections[2].paragraphs[0]`、`pages[G].teaching.lessons[2].paragraphs[0]`；sourceIds：`RESUME-TRIGGER-ONEPAGE`。
- **DG-P022** 用户创建的条件任务经G07（用户任务回调任务系统）回到原安排，任务服务检查是否已经取消或到期，再让主链处理当次请求。回调里要能关联原任务和本次触发，不能因为通知到达就重建一项同名任务。用户已经取消时，迟到回调不得让它复活。任务创建、回调、执行和结果如何关联，见T章，触发器不再维护第二套任务生命周期。
  - 位置：`pages[G].sections[2].paragraphs[1]`、`pages[G].teaching.lessons[2].paragraphs[1]`；sourceIds：`RESUME-TRIGGER-ONEPAGE`。
- **DG-P023** Advisor提供建议，不等于用户已经同意动作。例如检测高温后建议通风，下一步仍受当前车况、确认方式和主动服务规则限制。触发器把机会交给Advisor，Advisor或Director组织建议及后续操作。不能写成温度一过阈值就由云端直接开空调，也不能按“高频”把回调绕开主链；出口应由场景定义而不是文字描述的频率决定。[触发器 OnePage·能力地图](https://bytedance.larkoffice.com/docx/KdBzd7uzXonxOZxXJW9cHSKonld)
  - 位置：`pages[G].sections[2].paragraphs[2]`、`pages[G].teaching.lessons[2].paragraphs[2]`；sourceIds：`RESUME-TRIGGER-ONEPAGE`。
- **DG-P024** 自定义回调将触发结果交给使用方配置的地址。这一步返回成功说明接收方接受或处理到约定阶段，是否完成真正业务还需要业务自己的回执。一次回调失败、一次业务执行失败、一次用户取消，是不同事件。重试是否允许要考虑已有副作用和接收方幂等，不能给出无原文支撑的“所有通知都排队直到成功”。[触发器 OnePage·自定义回调](https://bytedance.larkoffice.com/docx/KdBzd7uzXonxOZxXJW9cHSKonld)
  - 位置：`pages[G].sections[2].paragraphs[3]`、`pages[G].teaching.lessons[2].paragraphs[3]`；sourceIds：`RESUME-TRIGGER-ONEPAGE`。
- **DG-P025** G09（不触发也要知道原因）帮助把条件没命中、超出执行间隔、次数用尽、范围不符和调用失败区别开。后台触发记录示例包含间隔和上电周期次数超限。条件命中但被频控拦住是有规则的正常收口；通知已发出但业务没响应则属于交付问题。没有事件、没有判定或没有回执也应保留缺口，不能全部叫“未触发”。[触发器 OnePage·触发记录](https://bytedance.larkoffice.com/docx/KdBzd7uzXonxOZxXJW9cHSKonld)
  - 位置：`pages[G].sections[2].paragraphs[4]`、`pages[G].teaching.lessons[2].paragraphs[4]`；sourceIds：`RESUME-TRIGGER-ONEPAGE`。
- **DG-P026** 排查从同一场景、同一车辆和一次触发开始：先查它当时是否生效，再看来源有没有到达、条件怎样判、次数和间隔是否允许、出口调用得到什么结果。把每段证据放在一起，才知道问题归信号、规则、模型、通知通道还是实际业务。记录目的为复原决策过程，不是列一个“触发成功”掩盖后续失败。
  - 位置：`pages[G].sections[2].paragraphs[5]`、`pages[G].teaching.lessons[2].paragraphs[5]`；sourceIds：`RESUME-TRIGGER-ONEPAGE`。
- **DG-P027** 定时只提供到点信号，未来安排的执行仍沿原业务继续
  - 位置：`pages[G].sections[3].title`、`pages[G].teaching.lessons[3].title`；sourceIds：`RESUME-TRIGGER-ONEPAGE`。
- **DG-P028** G10（时间触发：到时回调，不直接控车）对应明确时刻或周期的计划。单次时间只产生那一次到点，Cron描述重复计划。例如用户安排十分钟后关加热，业务先保存“未来关”的意图并登记时间，到点回调原任务，主链再结合当前状态执行。触发器不需要保持一轮对话推理等十分钟，也不能在任务创建时就把加热关掉。[触发器 OnePage·时间触发](https://bytedance.larkoffice.com/docx/KdBzd7uzXonxOZxXJW9cHSKonld)
  - 位置：`pages[G].sections[3].paragraphs[0]`、`pages[G].teaching.lessons[3].paragraphs[0]`；sourceIds：`RESUME-TRIGGER-ONEPAGE`。
- **DG-P029** 定时提醒与定时操作虽然用户可见结果不同，都要注册明确时间和出口。提醒可能由原业务组织声音，关加热需要车辆控制接口。不能另创一条“定时做事一定直接车控、定时叫人一定Planner”的通用规则，更不能在同段同时说到点直接控制、又说只回调。具体执行按该任务及场景的合同走，T章保留完整任务与结果闭环。
  - 位置：`pages[G].sections[3].paragraphs[1]`、`pages[G].teaching.lessons[3].paragraphs[1]`；sourceIds：`RESUME-TRIGGER-ONEPAGE`。
- **DG-P030** 延时、定时与执行间隔不能混淆。延时五分钟描述从指定起点等多久；固定计划描述何时重复；最小执行间隔限制已经触发的场景多久可以再执行。默认30秒不是任务有效期，也不表示每30秒自动提醒。时刻发生时，如果任务已取消、条件失效或项目不支持，也不能凭到点信号宣布动作完成。[触发器 OnePage·即时延时定时及执行策略](https://bytedance.larkoffice.com/docx/KdBzd7uzXonxOZxXJW9cHSKonld)
  - 位置：`pages[G].sections[3].paragraphs[2]`、`pages[G].teaching.lessons[3].paragraphs[2]`；sourceIds：`RESUME-TRIGGER-ONEPAGE`。
- **DG-P031** 一个任意未来日期或复杂组合是否可注册，必须核当前时间计划接口与任务能力。OnePage确认单次与Cron周期，但没有给出所有时间上限。旧稿把24小时、7天等数字写成全场景注册规则，来源不足时不继续沿用。如果相关任务文档有范围限制，应用在对应任务和版本，不把一个方案的限制扩成云端触发器永久统一规范。[触发器 OnePage](https://bytedance.larkoffice.com/docx/KdBzd7uzXonxOZxXJW9cHSKonld)
  - 位置：`pages[G].sections[3].paragraphs[3]`、`pages[G].teaching.lessons[3].paragraphs[3]`；sourceIds：`RESUME-TRIGGER-ONEPAGE`。
- **DG-P032** 车辆离线或下电时，到点消息怎么处理需要任务自己的结束及恢复策略。一次当趟安排、跨天重复任务与本地已有预设不能统一全部删除或全部补做。网络恢复后的消息可能已过时，后台应按原任务状态和执行条件判断，避免用户离车后补执行一个不再需要的动作。这里不承诺OnePage未定义的离线续传或自动回滚。
  - 位置：`pages[G].sections[3].paragraphs[4]`、`pages[G].teaching.lessons[3].paragraphs[4]`；sourceIds：`RESUME-TRIGGER-ONEPAGE`。
- **DG-P033** 文档把耗时分成触发匹配与下游触达两个阶段，推理场景再观察模型首输出和总体耗时。若用户反馈迟迟没提醒，先定位时间是否准确、回调是否送达、业务是否开始、最后声音是否真正播放。来源中的触达率公式写法需与统计实现核对，本章不复制有疑义的公式，也不把回调成功率当作用户真实听到提醒的比例。[触发器 OnePage·指标一览](https://bytedance.larkoffice.com/docx/KdBzd7uzXonxOZxXJW9cHSKonld)
  - 位置：`pages[G].sections[3].paragraphs[5]`、`pages[G].teaching.lessons[3].paragraphs[5]`；sourceIds：`RESUME-TRIGGER-ONEPAGE`。
- **DG-P034** 用户说「我下车时提醒我拿手机」，现在没有让系统立刻提醒。他交出了一个以后发生的条件。对话结束后，仍需有人等待相应变化；条件出现时，还要能找回原来的安排。云端触发器承担的是发现时机、检查规则并通知配置出口的部分，提醒如何表达、任务是否已取消及后续怎样执行，由关联业务继续处理。
  - 位置：`pages[G].teaching.intro[0]`；sourceIds：`RESUME-TRIGGER-ONEPAGE`。
- **DG-P035** 先区别用户交办任务与产品预设场景。前者先由对话与任务服务建立安排，再注册触发；后者可以由产品直接配置「主驾上车打招呼」等固定规则。两者都需要条件、动作、执行策略和生效范围，但命中后的去向不必一样。触发器OnePage列出静态Advisor、主动推荐与第三方回调等动作，不能把每次条件命中都说成一次车控或一条用户已授权任务。[触发器 OnePage](https://bytedance.larkoffice.com/docx/KdBzd7uzXonxOZxXJW9cHSKonld)
  - 位置：`pages[G].teaching.intro[1]`；sourceIds：`RESUME-TRIGGER-ONEPAGE`。
- **DG-P036** 本章按一条场景从配置到命中讲：先确定适用车辆和信号，再判断条件，经过次数与间隔限制后，把本次触发交给配置的出口。端侧本地感知和云端服务有不同实现，相关端侧资源调度见L章，不能按信号频率直接断定谁执行。旧图保留了端状态、视觉语义、时间与业务回调的关系，读正文时以原文明确的版本及边界核对，不把图上相邻的框当成已支持的混合触发。[触发器 OnePage](https://bytedance.larkoffice.com/docx/KdBzd7uzXonxOZxXJW9cHSKonld)
  - 位置：`pages[G].teaching.intro[2]`；sourceIds：`RESUME-TRIGGER-ONEPAGE`。
- **DG-P037** 从场景范围、触发判据到配置出口，沿图核对每次交接
  - 位置：`pages[G].teaching.guides.base.title`；sourceIds：`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A28`、`ASY-A36`、`ASY-A38`、`ASY-A47`、`ASY-A40`、`VOICE-V15-LECTURE`、`CTA-TRIGGER`。
- **DG-P038** 先在G01（接收场景与业务关系）找这条规则对应的业务，再在G02（这辆车能用这个场景吗）看车辆和版本范围。G03（哪个信号叫醒这次检查）与G10（时间触发）表示不同来源，不表示同一项任务必然同时走两条通道。
  - 位置：`pages[G].teaching.guides.base.paragraphs[0]`；sourceIds：`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A28`、`ASY-A36`、`ASY-A38`、`ASY-A47`、`ASY-A40`、`VOICE-V15-LECTURE`、`CTA-TRIGGER`。
- **DG-P039** 信号到达后，G04（取本轮真正需要的状态）组织必要信息，G05（逐步判断条件是否达成）判断当前值或状态变化。当前车速为0和刚刚变为0不同，应按本章条件解释选判据，不能从图上相邻节点推断已经支持连续趋势。
  - 位置：`pages[G].teaching.guides.base.paragraphs[1]`；sourceIds：`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A28`、`ASY-A36`、`ASY-A38`、`ASY-A47`、`ASY-A40`、`VOICE-V15-LECTURE`、`CTA-TRIGGER`。
- **DG-P040** G11（语义推理只判断目标是否可见）是旧图的视觉判断位置；本版OnePage用推理触发描述目标情况的语义判断。视觉任务与数值条件怎样组合，需遵守本版暂不支持混合触发的边界。图中有连接，不等于任意条件组合已实现。[触发器 OnePage](https://bytedance.larkoffice.com/docx/KdBzd7uzXonxOZxXJW9cHSKonld)
  - 位置：`pages[G].teaching.guides.base.paragraphs[2]`；sourceIds：`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A28`、`ASY-A36`、`ASY-A38`、`ASY-A47`、`ASY-A40`、`VOICE-V15-LECTURE`、`CTA-TRIGGER`。
- **DG-P041** 条件命中以后过G06（本次允许发出去吗），检查间隔和次数。默认30秒是同一场景执行间隔，与观察周期、数据上传和视觉去重不是同一个参数。G09（不触发也要知道原因）保留频控或失败依据，不能把正常限制当成识别遗漏。[触发器 OnePage](https://bytedance.larkoffice.com/docx/KdBzd7uzXonxOZxXJW9cHSKonld)
  - 位置：`pages[G].teaching.guides.base.paragraphs[3]`；sourceIds：`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A28`、`ASY-A36`、`ASY-A38`、`ASY-A47`、`ASY-A40`、`VOICE-V15-LECTURE`、`CTA-TRIGGER`。
- **DG-P042** G08（统一派发场景配置的Action）与G07（用户任务回调任务系统）按业务配置交出去。用户任务回原安排，主动建议交对应建议链路，第三方回调按其接口契约处理；不是按“高频留端、低频上云”的文字标签自行改路。
  - 位置：`pages[G].teaching.guides.base.paragraphs[4]`；sourceIds：`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A28`、`ASY-A36`、`ASY-A38`、`ASY-A47`、`ASY-A40`、`VOICE-V15-LECTURE`、`CTA-TRIGGER`。
- **DG-P043** G12（把有意义的状态变化写业务事件）帮助留存可消费事实，上报来源和后续使用要区别开。收到视觉描述不等于模型用了它；一份回调记录也不等于用户已听到提醒。端侧具体感知与资源生命周期见L章，业务事件与日志见EV、EL章。
  - 位置：`pages[G].teaching.guides.base.paragraphs[5]`；sourceIds：`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A28`、`ASY-A36`、`ASY-A38`、`ASY-A47`、`ASY-A40`、`VOICE-V15-LECTURE`、`CTA-TRIGGER`。
- **DG-P044** 复核一项场景先看适用范围、输入来源和发生时间，然后检查判据、执行限制、出口回执及用户可见结果。需要哪段证据就沿相应节点查，不给未知内容补一个默认值，也不复制其他车型的成功状态。
  - 位置：`pages[G].teaching.guides.base.paragraphs[6]`；sourceIds：`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A28`、`ASY-A36`、`ASY-A38`、`ASY-A47`、`ASY-A40`、`VOICE-V15-LECTURE`、`CTA-TRIGGER`。
- **DG-P045** 这一章把一条已定义场景怎样发现时机、判断条件和调用出口讲清；用户未来任务仍由任务服务保存并追踪结果。
  - 位置：`pages[G].teaching.closing[0]`；sourceIds：`RESUME-TRIGGER-ONEPAGE`。
- **DG-P046** 评审要分清状态与变化、执行间隔与观察周期、通知送达与实际业务完成。混合触发和连续趋势按本版能力边界处理。
  - 位置：`pages[G].teaching.closing[1]`；sourceIds：`RESUME-TRIGGER-ONEPAGE`。
- **DG-P047** 讲清来源到达、条件成立、频控放行与下游动作为什么要分别判断。
  - 位置：`pages[G].feynman.goal`；sourceIds：`ASY-A05`、`ASY-A06`、`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A40`、`ASY-A47`、`CTA-TRIGGER`、`VOICE-V15-LECTURE`、`RESUME-TRIGGER-ONEPAGE`。
- **DG-P048** 某场景配置为特定状态变化时给业务发一次提醒机会。
  - 位置：`pages[G].feynman.scenario`；sourceIds：`ASY-A05`、`ASY-A06`、`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A40`、`ASY-A47`、`CTA-TRIGGER`、`VOICE-V15-LECTURE`、`RESUME-TRIGGER-ONEPAGE`。
- **DG-P049** 按已读触发器OnePage理解，不假定定时、条件和视觉推理可以任意混合。
  - 位置：`pages[G].feynman.scope`；sourceIds：`ASY-A05`、`ASY-A06`、`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A40`、`ASY-A47`、`CTA-TRIGGER`、`VOICE-V15-LECTURE`、`RESUME-TRIGGER-ONEPAGE`。
- **DG-P050** 先有一条生效规则，信号才知道叫醒谁
  - 位置：`pages[G].feynman.sections[0].title`；sourceIds：`ASY-A05`、`ASY-A06`、`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A40`、`ASY-A47`、`CTA-TRIGGER`、`VOICE-V15-LECTURE`、`RESUME-TRIGGER-ONEPAGE`。
- **DG-P051** 产品或任务业务先定义适用车辆、触发来源、条件和出口。收到一个车门变化，不代表全车所有服务都执行；只有当前范围生效且相关的规则需要被检查。后台保存只是配置产生，还要核目标车辆与版本实际使用它。
  - 位置：`pages[G].feynman.sections[0].p[0]`；sourceIds：`ASY-A05`、`ASY-A06`、`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A40`、`ASY-A47`、`CTA-TRIGGER`、`VOICE-V15-LECTURE`、`RESUME-TRIGGER-ONEPAGE`。
- **DG-P052** 条件描述什么时候值得做，出口描述交给谁继续办理。这两部分不能用一个‘提醒’名字代替。不同场景可交Advisor、任务业务或第三方回调，不全都是车控。
  - 位置：`pages[G].feynman.sections[0].p[1]`；sourceIds：`ASY-A05`、`ASY-A06`、`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A40`、`ASY-A47`、`CTA-TRIGGER`、`VOICE-V15-LECTURE`、`RESUME-TRIGGER-ONEPAGE`。
- **DG-P053** 状态相等与刚刚变成这个状态，触发次数可能不同
  - 位置：`pages[G].feynman.sections[1].title`；sourceIds：`ASY-A05`、`ASY-A06`、`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A40`、`ASY-A47`、`CTA-TRIGGER`、`VOICE-V15-LECTURE`、`RESUME-TRIGGER-ONEPAGE`。
- **DG-P054** 车速等于零，回答现在是否停着；车速变更为零，还要求旧值不同、新值变成零。车一直停着反复上报零，不是反复停车。选错运算符，用户就可能收到重复服务，或者真正变化时没触发。
  - 位置：`pages[G].feynman.sections[1].p[0]`；sourceIds：`ASY-A05`、`ASY-A06`、`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A40`、`ASY-A47`、`CTA-TRIGGER`、`VOICE-V15-LECTURE`、`RESUME-TRIGGER-ONEPAGE`。
- **DG-P055** 多个条件的且、或描述逻辑组合，不自动表达先发生A再发生B。OnePage对混合触发和连续趋势有明确边界，不能看见能配一个条件，就推定所有时间序列都能配置。
  - 位置：`pages[G].feynman.sections[1].p[1]`；sourceIds：`ASY-A05`、`ASY-A06`、`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A40`、`ASY-A47`、`CTA-TRIGGER`、`VOICE-V15-LECTURE`、`RESUME-TRIGGER-ONEPAGE`。
- **DG-P056** 条件成立之后，还要检查这次是否允许发出
  - 位置：`pages[G].feynman.sections[2].title`；sourceIds：`ASY-A05`、`ASY-A06`、`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A40`、`ASY-A47`、`CTA-TRIGGER`、`VOICE-V15-LECTURE`、`RESUME-TRIGGER-ONEPAGE`。
- **DG-P057** 规则可能连续收到满足条件的观察，但同一场景不应每次都重复打扰。执行次数、上电周期次数、日次数与最小间隔分别限制不同范围。默认30秒是OnePage场景执行间隔，不是视觉每30秒拍一次或删除重复画面的规则。
  - 位置：`pages[G].feynman.sections[2].p[0]`；sourceIds：`ASY-A05`、`ASY-A06`、`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A40`、`ASY-A47`、`CTA-TRIGGER`、`VOICE-V15-LECTURE`、`RESUME-TRIGGER-ONEPAGE`。
- **DG-P058** 条件正确却被频控拦住，是一种有原因的不执行；不是每次都算漏触发。排查先看判定结果，再看次数与间隔。
  - 位置：`pages[G].feynman.sections[2].p[1]`；sourceIds：`ASY-A05`、`ASY-A06`、`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A40`、`ASY-A47`、`CTA-TRIGGER`、`VOICE-V15-LECTURE`、`RESUME-TRIGGER-ONEPAGE`。
- **DG-P059** 通知下游以后，业务还没因此完成
  - 位置：`pages[G].feynman.sections[3].title`；sourceIds：`ASY-A05`、`ASY-A06`、`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A40`、`ASY-A47`、`CTA-TRIGGER`、`VOICE-V15-LECTURE`、`RESUME-TRIGGER-ONEPAGE`。
- **DG-P060** 触发器将命中和关联交给配置出口。用户任务要找回原安排并核是否取消，Advisor要判断怎样服务，第三方要执行其业务。回调接受成功不是用户已经听见提醒，也不是车辆已经完成动作。
  - 位置：`pages[G].feynman.sections[3].p[0]`；sourceIds：`ASY-A05`、`ASY-A06`、`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A40`、`ASY-A47`、`CTA-TRIGGER`、`VOICE-V15-LECTURE`、`RESUME-TRIGGER-ONEPAGE`。
- **DG-P061** 所以从一个场景查问题，要依次找生效范围、来源、判定、执行限制和出口回执，再追下游结果。哪一环没有证据就留缺口，不用一个绿色‘触发成功’盖住全部。
  - 位置：`pages[G].feynman.sections[3].p[1]`；sourceIds：`ASY-A05`、`ASY-A06`、`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A40`、`ASY-A47`、`CTA-TRIGGER`、`VOICE-V15-LECTURE`、`RESUME-TRIGGER-ONEPAGE`。
- **DG-P062** 为什么条件明明成立，场景仍可能没有提醒？
  - 位置：`pages[G].feynman.retell.q`；sourceIds：`ASY-A05`、`ASY-A06`、`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A40`、`ASY-A47`、`CTA-TRIGGER`、`VOICE-V15-LECTURE`、`RESUME-TRIGGER-ONEPAGE`。
- **DG-P063** 它还要在正确车辆范围生效、获得次数和间隔资格，并成功交给下游。下游又有任务有效性、服务策略和展示执行，条件成立只是其中一步。
  - 位置：`pages[G].feynman.retell.a`；sourceIds：`ASY-A05`、`ASY-A06`、`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A40`、`ASY-A47`、`CTA-TRIGGER`、`VOICE-V15-LECTURE`、`RESUME-TRIGGER-ONEPAGE`。
- **DG-P064** 30秒内不再提醒，能否说视觉30秒没看？
  - 位置：`pages[G].feynman.transfer[0].q`；sourceIds：`ASY-A05`、`ASY-A06`、`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A40`、`ASY-A47`、`CTA-TRIGGER`、`VOICE-V15-LECTURE`、`RESUME-TRIGGER-ONEPAGE`。
- **DG-P065** 不能。执行间隔和观察频率是不同参数。
  - 位置：`pages[G].feynman.transfer[0].a`；sourceIds：`ASY-A05`、`ASY-A06`、`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A40`、`ASY-A47`、`CTA-TRIGGER`、`VOICE-V15-LECTURE`、`RESUME-TRIGGER-ONEPAGE`。
- **DG-P066** 车一直P挡反复上报，是否等于多次变更为P挡？
  - 位置：`pages[G].feynman.transfer[1].q`；sourceIds：`ASY-A05`、`ASY-A06`、`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A40`、`ASY-A47`、`CTA-TRIGGER`、`VOICE-V15-LECTURE`、`RESUME-TRIGGER-ONEPAGE`。
- **DG-P067** 不是，状态判断与变化事件不同。
  - 位置：`pages[G].feynman.transfer[1].a`；sourceIds：`ASY-A05`、`ASY-A06`、`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A40`、`ASY-A47`、`CTA-TRIGGER`、`VOICE-V15-LECTURE`、`RESUME-TRIGGER-ONEPAGE`。
- **DG-P068** 一条场景在后台配好了，谁来发现它该在什么时候发生？用户说「我下车时提醒我拿手机」，这句话不是现在执行，而是要有人在之后等条件出现。这一章讲触发器怎么发现时机、判断条件、按配置交出去。
  - 位置：`pages[G].mainline[0]`；sourceIds：`ASY-A05`、`ASY-A06`、`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A40`、`ASY-A47`、`CTA-TRIGGER`、`VOICE-V15-LECTURE`、`RESUME-TRIGGER-ONEPAGE`。
- **DG-P069** 先分清两件事：用户交办的任务，由对话和任务系统先建立安排再注册触发；产品预设的场景，比如「主驾上车打招呼」，可以直接配置固定规则。两者都需要条件、动作、执行策略和生效范围，但命中后的去向不一定相同。
  - 位置：`pages[G].mainline[1]`；sourceIds：`ASY-A05`、`ASY-A06`、`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A40`、`ASY-A47`、`CTA-TRIGGER`、`VOICE-V15-LECTURE`、`RESUME-TRIGGER-ONEPAGE`。
- **DG-P070** 范围先圈死：渠道、车型、车辆 ID、客户端版本。后台保存成功只说明配置完成，不代表每台目标车已经收到或能执行；测试要选目标车型、环境和版本，不能拿别的车的成功记录证明本车支持。
  - 位置：`pages[G].mainline[2]`；sourceIds：`ASY-A05`、`ASY-A06`、`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A40`、`ASY-A47`、`CTA-TRIGGER`、`VOICE-V15-LECTURE`、`RESUME-TRIGGER-ONEPAGE`。
- **DG-P071** 信号要选准是在看「状态」还是「变化」。「车速为 0」是当前快照，「车速变更为 0」是从别的值切到 0 的那一次；车一直停着反复上报 0，不应该被解释成又停了一次。这两种条件的触发次数和去重依据不同。
  - 位置：`pages[G].mainline[3]`；sourceIds：`ASY-A05`、`ASY-A06`、`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A40`、`ASY-A47`、`CTA-TRIGGER`、`VOICE-V15-LECTURE`、`RESUME-TRIGGER-ONEPAGE`。
- **DG-P072** 条件判断按类型走：当前值比较、有变更、变更为、以及视觉语义判断。条件组之间可以且、或，但这组合的是同类表达；定时加条件、条件加推理、定时加推理这三类混合触发，本版明确暂不支持——用户要求「晚上八点、宝宝还醒着才提醒」，要先看有没有别的任务编排路径，不能在触发器里拼一个没有实现的规则。
  - 位置：`pages[G].mainline[4]`；sourceIds：`ASY-A05`、`ASY-A06`、`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A40`、`ASY-A47`、`CTA-TRIGGER`、`VOICE-V15-LECTURE`、`RESUME-TRIGGER-ONEPAGE`。
- **DG-P073** 条件成立以后还要过频控：总次数、自然日次数、单次上电周期次数、最小执行间隔，各自限制不同范围。默认 30 秒是同一场景两次执行之间的最小间隔，不是「同一人物同一动作 30 秒只保留一次」，也不是 30 秒拍一次画面；具体值以发布配置为准。条件多次成立却没有再发，先看间隔和次数，再查漏触发。
  - 位置：`pages[G].mainline[5]`；sourceIds：`ASY-A05`、`ASY-A06`、`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A40`、`ASY-A47`、`CTA-TRIGGER`、`VOICE-V15-LECTURE`、`RESUME-TRIGGER-ONEPAGE`。
- **DG-P074** 出口按场景配置：静态顾问、主动推荐、回调第三方、通知任务业务。触发器只通知「条件命中了」，不直接控车；自定义回调返回成功，只说明接收方受理到约定阶段，业务有没有办成要另看回执。没触发也要留原因：条件没命中、超出间隔、次数用尽、范围不符、调用失败，各自记清，不能都叫「未触发」。这一章交出去的是「什么时候、因为什么条件、通知了谁」。
  - 位置：`pages[G].mainline[6]`；sourceIds：`ASY-A05`、`ASY-A06`、`ASY-A11`、`ASY-A14`、`ASY-A15`、`ASY-A17`、`ASY-A19`、`ASY-A40`、`ASY-A47`、`CTA-TRIGGER`、`VOICE-V15-LECTURE`、`RESUME-TRIGGER-ONEPAGE`。

## 原图节点逐项

### G01 接收场景与业务关系

- **DG-G01-L1** 保存上游业务与下游回调；位置：`base.modules[G].nodes[G01].lines[0]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G01-L2** 条件监听哪些信号；位置：`base.modules[G].nodes[G01].lines[1]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G01-L3** 用户任务带任务编号注册；位置：`base.modules[G].nodes[G01].lines[2]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G01-L4** 预设与 Advisor（顾问） 场景同样校验归属；位置：`base.modules[G].nodes[G01].lines[3]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G01-D1** 云端触发器接到规则时，先保存要等什么条件、对哪些车辆生效，以及命中后通知谁。用户创建的宝宝提醒需要回原任务，预设舒适场景可能去 Advisor（主动服务顾问），静默内容则交相应显示业务，接收方不能混用。；位置：`base.modules[G].nodes[G01].detail` 第 1 段；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G01-D2** 绑定关系决定了后续怎样继续。相同一句“条件已成立”，若没有任务或场景身份，就无法判断是谁的安排、该不该执行。登记成功后仍需等待范围与开关检查，再监听相关变化；它此刻尚未触发，也没有替用户完成任何车辆动作。；位置：`base.modules[G].nodes[G01].detail` 第 2 段；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G01-D3** 触发器本轮只使用已接入的当前状态与观察核对登记条件；用户偏好、历史记忆和最终话术，在建议进入 Director（对话推理引擎） 那一轮再由其结合上下文与记忆判断。 用户感知：条件未到时通常无感；放行后由原业务决定是否提醒或建议。系统决定：登记关系、范围校验、条件匹配与频控。明确不做什么：命中不等于已控车，也不等于用户已确认。；位置：`base.modules[G].nodes[G01].detail` 第 3 段；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G01-P1** 触发器收到一条场景配置时，先保存业务关系：场景属于哪个上游业务方，条件监听哪些信号，达成后回调哪个下游。；位置：`base.modules[G].nodes[G01].paragraphs[0]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G01-P2** 用户口述任务由任务系统带着任务编号注册；预设场景、运营配置和动态 Advisor 注册时同样必须携带原业务标识。；位置：`base.modules[G].nodes[G01].paragraphs[1]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G01-P3** 一句话解释条件触发器：采集信号—判断条件—驱动执行。本章判断「该不该继续处理」，不替 Director 规划话术。；位置：`base.modules[G].nodes[G01].paragraphs[2]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
### G02 这辆车能用这个场景吗

- **DG-G02-L1** 校验渠道、车型、软件版本；位置：`base.modules[G].nodes[G02].lines[0]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G02-L2** 用户关闭的单车场景不运行；位置：`base.modules[G].nodes[G02].lines[1]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G02-L3** 未登录且需登录则前置拒绝；位置：`base.modules[G].nodes[G02].lines[2]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G02-L4** 主动服务总开关可拒绝推荐类；位置：`base.modules[G].nodes[G02].lines[3]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G02-D1** 规则运行前，系统检查渠道、车型、车辆 ID、客户端版本以及场景开关。一条规则在平台开启，并不表示所有车辆都进入生效范围；本车用户停用场景后，也不会继续按该场景服务。；位置：`base.modules[G].nodes[G02].detail` 第 1 段；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G02-D2** 进入范围的车辆还需要具备规则依赖的信号和能力。视觉没有接入的车型，不能仅靠复制场景配置完成同一判断。范围、开关和能力满足后，规则才进入本车的后续检查。 用户感知：条件未到时通常无感；放行后由原业务决定是否提醒或建议。系统决定：登记关系、范围校验、条件匹配与频控。明确不做什么：命中不等于已控车，也不等于用户已确认。；位置：`base.modules[G].nodes[G02].detail` 第 2 段；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G02-P1** 先核当前场景的渠道、车型、车辆与版本范围。OnePage长期规划列出登录与主动服务开关的前置过滤，部分为TODO；实际执行是否已前置，需要按版本核对，不能把规划直接当现状。[触发器 OnePage](https://bytedance.larkoffice.com/docx/KdBzd7uzXonxOZxXJW9cHSKonld)；位置：`base.modules[G].nodes[G02].paragraphs[0]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
### G03 哪个信号叫醒这次检查

- **DG-G03-L1** 动态条件订阅信号变化；位置：`base.modules[G].nodes[G03].lines[0]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G03-L2** 静态条件唤醒后读当前值；位置：`base.modules[G].nodes[G03].lines[1]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G03-L3** 视觉条件听 VLM 描述更新；位置：`base.modules[G].nodes[G03].lines[2]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G03-L4** 订阅漏配则场景永不被叫醒；位置：`base.modules[G].nodes[G03].lines[3]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G03-D1** 触发器订阅与场景有关的信号，变化到来时启动一次条件检查。“挡位等于 D”比较当前值；“挡位变更为 D”同时要求新旧值不同且新值为 D。重复上报同一个 D 挡值，不算再次切挡。；位置：`base.modules[G].nodes[G03].detail` 第 1 段；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G03-D2** 如果服务需要在“挂 D 挡且后排有儿童”时检查儿童锁，先坐入儿童再挂挡、先挂挡再坐入儿童都可能形成时机。对应的挡位变化和乘员观察更新都要能够唤起检查，规则再读取另一项当前状态，合并判断整组条件。 用户感知：条件未到时通常无感；放行后由原业务决定是否提醒或建议。系统决定：登记关系、范围校验、条件匹配与频控。明确不做什么：命中不等于已控车，也不等于用户已确认。；位置：`base.modules[G].nodes[G03].detail` 第 2 段；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G03-P1** 每条场景登记唤醒信号。动态条件订阅字段穿越事件；静态条件在唤醒后读取当前值；视觉条件监听指定 VLM 描述字段更新。；位置：`base.modules[G].nodes[G03].paragraphs[0]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G03-P2** 唤醒信号注册错误、订阅字段漏配，表现为场景一直不被叫醒——先查规则设计，再查信号源。；位置：`base.modules[G].nodes[G03].paragraphs[1]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G03-P3** 结构化条件运算符是固定集合；信号广义上既包括车身 key-value，也包括可被模型理解的自然语言描述。；位置：`base.modules[G].nodes[G03].paragraphs[2]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
### G04 取本轮真正需要的状态

- **DG-G04-L1** 只取条件声明的字段；位置：`base.modules[G].nodes[G04].lines[0]`；sourceIds：VOICE-V15-LECTURE。
- **DG-G04-L2** 车况/导航/媒体/座舱/车机分域；位置：`base.modules[G].nodes[G04].lines[1]`；sourceIds：VOICE-V15-LECTURE。
- **DG-G04-L3** 区分没查到、失败、过期、未发生；位置：`base.modules[G].nodes[G04].lines[2]`；sourceIds：VOICE-V15-LECTURE。
- **DG-G04-L4** 主键与单位必须对齐；位置：`base.modules[G].nodes[G04].lines[3]`；sourceIds：VOICE-V15-LECTURE。
- **DG-G04-D1** 被唤醒后，触发器按场景需要取当前车况、导航、媒体、座舱或车机状态。儿童锁要读取对应后排位置，温度比较要使用正确单位；同名字段或默认值一旦取错，后面的规则即使运行正确也会判断错对象。；位置：`base.modules[G].nodes[G04].detail` 第 1 段；sourceIds：VOICE-V15-LECTURE。
- **DG-G04-D2** 信号可能来自订阅、状态查询或 Context（上下文），不应假定它们共享同一份同步缓存。保留采样时间、缺失和失败原因，关键状态过旧时先按有效性规则处理。不能把还没拿到锁状态填成关闭，再据此向用户发出不必要的建议。 用户感知：条件未到时通常无感；放行后由原业务决定是否提醒或建议。系统决定：登记关系、范围校验、条件匹配与频控。明确不做什么：命中不等于已控车，也不等于用户已确认。；位置：`base.modules[G].nodes[G04].detail` 第 2 段；sourceIds：VOICE-V15-LECTURE。
- **DG-G04-P1** 叫醒之后只取这条场景条件里声明的字段，不做全量状态扫描。状态分车况、导航、媒体、座舱、车机五域。；位置：`base.modules[G].nodes[G04].paragraphs[0]`；sourceIds：VOICE-V15-LECTURE。
- **DG-G04-P2** 取不到时分成四种情况记录：没查到、查询失败、数据过期、条件还没发生。把“没查到”误当成“不满足”会让规则静默失效。；位置：`base.modules[G].nodes[G04].paragraphs[1]`；sourceIds：VOICE-V15-LECTURE。
- **DG-G04-P3** 乘员位置是主键，枚举值与单位要和信号字典对齐。；位置：`base.modules[G].nodes[G04].paragraphs[2]`；sourceIds：VOICE-V15-LECTURE。
### G05 逐步判断条件是否达成

- **DG-G05-L1** 按配置逐步求值并合并分支；位置：`base.modules[G].nodes[G05].lines[0]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G05-L2** 字段条件与视觉语义分开给结果；位置：`base.modules[G].nodes[G05].lines[1]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G05-L3** 抖动过滤避免反复命中；位置：`base.modules[G].nodes[G05].lines[2]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G05-L4** 同次扫描多命中按优先级处理；位置：`base.modules[G].nodes[G05].lines[3]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G05-D1** 结构化信号按约定运算符比较，多个条件用且或关系组合。例如后排有儿童或宠物，再检查对应位置的儿童锁。自然语言视觉目标则进入语义判断，使用已有观察文字与目标比较，不在条件节点额外取图或控制车辆。；位置：`base.modules[G].nodes[G05].detail` 第 1 段；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G05-D2** 字段不满足时继续等待相关变化；缺少必要状态、查询失败或模型超时时，记录具体取证或执行失败。语义模型另外有“达成、未达成、无法判断”三种业务结果，含义由 G11 的视觉目标规则定义，不能把所有规则异常都合成同一种语义结果。 用户感知：条件未到时通常无感；放行后由原业务决定是否提醒或建议。系统决定：登记关系、范围校验、条件匹配与频控。明确不做什么：命中不等于已控车，也不等于用户已确认。；位置：`base.modules[G].nodes[G05].detail` 第 2 段；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G05-P1** 按定义判断当前值或状态变化；条件组内及组间组合遵守配置接口。OnePage明确暂不支持定时+条件、条件+推理、定时+推理混合触发，也不支持连续趋势分析，不因为图上有连接就推定任意组合可执行。[触发器 OnePage](https://bytedance.larkoffice.com/docx/KdBzd7uzXonxOZxXJW9cHSKonld)；位置：`base.modules[G].nodes[G05].paragraphs[0]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
### G06 本次允许发出去吗

- **DG-G06-L1** 条件成立后还要过频次限制；位置：`base.modules[G].nodes[G06].lines[0]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G06-L2** 冷却与每日上限按场景配置；位置：`base.modules[G].nodes[G06].lines[1]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G06-L3** 不允许则留下停止原因；位置：`base.modules[G].nodes[G06].lines[2]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G06-L4** 放行不等于已经控车；位置：`base.modules[G].nodes[G06].lines[3]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G06-D1** 宝宝持续哭闹时，多份观察都可能满足目标。条件通过后，执行策略继续检查总次数、单日次数、单次上电次数和触发间隔，控制这一次是否派发，避免持续状态造成重复打扰。；位置：`base.modules[G].nodes[G06].detail` 第 1 段；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G06-D2** 策略允许就交给对应出口；达到次数或间隔限制则记录拦截原因，保留“条件已经成立”的事实。实际间隔取自场景配置，显示去重时间和任务过期时间分别管理，不改变这条规则的频控设置。 用户感知：条件未到时通常无感；放行后由原业务决定是否提醒或建议。系统决定：登记关系、范围校验、条件匹配与频控。明确不做什么：命中不等于已控车，也不等于用户已确认。；位置：`base.modules[G].nodes[G06].detail` 第 2 段；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G06-P1** 条件命中后再查总次数、单日次数、上电周期次数和执行间隔。OnePage默认30秒内同场景仅执行一次，实际按发布配置，不是视觉去重或观察周期。[触发器 OnePage](https://bytedance.larkoffice.com/docx/KdBzd7uzXonxOZxXJW9cHSKonld)；位置：`base.modules[G].nodes[G06].paragraphs[0]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
### G07 用户任务回调任务系统

- **DG-G07-L1** 用户任务命中通知回原任务系统；位置：`base.modules[G].nodes[G07].lines[0]`；sourceIds：VOICE-V15-LECTURE。
- **DG-G07-L2** 携带原任务编号与命中证据；位置：`base.modules[G].nodes[G07].lines[1]`；sourceIds：VOICE-V15-LECTURE。
- **DG-G07-L3** 由任务系统决定下一步；位置：`base.modules[G].nodes[G07].lines[2]`；sourceIds：VOICE-V15-LECTURE。
- **DG-G07-L4** 触发器不直接改任务内容；位置：`base.modules[G].nodes[G07].lines[3]`；sourceIds：VOICE-V15-LECTURE。
- **DG-G07-D1** 用户任务目标达成且允许派发后，触发器回调原任务服务，说明哪条任务等到了什么条件。例如二排右侧宝宝哭闹命中，回调仍携带原任务关联，任务服务才能找到用户当时的安排。；位置：`base.modules[G].nodes[G07].detail` 第 1 段；sourceIds：VOICE-V15-LECTURE。
- **DG-G07-D2** 任务服务检查该任务是否仍有效，再生成本轮建议，经车端回流和输入管理交给 Planner（规划器，与 Director（对话推理引擎） 同职能）。Planner（规划器，与 Director（对话推理引擎） 同职能） 决定话术及工具，后续输出才让用户听见提醒。触发回调因此推进任务，不直接把整条服务记为完成。 用户感知：条件未到时通常无感；放行后由原业务决定是否提醒或建议。系统决定：登记关系、范围校验、条件匹配与频控。明确不做什么：命中不等于已控车，也不等于用户已确认。；位置：`base.modules[G].nodes[G07].detail` 第 2 段；sourceIds：VOICE-V15-LECTURE。
- **DG-G07-P1** 用户任务命中后，回调任务系统，携带原任务编号与命中证据。；位置：`base.modules[G].nodes[G07].paragraphs[0]`；sourceIds：VOICE-V15-LECTURE。
- **DG-G07-P2** 由任务系统决定通知用户、继续等待还是结束；触发器不直接改任务内容。；位置：`base.modules[G].nodes[G07].paragraphs[1]`；sourceIds：VOICE-V15-LECTURE。
- **DG-G07-P3** 与 Advisor 派发分开：用户任务走任务系统，主动建议走配置的 Advisor 出口。；位置：`base.modules[G].nodes[G07].paragraphs[2]`；sourceIds：VOICE-V15-LECTURE。
### G08 统一派发场景配置的 Action

- **DG-G08-L1** 按场景配置分发到业务出口；位置：`base.modules[G].nodes[G08].lines[0]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G08-L2** 可以是指令也可以是提示；位置：`base.modules[G].nodes[G08].lines[1]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G08-L3** 下游负责真正说话或控车；位置：`base.modules[G].nodes[G08].lines[2]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G08-L4** 保留原业务标识；位置：`base.modules[G].nodes[G08].lines[3]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G08-D1** 预设场景按已配置的动作出口继续处理，可以请求 Advisor（主动服务顾问）、发送确定推荐、生成业务事件，或交给闪念与 PHUD。统一动作分发设计集中描述这些出口，具体场景使用已接入的那一条路径。；位置：`base.modules[G].nodes[G08].detail` 第 1 段；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G08-D2** 不同出口继续完成不同事情。Advisor（主动服务顾问） 根据背景判断是否有服务建议；充电场景可能继续识别设施并询问用户；显示业务则安排终端曝光。触发器交出的是这次条件与业务关联，下游再更新自己的办理状态。 用户感知：条件未到时通常无感；放行后由原业务决定是否提醒或建议。系统决定：登记关系、范围校验、条件匹配与频控。明确不做什么：命中不等于已控车，也不等于用户已确认。；位置：`base.modules[G].nodes[G08].detail` 第 2 段；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G08-P1** 统一派发场景配置的 Action：可以是具体指令，也可以是对下游系统的提示。；位置：`base.modules[G].nodes[G08].paragraphs[0]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G08-P2** 下游（任务系统、Advisor、业务模块）负责真正说话或控车；触发器保留原业务标识，把结果送回正确接收方。；位置：`base.modules[G].nodes[G08].paragraphs[1]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G08-P3** 与 S 章边界：G 管何时触发，Advisor 内容与策略归主动服务章。；位置：`base.modules[G].nodes[G08].paragraphs[2]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
### G09 不触发也要知道原因

- **DG-G09-L1** 资格不通过留下原因；位置：`base.modules[G].nodes[G09].lines[0]`；sourceIds：VOICE-V15-LECTURE。
- **DG-G09-L2** 条件不满足留下原因；位置：`base.modules[G].nodes[G09].lines[1]`；sourceIds：VOICE-V15-LECTURE。
- **DG-G09-L3** 频控拦截留下原因；位置：`base.modules[G].nodes[G09].lines[2]`；sourceIds：VOICE-V15-LECTURE。
- **DG-G09-L4** 便于区分规则缺陷与信号缺失；位置：`base.modules[G].nodes[G09].lines[3]`；sourceIds：VOICE-V15-LECTURE。
- **DG-G09-D1** 一次检查可能停在不同位置：当前没有儿童，属于条件未满足；观察没有到达，属于证据缺失；模型超时，属于本次推理失败；条件成立但间隔未到，则是运行策略拦截。保留这些区别，才能说明这次为何没有派发。；位置：`base.modules[G].nodes[G09].detail` 第 1 段；sourceIds：VOICE-V15-LECTURE。
- **DG-G09-D2** 后续相关信号到来时，仍有效的场景重新检查。用户已取消的任务则按关闭状态停止推进。等待新证据、等待频控窗口和任务已结束分别影响下一次行为，不能都记为同一个“未触发”。 用户感知：条件未到时通常无感；放行后由原业务决定是否提醒或建议。系统决定：登记关系、范围校验、条件匹配与频控。明确不做什么：命中不等于已控车，也不等于用户已确认。；位置：`base.modules[G].nodes[G09].detail` 第 2 段；sourceIds：VOICE-V15-LECTURE。
- **DG-G09-P1** 没有派发时留下明确停止原因：资格不通过、条件不满足、频控拦截等。；位置：`base.modules[G].nodes[G09].paragraphs[0]`；sourceIds：VOICE-V15-LECTURE。
- **DG-G09-P2** 便于区分规则设计缺陷与信号缺失，避免“触发器坏了”的笼统结论。；位置：`base.modules[G].nodes[G09].paragraphs[1]`；sourceIds：VOICE-V15-LECTURE。
- **DG-G09-P3** 原因要能对应到本轮取数与判断日志，方便复盘。；位置：`base.modules[G].nodes[G09].paragraphs[2]`；sourceIds：VOICE-V15-LECTURE。
### G10 时间触发：到时回调，不直接控车

- **DG-G10-L1** 明确时间交给调度；位置：`base.modules[G].nodes[G10].lines[0]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G10-L2** 到期通知业务方；位置：`base.modules[G].nodes[G10].lines[1]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G10-L3** 不在触发器内直接控车；位置：`base.modules[G].nodes[G10].lines[2]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G10-L4** 改任务不是原地悄悄更新；位置：`base.modules[G].nodes[G10].lines[3]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G10-D1** 任务服务把“十分钟后”转换为明确执行时间，交给时间调度保存。到点后，调度回调原任务，任务服务检查是否已取消、过期以及本轮执行前提，再决定继续提醒或操作。等待期间不占用模型循环推理。；位置：`base.modules[G].nodes[G10].detail` 第 1 段；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G10-D2** 周期任务保留下一个时机，取消后撤销后续调度。跨行程是否保留由任务结束规则决定；已经因下电或到期结束的任务，不会因为下一次上电就自动恢复原来的时机。 用户感知：条件未到时通常无感；放行后由原业务决定是否提醒或建议。系统决定：登记关系、范围校验、条件匹配与频控。明确不做什么：命中不等于已控车，也不等于用户已确认。；位置：`base.modules[G].nodes[G10].detail` 第 2 段；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
- **DG-G10-P1** 明确时刻或周期到达后回调配置的业务出口，原任务继续处理动作与结果。时间到了不等于控车完成；取消、离线与迟到消息按任务约定核对，不给所有任务统一补做。[触发器 OnePage](https://bytedance.larkoffice.com/docx/KdBzd7uzXonxOZxXJW9cHSKonld)；位置：`base.modules[G].nodes[G10].paragraphs[0]`；sourceIds：VOICE-V15-LECTURE, CTA-TRIGGER。
### G11 语义推理只判断目标是否可见

- **DG-G11-L1** 用当前观察判断目标是否达成；位置：`base.modules[G].nodes[G11].lines[0]`；sourceIds：VOICE-V15-LECTURE。
- **DG-G11-L2** 视觉语义判断回有限状态；位置：`base.modules[G].nodes[G11].lines[1]`；sourceIds：VOICE-V15-LECTURE。
- **DG-G11-L3** 不在触发器内规划话术；位置：`base.modules[G].nodes[G11].lines[2]`；sourceIds：VOICE-V15-LECTURE。
- **DG-G11-L4** 可见≠已经替用户办完；位置：`base.modules[G].nodes[G11].lines[3]`；sourceIds：VOICE-V15-LECTURE。
- **DG-G11-D1** 语义判断把当前观察与任务目标对应起来。例如目标是“二排右侧宝宝哭了”，就检查座位、对象和行为。观察明确描述该位置宝宝啼哭，返回“达成”；看见左后乘客哭，或文字不足以证明目标宝宝在哭，返回“未达成”，等待后续观察。；位置：`base.modules[G].nodes[G11].detail` 第 1 段；sourceIds：VOICE-V15-LECTURE。
- **DG-G11-D2** 如果目标是“宝宝发烧了”，仅凭视觉描述无法可靠判断，返回“无法判断”。相机失败或模型调用超时则属于观察或调用异常，分别保留失败原因。语义模型只判断本次文字，不把不同帧拼成尚未提供的行为事实。；位置：`base.modules[G].nodes[G11].detail` 第 2 段；sourceIds：VOICE-V15-LECTURE。
- **DG-G11-D3** 连续观察可以并发推理，首条达成后，触发场景先记录已达成，后续请求不再启动新推理和动作，等待 Task Service 清理。语义层暂定用三分钟窗口拒绝旧上报，数值待联调调整；Task Service 入口另有二十秒检查，先筛掉过期任务观察。 用户感知：条件未到时通常无感；放行后由原业务决定是否提醒或建议。系统决定：登记关系、范围校验、条件匹配与频控。明确不做什么：命中不等于已控车，也不等于用户已确认。；位置：`base.modules[G].nodes[G11].detail` 第 3 段；sourceIds：VOICE-V15-LECTURE。
- **DG-G11-P1** 推理触发利用VLM语义判断目标情况，例如婴儿是否哭闹，不仅判断对象是否可见。观察、条件判断和后续动作分开，未知不等于不存在，组合能力依本版接口边界。[触发器 OnePage](https://bytedance.larkoffice.com/docx/KdBzd7uzXonxOZxXJW9cHSKonld)；位置：`base.modules[G].nodes[G11].paragraphs[0]`；sourceIds：VOICE-V15-LECTURE。
### G12 把有意义的状态变化写业务事件

- **DG-G12-L1** 有意义变化写成业务事件；位置：`base.modules[G].nodes[G12].lines[0]`；sourceIds：VOICE-V15-LECTURE。
- **DG-G12-L2** 供任务与主动服务消费；位置：`base.modules[G].nodes[G12].lines[1]`；sourceIds：VOICE-V15-LECTURE。
- **DG-G12-L3** 避免无意义抖动刷屏；位置：`base.modules[G].nodes[G12].lines[2]`；sourceIds：VOICE-V15-LECTURE。
- **DG-G12-L4** 事件带来源与时间；位置：`base.modules[G].nodes[G12].lines[3]`；sourceIds：VOICE-V15-LECTURE。
- **DG-G12-D1** 空调、媒体或导航发生有业务意义的变化时，触发器可以把旧值、新值和位置交给事件服务，由模板生成描述。它帮助后续 Context（上下文）、记忆或订阅方理解刚才发生什么，不需要把每次高频采样都写成一条事件。；位置：`base.modules[G].nodes[G12].detail` 第 1 段；sourceIds：VOICE-V15-LECTURE。
- **DG-G12-D2** 记录时区分设备采样、端上上报和规则匹配成功的时间，分析延迟才不会把它们混为同一时刻。调试用 client-event 只供排障，不会自动成为模型背景。事件描述的是发生的事实，后面的消费者仍需按自身目标决定是否继续行动。 用户感知：条件未到时通常无感；放行后由原业务决定是否提醒或建议。系统决定：登记关系、范围校验、条件匹配与频控。明确不做什么：命中不等于已控车，也不等于用户已确认。；位置：`base.modules[G].nodes[G12].detail` 第 2 段；sourceIds：VOICE-V15-LECTURE。
- **DG-G12-P1** 把有意义的状态变化写成业务事件，供任务与主动服务消费。；位置：`base.modules[G].nodes[G12].paragraphs[0]`；sourceIds：VOICE-V15-LECTURE。
- **DG-G12-P2** 避免无意义抖动刷屏；事件带来源与时间，方便下游核对。；位置：`base.modules[G].nodes[G12].paragraphs[1]`；sourceIds：VOICE-V15-LECTURE。
- **DG-G12-P3** 端侧本地自闭环的触发不经本条云端主链，见 L 章。；位置：`base.modules[G].nodes[G12].paragraphs[2]`；sourceIds：VOICE-V15-LECTURE。

## 原图连接关系

- **DG-E01** G01 → G02：登记后等待运行；位置：`base.modules[G].edges[0]`。
- **DG-E02** G02 → G03：范围与开关有效；位置：`base.modules[G].edges[1]`。
- **DG-E03** G03 → G04：相关信号到达；位置：`base.modules[G].edges[2]`。
- **DG-E04** G04 → G05：交出本轮证据；位置：`base.modules[G].edges[3]`。
- **DG-E05** G05 → G06：终点通过；位置：`base.modules[G].edges[4]`。
- **DG-E06** G05 → G09：不满足或未知；位置：`base.modules[G].edges[5]`。
- **DG-E07** G06 → G07：用户任务出口；位置：`base.modules[G].edges[6]`。
- **DG-E08** G06 → G08：预置场景出口；位置：`base.modules[G].edges[7]`。
- **DG-E09** G06 → G09：策略拦截；位置：`base.modules[G].edges[8]`。
- **DG-E10** G09 → G03：等待后续信号；位置：`base.modules[G].edges[9]`。
- **DG-E11** G01 → G10：登记时间条件；位置：`base.modules[G].edges[10]`。
- **DG-E12** G10 → G07：到期回调；位置：`base.modules[G].edges[11]`。
- **DG-E13** G05 → G11：语义判断；位置：`base.modules[G].edges[12]`。
- **DG-E14** G11 → G06：目标达成；位置：`base.modules[G].edges[13]`。
- **DG-E15** G11 → G09：未达成/不可判/失败；位置：`base.modules[G].edges[14]`。
- **DG-E16** G08 → G12：事件类Action；位置：`base.modules[G].edges[15]`。

## 原图评审问题和指标

- **DG-Q01** {"q": "场景为什么在这一次开始检查？", "why": "变化事件和当前状态表达不同业务语义。", "goodAnswer": "能指出唤醒信号，并用先挂 D 后出现儿童验证是否漏掉。", "evidence": "把同一轮的输入、实际配置、判断结果和下游反馈按时间排在一起，与预期行为逐项对照；同时核对这辆车实际发生了什么。"}；位置：`base.modules[G].questions[0]`。
- **DG-Q02** {"q": "视觉条件是比较字段，还是理解一句描述？", "why": "不存在的标签不能硬配成结构化条件。", "goodAnswer": "能区分年龄枚举、宠物描述、一次 VQA，并指出各自判断方。", "evidence": "把同一轮的输入、实际配置、判断结果和下游反馈按时间排在一起，与预期行为逐项对照；同时核对这辆车实际发生了什么。"}；位置：`base.modules[G].questions[1]`。
- **DG-Q03** {"q": "条件通过为什么用户仍没看到结果？", "why": "频控、下游受理、卡片展示和车控是不同阶段。", "goodAnswer": "能逐段定位，不用一个成功字段代表整条链路。", "evidence": "把同一轮的输入、实际配置、判断结果和下游反馈按时间排在一起，与预期行为逐项对照；同时核对这辆车实际发生了什么。"}；位置：`base.modules[G].questions[2]`。
- **DG-Q04** {"q": "规则没有通过，是条件明确不满足，还是缺少本次判断所需的证据？", "why": "把相机数据没到、状态查询失败和模型调用超时都记成“不满足”，会隐藏资源或链路故障，产品也无法知道应继续等还是解释失败。", "goodAnswer": "逐节点记录实际输入及通过、不满足、未知的结果；结构化比较、推理返回和业务有效性分开。对旧版语义模型还要核对其“未达成／无法判断”合同，不能把不同层的状态直接互换，更不能自行补一个不存在的置信度门禁。", "evidence": "依据 G05、G09、G11 与 ASY-A14 / ASY-A15 / ASY-A19。请规则负责人给 Workflow 路径，感知方给观察文本与状态，推理方给原始结果或超时，产品对照该版本状态映射。"}；位置：`base.modules[G].questions[3]`。
- **DG-Q05** {"q": "同一条件连续满足，允许发几次？一次允许发送怎样被计账？", "why": "持续睡着可以产生很多条观察，OR 两支也可能先后通过。没有明确计数单位，会把一次场景刷成多次提醒。", "goodAnswer": "说清频控作用于场景、任务还是某类出口，计数依据是条件通过、Action 发出还是后续结果，并对照当前正式配置。Workflow 的 OR 首支通过不代表其他分支自动取消；应核对唯一终点与出口重复保护。规则间隔、推理过期、任务取消是不同机制，不拿一个超时值覆盖全部。", "evidence": "依据 G05、G06 与 ASY-A19 / ASY-A28。请平台方给已发布频控配置，触发器方给每次判断与拦截原因，下游方给实际接收和曝光次数；计数时点未定义必须作为评审问题。"}；位置：`base.modules[G].questions[4]`。
- **DG-Q06** {"q": "语义模型对同一段观察有时达成、有时不达成，先查什么？", "why": "不稳定可能来自目标和位置变化、观察版本变化或提示配置变化，不能看到两次结果不同就笼统归因随机性。", "goodAnswer": "先固定目标、对象、位置、观察文本、模型与提示版本，再重复受控评测；人工给出可判断样本的期望结果，并把证据不足样本分开。若输入一致仍反复翻转才统计模型判定稳定性；若输入本身陈旧、错误或不含目标，先修供给，不靠频控掩盖。", "evidence": "依据 G11 与 ASY-A14 / ASY-A15。请语义推理负责人提供脱敏请求、原始响应、模型与提示版本及失败原因；测试提供同输入重复运行记录和人工标注，任务方提供目标是否已更新或关闭。"}；位置：`base.modules[G].questions[5]`。
- **DG-Q07** {"q": "命中后到底送任务系统、Advisor，还是直接展示？怎么确认没有接错出口？", "why": "这些出口代表不同产品行为：等待中的用户目标、主动建议、业务事件和静默展示不能互相替代。", "goodAnswer": "从已发布场景的业务归属与 Action 配置指出接收方、载荷和验收终点。用户任务回原任务系统，静默展示继续追曝光，写事件继续追保存；统一 Action Dispatcher 是 10/21 改造要求，只有取得当前版本证据才可说已切换，不能把旧固定回调和新路由画成同时必经。", "evidence": "依据 G01、G07、G08、G12 与 ASY-A11 / ASY-A28 / ASY-A40。请配置方给场景版本与出口，服务方给实际派发记录，下游方给同一场景关联的受理、展示或保存证据；不是所有出口都有车辆动作。"}；位置：`base.modules[G].questions[6]`。
- **DG-M01** {"name": "条件命中准确率与召回率", "definition": "按规则信号与视觉语义分别统计误触发、漏触发；保留场景和对象分组。", "segment": "至少按车型、版本、入口和成功/失败分组；不能用整体平均值掩盖异常场景。", "targetStatus": "建议验收口径；阈值需项目确认。"}；位置：`base.modules[G].metrics[0]`（网页提出的验收建议，非线上成绩）。
- **DG-M02** {"name": "未知判定占比", "definition": "输入缺失、查询失败或推理失败导致未知的检查数／全部检查数。", "segment": "至少按车型、版本、入口和成功/失败分组；不能用整体平均值掩盖异常场景。", "targetStatus": "采用三态判断时分别统计满足、不满足和未知，按项目验证实际实现。"}；位置：`base.modules[G].metrics[1]`（网页提出的验收建议，非线上成绩）。
- **DG-M03** {"name": "出口闭环率", "definition": "条件通过后，出口受理、真实展示和真实执行分别统计，不合成假成功。", "segment": "至少按车型、版本、入口和成功/失败分组；不能用整体平均值掩盖异常场景。", "targetStatus": "建议验收口径；分别确认出口受理、展示和执行阈值。"}；位置：`base.modules[G].metrics[2]`（网页提出的验收建议，非线上成绩）。
- **DG-M04** {"name": "必要唤醒覆盖率", "definition": "在人工列出的、会使场景从不成立变为可能成立的信号变化样本中，正确发起该场景检查的样本数／全部此类变化样本数。需要继续检查不等于必须触发动作；条件不满足的样本也可以正确唤醒。", "segment": "按动态状态、当前静态值、视觉结果更新和时序组合分组；重点分别测先挂挡后出现儿童与先有儿童后挂挡。", "targetStatus": "建议验收口径；必要唤醒清单按场景条件约定确定。"}；位置：`base.modules[G].metrics[3]`（网页提出的验收建议，非线上成绩）。
- **DG-M05** {"name": "频控与唯一出口违反次数", "definition": "在明确发布版本与计数规则的受控测试窗口内，超过允许次数或间隔的 Action 发出次数，以及一次流程完成产生多次同类出口的次数，分别记录。频控拒绝后的零曝光不能计为漏触发。", "segment": "按场景、任务、出口类型、连续相同输入、OR 分支先后通过和重复回调分组；下游重复执行另列，不都算 Trigger 重复。", "targetStatus": "建议验收口径；先明确计数单位、起算时点和频控窗口。"}；位置：`base.modules[G].metrics[4]`（网页提出的验收建议，非线上成绩）。
- **DG-M06** {"name": "同输入语义判定翻转率", "definition": "对固定目标、观察文本、对象位置、模型与提示版本的一组重复测试，出现两种及以上业务判定的样本组数／完成规定重复次数的样本组数；同时保留每组人工正确性结果。调用失败与未知单列，不能把稳定地判断错误当质量合格。", "segment": "按明确正例、明确反例、证据不足、目标不可视觉判断及观察位置分组；输入版本不同的两次请求不放入同一组。", "targetStatus": "建议验收口径；重复次数及允许波动按业务风险和评测基线确认。"}；位置：`base.modules[G].metrics[5]`（网页提出的验收建议，非线上成绩）。

## 原图实际 SVG 文本与跨章连线

- **DG-X-X12** T04 → G01；位置：`originalSvg [data-edge=X12]`。
- **DG-X-X13** G07 → T07；位置：`originalSvg [data-edge=X13]`。
- **DG-X-X25** B07 → G03；位置：`originalSvg [data-edge=X25]`。
- **DG-X-X34** P08 → G01；位置：`originalSvg [data-edge=X34]`。
- **DG-X-X36** G08 → S02；位置：`originalSvg [data-edge=X36]`。
- **DG-X-X77** T11 → G01；位置：`originalSvg [data-edge=X77]`。
- **DG-X-X80** A09 → G11；位置：`originalSvg [data-edge=X80]`。
- **DG-X-X81** A07 → G04；位置：`originalSvg [data-edge=X81]`。
- **DG-X-X85** G08 → H06；位置：`originalSvg [data-edge=X85]`。
- **DG-SVG-G01** G01 ｜ 接收场景与业务关系 ｜ 任务系统与配置后台都可登记每条规则绑定具体业务命中后按绑定关系交接 ｜ 云端触发器接到规则时，先保存要等什么条件、对哪些车辆生效，以及命中后通知谁。用户创建的宝宝提醒需要回原任务，预设舒适场景可能去 Advisor，静默内容则交相应显示业务，接收方不能混用。 ｜ 绑定关系决定了后续怎样继续。相同一句“条件已成立”，若没有任务或场景身份，就无法判断是谁的安排、该不该执行。登记成功后仍需等待范围与开关检查，再监听相关变化；它此刻尚未触发，也没有替用户完成任何车辆动作。 ｜ 触发器本轮只使用已接入的当前状态与观察核对登记条件；用户偏好、历史记忆和最终话术，在建议进入 Director 那一轮再由其结合上下文与记忆判断。；位置：`originalSvg [data-node=G01]`。
- **DG-SVG-G02** G02 ｜ 这辆车能用这个场景吗 ｜ 核车辆、渠道与实际能力平台开关和单车开关分别判断范围缺失时不扩大到全部车辆 ｜ 规则运行前，系统检查渠道、车型、车辆 ID、客户端版本以及场景开关。一条规则在平台开启，并不表示所有车辆都进入生效范围；本车用户停用场景后，也不会继续按该场景服务。 ｜ 进入范围的车辆还需要具备规则依赖的信号和能力。视觉没有接入的车型，不能仅靠复制场景配置完成同一判断。范围、开关和能力满足后，规则才进入本车的后续检查。；位置：`originalSvg [data-node=G02]`。
- **DG-SVG-G03** G03 ｜ 哪个信号叫醒这次检查 ｜ 变化信号负责叫醒当前状态用于后续比较视觉条件订阅对应观察更新 ｜ 触发器订阅与场景有关的信号，变化到来时启动一次条件检查。“挡位等于 D”比较当前值；“挡位变更为 D”同时要求新旧值不同且新值为 D。重复上报同一个 D 挡值，不算再次切挡。 ｜ 如果服务需要在“挂 D 挡且后排有儿童”时检查儿童锁，先坐入儿童再挂挡、先挂挡再坐入儿童都可能形成时机。对应的挡位变化和乘员观察更新都要能够唤起检查，规则再读取另一项当前状态，合并判断整组条件。；位置：`originalSvg [data-node=G03]`。
- **DG-SVG-G04** G04 ｜ 取本轮真正需要的状态 ｜ 读取相关车况、导航及座舱状态位置、枚举和数值单位明确缺失与过期保持不同结果 ｜ 被唤醒后，触发器按场景需要取当前车况、导航、媒体、座舱或车机状态。儿童锁要读取对应后排位置，温度比较要使用正确单位；同名字段或默认值一旦取错，后面的规则即使运行正确也会判断错对象。 ｜ 信号可能来自订阅、状态查询或 Context，不应假定它们共享同一份同步缓存。保留采样时间、缺失和失败原因，关键状态过旧时先按有效性规则处理。不能把还没拿到锁状态填成关闭，再据此向用户发出不必要的建议。；位置：`originalSvg [data-node=G04]`。
- **DG-SVG-G05** G05 ｜ 逐步判断条件是否达成 ｜ 确定字段按规则比较视觉目标交语义判断且或关系合并业务条件取数和推理失败保留具体原因 ｜ 结构化信号按约定运算符比较，多个条件用且或关系组合。例如后排有儿童或宠物，再检查对应位置的儿童锁。自然语言视觉目标则进入语义判断，使用已有观察文字与目标比较，不在条件节点额外取图或控制车辆。 ｜ 字段不满足时继续等待相关变化；缺少必要状态、查询失败或模型超时时，记录具体取证或执行失败。语义模型另外有“达成、未达成、无法判断”三种业务结果，含义由 G11 的视觉目标规则定义，不能把所有规则异常都合成同一种语义结果。；位置：`originalSvg [data-node=G05]`。
- **DG-SVG-G06** G06 ｜ 本次允许发出去吗 ｜ 条件通过后再检查执行策略按总次数、单日、上电次数及间隔限制频控拦截保留原条件成立事实 ｜ 宝宝持续哭闹时，多份观察都可能满足目标。条件通过后，执行策略继续检查总次数、单日次数、单次上电次数和触发间隔，控制这一次是否派发，避免持续状态造成重复打扰。 ｜ 策略允许就交给对应出口；达到次数或间隔限制则记录拦截原因，保留“条件已经成立”的事实。实际间隔取自场景配置，显示去重时间和任务过期时间分别管理，不改变这条规则的频控设置。；位置：`originalSvg [data-node=G06]`。
- **DG-SVG-G07** G07 ｜ 用户任务回调任务系统 ｜ 携带原任务与达成条件任务系统继续检查有效性提醒与车控由后续主链完成 ｜ 用户任务目标达成且允许派发后，触发器回调原任务服务，说明哪条任务等到了什么条件。例如二排右侧宝宝哭闹命中，回调仍携带原任务关联，任务服务才能找到用户当时的安排。 ｜ 任务服务检查该任务是否仍有效，再生成本轮建议，经车端回流和输入管理交给 Planner。Planner 决定话术及工具，后续输出才让用户听见提醒。触发回调因此推进任务，不直接把整条服务记为完成。；位置：`originalSvg [data-node=G07]`。
- **DG-SVG-G08** G08 ｜ 统一派发场景配置的 Action ｜ 可交任务、Advisor 或显示业务事件与轻量展示有独立出口统一分发需确认场景实际接入 ｜ 预设场景按已配置的动作出口继续处理，可以请求 Advisor、发送确定推荐、生成业务事件，或交给闪念与 PHUD。统一动作分发设计集中描述这些出口，具体场景使用已接入的那一条路径。 ｜ 不同出口继续完成不同事情。Advisor 根据背景判断是否有服务建议；充电场景可能继续识别设施并询问用户；显示业务则安排终端曝光。触发器交出的是这次条件与业务关联，下游再更新自己的办理状态。；位置：`originalSvg [data-node=G08]`。
- **DG-SVG-G09** G09 ｜ 不触发也要知道原因 ｜ 条件不满足与数据未知分开任务失效和频控分别记录等后续有效信号再检查 ｜ 一次检查可能停在不同位置：当前没有儿童，属于条件未满足；观察没有到达，属于证据缺失；模型超时，属于本次推理失败；条件成立但间隔未到，则是运行策略拦截。保留这些区别，才能说明这次为何没有派发。 ｜ 后续相关信号到来时，仍有效的场景重新检查。用户已取消的任务则按关闭状态停止推进。等待新证据、等待频控窗口和任务已结束分别影响下一次行为，不能都记为同一个“未触发”。；位置：`originalSvg [data-node=G09]`。
- **DG-SVG-G10** G10 ｜ 时间触发：到时回调，不直接控车 ｜ 一次与周期时间独立登记调度到点回原任务取消后撤销后续时机 ｜ 任务服务把“十分钟后”转换为明确执行时间，交给时间调度保存。到点后，调度回调原任务，任务服务检查是否已取消、过期以及本轮执行前提，再决定继续提醒或操作。等待期间不占用模型循环推理。 ｜ 周期任务保留下一个时机，取消后撤销后续调度。跨行程是否保留由任务结束规则决定；已经因下电或到期结束的任务，不会因为下一次上电就自动恢复原来的时机。；位置：`originalSvg [data-node=G10]`。
- **DG-SVG-G11** G11 ｜ 语义推理只判断目标是否可见 ｜ 核目标对象、座位与描述未达成与无法判断分别返回首条达成后停止新增判断 ｜ 语义判断把当前观察与任务目标对应起来。例如目标是“二排右侧宝宝哭了”，就检查座位、对象和行为。观察明确描述该位置宝宝啼哭，返回“达成”；看见左后乘客哭，或文字不足以证明目标宝宝在哭，返回“未达成”，等待后续观察。 ｜ 如果目标是“宝宝发烧了”，仅凭视觉描述无法可靠判断，返回“无法判断”。相机失败或模型调用超时则属于观察或调用异常，分别保留失败原因。语义模型只判断本次文字，不把不同帧拼成尚未提供的行为事实。 ｜ 连续观察可以并发推理，首条达成后，触发场景先记录已达成，后续请求不再启动新推理和动作，等待 Task Service 清理。语义层暂定用三分钟窗口拒绝旧上报，数值待联调调整；Task Service 入口另有二十秒检查，先筛掉过期任务观察。；位置：`originalSvg [data-node=G11]`。
- **DG-SVG-G12** G12 ｜ 把有意义的状态变化写业务事件 ｜ 保留变化前后值和对象按模板生成可消费事件匹配时间与采样时间分别记录 ｜ 空调、媒体或导航发生有业务意义的变化时，触发器可以把旧值、新值和位置交给事件服务，由模板生成描述。它帮助后续 Context、记忆或订阅方理解刚才发生什么，不需要把每次高频采样都写成一条事件。 ｜ 记录时区分设备采样、端上上报和规则匹配成功的时间，分析延迟才不会把它们混为同一时刻。调试用 client-event 只供排障，不会自动成为模型背景。事件描述的是发生的事实，后面的消费者仍需按自身目标决定是否继续行动。；位置：`originalSvg [data-node=G12]`。

## 来源编号原样登记

- **DG-SRC-ASY-A05** {"id": "ASY-A05", "title": "静态Advisor OnePager", "url": "https://bytedance.larkoffice.com/wiki/Hzq8wR285io8qxkFYGscs5EAnMg"}。
- **DG-SRC-ASY-A06** {"id": "ASY-A06", "title": "TaskService车内视觉长时感知", "url": "https://bytedance.larkoffice.com/wiki/QeJkwlVkjiPZYwknFUecrjD9nxb"}。
- **DG-SRC-ASY-A11** {"id": "ASY-A11", "title": "触发器OnePage", "url": "https://bytedance.larkoffice.com/wiki/Xk6xwM3l8iK4oCkXIMlcIo4hnFc"}。
- **DG-SRC-ASY-A14** {"id": "ASY-A14", "title": "云端触发器模型解析VLM链路", "url": "https://bytedance.larkoffice.com/wiki/AmO3wnzrWiBjE3ks94icc0JjnJf"}。
- **DG-SRC-ASY-A15** {"id": "ASY-A15", "title": "推理触发技术方案", "url": "https://bytedance.larkoffice.com/wiki/Q11CwtB7mitzckkxmnmcKvIDnNg"}。
- **DG-SRC-ASY-A17** {"id": "ASY-A17", "title": "定时任务云端触发器PRD", "url": "https://bytedance.larkoffice.com/wiki/Ha0LwvsK3iSfB9kJ7pXccouxnGd"}。
- **DG-SRC-ASY-A19** {"id": "ASY-A19", "title": "触发器配置平台改造PRD", "url": "https://bytedance.larkoffice.com/wiki/TW0pwbGmyit1KGkVPazcX6mSnYb"}。
- **DG-SRC-ASY-A28** {"id": "ASY-A28", "title": "静默展示一期服务端", "url": "https://bytedance.larkoffice.com/docx/Bl4AdeDEqoyar7xAL7QcG3Bbnyh"}。
- **DG-SRC-ASY-A36** {"id": "ASY-A36", "title": "端状态事件日志OnePage", "url": "https://bytedance.larkoffice.com/wiki/PRf0wRd3Uic0omkiiiGc70wanQN"}。
- **DG-SRC-ASY-A38** {"id": "ASY-A38", "title": "事件生产与使用迭代技术", "url": "https://bytedance.larkoffice.com/wiki/SiedwOaRPiNhHpkLXjucucUgnBc"}。
- **DG-SRC-ASY-A40** {"id": "ASY-A40", "title": "触发器生产事件日志技术", "url": "https://bytedance.larkoffice.com/wiki/Aowjw935OiMyEcki7FFco33QnTh"}。
- **DG-SRC-ASY-A47** {"id": "ASY-A47", "title": "状态感知需求文档", "url": "https://bytedance.larkoffice.com/docx/UFSIdVdaoot5ZNxXEprcF7HXn3d"}。
- **DG-SRC-CTA-TRIGGER** {"id": "CTA-TRIGGER", "title": "触发器/Condition-Trigger-Action", "url": "https://bytedance.larkoffice.com/wiki/OixPddw1ToBjuLxImq9cemsUnwc"}。
- **DG-SRC-RESUME-TRIGGER-ONEPAGE** {"id": "RESUME-TRIGGER-ONEPAGE", "title": "触发器 OnePage（云端规则、执行策略与边界原文）", "url": "https://bytedance.larkoffice.com/docx/KdBzd7uzXonxOZxXJW9cHSKonld"}。
- **DG-SRC-VOICE-V15-LECTURE** {"id": "VOICE-V15-LECTURE", "title": "豆包汽车｜从一句话到车内结果：v15 全链路讲课版", "url": "https://bytedance.larkoffice.com/docx/CYRndDwjDo7TvRxTshac5QWxnAg", "type": "docx"}。

## 已知需要回源核对的旧表述

- G03/G05 原图描述多类条件组合，而正文列出 OnePage 暂不支持混合触发，两边均保留，须按版本解释。
- G11 节点名“是否可见”比其实际“是否哭闹/是否达成”判据更窄，且 detail 中包含语义层暂定 3 分钟与任务入口 20 秒两层过滤。
- G02 图中登录与总开关前置表述较强，paragraphs 明确部分为 TODO。
- G05 原图“抖动过滤/多命中按优先级”不能单凭图确认为已交付。
