---
name: project-feishu-bot-architecture
description: 第二只虾飞书机器人=本机服务feishu-knowledge-assistant，含排障路径、重启方法、三大读取缺口的修复结论
metadata: 
  node_type: memory
  type: project
  originSessionId: ae8d47e5-7f75-4083-b61d-f4a30e37ec23
  modified: 2026-08-19T03:10:08.015Z
---

「第二只虾」飞书机器人（自建应用 cli_a927e3c3eeb8dbcd）= 本机服务 `~/Documents/Codex/2026-08-04/w/feishu-knowledge-assistant`，端口 8788，launchd 守护 `gui/501/com.bytedance.feishu-knowledge-assistant`，重启用目录里的「双击重启飞书助手.command」或 `launchctl kickstart -k`。链路：飞书消息 → WS 长连接 → Codex CLI（LLM_PROVIDER=codex_cli）→ MCP 工具读飞书。

2026-08-13 排查出的三大读取缺口及修复：
1. 合并转发消息（merge_forward）读不了 → `GET /open-apis/im/v1/messages/:id` 返回的 items 含子消息（带 upper_message_id），服务已加展开逻辑（commands.ts `expandMergeForwardIfApplicable`/`handleMergeForwardAndReply` + handlers.ts 分支，回复合并转发消息时也会展开父消息）
2. 云文档全局搜索 `search/v2/doc_wiki/search` 在字节租户恒返回空 → 已加降级到知识库搜索 `wiki/v1/nodes/search`（`searchWithWikiFallback`，输出带 search_channel 字段）
3. 两条搜索都空 → 自动给「Aime 个人助理」会话（chatAliases 配置）发代查 prompt 并轮询 45 秒等回复（`askAimeFallback`）

注意：Meego 单据无接口，永远要手动贴内容；用户令牌存在 sqlite 里 AES-256-GCM 加密（TOKEN_ENCRYPTION_KEY 在 .env）；子消息里的图片/文件资源开放平台不支持下载。

排版红线：飞书纯文本消息不渲染任何 markdown（表格竖线会原样乱码）——排版硬约束已写进 server.ts 的 developerInstructions（禁表格/#/**/代码围栏，结论先行+【重点】标记+按维度逐行对比）；白板触发已放宽（isExplicitWhiteboardCreationRequest 支持"画成图/生成对比图"等不点明白板的说法），模型被指示对比≥3对象时主动提议画图。撞锁（already has an active writer）已加阶梯等待重试（codexAppServer.ts resumeAfterWriterSettles）+ 可重试名单。

**Why:** 服务是自建的，排障必须读本机代码和日志（data/service.log），飞书后台看不出问题
**How to apply:** 再遇到机器人"读取失败"，先 curl 实测接口（解密脚本模式：TokenCipher + sqlite user_tokens），再看 data/service.log；改代码后 `npm run build` + launchctl kickstart

2026-08-17 第二轮修复（"任务有哪些"读不到/继续查答非所问）：
- 根因=路由层 `classifyFeishuToolRequirements`（agentRequestPolicy.ts）不认识「任务/待办+时间范围」类问题 → 返回0个必读源 → 宿主不预读，全靠模型自觉调 MCP 工具，工具一挂就瘫。修法：加 taskOverview 分支强制 calendar+chat 双源预读（宿主预读=in-process，不走 MCP，天然更稳）
- 「继续查/接着看」之前不匹配续问合并（只认光杆"继续"）→ 当新消息自由发挥翻旧账。已扩展 EXPLICIT_CONTINUATION_PATTERN
- calendarQueryWindow 不认识"最近一周/过去N天"→ 默认只读今天。已补分支
- node-cron 在 Mac 睡眠时错过执行不补跑（8-15/16/17 连续错过 9:00 日报）→ summarization.ts 加了补跑：sync_cursors 记 last_run，启动时+每15分钟（7,22,37,52分）检查"今天点过了但没跑"就补
- 架构要点：hostFeishuRetrieval.prefetchFeishuRetrieval 是确定性预读层（按域 chat/documents/calendar/meetings/minutes），routing 决定读哪些域 → 新需求优先加路由，别指望模型自觉
- 任务盘点类查询的聊天侧必须走通配"*"扫描（chatSearchPlan 的 isTaskOverviewQuery 分支），关键词搜索匹配自然语言问句必 0 命中；汇总侧加了「盘点规则」强制按天列全部日程（buildHostSynthesisPrompt），否则模型只挑有纪要的几场
- 空群摘要：summarizeChatWindow 在 context.count===0 时返回""不调模型，runOnce 合并成一句"当天没有新消息"（避免模型对空输入编一屏「暂无」模板）
- 「不够详细」追问=详细化追问（detailedFollowup），buildHostSynthesisPrompt 有专门规则：详细=更深业务解读（每场会背景/决策/负责人/下一步），禁止贴工程字段；且 compactCalendarEvent 已确定性剥离 event_id/self_rsvp_status/meeting_link/status 字段（模型拿不到就贴不出来），测试断言这些字段必须 absent
- 关键教训：buildHostSynthesisPrompt 是死代码（无调用方，仅测试引用）！真实合成路径=chunkedSynthesis.ts 两段式（buildSourcePrompt 分源摘要→finalShell 最终答案），改输出格式必须改 finalShell/sourceShell。任务四行格式（背景/做到什么程度/怎么做/信息源）写在 finalShell 的 taskOverview||detailedFollowup 分支；sourceShell 负责保留来源名称+日期+完成标准线索
- 用户看到的"原始字段乱倒"大多是 formatEvidenceBrief 兜底（合成阶段 Codex 失败/超时就降级）：症状=开头"答案整理服务刚才繁忙"。已修：兜底不输出"未知"占位/不泄露ID、源阶段和最终阶段各重试1次（间隔800ms）、Codex容量/鉴权抖动看 service.error.log 的 command handling failed

2026-08-19 第三轮修复（"找一下关于触发器评审的会议"答"未检索到"）：
- 根因=会议/妙记检索把用户整句原文直接当搜索词发给 vc/v1/meetings/search 和 minutes/v1/minutes/search，这两个接口按主题关键词匹配，口语整句（带"帮我找一下""的相关的"）必 0 命中；实测同一句子 0 条、"触发器评审"关键词 5 条会议+3 条妙记
- 修法：commands.ts 新增 meetingQueryKeyword（引号词→前缀动词剥离"帮我找一下/我想了解"→循环剥离尾部的/相关的+会议/评审/纪要/对齐/讨论等名词；疑问句"哪些/什么/怎么"直接放弃提取），meetingContext/minuteContext 零结果时自动用关键词重试，返回 JSON 带 search_query 实际用词
- 注意：meetingContext 是宿主预读层（hostFeishuRetrieval 的 meetings/minutes 域）和 Agent 工具层（feishuTools 的 feishu_search_meetings/feishu_search_minutes）的共同收口，改这里两处链路同时修好；正则提取故意保守，提不出词就回退原文不再重试
