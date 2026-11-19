# AI car-主动服务 onepage（副本-补充系统预设任务）（飞书原文转存；更新时间 2026-10-19）

来源链接：https://bytedance.larkoffice.com/docx/QvAed4dQso6VvTxn70zcDt0enPd

<callout emoji="gift_heart" background-color="light-purple" border-color="light-purple">

在AI car项目中，<text bgcolor="light-green" underline="true">**主动服务**</text>**=**<text bgcolor="light-green">**静态advisor**</text>**+**<text bgcolor="light-green">**系统预设任务**</text>
</callout>

# 系统预设任务<mention-user id="ou_d35304ddd7e37a06ebac58f7f60b6522"/>

## 产品概述

### 系统预设任务是什么？

**系统预设任务是产品预先定义、用户一键开启、长期在线运行的主动服务。**用户不必每次都下达指令：任务开启后，系统持续观察人、车与环境，<text color="blue">**在场景真正发生的那一刻主动给出建议或完成操作**</text>；服务完成后自动回到等待状态，下一次条件满足时再次出现。**它解决的不是一次性问答，而是一类"高频、确定、值得长期托付"的用车需求。**

一项系统预设任务有三个核心特征：

- **出厂即有、一键开启：**任务由产品提前定义并随系统提供，默认开启，用户可以在任务中心随时关闭；新增任务通过云端配置下发，不必依赖整车系统升级。
- **长期在线、条件触发：**任务开启后持续运行，只有当人、车、环境的状态组合命中预设条件时才唤醒一次，其余时间安静待命，不打扰用户。
- **有始有终、安全闭环：**从条件命中、给出建议、用户确认（或按约定静默执行），到真正完成车辆动作并回读真实结果，每一步都有状态、有兜底；用户也始终保有知情与拒绝的权利。

### 系统预设任务和静态advisor是什么关系？

<quote-container>

静态advisor解决"开放式场景下该不该关心、关心什么"——靠模型主动推理，覆盖面广、个性化强。
</quote-container>

系统预设任务解决"确定性场景下如何在最精准的窗口稳定交付"——靠规则与配置精确命中，确定性高、即时性强。

两者共同构成 AI car 的主动服务，一个负责"想得到更多"，一个负责"办得更稳"：

<lark-table rows="6" cols="3" header-row="true" column-widths="120,270,270">

  <lark-tr>
    <lark-td>
      **维度** {align="center"}
    </lark-td>
    <lark-td>
      **系统预设任务** {align="center"}
    </lark-td>
    <lark-td>
      **静态advisor** {align="center"}
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **场景边界**
    </lark-td>
    <lark-td>
      产品预先收敛的高频确定场景，数量有限、规则清晰
    </lark-td>
    <lark-td>
      开放式的人、车、生活场景，覆盖舒适、出行、情感、内容四大领域
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **决策方式**
    </lark-td>
    <lark-td>
      规则与配置驱动，必要时叠加视觉识别，结果确定可验收
    </lark-td>
    <lark-td>
      大模型结合上下文推理，千人千面、持续进化
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **触发时机**
    </lark-td>
    <lark-td>
      对推荐窗口期要求高，需在最佳时点即时出现
    </lark-td>
    <lark-td>
      持续运行、按需推理，侧重陪伴与洞察
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **个性化程度**
    </lark-td>
    <lark-td>
      低个性化，同一服务面向所有用户的同一标准
    </lark-td>
    <lark-td>
      高个性化，随记忆、习惯与反馈不断校准
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **用户感知**
    </lark-td>
    <lark-td>
      默认开启、按需开关，关键时刻"恰到好处地出现"
    </lark-td>
    <lark-td>
      持续在线，营造松弛感、信任感与陪伴感
    </lark-td>
  </lark-tr>
</lark-table>

<text underline="true">**最关键的产品边界是：**</text>

- <text underline="true">**系统预设任务不重复造一套智能体系，它复用 advisor 已验证的交互、卡片与执行链路，只把"确定性场景的精确触发"做成稳定能力；**</text>
- <text underline="true">**同一类任务可以"规则先行、模型补判"：先用规则锁定大概率场景，再由视觉或模型做最终确认，兼顾确定性与准确性。**</text>

## 产品方案

