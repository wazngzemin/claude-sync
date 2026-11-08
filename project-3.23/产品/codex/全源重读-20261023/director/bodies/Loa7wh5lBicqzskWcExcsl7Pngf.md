# \[技术方案\] GUI Agent Init

# 需求背景

Kickoff：[GUI\-agent项目启动会](https://bytedance.larkoffice.com/wiki/XASxwUEmeiAApMk87GHcdbHpnv4)

产品预期的目标拆解：[GUIAgent目标计划拆解](https://bytedance.larkoffice.com/docx/CUlddB2hUoFmupxiMxYcZYvMnyT)

# 目标

**交付内容**

1. 在车端或台架端到端跑通几个任务

2. 没有意图识别，GUI Agent 先作为一个独立的模块闭环，不跟任何系统耦合

3. 支持用户的语音交互，支持 ASR，TTS

4. 支持执行引擎特效，让用户知道点击了哪里

5. 支持用户交互，补充信息，终止等



**声明**

使用 seed 1\.8 \+ 自研工程链路 进行开发，效果对齐 AutoGLM，效果可以参考 [GUI Agent](https://bytedance.larkoffice.com/wiki/P5yuwBK2jiCjrokLEnecdcohnlc#share-Xk3hdyZeJoDblixeMYjcNDRqnSe)

<table><tbody>
<tr>
<td>

用我相册里最新 3 张图给我发个微信朋友圈，配文终于迎来了最喜欢的12月



</td>
<td>

能找到朋友圈入口

第一次发布生成了长按动作，变成了发文字

通过反思发现不符合预期，能够退回上一层

通过短按发图片\+文字

</td>
<td>

\[20251210173742\_rec\_\.mp4\]



</td>
</tr>
</tbody></table>

- 只保证跑通，按最简单的方式实现。如：

    - 不使用 TOS 等文件存储服务，图片直接 base64 编码

    - 服务端的超时控制，不区分普通 点击 事件 或者 用户补充信息的事件

    - 用户补充的信息，作为简单的上下文直接给到模型，不会去做可能的优化

# 技术方案

## 整体架构图

## 环境信息

<table><tbody>
<tr>
<td>

BOE

</td>
<td>

boe\_v\_gui\_agent

</td>
</tr>
<tr>
<td>

PPE

</td>
<td>

ppe\_v\_gui\_agent

</td>
</tr>
</tbody></table>

## 一次用户请求简易的流转说明

> 以用户命令 “给朋友发一条消息” 为例，
> 
> 1. 常规命令（点击，输入，滑动等）。
> 
> 2. 用户输入不清楚，需要澄清，生成 CLARIFY 命令。
> 
> 3. 发送动作需要用户授权，生成 APPROVE 命令。
> 
> 

## 接口定义 / IDL 

BAM api：记得选择最新版本
[https://cloud\.bytedance\.net/bam/rd/vehicle\.agent\.gui/api\_doc/show\_doc?x\-resource\-account=public\&amp;x\-bc\-region\-id=bytedance\&amp;cluster=default\&amp;endpoint\_id=3766038](https://cloud.bytedance.net/bam/rd/vehicle.agent.gui/api_doc/show_doc?x-resource-account=public&x-bc-region-id=bytedance&cluster=default&endpoint_id=3766038)

IDL：

```Thrift
namespace go vehicle.gui.agent

struct PingRequest {
    1: optional string msg,
}

struct PingResponse {
    1  : optional PingResponseData data, // data

    250: required i64              code, // 响应码
    251: required string           msg , // 响应信息
}

struct PingResponseData {
    1: optional string msg,
}


struct GUIAgentRequest {
    1  : required string          request_id      , // 标识任务的唯一性
    2  : required RequestType     request_type    , // 请求类型
    3  : required string          query           , // 请求内容
    4  : optional ImageData       image_data      , // 屏幕截图数据
    5  : optional InteractionData interaction_data, // 用户交互数据

    100: optional GUIAgentCommon  common          ,
}

// request 消息分为两类：
// 1. 感知类请求，需要模型做推理的请求，如 屏幕理解 底层 xml 之类的理解
// 2. 用户交互请求
enum RequestType {
    PERCEPTION  = 1, // 感知类型的的请求，如 屏幕理解 底层 xml 之类的理解
    INTERACTION = 2, // 用户交互请求
}

enum ImageType {
    BINARY = 1, // 二进制流
    BASE64 = 2, // base64 编码
}

struct GUIAgentCommon {
    1: optional string current_app  , // 当前应用名称
    2: optional string location     , // 用户位置
    3: optional i32    screen_width , // 屏幕宽度
    4: optional i32    screen_height, // 屏幕高度
}

struct ImageData {
    1: required ImageType image_type  , // 屏幕截图的类型
    2: optional binary    image_bytes , // 屏幕截图 二进制流
    3: optional string    image_base64, // 屏幕截图的 base64 编码
}

struct InteractionData {
    1: required InteractionType    interaction_type, // 用户交互类型
    2: optional InteractionClarify clarify         , // 澄清类型的用户交互数据
    3: optional InteractionApprove approve         , // 确认类型的用户交互数据
}

enum InteractionType {
    CLARIFY = 1, // 澄清类型的用户交互请求
    APPROVE = 2, // 确认类型的用户交互请求
}

struct InteractionClarify {
    1: required string content, // 用户补充的内容
}

struct InteractionApprove {
    1: required string content, // 用户确认的结果
}

// 响应结构体
struct GUIAgentResponse {
    1  : optional GUIAgentResponseData data, // data

    250: required i32                  code, // 响应码
    251: required string               msg , // 响应信息
}

struct GUIAgentResponseData {
    1: optional string       thought,
    2: optional Action       action ,
    3: optional ActionStatus status , // 动作状态
}


struct Action {
    1 : required string          type       , // 动作类型 launch, tap, type, double_tap, swipe, long_press, wait, back, home, clarify, handoff, approve, ...

    2 : optional ActionLaunch    launch     , // 启动应用动作
    3 : optional ActionTap       tap        , // 点击动作
    4 : optional ActionInput     input      , // 输入文本动作
    5 : optional ActionSwipe     swipe      , // 滑动动作
    6 : optional ActionLongPress long_press , // 长按动作
    7 : optional ActionWait      wait       , // 等待动作
    8 : optional ActionBack      back       , // 返回动作
    9 : optional ActionHome      home       , // 主屏幕动作
    10: optional ActionClarify   clarify    , // 澄清动作
    11: optional ActionHandoff   handoff    , // 移交动作
    12: optional ActionApprove   approve    , // 确认动作
}

struct ActionLaunch {
    1: optional string package_name, // 应用包名
    2: optional string app_name    , // 应用名称
}

struct ActionTap {
    1: required i32 x, // 点击坐标 x
    2: required i32 y, // 点击坐标 y
}

struct ActionInput {
    1: required string text, // 输入的文本
}

struct ActionSwipe {
    1: required i32 start_x, // 滑动起始坐标 x
    2: required i32 start_y, // 滑动起始坐标 y
    3: required i32 end_x  , // 滑动结束坐标 x
    4: required i32 end_y  , // 滑动结束坐标 y
}

struct ActionLongPress {
    1: required i32 x          , // 长按坐标 x
    2: required i32 y          , // 长按坐标 y
    3: optional i32 duration_ms, // 长按持续时间，单位毫秒
}

struct ActionWait {
    1: optional i32 duration_ms, // 等待时间，单位毫秒
}

struct ActionBack {
}

struct ActionHome {
}

struct ActionClarify {
    1: required string question, // 澄清问题
}

struct ActionHandoff {
}

struct ActionApprove {
    1: required string content, // 需要用户确认的内容，例如："确认执行吗？"。 客户端对应的上行，应该就是 true 或 false
}



enum ActionStatus{
    SUCCESS = 1  ,
    RUNNING = 20 ,
    FAIL    = 100,
}

 service GUIAgentService {

    // @title: Ping 测试接口
    PingResponse Ping(1: PingRequest request) (api.get = "/gui/v1/ping")

    // @title: 处理请求的主要方法
    GUIAgentResponse Process(1: GUIAgentRequest request) (api.post = "/gui/v1/process")
 }
```

## 服务端技术方案

代码结构 @姜涵

```PowerShell
.
├── biz
│   ├── dal                       # 数据层，Cache, DB, TCC
│   │   ├── cache
│   │   ├── tcc
│   │   └── trace
│   ├── handler                   # 流量入口
│   ├── model                     # 数据结构定义
│   ├── router                    # 路由
│   └── service                   # 业务核心逻辑
│       ├── eino.go
│       ├── knowledge.go
│       ├── parser.go
│       ├── process.go
│       ├── prompt.go
│       └── task.go
├── build.sh
├── conf                           # 配置文件
│   └── hertz.config.yaml
├── go.mod
├── go.sum
├── idl                            # IDL 接口定义文件
│   └── gui_agent.thrift
├── main.go
├── output
├── README.md
├── router_gen.go
├── router.go
├── script
└── utils                           # 工具类
```

**核心模块**

<table><tbody>
<tr>
<td>

协议/交互



</td>
<td>

通过 Http 协议，没有长链接，http 请求的超时设为 15s（暂定）

> 参考兄弟团队的方式，他们也没有使用长链接通道。http 会更简单
> 
> 

</td>
</tr>
<tr>
<td>

模型交互

</td>
<td>

Eino

</td>
</tr>
<tr>
<td>

Task 生命周期管理

</td>
<td>

Redis  save \&amp; load

考虑到一个任务可能有 10 步，每次请求未必会落在同一个 pod 上。无状态服务加载 task 上下文使用 redis 处理

</td>
</tr>
<tr>
<td>

上下文管理

</td>
<td>

Redis，同上，可能直接挂载在 Task 整个结构里面

</td>
</tr>
<tr>
<td>

Prompt 管理

</td>
<td>

Fornax 配置 prompt，便于修改、调整

还能支持调试

</td>
</tr>
<tr>
<td>

Knowledge 管理

</td>
<td>

本期暂不考虑

</td>
</tr>
<tr>
<td>

Parser

</td>
<td>

模型输入输出的 解析、封装

</td>
</tr>
<tr>
<td>

观测：Log \&amp; Trace

</td>
<td>

Argos \&amp; Fornax

</td>
</tr>
</tbody></table>









## 客户端技术方案 @梁宇

[Android GUI\-Agent客户端技术评审](https://bytedance.larkoffice.com/docx/KM0NdHfBhoqiZgxZEE5ccZ8BnWe)

# 找人地图 \&amp; 排期

<table><tbody>
<tr>
<td>

产品

</td>
<td>

@廖婉婷

</td>
<td>



</td>
</tr>
<tr>
<td>

服务端

</td>
<td>

@于庆磊@姜涵

</td>
<td>



</td>
</tr>
<tr>
<td>

客户端

</td>
<td>

@梁宇@刘贺

</td>
<td>



</td>
</tr>
<tr>
<td>

项目

</td>
<td>

@赵宏伟

</td>
<td>



</td>
</tr>
<tr>
<td>

测试

</td>
<td>

@林满恕

</td>
<td>



</td>
</tr>
</tbody></table>

## 甘特图（开发 \&amp; 联调）

风险项：

根据排期总工作量需要24天/人。12\.25\-1\.15还剩下15个工作日，按照目前0\.8人力投入12天/人。还剩下12天/人的缺口，所以最晚12\.29号bpo到场并立即介入开发才可。（时间包含联调，但是不包含测试）

2. 无任何富裕人力，只能上升。









## 服务端开发排期

<table><tbody>
<tr>
<td>

初始化工程资源

Gitlab, TCE, BOE, Redis, Hertz

</td>
<td>

1



</td>
<td>

@于庆磊

</td>
</tr>
<tr>
<td>

端云接口字段定义

</td>
<td>

1

</td>
<td>

@于庆磊@姜涵

</td>
</tr>
<tr>
<td>

~~登录鉴权模块~~

</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>

接入 Eino 用于同模型交互

</td>
<td>

2

</td>
<td>

@姜涵@于庆磊

</td>
</tr>
<tr>
<td>

System Prompt 管理

接入 Fornax Prompt SDK

</td>
<td>

1

</td>
<td>

@于庆磊@姜涵

</td>
</tr>
<tr>
<td>

Action 定义 管理

支持 Android 原生的一些操作，如 tap, type \.\.\.

以及 Clarify, Approve, Handoff

</td>
<td>

1



</td>
<td>

@姜涵@于庆磊

</td>
</tr>
<tr>
<td>

单一任务的 Context 管理

所有的 Thought \+ N 张图片 作为上下文，提升模型理解能力

</td>
<td>

1



</td>
<td>

@姜涵

</td>
</tr>
<tr>
<td>

单一任务生命周期管理

1. Task id 维护

2. ~~Session id~~

3. 超时时间，考虑根据不同 action 设置动态超时时间

4. 最大步长



</td>
<td>

1



</td>
<td>

@姜涵

</td>
</tr>
<tr>
<td>

Log, Trace

接入 Fronax trace

</td>
<td>

1

</td>
<td>

@于庆磊@姜涵

</td>
</tr>
<tr>
<td>

数据

1. 性能：核心数据埋点

    1. 单步

    2. 整体

2. 完成、失败 的埋点统计

</td>
<td>

1



</td>
<td>

@于庆磊@姜涵





</td>
</tr>
<tr>
<td>

支持 TTS（待定）

</td>
<td>

2

</td>
<td>

@于庆磊

</td>
</tr>
<tr>
<td>



</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>



</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>



</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>



</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>

效果优化

1. Action 的准确性，prompt 还是 tool 的方式

2. 模型反思的能力

    1. 只给上下文，不强干涉

    2. 加一个反思模块，或者模型节点？

3. 目前模型推理是 CoT，要不要给一些 few shot，或者提前把某些任务拆解成小的子任务

</td>
<td>

先跑通，然后再看

</td>
<td>



</td>
</tr>
<tr>
<td>



</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>



</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>



</td>
<td>



</td>
<td>



</td>
</tr>
</tbody></table>

## 客户端开发排期

@梁宇0\.3

@刘贺0\.5

端侧目前最大人力如上，@梁宇一周可拿出1\.5天左右开发；@刘贺一周可拿出2\.5天左右开发。

周末、元旦看情况加班。

<table><tbody>
<tr>
<td>

项目工程结构初始化、基建能力Alog、Applog、Net、Npth等能力支持

</td>
<td>

1

</td>
<td>

@梁宇



</td>
</tr>
<tr>
<td>

端侧支持屏幕指定范围内截图能力

</td>
<td>

1

</td>
<td>

@梁宇

</td>
</tr>
<tr>
<td>

端侧截图内存管理策略

</td>
<td>

1

</td>
<td>

@梁宇

</td>
</tr>
<tr>
<td>

端云交互数据逻辑抽象，ChatMessage消息封装、会话管理

</td>
<td>

2

</td>
<td>

@梁宇

</td>
</tr>
<tr>
<td>

端侧数据Model构建、解析逻辑、Response Handler处理策略

</td>
<td>

1

</td>
<td>

@梁宇

</td>
</tr>
<tr>
<td>

端云错误码管理、自定义不同错误Exception

</td>
<td>

0\.5

</td>
<td>

@梁宇

</td>
</tr>
<tr>
<td>

云端下发反控Action接口抽象、逻辑封装

</td>
<td>

2

</td>
<td>

@梁宇

</td>
</tr>
<tr>
<td>

端侧无障碍服务能力封装：点击、双击、长按、滑动等Touch能力、打开应用、关闭应用、Wait等

</td>
<td>

2



</td>
<td>

@梁宇

</td>
</tr>
<tr>
<td>

端侧自定义Overlay显示交互Touch Action

</td>
<td>

2



</td>
<td>

@梁宇

</td>
</tr>
<tr>
<td>

端侧ASR能力接入，对接@任少东已经封装的ASR APK

</td>
<td>

2

</td>
<td>

@梁宇

</td>
</tr>
<tr>
<td>

端侧TTS播报，无合成能力，Android原生播报

</td>
<td>

1

</td>
<td>

@梁宇

</td>
</tr>
<tr>
<td>

上汽车机系统联调截屏、无障碍服务反控能力、开通对应系统权限，关键场景Case验证

</td>
<td>

4



</td>
<td>

@梁宇





</td>
</tr>
<tr>
<td>

端侧用户主动介入逻辑、UI交互逻辑

</td>
<td>

待定，依赖产品prd 以及 UI复杂度评估

</td>
<td>

@梁宇

</td>
</tr>
<tr>
<td>



</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>



</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>



</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>



</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>

1. 不涉及VirtualDisplay能力支持。

2. 不涉及系统InputManager事件注入能力。

3. 不涉及小程序输入框注入文字，需车机系统InputManagerService配合改造处理等一系列系统相关事项。

</td>
<td>



</td>
<td>



</td>
</tr>
</tbody></table>



# TODO

# 上线方案

域名：

# Refer

录屏：https://bytedance\.larkoffice\.com/minutes/obcnx25784jm7m854n4zjx77


