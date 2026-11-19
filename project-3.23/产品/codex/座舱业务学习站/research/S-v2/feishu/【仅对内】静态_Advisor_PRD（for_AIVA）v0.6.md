# 【仅对内】静态 Advisor PRD（for AIVA）v0.6（飞书原文转存；更新时间 2026-10-29）

来源链接：https://pq3b44yw2t9.feishu.cn/wiki/QU0PwxnaQiT9ZhkH2bwcwiuBnQg

<callout emoji="pushpin" background-color="light-blue" border-color="light-blue">

**大背景信息对齐：**

在SLS项目中完整的主动服务包含：

静态advisor（含舒适adv、出行adv、情感adv、内容adv）+系统预设的条件任务+赛力斯自闭环

本文重点阐述静态advisor的产品逻辑。

**静态advisor和系统预设条件任务的边界：**

满足以下三个条件之一则优先选择系统预设条件任务：

（1）场景非常明确；（2）对推荐窗口期要求高；（3）个性化需求低
</callout>

# 一、背景

## 版本编写记录

<lark-table rows="9" cols="4" header-row="true" column-widths="90,110,200,605">

  <lark-tr>
    <lark-td>
      版本
    </lark-td>
    <lark-td>
      日期
    </lark-td>
    <lark-td>
      编写人/来源
    </lark-td>
    <lark-td>
      编写记录
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      v0.1
    </lark-td>
    <lark-td>
      2026-06-15
    </lark-td>
    <lark-td>
      赵益红
    </lark-td>
    <lark-td>
      初版梳理
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      v0.2
    </lark-td>
    <lark-td>
      2026-06-23
    </lark-td>
    <lark-td>
      会议纪要（弋途产研）
    </lark-td>
    <lark-td>
      内部产研需求评审：对当前实现的链路达成一致
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      v0.3
    </lark-td>
    <lark-td>
      2026-06-29
    </lark-td>
    <lark-td>
      会议纪要（字节&弋途产品）
    </lark-td>
    <lark-td>
      <text underline="true">**会议结论：**</text>
      1. 当前完整的产品方案会上已达成一致。
			1. 对齐了6个P00的场景，在完整功能链路实现的基础上，先对这六个场景进行效果打磨
			1. 静态advisor的交付整体上分3期（详见roadmap部分）
      <text underline="true">**会议to do**</text>：
      1. 和触发器对齐预设事件部分，能实现哪些？何时实现？<mention-user id="ou_d35304ddd7e37a06ebac58f7f60b6522"/> <mention-user id="ou_50222d018d90a9d2451f69f7426dd0c7"/> 
			1. 和端状态对齐会有哪些端状态和节奏<mention-user id="ou_86010a55eb07891b35f657d63ab30198"/> <mention-user id="ou_50222d018d90a9d2451f69f7426dd0c7"/> 
			1. 基于SLS场景集完善产品评测集&评测指标（正在推进中）<mention-user id="ou_50222d018d90a9d2451f69f7426dd0c7"/> 
			1. 盘点advisor如何更好的进行记忆的消费<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <mention-user id="ou_f658cdb7d4a9a149c8add37a3572244e"/> <mention-user id="ou_50222d018d90a9d2451f69f7426dd0c7"/> 
			1. “personal world model”这部分由字节的“事件“模块统一开发，静态advisor可提诉求<mention-user id="ou_ebbc1adb62e07a4b75ac6a1c7818b3f0"/> <mention-user id="ou_50222d018d90a9d2451f69f7426dd0c7"/> 
			1. 情感打招呼的优化（性能&效果）<mention-user id="ou_50222d018d90a9d2451f69f7426dd0c7"/> 
			1. 这周五之前和双方产研测的同学完成完整需求范围以及1期需求详细PRD的评审<mention-user id="ou_50222d018d90a9d2451f69f7426dd0c7"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      v0.4
    </lark-td>
    <lark-td>
      2026-06-30
    </lark-td>
    <lark-td>
      赵益红
    </lark-td>
    <lark-td>
      完善1期需求的PRD
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      2026-07-01
    </lark-td>
    <lark-td>
      会议纪要：双方产研测（针对1期需要弋途+字节的部分）
    </lark-td>
    <lark-td>
      评审纪要：https://bytedance.larkoffice.com/minutes/obcnkc63aruolzsd1sn91f9x
      meego链接：https://meego.larkoffice.com/telematics/story/detail/7342958128?parentUrl=%2Fworkbench&openScene=3
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      v0.5
    </lark-td>
    <lark-td>
      2026-07-27
    </lark-td>
    <lark-td>
      赵益红
    </lark-td>
    <lark-td>
      梳理2期需求的PRD
      1. 3.5 内容adv
			1. 4.4 内容AI bar
			1. 1.1.6 补充车外语音对主动服务的影响——和车外语音一起推迟到3期实现
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      v0.6
    </lark-td>
    <lark-td>
      2026-08-04
    </lark-td>
    <lark-td>
      会议纪要：双方产研测（针对2期需要弋途+字节的部分）
    </lark-td>
    <lark-td>
      meego链接：https://meego.larkoffice.com/telematics/story/detail/7362003531
      评审纪要：https://pq3b44yw2t9.feishu.cn/minutes/obcn8hdos8xozqr42ywm467l
      1. 针对2期需求范围，评审通过，2期范围如下：
				1. 动态事件模块
				1. 舒适/出行/情感/内容adv的推理inout接入动态advisor的goal list
				1. 内容advisor
				1. 内容AI bar
			1. 静态advisor的子目标和动态advisor的goal list的冲突机制---3期需求考虑
			1. 静态advisor的子目标接入任务中心---时间待定，需要三方产品进一步对齐
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      v0.7
    </lark-td>
    <lark-td>
      2026-10-12
    </lark-td>
    <lark-td>
      赵益红
    </lark-td>
    <lark-td>
      新增：<text bgcolor="light-green" underline="true">**临时记忆-短期对话记忆**</text>
      位置：产品定义-信息层
      meego：https://meego.larkoffice.com/telematics/story/detail/7382952012?parentUrl=%2Ftelematics%2Fstory%2Fhomepage&openScene=1
    </lark-td>
  </lark-tr>
</lark-table>

## 相关文档

<mention-doc token="HaOMbEic6aboQgsReuHci5oRntb" type="bitable">静态advisor-主线（FL&专家场景集）--主线进展（50%）</mention-doc>

<mention-doc token="FsQWbFf1aa0SJus7m6gcKQhynuh" type="bitable">【AIVA】静态advisor-场景库</mention-doc>

<mention-doc token="UazZwJHqHi65sKkKOYqcmJ2znPb" type="wiki">【产品内审中】静态advisor-SLS-交互逻辑澄清</mention-doc>

# 二、产品定义与目标

## 静态advisor是什么？

**静态advisor核心是提供主动服务，这个主动服务不再是偶尔触发的、时而精准时而恼人的“小把戏”，而是演变为一种**<text color="blue">**“持续运行、懂你所想、思你未思”**</text>**的可靠基础服务，最终让用户获得前所未有的**<text color="blue">**“松弛感、信任感和陪伴感”**</text>**。**

各advisor的核心体验目标：

- 舒适advisor：保障<text underline="true">**车内每个人的舒适**</text>，包括温湿度、空气、空间...
- 出行advisor：在保障安全与效率的前提下，为乘客提供个性化、<text underline="true">**省时**</text>、<text underline="true">**省心**</text>（低负担）、<text underline="true">**省钱**</text>的出行体验。
- 情感advisor：具备对<text underline="true">**情境察言观色**</text>的能力、具备对用户的<text underline="true">**共情和移情能力**</text>、让用户感知到<text underline="true">**被关心、被理解、被陪伴**</text>
- 内容advisor：用户在行车驻车的车上时光，**不无聊、有价值，得到内容的满足**

## advisor和planner的关系是什么？

<quote-container>

planner/复杂推理承接的是用户发起的query内容——被动承接
</quote-container>