系统预设任务通过<text color="blue">**"任务中心管理 + 触发器判断 + 即时交互承接 + 车控执行回读"**</text>的端云协同链路，把一项长期服务从配置稳定送到真实车辆结果。

### 全局方案架构图

<whiteboard token="SjNhwSZKFhLyImbWeitcer3cndc"/>

系统预设任务整体分为**管理面**与四层运行链路：管理面负责任务的配置、下发与用户开关，贯穿任务全生命周期；运行时由数据底座持续供给车况与视觉信息，经接入层、触发判断层（规则引擎 + 模型补判）、交互策略层，最终由执行与反馈层完成车控动作与真实结果回读。

### 端云协同流程

<whiteboard token="X8G5w3JgHh3aQjbUPKfcJTtDnVd"/>

系统先确认任务已开启，再按任务类型分流：**确定场景由端侧规则即时判断**（绿色），**复杂场景由云端判断并按需调用模型补判**（蓝色）。场景成立后，按任务预先约定的风险等级选择**静默执行、告知执行或语音确认**；需要用户确认的，用户同意后才进入执行。执行前统一复核最新车况，执行后回读真实车辆状态。任务未开启、场景不成立或用户拒绝时，本次立即结束、不执行车控；任务始终保持在线，等待下一次场景出现。

### 端云分工：确定性归端侧、复杂判断归云端

- **端侧自闭环任务：**规则完全确定、要求低时延、弱网下仍需可靠工作的任务，在车端直接完成判断与动作闭环，例如雨雪雾天气下的驾驶模式保护。
- **云端协作任务：**需要视觉识别、模型推理或更多上下文的任务，在云端完成条件校验与二次判断，再通过统一的主动服务链路与用户交互，例如识别充电设备后开启充电口盖。
- **统一的责任边界：**触发器只负责判断"场景何时发生"并发出业务事件，不直接创建卡片或执行车控；交互由即时交互卡承接，最终动作由原业务在复核最新车况后下发，避免规则、交互与控制相互耦合。

### 交互策略与安全底线

不同任务按风险与打扰程度，预先约定三档交互策略：**静默执行**（如视野受限时自动开启后视镜加热，做完可告知）、**告知执行**（仅通知、无需确认）、**语音确认**（涉及车辆动作时，通过卡片与语音先征得用户同意）。

无论哪一档，系统都守住同一条底线：**需要车辆动作时，用户始终保留确认权，车端保留最终安全门禁；动作下发前重新复核任务与车况，动作完成后回读真实车辆状态**，用户拒绝、关闭、超时或条件失效时本次立即终止，不动作、不打扰、不重复。

## 典型场景

首批系统预设任务聚焦用户"高频遇到、但自己常常顾不上处理"的安全、视野与补能场景，全部默认开启、可在任务中心关闭：

<lark-table rows="5" cols="4" header-row="true" column-widths="150,230,170,110">

  <lark-tr>
    <lark-td>
      **任务** {align="center"}
    </lark-td>
    <lark-td>
      **触发与动作** {align="center"}
    </lark-td>
    <lark-td>
      **用户价值** {align="center"}
    </lark-td>
    <lark-td>
      **运行方式** {align="center"}
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **天气/路况保护**
    </lark-td>
    <lark-td>
      识别到下雨、下雪、浓雾或路面湿滑、结冰时，主动建议切换湿滑/雪地模式或开启后雾灯
    </lark-td>
    <lark-td>
      恶劣天气下第一时间保障行车安全，用户不必分心操作
    </lark-td>
    <lark-td>
      端侧自闭环
      语音确认
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **后排儿童/宠物关怀**
    </lark-td>
    <lark-td>
      行车中识别到后排有儿童或宠物、且儿童锁未开启时，提醒并在确认后开启儿童锁
    </lark-td>
    <lark-td>
      消除儿童、宠物误开车门的安全隐患
    </lark-td>
    <lark-td>
      云端协作
      语音确认
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **后视镜自动加热**
    </lark-td>
    <lark-td>
      雨天低速行驶、自动洗车结束或湿热起雾时，主动开启后视镜加热，恢复清晰视野
    </lark-td>
    <lark-td>
      视野关键部件保持清晰，无需用户记住手动开启
    </lark-td>
    <lark-td>
      云端/端侧
      静默执行
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **充电口盖智能开启**
    </lark-td>
    <lark-td>
      低电量停车、充电口盖关闭时，视觉确认车旁存在充电设备，再询问用户是否一键开盖
    </lark-td>
    <lark-td>
      补能准备少一步操作，识别不确定时绝不误触发
    </lark-td>
    <lark-td>
      云端协作
      语音确认
    </lark-td>
  </lark-tr>
