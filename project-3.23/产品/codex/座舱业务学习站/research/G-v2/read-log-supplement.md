# 补查阅读登记（SUP）

范围：主代理关键词索引中 evolution、memory-evolution-20261028、lecture-rewrite-20261029、v-lesson-20261105/06；仅本地快照和源段落，不启动浏览器。JSON 递归解码合法的嵌套字符串；不完整的 content_excerpt 只恢复其中可见正文，标“部分正文”，不得称全文。

## 第一批：evolution 与早期 compact

- `research/evolution/body-weekly.json`：`$.content_excerpt` 是截断的 JSON 字符串，恢复其中 content.content 可见正文的相关段落（解码后947～958、1397～1504、1766～1779、1926～1937）；端状态 M2/PHUD/旧值/耗时打点/渠道权限均已由 ROOT-F020～021、EVT-F104～110 的更新周报覆盖，无新增，较旧“待定”不覆盖后续已排期。
- `research/evolution/search-eval.json`：`results[1/2].body_excerpt` 虽名含 body，内容实际是资料导航/阅读状态清单；只列目录线索，不作对应在线文档正文已读证据。
- `research/evolution/search-reflector-all.json`：嵌套 context 的 4000 字符截断片段只是评测模块映射“静态目标、动态目标、触发器、系统通知”，无新增触发器实现事实。
- `research/evolution/search-reflector.json`：一个截断迭代规划表片段、一个资料导航片段；前者缺日期与完整行上下文，后者只是目录，均不新增交付事实。
- `research/evolution/search-self-evolution.json`：同源资料导航和上述迭代规划表片段；目录/部分读取证据，非新业务事实。
- `research/lecture-rewrite-20261029/async-source-compact/A03.md`：相关段落 1～12、42～61 讲 Task Service/任务规则/回调回流，已在 T 章卡片 65～74 和 G 既有事实覆盖，回指 T，不增加一套任务正文。
- `research/lecture-rewrite-20261029/async-source-compact/A04.md`：相关 Goal 生命周期段落 5～9、26～39、65～75 已读；上汽 Extour 与回流幂等由 T/G 主来源覆盖，系同源提取副本。
- `research/lecture-rewrite-20261029/async-source-compact/A11.md`：相关段落 1～17、49～104 已读；OnePage 静态/变化/混合触发边界与 G-trigger 同源，其“不能条件+推理”是较早范围，不能盖过后续端状态+视觉组合和语义条件演进。
- `research/lecture-rewrite-20261029/async-source-compact/A30.md`：相关段落 5～16、76～87 已读；推荐缓存、卡片展示不自动触发回流为 U/M/T 交叉细节，现有任务回流事实覆盖，无新云端匹配规则。
- `research/lecture-rewrite-20261029/async-source-compact/A51.md`：相关段落 26～37、129～140、184～195、404～415、450～461、576～587、697～708、795～864、900～952 已读；静态 Advisor PRD，主要是 S 章的输入、开关、建议策略，依赖触发器/端状态应分开验收，无新增 G 真问题。
- `research/lecture-rewrite-20261029/async-source-compact/A66.md`：相关输入合并、排队、过期、动态/静态建议段落 68～98、112～141、227～241 已读；与 M 章同源，不把“先不看”的早期设计变成当前触发器策略。
- `research/lecture-rewrite-20261029/async-source-compact/A84.md`：AI 开关相关段落 41～50、114～125 已读；不同业务关闭后的保留/清除与 T/K/S 开关边界相关，提取 SUP-F001 作为 G 交付边界，非统一所有任务规则。
- `research/lecture-rewrite-20261029/async-source-compact/T8jDwzwO9iiNF0kbFEVc1uyrnIf.md`：70～77 行仅说明动态工具条件未来复用 Trigger 的方向，与 F 章来源同源，无新能力上线事实。
- `research/lecture-rewrite-20261029/async-source-compact/ZS6rd5ytKomVEwxDVebcKGTkn6d.md`：35～46、299～311、518～529 行属于 Agent 通用接入协议中 trigger_method（触发来源）枚举，不是云端 Trigger 自己输出的触发规则，留 F。


## 第二批：讲课来源与专家方案

