# 背景与目的

AI汽车记忆能力用于沉淀用户在车内的人车/人人交互信息，并在后续交互中被正确召回与使用。

本测试方案的目标：

- 明确记忆能力的覆盖范围与关键质量指标，并给出可落地的测试方法。
- 验证记忆在生成、打标、召回三个关键环节的正确性与稳定性。
- 验证记忆生成、召回、删除、开关控制等主链路能力在车机场景下闭环可用。
- 通过接口与实车流程验证端到端链路可用。
- 验证记忆隔离与隐私策略按单车、单账号、在场人和共享乘客规则生效，避免误召与越权露出。

# 记忆类型

<lark-table rows="6" cols="3" header-row="true" column-widths="110,430,225">

  <lark-tr>
    <lark-td>
      记忆类型
    </lark-td>
    <lark-td>
      描述
    </lark-td>
    <lark-td>
      生成方式
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      短期情景记忆
      （短期记忆）
    </lark-td>
    <lark-td>
      将有相关性的事件进行合并、总结。目前包含：导航相关事件、车控相关事件、多媒体相关事件、闲聊场景（按主题合并）四大类。
    </lark-td>
    <lark-td>
      每20轮事件 || 每20分钟
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      长期情景记忆
    </lark-td>
    <lark-td>
      将当天生成的短期记忆压缩、总结。
    </lark-td>
    <lark-td>
      夜间固定时间更新（n+1）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      长期语义记忆
    </lark-td>
    <lark-td>
      记录用户偏好、习惯、个人基础信息
    </lark-td>
    <lark-td>
      夜间固定时间更新（n+1）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      长期语义记忆（即时）
    </lark-td>
    <lark-td>
      用户表达希望豆包立即记住某个内容时生成
    </lark-td>
    <lark-td>
      由director调用记忆更新工具即时生成
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      画像
    </lark-td>
    <lark-td>
      为用户生成一段概括性的包含用户核心且实时信息的自然语言内容。格式相对固定。来源于长期语义记忆。
    </lark-td>
    <lark-td>
      夜间固定时间更新（n+1）
    </lark-td>
  </lark-tr>
</lark-table>

# 测试范围与策略

## 覆盖范围

- 语义/情景 记忆生成、标签体系、召回策略、用户画像生成
- 记忆开关、隔离隐私策略

## 测试类型与策略

<lark-table rows="6" cols="2" header-row="true" column-widths="150,510">

  <lark-tr>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      策略
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      功能验证
    </lark-td>
    <lark-td>
      围绕记忆开关、生成、召回、删除、页面入口、筛选和联动更新建立端到端主流程用例。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      异常 / 边界
    </lark-td>
    <lark-td>
      覆盖开关关闭提示、删除后记忆一致性、跨车、跨账号等边界条件。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      音区
    </lark-td>
    <lark-td>
      优先覆盖主驾、多音区、多人同车场景
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      性能
    </lark-td>
    <lark-td>
      记忆异步生成，重点关注记忆召回时延。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      安全 / 数据合规
    </lark-td>
    <lark-td>
      验证单车单账号隔离、在场人过滤、共享乘客同步边界、关闭记忆后的隐私保护提示和越权露出风险。
    </lark-td>
  </lark-tr>
</lark-table>

# 测试内容

## 思维导图功能点

<whiteboard token="Alwdwzj3YhmSDJbUebkckdF2nxe"/>

## 测试集

长期语义记忆生成&召回：<mention-doc token="UsdVwOP9biFKsJkjcwScrcKFn0f" type="wiki">【Ai汽车】【长期记忆】测试集&测试报告</mention-doc>

长短期情景记忆生成：<mention-doc token="GDBkwz2C5iSr5RkweBmc64D5nxa" type="wiki">【Ai汽车】【短期&情景记忆】测试集&测试报告</mention-doc>

语义记忆打标&召回：<mention-doc token="KpOuwmj6ziUBMqkTFFWchOvQnKh" type="wiki">【AI汽车】【语义记忆打标/召回】测试集&测试报告</mention-doc>

情景记忆打标&召回得分：<mention-doc token="Cqx7wdsEYiUWp9kxUMHc9Bgsnvg" type="wiki">【AI汽车】【情景记忆打标/召回得分】测试集&测试报告</mention-doc>

行为归纳：<mention-doc token="E30esjoU0hWHIEtQG2pcVmkKnYe" type="sheet">【记忆提取总结_情景画像】-测试集</mention-doc>

用户画像（语义记忆提取）：<mention-doc token="W8CgsEFLPhnnrqtFDmrcoYR3nVh" type="sheet">【AI汽车】【画像标签】测试集测试报告</mention-doc>

