# 端侧触发器 - PRD（飞书原文转存；更新时间 2026-07-08T14:31:50+08:00）

来源链接：https://bytedance.larkoffice.com/wiki/Q1RBwsEuliWvk6kv8Jxc1JB7nEc


<lark-table rows="3" cols="4" column-widths="100,100,158,557">

  <lark-tr>
    <lark-td>
      **版本**
    </lark-td>
    <lark-td>
      **更新日期**
    </lark-td>
    <lark-td>
      **更新人**
    </lark-td>
    <lark-td>
      **更新内容**
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      V1.1
    </lark-td>
    <lark-td>
      2026/7/6
    </lark-td>
    <lark-td>
      <mention-user id="ou_d35304ddd7e37a06ebac58f7f60b6522"/>
    </lark-td>
    <lark-td>
      vlm链路打通
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      v1.0
    </lark-td>
    <lark-td>
      2026/3/23
    </lark-td>
    <lark-td>
      <mention-user id="ou_d35304ddd7e37a06ebac58f7f60b6522"/>
    </lark-td>
    <lark-td>
      创建初版
    </lark-td>
  </lark-tr>
</lark-table>

## 项目背景

车端AI Box 上部署了端侧 VLM，具备通过舱内/舱外摄像头实时感知车辆内外环境的能力。VLM 可以输出两种结果：精调标签（结构化字段，如“座位占用=主驾“挡位=P"）和自然语言 caption（如"后排左侧婴儿闭眼安静睡觉"）。硬件和模型能力已经就位。

但 VLM 本身**不具备自主决策能力**——它不知道什么时候该开机、什么时候该关机、该跑什么任务、跑完结果给谁。目前没有一个模块来管理 VLM 的生命周期。具体表现为以下四个缺失：

<lark-table rows="4" cols="3" column-widths="139,514,477">

  <lark-tr>
    <lark-td>
      **缺失能力**
    </lark-td>
    <lark-td>
      **当前状态**
    </lark-td>
    <lark-td>
      **导致的问题**
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **VLM 生命周期管理**
    </lark-td>
    <lark-td>
      AlwaysOn 三任务启停（舱外/舱内动态/舱内静态）什么时候开、什么时候关、用户关了 Awake Button 怎么办
    </lark-td>
    <lark-td>
      VLM 不知道自己该不该跑 ， 要么一直跑，要么不跑
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **条件触发引擎**
    </lark-td>
    <lark-td>
      "不需要用户主动发起、系统自动执行"的安全/体验类任务（下车安全、起步安全、遗留物品检测、天气路况保护等）需要基于信号条件自动触发，目前没有这个条件匹配和调度引擎
    </lark-td>
    <lark-td>
      安全类任务无法自动执行 → 用户停车开门时不会自动检测障碍物 → 需要用户自己注意安全
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **VLM 结果回传链路**
    </lark-td>
    <lark-td>
      VLM 跑完后结果直接给了 AI Service，触发器（调用方）不知道任务完没完、结果是什么
    </lark-td>
    <lark-td>
      触发器无法做续接调度（不知道上一轮结果）、无法释放互斥资源（不知道任务结束了）、AlwaysOn 被打断后无法恢复
    </lark-td>
  </lark-tr>
</lark-table>

## 整体架构

<whiteboard token="PuiYwq1jKhV7czb7olucRiWUnkb"/>

<lark-table rows="4" cols="3" column-widths="100,184,516">

  <lark-tr>
    <lark-td>
      **名称**
    </lark-td>
    <lark-td>
      **方向**
    </lark-td>
    <lark-td>
      **发动**
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      触发推理
    </lark-td>
    <lark-td>
      触发器 → VLM SDK
    </lark-td>
    <lark-td>
      运行推理指令
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      控制通道
    </lark-td>
    <lark-td>
      VLM SDK → 触发器
    </lark-td>
    <lark-td>
      状态回调：success / empty / timeout / failed（待确定）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      数据通道
    </lark-td>
    <lark-td>
      VLM SDK → 数据中心
    </lark-td>
    <lark-td>
      VLM原始输出（完整JSON），通过topic发布
    </lark-td>
  </lark-tr>
</lark-table>

## 需求

- 根据power+button状态开关AlwaysOn三任务
- 接收注册条件 →组装运行指令 → 发给VLM SDK
- 接收VLM SDK状态回调 → 更新任务状态

## AlwaysOn 开关链路

<whiteboard token="PrmxwnAVFhcbinbME9NcRJxjnzb"/>

## 状态回调

#### 分两层（一个同步、一个异步）

<lark-table rows="3" cols="3" column-widths="130,225,433">

  <lark-tr>
    <lark-td>
      **层**
    </lark-td>
    <lark-td>
      **什么时候回**
    </lark-td>
    <lark-td>
      **传什么**
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      触发状态
      （同步）
    </lark-td>
    <lark-td>
      你调用的当下立即返回
    </lark-td>
    <lark-td>
      指令送达没（调用成功/失败）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      工作状态
      （异步）
    </lark-td>
    <lark-td>
      VLM 跑完（1~2秒后）回调
    </lark-td>
    <lark-td>
      执行成败（已启动 / success / empty / timeout / failed / 已停止）
    </lark-td>
  </lark-tr>
</lark-table>

