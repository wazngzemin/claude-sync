# 【DNA-616】动态advisor 二期 需求文档 OnePage（飞书原文转存；更新时间 2026-08-05）

来源链接：https://pq3b44yw2t9.feishu.cn/wiki/X6PdwAR4ziIklekuJKLclwcjnqf

一期文档：<mention-doc token="Ud8XwmI0IiQQfkkYpeZcYkTanwd" type="wiki">动态advisor-感知订阅 OnePage</mention-doc>

## 一、背景说明

### 530节点已完成内容

#### 动态advisor能力：

<lark-table rows="5" cols="3" column-widths="227,66,527">

  <lark-tr>
    <lark-td>
      能力类型
    </lark-td>
    <lark-td>
      状态
    </lark-td>
    <lark-td>
      示例场景
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      条件任务
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      副驾上车时，给他来一顿猛猛的彩虹屁，再帮他把座椅搞舒服点，给足情绪价值
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      定时任务（云）
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      每 5 分钟给我播报一次勇士队比赛的得分
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      长时任务（若干 query 特调）
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      一直讲笑话讲到我说停为止
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      VLM 视觉识别（云）
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
    <lark-td>
      等下我睡着了，帮我把音量调小点，车窗也关上
    </lark-td>
  </lark-tr>
</lark-table>

#### 任务中心

- widget卡片内容生成
- 动态advisor的接入
- 任务卡片内容动态更新
- 卡片内容状态管理

616节点的目标是在当前已经完成的内容上，进一步拓展动态advisor的体验，期望在DNA项目打造更加成熟、产品化程度更高的长时主动任务的体验，目前**尚无法实现的体验**包括：

- 更加泛化的、可热更新、插拔式的长时任务体验
	- 给我介绍一路上的风景
	- 给我介绍秦国的所有国君，一个一个来
	- 换着法子持续夸副驾
- 新增 导航相关的场景感知
	- 快到我外婆家时，记得提前给她打个电话
- 新增 端侧的定时器
	- 30分钟后叫醒我——第29分钟的时候显示的还是"30分钟后叫醒我"
	- 弱网/断网时无法做到触达
	- 定时不够精准，云端存在延迟
- 迭代 更高效的任务策略执行
	- 目前任务管理的逻辑是触发时决定策略
	- 下一步要改成提前决定策略（先放在云，之后考虑放在端）
- 新增 条件任务创建 交互优化
	- 对于创建成功和失败的体验都不达到预期
	- 显示出条件、执行内容是什么
	- 目前出的卡片内容太过简略
- 新增 生态闭环类Advisor（原长程任务）
	- 如何做出领先同行的美团生态接入体验？
	- 能够实时显示小卡状态、能够随时复原
	- 长时间没有推进，能够提醒用户，不会丢失
	- 完成后能够继续生态服务，例如到店服务持续引导用户完成取餐

## 二、架构更新总览

<whiteboard token="QQbPw00K0hADAMbF6QPcdENjnYf"/>

## 三、长时任务 迭代需求说明

当前的长时任务能够支持的范围是几个针对性经过优化的Query，例如

- 一直讲笑话讲到副驾笑为止
- 给我介绍车上所有的按摩模式

针对这些Query的深度优化仅能带来有限的长时任务体验，目前已经深入到工程链路的逻辑中，塌缩为具体的功能实现，通用性和泛化性比较差。现需要对云端架构进行重构，构建一种通用性更好、泛化性更强的长时任务架构。

迭代点概述：

<text bgcolor="light-gray">**从 {目标} + {基础提示词} 拼贴 +模型参与节点决策**</text> {align="center"}

⬇️ {align="center"}

<text color="green">**模型生成可执行的任务编排脚本，程序按脚本执行长时任务**</text> {align="center"}

<text color="green">**模型参与脚本编排、重编排、关键节点决策等环节**</text> {align="center"}

<whiteboard token="VsSawNovfhl7hTbG9axcsSKvnjb"/>

先后架构主要差异

