## 背景

1. AI汽车的Planner特定任务如定时任务、条件任务，需要特定的条件/信号来触发任务的执行。
1. 主动服务Advisor需要特定的条件来触发其主动思考建议。
1. 传统规则引擎仍然有其用武之地，需要考虑融合当前基于大模型的任务执行体系。

## 产品概述

### 概念解释

1. 一句话解释“条件触发器”：采集信号-判断条件-驱动执行，即根据采集到的各类信号，当满足一定条件时，驱动下游执行特定动作。
1. 关于“信号”：广义上的信号是指各类条件对应的具体数据
- 传统规则引擎中，它可以是车身状态/can信号对应的key-value，如车门状态：doorState（open/closed）;
- 融合大模型后，信号也可以指能够被模型理解的自然语言，如视觉模型对于环境/人物动作的描述，“小明在副驾睡着了”。
1. 关于“场景”：“场景”对应{一组条件+一组执行内容}，即场景描述了一个条件语句“if....then....”，如：
- “if舱内温度<10度且舱外温度<10度且空调未开启，then打开主副驾空调设置3档25度。”
- “if副驾有人且连续打哈欠，then触发舒适性advisor思考是否需要提供舒适性建议”
1. 关于“触发”：触发是指条件命中后，系统对下一步动作的反馈/指示，它可以是一个具体的指令（传统场景引擎），也可以是对下游系统的一个提示。

### 产品链路

<whiteboard token="S5GBwYWinhJEz3b0KKMc3AmXnOh"/>

## 功能描述

### 信号采集

#### 信号的来源

信号源分为端侧和云侧两种类型：

- **端侧**
1. 端状态：车辆自身的状态信息，结构化数据，如四门两盖、车窗、车速、档位等。
1. VLM：端侧VLM观测到的事件，结构化，如人物表情、人物动作、空间环境等。
1. 埋点：车机系统埋点，结构化数据，如：应用打开/关闭，按钮点击等。
1. 电子围栏：进出地理围栏的信号，结构化数据，如“进入公司500m范围内”。
1. 日期时间：年月日时分，结构化数据。
- 云侧
1. 后端业务服务：后端某些业务服务的特定节点/状态，如“用户登录成功”、“用户取消了订单”。
1. 事件服务：汇集的各类座舱事件，可直接作为信号。

#### 信号采集方式

1. 端云同时采集，但端侧信号需同步至云端，即保证在低延迟的前提下，云端有信号全集。
1. 所有信号以类似系统快照的形式，存储对应时刻系统的所有状态，提供后续触发器扫描判定。

### 场景管理

#### 场景生成/注册

1. 场景生成的渠道有以下几类，共同形成了“场景库”：
- 主动服务Advisor：定义了每个advisor关注的所有信号，也即哪些信号会触发哪个advisor去思考。
- Planner：来自Planner的条件任务&定时任务，即什么条件下/到达特定时间，需要告诉planner去执行特定任务。
- 产品预设：由项目定制的需要预设的场景，如低电量告警等。
- 用户自定义：类似理想任务大师，极氪场景工坊等，开放给用户自定义生成的场景。
- 其他：车机运营配置，如节日问候等。提供运营后台。
1. 场景由生效范围+条件+执行内容三个要素组成。
- 生效范围：指这个场景的生效时间、生效目标等，目标可以是指定车辆（Vin集合），也可以是特定车型、特定软件版本。
- 条件：定义了对一个或多个信号的判断标准，是执行内容的前置依赖。一个场景可以定义一个或多个条件以及条件之间的逻辑关系（与/非）。
- 执行内容：定义了当条件达成时，系统需执行的下一步动作。动作可以是一个或多个。

##### 条件定义