- `research/lecture-rewrite-20261029/lecture-search.json`：递归解码 text 后 results[0].body_excerpt 87～103 为已读 Director 宣讲原转录同源，results[2].body_excerpt 105～116 为其 AI 会议摘要；不新增事实，不以摘要盖过文字记录。
- `research/lecture-rewrite-20261029/source-补查-input-management.md`：38～51、95～104、271～282 行的有效 advice、task_run_id、重放边界、播放结束与排队规则已由 M 章覆盖；未新增云端 Trigger 判断或计次实现。
- `research/lecture-rewrite-20261029/style-contract.md`：5～16 行是讲课写作提炼，非运行事实源。
- `research/lecture-rewrite-20261029/tool-text.md`：257～268、442～451、474～483 行是既有工具章节整理稿，旧日程工具不等于当前 task_agent、动态工具未来复用 Trigger 均已覆盖，不把整理稿当新增事实。
- `research/memory-evolution-20261028/evolution-expert-knowhow.json`：content[0].text 解码后 content_excerpt 是被截断的专家场景表 JSON；可见“2分钟/3分钟/10分钟冷却”指展厅外部感知、声光迎宾场景，未证实运行于云端 Trigger，明确排除，不能当 G 的冷却默认值或真实坏例。
- `research/memory-evolution-20261028/evolution-expert-plan.json` 与 `.md`：解码 content.content 72～85 行是专家知识规划表，2分钟/10分钟均是展厅设计场景；JSON 与 MD 同源，无新增 G 生产事实。
- `research/memory-evolution-20261028/evolution-knowledge-retrieval.json` 与 `.md`：content.content 246～259 行同一 EXP 场景知识汇总，冷却仍是展厅场景设计，非触发器默认策略。
- `research/memory-evolution-20261028/evolution-search-expert.json`：递归解码 body_read_scope.items[0].context.content.content 82～93 行是先接全量感知、按需订阅的短期建议；items[1] 是上述专家规划表截断副本；items[5] 是学习站讲课稿导航；均未新增可验收的云端触发机制。


## 第三批：记忆目录与任务同源材料

- `research/memory-evolution-20261028/evolution-search.json`：递归解码 results[1].body_excerpt 是学习站生成讲课稿（4～89），其中儿童锁漏触发等教学说法不作为新真实案例；results[2].body_excerpt 是 M10 资料目录（仅目录线索），含“触发两次主动服务才到预期”、测试用例、定时技术方案等条目，未读对应在线正文。
- `research/memory-evolution-20261028/initial-1.json`：嵌套 content_excerpt 截断，恢复可见原转录 3007～3018，2026-08-19 讨论 VLM 观察目标/任务转发，与 memory-meeting-partial.md 同源，也与 T 视觉任务材料重合，未新增结论。
- `research/memory-evolution-20261028/initial-2.json`：程序解码检测与 reads-1 evolutionreview 同源；属于主代理已读演进会议文本副本，不重复提事实。
- `research/memory-evolution-20261028/initial-3.json`：items[0/3] 是资料导航部分正文，items[5] 是参考资料目录，items[6] 是模块联系人；“正文片段已读”标签只描述旧检索批次，不代表本次读过对应在线原文。
- `research/memory-evolution-20261028/library-read-advisor.json`：递归解码 content.content，8～19、123～142、320～331 的上汽 Goal 与 A04/既有 T 来源同源，无新增。
- `research/memory-evolution-20261028/library-read-task.json`：content.content 8～19、229～256 为 Task Service OnePager，与 A03/既有 T 来源同源，无新增。
- `research/memory-evolution-20261028/library-search-3.json`：results[2].body_excerpt 146～157 只列 Goal/Trigger/Tracking/Notification Rules 的泛 Agent 概念，不是当前车载 Trigger 运行实现。
- `research/memory-evolution-20261028/library-search-focused-0.json`：items[4] 为“系统预设任务”产品整理片段（143～170），items[6] 为端状态事件 OnePage（1～19、97～108、189～200），均已被原始触发器与事件来源覆盖；产品整理中“车控确认权”等宽泛说法不反推所有静默动作统一确认。
- `research/memory-evolution-20261028/library-search-focused-1.json`：items[2] 仅多维表字段定义“触发器可行性评估”；items[4] Goal OnePager 同源；items[5] 为早期功能规划表截断（时间/视觉/注册触发器/自驱推理，缺完整状态）；items[6] 是长时任务 Workflow 讲笑话设计演示，非现网 Trigger 执行机制。
- `research/memory-evolution-20261028/library-search-focused-2.json`：items[1] 是视觉任务技术方案截断（82～197），RegisterScene/vlm_inference/3个观察任务已在 T 和 G 主来源覆盖；items[2] Task OnePager 同源；items[3] 是任务中心技术方案（67～268）开关通知 Trigger、具体接口待确认，边界留 U/T/P；items[4] 只证实模拟数据 VLM→Trigger→TaskService 链路通畅，非实车验收；items[5] 任务岛类型字段属 U/T，不作为 G 条件类型枚举。
- `research/memory-evolution-20261028/memory-clean-test.md`：211～248 的 trigger_task_id 是端状态上报携带的 Planner 任务关联字段，不等于 Trigger 自己一次业务触发标识。
- `research/memory-evolution-20261028/memory-meeting-partial.md`：3007～3018 与 initial-1 原转录同源，无新增。
- `research/memory-evolution-20261028/memory-test.json`：content.content 692～703、794～805 与 memory-clean-test 上报协议同源，无新增。

