# 【AI 汽车】静态 Advisor 来源标识与 ActionList 透传方案

<table><tbody>
<tr>
<td>

**需求类型**

</td>
<td>

**产品需求**

</td>
</tr>
<tr>
<td>

Meego 链接

</td>
<td>

[\[需求\]静态adv\-actionlist链路](https://meego.larkoffice.com/telematics/story/detail/7373081056)

</td>
</tr>
<tr>
<td>

PRD 链接

</td>
<td>

[【仅对内】静态 Advisor  PRD（ for AIVA）v0\.6](https://pq3b44yw2t9.feishu.cn/wiki/QU0PwxnaQiT9ZhkH2bwcwiuBnQg)

</td>
</tr>
<tr>
<td>

产品

</td>
<td>

@徐洋@赵益红

</td>
</tr>
<tr>
<td>

研发 Owner

</td>
<td>

服务端：@姜涵@吕鹏浩

客户端：@李鑫

</td>
</tr>
<tr>
<td>

背景

</td>
<td>

舒适 Advisor 需要将对应车控的 action lsit 下发到舒适空间进行渲染

</td>
</tr>
<tr>
<td>

目标

</td>
<td>

舒适 Advisor 打通舒适空间。

</td>
</tr>
<tr>
<td>

状态

</td>
<td>

对齐链路，开发中。0911 提测

</td>
</tr>
<tr>
<td>

联调环境

</td>
<td>

ppe\_aidv\_advisor 

</td>
</tr>
</tbody></table>

现有代码已经具备「静态 Advisor 推荐上下文 → Planner → 车控回包 → AI Bar 上报」的基础链路，本需求主要补齐来源标识和客户端 ActionList 的透传。

最小方案主要修改 AIDV 和客户端，AI Bar 接收方配合扩展入参；在当前 AIDV 调用 DPFM 的路径中，DPFM 无需为此改动车控生成逻辑。

本文方案需要客户端和 AI Bar 接收方配合接入。结果上报范围限定在赛力斯静态 Advisor ，具体请求与回包对比及验证限制见文末新增示例。

## 现有基础与缺口

- 推荐下发：`GenerateRecommend` 缓存原始 advice、advisor\_types 及用户/车辆信息，并向客户端发送 recommend\_id。客户端再携带推荐发起 query；`beforeFlow` 恢复上下文、设置 `TriggerMethodStaticAdvisor`，并在删除推荐缓存前把上报快照放进 `ChatRequest\.Ext`。

- 车控生成与执行：DPFM 的 `function\_call` 插件返回包含 functions 的 Observation；AIDV 的 `AgentVehicleControl\.AfterResponse` 解析、补充声区后，通过 Frontier 下发并等待客户端回包。因此，来源字段可以在 AIDV 最终下发时补充。

- 结果上报：原有 `VehicleControlResultHandler` 和 `POST /static\-advisor/advisor/ai\_bar` 已支持成功车控的文本上报；本次补充客户端 `action\_list` 接收、保留及 Planner 整轮汇总上报，`director\_execution\_content` 仍取自车控执行反馈。

## 目标链路

客户端按每次车控调用提供本次成功动作的 `action\_list`（`\[\]string`）。AIDV 暂存成功结果，直到本轮 Planner 明确不再调用任何工具，再合并并上报 AI Bar。列表不经过模型生成或改写，客户端不负责整轮汇总。

## 协议约定

以下字段及行为以当前 AIDV 代码为准，供客户端和 AI Bar 接收方接入。客户端业务 ActionList 对应 JSON 字段 `action\_list`，类型为 `\[\]string`；Planner 输出中同名的 `action\_list` 表示工具调用决策，两者不是同一个列表。

<table><tbody>
<tr>
<td>

位置

</td>
<td>

新增字段

</td>
<td>

约定

</td>
</tr>
<tr>
<td>

车控下行 FunctionResponse

</td>
<td>

`source`：可选 string

</td>
<td>

主动推荐赋值 `static\_advisor`，普通车控省略。字段与 `functions` 同级，位于 Frontier 外层 `message` 字符串解码后的 JSON 内。

</td>
</tr>
<tr>
<td>

客户端车控业务回包

</td>
<td>

`action\_list`：可选字符串数组（`\[\]string`）

</td>
<td>

与 `vehicle\_control\_exec\_status` 同级，由客户端提供本次调用实际成功的动作；沿用原有 `session\_id` 匹配回包。混合成功/失败时也由客户端保证列表只包含成功动作。

</td>
</tr>
<tr>
<td>

AI Bar 请求体

</td>
<td>

`action\_list`：可选字符串数组（`\[\]string`）

</td>
<td>

Planner 明确不再调用工具后，按调用顺序合并成功结果的列表，保留每个字符串的内容、顺序及重复项；原有三个字段保留，成功调用的 `director\_execution\_content` 用换行合并。

</td>
</tr>
</tbody></table>

车控下行示意（仅展示业务包；参数值以原有车控协议为准）：

```json
{
  "source": "static_advisor",
  "functions": [
    {"function_code": "空调温度调节", "params": [{"value": "22"}]}
  ],
  "sound_zone": "原有声区值",
  "is_simple_vehicle_control": false
}
```

客户端回包示意（client\_action\_1 是字符串占位；字符串的业务内容由客户端定义，数组元素必须为 string）：

```json
{
  "user_query": "有点热",
  "vehicle_control_exec_status": [
    {"function_code": "空调温度调节", 
    "status": 0, 
    "msg": "执行成功", 
    "action_list": ["client_action_1"]}
  ],
}
```

若本轮仅有上述一次成功车控，Planner 明确不再调用工具后，AI Bar 请求体在原有三个字段旁增加 `\&\#34;action\_list\&\#34;: \[\&\#34;client\_action\_1\&\#34;\]`。该字段作为 JSON 字符串数组发送。

## 代码改动

1. **AIDV 下行打标。** 在 `types\.FunctionResponse` 增加 source；`AfterResponse` 根据服务端恢复的静态 Advisor 来源设置字段。复用请求中的上报快照关联原 advice，不依靠 query 文本前缀或模型输出判断来源。

2. **客户端返回列表。** 识别 `source=static\_advisor`，在原有业务回包中同时返回执行状态和本次成功动作的 `\[\]string`。来源标识不改变端侧既有执行/确认规则；AIDV 将静态 Advisor 的 `is\_simple\_vehicle\_control` 设为 false，统一等待真实回包并保留 Observation。客户端每次照常回包，不等待 Planner 整轮结束。

3. **AIDV 保留结构化结果。**`VehicleControlExecResult` 和 `AgentVehicleObservation` 保存端侧 `action\_list`，通过 Collector / Listener 交给 `VehicleControlResultHandler`。使用原始 JSON 保存并独立复制，读写走 `config\.Json`；只做 `\[\]string` 类型校验，不解释或改写字符串内容。

4. **成功结果暂存，整轮统一上报。** 静态 Advisor 上下文有效、工具调用与响应无错误且回包至少一项 `status=0` 时，Handler 才收集结果；合法的 `action\_list` 不能绕过成功门槛。每次 Planner 流程使用独立的 `AIBarReportCollector`，工具结束只暂存；直到 Planner 明确输出工具调用 `action\_list=\[\]`，才合并所有成功车控结果并调用一次 AI Bar。期间继续调用车控或其他工具均不上报；没有成功结果则不上报。



## 请求体与返回体变更对比

以下示例对应本次服务端代码改动，适用范围为能够明确关联到单条 advice 的赛力斯静态 Advisor 。函数参数、声区、Advisor 类型以及 ActionList 元素均为示例值，实际由现有业务和客户端协议决定；服务端不会生成这些 ActionList 元素。

**层级说明：**车控下发和客户端回包的代码块展示的是 Frontier `message` 解码后的业务 JSON。传输层的 `session\_id`、`message\_type`、`request\_id`、`planner\_round\_id` 不变，`message` 仍按原协议传 JSON 字符串。新增 `source` 放在业务 JSON 中，与 `functions` 同级，不放进函数参数，也不加在 Frontier 信封最外层。

### 例 1：静态 Advisor 触发车控，客户端返回动作列表

原 advice 为“有点热”，Planner 调用车控的 query 为“空调调至22度”。本例先按原本就需要等待回包的车控路径对比。

<table><tbody><tr>
<td>

**AIDV → 客户端：改动前**

```json
{
  "functions": [
    {"function_code": "空调温度调节", "params": [{"value": "22"}]}
  ],
  "sound_zone": "原有声区值",
  "is_simple_vehicle_control": false
}
```

</td>
<td>

**AIDV → 客户端：改动后**，只增加同级来源字段。

```json
{
  "functions": [
    {"function_code": "空调温度调节", "params": [{"value": "22"}]}
  ],
  "sound_zone": "原有声区值",
  "is_simple_vehicle_control": false,
  "source": "static_advisor"
}
```

</td>
</tr></tbody></table>

<table><tbody><tr>
<td>

**客户端 → AIDV：原回包**

```json
{
  "user_query": "空调调至22度",
  "vehicle_control_exec_status": [
    {"function_code": "空调温度调节", "status": 0, "msg": "已调至22度"}
  ]
}
```

</td>
<td>

**客户端 → AIDV：接入新协议后的回包**，客户端在原执行结果旁增加数组字段。

```json
{
  "user_query": "空调调至22度",
  "vehicle_control_exec_status": [
    {
      "function_code": "空调温度调节", 
      "status": 0, 
      "msg": "已调至22度",
      "action_list": ["client_action_1"]
    }
  ],
  
}
```

</td>
</tr></tbody></table>

<table><tbody><tr>
<td>

**AIDV → AI Bar：改动前的 POST /static\-advisor/advisor/ai\_bar 请求体**

```json
{
  "advisor_advice": "有点热",
  "director_execution_content": "执行指令：空调调至22度，执行结果：空调温度调节，已调至22度。",
  "advisor_types": "comfort_advisor"
}
```

</td>
<td>

**AIDV → AI Bar：改动后的请求体**，本例在 Planner 明确不再调用工具后发送；保留原有字段，增加客户端字符串数组。

```json
{
  "advisor_advice": "有点热",
  "director_execution_content": "执行指令：空调调至22度，执行结果：空调温度调节，已调至22度。",
  "advisor_types": "comfort_advisor",
  "action_list": ["client_action_1"]
}
```

</td>
</tr></tbody></table>

`advisor\_advice` 仍来自原推荐快照，不用 Planner 的车控 query 替代；原有“策略：”后缀裁剪、URL 查询参数和鉴权逻辑不变。AI Bar 接口返回体不新增字段，成功返回仍按原 `errno/msg` 协议处理，例如：

```json
{"errno": 0, "msg": ""}
```

### 例 2：静态 Advisor 命中简单单 FC 车控

<table><tbody><tr>
<td>

**改动前的下发包：**简单单 FC 为即发即走，服务端不等待这次端侧执行结果。

```json
{
  "functions": [
    {"function_code": "空调温度调节", "params": [{"value": "22"}]}
  ],
  "sound_zone": "原有声区值",
  "is_simple_vehicle_control": true
}
```

</td>
<td>

**改动后的下发包：**明确归因的静态 Advisor 增加来源标记，并将简单标记设为 false，进入原有等待回包路径。

```json
{
  "functions": [
    {"function_code": "空调温度调节", "params": [{"value": "22"}]}
  ],
  "sound_zone": "原有声区值",
  "is_simple_vehicle_control": false,
  "source": "static_advisor"
}
```

</td>
</tr></tbody></table>

改动后客户端按例 1 返回执行状态和 `action\_list`，AIDV 暂存成功结果，等 Planner 明确不再调用工具后统一上报。简单多 FC 原来虽等待回包，但后续只输出 NLG；静态 Advisor 现在也会保留包含 ActionList 的结构化 Observation。普通用户的简单车控保持原有路径。

### 例 3：车控全部失败，客户端明确返回空列表

原 advice 为“后背有点热”，车控 query 为“打开座椅通风”。

<table><tbody><tr>
<td>

**客户端 → AIDV：改动前**

```json
{
  "user_query": "打开座椅通风",
  "vehicle_control_exec_status": [
    {"function_code": "座椅加热通风开关", "status": 1, "msg": "当前条件不支持"}
  ]
}
```



</td>
<td>

**接入新协议后的客户端回包：**使用 `\[\]` 表示客户端明确提供了空的动作列表，不表示执行成功。

```json
{
  "user_query": "打开座椅通风",
  "vehicle_control_exec_status": [
    {
      "function_code": "座椅加热通风开关",
      "status": 1, 
      "msg": "当前条件不支持",
      "action_list": []}
  ],
  
}
```

</td>
</tr></tbody></table>

<table><tbody><tr>
<td>

**AIDV → AI Bar：改动前**

所有 status 均非成功时，不触发原有 AI Bar 文本上报，本场景无请求体。

</td>
<td>

**AIDV → AI Bar：改动后**

本次车控全部失败，即使返回合法的 `\[\]` 或非空字符串数组，也不收集该调用的文本和动作列表。本例没有其他成功车控，因此无 AI Bar 请求体；若本轮有其他成功调用，只在 Planner 明确不再调用工具时汇总那些成功结果。

</td>
</tr></tbody></table>

### 例 4：ActionList 元素由客户端定义，服务端不改内容

`action\_list` 的类型固定为字符串数组 `\[\]string`；每个字符串的内容由客户端定义。下面仅用占位字符串说明字段形态，不约定字符串内部的业务结构。前提是本次车控调用无错误，且客户端回包至少一项 `status=0`。

<table><tbody><tr>
<td>

**AI Bar 请求：改动前**

不包含该字段。

</td>
<td>

**AI Bar 请求：改动后（字段片段）**

```json
{
  "action_list": [
    "客户端定义的动作字符串 A",
    "客户端定义的动作字符串 B"
  ]
}
```

</td>
</tr></tbody></table>

改动前该字段不会进入 AI Bar 请求体；改动后，服务端只校验外层数组及每项均为字符串，不解析或改写字符串内容。客户端每次只回传本次车控的列表，AIDV 先暂存；当 Planner 明确不再调用工具时，按 Planner 登记的调用顺序拼接本轮成功调用的数组，再统一上报。保留每个列表内的元素顺序、重复字符串和空字符串，不对动作去重，也不把整个数组变为 `\&\#34;action\_list\&\#34;: \&\#34;\[\.\.\.\]\&\#34;` 这样的 JSON 字符串。

### 例 5：普通车控、旧客户端及异常输入兼容

**场景 1：普通用户 query 触发车控**

<table><tbody><tr>
<td>

**改动前**

无 source；不走静态 Advisor 的 AI Bar 上报

</td>
<td>

**改动后**

保持不变，不增加 source，也不新增静态 Advisor 上报

</td>
</tr></tbody></table>

**场景 2：静态 Advisor ，但旧客户端未返回 action\_list，或返回 null**

<table><tbody><tr>
<td>

**改动前**

至少一个车控成功时上报原有文本字段

</td>
<td>

**改动后**

仍须调用无错误且至少一项 `status=0`；先暂存成功调用的文本，等 Planner 明确不再调用工具时统一上报。只有本轮所有已收集的成功调用都未提供列表（缺省或 `null`）时，AI Bar 请求才省略 `action\_list`，不补造数组。

</td>
</tr></tbody></table>

**场景 3：静态 Advisor ，客户端返回 \[\] 或非空字符串数组**

<table><tbody><tr>
<td>

**改动前**

不会透传列表，仍受旧成功状态门槛限制

</td>
<td>

**改动后**

仅接受 `\[\]string`，包括显式空数组 `\[\]`；仍须调用无错误且至少一项 `status=0`。符合条件则暂存，Planner 明确不再调用工具时合并上报；全部失败的调用不参与汇总。客户端须保证列表只包含本次调用实际成功的动作，原有必填字段校验保持不变。

</td>
</tr></tbody></table>

**场景 4：action\_list 不是字符串数组，或数组内含非字符串元素**

<table><tbody><tr>
<td>

**改动前**

不识别该字段

</td>
<td>

**改动后**

对象、数字、布尔值、整个数组被 JSON 编码成字符串，以及数组内含对象、数字、`null`、布尔值或嵌套数组，均不合法。不自动转换；校验失败时跳过该调用的结果收集并记录错误，不影响车控主流程，也不丢弃本轮其他已收集的成功结果。

</td>
</tr></tbody></table>

**场景 5：用户输入与 Advisor 合并、多条 Advisor 合并，或快照与车辆/advice 不匹配**

<table><tbody><tr>
<td>

**改动前**

只有单条推荐快照，无法可靠归因每个工具调用

</td>
<td>

**改动后**

保守处理：不加 source，并跳过该调用的 AI Bar 上报；车控仍按原业务执行。合并场景需后续补齐逐调用归因

</td>
</tr></tbody></table>

### 例 6：连续多次车控，Planner 不再调用工具后统一上报

本例只对比本次“整轮汇总”调整。同一条 advice 为“有点热”：第一次车控成功返回 `\[\&\#34;A\&\#34;\]`；第二次全部失败，即使返回 `\[\&\#34;X\&\#34;\]` 也忽略；第三次成功返回 `\[\&\#34;B\&\#34;,\&\#34;C\&\#34;\]`。客户端始终按每次调用分别回包，不等待整轮结束。

<table><tbody><tr>
<td>

**汇总调整前：每次成功车控各上报一次**

以下仅列各次 AI Bar 请求中的列表字段：

```json
{
  "action_list": [
    "A"
  ]
}
```

```json
{
  "action_list": [
    "B",
    "C"
  ]
}
```

</td>
<td>

**汇总调整后：Planner 无工具调用时才上报一次**

```json
{
  "advisor_advice": "有点热",
  "director_execution_content": "执行指令：空调调至22度，执行结果：空调温度调节，已调至22度。\n执行指令：打开座椅通风，执行结果：座椅加热通风开关，已打开座椅通风。",
  "advisor_types": "comfort_advisor",
  "action_list": [
    "A",
    "B",
    "C"
  ]
}
```

</td>
</tr></tbody></table>

成功回包先暂存；Planner 后续继续调用车控或其他工具时均不上报。只有 Planner 明确输出工具调用 `action\_list=\[\]` 才统一发送上述请求。列表按 Planner 调用顺序合并、保留重复字符串；失败调用不贡献动作，也不贡献本例的执行反馈文本。AI Bar 返回体仍为原有 `errno/msg` 协议。


