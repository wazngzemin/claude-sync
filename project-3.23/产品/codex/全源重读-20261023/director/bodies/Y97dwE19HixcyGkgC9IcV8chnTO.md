# AI设置技术评审

# 需求背景

上汽即将交付，AI汽车的功能需要让用户能够自主选择开启，因此需要在“AI设置”入口增加部分设置功能； [产品需求](https://bytedance.larkoffice.com/wiki/D0cwwp6pzicNJBkU4x3cUPTpnle)

可设置项如下：

其中的“AI服务”、“主动服务”和“记忆开关”需要上云，影响云端功能效果；

<table><tbody>
<tr>
<td>

**功能项**

</td>
<td>

**数据存储维度**

</td>
<td>

**配置值**

</td>
<td>



</td>
<td>

**客户端如何使用**

</td>
<td>

**云端如何使用**

</td>
</tr>
<tr>
<td>

AI服务



</td>
<td>

渠道\+车ID\+豆包UID



</td>
<td>

【开】、【关】

</td>
<td>



</td>
<td>

1. 用户说话不唤醒（不跑离线车控，不跑预请求）；

2. Always on不可用；

3. http接口继续请求，例如端状态上报、登录状态同步等；

</td>
<td>



1. 同步开关给弋途，让其关闭主动服务；

2. 收到的所有advisor都不下发给客户端；

3. 开关由“开”变“关”时弋途删除所有任务；

4. ~~对query和预请求做拦截？（客户端已拦截）~~



</td>
</tr>
<tr>
<td>

主动服务

</td>
<td>

渠道\+车ID\+豆包UID

</td>
<td>

【开】、【关】

</td>
<td>



</td>
<td>

无

</td>
<td>

1. 同步开关给弋途，让其关闭主动服务；

2. 收到的所有静态advisor都不下发给客户端；

</td>
</tr>
<tr>
<td>

记忆开关

</td>
<td>

渠道\+车ID\+豆包UID

</td>
<td>

【开】、【关】

</td>
<td>



</td>
<td>

无

</td>
<td>

1. 新记忆不生成；所有记忆不查询；历史记忆数据不删除；

</td>
</tr>
<tr>
<td>



</td>
<td>



</td>
<td>



</td>
<td>

@王兴

</td>
<td>



</td>
<td>



</td>
</tr>
</tbody></table>

# 业务的使用

### 客户端 @郭金龙

1. AI服务关时

    1. 用户说话不唤醒（不跑离线车控，不跑预请求）

    2. Always on停止

2. 其他客户端开关效果；

### ~~Context ~~@向超然

~~新增AI设置内容，查询每个配置项的值，用于sp展示（planner使用）和弋途查询使用（弋途可据此关闭主动服务、结束任务）；~~

### 触发器 @刘杨

AI服务或者主动服务关了时，回调弋途接口通知弋途（同上下电同步逻辑），让弋途删除所有任务、关闭主动服务；

### Advisor @徐燃

如果AI服务或者主动服务关了，拦截所有静态advisor；

如果AI服务关了，拦截所有动态advisor；

### 记忆 @向超然

记忆开关关闭后：

1. 新记忆不生成；

2. 所有记忆不查询；

3. 历史记忆数据不删除；

# 技术方案一

~~直接将所有开关值定义成一个端状态信号，例如：~~

```JSON
{
    "id": "system_config_0001",
    "subresource": [
        {
            "config_key": "use_ai_service",
            "config_value": "true"
        },
        {
            "config_key": "use_static_advisor",
            "config_value": "false"
        },
        {
            "config_key": "use_memory",
            "config_value": "false"
        }
    ]
}
```

**方案优点**：简单，复用当前端状态能力，无需额外开发，数据能自然地进context提供给planner使用；

**方案缺点**：数据完全由客户端维护，只能端上报给云，客户端豆包更新或者车机系统更新时数据可能丢失；每个渠道的开关默认值只能端维护写死，无法云端动态配置；端状态数据上报只能是车维度，没法做到车\+豆包账号维度（每次换登豆包后车机重新上报端状态，云端能拿到车辆最新端状态也不影响效果）；

# 技术方案二

## 云端维护配置项定义及数据

云端支持新增各类配置项，将配置项定义示例如下：

<table><tbody>
<tr>
<td>

**id**

</td>
<td>

**配置项英文**

</td>
<td>

**配置项中文**

</td>
<td>

**数据类型**

</td>
<td>

**配置值枚举**

</td>
<td>

**默认值**

</td>
<td>

**数据存储维度**

</td>
<td>

**页面展示排序**

</td>
</tr>
<tr>
<td>

1

</td>
<td>

use\_ai\_service

</td>
<td>

AI服务开关

</td>
<td>

boolean

</td>
<td>

\[\&\#34;true\&\#34;,\&\#34;false\&\#34;\]

</td>
<td>

\&\#34;false\&\#34;

</td>
<td>

跟车\+豆包

</td>
<td>

1

</td>
</tr>
<tr>
<td>

2

</td>
<td>

use\_static\_advisor

</td>
<td>

主动服务开关

</td>
<td>

boolean

</td>
<td>

\[\&\#34;true\&\#34;,\&\#34;false\&\#34;\]

</td>
<td>

\&\#34;false\&\#34;

</td>
<td>

跟车\+豆包

</td>
<td>

2

</td>
</tr>
<tr>
<td>

3

</td>
<td>

use\_memory

</td>
<td>

记忆开关

</td>
<td>

boolean

</td>
<td>

\[\&\#34;true\&\#34;,\&\#34;false\&\#34;\]

</td>
<td>

\&\#34;false\&\#34;

</td>
<td>

跟车\+豆包

</td>
<td>

3

</td>
</tr>
<tr>
<td>



</td>
<td>



</td>
<td>



</td>
<td>

boolean

</td>
<td>



</td>
<td>



</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>

~~4~~

</td>
<td>

~~broadcast\_style~~

</td>
<td>

~~播报风格~~

</td>
<td>

~~string~~

enums

</td>
<td>

~~\[\&\#34;甜美\&\#34;,\&\#34;活泼\&\#34;\]~~

</td>
<td>

~~\&\#34;活泼\&\#34;~~

</td>
<td>

~~只跟车~~

</td>
<td>

~~4~~

</td>
</tr>
</tbody></table>

同时支持每个渠道配置不同的默认值，tcc配置示例如下：

```JSON
{
...
    // 某个渠道不配置的话使用系统默认值；
    "master":{
        "use_ai_service":"false",
        "use_static_advisor":"false",
        "use_memory":"false",
    },
    "saic-dna":{
        "use_ai_service":"false",
        "use_static_advisor":"false",
        "use_memory":"false",
    },
    "seres":{
        "use_ai_service":"false",
        "use_static_advisor":"false",
        "use_memory":"false",
    }
...
}
```

AI设置模块提供接口供其他模块查询配置值：

```Go
func UseAIService(ctx context.Context, commonInfo types.CommonInfo) bool {
    return IsConfigEquals(ctx, commonInfo, "use_ai_service", "true")
}

func IsConfigEquals(ctx context.Context, commonInfo types.CommonInfo, configKey, configValue interface{}) bool {
    return GetConfigValue(ctx, configKey) == configValue
}

func GetConfigValue(ctx context.Context, commonInfo types.CommonInfo, configKey) interface{} {
    ...
    // 1.如果数据库有值，用数据库的值；
    // 2.如果数据没有值，用渠道的默认值；
    // 3.如果渠道也没有默认值，用系统的默认值；
    ...
}
 
```

## HTTP接口设计

### 查询配置接口

客户端拉取时机：豆包拉起时或豆包切换时查询，同步更新本地，无网状态下豆包无法拉起不可用，豆包拉起后尝试重新拉取配置直达拉取成功；

GET /aidv/v1/account/config

query：带上通参即可，指定只查询某个配置时增加参数config\_key来指定配置key

body：无

response：

```JSON
{
    "data": {
        "config_items": [
            {
                "config_key": "use_memory",
                "key_label": "记忆开关",
                "value_type": "boolean", // string,int,enum
                "value_options": [
                    "true",
                    "false"
                ],
                "config_value": "true",
                "sort": 1
            },
            {
                "config_key": "broadcast_style",
                "key_label": "播报风格",
                "value_type": "string",
                "value_options": [
                    "甜美",
                    "活泼"
                ],
                "config_value": "甜美",
                "sort": 2
            }
        ]
    },
    "errno": 0,
    "msg": "success"
}
```

### 修改配置接口

触发时机：用户操作时同步配置到云端，无网状态下用户操作失败并提示用户无网，页面开关也停留在之前的状态；

POST /aidv/v1/account/config

query：带上通参即可

body：

```JSON
{
    "config_items":{
        "use_memory":"true", // 只需要上报修改的k-v，上报全量k-v也可以；
        "broadcast_style":"活泼"
    }
}
```

response：

```JSON
{
    "errno": 0,
    "msg": "success"
}
```

## 库表设计

### 配置项定义表

```SQL
CREATE TABLE `vehicle_account_config_key` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `config_key` varchar(100) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '配置key',
  `key_label` varchar(100) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '前端展示配置项的名称',
  `data_type` int NOT NULL DEFAULT '0' COMMENT 'key的数据粒度类型，0:车+豆包，1:豆包，2:车',
  `value_type` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT 'value的值类型:string/number/boolean/select',
  `value_options` varchar(512) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '下拉选项(json格式,如:[])',
  `default_value` varchar(1000) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '默认值',
  `sort` int NOT NULL DEFAULT '0' COMMENT '配置页面展示的排休',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='车辆账号配置表的key定义'
```

### 配置值表

```SQL
CREATE TABLE `vehicle_account_config` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `channel` varchar(64) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '渠道标识',
  `vehicle_id` varchar(256) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '车id',
  `login_doubao_uid` bigint unsigned NOT NULL DEFAULT '0' COMMENT '登录的豆包uid',
  `config_key` varchar(100) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '配置key',
  `config_value` varchar(1000) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '配置value',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_channel_account_id_vehicle_id_config_key` (`channel`,`account_id`,`vehicle_id`,`config_key`)
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='车辆账号配置表'
```

## 

# 技术方案评审会议结论

研发建议采用方案二

**todo项 **@吴仁杰

1. 其他开关是否都上云，这样用户语音操作开关打开的时候planner能更好的执行、回复；

    1. 默认不上云，云端用再上云；仅语音控制也不上云，后期通过事件让planner感知用户操作；

2. 豆包更新、车机更新时客户端数据会丢失，直接恢复出厂设置的效果；产品期望是什么效果，方案二能把云端配置下发给客户端让用户体验更好一点；

3. 无网状态下操作开关，交互如何设计？

    1. ~~交互上，修改开关，直接成功；无网状态下，无法同步给云端，端云不一致，后续端从云拉回；~~

    2. 交互上，修改开关，上云的开关同步云端失败，页面提示用户“无网状态下无法操作”之类的话术；拉起豆包和进入设置页面时客户端从云端拉取配置；

4. ~~可云端动态加开关的这个设计，需要上汽和赛力斯遵循这个设计实现才行，需要同步到车厂研发；不强制；~~




