# 动态 Advisor One-pager（飞书原文转存；更新时间 2026-09-18）

来源链接：https://bytedance.larkoffice.com/wiki/VvAMwHbxei6BSEkzoxjc9AbynNh

<quote-container>

**模块概览：**上汽动态 Advisor 把用户在对话中提出的未来目标交给 Extour 持续管理，并在目标触发后把建议带回主对话。
</quote-container>

<text color="gray">更新时间：2026-09-08 ｜ 范围：saic-dna · Goal 管理与生命周期</text>

## 1. 模块定位

在 AIDV 中，Goal 位于主对话与 Extour 目标引擎之间：Planner 选择长时任务工具创建或取消目标；Extour 维护目标、判断触发条件；AIDV 处理回调并经 Frontier 下发车端。建议的后续规划与执行仍由主链路承接。

**对象关系：**`Goal` 是持续管理的目标，`trigger` 是其中一次触发通知；每次新触发被受理后生成独立 `recommend_id`。循环 Goal 可多次触发；某条推荐进入 Planner，不代表整个 Goal 完成。

**适用场景：**短时提醒、行程到点提醒、有限周期重复提醒。Goal List r39 收录了“距目的地 1 公里提醒”“连续 10 天每天 19 点提醒”的创建记录，触发与执行仍需联调；具体条件及周期表达由 Extour 确认，不承诺任意复杂条件或车控必然执行成功。静态 Advisor、静态服务观察周期与 seres Task Service 另文说明。

## 2. 使用与触发

自然语言请求经 `AgentStream` 进入主对话；以下 HTTP 接口省略 `/aidv/v1` 前缀。

<lark-table rows="6" cols="3" header-row="true" column-widths="110,337,381">

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
      **对话创建**
    </lark-td>
    <lark-td>
      用户提出定时或条件目标；若 Planner 选中长时任务工具，则进入创建分支。
    </lark-td>
    <lark-td>
      以 `type=add_goal` 与 `goal_content` 作为工具入参，AIDV 调 `create_goal`；结果等回调。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **对话取消**
    </lark-td>
    <lark-td>
      用户说明取消哪个目标；若 Planner 选中长时任务工具，则按当前 Goal 列表定位。
    </lark-td>
    <lark-td>
      工具入参 `type=delete_goal`、`goal_id="g-<id>"`；AIDV 关闭目标并通知车端 done。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **车端管理**
    </lark-td>
    <lark-td>
      查列表 / 详情，或选择目标后切换循环开关、关闭。
    </lark-td>
    <lark-td>
      `POST /goal-list`、`GET /goal/detail`、`POST /goal/operate`；详情和操作携数值 `goal_id`。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **Extour 回调**
    </lark-td>
    <lark-td>
      创建成功 / 失败，或目标条件满足时调用 AIDV。
    </lark-td>
    <lark-td>
      `POST /goal/lifecycle_callback` 接收三类事件：成功卡，失败消息与推荐消息，分别处理，见第 4 节。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **建议回流**
    </lark-td>
    <lark-td>
      车端收到推荐后，按交互策略再次发起主对话。
    </lark-td>
    <lark-td>
      携 `vehicle_recommend_id`；主链路读取任务关联缓存，再进入 Planner。
    </lark-td>
  </lark-tr>
</lark-table>

**调用前提：**创建工具只给 `type/goal_content`；AIDV 从主对话补 query、可用 history 及车辆身份。上汽请求使用 `channel=saic-dna`，保持车辆、设备、用户身份一致并补齐应用 / 车型公参；回调校验设备当前登录账号。`UpdateGoal` 尚无车端业务入口。

**链路示例：**用户说“1 分钟后提醒我喝水”，若 Planner 选择 `add_goal`，先提交创建并等待 `create_success` 下发创建卡；Extour 到时发 `trigger`，建议经车端携推荐 ID 回流后由 Planner 播报。本例说明调用顺序，未作为线上验收结果。

## 3. 核心链路

**循环开关与关闭：**`switch` 将循环目标设为 `on/off`，AIDV 返回开关结果；`close`（含对话 `delete_goal`）调用关闭目标，并另发端侧 done。重新开启后的补触发、关闭生效时点及在途推荐如何处理，需与 Extour 联调确认。

