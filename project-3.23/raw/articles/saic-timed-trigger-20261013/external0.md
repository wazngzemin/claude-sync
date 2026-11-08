# 触发器接口文档【对外】

#### 获取渠道端信号配置

> 端状态、vlm信号。用于场景注册
> 
> 

**Request Method**: GET

**Request Path**: `\```/aidv/v1/trigger/signals\``

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
    "data":
    {
        "condition_logic":
        {"&&":"且","||":"或"},
        "signals":
        [{"type":"vehicle","name":"车状态信号","signals":[{"name":"车内空调状态","code":"vehicle_control_0013","args":[{"name":"开关","code":"switch","type":"enum","value_to_chinese_enum_map":{"on":"开启","off":"关闭"}},{"name":"位置","code":"position","type":"str","value_to_chinese_enum_map":{}},{"name":"温度","code":"temperature","type":"str","value_to_chinese_enum_map":{}},{"name":"模式","code":"mode","type":"str","value_to_chinese_enum_map":{}},{"name":"状态","code":"states","type":"str","value_to_chinese_enum_map":{"低档":"低档","高档":"高档"}}]}]},{"type":"vlm","name":"视觉感知信号","signals":[{"name":"舱内视觉输出/人物列表","code":"people","args":[{"name":"人物位置","code":"position","type":"enum","value_to_chinese_enum_map":{"一排主驾":"一排主驾","一排副驾":"一排副驾","二排左":"二排左","二排中":"二排中","二排右":"二排右"}},{"name":"性别","code":"gender","type":"enum","value_to_chinese_enum_map":{"男":"男","女":"女"}}]},{"name":"舱内整体物品","code":"cabin_contents","args":[{"name":"儿童座椅","code":"child_seat","type":"enum","value_to_chinese_enum_map":{"有":"有","无":"无"}}]}]}],
        ~~"dynamic_condition_operator":~~
~~        [{"operator":"=","name":"变更为"},{"operator":"=","name":"变更为"}],~~
        "dynamic_condition_logic":
        {"&&":"且","||":"或"},
        "dynamic_signals":
        [{"type":"vehicle","name":"车状态信号","signals":[{"name":"车内空调状态","code":"vehicle_control_0013","args":[{"name":"开关","code":"switch","type":"enum","value_to_chinese_enum_map":{"on":"开启","off":"关闭"}},{"name":"位置","code":"position","type":"str","value_to_chinese_enum_map":{}},{"name":"温度","code":"temperature","type":"str","value_to_chinese_enum_map":{}},{"name":"模式","code":"mode","type":"str","value_to_chinese_enum_map":{}},{"name":"状态","code":"states","type":"str","value_to_chinese_enum_map":{"低档":"低档","高档":"高档"}}]}]}]
    },
    "errno": 0,
    "msg": "success"
}
```

#### 获取支持的 Actions 列表

**Request Method**: GET

**Request Path**: `\`/aidv/v1/trigger/actions\``

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

渠道标识，由火山颁发

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
            },
            {
                "name": "自定义回调",
                "value": "custom_callback", // 仅支持 GET Method
                "params": [
                    {
                        "code": "callback_url", // 必须携带 channel app_id 参数
                        "name": "回调地址",
                        "value": {
                            "type": "str",
                            "value": ""
                        }
                    }
                ]
            },
        ]
    },
    "errno": 0,
    "msg": "success"
}
```

#### 注册场景

**Request Method**: POST

**Request Path**: `\`/aidv/v1/trigger/scene\``

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

