# 【技术方案】静态 Advisor 主动服务

> [主动服务PRD（for赛力斯）——v1\.0](https://bytedance.larkoffice.com/docx/Qr8zdhdVboIFiNxX8x5crROJnug) 
> 
> [【仅对内】静态 Advisor  PRD（ for AIVA）v0\.4](https://bytedance.larkoffice.com/docx/GYfPdudyAoW7IwxLtQhc3KabnEc)
> 
> 

# 一、需求

静态 Advisor 是一套「持续运行、主动挖掘」的车载主动服务：云端观察人/车/环境，主动产出**目标、建议与 UI 描述**（覆盖舒适 / 出行 / 情感 / 内容四类）。端侧目标是**把这些主动服务落地到赛力斯原生界面**——AI bar、舒适空间、AI 电台等，并在用户确认后驱动执行。字节负责产出与下发数据、赛力斯负责界面渲染与交互，一期聚焦舒适/出行/情感的 P00 场景。

**分工与链路概览**：

<table><tbody>
<tr>
<td>

角色

</td>
<td>

职责

</td>
</tr>
<tr>
<td>

**云端**

</td>
<td>

产出目标 / 建议 / UI 描述 ，经 Frontier 下发；解释用户事件、驱动 Director 执行

</td>
</tr>
<tr>
<td>

**豆包端**

</td>
<td>

解析 Frontier 消息 →  下发UI协议；仅感知协议、不解析业务描述；把用户确认经 IM 上行

</td>
</tr>
<tr>
<td>

**塞力斯**

</td>
<td>

内部将ui描述路由到 AI bar / 舒适空间 / AI 电台等模块渲染，回传UI事件

</td>
</tr>
</tbody></table>

# 二、端侧架构

- 下行复用 Frontier（`METHOD\_ID\_ADVISER=3`，扩充字段承载 UI 控制）；**nova ↔ 车控进程经 AiCar SDK，车控进程 → 赛力斯经原子能力 SDK**；

- 上行复用 IM。

# 三、协议 A：云端 → 客户端

在现有 `FrontierMessage` 的内层 `message` JSON 上**扩充字段**，向后兼容（原 `\{recommend\_id, query\}` 豆包唤醒分支不受影响）。`ui\_control` 承载 UI 控制：`ui\_payload` 下发赛力斯渲染。

```JSON
{
  "recommend_id": "xxxx",
  "query": "xxxx",
  "ui_control": {
    "biz_type": "ai_bar",         // 业务类型
    "need_confirm": false,        // false=直接执行/告知; true=确认执行
    "ui_payload": { }             // → 协议B/C 下发赛力斯渲染(不透明)
  }
}
```

## 3\.1 本次 AI bar 的 ui\_control 字段说明

本次舒适/出行 AI bar 场景，协议 A 的 `ui\_control` 完整字段如下（信封由 nova 感知，`ui\_payload` 透传给赛力斯）：

<table><tbody>
<tr>
<td>

字段

</td>
<td>

类型

</td>
<td>

必填

</td>
<td>

说明

</td>
</tr>
<tr>
<td>

`biz\_type`

</td>
<td>

String

</td>
<td>

Y

</td>
<td>

业务类型 \(comfort\_bar/ travel\_bar/emotion\_bar\)

</td>
</tr>
<tr>
<td>

`need\_confirm`



</td>
<td>

Bool

</td>
<td>

Y



</td>
<td>

`false` 直接告知（status）；`true` 需用户点击确认（button）

</td>
</tr>
<tr>
<td>

`ui\_payload`



</td>
<td>

Object

</td>
<td>

Y

</td>
<td>

AI bar 展示内容，透传赛力斯（下见字段，按 advisor 类型取用）

</td>
</tr>
<tr>
<td>

`ui\_payload\.form`

</td>
<td>

String

</td>
<td>

Y

</td>
<td>

`button` 可点击 / `status` 仅展示

</td>
</tr>
<tr>
<td>

`ui\_payload\.text`

</td>
<td>

String

</td>
<td>

Y

</td>
<td>

dock 栏短文案，4–8 字，如「极速制冷中」「去上班」「来点歌听听」

</td>
</tr>
<tr>
<td>

`ui\_payload\.icon`

</td>
<td>

String

</td>
<td>

N

</td>
<td>

icon 枚举（`cooling`/`heating`/…，与赛力斯图标资源对齐）

</td>
</tr>
<tr>
<td>

`ui\_payload\.cot`

</td>
<td>

String

</td>
<td>

N

</td>
<td>

思维链（舒适空间 / AI 电台展示），用户可见摘要

</td>
</tr>
<tr>
<td>

`ui\_payload\.action\_list`



</td>
<td>

Object\[\]

</td>
<td>

N

</td>
<td>

【舒适】车控项展示，如 `\[\&\#34;极速制冷\&\#34;,\&\#34;温度25℃\&\#34;,\&\#34;风量11档\&\#34;\]`

</td>
</tr>
</tbody></table>

字段按 advisor 类型取用：舒适含 `cot`/`action\_list`；出行仅 `text`/`form`；**内容含 ****`cot`****/****`playlist`****（节目单）**。

**示例（biz\_type=comfort\_bar）**

```JSON
{
  "recommend_id": "rec-comfort-001",
  "ui_control": {
    "biz_type": "comfort_bar",
    "need_confirm": false,
    "ui_payload": {
      "form": "status",
      "text": "极速制冷中",
      "icon": "cooling",
      "cot": "车内38°C，帮你打开极速制冷",
      "action_list": [{}]
    }
  }
}
```

## 3\.2 两种交互场景（云端 → 客户端）

`need\_confirm` 决定上行**时机**

<table><tbody>
<tr>
<td>

场景

</td>
<td>

need\_confirm

</td>
<td>

IM 上行时机

</td>
</tr>
<tr>
<td>

**直接执行 / 告知**

</td>
<td>

`false`

</td>
<td>

下发 UI 渲染的**同时，发送query上行**，**不等待**用户操作（如舒适「极速制冷中」告知）

</td>
</tr>
<tr>
<td>

**确认执行**

</td>
<td>

`true`

</td>
<td>

UI 渲染后**等待**`onUiEvent` 回传，再拼接「用户已确认，可直接执行」上行（如出行「去上班」按钮）

</td>
</tr>
</tbody></table>

两场景上行均复用现有IM链路：`NovaServiceBinder\.sendTextNew\(\)`（携带 `vehicle\_biz\_params` 关联 `recommend\_id`）

# 四、协议 B：豆包 → 车控进程（AiCar SDK）

nova 把 UI 消息发给车控进程，走 **AiCar SDK 新增的一套 AIDL**：**register 监听（下行）\+ notify 回传（上行）**。车控进程作为 AiCar SDK 的客户端接收，再转调赛力斯原子能力 SDK（协议 C）。

```Kotlin
fun registerUiControlListener(listener: IUiControlListener)
fun unregisterUiControlListener(listener: IUiControlListener)
fun notifyUiEvent(uiEventJson: String)         // 车控进程回传点击/确认等

interface IUiControlListener {
    fun onUiControl(uiControlJson: String)      // 下行：信封 + 不透明 payload
}
```

**下行 uiControlJson 信封**：`biz\_type`、`event\_id`（映射自 `recommend\_id`）、`action`（`show`/`update`/`remove`）、`payload`（不透明；**不含 reply**）。

**上行 uiEventJson**：`biz\_type`/`event\_id`（关联）、`ui\_event`（`click`/`confirm`/`expose`/`dismiss`）、`event\_data`（不透明）。车控进程/赛力斯**不需要知道确认后 nova 做什么**。

# 五、协议 C：车控进程 → 赛力斯原子能力 SDK

车控进程集成赛力斯 **SeresPlatformSDK**（`com\.seres\.common:PlatformLib`），收到协议 B 的 UI 消息后，通过**原子能力**的UI渲染接口下发；SDK 内部路由到 AI bar / 舒适空间 / AI 电台等模块渲染。

**请求参数（params）**：

<table><tbody>
<tr>
<td>

参数名

</td>
<td>

类型

</td>
<td>

必传

</td>
<td>

描述

</td>
</tr>
<tr>
<td>

`event\_id`

</td>
<td>

String

</td>
<td>

是

</td>
<td>

UI 唯一标识，与刷新/移除/事件关联

</td>
</tr>
<tr>
<td>

`show\_state`



</td>
<td>

int



</td>
<td>

是

</td>
<td>

0 隐藏 / 1 显示 / 2 刷新（`update`→2、`remove`→0）

</td>
</tr>
<tr>
<td>

`biz\_type`

</td>
<td>

String

</td>
<td>

是

</td>
<td>

业务类型 

</td>
</tr>
<tr>
<td>

`ui\_payload`



</td>
<td>

String



</td>
<td>

是

</td>
<td>

渲染字段 JSON（`form`/`text`/`icon`/`cot`/`action\_list`/`playlist`，随 biz\_type 变）

</td>
</tr>
</tbody></table>

# **依赖项**

- 原子能力SDK 接口定义，**新增事件回调能力**：SDK 增加 UI 事件监听 

- 主动服务（主动推荐）总开关上云 @徐燃@吴仁杰