**图 1｜目标创建与管理**

<whiteboard token="JC04wD70QhKYL8b0sQlckoaQnff"/>

创建请求被受理的当轮不播报成功；后续 `create_success` 直接发创建卡，`create_failed` 与 `trigger` 走推荐消息，等待车端带推荐 ID 再次上行。

有效 Goal 进入 Planner 上下文；对话后以 `/planner_event/qa_finish` 异步同步问答和历史，拒识或缺车辆账号时跳过。QA 同步、消费与修改独立观测。

## 已有能力

以下“已接入”表示本分支已有调用链；当前上汽使用 Extour Goal，有效目标列表注入 Planner 的 `goal_list`。

<lark-table rows="7" cols="3" header-row="true" column-widths="125,95,465">

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
      **创建目标**
    </lark-td>
    <lark-td>
      <text color="green">已接入</text>
    </lark-td>
    <lark-td>
      `add_goal` 异步创建；`creating` 仅受理，创建结果等回调。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **目标列表**
    </lark-td>
    <lark-td>
      <text color="green">已接入</text>
    </lark-td>
    <lark-td>
      `/goal-list` 查有效目标，返回状态、卡片与操作信息，不含进度 / 清单。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **目标详情**
    </lark-td>
    <lark-td>
      <text color="green">已接入</text>
    </lark-td>
    <lark-td>
      `/goal/detail` 查标题、详情与状态；`check_list` 为 JSON 字符串。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **开关 / 关闭**
    </lark-td>
    <lark-td>
      <text color="green">已接入</text>
    </lark-td>
    <lark-td>
      `/goal/operate` 支持循环开关 `switch` / 关闭 `close`；对话 `delete_goal` 也走关闭。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **修改内容**
    </lark-td>
    <lark-td>
      <text color="orange">部分具备</text>
    </lark-td>
    <lark-td>
      `update_goal_by_id` 仅有服务封装、无业务入口，Extour 协议仍 TODO。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **结束通知**
    </lark-td>
    <lark-td>
      <text color="orange">待联调</text>
    </lark-td>
    <lark-td>
      `/goal/finish` 只发 done，不改 Extour 状态；推送错误未反馈。
    </lark-td>
  </lark-tr>
</lark-table>

### 生命周期 callback

`POST /goal/lifecycle_callback` 接收以下三类事件。

<lark-table rows="4" cols="3" header-row="true" column-widths="145,265,275">

  <lark-tr>
    <lark-td>
      事件
    </lark-td>
    <lark-td>
      当前处理
    </lark-td>
    <lark-td>
      验收边界
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      `create_success`
    </lark-td>
    <lark-td>
      直接下发 Goal 创建卡。
    </lark-td>
    <lark-td>
      不进 Planner；`show_card` 仅控制按钮。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      `create_failed`
    </lark-td>
    <lark-td>
      将 `reason` 转为推荐，回流后播报。
    </lark-td>
    <lark-td>
      回调成功不代表用户已听到。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      `trigger`
    </lark-td>
    <lark-td>
      推荐携任务关联；`show_card` 控制卡片和按钮。
    </lark-td>
    <lark-td>
      带 `vehicle_recommend_id` 回流；消费通知待接通。
    </lark-td>
  </lark-tr>
</lark-table>

`request_id` 关联创建（缓存 60 秒）；`goal_id` 标识目标；`recommend_id` 关联推荐回流（缓存 10 分钟）。接入方应为不同触发使用不同幂等键，同一次事件重试复用原键，不能只按 goal_id 去重。事件还需正值 `occurred_at` 及有效用户 / 车辆，校验当前登录账号。

**状态口径：**`creating`＝创建受理，`consumed`＝进入 Planner，`done`＝端侧状态同步（完成与关闭共用）；callback 无 `updated` / 完成事件。

### 流程架构图

<whiteboard token="QwSDweOuuh06ZjbRIZmcyVZAn3c" align="left"/>

### 生命周期回调与回流

<whiteboard token="JTQ3wiYcgh29w6bsJd5c5WkSn8e"/>