参考[触发器 DSL 定义【对外】](https://bytedance.larkoffice.com/docx/TuDldeM72o3ksNxtbLzc8q2tnBg)



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

- extour\_dynamic\_advisor

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
    "total_count": 100, // 总触发次数
    "daily_count": 100, // 日触发次数
    "power_count": 10, // 单次上电周期内触发次数
    "execute_interval":  60 // 传递给后端时转成秒
}
```

**Request Example**

```SQL
curl 'https://api-vehicle-cloud.volcengine.com/aidv/v1/trigger/scene?vehicle_id=web&channel=seres'
  --data-raw '{"channel":"seres","name":"【测试】-【lymiles】-【新建场景测试】","priority":5,"source":"aidv_backend","effective_scope":{"vehicle_type":[],"client":[{"model":">","values":["1.1.2"]}],"vehicle_id":["vin1234567890","vin1234567891"]},"conditions":"[{\"id\":0,\"type\":\"vehicle\",\"code\":\"vehicle_control_0004.velocity\",\"name\":\"车辆速度.速度\",\"operator\":\">\",\"value\":{\"type\":\"string\",\"value\":\"120km/h\"},\"logic\":\"&&\",\"group_index\":0,\"group_logic\":\"&&\"},{\"id\":0,\"type\":\"vehicle\",\"code\":\"vehicle_control_0021.temperature\",\"name\":\"车内外温度状态.温度\",\"operator\":\">=\",\"value\":{\"type\":\"string\",\"value\":\"25\"},\"logic\":\"&&\",\"group_index\":0,\"group_logic\":\"&&\"}]","dynamic_conditions":"[{\"id\":0,\"type\":\"vehicle\",\"code\":\"vehicle_control_0028.position\",\"name\":\"车门状态.位置\",\"operator\":\"=\",\"value\":{\"type\":\"string\",\"value\":\"主驾\"},\"logic\":\"&&\",\"group_index\":0,\"group_logic\":\"&&\",\"operator_name\":\"等于\"},{\"id\":0,\"type\":\"vehicle\",\"code\":\"vehicle_control_0028.switch\",\"name\":\"车门状态.开关\",\"operator\":\"=\",\"value\":{\"type\":\"string\",\"value\":\"on\"},\"logic\":\"&&\",\"group_index\":0,\"group_logic\":\"&&\",\"operator_name\":\"变更为\"}]","actions":"[{\"id\":0,\"code\":\"comfort_advisor\",\"name\":\"舒适 Advisor\",\"params\":[{\"id\":0,\"code\":\"attention\",\"name\":\"事件/注意力信息\",\"value\":{\"type\":\"string\",\"value\":\"新建测试\"}}]},{\"id\":1,\"code\":\"emotion_advisor\",\"name\":\"情感 Advisor\",\"params\":[{\"id\":1,\"code\":\"attention\",\"name\":\"事件/注意力信息\",\"value\":{\"type\":\"string\",\"value\":\"新建测试\"}}]},{\"id\":2,\"code\":\"recommend\",\"name\":\"主动推荐\",\"params\":[{\"id\":2,\"code\":\"advisors_input\",\"name\":\"建议信息\",\"value\":{\"type\":\"string\",\"value\":\"\\\"reason\\\": \\\"新建测试\\\",\\n\\\"advice\\\":\\\"新建测试\\\"\"}}]}]","execute_policy":{"execute_interval":30}}'
```



#### 更新场景

**Request Method**: POST

**Request Path**: `\`/aidv/v1/trigger/scene/update\``

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

规则集

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

# Python代码示例

## 1\.获取渠道端信号配置

