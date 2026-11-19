# W 章（可见即可说）研究笔记

日期：2026-11-10。全程只读。原文副本在 `raw/`。

## 一、读取清单

| 标题 | 链接 | 编辑时间 | 读到哪 | raw |
|---|---|---|---|---|
| 【AI汽车】可见即可说框架需求文档（左晨） | https://bytedance.larkoffice.com/wiki/AxYjwUI8wiFCXWkdNsDcRae0nCf | 2026-03-23 | 全文 | framework-prd.txt |
| 可见即可说 - 问题分析流程（黄博，基于 9/18 代码快照） | https://bytedance.larkoffice.com/wiki/XGsTwmdzEitMoQkMquTcEbKMnjh | 2026-09-19 | 全文 | problem-flow.txt |
| 「上汽」-「抖音短视频」- 可见即可说方案 | https://bytedance.larkoffice.com/wiki/Va9Fw4yqHiLwP8kpaIacwEZLnEd | 2026-07-16 | 全文（只有两张图，文字为空） | saic-douyin.txt |
| 【AIVA-PRD】VUI主交互需求（徐洋） | https://bytedance.larkoffice.com/wiki/FBsrwA734iaFzZkrZExcHHBtn3d | 2026-11 | 卡片退出、特殊交互策略（卡片链路 0818、主动服务、卡片三方调用、动态 Advisor） | vui-main-prd.txt |
| 动态加载型工具-技术方案 | https://bytedance.larkoffice.com/wiki/T8jDwzwO9iiNF0kbFEVc1uyrnIf | 2026-10-22 | 全文 | dynamic-tools.txt |
| 汽车服务端周报 | https://bytedance.larkoffice.com/wiki/FouOwkkXZihfATk4edEcclsln6g | 2026-11-06 | 按关键词定位：动态加载型工具、模拟点击绕过拒识、端侧召回历史 toolcall 格式 | server-weekly.txt |
| 2026年H2服务端工程双周报 | https://bytedance.larkoffice.com/wiki/MvTIwiTZGif70SkNdtrcrM0lnsg | 2026-11-02 | 同上 | h2-biweekly.txt |
| 汽车前端双周报 | https://bytedance.larkoffice.com/wiki/HUBtw1jQJiAVf6kyEK1c4ao8nUb | 2026-11-05 | 全文（无可见即可说内容） | fe-biweekly.txt |
| AI汽车语音基础体验链路OnePager | https://bytedance.larkoffice.com/wiki/GBcCw5c6xiWvGukPMQgcMiuKnEc | 2026-11 | 端到端流程、热词表 | voice-onepager.txt |
| 豆包 × AIDV 端云链路 OnePager | https://bytedance.larkoffice.com/wiki/DBRnwrLFNiPxV5kZZOXcBYxqnCl | 2026-11 | 全文（无可见即可说） | aidv-onepager.txt |
| 【AIVA-PRD】本地对话链路需求 | https://bytedance.larkoffice.com/wiki/JXC3wPYxziUiJLk9ZlOcYSZ2nsg | 2026-11 | 全文前半（采纳规则、上下文同步、干预缓存） | aiva-local.txt |
| 端云交互协议汇总 | https://bytedance.larkoffice.com/wiki/WUIUwt0A3iiopekzU0Vc22HWn7c | 2026-10-30 | 全文 | proto.txt |
| 即时交互卡片设计策略 | https://bytedance.larkoffice.com/wiki/T5nJw8TRWiokqUk0Egpc8RQ7n8e | 2026-05-14 | 全文 | card-strategy.txt |
| AIDV task service 与 任务岛 & 即时交互卡技术方案 | https://bytedance.larkoffice.com/wiki/HzAtw3ABQif5c8kwKS8cL1x9nhf | 2026-10-29 | 全文（无可见即可说内容，只作背景） | task-card-tech.txt |
| 主动服务即时卡片技术方案 | https://bytedance.larkoffice.com/wiki/P7NcwKeQhiFF2RkZbAscIYIcnNd | 2026-10 | 全文（无可见即可说内容） | proactive-card-tech.txt |
| 三方 Agent 接入协议 | https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d | — | 全文浏览（无可见即可说内容） | agent-protocol.txt |
| 上汽主交互新方案-云端技术方案 | https://bytedance.larkoffice.com/wiki/BCjPwn2FtiiYR2kG0IzcpLaenkg | 2026-07 | 全文（无可见即可说内容） | saic-interaction-cloud.txt |
| 10/19 AI 主交互会议文字记录（逐字稿） | https://bytedance.larkoffice.com/docx/W9VLd0csvoMXj4xVNSsclU0wn8Z | 10/19 | 00:24–00:32 全读 | m1019.txt |
| 9/1 产品内审文字记录（逐字稿） | https://bytedance.larkoffice.com/docx/Zp90dGMheow4XmxwVXAcu2KGnTb | 9/1 | 01:35–01:41 全读 | m0901.txt |
| 9/1 产品周会文字记录（逐字稿） | https://bytedance.larkoffice.com/docx/NSFTd2vSmog1tzxj7VYcoPDdnFc | 9/1 | 关键词定位（用例 review 状态） | m0901w.txt |
| 11/4 非 IP 需求内审文字记录（逐字稿） | https://bytedance.larkoffice.com/docx/UmcIdhNGcooHPqxkuZfcwBcrnJe | 11/4 | 00:25–00:31 全读（奇瑞可见即可说） | m1104n.txt |
| 端侧召回历史对话模拟测试集&测试报告 | https://bytedance.larkoffice.com/sheets/E7LmsznELh24kCtY8uIcAvUmnud | 2026-09 | 搜索摘要里的前 60 行 | — |
| 飞书消息搜索“可见即可说”（近 30 天） | — | 10/11–11/10 | 37 条命中只返回前 16 条（工具截断） | msg-search-kjjks.txt |
| 前期群聊研究笔记（8/13、8/17、9/20 三条） | research/v-lesson-20261107/notes-chat.md | — | 转引；原消息超过 30 天，本次无法重读 | chat-clues-from-notes.txt |
| AI汽车SOP功能清单 | https://bytedance.larkoffice.com/sheets/H45es53mthKMDhtMFbIc9cTin1d | 11/9 | 全量功能清单页，无“可见即可说”行 | sop-function-list-rows.txt |

