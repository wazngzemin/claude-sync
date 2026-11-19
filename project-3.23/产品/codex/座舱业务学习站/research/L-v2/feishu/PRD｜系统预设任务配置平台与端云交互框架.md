# PRD｜系统预设任务配置平台与端云交互框架（飞书原文转存；更新时间 2026-10-20T19:37:12+08:00）

来源链接：https://bytedance.larkoffice.com/wiki/R1OLwyfpTijHw7kQtnbcoZB4nff#Yevmdm7RnoI0klxUvJyczG2in9e

## 需求背景

系统预设任务是产品预先定义、用户可以自主开启和关闭的长期任务服务。用户不必每次提出指令；系统在符合条件时提醒或处理，完成一次后继续等待下次。用户关闭任务后，系统停止新触发；关闭任务不等于撤销已经发生的车辆动作。

###  端侧与云端配置边界

云端复用现有场景配置与端状态上传链路，扩展交互及结果分支。

端侧现阶段按任务需求开发；端云统一配置与下发作为后续建设项。

<lark-table rows="6" cols="3" column-widths="133,343,373">

  <lark-tr>
    <lark-td>
      **能力** {align="center"}
    </lark-td>
    <lark-td>
      **端侧任务** {align="center"}
    </lark-td>
    <lark-td>
      **云端任务** {align="center"}
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      选择端状态
    </lark-td>
    <lark-td>
      选择可读信号与视觉结果，当前由端侧研发实现
    </lark-td>
    <lark-td>
      引用可用端状态
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      编辑规则
    </lark-td>
    <lark-td>
      产品定义与/或、阈值、变化事件、持续时间
    </lark-td>
    <lark-td>
      已支持部分通过平台配置
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      选择后续处理
    </lark-td>
    <lark-td>
      固定车控、调用本地卡片等由端侧任务业务承接
    </lark-td>
    <lark-td>
      发起主动推荐/识别Query，或确定性动作链路
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      填写交互
    </lark-td>
    <lark-td>
      需要文案、按钮、TTS、本地词条和返回业务；
    </lark-td>
    <lark-td>
      需要推荐内容、交互等级、上下文、卡片后续行为
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      处理结果与退出
    </lark-td>
    <lark-td>
      执行前复核、回读、取消、冷却均进入任务规格
    </lark-td>
    <lark-td>
      补齐推理超时、过期结果、云端与端侧结果关联
    </lark-td>
  </lark-tr>
</lark-table>

## 范围、模块

### 本期任务范围

<mention-doc token="SorvwQ413iamTRkzSxvcVPWtnYc" type="wiki">预设条件表V2</mention-doc>

<lark-table rows="5" cols="3" column-widths="244,132,367">

  <lark-tr>
    <lark-td>
      任务
    </lark-td>
    <lark-td>
      端云方向
    </lark-td>
    <lark-td>
      交互与动作
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      天气／路况保护
    </lark-td>
    <lark-td>
      端侧自闭环
    </lark-td>
    <lark-td>
      雨、雪、雾分别询问；确认后切对应模式或开启后雾灯
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      后排儿童／宠物识别后开启儿童锁
    </lark-td>
    <lark-td>
      云端任务
    </lark-td>
    <lark-td>
      静默开启或先询问；本任务不自动解锁
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      识别充电设备后打开充电口盖
    </lark-td>
    <lark-td>
      云端任务
    </lark-td>
    <lark-td>
      识别到设备后询问，有效确认后开盖
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      后视镜自动加热
    </lark-td>
    <lark-td>
      云端任务
    </lark-td>
    <lark-td>
      静默开启；各场景退出分别定义
    </lark-td>
  </lark-tr>
</lark-table>

### 整体业务框架

<whiteboard token="ZYHMwAOObhMNgjbGevnchgpPnEb"/>

##  云端链路

### 云端建设目标与价值

**建设目标：**建设一套可复用的云端系统预设任务配置与运行框架，使产品能够定义任务许可、触发规则、进一步判断、用户交互、车辆动作和结果规则；运行时由各模块按照统一责任完成从用户开启到车辆真实结果的闭环。

- **用户价值：**用户只需开启一次任务，系统会在合适场景主动提供服务；需要车辆动作时，仍保留用户确认权和端侧最终安全门禁。
- **产品价值：**新增任务可以组合已经接入的状态、规则、模型、卡片和车控能力，不再逐 Case 重做整条链路。

**云端任务分类：**

- 第一类是“确定性云端规则任务”，云端已有状态足以得出业务结论，不需要 DT 或 Planner；
- 第二类是“云端协作任务”，还需要 Advisor、DT、VQA 或上下文补充判断。“识别充电设备后打开充电口盖”属于第二类。

### 云端整体链路

<whiteboard token="ZXv7wbZgahW7kLbCeT7c6Vennhe"/>

### 一次云端任务的时序（待定）

<whiteboard token="QmMLw5MfUhxdezbWQ1jcxyCHn8e"/>

### 用户语音、点击、关闭和超时如何处理