1. 根据不同的信号类型和场景，条件的要素/格式存在差异，条件运算符包括“大于（等于）、小于（等于）、等于、不等于”。（VLM信号以标签化形式上报）
1. 除此之外，支持持续时间、循环次数等附加条件属性。如“连续切歌10次”、“宝宝睡觉时间大于1h”。
1. 详细条件范围及格式：<mention-doc token="KknGwH9KlinL4bkhNZTck7tinLe" type="wiki">AI汽车触发器条件&执行项</mention-doc>。

##### Planner条件解析

<whiteboard token="M61GwGhWyhbCSxbANIqcc2rgnwK"/>

1. Planner推理出条件任务（含定时任务）并进行任务语句规整后，需调用触发器进行场景生成。
1. 触发器内有独立的解析器，具备从任务语句中解析出条件项的能力，此种情况下，执行项则默认是“通知Planner任务触发”。如：

<quote-container>

Planner：“我下车时提醒我拿手机”

---->“条件：主驾下车”&“执行项：通知planner任务触发”

Planner：“一会儿八点的时候播放上海音乐广播”

---->“条件：time==2025年12月6日 UTC+8 8:00”&“执行项：通知planner任务触发”
</quote-container>

解析器除了解析条件，还需对来自planner的任务进行常识性判断，若黄赌毒、反科学等任务内容，则直接注册失败。

1. 场景注册成功，则触发器保存条件+执行项+任务原文，生成一条场景。条件任务的注册结果，触发器需要回复给Planner。
1. 当来自planner的场景被触发时，触发器需要通知planner任务被触发。完成一个条件任务的闭环。

##### 执行内容定义

1. 执行内容代表了系统的能力边界，可暂时分以下几类：
- 原子车控：最基础的能力，范围和形态大致对应FC。（端侧和云侧的车控）
- 云端能力：云端沉淀出的原子能力，如：“系统推送”。
- 大模型相关：如advisor触发、planner通知。
- HMI触达：卡片弹窗、语音播报等。
1. 执行疲劳管理：支持对执行的频率、次数等进行控制。包括：单次上下电周期内x次、单日x次、全生命周期x次、最低触发间隔等。
1. 能力范围清单：<mention-doc token="KknGwH9KlinL4bkhNZTck7tinLe" type="wiki">AI汽车触发器条件&执行项</mention-doc>。

#### 端侧场景下发

1. 场景是否下发端侧进行端侧闭环，由服务端人为配置。遵循的基本原则：
- 端侧：逻辑简单、固定，端侧可闭环。
- 云端：依赖云端服务或模型。
1. 客户端触发器模块需具备拉取最新场景的机制。包括：
- 每次启动时
- 固定间隔（如10分钟）
- 收到云端更新通知。

### 场景触发

<whiteboard token="TBAmwKMR3hHYnhbEWHtcaHKdnCd"/>

#### 条件扫描和场景判定

1. 触发器有端云两部分，端侧只处理已下发的场景，云端则处理云端对应的场景。
1. 任意信号更新或达到扫描周期（如每隔5s），都会触发条件扫描，以检测场景库中是否有场景被触发（即场景所配置的所有条件达成）。
1. 对每辆车进行场景判定时，只在该车辆对应的场景集合内进行判定。
1. 示例case：

<quote-container>

场景A（vin-1）：

if{

VLM事件：主驾上车 **AND** 舱内温度<10 **AND** 舱外温度<5

}

then{

执行车控：打开空调，风量3档，温度26度

}

===============

信号（vin-1）上报：

signal：

舱内温度：9度

舱外温度：3度

VLM事件描述：

{

event：用户上车；

位置：主驾；

faceid:123

}

=================

判定结果：场景A达成

调用空调车控：打开空调；set风量==3，温度==26
</quote-container>

##### 数值抖动过滤

1. 部分条件，尤其是数值区间类条件，由于硬件信号可能存在抖动，例如由于开窗情况下，车内温度不稳定，此时如果设定了温度条件，则可能出现温度条件被反复误触发的情况。
1. 端云两侧都需要支持在条件被首次触发后，在一定时间窗口内过滤数值抖动。如：

<quote-container>

条件：车速大于130km/h

