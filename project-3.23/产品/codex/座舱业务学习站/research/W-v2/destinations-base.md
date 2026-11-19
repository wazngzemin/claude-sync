# W 章现有知识点底表

基线：`HTML/01-进行中/豆包汽车-业务学习站-v62.html:L269`；页面对象为 `DATA.pages[9]`，原始全图模块为 `DATA.base.modules[3]`。该 HTML 把 DATA 压在一行，因此用 JSON 路径定位各点。`chapters/W/old-page.json` 与当前页 W 对象逐字段一致（已比对），不是另一套现行页面。

本表登记旧页所有文本知识点，拆到句子级；完全相同的句子合并为一条并保留各出处，近义表述仍保留。这里的“旧页陈述”不代表研究已证实，事实及冲突由 facts.md 核定。本轮不分配新正文去向。

## 知识点

- [D001] [开篇与主线] 页面先登记可操作对象，语音匹配当前对象后交原业务执行，结果再回到播报与历史。〔旧页陈述〕
  - 位置：`DATA.pages[9].summary`。

- [D002] [开篇与主线] 导航卡片上已经列出三个地点，用户说“去第二个”，希望直接选择屏幕上的结果。〔旧页陈述〕
  - 位置：`DATA.pages[9].scenario`。

- [D003] [开篇与主线] 页面知道第二个地点是谁，语音系统听到了“第二个”，可见即可说负责把这两份信息接起来，让用户不必把完整地点名称再说一遍。〔旧页陈述〕
  - 位置：`DATA.pages[9].scenario`。

- [D004] [开篇与主线] 屏幕上有一张餐厅卡，用户说「第二个」。〔旧页陈述〕
  - 位置：`DATA.pages[9].bridge`。

- [D005] [开篇与主线] 这一章靠业务登记的名册把这句话对到一个控件：页面报上可点的元素，定稿文字按规则匹配，唯一目标才交给业务点下去，真实回执再写进历史。〔旧页陈述〕
  - 位置：`DATA.pages[9].bridge`。

- [D006] [开篇与主线] 它不让模型看图猜按钮，也不给模型操作整块屏幕的权限。〔旧页陈述〕
  - 位置：`DATA.pages[9].bridge`。

- [D007] [开篇与主线] 餐厅卡片停在屏幕上，两家店各带一个「导航」按钮。〔旧页陈述〕
  - 位置：`DATA.pages[9].mainline[0]`。

- [D008] [开篇与主线] 主驾说「第二个」，副驾直接说「导航」。〔旧页陈述〕
  - 位置：`DATA.pages[9].mainline[0]`。

- [D009] [开篇与主线] 这两句话单独听都没有对象，全靠眼前这张卡给它们指向。〔旧页陈述〕
  - 位置：`DATA.pages[9].mainline[0]`。

- [D010] [开篇与主线] 这一章讲的是：屏幕上已经登记的元素，怎样被一句话点到，并把真实结果带回对话。〔旧页陈述〕
  - 位置：`DATA.pages[9].mainline[0]`。

- [D011] [开篇与主线] 起点在页面业务，不在模型。〔旧页陈述〕
  - 位置：`DATA.pages[9].mainline[1]`。

- [D012] [开篇与主线] 车企或业务方扫描当前最上层界面，挑出真正能执行点击的元素，提取显示文字和控件对象；再把可说名称、允许的泛化表达和控件标识绑成一条登记。〔旧页含实现、范围或历史断言，需与原文核对〕
  - 位置：`DATA.pages[9].mainline[1]`。

- [D013] [开篇与主线] 同名按钮必须补位置或上下文，否则两个「返回」无法区分。〔旧页陈述〕
  - 位置：`DATA.pages[9].mainline[1]`。

- [D014] [开篇与主线] 每个对象都有唯一标识，语音层只负责听清和匹配，不负责替业务点。〔旧页陈述〕
  - 位置：`DATA.pages[9].mainline[1]`。

- [D015] [开篇与主线] 登记好的词要送进识别：在线和离线两套词表分别注入，因为车内网络不稳——唤醒后离在线并行，离线先出结果就先走离线；免唤醒没有等在线的时间窗，只能靠离线词表。〔旧页陈述〕
  - 位置：`DATA.pages[9].mainline[2]`。

- [D016] [开篇与主线] 热词只提高听对的概率，不保证命中；切页或卡片退场，旧词要注销，否则用户在新页面说旧按钮名，系统可能匹配到已经不存在的控件。〔旧页陈述〕
  - 位置：`DATA.pages[9].mainline[2]`。

- [D017] [开篇与主线] 匹配必须等文字定稿。〔旧页陈述〕
  - 位置：`DATA.pages[9].mainline[3]`。

- [D018] [开篇与主线] 过程文字一直在变，拿「导航到第二」这样的半句去匹配，可能命中错误对象甚至误点。〔旧页陈述〕
  - 位置：`DATA.pages[9].mainline[3]`。

- [D019] [开篇与主线] 定稿时同时绑定本次界面快照和请求编号，保证用来匹配的名册就是用户看到的那一版。〔旧页陈述〕
  - 位置：`DATA.pages[9].mainline[3]`。

- [D020] [开篇与主线] 匹配按约定的规则比，不是让模型自由发挥：全文精确、允许点击类前缀和句尾语气词的模糊、以及 6 个词以上连续 4 个字的局部。〔旧页含实现、范围或历史断言，需与原文核对〕
  - 位置：`DATA.pages[9].mainline[4]`。

- [D021] [开篇与主线] 结果分零个、一个、多个：一个直接交执行；多个交回登记业务消歧，因为业务知道位置、高亮和优先级，语音层只知道文字像不像；零个回到普通语音入口继续判断，不能因为没匹配上就把整句吞掉。〔旧页陈述〕
  - 位置：`DATA.pages[9].mainline[4]`。

- [D022] [开篇与主线] 目标唯一以后还要确认它此刻仍有效，再交给控件所属业务用页面自己的点击能力执行。〔旧页陈述〕
  - 位置：`DATA.pages[9].mainline[5]`。

- [D023] [开篇与主线] 点下去不是结束：业务还可能校验失败、接口超时、控件状态不允许。〔旧页陈述〕
  - 位置：`DATA.pages[9].mainline[5]`。

- [D024] [开篇与主线] 成功、失败、未完成分别带回，成功话术和失败提示由统一播报处理；这次点击作为已发生事件写进历史，保留用户原话、控件对象和真实结果——否则下一句「返回」「再选」就接不上对象。〔旧页陈述〕
  - 位置：`DATA.pages[9].mainline[5]`。

- [D025] [开篇与主线] 这一章交出去的是「这一次点到了谁、有没有点成」。〔旧页陈述〕
  - 位置：`DATA.pages[9].mainline[5]`。

- [D026] [正文：先让页面交出它真正支持的操作] 语音侧不知道屏幕上现在有哪些按钮，必须由最了解界面的一方把可点对象报上来。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[0].paragraphs[0]`；`DATA.pages[9].teaching.lessons[0].paragraphs[0]`。

- [D027] [正文：先让页面交出它真正支持的操作] 卡片出现在最上层页面之后，车企或业务方通过无障碍服务界面等技术方式实时扫描当前屏幕，挑出真正能执行点击的可见元素，比如那两家候选店和各自的「导航」按钮，提取它们的显示文字和对应控件对象。〔旧页含实现、范围或历史断言，需与原文核对〕
  - 位置：`DATA.pages[9].sections[0].paragraphs[0]`；`DATA.pages[9].teaching.lessons[0].paragraphs[0]`。

- [D028] [正文：先让页面交出它真正支持的操作] 解析只针对最顶层页面，弹窗、覆盖层和后台页面不参与；这一步靠的是页面自身提供的控件信息，不是让语音侧用视觉模型去读屏幕猜位置。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[0].paragraphs[0]`；`DATA.pages[9].teaching.lessons[0].paragraphs[0]`。

- [D029] [正文：先让页面交出它真正支持的操作] W01（由页面业务整理当前可以操作的控件）是整条快路的起点。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[0].paragraphs[1]`；`DATA.pages[9].teaching.lessons[0].paragraphs[1]`。

- [D030] [正文：先让页面交出它真正支持的操作] 为什么不能让视觉模型直接看图猜按钮，有两层原因：一是车机界面控件位置、文字和状态由业务代码维护，模型读图只能得到像素外观，拿不到稳定的控件标识，猜中的位置在页面刷新后就可能失效；二是安全责任无法划分，语音侧直接操作屏幕等于绕过业务自己的校验。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[0].paragraphs[1]`；`DATA.pages[9].teaching.lessons[0].paragraphs[1]`。

- [D031] [正文：先让页面交出它真正支持的操作] 框架把界面元素解析、指令生成和模拟点击划给车企或各业务模块，语音识别和指令匹配划给字节语音模块。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[0].paragraphs[1]`；`DATA.pages[9].teaching.lessons[0].paragraphs[1]`。

- [D032] [正文：先让页面交出它真正支持的操作] 名册里的每个对象要先完成登记，进入 W02（把可说名称与唯一控件标识绑定）。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[0].paragraphs[2]`；`DATA.pages[9].teaching.lessons[0].paragraphs[2]`。

- [D033] [正文：先让页面交出它真正支持的操作] 按钮显示文本直接作为核心指令，用户说「导航」就对应这个「导航」按钮；遇到多个文字相同的控件，比如列表里两个「返回」，名册要补充位置描述，用户说「第二个」才能区分。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[0].paragraphs[2]`；`DATA.pages[9].teaching.lessons[0].paragraphs[2]`。

- [D034] [正文：先让页面交出它真正支持的操作] 注册时还要过滤符号、标点等不适合朗读的内容，并按框架配置可识别的泛化表达：前面可以加「点击、点一下、帮我选、选择」等前缀，后面可以带「吧、啦」等语气词。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[0].paragraphs[2]`；`DATA.pages[9].teaching.lessons[0].paragraphs[2]`。

- [D035] [正文：先让页面交出它真正支持的操作] 名册输出的是动态维护的「语音指令到界面元素」映射库，包含热词指令、泛化词指令和对应控件标识三类内容。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[0].paragraphs[3]`；`DATA.pages[9].teaching.lessons[0].paragraphs[3]`。

- [D036] [正文：先让页面交出它真正支持的操作] 框架需求规定单页注册词不超过 500 个，这是指定框架的需求上限，不是已经实测过的吞吐能力，也不等于工具数量上限。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[0].paragraphs[3]`；`DATA.pages[9].teaching.lessons[0].paragraphs[3]`。

