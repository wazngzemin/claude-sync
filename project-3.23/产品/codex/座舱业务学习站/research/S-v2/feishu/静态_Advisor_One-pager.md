# 静态 Advisor One-pager（飞书原文转存；更新时间 2026-09-18）

来源链接：https://bytedance.larkoffice.com/wiki/Hzq8wR285io8qxkFYGscs5EAnMg

<quote-container>

**模块概览：**车况或视觉信号命中已配置场景时，静态 Advisor 主动生成即时建议，由车端展示并按需回流对话执行。
</quote-container>

<text color="gray">更新时间：2026-09-10 ｜ 范围：saic-dna / seres · 静态推荐</text>

## 模块定位

它位于车辆信号与主对话之间：aidv_trigger 识别机会并请求推理，Extour 生成建议，AIDV 校验下发时机并承接回流，主链路 Planner 负责规划、调工具与播报。

适合时机可由已上报车况 / 视觉结果描述、需要即时建议的场景。固定文案推荐、第三方业务回调属于触发器的其他动作；长期目标的创建、维护与生命周期由动态 Advisor / Goal 承担。

<lark-table rows="3" cols="3" header-row="true" column-widths="125,275,420">

  <lark-tr>
    <lark-td>
      渠道
    </lark-td>
    <lark-td>
      承接方式
    </lark-td>
    <lark-td>
      用户可见结果
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **saic-dna**
    </lark-td>
    <lark-td>
      复用主对话的规划、执行与播报。
    </lark-td>
    <lark-td>
      对话播报或工具执行结果。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **seres**
    </lark-td>
    <lark-td>
      增加 AI Bar 交互与结果回传。
    </lark-td>
    <lark-td>
      建议展示、确认 / 播放；执行后状态更新待联调。
    </lark-td>
  </lark-tr>
</lark-table>

## 使用与触发

<quote-container>

这部分和触发器的关系比较紧密，更详细的信息可以参考 <mention-doc token="Xk6xwM3l8iK4oCkXIMlcIo4hnFc" type="wiki">触发器 OnePage</mention-doc>
</quote-container>

配置场景四要素：

<lark-table rows="5" cols="3" header-row="true" column-widths="100,170,550">

  <lark-tr>
    <lark-td>
      要素
    </lark-td>
    <lark-td>
      含义
    </lark-td>
    <lark-td>
      接入时写清
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **条件**
    </lark-td>
    <lark-td>
      什么情况算命中。
    </lark-td>
    <lark-td>
      选择渠道支持的信号、字段、运算符与比较值，写清条件和条件组的且 / 或关系；视觉结果需先成为受支持信号。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **动作**
    </lark-td>
    <lark-td>
      命中后请求什么。
    </lark-td>
    <lark-td>
      选择所需 Advisor 类型，填写有效 `attention`（或确认上游已补齐）说明本次机会，具体建议由 Extour 生成。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **执行策略**
    </lark-td>
    <lark-td>
      控制重复执行。
    </lark-td>
    <lark-td>
      配置总次数、单日次数、单次上电次数和执行间隔，按同渠道 / 车辆 / 场景限频；命中后仍可能被策略过滤。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **生效范围**
    </lark-td>
    <lark-td>
      哪些车可进入候选。
    </lark-td>
    <lark-td>
      先限定测试车辆 ID，核对渠道、车型、客户端版本与生效状态；创建场景记录不等于目标车已能匹配。
    </lark-td>
  </lark-tr>
</lark-table>

**当前值与变更：**当前值条件用本轮上报和 Context 补齐的值判断；“有变更”是新值不等于旧值，“变更为”还要求新值等于目标。仅支持对应运算符的信号可配置：重复上报“占用”不等于再次“变更为占用”，首报缺旧值应另测；这些判断不分析连续趋势。

<lark-table rows="5" cols="3" header-row="true" column-widths="100,341,379">

  <lark-tr>
    <lark-td>
      入口
    </lark-td>
    <lark-td>
      如何使用 / 触发
    </lark-td>
    <lark-td>
      前提与结果
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **车辆上报**
    </lark-td>
    <lark-td>
      车端 POST `/aidv/v1/vehicle/resource`；AIDV 将车况 / 视觉信号送入 `TriggerRun`，触发器匹配生效场景。
    </lark-td>
    <lark-td>
      生效范围、规则与频控通过，且场景配置 Advisor 动作，才请求 Extour `/advisor/infer`；无建议正常静默。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **建议下发**
    </lark-td>
    <lark-td>
      Extour POST `/aidv/v1/recommend`，携 `source=static_advisor`、非空建议、`device_id` 和用户身份。
    </lark-td>
    <lark-td>
      设备当前登录账号需与请求一致；有上一轮时等待会话 / TTS 结束，被新请求替换则放弃。通过后推送 `recommend_id`。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **saic-dna
      ****车端回流**
    </lark-td>
    <lark-td>
      车端将 `vehicle_recommend_id` 随 AgentStream 请求回传，Flow 恢复上下文后继续 Planner。
    </lark-td>
    <lark-td>
      缓存有效期 1 分钟；回主对话后按规划播报或执行工具。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **seres
      ****展示与回流**
    </lark-td>
    <lark-td>
      在 saic-dna 的基础上，还需携原始 `encrypted_doubao_uid`；车端按 `ui_control / ui_payload` 展示、确认或播放，需要主链路时按上述方式回流。
    </lark-td>
    <lark-td>
      服务端已透传展示字段，UI 策略待联调；回流上下文有效且有成功车控 ACK 时才上报 `/ai_bar`。
    </lark-td>
  </lark-tr>