advisor通过观察人、车、环境情况，主动的发现问题并提出合适的解决方案——主动挖掘

- 这两者相辅相成，planner/复杂推理+advisor=完整车载智能

<text underline="true">**最关键的产品边界是：**</text>

- <text underline="true">**advisor 不替代 planner/复杂推理，它负责“该不该主动关心、关心什么、建议什么”；**</text>
- <text underline="true">**planner/复杂推理 负责“用户或 advisor 给出目标后，怎么把事情办成”。**</text>

<whiteboard token="DovQw7K1ph4PLeb7p9OczmJBnUb" width="588" height="217"/>

## 为什么planner不能做？

1. 被动承接，第一性原则是快速响应用户需求
1. 主动挖掘，第一性原则是推的好、推的有用，所以可以牺牲推理的时间，可以多轮react直到拿到理想的结果推荐给用户

从产品逻辑上：planner无法**同时**被动承接又主动挖掘，在时间维度上只能承接某一种角色；

## 现在的静态advisor和之前的AI场景引擎的区别

- 引入“动态事件”能力，不再只是局限于产品定义好的事件才能触发推理
- 会自己创建并持续跟踪“子目标”，具备持续思考的能力
- Personal World Model（TBD），结合用户在“车内+车外”的综合信息，同时具备自进化的“更懂你”

# 三、产品架构

## 分层架构图

<whiteboard token="SA8twi4Eth9lUjbAW7oc0YYEn6d"/>

## *工作流架构图*

<whiteboard token="SbsOwVRlrhDAvVbjAC7czAuVnIe"/>

## 产品feature-list

<callout emoji="deaf_woman" background-color="light-orange" border-color="light-orange">

<mention-doc token="HaOMbEic6aboQgsReuHci5oRntb" type="bitable">静态advisor-主线（FL&专家场景集）--主线进展（50%）</mention-doc>
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

## Roadmap

考虑到需求范围较大且各种依赖较多，需分为3期进行迭代：

<lark-table rows="12" cols="4" column-widths="60,233,521,137">

  <lark-tr>
    <lark-td>
      阶段
    </lark-td>
    <lark-td>
      阶段目标
    </lark-td>
    <lark-td>
      阶段任务目标
    </lark-td>
    <lark-td>
      外部依赖
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="4">
      1期
    </lark-td>
    <lark-td rowspan="4">
      把静态advisor端到端跑通
    </lark-td>
    <lark-td>
      <text bgcolor="light-yellow">主动服务开关配合、预设事件触发推理、子目标review触发推理、context接入、交互策略等基础链路打通</text>
    </lark-td>
    <lark-td>
      触发器
      端状态
      世界信息
      记忆（用户画像）
      视觉信息
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      推理范围实现：
      舒适adv（50%）+出行adv（40%）+情感adv（50%）
    </lark-td>
    <lark-td>
      AI navi
      行程管家
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      推理效果/满意度：
      <text bgcolor="light-yellow">5个场景效果打磨，其他场景暂不做特殊要求</text>
    </lark-td>
    <lark-td>
      /
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <text bgcolor="light-yellow">舒适AI bar、出行AI bar功能实现</text>
    </lark-td>
    <lark-td>
      Director
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="4">
      2期
    </lark-td>
    <lark-td rowspan="4">
      能力扩展、效果优化
    </lark-td>
    <lark-td>
      动态事件模块、子目标接入任务中心透出、动态adv的 goal list接入
    </lark-td>
    <lark-td>
      事件日志
      动态advisor goal list
      记忆tool
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      推理范围实现：
      舒适adv（100%）+出行adv（80%）+情感adv（100%）+内容adv（50%）
    </lark-td>
    <lark-td>
      AI导演
      AI 导游
      内容编排tool
      视频搜索tool
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      推理效果/满意度：60%
    </lark-td>
    <lark-td>
      /
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      内容AI bar功能实现
    </lark-td>
    <lark-td>
      /
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="3">
      3期
    </lark-td>
    <lark-td rowspan="3">
      能力扩展、效果优化、把主动服务做成“懂你”的长期能力（TBD）
    </lark-td>
    <lark-td>
      推理范围实现：
      舒适adv（100%）+出行adv（100%）+情感adv（100%）+内容adv（100%）
    </lark-td>
    <lark-td>
      生活服务相关tool
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      推理效果/满意度：80%
    </lark-td>
    <lark-td>
      /
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      各模块效果的持续优化
    </lark-td>
    <lark-td>
      /
    </lark-td>
  </lark-tr>
</lark-table>

# 四、产品定义

## 触发层（1期&2期）--弋途&字节

#### 预设事件触发推理（1期）

- 赛力斯：由字节侧完成定义和预设

赛力斯涉及到的预设事件，详见：<mention-doc token="HaOMbEic6aboQgsReuHci5oRntb" type="bitable">静态advisor-主线（FL&专家场景集）--主线进展（50%）</mention-doc>

#### <text bgcolor="light-red">动态事件触发推理（2期）</text>

<callout emoji="deaf_woman" border-color="light-orange">

### 产品定位

动态事件是连接<text underline="true">**Context模块**</text>（事件日志，即用户对话日志+端状态）与**静态Advisor 智能服务层**的核心枢纽，承担**筛选 + 加工 + 分发**的组合能力：

- **筛选**：从海量对话和端状态中识别出有主动服务价值的内容
- **加工**：将原始对话转化为带有语义洞察的结构化事件
- **分发**：根据事件特征路由至相应的 Advisor（舒适/出行/情感/内容）
</callout>

1. <text underline="true">**解决的核心问题**</text>
	1. **用户痛点**：车载语音交互以"被动响应"为主，系统只能回答用户明确提出的问题，无法识别用户未直接表达但可以被主动服务的机会点。
	1. **产品价值**：让系统具备"察言观色"的能力，从对话中识别**隐性需求**和**潜在需求**，变被动为主动。
1. <text underline="true">**核心场景与示例**</text>

<grid cols="2">

  <column width="50">
    Case 1：识别身体不适（隐性需求）
    **事件日志**：
    ```plaintext
    2025-12-01 10:50:31 思晴：这会怎么这么堵啊
    2025-12-01 10:50:33 益红：可不是嘛，堵的我都晕车了，已经有点恶心了
    ```

    **输出动态事件**：
    - **事件描述**：益红晕车了
		- **需关注 Advisor**：舒适
    **价值**：系统识别到乘客身体不适，舒适 Advisor 可主动介入（如调节空调、建议休息、播放舒缓音乐）。
    
  </column>
  <column width="50">
    Case 2：识别内容兴趣（潜在需求）
    **事件日志**：
    ```plaintext
    2025-12-01 10:50:31 思晴：你最近看李荣浩和单依纯那个事了吗
    2025-12-01 10:50:33 益红：你是说关于李白的版权那个？
    2025-12-01 10:50:40 思晴：对，其实我还挺喜欢单依纯版本李白的
    2025-12-01 10:50:50 益红：我其实没听过她的版本，但是李荣浩的版本我倒是一直听
    ```

    **输出动态事件**：
    - **事件描述**：车内正在热聊《李白》这首歌
		- **需关注 Advisor**：内容
    **价值**：系统识别到用户对特定内容有兴趣，内容 Advisor 可主动推荐（如播放歌曲、推荐相关话题）。
  </column>

</grid>

<text underline="true">**Input**</text>