- [D037] [正文：先让页面交出它真正支持的操作] 冲突处理上，同名控件必须补位置或上下文描述，否则「删除」「返回」这类高频词无法区分指向；不做区分就登记，多候选时只能交给业务消歧，语音层不能替用户选。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[0].paragraphs[3]`；`DATA.pages[9].teaching.lessons[0].paragraphs[3]`。

- [D038] [正文：先让页面交出它真正支持的操作] 登记好的有效词再进入 W03（把当前有效按钮词送入语音识别），同时注入在线识别和离线识别，帮助语音识别听清页面上的特殊店名和按钮名。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[0].paragraphs[4]`；`DATA.pages[9].teaching.lessons[0].paragraphs[4]`。

- [D039] [正文：先让页面交出它真正支持的操作] 热词分在线和离线两套分别注入，原因是车内网络条件不稳定：唤醒后离在线并行，离线先出结果就先走离线，离线没识别出来再等在线；免唤醒场景没有等待在线的时间窗口，只能依赖离线词表。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[0].paragraphs[4]`；`DATA.pages[9].teaching.lessons[0].paragraphs[4]`。

- [D040] [正文：先让页面交出它真正支持的操作] 页面词表随卡片进入和退场同步增删，避免旧店名、旧按钮名长期留在离线词表里挤占识别资源。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[0].paragraphs[4]`；`DATA.pages[9].teaching.lessons[0].paragraphs[4]`。

- [D041] [正文：先让页面交出它真正支持的操作] 热词注入成功只提高识别概率，不等于用户这句话最终必然命中按钮。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[0].paragraphs[5]`；`DATA.pages[9].teaching.lessons[0].paragraphs[5]`。

- [D042] [正文：先让页面交出它真正支持的操作] 这些热词和人名、地点、媒体、车控等其他热词一起在识别链路处理。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[0].paragraphs[5]`；`DATA.pages[9].teaching.lessons[0].paragraphs[5]`。

- [D043] [正文：先让页面交出它真正支持的操作] 要注意，热词和通用词表冲突时的优先级，归识别链路章节统一处理，本章只保证名册里的有效词被送进词表。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[0].paragraphs[5]`；`DATA.pages[9].teaching.lessons[0].paragraphs[5]`。

- [D044] [正文：先让页面交出它真正支持的操作] 页面词由页面业务自己登记和更新，切页后旧控件词要注销，不能拿旧页面的对象执行新的一句话。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[0].paragraphs[5]`；`DATA.pages[9].teaching.lessons[0].paragraphs[5]`。

- [D045] [正文：听到一句话后，先确定它指的是哪个页面元素] 必须等文字定稿才拿去匹配，过程文字不能直接模拟点击。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[1].paragraphs[0]`；`DATA.pages[9].teaching.lessons[1].paragraphs[0]`。

- [D046] [正文：听到一句话后，先确定它指的是哪个页面元素] 用户说完，识别链路交出最终输入后进入 W04（最终文字到来后匹配本次有效界面）。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[1].paragraphs[0]`；`DATA.pages[9].teaching.lessons[1].paragraphs[0]`。

- [D047] [正文：听到一句话后，先确定它指的是哪个页面元素] 语音识别是流式出字的，过程中的字一直在变，这一步必须等文字定稿，同时保留本次请求编号、音区和页面上下文。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[1].paragraphs[0]`；`DATA.pages[9].teaching.lessons[1].paragraphs[0]`。

- [D048] [正文：听到一句话后，先确定它指的是哪个页面元素] 为什么必须等定稿，是因为流式中间结果可能把「导航到第二家」识别成半截「导航到第二」，拿中间态去匹配名册，会命中错误对象甚至误点。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[1].paragraphs[0]`；`DATA.pages[9].teaching.lessons[1].paragraphs[0]`。

- [D049] [正文：听到一句话后，先确定它指的是哪个页面元素] 等定稿同时绑定页面快照，才能保证匹配用的名册和用户看到的界面是同一版。〔旧页含实现、范围或历史断言，需与原文核对〕
  - 位置：`DATA.pages[9].sections[1].paragraphs[1]`；`DATA.pages[9].teaching.lessons[1].paragraphs[1]`。

- [D050] [正文：听到一句话后，先确定它指的是哪个页面元素] 动态卡片也可以登记它当前的可选项，但这份选择器只是当前卡片的名册，不能当成脱离页面、永久有效的本地缓存；具体卡片是否接入，要按车型和发布版本确认。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[1].paragraphs[1]`；`DATA.pages[9].teaching.lessons[1].paragraphs[1]`。

- [D051] [正文：听到一句话后，先确定它指的是哪个页面元素] 页面词表随卡片进入和退场同步增删，这一条和 W03 的热词注入是同一个名册在两端的同步动作。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[1].paragraphs[1]`；`DATA.pages[9].teaching.lessons[1].paragraphs[1]`。

- [D052] [正文：听到一句话后，先确定它指的是哪个页面元素] 文字定稿才进入 W05（按约定文字规则找候选控件）。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[1].paragraphs[2]`；`DATA.pages[9].teaching.lessons[1].paragraphs[2]`。

- [D053] [正文：听到一句话后，先确定它指的是哪个页面元素] 匹配按框架约定的全文精确、局部和模糊规则在名册里比较，不是让模型自由发挥，把意思相近的话都当成按钮。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[1].paragraphs[2]`；`DATA.pages[9].teaching.lessons[1].paragraphs[2]`。

- [D054] [正文：听到一句话后，先确定它指的是哪个页面元素] 精确匹配直接比对识别文本和核心指令；模糊匹配接受前面列举的点击类前缀和句尾语气词；局部匹配要求 6 个以上词时连续匹配 4 个字以上。〔旧页含实现、范围或历史断言，需与原文核对〕
  - 位置：`DATA.pages[9].sections[1].paragraphs[2]`；`DATA.pages[9].teaching.lessons[1].paragraphs[2]`。

- [D055] [正文：听到一句话后，先确定它指的是哪个页面元素] 匹配结果分零个、一个、多个三种。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[1].paragraphs[2]`；`DATA.pages[9].teaching.lessons[1].paragraphs[2]`。

- [D056] [正文：听到一句话后，先确定它指的是哪个页面元素] 规则匹配而不是模型语义匹配，是可见即可说追求快和稳的取舍：页面操作要求对象确定，语义模型在车里可能把「换一首」和「下一首」解释出多个对象，规则比较可控、可回放、可统计；代价是用户必须说名册里有的说法，超出名册的表达就走开放域链路，不在这里硬猜。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[1].paragraphs[3]`；`DATA.pages[9].teaching.lessons[1].paragraphs[3]`。

- [D057] [正文：听到一句话后，先确定它指的是哪个页面元素] 一个候选直接交后续执行；多个候选先走消歧；一个候选都没有时，这句话回到正常有效 Query 链路继续判断，不能因为没匹配上页面就把用户诉求吞掉。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[1].paragraphs[3]`；`DATA.pages[9].teaching.lessons[1].paragraphs[3]`。

- [D058] [正文：听到一句话后，先确定它指的是哪个页面元素] 一个候选直接进入执行；多个候选先走 W06（多个控件命中时交注册业务消歧）。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[1].paragraphs[4]`；`DATA.pages[9].teaching.lessons[1].paragraphs[4]`。

- [D059] [正文：听到一句话后，先确定它指的是哪个页面元素] 字节匹配层不擅自挑第一个控件，而是把多个候选标识交回登记业务，由业务按自己掌握的界面信息选择，或按项目约定弹出选择让用户点选。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[1].paragraphs[4]`；`DATA.pages[9].teaching.lessons[1].paragraphs[4]`。

- [D060] [正文：听到一句话后，先确定它指的是哪个页面元素] 这里不存在「默认点第一个」这条规则，随机选第一个可能造成真实误操作。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[1].paragraphs[4]`；`DATA.pages[9].teaching.lessons[1].paragraphs[4]`。

- [D061] [正文：听到一句话后，先确定它指的是哪个页面元素] 多候选是否弹窗、弹窗长什么样，由项目合同确认，材料没有给所有车型约定统一形式。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[1].paragraphs[4]`；`DATA.pages[9].teaching.lessons[1].paragraphs[4]`。

- [D062] [正文：听到一句话后，先确定它指的是哪个页面元素] 先交回业务消歧而不是语音层排序，是因为业务掌握候选的位置、当前高亮状态和业务优先级，语音匹配层只知道文字相似程度，不知道哪个候选在视觉上离用户最近；把选择权交给业务，才能和用户手动点选的行为保持一致。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[1].paragraphs[5]`；`DATA.pages[9].teaching.lessons[1].paragraphs[5]`。

- [D063] [正文：听到一句话后，先确定它指的是哪个页面元素] 业务尚未确定目标时，语音层只能说还没选定，不能把「候选列表已返回」包装成「已经点好了」。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[1].paragraphs[5]`；`DATA.pages[9].teaching.lessons[1].paragraphs[5]`。

- [D064] [正文：同样是卡片，语音和点击可能走不同的执行链路] 不同卡片接入可见即可说的方式分四类，评审时要先分清属于哪一类。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[2].paragraphs[0]`；`DATA.pages[9].teaching.lessons[2].paragraphs[0]`。

- [D065] [正文：同样是卡片，语音和点击可能走不同的执行链路] 第一类是 Planner 链路推出的卡片：Query 经 Planner 推理并调用工具，结果由 Planner 汇总下发拉起卡片，语音由 Planner 自闭环，手动点击直接执行并作为特殊事件日志上报云端，这类卡片不注册可见即可说词条。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[2].paragraphs[0]`；`DATA.pages[9].teaching.lessons[2].paragraphs[0]`。

- [D066] [正文：同样是卡片，语音和点击可能走不同的执行链路] 第二类是静态 Advisor 主动服务卡片：Advisor 输出建议后由 Planner 继续下发拉起卡片，语音由 Planner 闭环；手动点击因为没有直接执行接口，需要模拟一个 Query 走到云端完成建议到工具的推理转换。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[2].paragraphs[1]`；`DATA.pages[9].teaching.lessons[2].paragraphs[1]`。

