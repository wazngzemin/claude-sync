## 单元 16：AI Launcher

“已确认”表示已核对所引文档这样定义或记录，不代表本次已做实车验收。图、主例、排查顺序是依据来源组织的教学说明；教学步骤数不是产品指标。

| ID | 原子事实／规则 | 状态 | 资料性质／适用边界 | 来源：文档名、文件、原文位置与短摘 |
|---|---|---|---|---|
| V16-F01 | AI Launcher 展示引导语、问候语、任务、推荐场景、skill | 已确认 | 产品定义；不是当前车型交付清单 | 《AI汽车产品 one page》；`/Users/bytedance/Desktop/3.23/产品/codex/座舱业务学习站/research/v-lesson-20261105/product-onepage.md:2028-2033`：“支持在桌面上展示引导语、问候语、任务、推荐场景、skill”。 |
| V16-F02 | Launcher 与导航、舒适、媒体页面、AI 任务岛分列 | 已确认 | 产品概念边界 | 同文 `:2028-2057`：“核心三应用”“在导航、舒适、媒体三个页面展示相关的信息”；由此解释 Launcher 不是全部结果界面的统称。 |
| V16-F03 | HMI 沟通稿把 Launcher 首页定位为直接互动界面，并声明不是最终全量文档 | 已确认 | 设计方案；最终全量交付待确认 | 《HMI 交互方案—双方沟通文档》；`/Users/bytedance/Desktop/3.23/产品/codex/座舱业务学习站/research/v-lesson-20261105/hmi-launcher-partial-readable.md:1-7,3186-3198`：“非最终全量文档”“Launcher首页…最直接互动和沟通的界面”。 |
| V16-F04 | 卡片点击可能直接执行，也可能模拟 Query；执行结果存在事件上报路线 | 已确认 | VUI 卡片规则；不能直接推断所有 Launcher 入口协议 | 《【AIVA-PRD】VUI主交互需求（仅对内）》；`/Users/bytedance/Desktop/3.23/产品/codex/座舱业务学习站/research/v-lesson-20261105/aiva-vui-prd.md:1033-1041`：Planner 卡“手动点击直接执行”；静态 Advisor 卡“需模拟一个 Query 走到云端”；系统通知卡“通过事件日志上报云端”。 |
| V16-F05 | 沟通稿包含全局技能页、下拉刷新和图标配置 | 已确认 | 设计方案，含不同修改阶段；不是固定刷新周期 | HMI 同文 `:17-31,244-270,329-366,433-465,1003-1009`：“全局技能页入口”“下拉刷新的…”。 |
| V16-F06 | 当前车型 Launcher 功能清单、各入口执行协议、刷新周期、排序与任务入口位置 | 待确认 | 当前上线状态／接口映射缺口 | HMI 同文 `:5-7` 明示非最终全量；产品 one page `:2028-2033` 仅有功能定义，VUI `:1033-1041` 仅为卡片分类；没有当前车型 Launcher 逐入口验收清单。正文只提供核对方法。 |

## 单元 17：回写

| ID | 原子事实／规则 | 状态 | 资料性质／适用边界 | 来源：文档名、文件、原文位置与短摘 |
|---|---|---|---|---|
| V17-F01 | 本地命中的可见即可说／简单车控，Query、Answer、Observation 经 context/sync 上报写历史 | 已确认 | OnePager 链路描述；执行结果回写，不等于形成长期记忆 | 《AI汽车语音基础体验链路OnePager》；https://bytedance.larkoffice.com/wiki/GBcCw5c6xiWvGukPMQgcMiuKnEc ；`/Users/bytedance/Desktop/3.23/产品/codex/座舱业务学习站/research/v-lesson-20261105/voice-onepage.md:610-612`：“将 Query、Answer、Observation 经 context/sync 上报写入历史”。 |
| V17-F02 | 可见即可说历史要标记来自模拟点击，防止下一轮推理错误 | 已确认 | 框架需求；代码快照另有实现证据，不推断所有发布包 | 《【AI汽车】可见即可说框架需求文档》；`/Users/bytedance/Desktop/3.23/产品/codex/座舱业务学习站/research/chapters/W/raw/framework-prd.txt:92-93`：“需在历史对话中标记出来自模拟点击事件”；《可见即可说问题定位链路》同目录 `problem-flow.txt:126-135`：“上报一条‘模拟点击了……’历史”，且 128 行说明分支快照不代表所有已发布包。 |
| V17-F03 | 本地拒识／不唤醒也同步，本地进 context，云端进情景上下文、不进 DT 上下文 | 已确认 | 本地 PRD 需求边界 | 《本地对话链路 PRD》；`/Users/bytedance/Desktop/3.23/产品/codex/座舱业务学习站/research/chapters/R/raw/local-prd.txt:120-122`：“若当前轮被本地拒识/不唤醒，也需要同步”“云端进入情景上下文，不进DT上下文”。 |
| V17-F04 | 旧 930 前置分流逻辑为各种本地输出均同步；后续修改按端云融合结果只同步本地被采纳结果，另有拒识分支 | 已确认 | 明确的版本演进，非当前互斥冲突；930 是原文标识，不擅自补年份 | 同文 `:117-120`：“（930前置分流逻辑）…无论本地输出…”“后续修改…将本地被采纳的结果同步给云端”。 |
| V17-F05 | 同步字段包含请求／会话编号、音区、端云 ASR 文本、最终结果类型、函数名／参数、NLG、时间 | 已确认 | 字段需求；不意味着拒识也执行函数 | 同文 `:123-124`：“request_id/session_id/sound_zone/local_asr_text/cloud_asr_text/final_result_type”“function_name/function_arguments/nlg/timestamp”。 |
| V17-F06 | 同步失败不重试是专项文档当时现状；网络恢复后重新同步是预期 | 已确认 | 当时现状＋需求，未以讨论稿证明实现 | 《AIVA-网络专项讨论》；`/Users/bytedance/Desktop/3.23/产品/codex/座舱业务学习站/research/chapters/R/raw/net-special.txt:16-24`：“现状：仅在对话完成后同步端云上下文一次，如同步失败，不重新请求”；“预期…重新发起端云上下文同步”。未用会议 AI 纪要作结论。 |
| V17-F07 | 现版本补同步上线、重试与去重规则、各类记录实际保留期限 | 待确认 | 缺少当前版本实现／验收证据 | 本地 PRD `local-prd.txt:117-124` 未给独立永久保存期限；网络专项 `net-special.txt:16-24` 仍区分现状／预期；正文回指第 13 单元的对应上下文策略，不新增保存天数。 |

