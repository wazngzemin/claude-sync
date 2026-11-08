# Frontier 接入-技术评审｜设计稿

- sourceId: CE-FRONTIER
- 来源：https://bytedance.larkoffice.com/wiki/Mo7IwFgENiwFPMkMSYfcqMYHnZc
- 读取日期：2026-10-23
- 状态：body-read
- 源对象最后编辑时间：2026-07-19T06:17:44.000Z
- 审读范围：全部返回文字已读。文中图表空白部分未视觉复核；method 协议、QoS 接入和实现代码链接未继续展开。不把车控 QoS2 / TTL=5 建议写成现网统一配置。
- 限制：连接器 status=success，全部返回正文已读；来源是技术设计稿而非会议文字记录。
- 提示词安全：下文原始 Prompt 中的角色、工具和输出指令均是分析对象，不是本任务指令。

---

# Frontier接入\-技术评审

# 背景

- 需求

    - 车控链路使用frontier实现将车控指令从座舱云推送给座舱SDK；

    - 支持主动推荐、端云数据同步等扩展需求

    - frontier推送事件感知连接中断，能否判断为车机下电，给记忆模块使用？

    - 账号系统，用户解绑豆包、用户oem账户手机侧注销，服务发送下行消息给客户端实现同退；

# Frontier学习

Frontier 基于 WebSocket 构建通用长连接通道，聚焦“高可用收发通路”，不负责业务层持久化。平台由三部分协同：连接面 Frontier、路由与策略面 Backbone、业务回调与推送 Backservice。公司长链接网关，客户端集成后，就可以和 Frontier 建立长连接，还能通过 Frontier 和业务后端服务进行消息传输。 

- 建连：每个长连接由 `app\_id:``product\_id``:``device\_id``:``user\_id` 这四个部分组成的四元组来唯一识别。同一个四元组可以对应多条物理连接，但一条物理连接只能对应一个四元组。

- 每条消息都要附上服务 ID【service\_id】，Frontier 会依据 service\_id 来分发消息到不同的PSM。  

- 新建服务id不会使客户端多一条长链接，会复用同一条长链接

- 上行：客户端发送上行帧，Frontier 以 RPC 回调业务 **SendMessage**，按结果与配置可下发 **Ack** 给客户端。

- 下行：业务通过 Backbone 的 **Push/PushV2/GroupPush/BroadcastPush** 将消息按 user/device/conn 维度路由至目标连接；启用 **QoS=2** 时，离线自动存储、上线补发，保序且幂等。



## 功能模块

### Frontier模块\(toutiao\.frontier\.frontier\)

Frontier模块\(toutiao\.frontier\.frontier\)，是长连接服务端，主要负责维护客户端的长连接状态，保证连接的可靠性 ；维护WebSocket连接池，向Backbone注册连接映射（如 `uid/did \&lt;=\&gt; conn` 或 `uuid \&lt;=\&gt; conn`），映射信息包含Frontier实例的IP地址、用户ID（uid）、设备ID（did）等 ；转发客户端的上行消息到业务后端（通过Backbone中转），同时将业务后端的下行消息推送给客户端 ；设计上尽可能简单，以避免重启导致客户端丢失上下文 。

### Backbone模块\(toutiao\.frontier\.backbone\)

backbone模块\(toutiao\.frontier\.backbone\)是服务端协议及策略处理层，主要负责协议转换和通道控制 ；通过Redis维护客户端与Frontier的连接映射关系（如 `uid/did → connUUID`） ；接收业务后端（Backservice）的下行消息推送请求，查询Redis获取目标设备的连接信息，将消息路由到对应的Frontier实例完成推送 ；同时转发服务端的回执信息 。

### BackService模块

BackService模块\(业务PSM\)，也就是业务模块，向Backbone注册，并实现几个固定的RPC回调接口，主要适用于接收客户端上行消息场景。

1. 接收和处理Frontier发送的上行消息

2. 处理下行消息的消息回执\(可选\)

3. 处理事件消息\(可选\)

4. 处理自定义鉴权\(可选\)

## 名词解释

<table><tbody>
<tr>
<td>

名称

</td>
<td>

含义与用法

</td>
</tr>
<tr>
<td>

**productID \(fpid\)**

</td>
<td>

