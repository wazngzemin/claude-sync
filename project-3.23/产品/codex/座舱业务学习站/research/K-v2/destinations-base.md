# K 章当前网页知识点底表

来源：HTML/01-进行中/豆包汽车-业务学习站-v69.html:L269 的 DATA；页模块 pages[id=K]、原图模块 base.modules[id=K]。JSON 数组定位在本文采用从 1 开始的序号；节点/段落用实际 id 定位。旧页副本 research/chapters/K/old-page.json 与当前网页的 pages[id=K] 深度比较完全相同。

本表登记网页已存在的说法，并不把它们自动认定为源材料已确认事实；尤其原图 detail 与更新后的 paragraphs 同时保留的说法需要后续研究纠正。相同句子合并为一条，列出全部出现位置；近义但条件、数字或现状不同的说法分别保留。每句按知识点独立编号，指标和评审问题按完整判定单位登记。

主概念簇为 9 组（身份、分层、取用、开关与删除、共享隔离、地点同步、画像、质量排查、用途记忆）；原图为 15 个节点。逐句登记共 512 个知识点；9 个章节段落、15 个原图节点、13 个评审问题、11 个指标。

## KB-001 开篇与学习路线
先确认本轮能使用谁的资料，再区分最近历史输入、对话摘要、短期经历与长期记忆。
位置：pages[K].summary

## KB-002 开篇与学习路线
人人对话补充输入来源，地点与座椅用途记忆还要经过各自的确认和执行链路。
位置：pages[K].summary

## KB-003 开篇与学习路线
主驾说「带我去昨天那家游泳馆附近的餐厅」，系统核身份、取最近对话和长期记忆、补全地址后交导航。
位置：pages[K].scenario

## KB-004 开篇与学习路线
用户说「带我去昨天那家游泳馆」，系统得先知道「昨天那家」属于谁、存在哪里。
位置：pages[K].bridge

## KB-005 开篇与学习路线
这一章先解析车、账号、人脸三层身份，再分清历史输入、摘要、瞬时、短期、长期各自解决什么问题，最后讲写入、召回、删除、开关各改的是哪一份内容。
位置：pages[K].bridge

## KB-006 开篇与学习路线
查到记忆，不等于可以直接导航。
位置：pages[K].bridge

## KB-007 「昨天那家」先属于一个人，再属于一次可使用的经历
关系必须从车企云返回的可信账号关系解析，客户端上报的「我是车主」不能直接当权限依据。
位置：pages[K].sections[k-lesson-person].paragraphs[1]；pages[K].teaching.lessons[k-lesson-person].paragraphs[1]

## KB-008 「昨天那家」先属于一个人，再属于一次可使用的经历
K01（先确定车辆与账号范围）把车辆、车企账号、豆包账号和乘客之间的可信关系解析出来。
位置：pages[K].sections[k-lesson-person].paragraphs[1]；pages[K].teaching.lessons[k-lesson-person].paragraphs[1]

## KB-009 「昨天那家」先属于一个人，再属于一次可使用的经历
车辆由车辆唯一标识确定；车企侧账号是车主在车企体系内的账号，决定本车有哪些成员和访客；豆包账号是用户登录的豆包账号。
位置：pages[K].sections[k-lesson-person].paragraphs[1]；pages[K].teaching.lessons[k-lesson-person].paragraphs[1]

## KB-010 「昨天那家」先属于一个人，再属于一次可使用的经历
乘客身份用人脸标识、声纹标识和车内自然人标识描述。
位置：pages[K].sections[k-lesson-person].paragraphs[2]；pages[K].teaching.lessons[k-lesson-person].paragraphs[2]

## KB-011 「昨天那家」先属于一个人，再属于一次可使用的经历
否则副驾一句「我是车主」就能读到车主私人记忆。
位置：pages[K].sections[k-lesson-person].paragraphs[2]；pages[K].teaching.lessons[k-lesson-person].paragraphs[2]

## KB-012 「昨天那家」先属于一个人，再属于一次可使用的经历
可信入口先通过车企云校验车辆标识与账号标识的绑定关系并获取角色，客户端上报的账号和角色不可信；校验失败或依赖不可用时，高权限能力按失败关闭处理，而不是默认放行。
位置：pages[K].sections[k-lesson-person].paragraphs[2]；pages[K].teaching.lessons[k-lesson-person].paragraphs[2]

## KB-013 「昨天那家」先属于一个人，再属于一次可使用的经历
记忆在索引上按三层身份定位。
位置：pages[K].sections[k-lesson-person].paragraphs[3]；pages[K].teaching.lessons[k-lesson-person].paragraphs[3]

## KB-014 「昨天那家」先属于一个人，再属于一次可使用的经历
最上层是火山统一账号，决定一次任务跟谁走、记忆整体落在哪个账号边界内；中间层是车企账号，决定本车哪些成员和访客的记忆互相可见；最下层是车内自然人标识，指车内具体哪一个人，一条记忆最终挂在这个人头上。
位置：pages[K].sections[k-lesson-person].paragraphs[3]；pages[K].teaching.lessons[k-lesson-person].paragraphs[3]

## KB-015 「昨天那家」先属于一个人，再属于一次可使用的经历
三层不是同一个名字的重复叫法：换车不换豆包账号，统一账号关系保持；同一台车切换不同车企账号，可见的成员范围随之变化。
位置：pages[K].sections[k-lesson-person].paragraphs[4]；pages[K].teaching.lessons[k-lesson-person].paragraphs[4]

## KB-016 「昨天那家」先属于一个人，再属于一次可使用的经历
三层身份之上还有一条硬边界：系统只在当前账号授权范围内检索记忆，不能凭车辆标识加上人脸特征跨账号命中另一个账号下的记忆。
位置：pages[K].sections[k-lesson-person].paragraphs[4]；pages[K].teaching.lessons[k-lesson-person].paragraphs[4]

## KB-017 「昨天那家」先属于一个人，再属于一次可使用的经历
同一张脸在不同账号体系里可以对应不同称呼和不同经历，查不到就反问用户，不猜、不借读其他账号的数据。
位置：pages[K].sections[k-lesson-person].paragraphs[5]；pages[K].teaching.lessons[k-lesson-person].paragraphs[5]

## KB-018 「昨天那家」先属于一个人，再属于一次可使用的经历
要区分两种「没找到」：一种是本账号范围内确实没有这段记忆，另一种是记忆属于其他账号、当前没有权限读取，对用户的回复口径要分开。
位置：pages[K].sections[k-lesson-person].paragraphs[5]；pages[K].teaching.lessons[k-lesson-person].paragraphs[5]

## KB-019 「昨天那家」先属于一个人，再属于一次可使用的经历
一次请求进来，K02（把乘客身份接到个人内容）以人脸作为主识别因子，声纹作为补充，把识别结果关联到当前乘客标识和座位位置。
位置：pages[K].sections[k-lesson-person].paragraphs[6]；pages[K].teaching.lessons[k-lesson-person].paragraphs[6]

## KB-020 「昨天那家」先属于一个人，再属于一次可使用的经历
真实生物特征留在端侧，不上传到云端，云端只使用识别后的身份标识。
位置：pages[K].sections[k-lesson-person].paragraphs[6]；pages[K].teaching.lessons[k-lesson-person].paragraphs[6]

## KB-021 「昨天那家」先属于一个人，再属于一次可使用的经历
未注册脸进入匿名上下文，不套用车主偏好；同名乘客靠座位、声纹和上下文消歧；空座位不生成不存在的乘客身份。
位置：pages[K].sections[k-lesson-person].paragraphs[6]；pages[K].teaching.lessons[k-lesson-person].paragraphs[6]

## KB-022 「昨天那家」先属于一个人，再属于一次可使用的经历
乘客之间互相介绍时，系统要先判断意图再抽槽位。
位置：pages[K].sections[k-lesson-person].paragraphs[7]；pages[K].teaching.lessons[k-lesson-person].paragraphs[7]

## KB-023 「昨天那家」先属于一个人，再属于一次可使用的经历
乘客说「坐我右边的是 Alex」，需求是介绍关系，不是闲聊。
位置：pages[K].sections[k-lesson-person].paragraphs[7]；pages[K].teaching.lessons[k-lesson-person].paragraphs[7]

## KB-024 「昨天那家」先属于一个人，再属于一次可使用的经历
先判断这一轮是不是介绍认识的意图，再抽出姓名和座位两个槽位，两个槽都非空才回应「你好 Alex」，并触发端上人脸注册流程；缺姓名或缺座位，整条介绍丢弃，不猜一个名字挂到空座位上。
位置：pages[K].sections[k-lesson-person].paragraphs[7]；pages[K].teaching.lessons[k-lesson-person].paragraphs[7]

## KB-025 「昨天那家」先属于一个人，再属于一次可使用的经历
车门全关时重新上报座位人物表，中途换人但人数没变是已知覆盖缺口。
位置：pages[K].sections[k-lesson-person].paragraphs[7]；pages[K].teaching.lessons[k-lesson-person].paragraphs[7]

## KB-026 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
先从同一段用车经历看。
位置：pages[K].sections[k-lesson-produce].paragraphs[1]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[1]

## KB-027 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
乘客刚选过一家餐厅，下一句「就这家」需要能对回原来的选项；途中聊了很久，后来追问前面说过什么，就需要保住已经离开最近窗口的内容；第二天再问「昨天吃过的那家」，则需要能够跨对话查询的经历。
位置：pages[K].sections[k-lesson-produce].paragraphs[1]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[1]

## KB-028 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
历史输入、对话摘要和记忆服务分别承担这些不同需求，不能把它们画成必须逐级流过的五个存储站。
位置：pages[K].sections[k-lesson-produce].paragraphs[1]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[1]

## KB-029 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
记忆系统 PRD
位置：pages[K].sections[k-lesson-produce].paragraphs[1]；pages[K].sections[k-lesson-produce].paragraphs[2]；pages[K].sections[k-lesson-produce].paragraphs[6]；pages[K].sections[k-lesson-quality].paragraphs[6]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[1]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[2]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[6]；pages[K].teaching.lessons[k-lesson-quality].paragraphs[6]；pages[K].teaching.guides.base.paragraphs[1]；pages[K].teaching.guides.base.paragraphs[4]；pages[K].teaching.guides.base.paragraphs[7]；base.modules[K].nodes[K05].paragraphs[2]；base.modules[K].nodes[K06].paragraphs[1]；base.modules[K].nodes[K06].paragraphs[2]

## KB-030 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
历史输入原来叫历史对话，指送给 Director 的近期原始交互记录。
位置：pages[K].sections[k-lesson-produce].paragraphs[2]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[2]

## KB-031 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
PRD 的旧口径是保留 5 轮人机对话，记录用户问什么和助手怎样回复。
位置：pages[K].sections[k-lesson-produce].paragraphs[2]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[2]

## KB-032 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
比如刚搜索出两家泳馆，用户说「第二家」，模型要拿到真实候选与选择关系，不能只看到「用户在找泳馆」这句概括。
位置：pages[K].sections[k-lesson-produce].paragraphs[2]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[2]

## KB-033 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
这里的 5 轮是该文档的窗口规则，不是长期记忆的保存期限。
位置：pages[K].sections[k-lesson-produce].paragraphs[2]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[2]

## KB-034 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
人人对话指乘客之间的交谈。
位置：pages[K].sections[k-lesson-produce].paragraphs[3]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[3]

## KB-035 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
例如副驾对主驾说「今天想吃清淡一点」，当时未必是在向豆包下指令；后来主驾叫豆包找餐厅，这段话可能帮助理解口味。
位置：pages[K].sections[k-lesson-produce].paragraphs[3]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[3]

## KB-036 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
成为背景信息不等于成为执行授权，也不等于可以把副驾的偏好记到主驾名下。
位置：pages[K].sections[k-lesson-produce].paragraphs[3]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[3]

## KB-037 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
11 月 4 日讨论的方案保留最近 5 轮人机对话，再补入当前往前 5 次混合输入中的非人机部分，包括人人对话和事件。
位置：pages[K].sections[k-lesson-produce].paragraphs[3]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[3]

## KB-038 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
它既不是额外固定加 5 轮人人对话，也不是所有类型合计只留 5 条。
位置：pages[K].sections[k-lesson-produce].paragraphs[3]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[3]

## KB-039 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
文字记录00:01:50至00:07:32
位置：pages[K].sections[k-lesson-produce].paragraphs[3]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[3]

## KB-040 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
事件是另一种输入来源。
位置：pages[K].sections[k-lesson-produce].paragraphs[4]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[4]

## KB-041 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
用户点击一个视频、执行一次车控、某项任务返回结果，都可能形成一条带发生时间和来源的记录。
位置：pages[K].sections[k-lesson-produce].paragraphs[4]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[4]

## KB-042 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
当天讨论不再单独调用 DT 提示中的旧事件流变量，而把相关事件纳入历史输入。
位置：pages[K].sections[k-lesson-produce].paragraphs[4]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[4]

## KB-043 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
取消重复的提示入口，不等于取消事件采集和日志服务；哪些事件值得进入模型的近期背景，会上仍要求逐项评审。
位置：pages[K].sections[k-lesson-produce].paragraphs[4]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[4]

## KB-044 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
文字记录00:04至00:16
位置：pages[K].sections[k-lesson-produce].paragraphs[4]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[4]

## KB-045 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
对话摘要把较早的对话压成短文本。
位置：pages[K].sections[k-lesson-produce].paragraphs[5]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[5]

## KB-046 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
旧 PRD 规定从第 3 轮开始，每新增 1 轮对话压缩一次，本次用车周期内最多压缩 22 轮、最长 500 token，摘要拼在记忆变量的起始位置。
位置：pages[K].sections[k-lesson-produce].paragraphs[5]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[5]

## KB-047 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
token 是模型处理文本的计量单位，500 token 不能直接当作 500 个汉字。
位置：pages[K].sections[k-lesson-produce].paragraphs[5]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[5]

## KB-048 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
提前从第 3 轮处理，是给压缩留出时间，避免原话退出 Director 的 5 轮窗口时，摘要还没准备好。
位置：pages[K].sections[k-lesson-produce].paragraphs[5]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[5]

## KB-049 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
记忆系统 PRD·增加对话摘要压缩
位置：pages[K].sections[k-lesson-produce].paragraphs[5]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[5]

## KB-050 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
摘要保留的是与后续理解相关的内容，不能代替所有原始记录。
位置：pages[K].sections[k-lesson-produce].paragraphs[6]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[6]

## KB-051 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
比如原始列表明确第二家是某个地点，摘要只写「讨论了两个地点」，后面仍无法凭「第二家」正确选择。
位置：pages[K].sections[k-lesson-produce].paragraphs[6]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[6]

## KB-052 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
测试摘要既要看信息有没有保住，也要看人物、时间、否定和已完成动作有没有压错；不能因为文本更短就认为处理成功。
位置：pages[K].sections[k-lesson-produce].paragraphs[6]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[6]

## KB-053 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
PRD 增加摘要的背景明确写的是瞬时记忆当时不可用造成缺口，并不是要求摘要先写进瞬时记忆再转往下一层。
位置：pages[K].sections[k-lesson-produce].paragraphs[6]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[6]

## KB-054 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
瞬时记忆是 PRD 使用的名称，开关一节明确标注「当前没用」。
位置：pages[K].sections[k-lesson-produce].paragraphs[7]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[7]

## KB-055 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
用户提到的「顺时」先与资料中的这个近音名称对照，但不据读音推导业务定义。
位置：pages[K].sections[k-lesson-produce].paragraphs[7]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[7]

## KB-056 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
当前可读 PRD 正文没有把「20 分钟或 20 轮事件日志」定义为瞬时记忆，不能继续把这个阈值写成该 PRD 的正式结论。
位置：pages[K].sections[k-lesson-produce].paragraphs[7]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[7]

## KB-057 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
它与历史输入、摘要的准确工程关系，需要结合对应版本的实现定义，不能把当时未使用的能力当成本轮已经在取用的来源。
位置：pages[K].sections[k-lesson-produce].paragraphs[7]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[7]

