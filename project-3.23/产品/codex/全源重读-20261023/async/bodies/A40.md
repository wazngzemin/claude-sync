# 【触发器支持生产事件日志】服务端技术方案

# 需求背景

## 需求简介

<table><tbody>
<tr>
<td>

**需求类型**

</td>
<td>

**产品需求**

</td>
</tr>
<tr>
<td>

Meego链接

</td>
<td>

[\[需求\]【AIVA\-context】端状态接入事件日志](https://meego.larkoffice.com/telematics/story/detail/7357021568)

</td>
</tr>
<tr>
<td>

PRD链接

</td>
<td>

[座舱AI编排引擎需求文档](https://bytedance.larkoffice.com/docx/IPOldxmWloNCITxtVnXcZBGAnfc#share-NAcadHIMCoMZVNxUekicNuD6nUf)

</td>
</tr>
<tr>
<td>

PM

</td>
<td>

@韩杰

</td>
</tr>
<tr>
<td>

研发Owner

</td>
<td>

@刘杨@尹振刚

</td>
</tr>
<tr>
<td>

需求群

</td>
<td>

</td>
</tr>
</tbody></table>

## 需求合作方

<table><tbody>
<tr>
<td>

**合作方**

</td>
<td>

**接口人**

</td>
<td>

**技术方案文档**

</td>
</tr>
<tr>
<td>

事件服务

</td>
<td>

@徐燃

</td>
<td>

[事件日志的生产与使用\-技术方案](https://bytedance.larkoffice.com/wiki/SiedwOaRPiNhHpkLXjucucUgnBc)

</td>
</tr>
<tr>
<td>

QA

</td>
<td>

@马绿坡

</td>
<td>

\-

</td>
</tr>
</tbody></table>

## 需求点提炼

1. 触发器支持表格中【已评待排】事件的生成：[火山引擎\_原子能力清单](https://bytedance.larkoffice.com/base/JmKrbKlSNaYtyosFsnCcJcfdnDb?table=tblZ5ZBsIzaeuKwJ&view=vewlsD1ASK)

2. ~~触发器支持主动服务开关、豆包登录态的变更同步给弋途~~



# 整体架构

## 业务架构



## 影响范围

新增能力，对已有能力无影响



# 详细方案

## 功能设计

### 触发器生成事件日志

1. 首期支持生成的事件如表格中【已评待排】：[火山引擎\_原子能力清单](https://bytedance.larkoffice.com/base/JmKrbKlSNaYtyosFsnCcJcfdnDb?table=tblZ5ZBsIzaeuKwJ&view=vewlsD1ASK)，**不包含以下两条：**

2. 其他所有事件的生成均可以配置指定端状态变化条件，注意运算符要配置为**“有变更”**，所有场景均为预置场景。举例如下：

<table><tbody>
<tr>
<td>

**事件**

</td>
<td>

**需求Case**

</td>
<td>

**场景配置**

</td>
<td>

**触发器条件支持**

</td>
<td>

**备注**

</td>
</tr>
<tr>
<td>

【车窗】事件生成



</td>
<td>



</td>
<td>

</td>
<td>

在[触发器条件](https://bytedance.larkoffice.com/wiki/RskXwNWmEi0EQ3kaZPUcES9BnSg?sheet=2c8659)支持的表格中：



</td>
<td>



</td>
</tr>
<tr>
<td>

【媒体切换】事件生成：和@韩杰已沟通，在音频名称发生变更时也需要生成事件日志



</td>
<td>



</td>
<td>

当前协议还不支持media\_source字段：

1. 需要从aidv仓库中的master渠道下的biz/service/oem/master/signal\_define/signal\_define\.go中的signalInfoStr复制到aidv\_trigger仓库下的script/vehicle\_signals/2\_8/aidv\_signals\.json 中

2. 更新[触发器条件](https://bytedance.larkoffice.com/wiki/RskXwNWmEi0EQ3kaZPUcES9BnSg?sheet=2c8659)表格支持media\_source字段

3. 运行 script/vehicle\_signals/filter\_signals\_by\_csv\.py 脚本生成触发器的信号范围

</td>
<td>

在[触发器条件](https://bytedance.larkoffice.com/wiki/RskXwNWmEi0EQ3kaZPUcES9BnSg?sheet=2c8659)支持的表格中：



</td>
<td>



</td>
</tr>
<tr>
<td>

【导航】事件生成：和@韩杰已沟通，在导航目的地发生变更时也需要生成事件日志

</td>
<td>



</td>
<td>



</td>
<td>

在[触发器条件](https://bytedance.larkoffice.com/wiki/RskXwNWmEi0EQ3kaZPUcES9BnSg?sheet=2c8659)支持的表格中：

</td>
<td>



</td>
</tr>
</tbody></table>

其他事件的场景配置以此类推，注意以下几点：

1. 所有场景仅在【上汽DNA、赛力斯】渠道下配置

2. 所有场景在渠道下所有车生效

3. 【触发时间】指的是Trigger规则匹配成功的时间，而不是端状态上报的时间

4. 所有场景的执行动作为：RPC方式调用事件服务的接口，需要将场景条件中涉及的信号结构化输入给事件服务

    1. ~~场景的执行策略仅设置执行间隔为30s，其他执行次数均不设置~~

    2. 事件创建接口、事件列表接口\(事件ID、事件名称、事件拼接模板\)@徐燃

    3. 选择执行动作时如果选择了“生成事件日志”，要从事件列表拉取所有事件ID、名称、事件模板，选择**一个**事件

        1. 在预置场景时对应生成的事件就已经定义好了

    4. 输入给事件服务创建接口的参数示例如下，以最终对齐为准

    ```JSON
    {~~
    ~~    "channel":"saic-den",~~
    ~~    "channel_app_id":"99220",~~
    ~~    "vehicle_id":"xxx",~~
    ~~    "account_id":"234324" // 上报端状态时可能未登录oem账户，没有的话不给~~
    ~~    "login_doubao_uid":23421432141324, // 上报端状态时可能未登录豆包，没有的话不给~~
    ~~    "event_list":[~~
    ~~        {~~
    ~~            "resource_id":"xxx1", // 事件ID~~
    ~~            "event_time":"2026-06-08T19:00:02.005Z",~~
    ~~            "event_info":"档位由【P】设置为【D】", // 拼接好的事件日志描述~~
    ~~            "report_cycle_flag":"trigger_231412423424" // 触发器按照时间拼一个~~
    ~~            "resource_info": "{\"content\":\"[{\\\"id\\\":\\\"信号id\\\",\\\"cur_value\\\":[{\\\"position\\\":\\\"主驾\\\",\\\"states\\\":\\\"关闭\\\"},{\\\"position\\\":\\\"副驾\\\",\\\"states\\\":\\\"关闭\\\"}],\\\"old_value\\\":[{\\\"position\\\":\\\"主驾\\\",\\\"states\\\":\\\"打开\\\"},{\\\"position\\\":\\\"副驾\\\",\\\"states\\\":\\\"打开\\\"}]}]\"}"~~
    ~~        }~~
    ~~    ]~~
    ~~}
    ```

补充@韩杰定义的事件case：[事件日志需求 \- 触发事件研发实现\(sls=Y\)](https://bytedance.larkoffice.com/sheets/WfuGsRiophXzovthjVgcBKP5nzF)

5. 一期支持的事件描述对应的事件自然语言拼接模板

<table><tbody>
<tr>
<td>

**事件**

</td>
<td>

**端状态信号**

</td>
<td>

**生成模板**

</td>
</tr>
<tr>
<td>

【触发时间】档位由【档位\-触发前】设置为【档位\-触发后】



</td>
<td>

档位

</td>
<td>

档位由【vehicle\_control\_0003\.old\_value\.states】设置为【vehicle\_control\_0003\.cur\_value\.states】

</td>
</tr>
<tr>
<td>

【触发时间】驾驶模式由【模式选项\-触发前】设置为【模式选项\-触发后】



</td>
<td>

驾驶模式

</td>
<td>

驾驶模式由【vehicle\_control\_0003\.old\_value\.switch】设置为【vehicle\_control\_0003\.new\_value\.switch】

\[

\{

\&\#34;vehicle\_control\_0003\.position\&\#34;: \&\#34;\&\#34;

\}

\]

</td>
</tr>
<tr>
<td>

【触发时间】用户【状态】，导航终点为【navigation\_0004/address】

</td>
<td>

导航

</td>
<td>

用户【navigation\_0001\.status】，导航终点为【navigation\_0004\.address】

</td>
</tr>
<tr>
<td>

【触发时间】【位置】空调由【开关\-触发前】设置为【开关\-触发后】

</td>
<td>

车内空调开关

</td>
<td>



</td>
</tr>
<tr>
<td>

【触发时间】空调循环模式由【模式选项\-触发前】设置为【模式选项\-触发后】

</td>
<td>

空调循环模式

</td>
<td>



</td>
</tr>
<tr>
<td>

【触发时间】【位置】空调温度由【温度\-触发前】设置为【温度\-触发后】

</td>
<td>

空调温度

</td>
<td>



</td>
</tr>
<tr>
<td>

【触发时间】【位置】空调风量由【风量\-触发前】设置为【风量\-触发后】

</td>
<td>

空调风量

</td>
<td>



</td>
</tr>
<tr>
<td>

【触发时间】【位置】车窗由【开启程度\-触发前】设置为【开启程度\-触发后】

</td>
<td>

车窗

</td>
<td>



</td>
</tr>
<tr>
<td>

【触发时间】【位置】安全带由【状态\-触发前】设置为【状态\-触发前】

</td>
<td>

安全带

</td>
<td>



</td>
</tr>
<tr>
<td>

【触发时间】【media\_0002/media\_source】由【播放状态\-触发前】设置为【播放状态\-触发后】

</td>
<td>

播放播控

</td>
<td>

【media\_0002\.media\_source】由【media\_0003\.states\.old】设置为【media\_0003\.states】

</td>
</tr>
<tr>
<td>

【触发时间】~~【media\_0002/media\_source】执行【切换类型】操作，~~播放节目由【media\_0001/audio\_name\-触发前】切换为【media\_0001/audio\_name\-触发后】

</td>
<td>

媒体切换

</td>
<td>

播放节目由【media\_0001\.audio\_name\.old】切换为【media\_0001\.audio\_name】



</td>
</tr>
<tr>
<td>

【触发时间】【位置】座椅通风由【状态\-触发前】设置为【状态\-触发后】

</td>
<td>

座椅通风开关

</td>
<td>



</td>
</tr>
<tr>
<td>

【触发时间】【位置】座椅加热由【状态\-触发前】设置为【状态\-触发后】

</td>
<td>

座椅加热状态

</td>
<td>



</td>
</tr>
<tr>
<td>

【触发时间】【位置】座椅按摩由【状态\-触发前】设置为【状态\-触发后】

</td>
<td>

座椅按摩模式

</td>
<td>



</td>
</tr>
</tbody></table>

触发器在匹配到场景时，需要将场景判断所需的信号列表输入给模板，得到自然语言描述的事件日志结果





### 触发器信号协议分渠道维护

<table><tbody><tr>
<td>

</td>
<td>

</td>
</tr></tbody></table>

1. 触发器需要使用 aidv 里不同渠道的信号表，执行 `\`script/vehicle\_signals/filter\_signals\_by\_csv\.py\`` 脚本后在上汽、赛力斯渠道配置支持的信号协议

2. 当前触发器支持的上汽信号表 [触发器条件](https://bytedance.larkoffice.com/wiki/RskXwNWmEi0EQ3kaZPUcES9BnSg?sheet=2c8659)，需要给一份赛力斯支持的信号表@王泽民





### ~~事件数据同步给第三方【不需要触发器做】~~

> 目前需要将以下两类事件同步给弋途
> 
> 1. 端侧的主动服务开关：打开、关闭
> 
> 2. 端侧豆包的登录态：登录、退登
> 
> 

目前触发器支持 vehicle、vlm 端状态信号触发条件场景，新增 event 类型条件触发：

1. 触发器预配置以上两个信号的定义，协议格式类似端状态协议

2. 事件服务@徐燃在收到以上两个事件的上报时，格式化成触发器可识别的格式同步给触发器

3. 触发器做条件匹配，在主动服务开关“有变更”，豆包登录态“有变更”时回调给弋途

    1. 触发器的自定义回调类动作需要将本次接收到的原始信号放在Body中传递给第三方，标识一下当前触发器类型，协议如下，以最终对齐为准：

    ```JSON
    {
        "type": "", // vehicle_resource,event
        "data": interface{} // 根据type类型去解析
    }
    
    比如端状态类型数据
    
    {
        "type": "", // vehicle_resource,event
        "data": [
            {
                "signal_key_1":
                {
                    "args": // 新值
                    [
                        {
                            "key": "value"
                        }
                    ],
                    "old_args": // 旧值
                    [
                        {
                            "key": "previous_value"
                        }
                    ]
                },
                "action": []
            }
        ]
    }
    
    
    {
        "id": "tri_boarding", // 上下车事件
        "event_time": "2026-08-05T15:57:25.722+08:00",
        "subresource": [
            {
                "position": "二排左",                                             "action": "上车" 
                // 占座：无人-> 有人，action:上车;
                // 占座：有人-> 无人，下车
            }
        ]
    }
    
    {
        "id": "event_id_0002", // 空调调节
        "event_time": "2026-08-05T15:57:25.722+08:00",
        "subresource": [
            {
                "position": "主驾",                                               "from": "20",
                "to":"22"
            }
        ]
    }
    
    {
        "id": "event_id_0003", // 开关类
        "event_time": "2026-08-05T15:57:25.722+08:00",
        "subresource": [
            {
               "type": "静音开关",                                                "from": "off",
               "to":"on"
            }
        ]
    }
    
    
    场景A：用户上下车
    静态条件：
    动态条件：
    转化代码：
    func(changed) eventInfo {
        return 
    }
    "将{}的开关{}"
    
    
    场景A：空调调节
    输入：端状态 空调温度 old 主驾20度，new主驾22度；
    "将{}的开关{}"
    ```

4. 弋途侧提供接收接口

事件服务和触发器之间的事件触发协议如下，以最终对齐为准

```Thrift
struct TriggerInfo {
    1: required common.*TriggerMatchMode *mode // signal_report,event_report,schedule
    2: required string data // 参见 *SignalReportData*
}

type *SignalReportData *struct {
    *ReportType *string                         `json:"report_type"`
    *SignalData *[]signaltypes.ReportSignalData `json:"signal_data"`
}

type *ReportSignalData *struct {
    *ID          *string              `json:"id"`
    *SubResource *[]map[string]string `json:"subresource"`
}

struct TriggerRunRequest {
    1: required string channel
    2: required i64 app_id
    3: required i64 channel_app_id
    4: required i64 login_doubao_uid
    5: required string vehicle_type
    6: required string vehicle_id
    7: optional string client_version
    8: required TriggerInfo trigger_info
    9: optional string face_id
    10: optional string sound_zone
    11: optional i64 device_id
    12: optional string account_id
    13: optional double longitude
    14: optional double latitude
    15: required string encrypted_doubao_uid

    255: base.*Base *Base
}
```

```JSON
{
    "Channel": "saic-dna",
    "AppId": 765783,
    "ChannelAppId": 99220,
    "LoginDoubaoUid": 2285247177440329,
    "VehicleType": "ROEWE",
    "VehicleId": "f1KcjWTYylLIkHYexL6dvrksBs4TCwKQzDrXUfn5JhI=",
    "TriggerInfo": {
        "Mode": "event_report",
        "Data": {
            "report_type": "",
            "signal_data": [
                {
                    "id": "event_id_0001",
                    "event_time": "2026-08-05T15:57:25.722+08:00",
                    "subresource": [
                        {
                            "switch": "on/off",
                        },
                        {
                            "app": "doubao/luna/ximalya",
                            "login_status": "登录/退登"
                        }
                    ]
                }
            ]
        }
    }
}
```



# 开发估时和里程碑

<table><tbody>
<tr>
<td>

**工作项**

</td>
<td>

**子项**

</td>
<td>

**工时\(pd\)**

</td>
<td>

**备注**

</td>
</tr>
<tr>
<td rowspan="3">

触发器生成事件日志

</td>
<td>

协议更新

</td>
<td>

0\.5

</td>
<td>



</td>
</tr>
<tr>
<td>

场景配置

</td>
<td>

1

</td>
<td>



</td>
</tr>
<tr>
<td>

对接事件服务

</td>
<td>

1

</td>
<td>



</td>
</tr>
<tr>
<td>

触发器信号协议分渠道维护

</td>
<td>

协议更新

</td>
<td>

1

</td>
<td>



</td>
</tr>
</tbody></table>



# 评审记录

## 一审记录






