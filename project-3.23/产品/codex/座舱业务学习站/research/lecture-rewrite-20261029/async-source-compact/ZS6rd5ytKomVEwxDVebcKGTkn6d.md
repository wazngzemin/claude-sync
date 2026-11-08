# 三方Agent接入协议
# 变更记录
版本
变更内容
变更日期
变更人
v1\.0
- 首次新增文档
2025年8月27日
吕鹏浩
v1\.1
- 新增接入须知
2026年1月22日
v1\.2
- 更新响应字段\-支持定义content内容格式（新增卡片数据结构）
2026年2月12日
吕鹏浩
v1\.3
- account\_id修改为非必传参数
2026年5月13日
吕鹏浩
v1\.4
- 更新端状态字段，去除冗余参数
2026年8月13日
吕鹏浩
# 接入须知
您需要与我们沟通要实现的Agent的能力和形态，如是否纯车端自闭环（不依赖火山汽车座舱的云端能力和链路），如果是这样，则建议优先走FunctionCalling的方式接入（可参阅 [座舱大模型 Function Calling 协议适配说明](https://bytedance.larkoffice.com/docx/N4Z3diXhMocbUdxHeCEcEQaEnSh)）。
作为Agent开发者，您需要提供以下信息
1. Agent中文名称
2. Agent英文名称
3. Agent功能描述
4. Agent请求时Query的描述
5. 实现了[三方Agent接入协议](https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d#doxcnmvwIyrlnNDxg2JHs68o7lh)的**URL（https）**
6. 明确鉴权方式，提供鉴权需要的API Key或AK/SK
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
字段名
数据类型
是否必填
描述
`chat\_id`
`string`
是
话题 ID，贯彻多轮对话
`question\_id`
`string`
是
单轮对话的QA ID
`conversation\_id`
`string`
是
会话id，会话列表中的一组对话使用同一个id
`agent\_id`
`string`
是
Agent唯一标识
`protocol\_version`
`string`
是
协议版本号
`query`
`Object\&lt;`[`Query`](https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d#share-UQpod7wARoA01gxzz8pccf9Ingb)`\&gt;`
是
本轮对话的查询对象
`agent\_context`
`Object\&lt;`[`AgentContext`](https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d#share-K4xVdACuNo4wZUxbiiTc3VlqnOb)`\&gt;`
是
调用 Agent 的上下文信息
`common\_info`
`Object\&lt;`[`CommonInfo`](https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d#share-BSQUd8CuDouqfZxIotlcikZ7nQ2)`\&gt;`
是
通用参数信息
`ext`
`map\[string\]string`
否
扩展信息，键值对形式
`trace\_id`
`string`
是
TraceID，用于链路追踪\(可通过此ID关联客户端发起的一次请求里全部操作\)
- **Header：**
字段名
数据类型
是否必填
描述
`trace\-id`
`string`
是
TraceID，用于链路追踪\(可通过此ID关联客户端发起的一次请求里全部操作\)
### 响应结构（自定义Agent\-\&gt;座舱云）
SSE每帧响应中的data数据结构定义如下
- **Success \(200 OK\) Response Body**:
字段名
数据类型
描述
`chunk\_type`
`integer`
回复块的类型
枚举值见[ChunkType](https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d#share-W14OdVAJOoeowYxh8ARcP1PfnEc)
`content\_type`
`integer`
定义content内容类型
枚举值见[ContentType](https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d#share-SQqCdNFr8o364qxePchcuLyknBd)
`agent\_id`
`string`
Agent 的唯一标识，和请求参数对应
`is\_finish`
`boolean`
是否为最后一个响应块
`finish\_reason`
`string`
结束原因，`is\_finish` 为 true 时存在
`content`
`string`
用于展示给用户的内容
`tts\_content`
`string`
用于 TTS 的内容，如果为 null 则使用 `content`
`model\_content`
`string`
用于 Planner总结时的上下文内容
`reasoning\_content`
`string`
思考内容
`command`
`object\&lt;`[`AgentAnswerCommand`](https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d#share-Xqc2dA2yio8k9bxtzNScOitGndf)`\&gt;`
命令对象，如跳转或降级；正常情况请勿返回此字段
`ext`
`map\[string\]string`
扩展信息，键值对形式
`error\_code`
`integer`
错误码，成功时为0
`error\_message`
`string`
错误信息，成功时为空字符串
- **Error Response Body**:
字段名
数据类型
描述
`error\_code`
`integer`
错误码
`error\_message`
`string`
错误信息
- **Header：**
字段名
数据类型
是否必填
描述
`trace\-id`
`string`
是
TraceID，用于链路追踪\(可通过此ID关联客户端发起的一次请求里全部操作\)
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
字段
值类型
备注
`widget\_id`
String
卡片唯一ID，和客户端定义好
`widget\_data`
String
和客户端定义的卡片数据
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
字段名
数据类型
是否必填
描述
`trigger\_method`
`Enum\&lt;`[`TriggerMethod`](https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d#share-U1nndekr4ovvvyx9AUkcc0OMnne)`\&gt;`
是
触发来源
枚举值类型：integer
`query\_type`
`Enum\&lt;`[`QueryType`](https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d#share-EvsedrIlKoik1qxBAYTcwsFqnrc)`\&gt;`
是
查询类型
枚举值类型：integer
`user\_input\_scene\_type`
`Enum\&lt;`[`UserInputSceneType`](https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d#share-VEQzdeWWOomCTMxxh0rcVnUZnhc)`\&gt;`
否
用户输入场景
枚举值类型：integer
`content`
`string`
是
用户输入的具体内容
`round\_id`
`i32`
是
ASR 识别过程中的轮次 ID
**CommonInfo**
字段名
数据类型
是否必填
描述
`channel`
`string`
是
渠道名
`channel\_app\_id`
`string`
是
渠道AppID
`vehicle\_id`
`string`
是
设备唯一ID
`vehicle\_type`
`string`
是
车型参数
`vehicle\_name`
`string`
是
车型名称
`longitude`
`float`
否
当前位置经度
`latitude`
`float`
否
当前位置维度
`account\_id`
`string`
否
车企账号ID
`doubao\_uid`
`string`
否
豆包账号加密id
`city`
`string`
否
城市，例如：上海
`district`
`string`
否
行政区，例如：徐汇
**AgentContext**
字段名
数据类型
是否必填
描述
`history`
`list\&lt;`[`AgentHistoryItem`](https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d#share-NNoBd9owroupbHxLIyucglNWnDe)`\&gt;`
否
对话历史记录
`long\_term\_memory`
`list\&lt;`[`AgentMemoryItem`](https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d#share-YNaTdaTPXoyJLixX9ancS42VnDa)`\&gt;`
否
长期记忆
`short\_term\_memory`
`list\&lt;`[`AgentMemoryItem`](https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d#share-YNaTdaTPXoyJLixX9ancS42VnDa)`\&gt;`
否
短期记忆
`vehicle\_state`
`object``\&lt;`[`VehicleState`](https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d#share-TnBvdq9ZiopqWzxVGcJcsalWnfe)`\&gt;`
否
车辆状态
`user\_state`
object
否
用户状态
**AgentHistoryItem**
字段名
数据类型
是否必填
描述
`query`
[`AgentQuery`](https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d#share-M2gidarvooeyfNxFF57cjS3Wnad)
是
用户的查询对象。
`answer`
`string`
是
Planner对此查询的综合回答
`tool\_calls`
`Array\[ToolCallItem\]`
否
Agent工具调用的历史
`ext`
`map\&lt;string, string\&gt;`
否
扩展信息。
**ToolCallItem**
字段名
数据类型
是否必填
描述
tool\_id
string
是
对应AgentID
query
string
是
Planner给Agent的Query
model\_content
string
是
Agent返回给Planner的内容
**AgentMemoryItem**
字段名
数据类型
是否必填
描述
`content`
`string`
是
记忆项的内容。
**Vehi****c****le****State**
字段名
数据类型
是否必填
描述
`states`
`list\&lt;`[`VechileStateItem`](https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d#share-GLvkddVh3o29EnxCb6ocyWUVnng)`\&gt;`
否
车辆状态列表。
**VechileStateItem**
字段名
数据类型
是否必填
描述
`id`
`string`
是
信号ID。
`name`
`string`
是
信号名称。
`subresource`
`list\&lt;map\[string\]string\&gt;`
否
信号参数信息。
map中key为信号状态参数。
map中value为信号状态参数值。
`subresource\_chinese`
`list\&lt;map\[string\]string\&gt;`
否
信号参数信息（中文版本）。
map中key为信号状态参数（中文）。
map中value为信号状态参数值（中文）。
**UserState**
字段名
数据类型
是否必填
描述
`user\_id`
`string`
是
用户的唯一标识。
`states`
`list\&lt;`[`UserStateItem`](https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d#share-TiDtdXUqLoBU3qxpg7Ucof8nnuf)`\&gt;`
是
用户状态列表。
**UserStateItem**
字段名
数据类型
是否必填
描述
`name`
`string`
是
状态项的名称。
`value`
`string`
是
状态项的值。
`description`
`string`
否
状态项的描述。
**AgentAnswerCommand**
字段名
数据类型
是否必填
描述
`command\_type`
`integer`
是
控制类型
枚举值见[AgentCommandType](https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d#share-TgVqdbRMpoacnMxmhsqccAIBn9d)
## 枚举值定义
**TriggerMethod**
值
描述
`1`
用户主动输入
`2`
根据用户状态自动触发
`3`
根据车辆状态自动触发
`4`
根据环境变化（如天气、时间）自动触发
`5`
定时任务触发
`6`
系统预留场景触发
`7`
紧急情况触发（如车内有婴儿但锁车无空调）
**QueryType**
值
描述
`1`
标准查询
`2`
预查询（默认不启用，如需启用需与座舱沟通对齐方案）
`3`
取消当前对话
**UserInputSceneType**
值
描述
`0`
`Unknown`未知场景
`1`
`GUI`图形用户界面输入
`2`
`VUI`语音用户界面输入
`3`
`Vision`视觉输入
**ChunkType**
值
描述
`1`
Agent 返回的回答
`2`
Agent 返回的命令
**ContentType**
值
描述
`1`
Content为纯文本
`6`
Content为卡片JSON数据，用于端上渲染卡片
`9`
透传响应里的Content、Ext给到端上，端上转给对应的AgentID（适用于指令发送场景）
**AgentCommandType**
值
描述
`1`
降级到其他处理方式
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
Authorization: Bearer
```
### AK/SK 签名鉴权
#### **前提条件**
AK/SK由接入方颁发，通过邮件方式将AK/SK和访问地址等信息一同发送给座舱项目接口人。
#### **签名算法**
签名相关必要字段
说明
\_timestamp
调用时刻的UNIX时间戳，防重放攻击
座舱后台会校验该时刻与收到请求时时刻的间隔，超过30s会丢弃
\_nonce
\[0, 65535\]之间的随机整数
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