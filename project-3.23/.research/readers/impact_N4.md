# impact_N4 — 工具执行三类 / 工具清单与协议：资料有、副本可能缺的点

来源：t19 下游工具输入输出整理 sheet、t13-t18 全域 FC 协议多车企 sheet、t05 Agent Server One Page、t07 S2S 对话工具、d10 Director knowhow。

## 1. 下游工具分类与播报权限（t19 实测）
- 每个工具带：工具名/工具 ID/负责产品+研发/支持项目（主线/赛力斯/上汽）/是否工具播报（车控=否）/标准 query 输入要求（可处理范围+示例+易混淆排除项）/输出格式。
- 典型工具：vehicle_basic_control（车窗/空调/座椅/后视镜/天窗/遮阳帘/门锁/冰箱/HUD/内外灯）、vehicle_system_settings（蓝牙/WiFi/屏幕/音效/电源/账号）、vehicle_communication（电话/视频）、auto_drive（泊车/巡航/变道，辅助风格只舒适/标准/运动三档）、route_planning（AiNavi 版，途经点增删改、路线选择"选第二条"）。
- 边界 notice：智驾≠车控、氛围灯≠车控、导航模糊点须先 POI。
- 来源：https://bytedance.larkoffice.com/wiki/NxMVwYmqLijlubkKE54cVHfrnib【已确认 sheet】

## 2. FC 协议多车企版本差异（部分阅读）
- SLS 主线（t13）：当前版本 RAG 定制函数 1024 行 + SFT 范围 811 行；函数字段=功能模块/一二级功能/函数名称/描述/参数（必填非必填、类型、取值范围）/定制or主线/手车范围。
- 上汽 DNA 量产（t15）：控制合辑 2263 行 + 定制函数范围 8 个版本（0707→0909）+ 2.0 智驾专属范围 + RAG 协议全集 1768 行 + 上汽 SFT 协议 842 行。
- 赛力斯（t17）：0615 支持范围 1033 行 + 车控支持范围边界 5141 行 + 主线全量 2278 行。
- 东风奕派 S33（t18）：主线 SFT 1392 行 + 定制 RAG 全集 941 行 + 按 P0/P1/P2/P3 优先级拆分 + 闲聊 199 行。
- DNA 对外（t16）：1101 主线迁移 2271 行 + 上汽单独定制函数 566 行。
- 来源：t13-t18 sheets【部分阅读，结构与量级已确认】

## 3. 工具三类执行通道（Agent Server）
- 执行通道：HTTP / SSE / Kitex / MCP / Frontier / 本地工具；协议适配 aidv/dpfm/doubao/ecology/internal_rpc；后处理 BeforeRequest/AfterResponse/AfterAgent；音乐只有结构化数据需转文本进模型上下文。
- 来源：https://bytedance.larkoffice.com/wiki/AQxOwJet9ieV5bkstANcvYHLn5f【已确认 One Page】

## 4. S2S 联网主题路由（t07）
- 场所询问→POI Agent；美食→POI；娱乐（音乐/影视/演出）→对应垂域；社会/知识/公司产品→车书/兜底；国际/新闻/天气→对应 agent 或 NA；风险内容→安全风控 agent 不提供检索。
- 来源：https://bytedance.larkoffice.com/wiki/QDw1w0xwGiUlI6krxcJcXGGdngb【已确认工具清单】

## 5. 车辆功能 knowhow 约束（d10，赛力斯 M9）
- 空调最低 16 度、风速最大 7 档、座椅按摩模式 3 选 1（轻柔猫步/波浪放松/动态舒压）、档位最大 3 档；导航没有记忆能力——带记忆的地址先查记忆再导航；阅读灯不支持语音控制；不支持后除霜除雾、不支持强劲制热/制冷。
- 来源：https://bytedance.larkoffice.com/wiki/GlZhweru4i6naMkbGv4czFeFnGo【已确认 knowhow】
