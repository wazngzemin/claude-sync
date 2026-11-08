# 【AI 汽车】上汽动态 Advisor Goal List 接口



<div class="callout">

用于查询当前账号在 `saic\-dna`渠道下仍有效的目标列表。
字段以弋途 `query\_goal\_list` 返回为准。

</div>

## 1\. 请求

**Method：**`POST`

**Path：**`/aidv/v1/goal\-list`

**Header：**`Content\-Type: application/json`

**Body：**空 JSON 对象 `\{\}`；业务参数通过 Query 传递。

**联调环境：**`ppe\_aidv\_advisor`

<table><tbody>
<tr>
<td>

参数

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

`channel`

</td>
<td>

string

</td>
<td>

是

</td>
<td>

固定传 `saic\-dna`

</td>
</tr>
<tr>
<td>

`channel\_app\_id`

</td>
<td>

string

</td>
<td>

是

</td>
<td>

渠道应用 ID；DNA 当前为 `99220`

</td>
</tr>
<tr>
<td>

`vehicle\_id`

</td>
<td>

string

</td>
<td>

是

</td>
<td>

车辆唯一标识

</td>
</tr>
<tr>
<td>

`vehicle\_type`

</td>
<td>

string

</td>
<td>

是

</td>
<td>

车型或品牌标识，如 `ROEWE`

</td>
</tr>
<tr>
<td>

`app\_id`

</td>
<td>

string

</td>
<td>

是

</td>
<td>

豆包端应用 ID

</td>
</tr>
<tr>
<td>

`account\_id`

</td>
<td>

string

</td>
<td>

是

</td>
<td>

当前登录的车企账号 ID，用于查询该账号的目标

</td>
</tr>
<tr>
<td>

`login\_doubao\_uid`

</td>
<td>

string

</td>
<td>

是

</td>
<td>

当前登录用户的豆包 UID

</td>
</tr>
<tr>
<td>

`device\_id`

</td>
<td>

string

</td>
<td>

是

</td>
<td>

车机设备 ID

</td>
</tr>
</tbody></table>

### 请求示例