记忆功能测试集合：<mention-doc token="FtzDwbXpVi0BPlkmwP1cNYK6nGe" type="wiki">【记忆功能】测试集&测试报告</mention-doc>

QA对压缩：

## 基础记忆模块用例组成

- 用例类型：验证case+干扰case；
- 记忆维度：显式+隐式+归纳总结；
- 记忆操作：新增、修改、删除；
- 音区/姓名：模拟多用户/多位置；
- 日期：模拟不同日期的事件；
- 用户指令、豆包回复、预期结果。

示例case：

<sheet token="Sc2Esl6CRhnO2OtiAuucgtwUnVh_akkS9s"/>

<sheet token="Sc2Esl6CRhnO2OtiAuucgtwUnVh_S3qIv8"/>

## 基础记忆模块测试专项

### 生产阶段

#### 记忆生成（P1）

<quote-container>

验证记忆内容的生成质量
</quote-container>

- 核心指标：召回率
- 计算方式：实际召回的记忆点数量/预期召回的记忆数量
- 生成的记忆示例：

<sheet token="Sc2Esl6CRhnO2OtiAuucgtwUnVh_V9kBM4"/>

#### 记忆打标签（P1）

<quote-container>

验证记忆内容对应的标签是否合理、可用于后续检索/召回
</quote-container>

- 核心指标：分级达标率（3/4 分为合格，1/2 分为不合格）
- 判定标准：

<sheet token="Sc2Esl6CRhnO2OtiAuucgtwUnVh_Wg1EV9"/>

- 生成的标签示例：

<sheet token="Sc2Esl6CRhnO2OtiAuucgtwUnVh_V4EmRl"/>

#### 语义画像生成（P1）

<quote-container>

验证提取的画像内容质量
</quote-container>

- 核心指标：召回率
- 计算方式：实际召回的画像记忆点数量/预期召回的记忆数量
- 生成的画像示例

<sheet token="Sc2Esl6CRhnO2OtiAuucgtwUnVh_BFAH2h"/>

#### 行为归纳（P1）

<quote-container>

验证提取的画像内容质量
</quote-container>

- 核心指标：准确率
- 判定标准：实际生成的记忆点是否与预期记忆点匹配
- 生成的画像示例：

<sheet token="Sc2Esl6CRhnO2OtiAuucgtwUnVh_Tsm715"/>

### 召回阶段

#### 记忆召回（P0）

<quote-container>

验证用户指令召回的记忆标签和记忆内容的质量
</quote-container>

- 核心指标：准确率
- 判定标准：记忆正确召回、记忆数量未超过限制 视为pass，任何一点不满足即为fail

召回内容示例：

<sheet token="Sc2Esl6CRhnO2OtiAuucgtwUnVh_vCYjTA"/>

# 验收标准

## bug遗留

- P0遗留=0，禁止带有开关失效、记忆失效、隐私策略失效等阻塞问题准出。
- P1遗留=0，记忆生成、召回阶段出现高概率问题、记忆使用偏差或明显界面展示问题需在准出前关闭。
- P2解决率>85%，经产研讨论达成一致的暂不修复、未来修复或降级的问题，需补充说明后可不阻塞准出。

## 用例通过率

- 批量验证
	- 记忆生成目标 90%
	- 记忆打标目标待定   <text bgcolor="light-yellow">当前语义记忆92.5%  情景记忆 84.5%</text>
	- 语义画像生成目标待定  <text bgcolor="light-yellow">当前95.5%</text>
	- 行为归纳目标待定   <text bgcolor="light-yellow">当前94.4%</text>
	- 记忆召回目标待定   <text bgcolor="light-yellow">当前语义记忆 90.4% 情景记忆 95.9%</text>
- 功能验证
	- P0通过率目标 100%
	- P1通过率目标 ≥95%
	- P2通过率目标≥90%

## 性能指标

短期记忆生成目标待定  <text bgcolor="light-yellow">当前P50：10s，P90：16s</text>

context查询记忆目标： P90≤500ms  <text bgcolor="gray">~~当前语义记忆：P50：217ms，P90：290ms；情景记忆：P50：225ms，P90：306ms~~</text>

# 风险与依赖

- 环境依赖：需准备多个账号、多音区、多人同车、人脸识别链路打通等测试资源
- 配置依赖：记忆开关、人脸授权状态。
- 其他依赖：需要可批量导入测试数据的接口，用于模拟车辆事件上报

# 实车验证注意事项 {folded="true"}