- [D067] [正文：同样是卡片，语音和点击可能走不同的执行链路] 第三类是系统通知拉起的增强版卡片：三方直接触达端侧出即时交互卡片，语音由 Planner 动态插入与卡片生命周期绑定的选择工具，用户说「确认、取消」后透传匹配并下发端侧执行指令、更新卡片状态，手动点击有执行接口可直接完成并通过事件日志上报。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[2].paragraphs[2]`；`DATA.pages[9].teaching.lessons[2].paragraphs[2]`。

- [D068] [正文：同样是卡片，语音和点击可能走不同的执行链路] 第四类是端侧自闭环的服务通知：不经过 Planner，端侧直接出卡、离线直接执行，语音靠可见即可说实现。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[2].paragraphs[2]`；`DATA.pages[9].teaching.lessons[2].paragraphs[2]`。

- [D069] [正文：同样是卡片，语音和点击可能走不同的执行链路] 接入方式不同，注册名册和执行回执的来源也就不同。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[2].paragraphs[2]`；`DATA.pages[9].teaching.lessons[2].paragraphs[2]`。

- [D070] [正文：同样是卡片，语音和点击可能走不同的执行链路] 桌面首页那个 AI Launcher，是可见即可说在首屏的具体落点。〔旧页含实现、范围或历史断言，需与原文核对〕
  - 位置：`DATA.pages[9].sections[2].paragraphs[3]`；`DATA.pages[9].teaching.lessons[2].paragraphs[3]`。

- [D071] [正文：同样是卡片，语音和点击可能走不同的执行链路] 按字段说明，它是豆包和用户最直接互动的桌面首页，包含引导语（身份问候、节假日、关系）、3 条常用指令（来自记忆和历史行为）、4 条场景推荐（按当前场景和乘客状态、每次上电变化）、场景任务卡、任务中心卡和七大技能。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[2].paragraphs[3]`；`DATA.pages[9].teaching.lessons[2].paragraphs[3]`。

- [D072] [正文：同样是卡片，语音和点击可能走不同的执行链路] 状态上它是 HAI 六个预研能力之一，Ultra 和 Standard 全量、Air 端侧砍掉只走正则。〔旧页含实现、范围或历史断言，需与原文核对〕
  - 位置：`DATA.pages[9].sections[2].paragraphs[3]`；`DATA.pages[9].teaching.lessons[2].paragraphs[3]`。

- [D073] [正文：同样是卡片，语音和点击可能走不同的执行链路] 发版记录里 11 月 4 日刚修了一个 bug：从 Launcher 经 skill 发起任务后，其他音区没法再和豆包对话。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[2].paragraphs[3]`；`DATA.pages[9].teaching.lessons[2].paragraphs[3]`。

- [D074] [正文：同样是卡片，语音和点击可能走不同的执行链路] [Launcher字段](https://bytedance.larkoffice.com/wiki/KPZswi5DwixOjvkfPaOcYtwYnDh)。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[2].paragraphs[3]`；`DATA.pages[9].teaching.lessons[2].paragraphs[3]`。

- [D075] [正文：同样是卡片，语音和点击可能走不同的执行链路] 按 OnePager 链路，可见即可说或简单车控在端侧本地命中时，可以由端侧直接召回、执行并生成回答，再把 Query、Answer、Observation 即用户提问、系统回答、执行观察结果，经历史同步上报；端侧未命中才进入云端正式链路。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[2].paragraphs[4]`；`DATA.pages[9].teaching.lessons[2].paragraphs[4]`。

- [D076] [正文：同样是卡片，语音和点击可能走不同的执行链路] 对速度和本地可用性要求强、安全相关的场景走这条本地闭环，不往云端 Planner 送；这和普通开放域问题需要云端推理是两条路径。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[2].paragraphs[4]`；`DATA.pages[9].teaching.lessons[2].paragraphs[4]`。

- [D077] [正文：同样是卡片，语音和点击可能走不同的执行链路] 本地链路输出 reject 拒识或 functioncall 函数调用时驱动状态机流转；本地输出 unsupported 不支持时持续处于思考态等待云端结果，不视作最终结果。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[2].paragraphs[5]`；`DATA.pages[9].teaching.lessons[2].paragraphs[5]`。

- [D078] [正文：同样是卡片，语音和点击可能走不同的执行链路] 赛力斯项目 9 月 30 日更新后，本地大模型输出的拒识和语义结果暂不采纳，状态机以云端为准。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[2].paragraphs[5]`；`DATA.pages[9].teaching.lessons[2].paragraphs[5]`。

- [D079] [正文：同样是卡片，语音和点击可能走不同的执行链路] 这条口径意味着本地闭环的边界在收缩，评审时不能拿早期「本地命中就直接办」的描述当成当前线上行为。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[2].paragraphs[5]`；`DATA.pages[9].teaching.lessons[2].paragraphs[5]`。

- [D080] [正文：同样是卡片，语音和点击可能走不同的执行链路] 任务中心页面及内部按钮暂不支持可见即可说，该结论经赛力斯任务中心外审确认；多条任务并排时说「第二个」指向不明。〔旧页含实现、范围或历史断言，需与原文核对〕
  - 位置：`DATA.pages[9].sections[2].paragraphs[6]`；`DATA.pages[9].teaching.lessons[2].paragraphs[6]`。

- [D081] [正文：同样是卡片，语音和点击可能走不同的执行链路] 可见即可说不是对全车所有页面的承诺，支持范围以按车型、版本维护的清单为准。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[2].paragraphs[6]`；`DATA.pages[9].teaching.lessons[2].paragraphs[6]`。

- [D082] [正文：同样是卡片，语音和点击可能走不同的执行链路] 任务中心不支持语音点屏是同一条规则，多个并排对象缺少唯一位置锚点时，语音层不做猜测。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[2].paragraphs[6]`；`DATA.pages[9].teaching.lessons[2].paragraphs[6]`。

- [D083] [正文：当前页面工具怎样把一句选择变成按钮操作] 目标唯一后还要确认它此刻仍然有效，旧标识不能跨页面继续使用。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[3].paragraphs[0]`；`DATA.pages[9].teaching.lessons[3].paragraphs[0]`。

- [D084] [正文：当前页面工具怎样把一句选择变成按钮操作] 匹配服务输出确定的目标标识，注册业务接收并对应当前控件。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[3].paragraphs[0]`；`DATA.pages[9].teaching.lessons[3].paragraphs[0]`。

- [D085] [正文：当前页面工具怎样把一句选择变成按钮操作] 交标识之前还有一道有效检查：从用户开口到这一刻，卡片可能已经退场、页面可能已经切换，旧标识不能跨页面继续使用；确认目标仍然有效，才进入执行。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[3].paragraphs[0]`；`DATA.pages[9].teaching.lessons[3].paragraphs[0]`。

- [D086] [正文：当前页面工具怎样把一句选择变成按钮操作] 这一步只是明确了执行对象，本身还没有点击。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[3].paragraphs[0]`；`DATA.pages[9].teaching.lessons[3].paragraphs[0]`。

- [D087] [正文：当前页面工具怎样把一句选择变成按钮操作] 有效检查要和名册注销联动：页面已经撤掉旧范围，旧标识在校验阶段就应当失效，不能带着过期标识进入执行入口。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[3].paragraphs[0]`；`DATA.pages[9].teaching.lessons[3].paragraphs[0]`。

- [D088] [正文：当前页面工具怎样把一句选择变成按钮操作] 手点和语音在记一个地点这件事上要对齐。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[3].paragraphs[1]`；`DATA.pages[9].teaching.lessons[3].paragraphs[1]`。

- [D089] [正文：当前页面工具怎样把一句选择变成按钮操作] 用户说把家记在某某路，如果只有路名没有精确 POI，系统不直接记一个模糊地名，而是先调 POI 搜索让用户在地图上点选确认再写记忆：单个门面小店结果唯一可以直接存，商场、小区这类重名地点必须选点。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[3].paragraphs[1]`；`DATA.pages[9].teaching.lessons[3].paragraphs[1]`。

- [D090] [正文：当前页面工具怎样把一句选择变成按钮操作] 这和可见即可说逻辑一致，能让用户看一眼确认的不靠语音猜。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[3].paragraphs[1]`；`DATA.pages[9].teaching.lessons[3].paragraphs[1]`。

- [D091] [正文：当前页面工具怎样把一句选择变成按钮操作] 当前覆盖约 8 个城市，跨城同名是已知 badcase，待和地图侧确认 POI 名称唯一性。〔旧页含实现、范围或历史断言，需与原文核对〕
  - 位置：`DATA.pages[9].sections[3].paragraphs[1]`；`DATA.pages[9].teaching.lessons[3].paragraphs[1]`。

- [D092] [正文：当前页面工具怎样把一句选择变成按钮操作] [记忆POI同步](https://bytedance.larkoffice.com/docx/LmWAdt04zof7ImxeSwkcSyBKnyS)。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[3].paragraphs[1]`；`DATA.pages[9].teaching.lessons[3].paragraphs[1]`。

- [D093] [正文：当前页面工具怎样把一句选择变成按钮操作] 随后由 W08（由控件所属业务完成实际点击）完成动作。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[3].paragraphs[2]`；`DATA.pages[9].teaching.lessons[3].paragraphs[2]`。

- [D094] [正文：当前页面工具怎样把一句选择变成按钮操作] 控件所属业务用本页面既有的点击执行能力触发对应界面变化或业务请求，字节匹配层交出标识并不等于已经替音乐业务播放了歌、替导航业务开始了路线；这里也不是 Director 获得了任意操作整块屏幕的权限，执行能力和责任都在控件所属业务一侧。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[3].paragraphs[2]`；`DATA.pages[9].teaching.lessons[3].paragraphs[2]`。

- [D095] [正文：当前页面工具怎样把一句选择变成按钮操作] 模拟点击时界面需要给出 UI 点击动效，让用户看到动作确实落在了哪个控件上。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[3].paragraphs[2]`；`DATA.pages[9].teaching.lessons[3].paragraphs[2]`。

- [D096] [正文：当前页面工具怎样把一句选择变成按钮操作] 框架定义的模拟操作包括点击、输入、滚动等类型，一期落地以按钮点击为主，输入和滚动能力按各业务接入进度开放。〔旧页含实现、范围或历史断言，需与原文核对〕
  - 位置：`DATA.pages[9].sections[3].paragraphs[3]`；`DATA.pages[9].teaching.lessons[3].paragraphs[3]`。

- [D097] [正文：当前页面工具怎样把一句选择变成按钮操作] 执行入口只接受名册内登记过的控件标识，语音层不能自行拼接坐标或遍历控件；这样即便匹配环节出现异常，动作也无法落到未授权元素上，形成一道执行侧的兜底约束。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[3].paragraphs[3]`；`DATA.pages[9].teaching.lessons[3].paragraphs[3]`。

