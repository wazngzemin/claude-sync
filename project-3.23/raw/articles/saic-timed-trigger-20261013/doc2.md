# 触发器MVP版服务端技术方案

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

[\[需求\]【AI汽车\-12月封闭】触发器框架搭建](https://meego.larkoffice.com/telematics/story/detail/6798284803)

[\[需求\]【AI汽车\-12月封闭】触发器\-主动服务Advisor链路打通](https://meego.larkoffice.com/telematics/story/detail/6798252818)

</td>
</tr>
<tr>
<td>

PRD链接

</td>
<td>

[触发器/Condition\-Trigger\-Action](https://bytedance.larkoffice.com/wiki/HQjhwGo8mi91XYk3WiEcJsuRnNf#share-JnNMdUmw8oquClx79gec4UzMnzf)【一期功能范围（1227）】

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

前端【若需】

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

提供各个 Advisor 的接入方式：[advisor接口](https://pq3b44yw2t9.feishu.cn/wiki/WG2kwRus5ikCvlkvaoecB2dYnMb)

- 情感

- 舒适

</td>
</tr>
</tbody></table>

## 需求点提炼

支持根据不同场景中的组合条件进行结果判定、并在指定生效范围内设备执行对应任务

功能边界：

1. 仅限端信号\(端状态、vlm信号\)变化触发，定时触发不在本次方案设计之内

2. 不支持时间信号，如“5min后帮我打开空调”

3. 仅支持快照式条件触发，如“空调温度\&gt;25度\&amp;\&amp;副驾车窗关闭”；不支持变化信号的监测，如“空调温度上升到 25 度”

4. 支持部分端状态、vlm信号的条件触发

    1. 端状态：[AI汽车触发器条件\&amp;执行项](https://bytedance.larkoffice.com/wiki/KknGwH9KlinL4bkhNZTck7tinLe?sheet=NrrEoD)中【开发完】信号

    2. vlm信号：[AI汽车触发器条件\&amp;执行项](https://bytedance.larkoffice.com/wiki/KknGwH9KlinL4bkhNZTck7tinLe?sheet=lvZxRd)中 【P0】 信号

5. 仅支持打通情感、舒适 Advisor，不支持打通【条件任务解析】模块（不支持打通 planner，如需打通需要两个模块排期开发）

6. 执行频次限定：上电周期内只要匹配到已注册的场景，触发器就执行配置的 Action 链路



# 技术调研

## 行业方案调研

### 主流开源规则引擎概览

**Go语言开源规则引擎：**

<table><tbody>
<tr>
<td>

**引擎名称**

</td>
<td>

**GitHub 仓库**

</td>
<td>

**最新版本发布日期**

</td>
<td>

**规则模型/DSL**

</td>
<td>

**典型用例**

</td>
<td>

**Star**

</td>
</tr>
<tr>
<td>

**grule\-rule\-engine**

</td>
<td>

[hyperjumptech/grule\-rule\-engine](https://github.com/hyperjumptech/grule-rule-engine)

</td>
<td>

2025\-08\-30



</td>
<td>

类似 Drools 的 GRL 语言 \(WHEN\.\.\.THEN\.\.\.\)



</td>
<td>

复杂的业务规则、风控、动态定价、信审

专为 Go 语言设计的轻量级规则引擎，语法简洁，适合 Go 生态的微服务场景。

</td>
<td>

2\.4K

</td>
</tr>
<tr>
<td>

**expr**

</td>
<td>

[expr\-lang/expr](https://github.com/expr-lang/expr)

</td>
<td>

2025\-12\-15

</td>
<td>

Go 风格的单行表达式

</td>
<td>

动态配置、简单条件判断、表达式求值、安全脚本

</td>
<td>

7\.5K

</td>
</tr>
<tr>
<td>

**Open Policy Agent \(OPA\)**

</td>
<td>

[open\-policy\-agent/opa](https://github.com/open-policy-agent/opa)

</td>
<td>

2025\-12\-16



</td>
<td>

Rego 策略语言



</td>
<td>

统一的策略即代码（Policy\-as\-Code）、API 授权、K8s 准入控制、Terraform 基础设施合规性

</td>
<td>

11K



</td>
</tr>
<tr>
<td>

**Casbin**

</td>
<td>

[casbin/casbin](https://github.com/casbin/casbin)

</td>
<td>

2025\-12\-13

</td>
<td>

PERM 模型 \(Policy, Effect, Request, Matchers\)，支持 ACL, RBAC, ABAC

</td>
<td>

访问控制、权限管理



</td>
<td>

19\.6K



</td>
</tr>
<tr>
<td>

**RuleGo**

</td>
<td>

[rulego/rulego](https://github.com/rulego/rulego)



</td>
<td>

2025\-12\-17

</td>
<td>

基于组件编排的规则链 \(JSON/YAML 定义\)

</td>
<td>

物联网 \(IoT\) 数据处理、流式计算、复杂事件处理 \(CEP\)、应用集成

</td>
<td>

1\.4K

</td>
</tr>
<tr>
<td>

**Arishem**



</td>
<td>

[Arishem](https://github.com/bytedance/arishem/tree/main)



</td>
<td>

2025\-02\-05

</td>
<td>

JSON定义的 DSL

</td>
<td>

目前在公司的客服平台业务中使用

[规则引擎rule服务的设计与实现](https://bytedance.larkoffice.com/wiki/wikcnCQ84vt4KfZGTMQ8r8zjNXc)

</td>
<td>

456

</td>
</tr>
</tbody></table>

**Arishem、Grule、Expr 的对比：**[Go 规则引擎与表达式语言深度对比：Arishem vs\. Grule vs\. Expr](https://bytedance.larkoffice.com/docx/RJ96dCHEDozTZbxVWOocZXO6nZb)

<table><tbody>
<tr>
<td>



</td>
<td>

**Grule**

</td>
<td>

**Arishem**

</td>
</tr>
<tr>
<td>

Go版本

</td>
<td>

1\.24\.4\+

</td>
<td>

1\.17\+

</td>
</tr>
<tr>
<td>

优先级

</td>
<td>

- 若集合中只有一个规则，直接执行该规则。

- 若集合中有多个规则，**优先级最高的规则会被优先执行**。

- 若多个规则优先级相同，引擎会选择第一个被发现的规则（但由于 Go 语言中 map 的无序性，不建议依赖此顺序）。



</td>
<td>

arishem内置两种类型的规则，具有优先级和不具有优先级。

其中具有优先级的规则在运算时会进行排序，然后再依次做运算，**优先级高的规则通过后，便不再继续往下执行**。而不具有优先级的规则都会得到执行。

当具有优先级和不具有优先级的规则混合执行时，具有优先级的默认执行到命中\(或最后一条\)时不再继续向下执行，而不具有优先级的规则将全部得到执行。

</td>
</tr>
<tr>
<td>

规则示例

</td>
<td>

基础：

```SQL
{
    "name": "SpeedUp",
    "desc": "When testcar is speeding up we increase the speed.",
    "salience": 10,
    "when": "TestCar.SpeedUp == true && TestCar.Speed < TestCar.MaxSpeed",
    "then": [
        "TestCar.Speed = TestCar.Speed + TestCar.SpeedIncrement",
        "DistanceRecord.TotalDistance = DistanceRecord.TotalDistance + TestCar.Speed",
        "Log(\"Speed increased\")"
    ]
}
```

详细：

```JSON
{
    "name": "SpeedUp",
    "desc": "When testcar is speeding up we increase the speed.",
    "salience": 10,
    "when": {
       "and": [
           {"eq": [{"obj": "TestCar.SpeedUp"}, {"const": true}]},
           {"lt": [{"obj": "TestCar.Speed"}, {"obj": "TestCar.MaxSpeed"}]}
       ]
    },
    "then": [
        {"set": [{"obj": "TestCar.Speed"}, {"plus": [{"obj": "TestCar.Speed"}, {"obj": "TestCar.SpeedIncrement"}]}]},
        {"set": [{"obj": "DistanceRecord.TotalDistance"}, {"plus": [{"obj": "DistanceRecord.TotalDistance"}, {"obj": "TestCar.Speed"}]}]},
        {"call": ["Log", {"const": "Speed increased"}]}
    ]
}
```

</td>
<td>

```JSON
{
    "OpLogic": "&&",
    "Conditions":
    [
        {
            "Operator": "==",
            "Lhs":
            {
                "FuncExpr":
                {
                    "FuncName": "GetCurrentYear"
                }
            },
            "Rhs":
            {
                "Const":
                {
                    "NumConst": 2023
                }
            }
        }
    ]
}
```

</td>
</tr>
</tbody></table>

### ~~消息中间件对比~~

[~~字节消息体系中间件最佳实践 v1\.1~~](https://cloud.bytedance.net/docs/eventbus_cn/wiki/L6fTdFePzoUzd9xNaECcfibUnxc?x-resource-account=public&x-bc-region-id=bytedance)

[~~消息队列 RocketMQ 版与开源版本区别~~](https://cloud.bytedance.net/docs/rocketmq/docs/646f4e4111c9bb02200052ba/647457e5e5f6e20280d7c36d?x-resource-account=public&x-bc-region-id=bytedance)~~：延时队列~~

## 最终选型

### 规则引擎：Grule

<table><tbody>
<tr>
<td>

**DSL**

</td>
<td>

**结果**

</td>
<td>

**脚本**

</td>
</tr>
<tr>
<td>

```JSON
{
    "conditions":
    {
        "type": "group",
        "logic": "or",
        "children":
        [
            {"type":"group","logic":"and","children":[{"type":"atom","atom":{"key":"key1","value":1,"rule":">="}},{"type":"atom","atom":{"key":"key2","value":"2","rule":"="}}]},
            {
                "type": "group",
                "logic": "and",
                "children":
                [{"type":"atom","atom":{"key":"key3","value":3.0,"rule":"<="}},{"type":"atom","atom":{"key":"key4","value":4,"rule":">"}},{"type":"atom","atom":{"key":"key5","value":5,"rule":">"}},{"type":"atom","atom":{"key":"key6","value":6,"rule":"!="}}]
            }
        ]
    },
    "actions": ["comfort_advisor"]
}
```

</td>
<td>



</td>
<td>

\[grule\_main\.go\]



</td>
</tr>
<tr>
<td>

场景引擎的 Condition 定义

`\`\(key1 \&gt;= 1 \&amp;\&amp; key2 == \&\#34;2\&\#34;\) \|\| \(key3 \&lt;= 3\.0 \&amp;\&amp; key4 \&gt; 4 \&amp;\&amp; key5 \&gt; 5 \&amp;\&amp; key6 \!= 6\)\``

```JSON
[
    {"code": "key1", "logic": "&", "value": {"type": "int", "value": "1"}, "operator": ">=", "group_index": 0, "group_logic": "||"},
    {"code": "key2", "logic": "&", "value": {"type": "string","value": "2"}, "operator": "=", "group_index": 0, "group_logic": "||"},
    {"code": "key3", "logic": "&", "value": {"type": "float","value": "3.0"}, "operator": "<=", "group_index": 1, "group_logic": "||"},
    {"code": "key4", "logic": "&", "value": {"type": "int", "value":"4"}, "operator": ">", "group_index": 1, "group_logic": "||"},
    {"code": "key5", "logic": "&", "value": {"type": "int", "value":"5"}, "operator": ">", "group_index": 1, "group_logic": "||"},
    {"code": "key6", "logic": "&", "value": {"type": "int", "value":"6"}, "operator": "!=", "group_index": 1, "group_logic": "||"}
]
```

</td>
<td>



</td>
<td>

\[grule\_dsl\.go\]



</td>
</tr>
</tbody></table>

1. 复用场景引擎的 Condition、Action 定义，Action 定义示例如下\(删除了部分字段\)

```JSON
{
    "id": 1,
    "name": "",
    "type": "",
    "code": "",
    "execute_info":
    {
        "repeat_num": 5,
        "repeat_interval": "" // 纳秒精度
    }
}
```



### ~~消息队列：消息队列 RocketMQ 版~~

~~支持延时 5s \~ 32Days（覆盖自然月）的消息，最大32Days~~



### DSL 定义

[触发器 DSL 定义](https://bytedance.larkoffice.com/wiki/Q9nEwOrXri5swmkIRrucaC5OnEd)



# 整体架构

触发器服务和aidv服务隔离，使用独立的psm：vehicle\.model\.aidv\_trigger

- 触发器功能相对较为独立，单独迭代部署界限更清晰

- 后续会承接更多功能，部分自主性

## 业务架构



## 影响范围

新增功能模块，无影响

# 详细方案

## 功能设计

### 场景搜索

每个渠道下可能会创建大量的场景，在有端状态信号上报时，需要对该渠道下的场景列表进行过滤，找到最匹配的场景集合，进行具体规则匹配，也就是**场景粗筛\-\&gt;场景匹配**

#### 时序图 or 交互流程图

### 场景匹配

#### 时序图 or 交互流程图

> 需要考虑条件中的信号非同时上报的情况
> 
> 

## 存储设计



## 接口设计

### 内部接口设计

**【最新版见：**[触发器接口文档](https://bytedance.larkoffice.com/wiki/N6HowddaNiWIC9kYzElcc7XNnLg)**】以下废弃！**

#### 获取渠道列表【Done】

不需要分页，返回所有渠道

**Request Method**: GET

**Request Path**: `\`/aidv/web/channels\``

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

是

</td>
<td>

渠道标识，由火山颁发。固定传入\&\#34;master\&\#34;

</td>
</tr>
<tr>
<td>

vehicle\_id

</td>
<td>

Request Query

</td>
<td>

String

</td>
<td>

是

</td>
<td>

车辆唯一标识，固定填入“trigger”

</td>
</tr>
</tbody></table>

**Response Data**:

<table><tbody>
<tr>
<td>

**字段**

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

errno

</td>
<td>

数字

</td>
<td>

响应码

</td>
</tr>
<tr>
<td>

msg

</td>
<td>

字符串

</td>
<td>

错误信息

</td>
</tr>
<tr>
<td>

data

</td>
<td>

JSON

</td>
<td>

响应数据

</td>
</tr>
</tbody></table>

**Example**:

```json
curl --location --request GET 'https://api-vehicle.volcengine.com/aidv/web/channels?channel=master&vehicle_id=trigger'

{
    "data": [
        {
            "channel": "seres",
            "channel_name": "赛力斯"
        },
        {
            "channel": "master",
            "channel_name": "主线"
        }
    ],
    "errno": 0,
    "msg": "success"
}
```

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
        {"=":"等于","!=":"不等于",">":"大于",">=":"大于等于","<":"小于","<=":"小于等于"},
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
        ]
    },
    "errno": 0,
    "msg": "success"
}
```

#### 获取支持的 Actions 列表

**Request Method**: GET

**Request Path**: `\`/aidv/v1/trigger/actions\``

**管理后台 Path**: `\`/aidv/web/trigger/actions\``

**Request Parameter: **

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

是

</td>
<td>

渠道标识，由火山颁发。固定传入\&\#34;master\&\#34;

</td>
</tr>
<tr>
<td>

vehicle\_id

</td>
<td>

Request Query

</td>
<td>

String

</td>
<td>

是

</td>
<td>

车辆唯一标识，固定填入“trigger”

</td>
</tr>
</tbody></table>

**Response Example**:

```json
{
    "data":
    {
        "actions":
        [
            {
                "name": "舒适 Advisor",
                "value": "comfort_advisor",
                "params": [
                    {
                        "code": "attention",
                        "name": "事件/注意力信息",
                        "value": {
                            "type": "str",
                            "value": ""
                        }
                    }
                ]
            },
            {
                "name": "情感 Advisor",
                "value": "emotion_advisor",
                "params": [
                    {
                        "code": "attention",
                        "name": "事件/注意力信息",
                        "value": {
                            "type": "str",
                            "value": ""
                        }
                    }
                ]
            },
            {
                "name": "主动推荐",
                "value": "recommend",
                "params": [
                    {
                        "code": "advisor_input",
                        "name": "建议信息",
                        "value": {
                            "type": "str",
                            "value": ""
                        }
                    }
                ]
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
<td rowspan="2">

参考[触发器 DSL 定义](https://bytedance.larkoffice.com/wiki/Q9nEwOrXri5swmkIRrucaC5OnEd)



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

`\`effective\_scope\``定义如下：

```JSON
{
    "vehicle_type": [],
    "client": [EffectiveScopeClientData],
    "vehicle_id": []
}

struct EffectiveScopeClientData {
    1: string model
    2: list<string> values
}

```

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
<td>

规则集，参考[触发器MVP版服务端技术方案](https://bytedance.larkoffice.com/docx/VHJVdDs9JoLhi0x7b5cc2JtPnRc#share-YYbXd1t8Go80qpxVar6cNQIUnwe)

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
<td rowspan="4">

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



</td>
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



</td>
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



</td>
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



</td>
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



</td>
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



</td>
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

\`effective\_scope\` 定义

```JSON
{
    "vehicle_type": [],
    "client": [EffectiveScopeClientData],
    "vehicle_id": []
}

struct EffectiveScopeClientData {
    1: string model
    2: list<string> values
}

```



#### 调整场景状态 \(删除/生效/失效\)

**Request Method**: POST

**Request Path**: `\`/aidv/v1/trigger/scene/update``\_status``\``

**管理后台 Path**: `\`/aidv/web/trigger/scene/update\_status\``

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

status

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

场景状态。1：有效，2：失效  3:删除

</td>
</tr>
</tbody></table>

#### 规则匹配和触发 Action

**Request Method**: POST

**~~Request Path~~**~~: ~~~~`\`/aidv/v1/trigger/run\``~~

**管理后台 Path**: `\`/aidv/web/trigger/run\``

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

app\_id

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

字节内部 appid

</td>
</tr>
<tr>
<td>

channel\_app\_id

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

aidv分配的渠道 appid

</td>
</tr>
<tr>
<td>

login\_doubao\_uid

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

豆包账号 id

</td>
</tr>
<tr>
<td>

vehicle\_type

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

车型

</td>
</tr>
<tr>
<td>

vehicle\_id

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

设备唯一 ID

</td>
</tr>
<tr>
<td>

face\_id

</td>
<td>

Request String

</td>
<td>

String

</td>
<td>

N

</td>
<td>

Face ID

</td>
</tr>
<tr>
<td>

sound\_zone

</td>
<td>

Request String

</td>
<td>

String

</td>
<td>

N

</td>
<td>

语音音区

</td>
</tr>
<tr>
<td>

client\_version

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

客户端版本，没有的话可以先传 \&\#34;all\&\#34;

</td>
</tr>
<tr>
<td>

trigger\_info

</td>
<td>

Request Body

</td>
<td>

TriggerInfo

</td>
<td>

Y

</td>
<td>

触发信息

</td>
</tr>
</tbody></table>

`\`TriggerInfo\``结构如下：

```JSON
{
    "mode": "", // 触发方式。枚举值：signal_report
    "data": "{\"report_type\":\"\",\"signal_data\":[{\"id\":\"\",\"subresource\":[{\"position\":\"\",\"switch\":\"\"}]}]}"
}
```

#### 规则匹配和触发 Action For QA

参考[公版\-AI汽车接口访问指南](https://bytedance.larkoffice.com/docx/OZjjdzEldo3J1pxXQ0OcW5Ugn5d#share-PuWNdpuvKoAPKqxrSxBcktetn5b)【10\. 车端信息上报】

## 依赖项

1. [AI汽车触发器条件\&amp;执行项](https://bytedance.larkoffice.com/wiki/KknGwH9KlinL4bkhNZTck7tinLe?sheet=lvZxRd)中的 vlm 信号需要输出信号 ID、状态参数，类似端状态信号



# 可用性设计

## 监控报警

<table><tbody>
<tr>
<td>

**场景**

</td>
<td>

**报警方式**

</td>
<td>

**备注**

</td>
</tr>
<tr>
<td>

规则解析失败

</td>
<td rowspan="2">

飞书报警群：单独建一个ai汽车业务报警群



</td>
<td>



</td>
</tr>
<tr>
<td>

执行动作失败

</td>
<td>



</td>
</tr>
</tbody></table>



# 上线方案

* [ ] 触发器服务上线

    * [ ] 创建数据库表

    * [ ] tce服务升级

* [ ] aidv服务上线

    * [ ] acl 配置

    * [ ] tce 服务升级



# 开发估时和里程碑

1\.5 人力

# 评审记录

## 一审记录

<div class="callout">

- *会议纪要模版：*

    - *会议主题：描述本次会议的目的*

    - *会议结论：会议达成的共识，*

    - *会议TODO：会议讨论完之后，需要做的事情，需要给截止时间，并艾特到具体人*

    - *参会人员：各个业务方的核心人员，需要给出，这样其他同学可以根据参会人员，来看这次会议的结论是否置信*

</div>

共识：

1. 本期不打通【条件任务模块】和 【planner】 

2. 是否打通【长时任务】以及何时打通需要等 2025\-12\-19 晚点评审 @郝晓伟 



TODO：

1. 确认 vlm 信号的取值是否已经确定好，必须是有限集 @吴仁杰

2. 云端触发 action 的限频策略定义@吴仁杰

3. vlm 信号的 id 是否可以使用中文，如果可以尽量用中文 @刘杨

4. 确认场景引擎的 dsl 是否满足触发器使用@刘杨 ，确认[触发器MVP版服务端技术方案](https://bytedance.larkoffice.com/docx/VHJVdDs9JoLhi0x7b5cc2JtPnRc)中定义的 dsl 端侧解析可行性和工作量@姜锋 

5. 触发器中如何感知车辆下电，@刘杨 和@向超然 @赵衍 沟通确定


