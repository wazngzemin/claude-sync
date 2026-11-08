# 手势识别输入类型云端接入技术方案

> 部分内容由豆包生成
> 
> 

<div class="callout">

**一句话方案**：为赛力斯手势交互新增一种独立的 query 输入模态——上游以 **input\_scene=gesture** 标识手势转换出的 query，豆包网关把它映射为内部枚举 **UserInputSceneType\_Gesture\(8\)** 并随 ChatRequest 透传、落库，后续处理复用既有语音 / Planner 链路。本 MR 只做「类型打通」，不改变任何对话处理逻辑。

</div>

# 需求背景与本次范围

需求来自《对内【赛力斯】手势交互需求》：驾驶场景下用隔空手势补充语音 / 触控，提供更安全自然的车内交互。整体由赛力斯侧负责 CV 手势识别，字节侧负责**输出手势场景有效信号、承接识别后的 query、端到端验收**。手势分三类：

<table><tbody>
<tr>
<td>

手势

</td>
<td>

语义结果

</td>
<td>

触发条件 / 承接方式

</td>
</tr>
<tr>
<td>

OK

</td>
<td>

确认

</td>
<td>

仅豆包主动服务卡、即时交互卡弹出时；转换为对应 query 走 Planner，逻辑与语音一致

</td>
</tr>
<tr>
<td>

左右摆手

</td>
<td>

拒绝 / 取消

</td>
<td>

同上，转换为对应 query 走 Planner

</td>
</tr>
<tr>
<td>

挥手（上下 / 左右）

</td>
<td>

列表翻页（上一页 / 下一页）

</td>
<td>

仅导航、音乐媒体列表卡，端侧「可见即可说」命中，**不走 Planner、不在本 MR 范围**

</td>
</tr>
</tbody></table>

约束：仅前排摄像头、仅中控屏，后排手势不响应；手势不是唯一解，与语音、触控按「谁先触发响应谁」仲裁；本期只对手势成功触发做埋点并记录手势类型。

<div class="callout">

**本 MR（\!1026）定位**：手势确认 / 拒绝转换出的 query 要进入服务端，首先得让网关「认得」这是一种手势输入、并打上独立模态标记，否则会被当成普通语音。MR 因此新增一个场景字符串常量、一个内部枚举值和一条网关映射，共改动 3 个文件、净增 5 行，属底座型小改动。

</div>

# 整体链路

从手势识别到服务端处理的完整链路如下，黄色节点 convertSceneType 即本次代码改动的核心位置；翻页类手势在分叉处被端侧消费，不进入服务端主链路：

对应需求约定的四步交互链路：① 字节客户端输出手势场景有效信号 → ② 赛力斯启动 CV 模型识别 → ③ 确认 / 取消类手势转 query（携带 input\_scene=gesture）走 Planner → ④ 滑动类手势命中可见即可说。本 MR 服务于第 ③ 步的入口识别。

# 代码改动详解

改动沿「上游字符串 → 内部枚举 → 网关映射」三处对齐，另有一行无意义的格式对齐：

<table><tbody>
<tr>
<td>

文件

</td>
<td>

增 / 删

</td>
<td>

作用

</td>
</tr>
<tr>
<td>

biz/service/input/define\.go

</td>
<td>

\+1

</td>
<td>

新增上游场景字符串常量 SceneTypeGesture = \&\#34;gesture\&\#34;，统一字面量、避免硬编码

</td>
</tr>
<tr>
<td>

biz/types/common\.go

</td>
<td>

\+2 / \-1

</td>
<td>

新增内部枚举 UserInputSceneType\_Gesture = 8；另有 1 行为 gofmt 注释空格对齐，**无逻辑变化**

</td>
</tr>
<tr>
<td>

biz/service/gateway/doubao\_app/function\.go

</td>
<td>

\+2

</td>
<td>

convertSceneType 新增一个 case，把 \&\#34;gesture\&\#34; 映射到枚举 8

</td>
</tr>
</tbody></table>

## ① 上游场景字符串常量（input/define\.go）

在 SceneType 字符串枚举中补充 gesture，与既有 launcher 并列，供网关转换时引用：

```go
type SceneType string

const (
    SceneTypeLauncher SceneType = "launcher"
    SceneTypeGesture  SceneType = "gesture" // 新增：车内手势输入
)
```

## ② 内部输入模态枚举（types/common\.go）

UserInputSceneType 是挂在单轮 query 对象 AgentQuery 上的「输入模态」枚举（int32，json 字段 user\_input\_scene\_type），本次新增手势取值 8：