读不到 / 缺口：
- 《车机应用可见即可说需求描述.xlsx》（欧阳倩子，file/BpcHbvinboh05VxxGcPcHOEUnsb）403 无权限。
- 「上汽」-「抖音短视频」方案正文只有时序图、流程图两张图片，文字没有内容。
- 7/28《【AIVA交互卡】静态advisor/链路交互/消息盒子评审》只在搜索结果看到 AI 纪要摘要（“动态工具逻辑：存在可见即可说、云端 FC 下发两种实现路径”），文字记录未找到，只作线索。
- 11/5 群聊里的 meego 单（7383349203）和截图无权限。
- 8/13、8/17、9/20 三条群聊原话来自前期研究笔记（带消息编号），消息搜索只能回看 30 天，本次未能重读原消息。
- 旧版“任务中心不支持可见即可说、经赛力斯外审确认”“AI Launcher 字段”“记忆 POI 同步”三段，本次未找到对应原文，新版不写。

## 二、按链路步骤的事实笔记

### 步骤 1：页面登记可说的词（车上，页面所属业务）
| 事实 | 出处 | 状态 |
|---|---|---|
| 框架设计：通过无障碍服务实时扫描当前屏幕最顶层页面，提取可交互元素；显示文本作核心指令；同名控件补位置/上下文；过滤符号标点；界面变化实时更新；输出“语音指令-界面元素”映射库（热词指令、泛化词指令、对应 ID）；责任方：车企或各业务模块 | framework-prd 核心模块 1、2 | 3 月框架设计 |
| 代码现状（9/18 快照，上汽、赛力斯 vehicle 分支）：业务侧调用 registerPageHotWords(pageId, words) 注册，离开页面 clearPageHotWords；“未找到页面无障碍节点递归扫描并自动生成完整热词映射的实现” | problem-flow 3.4、五 | 现状（代码快照） |
| “现在主线做的都是主动注册，那没有无障碍扫描”（徐庆，奇瑞对比） | m1104n 00:26–00:28 | 现状口述 |
| 上汽：“前期的那个语音的界面的解析和最后的执行都是上汽来做嘛”（张兰若） | m1104n 00:29:45 | 现状口述 |
| 豆包自己的抖音卡片：DouYinResultCardController 注册页面 vehicle_video_douyin 的预定义热词，命中直接调 SDK | problem-flow 3.4 | 现状（代码） |
| 单页注册词不超过 500 个（随系统能力更新） | framework-prd 模块 4 | 框架需求 |
| 奇瑞（非 IP）：要求以无障碍扫描为主、主动注册兜底，做成独立 SDK 自闭环；不支持多命中；陈敏要求过需求导入会 | m1104n 00:26–00:31 | 讨论中 |
| 东风：有需求文档，需出技术方案后开发，IP 和非 IP 都要核对 | 消息 11/5 14:48 | 讨论中 |

