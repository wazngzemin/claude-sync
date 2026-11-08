# \[技术方案\]\-文本链路接入 Sami 情感化 TTS

# 背景

<div class="callout">

现状：文本链路的回复内容下发时，并不会提前合成音频数据，而是通过单独的链路来拉取音频时，才通过相关标识获取TTS文本信息去合成音频数据。

</div>

当前链路介绍

1. 文本链路处理用户请求，返回流式文本结果信息

2. Doubao app 收到回复首帧，通过sami sdk 携带本次请求的相关标识（messageID等信息）speech相关服务拉取音频信息



TOB方案协议参考：

[【技术方案】toB主线S2S方案](https://bytedance.larkoffice.com/wiki/MuTMwPKnSiSsVbkJKULcNPRznz2)



# 目标

> 收益：文本链路音频合成提前 100ms 左右，从而使端到端耗时减少 100ms 左右
> 
> 收益来源描述：文本链路音频的提前合成，减少一个数据下行以及获取音频时再拉取获取 TTS 文本耗时
> 
> 



细分任务：

1. 双向流式链路搭建，先使用websocket云端跑通（支持流式文本和流式音频）

2. 文本链路AIDV服务接入Sami 情感 TTS

3. 支持拉取文本链路生成的 Sami 情感 TTS 

4. 三方流式文本生成TTS接口（双向流式）



遗留项：

本方案不考虑在AIDV服务识别Emotion问题（Emotion可用于 Sami 情感化 TTS 合成时指定情绪）



# 方案

## 域名

BOE: ws\-stone\-vehicle\-boe\.bytedance\.net

PROD: wss\.volcvehicle\.com



## 整体架构

1. 拉取文本链路回复生成的TTS

    1. 文本链路AIDV返回回复文本信息的同时生成文本对应的音频数据。

    2. 端侧通过相关信息标识直接拉取云端缓存的音频数据。

2. 三方流式TTS文本生成流式TTS音频

## 业务流程

1. 拉取文本链路回复生成的TTS

# 测试计划

## 提测内容

> 修改会影响哪些功能模块、场景
> 
> 

1. 主要功能：

    1. 文本链路\+指定情绪：统一使用Sami 情感化 TTS 合成

    2. 文本链路\+未指定情绪：

        1. 文本S2S链路：使用文本S2S自己合成的音频

        2. 其他链路：统一使用Sami 情感化 TTS 合成



2. 自测视频：

[https://bytedance.larkoffice.com/minutes/obcn21196z7qv9kza31446nr]()

3. 提测环境：

ppe\_vehicle\_zc\_test



3. 提测apk：（from @汪帅）

> 端侧apk部署方式参考：[豆包InCar客户端发版记录](https://bytedance.larkoffice.com/wiki/Wnziw9ngoiJx5nkWZmmcOBz5nac)
> 
> 



\[app\-mainland\-debug\.apk\]





## 测试风险评估

> 因修改造成异常的风险有大多？可不可能存在因为修改引入的 bug
> 
> 

# 人力排期

> 任务拆解，具体排期。
> 
> 

# Check List

> 评审前自查，评审时复核。
> 
> 

* [ ] 整体评估

    * [ ] 已和 QA 沟通测试计划（接口人： ）

    * [ ] 排期

* [ ] 接口评估

* [ ] 上线评估

    * [ ] 上线顺序合理

    * [ ] 能够回滚止损

* [ ] 上线后的 

    * [ ] 关注指标

    * [ ] 关注告警监控

* [ ] 异常处理

    * [ ] 重试

    * [ ] 监控

    * [ ] 报警



# 评审会议纪要

## Todo List

> 记录评审改进意见。
> 
> 

* [ ] Xxx 