## KB-058 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
记忆系统 PRD·记忆开关
位置：pages[K].sections[k-lesson-produce].paragraphs[7]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[7]

## KB-059 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
短期记忆用来保留近期经历，长期情景记忆用来保存可回忆的经历片段；两者都与事件发生的场景有关。
位置：pages[K].sections[k-lesson-produce].paragraphs[8]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[8]

## KB-060 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
例如「昨天与家人去了某家泳馆」要保留人物、时间、地点和活动，才能在第二天查「昨天那家」。
位置：pages[K].sections[k-lesson-produce].paragraphs[8]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[8]

## KB-061 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
PRD 指出旧方案按固定轮数压缩、过于流水账和没有按用车人及场景隔离，都是待改问题。
位置：pages[K].sections[k-lesson-produce].paragraphs[8]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[8]

## KB-062 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
因此不能把短期记忆简单等同于模型本次收到的 context window，也不能把存有原始日志等同于已经生成了可召回的经历。
位置：pages[K].sections[k-lesson-produce].paragraphs[8]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[8]

## KB-063 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
记忆系统 PRD·情景记忆生成优化
位置：pages[K].sections[k-lesson-produce].paragraphs[8]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[8]

## KB-064 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
长期语义记忆保存能用于以后判断的事实、关系或明确偏好，例如某位乘客说自己的公司在哪里、不吃什么。
位置：pages[K].sections[k-lesson-produce].paragraphs[9]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[9]

## KB-065 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
它和「昨天去哪了」这样的情景经历不同：前者是这位用户的事实，后者保留发生在某次场景中的事件。
位置：pages[K].sections[k-lesson-produce].paragraphs[9]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[9]

## KB-066 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
PRD 要求保留信息是谁说的，例如别人介绍某位乘客的联系方式，不能抹掉来源后变成这位乘客亲口确认。
位置：pages[K].sections[k-lesson-produce].paragraphs[9]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[9]

## KB-067 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
由行为归纳偏好是另一路能力，PRD 所列情景记忆画像方案当时已实现但实际未使用，不能写成夜间必然自动生成习惯。
位置：pages[K].sections[k-lesson-produce].paragraphs[9]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[9]

## KB-068 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
记忆系统 PRD·语义记忆生成优化及情景画像
位置：pages[K].sections[k-lesson-produce].paragraphs[9]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[9]

## KB-069 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
11 月 4 日还讨论把摘要输入从人机问答扩大到人人对话和事件。
位置：pages[K].sections[k-lesson-produce].paragraphs[10]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[10]

## KB-070 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
会上对「一轮」的定义进行对齐，并要求核实旧摘要 22 轮上限与记忆侧 20 轮或 20 分钟的总结节奏是否会出现覆盖空档。
位置：pages[K].sections[k-lesson-produce].paragraphs[10]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[10]

## KB-071 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
这里仍有待研发核对项，不能把 20 轮、20 条和 20 分钟互相替换。
位置：pages[K].sections[k-lesson-produce].paragraphs[10]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[10]

## KB-072 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
当时口头反馈的一次摘要耗时约 1.7 至 1.8 秒，是处理耗时，不是 1.7B 模型规模，也不是正式性能承诺。
位置：pages[K].sections[k-lesson-produce].paragraphs[10]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[10]

## KB-073 历史输入、摘要、瞬时、短期和长期记忆分别解决什么问题
文字记录00:09至00:15
位置：pages[K].sections[k-lesson-produce].paragraphs[10]；pages[K].teaching.lessons[k-lesson-produce].paragraphs[10]

## KB-074 先找到泳馆，再围绕它找餐厅，两个依赖不能倒过来
预注入是默认主路，授权核对必须发生在检索之前，不能先捞回来再发现无权使用。
位置：pages[K].sections[k-lesson-use].paragraphs[1]；pages[K].teaching.lessons[k-lesson-use].paragraphs[1]

## KB-075 先找到泳馆，再围绕它找餐厅，两个依赖不能倒过来
一条请求进入 Director 之前，上下文模块已经在准备背景材料，K07（在本轮推理前准备背景）是默认主路。
位置：pages[K].sections[k-lesson-use].paragraphs[1]；pages[K].teaching.lessons[k-lesson-use].paragraphs[1]

## KB-076 先找到泳馆，再围绕它找餐厅，两个依赖不能倒过来
请求到达后并行启动两路：画像一路固定取出当前乘客的基础画像；另一路根据请求推理地点、昨天、出行等场景标签，捞出候选记忆和匹配分数。
位置：pages[K].sections[k-lesson-use].paragraphs[1]；pages[K].teaching.lessons[k-lesson-use].paragraphs[1]

## KB-077 先找到泳馆，再围绕它找餐厅，两个依赖不能倒过来
预注入覆盖约 80% 的常规请求，这是上下文方案给出的口径；剩下不足的部分由显式查询兜底。
位置：pages[K].sections[k-lesson-use].paragraphs[2]；pages[K].teaching.lessons[k-lesson-use].paragraphs[2]

## KB-078 先找到泳馆，再围绕它找餐厅，两个依赖不能倒过来
授权核对必须发生在检索之前，先确认这一轮有权看谁的数据，再执行检索，不能先捞回来再发现无权使用，更不能把已经过权限核对的记忆和未核对的候选混在一起返回。
位置：pages[K].sections[k-lesson-use].paragraphs[2]；pages[K].teaching.lessons[k-lesson-use].paragraphs[2]

## KB-079 先找到泳馆，再围绕它找餐厅，两个依赖不能倒过来
候选记忆捞回来之后还要过滤排序，K08（先匹配标签，再给候选排序）：长期语义记忆主要看相似度和时效性，长期情景记忆在相似度之外再考虑重要性；先按标签剪枝，再按已经实现的得分规则重排序。
位置：pages[K].sections[k-lesson-use].paragraphs[3]；pages[K].teaching.lessons[k-lesson-use].paragraphs[3]

## KB-080 先找到泳馆，再围绕它找餐厅，两个依赖不能倒过来
匹配分数只代表排序相关度，不等于这条记忆的事实为真；情感显著性、情感共鸣这类打分维度属于后续方案，当前版本不能引用。
位置：pages[K].sections[k-lesson-use].paragraphs[3]；pages[K].teaching.lessons[k-lesson-use].paragraphs[3]

## KB-081 先找到泳馆，再围绕它找餐厅，两个依赖不能倒过来
预注入背景不够时，Director 才发起主动检索，K09（信息不足时显式查询记忆）。
位置：pages[K].sections[k-lesson-use].paragraphs[4]；pages[K].teaching.lessons[k-lesson-use].paragraphs[4]

## KB-082 先找到泳馆，再围绕它找餐厅，两个依赖不能倒过来
这一路要把查谁、查什么、需要什么时间范围说清楚，支持关键词和时间范围过滤；结果分三种情况返回：没查到、当前无权限、检索异常，三者话术分开，不能混在一句「我不记得了」里。
位置：pages[K].sections[k-lesson-use].paragraphs[4]；pages[K].teaching.lessons[k-lesson-use].paragraphs[4]

## KB-083 先找到泳馆，再围绕它找餐厅，两个依赖不能倒过来
显式查询只是获取事实依据，不自动获得启动导航或写开车机设置的授权；「我记得你家在朝阳」不等于这一轮已经可以直接导航回家。
位置：pages[K].sections[k-lesson-use].paragraphs[5]；pages[K].teaching.lessons[k-lesson-use].paragraphs[5]

## KB-084 先找到泳馆，再围绕它找餐厅，两个依赖不能倒过来
取回的记忆有两个出口，K10（把候选送回正确判断入口）：预取回的结果进入上下文背景汇集，供当前轮使用；显式查询结果经执行链路回到事件、记忆等执行层，再交给 Director 组织回答。
位置：pages[K].sections[k-lesson-use].paragraphs[5]；pages[K].teaching.lessons[k-lesson-use].paragraphs[5]

## KB-085 先找到泳馆，再围绕它找餐厅，两个依赖不能倒过来
和记忆并行的另一类取回是车辆状态：用户问「空调现在几度」，车上信号很多，先用小模型做初筛，再走检索定位到相关信号，而不是把全量状态都塞进上下文。
位置：pages[K].sections[k-lesson-use].paragraphs[6]；pages[K].teaching.lessons[k-lesson-use].paragraphs[6]

## KB-086 先找到泳馆，再围绕它找餐厅，两个依赖不能倒过来
这次切换的硬要求是效果不退化；当前口径是赛力斯车型已经上线，上汽车型在测试，属于 2.6 目标范围。
位置：pages[K].sections[k-lesson-use].paragraphs[6]；pages[K].teaching.lessons[k-lesson-use].paragraphs[6]

## KB-087 关闭、清空对话和删除记忆，各自改的是哪一份内容
每一次记忆操作都要单独核权限，能说出某位乘客的名字，不代表有权限读这位乘客的私人经历。
位置：pages[K].sections[k-lesson-control].paragraphs[1]；pages[K].teaching.lessons[k-lesson-control].paragraphs[1]

## KB-088 关闭、清空对话和删除记忆，各自改的是哪一份内容
身份识别完成之后，记录、召回、删除每一类操作都要单独核权限，这是 K03（按入口检查记忆使用条件）。
位置：pages[K].sections[k-lesson-control].paragraphs[1]；pages[K].teaching.lessons[k-lesson-control].paragraphs[1]

## KB-089 关闭、清空对话和删除记忆，各自改的是哪一份内容
系统先核对当前说话人身份、账号授权和本次操作类型，再决定能不能写入、能不能读取、能不能删除。
位置：pages[K].sections[k-lesson-control].paragraphs[1]；pages[K].teaching.lessons[k-lesson-control].paragraphs[1]

## KB-090 关闭、清空对话和删除记忆，各自改的是哪一份内容
记忆开关关闭时，新的记录和生成停止，旧内容保留在库里但不再被召回。
位置：pages[K].sections[k-lesson-control].paragraphs[2]；pages[K].teaching.lessons[k-lesson-control].paragraphs[2]

## KB-091 关闭、清空对话和删除记忆，各自改的是哪一份内容
2026年11月4日会议对一个具体场景拍了口径：用户说「把家设成麦当劳」这种导航地址类记忆，如果记忆开关是关闭的，系统要先提示用户打开开关，不能在开关关了的情况下偷偷记家地址。
位置：pages[K].sections[k-lesson-control].paragraphs[2]；pages[K].teaching.lessons[k-lesson-control].paragraphs[2]

## KB-092 关闭、清空对话和删除记忆，各自改的是哪一份内容
这跟之前讨论的「家地址是强规必须记」不一样，最终结论是统一限制，要设家或公司就先开记忆开关。
位置：pages[K].sections[k-lesson-control].paragraphs[2]；pages[K].teaching.lessons[k-lesson-control].paragraphs[2]

## KB-093 关闭、清空对话和删除记忆，各自改的是哪一份内容
记忆开关的语义是冻结，不是删除，这是 K11（关闭后冻结已有记忆）。
位置：pages[K].sections[k-lesson-control].paragraphs[3]；pages[K].teaching.lessons[k-lesson-control].paragraphs[3]

## KB-094 关闭、清空对话和删除记忆，各自改的是哪一份内容
用户关闭开关后，系统停止新的记录和新的记忆生成，已经存在的旧内容保留但不再被召回；重新授权或开启之后恢复合法使用。
位置：pages[K].sections[k-lesson-control].paragraphs[3]；pages[K].teaching.lessons[k-lesson-control].paragraphs[3]

## KB-095 关闭、清空对话和删除记忆，各自改的是哪一份内容
开关关闭期间，最近几轮的原话仍可能基于当前上下文回答用户，这和长期记忆被冻结是两件事。
位置：pages[K].sections[k-lesson-control].paragraphs[3]；pages[K].teaching.lessons[k-lesson-control].paragraphs[3]

## KB-096 关闭、清空对话和删除记忆，各自改的是哪一份内容
删除前先分清删什么，K13（按入口选择删除对象和范围）。
位置：pages[K].sections[k-lesson-control].paragraphs[4]；pages[K].teaching.lessons[k-lesson-control].paragraphs[4]

## KB-097 关闭、清空对话和删除记忆，各自改的是哪一份内容
系统先判断删除对象是谁的记忆、是语义记忆还是情景记忆、按人删、按日期删还是全部删除；批量删除由 Director 先和用户二次确认，确认结果作为下一轮正常输入回来，避免一句「把我记忆都删了」误删别人的内容。
位置：pages[K].sections[k-lesson-control].paragraphs[4]；pages[K].teaching.lessons[k-lesson-control].paragraphs[4]

## KB-098 关闭、清空对话和删除记忆，各自改的是哪一份内容
清理时要分对象。
位置：pages[K].sections[k-lesson-control].paragraphs[5]；pages[K].teaching.lessons[k-lesson-control].paragraphs[5]

## KB-099 关闭、清空对话和删除记忆，各自改的是哪一份内容
PRD提供新chat_id清空Director历史对话与摘要，语义记忆和情景记忆分别走删除接口；删除语义记忆以后，再按剩余资料更新用户画像。
位置：pages[K].sections[k-lesson-control].paragraphs[5]；pages[K].teaching.lessons[k-lesson-control].paragraphs[5]

## KB-100 关闭、清空对话和删除记忆，各自改的是哪一份内容
接口返回多少条、清掉哪个范围，都要按实际操作说明，不能把删除一条语义记忆说成同时删完所有原始日志与最近历史。
位置：pages[K].sections[k-lesson-control].paragraphs[5]；pages[K].teaching.lessons[k-lesson-control].paragraphs[5]

## KB-101 关闭、清空对话和删除记忆，各自改的是哪一份内容
记忆系统 PRD·记忆管理需求
位置：pages[K].sections[k-lesson-control].paragraphs[5]；pages[K].teaching.lessons[k-lesson-control].paragraphs[5]

## KB-102 关闭、清空对话和删除记忆，各自改的是哪一份内容
当前页面主要露出长期语义记忆，情景类暂不露出；支持标签筛选、单条删除、按标签删除和一键清空，批量操作二次确认。
位置：pages[K].sections[k-lesson-control].paragraphs[6]；pages[K].teaching.lessons[k-lesson-control].paragraphs[6]

## KB-103 关闭、清空对话和删除记忆，各自改的是哪一份内容
按人筛选的页面设计已划掉，接口仍列有按人操作。
位置：pages[K].sections[k-lesson-control].paragraphs[6]；pages[K].teaching.lessons[k-lesson-control].paragraphs[6]

## KB-104 关闭、清空对话和删除记忆，各自改的是哪一份内容
语音批量删除由DT确认范围再执行，页面由车企开发，各项目实际开放范围仍要按交付版本看。
位置：pages[K].sections[k-lesson-control].paragraphs[6]；pages[K].teaching.lessons[k-lesson-control].paragraphs[6]

## KB-105 关闭、清空对话和删除记忆，各自改的是哪一份内容
记忆系统 PRD·界面及语音删除
位置：pages[K].sections[k-lesson-control].paragraphs[6]；pages[K].teaching.lessons[k-lesson-control].paragraphs[6]

## KB-106 共享乘客、多人在场与跨账号，是不同的数据范围
多人同车先确定两个范围：当前车与登录账号能访问哪份记忆，以及这一次在场的人允许共同使用哪些内容。
位置：pages[K].sections[k-lesson-cross-device].paragraphs[1]；pages[K].teaching.lessons[k-lesson-cross-device].paragraphs[1]

## KB-107 共享乘客、多人在场与跨账号，是不同的数据范围
PRD先按车和豆包账号隔离，再按记忆标签与用车场景收窄敏感内容。
位置：pages[K].sections[k-lesson-cross-device].paragraphs[1]；pages[K].teaching.lessons[k-lesson-cross-device].paragraphs[1]

## KB-108 共享乘客、多人在场与跨账号，是不同的数据范围
不能因为同一家庭账号就把所有成员经历都拿来回答，也不能把一位乘客过去坐副驾当成现在有权读取他的私有内容。
位置：pages[K].sections[k-lesson-cross-device].paragraphs[1]；pages[K].teaching.lessons[k-lesson-cross-device].paragraphs[1]