```bash
DEBUG_MODE=$((10#$(date +%Y) + 10#$(date +%d)))

curl -X POST 'https://api-vehicle.volcengine.com/aidv/v1/goal-list?channel=saic-dna&channel_app_id=99220&vehicle_id=xxx&vehicle_type=ROEWE&app_id=765783&account_id=xxx&login_doubao_uid=xxx&device_id=xxx' \
  -H "Debug-Mode: ${DEBUG_MODE}" \
  -H 'x-tt-env: ppe_aidv_advisor' \
  -H 'x-use-ppe: 1' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

## 2\. 返回体

<table><tbody>
<tr>
<td>

字段

</td>
<td>

类型

</td>
<td>

说明

</td>
</tr>
<tr>
<td>

`errno`

</td>
<td>

int

</td>
<td>

业务错误码；`0` 表示成功

</td>
</tr>
<tr>
<td>

`msg`

</td>
<td>

string

</td>
<td>

结果说明

</td>
</tr>
<tr>
<td>

`data\.goal\_list`

</td>
<td>

array

</td>
<td>

有效目标列表；没有目标时返回空数组

</td>
</tr>
</tbody></table>

### goal\_list 元素

<table><tbody>
<tr>
<td>

字段

</td>
<td>

类型

</td>
<td>

说明

</td>
</tr>
<tr>
<td>

`goal\_id`

</td>
<td>

int64

</td>
<td>

目标唯一 ID

</td>
</tr>
<tr>
<td>

`goal\_text`

</td>
<td>

string

</td>
<td>

用户创建目标时的原始目标描述

</td>
</tr>
<tr>
<td>

`goal\_detail`

</td>
<td>

string

</td>
<td>

目标细节、最新进展或关闭原因

</td>
</tr>
<tr>
<td>

`goal\_status`

</td>
<td>

string

</td>
<td>

目标状态，枚举见下文

</td>
</tr>
<tr>
<td>

`goal\_headline`

</td>
<td>

string

</td>
<td>

适合列表展示的短标题

</td>
</tr>
<tr>
<td>

`goal\_sketch`

</td>
<td>

string

</td>
<td>

适合列表展示的摘要

</td>
</tr>
<tr>
<td>

`icon\_url`

</td>
<td>

string

</td>
<td>

目标图标 URL；没有时可为空字符串

</td>
</tr>
<tr>
<td>

`scene`

</td>
<td>

string

</td>
<td>

目标所属场景，枚举见下文

</td>
</tr>
<tr>
<td>

`component\_type`

</td>
<td>

string

</td>
<td>

客户端操作组件类型，枚举见下文

</td>
</tr>
<tr>
<td>

`enabled`

</td>
<td>

bool

</td>
<td>

目标是否启用；主要用于 `switch` 组件。协议字段名统一为 `enabled`

</td>
</tr>
</tbody></table>

## 3\. 枚举

<table><tbody>
<tr>
<td>

字段

</td>
<td>

枚举值

</td>
<td>

含义

</td>
</tr>
<tr>
<td>

`goal\_status`

</td>
<td>

`creating`

</td>
<td>

创建中

</td>
</tr>
<tr>
<td>

`goal\_status`

</td>
<td>

`pending`

</td>
<td>

待执行

</td>
</tr>
<tr>
<td>

`goal\_status`

</td>
<td>

`running`

</td>
<td>

执行中

</td>
</tr>
<tr>
<td>

`goal\_status`

</td>
<td>

`done`

</td>
<td>

已结束

</td>
</tr>
<tr>
<td>

`component\_type`

</td>
<td>

`button`

</td>
<td>

按钮操作；默认用于取消或关闭目标

</td>
</tr>
<tr>
<td>

`component\_type`

</td>
<td>

`switch`

</td>
<td>

开关操作；由 `enabled` 表示当前状态

</td>
</tr>
<tr>
<td>

`scene`

</td>
<td>

`出行` / `服务` / `娱乐` / `舒适` / `情感` / `内容` / `其他`

</td>
<td>

客户端可据此分组或选择默认样式

</td>
</tr>
</tbody></table>

## 4\. 返回示例

### 有目标

```json
{
  "data": {
    "goal_list": [
      {
        "goal_id": 2,
        "goal_text": "3分钟后提醒主驾用户喝水",
        "goal_detail": "3分钟后提醒我喝水",
        "goal_status": "pending",
        "goal_headline": "14:20 提醒主驾喝水",
        "goal_sketch": "及时补水，活力满满～",
        "icon_url": "https://esp32-agent-uat.extour-inc.com/esp32-agent/goal_manage/icons/hand.png",
        "component_type": "button",
        "scene": "服务",
        "enable": false,
        "operate_msg": "任务创建成功"
      },
      {
        "goal_id": 3,
        "goal_text": "距离目的地还有1公里时提醒主驾用户快到了",
        "goal_detail": "距离目的地还有一公里的时候告诉我快到了",
        "goal_status": "pending",
        "goal_headline": "距目的地1公里提醒",
        "goal_sketch": "临近目的地时及时告知",
        "icon_url": "https://esp32-agent-uat.extour-inc.com/esp32-agent/goal_manage/icons/navigation.png",
        "component_type": "button",
        "scene": "出行",
        "enable": false,
        "operate_msg": "任务创建成功"
      },
      {
        "goal_id": 4,
        "goal_text": "每天晚上7点提醒主驾给王总打电话，持续10天",
        "goal_detail": "接下来的10天，每天晚上7点提醒我给王总打电话",
        "goal_status": "pending",
        "goal_headline": "19:00 提醒给王总打电话",
        "goal_sketch": "连续10天每日提醒",
        "icon_url": "https://esp32-agent-uat.extour-inc.com/esp32-agent/goal_manage/icons/telephone.png",
        "component_type": "switch",
        "scene": "服务",
        "enable": false,
        "operate_msg": "任务创建成功"
      }
    ]
  },
  "errno": 0,
  "msg": "success"
}
```

<div class="callout">

实测说明：通过 Planner 创建“3分钟后提醒我喝水”“距离目的地还有一公里的时候告诉我快到了”以及“接下来的10天，每天晚上7点提醒我给王总打电话”均成功。

</div>

### 无目标

```
{
  "data": {
    "goal_list": []
  },
  "errno": 0,
  "msg": "success"
}
```

### 失败

```
{
  "data": null,
  "errno": 10001,
  "msg": "invalid parameter: vehicle_id"
}
```


