<quote-container>

生成时间：2026-10-14（Asia/Shanghai）

读者：刚入职的豆包汽车 AI 产品经理。术语第一次出现时给出解释。

边界：仅本次在**当前账号可访问的飞书资料中发现的汽车智能座舱语音内容；不声明账号全量扫描**，不扩展普通豆包 App 与无关 B2B 产品线。搜索召回 ≠ 全量。

状态口径：凡来源不能证明「已上线/已发布」的，一律标注为**方案/需求/待确定**；文档自称现行时标「文档描述的方案（时点/车型）」，跨车型现网未证明会提示。指标【目标值】与【实测值】严格分开。

本文为豆包汽车智能座舱语音链路的资料梳理；正文每条事实后附完整原始 URL（含查询参数与锚点）。
</quote-container>

---

## 1. 先读结论与使用方法

**你会遇到的问题**：同一能力（VAD 阈值、音色、打断规则、离在线仲裁）在不同 PRD、OnePager、SOW、发版记录里写的版本和数字经常对不上；有的是已评审需求、有的是待评审方案、有的是历史演示版、有的只是索引目录。直接拿任何一篇「对别人讲」都容易出错。

**资料为何这么混杂**：

- 文档按项目（上汽 DNA1.0、赛力斯 SLS/E68、路特斯 0.5、AUDI PP02）和按时间（202509 / 202511 / 202607 架构、S7/S8/S9 规划）双线演进，互不自动合并。
- 同一文档里同时存在「现行机制」和「已划删除线的旧方案」，误读会把历史当现网。
- 治理/制度类文档（接口指南、账号规范、合规培训）即使标「现行」，也只约束**接入与合规流程**，不等于座舱功能已部署。

**怎么按场景找证据**：

- 想讲「用户开口到出文字这一段」→ 第 4 章（输入与端侧）。
- 想讲「出文字后怎么决策、调工具、车控」→ 第 5 章（理解与 Planner）。
- 想讲「怎么播报、打断、恢复、TTS」→ 第 6 章（输出与交互）。
- 想对齐「这是哪一版、哪个车型、目标还是实测」→ 第 7、8 章。
- 想在跨团队评审质疑、定位 badcase → 第 10 章（四分法）。
- 想知道「哪些没读到、先读哪几篇」→ 第 11、12 章。

---

## 2. 覆盖范围与资料核读口径

**检索与归并方式**：围绕输入链路、Planner/语义、输出体验、横向治理四个主题做主题检索与关联资料核读；本稿按文档标识去重合并，不把各主题检索结果的 URL 简单累加。

**来源统计（按文档维度）**：

<lark-table rows="10" cols="2" header-row="true" column-widths="328,328">

  <lark-tr>
    <lark-td>
      口径
    </lark-td>
    <lark-td>
      数量
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      各主题检索到的来源记录合计
    </lark-td>
    <lark-td>
      99 条
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      去重后独立文档
    </lark-td>
    <lark-td>
      **78 篇**
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      多主题重复引用的文档组
    </lark-td>
    <lark-td>
      14 组（如 OnePager、FeatureList、上汽 SOW、Fornax SOP 被多个主题引用）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      全文获取（整篇取回正文）
    </lark-td>
    <lark-td>
      44 篇（其中 3 篇为部分抽读，见下注）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      片段/索引摘录（只读到召回片段或某一工作表区间）
    </lark-td>
    <lark-td>
      30 篇
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      无法核读（在 78 篇之内）
    </lark-td>
    <lark-td>
      4 篇（D01–D04，权限不足）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **78 篇合计**
    </lark-td>
    <lark-td>
      **44 + 30 + 4 = 78**
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      另计：78 之外的访问受阻记录
    </lark-td>
    <lark-td>
      3 项（D05 权限、D06 链接失效、D07 权限）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **全发现集不可核读合计**
    </lark-td>
    <lark-td>
      **7 项 = 权限不足 6 + 链接失效 1**（见 11.C）
    </lark-td>
  </lark-tr>
</lark-table>

**工作表另计独立资料入口**：同一篇表格文档内不同工作表/区间是不同资料入口，按 sheetID 分别列出、保留原始 URL，不因同文档而合并丢弃。本次涉及 7 个表格文档、共 15 个区间引用入口（按 raw_urls 原样统计；15 是区间引用次数，不是 15 个独立 sheet，同文档多区间不新增文档数；unique doc token 集合 = PHXzs0 / IElLs / A5I1s / KqSDw / Ur3Zw / WA3ow / EOQQw）：

<lark-table rows="13" cols="2" header-row="true" column-widths="328,328">

  <lark-tr>
    <lark-td>
      表格文档
    </lark-td>
    <lark-td>
      工作表 / 区间入口
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      【AI汽车】FeatureList（PHXzs0…）
    </lark-td>
    <lark-td>
      ① sheet=69a063 range=QTM6VTEz（语音基础能力指标）；② sheet=69a063 range=QTc5OlU5Mg==（TTS 区间）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      上汽DNA1.0量产跟进（IElLs…）
    </lark-td>
    <lark-td>
      sheet=tTVqGt range=QTI6RjI1（SOW-DIFF）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      上汽车书测试集（A5I1s…）
    </lark-td>
    <lark-td>
      sheet=0N3kgt range=QTIyOkpTMjI=
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      E68车型功能清单（KqSDw…）
    </lark-td>
    <lark-td>
      ① sheet=5jnbF3 range=QTY0OkU5OA==；② sheet=QopqpZ range=QTgyOk45OA==
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      Ai汽车测试质量评测标准（Ur3Zw…）
    </lark-td>
    <lark-td>
      ① sheet=1Pt0v1 range=QTI6TjIw；② sheet=pGv2n1 range=QTI6VjE3
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S2S 测试用例&结果（WA3ow…）
    </lark-td>
    <lark-td>
      sheet=n7V2ct range=QTM5Ok04MQ==
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      FeatureList AUDI PP02 区间（PHXzs0…）
    </lark-td>
    <lark-td>
      sheet=fgeJX3 range=QTkwOk8xMDA=（AUDI PP02 交付范围）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      AIVA 需求管理·每周进展（EOQQw…）
    </lark-td>
    <lark-td>
      sheet=yGuk5T range=QTQxOk00OA==（每周进展子表）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      FeatureList 补充区间（PHXzs0…）
    </lark-td>
    <lark-td>
      sheet=69a063 range=QTkzOlUxMDM=
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      上汽车书第二子表（A5I1s…）
    </lark-td>
    <lark-td>
      sheet=jpI1rn range=QTg4OkNCODg=（第二 sheet，保留）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      AIVA 排期区间（EOQQw…）
    </lark-td>
    <lark-td>
      sheet=3e9Y0x range=QTEwOkFTMTc=
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      AIVA 需求 FL 区间（EOQQw…）
    </lark-td>
    <lark-td>
      sheet=3e9Y0x range=QTM6QVM5
    </lark-td>
  </lark-tr>
</lark-table>

<quote-container>

读取深度分档：**全文获取**＝整篇正文取回成功，但「取回成功」不等于逐段核读到同等深度；**片段**＝只读到索引/检索召回片段或某一工作表区间；**目录入口**＝只读到标题骨架；**权限不足**＝访问被拒，按任务约束不申请、不追问、不联系。索引父文档读取成功 ≠ 其子文档读取成功。

**明确为部分抽读的 3 篇（其余全文获取也不保证逐段核读）**：①《ASR与TTS 日志排查及问题整理》——fetch 约 34.7KB，仅核读前约 7000 字符；② 豆包 InCar 客户端发版记录——fetch 约 14 万字符，按语音/SDK 相关关键词抽取；③《座舱 Planner 探索（算法设计稿）》——长文仅要点摘录。Audi PP01/PP02 大模型发版记录保持片段摘录口径，不列入部分抽读。
</quote-container>

**本次未覆盖/权限边界**：

- 全发现集共 7 项无法核读（见第 11 章目录 D-01～D-07）：其中 4 项在 78 篇来源内（D01–D04，权限不足），另 3 项为 78 之外的访问受阻记录（D05 横展/非豆包账号体系架构 权限不足、D06 工具库 V1.0 链接失效、D07 2025 版场景智能助手 PRD 权限不足）。合计权限不足 6、链接失效 1。
- Aime 自动聚合的《AI 汽车相关文档全集》单篇即收录 1098 篇，本次仅抽读其中「豆包车载」「座舱 AI 通用」两节并筛出语音候选，**不代表已遍历 1098 篇**。
- 跨租户链接（pq3b44yw2t9.feishu.cn、lotuscars.feishu.cn、sai-seres 等）未验证。
- 海外套件（一代/二代海外）语音入口未命中；语音内容审核/敏感词/声音版权专项未命中。

---

## 3. 端到端链路总图（资料归并示意，非所有车型统一现网架构）

<quote-container>

下图是按多篇文档拼合的**示意链路**，用于建立心智模型；其中带 标注的节点是「待评审方案」「历史方案」或「某项目设计稿」，**不能当成现网事实对外讲**。
</quote-container>

```plaintext
用户开口
  │
  ├─ N1 端侧声学前端：麦克风阵列 / 降噪回声消除 / 音区识别（思必驰交付，端侧）
  │      声源定位误差 ±20cm，按座位 5/6 音区；车外唤醒抑制=PRD 标注 TBD（供应商不支持）
  ▼
  ├─ N2 唤醒/触发：唤醒词「豆包豆包」（不可自定义）/ 硬按键 / 全时免唤醒（PRD v0.2 已评审，方案非已上线）
  ▼
  ├─ N3 VAD：Soft 300ms 端侧停顿 → 预请求 /aidv/v1/pre_query（只做拒识+Context 前置，不进对话历史）
  │          Hard 600ms（OnePager）/ 500ms（多级VAD PRD）两文档不一致，生效值待确认 → 结束 ASR 发正式请求
  │          语义 VAD 1000ms 延长收音 仅待评审三级方案
  ▼
  ├─ N4 ASR：一遍流式 partial（仅供实时判断/抢跑）；二遍非流式重识别 final（正式 Query）
  │          在线首字≤200ms/尾字≤500ms；离线车控≥90%、仅普通话；热词云端注入、不保证 100% 生效
  ▼
  ├─ N5 端云接入：request_id=端云唯一标识；WS 长链传音频、HTTP-SSE 短链传文本；TTS 音频 AIDV 缓存、凭 tts_audio_id 走 WS 拉流
  │          （202607 当前方案；202509 走 RTC 已列历史）
  ▼
  ├─ N6 离在线仲裁：无网强离线兜底；有网音频并行双链路；端侧白名单命中即本地执行，未命中等云端；feel 类意图必须等云端
  ▼
  ├─ N7 多音区合并：每音区独立音流；同时说→合并为「主驾说X，副驾说Y」（上限暂 4 条），仅合并非拒识 query；指令冲突应反问
  ▼
  ├─ N8 拒识/快路径：句法 RAG + SimpleIntent + 拒识在 Planner 前规则级拦截，命中即跳过 Planner 推理
  ▼
  ├─ N9 Context/记忆：预注入常用数据覆盖约 80% 常规请求；不足由 Planner 调检索工具按需兜底 20%（V2 P90 564ms）
  ▼
  ├─ N10 Planner（ReAct 闭环）：Eino ReAct 图，LLM 每轮输出 talk_or_not/talk_content/emoji_id/action_list/goal_list_update；
  │          action_list 非空且 step≤20 → tools 节点；否则 direct_return
  ▼
  ├─ N11 Agent Server 工具执行：AgentType 六类（AIDV/DPFM车控/Doubao/Ecology三方/Offline端侧/InternalRPC）；
  │          Redirect≤2 次；执行结果 mergeToolOutputs 回灌成 observation
  ▼
  ├─ N12 车控/导航/音乐执行：最小拆解单元=单一设备操作；高频核心能力打散成 tool，长尾复杂闭环才单独成 agent
  ▼
  ├─ N13 NLG/TTS：talk_content 按 [情绪] 分段合成；[唱] 改走 S2S；温柔桃子音色（SAMI BigTTS）
  ▼
  ├─ N14 播放/打断/恢复：partial 先停播、final 决定是否恢复；拒识→Event 续播未播 pcm；召回→Planner 融合未播内容生成新 NLG
  ▼
  └─ N15 会话结束 / Input Manager 状态机（Seres 一期设计稿，三层协调概念「现有代码中并不存在」，非已上线）

主动触发（单列分支）：端信号/时间(Cron)/推理(VLM) → 触发器规则+频控（30s 内同场景一次）→ Advisor/Goal → 经 Frontier 推端侧 → 车端携推荐标识回流进 Planner
```

