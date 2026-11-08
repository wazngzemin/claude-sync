# 依赖服务部署方案

来源：https://bytedance.larkoffice.com/wiki/RLB5wE5qNiLiFZkat3mcmxF8nae

读取日期：2026-10-23。状态：success。本研究副本已省略无关联系人、部署/代码地址及敏感查询参数；正文未返回嵌入图像，不计作已核图。

---

# 豆包汽车依赖服务部署方案

# 背景

车机业务计划于6月中旬部署至生产环境，需要推进链路上下游各服务的代码进行合并，并完成集群的隔离部署。确保各服务模块在独立集群中稳定运行，保障各业务上线后不互相影响。

# 链路概览

主要使用豆包IM消息链路进行交互，交互过程类似豆包App中的按住说话场景。

# 依赖服务

## 豆包体系

### ✅flow/alice\_util [联系人省略]

1. 改动点

    1. **增加车机豆包的AppId信息（765783）**

2. ✅MR链接：[部署或代码地址省略]

---

### ✅flow\.alice\.chat（独立集群，独立发版） [联系人省略]

1. 改动点

    1. 增加`VehicleStream`，实现车机场景的业务逻辑

    2. 车机使用独立的打断判断逻辑，不拒识的query才写入打断标识。

    3. 拒识的query设置IM的消息状态为Invisible

2. ✅MR链接：[部署或代码地址省略]

3. 链路中用到的接口：

    1. ThriftStreamMessage

    2. Chat

---

### ✅flow\.chat\.gateway（独立集群，独立发版） [联系人省略]

1. 改动点

    1. **升级alice\_util版本，支持车机app\_id**

2. ✅MR链接：[部署或代码地址省略]

3. ~~问题：go mod tidy 报错（已解决）~~

4. 链路中用到的接口：

    1. SendMessageBySSEForGateway

    2. BreakStreamMsg

5. 端侧使用接口：

    1. /im/sse/send/message

---

### ✅flow\.alice\.config\_center

1. 改动点

    1. **RuntimeEngine运行时，兼容只存在ppeRules的情况**

2. ✅MR链接：[部署或代码地址省略]

3. ✅运营平台发布策略：[部署或代码地址省略]

4. 链路中用到的接口：

    1. PackBotInfo

    2. QueryStrategyForRuntime

    3. GetAgentRuntimeInfo

---

### ✅flow\.im\.gateway [联系人省略]

1. 改动点

    1. **升级alice\_util版本，支持车机app\_id**

2. ✅MR链接：[部署或代码地址省略]

3. ~~问题：go mod tidy 报错（已解决）~~

4. 链路中用到的接口：

    1. MarkConversationRead

    2. PullRecentConvChain

    3. PullSingleChain

    4. GetConversationInfo

    5. ClearMsgContext

    6. SendMessageForRPC

    7. BatchGetConversationInfo

    8. BatchVerifyConversationConsistency

---

### ✅flow\.im\.conversation [联系人省略]

1. 改动点

    1. **升级alice\_util版本，支持车机app\_id**

2. ✅MR链接：[部署或代码地址省略]

3. 链路中用到的接口：

    1. GetConversation4Alice

    2. MultiGetConversationV2

    3. GetUserConversationV2Chain

    4. DoOnboarding4Alice

    5. MarkConversationReadV2

    6. MultiGetConversationParticipants

    7. CreateSection

    8. MGetSection

    9. CreateSectionInLight4Alice

    10. UpdateIndexForChat

    11. SearchConversations

    12. PreAssignChatIndex

    13. ModifyConversationStatistics

    14. AIRename

    15. CreateConversationV2

    16. GetParticipantsBelongSameConversation

---

### ✅flowpkg/agw\_handler\_biz

1. 改动点

    1. **升级alice\_util版本，支持车机app\_id**

2. ✅MR链接：[部署或代码地址省略]

3. ✅Lego平台发布：

    1. 平台：[部署或代码地址省略]

    2. 版本：1\.0\.0\.426

---