```go
type UserInputSceneType int32

const (
    UserInputSceneType_Unknown UserInputSceneType = 0 // 未知
    UserInputSceneType_Audio   UserInputSceneType = 1 // 语音输入
    UserInputSceneType_Guiding UserInputSceneType = 2 // 引导语类型
    UserInputSceneType_Scene   UserInputSceneType = 3 // 推荐场景类型
    UserInputSceneType_Advisor UserInputSceneType = 4 // 主动推荐
    UserInputSceneType_Hint    UserInputSceneType = 5 // hint输入
    UserInputSceneType_Skill   UserInputSceneType = 6 // skill输入
    UserInputSceneType_Gesture UserInputSceneType = 8 // 车内手势输入（新增，值 7 当前未定义）
)
```

## ③ 网关映射（gateway/doubao\_app/function\.go）

上游车辆业务参数 VehicleBizParam\.InputScene（json：input\_scene）在 buildChatRequest 中经 convertSceneType 转为内部枚举，写入 AgentQuery\.UserInputSceneType：

```go
func convertSceneType(scene string) types.UserInputSceneType {
    switch scene {
    case string(input.GenerateTypeGuiding):
        return types.UserInputSceneType_Guiding
    case string(input.GenerateTypeScene):
        return types.UserInputSceneType_Scene
    case "skill":
        return types.UserInputSceneType_Skill
    case string(input.SceneTypeGesture): // 新增分支
        return types.UserInputSceneType_Gesture
    default:
        return types.UserInputSceneType_Audio // 未识别一律按语音兜底
    }
}
```

调用点（buildChatRequest 内）把结果挂到 ChatRequest\.Query 上，随请求进入后续链路：

```go
chatRequest := types.ChatRequest{
    Query: types.AgentQuery{
        TriggerMethod:      types.TriggerMethodUserInput,
        QueryType:          convertQueryType(req),
        UserInputSceneType: convertSceneType(vehicleBizParam.InputScene), // gesture -> 8
        Content:            req.GetQuery().GetContentForModel(),
        // ...
    },
}
```

# 数据流与影响面

手势模态从入口到下游的字段流转如下：

<table><tbody>
<tr>
<td>

阶段

</td>
<td>

字段 / 位置

</td>
<td>

取值与说明

</td>
</tr>
<tr>
<td>

上游请求

</td>
<td>

VehicleBizParam\.InputScene（input\_scene）

</td>
<td>

字符串 \&\#34;gesture\&\#34;，由 director / 端侧在确认 / 拒绝手势转 query 时携带

</td>
</tr>
<tr>
<td>

网关转换

</td>
<td>

convertSceneType\(\)

</td>
<td>

\&\#34;gesture\&\#34; → UserInputSceneType\_Gesture\(8\)

</td>
</tr>
<tr>
<td>

请求体

</td>
<td>

AgentQuery\.UserInputSceneType（user\_input\_scene\_type）

</td>
<td>

= 8，随 ChatRequest 进入 Planner / 对话链路

</td>
</tr>
<tr>
<td>

扩展字段

</td>
<td>

ext\[ExtraKeySceneType\]

</td>
<td>

同时保留 req\.GetSceneType\(\) 的原始字符串，供需要原始值的逻辑读取

</td>
</tr>
<tr>
<td>

历史落库

</td>
<td>

chat\_history / chat\_history\_detail\.user\_input\_scene\_type

</td>
<td>

作为 query 模态分类落库（model/chat\_history/cache\.go 从 reqInfo 写入），手势轮次记为 8

</td>
</tr>
<tr>
<td>

对话处理

</td>
<td>

Planner / Flow

</td>
<td>

当前无手势专属分支，**完全复用语音交互逻辑**，与 PRD「逻辑与语音一致」相符

</td>
</tr>
<tr>
<td>

埋点

</td>
<td>

手势触发类型

</td>
<td>

以模态 8 为锚点区分手势触发，支撑「各类手势触发次数」统计

</td>
</tr>
</tbody></table>

<div class="callout">

**下游现状（已全仓检索核实）**：除定义与网关映射外，当前代码库没有针对 Gesture 枚举的差异化消费分支；本 MR 是「先把模态标对、通路打通」，后续若要按手势做差异化话术、策略或统计，统一以 user\_input\_scene\_type=8 为判断锚点即可，无需再改入口。

</div>

# 枚举约定与兼容性

<table><tbody>
<tr>
<td>

关注点

</td>
<td>

说明

</td>
</tr>
<tr>
<td>

纯新增、零侵入

</td>
<td>

只新增常量 / 枚举 / switch 分支，不改任何既有分支；存量语音、引导、推荐、skill 等场景行为不变

</td>
</tr>
<tr>
<td>

未知值兜底

</td>
<td>

convertSceneType 的 default 固定回落 UserInputSceneType\_Audio\(1\)，即使上游漏传或传了未识别值，也按普通语音处理，不会报错或丢请求

</td>
</tr>
<tr>
<td>

枚举跳号 7

