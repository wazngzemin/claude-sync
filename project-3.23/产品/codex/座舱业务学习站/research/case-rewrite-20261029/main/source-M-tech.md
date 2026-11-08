# \[技术方案\]输入管理模块设计

# 背景与边界

<div class="callout">

Director 是交互与推理中枢；同一 Chat 同一时刻只允许一次 Director 执行生效。输入管理模块（Input Manager）位于各类输入入口与 Director 之间，将并发、乱序、多源的输入组织成可串行执行的 Director 调用。

</div>

## 现状与问题

用户Query、模拟Query、主动消息、有效Event和工具Feedback都会触发 Director 推理。同一时刻内，这些输入可能先后或同时到达，当前各自影响整体DT推理和TTS播报，没有统一的管理模块。

<table><tbody>
<tr>
<td>

现状问题

</td>
<td>

影响

</td>
<td>

本次收敛方向

</td>
</tr>
<tr>
<td>

输入合并、打断和等待分别由多音区缓存、Director、主动推荐逻辑处理

</td>
<td>

不同来源的优先级、合并窗口和完成条件难以统一

</td>
<td>

Adapter 标准化输入，输入管理模块统一准入和排队等待

</td>
</tr>
<tr>
<td>

播放完成依赖临时事件键，进度依赖另一条数据库链路

</td>
<td>

难以按 TaskRound 维护播放生命周期和可靠推进

</td>
<td>

新增统一结构化的播放事件（包含开始播报、播报时长、播报完成、打断等），保留旧逻辑与原进度链路支持旧版本

</td>
</tr>
<tr>
<td>

当前 RoundID 来源于历史 ID 与本地 ReAct 次数

</td>
<td>

不能直接承担跨实例候选失效和正式输出校验

</td>
<td>

新链路统一使用 DirectorExecutionID，并显式登记播放依赖

</td>
</tr>
<tr>
<td>

执行取消主要依赖本地上下文和轮询

</td>
<td>

取消后仍可能出现模型文本输出、工具调用或历史写入

</td>
<td>

Redis 原子许可裁决，输出出口再次核验身份

</td>
</tr>
</tbody></table>

## 重点关注内容

<table><tbody>
<tr>
<td>

角色

</td>
<td>

阅读重点

</td>
</tr>
<tr>
<td>

产品 / 项目

</td>
<td>

第 1、3、7、8 章：范围、真实场景、现有链路影响和客户端依赖

</td>
</tr>
<tr>
<td>

服务端

</td>
<td>

第 2、4、5、6、7、9 章：模块边界、调度规则、架构、存储、迁移和工作包

</td>
</tr>
<tr>
<td>

客户端（TTS/HMI）

</td>
<td>

第 8 章：新增TTS状态事件

</td>
</tr>
<tr>
<td>

测试

</td>
<td>

第 3、4、5 章：按八类用户场景、状态结束路径和关键并发边界验收

</td>
</tr>
</tbody></table>

## 关联资料

<table><tbody>
<tr>
<td>

类型

</td>
<td>

链接

</td>
</tr>
<tr>
<td>

Meego 需求

</td>
<td>