</lark-table>

### 体验场景示例

**安全：**下雨天车辆刚驶入快速路，系统识别到路面湿滑，即时卡片轻声提示"检测到路面湿滑，要切换到湿滑模式吗？"，用户一句"好"即完成切换；无需动手，注意力始终留在路面上。

**视野：**自动洗车结束驶离，后视镜还挂着水珠，系统已在用户察觉之前静默开启加热，几分钟后镜面恢复清晰——用户什么都不用做。

**补能：**傍晚回家电量偏低，挂入 P 挡停车，系统看到后方充电桩，主动询问"你可能在充电桩附近，要打开充电口吗？"，确认后口盖弹开，拔枪即充。

**关怀：**后排坐着孩子，挂挡起步时系统留意到儿童锁尚未开启，提醒并经确认后默默锁上，全程不打扰、不重复。

## 平台化能力

系统预设任务不是为单个场景定制的功能，而是一套<text color="blue">**可持续扩展的主动服务能力框架**</text>，让确定性的好体验可以被规模化复制：

- **配置化生产：**产品可在统一配置平台定义一项任务的适用范围、触发条件、交互策略与执行动作，组合已接入的车况、视觉、卡片与车控能力，新增场景无需逐案重做整条链路。
- **服务化交付：**任务列表按车辆统一管理与下发，车辆上电时自动更新，新任务无需等待整车系统升级即可上线；开关状态随车保存，换账号也不改变用户已有的选择。
- **可观测运营：**每一次触发、识别、交互与车辆结果都有完整记录，便于定位"为什么没触发、为什么没执行"，也为后续策略优化提供真实数据。
- **渐进式扩展：**首批聚焦安全、视野、补能四个高确定性场景；随着车况信号、视觉识别与车控原子能力的接入，更多高频确定的主动服务可以按同一套框架持续生长。

# 静态advisor <mention-user id="ou_50222d018d90a9d2451f69f7426dd0c7"/>

## 产品概述

### 静态advisor是什么？

**静态advisor核心是提供主动服务，这个主动服务不再是偶尔触发的、时而精准时而恼人的“小把戏”，而是演变为一种**<text color="blue">**“持续运行、懂你所想、思你未思”**</text>**的可靠基础服务，最终让用户获得前所未有的**<text color="blue">**“松弛感、信任感和陪伴感”**</text>**。**

各advisor的核心体验目标：

舒适advisor：保障<text underline="true">**车内每个人的舒适**</text>，包括温湿度、空气、空间...

出行advisor：在保障安全与效率的前提下，为乘客提供个性化、<text underline="true">**省时**</text>、<text underline="true">**省心**</text>（低负担）、<text underline="true">**省钱**</text>的出行体验。

情感advisor：具备对<text underline="true">**情境察言观色**</text>的能力、具备对用户的<text underline="true">**共情和移情能力**</text>、让用户感知到<text underline="true">**被关心、被理解、被陪伴**</text>

内容advisor：用户在行车驻车的车上时光，**不无聊、有价值，得到内容的满足**

### 静态advisor和planner/DT的关系是什么？

<quote-container>

planner/DT承接的是用户发起的query内容——被动承接
</quote-container>

advisor通过观察人、车、环境情况，主动的发现问题并提出合适的解决方案——主动挖掘

这两者相辅相成，planner+advisor=完整车载智能

<text underline="true">**最关键的产品边界是：**</text>

- <text underline="true">**advisor 不替代 planner，它负责“该不该主动关心、关心什么、建议什么”；**</text>
- <text underline="true">**planner 负责“用户或 advisor 给出目标后，怎么把事情办成”。**</text>

<whiteboard token="T358wN2ybhte4MbKNtic1DjWn3e" width="588" height="217"/>

## 产品方案

<callout emoji="gift_heart" background-color="light-purple" border-color="light-purple">

</callout>

### 分层架构图