```Python
#! 1. 获取渠道端信号配置
import base64
import hashlib
import hmac
import json
import random

import time
from typing import Any

import requests
AK = ""
SK = ""
CHANNEL = "seres"
USE_PPE = True
TT_ENV = "ppe_vehicle_ai_car_dev"

def clean_query_params(query_params: dict[str, Any]) -> dict[str, Any]:
    return {k: v for k, v in query_params.items() if v not in ("", None)}

def build_signature(method: str, query_params: dict[str, Any], body: str) -> str:
    query_str = "&".join(f"{k}={v}" for k, v in query_params.items())
    sorted_query_str = "&".join(sorted(query_str.split("&")))
    str_to_sign = f"{method}\n{sorted_query_str}\n"
    if body:
        str_to_sign += f"{hashlib.md5(body.encode('utf-8')).hexdigest()}\n"
    return base64.b64encode(
        hmac.new(SK.encode("utf-8"), str_to_sign.encode("utf-8"), hashlib.sha256).digest()
    ).decode()

def get_trigger_signals() -> None:
    method = "GET"
    timestamp = int(time.time())
    nonce = random.randint(0, 65535)

    query_params = clean_query_params(
        {
            "_timestamp": timestamp,
            "_nonce": nonce,
            "channel": CHANNEL,
            "vehicle_id": "vin4126906551226169",
            "app_id": "765783",
            "channel_app_id": "99211",
        }
    )

    body = ""
    sign = build_signature(method=method, query_params=query_params, body=body)
    query_str = "&".join(f"{k}={v}" for k, v in query_params.items())

    url = f"https://api-vehicle-cloud.volcengine.com/aidv/v1/trigger/signals?{query_str}"

    headers = {
        "X-Signature": f"{AK}:{sign}",
        "Content-Type": "application/json;charset=utf-8",
    }
    if USE_PPE:
        headers["X-Use-PPE"] = "1"
        headers["X-Tt-Env"] = TT_ENV

    response = requests.get(url, headers=headers, timeout=30)
    print("status_code:", response.status_code)
    print("x-tt-logid:", response.headers.get("x-tt-logid"))
    try:
        print(json.dumps(response.json(), ensure_ascii=False, indent=2))
    except Exception:
        print(response.text)

if __name__ == "__main__":
    get_trigger_signals()

```

## 2\.获取支持的 Actions 列表

```Python
#! 2. 获取支持的 Actions 列表
import base64
import hashlib
import hmac
import json
import random
import time
from typing import Any

import requests

AK = ""
SK = ""
CHANNEL = "seres"
VEHICLE_ID = "trigger"
USE_PPE = True
TT_ENV = "ppe_vehicle_ai_car_dev"

def clean_query_params(query_params: dict[str, Any]) -> dict[str, Any]:
    return {k: v for k, v in query_params.items() if v not in ("", None)}

def build_signature(method: str, query_params: dict[str, Any], body: str) -> str:
    query_str = "&".join(f"{k}={v}" for k, v in query_params.items())
    sorted_query_str = "&".join(sorted(query_str.split("&")))
    str_to_sign = f"{method}\n{sorted_query_str}\n"
    if body:
        str_to_sign += f"{hashlib.md5(body.encode('utf-8')).hexdigest()}\n"
    return base64.b64encode(
        hmac.new(SK.encode("utf-8"), str_to_sign.encode("utf-8"), hashlib.sha256).digest()
    ).decode()

def get_trigger_actions() -> None:
    method = "GET"
    timestamp = int(time.time())
    nonce = random.randint(0, 65535)

    query_params = clean_query_params(
        {
            "_timestamp": timestamp,
            "_nonce": nonce,
            "channel": CHANNEL,
            "vehicle_id": VEHICLE_ID,
            "app_id": "765783",
            "channel_app_id": "99211",
        }
    )

    body = ""
    sign = build_signature(method=method, query_params=query_params, body=body)
    query_str = "&".join(f"{k}={v}" for k, v in query_params.items())
    url = f"https://api-vehicle-cloud.volcengine.com/aidv/v1/trigger/actions?{query_str}"

    headers = {
        "X-Signature": f"{AK}:{sign}",
        "Content-Type": "application/json;charset=utf-8",
    }
    if USE_PPE:
        headers["X-Use-PPE"] = "1"
        headers["X-Tt-Env"] = TT_ENV

    response = requests.get(url, headers=headers, timeout=30)
    print("status_code:", response.status_code)
    print("x-tt-logid:", response.headers.get("x-tt-logid"))
    try:
        print(json.dumps(response.json(), ensure_ascii=False, indent=2))
    except Exception:
        print(response.text)

if __name__ == "__main__":
    get_trigger_actions()

```

## 3\.注册场景

