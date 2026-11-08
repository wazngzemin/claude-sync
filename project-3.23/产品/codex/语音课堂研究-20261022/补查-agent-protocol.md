https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d

# 三方Agent接入协议

# 变更记录

<table><tbody>
<tr>
<td>

版本

</td>
<td>

变更内容

</td>
<td>

变更日期

</td>
<td>

变更人

</td>
</tr>
<tr>
<td>

v1\.0

</td>
<td>

- 首次新增文档

</td>
<td>

2025年8月27日

</td>
<td>

吕鹏浩

</td>
</tr>
<tr>
<td>

v1\.1

</td>
<td>

- 新增接入须知

</td>
<td>

2026年1月22日

</td>
<td>



</td>
</tr>
<tr>
<td>

v1\.2

</td>
<td>

- 更新响应字段\-支持定义content内容格式（新增卡片数据结构）

</td>
<td>

2026年2月12日

</td>
<td>

吕鹏浩

</td>
</tr>
<tr>
<td>

v1\.3

</td>
<td>

- account\_id修改为非必传参数

</td>
<td>

2026年5月13日

</td>
<td>

吕鹏浩

</td>
</tr>
<tr>
<td>

v1\.4

</td>
<td>

- 更新端状态字段，去除冗余参数

</td>
<td>

2026年8月13日

</td>
<td>

吕鹏浩

</td>
</tr>
</tbody></table>

# 接入须知