<lark-table rows="8" cols="2" column-widths="211,594">

  <lark-tr>
    <lark-td>
      **用户行为** {align="center"}
    </lark-td>
    <lark-td>
      **云端业务处理** {align="center"}
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      说“好，打开吧”
    </lark-td>
    <lark-td>
      结合当前充电询问理解为同意，再执行前复核
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      说“先别开”
    </lark-td>
    <lark-td>
      结束本次，不开盖；保存拒绝事实，后续频次按会签策略
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      说“为什么要打开？”
    </lark-td>
    <lark-td>
      解释当前建议，不因提问就执行；后续是否保留询问按卡片有效期处理
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      说“导航去另一家充电站”
    </lark-td>
    <lark-td>
      按新诉求处理，不当作同意当前开盖；旧询问失效/保留规则需与Planner确认
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      点击确认
    </lark-td>
    <lark-td>
      若选静态Advisor链路，按原文模拟Query到Planner，不同时在端侧直接执行一遍
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      点击取消、明确关闭或超时
    </lark-td>
    <lark-td>
      不生成本次开盖动作；告知相关业务当前询问结束
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      卡片消失后说“好的”
    </lark-td>
    <lark-td>
      不允许命中已经失效的旧开盖建议；需要新的明确意图或新场景
    </lark-td>
  </lark-tr>
</lark-table>

## 端侧链路

**端侧链路的核心边界：Trigger 只判断并发出业务事件；具体任务的原业务注册、发起并维护卡片。DT不参与端侧拉卡或本地确认。**

1. **任务状态生效：**用户在任务中心开启任务后，接入业务保存真实状态并同步给端侧。Trigger 只有读到“任务有效”才继续。
1. **Trigger 命中：**Trigger 读取本地端状态或 VLM 结果，完成条件、时效、防抖、去重判断；命中后只输出“哪项任务、哪次命中、建议什么、当前场景信息”，不创建卡片。
1. **原业务注册并拉卡：**天气保护等原业务接到事件后，引用已配置的卡片模板，补齐本次正文、TTS、确认/取消按钮、有效期、点击回调和本地按钮表达，再调用即时交互卡展示。卡片注册代码及业务回调由原业务实现。
1. **即时交互卡承接交互：**卡片负责排队、真正展示、TTS、关闭和超时；用户手动点击或通过“可见即可说”命中按钮，均回到同一个原业务回调，不经过 DT。
1. **原业务完成闭环：**收到确认后，原业务重新检查任务状态与最新车况，再调用车控、读取真实车辆状态并更新卡片。拒绝、关闭、超时、条件失效均结束本次，不执行车控。

<whiteboard token="BSkQwHMx1hnU5Kbz17AcwZPAnvf"/>

###  Trigger、任务业务与即时交互卡

<lark-table rows="5" cols="4" column-widths="172,397,341,374">

  <lark-tr>
    <lark-td>
      **业务** {align="center"}
    </lark-td>
    <lark-td>
      **发送方** {align="center"}
    </lark-td>
    <lark-td>
      **接收方** {align="center"}
    </lark-td>
    <lark-td>
      **返回** {align="center"}
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      触发器→天气业务
    </lark-td>
    <lark-td>
      命中的雨/雾/雪子场景，最新车况和识别依据，本次处理关联
    </lark-td>
    <lark-td>
      选定这一条建议和目标动作，不把雨雾雪统一执行
    </lark-td>
    <lark-td>
      是否接收、是否终止；具体实现可与触发器在同一模块
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      天气业务→即时交互卡
    </lark-td>
    <lark-td>
      本地业务类型、这次建议、文案、确认/取消意义、TTS、本地词表、有效条件、结果控件
    </lark-td>
    <lark-td>
      使用统一模板，排队展示，按约定接入语音，反馈展示与生命周期
    </lark-td>
    <lark-td>
      是否真正显示；用户选择；关闭、超时等结果
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      语音/注册方→天气业务
    </lark-td>
    <lark-td>
      匹配的当前按钮；通过原按钮处理链路携带本次关联
    </lark-td>
    <lark-td>
      天气业务核对是否当前询问、是否明确同意、是否已经处理
    </lark-td>
    <lark-td>
      接受、拒绝本次执行或结束；不是直接播“已切换”
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      天气业务→车控及结果卡
    </lark-td>
    <lark-td>
      最新复核通过后的明确动作；之后提供实车状态与结果说明
    </lark-td>
    <lark-td>
      车控完成动作；卡片按业务提供的真实状态更新
    </lark-td>
    <lark-td>
      实际模式/雾灯状态，失败或未知原因
    </lark-td>
  </lark-tr>
</lark-table>

### 端侧卡片的本地语音确认方式

<lark-table rows="7" cols="2" column-widths="145,405">

  <lark-tr>
    <lark-td>
      业务
    </lark-td>
    <lark-td>
      **本次填写示例** {align="center"}
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      卡片文本
    </lark-td>
    <lark-td>
      检测到路面湿滑，要切换到湿滑模式吗？
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      按钮
    </lark-td>
    <lark-td>
      确认；取消。确认只对应切换湿滑模式
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      TTS
    </lark-td>
    <lark-td>
      检测到路面湿滑，要切换到湿滑模式吗？
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      确认表达
    </lark-td>
    <lark-td>
      “确认”；是否增加“开启湿滑模式”等
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      取消表达
    </lark-td>
    <lark-td>
      “取消”；其他表达是否覆盖逐条确认
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      不支持的表达
    </lark-td>
    <lark-td>
      “为什么要开”“先别开，等雨大一点”不能直接当确认
    </lark-td>
  </lark-tr>