执行：车速过快提醒

抖动区间：125-135

抖动周期：30s

则8:00:00车速达到131，触发提醒后，在8:00:30前，只要车速在125-135区间内均不会再次触发提醒。
</quote-container>

#### 内容执行

1. 当判定出有场景被触发时，触发器则执行场景中设定好的内容。
- 端侧：直接本地执行对应的指令：如车控、播报等。
- 云侧：直接执行操作，或触发advisor/planner。
1. 端侧闭环执行，但需把执行记录汇总上报至云端存储。

#### 场景冲突机制

1. 支持对场景设置优先级，如：1-10档。当某一次扫描触发了多个场景时（端侧和云端相互独立），则仅执行优先级最高的一个场景，相同优先级则随机顺序执行。
1. planner任务默认最高优先级。

## 实施Roadmap

<whiteboard token="YZiow7WOKhuXe5bLbFacs4iOnSh"/>

一期功能范围（1227）：

<lark-table rows="11" cols="5" header-row="true" column-widths="138,138,371,144,144">

  <lark-tr>
    <lark-td>
      一级功能
    </lark-td>
    <lark-td>
      二级功能
    </lark-td>
    <lark-td>
      功能描述
    </lark-td>
    <lark-td>
      优先级
    </lark-td>
    <lark-td>
      备注
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      信号/条件类型
    </lark-td>
    <lark-td>
      端状态
    </lark-td>
    <lark-td>
      支持端状态信号（基于sls改制车）
    </lark-td>
    <lark-td>
      P0
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      VLM感知
    </lark-td>
    <lark-td>
      支持VLM感知信号（仅P0部分）
    </lark-td>
    <lark-td>
      P0
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      时间
    </lark-td>
    <lark-td>
      支持时间信号
    </lark-td>
    <lark-td>
      P0
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      场景创建
    </lark-td>
    <lark-td>
      手动注册
    </lark-td>
    <lark-td>
      支持人为定义并注册场景，如主动服务场景
    </lark-td>
    <lark-td>
      P0
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      Planner注册
    </lark-td>
    <lark-td>
      支持Planner条件任务注册，含条件解析
    </lark-td>
    <lark-td>
      P0（和Planner条件任务协同）
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      场景触发（云端）
    </lark-td>
    <lark-td>
      条件判定
    </lark-td>
    <lark-td>
      支持范围内条件的触发判定（端状态、VLM事件、时间）
    </lark-td>
    <lark-td>
      P0
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      执行频次限定
    </lark-td>
    <lark-td>
      支持对执行的频次进行限定，一期使用单一默认策略
    </lark-td>
    <lark-td>
      P0
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      advisor触发
    </lark-td>
    <lark-td>
      支持advisor触发
    </lark-td>
    <lark-td>
      P0
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      Planner任务触发
    </lark-td>
    <lark-td>
      支持Planner条件任务触发
    </lark-td>
    <lark-td>
      P0（和Planner条件任务协同）
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      触发器管理后台
    </lark-td>
    <lark-td>
      场景配置管理
    </lark-td>
    <lark-td>
      手动配置场景
    </lark-td>
    <lark-td>
      P1
    </lark-td>
    <lark-td>
      解放开发配置人力
    </lark-td>
  </lark-tr>
</lark-table>

## 示例case

### Planner条件任务

1. 原始query：“十分钟后帮我关掉座椅加热”（假设当前时间是2025/12/12 10:10:30）

<quote-container>

--> planner调用条件任务注册工具：query改写：“十分钟后，关闭主驾座椅加热”

-->任务条件解析：

**condition**: {

time: 2025/12/12 10:20:00

}

**action**: notify planner

**Scene_name**: 十分钟后，关闭主驾座椅加热

-->tool回复：条件任务已注册

-->场景触发：通知planner：“十分钟后，关闭主驾座椅加热”已触发
</quote-container>

1. 原始query：“副驾上车后给她唱小星星”

<quote-container>

