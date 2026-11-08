# 触发器二期功能服务端技术方案

# 需求背景

## 需求简介

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

Meego链接

</td>
<td>

[\[需求\]【AI汽车】触发器复杂条件优化](https://meego.larkoffice.com/telematics/story/detail/6838129277)

</td>
</tr>
<tr>
<td>

PRD链接

</td>
<td>

[触发器\-复杂条件](https://bytedance.larkoffice.com/wiki/XaIuwCbq6i5nIekTrqgcdQ3kn9G)

</td>
</tr>
<tr>
<td>

PM

</td>
<td>

@吴仁杰

</td>
</tr>
<tr>
<td>

研发Owner

</td>
<td>

@刘杨

</td>
</tr>
<tr>
<td>

需求群

</td>
<td>

</td>
</tr>
</tbody></table>

## 需求合作方

<table><tbody>
<tr>
<td>

**合作方**

</td>
<td>

**接口人**

</td>
<td>

**技术方案文档**

</td>
</tr>
<tr>
<td>

前端

</td>
<td>

@樊文涛

</td>
<td>

前端页面开发

</td>
</tr>
<tr>
<td>

Advisor

</td>
<td>

@王柳苏

</td>
<td>

支持接收结构化 Context 数据

</td>
</tr>
</tbody></table>

## 需求点提炼

支持监测信号的动态变化、Advisor 接口变更修改



# 整体架构

## 业务架构



## 影响范围

在原有静态条件基础上支持动态条件监测，属于新增功能，无影响

# 详细方案

## 功能设计

### 场景细筛

#### 时序图 or 交互流程图

动态条件结构示例如下：\{左后占位状态 变更为 已占用 OR 右后占位状态 变更为 已占用 OR 中后占位状态 变更为 已占用\}

```JSON
[
    {
        "id": 0,
        "type": "vehicle",
        "code": "system_control_0004.position",
        "name": "座位占座信息.位置",
        "value":
        {
            "type": "string",
            "value": "左后"
        },
        "operator": "=",
        "logic": "&&",
        "group_index": 0,
        "group_logic": "||"
    },
    {
        "id": 1,
        "type": "vehicle",
        "code": "system_control_0004.states",
        "name": "座位占座信息.状态",
        "value":
        {
            "type": "string",
            "value": "已占用"
        },
        "operator": "=",
        "logic": "&&",
        "group_index": 0,
        "group_logic": "||"
    },
    {
        "id": 2,
        "type": "vehicle",
        "code": "system_control_0004.position",
        "name": "座位占座信息.位置",
        "value":
        {
            "type": "string",
            "value": "中后"
        },
        "operator": "=",
        "logic": "&&",
        "group_index": 1,
        "group_logic": "&&"
    },
    {
        "id": 3,
        "type": "vehicle",
        "code": "system_control_0004.states",
        "name": "座位占座信息.状态",
        "value":
        {
            "type": "string",
            "value": "已占用"
        },
        "operator": "=",
        "logic": "&&",
        "group_index": 1,
        "group_logic": "||"
    },
    {
        "id": 4,
        "type": "vehicle",
        "code": "system_control_0004.position",
        "name": "座位占座信息.位置",
        "value":
        {
            "type": "string",
            "value": "右后"
        },
        "operator": "=",
        "logic": "&&",
        "group_index": 1,
        "group_logic": "||"
    },
    {
        "id": 5,
        "type": "vehicle",
        "code": "system_control_0004.states",
        "name": "座位占座信息.状态",
        "value":
        {
            "type": "string",
            "value": "已占用"
        },
        "operator": "=",
        "logic": "&&",
        "group_index": 1,
        "group_logic": "&&"
    }
]
```

当上报的信号中，左后、中后、右后有任意一个信号变更为已占用时，检查变更信号的**旧值 \!= \&\#34;已占用\&\#34;，表示动态条件匹配成功，继续匹配该场景配置的静态条件，若静态条件匹配成功，则指定动作。**

若一个场景配置了动态条件\+静态条件，两者都满足时才会执行配置的动作

## 存储设计

```SQL
ALTER TABLE `trigger_scene`
ADD COLUMN `dynamic_conditions` text COLLATE utf8mb4_general_ci COMMENT '动态条件组合' AFTER `conditions_signals`,
ADD COLUMN `dynamic_conditions_signals` text COLLATE utf8mb4_general_ci COMMENT '动态条件中的信号名称列表' AFTER `dynamic_conditions`;
```

## 接口设计

**【最新版见：**[触发器接口文档](https://bytedance.larkoffice.com/wiki/N6HowddaNiWIC9kYzElcc7XNnLg)**】以下废弃！**

#### 获取渠道端信号配置

> 端状态、vlm信号。用于场景注册
> 
> 

**Request Method**: GET

**Request Path**: `\`/aidv/v1/trigger/signals\``

**管理后台 Path**: `\`/aidv/web/trigger/signals\``

**Request Parameter:**

<table><tbody>
<tr>
<td>

**参数**

</td>
<td>

**传递方式**

</td>
<td>

**字段类型**

</td>
<td>

**是否必需**

</td>
<td>

**说明**

</td>
</tr>
<tr>
<td>

channel

</td>
<td>

Request Query

</td>
<td>

String

</td>
<td>

Y

</td>
<td>

渠道标识

</td>
</tr>
</tbody></table>

**Response Example**:

```json
{
    "data": {
        "condition_operator":
        [{"operator":"=","name":"等于"},{"operator":"!=","name":"不等于"},{"operator":">","name":"大于"},{"operator":">=","name":"大于等于"},{"operator":"<","name":"小于"},{"operator":"<=","name":"小于等于"}],
        "condition_logic":
        {"&&":"且","||":"或"},
        "signals":
        [
            {
                "type": "vehicle",
                "name": "车状态信号",
                "signals":
                [{"name":"车内空调状态","code":"vehicle_control_0013","args":[{"name":"开关","code":"switch","type":"enum","value_to_chinese_enum_map":{"on":"开启","off":"关闭"}},{"name":"位置","code":"position","type":"str","value_to_chinese_enum_map":{}},{"name":"温度","code":"temperature","type":"str","value_to_chinese_enum_map":{}},{"name":"模式","code":"mode","type":"str","value_to_chinese_enum_map":{}},{"name":"状态","code":"states","type":"str","value_to_chinese_enum_map":{"低档":"低档","高档":"高档"}}]}]
            },
            {
                "type": "vlm",
                "name": "视觉感知信号",
                "signals":
                [{"name":"舱内视觉输出/人物列表","code":"people","args":[{"name":"人物位置","code":"position","type":"enum","value_to_chinese_enum_map":{"一排主驾":"一排主驾","一排副驾":"一排副驾","二排左":"二排左","二排中":"二排中","二排右":"二排右"}},{"name":"性别","code":"gender","type":"enum","value_to_chinese_enum_map":{"男":"男","女":"女"}}]},{"name":"舱内整体物品","code":"cabin_contents","args":[{"name":"儿童座椅","code":"child_seat","type":"enum","value_to_chinese_enum_map":{"有":"有","无":"无"}}]}]
            }
        ],
        "dynamic_condition_operator":
         [{"operator": "=", "name": "变更为"}, {"operator": "=", "name": "变更为"}]
        "dynamic_condition_logic":
        {"&&":"且","||":"或"},
        "dynamic_signals":
        [
            {
                "type": "vehicle",
                "name": "车状态信号",
                "signals":
                [{"name":"车内空调状态","code":"vehicle_control_0013","args":[{"name":"开关","code":"switch","type":"enum","value_to_chinese_enum_map":{"on":"开启","off":"关闭"}},{"name":"位置","code":"position","type":"str","value_to_chinese_enum_map":{}},{"name":"温度","code":"temperature","type":"str","value_to_chinese_enum_map":{}},{"name":"模式","code":"mode","type":"str","value_to_chinese_enum_map":{}},{"name":"状态","code":"states","type":"str","value_to_chinese_enum_map":{"低档":"低档","高档":"高档"}}]}]
            }
        ]
    },
    "errno": 0,
    "msg": "success"
}
```

#### 注册场景

**Request Method**: POST

**Request Path**: `\`/aidv/v1/trigger/scene\``

**管理后台 Path**: `\`/aidv/web/trigger/scene\``

**Request Parameter:**

<table><tbody>
<tr>
<td>

**参数**

</td>
<td>

**传递方式**

</td>
<td>

**字段类型**

</td>
<td>

**是否必需**

</td>
<td>

**说明**

</td>
</tr>
<tr>
<td>

channel

</td>
<td>

Request Query

</td>
<td>

String

</td>
<td>

Y

</td>
<td>

渠道标识

</td>
</tr>
<tr>
<td>

name

</td>
<td>

Request Body

</td>
<td>

String

</td>
<td>

Y

</td>
<td>

场景名称

</td>
</tr>
<tr>
<td>

conditions

</td>
<td>

Request Body

</td>
<td>

JSON String\(\[\]Condition\)

</td>
<td>

Y

</td>
<td rowspan="3">

参考[触发器 DSL 定义](https://bytedance.larkoffice.com/wiki/Q9nEwOrXri5swmkIRrucaC5OnEd)



</td>
</tr>
<tr>
<td>

dynamic\_conditions

</td>
<td>

Request Body

</td>
<td>

JSON String\(\[\]Condition\)

</td>
<td>

N

</td>
</tr>
<tr>
<td>

actions

</td>
<td>

Request Body

</td>
<td>

JSON String\(\[\]Action\)

</td>
<td>

Y

</td>
</tr>
<tr>
<td>

priority

</td>
<td>

Request Body

</td>
<td>

Integer

</td>
<td>

N

</td>
<td>

优先级。默认 1，取值范围 1\-10

</td>
</tr>
<tr>
<td>

source



</td>
<td>

Request Body

</td>
<td>

String

</td>
<td>

Y

</td>
<td>

来源

- aidv\_backend

</td>
</tr>
<tr>
<td>

effective\_scope

</td>
<td>

Request Body

</td>
<td>



</td>
<td>

N

</td>
<td>

生效范围。默认本渠道所有车型、所有车辆、所有客户端版本生效

</td>
</tr>
</tbody></table>

#### 更新场景

**Request Method**: POST

**Request Path**: `\`/aidv/v1/trigger/scene/update\``

**管理后台 Path**: `\`/aidv/web/trigger/scene/update\``

**Request Parameter:**

<table><tbody>
<tr>
<td>

**参数**

</td>
<td>

**传递方式**

</td>
<td>

**字段类型**

</td>
<td>

**是否必需**

</td>
<td>

**说明**

</td>
</tr>
<tr>
<td>

scene\_id

</td>
<td>

Request Query

</td>
<td>

Integer

</td>
<td>

Y

</td>
<td>

场景 ID

</td>
</tr>
<tr>
<td>

name

</td>
<td>

Request Body

</td>
<td>

String

</td>
<td>

N

</td>
<td>

场景名称

</td>
</tr>
<tr>
<td>

conditions

</td>
<td>

Request Body

</td>
<td>

JSON String

</td>
<td>

N

</td>
<td rowspan="2">

规则集，参考[触发器MVP版服务端技术方案](https://bytedance.larkoffice.com/docx/VHJVdDs9JoLhi0x7b5cc2JtPnRc#share-YYbXd1t8Go80qpxVar6cNQIUnwe)



</td>
</tr>
<tr>
<td>

dynamic\_conditions

</td>
<td>

Request Body

</td>
<td>

JSON String

</td>
<td>

N

</td>
</tr>
<tr>
<td>

actions

</td>
<td>

Request Body

</td>
<td>

String Arrray

</td>
<td>

N

</td>
<td>

执行动作集

</td>
</tr>
<tr>
<td>

priority

</td>
<td>

Request Body

</td>
<td>

Integer

</td>
<td>

N

</td>
<td>

优先级。默认 1，取值范围 1\-10

</td>
</tr>
</tbody></table>

#### 查询场景

**Request Method**: GET

**Request Path**: `\`/aidv/v1/trigger/scene\``

**管理后台 Path**: `\`/aidv/web/trigger/scene\``

**Request Parameter:**

<table><tbody>
<tr>
<td>

**参数**

</td>
<td>

**传递方式**

</td>
<td>

**字段类型**

</td>
<td>

**是否必需**

</td>
<td>

**说明**

</td>
</tr>
<tr>
<td>

channel

</td>
<td>

Request Query

</td>
<td>

String

</td>
<td>

N

</td>
<td>

渠道标识

</td>
</tr>
<tr>
<td>

scene\_id

</td>
<td>

Request Query

</td>
<td>

Integer

</td>
<td>

N

</td>
<td>

场景 ID

</td>
</tr>
<tr>
<td>

page\_size

</td>
<td>

Request Query

</td>
<td>

Integer

</td>
<td>

N

</td>
<td>

页面大小，默认 10

</td>
</tr>
<tr>
<td>

page\_number

</td>
<td>

Request Query

</td>
<td>

Integer

</td>
<td>

N

</td>
<td>

页码，默认 1

</td>
</tr>
<tr>
<td>

status

</td>
<td>

Request Query

</td>
<td>

Integer

</td>
<td>

N

</td>
<td>

场景的状态, 1: 生效 2:不生效  默认只返回不生效的场景

</td>
</tr>
</tbody></table>

Response:

<table><tbody>
<tr>
<td>

**参数**

</td>
<td>

二级字段

</td>
<td>

**字段类型**

</td>
<td>

**说明**

</td>
</tr>
<tr>
<td>

total

</td>
<td>



</td>
<td>

int64

</td>
<td>

总条数

</td>
</tr>
<tr>
<td rowspan="11">

scene\_list



</td>
<td>



</td>
<td>

arr

</td>
<td>

返回的场景列表

</td>
</tr>
<tr>
<td>

scene\_id

</td>
<td>

int64

</td>
<td>



</td>
</tr>
<tr>
<td>

name

</td>
<td>

string

</td>
<td>



</td>
</tr>
<tr>
<td>

conditions

</td>
<td>

string

</td>
<td>



</td>
</tr>
<tr>
<td>

dynamic\_conditions

</td>
<td>

string

</td>
<td>



</td>
</tr>
<tr>
<td>

actions

</td>
<td>

string

</td>
<td>



</td>
</tr>
<tr>
<td>

priority

</td>
<td>

int32

</td>
<td>



</td>
</tr>
<tr>
<td>

status

</td>
<td>

int8

</td>
<td>

1: 启用  2:禁用

</td>
</tr>
<tr>
<td>

effective\_scope

</td>
<td>

obj

</td>
<td>



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



</td>
</tr>
<tr>
<td>

update\_time

</td>
<td>

string

</td>
<td>



</td>
</tr>
</tbody></table>



# 上线方案

* [ ] Advisor 模块上线

* [ ] Trigger 服务上线



# 开发估时和里程碑



# 评审记录

## 一审记录

<div class="callout">

- *会议纪要模版：*

    - *会议主题：描述本次会议的目的*

    - *会议结论：会议达成的共识，*

    - *会议TODO：会议讨论完之后，需要做的事情，需要给截止时间，并艾特到具体人*

    - *参会人员：各个业务方的核心人员，需要给出，这样其他同学可以根据参会人员，来看这次会议的结论是否置信*

</div>