</lark-table>

## 触发器配置平台迭代

### 建设背景与目标

现有触发器平台支持部分条件与动作配置，但系统预设任务所需的卡片、语音播报、二次确认及后续动作尚未形成完整配置链路。

扩展现有场景配置平台，统一定义任务关联、触发事件、判断条件、交互方式、执行动作和结果处理。配置人员可通过组合已接入能力创建或调整任务，减少重复开发，降低后续迭代成本。

建设范围覆盖天气路况保护、儿童锁、后视镜加热和充电口盖四项任务所需的公共配置能力。新增信号与动作按统一规格接入能力库；端侧与云端分别管理能力支持范围，未完成接入的能力不可用于任务发布。

### 配置平台改造范围

<whiteboard token="GHyawAyDjhELZLbw6SMc9nMPnbd"/>

https://system-preset-task-cloud-config-demo-v01.wang312.chatgpt.site/

## 任务拆解

#### 天气路况保护（端侧）

在雨、雾、雪等天气或路况下主动保障驾驶安全

<whiteboard token="GVzZw4BvmhRxJHb4dYWcapenn5f"/>

##### 场景

<lark-table rows="9" cols="4" column-widths="118,294,376,347">

  <lark-tr>
    <lark-td>
      原子能力类型
    </lark-td>
    <lark-td>
      原子能力名称ID
    </lark-td>
    <lark-td>
      状态
    </lark-td>
    <lark-td>
      参数
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      触发器①
    </lark-td>
    <lark-td>
      vision.outside.scene → key "天气情况描述"
    </lark-td>
    <lark-td>
      VLM 天气变更：<text bgcolor="light-red">天气情况描述 变为 下雨/下雪/浓雾 之一</text>
    </lark-td>
    <lark-td>
      变更为 ∈ {下雨, 下雪, 浓雾}（防抖 3 次）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      触发器②
    </lark-td>
    <lark-td>
      vision.outside.scene → key "路面情况描述"
    </lark-td>
    <lark-td>
      VLM 路面变更：<text bgcolor="light-red">路面情况描述 变为 湿滑/覆雪结冰 之一</text>
    </lark-td>
    <lark-td>
      变更为 ∈ {路面湿滑, 路面覆雪结冰}（防抖 3 次）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      条件
    </lark-td>
    <lark-td>
      tri_speed / vehicle_control_0004
    </lark-td>
    <lark-td>
      车速 > 30 km/h（行驶中才提醒）
    </lark-td>
    <lark-td>
      速度 > 30
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      条件
    </lark-td>
    <lark-td>
      con_vehDrive
    </lark-td>
    <lark-td>
      驾驶模式 非 雪地模式
    </lark-td>
    <lark-td>
      模式 ≠ 雪地
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      条件
    </lark-td>
    <lark-td>
      con_rearFogLight
    </lark-td>
    <lark-td>
      后雾灯 = 关闭
    </lark-td>
    <lark-td>
      开关 = 关闭
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      动作①
    </lark-td>
    <lark-td>
      act_popup / act_TTS
    </lark-td>
    <lark-td>
      弹主动服务卡片 + TTS 建议
    </lark-td>
    <lark-td>
      <text bgcolor="light-yellow">文案待交互定</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      动作②
    </lark-td>
    <lark-td>
      act_driveMode / act_rearFogLight
    </lark-td>
    <lark-td>
      用户点确认后：切雪地模式 + 开后雾灯
    </lark-td>
    <lark-td>
      模式=雪地；开关=打开
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      反馈
    </lark-td>
    <lark-td>
      tri_popup
    </lark-td>
    <lark-td>
      卡片操作回传
    </lark-td>
    <lark-td>
      点击=正反馈 / 关闭·忽略=负反馈
    </lark-td>
  </lark-tr>
</lark-table>

##### 

##### 数据来源

<lark-table rows="7" cols="4" column-widths="177,313,138,59">

  <lark-tr>
    <lark-td>
      数据项
    </lark-td>
    <lark-td>
      ID / 字段
    </lark-td>
    <lark-td>
      来源类别
    </lark-td>
    <lark-td>
      状态
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      天气（下雨/下雪/浓雾）
    </lark-td>
    <lark-td>
      vision.outside.scene → "天气情况描述"
    </lark-td>
    <lark-td>
      VLM
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      路面（湿滑/覆雪结冰）
    </lark-td>
    <lark-td>
      vision.outside.scene → "路面情况描述"
    </lark-td>
    <lark-td>
      VLM
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      车速
    </lark-td>
    <lark-td>
      tri_speed / vehicle_control_0004
    </lark-td>
    <lark-td>
      端状态
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      驾驶模式
    </lark-td>
    <lark-td>
      con_vehDrive / vehicle_control_0003
    </lark-td>
    <lark-td>
      端状态
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      后雾灯
    </lark-td>
    <lark-td>
      con_rearFogLight / signal_light_0004
    </lark-td>
    <lark-td>
      端状态
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      卡片反馈
    </lark-td>
    <lark-td>
      tri_popup（语音域）
    </lark-td>
    <lark-td>
      端状态·交互
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

##### 

##### 事件清单

