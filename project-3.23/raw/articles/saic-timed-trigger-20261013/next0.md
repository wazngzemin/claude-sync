# 触发器接口文档

<table><tbody>
<tr>
<td>

日期

</td>
<td>

修订内容

</td>
<td>

修订人

</td>
</tr>
<tr>
<td>

2026\-01\-26

</td>
<td>

- 支持 Admin 后台优化接口更新，搜\&\#34;【2026\-01\-26 新增】\&\#34;即可

</td>
<td>

@刘杨

</td>
</tr>
</tbody></table>

# 内部接口

#### 获取渠道列表

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
    "ResponseMetadata":
    {
        "RequestId": "",
        "Action": "",
        "Version": "",
        "Service": "",
        "Region": ""
    },
    "Result":
    {
        "condition_logic":
        {
            "&&": "且",
            "||": "或"
        },
        "signals":
        [
            {
                "type": "vehicle",
                "name": "车状态信号",
                "signals":
                [
                    {
                        "name": "近光灯",
                        "code": "signal_light_0001",
                        "args":
                        [
                            {
                                "name": "状态",
                                "code": "states",
                                "type": "enum",
                                "value_to_chinese_enum_map":
                                {
                                    "关闭": "关闭",
                                    "显示绿色": "显示绿色"
                                },
                                "operator":
                                [
                                    {
                                        "operator": "=",
                                        "name": "等于"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "座椅加热状态",
                        "code": "vehicle_control_0024",
                        "args":
                        [
                            {
                                "name": "状态",
                                "code": "states",
                                "type": "str",
                                "value_to_chinese_enum_map":
                                {},
                                "operator":
                                [
                                    {
                                        "operator": "=",
                                        "name": "等于"
                                    }
                                ]
                            },
                            {
                                "name": "位置",
                                "code": "position",
                                "type": "enum",
                                "value_to_chinese_enum_map":
                                {
                                    "三排中": "三排中",
                                    "三排右": "三排右",
                                    "三排左": "三排左",
                                    "主驾": "主驾",
                                    "二排中": "二排中",
                                    "二排右": "二排右",
                                    "二排左": "二排左",
                                    "副驾": "副驾",
                                    "右后": "右后",
                                    "左后": "左后"
                                },
                                "operator":
                                [
                                    {
                                        "operator": "=",
                                        "name": "等于"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "type": "vlm",
                "name": "vlm 信号",
                "signals":
                []
            }
        ],
        "dynamic_condition_logic":
        {
            "&&": "且",
            "||": "或"
        },
        "dynamic_signals":
        [
            {
                "type": "vehicle",
                "name": "车状态信号",
                "signals":
                [
                    {
                        "name": "上下电状态",
                        "code": "vehicle_control_0054",
                        "args":
                        [
                            {
                                "name": "上下电",
                                "code": "states",
                                "type": "enum",
                                "value_to_chinese_enum_map":
                                {
                                    "上电": "上电",
                                    "下电": "下电"
                                },
                                "operator":
                                [
                                    {
                                        "operator": "change_to",
                                        "name": "变更为"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "当前播放音频",
                        "code": "media_0001",
                        "args":
                        [
                            {
                                "name": "上一首歌曲名",
                                "code": "previous_song",
                                "type": "str",
                                "value_to_chinese_enum_map":
                                {},
                                "operator":
                                [
                                    {
                                        "operator": "change",
                                        "name": "有变更"
                                    }
                                ]
                            },
                            {
                                "name": "下一首歌曲名",
                                "code": "next_song",
                                "type": "str",
                                "value_to_chinese_enum_map":
                                {},
                                "operator":
                                [
                                    {
                                        "operator": "change",
                                        "name": "有变更"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "type": "vlm",
                "name": "vlm 信号",
                "signals":
                []
            }
        ],
        "BaseResp":
        {
            "StatusMessage": "",
            "StatusCode": 0
        }
    }
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
                            "value": "\"reason\": \"新乘客上车落座，友好的问候能让其感受到欢迎和关怀，营造温馨的车内氛围。询问是否需要调节车内设施，体现对乘客需求的关注，有助于提升乘客的舒适感和愉悦感。\",
\"advice\":\"交互助手可以友好地向新上车的后排乘客打招呼，例如说“您好,欢迎上车,祝您旅途愉快”，并询问是否需要调节座椅等车内设施。\"" //【2026-01-26 新增】示例模板，用户可以修改
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

- extour

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
<tr>
<td>

execute\_policy

</td>
<td>

Request Body

</td>
<td>

Object

</td>
<td>

N

</td>
<td>

场景执行策略【2026\-01\-26 新增】

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

`\`execute\_policy\``定义如下：

```JSON
{
    "total_count": 100,
    "daily_count": 100,
    "power_count": 10,
    "execute_interval":  60 // 传递给后端时转成秒
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
<tr>
<td>

execute\_policy

</td>
<td>

Request Body

</td>
<td>

Object

</td>
<td>

N

</td>
<td>

场景执行策略【2026\-01\-26 新增】

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
<tr>
<td>

name

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

场景名称，支持前缀模糊搜索【2026\-01\-26 新增】

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

Int64

</td>
<td>

总条数

</td>
</tr>
<tr>
<td rowspan="12">

scene\_list



</td>
<td>



</td>
<td>

Array

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

Int64

</td>
<td>



</td>
</tr>
<tr>
<td>

name

</td>
<td>

String

</td>
<td>



</td>
</tr>
<tr>
<td>

conditions

</td>
<td>

String

</td>
<td>



</td>
</tr>
<tr>
<td>

dynamic\_conditions

</td>
<td>

String

</td>
<td>



</td>
</tr>
<tr>
<td>

actions

</td>
<td>

String

</td>
<td>



</td>
</tr>
<tr>
<td>

priority

</td>
<td>

Int32

</td>
<td>



</td>
</tr>
<tr>
<td>

status

</td>
<td>

Int8

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

Object

</td>
<td>



</td>
</tr>
<tr>
<td>

channel

</td>
<td>

String

</td>
<td>



</td>
</tr>
<tr>
<td>

update\_time

</td>
<td>

String

</td>
<td>



</td>
</tr>
<tr>
<td>

execute\_policy

</td>
<td>

Object

</td>
<td>

执行策略【2026\-01\-26 新增】

</td>
</tr>
</tbody></table>



#### 更新场景状态 \(删除/生效/失效\)

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

Int

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

Int

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

#### 查询触发记录【2026\-01\-26 新增】

**Request Method**: GET

**管理后台 Path**: `\`/aidv/web/trigger/history\``

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

scene\_id

</td>
<td>

Request Query

</td>
<td>

Int

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

start\_time

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

开始时间，2026\-01\-26 17:20:32

</td>
</tr>
<tr>
<td>

end\_time

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

结束时间，2026\-01\-26 17:20:37

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

响应数据如下：

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

Int

</td>
<td>

总条数

</td>
</tr>
<tr>
<td rowspan="8">

histories



</td>
<td>



</td>
<td>

Array

</td>
<td>

返回的场景列表

</td>
</tr>
<tr>
<td>

triggered\_at

</td>
<td>

String

</td>
<td>

触发时间

</td>
</tr>
<tr>
<td>

scene\_id

</td>
<td>

Int

</td>
<td>

场景 ID

</td>
</tr>
<tr>
<td>

scene\_name

</td>
<td>

String

</td>
<td>

场景名称

</td>
</tr>
<tr>
<td>

vehicle\_id

</td>
<td>

String

</td>
<td>

车辆 ID

</td>
</tr>
<tr>
<td>

trigger\_conditions

</td>
<td>

String

</td>
<td>

触发条件

</td>
</tr>
<tr>
<td>

execute\_result

</td>
<td>

String

</td>
<td>

执行结果

</td>
</tr>
<tr>
<td>

log\_id

</td>
<td>

String

</td>
<td>

Log ID

</td>
</tr>
</tbody></table>




