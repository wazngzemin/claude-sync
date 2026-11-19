问题和建议上报agent - 技术方案
需求背景
D6X 处于种子用户测试阶段（字节内部招募 40 名用户，非技术背景为主）。用户身处真实用车场景，是发现问题的最直接来源，但当前缺少即时、低门槛的反馈通道，事后回忆上报导致三类问题：时效性差（用户遗忘、语境丢失）、诊断信息缺失（缺少截图/日志/端状态，复现困难）、参与率低（上报路径重、非技术用户操作门槛高）。
需求文档: D6X 问题和建议上报机制 PRD（for 种子用户）
业务流程

model定义
feedback_reports: 用于存储问题反馈相关信息

CREATE TABLE IF NOT EXISTS `feedback_reports` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `report_id` VARCHAR(64) NOT NULL COMMENT '上报唯一ID，幂等键',
    `report_status` TINYINT NOT NULL DEFAULT '0' COMMENT '上报状态, 0:新建 1:端侧收到了fc 2:端侧上报成功',
    
    `env` varchar(52) NOT NULL DEFAULT '' COMMENT '当前的环境',
    `channel` varchar(64) NOT NULL DEFAULT '' COMMENT '渠道',
    `channel_app_id` int unsigned NOT NULL DEFAULT '0' COMMENT '标识来源',
    `vehicle_id` varchar(256) NOT NULL DEFAULT '' COMMENT '车辆唯一id',
    `vehicle_type` varchar(256) NOT NULL DEFAULT '' COMMENT '车型',
    `edge_version` varchar(128) NOT NULL DEFAULT '' COMMENT '客户端版本号',
    
    `trigger_query` VARCHAR(2048) NOT NULL DEFAULT '' COMMENT '触发上报的用户原始 query（用户原话）',
    `director_summary_query` VARCHAR(2048) COMMENT '前 5 轮 Director 总结后传给 Agent 的 problem_desc',
    `user_memory` JSON COMMENT '查询到的用户长期记忆快照',
    `report_analyze` JSON COMMENT '上报agent分析{input: "xxxx", output: "xxxx"}',
    `feedback_type` VARCHAR(16) NOT NULL DEFAULT '' COMMENT '问题/建议',
    `category` VARCHAR(64) NOT NULL DEFAULT '' COMMENT '领域分类',
    `priority` VARCHAR(8) NOT NULL DEFAULT '' COMMENT 'P0/P1/P2',
    `log_uri` VARCHAR(512) NOT NULL DEFAULT '' COMMENT '前 10 分钟上报端侧log的URI',
    `screenshot_uri_list` JSON COMMENT '前 10 分钟上报 截屏 URI 列表，JSON string array["xxx", "xxx"]',
    
    `trigger_log_id` VARCHAR(128) NOT NULL DEFAULT '' COMMENT '触发上报请求本身的 log_id',
    `async_sync_log_id` VARCHAR(128) NOT NULL DEFAULT '' COMMENT '异步同步上报 log 接口调用的 log_id',
    
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uniq_vehicle_id_report_id` (`vehicle_id`, `report_id`),
    KEY `idx_vehicle_id_channel_created_at_filter` (
        `vehicle_id`,
        `channel`,
        `created_at`,
        `feedback_type`,
        `category`,
        `priority`
    ),
    KEY `idx_created_at` (`created_at`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '问题/建议上报agent信息记录表';

report_analyze 

{
  "prompt_version": "feedback_report_v1.2",
  "prompt_key": "xxxxx",
  "input": {
    "query": "...",  // 用户query
    "director_summary_query": "xxxxxx", // director总结的前5轮query
    "user_memory": {} // 前5轮query 捞到的记忆信息
  },
  "output": {
    "feedback_type": "问题",
    "category": "navi_basic_control",
    "priority": "P1"
  },
  "fallback": false
}

问题反馈数据异步上报结构定义

type SyncFeedbackLogRequest struct {
    ReportID   string            `json:"report_id" vd:"len($)>0 && len($)<=64; msg:'report_id不能为空'"` // 主上报report_id，幂等键
    LogURIList []string          `json:"log_uri_list"`                                               // 前 10 分钟 log URI 列表
    LogURI     string            `json:"log_uri,omitempty"`                                          // 主 URI，可选，默认取 list[0]
    Extra      map[string]string `json:"extra,omitempty"`                                            // 预留扩展
}
接口流程
问题反馈
AgentName: 
AgentID: 

下发的采集fc

{    
    "reply_id":"39327358847035138",
    "report_id": "rpt_20260728_001",
    "longest_time": 600,  // 往前获取多长时间的log 单位s
    "start_time": xxx,  // 开始的时间戳  秒
    "functions": [
        {
            "function_code": "问题和建议反馈",
            "params": []
        }
    ]
}
数据异步上报
Method: POST
Path: /report_agent/sync_info
Commoninfo: 公版-AI汽车接口访问指南
Request

type SyncFeedbackLogRequest struct {
    ReportID   string            `json:"report_id" vd:"len($)>0 && len($)<=64; msg:'report_id不能为空'"` // 主上报 UUID，幂等键
    LogURIList []string          `json:"log_uri_list"`                                               // 前 10 分钟 log URI 列表
    LogURI     string            `json:"log_uri,omitempty"`                                          // 主 URI，可选，默认取 list[0]
    Extra      map[string]string `json:"extra,omitempty"`                                            // 预留扩展
}
示例

{
    "report_id": "rpt_20260728_001",
    "log_uri_list": ["tos-cn-i-fvufwgfm0o/5df11a1f4d76442989107ed2f4af4310", "tos-cn-i-fvufwgfm0o/5df11a1f4d76442989107ed2f4af4310"],
    "log_uri": "tos-cn-i-fvufwgfm0o/5df11a1f4d76442989107ed2f4af4310",
    "extra": {}
}
Response

{
    "success": "true",
    "report_id": "rpt_20260728_001"
}
相关配置


配置项

默认值

说明

feedback_report.log_lookback_seconds

600

日志回溯窗口

feedback_report.sync_timeout_ms

1000

异步接口超时

feedback_report.max_log_uri_count

200

URI 数量上限
上线todo


测试重点


todoList
端状态和记忆信息怎么获取
后续使用 和用户澄清需要在5轮内完成反馈 @单如水
后续加一下使用范围的校验(白名单内的才可以使用这个agent) @俞昭志   (只发布到特定的ppe环境)
体验的时候务必使用测试账号 @单如水
车 日志登记的问题 是否debug @单如水