<lark-table rows="4" cols="4" column-widths="127,273,121,345">

  <lark-tr>
    <lark-td>
      事件
    </lark-td>
    <lark-td>
      原子能力表ID
    </lark-td>
    <lark-td>
      来源
    </lark-td>
    <lark-td>
      穿越
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      VLM 天气变更
    </lark-td>
    <lark-td>
      vision.outside.scene/"天气情况描述"
    </lark-td>
    <lark-td>
      VLM
    </lark-td>
    <lark-td>
      枚举变为 {下雨,下雪,浓雾}，连续 3 周期一致确认
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      VLM 路面变更
    </lark-td>
    <lark-td>
      vision.outside.scene/"路面情况描述"
    </lark-td>
    <lark-td>
      VLM
    </lark-td>
    <lark-td>
      枚举变为 {湿滑,覆雪结冰}，连续 3 周期一致确认
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      卡片操作反馈
    </lark-td>
    <lark-td>
      tri_popup
    </lark-td>
    <lark-td>
      端状态·交互
    </lark-td>
    <lark-td>
      无 → 点击/关闭/忽略
    </lark-td>
  </lark-tr>
</lark-table>

##### 

##### 信号清单

<lark-table rows="4" cols="4" column-widths="198,181,113,312">

  <lark-tr>
    <lark-td>
      信号
    </lark-td>
    <lark-td>
      SourceID
    </lark-td>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      vision.outside.scene
    </lark-td>
    <lark-td>
      vlm_outside
    </lark-td>
    <lark-td>
      struct
    </lark-td>
    <lark-td>
      "天气情况描述"/"路面情况描述"
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      车速
    </lark-td>
    <lark-td>
      vehicle_control_0004
    </lark-td>
    <lark-td>
      number
    </lark-td>
    <lark-td>
      正式场景条件用
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <text bgcolor="orange">空调风量/温度</text>
    </lark-td>
    <lark-td>
      <text bgcolor="orange">vehicle_control_0013</text>
    </lark-td>
    <lark-td>
      <text bgcolor="orange">level/number</text>
    </lark-td>
    <lark-td>
      <text bgcolor="orange">仅联调期注册</text>
    </lark-td>
  </lark-tr>
</lark-table>

##### 事件变更触发逻辑

<whiteboard token="Mwu9w9osMhfL1bb9vSwcUhjxnpb"/>

##### 

<lark-table rows="4" cols="7" column-widths="72,283,83,190,198,100,195">

  <lark-tr>
    <lark-td>
      子场景
    </lark-td>
    <lark-td>
      进入条件（触发推荐）
    </lark-td>
    <lark-td>
      ~~进入防抖~~
    </lark-td>
    <lark-td>
      推荐动作
    </lark-td>
    <lark-td>
      退出条件（触发关闭询问）
    </lark-td>
    <lark-td>
      ~~退出防抖~~
    </lark-td>
    <lark-td>
      关闭动作
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **雨天**
    </lark-td>
    <lark-td>
      天气情况描述=下雨 **或** 路面情况描述=湿滑
    </lark-td>
    <lark-td>
      ~~连续 3 次~~
    </lark-td>
    <lark-td>
      推荐"是否开启湿滑模式"
    </lark-td>
    <lark-td>
      天气≠下雨 **且** 路面≠湿滑
    </lark-td>
    <lark-td>
      ~~连续 8 次~~
    </lark-td>
    <lark-td>
      询问"是否关闭湿滑模式"
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **雪天**
    </lark-td>
    <lark-td>
      天气情况描述=下雪 **或** 路面情况描述=覆冰
    </lark-td>
    <lark-td>
      ~~连续 3 次~~
    </lark-td>
    <lark-td>
      推荐"是否开启雪地模式"
    </lark-td>
    <lark-td>
      天气≠下雪 **且** 路面≠覆冰
    </lark-td>
    <lark-td>
      ~~连续 8 次~~
    </lark-td>
    <lark-td>
      询问"是否关闭雪地模式"
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **雾天**
    </lark-td>
    <lark-td>
      天气情况描述=浓雾
    </lark-td>
    <lark-td>
      ~~连续 2 次~~
    </lark-td>
    <lark-td>
      推荐"是否开启后雾灯"
    </lark-td>
    <lark-td>
      天气≠浓雾
    </lark-td>
    <lark-td>
      ~~连续 8 次~~
    </lark-td>
    <lark-td>
      询问"是否关闭后雾灯"
    </lark-td>
  </lark-tr>
</lark-table>

##### 

##### 模拟数据

<lark-table rows="5" cols="3" column-widths="258,276,326">

  <lark-tr>
    <lark-td>
      正式场景
    </lark-td>
    <lark-td>
      替换
    </lark-td>
    <lark-td>
      原子能力表 ID
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      "天气情况描述"变更为 下雨/下雪/浓雾
    </lark-td>
    <lark-td>
      **空调风量 变更为 ≥3 档**
    </lark-td>
    <lark-td>
      `tri_cabinAC_fan` / vehicle_control_0013
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      "路面情况描述"变更为 湿滑/覆雪结冰
    </lark-td>
    <lark-td>
      **空调设定温度 变更为 >26°**
    </lark-td>
    <lark-td>
      `tri_cabinAC_temp` / vehicle_control_0013
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      条件：车速 > 30
    </lark-td>
    <lark-td>
      **联调期摘除该条件**，正式配置加回
    </lark-td>
    <lark-td>
      —
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      动作：卡片 + TTS
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      `act_popup` / `act_TTS`
    </lark-td>
  </lark-tr>
