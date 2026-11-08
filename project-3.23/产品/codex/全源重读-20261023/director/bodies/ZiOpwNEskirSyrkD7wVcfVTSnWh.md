# 账号技术方案评审\-V2

# 背景

产品需求文档：[【上汽DNA】AI汽车账号方案v2](https://bytedance.larkoffice.com/wiki/A3hGwU4YcioskxkDZgRcHbUUnmh)

本次需求基于我们从豆包的三方应用变成了一方应用，豆包数据都需要挂在豆包id下，所以去掉了火山账号的设计，同时完善了未登录oem账号和豆包账号时的权限限制设计；faceID包含语音注册流程和家庭组同步流程，分别见[DNA\-Faceid工具需求](https://bytedance.larkoffice.com/wiki/VdCSwX6pfi6gD2kou48coXFdnQb)和上一版技术方案[账号v2技术方案](https://bytedance.larkoffice.com/wiki/Tse5wsZOjiPTTUkNiQHc33pXn5b)中的家庭组同步技术方案，本次技术方案主要涉及账号登录、退登、注销和权限相关内容；

# 关键流程

## 登录态维护

云端维护oem账号在某个车上登录的某个豆包账号的状态信息，也包括oem账号对于该车辆的角色信息；在登录豆包、退登豆包、切换豆包账号时，客户端调用云端接口同步豆包登录态数据，为了保证端云数据一致，客户端必须确保云端响应成功再更新客户端的登录态；一个车只能有一个豆包是“登录到前台”，其它“登录到前台”的豆包全部切换成“登录到后台”

1. 登录：oem账号account\_002登录豆包时，云端会把该车辆其它oem账号的豆包状态记录登录到后台

<table><tbody>
<tr>
<td>

channel

</td>
<td>

vehicle\_id

</td>
<td>

account\_id

</td>
<td>

login\_doubao\_uid

</td>
<td>

doubao\_status

</td>
<td>

~~account\_status~~

</td>
<td>

account\_role

</td>
</tr>
<tr>
<td>

saic\-dna

</td>
<td>

vehicle\_001

</td>
<td>

account\_001

</td>
<td>

1554025076232211

</td>
<td>

2（登录到后台）

</td>
<td>

1（有效）

</td>
<td>

1（车主）

</td>
</tr>
<tr>
<td>

saic\-dna

</td>
<td>

vehicle\_001

</td>
<td>

account\_002

</td>
<td>

4179706664473114

</td>
<td>

1（登录到前台）

</td>
<td>

1（有效）

</td>
<td>

2（授权用户）

</td>
</tr>
</tbody></table>

2. 退登oem账号account\_002：

<table><tbody>
<tr>
<td>

channel

</td>
<td>

vehicle\_id

</td>
<td>

account\_id

</td>
<td>

login\_doubao\_uid

</td>
<td>

doubao\_status

</td>
<td>

~~account\_status~~

</td>
<td>

account\_role

</td>
</tr>
<tr>
<td>

saic\-dna

</td>
<td>

vehicle\_001

</td>
<td>

account\_001

</td>
<td>

1554025076232211

</td>
<td>

2（登录到后台）

</td>
<td>

1（有效）

</td>
<td>

1（车主）

</td>
</tr>
<tr>
<td>

saic\-dna

</td>
<td>

vehicle\_001

</td>
<td>

account\_002

</td>
<td>

4179706664473114

</td>
<td>

0（退登）

</td>
<td>

1（有效）

</td>
<td>

2（授权用户）

</td>
</tr>
</tbody></table>

3. 切换登录态，oem账号切换到account\_001

<table><tbody>
<tr>
<td>

channel

</td>
<td>

vehicle\_id

</td>
<td>

account\_id

</td>
<td>

login\_doubao\_uid

</td>
<td>

doubao\_status

</td>
<td>

~~account\_status~~

</td>
<td>

account\_role

</td>
</tr>
<tr>
<td>

saic\-dna

</td>
<td>

vehicle\_001

</td>
<td>

account\_001

</td>
<td>

1554025076232211

</td>
<td>

1（登录到前台）

</td>
<td>

1（有效）

</td>
<td>

1（车主）

</td>
</tr>
<tr>
<td>

saic\-dna

</td>
<td>

vehicle\_001

</td>
<td>

account\_002

</td>
<td>

4179706664473114

</td>
<td>

0（退登）

</td>
<td>

1（有效）

</td>
<td>

2（授权用户）

</td>
</tr>
</tbody></table>

4. oem账号人车解绑或注销时，该条登录态数据记录account\_status改为“失效”，后续如果有该vehicle\_id\+oem账号\+豆包账号的请求时，~~账号处理的入口代码~~~~会发送frontier消息通知~~~~客户端操作该oem账号退登豆包~~；

<table><tbody>
<tr>
<td>

channel

</td>
<td>

vehicle\_id

</td>
<td>

account\_id

</td>
<td>

login\_doubao\_uid

</td>
<td>

doubao\_status

</td>
<td>

~~account\_status~~

</td>
<td>

account\_role

</td>
</tr>
<tr>
<td>

saic\-dna

</td>
<td>

vehicle\_001

</td>
<td>

account\_001

</td>
<td>

1554025076232211

</td>
<td>

1（登录到前台）

</td>
<td>

0（失效）

</td>
<td>

1（车主）

</td>
</tr>
<tr>
<td>

saic\-dna

</td>
<td>

vehicle\_001

</td>
<td>

account\_002

</td>
<td>

4179706664473114

</td>
<td>

0（退登）

</td>
<td>

1（有效）

</td>
<td>

2（授权用户）

</td>
</tr>
</tbody></table>

## 权限校验\+语音邀请登录

### agent权限限制

权限配置：先临时tcc配置每个agent的权限，见[账号技术方案评审\-0617](https://bytedance.larkoffice.com/wiki/ZiOpwNEskirSyrkD7wVcfVTSnWh#share-Z2SzdM4VVoxr2txVLxocxldAn8g)，后期agent\-server页面管理该配置；

“账号权限”功能，封装上下电、10轮、行驶状态等逻辑，在agent执行前介入，返回鉴权结果（是否通过、不通过提示语，并发送客户端弹窗的frontier消息）邀请用户登录oem和豆包；

豆包登录弹窗，用户可以点击“不再提醒”，客户端上报云端该配置后，云端不再触发提醒用户登录，用户query都静默处理；下次重新上电后会恢复提醒功能；



agent执行前处理账号权限的入口：

### 其它非agent类限制

1. ~~闲聊限制十轮：没登录豆包的请求，将请求轮次存储在redis，上下电触发重置，超过10轮不再走到planner直接给用户返回“需登录豆包”，将判断前置到预处理、拒识之前，尽量节省算力；~~

2. 没有faceID限制使用记忆功能：记忆模块单独校验处理；

## 人车解绑、账号注销

1. oem账号解绑车辆，车企云端通知火山云端：

    1. faceID乘客、~~记忆数据~~清理；（低优待定）

    2. 该车辆、oem账号的登录态数据置为失效，~~并下发一次frontier消息通知端该车辆的oem账号退登豆包；~~在下次车辆联网（frontier建连）时下发一次豆包退登（oemID \+ doubaoUID）；   

2. oem账号注销，车企云端通知火山云端：

    1. faceID乘客、~~记忆数据~~清理；（低优待定）

    2. 所有车辆上的oem账号的登录态数据置为失效，对应每台记录的车辆都下发一次frontier消息通知端该车辆的oem账号退登豆包，后续有query进来也校验oem状态；

3. 豆包账号注销

    1. 车辆豆包incar客户端自动感知并退登豆包，同步登录态数据到云端；

    2. 云端收到豆包的注销消息，操作豆包数据清理；（低优待定）

## 乘客记忆隔离豆包

概念：记忆用户

定义：乘客（channel \+ vehicle\_id \+ face\_id \+ oem\_id ）\+ login\_doubao\_uid；

创建时间：

- faceID乘客注册：在当前豆包账号下注册记忆用户；

- 豆包登录：查询当前oem账号下所有可见的乘客，在当前豆包账号下注册记忆用户；

# 接口定义

## 端\-火山云接口

1. 登录态数据同步

接口逻辑：新增或更新车辆、oem账号、豆包账号的登录状态数据记忆oem账号对于该车辆的角色；

Method : Post

Url : /aidv/v1/account/login\_status

param：channel、vehicle\_id、vehicle\_type必填

Body: 

```JSON
{
~~    "channel":"saic-dna",      //放在query里~~
~~    "vehicle_id":"vehicle_001",    //放在query里~~
~~    "vehicle_type":"d6x",//放在query里 必填；~~
    "account_list":[
        {
            "account_id":"account_001",
            "login_doubao_uid":"23423423424234",
            "status":1, // 0:退登，1:登录到前台，2:登录到后台',  
            "role": 1 // 1:车主，2:授权用户，3:游客
        },
        {
            "account_id":"account_002",
            "login_doubao_uid":"7657352424234",
            "status":2, // 0:退登，1:登录到前台，2:登录到后台', 
            "role": 2 // 1:车主，2:授权用户，3:游客
        }
    ]
}
```

## 车厂云\-火山云

1. oem账号注销接口（to车厂云）

    接口逻辑：通知所有车辆上该oem登录的豆包退登，清理账号下的乘客和记忆数据；

    Method : Post

    Url : /aidv/v1/account/unregister

    Body: 

    ```JSON
    {
        "channel":"master",
        "account_id":"12312312312321",  // 车厂云提供的oem账号id需要与车机上给火山客户端的一致；
    }
    ```

2. oem解绑车辆接口（to车厂云）

    接口逻辑：通知指定车辆上该oem登录的豆包退登，清理账号下的乘客和记忆数据；

    Method : Post

    Url : /aidv/v1/account/unbind

    Body: 

    ```JSON
    {
        "channel":"saic-dna",
        "account_id":"12312312312321", // 车厂云提供的oem账号id需要与车机上给火山客户端的一致；
        "vehicle_id":"sfi234234", // 车厂云提供的车辆id需要与车机上给火山客户端的一致；
    }
    ```

# 下游依赖

1. http和豆包IM链路公参校验，account\_id改必填，login\_doubao\_uid非必填（长时任务、context查询）；

2. 各业务数据隔离粒度：暂不设计“火山账号”的概念，各业务按需自己使用account\_id、login\_doubao\_uid；

    1. 乘客、记忆：channel \+ vehicle\_id \+ account\_id \+ face\_id；

    2. 长时任务：channel \+ vehicle\_id \+ login\_doubao\_uid（1\.增加加密豆包uid字段给弋途使用，2\.弋途兼容，3\.字节后续去掉login\_doubao\_uid）

    3. 个性化skill：channel \+ vehicle\_id 

    4. 记忆开关：目前是channel \+ account\_id，后续改channel \+ vehicle\_id 

3. 登录、退登事件监听

    1. 弋途监听豆包账号退登事件，结束长时任务，停止advisor下发；

4. 车辆id查询device\_id

    1. 非客户端请求触发的链路，如何获取device\_id？在上电的端状态上报的请求里，保存channel \+ vehicle\_id 对device\_id的映射关系；

5. 模拟器注册流程需要调整，没有注册“火山账号”的流程了，同时需要增加模拟“登录”的功能来同步登录状态给服务端；



# 库表设计

```SQL
create table vehicle_account_info
(
    id               bigint unsigned auto_increment comment '主键ID'
    channel          varchar(64)     default ''                not null comment '渠道标识',
    vehicle_id       varchar(256)    default ''                not null comment '车辆ID',
    account_id       varchar(256)    default ''                not null comment '车企oem用户ID',
    role             int             default 0                 not null comment '角色，1:车主，2:授权用户，3:游客',
    login_doubao_uid bigint unsigned default '0'               not null comment '登录的豆包uid',
    status           int             default 0                 not null comment '类型，0:退登，1:登录到前台，2:登录到后台',
    created_at       datetime        default CURRENT_TIMESTAMP not null comment '创建时间',
    updated_at       datetime                                  not null on update CURRENT_TIMESTAMP comment '更新时间',
    deleted_at       datetime                                  null comment '删除时间',
    PRIMARY KEY (`id`), 
    UNIQUE KEY `uniq_channel_vehicle_id_account_id` (`channel`, `vehicle_id`, `account_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci comment '车辆上的账号信息表，如角色、登录状态等';
```

```SQL
create table vehicle_user
(
    `id`                 bigint unsigned auto_increment comment '主键ID',
    `channel`            varchar(64)  default ''                not null comment '渠道标识',
    `vehicle_id`         varchar(256) default ''                not null comment '车辆ID',
    `account_id`         varchar(256) default ''                not null comment '车企oem用户ID',
    `face_id`            varchar(256) default ''                not null comment '用户faceID',
    `voiceprint_id`      varchar(256) default ''                not null comment '用户声纹ID',
    `user_type`          int          default 0                 not null comment '用户类型，0:语音注册乘客，1:oem账号乘客，2:家庭组普通乘客',
    `is_group_member`    int          default 0                 not null comment '是否家庭组成员，0:不是，1:是',    
    `name`               varchar(64)  default ''                not null comment '用户姓名',
    `relation`           varchar(64)  default ''                not null comment '跟账号拥有者的关系',
    `last_in_car_time`   datetime     default CURRENT_TIMESTAMP not null comment '上次上车时间',
    `created_at`         datetime     default CURRENT_TIMESTAMP not null comment '创建时间',
    `updated_at`         datetime                               not null on update CURRENT_TIMESTAMP comment '更新时间',
    `deleted_at`         datetime                               null comment '删除时间',
    PRIMARY KEY (`id`), 
    key `idx_channel_vehicle_id_face_id` (`channel`, `vehicle_id`, `face_id`),
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci comment '乘客表，根据faceID或者声纹id注册的乘客';
```

```SQL
create table vehicle_info
(
    `id`                 bigint unsigned auto_increment comment '主键ID',
    `channel`            varchar(64)  default ''                not null comment '渠道标识',
    `vehicle_id`         varchar(256) default ''                not null comment '车辆ID',
    `device_id`          bigint unsigned default 0              not null comment 'device_id',
    `created_at`         datetime     default CURRENT_TIMESTAMP not null comment '创建时间',
    `updated_at`         datetime                               not null on update CURRENT_TIMESTAMP comment '更新时间',
    `deleted_at`         datetime                               null comment '删除时间',
    PRIMARY KEY (`id`), 
    key `idx_channel_vehicle_id_device_id` (`channel`, `vehicle_id`, `device_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci comment '车辆信息表';
```

```SQL
create table memory_user
(
    `id`                 bigint unsigned auto_increment comment '主键ID',
    `channel`            varchar(64)  default ''                not null comment '渠道标识',
    
    `login_doubao_uid`     bigint unsigned default '0'               not null comment '登录的豆包uid',
    `vehicle_user_id`    bigint unsigned default '0' not null comment '乘客id',
    
    `created_at`         datetime     default CURRENT_TIMESTAMP not null comment '创建时间',
    `updated_at`         datetime                               not null on update CURRENT_TIMESTAMP comment '更新时间',
    `deleted_at`         datetime                               null comment '删除时间',
    PRIMARY KEY (`id`), 
    key `idx_vehicle_user_id_login_doubao_uid` (`vehicle_user_id`, `login_doubao_uid`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci comment '车辆记忆用户表，按照乘客+豆包账号生成';
```

# TCC配置

1. agent权限配置；后续通过agent管理读取 @吴仁杰

    1. 需要有个新增的工具的默认配置；

    ```JSON
    {
        ...
        "channel_agent_permission":{
            "saic-dna": {
                "operate_user_memory":{
                    "need_auth_oem":"true"
                },
                "face_id_register":{
                    "need_auth_oem":"true"
                }
            },
            "default": {
                "operate_user_memory":{
                    "need_auth_oem":"true"
                },
                "face_id_register":{
                    "need_auth_oem":"true"
                }
            }
        }
        ...
    }
    ```

# frontier消息定义

全量定义详见[frontier的method枚举及消息格式](https://bytedance.larkoffice.com/wiki/Efp5wV5Wxiv1ZpkbKKjc1sbvnye)

账号业务使用method=2

1. 邀请oem账号登录，message\_type=4

    ```JSON
    {
         "account_type":"oem"
    }
    ```

2. 邀请豆包账号登录，message\_type=4

    ```JSON
    {
         "account_type":"doubao"
    }
    ```

3. ~~触发oem账号退登豆包，message\_type=1~~

    ```JSON
    ~~{~~
    ~~    "account_id":"account_001"~~
    ~~    "login_doubao_uid":123456~~
    ~~}~~
    ```