- [D098] [正文：当前页面工具怎样把一句选择变成按钮操作] 执行失败由业务按系统提示方式呈现 toast 短提示，失败文字本身不朗读。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[3].paragraphs[3]`；`DATA.pages[9].teaching.lessons[3].paragraphs[3]`。

- [D099] [正文：当前页面工具怎样把一句选择变成按钮操作] 整条名册不会在一次点击后永久保留。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[3].paragraphs[4]`；`DATA.pages[9].teaching.lessons[3].paragraphs[4]`。

- [D100] [正文：当前页面工具怎样把一句选择变成按钮操作] W12（卡片退场和页面切换时更新可说范围）随页面或卡片变化维护注册范围：卡片进入可见和可操作状态时重新进入解析；卡片退场、切页、手动关闭、超时或被新卡片替换，都要撤掉旧范围、维护新页面词表。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[3].paragraphs[4]`；`DATA.pages[9].teaching.lessons[3].paragraphs[4]`。

- [D101] [正文：当前页面工具怎样把一句选择变成按钮操作] 旧控件不能跨界面继续被点中。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[3].paragraphs[4]`；`DATA.pages[9].teaching.lessons[3].paragraphs[4]`。

- [D102] [正文：当前页面工具怎样把一句选择变成按钮操作] 普通页面具体的失效接口仍需按正式实现确认。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[3].paragraphs[4]`；`DATA.pages[9].teaching.lessons[3].paragraphs[4]`。

- [D103] [正文：当前页面工具怎样把一句选择变成按钮操作] 名册随生命周期注销的必要性，和车机卡片的退出机制直接相关。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[3].paragraphs[5]`；`DATA.pages[9].teaching.lessons[3].paragraphs[5]`。

- [D104] [正文：当前页面工具怎样把一句选择变成按钮操作] 即时交互卡在 TTS 播报完毕后默认延迟十秒退出，视频正在播放、图片正在加载、用户手动点滑卡片时退出计时顺延；用户上滑语音胶囊也会关闭卡片。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[3].paragraphs[5]`；`DATA.pages[9].teaching.lessons[3].paragraphs[5]`。

- [D105] [正文：当前页面工具怎样把一句选择变成按钮操作] 卡片一旦退出，旧按钮词就必须从识别名册撤下，否则用户回到其他页面再说旧按钮名，系统仍可能匹配到已经不存在的控件。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[3].paragraphs[5]`；`DATA.pages[9].teaching.lessons[3].paragraphs[5]`。

- [D106] [正文：当前页面工具怎样把一句选择变成按钮操作] 名册更新要区分进入和退出两个方向：新卡片可见时重新解析并注册新词，旧卡片退场时先注销旧词再注册新词，避免新旧名册短暂并存造成同名冲突。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[3].paragraphs[5]`；`DATA.pages[9].teaching.lessons[3].paragraphs[5]`。

- [D107] [正文：当前页面工具怎样把一句选择变成按钮操作] 读懂这个循环，才能解释用户那句「刚才明明还能点，现在怎么不行了」：先看页面在不在、名册更新了没有，不要一上来判断语音退化。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[3].paragraphs[6]`；`DATA.pages[9].teaching.lessons[3].paragraphs[6]`。

- [D108] [正文：当前页面工具怎样把一句选择变成按钮操作] 普通页面没有统一的卡片生命周期事件，失效接口按各页面实现对接。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[3].paragraphs[6]`；`DATA.pages[9].teaching.lessons[3].paragraphs[6]`。

- [D109] [正文：当前页面工具怎样把一句选择变成按钮操作] 音区与请求编号留痕已落地：谁从哪个座位说的、本次请求编号随注册保留，事后可以回溯说话期间卡片是否发生变更，定位误点时先查这条留痕。〔旧页含实现、范围或历史断言，需与原文核对〕
  - 位置：`DATA.pages[9].sections[3].paragraphs[6]`；`DATA.pages[9].teaching.lessons[3].paragraphs[6]`。

- [D110] [正文：操作结果回来以后，用户才知道这一句有没有办成] 模拟点击发出后，业务内部还可能校验失败、接口超时、控件状态不允许操作，语音层不能在点击请求发出时就说搞定了。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[4].paragraphs[0]`；`DATA.pages[9].teaching.lessons[4].paragraphs[0]`。

- [D111] [正文：操作结果回来以后，用户才知道这一句有没有办成] 点下去不是结束，而是等回执的开始。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[4].paragraphs[0]`；`DATA.pages[9].teaching.lessons[4].paragraphs[0]`。

- [D112] [正文：操作结果回来以后，用户才知道这一句有没有办成] W09（把实际操作结果和可播内容交回）把成功、失败、未完成分开带回，并附上适合统一播报的内容。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[4].paragraphs[0]`；`DATA.pages[9].teaching.lessons[4].paragraphs[0]`。

- [D113] [正文：操作结果回来以后，用户才知道这一句有没有办成] 拿到回执才能分清三段责任：字听错了归识别，匹配错对象归匹配，执行没成归业务。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[4].paragraphs[0]`；`DATA.pages[9].teaching.lessons[4].paragraphs[0]`。

- [D114] [正文：操作结果回来以后，用户才知道这一句有没有办成] 匹配成功不能代替执行回执，业务返回之前不能提前说已经办好。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[4].paragraphs[0]`；`DATA.pages[9].teaching.lessons[4].paragraphs[0]`。

- [D115] [正文：操作结果回来以后，用户才知道这一句有没有办成] 框架规定成功播报「好的、搞定了」一类话术，失败播报「抱歉，没执行成功」一类话术，执行结果成功、失败以及需要播报的内容统一传给豆包，由豆包选择播报；失败时界面按系统提示方式呈现 toast 文字，失败文字本身不朗读。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[4].paragraphs[1]`；`DATA.pages[9].teaching.lessons[4].paragraphs[1]`。

- [D116] [正文：操作结果回来以后，用户才知道这一句有没有办成] 失败反馈不逐字念已落地：失败提示是屏幕上的短提示，系统不机械朗读失败文字；播报是否成功以 W09 回执为准，界面显示成功也不能盖过业务实际失败。〔旧页含实现、范围或历史断言，需与原文核对〕
  - 位置：`DATA.pages[9].sections[4].paragraphs[1]`；`DATA.pages[9].teaching.lessons[4].paragraphs[1]`。

- [D117] [正文：操作结果回来以后，用户才知道这一句有没有办成] 回执之后两条线并行。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[4].paragraphs[2]`；`DATA.pages[9].teaching.lessons[4].paragraphs[2]`。

- [D118] [正文：操作结果回来以后，用户才知道这一句有没有办成] 一条到 W10（统一播报并呈现相应界面反馈），真实结果和可播内容交给统一播报链路选择语音合成路线；页面仍按自己的规则显示成功变化或失败提示。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[4].paragraphs[2]`；`DATA.pages[9].teaching.lessons[4].paragraphs[2]`。

- [D119] [正文：操作结果回来以后，用户才知道这一句有没有办成] 语音反馈和视觉反馈分开收口，是因为不同业务界面的成功动效、失败样式由业务维护，语音话术由统一播报保证一致，两边各自更新自己的状态。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[4].paragraphs[2]`；`DATA.pages[9].teaching.lessons[4].paragraphs[2]`。

- [D120] [正文：操作结果回来以后，用户才知道这一句有没有办成] 另一条线是把这次点击写进历史，即 W11（记录这次模拟点击供下一轮承接）。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[4].paragraphs[3]`；`DATA.pages[9].teaching.lessons[4].paragraphs[3]`。

- [D121] [正文：操作结果回来以后，用户才知道这一句有没有办成] 它把这次点击作为已发生事件写进对话历史，注明来源是模拟点击，保留用户原话、目标对象和真实结果，再交给上下文模块衔接最近对话、工具事实和摘要。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[4].paragraphs[3]`；`DATA.pages[9].teaching.lessons[4].paragraphs[3]`。

- [D122] [正文：操作结果回来以后，用户才知道这一句有没有办成] 如果历史里只有一句「第二个」或一句成功话术，下一轮用户说「返回」「再选」时就接不上对象；如果不标注模拟点击来源，模型还可能误认为这是自己通过普通问答或函数调用完成的动作。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[4].paragraphs[3]`；`DATA.pages[9].teaching.lessons[4].paragraphs[3]`。

- [D123] [正文：操作结果回来以后，用户才知道这一句有没有办成] 历史记录需要同时保留三层信息：用户原始语音文本、名册匹配到的控件名称和标识、业务回执里的真实结果；缺了原始原话，模型无法理解「第二个」指的是哪一批候选，缺了控件对象，下一轮「返回」「再选」就没有承接锚点，缺了真实结果，后续问答可能基于一次失败操作继续推演。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[4].paragraphs[4]`；`DATA.pages[9].teaching.lessons[4].paragraphs[4]`。

- [D124] [正文：操作结果回来以后，用户才知道这一句有没有办成] 上下文模块读取这段历史时，按最近对话、工具事实和摘要的顺序衔接，模拟点击事件和普通工具调用事件在格式上区分来源标记。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[4].paragraphs[4]`；`DATA.pages[9].teaching.lessons[4].paragraphs[4]`。

- [D125] [正文：操作结果回来以后，用户才知道这一句有没有办成] 零匹配之后回到普通语音入口，才进入开放域拒识判断，这是 2.6 目标。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[4].paragraphs[5]`；`DATA.pages[9].teaching.lessons[4].paragraphs[5]`。

- [D126] [正文：操作结果回来以后，用户才知道这一句有没有办成] 它只在沉浸模式关闭时生效，沉浸模式开启时语音助手持续聆听、不做文本拒识。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[4].paragraphs[5]`；`DATA.pages[9].teaching.lessons[4].paragraphs[5]`。

- [D127] [正文：操作结果回来以后，用户才知道这一句有没有办成] 意图清单按提问、陈述、命令指示、社交用语分组；画板登记为 22 个三级意图，拒识需求文档表格实际列出 17 个三级意图，清单数量与版本以拒识需求文档为准。〔旧页含实现、范围或历史断言，需与原文核对〕
  - 位置：`DATA.pages[9].sections[4].paragraphs[5]`；`DATA.pages[9].teaching.lessons[4].paragraphs[5]`。

- [D128] [正文：操作结果回来以后，用户才知道这一句有没有办成] 拒识还有两条回捞规则：语句前面或最后出现配置的唤醒词名称及泛化称呼时直接召回；被拒识后在限定时间内继续说出唤醒词，或表达纠错意图，系统召回上一轮 Query。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[4].paragraphs[5]`；`DATA.pages[9].teaching.lessons[4].paragraphs[5]`。

