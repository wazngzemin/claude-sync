# AIDV task service 与 任务岛 \&amp; 即时交互卡技术方案

<div class="callout">

打通任务岛列表的数据聚合（task service 长时任务和长程任务 ），Task service 在**创建成功**与**关闭/完成**两个时机对\&\#34;即时任务卡\&\#34;和\&\#34;AI Bar 任务岛\&\#34;的通知链路。数据结构以[0818 Advisor 端云协议](https://bytedance.larkoffice.com/wiki/GXmhwdnOqiYLztkybBTcnstsnXe)为基线

</div>

## 一、开发范围概述

<table><tbody>
<tr>
<td>

meego



</td>
<td>

[\[需求\]【AIVA\-818主交互】动态advisor支持即时交互卡和AIBAR展示](https://meego.larkoffice.com/telematics/story/detail/7362482664)


</td>
<td>



</td>
</tr>
<tr>
<td>

PRD

</td>
<td>

[【AIVA\-PRD】VUI主交互需求](https://bytedance.larkoffice.com/wiki/FBsrwA734iaFzZkrZExcHHBtn3d)

开发范围为 3\.特殊交互策略 中的 3\.1、3\.2、3\.3 
[智能纪要：SLS\-持续任务岛需求导入 2026年8月5日](https://bytedance.larkoffice.com/docx/ZNSAdX3dqo0At4xqvlGc9KRunhe)
[智能纪要：动态Advisor交互需求评审 2026年8月7日](https://bytedance.larkoffice.com/docx/NRlvdDBOZo50PexMmSScrg4knCg?dcuId=6834386903116300290)

</td>
<td>



</td>
</tr>
<tr>
<td>

技术方案评审录屏

</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>

figma

</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>

测试 case 评审

</td>
<td>



</td>
<td>



</td>
</tr>
</tbody></table>

### 1\.1 开发范围

1. **任务岛列表获取**：从 task service  获取 长时任务、与 ExecutionType = ecology（长程任务） 的任务数据 

2. **Task service  创建成功**：按任务类型通知**即时卡 / AI Bar**

3. **Task service  关闭或完成**：按任务类型通知 ** AI Bar 任务岛**

### 1\.2  Task service下挂任务，按生命周期长短和触发方式划分：

<table><tbody>
<tr>
<td>



</td>
<td>

分类

</td>
<td>

举例

</td>
<td>

展示位置

</td>
<td>

参数判断逻辑

</td>
</tr>
<tr>
<td rowspan="7">

Task service 

</td>
<td>

定时任务

</td>
<td>

下午3点提醒抢票

</td>
<td>

弹即时卡片

</td>
<td>

```JSON
"execution_type": "active_planner", 
"trigger_type": "time", 
"schedule_type": "once",
```

</td>
</tr>
<tr>
<td>

条件任务

</td>
<td>

温度到26度开空调

</td>
<td>

弹即时卡片

</td>
<td>

```JSON
"execution_type": "active_planner",
"trigger_type": "condition"
"schedule_type": "",   
```

</td>
</tr>
<tr>
<td>

长时任务\-循环定时任务



</td>
<td>

每隔一小时开座椅按摩

</td>
<td>

弹即时卡片 \+ AI Bar 任务岛

</td>
<td>

```JSON
"execution_type": "active_planner", 
"trigger_type": "time",    
 "schedule_type": "cycle",  
```

</td>
</tr>
<tr>
<td>

长时任务\-常规长时

</td>
<td>

一路介绍热点新闻

</td>
<td>

弹即时卡片 \+ AI Bar

</td>
<td rowspan="3">

```JSON
"execution_type": "active_planner", 
"trigger_type": "continuous",   
"schedule_type": "",    
```

</td>
</tr>
<tr>
<td>

长时任务\-车内视觉

</td>
<td>

逗笑 / 照顾二排宝宝

</td>
<td>

弹即时卡片 \+ AI Bar

</td>
</tr>
<tr>
<td>

长时任务\-车外视觉

</td>
<td>

介绍沿途风景

</td>
<td>

弹即时卡片 \+ AI Bar

</td>
</tr>
<tr>
<td>

长程任务（生态）

</td>
<td>

点咖啡送到公司

</td>
<td>

AI Bar  任务岛

</td>
<td>

```JSON
"execution_type": "ecology",
"trigger_type": "",   
"schedule_type": "",     
```

</td>
</tr>
</tbody></table>

## 二、任务岛列表数据来源

任务岛是 AI Bar 中展示用户所有**有效任务****中**** 长时任务和长程任务**的区域。

任务岛列表的获取数据流程如下：

## 三、通知链路总览

Task service  在任务创建成功、关闭/执行完成两个时机，需要通知两个下游通道：

<table><tbody>
<tr>
<td>

下游通道

</td>
<td>

接收方

</td>
<td>

说明

</td>
</tr>
<tr>
<td>

**即时任务卡**

</td>
<td>

（frontier PushMethodMsg）

</td>
<td>

弹即时卡片给用户，用于反馈创建/触发/关闭结果

</td>
</tr>
<tr>
<td>

**AI Bar 任务岛**

</td>
<td>

1、AI Bar 增加任务列表接口
2、frontier PushMethodMsg

</td>
<td>

1、获取所有**有效任务中 长时任务和长程任务**
2、在 AI Bar 任务岛中增加或移除任务条目

</td>
</tr>
</tbody></table>

### 3\.1 Task service 通知链路

Task service 由用户 Query 触发，按任务类型和管理服务（task service）分别走不同通知路径。

**创建成功时的通知矩阵：**

<table><tbody>
<tr>
<td>

管理服务

</td>
<td>

任务类型

</td>
<td>

通知即时任务卡

</td>
<td>

通知AI Bar  增加任务

</td>
</tr>
<tr>
<td rowspan="7">

task service



</td>
<td>

定时任务（单次）

</td>
<td>

✅

</td>
<td>

❌

</td>
</tr>
<tr>
<td>

条件任务（单次）

</td>
<td>

✅

</td>
<td>

❌

</td>
</tr>
<tr>
<td>

循环定时触发任务

</td>
<td>

✅

</td>
<td>

✅

</td>
</tr>
<tr>
<td>

长时任务\-常规长时

</td>
<td>

✅

</td>
<td>

✅

</td>
</tr>
<tr>
<td>

长时任务\-车内视觉

</td>
<td>

✅

</td>
<td>

✅

</td>
</tr>
<tr>
<td>

长时任务\-车外视觉

</td>
<td>

✅

</td>
<td>

✅

</td>
</tr>
<tr>
<td>

长程任务

</td>
<td>

❌

</td>
<td>

✅

</td>
</tr>
</tbody></table>

Task service  创建成功的完整通知流程：

Task service 关闭/完成的通知流程与创建对称，将\&\#34;增加任务\&\#34;替换为\&\#34;关闭/移除任务\&\#34;即可，此处不复述。

## 四、接口文档

### 4\.1 任务岛列表查询（客户端 → AIDV ）

> 使用场景：如任务创建成功，frontier 因车机下电导致推送失败，车机任务岛数据与云端数据不统一时，车机上电需要获取任务岛任务列表
> 
> 返回数据：按照更新时间倒序排列，只会返回长时任务和长程任务
> 
> 

**请求地址****：**` ``POST ``/aidv/v1/task``/island``/list`

**请求参数：****详情查看公共参数**

#### **响应参数****结构**

##### 字段说明

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

语义

</td>
</tr>
<tr>
<td>

`list`

</td>
<td>

array

</td>
<td>

Y

</td>
<td>

任务列表

</td>
</tr>
<tr>
<td>

`recommend\_id`

</td>
<td>

String  

</td>
<td>

N

</td>
<td>

推荐ID

</td>
</tr>
<tr>
<td>

`query`

</td>
<td>

String 

</td>
<td>

N

</td>
<td>

请求语意

</td>
</tr>
<tr>
<td>

`ui\_control`

</td>
<td>

Object

</td>
<td>

Y

</td>
<td>

下发给客户端的 UI 控制信息

</td>
</tr>
<tr>
<td>

`ui\_control\.biz\_type`

</td>
<td>

String 

</td>
<td>

Y

</td>
<td>

业务类型；默认：task\_island

</td>
</tr>
<tr>
<td>

`ui\_control\.need\_confirm`

</td>
<td>

Bool 

</td>
<td>

Y

</td>
<td>

`false` 表示直接执行/告知；`true` 表示等待用户确认。默认false

</td>
</tr>
<tr>
<td>

`ui\_control\.show\_state`

</td>
<td>

int

</td>
<td>

Y

</td>
<td>

展示状态。0：隐藏，1: 展示，2：刷新

</td>
</tr>
<tr>
<td>

`ui\_control\.ui\_payload`

</td>
<td>

Object 

</td>
<td>

Y

</td>
<td>

客户端展示载荷，云端按双方冻结的 schema 生成

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

`button` 可点击；`status` 仅展示

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

AI Bar 短文案，15字以内

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

Y

</td>
<td>

图标枚举，例如 `cooling`、`heating`  

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

Y

</td>
<td>

用户可见的解释摘要，不传递内部原始思维链

</td>
</tr>
<tr>
<td>

`ui\_payload\.action\_list`

</td>
<td>

String\[\] 

</td>
<td>

N

</td>
<td>

舒适场景的车控项展示；元素结构尚未冻结

</td>
</tr>
<tr>
<td>

`ui\_payload\.playlist`

</td>
<td>

待确认

</td>
<td>

N

</td>
<td>

资料提到内容类场景需要节目单，但字段表和示例尚未定义

</td>
</tr>
<tr>
<td>

`ui\_payload\.task`

</td>
<td>

Object

</td>
<td>

Y

</td>
<td>

任务信息

</td>
</tr>
<tr>
<td>

`task\.task\_id`

</td>
<td>

String

</td>
<td>

Y

</td>
<td>

任务标识。task service 来源取 task\_id

</td>
</tr>
<tr>
<td>

`task\.execution\_type`

</td>
<td>

String

</td>
<td>

Y

</td>
<td>

执行类型：active\_planner \| gui  \| ecology:长程任务

</td>
</tr>
<tr>
<td>

`task\.trigger\_type`



</td>
<td>

string

</td>
<td>

N

</td>
<td>

execution\_type = active\_planner 时，此字段必有值。

time：定时任务  \|  condition：条件任务

</td>
</tr>
<tr>
<td>

`task\.schedule\_type`

</td>
<td>

String

</td>
<td>

N

</td>
<td>

trigger\_type = time 定时任务类型： once: 单次 ｜cycle：定时循环任务\-长时任务 

</td>
</tr>
<tr>
<td>

`task\.status`

</td>
<td>

string

</td>
<td>

Y

</td>
<td>

任务状态：主生命周期：created、waiting、running、closed

</td>
</tr>
<tr>
<td>

`task\.updated\_at`

</td>
<td>

Int64

</td>
<td>

Y

</td>
<td>

最近更新时间，毫秒时间戳

</td>
</tr>
<tr>
<td>

`task\.task\_version`

</td>
<td>

int64

</td>
<td>

Y

</td>
<td>

任务版本号

</td>
</tr>
</tbody></table>

##### 响应示例

```JSON
{
  "data": {
    "list": [
      {
        "ui_control": {
          "biz_type": "task_island",
          "need_confirm": false,
          "show_state": 1,
          "ui_payload": {
            "form": "status",
            "text": "提醒休息",
            "icon": "rest",
            "cot": "每隔3小时提醒休息20分钟（仅在主驾有人时执行）",
            "task": {
              "task_id": "7674100010098640906",
              "execution_type": "active_planner",
              "trigger_type": "time",
              "schedule_type": "cycle",
              "status": "waiting",
              "updated_at": 1786766534832
            }
          }
        }
      },
      {
        "ui_control": {
          "biz_type": "task_island",
          "need_confirm": false,
          "show_state": 1,
          "ui_payload": {
            "form": "status",
            "text": "持续讲笑话",
            "icon": "cooling",
            "cot": "持续给用户讲笑话，直到用户喊停为止",
            "task": {
              "task_id": "task_2121312312",
              "execution_type": "active_planner",
              "trigger_type": "condition",
              "schedule_type": "",
              "status": "running",
              "updated_at": 1786505945369,
              "task_version":1
            }
          }
        }
      },
      {
        "ui_control": {
          "biz_type": "task_island",
          "need_confirm": false,
          "show_state": 1,
          "ui_payload": {
            "form": "status",
            "text": "点杯咖啡送到公司",
            "icon": "cooling",
            "cot": "点杯咖啡送到公司",
            "task": {
              "task_id": "task_2121312312",
              "execution_type": "ecology",
              "trigger_type": "",
              "schedule_type": "",
              "status": "running",
              "updated_at": 1786505945371,
              "task_version":1
            }
          }
        }
      }
    ]
  },
  "errno": 0,
  "msg": "success"
}
```

### 4\.2 即时任务卡\&amp;ai bar 任务岛推送

> 创建任务成功后通过 frontier 推送 任务卡和 ai bar 任务岛 信息
> 
> 

#### 4\.2\.1 实现方案

复用现有 **frontier\.PushMethodMsg** 通道，不新增接口。

增加  frontier\.Method 类型  区分推送渠道

```Go
// Method 推送来源类型
type Method int32

const (
    // ... 已有枚举值 ...

    TaskService Method = 13 // 推送来源：任务服务
)
```

增加 frontier\.MessageType 类型 区分推送类型

```Go
// MessageType 任务推送事件类型
type MessageType int32

const (
    TypeCreateTask MessageType = 1 // 创建任务推送
    TypeCloseTask  MessageType = 2 // 关闭任务推送
    TypeUpdateTask  MessageType = 3 // 更新任务推送
)
```

#### 4\.2\.2 推送消息结构

<table><tbody>
<tr>
<td>

展示端

</td>
<td>

基础结构

</td>
<td>

下行类型

</td>
<td>

扩展字段

</td>
</tr>
<tr>
<td>

即时任务卡

</td>
<td>

`card`

</td>
<td>

创建成功消息

</td>
<td>

`task\_id` 等

</td>
</tr>
<tr>
<td>

任务岛（AI Bar）

</td>
<td>

`FrontierMessage\.message \+ ui\_control`

</td>
<td>

创建 / 关闭消息

</td>
<td>

`task\_id` 等

</td>
</tr>
</tbody></table>

##### 数据结构

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

`recommend\_id`

</td>
<td>

String  

</td>
<td>

N

</td>
<td>

推荐ID

</td>
</tr>
<tr>
<td>

`query`

</td>
<td>

String 

</td>
<td>

N

</td>
<td>

请求语意

</td>
</tr>
<tr>
<td>

`card`

</td>
<td>

object

</td>
<td>

N

</td>
<td>

即时任务卡推送结构 \- 无则不需要弹即时任务卡

</td>
</tr>
<tr>
<td>

`ui\_control`

</td>
<td>

object

</td>
<td>

N

</td>
<td>

任务岛数据推送结构 \- 无则不需要任务岛更新数据

</td>
</tr>
</tbody></table>

##### 任务卡数据结构\-card

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

`card\.goal\_id`

</td>
<td>

string

</td>
<td>

N

</td>
<td>

任务标识。 Task 下发类型为空

</td>
</tr>
<tr>
<td>

`card\.task\_id`

</td>
<td>

String

</td>
<td>

Y

</td>
<td>

任务标识。task service 来源取 task\_id

</td>
</tr>
<tr>
<td>

`card\.execution\_type`

</td>
<td>

String

</td>
<td>

Y

</td>
<td>

执行类型：active\_planner \| gui  \| ecology:长程任务

</td>
</tr>
<tr>
<td>

`card\.trigger\_type`

</td>
<td>

string

</td>
<td>

N

</td>
<td>

execution\_type = active\_planner 时，此字段必有值。

time：定时任务  \|  condition：条件任务 

</td>
</tr>
<tr>
<td>

`card\.schedule\_type`

</td>
<td>

String

</td>
<td>

N

</td>
<td>

trigger\_type = time 定时任务类型： once: 单次 ｜cycle：定时循环任务\-长时任务 

</td>
</tr>
<tr>
<td>

`card\.updated\_at`

</td>
<td>

Int64

</td>
<td>

Y

</td>
<td>

最近更新时间，毫秒时间戳

</td>
</tr>
<tr>
<td>

`card\.task\_version`

</td>
<td>

Int64

</td>
<td>

Y

</td>
<td>

任务版本号

</td>
</tr>
<tr>
<td>

`card\.title`

</td>
<td>

String

</td>
<td>

Y

</td>
<td>

任务标题（卡片标题）

</td>
</tr>
<tr>
<td>

`card\.icon`

</td>
<td>

String

</td>
<td>

Y

</td>
<td>

图标 URL 或枚举值 暂无图标，可使用默认图标占位

</td>
</tr>
<tr>
<td>

`card\.content`

</td>
<td>

String

</td>
<td>

N

</td>
<td>

任务正文/描述

</td>
</tr>
<tr>
<td>

`card\.status`

</td>
<td>

String

</td>
<td>

Y

</td>
<td>

任务状态：主生命周期：created、waiting、running、closed

</td>
</tr>
<tr>
<td>

`card\.button`

</td>
<td>

object

</td>
<td>

N

</td>
<td>

按钮样式，不存在或为空则不需要按钮

</td>
</tr>
<tr>
<td>

`button\.type`

</td>
<td>

String

</td>
<td>

Y

</td>
<td>

按钮类型：switch 开关，button 按钮

</td>
</tr>
<tr>
<td>

`button\.text`

</td>
<td>

String

</td>
<td>

N

</td>
<td>

按钮文案：比如 取消、关闭、确认等

</td>
</tr>
</tbody></table>

##### ai bar 任务岛数据结构 

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

语义

</td>
</tr>
<tr>
<td>

`ui\_control`

</td>
<td>

Object

</td>
<td>

Y

</td>
<td>

下发给客户端的 UI 控制信息

</td>
</tr>
<tr>
<td>

`ui\_control\.biz\_type`

</td>
<td>

String 

</td>
<td>

Y

</td>
<td>

业务类型；task\_island 任务岛

</td>
</tr>
<tr>
<td>

`ui\_control\.need\_confirm`

</td>
<td>

Bool 

</td>
<td>

Y

</td>
<td>

`false` 表示直接执行/告知；`true` 表示等待用户确认

</td>
</tr>
<tr>
<td>

`ui\_control\.show\_state`

</td>
<td>

int

</td>
<td>

Y

</td>
<td>

展示状态。0：隐藏，1: 展示，2：刷新

</td>
</tr>
<tr>
<td>

`ui\_control\.ui\_payload`

</td>
<td>

Object 

</td>
<td>

Y

</td>
<td>

客户端展示载荷，云端按双方冻结的 schema 生成

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

`button` 可点击；`status` 仅展示

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

AI Bar 短文案，15字以内

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

图标枚举，例如 `cooling`、`heating`  

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

用户可见的解释摘要，不传递内部原始思维链

</td>
</tr>
<tr>
<td>

`ui\_payload\.action\_list`

</td>
<td>

String\[\] 

</td>
<td>

N

</td>
<td>

舒适场景的车控项展示；元素结构尚未冻结

</td>
</tr>
<tr>
<td>

`ui\_payload\.playlist`

</td>
<td>

待确认

</td>
<td>

N

</td>
<td>

资料提到内容类场景需要节目单，但字段表和示例尚未定义

</td>
</tr>
<tr>
<td>

`ui\_payload\.task`

</td>
<td>

Object

</td>
<td>

Y

</td>
<td>

任务信息

</td>
</tr>
<tr>
<td>

`task\.task\_id`

</td>
<td>

String

</td>
<td>

Y

</td>
<td>

任务标识。task service 来源取 task\_id

</td>
</tr>
<tr>
<td>

`task\.execution\_type`

</td>
<td>

String

</td>
<td>

Y

</td>
<td>

执行类型：active\_planner \| gui  \| ecology:长程任务

</td>
</tr>
<tr>
<td>

`task\.trigger\_type`



</td>
<td>

string

</td>
<td>

N

</td>
<td>

execution\_type = active\_planner 时，此字段必有值。

time：定时任务  \|  condition：条件任务 

</td>
</tr>
<tr>
<td>

`task\.schedule\_type`

</td>
<td>

String

</td>
<td>

N

</td>
<td>

trigger\_type = time 定时任务类型： once: 单次 ｜cycle：定时循环任务\-长时任务 

</td>
</tr>
<tr>
<td>

`task\.status`

</td>
<td>

string

</td>
<td>

Y

</td>
<td>

任务状态：主生命周期：created、waiting、running、closed

</td>
</tr>
<tr>
<td>

`task\.updated\_at`

</td>
<td>

Int64

</td>
<td>

Y

</td>
<td>

最近更新时间，毫秒时间戳

</td>
</tr>
<tr>
<td>

`task\.task\_version`

</td>
<td>

int64

</td>
<td>

Y

</td>
<td>

任务版本号

</td>
</tr>
</tbody></table>

##### 创建成功推送数据结构示例

```JSON
//  method = 13 实际推送结构 
{
  "message_type": 2,
  "message": {
    "recommend_id": "rec_20260903_8f3a9c1d7b4e",
    "query": "advisor:播放一次最新新闻",
    "card": {
      "task_id": "7674099714672822322",
      "execution_type": "active_planner",
      "trigger_type": "time",
      "schedule_type": "cycle",
      "updated_at": 1786773371620,
      "task_version": 1,
      "title": "每小时播报新闻",
      "icon": "news",
      "content": "每小时播报一次最新新闻",
      "button": {
        "type": "button", // switch 开关，button 按钮
        "text": "取消" // 按钮文案。比如 取消
      },
      "status": "waiting"
    },
    "ui_control": {
      "biz_type": "task_island",
      "need_confirm": false,
      "show_state": 1,
      "ui_payload": {
        "form": "status",
        "text": "每小时播报新闻",
        "icon": "news",
        "cot": "每小时播报一次最新新闻",
        "task": {
          "task_id": "7674099714672822322",
          "execution_type": "active_planner",
          "trigger_type": "time",
          "schedule_type": "cycle",
          "status": "waiting",
          "updated_at": 1786773371620,
          "task_version": 1
        }
      }
    }
  }
}


// method = 3 结构 仅供与method = 13参考对比
{
  "message_type": 1,
  "message": {
    "recommend_id": "rec_20260903_8f3a9c1d7b4e",
    "query": "advisor:打开空调并播放一首周杰伦的歌",
    "ui_control": {
      "biz_type": "task_advice",
      "need_confirm": true,
      "ui_payload": {
        "form": "card",
        "text": "正在为你准备打开空调和播放歌曲",
        "icon": "https://cdn.example.com/icons/ac_music.png",
        "cot": "先打开空调，然后播放周杰伦",
        "action_list": [
          "confirm",
          "cancel"
        ]
      },
      "action": "confirm_and_execute"
    },
    "card": {
      "goal_id": "goal_987654321",
      "title": "舒适出行",
      "content": "打开空调制冷，温度24°C，同时播放周杰伦的《稻香》",
      "icon": "https://cdn.example.com/icons/comfort_mode.png",
      "event": "goal_confirmed"
    },
    "button": {
      "action_id": "btn_confirm_001",
      "action_token": "tk_a3f9c2e1b7d5",
      "path": "intent://com.bytedance.aidv/action/confirm_goal?goal_id=goal_987654321",
      "task_type": "scene_task"
    },
    "play_list": "[{\"item_id\":\"track_001\",\"title\":\"稻香\",\"artist\":\"周杰伦\",\"url\":\"https://music.example.com/xxxxx\"},{\"item_id\":\"track_002\",\"title\":\" 晴天\",\"artist\":\"周杰伦\",\"url\":\"https://music.example.com/yyyyy\"}]"
  }
}


```

##### 4\. 完成/关闭任务推送数据结构示例

```json
{
  "message_type": 2,
  "message": {
    "ui_control": {
      "biz_type": "task_island",
      "need_confirm": false,
      "show_state": 0,
      "ui_payload": {
        "form": "status",
        "text": "每小时播报新闻",
        "icon": "news",
        "cot": "每小时播报一次最新新闻",
        "task": {
          "task_id": "7674099714672822322",
          "execution_type": "active_planner",
          "trigger_type": "time",
          "schedule_type": "cycle",
          "status": "closed",
          "updated_at": 1786773584693,
          "task_version":1
        }
      }
    }
  }
}
```

5\.变更任务推送数据





## 公共请求参数 CommonInfo

所有接口的请求参数中均需携带以下公共信息字段（`CommonInfo` 结构体），用于鉴权、设备识别与链路追踪：

<table><tbody>
<tr>
<td>

字段名 \(json key\)

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

app\_id

</td>
<td>

int64

</td>
<td>

✅

</td>
<td>

字节内部 SDK/APP 的 APPID，在字节云中台申请，一般用于抖音业务传递，不同项目会有不同的值

</td>
</tr>
<tr>
<td>

channel\_app\_id

</td>
<td>

int32

</td>
<td>

✅

</td>
<td>

分配给请求方的 APPID，由项目自定义

</td>
</tr>
<tr>
<td>

channel

</td>
<td>

string

</td>
<td>

✅

</td>
<td>

渠道名

</td>
</tr>
<tr>
<td>

vehicle\_id

</td>
<td>

string

</td>
<td>

✅

</td>
<td>

车辆唯一标识，加密的车 VIN 码

</td>
</tr>
<tr>
<td>

vehicle\_type

</td>
<td>

string

</td>
<td>

✅

</td>
<td>

车型参数

</td>
</tr>
<tr>
<td>

account\_id

</td>
<td>

string

</td>
<td>

✅

</td>
<td>

车企账号 ID

</td>
</tr>
<tr>
<td>

device\_id

</td>
<td>

int64

</td>
<td>

—

</td>
<td>

设备 ID。业务是对面提供 SDK 时无此字段，会通过 TobDeviceID 或 VehicleID 转换

</td>
</tr>
<tr>
<td>

tob\_device\_id

</td>
<td>

string

</td>
<td>

—

</td>
<td>

ToB 设备 ID

</td>
</tr>
<tr>
<td>

iid

</td>
<td>

int64

</td>
<td>

—

</td>
<td>

应用安装 ID

</td>
</tr>
<tr>
<td>

vehicle\_name

</td>
<td>

string

</td>
<td>

—

</td>
<td>

车型名称

</td>
</tr>
<tr>
<td>

device\_platform

</td>
<td>

string

</td>
<td>

—

</td>
<td>

设备平台（如 android / ios）

</td>
</tr>
<tr>
<td>

device\_brand

</td>
<td>

string

</td>
<td>

—

</td>
<td>

设备品牌

</td>
</tr>
<tr>
<td>

device\_model

</td>
<td>

string

</td>
<td>

—

</td>
<td>

设备型号

</td>
</tr>
<tr>
<td>

os\_version

</td>
<td>

string

</td>
<td>

—

</td>
<td>

操作系统版本

</td>
</tr>
<tr>
<td>

client\_version

</td>
<td>

string

</td>
<td>

—

</td>
<td>

客户端版本，可以是 APP 版本，也可以是 SDK 版本

</td>
</tr>
<tr>
<td>

ac

</td>
<td>

string

</td>
<td>

—

</td>
<td>

网络类型（如 wifi / 5g）

</td>
</tr>
<tr>
<td>

city

</td>
<td>

string

</td>
<td>

—

</td>
<td>

所在城市

</td>
</tr>
<tr>
<td>

district

</td>
<td>

string

</td>
<td>

—

</td>
<td>

所在区县

</td>
</tr>
<tr>
<td>

longitude

</td>
<td>

float64

</td>
<td>

—

</td>
<td>

经度

</td>
</tr>
<tr>
<td>

latitude

</td>
<td>

float64

</td>
<td>

—

</td>
<td>

纬度

</td>
</tr>
<tr>
<td>

login\_doubao\_uid

</td>
<td>

uint64

</td>
<td>

—

</td>
<td>

豆包账号 ID

</td>
</tr>
<tr>
<td>

encrypted\_doubao\_uid

</td>
<td>

string

</td>
<td>

—

</td>
<td>

加密的豆包账号 ID

</td>
</tr>
<tr>
<td>

face\_id

</td>
<td>

string

</td>
<td>

—

</td>
<td>

Face ID

</td>
</tr>
<tr>
<td>

asr\_task\_id

</td>
<td>

string

</td>
<td>

—

</td>
<td>

ASR 任务 ID

</td>
</tr>
<tr>
<td>

vehicle\_auth

</td>
<td>

string

</td>
<td>

—

</td>
<td>

车辆认证信息，JSON 字符串

</td>
</tr>
</tbody></table>

<div class="callout">

`IsLogin`（豆包账号是否已登录标识）为服务端内部计算字段，`json:\&\#34;\-\&\#34;` 不参与序列化，请求方无需传递。

</div>