### 步骤 2：词送进识别（车上语音组件；云端热词库也有一类）
| 事实 | 出处 | 状态 |
|---|---|---|
| 在线、离线 ASR 都把注册的语音指令集作动态热词；免唤醒走纯离线；唤醒后离在线并行，离线有结果执行离线，离线无结果等在线；责任方字节语音模块 | framework-prd 模块 3 | 框架设计；线上用哪路文字做匹配待确认 |
| OnePager 热词表：“可见即可说类：车企针对每个页面注册一些常用热词，命中可直接指向匹配动作”，来源“端侧页面切换时可获取”，上限 500 | voice-onepager 热词表 | 已定方案 |
| 豆包在线识别配置实体热词后，可见即可说类句准 95%（5/9 ASR 测试报告） | notes-depth-docs（转引） | 历史测试数据 |

### 步骤 3–4：出字、车上匹配
| 事实 | 出处 | 状态 |
|---|---|---|
| 运行时：ASR 输出 → 文本归一化（“停一下”→“暂停”）→ 与已注册热词匹配 → 返回命中状态、目标类型、目标 | problem-flow 2.2 | 现状 |
| 语音 SDK 把命中结果放入 matchVC（日志带 isFinal）；正常判据“最终结果 matchVC=true” | problem-flow 3.4、4.6 | 现状（代码） |
| 对话系统“只负责接收页面的热词，接收 ASR 的结果和注册的热词进行匹配，以及返回匹配成功与否的结果” | problem-flow 1.2 | 现状 |
| 框架匹配规则：精确；模糊（前缀“点击/点一下/帮我选/选择”，后缀“吧、啦”）；歧义消解（多个匹配返回注册方自行选择）；局部匹配“6个以上，需连续匹配4个字以上” | framework-prd 模块 4 | 框架设计；现行代码是否全部实现待确认 |
| badcase 8/13 上汽：车道级导航“字节的 FC 不支持，所以要走可见即可说”，注册“关闭车道级导航”，用户说“退出车道级导航”，匹配不上走闲聊兜底，豆包回复不支持（郭金龙） | notes-chat（转引） | 真实 badcase |
| badcase 8/17 上汽：ASR 最终文本“暂停视频”，暂停热词组 [暂停, 停一下, 暂停播放]，匹配器未把它当子串命中，matchVC:false，请求送到服务端，触发音乐链路；后称“问题已经修复了” | notes-chat（转引） | 真实 badcase，已修复 |