- [D129] [正文：操作结果回来以后，用户才知道这一句有没有办成] 框架文档 3 月版本列出过一套优先级：P0 用户自定义任务、P1 可见即可说、P2 常见问题、P3 端侧大模型、P4 云端大模型。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[4].paragraphs[6]`；`DATA.pages[9].teaching.lessons[4].paragraphs[6]`。

- [D130] [正文：操作结果回来以后，用户才知道这一句有没有办成] 这是当时的框架划分，不覆盖 9 月之后的本地兜底改版；生效车型和版本要分列，不能把它画成所有请求必经的漏斗，当前端云采信顺序以端云仲裁章节为准。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[4].paragraphs[6]`；`DATA.pages[9].teaching.lessons[4].paragraphs[6]`。

- [D131] [正文：操作结果回来以后，用户才知道这一句有没有办成] 可见即可说排在 P1，是因为它面向界面文字、只做简单表达、不做推理，追求少推理快响应；这个定位也解释了为什么它不承担开放域理解。〔旧页陈述〕
  - 位置：`DATA.pages[9].sections[4].paragraphs[6]`；`DATA.pages[9].teaching.lessons[4].paragraphs[6]`。

- [D132] [教学正文与读图] 餐厅候选卡片还停在屏幕上，两家店各带一个「导航」按钮。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.intro[0]`。

- [D133] [教学正文与读图] 主驾补一句「第二个」，副驾直接说「导航」。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.intro[0]`。

- [D134] [教学正文与读图] 这两句话单独听都没有对象，全靠眼前这张卡片给它们指向。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.intro[0]`。

- [D135] [教学正文与读图] 用户不用背固定指令、不用提前配置命令，屏幕上显示什么，说什么就能操作。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.intro[0]`。

- [D136] [教学正文与读图] 这一站讲可见即可说：用户指着屏幕说的话，怎样被听懂、匹配到已经登记的对象、真的点下去，结果又怎样回到下一轮对话。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.intro[1]`。

- [D137] [教学正文与读图] 它不是让视觉模型看图猜按钮长什么样，也不是给模型一个随意操作整块屏幕的权限。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.intro[1]`。

- [D138] [教学正文与读图] 只有业务主动登记进名册的元素才支持语音点击，没登记的元素系统不会假装支持。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.intro[1]`。

- [D139] [教学正文与读图] 按一次点击真实经过的顺序看，这一段有两条并行支路。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.intro[2]`。

- [D140] [教学正文与读图] 一条往名册走：页面解析控件、注册名称和控件标识、把有效词注入识别热词。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.intro[2]`。

- [D141] [教学正文与读图] 另一条往匹配走：等最终文字定稿、按规则在名册里找候选、多候选交回业务消歧。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.intro[2]`。

- [D142] [教学正文与读图] 两条路在「目标唯一」这一格汇合，再由业务执行模拟点击、等真实回执、写进历史。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.intro[2]`。

- [D143] [教学正文与读图] 这张图按一次语音点击的生命周期排，不是按模块排。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.guides.base.paragraphs[0]`。

- [D144] [教学正文与读图] 左侧是页面进入和名册建立：页面业务解析控件、注册名称和标识、把有效词注入识别热词；中间是文字定稿后的规则匹配，一个候选直接执行、多候选交回业务消歧；右侧是执行、回执和历史写入。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.guides.base.paragraphs[0]`。

- [D145] [教学正文与读图] 读图先找那个分叉点：从 W05（按约定文字规则找候选控件）出来，按匹配结果数量分成零个、一个、多个三条路，三条路在「目标唯一」那一格重新合上。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.guides.base.paragraphs[0]`。

- [D146] [教学正文与读图] 最上面的入口是页面业务解析控件。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.guides.base.paragraphs[1]`。

- [D147] [教学正文与读图] W01（由页面业务整理当前可以操作的控件）只针对最顶层页面，弹窗、覆盖层和后台页面不参与。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.guides.base.paragraphs[1]`。

- [D148] [教学正文与读图] 解析结果进 W02（把可说名称与唯一控件标识绑定），按钮显示文本做核心指令，同名控件补位置描述，泛化前缀和语气词按框架配置放开。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.guides.base.paragraphs[1]`。

- [D149] [教学正文与读图] 单页注册词不超过 500 个是框架需求上限，不是实测吞吐。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.guides.base.paragraphs[1]`。

- [D150] [教学正文与读图] 注册好的有效词进 W03（把当前有效按钮词送入语音识别），同时注入在线和离线识别。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.guides.base.paragraphs[2]`。

- [D151] [教学正文与读图] 唤醒后离在线并行，离线先出结果先走离线；免唤醒走纯离线。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.guides.base.paragraphs[2]`。

- [D152] [教学正文与读图] 页面词表随卡片进入和退场同步增删，这一步只保证词被送进识别链路，不保证用户这句话一定命中按钮。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.guides.base.paragraphs[2]`。

- [D153] [教学正文与读图] 热词注入成功提高识别概率，和最终是否点对按钮是两件事。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.guides.base.paragraphs[2]`。

- [D154] [教学正文与读图] 用户说完后进 W04（最终文字到来后匹配本次有效界面）。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.guides.base.paragraphs[3]`。

- [D155] [教学正文与读图] 必须等文字定稿，过程文字不能直接拿去模拟点击；同时绑定页面快照，保证匹配用的名册和用户看到的界面是同一版。〔旧页含实现、范围或历史断言，需与原文核对〕
  - 位置：`DATA.pages[9].teaching.guides.base.paragraphs[3]`。

- [D156] [教学正文与读图] 动态卡片的可选项只在当前卡片名册里有效，不能当成永久本地缓存。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.guides.base.paragraphs[3]`。

- [D157] [教学正文与读图] 这一格是快路和普通链路的分水岭：匹配上了走快路，零候选回到普通语音入口。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.guides.base.paragraphs[3]`。

- [D158] [教学正文与读图] 定稿文字进 W05（按约定文字规则找候选控件）。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.guides.base.paragraphs[4]`。

- [D159] [教学正文与读图] 精确匹配直接比对识别文本和核心指令；模糊匹配接受点击类前缀和句尾语气词；局部匹配要求 6 个以上词时连续匹配 4 个字以上。〔旧页含实现、范围或历史断言，需与原文核对〕
  - 位置：`DATA.pages[9].teaching.guides.base.paragraphs[4]`。

- [D160] [教学正文与读图] 结果分零个、一个、多个：一个直接执行，多个进 W06（多个控件命中时交注册业务消歧），零个回到开放域拒识。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.guides.base.paragraphs[4]`。

- [D161] [教学正文与读图] 这里不存在「默认点第一个」，多候选必须交回业务或弹窗让用户选。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.guides.base.paragraphs[4]`。

- [D162] [教学正文与读图] 目标唯一后还要过有效检查：卡片可能已退场、页面可能已切换，旧标识不能跨页面使用。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.guides.base.paragraphs[5]`。

- [D163] [教学正文与读图] 确认有效才进 W08（由控件所属业务完成实际点击）。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.guides.base.paragraphs[5]`。

- [D164] [教学正文与读图] 字节匹配层交出标识不等于已经替业务执行，执行能力和责任都在控件所属业务一侧。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.guides.base.paragraphs[5]`。

- [D165] [教学正文与读图] 执行入口只接受名册内登记过的标识，语音层不能自行拼接坐标或遍历控件，这是执行侧的兜底约束。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.guides.base.paragraphs[5]`。

- [D166] [教学正文与读图] 点击之后等 W09（把实际操作结果和可播内容交回）。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.guides.base.paragraphs[6]`。

- [D167] [教学正文与读图] 成功、失败、未完成分开带回，业务返回之前不能提前说搞定了。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.guides.base.paragraphs[6]`。

- [D168] [教学正文与读图] 回执分两条线：W10（统一播报并呈现相应界面反馈）走语音和视觉各自收口；W11（记录这次模拟点击供下一轮承接）把用户原话、控件名称和真实结果写进历史，标注模拟点击来源。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.guides.base.paragraphs[6]`。

- [D169] [教学正文与读图] 名册随卡片退场在 W12（卡片退场和页面切换时更新可说范围）注销。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.guides.base.paragraphs[6]`。

- [D170] [教学正文与读图] 排查时还要把耗时分段看：从用户开口到最终文字定稿、从定稿到匹配出唯一候选、从匹配成功到业务回执回来，各算各的。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.guides.base.paragraphs[7]`。

- [D171] [教学正文与读图] 混在一起看不出该找识别、匹配还是执行。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.guides.base.paragraphs[7]`。

- [D172] [教学正文与读图] 多候选误执行率、过期控件执行率、零候选被吞掉这三项要分别统计，不能用一个端到端完成率盖住差别。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.guides.base.paragraphs[7]`。

- [D173] [教学正文与读图] 卡片超时、关闭、替换和切页场景要单独覆盖，验证旧名册注销、旧标识不再执行。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.guides.base.paragraphs[7]`。

- [D174] [教学正文与读图] 这一章定义的是屏幕上已登记对象怎样被语音点击并回执，不定义开放域理解怎样拒识、端侧怎样本地兜底。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.closing[0]`。

- [D175] [教学正文与读图] 评审时盯三条：旧名册有没有在卡片退场时及时注销、多候选有没有真的交回业务而不是默认点第一个、执行回执有没有在业务返回前不提前播报成功。〔旧页陈述〕
  - 位置：`DATA.pages[9].teaching.closing[1]`。

- [D176] [原始全图节点] 由页面业务整理当前可以操作的控件〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[0].title`。

- [D177] [原始全图节点 W01] 读取当前最上层可交互界面〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[0].lines[0]`。

- [D178] [原始全图节点 W01] 提取按钮文字与对应控件〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[0].lines[1]`。

- [D179] [原始全图节点 W01] 只注册实际允许操作的对象〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[0].lines[2]`。

- [D180] [原始全图节点 W01] 可见即可说从页面准备开始。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[0].paragraphs[0]`。

- [D181] [原始全图节点 W01] 车企或所属业务读取当前界面，把真正能够操作的控件及显示文字整理出来，例如设置页的座椅加热按钮。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[0].paragraphs[0]`。

- [D182] [原始全图节点 W01] 装饰说明文字不能因为看得见就全部变成可点击目标。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[0].paragraphs[0]`。

