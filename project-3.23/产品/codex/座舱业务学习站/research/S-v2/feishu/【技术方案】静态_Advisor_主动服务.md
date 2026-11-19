# 【技术方案】静态 Advisor 主动服务（飞书原文转存；更新时间 2026-07-22）

来源链接：https://bytedance.larkoffice.com/wiki/BGDJwVZjoi60tGku4pbcNDLOnXf

<quote-container>

<mention-doc token="Qr8zdhdVboIFiNxX8x5crROJnug" type="docx">主动服务PRD（for赛力斯）——v1.0</mention-doc> 

<mention-doc token="GYfPdudyAoW7IwxLtQhc3KabnEc" type="docx">【仅对内】静态 Advisor  PRD（ for AIVA）v0.4</mention-doc>
</quote-container>

# 一、需求

静态 Advisor 是一套「持续运行、主动挖掘」的车载主动服务：云端观察人/车/环境，主动产出**目标、建议与 UI 描述**（覆盖舒适 / 出行 / 情感 / 内容四类）。端侧目标是**把这些主动服务落地到赛力斯原生界面**——AI bar、舒适空间、AI 电台等，并在用户确认后驱动执行。字节负责产出与下发数据、赛力斯负责界面渲染与交互，一期聚焦舒适/出行/情感的 P00 场景。

**分工与链路概览**：

<lark-table rows="4" cols="2" header-row="true" column-widths="272,486">

  <lark-tr>
    <lark-td>
      角色
    </lark-td>
    <lark-td>
      职责
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **云端**
    </lark-td>
    <lark-td>
      产出目标 / 建议 / UI 描述 ，经 Frontier 下发；解释用户事件、驱动 Director 执行
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **豆包端**
    </lark-td>
    <lark-td>
      解析 Frontier 消息 →  下发UI协议；仅感知协议、不解析业务描述；把用户确认经 IM 上行
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **塞力斯**
    </lark-td>
    <lark-td>
      内部将ui描述路由到 AI bar / 舒适空间 / AI 电台等模块渲染，回传UI事件
    </lark-td>
  </lark-tr>
</lark-table>

# 二、端侧架构

<whiteboard token="CHbRwv32xhVpIFbvrpYcjvrrnPS"/>

- 下行复用 Frontier（`METHOD_ID_ADVISER=3`，扩充字段承载 UI 控制）；**nova ↔ 车控进程经 AiCar SDK，车控进程 → 赛力斯经原子能力 SDK**；
- 上行复用 IM。

# 三、协议 A：云端 → 客户端

在现有 `FrontierMessage` 的内层 `message` JSON 上**扩充字段**，向后兼容（原 `{recommend_id, query}` 豆包唤醒分支不受影响）。`ui_control` 承载 UI 控制：`ui_payload` 下发赛力斯渲染。
```json
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

## 3.1 本次 AI bar 的 ui_control 字段说明

本次舒适/出行 AI bar 场景，协议 A 的 `ui_control` 完整字段如下（信封由 nova 感知，`ui_payload` 透传给赛力斯）：

<lark-table rows="9" cols="4" header-row="true" column-widths="223,99,78,328">

  <lark-tr>
    <lark-td>
      字段
    </lark-td>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      必填
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      `biz_type`
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      Y
    </lark-td>
    <lark-td>
      业务类型 (comfort_bar/ travel_bar/emotion_bar)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      `need_confirm`
    </lark-td>
    <lark-td>
      Bool
    </lark-td>
    <lark-td>
      Y
    </lark-td>
    <lark-td>
      `false` 直接告知（status）；`true` 需用户点击确认（button）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      `ui_payload`
    </lark-td>
    <lark-td>
      Object
    </lark-td>
    <lark-td>
      Y
    </lark-td>
    <lark-td>
      AI bar 展示内容，透传赛力斯（下见字段，按 advisor 类型取用）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      `ui_payload.form`
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      Y
    </lark-td>
    <lark-td>
      `button` 可点击 / `status` 仅展示
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      `ui_payload.text`
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      Y
    </lark-td>
    <lark-td>
      dock 栏短文案，4–8 字，如「极速制冷中」「去上班」「来点歌听听」
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      `ui_payload.icon`
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      N
    </lark-td>
    <lark-td>
      icon 枚举（`cooling`/`heating`/…，与赛力斯图标资源对齐）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      `ui_payload.cot`
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      N
    </lark-td>
    <lark-td>
      思维链（舒适空间 / AI 电台展示），用户可见摘要
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      `ui_payload.action_list`
    </lark-td>
    <lark-td>
      Object[]
    </lark-td>
    <lark-td>
      N
    </lark-td>
    <lark-td>
      【舒适】车控项展示，如 `["极速制冷","温度25℃","风量11档"]`
    </lark-td>
  </lark-tr>
</lark-table>

字段按 advisor 类型取用：舒适含 `cot`/`action_list`；出行仅 `text`/`form`；**内容含**`**cot**`**/**`**playlist**`**（节目单）**。

**示例（biz_type=comfort_bar）**
```json
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