<lark-table rows="6" cols="6" column-widths="100,81,216,206,387,100">

  <lark-tr>
    <lark-td>
      input类型
    </lark-td>
    <lark-td>
      接口来源
    </lark-td>
    <lark-td>
      备注/用处
    </lark-td>
    <lark-td>
      格式
    </lark-td>
    <lark-td>
      示例
    </lark-td>
    <lark-td>
      参考文档
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      人人对话
    </lark-td>
    <lark-td rowspan="3">
      同一个
      <text color="red">需要字节侧提供</text>
    </lark-td>
    <lark-td>
      - 发现用户表达、抱怨、计划、担忧、犹豫和交互变化
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      <text color="red">2026年X月X日X时X分X秒，主驾（face_id:XXX）:"XXX"</text>
      <text color="red">2026年X月X日X时X分X秒，副驾（face_id:XXX）:"XXX"</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      人机对话
    </lark-td>
    <lark-td>
      - 发现用户表达、抱怨、计划、担忧、犹豫和交互变化
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      2026年X月X日X时X分X秒，主驾（face_id:XXX）:"帮我打开车窗"
      2026年X月X日X时X分X秒，豆包:"好的，这就帮你打开"
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      端状态事件日志
    </lark-td>
    <lark-td>
      - 识别操作变化、连续调节、状态切换和可能的未满足迹象
    </lark-td>
    <lark-td>
      【触发时间】【档位】由【档位-触发前】设置为【档位-触发后】
    </lark-td>
    <lark-td>
      1. 2026年X月X日X时X分X秒档位由P档设置为N档
			1. 2026年X月X日X时X分X秒驾驶模式由雪地设置为运动
			1. 2026年X月X日X时X分X秒导航目的地由A设置为B
			1. 2026年X月X日X时X分X秒主驾空调由关闭设置为开启
			1. 2026年X月X日X时X分X秒媒体由播放设置为暂停
			1. 2026年X月X日X时X分X秒媒体执行下一个操作，播放节目由A切换为B
    </lark-td>
    <lark-td>
      [bytedance.larkoffice.com](https%3A%2F%2Fbytedance.larkoffice.com%2Fbase%2FJmKrbKlSNaYtyosFsnCcJcfdnDb%3Ftable%3DtblZ5ZBsIzaeuKwJ%26view%3DvewlsD1ASK)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      即时端状态
    </lark-td>
    <lark-td>
      已有
    </lark-td>
    <lark-td>
      - 一些需要review关注的端状态
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      不是所有端状态，而是需要关注的端状态，详见：<mention-doc token="HaOMbEic6aboQgsReuHci5oRntb" type="bitable">静态advisor（FL&专家场景集&input）--主线进展（50%）</mention-doc>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      舒适/出行/情感/内容的推荐history
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      - 识别语义重复并进行条件式去重，避免重复推荐
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

<mention-doc token="EYDhw8OZ2iJ5tmkKJA3cKdXOn5f" type="wiki">【仅对内】【AIVA】动态事件模块PRD v0.2</mention-doc>

<callout emoji="gift_heart" background-color="light-purple" border-color="light-purple">

<text underline="true">**需要字节侧提供事件日志（人人对话、人机对话、端状态变化）的接口**</text>
</callout>

#### 子目标定时review触发推理（1期）

- 此逻辑仅舒适adv、出行adv有需要
- **子目标的创建**：由预设事件/动态事件触发推理后生成（非必须生成）
- **子目标的交互**：用户可在任务中心查看当前跟进的子目标
- **子目标的删除**：

（1）由后续的推理来判断是否完成，若完成可判断删除对应子目标

（2）用户可直接在任务中心，删除跟进中的子目标

（3）车辆下电后，删除该车上所有跟进中的子目标

- **存在子目标的情况下，每****10分钟****触发对应advisor针对该子目标的推理，若这段时间内有新的事件触发推理，会结合该子目标进行推理，且10分钟的计时会重新开始**；

#### 主动服务开关（1期）

<callout emoji="deaf_woman" background-color="light-orange" border-color="light-orange">

<task task-id="158f5538-6ac1-4f34-b133-5a67b8724451"/>

</callout>

<mention-doc token="D0cwwp6pzicNJBkU4x3cUPTpnle" type="wiki">【E68项目】AI设置-PRD</mention-doc>

AI 设置项里会有主动服务开关，用户可{手动/语音}开启/关闭主动服务

- 状态说明：
	- 开启：静态advisor正常运行
	- 关闭：静态advisor停止运行（模型不推理、不输出advice、若有子目标则删除）
- 出厂默认为关闭状态，用户隐私授权后，默认开启。

#### 其他相关开关（1期）

- 豆包账户未登陆，主动服务的开关同步关闭
- 【AI 服务】关闭后，主动服务也同步关闭
- 【Always On】关闭后，（1）主动服务的推理上下文缺失端侧视觉信息（2）依赖视觉的事件无法产生
- 【记忆开关】关闭后，主动服务的推理上下文缺失记忆信息

#### 车外语音对静态advisor的影响（0727补充）

- <text bgcolor="light-yellow">（2026年7月27日补充）车外语音唤醒的时候，主动服务不可用。车外语音的状态（开始&结束）需要push给静态advisor</text>
- <text bgcolor="light-yellow">（2026年10月8日补充）子目标不删除，静态advisor不推理</text>

#### 1.1.7 语音禁用对静态advisor的影响（0910补充）

<text bgcolor="light-yellow">（2026年9月10日补充）需要接入语音禁用的状态，只有当语音未禁用且主动服务开关开启的情况下，静态advisor才正常工作</text>

<text bgcolor="light-yellow">（2026年10月8日补充）子目标不删除，静态advisor不推理</text>

## 信息层（1期&2期&3期）--弋途&字节

<callout emoji="💡" background-color="light-blue" border-color="light-blue">

**信息层定位**：信息层负责把上游 context、工具查询结果、记忆与 Personal World Model 整理成 Advisor 可用的结构化输入。它不直接决定是否推送建议，而是为舒适、出行、情感、内容 Advisor 提供“当前发生了什么、用户可能想要什么、系统已经做过什么、还能调用什么工具”的事实基础。
</callout>