[\[需求\]【AI汽车】输入管理模块](https://meego.larkoffice.com/telematics/story/detail/7331319732)

</td>
</tr>
<tr>
<td>

本需求 PRD

</td>
<td>

[输入管理模块及其策略](https://bytedance.larkoffice.com/docx/JgpgdAjV0ol49vxTFSPcBpG3nVh)

</td>
</tr>
<tr>
<td>

Director PRD

</td>
<td>

[对话推理引擎\(Director\) PRD](https://bytedance.larkoffice.com/docx/SviidyZOwoWWd3xFucLczZLdnqg)

</td>
</tr>
<tr>
<td>

技术方案 \&amp; 录屏

</td>
<td>



</td>
</tr>
<tr>
<td>

测试 Case \&amp; 录屏

</td>
<td>



</td>
</tr>
</tbody></table>

## 本期范围

<div class="callout">

**本期是 Input Manager 的第一阶段，****保证****基础正确性****和****完整闭环。****设计上兼容豆包IP和非豆包IP项目，作为主线通用模块****。**输入来源先限定为用户 Query、主动推荐消息、各类会触发DT推理的有效Event、同步Tool Feedback；调度策略先限定为 P0 打断、P1 等待处理（P0 为用户输入和高优任务，P1 为其它输入）。

</div>

InputManager的覆盖范围为DT所有的有效输入，具体范围及处理策略如下：

<table><tbody>
<tr>
<td>

范围

</td>
<td>

输入类型

</td>
<td>

优先级

</td>
<td>

本期处理

</td>
</tr>
<tr>
<td>

单音区用户Query

</td>
<td rowspan="3">

有效User Input

</td>
<td rowspan="3">

P0

</td>
<td rowspan="3">

作为最高优先级（P0）接入；根据当前 Chat 状态进入立即处理、首 Token 前合并或播报中断流程；具体按第 4\.1 节模型完成与播放状态矩阵准入，当模型推理未完成时可合并旧当前轮输入；推理完成后旧回复和工具调用只作为上下文。

</td>
</tr>
<tr>
<td>

多音区用户Query

</td>
</tr>
<tr>
<td>

模拟用户Query

</td>
</tr>
<tr>
<td>

高优任务

</td>
<td>

高优任务

</td>
<td>

P0

</td>
<td>

同用户Query一样作为同等最高优先级接入，处理策略一致（当前暂无此输入场景）。

</td>
</tr>
<tr>
<td>

主动服务

</td>
<td>

有效advice

</td>
<td>

P1

</td>
<td>

作为普通优先级（P1）接入；已有 Task Service 与静态 advice 均接入。Task 来源保留 `task\_id` / `task\_run\_id`；静态 advice使用现有逻辑，不以 advisor 类型或空 task\_run\_id 判重。完整内容与来源关联先交给 Adapter，再清理旧推荐缓存。

</td>
</tr>
<tr>
<td>

~~独立异步 Function call 结果（后续扩展）~~

</td>
<td>

~~其它~~

</td>
<td>

~~不适用~~

</td>
<td>

~~当前无独立异步 ToolFeedback 场景，不作为首期上线前置。若后续接入，另行定义 callback / 结果查询、身份和交互卡时机；不得把同步工具的流式返回等同于该能力。~~

</td>
</tr>
<tr>
<td>

同步Tool Feedback

</td>
<td>

有效ToolFeedback

</td>
<td>

P1

</td>
<td>

同步工具仍按现有方式执行；同一模型轮 action\_list 的结果收集成完整反馈批次，作为下一次模型调用的 ToolFeedback 输入，经 Input Manager 取得续轮调用

</td>
</tr>
<tr>
<td>

有效Event

</td>
<td>

其它

</td>
<td>

P1

</td>
<td>

作为普通优先级接入\(P1\)接入，模型未完成推理且未启播时参与合并重推；其它忙状态等待，并在下次推理窗口合批。

</td>
</tr>
<tr>
<td>

客户端播报状态与中断上下文



</td>
<td>

其它



</td>
<td>

P1



</td>
<td>

客户端播放事件回传 TaskRoundID；新链路 TaskRoundID 与 DirectorExecutionID 使用同一个值，服务端据登记关系维护输出状态。播放事件直接更新 runtime，不进入 waiting。未拒识插话的 last\_talk\_content 随用户 Query 进入中断上下文；拒识后需要重新推理的独立恢复 Event 按业务输入准入并取得新的执行 ID。

</td>
</tr>
<tr>
<td>

客户端接管（端侧召回并执行）

</td>
<td>

其它

</td>
<td>

P1

</td>
<td>

在原逻辑基础上新增逻辑接管，主要处理端侧接管后因各种原因未及时上报，云端仍在继续推理的badcase场景；客户端携带原 `request\_id` 上报已完成请求。服务端结束对应 Input，并使其关联的云端执行失效，不影响其他等待 Input

</td>
</tr>
</tbody></table>

## 非目标

1. 高优任务抢占不在本期范围；设计**结构中预留优先级**，但本期不启用策略。

2. 有独立 UI 推送且不进入 Director 播报链路的 AIGC 任务暂不纳入本期；生图等具体链路确认后，再决定是否接入 Input Manager（异步FC或ToolFeedback）。

3. 首期继续使用同步 Tool 执行方式，但其下一次模型调用必须重新经过 Input Manager 准入。独立异步 callback / 持久结果回流当前不存在，后续单独设计。

4. 本期不设置业务队列长度上限，先通过埋点及告警观察队列压力；同时提供按 `channel \+ vehicle\_id` 定位并清理当前 Chat 等待队列的应急接口。

## 其它背景输入

1. TTS打断和恢复场景参考 [AI汽车语音基础体验链路OnePager](https://bytedance.larkoffice.com/wiki/GBcCw5c6xiWvGukPMQgcMiuKnEc#share-Z0BndRWz2oog2Ax5fEvcTPRRnDG)，主要场景如下：

    1. 多人场景下，通过流式拒识模块判断为不拒识时则打断TTS播报（可恢复）

    2. 多人场景下，以豆包开头的会打断TTS播报（可恢复）

    3. 单人场景下，ASR超过2字时立即打断（不恢复）



# Input Manager 定义、边界与术语

## 定义

<div class="callout">

Input Manager 位于各类输入入口与 Director 之间。它接收 Adapter 标准化后的 Input，根据 ChatRuntimeState、Input 的优先级与合并属性，以及当前执行是否仍可安全重放，完成立即处理、中断、合并、等待或结束。它不调用模型，也不判断用户最终意图。

</div>

它解决三个工程问题：

2. 每条 Input 始终有明确位置：正在准入、等待处理、正在处理或已经结束。

3. 每个 Chat 始终有明确运行状态：空闲、Director 正在处理但尚未输出，或客户端仍在展示 / 播报。

4. 同一 Chat 最多一个有效推理候选和一个未撤销的正式输出；两者引用同一套 DirectorExecutionID，可以分别指向不同执行。新候选预跑不使前序合法输出失效；已被 Tool 接受的真实结果不会因来源执行失效而丢失。

## 模块边界

<table><tbody>
<tr>
<td>

模块

</td>
<td>

负责

</td>
<td>

不负责

</td>
</tr>
<tr>
<td>

Input Manager

</td>
<td>

Input幂等与准入；输入队列管理；维护Chat状态、DT执行状态；多音区合并处理； 消费TTS播放及播报完成事件；协助TTS打断恢复

</td>
<td>

不做语义推理、不判断最终意图；不合成音频、不操作播放器；不回滚已执行 Tool

</td>
</tr>
<tr>
<td>

拒识

</td>
<td>

负责用户语音识别结果是否应该交给DT响应；用户插话场景为TTS打断提供辅助信息；返回判定阶段、结果、来源和原因

</td>
<td>

不负责Input通过后的调度逻辑

</td>
</tr>
<tr>
<td>

TTS

</td>
<td>

将DT可输出的文本转为音频并传输；维护音频流及 TaskRound 内容边界；支持关联请求取消；提供音频时长、字词时间戳等恢复素材；端侧完成播放、暂停、停止及进度/终态上报

</td>
<td>

不决定是否调用 Director 恢复TTS播报

</td>
</tr>
<tr>
<td>

Director

</td>
<td>

基于本次调用提供的 Input、对话历史和中断上下文完成推理，生成回复或 Tool call；~~结束时明确上报本次执行是否仍有客户端输出待完成~~

</td>
<td>

不维护跨实例等待队列，不决定旧执行结果能否继续下发

</td>
</tr>
<tr>
<td>

客户端（TTS/HMI）

</td>
<td>

本地平滑停播；从音频帧 reply\_value 读取 TaskRoundID，在 STARTED / PROGRESS / FINISHED / ABORTED 中原样回传。新链路 TaskRoundID = DirectorExecutionID；客户端不生成、不解析、不比较 ID 大小，并上报端侧召回的执行结果。

</td>
<td>

不决定云端 Input 的排队、合并和恢复

</td>
</tr>
<tr>
<td>

Task Service

</td>
<td>

Task / Run 生命周期、Trigger、执行截止时间和最终状态；主动消息提供 `task\_run\_id`

</td>
<td>

不决定 Chat 忙时何时进入 Director

</td>
</tr>
<tr>
<td>

Tool / Agent

</td>
<td>

执行已被接受的具体能力调用并返回结果；重试沿用同一个 `tool\_call\_id` 或现有业务身份

</td>
<td>

已被接受的真实工具结果不能因旧模型失效而丢弃；结果由统一收集出口交回 Input Manager，不直接恢复失效 graph 或绕过调度播报。宕机后的结果补取依赖下游查询 / callback，首期不假设已有。 

</td>
</tr>
</tbody></table>

## 字典

<table><tbody>
<tr>
<td>

名词

</td>
<td>

释义

</td>
</tr>
<tr>
<td>

Input

</td>
<td>

Input Manager 接收和调度的最小业务事件，包括DT所有有效的输入。如：用户 Query、SERES Task Service 主动消息、有效Event，以及异步 Tool / Agent 结果（暂无）。

</td>
</tr>
<tr>
<td>

Chat

</td>
<td>

一次连续对话，直接使用现有 `chat\_id`。只有同一 Chat 内的 Input 才共享运行状态和等待区

</td>
</tr>
<tr>
<td>

Director

</td>
<td>

交互与推理中枢。一次处理 Input Manager 组织好的一组 Input，负责理解语义、生成回复和 Tool call

</td>
</tr>
<tr>
<td>

Adapter

</td>
<td>

接入适配层，把不同来源转换成统一 Input，并补齐来源身份、优先级和合并属性；Adapter 不做模型推理

</td>
</tr>
<tr>
<td>

来源身份

</td>
<td>

`source\_type \+ source\_id`，用于识别同一业务事件及其重试。source\_id 复用 `request\_id`、`task\_run\_id` 或 `tool\_call\_id`

</td>
</tr>
<tr>
<td>

InputState

</td>
<td>

描述一条 Input 在哪里：RECEIVED 正在准入；WAITING 正在等待；PROCESSING 已进入当前 Director 执行；FINISHED 已结束并记录原因

</td>
</tr>
<tr>
<td>

ChatRuntimeState

</td>
<td>

描述整个 Chat 正在做什么：IDLE 无有效执行；PROCESSING 已启动 Director 但还没有给用户的首 Token；RESPONDING 已开始输出或客户端仍在播报

</td>
</tr>
<tr>
<td>

DirectorExecutionID

</td>
<td>

一次 Director 执行的全局唯一字符串身份；Redis 原子保存成功后才交给 Director。首次推理、ToolFeedback 续轮、打断重算等DT重新执行时使用新 ID；同次重传及同候选预跑转发布复用原 ID。

</td>
</tr>
<tr>
<td>

准入动作

</td>
<td>

- `DISPATCH`：立即启动 Director

- `INTERRUPT`：使当前执行失效

- `MERGE`：多条可安全重放的 Input 进入同一次新执行

- `QUEUE`：进入等待区

- `DROP`：明确结束并记录原因

</td>
</tr>
<tr>
<td>

首段可展示文本

</td>
<td>

第一段已经通过 DirectorExecutionID 校验、可以实际展示或播报给用户的文本；不包含模型中间状态、思维过程或 Tool call

</td>
</tr>
<tr>
<td>

执行重放边界

</td>
<td>

当前执行尚未发起外部副作用时，原 Input 可以与新 Query 合并重推；一旦 Tool call 被允许下发，原 Input 就不能再作为可执行输入重放，只能作为中断上下文

</td>
</tr>
<tr>
<td>

执行身份与许可校验

</td>
<td>

推理候选提交时与 ActiveComputeExecutionID 做相等校验；正式输出、TTS、新业务 Tool call 和已交付派生历史写入按 OutputPermit、CommittedOutputExecutionID 及撤销状态校验。身份不匹配的旧候选不能继续产生新影响；前序合法输出不因新候选预跑失效，已被 Tool 接受的真实 feedback 不被拦截。

</td>
</tr>
<tr>
<td>

输出身份

</td>
<td>

新链路 TaskRoundID = DirectorExecutionID，不再生成独立的输出编号。服务端通过 channel \+ vehicle\_id \+ chat\_id 及已登记执行定位、校验归属；TTS 音频帧 reply\_value 下发 TaskRoundID，客户端播放事件原样回传。一个执行的多个 TTS Provider 共用此 ID，Provider 仍保留各自子流身份；没有音频的执行不建立播放对象。

</td>
</tr>
<tr>
<td>

优先级（P0 / P1）

</td>
<td>

P0 是User Input和高优任务，可以抢占当前云端执行；P1 是 Task Service 主动消息、有效Event和~~异步 Tool feedback~~，Chat 空闲时立即处理，忙时等待

</td>
</tr>
<tr>
<td>

等待区（mergeable / isolated）

</td>
<td>

WAITING Input 的存放位置。mergeable 可与其他可合并 Input 同批处理；isolated 必须单独处理。该属性不赋予 P1 抢占权

</td>
</tr>
<tr>
<td>

中断上下文

</td>
<td>

回答被打断时保留的原输入、已播文本、未播文本和原执行身份，帮助 Director 衔接；它不是新的用户指令，也不参与排队

</td>
</tr>
<tr>
<td>

Tool feedback

</td>
<td>

Tool / Agent 的成功、失败或结果数据。原执行内同步结果由原执行消费；~~异步结果形成新 Input，重新经过准入~~

</td>
</tr>
<tr>
<td>

客户端接管

</td>
<td>

客户端本地完成某条用户请求后，携带原 `request\_id` 上报；服务端结束对应 Input 并使其云端执行失效，避免重复反馈

</td>
</tr>
</tbody></table>

# 典型 Case 图组

每个场景只保留用户视角泳道图，按图中序号说明用户说了什么、客户端展示或播报什么，以及服务端如何衔接；状态竞争与执行身份等技术细节统一放在第 4 章。客户端泳道统一承载 ASR、TTS/HMI、本地停播和本地执行。

## 场景一：用户连说两件事，合并一起处理

## 场景二：播报中用户插话（未拒识），合并新输入和旧播报文本一起处理

> **分不同恢复策略**
> 
> 

- 前提：第一轮Query A（QA）正在TTS播报，用户插入第二轮Query B（QB），QB未拒识。端上会打断QA的TTS播报并上报播报进度，云端会合并QB和QA播报文本及进度成一个Input给Director

- 前提：第一轮Query A（QA）正在TTS播报，用户插入第二轮Query B（QB），QB未拒识。端上会打断QA的TTS播报并上报播报进度，云端会合并QB和QA播报文本及进度成一个Input给Director

## 场景三：播报中用户插话（拒识），旧输出未播报内容当Event推给端上触发上云（当前策略）

## 场景四：播报中，Task service 任务的主动提醒排队

## 场景五：一连串提醒，排队合并在一起处理

## 场景六：用户说开空调被端侧召走，云端结束该请求、其他等待提醒不受影响

## 场景七：Tool 已办完但客户端还在说（Feedback 排队到下一轮）

## 场景八：Tool 执行中用户反悔（对话可打断，副作用不自动回滚）

# 调度规则与技术处理流程

本章先统一说明状态、准入和正确性约束，再用八类场景展示技术处理流程。核心区别是当前轮模型是否完整输出、客户端是否实际起播，以及该轮工具是否已经放行；场景一和场景二共用同一个调度入口，但输入和上下文组装不同。

## 状态、准入与约束

Input Manager 只依据 Chat 当前运行状态和 Input 的调度属性做工程决策，整个准入过程不调用模型；语义理解仍由 Director 完成。**状态与****执行身份**

<table><tbody>
<tr>
<td>

概念

</td>
<td>

取值与含义

</td>
<td>

回答的问题

</td>
</tr>
<tr>
<td>

InputState

</td>
<td>

- RECEIVED：刚到服务端，正在做幂等与准入判断

- WAITING：暂存在等待区

- PROCESSING：已经进入当前 Director 执行

- FINISHED：不再参与调度，并记录结束原因

</td>
<td>

这条 Input 现在在哪里

</td>
</tr>
<tr>
<td>

ChatRuntimeState

</td>
<td>

- IDLE：当前没有有效 Director 执行，也没有客户端输出待完成

- PROCESSING：Director 已启动，但还没有给用户的首 Token

- RESPONDING：已经开始输出，或客户端仍在播报

</td>
<td>

当前 Chat 正在做什么

</td>
</tr>
<tr>
<td>

DirectorExecutionID

</td>
<td>

每次新的 Director 执行使用现有 GenTID 发号结果的十进制字符串并原子登记；ToolFeedback 发起下一次模型推理也取得新 ID。ActiveComputeExecutionID 标识有效候选，CommittedOutputExecutionID 标识正式输出，二者引用同一套 DirectorExecutionID，不是两套编号；有效性仅校验身份相等及许可，不比较数值大小。

</td>
<td>

哪一个候选可继续推理，哪一个正式输出仍有效

</td>
</tr>
</tbody></table>

**执行重放边界**首 Token 前不等于“什么都没发生”。Director 可能先产生 Tool call，再产生文本。因此 Chat Runtime 额外保存“当前 Input 是否仍可重放”：

<div class="callout">

**与 PRD 的关系（新增工程约束）**：PRD 对\&\#34;首 Token 前\&\#34;统一描述为\&\#34;打断并合并重推\&\#34;。本节的\&\#34;执行重放边界\&\#34;是在其上补充的落地约束——一旦当前执行已放行 Tool call，即便首 Token 未出，也不再把旧 Input 合并重推，只保留为中断上下文。动机是避免同一 Tool 被重复执行、产生重复副作用（车控、下单等）。此约束不改变 PRD 的用户体验目标，仅规避工程上的重复执行风险。

</div>

5. 新执行开始时默认为可重放。

6. 新业务 Tool call 下发前，Input Manager 必须校验该执行的 OutputPermit、CommittedOutputExecutionID 及未撤销状态，并原子标记对应 Input 不可重放；预跑候选不能调用新业务工具。

7. 标记后再调用 Tool；重试必须复用同一个 `tool\_call\_id`。

8. 后续 P0 仍可使旧执行失效，但旧 Input 只能作为中断上下文，不能重新进入可执行 Input 列表。**准入与状态流转**

<table><tbody>
<tr>
<td>

ChatRuntimeState

</td>
<td>

用户 Query（P0）

</td>
<td>

mergeable P1

</td>
<td>

isolated P1

</td>
</tr>
<tr>
<td>

`IDLE`

</td>
<td>

`DISPATCH`

</td>
<td>

`DISPATCH`

</td>
<td>

`DISPATCH`，单独处理

</td>
</tr>
<tr>
<td>

`PROCESSING`

</td>
<td>

- 旧 Input 仍可重放：`INTERRUPT \+ MERGE \+ DISPATCH`

- 已越过 Tool 重放边界：`INTERRUPT \+ DISPATCH`，仅处理新 Query；旧 Input 作为中断上下文

</td>
<td>

`QUEUE`；当前执行与播报结束后，与其他 mergeable P1 合并 `DISPATCH`

</td>
<td>

`QUEUE`；当前执行与播报结束后单独 `DISPATCH`

</td>
</tr>
<tr>
<td>

`RESPONDING`

</td>
<td>

客户端先停播，再执行 `INTERRUPT \+ DISPATCH`；已播 / 未播内容和原 Input 只作为中断上下文

</td>
<td>

`QUEUE`

</td>
<td>

`QUEUE`，保持独立

</td>
</tr>
</tbody></table>

P1 在 `PROCESSING` 和 `RESPONDING` 下都不抢占当前执行。mergeable / isolated 只决定出队后是合并处理还是单独处理；真正需要立即抢占的输入必须定义为 P0。**本期来源映射**

<table><tbody>
<tr>
<td>

来源

</td>
<td>

优先级

</td>
<td>

合并属性

</td>
<td>

说明

</td>
</tr>
<tr>
<td>

用户 Query（单音区、多音区）

</td>
<td>

P0

</td>
<td>

mergeable

</td>
<td>

Chat 忙时按上表中断；是否能带上旧 Input 重推取决于执行重放边界

</td>
</tr>
<tr>
<td>

主动消息

</td>
<td>

P1

</td>
<td>

mergeable

</td>
<td>

每个 Task Run 独立入队，多个提醒可在出队时一起交给 Director

</td>
</tr>
<tr>
<td>

Tool feedback

</td>
<td>

P1

</td>
<td>

isolated

</td>
<td>

保守地单独交给 Director，避免不同 Tool 结果或交互问题被错误拼在同一批

</td>
</tr>
<tr>
<td>

有效Event

</td>
<td>

P1

</td>
<td>

mergeable

</td>
<td>

单独入队，出队时与其它可合并的在同一批输入给DT

</td>
</tr>
<tr>
<td>

TTS 事件 / 客户端接管

</td>
<td>

- 

</td>
<td>

- 

</td>
<td>

属于控制事件，不形成 Input

</td>
</tr>
</tbody></table>

**执行结束与等待区推进**

<table><tbody>
<tr>
<td>

当前执行结果

</td>
<td>

ChatRuntimeState 处理

</td>
<td>

等待区处理

</td>
</tr>
<tr>
<td>

静默、纯 Tool call、首 Token 前失败

</td>
<td>

Director 明确结束且没有客户端输出待完成时，当前 Input 进入 FINISHED

</td>
<td>

同一原子操作中取下一批 WAITING Input；无等待则进入 IDLE

</td>
</tr>
<tr>
<td>

有展示文本但没有 TTS

</td>
<td>

流式文本发送结束后完成当前执行；仅展示不长期占用 RESPONDING

</td>
<td>

取下一批 WAITING Input；无等待则进入 IDLE

</td>
</tr>
<tr>
<td>

存在 TTS 播报

</td>
<td>

Director 结束后仍保持 RESPONDING，直到已登记正式输出的 TaskRound 收到合法播放终态。校验 CommittedOutputExecutionID、登记归属和撤销状态，不按 ActiveComputeExecutionID 拒绝前序合法播放事件。

</td>
<td>

TTS\_FINISHED 与出队在同一原子操作内完成

</td>
</tr>
<tr>
<td>

客户端接管

</td>
<td>

结束对应 request\_id 的 Input，并使其关联执行失效

</td>
<td>

保留其他 WAITING Input，随后正常出队

</td>
</tr>
<tr>
<td>

执行实例失联

</td>
<td>

owner lease 到期后由恢复流程接管；不可重放的 Input 不自动重新执行

</td>
<td>

恢复完成后再决定出队，不能绕过状态恢复直接启动 Director

</td>
</tr>
</tbody></table>

**通用规则**

1. **幂等身份**：使用 `source\_type \+ source\_id` 识别同一业务事件。用户 Query 的 `source\_id` 复用现有 `CoordinationInfo\.RequestID`（端云仲裁已在用的字段）。该字段目前非强制：`CoordinationInfo\.Validate` 中的非空校验被注释，原因是 RTC 等链路上行暂未携带该参数。因此新链路以「用户 Query 具备非空 `request\_id`」为准入前置：满足则按新链路准入；不满足的渠道（如当前 RTC 链路）继续走旧链路，绝不以空 ID 准入，避免不同请求串到同一 Chat 状态。全量前需推动这些渠道（如 RTC）稳定上报 request\_id，否则这些渠道无法进入新链路。Task Service 使用 `task\_run\_id`，云端异步 feedback 使用 `tool\_call\_id`，简单车控异步结果使用原 `request\_id`。

1. **合并属性**：严格按“本期来源映射”提供，不由 Input Manager 或模型临时判断。

2. **Task Service 上行**：每个 Task Run 形成一条独立 Input；相同 `task\_run\_id` 的重复回流只命中幂等，不新增等待项。

3. **主动服务上行**：每个消息作为一个Input入队，出队时将当前所有处于等待的主动服务Input一起合并推理

4. **Tool feedback**：同步结果由原执行消费；异步结果无论原 DirectorExecutionID 是否失效，都形成新 Input。

5. **中断上下文**：只随新的用户 Query 交给 Director，不参与排队，也不能再次触发旧 Tool。

6. **有效期**：本期不引入 Input Manager 业务 TTL；TaskRun 的 `DeadlineAt` 继续由 Task Service 管理。

7. **副作用**：DirectorExecutionID 失效不会回滚已发生的 Tool 副作用；后续 feedback 按现有业务身份正常准入。

8. 输出身份：新链路直接使用 TaskRoundID = DirectorExecutionID，通过 SubTTSState\.reply\_value 下发，客户端播放事件原样回传。服务端校验登记的车辆、Chat、request\_id 和输出状态；新候选预跑不撤销前序输出，已撤销或已经收敛的迟到事件不重复推进 waiting。

9. **故障处理**：Redis 原子更新失败时有限重试后 fail\-closed，禁止绕过 Input Manager 直接调用 Director。**正确性约束**

10. 同一 channel \+ vehicle\_id \+ chat\_id 同一时刻最多一个有效推理候选和一个未撤销的正式输出。ActiveComputeExecutionID 与 CommittedOutputExecutionID 可以不同，但均引用全局唯一 DirectorExecutionID；不存在要求全 Chat 只能有一个有效 ID 的限制。

11. P0 准入、候选切换、首段正式输出放行和新业务 Tool call 放行都通过同一份 Chat Runtime 原子裁决。候选校验 ActiveComputeExecutionID；发布与调用校验正式输出许可及输出身份，禁止只依赖最新推理 ID 判断播放有效性。

12. 首段可展示文本放行时，候选身份、OutputPermit、前序播放依赖和 CommittedOutputExecutionID 切换在同一原子操作中确认；同候选正式发布复用原 DirectorExecutionID，并将 Chat 置为 RESPONDING。

13. Tool call 下发前的输出许可与身份校验、tool\_call\_id 登记和对应 Input 不可重放标记在同一原子操作内完成；调用重试复用原 tool\_call\_id，不重新执行已受理副作用。

14. 执行身份与许可校验拦截失效候选或已撤销输出的新文本、新 TTS、新业务 Tool call 和已交付 History / ChatResource 写入；不拦截前序仍有效的正式输出及已被 Tool 接受的真实 feedback。

15. Go Context cancel 只用于加快旧执行退出，不能代替 DirectorExecutionID 校验。

16. 每条 Input 都能审计 InputState、准入动作、DirectorExecutionID、FINISHED 原因和时间。

17. 静默、纯 Tool、失败、无 TTS 和有 TTS 五类结束路径都必须能把 Chat 推进到下一条 WAITING Input 或 IDLE。

## 八类场景的技术处理流程

第 3 章回答“用户经历了什么”；本节回答“服务端如何保证这个结果”。技术图统一使用 InputState、ChatRuntimeState 和 DirectorExecutionID 描述并发关系。

### S1 首 Token 前补充：原子竞争、旧执行失效、合并重推

A 已在执行 E\_old 中处理，ChatRuntimeState 为 PROCESSING。本图展示 A 尚未放行 Tool call、仍可安全重放的路径：B 作为 P0 准入后，Input Manager 原子撤销相关旧候选及输出，登记新的全局唯一执行 ID E\_new，并把 A、B 一起交给 Director。若 E\_old 已放行 Tool call，A 已越过重放边界；E\_new 只处理 B，A 和真实工具事实仅作为中断上下文。E\_old / E\_new 是示意身份，不是序号，不能通过加一计算。

### S2 播报中用户插话（未拒识）：客户端先停播，云端切换执行

A 正在 E\_old 中输出，ChatRuntimeState 为 RESPONDING。客户端及时停播并上报 E\_old 的 TaskRoundID 及已播 / 未播内容；B 到达后，Input Manager 原子撤销相关旧候选及输出，登记新执行 E\_new。E\_new 的可执行 Input 只有 B，A 作为中断上下文，不重新触发已发工具。E\_old 的晚到新文本和新 Tool call 因身份或许可失效被拦截；新旧 ID 不比较大小。

### S3 播报中用户插话（拒识）：客户端先停播，云端下发Advice恢复

本场景沿用拒识后独立恢复 Event 的业务路径：若原输出已停止，需要把未播内容通过 Event 重新交给 Director，则原 TaskRound 结束或被撤销，恢复 Event 准入后生成新执行 E\_new，新的 TTS 使用 TaskRoundID = E\_new，不能恢复已 ABORTED 的播放对象。若客户端只是临时暂停且能继续原播放对象，则沿用 E\_old 和原 TaskRoundID，不创建新执行；两种恢复路径不能混用。

### S4 非高优输入：等待、播报完成后处理

ChatRuntimeState 为 RESPONDING 时，Task Service 主动消息 B 进入 WAITING；允许预跑的未发布候选按第 8 章规则处理，但不停止前序播放。已登记输出的 TaskRound 收到合法 FINISHED 后，Input Manager 原子收敛播放并 Evaluate：已有有效候选则释放原候选、不换 ID；没有候选且需要执行 B 时生成新 DirectorExecutionID。相同 task\_run\_id 的重复回流不新增等待项。

### S5 多条等待 Input：可合并的一起处理，独立交互的单独处理

B、C、D 是 mergeable Task Service 主动消息，进入 WAITING。出队后在同一次新执行 E\_new 中处理，E\_new 使用全局唯一 TID，不由上一执行 ID 加一得到；若该批已在有效候选中预跑，则播放门解除后发布同一候选，不重新分配 ID。

### S6 客户端接管：结束对应 Input，保留其他等待 Input

客户端携带 B 的 request\_id 上报已经完成。Input Manager 将 B 置为 FINISHED（客户端接管），原子撤销处理 B 的相关候选和输出 E\_old；保留 A，并在需要重新执行时生成全局唯一 E\_new。云端不再次输出 B 的结果，其他等待 Input 不受影响。

### S7 Tool feedback 回流：作为新 Input 等待下一次执行

已被 Tool 接受的真实 feedback F 不因来源执行失效而丢弃；异步 F 形成 isolated P1 Input，忙时排队。同轮完整同步工具批次收集后，经 Input Manager 取得下一次模型推理许可并生成新执行 ID，可按第 8 章预跑；原同步工具结果收集阶段仍归原执行。正式输出等待已登记前序 TaskRound 解除播放门，发布同候选时不换 ID。云端异步结果用 tool\_call\_id，简单车控异步结果用原 request\_id 做来源幂等。

### S8 Tool 执行中用户反悔：新 Query 切换执行，feedback 均正常准入

A 的 Tool call 已放行，A 不可重放。B 到达后，Input Manager 撤销相关旧候选及输出 E\_old，只把 B 作为可执行 Input 交给新执行 E\_new；A、已发 Tool 和旧回答作为中断上下文。Director 决定是否发起 B 的新工具动作，真实 feedback\(A\) 与 feedback\(B\) 各自正常回流。E\_new 为新生成的唯一 ID，不是 E\_old 的递增值。

<div class="callout">

**工程边界**

1. Input Manager 负责幂等、排队、原子执行切换、执行重放边界、身份校验和审计。

2. 可获得的tool feedback都保留，由统一出口进入下一模型推理；是否回复、如何解释由 Director 基于当前轮上下文决定。

3. DirectorExecutionID 只阻止失效执行继续产生新影响，不删除已经发生的真实 Tool 结果。

</div>

# 整体架构与状态机

架构原则：Input Manager 是 AIDV 进程内模块，Redis 保存跨实例协调状态；本地 cancel 只用于降低退出延迟。Redis 原子状态迁移决定哪次 Director 执行有效，输出身份校验负责拦截旧执行的新文本、新 Tool call 和派生落库；已被 Tool 接受的真实 feedback 始终正常回流。

<div class="callout">

现状与新建边界：底层 Redis CAS2、CAD、SetNX、Eval 可复用；现有 GraphState\.Round 是单次 Planner 流程内的 ReAct 次数，GetRoundID\(\) 拼接 ChatHistory\.ID 和 Round，已作为 TaskRoundID 下发，但不具备跨实例执行失效控制。新链路由 Input Manager 生成全局唯一 DirectorExecutionID，直接用作 TaskRoundID；ChatRuntimeState、候选 / 输出引用、原子许可和 owner lease 是新建协议。改造不只是字段改名，也不沿用多音区毫秒时间戳生成执行身份。

</div>

## 架构图

## ChatRuntimeState 结束与推进

ChatRuntimeState 描述对用户的运行态，推理候选与正式输出分别由 ActiveComputeExecutionID、CommittedOutputExecutionID 引用。前序输出仍播放时可预跑新候选，Chat 保持 RESPONDING；P1 可替换未发布候选但不能撤销前序播放，P0 按中断边界撤销相关输出和候选。

18. Input 被 `DISPATCH` 后，Chat 从 `IDLE` 进入 `PROCESSING`。

19. 首段可展示文本通过身份校验后，Chat 从 `PROCESSING` 进入 `RESPONDING`。

20. Director 静默、只产生 Tool call 或首 Token 前失败，且没有客户端输出待完成时，直接完成当前 Input。

21. 有文本无 TTS 时，正式流式输出结束后完成对应执行；有 TTS 时保持 RESPONDING，等待登记 TaskRound 的合法终态。播放校验依据正式输出身份和撤销状态，不与当前推理候选 ID 比较。

22. 当前输出完成后，Input Manager 原子收敛播放并 Evaluate：若已有有效候选则按 OutputPermit 发布同一候选，复用其 ID；若需新执行则生成新 TID 并登记；没有候选和 waiting 才进入 IDLE。

23. owner lease 过期不等于业务完成；恢复先撤销失联候选并按重放边界决定是否新建执行，不因预跑实例失联直接撤销前序合法播放。重新执行模型必须使用新的全局唯一 ID。

# 核心数据与存储

## 核心数据结构

以下为设计伪代码，字段在开发时与现有 `types\.ChatRequest` 对齐：

**执行 ID 的生成与 TaskRoundID 关联**

**复用现有实现：**`biz/infrastructure/id\_generator/id\.go` 的 `GenTID\(ctx\)` 已封装服务 TID 发号器；`biz/service/taskservice/manager\.go` 已按同样方式生成实体 ID 并拒绝零值。此处复用发号能力，不复用已有 Task / Run / Agent 的具体 ID。DirectorExecutionID 和 TaskRoundID 对外及 Redis 序列化均保留为十进制字符串，避免客户端数值精度损失。

```Go
id, err := id_generator.GenTID(ctx)
if err != nil {
    return err
}
if id == 0 {
    return errors.New("generated director execution id is zero")
}
directorExecutionID := strconv.FormatUint(id, 10)
taskRoundID := directorExecutionID
```

上述发号成功后仍须执行 Input Manager 的来源幂等与执行原子登记；生成 ID 不代表获得执行许可。若同次调度已有登记结果，直接读取并复用原 DirectorExecutionID，不重复发号或启动执行。

1. 生成方：Input Manager 创建一次新执行时直接复用现有 id\_generator\.GenTID\(ctx\)，不新增发号器或命名空间。该接口返回 \(uint64, error\)，沿用服务已初始化的 TIDClient；使用 strconv\.FormatUint\(id, 10\) 得到 DirectorExecutionID 字符串。首次推理、完整 ToolFeedback 续轮、打断合并重算、故障恢复后重新运行模型均重新发号；同次调度重传与同候选预跑转发布复用原 ID。调用失败或返回 0 时不得登记、启动执行或发布输出，不回退到时间戳或其他生成方式。不依赖 ChatHistory\.ID、Round\+\+ 或 Redis 递增计数器，也不把发号值大小作为执行顺序。

2. 原子登记：候选 TID 先在服务端生成，再随来源幂等检查、旧候选失效、ActiveComputeExecutionID 切换、Inputs 与前序播放依赖一起提交 Redis。生成不等于授权，只有原子登记成功的执行才能启动；冲突未提交的 ID 不下发。

3. 重试与恢复：同次调度重传先读取已登记执行并复用其 ID，不重复启动；请求超时但提交结果未知时先查询确认，不自行换 ID。若明确决定重新执行模型，则先原子撤销旧候选再登记新 ID。消息重传、工具调用重试、同候选 RUNNING / READY 转正式发布均不换执行 ID。

4. 输出引用：ActiveComputeExecutionID 是当前推理候选，CommittedOutputExecutionID 是正式输出，二者引用同一全局唯一 ID 体系但可以不同。P1 重算未发布候选不撤销前序输出；P0 按中断策略撤销相关候选和输出。所有身份校验只比较相等，不从 TID 推导先后。

5. 播放身份：新链路 TaskRoundID = DirectorExecutionID。预跑期间不向客户端登记或下发新的播放对象；取得 OutputPermit 后才登记 TaskRound 及归属并发音频。同一次执行的文本分段、多个 TTS Provider 和工具直接回复的音频沿用同一 TaskRoundID；无音频执行记录 NO\_AUDIO，不等待播放事件。

6. 上一轮依赖：WaitForTaskRoundID 显式记录阻塞本次输出的前序播放身份，不能用当前 ID 减一或取最近一轮。E\_play 正在播放、E\_stale 候选已废弃、E\_next 正在预跑时，E\_next 仍等待 E\_play；E\_play 的合法 FINISHED 解除该依赖后发布 E\_next，ID 不变。

7. 暂停与重新执行：临时暂停后继续同一未结束播放对象时沿用原 ID；已 ABORTED 的 TaskRound 不恢复。拒识后的独立恢复 Event 若重新进入 Director 推理，或故障后重新生成回复，必须创建新执行和新的同值 TaskRoundID。

<table><tbody>
<tr>
<td>

身份或引用

</td>
<td>

生成 / 关联

</td>
<td>

用途

</td>
</tr>
<tr>
<td>

`DirectorExecutionID`

</td>
<td>

Input Manager 为每次新执行调用 id\_generator\.GenTID\(ctx\)，将 uint64 用 strconv\.FormatUint\(id, 10\) 转为字符串，再原子登记

</td>
<td>

唯一执行身份；不表达顺序

</td>
</tr>
<tr>
<td>

`TaskRoundID`

</td>
<td>

新链路直接取 DirectorExecutionID，不独立生成

</td>
<td>

音频分组、TaskRoundStart / End、客户端播放事件

</td>
</tr>
<tr>
<td>

`Round`

</td>
<td>

GraphState 本地 ReAct 次数，继续保留统计用途

</td>
<td>

不能生成执行或播放身份

</td>
</tr>
<tr>
<td>

`request\_id / ChatHistory\.ID`

</td>
<td>

沿用来源与历史记录身份；与执行登记关联

</td>
<td>

一个请求可经历多个执行；不替代执行 ID

</td>
</tr>
<tr>
<td>

`ActiveComputeExecutionID / CommittedOutputExecutionID`

</td>
<td>

引用已登记 DirectorExecutionID，不是新编号

</td>
<td>

分别校验候选与正式输出；可以同时指向不同执行

</td>
</tr>
</tbody></table>

**现有代码改造：**

`biz/service/planner/types\.go` 新增 DirectorExecutionID 和 WaitForTaskRoundID；managed 路径的 GetRoundID\(\) 返回被分配的执行 ID，不再拼接历史 ID 与 Round。每次 llmNodeHandler 新推理前经过 Input Manager 取得执行；删除 managed 路径 GetPrevRoundID\(\) 的 Round\-1 等待，改为显式播放依赖及 OutputPermit。工具反馈先完成原批次收集，再经调度启动新执行。TTSProcessParam、PlannerRoundID、缓存和音频 reply\_value 传递同一个 ID。旧链路及已下发存量 ID 按原契约处理，不中途改写，客户端不需要解析新旧格式。

```Go
type Input struct {
    Channel      string
    VehicleID    string
    ChatID       string
    Type         InputType
    Priority     InputPriority
    MergePolicy  MergePolicy
    SourceType   string
    SourceID     string
    State        InputState
    Content      InputContent
    CreatedAtMs  int64
    FinishedAtMs int64
    FinishReason InputFinishReason
}

type ChatRuntime struct {
    State                      ChatRuntimeState
    ActiveComputeExecutionID   string
    CommittedOutputExecutionID string
    ActiveInputKeys            []string
    ActiveInputsReplayable     bool
    OwnerInstance              string
    LeaseExpireAtMs            int64
    FirstVisibleTextAtMs       int64
    DirectorFinishedAtMs       int64
    WaitingForTTS              bool
}

type DirectorDispatch struct {
    DirectorExecutionID string
    WaitForTaskRoundID  string
    Inputs              []Input
    Interrupted         *InterruptedOutput
}

type InterruptedOutput struct {
    FromDirectorExecutionID string
    PlayedText              string
    UnplayedText            string
    PlaybackMs              int64
}

type GraphState struct {
    Messages            []*schema.Message
    ChatReq             *types.ChatRequest
    VehicleID           string
    Round               int
    Step                int
    DirectorExecutionID string
    WaitForTaskRoundID  string
}

func (s *GraphState) GetRoundID() string {
    return s.DirectorExecutionID
}
```

设计约束：

1. `Input\.State` 是 InputState，`ChatRuntime\.State` 是 ChatRuntimeState；Input 和 Chat 各自只保留一个状态字段，不再增加第三套执行阶段字段。

2. `SourceID` 直接复用来源已有 ID，Input Manager 不生成新的 Input ID。

3. 用户 Query 使用非空 `request\_id`；不满足该前置条件的渠道不启用新链路。Task Service 使用 `task\_run\_id`；云端异步 feedback 使用 `tool\_call\_id`；简单车控异步结果使用原 `request\_id`。

4. `FinishReason` 至少区分正常完成、被合并到新执行、客户端接管、重复输入、执行失败、实例失联且不可重放、人工清理。

5. `ActiveInputsReplayable` 新执行时为 true；新 Tool call 下发前原子改为 false。false 之后，当前 Input 只能作为中断上下文，不能整体重放。

6. 新链路直接令 TaskRoundID = DirectorExecutionID，不额外生成 Output ID。执行 ID 全局唯一但所有状态访问仍校验车辆、Chat 和 request\_id 归属；每个执行最多一个 TaskRound，多个 Provider 共用该 ID，静默 / 无音频执行没有播放对象。

7. 已被 Tool 接受的异步 feedback 无论来源执行身份是否失效都正常入队。

8. 所有 JSON 序列化统一使用 `config\.Json`。

**InputContent 与模型组装：**保留 query / speaker\_name / speaker\_position / timestamp、advisor、Event 内容及工具反馈各自的原始来源；同一模型调用可带多条 Input，但不把它们覆盖成一个无身份字符串。模型许可取得后刷新环境上下文，各条输入时间不随重推刷新。以下是逻辑拼接示例，实际字段与现有 UserContents / AdvisorContents 及 Director 提示词对齐；中断上下文使用已有 last\_talk\_content 承接旧回复，补充工具事实，不携带模型内部思维过程。

```JSON
[
  {"query":"找附近的充电站","speaker_name":"未注册用户","speaker_position":"主驾","timestamp":"原始输入时间"},
  {"query":"要快充","speaker_name":"未注册用户","speaker_position":"副驾","timestamp":"原始输入时间"},
  {"advisor":"续航较低，优先考虑可达站点"}
]
```

第二轮被补话时，待重推的是本轮 feedback \+ 新用户 \+ waiting；第一轮原始查询和已执行动作留在历史 / 效果事实中。下面 tool\_feedback 为逻辑示意，不声明是现有网络协议字段；timestamp 正式值按来源使用 RFC3339，示例说明文本不能当测试请求时间。

```JSON
[
  {"tool_feedback":"已查到两处可达快充站","tool_call_id":"原工具调用身份"},
  {"query":"选便宜一点的","speaker_name":"未注册用户","speaker_position":"主驾","timestamp":"原始输入时间"}
]
```

## Redis 设计

本期按一个 Chat 两个 Key 实现，不提前拆分 mergeable / isolated 队列：

<table><tbody>
<tr>
<td>

Key

</td>
<td>

类型

</td>
<td>

存储内容

</td>
</tr>
<tr>
<td>

`im:\{scope\}:runtime`

</td>
<td>

HASH

</td>
<td>

- `chat`：ChatRuntime JSON

- `input:\{source\_type\}:\{source\_id\}`：包含 InputState、FinishReason 和时间的 Input JSON

- `tool:\{tool\_call\_id\}`：已允许下发的 Tool call 记录，用于重试复用和审计

- Input 字段已存在即视为重复输入；FINISHED Input 保留到整个 Key 过期

</td>
</tr>
<tr>
<td>

`im:\{scope\}:waiting`

</td>
<td>

LIST

</td>
<td>

- 按到达顺序保存 WAITING Input 的 `source\_type:source\_id`

- 出队时读取对应 Input 的 MergePolicy，mergeable 合批，isolated 单独处理

</td>
</tr>
</tbody></table>

`scope = channel:vehicle\_id:chat\_id`，只用于生成 Redis Key，不是新的业务标识。

1. 两个 Key 使用相同的 `\{scope\}`，准入、版本切换、InputState 更新和入队 / 出队由一次 Redis 原子操作完成。

2. 所有 WAITING Input 进入同一条 LIST；mergeable / isolated 是出队策略，不对应两条物理队列。

3. 客户端接管不单独建 Key。服务端通过原 `request\_id` 找到对应 Input；Input 已是 FINISHED 时幂等返回。

4. 业务 Input 不设置 TTL。仅当 ChatRuntimeState=IDLE 且 waiting 为空时，两个 Key 才统一进入过期清理。

5. owner lease 是故障检测字段，不是业务 Input 有效期；处理中不允许因为 Redis Key 过期丢失状态。

6. 按 `channel \+ vehicle\_id` 执行应急清理时，先解析当前 `chat\_id`，只清理该 Chat 的 WAITING Input；正在执行的版本需使用独立的“中止当前执行”操作，避免误删状态。

## Repository 原子操作

下表描述必须一次提交的业务操作，不限定具体 Redis 命令组合：

<table><tbody>
<tr>
<td>

操作

</td>
<td>

前置校验

</td>
<td>

一次提交的结果

</td>
</tr>
<tr>
<td>

输入准入

</td>
<td>

来源身份未处理；读取当前 ChatRuntimeState 和重放边界

</td>
<td>

写入 Input 并决定 PROCESSING / WAITING / FINISHED；需要新执行时原子登记候选 TID、切换 ActiveComputeExecutionID、登记 ActiveInputKeys 和前序播放依赖。P0 同时撤销相关旧输出；P1 不撤销前序合法输出。

</td>
</tr>
<tr>
<td>

首段文本放行

</td>
<td>

提交 ID 等于 ActiveComputeExecutionID，候选仍有效，OutputPermit 成立，且明确登记的前序 TaskRound 已解除播放门

</td>
<td>

同一原子操作将候选转为正式输出，设置 CommittedOutputExecutionID，登记 TaskRoundID = DirectorExecutionID、播放归属及首段时间，并置 RESPONDING；同候选不重新请求模型或生成 ID。

</td>
</tr>
<tr>
<td>

Tool 下发前确认

</td>
<td>

提交 ID 等于 CommittedOutputExecutionID，输出未撤销且 OutputPermit 允许该工具动作，tool\_call\_id 尚未登记

</td>
<td>

登记 Tool call，并把 ActiveInputsReplayable 置为 false；随后才能调用 Tool，重试复用同一 `tool\_call\_id`

</td>
</tr>
<tr>
<td>

Director 结束

</td>
<td>

按完成种类校验：候选完成匹配 ActiveComputeExecutionID；正式输出生产结束匹配登记输出身份及未撤销状态

</td>
<td>

记录对应执行结束事实。未发布候选转 READY，不误结束前序输出；正式输出无音频时记录 NO\_AUDIO，有音频时等待 TaskRound 播放终态。后续经 Evaluate 释放已有候选或启动新执行，不重复分配同候选 ID。

</td>
</tr>
<tr>
<td>

TTS 完成

</td>
<td>

事件 TaskRoundID 定位已登记输出，归属与身份相等，播放终态及结束边界合法；是否推进当前播放门按 CommittedOutputExecutionID 和撤销状态判断，不按 ActiveComputeExecutionID 判断

</td>
<td>

幂等收敛对应 TaskRound 并 Evaluate；已有有效候选满足许可则原 ID 发布，否则有 waiting 时生成新执行 ID，无候选和 waiting 才进入 IDLE。旧输出事件不重复推进新输出。

</td>
</tr>
<tr>
<td>

客户端接管

</td>
<td>

`request\_id` 能定位目标 Input

</td>
<td>

结束目标 Input；必要时使关联执行失效；其他 WAITING Input 保留并继续推进

</td>
</tr>
<tr>
<td>

租约恢复

</td>
<td>

owner lease 已过期，恢复者再次确认旧 owner 未续租

</td>
<td>

原子撤销失联候选并接管 runtime；允许重放时以新 TID 登记执行。前序已提交输出的播放事实保留，只有显式撤销该输出才取消关联音频；已受理工具的真实结果不丢弃。

</td>
</tr>
</tbody></table>

## 故障恢复

7. Director 执行期间由 owner 定期续租；lease 到期只触发恢复检查，不直接把 Chat 当作执行完成。

8. 恢复者原子撤销失联候选的执行身份；需要重新运行模型时生成新 TID，不复用旧执行 ID。仅预跑实例失联不自动撤销前序合法播放；需要撤销正式输出时显式登记撤销并取消关联音频。

9. 模型推理未完成且仍可重放时，恢复流程重新执行并原子登记新的 DirectorExecutionID。原执行的晚到回调仍携带原 ID，不能与新执行混淆；已完整发布的回复与工具事实保留，不自动重跑原指令。

10. `ActiveInputsReplayable=false` 时，不自动重放原 Input；将其以“实例失联且不可重放”结束，等待已发 Tool 的 feedback 或新用户 Query 继续闭环。

11. Chat 处于 RESPONDING 且 TTS\_FINISHED 丢失时，不按文本长度猜测完成。客户端重连后重报当前输出身份；仍无法恢复时触发告警，由受控的“确认输出已结束”运维操作推进 waiting。

12. Redis 原子操作失败、Director 启动失败、租约恢复和人工推进都写入 Fornax Trace、结构化日志和指标。

## 是否新增数据库表

本期不新增 MySQL 业务表。Input Manager 保存短生命周期协调状态；已交付回复及派生历史在正式输出身份与许可校验后写入现有 ChatHistory，未发布预跑候选不得写成已交付历史。调度过程通过 Fornax Trace、结构化日志和指标审计，不额外建设事件表。

# 多音区输入处理

多音区上行不是一段已经合并好的文本。每个音区仍独立产生一条请求，服务端先保留每条请求的 Query、音区和说话人信息，再决定哪些内容进入同一次 Director 执行。

## 当前多音区逻辑

13. **接收单条请求**：客户端上送 `Query\.Content`、`CoordinationInfo\.SoundZone` 和 `request\_id`。服务端根据当前音区用户补充 `speaker\_name`；非 Advisor Query 会先经过现有意图改写，再进入多音区逻辑。

14. **创建合并缓存**：Planner 入口调用 `SetSoundZoneMerge`，以 `channel \+ vehicle\_id \+ chat\_id` 生成 Redis Key。第一条请求创建 `SoundZoneMergeResult`，并生成 `MergeSoundZoneID`；Key 的 1 分钟过期时间只用于异常兜底。

15. **追加 Query / Advisor**：新的用户 Query 到达同一个 Key 时追加到 `QueryList`，相同 `log\_id` 视为重发而跳过，列表只保留最近 4 条。Advisor 写入 `AdvisorTypeUnknown` 槽位，后到值覆盖先到值。

16. **判断是否打断**：每次写入使用当前毫秒时间戳更新 `QueryVersion` 或 `AdvisorVersion`。正在执行的 Planner 每 100 ms 读取缓存：收到首个 Planner item 前，新 Query 或 Advisor 都可以触发打断；收到首个 Planner item 后，只有新 Query 可以触发打断。这里的“首个 Planner item”不一定是用户可见文本。

17. **构造 Planner 输入**：本次缓存中的 `QueryList` 被转换为 `UserContents`，每条内容保留 `query`、`speaker\_name` 和 `speaker\_position`，最终作为结构化 JSON 数组交给 Planner。Advisor 单独转换为 `AdvisorContents`。

18. **结束合并窗口**：Planner 收到首个输出 item 后，通过 CAD 删除自己读取过的缓存版本；如果期间有新请求更新了缓存，旧执行不能误删新数据。`MergeSoundZoneID` 写入 ChatHistory；发生多音区合并时，当前代码将 `chatReq\.Query\.Content` 写入 `MergeSoundZoneQuery`，它不等同于完整的 `QueryList`。

<div class="callout">

`log\_id` 只用于过滤同一请求的重发，不能判断两句话是否同时发生。当前所谓“一组多音区输入”，实际指同一 `channel \+ vehicle\_id \+ chat\_id` 下、同一份合并缓存存续期间到达的请求；分组边界受 Planner 输出时机和并发锁影响，不是明确的说话时间窗口。

</div>

## 接入 Input Manager 后如何支持多音区

目标链路调整为：

```Plain Text
单音区请求
  → Adapter 保留 Query / sound_zone / speaker_name
  → Input Manager 完成幂等、准入、打断、排队并选出本次 Inputs
  → 多音区内容组装
  → Director
  → 执行身份校验
  → 客户端


```

19. **每个音区请求先成为独立 Input**：用户 Query 使用原 `request\_id` 作为来源身份；`sound\_zone`、`speaker\_name` 和 Query 作为 Input 内容保留。`log\_id` 只用于日志追踪，不再参与业务幂等或输入分组。

20. **Input Manager 先决定本次处理哪些 Input**：Chat 空闲时直接处理当前 Input；Chat 处于 `PROCESSING` 且旧执行尚未发出 Tool call或TTS播报，新 P0 Query 使旧执行失效，并将旧、新 Input 一起进行新一轮的DT推理并生成新的`DirectorExecutionID`。

21. **多音区模块只组装已选中的 Inputs**：不再读取 Redis 合并窗口，也不再判断是否打断。只把 Input Manager 交付的 Inputs 转换为当前的 `UserContents` / `AdvisorContents` 格式，保留每条内容的音区和说话人，并继续生成兼容现有 History 的 `MergeSoundZoneID`。

## 新链路改造边界

22. 新链路不再使用 `QueryVersion`、`AdvisorVersion`、`ShouldBreak`、多音区 CAS 锁和缓存存续时间决定准入与打断。

23. 现有 Query 改写、`sound\_zone`、`speaker\_name`、`UserContents` / `AdvisorContents` 格式和 `MergeSoundZoneID` 继续保留，首期不改变 Director 的输入结构。

24. 多音区内容数量限制如需继续保留，只能作为 Director 输入组装约束，不能静默删除 Input Manager 中已经准入的 Input。

25. 新旧链路按 `channel \+ vehicle\_id` 灰度互斥；同一范围内只能由一套机制决定打断和执行有效性。

# 客户端相关

## 新增TTS播报状态事件上报

客户端TTS播报状态目前通过 `/event/temp\-event/report` 接口上报播报时长和播放完成事件，但通过不同EventID来实现，语义上比较割裂。

<table><tbody>
<tr>
<td>

接口或事件

</td>
<td>

职责

</td>
<td>

数据流

</td>
</tr>
<tr>
<td>

`/aidv/wss/tts`

</td>
<td>

下发音频，提供TaskRoundStart/TaskRoundEnd边界，并支持request级CancelTTS

</td>
<td>

服务端 → 客户端

</td>
</tr>
<tr>
<td>

`/event/temp\-event/report`

</td>
<td>

上报 `tts\_playback\_event\_\&lt;task\_round\_id\&gt;`；

服务端写Redis播放状态并触发Input Manager

</td>
<td>

客户端 → 服务端 → Redis

</td>
</tr>
<tr>
<td>

`tts\_playback\_progress\_\&lt;request\_id\&gt;`

</td>
<td>

上报duration\_ms/interrupt\_type，由ChatHistory\.ExtraInfo记录历史播放进度，在打断恢复时使用此信息

</td>
<td>

客户端 → 服务端 → 数据库

</td>
</tr>
<tr>
<td>

`\&lt;task\_round\_id\&gt;`=`true`

</td>
<td>

TTS播放完成通知

</td>
<td>

客户端 → 服务端临时事件键

</td>
</tr>
</tbody></table>

两类事件按职责并行：`tts\_playback\_event\_\&lt;task\_round\_id\&gt;` 是Input Manager的TaskRound级别的TTS播报状态实际；`tts\_playback\_progress\_\&lt;request\_id\&gt;` 是request级数据库历史进度，用于TTS打断恢复。客户端同时上报两类事件，服务端分别交由Redis播放处理器和 `UpdateTTSPlaybackProgress` 处理。

## 事件名与请求结构

事件名固定为 `tts\_playback\_event\_\&lt;task\_round\_id\&gt;`

```json
{
  "event_id": "tts_playback_event_{task_round_id}",
  "event_value": "{\"request_id\":\"{request_id}\",\"event_type\":\"FINISHED\",\"played_media_ms\":2600,\"round_end_seen\":true,\"interrupt_type\":\"\",\"client_event_time_ms\":0}"
}
```

<table><tbody>
<tr>
<td>

字段

</td>
<td>

必填

</td>
<td>

语义与校验

</td>
</tr>
<tr>
<td>

`request\_id`

</td>
<td>

是

</td>
<td>

当前音频Fetch请求身份；服务端与TaskRound登记关系核验，不能作为TaskRound主键

</td>
</tr>
<tr>
<td>

`event\_type`

</td>
<td>

是

</td>
<td>

`STARTED/`~~`PROGRESS`~~`/FINISHED/`~~`ABORTED`~~

</td>
</tr>
<tr>
<td>

`duration\_ms`

</td>
<td>

条件必填

</td>
<td>

STARTED可为0；PROGRESS、FINISHED必须存在；ABORTED可缺失表示最终采样未知，显式0表示未消费媒体

</td>
</tr>
<tr>
<td>

`round\_end\_seen`

</td>
<td>

FINISHED必填

</td>
<td>

客户端已收到该TaskRound的结束标记；仍需播放器队列耗尽才能FINISHED

</td>
</tr>
<tr>
<td>

`interrupt\_type`

</td>
<td>

ABORTED必填

</td>
<td>

固定枚举字符串，如USER\_INTERRUPT、AUDIO\_FOCUS\_LOST、DECODE\_ERROR、BUFFER\_ERROR

</td>
</tr>
</tbody></table>

## 播放事件定义

<table><tbody>
<tr>
<td>

事件

</td>
<td>

客户端触发时刻

</td>
<td>

Input Manager影响

</td>
</tr>
<tr>
<td>

STARTED

</td>
<td>

本TaskRound第一个非空音频样本实际进入播放器渲染；不能在Fetch、收包、排队或解码完成时上报

</td>
<td>

状态置PLAYING；不使候选失效

</td>
</tr>
<tr>
<td>

PROGRESS

</td>
<td>

播放中按固定间隔和状态变化前采样（保持现状）

</td>
<td>

更新`duration\_ms`，用于后续插话策略判断

</td>
</tr>
<tr>
<td>

FINISHED

</td>
<td>

已收到TaskRoundEnd，且该TaskRound全部Provider解码队列和播放器渲染尾部耗尽

</td>
<td>

状态置FINISHED；工具批次完整且候选有效时允许正式释放

</td>
</tr>
<tr>
<td>

ABORTED

</td>
<td>

该TaskRound永久停止，相关解码/播放队列已清理；包括启播前取消

</td>
<td>

状态置ABORTED，记录最终位置或UNKNOWN并触发Evaluate；不能恢复同一TaskRound

</td>
</tr>
</tbody></table>

SubTTSEnd只表示一个Provider子流结束；TaskRoundEnd只表示服务端该轮音频边界下发结束，两者都不能替客户端生成FINISHED。HTTP断开、WebSocket断开、收到最后一个网络包或估计时长达到上限也不能伪造FINISHED。

端侧ASR临时检测到人声时先本地暂停。若最终拒识且允许恢复，继续原TaskRound并延续PROGRESS；若形成有效P0，则本地停止并上报ABORTED，同时业务Input正常上云。

## Redis播放状态与原子收敛

TaskRound 正式登记前先写 im:tts\_round:\{vehicle\_id\}:\{task\_round\_id\} 路由索引，包含安全编码的 scope\_chat、director\_execution\_id、request\_id 和状态主 key；新链路 task\_round\_id = director\_execution\_id，字段用于归属断言，不是两个独立编号。索引写成功后，在 runtime 的原子发布操作中重验候选及前序依赖、登记输出，最后才发音频。索引仅定位，不能授予输出许可；失败或并发撤销时不得发布，孤立索引不能绑定当前输出。

## Input Manager消费规则

完整工具批次就绪后，Input Manager 为下一次模型推理原子登记新 DirectorExecutionID 并发放 ComputePermit，可不等前序播放完成就预跑。STARTED / PROGRESS 只更新播放事实，不替换候选；FINISHED / ABORTED / NO\_AUDIO 触发 Evaluate。OutputPermit 成立时发布已有 RUNNING / READY 候选，复用其 ID；新候选预跑不改变 CommittedOutputExecutionID，不使前序播放失效。

有效新Input到达时，未发布候选原子STALE并与新Input、waiting及完整工具事实合并重算。P1不停止当前TaskRound；有效P0由客户端先本地停播并上报ABORTED，云端通过request级CancelTTS结束关联音频。已受理工具继续回传真实结果，不因停播重放。

播放事件不是业务Input，不进入waiting，也不增加InputRevision。只有P0形成的中断上下文补齐played/unplayed/UNKNOWN后才更新依赖快照；被废弃候选的talk\_content不得当作用户已听历史。

## 新老版本兼容与降级

<table><tbody>
<tr>
<td>

客户端/服务端组合

</td>
<td>

行为

</td>
<td>

DT能力

</td>
</tr>
<tr>
<td>

旧端\+旧服务端

</td>
<td>

原TTS WebSocket、`roundID=true` 和原progress数据库上报

</td>
<td>

原行为

</td>
</tr>
<tr>
<td>

旧端\+新服务端

</td>
<td>

原 `\&lt;task\_round\_id\&gt;=true` 继续生效；可映射为Input Manager的LEGACY\_FINISHED事实

</td>
<td>

可灰度预跑；缺STARTED/ABORTED精度

</td>
</tr>
<tr>
<td>

新端\+旧服务端

</td>
<td>

旧服务只会写 `temp\_event:tts\_playback\_event\_\&lt;task\_round\_id\&gt;`，旧Planner轮询的 `temp\_event:\&lt;task\_round\_id\&gt;` 不会命中

</td>
<td>

不兼容；必须先升级服务端



</td>
</tr>
<tr>
<td>

新端\+新服务端

</td>
<td>

`HandleTTSPlaybackEvent` 去掉固定前缀得到TaskRoundID；写结构化Redis状态，并在FINISHED时复用 `ReportTempEvent` 写旧完成键

</td>
<td>

支持TaskRound级预跑，同时唤醒旧Planner



</td>
</tr>
</tbody></table>

## 客户端实施清单

<table><tbody>
<tr>
<td>

模块

</td>
<td>

改动细节

</td>
<td>

完成判据

</td>
</tr>
<tr>
<td>

TaskRound跟踪

</td>
<td>

从 SubTTSState\.reply\_value 读取不透明 TaskRoundID；新链路其值等于 DirectorExecutionID，多个 Provider 共用同一任务轮身份。Start 建对象，End 标记边界；不按 TID 大小判断新旧。

</td>
<td>

不解析ID，不将SubTTSEnd误当整轮结束

</td>
</tr>
<tr>
<td>

播放计时

</td>
<td>

按播放器实际消费累计played\_media\_ms，暂停/缓冲不增长

</td>
<td>

0和缺失可区分；收包量不冒充媒体时长

</td>
</tr>
<tr>
<td>

终态判定

</td>
<td>

TaskRoundEnd已见且全部队列render drain后FINISHED；永久清队列后ABORTED

</td>
<td>

不靠WebSocket EOF、网络尾包或估算时长结束

</td>
</tr>
<tr>
<td>

HTTP上报器

</td>
<td>

复用TempEvent接口，构造event\_id和JSON EventValue；由PlaybackCoordinator统一协调播放事件上报

</td>
<td>

重试复用原payload；PROGRESS按上报周期合并；播放状态不回退

</td>
</tr>
<tr>
<td>

终态重试队列

</td>
<td>

持久化FINISHED/ABORTED的TaskRound身份与完整payload

</td>
<td>

进程重启后恢复待确认终态；无法恢复播放对象且无待确认终态时上报ABORTED

</td>
</tr>
<tr>
<td>

原进度上报

</td>
<td>

保留 `tts\_playback\_progress\_\&lt;request\_id\&gt;` 原逻辑

</td>
<td>

原ChatHistory播放时长和interrupt\_type无回归

</td>
</tr>
<tr>
<td>

ASR打断桥接

</td>
<td>

临时人声只本地暂停；有效P0上报ABORTED，被拒识则继续原播报

</td>
<td>

不因临时ASR直接永久结束，不恢复已ABORTED对象

</td>
</tr>
</tbody></table>

## 播放状态超时兜底

<div class="callout">

**核心原则**：客户端上报的 FINISHED / ABORTED 是播放终态的权威证据；云端已知的音频总时长与客户端上报的播放时长只用于计算动态超时和防止队列永久阻塞，不能直接证明客户端已经播放完成。超时推进必须记录为独立结果，不得伪装成正常 FINISHED。

</div>

**适用场景与输入数据**

弱网、客户端断连、完成事件丢失或执行实例重启时，Chat 可能长期停留在 RESPONDING，导致 waiting 无法推进。服务端在 TaskRound 维度维护以下信息：

<table><tbody>
<tr>
<td>

字段

</td>
<td>

含义

</td>
</tr>
<tr>
<td>

`task\_round\_id`

</td>
<td>

新链路 task\_round\_id = DirectorExecutionID，全局唯一字符串，不编码 ChatHistory\.ID / Round，也不比较大小。状态更新按已登记输出及撤销状态核验，推进播放门时匹配 CommittedOutputExecutionID，而不是最新推理 ID。

</td>
</tr>
<tr>
<td>

`total\_duration\_ms`

</td>
<td>

云端生成并准备下发的整个 TaskRound 音频总时长；只有 TaskRoundEnd 已确定后才作为稳定总值

</td>
</tr>
<tr>
<td>

`played\_duration\_ms`

</td>
<td>

客户端最后确认的累计播放时长；沿用现有 progress 上报，值只允许单调增加

</td>
</tr>
<tr>
<td>

`last\_progress\_at\_ms`

</td>
<td>

最后一次有效 progress 到达服务端的时间

</td>
</tr>
<tr>
<td>

`content\_finished\_at\_ms`

</td>
<td>

TaskRound 音频生成 / 下发结束标记建立的时间，用于从未收到 progress 时计算保守截止时间

</td>
</tr>
<tr>
<td>

`connection\_state`

</td>
<td>

客户端连接状态（若链路可提供）；用于区分终态事件丢失与明确断连

</td>
</tr>
</tbody></table>

**动态截止时间**

服务端按剩余音频时长计算软截止时间，替代固定一分钟轮询。参数均通过服务端配置维护，不作为外部业务配置暴露：

```text
remaining_ms = max(0, total_duration_ms - played_duration_ms)

收到过 progress：
soft_deadline = last_progress_at_ms
              + remaining_ms / min_playback_rate
              + weak_network_grace_ms

从未收到 progress：
soft_deadline = content_finished_at_ms
              + total_duration_ms / min_playback_rate
              + first_play_buffer_ms
              + weak_network_grace_ms

hard_deadline = soft_deadline + max_unconfirmed_block_ms
```

`min\_playback\_rate` 表示允许的最慢播放倍速；`first\_play\_buffer\_ms` 覆盖弱网首包与端侧缓冲；`weak\_network\_grace\_ms` 覆盖事件上传延迟；`max\_unconfirmed\_block\_ms` 是播放状态无法确认后允许继续阻塞 Chat 的最大时长。任一新 progress 到达后，只基于单调增加的播放时长重新计算截止时间。

**状态与推进规则**

<table><tbody>
<tr>
<td>

证据 / 条件

</td>
<td>

状态处理

</td>
<td>

waiting 处理

</td>
</tr>
<tr>
<td>

收到当前 TaskRound 的 FINISHED

</td>
<td>

按登记 TaskRound 收敛 FINISHED；重复终态幂等。前序合法输出不因新候选预跑变成无效，已撤销或已收敛输出的迟到事件不重复推进。

</td>
<td>

原子结束当前 Input 并推进下一批 waiting

</td>
</tr>
<tr>
<td>

收到当前 TaskRound 的 ABORTED / 用户 P0 打断

</td>
<td>

记录 `ABORTED` 或对应中断原因，并保留最后播放位置

</td>
<td>

按 P0 中断规则切换版本，不等待原播放终态

</td>
</tr>
<tr>
<td>

超过 soft\_deadline，仍未收到终态

</td>
<td>

迁移为 `FINISH\_UNCONFIRMED`，记录告警、当前总时长、播放时长与连接状态；不记为正常完成

</td>
<td>

暂不推进；等待迟到终态、重连补报或 hard\_deadline

</td>
</tr>
<tr>
<td>

超过 hard\_deadline，仍未收到终态

</td>
<td>

以 `PLAYBACK\_STATUS\_TIMEOUT` 结束当前 Input；播放状态保持 `UNCONFIRMED`，写入结构化日志、Trace 和指标

</td>
<td>

校验 TaskRound 对应当前未撤销的已提交输出后，原子解除其播放门并 Evaluate；已有候选复用原 ID 发布，不得写成 FINISHED，也不能按最新推理 ID 忽略合法前序输出。

</td>
</tr>
<tr>
<td>

超时推进后收到迟到 FINISHED / PROGRESS

</td>
<td>

仅补充审计，不回滚状态、不重复推进；已失效或撤销的执行输出继续被身份校验拦截

</td>
<td>

无影响

</td>
</tr>
</tbody></table>

**按证据强弱调整宽限**

1. **播放接近完成**：当 `played\_duration\_ms ≥ total\_duration\_ms \- completion\_epsilon\_ms` 时，可采用较短的弱网宽限，但仍优先等待显式终态。

2. **持续收到 progress**：按剩余时长滚动延后 soft\_deadline，不因总播放时间超过初始估算而提前结束。

3. **从未收到 progress**：无法区分未起播、上报丢失与弱网缓冲，使用“总时长 \+ 首播缓冲 \+ 弱网宽限”的保守期限。

4. **明确断连**：soft\_deadline 到达时只进入 FINISH\_UNCONFIRMED；客户端重连后优先补报当前 TaskRound 状态。达到 hard\_deadline 后才允许超时推进。

5. **新 P0 输入到达**：用户输入优先，直接按现有中断规则使已失效或撤销的执行失效，不受 soft\_deadline / hard\_deadline 限制。

**实现与安全边界**

1. 超时检查基于 Redis 中持久化的 deadline 和 runtime 状态执行，不依赖原 Director 实例内 goroutine；实例恢复后可继续检查。

2. FINISHED、ABORTED、soft timeout 和 hard timeout 都进入同一个 Repository 原子入口，统一执行身份匹配和 waiting 推进。

3. 播放时长只允许单调增加，超过总时长时按总时长截断；非法值只记审计，不覆盖有效进度。

4. hard timeout 推进可能遇到旧端仍本地播放。支持撤销协议的客户端按显式取消 / 替换指令清理被指定 TaskRoundID 的缓存，不通过 TID 大小推断新旧；未发布预跑候选不触发替换。旧客户端无法保证停播时采用更保守的 hard deadline 并按车型 / 版本灰度，不能假设收到不同 ID 就能安全丢弃前序音频。

5. 超时兜底只解决交互队列阻塞，不代表 Tool 副作用失败或回滚；已被接受的真实 Tool feedback 仍正常准入。

<div class="callout">

**最终优先级**：显式 FINISHED / ABORTED 是权威路径；总时长 \+ 播放时长是动态超时路径；hard\_deadline 是可用性兜底。三者均按 TaskRound / DirectorExecutionID 幂等处理。

</div>

# 服务端改造拆分

先按工作包评审 owner、依赖和验收边界。涉及客户端协议的工作包在第 8 章约定确认后排期。

<table><tbody>
<tr>
<td>

工作包

</td>
<td>

主要改造

</td>
<td>

完成标准

</td>
</tr>
<tr>
<td>

核心协调与 Repository

</td>
<td>

InputState、ChatRuntimeState、全局唯一 DirectorExecutionID、ActiveComputeExecutionID / CommittedOutputExecutionID 引用、TaskRound 同值关联、统一 waiting、Repository 原子许可与应急清理

</td>
<td>

执行 TID 不复用；单 Chat 最多一个有效候选与一个未撤销正式输出；预跑不撤销合法播放；新执行登记及 waiting 原子提交；重复请求不重复生成执行

</td>
</tr>
<tr>
<td>

入口 Adapter 与身份

</td>
<td>

用户 Query、Task Service、异步 Tool feedback 的来源身份、优先级和 MergePolicy 映射；`request\_id` 新链路前置校验

</td>
<td>

不新增 Input ID；重复回流幂等；缺少稳定身份时不误入新链路

</td>
</tr>
<tr>
<td>

多音区合并迁移

</td>
<td>

保留音区、说话人、Query 组合和 `MergeSoundZoneID`；迁移 `ShouldBreak`、`ShouldBreakInRecommend`、Query / Advisor 版本及 Recommend 等待职责（两个 ShouldBreak 都要收口，避免遗漏推荐场景的打断判定）

</td>
<td>

新旧内容组装结果可对比；同一 Chat 不同时启用两套并发协调逻辑

</td>
</tr>
<tr>
<td>

输出与 Tool 边界

</td>
<td>

识别首段可展示文本；已失效或撤销的执行文本 / TTS / History / ChatResource 拦截；Tool 下发前身份校验与不可重放标记；真实异步 feedback 正常入队

</td>
<td>

已失效或撤销的执行不能产生新影响；首 Token 前 Tool 不重复执行；A / B feedback 均不丢失

</td>
</tr>
<tr>
<td>

执行完成与客户端事件

</td>
<td>

Director 无输出完成、TTS\_STARTED / PROGRESS / FINISHED、输出身份关联、客户端接管和旧版兼容

</td>
<td>

静默 / 纯 Tool / 失败 / 无 TTS / 有 TTS 均能可靠推进 waiting；重复或迟到事件无副作用

</td>
</tr>
<tr>
<td>

租约与故障恢复

</td>
<td>

owner 续租、过期接管、可重放恢复、不可重放保护、TTS 事件缺失告警和受控人工推进

</td>
<td>

实例宕机不丢 waiting，不会自动重复执行已有副作用的 Tool

</td>
</tr>
<tr>
<td>

Shadow、观测与验收

</td>
<td>

新旧策略对比；queue\_depth / oldest\_age / lease / stale output / recovery 指标；七类 Case 和异常测试

</td>
<td>

差异可解释；按 `channel \+ vehicle\_id` 放量并可整体回退

</td>
</tr>
</tbody></table>

## 多轮 ReAct 与插话处理