</lark-table>

### 后排儿童/宠物识别后开启儿童锁

行车时后排存在儿童或宠物且儿童锁未开启，降低误开车门风险

行车时如果发现车内有儿童且童锁未开启，就通过语音提醒用户打开童锁（主动服务卡片）

<whiteboard token="HUBJwgUk3hpFdsbz1UYcqxTvngj"/>

<lark-table rows="10" cols="4" column-widths="133,362,217,100">

  <lark-tr>
    <lark-td>
      原子能力类型
    </lark-td>
    <lark-td>
      原子能力名称
    </lark-td>
    <lark-td>
      触发条件
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      触发器
    </lark-td>
    <lark-td>
      档位（tri_gear）
    </lark-td>
    <lark-td>
      切换类型=切入
      档位=D档
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      条件
    </lark-td>
    <lark-td>
      特殊成员类型（con_occGroup）
    </lark-td>
    <lark-td>
      成员类型=仅儿童/老人和儿童
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      条件
    </lark-td>
    <lark-td>
      儿童锁
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      动作
    </lark-td>
    <lark-td>
      主动服务卡片
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      动作
    </lark-td>
    <lark-td>
      TTS播报
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      动作
    </lark-td>
    <lark-td>
      关闭语音
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      触发器
    </lark-td>
    <lark-td>
      用户正反馈/用户负反馈
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      动作
    </lark-td>
    <lark-td>
      儿童锁
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      建议
    </lark-td>
    <lark-td>
      出行advisor：你的目标之一是保障车辆行驶过程中后排乘员的安全。车辆已切入D挡，后排检测到儿童或宠物，且后排儿童锁当前未开启，存在误开车门的风险。需要你询问用户是否开启后排儿童锁；只有用户明确确认后，才调用开启儿童锁工具，用户取消或未明确确认时不执行。策略：语音确认
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

##### 事件清单

<lark-table rows="8" cols="5" column-widths="200,113,162,225,200">

  <lark-tr>
    <lark-td>
      事件
    </lark-td>
    <lark-td>
      来源
    </lark-td>
    <lark-td>
      原子能力表ID
    </lark-td>
    <lark-td>
      变更/穿越条件
    </lark-td>
    <lark-td>
      命中后的下一步
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      档位切入D
    </lark-td>
    <lark-td>
      端状态
    </lark-td>
    <lark-td>
      `tri_gear`
    </lark-td>
    <lark-td>
      非D→D；仅方案B使用
    </lark-td>
    <lark-td>
      读取成员类型和儿童锁状态
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      非P状态成立
    </lark-td>
    <lark-td>
      端状态
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      `gear != P`；仅方案A使用
    </lark-td>
    <lark-td>
      持续判断成员类型
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      儿童成员出现
    </lark-td>
    <lark-td>
      OMS/SLS
    </lark-td>
    <lark-td>
      `con_occGroup`
    </lark-td>
    <lark-td>
      无目标成员→儿童类枚举
    </lark-td>
    <lark-td>
      判断儿童锁状态
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      宠物出现
    </lark-td>
    <lark-td>
      VLM
    </lark-td>
    <lark-td>
      VLM字段（猫和狗）
    </lark-td>
    <lark-td>
      NONE/UNKNOWN→CAT/DOG
    </lark-td>
    <lark-td>
      判断儿童锁状态
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      儿童锁状态变化
    </lark-td>
    <lark-td>
      端状态
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      OFF→ON或ON→OFF
    </lark-td>
    <lark-td>
      去重或判断用户反向操作
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户正反馈
    </lark-td>
    <lark-td>
      VUI/语音
    </lark-td>
    <lark-td>
      反馈
    </lark-td>
    <lark-td>
      无→确认
    </lark-td>
    <lark-td>
      执行前复核
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户负反馈
    </lark-td>
    <lark-td>
      VUI/语音
    </lark-td>
    <lark-td>
      反馈
    </lark-td>
    <lark-td>
      无→拒绝/关闭/忽略/超时
    </lark-td>
    <lark-td>
      不执行并进入冷却
    </lark-td>
  </lark-tr>
</lark-table>

##### 信号清单

<lark-table rows="8" cols="3" column-widths="200,200,200">

  <lark-tr>
    <lark-td>
      信号
    </lark-td>
    <lark-td>
      SourceID
    </lark-td>
    <lark-td>
      类型
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      档位
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      event+enum
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      特殊成员类型
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      enum
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      宠物识别
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      enum
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      左/右儿童锁
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      enum/bool
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      后排车门
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      enum
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      卡片反馈
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      event
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      任务有效状态
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      bool
    </lark-td>
  </lark-tr>
</lark-table>

##### 

#####  进入与退出逻辑