### 步骤 5：分流
| 事实 | 出处 | 状态 |
|---|---|---|
| SawSayQueryHandler 在命中时记录拦截事件、上报一条“模拟点击了……”历史，返回 INTERCEPTED，“不再进入普通对话链路” | problem-flow 3.4 | 现状（代码） |
| OnePager：“若为「可见即可说」或简单车控且本地命中，端侧直接召回、执行并生成 Answer，并将 Query、Answer、Observation 经 context/sync 上报写入历史；端侧未命中则进入云端正式链路” | voice-onepager 端到端流程 | 已定方案 |
| 未命中只表示不触发快捷控制，不能默认会走 GUI Agent 兜底 | problem-flow 主要判断 | 现状 |
| 3 月框架优先级 P0 用户自定义任务、P1 可见即可说、P2 FAQ、P3 端侧LLM、P4 云端LLM | framework-prd | 3 月框架设计（历史口径，不等于现行仲裁） |
| 激活态下声音同时在上云（R、V 章），命中拦截后云端那一路是否被取消、云端历史如何去重：未找到原文 | — | 待确认 |
| 本地 PRD 的车上链路是“干预缓存（固定说法）→ 本地 LLM”，没有提可见即可说；两者在车上的先后：未找到原文 | aiva-local | 待确认 |

### 步骤 6：页面业务执行
| 事实 | 出处 | 状态 |
|---|---|---|
| 目标为控件时通知车机，通过无障碍能力模拟点击；目标为 SDK 时直接调用抖音 SDK（如 pause） | problem-flow 2.2 | 现状 |
| 抖音结果码：SUCCESS / FAILED / NO_RESPONSE / NOT_LOGIN_IN / NOT_SUPPORT / NETWORK_INVALID / 到顶到底 | problem-flow 4.6 | 现状（代码） |
| “以最终 UI 或业务状态为完成标准，不能只凭‘动作已发出’判定成功” | problem-flow 4.1 | 排查原则 |
| 框架：模拟操作含点击、输入、滚动；执行结果成功/失败及播报内容传豆包统一播报（成功“好的/搞定了”，失败“抱歉，没执行成功”）；模拟点击要有 UI 点击动效；失败 toast，失败文言不播报；责任方车企/业务模块 | framework-prd 模块 5 | 框架设计；统一播报是否已实现待确认 |
| 徐洋：“如果他走了可见即可说，他就降级了，他没有特殊的 NLG。然后上下文连贯也不是很好” | m0901 01:38:36 | 口述现状 |

### 步骤 7：回写历史（车上 → 云端）
| 事实 | 出处 | 状态 |
|---|---|---|
| 框架：可见即可说内容需进对话历史，并标记来自模拟点击事件，防止下一轮模型推理错误 | framework-prd 历史对话 | 框架要求 |
| 代码：命中时上报“模拟点击了……”历史；上汽看 type=TYPE_ADD 且 from=HISTORY_SAWSAY；赛力斯看 TYPE_SAWSAY_TASK，据此选择 SawSay agent id | problem-flow 3.4、4.7 | 现状（代码） |
| 端侧召回历史对话模拟：原来端侧上报直接给 QA 对，改为 planner toolcall 格式，“区分端侧车控函数和可见即可说场景要求构建不同的toolcall格式”；9.8–9.9 开发联调，9.15 上线 | h2-biweekly / server-weekly | 已上线（9/15） |
| 测试集里“我的爱车”“座椅”“坐垫”等可见即可说用例，预期“离线历史被拼接在DT历史对话内” | 端侧召回历史对话模拟测试集 | 测试用例 |
| badcase 11/5：“退出导航 被可见即可说拦截了。被拦截的对话历史并没有上报给云端 所以用户继续说 确认 豆包不清楚确认什么”；车上豆包仍是 0806 版本，“上报被可见即可说拦截的对话内容是 0831 上线的” | 消息 11/5 17:09 | 真实 badcase；根因版本未升级 |