```Python
#!3. 注册场景 
import base64
import hashlib
import hmac
import json
import random
import time
import urllib.parse
from typing import Any

import requests

# 火山网关签名鉴权信息
AK = ""
SK = ""

# 业务侧上下文参数
CHANNEL = "seres"
VEHICLE_ID = "web"
APP_ID = "765783"
CHANNEL_APP_ID = "99211"
VEHICLE_TYPE = "SAI_OS"
ACCOUNT_ID = ""
LOGIN_DOUBAO_UID = ""

# 联调环境配置
USE_PPE = True
TT_ENV = "ppe_vehicle_ai_car_dev"

def build_signature(method: str, query_params: dict[str, Any], body: str, sk: str) -> str:
    # 1) 按 query 拼接原串
    query_str = "&".join(f"{k}={v}" for k, v in query_params.items())
    # 2) 做 URL quote 后按参数字典序排序
    sorted_query_str = "&".join(sorted(urllib.parse.quote(query_str, safe=":/&=").split("&")))
    # 3) 拼装签名原文：METHOD + 排序后的 query + body 的 MD5
    str_to_sign = f"{method}\n{sorted_query_str}\n{hashlib.md5(body.encode('utf-8')).hexdigest()}\n"
    # 4) 使用 SK 做 HMAC-SHA256，再 base64 输出
    return base64.b64encode(
        hmac.new(sk.encode("utf-8"), str_to_sign.encode("utf-8"), hashlib.sha256).digest()
    ).decode()

def create_scene() -> None:
    method = "POST"

    # 生成防重放参数
    timestamp = int(time.time())
    nonce = random.randint(0, 65535)

    # query 参数会参与签名，也会拼接到 URL 上
    query_params = {
        "_timestamp": timestamp,
        "_nonce": nonce,
        "app_id": APP_ID, 
        "channel_app_id": CHANNEL_APP_ID,
        "vehicle_id": VEHICLE_ID,
        # "vehicle_type": VEHICLE_TYPE,
        # "account_id": ACCOUNT_ID,
        # "login_doubao_uid": LOGIN_DOUBAO_UID,
        "channel": CHANNEL,
    }

    # 静态条件：持续满足才触发
    conditions = [
        {
            "id": 0,
            "type": "vehicle",
            "code": "vehicle_control_0004.velocity",
            "name": "车辆速度.速度",
            "operator": ">",
            "value": {"type": "string", "value": "120km/h"},
            "logic": "&&",
            "group_index": 0,
            "group_logic": "&&",
        },
        {
            "id": 0,
            "type": "vehicle",
            "code": "vehicle_control_0021.temperature",
            "name": "车内外温度状态.温度",
            "operator": ">=",
            "value": {"type": "string", "value": "25"},
            "logic": "&&",
            "group_index": 0,
            "group_logic": "&&",
        },
    ]

    # 动态条件：状态变更类条件
    dynamic_conditions = [
        {
            "id": 0,
            "type": "vehicle",
            "code": "vehicle_control_0028.position",
            "name": "车门状态.位置",
            "operator": "=",
            "value": {"type": "string", "value": "主驾"},
            "logic": "&&",
            "group_index": 0,
            "group_logic": "&&",
            "operator_name": "等于",
        },
        {
            "id": 0,
            "type": "vehicle",
            "code": "vehicle_control_0028.switch",
            "name": "车门状态.开关",
            "operator": "=",
            "value": {"type": "string", "value": "on"},
            "logic": "&&",
            "group_index": 0,
            "group_logic": "&&",
            "operator_name": "变更为",
        },
    ]

    # 触发后执行动作
    actions = [
        {
            "id": 0,
            "code": "comfort_advisor",
            "name": "舒适 Advisor",
            "params": [
                {
                    "id": 0,
                    "code": "attention",
                    "name": "事件/注意力信息",
                    "value": {"type": "string", "value": "新建测试"},
                }
            ],
        },
        {
            "id": 1,
            "code": "emotion_advisor",
            "name": "情感 Advisor",
            "params": [
                {
                    "id": 1,
                    "code": "attention",
                    "name": "事件/注意力信息",
                    "value": {"type": "string", "value": "新建测试"},
                }
            ],
        },
        {
            "id": 2,
            "code": "recommend",
            "name": "主动推荐",
            "params": [
                {
                    "id": 2,
                    "code": "advisors_input",
                    "name": "建议信息",
                    "value": {
                        "type": "string",
                        "value": "\"reason\": \"新建测试\",\n\"advice\":\"新建测试\"",
                    },
                }
            ],
        },
    ]

    # 注意：文档要求 conditions/dynamic_conditions/actions 传 JSON String
    body_dict = {
        "channel": CHANNEL,
        "name": "【测试】-【Extour】-【新建场景测试2】",
        "priority": 5,
        "source": "aidv_backend",
        "effective_scope": {
            "vehicle_type": [],
            "client": [{"model": ">", "values": ["1.1.2"]}],
            "vehicle_id": ["vin1234567890", "vin1234567891"],
        },
        "conditions": json.dumps(conditions, ensure_ascii=False, separators=(",", ":")),
        "dynamic_conditions": json.dumps(
            dynamic_conditions, ensure_ascii=False, separators=(",", ":")
        ),
        "actions": json.dumps(actions, ensure_ascii=False, separators=(",", ":")),
        # "execute_policy": {"execute_interval": 30},
    }
    # body_dict = {}

    # 请求体序列化，并基于 query+body 计算签名
    body = json.dumps(body_dict, ensure_ascii=False, separators=(",", ":"))
    # body =""
    sign = build_signature(method=method, query_params=query_params, body=body, sk=SK)

    base_url = "https://api-vehicle-cloud.volcengine.com/aidv/v1/trigger/scene"
    query_str = "&".join(f"{k}={v}" for k, v in query_params.items())
    url = f"{base_url}?{query_str}"

    # 网关鉴权头
    headers = {
        "X-Signature": f"{AK}:{sign}",
        "Content-Type": "application/json;charset=utf-8",
    }

    # PPE 环境联调头
    if USE_PPE:
        headers["X-Use-PPE"] = "1"
        headers["X-Tt-Env"] = TT_ENV

    # 发请求并打印结果
    response = requests.post(url, headers=headers, data=body.encode("utf-8"), timeout=30)
    print("status_code:", response.status_code)
    print("x-tt-logid:", response.headers.get("x-tt-logid"))
    try:
        print(json.dumps(response.json(), ensure_ascii=False, indent=2))
    except Exception:
        print(response.text)

if __name__ == "__main__":
    create_scene()

```

