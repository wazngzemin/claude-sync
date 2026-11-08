# ASR与TTS 日志排查及问题整理
# ASR
## 问题排查思路
### 获取 ASR Websocket 长连接 LogID 与对应请求 ReqeustID
> 尽量排查问题时同时提供这个两个字段的信息，则可跳过这步
> 
> 
如果端侧只提供的requestID，则最好说明请求发生的大概时间。
[通过argo关键词搜索获取LogID](https://cloud.bytedance.net/argos/streamlog/info_overview/keyword_search?auto_search=false&data_source_uid=1495338640&dcs=&enableDelimiter=&end_time=1769584861&expired_time=&filter_tag=&or=false&otherPsm=&patterns=60b19b7f-48a2-4fde-8832-647a918ec920&psm=vehicle.model.aidv&region=China-North&showed_column=&start_time=1769583061&unCapSpell=false&unIncludeOr=false&unIncludePatterns=&x-bc-region-id=bytedance&x-resource-account=public)
### Fornax 查看请求日志
https://fornax\.bytedance\.net/space/7522018773168046082/analytics/log\-query?queryID=021769584777999fdbddc02000e01510000000000000015696549\&amp;queryType=log\_id\&amp;logIdTime=4
通过logID\+RequestID找到对应的span信息。
若火山ASR识别有问题，可通过这个LogID提oncall排查
### 查看请求对应的音频原始数据
https://console\.volcengine\.com/tos/bucket/setting?id=aidv\&amp;region=cn\-beijing\&amp;type=objects\&amp;dirPrefix=asr%2F%2F%2F
由于当前端侧未传递channel与vehicleID信息，所以路径中有两个空名称。
# TTS
## 实现流程
## TTS音频数据排查
### aidv\_rpc服务查询当前请求Sami TTS相关交互数据
1. 常见TTS Event信令
Event信令
含义
StartTask
开启TTS任务
FinishTask
结束TTS任务
TaskFailed
TTS任务处理失败
TaskStarted
TTS任务已开启
TTSSentenceStart
开始TTS识别
TTSSentenceEnd
TTS分段识别结束
2. 通过fornax直接查看交互数据
https://fornax\.bytedance\.net/space/7522018773168046082/analytics/log\-query?env=online\&amp;logIdTime=4\&amp;queryID=20260105205356B3DF512EB132BB4A805E\&amp;queryType=LogID
3. 查询 Sami TTS 请求LogID
4. TTS文本到TTS音频首帧耗时
找到一个输入给Sami的文字的时间（信令信息不算）
> \&\#34;2026\-01\-05T20:54:07\.983224834\+08:00\&\#34;
> 
> 
找到sami返回的第一个存在音频数据的时间
> \&\#34;2026\-01\-05T20:54:08\.535482174\+08:00\&\#34;
> 
> 
两者相减得到首帧时间
2026\-01\-05T20:54:08\.535 \- 2026\-01\-05T20:54:07\.983
约 600ms
也可以通过这个信息tag耗时获取。
### 查询文本S2S合成的音频信息
1. 常见TTS Event信令
Event信令
含义
TTSSentenceStart
开始TTS识别
TTSResponse
TTS音频数据
TTSSentenceEnd
TTS识别结束
2. 通过fornax直接查看交互数据
https://fornax\.bytedance\.net/space/7522018773168046082/analytics/log\-query?env=online\&amp;logIdTime=4\&amp;queryID=202601061013476D05D65CD100D8E37E01\&amp;queryType=LogID
> 这里生成的音频不一定都下发到端侧，speech那边都还是会主动合成音频数据，取决于我们是否需要去拉取使用。
> 
> 
## 
### 获取云端生成的tts\_audio\_id
> tts\_audio\_id作为云端的音频请求标识
> 
> 
1. fornax平台获取
2. 通过logID查询日志获取
https://cloud\.bytedance\.net/argos/streamlog/info\_overview/log\_id\_search?curTimeShift=600\&amp;data\_source\_uid=1480329072\&amp;expired\_time=\&amp;handleSubmit=false\&amp;isCustomTime=false\&amp;logId=202601191942389428A369B91CAC01C9C3\&amp;log\_search=true\&amp;psm=vehicle\.model\.data\_provider\_for\_model\&amp;psmList=vehicle\.model\.aidv\_rpc%2Cflow\.alice\.chat\&amp;query\_type=\_\_logid\&amp;region=China\-North\&amp;timeSpan=10\&amp;trace\_search=true\&amp;type=\_\_logid\&amp;x\-bc\-region\-id=bytedance\&amp;x\-resource\-account=public
### 获取与端侧WebSocke交互结果
1. argos关键词查询通过tts\_audio\_id获取tts websocket请求logid
2. argos中查询日志
通过tts\_audio\_id（对应客户端请求中fetch\_request\_id的值）能关联去redis拉去对应的缓存
通过reqeust\_id能对应我们下发给端侧的所有数据
3. fornax查询日志：
https://fornax\.bytedance\.net/space/7522018773168046082/analytics/log\-query?env=online\&amp;logIdTime=4\&amp;queryID=021767665612467fdbddc03001b0b2e0000000000000012981cd1\&amp;queryType=LogID
1. 通过tts\_audio\_id拉取TTS音频
> SpanName规则：consume\_tts\_audio:\{fetch\_request\_id\}
> 
> 这个的 fetch\_request\_id 对应了请求云端生成的 tts\_audio\_id
> 
> 
数据格式与[第一条Sami TTS交互类型](https://bytedance.larkoffice.com/docx/G3e2djKqXoiJlDxADF2crHQvn2g#share-RfFqdaFZqolqE0xVnJBc00ptnec)，不在赘述。
2. 通过文本合成TTS音频
> SpanName规则：sami\_tts:\{tts\_audio\_id\}
> 
> 这个request\_id是调用合成音频时传入的 request\_id（端侧生成用于标识拉取音频请求的唯一标识）
> 
> 
with\_eof\_flag: 是否正常结束
3. 查看实际下发给端侧的数据
### \(已废弃\)~~通过火山引擎TOS服务查询缓存音频~~
> ~~当前仅在以下ppe环境处理音频的缓存~~
> 
> ~~ppe\_aidv\_test\_chen、ppe\_vehicle\_zc\_test、ppe\_aidv\_test~~
> 
> 由于音频文件较多，tos中配置仅保留四天
> 
> 
1. 通过babi账号跳转登陆火山引擎平台（选择账号ID：2109706047）
https://babi\.bytedance\.net/finance/basic/volcManage/?volc\_account\_category=1\&amp;tab=my
2. 进入TOS对应的桶，使用tts\_audio\_id搜索相关请求缓存的音频
https://console\.volcengine\.com/tos/bucket/setting?id=aidv\&amp;region=cn\-beijing\&amp;type=objects\&amp;dirPrefix=tts%2Fresp\-audio%2F
3. 点击右侧详情后进入文件详情，即可播放缓存的音频数据。
### 获取对应请求TTS音频
A\. 通过fornax中这个span【AudioDataToVodOrTos】对应的vid
\(或者\)数据库捞取对应的请求详情信息。https://cloud\.bytedance\.net/rds/detail/db/cn/vehicle\_aidv/autoSQL?x\-resource\-account=public\&amp;x\-bc\-region\-id=bytedance\&amp;x\-bc\-vregion=China\-North\&amp;x\-bc\-vdc=cn
```JSON
select * from chat_history_detail where log_id = "202606032034364D1109018E4419C55153"
```
B\. 视频点播查询对应音频信息https://cloud\.bytedance\.net/vod/space/media/cn\-north\-1/log\_collection/?x\-resource\-account=public\&amp;x\-bc\-region\-id=bytedance\&amp;x\-bc\-vregion=China\-North
点击详情后，视频地址中获取对应播放链接即可播放
## 问题分类
### 多个TTS返回顺序问题（已解决）
**背景描述**
Sami 当前一个连接发送对应的文本后，返回的音频不会携带音频对应的文本信息，只有开始识别和识别结束标识。导致在一次请求连接中无法区分两段文本的音频。
**问题描述**
当前一个请求中可能存在多个模块同时生成TTS，目前一个请求的所有TTS会存储在redis 同一个List中。
**解决方案**
方案一：
控制TTS的生成位置，所有下发的文本信息使用统一入口生成TTS，只要保证文本输出顺序就能保证TTS的顺序。
方案二：
- 维持多个TTS生成来源。
- 为每个模块任务下发的文本设定相关顺序标识\{index\}。
- 每个模块单独生成TTS
    - 通过模块的开始、结束标识（chan的开始和结束）来决定一个Sami TTS Websocket的链接的生命周期。
    - 存储方式：维护一个请求的所有模块音频队列，先写入自己对应的队列序号中。从前到后依次写入redis\.
主要难点：
模块输出最终需要播报TTS的信息需要保证模块顺序并带上模块开始、结束标识。
### Sami 音频前100ms空帧问题。
### 指定情绪的情况下，回复一段时间后情绪逐渐消失（待复测）
\[242282be\-5776\-433c\-8d68\-b425bfe5b893\.wav\]
1. 用四川话
日志：https://cloud\.bytedance\.net/argos/streamlog/info\_overview/log\_id\_search?curTimeShift=600\&amp;data\_source\_uid=1457399712\&amp;end=1767617941\&amp;expired\_time=\&amp;handleSubmit=false\&amp;isCustomTime=true\&amp;isMultiRegion=false\&amp;logId=20260105205356B3DF512EB132BB4A805E\&amp;log\_search=true\&amp;psm=vehicle\.model\.aidv\_rpc\&amp;psmList=vehicle\.model\.aidv\_rpc\&amp;query\_type=\_\_logid\&amp;region=China\-North\&amp;start=1767617341\&amp;trace\_search=true\&amp;type=\_\_logid\&amp;x\-bc\-region\-id=bytedance\&amp;x\-resource\-account=public
SamiTTS返回首帧信息
```JSON
{
  "time": "2026-01-05T20:54:07.526791944+08:00",
  "audio_length": 0,
  "web_socket_response": {
    "task_id": "4472ffc9-60de-401e-b2dd-abbdd5dc72fe",
    "message_id": "",
    "namespace": "BidirectionalTTS",
    "event": "TaskStarted",
    "status_code": 20000000,
    "status_text": "OK"
  }
}
```
其余信息可以通过fornax获取
https://fornax\.bytedance\.net/space/7522018773168046082/analytics/log\-query?env=online\&amp;logIdTime=4\&amp;queryID=20260105205356B3DF512EB132BB4A805E\&amp;queryType=LogID
Oncall 解决方案：
更换相关emotion参数字段
### S2S不返回音频（已解决）
日志：https://cloud\.bytedance\.net/argos/streamlog/info\_overview/log\_id\_search?curTimeShift=600\&amp;data\_source\_uid=1455391040\&amp;expired\_time=1770187856\&amp;handleSubmit=false\&amp;isCustomTime=false\&amp;logId=202601041720003DC2799697976CED1BB6\&amp;log\_search=true\&amp;psm=vehicle\.model\.data\_provider\_for\_model\&amp;psmList=vehicle\.model\.aidv\_rpc%2Cdata\.speech\.audio\_flow\&amp;query\_type=\_\_logid\&amp;region=China\-North\&amp;timeSpan=10\&amp;trace\_search=true\&amp;type=\_\_logid\&amp;x\-bc\-region\-id=bytedance\&amp;x\-resource\-account=public
S2S反馈问题：
ctx中携带信息过大
当前解决方式：
减少ctx中传递的数据信息。
### Sami TTS 响应慢（已解决）
20260107120058FC3CCDE4FAF9565B92B2
fornax日志：https://fornax\.bytedance\.net/space/7522018773168046082/analytics/log\-query?env=online\&amp;logIdTime=4\&amp;queryID=20260107120058FC3CCDE4FAF9565B92B2\&amp;queryType=LogID
音频首字到首帧，等了7s左右。
```JSON
{
  "time": "2026-01-07T12:01:08.742568838+08:00",
  "audio_length": 0,
  "web_socket_response": {
    "task_id": "647120db-9256-40f0-a2f2-8fa5cb7e2fee",
    "message_id": "69215ca3-3ea1-475d-a45b-4aed3b69aefe",
    "namespace": "TTS",
    "event": "TTSSentenceStart",
    "status_code": 20000000,
    "status_text": "OK",
    "payload": "{\"text\":\"\"}"
  }
}
```
## 
**Oncall  反馈会导致变慢的几个原因**
1. 一句话没有标点符号
2. finishtask发送较晚
**标点符号验证**
[TTS合成音频结尾标点符号对比](https://bytedance.larkoffice.com/wiki/Tx0nwx9GvicmxtkXSkycyHWxn6f)
**解决方案**
1. 需要planner对于铺垫话术格式有所控制。尽量保证有相关标点符号。
2. 不好处理，不排除铺垫话术出来后，其他模块规划处理耗时长。可以尝试和[问题分类1](https://bytedance.larkoffice.com/wiki/WwpFwoUNLikhxmkIhKwciSCEnYy#share-T4MgdodeUonlvqxQ9hgcsNWfnBd)一起处理
### S2S返回音频不完整（已解决）
\[bab8a2e0\-c802\-4836\-a979\-4fd9c6735161\.wav\]
日志：https://cloud\.bytedance\.net/argos/trace/retrieve/logIdRetrieve?curTimeShift=600\&amp;data\_source\_uid=1457252704\&amp;end=\&amp;expired\_time=\&amp;handleSubmit=false\&amp;isCustomTime=false\&amp;logId=202601061013476D05D65CD100D8E37E01\&amp;log\_search=true\&amp;page=log\&amp;psm=vehicle\.model\.aidv\_rpc\&amp;psmList=vehicle\.model\.aidv\_rpc\&amp;query\_type=\_\_logid\&amp;region=China\-North\&amp;start=\&amp;timeSpan=30\&amp;trace\_search=true\&amp;type=\_\_logid\&amp;x\-bc\-region\-id=bytedance\&amp;x\-resource\-account=public
返回文本信息：
发送需要返回音频的文本：
```SQL
{
    "isLifeCycle": false,
    "protocalType": 1,
    "dialogRequest": {
        "vui_cmd": 100,
        "payload": "{\"basic_payload\":{\"content\":\"有\",\"message_id\":34626170559792898,\"from_s2s\":true},\"query_round_id\":1}",
        "seq_id": 0,
        "question_id": 34626170559792640,
        "conversation_id": 0,
        "query_round": 1,
        "task_id": "60818425-57a8-4d61-8972-e7d73a6946ca",
        "command_list": null
    }
}
```
获取返回的音频（不完整）：
问题原因：
Sami tts 合成的音频 和 S2S的音频 在本地使用的是同一个chan做数据存储。Sami tts websocket 空闲时间较长sami主动断开连接后，运行defer逻辑关闭了chan，导致S2S的音频缓存失败。
解决思路：
先调大Sami的最大空闲时长，保持和整个会话时间基本一致（暂定180s），会话结束时也会主动关闭连接。