<lark-table rows="22" cols="6" header-row="true" column-widths="103,94,300,330,220,109">

  <lark-tr>
    <lark-td>
      信息类别
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      描述
    </lark-td>
    <lark-td>
      典型字段 / 示例
    </lark-td>
    <lark-td>
      主要用途
    </lark-td>
    <lark-td>
      排期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      事件日志
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      记录用户对话、系统事件和端状态变化，是动态事件识别的原始输入之一。
    </lark-td>
    <lark-td>
      时间戳、说话人、对话内容、端侧状态变更
    </lark-td>
    <lark-td>
      动态事件；
    </lark-td>
    <lark-td>
      2期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      端状态
    </lark-td>
    <lark-td>
      车辆信息
    </lark-td>
    <lark-td>
      描述车辆当前可感知、可控制的状态，是舒适和出行判断的基础。
    </lark-td>
    <lark-td>
      车控、车速、位置、电量 / 油量、空调、座椅、车窗、灯光、音量、行驶 / 驻车状态。
    </lark-td>
    <lark-td>
      了解当前车辆状态
    </lark-td>
    <lark-td>
      1期&2期&3期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      导航信息
    </lark-td>
    <lark-td>
      描述当前行程、路线和路况，帮助系统理解用户正在去哪里、还有多久到、途中是否需要服务。
    </lark-td>
    <lark-td>
      导航状态、目的地、途经点、路线、路况、预计到达时间、剩余里程、是否偏航、是否接近目的地。
    </lark-td>
    <lark-td>
      支撑出行 Advisor；辅助内容、情感和舒适 Advisor 判断打扰时机。
    </lark-td>
    <lark-td>
      1期&2期&3期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      媒体信息
    </lark-td>
    <lark-td>
      描述当前车内内容消费状态，判断内容是否满足、是否适合介入。
    </lark-td>
    <lark-td>
      媒体状态、当前播放内容、内容类型、标题、作者 / 歌手、播放进度、切歌、静默、循环播放、音量。
    </lark-td>
    <lark-td>
      支撑内容 Advisor；避免在用户已有满意内容时重复推荐。
    </lark-td>
    <lark-td>
      1期&2期&3期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      人员信息
    </lark-td>
    <lark-td>
      描述车内人员身份、位置、状态和可见环境，用来判断服务对象和打扰边界。
    </lark-td>
    <lark-td>
      face_id、座位、性别、年龄段、衣着、表情、情绪、睡眠、打电话、疲劳、晕车、车内物品。
    </lark-td>
    <lark-td>
      支撑静态Advisor；识别服务对象、关系和当前是否适合主动介入。
    </lark-td>
    <lark-td>
      1期&2期&3期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      视觉描述
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      1期&2期&3期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **行程管家**
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      **用户主动进行的行程规划信息**
    </lark-td>
    <lark-td>
      **TBD**
    </lark-td>
    <lark-td>
      **出行目标的预测**
    </lark-td>
    <lark-td>
      1期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      世界信息
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      描述当前天气（网络天气）和时间（阴历&阳历）
    </lark-td>
    <lark-td>
      天气、日期
    </lark-td>
    <lark-td>
      辅助判断舒适、出行和内容推荐时机；提供外部约束。
    </lark-td>
    <lark-td>
      1期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      记忆信息
    </lark-td>
    <lark-td>
      用户画像
    </lark-td>
    <lark-td>
      抽象提槽后的用户信息和偏好
    </lark-td>
    <lark-td>
      基于face id的基本信息和偏好
    </lark-td>
    <lark-td>
      让建议个性化
    </lark-td>
    <lark-td>
      1期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      长期记忆
    </lark-td>
    <lark-td>
      可用标签过滤的用户长期偏好？
      通过Q&A获取更多
    </lark-td>
    <lark-td>
      基于face id的用户长期记忆
    </lark-td>
    <lark-td>
      让建议个性化
    </lark-td>
    <lark-td>
      2期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      <text bgcolor="light-green" underline="true">**临时记忆-短期对话记忆**</text>
      （26.10.12新增）
    </lark-td>
    <lark-td>
      <text bgcolor="light-green">30轮内的事件日志内容压缩</text>
    </lark-td>
    <lark-td>
      <text bgcolor="light-green">（纯自然语言，客观总结车内发生了些什么）</text>
    </lark-td>
    <lark-td>
      <text bgcolor="light-green">能结合车内刚发生了什么进行推荐</text>
    </lark-td>
    <lark-td>
      /
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <text bgcolor="gray">~~Personal World Model~~</text>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      <text bgcolor="gray">~~基于历史行为形成的个人世界模型，刻画“用户在类似场景下通常会怎么做”。~~</text>
    </lark-td>
    <lark-td>
      <text bgcolor="gray">~~历史行为、常见路线、常用停车 / 充电点、特定时间的高频目的地、Causal Scenario Memory。~~</text>
    </lark-td>
    <lark-td>
      <text bgcolor="gray">~~用于预测用户目标；校准 Advisor 是否该主动服务以及建议强度。~~</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      动态adv：goal list
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      记录当前已经被用户明确表达或由动态 Advisor 生成、仍需持续跟进的目标。
    </lark-td>
    <lark-td>
      涉及舒适 / 出行 / 情感 / 内容的 goal list；如“车内温度保持在24度以下”。
    </lark-td>
    <lark-td>
      避免静态建议和已有用户要求冲突。
    </lark-td>
    <lark-td>
      2期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      静态 Adv历史建议
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      记录本次上电周期内，静态 Advisor 已给出的建议
    </lark-td>
    <lark-td>
      建议内容、所属 Advisor、推送时间、
    </lark-td>
    <lark-td>
      避免重复打扰；
    </lark-td>
    <lark-td>
      1期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      Tool
    </lark-td>
    <lark-td>
      AI Navi
    </lark-td>
    <lark-td>
      面向出行决策的导航 / 地图工具能力，提供实时可查询信息。
    </lark-td>
    <lark-td>
      路线规划、POI、停车场、充电站、距离、耗时、拥堵、营业状态、价格、排队情况。
    </lark-td>
    <lark-td>
      支撑出行 Advisor 做实时判断，而不是只依赖静态上下文。
    </lark-td>
    <lark-td>
      1期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      天气tool
    </lark-td>
    <lark-td>
      补充 context 中没有的外部天气信息。
    </lark-td>
    <lark-td>
      天气预报、降雨、温度变化、空气质量、特殊日期、目的地周边环境。
    </lark-td>
    <lark-td>
      支撑舒适、出行和内容建议的即时性。
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      内容编排tool
    </lark-td>
    <lark-td>
      提供编排好的可直接推音频节目。
    </lark-td>
    <lark-td>
      内容源、歌单、播客、有声书、资讯、AIGC 内容、预编排内容清单、内容时长和风格标签。
    </lark-td>
    <lark-td>
      支撑内容 Advisor 输出确定、可执行的内容推荐方案。
    </lark-td>
    <lark-td>
      2期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      视频内容源
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      美团tool
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      记忆tool
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      联网查询
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

## <text bgcolor="light-red">推理层--弋途</text>

### 多事件处理

<callout emoji="deaf_woman" border-color="light-orange">

目标：解决短时间内（上一个事件触发的推理还没结束，下一个事件就来了）的情况下，能综合当前的多事件信息综合信息进行推理，避免（1）短时间内推荐内容冲突（2）推荐频繁
</callout>

<whiteboard token="POqCwh9kSh22bfbljzCcEazInhc"/>

- 最多打断几次：次数做成可配置的（初定：2次）
- 颗粒度：四个advisor只管各自的事件
- 缺点：会导致体感上给建议变慢

<text underline="true">**注：建议给出去之后的体验需要planner/Director处理**</text>

### 舒适adv

<whiteboard token="VmQCw6Q5Oh4zCTb20iecrKianle"/>

<grid cols="3">

  <column width="33">
    <callout emoji="deaf_woman" background-color="light-orange" border-color="light-orange">
    支持预设事件触发
    </callout>

  </column>
  <column width="33">
    <callout emoji="deaf_woman" background-color="light-orange" border-color="light-orange">
    支持动态事件触发
    </callout>

  </column>
  <column width="33">
    <callout emoji="deaf_woman" background-color="light-orange" border-color="light-orange">
    支持子目标review触发
    </callout>

  </column>

</grid>

#### Input

- 舒适advisor的信息层包含：端状态、记忆（用户画像）、世界信息、动态adv的goal list、舒适adv自己前5轮给出的advice——只关注和舒适强相关的部分，需要有过滤机制（降低模型注意力分散）
- 舒适adv需要关注的input：<mention-doc token="HaOMbEic6aboQgsReuHci5oRntb" type="bitable">静态advisor-主线（FL&专家场景集）--主线进展（50%）</mention-doc>

#### 提示词

<callout emoji="deaf_woman" border-color="light-orange">

EP一定是持续优化的过程，提示词不在此文档体现，详见：<mention-doc token="D7T3w3rGGiL9E0kxk4nczu8inpe" type="wiki">舒适-prompt专项</mention-doc>
</callout>

#### 车控能力边界

TBD（待补充）——字节的第一版是follow上汽的情况，后续他们更新在同步我们@韩杰

#### 舒适knowhow

<callout emoji="deaf_woman" border-color="light-orange">

持续的补充完善、修改、优化，文档见链接：

<mention-doc token="M1sydzUQJoNIqlxxPZKc6jHTnRf" type="docx">赛力斯（SLS）项目舒适相关 Knowhow</mention-doc>
</callout>

#### 策略输出

- 舒适adv的交互策略包含：语音确认、告知执行、静默执行、界面确认四种
- 交互策略由模型推理得出