## 4\.更新场景

```Python
#! 4. 更新场景
import base64
import hashlib
import hmac
import json
import random
import time
import urllib.parse
from typing import Any

import requests

AK = ""
SK = ""
CHANNEL = "seres"
VEHICLE_ID = "web"
APP_ID = "765783"
CHANNEL_APP_ID = "99211"
VEHICLE_TYPE = "SAI_OS"
ACCOUNT_ID = ""
LOGIN_DOUBAO_UID = ""
SCENE_ID = 1
USE_PPE = True
TT_ENV = "ppe_vehicle_ai_car_dev"

def clean_query_params(query_params: dict[str, Any]) -> dict[str, Any]:
    return {k: v for k, v in query_params.items() if v not in ("", None)}

def build_signature(method: str, query_params: dict[str, Any], body: str) -> str:
    query_str = "&".join(f"{k}={v}" for k, v in query_params.items())
    sorted_query_str = "&".join(sorted(urllib.parse.quote(query_str, safe=":/&=").split("&")))
    str_to_sign = f"{method}\n{sorted_query_str}\n{hashlib.md5(body.encode('utf-8')).hexdigest()}\n"
    return base64.b64encode(
        hmac.new(SK.encode("utf-8"), str_to_sign.encode("utf-8"), hashlib.sha256).digest()
    ).decode()

def update_scene() -> None:
    method = "POST"
    timestamp = int(time.time())
    nonce = random.randint(0, 65535)

    query_params = clean_query_params(
        {
            "_timestamp": timestamp,
            "_nonce": nonce,
            "app_id": APP_ID,
            "channel_app_id": CHANNEL_APP_ID,
            "vehicle_id": VEHICLE_ID,
            "vehicle_type": VEHICLE_TYPE,
            "account_id": ACCOUNT_ID,
            "login_doubao_uid": LOGIN_DOUBAO_UID,
            "channel": CHANNEL,
            "scene_id": SCENE_ID,
        }
    )

    conditions = [
        {
            "id": 0,
            "type": "vehicle",
            "code": "vehicle_control_0021.temperature",
            "name": "车内外温度状态.温度",
            "operator": ">=",
            "value": {"type": "string", "value": "26"},
            "logic": "&&",
            "group_index": 0,
            "group_logic": "&&",
        }
    ]
    actions = [
        {
            "id": 0,
            "code": "comfort_advisor",
            "name": "舒适 Advisor",
            "params": [
                {
                    "id": 0,
                    "code": "attention",
                    "name": "事件/注意力信息",
                    "value": {"type": "string", "value": "更新场景测试"},
                }
            ],
        }
    ]

    body_dict = {
        "scene_id": SCENE_ID,
        "name": "【测试】-【python】-【更新场景】",
        "conditions": json.dumps(conditions, ensure_ascii=False, separators=(",", ":")),
        "actions": json.dumps(actions, ensure_ascii=False, separators=(",", ":")),
        "priority": 6,
        "execute_policy": {"execute_interval": 45},
    }

    body = json.dumps(body_dict, ensure_ascii=False, separators=(",", ":"))
    sign = build_signature(method=method, query_params=query_params, body=body)
    query_str = "&".join(f"{k}={v}" for k, v in query_params.items())
    url = f"https://api-vehicle-cloud.volcengine.com/aidv/v1/trigger/scene/update?{query_str}"

    headers = {
        "X-Signature": f"{AK}:{sign}",
        "Content-Type": "application/json;charset=utf-8",
    }
    if USE_PPE:
        headers["X-Use-PPE"] = "1"
        headers["X-Tt-Env"] = TT_ENV

    response = requests.post(url, headers=headers, data=body.encode("utf-8"), timeout=30)
    print("status_code:", response.status_code)
    print("x-tt-logid:", response.headers.get("x-tt-logid"))
    try:
        print(json.dumps(response.json(), ensure_ascii=False, indent=2))
    except Exception:
        print(response.text)

if __name__ == "__main__":
    update_scene()

```