<lark-table rows="4" cols="2" column-widths="246,384">

  <lark-tr>
    <lark-td>
      前
    </lark-td>
    <lark-td>
      后
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      AI根据状态和历史QA推进任务
    </lark-td>
    <lark-td>
      AI编排并执行任务
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      事件类型相对单一
    </lark-td>
    <lark-td>
      事件类型拓展：视觉、端信号、GUI 点击
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      无相对明确的业务流程
    </lark-td>
    <lark-td>
      有相对明确的业务流程
    </lark-td>
  </lark-tr>
</lark-table>

```json {wrap}
任务：挨个介绍这辆车全部的按摩模式，一边介绍一边给副驾体验

Start Event：接收到动态 advisor 任务创建请求
  ↓
Service Task：解析用户任务「挨个介绍这辆车全部的按摩模式，一边介绍一边给副驾体验」
  ↓
Service Task：初始化任务上下文，设置当前按摩模式索引=0，设置体验间隔=15秒
  ↓
Service Task：查询车辆全部支持的按摩模式列表，按预设顺序存入任务上下文
  ↓
Service Task：查询副驾座椅占用状态与按摩功能整体可用性
  ↓
Exclusive Gateway：是否满足执行条件
      ├── 不满足：
      │       Advisor Task：生成无法执行任务的说明建议
      │       ↓
      │       Service Task：提交建议给主交互助手
      │       ↓
      │       End Event：任务结束
      └── 满足：
              Service Task：注册 vehicle.power_off、trip.ended、task.cancelled 退出事件
              ↓
              Timer Event：延迟3秒启动第一个按摩模式介绍
              ↓
Event-Based Gateway：等待可触发事件
      ├── Intermediate Catch Event：timer.relative(delay={体验间隔})
      │       ↓
      │   Service Task：取出当前索引对应的按摩模式基础信息
      │       ↓
      │   Service Task：控制副驾座椅开启当前索引对应的按摩模式
      │       ↓
      │   Advisor Task：结合车辆参数生成该按摩模式的介绍内容
      │       ↓
      │   Service Task：提交介绍建议给主交互助手播报
      │       ↓
      │   Service Task：当前按摩模式索引自增1
      │       ↓
      │   Business Rule Task：判断当前索引是否超过按摩模式总数量
      │       ↓
      │   Exclusive Gateway：是否还有未介绍的按摩模式
      │       ├── 还有：Timer Event：等待{体验间隔}给用户体验
      │       │       ↓
      │       │   回到等待可触发事件
      │       └── 没有：Advisor Task：生成全部按摩模式介绍完成结束语
      │               ↓
      │               Service Task：提交结束语给主交互助手
      │               ↓
      │               Service Task：关闭副驾按摩
      │               ↓
      │               End Event：全部按摩模式介绍体验完成，任务结束
      │
      ├── Intermediate Catch Event：task.cancelled
      │       ↓
      │   Service Task：关闭副驾按摩
      │       ↓
      │   End Event：任务被取消
      │
      ├── Intermediate Catch Event：trip.ended
      │       ↓
      │   Service Task：关闭副驾按摩
      │       ↓
      │   End Event：行程结束，任务结束
      │
      └── Intermediate Catch Event：vehicle.power_off
              ↓
          Service Task：关闭副驾按摩
              ↓
          End Event：车辆下电，任务结束
```

## 四、导航场景 迭代需求说明（616 off）

当前导航类事件暂不支持被感知，限制了动态advisor可支持的场景范围，如：

- 快到公司时提醒我拿咖啡
- 到外婆家时帮我找找附近的充电桩
- Q1:我们路上经过什么有趣的地方吗？Q2:快到这些地方的时候，你给我介绍介绍

具体需求：触发器需要支持对某个具体的地点的距离感知与判断能力

