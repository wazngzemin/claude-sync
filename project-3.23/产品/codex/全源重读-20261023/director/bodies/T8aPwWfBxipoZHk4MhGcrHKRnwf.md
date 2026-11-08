# 上汽DN 车控动态参数 \- 技术方案

### 需求背景

上汽DNA项目针对应用允许用户在应用市场自行下载，座椅记忆位置、用车习惯允许用户自定义名称。

需要车控**支持用户维度自定义的参数值提槽能力**。

[上汽DNA1\.0车控动态参数需求](https://bytedance.larkoffice.com/docx/LDigdAaPaox4o5xBaHlcofmlnfe)

\[Meego Title: \[需求\]【DNA1\.0】车控支持用户自定义的动态参数 Meego URL: [https://meego.larkoffice.com/telematics/story/detail/7342477670?super_app=1&open_type=open_in_page&target_width=700&min_width=550&is_nearest_order=1]()\]()

### model定义

```Go
type DynamicVehicleControl struct {
    FuncCode string `json:"func_code"  vd:"hasValue($);msg:'func_code不能为空'"`
    Params string `json:"params"  vd:"hasValue($);msg:'params不能为空'"`
    Values string `json:"values"` // 多个参数使用英文分拼接 "腾讯视频,qq音乐"
}

type DynamicVehicleControlRequest struct {
    List []DynamicVehicleControl `json:"list" vd:"hasValue($);msg:'dynamic_vehicle_control不能为空'"`
}

```

```SQL
CREATE TABLE `dynamic_vehicle_control`
(
    `id`            bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `channel`       varchar(64)   NOT NULL DEFAULT '' COMMENT '渠道',
    `vehicle_type`  varchar(64)   NOT NULL DEFAULT '' COMMENT '车型',
    `vehicle_id`    varchar(128)  NOT NULL DEFAULT '' COMMENT '车辆ID',
    `function_code` varchar(128)  NOT NULL DEFAULT '' COMMENT '功能编码',
    `params`        varchar(255)  NOT NULL DEFAULT '' COMMENT '参数名',
    `value_list`    varchar(1024) NOT NULL DEFAULT '' COMMENT '支持的参数值列表，多个用英文分号分隔',
    `report_log_id` varchar(128)  NOT NULL DEFAULT '' COMMENT '上报日志ID',
    `created_at`    datetime      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at`    datetime      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间（自动更新）',
    `deleted_at`    date                   DEFAULT NULL COMMENT '删除时间（软删除）',
    PRIMARY KEY (`id`),
    KEY             `idx_channel_vehicle_vehicle_type` (`channel`,`vehicle_id`, `vehicle_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='车控动态车辆控制参数表';
```

```Shell
**上汽个性化词典和FC+参数的对应关系：**
<APP名称> 指定应用开关，app
<自定义场景名> 指定模式开关，mode
<位置1> 座椅记忆保存，value
<位置1> 座椅一键复位开关，value
<用车习惯1> 驾驶习惯设置，mode
<联系人> 拨打电话，name
```

### 接口定义

Method: POST

Path: \&\#34;/aidv/v1/report/dynamic\_vehicle\_control\&\#34;

请求参数

通参\&amp;鉴权: [公版\-AI汽车接口访问指南](https://bytedance.larkoffice.com/docx/OZjjdzEldo3J1pxXQ0OcW5Ugn5d#share-LcsWdnoPQonHbCx4xMTcSkqPnde)

<table><tbody>
<tr>
<td>

参数名

</td>
<td>

类型

</td>
<td>

是否必传

</td>
<td>

描述

</td>
</tr>
<tr>
<td>

list

</td>
<td>

arr

</td>
<td>

是

</td>
<td>

需要传入的动态参数列表

</td>
</tr>
<tr>
<td>

list\.func\_code

</td>
<td>

string

</td>
<td>

是

</td>
<td>

Fc 名称

</td>
</tr>
<tr>
<td>

list\.params

</td>
<td>

string

</td>
<td>

是

</td>
<td>

影响的fc参数

</td>
</tr>
<tr>
<td>

list\.values

</td>
<td>

string

</td>
<td>

否

</td>
<td>

Fc 参数列表

</td>
</tr>
</tbody></table>



请求示例

```JSON
{
    "list": [
        {
            "func_code": "指定应用开关",
            "params": "app",
            "values": "蓝牙电话,360,个人中心" // 多个参数用英文 "," 拼接
        }
        ...
    ]
}
```

返回

```JSON
{
    "data": {
        "success": true
    },
    "errno": 0,
    "msg": "success"
}
```



### 流程定义





### 测试重点





### 上线步骤

### 