<lark-table rows="5" cols="2" column-widths="76,723">

  <lark-tr>
    <lark-td>
      **推荐策略**
    </lark-td>
    <lark-td>
      **knowhow**
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      静默执行
    </lark-td>
    <lark-td>
      当动作确定性高、幅度小、可逆、低风险、不会明显打扰用户时，建议静默执行。
      适合：
      - 用户有稳定历史偏好
			- 当前场景与历史行为高度一致
			- 动作只是小幅调节
			- 不涉及多人冲突
			- 用户事后发现也会觉得自然
      示例：
      - 夏天高温上车，用户历史上总会开座椅通风 → 建议静默打开主驾座椅通风。
			- 冬天低温上车，用户常开座椅加热 → 建议静默打开座椅加热低档。
			- 后排乘客睡着，音量略高 → 建议静默小幅降低后排音量。
      不适合：
      - 大幅调节空调
			- 改变座椅姿态
			- 开关车窗
			- 切换整车模式
			- 影响多个乘员
			- 用户刚拒绝过类似建议
			- 只是猜测用户不舒服
      核心原则：用户发现后应觉得“挺自然”，而不是“车怎么自己动了”。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      告知执行
    </lark-td>
    <lark-td>
      当动作基本确定应该做、可以直接执行，但用户需要知道原因时，建议告知执行。
      适合：
      - 动作会被用户感知
			- 动作是为了照顾某位乘员
			- 动作可撤回
			- 用户不需要选择
			- 不告知会让用户疑惑车辆为什么变化
      示例：
      - 副驾打电话，媒体音量影响通话 → 建议降低媒体音量，并轻声告知。
			- 后排孩子睡着，导航播报偏吵 → 建议降低后排播报音量，并告知。
			- 夜间行驶，氛围灯影响副驾休息 → 建议调暗对应区域氛围灯，并告知。
      不适合：
      - 用户意图不明确
			- 动作风险较高
			- 动作涉及多个方案
			- 用户可能介意车辆擅自调整
			- 告知本身会打扰睡觉或通话的人
      核心原则：明显对的事可以先做，但要轻轻解释。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      语音询问
    </lark-td>
    <lark-td>
      当系统判断用户可能有舒适问题，但不能替用户决定，并且一句话能确认时，建议语音询问。
      适合：
      - 用户可能冷、热、累、被风吹、坐姿不舒服
			- 有一定证据，但不足以直接执行
			- 动作会改变用户当前体感
			- 驾驶中不方便看屏幕
			- 只需要回答“要/不要”或二选一
      示例：
      - 副驾抱臂、缩肩，车内温度低 → 询问是否调高副驾温度。
			- 主驾频繁调风量 → 询问是否切到更柔和的出风。
			- 后排频繁调整坐姿 → 询问是否调整座椅或开启按摩。
      不适合：
      - 有人睡觉或通话
			- 驾驶负荷高
			- 问题很轻，不值得打断
			- 需要展示多个方案
			- 用户刚拒绝过类似建议
      核心原则：只问简单、必要、容易回答的问题。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      界面询问
    </lark-td>
    <lark-td>
      当舒适问题涉及多个选项、组合动作、多人冲突、长期偏好设置时，建议界面询问。
      适合：
      - 有多个舒适方案
			- 涉及多个乘员
			- 涉及座椅、空调、灯光、声音等组合动作
			- 调整会持续一段时间
			- 用户需要理解后再选择
			- 当前处于驻车、低速、等待、休息等低负荷场景
      示例：
      - 用户准备午休 → 提供午休舒适方案。
			- 长途驾驶后主驾疲劳 → 提供长途舒适设置方案。
			- 前排热、后排冷 → 提供分区空调方案。
      不适合：
      - 驾驶负荷高
			- 只是一个小调节
			- 用户不方便看屏幕
			- 车内正在睡觉、通话或对话
			- 问题可以静默解决或语音一句话确认
      核心原则：只有真的需要用户选择时，才上界面。
    </lark-td>
  </lark-tr>
</lark-table>

### 出行adv

<whiteboard token="OmBIw4BYOhrh1ybJY9NcEQwQnKe"/>

<grid cols="3">

  <column width="33">
    <callout emoji="deaf_woman" background-color="light-orange" border-color="light-orange">
    支持预设事件触发
    </callout>

  </column>
  <column width="33">
    <callout emoji="deaf_woman" background-color="light-orange" border-color="light-orange">
    支持动态事件触发
    </callout>

  </column>
  <column width="33">
    <callout emoji="deaf_woman" background-color="light-orange" border-color="light-orange">
    支持子目标review触发
    </callout>

  </column>

</grid>

#### Input

- 出行advisor的信息层包含：端状态、记忆（用户画像）、世界信息、动态adv的goal list、出行adv自己前5轮给出的advice、行程管家的数据——只关注和出行强相关的部分，需要有过滤机制（降低模型注意力分散）
- 出行adv需要关注的input：

<mention-doc token="HaOMbEic6aboQgsReuHci5oRntb" type="bitable">静态advisor-主线（FL&专家场景集&input）--主线进展（50%）</mention-doc>

#### 提示词

<callout emoji="+1" background-color="light-purple" border-color="light-purple">

<mention-doc token="OccPwA7fViq7h2k1siQcvzbBn4f" type="wiki">出行-prompt专项</mention-doc>
</callout>

#### 策略输出

推荐策略：语音询问/界面询问

<lark-table rows="3" cols="2" column-widths="100,706">

  <lark-tr>
    <lark-td>
      **推荐策略**
    </lark-td>
    <lark-td>
      **knowhow**
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      语音询问
    </lark-td>
    <lark-td>
      当出行建议明确、紧急、选项少，并且需要用户马上确认时，建议语音询问。
      适合：
      - 只需要用户回答“要/不要”
			- 当前正在驾驶，不方便看屏幕
			- 建议会改变路线、目的地、途经点或停车选择
			- 不及时确认可能错过最佳时机
			- 推荐理由足够明确，不需要展示复杂对比
      示例：
      - 电量不足以安全到达目的地，前方 8 公里有合适快充站
      → 询问是否把该充电站加入途经点。
      - 距离目的地 2 公里，原目的地停车场无空位，附近有更合适停车场
      → 询问是否导航到附近停车场。
      - 连续驾驶超过 2 小时，前方服务区距离近且设施合适
      → 询问是否在前方服务区休息 15 分钟。
      - 预计到达时间跨过晚餐时段，沿途有顺路餐厅
      → 询问是否顺路停车吃饭或买咖啡。
      不适合：
      - 需要展示多个补能/停车/餐饮方案
			- 用户已经明确拒绝过类似建议
			- 当前驾驶负荷很高，除非涉及安全或强行程风险
			- 只是普通信息提醒，不需要用户立即决策
			- 出行目标或目的地判断置信度很低
      核心原则：会影响行程走向、且一句话能确认，就用语音问。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      界面询问
    </lark-td>
    <lark-td>
      只用于行前出行目标预测。
      当用户刚上车或有人上下车后，系统已经预测出唯一的出行目标、目的地或途经点，需要用户确认后再进入导航或后续出行服务时，建议界面询问。
      适合：
      - 系统已预测出唯一出行目标
			- 系统已预测出唯一目的地或途经点
			- 一次行程可以包含多个目标，但整体路线方案只有一个
			- 用户处于出发前、驻车、低速等适合看屏幕的状态
			- 需要用户确认是否开始导航或接受该行程方案
      核心原则：行前预测出唯一行程方案，需要用户确认，就用界面询问。
    </lark-td>
  </lark-tr>
</lark-table>

### 情感adv

<whiteboard token="ZKvEwTelVhw2GKbs0DIcVDRHnWh"/>

<grid cols="2">

  <column width="50">
    <callout emoji="deaf_woman" background-color="light-orange" border-color="light-orange">
    支持预设事件触发
    </callout>

  </column>
  <column width="50">
    <callout emoji="deaf_woman" background-color="light-orange" border-color="light-orange">
    支持动态事件触发
    </callout>

  </column>

</grid>

#### Input

- 情感advisor的信息层包含：端状态、记忆（用户画像）、世界信息、动态adv的goal list、情感adv自己前5轮给出的advice——只关注和情感强相关的部分，需要有过滤机制（降低模型注意力分散）
- 情感adv需要关注的input：

<mention-doc token="HaOMbEic6aboQgsReuHci5oRntb" type="bitable">静态advisor（FL&专家场景集&input）--主线进展（50%）</mention-doc>

