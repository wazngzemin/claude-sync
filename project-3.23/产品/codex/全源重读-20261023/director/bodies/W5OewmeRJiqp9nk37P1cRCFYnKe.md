# 【AI汽车】录音纪要接入技术方案

## 修订记录

<table><tbody>
<tr>
<td>

日期

</td>
<td>

描述

</td>
<td>

改动人

</td>
</tr>
<tr>
<td>

2025/10/17

</td>
<td>

创建文档

</td>
<td>

@吕鹏浩

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
<tr>
<td>



</td>
<td>



</td>
<td>



</td>
</tr>
</tbody></table>

## 背景

> 需求背景

> 方便其他小伙伴理解，简单地描述一下遇到的问题、解决的目标

本期录音纪要Agent接入目标是验证车载链路下能正常采集多音区音频并存储，以离线音频文件上传到录音纪要Agent进行总结。

## 相关文档

<table><tbody>
<tr>
<td>



</td>
<td>

**对接人**

</td>
<td>

**链接**

</td>
</tr>
<tr>
<td>

**需求文档**

</td>
<td>



</td>
<td>

[【PRD AICar】录音纪要](https://bytedance.larkoffice.com/docx/B0dLdbNIPorkz3xCRrfcwOznnCh)

</td>
</tr>
<tr>
<td>

**设计视觉稿**

</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>

**关联****Meego**

</td>
<td>



</td>
<td>

[\[需求\]✅【AI汽车】日程提醒agent](https://meego.larkoffice.com/telematics/story/detail/6744736177?parentUrl=%2Ftelematics%2FstoryView%2FNsqQj5LHR%3Fscope%3Dworkspaces%26node%3D61689744&scope=workspaces&node=61689744&openScene=4)

</td>
</tr>
<tr>
<td>

**后端方案**

</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>

**接口设计**

</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>

**测试用例**

</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>

**埋点****文档**

</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>

**其他参考文档**

</td>
<td>



</td>
<td>

[车机 \- 录音纪要](https://bytedance.larkoffice.com/docx/PszDdPnfFoTpcqxg6iTcqUnRnJf)

[【DoraE】记录模式\-豆包服务端技术方案](https://bytedance.larkoffice.com/wiki/SNR4wB4QiipThpkLnNFcWGJWnNg)

</td>
</tr>
</tbody></table>

## 范围

<table><tbody>
<tr>
<td>

功能点

</td>
<td>

本期是否涉及

</td>
</tr>
<tr>
<td>

Planner\-录音纪要任务分发

</td>
<td>

✅

</td>
</tr>
<tr>
<td>

座舱云接入录音纪要Agent

</td>
<td>

✅

</td>
</tr>
<tr>
<td>

端侧实时录音纪要功能

</td>
<td>

❌

</td>
</tr>
<tr>
<td>

端侧离线录音纪要功能

</td>
<td>

✅

</td>
</tr>
<tr>
<td>

端侧录音纪要通知

</td>
<td>

✅

</td>
</tr>
<tr>
<td>

车载AppID适配

</td>
<td>

待定

</td>
</tr>
</tbody></table>

## 设计

#### 依赖分析

### 总体设计

#### 核心流程

1. 本期用户通过语音输入方式开始或者结束录音纪要功能，云端以Frontier链路下发控制指令（车控链路）

2. Plnaaer在分发任务时将录音纪要的控制意图分到车控Agent

3. 端上在结束录音后

#### 开启录音纪要

#### 结束录音纪要

#### 音频上传

> 音频上传详细方案见[上汽AI汽车云端链路架构](https://bytedance.larkoffice.com/docx/KQuhdz1ROo9pg7x1N3Jc7gn5neg)
> 
> 

1. 通知一方开始纪要总结流程用MQ/或者新开接口，在消息体中提供与纪要总结相关的信息。

#### 纪要生成

#### 纪要推送

### 接口设计

#### 创建录音纪要生成任务（客户端使用）

- Method：`POST`

- Path: `aidv/v1/audio/init\_audio\_record`

参数

<table><tbody>
<tr>
<td>

参数名

</td>
<td>

参数位置

</td>
<td>

参数格式

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

file\_infos

</td>
<td>

Body Json

</td>
<td>

array\&lt;object\&gt;

</td>
<td>

是

</td>
<td>

音频资源ID

</td>
</tr>
</tbody></table>

参数示例

```Thrift
{
    "file_infos": [{
        "resource_id": "xxxxx", // SDK上传成功后返回的资源ID 
        "label": "主驾" // 资源对应的音区
    }]
}
```

响应

```JSON
{
    "data": {
        "meeting_id": "xxxxxxxxx"
    },
    "errno": 0,
    "msg": "success"
}
```

#### 更新录音纪要状态（一方使用）

> PSM：vehicle\.model\.aidv\_rpc
> 
> Method: UpdateAudioRecordStatus
> 
> 调用时机：一方收到录音纪要生成任务，生成结束或中途发生错误无法继续生成纪要时调用
> 
> IDL分支：[feature/meeting\_record](https://code.byted.org/overpass/vehicle_model_aidv_rpc/tree/feature/meeting_record)
> 
> Overpass地址：https://cloud\.bytedance\.net/overpass/idl/service?psm=vehicle\.model\.aidv\_rpc\&amp;x\-resource\-account=public\&amp;x\-bc\-region\-id=bytedance
> 
> 添加依赖：go get code\.byted\.org/overpass/vehicle\_model\_aidv\_rpc@feature/meeting\_record
> 
> 

```Thrift
enum AudioRecordStatusType  {
    Unknown = 0
    SummaryGenerateFinish = 1    // 纪要总结成功
    SummaryGenerateError = 2     // 纪要生成失败
}

struct UpdateAudioRecordStatusRequest {
    1: required i64 MeetingID
    2: required i64 UserID
    3: required i64 BotID
    4: AudioRecordStatusType Status
    5: string Msg
}
struct UpdateAudioRecordStatusResponse {
    1: i64 Code
    
    255: base.BaseResp BaseResp
}

UpdateAudioRecordStatusResponse UpdateAudioRecordStatus(1: UpdateAudioRecordStatusRequest request)
```



#### 一方录音纪要接口协议

[车机 \- 录音纪要](https://bytedance.larkoffice.com/docx/PszDdPnfFoTpcqxg6iTcqUnRnJf)



### 依赖项

#### 内部依赖项

<table><tbody>
<tr>
<td>

依赖

</td>
<td>

描述

</td>
<td>

对接时间

</td>
<td>

风险点

</td>
</tr>
<tr>
<td>

算法

</td>
<td>

Planner分发任务 \-

车控分类模型区分用户开始录音和结束录音的意图 \-

</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>

端侧

</td>
<td>

音频采集、上传，纪要结果卡片展示

</td>
<td>



</td>
<td>



</td>
</tr>
</tbody></table>

#### 外部依赖项

<table><tbody>
<tr>
<td>

依赖

</td>
<td>

描述

</td>
<td>

对接时间

</td>
<td>

风险点

</td>
</tr>
<tr>
<td>

一方

</td>
<td>



</td>
<td>



</td>
<td>



</td>
</tr>
</tbody></table>

# 识别到的交互问题

1. 离线上传音频文件的方式存在用户录制中直接下电或录制完成后上传时下电，导致云端未收到离线音频，无法继续后续流程

2. 车机开启录音纪要时，手机端是不会收到纪要卡片，录音纪要结束时推送消息给车机时手机不会同步展示。用户下电后录音纪要消息也不会同步给手机。



ToDo

1. 离线音频文件分片上传




