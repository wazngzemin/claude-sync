# 【录音纪要】车控端技术方案\-V2

## 1\. 方案概述

本文档描述了基于豆包车载APP和语音妙计实现的录音纪要技术方案，包含用户交互、云端服务、车控端和云存储\(vod/imagex\)的完整流程。

## 2\. 背景

### 2\.1 相关文档

<table><tbody>
<tr>
<td>

描述

</td>
<td>

文档地址

</td>
</tr>
<tr>
<td>

PRD

</td>
<td>

[【PRD AICar】录音纪要](https://bytedance.larkoffice.com/wiki/GVS9wYoHwi360QkvmjRcuoXbnrb)

</td>
</tr>
<tr>
<td>

figma



</td>
<td>

https://www\.figma\.com/design/3SDXcBahS7xSHdrVMhplt1/%E5%BD%95%E9%9F%B3%E7%BA%AA%E8%A6%81?node\-id=0\-1\&amp;p=f\&amp;t=H63I4HGNBV6WWvG8\-0

</td>
</tr>
<tr>
<td>

Meego

</td>
<td>

[\[需求\]【主线\&amp;上汽】录音纪要agent开发](https://meego.larkoffice.com/telematics/story/detail/6825160423)

</td>
</tr>
<tr>
<td>

vod上传



</td>
<td>

https://cloud\.bytedance\.net/docs/vod/wiki/doccnIxR6QteWihDXnxvN1p2vZg?x\-resource\-account=public\&amp;x\-bc\-region\-id=bytedance

</td>
</tr>
<tr>
<td>

云端协议技术文档

</td>
<td>

[frontier的method枚举及消息格式](https://bytedance.larkoffice.com/wiki/Efp5wV5Wxiv1ZpkbKKjc1sbvnye)

</td>
</tr>
</tbody></table>

### 2\.2 核心角色

<table><tbody>
<tr>
<td>

**角色**

</td>
<td>

**职责描述**

</td>
</tr>
<tr>
<td>

**用户**

</td>
<td>

用户

</td>
</tr>
<tr>
<td>

**豆包客户端**

</td>
<td>

接收用户语音指令、录制纪要

</td>
</tr>
<tr>
<td>

**豆包云**

</td>
<td>

豆包客户端的云服务 与座舱云交互

</td>
</tr>
<tr>
<td>

**座舱云**

</td>
<td>

下发func至车控端

</td>
</tr>
<tr>
<td>

**车控端**

</td>
<td>

接收func指令、控制UI

</td>
</tr>
<tr>
<td>

vod

</td>
<td>

vod上传存储

</td>
</tr>
</tbody></table>

## 3\. 录音纪要时序图 

### 3\.1 开始录制

### 3\.2 停止录制

### 3\.3  查看纪要

## 4\. 功能

### 4\.1 工程模块现状与改造后

现状模块

改造为

### 4\.2 接收Func

<table><tbody>
<tr>
<td>

一级功能

</td>
<td>

功能描述

</td>
<td>

FuncCode

</td>
<td>



</td>
<td>

参数

</td>
</tr>
<tr>
<td rowspan="3">

录音纪要

</td>
<td>

开始录制

</td>
<td>

录音纪要



</td>
<td>



</td>
<td>

```JSON
{
     "meeting_id": "ea262d94-2530-4d4f-b303-f8bad9de3e23",
     "longest_time": 3600, *// 会议录制最大时间*
    "functions": [
        {
            "function_code": "录音纪要",
            "params": [
                {
                    "action": "开始"
                }
            ]
        }
    ]
}
```



</td>
</tr>
<tr>
<td>

结束录制

</td>
<td>

录音纪要

</td>
<td>



</td>
<td>

```JSON
*// 结束会议纪要*
{
    "meeting_id": "ea262d94-2530-4d4f-b303-f8bad9de3e23",
    "longest_time": 0,
    "functions": [
        {
            "function_code": "录音纪要",
            "params": [
                {
                    "action": "关闭"
                }
            ]
        }
    ]
}
```

</td>
</tr>
<tr>
<td>

查看会议纪要

</td>
<td>

录音纪要

</td>
<td>

</td>
<td>

```JSON
*// 查看会议纪要*
{
    "meeting_id": "ea262d94-2530-4d4f-b303-f8bad9de3e23",
    "longest_time": 0,
    "functions": [
        {
            "function_code": "录音纪要",
            "params": [
                {
                    "action": "查看"
                }
            ]
        }
    ],
    "meeting_json_url":""
}
```

</td>
</tr>
</tbody></table>

### 4\.3 UI卡片实现

\[AICanvasPluginSDK1\.0\.zip\]

AI画布一个插件化UI框架  通过在宿主APP里加载独立的apk 、实现view的获取与展示、交互通过广播 进行交互

### 4\.4 卡片上屏与交互



### 4\.5 本地文件相关

wav格式存储

#### 4\.5\.1 录音文件名

车内会议2025101401

#### 4\.5\.2 录音文件日期

22:41 2025年10月14日

#### 4\.5\.3 删除本地文件时机

上传完成时

#### 4\.5\.4 最多10个本地文件

开始录制需检测文件数量

录制完成时需检测文件数量

#### ~~4\.5\.5 文件上传工具类~~

[上传工具类](https://bytedance.larkoffice.com/wiki/Byogwca0Aiki5YkBmKqcwZvcn5e)

## 5\. 依赖项

### 5\.1\. 与豆包交互 

1\.~~做一个通用的 vod上传接口   ~~

2\.~~显示/隐藏豆包卡通形象~~

~~3\.~~~~开始录制、结束录制~~

~~4\.~~~~纪要列表接口~~

4\.提供个CardManager整体架构、卡片总入口@姜锋

### 5\.2 录音上传之后的vid的状态同步接口定义

meeting\_id 和vid的http同步接口 @俞昭志

### 5\.3 上汽AI push sdk



## 6\. TODO项

### 6\.1\.与豆包交互通信方式

显示/隐藏豆包卡通人形象交互通信方式

开始录音/停止录音的交互通信方式

## 7\. 附录

### 7\.1 版本历史

<table><tbody>
<tr>
<td>

**版本**

</td>
<td>

**日期**

</td>
<td>

**修改内容**

</td>
<td>

**修改人**

</td>
</tr>
<tr>
<td>

v1\.0

</td>
<td>

2026\-03\-11

</td>
<td>

初始版本

</td>
<td>

​田高琳

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



</td>
</tr>
</tbody></table>

排期

<table><tbody>
<tr>
<td>

序号

</td>
<td>

**功能实现**

</td>
<td>

耗时

</td>
<td>

处理人

</td>
<td>

完成情况

</td>
<td>

预计日期

</td>
<td>

备注

</td>
</tr>
<tr>
<td>

1

</td>
<td>

3个func函数

</td>
<td>

0\.5天

</td>
<td>

​田高琳

</td>
<td>



</td>
<td>

3\.13\~3\.13

</td>
<td>



</td>
</tr>
<tr>
<td>

2

</td>
<td>

AI画布调研\+调试

</td>
<td>

0\.5天

</td>
<td>

​田高琳

</td>
<td>



</td>
<td>

3\.16\~3\.16

</td>
<td>

\*

</td>
</tr>
<tr>
<td>

3

</td>
<td>

小红点 依赖于零度岛sdk调研

</td>
<td>

0\.5天

</td>
<td>

​田高琳

</td>
<td>



</td>
<td>

3\.16\~3\.16

</td>
<td>

\*

</td>
</tr>
<tr>
<td>

4

</td>
<td>

AIPush调研

</td>
<td>

0\.5天

</td>
<td>

​田高琳

</td>
<td>



</td>
<td>

3\.17\~3\.17

</td>
<td>

\*

</td>
</tr>
<tr>
<td>

5

</td>
<td>

豆包forntier链路通知\(生成完毕\)联调

</td>
<td>

1天

</td>
<td>

​汪帅

</td>
<td>



</td>
<td>

3\.17～3\.18

</td>
<td>

\*

</td>
</tr>
<tr>
<td>

6

</td>
<td>

CardServiceModule搭建

</td>
<td>

0\.5天

</td>
<td>

田高琳

</td>
<td>



</td>
<td>

3\.17\~3\.17

</td>
<td>



</td>
</tr>
<tr>
<td>

7

</td>
<td>

录音纪要能力搭建

</td>
<td>

2天

</td>
<td>

田高琳

</td>
<td>



</td>
<td>

3\.17\~3\.19

</td>
<td>



</td>
</tr>
<tr>
<td>

8

</td>
<td>

imagex上传能力搭建

</td>
<td>

1天

</td>
<td>

田高琳

</td>
<td>



</td>
<td>

3\.18\~3\.19

</td>
<td>

\*

</td>
</tr>
<tr>
<td>

9

</td>
<td>

纪要整体ui

</td>
<td>

2天

</td>
<td>

田高琳

</td>
<td>



</td>
<td>

3\.19\~3\.20

</td>
<td>



</td>
</tr>
<tr>
<td>

10

</td>
<td>

自测

</td>
<td>

1天

</td>
<td>

田高琳

</td>
<td>



</td>
<td>

3\.23～3\.24

</td>
<td>



</td>
</tr>
<tr>
<td>

11

</td>
<td>

与AISpeech联调

</td>
<td>

0\.5天

</td>
<td>

田高琳

</td>
<td>



</td>
<td>

3\.24～3\.24

</td>
<td>



</td>
</tr>
<tr>
<td>

12

</td>
<td>

与server联调

</td>
<td>

1\.5天

</td>
<td>

田高琳

</td>
<td>



</td>
<td>

3\.24～3\.25

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



</td>
<td>

合计

</td>
<td>

10\.5\+1天

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
</tbody></table>




