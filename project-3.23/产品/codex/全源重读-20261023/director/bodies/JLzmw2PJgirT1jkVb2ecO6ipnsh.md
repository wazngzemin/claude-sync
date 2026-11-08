# 账号系统\-云端\-技术评审

# 业务背景

[【PRD】账号系统设计v0\.1](https://bytedance.larkoffice.com/docx/PNpcdKvlGoGYFExWVZJciV91n6e)

- 在座舱云侧建立车上乘客的账号数据，定义座舱云的“用户”，为记忆等模块提供数据支撑

    - 解决一个车有多个乘客、一个乘客有多个豆包账户的场景下如何定义火山座舱“用户”的问题；

    - 解决乘客没有oem账户但是在车内使用豆包功能时，如何在火山注册成一个“用户”的问题；

    - 车机上oem账户与豆包账户的同登同退效果实现；

    - 火山用户的生命周期管理；

# 概要设计

### \&\#34;绑车用户\&\#34;定义

**车主or授权用户**：根据channel、vehicle\_id（车id）、account\_id（oem账户id）、login\_doubao\_uid（豆包账户id）在座舱云生成唯一绑车用户id，任意一个字段变更都会重新生成一个绑车用户id， 同一个豆包账户只能绑定车企一个oem账户；faceID或者声纹ID作为属性支持修改；

**乘客用户**：通过channel、vehicle\_id、faceID在座舱云生成唯一绑车用户id，绑定或者解绑豆包账户，绑车用户id不变，换绑豆包账户，重新生成绑车用户id；faceID作为唯一标识不支持修改；声纹ID作为属性支持后续录入，不支持修改；

### 豆包账号绑定流程

### “绑车用户”豆包绑定状态

### 绑车用户状态

- 可用（记忆模块继续生成记忆数据）：

    - 车主或授权用户豆包绑定状态：已绑定豆包；

    - 乘客用户豆包绑定状态：未绑定、已绑定豆包、已解绑豆包；

- 不可用（记忆模块不再继续生成记忆数据）：

    - 车主或授权用户豆包绑定状态：未绑定、已解绑豆包



### 时序图

车机扫码登录绑定豆包、手机唤醒豆包app授权绑定：

切换oem登录账户时豆包账户跟随切换：

解绑及退登：

# 详细设计

## 数据库设计



车人关系表：

```SQL
CREATE TABLE `vehicle_user` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `channel` varchar(64) NOT NULL COMMENT '渠道标识',
  `channel_app_id` int NOT NULL DEFAULT 0 COMMENT '标识渠道appid', 
  `vehicle_id` varchar(256) NOT NULL DEFAULT '' COMMENT '车辆ID',
  `account_id` varchar(256) NOT NULL DEFAULT '' COMMENT '车企oem用户ID',
  `face_id` varchar(256) NOT NULL DEFAULT '' COMMENT '用户faceID',
  `voiceprint_id` varchar(256) NOT NULL DEFAULT '' COMMENT '用户声纹ID',
  `login_doubao_uid` bigint DEFAULT '0' NOT NULL COMMENT '登录的豆包uid',
  `bind_doubao_status` int NOT NULL DEFAULT 0 COMMENT '豆包账户绑定状态，0:未绑定，1:已绑定，2:解绑冷静期中',
  `status` int NOT NULL DEFAULT 0 COMMENT '用户状态，0:可用，1:不可用',
  `role` int NOT NULL DEFAULT 0 COMMENT '角色，0:车主，1:授权用户，2:乘客',
  `name` varchar(64) NOT NULL DEFAULT '' COMMENT '用户姓名',
~~  `~~~~relation~~~~` int NOT NULL DEFAULT 0 COMMENT '与登录豆包账户关系，0:车主，1:夫妻，2:父亲...',~~
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
   PRIMARY KEY (`id`),
   INDEX idx_channel_account_id_vehicle_id(`channel`,`account_id`,`vehicle_id`),
   INDEX idx_channel_login_doubao_uid(`channel`,`login_doubao_uid`),
   INDEX idx_channel_vehicle_id_face_id(`channel`,`vehicle_id`,`face_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='车人关系表，根据乘客与豆包绑定关系生成唯一用户';

```



绑定记录表：

```SQL
CREATE TABLE `vehicle_user_operation_log` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `channel` varchar(64) NOT NULL COMMENT '渠道标识',
  `channel_app_id` int NOT NULL DEFAULT 0 COMMENT '标识渠道appid', 
  `vehicle_id` varchar(256) NOT NULL DEFAULT '' COMMENT '车辆ID',
  `account_id` varchar(256) NOT NULL DEFAULT '' COMMENT '车企oem用户ID',
  `face_id` varchar(256) NOT NULL DEFAULT '' COMMENT '用户faceID',
  `login_doubao_uid` bigint DEFAULT '0' NOT NULL COMMENT '登录的豆包uid',
  `operation` int NOT NULL DEFAULT 0 COMMENT '0:用户注册并绑定，1:用户单独绑定，2:用户解绑，3:oem注销解绑，4:豆包注销解绑，5:车企强制解绑',
  `source` int NOT NULL DEFAULT 0 COMMENT '0:车机用户中心，1:手机车主app，2:座舱云, 3.车企',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
   PRIMARY KEY (`id`),
   INDEX idx_channel_vehicle_id(`channel`,`vehicle_id`),
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='用户注册绑定操作记录表';
```

设备与车绑定关系表：

```SQL
CREATE TABLE `vehicle_device_relation` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `channel` varchar(64) NOT NULL COMMENT '渠道标识',
  `vehicle_id` varchar(256) NOT NULL DEFAULT '' COMMENT '车辆ID',
  `device_id` bigint NOT NULL DEFAULT 0 COMMENT '车辆设备ID',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
   PRIMARY KEY (`id`),
   INDEX idx_channel_vehicle_id_device_id(`channel`,`vehicle_id`,`device_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='车设备关系表';

```

## 接口设计

### 用户注册（oem调用）

- Method：`POST`

- Path: `/aidv/v1/user/register`

#### 参数

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

channel

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



</td>
</tr>
<tr>
<td>

channel\_app\_id

</td>
<td>

Request query

</td>
<td>

string

</td>
<td>

~~是~~

</td>
<td>



</td>
</tr>
<tr>
<td>

vehicle\_id

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



</td>
</tr>
<tr>
<td>

account\_id

</td>
<td>

Request query

</td>
<td>

string

</td>
<td>

否（车主、授权用户必填）

</td>
<td>

oem账户id

</td>
</tr>
<tr>
<td>

face\_id

</td>
<td>

Body Json

</td>
<td>

string

</td>
<td>

否；（临时用户必填）

</td>
<td>

faceid

</td>
</tr>
<tr>
<td>

voiceprint\_id

</td>
<td>

Body Json

</td>
<td>

string

</td>
<td>

否

</td>
<td>

声纹id

</td>
</tr>
<tr>
<td>

name

</td>
<td>

Body Json

</td>
<td>

string

</td>
<td>

否

</td>
<td>

姓名

</td>
</tr>
<tr>
<td>

role

</td>
<td>

Body Json

</td>
<td>

int

</td>
<td>

是

</td>
<td>

角色，0:车主，1:授权用户，2:乘客

</td>
</tr>
</tbody></table>

#### 请求body示例

```JSON
{
    "face_id": "FACE0001",
    "name": "徐燃",
    "role":1
}
```

#### 响应结构

正确响应示例

```JSON
{
    "data": {
        "success": true
    },
    "errno": 0,
    "msg": "success"
}
```

错误响应示例

```JSON
{
    "errno": 110109,
    "msg": "已绑定其他用户",
    "tips": "发生一些错误,请稍后再试",
    "log_id": "02176302596265000000000000000000000ffff0a5233d65e4872",
    "info": null
}
```

### 用户绑定（豆包incar调用）

- Method：`POST`

- Path: `/aidv/v1/user/bind`

#### 参数

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

channel

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



</td>
</tr>
<tr>
<td>

app\_id

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



</td>
</tr>
<tr>
<td>

channel\_app\_id

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



</td>
</tr>
<tr>
<td>

vehicle\_id

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



</td>
</tr>
<tr>
<td>

account\_id

</td>
<td>

Body Json

</td>
<td>

string

</td>
<td>

否（车主、授权用户必填）

</td>
<td>

oem账户id

</td>
</tr>
<tr>
<td>

face\_id

</td>
<td>

Body Json

</td>
<td>

string

</td>
<td>

否；（临时用户必填）

</td>
<td>

faceid

</td>
</tr>
<tr>
<td>

login\_doubao\_uid

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

声纹id

</td>
</tr>
<tr>
<td>

source

</td>
<td>

Body Json

</td>
<td>

int

</td>
<td>

是

</td>
<td>

0:车机用户中心，1:手机车主app，2:座舱云，3\.车企

</td>
</tr>
</tbody></table>

#### 请求body示例

```JSON
{
    "login_doubao_uid": "12345678",
    "account_id": "12345678",
    "source":0
}
```

#### 响应结构

正确响应示例

```JSON
{
    "data": {
        "success": true
    },
    "errno": 0,
    "msg": "success"
}
```

错误响应示例

```JSON
{
    "errno": 110201,
    "msg": "用户不存在",
    "tips": "发生一些错误,请稍后再试",
    "log_id": "02176308845283700000000000000000000ffff0a5233d65e7710",
    "info": null
}
```

### 用户解绑（oem调用）

- Method：`POST`

- Path: `/aidv/v1/user/unbind`

#### 参数

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

channel

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



</td>
</tr>
<tr>
<td>

channel\_app\_id

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



</td>
</tr>
<tr>
<td>

vehicle\_id

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



</td>
</tr>
<tr>
<td>

account\_id

</td>
<td>

Body Json

</td>
<td>

string

</td>
<td>

否（车主、授权用户必填）

</td>
<td>

oem账户id

</td>
</tr>
<tr>
<td>

face\_id

</td>
<td>

Body Json

</td>
<td>

string

</td>
<td>

否；（临时用户必填）

</td>
<td>

faceid

</td>
</tr>
<tr>
<td>

source

</td>
<td>

Body Json

</td>
<td>

int

</td>
<td>

是

</td>
<td>

0:车机用户中心，1:手机车主app，2:座舱云，3\.车企

</td>
</tr>
</tbody></table>

#### 请求body示例

```JSON
{
    "account_id": "123456789012",
    "source":0
}
```

#### 响应结构

正确响应示例

```JSON
{
    "data": {
        "success": true
    },
    "errno": 0,
    "msg": "success"
}
```

错误响应示例

```JSON
{
    "errno": 110201,
    "msg": "用户不存在",
    "tips": "发生一些错误,请稍后再试",
    "log_id": "02176308845283700000000000000000000ffff0a5233d65e7710",
    "info": null
}
```



### 查询绑定关系（豆包incar调用）

- Method：`GET`

- Path: `/aidv/v1/user/query/relation`

#### 参数

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

channel

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



</td>
</tr>
<tr>
<td>

app\_id

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



</td>
</tr>
<tr>
<td>

channel\_app\_id

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



</td>
</tr>
<tr>
<td>

vehicle\_id

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



</td>
</tr>
<tr>
<td>

account\_id

</td>
<td>

Request query

</td>
<td>

string

</td>
<td>

否（车主、授权用户必填）

</td>
<td>

oem账户id

</td>
</tr>
<tr>
<td>

face\_id

</td>
<td>

Request query

</td>
<td>

string

</td>
<td>

否；（临时用户必填）

</td>
<td>

faceid

</td>
</tr>
</tbody></table>

#### 响应结构

正确响应示例

```JSON
{
    "data": {
        "login_doubao_uid": "xxx"
    },
    "errno": 0,
    "msg": "success"
}
```

错误响应示例

```JSON
{
    "errno": 110201,
    "msg": "用户不存在",
    "tips": "发生一些错误,请稍后再试",
    "log_id": "02176308845283700000000000000000000ffff0a5233d65e7710",
    "info": null
}
```

### 修改用户信息（oem调用）

- Method：`POST`

- Path: `/aidv/v1/user/update`

#### 参数

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

channel

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



</td>
</tr>
<tr>
<td>

channel\_app\_id

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



</td>
</tr>
<tr>
<td>

vehicle\_id

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



</td>
</tr>
<tr>
<td>

account\_id

</td>
<td>

Body Json

</td>
<td>

string

</td>
<td>

否（车主、授权用户必填）

</td>
<td>

oem账户id

</td>
</tr>
<tr>
<td>

face\_id

</td>
<td>

Body Json

</td>
<td>

string

</td>
<td>

否；（临时用户必填）

</td>
<td>

faceid

</td>
</tr>
<tr>
<td>

voiceprint\_id

</td>
<td>

Body Json

</td>
<td>

string

</td>
<td>

否

</td>
<td>

声纹id

</td>
</tr>
</tbody></table>

#### 请求body示例

```JSON
{
    "account_id": "123456789012",
    "face_id": "aaa",
    "voiceprint_id":"bbb"
}
```

#### 响应结构

正确响应示例

```JSON
{
    "data": {
        "success": true
    },
    "errno": 0,
    "msg": "success"
}
```

错误响应示例

```JSON
{
    "errno": 110201,
    "msg": "用户不存在",
    "tips": "发生一些错误,请稍后再试",
    "log_id": "02176308845283700000000000000000000ffff0a5233d65e7710",
    "info": null
}
```

### 注销用户（oem调用，清空单个用户数据，oem账户注销场景）

- Method：`POST`

- Path: `/aidv/v1/user/unregister`

#### 参数

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

channel

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



</td>
</tr>
<tr>
<td>

channel\_app\_id

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



</td>
</tr>
<tr>
<td>

vehicle\_id

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



</td>
</tr>
<tr>
<td>

account\_id

</td>
<td>

Body Json

</td>
<td>

string

</td>
<td>

否（车主、授权用户必填）

</td>
<td>

oem账户id

</td>
</tr>
<tr>
<td>

face\_id

</td>
<td>

Body Json

</td>
<td>

string

</td>
<td>

否；（临时用户必填）

</td>
<td>

faceid

</td>
</tr>
<tr>
<td>

source

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

0:车机用户中心，1:手机车主app，2:座舱云，3\.车企

</td>
</tr>
</tbody></table>

#### 请求body示例

```JSON
{
    "account_id": "123456789012",
    "source":1
}
```

#### 响应结构

正确响应示例

```JSON
{
    "data": {
        "success": true
    },
    "errno": 0,
    "msg": "success"
}
```

错误响应示例

```JSON
{
    "errno": 110201,
    "msg": "用户不存在",
    "tips": "发生一些错误,请稍后再试",
    "log_id": "02176308845283700000000000000000000ffff0a5233d65e7710",
    "info": null
}
```

### 注销车辆（oem调用，清空所有用户数据；车辆售卖等场景）

- Method：`POST`

- Path: `/aidv/v1/vehicle/unregister`

#### 参数

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

channel

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



</td>
</tr>
<tr>
<td>

channel\_app\_id

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



</td>
</tr>
<tr>
<td>

vehicle\_id

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



</td>
</tr>
<tr>
<td>

source

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

0:车机用户中心，1:手机车主app，2:座舱云，3\.车企

</td>
</tr>
</tbody></table>

#### 请求body示例

```JSON
{
    "source":1
}
```

#### 响应结构

正确响应示例

```JSON
{
    "data": {
        "success": true
    },
    "errno": 0,
    "msg": "success"
}
```

错误响应示例

```JSON
{
    "errno": 110201,
    "msg": "用户不存在",
    "tips": "发生一些错误,请稍后再试",
    "log_id": "02176308845283700000000000000000000ffff0a5233d65e7710",
    "info": null
}
```



## 3\.3 frontier消息

1\.用户解绑、注销或者车辆注销时，通知客户端退出该用户的豆包账户

```JSON
method=2
 消息体：
 {
     "message_type": 1, // 1是用户业务下的用户退登消息类型
     "message":"{\"login_doubao_uid\":123456}"
 } 
```

# 被依赖项

### 事件日志

- 案例：事件日志想记录车里有哪些乘客

    - 方案1：用端状态上报的乘客位置、姓名、faceID数据，通过face\_id来查询火山用户；

        ```Plain Text
        [
            {
                "face_id": "0001",
                "name": "徐燃"，
                "position": "主驾"
            },
            {
                "face_id": "0002",
                "name": "宝宝"，
                "position": "副驾"
            }
        ]
        
        ```

    - 方案2：~~用火山用户id，端侧保存火山用户id数据~~

        ```JSON
        ~~{~~
        ~~    "users":["user_id1", "user_id2", "user_id3"]~~
        ~~}~~
        ```

    - 考虑因素

        - 手机的车主app可操作豆包账户绑定、解绑，座舱云端拿到数据更新数据库；如果座舱客户端侧保存火山用户id的话，该数据可能因为用户在手机侧操作而失效（虽然可以通过某些机制让座舱客户端同步到最新火山用户id，但是同步时间差里端侧用的仍是失效的火山用户id）

        - 火山用户id是云端维护的逻辑，端侧最好不感知，避免后续云端逻辑调整端侧不兼容；

### 客户端

- 端云接口交互规范：端侧标识唯一用户时，使用channel\+vehicle\_id\+account\_id，或者channel\+vehicle\_id\+face\_id，云端能匹配到唯一可用的火山用户id



# 部分测试case

- 绑定豆包账户

    - case1:

        - 绑定豆包账户时，如果这个豆包账户被同渠道下其他oem账户绑定过则报错“该豆包账户已绑定其他用户”；

        - 绑定豆包账户时，如果这个豆包账户被这个oem账户在同渠道其他车上绑定过，不报错，可以继续绑定；

- 注册用户

    - case1:

        - 车主账户注册并录入过faceId，再去后排，理论上能识别到是车主，不会触发注册；未识别出来，作为乘客注册时，录入face会生成新的faceID；（如果是同一个faceID服务会报错该faceID已绑定其他用户）