- [D183] [原始全图节点 W01] 随后这些控件交给注册与匹配能力，用户说出名称时才能找到具体对象。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[0].paragraphs[1]`。

- [D184] [原始全图节点 W01] 此路径使用业务提供的控件信息，没有要求视觉模型先看截图再猜按钮。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[0].paragraphs[1]`。

- [D185] [原始全图节点 W01] 最终实际点击也仍由控件所属业务完成。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[0].paragraphs[1]`。

- [D186] [原始全图节点] 把可说名称与唯一控件标识绑定〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[1].title`。

- [D187] [原始全图节点 W02] 绑定显示文字、泛化词和控件 ID〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[1].lines[0]`。

- [D188] [原始全图节点 W02] 注册范围对应当前页面或卡片〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[1].lines[1]`。

- [D189] [原始全图节点 W02] 本框架每页上限为 500 个词〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[1].lines[2]`。

- [D190] [原始全图节点 W02] 同名按钮也要保留不同身份〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[1].lines[3]`。

- [D191] [原始全图节点 W02] 业务把显示文字、允许的说法和唯一控件 ID 交给框架，形成可说名称与实际对象的对应表。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[1].paragraphs[0]`。

- [D192] [原始全图节点 W02] 同一页面有两个“播放”按钮时，也保留各自身份，后续才能确定用户指的是哪一个。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[1].paragraphs[0]`。

- [D193] [原始全图节点 W02] 该可见即可说方案每页最多注册 500 个词，计算的是词条。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[1].paragraphs[1]`。

- [D194] [原始全图节点 W02] 当前页面词表进入识别热词后，最终识别文字再与这张对应表匹配，得到候选控件；框架接着检查控件是否仍有效，再交页面业务执行。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[1].paragraphs[1]`。

- [D195] [原始全图节点 W02] 页面切换后，旧页面的词表和控件关系随之注销。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[1].paragraphs[1]`。

- [D196] [原始全图节点] 把当前有效按钮词送入语音识别〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[2].title`。

- [D197] [原始全图节点 W03] 有效注册词进入识别热词〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[2].lines[0]`。

- [D198] [原始全图节点 W03] 随页面和卡片变化更新范围〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[2].lines[1]`。

- [D199] [原始全图节点 W03] 热词帮助听清而不直接点击〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[2].lines[2]`。

- [D200] [原始全图节点 W03] 注册好的按钮名称可以加入在线和离线识别热词，帮助 ASR 听清当前页面中的特殊名称。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[2].paragraphs[0]`。

- [D201] [原始全图节点 W03] 比如歌曲卡片上有一个生僻曲名，这份词表能提供识别线索，但必须实际进入当前请求才发挥作用。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[2].paragraphs[0]`。

- [D202] [原始全图节点 W03] 识别听对之后还要匹配控件并执行，不能让热词自己产生点击。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[2].paragraphs[1]`。

- [D203] [原始全图节点 W03] 页面切换时要同步维护有效词范围，避免旧按钮继续干扰新页面；失效处理应与控件注册生命周期一致，而不能只更新画面不更新语音侧对象。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[2].paragraphs[1]`。

- [D204] [原始全图节点] 最终文字到来后匹配本次有效界面〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[3].title`。

- [D205] [原始全图节点 W04] 接收 final 及请求与音区信息〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[3].lines[0]`。

- [D206] [原始全图节点 W04] 使用当前页面和卡片上下文〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[3].lines[1]`。

- [D207] [原始全图节点 W04] 过程文字不提前模拟点击〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[3].lines[2]`。

- [D208] [原始全图节点 W04] 序号选择必须对应真实当前列表〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[3].lines[3]`。

- [D209] [原始全图节点 W04] 用户说按钮名称时，先经过正常语音识别，最终文字到来后才与本次有效界面注册内容匹配。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[3].paragraphs[0]`。

- [D210] [原始全图节点 W04] 过程文字仍可能改字，因此不能只听到半个按钮名就提前点击。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[3].paragraphs[0]`。

- [D211] [原始全图节点 W04] 注册指令集同时作为在线和离线 ASR 的动态热词；免唤醒时走纯离线，唤醒后离在线并行，离线有结果执行离线，离线无结果再等待在线。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[3].paragraphs[1]`。

- [D212] [原始全图节点 W04] 需要更强语义理解的即时卡片操作，另走动态工具路径，不在本节点的按钮注册范围内。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[3].paragraphs[1]`。

- [D213] [原始全图节点] 按约定文字规则找候选控件〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[4].title`。

- [D214] [原始全图节点 W05] 进行全文、局部或模糊匹配〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[4].lines[0]`。

- [D215] [原始全图节点 W05] 结果可能零个、一个或多个〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[4].lines[1]`。

- [D216] [原始全图节点 W05] 无匹配回普通请求入口〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[4].lines[2]`。

- [D217] [原始全图节点 W05] 候选仍需核对对象有效性〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[4].lines[3]`。

- [D218] [原始全图节点 W05] 匹配服务拿最终文字与当前页面注册词比较。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[4].paragraphs[0]`。

- [D219] [原始全图节点 W05] 直接说按钮名称走精确匹配；模糊匹配允许前面加“点击”“点一下”“帮我选”“选择”等前缀，句末可以带“吧”“啦”等语气词。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[4].paragraphs[0]`。

- [D220] [原始全图节点 W05] 局部匹配还受原框架的长度与连续匹配规则约束，不能把表达相近直接当作语义理解成功。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[4].paragraphs[0]`。

- [D221] [原始全图节点 W05] 没有候选时，用户仍可能在问问题或提出车控需求，应回普通入口继续处理。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[4].paragraphs[1]`。

- [D222] [原始全图节点 W05] 一个候选还要确认控件有效，多个候选则交注册业务选择或消歧。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[4].paragraphs[1]`。

- [D223] [原始全图节点 W05] 这里产出的是候选关系，尚未证明任何按钮已经被执行。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[4].paragraphs[1]`。

- [D224] [原始全图节点] 多个控件命中时交注册业务消歧〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[5].title`。

- [D225] [原始全图节点 W06] 保留全部候选控件 ID〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[5].lines[0]`。

- [D226] [原始全图节点 W06] 注册业务结合界面处理选择〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[5].lines[1]`。

- [D227] [原始全图节点 W06] 不默认点击第一个候选〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[5].lines[2]`。

- [D228] [原始全图节点 W06] 目标未明确前不报操作成功〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[5].lines[3]`。

- [D229] [原始全图节点 W06] 页面上有两个同名播放按钮时，识别与文字匹配可能都正确，却仍无法知道用户要哪个。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[5].paragraphs[0]`。

- [D230] [原始全图节点 W06] 框架把全部候选 ID 交还注册业务，由它结合当前界面关系处理选择或必要消歧。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[5].paragraphs[0]`。

- [D231] [原始全图节点 W06] 具体怎样询问或展示选择，应采用当前业务已定义的交互，不能默认随机点击或总选第一个。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[5].paragraphs[1]`。

- [D232] [原始全图节点 W06] 消歧后得到确定目标，才继续交执行入口。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[5].paragraphs[1]`。

- [D233] [原始全图节点 W06] 候选列表返回成功只完成了找对象这一步，不能直接告诉用户音乐已播放。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[5].paragraphs[1]`。

- [D234] [原始全图节点] 把确定目标交回所属业务执行入口〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[6].title`。

- [D235] [原始全图节点 W07] 交付已确定的控件 ID〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[6].lines[0]`。

- [D236] [原始全图节点 W07] 映射当前页面的实际对象〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[6].lines[1]`。

- [D237] [原始全图节点 W07] 再次核卡片和控件是否有效〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[6].lines[2]`。

- [D238] [原始全图节点 W07] 确定对象之后才开始操作〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[6].lines[3]`。

- [D239] [原始全图节点 W07] 匹配或消歧得到确定控件后，服务把 ID 交回当初注册它的业务，由业务映射到实际交互对象。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[6].paragraphs[0]`。

- [D240] [原始全图节点 W07] 例如音乐卡片的播放按钮，应回到对应音乐业务处理。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[6].paragraphs[0]`。

- [D241] [原始全图节点 W07] 用户说话期间可能已经切页，卡片也可能超时退场，因此交付时必须核当前对象仍有效。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[6].paragraphs[1]`。

- [D242] [原始全图节点 W07] 这里明确了执行目标，下一步才会模拟点击。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[6].paragraphs[1]`。

- [D243] [原始全图节点 W07] 不能把注册、匹配或收到 ID 这些中间成功，提前算成用户要求已经完成。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[6].paragraphs[1]`。

- [D244] [原始全图节点] 由控件所属业务完成实际点击〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[7].title`。

- [D245] [原始全图节点 W08] 使用页面已有交互能力操作〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[7].lines[0]`。

- [D246] [原始全图节点 W08] 触发真实界面变化或业务请求〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[7].lines[1]`。

- [D247] [原始全图节点 W08] 异常由执行方返回具体原因〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[7].lines[2]`。

- [D248] [原始全图节点 W08] 点击动画不替代业务结果〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[7].lines[3]`。

- [D249] [原始全图节点 W08] 业务方收到有效控件 ID 后，使用页面已有的点击能力执行操作。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[7].paragraphs[0]`。

- [D250] [原始全图节点 W08] 点击音乐卡片播放按钮，应真正触发播放器或后续业务请求，不能只在语音层显示一个已点击标记。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[7].paragraphs[0]`。

- [D251] [原始全图节点 W08] 执行还可能遇到页面过期、权限不足或服务失败，需要由这一层返回真实原因。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[7].paragraphs[1]`。

- [D252] [原始全图节点 W08] 点击动画能帮助用户知道系统在响应，但音乐有没有播出仍要看业务状态。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[7].paragraphs[1]`。

- [D253] [原始全图节点 W08] 操作完成到什么程度，继续通过 W09 回传。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[7].paragraphs[1]`。

- [D254] [原始全图节点] 把实际操作结果和可播内容交回〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[8].title`。

- [D255] [原始全图节点 W09] 返回点击及业务真实状态〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[8].lines[0]`。

- [D256] [原始全图节点 W09] 成功、失败与未完成分开〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[8].lines[1]`。

- [D257] [原始全图节点 W09] 附上适合统一播报的内容〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[8].lines[2]`。

- [D258] [原始全图节点 W09] 多项操作保留各自结果〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[8].lines[3]`。

- [D259] [原始全图节点 W09] 页面业务执行后，把成功、失败和需要播报的内容交回助手。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[8].paragraphs[0]`。

- [D260] [原始全图节点 W09] 前面的识别、匹配、控件接收即使都成功，服务不可用或目标过期也可能导致最终操作失败，因此需要等这一层的事实。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[8].paragraphs[0]`。

