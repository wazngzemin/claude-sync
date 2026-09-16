# PRD｜系统预设任务端云一体配置与执行框架

> 文档版本：V6.0｜六层框架、九类合同与交互三分支校正版  
> 文档日期：2026-09-04  
> 产品负责人：王泽民  
> 评审对象：任务中心、系统预设任务接入方、端侧 Trigger、Cloud Trigger、Advisor/Planner、DT/VQA、即时交互卡、可见即可说、赛力斯车控/状态、配置平台、测试  
> 文档目的：让所有参与方对“系统预设任务是什么、从哪里开始、数据怎样走、谁做什么、怎样才算完成”形成同一个完整概念；并在本次评审中拍板公共产品语义、认领技术专项。
>
> 配套可点击总图：[系统预设任务完整框架架构图-v02.html](./系统预设任务完整框架架构图-v02.html)  
> 说明：总图用于快速讲解和点击查看模块七问；本 PRD 是需求、规则、异常和验收的主事实源。

---

## 文档使用说明

### 证据标记

- **【资料已确认】**：已在会议逐字稿或飞书原始 PRD 中找到明确依据；但“有设计”仍不等于“本项目已经接通”。
- **【目标产品要求】**：为了形成完整、可验收且安全的业务闭环，本 PRD 要求必须具备的行为。
- **【产品建议】**：建议本期采用的方案，尚需评审拍板。
- **【待确认】**：当前资料没有唯一答案，不能当成已经实现；会上必须确认 Owner 和后续产物。
- **【资料冲突】**：不同时间、不同文档口径不一致，必须以专项结论收口。

### 版本变更

| 版本 | 本次变化 | 是否覆盖旧结论 |
|---|---|---|
| V5.0 | 形成公共框架、天气与充电逐跳案例、四任务矩阵 | 保留为历史评审稿 |
| V6.0 | 对齐可点击架构图 v02：五层改为六层；任务发布拆成展示元数据与运行定义；公共合同补成九类；补齐 InteractionMode 三分支、ExecutionProof、卡片三类回调和正确 RunEvent 顺序 | 只校正和补全，不把 TBD 写成已实现 |

### 本文中的对象和字段

本文使用的 PresetTaskDefinition、TaskInstanceState、RunEvent、InteractionRequest 等名称，以及所有伪 JSON 字段，均是**产品语义示例，不是正式 IDL、接口名、Topic、Signal ID 或错误码**。研发可以调整名称和物理模块，但不能丢掉对应业务语义。

### 缩写先翻成人话

| 缩写/术语 | 人话 | 本文中怎么用 |
|---|---|---|
| HMI | 车机给用户看的页面 | 任务中心属于 HMI；它展示和承接操作，不是真状态源 |
| VUI | 语音与车机交互界面体系 | 即时交互卡在车机 VUI 展示 |
| VAS / 可见即可说 | 用语音操作当前可见页面元素 | 端侧天气卡把“好的”映射成当前确认按钮的模拟点击 |
| ASR | 把用户语音转成文字 | 可见即可说和 Planner 的语音入口之一；ASR 成功不等于用户授权有效 |
| ACK | “我收到/接收了请求”的回包 | 卡片 ACK、车控 ACK 都不是业务最终成功 |
| RPC / IDL / Topic | 研发实现接口、字段和消息通道的方式 | 本 PRD 只规定产品语义，不替研发确定正式命名 |
| Trigger | 条件触发器 | 读取状态和信号，判断本轮是否应产生 RunEvent |
| RunEvent | 一次条件命中的“业务流水号” | 模型、卡片、授权、执行、回读都必须挂在同一个事件上 |
| Planner / Director | 云端决策职能的业务名/内部名 | 本文视为同一决策职能，不画成两个串行模块 |
| Advisor | 主动推荐准入/策略模块 | 决定候选是否进入后续云端编排，不代替端侧安全复核 |
| DT / VQA | 云端工具/视觉问答能力 | 充电例子里判断是否识别到充电设备 |
| SLS | 赛力斯侧主动服务相关开关/能力口径，正式定义待专项确认 | 不能在资料不足时默认它等于某条任务有效开关 |
| SOC | 动力电池剩余电量百分比 | 充电例子里的硬条件之一 |

### 建议阅读顺序

如果评审时间有限，按下面顺序讲：

1. 先讲第 0 章：一句话与五个不混淆；
2. 再讲第 2.1 节：你负责什么、不负责什么；
3. 再讲第 7.2.1 节：六层完整系统框架；
4. 再讲第 7.5 节：任务中心怎样把真实状态交给 Runtime；
5. 再讲第 7.6.2 与 7.7.4 节的两条总流程；逐步 JSON 只在被追问时展开；
6. 再讲第 7.8.7 节：四任务结论；
7. 最后讲第 8.5 节：今天拍板什么、哪些只认领专项。

### 你本次只需要交四类产品产物

1. **任务定义表**：场景、输入、规则、交互、动作、成功和异常；
2. **端云与责任表**：处理拓扑、唯一 RunEvent 产生方、谁问用户、谁最终执行；
3. **业务合同与专项清单**：明确每一跳需要的产品语义，组织研发给出正式时序/接口；
4. **验收与决策记录**：把拍板结论写回四任务表，并转成测试用例。

你不负责在后台实际导入配置，不负责写正式 IDL，不负责实现卡片/车控，也不能替研发声明某接口已经存在。

---

# 0. 先把最容易混淆的事情说清楚

## 0.1 一句话定义

**系统预设任务，是产品提前定义好、用户在任务中心管理、运行侧长期等待条件、每次命中后按端侧或云端链路完成判断，并最终由端侧安全执行和读取真实车辆结果的一类长期自动化能力。**

它不是一个按钮，也不是一条 Trigger 规则，更不是一张卡片。一个可交付的系统预设任务至少包含：

~~~text
任务定义
+ 某辆车/账号下任务是否真实有效
+ 唯一运行位置
+ 数据来源和数据时效
+ 触发规则与时序治理
+ 单次运行事件
+ 交互策略
+ 执行前复核
+ 车控
+ 真实状态回读
+ 日志、冷却、恢复和退出
~~~

只有“条件 + 动作”，还不能称为完整任务。

## 0.2 五个概念不能再混

| 概念 | 人话 | 它负责什么 | 它不负责什么 |
|---|---|---|---|
| 系统预设任务 | 系统出厂就准备好的长期自动化能力 | 定义完整业务闭环和生命周期 | 不是某一次卡片，也不是单次车控 |
| 任务中心 | 用户管理和回看任务的 HMI 入口 | 展示、承接操作意图、显示业务回传结果 | 不判断天气、不执行规则、不直接车控 |
| Trigger | 等待条件并判断“这一次是否应发起业务” | 订阅状态、计算规则、防抖去重、创建一次运行事件 | 不负责把 UI 画出来，也不能把用户确认当车辆成功 |
| 即时交互卡 | Trigger/云端业务与用户之间的交互窗口 | 展示、TTS、承接手点，并接收可见即可说或 Planner 形成的标准选择；管理卡片生命周期 | 不做 ASR/语义理解，不判断天气/SOC/P 挡，不自行决定车控 |
| 端侧执行 | 最终安全门和真实动作层 | 重新读取最新状态、调用赛力斯车控、读取真实结果 | 不直接信任旧卡片、旧授权或旧云端结果 |

另外还有三个相近名词：

| 名词 | 人话 | 与本需求的关系 |
|---|---|---|
| 即时任务 | 用户现在发起、无需长期等待观察、可立即进入执行/反馈的任务 | 不是天气这类长期预设任务；长期任务每次命中只会产生一次即时交互 |
| 即时任务卡 | 面向即时任务的一类瞬时反馈卡口径，资料命名仍需统一 | 不要自动等同于所有即时交互卡 |
| AI Bar 任务岛 | 长时/长程任务的持续入口 | 不是任务中心，也不是本次端侧天气确认卡 |

## 0.3 截图里的“十分钟后关座椅加热”与本需求不是同一类任务

用户提供的截图是一个**用户临时创建的动态条件任务**：

~~~text
用户 Query
→ Planner 解析“十分钟后”
→ 调用条件任务注册能力
→ 新建一条任务
→ 时间到了再通知 Planner
→ Planner 再决定动作
~~~

本 PRD 的系统预设任务是：

~~~text
产品提前定义“天气/路况保护”
→ 随产品/车型版本发布
→ 用户只管理这项已有能力是否有效
→ Trigger 长期等待天气和车辆条件
→ 每次条件命中创建一次 RunEvent
→ 按预设策略交互和执行
~~~

两者可以借用“Task / Run / Event / View”的产品对象思想，但当前 Task Service 技术资料明确把静态/预设 Advisor 排除在其当前建设范围之外。因此，**不能因为动态任务有 Task Service 注册工具，就推断四条系统预设任务已经走同一个 Task Service 链路。**

## 0.4 一条任务必须守住的五个“一”

1. **一个任务定义**：同一车型版本只认一份生效规则。
2. **一个真实任务状态**：页面开关不是状态真源，必须由接入业务/状态承载方确认。
3. **一个 RunEvent 产生方**：处理拓扑可以跨端云，但同一车辆、同一任务、同一时刻只能有一侧创建本次运行事件并拥有主动动作发起权。
4. **一个运行事件**：一次天气命中、一次充电识别都要有独立关联，卡片、授权、执行和回读不能串单。
5. **一个成功真相**：车控 ACK 不是成功，车辆真实状态达到目标才是成功。

## 0.5 评审开场可直接照读

> “今天我们不是只评 Trigger，也不是只评一张卡。我想先把系统预设任务的公共框架定下来：后台怎样定义任务，任务中心怎样让用户管理，谁维护真实任务状态，整条链经过端侧还是云端，以及哪一侧唯一创建本次 RunEvent，交互卡怎样把用户选择还回来，最后端侧怎样复核、车控并读取真实状态。框架定完后，再用天气和充电两条链逐步核对每一次数据传递。没有资料证据的接口我都会标待确认，请对应 Owner 输出技术时序，避免产品在现场替研发杜撰实现。”

---

# 1. Summary｜需求摘要

## 1.1 当前问题

当前资料分别描述了任务中心、端侧 Trigger、云端 Advisor/Planner、即时交互卡、可见即可说、车控与四条任务，但缺少一张所有团队共同认可的完整图，导致以下断层：

- 任务中心能展示任务，不代表 Trigger 已拿到“任务有效状态”；
- 配置平台能配置部分条件，不代表端侧任务可动态下发；
- Trigger 条件命中，不代表用户已经授权；
- 即时交互卡展示成功，不代表车辆执行成功；
- 云端识别到场景，不代表结果仍然新鲜且端侧现在允许执行；
- 端侧和云端都有逻辑时，如果没有唯一 RunEvent 产生权，会产生重复出卡或重复车控；
- 动态 Task Service 的链路容易被误套到系统预设任务。

## 1.2 本需求要解决什么

本 PRD 统一定义：

1. 系统预设任务的公共对象和生命周期；
2. 从配置/发布、任务中心、状态真源到端云运行时的主链；
3. 端侧任务与云端/端云混合任务的分工标准；
4. Trigger 与即时交互卡的数据合同；
5. 端侧本地可见即可说与云端 Planner 语音的区别；
6. 用户确认后到车控、真实状态回读的安全闭环；
7. 四条系统预设任务分别放在哪里、按什么条件触发、还缺什么；
8. 研发专项、测试验收和发布门槛。

## 1.3 最终业务结果

研发完成后，应能从日志和实车上完整回答：

~~~text
这是什么任务？
这辆车是否真的开启？
为什么此时由端侧或云端运行？
这一次由哪些输入触发？
用户看到/听到了什么？
用户做了什么选择？
执行前为什么仍允许做？
车控请求发生了什么？
车辆最终真实状态是什么？
失败停在哪一跳、谁负责？
~~~

---

# 2. Contacts｜角色与决策职责

> 姓名来自现有会议对齐关系，只作为建议对齐人，不自动等于最终研发 DRI。评审后需将“候选”替换为正式 Owner。

| 领域 | 建议对齐人/团队 | 本次必须给出的结论 |
|---|---|---|
| 系统预设任务产品框架 | 王泽民 | 公共对象、端云分类、四任务规则、交互与验收 |
| 任务中心/任务系统 | 郝晓伟及任务中心团队 | 系统预设任务单元、启停/删除语义、真实状态 Owner、操作回调 |
| Trigger/配置平台 | Trigger 产品与端侧研发；平台 Owner 待确认 | 端侧订阅、规则、状态恢复、防抖去重、配置发布能力 |
| 即时交互卡/VUI | 徐洋及 VUI 团队；正式 DRI 待确认 | 卡型、拉卡 ACK、点击/语音/关闭/超时、更新合同 |
| 可见即可说 | 页面注册方、字节语音、UI 执行方；候选联系人需确认 | 页面元素注册、ASR/匹配、消歧、模拟点击、失效 |
| Cloud Trigger/Advisor/Planner | 云端业务与 Planner 团队 | 硬条件、推荐 Query、模型/工具编排、云端卡路由 |
| DT/VQA | 视觉/工具能力团队 | 输入、输出枚举、置信度/质量、时间戳、有效期、异常 |
| 赛力斯车控/端状态 | 赛力斯车控、状态域与安全团队 | 动作准入、真实信号、幂等、状态回读、超时 |
| 测试 | 端云联调、台架、实车测试 | 正反例、弱网、过期、重复、关闭、假成功用例 |

## 2.1 产品与研发边界

王泽民需要交付的是：

- 定义每条任务何时开始判断；
- 定义需要哪些数据、三值规则、时效和异常；
- 定义是否出卡、问什么、用户可选什么；
- 定义确认后复核什么、目标动作与成功状态；
- 组织跨团队拍板，形成验收标准。

王泽民不需要替研发完成：

- 设计正式 RPC/IDL、Topic、数据库和错误码；
- 在后台实际导入配置；
- 实现车控或页面元素解析；
- 在没有证据时指定某服务已经存在。

---

# 3. Background｜为什么现在必须评公共框架

## 3.1 当前已核验的关键事实

1. **【资料已确认｜早期边界】**早期任务中心材料把它定义为异步任务统一展示、管理和回看入口；接入业务维护真实执行状态，任务中心被动接收结果并转发用户操作。
2. **【资料已确认｜9 月 1 日最新范围】**最新版任务中心材料进一步把主动服务子目标和系统预设任务列入目标展示范围，但系统预设任务单元仍待补充，一期明确操作与早期“启停开关”口径存在差异。
3. **【资料已确认】**任务中心资料中的列表推送、上电/登录拉取，只能证明 HMI 列表如何刷新，不能证明相同状态已经进入端侧 Trigger。
4. **【资料已确认】**天气/路况保护当前按端侧自闭环方向推进；充电设备识别需要主动推荐/Static Advisor 与 DT/VQA 等云端协作，最终动作仍回端侧。充电硬 Trigger、唯一 RunEvent producer 和 Planner 在最终卡型中的职责仍待专项确认。
5. **【资料已确认 + 待专项落位】**端侧天气自闭环卡的语音方向是本地可见即可说；云端开放语音可由 Planner 结合当前卡片上下文理解，但充电最终卡型、语音路由和点击回流尚未拍板。
6. **【资料已确认】**可见即可说操作的是当前最上层可见页面：页面方提供可交互元素，语音侧 ASR/匹配，页面方消歧，UI 模拟点击，最后仍走原按钮回调。
7. **【资料已确认】**当前配置平台只能覆盖部分云端条件/频控能力；端侧任务仍可能需要端侧研发并随整车版本发布。

## 3.2 当前不能证明的事情

- 不能证明存在正式的“任务中心 → taskId/enabled → Trigger”直连协议；
- 不能证明四条任务共享一个现成的真实任务状态服务；
- 不能证明端云运行权、灰度切换和旧事件失效已有统一实现；
- 不能证明端侧即时交互卡在无网场景已经完成本项目接入；
- 不能证明选择卡片模板和 TTS 后平台能自动生成完整闭环；
- 不能证明车控 ACK 已经自动触发真实状态回读与卡片更新；
- 不能证明儿童锁和后视镜的最终规则、安全门槛与双方边界已经定稿。

## 3.3 为什么要区分端侧与云端

这不是把同一套功能随便拆成两份，而是两类问题本质不同：

| 判断维度 | 更适合端侧 | 更适合云端 |
|---|---|---|
| 场景窗口 | 几百毫秒到数秒，错过就失去意义 | 可以容忍上行、排队和推理 |
| 网络 | 弱网/无网仍必须工作 | 明确依赖在线能力 |
| 输入 | 本地车身状态、本地 VLM、明确枚举 | 多源上下文、历史、DT/VQA、开放语义 |
| 规则 | AND/OR、阈值、变化沿、状态机 | 复杂语义、模型判断、工具编排 |
| 迭代 | 随车版本，慢但稳定 | 策略/模型可快迭代 |
| 安全 | 最接近真实车辆，必须承担最终复核 | 只能给判断/建议，不能绕过端侧安全门 |

一句话：

> **端侧负责“现在还能不能做”和“车是否真的完成”；云端负责“复杂场景是什么意思、是否值得建议、需要调用什么能力”。**

## 3.4 为什么不能全部放端侧，也不能全部放云端

- 全部放端侧：DT/VQA、多源上下文、开放语义和快速策略迭代成本高，能力受端侧资源和发版周期限制。
- 全部放云端：断网会漏触发，上下行与推理会延迟，旧结果可能与当前车况不一致，云端不能成为真实车控的最后安全门。
- 端云协作：将实时、离线、最新状态和安全留在端侧，将模型、工具和快速迭代放云端，并用运行事件、有效期、执行前复核和真实回读把两侧连成一条可控链路。

---

# 4. Objective｜目标、非目标与成功标准

## 4.1 目标

- 所有模块对系统预设任务使用同一套对象和状态语言；
- 每条链路每一跳都有责任方、位置、输入、判断、输出、失败处理；
- 同一车辆同一任务不存在端云重复触发；
- 所有需要用户确认的任务，卡片失败时不会静默车控；
- 所有执行都在端侧重新复核，所有成功都用真实车辆状态确认；
- 四条任务都能映射到公共框架，并明确已有能力与缺口。

## 4.2 非目标

- 本次不承诺四条任务均已开发或已排期；
- 本次不在产品 PRD 内拍脑袋确定正式技术字段；
- 本次不把 Task Center、Task Service、Trigger 和即时交互卡合并为一个模块；
- 本次不把“无卡无 TTS”自动视为允许静默车控；
- 本次不把会议中的建议或旧稿写成已上线事实。

## 4.3 成功标准

评审结束后，各团队能回答：

1. 谁维护任务是否真实有效；
2. 端侧/云端怎样获得处理拓扑，并确定唯一 RunEvent 产生方；
3. 一次条件命中怎样创建并贯穿同一个 RunEvent；
4. Trigger/云端业务给卡片什么，卡片返回什么；
5. 本地可见即可说与云端 Planner 语音为什么不同；
6. 用户确认后为什么还要重新复核；
7. 为什么 RPC ACK 不能作为最终成功；
8. 四条任务各自端云归属、规则、交互、安全与缺口；
9. 每个待确认项由谁、在何时、用什么产物关闭。

---

# 5. Market Segments｜任务运行类型

| 类型 | 判断位置 | 是否需要模型/工具 | 交互 | 典型任务 |
|---|---|---|---|---|
| 端侧确定性 + 需确认 | 端侧 Trigger | 否，或只用端侧结构化结果 | 即时卡 + 本地可见即可说 | 天气/路况保护 |
| 端侧确定性 + 静默候选 | 端侧 Trigger（归属未拍板） | 否 | 无卡/无 TTS，但需安全/规则会签 | 儿童锁、后视镜仅为候选分类，不能视为已定 |
| 云端协作判断 + 端侧执行 + 需确认 | 唯一硬 Trigger/RunEvent producer 待定；已确认链路包含主动推荐/Static Advisor + DT/VQA | 是 | 即时卡；Planner 语音上下文及点击回流按卡型专项拍板 | 识别充电设备后开盖 |
| 仅告知 | 端侧或云端 | 按场景 | 卡片/TTS，不产生车控授权 | 当前四任务暂无最终定稿示例 |

---

# 6. Value Propositions｜价值点

## 6.1 对用户

- 任务开关和实际运行一致，不出现“看起来开启、实际上没工作”；
- 弱网安全场景仍能及时响应；
- 复杂场景可用云端能力获得更准判断；
- 用户确认不会误作用到旧卡片或另一辆车；
- 最终提示以真实车辆状态为准，避免“说成功但车没动”。

## 6.2 对产品和研发

- 新增任务不再临时拼模块，而是按同一框架逐项接入；
- Trigger、卡片、Planner、车控边界清楚，减少互相甩锅；
- 端云归属有统一决策标准，避免双触发和重复建设；
- 每个运行事件可追踪，badcase 能定位到规则、端侧资源、模型波动或软硬件时序；
- 公共能力可逐步沉淀到配置平台，而不是一次性造万能平台。

---

# 7. Solution｜完整产品方案

## 7.1 九类公共合同对象：先用对象把链路串起来

### 7.1.1 RuntimeDefinition｜运行定义（并与 DisplayMetadata 分开）

产品先定义完整的 `PresetTaskDefinition`，发布门禁通过后必须拆成两个不同发布物：

- **DisplayMetadata**：只给任务中心展示，回答“用户看到什么”；包含名称、说明、图标、适用范围、可操作项等，不承载 Trigger 规则；
- **RuntimeDefinition**：给端侧或云端 Runtime，回答“运行侧怎样判断和闭环”；包含适用范围、规则引用、交互模式、动作能力、成功真相、版本和 Owner。

两者必须来自同一已会签任务定义版本，但不能互相替代。任务中心拿到展示信息，不代表 Runtime 已拿到规则；Runtime 拿到规则，也不代表用户已开启任务。

### 7.1.2 TaskInstanceState｜任务实例真实状态

回答“这辆车/这个账号当前是否允许任务运行”。必须持久化、可恢复、有顺序，不能由页面动画替代。

### 7.1.3 RuntimeAssignment｜处理拓扑与 RunEvent 产生权

这里必须拆成两个语义，不能把 HYBRID 和“唯一 RunEvent 产生方”混在一起：

- **processing_topology（处理拓扑）**：EDGE、CLOUD 或 HYBRID，回答整条任务会经过哪些位置；
- **run_event_producer / emit_authority（唯一事件产生权）**：EDGE、CLOUD 或 NONE，回答哪一侧有权创建本次 RunEvent 和发起主动动作。

充电可以是 HYBRID 拓扑，但仍只能有一个 RunEvent 产生方；另一侧只是本次事件的协作处理节点。切换产生方时，旧资格、旧 RunEvent、旧卡片和旧授权需要失效。

### 7.1.4 SignalSnapshot｜条件快照

回答“本次判断看的是哪一组数据”。包含来源、值、采集时间、接收时间、质量和是否新鲜；不能把不同时刻的值随意拼成同一场景。

### 7.1.5 RunEvent｜单次运行事件

回答“这是哪一次触发”。一次天气、一轮充电识别各自独立；贯穿候选、卡片、用户选择、复核、车控和结果。

### 7.1.6 InteractionRequest / Events｜交互请求与三类回调

回答“原业务怎样请卡片问用户，以及卡片怎样把事实还回来”。请求必须带任务定义、任务实例、本次 RunEvent、文案、按钮语义、TTS、语音/点击路由、有效期和优先级。返回必须拆成：

1. `DisplayAck`：排队、真正可见或展示失败；
2. `InteractionEvent`：确认、拒绝、关闭、超时、打断及输入来源；
3. `LifecycleEvent`：隐藏、过期、被替换或恢复。

### 7.1.7 ExecutionProof｜本次为什么允许进入端侧复核

回答“本次动作的执行依据是什么”。它不是车控请求，而是原业务按 `InteractionMode` 形成的一次性凭证：

- `SILENT`：必须有已会签的 `silent_policy_decision_ref`；
- `NOTIFY_ONLY`：不产生凭证，告知后以 `NoAction` 结束；
- `REQUIRE_CONFIRMATION`：只有同一 RunEvent 下未过期、未消费的明确确认，才能产生 `authorization_ref`。

### 7.1.8 ExecutionRequest｜端侧一次性执行请求

回答“这一次要端侧做什么”。必须带任务/实例/RunEvent、动作、执行凭证、车辆范围、定义与产生权代次、有效期、防串代信息和幂等键。云端只能下发请求，不能越过端侧安全复核直接把模型结果当车控命令。

### 7.1.9 Result｜分层结果与最终成功真相

回答“用户怎么选、复核是否通过、车控是否接收、车辆是否真的达到目标”。最终结果必须分层记录，只有真实车辆状态达到目标才是 `SUCCESS`；明确未达是 `FAILED`；无法判断是 `UNKNOWN`。

### 7.1.10 对象关系图