## 第四批：V 章后续检索残余

- `research/v-lesson-20261105/V-lecture.md`：153～164 为端侧模型与 Planner 的教学正文，非云端 Trigger 原始事实源。
- `research/v-lesson-20261105/dt-search.json`：results[0].body_excerpt 34～71 为学习站生成讲稿；四类坏例原因是教学解释，不能把其中“儿童锁漏触发/视觉同帧波动”当本次新发现的线上案例。
- `research/v-lesson-20261105/fc-search.json`：items[2] 可见原转录 1～77 为 8 月 11 日端侧自闭环技术方案评审，priority/表达式库/动作等细节留 L；items[7] 仅触发器总台账字段定义，未给台账记录或验收结果。
- `research/v-lesson-20261105/launcher-search.json`：items[2] 是 11 月 4 日晚转录开头片段，与本次完整原文同源；其余 launcher failover 等英文 trigger 命中与云端触发器无关。
- `research/v-lesson-20261105/memory/event-report.json`、`.md`、`event-report-compact.md`：端状态和 VLM 最新/历史数据供 Context/Trigger 使用，与事件 PRD/技术方案主来源同源，不增加新规则。
- `research/v-lesson-20261105/memory/search-0.json`：results[0].body_excerpt 为资料导航（11～332），只登记目录与旧阅读状态。
- `research/v-lesson-20261105/memory/search-1.json`、`search-boundary-1.json`、`search-focus-2.json`、`search-reconcile-1.json`、`search-reconcile-2.json`、`search-term-2.json`：程序解码后唯一相关正文均指向上述 dt-search 生成讲稿副本。
- `research/v-lesson-20261105/memory/search-2.json`、`search-focus-3.json`：results[2].body_excerpt 119～130、518～529、827～838 为静态 Advisor PRD，与 A51 同源；“急速冷却”是温控动作，非频控冷却。
- `research/v-lesson-20261105/memory/search-boundary-0.json`、`search-focus-0.json`、`search-h2h-report.json`：results[2].body_excerpt 365～480 为 Director PRD 同源，在线/离线 Trigger、advice/event 输入边界已读，无新增。
- `research/v-lesson-20261105/memory/search-memory-tech.json`：相关命中在文档摘要，而唯一正文对应既有 DNA 主交互技术方案；主代理及 T 已覆盖，不新断言接口上线。
- `research/v-lesson-20261105/memory/search-new-1.json`：results[2].body_excerpt 1～335 是 11 月 4 日晚转录同源，原文已全文读，计次/调度仍用 11 月 9 日新共识。
- `research/v-lesson-20261105/memory/search-new-2.json`：results[2].body_excerpt 1～435 是“触发器配置平台改造 副本”产品稿，包含儿童锁/充电口盖设计、运行结果分层、保存生效分离；属于 P 章设计线索，不能把稿中云端方案当已落地实现或真实故障。
- `research/v-lesson-20261105/memory/search-reconcile-0.json`：results[2].body_excerpt 22～33、164～175 是早期输入枚举，用 Trigger 指任务触发通知；不能覆盖现行 SP advisor/event 拼接和 task_agent 工具名。
- `research/v-lesson-20261105/memory/search-specific-0.json`、`search-specific-2.json`：截断 SOP 工作表可见触发器“可量产/纯云端可量产/端云结合内部预研”行，与本次原始 XLSX 同源，交付状态以工作簿逐表读取为准；“Trigger：输入触发管理”大类不等于本章云端 Trigger 服务。
- `research/v-lesson-20261105/memory/search-term-0.json`：event-report 同源。
- `research/v-lesson-20261105/prequery-design.json`、`.md`：content.content 459～470、705～716 的 trigger_method 只是通用请求触发来源参数，非 Trigger 规则。
- `research/v-lesson-20261106/notes-wiki-v.md`：71～93 行为各模块状态整理稿，事件窗口/输入管理/任务岛分工已在对应原始材料核过，留章节回指，不增 G 生产事实。
- `research/v-lesson-20261106/wiki-tree.tsv`：相关条目行436、471～475、669～684、784～785、939为目录元数据；已读目录，不等于对应在线正文已读。