<lark-table rows="6" cols="2" column-widths="154,720">

  <lark-tr>
    <lark-td>
      **用途**
    </lark-td>
    <lark-td>
      **说明**
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **确认开关真生效**
    </lark-td>
    <lark-td>
      下发 start，AIBox 可能还没起来（谁先起的问题）。
      回调"已启动"才证明它真跑了；
      下发 stop，回调"已停止"才证明真停了
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **OneShot 重试决策**
    </lark-td>
    <lark-td>
      收到 timeout/failed → 决定重试一次 → 二次还失败 → 停止 + 告警。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **超时守卫 + 释放占用**
    </lark-td>
    <lark-td>
      OneShot 占着 VLM_FRONT 摄像头，超时了得知道 → 释放，别一直占着挡别的任务
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **异常告警上报**
    </lark-td>
    <lark-td>
      连续 failed → 触发器报给云端监控，运维能发现"这台车 VLM 一直挂"
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **维护任务状态表**
    </lark-td>
    <lark-td>
      你内部维护"现在哪些任务在跑"，回调是更新它的唯一来源，支撑后续调度决策
    </lark-td>
  </lark-tr>
</lark-table>

<lark-table rows="4" cols="3" column-widths="100,367,556">

  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      **有回调**
    </lark-td>
    <lark-td>
      **没回调**
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **你的感知**
    </lark-td>
    <lark-td>
      收到 failed → 重试一次 → 还 failed → 停止 + 告警
    </lark-td>
    <lark-td>
      以为发出去就成了
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **结果**
    </lark-td>
    <lark-td>
      你知道"充电桩检测失败了"
    </lark-td>
    <lark-td>
      数据中心永远收不到数据（VLM没跑）→ 云端永远等不到判断 → 充电口盖永远不开
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **而你**
    </lark-td>
    <lark-td>
      有数、能重试、能告警
    </lark-td>
    <lark-td>
      **毫不知情，功能静默失败，用户一脸懵**
    </lark-td>
  </lark-tr>
</lark-table>

## 上传异常：按业务场景分级处理

1. <text bgcolor="red">周期类（时效优先）：网络异常时丢弃积压包，不组织补传，仅轮询上报最新状态，保障上传数据的实时性</text>
1. <text bgcolor="red">One-shot类（成功率优先）：漏传触发 1 次自动补传。断网时暂存本地，网络恢复后通过断点续传发出。</text>

## 天气路况保护-雾天开启雾灯

<whiteboard token="UG6RwjlBdh8QCobrIe9cUugsnni" width="820" height="618"/>

以**舱外AlwaysOn天气感知**为例：

- **系统上电**：端侧触发器启动 → 从信号库读取 “车辆电源状态”  → 检测到 <text color="purple">power = on</text>
- **点火判断**：舱外AlwaysOn只需 <text color="purple">power = on</text> 单条件 → 满足 → 端侧触发器 注册舱外AlwaysOn任务请求
- **组装运行指令**：填充字段（~~task_id=舱外感知, camera=前视, priority=P3 优先级级, timeout=3秒, mutex_group=舱外任务组, trigger_source=AlwaysOn常驻 , expire_at=无（常驻不过期），execution_type =周期执行, task_goal=识别前方天气路况~~）
- **触发推理**：向 VLM SDK 发送运行指令（同步调用）→ VLM SDK 同步返回"接收成功" → 触发器任务状态标记为"已下发"
- **VLM SDK 执行推理**：调用前视摄像头 → 拍一帧 → 端侧VLM模型推理 → 产出原始JSON字符串（包含天气标签、路面状态、前方障碍物等）
- **控制通道回传**：VLM SDK → 异步回调给触发器  status=识别成功 + task_id + timestamp=时间戳。**只传状态，不传VLM原始数据**
- <text bgcolor="light-gray">**数据通道回传**</text><text bgcolor="light-gray">：VLM SDK → 按 topic “舱外感知结果” 发布推理结果 → 数据中心已订阅此topic → 自动收到完整VLM原始JSON</text>
- <text bgcolor="light-gray">**数据中心整包透传**</text><text bgcolor="light-gray">：数据中心收到VLM原始输出 → 附上 task_type + timestamp  → 不解析、不拆字段 → 按端状态上报格式整包推送给云端</text>
- <text bgcolor="light-gray">**云端消费**</text><text bgcolor="light-gray">：云端端状态收到VLM数据 → 解析JSON → 拆出天气标签/路况等字段 → 注入Context/Advisor → Planner获得视觉感知信息</text>
- **接收回调 + 状态更新**：收到 success 回调 → 标记本周期完成 → 释放（AlwaysOn不释放互斥，常驻持有）→ 进入周期等待
- **周期续接**：等待 3 秒（舱外AlwaysOn周期）→ **回到步骤**重新组装运行指令 → 开始下一周期。持续循环直到 power→off

<lark-table rows="12" cols="3" column-widths="285,77,100">

  <lark-tr>
    <lark-td>
      **功能清单**
    </lark-td>
    <lark-td>
      **优先级**
    </lark-td>
    <lark-td>
      范围
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      AlwaysOn 任务开关管理
    </lark-td>
    <lark-td>
      p0
    </lark-td>
    <lark-td>
      804
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      天气类端侧自闭环（雾灯/湿滑/雪地）
    </lark-td>
    <lark-td>
      P1
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      充电桩链式触发（R→P + oneshot VLM）
    </lark-td>
    <lark-td>
      P2
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      地理围栏
    </lark-td>
    <lark-td>
      P2
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      本地定时器
    </lark-td>
    <lark-td>
      P2
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      规则接收 + 本地持久化
    </lark-td>
    <lark-td>
      P2
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      任务中心管理
    </lark-td>
    <lark-td>
      p1
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      SP 拼接/注入
    </lark-td>
    <lark-td>
      p1
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      动态 Advisor 视觉任务下发
    </lark-td>
    <lark-td>
      p1
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      VLM 结果解析
    </lark-td>
    <lark-td>
      p1
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      语义条件判断
    </lark-td>
    <lark-td>
      p1
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>