## 5\.查询场景

```Python
#! 5. 查询场景
import base64
import hashlib
import hmac
import json
import random
import time
from typing import Any

import requests

AK = ""
SK = ""
CHANNEL = "seres"
VEHICLE_ID = "web"
APP_ID = "765783"
CHANNEL_APP_ID = "99211"
VEHICLE_TYPE = "SAI_OS"
ACCOUNT_ID = ""
LOGIN_DOUBAO_UID = ""
PAGE_SIZE = 10
PAGE_NUMBER = 1
STATUS = 1
SCENE_ID = ""
NAME = ""
USE_PPE = True
TT_ENV = "ppe_vehicle_ai_car_dev"

def build_signature(method: str, query_params: dict[str, Any], body: str) -> str:
    query_str = "&".join(f"{k}={v}" for k, v in query_params.items())
    sorted_query_str = "&".join(sorted(query_str.split("&")))
    str_to_sign = f"{method}\n{sorted_query_str}\n"
    if body:
        str_to_sign += f"{hashlib.md5(body.encode('utf-8')).hexdigest()}\n"
    return base64.b64encode(
        hmac.new(SK.encode("utf-8"), str_to_sign.encode("utf-8"), hashlib.sha256).digest()
    ).decode()

def clean_query_params(query_params: dict[str, Any]) -> dict[str, Any]:
    return {k: v for k, v in query_params.items() if v not in ("", None)}

def list_scene() -> None:
    method = "GET"
    timestamp = int(time.time())
    nonce = random.randint(0, 65535)

    query_params: dict[str, Any] = clean_query_params(
        {
            "_timestamp": timestamp,
            "_nonce": nonce,
            "app_id": APP_ID,
            "channel_app_id": CHANNEL_APP_ID,
            "vehicle_id": VEHICLE_ID,
            "vehicle_type": VEHICLE_TYPE,
            "account_id": ACCOUNT_ID,
            "login_doubao_uid": LOGIN_DOUBAO_UID,
            "channel": CHANNEL,
            "page_size": PAGE_SIZE,
            "page_number": PAGE_NUMBER,
            "status": STATUS,
        }
    )
    if SCENE_ID:
        query_params["scene_id"] = SCENE_ID
    if NAME:
        query_params["name"] = NAME

    body = ""
    sign = build_signature(method=method, query_params=query_params, body=body)
    query_str = "&".join(f"{k}={v}" for k, v in query_params.items())
    url = f"https://api-vehicle-cloud.volcengine.com/aidv/v1/trigger/scene?{query_str}"

    headers = {
        "X-Signature": f"{AK}:{sign}",
        "Content-Type": "application/json;charset=utf-8",
    }
    if USE_PPE:
        headers["X-Use-PPE"] = "1"
        headers["X-Tt-Env"] = TT_ENV

    response = requests.get(url, headers=headers, timeout=30)
    print("status_code:", response.status_code)
    print("x-tt-logid:", response.headers.get("x-tt-logid"))
    try:
        print(json.dumps(response.json(), ensure_ascii=False, indent=2))
    except Exception:
        print(response.text)

if __name__ == "__main__":
    list_scene()

```

