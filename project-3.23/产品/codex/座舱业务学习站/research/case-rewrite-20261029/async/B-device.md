# 端侧触发器 \- PRD 

<table><tbody>
<tr>
<td>

**版本**

</td>
<td>

**更新日期**

</td>
<td>

**更新人**

</td>
<td>

**更新内容**

</td>
</tr>
<tr>
<td>

V1\.1

</td>
<td>

2026/7/6

</td>
<td>

@王泽民



</td>
<td>

vlm链路打通

</td>
</tr>
<tr>
<td>

v1\.0

</td>
<td>

2026/3/23

</td>
<td>

@王泽民

</td>
<td>

创建初版

</td>
</tr>
</tbody></table>

## 项目背景

车端AI Box 上部署了端侧 VLM，具备通过舱内/舱外摄像头实时感知车辆内外环境的能力。VLM 可以输出两种结果：精调标签（结构化字段，如“座位占用=主驾“挡位=P\&\#34;）和自然语言 caption（如\&\#34;后排左侧婴儿闭眼安静睡觉\&\#34;）。硬件和模型能力已经就位。

但 VLM 本身**不具备自主决策能力**——它不知道什么时候该开机、什么时候该关机、该跑什么任务、跑完结果给谁。目前没有一个模块来管理 VLM 的生命周期。具体表现为以下四个缺失：

<table><tbody>
<tr>
<td>

**缺失能力**

</td>
<td>

**当前状态**

</td>
<td>

**导致的问题**

</td>
</tr>
<tr>
<td>

**VLM 生命周期管理**

</td>
<td>

AlwaysOn 三任务启停（舱外/舱内动态/舱内静态）什么时候开、什么时候关、用户关了 Awake Button 怎么办

</td>
<td>

VLM 不知道自己该不该跑 ， 要么一直跑，要么不跑

</td>
</tr>
<tr>
<td>

**条件触发引擎**



</td>
<td>

\&\#34;不需要用户主动发起、系统自动执行\&\#34;的安全/体验类任务（下车安全、起步安全、遗留物品检测、天气路况保护等）需要基于信号条件自动触发，目前没有这个条件匹配和调度引擎

</td>
<td>

安全类任务无法自动执行 → 用户停车开门时不会自动检测障碍物 → 需要用户自己注意安全

</td>
</tr>
<tr>
<td>

**VLM 结果回传链路**

</td>
<td>

VLM 跑完后结果直接给了 AI Service，触发器（调用方）不知道任务完没完、结果是什么

</td>
<td>

触发器无法做续接调度（不知道上一轮结果）、无法释放互斥资源（不知道任务结束了）、AlwaysOn 被打断后无法恢复

</td>
</tr>
</tbody></table>



## 整体架构

<table><tbody>
<tr>
<td>

**名称**

</td>
<td>

**方向**

</td>
<td>

**发动**

</td>
</tr>
<tr>
<td>

触发推理

</td>
<td>

触发器 → VLM SDK

</td>
<td>

运行推理指令

</td>
</tr>
<tr>
<td>

控制通道

</td>
<td>

VLM SDK → 触发器

</td>
<td>

状态回调：success / empty / timeout / failed（待确定）

</td>
</tr>
<tr>
<td>

数据通道

</td>
<td>

VLM SDK → 数据中心

</td>
<td>

VLM原始输出（完整JSON），通过topic发布

</td>
</tr>
</tbody></table>



## 需求

- 根据power\+button状态开关AlwaysOn三任务

- 接收注册条件 →组装运行指令 → 发给VLM SDK

- 接收VLM SDK状态回调 → 更新任务状态



## AlwaysOn 开关链路



## 状态回调

#### 分两层（一个同步、一个异步）

<table><tbody>
<tr>
<td>

**层**

</td>
<td>

**什么时候回**

</td>
<td>

**传什么**

</td>
</tr>
<tr>
<td>

触发状态
（同步）

</td>
<td>

你调用的当下立即返回

</td>
<td>

指令送达没（调用成功/失败）

</td>
</tr>
<tr>
<td>

工作状态
（异步）

</td>
<td>

VLM 跑完（1\~2秒后）回调

</td>
<td>

执行成败（已启动 / success / empty / timeout / failed / 已停止）

</td>
</tr>
</tbody></table>

<table><tbody>
<tr>
<td>

**用途**

</td>
<td>

**说明**

</td>
</tr>
<tr>
<td>

**确认开关真生效**

</td>
<td>

下发 start，AIBox 可能还没起来（谁先起的问题）。

回调\&\#34;已启动\&\#34;才证明它真跑了；

下发 stop，回调\&\#34;已停止\&\#34;才证明真停了

</td>
</tr>
<tr>
<td>

**OneShot 重试决策**

</td>
<td>

收到 timeout/failed → 决定重试一次 → 二次还失败 → 停止 \+ 告警。

</td>
</tr>
<tr>
<td>

**超时守卫 \+ 释放占用**

</td>
<td>

OneShot 占着 VLM\_FRONT 摄像头，超时了得知道 → 释放，别一直占着挡别的任务

</td>
</tr>
<tr>
<td>

**异常告警上报**

</td>
<td>

