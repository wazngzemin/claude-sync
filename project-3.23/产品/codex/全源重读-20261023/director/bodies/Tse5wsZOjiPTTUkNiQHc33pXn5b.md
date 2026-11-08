# 账号v1技术方案

# 业务背景

AI汽车主线的账号、乘客的概念完善，同时支持上汽关于FamilyList的定制需求；因赛力斯的需求还处于沟通中，先按照上汽这版交付进行设计开发；[AI汽车账号方案](https://bytedance.larkoffice.com/wiki/A3hGwU4YcioskxkDZgRcHbUUnmh)



# 概念解释

<table><tbody>
<tr>
<td>

概念

</td>
<td>

生成规则

</td>
<td>

下游依赖

</td>
</tr>
<tr>
<td>

~~火山账号~~

</td>
<td>

~~channel \+ oem\_uid~~

</td>
<td>

~~长时任务：使用时加上vehicle\_id~~

</td>
</tr>
<tr>
<td>

乘客

</td>
<td>

channel \+ oem\_uid \+ vehicle\_id \+ face\_id

</td>
<td>

记忆

</td>
</tr>
<tr>
<td>

豆包登录态

</td>
<td>

channel \+ ome\_uid \+ vehicle\_id \+ doubao\_uid

</td>
<td>

暂无

</td>
</tr>
</tbody></table>

# 流程图

## 登录、退登、换登和注销流程 @徐燃@姜锋

## faceID注册、同步、删除流程 @徐燃@郭金龙

# 库表设计

## 火山账号表

```SQL
create table account
(
    `id`                 bigint unsigned auto_increment comment '主键ID',
    `channel`            varchar(64)  default ''                not null comment '渠道标识',
    `account_id`         varchar(256) default ''                not null comment '车企oem用户ID',
    `created_at`         datetime     default CURRENT_TIMESTAMP not null comment '创建时间',
    `updated_at`         datetime                               not null on update CURRENT_TIMESTAMP comment '更新时间',
    `deleted_at`         datetime                               null comment '删除时间',
    PRIMARY KEY (`id`), 
    key `idx_channel_account_id` (`channel`, `account_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci comment '账号表，根据channel加oem账号维护AI汽车的账号';
```

## 车辆账号信息表

```SQL
create table vehicle_account_info
(
    `id`                 bigint unsigned auto_increment comment '主键ID',
    `channel`            varchar(64)  default ''                not null comment '渠道标识',
    `vehicle_id`         varchar(256) default ''                not null comment '车辆ID',
    `account_id`         varchar(256) default ''                not null comment '车企oem用户ID',
    `role`               int          default 0                 not null comment '// 角色，0：无角色（本地账号），1：车主，2：授权用，3:游客',
    `login_doubao_uid`   varchar(256) default ''                not null comment '用户faceID',
    `status`             int          default 0                 not null comment '类型，0:退登，1:登录到前台，2:登录到后台',  
    `created_at`         datetime     default CURRENT_TIMESTAMP not null comment '创建时间',
    `updated_at`         datetime                               not null on update CURRENT_TIMESTAMP comment '更新时间',
    `deleted_at`         datetime                               null comment '删除时间',
    PRIMARY KEY (`id`), 
    UNIQUE KEY `uniq_channel_account_id_vehicle_id` (`channel`, `account_id`,`vehicle_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci comment '车辆与账号的信息表，如角色、登录状态等';

```

## 乘客表

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

# 接口设计

## 服务端接口

### 火山uid账号注册接口（toSDK）

接口逻辑：如果oem\_uid没有注册过火山账号，就注册一个，车主角色只能有一个；

Method : Post

Url : /aidv/v1/account/register

Body: 

```JSON
{
    "channel":"master",               //放在query里也可以
    "account_id":"12312312312321",    //放在query里也可以
    "vehicle_id":"xuran",             //放在query里也可以
    "role":0                          // 角色，0：无角色（本地账号），1：车主，2：授权用户，3：游客
}
```

### 豆包登录状态同步接口（toSDK）

接口逻辑：新增或更新账号、车辆、豆包、状态数据；

Method : Post

Url : /aidv/v1/account/login\_status

Body: 

```JSON
{
    "channel":"master",      //放在query里也可以
    "vehicle_id":"xuran",    //放在query里也可以
    "account_list":[
        {
            "account_id":"12312312312321",
            "login_doubao_uid":23423423424234,
            "status":1 // '类型，0:退登，1:登录到前台，2:登录到后台',   
        },
        {
            "account_id":"453g3453453f343",
            "login_doubao_uid":7657352424234,
            "status":2 // '类型，0:退登，1:登录到前台，2:登录到后台',   
        }
    ]
}
```

### oem账号注销接口（to车厂云）

接口逻辑：账号、乘客数据清理；

Method : Post

Url : /aidv/v1/account/unregister

Body: 

```JSON
{
    "channel":"master",
    "account_id":"12312312312321",    
}
```

### oem解绑车辆接口（to车厂云）

接口逻辑：乘客数据清理；

Method : Post

Url : /aidv/v1/account/unbind

Body: 

```JSON
{
    "channel":"master",
    "account_id":"12312312312321",
    "vehicle_id":"sfi234234",
}
```

逻辑：oem账户不注销，处理oem\_uid\+vehicle\_id下的乘客注销；通知车辆上oem登录的豆包退登；

### faceID上报，走端状态上报接口（toSDK）

### [AIDV端状态相关接口](https://bytedance.larkoffice.com/docx/Dwhqdquu1oLas3xQmy8c7lwanJp)

### 全量faceID同步接口（toSDK）

逻辑：

- 车厂的faceID比我的多，不能删，入库保存乘客（占用家庭组槽位，下次家庭组同步时删除）

- 车厂的faceID比我的少，少的是家庭组乘客则不删，少的是语音乘客则删除我们的语音乘客；

- tcc配置每个车厂是否限制faceID槽位个数、具体个数值；

Method : Post

Url : /aidv/v1/user/sync\_faceid

Query：  依赖channel、account\_id、vehicle\_id

Body: 

```JSON
{
    "face_ids":["123","145","167"]      
}
```

### 家庭组数据同步接口（toSDK）

接口逻辑：新建或者更新familyList乘客信息；要求接口同步来的是全量数据便于做删除判断；

- 家庭组信息同步时与语音注册的乘客信息冲突时的逻辑

    1. faceID相同，不管其他属性是否相同，直接用同步来的数据覆盖数据库里的数据；

    2. faceID不同，名字相同；删除语音的，注册family list的；

Method : Post

Url : /aidv/v1/user/sync\_group

Query：  依赖channel、account\_id、vehicle\_id

Body: 

```JSON
{
    "members":[
        {
            "account_id":"as332d",
            "role":1, // 角色，0:无，1：车主，2:授权用户
            "is_group_member": true, // 是否家庭组成员
            "face_id":"123",
            "name":"老板"
        },
        {
            "account_id":"as234f",
            "role":0, // 角色，0:无，1：车主，2:授权用户
            "is_group_member": false, // 是否家庭组成员
            "face_id":"129",
            "name":"宝宝"
        }
    ]
}
```

## 服务下发给豆包SDK的frontier消息

1. faceID持久化、删除 @郭金龙@徐燃

Method=2 （账号业务）, MessageType=2 （faceID同步子业务）

```JSON
{
    "save_face_ids":["102"],
    "delete_face_ids":["101"]
}
```

~~客户端需要回复确认的消息（服务端确认faceID保存成功再操作乘客注册）~~上汽接口没法同步返回执行结果；

```JSON
~~{~~
~~    "status":"succeed" // succeed：更新成功，failed：更新失败~~
~~}~~
```

2. 触发客户端的faceID注册；

Method=2 （账号业务）, MessageType=3 （触发faceID识别、注册）

```JSON
{
    "position":"主驾"
}
```

## 车厂调用豆包SDK接口

oem账号登录、退登、切换接口 @姜锋

家庭组数据同步接口 @姜锋

全量faceID同步接口 @郭金龙

faceID上报接口 @郭金龙

## 豆包SDK调用车厂接口

faceID持久化接口 @郭金龙

faceID删除接口 @郭金龙



# 下游依赖调整

## ai汽车工程代码中间件适配 @徐燃

http接口公参删除login\_doubao\_uid，有依赖的业务都要去掉该依赖；

抽象火山uid的“账户”和乘客的“用户”概念，加上豆包登录状态，放在context中，便于长时任务使用账户信息、记忆使用用户以及后续的权限管理使用账户和豆包登录态信息（每个tool、agent执行前检查权限）；

## 长时任务 @徐燃

之前给弋途的是channel\+vehicle\_id\+login\_doubao\_uid去生成任务，需要改用channel \+ vehicle\_id \+ 火山uid，或者channel \+ vehicle\_id \+ oem\_uid

oem退登or豆包退登，长时任务是否需要都结束掉？

## 模拟器 @刘杨

火山uid账户\+乘客概念





# Todo待定 @吴仁杰

1. oem注销及oem账户解绑车辆后如何触发豆包退登？

    1. oem云\-\&gt;火山云\-\&gt;frontier消息让客户端退登豆包\-\&gt;车机豆包通知云端已退登

    2. 车机oem退登\-\&gt;车机豆包退登\-\&gt;车机豆包通知云端已退登，讨论with上汽（避免oem退登 豆包退登 时间不一致，影响使用，oem注销相关的逻辑统一由oem退登来触发豆包退登）

2. 家庭组信息同步需要是全量同步，讨论with上汽