### 步骤 8：页面变化换词表
| 事实 | 出处 | 状态 |
|---|---|---|
| 离开页面 clearPageHotWords；页面变化后更新 ASR Context，避免使用旧页面词表 | problem-flow 2.1、3.4 | 现状 |
| 排查重点：query 发起前是否注册了与 query 完全一致的热词、是否被移除；生命周期类问题“在 asr 识别的过程中收到了 remove hotwords 移除了对应的热词” | problem-flow 4、4.2 | 现状 |
| 即时交互卡退出：TTS 播完默认 10s 退出，TTS 播报、视频播放、图片加载、手动点滑暂停计时；上滑 ASR 胶囊关闭 | vui-main-prd 439–452 | 已定方案（赛力斯） |
| 缺统一的“页面版本/Context 版本/命中结果/执行结果”关联 ID 和完整错误码表；项目空间未召回可见即可说测试用例集 | problem-flow 五 | 已知缺口（9/18） |

### 增强版（云端）：动态加载型工具
| 事实 | 出处 | 状态 |
|---|---|---|
| 背景：即时交互卡二轮语音“一般依赖端侧可见即可说的能力，但可见即可说只能支持白名单内的文本，没有泛化的能力，因此需要云端来理解用户的query，并定位到卡片中具体的按钮” | dynamic-tools 需求简介 | 已定方案 |
| 卡片出现时，请求里带卡片信息（标题、正文、按钮、触发原因、卡片 id）；条件满足才把“当前页特有操作”工具加进 DT 的工具列表；DT 输出选中的按钮；下发车上执行 | dynamic-tools | 已定方案 |
| 进度：技术方案评审 8.31，9.3–9.10 开发，9.18 联调，10.16 测试中，10.22 已上线（[DONE] 张弛、李兆乾） | server-weekly | 已上线（服务端） |
| 10/19 张航：“但是刚才飞哥那个能力，我们现在应该还没准出啊，这部分应该是在赛力斯才实现的，就是高阶的所见即可说。”徐洋：“是的” | m1019 00:30:52 | 10/19 未准出；赛力斯 |
| 需求在双周报挂在“【AIVA-主交互】消息盒子：系统通知接入卡片和语音对话”下 | h2-biweekly | 赛力斯 |
| 徐洋：端侧把扫到的内容全上报给云端，靠模型做，“就做一次，像这20个场景可能都支持了” | m1019 00:31:35 | 口述 |
| 9/20 拒识群：新增即时交互卡可见即可说后，“稍后处理”这类 query 会被拒；张嘉锋拟把当前页面端状态加入拒识上下文，并说“都不会跳过拒识的” | notes-chat（转引） | 讨论中 / 提需求 |
| 模拟点击产生的 Query 绕过拒识：“还未评审, 待拉起评审后启动” | server-weekly | 未评审 |

### 卡片四条路（0818）
| 事实 | 出处 | 状态 |
|---|---|---|
| ① Planner 链路卡片：语音由 Planner 自闭环；手动点击直接执行并作为特殊事件日志上报；“此场景不注册卡片‘可见即可说’词条” | vui-main-prd 483 | 已定方案 |
| ② 静态 Advisor：语音由 Planner 闭环；手动点击模拟一个 Query 上云 | vui-main-prd 484 | 已定方案 |
| ③ 系统通知卡：可见即可说增强版，Planner 动态插入选择工具，生命周期与卡片绑定；手动点击有接口直接执行并上报 | vui-main-prd 485 | 已定方案（10.22 服务端上线） |
| ④ 端侧自闭环服务通知：不经过 Planner，离线直接执行，语音靠可见即可说 | vui-main-prd 486；m1019 00:25:10（天气保护路况） | 已定方案 |
| 9/1 徐洋：“即时交互卡，我们是优先不注册可见即可说的，因为大部分是能够通过云端的这个业务去闭环的”；“现在所有的卡片都没有注册可见即可说”；“这个也是上汽沿用的这个规则”；不会再提供小模型给可见即可说做泛化，泛化词由业务补 | m0901 01:38–01:40 | 9/1 现状 + 已确认原则 |
| 天气路况保护卡（赛力斯，端侧自闭环）的二次确认用可见即可说注册词条：徐洋“没问题，你就正常的去给模块的研发提注册词条的需求就行” | m0901 01:37:30 | 9/1 确认方向；实现状态待确认 |