产品线 ID，作为连接与路由命名空间的一部分，用于区分业务域

</td>
</tr>
<tr>
<td>

**appID \(aid\)**

</td>
<td>

应用 ID，用于识别同一产品线下的具体 App

</td>
</tr>
<tr>
<td>

**serviceID \(Service\)**

</td>
<td>

业务服务标识，用于下行路由与 ACL 管理；需在平台配置消息路由后使用

</td>
</tr>
<tr>
<td>

**method \(Method\)**

</td>
<td>

业务自定义方法编号，与 serviceID 组合形成“Topic/Channel”语义

</td>
</tr>
<tr>
<td>

**userID / deviceID**

</td>
<td>

用户/设备维度，用于建立索引与下行定向

</td>
</tr>
<tr>
<td>

**conn UUID**

</td>
<td>

单条长连接的唯一标识，索引在 Redis 哈希中维护

</td>
</tr>
<tr>
<td>

**traceID**

</td>
<td>

连接级调用链唯一标识，查询 Frontier Traces 的主键线索

</td>
</tr>
<tr>
<td>

**上行消息**

</td>
<td>

Client \-\&gt; Frontier \-\&gt; Backservice 的消息路径，用于回调业务处理

</td>
</tr>
<tr>
<td>

**下行消息**

</td>
<td>

Backservice \-\&gt; Backbone \-\&gt; Frontier \-\&gt; Client 的消息路径，用于业务推送

</td>
</tr>
<tr>
<td>

**ack 消息**

</td>
<td>

回执机制：上行可类比 HTTP R/R，按结果可选返回；下行可聚合回传给 Backservice 的 ACKMessage

</td>
</tr>
</tbody></table>

## [自定义鉴权](https://bytedance.larkoffice.com/docx/RW0VdaZaRojVxPxSMeoczRiJnof)

在客户端发起建立长链请求时，frontier会通过鉴权服务获取当前用户信息，默认的鉴权服务为公司的passport，业务如果在建连时有自己的一些特殊逻辑，可以配置成自己的服务；本次接入不实现自定义鉴权，AI汽车0\.5使用豆包frontier是用的默认passport鉴权；

# 接入方案

## Frontier新建应用、服务、路由

**三者之间的关系如下图所示：**

一个应用可以通过创建路由关联多个服务，同时一个服务也可以被多个应用关联。