#### 提示词

<callout emoji="+1" background-color="light-purple" border-color="light-purple">

<mention-doc token="SmwYw5dViig26akUd81cxq0knte" type="wiki">情感-prompt专项</mention-doc>
</callout>

#### 策略输出

默认策略为：告知执行

### 内容adv（2期）

<whiteboard token="XktxwvQgBhbltwbqZwccWXTMnff"/>

<grid cols="2">

  <column width="50">
    <callout emoji="deaf_woman" background-color="light-orange" border-color="light-orange">
    支持预设事件触发
    </callout>

  </column>
  <column width="50">
    <callout emoji="deaf_woman" background-color="light-orange" border-color="light-orange">
    支持动态事件触发
    </callout>

  </column>

</grid>

#### Input

- 内容advisor的信息层包含：端状态、记忆（用户画像）、世界信息、动态adv的goal list、内容adv自己前5轮给出的advice——只关注和内容强相关的部分，需要有过滤机制（降低模型注意力分散）
- 内容adv需要关注的input：

<mention-doc token="HaOMbEic6aboQgsReuHci5oRntb" type="bitable">静态advisor（FL&专家场景集&input）--主线进展（50%）</mention-doc>

#### 提示词

<callout emoji="gift_heart" background-color="light-purple" border-color="light-purple">

#### <mention-doc token="B606wA7PTidEg7kP6lscZuNnn6D" type="wiki">内容-Prompt专项</mention-doc>
</callout>

#### 策略输出

推荐策略：语音询问/界面询问

<lark-table rows="3" cols="2" column-widths="100,720">

  <lark-tr>
    <lark-td>
      **推荐策略**
    </lark-td>
    <lark-td>
      **knowhow**
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      语音询问
    </lark-td>
    <lark-td>
      优先使用语音询问的情况：
      - 当前已有内容正在播放，本次推荐会切换、中断、替换或调整当前内容。
			- 需要让用户明确决定是否改变当前播放状态。
			- 推荐与当前瞬间高度相关，等待用户主动点击可能错过服务时机。
			- 场景具有较强的即时服务价值，需要主动把用户注意力拉到本次建议上。
			- 存在特殊强要求事件，例如驾驶员疲劳，需要通过语音及时询问。
			- 推荐方案唯一，可通过一句“要 / 不要”完成确认。
      示例：
      - 用户正在频繁切换当前内容，询问是否更换一套节目单，并通过豆包即时交互卡承接。
			- 当前内容正在播放，但车内讨论形成了明确的新内容兴趣，询问是否切换播放相关内容。
			- 驾驶员疲劳，询问是否播放一组提神内容；即使当前没有内容播放，也可以因特殊事件选择语音询问。
      核心原则：已有内容正在播放，或当前场景值得立即主动介入时，优先语音询问，并由豆包即时交互卡承接。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      界面询问
    </lark-td>
    <lark-td>
      优先使用界面确认的情况：
      - 当前没有内容正在播放，新的内容推荐不会改变用户已有的播放状态。
			- 推荐不要求用户立即回应，可以在 AI bar 中等待用户点击。
			- 希望以更低打扰的方式提供内容入口。
			- 用户刚上车，内容 Advisor 主动推荐本次行程内容。
			- 属于普通内容陪伴或内容预编排推荐，没有必须立即通过语音介入的特殊原因。
      示例：
      - 用户上车后，AI bar 展示“来点歌听听”。
			- 车辆开始充电且当前无内容播放，AI bar 展示“充电时听点什么”。
			- 长途行驶中媒体静默过久，若没有强时效或特殊介入要求，可通过 AI bar 提供内容入口。
      核心原则：没有正在播放的内容、无需立即打断用户时，优先通过 AI bar 进行界面确认。
    </lark-td>
  </lark-tr>
</lark-table>

## 策略与输出层（1期&2期）--弋途&字节

<mention-doc token="UazZwJHqHi65sKkKOYqcmJ2znPb" type="wiki">【产品内审fix】内部-静态advisor-SLS-交互逻辑澄清</mention-doc>

<whiteboard token="GvEcwqt9yhYqnqbybtFcfJ6Snjb"/>

### 策略分发（1期2期）——弋途

<callout emoji="deaf_woman" background-color="light-orange" border-color="light-orange">

任务：

- 按照不同的交互策略，分发后续的链路：Director/AI bar
- 调整输出的内容、格式
</callout>

- 各个静态advisor的目标如下：
	- 舒适adv：保持全车人的舒适
	- 出行adv：提供省时、省力、省钱的出行体验
	- 情感adv：关心、理解、陪伴
	- 内容adv：提供不无聊、有价值的内容

<lark-table rows="6" cols="3" column-widths="100,332,332">

  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      给到Director的格式（示例）
    </lark-td>
    <lark-td>
      给到舒适/出行/内容AI bar的格式（示例）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      [舒适/出行/情感/内容]advisor：你的目标之一是[各个advisor对应的目标],[think+advice]。**策略：[交互策略]**
    </lark-td>
    <lark-td>
      [舒适/出行/内容]advisor：你的目标之一是[各个advisor对应的目标],[think+advice]。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      舒适
      ——1期
    </lark-td>
    <lark-td>
      ```python {wrap}
      舒适advisor：你的目标之一是保持全车人的舒适。当前车内温度38.2°C，远高于成年女性舒适温度区间24°C-27°C，存在明显温度舒适偏差；车外温度36.5°C，车内温度超过32°C，存在健康风险；其余维度信息不足无法评估。需要你帮用户开启全车极速制冷模式。策略：静默执行
      ```
    </lark-td>
    <lark-td>
      ```python {wrap}
      舒适advisor：你的目标之一是保持全车人的舒适。目标降温中，当前28度已接近目标温度，但仍处于极速制冷状态（风量很大，噪音明显），建议空调切换为auto模式
      ```
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      出行
      ——1期
    </lark-td>
    <lark-td>
      ```python {wrap}
      出行advisor：你的目标之一是提供省时、省力、省钱的出行体验,用户发起了导航，目的地为莫干山风景区，当前电量不足以到达目的地，可询问用户是否要在沿途的XXX充电站充30分钟电，当前该充电桩空桩充足。策略：语音确认
      ```
    </lark-td>
    <lark-td>
      ```python {wrap}
      出行advisor：你的目标之一是提供省时、省力、省钱的出行体验,今天是2026年7月26日，工作日的早上，此时主驾坐着依依，猜测依依是要去上班，预测她的目的地为上海市漕溪北路400号。
      ```
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      情感
      ——1期
    </lark-td>
    <lark-td>
      ```python {wrap}
      情感advisor：你的目标之一是关心、理解、陪伴,主驾阿杰上车，今日是阿杰的生日，结合长时记忆和即时记忆，可围绕生日场景输出情感建议",先用俏皮的语气对主驾阿杰打招呼，然后围绕生日表达惊喜祝福，不要生硬播报生日信息"。策略：语音确认
      ```
    </lark-td>
    <lark-td>
      /
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <text bgcolor="light-red">内容</text>
      <text bgcolor="light-red">——2期</text>
    </lark-td>
    <lark-td>
      ```python {wrap}
      内容advisor：
      ```
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

##### 0910补充更新

<callout emoji="gift_heart" background-color="light-purple" border-color="light-purple">

<text color="red">Q：弋途侧给的是是否出交互卡的判断？直接是true /false，还是只给模型推理出的交互策略？</text>

（0911）产品侧结论：弋途侧都给，下游怎么消费，需要<mention-user id="ou_5db39c36f6959ac9bb6e0128d774e9a9"/>进一步梳理
</callout>

<callout emoji="gift_heart" background-color="light-purple" border-color="light-purple">

背景：为主动服务-豆包即时交互卡的展示，需要静态advisor输出给DT的部分新增三个字段：（1）交互策略 （2）按钮展示文案（确认/取消）（3）是否出交互卡的判断——true /false