## KB-109 共享乘客、多人在场与跨账号，是不同的数据范围
记忆系统 PRD·隐私策略
位置：pages[K].sections[k-lesson-cross-device].paragraphs[1]；pages[K].teaching.lessons[k-lesson-cross-device].paragraphs[1]

## KB-110 共享乘客、多人在场与跨账号，是不同的数据范围
白名单和非白名单用不同召回范围。
位置：pages[K].sections[k-lesson-cross-device].paragraphs[2]；pages[K].teaching.lessons[k-lesson-cross-device].paragraphs[2]

## KB-111 共享乘客、多人在场与跨账号，是不同的数据范围
白名单从包含询问者的经历中取：A询问时，可包括A单独、AB、AD等有A的场景。
位置：pages[K].sections[k-lesson-cross-device].paragraphs[2]；pages[K].teaching.lessons[k-lesson-cross-device].paragraphs[2]

## KB-112 共享乘客、多人在场与跨账号，是不同的数据范围
非白名单要求覆盖当前在场人员：A、B、C在车上时，候选来自ABC、ABCD等至少包含这三人的场景。
位置：pages[K].sections[k-lesson-cross-device].paragraphs[2]；pages[K].teaching.lessons[k-lesson-cross-device].paragraphs[2]

## KB-113 共享乘客、多人在场与跨账号，是不同的数据范围
这样做是在已经允许的车与账号空间内再过滤，不能用一个人物名字跨账号搜索其他人的记忆。
位置：pages[K].sections[k-lesson-cross-device].paragraphs[2]；pages[K].teaching.lessons[k-lesson-cross-device].paragraphs[2]

## KB-114 共享乘客、多人在场与跨账号，是不同的数据范围
记忆系统 PRD·询问人最大集与在场人最小集
位置：pages[K].sections[k-lesson-cross-device].paragraphs[2]；pages[K].teaching.lessons[k-lesson-cross-device].paragraphs[2]

## KB-115 共享乘客、多人在场与跨账号，是不同的数据范围
记忆页面的展示规则与模型召回另行定义。
位置：pages[K].sections[k-lesson-cross-device].paragraphs[3]；pages[K].teaching.lessons[k-lesson-cross-device].paragraphs[3]

## KB-116 共享乘客、多人在场与跨账号，是不同的数据范围
PRD要求页面暂时只显示长期语义记忆，展示当前在场人的交集记忆；按人筛选的界面方案已划掉，但管理接口仍有按人查询或删除。
位置：pages[K].sections[k-lesson-cross-device].paragraphs[3]；pages[K].teaching.lessons[k-lesson-cross-device].paragraphs[3]

## KB-117 共享乘客、多人在场与跨账号，是不同的数据范围
不能由“接口支持按人”推定页面有这个按钮，也不能由“页面没有显示”推定后端没有相应记录。
位置：pages[K].sections[k-lesson-cross-device].paragraphs[3]；pages[K].teaching.lessons[k-lesson-cross-device].paragraphs[3]

## KB-118 共享乘客、多人在场与跨账号，是不同的数据范围
记忆系统 PRD·常规记忆露出及管理接口
位置：pages[K].sections[k-lesson-cross-device].paragraphs[3]；pages[K].teaching.lessons[k-lesson-cross-device].paragraphs[3]

## KB-119 共享乘客、多人在场与跨账号，是不同的数据范围
摘要没有完整绑定每一次在场组合，因此有独立清理规则。
位置：pages[K].sections[k-lesson-cross-device].paragraphs[4]；pages[K].teaching.lessons[k-lesson-cross-device].paragraphs[4]

## KB-120 共享乘客、多人在场与跨账号，是不同的数据范围
PRD以新注册乘客上车、未注册乘客人数增加判断新人，清除摘要中的敏感信息；单纯功能性偏好与涉及个人身份、关系、重要地点等内容要分开。
位置：pages[K].sections[k-lesson-cross-device].paragraphs[4]；pages[K].teaching.lessons[k-lesson-cross-device].paragraphs[4]

## KB-121 共享乘客、多人在场与跨账号，是不同的数据范围
未注册乘客换人但人数不增加，是文档明示的覆盖缺口，不应写成FaceID已经能完整识别所有换人。
位置：pages[K].sections[k-lesson-cross-device].paragraphs[4]；pages[K].teaching.lessons[k-lesson-cross-device].paragraphs[4]

## KB-122 共享乘客、多人在场与跨账号，是不同的数据范围
记忆系统 PRD·对话摘要隐私策略
位置：pages[K].sections[k-lesson-cross-device].paragraphs[4]；pages[K].teaching.lessons[k-lesson-cross-device].paragraphs[4]

## KB-123 共享乘客、多人在场与跨账号，是不同的数据范围
共享乘客也有两种含义。
位置：pages[K].sections[k-lesson-cross-device].paragraphs[5]；pages[K].teaching.lessons[k-lesson-cross-device].paragraphs[5]

## KB-124 共享乘客、多人在场与跨账号，是不同的数据范围
FaceID维度的共享，指这台车换登录账号后仍认识该乘客；记忆生成维度的共享，指主账号登录且共享乘客在车内时，相关记忆同时在相应的车与豆包账号空间生成。
位置：pages[K].sections[k-lesson-cross-device].paragraphs[5]；pages[K].teaching.lessons[k-lesson-cross-device].paragraphs[5]

## KB-125 共享乘客、多人在场与跨账号，是不同的数据范围
它是定义好的共同生成机制，不是自动开放两个账号互相读取全部历史。
位置：pages[K].sections[k-lesson-cross-device].paragraphs[5]；pages[K].teaching.lessons[k-lesson-cross-device].paragraphs[5]

## KB-126 共享乘客、多人在场与跨账号，是不同的数据范围
共享身份、共享生成与本轮召回权限必须分别检查。
位置：pages[K].sections[k-lesson-cross-device].paragraphs[5]；pages[K].teaching.lessons[k-lesson-cross-device].paragraphs[5]

## KB-127 共享乘客、多人在场与跨账号，是不同的数据范围
记忆系统 PRD·共享乘客与记忆生成
位置：pages[K].sections[k-lesson-cross-device].paragraphs[5]；pages[K].teaching.lessons[k-lesson-cross-device].paragraphs[5]

## KB-128 共享乘客、多人在场与跨账号，是不同的数据范围
手机与车辆之间再增加一个跨端来源。
位置：pages[K].sections[k-lesson-cross-device].paragraphs[6]；pages[K].teaching.lessons[k-lesson-cross-device].paragraphs[6]

## KB-129 共享乘客、多人在场与跨账号，是不同的数据范围
当前已核的记忆主线规则不能证明手机全部聊天、通讯录或私人记忆都可同步到车内。
位置：pages[K].sections[k-lesson-cross-device].paragraphs[6]；pages[K].teaching.lessons[k-lesson-cross-device].paragraphs[6]

## KB-130 共享乘客、多人在场与跨账号，是不同的数据范围
讲“手机给车一条信息”时，应只说明具体接口已授权传递的对象和用途；缺少跨端协议的字段、范围或落地证据，就不能补成全量同步。
位置：pages[K].sections[k-lesson-cross-device].paragraphs[6]；pages[K].teaching.lessons[k-lesson-cross-device].paragraphs[6]

## KB-131 共享乘客、多人在场与跨账号，是不同的数据范围
用户主动交给车端一个地点，也不代表把手机全部个人记忆授权给在场乘客。
位置：pages[K].sections[k-lesson-cross-device].paragraphs[6]；pages[K].teaching.lessons[k-lesson-cross-device].paragraphs[6]

## KB-132 先确认要记的地点，再让导航使用同一份地址
用户说「记下我家在麦当劳」，实际要求是保存一个以后可用的地点。
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[1]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[1]

## KB-133 先确认要记的地点，再让导航使用同一份地址
不能只记下这几个字，就宣称下一次能够准确回家：同一个城市可能有多家麦当劳，另一个城市也可能同名。
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[1]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[1]

## KB-134 先确认要记的地点，再让导航使用同一份地址
指定的《豆包记忆和车机记忆打通方案》要求完整 POI 名称和城市必选，并列出 POI ID、经纬度、地址等结构化字段。
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[1]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[1]

## KB-135 先确认要记的地点，再让导航使用同一份地址
POI 指地图里的地点对象，名称是显示给人的名称，ID 是地点标识，二者不能互相混叫。
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[1]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[1]

## KB-136 先确认要记的地点，再让导航使用同一份地址
打通方案·导航相关记忆同步
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[1]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[1]

## KB-137 先确认要记的地点，再让导航使用同一份地址
旧方法通过 FC 输出常用地址设置函数，把家、公司或常用地址存在导航应用内。
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[2]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[2]

## KB-138 先确认要记的地点，再让导航使用同一份地址
打通方案转为通过豆包记忆保存这些内容，地图展示和快捷导航再使用这份数据。
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[2]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[2]

## KB-139 先确认要记的地点，再让导航使用同一份地址
它解决的是个人记忆与地图各存一份、彼此不同步的问题；不能因此说地图不再有本地数据，后续离线方案恰恰需要把可使用的地址结构化同步到端上。
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[2]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[2]

## KB-140 先确认要记的地点，再让导航使用同一份地址
打通方案
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[2]；pages[K].sections[k-lesson-poi-sync].paragraphs[4]；pages[K].sections[k-lesson-seat-mem].paragraphs[3]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[2]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[4]；pages[K].teaching.lessons[k-lesson-seat-mem].paragraphs[3]；pages[K].teaching.guides.base.paragraphs[6]；base.modules[K].nodes[K15].paragraphs[2]

## KB-141 先确认要记的地点，再让导航使用同一份地址
写入前谁负责补地点，文档保留了三条方案。
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[3]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[3]

## KB-142 先确认要记的地点，再让导航使用同一份地址
第一条由 DT 先判断核心信息是否完整，缺少则先调用 POI 搜索，再存记忆；第二条让记忆工具内部去调用 POI 搜索；第三条由记忆工具返回缺项，DT 根据返回消息再搜索和写入。
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[3]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[3]

## KB-143 先确认要记的地点，再让导航使用同一份地址
三条区别在谁发现缺项、谁调用搜索，目的都是先确定实际地点。
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[3]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[3]

## KB-144 先确认要记的地点，再让导航使用同一份地址
11 月 4 日会中01:03:30收口采用了 DT 先判断、缺项先搜索确认再存的方向；文档仍并列展示历史方案，不能把三条写成同时执行，也不能据讨论方向宣称全部已上线。
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[3]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[3]

## KB-145 先确认要记的地点，再让导航使用同一份地址
打通方案 文字记录01:03:30
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[3]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[3]

## KB-146 先确认要记的地点，再让导航使用同一份地址
例如用户说公司在某个街道门牌，POI 搜索返回两个地点，DT 应让用户确认要保存哪一个，拿到确认后的城市和完整名称再调用记忆工具。
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[4]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[4]

## KB-147 先确认要记的地点，再让导航使用同一份地址
搜索工具完成表示找到候选；用户选点表示确认一个对象；记忆写入成功才表示存下了这条地址。
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[4]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[4]

## KB-148 先确认要记的地点，再让导航使用同一份地址
搜索结果、用户确认和写入回执要分别留在这一轮中，不能拿「已找到」替代「已记住」。
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[4]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[4]

## KB-149 先确认要记的地点，再让导航使用同一份地址
选点界面还存在实际体验问题。
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[5]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[5]

## KB-150 先确认要记的地点，再让导航使用同一份地址
原导航卡可能在用户手点候选后继续算路，用户本来只是想保存地址，却进入导航流程。
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[5]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[5]

## KB-151 先确认要记的地点，再让导航使用同一份地址
11 月 4 日讨论中，这正是语音选点和手点是否同等支持的争议；不能简单写成「语音说第三个或手点都可以，选完就存」。
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[5]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[5]

## KB-152 先确认要记的地点，再让导航使用同一份地址
验收必须分别看语音确认、手动点击以及用户转去闲聊三条路径，确认选点结果能返回本次保存流程，不会擅自把保存意图改成出发。
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[5]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[5]

## KB-153 先确认要记的地点，再让导航使用同一份地址
文字记录01:04至01:13
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[5]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[5]

## KB-154 先确认要记的地点，再让导航使用同一份地址
后续用户说「导航回家」，先取当前可使用的这位用户的家地址。
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[6]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[6]

## KB-155 先确认要记的地点，再让导航使用同一份地址
文档给出的改写格式是「导航去{城市名}{完整POI名称}，直接开始导航」，再调用 Navi 导航工具。
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[6]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[6]

## KB-156 先确认要记的地点，再让导航使用同一份地址
城市不能省略，否则去外地时，同名地点可能匹配到当前位置附近。
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[6]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[6]

## KB-157 先确认要记的地点，再让导航使用同一份地址
无需二次选点是方案目标，仍要用跨城同名地点、多个家庭成员和记忆修改后的数据验证，不能用一次成功演示当全场景保证。
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[6]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[6]

## KB-158 先确认要记的地点，再让导航使用同一份地址
打通方案·用户后续消费需求
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[6]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[6]

## KB-159 先确认要记的地点，再让导航使用同一份地址
文档没有把 POI ID 标成必选，也没有写禁止保存 ID。
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[7]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[7]

## KB-160 先确认要记的地点，再让导航使用同一份地址
会中有人认为完整名称可以强匹配，有人担忧跨城同名和地图变化。
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[7]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[7]

## KB-161 先确认要记的地点，再让导航使用同一份地址
这意味着应分别核对记忆存什么、导航输入接受什么、下游如何精确定位。
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[7]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[7]

## KB-162 先确认要记的地点，再让导航使用同一份地址
不能把「名称目前能用」改写成「不用ID」，也不能把一个图商的地点 ID 当作跨图商永久通用标识。
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[7]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[7]

## KB-163 先确认要记的地点，再让导航使用同一份地址
打通方案 文字记录00:58至01:03
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[7]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[7]

## KB-164 先确认要记的地点，再让导航使用同一份地址
地图端的设置入口和显示入口是不同改动。
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[8]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[8]

## KB-165 先确认要记的地点，再让导航使用同一份地址
指定文档划掉了原手动填写或修改家、公司的方案，保留显示位置、已有位置时点击导航，并写点击事件模拟「导航回家」请求。
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[8]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[8]

## KB-166 先确认要记的地点，再让导航使用同一份地址
模拟请求是在用户点击后生成一条等价的业务输入，不需要用户真的再说一遍，也不用重新走语音识别。
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[8]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[8]

## KB-167 先确认要记的地点，再让导航使用同一份地址
是否已完成车企端改造，仍需对应版本的交付证据。
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[8]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[8]

## KB-168 先确认要记的地点，再让导航使用同一份地址
打通方案·待定项及手动点击
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[8]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[8]

## KB-169 先确认要记的地点，再让导航使用同一份地址
离线消费是11月4日讨论的另一条路线：联网时把授权范围内的个人地址转成端侧结构化映射，包含身份与家、公司等地点；断网后按当前身份选取已有地址，多人对应多个家时再澄清。
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[9]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[9]

## KB-170 先确认要记的地点，再让导航使用同一份地址
这不等于断网时能够新增、修改云端记忆。
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[9]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[9]

## KB-171 先确认要记的地点，再让导航使用同一份地址
同步时间、更新失败、删除后本地副本清理和身份无法确认时的行为，都要成为落地规则，不能只写「同步一份就能离线回家」。
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[9]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[9]

## KB-172 先确认要记的地点，再让导航使用同一份地址
文字记录01:28至01:35
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[9]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[9]

## KB-173 先确认要记的地点，再让导航使用同一份地址
记忆开关关闭时，用户要求保存家或公司，指定文档要求先提示打开记忆开关。
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[10]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[10]

## KB-174 先确认要记的地点，再让导航使用同一份地址
会中早段曾讨论让地址例外保存，但后段01:35:46收口仍为统一受开关限制。
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[10]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[10]