## 实车测试流程

通过实车流程串联验证：注册用户->记忆开关->触发生成->召回使用，必要时用数据库核对异步结果。

1. 确保Face ID已注册成功
1. 打开记忆开关
1. 指令触发生成记忆
1. 查询数据库，看记忆生成情况（非必须）
1. 验证记忆是否被正确召回并使用

## 查询记忆是否生成（查库步骤）

<callout emoji="pushpin" background-color="light-orange" border-color="light-orange">

所有记忆均是异步生成的，记忆工具不会显示记忆生成内容。需要从数据库查询记忆生成情况。
</callout>

数据库地址

<quote-container>

BOE：[cloud-boe.bytedance.net](https%3A%2F%2Fcloud-boe.bytedance.net%2Frds%2Fvolc%2Fdetail%2Fboe%2Fvehicle_aidv%2FSQLConsole%3Fx-resource-account%3Dboe%26x-bc-region-id%3Dbytedance%26x-bc-vregion%3DChina-BOE%26x-bc-vdc%3Dboe)

PPE：[cloud.bytedance.net](https%3A%2F%2Fcloud.bytedance.net%2Frds%2Fdetail%2Fdb%2Fcn%2Fvehicle_aidv%2FautoSQL%3Fdb_name%3Dvehicle_aidv%26region%3Dcn%26x-resource-account%3Dpublic%26x-bc-region-id%3Dbytedance%26x-bc-vregion%3DChina-North%26x-bc-vdc%3Dcn)
</quote-container>

1. 查询vehicle_user表，通过vehicle_id和faceid查询用户对应的火山id
```sql {wrap}
SELECT * FROM `vehicle_user` where vehicle_id = "lhjboetest030501" AND face_id = "face_lhj0305_01";
```

<image token="JolvbPMHaoMvkNxYIhncykiNnnc" width="1657" height="93" align="center"/>

1. 查询memory_entity表，通过火山id查询用户的unique_entity_id

<quote-container>

channel=aidv代表ai汽车业务，entity_id填第一步查询的火山id

单个用户的记忆与unique_entity_id是绑定的
</quote-container>

```sql {wrap}
SELECT * FROM memory_entity where channel = "aidv" and entity_id = 1143;
```

<image token="F2dZbmwTYoCkooxZrHYcLemWnnb" width="1299" height="89" align="center"/>

1. 查询memory_task_record表，通过unique_entity_id查询记忆

<quote-container>

此处的entity_id填第二步查询的unique_entity_id

business_type中 long_memory=长期语义记忆；short_memory=短期记忆；long_memory_scene=长期情景记忆。
</quote-container>

```sql {wrap}
SELECT * FROM memory_task_record where entity_id = "aidv_99210_79e03052-863a-d626-bb85-b987c415e63f" and business_type = "long_memory" ORDER BY id DESC;
```

1. 查看status，success代表该记忆已成功生成，pend代表还未生成。
  <image token="ZtSEbweNGoXgGpxpp09cks6mn79" width="1829" height="88" align="center"/>

  
# 接口测试流程

注册用户->端状态上报->事件导入->生成记忆->记忆召回

## HTTP接口

### 用户注册

参考<mention-doc token="Fkekwc91ViasUNkCnHHc98EKnlb" type="wiki">AI汽车账号/Face ID测试</mention-doc>第4.1、4.2、4.3章节完成账号注册+豆包登录+人脸注册

### 车端信息上报

<lark-table rows="5" cols="5" column-widths="141,129,169,78,303">

  <lark-tr>
    <lark-td>
      参数名
    </lark-td>
    <lark-td>
      参数位置
    </lark-td>
    <lark-td>
      参数格式
    </lark-td>
    <lark-td>
      是否必须
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      vehicle_id
    </lark-td>
    <lark-td>
      公参/query
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      是
    </lark-td>
    <lark-td>
      设备唯一ID，字符串类型，<text color="red">必务保证ID的维一性，ID重复会被限流</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      report_cycle_flag
    </lark-td>
    <lark-td>
      Body Json
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      是
    </lark-td>
    <lark-td>
      上报周期标识，描述一次车辆上下电记录。
      建议格式：时间_uuid（202510011000_xxxxxxx）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      report_type
    </lark-td>
    <lark-td>
      Body Json
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      是
    </lark-td>
    <lark-td>
      上报类型
      - Full -> 全量上报
			- Update -> 增量更新（更新粒度为信号维度）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      resource_value
    </lark-td>
    <lark-td>
      Body Json
    </lark-td>
    <lark-td>
      List<resource_value>
      参见resource_value结构体
    </lark-td>
    <lark-td>
      是
    </lark-td>
    <lark-td>
      车端信号数据
    </lark-td>
  </lark-tr>