<lark-table rows="7" cols="3" column-widths="200,426,349">

  <lark-tr>
    <lark-td>
      阶段
    </lark-td>
    <lark-td>
      条件
    </lark-td>
    <lark-td>
      系统动作
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      进入候选
    </lark-td>
    <lark-td>
      任务有效 AND（`gear!=P`或切入D）AND 儿童/宠物目标成立 AND 儿童锁关闭
    </lark-td>
    <lark-td>
      进入静默执行或卡片确认分支
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户正反馈
    </lark-td>
    <lark-td>
      仅卡片方案；确认事件仍在有效期
    </lark-td>
    <lark-td>
      执行前复核后开启儿童锁
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户负反馈
    </lark-td>
    <lark-td>
      仅卡片方案；拒绝/关闭/忽略/超时
    </lark-td>
    <lark-td>
      关闭交互，不执行并冷却
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      复核退出
    </lark-td>
    <lark-td>
      档位变P、成员不再存在、车门/锁状态不安全、任务关闭
    </lark-td>
    <lark-td>
      终止本次，不执行
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      动作完成
    </lark-td>
    <lark-td>
      车控成功
    </lark-td>
    <lark-td>
      本次事件结束，任务回到Waiting
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      功能退出
    </lark-td>
    <lark-td>
      本任务不自动关闭儿童锁
    </lark-td>
    <lark-td>
      儿童锁后续关闭由用户或车辆既有策略负责
    </lark-td>
  </lark-tr>
</lark-table>

##### 

### 识别充电设备后打开充电口盖

车辆准备充电时识别后排/车外充电设备，减少手动开启充电口盖操作

<whiteboard token="TOJUwVpneh4x1XbIPQBcdhmincd"/>

#####  数据来源

<lark-table rows="11" cols="3" column-widths="200,699,178">

  <lark-tr>
    <lark-td>
      数据项
    </lark-td>
    <lark-td>
      ID/字段
    </lark-td>
    <lark-td>
      来源类别
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      任务有效状态
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      任务中心
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      AI主动服务总开关
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      端状态/主动服务系统
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      档位切入P
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      端状态·事件
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      SOC
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      端状态
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      充电口盖状态
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      端状态
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      主动推荐Query
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      Trigger
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      DT推理结果
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      DT + 端侧上行
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户确认
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      VUI/主动推荐
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      车控结果
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      赛力斯车控
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      建议
    </lark-td>
    <lark-td>
      出行advisor：你的目标之一是帮助用户顺畅完成车辆充电准备。车辆当前处于P挡，电量满足任务预设条件，且充电口盖处于关闭状态。需要你先调用VQA判断车辆画面中是否发现充电设备；只有明确发现充电设备时，才询问用户是否打开充电口盖。未发现设备、无法判断或识别失败时，不询问用户，也不执行开盖。用户明确确认后，调用打开充电口盖工具；用户取消或未明确确认时不执行。策略：语音确认
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

##### 

##### 事件清单

<lark-table rows="9" cols="5" column-widths="200,159,200,298,200">

  <lark-tr>
    <lark-td>
      事件
    </lark-td>
    <lark-td>
      原子能力表ID
    </lark-td>
    <lark-td>
      来源
    </lark-td>
    <lark-td>
      变更/穿越条件
    </lark-td>
    <lark-td>
      命中后的下一步
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      档位切入P
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      端状态·事件
    </lark-td>
    <lark-td>
      目标档位变为P；来源档位D-08待定
    </lark-td>
    <lark-td>
      判断任务、AI开关、SOC和口盖
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      SOC阈值满足
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      端状态
    </lark-td>
    <lark-td>
      `SOC<=20%`
    </lark-td>
    <lark-td>
      作为P档事件的条件，不单独重复推荐
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      主动推荐创建
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      Trigger
    </lark-td>
    <lark-td>
      前置条件全部满足且event_id未消费
    </lark-td>
    <lark-td>
      发送Query并调用DT
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      DT结果返回
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      DT/端侧
    </lark-td>
    <lark-td>
      FOUND/NOT_FOUND/UNKNOWN/ERROR
    </lark-td>
    <lark-td>
      FOUND进入授权/执行，其余结束
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户正反馈
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      VUI/语音
    </lark-td>
    <lark-td>
      无→确认
    </lark-td>
    <lark-td>
      执行前复核
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户负反馈
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      VUI/语音
    </lark-td>
    <lark-td>
      无→拒绝/关闭/忽略/超时
    </lark-td>
    <lark-td>
      不执行并频控
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      口盖状态变化
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      端状态
    </lark-td>
    <lark-td>
      关闭→打开
    </lark-td>
    <lark-td>
      去重或确认车控成功
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      车控结果
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      赛力斯车控
    </lark-td>
    <lark-td>
      SUCCESS/FAILED/TIMEOUT
    </lark-td>
    <lark-td>
      状态回读并收口事件
    </lark-td>
  </lark-tr>
</lark-table>

##### 

#####  信号清单

<lark-table rows="9" cols="3" column-widths="200,159,200">

  <lark-tr>
    <lark-td>
      信号
    </lark-td>
    <lark-td>
      SourceID
    </lark-td>
    <lark-td>
      类型
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      AI主动服务总开关
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      bool
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      档位
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      event+enum
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      SOC
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      number
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      充电口盖状态
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      enum
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      DT推理结果
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      struct/event
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户交互结果
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      event
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      车控结果
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      struct/event
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      任务有效状态
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      bool
    </lark-td>
  </lark-tr>
</lark-table>

##### 

##### 进入与退出逻辑