## 仅目录/摘要线索（不计入 G 事实或真实案例）

1. 目录出现“触发了两次主动服务才到预期”，未取得该条问题原始过程与根因，不能新增为已核坏例。
2. 目录列触发器测试用例 `S003sCaCshDln7tf1XacYLkdnZf`、自动化测试 `DucqsqPRfhqeW6tq1dxcDu82nfg`、导航条件 `RJVQsCHnMhhQdktK2BtcJzeYnUb`，本次补查只读目录，不声称已读在线表全部行。
3. 目录列“Trigger 人数变化识别与 AIDV 回调技术方案” `ELGjdUbZOoxTUOxlvFqcmoT2nvf`、系统预设场景技术方案 `F7uVdVMqGoSE1rxInuucFbUynbf`、静默展示一期技术方案 `Bl4AdeDEqoyar7xAL7QcG3Bbnyh`，仅凭目录不能推导具体算法、接口或交付状态。
4. 若搜索摘要提“危险驾驶提醒没配动态条件不触发，但没拿到模拟车速”“静态 Advisor 请求有 response”“误用 PPE 环境”，只是旧汇总摘要，本次没有取得对应聊天原始段落，不补写已核根因或修复状态。
5. 搜索结果包含跨项目运营频控、商家通知、代码 Trigger/Failover、展厅冷却等无关词，均排除。


## 全部 163 个命中文件的处置核对表

说明：“相关片段已读”仅指本地关键词命中及相邻上下文；“主代理覆盖”或“生成副本排除”不表示本代理另读了全文。精确解码字段、同源映射保存在 supplement-decode-log.json，供复核，不作为事实证据。