连续 failed → 触发器报给云端监控，运维能发现\&\#34;这台车 VLM 一直挂\&\#34;

</td>
</tr>
<tr>
<td>

**维护任务状态表**

</td>
<td>

你内部维护\&\#34;现在哪些任务在跑\&\#34;，回调是更新它的唯一来源，支撑后续调度决策

</td>
</tr>
</tbody></table>

<table><tbody>
<tr>
<td>



</td>
<td>

**有回调**

</td>
<td>

**没回调**

</td>
</tr>
<tr>
<td>

**你的感知**

</td>
<td>

收到 failed → 重试一次 → 还 failed → 停止 \+ 告警

</td>
<td>

以为发出去就成了

</td>
</tr>
<tr>
<td>

**结果**

</td>
<td>

你知道\&\#34;充电桩检测失败了\&\#34;

</td>
<td>

数据中心永远收不到数据（VLM没跑）→ 云端永远等不到判断 → 充电口盖永远不开

</td>
</tr>
<tr>
<td>

**而你**

</td>
<td>

有数、能重试、能告警

</td>
<td>

**毫不知情，功能静默失败，用户一脸懵**

</td>
</tr>
</tbody></table>

## 上传异常：按业务场景分级处理

1. 周期类（时效优先）：网络异常时丢弃积压包，不组织补传，仅轮询上报最新状态，保障上传数据的实时性

2. One\-shot类（成功率优先）：漏传触发 1 次自动补传。断网时暂存本地，网络恢复后通过断点续传发出。







## **天气路况保护\-雾天开启雾灯**



以**舱外AlwaysOn天气感知**为例：

- **系统上电**：端侧触发器启动 → 从信号库读取 “车辆电源状态”  → 检测到 power = on

- **点火判断**：舱外AlwaysOn只需 power = on 单条件 → 满足 → 端侧触发器 注册舱外AlwaysOn任务请求

- **组装运行指令**：填充字段（~~task\_id=舱外感知, camera=前视, priority=P3 优先级级, timeout=3秒, mutex\_group=舱外任务组, trigger\_source=AlwaysOn常驻 , expire\_at=无（常驻不过期），execution\_type =周期执行, task\_goal=识别前方天气路况~~）

- **触发推理**：向 VLM SDK 发送运行指令（同步调用）→ VLM SDK 同步返回\&\#34;接收成功\&\#34; → 触发器任务状态标记为\&\#34;已下发\&\#34;

- **VLM SDK 执行推理**：调用前视摄像头 → 拍一帧 → 端侧VLM模型推理 → 产出原始JSON字符串（包含天气标签、路面状态、前方障碍物等）

- **控制通道回传**：VLM SDK → 异步回调给触发器  status=识别成功 \+ task\_id \+ timestamp=时间戳。**只传状态，不传VLM原始数据**

- **数据通道回传**：VLM SDK → 按 topic “舱外感知结果” 发布推理结果 → 数据中心已订阅此topic → 自动收到完整VLM原始JSON

- **数据中心整包透传**：数据中心收到VLM原始输出 → 附上 task\_type \+ timestamp  → 不解析、不拆字段 → 按端状态上报格式整包推送给云端

- **云端消费**：云端端状态收到VLM数据 → 解析JSON → 拆出天气标签/路况等字段 → 注入Context/Advisor → Planner获得视觉感知信息

- **接收回调 \+ 状态更新**：收到 success 回调 → 标记本周期完成 → 释放（AlwaysOn不释放互斥，常驻持有）→ 进入周期等待

- **周期续接**：等待 3 秒（舱外AlwaysOn周期）→ **回到步骤**重新组装运行指令 → 开始下一周期。持续循环直到 power→off



<table><tbody>
<tr>
<td>

**功能清单**

</td>
<td>

**优先级**

</td>
<td>

范围

</td>
</tr>
<tr>
<td>

AlwaysOn 任务开关管理

</td>
<td>

p0

</td>
<td>

804

</td>
</tr>
<tr>
<td>

天气类端侧自闭环（雾灯/湿滑/雪地）

</td>
<td>

P1

</td>
<td>



</td>
</tr>
<tr>
<td>

充电桩链式触发（R→P \+ oneshot VLM）

</td>
<td>

P2

</td>
<td>



</td>
</tr>
<tr>
<td>

地理围栏

</td>
<td>

P2

</td>
<td>



</td>
</tr>
<tr>
<td>

本地定时器

</td>
<td>

P2

</td>
<td>



</td>
</tr>
<tr>
<td>

规则接收 \+ 本地持久化

</td>
<td>

P2

</td>
<td>



</td>
</tr>
<tr>
<td>

任务中心管理

</td>
<td>

p1

</td>
<td>



</td>
</tr>
<tr>
<td>

SP 拼接/注入

</td>
<td>

p1

</td>
<td>



</td>
</tr>
<tr>
<td>

动态 Advisor 视觉任务下发

</td>
<td>

p1

</td>
<td>



</td>
</tr>
<tr>
<td>

VLM 结果解析

</td>
<td>

p1

</td>
<td>



</td>
</tr>
<tr>
<td>

语义条件判断

</td>
<td>

p1

</td>
<td>



</td>
</tr>
</tbody></table>