## 3.2 两种交互场景（云端 → 客户端）

`need_confirm` 决定上行**时机**

<whiteboard token="TVqvwRu3NhkHH2bsC05chl2vnue"/>

<lark-table rows="3" cols="3" header-row="true" column-widths="199,129,328">

  <lark-tr>
    <lark-td>
      场景
    </lark-td>
    <lark-td>
      need_confirm
    </lark-td>
    <lark-td>
      IM 上行时机
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **直接执行 / 告知**
    </lark-td>
    <lark-td>
      `false`
    </lark-td>
    <lark-td>
      下发 UI 渲染的**同时，发送query上行**，**不等待**用户操作（如舒适「极速制冷中」告知）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **确认执行**
    </lark-td>
    <lark-td>
      `true`
    </lark-td>
    <lark-td>
      UI 渲染后**等待**`onUiEvent` 回传，再拼接「用户已确认，可直接执行」上行（如出行「去上班」按钮）
    </lark-td>
  </lark-tr>
</lark-table>

两场景上行均复用现有IM链路：`NovaServiceBinder.sendTextNew()`（携带 `vehicle_biz_params` 关联 `recommend_id`）

# 四、协议 B：豆包 → 车控进程（AiCar SDK）

nova 把 UI 消息发给车控进程，走 **AiCar SDK 新增的一套 AIDL**：**register 监听（下行）+ notify 回传（上行）**。车控进程作为 AiCar SDK 的客户端接收，再转调赛力斯原子能力 SDK（协议 C）。
```kotlin
fun registerUiControlListener(listener: IUiControlListener)
fun unregisterUiControlListener(listener: IUiControlListener)
fun notifyUiEvent(uiEventJson: String)         // 车控进程回传点击/确认等

interface IUiControlListener {
    fun onUiControl(uiControlJson: String)      // 下行：信封 + 不透明 payload
}
```

**下行 uiControlJson 信封**：`biz_type`、`event_id`（映射自 `recommend_id`）、`action`（`show`/`update`/`remove`）、`payload`（不透明；**不含 reply**）。

**上行 uiEventJson**：`biz_type`/`event_id`（关联）、`ui_event`（`click`/`confirm`/`expose`/`dismiss`）、`event_data`（不透明）。车控进程/赛力斯**不需要知道确认后 nova 做什么**。

# 五、协议 C：车控进程 → 赛力斯原子能力 SDK

车控进程集成赛力斯 **SeresPlatformSDK**（`com.seres.common:PlatformLib`），收到协议 B 的 UI 消息后，通过**原子能力**的UI渲染接口下发；SDK 内部路由到 AI bar / 舒适空间 / AI 电台等模块渲染。

**请求参数（params）**：

<lark-table rows="5" cols="4" header-row="true" column-widths="141,104,78,328">

  <lark-tr>
    <lark-td>
      参数名
    </lark-td>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      必传
    </lark-td>
    <lark-td>
      描述
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      `event_id`
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      是
    </lark-td>
    <lark-td>
      UI 唯一标识，与刷新/移除/事件关联
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      `show_state`
    </lark-td>
    <lark-td>
      int
    </lark-td>
    <lark-td>
      是
    </lark-td>
    <lark-td>
      0 隐藏 / 1 显示 / 2 刷新（`update`→2、`remove`→0）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      `biz_type`
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      是
    </lark-td>
    <lark-td>
      业务类型
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      `ui_payload`
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      是
    </lark-td>
    <lark-td>
      渲染字段 JSON（`form`/`text`/`icon`/`cot`/`action_list`/`playlist`，随 biz_type 变）
    </lark-td>
  </lark-tr>
</lark-table>

# 依赖项

- 原子能力SDK 接口定义，**新增事件回调能力**：SDK 增加 UI 事件监听 
- 主动服务（主动推荐）总开关上云 <mention-user id="ou_3039771e491435c92cf2c28ab9f48f9a"/><mention-user id="ou_86010a55eb07891b35f657d63ab30198"/>
