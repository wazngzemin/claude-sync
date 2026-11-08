# AiCar\-汽车记忆测试方案

# 背景与目的

AI汽车记忆能力用于沉淀用户在车内的人车/人人交互信息，并在后续交互中被正确召回与使用。

本测试方案的目标：

- 明确记忆能力的覆盖范围与关键质量指标，并给出可落地的测试方法。

- 验证记忆在生成、打标、召回三个关键环节的正确性与稳定性。

- 验证记忆生成、召回、删除、开关控制等主链路能力在车机场景下闭环可用。

- 通过接口与实车流程验证端到端链路可用。

- 验证记忆隔离与隐私策略按单车、单账号、在场人和共享乘客规则生效，避免误召与越权露出。

# 记忆类型

<table><tbody>
<tr>
<td>

记忆类型

</td>
<td>

描述

</td>
<td>

生成方式

</td>
</tr>
<tr>
<td>

短期情景记忆

（短期记忆）

</td>
<td>

将有相关性的事件进行合并、总结。目前包含：导航相关事件、车控相关事件、多媒体相关事件、闲聊场景（按主题合并）四大类。

</td>
<td>

每20轮事件 \|\| 每20分钟

</td>
</tr>
<tr>
<td>

长期情景记忆

</td>
<td>

将当天生成的短期记忆压缩、总结。

</td>
<td>

夜间固定时间更新（n\+1）

</td>
</tr>
<tr>
<td>

长期语义记忆

</td>
<td>

记录用户偏好、习惯、个人基础信息

</td>
<td>

夜间固定时间更新（n\+1）

</td>
</tr>
<tr>
<td>

长期语义记忆（即时）

</td>
<td>

用户表达希望豆包立即记住某个内容时生成

</td>
<td>

由director调用记忆更新工具即时生成

</td>
</tr>
<tr>
<td>

画像

</td>
<td>

为用户生成一段概括性的包含用户核心且实时信息的自然语言内容。格式相对固定。来源于长期语义记忆。

</td>
<td>

夜间固定时间更新（n\+1）

</td>
</tr>
</tbody></table>

# 测试范围与策略

## 覆盖范围

- 语义/情景 记忆生成、标签体系、召回策略、用户画像生成

- 记忆开关、隔离隐私策略

## 测试类型与策略

<table><tbody>
<tr>
<td>

类型

</td>
<td>

策略

</td>
</tr>
<tr>
<td>

功能验证

</td>
<td>

围绕记忆开关、生成、召回、删除、页面入口、筛选和联动更新建立端到端主流程用例。

</td>
</tr>
<tr>
<td>

异常 / 边界

</td>
<td>

覆盖开关关闭提示、删除后记忆一致性、跨车、跨账号等边界条件。

</td>
</tr>
<tr>
<td>

音区 

</td>
<td>

优先覆盖主驾、多音区、多人同车场景

</td>
</tr>
<tr>
<td>

性能

</td>
<td>

记忆异步生成，重点关注记忆召回时延。

</td>
</tr>
<tr>
<td>

安全 / 数据合规

</td>
<td>

验证单车单账号隔离、在场人过滤、共享乘客同步边界、关闭记忆后的隐私保护提示和越权露出风险。

</td>
</tr>
</tbody></table>

# 测试内容

## 思维导图功能点

## 测试集