## KB-175 先确认要记的地点，再让导航使用同一份地址
不能把早段提议改写成关闭后也记录，更不能把会议中的合规意见当成已核验法律条款。
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[10]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[10]

## KB-176 先确认要记的地点，再让导航使用同一份地址
这里使用产品已写明的授权与开关规则。
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[10]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[10]

## KB-177 先确认要记的地点，再让导航使用同一份地址
打通方案 文字记录01:35:46
位置：pages[K].sections[k-lesson-poi-sync].paragraphs[10]；pages[K].teaching.lessons[k-lesson-poi-sync].paragraphs[10]

## KB-178 把这个人的常用偏好整理出来，不把家人的喜好装到他身上
用户画像帮助Director了解这个人的相对稳定信息。
位置：pages[K].sections[k-lesson-profile].paragraphs[1]；pages[K].teaching.lessons[k-lesson-profile].paragraphs[1]

## KB-179 把这个人的常用偏好整理出来，不把家人的喜好装到他身上
PRD写已经实现的语义记忆画像是固定注入，未做检索逻辑；更完整的自然语言画像和关系建模列为长期方案。
位置：pages[K].sections[k-lesson-profile].paragraphs[1]；pages[K].teaching.lessons[k-lesson-profile].paragraphs[1]

## KB-180 把这个人的常用偏好整理出来，不把家人的喜好装到他身上
画像来自哪类资料，决定能说到什么程度，不能把设想中的完整人设当成每轮已经注入的事实。
位置：pages[K].sections[k-lesson-profile].paragraphs[1]；pages[K].teaching.lessons[k-lesson-profile].paragraphs[1]

## KB-181 把这个人的常用偏好整理出来，不把家人的喜好装到他身上
记忆系统 PRD·增加用户画像
位置：pages[K].sections[k-lesson-profile].paragraphs[1]；pages[K].teaching.lessons[k-lesson-profile].paragraphs[1]

## KB-182 把这个人的常用偏好整理出来，不把家人的喜好装到他身上
从长期情景记忆里归纳用户规律，是另一路推断。
位置：pages[K].sections[k-lesson-profile].paragraphs[2]；pages[K].teaching.lessons[k-lesson-profile].paragraphs[2]

## KB-183 把这个人的常用偏好整理出来，不把家人的喜好装到他身上
PRD写对应情景画像算法已有实现，但当时实际未使用，更完整方案仍未实现。
位置：pages[K].sections[k-lesson-profile].paragraphs[2]；pages[K].teaching.lessons[k-lesson-profile].paragraphs[2]

## KB-184 把这个人的常用偏好整理出来，不把家人的喜好装到他身上
一次开座椅通风只能证明这次操作，反复操作是否足以说明夏天偏好、是否要限定同乘场景，还要经过归纳与验证。
位置：pages[K].sections[k-lesson-profile].paragraphs[2]；pages[K].teaching.lessons[k-lesson-profile].paragraphs[2]

## KB-185 把这个人的常用偏好整理出来，不把家人的喜好装到他身上
不能把某个夜间或周五更新节奏写成没有对应版本依据的上线规则。
位置：pages[K].sections[k-lesson-profile].paragraphs[2]；pages[K].teaching.lessons[k-lesson-profile].paragraphs[2]

## KB-186 把这个人的常用偏好整理出来，不把家人的喜好装到他身上
记忆系统 PRD·从情景记忆总结语义记忆
位置：pages[K].sections[k-lesson-profile].paragraphs[2]；pages[K].teaching.lessons[k-lesson-profile].paragraphs[2]

## KB-187 把这个人的常用偏好整理出来，不把家人的喜好装到他身上
语义记忆挂在具体主体名下。
位置：pages[K].sections[k-lesson-profile].paragraphs[3]；pages[K].teaching.lessons[k-lesson-profile].paragraphs[3]

## KB-188 把这个人的常用偏好整理出来，不把家人的喜好装到他身上
画像归纳要尊重这套在场边界，不能因为同属一个家庭账号，就把副驾的口味偏好装进主驾的画像；也不能因为两个人经常同车，就把两人共同的喜好自动写成每个人的独立偏好。
位置：pages[K].sections[k-lesson-profile].paragraphs[3]；pages[K].teaching.lessons[k-lesson-profile].paragraphs[3]

## KB-189 把这个人的常用偏好整理出来，不把家人的喜好装到他身上
画像的每条偏好都要能追溯到是谁在什么场景下说的，不能只有一个模糊的「这个家庭喜欢」。
位置：pages[K].sections[k-lesson-profile].paragraphs[3]；pages[K].teaching.lessons[k-lesson-profile].paragraphs[3]

## KB-190 把这个人的常用偏好整理出来，不把家人的喜好装到他身上
负反馈要被识别并调整，例如乘客说「别再推荐这类歌了」，这条反馈要反映到后续推荐和画像里，不能左耳进右耳出。
位置：pages[K].sections[k-lesson-profile].paragraphs[4]；pages[K].teaching.lessons[k-lesson-profile].paragraphs[4]

## KB-191 把这个人的常用偏好整理出来，不把家人的喜好装到他身上
但该项标注为低优先排期、待核状态，负反馈具体落入哪一层画像、多久生效尚无终版方案，评审时不能讲成全车型已经自动调整。
位置：pages[K].sections[k-lesson-profile].paragraphs[4]；pages[K].teaching.lessons[k-lesson-profile].paragraphs[4]

## KB-192 把这个人的常用偏好整理出来，不把家人的喜好装到他身上
用户要能看见被记了什么、能删掉，逐条查看和删除能力按车型逐步开放，具体开放清单待核。
位置：pages[K].sections[k-lesson-profile].paragraphs[5]；pages[K].teaching.lessons[k-lesson-profile].paragraphs[5]

## KB-193 把这个人的常用偏好整理出来，不把家人的喜好装到他身上
记忆查询和删除接口由记忆服务建设，管理页面由各车企客户开发，不能在所有项目上承诺相同界面；画像在每轮请求中固定注入，但注入的是当前乘客的基础画像，不是全车共享的偏好包。
位置：pages[K].sections[k-lesson-profile].paragraphs[5]；pages[K].teaching.lessons[k-lesson-profile].paragraphs[5]

## KB-194 把这个人的常用偏好整理出来，不把家人的喜好装到他身上
用户明确事实、画像概括与情景经历在使用时各有角色。
位置：pages[K].sections[k-lesson-profile].paragraphs[6]；pages[K].teaching.lessons[k-lesson-profile].paragraphs[6]

## KB-195 把这个人的常用偏好整理出来，不把家人的喜好装到他身上
画像可以提供常用背景，具体经历仍按本轮查询与权限取回。
位置：pages[K].sections[k-lesson-profile].paragraphs[6]；pages[K].teaching.lessons[k-lesson-profile].paragraphs[6]

## KB-196 把这个人的常用偏好整理出来，不把家人的喜好装到他身上
页面露出的长期语义记忆、模型固定注入的画像和按场景召回的情景记忆不是同一展示对象。
位置：pages[K].sections[k-lesson-profile].paragraphs[6]；pages[K].teaching.lessons[k-lesson-profile].paragraphs[6]

## KB-197 把这个人的常用偏好整理出来，不把家人的喜好装到他身上
删除语义记忆以后还要更新画像，避免已删除偏好从画像再次进入回答。
位置：pages[K].sections[k-lesson-profile].paragraphs[6]；pages[K].teaching.lessons[k-lesson-profile].paragraphs[6]

## KB-198 把这个人的常用偏好整理出来，不把家人的喜好装到他身上
记忆系统 PRD·画像及删除影响
位置：pages[K].sections[k-lesson-profile].paragraphs[6]；pages[K].teaching.lessons[k-lesson-profile].paragraphs[6]

## KB-199 泳馆找错时，沿生成、查询和采用分别定位
用户反馈「你不记得了」不能笼统归给记忆模型，要拆成生产、召回、使用三段分别定位。
位置：pages[K].sections[k-lesson-quality].paragraphs[1]；pages[K].teaching.lessons[k-lesson-quality].paragraphs[1]

## KB-200 泳馆找错时，沿生成、查询和采用分别定位
K15（沿生成、检索和采用定位遗忘）把问题拆成三段。
位置：pages[K].sections[k-lesson-quality].paragraphs[1]；pages[K].teaching.lessons[k-lesson-quality].paragraphs[1]

## KB-201 泳馆找错时，沿生成、查询和采用分别定位
第一段看生产：事件和记住请求有没有进入队列，生成任务是待处理还是成功，记忆是否真的落库。
位置：pages[K].sections[k-lesson-quality].paragraphs[1]；pages[K].teaching.lessons[k-lesson-quality].paragraphs[1]

## KB-202 泳馆找错时，沿生成、查询和采用分别定位
第二段看召回：检索标签、权限过滤、排序打分有没有把这条记忆筛掉。
位置：pages[K].sections[k-lesson-quality].paragraphs[1]；pages[K].teaching.lessons[k-lesson-quality].paragraphs[1]

## KB-203 泳馆找错时，沿生成、查询和采用分别定位
第三段看使用：记忆已经回到 Director，回答时有没有被采纳。
位置：pages[K].sections[k-lesson-quality].paragraphs[2]；pages[K].teaching.lessons[k-lesson-quality].paragraphs[2]

## KB-204 泳馆找错时，沿生成、查询和采用分别定位
三段要留下同一个案例的日志证据，分别对应记忆服务、上下文检索和 Director 推理，避免互相推诿。
位置：pages[K].sections[k-lesson-quality].paragraphs[2]；pages[K].teaching.lessons[k-lesson-quality].paragraphs[2]

## KB-205 泳馆找错时，沿生成、查询和采用分别定位
记忆是异步生成的，用户听到「好的记住了」只是受理回执，不代表长期记忆已经生成完成；测试和评审要分别核对受理、生成成功、召回命中、回答采用四个状态。
位置：pages[K].sections[k-lesson-quality].paragraphs[2]；pages[K].teaching.lessons[k-lesson-quality].paragraphs[2]

## KB-206 泳馆找错时，沿生成、查询和采用分别定位
按汽车记忆测试方案，记忆批量生成覆盖率目标为 90%，这是方案目标不是当前实测成绩。
位置：pages[K].sections[k-lesson-quality].paragraphs[3]；pages[K].teaching.lessons[k-lesson-quality].paragraphs[3]

## KB-207 泳馆找错时，沿生成、查询和采用分别定位
功能准出要求核心用例通过率 100%、重要用例不低于 95%、一般用例不低于 90%。
位置：pages[K].sections[k-lesson-quality].paragraphs[3]；pages[K].teaching.lessons[k-lesson-quality].paragraphs[3]

## KB-208 泳馆找错时，沿生成、查询和采用分别定位
压缩摘要单次耗时1.7到1.8秒是11月4日会上口头反馈的实测值，不是正式指标口径，评审引用时要说明这是会上的实测反馈。
位置：pages[K].sections[k-lesson-quality].paragraphs[3]；pages[K].teaching.lessons[k-lesson-quality].paragraphs[3]

## KB-209 泳馆找错时，沿生成、查询和采用分别定位
记忆打标、画像生成、行为归纳和召回的各专项指标在测试方案中分阶段验收，旧报告里的历史成绩不能冒充当前准出口径。
位置：pages[K].sections[k-lesson-quality].paragraphs[4]；pages[K].teaching.lessons[k-lesson-quality].paragraphs[4]

## KB-210 泳馆找错时，沿生成、查询和采用分别定位
跨车、跨账号、新乘客上车的隐私隔离要单独构造样本验证，不能只测主驾单人场景；人脸注册、座位识别和记忆中心露出能力按车型配置开放。
位置：pages[K].sections[k-lesson-quality].paragraphs[4]；pages[K].teaching.lessons[k-lesson-quality].paragraphs[4]

## KB-211 泳馆找错时，沿生成、查询和采用分别定位
不支持人脸的车型按匿名身份降级响应，具体选配表待项目确认。
位置：pages[K].sections[k-lesson-quality].paragraphs[5]；pages[K].teaching.lessons[k-lesson-quality].paragraphs[5]

## KB-212 泳馆找错时，沿生成、查询和采用分别定位
回到游泳馆例子：主驾说完这句话，系统先核出说话人是车主账号下已注册的主驾乘客，确认记忆开关开启，再由最近对话和预注入取回昨天去游泳馆的情景记录和相关餐厅偏好；如果预注入没带出来，Director 再发起带对象和时间范围的显式检索。
位置：pages[K].sections[k-lesson-quality].paragraphs[5]；pages[K].teaching.lessons[k-lesson-quality].paragraphs[5]

## KB-213 泳馆找错时，沿生成、查询和采用分别定位
复核本例时，先看权限核对是否发生在检索前，再看召回范围是否符合当前在场人规则。
位置：pages[K].sections[k-lesson-quality].paragraphs[6]；pages[K].teaching.lessons[k-lesson-quality].paragraphs[6]

## KB-214 泳馆找错时，沿生成、查询和采用分别定位
删除另查对象和影响：语义记忆删除后更新画像，历史输入与摘要单独清理。
位置：pages[K].sections[k-lesson-quality].paragraphs[6]；pages[K].teaching.lessons[k-lesson-quality].paragraphs[6]

## KB-215 泳馆找错时，沿生成、查询和采用分别定位
用户说“你不记得了”，要说明信息丢在记录、生成、检索还是回答采用这一段；用户说“你怎么还记得”，则核对删除结果和残留来源。
位置：pages[K].sections[k-lesson-quality].paragraphs[6]；pages[K].teaching.lessons[k-lesson-quality].paragraphs[6]

## KB-216 车机保存物理位置，豆包记住这个位置的用途
「把座椅存到坐姿2」和「这个姿势是我午休用的」提供了不同信息。
位置：pages[K].sections[k-lesson-seat-mem].paragraphs[1]；pages[K].teaching.lessons[k-lesson-seat-mem].paragraphs[1]

## KB-217 车机保存物理位置，豆包记住这个位置的用途
前一句把当前物理位置保存到一个槽位；后一句把槽位与用户说出的用途联系起来。
位置：pages[K].sections[k-lesson-seat-mem].paragraphs[1]；pages[K].teaching.lessons[k-lesson-seat-mem].paragraphs[1]

## KB-218 车机保存物理位置，豆包记住这个位置的用途
指定打通方案写明豆包只记位置 ID，不记座椅、方向盘、后视镜的具体位置数据，物理数据留在车机本地账号体系，动作通过车企提供的原子接口完成。
位置：pages[K].sections[k-lesson-seat-mem].paragraphs[1]；pages[K].teaching.lessons[k-lesson-seat-mem].paragraphs[1]

## KB-219 车机保存物理位置，豆包记住这个位置的用途
打通方案·驾驶相关记忆同步
位置：pages[K].sections[k-lesson-seat-mem].paragraphs[1]；pages[K].teaching.lessons[k-lesson-seat-mem].paragraphs[1]

## KB-220 车机保存物理位置，豆包记住这个位置的用途
文档给出了保存到指定位置、保存当前位置、位置改名、调整到指定位置四类接口。
位置：pages[K].sections[k-lesson-seat-mem].paragraphs[2]；pages[K].teaching.lessons[k-lesson-seat-mem].paragraphs[2]

## KB-221 车机保存物理位置，豆包记住这个位置的用途
用户调好座椅后说「帮我把这个位置保存，这是我的驾驶位置」，先经车控保存当前位置，同时获取当前位置 ID；保存结果及这个 ID 回来以后，才把「这个人的驾驶位置对应坐姿1」存入记忆。
位置：pages[K].sections[k-lesson-seat-mem].paragraphs[2]；pages[K].teaching.lessons[k-lesson-seat-mem].paragraphs[2]

## KB-222 车机保存物理位置，豆包记住这个位置的用途
当前位置 ID 来自车企保存或位置接口，不能写成记忆工具自行读取座椅当前位置。
位置：pages[K].sections[k-lesson-seat-mem].paragraphs[2]；pages[K].teaching.lessons[k-lesson-seat-mem].paragraphs[2]

