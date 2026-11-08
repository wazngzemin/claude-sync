# 【AI 汽车】车书 QA 技术方案

<div class="callout">

本次只评审车书知识查询的链路设计

计划同步实现一个通用的文件写入 Viking DB 的接口，后续和 [【AI汽车\-PRD】车辆配置知识使用](https://bytedance.larkoffice.com/wiki/KAxNwpegbib8MekPQi8c58Zhnld) 需求一起评审。

</div>

# 业务背景

PRD：[【AI汽车】车书需求  二期](https://bytedance.larkoffice.com/docx/NT3fdQqJ0oQLA0xCPJKcpFaJnQb)

需求理解：将车书知识的查询从工具调用前置到 context 模块中，降低整体链路的耗时



<table><tbody>
<tr>
<td>

常用车书知识

</td>
<td>

静态车书问答的 QA 对，本期共 2000 条。

</td>
</tr>
<tr>
<td>

dpfm\.rewrite\_query

</td>
<td>

Query 改写插件，在检索之前做

</td>
</tr>
<tr>
<td>

source

</td>
<td>

Context 在粗筛阶段的数据源，数据存在 VikingDB 中。

</td>
</tr>
<tr>
<td>

vehicle\_knowledge

</td>
<td>

本次新增的 source，查询车书知识。

</td>
</tr>
<tr>
<td>

knowledge

</td>
<td>

Context 加到 director 的变量，只包含 answer。

</td>
</tr>
</tbody></table>

**现有方案**中，查询车书知识作为一个独立的工具，被 director 作为下游工具调用。

**本期目标**是把常用的车书知识从原先的独立车书工具，前置到 director 之前的 context 初筛步骤。如果车书工具是唯一一个工具调用，RPC 请求的耗时就会被拿掉；而如果车书知识没有成为 Context 最慢的粗筛，那这段成本会被并发隐藏。

> - 用户 Query：`雨太大了 雨刮器该怎么调啊`
> 
> - 检索目标：`怎么实现频繁自动刮水？`
> 
> - 原始结果：`可以将照明/风挡玻璃雨刮器组合开关3拨至对应的位置\.\.\.`，本期只考虑纯文字。
> 
> 



# 数据存储

QA 对在离线入库阶段完成结构化清洗。

创建新 collection 存储，结构如下：

<table><tbody>
<tr>
<td>

字段

</td>
<td>

类型

</td>
<td>

说明

</td>
</tr>
<tr>
<td>

id

</td>
<td>

string

</td>
<td>

QA 对唯一 ID

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

租户、车辆过滤字段

</td>
</tr>
<tr>
<td>

channel\_app\_id

</td>
<td>

int

</td>
<td>

租户过滤字段

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

车辆过滤字段

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

车型过滤字段

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

向量化文本，只保留 query

</td>
</tr>
<tr>
<td>

answer

</td>
<td>

string

</td>
<td>

给 Director 的纯文本答案

</td>
</tr>
</tbody></table>



# 检索设计

车书 QA 知识存储在 VikingDB 中，使用独立 collection/index，与用户记忆、场景 RAG 等数据隔离。

用如下参数实现检索和过滤。

<table><tbody>
<tr>
<td>

字段

</td>
<td>

类型

</td>
<td>

检索字段

</td>
<td>

过滤字段

</td>
<td>

说明

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

否

</td>
<td>

标准问题，同时作为检索字段

</td>
</tr>
<tr>
<td>

answer

</td>
<td>

string

</td>
<td>

否

</td>
<td>

否

</td>
<td>

标准答案，用于筛选出之后交给 director

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

否

</td>
<td>

是

</td>
<td>

租户、车辆维度过滤字段

</td>
</tr>
<tr>
<td>

channel\_app\_id

</td>
<td>

int

</td>
<td>

否

</td>
<td>

是

</td>
<td>

租户维度过滤字段

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

否

</td>
<td>

是

</td>
<td>

车辆维度过滤字段

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

否

</td>
<td>

是

</td>
<td>

车型过滤字段

</td>
</tr>
</tbody></table>

下列参数和代码逻辑相关

<table><tbody>
<tr>
<td>

参数

</td>
<td>

初始值

</td>
<td>

说明

</td>
</tr>
<tr>
<td>

limit

</td>
<td>

3

</td>
<td>

召回最多 3 条 QA

</td>
</tr>
<tr>
<td>

score\_threshold

</td>
<td>

待评测确定

</td>
<td>

通过测试集调参，避免误召回

</td>
</tr>
<tr>
<td>

dense\_weight

</td>
<td>

待评测确定

</td>
<td>

依据 VikingDB 混合检索配置确定

</td>
</tr>
</tbody></table>



# 接口修改

面向 2000 条静态的车书问答 QA 对：

1. 对用户真实 query 做改写，以支持多轮请求

2. 用改写后的在 VikingDB 中做检索

3. 召回 TOP3 的回复

4. 将召回的 A 作为 SP 变量交给 director 进行理解。图片交给端侧做展示。

## 改写

利用`dpfm/biz/service/chat\_ai/plugin/rewrite\.go` 的插件能力做改写，需要如下改写参数：

<table><tbody>
<tr>
<td>

参数

</td>
<td>

来源

</td>
<td>

说明

</td>
</tr>
<tr>
<td>

`intent\_type`

</td>
<td>

固定值 `operation\_manual`

</td>
<td>

表示车书/车辆操作手册场景

</td>
</tr>
<tr>
<td>

`plugin\_name`

</td>
<td>

固定值 `rewrite\_query`

</td>
<td>

直接调用 DPFM query 改写插件

</td>
</tr>
<tr>
<td>

`query`

</td>
<td>

`QueryParams\.Query`

</td>
<td>

用户原始 query

</td>
</tr>
<tr>
<td>

`query\_info\.query\_type`

</td>
<td>

固定值 `Query`

</td>
<td>

标识当前是正式 query，不是 pre\-query

</td>
</tr>
<tr>
<td>

`History`

</td>
<td>

`HistoryList`

</td>
<td>

支持多轮

</td>
</tr>
<tr>
<td>

`common\_info\.channel`

</td>
<td>

`ContextCommonInfo\.Channel`

</td>
<td>

渠道

</td>
</tr>
<tr>
<td>

`common\_info\.app\_id`

</td>
<td>

`GetDpfmAppID\(ChannelAppID\)`

</td>
<td>

DPFM 侧 app\_id

</td>
</tr>
<tr>
<td>

`common\_info\.vehicle\_id`

</td>
<td>

`ContextCommonInfo\.VehicleID`

</td>
<td>

车辆 ID，用于车书场景上下文

</td>
</tr>
<tr>
<td>

`channel`

</td>
<td>

`ContextCommonInfo\.Channel`

</td>
<td>

DPFM 外层 channel 字段

</td>
</tr>
</tbody></table>

执行器获取车书 Agent 配置，然后调用 `rewrite\_query` 插件。插件返回改写 query，用于后续 VikingDB 检索。

## 检索

1. 使用改写的 query 作为检索 query。

2. 检索时根据需求带上租户/车辆过滤条件：`channel`\+`channel\_app\_id`或`vehicle\_id`。

3. 如果车书存在车型或版本差异，则追加过滤条件`vehicle\_type`。

## 召回

1. 利用 query 和过滤条件进行向量检索，召回 TOP3。

2. 对召回结果使用 `score\_threshold` 做低置信过滤，低于阈值的结果不注入 Director。

3. 如果过滤后无结果，则 `knowledge` 变量为空，Director 不使用车书知识进行推理。



# 代码修改

## 新增 `vehicle\_knowledge` context source

- `biz/service/context/retrieval/helper/implement/vehicle\_knowledge\.go`
新增 `vehicle\_knowledge` context source，实现 `ContextSourceRetrieval` 接口。

主要逻辑：

1. 从请求体和变量中中读取信息检索和过滤参数。

2. 构造 VikingDB 查询过滤条件：

    - 租户维度：`channel \+ channel\_app\_id`

    - 单车维度：`channel \+ vehicle\_id`

4. 调用 VikingDB 做向量粗筛，召回 TOP3。

5. 对低于 `score\_threshold` 的结果做过滤。

6. 将召回结果注入 `knowledge`

## 注册 context source

- `biz/service/context/retrieval/helper/export\.go`
在 `contextSourceFactories` 中注册 `vehicle\_knowledge` source，使 `retrieval\.Query` 可以按 scope 调用该 source。同时新增 `GetVehicleKnowledge\(ctx\)` 方法，用于从 context source 中获取结构化车书知识结果。



- `biz/service/context/retrieval/helper/implement/define\.go`
新增 source 类型 `vehicle\_knowledge`

## Context 查询参数与返回结构适配

- `biz/service/context/retrieval/define\.go`
在 `ContextCustomParams` 中新增 `VehicleKnowledgeParams`，用于传入车书知识检索和过滤参数。



- `biz/service/context/retrieval/retrieval\.go`
在 `buildStructuredRetrieval` 中填充 `VehicleKnowledge`，使 `with\_struct=true` 时可以返回车书知识结构化结果。

## Context 查询入口适配

- `biz/handler/v1/context\.go`
HTTP Context 查询入口将 `vehicle\_knowledge\_params` 转换为 `VehicleKnowledgeRetrievalParams`，并放入 `ContextCustomParams` 传给 `vehicle\_knowledge` source。

- `/Users/bytedance/Desktop/aidv/biz/handler/rpc/aidv\.go`
Context RPC 接口，同理，禁用

- `biz/service/prompt/application/application\.go`
如果 S2S 获取 system prompt 的链路也需要车书知识，同理，禁用

## direcrot 注入 SP 变量

- `biz/service/planner/planner\.go`
在 `getSystemPromptVariables` 中增加 `vehicle\_knowledge` 查询：

    1. `ContextScope` 中加入 `ContextSourceTypeVehicleKnowledge`。

    2. 调用 `retrieval\.Query` 时加入获取车书知识检索字段。

    3. 将结果写入 SP 变量：Director 通过 `knowledge` 获取车书 QA 初筛结果。





# TODO

* [x] ~~图片要交给 director 吗？走什么链路？
不考虑图片~~

* [x] ~~下游用什么 agent/tool
初筛前改写，不做下游兜底方案~~

* [x] ~~图片存储？job？替换？
不考虑图片~~

* [x] ~~是否要禁用车书工具 
yes~~

* [x] ~~产品同学给车书数据~~

* [x] ~~score\_threshold 和 dense\_weight 明确一下
~~



# 排期

<table><tbody>
<tr>
<td>

技术方案评审

</td>
<td>

5\.7

</td>
</tr>
<tr>
<td>

开发

</td>
<td>

5\.8\-5\.9

</td>
</tr>
<tr>
<td>

自测

</td>
<td>

5\.11

</td>
</tr>
<tr>
<td>

提测

</td>
<td>

5\.11 下班前

</td>
</tr>
</tbody></table>