</lark-table>

<quote-container>

**当前车内温度高于阈值”的舒适场景：**

温度条件与频控通过后，Extour 可生成降温建议；seres 可展示确认提示，用户确认并回流后再执行车控。

这里仅判断当前高温，不推断持续升温；阈值和 UI 行为仍以配置和实际下发为准。
</quote-container>

**最小接入验证顺序：**

1. 限定单渠道、单测试车辆，选已上报信号和一种 Advisor 动作；保存后确认范围、规则与执行策略。
1. 依次验证不命中、命中、相同值重复上报、间隔外再命中，核对候选、规则结果与频控；变更条件另测首次上报和旧值缺失。
1. 继续核对推理受理及最终有无建议、AIDV 准入 / 推送、端上实际展示；需要执行时查回流、ACK 和 seres 状态更新。两渠道分别通过，再逐步扩大范围。

## Advice 下发核心链路

为了支持豆包对话记录的要求，我们需要把 Advisor 下发的信息通过 `/recommend` 链路传给客户端，有客户端发起一轮请求，交给 Planner 进行推理。建议下发的链路参考下图：

<whiteboard token="DaaLwQXZEhV4YUbgCRIcrVYWnff"/>

## 已有能力

### 两渠道共同前置阶段｜状态上报与场景触发

两渠道的静态场景都从端状态上报进入触发器，规则命中且频控通过后才请求 Advisor 推理。端状态的接入由 AIDV `/aidv/v1/vehicle/resource` 承接，经 `Report → SyncVehicleResourceToTrigger` 转发到 `TriggerRun`。

<whiteboard token="G8frwI0zhhuZqVb3wB5cVKZ0npe"/>

### 详细链路｜建议、车控执行与 UI 展示

两张渠道图均从上方共同前置阶段的“有建议”出口进入。上汽与赛力斯共享建议提交、回流规划和按需执行的主干；赛力斯额外包含 AI Bar 结果回传与二次 UI 更新。图中车控是本轮规划选中的示例分支，实际工具按渠道注册选择。

<whiteboard token="ZHQdwANpSh5ddhbUB3FcV93Yndf"/>

<lark-table rows="6" cols="3" header-row="true" column-widths="125,95,465">

  <lark-tr>
    <lark-td>
      能力
    </lark-td>
    <lark-td>
      状态
    </lark-td>
    <lark-td>
      当前边界
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **场景触发**
    </lark-td>
    <lark-td>
      <text color="green">已接入</text>
    </lark-td>
    <lark-td>
      车辆状态匹配规则并触发静态推理；机会触发不等于可以下发。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **建议下发**
    </lark-td>
    <lark-td>
      <text color="green">已接入</text>
    </lark-td>
    <lark-td>
      完成登录态、会话和播报时机检查后下发；端侧展示待验证。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **saic-dna 回流**
    </lark-td>
    <lark-td>
      <text color="green">已接入</text>
    </lark-td>
    <lark-td>
      建议回到 Planner，复用工具执行与播报；线上版本和效果待确认。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **seres 展示**
    </lark-td>
    <lark-td>
      <text color="orange">联调中</text>
    </lark-td>
    <lark-td>
      展示、确认 / 播放数据可下发，UI 与实际交互待验收。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **seres 结果回传**
    </lark-td>
    <lark-td>
      <text color="orange">联调中</text>
    </lark-td>
    <lark-td>
      静态推荐回流上下文有效且车控有成功 ACK 时，按工具回传实际结果；全部失败、无 ACK 及非车控未覆盖。
    </lark-td>
  </lark-tr>
</lark-table>

### 两渠道的承接差异

<whiteboard token="Y7tkw9ICchfgZ1bMJLcczPoJnGd"/>

展示信息和执行输入并行传递；端侧按 UI 信息展示、确认或播放，需要主链路处理时再回流 Planner，具体策略待端云对齐。

### seres 执行后状态回传

<whiteboard token="TsNawvfaRhpOT4by9LsctBZ8ncc"/>

按 Extour 协议，执行方调用 `/advisor/ai_bar`；Extour 用原建议和真实结果生成状态，再经 `/aidv/v1/recommend` 二次交付，不重跑完整判断。

协议中 `/ai_bar` 的 `status=0` 表示状态已生成并交付，端侧展示仍需验收；`data.recommend_log_id` 用于追踪。失败、部分执行或未执行应如实描述。
