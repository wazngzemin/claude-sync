# 主动服务即时卡片技术方案

# 需求背景

主动服务需要用即时卡片承载 Director 的播报内容，并展示主动服务标识。弋途（Advisor）通过 real\_time\_card 对象提供 enabled 出卡开关及 buttons 按钮名称列表；Director 生成文案，服务端将文案与按钮组合后下发。沿用现有主动服务触发与客户端回流链路。

PRD：[3\.1 主动服务](https://bytedance.larkoffice.com/wiki/FBsrwA734iaFzZkrZExcHHBtn3d#FO3Ed2lTpoEsxTxElYOcp00JnAf)。

# 当前系统链路

<table><tbody>
<tr>
<td>

环节

</td>
<td>

当前实现

</td>
<td>

本次差异

</td>
</tr>
<tr>
<td>

推荐入口

</td>
<td>

`biz/handler/v1/recommend\.go · TriggerRecommend` 接收建议，调用推荐服务。

</td>
<td>

新增出卡标记与按钮列表。



</td>
</tr>
<tr>
<td>

推荐缓存与通知

</td>
<td>

`biz/service/recommend/recommend\.go · generateRecommend` 缓存推荐上下文，向客户端下发 recommend\_id。

</td>
<td>

把出卡标记与按钮列表存入推荐缓存。

</td>
</tr>
<tr>
<td>

客户端回流

</td>
<td>

`biz/service/flow/base\.go · beforeFlow` 根据 recommend\_id 读取缓存，恢复请求上下文，随后删除缓存。

</td>
<td>

删除缓存前，把出卡标记与按钮列表恢复到 ChatRequest\.Ext。

</td>
</tr>
<tr>
<td>

Director 输出

</td>
<td>

`llmNodeHandler` 收集完整模型输出；`savePlannerModelOutput` 与 `llmBranchHandler` 分别解析 JSON，用于保存记录和判断分支。

</td>
<td>

将解析收敛到 llmNodeHandler，保存记录、卡片下发和分支判断复用同一份 PlannerTextOutput。

</td>
</tr>
</tbody></table>

# 本次方案

## 整体时序

## 出卡时机

在 llmNodeHandler 的 processLLMStream 返回后，统一提取、修复 JSON，并用 config\.Json 解析为 PlannerTextOutput。仅当 output \!= nil 且 state\.Step == 0 时调用 sendRealTimeCard

## 字段与协议

弋途（Advisor）请求通过 real\_time\_card 对象提供 enabled（bool，缺省 false）和 buttons（字符串数组，缺省 \[\]）。对象缺省、null 或 enabled=false 时不出卡；enabled=true 且按钮为空时允许纯文本卡片。按钮名称按原顺序展示，点击后名称原文作为 query，Director 不生成按钮。

```json
{
  "advisors_input": [
    "建议前往最近的服务区休息"
  ],
  "advisor_types": [],
  "source": "static_advisor",
  "real_time_card": {
    "enabled": true,
    "buttons": [
      "确认",
      "取消"
    ]
  }
}
```

即时卡片使用主动推荐业务通道：Method=3（Recommend），message\_type=2（TypeRecommendCard）；仅复用 types\.Widget 的消息体结构，widget\_id=real\_time\_card。

Widget 的字段完整示例如下。title、content、buttons 都是 WidgetData 的通用展示字段；

```json
{
  "widget_id": "real_time_card",
  "widget_data": {
    "title": {
      "title": "AI推荐",
      "desc": "",
      "icon": {
        "light_url": "",
        "dark_url": "",
        "icon_type": ""
      }
    },
    "content": "车内有点热，需要帮你开启空调吗？",
    "buttons": [
      "开启空调",
      "暂时不用"
    ],
    "widget_request_id": "<recommend_id>",
    "view_data": ""
  }
}
```

widget\_data\.title\.title 固定为“AI推荐”，desc 与 icon 当前为空。content 是首轮 TalkContent 经情感标记清除、换行归一化和首尾空白清理后的纯文本，空文本不发送。widget\_request\_id 取 ChatRequest\.Ext\[vehicle\_recommend\_id\]，用于关联推荐及识别同一张卡片。推荐 ID 不在 view\_data 内重复携带。buttons 定义为 \[\]string，保持弋途 real\_time\_card\.buttons 的文字和顺序，不增加按钮对象、id 或独立 query 字段。入口拒绝空白按钮；缺省或 null 在内部归一化为 \[\]。

```json
{
  "message_type": 2,
  "request_id": "<本次Query的request_id，存在时携带>",
  "message": "{\"widget_id\":\"real_time_card\",\"widget_data\":{\"title\":{\"title\":\"AI推荐\",\"desc\":\"\",\"icon\":{\"light_url\":\"\",\"dark_url\":\"\",\"icon_type\":\"\"}},\"content\":\"车内有点热，需要帮你开启空调吗？\",\"buttons\":[\"开启空调\",\"暂时不用\"],\"widget_request_id\":\"<recommend_id>\",\"view_data\":\"{}\"}}"
}
```

客户端先按 Method=3、message\_type=2 分流，再反序列化 message 字符串为 Widget，按 widget\_id=real\_time\_card 渲染；卡片展示本身不触发推荐回流。

# 代码修改方案

<table><tbody>
<tr>
<td>

文件 / 位置

</td>
<td>

修改内容

</td>
</tr>
<tr>
<td>

biz/handler/v1/recommend\.go

</td>
<td>

RecommendRequest 使用 RealTimeCard \*types\.RealTimeCard（JSON 字段 real\_time\_card）；TriggerRecommend 校验按钮名称并将完整配置传入推荐服务。nil 表示不开卡。

</td>
</tr>
<tr>
<td>

biz/service/recommend/recommend\.go

</td>
<td>

GenerateRecommend、GenerateRecommendOption、CacheValue 统一使用 \*types\.RealTimeCard；generateRecommend 保存完整 enabled 与 buttons 对象，缓存 JSON 字段为 real\_time\_card。同步所有调用点，缺省配置为 nil。

</td>
</tr>
<tr>
<td>

biz/types/recommend\_card\.go；biz/types/define\.go；biz/service/flow/base\.go

</td>
<td>

types\.RealTimeCard 定义 Enabled bool 和 Buttons \[\]string。ExtraKeyRealTimeCard=real\_time\_card。beforeFlow 先清除客户端或旧轮次配置，再从服务端推荐缓存恢复到 ChatRequest\.Ext；推荐缓存删除前完成恢复，空按钮归一化为 \[\]。

</td>
</tr>
<tr>
<td>

biz/service/planner/planner\_text\.go

</td>
<td>

llmNodeHandler 统一解析模型输出并写入 state\.ParsedOutput，保存记录、卡片发送和分支判断复用结果。仅 output \!= nil 且 state\.Step == 0 时发卡；带工具调用的输出在发卡判断后递增返回状态中的 Step。llmBranchHandler 不再递增 Step，仅判断工具分支、最大步数和结束路径。

</td>
</tr>
<tr>
<td>

biz/service/planner/real\_time\_card\.go；biz/service/planner/recommend\_card\.go

</td>
<td>

buildRealTimeCard 解析 types\.RealTimeCard、清洗首轮文案、检查推荐 ID 和配置。sendRealTimeCard 构造 types\.Widget：WidgetIDRealTimeCard，WidgetData\.Title\.Title=AI推荐，Content=正文，Buttons=配置按钮，WidgetRequestID=推荐 ID，ViewData=\&\#34;\{\}\&\#34;。获取 CommonInfo\.DeviceID，使用 config\.Json\.MarshalToString 序列化 Widget，调用 NewMessageParam\(Recommend, TypeRecommendCard, deviceID\) 和 PushMethodMsg；上下文缺失、序列化或推送失败时记录日志并返回，不阻断主流程。

</td>
</tr>
<tr>
<td>

biz/types/widget\.go；biz/infrastructure/frontier/widget\.go

</td>
<td>

新增 WidgetIDRealTimeCard=\&\#34;real\_time\_card\&\#34;；WidgetData 增加 Content string 和 Buttons \[\]string，均使用 omitempty。即时卡片复用 types\.Widget 结构和已有 Recommend / TypeRecommendCard 枚举，不经过通用 SendNewWidgetMessage。现有普通 Widget 通道仍使用 Method=9 / TypeWidgetNew，不受本次调整影响。

</td>
</tr>
</tbody></table>