<lark-table rows="7" cols="3" column-widths="200,516,263">

  <lark-tr>
    <lark-td>
      阶段
    </lark-td>
    <lark-td>
      条件
    </lark-td>
    <lark-td>
      系统动作
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      进入候选
    </lark-td>
    <lark-td>
      任务有效 AND AI总开关开启 AND 目标切入P AND SOC<=20 AND 口盖关闭
    </lark-td>
    <lark-td>
      生成一次带event_id的主动推荐Query
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      模型判断
    </lark-td>
    <lark-td>
      主动推荐调用DT，端侧上行并获得当前event_id结果
    </lark-td>
    <lark-td>
      FOUND继续；其他结果结束
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户授权
    </lark-td>
    <lark-td>
      按D-09在DT前或DT后获得确认
    </lark-td>
    <lark-td>
      未授权、拒绝或超时均不执行
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      执行复核退出
    </lark-td>
    <lark-td>
      任务/AI开关关闭、切出P、车辆未停稳、口盖已开、DT结果过期
    </lark-td>
    <lark-td>
      终止本次，不执行
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      动作完成
    </lark-td>
    <lark-td>
      口盖打开成功或状态回读已开
    </lark-td>
    <lark-td>
      结束事件并进入频控
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      功能退出
    </lark-td>
    <lark-td>
      本任务不自动关闭充电口盖
    </lark-td>
    <lark-td>
      后续关闭由用户或既有车辆策略负责
    </lark-td>
  </lark-tr>
</lark-table>

### 后视镜自动加热

后视镜受雨雾影响时主动开启加热，改善视野

<lark-table rows="4" cols="5" column-widths="155,204,150,201,350">

  <lark-tr>
    <lark-td>
      **场景名称**
    </lark-td>
    <lark-td>
      **典型场景**
    </lark-td>
    <lark-td>
      **是否开启后视镜加热**
    </lark-td>
    <lark-td>
      **简要理由**
    </lark-td>
    <lark-td>
      **后视镜加热开启策略**
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      中低速场景-车速小于70km/h且非P档
    </lark-td>
    <lark-td>
      中低速行驶途中下雨时，镜面附着大量小雨滴
    </lark-td>
    <lark-td>
      建议开启
    </lark-td>
    <lark-td>
      低速气流弱，风无法吹走水珠，后视镜加热蒸发水珠，改善观察视野；
    </lark-td>
    <lark-td>
      满足条件后一直开启
      - 开启条件：雨量传感器识别到下雨、车速小于70km/h、非P档
			- 退出条件：前提条件不满足
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      洗车模式-退出传送带洗车
    </lark-td>
    <lark-td>
      在使用自动洗车装置洗车结束后，后视镜上的水滴无法快速取出，有存留水滴
    </lark-td>
    <lark-td>
      建议开启
    </lark-td>
    <lark-td>
      刚刚在自动洗车机完成洗车后，后视镜上存在水滴，可通过后视镜加热蒸发水滴
    </lark-td>
    <lark-td>
      满足条件后开启一次
      - 开启条件：识别到传送带洗车模式退出
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      湿气重天气
    </lark-td>
    <lark-td>
      <text color="red">刚出地库：</text>南方夏天雨后立刻出太阳，地库内部温度偏低，驶出车库后湿热空气让后视镜快速起雾
    </lark-td>
    <lark-td>
      建议开启
    </lark-td>
    <lark-td>
      内外温差大产生凝雾，低速下气流微弱吹不掉雾气
    </lark-td>
    <lark-td>
      满足条件后开启一次
      - 空气湿度大于60% 且 车辆行驶温度差值大于5°（时间阈值TBD）
    </lark-td>
  </lark-tr>
</lark-table>

<whiteboard token="BkYzwfZbEhpj3XbF2PvcUycsnof"/>

##### 数据来源

<lark-table rows="11" cols="4" column-widths="200,417,200,200">

  <lark-tr>
    <lark-td>
      数据项
    </lark-td>
    <lark-td>
      ID/字段
    </lark-td>
    <lark-td>
      来源类别
    </lark-td>
    <lark-td>
      当前状态
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      任务有效状态
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      任务中心
    </lark-td>
    <lark-td>
      ID待确认
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      雨量状态
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      端状态/传感器
    </lark-td>
    <lark-td>
      ID和枚举待确认
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      车速
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      端状态
    </lark-td>
    <lark-td>
      已有可参考ID
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      档位
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      端状态
    </lark-td>
    <lark-td>
      ID待确认
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      传送带洗车退出
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      端状态·事件
    </lark-td>
    <lark-td>
      ID、event_id、重放规则待确认
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      环境湿度
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      端状态/传感器
    </lark-td>
    <lark-td>
      ID待确认
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      温度序列/温差
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      端状态/传感器
    </lark-td>
    <lark-td>
      字段、采样频率和窗口待确认
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      后视镜加热状态
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      端状态
    </lark-td>
    <lark-td>
      ID待确认
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      后视镜加热车控
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      车控
    </lark-td>
    <lark-td>
      动作参数和错误码待确认
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      建议
    </lark-td>
    <lark-td>
      舒适advisor：你的目标之一是帮助用户保持清晰、舒适的驾驶视野。Trigger已确认当前满足后视镜加热任务的预设条件，且后视镜加热当前未开启，可能影响用户观察后方路况。需要你询问用户是否开启后视镜加热；只有用户明确确认后，才调用后视镜加热工具，用户取消或未明确确认时不执行。策略：语音确认
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