</lark-table>

resource_value结构

<lark-table rows="6" cols="5" column-widths="129,141,169,78,348">

  <lark-tr>
    <lark-td>
      参数名
    </lark-td>
    <lark-td>
      参数位置
    </lark-td>
    <lark-td>
      参数格式
    </lark-td>
    <lark-td>
      是否必须
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      id
    </lark-td>
    <lark-td>
      Body Json
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      是
    </lark-td>
    <lark-td>
      信号ID
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      event_time
    </lark-td>
    <lark-td>
      Body Json
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      是
    </lark-td>
    <lark-td>
      信号发生变更事件
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      trigger_task_id
    </lark-td>
    <lark-td>
      Body Json
    </lark-td>
    <lark-td>
      int
    </lark-td>
    <lark-td>
      否
    </lark-td>
    <lark-td>
      触发事件执行的planner任务id
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      task_id
    </lark-td>
    <lark-td>
      Body Json
    </lark-td>
    <lark-td>
      int
    </lark-td>
    <lark-td>
      否
    </lark-td>
    <lark-td>
      事件所属的planner任务id
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      subresource
    </lark-td>
    <lark-td>
      Body Json
    </lark-td>
    <lark-td>
      List<subresource>
      参见subresource结构体
    </lark-td>
    <lark-td>
      是
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

```shell {wrap}
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
```shell {wrap}
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

<quote-container>

测试接口，可指定日期（run_date）去生成当天的记忆
</quote-container>

```shell {wrap}
curl --location --request POST 'https://api-vehicle.volcengine.com/aidv/cron/long-term-memory/generate?cronjob_authentication_key=ko5agHXLTNOQFZMAmB86PbrcRdu4ijYnfVyxhWC1Dq3KzUStp&run_date=20260101&debug-mode=2031&app_id=1000&_nonce=12345&_timestamp=1772695990&vehicle_id=lhjboetest030501&channel_app_id=99210&channel=aidv' \
--header 'x-use-ppe: 1' \
--header 'x-tt-env: ppe_vehicle_zc_test' \
--header 'X-Signature: master2qmyfgchz97olsjnp14uax0kei:+VSPnfxEtx787ny6GBWUZzpwnoCsXx7zHHwV0z1+ix8=' \
```

### 生成长期情景记忆

<quote-container>

测试接口，可指定日期（run_date）去生成当天的记忆
</quote-container>

```shell {wrap}
curl --location --request POST 'https://api-vehicle.volcengine.com/aidv/cron/long-term-scenario-memory/generate?cronjob_authentication_key=ko5agHXLTNOQFZMAmB86PbrcRdu4ijYnfVyxhWC1Dq3KzUStp&run_date=20260101&app_id=1000&debug-mode=2031&_nonce=12345&_timestamp=1772696038&vehicle_id=lhjboetest030501&channel_app_id=99210&channel=aidv' \
--header 'x-use-ppe: 1' \
--header 'x-tt-env: ppe_vehicle_zc_test' \
--header 'X-Signature: master2qmyfgchz97olsjnp14uax0kei:Yp7h2a9F91+MIrzZ7VqwlXYff+3Z33JCOvlepys/Zl8=' \
```

### 记忆列表

<quote-container>

根据记忆类型获取对应的记忆信息<text bgcolor="light-red">（获取记忆列表和删除目前的方案需要车端信息上报）</text>

<mention-doc token="PSYnwXKRLiqXvrkpicocpodtn5d" type="wiki">记忆管理平台操作手册</mention-doc>
</quote-container>

```sql
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

<quote-container>

可指定记忆ID，face_ID，记忆类型，标签类型和时间范围的删除；支持一键清空所有的记忆
</quote-container>

```sql
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

<quote-container>

GenEntityTag
</quote-container>

https://bits.bytedance.net/interface_test?domainId=online&shareId=liCtu0Jm

### 查询用户画像

<quote-container>

GetEntityTagTree
</quote-container>

https://bits.bytedance.net/interface_test?domainId=online&shareId=liCuu0tt

### 查询生成的记忆

<quote-container>

QueryRecord
</quote-container>

https://bits.bytedance.net/interface_test?domainId=online&shareId=liCuu0pk

# 待办项

<task task-id="e2fccdc5-1b2e-4176-8cae-e0725e00dece"/>

<task task-id="fa7165ff-cf21-4f3f-81d9-85fa6b4b7ba9"/>