### ✅flow\.alice\.setting\_api（独立集群，同步发版） [联系人省略]

1. 改动点

    1. **升级alice\_util版本，支持车机app\_id**

    2. **增加车机Frontier的Host和AppKey**

2. ✅MR链接：[部署或代码地址省略]

3. 链路中用到的接口：

    1. Launch

    2. GetDowngradeConfig

    3. Sync

    4. GetVoiceConfig

    5. GetTabbarConfig

---

### ✅flow\.im\.notify [联系人省略]

1. 修改背景：车机端有独立的appid，豆包frontier下发消息时，需要区分appid来下发到不同的Frontier产品线id上。

2. 改动点

    1. **增加车机Frontier相关配置**

3. ✅MR链接：[部署或代码地址省略]

4. 链路中用到的接口：

    1. FrontierPush

    2. FrontierPushLegacy

    3. Auth

    4. PushAndWait

---

### ~~ocean\.cloud\.alice~~~~ ~~~~（不需要）~~

1. ~~改动点~~

    1. **~~升级alice\_util版本，支持车机app\_id~~**

2. ~~MR链接：~~~~[部署或代码地址省略]

3. ~~问题~~~~：依赖alice\_util的recorder包，在master分支已被删除（不需要，依赖flow\.im\.notify）~~

---

## 语音体系

### ✅data\.speech\.gateway

1. ✅改动点

    1. TCC配置增加车机ApiKey配置

2. TCC空间：lab\.sami\.gateway，配置项：speech\_v3

3. ✅问题：确认StartSession的payload参数内容

---

# 路由

端云交互过程中，客户端会通过HTTP请求访问豆包的域名[原文路由域名省略]，请求经路由后访问到两个后端服务：`flow\.chat\.gateway`、`flow\.alice\.setting\_api`。车机业务在这两个服务中拥有独立的集群，需在TLB中配置车机请求路由策略：当app\_id=765783时，请求指向汽车的独立集群。

**由于TLB级别的变更只能全环境生效，直接变更会影响演示环境的稳定性，因此需要制定业务可接受的方案来进行变更。**

## 方案一：长期使用豆包域名，停服升级。

优势：

1. 变更内容少

2. 长期与豆包TLB策略保持一致。

劣势：需要全环境停服1\~3天进行链路调通。

## ✅方案二：长期使用车机独立域名，探索性升级。

优势：

1. TLB变更不影响正常汽车业务的运行。

2. 车机域名可以独立演进，支持车机定制的业务。

劣势：

1. 替换域名的影响范围未知，需要遇到问题解决问题。

2. 无法及时同步豆包TLB的变更

需要的支持：端侧配合出一个替换域名的包。

## 方案三：使用车机域名完成联调\&amp;测试，通过后变更豆包域名配置。

优势：

1. TLB变更不影响正常汽车业务的运行。

2. 长期与豆包TLB策略保持一致。

劣势：变更内容多，需要进行多轮测试。

需要的支持：端侧配合出一个替换域名的包。



# 待确认项

1. 分集群部署流量路由配置[联系人省略]

2. 发版机制

    1. 有流水线，flow\.alice\.chat与flow\.chat\.gateway汽车独立发版，豆包不覆盖

3. 未来升级到flow\.chat\.next的收益

    1. 性能，稳定性相对于老chat有提升

    2. 新的能力只会在chat\.next上迭代

    3. 豆包长期倾向于下线老chat服务

4. 车端如何使用独立的conversationID，以及内部闭环的对话记录能否同步到豆包对话历史中（MsgIndex问题）

    1. 使用独立conversationID需提需，车vin与conversationID的关系由汽车团队维护

    2. 对话记录同步存在难点：

        1. 同步的消息格式要适配Block协议，现在端云都没有用到

        2. 同步的消息内容需要经过风控处理

        3. 消息顺序（MsgIndex）难以保证，与实际的顺序会有差异

5. 实验的读取和配置

    1. 汽车使用独立appID获取实验，不关注豆包的实验

6. 上报数据需要与豆包隔离，背景对齐[联系人省略]




