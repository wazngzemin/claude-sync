# 车载智能助手评测体系2.0

- sourceId: CE-EVAL2
- 来源：https://bytedance.larkoffice.com/wiki/E2KmwamNaiCETskKcXBctDsHnYb
- 读取日期：2026-10-23
- 状态：接口成功，返回正文已读
- 源对象最后编辑时间：2026-03-24T11:03:26.000Z
- 边界：3 月 24 日更新的历史评测体系；含 Q2 计划与未完成待办。文中 80% 检查点门槛仅为该版定义，不是当前全项目准出标准。

---

# 车载智能助手评测体系2\.0

<div class="callout">

AI汽车的能力在不断迭代，必须有与之配套的评测体系来衡量其效果。同时，在[评测体系1\.0](https://bytedance.larkoffice.com/wiki/Ekvbwl1Z7iLcCZkjyVCcacMhnBf)进行了多轮实践后我们也发现了一些待优化点。

2\.0会更多评测AI汽车的进阶能力（多步任务、持续任务、主动服务、记忆、感知能力等），而1\.0则更多针对市面上已有产品的基础能力（控制、闲聊、搜索等）。

</div>



# 评测目标

与功能测试不同，产品评测的核心是**站在用户视角**，模拟真实使用场景、聚焦用户体验，同时明确产品能力水位、暴露潜在问题，最终驱动产品优化迭代。

# 评测难点

## 单点问答的局限性

过去，传统车载大模型助手局限于单点问答，对应的评测体系亦以**单次指令执行**为核心导向，仅聚焦于指令的即时响应效率与单次执行效果。而AI汽车的新方案则面向多元场景升级：一是通过感知用户行为实现主动服务（0 问 1 答）；二是突破单次交互限制，提供持续性服务（1 问 N 答、N问M答）。

这一进化趋势表明，以单点问答为核心的传统评测体系，已无法匹配智能汽车 AI 系统的能力迭代需求。

<div class="callout">

从 “聚焦单次问答的响应质量” 转向 “以**用户核心诉求的最终达成**为核心评价标准”。

</div>

## 过程同样重要

过去的评测，只关注结果，即豆包最后给到的答复。但随着持续任务等复杂任务的引入，过程变得越来越重要。评价维度需兼顾结果与过程：优质的服务过程既能建立用户对智能体的信任、消解等待焦虑，也能规避偶然成功带来的体验偏差。

<div class="callout">

引入过程指标

</div>

## **评测环境与真实场景脱节**

过往评测用例以单轮指令及少量 2\-3 轮指令为主，且用例之间相互独立，未结合用户实际使用的连贯性场景，缺乏全局视角。评测过程中仅聚焦单指令的局部最优解，忽略了场景的整体性逻辑。

在真实使用场景中，用户操作存在**强关联性**。例如暴雨场景下，用户的关窗、查询路线、查看天气等一系列动作，均围绕 “暴雨” 核心需求展开，且动作间存在因果关联 —— 如原本开窗透气，关窗后大概率需要同步开启外循环。由此可见，同一指令在不同场景下的最优执行方案存在显著差异。

**用户动机**也会直接影响指令的最优解。例如同样是 “开窗” 指令，用户为 “透气” 和为 “观赏窗外风景” 的需求，对应的开窗幅度、开窗时长等执行策略截然不同。

此外，传统评测用例的设计过于理想化，**上下文语境高度聚焦于当前指令**，与真实场景的复杂性存在明显脱节。在实际驾乘过程中，不同乘客的指令往往意图混杂、诉求多元，各类指令的上下文信息相互交织。

<div class="callout">

通过构建场景化测评体系，解决传统评测 “重局部最优、轻全局价值” 的核心问题。场景化评测将基于**明确的场景背景、用户角色、环境参数**进行设计，通过定义清晰的用户核心诉求与全流程预期结果，实现从 “单指令执行效果评估” 到 “用户需求最终达成度评估” 的转变

</div>

## 什么是好的答案？

抛开场景、语境和角色定义来聊模糊指令的最佳路径和最优解，都是耍流氓。

- 类似“好热啊”这样的模糊指令，究竟是粗暴打开极速降温更得人心，还是持续监控温度确保舒服更符合要求

- 用户：我有点不开心，助手A唱了一段跑调的歌，助手B讲了个冷笑话。哪一个更好？

- 针对同一个case，会存在不同层级的预期：

    - 用户说“我好困”，助手说要注意驾驶安全，建议在前面的休息区进行休息似乎是一个可以接受的答案；如果知道用户是因为吃了感冒药而犯困，给出更有针对性的答案或者更加不错。

    - 能够结合车书回答“充电桩的图标是什么指示灯”是一个及格答案，如果能结合端状态告知用户现在它是绿色，代表正在充电会更好。

<div class="callout">

在具体场景（角色、背景等信息）下，提前定义最优路径和最优解

预期结果分级：基础、惊喜

</div>

## 主观case如何评测？

之前评测主观case使用对抗评估，只能在多个智能体中做对比分析。但如果只使用分值评估，如人设一致性、共情能力，又有一种隔靴搔痒的感觉，且评分非常有主观性。

<div class="callout">

Case by case 定义过程和结果检查点，而不是只使用通用的能力域做分值评估。

主观域能力评估维度：

- 情感识别

- 共情

- 人设一致性

- 疏导

- 话题推进性

- 理解/推理

</div>

## context！！！

区别于一般语音助手，豆包汽车具有大量的context：车辆状态、感知信息、记忆，等等。这些上下文信息会直接决定助手的回复内容和服务方式。但在实际评测过程中，却面临三大核心难点：

- 上下文模拟难度高：不仅需要确保各类上下文信息（车辆状态、感知信息、记忆数据）之间逻辑自洽，还需要保证上下文与用户的提问内容完全匹配；

- 上下文会影响预期结果：不同的上下文会使得同一个query的最佳预期不一样；

- 多轮对话中上下文实时更新：评测时，上下文信息需要随着多轮对话的推进而动态变化，无法沿用固定不变的静态数据进行测试。

模拟器相关链接：

[主动服务\-模拟器 PRD v1\.1](https://pq3b44yw2t9.feishu.cn/wiki/JhLuwJfnYifSrik0N9Dc5Cwsnzf)

[AI 汽车模拟器后台使用手册](https://bytedance.larkoffice.com/wiki/Xe2TwGxn3ivrC9kGriAcOwZ8nQf)

## 主动服务如何评测？

主动服务评测难点：

- **主观性强**：上线前缺乏可量化的用户体验指标，难以建立统一、客观的评测标准。

- **未触发场景判定模糊**：即便预设主动服务触发条件，若系统未触发推荐，也无法直接判定为功能异常。

- **非预期触发场景难界定**：系统在预设范围外的场景下触发主动推荐时，其合理性与有效性缺乏明确的评测依据。

<div class="callout">

精确到具体场景设计主动推荐验收case及预期结果，但不设计过高召回率

对于非预期触发场景，以场景和对应角色视角进行评价：

- 逻辑合理性

- 体验提升性（与什么都不做相对比）

</div>



## **节奏问题（思考中）**



除了以上几点，还有一些**其他难点**：

- 记忆能力怎么评测？\-\-\&gt; 有针对性设计记忆场景

- 评分的主观性怎么消除？\-\-\&gt; 无法完全消除，一方面可以使用自动化手段降低；另一方面，现阶段测评更多服务于问题定位和产品迭代，不要太纠结于具体分数

- 多轮对话无法预设 \-\-\&gt; 自动化对话生成

- 评测效率如何提高？\-\-\&gt; 流程自动化



# 2\.0评测体系

## 核心场景定义

在评测2\.0中，我们需要定核心场景来检验产品的能力。而这些核心场景必须：

1. 覆盖AI car目标用户使用场景

2. 较好地覆盖AI car的能力范围

### 元素

<table><tbody>
<tr>
<td>

出行/上车目的

</td>
<td>

主驾画像

</td>
<td>

乘客

</td>
<td>

重要context

</td>
<td>

特殊场景/任务

</td>
</tr>
<tr>
<td>

通勤

</td>
<td>

摩登青年客

</td>
<td>

伴侣

</td>
<td>

身体状态：

心理状态：

天气：

路况：

其他：

</td>
<td>

新手引导

</td>
</tr>
<tr>
<td>

自驾游

</td>
<td>

潮奢精质族

</td>
<td>

朋友/同事

</td>
<td>



</td>
<td>

庆祝生日/纪念日

</td>
</tr>
<tr>
<td>

约会/接朋友

</td>
<td>



</td>
<td>

孩子

</td>
<td>



</td>
<td>

新手上路

</td>
</tr>
<tr>
<td>

去超市

</td>
<td>



</td>
<td>



</td>
<td>



</td>
<td>

功能介绍

</td>
</tr>
<tr>
<td>

辅导班接送

</td>
<td>



</td>
<td>



</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>

临时办公

</td>
<td>



</td>
<td>



</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>

小憩/休息

</td>
<td>



</td>
<td>



</td>
<td>



</td>
<td>



</td>
</tr>
</tbody></table>

### 需求

一个完整的场景，由元素与需求组成。需求指的是，在定义的场景元素组合下，可能出现的需要被满足的请求或诉求。例如：

<table><tbody><tr>
<td>

**元素**

出行目的：去超市

主驾画像：摩登青年客

乘客：伴侣

重要context：无

**需求1:确认采购清单**

**需求2:妥善放置采购商品**

</td>
<td>

**元素**

出行目的：去父母家

主驾画像：潮奢精质族

乘客：三岁女儿

重要context：无

**需求1:AI角色扮演**

**需求2:AI与女儿玩游戏**

</td>
<td>

**元素**

出行目的：通勤

主驾画像：摩登青年客

乘客：无

重要context：重感冒

**需求1:缓解感冒症状**

</td>
</tr></tbody></table>

而某些通用需求，如调整座椅、空调可能存在在任意场景下。这些通用需求可由模型自行发挥。但与场景强相关的重点考察需求，需要提前定义。

#### 通用需求

通用需求指与特定场景无关，只要上车了，大概率会发生的诉求，包括以下类别：

- 导航

- 多媒体

- 车控

- 闲聊

可使用1\.0定义过的评测集。

## 场景化评测

[场景测评（草稿）](https://bytedance.larkoffice.com/wiki/Rt5hwSROFiyfWEk3rb8cy37un2d?sheet=qwdSeK)

## 能力域

### 感知

- 耳聪（ASR准确性与纠错、过滤）

- 目明

- 状态获取（端状态、事件等）

### 理解

- 指令理解

- 情境与状态理解

- 记忆一致性

- 个性化画像运用

- 安全与风险意识

### 执行

- 指令执行

- 同理心

- 专业知识讲解

- 沟通表达与语气管理

- 流程与节奏把控

- 问题解决与应变能力

## 归因分析

通过豆包汽车给出的过程和最终结果，我们希望能够定位到问题的“结节”，目前定义的归因有以下几种：

<table><tbody>
<tr>
<td>

类型

</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>

拒识

</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>

ASR错误

</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>

简单复杂仲裁错误

</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>

SFT车控模型错误

</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>

context

</td>
<td>

筛选到错误/冗余数据

</td>
<td>



</td>
</tr>
<tr>
<td>



</td>
<td>

缺少必要context

</td>
<td>



</td>
</tr>
<tr>
<td>

planner

</td>
<td>

调用错误工具

</td>
<td>



</td>
</tr>
<tr>
<td>



</td>
<td>

调用工具时使用错误要求或参数

</td>
<td>



</td>
</tr>
<tr>
<td>



</td>
<td>

错误使用context

</td>
<td>



</td>
</tr>
<tr>
<td>



</td>
<td>

其他planner理解/执行错误

</td>
<td>



</td>
</tr>
<tr>
<td>

advisor

</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>

工具使用/返回错误

</td>
<td>

车控

</td>
<td>



</td>
</tr>
<tr>
<td>



</td>
<td>

nav

</td>
<td>



</td>
</tr>
<tr>
<td>



</td>
<td>

车书

</td>
<td>



</td>
</tr>
<tr>
<td>



</td>
<td>

S2S

</td>
<td>



</td>
</tr>
<tr>
<td>



</td>
<td>

记忆

</td>
<td>



</td>
</tr>
<tr>
<td>



</td>
<td>

GUI

</td>
<td>



</td>
</tr>
<tr>
<td>



</td>
<td>

……

</td>
<td>



</td>
</tr>
</tbody></table>

## 评测提示词

<table><tbody>
<tr>
<td>

任务

</td>
<td>

提示词

</td>
</tr>
<tr>
<td>

在场景库中选取要测评的场景

</td>
<td>

https://fornax\.bytedance\.net/space/7522018773168046082/prompt/develop/7590059966968560386

</td>
</tr>
<tr>
<td>

自动生成场景对话（大模型进行角色扮演，扮演用户，与AI汽车进行对话，完成场景）

</td>
<td>

https://promptpilot\.volcengine\.com/workbench/ta\-20251220021917\-6WSAp?workspaceId=ws\-20250912023836\-n3JqC\&amp;revisionId=prv\-20251222063125\-h46tD

</td>
</tr>
<tr>
<td>

自动生成场景的检查点（过程、产物、可能分支）

</td>
<td>

https://promptpilot\.volcengine\.com/workbench/ta\-20251223100441\-44Sxe?workspaceId=ws\-20250912023836\-n3JqC\&amp;revisionId=prv\-20251224033951\-WFt6d

</td>
</tr>
<tr>
<td>

自动验证检查点的满足情况

</td>
<td>

https://fornax\.bytedance\.net/space/7522018773168046082/prompt/develop/7590059156195325186

</td>
</tr>
<tr>
<td>

人工\+自动进行归因分析

</td>
<td>

https://promptpilot\.volcengine\.com/workbench/ta\-20251224072850\-TgP3L?workspaceId=ws\-20250912023836\-n3JqC\&amp;revisionId=prv\-20251224072850\-69Sym

</td>
</tr>
</tbody></table>

注：对于核心评测集，第二步和第三步需要人工审核和干预。

## 评测报表

<table><tbody>
<tr>
<td>



</td>
<td>

维度

</td>
<td>

指标

</td>
</tr>
<tr>
<td>

端到端

</td>
<td>

完成情况

</td>
<td>

任务完成度=（*∑* 通过的检查点\*权重）/（*∑* 检查点\*权重）

</td>
</tr>
<tr>
<td>



</td>
<td>

稳定性

</td>
<td>

pass@3：智能体在3次试次中至少完成\*1次任务的概率

pass^3：智能体在 3次试次中全部完成任务的概率

\*完成定义：至少80%的检查点通过且结果检查点通过

</td>
</tr>
<tr>
<td>



</td>
<td>

时延

</td>
<td>

TTFT

平均Chunk Latency = （T\_chunk\_i 开始时间\-T\_chunk\_i\-1 结束时间）/总chunks数

</td>
</tr>
<tr>
<td>



</td>
<td>

各能力域得分

</td>
<td>

相见评测体系1\.0:[车载智能助手评测体系1\.0](https://bytedance.larkoffice.com/wiki/Ekvbwl1Z7iLcCZkjyVCcacMhnBf)

</td>
</tr>
<tr>
<td>



</td>
<td>

ASR

</td>
<td>

句准率

</td>
</tr>
<tr>
<td>



</td>
<td>

拒识

</td>
<td>

准确率

</td>
</tr>
<tr>
<td>

过程指标

</td>
<td>

简单复杂仲裁错误

</td>
<td>

准确率

</td>
</tr>
<tr>
<td>



</td>
<td>

SFT车控模型错误

</td>
<td>

准确率

</td>
</tr>
<tr>
<td>



</td>
<td>

context：筛选到错误/冗余数据

</td>
<td>

准确率

</td>
</tr>
<tr>
<td>



</td>
<td>

planner：调用错误工具

</td>
<td>

准确率

</td>
</tr>
<tr>
<td>



</td>
<td>

planner：调用工具时使用错误要求或参数

</td>
<td>

准确率

</td>
</tr>
<tr>
<td>



</td>
<td>

planner：错误使用context

</td>
<td>

准确率

</td>
</tr>
<tr>
<td>



</td>
<td>

planner：其他planner理解/执行错误

</td>
<td>

准确率

</td>
</tr>
<tr>
<td>



</td>
<td>

planner：工具使用/返回错误

</td>
<td>

准确率

</td>
</tr>
</tbody></table>

## 评测流程

示例：[场景评测数据\(20260309\)](https://bytedance.larkoffice.com/wiki/MVaVwcn89in8GbkA0Rqcyv5rnYe)

# 评测计划

Q2评测有以下工作：

- 双周体验：小双周主要针对近两周迭代的专项体验，大双周针对产品整体体验效果；产出为评测报告，含归因分析、能力得分、问题分析和优化方向
[【2026】AI汽车迭代开发管理表](https://bytedance.larkoffice.com/sheets/Hu66so5fMhsfvJtgcTUczOrGn8I?sheet=erXvKt)

- 重点场景评测，产出为重点场景（需覆盖E68核心用户使用场景）和评测报告

- 竞品评测（理想/小鹏/小米/蔚来），产出为评测报告。

    - 注：主要是用1\.0方案评测，会有2\.0少量场景摸下底

- 评测流程自动化（链路搭建/对话生成/检查点生成/打分/归因分析）



# 待办项

<table><tbody>
<tr>
<td colspan="2">

任务

</td>
<td>

目标

</td>
<td>

时间安排

</td>
<td>

参与人

</td>
</tr>
<tr>
<td colspan="2">

优化2\.0评测体系

- 如何评测“拟人感”

- 对话节奏的把握

</td>
<td>



</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td colspan="2">

使用2\.0体系对AI car进行评测

- 选定核心场景（元素、需求），并确定相应检查点

- 实车评测（记录log和问题分析及最后的打分）

- 出具报告（含评测结果，评测优化方向）

</td>
<td>

- 对AI car的能力进行评测

- 验证2\.0的的可行性（是否能解决本文中列举的问题，是否能很好地摸清能力水位）

</td>
<td>

3月初进行第一次

</td>
<td>

@徐庆@张洧@陈芮婷

</td>
</tr>
<tr>
<td colspan="2">

对理想、小米、小鹏进行第二轮评测

- 使用1\.0复测

- 挑选2\.0进行简单评测尝试

</td>
<td>



</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td colspan="2">

搭建核心场景库

</td>
<td>

明确重点评估场景

</td>
<td>

持续进行

预计2月完成



</td>
<td>

@徐庆

@陈芮婷

各场景负责人

</td>
</tr>
<tr>
<td colspan="2">

搭建核心评测集

</td>
<td>

用于最核心、基本的能力评测

</td>
<td>

2月完成

</td>
<td>

@陈芮婷

</td>
</tr>
<tr>
<td rowspan="3">

自动化评测体系搭建

</td>
<td>

场景对话、检查点相关提示词编写

</td>
<td rowspan="3">

- 提升评测效率

- 提升评测一致性与客观性

- 更好地做归因分析

</td>
<td>

2月完成

</td>
<td>

@徐庆@张洧@陈芮婷

</td>
</tr>
<tr>
<td>

链路搭建

</td>
<td>

待定

</td>
<td>

@陈芮婷

**需要一个工程同学配合**

</td>
</tr>
<tr>
<td>

模拟器生成上下文

</td>
<td>

待定

</td>
<td>

@吴仁杰

@陈芮婷

</td>
</tr>
</tbody></table>



Reference：

[智能纪要：AIME\&amp;AI汽车评测交流 2025年12月18日](https://bytedance.larkoffice.com/docx/OuRwdKrdyoJSyrxkBWfceYo0nYf)

https://bytetech\.info/articles/7520513198663925798\#Xw4FdWAvKoy9WexaePFcfSWKn0b

https://mp\.weixin\.qq\.com/s/RLOcF40RZwxuPeDj4IDzWw

[Your AI Product Needs Evals](https://hamel.dev/blog/posts/evals/)

[Evals, error analysis, and better prompts: A systematic approach to improving your AI products](https://www.youtube.com/watch?v=PgzOBNse2EA)

[How to Build AI Evals in 2026 \(Step\-by\-Step, No Hype\)](https://www.youtube.com/watch?v=J7N9FMouSKg)

[Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)





Out of scope

能不能及格：维度检查

好不好：做比较

情感识别精准度、共情回应适配性、对话语境连贯性。

**长期记忆能力**：能否跨会话记住用户的偏好、经历、禁忌（比如 “记得我对猫毛过敏”“知道我上周失恋了”）；

**人格一致性**：AI 的 “人设” 是否稳定（比如设定为 “温柔的朋友”，就不会突然说出犀利刻薄的话）；

**社交适配性**：能否适配用户的社交习惯（比如用户喜欢幽默吐槽，AI 就不会过度严肃；用户需要鼓励，AI 就不会泼冷水）；

**边界感把控**：不会过度侵入隐私，也不会在用户需要独处时过度打扰。


