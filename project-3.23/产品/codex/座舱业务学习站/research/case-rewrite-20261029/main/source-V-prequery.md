# 服务端技术评审\-多级VAD策略

<div class="callout">

该技术方案只针对豆包文本链路请求。

现状：豆包文本链路不支持预请求。

</div>

## 需求背景

[【AI汽车\-PRD】多级VAD产品体验](https://bytedance.larkoffice.com/wiki/FzViwCNb2iF43QkB5eDcD3D2nJh)

在ASR识别时，有三级的 VAD 处理。（端侧调用思必驰ASR接口能力提供）

1. Soft VAD：快速检测用户是否说完话（时间相对较短）

2. Hard VAD：对快速检测用户是否说完话做确认（时间相对较长）

3. 语义 VAD：根据句子完整性判断用户是否说完话



Meego: [\[需求\]✅【AI汽车】多级VAD策略](https://meego.larkoffice.com/telematics/story/detail/6796681344?parentUrl=%2Ftelematics%2Fstory%2Fhomepage&openScene=4)



## 预期收益

文本链路整体耗时减少200ms左右

1. 基于的 Soft VAD \+ 语义 VAD 得到的预请求 Query 做一些前置**无状态任务**处理。

2. 当 Hard VAD \+ 语义 VAD 确认最终 Query 时，通过直接获取前置已经处理的任务结果来加速当前正式请求的速度，从而降低链路耗时。



## 字段说明

<table><tbody>
<tr>
<td>

字段名

</td>
<td>

字段类型

</td>
<td>

字段含义

</td>
<td>

字段值

</td>
<td>

字段值含义

</td>
</tr>
<tr>
<td rowspan="2">

QueryType



</td>
<td rowspan="2">

Integer

</td>
<td rowspan="2">

请求类型

</td>
<td>

1

</td>
<td>

正式请求

</td>
</tr>
<tr>
<td>

2

</td>
<td>

预请求

</td>
</tr>
<tr>
<td>

RoundID

</td>
<td>

Integer

</td>
<td>

轮次ID

- 每轮ASR识别过程中，此值默认重置从1开始，每预请求一次此值加1。最后一轮正式请求也在预请求基础上加1。

</td>
<td>



</td>
<td>



</td>
</tr>
</tbody></table>



## 概要设计

1. 预请求收益介绍

> 通过Soft VAD \+ 语义VAD 标识多次预请求前置模型请求来换取正式请求耗时
> 
> 



## 详细设计

### 方案一：

<div class="callout">

不更改豆包文本链路代码，通过extra信息透传请求标识，通过extra相关字段，控制预请求消息不落库（不进入对话历史）

</div>

#### 实现方式

1. 通过豆包Extra信息透传端侧请求信息 RequestID \+ QueryType \+ RoundID来识别是预请求还是正式请求，以及请求的轮次。

2. 通过agent返回extra信息调整豆包代码控制预请求消息不落库

#### 存在问题

> 以下问题当前暂无较好的解决方案
> 
> 

1. 对于豆包已经是两次请求，第二个请求会打断第一个，可能导致预请求没有发送到 AIDV 服务就被中断了。

2. 豆包请求发送后，端侧有相关UI交互问题（logo上思考中的小云朵图标），多次预请求和正式请求，可能导致聆听态和思考态的不断切换。



### 方案二（舍弃）：

<div class="callout">

更新豆包逻辑，让文本链路支持预请求。

</div>

端侧SDK中支持传入的参数较少，对于一些siganl类的信息都是在云端维护，无法从端侧直接区分预请求。所以只能通过端侧在extra中自定义参数，云端基于extra去解析修改豆包相关请求信号。



对豆包现有链路影响：

1. 侵入性大：豆包文本链路每个请求是独立的，没有对一段对话预请求相关标识，通过extra中业务信息处理通用交互逻辑不友好

2. 影响面未知：修改为预请求signal后，对文本链路影响未知，容易踩坑，梳理成本较高。

    文本链路下doubao chat\_gateway 服务请求默认配置

    1. Signal（请求标识）：固定为1（表示正式请求）

    2. PSessionId（轮次信息）：固定为1 （标识第一轮）



### 方案三（推荐）

<div class="callout">

端侧 ASR 预请求直接通过 http 请求对接 Aidv 服务接口。

预请求流量不过豆包，保证豆包文本链路中的所有请求都是正式请求，与豆包逻辑保持一致。

</div>

#### 交互时序图

#### 数据缓存

1. Redis 存储设计

> pre\_query:\{$module\}:\{$channel\}:\{$chat\_id\}:\{$request\_id\}:\{$round\_id\}
> 
> 



<table><tbody>
<tr>
<td>

序号

</td>
<td>

模块

</td>
<td>

Value类型

</td>
<td>

缓存时间

</td>
<td>

备注

</td>
</tr>
<tr>
<td>

1

</td>
<td>

intent\_and\_refusal

</td>
<td>

String

</td>
<td>

2min



</td>
<td>

缓存预请求阶段结果（意图、拒识、简单复杂仲裁）



</td>
</tr>
</tbody></table>

#### 存在问题

##### 对话历史对齐

<div class="callout">

在 AIDV 服务中对话历史的组装是通过 Channel \+ ChatID 来对应的，ChatID 对应了对包链路中 SectionID。

</div>

当前问题点在于，端侧还未发起对话时如何获取到豆包最新的 SectionID 。以便通过这个参数构建 ChatID 请求 AIDV 服务的预请求接口来对应对话历史上下文信息。



1. 通过任意门抓包，在豆包开始新话题时，会获取新SectionID（已和@任少东确认，端侧能获取到最新的 SectionID 信息）



#### 接口设计

公共参数参考公版文档：[公版\-AI汽车接口访问指南](https://bytedance.larkoffice.com/docx/OZjjdzEldo3J1pxXQ0OcW5Ugn5d)

##### 预请求处理

- Method: `POST`

- Path: `/aidv/v1/pre\_query`

**参数**

<table><tbody>
<tr>
<td>

参数名

</td>
<td>

参数位置

</td>
<td>

参数格式

</td>
<td>

是否必须

</td>
<td>

说明

</td>
</tr>
<tr>
<td>

chat\_id

</td>
<td>

公参/query

</td>
<td>

String

</td>
<td>

否

</td>
<td>

如果没有传递，则需要传递history信息

</td>
</tr>
<tr>
<td>

query

</td>
<td>

Body Json

</td>
<td>

Object\&lt;Query\&gt;

</td>
<td>

是

</td>
<td>

用户请求信息

</td>
</tr>
<tr>
<td>

coordination\_info

</td>
<td>

Body Json

</td>
<td>

Object\&lt;CoordinationInfo\&gt;

</td>
<td>

否

</td>
<td>

端云协同信息

</td>
</tr>
</tbody></table>

Query结构

<table><tbody>
<tr>
<td>

参数名

</td>
<td>

参数位置

</td>
<td>

参数格式

</td>
<td>

是否必须

</td>
<td>

说明

</td>
</tr>
<tr>
<td>

trigger\_method

</td>
<td>

Body Json

</td>
<td>

Integer

</td>
<td>

是

</td>
<td>

触发来源

- 1：用户输入

</td>
</tr>
<tr>
<td>

query\_type

</td>
<td>

Body Json

</td>
<td>

Integer

</td>
<td>

是

</td>
<td>

query类型

- 1：正式 Query

- 2：预请求 Query

</td>
</tr>
<tr>
<td>

user\_input\_scene\_type

</td>
<td>

Body Json

</td>
<td>

Integer

</td>
<td>

否

</td>
<td>

用户输入场景：

- 1：屏幕输入

- 2：语音输入

- 3：视觉输入

- 4：主动推荐

</td>
</tr>
<tr>
<td>

content

</td>
<td>

Body Json

</td>
<td>

String

</td>
<td>

是

</td>
<td>

用户 Query

</td>
</tr>
<tr>
<td>

round\_id

</td>
<td>

Body Json

</td>
<td>

Integer

</td>
<td>

否

</td>
<td>

请求轮次（含预请求时必填）

- 每轮ASR识别过程中，此值默认重置从1开始，每预请求一次此值加1。最后一轮正式请求也在预请求基础上加1

</td>
</tr>
</tbody></table>

CoordinationInfo结构

<table><tbody>
<tr>
<td>

参数名

</td>
<td>

参数位置

</td>
<td>

参数格式

</td>
<td>

是否必须

</td>
<td>

说明

</td>
</tr>
<tr>
<td>

request\_id

</td>
<td>

Body Json

</td>
<td>

String

</td>
<td>

否



</td>
<td>

请求ID

- 当含预请求时，用户单次Query的预请求和正式请求请求ID应该保持一致

</td>
</tr>
<tr>
<td>

sound\_zone

</td>
<td>

Body Json

</td>
<td>

String

</td>
<td>

否

</td>
<td>

音区信息

</td>
</tr>
</tbody></table>

**请求body示例**

```JSON
{
    "chat_id": "chat_id_1",
    "query": {
        "trigger_method": 1,
        "user_input_scene_type": 2,
        "content": "我好热",
        "query_type": 2,
        "round_id": 1
    },
    "coordination_info": {
        "request_id": "reqeust_1",
        "sound_zone":"主驾"
    }
}
```

**响应结构**

```JSON
{
    "data": {
        "success": true 
    },
    "errno": 0,
    "msg": "success"
}
```



## 人力评估

<table><tbody>
<tr>
<td>

模块

</td>
<td>

细分工作

</td>
<td>

工作量预估

</td>
</tr>
<tr>
<td rowspan="3">

预请求处理

</td>
<td>

预请求接口处理

</td>
<td rowspan="3">

2\.5d



</td>
</tr>
<tr>
<td>

豆包文本链路关联预请求

</td>
</tr>
<tr>
<td>

预请求优化耗时埋点

</td>
</tr>
</tbody></table>



## 测试方案

1. 通过端侧无预请求 Apk 与含预请求 Apk 测试分别测试

    1. 通过 fornax 查看单个请求模块打点耗时

    2. 通过云端预埋 metric，查看批量耗时（从云端接收豆包请求到意图相关模型结束的时间段耗时）