~~~mermaid
erDiagram
    PRESET_TASK_DEFINITION ||--|| DISPLAY_METADATA : "发布展示信息"
    PRESET_TASK_DEFINITION ||--|| RUNTIME_DEFINITION : "发布运行规则"
    RUNTIME_DEFINITION ||--o{ TASK_INSTANCE_STATE : "一类任务对应多车辆/账号实例"
    TASK_INSTANCE_STATE ||--|| RUNTIME_ASSIGNMENT : "处理拓扑 + 唯一事件产生权"
    TASK_INSTANCE_STATE ||--o{ RUN_EVENT : "长期任务产生多次运行"
    RUN_EVENT ||--|{ SIGNAL_SNAPSHOT : "关联触发快照与执行前复核快照"
    RUN_EVENT ||--o| INTERACTION_REQUEST : "按策略可创建交互"
    INTERACTION_REQUEST ||--o{ DISPLAY_ACK : "展示事实"
    INTERACTION_REQUEST ||--o{ INTERACTION_EVENT : "用户选择"
    INTERACTION_REQUEST ||--o{ LIFECYCLE_EVENT : "卡片生命周期"
    RUN_EVENT ||--o| EXECUTION_PROOF : "按交互模式形成；仅告知除外"
    EXECUTION_PROOF ||--o| EXECUTION_REQUEST : "一次性执行依据"
    EXECUTION_REQUEST ||--|| RESULT : "复核、车控与真实状态"
~~~

同一 RunEvent 至少要能区分 `TRIGGER_SNAPSHOT`（决定是否发起本轮）与 `PRECHECK_SNAPSHOT`（用户确认或静默准入后、真正执行前重新读取）。两者都挂在同一事件上，但后者必须来自执行前最新状态，不能把触发时旧快照原样复用。

## 7.2 系统预设任务完整框架图

### 7.2.1 六层业务架构

> 读图方法：从上往下看一次任务怎样流动；横向看每层模块边界。橙色/TBD 内容不是现网事实，而是本次需要认领 Owner 和技术产物的目标产品合同。交互式版本见文首 v02 HTML。

~~~mermaid
flowchart TB
    subgraph L1["① 控制面｜产品定义、完整性校验与双发布物"]
        P[产品定义完整任务<br/>场景、规则、交互、动作、验收]
        CFG[配置平台 / 端侧发版流程<br/>能力引用、车型、版本、灰度、回滚]
        VALID{完整性门禁<br/>信号/模型/卡/动作/回读/Owner是否齐全}
        SPLIT[同一已会签版本拆成双发布物]
        DM[DisplayMetadata<br/>只给任务中心展示]
        RD[RuntimeDefinition<br/>只给端/云 Runtime 运行]
        P --> CFG --> VALID
        VALID -->|通过| SPLIT
        VALID -->|不通过| STOP1[阻止发布并返回缺口]
        SPLIT --> DM
        SPLIT --> RD
    end

    subgraph L2["② 管理与状态面｜用户操作、真实任务状态、同步恢复与唯一产生权"]
        TC[任务中心 / HMI<br/>展示、操作、等待真实结果]
        STATE[接入业务 / 真实状态承载方<br/>鉴权、幂等、持久化；Owner TBD]
        SYNC[状态同步与恢复<br/>启动快照 + 增量变化 + 异常重同步]
        ASSIGN_OWNER[Assignment 承载方 / 灰度路由<br/>依据实例、定义版本、车型/灰度和部署资格；Owner TBD]
        ASSIGN[RuntimeAssignment<br/>topology + producer + assignment_version + fencing]
        TC -->|OperationRequest：用户意图| STATE
        STATE -->|OperationResult：成功/失败与真实状态| TC
        STATE -->|TaskInstanceState| SYNC
        STATE -->|任务实例与适用范围| ASSIGN_OWNER
        ASSIGN_OWNER --> ASSIGN
        DM --> TC
    end

    subgraph L3["③ 运行与判断面｜唯一 producer 创建一次 RunEvent"]
        ER[端侧 Runtime<br/>RuntimeDefinition + State + Assignment]
        CR[云端 Runtime<br/>RuntimeDefinition + State + Assignment]
        EDGE[端侧 Trigger<br/>本地端状态/VLM、三值规则、时效、防抖、去重]
        CLOUD[Cloud Trigger<br/>合规上行硬条件、时效、防抖、去重、频控]
        EC[端侧稳定候选]
        CC[云端稳定候选]
        RUN[创建唯一 RunEvent<br/>先于 Query、模型和卡片]
        AI[按需 Query → Advisor / Planner / DT / VQA<br/>结果必须回写同一 RunEvent]
        ER -->|producer=EDGE| EDGE --> EC --> RUN
        CR -->|producer=CLOUD| CLOUD --> CC --> RUN
        RUN -->|需要模型/工具| AI
    end

    subgraph L4["④ 交互面｜InteractionMode 分流，卡片只提供交互事实"]
        MODE{InteractionMode}
        SILENT[SILENT<br/>不出卡；校验已会签静默策略]
        NOTIFY[NOTIFY_ONLY<br/>卡片/TTS 仅告知]
        CONFIRM[REQUIRE_CONFIRMATION<br/>卡片真正可见后等待用户选择]
        NCARD[仅告知卡 / VUI<br/>准入、排队、展示、TTS、生命周期]
        CCARD[确认卡 / VUI<br/>准入、排队、真正展示、TTS、生命周期]
        VAS[端侧：可见即可说<br/>模拟点击当前原按钮]
        PLAN[云端：Planner + 当前卡片上下文]
        BIZ[原业务校验<br/>同 RunEvent、未过期、未消费、明确结果]
        NOACTION[NoAction<br/>告知后结束，不产生执行凭证]
        MODE --> SILENT
        MODE --> NOTIFY --> NCARD --> NOACTION
        MODE --> CONFIRM --> CCARD
        CCARD -->|端侧语音| VAS --> BIZ
        CCARD -->|云端语音| PLAN --> BIZ
        CCARD -->|按钮/三类回调| BIZ
    end

    subgraph L5["⑤ 执行与结果面｜形成执行凭证，端侧复核、车控与真实回读"]
        PROOF[ExecutionProof<br/>silent_policy_decision_ref 或 authorization_ref]
        REQ[ExecutionRequest<br/>scope、有效期、代次、防串代、幂等]
        PRE[端侧执行前复核<br/>最新任务/版本/producer/凭证/推理/车况]
        CTRL[赛力斯车控<br/>RPC ACK 只表示请求结果]
        READ[真实状态回读<br/>达到目标才 SUCCESS]
        RESULT[Result<br/>SUCCESS / FAILED / UNKNOWN]
        PROOF --> REQ --> PRE --> CTRL --> READ --> RESULT
    end

    subgraph L6["⑥ 观测与治理总线｜每一跳都可关联、解释、回放和退出"]
        OBS[任务定义 / 任务实例 / 状态版本 / 产生权代次 / RunEvent / 卡片 / 推理 / 授权 / 动作 / 真实回读]
        GOV[版本、灰度、TTL、防抖、去重、频控、幂等、冷却、日志、指标、告警、回放]
        OBS --> GOV
    end

    RD --> ER
    RD --> CR
    RD -->|definition_version 与运行要求| ASSIGN_OWNER
    CFG -.车型、灰度、部署资格.-> ASSIGN_OWNER
    SYNC --> ER
    SYNC --> CR
    ASSIGN --> ER
    ASSIGN --> CR
    RUN -->|无需模型| MODE
    AI -->|明确且有效的业务结果| MODE
    SILENT -->|silent_policy_decision_ref| PROOF
    BIZ -->|有效 CONFIRM 生成 authorization_ref| PROOF
    RESULT -->|仅存在有效 card_ref 时更新| CCARD
    RESULT -.单次结果/历史回显范围 TBD.-> TC
    RESULT --> OBS
    RUN --> OBS
    CFG -.版本/发布.-> OBS
    STATE -.操作与状态.-> OBS
    SYNC -.同步与恢复.-> OBS
    ASSIGN -.运行代次.-> OBS
    AI -.推理与工具.-> OBS
    NCARD -.展示与生命周期.-> OBS
    CCARD -.展示/选择/生命周期.-> OBS
    PROOF -.凭证生成与消费.-> OBS
    PRE -.复核结果.-> OBS
    CTRL -.车控请求与 ACK.-> OBS
    READ -.真实回读.-> OBS
~~~

六层不能互相越权：

1. 任务中心只拿 `DisplayMetadata`，不向 Trigger 下发运行规则；
2. 用户点击只是 `OperationRequest`，只有状态承载方持久化成功后的 `TaskInstanceState` 才是运行门禁；
3. `processing_topology=HYBRID` 也不允许端云各建一个事件，`run_event_producer` 仍只能有一个；
4. 即时交互卡不判断天气、SOC、P 挡，也不直接车控；
5. `NOTIFY_ONLY` 告知后结束，绝不能从卡片链偷跑进执行；
6. 云端推理和用户确认都不能替代端侧最新状态复核；
7. 最终成功只认车辆真实状态，RPC ACK、卡片点击和 Planner 理解都不是成功真相。

### 7.2.2 从后台到车辆真实完成的逐跳主链

~~~mermaid
flowchart TD
    A["1 产品定义任务<br/>规则、端云、交互、动作、验收"] --> B["2 配置平台或端侧发布流程<br/>引用真实存在的能力"]
    B --> C{"3 发布前校验是否完整"}
    C -- 否 --> X1["阻止发布<br/>返回缺口和 Owner"]
    C -- 是 --> PUB["4 生成同版本的双发布物"]
    PUB -->|A1 DisplayMetadata| E["5A 任务中心获得展示元数据<br/>只用于名称、说明、控件和适用范围"]
    PUB -->|A2 RuntimeDefinition| D{"5B 运行定义交付位置"}
    D -- 端侧当前路径 --> D1["端侧研发实现并随整车版本交付"]
    D -- 云端 --> D2["发布云端规则/策略"]
    D -- 端侧长期平台化 --> D3["生成端侧可消费签名配置<br/>目标能力，非现状"]
    E --> F["6 OperationRequest<br/>用户开启/关闭/删除意图；一期范围 TBD"]
    F --> G["7 接入业务/状态承载方<br/>鉴权、幂等、适用范围、持久化"]
    G --> H{"8 保存真实状态是否成功"}
    H -- 否 --> X2["UI 回滚/提示失败<br/>运行侧不得按开启工作"]
    H -- 是 --> I["9A OperationResult 回任务中心<br/>9B 产生 TaskInstanceState"]
    I --> SYNC["10 启动快照 + 增量变化 + 异常重同步<br/>版本倒退/跳跃时 Runtime=BLOCKED"]
    I --> ASG0["Assignment 承载方 / 灰度路由<br/>Owner TBD；结合实例、定义版本、车型/灰度和部署资格"]
    PUB -->|definition_version 与适用范围| ASG0
    ASG0 --> ASG["RuntimeAssignment<br/>topology + producer + assignment_version + fencing"]
    D1 --> RT["RuntimeDefinition 进入端侧 Runtime"]
    D2 --> RT2["RuntimeDefinition 进入云端 Runtime"]
    D3 --> RT
    SYNC --> J{"11 状态、定义版本和 RuntimeAssignment<br/>是否明确且 producer 唯一"}
    ASG --> J
    J -- DISABLED/UNKNOWN --> X3["不创建新 RunEvent<br/>取消可取消的在途事件"]
    J -- producer冲突/NONE --> X4["端云双方停止<br/>告警并重同步/恢复"]
    J -- ENABLED且producer=EDGE --> L1["12A 端侧 Trigger 消费本地数据"]
    J -- ENABLED且producer=CLOUD --> L2["12B Cloud Trigger 消费合规上行数据"]
    RT --> L1
    RT2 --> L2
    L1 --> M1{"13A 三值规则、时效、防抖、去重、频控"}
    L2 --> M2{"13B 硬条件、时效、防抖、去重、频控"}
    M1 -- 通过 --> N["14 唯一 producer 创建 RunEvent<br/>此时还没有 Query、模型、卡片或授权"]
    M2 -- 通过 --> N
    M1 -- 否/UNKNOWN --> X5["继续等待或本轮结束"]
    M2 -- 否/UNKNOWN --> X5
    N --> M0{"15 是否需要模型/工具"}
    M0 -- 否 --> O{"16 InteractionMode"}
    M0 -- 是 --> MQ["15A RunEvent 创建成功后<br/>原业务才生成 Query"]
    MQ --> M3["15B Advisor/Planner/DT/VQA"]
    M3 --> M4{"结果满足正向业务门槛、<br/>关联同一事件且未过期?"}
    M4 -- 是 --> O
    M4 -- NOT_FOUND/有效业务负结果 --> X10A["NoAction 正常结束<br/>写回同一 RunEvent"]
    M4 -- UNKNOWN/ERROR --> R0{"同一 RunEvent 未过期、<br/>重试预算与场景仍允许?"}
    R0 -- 是 --> M3
    R0 -- 否 --> X10B["失败结束<br/>写回同一 RunEvent"]
    M4 -- 过期/错车/错事件 --> X10C["丢弃结果并取消本轮"]
    O -- SILENT --> SP["17A 原业务校验已会签静默策略<br/>不出卡、不播 TTS"]
    SP -->|策略有效| PF1["ExecutionProof<br/>silent_policy_decision_ref"]
    SP -->|缺会签/过期| X11["Cancelled/Blocked<br/>不得静默执行"]
    O -- NOTIFY_ONLY --> C1["17B 展示卡片和/或 TTS<br/>只告知，不产生执行凭证"]
    C1 --> NA["NoAction 结束<br/>不得进入 ExecutionRequest"]
    O -- REQUIRE_CONFIRMATION --> C2["17C 原业务请求即时交互卡<br/>带任务、实例、RunEvent和有效期"]
    C2 --> C3{"18 DisplayAck 是否为 VISIBLE<br/>且卡片仍有效"}
    C3 -- 否 --> X6["结束/冷却<br/>不得静默车控"]
    C3 -- 是 --> C4{"19 用户输入或生命周期变化"}
    C4 -- 手点 --> C5["原按钮事件"]
    C4 -- 端侧语音 --> C6["可见即可说模拟点击"]
    C4 -- 云端语音 --> C7["Planner 结合卡片上下文理解"]
    C4 -- 关闭/超时/替换/打断 --> X7
    C6 --> C5
    C5 --> C8{"原业务校验三类回调：同一 RunEvent、<br/>未过期、未消费且结果=CONFIRM?"}
    C7 --> C8
    C8 -- 否/拒绝/关闭/超时 --> X7["不执行并关闭/冷却"]
    C8 -- 是 --> PF2["20 ExecutionProof<br/>authorization_ref；只属于本 RunEvent"]
    PF1 --> A3["21 ExecutionRequest<br/>EDGE 本地提交；CLOUD/HYBRID 下发端侧"]
    PF2 --> A3
    A3 --> P["22 端侧接收请求"]
    P --> Q{"23 最新任务、定义、producer代次、scope、<br/>执行凭证/模型时效、车况是否仍通过?"}
    Q -- 否 --> X8["拒绝执行并返回原因"]
    Q -- 是 --> S{"24 端侧幂等与整车安全门禁"}
    S -- 拒绝/重复/过期 --> X9["返回拒绝或已有结果"]
    S -- 通过 --> T["25 调用赛力斯车控"]
    T --> U["26 接收车控 ACK<br/>尚不能报业务成功"]
    U --> V["27 读取车辆真实目标状态"]
    V --> W{"28 真实状态达到目标?"}
    W -- 是 --> Z["SUCCESS"]
    W -- 否/超时/UNKNOWN --> Z1["FAILED 或 UNKNOWN"]
    Z --> OUT["29 更新卡片与运行日志<br/>任务中心单次结果/历史是否展示待确认"]
    Z1 --> OUT
    NA --> OUT
    X2 --> END["30 失败/取消/抑制收口<br/>若已有 RunEvent 则写终态与原因<br/>清理卡片/上下文/执行凭证并记录日志<br/>长期任务状态不被单次失败改写"]
    X3 --> END
    X4 --> END
    X5 --> END
    X6 --> END
    X7 --> END
    X8 --> END
    X9 --> END
    X10A --> END
    X10B --> END
    X10C --> END
    X11 --> END
    X1 --> END
    OUT --> END
~~~

### 7.2.3 一次 RunEvent 状态机

~~~mermaid
stateDiagram-v2
    [*] --> Disabled
    Disabled --> Syncing: 任务被开启/运行侧启动
    Syncing --> Waiting: 获得明确有效状态和唯一资格
    Syncing --> Disabled: 状态关闭
    Syncing --> Blocked: 状态 UNKNOWN 或资格冲突
    Waiting --> PreCandidate: 当前快照硬条件为 TRUE
    PreCandidate --> Waiting: 时效/防抖/去重/频控未通过
    PreCandidate --> Candidate: 全部治理通过并创建 RunEvent
    Candidate --> Reasoning: 需要模型/工具
    Candidate --> InteractionRequested: 无需模型且需确认
    Candidate --> Notifying: 无需模型且仅告知
    Candidate --> SilentApproved: 无需模型；策略校验通过并生成 silent_policy_decision_ref
    Reasoning --> InteractionRequested: 结果满足且需确认
    Reasoning --> Notifying: 结果满足且仅告知
    Reasoning --> SilentApproved: 结果满足；策略校验通过并生成 silent_policy_decision_ref
    Reasoning --> NoAction: NOT_FOUND/有效业务负结果
    Reasoning --> Reasoning: UNKNOWN/ERROR 且同事件重试资格通过
    Reasoning --> Failed: UNKNOWN/ERROR 且不再重试
    Reasoning --> Cancelled: 结果过期/错车/错事件/任务失效
    InteractionRequested --> CardQueued: 卡片接收/排队
    CardQueued --> Interacting: DisplayAck=VISIBLE
    CardQueued --> Cancelled: 展示失败/排队过期/被替换
    Interacting --> Authorized: 用户有效确认；原业务校验并生成 authorization_ref
    Interacting --> Cancelled: 拒绝/关闭/超时/被替换
    Notifying --> NoAction: 展示成功或失败均只记录结果；不产生执行凭证
    SilentApproved --> Prechecking: 提交已生成的 silent_policy_decision_ref
    Authorized --> Prechecking: 提交一次性 authorization_ref
    Prechecking --> Executing: 最新状态仍满足
    Prechecking --> Cancelled: 任务关闭/资格变化/凭证或模型过期/车况变化
    Executing --> Verifying: 车控请求完成
    Verifying --> Succeeded: 真实状态达到目标
    Verifying --> Failed: 真实状态明确未达到/车控拒绝
    Verifying --> Unknown: 回读超时或状态未知
    Cancelled --> Cooling: 长期任务仍有效
    NoAction --> Cooling: 长期任务仍有效
    Succeeded --> Cooling: 长期任务仍有效
    Failed --> Cooling: 长期任务仍有效
    Unknown --> Cooling: 长期任务仍有效
    Cooling --> Waiting: 冷却结束且任务仍有效
    Waiting --> Disabled: 用户关闭/任务失效
    Candidate --> Disabled: 任务关闭，事件取消
    Reasoning --> Disabled: 任务关闭，结果作废
    InteractionRequested --> Disabled: 任务关闭，撤销请求
    CardQueued --> Disabled: 任务关闭，卡片不得再展示
    Interacting --> Disabled: 任务关闭，卡片/授权失效
    Authorized --> Disabled: 任务关闭，凭证失效
    SilentApproved --> Disabled: 任务关闭，凭证失效
    Prechecking --> Disabled: 任务关闭，不执行
    Cooling --> Disabled: 任务关闭
    Succeeded --> Disabled: 长期任务已关闭
    Failed --> Disabled: 长期任务已关闭
    Unknown --> Disabled: 长期任务已关闭
    NoAction --> Disabled: 长期任务已关闭
    Blocked --> Syncing: 状态恢复或重新同步
~~~

状态表不是让产品规定代码枚举，而是确保每个模块对“现在是否还能继续”有同一理解：

| 状态 | 谁维护 | 进入条件 | 下一步/超时 | 关键底线 |
|---|---|---|---|---|
| Disabled | 状态承载方 + Runtime | 任务真实状态关闭/不适用 | 用户重新开启后进入 Syncing | 不创建新 RunEvent |
| Syncing | 状态同步层 + Runtime | 上电、登录、重启、断线重连或版本缺口 | 快照完整→Waiting；不完整→Blocked | 不能拿不明缓存继续运行 |
| Blocked | Runtime | 状态 UNKNOWN、定义不适用、producer 冲突/NONE | 修复后重新同步 | 端云双方都不能发起主动动作 |
| Waiting | 唯一 producer 所在 Runtime | 状态、定义、Assignment 都明确有效 | 观察到硬条件→PreCandidate | 长期任务“开启”主要停留在这里等待 |
| PreCandidate | Trigger | 当前快照初步为 TRUE | 时效、防抖、去重、频控通过→Candidate；否则回 Waiting | 此时还没有 RunEvent |
| Candidate | 唯一 producer | 治理通过并成功创建 RunEvent | 按需 Reasoning 或进入三种 InteractionMode | 从此模型、卡片、授权、执行都复用同一 RunEvent |
| Reasoning | 云端原业务/Planner/DT | 本任务需要模型或工具 | 明确正结果→分流；负结果→NoAction；异常按预算重试或失败 | 错车、错事件、过期结果立即丢弃 |
| InteractionRequested / CardQueued | 原业务 + VUI | 已发交互请求，尚未真正展示 | VISIBLE→Interacting；失败/过期→Cancelled | “接收请求”不等于用户已经看到 |
| Interacting | VUI + VAS/Planner + 原业务 | 卡片真正可见且有效 | 明确确认→Authorized；拒绝/关闭/超时→Cancelled | 旧卡、旧元素、歧义语音不能授权 |
| Authorized | 原业务 | 同事件、未过期、未消费的明确 CONFIRM，且一次性 authorization_ref 已生成 | 携带该凭证进入 Prechecking | 只授权本 RunEvent 的一个动作 |
| SilentApproved | 原业务 + 安全会签策略 | SILENT 且已会签策略仍有效，silent_policy_decision_ref 已生成 | 携带该凭证进入 Prechecking | 无策略凭证不得静默执行 |
| Notifying / NoAction | 原业务 + VUI | NOTIFY_ONLY 或有效业务负结果 | 告知/记录后结束本轮并进入 Cooling | 绝不生成 ExecutionProof 或车控请求 |
| Prechecking | 端侧执行层 | 收到 ExecutionProof 与执行意图 | 最新状态仍安全→Executing；否则 Cancelled | 不信任旧触发快照、旧模型或旧授权 |
| Executing / Verifying | 赛力斯车控 + 状态域 | 复核通过并发起幂等动作 | 回读目标状态→Succeeded/Failed/Unknown | RPC ACK 不能替代真实状态 |
| Succeeded / Failed / Unknown / Cancelled | 原业务 + Runtime | 本轮形成终态 | 清理卡/上下文/凭证并进入 Cooling | 单次终态不自动改变长期任务 ENABLED |
| Cooling | Runtime | 本轮结束且长期任务仍有效 | 冷却结束→Waiting；用户关闭→Disabled | 冷却期不重复创建同场景事件 |

### 7.2.4 第一次评审只记住“四道门”

如果前面的完整图一时记不住，可以先按下面四道门讲。任何任务都必须按顺序通过，前一门失败就停止，不能跨过去。

| 门 | 谁负责/在哪里 | 收到什么 | 判断什么 | 通过后输出 | 不通过怎么办 |
|---|---|---|---|---|---|
| ① 任务有效门 | 状态承载方 + 端/云 Runtime | 任务定义、某车/账号真实状态、版本、灰度 | 任务是否 ENABLED、版本是否适用、RunEvent 产生方是否唯一 | processing_topology + producer + assignment_version | UNKNOWN、DISABLED、冲突时不创建事件 |
| ② 场景命中门 | 端侧或 Cloud Trigger；按唯一产生权执行 | 新鲜的端状态/VLM/上行状态 | 条件、三值逻辑、时效、防抖、去重、频控 | 创建唯一 RunEvent；按需进入模型/工具 | FALSE/UNKNOWN/过期时本轮结束或等待 |
| ③ 交互与执行准入门 | 原业务为准入 Owner；即时卡、端侧 VAS 或云端 Planner只提供交互事实 | InteractionMode、RunEvent、卡片三类回调或静默策略 | SILENT 是否有已会签策略；NOTIFY_ONLY 是否只告知后结束；REQUIRE_CONFIRMATION 是否同事件、未过期、未消费且明确 CONFIRM | SILENT→silent_policy_decision_ref；NOTIFY_ONLY→NoAction；REQUIRE_CONFIRMATION→authorization_ref | 缺少本模式要求的凭证、旧事件、过期或歧义：不进入执行 |
| ④ 端侧执行门 | 端侧执行 + 赛力斯车控/状态 | ExecutionProof、ExecutionRequest、最新任务/Assignment/车况、必要模型结果 | 定义版本、producer 代次、scope、事件、凭证/推理时效、实时安全条件与幂等是否都通过 | 车控请求 + 真实状态回读 | 任一失败即 DENY；ACK 后回读未达标仍报 FAILED/UNKNOWN |

一句话记忆：**先确认任务能跑，再确认场景命中，再按 InteractionMode 取得正确执行依据，最后确认此刻车辆还能安全执行。**

## 7.3 每个模块究竟负责什么

| 模块 | 在哪里 | 收到什么 | 必须判断什么 | 给下游什么 | 失败处理 | 明确不负责 |
|---|---|---|---|---|---|---|
| 产品/任务定义 | PRD/配置准备 | 用户场景、车辆能力、业务目标 | 规则是否唯一、用户是否需要确认、成功状态是什么 | 一份可实现的任务定义 | 冲突或能力不存在则不进入开发 | 不替研发编接口 |
| 配置平台/发布流程 | 云端后台/端侧发版流程 | 任务定义、能力引用、车型版本 | 信号、模型、卡、动作、回读、Owner、灰度是否齐全 | 同一版本的 DisplayMetadata + RuntimeDefinition | 任一半发布失败则保持上一完整有效版本 | 不实时判断车辆场景，不把运行规则塞给任务中心 |
| 任务中心 | 车机 HMI | DisplayMetadata、真实状态、OperationResult、业务结果 | 当前是否可展示/可操作，回包是否属于当前 operation | OperationRequest：用户操作意图 | 显示处理中；失败按 OperationResult 回滚 | 不作为业务状态真源，不直接给 Trigger 发“已开启”命令 |
| 接入业务/状态承载方 | 物理位置待确认 | OperationRequest、当前实例状态 | 鉴权、幂等、支持范围、是否持久化成功 | OperationResult 给 HMI；TaskInstanceState 给状态同步层 | 保存失败保持原状态并返回原因 | 不判断天气/路况 |
| 状态同步与恢复 | 状态真源与端/云 Runtime 之间，物理协议 TBD | TaskInstanceState、RuntimeDefinition、启动/断连场景 | 快照是否完整、增量是否连续、state_version 是否倒退/跳跃 | 启动快照、增量变化、重同步结果；Runtime READY/BLOCKED | UNKNOWN/SYNCING/BLOCKED 时禁止创建 RunEvent | 不把任务中心列表 Push/Pull 自动当成 Trigger 运行态协议 |
| 处理拓扑与事件产生权 | 逻辑状态面，物理实现待确认 | 任务状态、版本、灰度、部署方向 | 链路经过 EDGE/CLOUD/HYBRID 中哪些位置；哪一侧唯一创建 RunEvent | processing_topology + run_event_producer + assignment_version | producer 为 NONE/冲突时双方不动作并告警 | 不做具体业务条件；HYBRID 不等于两侧都能创建事件 |
| 端侧 Trigger | 车端 | 任务状态、资格、本地端状态/VLM | 数据新鲜、规则、防抖、去重、频控 | Candidate/RunEvent/端侧卡请求 | UNKNOWN/过期不触发 | 不展示 UI、不把确认当车控成功 |
| Cloud Trigger | 云端 | 任务状态、资格、合规上行数据 | 硬条件、时效、防抖、去重 | 云端候选/推荐事件 | 无网、旧数据、UNKNOWN 不继续 | 不直接车控 |
| Advisor/Planner/DT/VQA | 云端，必要时调用端侧视觉 | 推荐 Query、上下文、工具请求 | 是否需要工具、结果是否明确且有效 | 业务判断/卡片上下文/动作意图 | ERROR/UNKNOWN/过期不执行 | 不替代端侧安全复核 |
| 即时交互卡/VUI | 车机 | InteractionRequest：任务、实例、RunEvent、文案、按钮、TTS、路由、有效期 | 准入、排队、真正展示、控件是否仍有效 | DisplayAck、InteractionEvent、LifecycleEvent | 展示失败、关闭、超时、替换均带原 RunEvent 回原业务 | 不判断业务条件、不直接车控 |
| 可见即可说 | 当前可见 UI + 字节语音 | 页面元素、ASR 文本、当前指令集 | 匹配、消歧、元素是否仍在顶层页面 | 对原按钮的模拟点击 | 无匹配/多义/元素失效不操作 | 不理解天气业务、不绕过按钮回调 |
| 原业务 / InteractionMode 准入 | 端侧天气原业务或云端充电原业务 | RuntimeDefinition、RunEvent、三类交互回调或静默策略 | 本模式要求的凭证是否成立；结果是否同事件、未过期、未消费 | authorization_ref、silent_policy_decision_ref，或 NoAction | 缺凭证、旧事件、仅告知一律不执行 | 不把“卡片展示/按钮点击”直接当车控授权 |
| ExecutionProof | 原业务形成，端侧执行消费 | RunEvent、InteractionMode、用户结果或已会签静默策略 | 凭证是否同车同事件、一次性、未过期、未消费 | 一次性执行依据 | NOTIFY_ONLY 不生成；过期/重复/歧义不生成或不复用 | 不包含裸车控，不替代端侧复核 |
| 端侧执行前复核 | 车端 | ExecutionRequest/Proof、模型结果、最新任务/Assignment/车况 | 是否同车同事件、版本/代次/时效有效、仍安全、未重复 | ALLOW/DENY 及原因 | 任一不满足立即终止 | 不信任旧快照、旧云结果或旧授权 |
| 赛力斯车控 | 车端 | 已通过复核的动作请求 | 整车能力、安全门禁、幂等 | ACK/拒绝/错误 | 明确错误，不假报成功 | 不决定业务推荐 |
| 真实状态回读 | 车端状态域 | 目标状态、观察窗口 | 实车状态是否达到目标 | SUCCESS/FAILED/UNKNOWN | 超时或无信号记未知/失败 | 不用 RPC ACK 代替 |
| 结果/观测治理 | 卡片、Runtime 日志；任务中心单次结果/历史范围 TBD | 定义/实例/状态/Assignment/RunEvent/卡/推理/凭证/动作/回读 | 是否串车、串事件、串版本；每道门是否有 allow/deny reason | 终态、冷却、指标、告警、回放与审计证据 | 关联缺失降级 UNKNOWN；旧事件不得覆盖新状态 | 不重做业务判断，不因 UI 更新失败重复车控 |

## 7.4 九类公共数据合同：每一跳到底给什么、返回什么

> 以下全部是产品语义示例。评审时先确认“信息是否必须存在”，正式字段名和接口由技术专项设计。

| 编号 | 合同 | 解决的问题 | 生产者 → 消费者 | 最关键底线 |
|---|---|---|---|---|
| ① | RuntimeDefinition | Runtime 按哪一版规则运行 | 配置/发布 → 端侧或云端 Runtime | 与 DisplayMetadata 分开；缺依赖不发布 |
| ② | TaskInstanceState | 某车/账号下任务是否真实有效 | 状态承载方 → 状态同步层、Runtime | UNKNOWN 不能猜成开启或关闭 |
| ③ | RuntimeAssignment | 经过端/云哪里，谁唯一建事件 | 架构/灰度资格方 TBD → 端云 Runtime、端侧执行门 | topology 可 HYBRID，producer 不可 HYBRID |
| ④ | SignalSnapshot | 本次判断依据是哪组同车同时间数据 | 唯一 producer 所在 Trigger → 规则、RunEvent、模型、复核 | 关键值 UNKNOWN/STALE 不得算 TRUE |
| ⑤ | RunEvent | 这是哪一次条件命中 | 唯一 producer → 模型、卡片、原业务、执行、结果 | 先建 RunEvent，后生成 Query、调模型或出卡 |
| ⑥ | InteractionRequest / Events | 怎样出卡、卡片怎样回三类事实 | 原业务 ↔ VUI/VAS/Planner | 每类回调必须带原 RunEvent 与 card_ref |
| ⑦ | ExecutionProof | 本次为什么可以进入端侧复核 | 原业务 → ExecutionRequest/端侧复核 | 确认用 authorization_ref；静默用 policy_ref；仅告知没有凭证 |
| ⑧ | ExecutionRequest | 端侧这一次要做什么 | 端侧原业务或云端执行编排 → 端侧复核/车控 | 带 scope、有效期、代次、防串代和幂等 |
| ⑨ | Result | 本轮每层结果与最终真相是什么 | 交互/业务/车控/状态 → 原业务、VUI、日志 | 只有真实状态达标才 SUCCESS |

### 7.4.1 RuntimeDefinition 与 DisplayMetadata

同一产品任务定义通过门禁后，必须生成两个版本一致、用途不同的发布物。

~~~jsonc
{
  "_example_only": true,
  "display_metadata": {
    "task_definition_ref": "DEMO-WEATHER-PROTECT",
    "definition_version": "DEMO-v12",
    "name": "天气/路况保护",
    "description": "在雨、雾、雪等场景提醒并协助调整车辆能力",
    "icon_ref": "TBD",
    "available_operations": ["TBD_BY_TASK_CENTER_PHASE"],
    "available_operations_status": "TARGET_SCOPE_NOT_CONFIRMED",
    "applicability_summary": "TBD"
  },
  "runtime_definition": {
    "task_definition_ref": "DEMO-WEATHER-PROTECT",
    "definition_version": "DEMO-v12",
    "applicability": {
      "vehicle_models": ["TBD"],
      "software_range": "TBD"
    },
    "trigger_policy_ref": "DEMO-WEATHER-RULE-v12",
    "interaction_mode": "REQUIRE_CONFIRMATION",
    "interaction_policy_ref": "DEMO-WEATHER-CARD-v3",
    "action_capabilities": [
      "SWITCH_WET_MODE",
      "SWITCH_SNOW_MODE",
      "TURN_ON_REAR_FOG_LIGHT"
    ],
    "completion_truth": "REAL_VEHICLE_STATE",
    "owner": "TBD"
  }
}
~~~

`available_operations` 只表示 DisplayMetadata 需要承载“哪些操作可展示”的语义；系统预设任务一期究竟支持开启、关闭、删除或仅展示，仍由任务中心专项拍板，不能从示例推断已经支持启停。

生产与消费关系：

- `DisplayMetadata`：配置/发布方生产，任务中心消费；
- `RuntimeDefinition`：配置/发布方生产，端侧或云端 Runtime 消费；
- `processing_topology`、`run_event_producer` 和当前代次不在 RuntimeDefinition 中决定，运行时以独立 `RuntimeAssignment` 为准；任务定义如保留“建议默认拓扑”，也只能用于生成 Assignment 的输入，不能直接获得发起权。

发布方必须返回：

- 发布是否成功；
- 哪个版本生效；
- 适用哪些车型/环境；
- 缺少哪些信号、交互或动作能力；
- 灰度、回滚与废弃版本是什么。

任何一边发布失败都不能形成“任务中心看得到但 Runtime 没规则”或“Runtime 已运行但任务中心版本不一致”的半发布状态；应保持上一组完整有效版本并告警。

### 7.4.2 TaskInstanceState｜任务真实状态合同

**生产者：**接入业务/真实状态承载方。**消费者：**任务中心、状态同步层、端侧与云端 Runtime。任务中心的 `OperationResult` 只服务本次 HMI 操作回显；Runtime 消费的是持久化成功后形成的 `TaskInstanceState`。

~~~jsonc
{
  "_example_only": true,
  "task_instance_ref": "DEMO-TASK-INSTANCE-7F21",
  "task_definition_ref": "DEMO-WEATHER-PROTECT",
  "scope": {
    "vehicle_ref": "DEMO-VEHICLE-MASKED",
    "account_ref": "DEMO-ACCOUNT-MASKED"
  },
  "effective_state": "ENABLED",
  "state_version": 42,
  "definition_version": "DEMO-v12",
  "changed_at": "2026-09-04T15:00:00.250+08:00",
  "reason": "USER_ENABLED"
}
~~~

必须表达的产品语义：

- 是哪项任务、哪辆车/账号；
- 当前是 ENABLED、DISABLED 还是 UNKNOWN；
- 哪个定义版本；
- 状态顺序/版本和更新时间；
- 是用户操作、系统策略、车型不支持还是版本回滚导致变化。

### 7.4.3 RuntimeAssignment｜处理拓扑与 RunEvent 产生权合同

**生产者：**架构/灰度/运行资格承载方，正式 Owner 待确认。**消费者：**端侧 Runtime、云端 Runtime、端侧执行门。

~~~jsonc
{
  "_example_only": true,
  "task_instance_ref": "DEMO-TASK-INSTANCE-7F21",
  "processing_topology": "EDGE",
  "run_event_producer": "EDGE",
  "assignment_version": 7,
  "definition_version": "DEMO-v12",
  "valid_from": "2026-09-04T15:00:01+08:00",
  "valid_until": "TBD",
  "fencing_token": "DEMO-ASSIGNMENT-7-FENCE",
  "reason": "EDGE_RELEASE_ACTIVE"
}
~~~

产品要求：

- 处理拓扑回答“会经过端侧、云端还是两者”；RunEvent 产生方回答“谁有权发起这一次业务”，两者不能混成一个字段；
- 同一任务实例同时最多一个有效 RunEvent 产生方；HYBRID 拓扑也只能选 EDGE 或 CLOUD，不能填 HYBRID；
- producer 为 NONE 或产生权冲突时，端侧和云端均不能产生新的主动动作；
- 迁移时必须让旧产生权代次、旧 RunEvent、旧卡片和旧授权失效；
- 正式实现可用版本、租约、灰度路由或其他方式，但必须能证明唯一性。

### 7.4.4 SignalSnapshot｜条件快照合同

**生产者：**唯一 producer 所在 Trigger。**消费者：**规则引擎、RunEvent、模型/工具和端侧复核。

~~~jsonc
{
  "_example_only": true,
  "snapshot_ref": "DEMO-SNAPSHOT-20260904-150300-001",
  "snapshot_phase": "TRIGGER_SNAPSHOT",
  "run_event_ref": null,
  "task_instance_ref": "DEMO-TASK-INSTANCE-7F21",
  "scope": {"vehicle_ref": "DEMO-VEHICLE-MASKED"},
  "task_state_version": 42,
  "assignment_version": 7,
  "captured_at": "2026-09-04T15:03:00.100+08:00",
  "cross_signal_skew_ms": 20,
  "signals": {
    "task_enabled": {"value": true, "observed_at": "2026-09-04T15:03:00+08:00"},
    "weather": {"value": "RAIN", "quality": "VALID", "age_ms": 50},
    "road": {"value": "WET", "quality": "VALID", "age_ms": 50},
    "speed_kmh": {"value": 46, "age_ms": 30},
    "drive_mode": {"value": "NORMAL", "age_ms": 30}
  }
}
~~~

必须表达：

- 本快照属于哪辆车、哪个任务实例、哪个状态/Assignment 版本；
- 每项数据的值、采集时间、质量和 age；
- 单信号 TTL 与跨信号最大时间差；
- 任一关键项 UNKNOWN/STALE 或跨信号时间差超限，整条规则不得算成 TRUE。

触发快照在 RunEvent 创建前形成，因此示例中的 `run_event_ref` 可以暂为空；RunEvent 创建成功后必须把该快照关联为 `TRIGGER_SNAPSHOT`。执行前重新读取的快照必须标为 `PRECHECK_SNAPSHOT` 并直接携带同一 `run_event_ref`，用于证明没有复用旧车况。

### 7.4.5 RunEvent｜单次运行事件合同

**生产者：**RuntimeAssignment 指定的唯一 producer。**消费者：**模型/工具、即时卡、原业务、执行层、结果与日志。

~~~jsonc
{
  "_example_only": true,
  "run_event_ref": "DEMO-RUN-20260904-150301-001",
  "task_definition_ref": "DEMO-WEATHER-PROTECT",
  "task_instance_ref": "DEMO-TASK-INSTANCE-7F21",
  "definition_version": "DEMO-v12",
  "producer_assignment_version": 7,
  "branch": "RAIN_OR_WET_ROAD_TO_WET_MODE",
  "snapshot_ref": "DEMO-SNAPSHOT-20260904-150300-001",
  "triggered_at": "2026-09-04T15:03:01+08:00",
  "valid_until": "TBD",
  "status": "CANDIDATE"
}
~~~

顺序底线：硬候选、数据时效、防抖、去重和频控全部通过后，先创建一次 RunEvent；只有创建成功，原业务才能生成 Query、调用 Advisor/Planner/DT、请求卡片或形成执行凭证。后续节点只能复用该 `run_event_ref`，禁止再创建第二个。

### 7.4.6 InteractionRequest / Events｜即时交互合同

#### 7.4.6.1 原业务给即时交互卡什么

~~~jsonc
{
  "_example_only": true,
  "task_definition_ref": "DEMO-WEATHER-PROTECT",
  "task_instance_ref": "DEMO-TASK-INSTANCE-7F21",
  "run_event_ref": "DEMO-RUN-20260904-150301-001",
  "source_type": "EDGE_TRIGGER",
  "interaction_mode": "REQUIRE_CONFIRMATION",
  "content": {
    "title": "当前路面湿滑",
    "body": "是否切换到适合湿滑路面的驾驶模式？"
  },
  "actions": [
    {"semantic": "CONFIRM", "display_text": "切换"},
    {"semantic": "REJECT", "display_text": "暂不"}
  ],
  "tts": {
    "policy": "FIXED_COPY",
    "text": "当前天气路况不佳，是否为你调整驾驶模式？",
    "voice_disabled_fallback": "SHOW_CARD_ONLY"
  },
  "voice_route": "LOCAL_VISIBLE_SPEAK",
  "click_route": "RETURN_TO_ORIGINAL_BUSINESS",
  "interaction_expires_at": "TBD",
  "priority": "TBD"
}
~~~

卡片收到后至少返回三类结果：

1. **展示结果**：接收、排队、已展示、展示失败及原因；
2. **用户结果**：确认、拒绝、关闭、超时、打断及输入来源；
3. **生命周期结果**：隐藏、恢复、过期、被替换、被消费。

每类结果都必须能关联原 RunEvent。卡片只回“按钮被点击”是不够的。

#### 7.4.6.2 卡片必须返回哪三类事实

~~~jsonc
{
  "_example_only": true,
  "display_ack": {
    "run_event_ref": "DEMO-RUN-20260904-150301-001",
    "card_ref": "DEMO-CARD-8831",
    "display_state": "VISIBLE",
    "failure_reason": null,
    "occurred_at": "2026-09-04T15:03:02.000+08:00"
  },
  "interaction_event": {
    "run_event_ref": "DEMO-RUN-20260904-150301-001",
    "card_ref": "DEMO-CARD-8831",
    "user_result": "CONFIRM",
    "input_source": "VISIBLE_SPEAK_SIMULATED_CLICK",
    "element_semantic": "CONFIRM",
    "occurred_at": "2026-09-04T15:03:04.050+08:00"
  },
  "lifecycle_event": {
    "run_event_ref": "DEMO-RUN-20260904-150301-001",
    "card_ref": "DEMO-CARD-8831",
    "card_state": "CONSUMED",
    "failure_reason": null,
    "occurred_at": "2026-09-04T15:03:04.080+08:00"
  }
}
~~~

三个回调不能合成一个模糊的“卡片成功”：

| 回调 | 回答什么 | 最小状态枚举 | 为什么单独存在 |
|---|---|---|---|
| DisplayAck | 请求有没有排队、真正显示或失败 | QUEUED / VISIBLE / FAILED | 只有真正 VISIBLE 才能建立本轮可用语音/点击上下文 |
| InteractionEvent | 用户做了什么 | CONFIRM / REJECT / CLOSE / TIMEOUT / INTERRUPT | 业务要区分结果、输入来源和按钮语义 |
| LifecycleEvent | 卡片现在是否还有效 | VISIBLE / HIDDEN / EXPIRED / REPLACED / RESTORED / CONSUMED | 卡片被替换或过期后，晚到语音/点击不能授权 |

业务收到后必须判断：

- 是否是当前活动 RunEvent；
- 卡片和授权是否仍有效；
- 是否已被消费；
- 用户是否明确确认；
- 手点和模拟点击是否进入同一个业务按钮处理入口。

### 7.4.7 ExecutionProof｜执行准入凭证合同

**生产者：**端侧天气原业务或云端充电原业务。**消费者：**ExecutionRequest 组装方、端侧执行前复核。

~~~jsonc
{
  "_example_only": true,
  "run_event_ref": "DEMO-RUN-20260904-150301-001",
  "task_instance_ref": "DEMO-TASK-INSTANCE-7F21",
  "decision_type": "USER_AUTHORIZATION",
  "authorization_ref": "DEMO-CARD-8831-CONFIRM",
  "silent_policy_decision_ref": null,
  "scope": {"vehicle_ref": "DEMO-VEHICLE-MASKED"},
  "policy_version": "DEMO-WEATHER-CARD-v3",
  "created_at": "2026-09-04T15:03:04.060+08:00",
  "expires_at": "TBD",
  "consumed": false
}
~~~

三种 InteractionMode 的合同必须互斥：

| InteractionMode | 是否出卡/TTS | ExecutionProof | 能否进入端侧复核 |
|---|---|---|---|
| SILENT | 否 | 必须有已会签且仍有效的 `silent_policy_decision_ref` | 有有效凭证时可以；仍需端侧最新状态复核 |
| NOTIFY_ONLY | 卡片和/或 TTS 仅告知 | 不生成 | 不可以；告知后以 NoAction 结束 |
| REQUIRE_CONFIRMATION | 是 | 只有有效 CONFIRM 才生成一次性 `authorization_ref` | 有有效凭证时可以；拒绝/关闭/超时/歧义均不可以 |

不得同时携带两种凭证；不得跨 RunEvent 复用；卡片展示成功、模型 FOUND 或 RPC ACK 都不是 ExecutionProof。

### 7.4.8 ExecutionRequest｜端侧一次性执行请求

下面以云端充电请求为例；端侧任务本地提交时也必须保留同样的任务、事件、凭证、时效、代次和幂等语义。

~~~jsonc
{
  "_example_only": true,
  "task_definition_ref": "DEMO-CHARGE-PORT",
  "task_instance_ref": "DEMO-CHARGE-INSTANCE-01",
  "run_event_ref": "DEMO-CHARGE-RUN-001",
  "action": "OPEN_CHARGE_PORT",
  "inference_ref": "DEMO-DT-RESULT-001",
  "execution_proof": {
    "authorization_ref": "DEMO-CARD-7701-CONFIRM",
    "silent_policy_decision_ref": null
  },
  "definition_version": "DEMO-v1",
  "producer_assignment_version": 18,
  "scope": {
    "vehicle_ref": "DEMO-VEHICLE-MASKED",
    "account_ref": "DEMO-ACCOUNT-MASKED"
  },
  "execute_before": "TBD",
  "fencing_token": "DEMO-ASSIGNMENT-18-FENCE",
  "idempotency_key": "DEMO-CHARGE-RUN-001:OPEN_CHARGE_PORT"
}
~~~

这里的 `producer_assignment_version` / `fencing_token` 表达的是：端侧必须能拒绝旧产生权代次创建的迟到请求。正式实现未必使用这两个字段名，但必须有等价防串代机制。

端侧还必须验证 `authorization_ref XOR silent_policy_decision_ref`：两者恰好一个有效。两者都缺、两者同时存在，或当前为 NOTIFY_ONLY，均必须 DENY。

端侧至少返回：

- 请求是否接收；
- 执行前复核 ALLOW/DENY 及原因；
- 车控 ACK/拒绝/错误；
- 真实状态 SUCCESS/FAILED/UNKNOWN；
- 最终时间与事件关联。

### 7.4.9 Result｜分层结果与最终真实状态合同

~~~jsonc
{
  "_example_only": true,
  "run_event_ref": "DEMO-RUN-20260904-150301-001",
  "interaction_or_policy_result": "CONFIRMED",
  "precheck_result": "ALLOW",
  "control_result": "ACCEPTED",
  "real_state_result": {
    "target": {"drive_mode": "WET_MODE"},
    "observed": {"drive_mode": "WET_MODE"},
    "quality": "VALID",
    "observed_at": "2026-09-04T15:03:04.650+08:00"
  },
  "final_business_result": "SUCCEEDED_BY_TRUE_STATE",
  "terminal_reason": "TARGET_STATE_OBSERVED",
  "cooling_until": "TBD"
}
~~~

若真实状态明确未达到目标，结果为 `FAILED`；若回读超时或质量不可判，结果为 `UNKNOWN`。终态后清理旧卡片、Planner 上下文和 ExecutionProof，并进入冷却；长期任务实例是否仍为 `ENABLED` 由 TaskInstanceState 决定，不因一次运行失败自动关闭。

统一口径：

~~~text
用户点击成功 ≠ 车辆成功
可见即可说模拟点击成功 ≠ 车辆成功
Planner 理解成功 ≠ 车辆成功
端侧收到请求 ≠ 车辆成功
执行前复核通过 ≠ 车辆成功
车控 RPC ACK ≠ 车辆成功
车辆真实状态达到目标 = 业务成功
~~~

## 7.5 任务中心到 Trigger：真实状态究竟怎么来

### 7.5.1 已有任务中心通用材料能确认到什么

【资料已确认｜早期任务中心通用边界】可确认的口径是：

- 任务中心是 HMI 展示和管理入口；
- 接入业务维护任务真实状态，任务中心承接用户操作并展示回传结果；
- 预置条件任务的规则走 Trigger 配置/其他路径创建，不是任务中心自己执行；
- 最新任务中心资料有列表推送和车辆上电/账号登录拉取的设计。

【待确认】上述“接入业务维护真实状态”的通用模式是否直接适用于系统预设任务、具体由哪个业务/服务保存真状态，仍需晓伟、任务系统和对应接入业务共同确认。

【没有说过】当前没有找到晓伟明确确认以下实现：

~~~text
任务中心点击开关
→ 携带 taskId + enabled
→ 直接向端侧 Trigger 发送事件
→ Trigger 本地保存
~~~

因此不能把这段写成“已有链路”。列表 Push/Pull 也不能自动等价为运行态已经同步给 Trigger。

### 7.5.2 目标业务链

~~~mermaid
sequenceDiagram
    actor U as 用户
    participant PUB as 配置/发布
    participant TC as 任务中心
    participant BS as 接入业务/状态真源
    participant SY as 状态同步层
    participant RA as RuntimeAssignment承载方TBD
    participant RT as 端侧/云端 Runtime

    PUB->>TC: A1 DisplayMetadata<br/>名称/说明/适用范围/可操作项
    PUB->>RT: A2 RuntimeDefinition<br/>版本化规则/交互/动作/回读
    U->>TC: 点击开启/关闭/删除
    TC->>BS: B1 OperationRequest<br/>任务、车辆/账号、目标状态、幂等关联
    BS->>BS: 鉴权、幂等、适用范围、持久化
    alt 保存失败
        BS-->>TC: B2 OperationResult=FAILED<br/>原真实状态 + 原因
        TC-->>U: 回滚/提示失败
    else 保存成功
        BS-->>TC: B2 OperationResult=SUCCEEDED<br/>新真实状态 + 状态版本
        TC-->>U: 展示真实状态
        BS->>SY: TaskInstanceState<br/>ENABLED/DISABLED/UNKNOWN + state_version
    end
    par C1 启动/重连
        SY->>RT: 全量适用任务快照
    and C2 运行期间
        SY->>RT: 增量状态变化 + state_version
    and D 运行资格
        RA->>RT: topology + producer + assignment_version + fencing
    end
    RT->>RT: 校验定义版本、状态顺序、producer唯一性
    alt 快照完整且状态/Assignment明确
        RT->>RT: READY；允许等待场景并创建RunEvent
    else 版本跳跃/缺消息/UNKNOWN/冲突
        RT->>SY: C3 请求重同步
        RT->>RT: BLOCKED；不创建RunEvent
    end
    Note over TC,RT: OperationResult只服务HMI回显；Runtime不把它当“Trigger已开启”命令
~~~

这条链必须拆成六种不同数据，评审时不要统称“任务中心把开关发给 Trigger”：

| 编号 | 数据 | 从哪里到哪里 | 用途 | 不可混淆点 |
|---|---|---|---|---|
| A1 | DisplayMetadata | 发布 → 任务中心 | 展示任务名称、说明、适用范围和控件 | 不含 Trigger 运行规则 |
| A2 | RuntimeDefinition | 发布 → 端/云 Runtime | 提供版本化规则、交互模式、动作和成功真相 | 不经过任务中心，不代表用户已开启 |
| B1 | OperationRequest | 任务中心 → 状态承载方 | 表达用户想开启/关闭/删除 | 只是操作意图，不是真状态 |
| B2 | OperationResult | 状态承载方 → 任务中心 | 让 HMI 显示成功、失败或回滚 | 不是 Runtime 的开启事件 |
| C1/C2/C3 | TaskInstanceState 同步 | 状态承载方/同步层 → Runtime | 启动全量、运行增量、异常重同步 | 必须可判顺序；UNKNOWN/SYNCING 时不运行 |
| D | RuntimeAssignment | 运行资格承载方 TBD → Runtime/端侧执行门 | 指定 topology、唯一 producer、代次和防串代 | HYBRID 仍只有一个 producer |

### 7.5.3 推荐的目标机制

【产品建议】采用“启动快照 + 运行时变化事件 + 断线重同步”：

1. 车辆上电、账号登录、Trigger/Cloud Runtime 重启时，先获取适用任务完整快照；
2. 快照未完成前状态为 SYNCING/UNKNOWN，不创建新 RunEvent；
3. 运行期间接收 ENABLED/DISABLED 等变化；
4. 每次变化携带等价的顺序语义，旧消息不能覆盖新状态；
5. 断线、漏消息、版本跳变时重新拉完整快照；
6. Trigger 在规则判断前和车控前都读取当前真实状态；
7. 任务关闭后不产生新事件，并取消仍可取消的卡片/授权/云端推理；
8. 已进入车控的动作怎样中止由车控安全专项确定，不能由产品假设。

### 7.5.4 关闭发生在不同阶段时怎么处理

| 关闭时刻 | 正确行为 |
|---|---|
| 仍在 Waiting | 立即停止新条件判断/至少阻止创建新 RunEvent |
| Candidate 已生成但未拉卡 | 事件失效，不再拉卡 |
| 卡片排队中 | 撤销；若无法撤销，展示前再次校验并过期 |
| 卡片已展示 | 让卡片失效/关闭；晚到点击或语音不能授权 |
| 云端 DT/VQA 处理中 | 结果返回也按任务已关闭丢弃 |
| 已授权、尚未端侧复核 | 复核失败，不执行 |
| 已向车控发起 | 按车控可取消性和真实状态收口；必须记录关闭与动作的竞态 |

### 7.5.5 需要与晓伟这样说

> “我确认任务中心是展示和操作入口，接入业务维护真实状态。但系统预设任务要运行，Trigger 还需要一份可恢复、可判新旧的任务有效状态。请任务系统明确：第一，系统预设任务一期到底支持开启、关闭还是只有删除；第二，用户操作交给哪个接入业务；第三，谁是真实状态 Owner；第四，端侧和 Cloud Runtime 通过什么机制拿启动快照和变化；第五，关闭时怎样让在途 RunEvent、卡片和云端结果失效。列表 Push/Pull 如果只服务 HMI，请不要把它当运行态同步的答案。”

## 7.6 端侧完整示例：天气/路况保护逐步数据演算

### 7.6.1 先固定这一次演示场景

~~~text
演示时间：2026-09-04 15:00:00—15:03:05
车辆：DEMO-VEHICLE-MASKED
任务：天气/路况保护
任务状态：用户开启，状态真源确认 ENABLED
运行位置：EDGE
当前场景：车速 46 km/h，天气 RAIN，路面 WET，驾驶模式 NORMAL
用户交互：卡片显示后说“好的”
目标动作：切换 WET_MODE
最终结果：真实驾驶模式由 NORMAL 变成 WET_MODE
~~~

所有 ID、时间、词表、防抖次数和时效均是演示值。正式值必须由对应专项确认。

### 7.6.2 总流程

~~~mermaid
flowchart TD
    S1["1 发布天气任务定义"] --> S2["2 任务中心展示"]
    S2 --> S3["3 用户点击开启"]
    S3 --> S4["4 状态真源保存并回真实状态"]
    S4 --> S5["5 Trigger 启动快照/变化同步"]
    S5 --> S6["6 订阅 VLM 与端状态"]
    S6 --> S7["7 组成同一时刻 SignalSnapshot"]
    S7 --> S8["8 三值规则计算"]
    S8 --> S9["9 防抖、去重、频控"]
    S9 --> S10["10 创建 RunEvent"]
    S10 --> S11["11 请求即时交互卡"]
    S11 --> S12["12 卡片真正展示并注册可见即可说"]
    S12 --> S13["13 用户说好的，ASR/匹配"]
    S13 --> S14["14 模拟点击原确认按钮"]
    S14 --> S15["15 卡片返回同一 RunEvent 的 CONFIRM"]
    S15 --> S16["16 Trigger 重新读取最新状态并复核"]
    S16 --> S17["17 调用赛力斯车控"]
    S17 --> S18["18 真实状态回读"]
    S18 --> S19["19 更新卡片、Runtime 日志并冷却<br/>任务中心单次结果/历史展示 TBD"]
~~~

### 7.6.3 Step 1：发布任务定义

**人话**：先定义“天气保护是一项什么长期能力”，不是给某辆车直接发车控。

| 六问 | 内容 |
|---|---|
| 谁负责 | 天气任务产品 + 配置/发布 + 信号/VUI/车控各能力 Owner |
| 在哪里做 | 当前可能是端侧需求与整车发版；长期可沉淀到配置平台 |
| 收到什么 | 三条天气分支、车型、信号、交互、动作和验收 |
| 判断什么 | 信号、动作、卡片、状态回读是否真实存在；端云位置是否唯一 |
| 输出什么 | 同一版本的 DisplayMetadata + RuntimeDefinition；RuntimeAssignment 由独立资格链产生 |
| 失败怎么办 | 任一关键能力缺失即阻止发布 |

~~~jsonc
{
  "_example_only": true,
  "task_definition_ref": "DEMO-WEATHER-PROTECT",
  "definition_version": "DEMO-v12",
  "branches": [
    "RAIN_OR_WET_TO_WET_MODE",
    "SNOW_OR_ICE_TO_SNOW_MODE",
    "DENSE_FOG_TO_REAR_FOG_LIGHT"
  ],
  "interaction": {
    "interaction_mode": "REQUIRE_CONFIRMATION",
    "card": "INSTANT_INTERACTION_CARD",
    "voice_route": "LOCAL_VISIBLE_SPEAK"
  },
  "completion_truth": "REAL_VEHICLE_STATE"
}
~~~

这里不在 RuntimeDefinition 内直接授予运行权。天气的 `processing_topology=EDGE` 与 `run_event_producer=EDGE` 由独立 RuntimeAssignment 在运行时确认；若 Assignment 为 NONE、冲突或版本不匹配，端侧即使已有规则也不能创建 RunEvent。

【资料已确认】天气走端侧自闭环、需要卡片/TTS/二次确认、本地语音走可见即可说。  
【待确认】统一配置平台是否已经能把此定义动态下发端侧；当前端侧仍可能随车发版。

### 7.6.4 Step 2：任务中心展示

**人话**：任务中心拿的是给用户看的任务条目，不拿天气规则执行权。

| 六问 | 内容 |
|---|---|
| 谁负责 | 任务中心/HMI + 天气任务接入业务 |
| 在哪里做 | 车机任务中心 |
| 收到什么 | 名称、描述、适用范围、可操作能力、真实状态 |
| 判断什么 | 当前车型/版本是否适用，状态是否已知 |
| 输出什么 | 天气任务条目及真实展示状态 |
| 失败怎么办 | UNKNOWN 不假显示开启；展示加载/异常 |

~~~jsonc
{
  "_example_only": true,
  "task_definition_ref": "DEMO-WEATHER-PROTECT",
  "title": "天气/路况保护",
  "operation_capability": "ENABLE_DISABLE_TBD",
  "displayed_state": "DISABLED"
}
~~~

【资料冲突】早期天气需求要求任务中心可开启/关闭/删除；最新版任务中心一期只明确删除且系统预设任务单元待补。因此本例把“开启”作为目标链演示，不冒充现有能力。

### 7.6.5 Step 3：用户点击开启

**转换过程**：

~~~text
页面动作：“打开天气/路况保护”
→ 任务中心只生成操作意图
→ 不立即把页面状态当成真实开启
~~~

~~~jsonc
{
  "_example_only": true,
  "object_type": "OperationRequest",
  "operation_ref": "DEMO-OP-150000-001",
  "task_definition_ref": "DEMO-WEATHER-PROTECT",
  "vehicle_ref": "DEMO-VEHICLE-MASKED",
  "account_ref": "DEMO-ACCOUNT-MASKED",
  "desired_state": "ENABLED",
  "requested_at": "2026-09-04T15:00:00+08:00",
  "idempotency_key": "DEMO-OP-150000-001"
}
~~~

| 谁/哪里 | 判断 | 输出 | 失败 |
|---|---|---|---|
| 任务中心/车机 HMI | 页面是否可操作、是否重复点击 | 操作意图，UI 显示处理中 | 超时/失败恢复原状态，不假开启 |

### 7.6.6 Step 4：状态真源保存并回结果

~~~text
任务中心操作意图
→ 接入业务鉴权、幂等、校验车型/版本
→ 持久化成功
→ 回任务中心真实状态
→ 准备给运行时同步
~~~

~~~jsonc
{
  "_example_only": true,
  "operation_result": {
    "operation_ref": "DEMO-OP-150000-001",
    "result": "SUCCEEDED",
    "failure_reason": null
  },
  "task_instance_state": {
    "task_instance_ref": "DEMO-TASK-INSTANCE-7F21",
    "task_definition_ref": "DEMO-WEATHER-PROTECT",
    "scope": {
      "vehicle_ref": "DEMO-VEHICLE-MASKED",
      "account_ref": "DEMO-ACCOUNT-MASKED"
    },
    "effective_state": "ENABLED",
    "state_version": 42,
    "definition_version": "DEMO-v12",
    "changed_by_operation_ref": "DEMO-OP-150000-001",
    "changed_at": "2026-09-04T15:00:00.250+08:00"
  }
}
~~~

| 谁/哪里 | 判断 | 输出 | 失败 |
|---|---|---|---|
| 接入业务/状态承载方，物理位置 TBD | 鉴权、幂等、支持范围、是否真正持久化 | OperationResult 回任务中心；TaskInstanceState 交状态同步层 | 保持原状态；Trigger 不获得资格 |

### 7.6.7 Step 5：端侧 Trigger 获得任务有效状态

~~~text
车辆上电或 Trigger 重启
→ 先取适用任务完整快照
→ 快照完成后进入 READY
运行期间
→ 接收状态变化
→ 只接受比本地更新的版本
~~~

~~~jsonc
{
  "_example_only": true,
  "task_instance_ref": "DEMO-TASK-INSTANCE-7F21",
  "effective_state": "ENABLED",
  "state_version": 42,
  "definition_version": "DEMO-v12",
  "processing_topology": "EDGE",
  "run_event_producer": "EDGE",
  "producer_assignment_version": 7,
  "recovery_state": "READY",
  "observed_by_trigger_at": "2026-09-04T15:00:01+08:00"
}
~~~

| 谁/哪里 | 判断 | 输出 | 失败 |
|---|---|---|---|
| 状态同步层 + RuntimeAssignment → 端侧 Trigger | 启动快照完整、状态明确、版本适用、增量连续、run_event_producer=EDGE | Runtime=READY，Trigger 进入 Waiting | 未拿到/UNKNOWN/版本倒退或跳跃/产生权冲突时 BLOCKED 并重同步 |

【产品建议】使用启动快照 + 变化事件 + 断线重同步。  
【待确认】真实接口、存储、Owner、时效和端侧是否直接消费。

### 7.6.8 Step 6：订阅天气/VLM 与车辆状态

~~~jsonc
{
  "_example_only": true,
  "weather_observation": {
    "logical_source": "EDGE_VLM_OUTSIDE_SCENE",
    "weather_description": "RAIN",
    "road_description": "WET",
    "observed_at": "2026-09-04T15:03:00.100+08:00",
    "quality": "VALID_EXAMPLE"
  },
  "vehicle_observation": {
    "speed_kmh": 46,
    "drive_mode": "NORMAL",
    "rear_fog_light": "OFF",
    "observed_at": "2026-09-04T15:03:00.120+08:00"
  }
}
~~~

| 数据 | 逻辑来源 | 用途 | 无效怎么办 |
|---|---|---|---|
| 天气描述 | 端侧 VLM 结构化结果 | 下雨/浓雾/下雪 | UNKNOWN、低质量、过期不触发 |
| 路面描述 | 端侧 VLM 结构化结果 | 湿滑/覆雪/结冰 | UNKNOWN、低质量、过期不触发 |
| 车速 | 端状态 | 行驶门槛 | UNKNOWN/过期不触发 |
| 驾驶模式 | 端状态 | 避免重复切换湿滑/雪地模式 | UNKNOWN 不触发/不执行 |
| 后雾灯 | 端状态 | 浓雾分支判断 | UNKNOWN 不触发/不执行 |
| 任务状态 | Step 5 | 所有分支第一道门 | 非 ENABLED 不触发 |

【待确认】正式 Signal ID、枚举、单位、频率、质量、时间戳和过期阈值。

### 7.6.9 Step 7：组成同一时刻的 SignalSnapshot

**人话**：Trigger 不能用刚识别的下雨和五分钟前的车速拼成 TRUE。

~~~jsonc
{
  "_example_only": true,
  "snapshot_ref": "DEMO-SNAPSHOT-150300-003",
  "assembled_at": "2026-09-04T15:03:00.150+08:00",
  "inputs": {
    "task_enabled": {
      "value": true,
      "state_version": 42,
      "producer_assignment_version": 7,
      "observed_at": "2026-09-04T15:03:00.000+08:00",
      "quality": "VALID"
    },
    "weather": {"value": "RAIN", "age_ms": 50, "quality": "VALID"},
    "road": {"value": "WET", "age_ms": 50, "quality": "VALID"},
    "speed_kmh": {"value": 46, "age_ms": 30, "quality": "VALID"},
    "drive_mode": {"value": "NORMAL", "age_ms": 30, "quality": "VALID"}
  },
  "snapshot_quality": "VALID"
}
~~~

| 谁/哪里 | 判断 | 输出 | 失败 |
|---|---|---|---|
| 端侧 Trigger | 每项存在、合法、新鲜；跨信号时间差可接受 | 只属于本轮计算的快照 | 任一关键项 UNKNOWN/STALE/INVALID，等待新数据 |

### 7.6.10 Step 8：三值规则计算

~~~text
RAIN/WET 分支 =
    任务有效
AND 车速 > 30 km/h
AND（天气 = RAIN OR 路面 = WET）
AND 当前驾驶模式 != WET_MODE
~~~

~~~jsonc
{
  "_example_only": true,
  "branch": "RAIN_OR_WET_TO_WET_MODE",
  "expression": {
    "AND": [
      {"EQ": ["task_enabled", true]},
      {"GT": ["speed_kmh", 30]},
      {"OR": [
        {"EQ": ["weather", "RAIN"]},
        {"EQ": ["road", "WET"]}
      ]},
      {"NE": ["drive_mode", "WET_MODE"]}
    ]
  },
  "snapshot_ref": "DEMO-SNAPSHOT-150300-003",
  "evaluation": "TRUE"
}
~~~

| 结果 | 含义 | 下一步 |
|---|---|---|
| TRUE | 数据明确且规则成立 | 进入时序治理 |
| FALSE | 数据明确但条件不满足 | 继续等待 |
| UNKNOWN | 缺失、过期或不可解释 | 不触发，等待可靠数据 |

【待确认】车速阈值是否跨车型统一；SLS 总开关是否是天气任务必需门禁。现有资料不足以默认加上 SLS 总开关。

### 7.6.11 Step 9：防抖、去重、频控

~~~text
防抖：避免单帧误识别
去重：避免同一场景每周期创建一次卡片
频控：避免拒绝或刚执行完又反复询问
~~~

~~~jsonc
{
  "_example_only": true,
  "debounce_demo": {
    "required_consecutive_true": 3,
    "note": "仅演示，不是定稿参数",
    "observations": [
      {"snapshot_ref": "DEMO-SNAPSHOT-150300-001", "evaluated_at": "2026-09-04T15:03:00.150+08:00", "result": "TRUE", "counter_after": 1},
      {"snapshot_ref": "DEMO-SNAPSHOT-150300-002", "evaluated_at": "2026-09-04T15:03:00.550+08:00", "result": "TRUE", "counter_after": 2},
      {"snapshot_ref": "DEMO-SNAPSHOT-150300-003", "evaluated_at": "2026-09-04T15:03:00.950+08:00", "result": "TRUE", "counter_after": 3}
    ],
    "current_counter": 3,
    "result": "STABLE_CANDIDATE"
  },
  "dedup_context": {
    "active_run_event_ref": null,
    "active_card_ref": null,
    "same_scene_already_handled": false,
    "cooldown_until": null
  },
  "decision": "ALLOW_NEW_RUN_EVENT"
}
~~~

| 谁/哪里 | 判断 | 输出 | 失败/抑制 |
|---|---|---|---|
| 端侧 Trigger | 稳定性、活动事件、同一 episode、冷却、交互优先级 | 唯一候选 | 不创建新事件并记录原因 |

上面的三条观察表示 Step 7—8 会随新数据重复运行三次，每次都重新组成快照和计算规则；不是拿同一帧重复计数。

【资料冲突】“连续 3 个周期”与部分材料划掉防抖的口径不一致，本例只演示状态变化，次数必须专项拍板。

### 7.6.12 Step 10：创建本次 RunEvent

~~~jsonc
{
  "_example_only": true,
  "run_event_ref": "DEMO-RUN-20260904-150301-001",
  "task_instance_ref": "DEMO-TASK-INSTANCE-7F21",
  "task_definition_ref": "DEMO-WEATHER-PROTECT",
  "definition_version": "DEMO-v12",
  "producer_assignment_version": 7,
  "branch": "RAIN_OR_WET_TO_WET_MODE",
  "trigger_snapshot_ref": "DEMO-SNAPSHOT-150300-003",
  "target_business_action": "SWITCH_TO_WET_MODE",
  "status": "WAITING_INTERACTION",
  "created_at": "2026-09-04T15:03:01+08:00",
  "interaction_expires_at": "TBD"
}
~~~

| 谁/哪里 | 判断 | 输出 | 失败 |
|---|---|---|---|
| 端侧 Trigger/天气业务 | 当前无重复活动事件，候选仍有效 | 贯穿后续链路的唯一事件 | 创建失败不拉卡；重复时幂等拒绝/复用 |

### 7.6.13 Step 11：Trigger 请求即时交互卡

~~~text
Trigger 不把车控命令给卡片。
Trigger 给的是：
“这是哪一次事件、为什么问、问什么、按钮代表什么、怎么播、语音回哪里、多久失效。”
~~~

~~~jsonc
{
  "_example_only": true,
  "business_context": {
    "task_definition_ref": "DEMO-WEATHER-PROTECT",
    "task_instance_ref": "DEMO-TASK-INSTANCE-7F21",
    "run_event_ref": "DEMO-RUN-20260904-150301-001",
    "source_type": "EDGE_TRIGGER",
    "branch": "RAIN_OR_WET_TO_WET_MODE",
    "interaction_mode": "REQUIRE_CONFIRMATION"
  },
  "content": {
    "title": "当前路面湿滑",
    "body": "是否切换到适合湿滑路面的驾驶模式？"
  },
  "actions": [
    {"semantic": "CONFIRM", "display_text": "切换"},
    {"semantic": "REJECT", "display_text": "暂不"}
  ],
  "tts": {
    "text": "当前天气路况不佳，是否为你调整驾驶模式？",
    "voice_disabled_fallback": "SHOW_CARD_ONLY"
  },
  "voice_route": "LOCAL_VISIBLE_SPEAK",
  "click_route": "RETURN_TO_ORIGINAL_BUSINESS",
  "interaction_expires_at": "TBD",
  "priority": "TBD",
  "callback_target": "ORIGINAL_WEATHER_BUSINESS"
}
~~~

卡片返回展示阶段：

~~~jsonc
{
  "_example_only": true,
  "run_event_ref": "DEMO-RUN-20260904-150301-001",
  "card_ref": "DEMO-CARD-8831",
  "display_state": "VISIBLE",
  "failure_reason": null,
  "occurred_at": "2026-09-04T15:03:01.400+08:00"
}
~~~

上面只是 `DisplayAck`。卡片还必须独立返回 `InteractionEvent` 与 `LifecycleEvent`；三类回调都要带同一个 run_event_ref 和 card_ref。需要授权的卡展示失败、排队过期或被替换时，本次不得降级为静默车控。

### 7.6.14 Step 12：卡片真正展示，注册可见即可说

**只有卡片成为当前最上层可交互页面，才允许接收针对它的“好的”。**

~~~jsonc
{
  "_example_only": true,
  "registration_scope": {
    "card_ref": "DEMO-CARD-8831",
    "run_event_ref": "DEMO-RUN-20260904-150301-001",
    "valid_only_while": "CURRENT_TOPMOST_CARD"
  },
  "elements": [
    {
      "element_ref": "DEMO-ELEMENT-CONFIRM",
      "display_text": "切换",
      "utterance_examples": ["切换", "好的", "可以"]
    },
    {
      "element_ref": "DEMO-ELEMENT-REJECT",
      "display_text": "暂不",
      "utterance_examples": ["暂不", "不用", "先不用"]
    }
  ]
}
~~~

这一跳的真实分工：

1. 页面/卡片业务暴露当前最上层页面的可交互元素；
2. 页面注册方维护语音表达与元素 ID 的映射；
3. 字节语音把指令集作为动态热词并负责 ASR/匹配；
4. 多个元素同名时，由注册方结合页面位置/上下文消歧；
5. 页面隐藏、刷新、关闭、过期时，旧映射注销。

【待确认】天气卡的页面注册 DRI、正式词表、注册/注销接口、冲突策略。

### 7.6.15 Step 13：用户说“好的”，ASR 与指令匹配

~~~jsonc
{
  "_example_only": true,
  "asr_result": {
    "text": "好的",
    "recognized_at": "2026-09-04T15:03:04.010+08:00",
    "route": "LOCAL_OR_ONLINE_PER_VOICE_POLICY"
  },
  "match_result": {
    "card_ref": "DEMO-CARD-8831",
    "matched_element_refs": ["DEMO-ELEMENT-CONFIRM"],
    "decision": "UNIQUE_MATCH"
  }
}
~~~

| 谁/哪里 | 判断 | 输出 | 失败 |
|---|---|---|---|
| 字节语音/车端语音链 | ASR 是否可靠，精确/模糊/本地匹配是否唯一 | 候选指令和元素 ID | 无结果不操作；多候选交注册方消歧 |

### 7.6.16 Step 14：页面复核并模拟点击

~~~jsonc
{
  "_example_only": true,
  "ui_operation": {
    "card_ref": "DEMO-CARD-8831",
    "run_event_ref": "DEMO-RUN-20260904-150301-001",
    "element_ref": "DEMO-ELEMENT-CONFIRM",
    "precheck": {
      "card_is_topmost": true,
      "card_not_expired": true,
      "element_still_exists": true,
      "match_is_unambiguous": true
    },
    "operation": "SIMULATED_CLICK",
    "result": "BUTTON_HANDLER_INVOKED"
  }
}
~~~

“模拟点击”不是 Trigger 接口：它只是像用户手指一样触发原卡片确认按钮，随后走和手点相同的卡片业务回调。卡片已隐藏、过期或页面变化时必须拒绝旧元素。

### 7.6.17 Step 15：卡片把用户结果还给 Trigger

~~~jsonc
{
  "_example_only": true,
  "card_ref": "DEMO-CARD-8831",
  "task_instance_ref": "DEMO-TASK-INSTANCE-7F21",
  "run_event_ref": "DEMO-RUN-20260904-150301-001",
  "user_result": "CONFIRM",
  "input_source": "VISIBLE_SPEAK_SIMULATED_CLICK",
  "occurred_at": "2026-09-04T15:03:04.050+08:00",
  "card_state": "CONSUMED"
}
~~~

天气原业务必须验证事件相同、卡片仍有效、结果未过期、尚未消费且明确 CONFIRM。验证通过后，不是直接车控，而是生成一次性执行凭证：

~~~jsonc
{
  "_example_only": true,
  "execution_proof": {
    "run_event_ref": "DEMO-RUN-20260904-150301-001",
    "decision_type": "USER_AUTHORIZATION",
    "authorization_ref": "DEMO-CARD-8831-CONFIRM",
    "created_at": "2026-09-04T15:03:04.060+08:00",
    "expires_at": "TBD",
    "consumed": false
  }
}
~~~

REJECT、CLOSE、TIMEOUT、INTERRUPTED、旧卡或重复回调均不生成 ExecutionProof，也不执行。

### 7.6.18 Step 16：执行前重新读取并复核

~~~text
允许执行 =
    当前 RunEvent 仍有效且未执行
AND 用户确认仍有效
AND 最新任务状态 = ENABLED
AND 最新 RunEvent 产生方 = EDGE 且 assignment_version 未变化
AND 最新车速 > 30 km/h
AND 最新（天气 = RAIN OR 路面 = WET）
AND 最新驾驶模式 != WET_MODE
AND 端侧安全门禁通过
~~~

~~~jsonc
{
  "_example_only": true,
  "run_event_ref": "DEMO-RUN-20260904-150301-001",
  "authorization": {
    "result": "CONFIRM",
    "authorization_ref": "DEMO-CARD-8831-CONFIRM",
    "run_event_ref": "DEMO-RUN-20260904-150301-001",
    "still_valid": true,
    "consumed": false
  },
  "fresh_snapshot": {
    "snapshot_ref": "DEMO-PRECHECK-SNAPSHOT-150304-001",
    "assembled_at": "2026-09-04T15:03:04.080+08:00",
    "task_enabled": {"value": true, "state_version": 42, "observed_at": "2026-09-04T15:03:04.060+08:00", "quality": "VALID"},
    "run_event_producer": {"value": "EDGE", "producer_assignment_version": 7, "quality": "VALID"},
    "weather": {"value": "RAIN", "observed_at": "2026-09-04T15:03:04.010+08:00", "quality": "VALID"},
    "road": {"value": "WET", "observed_at": "2026-09-04T15:03:04.010+08:00", "quality": "VALID"},
    "speed_kmh": {"value": 44, "observed_at": "2026-09-04T15:03:04.050+08:00", "quality": "VALID"},
    "drive_mode": {"value": "NORMAL", "observed_at": "2026-09-04T15:03:04.050+08:00", "quality": "VALID"},
    "all_required_inputs_fresh": true
  },
  "pre_execution_decision": "ALLOW"
}
~~~

如果用户确认后任务被关闭、车速下降、路况已恢复、目标模式已被手动切换或任何关键值 UNKNOWN，则 DENY，不发车控。

### 7.6.19 Step 17：调用赛力斯车控

~~~jsonc
{
  "_example_only": true,
  "run_event_ref": "DEMO-RUN-20260904-150301-001",
  "business_goal": "SWITCH_DRIVE_MODE",
  "target_state": "WET_MODE",
  "idempotency_key": "DEMO-RUN-20260904-150301-001:WET_MODE",
  "requested_at": "2026-09-04T15:03:04.100+08:00",
  "request_expires_at": "TBD"
}
~~~

~~~jsonc
{
  "_example_only": true,
  "run_event_ref": "DEMO-RUN-20260904-150301-001",
  "idempotency_key": "DEMO-RUN-20260904-150301-001:WET_MODE",
  "request_ref": "DEMO-WEATHER-CTRL-5001",
  "command_acceptance": "ACCEPTED",
  "accepted_at": "2026-09-04T15:03:04.120+08:00",
  "note": "这里只代表车控层接收，不代表真实驾驶模式已改变"
}
~~~

【待确认】正式车控能力、参数、权限、安全门禁、ACK、超时、重试和错误语义。

### 7.6.20 Step 18：读取真实车辆状态

~~~jsonc
{
  "_example_only": true,
  "run_event_ref": "DEMO-RUN-20260904-150301-001",
  "target": {"drive_mode": "WET_MODE"},
  "readback_observations": [
    {"observed_at": "2026-09-04T15:03:04.150+08:00", "drive_mode": "NORMAL"},
    {"observed_at": "2026-09-04T15:03:04.650+08:00", "drive_mode": "WET_MODE"}
  ],
  "final_business_result": "SUCCEEDED_BY_TRUE_STATE"
}
~~~

RPC 成功但状态一直是 NORMAL，则最终是 FAILED 或 UNKNOWN，绝不能展示“已切换”。

### 7.6.21 Step 19：更新卡片、Runtime 日志和长期任务

~~~jsonc
{
  "_example_only": true,
  "run_completion": {
    "task_instance_ref": "DEMO-TASK-INSTANCE-7F21",
    "run_event_ref": "DEMO-RUN-20260904-150301-001",
    "run_status": "SUCCEEDED",
    "card_update": {
      "message": "已切换到湿滑模式",
      "truth_source": "VEHICLE_STATE_READBACK"
    },
    "next_runtime_state": "COOLDOWN_THEN_WAITING"
  },
  "long_term_task": {
    "effective_state": "ENABLED",
    "note": "一次运行结束，不等于长期任务关闭"
  }
}
~~~

UI 更新失败不能触发第二次车控。旧卡片、旧元素映射和旧授权全部失效；天气任务仍保持开启，冷却结束后等待新的独立 scene/episode。

任务中心是否展示这一次运行结果或长期历史，属于任务中心范围待确认项；即使不展示，也不能省略 Runtime 运行日志与排障证据。

### 7.6.22 另外两条天气分支怎样替换

| 分支 | 触发条件核心 | 共同治理门禁 | 交互与执行凭证 | 目标动作 | 执行前重读与成功真相 |
|---|---|---|---|---|---|
| 雨/湿滑 | 任务有效 + 车速门槛 +（天气=RAIN 或路面=WET）+ 当前非湿滑模式 | 数据有效/同时间窗、防抖、同 episode 去重、频控、唯一 producer | REQUIRE_CONFIRMATION；有效 CONFIRM 形成 authorization_ref | 切换 WET_MODE | 重读任务/天气路面/车速/模式/凭证；真实模式=WET_MODE |
| 雪/结冰 | 任务有效 + 车速门槛 +（天气=SNOW 或路面=SNOW/ICE）+ 当前非雪地模式 | 同上 | 同上 | 切换 SNOW_MODE | 重读任务/天气路面/车速/模式/凭证；真实模式=SNOW_MODE |
| 浓雾 | 任务有效 + 车速门槛 + 天气=DENSE_FOG + 后雾灯=OFF | 同上 | 同上 | 打开后雾灯 | 重读任务/浓雾/车速/灯/凭证；真实后雾灯=ON |

正式枚举、阈值、时效、文案和动作能力均待信号/车控专项确认。

### 7.6.23 天气链逐步责任总表

下面这张表用于评审逐行点名。上面的 JSON 是“数据长什么样”，这张表是“谁要接住这一跳”。

| Step | 谁负责 | 在哪里做 | 收到什么 | 判断什么 | 输出什么 | 失败怎么办 |
|---|---|---|---|---|---|---|
| 1 定义/发布 | 产品 + 配置/发布 + 各能力 Owner | PRD、配置后台或端侧发版流程 | 任务规则、车型、能力依赖 | 能力是否真实存在、版本是否完整 | 同版本 DisplayMetadata + RuntimeDefinition；Assignment 独立产生 | 缺能力/回读/Owner 或半发布则拦截/保持旧版 |
| 2 展示 | 任务中心 + 接入业务 | 车机 HMI | 展示元数据、适用范围、真实状态 | 当前车型是否适用、状态是否明确 | 可见任务条目 | UNKNOWN 不假显示开启 |
| 3 开启意图 | 任务中心 | 车机 HMI | 用户点击 | 是否可操作、是否重复 | OperationRequest：task/scope/desired_state/operation_ref | 超时/失败按真实 OperationResult 回滚，不直接改真状态 |
| 4 保存真状态 | 状态承载方 | 物理模块 TBD | OperationRequest | 鉴权、幂等、车型、持久化 | OperationResult→HMI；TaskInstanceState→状态同步层 | 保持原状态并回失败 |
| 5 状态到 Trigger | 状态同步层 + Trigger | 端侧 | 启动快照/增量变化、定义版本、RuntimeAssignment | 快照完整、新旧顺序、是否 ENABLED、producer 是否 EDGE | READY/Waiting | UNKNOWN/SYNCING、漏消息、版本跳跃或冲突→BLOCKED/重同步 |
| 6 订阅数据 | Trigger + VLM/状态域 | 端侧 | 天气、路面、车速、模式、灯 | 来源、枚举、质量是否可用 | 原始观察值 | 缺失/旧值不参与 TRUE |
| 7 组成快照 | Trigger | 端侧 | 各观察值及时间戳 | 单项时效、跨信号时间差 | SignalSnapshot | 任一关键项 UNKNOWN/STALE 则等待 |
| 8 规则计算 | Trigger | 端侧 | 同一快照 | AND/OR、阈值、目标状态 | TRUE/FALSE/UNKNOWN | FALSE 等待；UNKNOWN 不触发 |
| 9 时序治理 | Trigger | 端侧 | 连续规则结果、活动事件、冷却 | 防抖、去重、频控、处理中锁 | ALLOW_NEW_RUN_EVENT | 抑制并记录原因 |
| 10 创建事件 | 唯一 RunEvent producer（本例 Trigger） | 端侧 | 稳定候选、快照、定义/产生权版本 | 是否已有同场景活动事件 | 唯一 run_event_ref | 冲突时不出卡并告警 |
| 11 请求卡片 | Trigger/天气原业务 | 端侧→VUI | task/instance/RunEvent、InteractionMode、文案、按钮、TTS、路由、有效期 | 请求是否完整、事件仍有效 | InteractionRequest | 拉卡失败结束本轮，不车控 |
| 12 真正展示 | 即时交互卡/VUI + 页面注册方 | 车机前台 | InteractionRequest | 准入、排队、是否成为顶层有效卡 | DisplayAck=VISIBLE + card_ref + VAS 元素注册；后续独立生命周期事件 | 排队过期/被替换则 LifecycleEvent 回原业务并注销 |
| 13 语音匹配 | 字节语音/ASR + 匹配 | 端侧语音链 | 用户语音、当前元素集 | ASR 是否可靠、是否唯一命中 | 候选 element_ref | 无结果/歧义不操作 |
| 14 模拟点击 | 页面/卡片执行方 | 当前 VUI | element_ref、card_ref、run_event_ref | 卡仍顶层、元素仍存在、未过期 | 原按钮处理被调用 | 状态变化则拒绝旧元素 |
| 15 返回选择/形成凭证 | 即时交互卡→天气原业务 | 车机进程间合同 TBD | DisplayAck、InteractionEvent、LifecycleEvent | 同事件、卡有效、未过期、未消费、是否明确 CONFIRM | ExecutionProof.authorization_ref | REJECT/CLOSE/TIMEOUT/旧事件均不生成凭证 |
| 16 执行前复核 | Trigger/端侧执行 | 端侧 | ExecutionProof、最新任务/定义/产生权/天气/车况 | 所有门禁此刻仍成立，凭证未消费 | ALLOW/DENY + 原因 | 任一变化立即 DENY；NOTIFY_ONLY 不得进入 |
| 17 车控 | 赛力斯车控 | 端侧 | 目标动作、幂等键、有效期 | 能力、权限、安全门禁、是否重复 | request_ref + ACK/拒绝 | 明确失败；ACK 不报成功 |
| 18 真实回读 | 赛力斯状态域 + 原业务 | 端侧 | request_ref、目标状态、观察窗口 | 真实模式/灯是否达到目标 | SUCCESS/FAILED/UNKNOWN | 未达标/超时不假成功 |
| 19 收口 | 原业务 + 卡片 + Runtime 日志 | 端侧；任务中心展示 TBD | 真实状态结果、全链路事件 | 结果是否属于当前 RunEvent | 卡片终态、事件终态、冷却 | UI 更新失败不重做车控；清理旧授权 |

## 7.7 云端/端云混合完整示例：识别充电设备后打开充电口盖

### 7.7.1 先固定这一次演示场景

~~~text
演示时间：2026-09-04 18:25:00
车辆：DEMO-VEHICLE-MASKED
长期任务：识别充电设备后打开充电口盖，真实状态 ENABLED
主动服务总开关：ENABLED（是否为正式必需门禁待确认）
车辆：从 D 挡切入 P 挡，车速 0 km/h，SOC 18%，口盖 CLOSED
云端目标：判断当前环境中是否存在可用的充电设备
DT/VQA 结果：FOUND，且属于本次事件、未过期
用户：在卡片上确认“打开”
最终：端侧复核通过，真实口盖状态由 CLOSED 变为 OPEN
~~~

SOC 20%、卡片有效期、推理有效期和按钮文案均为当前材料/演示值，必须在专项中定稿。

### 7.7.2 先分清四个结果

| 结果 | 它证明什么 | 它不能证明什么 |
|---|---|---|
| 硬 Trigger 命中 | 现在值得启动一次充电场景判断 | 不证明附近有充电设备 |
| DT/VQA = FOUND | 本次视觉证据判断存在约定范围内的充电设备 | 不证明用户同意，不证明车仍停稳 |
| 卡片 = CONFIRM | 用户只授权当前 RunEvent 尝试开盖 | 不证明车控成功 |
| 真实口盖 = OPEN | 车辆实际完成开盖 | 唯一可向用户展示“已打开”的成功依据 |

### 7.7.3 为什么它是端云混合

- P 挡、车速、SOC、口盖等原始状态来自车端，最终安全复核必须在车端完成；硬条件最终由端侧还是 Cloud Trigger 消费仍待确认；
- 硬条件先过滤，避免每次都调模型、出卡；“车辆停稳”是否也作为模型调用前的节流条件待业务与架构确认；
- “附近是否真的有充电设备”需要 DT/VQA 或端侧视觉能力，适合由云端编排；
- 卡片始终在车机 VUI 展示；云端原业务/Planner 链按最终卡型收集并校验本次授权；
- 推理和授权可能过期，所以最终必须回端侧重新读取车况、车控和回读。

### 7.7.4 总流程

> 下图是本 PRD 建议的目标业务逻辑和演示链，不是当前已实现部署图。硬 Trigger 位置、卡型、上下文 Owner、端云接口仍以图中和正文的待确认项为准。

~~~mermaid
flowchart TD
    A["0 产品定义充电任务模板"] --> B["1 任务中心展示并承接开启意图"]
    B --> C["2 状态真源保存 ENABLED"]
    C --> D["3 运行时取启动快照并接收变化"]
    D --> E["4 车端产生切入 P 挡原始事件"]
    E --> F["5 唯一硬 Trigger 读取 P/SOC/口盖/总开关<br/>Trigger 最终在端或云待确认"]
    F --> G{"条件、时效、去重、频控通过?"}
    G -- 否/UNKNOWN --> X1["结束本轮，不调模型"]
    G -- 是 --> H["6 唯一 producer 创建 RunEvent<br/>先得到本次业务流水号"]
    H --> H2["6B 原业务基于该 RunEvent 生成推荐 Query<br/>Query 必须携带 run_event_id"]
    H2 --> I["7 主动推荐/Static Advisor 准入"]
    I --> J["8 调用 DT"]
    J --> K["9 DT/VQA 获取本车本事件视觉证据"]
    K --> L["10 返回 FOUND/NOT_FOUND/UNKNOWN/ERROR"]
    L --> M{"11 result=FOUND，且属于本事件、明确、未过期?"}
    M -- FOUND 且有效 --> N["12 原业务生成云端链路即时交互卡请求"]
    M -- NOT_FOUND --> X2A["正常结束：未发现设备，不出卡"]
    M -- UNKNOWN/ERROR --> RETRY{"同一事件未过期且重试预算允许?"}
    RETRY -- 是 --> J
    RETRY -- 否 --> X2B["失败结束，不出卡"]
    M -- 旧结果/串车 --> X2C["丢弃结果并取消本轮，不出卡"]
    N --> O{"13A VUI 是否真正展示<br/>DisplayAck=VISIBLE?"}
    O -- 否/排队超时/展示失败 --> X6["卡片未生效：不接收本轮授权，不执行"]
    O -- 是 --> O2{"13B 云端上下文 Owner 是否完成绑定<br/>run_event_id + card_id + 有效期?"}
    O2 -- 否 --> X6
    O2 -- 是 --> P{"14 用户输入"}
    P -- 点击 --> P1["按最终卡型返回按钮事件"]
    P -- 语音 --> P2["Planner 结合当前卡片上下文理解"]
    P1 --> Q0{"15 原业务校验同一 RunEvent、<br/>未过期、未消费且结果=CONFIRM?"}
    P2 --> Q0
    Q0 -- 否/拒绝/关闭/超时/歧义 --> X4["不授权，不执行"]
    Q0 -- 是 --> Q["15 生成 ExecutionProof.authorization_ref<br/>只属于本 RunEvent、动作范围受限且一次性"]
    Q --> R["16 下发 ExecutionRequest<br/>必须携带有效 authorization_ref；正式发送方/协议 TBD"]
    R --> S["17 端侧重读最新状态与时效"]
    S --> T{"复核通过?"}
    T -- 否 --> X3["拒绝执行并回原因"]
    T -- 是 --> U["18 赛力斯车控打开口盖"]
    U --> V["19 读取真实口盖状态"]
    V --> V1{"真实口盖=OPEN?"}
    V1 -- 是 --> W["20 更新卡片、上下文、RunEvent、日志和冷却"]
    V1 -- 否/超时/UNKNOWN --> X5["最终 FAILED/UNKNOWN，不显示已打开"]
    X1 --> END["RunEvent 终态/本轮结束<br/>清理卡片与上下文，记录原因；长期任务继续等待"]
    X2A --> END
    X2B --> END
    X2C --> END
    X3 --> END
    X4 --> END
    X5 --> END
    X6 --> END
    W --> END
~~~

### 7.7.5 Step 0：定义完整任务模板

~~~jsonc
{
  "_example_only": true,
  "task_definition_ref": "DEMO-CHARGE-PORT",
  "definition_version": "DEMO-v1",
  "display": {
    "title": "识别充电设备后打开充电口盖",
    "description": "低电量停车后，识别充电设备并询问是否开盖"
  },
  "processing_topology": "HYBRID",
  "run_event_producer": "TBD_EDGE_OR_CLOUD",
  "activation_event": "GEAR_CHANGED_TO_P",
  "hard_conditions": [
    "task_enabled == true",
    "ai_proactive_service_enabled == true",
    "soc_percent <= 20",
    "charge_port_state == CLOSED"
  ],
  "cloud_judgment": "ACTIVE_RECOMMENDATION_TO_DT_VQA",
  "interaction": "CARD_AND_TTS_REQUIRE_CONFIRM",
  "action": "OPEN_CHARGE_PORT",
  "completion_truth": "REAL_CHARGE_PORT_STATE == OPEN"
}
~~~

| 谁/哪里 | 判断 | 输出 | 失败 |
|---|---|---|---|
| 产品 + Trigger/VUI/DT/车控 Owner；PRD/发布流程 | 依赖、端云位置、交互、安全和验收是否齐全 | 版本化模板 | 缺任一关键能力禁止发布 |

【待确认】统一配置平台承载范围、硬 Trigger 最终部署、正式任务 ID。

### 7.7.6 Step 1—3：任务中心、真实状态与运行时恢复

这三步与第 7.5 节公共链完全相同，但充电任务还要确定“任务有效开关”和“主动服务总开关”是否为两个独立门禁。

> 本节的 task_instance_ref、run_event_ref 只是产品关联语义，不代表复用动态任务 Task Service。当前没有证据证明系统预设任务已接入 Task Service，正式接入路径仍待确认。

~~~jsonc
{
  "_example_only": true,
  "task_instance_ref": "DEMO-CHARGE-INSTANCE-01",
  "task_definition_ref": "DEMO-CHARGE-PORT",
  "effective_state": "ENABLED",
  "state_version": 15,
  "definition_version": "DEMO-v1",
  "processing_topology": "HYBRID",
  "run_event_producer": "TBD_EDGE_OR_CLOUD",
  "producer_assignment_version": "TBD",
  "recovery_state": "READY"
}
~~~

为了把后续“云端产生事件并下发端侧”的字段讲具体，Step 6—20 的伪数据临时假设 `run_event_producer=CLOUD`、`producer_assignment_version=18`。这只是演示分支，不是当前结论：若专项最终选择 EDGE，则由端侧先创建同一个 RunEvent，再把携带事件关联的 Query 交给云端协作，云端不能再创建第二个事件。

必须确认：

1. 任务中心是否有充电任务的启停控件；
2. 用户操作交给哪个接入业务；
3. 真实状态谁保存；
4. 硬 Trigger 由端侧还是云端运行，也就是本次 RunEvent 唯一由哪一侧创建；在该项为 TBD 时不得进入量产双跑；
5. 主动服务总开关由谁提供、关闭后在哪几层阻断；
6. 上电、重连、重启后怎样恢复状态。

### 7.7.7 Step 4：产生“切入 P 挡”激活事件

~~~jsonc
{
  "_example_only": true,
  "event_type": "GEAR_TRANSITION",
  "from": "D",
  "to": "P",
  "observed_at": "2026-09-04T18:25:00.000+08:00",
  "source": "SERES_GEAR_SIGNAL_TBD",
  "quality": "VALID"
}
~~~

这里要的是变化事件 D→P，还是“当前保持 P”状态必须专项确认。两者会直接影响重复触发：如果只判断当前 P 挡，每个周期都可能重新创建候选。

### 7.7.8 Step 5：硬 Trigger 组成快照并过滤

~~~jsonc
{
  "_example_only": true,
  "snapshot_ref": "DEMO-CHARGE-SNAPSHOT-9081",
  "assembled_at": "2026-09-04T18:25:00.150+08:00",
  "task_enabled": {"value": true, "state_version": 15},
  "ai_proactive_service_enabled": {"value": true, "source": "TBD"},
  "gear_transition": {"value": "D_TO_P", "age_ms": 150},
  "gear": {"value": "P", "age_ms": 20},
  "vehicle_speed_kmh": {"value": 0, "age_ms": 40},
  "soc_percent": {"value": 18, "age_ms": 120},
  "charge_port_state": {"value": "CLOSED", "age_ms": 90},
  "parking_cycle_ref": "DEMO-PARKING-CYCLE-7842",
  "dedup_state": "NOT_PROCESSED"
}
~~~

~~~text
硬候选 =
    任务有效
AND 主动服务总开关有效（若专项确认需要）
AND 发生约定的切入 P 挡事件
AND SOC <= 20%
AND 充电口盖 = CLOSED
AND 同一停车周期尚未处理
AND 所有关键数据新鲜且有效
~~~

| 结果 | 后续 |
|---|---|
| TRUE | 进入防抖、去重、频控治理；全部通过后由唯一 producer 创建 RunEvent；创建成功后原业务再生成同事件 Query |
| FALSE | 本轮结束 |
| UNKNOWN/STALE | 不调用模型，等待可靠数据或下个激活事件 |

【待确认】SOC 阈值、停稳标准、总开关、每项数据时效、停车周期边界、Trigger 位置。

【产品建议，待业务确认】车速/停稳状态可以在硬 Trigger 阶段用于节流，减少无意义模型调用；但在当前资料没有定稿前，它不是已确认的候选硬门禁。无论是否前置，端侧执行前都必须按正式停稳条件重新复核。

### 7.7.9 Step 6：先创建 RunEvent；成功后再生成业务 Query

~~~text
硬条件命中
→ 时效、防抖、去重、频控全部通过
→ 唯一 producer 创建本次 RunEvent
→ RunEvent 创建成功后，原业务才把目标改写为携带该 run_event_ref 的业务 Query
→ 这仍然不是用户授权
~~~

~~~jsonc
{
  "_example_only": true,
  "run_event": {
    "event_type": "PRESET_TASK_CANDIDATE",
    "task_definition_ref": "DEMO-CHARGE-PORT",
    "task_instance_ref": "DEMO-CHARGE-INSTANCE-01",
    "run_event_ref": "DEMO-CHARGE-RUN-001",
    "parking_cycle_ref": "DEMO-PARKING-CYCLE-7842",
    "created_at": "2026-09-04T18:25:00.180+08:00",
    "valid_until": "TBD",
    "snapshot_ref": "DEMO-CHARGE-SNAPSHOT-9081"
  },
  "business_query_created_after_run_event": {
    "run_event_ref": "DEMO-CHARGE-RUN-001",
    "query": "帮我看一下附近有没有充电设备；如果识别到，再询问我是否打开充电口盖",
    "query_origin": "SYSTEM_PRESET_TASK",
    "is_user_authorization": false,
    "created_at": "2026-09-04T18:25:00.190+08:00"
  }
}
~~~

Query 是给云端的工作目标，不能被执行层当成用户说过的话，也不能直接触发开盖。

### 7.7.10 Step 7：主动推荐/Static Advisor 准入

~~~jsonc
{
  "_example_only": true,
  "request": {
    "run_event_ref": "DEMO-CHARGE-RUN-001",
    "query": "帮我看一下附近有没有充电设备；如果识别到，再询问是否开盖",
    "snapshot_ref": "DEMO-CHARGE-SNAPSHOT-9081"
  },
  "response": {
    "accepted": true,
    "recommendation_context_ref": "DEMO-REC-CONTEXT-3102",
    "decision": "CONTINUE_TO_DT",
    "reason": "POLICY_ACCEPTED"
  }
}
~~~

| 谁/哪里 | 判断 | 输出 | 失败 |
|---|---|---|---|
| 主动推荐/Static Advisor；云端 | 候选是否过期、频控、冲突、交互优先级 | 继续到 DT 或抑制原因 | 被抑制/超时则结束本次，端侧不能自行开盖 |

【待确认】主动推荐与 Static Advisor 的正式组件关系、事件持有者、ACK 与超时。

### 7.7.11 Step 8—9：DT 组织当前车辆的视觉判断

~~~jsonc
{
  "_example_only": true,
  "dt_request": {
    "run_event_ref": "DEMO-CHARGE-RUN-001",
    "recommendation_context_ref": "DEMO-REC-CONTEXT-3102",
    "goal": "判断当前车辆附近是否存在可用于本次充电场景的充电设备",
    "requested_observation": "CURRENT_VEHICLE_CURRENT_EVENT",
    "valid_until": "TBD"
  }
}
~~~

DT/VQA 请求必须把车辆、事件和时间范围关联起来。不能用另一辆车、上一停车周期或“最后一帧但没有时间”的图像。

| 谁/哪里 | 收到 | 判断 | 输出 | 失败 |
|---|---|---|---|---|
| DT/Agent 编排；云端 | 业务目标、RunEvent、允许工具 | 需要哪种 VQA/视觉能力，请求是否仍有效 | 视觉工具请求 | 工具不可用/超时 → ERROR |
| VQA/端侧视觉链 | 本车本事件的观察请求 | 画面可用、时间匹配、质量足够 | 结构化观察证据 | 无画面/过期/质量不足 → UNKNOWN/ERROR |

【待确认】图片/特征怎样上行、是否由端侧 VQA 执行、隐私合规、最大时效、缓存策略。

### 7.7.12 Step 10：DT/VQA 返回结构化结果

~~~jsonc
{
  "_example_only": true,
  "inference_ref": "DEMO-DT-RESULT-001",
  "run_event_ref": "DEMO-CHARGE-RUN-001",
  "vehicle_ref": "DEMO-VEHICLE-MASKED",
  "result": "FOUND",
  "object_type": "CHARGING_DEVICE",
  "evidence_observed_at": "2026-09-04T18:25:00.900+08:00",
  "result_created_at": "2026-09-04T18:25:01.250+08:00",
  "valid_until": "TBD",
  "quality_or_confidence": "TBD"
}
~~~

至少要有四个结果：

| 结果 | 后续 |
|---|---|
| FOUND | 通过时效/关联校验后才可出确认卡 |
| NOT_FOUND | 本次结束，不开盖 |
| UNKNOWN | 证据不足，不开盖；是否告知用户待产品确认 |
| ERROR | 技术失败，不开盖；按受控策略记录/重试 |

### 7.7.13 Step 11：原业务校验推理结果

~~~text
允许出卡 =
    result = FOUND
AND vehicle_ref = 当前车辆
AND run_event_ref = 当前活动事件
AND 结果和视觉证据未过期
AND 任务仍开启
AND RunEvent 产生权代次仍有效
AND 本事件尚未出过活动卡
~~~

不满足时结束本次。尤其不能因为旧结果曾经 FOUND，就给新的 P 挡事件出卡。

### 7.7.14 Step 12：生成云端即时交互卡请求

~~~jsonc
{
  "_example_only": true,
  "task_definition_ref": "DEMO-CHARGE-PORT",
  "task_instance_ref": "DEMO-CHARGE-INSTANCE-01",
  "run_event_ref": "DEMO-CHARGE-RUN-001",
  "source_type": "CLOUD_PRESET_TASK",
  "interaction_mode": "REQUIRE_CONFIRMATION",
  "inference_ref": "DEMO-DT-RESULT-001",
  "content": {
    "title": "发现充电设备",
    "body": "是否为你打开充电口盖？"
  },
  "actions": [
    {"element_ref": "DEMO-OPEN", "semantic": "CONFIRM", "display_text": "打开"},
    {"element_ref": "DEMO-CANCEL", "semantic": "REJECT", "display_text": "暂不"}
  ],
  "tts": {"policy": "TBD", "text": "发现附近有充电设备，是否打开充电口盖？"},
  "voice_route": "CLOUD_PLANNER_WITH_CARD_CONTEXT",
  "click_route": "TBD_BY_CARD_TYPE",
  "interaction_expires_at": "TBD",
  "priority": "TBD",
  "callback_target": "ORIGINAL_CHARGE_BUSINESS"
}
~~~

与端侧天气的差别：

- 天气卡语音走本地可见即可说；
- 本 PRD 推荐充电云端卡把当前卡片上下文交给 Planner 处理语音；最终是否采用由卡型专项确认；
- 点击按最终选定卡型可能直回原业务，也可能形成模拟 Query；必须专项选一条；
- 无论哪种路径，最终都要让原业务拿到同一 RunEvent 的标准结果。

### 7.7.15 Step 13：卡片展示与云端上下文建立（两个责任动作）

#### Step 13A：VUI 准入、排队并真正展示卡片

~~~jsonc
{
  "_example_only": true,
  "run_event_ref": "DEMO-CHARGE-RUN-001",
  "card_ref": "DEMO-CARD-7701",
  "display_state": "VISIBLE",
  "failure_reason": null,
  "occurred_at": "2026-09-04T18:25:02.000+08:00"
}
~~~

排队不等于展示。只有 VISIBLE 后，卡片才进入等待用户状态并启动交互有效期。展示失败/排队过期时不得执行。

VUI 负责准入、排队、真正展示、TTS和卡片生命周期，并分别返回 DisplayAck 与 LifecycleEvent；它不负责建立 Planner 业务上下文，也不负责判断是否开盖。

#### Step 13B：云端上下文 Owner 绑定本次可见卡片

只有收到 `DisplayAck=VISIBLE` 后，云端上下文 Owner 才能建立本轮可用上下文：

~~~jsonc
{
  "_example_only": true,
  "planner_context_ref": "DEMO-CARD-CONTEXT-7701",
  "run_event_ref": "DEMO-CHARGE-RUN-001",
  "card_ref": "DEMO-CARD-7701",
  "title": "发现充电设备",
  "body": "是否为你打开充电口盖？",
  "actions": ["CONFIRM", "REJECT"],
  "reason": "系统预设充电任务命中",
  "expires_at": "TBD"
}
~~~

【待确认】上下文由云端原业务、Planner 还是动态工具层持有和销毁，需要随最终卡型专项拍板。上下文绑定失败、卡片不再可见、被替换或过期时，语音结果不得形成授权。

### 7.7.16 Step 14：承接用户选择（点击与语音两条输入）

#### Step 14A：用户点击

~~~jsonc
{
  "_example_only": true,
  "run_event_ref": "DEMO-CHARGE-RUN-001",
  "card_ref": "DEMO-CARD-7701",
  "element_ref": "DEMO-OPEN",
  "semantic": "CONFIRM",
  "input_source": "MANUAL_CLICK"
}
~~~

【待确认】充电最终采用哪类 VUI 卡片：

- 候选② Static Advisor 卡：语音进入 Planner；当前 VUI 资料中的点击路径可形成模拟 Query 回云；
- 候选③ 系统通知/三方调用卡：语音借 Planner/动态选择能力理解，点击直接回原业务并同步 Planner 卡片已消费；
- 产品底线是不论卡型，原业务都必须拿到本次 RunEvent 的标准结果，不能只拿无上下文的“打开”。

#### Step 14B：用户语音回答

~~~jsonc
{
  "_example_only": true,
  "user_query": "可以，打开吧",
  "card_context": {
    "run_event_ref": "DEMO-CHARGE-RUN-001",
    "title": "发现充电设备",
    "content": "是否为你打开充电口盖？",
    "buttons": ["打开", "暂不"],
    "reason": "系统预设充电任务命中"
  }
}
~~~

Planner 结果：

~~~jsonc
{
  "_example_only": true,
  "run_event_ref": "DEMO-CHARGE-RUN-001",
  "selected_semantic": "CONFIRM",
  "selected_element": "DEMO-OPEN",
  "result": "CLEAR_SELECTION"
}
~~~

【产品期望，待 Planner/VUI 确认】如果用户说“什么充电设备？”“为什么要开？”等追问，希望 Planner 能结合卡片上下文回答；无论是否支持追问，未得到明确 CONFIRM 前都不能形成车控授权。

### 7.7.17 Step 15：原业务形成一次性 ExecutionProof

~~~jsonc
{
  "_example_only": true,
  "execution_proof": {
    "task_definition_ref": "DEMO-CHARGE-PORT",
    "task_instance_ref": "DEMO-CHARGE-INSTANCE-01",
    "run_event_ref": "DEMO-CHARGE-RUN-001",
    "card_ref": "DEMO-CARD-7701",
    "decision_type": "USER_AUTHORIZATION",
    "selection": "CONFIRM",
    "input_type": "CLICK_OR_PLANNER_VOICE",
    "authorization_ref": "DEMO-CARD-7701-CONFIRM",
    "authorized_at": "2026-09-04T18:25:04.000+08:00",
    "expires_at": "TBD",
    "consumed": false
  }
}
~~~

原业务需要同时消费 DisplayAck、InteractionEvent 与 LifecycleEvent，确认卡片仍有效且本次结果未消费。无事件、歧义、过期、重复、关闭、超时全部不生成 ExecutionProof。CONFIRM 只授权本次事件的一次开盖，不能变成以后所有充电场景的长期授权。

### 7.7.18 Step 16：云端下发一次性端侧执行请求【产品建议】

~~~jsonc
{
  "_example_only": true,
  "task_definition_ref": "DEMO-CHARGE-PORT",
  "task_instance_ref": "DEMO-CHARGE-INSTANCE-01",
  "run_event_ref": "DEMO-CHARGE-RUN-001",
  "action": "OPEN_CHARGE_PORT",
  "inference_ref": "DEMO-DT-RESULT-001",
  "execution_proof": {
    "authorization_ref": "DEMO-CARD-7701-CONFIRM",
    "silent_policy_decision_ref": null
  },
  "definition_version": "DEMO-v1",
  "producer_assignment_version": 18,
  "scope": {
    "vehicle_ref": "DEMO-VEHICLE-MASKED",
    "account_ref": "DEMO-ACCOUNT-MASKED"
  },
  "requested_at": "2026-09-04T18:25:04.030+08:00",
  "execute_before": "TBD",
  "fencing_token": "DEMO-ASSIGNMENT-18-FENCE",
  "idempotency_key": "DEMO-CHARGE-RUN-001:OPEN_CHARGE_PORT"
}
~~~

下发失败可以受控重试，但网络恢复后不得执行已经过期的请求。

当前资料没有给出正式发送方、Push/Pull、ACK 或重试协议；本步骤定义的是产品必须具备的端云交接语义，技术专项需要补齐实际时序。

端侧接收时必须同时校验 definition_version、producer_assignment_version、车辆/账号 scope、ExecutionProof 和等价 fencing 语义。这样即使旧云请求在网络恢复后迟到，也不能穿越到新版本、新车辆范围或新产生权代次执行。

### 7.7.19 Step 17：端侧重新读取最新状态

~~~text
端侧允许执行 =
    当前任务仍 ENABLED
AND 主动服务总开关仍满足（若确定为门禁）
AND RunEvent 产生权代次与 fencing 仍允许本请求
AND 最新挡位 = P
AND 最新车速满足停稳标准
AND 最新口盖 = CLOSED
AND DT 结果未过期且属于同一事件
AND 用户授权未过期且属于同一事件
AND 当前车型支持动作
AND 幂等键未执行
~~~

~~~jsonc
{
  "_example_only": true,
  "run_event_ref": "DEMO-CHARGE-RUN-001",
  "latest_at": "2026-09-04T18:25:04.080+08:00",
  "task_enabled": {"value": true, "state_version": 15, "quality": "VALID"},
  "run_event_producer": {"value": "CLOUD", "producer_assignment_version": 18, "fencing_token_valid": true},
  "ai_proactive_service_enabled": {"value": true, "observed_at": "2026-09-04T18:25:04.060+08:00", "quality": "VALID"},
  "gear": {"value": "P", "observed_at": "2026-09-04T18:25:04.065+08:00", "quality": "VALID"},
  "vehicle_speed_kmh": {"value": 0, "observed_at": "2026-09-04T18:25:04.065+08:00", "quality": "VALID"},
  "charge_port_state": {"value": "CLOSED", "observed_at": "2026-09-04T18:25:04.070+08:00", "quality": "VALID"},
  "inference_fresh": {"value": true, "inference_ref": "DEMO-DT-RESULT-001"},
  "authorization_fresh": {"value": true, "authorization_ref": "DEMO-CARD-7701-CONFIRM"},
  "already_executed": false,
  "decision": "ALLOW"
}
~~~

任何一项不满足即 DENY，并把原因回云端和卡片。云端不能要求端侧跳过复核。

### 7.7.20 Step 18：赛力斯车控

~~~jsonc
{
  "_example_only": true,
  "vehicle_control_command": {
    "run_event_ref": "DEMO-CHARGE-RUN-001",
    "idempotency_key": "DEMO-CHARGE-RUN-001:OPEN_CHARGE_PORT",
    "capability": "OPEN_CHARGE_PORT",
    "target_state": "OPEN",
    "sent_at": "2026-09-04T18:25:04.100+08:00"
  },
  "rpc_response": {
    "accepted": true,
    "request_ref": "DEMO-CTRL-9011",
    "note": "只表示接收，不表示口盖已打开"
  }
}
~~~

【待确认】正式车控能力、权限、安全门禁、幂等、ACK、超时、可取消性。

### 7.7.21 Step 19：真实口盖状态回读

~~~jsonc
{
  "_example_only": true,
  "vehicle_state_readback": {
    "run_event_ref": "DEMO-CHARGE-RUN-001",
    "charge_port_state": "OPEN",
    "sampled_at": "2026-09-04T18:25:04.850+08:00",
    "source": "SERES_VEHICLE_STATE_TBD",
    "quality": "VALID"
  },
  "final_business_result": {
    "status": "SUCCEEDED",
    "success_basis": "REAL_STATE_REACHED"
  }
}
~~~

如果 RPC 返回成功但真实状态仍 CLOSED，则最终不能显示成功。

### 7.7.22 Step 20：更新卡片、上下文、事件与冷却

~~~jsonc
{
  "_example_only": true,
  "run_completion": {
    "task_definition_ref": "DEMO-CHARGE-PORT",
    "run_event_ref": "DEMO-CHARGE-RUN-001",
    "run_status": "SUCCEEDED",
    "card_update": {
      "text": "充电口盖已打开",
      "truth_source": "REAL_VEHICLE_STATE"
    },
    "planner_context": "CONSUMED_AND_DESTROYED",
    "parking_cycle_ref": "DEMO-PARKING-CYCLE-7842",
    "cooldown_until": "TBD",
    "audit_nodes": [
      "TASK_STATE",
      "TRIGGER_MATCH",
      "ADVISOR_ACCEPT",
      "DT_RESULT",
      "CARD_VISIBLE",
      "USER_CONFIRM",
      "PRECHECK_ALLOW",
      "CONTROL_ACCEPT",
      "REAL_STATE_OPEN"
    ]
  }
}
~~~

卡片更新失败不能重新开盖；旧 Planner 上下文、旧卡片、旧授权与旧 DT 结果全部失效。同一停车周期怎样防重、何时允许再次识别必须专项确认。

### 7.7.23 充电链逐步责任总表

| Step | 谁负责 | 在哪里做 | 收到什么 | 判断什么 | 输出什么 | 失败怎么办 |
|---|---|---|---|---|---|---|
| 0 定义/发布 | 产品 + Trigger/Advisor/DT/VUI/车控 Owner | PRD、配置/发布流程 | 场景、依赖、交互、动作、成功口径 | 能力与端云链是否完整 | 同版本 DisplayMetadata + RuntimeDefinition；Assignment 独立产生 | 任一关键依赖缺失或半发布则拦截/保持旧版 |
| 1 任务中心 | 任务中心 + 接入业务 | 车机 HMI | DisplayMetadata、真实状态 | 是否适用、能否操作 | OperationRequest | UNKNOWN 不假显示开启；失败按 OperationResult 回滚 |
| 2 保存状态 | 状态承载方 | 物理位置 TBD | OperationRequest | 鉴权、幂等、持久化 | OperationResult→HMI；TaskInstanceState→同步层 | 失败回滚并保持原状态 |
| 3 Runtime 恢复 | 状态同步 + 端/云 Runtime | 端云 | 启动快照/增量/重同步、RuntimeDefinition、RuntimeAssignment | 状态/版本明确、快照完整、producer 唯一 | READY；本例 producer 待拍板 | UNKNOWN/SYNCING/冲突时 BLOCKED，不生成主动动作 |
| 4 激活事件 | 车端状态域 | 端侧 | 挡位原始变化 | 是 D→P 事件还是持续 P，质量是否有效 | 带时间戳的激活事件 | UNKNOWN/旧事件丢弃 |
| 5 硬 Trigger | 唯一 producer 所在 Trigger | 端或云待确认 | 任务、总开关、P、SOC、口盖、停车周期 | 硬条件、时效、防重、频控 | 稳定候选 | FALSE/UNKNOWN 不调 DT |
| 6 先建事件、再生成 Query | 唯一 producer + 充电原业务 | 端或云待确认 | 硬候选、快照、版本 | 是否已有本停车周期事件；RunEvent 是否创建成功 | 先输出 run_event_ref；成功后原业务才生成同事件 Query | 冲突/重复/创建失败不生成 Query |
| 7 Advisor 准入 | 主动推荐/Static Advisor | 云端 | Query、事件、优先级上下文 | 是否允许当前主动推荐 | ACCEPT/REJECT | REJECT/过期则结束 |
| 8 调 DT | 主动推荐/Static Advisor；正式组件关系与调用 Owner 待技术确认 | 云端 | 同事件 Query、工具参数 | 请求是否完整且仍有效 | inference request | 调用失败写 ERROR，不出执行卡 |
| 9 获取视觉 | DT/VQA + 端侧视觉能力 | 云端编排，必要输入来自车端 | vehicle/run/停车周期、图像/特征 | 是否为本车本事件、新鲜合规 | 视觉证据/工具结果 | 缺帧、旧帧、串车记 UNKNOWN/ERROR |
| 10 返回结果 | DT/VQA | 云端 | 推理输出 | FOUND/NOT_FOUND/UNKNOWN/ERROR 与时效 | 带 inference_ref 的结果 | 结果必须可关联、可过期 |
| 11 原业务验结果 | 充电原业务 | 云端 | 推理结果、任务/产生权当前状态 | 是否 FOUND、同事件、未过期、未出过卡 | ALLOW_CARD | NOT_FOUND 正常结束；其他异常受控结束 |
| 12 请求卡片 | 充电原业务 | 云端→车机 VUI | RunEvent、推理引用、文案、按钮、TTS、路由 | 卡型合同是否完整 | InteractionRequest | 请求失败不授权、不执行 |
| 13A 卡片展示 | VUI | 车机展示 | InteractionRequest | 准入、排队、是否真正 VISIBLE | DisplayAck=VISIBLE + card_ref；独立 LifecycleEvent | 展示失败/过期/被替换：不建立语音上下文，不授权 |
| 13B 上下文绑定 | 云端上下文 Owner TBD | 云端 | VISIBLE card_ref + run/content/actions/expires | 卡与事件是否仍有效、字段是否齐全 | planner_context_ref | 绑定失败/过期：语音结果不得授权 |
| 14A 点击 | VUI/卡型回调链 | 车机→云端原业务 | 按钮、card_ref、run_event_ref | 元素是否仍有效 | 标准按钮事件或按卡型模拟 Query | 旧卡/无上下文丢弃 |
| 14B 语音 | ASR + Planner | 云端 | 用户表达 + 当前卡片上下文 | 是否明确选择当前按钮/是否只是追问 | 标准语义 CONFIRM/REJECT/UNCLEAR | 歧义/追问不授权 |
| 15 形成执行凭证 | 充电原业务 | 云端 | 三类卡片回调、点击或 Planner 结果 | 同事件、卡可见、未过期、未消费、明确 CONFIRM | ExecutionProof.authorization_ref | 拒绝/关闭/超时/歧义/重复不生成凭证 |
| 16 端云交接 | 云端原业务/执行编排，正式发送方 TBD | 云→端 | RunEvent、定义/产生权版本、scope、推理、ExecutionProof、幂等键 | 请求和凭证是否仍在有效期 | 一次性 ExecutionRequest | 可受控重试但不得执行过期请求 |
| 17 端侧复核 | 端侧执行/赛力斯安全门 | 端侧 | 请求 + 最新任务、Assignment、P、停稳、口盖、时效 | 状态/代次/scope/凭证/模型/安全/幂等 | ALLOW/DENY + 原因 | 任一不满足即 DENY；NOTIFY_ONLY 不得进入 |
| 18 车控 | 赛力斯车控 | 端侧 | ALLOW 后动作、幂等键 | 能力、权限、安全门禁 | request_ref + ACK/拒绝 | ACK 只表示接收；失败不假成功 |
| 19 真实回读 | 赛力斯状态域 + 充电原业务 | 端侧，结果回云 | request_ref、目标 OPEN、观察窗口 | 真实口盖是否 OPEN | SUCCESS/FAILED/UNKNOWN | CLOSED/超时/未知不显示成功 |
| 20 收口 | 原业务 + VUI + Runtime 日志 | 端云 | 真实状态、卡片/上下文/事件 | 结果关联是否正确、资源是否销毁 | 卡片终态、RunEvent 终态、冷却 | 卡片失败不重做车控；旧上下文失效 |

### 7.7.24 充电失败分支

| 停止位置 | 场景 | 必须怎么处理 |
|---|---|---|
| 硬 Trigger 前 | 任务关闭/总开关关闭/非 P/未停稳/SOC 不满足/口盖已开 | 不创建 RunEvent |
| 硬 Trigger | 数据 UNKNOWN/STALE、同停车周期已处理、频控 | 不调用 DT |
| Advisor | 更高优先级冲突、候选已过期 | 抑制并结束 |
| DT/VQA | NOT_FOUND | 正常结束，不出开盖卡 |
| DT/VQA | UNKNOWN/ERROR/旧帧/串车 | 失败结束或受控重试，不开盖 |
| 卡片 | 展示失败/排队过期/被替换 | 不执行 |
| 用户 | 拒绝/关闭/超时/表达不清 | 不授权 |
| 下发 | 网络失败 | 未过期才允许受控重试；过期丢弃 |
| 端侧复核 | 切出 P、开始移动、任务关闭、口盖已开、授权/模型过期 | DENY，返回原因 |
| 车控 | 拒绝/超时 | 失败，不假报成功 |
| 回读 | 口盖未 OPEN 或状态 UNKNOWN | FAILED/UNKNOWN，不显示“已打开” |

## 7.8 四条系统预设任务怎样落在同一框架

### 7.8.1 十五个公共阶段

~~~text
①任务定义与双发布物
→ ②任务中心展示/OperationRequest
→ ③真实任务状态与 OperationResult
→ ④运行侧快照/增量/重同步与 RuntimeAssignment
→ ⑤激活事件
→ ⑥Trigger 组成快照并输出稳定候选
→ ⑦唯一 producer 创建 RunEvent
→ ⑧RunEvent 成功后按需生成 Query、调用模型/工具
→ ⑨按 InteractionMode 分流
→ ⑩按需出卡/告知，或校验已会签静默策略
→ ⑪形成 authorization_ref、silent_policy_decision_ref 或 NoAction
→ ⑫端侧执行前复核
→ ⑬车控动作
→ ⑭真实状态回读
→ ⑮结束/冷却/日志/恢复
~~~

不是每条任务都要调用模型或出卡，但每条都不能缺任务状态、处理拓扑、唯一 RunEvent 产生权、明确 InteractionMode、执行前复核、真实回读和结束治理。`NOTIFY_ONLY` 在第 ⑪ 步形成 NoAction 后结束，不得进入第 ⑫ 步。

### 7.8.2 四任务逐阶段矩阵

| 阶段 | 天气/路况保护 | 儿童/宠物开启儿童锁 | 后视镜自动加热 | 识别充电设备后开盖 |
|---|---|---|---|---|
| 1 定义/双发布物 | 雨/湿滑、雪/结冰、浓雾三分支；DisplayMetadata + RuntimeDefinition | 儿童/猫狗识别 + 安全动作；规则冲突 | 雨天、洗车退出、高湿温差三候选场景 | 硬条件 + DT/VQA + 二次确认 + 开盖 |
| 2 任务中心/操作 | 应展示；独立启停是否进一期 TBD；只发 OperationRequest | 同左 | 同左 | 同左 |
| 3 真实状态 | 状态承载方返回 OperationResult；Runtime 消费 ENABLED/DISABLED/UNKNOWN；真源 TBD | 同左 | 同左 | 同左 |
| 4 恢复/Assignment | 目标为端侧启动快照+增量+重同步；topology=EDGE、producer=EDGE；实现 TBD | topology 与 producer 均待定 | 最终归属 TBD；若端侧则 producer=EDGE | topology=HYBRID；producer 是 EDGE 还是 CLOUD 待定，绝不能两侧各建事件 |
| 5 激活事件 | 天气/路面变化并在行驶场景判断 | 进入非 P/行车或对象识别变化，精确定义 TBD | 雨天/洗车退出/湿温差命中 | 约定的切入 P 挡事件 |
| 6 Trigger 稳定候选 | 任务开 + VLM + 车速门槛 + 目标模式/灯未开启；时效/防抖/去重/频控 | 任务开 + 支持对象 + 行车 + 目标儿童锁未开；规则与安全 TBD | 任务开 + 三场景之一 + 加热未开；唯一规则 TBD | 任务开 + 总开关 + 切 P + SOC/停稳 + 口盖关闭；阈值 TBD |
| 7 创建 RunEvent | producer=EDGE 创建；先于卡片 | producer 待定；未拍板前不进入量产动作 | producer 待定 | 唯一 producer 创建；成功后才能生成 Query |
| 8 模型/工具 | 消费端侧 VLM 结构化结果，不进 Planner/DT | 儿童拟 OMS/SLS；猫狗拟字节 VLM；是否可做安全动作 TBD | 不需 Planner/DT，确定性端状态 | 主动推荐/Static Advisor → DT/VQA/端侧视觉；Planner 是否参与最终卡片语音上下文待定；结果写回同 RunEvent |
| 9 InteractionMode | REQUIRE_CONFIRMATION | SILENT 候选；与旧稿有冲突，安全会签前为 TBD | SILENT 候选；规则与人工覆盖未定 | REQUIRE_CONFIRMATION |
| 10 交互/策略 | 即时卡 + 固定 TTS；本地可见即可说 | 9月1日当前口径无卡无 TTS；旧 SLS 稿冲突必须显式保留 | 当前口径无卡无 TTS | 即时卡 + TTS；云端 Planner 语音；点击合同必须二选一 |
| 11 ExecutionProof/NoAction | 有效手点/模拟点击→authorization_ref | 若允许 SILENT，必须先有安全会签的 silent_policy_decision_ref | 若允许 SILENT，必须有 policy_ref；人工关闭抑制 TBD | 有效点击/Planner语音→authorization_ref |
| 12 端侧复核 | 最新任务/定义/producer/天气/路面/车速/模式或灯/凭证 | 最新任务/对象/位置/行车/门/锁/识别时效/策略凭证 | 最新任务/场景/加热/计时/人工操作/策略凭证 | 最新任务/总开关/P/停稳/口盖/推理和授权时效/代次 |
| 13 动作 | 湿滑模式/雪地模式/后雾灯 | 约定范围儿童锁 | 后视镜加热及退出动作 | 打开充电口盖 |
| 14 真实回读 | 真实模式/灯状态 | 真实左右儿童锁状态 | 真实加热状态，退出也需回读 | 真实口盖=OPEN |
| 15 治理 | 拒绝/超时/天气恢复/冷却/恢复 | 误报、人工关闭、任务关闭、安全日志 | 持续、退出、重复、人工覆盖 | 非 FOUND、拒绝、过期、同停车周期防重、上下文销毁 |

### 7.8.3 任务一：天气/路况保护

完整逐跳演算见第 7.6 节。当前最明确的产品结论：

- **端侧方向较明确**：端侧 Trigger 消费本地 VLM 与端状态；
- **需要用户确认**：即时卡 + 固定 TTS；本地语音走可见即可说；
- **最终安全门在端侧**：用户确认后再读取最新车况；
- **成功看真实车辆状态**。

当前不能承诺：

- 任务中心启停状态已直达 Trigger；
- 离线即时卡已完成量产接入；
- 防抖次数、时效、恢复原状态和冷却已定；
- 正式车控和回读接口已打通。

### 7.8.4 任务二：后排儿童/宠物识别后开启儿童锁

#### 任务定义候选

~~~jsonc
{
  "_example_only": true,
  "task_definition_ref": "DEMO-CHILD-PET-LOCK",
  "processing_topology": "TBD",
  "run_event_producer": "TBD_EDGE_OR_CLOUD",
  "activation": "ENTER_DRIVING_STATE_OR_OBJECT_CHANGE_TBD",
  "inputs": {
    "child": "SERES_OMS_OR_SLS_TBD",
    "pet": "BYTE_VLM_CAT_DOG_ONLY_CURRENT_EVIDENCE",
    "gear_or_driving_state": "SERES_SIGNAL_TBD",
    "rear_door_and_lock_state": "SERES_SIGNAL_TBD"
  },
  "interaction": "NO_CARD_NO_TTS_LATEST_MEETING_BUT_CONFLICTS_WITH_OLD_DRAFT",
  "action": "ENABLE_DEFINED_REAR_CHILD_LOCK_SCOPE_TBD",
  "completion_truth": "REAL_CHILD_LOCK_STATE",
  "release_gate": "SAFETY_AND_VEHICLE_CONTROL_SIGN_OFF_REQUIRED"
}
~~~

#### 候选规则

~~~text
候选 =
    任务有效
AND 车辆进入正式定义的行车状态
AND（后排识别到儿童
    OR 识别到已验证范围内且结果足够新鲜的猫/狗）
AND 目标范围的儿童锁当前未开启
AND 数据质量和时效满足
~~~

注意：上面的 OR 必须用括号明确，避免被实现成“只要宠物出现就不看任务和行车状态”。

#### 为什么目前不能直接交给研发做静默车控

| 争议 | 旧口径 | 最新会议方向 | 必须拍板 |
|---|---|---|---|
| 激活时机 | 切 D | 非 P/行车 | 是事件还是状态 |
| 对象 | 儿童/老人+儿童等 | 儿童 + 猫/狗 | 支持对象和误报容忍 |
| 数据来源 | 旧占位字段 | 儿童拟赛力斯；宠物拟字节 VLM | 正式信号与最大时效 |
| 交互 | 卡片/TTS/确认 | 无卡无 TTS | 是否允许长期静默授权 |
| 动作范围 | 模糊 | 自动开启儿童锁方向 | 左/右/双侧，人工覆盖 |

【资料已确认】宠物当前只有猫狗评测信息；能力约数分钟级的口径曾在会上出现。它不能默认满足安全车控所需的实时性。  
【产品要求】安全、车控、OMS/VLM 和双方产品未会签前，本任务只做框架验证，不进入量产静默动作。

#### 目标执行闭环

~~~mermaid
flowchart TD
    A[任务状态明确有效] --> B[读取对象识别与最新车况]
    B --> C{对象在支持范围、数据新鲜、<br/>行车与目标锁状态满足?}
    C -- 否/UNKNOWN --> D[继续等待]
    C -- 是 --> E[先做时效、防抖、去重、频控与人工覆盖治理]
    E --> E2[唯一 producer 创建 RunEvent]
    E2 --> F{静默自动执行是否已获安全会签?}
    F -- 否 --> G[阻止发布]
    F -- 是 --> P[生成 ExecutionProof.silent_policy_decision_ref]
    P --> H[端侧重读任务、对象、车门、车速、锁状态]
    H --> I{仍满足且未被用户人工覆盖?}
    I -- 否 --> J[结束并记录]
    I -- 是 --> K[赛力斯车控开启约定范围儿童锁]
    K --> L[回读左右儿童锁真实状态]
~~~

#### 本任务需要的结论

1. 最终激活事件和运行位置；
2. 儿童/猫狗正式数据、质量、频率和最大时效；
3. 静默执行是否允许，是否需要首次授权/明显设置说明；
4. 左、右还是双侧门；
5. 用户手动关闭后的抑制时间与优先级；
6. 安全签字 Owner、车控与真实状态信号。

### 7.8.5 任务三：后视镜自动加热

#### 任务定义候选

~~~jsonc
{
  "_example_only": true,
  "task_definition_ref": "DEMO-MIRROR-HEAT",
  "processing_topology": "EDGE_RECOMMENDED_BUT_NOT_CONFIRMED",
  "run_event_producer": "EDGE_RECOMMENDED_BUT_NOT_CONFIRMED",
  "branches": [
    "RAIN_DRIVING_TBD",
    "CAR_WASH_EXIT_TBD",
    "HIGH_HUMIDITY_TEMPERATURE_DELTA_TBD"
  ],
  "interaction": "NO_CARD_NO_TTS_LATEST_MEETING",
  "action": "TURN_ON_MIRROR_HEATING",
  "exit_policy": "DURATION_OR_SCENE_RECOVERY_TBD",
  "completion_truth": "REAL_MIRROR_HEATING_STATE"
}
~~~

#### 三个候选分支

| 分支 | 候选条件 | 动作 | 未决项 |
|---|---|---|---|
| 雨天行驶 | 下雨 + 车速<70 km/h + 非 P；旧稿曾含雨刮连续约 30 秒 | 开加热 | 雨刮信号、P/非 P、持续和退出 |
| 洗车后 | 传送带洗车模式退出事件 | 开加热 | 持续时间、重复事件、重启恢复 |
| 高湿温差 | 湿度>60% + 行驶状态 + 约定窗口内温差>5℃ | 开加热 | 温度来源、窗口、采样、退出 |

#### 当前资料冲突

- 正式分析稿为非 P 行驶；会上曾出现“P 挡 + 车速<70”，当场被指出逻辑不合理；
- 雨刮连续条件曾因无可用端状态拟删除；
- “开启 15 分钟”没有在全部材料中形成统一规则；
- 端侧/赛力斯自闭环与云端承接均被讨论过，尚未最终拍板。

#### 产品建议

三个分支主要是确定性端状态、计时和状态机，不需要 Planner、DT/VQA 或开放语义，因此优先评估赛力斯/端侧闭环。若因当前平台能力暂由云端判断，也必须保留端侧最新状态复核和真实回读；这只是可选过渡，不是已确认架构。

#### 目标执行闭环

~~~mermaid
flowchart TD
    A[任务状态明确有效] --> B[读取雨量/车速/挡位、洗车状态、湿度/温度]
    B --> C{三个定稿分支之一满足且数据新鲜?}
    C -- 否/UNKNOWN --> D[继续等待]
    C -- 是 --> E[防抖、去重、计时与人工覆盖判断]
    E --> E2[唯一 producer 创建 RunEvent]
    E2 --> E3{静默自动执行是否已获安全与业务会签?}
    E3 -- 否 --> H0[阻止发布或本轮执行]
    E3 -- 是 --> E4[生成 ExecutionProof.silent_policy_decision_ref]
    E4 --> F[端侧执行前复核任务、当前场景和加热状态]
    F --> G{仍需要加热?}
    G -- 否 --> H[结束]
    G -- 是 --> I[赛力斯车控开启加热]
    I --> J[回读真实加热状态]
    J --> K[按定稿的持续/退出策略关闭或保持]
~~~

#### 本任务需要的结论

1. P/非 P 和车速的唯一规则；
2. 雨量/雨刮、湿度、温度、洗车模式正式信号；
3. 连续条件、温差窗口、持续时长和退出条件；
4. 用户手动关闭后的优先级和抑制；
5. 字节/赛力斯唯一责任方；
6. 真实加热状态与关闭回读。

### 7.8.6 任务四：充电口盖

完整逐跳演算见第 7.7 节。当前可承诺的是：

- 硬条件先过滤；
- 主动推荐携带业务 Query；
- DT/VQA 判断充电设备；
- 最终回端侧复核、开盖、读取真实状态。

【会议宣讲/本 PRD 推荐基线】DT/VQA 返回明确 FOUND 且仍有效后，再出卡取得本次授权；最终插入点仍需充电专项拍板。

当前不能承诺：

- Query 就是用户授权；
- 硬 Trigger 已确定在端或云；
- DT 视觉传输、结果时效和回调已经定稿；
- 充电最终采用哪类 VUI 卡片；
- 点击回 Planner 还是直回业务已经确定；
- 端侧车控与真实状态 Source ID 已给出。

### 7.8.7 四任务端云和交互结论

| 任务 | 当前端云方向 | 是否模型编排 | 是否用户确认 | 最大风险 | 下一专项 |
|---|---|---|---|---|---|
| 天气 | 端侧较明确 | 不进 Planner；消费本地 VLM 结果 | 是 | 误识别打扰/错误切模式、离线卡链不完整 | 状态同步 + 卡片/VAS + 车控回读 |
| 儿童锁 | 未定 | 有识别模型但不等于需 Planner | 最新方向否，安全未决 | 误识别后静默控制安全部件 | 安全授权 + 数据时效 + 门范围 |
| 后视镜 | 产品建议端侧，未定 | 不需要 | 否 | 规则冲突、无效加热、人工覆盖 | 唯一规则 + 持续/退出 + 归属 |
| 充电 | 端云混合较明确 | 需要 DT/VQA | 是 | 旧视觉/旧授权导致非充电场景开盖 | Query/DT + 云端卡型 + 端侧复核 |

## 7.9 即时交互卡、即时任务、可见即可说：完整关系

### 7.9.1 三者不是同一件事

| 名称 | 是什么 | 在本需求中的作用 |
|---|---|---|
| 即时任务 | 一类生命周期较短、即时反馈的业务对象；与长期系统预设任务不是完全同义 | 系统预设任务每次命中可以产生一次即时交互，但长期任务本身仍持续存在 |
| 即时交互卡 | 通用 VUI 交互容器 | 展示问题/结果，收集用户选择，管理排队、展示、关闭、超时 |
| 可见即可说 | 用语音操作当前可见 UI 的本地交互框架 | 端侧天气卡里，把“好的”映射成当前确认按钮的模拟点击 |

### 7.9.2 Trigger 与卡片的边界

~~~text
Trigger：
判断“现在该不该问”
→ 创建 RunEvent
→ 提供业务文案、按钮语义、TTS、路由、时效和回调关联

即时交互卡：
判断“能否展示、何时展示”
→ 展示/TTS
→ 收集手点或语音形成的控件结果
→ 返回同一 RunEvent 的用户结果与生命周期

Trigger/业务：
判断“用户结果是否有效、现在还能不能做”
→ 端侧复核、车控、回读
→ 再让卡片展示最终真实结果
~~~

### 7.9.3 三种 InteractionMode 的互斥业务逻辑

InteractionMode 决定“本次 RunEvent 如何与用户交互，以及需要哪一种执行依据”，不是卡片自己临时选择。

~~~mermaid
flowchart TD
    R[已有有效 RunEvent<br/>模型结果如需也已明确且未过期] --> M{InteractionMode}
    M -->|SILENT| S[原业务校验已会签静默策略]
    S -->|有效| SP[生成 silent_policy_decision_ref]
    S -->|缺失/过期| SC[Cancelled / Blocked]
    M -->|NOTIFY_ONLY| N[卡片和/或TTS仅告知]
    N --> NA[NoAction结束<br/>不生成ExecutionProof]
    M -->|REQUIRE_CONFIRMATION| C[请求即时交互卡]
    C --> V{DisplayAck=VISIBLE且卡仍有效?}
    V -->|否| CC[Cancelled]
    V -->|是| U[手点 / 端侧VAS / 云端Planner]
    U --> B{原业务校验<br/>同RunEvent、未过期、未消费、明确CONFIRM?}
    B -->|否| CC
    B -->|是| AP[生成 authorization_ref]
    SP --> PRE[端侧执行前复核]
    AP --> PRE
~~~

| 模式 | 适用场景 | 卡片/TTS | 原业务必须判断 | 输出 | 禁止行为 |
|---|---|---|---|---|---|
| SILENT | 已完成业务与安全会签、无需每次询问的低风险自动动作 | 不出卡、不播 TTS | 静默策略、人工覆盖、任务/事件/版本是否仍有效 | silent_policy_decision_ref | 无会签凭证直接执行 |
| NOTIFY_ONLY | 只需要告知用户、不产生动作 | 卡片和/或 TTS | 是否完成告知、RunEvent 是否仍有效 | NoAction + 展示/生命周期记录 | 从通知分支进入车控 |
| REQUIRE_CONFIRMATION | 用户必须对本次动作明确授权 | 卡片必须真正 VISIBLE；按策略播 TTS | 三类回调、同事件、未过期、未消费、明确 CONFIRM | authorization_ref | 卡片失败后降级静默执行；复用旧确认 |

### 7.9.4 端侧卡与云端卡的区别

| 对比 | 端侧天气卡 | 云端充电卡 |
|---|---|---|
| 谁发起 | 端侧 Trigger/天气业务 | 唯一硬 Trigger 与 RunEvent producer 待定；卡片由充电云端原业务/Advisor 链在专项中落位 |
| 卡在哪里展示 | 都在车机 VUI | 都在车机 VUI |
| 语音怎样理解 | 可见即可说匹配当前页面元素并模拟点击 | 本 PRD 推荐由 Planner 结合当前卡片上下文理解开放表达；是否采用取决于最终卡型专项结论 |
| 点击回哪里 | 原卡片按钮事件回端侧原业务 | 按最终卡型：直回原业务或模拟 Query；必须拍板 |
| 谁决定执行 | 端侧原业务重新复核 | 云端形成授权请求，端侧仍重新复核 |
| 网络 | 本地链目标是弱网可用，需实车证明 | 依赖云端；断网不得用旧结果补执行 |

### 7.9.5 可见即可说完整六步

~~~mermaid
sequenceDiagram
    participant UI as 当前最上层卡片
    participant REG as 页面/卡片注册方
    participant ASR as 字节语音
    participant MATCH as 指令匹配
    participant EXEC as UI执行方
    participant BIZ as 原业务/Trigger

    UI->>REG: 可交互元素、文案、位置、状态、元素ID
    REG->>ASR: 当前动态词表/同义表达
    ASR->>MATCH: ASR文本 + 当前指令集
    MATCH-->>REG: 候选元素ID
    REG->>REG: 多候选消歧；检查仍为顶层有效元素
    REG->>EXEC: 模拟点击目标元素
    EXEC->>UI: 调用原按钮处理
    UI->>BIZ: 原按钮业务事件 + RunEvent
~~~

不能省略的失效条件：

- 卡片未真正展示；
- 卡片不再是最上层页面；
- 卡片隐藏、刷新、关闭、过期或被替换；
- 页面元素 ID 已失效；
- ASR 无结果或命中多个无法消歧；
- RunEvent 已结束或任务被关闭。

### 7.9.6 卡片“泛化能力”到底是什么

“卡片有泛化能力”主要指云端动态卡可把当前卡片内容、按钮和触发原因作为上下文给 Planner，让 Planner 理解“好的”“为什么”“先别开”等不是固定按钮原文的表达，并选择对应业务选项。

它不代表：

- 所有端侧卡都天然接 Planner；
- 可见即可说会理解天气业务；
- 卡片会自己调用 DT 或车控；
- 任何一句“好的”都能作用到任意历史卡片。

### 7.9.7 你和即时交互卡研发要这样对齐

> “我的 Trigger 不要求卡片判断天气，也不会把裸车控命令给你。我会给你本次任务和 RunEvent、卡片文案、按钮标准语义、TTS、语音/点击路由、有效期和回调目标。你需要先返回接收/排队/真正展示/失败，再把确认、拒绝、关闭、超时、打断和输入来源带着同一 RunEvent 返回。端侧天气用可见即可说模拟原按钮点击；云端充电的语音，本 PRD 推荐进 Planner，但语音与点击都要按最终卡型专项拍板。执行完成后，我再把真实车辆结果给你更新卡片。我们要重点确认旧卡、重复回调、卡片被替换和页面失效怎么处理。”

## 7.10 配置平台需要具备什么能力

### 7.10.1 当前事实与目标能力分开

【资料已确认】当前配置平台只覆盖部分云端条件和频控能力；端侧任务仍可能需要研发编码、随整车版本交付。  
【目标产品要求】长期应把稳定的公共能力沉淀为可配置对象，但不能在第一期假设“配一行就自动生成端云全链路”。

### 7.10.2 平台功能模块

| 模块 | 产品能力 | 当前状态 |
|---|---|---|
| 任务基本信息 | 名称、描述、Owner、车型、默认状态、任务中心展示策略 | 需核验/补齐 |
| 处理拓扑与事件产生权 | processing_topology=EDGE/CLOUD/HYBRID；run_event_producer=EDGE/CLOUD/NONE；版本、灰度、迁移 | 需新增或补齐 |
| 能力注册表 | 可用信号、事件、模型、卡片、TTS、动作、回读能力 | 单点能力有，统一注册待确认 |
| 规则编辑 | AND/OR、阈值、变化沿、三值规则、状态机 | 云端部分支持；端侧依赖研发 |
| 数据时效 | 单信号时效、跨信号窗口、质量/UNKNOWN 策略 | 需补齐 |
| 时序治理 | 防抖、去重、频控、处理中锁、冷却、人工覆盖 | 在线部分支持，公共语义待补 |
| 模型/工具编排 | Advisor/Planner/DT/VQA 引用、结果枚举和有效期 | 充电专项待接 |
| 交互策略 | 静默/告知/确认、卡型、文案、按钮、TTS、端/云语音路由 | 单点能力有，任务合同待补 |
| 执行复核 | 需要重读的状态、授权/模型有效期、幂等要求 | 需新增公共表达 |
| 动作与回读 | 动作目标、成功状态、超时、失败策略 | 单点能力有，统一合同待补 |
| 发布治理 | 版本、车型、灰度、校验、回滚、废弃版本 | 需补齐 |
| 可观测 | 全链路事件、指标、告警、回放 | 需补齐 |

### 7.10.3 发布前必须校验

~~~text
任务状态 Owner 缺失        → 不允许发布
端云运行位置/唯一资格缺失  → 不允许发布
规则引用了不存在的信号    → 不允许发布
关键输入无时效/UNKNOWN策略 → 不允许发布
需确认但卡片合同不完整     → 不允许发布
静默安全动作未会签         → 不允许发布
车控无幂等或无真实回读     → 不允许发布
无灰度/回滚/日志           → 不允许量产发布
~~~

### 7.10.4 从配置到运行的目标数据流

~~~mermaid
flowchart LR
    P[产品填写任务定义] --> R[能力注册表校验]
    R --> V[版本与发布校验]
    V -->|云端| C[云端策略/运行配置]
    V -->|端侧当前| E1[端侧需求与整车版本]
    V -->|端侧长期| E2[端侧可消费签名配置]
    V --> T[任务中心展示元数据]
    C --> A[Cloud Runtime]
    E1 --> B[端侧 Trigger Runtime]
    E2 --> B
    T --> OP[用户启停/删除操作意图]
    OP --> H[接入业务/任务状态承载方]
    H -->|持久化成功后的真实状态与失败原因| T
    H --> S[TaskInstanceState<br/>ENABLED / DISABLED / UNKNOWN + state_version]
    V --> RA[RuntimeAssignment<br/>processing_topology + run_event_producer + assignment_version]
    S --> A
    S --> B
    RA --> A
    RA --> B
    A --> O[运行结果/日志]
    B --> O
    O -.任务中心是否展示单次结果/历史待确认.-> T
~~~

注意：配置平台给任务中心的是展示元数据，任务中心给状态承载方的是用户操作意图；只有状态承载方持久化成功后的 `TaskInstanceState` 才能进入 Runtime。任务中心列表 Push/Pull 即使存在，也不能自动当作 Trigger 运行态同步协议。

### 7.10.5 你给平台研发这样说

> “我不是要求第一期做万能编排器。请先把两条基线真正跑通并沉淀公共对象：天气代表端侧任务，充电代表端云混合任务。平台至少需要管理任务定义与版本、能力引用、端云位置、数据时效、防抖去重、交互策略、执行复核、动作回读和发布校验。当前不能配置的端侧部分要明确显示为随车发版，不能让页面给产品造成已经动态生效的错觉。”

## 7.11 全局异常、竞态和降级

| 编号 | 场景 | 正确行为 | 不能接受 |
|---|---|---|---|
| G01 | 任务中心操作保存失败 | UI 回滚/提示，运行侧保持原状态 | 页面显示开启但 Trigger 未开启 |
| G02 | Trigger 启动未取得完整快照 | 状态 UNKNOWN，不创建新事件 | 沿用不明来源的缓存继续运行 |
| G03 | 状态变化乱序 | 按等价版本/顺序丢弃旧消息 | 旧 ENABLED 覆盖新 DISABLED |
| G04 | 端云同时声称 RunEvent 产生权 | 双方停止产生新事件/主动动作并告警 | 两边各出一张卡或各执行一次 |
| G05 | 任务关闭但已有 Candidate | 事件失效，不拉卡/不调模型 | 关闭后仍继续 |
| G06 | 卡片排队时业务条件消失 | 撤销或展示前过期校验 | 过期卡展示后仍可授权 |
| G07 | 卡片被替换/隐藏 | 注销页面元素和上下文 | 晚到“好的”操作旧卡 |
| G08 | 用户重复点击/语音重复回调 | 幂等消费一次 | 重复车控 |
| G09 | 用户确认后车况变化 | 执行前复核拒绝 | 用出卡时旧快照执行 |
| G10 | 云端模型返回旧结果 | 按车辆、RunEvent、时间拒绝 | 旧 FOUND 命中新事件 |
| G11 | 云端下发时断网 | 未过期才可受控重试 | 网络恢复后补执行过期动作 |
| G12 | 车控 ACK 成功但状态未变化 | FAILED/UNKNOWN，不显示成功 | 把 RPC ACK 当业务成功 |
| G13 | UI 最终更新失败 | 保留真实执行结果，不重发车控 | 为了刷新 UI 再执行一次 |
| G14 | 用户人工先完成目标动作 | 复核识别已达到，避免重复车控 | 再发同一动作 |
| G15 | 用户人工关闭自动动作 | 按任务定义进入抑制/人工优先 | 系统立即反向覆盖用户 |
| G16 | 车型/版本回滚 | 旧定义和旧产生权代次失效，恢复兼容快照 | 新规则作用于不支持车型 |

## 7.12 优先级、防抖、去重和防打扰

四个概念必须分开配置和验收：

| 概念 | 判断对象 | 解决的问题 | 示例 |
|---|---|---|---|
| 防抖 | 连续输入 | 单帧误识别/信号抖动 | 天气连续满足若干有效观察 |
| 去重 | 同一 scene/episode/停车周期 | 同一事件重复创建 | 同一湿滑过程只有一个活动 RunEvent |
| 频控/冷却 | 多次独立事件之间 | 用户反复被打扰 | 拒绝后一定时间不再问 |
| 交互优先级 | 多个任务/用户 Query 并发 | 卡片/TTS 抢占冲突 | 用户主动 Query 优先于低优主动服务 |

最低产品要求：

- RunEvent 创建前做去重；
- 卡片活动中阻止同任务新卡；
- 用户拒绝、关闭、超时、成功、失败可配置不同冷却；
- 用户主动 Query、导航/电话/安全提示等高优交互的仲裁由 VUI/架构专项确认；
- 端云使用同一逻辑去重语义，不能各自只看本地历史；
- 参数必须随任务版本可追溯，不能散落在多端代码里无法解释。

## 7.13 日志、指标与 badcase 归因

### 7.13.1 一次事件最少串起什么

~~~text
task_definition/version
→ task_instance/effective_state/state_version
→ processing_topology + run_event_producer + producer_assignment_version
→ activation_event
→ signal_snapshot + quality + age
→ rule_result + debounce/dedup/frequency
→ run_event
→ advisor/planner/DT/VQA（如有）
→ card request/display/lifecycle
→ user result/input source
→ fresh precheck
→ control request/ACK
→ real-state observations
→ final result/cooldown
~~~

### 7.13.2 关键指标

| 指标 | 说明 |
|---|---|
| 任务状态一致率 | 任务中心展示、状态真源、端/云 Runtime 观察是否一致 |
| 候选命中量 | 每任务/分支产生多少 Candidate |
| 防抖/去重/频控拦截率 | 是否有异常抖动或重复 |
| 模型结果分布 | FOUND/NOT_FOUND/UNKNOWN/ERROR 与时延 |
| 卡片准入与展示率 | 接收、排队、可见、失败、被替换 |
| 用户选择率 | 确认/拒绝/关闭/超时/打断 |
| 执行前拒绝率 | 为什么确认后仍被拒绝 |
| 车控 ACK 成功率 | 仅接口层结果 |
| 真实状态成功率 | 最终业务真成功 |
| 假成功拦截数 | ACK 成功但状态未达到目标 |
| 端云双触发数 | 应为 0 |
| 旧事件拒绝数 | 旧卡、旧授权、旧模型、旧配置 |

### 7.13.3 badcase 归因模板

| 根因类别 | 判断证据 | 示例 | 归属方向 |
|---|---|---|---|
| 规则设计缺陷 | 输入正确但规则表达/边界错误 | OR 括号错误、P/非 P 冲突、退出条件缺失 | 产品 + Trigger |
| 端侧资源/能力限制 | 规则正确但信号/算力/离线卡不可用 | VLM 周期太长、页面无法注册 | 端侧能力 Owner |
| 大模型输出不稳定 | 相同合格输入产生不稳定语义/视觉结果 | DT FOUND 与 UNKNOWN 波动 | Planner/DT/VQA |
| 软硬件时序冲突 | 各结果单看正确，但先后次序导致错误 | 用户确认后切出 P、ACK 成功状态未变 | 架构/车控/状态 |
| 状态同步缺陷 | UI、状态真源、Runtime 不一致 | 已关闭但 Trigger 仍运行 | 任务系统/同步层 |
| 交互生命周期缺陷 | 旧卡或上下文仍可操作 | 卡消失后说“好的”仍执行 | VUI/可见即可说/Planner |

## 7.14 验收用例

### 7.14.1 公共状态与框架

| 用例 | 操作/前提 | 预期 |
|---|---|---|
| C01 开启成功 | 任务中心开启，状态保存成功 | UI 显示真实开启；正确 Runtime 恢复 ENABLED |
| C02 开启失败 | 状态保存失败 | UI 回滚；端/云均不运行 |
| C03 启动恢复 | Trigger 重启 | 完整快照前不触发；恢复后按最新状态 |
| C04 乱序 | 先收到版本 42 后收到 41 | 41 被丢弃 |
| C05 关闭等待态 | Waiting 时关闭 | 不创建新 RunEvent |
| C06 关闭卡片态 | 卡片展示后关闭任务 | 卡片失效，点击/语音不授权 |
| C07 唯一 RunEvent 产生权 | 人为让端云 producer 配置冲突 | 两侧均不创建新事件/主动动作并告警 |
| C08 版本回滚 | 定义版本切换 | 旧事件/配置不能跨版本执行 |

### 7.14.2 端侧天气

| 用例 | 操作/前提 | 预期 |
|---|---|---|
| E01 正常湿滑 | 条件稳定、卡片可见、用户确认、复核通过 | 切湿滑模式；真实状态成功后更新卡片 |
| E02 任务关闭 | 条件满足但任务 DISABLED | 不出卡 |
| E03 输入过期 | VLM/车速任一 STALE | 不触发 |
| E04 防抖不够 | 仅单帧 TRUE | 不创建事件 |
| E05 同一 episode | 场景持续满足 | 只有一个活动事件/卡片 |
| E06 卡片失败 | 拉卡失败或排队过期 | 不车控 |
| E07 禁语音 | 语音能力关闭 | 按定稿保留卡片，允许手点，不播 TTS |
| E08 旧语音 | 卡片关闭后说“好的” | 不模拟点击、不执行 |
| E09 用户拒绝 | 点“暂不”或说“不用” | 不执行，按拒绝策略冷却 |
| E10 确认后变化 | 确认后天气恢复/任务关闭/目标已完成 | 复核拒绝或 NO_OP，不重复动作 |
| E11 假成功 | RPC ACK 成功但模式未变 | FAILED/UNKNOWN，不显示成功 |
| E12 无网 | 无网且本地所需能力均已确认可用 | 本地链按正式离线能力工作；若卡片能力未证明则不得宣称通过 |

### 7.14.3 云端/混合充电

| 用例 | 操作/前提 | 预期 |
|---|---|---|
| M01 正常开盖 | 硬条件、FOUND、确认、复核通过 | 真实口盖 OPEN 后显示成功 |
| M02 非 P/未停稳 | 其他条件满足 | 非 P 不调模型；未停稳至少在端侧复核时拒绝，是否前置节流待确认 |
| M03 NOT_FOUND | DT 无充电设备 | 不出执行卡/不开盖 |
| M04 UNKNOWN/ERROR | 无图、低质量、超时 | 不执行 |
| M05 旧视觉 | 上一停车周期 FOUND | 关联/时效校验拒绝 |
| M06 卡片拒绝 | 用户拒绝/关闭/超时 | 不授权 |
| M07 开放语音追问 | 用户问“为什么” | Planner 结合卡片上下文回答，不执行 |
| M08 点击确认 | 用户点“打开” | 按最终卡型回标准 CONFIRM，并同步上下文消费 |
| M09 网络恢复 | 下发断网后超过有效期 | 丢弃旧请求 |
| M10 确认后切挡 | 确认后从 P 切 D | 端侧 DENY |
| M11 重复 P 事件 | 同停车周期重复信号 | 最多一次活动动作 |
| M12 假成功 | ACK 成功，口盖仍 CLOSED | FAILED/UNKNOWN |

### 7.14.4 静默任务

| 用例 | 儿童锁 | 后视镜 |
|---|---|---|
| 任务关闭 | 不执行 | 不执行 |
| 数据 UNKNOWN/过期 | 不执行 | 不执行 |
| 未完成安全/规则会签 | 阻止发布 | 规则未唯一时阻止发布 |
| 用户人工覆盖 | 不立即反向覆盖，按定稿抑制 | 不立即重新开启 |
| 状态回读失败 | 不显示/记录成功 | 不记录成功 |
| 重复事件 | 幂等，不重复锁 | 幂等，不重复开启/计时 |

---

# 8. Release｜怎么评、怎么做、怎么验收

## 8.1 本次评审不是让大家现场写接口

本次先把九类数据合同归并成六组评审结论：

1. **任务定义与双发布物合同**：DisplayMetadata 与 RuntimeDefinition 分别交给谁，怎样保证同版本且不半发布；
2. **任务中心与真实状态合同**：OperationRequest 交给谁，OperationResult 怎样回 HMI，谁产生 TaskInstanceState；
3. **真实状态、RuntimeDefinition 与 Assignment 合同**：怎样启动快照、增量变化、异常重同步，怎样保证唯一 producer；
4. **SignalSnapshot 与 RunEvent 合同**：怎样保证同车同时间数据、何时创建唯一事件、何时才允许生成 Query；
5. **InteractionRequest / Events 与 ExecutionProof 合同**：三种 InteractionMode 怎样互斥，卡片必须返回哪三类事实，凭证怎样产生；
6. **ExecutionRequest 与 Result 合同**：端侧怎样复核、幂等、车控、真实回读并形成最终结果。

合同的产品语义拍板后，由每个技术 Owner 输出正式时序、IDL、错误码和排期。

## 8.2 你本人接下来按这个顺序做

### 第一步：先发本 PRD，请所有人只确认“事实/方案/TBD”

你不需要让大家一口气审完全部字段。先请各 Owner 标注：

- 哪些能力当前已经有；
- 哪些能力有设计但本项目没接；
- 哪些是本期要做；
- 哪些方案不可行及原因；
- 哪些项需要另开专项。

### 第二步：组织“系统预设任务框架专项”

参会至少包含任务中心、状态/任务系统、Trigger、VUI、端云架构、赛力斯执行/状态。只拍板：

- 系统预设任务对象和生命周期；
- 用户操作与真实状态；
- 状态怎样到端/云 Runtime；
- 处理拓扑与唯一 RunEvent 产生权；
- RunEvent 关联；
- 执行前复核和真实回读。

### 第三步：组织“端侧天气卡专项”

参会包含端侧 Trigger、天气/VLM、VUI、可见即可说、赛力斯车控/状态。逐步走第 7.6 节，拿到：

- 正式信号与时效；
- 防抖/去重/频控；
- 拉卡与三类回调；
- 页面元素注册、ASR/匹配、消歧、模拟点击；
- 复核、车控、回读；
- 弱网/无网实车能力证明。

### 第四步：组织“云端充电专项”

参会包含 Trigger、主动推荐/Static Advisor、Planner、DT/VQA、VUI、端侧执行。逐步走第 7.7 节，拿到：

- 硬 Trigger 位置与条件；
- Query 模板与事件关联；
- DT/VQA 请求、返回、质量和时效；
- 最终卡型；
- 点击和语音回流；
- 一次性授权与下发；
- 端侧复核、开盖、回读。

### 第五步：儿童锁和后视镜分别做安全/规则专项

- 儿童锁先做业务与整车安全会签，未通过不进入静默车控开发；
- 后视镜先把唯一规则、持续、退出和双方归属定下来，再排开发。

### 第六步：让测试把第 7.14 节变成联调用例

要求每个用例都有：

- 前置任务状态；
- 输入及时间戳/质量；
- 期望停在哪一跳；
- 是否出卡/调用模型/车控；
- 最终真实状态；
- 全链路日志证据。

## 8.3 研发工作包

| 工作包 | 要做什么 | 主责任候选 | 上游给什么 | 交付物 |
|---|---|---|---|---|
| WP01 任务定义/发布 | 将同一产品定义拆成 DisplayMetadata 与 RuntimeDefinition，保证同版本原子发布、灰度和回滚 | 配置/发布平台 | 产品任务定义 | 双产物 schema、消费者清单、发布/回滚方案 |
| WP02 任务中心任务单元 | 展示、操作、处理中、回滚；单次结果/历史范围待确认 | 任务中心 | 展示元数据、真实状态 | 页面与交互协议 |
| WP03 真实任务状态 | 用 OperationRequest/OperationResult 承接启停意图，保存 TaskInstanceState，处理鉴权、幂等、顺序和失败回滚 | 任务系统/接入业务 | 用户操作请求 | 状态模型、操作结果和接口 |
| WP04 状态同步/产生权 | 启动快照、增量变化、断线重同步；生成 RuntimeAssignment，明确 READY/BLOCKED、处理拓扑与唯一 RunEvent 产生权 | 端云架构/Trigger | 真实状态、定义版本 | 状态时序、fencing 和异常恢复方案 |
| WP05 端侧 Trigger | 数据订阅、快照、三值规则、防抖去重、RunEvent | 端侧 Trigger | 状态、信号、规则 | 端侧运行方案 |
| WP06 云端触发/编排 | 硬条件、Query、Advisor/Planner/DT/VQA | 云端业务 | 候选与上下文 | 云端时序与结果合同 |
| WP07 即时交互卡 | 准入、排队、展示、TTS；返回 DisplayAck、InteractionEvent、LifecycleEvent 三类事实 | VUI | InteractionRequest | 卡片合同、卡型与三类回调结论 |
| WP08 可见即可说 | 页面元素、词表、ASR、匹配、消歧、模拟点击 | 页面方+字节语音 | 当前可见元素 | 端侧语音时序 |
| WP09 执行凭证与端侧执行 | 校验 ExecutionProof 的类型、范围、事件、代次和时效；重读最新状态、幂等、车控、安全门禁 | 原业务 + 赛力斯端侧 | ExecutionRequest、ExecutionProof 与最新状态 | 凭证/执行接口、复核项与拒绝原因 |
| WP10 状态回读 | 真实目标状态、质量、超时 | 赛力斯状态域 | 动作目标 | 回读合同 |
| WP11 结果与观测 | 卡片/任务历史更新、日志、指标、告警 | 业务+平台 | 全链路结果 | 埋点与排障方案 |
| WP12 测试验收 | 仿真、台架、实车、弱网、竞态 | 测试 | 本 PRD 用例 | 验收报告 |

## 8.4 评审时逐页话术

### 0—2 分钟：先说为什么评

> “现在的问题不是四条规则没人写，而是没有一张共同框架。任务中心、Trigger、卡片、Planner、DT、车控分别有材料，但谁给谁什么、失败停在哪、谁是真状态还没连起来。今天先把公共合同定下来。”

### 2—6 分钟：讲六层架构

> “控制面先把产品定义拆成任务中心用的 DisplayMetadata 和 Runtime 用的 RuntimeDefinition；状态面确认某辆车是否真的开启，并给出启动快照、增量变化、处理拓扑和唯一 RunEvent 产生方；运行面先形成稳定候选并创建本次 RunEvent，再按需生成 Query、调用模型；交互面按 SILENT、NOTIFY_ONLY、REQUIRE_CONFIRMATION 三条路分流，卡片只返回交互事实；执行面凭 ExecutionProof 进入端侧最新状态复核、车控和真实回读；第六层观测治理负责把版本、事件、卡片、推理、凭证、动作和结果串起来。任务中心不是 Trigger，卡片也不是业务判断器。”

### 6—9 分钟：专门讲 Task Center 到 Trigger

> “早期任务中心通用材料采用‘任务中心作为 HMI、接入业务维护真状态，预设条件任务走 Trigger/其他路径’的边界；但它是否直接适用于系统预设任务、谁保存真状态，都还需要晓伟和任务系统确认。我也没有找到 taskId+enabled 直达 Trigger 的既定协议。我的产品要求是：Trigger 必须获得可恢复、可判新旧的真实状态；目标机制建议启动快照、增量变化和异常重同步，请任务系统与架构给正式方案。”

### 9—16 分钟：走端侧天气

> “请跟着同一个 RunEvent 看数据：任务开启、Trigger 收状态和 VLM/端状态、组成新鲜快照、三值规则、防抖去重、出卡、卡片真正展示后注册可见即可说、用户说‘好的’被模拟成原按钮点击、卡片把本次 CONFIRM 回给 Trigger、Trigger 再读最新车况、车控、真实模式回读。任何一步失效都不能继续。”

### 16—23 分钟：走云端充电

> “下面讲的是本 PRD 推荐的充电演示分支，不冒充已接通现状。已确认的是主动推荐/Static Advisor 会协作调用 DT/VQA，最终动作回端侧；硬 Trigger、唯一 RunEvent producer、最终卡型、Planner 语音上下文和点击回流仍要专项拍板。建议链路是：硬候选通过后先建 RunEvent，再生成 Query、调用 DT/VQA；FOUND 只表示识别结果，不是用户授权。卡片真正可见且上下文绑定成功后才承接本次选择；形成一次性授权后下发端侧，端侧重读 P 挡、停稳、任务、口盖、推理和授权时效，真实口盖 OPEN 才成功。”

### 23—26 分钟：讲另外两条

> “儿童锁目前最大的不是技术，而是无卡静默安全动作、对象时效和门范围没有会签；后视镜是确定性端状态任务，但规则、持续退出和双方归属没有唯一版本。两条先开专项，不把冲突口径直接排开发。”

### 26—30 分钟：收口

> “今天请每个 Owner 不要只说‘支持’，而是确认输入、判断、输出、失败和现状证据。九类公共合同的产品语义和九项框架结论先拍板；正式字段、接口和错误码进入各技术专项。没有拍板的地方继续保留 TBD，不作为开发验收口径。”

## 8.5 本场怎样收敛：九项框架结论 + 六个专项认领

### 8.5.1 今天必须拍板的九项框架结论

| 编号 | 必须回答的问题 | 今天要落在纪要里的结论 | 建议 Owner |
|---|---|---|---|
| F-01 | 一份产品任务定义怎样发布 | 同一版本拆成 DisplayMetadata 与 RuntimeDefinition；消费者、原子发布/回滚原则明确 | 配置/发布平台 + 任务中心 + Runtime |
| F-02 | 谁维护某车/账号下任务的真实状态 | OperationRequest/Result、状态承载方、状态模型、保存失败回滚；任务中心只是 HMI | 任务系统/接入业务 + 任务中心 |
| F-03 | 真实状态怎样到端/云 Runtime | 启动快照、增量变化、顺序语义、异常重同步、READY/BLOCKED 和关闭传播 | 任务系统 + Trigger + 端云架构 |
| F-04 | 如何同时表达端云链路与唯一发起权 | processing_topology 可为 EDGE/CLOUD/HYBRID；run_event_producer 只能 EDGE/CLOUD/NONE；代次/fencing、冲突即停 | 端云架构 + Trigger |
| F-05 | RunEvent 何时创建、怎样贯穿一次业务 | 稳定候选后、Query/模型/卡片前由唯一 producer 创建；全链复用、过期、取消、幂等原则 | Trigger + 云端原业务 |
| F-06 | 三种 InteractionMode 怎样互斥 | SILENT→policy_ref；NOTIFY_ONLY→NoAction；REQUIRE_CONFIRMATION→authorization_ref；缺凭证不执行 | 各任务原业务 + 安全 + VUI |
| F-07 | 即时卡与原业务怎样对接 | InteractionRequest 最小语义；DisplayAck、InteractionEvent、LifecycleEvent 三类回调；端侧/云端语音路由 | VUI + VAS + Planner + 原业务 |
| F-08 | 云端或端侧怎样进入最终车控 | ExecutionProof/Request、scope、时效、producer 代次、防串代、幂等与端侧统一复核门禁 | 端侧执行 + 云端业务 + 赛力斯车控 |
| F-09 | 什么才算任务本轮成功，怎样追踪 | 用户选择、复核、车控 ACK 和真实状态分层；最终只认赛力斯真实回读；同 RunEvent 可回放 | 赛力斯车控/状态 + 原业务 + 观测平台 |

如果这九项没有结论，四条任务会继续各接各的接口，无法形成可复用、可验证的“系统预设任务框架”。

### 8.5.2 今天不强行拍技术答案，但必须认领 Owner 和截止时间

| 编号 | 专项 | 专项必须产出什么 | 建议 Owner | 本场记录 |
|---|---|---|---|---|
| S-01 | 任务中心一期控件 | 展示、启停、关闭、删除、处理中和单次结果/历史范围 | 任务中心 | Owner + 日期 |
| S-02 | 天气卡 + 可见即可说 | 卡型、请求/三类回调、元素注册、ASR/匹配、模拟点击、失效和离线证明 | VUI/页面方 + 字节语音 + 天气 Trigger | Owner + 日期 |
| S-03 | 充电 Query + DT/VQA | Query 模板、请求/结果枚举、视觉来源、质量、时效和异常 | 充电原业务 + 主动推荐/Static Advisor + DT/VQA；Planner 按最终卡型参与 | Owner + 日期 |
| S-04 | 充电卡与端云执行 | 最终卡型、点击/语音回流、上下文 Owner、ExecutionProof 生成与消费、下发时序 | VUI + Planner + 充电原业务 + 端侧执行 | Owner + 日期 |
| S-05 | 儿童锁安全 | 是否允许静默、对象范围与时效、门范围、人工覆盖、安全会签 | 赛力斯产品/安全/车控 + 识别能力 | Owner + 日期 |
| S-06 | 后视镜规则与归属 | 唯一触发规则、持续/退出、端云归属、正式信号和回读 | 双方产品 + Trigger/车控 | Owner + 日期 |

你的收口话术：

> “今天框架需要拍九项产品结论：双产物发布、真实状态、状态同步、唯一产生权、RunEvent 顺序、三种交互模式、卡片三类回调、执行凭证与端侧复核、真实状态收口。其余不是现场临时猜接口，而是请对应 Owner 认领专项和日期。会后每个专项都要把输入、判断、输出、失败与现状证据补回这份 PRD。”

## 8.6 发布准入

任何一条系统预设任务同时满足以下条件，才可进入量产发布：

- 业务规则唯一，旧版本已废弃/标冲突；
- DisplayMetadata 与 RuntimeDefinition 同版本、消费者清晰，并可原子发布和回滚；
- 任务实例状态有真源、失败回滚和启动恢复；
- 启动快照、增量变化、断线重同步与 READY/BLOCKED 规则可验证；
- 处理拓扑、RuntimeAssignment、fencing 和唯一 RunEvent 产生权明确；
- RunEvent 必须先于 Query、模型调用和卡片创建，且全链路关联不串单；
- 所有输入有正式来源、枚举、时间、质量和 UNKNOWN 策略；
- 防抖、去重、频控、处理中锁和人工覆盖明确；
- SILENT、NOTIFY_ONLY、REQUIRE_CONFIRMATION 三种模式互斥，分别停在正确分支；
- 需要出卡时，InteractionRequest、DisplayAck、InteractionEvent、LifecycleEvent 合同完整；
- 静默动作有有效 silent_policy_decision_ref，并完成业务、安全、车控会签；需要确认的动作有有效 authorization_ref；仅告知不得产生执行凭证；
- ExecutionRequest 必须携带与模式匹配的 ExecutionProof；端侧执行前复核、幂等和过期策略完整；
- 真实状态回读是唯一成功依据；
- 弱网、过期、关闭、重复、并发和假成功用例通过；
- 字节和赛力斯不存在重复主动动作；
- 有版本、灰度、回滚、日志、指标和告警。

## 8.7 资料来源与证据边界

### 飞书原始资料

1. [9 月 1 日系统预设任务评审记录](https://bytedance.larkoffice.com/docx/Zp90dGMheow4XmxwVXAcu2KGnTb)：端云分类、天气卡、充电链、四任务、平台与框架专项讨论。
2. [《VUI 主交互需求》](https://bytedance.larkoffice.com/wiki/FBsrwA734iaFzZkrZExcHHBtn3d)：即时交互卡四类路径、生命周期、TTS、可见即可说和 Planner 路由。
3. [《AI汽车｜可见即可说框架需求文档》](https://bytedance.larkoffice.com/wiki/AxYjwUI8wiFCXWkdNsDcRae0nCf)：最上层页面、元素 ID、ASR、精确/模糊/本地匹配、多候选消歧、模拟点击和失效。
4. [《动态加载型工具-技术方案》](https://bytedance.larkoffice.com/wiki/T8jDwzwO9iiNF0kbFEVc1uyrnIf)：动态卡片上下文、Planner 动态选择能力；不自动证明充电已接入。
5. [《sls 主动服务（规则部分）需求文档》](https://bytedance.larkoffice.com/docx/Vm00dKhlYoSKNWxzJ51cH5WUniE)：天气、儿童锁、充电的旧规则与信号；冲突处未直接采信。
6. [《系统预设任务全集》](https://bytedance.larkoffice.com/wiki/SorvwQ413iamTRkzSxvcVPWtnYc?psg_id=6448603523554308546&refer_index=1&refer_type=citation&sheet=g4s4FB)：四任务最新表格口径。
7. [赛力斯《天气/路况保护》](https://sai-seres.feishu.cn/wiki/VXEdwlChniB4lMkqQT9cPxPqnFh)：天气场景、任务开关、卡片确认、动作与恢复需求。
8. [赛力斯《任务中心 PRD》](https://pq3b44yw2t9.feishu.cn/wiki/XvfUwvUCiiOByIkE8eBcVWx3nke)：任务中心展示、状态管理、操作转发、接入业务维护真实状态。
9. [《赛力斯任务中心 PRD｜9 月 1 日版》](https://bytedance.larkoffice.com/wiki/LUKKwMTNaiAd53kdmpkc5oILn5e)：系统预设任务展示范围、任务单元待补、一期操作和列表推送/拉取。
10. [《Task 任务管理设计》](https://bytedance.larkoffice.com/wiki/B2WYwXFOIigKzbk7aSYcJWmZn2E)：Task/Run/Event/Snapshot 产品对象和动态任务链；资料同时说明静态预设当前不在 Task Service 计划内，因此本文只借用对象思想。
11. [《AIDV Task Service 与任务岛、即时交互卡技术方案》](https://bytedance.larkoffice.com/wiki/HzAtw3ABQif5c8kwKS8cL1x9nhf)：动态/长时任务与任务岛、即时卡的技术方向；不冒充系统预设任务现状。

### 本地核验材料

1. [9 月 1 日完整时间轴](/Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/触发器包含条件/Meeting-Summary-2026-09-01-系统预设任务评审-完整时间轴-v02.md)
2. [9 月 1 日争议与待办](/Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/触发器包含条件/Meeting-Summary-2026-09-01-系统预设任务评审争议与待办.md)
3. [7 月 28 日 AIVA 即时交互卡原始会议稿](/Users/bytedance/Desktop/3.23/产品/1-原始素材/会议纪要/AIVA交互卡静态advisor链路交互消息盒子评审.md)
4. [8 月 31 日触发器推理技术评审](/Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/触发器包含条件/Meeting-Summary-2026-08-31-触发器支持推理触发服务端技术方案评审.md)
5. [7 月 3 日晓伟 Advisor/任务中心会议](/Users/bytedance/Desktop/3.23/产品/1-原始素材/会议纪要/7.3晓伟advisor会议.md)
6. [8 月 18 日赛力斯自闭环主动服务梳理会议](/Users/bytedance/.codex/attachments/a298f8bc-0119-4043-8cf4-6c66a49736f6/pasted-text.txt)

### 证据使用原则

- 当前表格和最新会议优先于旧 SLS 稿；冲突不静默合并。
- 任务中心“列表更新”不自动证明 Trigger 获得“运行状态”。
- 动态 Task Service 设计不自动证明系统预设任务已接入。
- VUI/可见即可说能力存在不自动证明天气或充电已经接通。
- 卡片展示、按钮点击、模型结果、RPC ACK 都不等于真实车辆成功。
- 截至当前资料，字节与赛力斯四任务的最终边界仍需专项确认。

---

# 附录 A｜一页式任务定义模板

| 信息组 | 必须填写 |
|---|---|
| 用户场景 | 用户在什么情况下遇到什么问题 |
| 任务类型 | 系统预设/动态任务；长期实例还是一次性 |
| 任务中心 | 是否展示、是否启停/删除、默认状态、失败回滚 |
| 状态真源 | 谁保存、范围是车辆还是账号、怎样恢复 |
| 处理拓扑/事件产生权 | topology=EDGE/CLOUD/HYBRID；producer=EDGE/CLOUD/NONE；为什么；怎样防双发 |
| 激活事件 | 变化沿、状态、时间事件还是模型事件 |
| 输入 | 来源、ID、枚举、单位、频率、时间、质量 |
| 规则 | AND/OR、阈值、三值、时序、退出 |
| 治理 | 防抖、去重、频控、处理中锁、人工覆盖 |
| 模型/工具 | 谁调用、输入、结果、质量、时效、异常 |
| 交互 | 静默/告知/确认；卡型、文案、按钮、TTS、语音/点击路由 |
| 执行前复核 | 最新要重读哪些状态、授权/模型有效期 |
| 动作 | 能力、参数、权限、幂等、安全门禁 |
| 成功 | 哪个真实状态达到什么值、多久超时 |
| 结束 | 拒绝、关闭、超时、成功、失败、冷却、恢复 |
| 观测 | 日志、指标、告警、回放、测试证据 |
| Owner | 产品、数据、Trigger、交互、执行、测试 |

# 附录 B｜评审结论记录表

| 议题 | 会前状态 | 会议结论 | Owner | 正式产物 | 截止时间 | 是否阻塞 |
|---|---|---|---|---|---|---|
| 任务中心控件 | 资料冲突 |  |  | 交互/状态说明 |  | 是 |
| 状态真源与同步 | 待确认 |  |  | 技术时序/接口 |  | 是 |
| 处理拓扑与唯一 RunEvent 产生权 | 待确认 |  |  | 架构方案 |  | 是 |
| 天气卡/VAS | 方向有，接入待确认 |  |  | 联调合同 |  | 是 |
| 充电 Query/DT/VQA | 主链有，接口待确认 |  |  | 云端时序 |  | 是 |
| 充电卡型/回流 | 待确认 |  |  | VUI 合同 |  | 是 |
| 端侧复核/车控/回读 | 产品底线有，接口待确认 |  |  | 端侧时序 |  | 是 |
| 儿童锁安全 | 未会签 |  |  | 安全结论 |  | 是 |
| 后视镜唯一规则 | 资料冲突 |  |  | 定稿规则 |  | 是 |
| 字节/赛力斯边界 | 未定 |  |  | RACI |  | 是 |