**链路示意依据**：[OnePager](https://bytedance.larkoffice.com/wiki/GBcCw5c6xiWvGukPMQgcMiuKnEc?from=lark_search_qa&ccm_open_type=lark_search_qa#doxcnVCBIOkWMJ3FE7KvuGF8OLh)、[豆包×AIDV端云链路 One Page](https://bytedance.larkoffice.com/wiki/DBRnwrLFNiPxV5kZZOXcBYxqnCl?from=lark_search_qa&ccm_open_type=lark_search_qa#doxcnoo8QmUh1XSrQVV5euppWMd)、[AIDV Planner One Page](https://bytedance.larkoffice.com/wiki/EWziwFVftiGvnlk0FA4cadqonud)、[内部技术架构](https://bytedance.larkoffice.com/docx/SupzdFrzjoXqhpxiYevcGsO0nXb)。

---

## 4. 输入与端侧（开口 → 可供语义处理的输入）

### 4.1 麦克风与声学前端

- 端侧实现、思必驰交付；最终输出「单声道、去回声、16kHz PCM」给识别。来源：[上汽DNA1.0量产跟进](https://bytedance.larkoffice.com/sheets/IElLs7N8yhgXnRt8bmxcRj4dnwd?sheet=tTVqGt&range=QTI6RjI1&from=lark_search_qa&ccm_open_type=lark_search_qa)
- 指标：降噪回声消除处理时延 ≤50ms、信噪比 ≥20dB、回声消除约 4 路扬声器参考音；声源定位误差 ±20cm、5/6 音区、主驾靠背 >120° 躺平仍识别为主驾音区。来源：[车内语音 PRD](https://bytedance.larkoffice.com/wiki/UIcgwzzo9iCQ2tkDz44cSjXXnBf)
- **唤醒抑制**（车外人喊「豆包豆包」、手机播到唤醒词）PRD 标 TBD，文中明确「供应商不支持」。来源：[车内语音 PRD](https://bytedance.larkoffice.com/wiki/UIcgwzzo9iCQ2tkDz44cSjXXnBf)。
- 「标定需 2 个月」出自 FeatureList 车企依赖列，范围仅限思必驰端侧感知功能行，非全链路口径。来源：[FeatureList](https://bytedance.larkoffice.com/sheets/PHXzs0YEmhomVQtvpcbcdsXqneg?sheet=69a063&range=QTM6VTEz&from=lark_search_qa&ccm_open_type=lark_search_qa)

### 4.2 唤醒与触发

- 唤醒词「豆包豆包」、不支持自定义；PRD 指标：唤醒响应 ≤350ms、安静 ≥98%/嘈杂 ≥95%、误唤醒 ≤12 小时 1 次。来源：[车内语音 PRD](https://bytedance.larkoffice.com/wiki/UIcgwzzo9iCQ2tkDz44cSjXXnBf)
- FeatureList 量产口径与 PRD **并存需对齐**：唤醒率安静≥98%/中速关窗≥95%/高速关窗≥95%、误唤醒≤10 小时 1 次、平均耗时≤500ms（PRD 写 350ms/12h）。来源：[FeatureList](https://bytedance.larkoffice.com/sheets/PHXzs0YEmhomVQtvpcbcdsXqneg?sheet=69a063&range=QTM6VTEz&from=lark_search_qa&ccm_open_type=lark_search_qa)
- 硬按键：方向盘/中控按键可唤醒。来源：[E68功能清单](https://bytedance.larkoffice.com/wiki/KqSDwFmXoi8830kmLiScLZUCnGc?sheet=5jnbF3&range=QTY0OkU5OA==&from=lark_search_qa&ccm_open_type=lark_search_qa)
- 全时免唤醒【PRD·已评审 v0.2】：默认开启（开关暂定名「陪伴模式」），全车 4 音区；按座椅传感器+Face id 判座位有人；激活后 30 秒连续对话倒计时；未激活态拒识不上屏文本；手持手机通话场景该音区强拒识且不上云。来源：[多音区全时免唤醒 PRD](https://bytedance.larkoffice.com/wiki/W7kxwMqwmitpjSkv9BAcakO1nSR)
- 旧「主驾免唤醒」章节在车内语音 PRD 中已标「（删除）」，不要按旧版讲。来源：[车内语音 PRD](https://bytedance.larkoffice.com/wiki/UIcgwzzo9iCQ2tkDz44cSjXXnBf)

### 4.3 VAD（判断用户说完没）

- **现行链路文档口径**：Soft VAD 300ms 端侧停顿 → 预请求（/aidv/v1/pre_query，只做拒识/Context 前置、不进对话历史）；Hard VAD **600ms** → 结束 ASR 发正式请求；预请求复用条件为 request_id 相同且正式 Query 与预请求 Query 完全相同。来源：[OnePager](https://bytedance.larkoffice.com/wiki/GBcCw5c6xiWvGukPMQgcMiuKnEc?from=lark_search_qa&ccm_open_type=lark_search_qa#doxcnVCBIOkWMJ3FE7KvuGF8OLh)
- **PRD·待评审 v0.1 口径**：Soft 300ms 抢跑、Hard **500ms** 二次确认、语义 VAD 1000ms 延长收音；抢跑只跑拒识/意图/简单复杂。来源：[多级VAD PRD](https://bytedance.larkoffice.com/wiki/FzViwCNb2iF43QkB5eDcD3D2nJh)
- **冲突保留**：Hard VAD 阈值两份文档不一致（600 vs 500ms），生效值待向算法确认；不推断差异原因。
- 抢跑失败案例：300ms 误识别「播放音月」先预跑、500ms 纠正「播放音乐」后重请求。来源：[多级VAD PRD](https://bytedance.larkoffice.com/wiki/FzViwCNb2iF43QkB5eDcD3D2nJh)

### 4.4 语音识别 ASR

- 一遍流式 ASR：说话中持续返回 partial，仅用于实时判断、不代表最终文本；二遍流式 ASR：分句后非流式模型重识别出 final，作为正式 Query。来源：[OnePager](https://bytedance.larkoffice.com/wiki/GBcCw5c6xiWvGukPMQgcMiuKnEc?from=lark_search_qa&ccm_open_type=lark_search_qa#doxcnVCBIOkWMJ3FE7KvuGF8OLh)
- 在线 ASR 指标：首字延迟 ≤200ms、尾字 ≤500ms、句准安静 ≥95%/嘈杂 ≥90%。来源：[车内语音 PRD](https://bytedance.larkoffice.com/wiki/UIcgwzzo9iCQ2tkDz44cSjXXnBf)
- 离线 ASR 指标：车控 ≥90%、导航/媒体/通讯 ≥85%、离线平均耗时 ≤500ms，仅普通话。来源：[FeatureList](https://bytedance.larkoffice.com/sheets/PHXzs0YEmhomVQtvpcbcdsXqneg?sheet=69a063&range=QTM6VTEz&from=lark_search_qa&ccm_open_type=lark_search_qa)
- 离在线上屏：先流式上离线结果、最终用在线 final 刷新；无网完全用离线结果。来源：[车内语音 PRD](https://bytedance.larkoffice.com/wiki/UIcgwzzo9iCQ2tkDz44cSjXXnBf)
- 热词：PRD 要求至少 3000 个（通讯录人名、界面 icon 文字等）；OnePager 列分类数量（人名1000/地点500/媒体1000/可见即可说500/车控1000/对话历史5轮），云端维护、建联与上行注入、**不保证 100% 生效**。来源：[车内语音 PRD](https://bytedance.larkoffice.com/wiki/UIcgwzzo9iCQ2tkDz44cSjXXnBf)、[OnePager](https://bytedance.larkoffice.com/wiki/GBcCw5c6xiWvGukPMQgcMiuKnEc?from=lark_search_qa&ccm_open_type=lark_search_qa#doxcnVCBIOkWMJ3FE7KvuGF8OLh)

### 4.5 端云接入与离在线仲裁

- 当前链路（One Page 标注「当前方案 202607 版」）：客户端→（WS 长链，音频）→AIDV→Speech 云 ASR；ASR 文本回客户端；客户端→（HTTP-SSE 短链）→豆包云端→AIDV；TTS 音频由 AIDV 缓存，客户端凭 tts_audio_id 走 WS 拉流。打断判定在豆包云端。来源：[豆包×AIDV端云链路 One Page](https://bytedance.larkoffice.com/wiki/DBRnwrLFNiPxV5kZZOXcBYxqnCl?from=lark_search_qa&ccm_open_type=lark_search_qa#doxcnoo8QmUh1XSrQVV5euppWMd)
- request_id=端云链路唯一标识；round_id=同一 request_id 内轮次递增。新链路准入：Query 必须带非空 request_id，RTC 等渠道暂走旧链路。来源：[OnePager](https://bytedance.larkoffice.com/wiki/GBcCw5c6xiWvGukPMQgcMiuKnEc?from=lark_search_qa&ccm_open_type=lark_search_qa#doxcnVCBIOkWMJ3FE7KvuGF8OLh)、[输入管理模块设计](https://bytedance.larkoffice.com/wiki/UsHgwkm2Sig3blkAttBclYb0n4g)
- 离在线仲裁：无网强离线、不懂则兜底话术；有网音频并行双链路；命中端侧白名单立即执行，未命中等云端、端云心跳 2s 无心跳则端侧兜底；feel 类意图（「我有点冷」）必须等云端。白名单逻辑：无需情景信息即可判定、在线 ASR 更好的场景才进（通讯录拨号、媒体源切换、退出语音、地图控制等）；常规车控故意不放白名单。来源：[离在线仲裁 PRD](https://bytedance.larkoffice.com/wiki/DZzYwDOiviwAqHkeVx1cSFKinnh)
- SOW 口径：无网选离线、有网全部采信云端。来源：[上汽DNA1.0量产跟进](https://bytedance.larkoffice.com/sheets/IElLs7N8yhgXnRt8bmxcRj4dnwd?sheet=tTVqGt&range=QTI6RjI1&from=lark_search_qa&ccm_open_type=lark_search_qa)
- 已知缺口：端侧未传 channel 与 vehicleID，TOS 音频路径留空目录。来源：[ASR与TTS日志排查](https://bytedance.larkoffice.com/wiki/WwpFwoUNLikhxmkIhKwciSCEnYy?from=from_lark_index_search&ccm_open_type=from_lark_index_search)

### 4.6 多音区与多人同时输入

- 每个音区独立一条音频/识别流；上行字段 Query.Content + CoordinationInfo.SoundZone + request_id + speaker_name。合并规则【PRD】：同时说=FC 未下发时另一人也 VAD end；合并为「主驾驶说X，副驾驶说Y」，仅合并非拒识 query、上限暂定 4 条；角色标注不作优先级依据；指令冲突应反问。来源：[多人同时语音交互 PRD](https://bytedance.larkoffice.com/wiki/U4xLwmQNki1Pu5kpyAGcHWtmngf)
- 工程细节（Redis 窗口 1 分钟仅作异常兜底、Planner 每 100ms 轮询、收到首个 Planner item 前新旧请求均可打断）出自 Seres《输入管理模块设计》对现存多音区合并代码的描述——是设计稿记录的现状，**不能当作跨车型现行部署证明**。来源：[输入管理模块设计](https://bytedance.larkoffice.com/wiki/UsHgwkm2Sig3blkAttBclYb0n4g)
- 准确率指标：2 人字≥93%/句≥90%、3 人 88%/85%、4 人 83%/80%，需高通 8397 级算力。量产限制：因只有云端拒识，DNA1.0 仅支持唤醒后多路限时同时交互。来源：[FeatureList](https://bytedance.larkoffice.com/sheets/PHXzs0YEmhomVQtvpcbcdsXqneg?sheet=69a063&range=QTM6VTEz&from=lark_search_qa&ccm_open_type=lark_search_qa)、[上汽量产跟进](https://bytedance.larkoffice.com/sheets/IElLs7N8yhgXnRt8bmxcRj4dnwd?sheet=tTVqGt&range=QTI6RjI1&from=lark_search_qa&ccm_open_type=lark_search_qa)

### 4.7 会话输入状态机（Input Manager，Seres 一期设计稿·非已上线）

- 定位：输入入口与 Director 之间，把并发/乱序/多源输入串行化；正文自述仅支持 Seres、三层协调概念「现有代码中并不存在」。状态机：InputState（RECEIVED/WAITING/PROCESSING/FINISHED）；ChatRuntimeState（IDLE/PROCESSING/RESPONDING）；用户 Query=P0 可抢占、主动提醒/异步 Tool 结果=P1 排队。Tool call 一旦放行，旧 query 即使首 Token 未出也不可合并重跑。来源：[输入管理模块设计](https://bytedance.larkoffice.com/wiki/UsHgwkm2Sig3blkAttBclYb0n4g)

---

## 5. 理解与决策执行（识别后到回复前）

### 5.1 端云总览与版本沿革（保留差异，不合并）

- **202607 方案（该文档描述）**：客户端把音频上传 AIDV，AIDV 调 Speech 识别后把 ASR 文本返回客户端；客户端再 HTTP 发豆包做文本对话；豆包把汽车业务请求转给 AIDV；回复文本经豆包回客户端，合成音频由 AIDV 缓存、客户端 WebSocket 拉取边取边播。来源：[端云链路 One Page](https://bytedance.larkoffice.com/wiki/DBRnwrLFNiPxV5kZZOXcBYxqnCl?from=lark_search_qa&ccm_open_type=lark_search_qa#doxcnoo8QmUh1XSrQVV5euppWMd)
- 座舱云内部模块职责（202607 技术架构文）：Gateway 协议转换；句法 RAG 与分类拒识前置分流；Planner 结合 Context 推理拆任务；Agents Server 管 Agent 注册/调用/协议转换；Context 管端侧数据事件存储检索；触发器管主动推荐规则；Frontier 是云端向端侧主动推送通道；Advisor 云负责状态感知类建议文本与长时目标管理。来源：[内部技术架构](https://bytedance.larkoffice.com/docx/SupzdFrzjoXqhpxiYevcGsO0nXb?from=lark_search_qa&ccm_open_type=lark_search_qa#ZoHrdowBvsbYpGbYuO3cujWrnLf)
- 版本差异（**不自动合并现行**）：
	- **202509**：走 RTC，豆包 chat 并行调 AIDV 与 S2S，由 AIDV「意图」帧决策；缺点 S2S 无法被 Director 调度、RTC 建联慢成本高。
	- **202511**：链路不变，AIDV 内部能力迭代。
	- **202607**：汽车业务走豆包文本链路衔接 AIDV、纯文本用 S2S；已知问题是视频通话无法与 Planner-MultiAgent 融合、S2S 文本接入有联网 badcase、RTC 不支持音区。
	- **在建（非豆包 IP，WIP）**：自建 QUIC/WebSocket 全双工平台化链路，目标让视频/S2S 作为 Agent 注册后由 Planner 调度。来源：[自建平台化链路](https://bytedance.larkoffice.com/wiki/DxV9wY7jGiuNSdkg19XcNV8xnAe)

### 5.2 快路径：句法 RAG 与简单/复杂仲裁

- 句法 RAG 对 query 规则匹配，命中即跳过 Planner 直接由 Agent 处理；分类拒识同时做简单/复杂分类，简单 case 跳过 Planner 直执行。实现上 Planner 在 Flow 编排里被**预启动**并等 Continue 信号；一旦命中，预启动的 Planner 被直接取消，只有 OEM 强制（AlwaysPlannerProcessor）或最终回退才放行。来源：[内部技术架构](https://bytedance.larkoffice.com/docx/SupzdFrzjoXqhpxiYevcGsO0nXb)、[Planner One Page](https://bytedance.larkoffice.com/wiki/EWziwFVftiGvnlk0FA4cadqonud)
- 探索算法稿选型（Seed1.6 flash SFT，与现行并存非替代）：端侧 LLM+白名单判断「接得住/接不住」；明确指令→云侧 LLM 直接下发，复杂任务→云侧 Planner 慢思考。来源：[座舱Planner探索稿](https://bytedance.larkoffice.com/docx/HlFsdGQbPoH4LFxdqtEcjvY7nCg)
- Trace 观测：tob-intent-and-refusal span 的 Metadata 记录 is_simple（true 简单/false 复杂）与 refusal。来源：[Fornax Trace SOP](https://bytedance.larkoffice.com/wiki/KMNVwu51giBbgRkfmWDcTGpBnKb)

### 5.3 Context 与记忆

- Context 管理情景描述、事件日志、短期历史压缩、短期/长期情景记忆、长期语义记忆、用户画像、端状态、联网基本信息。架构演进（保留差异）：
	- **V1** 写入-粗筛-精筛三步式：上线后发现统一精筛输出限 5 个导致位置偏好、各源效果互斥；Context 目标 P90 800ms 实际 1.2s。
	- **V2** 预注入+动态检索：进 Planner 前不做大范围召回，仅常用数据覆盖约 80% 常规请求；进 Planner 后由 Planner 判断信息是否充足，不足则调检索工具按需精准检索兜底 20%；P90 564ms。来源：[Context OnePage](https://bytedance.larkoffice.com/wiki/OjGMwBX8fiLS0ikDWqVceVjhnPg)
- 记忆服务：短期情景记忆按 20min/20 文本合并、1 天有效；长期情景按天合并、默认无过期；长期语义记忆只从用户原话提取偏好、不外扩；召回自研标签打分方案而非纯向量库。来源：[记忆 OnePage](https://bytedance.larkoffice.com/wiki/KAAMwb7vsiHpd0k7PVPctGfKnHf)
- 1.0 公共 Context 设计稿与现行实现并存：1.0 还含屏幕界面（5min 截图）与任务队列（task_condition 形如「车辆挂入D档」）。来源：[公共Context 1.0](https://bytedance.larkoffice.com/docx/VHazdEAdFo33nLxGIqGcDOYrnJn)

### 5.4 Planner 决策（ReAct 闭环）

- 放行后 DoPlan 五阶段：预启动放行→输入预处理（四音区 Redis 合并；操作手册类意图改写「请查询后回答」；每 100ms 轮询打断、首 token 后不再打断）→旁路异步→文本规划（Eino ReAct 图，约定 use_agent=vehicle）→流式主循环 select。来源：[Planner One Page](https://bytedance.larkoffice.com/wiki/EWziwFVftiGvnlk0FA4cadqonud)
- ReAct 闭环：LLM 节点（方舟豆包 FuncPlannerAnalyzeText，60s 超时，JSONSchema strict）每轮输出固定五字段 talk_or_not/talk_content/emoji_id/action_list/goal_list_update；action_list 非空且 step≤20 进 tools 节点，否则 direct_return；命中 ReturnDirectlyTools 不再回灌直接结束。来源：[Planner One Page](https://bytedance.larkoffice.com/wiki/EWziwFVftiGvnlk0FA4cadqonud)。
- 产品侧拆解原则：最小拆解单元=单一设备操作；高频核心能力打散成 tool 直接控制，长尾复杂闭环才单独成 agent（例：音乐 query 从「意图→多媒体 agent」改为「直接控制 tool」）。来源：[任务Planner PRD](https://bytedance.larkoffice.com/wiki/FKefw6e9uiIZiLkQuqwccsqAnVR)
- 任务四类：单步复杂、条件任务（含定时）、多步任务、持续任务。条件任务需校验条件可被感知/可触发/动作合法/条件动作不矛盾；不合法时 Planner 不注册工具只聊天回复。930 阶段评审口径：一个任务只能对应一个 tool/agent；任务关系支持并行、串行(child)、定时(expect_exec_time)、条件(condition)；分支任务 930 不实现。来源：[Planner服务端技术评审250910](https://bytedance.larkoffice.com/docx/LdbsdOh9YonipLxNO3ScShtynyf)
- 性能目标（PRD 口径，非实测）：单步复杂车控 planner 推理 ACC≥90%、从进 planner 控制完成 P90≤2000ms。来源：[任务Planner PRD](https://bytedance.larkoffice.com/wiki/FKefw6e9uiIZiLkQuqwccsqAnVR)

### 5.5 Agent Server 工具执行与车控/导航/音乐路由

- Agent Server 处链路最底层，提供通用方法调用各类 Agent、屏蔽调用细节；**不负责按 Planner 规划编排**（编排归 Planner）。工具执行链：Eino 图内每个 Agent 包装成 tool.BaseTool → StreamableRun → NewAgentStreamRunner → RunAgent → Agent Server 按 AgentType 分发 Executor。来源：[Agent Server One Page](https://bytedance.larkoffice.com/docx/KDJpd1kTmoDgEexJpTicZAlin8e)、[Planner One Page](https://bytedance.larkoffice.com/wiki/EWziwFVftiGvnlk0FA4cadqonud)
- AgentType 六类：AIDV(0) 服务内置；DPFM(1) 车控/车辆领域与部分 ToB；Doubao(2) 豆包云通用内容/搜索/生态；Ecology(3) 生态三方；Offline(4) 端侧离线虚拟 Agent、不加入 Planner；InternalRPC(5) 内部 RPC。来源：[Planner One Page](https://bytedance.larkoffice.com/wiki/EWziwFVftiGvnlk0FA4cadqonud)
- 控制指令：Redirect 最多两次；Interrupt 结束当前调用；Fallback 无通用自动重规划；执行后处理把结构化数据（如音乐）转成文本作模型上下文；IsFinish=true 存历史表结束。来源：[Agent Server One Page](https://bytedance.larkoffice.com/docx/KDJpd1kTmoDgEexJpTicZAlin8e)
- **端侧高频/复杂云端的范围，以上汽 DNA 量产 SOW（PRD 类来源）为准**：端侧意图仅导航/音乐/车控高频集合；有网全采信云端、无网走离线。来源：[上汽量产跟进](https://bytedance.larkoffice.com/sheets/IElLs7N8yhgXnRt8bmxcRj4dnwd?sheet=tTVqGt&range=QTI6RjI1&from=lark_search_qa&ccm_open_type=lark_search_qa)（注：answer_source=edge 等 Trace 字段仅用于定位观测，不单独支撑能力范围划分。）

### 5.6 执行反馈回灌与车控观察

- 工具结果经 mergeToolOutputs 合成 {tool_feedback, tool_name} observation 回灌 llm 形成闭环；params 注入 answer_source=cloud_planner；落库 planner_histories（模型输出）与 planner_task_list（工具任务及结果）。来源：[Planner One Page](https://bytedance.larkoffice.com/wiki/EWziwFVftiGvnlk0FA4cadqonud)
- 车控观察：vehicle-control-observation span Input 为发给端上的车控指令（need_nlg 表示要车控 Agent 出 NLG），Output 为端上回复；**Output 为空表示端上 5 秒内未回复执行结果**。话术策略：执行成功可不播报、失败必须播报失败原因。来源：[Fornax Trace SOP](https://bytedance.larkoffice.com/wiki/KMNVwu51giBbgRkfmWDcTGpBnKb)、[任务Planner PRD](https://bytedance.larkoffice.com/wiki/FKefw6e9uiIZiLkQuqwccsqAnVR)

### 5.7 主动服务与 Goal

- 触发器链路：触发来源→条件判断→动作执行；三类触发——信号触发（端信号快照/变更为）、时间触发（单次/Cron）、推理触发（VLM 语义如婴儿哭闹）；默认 30 秒内同一场景仅执行一次。来源：[触发器 OnePage](https://bytedance.larkoffice.com/wiki/Xk6xwM3l8iK4oCkXIMlcIo4hnFc)
- 静态 Advisor（saic-dna/seres 文档描述）：车端上报车况/视觉信号→TriggerRun 做范围/规则/频控→通过才请求 Extour 推理；无建议静默；建议下发后车端携推荐标识回流，Flow 恢复上下文后继续 Planner 复用执行播报。来源：[静态 Advisor](https://bytedance.larkoffice.com/wiki/Hzq8wR285io8qxkFYGscs5EAnMg)
- 动态 Advisor / Goal（saic-dna，联调中）：Goal 位于主对话与 Extour 目标引擎之间——Planner 选长时任务工具（add_goal/delete_goal）；Extour 维护目标、判断触发；create_success 直接发创建卡（不进 Planner）；有效 Goal 注入 Planner 的 goal_list。来源：[动态 Advisor](https://bytedance.larkoffice.com/wiki/VvAMwHbxei6BSEkzoxjc9AbynNh)
- Task Service（seres 文档描述）：承接定时/条件/周期任务；触发后经 Recommend/Frontier 通知车端，车端携推荐标识回流，Planner 结合上下文完成提醒或调用执行；二期独立 Task Agent 尚未实施。来源：[Task Service One-pager](https://bytedance.larkoffice.com/wiki/A60Zwzy9eiiCtwkY8k2c0LKKnoc)

---

## 6. 回复输出与交互（NLG / TTS / 播放 / 打断恢复）

### 6.1 NLG 输出结构

- Planner 输出 talk_content 里的 `[高兴的说]` 这类方括号是**情绪标注**——TTS 模块按它拆段合成；无 [情绪] 时用用户 query 当情绪信息；一段可拆多段分别合成；`[唱]` 出现时改走 **S2S 唱歌**，不走普通 TTS。来源：[OnePager](https://bytedance.larkoffice.com/wiki/GBcCw5c6xiWvGukPMQgcMiuKnEc?from=lark_search_qa&ccm_open_type=lark_search_qa#doxcnVCBIOkWMJ3FE7KvuGF8OLh)
- 车控类播报策略：简单车控（开关车窗等）用**端侧固定 NLG 模板**+端侧 TTS；复杂车控（座椅记忆、智驾泊车等）走**过渡话术+结果话术两段云端 TTS；失败时云端生成「失败模块+原因」。注意：该 PRD 中「复杂车控任意执行失败」整段为删除线 Pending 状态，失败播报闭环未冻结**。来源：[车控TTS播报策略 PRD](https://bytedance.larkoffice.com/wiki/GQvHwQJGriFRoKkNjnIcRkBrn1f)

### 6.2 在线/离线 TTS

- 音色：**温柔桃子**（Speaker=zh_female_wenroutaozi_uranus_bigtts，SAMI BigTTS）；资源申请量 QPS 50、并发 300。来源：[OnePager](https://bytedance.larkoffice.com/wiki/GBcCw5c6xiWvGukPMQgcMiuKnEc?from=lark_search_qa&ccm_open_type=lark_search_qa#doxcnVCBIOkWMJ3FE7KvuGF8OLh)
- **配置分车型/规划，不互替**：温柔桃子/SAMI 是现链路文档口径；2026FL 里音色在线为 Vivi（26-5）/离线 speech（26-6 开发中）属规划列，不是替代温柔桃子。来源：[2026场景智能助手FL](https://bytedance.larkoffice.com/wiki/GejVwgw0JiUoZRkgA0ZcEY6Ln0e)
- 正在推进「文本链路接入 SAMI 情感化 TTS」：现状回复下发时不提前合成、拉取时才合成；目标端到端再省约 100ms（方案预估收益，Check List/排期/评审纪要均空，**标方案待确定**）。来源：[文本链路接入Sami情感化TTS](https://bytedance.larkoffice.com/wiki/T7IrwTjgYihcGmk6TCCcOtT9nxb)
- 离线 TTS（兜底）：无网络时用离线版温柔桃子音色，但**无情感化风格**；实现方思必驰，交付状态「待优化」；MOS、跟在线接近度**尚未填值**。离在线 TTS PRD v1.3（2026-07-06）给的是**产品目标**而非实测：离线缓存<100ms、离线 TTS<300ms、在线 TTS<500ms，且明确「合成效果/音质/MOS 不在本次范围内」。来源：[FeatureList](https://bytedance.larkoffice.com/sheets/PHXzs0YEmhomVQtvpcbcdsXqneg?sheet=69a063&range=QTc5OlU5Mg==)、[离在线车载TTS服务PRD](https://bytedance.larkoffice.com/wiki/KlRgwueVKipbeLkdzkGcO15inKh)

### 6.3 缓存拉流与播放控制

- 下行三段：AIDV 调 Speech 云合成音频并缓存 → AIDV 把响应文本与 tts_audio_id 发给豆包再到客户端 → 客户端经独立 WebSocket 向 AIDV 拉取分片、边取边播。**缓存支持流式消费，不等整段合成完才播**。来源：[端云链路 One Page](https://bytedance.larkoffice.com/wiki/DBRnwrLFNiPxV5kZZOXcBYxqnCl?from=lark_search_qa&ccm_open_type=lark_search_qa#doxcnoo8QmUh1XSrQVV5euppWMd)
- 播放端 SDK 事件枚举：StartTask/FinishTask/TaskFailed/TaskStarted/TTSSentenceStart/TTSSentenceEnd（SAMI）；2026-09-12 起 SDK 新增 TTS 子句开始/结束回调 + 音频特征回调，端侧借此做逐句上屏与打轴对齐。来源：[InCar发版记录](https://bytedance.larkoffice.com/docx/HIvZdENEEomnb2x7dNocKoxunxg)

### 6.4 三层打断与两种恢复

- **三层打断**：① 云端入口打断（同账号同会话后到 query 打断前一未处理完 query；被拒识 query 不参与打断判定）；② 端侧流式拒识提前停 TTS（前提=多人场景+ASR>2字+前缀不含「豆包」+TTS 正在播）；③ 播放 SDK 事件（新 TTS 优先级更高、第三方 stop、低功耗挂起等不恢复；收到 NotRejectQuery/StreamNotRefusal/多人喊「豆包」要恢复）。来源：[端云链路 One Page](https://bytedance.larkoffice.com/wiki/DBRnwrLFNiPxV5kZZOXcBYxqnCl?from=lark_search_qa&ccm_open_type=lark_search_qa#doxcnoo8QmUh1XSrQVV5euppWMd)、[OnePager](https://bytedance.larkoffice.com/wiki/GBcCw5c6xiWvGukPMQgcMiuKnEc)
- **两种恢复**：当前 query 最终**拒识** → Event 恢复上一条未播 pcm；当前 query **未拒识(Recall)** → Planner 把「新 query+上一条未播内容」融合生成新 NLG。恢复时结合 **TTS 打轴**（音频与文本对应关系）定位未播段；缺打轴按默认 100ms/字估算。来源：[OnePager](https://bytedance.larkoffice.com/wiki/GBcCw5c6xiWvGukPMQgcMiuKnEc)、[Planner One Page](https://bytedance.larkoffice.com/wiki/EWziwFVftiGvnlk0FA4cadqonud)
- **打断策略版本演进（现行归属待确定）**：改造前问题→短期方案 2.6（非拒识+非简单车控才停播、1.5s 等待窗口）→二月底演示实验版（ASR>2字立即停 TTS、新增语音打断开关）→长期 SOP 待定。来源：[打断策略 PRD](https://bytedance.larkoffice.com/wiki/FLlSwl1GoicNugkWWLCcFxtmnhl)
  <quote-container>
  【评审建议】先问：当前 DNA1.0/SLS 车上跑的是哪一版打断规则？（无发布证据，别假设是最新演示版）。
  </quote-container>

### 6.5 声音与多模态呈现

- 任务卡片（即时卡片/长时任务+任务中心）端侧呈现；氛围灯由车企实现，随交互做颜色呼吸流转。来源：[FeatureList](https://bytedance.larkoffice.com/sheets/PHXzs0YEmhomVQtvpcbcdsXqneg?sheet=69a063&range=QTc5OlU5Mg==)
- 豆包机器人 AIBOT（圆形屏硬件）：播报/识别/思考/延时聆听状态需与屏内形象一致，验收通过率≥90%~99%；但主副驾唤醒偶现转动卡顿、手动切歌快时 0.5s 闪现默认态、疲劳驾驶关怀实车未触发（仅 50%）。来源：[上汽SOR外采需求](https://bytedance.larkoffice.com/docx/K1GldxiWWouPauxhX1ZcdMsqnYI)
- 语音↔屏幕呈现关系（HMI 框架 v1.0，Aime 2026-05-01 快照，方案非现网）：反馈通道优先级为语音对话 P0/状态判断 P0/TTS P0，表情动作 P1，触控 P2——即「先出声、再上屏」；主动服务分**强交互=语音+卡片**（电量/胎压/新闻）与**弱推荐=仅卡片不播语音**（节目更新）。来源：[AI HMI主交互框架v1.0](https://bytedance.larkoffice.com/docx/Izf6dLypwo4cqRxvpevc7eiTn3g)
  <quote-container>
  【解读】这份框架给了「什么时候该出声、什么时候只上屏」的设计意图，但多处 TBD，不能当现网 HMI 实际行为。
  </quote-container>

---

## 7. 版本与车型差异（不自动合并现行）

<lark-table rows="9" cols="4" header-row="true" column-widths="128,102,254,254">

  <lark-tr>
    <lark-td>
      版本/车型
    </lark-td>
    <lark-td>
      时间/SOP
    </lark-td>
    <lark-td>
      链路与声音特点
    </lark-td>
    <lark-td>
      关键差异
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      202509 架构
    </lark-td>
    <lark-td>
      历史
    </lark-td>
    <lark-td>
      走 RTC，豆包 chat 并行调 AIDV 与 S2S
    </lark-td>
    <lark-td>
      RTC 建联慢成本高、S2S 无法被 Director 调度
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      202511 架构
    </lark-td>
    <lark-td>
      历史
    </lark-td>
    <lark-td>
      链路不变，AIDV 内部能力迭代
    </lark-td>
    <lark-td>
      —
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      202607 架构
    </lark-td>
    <lark-td>
      当前方案
    </lark-td>
    <lark-td>
      汽车业务走豆包文本链路衔接 AIDV、ASR/TTS 经 AIDV 对 Speech 云
    </lark-td>
    <lark-td>
      视频通话不能与 Planner-MultiAgent 融合；RTC 不支持音区
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      自建 QUIC/WebSocket
    </lark-td>
    <lark-td>
      WIP（非豆包IP）
    </lark-td>
    <lark-td>
      全双工平台化，S2S 作 Agent 注册后由 Planner 调度
    </lark-td>
    <lark-td>
      需重写端云对接/风控/打断/uid 解析模块
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      上汽 DNA1.0
    </lark-td>
    <lark-td>
      26 年 8 月 SOP
    </lark-td>
    <lark-td>
      温柔桃子音色、流式+离在线混合、多音区 TTS/ASR/界面仲裁
    </lark-td>
    <lark-td>
      只有云端拒识，多路同时交互范围待确认
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      赛力斯 SLS/E68
    </lark-td>
    <lark-td>
      26 年 12 月 SOP
    </lark-td>
    <lark-td>
      情感化+离线+对话风格切换（风格切换仅 SLS）；AIBOT 圆形屏
    </lark-td>
    <lark-td>
      声学标定依赖车厂约 2 个月；火山供接口、赛力斯实现页面
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      路特斯（历史 0.5）
    </lark-td>
    <lark-td>
      0.5 项目
    </lark-td>
    <lark-td>
      TTS 走 VR 通道、应用内音视频走多媒体通道
    </lark-td>
    <lark-td>
      与本地语音/HiCar/CarPlay 互斥；指标为历史口径
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      AUDI PP01/PP02
    </lark-td>
    <lark-td>
      发版记录持续更新
    </lark-td>
    <lark-td>
      存在字节语义 vs 讯飞本地语义双路对照（ZPPB-16571/16572）
    </lark-td>
    <lark-td>
      版本 1.0.0.6598→1.0.2.6198
    </lark-td>
  </lark-tr>
</lark-table>

来源：[端云链路 One Page](https://bytedance.larkoffice.com/wiki/DBRnwrLFNiPxV5kZZOXcBYxqnCl?from=lark_search_qa&ccm_open_type=lark_search_qa#doxcnoo8QmUh1XSrQVV5euppWMd)、[内部技术架构](https://bytedance.larkoffice.com/docx/SupzdFrzjoXqhpxiYevcGsO0nXb)、[上汽量产跟进](https://bytedance.larkoffice.com/sheets/IElLs7N8yhgXnRt8bmxcRj4dnwd)、[E68功能清单](https://bytedance.larkoffice.com/wiki/KqSDwFmXoi8830kmLiScLZUCnGc)、[AIVA需求管理](https://bytedance.larkoffice.com/wiki/EOQQwWRQ3ig56OkuQx4c3qYrnOg)、[路特斯PRD](https://bytedance.larkoffice.com/wiki/DhWHwvmqcixRVEkI9pkce01pnud)、[Audi发版记录](https://bytedance.larkoffice.com/docx/OGQhdXpfwoUu7OxkSapcxONWnsc)。

<quote-container>

分工口径：思必驰=端侧唤醒/降噪/音区/部分离线 ASR 与 TTS；火山=在线 ASR/S2S/情感化 TTS/声纹/多音区/多路交互；弋途=Advisor/长时任务卡片；车企=氛围灯/页面实现/硬约束兜底。**思必驰与讯飞输入方案按出处项目区别**：2026FL 里输入感知（唤醒/识别/多路交互）由讯飞承担、非人机拒识由火山完成，与思必驰端侧方案不是同一项目口径。来源：[FeatureList](https://bytedance.larkoffice.com/sheets/PHXzs0YEmhomVQtvpcbcdsXqneg)、[2026场景智能助手FL](https://bytedance.larkoffice.com/wiki/GejVwgw0JiUoZRkgA0ZcEY6Ln0e)
</quote-container>

---

## 8. 指标与评测（目标值 vs 实测值严格分开）

### 8.1 目标值（需求/版本目标口径，非已交付达标）

<lark-table rows="12" cols="3" header-row="true" column-widths="264,265,209">

  <lark-tr>
    <lark-td>
      指标
    </lark-td>
    <lark-td>
      目标
    </lark-td>
    <lark-td>
      来源
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      TTS 拉流首包
    </lark-td>
    <lark-td>
      P50=70ms / P90=80ms（规格目标值）
    </lark-td>
    <lark-td>
      [FeatureList](https://bytedance.larkoffice.com/sheets/PHXzs0YEmhomVQtvpcbcdsXqneg?sheet=69a063&range=QTc5OlU5Mg==)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      在线语音合成
    </lark-td>
    <lark-td>
      P50≤500ms（情感化）
    </lark-td>
    <lark-td>
      [评测标准2026-02-06版](https://bytedance.larkoffice.com/wiki/Ur3Zwu4LMiqatwk4xrScTwYMntV?sheet=1Pt0v1&range=QTI6TjIw)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      离线合成/离线缓存
    </lark-td>
    <lark-td>
      P50≤300ms / ≤20ms（评测标准版）
    </lark-td>
    <lark-td>
      [评测标准](https://bytedance.larkoffice.com/wiki/Ur3Zwu4LMiqatwk4xrScTwYMntV?sheet=1Pt0v1&range=QTI6TjIw)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      离在线TTS首帧（PRD v1.3）
    </lark-td>
    <lark-td>
      离线缓存<100ms / 离线TTS<300ms / 在线TTS<500ms（口径=输入文本→听到第一帧）
    </lark-td>
    <lark-td>
      [离在线TTS PRD](https://bytedance.larkoffice.com/wiki/KlRgwueVKipbeLkdzkGcO15inKh)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      端到端响应 P90
    </lark-td>
    <lark-td>
      闲聊≤1s；主动服务≤5s；被动文本≤1.3s；执行类≤1.8s
    </lark-td>
    <lark-td>
      [评测标准](https://bytedance.larkoffice.com/wiki/Ur3Zwu4LMiqatwk4xrScTwYMntV)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      端到端语音交互时延
    </lark-td>
    <lark-td>
      ≤2s（说完最后一字→开始播报/执行）
    </lark-td>
    <lark-td>
      [司机Agent PRD](https://bytedance.larkoffice.com/wiki/M8n2wAHP0i36wukldtncEy2bnhh)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      云端可用性/端侧Crash
    </lark-td>
    <lark-td>
      SLA 99.9% / Crash<0.01%
    </lark-td>
    <lark-td>
      [司机Agent PRD](https://bytedance.larkoffice.com/wiki/M8n2wAHP0i36wukldtncEy2bnhh)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      质量门禁
    </lark-td>
    <lark-td>
      P0=0、P1=0、P2≥85%关闭；全功能通过率≥99.5%；Smoke 100%
    </lark-td>
    <lark-td>
      [评测标准](https://bytedance.larkoffice.com/wiki/Ur3Zwu4LMiqatwk4xrScTwYMntV?sheet=1Pt0v1&range=QTI6TjIw)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      多路同时交互
    </lark-td>
    <lark-td>
      2人字≥93%/句≥90%；3人≥88%/85%；4人≥83%/80%
    </lark-td>
    <lark-td>
      [FeatureList](https://bytedance.larkoffice.com/sheets/PHXzs0YEmhomVQtvpcbcdsXqneg?sheet=69a063&range=QTM6VTEz)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      Planner 推理
    </lark-td>
    <lark-td>
      单步复杂车控 ACC≥90%、控制完成 P90≤2000ms
    </lark-td>
    <lark-td>
      [任务Planner PRD](https://bytedance.larkoffice.com/wiki/FKefw6e9uiIZiLkQuqwccsqAnVR)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      Planner 2.6 整体目标（快照）
    </lark-td>
    <lark-td>
      首字 P50≤500ms/P90≤800ms；推理 ACC≥90%、回复 ACC≥93%；S7 首 token P90≤1200ms
    </lark-td>
    <lark-td>
      [Planner 2.6目标/s7门禁](https://bytedance.larkoffice.com/wiki/P09QwBBpHijHF8kAJPicYTRynuf)
    </lark-td>
  </lark-tr>
</lark-table>

<quote-container>

**口径冲突不合并**：离线缓存目标两版不一致——评测标准(2026-02)写 ≤20ms，离在线 TTS PRD(v1.3, 2026-07)写 <100ms，量纲/口径不一致，评审前需与负责人（左晨）对齐现行采用哪一版。

**目标 vs 交付时效分开**：上表 70/80ms 等为规格目标值，不等于已交付达标；FeatureList/DNA SOR 的「交付状态」列口径为截止 4 月底登记，而该表 2026-10-12 仍在更新，不能用 10 月更新反推「4 月底状态已兑现」。

**工具内部耗时别与端到端混**：上汽 SOR 对外验收里大量 Agent 指标明确「不包含主链路耗时」（如 AiNavi POI 问答 P90<4s、算路<4/6/8.5s、发起导航<2.5s）。来源：[上汽SOR外采需求](https://bytedance.larkoffice.com/docx/K1GldxiWWouPauxhX1ZcdMsqnYI)
</quote-container>

### 8.2 实测值（历史摸底，非现行达标证据）

<quote-container>

以下均为特定时间、特定测试车/测试集的摸底数据，**不是量产线上现行效果，不能当 SOP 验收结论对外引用**。引用必须带文档时间与场景条件。
</quote-container>

- 2026-01-08 摸底（车型=测试 Demo 车，非量产 SOP）：在线 ASR 句准 86.99%（目标 95%，未达）；思必驰离线 60.99% / 豆包离线 75.15%（目标≥92%，未达）；TTS 效果 P1=9、P2=8 → P1=3、P2=10。来源：[评测标准](https://bytedance.larkoffice.com/wiki/Ur3Zwu4LMiqatwk4xrScTwYMntV?sheet=1Pt0v1&range=QTI6TjIw)
- 2026-01-08 Demo 车：总通过率 68%（12-30 为 37%）；Planner TTS 存在乱序、中止（5号车）；音乐 UI/POI 卡片不出、导航概率失败。来源：[评测标准](https://bytedance.larkoffice.com/wiki/Ur3Zwu4LMiqatwk4xrScTwYMntV?sheet=1Pt0v1&range=QTI6TjIw)。
- S2S 情感化通过率（**不同批次样本集不同，不作严格可比**）：2025-11-24 手机 156 case 85%；2025-12-09 平板 212 case 83%；2026-02 强制 sami+section id **275 case** 仅 63%，不加 section id **268 case** 93%；唱歌 2026-04-23 **73 case** 仅 29% → 2026-05-14 **67 case** 91%。来源：[S2S测试用例&结果](https://bytedance.larkoffice.com/wiki/WA3owJOOui51JTk4Ymfc8OqWnZg?sheet=n7V2ct&range=QTM5Ok04MQ==)
- 2026-01-05 TTS 合成样例约 600ms（单样例非统计值）；「首包 70/80ms」是端侧从 AIDV 拉缓存流首包，与「在线合成 P50≤500ms」不是一个口径，不能拿 70ms 当「合成只要 70ms」对外承诺。来源：[Fornax排查SOP类文档](https://bytedance.larkoffice.com/docx/NeDpdQdxMoweqfxkUfCcCZ9knkd)
- TTS 效果侧官方口径是「**无法评测，以产品体验为主**」，只看多音字、漏字、重字——没有量化门禁。

---

## 9. 横向接入 / 资源 / 账号 / 合规 / 数据与交付

<quote-container>

制度有效性与座舱功能实现**分离**：接入文档、资源方案、培训与 PRD 不能互替部署证据。治理源即使标现行，若 status_basis 只说跟踪/维护，成稿标**进行中需求/非部署**。
</quote-container>

- **两大人工维护主入口（维护中，目录入口非部署证据）**：「0. 目录索引」（韩杰，2026-10-14 更新）；「AI汽车文档汇总/索引」（刘正伟，2026-09-08，revision 377，工程/算法/端侧/产品四列 13 模块行）。来源：[目录索引](https://bytedance.larkoffice.com/wiki/Fg7xw7NfJi8Dfqk5PTwcqe5gnX3)、[主索引](https://bytedance.larkoffice.com/wiki/Zi6fwVKgvi6bo2k3UiCc90Ccntf)
- **公版-AI汽车接口访问指南**（v1.0，2025/09/15）：正文明确「火山引擎智能座舱对外提供的大模型 HTTP 接口说明」，含 14+ API（用户绑定/Planner/事件上报/流式拒识等）。这是**对外接口说明**，不是现网功能清单。来源：[接口访问指南](https://bytedance.larkoffice.com/docx/OZjjdzEldo3J1pxXQ0OcW5Ugn5d)
- **汽车座舱账号模型开通管理规范**：正文明确「从 2025 年 11 月 1 日起执行」，覆盖国内火山引擎 2 产品账号+海外 BytePlus。来源：[账号开通管理规范](https://bytedance.larkoffice.com/wiki/BLklwIyZfiMThDkNiOQc16S9nsb)
- **豆包座舱助手上线合规指南培训**（2026-10-12，法务）：卡片内容引自审计晨报，提及 Alex 国庆假期间开**家越07实车体验反馈——这只是实车体验反馈，无首发证据，不据此推断首发落地车型**。来源：[合规指南培训](https://bytedance.larkoffice.com/docx/QtuSdNKf4oSCiNxIDLSc02krnFG)
- **公司级上游制度**：Privacy-203 隐私影响评估、DataSecurity-304 数据权限审批（非汽车专属）。来源：[制度合集](https://bytedance.larkoffice.com/wiki/wikcnmMz9p7czLIxHYoGy4tQjPf)
- **资源池方案（方案级）**：火山座舱 ToB 主线资源池迭代方案（2026），稳定版（量产，半年更新）/先行版（在研，2 迭代更新）双版本策略。来源：[资源池迭代方案](https://bytedance.larkoffice.com/wiki/JCIewe7qZiM6Bwk5Xe8cS0L6nhh)
- **需求路线图承载**：AIVA 需求管理（张嘉锋，2026-10-13，含 2026.10.30 提测、11.1 合入 SLS、11.6 声学标定）；FeatureList（廖婉婷，2026-10-12，DNA1.0/SLS/AUDI PP02 交付范围）；InCar 客户端发版记录（姜锋，2026-10-09）。来源：[AIVA](https://bytedance.larkoffice.com/wiki/EOQQwWRQ3ig56OkuQx4c3qYrnOg)、[FeatureList](https://bytedance.larkoffice.com/sheets/PHXzs0YEmhomVQtvpcbcdsXqneg)
- **排查主平台 Fornax**：主 Span=aidv-main-flow；第一层分流靠 answer_source 枚举：refusal / cloud / cloud_planner / cloud_agent / cloud_doubao / edge。必须用测试账号/虚拟手机号，正式账号数据加密；被拒识消息在豆包 App 会撤回拿不到 LogID，必须走 Fornax。来源：[Fornax Trace SOP](https://bytedance.larkoffice.com/wiki/KMNVwu51giBbgRkfmWDcTGpBnKb)

---

## 10. badcase 定位与跨团队评审（严格四分法）

触发器/链路 badcase 先落入四类；**Context/记忆漏召不是独立类别，而是贯穿各类的证据维度**：

1. **规则设计缺陷**：快路径（句法 RAG/简单复杂仲裁/拒识）误判。证据：查 tob-intent-and-refusal 的 is_simple/refusal 与 answer_source。
1. **大模型输出不稳定**：Planner 拆解/工具选择/JSON 格式错。证据：查 aidv_planner 下 ChatModel 输入输出、step 数、jsonrepair 触发；注意 step≤20 上限与 strict 约束。
1. **端侧资源限制**：**仅在有端侧资源观测（CPU/内存/超时配置/离线模型加载失败日志）时方可判定；无资源观测不得归因此类。**
1. **软硬件时序冲突**：车控指令发出但端上未 ACK（vehicle-control-observation Output 空=5s 未响应）——**这只是现象，不能直接归为端资源不足**；需进一步区分是模型层误判、通信链路丢包/延迟、执行器未就绪、还是 VAD/打轴时序错位，定位到通信/执行器/时序证据后再归入此类。

**Context 维度**：预注入 80% 覆盖外的长尾靠动态检索，过召/漏召会同时影响快路径判断（类1）、Planner 拆解（类2）与端云一致性（类4），定位时先查 Context 预注入是否召回了相关记忆/端状态。

**常见现象速查**：

<lark-table rows="10" cols="3" header-row="true" column-widths="272,276,190">

  <lark-tr>
    <lark-td>
      现象
    </lark-td>
    <lark-td>
      可能归属环节
    </lark-td>
    <lark-td>
      来源
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      TTS 播报中插话不打断
    </lark-td>
    <lark-td>
      流式拒识四条件是否满足
    </lark-td>
    <lark-td>
      [OnePager](https://bytedance.larkoffice.com/wiki/GBcCw5c6xiWvGukPMQgcMiuKnEc)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      插话后旧播报重复
    </lark-td>
    <lark-td>
      final 拒识→Event 恢复 / 召回→Planner 融合
    </lark-td>
    <lark-td>
      [OnePager](https://bytedance.larkoffice.com/wiki/GBcCw5c6xiWvGukPMQgcMiuKnEc)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      多人同时指令丢一个
    </lark-td>
    <lark-td>
      Redis 合并窗口切分（设计稿自陈限制）
    </lark-td>
    <lark-td>
      [输入管理模块设计](https://bytedance.larkoffice.com/wiki/UsHgwkm2Sig3blkAttBclYb0n4g)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      无网下指令无反应
    </lark-td>
    <lark-td>
      白名单/兜底
    </lark-td>
    <lark-td>
      [离在线仲裁 PRD](https://bytedance.larkoffice.com/wiki/DZzYwDOiviwAqHkeVx1cSFKinnh)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      「有点冷」被端侧抢答错
    </lark-td>
    <lark-td>
      feel 意图必须等云端
    </lark-td>
    <lark-td>
      [离在线仲裁 PRD](https://bytedance.larkoffice.com/wiki/DZzYwDOiviwAqHkeVx1cSFKinnh)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      人名/歌名识别错
    </lark-td>
    <lark-td>
      热词不保证 100% 生效
    </lark-td>
    <lark-td>
      [OnePager](https://bytedance.larkoffice.com/wiki/GBcCw5c6xiWvGukPMQgcMiuKnEc)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      TTS 音频不完整/被吞
    </lark-td>
    <lark-td>
      Sami websocket 空闲断开关闭共享 chan（已解决，空闲约 180s）
    </lark-td>
    <lark-td>
      [ASR与TTS日志排查](https://bytedance.larkoffice.com/wiki/WwpFwoUNLikhxmkIhKwciSCEnYy)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      TTS 首帧约 7s 慢
    </lark-td>
    <lark-td>
      一句话无标点/finishtask 发晚（已解决）
    </lark-td>
    <lark-td>
      [ASR与TTS日志排查](https://bytedance.larkoffice.com/wiki/WwpFwoUNLikhxmkIhKwciSCEnYy)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      AIBOT 形象卡顿/0.5s 闪现默认态
    </lark-td>
    <lark-td>
      软硬件时序（形象动作与 TTS 状态机一致性）
    </lark-td>
    <lark-td>
      [上汽SOR](https://bytedance.larkoffice.com/docx/K1GldxiWWouPauxhX1ZcdMsqnYI)
    </lark-td>
  </lark-tr>
</lark-table>

<quote-container>

通用 badcase 归因框架（Prompt 缺陷/模型局限/数据质量/外部依赖）可参照，但那是通用方法论、非汽车项目实测。来源：[一文看懂AI评测](https://bytedance.larkoffice.com/docx/Q0plddPfroWqIXxs358cEY80njf)

任何推荐姓名必须原材料有负责或实质参与证据，本稿不自动联系任何人员。
</quote-container>

---

## 11. 资料目录（主交付：78 篇去重来源全表）

<quote-container>

读取程度：全文=整篇正文取回成功（取回≠逐段核读，长文以关键章节精读为主）；片段=索引/召回片段或单一工作表区间；目录=仅标题骨架；权限不足=访问被拒且未申请。来源字母编号仅内部序号，不含人员/群/消息身份。
</quote-container>

### 11.A 全文获取（44 篇，取回正文；核读深度以关键章节精读为主）

<lark-table rows="45" cols="6" header-row="true" column-widths="80,196,80,190,285,316">

  <lark-tr>
    <lark-td>
      #
    </lark-td>
    <lark-td>
      标题
    </lark-td>
    <lark-td>
      读取
    </lark-td>
    <lark-td>
      版本状态
    </lark-td>
    <lark-td>
      关键内容
    </lark-td>
    <lark-td>
      URL
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S01
    </lark-td>
    <lark-td>
      豆包×AIDV 端云链路 One Page
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      202607 当前方案
    </lark-td>
    <lark-td>
      四系统分工、TTS 缓存拉流、打断判定、架构演进
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/DBRnwrLFNiPxV5kZZOXcBYxqnCl](https://bytedance.larkoffice.com/wiki/DBRnwrLFNiPxV5kZZOXcBYxqnCl)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S02
    </lark-td>
    <lark-td>
      AI 汽车问题反馈/排查（Fornax Trace SOP）
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      现行排查 SOP
    </lark-td>
    <lark-td>
      answer_source 枚举、vehicle-control-observation span
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/KMNVwu51giBbgRkfmWDcTGpBnKb](https://bytedance.larkoffice.com/wiki/KMNVwu51giBbgRkfmWDcTGpBnKb)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S03
    </lark-td>
    <lark-td>
      AI汽车文档汇总/索引（主索引）
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      维护中（目录入口）
    </lark-td>
    <lark-td>
      13 模块行工程/算法/端侧/产品链接
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/Zi6fwVKgvi6bo2k3UiCc90Ccntf](https://bytedance.larkoffice.com/wiki/Zi6fwVKgvi6bo2k3UiCc90Ccntf)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S04
    </lark-td>
    <lark-td>
      SOR-产品相关审核（全链路语音）
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      历史单版（2025-11-24）
    </lark-td>
    <lark-td>
      连续对话 60s、S2S 主链路、音色温柔桃子
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/docx/XubJd7iqDoazIYxsJJxci10KnGg](https://bytedance.larkoffice.com/docx/XubJd7iqDoazIYxsJJxci10KnGg)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S05
    </lark-td>
    <lark-td>
      【AI汽车-PRD】语音交互打断策略
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      历史方案（2.6→演示版演进）
    </lark-td>
    <lark-td>
      打断停播/恢复规则版本演进
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/FLlSwl1GoicNugkWWLCcFxtmnhl](https://bytedance.larkoffice.com/wiki/FLlSwl1GoicNugkWWLCcFxtmnhl)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S06
    </lark-td>
    <lark-td>
      AI汽车语音基础体验链路 OnePager
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      现行主链路口径（2026-10 更新）
    </lark-td>
    <lark-td>
      Soft/Hard VAD、预请求、流式二遍ASR、打断恢复、热词
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/GBcCw5c6xiWvGukPMQgcMiuKnEc](https://bytedance.larkoffice.com/wiki/GBcCw5c6xiWvGukPMQgcMiuKnEc)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S07
    </lark-td>
    <lark-td>
      ASR与TTS 日志排查及问题整理
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      问题记录
    </lark-td>
    <lark-td>
      Sami 空闲断开、首帧慢、情绪播报复测
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/WwpFwoUNLikhxmkIhKwciSCEnYy](https://bytedance.larkoffice.com/wiki/WwpFwoUNLikhxmkIhKwciSCEnYy)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S08
    </lark-td>
    <lark-td>
      AI汽车产品知识库
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      活文档（2.1万字）
    </lark-td>
    <lark-td>
      重点事项跟进、产品课题
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/docx/C21tdlRGPoGDHBxFGoGcngvpnwd](https://bytedance.larkoffice.com/docx/C21tdlRGPoGDHBxFGoGcngvpnwd)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S09
    </lark-td>
    <lark-td>
      豆包 InCar 客户端发版记录
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      持续发版
    </lark-td>
    <lark-td>
      SDK 发版、TTS 子句回调、离线 TTS 合成问题
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/docx/HIvZdENEEomnb2x7dNocKoxunxg](https://bytedance.larkoffice.com/docx/HIvZdENEEomnb2x7dNocKoxunxg)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S10
    </lark-td>
    <lark-td>
      座舱 Planner 探索（算法设计稿）
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      探索算法稿（Seed1.6 flash SFT）
    </lark-td>
    <lark-td>
      端侧/云侧分工、仲裁路由
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/docx/HlFsdGQbPoH4LFxdqtEcjvY7nCg](https://bytedance.larkoffice.com/docx/HlFsdGQbPoH4LFxdqtEcjvY7nCg)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S11
    </lark-td>
    <lark-td>
      AI Car 意图升级讨论
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      讨论文档（非定稿）
    </lark-td>
    <lark-td>
      简单/复杂意图分类口径
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/docx/HuyLdT1MroLexYxcAFxcfRrQnpB](https://bytedance.larkoffice.com/docx/HuyLdT1MroLexYxcAFxcfRrQnpB)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S12
    </lark-td>
    <lark-td>
      AI HMI 主交互框架 v1.0
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      方案（Aime 2026-05 快照）
    </lark-td>
    <lark-td>
      反馈通道优先级、强弱交互分级
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/docx/Izf6dLypwo4cqRxvpevc7eiTn3g](https://bytedance.larkoffice.com/docx/Izf6dLypwo4cqRxvpevc7eiTn3g)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S13
    </lark-td>
    <lark-td>
      【AI汽车】Agent Server One Page
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      架构说明
    </lark-td>
    <lark-td>
      AgentType 六类、Redirect/Interrupt/Fallback
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/docx/KDJpd1kTmoDgEexJpTicZAlin8e](https://bytedance.larkoffice.com/docx/KDJpd1kTmoDgEexJpTicZAlin8e)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S14
    </lark-td>
    <lark-td>
      【Planner】服务端技术评审 250910
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      930 阶段评审口径
    </lark-td>
    <lark-td>
      任务关系、分支/定时器不实现
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/docx/LdbsdOh9YonipLxNO3ScShtynyf](https://bytedance.larkoffice.com/docx/LdbsdOh9YonipLxNO3ScShtynyf)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S15
    </lark-td>
    <lark-td>
      【内部】AI汽车技术架构
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      现行（202607 标注当前链路）
    </lark-td>
    <lark-td>
      座舱云各模块职责、版本沿革
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/docx/SupzdFrzjoXqhpxiYevcGsO0nXb](https://bytedance.larkoffice.com/docx/SupzdFrzjoXqhpxiYevcGsO0nXb)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S16
    </lark-td>
    <lark-td>
      公共 Context 管理-豆包【AI car 1.0】
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      1.0 设计稿
    </lark-td>
    <lark-td>
      屏幕界面 5min 截图、任务队列
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/docx/VHazdEAdFo33nLxGIqGcDOYrnJn](https://bytedance.larkoffice.com/docx/VHazdEAdFo33nLxGIqGcDOYrnJn)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S17
    </lark-td>
    <lark-td>
      事件(event)触发新一轮 query 技术方案
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      临时方案
    </lark-td>
    <lark-td>
      TTS 被拒识打断/按键/开关门触发新 query
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/A3jYw2EFtiJSSqkRpJocFPQGnRg](https://bytedance.larkoffice.com/wiki/A3jYw2EFtiJSSqkRpJocFPQGnRg)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S18
    </lark-td>
    <lark-td>
      Task Service One-pager
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      seres 文档描述
    </lark-td>
    <lark-td>
      定时/条件/周期任务承接
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/A60Zwzy9eiiCtwkY8k2c0LKKnoc](https://bytedance.larkoffice.com/wiki/A60Zwzy9eiiCtwkY8k2c0LKKnoc)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S19
    </lark-td>
    <lark-td>
      云端离在线仲裁技术方案
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      技术方案
    </lark-td>
    <lark-td>
      request_id 映射、history_source、车控白名单
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/BRtRwHgo4ivfr3k46LSciQi7nyd](https://bytedance.larkoffice.com/wiki/BRtRwHgo4ivfr3k46LSciQi7nyd)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S20
    </lark-td>
    <lark-td>
      (仅对内)火山座舱大模型场景智能产品方案
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      方案（主线已准出未落地）
    </lark-td>
    <lark-td>
      10 自研 Agent+8 合作场景、车控 FunctionCall
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/docx/NjEhdaxqToux6cxXjq3caFi0nAg](https://bytedance.larkoffice.com/docx/NjEhdaxqToux6cxXjq3caFi0nAg)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S21
    </lark-td>
    <lark-td>
      【AI汽车-PRD】离在线仲裁
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      PRD
    </lark-td>
    <lark-td>
      白名单逻辑、feel 意图等云端、心跳兜底
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/DZzYwDOiviwAqHkeVx1cSFKinnh](https://bytedance.larkoffice.com/wiki/DZzYwDOiviwAqHkeVx1cSFKinnh)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S22
    </lark-td>
    <lark-td>
      AI汽车自建平台化链路
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      WIP（非豆包 IP）
    </lark-td>
    <lark-td>
      QUIC/WebSocket 全双工、S2S 作 Agent 注册
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/DxV9wY7jGiuNSdkg19XcNV8xnAe](https://bytedance.larkoffice.com/wiki/DxV9wY7jGiuNSdkg19XcNV8xnAe)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S23
    </lark-td>
    <lark-td>
      AIDV Planner One Page
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      现行 Planner 架构
    </lark-td>
    <lark-td>
      DoPlan 五阶段、ReAct 五字段、回灌闭环
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/EWziwFVftiGvnlk0FA4cadqonud](https://bytedance.larkoffice.com/wiki/EWziwFVftiGvnlk0FA4cadqonud)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S24
    </lark-td>
    <lark-td>
      任务 Planner - PRD【豆包 in car1.0】
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      PRD
    </lark-td>
    <lark-td>
      最小拆解单元、任务四类、性能目标
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/FKefw6e9uiIZiLkQuqwccsqAnVR](https://bytedance.larkoffice.com/wiki/FKefw6e9uiIZiLkQuqwccsqAnVR)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S25
    </lark-td>
    <lark-td>
      0. 目录索引（产品侧知识库目录）
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      维护中（目录入口）
    </lark-td>
    <lark-td>
      产品概览/团队协作/一代二代套件分层
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/Fg7xw7NfJi8Dfqk5PTwcqe5gnX3](https://bytedance.larkoffice.com/wiki/Fg7xw7NfJi8Dfqk5PTwcqe5gnX3)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S26
    </lark-td>
    <lark-td>
      【AI汽车-PRD】多级VAD产品体验
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      PRD·待评审 v0.1
    </lark-td>
    <lark-td>
      Soft300/Hard500/语义1000ms 三级方案
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/FzViwCNb2iF43QkB5eDcD3D2nJh](https://bytedance.larkoffice.com/wiki/FzViwCNb2iF43QkB5eDcD3D2nJh)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S27
    </lark-td>
    <lark-td>
      【AI汽车-PRD】车控TTS播报策略
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      PRD（失败播报段删除线Pending）
    </lark-td>
    <lark-td>
      端侧固定NLG/复杂车控过渡+结果话术
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/GQvHwQJGriFRoKkNjnIcRkBrn1f](https://bytedance.larkoffice.com/wiki/GQvHwQJGriFRoKkNjnIcRkBrn1f)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S28
    </lark-td>
    <lark-td>
      静态 Advisor One-pager
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      saic-dna/seres 文档描述
    </lark-td>
    <lark-td>
      TriggerRun 频控、Extour 推理、推荐回流
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/Hzq8wR285io8qxkFYGscs5EAnMg](https://bytedance.larkoffice.com/wiki/Hzq8wR285io8qxkFYGscs5EAnMg)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S29
    </lark-td>
    <lark-td>
      记忆 OnePage
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      架构说明
    </lark-td>
    <lark-td>
      短/长期情景与语义记忆、标签打分召回
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/KAAMwb7vsiHpd0k7PVPctGfKnHf](https://bytedance.larkoffice.com/wiki/KAAMwb7vsiHpd0k7PVPctGfKnHf)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S30
    </lark-td>
    <lark-td>
      1. 产品概览（形态/代际/区域对照）
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      产品概览
    </lark-td>
    <lark-td>
      海外一代 2026Q4 东南亚、二代 noip Lite 2027H1
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/KR2jwKRqLi90gBkFYYicSC1tnmg](https://bytedance.larkoffice.com/wiki/KR2jwKRqLi90gBkFYYicSC1tnmg)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S31
    </lark-td>
    <lark-td>
      【AI汽车-PRD】离在线车载TTS服务
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      PRD v1.3（2026-07-06）
    </lark-td>
    <lark-td>
      离在线 TTS 首帧目标、MOS 不在范围
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/KlRgwueVKipbeLkdzkGcO15inKh](https://bytedance.larkoffice.com/wiki/KlRgwueVKipbeLkdzkGcO15inKh)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S32
    </lark-td>
    <lark-td>
      Context OnePage
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      V1→V2 演进
    </lark-td>
    <lark-td>
      预注入 80%/动态检索 20%、P90 564ms
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/OjGMwBX8fiLS0ikDWqVceVjhnPg](https://bytedance.larkoffice.com/wiki/OjGMwBX8fiLS0ikDWqVceVjhnPg)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S33
    </lark-td>
    <lark-td>
      Planner 2.6 整体目标和 s7 迭代目标
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      快照（2026-05-01，非现行实现）
    </lark-td>
    <lark-td>
      首字 P50/P90、ACC、S7 门禁
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/P09QwBBpHijHF8kAJPicYTRynuf](https://bytedance.larkoffice.com/wiki/P09QwBBpHijHF8kAJPicYTRynuf)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S34
    </lark-td>
    <lark-td>
      端侧离在线仲裁技术方案
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      含多项 Todo（非完成态）
    </lark-td>
    <lark-td>
      端侧 ASR→离线对话→RTC、taskId 追加
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/PtGPwsX4iiFDAEkKMNYcUYYjnph](https://bytedance.larkoffice.com/wiki/PtGPwsX4iiFDAEkKMNYcUYYjnph)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S35
    </lark-td>
    <lark-td>
      AI汽车1.0端侧架构和需求理解
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      端侧方案
    </lark-td>
    <lark-td>
      端侧架构、需求理解
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/Sql6wvvKwicaOFklFr6cz7eEnCb](https://bytedance.larkoffice.com/wiki/Sql6wvvKwicaOFklFr6cz7eEnCb)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S36
    </lark-td>
    <lark-td>
      汽车常稳人员需求申请流程
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      薄指针（待确定）
    </lark-td>
    <lark-td>
      指向 BPO 说明书
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/SrJIwKvJviWzaGk1pTWcYFEjn9d](https://bytedance.larkoffice.com/wiki/SrJIwKvJviWzaGk1pTWcYFEjn9d)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S37
    </lark-td>
    <lark-td>
      [技术方案]-文本链路接入 Sami 情感化 TTS
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      方案待确定（无上线证据）
    </lark-td>
    <lark-td>
      回复同时合成、端到端省约 100ms
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/T7IrwTjgYihcGmk6TCCcOtT9nxb](https://bytedance.larkoffice.com/wiki/T7IrwTjgYihcGmk6TCCcOtT9nxb)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S38
    </lark-td>
    <lark-td>
      【AI汽车-PRD】多人同时语音交互体验
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      PRD
    </lark-td>
    <lark-td>
      同时说合并规则、上限 4 条、冲突反问
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/U4xLwmQNki1Pu5kpyAGcHWtmngf](https://bytedance.larkoffice.com/wiki/U4xLwmQNki1Pu5kpyAGcHWtmngf)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S39
    </lark-td>
    <lark-td>
      【AI汽车-PRD】车内语音
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      PRD
    </lark-td>
    <lark-td>
      唤醒/VAD/ASR 指标、热词、旧主驾免唤醒已删
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/UIcgwzzo9iCQ2tkDz44cSjXXnBf](https://bytedance.larkoffice.com/wiki/UIcgwzzo9iCQ2tkDz44cSjXXnBf)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S40
    </lark-td>
    <lark-td>
      [技术方案]输入管理模块设计
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      Seres 一期设计稿（非已上线）
    </lark-td>
    <lark-td>
      InputState/ChatRuntimeState 状态机、P0/P1 抢占
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/UsHgwkm2Sig3blkAttBclYb0n4g](https://bytedance.larkoffice.com/wiki/UsHgwkm2Sig3blkAttBclYb0n4g)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S41
    </lark-td>
    <lark-td>
      动态 Advisor One-pager（saic-dna Goal）
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      saic-dna 联调中
    </lark-td>
    <lark-td>
      Goal add/delete、Extour 目标引擎、goal_list 注入
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/VvAMwHbxei6BSEkzoxjc9AbynNh](https://bytedance.larkoffice.com/wiki/VvAMwHbxei6BSEkzoxjc9AbynNh)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S42
    </lark-td>
    <lark-td>
      【AI汽车-PRD】多音区全时免唤醒交互
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      PRD·已评审 v0.2
    </lark-td>
    <lark-td>
      陪伴模式、4 音区、30s 连续对话、通话强拒识
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/W7kxwMqwmitpjSkv9BAcakO1nSR](https://bytedance.larkoffice.com/wiki/W7kxwMqwmitpjSkv9BAcakO1nSR)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S43
    </lark-td>
    <lark-td>
      豆包 InCar 客户端发版记录（SDK 版本日志）
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      持续发版
    </lark-td>
    <lark-td>
      SDK 版本交付日志
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/Wnziw9ngoiJx5nkWZmmcOBz5nac](https://bytedance.larkoffice.com/wiki/Wnziw9ngoiJx5nkWZmmcOBz5nac)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S44
    </lark-td>
    <lark-td>
      触发器 OnePage
    </lark-td>
    <lark-td>
      全文
    </lark-td>
    <lark-td>
      架构说明
    </lark-td>
    <lark-td>
      三类触发、30s 频控、渠道/车型/版本生效
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/Xk6xwM3l8iK4oCkXIMlcIo4hnFc](https://bytedance.larkoffice.com/wiki/Xk6xwM3l8iK4oCkXIMlcIo4hnFc)
    </lark-td>
  </lark-tr>
</lark-table>

### 11.B 片段/索引摘录（30 篇）

<lark-table rows="31" cols="5" header-row="true" column-widths="80,178,110,119,314">

  <lark-tr>
    <lark-td>
      #
    </lark-td>
    <lark-td>
      标题
    </lark-td>
    <lark-td>
      读取
    </lark-td>
    <lark-td>
      关键内容
    </lark-td>
    <lark-td>
      URL
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S45
    </lark-td>
    <lark-td>
      上汽DNA1.0量产事项跟进（SOW-DIFF）
    </lark-td>
    <lark-td>
      片段（sheet range）
    </lark-td>
    <lark-td>
      无网离线/有网云端、SOW 口径
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/sheets/IElLs7N8yhgXnRt8bmxcRj4dnwd](https://bytedance.larkoffice.com/sheets/IElLs7N8yhgXnRt8bmxcRj4dnwd)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S46
    </lark-td>
    <lark-td>
      【AI汽车】FeatureList
    </lark-td>
    <lark-td>
      片段（sheet range）
    </lark-td>
    <lark-td>
      语音基础能力指标、交付状态、分工
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/sheets/PHXzs0YEmhomVQtvpcbcdsXqneg](https://bytedance.larkoffice.com/sheets/PHXzs0YEmhomVQtvpcbcdsXqneg)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S47
    </lark-td>
    <lark-td>
      AI汽车产品 one page
    </lark-td>
    <lark-td>
      片段（目录骨架）
    </lark-td>
    <lark-td>
      Roadmap/产品架构/交付路径（正文待核）
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/docx/XNy1dc03QorjiOxnmC5cZy3fnhc](https://bytedance.larkoffice.com/docx/XNy1dc03QorjiOxnmC5cZy3fnhc)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S48
    </lark-td>
    <lark-td>
      上汽车书测试集&测试报告（SAIC DNA）
    </lark-td>
    <lark-td>
      片段
    </lark-td>
    <lark-td>
      语音 QA + Planner 轮次日志
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/sheets/A5I1sbTFihxDNOtPqtQcYAPEnph](https://bytedance.larkoffice.com/sheets/A5I1sbTFihxDNOtPqtQcYAPEnph)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S49
    </lark-td>
    <lark-td>
      【内】AIVA 需求管理（SLS）
    </lark-td>
    <lark-td>
      片段
    </lark-td>
    <lark-td>
      活跃需求跟踪、提测/合入/标定节点
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/EOQQwWRQ3ig56OkuQx4c3qYrnOg](https://bytedance.larkoffice.com/wiki/EOQQwWRQ3ig56OkuQx4c3qYrnOg)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S50
    </lark-td>
    <lark-td>
      E68车型功能清单（赛力斯E68排期）
    </lark-td>
    <lark-td>
      片段
    </lark-td>
    <lark-td>
      硬按键唤醒、交付节奏
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/KqSDwFmXoi8830kmLiScLZUCnGc](https://bytedance.larkoffice.com/wiki/KqSDwFmXoi8830kmLiScLZUCnGc)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S51
    </lark-td>
    <lark-td>
      【对话需求】测试用例&结果（S2S通过率）
    </lark-td>
    <lark-td>
      片段（sheet range）
    </lark-td>
    <lark-td>
      S2S 各批次 case 通过率
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/WA3owJOOui51JTk4Ymfc8OqWnZg](https://bytedance.larkoffice.com/wiki/WA3owJOOui51JTk4Ymfc8OqWnZg)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S52
    </lark-td>
    <lark-td>
      车载语音助手控制类工具 DM设计
    </lark-td>
    <lark-td>
      片段
    </lark-td>
    <lark-td>
      控制类工具 DM 设计
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/docx/CD4gdPqD3oz3F2xWfD5cFLuHnFc](https://bytedance.larkoffice.com/docx/CD4gdPqD3oz3F2xWfD5cFLuHnFc)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S53
    </lark-td>
    <lark-td>
      任务 Planner PRD（docx 副本）
    </lark-td>
    <lark-td>
      片段
    </lark-td>
    <lark-td>
      副本内容
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/docx/HH1wdZLgtoJBBfxAXRac7ZVJnZc](https://bytedance.larkoffice.com/docx/HH1wdZLgtoJBBfxAXRac7ZVJnZc)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S54
    </lark-td>
    <lark-td>
      上汽AI汽车功能需求SOR-外采需求
    </lark-td>
    <lark-td>
      片段（第八章）
    </lark-td>
    <lark-td>
      AIBOT 验收、AiNavi 工具内部耗时口径
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/docx/K1GldxiWWouPauxhX1ZcdMsqnYI](https://bytedance.larkoffice.com/docx/K1GldxiWWouPauxhX1ZcdMsqnYI)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S55
    </lark-td>
    <lark-td>
      AI汽车相关文档全集（Aime 聚合）
    </lark-td>
    <lark-td>
      片段
    </lark-td>
    <lark-td>
      收录 1098 篇（仅抽读两节）
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/docx/LhDgdOeCRooRnXxdAyUccZKBnQf](https://bytedance.larkoffice.com/docx/LhDgdOeCRooRnXxdAyUccZKBnQf)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S56
    </lark-td>
    <lark-td>
      AI汽车2026规划
    </lark-td>
    <lark-td>
      片段（方案级）
    </lark-td>
    <lark-td>
      2026Q2 文本链路→Quic、多音区独立通道
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/docx/N7C9dVou4oG6yBxXk8JcXhohnSe](https://bytedance.larkoffice.com/docx/N7C9dVou4oG6yBxXk8JcXhohnSe)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S57
    </lark-td>
    <lark-td>
      Audi PP01/PP02 大模型发版记录
    </lark-td>
    <lark-td>
      片段
    </lark-td>
    <lark-td>
      语音修复 Jira、字节 vs 讯飞语义双路对照
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/docx/OGQhdXpfwoUu7OxkSapcxONWnsc](https://bytedance.larkoffice.com/docx/OGQhdXpfwoUu7OxkSapcxONWnsc)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S58
    </lark-td>
    <lark-td>
      公版-AI汽车接口访问指南
    </lark-td>
    <lark-td>
      片段
    </lark-td>
    <lark-td>
      对外 HTTP 接口说明、14+ API
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/docx/OZjjdzEldo3J1pxXQ0OcW5Ugn5d](https://bytedance.larkoffice.com/docx/OZjjdzEldo3J1pxXQ0OcW5Ugn5d)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S59
    </lark-td>
    <lark-td>
      一文看懂如何进行 AI 评测
    </lark-td>
    <lark-td>
      片段
    </lark-td>
    <lark-td>
      通用 badcase 归因方法论（非汽车专属）
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/docx/Q0plddPfroWqIXxs358cEY80njf](https://bytedance.larkoffice.com/docx/Q0plddPfroWqIXxs358cEY80njf)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S60
    </lark-td>
    <lark-td>
      AI汽车文档模块化索引（Aime 聚合）
    </lark-td>
    <lark-td>
      片段
    </lark-td>
    <lark-td>
      模块化目录
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/docx/TuradzgOCovLtNxvaN8cLDMmnXc](https://bytedance.larkoffice.com/docx/TuradzgOCovLtNxvaN8cLDMmnXc)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S61
    </lark-td>
    <lark-td>
      会议助手 TTS 吐字/PCM 节奏工程坑
    </lark-td>
    <lark-td>
      片段（跨域参照）
    </lark-td>
    <lark-td>
      TTS 工程坑（非汽车项目）
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/docx/X1QCdy6QroAYabxtEbIcxZW9nPg](https://bytedance.larkoffice.com/docx/X1QCdy6QroAYabxtEbIcxZW9nPg)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S62
    </lark-td>
    <lark-td>
      汽车座舱账号模型开通管理规范
    </lark-td>
    <lark-td>
      片段
    </lark-td>
    <lark-td>
      2025-11-01 起执行、账号模型
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/BLklwIyZfiMThDkNiOQc16S9nsb](https://bytedance.larkoffice.com/wiki/BLklwIyZfiMThDkNiOQc16S9nsb)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S63
    </lark-td>
    <lark-td>
      【AI汽车0.5】豆包车载版 PRD（路特斯）
    </lark-td>
    <lark-td>
      片段
    </lark-td>
    <lark-td>
      VR 通道 TTS、历史口径
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/DhWHwvmqcixRVEkI9pkce01pnud](https://bytedance.larkoffice.com/wiki/DhWHwvmqcixRVEkI9pkce01pnud)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S64
    </lark-td>
    <lark-td>
      (2026)火山座舱大模型场景智能助手FL
    </lark-td>
    <lark-td>
      片段（sheet 8 子表）
    </lark-td>
    <lark-td>
      成熟度列、Vivi/讯飞配置规划
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/GejVwgw0JiUoZRkgA0ZcEY6Ln0e](https://bytedance.larkoffice.com/wiki/GejVwgw0JiUoZRkgA0ZcEY6Ln0e)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S65
    </lark-td>
    <lark-td>
      AI主线交互（二代设计稿）
    </lark-td>
    <lark-td>
      片段
    </lark-td>
    <lark-td>
      VPA 状态机、多人免唤醒打断/合并、15s 超时
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/H64kwzDnKi14qEkK3DPcEmgtndg](https://bytedance.larkoffice.com/wiki/H64kwzDnKi14qEkK3DPcEmgtndg)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S66
    </lark-td>
    <lark-td>
      【AICar】主线端侧VLM需求汇总 V1.0
    </lark-td>
    <lark-td>
      片段
    </lark-td>
    <lark-td>
      端侧 VLM 需求
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/HqaswAMWviJEVAkdmBxcZ8eUnBb](https://bytedance.larkoffice.com/wiki/HqaswAMWviJEVAkdmBxcZ8eUnBb)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S67
    </lark-td>
    <lark-td>
      火山座舱ToB主线资源池迭代方案(2026)
    </lark-td>
    <lark-td>
      片段（方案级）
    </lark-td>
    <lark-td>
      稳定版/先行版双版本策略
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/JCIewe7qZiM6Bwk5Xe8cS0L6nhh](https://bytedance.larkoffice.com/wiki/JCIewe7qZiM6Bwk5Xe8cS0L6nhh)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S68
    </lark-td>
    <lark-td>
      【AI汽车】司机 Agent（舱驾融合）PRD
    </lark-td>
    <lark-td>
      片段（非功能）
    </lark-td>
    <lark-td>
      端到端时延≤2s、SLA 99.9%、接管提前 10s
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/M8n2wAHP0i36wukldtncEy2bnhh](https://bytedance.larkoffice.com/wiki/M8n2wAHP0i36wukldtncEy2bnhh)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S69
    </lark-td>
    <lark-td>
      产品团队新入职同学培训手册
    </lark-td>
    <lark-td>
      片段
    </lark-td>
    <lark-td>
      入职培训
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/NUcxwTRT6iqYcSkDkGYcwP4Tnxc](https://bytedance.larkoffice.com/wiki/NUcxwTRT6iqYcSkDkGYcwP4Tnxc)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S70
    </lark-td>
    <lark-td>
      豆包座舱助手上线合规指南
    </lark-td>
    <lark-td>
      片段
    </lark-td>
    <lark-td>
      法务培训、家越07 实车体验反馈
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/RsZqweNv7iObEFkDCn7chgBonWd](https://bytedance.larkoffice.com/wiki/RsZqweNv7iObEFkDCn7chgBonWd)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S71
    </lark-td>
    <lark-td>
      实时音频算法 2025 Q3 OKR（打断率专项）
    </lark-td>
    <lark-td>
      片段
    </lark-td>
    <lark-td>
      打断率专项 OKR
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/SxXvw9UZnixopDkiPYGcax5Gnhc](https://bytedance.larkoffice.com/wiki/SxXvw9UZnixopDkiPYGcax5Gnhc)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S72
    </lark-td>
    <lark-td>
      Ai汽车测试质量评测标准
    </lark-td>
    <lark-td>
      片段（sheet）
    </lark-td>
    <lark-td>
      合成/端到端/质量门禁目标值
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/Ur3Zwu4LMiqatwk4xrScTwYMntV](https://bytedance.larkoffice.com/wiki/Ur3Zwu4LMiqatwk4xrScTwYMntV)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S73
    </lark-td>
    <lark-td>
      座舱大模型ToB产品找人地图
    </lark-td>
    <lark-td>
      片段（待更新）
    </lark-td>
    <lark-td>
      找人地图
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/VjYFwmfmIiFfKokgQrfcAiJgnJd](https://bytedance.larkoffice.com/wiki/VjYFwmfmIiFfKokgQrfcAiJgnJd)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      S74
    </lark-td>
    <lark-td>
      Privacy-203 / DataSecurity-304 制度
    </lark-td>
    <lark-td>
      片段
    </lark-td>
    <lark-td>
      公司级隐私/数据权限制度
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/wikcnmMz9p7czLIxHYoGy4tQjPf](https://bytedance.larkoffice.com/wiki/wikcnmMz9p7czLIxHYoGy4tQjPf)
    </lark-td>
  </lark-tr>
</lark-table>

### 11.C 无法核读（7 项：权限不足 6、链接失效 1）

<lark-table rows="8" cols="4" header-row="true" column-widths="80,212,128,318">

  <lark-tr>
    <lark-td>
      #
    </lark-td>
    <lark-td>
      标题
    </lark-td>
    <lark-td>
      状态
    </lark-td>
    <lark-td>
      URL
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      D01
    </lark-td>
    <lark-td>
      车载豆包Speech侧语音交互链路技术方案
    </lark-td>
    <lark-td>
      权限拒绝
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/docx/P5RJdPX9RoodXZximotcDM41n1l](https://bytedance.larkoffice.com/docx/P5RJdPX9RoodXZximotcDM41n1l)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      D02
    </lark-td>
    <lark-td>
      AI Car当前架构整体介绍 20250822
    </lark-td>
    <lark-td>
      权限拒绝
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/docx/ZxoMdCCROoSCXbxAFG7cSaBRnDe](https://bytedance.larkoffice.com/docx/ZxoMdCCROoSCXbxAFG7cSaBRnDe)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      D03
    </lark-td>
    <lark-td>
      AI汽车拒识 OnePage
    </lark-td>
    <lark-td>
      权限拒绝
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/PGYJwBYhEijPqWk3ZoCc2XEdnFg](https://bytedance.larkoffice.com/wiki/PGYJwBYhEijPqWk3ZoCc2XEdnFg)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      D04
    </lark-td>
    <lark-td>
      【AI汽车-PRD】对话打断体验优化
    </lark-td>
    <lark-td>
      权限拒绝
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/UIg4whMFhiMTaLk9jgqclAUfnvd](https://bytedance.larkoffice.com/wiki/UIg4whMFhiMTaLk9jgqclAUfnvd)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      D05
    </lark-td>
    <lark-td>
      AI汽车横展以及非豆包账号体系架构
    </lark-td>
    <lark-td>
      权限拒绝
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/Rre5wPq3oiy1bmkm1v3cgQCanvb](https://bytedance.larkoffice.com/wiki/Rre5wPq3oiy1bmkm1v3cgQCanvb)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      D06
    </lark-td>
    <lark-td>
      【AI汽车】工具库-V1.0
    </lark-td>
    <lark-td>
      链接失效/无权限（检索地址不可用）
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/Li6JwGc2Si1I9xkfWyncI6NQnth](https://bytedance.larkoffice.com/wiki/Li6JwGc2Si1I9xkfWyncI6NQnth)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      D07
    </lark-td>
    <lark-td>
      【2025版】火山座舱大模型场景智能助手 PRD
    </lark-td>
    <lark-td>
      权限拒绝
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/WK1hwIF9HioourkeI8PcWnRXndd](https://bytedance.larkoffice.com/wiki/WK1hwIF9HioourkeI8PcWnRXndd)
    </lark-td>
  </lark-tr>
</lark-table>

<quote-container>

以上 7 篇为「发现集内、当前账号无访问记录」的来源，与「未发现/未覆盖」分开计数：D01–D05、D07 是访问被拒，D06 是检索链接失效。工具库 V1.0 车控/导航/音乐工具清单因链接失效，工具级参数粒度仅到 AgentType 域。

另有一篇《服务端技术评审-多级VAD策略》与 OnePager/多级VAD PRD 主题重叠，本轮未逐篇深读、仅引用其结论，不列入权限拒绝。
</quote-container>

### 11.D 关联待查（发现集内、仅入口未深读，与语音间接相关）

<quote-container>

以下 5 条来自治理索引的关联候选，与座舱语音实现间接相关，本轮未深读，保留在发现集内供后续按需展开；不作为正文事实来源。
</quote-container>

<lark-table rows="6" cols="4" header-row="true" column-widths="80,176,176,306">

  <lark-tr>
    <lark-td>
      #
    </lark-td>
    <lark-td>
      标题
    </lark-td>
    <lark-td>
      关联性质
    </lark-td>
    <lark-td>
      URL
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      R01
    </lark-td>
    <lark-td>
      202505 座舱大模型产品规划
    </lark-td>
    <lark-td>
      产品规划（历史时点），间接关联路线图
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/docx/BdQIdOgjuoK655xCagOcf6bln6e](https://bytedance.larkoffice.com/docx/BdQIdOgjuoK655xCagOcf6bln6e)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      R02
    </lark-td>
    <lark-td>
      2B 产品规划
    </lark-td>
    <lark-td>
      ToB 产品规划，间接关联
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/docx/CfxGd5ZMUox8aIxnLllclIfNnzq](https://bytedance.larkoffice.com/docx/CfxGd5ZMUox8aIxnLllclIfNnzq)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      R03
    </lark-td>
    <lark-td>
      oem 共建基于 LLM 的座舱智能化底座
    </lark-td>
    <lark-td>
      OEM 共建底座，间接关联
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/docx/EwgedOHRIocJAfxlR9BctMxmnDf](https://bytedance.larkoffice.com/docx/EwgedOHRIocJAfxlR9BctMxmnDf)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      R04
    </lark-td>
    <lark-td>
      VLM 资源采买需求说明-汽车智能驾驶座舱
    </lark-td>
    <lark-td>
      VLM 资源采买，间接关联（信号触发类）
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/wiki/Q3CJwUH5wiUkEjkQp7TcqPfunQi](https://bytedance.larkoffice.com/wiki/Q3CJwUH5wiUkEjkQp7TcqPfunQi)
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      R05
    </lark-td>
    <lark-td>
      座舱产品双周会（系列，最新一期 20250519）
    </lark-td>
    <lark-td>
      双周会系列入口，仅目录
    </lark-td>
    <lark-td>
      [https://bytedance.larkoffice.com/docx/L4TudfVpRosIfoxmuGtcPvN4nac](https://bytedance.larkoffice.com/docx/L4TudfVpRosIfoxmuGtcPvN4nac)
    </lark-td>
  </lark-tr>
</lark-table>

---

## 12. 缺口和阅读路线

### 12.1 已知缺口（别对外讲死）

1. Hard VAD 生效阈值：OnePager 写 600ms、多级VAD PRD 写 500ms，不一致，待向算法确认；单人打断字数阈值 OnePager 标注「待确认」。
1. 在线 ASR 平均耗时指标 FeatureList 未填。
1. 拒识 OnePage（D03）与拒识 2.0 方案正文未读，拒识规则分级细节缺。
1. Planner 输出/json 稳定性方案无确认 URL；工具库 V1.0 工具级参数粒度仅到 AgentType 域。
1. 多轮会话窗口/历史截断阈值无来源（仅知近 10 分钟并入 3 条事件）。
1. 触发器端侧技术方案、事件生产使用迭代未读。
1. 跨车型现行部署未证明，本文方案版本均以对应文档/记录项目为限。
1. 端到端首字播报 P90 最新实测值（仅到 2026-01）；离线 TTS 的 MOS/接近度/耗时值空缺；对话风格切换指标空缺；全时免唤醒多音区 ACC「待 S8 后定义」；Planner TTS 乱序的 meego 单明细闭环状态。
1. Input Manager 是否已在非 Seres 项目放量，无文档证明。
1. 海外套件语音入口、语音内容审核/敏感词/声音版权专项未命中。
1. 《可见即可说》（https://bytedance.larkoffice.com/wiki/AxYjwUI8wiFCXWkdNsDcRae0nCf）仅作为主索引 raw_urls 被发现，不是独立核读来源；主索引全文获取不掩盖该子文档正文未读。其余 8 项（车内语音、多人同时、多级VAD、免唤醒、离在线仲裁、打断策略、离在线TTS、车控TTS）均已在 sources 全文获取。

### 12.2 建议先读的 5 个入口（按场景路由）

1. **建立全链路心智**：先读 [OnePager](https://bytedance.larkoffice.com/wiki/GBcCw5c6xiWvGukPMQgcMiuKnEc) + [端云链路 One Page](https://bytedance.larkoffice.com/wiki/DBRnwrLFNiPxV5kZZOXcBYxqnCl?from=lark_search_qa&ccm_open_type=lark_search_qa#doxcnoo8QmUh1XSrQVV5euppWMd) —— 现行主链路与端云分工。
1. **讲 Planner/Agent**：读 [Planner One Page](https://bytedance.larkoffice.com/wiki/EWziwFVftiGvnlk0FA4cadqonud) + [任务Planner PRD](https://bytedance.larkoffice.com/wiki/FKefw6e9uiIZiLkQuqwccsqAnVR)。
1. **评审 badcase/排查**：读 [Fornax Trace SOP](https://bytedance.larkoffice.com/wiki/KMNVwu51giBbgRkfmWDcTGpBnKb)，按 answer_source 第一层分流。
1. **对齐指标口径**：读 [评测标准](https://bytedance.larkoffice.com/wiki/Ur3Zwu4LMiqatwk4xrScTwYMntV) + [FeatureList](https://bytedance.larkoffice.com/sheets/PHXzs0YEmhomVQtvpcbcdsXqneg)，目标值与交付状态分开问。
1. **找资料索引**：从 [主索引](https://bytedance.larkoffice.com/wiki/Zi6fwVKgvi6bo2k3UiCc90Ccntf) 按 13 模块行找工程/算法/端侧/产品链接。

---

## 附：归并与冲突规则声明

- 旧 SOR 的 S2S/RTC 与 202607 文本链路**保留版本**，不合并现行。
- 600ms/500ms Hard VAD **保留待确认**，不推断差异原因。
- 温柔桃子/SAMI 与 2026FL Vivi/讯飞配置**分车型/规划**，不是相互替代。
- 思必驰（端侧输入/离线）与讯飞（2026FL 多音区/多路交互）**按出处项目区别**。
- 指标目标 vs 1 月 Demo 实测 vs S2S 样例**严格分开**；S2S 样本 275/268/73/67 case 样本集不同**不可比**。
- 家越 07 只是实车体验反馈，**无首发证据**。
- 治理源即使标现行但 status_basis 只说跟踪/维护，成稿标**进行中需求/非部署**。
- 本稿所有【解读/建议】为基于证据的分析判断，非内部既定事实；不使用公开事实替代内部事实；不夸大已读覆盖。