<lark-table rows="3" cols="4" column-widths="236,230,129,100">

  <lark-tr>
    <lark-td>
      需求点
    </lark-td>
    <lark-td>
      参数需求
    </lark-td>
    <lark-td>
      触发次数
    </lark-td>
    <lark-td>
      承接方
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      接近某精确地点时抛出事件
    </lark-td>
    <lark-td>
      距离 {某POI} 距离 < {指定距离}
    </lark-td>
    <lark-td>
      1
    </lark-td>
    <lark-td>
      触发器
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      离开某精确地点时抛出事件
    </lark-td>
    <lark-td>
      距离 {某POI} 距离 > {指定距离}
    </lark-td>
    <lark-td>
      1
    </lark-td>
    <lark-td>
      触发器
    </lark-td>
  </lark-tr>
</lark-table>

Updated at 0805 (方案澄清)

背景：

- 上汽车机系统层不支持地理围栏，所以“到外婆家时提醒我拿咖啡”等具体的、精确的地理识别无法支持
- 用户很少表达目的地、途经点这样的说法，更习惯说具体地点
- 目前能够获取的只有导航的信号（途经点、终点）

需求详述

- 豆包给出以下任务：具体途经点只有300m时，到目的地只有500m时等......动态advisor判断当前是否在导航状态中，如果当前没有途经点、或终点，则返回任务无法执行；如果当前有途经点、或终点，则任务正常执行。
- 豆包给出以下任务：具体徐家汇书院只有300m时.....动态advisor判断当前徐家汇书院是否为途经点或者终点，并且根据POI属性，注册触发器场景；如果不是途经点或者终点，则返回“请先把该地点添加到途经点或者终点吧”

方案

- 每次分类为条件任务时，获取最新的端状态（导航目的地、途经点、导航状态）注入到条件解析器的提示词当中，由条件解析器判断该条件是否能够注册成功
	- 如果任务本身就是"到途经点时提醒我..."，则按照途经点的语义进行注册
		- 如果途经点不只一个，则根据用户语义，判断是第一个还是第二个或是全部
			- 路过途经点 ——> 默认第一个
			- 路过每个途经点 ——> 全部
			- 路过第二个途经点 ——> 第二个
	- 如果条件解析器判断该地点属于途经点或者终点，则注册为"距离 终点 < 500m"这样的条件
		- 根据具体地点属于第几个途经点或者终点，进行注册条件
	- 如果条件解析器判断该地点不属于途经点或者终点，则返回“请先把该地点添加到途经点或者终点吧”

## 五、定时任务 迭代需求说明

<lark-table rows="8" cols="3" column-widths="236,434,230">

  <lark-tr>
    <lark-td>
      需求点
    </lark-td>
    <lark-td>
      需求说明
    </lark-td>
    <lark-td>
      承接方
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      端侧定时器
    </lark-td>
    <lark-td>
      定时的业务逻辑在端侧闭环
    </lark-td>
    <lark-td>
      端侧定时器/任务中心
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      相对时间任务的倒计时显示
    </lark-td>
    <lark-td>
      任务小卡支持显示相对时间任务的具体的倒计时：
      - 5分钟后提醒你xxx
    </lark-td>
    <lark-td>
      端侧定时器/任务中心
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      超高频循环定时任务拒绝创建
    </lark-td>
    <lark-td>
      Q：每隔5s提醒我xxx
      A：你想要累死我嘛？我只能按分钟给你服务哦
      最小循环间隔1分钟
    </lark-td>
    <lark-td>
      Director
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      按分钟级合并播报
    </lark-td>
    <lark-td>
      支持：9:01分继续播报
      不支持：9:01:05进行播报
      多个提醒任务自动合并到分钟级
    </lark-td>
    <lark-td>
      Director：明确预期，不支持秒级播报
      时间任务解释器：自动合并
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      模糊时间澄清策略
    </lark-td>
    <lark-td>
      - 超过365天的时间任务无法创建 
			- 指定下周/下个月/某月的任务，需要澄清具体是哪一天 
			- 指定某一天，但没有提供具体时段或时间的，默认当天首次上车。转化为条件任务。 
			- 指定某一天某个时段的，例如明天上午、明天下午，默认当天对应时段首次上车或在车上。转化为条件任务。
			- 用户只说“8点/6点”这类未带上下午的钟点时，按“距离用户当前时间最近的未来时间”映射。
				- 例如当前时间是19:00，用户说“8点提醒我喝水”，应映射为今天20:00。
				- 例如当前时间是19:00，用户说“6点提醒我喝水”，应映射为明天06:00。
    </lark-td>
    <lark-td>
      Director
      动态advisor
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <text color="green">~~最大执行次数限制~~</text>
    </lark-td>
    <lark-td>
      <text color="green">~~循环任务最大执行次数30次，超过30次时，主动提醒：~~</text>
      <text color="green">~~“该任务已经执行30次了噢，继续执行的话需要重新创建”~~</text>
    </lark-td>
    <lark-td>
      <text color="green">~~端侧定时器~~</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      端侧任务提醒
    </lark-td>
    <lark-td>
      支持任务发生时在端侧推出AI PUSH，不依赖网络环境，保证触达
    </lark-td>
    <lark-td>
      豆包客户端
    </lark-td>
  </lark-tr>
