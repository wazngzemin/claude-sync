# 【Planner】服务端技术评审 250910

# 术语表

<table><tbody>
<tr>
<td>

术语

</td>
<td>

含义

</td>
</tr>
<tr>
<td>

planner

</td>
<td>

任务拆解、编排、调度模块

</td>
</tr>
<tr>
<td>

eino



</td>
<td>

基于 Go 语言的AI（Artificial intelligence） Agent 开源开发框架，由产品研发和工程架构\-Stone团队开发。

</td>
</tr>
</tbody></table>

# 业务背景

需求文档：[任务Planner \- PRD 【豆包 in car1\.0】](https://bytedance.larkoffice.com/docx/UDdFd9qPaopLFLxcu1Ec6oqSnDh)

算法设计：[座舱Planner OnePage](https://bytedance.larkoffice.com/docx/HlFsdGQbPoH4LFxdqtEcjvY7nCg)

# 概要设计

1. 任务持久化：任务和相关上下文保存到数据库

2. 定时任务：通过任务属性实现

3. 多任务并行：通过eino chain实现

4. 复杂多任务：本期不实现

# 详细设计

## 任务

### 任务流程设计

基本原则：一个任务只能对应一个 tool/agent

### 依赖

1. Planner模型输出

2. Agents server提供工具列表

3. Agents封装成eino的tool/agent



Eino tool 接口定义

```Go
// 基础工具接口，提供工具信息
type BaseTool interface {
    Info(ctx context.Context) (*schema.ToolInfo, error)
}

// 支持同步调用的工具接口
type InvokableTool interface {
    BaseTool
    InvokableRun(ctx context.Context, argumentsInJSON string, opts ...Option) (string, error)
}

// 支持流式输出的工具接口
type StreamableTool interface {
    BaseTool
    StreamableRun(ctx context.Context, argumentsInJSON string, opts ...Option) (*schema.StreamReader[string], error)
}
```

### 任务关系设计

```JSON
// 并行任务
[
    {
        "query":"任务一",
        "agent":"",
        "request":{} // 输入信息
    },
    {
        "query":"任务二",
        "agent":"",
        "request":{}
    }
]

// 串行任务
{
    {
        "query":"任务一",
        "agent":"",
        "request":{},
        "child":[
            {
                "query":"任务二",
                "agent":"",
                "request":{}
            }
        ]
    }
}

// 定时任务
{
    {
        "query":"任务一",
        "agent":"",
        "expect_exec_time":"2025-09-20 10:00:00",
        "request":{}
    }
}

// 条件任务
{
    {
        "query":"任务一",
        "agent":"",
        "request":{},
        "condition":{
            // 条件设计待定
        }
    }
}
```

### 模型输出转换

```JSON
待提供模型
```

### 调度器

基于eino的Chain/Graph/workflow实现

关键信息：

1. 最大支持多少任务并发

2. 单用户并发限制、定时任务限制

3. 任务超时设置



#### 并行任务

```Go
parallel := compose.NewParallel()
parallel.AddLambda("task_a", ...)
parallel.AddLambda("task_b", ...)

chain.AppendParallel(parallel).AppendToolNode("并行任务结果处理tool")
```

#### 串行任务

```Go
chain.AppendToolsNode().AppendToolsNode()...
```

#### 分支任务

930不实现

#### 定时任务

#### 条件任务

### 任务检测

930默认通过

### 总结

930按agent首TOKEN顺序原样输出

### 定时器

简单实现考虑使用redis列表\+轮询实现，930不实现

### 定时任务恢复

到运行时间点时重新编排，eino有中断恢复机制，但是**不适合**我们的使用场景



### 入参、出参

TODO: 是否可以用agent那套协议

```Thrift
*type ChatRequest struct {
    Channel             string                    `query:"channel" json:"channel" vd:"hasValue($)"` // 渠道名
    Query               string                    `query:"query" json:"query" vd:"hasValue($)"`     // 用户Query
    ChatID              string                    `json:"chat_id" query:"chat_id"`                  // 会话ID，多次对话组成一个会话
    QuestionID          string                    `query:"question_id" json:"question_id"`          // QA ID
    History             *chat_history.HistoryList `json:"history"`                                  // 历史
    CarInfo             constant.CarInfo          `json:"car_info"`                                 // 车相关的信息
    Extra               *sync.Map                 `default:"{}" json:"extra"`                       // 扩展信息，方便兼顾不同调用方的个性需求，使用时请调用pkg_util.GetStringFromSyncMap
**    PluginParams        string                    `json:"plugin_params"`                            // 插件自定义的参数，json字符串，由插件自行解析*
    *CommonInfo          constant.CommonInfo       `json:"-"`*
    ... 
    更多待补充
}


type ChatResponse struct {
    *ContentIndex        *int                    `json:"-"`                                // 内容序号
    *ErrorCode           *int64                  `json:"error_code"`                       // 错误码
    *ErrorMessage        *string                 `json:"error_message"`                    // 错误消息
    *TTSText             *string                 `json:"tts_text,omitempty"`               // 给TTS进行播报的文本
    *Content             *string                 `json:"content"`                          // 自然语言
    *ReasoningContent    **string                `json:"reasoning_content,omitempty"`      // 大模型推理内容
    *Stage               *constant.Stage         `json:"stage,omitempty"`                  // 阶段
    *PluginName          *string                 `json:"plugin_name,omitempty"`            // 插件名，和Observation成对出现，用于表明Observation里的数据是什么
    *Observation         *string                 `json:"observation,omitempty"`            // 结构化数据
    *Keywords            *string                 `json:"keywords,omitempty"`               // 关键词                 // hints
    *Signals             *[]signal.SignalMessage `json:"signals,omitempty"`                // 信号状态筛选结果
    *DebugInfo           **DebugInfo             `json:"debug_info,omitempty"`             // 调试信息
    *Rejection           **bool                  `json:"rejection,omitempty"`              // 拒识结果
    *RequestSessionLogID *string                 `json:"request_session_log_id,omitempty"` // 结果被缓存的请求LogID (仅需缓存接口结果链路使用，便于其他接口或者结果时知道响应的是哪个请求)
    *Extra               **sync.Map              `json:"extra,omitempty"`                  // 扩展信息，方便兼顾不同调用方的个性需求

    *InnerData *ChatResponseInnerData `json:"-"` // 用于不透出外部的数据
}
```



## 数据库设计

```SQL
CREATE TABLE `chat_histories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `env` varchar(64) COLLATE utf8mb4_general_ci DEFAULT '' COMMENT '服务器环境',
  `channel` varchar(64) NOT NULL COMMENT '渠道标识',
  `channel_app_id` int DEFAULT '0' COMMENT '标识来源', 
  `vehicle_id` varchar(256) COLLATE utf8mb4_general_ci DEFAULT '' COMMENT '车辆ID',
  `trigger_method` varchar(16) DEFAULT '0' COMMENT '触发方式，主动推荐还是用户触发的，后期拓展其他的方式',
  `chat_id` varchar(255) NOT NULL COMMENT '会话ID，对应豆包的section_id',
  `conversation_id` varchar(255) NOT NULL COMMENT '会话ID，对应豆包的conversation_id',
  `vehicle_type` varchar(255) COLLATE utf8mb4_general_ci DEFAULT '' COMMENT '车型参数',
  `error_msg` varchar(128) COLLATE utf8mb4_general_ci DEFAULT '' COMMENT '报错信息',
  `question_id` varchar(256) DEFAULT NULL COMMENT 'QA ID',
  `login_doubao_uid` varchar(256) DEFAULT NULL COMMENT '账号ID',
   `user_id` varchar(256) DEFAULT NULL COMMENT '实际触发人的id',
   `query` varchar(512) NOT NULL COMMENT '用户query',
   `query_type` varchar(16) NOT NULL COMMENT '记录query的类型，语音、手势、UI等',
   `answer` text COMMENT '给用户的回答',
   `context` json DEFAULT NULL  COMMENT '本次请求对应的context信息',
   `log_id` varchar(128) NOT NULL COMMENT 'log_id',
   `total_time` int DEFAULT '0' COMMENT '耗费的总时间，单位毫秒',
   `stage_code` varchar(64) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '阶段信息',
   `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
   `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
   `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
   PRIMARY KEY (`id`),
   unique key `uniq_log_id` (`log_id`),
   key `idx_channel_vehicle_id_chat_id_created_at` (`channel`, `vehicle_id`,`chat_id`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='历史表';

CREATE TABLE `planner_histories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `vehicle_id` varchar(256) NOT NULL COMMENT '车辆ID',
  `chat_histories_id` bigint unsigned  DEFAULT NULL COMMENT 'chat_histories表的ID',
  `observaton` text COMMENT 'planner输出的结构化数据',
  `nlg` text COMMENT 'planner输出的文本信息',
  `cost_duration` int DEFAULT '0' COMMENT 'planer的运行时间，毫秒',
  `error_msg` varchar(128) DEFAULT '' COMMENT '报错信息',
  `debug_info` json DEFAULT NULL COMMENT '包含本次请求的所有的模型请求信息',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  key `idx_vehicle_id_chat_histories_id_created_at` (`vehicle_id`, `chat_histories_id`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='planner调度信息表';

CREATE TABLE `planner_task_list` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `vehicle_id` varchar(256) NOT NULL COMMENT '车辆ID',
  `planner_id` bigint unsigned NOT NULL COMMENT '历史ID',
  `task_type` tinyint DEFAULT NULL COMMENT '任务类型',
  `query` varchar(256)  DEFAULT NULL COMMENT '任务query',
  `tools_info` json default NULL comment '要调用的tools',
  `child` json  default NULL comment '子任务',
  `answer` text  COMMENT '任务的回复',
  `task_status` tinyint NOT NULL DEFAULT '0' COMMENT '任务状态：0待执行；1执行中；2完成',
  `context_info` json DEFAULT NULL COMMENT '上下文信息',
  `expect_exec_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '预期执行时间',
  `exec_time` datetime DEFAULT NULL COMMENT '执行时间',
  `check_point` text  COMMENT '运行时数据',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  key `idx_vehicle_id_planner_id_created_at` (`vehicle_id`, `planner_id`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='任务信息表';


CREATE TABLE `agent_histories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `vehicle_id` varchar(256) NOT NULL COMMENT '车辆ID',
  `chat_histories_id` bigint unsigned NOT NULL COMMENT 'chat_histories的id，标识来源',
  `planner_task_id` bigint unsigned DEFAULT 0 COMMENT '任务ID',
  `agent_id` varchar(64) COLLATE utf8mb4_general_ci COMMENT 'agent_id',
  `observation` text COLLATE utf8mb4_general_ci COMMENT '结构化数据',
  `error_msg` varchar(128) COLLATE utf8mb4_general_ci DEFAULT '' COMMENT '报错信息',
  `query` varchar(512) NOT NULL COMMENT '用户query',
  `answer` text COMMENT '回答',
  `debug_info` json DEFAULT NULL COMMENT '包含所有的模型请求信息',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  key `idx_vehicle_id_chat_histories_id_task_id_created_at` (`vehicle_id`, `chat_histories_id`, `planner_task_id`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='agent历史信息详情表';
```

## 典型用例

<table><tbody>
<tr>
<td>

Query

</td>
<td>

预期结果

</td>
<td>

说明

</td>
</tr>
<tr>
<td>

打开车窗搜索王者荣耀视频



</td>
<td>

执行了车控，同时搜索了抖音视频



</td>
<td>

要试多agent的query，因为车控本身支持多函数

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

## 接口设计







# 评审记录

> 
> 
> 

<table><tbody>
<tr>
<td>

评审方向

</td>
<td>

评审负责人

</td>
<td>

内容

</td>
</tr>
<tr>
<td>

需求文档

</td>
<td>

PRD负责人

</td>
<td>



</td>
</tr>
<tr>
<td>

评审日期：

</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>

评审小组意见

</td>
<td>

至少包括：

1\.负责该系统设计的一线RD

**2\.该方向的资深负责****RD****或者技术Leader**

</td>
<td>



</td>
</tr>
<tr>
<td>

前端研发意见（若有）

</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>

后端研发意见（若有）

</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>

产品评审意见

</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>

测试评审意见

</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>

待解决问题

</td>
<td>



</td>
<td>



</td>
</tr>
</tbody></table>



# 附录