## 三、演进 / 取舍 / badcase / 争议
- 演进：3 月框架“无障碍扫描自动生成” → 实际主线“业务主动注册”（9/18 代码、11/4 口述）→ 奇瑞要求回到“扫描为主”（讨论中）。
- 演进：卡片二轮语音原想靠可见即可说 → 只认白名单、不泛化、降级无专属话术 → 云端动态加载型工具（10.22 上线）。
- 演进：被拦截的话不进云端 → 0831 起上报“模拟点击了……”→ 9.15 改成 DT 的工具调用格式拼进历史。
- 取舍：规则匹配（快、确定、可离线）vs 模型泛化（能听懂换说法，但要上云、要拒识）。
- badcase：8/13 车道级导航；8/17 暂停视频；11/5 退出导航后“确认”接不上。
- 争议 / 待定：多命中谁来选（框架交注册方；奇瑞不支持；主线实现待确认）；拒识是否看页面状态；模拟点击 Query 是否绕过拒识；增强版上汽是否接。

## 四、与旧版 / 相邻章冲突
1. 旧版说“车企或业务方通过无障碍服务实时扫描当前屏幕”是现状——与 9/18 代码梳理和 11/4 内审冲突：主线是业务主动注册，没有无障碍扫描；扫描只是框架设计和奇瑞诉求。新版改正。
2. 旧版把“匹配后交回业务消歧，不默认点第一个”写成定论——框架这样设计，但主线是否实现未见代码证据，奇瑞明确不支持多命中。新版写成“框架设计，现行待确认”。
3. 旧版“失败反馈不逐字念已落地”“音区与请求编号留痕已落地”——找不到出处，删除。
4. 旧版“赛力斯 9 月 30 日更新后本地拒识和语义结果暂不采纳”放在本章——属于 R 章 1.7B 采纳规则，本章只引用 R 章，不展开。
5. 旧版“任务中心不支持可见即可说（赛力斯外审确认）”“AI Launcher 字段”“记忆 POI 同步”——本次未找到原文，删除。
6. 旧版第三类卡片写“已落地”语气——服务端 10.22 上线，但 10/19 宣讲称“还没准出”，赛力斯才有；新版按“服务端已上线、准出与项目范围待确认”写。
7. 与 V 章：V 章热词 7 类中“可见即可说（当前页面注册的按钮词，最多 500 个）”——一致。V 章说 1.7B 赛力斯车上跑、上汽云端服务器跑——本章说明可见即可说不是 1.7B，也不是固定说法，一致。
8. 与 R 章：R 章写“离线时端侧自闭环卡片走可见即可说注册；注册制已定”——本章与之一致，并补充 9/1 “现在所有卡片都没注册”的当时现状。
9. 与 E 章：E 章附录把动态加载型工具写在工具层；本章讲它为何来自可见即可说。E 章称其“开发中”（引自较早周报），服务端周报最新为 10.22 已上线——口径冲突，以服务端周报 [DONE] 为准，并保留 10/19“未准出”。需 E 章同步。
10. 与 O 章：O 章卡片 10 秒退出、上汽 AI 画布 / 赛力斯即时卡——本章一致引用。

## 五、缺口
- 线上匹配用的是车上离线识别文字还是云端识别文字（两项目各自）；
- 命中拦截后，已在上云的那一路云端请求是否取消；
- 可见即可说与车上固定说法（干预缓存）谁先；
- 多命中在主线的实际处理；
- 统一播报（“好的/搞定了”）在现行代码里是否实现；
- 增强版在上汽是否接入、赛力斯是否已准出；
- 可见即可说的线上命中率、误命中率：未找到任何数据。