## KB-223 车机保存物理位置，豆包记住这个位置的用途
打通方案·用户场景1
位置：pages[K].sections[k-lesson-seat-mem].paragraphs[2]；pages[K].teaching.lessons[k-lesson-seat-mem].paragraphs[2]

## KB-224 车机保存物理位置，豆包记住这个位置的用途
后续用户说「调到我的驾驶位置」，DT 先查用途对应的槽位，再把请求改写为「把座椅位置调整成坐姿1」，调用位置调整接口。
位置：pages[K].sections[k-lesson-seat-mem].paragraphs[3]；pages[K].teaching.lessons[k-lesson-seat-mem].paragraphs[3]

## KB-225 车机保存物理位置，豆包记住这个位置的用途
查到映射不表示座椅已经移动；调用被受理不表示已到位，仍要等车控返回实际结果，并遵守本车当前状态与安全限制。
位置：pages[K].sections[k-lesson-seat-mem].paragraphs[3]；pages[K].teaching.lessons[k-lesson-seat-mem].paragraphs[3]

## KB-226 车机保存物理位置，豆包记住这个位置的用途
缺少映射时，可以澄清是哪个已保存位置，不能凭「午休」猜一组物理坐标。
位置：pages[K].sections[k-lesson-seat-mem].paragraphs[3]；pages[K].teaching.lessons[k-lesson-seat-mem].paragraphs[3]

## KB-227 车机保存物理位置，豆包记住这个位置的用途
用户仅手动按保存，没有说用途，车机照常保存物理槽位，不必每次主动追问「这个位置是干什么的」。
位置：pages[K].sections[k-lesson-seat-mem].paragraphs[4]；pages[K].teaching.lessons[k-lesson-seat-mem].paragraphs[4]

## KB-228 车机保存物理位置，豆包记住这个位置的用途
11 月 4 日会中明确担心这种反复问话打扰用户；指定文档也划掉了手动保存后模拟请求写豆包记忆的旧场景。
位置：pages[K].sections[k-lesson-seat-mem].paragraphs[4]；pages[K].teaching.lessons[k-lesson-seat-mem].paragraphs[4]

## KB-229 车机保存物理位置，豆包记住这个位置的用途
以后用户说「坐姿2是我的午休位置」时，才有证据建立用途映射。
位置：pages[K].sections[k-lesson-seat-mem].paragraphs[4]；pages[K].teaching.lessons[k-lesson-seat-mem].paragraphs[4]

## KB-230 车机保存物理位置，豆包记住这个位置的用途
按了一次保存不能被自动归纳成长期偏好。
位置：pages[K].sections[k-lesson-seat-mem].paragraphs[4]；pages[K].teaching.lessons[k-lesson-seat-mem].paragraphs[4]

## KB-231 车机保存物理位置，豆包记住这个位置的用途
文字记录01:42至01:45 打通方案
位置：pages[K].sections[k-lesson-seat-mem].paragraphs[4]；pages[K].teaching.lessons[k-lesson-seat-mem].paragraphs[4]

## KB-232 车机保存物理位置，豆包记住这个位置的用途
方向盘和后视镜要按日期看。
位置：pages[K].sections[k-lesson-seat-mem].paragraphs[5]；pages[K].teaching.lessons[k-lesson-seat-mem].paragraphs[5]

## KB-233 车机保存物理位置，豆包记住这个位置的用途
文档保留的10月21日背景说二者没有账号绑定记忆；11月3日补充却说可与座椅位置配套，并列出驾驶位打包保存的暂定方案。
位置：pages[K].sections[k-lesson-seat-mem].paragraphs[5]；pages[K].teaching.lessons[k-lesson-seat-mem].paragraphs[5]

## KB-234 车机保存物理位置，豆包记住这个位置的用途
两段不能同时作为当前现状。
位置：pages[K].sections[k-lesson-seat-mem].paragraphs[5]；pages[K].teaching.lessons[k-lesson-seat-mem].paragraphs[5]

## KB-235 车机保存物理位置，豆包记住这个位置的用途
讲本次方向时以较新的配套说明为依据，保留尚待最终方案同步的状态，不把旧背景当作永远不支持。
位置：pages[K].sections[k-lesson-seat-mem].paragraphs[5]；pages[K].teaching.lessons[k-lesson-seat-mem].paragraphs[5]

## KB-236 车机保存物理位置，豆包记住这个位置的用途
打通方案·沟通记录及驾驶能力
位置：pages[K].sections[k-lesson-seat-mem].paragraphs[5]；pages[K].teaching.lessons[k-lesson-seat-mem].paragraphs[5]

## KB-237 车机保存物理位置，豆包记住这个位置的用途
11 月 4 日讨论自由语义用途记忆时，对离线支持保持限制。
位置：pages[K].sections[k-lesson-seat-mem].paragraphs[6]；pages[K].teaching.lessons[k-lesson-seat-mem].paragraphs[6]

## KB-238 车机保存物理位置，豆包记住这个位置的用途
这限制的是断网后能否完成「我午休的位置」这类语义查询与记忆闭环，不等于车端位置1、2、3的物理保存不能离线。
位置：pages[K].sections[k-lesson-seat-mem].paragraphs[6]；pages[K].teaching.lessons[k-lesson-seat-mem].paragraphs[6]

## KB-239 车机保存物理位置，豆包记住这个位置的用途
两套能力需要分别验收：本地槽位保存和调整、联网记忆写入、用途查询、身份切换后的映射使用。
位置：pages[K].sections[k-lesson-seat-mem].paragraphs[6]；pages[K].teaching.lessons[k-lesson-seat-mem].paragraphs[6]

## KB-240 车机保存物理位置，豆包记住这个位置的用途
不能用「离线DT推理不了语义」这种没有模型评测支持的解释替代当前项目的能力边界。
位置：pages[K].sections[k-lesson-seat-mem].paragraphs[6]；pages[K].teaching.lessons[k-lesson-seat-mem].paragraphs[6]

## KB-241 车机保存物理位置，豆包记住这个位置的用途
文字记录01:46至01:47
位置：pages[K].sections[k-lesson-seat-mem].paragraphs[6]；pages[K].teaching.lessons[k-lesson-seat-mem].paragraphs[6]

## KB-242 开篇与收尾
主驾说「带我去昨天那家游泳馆附近的餐厅」。
位置：pages[K].teaching.intro[1]

## KB-243 开篇与收尾
系统先要弄清昨天去了哪一家，才有位置可以查附近餐厅。
位置：pages[K].teaching.intro[1]

## KB-244 开篇与收尾
如果主驾紧接着说「就去第二家」，需要的是刚才的候选列表；如果问的是昨天的经历，可能要查情景记忆；如果补一句「我不吃香菜」，则要保留这位乘客明确表达的偏好。
位置：pages[K].teaching.intro[1]

## KB-245 开篇与收尾
三种信息都和过去有关，用途却不同，不能只用一个「记忆」概括。
位置：pages[K].teaching.intro[1]

## KB-246 开篇与收尾
本章先讲说话人、账号和授权怎样决定可用数据，再讲历史输入、摘要和记忆服务分别提供什么。
位置：pages[K].teaching.intro[2]

## KB-247 开篇与收尾
最近原话帮助接上当前对话；对话摘要帮助保住已经退出原话窗口的内容；短期和长期记忆用于保存、归纳和查询经历及事实。
位置：pages[K].teaching.intro[2]

## KB-248 开篇与收尾
查到一条记忆以后，仍由 Director 结合当前需求决定下一步，记忆服务不会因为查到泳馆就自行开始导航。
位置：pages[K].teaching.intro[2]

## KB-249 开篇与收尾
11 月 4 日讨论把人人对话和事件补进历史输入，并扩大摘要处理的内容。
位置：pages[K].teaching.intro[3]

## KB-250 开篇与收尾
这次改变的是输入范围及处理规则，不能凭名字把它讲成又增加一个数据库。
位置：pages[K].teaching.intro[3]

## KB-251 开篇与收尾
PRD 在开关部分列出对话摘要、瞬时记忆、短期记忆、长期语义记忆和长期情景记忆，并把瞬时记忆标为当时未使用。
位置：pages[K].teaching.intro[3]

## KB-252 开篇与收尾
下面按用途逐项解释，同时把旧 PRD、当天讨论与未验证的上线状态分开。
位置：pages[K].teaching.intro[3]

## KB-253 开篇与收尾
记忆系统 PRD 11月4日文字记录
位置：pages[K].teaching.intro[3]

## KB-254 开篇与收尾
这一章定义的是身份怎样解析、记忆各层按权限怎样生产与取回、删除和开关怎样改到正确的内容，不定义事件怎样产生、字段怎样治理。
位置：pages[K].teaching.closing[1]

## KB-255 开篇与收尾
评审时分别核对：设家或公司是否受记忆开关限制，座椅是否只在用途明确时建立个人映射，历史输入和摘要是否按约定纳入人人对话及事件。
位置：pages[K].teaching.closing[2]

## KB-256 开篇与收尾
11 月 4 日讨论的改造需用实际提测和发布记录确认，不能仅凭排期当成线上现状。
位置：pages[K].teaching.closing[2]

## KB-257 总图导读
先从图左侧确认当前说话人、座位和可信账号关系，再分清本次是记录、查询还是删除。
位置：pages[K].teaching.guides.base.paragraphs[1]

## KB-258 总图导读
近期原话与摘要供当前对话接续；记忆服务另行组织经历和个人事实，供后续合法查询。
位置：pages[K].teaching.guides.base.paragraphs[1]

## KB-259 总图导读
图中生产与取回的箭头说明交接位置，不表示所有信息都要先过摘要、再过短期、最后进入长期。
位置：pages[K].teaching.guides.base.paragraphs[1]

## KB-260 总图导读
开关与多人隐私限制贯穿每一种操作。
位置：pages[K].teaching.guides.base.paragraphs[1]

## KB-261 总图导读
最上面的入口是 K01（先确定车辆与账号范围）。
位置：pages[K].teaching.guides.base.paragraphs[2]

## KB-262 总图导读
车辆唯一标识、车企账号、统一火山账号、车内自然人标识四层对象从车企云可信关系解析，客户端上报的「我是车主」不可信。
位置：pages[K].teaching.guides.base.paragraphs[2]

## KB-263 总图导读
三层索引：统一账号定任务归属、车企账号定成员可见范围、自然人标识定记忆挂在谁头上。
位置：pages[K].teaching.guides.base.paragraphs[2]

## KB-264 总图导读
身份解析后进 K02（把乘客身份接到个人内容）。
位置：pages[K].teaching.guides.base.paragraphs[3]

## KB-265 总图导读
人脸主识别、声纹补充，生物特征留端侧，云端只用身份标识。
位置：pages[K].teaching.guides.base.paragraphs[3]

## KB-266 总图导读
未注册脸进匿名上下文，同名乘客靠座位和声纹消歧，空座位不生成假身份。
位置：pages[K].teaching.guides.base.paragraphs[3]

## KB-267 总图导读
介绍认识要抽姓名和座位两个槽位，都非空才触发人脸注册。
位置：pages[K].teaching.guides.base.paragraphs[3]

## KB-268 总图导读
生产与取回要分开看：原始输入可以供当前对话使用；较早内容由摘要保持连续性；记忆服务保存并组织近期或跨对话的经历和事实。
位置：pages[K].teaching.guides.base.paragraphs[4]

## KB-269 总图导读
PRD 列出的各记忆类型并非五个串行数据库，瞬时记忆在该稿标为未使用。
位置：pages[K].teaching.guides.base.paragraphs[4]

## KB-270 总图导读
11 月 4 日新增人人对话和事件的范围、计数及覆盖衔接，应按本章对应说明核对，不从图的箭头反推已上线顺序。
位置：pages[K].teaching.guides.base.paragraphs[4]

## KB-271 总图导读
取回路从 K07（在本轮推理前准备背景）开始。
位置：pages[K].teaching.guides.base.paragraphs[5]

## KB-272 总图导读
预注入并行取画像和相关记忆，授权核对在检索之前。
位置：pages[K].teaching.guides.base.paragraphs[5]

## KB-273 总图导读
K08（先匹配标签，再给候选排序）先按标签剪枝再按得分排序。
位置：pages[K].teaching.guides.base.paragraphs[5]

## KB-274 总图导读
预注入不够走 K09（信息不足时显式查询记忆），结果分没查到、无权限、异常三种话术。
位置：pages[K].teaching.guides.base.paragraphs[5]

## KB-275 总图导读
地点支路先确认城市和完整 POI 名称，再保存和消费；名称能匹配不代表已经排除同名或无需 ID。
位置：pages[K].teaching.guides.base.paragraphs[6]

## KB-276 总图导读
座椅支路先由车机保存物理位置并返回位置 ID，用户表达用途时再存个人用途映射。
位置：pages[K].teaching.guides.base.paragraphs[6]

## KB-277 总图导读
新接口和端侧同步是打通方案，实际可用范围需按车辆版本验证。
位置：pages[K].teaching.guides.base.paragraphs[6]

## KB-278 总图导读
记录与查询先过 K03（按入口检查记忆使用条件）。
位置：pages[K].teaching.guides.base.paragraphs[7]

## KB-279 总图导读
K11（关闭后冻结已有记忆）停止记录、生成和召回，近期原话仍可用于当前对话。
位置：pages[K].teaching.guides.base.paragraphs[7]

## KB-280 总图导读
删除时在 K13（按入口选择删除对象和范围）分清语义、情景、按人或按时间；K14（清理源内容并更新关联产物）核实际删除结果。
位置：pages[K].teaching.guides.base.paragraphs[7]

## KB-281 总图导读
删除语义记忆要更新画像，清空历史输入和摘要另走对应接口，不能承诺删一条就清掉所有日志。
位置：pages[K].teaching.guides.base.paragraphs[7]

## KB-282 总图导读
排查时按 K15（沿生成、检索和采用定位遗忘）三段分段看：生产段看队列和落库状态，召回段看标签过滤和权限筛选，使用段看 Director 有没有采纳。
位置：pages[K].teaching.guides.base.paragraphs[8]

## KB-283 总图导读
受理回执、生成成功、召回命中、回答采用四个状态分别留日志。
位置：pages[K].teaching.guides.base.paragraphs[8]

## KB-284 主线复述
「带我去昨天那家游泳馆」，系统先要知道昨天那家属于谁、存在哪里。
位置：pages[K].mainline[1]

## KB-285 主线复述
同一段过去的信息，可能是最近的原话、可能是被压过的摘要、也可能是跨对话保存的经历；用途不同，不能都叫「记忆」。
位置：pages[K].mainline[1]

## KB-286 主线复述
这一章先讲身份，再讲这几种内容各自解决什么，最后讲写入、召回、删除和开关各改哪一份。
位置：pages[K].mainline[1]

## KB-287 主线复述
身份是三层。
位置：pages[K].mainline[2]

## KB-288 主线复述
最上层是豆包统一账号，决定这次任务跟谁走、记忆落在哪个账号边界；中间是车企账号，决定本车哪些成员和访客互相可见；最下层是车内自然人标识。
位置：pages[K].mainline[2]

## KB-289 主线复述
关系必须从车企云校验，客户端上报的「我是车主」不能当权限依据；校验失败时高权限能力按失败关闭，不能默认放行。
位置：pages[K].mainline[2]

## KB-290 主线复述
真实人脸和声纹留在端侧，云端只用识别后的标识；没注册的脸进匿名上下文，不套用车主的偏好。
位置：pages[K].mainline[2]

## KB-291 主线复述
内容分几类，按用途记。
位置：pages[K].mainline[3]

## KB-292 主线复述
历史输入是送给 Director 的近期原话，线上保留最近 5 轮人机对话，因为「第二家」这种指代需要真实候选关系，一句概括不够。
位置：pages[K].mainline[3]

## KB-293 主线复述
对话摘要是原话退出窗口后压出来的短文本：PRD 写从第 3 轮起、每新增一轮压一次、本次用车最多 22 轮、最长 500 token——500 token 不是 500 字，1.7 到 1.8 秒是会上说的单次处理耗时，不是模型规模也不是承诺。
位置：pages[K].mainline[3]