- [D261] [原始全图节点 W09] 如果一次操作涉及多项结果，应保留各自完成与失败，不能用一句成功覆盖全部。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[8].paragraphs[1]`。

- [D262] [原始全图节点 W09] 结果与需要播报的内容交豆包统一处理：框架提供简短失败话术，同时要求系统 Toast 的详细失败文案不机械逐字播报。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[8].paragraphs[1]`。

- [D263] [原始全图节点 W09] 接下来由统一输出链分别处理声音和界面。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[8].paragraphs[1]`。

- [D264] [原始全图节点] 统一播报并呈现相应界面反馈〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[9].title`。

- [D265] [原始全图节点 W10] 可播内容交统一声音服务〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[9].lines[0]`。

- [D266] [原始全图节点 W10] 界面呈现点击或业务结果〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[9].lines[1]`。

- [D267] [原始全图节点 W10] 失败原因转为可理解的话术〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[9].lines[2]`。

- [D268] [原始全图节点 W10] 操作结果与播放进度分别保留〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[9].lines[3]`。

- [D269] [原始全图节点 W10] 页面业务返回可播内容后，交豆包统一合成与播放；界面同时按业务结果展示点击动效、成功状态或失败提示。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[9].paragraphs[0]`。

- [D270] [原始全图节点 W10] 失败原因需要转成用户能理解的话，例如说明当前按钮已失效，而不是把接口错误直接念出来。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[9].paragraphs[0]`。

- [D271] [原始全图节点 W10] 音频已经生成时，电话等高优声音仍可能抢占播放。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[9].paragraphs[1]`。

- [D272] [原始全图节点 W10] 页面操作的执行结果、界面状态和声音播放各自更新，下一轮对话因此能知道“操作已经成功，但确认声音没有播完”，无需再次点击同一个按钮。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[9].paragraphs[1]`。

- [D273] [原始全图节点] 记录这次模拟点击供下一轮承接〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[10].title`。

- [D274] [原始全图节点 W11] 历史注明来自模拟点击〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[10].lines[0]`。

- [D275] [原始全图节点 W11] 保留原话、目标与真实结果〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[10].lines[1]`。

- [D276] [原始全图节点 W11] 成功和失败都按事实同步〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[10].lines[2]`。

- [D277] [原始全图节点 W11] 后续引用才能对应实际选择〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[10].lines[3]`。

- [D278] [原始全图节点 W11] 可见即可说完成后，需要把交互写进历史，注明来自模拟点击，并保留用户原话、目标对象和真实结果。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[10].paragraphs[0]`。

- [D279] [原始全图节点 W11] 这样云端后续不会误以为它是自己生成的一次普通问答或车控。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[10].paragraphs[0]`。

- [D280] [原始全图节点 W11] 例如用户选了卡片第二家餐厅，下一句“就去这里”需要对应刚才真正选中的地点。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[10].paragraphs[1]`。

- [D281] [原始全图节点 W11] 若点击失败，也必须保存失败，不能只记录拟选对象。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[10].paragraphs[1]`。

- [D282] [原始全图节点 W11] 历史已接收与实际点击成功仍是两个结果，都应对回原请求。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[10].paragraphs[1]`。

- [D283] [原始全图节点] 卡片退场和页面切换时更新可说范围〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[11].title`。

- [D284] [原始全图节点 W12] 卡片出现时注册动态选项〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[11].lines[0]`。

- [D285] [原始全图节点 W12] 卡片消失时删除对应选择器〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[11].lines[1]`。

- [D286] [原始全图节点 W12] 页面更新有效控件及热词〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[11].lines[2]`。

- [D287] [原始全图节点 W12] 旧 ID 不得跨界面继续执行〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[11].lines[3]`。

- [D288] [原始全图节点 W12] 动态卡片出现时注册选择器，让用户可以说当前选项；卡片消失时需要删除对应选择器。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[11].paragraphs[0]`。

- [D289] [原始全图节点 W12] 否则用户早已离开旧卡片，一句“第二个”仍可能误点以前的内容。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[11].paragraphs[0]`。

- [D290] [原始全图节点 W12] 普通页面也要维护当前可操作范围，切页、手动关闭、超时和新卡替换都可能改变有效对象。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[11].paragraphs[1]`。

- [D291] [原始全图节点 W12] 控件更新还要带动相关热词范围变化。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[11].paragraphs[1]`。

- [D292] [原始全图节点 W12] 具体注销接口按框架执行，但最终应保证旧 ID 无法在无关新页面上继续操作。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].nodes[11].paragraphs[1]`。

- [D293] [原始全图连线] W01 → W02：解析出当前可交互元素〔旧页陈述〕
  - 位置：`DATA.base.modules[3].edges[0]`。

- [D294] [原始全图连线] W02 → W03：注册词提供给 ASR 热词〔旧页陈述〕
  - 位置：`DATA.base.modules[3].edges[1]`。

- [D295] [原始全图连线] W03 → W04：语音识别完成，返回 final〔旧页陈述〕
  - 位置：`DATA.base.modules[3].edges[2]`。

- [D296] [原始全图连线] W04 → W05：最终文字与有效注册表匹配〔旧页陈述〕
  - 位置：`DATA.base.modules[3].edges[3]`。

- [D297] [原始全图连线] W05 → W06：多个候选：交业务方处理〔旧页陈述〕
  - 位置：`DATA.base.modules[3].edges[4]`。

- [D298] [原始全图连线] W05 → W07：单一明确匹配：交目标 ID〔旧页陈述〕
  - 位置：`DATA.base.modules[3].edges[5]`。

- [D299] [原始全图连线] W06 → W07：业务完成目标选择/消歧〔旧页陈述〕
  - 位置：`DATA.base.modules[3].edges[6]`。

- [D300] [原始全图连线] W07 → W08：目标仍有效：执行业务点击〔旧页陈述〕
  - 位置：`DATA.base.modules[3].edges[7]`。

- [D301] [原始全图连线] W08 → W09：等待实际执行结果〔旧页陈述〕
  - 位置：`DATA.base.modules[3].edges[8]`。

- [D302] [原始全图连线] W09 → W10：结果与播报内容统一反馈〔旧页陈述〕
  - 位置：`DATA.base.modules[3].edges[9]`。

- [D303] [原始全图连线] W09 → W11：真实结果标注模拟点击来源〔旧页陈述〕
  - 位置：`DATA.base.modules[3].edges[10]`。

- [D304] [原始全图连线] W02 → W12：卡片退场或界面发生变化〔旧页陈述〕
  - 位置：`DATA.base.modules[3].edges[11]`。

- [D305] [原始全图连线] W12 → W02：注销旧范围并维护新注册〔旧页陈述〕
  - 位置：`DATA.base.modules[3].edges[12]`。

- [D306] [评审问题] 哪些页面、哪类卡片已经支持，可见的字是否都可说？〔旧页陈述〕
  - 位置：`DATA.base.modules[3].questions[0].q`。

- [D307] [评审问题] 可见即可说需要业务主动注册，不等于任意屏幕都能由模型理解和点击。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].questions[0].why`。

- [D308] [评审问题] 有按车型/版本维护的页面清单、控件清单和注册来源，未注册元素不会假装支持。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].questions[0].goodAnswer`。

- [D309] [评审问题] 把同一轮的输入、实际配置、判断结果和下游反馈按时间排在一起，与预期行为逐项对照；同时核对这辆车实际发生了什么。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].questions[0].evidence`；`DATA.base.modules[3].questions[1].evidence`；`DATA.base.modules[3].questions[2].evidence`；`DATA.base.modules[3].questions[3].evidence`；`DATA.base.modules[3].questions[4].evidence`；`DATA.base.modules[3].questions[5].evidence`。

- [D310] [评审问题] 一个词匹配两个控件时，谁做最后选择？〔旧页陈述〕
  - 位置：`DATA.base.modules[3].questions[1].q`。

- [D311] [评审问题] 字节匹配服务与业务执行方责任不同，随机点第一个可能造成真实误操作。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].questions[1].why`。

- [D312] [评审问题] 返回全部候选 ID；业务按明确规则消歧或拒绝执行，直到目标唯一并可追溯。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].questions[1].goodAnswer`。

- [D313] [评审问题] ASR 听对、匹配成功后，怎样证明真实操作完成？〔旧页陈述〕
  - 位置：`DATA.base.modules[3].questions[2].q`。

- [D314] [评审问题] 注册、识别、匹配、点击、业务完成是不同阶段。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].questions[2].why`。

- [D315] [评审问题] 同 request_id 串起 final、匹配 ID、业务接收、实际回执、UI 和最终可听反馈；失败不报成功。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].questions[2].goodAnswer`。

- [D316] [评审问题] 卡片消失后说“第二个”，会不会点到旧页面？〔旧页陈述〕
  - 位置：`DATA.base.modules[3].questions[3].q`。

- [D317] [评审问题] 动态 selector 生命周期错误会让已过期对象继续生效。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].questions[3].why`。

- [D318] [评审问题] 覆盖卡片超时、关闭、替换和切页；旧 selector 注销，旧 ID 不再执行，必要时走普通澄清或主链。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].questions[3].goodAnswer`。

- [D319] [评审问题] 历史是否注明模拟点击，且记录实际选中的对象？〔旧页陈述〕
  - 位置：`DATA.base.modules[3].questions[4].q`。

- [D320] [评审问题] 云端若只有“第二个”或一句成功话术，下一轮会缺对象或误判由自己调用工具。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].questions[4].why`。

- [D321] [评审问题] 读取 Context/历史，能看到来源、目标、真实结果；再说“就去这里”能关联正确地点。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].questions[4].goodAnswer`。

- [D322] [评审问题] 页面匹配优先级和端云采信规则，分别决定哪一步？〔旧页陈述〕
  - 位置：`DATA.base.modules[3].questions[5].q`。

- [D323] [评审问题] 页面匹配顺序决定先尝试哪个处理入口，端云采信决定哪一方的结果能够继续执行。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].questions[5].why`。

- [D324] [评审问题] 自定义、可见控件、问答、本地模型和云端模型的优先级，只能用于采用这套匹配框架的项目，不能代替云端超时后由本地接手的判断。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].questions[5].why`。

- [D325] [评审问题] 先说明这辆车使用的页面匹配顺序，再说明缓存、云端和本地结果怎样取得执行权。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].questions[5].goodAnswer`。