--> planner调用条件任务注册工具：query改写：“副驾上车后，唱小星星”

-->任务条件解析：

**condition**: {

副驾占座状态：有人

副驾安全带状态：插入

}

**action**: notify planner

**Scene_name**: 副驾上车后，唱小星星

-->tool回复：条件任务已注册

-->场景触发：通知planner：“副驾上车后，唱小星星”已触发
</quote-container>

1. 原始query：“车内温度超过28度之后让我凉快一下”

<quote-container>

--> planner调用条件任务注册工具：query改写：“车内温度超过28度时，让车内环境凉爽一些”

-->任务条件解析：

**condition**: {

车内温度：大于28度

}

**action**: notify planner

**Scene_name**: 车内温度超过28度时，让车内环境凉爽一些

}

-->tool回复：条件任务已注册

-->场景触发：通知planner：“车内温度超过28度时，让车内环境凉爽一些”已触发
</quote-container>

1. 原始query：“车内温度比较高时把我空调打开”

<quote-container>

--> planner调用条件任务注册工具：query改写：“车内温度超过26度时，打开空调”

-->任务条件解析：

**condition**: {

车内温度：大于26度

}

**action**: notify planner

**Scene_name**: 车内温度超过26度时，打开空调

-->tool回复：条件任务已注册

-->场景触发：通知planner：“车内温度超过26度时，打开空调”已触发
</quote-container>

1. 原始query：“我比较累的时候给我放首歌”

<quote-container>

--> planner调用条件任务注册工具：query改写：“检测到主驾用户疲劳时，播放林俊杰的歌曲”

-->任务条件解析：

**condition**: {

vlm人物列表:{

人物位置：主驾

人物动作：打哈欠

}

}

**action**: notify planner

**Scene_name**: 检测到主驾用户疲劳时，播放林俊杰的歌曲

-->tool回复：条件任务已注册

-->场景触发：通知planner：“检测到主驾用户疲劳时，播放林俊杰的歌曲”已触发
</quote-container>

### 主动服务

1. 上车打招呼+舒适环境营造

<quote-container>

配置场景：

**Condition**: {

vlm人物列表:{

人物位置：任意

人物动作：上车

}

}

**Action**: trigger 情感advisor

**scene_name**: 上车打招呼+舒适环境营造
</quote-container>

1. 下车道别

<quote-container>

配置场景：

**Condition**: {

vlm人物列表:{

人物位置：任意

人物动作：下车

}

}

**Action**: trigger 情感advisor

**scene_name**: 后排儿童睡眠舒适

</quote-container>

1. 不舒适行为后的舒适调整

<quote-container>

配置场景：

**Condition**: {

vlm人物列表:{

人物位置：任意

人物动作：擤鼻涕/按摩太阳穴/扇风/甩领子/甩衣服

}

}

**Action**: trigger 舒适advisor

**scene_name**: 不舒适行为后的舒适调整
</quote-container>

1. 状态关怀（睡觉、看书、看电脑、拿游戏机、喝水）

<quote-container>

配置场景：

**Condition**: {

vlm人物列表:{

人物位置：副驾/二排左/二排中/二排右

人物动作：睡觉/看书/看电脑/拿游戏机

}

}

**Action**: trigger 舒适advisor

**scene_name**: 状态关怀（睡觉、看书、看电脑、拿游戏机、喝水）
</quote-container>

1. 副驾睡眠关怀

<quote-container>

配置场景：

**Condition**: {

vlm人物列表:{

人物位置：副驾

人物动作：睡觉

}

且

座椅占位:{

位置：二排右

状态：无人

}

}

**Action**: trigger 舒适advisor

**scene_name**: 副驾睡眠关怀
</quote-container>

1. 抽烟关怀：

<quote-container>

配置场景：

**Condition**: {

vlm人物列表:{

人物位置：任意

人物动作：抽烟

}

}

**Action**: trigger 舒适advisor

**scene_name**: 抽烟关怀
</quote-container>
