# ToB 资料有、副本缺的事实（按章节归类，特别标 ToB vs 豆包主链口径差异）

## 02 R 端云采信与拒识
- **拒识 5 类策略**：单轮拒识/多轮拒识/重复 query 召回/口语唤醒词召回/拒识后召回纠错。来源：<a href="https://bytedance.larkoffice.com/docx/Wj1ndq2iYoFsZ1xun79cEbkenBf">歧义识别-拒识&模糊意图</a>。【ToB 2.6】
- **指代 5 种类型**：代词指代（"他/她/它"）/指示代词（"这/那"）/特征代词（"第2个/红色的那个"）/别称指代（"丹子"=乔丹）/省略指代。每种都有正反例。
- **过拒 vs 过召平衡**：对话性交互怕过拒（该回的不回），精准指令怕过召（不该回的回了）。
- **ToB 口径差异**：豆包主链拒识是端侧离在线仲裁那套；ToB 拒识是云端意图中枢第一层，先拒识再落域分发 18+ 大垂类。副本 02 R 章需补"云端拒识 vs 端侧仲裁"两层关系。

## 05 D Director / 06 E 工具执行
- **Director Lite vs Director 国内版（奇瑞）两个 SKU**：Lite 目标"90% 端到端满足（行业 80%）"；奇瑞版集成 Tier1 镁佳、OMS 摄像头、DMS。来源：BR2gd / LpCRd。【ToB 2026】
- **ToB 分工**：火山做云端大模型+APP 集成；OEM 提供原有语音助手/UI/车控 SDK；Tier1（镁佳）做硬件（DMS/OMS/摄像头）。豆包主链是"豆包自己做整车 AI"，ToB 是"豆包卖大模型能力给车企"。
- **SFT vs PE 车控对比**：SFT 简单集 92.3%，复杂集 74.6%；PE 复杂集只有 57.5%（2W token，1-2 秒）。FC 相关 bug 占 60-70%。来源：车控 2.0 总文档。【ToB 现状】
- **简单意图 vs 复杂意图定义**：简单=功能指向唯一（控制+查询）；复杂=模糊指代+多步依赖。

## 11 I 记忆 / N9 知识库
- **ToB 记忆模块**：T+1 自动打包长期记忆块云端加密归档；语义检索默认 10 条最多 100 条，相似度 0-1；动态快速写入插队（用户说"记一下我喜欢苹果"立即写）；可按 User ID 不可逆删除。来源：<a href="https://bytedance.larkoffice.com/docx/L4vTdP2nPotl8ixZnDSctAZRnue">记忆模块 PRD</a>。【ToB 主线】
- **ToB 口径差异**：豆包主链记忆分瞬时/短期/长期情景/长期语义四层；ToB 记忆是通用组件，分画像+对话内容两类，没有豆包主链的"20 分钟/20 条"瞬时窗口。副本 11 I 章需补"ToB 记忆 vs 豆包记忆"两套口径并列。

## 15 S 主动服务
- **BASE/PRO/MAX 三版本分级**：BASE=规则推荐；PRO=AI 推荐固定事件库+我的场景+多模组合事件；MAX=AI 推荐自主事件+自主反思。来源：<a href="https://bytedance.larkoffice.com/docx/Xzcndx12mo3MXzxtvDxcJqJGnKe">大模型主动服务 PRD V0.4</a>。【ToB 2025】
- **模型反思 3 种**：固定事件反思（用户骂"傻X"后反思）/One more step（被动服务后多想一步）/自主反思（实时反思闭环）。
- **ToB 口径差异**：豆包主链主动服务是 Advisor+触发器底座；ToB 主动服务是独立产品线，按硬件能力分三档卖。

## N7 拟人对话 / S2S
- **S2S 融合主链路**：并行处理管理器——上一轮是闲聊→本轮并行开 S2S（音频流直进）+ 主链路（ASR 文本）；仲裁：主链路确认闲聊→S2S 结果优先；识别出非闲聊（车控/POI/联网）→立即中断 S2S，主链路 FC 结果优先。来源：<a href="https://bytedance.larkoffice.com/docx/JG2Rdfu3roBTqTxTFhTcBEmsnZh">S2S 融合主链路 PRD</a>。【ToB 2.6】
- **ToB 口径差异**：豆包主链 S2S 是离线 TTS 融合；ToB S2S 是云端实时音频流并行仲裁。

## N15 车企协作 / ToB 架构
- **火山 ToB 卖什么**：在线 ASR、TTS、S2S、联网 Agent 可单独售卖；生态 TikTok 短视频/Dola 新闻/谷歌 POI/Spotify/Here 地图；优先东南亚（印尼/马来/泰国/新加坡/港澳/澳洲），字节云 mya 机房。来源：Byteplus onepage。【ToB 2026】
- **合作车企**：奇瑞（Director 国内版）、比亚迪（融合共建方案）、一汽大众（S2S 融合）、吉利/北汽/长城（日志平台渠道标识）。

## N17 三方智能体 / 生态 Agent
- **已上线 12 个生态 Agent**：POI 推荐（抖音生活服务）/行程规划/车途问答（联网搜索）/LBS 问答（周边建筑）/前车识别（懂车帝）/用车助手（车书）/新闻/日报/播客（豆包播客模型）/音乐/长视频/短视频。来源：<a href="https://bytedance.larkoffice.com/docx/IfI7dfoXIozVYmxQblgc4FrYnBg">生态 Agent 一览 v1.0</a>。【已上线】
- **豆包主链 23 工具 vs ToB 12 Agent**：主链是 FC 工具粒度（车控/查状态），ToB 是 Agent 粒度（每个 Agent 内部自己 FC）。副本 N17 需补这个映射。

## N9 数据闭环
- **日志标注平台**：对话 ID=渠道+6 位日期+该渠道 query 序号（例 geely_240410_102033）；支持全量日志查看/手动标注/导出训练/规则统计。目标=数据飞轮雪球。来源：<a href="https://bytedance.larkoffice.com/docx/JgT1dzlYHoe73rxNI7JcGY4LnGd">日志标注平台 v1.2</a>。【ToB 主线】
