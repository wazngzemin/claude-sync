# TaskService 车内视觉长时感知任务技术方案

# 1、需求与背景

<table><tbody>
<tr>
<td>

meego



</td>
<td>

[\[需求\]【AIVA\-视觉感知】TaskService 下发 长时感知任务 至VLM 并接收 结果](https://meego.larkoffice.com/telematics/story/detail/7365557528)

</td>
<td>



</td>
</tr>
<tr>
<td>

PRD

</td>
<td>

[【AIVA\-视觉感知】TaskService 下发 长时感知任务 至VLM 并接收 结果](https://bytedance.larkoffice.com/wiki/DBZxwnI62iavXJksT4ccNu78nOd)

[Director种子数据](https://bytedance.larkoffice.com/wiki/WTPIwriowis0vNkETBfcpyTLnob?sheet=9A01cq) 车内视觉 65\-72行

</td>
<td>



</td>
</tr>
<tr>
<td>

figma

</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>

测试 case 评审

</td>
<td>



</td>
<td>



</td>
</tr>
</tbody></table>

<div class="callout">

本次开发范围为车内视觉长时任务。（如「帮我照看一下后排宝宝」）

**Task Service 的职责为**：生成并下发感知任务 UP、接收VLM上报数据及同步给trigger、 trigger 调用callback 走执行链路以及管理任务生命周期。

</div>

# 2、流程图

case：帮我照顾二排的宝宝



# 3、开发范围

<table><tbody>
<tr>
<td>

序号

</td>
<td>

内容

</td>
</tr>
<tr>
<td>

3\.1

</td>
<td>

Task Service 生成长时感知任务及下发

</td>
</tr>
<tr>
<td>

3\.2

</td>
<td>

接收长时感知任务视觉监测结果

</td>
</tr>
<tr>
<td>

3\.3

</td>
<td>

任务触发 trigger\-\&gt;task service 

</td>
</tr>
<tr>
<td>

3\.4

</td>
<td>

任务更新

</td>
</tr>
<tr>
<td>

3\.5

</td>
<td>

结束任务

</td>
</tr>
</tbody></table>

## 3\.1  长时感知任务生成及下发

### 3\.1\.1  长时感知任务生成

- **方向**：task agent 新增输出长时感知任务类型 `spec\.task\_kind` 字段，暂定 **`cabin\_vision`** 为舱内长时感知任务类型（当前方案以此为基准，后续随 agent 输出持续对齐），task service 承接 并新建任务

- **生成限制**：

    - AlwaysOn 开关是舱内感知功能的总开关，需要时开启状态才能生成

        - 已与@徐燃 沟通，开发时会提供一个接口查询是否已开启舱内感知功能。

        - task service 会查询判断是否已开启舱内感知功能，如果没开启，则拒绝创建任务

    - 同一时间下发的长时任务数**不超过 3 个，**超过3个则拒绝创建任务

### 3\.1\.2 注册trigger

- **方向**： task service \-\&gt; trigger 复用 RPC RegisterScene 接口完成长时感知任务注册

- **结构**：已与 trigger 确认传递字段结构，仅展示变更字段

    - `SceneType SceneTypeModelInference = \&\#34;``vlm\_inference``\&\#34;`  // vlm推理场景

    - `req\.conditions `和 `req\.dynamic\_conditions` 两部分整合到 `req\.ConditionParams` 中

    - 新增 `req\.InferenceParams` 参数 传递推理触发参数

    ```JSON
    {
        // ... 其他字段与原有逻辑保持一致
        "tag": "test",  *// 场景环境。all:所有场景  test:测试场景  formal:正式*
        "condition_params": {
          "conditions": "",
          "dynamic_conditions": "",
        },
        "inference_params": {
            "goal": "二排右侧的宝宝醒了吗？"
        }
    }
    ```

### 3\.1\.3 下发给车机AI Service

#### 下发方式

- **方向**：TaskService → 端侧 AI Service（通过 frontier 通道下发）。

    ```Go
    type Method int32
    
    const (
        // ... 已有枚举值 ...
        TaskService Method = 13 // 推送来源：任务服务
    )
    
    // MessageType 任务推送事件类型
    type MessageType int32
    
    const (
        TypeCreateTask MessageType = 1 // 创建任务推送
        TypeCloseTask  MessageType = 2 // 关闭任务推送
        TypeUpdateTask  MessageType = 3 // 更新任务推送
        TypeDynamicWatchTask MessageType = 4 // 长时感知任务推送
    )
    ```

- **结构**：`dynamic\_watch\_tasks` 数组。

- **容量约束**：同一时间下发的长时任务数**不超过 3 个**，且同一批次内任务编号**不能重复**。

- **替换语义**：VLM 每次收到新的 UP 都会做**全量替换**，不做增量合并；因此任务的增、删、改全部由 TaskService 通过重新下发完整列表来实现。

#### 下发数据结构

- **PRD定义的结构（下图）AI Service \-\&gt;  VLM **

**实际推送字段说明**：

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

`occurred\_at`

</td>
<td>

int64

</td>
<td>

事件发生时间

</td>
</tr>
<tr>
<td>

`dynamic\_watch\_tasks`

</td>
<td>

array

</td>
<td>

动态视觉任务列表

</td>
</tr>
<tr>
<td>

`task\_id`

</td>
<td>

string

</td>
<td>

任务编号。TaskService 分配的任务唯一标识 Task ID 

</td>
</tr>
<tr>
<td>

`task\_version`

</td>
<td>

int64

</td>
<td>

任务版本号。可用于版本校验，防止老版本覆盖新版本任务

</td>
</tr>
<tr>
<td>

`target`

</td>
<td>

string 

</td>
<td>

感知目标

</td>
</tr>
</tbody></table>

**格式示例**：

```json
{
  "occurred_at": 1788145200123,
  "dynamic_watch_tasks": [
    {
      "task_id": "7674191803016284191", // 任务编号
      "task_version": 1, // 任务版本
      "target": "二排右侧的宝宝醒了吗？" // 感知目标
    }
  ]
}
```

```Go
type DynamicWatchTasksMsg struct {
    OccurredAt int64 `json:"occurred_at"`
    DynamicWatchTasks []DynamicWatchTask `json:"dynamic_watch_tasks"`
}

type DynamicWatchTask struct {
    TaskID      string `json:"task_id"`
    TaskVersion *int64 `json:"task_version,omitempty"`
    Target      string `json:"target,omitempty"` // 感知目标
    Result      string `json:"result,omitempty"` // 识别结果
}
```

## 3\.2 接收长时感知任务视觉监测结果

### 3\.2\.1 接收 VLM AI Service 数据

- **方向**： 端侧 AI Service → task service ，新增上报接口

- **请求地址**：`POST  /aidv/v1/task/vlm/result/report`

- **请求参数**：公共请求参数  \+ 以下表格数据

<table><tbody>
<tr>
<td>

字段

</td>
<td>

参数位置

</td>
<td>

类型

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

`occurred\_at`

</td>
<td>

Body Json

</td>
<td>

int64

</td>
<td>

是

</td>
<td>

事件发生时间，毫秒级

</td>
</tr>
<tr>
<td>

`dynamic\_watch\_tasks`

</td>
<td>

Body Json

</td>
<td>

array

</td>
<td>

是

</td>
<td>

动态任务列表

</td>
</tr>
<tr>
<td>

`task\_id`

</td>
<td>

Body Json

</td>
<td>

string

</td>
<td>

是

</td>
<td>

任务编号。TaskService 分配的任务唯一标识 

</td>
</tr>
<tr>
<td>

`task\_version`

</td>
<td>

Body Json

</td>
<td>

int64

</td>
<td>

否

</td>
<td>

任务版本号

</td>
</tr>
<tr>
<td>

`result`

</td>
<td>

Body Json

</td>
<td>

string

</td>
<td>

是

</td>
<td>

VLM识别结果

</td>
</tr>
</tbody></table>

```JSON
{
  "occurred_at": 1788145200123,**
**  "dynamic_watch_tasks": [**
**    {**
**      "task_id": "7676330167588980778",**
**      "task_version": 1,**
**      "result": "检测到后排有婴儿，当前状态：安静，未哭闹"**
**    },**
**    {**
**      "task_id": "7676330167588888888",**
**      "task_version": 2,**
**      "result": "检测到主驾驶员面部表情正常，未见疲劳迹象"**
**    }**
**  ]**
**}
```

- **返回参数**

```JSON
{
    "data": {
        "received_count": 2, // 上报条数
        "forwarded_count": 0, // 成功条数
        "skipped_count": 0, // 因过期或任务不存在等原因跳过的条数
        "failed_count": 2 // 上报给trigger失败条数
    },
    "errno": 0,
    "msg": "success"
}
```

- **形态**：`动态任务`  数组， PRD 中 VLM输出给 AI Service 结构\-下图红框内容，传递给 task service 需要转为实际请求参数格式

- **容量约束**：VLM 推理完成后，动态任务输出区域会按任务编号返回识别结果。下发几个 UP，输出区域就包含几项

### 3\.2\.2 传递给Trigger

- **方向**：TaskService → Trigger Task Service 接收后通过RPC接口 **`TriggerRun`**传递给trigger。 

- **结构**： 通过 `TriggerRunRequest\.TriggerInfo\.InferenceTriggerParams`  参数传递

- **约束**：

    - **`TriggerRun`**** **仅支持单条任务上报推理，不支持多条任务同时传递，调用次数与VLM传递数据条数保持一致，单次失败，不影响其他数据上报

    - 存在已关闭任务~~或老版本任务~~的VLM数据时，当前关闭任务只落库并不再转发 Trigger。且当发现任意一条上报信息存在已关闭状态~~或老版本任务~~时，需要重新下发最新的 `dynamic\_watch\_tasks`

    - 如果上报时间与服务端时间相差20秒以上，仅落库，不传递整条数据

- **数据结构字段说明**：

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

`TriggerInfo`

</td>
<td>

abject

</td>
<td>

场景触发的信息

</td>
</tr>
<tr>
<td>

`TriggerInfo\.mode`

</td>
<td>

string

</td>
<td>

VLM模型推理触发固定值：model\_inference

</td>
</tr>
<tr>
<td>

`data`

</td>
<td>

string

</td>
<td>

非必填\-本期不涉及

</td>
</tr>
<tr>
<td>

`condition\_params`

</td>
<td>

abject

</td>
<td>

条件参数

</td>
</tr>
<tr>
<td>

`inference\_params`

</td>
<td>

abject

</td>
<td>

推理参数

</td>
</tr>
<tr>
<td>

`inference\_params\.scene\_id`

</td>
<td>

i64

</td>
<td>

场景ID

</td>
</tr>
<tr>
<td>

`inference\_params\.data`

</td>
<td>

string

</td>
<td>

模型输出的识别结果

</td>
</tr>
<tr>
<td>

`inference\_params\.report\_time`

</td>
<td>

i64

</td>
<td>

上报的时间戳

</td>
</tr>
</tbody></table>

```json
{
  // ... 其他公共参数
  "TriggerInfo": {
    "mode": "model_inference",
    "data": "",
    "condition_params": {},
    "inference_params": {
      "scene_id": 1001,
      "data": "检测到主驾驶员面部表情正常，未见疲劳迹象",
      "report_time": 1788145200123
    }
}
```

### 3\.2\.3 VLM上报数据落库

- **方式**：传递数据之后启用 goroutine 存储到数据库中，异步落库失败不影响接口结果。

- **表结构**：

```SQL
CREATE TABLE IF NOT EXISTS `task_vlm_result_log` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '存储主键',
  `vehicle_id` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'NDB 分片键，车辆ID',
  `channel` varchar(64) NOT NULL DEFAULT '' COMMENT '渠道标识',
  `task_id` bigint unsigned NOT NULL COMMENT '长时感知任务ID',
  `vlm_result` text DEFAULT NULL COMMENT 'VLM识别结果',
  `status` varchar(32) NOT NULL DEFAULT '' COMMENT '转发状态：forwarded已转发、expired数据已过期、task_closed任务已关闭、forward_failed转发失败、task_not_found任务不存在',
  `log_id` varchar(128) NOT NULL DEFAULT '' COMMENT '请求LogID',
  `reported_at` datetime(3) NOT NULL COMMENT 'VLM上报时间',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '服务端接收时间',
  PRIMARY KEY (`id`),
  KEY `idx_vehicle_task` (`vehicle_id`, `task_id`),
  KEY `idx_vehicle_log_id` (`vehicle_id`, `log_id`),
  KEY `idx_vehicle_reported_at` (`vehicle_id`, `reported_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='长时感知任务VLM上报结果日志，按vehicle_id分片，每条任务结果一行';
```

## 3\.3  任务触发

### 3\.3\.1 触发方式

- **方向**： 当trigger 推理触发时，Trigger → TaskService  通过 RPC 接口 TriggerCallback触发任务（复用之前链路）

### 3\.3\.2 触发类型与输出结果

- **保持**：触发后通过frontier主动推荐链路交给planner处理的逻辑

- **新增**：补充长时感知任务重新下发至AI Service（如下表格中标黄部分）

<table><tbody>
<tr>
<td>

结果类型

</td>
<td>

表格中的典型 case

</td>
<td>

输出时机

</td>
<td>

输出方式

</td>
</tr>
<tr>
<td>

周期汇报

</td>
<td>

「每分钟给我汇报二排宝宝的状态」

</td>
<td>

Trigger 定时触发

</td>
<td>

通过主动推荐链路交给planner处理

</td>
</tr>
<tr>
<td>

目标达成即结束

</td>
<td>

「给宝宝讲故事把他哄睡着」

</td>
<td>

Trigger 判断任务完成

</td>
<td>

达成则关闭任务：
1、通过主动推荐链路交给planner处理
2、把有效的长时感知任务重新下发至AI Service

</td>
</tr>
<tr>
<td>

持续看护

</td>
<td>

「帮我照顾一下二排的宝宝」

</td>
<td>

Trigger 判断需要介入汇报

</td>
<td>

通过主动推荐链路交给planner处理

</td>
</tr>
<tr>
<td>

无法实现

</td>
<td>

\-

</td>
<td>

关注对象离车

</td>
<td>

1、关闭任务
2、把有效的长时感知任务重新下发至AI Service

</td>
</tr>
<tr>
<td>

已过期或已关闭

</td>
<td>

\-

</td>
<td>

Trigger 指定的Task 任务已关闭 

</td>
<td>

1、关闭任务
2、把有效的长时感知任务重新下发至AI Service

</td>
</tr>
</tbody></table>



## 3\.4 任务更新

- **主要动作：**

    - **保持**：任务更新、Trigger 场景更新的逻辑

    - **新增**：通过 3\.1\.3 长时感知任务下发链路 发送最新的`dynamic\_watch\_tasks` 

## 3\.5 结束任务

### 3\.5\.1 用户主动结束任务

- **主要动作：**

    - **保持**：关闭长时感知任务并注销trigger逻辑

    - **新增**：通过 3\.1\.3 长时感知任务下发链路 发送最新的`dynamic\_watch\_tasks` 














