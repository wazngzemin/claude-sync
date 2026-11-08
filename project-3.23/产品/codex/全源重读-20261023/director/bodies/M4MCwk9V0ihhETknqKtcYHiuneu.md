# \[技术方案\]停简单停车缴费工具

# 背景

**一句话描述：帮助用户完成「停简单停车场」的停车缴费。**

具体需求参考产品需求文档：[停简单停车查询及支付工具需求 ](https://bytedance.larkoffice.com/wiki/EQ4BwQlbjinc4Rkmti6cvkGnnWv)

\[Meego Title: \[需求\]【上汽DNA1\.0】停车费查询及支付融入主链路开发 Meego URL: [https://meego.larkoffice.com/telematics/story/detail/7328788560]()\]()

# 目标

实现车机端“停车信息查询及支付”能力。

本期从服务端视角只新增一个统一工具：停车缴费工具。（工具定义参考：[【AI汽车】下游工具输入输出整理](https://bytedance.larkoffice.com/wiki/NxMVwYmqLijlubkKE54cVHfrnib?sheet=a471b5) 34 行 停车费查询及支付工具）

该能力不拆分多个意图、多个工具或多套接口。用户说“查停车费”“查停车时长”“帮我缴停车费”都统一命中 `search\_and\_pay\_parking\_fee`，Planner 调用同一个停车缴费工具，工具返回固定结构的停车信息和付款链接。



服务端重点：

- 新增一个 Planner 可调用的停车缴费工具。

- 复用 Context 提供的车牌号能力。

- 包装停简单侧接口，按车牌号查询停车信息。

- 将停简单返回结果归一化为固定工具输出。

- 输出付款 URL；客户端基于 URL 展示二维码或打开 H5。



现有能力边界：

- Planner 基于工具结果组织最终回复和 TTS。

- TTS 播报链路沿用现有能力。

- 停车信息卡片和二维码渲染由客户端处理。

## 语义指令

统一意图：`search\_and\_pay\_parking\_fee`。这里的语义配置只用于识别用户是否在表达“帮我缴停车费 / 查询当前停车信息”诉求。下表中的说法都是同一个停车缴费工具的触发表达，不代表多个工具、多个接口、多套参数或多套返回结构。

<table><tbody>
<tr>
<td>

触发表达

</td>
<td>

示例

</td>
<td>

工具调用

</td>
<td>

工具返回结果

</td>
</tr>
<tr>
<td>

查询停车费

</td>
<td>

给我查下停车费；停车费是多少钱

</td>
<td rowspan="3">

`search\_and\_pay\_parking\_fee`

</td>
<td rowspan="3">

固定返回停车信息全集：

车牌号、停车场、入场时间、当前时间、应付金额、付款 URL、订单状态、错误码等

</td>
</tr>
<tr>
<td>

查询停车时长

</td>
<td>

帮我查下停了多久车；查询停车时长

</td>
</tr>
<tr>
<td>

停车缴费

</td>
<td>

我要停车缴费；帮我交停车费

</td>
</tr>
</tbody></table>

# 核心设计

## 流程图

## 技术实现

### 工具定义

对 Planner 只暴露一个工具：`search\_and\_pay\_parking\_fee`。

工具入参以车牌号为核心。缺车牌时正常链路应由 Planner 先追问，工具仅做兜底校验。

工具内部封装停简单接口：

- 注册 / 绑定车牌：首次使用时调用，保存服务有效期。

- 续费：已过期或 7 天内过期时调用，更新服务有效期。

- 查询订单 / 时长 / 费用：返回停车信息和 `payUrl`。

- 注销：用户解绑车牌时调用，不在本次缴费主链路内。

`payUrl` 当前按无过期时间处理。具体请求字段、响应字段、错误码以停简单最终接口文档为准。

### 停简单接口对接

\[parking\-api\.pdf\]

本期工具内部对接停简单四类接口，对 Planner 和客户端仍只表现为一个停车缴费工具。

<table><tbody>
<tr>
<td>

停简单接口

</td>
<td>

触发时机

</td>
<td>

服务端处理

</td>
</tr>
<tr>
<td>

注册 / 绑定车牌

</td>
<td>

本地无停简单注册记录

</td>
<td>

调用成功后保存注册状态和服务有效期；首次注册成功后通知 Context 存储车牌。

</td>
</tr>
<tr>
<td>

续费

</td>
<td>

已过期，或 7 天内即将过期

</td>
<td>

调用成功后更新本地服务有效期。

</td>
</tr>
<tr>
<td>

查询订单 / 时长 / 费用

</td>
<td>

车牌注册状态有效后

</td>
<td>

获取停车场、入场时间、停车时长、金额、`payUrl`、订单状态，并归一化为工具输出。

</td>
</tr>
<tr>
<td>

注销

</td>
<td>

用户解绑车牌

</td>
<td>

调用停简单注销接口，并清理本地注册状态。

</td>
</tr>
</tbody></table>

调用约束：

- 注册失败或续费失败时，不继续查询停车费。

- `payUrl` 当前按无过期时间处理，客户端基于该 URL 生成二维码或打开 H5。

- 停简单接口字段、错误码、超时时间以最终接口文档为准；工具层只做错误码映射和固定结构输出。

### 表结构定义

只存车牌在停简单侧的注册信息，不存费用、订单、停车场、`payUrl` 等查询结果；这些信息只记录日志和监控。

```SQL
CREATE TABLE `parking_plate_registration` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键 ID',
  `vehicle_id` varchar(64) COLLATE utf8mb4_general_ci NOT NULL COMMENT '车辆 ID，分片键，所有查询和更新必须带上',
  `plate_no` varchar(32) COLLATE utf8mb4_general_ci NOT NULL COMMENT '标准化后的车牌号',
  `car_id` varchar(64) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '停简单车牌注册 ID',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '注册状态：1 已注册，0 已注销 / 已解绑',
  `registered_at` datetime(3) NOT NULL COMMENT '首次注册 / 绑定成功时间',
  `renewed_at` datetime(3) DEFAULT NULL COMMENT '最近一次续费成功时间',
  `expired_at` datetime(3) NOT NULL COMMENT '当前停简单服务有效期',
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) COMMENT '本地记录最后更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_vehicle_plate` (`vehicle_id`,`plate_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='停简单车牌注册状态表'
```

索引说明：

- `PRIMARY KEY \(id\)` 只作为物理主键。

- `uniq\_vehicle\_plate \(vehicle\_id, plate\_no\)` 用于主链路按车牌点查、注册幂等写入、续费更新和解绑更新。

- 本期没有按过期时间批量扫描车牌的链路，不额外增加 `expired\_at` 索引。

读写规则：

- 查费前按 `vehicle\_id \+ plate\_no` 点查本表，命中 `uniq\_vehicle\_plate`。

- 未命中或 `status = 0`：调用注册 / 绑定接口，成功后插入或更新本表。

- `expired\_at \&lt;= now \+ 7d`：调用续费接口，成功后更新 `renewed\_at`、`expired\_at`、`updated\_at`。

- 有效期充足：不更新本表，直接查询停车费。

- 用户解绑：调用注销接口，成功后将 `status` 置为 `0`，更新 `updated\_at`。

### 记忆模块交互

服务端调用这个接口 NewOperateUserMemory 做写入

# 联调

<table><tbody>
<tr>
<td>

BOE 环境

</td>
<td>

boe\_ql

</td>
<td>



</td>
</tr>
<tr>
<td>

PPE 环境

</td>
<td>

ppe\_aidv\_dev3

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

测试车牌号

</td>
<td>

鄂VBD6S5

鄂VBD6S4

鄂VBD6S1

鄂VBD6S2

鄂VBD6S3



鄂VDQEF0

鄂VDQEF1

鄂VDQEF2

鄂VDQEF3

鄂VDQEF4

鄂VDQEF5

鄂VDQEF6

鄂VDQEF7

鄂VDQEF8

鄂VDQEF9

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


