# 语音入口证据核验（2026-10-23）
## 范围与证据等级
本轮调用飞书搜索“流式二遍 ASR soft VAD hard VAD partial final 语音”，成功命中 30 项；完整相关命中元数据保存在文末。搜索展开含团队自制培训文，不能循环作为技术证明。另行实时完整读取以下三个原始正文，状态均 success。产品 PRD 和端侧仲裁方案使用主任务此前完整获取的本地正文，不能称本轮重验当前配置。
## 实读原始来源
S1 [AI汽车语音基础体验链路 OnePager](https://bytedance.larkoffice.com/wiki/GBcCw5c6xiWvGukPMQgcMiuKnEc)，章节“链路名词表”“端到端流程/主链路”“预请求介绍”。
S2 [ASR 最佳实践](https://bytedance.larkoffice.com/docx/AL7tdY8ShoA92NxJB7Ac6PyKnX5)，章节“二遍”“长语音判停”。
S3 [豆包语音识别模型 2.0 ONE PAGE](https://bytedance.larkoffice.com/wiki/BPFiwY9WKizW59kRKiBcOM6Ynxf)，功能清单“是否支持二遍识别”及说明。
S4 [多级 VAD 产品体验 PRD](https://bytedance.larkoffice.com/wiki/FzViwCNb2iF43QkB5eDcD3D2nJh)，本地 body-vad-prd.md，版本表 v0.1、2025-12-4、待评审。
S5 [服务端技术评审-多级 VAD 策略](https://bytedance.larkoffice.com/wiki/PJMUwwRCNiC2A8kjXCjcs4Bun7Y)，本地 body-vad-tech.md，预期收益、方案三。
S6 [离在线仲裁 PRD](https://bytedance.larkoffice.com/docx/Nvj1dvkl8oOTAhxOjxAc0bn0nS0)，本地 body-arbitration-prd.md，网络正常/正常唤醒场景。
## 可以原样引用的证据
S1：“流式二遍 ASR：分句后以非流式模型重识别并给出 final。”
S1：“Soft VAD：客户端快速停顿判断。300 ms 阈值触发 pre_query。可多次触发，不结束 ASR。”
S1：“Hard VAD：客户端确认用户说完。600 ms 阈值触发音频分段。”
S1：“端侧以 Hard VAD 600ms 确认说话结束，ASR 返回二遍 final 文本，发送正式最终 Query。”
S1：正式请求复用缓存需要“requestID 相同”且“正式 Query 与前一轮预请求 Query 完全一致”，否则正式重算拒识与 Context。
S2：“二遍：既要流式上屏，又要nostream的准确性，音频流同时过两种ASR，通过双向流式的输出来上屏，根据双向流式返回的一些信号给nostream发送结束指令，拿到nostream后替换双向流式的结果。”
S3：开启二遍会默认开启 VAD 分句，默认 800ms 可通过 end_window_size 配置；分句判停时非流式模型重识别，输出 definite:true。此为通用模型默认，不是汽车实配，不与 600ms 相加。
S4：Soft 300ms，Hard 500ms，语义 VAD 1000ms，时间暂定、可随实车体验变更；抢跑只做拒识/意图/简单复杂，不抢跑至 FC/Planner/DM。
S5：预请求前置无状态处理；推荐预请求直接 HTTP 到 AIDV，不经过豆包正式文本链路。200ms 收益是预期收益，不能写成实测已节省。
S6：“用户语音交互的音频分别给到「离线链路」和「在线链路」并行处理”；命中离线白名单立刻执行，否则等云端；2S 无心跳进入端侧非白名单兜底。feel 类“我有点冷”要等云端，不可直接使用端侧结果。
## 名词、输入输出、业务作用与失败表现
| 术语 | 给产品的解释 | 输入 → 输出 | 为什么需要 | 失败时用户看见什么 |
|---|---|---|---|---|
| 唤醒 | 建立“现在开始跟助手交互”的入口 | 唤醒词等入口 → 交互启动 | 区分待机与正式交互 | 叫了没反应或误唤醒；具体量产唤醒词需车型确认 |
| ASR | 把声音写成文字 | 音频 → 识别文本 | 后面的理解模块需要文字输入 | 24 听成 14；这时先排识别，不直接怪 Planner |
| 流式 / partial | 用户还在说，系统先返回已听到的过程文字 | 持续音频片段 → 多次可修正文本 | 尽早反馈、支持流式判断 | 临时文字不完整；不可把过程字当正式定稿 |
| 流式二遍 / final | 同一段声音再用较完整条件识别，得到本段定稿 | 分段音频 → final 文本 | 兼顾及时出字和准确性 | final 仍可能错；二遍超时用谁兜底未取得明确规则 |
| VAD | 判断声音中的说话活动及停顿，辅助决定何时收尾 | 音频活动/停顿 → 开始或结束相关信号 | 等太久慢，收太早丢半句 | 用户还没说完就处理、或者说完长时间等 |
| Soft VAD | “可能说完了，先做准备，仍继续听” | 较短停顿+已有文字 → 预请求机会 | 把部分准备藏在判停间隙 | 预请求错字需重算，缓存未命中不等于交互失败 |
| Hard VAD | “按当前策略确认这一段收尾” | 较长停顿 → 分段/结束信号 | 为最终识别与正式请求提供边界 | 过早截断或等待过长；600ms 非收到回答时间 |
| 语义 VAD | 再看句子是否像说完整了 | 已有句子 → 完整性判断/延长等待 | “把空调调到……”仍缺目标值 | 完整性判断也会错；与 600ms 优先关系未展开 |
| 预请求 | 用当前文字提前准备，但不提前动车 | 当前 Query/request_id/round_id → 暂存准备结果 | 正式文字一致才复用 | 错用缓存会沿旧意思处理；实现验收需检查 |
| 端云仲裁 | 端和云可能都有结果，决定哪一条办理本轮任务 | 端结果+云结果+网络/白名单策略 → 采用路径 | 快路、理解能力、无网能力取舍 | 重复执行/选错路/上下文不同步是验收风险 |
| TTS | 把要说的文字合成声音 | 回复文本 → 音频分片 → 播放 | 用户听到反馈 | 文字已出但无声，需区分合成、下发、拉流、播放 |
## 时序与版本红线
1. ASR 在听字、VAD 在判停，是同一段音频上的并行工作；禁止画“先 VAD 全结束再开始 ASR”。
2. 按 S1 具体基线可以画 Hard VAD → 二遍 final → 正式 Query；不要推广为所有 ASR、车型、分句场景唯一实现。S2 的通用二遍可以同时接收音频，两路结果输出节奏不同。
3. 二遍纠错处理“文字准不准”；端云仲裁处理“哪个执行结果被采用”，不是同一件事。
4. S1 300/600ms、S4 300/500/1000ms、S3 默认800ms 均分来源显示，不取平均、不拼相加。S1 对语义 VAD 有参与依据，优先级/延长上限未完整展开。
5. “豆包，把空调调到24度”为教学请求，不证明单“豆包”就是车型实际唤醒词；S1 的简单车控本地命中路径与 S6 白名单口径需按车型版本确认，不能凭简单就宣称本地必执行。
## 本轮飞书搜索返回元数据
```json
{
  "status": "success",
  "total": 30,
  "results": [
    {
      "result": {
        "rank": 1,
        "title": "豆包汽车语音链路详解 × 语音产品经理工作地图",
        "url": "https://bytedance.larkoffice.com/docx/T9RAd5dcUoSBY3xbr5tcFvxonJg#doxcnxbKyrEnB6KL3j4g19rmOGb",
        "type": "DOCX",
        "updated_at": 1791989845,
        "owner": "王泽民",
        "summary_excerpt": "例子：你说「导航去……」停了一下，Soft VAD 300ms 就抢跑请求云端，Hard VAD 500/600ms 二次确认，语义 VAD 发现你话没说完（「我想订一张去…上海的机票」）就再等你 1000ms。 端侧调用思必驰 ASR 接口能力提供 VAD； 2.10 二遍 ASR（流式二遍 / 方言二遍）"
      },
      "status": "expanded"
    },
    {
      "result": {
        "rank": 2,
        "title": "AI汽车语音基础体验链路OnePager",
        "url": "https://bytedance.larkoffice.com/wiki/GBcCw5c6xiWvGukPMQgcMiuKnEc#QLCEdJOObopUZ4xIizFcDCk4n9n",
        "type": "DOCX",
        "updated_at": 1792566823,
        "owner": "陈民瑞",
        "summary_excerpt": "端侧仅上送音频并控制 VAD，端侧收到流式ASR结果，以 Soft VAD 触发本轮预请求、以 Hard VAD 600 ms 结束 ASR 并发起正式请求。 流式二遍 ASR"
      },
      "status": "expanded"
    },
    {
      "result": {
        "rank": 3,
        "title": "语音产品经理面试备战手册 · 豆包汽车座舱版",
        "url": "https://bytedance.larkoffice.com/docx/QdaXdDVTSopBdJxfnrWczBEYnof#doxcn5TF2cDpubs6okqiveXyPFe",
        "type": "DOCX",
        "updated_at": 1792570151,
        "owner": "王泽民",
        "summary_excerpt": "级助手的语音交互段来看，我盯的是 Director 也就是对话推理引擎这一层怎么把话听懂、把事办完，ASR 语音识别是更底层的感知能力，跟我不是并列的两条路线，会议总结、纪要只是另一种应用目标，实时问 用多级 VAD PRD 里的一个真实片段走一遍这个流程：用户说“播放音乐”，Soft 段在 300 毫秒短停顿上做预处理，识别把它误成“播放音月”，预处理可能被拒识或者错处理，Hard 段在 500 毫秒二次确认时识别正确，两路文本比对不一致，系统以 Hard 的最终文本重新请…"
      },
      "status": "expanded"
    }
  ]
}
```
