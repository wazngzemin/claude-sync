# impact_R（02 有效入口与端云采信）— 资料里有、副本还缺

> 用户反馈看不懂 R1–R18，以下每条都是「图上哪个分叉、为什么这样判」的细化素材。状态：【已落地】【2.6目标】【讨论中】【待核】。

## R 核心分叉：一条语音进来，先后过哪几道闸
按文档和画板，采信顺序完整是：
**离线预处理 soft vad → 离线拒识？→ 离线白名单？→ 云端全链路 → 离在线结果选择（离线白名单 > 在线 > 离线非白名单 > 离线通用兜底）**
对应画板 WxvHwJPWhhdtGdbsa8Vc9lZDn9d。副本目前只画了大方向，没写这个「优先级序列」。
- 链接：https://bytedance.larkoffice.com/docx/KSWtdjsmwoJ1TzxcIv4c57vinle

## R1 免唤醒上云策略的两道闸（副本缺「为什么手持电话不上云」）
- 端侧预拦截：明确指令（本地可执行）/ 明确拒识（闲聊、跟车里人说话）→ 不上云，直接本地处理。
- 不能本地处理的 → 上云。文本先行（soft vad 结果提前发云端），音频流式上云（hard vad 结果），两路 ASR 对比：一致不重请求，不一致用 hard 结果重请求。
- 手持电话的音区：强拒识，不上云。
- 链接：https://bytedance.larkoffice.com/docx/KSWtdjsmwoJ1TzxcIv4c57vinle 【2.6目标】

## R2 全时态流式拒识的三分支（本地对话链路图 RuK1wvTy，副本没有这张图）
用户持续语音 → 本地流式拒识模型（partial asr 流式请求）：
- **recall/incomplete（可能要回应）→ 提前音频上云**（云端 ASR+拒识+提升首句响应速度）。
- 等到完整 query → 本地 LLM 识别完 → 三分支：
  - **a. functioncall → 直接采纳**（若已提前上云则中止云端请求）。
  - **b. reject → 是否已提前上云？** 已上云 → 等云端拒识结果作为最终标准；未上云 → 直接丢弃，不唤醒不上云。
  - **c. 不支持 → 完整音频上云** → 云端仲裁最终结果。
- 仲裁规则原文：提前上云的 query 不采信本地拒识结果；本地 functioncall 可直接采纳。
- 【待核】文档正文 0930 修订说「本地 functioncall 仅断网/超时才采纳」，但这张画板仍把 functioncall 直接采纳画成主路径——两处口径不一致，讲课版必须标出来。
- 链接：https://bytedance.larkoffice.com/wiki/JXC3wPYxziUiJLk9ZlOcYSZ2nsg

## R3 0930 关键变更：本地 LLM 从「分流」降级为「兜底」（副本完全没有）
- 在线时采信顺序：本地缓存 > 云端 Planner > 本地 LLM。
- 只有断网或本地 LLM 等待超时 3 秒，才采纳本地结果。
- navigation_search_poi 等不采纳；断网 NLG 单次唤醒周期只播一次。
- 链接：https://bytedance.larkoffice.com/wiki/JXC3wPYxziUiJLk9ZlOcYSZ2nsg 【讨论中】赛力斯

## R4 离线白名单到底放什么、为什么不放常规车控
- 白名单内容：通讯录拨号/紧急电话/本地音乐/媒体源/播放控制/退出语音/应用开关/地图控制/导航设置/倒车影像/灯光。
- **为什么「打开车窗」不放白名单**：这些指令要结合情景（谁在说、几个人、开车窗还是关车窗），放了白名单会变成纯指令解析，丢掉情景理解。
- feel 类意图（「我有点冷」）必须等云端 Planner，不能本地抢答。
- 链接：https://bytedance.larkoffice.com/docx/Nvj1dvkl8oOTAhxOjxAc0bn0nS0

## R5 离在线仲裁的兜底机制
- 无网络 → 兜底话术；服务端心跳 2 秒，2 秒无心跳判定断网。
- 断网时 unsupported_cloud → NLG「网络异常，请稍后再试」，单次唤醒周期只播一次，不重复烦用户。
- 链接：https://bytedance.larkoffice.com/docx/Nvj1dvkl8oOTAhxOjxAc0bn0nS0

## R6 端侧为什么会被判停失败（技术方案细节，副本没有）
- 云端 VAD 判定必须与端侧一致，否则 Speech 判停失败 → RTC 超时。
- taskId 追加上传，标识同一轮对话。
- 三路收云端消息；云端消息先到时要 block 等端侧 LLM（否则流式上屏错位）。
- request_id 是端云唯一凭证；conversation_id/chat_id/question_id/request_id 三端命名映射。
- 端侧依赖配置表 edge_side_dependency_config 按渠道/车型/版本隔离。
- 链接：https://bytedance.larkoffice.com/wiki/PtGPwsX4iiFDAEkKMNYcUYYjnph 、https://bytedance.larkoffice.com/wiki/BRtRwHgo4ivfr3k46LSciQi7nyd

## R7 TOB 简单复杂仲裁的分流口径（副本没收录）
- 应进 Planner：条件任务/持续任务的增删改查、face id 相关、记忆增删改查。
- 应走推理模型：记忆问答、情景问答、联网推理。
- 短期方案：直接按过召数据评测表判。
- 链接：https://bytedance.larkoffice.com/wiki/HY5QwcsEVioVaHkHlFFcwuoon3b

## R8 拒识的三级架构（画板 MzEgwW13，副本没有）
用户 Query → 离线客户端（高精度/低召回）模式匹配 → 云端服务：
- 阶段一：高召回拒识模型（recall 打回）。
- 阶段二：兜底模型 Planner/LLM（拒识打回阶段一；Timeout 回阶段一）。
- Advisor 做最终决策与回捞 → Final Decision → 可观测性平台。
- 视觉注意力（注视屏幕）作为强召回倾向信号进入 context。
- 链接：https://bytedance.larkoffice.com/wiki/JXC3wPYxziUiJLk9ZlOcYSZ2nsg

## R9 离线指令缓存的三条铁律（副本完全没有）
- 单轮解析：不引用历史对话。
- 上下文无关：「暂停播放」「继续播放」「就选它了」这类依赖上下文的，不进缓存。
- 结果唯一：一条指令必须映射到唯一意图+槽位组合，有歧义就回退到别的路径。
- 命中 cache 要求准确率 100%、响应 50ms。
- 初始缓存清单：导航回家/导航去公司/打开空调/空调调到23度/下一首/收藏音乐等。
- 链接：https://bytedance.larkoffice.com/wiki/IkRFwEv2biq6igkvlMtcfOiNnjb