您需要与我们沟通要实现的Agent的能力和形态，如是否纯车端自闭环（不依赖火山汽车座舱的云端能力和链路），如果是这样，则建议优先走FunctionCalling的方式接入（可参阅 [座舱大模型 Function Calling 协议适配说明](https://bytedance.larkoffice.com/docx/N4Z3diXhMocbUdxHeCEcEQaEnSh)）。



作为Agent开发者，您需要提供以下信息

<div class="callout">

1. Agent中文名称 

2. Agent英文名称

3. Agent功能描述

4. Agent请求时Query的描述 

5. 实现了[三方Agent接入协议](https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d#doxcnmvwIyrlnNDxg2JHs68o7lh)的**URL（https）**

6. 明确鉴权方式，提供鉴权需要的API Key或AK/SK

</div>

下方是一个示例（车控Agent）：

> 1、中文名称： 车辆控制
> 
> 2、英文名称：vehicle\_control
> 
> 3、功能描述：车载基础控制系统，集成导航控制、多媒体播控、车载控件控制等核心功能。支持导航操作、路线规划、地点搜索、媒体播放、音视频控制、K歌娱乐、拨打电话、车窗车门等全方位车载设备控制。系统能智能识别用户意图，统一处理各类车辆基础控制需求，提供一站式车载交互体验。
> 
> 4、请求时Query的描述：用户的车载控制指令，如\&\#39;导航到机场\&\#39;、\&\#39;打开空调\&\#39;、\&\#39;关闭车窗\&\#39;、\&\#39;搜索附近加油站\&\#39;、\&\#39;调节音量\&\#39;、\&\#39;开启K歌模式\&\#39;、\&\#39;设置座椅加热\&\#39;等。注意不支持用户问询。
> 
> 

# Agent SSE API

## 概述

此接口协议规定外部接入方在座舱链路中接入自定义Agent时，接入方需要遵循的Agent基础信息、输入输出格式等规范。

## 协议定义

### 请求参数（座舱云\-\&gt;自定义Agent）

- **URL 路径**:  外部接入方提供

- **HTTP 方法**: `POST`

- **协议：**SSE

- **Request Body**:

<table><tbody>
<tr>
<td>

字段名

</td>
<td>

数据类型

</td>
<td>

是否必填

</td>
<td>

描述

</td>
</tr>
<tr>
<td>

`chat\_id`

</td>
<td>

`string`

</td>
<td>

是

</td>
<td>

话题 ID，贯彻多轮对话

</td>
</tr>
<tr>
<td>

`question\_id`

</td>
<td>

`string`

</td>
<td>

是

</td>
<td>

单轮对话的QA ID

</td>
</tr>
<tr>
<td>

`conversation\_id`



</td>
<td>

`string`



</td>
<td>

是

</td>
<td>

会话id，会话列表中的一组对话使用同一个id

</td>
</tr>
<tr>
<td>

`agent\_id`

</td>
<td>

`string`

</td>
<td>

是

</td>
<td>

Agent唯一标识

</td>
</tr>
<tr>
<td>

`protocol\_version`

</td>
<td>

`string`

</td>
<td>

是

</td>
<td>

协议版本号

</td>
</tr>
<tr>
<td>

`query`

</td>
<td>

`Object\&lt;`[`Query`](https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d#share-UQpod7wARoA01gxzz8pccf9Ingb)`\&gt;`

</td>
<td>

是

</td>
<td>

本轮对话的查询对象

</td>
</tr>
<tr>
<td>

`agent\_context`

</td>
<td>

`Object\&lt;`[`AgentContext`](https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d#share-K4xVdACuNo4wZUxbiiTc3VlqnOb)`\&gt;`

</td>
<td>

是

</td>
<td>

调用 Agent 的上下文信息

</td>
</tr>
<tr>
<td>

`common\_info`

</td>
<td>

`Object\&lt;`[`CommonInfo`](https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d#share-BSQUd8CuDouqfZxIotlcikZ7nQ2)`\&gt;`

</td>
<td>

是

</td>
<td>

通用参数信息

</td>
</tr>
<tr>
<td>

`ext`

</td>
<td>

`map\[string\]string`

</td>
<td>

否

</td>
<td>

扩展信息，键值对形式

</td>
</tr>
<tr>
<td>

`trace\_id`



</td>
<td>

`string`



</td>
<td>

是

</td>
<td>

TraceID，用于链路追踪\(可通过此ID关联客户端发起的一次请求里全部操作\)

</td>
</tr>
</tbody></table>

- **Header：**

<table><tbody>
<tr>
<td>

字段名

</td>
<td>

数据类型

</td>
<td>

是否必填

</td>
<td>

描述

</td>
</tr>
<tr>
<td>

`trace\-id`

</td>
<td>

`string`

</td>
<td>

是

</td>
<td>

TraceID，用于链路追踪\(可通过此ID关联客户端发起的一次请求里全部操作\)

</td>
</tr>
</tbody></table>

### 响应结构（自定义Agent\-\&gt;座舱云）

SSE每帧响应中的data数据结构定义如下

- **Success \(200 OK\) Response Body**:

<table><tbody>
<tr>
<td>

字段名

</td>
<td>

数据类型

</td>
<td>

描述

</td>
</tr>
<tr>
<td>

`chunk\_type`



</td>
<td>

`integer`

</td>
<td>

回复块的类型 

枚举值见[ChunkType](https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d#share-W14OdVAJOoeowYxh8ARcP1PfnEc)

</td>
</tr>
<tr>
<td>

`content\_type`

</td>
<td>

`integer`

</td>
<td>

定义content内容类型

枚举值见[ContentType](https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d#share-SQqCdNFr8o364qxePchcuLyknBd)

</td>
</tr>
<tr>
<td>

`agent\_id`

</td>
<td>

`string`

</td>
<td>

Agent 的唯一标识，和请求参数对应

</td>
</tr>
<tr>
<td>

`is\_finish`

</td>
<td>

`boolean`

</td>
<td>

是否为最后一个响应块

</td>
</tr>
<tr>
<td>

`finish\_reason`

</td>
<td>

`string`

</td>
<td>

结束原因，`is\_finish` 为 true 时存在

</td>
</tr>
<tr>
<td>

`content`

</td>
<td>

`string`

</td>
<td>

用于展示给用户的内容

</td>
</tr>
<tr>
<td>

`tts\_content`

</td>
<td>

`string`

</td>
<td>

用于 TTS 的内容，如果为 null 则使用 `content`

</td>
</tr>
<tr>
<td>

`model\_content`

</td>
<td>

`string`

</td>
<td>

用于 Planner总结时的上下文内容

</td>
</tr>
<tr>
<td>

`reasoning\_content`

</td>
<td>

`string`

</td>
<td>

思考内容

</td>
</tr>
<tr>
<td>

`command`



</td>
<td>

`object\&lt;`[`AgentAnswerCommand`](https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d#share-Xqc2dA2yio8k9bxtzNScOitGndf)`\&gt;`



</td>
<td>

命令对象，如跳转或降级；正常情况请勿返回此字段

</td>
</tr>
<tr>
<td>

`ext`

</td>
<td>

`map\[string\]string`

</td>
<td>

扩展信息，键值对形式

</td>
</tr>
<tr>
<td>

`error\_code`

</td>
<td>

`integer`

</td>
<td>

错误码，成功时为0

</td>
</tr>
<tr>
<td>

`error\_message`

</td>
<td>

`string`

</td>
<td>

错误信息，成功时为空字符串

</td>
</tr>
</tbody></table>

- **Error Response Body**:

<table><tbody>
<tr>
<td>

字段名

</td>
<td>

数据类型

</td>
<td>

描述

</td>
</tr>
<tr>
<td>

`error\_code`

</td>
<td>

`integer`

</td>
<td>

错误码

</td>
</tr>
<tr>
<td>

`error\_message`

</td>
<td>

`string`

</td>
<td>

错误信息

</td>
</tr>
</tbody></table>

- **Header：**

<table><tbody>
<tr>
<td>

字段名

</td>
<td>

数据类型

</td>
<td>

是否必填

</td>
<td>

描述

</td>
</tr>
<tr>
<td>

`trace\-id`

</td>
<td>

`string`

</td>
<td>

是

</td>
<td>

TraceID，用于链路追踪\(可通过此ID关联客户端发起的一次请求里全部操作\)

</td>
</tr>
</tbody></table>

### 示例

**Sample Request:**

```JSON
{
  "agent_id": "agent-123",
  "protocol_version": "1.0",
  "app_id": "110000",
  "chat_id": "xxxxxxxxxx",
  "question_id": "xxxxxxxx",
  "query": {
    "content": "我好热啊",
    "round_id": 1
  },
  "agent_context": {
    "history": [],
    "long_term_memory": [],
    "short_term_memory": [],
    "vehicle_state": {
      "vechile_id": "vin-123",
      "vechile_type": "sedan",
      "states": [{
            "id":"vehicle_control_0013",
            "name": "车内空调状态",
            "subresource": [
                 {
                     "switch":"on",
                     "position":"主驾",
                     "temperature": "26度"
                 },
                 {
                     "switch":"on",
                     "position":"副驾",
                     "temperature": "25度"
                 }
            ],
            "subresource_chinese": [
                 {
                     "开关":"打开",
                     "位置":"主驾",
                     "温度": "26度"
                 },
                 {
                     "开关":"打开",
                     "位置":"副驾",
                     "温度": "25度"
                 }
            ]
        }]
    },
    "user_state": {
      "user_id": "",
      "states": [
        {
          "name": "seat",
          "value": "front_left"
        }
      ]
    }
  },
  "ext": {}
}

```

**Sample Success Response \(stream of JSON objects\):**

响应以标准SSE方式返回，其中data的数据格式如下

```JSON
{
  "agent_id": "agent-123",
  "chunk_type": 1, // Answer
  "content_type": 1, // 纯文本
  "is_finish": false,
  "content": "正在为您查询...", // 只做文本上屏展示，不播报不给模型做历史上下文
  "ext": {}
}

```

```JSON
{
  "agent_id": "agent-123",
  "chunk_type": 1, // Answer
  "content_type": 1, // 纯文本
  "is_finish": true,
  "tts_content": "今天北京的天气晴朗，温度在25摄氏度左右，适合出行。", // 需要播报的TTS文本，正常不需要赋值，TTS播报由Planner总结
  "model_content": "今天天气晴朗，温度25摄氏度。" // 给模型的上下文，用于Planer总结
  "ext": {}
}

```

**卡片数据（豆包侧渲染时使用）**

```JSON
{
  "agent_id": "agent-123",
  "chunk_type": 1, // Answer
  "content_type": 6, // content为卡片数据
  "is_finish": true,
  "content": "{\"widget_id\":\"卡片唯一ID，客户端以此ID决定渲染策略\",\"widget_data\":\"和客户端定义的卡片数据\"}", // 卡片JSON数据
  "model_content": "给Planner的自然语言描述，没有就保持空字符串" // Planner规定的上下文格式
  "ext": {}
}
```

Content中卡片JSON格式

<table><tbody>
<tr>
<td>

字段

</td>
<td>

值类型

</td>
<td>

备注

</td>
</tr>
<tr>
<td>

`widget\_id`

</td>
<td>

String

</td>
<td>

卡片唯一ID，和客户端定义好

</td>
</tr>
<tr>
<td>

`widget\_data`

</td>
<td>

String

</td>
<td>

和客户端定义的卡片数据

</td>
</tr>
</tbody></table>

```Shell
{
    "widget_id": "卡片唯一ID，客户端以此ID决定渲染策略",
    "widget_data": "卡片数据"
}
```

**透传数据类型（透传content和ext）**

端上根据agent\_id决定消息路由

```JSON
{
  "agent_id": "agent-123",
  "chunk_type": 1, // Answer
  "content_type": 9, // content为透传的数据
  "is_finish": true,
  "content": "", // 自定义字符串数据（完全透传）
  "ext": {} // 透传
}
```

## 数据结构定义

**AgentQuery **

<table><tbody>
<tr>
<td>

字段名

</td>
<td>

数据类型

</td>
<td>

是否必填

</td>
<td>

描述

</td>
</tr>
<tr>
<td>

`trigger\_method`

</td>
<td>

`Enum\&lt;`[`TriggerMethod`](https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d#share-U1nndekr4ovvvyx9AUkcc0OMnne)`\&gt;`

</td>
<td>

是

</td>
<td>

触发来源

枚举值类型：integer

</td>
</tr>
<tr>
<td>

`query\_type`



</td>
<td>

`Enum\&lt;`[`QueryType`](https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d#share-EvsedrIlKoik1qxBAYTcwsFqnrc)`\&gt;`



</td>
<td>

是



</td>
<td>

查询类型

枚举值类型：integer

</td>
</tr>
<tr>
<td>

`user\_input\_scene\_type`

</td>
<td>

`Enum\&lt;`[`UserInputSceneType`](https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d#share-VEQzdeWWOomCTMxxh0rcVnUZnhc)`\&gt;`

</td>
<td>

否

</td>
<td>

用户输入场景 

枚举值类型：integer

</td>
</tr>
<tr>
<td>

`content`

</td>
<td>

`string`

</td>
<td>

是

</td>
<td>

用户输入的具体内容

</td>
</tr>
<tr>
<td>

`round\_id`

</td>
<td>

`i32`

</td>
<td>

是

</td>
<td>

ASR 识别过程中的轮次 ID

</td>
</tr>
</tbody></table>

**CommonInfo**

<table><tbody>
<tr>
<td>

字段名

</td>
<td>

数据类型

</td>
<td>

是否必填

</td>
<td>

描述

</td>
</tr>
<tr>
<td>

`channel`

</td>
<td>

`string`

</td>
<td>

是

</td>
<td>

渠道名

</td>
</tr>
<tr>
<td>

`channel\_app\_id`

</td>
<td>

`string`

</td>
<td>

是

</td>
<td>

渠道AppID

</td>
</tr>
<tr>
<td>

`vehicle\_id`

</td>
<td>

`string`

</td>
<td>

是

</td>
<td>

设备唯一ID

</td>
</tr>
<tr>
<td>

`vehicle\_type`

</td>
<td>

`string`

</td>
<td>

是

</td>
<td>

车型参数

</td>
</tr>
<tr>
<td>

`vehicle\_name`

</td>
<td>

`string`

</td>
<td>

是

</td>
<td>

车型名称

</td>
</tr>
<tr>
<td>

`longitude`

</td>
<td>

`float`

</td>
<td>

否

</td>
<td>

当前位置经度

</td>
</tr>
<tr>
<td>

`latitude`

</td>
<td>

`float`

</td>
<td>

否

</td>
<td>

当前位置维度

</td>
</tr>
<tr>
<td>

`account\_id`

</td>
<td>

`string`

</td>
<td>

否

</td>
<td>

车企账号ID

</td>
</tr>
<tr>
<td>

`doubao\_uid`

</td>
<td>

`string`

</td>
<td>

否

</td>
<td>

豆包账号加密id

</td>
</tr>
<tr>
<td>

`city`

</td>
<td>

`string`

</td>
<td>

否

</td>
<td>

城市，例如：上海

</td>
</tr>
<tr>
<td>

`district`

</td>
<td>

`string`

</td>
<td>

否

</td>
<td>

行政区，例如：徐汇

</td>
</tr>
</tbody></table>

**AgentContext**

<table><tbody>
<tr>
<td>

字段名

</td>
<td>

数据类型

</td>
<td>

是否必填

</td>
<td>

描述

</td>
</tr>
<tr>
<td>

`history`

</td>
<td>

`list\&lt;`[`AgentHistoryItem`](https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d#share-NNoBd9owroupbHxLIyucglNWnDe)`\&gt;`

</td>
<td>

否

</td>
<td>

对话历史记录

</td>
</tr>
<tr>
<td>

`long\_term\_memory`

</td>
<td>

`list\&lt;`[`AgentMemoryItem`](https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d#share-YNaTdaTPXoyJLixX9ancS42VnDa)`\&gt;`

</td>
<td>

否

</td>
<td>

长期记忆

</td>
</tr>
<tr>
<td>

`short\_term\_memory`

</td>
<td>

`list\&lt;`[`AgentMemoryItem`](https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d#share-YNaTdaTPXoyJLixX9ancS42VnDa)`\&gt;`

</td>
<td>

否

</td>
<td>

短期记忆

</td>
</tr>
<tr>
<td>

`vehicle\_state`

</td>
<td>

`object``\&lt;`[`VehicleState`](https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d#share-TnBvdq9ZiopqWzxVGcJcsalWnfe)`\&gt;`

</td>
<td>

否

</td>
<td>

车辆状态

</td>
</tr>
<tr>
<td>

`user\_state`

</td>
<td>

object

</td>
<td>

否

</td>
<td>

用户状态

</td>
</tr>
</tbody></table>

**AgentHistoryItem**

<table><tbody>
<tr>
<td>

字段名

</td>
<td>

数据类型

</td>
<td>

是否必填

</td>
<td>

描述

</td>
</tr>
<tr>
<td>

`query`

</td>
<td>

[`AgentQuery`](https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d#share-M2gidarvooeyfNxFF57cjS3Wnad)

</td>
<td>

是

</td>
<td>

用户的查询对象。

</td>
</tr>
<tr>
<td>

`answer`

</td>
<td>

`string`

</td>
<td>

是

</td>
<td>

Planner对此查询的综合回答

</td>
</tr>
<tr>
<td>

`tool\_calls`

</td>
<td>

`Array\[ToolCallItem\]`

</td>
<td>

否

</td>
<td>

Agent工具调用的历史

</td>
</tr>
<tr>
<td>

`ext`

</td>
<td>

`map\&lt;string, string\&gt;`

</td>
<td>

否

</td>
<td>

扩展信息。

</td>
</tr>
</tbody></table>

**ToolCallItem**

<table><tbody>
<tr>
<td>

字段名

</td>
<td>

数据类型

</td>
<td>

是否必填

</td>
<td>

描述

</td>
</tr>
<tr>
<td>

tool\_id

</td>
<td>

string

</td>
<td>

是

</td>
<td>

对应AgentID

</td>
</tr>
<tr>
<td>

query

</td>
<td>

string

</td>
<td>

是

</td>
<td>

Planner给Agent的Query

</td>
</tr>
<tr>
<td>

model\_content

</td>
<td>

string

</td>
<td>

是

</td>
<td>

Agent返回给Planner的内容

</td>
</tr>
</tbody></table>

**AgentMemoryItem**

<table><tbody>
<tr>
<td>

字段名

</td>
<td>

数据类型

</td>
<td>

是否必填

</td>
<td>

描述

</td>
</tr>
<tr>
<td>

`content`

</td>
<td>

`string`

</td>
<td>

是

</td>
<td>

记忆项的内容。

</td>
</tr>
</tbody></table>

**Vehi****c****le****State**

<table><tbody>
<tr>
<td>

字段名

</td>
<td>

数据类型

</td>
<td>

是否必填

</td>
<td>

描述

</td>
</tr>
<tr>
<td>

`states`

</td>
<td>

`list\&lt;`[`VechileStateItem`](https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d#share-GLvkddVh3o29EnxCb6ocyWUVnng)`\&gt;`

</td>
<td>

否

</td>
<td>

车辆状态列表。

</td>
</tr>
</tbody></table>

**VechileStateItem**

<table><tbody>
<tr>
<td>

字段名

</td>
<td>

数据类型

</td>
<td>

是否必填

</td>
<td>

描述

</td>
</tr>
<tr>
<td>

`id`

</td>
<td>

`string`

</td>
<td>

是

</td>
<td>

信号ID。

</td>
</tr>
<tr>
<td>

`name`

</td>
<td>

`string`

</td>
<td>

是

</td>
<td>

信号名称。

</td>
</tr>
<tr>
<td>

`subresource`



</td>
<td>

`list\&lt;map\[string\]string\&gt;`

</td>
<td>

否

</td>
<td>

信号参数信息。

map中key为信号状态参数。

map中value为信号状态参数值。

</td>
</tr>
<tr>
<td>

`subresource\_chinese`

</td>
<td>

`list\&lt;map\[string\]string\&gt;`

</td>
<td>

否



</td>
<td>

信号参数信息（中文版本）。

map中key为信号状态参数（中文）。

map中value为信号状态参数值（中文）。

</td>
</tr>
</tbody></table>

**UserState**

<table><tbody>
<tr>
<td>

字段名

</td>
<td>

数据类型

</td>
<td>

是否必填

</td>
<td>

描述

</td>
</tr>
<tr>
<td>

`user\_id`

</td>
<td>

`string`

</td>
<td>

是

</td>
<td>

用户的唯一标识。

</td>
</tr>
<tr>
<td>

`states`

</td>
<td>

`list\&lt;`[`UserStateItem`](https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d#share-TiDtdXUqLoBU3qxpg7Ucof8nnuf)`\&gt;`

</td>
<td>

是

</td>
<td>

用户状态列表。

</td>
</tr>
</tbody></table>

**UserStateItem**

<table><tbody>
<tr>
<td>

字段名

</td>
<td>

数据类型

</td>
<td>

是否必填

</td>
<td>

描述

</td>
</tr>
<tr>
<td>

`name`

</td>
<td>

`string`

</td>
<td>

是

</td>
<td>

状态项的名称。

</td>
</tr>
<tr>
<td>

`value`

</td>
<td>

`string`

</td>
<td>

是

</td>
<td>

状态项的值。

</td>
</tr>
<tr>
<td>

`description`

</td>
<td>

`string`

</td>
<td>

否

</td>
<td>

状态项的描述。

</td>
</tr>
</tbody></table>

**AgentAnswerCommand**

<table><tbody>
<tr>
<td>

字段名

</td>
<td>

数据类型

</td>
<td>

是否必填

</td>
<td>

描述

</td>
</tr>
<tr>
<td>

`command\_type`

</td>
<td>

`integer`

</td>
<td>

是

</td>
<td>

控制类型

枚举值见[AgentCommandType](https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d#share-TgVqdbRMpoacnMxmhsqccAIBn9d)

</td>
</tr>
</tbody></table>

## 枚举值定义

**TriggerMethod**

<table><tbody>
<tr>
<td>

值

</td>
<td>

描述

</td>
</tr>
<tr>
<td>

`1`

</td>
<td>

用户主动输入

</td>
</tr>
<tr>
<td>

`2`

</td>
<td>

根据用户状态自动触发

</td>
</tr>
<tr>
<td>

`3`

</td>
<td>

根据车辆状态自动触发

</td>
</tr>
<tr>
<td>

`4`

</td>
<td>

根据环境变化（如天气、时间）自动触发

</td>
</tr>
<tr>
<td>

`5`

</td>
<td>

定时任务触发

</td>
</tr>
<tr>
<td>

`6`

</td>
<td>

系统预留场景触发

</td>
</tr>
<tr>
<td>

`7`

</td>
<td>

紧急情况触发（如车内有婴儿但锁车无空调）

</td>
</tr>
</tbody></table>

**QueryType**

<table><tbody>
<tr>
<td>

值

</td>
<td>

描述

</td>
</tr>
<tr>
<td>

`1` 

</td>
<td>

标准查询

</td>
</tr>
<tr>
<td>

`2`

</td>
<td>

预查询（默认不启用，如需启用需与座舱沟通对齐方案）

</td>
</tr>
<tr>
<td>

`3`

</td>
<td>

取消当前对话

</td>
</tr>
</tbody></table>

**UserInputSceneType**

<table><tbody>
<tr>
<td>

值

</td>
<td>

描述

</td>
</tr>
<tr>
<td>

`0`

</td>
<td>

`Unknown`未知场景

</td>
</tr>
<tr>
<td>

`1`

</td>
<td>

`GUI`图形用户界面输入

</td>
</tr>
<tr>
<td>

`2`

</td>
<td>

`VUI`语音用户界面输入

</td>
</tr>
<tr>
<td>

`3`

</td>
<td>

`Vision`视觉输入

</td>
</tr>
</tbody></table>

**ChunkType**

<table><tbody>
<tr>
<td>

值

</td>
<td>

描述

</td>
</tr>
<tr>
<td>

`1`

</td>
<td>

Agent 返回的回答

</td>
</tr>
<tr>
<td>

`2`

</td>
<td>

Agent 返回的命令

</td>
</tr>
</tbody></table>

**ContentType**

<table><tbody>
<tr>
<td>

值

</td>
<td>

描述

</td>
</tr>
<tr>
<td>

`1`

</td>
<td>

Content为纯文本

</td>
</tr>
<tr>
<td>

`6`

</td>
<td>

Content为卡片JSON数据，用于端上渲染卡片

</td>
</tr>
<tr>
<td>

`9`

</td>
<td>

透传响应里的Content、Ext给到端上，端上转给对应的AgentID（适用于指令发送场景）

</td>
</tr>
</tbody></table>

**AgentCommandType**

<table><tbody>
<tr>
<td>

值

</td>
<td>

描述

</td>
</tr>
<tr>
<td>

`1`

</td>
<td>

降级到其他处理方式

</td>
</tr>
</tbody></table>

## 接入规范

### 必须实现

- **IsFinish回包**

在Agent完成数据返回之后，必须要发送一帧`is\_finish`为true的响应，座舱侧依赖此字段做数据的最终处理，如发送给端上、落历史表等操作。在`is\_finish`为true的这一帧，允许携带content等内容

### 可选实现

- **主动Fallback**

当接入方Agent发现本次请求无法处理时，可主动Fallback回座舱侧，由座舱侧决定使用哪个Agent回答。

- **透传信息给端上**

当接入方有自定义信息需要透传给到端上时，可以在回包的`ext`字段中增加一个KV对：

Key：delta\_extra\_info

Value：JSON格式的字符串，和端上对齐座舱侧云端不解析

## 鉴权

为保障Agent调用过程中的安全，座舱侧支持API\-KEY和~~AK/SK（座舱指定实现算法）~~两种鉴权方式。

### API Key 签名鉴权

#### 前提条件

API Key由接入方颁发，通过邮件方式将API Key和访问地址等信息一同发送给座舱项目接口人。

#### 签名构造

座舱侧在请求接入方给定的访问地址时，会在 HTTP 请求 header 中按如下方式添加 **`Authorization`** Header，接入方在收到请求后根据**`Authorization`**进行鉴权:

```Thrift
Authorization: Bearer <ARK_API_KEY>
```

### AK/SK 签名鉴权

#### **前提条件**

AK/SK由接入方颁发，通过邮件方式将AK/SK和访问地址等信息一同发送给座舱项目接口人。

#### **签名算法**

<table><tbody>
<tr>
<td>

签名相关必要字段

</td>
<td>

说明

</td>
</tr>
<tr>
<td>

\_timestamp



</td>
<td>

调用时刻的UNIX时间戳，防重放攻击

座舱后台会校验该时刻与收到请求时时刻的间隔，超过30s会丢弃

</td>
</tr>
<tr>
<td>

\_nonce

</td>
<td>

\[0, 65535\]之间的随机整数

</td>
</tr>
</tbody></table>

以  `POST `[`https://xxx\.volcengine\.com/callback/test?\_timestamp=1583244809\&amp;device\_sn=D751`](https://api-vehicle.volcengine.com/callback/test?_timestamp=1583244809&device_sn=D751SG3221LB2600250B&_nonce=99&account_id=144115205364746121)`SG3221LB2600250B\&amp;\_nonce=99\&amp;account\_id=144115205364746121`为例，总共分为6步：

1. **构造规范化的请求字符串**

    对URL中的参数，按其key进行字典排序，重新组合，得到

```Makefile
CanonicalizedQueryStr="_nonce=99&_timestamp=1583244809&account_id=144115205364746121&device_sn=D751SG3221LB2600250B"
```

2. **构造签名字符串**

将**HTTP method**（GET、POST、PUT、DELETE）， 第一步构造的**“规范化的请求字符串”**， 再加上 **HTTP body的md5值**（如果body为空，就不需要这一部分），拼接在一起，**中间用 \&\#34;\\n\&\#34; 分隔** 

```Python
StrToSign=HTTPMethod+"\n"+CanonicalizedQueryStr+"\n"+md5(HTTPBody)+"\n"
```

3. **用HMAC\-SHA256算法计算哈希值**

用SK作为密钥，采用HMAC\-SHA256 算法来计算哈希值，该算法的好处是碰撞几率小。

```Apache
Hash=HMAC-SHA256(sk, StrToSign)
```

4. **用Base64计算签名值**

因为第4步计算出来的hash值是不可打印的，所以再用 base64处理一下

```Makefile
Sign=Base64(Hash)
```

5. **添加签名**

座舱侧在请求接入方给定的访问地址时，会在 HTTP 请求 header 中按如下方式添加 **`Authorization`** Header，接入方在收到请求后根据**`Authorization`**进行鉴权:

```Plain Text
Authorization: VAuth-V1:{$AK}:{$Sign}
```

6. **签名验证**

在收到座舱发起的Agent请求后，接入方的签名验证流程参考如下：

- 从Header中取出Authorization，通过前缀VAuth\-V1判断是AK/SK加密方式

- 从字符串中截取出AK和Sign

- 判断AK是否合法，请求是否在有效期内

- 按照签名算法计算一次得到NewSign，判断NewSign和接口中传入的Sign是否相等