——不影响原定给DT的内容

注意：

1. 只有需要直接给DT的才需要加上这三个字段——弋途研发实现
1. 这两个字段不作为DT的输入，仅for工程链路使用——字节研发实现
</callout>

语音确认-即时交互卡=true  ；按钮文案=确认/取消

告知执行-即时交互卡=true  ；无需给按钮文案

静默执行-即时交互卡=flase；无需给按钮文案

界面确认-走AI bar，不涉及即时交互卡

<text color="red">考虑到DT可能会同时处理多个advice，那么对于DT同时处理多个advice时的即时交互卡的逻辑需要字节侧实现，建议方案：只要有一个true，那么整体就是true ，最终策略以</text><text color="red"><mention-user id="ou_5db39c36f6959ac9bb6e0128d774e9a9"/></text><text color="red">梳理为主</text>

### 舒适AI bar （1期）——弋途&字节

<callout emoji="deaf_woman" background-color="light-orange" border-color="light-orange">

产品目标：

根据舒适adv/Director的输入总结需要在端侧舒适AI bar展示的文字、形式（按钮/状态）、icon以及需要在舒适空间展示的CoT内容
</callout>

#### 舒适advisor 输入-界面确认
```python {wrap}
舒适advisor：你的目标之一是保持全车人的舒适。目标降温中，当前28度已接近目标温度，但仍处于极速制冷状态（风量很大，噪音明显），建议空调切换为auto模式
```

```python {wrap}
文字：空调auto
形态：按钮
coT：XXXX
icon：XXX
```

<callout emoji="deaf_woman" border-color="light-orange">

需要给到火山（云）的是input+output（一起给）

- output的内容需要传给赛力斯，由赛力斯作为端侧展示
- 若用户点击确认（赛力斯告诉火山），火山需要将【input内容】+【用户已确认，可直接执行】给到Director
</callout>

#### Director输入
```json {wrap}
{
"talk_or_not": "no",
"talk_content": "",
"emoji_id": "speaking",
"action_list": [
{"action_id":"1","params":{"query":"打开全车极速制冷模式，设置温度为 25℃，风量调至 11 档"},
"tool_name":"vehicle_basic_control"}
]
}
+导致planner输出的舒适adv的目标+建议
+planner的执行结果（只保留车控相关的）
```

```python {wrap}
文字：极速制冷中
形态：状态
coT：XXXX
icon：XXX
action_list：极速制冷、温度 25℃、风量 11 档
```

<callout emoji="deaf_woman" border-color="light-orange">

需要给到火山的是output

- output的内容需要传给赛力斯，由赛力斯作为端侧展示
</callout>

#### 舒适AI bar 任务
```javascript {wrap}
你是新能源汽车智能座舱的舒适 AI bar 输出生成器，负责把舒适 Advisor 或 Director 的输入转成端侧可展示的 AI bar 内容。你的输出对象是端侧展示系统和策略链路，不是最终用户闲聊回复。

你的输入可能来自两类来源：

第一类是舒适 Advisor。它通常以“舒适advisor：你的目标之一是保持全车人的舒适”开头，内容会包含当前舒适问题、目标或建议。此类输入通常代表“系统发现一个舒适建议，需要在 AI bar 上给用户确认”。你需要生成按钮形态，并准备用户点击后的 Director 承接内容。

第二类是 Director。它通常包含 JSON，例如 talk_or_not、talk_content、emoji_id、action_list，并可能附带导致 planner 输出的舒适目标、建议和车控执行结果。此类输入通常代表“动作已经执行或正在执行”，你需要生成状态形态，并保留车控相关 action_list 供下游展示或追踪。

你的任务：

1. 判断输入来源是 advisor还是director 
2. 判断是否属于舒适域。舒适域只包括温度、湿度、空气、光线、声音、空间感、座椅舒适、车窗通风、除雾、氛围等车内物理舒适体验。
3. 提取输入中的舒适目标、建议动作、执行状态、服务对象和可展示依据。
4. 决定 AI bar 形态：
   - 如果是待用户确认的建议，输出 button。
   - 如果是已执行、执行中或保持中的状态，输出 status。
6. 生成 AI bar 短文案：
   - button 文案使用动作短语，例如“空调auto”“开启通风”“打开座椅通风”“来个安静氛围”。
   - status 文案使用状态短语，例如“极速制冷中”“安静氛围保持”“睡眠舒适”“阅读舒适”。
   - 文案必须短、清楚、适合 dock 栏展示，优先控制在 4 到 6 个中文字符。
7. 选择 icon。
ic_maininteraction_fan：舒适主动服务的通用图标，当没有其他图标匹配的合适的时候，就用当前这个通用的，作为AI功能场景的示意
ic_maininteraction_rest：代表车内有人休息的时候，进行对应的休息场景关怀时显示，常和睡觉/小憩模式等关键词匹配；
ic_maininteraction_pet：代表车内有宠物识别到进行对应的主动服务时显示对应场景图标，常和宠物标签进行匹配；
ic_maininteraction_elder：代表舱内有老年人或者长辈，进行对应的主动关怀；
ic_maininteraction_body_cooling：代表识别到乘员的一些运动后代谢提高的场景，进行短时的快速降温操作；
ic_maininteraction_fast_cooling：代表舱内温度进行快速降温的操作场景，常跟车内温度过高、座椅通风和最大制冷等操作关联
ic_maininteraction_high_power_defog：代表对舱内的湿度进行关注和起雾等风险识别的场景，常跟吹窗模式、前除霜等关联
ic_maininteraction_air_purification：识别到舱内空气质量变差的场景,做主动净化,常跟 PM2.5/CO₂ 超标、进地库隧道、内外循环切换关联
8. 生成舒适空间展示摘要（CoT）。摘要必须是用户可见的简短依据，不输出完整内部推理链。COT的宗旨是表达清楚为什么干以及干了什么
11. 不要编造输入中没有的事实、设备能力、参数、乘员位置或用户偏好。
12. 不要输出健康建议、驾驶行为指导、情绪陪伴、内容推荐、路线建议。
13. 不要把完整内部推理链展示给用户；只能输出简短依据摘要。
14. 不要输出任何解释文字，只输出一个 JSON 对象。

输出格式如下：

"form": "button 或 status",
"text": "端侧 AI bar 展示短文案",
"icon": "从枚举中选择的 icon",
"CoT": "用户可见的推荐依据”,
"action_list": "若输入来自 Director 且包含车控相关 action_list，则保留；否则为 null"

收到我的下一条输入后，直接按以上规则输出。

Think before answering (take time to reason through this carefully).
```

#### Icon knowhow

<mention-doc token="ScoNwo9LjiMbRFkdPxic0xNenAd" type="wiki">icon knowhow</mention-doc>

<task task-id="7b2ea22e-324a-4f05-a1d0-bab2f75dc7b4"/>

### 出行AI bar（1期）——弋途&字节

<callout emoji="deaf_woman" background-color="light-orange" border-color="light-orange">

产品目标：

根据出行adv/Director的输入总结需要在端侧出行AI bar展示的文字、形式（按钮/状态）
</callout>

#### 出行advisor输入
```python {wrap}
出行advisor：你的目标之一是提供省时、省力、省钱的出行体验,今天是2026年7月26日，工作日的早上，此时主驾坐着依依，猜测依依是要去上班，预测她的目的地为上海市漕溪北路400号。
```

```python {wrap}
文字：去上班
形态：按钮
```

<callout emoji="deaf_woman" border-color="light-orange">

需要给到火山的是input+output

- output的内容需要传给赛力斯，由赛力斯作为端侧展示
- 若用户点击确认（赛力斯告诉火山），火山需要将【input内容】+【用户已确认，可直接执行】给到Director
</callout>

#### Director输入
```json {wrap}
{
  "talk_or_not": "no",
  "talk_content": "",
  "emoji_id": "speaking",
  "action_list": [
    {"action_id":"1","params":{"query":"导航到上海市漕溪北路400号"},
"tool_name":"route_planning_qa"}
  ]
}
+导致planner输出的出行adv的目标+建议
```