## KB-294 主线复述
瞬时记忆在 PRD 的开关一节标着「当前没用」，正文没有把 20 分钟或 20 轮写成它的定义，所以那个阈值只能算别的资料口径，标待核。
位置：pages[K].mainline[4]

## KB-295 主线复述
短期记忆保留近期经历，长期情景记忆保存可回忆的经历片段，长期语义记忆保存事实、关系和明确偏好。
位置：pages[K].mainline[4]

## KB-296 主线复述
它们是不同类型和用途，不是五个串行数据库，也不是一条必须逐级流过的流水线。
位置：pages[K].mainline[4]

## KB-297 主线复述
11 月 4 日讨论改的是历史输入的来源：在最近 5 轮人机之外，再把当前往前 5 次混合输入里的非人机部分放进来，包括乘客之间的人人对话和事件。
位置：pages[K].mainline[5]

## KB-298 主线复述
不是额外固定加 5 轮人人对话，也不是所有类型合计只留 5 条。
位置：pages[K].mainline[5]

## KB-299 主线复述
人人对话成为背景不等于成为执行授权，也不等于可以把副驾的口味记到主驾名下。
位置：pages[K].mainline[5]

## KB-300 主线复述
原来的独立事件流提示变量不再单独调用，但事件采集和日志不因此取消。
位置：pages[K].mainline[5]

## KB-301 主线复述
召回不是纯向量一把捞。
位置：pages[K].mainline[6]

## KB-302 主线复述
先按本轮诉求推标签、在标签内检索，再按相似度、时效、重要性排序；PRD 示例仍是向量加关键词的混合检索，不能讲成标签已经完全替代向量。
位置：pages[K].mainline[6]

## KB-303 主线复述
授权核对发生在检索之前，不能先捞回来再发现无权使用；查不到、无权限、检索异常三种要分开说。
位置：pages[K].mainline[6]

## KB-304 主线复述
写入地点时有明确要求：完整 POI 名称和城市必选，POI ID、经纬度、地址另列，ID 未标必选也不等于禁止保存。
位置：pages[K].mainline[7]

## KB-305 主线复述
名称不够精确就先调 POI 搜索让用户选点，确认后再写记忆；「记下我家是麦当劳」和「导航回家」之间隔着一次真实的写入。
位置：pages[K].mainline[7]

## KB-306 主线复述
删除要分对象：清空历史与摘要、删语义记忆、删情景记忆各走各的接口，删完语义记忆还要更新画像。
位置：pages[K].mainline[7]

## KB-307 主线复述
开关关闭是冻结，不是删除：停止新记录和生成，旧内容不再被召回，最近的对话仍可基于当前上下文回答。
位置：pages[K].mainline[7]

## KB-308 主线复述
这一章交出去的是「这个人有哪些可用的过去」，而不是「现在就出发」。
位置：pages[K].mainline[7]

## KB-309 费曼复述与迁移
你刚看过餐厅列表，说‘第二家’，系统需要原候选及顺序。
位置：pages[K].feynman.sections[k-need].p[1]

## KB-310 费曼复述与迁移
隔天说‘昨天那家’，则要查昨天的具体经历。
位置：pages[K].feynman.sections[k-need].p[1]

## KB-311 费曼复述与迁移
说‘我不吃香菜’，是明确个人事实。
位置：pages[K].feynman.sections[k-need].p[1]

## KB-312 费曼复述与迁移
三种信息的用途不同，不能只说系统有记忆就认为都能接住。
位置：pages[K].feynman.sections[k-need].p[1]

## KB-313 费曼复述与迁移
先确定是谁在问、当前允许使用谁的内容。
位置：pages[K].feynman.sections[k-need].p[2]

## KB-314 费曼复述与迁移
音区、识别人脸、登录账号和记忆权限是相关但不同的证据，不能因为认出名字就开放所有历史。
位置：pages[K].feynman.sections[k-need].p[2]

## KB-315 费曼复述与迁移
历史输入保留近期原始交互，所以‘第二家’还能对应真实列表。
位置：pages[K].feynman.sections[k-history].p[1]

## KB-316 费曼复述与迁移
较早内容退出窗口后，摘要用较短文本保住重要信息。
位置：pages[K].feynman.sections[k-history].p[1]

## KB-317 费曼复述与迁移
但如果摘要只剩‘聊了两家餐厅’，没有名字与对应关系，后面仍无法正确回答第二家是谁。
位置：pages[K].feynman.sections[k-history].p[1]

## KB-318 费曼复述与迁移
11月4日讨论保留5轮人机，再加入往前5次混合输入中的非人机部分，包括人人对话和事件。
位置：pages[K].feynman.sections[k-history].p[2]

## KB-319 费曼复述与迁移
它不是额外固定加5轮人人，也不是所有类型合计5条。
位置：pages[K].feynman.sections[k-history].p[2]

## KB-320 费曼复述与迁移
摘要是否覆盖到记忆侧总结之前，仍需核计数衔接。
位置：pages[K].feynman.sections[k-history].p[2]

## KB-321 费曼复述与迁移
短期记忆涉及近期经历；长期情景记忆保存可回忆的经历片段；长期语义记忆保存事实、关系或明确偏好。
位置：pages[K].feynman.sections[k-memory].p[1]

## KB-322 费曼复述与迁移
PRD另外列对话摘要与瞬时记忆，瞬时在该稿写当前没用。
位置：pages[K].feynman.sections[k-memory].p[1]

## KB-323 费曼复述与迁移
不能画成每条内容必须依次走过五个数据库。
位置：pages[K].feynman.sections[k-memory].p[1]

## KB-324 费曼复述与迁移
日志里有一句话、生成了一条记忆、查询召回了它、模型这轮采用了它，是四个不同状态。
位置：pages[K].feynman.sections[k-memory].p[2]

## KB-325 费曼复述与迁移
用户觉得忘了，需要沿这些环节查；模型的context window只是本轮输入范围，不是短期记忆的另一种名字。
位置：pages[K].feynman.sections[k-memory].p[2]

## KB-326 费曼复述与迁移
常用画像和相关记忆可在Director之前准备。
位置：pages[K].feynman.sections[k-recall].p[1]

## KB-327 费曼复述与迁移
若已拿到唯一可信泳馆位置，就能继续附近搜索；若只有‘昨天游泳’或者多个候选，则需要显式查询或向用户确认。
位置：pages[K].feynman.sections[k-recall].p[1]

## KB-328 费曼复述与迁移
记忆返回事实，Director仍负责用它完成当前目标。
位置：pages[K].feynman.sections[k-recall].p[1]

## KB-329 费曼复述与迁移
多人同车时还要按当前在场范围筛选。
位置：pages[K].feynman.sections[k-recall].p[2]

## KB-330 费曼复述与迁移
共享乘客身份、共同生成记忆与这次有权召回不是同一件事；不能因同一辆车认识这个人，就把别的账号全部经历带过来。
位置：pages[K].feynman.sections[k-recall].p[2]

## KB-331 费曼复述与迁移
‘家在麦当劳’没有确定分店。
位置：pages[K].feynman.sections[k-place].p[1]

## KB-332 费曼复述与迁移
指定打通方案要求城市和完整POI名称，并列ID、经纬度等字段。
位置：pages[K].feynman.sections[k-place].p[1]

## KB-333 费曼复述与迁移
缺必要信息时先补地点，用户确认后再保存；搜索成功、选点确认、记忆写入成功分别核对。
位置：pages[K].feynman.sections[k-place].p[1]

## KB-334 费曼复述与迁移
后续‘导航回家’先取该用户可用地址，再带城市与完整地点交导航。
位置：pages[K].feynman.sections[k-place].p[2]

## KB-335 费曼复述与迁移
ID未标必选不等于禁止保存。
位置：pages[K].feynman.sections[k-place].p[2]

## KB-336 费曼复述与迁移
手点候选可能沿旧导航流程直接算路，所以保存地址与开始出发的意图必须分清，不能假定点击和语音已完全等价。
位置：pages[K].feynman.sections[k-place].p[2]

## KB-337 费曼复述与迁移
车机保存座椅等物理数据并返回位置ID。
位置：pages[K].feynman.sections[k-seat].p[1]

## KB-338 费曼复述与迁移
用户说‘这是午休用的位置’，豆包才有依据保存用户、用途和位置ID的关系。
位置：pages[K].feynman.sections[k-seat].p[1]

## KB-339 费曼复述与迁移
单纯手按保存只证明存了槽位，不能自动猜用途。
位置：pages[K].feynman.sections[k-seat].p[1]

## KB-340 费曼复述与迁移
下次‘调到我的午休位置’，先找到用途对应的槽位，再交车控调整并看结果。
位置：pages[K].feynman.sections[k-seat].p[2]

## KB-341 费曼复述与迁移
查到ID不等于座椅已移动；记忆关闭、映射缺失或本车能力不同，都需要分开说明。
位置：pages[K].feynman.sections[k-seat].p[2]

## KB-342 费曼复述与迁移
关闭记忆开关按PRD是冻结：停止记录、生成和召回，旧记录并未因此删除。
位置：pages[K].feynman.sections[k-delete].p[1]

## KB-343 费曼复述与迁移
近期原话仍可能支持当前回答，这不等于偷偷恢复长期记忆。
位置：pages[K].feynman.sections[k-delete].p[1]

## KB-344 费曼复述与迁移
删除语义记忆还要更新画像；清历史输入和摘要另有入口。
位置：pages[K].feynman.sections[k-delete].p[2]

## KB-345 费曼复述与迁移
不能说删一条偏好就自动清掉所有原始日志，也不能因为界面不显示某类记忆就推定后端不存在。
位置：pages[K].feynman.sections[k-delete].p[2]

## KB-346 费曼复述与迁移
用户手动保存坐姿2，没有说用途，能否记为午休位置？
位置：pages[K].feynman.transfer[1]

## KB-347 费曼复述与迁移
不能。
位置：pages[K].feynman.transfer[1]

## KB-348 费曼复述与迁移
物理保存已有结果，但用途关系没有依据。
位置：pages[K].feynman.transfer[1]

## KB-349 费曼复述与迁移
摘要保留‘用户去了泳馆’，能否直接导航回昨天那家？
位置：pages[K].feynman.transfer[2]

## KB-350 费曼复述与迁移
不能，它缺具体对象。
位置：pages[K].feynman.transfer[2]

## KB-351 费曼复述与迁移
需要查询更完整经历或澄清。
位置：pages[K].feynman.transfer[2]

## KB-352 费曼复述与迁移
关闭记忆开关后系统还能回答刚才那句话，是否证明旧记忆被删除失败？
位置：pages[K].feynman.transfer[3]

## KB-353 费曼复述与迁移
不是。
位置：pages[K].feynman.transfer[3]

## KB-354 费曼复述与迁移
冻结长期记忆与近期对话仍可使用是不同规则，也不代表执行过删除。
位置：pages[K].feynman.transfer[3]

## KB-355 费曼复述与迁移
用‘第二家’和‘昨天那家’解释：为什么历史输入、摘要、记忆不能混叫一件事？
位置：pages[K].feynman.retell

## KB-356 费曼复述与迁移
第二家需要近期原话和真实列表；摘要只压缩较早信息，可能丢掉指代细节；昨天那家需要可查询的经历。
位置：pages[K].feynman.retell

## KB-357 费曼复述与迁移
记忆服务保存和召回，Context组织本轮背景，Director判断是否足够并继续目标，权限贯穿其中。
位置：pages[K].feynman.retell

## KB-358 原图节点 K01
记忆跟随车辆和豆包账号
位置：base.modules[K].nodes[K01].lines[1]

## KB-359 原图节点 K01
账号切换同时切换记忆空间
位置：base.modules[K].nodes[K01].lines[2]

## KB-360 原图节点 K01
登录账号与说话人分别识别
位置：base.modules[K].nodes[K01].lines[3]

## KB-361 原图节点 K01
同一辆车更换豆包账号后，读取的记忆空间随之切换。
位置：base.modules[K].nodes[K01].paragraphs[1]；base.modules[K].nodes[K01].detail

## KB-362 原图节点 K01
查询先携带车辆和账号，再去识别这次说话的是哪位乘客。
位置：base.modules[K].nodes[K01].paragraphs[1]；base.modules[K].nodes[K01].detail

## KB-363 原图节点 K01
副驾说“带我回家”时，还要确定副驾是谁，才能知道该找谁的地址。
位置：base.modules[K].nodes[K01].paragraphs[2]；base.modules[K].nodes[K01].detail

## KB-364 原图节点 K01
车机登录的车主账号提供空间范围，个人指代由乘客身份继续确定。
位置：base.modules[K].nodes[K01].paragraphs[2]；base.modules[K].nodes[K01].detail

## KB-365 原图节点 K02
在可信车企账号范围识别乘客
位置：base.modules[K].nodes[K02].lines[1]

## KB-366 原图节点 K02
人物编号不等同于登录账号或座位
位置：base.modules[K].nodes[K02].lines[2]

## KB-367 原图节点 K02
身份未知时不读写乘客私有记忆
位置：base.modules[K].nodes[K02].lines[3]

## KB-368 原图节点 K02
账号模块先确认车辆与车企账号的可信关系，再把人脸识别结果映射为当前范围内的乘客编号 VehicleUserID。
位置：base.modules[K].nodes[K02].paragraphs[1]；base.modules[K].nodes[K02].detail

## KB-369 原图节点 K02
统一火山账号关联业务数据，乘客编号区分具体自然人；两者都不能用主驾或副驾位置替代。
位置：base.modules[K].nodes[K02].paragraphs[1]；base.modules[K].nodes[K02].detail

## KB-370 原图节点 K02
昵称变更跟随同一乘客身份更新。
位置：base.modules[K].nodes[K02].paragraphs[2]；base.modules[K].nodes[K02].detail

## KB-371 原图节点 K02
相同人脸编号在不同车企账号下可能对应不同关系与称呼；未识别或账号校验失败时使用匿名背景，不读写乘客私有记忆。
位置：base.modules[K].nodes[K02].paragraphs[2]；base.modules[K].nodes[K02].detail

## KB-372 原图节点 K03
开关控制生成和召回
位置：base.modules[K].nodes[K03].lines[1]

## KB-373 原图节点 K03
查询带车辆、账号及人物范围
位置：base.modules[K].nodes[K03].lines[2]

## KB-374 原图节点 K03
语音删除仍在开发
位置：base.modules[K].nodes[K03].lines[3]

## KB-375 原图节点 K03
用户授权并开启记忆后，系统才按当前范围记录和使用内容。
位置：base.modules[K].nodes[K03].paragraphs[1]；base.modules[K].nodes[K03].detail

## KB-376 原图节点 K03
关闭状态下明确要求记住，助手先说明需要授权，再继续相应操作。
位置：base.modules[K].nodes[K03].paragraphs[1]；base.modules[K].nodes[K03].detail

## KB-377 原图节点 K03
页面和接口分别支持自己的管理范围。
位置：base.modules[K].nodes[K03].paragraphs[2]；base.modules[K].nodes[K03].detail

## KB-378 原图节点 K03
语音删除截至 10 月 28 日仍在开发，需求限定车主使用，批量删除先由 Director 进行范围确认。
位置：base.modules[K].nodes[K03].paragraphs[2]；base.modules[K].nodes[K03].detail

## KB-379 原图节点 K04
事件保存经历的原始事实
位置：base.modules[K].nodes[K04].lines[1]

## KB-380 原图节点 K04
明确记住经记忆工具提交
位置：base.modules[K].nodes[K04].lines[2]

## KB-381 原图节点 K04
内容带人物及场景归属
位置：base.modules[K].nodes[K04].lines[3]

## KB-382 原图节点 K04
去过某家游泳馆是一段经历，用户明确说“记住我家的地址”是一项保存事实的要求。
位置：base.modules[K].nodes[K04].paragraphs[1]；base.modules[K].nodes[K04].detail

## KB-383 原图节点 K04
两种输入分别进入周期整理或记忆操作工具。
位置：base.modules[K].nodes[K04].paragraphs[1]；base.modules[K].nodes[K04].detail

