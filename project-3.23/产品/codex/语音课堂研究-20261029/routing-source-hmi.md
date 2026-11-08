# 上汽主交互新方案-云端技术方案

来源：https://bytedance.larkoffice.com/wiki/BCjPwn2FtiiYR2kG0IzcpLaenkg

本轮读取状态：success

# 上汽主交互新方案\-云端技术方案

# 背景

[上汽主交互新方案](https://bytedance.larkoffice.com/docx/BF9WdWQbfoFvwux5qfAcsJGdnyg)

[多轮保持需求设计](https://bytedance.larkoffice.com/wiki/FcMywAAIliPBzekzegFci2Y0npd)

[\[需求\]【DNA1\.0】上汽主交互新方案开发（目标630前）](https://meego.larkoffice.com/telematics/story/detail/7336696911?parentUrl=%2Ftelematics%2FstoryView%2FbJ8vRLAvg%3Fscope%3Dworkspaces%26node%3D65234844&scope=workspaces&node=65234844&openScene=4)

# 云端方案

云端的内容也按照产品prd的分类和顺序，其中，第一部分ASR上屏纯客户端，在这里不做体现

下面的部分也是，只列出涉及云端改造的内容



## 思考过程与显示

线上原本就有，云端的原有对工具的frontier推送，只不过之前是用来提前拉画布的，现在用来在asr区域显示工具标识了



分两次，第一次是调用工具时推送，第二次是工具返回首字的时候推送。

与@廖婉婷拉齐，第二次的推送，**需要改成工具结果全部返回时再推送**。**这里只是第二次推送的时机变了，推送的内容本身没有变化。**@郭金龙@梁宇



下面是例子：

```SQL
第一次推送
Info 2026-06-16 09:43:05.216 widget.go:23 10.206.48.36 vehicle.model.aidv_rpc 202606160943037798555EBAAB95C30718 default all_dc lf 1734744402234446865 _podname=dp-1cd9e5c2c8-554446c949-fwdbl _ipv6=0:0:0:0:0:0:0:0 __vregion=China-North _batchid=bd6ed680b207413e9365304062649f5800000000000009da _env=ppe_aidv_saic_dev _env_type=ppe _flags=0 _ifppe=true _language=go _msg=_user_not_login_ 2649189048670970 SendNewWidgetMessage, widgetInfo: {"widget_id":"tool_call_loading","widget_data":{"title":{"title":"AI播客搜索","desc":"","icon":{"light_url":"https://p9-hscy-normal.byteimg.com/obj/vehicle/aidv/saic-dna/ui/media-light.lottie","dark_url":"https://p9-hscy-normal.byteimg.com/obj/vehicle/aidv/saic-dna/ui/media-dark.lottie","icon_type":"lottie"}},"widget_request_id":"4492ba33-0b4c-4293-a4dd-23d2d9432874","view_data":"{\"tool_name\":\"broadcast_search\",\"tool_name_cn\":\"AI播客搜索\",\"tool_call_id\":\"4492ba33-0b4c-4293-a4dd-23d2d9432874\",\"tool_id\":\"7375414411818700039\"}"}} 
```

```SQL
第二次推送
Info 2026-06-16 09:43:07.601 widget.go:23 10.206.48.36 vehicle.model.aidv_rpc 202606160943037798555EBAAB95C30718 default all_dc lf 1734744402234446865 _podname=dp-1cd9e5c2c8-554446c949-fwdbl _ipv6=0:0:0:0:0:0:0:0 __vregion=China-North _batchid=bd6ed680b207413e9365304062649f5800000000000009da _env=ppe_aidv_saic_dev _env_type=ppe _flags=0 _ifppe=true _language=go _msg=_user_not_login_ 2649189048670970 SendNewWidgetMessage, widgetInfo: {"widget_id":"tool_call_loading","widget_data":{"title":{"title":"AI播客搜索","desc":"","icon":{"light_url":"https://p9-hscy-normal.byteimg.com/vehicle/aidv/saic-dna/ui/task/radio.png~tpl-1_noop.webp","dark_url":"https://p9-hscy-normal.byteimg.com/vehicle/aidv/saic-dna/ui/task/radio.png~tpl-1_noop.webp","icon_type":"image"}},"widget_request_id":"4492ba33-0b4c-4293-a4dd-23d2d9432874","view_data":"{\"tool_name\":\"broadcast_search\",\"tool_name_cn\":\"AI播客搜索\",\"tool_call_id\":\"4492ba33-0b4c-4293-a4dd-23d2d9432874\",\"tool_id\":\"7375414411818700039\"}"}} 
```

**此外，原来这里的推送是用来拉画布的，所以一部分工具不需要画布，所以有个补丁逻辑，下面这些是不推的，本次因为推送的内容，端上不是用来拉画布了，是用来asr区域的标识了，因此和产品确认过，这里需要下掉该逻辑**

```Go
var notSendLoadingStartAndEndToolID = map[string]bool{
    "7375414411818700040": true,
    "7375414411818700032": true,
    "7375414411818700061": true,
    "7375414411818700136": true,
    "7375414411818700009": true,
    "7375414411818700137": true,
    "7375414411818700022": true,
    "7375414411818700023": true,
    "7375414411818700021": true,
    "7375414411818700056": true,
    "7375414411818700030": true,
    "7375414411818700060": true,
    "7375414411818700052": true,
}
```

## 语音卡片显示

### 6\.30版

整体上云端无需修改，云端本身现在就是工具在成功的时候才下发端上，否则只会进planner

这里特殊的点是navi需要修改，yitu云端需要修改，字节云端无需修改，最多配合一下联调

### 二期

云端新增planner\_round\_id字段，原来这个字段其实在TTS的时候用过，和正伟拉齐，这里也可以使用这个字段

在**工具侧**入口写入ctx，然后在**2种工具下发**链路里，都加上该字段即可,planner\_round\_id

<table><tbody><tr>
<td>

</td>
<td>

</td>
</tr></tbody></table>

https://code\.byted\.org/stone\_vehicle/aidv/merge\_requests/648

其中，豆包链路下发，ext里新增字段，需要在豆包侧注册，需要@张弛协助

#### 自测

环境：ppe\_main\_interaction\_new\_v2

```Shell
车书工具
[fornax.bytedance.net](https://fornax.bytedance.net/space/7522018773168046082/analytics/trace?id=776965a9d1b5fdb1&latency=8753&logIdTime=24&queryID=&queryType=log_id&relation=and&selected_span_type=all_span&start_time=1782820770543&trace_end_time=1782820842297&trace_filters=%257B%2522query_and_or%2522%253A%2522and%2522%252C%2522filter_fields%2522%253A%255B%257B%2522query_type%2522%253A%2522not_in%2522%252C%2522values%2522%253A%255B%2522boe%2522%255D%252C%2522field_name%2522%253A%2522deployment_env%2522%252C%2522field_type%2522%253A%2522string%2522%257D%252C%257B%2522query_type%2522%253A%2522%2522%252C%2522field_name%2522%253A%2522%2522%252C%2522values%2522%253A%255B%255D%252C%2522sub_filter%2522%253A%257B%2522query_and_or%2522%253A%2522and%2522%252C%2522filter_fields%2522%253A%255B%257B%2522field_name%2522%253A%2522span_name%2522%252C%2522logic_field_name_type%2522%253A%2522span_name%2522%252C%2522query_type%2522%253A%2522in%2522%252C%2522field_type%2522%253A%2522string%2522%252C%2522values%2522%253A%255B%2522aidv-main-flow%2522%255D%252C%2522is_custom%2522%253Afalse%257D%252C%257B%2522field_name%2522%253A%2522psm_env%2522%252C%2522logic_field_name_type%2522%253A%2522psm_env%2522%252C%2522query_type%2522%253A%2522in%2522%252C%2522field_type%2522%253A%2522string%2522%252C%2522values%2522%253A%255B%2522ppe_main_interaction_new_v2%2522%255D%252C%2522is_custom%2522%253Afalse%257D%255D%257D%252C%2522field_type%2522%253A%2522string%2522%257D%255D%257D&trace_id=000015c04d5b0e2025825f158fdf9fc8&trace_jump_from=&trace_platform=inner_cozeloop&trace_preset_time_range=1h&trace_start_time=1782817242297)
下面是工具返回的一帧信息，是豆包链路的

19:59:37.204 - {"message_type":2,"content_type":1,"is_finish":false,"stream_id":"stream_b5938ab8-8f59-4aee-9c2f-d87bb19f7e00","content_for_display":"![](https://volc-agent-prod.tos-cn-beijing.volces.com/knowledge-base/dna/is4pr/knowledge2/images/67_1.jpeg)","content_for_tts":" ","ext":{"invoke_agent_id":"7375414411818700003","planner_round_id":"6883891206402_1","disable_tts":"true","vehicle_intent_type":"operation_manual","disable_answer_history":"true","vehicle_coordination_metadata":"{\"request_id\":\"b8098caf-62c6-4e29-aaa7-aeb550a998ad\",\"tts_audio_id\":\"559b6693-b820-438c-8772-46f469382fa4\"}"}}


```



```SQL
车控工具
[fornax.bytedance.net](https://fornax.bytedance.net/space/7522018773168046082/analytics/trace?id=394ee1aaff06cc15&latency=4574&logIdTime=24&queryID=&queryType=log_id&relation=and&selected_span_type=all_span&start_time=1782822414685&trace_end_time=1782822471664&trace_filters=%257B%2522query_and_or%2522%253A%2522and%2522%252C%2522filter_fields%2522%253A%255B%257B%2522query_type%2522%253A%2522not_in%2522%252C%2522values%2522%253A%255B%2522boe%2522%255D%252C%2522field_name%2522%253A%2522deployment_env%2522%252C%2522field_type%2522%253A%2522string%2522%257D%252C%257B%2522query_type%2522%253A%2522%2522%252C%2522field_name%2522%253A%2522%2522%252C%2522values%2522%253A%255B%255D%252C%2522sub_filter%2522%253A%257B%2522query_and_or%2522%253A%2522and%2522%252C%2522filter_fields%2522%253A%255B%257B%2522field_name%2522%253A%2522span_name%2522%252C%2522logic_field_name_type%2522%253A%2522span_name%2522%252C%2522query_type%2522%253A%2522in%2522%252C%2522field_type%2522%253A%2522string%2522%252C%2522values%2522%253A%255B%2522aidv-main-flow%2522%255D%252C%2522is_custom%2522%253Afalse%257D%252C%257B%2522field_name%2522%253A%2522psm_env%2522%252C%2522logic_field_name_type%2522%253A%2522psm_env%2522%252C%2522query_type%2522%253A%2522in%2522%252C%2522field_type%2522%253A%2522string%2522%252C%2522values%2522%253A%255B%2522ppe_main_interaction_new_v2%2522%255D%252C%2522is_custom%2522%253Afalse%257D%255D%257D%257D%255D%257D&trace_id=000015c04d5b0e274742bfa144d2994f&trace_jump_from=&trace_platform=inner_cozeloop&trace_preset_time_range=1h&trace_start_time=1782818871664)
车控是**frontier链路的**

Info 2026-06-30 20:26:57.418 push_and_wait.go:108 10.194.29.149 vehicle.model.aidv_rpc 202606302026545A9827888876705994E3 default single_dc lf 5367539504788030867 _podname=dp-2f91bf8d9e-549cc8544b-h7dbk _ipv6=0:0:0:0:0:0:0:0 __vregion=China-North _batchid=4da02ebe8f57459494c86859472d8a070000000000000000 _env=ppe_main_interaction_new_v2 _env_type=ppe _flags=0 _ifppe=true _language=go _msg=_user_not_login_ 1342920660639434 pushWithRequestId, message:{"session_id":4109030400258,"message_type":1,"message":"{\"functions\":[{\"function_code\":\"空调风量调节\",\"params\":[{\"value\":\"+1\"}]}],\"sound_zone\":\"副驾\",\"is_simple_vehicle_control\":false}","request_id":"965186dc-089b-4ede-9d59-7cfbd7d40145","planner_round_id":"6883891207938_1"} 
```

## 语音卡片退出

只涉及多轮保持的最后那个部分

### 多轮保持部分

#### 整体链路

**这里，每一轮Query来之后，会独立走**@张嘉锋**模型，然后拿到结果后，按照这个query的端上给的requet\_id，frontier推送给端上，用于作为端上决策的一个参考信息，语义就是当前query，是否和之前的相关**

正常情况下，结果的下发是要早于planner的结果

这部分链路如下：

#### frontier推送

[frontier的method枚举及消息格式](https://bytedance.larkoffice.com/wiki/Efp5wV5Wxiv1ZpkbKKjc1sbvnye)

Method新增11，message\_type = 1 @姜锋

```Shell
{
    "message": "{\"is_related\":true}",
    "request_id": "2e35c926-cda6-4236-b94a-9fa705fe3c28"
}
```

#### SP

https://fornax\.bytedance\.net/space/7522018773168046082/prompt/develop/7590103891634817026

模型，doubao\-seed\-1\.8，复用拒识的模型单元

```JSON
{
        "channel": "saic-dna",
        "function_key": "context.decision.card",
        "endpoint": "ep-20260414145727-nq6db",
        "start": "2026-03-27T10:00:30+08:00",
        "end": "2026-12-30T18:20:30+08:00"
    }
```

# 云端自测

**测试环境：ppe\_aidv\_dev2**

下面case验证上述云端改动：

[fornax\.bytedance\.net](https://fornax.bytedance.net/space/7522018773168046082/analytics/trace?id=8c65bac0460b911&latency=7710&relation=and&selected_span_type=all_span&start_time=1782195071927&trace_end_time=1782195090309&trace_filters=%257B%2522query_and_or%2522%253A%2522and%2522%252C%2522filter_fields%2522%253A%255B%257B%2522query_type%2522%253A%2522not_in%2522%252C%2522values%2522%253A%255B%2522boe%2522%255D%252C%2522field_name%2522%253A%2522deployment_env%2522%252C%2522field_type%2522%253A%2522string%2522%257D%252C%257B%2522query_type%2522%253A%2522%2522%252C%2522field_name%2522%253A%2522%2522%252C%2522values%2522%253A%255B%255D%252C%2522sub_filter%2522%253A%257B%2522query_and_or%2522%253A%2522and%2522%252C%2522filter_fields%2522%253A%255B%257B%2522field_name%2522%253A%2522span_name%2522%252C%2522logic_field_name_type%2522%253A%2522span_name%2522%252C%2522query_type%2522%253A%2522in%2522%252C%2522field_type%2522%253A%2522string%2522%252C%2522values%2522%253A%255B%2522aidv-main-flow%2522%255D%252C%2522is_custom%2522%253Afalse%257D%252C%257B%2522field_name%2522%253A%2522psm_env%2522%252C%2522logic_field_name_type%2522%253A%2522psm_env%2522%252C%2522query_type%2522%253A%2522in%2522%252C%2522field_type%2522%253A%2522string%2522%252C%2522values%2522%253A%255B%2522ppe_aidv_dev2%2522%255D%252C%2522is_custom%2522%253Afalse%257D%255D%257D%257D%255D%257D&trace_id=000015c0322839de372d47e213cc87de&trace_jump_from=&trace_platform=inner_cozeloop&trace_preset_time_range=24h&trace_start_time=1782108690309)

工具推送@梁宇：

是否保持参考信号下发@姜锋：

```Go
Info 2026-06-23 14:11:13.145 server.go:144 10.195.137.53 vehicle.model.aidv_rpc 20260623141110B4AC76CDFE37D6F944D1 default single_dc lf 6700316819635018546 _podname=dp-aa1b892022-577f5986b7-tqtw5 _ipv6=0:0:0:0:0:0:0:0 __vregion=China-North _batchid=34ec77fd9d654987b112cd878e0c543a0000000000000002 _env=ppe_aidv_dev2 _env_type=ppe _flags=0 _ifppe=true _language=go _msg=_user_not_login_ 1342920660639434 pushMsg, messageId:29269bb35c934c9d841b4da4625523da, message:{"message_type":1,"message":"{\"is_related\":true}","request_id":"cc1b2501-5f1a-4ea2-937e-35dc54830010"} 
```

修改多轮保持参考信号输出case，产品要求，在全部react都结束后再推送给端上:

```Go
Info 2026-06-27 15:05:47.404 server.go:144 10.195.149.235 vehicle.model.aidv_rpc 202606271505370AF31C3512B599BEB2AC default single_dc lf 1663205558808738546 _podname=dp-aa1b892022-677779fb6b-8fctb _ipv6=0:0:0:0:0:0:0:0 __vregion=China-North _batchid=1f5163758d3f4a71b7fc14e907b0170b0000000000000004 _env=ppe_aidv_dev2 _env_type=ppe _flags=0 _ifppe=true _language=go _msg=_user_not_login_ 1342920660639434 pushMsg, messageId:5c4f0feed0724cd9a2937c709a0058a9, message:{"message_type":1,"message":"{\"is_related\":true}","request_id":"bac7a556-d7ee-4495-a488-7acf7bebd47c"} 
```

目前是云端在planner结束的时候推送，但是现在推送只能是在触发时机上是最后，无法保证端上收到是最后，因为豆包链路其实更长。

待端上峰哥确认，可以拿到豆包链路的结束帧后，云端推送就可以在保持判断的模型结果输出就推送了，端上等拿到结束帧的时候再用即可。端上用豆包链路结束帧判断是更优的