- [D326] [评审问题] 逐个测试命中、未命中和超时分支；每条请求只经过实际适用的入口。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].questions[5].goodAnswer`。

- [D327] [指标] 注册覆盖与有效性〔旧页陈述〕
  - 位置：`DATA.base.modules[3].metrics[0].name`。

- [D328] [指标] 在已承诺页面/卡片内，实际可操作对象是否已正确注册；单独统计过期 ID 和未注册按钮，不扩大到任意屏幕。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].metrics[0].definition`。

- [D329] [指标] 至少按车型、版本、入口和成功/失败分组；不能用整体平均值掩盖异常场景。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].metrics[0].segment`；`DATA.base.modules[3].metrics[1].segment`；`DATA.base.modules[3].metrics[2].segment`；`DATA.base.modules[3].metrics[3].segment`；`DATA.base.modules[3].metrics[4].segment`。

- [D330] [指标] 建议验收口径；阈值需项目确认。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].metrics[0].targetStatus`；`DATA.base.modules[3].metrics[1].targetStatus`；`DATA.base.modules[3].metrics[2].targetStatus`；`DATA.base.modules[3].metrics[3].targetStatus`。

- [D331] [指标] 端到端可见即可说完成率〔旧页陈述〕
  - 位置：`DATA.base.modules[3].metrics[1].name`。

- [D332] [指标] 在有效注册范围内，final 听对、匹配对、执行对象对、真实业务完成且反馈一致的比例，分开报告每一段损失。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].metrics[1].definition`。

- [D333] [指标] 多候选误执行率〔旧页陈述〕
  - 位置：`DATA.base.modules[3].metrics[2].name`。

- [D334] [指标] 多匹配未完成选择却发生点击、或错误默认第一个的比例；无候选被吞掉也单列。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].metrics[2].definition`。

- [D335] [指标] 过期控件执行率〔旧页陈述〕
  - 位置：`DATA.base.modules[3].metrics[3].name`。

- [D336] [指标] 卡片退场、切页、手动关闭后仍命中旧 selector 并产生实际动作的比例；应与热词残留率分别检查。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].metrics[3].definition`。

- [D337] [指标] 页面热词容量〔旧页陈述〕
  - 位置：`DATA.base.modules[3].metrics[4].name`。

- [D338] [指标] 可见即可说需求写每页最多 500 个词；这是指定框架的需求上限，非已测吞吐或 Planner 工具数量。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].metrics[4].definition`。

- [D339] [指标] 对应页面注册框架的需求上限为每页 500 个词；实际容量与表现按项目验收。〔旧页陈述〕
  - 位置：`DATA.base.modules[3].metrics[4].targetStatus`。

- [D340] [费曼学习与复述] 讲清页面登记、语音识别、对象匹配与业务执行怎样接起来。〔旧页陈述〕
  - 位置：`DATA.pages[9].feynman.goal`。

- [D341] [费曼学习与复述] 页面上有两个导航按钮，用户说‘点第二个’。〔旧页陈述〕
  - 位置：`DATA.pages[9].feynman.scenario`。

- [D342] [费曼学习与复述] 以已接入可见即可说的页面为例；Planner结果卡和动态选择工具有不同路由，不默认都走本地点击。〔旧页陈述〕
  - 位置：`DATA.pages[9].feynman.scope`。

- [D343] [费曼学习与复述] 先让系统知道屏幕上哪些对象可以操作〔旧页陈述〕
  - 位置：`DATA.pages[9].feynman.sections[0].title`。

- [D344] [费曼学习与复述] 仅有一张屏幕截图并不等于语音模块知道两个按钮各属于谁。〔旧页陈述〕
  - 位置：`DATA.pages[9].feynman.sections[0].p[0]`。

- [D345] [费曼学习与复述] 页面业务需要把可说文字与控件标识登记起来，还要随页面变化维护。〔旧页陈述〕
  - 位置：`DATA.pages[9].feynman.sections[0].p[0]`。

- [D346] [费曼学习与复述] 标识把‘第二个’对应到实际控件，而不只是一段相同的文字。〔旧页陈述〕
  - 位置：`DATA.pages[9].feynman.sections[0].p[0]`。

- [D347] [费曼学习与复述] 登记范围是当前有效页面。〔旧页陈述〕
  - 位置：`DATA.pages[9].feynman.sections[0].p[1]`。

- [D348] [费曼学习与复述] 切页或卡片退出以后，旧对象应失效，否则用户在新页面说同一句话，会点到刚才的按钮。〔旧页陈述〕
  - 位置：`DATA.pages[9].feynman.sections[0].p[1]`。

- [D349] [费曼学习与复述] 先听清，再找到具体对象；两步都还没有点击〔旧页陈述〕
  - 位置：`DATA.pages[9].feynman.sections[1].title`。

- [D350] [费曼学习与复述] 页面词可作为热词帮助ASR听准；最终文字回来后，匹配才在当前登记范围里找候选。〔旧页陈述〕
  - 位置：`DATA.pages[9].feynman.sections[1].p[0]`。

- [D351] [费曼学习与复述] 热词帮选字，匹配帮选对象。〔旧页陈述〕
  - 位置：`DATA.pages[9].feynman.sections[1].p[0]`。

- [D352] [费曼学习与复述] 听对‘导航’不代表知道两个导航按钮中的哪一个。〔旧页陈述〕
  - 位置：`DATA.pages[9].feynman.sections[1].p[0]`。

- [D353] [费曼学习与复述] 多候选要按框架交回业务消歧，不能无依据选第一个。〔旧页陈述〕
  - 位置：`DATA.pages[9].feynman.sections[1].p[1]`。

- [D354] [费曼学习与复述] 没匹配到也不等于用户没向助手提需求，仍需适用入口继续处理。〔旧页陈述〕
  - 位置：`DATA.pages[9].feynman.sections[1].p[1]`。

- [D355] [费曼学习与复述] 唯一有效的对象交回页面业务，才发生真实操作〔旧页陈述〕
  - 位置：`DATA.pages[9].feynman.sections[2].title`。

- [D356] [费曼学习与复述] 从开口到匹配完成，页面可能已经刷新，所以执行前还要核控件此刻有效。〔旧页陈述〕
  - 位置：`DATA.pages[9].feynman.sections[2].p[0]`。

- [D357] [费曼学习与复述] 之后由所属业务调用它真实的点击能力。〔旧页陈述〕
  - 位置：`DATA.pages[9].feynman.sections[2].p[0]`。

- [D358] [费曼学习与复述] 匹配服务不应该仅凭返回一个控件ID就报事情办成。〔旧页陈述〕
  - 位置：`DATA.pages[9].feynman.sections[2].p[0]`。

- [D359] [费曼学习与复述] 点击也可能只是打开详情，后面还有网络办理。〔旧页陈述〕
  - 位置：`DATA.pages[9].feynman.sections[2].p[1]`。

- [D360] [费曼学习与复述] 要分别看对象匹配、点击回执和业务结果，才知道用户是否真正开始了导航。〔旧页陈述〕
  - 位置：`DATA.pages[9].feynman.sections[2].p[1]`。

- [D361] [费曼学习与复述] 同样一句‘第二个’，不同卡片未必走同一条路〔旧页陈述〕
  - 位置：`DATA.pages[9].feynman.sections[3].title`。

- [D362] [费曼学习与复述] Planner查询生成的餐厅卡，其语音选择可以带列表回Planner闭环；某些通知卡注册临时选择工具；本地自闭环卡走本地处理。〔旧页陈述〕
  - 位置：`DATA.pages[9].feynman.sections[3].p[0]`。

- [D363] [费曼学习与复述] 先认卡片归属，再讲它怎样执行，不能把所有‘第二个’都画成本地模拟点击。〔旧页陈述〕
  - 位置：`DATA.pages[9].feynman.sections[3].p[0]`。

- [D364] [费曼学习与复述] 无论哪个入口，实际选择与结果要能回到后续背景。〔旧页陈述〕
  - 位置：`DATA.pages[9].feynman.sections[3].p[1]`。

- [D365] [费曼学习与复述] 下一句‘换另一家’才知道刚才选过谁，而不是重新猜一份列表。〔旧页陈述〕
  - 位置：`DATA.pages[9].feynman.sections[3].p[1]`。

- [D366] [费曼学习与复述] 把‘听对按钮名’到‘导航真的开始’之间缺的步骤讲出来。〔旧页陈述〕
  - 位置：`DATA.pages[9].feynman.retell.q`。

- [D367] [费曼学习与复述] 页面先登记有效对象，识别得到定稿文字，匹配确认具体对象并消歧，再交所属业务执行；点击和后续业务各看真实回执。〔旧页陈述〕
  - 位置：`DATA.pages[9].feynman.retell.a`。

- [D368] [费曼学习与复述] 还需先判断卡片是否走可见即可说或Planner等其他链路。〔旧页陈述〕
  - 位置：`DATA.pages[9].feynman.retell.a`。

- [D369] [费曼学习与复述] 按钮名字还在旧词表里，但页面已经关闭，能否照常点？〔旧页陈述〕
  - 位置：`DATA.pages[9].feynman.transfer[0].q`。

- [D370] [费曼学习与复述] 不能，旧登记不代表当前控件有效。〔旧页陈述〕
  - 位置：`DATA.pages[9].feynman.transfer[0].a`。

- [D371] [费曼学习与复述] 词被正确识别但点错按钮，先查ASR吗？〔旧页陈述〕
  - 位置：`DATA.pages[9].feynman.transfer[1].q`。

- [D372] [费曼学习与复述] 先查对象登记、当前页面和匹配结果，文字正确不能替对象正确作证。〔旧页陈述〕
  - 位置：`DATA.pages[9].feynman.transfer[1].a`。


## 结构与图资产核对

- 当前页正文 5 节，teaching.lessons 同样 5 节；原始全图含 W01—W12 共 12 个节点、13 条连线，均已按文本逐条登记。

- 当前页 flows、cases、terms、questions、metrics、roadmap、related、referenceTables 都为空；评审问题和指标实际保存在 base.modules[3]，本表已经登记，不能只看 pages[9] 的空数组就判断旧页没有这些内容。

- 当前页 teaching.guides.base 是原始全图解说；DATA.diagrams 无 W 专属新增图键，原始总图中的 W 节点和连线仍是必须保留的图资产。

- feynman 含 4 节讲解、1 组复述问答和 2 组迁移练习，均已登记；本表也保留了桥接、主线和收尾。


条目数：372 条知识点（D 编号），结构核对 4 条另计。