## 单元 18：TTS 播报与打断恢复

| ID | 原子事实／规则 | 状态 | 资料性质／适用边界 | 来源：文档名、文件、原文位置与短摘 |
|---|---|---|---|---|
| V18-F01 | Planner 提供 Answer／talk_content，云端合成 TTS 并下发标识，车端拉音频流并播放 | 已确认 | 链路描述；合成完成不等于实际听到 | 《AI汽车语音基础体验链路OnePager》；https://bytedance.larkoffice.com/wiki/GBcCw5c6xiWvGukPMQgcMiuKnEc ；`/Users/bytedance/Desktop/3.23/产品/codex/座舱业务学习站/research/v-lesson-20261105/voice-onepage.md:606,901-926`：“下发 TTS 标识，端侧…拉流、流式播放”；示例含 `talk_content`。 |
| V18-F02 | 允许恢复链路中，最终 Reject 通过 Event 触发新 Query；Recall 由 Planner 融合新 Query 与未播内容 | 已确认 | OnePager 恢复分流；需和停止原因表联合阅读 | 同文 `:614-616`：“最终 Reject 时通过 Event 触发新 Query恢复上一条；Recall 时由 Planner 融合…生成自然且不重复的新 NLG”。 |
| V18-F03 | 恢复输入包含已经说的与没有说完的内容；有效新请求示例包含 last_talk_content | 已确认 | 恢复提示示例，不等于播放器无限重播 | 同文 `:1121-1138`：“你已经说了…”“被打断了没说完的话是…”；`last_talk_content` 标记被打断位置。 |
| V18-F04 | 新播放替换、服务挂起、第三方停止指定／全部播放、离线车控播放、静默态列为不恢复 | 已确认 | OnePager 停播原因表 | 同文 `:1171-1254,1283-1320`；对应 ComeNewPlay、OnServiceSuspend、ThirdPartyStopById、ThirdPartyStopAll、PlayOfflineVehicleControl、VoiceSilence，“是否要恢复”均“否”。 |
| V18-F05 | 云端未拒识、流式非拒识、多人句首“豆包”对应停止原因列为可恢复 | 已确认 | OnePager 停播原因表；“可恢复”不等于原文逐字重复 | 同文 `:1261-1276,1327-1364`；NotRejectQuery、StreamNotRefusal、MultiPersonSayStartWithDoubao，对应“是”。 |
| V18-F06 | SingleInterrupt：车内单人且 ASR 字数大于 2 时直接打断，表中不恢复 | 已确认 | 特定停止原因；不能扩大到所有单人体验 | 同文 `:1371-1386`：“ASR字数大于2个字时，直接打断…”，“是否要恢复：否”。数字 2 与大小关系原样保留。 |
| V18-F07 | VUI“打断后拒识 NLG 不恢复”和 OnePager“TTS 恢复”的车型／版本及屏幕音频边界 | 待确认 | 存在表面差异，但对象不同，尚不能直接判定同一规则冲突 | 《VUI主交互需求》`/Users/bytedance/Desktop/3.23/产品/codex/座舱业务学习站/research/v-lesson-20261105/aiva-vui-prd.md:658-666`：“NLG不恢复，ASR区域清空，对话转入延时聆听态”；对照 OnePager `:614-616`“恢复上一条”。需确认是否分别指屏幕文案／音频生成，以及生效版本。 |