##### 

##### 事件清单

<lark-table rows="8" cols="5" column-widths="200,200,200,200,200">

  <lark-tr>
    <lark-td>
      事件
    </lark-td>
    <lark-td>
      原子能力表ID
    </lark-td>
    <lark-td>
      来源
    </lark-td>
    <lark-td>
      变更/穿越条件
    </lark-td>
    <lark-td>
      命中后的下一步
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      雨天候选
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      端状态
    </lark-td>
    <lark-td>
      非下雨→下雨，或下雨状态满足
    </lark-td>
    <lark-td>
      判断车速、档位、加热状态
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      车速穿越70
    </lark-td>
    <lark-td>
      `tri_speed` / `vehicle_control_0004`
    </lark-td>
    <lark-td>
      端状态
    </lark-td>
    <lark-td>
      `<70`或`>=70`边界变化
    </lark-td>
    <lark-td>
      进入或退出场景一候选
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      洗车退出
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      端状态·事件
    </lark-td>
    <lark-td>
      洗车模式开启→退出，event_id未消费
    </lark-td>
    <lark-td>
      开启加热并启动15分钟计时
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      高湿候选
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      端状态
    </lark-td>
    <lark-td>
      湿度穿越`>60%`
    </lark-td>
    <lark-td>
      计算温差窗口
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      温差候选
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      端状态
    </lark-td>
    <lark-td>
      指定窗口内温差穿越`>5℃`
    </lark-td>
    <lark-td>
      复核后执行加热
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      加热状态变化
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      端状态
    </lark-td>
    <lark-td>
      OFF→ON或ON→OFF
    </lark-td>
    <lark-td>
      去重、完成或退出
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      车控结果
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      车控
    </lark-td>
    <lark-td>
      SUCCESS/FAILED/TIMEOUT
    </lark-td>
    <lark-td>
      记录并状态回读
    </lark-td>
  </lark-tr>
</lark-table>

##### 

##### 信号清单

<lark-table rows="9" cols="4" column-widths="200,200,200,200">

  <lark-tr>
    <lark-td>
      信号
    </lark-td>
    <lark-td>
      SourceID
    </lark-td>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      值域/说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      雨量状态
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      enum
    </lark-td>
    <lark-td>
      RAIN/NO_RAIN/UNKNOWN
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      车速
    </lark-td>
    <lark-td>
      `vehicle_control_0004`
    </lark-td>
    <lark-td>
      number
    </lark-td>
    <lark-td>
      km/h；场景一`<70`
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      档位
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      enum
    </lark-td>
    <lark-td>
      P/R/N/D/UNKNOWN
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      洗车模式/退出事件
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      enum+event
    </lark-td>
    <lark-td>
      ON/OFF/EXIT；必须带event_id
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      环境湿度
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      number
    </lark-td>
    <lark-td>
      百分比；场景三`>60`
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      温度序列
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      number+timestamp
    </lark-td>
    <lark-td>
      温差`>5℃`；计算窗口D-07待定
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      后视镜加热状态
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      enum/bool
    </lark-td>
    <lark-td>
      ON/OFF/UNKNOWN
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      任务有效状态
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      bool
    </lark-td>
    <lark-td>
      true/false/unknown
    </lark-td>
  </lark-tr>
</lark-table>

##### 

##### 进入与退出逻辑

<lark-table rows="5" cols="5" column-widths="200,200,200,200,200">

  <lark-tr>
    <lark-td>
      子场景
    </lark-td>
    <lark-td>
      进入条件
    </lark-td>
    <lark-td>
      进入动作
    </lark-td>
    <lark-td>
      退出条件
    </lark-td>
    <lark-td>
      退出动作
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      雨天中低速
    </lark-td>
    <lark-td>
      任务有效 AND 下雨 AND 车速<70 AND 非P AND 加热关闭
    </lark-td>
    <lark-td>
      静默开启加热
    </lark-td>
    <lark-td>
      雨停、车速≥70或切P后的处理D-07待定
    </lark-td>
    <lark-td>
      立即关闭或完成固定周期，待确认
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      传送带洗车退出
    </lark-td>
    <lark-td>
      任务有效 AND 收到未消费的洗车退出事件 AND 加热关闭
    </lark-td>
    <lark-td>
      静默开启加热
    </lark-td>
    <lark-td>
      端侧计时15分钟完成
    </lark-td>
    <lark-td>
      关闭加热
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      高湿温差
    </lark-td>
    <lark-td>
      任务有效 AND 湿度>60% AND 窗口内温差>5℃ AND 加热关闭
    </lark-td>
    <lark-td>
      静默开启加热
    </lark-td>
    <lark-td>
      湿度/温差恢复或最长运行时间D-07待定
    </lark-td>
    <lark-td>
      待确认
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      通用复核退出
    </lark-td>
    <lark-td>
      执行前任务关闭、加热已开、信号未知或关键条件变化
    </lark-td>
    <lark-td>
      不执行
    </lark-td>
    <lark-td>
      —
    </lark-td>
    <lark-td>
      记录具体原因
    </lark-td>
  </lark-tr>
</lark-table>

主动推荐-即时交互卡的逻辑

<text color="red">刚出地库：判断是否需要做</text>