<whiteboard token="Hib5wEtpzhUJUrbhbLFcE5ZOnng"/>

### *工作流架构图*

<whiteboard token="MOP6wVlVnhEFM9bQM4ScIF4lndh"/>

## 产品feature-list

<callout emoji="deaf_woman" background-color="light-orange" border-color="light-orange">

<mention-doc token="HaOMbEic6aboQgsReuHci5oRntb" type="bitable">【仅对内】静态advisor（FL&专家场景集&input）--主线进展（50%）</mention-doc>
</callout>

<lark-table rows="49" cols="7" header-row="true" column-widths="100,100,119,275,220,71,100">

  <lark-tr>
    <lark-td>
      **一级能力** {align="center"}
    </lark-td>
    <lark-td>
      **二级能力** {align="center"}
    </lark-td>
    <lark-td>
      **三级能力** {align="center"}
    </lark-td>
    <lark-td>
      **功能说明** {align="center"}
    </lark-td>
    <lark-td>
      **典型场景** {align="center"}
    </lark-td>
    <lark-td>
      **赛力斯** {align="center"}
    </lark-td>
    <lark-td>
      **排期** {align="center"}
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      推理触发
    </lark-td>
    <lark-td>
      事件触发
    </lark-td>
    <lark-td>
      预设事件触发推理
    </lark-td>
    <lark-td>
      基于预先定义的高频事件触发 advisor 推理，用于覆盖确定性高、可验收、适合先上线的主动服务入口。
    </lark-td>
    <lark-td>
      /
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      1期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      事件触发
    </lark-td>
    <lark-td>
      动态事件触发推理
    </lark-td>
    <lark-td>
      根据运行过程中的事件日志、信号变化或场景变化生成动态事件，让 advisor 不只响应固定入口，也能在行程中发现新需求。
    </lark-td>
    <lark-td>
      /
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      2期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      目标追踪
    </lark-td>
    <lark-td>
      子目标 review 触发推理
    </lark-td>
    <lark-td>
      对 advisor 已生成的<text underline="true">**舒适或出行**</text>子目标进行定时复查，判断目标是否完成、是否需要调整、是否需要删除。
    </lark-td>
    <lark-td>
      /
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      1期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      主动服务开关
    </lark-td>
    <lark-td>
      主动服务的开关状态
    </lark-td>
    <lark-td>
      开启：静态advisor正常运行
      关闭：静态advisor停止运行（模型不推理、不输出advice、若有子目标则删除）
    </lark-td>
    <lark-td>
      /
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      1期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      推理信息
    </lark-td>
    <lark-td>
      Context
    </lark-td>
    <lark-td>
      端状态/世界信息/记忆/视觉信息
    </lark-td>
    <lark-td>
      为 advisor 推理提供车、人、环境、时间、导航、媒体、记忆等上下文输入。
    </lark-td>
    <lark-td>
      /
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      1期：
      2期：
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      Tools
    </lark-td>
    <lark-td>
      AI navi/AI 内容/天气/...
    </lark-td>
    <lark-td>
      为出行、内容、舒适等 advisor 提供导航、天气、充电站、停车场、媒体、车控等工具查询和执行能力。
    </lark-td>
    <lark-td>
      /
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      1期：
      2期：
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      动态goal list
    </lark-td>
    <lark-td>
      动态goal list
    </lark-td>
    <lark-td>
      接入用户自己创建的条件任务、定时任务以及长时任务，避免主动推荐和用户任务冲突
    </lark-td>
    <lark-td>
      /
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      2期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      ~~个人世界模型~~
    </lark-td>
    <lark-td>
      ~~个人偏好与长期习惯理解~~
    </lark-td>
    <lark-td>
      ~~沉淀用户地点、习惯、偏好、反馈和打扰边界，让主动服务从场景命中升级为个性化判断。~~
    </lark-td>
    <lark-td>
      ~~/~~
    </lark-td>
    <lark-td>
      ~~TBD~~
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      历史建议
    </lark-td>
    <lark-td>
      各个adv的历史建议
    </lark-td>
    <lark-td>
      结合之前给出过什么样的建议（以及该建议是否被planner承接），避免给出重复或和之前冲突的建议
    </lark-td>
    <lark-td>
      /
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      1期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      推理编排
    </lark-td>
    <lark-td>
      多事件处理
    </lark-td>
    <lark-td>
      多事件协调
    </lark-td>
    <lark-td>
      当短时间内多个事件触发同一个advisor（上一个事件还没完成输出），打断当前推理，合并事件推理、避免重复打扰或互相冲突。
    </lark-td>
    <lark-td>
      /
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      1期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      推理范围
    </lark-td>
    <lark-td>
      舒适 Advisor
    </lark-td>
    <lark-td>
      环境自适应车控
    </lark-td>
    <lark-td>
      基于车内外温度、湿度、露点/玻璃温度、空调和车窗状态等环境信号，在用户上车时识别高温、低温、起雾等不舒适风险，主动推荐或执行制冷、制热、除雾等舒适策略。
    </lark-td>
    <lark-td>
      • 夏季高温上车 
      • 冬季低温上车 
      • 上车起雾处理
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      1期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      舒适 Advisor
    </lark-td>
    <lark-td>
      人员自适应车控
    </lark-td>
    <lark-td>
      结合乘员位置、体感差异、行为状态和局部环境，识别运动后出汗、低温接人、单侧日晒、多乘员温差等场景，为不同座位给出分区温度、风向、座椅/空调策略，尽量满足个人舒适并降低相互冲突。
    </lark-td>
    <lark-td>
      • 运动后急速冷却 
      • 低温接人暖手 
      • 阳光热感补偿 
      • 多乘员温差冲突
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      1期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      舒适 Advisor
    </lark-td>
    <lark-td>
      智能起雾防范
    </lark-td>
    <lark-td>
      基于露点、玻璃温度、车内外温湿度、地库出入等信号，提前判断前挡或车窗起雾风险，在视线受阻前推荐或执行除雾、防雾策略，同时兼顾车内温度舒适。
    </lark-td>
    <lark-td>
      • 出库预判起雾 
      • 起雾风险预防
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      1期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      舒适 Advisor
    </lark-td>
    <lark-td>
      主动空气净化
    </lark-td>
    <lark-td>
      面向拥堵尾气、重污染、车内 PM2.5 升高等空气质量问题，结合车窗、内外循环和空气净化能力，主动推荐或执行隔绝外部污染、开启净化，并在污染场景结束后恢复到合适状态。
    </lark-td>
    <lark-td>
      • 拥堵防废气 
      • 重污染防护
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      1期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      舒适 Advisor
    </lark-td>
    <lark-td>
      特殊成员舒适关怀
    </lark-td>
    <lark-td>
      当车内有儿童、老人或宠物等对温度、风量和空气质量更敏感的成员时，结合座位和环境状态调整舒适策略，避免直吹、过冷过热或空气不佳，优先保障特殊成员的安全与舒适。
    </lark-td>
    <lark-td>
      • 儿童/老人乘车 
      • 宠物同行
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      1期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      舒适 Advisor
    </lark-td>
    <lark-td>
      疲劳驾驶缓解推荐
    </lark-td>
    <lark-td>
      识别长时间或夜间驾驶引发的主驾疲劳风险，结合空调温度、风量/风向、内外循环等舒适车控手段，给出低打扰的清醒辅助建议，帮助缓解困倦并提升行驶安全。
    </lark-td>
    <lark-td>
      • 疲劳驾驶缓解
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      1期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      舒适 Advisor
    </lark-td>
    <lark-td>
      主动开窗通风
    </lark-td>
    <lark-td>
      在春秋、低速、车外温度舒适且空气质量良好的场景下，判断自然通风是否优于继续开空调，并主动推荐开窗或调整空调状态，让用户获得更自然、节能的舒适体验。
    </lark-td>
    <lark-td>
      • 春秋低速开窗自然通风
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      1期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      出行 Advisor
    </lark-td>
    <lark-td>
      【行前】出行目标与目的地预测
    </lark-td>
    <lark-td>
      用户上车后，结合当前的时间、行程、记忆、车内人员情况等维度预测用户本次上车/出行的目标和目的地
    </lark-td>
    <lark-td>
      • 通勤预测-去上班 
      • 通勤预测-回家 
      • 出游预测 
      • 兜风预测 
      • ...
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      1期
      依赖navi
      行程数据
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      出行 Advisor
    </lark-td>
    <lark-td>
      【全程】低电量推荐
    </lark-td>
    <lark-td>
      车电量低于X%（X为用户设置的电量提醒数值），结合当前的车辆位置、导航状态等主动推荐合适的补能方式（家充桩/充电站）
    </lark-td>
    <lark-td>
      • 低电量推荐
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      1期
      依赖navi
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      出行 Advisor
    </lark-td>
    <lark-td>
      【行中】智能推荐最优充电站
    </lark-td>
    <lark-td>
      基于当前剩余续航、目的地距离、导航路线及充电站可用状态，智能推荐沿途最优充电站；当目标站点不可用时，主动推荐附近可用替代站点，保障用户顺利到达目的地。
    </lark-td>
    <lark-td>
      • 出游前导航补能 
      • 出游途中续航不足 
      • 充电站不可用替换推荐
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      1期
      依赖navi
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      出行 Advisor
    </lark-td>
    <lark-td>
      【行末】提前补能规划（充电）
    </lark-td>
    <lark-td>
      到达目的地前，结合目的地类型、预计停留时长和剩余续航，推荐附近合适充电站，帮助用户利用停留时间补能。
    </lark-td>
    <lark-td>
      • 终点充电
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      2期
      依赖navi
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      出行 Advisor
    </lark-td>
    <lark-td>
      【行末】停车规划
    </lark-td>
    <lark-td>
      当用户行驶至导航终点附近时，AI 结合当前位置、目的地类型、停车场 POI、天气、实时路况、用户历史停车习惯等信息，判断用户是否存在停车需求，并主动推荐合适的停车场，降低用户临近终点时寻找停车位的成本。
    </lark-td>
    <lark-td>
      • 终点停车 
      • 停车场不可用替换推荐
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      1期
      接navi-tool
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      出行 Advisor
    </lark-td>
    <lark-td>
      【行中】休息规划
    </lark-td>
    <lark-td>
      基于连续驾驶时长、驾驶员疲劳状态和当前导航路线，识别长途行驶中的疲劳风险，并推荐沿途合适的休息地点，如服务区、停车区等，帮助用户安全休息
    </lark-td>
    <lark-td>
      • 长途行驶疲劳推荐
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      1期
      接navi-tool
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      出行 Advisor
    </lark-td>
    <lark-td>
      【行后】提前补能规划
    </lark-td>
    <lark-td>
      基于用户近期出行计划、历史通勤规律和当前剩余续航，在行程结束后判断后续用车是否存在续航风险，并主动提醒用户提前充电，保障第二天出游、通勤等行程可顺利完成。
    </lark-td>
    <lark-td>
      • 出游提前补能 
      • 通勤提前补能
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      1期
      接navi-tool
      行程数据
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      出行 Advisor
    </lark-td>
    <lark-td>
      【行中】AI 出行功能推荐-导演
    </lark-td>
    <lark-td>
      用户发起导航后，结合用户的目的地、当前时间等信息推荐开启导游功能
    </lark-td>
    <lark-td>
      • 结合行程管家出行目的推荐AI导演 
      • 结合特殊天气/景观/高观赏景色主动推荐AI 导演（TBD）
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      2期
      依赖AI导演功能实现
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      出行 Advisor
    </lark-td>
    <lark-td>
      【行中】AI 出行功能推荐-导游
    </lark-td>
    <lark-td>
      在短途自驾或跨城长途出行中，结合目的地和路线特征，主动推荐导游服务，增强旅途体验。
    </lark-td>
    <lark-td>
      • 短途自驾-AI主动推荐导游服务 
      • 长时自驾-结合目的地为跨城地点时主动推荐导游服务
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      2期
      依赖AI导游功能实现
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      出行 Advisor
    </lark-td>
    <lark-td>
      主动推荐充电狗服务
    </lark-td>
    <lark-td>
      在适合代客补能的场景下，主动推荐充电狗等补能服务，减少用户补能操作负担。
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      非SOP范围，暂不考虑
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      出行 Advisor
    </lark-td>
    <lark-td>
      主动推荐预约充电站
    </lark-td>
    <lark-td>
      结合路线、目的地和用户时间安排，在需要补能时推荐预约充电站，降低排队和不确定性。
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      非SOP范围，暂不考虑
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      出行 Advisor
    </lark-td>
    <lark-td>
      主动优化充电设置
    </lark-td>
    <lark-td>
      结合用户用车计划、充电习惯和电池状态，主动建议优化充电目标、时间或补能策略。
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      非SOP范围，暂不考虑
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      情感 Advisor
    </lark-td>
    <lark-td>
      上车迎宾-通用打招呼
    </lark-td>
    <lark-td>
      乘员上车/入座时，结合当前的时间、face_id、记忆、情绪等信息进行上车打招呼
    </lark-td>
    <lark-td>
      • 单人上车-有 Face ID 用户常规问候 
      • 无 Face ID 用户泛化问候 
      • 主副驾同时上车（间隔时间短） 
      • 情绪个性化问候 
      • ...
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      1期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      情感 Advisor
    </lark-td>
    <lark-td>
      上车迎宾-特殊日期与节庆陪伴
    </lark-td>
    <lark-td>
      在生日、节假日、节气、关系纪念日、提车纪念日等特殊时间点，结合身份、关系、当下情绪等给出合适的祝福/仪式感表达策略。
    </lark-td>
    <lark-td>
      • 生日祝福 • 法定节假日问候 
      • 节气与时令问候 
      • 情感纪念日/520 双人场景（TBD） 
      • ...
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      1期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      情感 Advisor
    </lark-td>
    <lark-td>
      行中安全关怀-分心提醒
    </lark-td>
    <lark-td>
      驾驶员行驶过程中，主动搭话缓解分心
    </lark-td>
    <lark-td>
      • 分心驾驶提醒
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      1期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      情感 Advisor
    </lark-td>
    <lark-td>
      行程中情绪安抚
    </lark-td>
    <lark-td>
      在拥堵、长红灯等待等行程压力场景中，识别用户焦躁/无聊/烦躁状态，给出低打扰的共情、缓和和话题策略；
    </lark-td>
    <lark-td>
      • 路线拥堵情绪安抚 
      • 超长红灯等待安抚
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      1期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      情感 Advisor
    </lark-td>
    <lark-td>
      特殊时刻陪伴
    </lark-td>
    <lark-td>
      跨年时刻，主动和用户搭话
    </lark-td>
    <lark-td>
      • 跨年倒计时/新年时刻陪伴
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      1期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      情感 Advisor
    </lark-td>
    <lark-td>
      行程结束正向反馈与鼓励
    </lark-td>
    <lark-td>
      在行程结束时，对用户真实可量化的正向行为给予克制夸奖，增强被看见感。
    </lark-td>
    <lark-td>
      • 黄金右脚
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      1期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      内容 Advisor
    </lark-td>
    <lark-td>
      【上车】内容预编排推荐
    </lark-td>
    <lark-td>
      用户或乘员上车后，结合乘员身份与关系、当前时间、天气/节假日/热点事件、历史内容偏好、导航状态和预计车上时长，提前编排适合本次车内时光的内容清单；可覆盖歌曲、播客、新闻、儿童内容、目的地相关内容和互动内容
    </lark-td>
    <lark-td>
      • 上车内容预编排推荐-亲子出行
      • 上车内容预编排推荐-多人出游
      • 天气变化内容氛围适配
      • 节假日/节气内容编排
      • 热点事件内容编排
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      2期
      依赖内容编排tool
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      内容 Advisor
    </lark-td>
    <lark-td>
      【充电】内容推荐
    </lark-td>
    <lark-td>
      用户处于停车充电、商场/充电站等待等驻车场景时，结合剩余充电时长、车内人员、用户偏好、历史观看/收听进度和当前氛围，主动推荐适合碎片时间消费的短内容或轻陪伴内容；推荐应匹配可用时长，避免打断用户已有内容或休息状态。
    </lark-td>
    <lark-td>
      • 碎片化消磨（等待充电）
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      2期
      依赖内容编排tool
      +赛力斯视频信源的提供
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      内容 Advisor
    </lark-td>
    <lark-td>
      【行中】长途出行媒体陪伴
    </lark-td>
    <lark-td>
      用户处于长途导航、多人出游或较长时间行车场景时，用户30分钟以上未进行媒体内容消费，结合剩余行程、目的地特征、车内乘员构成、天气/节假日和当前媒体状态，推荐适合行车陪伴的音频、播客、新闻、有声内容或轻互动内容；
    </lark-td>
    <lark-td>
      • 长途出行媒体静默过久
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      2期
      依赖内容编排tool
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      内容 Advisor
    </lark-td>
    <lark-td>
      通勤场景内容预编排推荐
    </lark-td>
    <lark-td>
      用户发起回家/去公司等通勤导航，结合剩余通勤时长、上下班时间段、用户内容偏好和近期关注主题，提前编排一段适合通勤节奏的内容流；例如先用音乐提神或放松，再衔接短播客、财经/科技新闻或常听歌手内容。
    </lark-td>
    <lark-td>
      • 通勤内容预编排推荐
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      2期
      依赖内容编排tool
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      内容 Advisor
    </lark-td>
    <lark-td>
      疲劳场景内容推荐
    </lark-td>
    <lark-td>
      当系统识别到驾驶员疲劳时，判断是否需要用低负担内容帮助提神；可推荐节奏更强的音乐、轻量搞笑内容或语音互动类内容，但需要优先保障驾驶安全，避免需要观看屏幕或高认知负荷的内容。
    </lark-td>
    <lark-td>
      • 疲劳预警内容提神推荐
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      2期
      依赖内容编排tool
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      内容 Advisor
    </lark-td>
    <lark-td>
      用户兴趣内容推荐
    </lark-td>
    <lark-td>
      基于用户历史对话，识别用户当前可能想继续消费的内容方向，并做个性化延伸推荐；
    </lark-td>
    <lark-td>
      • 延伸内容推荐
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      2期
      依赖内容编排tool
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      推理触达
    </lark-td>
    <lark-td>
      策略分发
    </lark-td>
    <lark-td>
      交互策略选择与分发
    </lark-td>
    <lark-td>
      根据不同advice的交互策略（静默执行、告知执行、语音确认、界面确认、仅展示）分发后续执行逻辑
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      1期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      端侧展示
    </lark-td>
    <lark-td>
      舒适/出行/内容 AI bar
    </lark-td>
    <lark-td>
      为车机 dock 栏/AI bar以按钮或状态承接主动服务建议，支持轻量确认和状态展示提供数据。
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      1期
      2期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      目标展示
    </lark-td>
    <lark-td>
      舒适与出行子目标透出
    </lark-td>
    <lark-td>
      将进行中的舒适或出行子目标透出给用户查看，并允许用户了解或删除正在跟进的主动服务目标。
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      2期
      依赖任务中心
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      端侧执行
    </lark-td>
    <lark-td>
      执行承接
    </lark-td>
    <lark-td>
      建议到执行的承接
    </lark-td>
    <lark-td>
      当用户确认或策略允许执行时，将 advisor 的目标和建议交给后续执行链路完成车控、导航、内容播放等动作。
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      1期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      <text bgcolor="light-yellow">用户反馈</text>
    </lark-td>
    <lark-td>
      <text bgcolor="light-yellow">确认/取消/删除/点击反馈</text>
    </lark-td>
    <lark-td>
      <text bgcolor="light-yellow">获取用户对主动服务建议的直接反馈，用于当前执行闭环和后续策略优化。</text>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      <text bgcolor="light-yellow">TBD</text>
    </lark-td>
    <lark-td>
      <text bgcolor="light-yellow">/</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      <text bgcolor="light-yellow">用户反馈</text>
    </lark-td>
    <lark-td>
      <text bgcolor="light-yellow">行为反馈与偏好学习</text>
    </lark-td>
    <lark-td>
      <text bgcolor="light-yellow">通过用户后续操作、打断、忽略、手动调整等隐性行为判断建议是否有价值。</text>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      <text bgcolor="light-yellow">TBD</text>
    </lark-td>
    <lark-td>
      <text bgcolor="light-yellow">/</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      自进化
    </lark-td>
    <lark-td>
      长期学习
    </lark-td>
    <lark-td>
      个人世界模型闭环
    </lark-td>
    <lark-td>
      将显性和隐性反馈沉淀为长期偏好、习惯和打扰边界，持续校准主动服务策略。
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      TBD
    </lark-td>
    <lark-td>
      /
    </lark-td>
  </lark-tr>
</lark-table>

## 体验场景示例

舒适：

出行：

情感：

内容
