# 云端离在线仲裁技术方案

来源：https://bytedance.larkoffice.com/wiki/BRtRwHgo4ivfr3k46LSciQi7nyd

本轮读取状态：success

# 云端离在线仲裁技术方案

## 业务背景

端侧增添相关模型能力后，部分任务既能够在端侧直接处理，也能够发送至云端处理。便会存在对于端云两侧的结果仲裁问题。本文主要说明在端云仲裁链路以及链路中仲裁信息的传递。



1. 相关文档与会议纪要：

<table><tbody>
<tr>
<td>

需求文档

</td>
<td>

[【AI汽车\-PRD】离在线仲裁](https://bytedance.larkoffice.com/docx/Nvj1dvkl8oOTAhxOjxAc0bn0nS0)

</td>
</tr>
<tr>
<td>

端侧离在线仲裁技术方案

</td>
<td>

[端侧离在线仲裁技术方案](https://bytedance.larkoffice.com/docx/N7lEdREQyoiCt1x0YLccx0SanNe)

</td>
</tr>
<tr>
<td>

相关的探讨会议

</td>
<td>

与Speech同学：https://bytedance\.larkoffice\.com/minutes/obcnv2e9192fkdgetb57cop9

与豆包同学：：https://bytedance\.larkoffice\.com/minutes/obcnv3t71xv8oa8g1ow3e847

</td>
</tr>
</tbody></table>

## 概要设计

### 字段说明

<table><tbody>
<tr>
<td>

字段含义

</td>
<td>

火山座舱

</td>
<td>

豆包

</td>
<td>

端侧

</td>
</tr>
<tr>
<td>

会话id，会话列表中的一组对话使用同一个id

</td>
<td>

conversation\_id



</td>
<td>

conversation\_id



</td>
<td>



</td>
</tr>
<tr>
<td>

话题id，贯彻多轮对话

</td>
<td>

chat\_id

</td>
<td>

section\_id

</td>
<td>



</td>
</tr>
<tr>
<td>

对话id，一轮

</td>
<td>

question\_id

</td>
<td>

message\_id

</td>
<td>



</td>
</tr>
<tr>
<td>

端侧ASR识别文本标识



</td>
<td>

request\_id



</td>
<td>



</td>
<td>

ASR识别结果的唯一标识

</td>
</tr>
</tbody></table>

1. request\_id 信息作为一次端云的唯一凭证。将会作为单次对话历史更新、语义仲裁的唯一凭证信息。

2. request\_id也会唯一对应上一个question\_id，即端侧ASR识别文本后发起的豆包文本链路的请求。

### S2S链路触发策略

**现状：**

1. 在RTC建联后，为了保障整个长链接，端侧会不断的将音频数据上传，音频数据都会传递到Speeh链路中做处理。



**方案一（已舍弃）**

1. **RTC链路：**在云端（stream 或者 speech\_agent）接入一个语音供应商做ASR的处理，端侧会区分是否需要走S2S链路并保持连接，当识别结果为需要走S2S链路时，会一直上传音频数据。否则只会传有效的音频，有效音频通过接入的语音供应商做ASR出文本，将文本信息传递给chat服务。

2. **舍弃原因：**这个改动只能在stream或者speech\_agent中调整，经过沟通和服务代码理解发现对原服务改动较大，且RTC链路必须保障音频数据一直上传，无法只上传有效音频。

**方案二**

将豆包侧的请求分为两条链路（文本链路、RTC链路），基于不同的场景分类标识，使用不同的链路处理。

1. **文本链路****：**将在线ASR的识别前置到端侧，端侧识别完成后，将识别的文本信息以及相关标识传递到云端。

2. RTC链路

    1. 首次触发

    识别到相关文本可能涉及闲聊联网相关领域时，构建RTC连接，构建成功后将音频数据上传。

    存在问题：建联导致此次信息的回复会变慢

    2. 连续触发

当建联后会维持RTC的连接，并一直上传音频数据，并在合适的时机断开连接，减少资源的消耗。

- 识别到分类无需RTC链路处理（策略细化）

- 长时间无有效音频

## 详细设计

### 数据库设计

1. （待定）对话历史数据库字段调整（标识对话来源）

```SQL
ALTER TABLE `chat_histories` ADD COLUMN history_source INT NOT NULL DEFAULT '0' COMMENT "对话历史来源：0: 云端，1: 端侧"

```

2. 端侧依赖配置表

```SQL
CREATE TABLE `edge_side_dependency_config` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `channel` varchar(64) NOT NULL COMMENT '渠道标识',
  `channel_app_id` int DEFAULT '0' COMMENT '标识来源',
  `category` varchar(255) NOT NULL COMMENT '类别',
  `vehicle_type` varchar(255) NOT NULL COMMENT '车型参数',
  `version` varchar(64) NOT NULL COMMENT '版本',
  `content` json DEFAULT NULL COMMENT '配置信息',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_channel_app_id_version` (`channel_app_id`,`vehicle_type`,`category`,`version`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='端侧依赖配置表'
```

version：不同的版本即使内容完全相同，也需要创建单独的记录，保障版本间信息隔离。

category枚举类别：

<table><tbody>
<tr>
<td>

配置类别

</td>
<td>

content结构（接口实际返回对应结构的 JSON 字符串）

</td>
</tr>
<tr>
<td>

arbitration\_white\-list\_vehicle\-control



</td>
<td>

```JSON
{
    "空调开关": {
        "module": "车控",
        "level1": "空调",
        "level2": "空调控制"
    },
    "预约充电开关": {
        "module": "车控",
        "level1": "车辆充电",
        "level2": "充电操作"
    }
}
```

</td>
</tr>
<tr>
<td>

offline\_agent



</td>
<td>

```JSON
[
    {
        "agent_id": "7375414411818710000",
        "name": "offline_vehicle_basic_control",
        "chinese_name": "（离线）车载基础控制系统",
        "description": "与实际vehicle_basic_control Agent对应的端侧虚拟Agent"
    }
]
```

</td>
</tr>
<tr>
<td>

agent\_register



</td>
<td>

```JSON
[
    {
        "agent_id": "7375414411818700023",
        "name": "face_id_register",
        "chinese_name": "人脸ID注册管理工具",
        "description": "人脸ID注册管理工具：通过车内摄像头采集并注册/更新/删除用户指定人员的人脸信息，支持副驾、后排、朋友等多角色录入。"
    }
]
```

</td>
</tr>
</tbody></table>

### 接口设计

1. **获取端云协同配置信息**

    - Method: `GET`

    - Path: `/aidv/v1/edge\_config`

    参数

    <table><tbody>
    <tr>
    <td>

    **参数**

    </td>
    <td>

    **参数位置**

    </td>
    <td>

    **参数格式**

    </td>
    <td>

    **是否必须**

    </td>
    <td>

    说明

    </td>
    </tr>
    <tr>
    <td>

    version

    </td>
    <td>

    Request query

    </td>
    <td>

    string

    </td>
    <td>

    是

    </td>
    <td>

    配置版本

    </td>
    </tr>
    <tr>
    <td>

    category

    </td>
    <td>

    Request query

    </td>
    <td>

    string

    </td>
    <td>

    否

    </td>
    <td>

    配置类别，不传默认返回该版本下所有配置

    </td>
    </tr>
    </tbody></table>

    响应

    ```JSON
    {
        "data": {
            "result": [
                {
                    "category":"arbitration_white-list_vehicle-control",
                    "content": "xxxxxx"
                }
            ]
        },
        "errno": 0,
        "msg": "success"
    }
    ```

## 依赖项

## 排期