|文件|处置|
|---|---|
|`research/evolution/body-weekly.json`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/evolution/search-eval.json`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/evolution/search-reflector-all.json`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/evolution/search-reflector.json`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/evolution/search-self-evolution.json`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/lecture-rewrite-20261029/EL-working.txt`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/EV-working.txt`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/H-working.txt`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/L-working.txt`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/P-working.txt`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/U-working.txt`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/async-packet.json`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/async-prose.md`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/async-source-compact/A03.md`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/lecture-rewrite-20261029/async-source-compact/A04.md`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/lecture-rewrite-20261029/async-source-compact/A05.md`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/async-source-compact/A11.md`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/lecture-rewrite-20261029/async-source-compact/A13.md`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/async-source-compact/A15.md`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/async-source-compact/A19.md`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/async-source-compact/A30.md`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/lecture-rewrite-20261029/async-source-compact/A46.md`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/async-source-compact/A51.md`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/lecture-rewrite-20261029/async-source-compact/A66.md`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/lecture-rewrite-20261029/async-source-compact/A84.md`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/lecture-rewrite-20261029/async-source-compact/T8jDwzwO9iiNF0kbFEVc1uyrnIf.md`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/lecture-rewrite-20261029/async-source-compact/ZS6rd5ytKomVEwxDVebcKGTkn6d.md`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/lecture-rewrite-20261029/audit-async-applied.json`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/audit-async.json`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/audit-home.json`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/audit-main-applied.json`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/audit-main.json`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/audit-read-async.md`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/audit-read-support.md`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/audit-root-applied.json`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/audit-root.json`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/audit-support-applied.json`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/audit-support.json`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/baseline-app.js`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/baseline-data.json`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/candidate-app.js`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/candidate-data.json`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/candidate-prose.md`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/director-prd.json`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/director-prd.md`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/director-talk.md`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/finalize-async-patch.py`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/lecture-search.json`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/lecture-rewrite-20261029/main-packet.json`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/node-asides-audit.json`|递归解码核对；仅目录/摘要元信息或同源正文，无新增事实|
|`research/lecture-rewrite-20261029/packet-M.json`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/packet-O.json`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/packet-R.json`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/read-A.json`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/read-B.json`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/read-G.json`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/read-S.json`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/read-T.json`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/rewrite-main.py`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/se-packet.json`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/source-补查-input-management.md`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/lecture-rewrite-20261029/style-contract.md`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/lecture-rewrite-20261029/support-packet.json`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/support-prose.md`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/text-M.md`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/text-O.md`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/tool-text.md`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/lecture-rewrite-20261029/write-async-patch.py`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/write-main-cross-audit.py`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/write-se.py`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/write-tools.py`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/lecture-rewrite-20261029/write-walkthroughs.py`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/memory-evolution-20261028/evolution-dt-talk.json`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/memory-evolution-20261028/evolution-dt-talk.md`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/memory-evolution-20261028/evolution-expert-knowhow.json`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/memory-evolution-20261028/evolution-expert-plan.json`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/memory-evolution-20261028/evolution-expert-plan.md`|递归解码核对；仅目录/摘要元信息或同源正文，无新增事实|
|`research/memory-evolution-20261028/evolution-filtered-reflector.json`|递归解码核对；仅目录/摘要元信息或同源正文，无新增事实|
|`research/memory-evolution-20261028/evolution-knowledge-retrieval.json`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/memory-evolution-20261028/evolution-knowledge-retrieval.md`|递归解码核对；仅目录/摘要元信息或同源正文，无新增事实|
|`research/memory-evolution-20261028/evolution-search-expert.json`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/memory-evolution-20261028/evolution-search-reflector.json`|递归解码核对；仅目录/摘要元信息或同源正文，无新增事实|
|`research/memory-evolution-20261028/evolution-search-self.json`|递归解码核对；仅目录/摘要元信息或同源正文，无新增事实|
|`research/memory-evolution-20261028/evolution-search.json`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/memory-evolution-20261028/evolution-transcript.json`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/memory-evolution-20261028/evolution-transcript.md`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/memory-evolution-20261028/initial-1.json`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/memory-evolution-20261028/initial-2.json`|递归解码核对；仅目录/摘要元信息或同源正文，无新增事实|
|`research/memory-evolution-20261028/initial-3.json`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/memory-evolution-20261028/library-baseline-pages.json`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/memory-evolution-20261028/library-read-advisor.json`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/memory-evolution-20261028/library-read-event-tech.json`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/memory-evolution-20261028/library-read-event-tech.md`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/memory-evolution-20261028/library-read-signals.json`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/memory-evolution-20261028/library-read-signals.md`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/memory-evolution-20261028/library-read-task.json`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/memory-evolution-20261028/library-search-0.json`|递归解码核对；仅目录/摘要元信息或同源正文，无新增事实|
|`research/memory-evolution-20261028/library-search-1.json`|递归解码核对；仅目录/摘要元信息或同源正文，无新增事实|
|`research/memory-evolution-20261028/library-search-2.json`|递归解码核对；仅目录/摘要元信息或同源正文，无新增事实|
|`research/memory-evolution-20261028/library-search-3.json`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/memory-evolution-20261028/library-search-focused-0.json`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/memory-evolution-20261028/library-search-focused-1.json`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/memory-evolution-20261028/library-search-focused-2.json`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/memory-evolution-20261028/library-search-inventory.json`|递归解码核对；仅目录/摘要元信息或同源正文，无新增事实|
|`research/memory-evolution-20261028/memory-clean-test.md`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/memory-evolution-20261028/memory-meeting-partial.md`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/memory-evolution-20261028/memory-search.json`|递归解码核对；仅目录/摘要元信息或同源正文，无新增事实|
|`research/memory-evolution-20261028/memory-test.json`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/v-lesson-20261105/V-lecture.md`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/v-lesson-20261105/aiva-vui-prd.json`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/v-lesson-20261105/aiva-vui-prd.md`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/v-lesson-20261105/baseline-app.js`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/v-lesson-20261105/baseline-data.json`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/v-lesson-20261105/candidate-app.js`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/v-lesson-20261105/candidate-data.json`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/v-lesson-20261105/director-prd.json`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/v-lesson-20261105/director-prd.md`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/v-lesson-20261105/director-talk.json`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/v-lesson-20261105/director-talk.md`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/v-lesson-20261105/dt-search.json`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/v-lesson-20261105/fc-search.json`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/v-lesson-20261105/h2-engineering-partial-readable.md`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/v-lesson-20261105/h2-engineering.json`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/v-lesson-20261105/h2-engineering.md`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/v-lesson-20261105/launcher-search.json`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/v-lesson-20261105/memory/director-prd.json`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/v-lesson-20261105/memory/director-prd.md`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/v-lesson-20261105/memory/event-report-compact.md`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/v-lesson-20261105/memory/event-report.json`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/v-lesson-20261105/memory/event-report.md`|递归解码核对；仅目录/摘要元信息或同源正文，无新增事实|
|`research/v-lesson-20261105/memory/search-0.json`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/v-lesson-20261105/memory/search-1.json`|递归解码核对；仅目录/摘要元信息或同源正文，无新增事实|
|`research/v-lesson-20261105/memory/search-2.json`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/v-lesson-20261105/memory/search-boundary-0.json`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/v-lesson-20261105/memory/search-boundary-1.json`|递归解码核对；仅目录/摘要元信息或同源正文，无新增事实|
|`research/v-lesson-20261105/memory/search-focus-0.json`|递归解码核对；仅目录/摘要元信息或同源正文，无新增事实|
|`research/v-lesson-20261105/memory/search-focus-2.json`|递归解码核对；仅目录/摘要元信息或同源正文，无新增事实|
|`research/v-lesson-20261105/memory/search-focus-3.json`|递归解码核对；仅目录/摘要元信息或同源正文，无新增事实|
|`research/v-lesson-20261105/memory/search-h2h-report.json`|递归解码核对；仅目录/摘要元信息或同源正文，无新增事实|
|`research/v-lesson-20261105/memory/search-memory-tech.json`|递归解码核对；仅目录/摘要元信息或同源正文，无新增事实|
|`research/v-lesson-20261105/memory/search-new-1.json`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/v-lesson-20261105/memory/search-new-2.json`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/v-lesson-20261105/memory/search-reconcile-0.json`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/v-lesson-20261105/memory/search-reconcile-1.json`|递归解码核对；仅目录/摘要元信息或同源正文，无新增事实|
|`research/v-lesson-20261105/memory/search-reconcile-2.json`|递归解码核对；仅目录/摘要元信息或同源正文，无新增事实|
|`research/v-lesson-20261105/memory/search-specific-0.json`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/v-lesson-20261105/memory/search-specific-2.json`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/v-lesson-20261105/memory/search-term-0.json`|递归解码核对；仅目录/摘要元信息或同源正文，无新增事实|
|`research/v-lesson-20261105/memory/search-term-2.json`|递归解码核对；仅目录/摘要元信息或同源正文，无新增事实|
|`research/v-lesson-20261105/model-search.json`|递归解码核对；仅目录/摘要元信息或同源正文，无新增事实|
|`research/v-lesson-20261105/models/focused-search-0.json`|递归解码核对；仅目录/摘要元信息或同源正文，无新增事实|
|`research/v-lesson-20261105/models/search-0.json`|递归解码核对；仅目录/摘要元信息或同源正文，无新增事实|
|`research/v-lesson-20261105/models/search-1.json`|递归解码核对；仅目录/摘要元信息或同源正文，无新增事实|
|`research/v-lesson-20261105/prequery-design.json`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/v-lesson-20261105/prequery-design.md`|递归解码核对；仅目录/摘要元信息或同源正文，无新增事实|
|`research/v-lesson-20261105/product-onepage.json`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/v-lesson-20261105/product-onepage.md`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/v-lesson-20261105/voice-search.json`|递归解码核对；仅目录/摘要元信息或同源正文，无新增事实|
|`research/v-lesson-20261106/content_v34_backup.py`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/v-lesson-20261106/content_v35_backup.py`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/v-lesson-20261106/notes-lectures-memory.md`|主代理已读原源，或生成稿/整合副本，未重复作事实源|
|`research/v-lesson-20261106/notes-wiki-v.md`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|
|`research/v-lesson-20261106/wiki-tree.tsv`|相关正文/截断片段已读；按上文判断同源、跨章、设计或目录|

补查结果：新增 SUP-F001 共 1 条，新增已核真实案例 0 条；本地命中文件已分型，但未为目录线索联网补取正文，不能宣称所有飞书全文已覆盖。