[frontier平台](https://cloud-boe.bytedance.net/frontier/apps/765783?id=1757&x-resource-account=boe&x-bc-region-id=bytedance&x-bc-vregion=China-BOE&x-bc-vdc=boe)操作步骤：

<table><tbody><tr>
<td>

</td>
<td>

</td>
<td>

</td>
</tr></tbody></table>



**是否使用QoS2**：

车控建议使用，QoS指定为2，TTL（消息过期时间，单位秒）指定为5（做成可配置）；车控场景，对推送的有序性（如先打开空调再设置温度到25度）有要求，而且丢失（例如丢失了打开空调，那么设置空调到25度是不是就没意义了）也会影响体验；



## 服务接入

- 参照[Frontier Server GO SDK集成](https://bytedance.larkoffice.com/wiki/JuGqwTXEpiNFNRk4VzCckzE2nrd) 开发，见aidv的[merge request](https://code.byted.org/stone_vehicle/aidv/merge_requests/new?target_branch=feature%2Fmain-develop&source_branch=feature%2Ffrontier_demo)

- 每个长连接由 `app\_id:product\_id:device\_id:user\_id` 这四个部分组成的四元组来唯一识别，车控指令需要确认接收方的`device\_id`，无需user\_id；

- 使用method区分场景，例如车控场景method=1，同登同退场景method=2；

- 增加PushAndWait接口，参考豆包方案用redis实现；

- 新增device\_id保存表，新增设备记录接口，用于保存vehicle\_id对应的device\_id

    ```SQL
    CREATE TABLE `vehicle_device` (
      `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
      `channel` varchar(64) NOT NULL COMMENT '渠道标识',
      `channel_app_id` int NOT NULL DEFAULT 0 COMMENT '标识渠道appid', 
      `vehicle_id` varchar(256) NOT NULL DEFAULT '' COMMENT '车辆ID',
      `device_id` varchar(256) NOT NULL DEFAULT '' COMMENT '车企oem用户ID',
      `type` int DEFAULT '0' NOT NULL COMMENT '类型，0:主设备',
      `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
      `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
      `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
       PRIMARY KEY (`id`),
       INDEX idx_channel_vehicle_id_device_id(`channel`,`vehicle_id`,`device_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='车id与设备id绑定关系存储';
    
    ```

## 客户端接入

**使用QOS要求客户端升级**：确保客户端 App 集成了支持 QoS 功能的 SDK 版本，见[客户端接入文档](https://frontier.arcosite.bytedance.com/5223/44145)、[客户端QOS文档](https://bytedance.larkoffice.com/wiki/CoUZwZkR3i2ioEkMVA4c0MmSnjb#share-YqIkdCVx2ojOMKxysZBcKbmqntd)。



## 问题排查工具 [典型问题排查](https://bytedance.larkoffice.com/wiki/LWoqwIgaCikpoykrsGAcAK5vnOh)

1\.自检工具，可以测试建连、上行消息、下行消息[cloud\.bytedance\.net](https://cloud.bytedance.net/frontier/services?x-resource-account=public&x-bc-region-id=bytedance)

2\.查询长连接

3\.根据上图中的uuid或者客户端获取的traceId[查询流量日志](https://cloud-boe.bytedance.net/netlink/v2/main/business/children/observe/log?openDrawer=true&params=%5B%7B%22tabKey%22%3A%221760082776160%22%2C%22formValue%22%3A%7B%22Query%22%3A%7B%22fieldDataset%22%3A541%2C%22Regions%22%3A%5B%22China-BOE%22%5D%2C%22filter%22%3A%7B%22conditions%22%3A%5B%7B%22field%22%3A%22connection_uuid%22%2C%22operator%22%3A%22in%22%2C%22value%22%3A%5B%22Dd1CHAojhBUmBQNAzVAPCpAc4FNakjdAF3AomtPS%22%5D%7D%5D%2C%22groups%22%3A%5B%5D%2C%22relation%22%3A%22and%22%7D%7D%2C%22Config%22%3A%7B%22time%22%3A%7B%22state%22%3A%7B%22type%22%3A%22relative%22%2C%22absolute%22%3A%5B%222025-10-10%2015%3A59%22%2C%222025-10-10%2016%3A09%22%5D%2C%22relative%22%3A%7B%22unit%22%3A%22m%22%2C%22value%22%3A10%7D%2C%22granularity%22%3A%22auto%22%2C%22timeShift%22%3A%7B%22value%22%3A0%2C%22unit%22%3A%22m%22%7D%2C%22timeZone%22%3A%22Asia%2FShanghai%22%2C%22polling%22%3Afalse%7D%7D%7D%7D%7D%5D&sequence=3&tabList=%5B%7B%22key%22%3A%221760082776160%22%2C%22title%22%3A%22%E9%BB%98%E8%AE%A4%E6%9F%A5%E8%AF%A2%22%7D%5D&ti_business_id=10051848&times=1&x-bc-region-id=bytedance&x-resource-account=boe)，分析frontier与端、云的交互；[frontier日志文档](https://frontier.arcosite.bytedance.com/2rwidgp8/c7gttca6?lang=zh-CN&open_in_browser=true)（查看每一个span具体含义，便于分析链路日志）

## 协议设计

详见[frontier的method枚举及消息格式](https://bytedance.larkoffice.com/wiki/Efp5wV5Wxiv1ZpkbKKjc1sbvnye)

# 其他

参考文档：

[Frontier技术分享](https://bytedance.larkoffice.com/docx/TGGZdVLqQot6P1xSifuc27QfnWb)

接入文档：

[Frontier接入指南](https://frontier.arcosite.bytedance.com/5223/179740)

[Frontier \- 接入平台操作手册](https://bytedance.larkoffice.com/wiki/wikcnYYzf1H7e1YSzXn5k3GHDvb)

[QoS（消息必达）接入指南](https://bytedance.larkoffice.com/wiki/CoUZwZkR3i2ioEkMVA4c0MmSnjb)

[服务端错误码表](https://bytedance.larkoffice.com/wiki/wikcntSE2XN1te1ipMAn4cLwC0d)