</lark-table>

### 定时任务端云链路

<whiteboard token="PLFxw2RsNhJK7WbdNfFcadXXnVh"/>

## 六、任务执行策略 迭代需求说明

原流程：

1. 某个条件满足了，收到触发器的事件
1. 自动查询全部有效的目标，放入Context
1. 条件任务advisor <text color="red">**进行推理**</text>，生成advice、widget卡片、选择性地清理goal
1. 将advice发送给Director

新流程：

1. 某个条件满足了，收到触发器事件
1. 自动查询全部有效的目标
1. 根据条件任务advisor<text color="green">**提前生成的策略**</text>
1. 将advice发送给Director

迭代点：可以在事件发生时减少一次推理所需要的时间。

承接方：动态advisor云服务。

## 七、条件任务创建 交互流程优化 迭代需求说明（616 off）

原流程：

1. 用户表达条件任务需求
1. 豆包进行肯定性的回应：“收到，下次你打开车窗时，我会帮你自动调小空调风量”
1. 后台任务异步创建中（需要5～10s）
1. 任务创建完成：客户端显示任务卡片
	1. 仅Widget内容，无具体的条件、执行内容
1. 任务创建失败——>豆包进行提醒：“哎呀，这个条件暂时不支持呢”
1. 任务创建成功——>静默无提醒

新流程：

1. 用户表达条件任务需求
1. 豆包进行中性的回应：“好的，让我来帮你创建这个任务吧”
1. 后台任务异步创建中（需要5～10s）
1. 任务创建完成：客户端显示任务卡片
	1. 包含具体的条件字段、执行内容字段
1. 任务创建失败——>豆包进行提醒：“哎呀，这个条件暂时不支持呢”
1. 任务创建成功——>豆包进行提醒：“刚才的任务创建成功啦，将会在{具体条件}满足时，做{具体的执行项}”

<whiteboard token="YUd3wSvFvhTaBObU1dmcd4Gmn5e"/>

## 八、生态闭环类advisor 迭代需求说明

定义：闭环类advisor是指先前长程任务所负责的GUI Agent工作时，用户如果长时间没有回应，或中途存在打岔时，能够主动提醒用户继续完成GUI Agent的任务。在此基础上，闭环类advisor还能够在任务中心或任务卡片中实时传递生态应用透出的状态

<lark-table rows="4" cols="3" column-widths="208,363,281">

  <lark-tr>
    <lark-td>
      需求点
    </lark-td>
    <lark-td>
      需求说明
    </lark-td>
    <lark-td>
      备注
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      任务推进提醒
    </lark-td>
    <lark-td>
      支持定时策略，用户2分钟没有响应时提醒继续
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      任务状态跟踪
    </lark-td>
    <lark-td>
      支持生态应用传入标准SOP和状态，帮助advisor理解当前任务状态，并实时显示在任务中心或Docker中
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      任务分类
    </lark-td>
    <lark-td>
      生态应用类advisor存在唯一实例，需要提前根据支持的生态类型进行分类，方便区分来自美团订座、停车等不同应用的状态消息
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

<source-synced align="1">

  <whiteboard token="LI41wnEJ4hoWX5bdL0YcW6N1nYc" width="807" height="667"/>

</source-synced>