长期语义记忆生成\&amp;召回：[【Ai汽车】【长期记忆】测试集\&amp;测试报告](https://bytedance.larkoffice.com/wiki/UsdVwOP9biFKsJkjcwScrcKFn0f?sheet=8jRZEV)

长短期情景记忆生成：[【Ai汽车】【短期\&amp;情景记忆】测试集\&amp;测试报告](https://bytedance.larkoffice.com/wiki/GDBkwz2C5iSr5RkweBmc64D5nxa)

语义记忆打标\&amp;召回：[【AI汽车】【语义记忆打标/召回】测试集\&amp;测试报告](https://bytedance.larkoffice.com/wiki/KpOuwmj6ziUBMqkTFFWchOvQnKh)

情景记忆打标\&amp;召回得分：[【AI汽车】【情景记忆打标/召回得分】测试集\&amp;测试报告](https://bytedance.larkoffice.com/wiki/Cqx7wdsEYiUWp9kxUMHc9Bgsnvg?sheet=L9yl33)

行为归纳：[【记忆提取总结\_情景画像】\-测试集](https://bytedance.larkoffice.com/sheets/E30esjoU0hWHIEtQG2pcVmkKnYe?sheet=979q3F)

用户画像（语义记忆提取）：[【AI汽车】【画像标签】测试集测试报告](https://bytedance.larkoffice.com/sheets/W8CgsEFLPhnnrqtFDmrcoYR3nVh?sheet=1bf3f1)

记忆功能测试集合：[【记忆功能】测试集\&amp;测试报告](https://bytedance.larkoffice.com/wiki/FtzDwbXpVi0BPlkmwP1cNYK6nGe)

## 基础记忆模块用例组成

- 用例类型：验证case\+干扰case；

- 记忆维度：显式\+隐式\+归纳总结；

- 记忆操作：新增、修改、删除；

- 音区/姓名：模拟多用户/多位置；

- 日期：模拟不同日期的事件；

- 用户指令、豆包回复、预期结果。



示例case：

## 基础记忆模块测试专项

### 生产阶段

#### 记忆生成（P1）

> 验证记忆内容的生成质量
> 
> 

- 核心指标：召回率

- 计算方式：实际召回的记忆点数量/预期召回的记忆数量

- 生成的记忆示例：

#### 记忆打标签（P1）

> 验证记忆内容对应的标签是否合理、可用于后续检索/召回
> 
> 

- 核心指标：分级达标率（3/4 分为合格，1/2 分为不合格）

- 判定标准：

- 生成的标签示例：

#### 语义画像生成（P1）

> 验证提取的画像内容质量
> 
> 

- 核心指标：召回率

- 计算方式：实际召回的画像记忆点数量/预期召回的记忆数量

- 生成的画像示例

#### 行为归纳（P1）

> 验证提取的画像内容质量
> 
> 

- 核心指标：准确率

- 判定标准：实际生成的记忆点是否与预期记忆点匹配

- 生成的画像示例：

### 召回阶段

#### 记忆召回（P0）

> 验证用户指令召回的记忆标签和记忆内容的质量
> 
> 

- 核心指标：准确率

- 判定标准：记忆正确召回、记忆数量未超过限制 视为pass，任何一点不满足即为fail


召回内容示例：

# 验收标准

## bug遗留

- P0遗留=0，禁止带有开关失效、记忆失效、隐私策略失效等阻塞问题准出。

- P1遗留=0，记忆生成、召回阶段出现高概率问题、记忆使用偏差或明显界面展示问题需在准出前关闭。

- P2解决率\&gt;85%，经产研讨论达成一致的暂不修复、未来修复或降级的问题，需补充说明后可不阻塞准出。

## 用例通过率

- 批量验证

    - 记忆生成目标 90%

    - 记忆打标目标待定   当前语义记忆92\.5%  情景记忆 84\.5%

    - 语义画像生成目标待定  当前95\.5%

    - 行为归纳目标待定   当前94\.4%

    - 记忆召回目标待定   当前语义记忆 90\.4% 情景记忆 95\.9%

- 功能验证

    - P0通过率目标 100%

    - P1通过率目标 ≥95%

    - P2通过率目标≥90%

## 性能指标

短期记忆生成目标待定  当前P50：10s，P90：16s

context查询记忆目标： P90≤500ms  ~~当前语义记忆：P50：217ms，P90：290ms；情景记忆：P50：225ms，P90：306ms~~

# 风险与依赖

- 环境依赖：需准备多个账号、多音区、多人同车、人脸识别链路打通等测试资源

- 配置依赖：记忆开关、人脸授权状态。

- 其他依赖：需要可批量导入测试数据的接口，用于模拟车辆事件上报

# 实车验证注意事项

## 实车测试流程

通过实车流程串联验证：注册用户\-\&gt;记忆开关\-\&gt;触发生成\-\&gt;召回使用，必要时用数据库核对异步结果。

1. 确保Face ID已注册成功

2. 打开记忆开关

3. 指令触发生成记忆

4. 查询数据库，看记忆生成情况（非必须）

5. 验证记忆是否被正确召回并使用

## 查询记忆是否生成（查库步骤）

<div class="callout">

所有记忆均是异步生成的，记忆工具不会显示记忆生成内容。需要从数据库查询记忆生成情况。

</div>

数据库地址

> BOE：[cloud\-boe\.bytedance\.net](https://cloud-boe.bytedance.net/rds/volc/detail/boe/vehicle_aidv/SQLConsole?x-resource-account=boe&x-bc-region-id=bytedance&x-bc-vregion=China-BOE&x-bc-vdc=boe)
> 
> PPE：[cloud\.bytedance\.net](https://cloud.bytedance.net/rds/detail/db/cn/vehicle_aidv/autoSQL?db_name=vehicle_aidv&region=cn&x-resource-account=public&x-bc-region-id=bytedance&x-bc-vregion=China-North&x-bc-vdc=cn)
> 
> 

1. 查询vehicle\_user表，通过vehicle\_id和faceid查询用户对应的火山id

```SQL
SELECT * FROM `vehicle_user` where vehicle_id = "lhjboetest030501" AND face_id = "face_lhj0305_01";
```

2. 查询memory\_entity表，通过火山id查询用户的unique\_entity\_id

> channel=aidv代表ai汽车业务，entity\_id填第一步查询的火山id
> 
> 单个用户的记忆与unique\_entity\_id是绑定的
> 
> 

```SQL
SELECT * FROM memory_entity where channel = "aidv" and entity_id = 1143;
```

3. 查询memory\_task\_record表，通过unique\_entity\_id查询记忆

> 此处的entity\_id填第二步查询的unique\_entity\_id
> 
> business\_type中 long\_memory=长期语义记忆；short\_memory=短期记忆；long\_memory\_scene=长期情景记忆。
> 
> 

```SQL
SELECT * FROM memory_task_record where entity_id = "aidv_99210_79e03052-863a-d626-bb85-b987c415e63f" and business_type = "long_memory" ORDER BY id DESC;
```

4. 查看status，success代表该记忆已成功生成，pend代表还未生成。

    

# 接口测试流程

注册用户\-\&gt;端状态上报\-\&gt;事件导入\-\&gt;生成记忆\-\&gt;记忆召回

## HTTP接口

### 用户注册

参考[AI汽车账号/Face ID测试](https://bytedance.larkoffice.com/wiki/Fkekwc91ViasUNkCnHHc98EKnlb)第4\.1、4\.2、4\.3章节完成账号注册\+豆包登录\+人脸注册

### 车端信息上报

<table><tbody>
<tr>
<td>

参数名

</td>
<td>

参数位置

</td>
<td>

参数格式

</td>
<td>

是否必须

</td>
<td>

说明

</td>
</tr>
<tr>
<td>

vehicle\_id

</td>
<td>

公参/query



</td>
<td>

String

</td>
<td>

是

</td>
<td>

设备唯一ID，字符串类型，必务保证ID的维一性，ID重复会被限流

</td>
</tr>
<tr>
<td>

report\_cycle\_flag



</td>
<td>

Body Json



</td>
<td>

String



</td>
<td>

是

</td>
<td>

上报周期标识，描述一次车辆上下电记录。

建议格式：时间\_uuid（202510011000\_xxxxxxx）

</td>
</tr>
<tr>
<td>

report\_type

</td>
<td>

Body Json

</td>
<td>

String



</td>
<td>

是

</td>
<td>

上报类型

- Full \-\&gt; 全量上报

- Update \-\&gt; 增量更新（更新粒度为信号维度）

</td>
</tr>
<tr>
<td>

resource\_value



</td>
<td>

Body Json

</td>
<td>

List\&lt;resource\_value\&gt;

参见resource\_value结构体



</td>
<td>

是



</td>
<td>

车端信号数据



</td>
</tr>
</tbody></table>

resource\_value结构

<table><tbody>
<tr>
<td>

参数名

</td>
<td>

参数位置

</td>
<td>

参数格式

</td>
<td>

是否必须

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

Body Json

</td>
<td>

String

</td>
<td>

是

</td>
<td>

信号ID



</td>
</tr>
<tr>
<td>

event\_time

</td>
<td>

Body Json

</td>
<td>

String

</td>
<td>

是

</td>
<td>

信号发生变更事件

</td>
</tr>
<tr>
<td>

trigger\_task\_id

</td>
<td>

Body Json

</td>
<td>

int

</td>
<td>

否

</td>
<td>

触发事件执行的planner任务id

</td>
</tr>
<tr>
<td>

task\_id

</td>
<td>

Body Json

</td>
<td>

int

</td>
<td>

否

</td>
<td>

事件所属的planner任务id

</td>
</tr>
<tr>
<td>

subresource



</td>
<td>

Body Json

</td>
<td>

List\&lt;subresource\&gt;

参见subresource结构体



</td>
<td>

是



</td>
<td>





</td>
</tr>
</tbody></table>

```Shell
curl --location --request POST 'https://api-vehicle.volcengine.com/aidv/v1/vehicle/resource?app_id=1000&vehicle_type=seres&debug-mode=2031&login_doubao_uid=2026030501&account_id=OEM_lhj_0305_01&_nonce=12345&_timestamp=1772695731&vehicle_id=lhjboetest030501&channel_app_id=99210&channel=aidv' \
--header 'x-use-ppe: 1' \
--header 'x-tt-env: ppe_vehicle_zc_test' \
--header 'X-Signature: master2qmyfgchz97olsjnp14uax0kei:vvv1OOJ4lDwzs4GfQ7+16zSj3G0uqwK0qwMllD+e3gI=' \
--data-raw '{
  "report_cycle_flag": "202510011000_1126",
  "report_type": "Full",
  "resource_value": [
    {
      "id": "system_control_0003",
      "event_time": "2026-01-01T15:00:00.000+08:00",
      "trigger_task_id": 1231312,
      "task_id": 1232343,
      "subresource": [
        {
          "position": "主驾",
          "face_id": "face_lhj0305_01"
        },
        {
          "position": "副驾"
        },
        {
          "position": "左后"
        },
        {
          "position": "右后"
        }
      ]
    }
  ]
}'
```

### 事件导入（测试接口，可批量导入事件）

```Shell
curl --location --request POST 'https://api-vehicle.volcengine.com/aidv/v1/event/report?login_doubao_uid=2026030501&account_id=OEM_lhj_0305_01&app_id=1000&vehicle_type=seres&debug-mode=2031&_nonce=12345&_timestamp=1772695952&vehicle_id=lhjboetest030501&channel_app_id=99210&channel=aidv' \
--header 'x-use-ppe: 1' \
--header 'x-tt-env: ppe_vehicle_zc_test' \
--header 'X-Signature: master2qmyfgchz97olsjnp14uax0kei:DmRMHjHGU9KOsQQKNdFJK+QVyR2Tl1lt8OefBxxR2EM=' \
--data-raw '{
  "logs": [
    {
      "resource_id": "chitchat_001",
      "resource_name": "人车闲聊",
      "resource_info": "{\"chat_type\":1,\"sound_zone\":\"主驾\",\"user_name\":\"李华\",\"query\":\"我喜欢在车内放一个小抱枕，靠在腰上很舒服\",\"answer\":\"好的，这就帮你打开\"}",
      "info": "李华：“我喜欢在车内放一个小抱枕，靠在腰上很舒服”",
      "time": "2026-01-01T19:10:40.000+08:00"
    },
    {
      "resource_id": "chitchat_001",
      "resource_name": "人车闲聊",
      "resource_info": "{\"user_name\":\"李华\",\"query\":\"开车时空调固定25度，开自动挡风模式\"}",
      "info": "李华：“开车时空调固定25度，开自动挡风模式”",
      "time": "2026-01-01T19:10:59.000+08:00"
    }
  ]
}'
```

### 生成长期语义记忆

> 测试接口，可指定日期（run\_date）去生成当天的记忆
> 
> 

```Shell
curl --location --request POST 'https://api-vehicle.volcengine.com/aidv/cron/long-term-memory/generate?cronjob_authentication_key=ko5agHXLTNOQFZMAmB86PbrcRdu4ijYnfVyxhWC1Dq3KzUStp&run_date=20260101&debug-mode=2031&app_id=1000&_nonce=12345&_timestamp=1772695990&vehicle_id=lhjboetest030501&channel_app_id=99210&channel=aidv' \
--header 'x-use-ppe: 1' \
--header 'x-tt-env: ppe_vehicle_zc_test' \
--header 'X-Signature: master2qmyfgchz97olsjnp14uax0kei:+VSPnfxEtx787ny6GBWUZzpwnoCsXx7zHHwV0z1+ix8=' \
```

### 生成长期情景记忆

> 测试接口，可指定日期（run\_date）去生成当天的记忆
> 
> 

```Shell
curl --location --request POST 'https://api-vehicle.volcengine.com/aidv/cron/long-term-scenario-memory/generate?cronjob_authentication_key=ko5agHXLTNOQFZMAmB86PbrcRdu4ijYnfVyxhWC1Dq3KzUStp&run_date=20260101&app_id=1000&debug-mode=2031&_nonce=12345&_timestamp=1772696038&vehicle_id=lhjboetest030501&channel_app_id=99210&channel=aidv' \
--header 'x-use-ppe: 1' \
--header 'x-tt-env: ppe_vehicle_zc_test' \
--header 'X-Signature: master2qmyfgchz97olsjnp14uax0kei:Yp7h2a9F91+MIrzZ7VqwlXYff+3Z33JCOvlepys/Zl8=' \
```

### 记忆列表

> 根据记忆类型获取对应的记忆信息（获取记忆列表和删除目前的方案需要车端信息上报）
> 
> [记忆管理平台操作手册](https://bytedance.larkoffice.com/wiki/PSYnwXKRLiqXvrkpicocpodtn5d)
> 
> 

```SQL
curl --location --request POST 'http://api-vehicle.volcengine.com/aidv/v1/memory/list?channel=seres&app_id=99210&channel_app_id=99210&vehicle_type=E68&login_doubao_uid=20260722111&account_id=OEMlf20260722001' \
--header 'x-use-ppe: 1' \
--header 'x-tt-env: ppe_context_memory_del' \
--header 'X-Signature: test1msuhrn7w2ptbag4lkqjv8oc3f59:dJmIaIZ/eYthYIdkRmiRQ8WrsvB1JeEU0oZ/4IHSXGg=' \
--header 'Content-Type: application/json' \
--data-raw '{
  "memory_type": "long_memory",
  "memory_page_request": {
    "page_size": 20,
    "page_num": 1
  }
}'
```

### 记忆删除

> 可指定记忆ID，face\_ID，记忆类型，标签类型和时间范围的删除；支持一键清空所有的记忆
> 
> 

```SQL
curl --location --request POST 'https://api-vehicle.volcengine.com/aidv/v1/memory/delete?app_id=99210&channel_app_id=99210&vehicle_type=seres&login_doubao_uid=20260722111&account_id=OEMlf20260722001' \
--header 'x-use-ppe: 1' \
--header 'x-tt-env: ppe_context_memory_del' \
--header 'Debug-Mode: 2034' \
--header 'X-Signature: test1msuhrn7w2ptbag4lkqjv8oc3f59:dJmIaIZ/eYthYIdkRmiRQ8WrsvB1JeEU0oZ/4IHSXGg=' \
--header 'Content-Type: application/json' \
--data-raw '{
   "memory_ids":["70ce1911-ea9c-4e73-3747-b902bd13c068"],
   "memory_types":["long_memory"],
   "memory_entity_ids_filter":{
      "memory_entity_ids":["10429_20260722111"],
      "memory_tag_codes":[]
   }
}'
```

## RPC接口

### 生成用户画像

> GenEntityTag
> 
> 

https://bits\.bytedance\.net/interface\_test?domainId=online\&amp;shareId=liCtu0Jm

### 查询用户画像

> GetEntityTagTree
> 
> 

https://bits\.bytedance\.net/interface\_test?domainId=online\&amp;shareId=liCuu0tt

### 查询生成的记忆

> QueryRecord
> 
> 

https://bits\.bytedance\.net/interface\_test?domainId=online\&amp;shareId=liCuu0pk

# 待办项

* [ ] 批量测试指标确认@郝晓伟@梁浩杰

* [ ] 短期记忆生成性能指标确认@郝晓伟@梁浩杰