## KB-384 原图节点 K04
原料保留发生时间、车辆账号和同乘人员。
位置：base.modules[K].nodes[K04].paragraphs[2]；base.modules[K].nodes[K04].detail

## KB-385 原图节点 K04
第三人偏好的生成需求还保留说话来源，在本人在场并明确认可后才形成对应个人语义候选。
位置：base.modules[K].nodes[K04].paragraphs[2]；base.modules[K].nodes[K04].detail

## KB-386 原图节点 K05
同乘变化先切段
位置：base.modules[K].nodes[K05].lines[1]

## KB-387 原图节点 K05
段内按事件数或时间总结
位置：base.modules[K].nodes[K05].lines[2]

## KB-388 原图节点 K05
摘要衔接五轮历史与较早记忆
位置：base.modules[K].nodes[K05].lines[3]

## KB-389 原图节点 K05
情景记忆按用车参与者及场景组织，原始事件和对话不等于已经生成可召回的经历。
位置：base.modules[K].nodes[K05].paragraphs[1]

## KB-390 原图节点 K05
11月4日讨论旧摘要22轮与短期20轮或20分钟的总结节奏，仍要求核对计数和覆盖衔接，不能把20条、20轮互相替换成统一现状。
位置：base.modules[K].nodes[K05].paragraphs[1]

## KB-391 原图节点 K05
11月4日文字记录
位置：base.modules[K].nodes[K05].paragraphs[1]

## KB-392 原图节点 K05
对话摘要从第3轮起随新轮压缩，本稿最多22轮、最长500token，补Director保留5轮时退出原话的缺口。
位置：base.modules[K].nodes[K05].paragraphs[2]

## KB-393 原图节点 K05
PRD将瞬时记忆标为当时未使用，不能从这段推出瞬时的20分钟阈值。
位置：base.modules[K].nodes[K05].paragraphs[2]

## KB-394 原图节点 K05
有人上下车时，情景记忆先按参与者变化分段，再在段内按 20 条事件或 20 分钟整理短期经历。
位置：base.modules[K].nodes[K05].detail

## KB-395 原图节点 K05
这样不同乘客组合的历史保持各自范围。
位置：base.modules[K].nodes[K05].detail

## KB-396 原图节点 K05
对话摘要从第 3 轮起随新对话滚动压缩较早内容，填补近 5 轮历史与已生成短期记忆之间的空白。
位置：base.modules[K].nodes[K05].detail

## KB-397 原图节点 K05
摘要长度按运行配置控制，再作为 Director 的近期背景。
位置：base.modules[K].nodes[K05].detail

## KB-398 原图节点 K05
有人上车或下车时参与者组合已经改变，前后两段允许看到的范围不同，所以先切段。
位置：base.modules[K].nodes[K05].detail

## KB-399 原图节点 K05
段内达到 20 条事件或 20 分钟即触发短期整理，夜间再汇总成长线情景。
位置：base.modules[K].nodes[K05].detail

## KB-400 原图节点 K05
对话摘要从第三轮起滚动压缩，衔接近五轮与较早记忆。
位置：base.modules[K].nodes[K05].detail

## KB-401 原图节点 K06
夜间汇总较长经历
位置：base.modules[K].nodes[K06].lines[1]

## KB-402 原图节点 K06
提取带条件的事实及偏好
位置：base.modules[K].nodes[K06].lines[2]

## KB-403 原图节点 K06
语义画像已使用，行为画像未使用
位置：base.modules[K].nodes[K06].lines[3]

## KB-404 原图节点 K06
情景记忆保留发生在某次用车场景中的经历，语义记忆保存事实和关系，画像再从合法资料形成概括。
位置：base.modules[K].nodes[K06].paragraphs[1]

## KB-405 原图节点 K06
PRD要求保留是谁说的信息，不把临时操作或别人的介绍变成用户亲口偏好。
位置：base.modules[K].nodes[K06].paragraphs[1]

## KB-406 原图节点 K06
语义画像当时固定注入；情景画像有实现但实际未使用，更完整情境建模为长期方案。
位置：base.modules[K].nodes[K06].paragraphs[2]

## KB-407 原图节点 K06
不能把后台生成能力等同当前Director已经消费，也不能捏造统一夜间偏好推理节奏。
位置：base.modules[K].nodes[K06].paragraphs[2]

## KB-408 原图节点 K06
短期经历在夜间进一步整理成长线情景记忆。
位置：base.modules[K].nodes[K06].detail

## KB-409 原图节点 K06
明确记住请求和经历中的有效信息形成语义记忆，保留人物、季节、同乘等适用条件。
位置：base.modules[K].nodes[K06].detail

## KB-410 原图节点 K06
语义画像将已注册用户的语义记忆整理成键值对，并固定注入推理。
位置：base.modules[K].nodes[K06].detail

## KB-411 原图节点 K06
行为画像从经历统计偏好，已实现但当前未使用；实时完整情境 buffer 尚未实现。
位置：base.modules[K].nodes[K06].detail

## KB-412 原图节点 K06
生成偏好保留时间和同乘条件，避免临时需求被当成长期偏好。
位置：base.modules[K].nodes[K06].detail

## KB-413 原图节点 K06
行为统计画像属于推断结果，截至 10 月 28 日已生成但尚未被当前推理模块使用；连续描述整个情境的环境 buffer 也尚未实现。
位置：base.modules[K].nodes[K06].detail

## KB-414 原图节点 K07
固定注入允许使用的语义画像
位置：base.modules[K].nodes[K07].lines[1]

## KB-415 原图节点 K07
根据 query 检索相关记忆
位置：base.modules[K].nodes[K07].lines[2]

## KB-416 原图节点 K07
对话摘要补充近期关联
位置：base.modules[K].nodes[K07].lines[3]

## KB-417 原图节点 K07
用户说“去昨天那家游泳馆”，Context 在推理前准备当前允许使用的画像、相关记忆和摘要。
位置：base.modules[K].nodes[K07].paragraphs[1]；base.modules[K].nodes[K07].detail

## KB-418 原图节点 K07
已有足够地点信息时，Director 可以继续规划。
位置：base.modules[K].nodes[K07].paragraphs[1]；base.modules[K].nodes[K07].detail

## KB-419 原图节点 K07
画像固定提供常用背景，记忆候选随这次问题检索。
位置：base.modules[K].nodes[K07].paragraphs[2]；base.modules[K].nodes[K07].detail

## KB-420 原图节点 K07
两者分别提供稳定偏好与具体经历，当前请求决定最终如何使用。
位置：base.modules[K].nodes[K07].paragraphs[2]；base.modules[K].nodes[K07].detail

## KB-421 原图节点 K08
模型从 query 推理场景标签
位置：base.modules[K].nodes[K08].lines[1]

## KB-422 原图节点 K08
语义考虑相似度与时效
位置：base.modules[K].nodes[K08].lines[2]

## KB-423 原图节点 K08
情景另加入信息重要性
位置：base.modules[K].nodes[K08].lines[3]

## KB-424 原图节点 K08
查询先判断这次问题涉及哪些标签，再在相应标签下检索和排序。
位置：base.modules[K].nodes[K08].paragraphs[1]；base.modules[K].nodes[K08].detail

## KB-425 原图节点 K08
每个匹配标签取排名靠前的若干条，减少与当前问题无关的内容。
位置：base.modules[K].nodes[K08].paragraphs[1]；base.modules[K].nodes[K08].detail

## KB-426 原图节点 K08
语义记忆考虑相似度和时效，情景记忆增加信息重要性。
位置：base.modules[K].nodes[K08].paragraphs[2]；base.modules[K].nodes[K08].detail

## KB-427 原图节点 K08
人物及隐私范围同时限制候选，后续 Director 再核对日期和地点是否符合用户所指。
位置：base.modules[K].nodes[K08].paragraphs[2]；base.modules[K].nodes[K08].detail

## KB-428 原图节点 K08
先由模型判断相关标签缩小检索类别，再排序。
位置：base.modules[K].nodes[K08].paragraphs[3]；base.modules[K].nodes[K08].detail

## KB-429 原图节点 K08
语义记忆主要看语义相似和时效，情景记忆还要看信息重要性，两类标准不同。
位置：base.modules[K].nodes[K08].paragraphs[3]；base.modules[K].nodes[K08].detail

## KB-430 原图节点 K08
每个标签只取排名靠前若干条，人物和隐私范围同时限制候选规模。
位置：base.modules[K].nodes[K08].paragraphs[3]；base.modules[K].nodes[K08].detail

## KB-431 原图节点 K09
Director 明确还缺哪条信息
位置：base.modules[K].nodes[K09].lines[1]

## KB-432 原图节点 K09
search_user_memory 查询候选
位置：base.modules[K].nodes[K09].lines[2]

## KB-433 原图节点 K09
返回后再决定下一步
位置：base.modules[K].nodes[K09].lines[3]

## KB-434 原图节点 K09
预先准备的背景没有具体地点时，Director 调用记忆查询工具，询问当前用户昨天去过的游泳馆。
位置：base.modules[K].nodes[K09].paragraphs[1]；base.modules[K].nodes[K09].detail

## KB-435 原图节点 K09
查询参数描述缺失信息及相关范围。
位置：base.modules[K].nodes[K09].paragraphs[1]；base.modules[K].nodes[K09].detail

## KB-436 原图节点 K09
候选结果返回后，Director 再决定选哪个分店或向用户澄清。
位置：base.modules[K].nodes[K09].paragraphs[2]；base.modules[K].nodes[K09].detail

## KB-437 原图节点 K09
记忆为空时请用户补充地点，有结果以后才继续导航。
位置：base.modules[K].nodes[K09].paragraphs[2]；base.modules[K].nodes[K09].detail

## KB-438 原图节点 K10
前置结果进入 Context
位置：base.modules[K].nodes[K10].lines[1]

## KB-439 原图节点 K10
显式查询以 tool_feedback 回流
位置：base.modules[K].nodes[K10].lines[2]

## KB-440 原图节点 K10
确认信息后再调用后续工具
位置：base.modules[K].nodes[K10].lines[3]

## KB-441 原图节点 K10
推理前取得的记忆随 Context 进入当前输入，显式工具查询则以 tool_feedback 返回原调用。
位置：base.modules[K].nodes[K10].paragraphs[1]；base.modules[K].nodes[K10].detail

## KB-442 原图节点 K10
Director 据此补全人物、日期和具体地点。
位置：base.modules[K].nodes[K10].paragraphs[1]；base.modules[K].nodes[K10].detail

## KB-443 原图节点 K10
地点明确后，下一轮 action_list 才提交地图或导航。
位置：base.modules[K].nodes[K10].paragraphs[2]；base.modules[K].nodes[K10].detail

## KB-444 原图节点 K10
导航继续返回实际结果，助手根据启动成功、失败或待澄清情况回答用户。
位置：base.modules[K].nodes[K10].paragraphs[2]；base.modules[K].nodes[K10].detail

## KB-445 原图节点 K11
停止该能力的新记录和生成
位置：base.modules[K].nodes[K11].lines[1]

## KB-446 原图节点 K11
已有内容保留，暂停召回
位置：base.modules[K].nodes[K11].lines[2]

## KB-447 原图节点 K11
近五轮对话继续支持交流
位置：base.modules[K].nodes[K11].lines[3]

## KB-448 原图节点 K11
关闭开关后，为记忆记录事件和生成内容的路径停止，已有记忆保留但冻结使用。
位置：base.modules[K].nodes[K11].paragraphs[1]；base.modules[K].nodes[K11].detail

## KB-449 原图节点 K11
重新开启后，允许范围内的内容可继续参与生成和召回。
位置：base.modules[K].nodes[K11].paragraphs[1]；base.modules[K].nodes[K11].detail

## KB-450 原图节点 K11
最近五轮对话仍支持正常交流。
位置：base.modules[K].nodes[K11].paragraphs[2]；base.modules[K].nodes[K11].detail

## KB-451 原图节点 K11
用户追问刚说过的地址，可以根据当前历史回答；这段短近对话与长期记忆分别受各自规则管理。
位置：base.modules[K].nodes[K11].paragraphs[2]；base.modules[K].nodes[K11].detail

## KB-452 原图节点 K12
页面显示已注册乘客交集
位置：base.modules[K].nodes[K12].lines[1]

## KB-453 原图节点 K12
白名单范围较宽，敏感内容取共同经历
位置：base.modules[K].nodes[K12].lines[2]

## KB-454 原图节点 K12
新增乘客清理摘要敏感信息
位置：base.modules[K].nodes[K12].lines[3]

## KB-455 原图节点 K12
记忆页面只展示长期语义记忆。
位置：base.modules[K].nodes[K12].paragraphs[1]；base.modules[K].nodes[K12].detail

## KB-456 原图节点 K12
当前 A、B 都在车上时，可展示 AB、ABC 等共同场景内容；未注册乘客不参与这个交集筛选。
位置：base.modules[K].nodes[K12].paragraphs[1]；base.modules[K].nodes[K12].detail

## KB-457 原图节点 K12
页面已去掉按人筛选，接口仍可按人查询。
位置：base.modules[K].nodes[K12].paragraphs[1]；base.modules[K].nodes[K12].detail

## KB-458 原图节点 K12
模型召回的范围另行判断：白名单内容可来自包含询问者的经历，敏感内容要求覆盖当前所有已注册乘客。
位置：base.modules[K].nodes[K12].paragraphs[2]；base.modules[K].nodes[K12].detail

## KB-459 原图节点 K12
因此页面看见什么，与这一轮能够调用什么，不能互相代替。
位置：base.modules[K].nodes[K12].paragraphs[2]；base.modules[K].nodes[K12].detail

## KB-460 原图节点 K12
新增注册乘客或未注册人数增加时，系统清理对话摘要中的敏感信息。
位置：base.modules[K].nodes[K12].paragraphs[3]；base.modules[K].nodes[K12].detail

## KB-461 原图节点 K12
未知乘客换人但人数不变时，当前人数规则仍无法识别这种变化。
位置：base.modules[K].nodes[K12].paragraphs[3]；base.modules[K].nodes[K12].detail

## KB-462 原图节点 K13
页面删单条、标签或全部语义记忆
位置：base.modules[K].nodes[K13].lines[1]

## KB-463 原图节点 K13
接口另支持按人查询及删除
位置：base.modules[K].nodes[K13].lines[2]

## KB-464 原图节点 K13
情景可按日删，语义不按日期删
位置：base.modules[K].nodes[K13].lines[3]

## KB-465 原图节点 K13
语义记忆持续合并更新偏好，删除按条目、标签、人物或全部等范围处理，不提供按日期删。
位置：base.modules[K].nodes[K13].paragraphs[1]；base.modules[K].nodes[K13].detail

## KB-466 原图节点 K13
情景记忆记录经历，可按日筛选删除。
位置：base.modules[K].nodes[K13].paragraphs[1]；base.modules[K].nodes[K13].detail

## KB-467 原图节点 K13
当前页面显示长期语义条目，接口支持更多范围。
位置：base.modules[K].nodes[K13].paragraphs[2]；base.modules[K].nodes[K13].detail

## KB-468 原图节点 K13
语音批量删除仍在开发，需求将解析出的具体范围先交给车主确认，再调用相应清理能力。
位置：base.modules[K].nodes[K13].paragraphs[2]；base.modules[K].nodes[K13].detail

## KB-469 原图节点 K14
删除语义后更新画像
位置：base.modules[K].nodes[K14].lines[1]

## KB-470 原图节点 K14
新 chat_id 清历史与摘要
位置：base.modules[K].nodes[K14].lines[2]

## KB-471 原图节点 K14
界面刷新方案仍待接通
位置：base.modules[K].nodes[K14].lines[3]

## KB-472 原图节点 K14
删除语义记忆后，关联画像需要根据剩余内容更新，避免旧偏好继续从画像进入推理。
位置：base.modules[K].nodes[K14].paragraphs[1]；base.modules[K].nodes[K14].detail

## KB-473 原图节点 K14
历史对话与摘要通过新 chat_id 清理，长期记忆另行处理。
位置：base.modules[K].nodes[K14].paragraphs[1]；base.modules[K].nodes[K14].detail

