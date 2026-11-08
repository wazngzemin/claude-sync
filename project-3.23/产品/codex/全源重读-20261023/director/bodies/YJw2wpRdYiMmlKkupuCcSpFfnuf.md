# 【AI汽车】日程提醒接入技术方案

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

2025/10/16

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

本期日程提醒Agent接入目标是验证车载链路能正常接入Agent并正常调用创建、更新和删除日程等提醒功能，在车机端豆包App上能展示日程提醒卡片和提醒消息。

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

[【PRD AICar】日程提醒](https://bytedance.larkoffice.com/docx/M01TdIqqAoJ3vExk2Iic9VGWnSf)

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

**端侧方案**

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

[提醒助手 OnePage](https://bytedance.larkoffice.com/wiki/LWuSwoZwrivcaakSwYEczYTynAd)

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

Planner\-日程提醒任务分发

</td>
<td>

✅

</td>
</tr>
<tr>
<td>

座舱云直接接入日程提醒Agent

</td>
<td>

✅

</td>
</tr>
<tr>
<td>

端侧日程提醒卡片展示

</td>
<td>

✅

</td>
</tr>
<tr>
<td>

端侧提醒事件的通知栏消息

</td>
<td>

❌

</td>
</tr>
<tr>
<td>

端侧提醒事件的消息展示

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

### 总体设计

#### 简化的数据流向图

#### 消息格式

日程提醒卡片的Message消息格式如下：

```JSON
{
    "message": {
        "conversation_id": "386189250562",
        "message_id": "24833255840694274",
        "message_body_version": 1,
        "sender_id": "7234781073513644036",
        "user_type": 2,
        "content_type": 100,
        "content": "{\"widget_data\":\"{\\\"record_id\\\":169797342,\\\"remind_data\\\":[{\\\"remind_time\\\":\\\"今天 11:19\\\",\\\"content\\\":\\\"打车\\\",\\\"status\\\":\\\"1\\\",\\\"recurrence_type\\\":\\\"0\\\",\\\"remind_id\\\":\\\"7562020875688755240\\\",\\\"precise_time\\\":\\\"1760671165\\\",\\\"notify_type\\\":0,\\\"entity_type\\\":0}],\\\"need_notify_auth\\\":true,\\\"action_tag\\\":\\\"create\\\",\\\"action_remind_ids\\\":[\\\"7562020875688755240\\\"],\\\"query_type\\\":\\\"\\\",\\\"card_type\\\":\\\"\\\",\\\"agent_type\\\":0}\",\"widget_id\":\"remind_single_widget\",\"applet_id\":\"com.flow.remind\",\"response_for_model\":\"\"}",
        "index_in_conv": 13876,
        "create_time": 1760671108,
        "ext": {
            "tts": "1",
            "fpa_common_param": "{\"action\":\"query_music_favourite\",\"agent_intention\":\"remind\",\"input_scene\":\"message\",\"is_remind_action_bar\":false,\"is_action_bar_option\":false,\"agent_tool\":\"remind_schedule_create\"}",
            "agent_id": "7342864811136729123",
            "chat_id": "24833255840691970",
            "llm_intention_detail": "Agent-Reminder",
            "llm_intention": "multi_agent",
            "origin_content": "{\"widget_data\":\"{\\\"record_id\\\":169797342,\\\"remind_data\\\":[{\\\"remind_time\\\":\\\"今天 11:19\\\",\\\"content\\\":\\\"打车\\\",\\\"status\\\":\\\"1\\\",\\\"recurrence_type\\\":\\\"0\\\",\\\"remind_id\\\":\\\"7562020875688755240\\\",\\\"precise_time\\\":\\\"1760671165\\\",\\\"notify_type\\\":0,\\\"entity_type\\\":0}],\\\"need_notify_auth\\\":true,\\\"action_tag\\\":\\\"create\\\",\\\"action_remind_ids\\\":[\\\"7562020875688755240\\\"],\\\"query_type\\\":\\\"\\\",\\\"card_type\\\":\\\"\\\",\\\"agent_type\\\":0}\",\"widget_id\":\"remind_single_widget\",\"applet_id\":\"com.flow.remind\",\"response_for_model\":\"\"}",
            "is_finish": "1",
            "default_display_content": "",
            "inner_log_id": "2025101711182423B772EB9CF7F9352304",
            "tea_tags_time_cost": "{\"agent_tool\":\"remind_schedule_create\",\"agent_first_package_cost\":\"3038\",\"agent_intention\":\"remind\",\"agent_id\":\"7342864811136729123\",\"agent_name\":\"Doubao\",\"llm_intention\":\"multi_agent\",\"llm_intention_detail\":\"Agent-Reminder\",\"total_first_package_cost\":\"3778\",\"llm_first_package_cost\":\"3622\"}",
            "need_deep_think": "0",
            "answer_use_stream_review": "1",
            "client_report_scene": "gui",
            "update_version_code": "10060040",
            "chat_history_count": "9",
            "llm_model_type": "38",
            "flow.cube.app_remind.ctx_msg_infos": "[169797340,169797341]",
            "wiki": "2",
            "brief": "[卡片]",
            "answer_with_suggest": "1",
            "agent_intention_detail": "Agent-Reminder",
            "agent_name": "Doubao",
            "msg_entity_status": "1",
            "widget_source": "",
            "create_time_unix": "1760671108792514240",
            "bot_state": "{\"bot_id\":\"7234781073513644036\",\"agent_id\":\"7412842995277496335\",\"agent_name\":\"Agent-Reminder\",\"awaiting\":\"7342864811136729123\"}",
            "server_type": "Server",
            "use_personal_recommend": "1",
            "speaker_id": "zh_female_wenroutaozi_v2_mars_bigtts",
            "agent_intention": "multi_agent",
            "ugc_voice_id": "104"
        }
    }
}
```

提醒创建卡片协议

1. widget\_id：remind\_single\_widget

```JSON
{
  "widget_data": "{\"record_id\":169797342,\"remind_data\":[{\"remind_time\":\"今天 11:19\",\"content\":\"打车\",\"status\":\"1\",\"recurrence_type\":\"0\",\"remind_id\":\"7562020875688755240\",\"precise_time\":\"1760671165\",\"notify_type\":0,\"entity_type\":0}],\"need_notify_auth\":true,\"action_tag\":\"create\",\"action_remind_ids\":[\"7562020875688755240\"],\"query_type\":\"\",\"card_type\":\"\",\"agent_type\":0}",
  "widget_id": "remind_single_widget",
  "applet_id": "com.flow.remind",
  "response_for_model": ""
}
```

提醒事件消息格式

当到达事件的提醒时间点时，日程提醒Agent会向豆包notify发送通知栏和Message消息，其中Message消息的格式如下，可以通过ext中的msg\_source\_type=53来判断是提醒事件

```JSON
{
  "conversation_id": "386189250562",
  "message_id": "24870856819236610",
  "message_body_version": 1,
  "sender_id": "7234781073513644036",
  "user_type": 2,
  "content_type": 1,
  "content": "{\\\"text\\\":\\\"⏰ 该打车出发啦，别耽误行程哦。\\\"}",
  "index_in_conv": 13877,
  "create_time": 1760671165,
  "ext": {
    "msg_source_type": "53",
    "inner_log_id": "2025101711184001015204906600024AE_2799829205386535",
    "llm_fake_prompt": "hello",
    "notify_task_id": "68f1b5bd8ea570ad16948c6d",
    "brief": "⏰ 该打车出发啦，别耽误行程哦。",
    "is_finish": "1",
    "is_from_bot": "1"
  },
  "local_message_id": "remind_notify:1760671165082172129",
  "section_id": "24869348910514434",
  "bot_reply_message_id": "0",
  "message_action_list": [
    {
      "name": "喜欢",
      "key": "like",
      "icon": {
        "type": "action-like"
      }
    },
    {
      "name": "不喜欢",
      "key": "dislike",
      "icon": {
        "type": "action-dislike"
      },
      "position": 1
    }
  ],
  "fetch_token": "24870856819236610",
  "brief": "⏰ 该打车出发啦，别耽误行程哦。"
}
```

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

planner

</td>
<td>

planner能根据用户query生成日程提醒的对应任务，包含多轮交互

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

日程提醒卡片展示、提醒事件消息展示

</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>

一方

</td>
<td>

待确认：提醒Agent Push提醒事件到豆包时是会有BotID限制

</td>
<td>



</td>
<td>



</td>
</tr>
</tbody></table>

## 遗留TODO

* [ ] 更换AppID后，一方提醒Agent是否有适配工作（多端同步）

* [ ] 车机有自己的BotID，日程提醒的Push接口里有指定BotID，此BotID是固定豆包主Bot还是从创建提醒时的请求里获取

* [ ] 车机新的BotID为什么能和主Bot会话互通