```python {wrap}
文字：上班中
形态：状态
```

<callout emoji="deaf_woman" border-color="light-orange">

需要给到火山的output

- output的内容需要传给赛力斯，由赛力斯作为端侧展示
</callout>

#### 出行AI bar 任务
```typescript {wrap}
你是新能源汽车智能座舱的出行 AI bar 输出生成器，负责把出行 Advisor 或 Director 的输入转成端侧可展示的出行 AI bar 内容。你的输出对象是端侧展示系统和策略链路，不是最终用户闲聊回复。

你的输入可能来自两类来源：

第一类是出行 Advisor。它通常以“出行advisor：你的目标之一是提供省时、省力、省钱的出行体验”开头，内容会包含行前目标预测、目的地预测、补能建议、停车建议、休息建议、沿途服务建议或导游功能建议。此类输入通常代表“系统发现一个出行建议，需要在 AI bar 上给用户确认”。你需要生成按钮形态，并准备用户点击后的 Director 承接内容。

第二类是 Director。它通常包含 JSON，例如 talk_or_not、talk_content、emoji_id、action_list，并可能附带导致 planner 输出的出行目标、建议或执行结果。此类输入通常代表“导航、途经点、充电站、停车场、服务区或出行服务已经执行或正在执行”。你需要生成状态形态，并保留出行相关 action_list 供下游展示或追踪。

你的任务：

1. 判断输入来源是 advisor 还是 director。
2. 判断是否属于出行域。出行域只包括行前目标预测、目的地预测、导航、路线、途经点、补能、停车、休息规划、沿途生活服务、导游/导演类出行功能推荐。
3. 提取输入中的出行目标、目的地、推荐动作、执行状态、服务对象和可展示依据。
4. 决定 AI bar 形态：
   - 如果是待用户确认的出行建议，输出 button。
   - 如果是已执行、执行中或保持中的出行状态，输出 status。
5. 生成 AI bar 短文案：
   - button 文案使用用户可理解的出行动作短语，例如“去上班”“回家”“去充电”“找停车”“去服务区”“开启导游”。
   - status 文案使用进行中状态短语，例如“上班中”“回家中”“导航中”“前往充电”“找车位中”“休息规划中”。
   - 文案必须短、清楚、适合 dock 栏展示，优先控制在 3 到 6 个中文字符。
6. 行前出行目标预测场景：如果预测出唯一目标或唯一目的地，优先生成 button，例如“去上班”“回家”“去学校”。不要在 AI bar 文案里塞完整地址。
8. 不要编造输入中没有的目的地、距离、时间、电量、停车场、充电站、服务区、路线或用户偏好。
9. 不要输出舒适控制、情绪陪伴、内容推荐、健康建议或驾驶行为指导。
12. 不要输出任何解释文字，只输出一个 JSON 对象。

输出格式如下：

"form": "button 或 status",
"text": "端侧出行 AI bar 展示短文案"

收到我的下一条输入后，直接按以上规则输出。

Think before answering (take time to reason through this carefully).
```

### <text bgcolor="light-red">内容AI bar（2期）——弋途&字节</text>

<callout emoji="deaf_woman" background-color="light-orange" border-color="light-orange">

产品目标：

根据内容adv的输入总结需要在端侧内容AI bar展示的文字、形式（按钮/状态）以及需要在AI电台展示的CoT内容以及编排好的playlist

<text underline="true">**内容AI bar的输入只有内容advisor，不存在DT输入**</text>
</callout>

#### 内容AI bar 任务
```markdown {wrap}
你是新能源汽车智能座舱的内容 AI Bar 输出生成器。请根据内容 Advisor 提供的 {{playlist}}，生成一条端侧展示文案。

生成优先级：

1. 优先使用具体、自然且能代表整份节目单的 `playlist.title`。
   - 标题不超过 6 个字时，直接使用。
   - 标题超过 6 个字时，可在不改变原意的前提下压缩至 6 个字以内。
   - 例如：标题为“通勤听世界”，输出 `{"text":"通勤听世界"}`。

2. 如果标题缺失、过于宽泛或无法自然压缩，则按 playlist 的排列顺序找到第一个有效节目，只根据该节目的内容类别生成文案。
   - 歌曲、专辑或歌单：`{"text":"来点歌听听"}`
   - 播客：`{"text":"听会儿播客"}`
   - 语音游戏：`{"text":"玩个语音游戏"}`

3. 如果仍无法生成文案，使用兜底输出：`{"text":"来点内容吧"}`。

文案最多 6 个字，不使用标点。只输出一个合法 JSON 对象，且只能包含 `text` 字段。不要输出 Markdown、解释或其他内容。
```

#### 内容AI bar output
```python {wrap}
文字：来点歌听听
形态：按钮
coT：XXXX
playlist：XXX
```

<callout emoji="deaf_woman" border-color="light-orange">

需要给到火山的是output

- output的内容需要传给赛力斯，由赛力斯作为端侧展示
- 若用户点击确认，由赛力斯直接播放第一个节目单的内容
</callout>

## 端侧执行与反馈层--字节

### 界面交互形态

<callout emoji="deaf_woman" border-color="light-orange">

赛力斯交互UX：[www.figma.com](https%3A%2F%2Fwww.figma.com%2Fdesign%2F5pnxkCYAYGXOorIgdrJ93J%2FE68-HMI%25E7%25B3%25BB%25E7%25BB%259F%25E4%25B8%25BB%25E4%25BA%25A4%25E4%25BA%2592%3Fnode-id%3D2-285%26t%3D3Izu6M1rEQuqDYaf-0)
</callout>

- **AI bar：**dock 栏展示，涉及舒适、出行、内容；可呈现按钮或状态。
	- 舒适目标示例：极速降温、来个安静氛围————按钮
                                        极速降温中、安静氛围保持、睡眠舒适、阅读舒适————仅展示
  - 出行目标示例：去上班————按钮
                                        上班中、回家中————仅展示
  - 内容目标示例：来点歌听听、播客上新、新节目上线——按钮
                                     节目内容播放过程中，每次切换内容的时候，要有5s展示当前的节目名称——仅展示
- **沉浸空间：**舒适空间、AI 电台内 CoT 展示，涉及舒适、内容。
- **豆包交互区域：**VUI 即时交互卡，涉及舒适、出行、内容；<text underline="true">**主动推荐需有专属标识。**</text>
- **TTS：**情感类以 TTS 为主；出行、内容、舒适在需要语音确认时使用。

<lark-table rows="6" cols="5" column-widths="114,100,100,100,100">

  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      舒适
    </lark-td>
    <lark-td>
      出行
    </lark-td>
    <lark-td>
      情感
    </lark-td>
    <lark-td>
      内容
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      AI bar
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      舒适空间
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      AI 电台
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      豆包即时交互
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      TTS
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
  </lark-tr>
</lark-table>

### ~~**Personal  World Model**~~

<callout emoji="deaf_woman" border-color="light-orange">

产品目标：

1. 观察、记录不同的人在不同环境下的用户行为——主动推荐的时候能更“懂你”
1. 记录主动服务推送后用户的反馈——根据用户反馈调整后续类似场景下的推荐策略

**——0629会议记录：这部分由字节的“事件“模块统一开发，弋途不做重复开发**
</callout>

# 五、产品准出指标

<lark-table rows="6" cols="2" header-row="true" column-widths="179,531">

  <lark-tr>
    <lark-td>
      指标
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      推荐的采纳率
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

# 六、后续的节奏

<callout emoji="deaf_woman" border-color="light-orange">

P00场景——1期重点打磨的场景

1. 【舒适】上车温感调节——804
1. 【出行】行前预测（上班/回家）/补能（不足以到目的地/能耗低于X%）/停车——804
1. 【情感】上车打招呼——804

2期

1. 【内容】上车预编排——818
</callout>