## KB-474 原图节点 K14
当前没有服务端推送刷新记忆页面；工具操作后重新拉取属于讨论方案。
位置：base.modules[K].nodes[K14].paragraphs[2]；base.modules[K].nodes[K14].detail

## KB-475 原图节点 K14
接口完成范围和用户页面实际内容分别更新，结果反馈按真实进度表达。
位置：base.modules[K].nodes[K14].paragraphs[2]；base.modules[K].nodes[K14].detail

## KB-476 原图节点 K14
删除语义记忆后必须联动更新由它生成的画像，否则旧偏好会从画像通道继续进入推理。
位置：base.modules[K].nodes[K14].paragraphs[3]；base.modules[K].nodes[K14].detail

## KB-477 原图节点 K14
新 chat_id 清空当前历史与摘要，长期记忆另行删除；已打开的记忆页面目前没有服务端推送刷新，工具操作后重新拉取仍是讨论中的处理方案。
位置：base.modules[K].nodes[K14].paragraphs[3]；base.modules[K].nodes[K14].detail

## KB-478 原图节点 K15
先看事实是否生成
位置：base.modules[K].nodes[K15].lines[1]

## KB-479 原图节点 K15
再看本轮候选与实际输入
位置：base.modules[K].nodes[K15].lines[2]

## KB-480 原图节点 K15
最后看采用和工具结果
位置：base.modules[K].nodes[K15].lines[3]

## KB-481 原图节点 K15
用户觉得“忘了”，先查原信息是否形成记忆，再查本次权限过滤、召回和采用，最后查执行。
位置：base.modules[K].nodes[K15].paragraphs[1]

## KB-482 原图节点 K15
地址已取回却导航错，可能是城市或地点匹配错误，不应全算记忆提取错误。
位置：base.modules[K].nodes[K15].paragraphs[1]

## KB-483 原图节点 K15
家、公司地点的新方案以城市和完整POI名称为必要信息，确认具体地点后写入；消费时DT改写明确地点再调用导航。
位置：base.modules[K].nodes[K15].paragraphs[2]

## KB-484 原图节点 K15
旧直接写地图的方案与11月4日方向分开核对，不沿用旧同步结论冒称当前已实现。
位置：base.modules[K].nodes[K15].paragraphs[2]

## KB-485 原图节点 K15
“记住新家”之后仍导航到旧家，先查新地址是否写入，再看本轮检索和地图设置。
位置：base.modules[K].nodes[K15].detail

## KB-486 原图节点 K15
当前已实现的短期同步为记忆到地图的家、公司信息，设置结果影响下次回家。
位置：base.modules[K].nodes[K15].detail

## KB-487 原图节点 K15
内容已返回但使用错误时，查 Director 的判断；导航提交正确却未启动时，查地图执行。
位置：base.modules[K].nodes[K15].detail

## KB-488 原图节点 K15
把每段实际结果连起来，才能确定用户感觉“忘了”发生在哪一步。
位置：base.modules[K].nodes[K15].detail

## KB-489 评审问题
问题：你怎么证明“记住了”不是只记在这几轮对话里？ 原因：立即复述可能绕过长期记忆链路。 回答：检查原始素材、异步任务 success、实际生成内容，再越过近期对话范围验证召回与采用；还要用另一账号证明没有串人。 举证：可对应同一事实的事件、任务状态、记忆结果、本轮 Context、Director 输出与实车操作。
位置：base.modules[K].questions[1]

## KB-490 评审问题
问题：Memory 返回正确地址，为什么用户还是导航错？ 原因：记忆不是最终执行系统。 回答：区分候选歧义、地图地点匹配、Director 选错、传参错、下游执行失败。按查询返回→action_list→tool_feedback→真实地图状态逐步定位。 举证：同一调用链的原始候选、实际工具参数、目的地回执与界面状态。
位置：base.modules[K].questions[2]

## KB-491 评审问题
问题：关闭记忆后还能回答刚才说的内容，是否一定是隐私开关失效？ 原因：开关与当前对话窗口不是同一存储层。 回答：关闭长期记忆以后，近期对话仍可能保留刚说过的话。这套方案允许使用近 5 轮原始对话，但不能继续新增长期记忆或召回被冻结内容。检查回答时，要确认它究竟用了哪一路信息。 举证：开关状态、模型输入来源、后台生产任务和长期查询记录。
位置：base.modules[K].questions[3]

## KB-492 评审问题
问题：车主账号登录时，副驾说的偏好应该记在谁名下？ 原因：登录身份不等于实际表达主体。 回答：先在可信 OEM 账号范围解析当前乘客与音区，按实际表达对象及项目隔离规则归属；未知人不能借用车主身份。共享乘客是专项规则，不可默认全车共享。 举证：当前账号关系、乘客映射、原始语句、记忆主体与在场范围。
位置：base.modules[K].questions[4]

## KB-493 评审问题
问题：删除一条语义记忆，需要验收哪些关联结果？ 原因：即使原始记忆已经删除，衍生画像仍可能保留同一个事实，删除范围需要包含相关衍生结果。 回答：核对指定范围、实际删除结果、画像联动、召回与展示不再使用。批量语音删除还需确认权限与二次确认；失败项不能混成成功。 举证：确认内容、删除结果、画像版本、删除后新会话与记忆查询。
位置：base.modules[K].questions[5]

## KB-494 评审问题
问题：为什么连续几次调空调到 22℃，不能直接宣称用户永远喜欢 22℃？ 原因：行为可能由临时天气、乘客或当前任务驱动。 回答：先保存事件事实和当时情境，把行为归纳标为带条件的推断。连续情境和情感因果能力仍有待完成部分，不能把一次观察直接当作稳定偏好。 举证：原始事件时间、环境、人物、归纳内容、适用范围和反例测试。
位置：base.modules[K].questions[6]

## KB-495 评审问题
问题：记忆模型准确率提高了，为什么未必是产品进步？ 原因：过召、延迟和隐私误露出可能同步变坏。 回答：同时看应召回事实覆盖、无关内容混入、Director 采用、端到端任务成功、P90 延迟与隔离失效。基于同一测试集对照，不混不同日期报告。 举证：固定分层测试集、两版逐项结果、线上/实车验收范围。
位置：base.modules[K].questions[7]

## KB-496 评审问题
问题：做记忆产品需要先深入所有算法和数据库代码吗？ 原因：学习范围要服务决策与落地。 回答：不需要；必须能独立说明数据层次、上下游合同、授权/删除、失败去向和验收，再理解算法如何影响召回与时延。对关键坏例能用证据分责，比背实现名词更重要。 举证：一条完整病例复盘、异常矩阵、指标口径和改进前后结果。
位置：base.modules[K].questions[8]

## KB-497 评审问题
问题：用户在手机聊过一个地点，车里没答出来，如何判断是同步没做、没权限还是模型没采用？ 原因：跨端看起来像一个“记忆”能力，实际可能走历史查询、记忆同步或目的地分享；同账号只解决关联的一部分。 回答：先确认测试用的是真实跨端数据而非 Demo Mock；再核目标车/账号、该数据类别的实际授权、发送或查询结果、返回片段、本轮 Context 和 Director 输出。没有返回数据查同步与查询；数据因授权不可用查权限；正确片段已进入模型却没采用才进入推理评测。不能用另一条手动分享的 POI 成功代替记忆同步验收。 举证：手机接入、记忆、Context 与 Director 各保留同一测试请求的脱敏输入、返回片段和实际模型输入，逐段核对同步、授权、查询、注入与采用结果。
位置：base.modules[K].questions[9]

## KB-498 评审问题
问题：非豆包渠道没有豆包 UID，当前这一轮究竟凭什么定位账号和乘客？ 原因：若各业务自行用旧字段兜底，账号配置、任务、事件和记忆可能指向不同对象。 回答：先按当前发布的渠道合同确定可信 OEM 身份，再看统一账号映射和乘客解析结果；账号与乘客不能混成一个 ID。核查实际请求使用的新旧字段、映射关系及权限边界，不能拿设计中的阶段排期当作已经切换完成。 举证：由账号服务确认本渠道的身份映射与实际部署字段；事件、记忆和任务使用同一受控用户核对存储及回调归属。HTTP UID 从哪里取得也须统一，防止各业务自行用不同身份兜底。
位置：base.modules[K].questions[10]

## KB-499 评审问题
问题：同样提示“远控失效”，为什么有的需车端扫码，有的需手机短信验证？ 原因：错误恢复动作取决于哪段授权失效。让用户反复登录却不修复真正断点，会让功能看似随机失败。 回答：分别确认车辆绑定、车端豆包登录、OEM 权限、手机设备授权四段状态，再按当前渠道对应的恢复入口处理。恢复后重新验证真实执行结果，不以重新登录成功结束验收。 举证：先记录失效发生在绑定、车端登录、车厂权限还是手机设备授权，再核对相应恢复入口。权限恢复后重做原操作，并保留真实结果和部分失败项。
位置：base.modules[K].questions[11]

## KB-500 评审问题
问题：这项记忆能力适用于哪个车型版本、哪类身份，以及哪一种数据？ 原因：同一种“记忆”可能采用不同身份范围和数据来源。把对话历史、长期记忆与目的地分享混在一起，会误判系统该读取或删除什么。 回答：逐项说明适用项目、发布范围、注册身份、数据类别、离车路径、消费场景和删除边界。不能确认的数据路径继续保留为未知，再用本车真实采集、生成和召回结果验证。 举证：核对记忆开关的权限与数据流、生效配置和实际采集、生成、召回记录，确认关闭影响到哪些环节。
位置：base.modules[K].questions[12]

## KB-501 评审问题
问题：关闭记忆后仍能接上刚才的话，是否一定是隐私 bug？ 原因：需要先区分短对话背景与长期存储/检索。 回答：先定位信息来源，核对应开关对预注入、动态查询、写入和当前上下文的具体合同，再判断是否越界，不能单看一句回复。 举证：开关状态、各来源读取记录和本轮实际输入；不需要暴露用户私人内容。
位置：base.modules[K].questions[13]

## KB-502 指标与观测
应记事实覆盖率：在已授权且属于目标记忆类型的标注样本中，实际生成的正确事实点数 / 应生成事实点数；缺失与错误新增另记。 分层：显式保存/普通对话、语义/情景、音区、渠道、生成版本。 状态：记忆生成需求目标 90%；本项目适用范围与实际达成需确认。
位置：base.modules[K].metrics[1]

## KB-503 指标与观测
生成可用时延：从符合条件的素材提交或明确保存请求到正确记忆可查询的耗时；同时记录任务排队和生成阶段。 分层：即时/周期生成、类型、环境、成功/失败，分别报 P50/P90。 状态：短期记忆生成时延目标尚待明确，需按素材类型和处理路径测量。
位置：base.modules[K].metrics[2]

## KB-504 指标与观测
记忆召回用例通过率：目标记忆正确返回且返回条数不超限制的用例 / 全部检索用例；另统计漏召和过召。 分层：标签、时间指代、模糊指代、多人、跨会话。 状态：建议验收口径；召回阈值需项目确认。
位置：base.modules[K].metrics[3]

## KB-505 指标与观测
记忆查询 P90：从 Context 发起记忆查询到取得完整结果的耗时第 90 百分位；不要与整轮响应混算。 分层：语义/情景、预注入/动态查询、冷热请求与渠道。 状态：记忆查询需求目标 P90 ≤ 500 ms；实际达成需测量。
位置：base.modules[K].metrics[4]

## KB-506 指标与观测
端到端正确采用率：需要记忆的任务中，正确记忆进入模型且被合理采用，并产生正确用户结果的用例 / 全部目标用例。 分层：推荐、导航、记忆问答；单独列权限阻断与信息不足。 状态：建议验收口径；阈值需项目确认。
位置：base.modules[K].metrics[5]

## KB-507 指标与观测
隔离与开关失效数：按关闭记忆、换账号、跨车、新乘客、未知身份等矩阵测试，记录不该生成/召回/露出的实际失败项。 分层：数据类型、人物组合、共享乘客、识别异常。 状态：记忆验收要求 P0 遗留为 0；隐私失败不能由平均分抵消。
位置：base.modules[K].metrics[6]

## KB-508 指标与观测
删除一致性通过率：指定数据删除、画像联动、后续召回及展示均符合承诺的操作 / 全部已确认删除操作。 分层：单条/按人/按日/全部、语义/情景、成功/部分失败。 状态：建议验收口径；语音删除的开放车型与删除范围需先确认。
位置：base.modules[K].metrics[7]

## KB-509 指标与观测
记忆与地图一致率：家/公司设置请求在记忆、地图配置和下一次导航目的地三处一致的用例 / 适用设置用例。 分层：新增、覆盖、歧义地点、设置失败、换账号。 状态：建议验收口径；家与公司位置同步的适用范围需先明确。
位置：base.modules[K].metrics[8]

## KB-510 指标与观测
跨端信息可用链路可定位率：在人工确认来源与授权条件的跨端测试中，能明确还原“来源数据→授权/同步或查询→实际返回→本轮注入→采用或不采用”的用例数／全部此类测试用例数。Mock、手动 POI 分享和真实记忆同步分开统计。 分层：按历史/长期记忆/业务内容、同步方向、渠道、账号切换与失败环节分组。 状态：建议验收口径；先确认跨端数据类别、授权约定和测试环境。
位置：base.modules[K].metrics[9]

## KB-511 指标与观测
身份迁移新旧链路一致率：针对迁移期的同一受控用户，账号配置、任务、历史、事件与记忆读写对象均与确认的身份映射一致的检查项数／全部被测检查项数；缺发布证据的路径不算通过，要单独记成「尚未验收」。 分层：按豆包/非豆包渠道、灰度阶段、新写数据/历史数据、登录切换与回调分组。 状态：建议验收口径；按迁移期真实字段和身份映射确定检查项。
位置：base.modules[K].metrics[10]

## KB-512 指标与观测
记忆范围与版本匹配检查：按场景核身份范围、数据类型、来源项目和适用版本是否一致，单列跨项目套用、对话与记忆混淆及未确认数据路径。 分层：按车型/版本、注册/未注册、对话/记忆/运行日志、车端/云端消费拆分。 状态：产品范围检查；按实际配置核对身份、数据类型和使用边界。
位置：base.modules[K].metrics[11]

## 原图与结构登记

- 原图模块 K 含 K01～K15 共 15 个节点；其标题、概述 lines、展开 detail、paragraphs 已逐句纳入上表，未只登记标题。
- 页面教学段为 9 段；teaching.lessons 与 sections 重复的文字已合并出现位置；另有总图导读、主线复述、费曼 7 段与 3 个迁移问题。
- 页面 flows/cases/terms/questions/metrics/roadmap/related/referenceTables 为空；评审问题和指标实际存放在 base.modules[K]，已单独纳入。
- DATA.diagrams 没有 K 前缀的独立新图；K 的既有流程图是 base.modules[K] 原图节点，改写时需保留原始全图。
- legacyChapterTargets 保留 19 个历史锚点映射，属于跳转兼容信息，不另外计入知识点。

## 同一网页内需要核对的说法

- K05.detail 写固定“20 条事件或 20 分钟、夜间汇总”；K05.paragraphs 与正文改为“11 月 4 日讨论 20 轮或 20 分钟，计数待核”，不能拿前者替代后者。
- K06.detail 写夜间汇总长线情景；K06.paragraphs 提醒不捏造统一夜间偏好推理节奏，情景画像“已生成”与“已被推理消费”分开。
- K15.detail 写记忆到地图家/公司同步“已实现”；K15.paragraphs 要求旧方案与 11 月 4 日新方向分开核对，不能沿用旧结论冒称新方案已实现。
- K03/K13 原图仍保留“语音删除截至 10 月 28 日在开发”；当前正文只有接口和交互规则，并无新的上线证据，后续须按原文现状标注。
- 旧页中的账号三层、可信云校验、Face ID 为主与声纹补充、手机远控等内容，仍需由原文研究逐项定事实等级，登记不等于背书。