</td>
<td>

现有枚举用到 6，本次直接取 8，值 7 在代码中未定义。取值沿用源分支现状，**合入前需与客户端 / 数据侧确认 7 无外部预留语义**，避免线上对该值理解不一致

</td>
</tr>
<tr>
<td>

为何不改 validateSceneType

</td>
<td>

input/define\.go 的 validateSceneType 服务于 GenerateInput 主动内容生成接口（当前仅放行 launcher），手势走的是对话链路（VehicleBizParam\.InputScene → convertSceneType），不经过该校验，因此无需改动，并非遗漏

</td>
</tr>
<tr>
<td>

与 hint 覆盖逻辑的关系

</td>
<td>

buildChatRequest 在转换后还会用 IsHintInputScene\(\) 把命中 hint 场景的请求二次覆盖为 Hint\(5\)；手势请求不带 hint 标记，不受该覆盖影响

</td>
</tr>
</tbody></table>

# 关联信息

<table><tbody>
<tr>
<td>

MR

</td>
<td>

\!1026 新增手势识别类型（stone\_vehicle/aidv，状态 open）

</td>
</tr>
<tr>
<td>

分支

</td>
<td>

feature/main\-develop\-hands → feature/main\-develop

</td>
</tr>
<tr>
<td>

需求文档

</td>
<td>

《对内【赛力斯】手势交互需求》

</td>
</tr>
<tr>
<td>

改动文件

</td>
<td>

biz/service/input/define\.go、biz/types/common\.go、biz/service/gateway/doubao\_app/function\.go

</td>
</tr>
<tr>
<td>

相关下游

</td>
<td>

biz/model/chat\_history/cache\.go（模态落库）、biz/dal/db/query/chat\_history\*\.gen\.go（user\_input\_scene\_type 字段）、biz/types/request\.go（IsHintInputScene）

</td>
</tr>
</tbody></table>

# 自测

环境：ppe\_gesture

Mr :https://code\.byted\.org/stone\_vehicle/aidv/merge\_requests/1026

这里只自测链路，由于本身这里应该是有上下文的，比如前面应该是有主动推荐或者是豆包问题，待用户确认的场景才出现，我直接自测，会被拒识拦住，所以这里，**我用http接口自测跳过了拒识**

```SQL
curl --location --request POST 'https://api-vehicle.volcengine.com/aidv/v1/planner?channel=seres&app_id=1000&device_id=16710245599&vehicle_id=LSJEG4097SG11&account_id=wuge1&vehicle_type=model31&channel_app_id=99210&login_doubao_uid=284265488135754&chat_id=123400000001&conversation_id=123400000001&question_id=xGrLi1dFjsdqHgbkhhs' \
--header 'X-Tt-Env: ppe_gesture' \
--header 'Debug-Mode: 2037' \
--header 'X-Use-Ppe: 1' \
--header 'X-Tt-Trace: 1' \
--header 'Content-Type: application/json' \
--data-raw '{
    "query": {
        "content": "用户手势表达了确认",
        "user_input_scene_type": 8
    },
    "coordination_info": {
        "request_id": "1234000000000000000001",
        "sound_zone": "主驾"
    },
    "ext": {
        "single_skip_reject": "true",
        "first_after_wake": "true"
    }
}'

```

https://fornax\.bytedance\.net/space/7522018773168046082/analytics/log\-query?queryID=2026091110211504A5DB1FEF86B721D630\&amp;queryType=log\_id\&amp;logIdTime=4\&amp;id=5204a6947912acf3

```SQL
curl --location --request POST 'https://api-vehicle.volcengine.com/aidv/v1/planner?channel=seres&app_id=1000&device_id=16710245599&vehicle_id=LSJEG4097SG11&account_id=wuge1&vehicle_type=model31&channel_app_id=99210&login_doubao_uid=284265488135754&chat_id=123400000001&conversation_id=123400000001&question_id=xGrLi1dFjsdqHgbkhhs' \
--header 'X-Tt-Env: ppe_gesture' \
--header 'Debug-Mode: 2037' \
--header 'X-Use-Ppe: 1' \
--header 'X-Tt-Trace: 1' \
--header 'Content-Type: application/json' \
--data-raw '{
    "query": {
        "content": "用户手势表达了拒绝",
        "user_input_scene_type": 8
    },
    "coordination_info": {
        "request_id": "1234000000000000000002",
        "sound_zone": "主驾"
    },
    "ext": {
        "single_skip_reject": "true",
        "first_after_wake": "true"
    }
}'
```

https://fornax\.bytedance\.net/space/7522018773168046082/analytics/log\-query?queryID=2026091110254853776FF46CDB4B249B40\&amp;queryType=log\_id\&amp;logIdTime=4\&amp;id=724ccc619bd500aa