## 6\.更新场景状态

```Python
#! 6.更新场景状态 (删除/生效/失效)
import base64
import hashlib
import hmac
import json
import random
import time
from typing import Any

import requests

AK = ""
SK = ""
CHANNEL = "seres"
VEHICLE_ID = "web"
APP_ID = "765783"
CHANNEL_APP_ID = "99211"
VEHICLE_TYPE = "SAI_OS"
ACCOUNT_ID = ""
LOGIN_DOUBAO_UID = ""
SCENE_ID = 1
STATUS = 1
USE_PPE = True
TT_ENV = "ppe_vehicle_ai_car_dev"

def clean_query_params(query_params: dict[str, Any]) -> dict[str, Any]:
    return {k: v for k, v in query_params.items() if v not in ("", None)}

def build_signature(method: str, query_params: dict[str, Any], body: str) -> str:
    query_str = "&".join(f"{k}={v}" for k, v in query_params.items())
    sorted_query_str = "&".join(sorted(query_str.split("&")))
    str_to_sign = f"{method}\n{sorted_query_str}\n"
    if body:
        str_to_sign += f"{hashlib.md5(body.encode('utf-8')).hexdigest()}\n"
    return base64.b64encode(
        hmac.new(SK.encode("utf-8"), str_to_sign.encode("utf-8"), hashlib.sha256).digest()
    ).decode()

def update_scene_status() -> None:
    method = "POST"
    timestamp = int(time.time())
    print("timestamp ==> ",timestamp)
    nonce = random.randint(0, 65535)

    query_params = clean_query_params(
        {
            "_timestamp": timestamp,
            "_nonce": nonce,
            "app_id": APP_ID,
            "channel_app_id": CHANNEL_APP_ID,
            "vehicle_id": VEHICLE_ID,
            "vehicle_type": VEHICLE_TYPE,
            "account_id": ACCOUNT_ID,
            "login_doubao_uid": LOGIN_DOUBAO_UID,
            "channel": CHANNEL,
            "scene_id": SCENE_ID,
            "status": STATUS,
        }
    )
    body_dict = {
        "scene_id": SCENE_ID,
        "status": STATUS,
    }
    body = json.dumps(body_dict, ensure_ascii=False, separators=(",", ":"))
    sign = build_signature(method=method, query_params=query_params, body=body)
    
    query_str = "&".join(f"{k}={v}" for k, v in query_params.items())
    url = (
        f"https://api-vehicle-cloud.volcengine.com/aidv/v1/trigger/scene/update_status?{query_str}"
    )

    headers = {
        "X-Signature": f"{AK}:{sign}",
        "Content-Type": "application/json;charset=utf-8",
    }
    if USE_PPE:
        headers["X-Use-PPE"] = "1"
        headers["X-Tt-Env"] = TT_ENV

    response = requests.post(url, headers=headers, data=body.encode("utf-8"), timeout=30)
    print("status_code:", response.status_code)
    print("x-tt-logid:", response.headers.get("x-tt-logid"))
    try:
        print(json.dumps(response.json(), ensure_ascii=False, indent=2))
    except Exception:
        print(response.text)

if __name__ == "__main__":
    update_scene_status()

```




