# 第五轮返工规范：删掉简陋补充图，新图重画到原图水平（硬约束）

副本：https://bytedance.larkoffice.com/docx/CYRndDwjDo7TvRxTshac5QWxnAg （revision 已到 288，动手前必须重新 fetch，禁止用旧快照）。原文档 DfiydEuaQoKDERx4PLEc9AA7nDf 仍然只读。

## 用户结论
用户逐张看过画板：原有 23 张画板质量高（以 02 R 图为标杆：上百个文本元素、编号节点、金/蓝/绿颜色语义、密集排版）；后来新增的约 70 张图大多只有 6–24 个文本框，是简单竖向流程图，“逻辑图被改了、没之前清晰”。用户选择：保留原图，新图重画到原图水平；达不到的图删除，信息并入正文。

## 23 张原图白名单（永远不许删除、不许重画、不许移动；token 如下）
总图 JGwiwsR9rhy182b3Oz6cmJcjnqg
01 V Y772w0iwBhdfHZbox5XcmYBwnEf｜02 R DtbpwZyqrhoj32bLSa1ckstzn9e｜03 M JNOIwvqDmhGzSxbuYq0cdInhnSd｜04 C XivlwS6OQhT4Ppb29BscBgbvnH0｜05 D EjAgw8CNXhDoqgbwTsQcFWBAnNc｜06 E H24fwt0svhvMXMbQ4tNc6Wk9nQc｜07 O OtbAwf41DhD9hqb4E7icb0KonTg｜08 I EhIIwSTEHhEpU8b8IP0crDDfn6g｜09 W Xp2CwvW6BhNRvMbDgDjc7lpPnbr｜10 F FpijwuuTHhW6iZbgJmicSmisnuf｜11 K Ajnhw8ztzhKaBkbYUf3ceaJynCd｜12 T Xbdqwjm0ph5XSEbg0fmc60gPnuh｜13 G VBR1wT15AhmlcEbcN7dcgVVJnDe｜14 L HqClwTmUJhEklWbhNdpc6891nIg｜15 S FxdhwToOehqbPubF8OwcSMvxnDb｜16 P VKqswpOfeh1dRJbgWgxcub16nic｜17 A O2EmwDWeWh4FGpbDltyc8qkQnxb｜18 H MMMywwe3JhSYLfbtduJcrFsHnJh｜19 B Wq4NwlCaEhE3fLbwyPacwCRwnWe｜20 U RCu9wnQOChoCORb9v4PczkQhn0e
附录 MVpIwXX1rhUfV8bGK0jc4vT3nLd、YX0qwoW4YhxhAVbpXJGcHSvcnog
除这 23 个 token 外，01–20 章节里的其他画板，本轮全部删除（先并信息、后删块）。

## 01–20 各章清理流程
每章要删的新增画板约数（以 fetch 实际为准）：01 两张、02 三张、03 两张、04 三张、05 三张、06 三张、07 两张、08 一张、09 一张、10 两张、11 两张、12 两张、13 三张、14 三张、15 两张、16 一张、17 两张、18 两张、19 一张、20 两张。
步骤（严格按顺序）：
1. fetch 整章，列出全部 block：区分“原图白名单画板”“要删的画板”“这张图怎么看”“逐个节点讲透”“最新 PRD 补细/权威画板补充”等。
2. 对每个要删的画板，先把它独有的信息（节点、条件、分叉、数字、例子）合并进文字：
   - 属于原图节点细化的，并进“这张图怎么看”或“逐个节点讲透”里对应节点的段落；用节点编号写清，例如“R5 还要注意……”，让读者在原图上找得到。
   - 属于其他 PRD 的新事实（Q 图、P 图、权威画板补充），并入“最新 PRD 补细（2026-10 口径）”的正文段落；该 H2 保留，画板删除。
   - 信息不许丢，数字、指标、车型、出处链接保留。
3. 删除简陋画板 block，以及只服务于该图的“这张补充图怎么看/这张 XX 图怎么看”标题和说明段（内容先合并再删标题）。最终每章只剩 1 张原图，结构为：承接 → 位置 → 原图 → 这张图怎么看 → 逐个节点讲透 → 讲课正文 → 产品经理要问清什么 → 验收指标 → 原文入口 →（如已有）最新 PRD 补细（纯文字）→ 交接。
4. 原图不要编辑、不要增补节点（原图已很满；所有补充一律落在正文）。
5. 坏块处理：导出每个非白名单画板验证。若报 whiteboard not exists（已知 02 章 XI0NweL3AhntZGbYASkcE8KbnFK 是坏块），删除该坏画板 block；其说明文字若信息已并入正文则一并清理，否则保留文字并注明“原图块已失效，内容见正文”。
6. 删完回读整章：只剩 1 张白名单原图；无悬空标题（例如标题下没有图或没有正文）；无乱码、无转义残留、无 mermaid 源码裸露。

## N 章画板重画标准（N1–N18，逐张达标）
每个 N 章最终只保留 1 张高质量画板（N12 原来没有图，本轮新建 1 张）；N 章里已有的 Q 补充图内容并入这张主图或正文后删除。
标杆：副本里的 02 R、01 V 原图（先导出 raw 和 preview 对照学习）。
画法硬标准：
- 节点统一编号 N?-01…（或沿用资料中的节点 ID），每个节点卡片含五段：编号、一句话标题、要点、讲解①、讲解②（讲解用资料原话改写，不编造）。
- 颜色：蓝底=普通处理，金底=判断/检查关卡，绿底=交出结果/回流（底色含义是从原图内容推断的惯例，图例里可注明）。
- 线型：蓝粗=请求与动作主链，绿=结果回流，金=任务与触发，红=打断，灰虚线=职责引用，金虚线=规划中/长期。
- 模块框带模块名和一句话说明；跨模块连线标 from→to 和线上文字。
- 图上必须有图例框；高密度排版，信息量向 R 图看齐，不许再画成只有几个框的竖条流程图。
- 技术路线：优先用 lark-whiteboard 的 DSL/SVG 路线（先读 /home/user/.doubao/agent_mode/workspace/.skills/lark-whiteboard/SKILL.md、routes/dsl.md、routes/svg.md、scenes/architecture.md；本机若路径不同，用 `lark-cli whiteboard --help` 和 skills 目录查找）。不要用 mermaid 交差，mermaid 做不出五段卡片和颜色语义。
- 内容只来自已读资料（W1/W2/W3、one page、各组 impact_*.md、coverage 记录对应的原文）。每个事实可追溯；每个节点标状态：长期愿景/2.6 目标/已落地/讨论中/待核（可在卡片角标或分区底色体现，状态含义写进图例）。
- 每张图画完：whiteboard +export --output-type preview 导出后用 Read 亲眼看：无重叠、无裁切、无乱码、无文本溢出；再导出 raw 核对节点数和连线。不合格就重画，直到合格。
- 图后紧跟“这张图怎么看”，讲清入口、出口、阅读顺序、每个分叉（条件→去向→车内感受→例子）、画法含义、易错点。

## 00 章和模块映射章（单独代理负责，不在模块组范围内）
00 对照图 ActvwMFBxhb1mzbLZ6McKGI5nTc、全模块地图 VC9AwTSezh486KbnP74cOae1nbd 保留并检查；达不到原图风格就按同一标准重画。26 行以上的对照表保留。

## 并发安全
只动自己负责章节；删除用 block_delete 前先备份本章 block 清单到本机 scratch；任何删除操作的范围都不能跨 H1。删除后立即回读。原文档永不写入。

## 交回
按章列出：删除画板 block/token 清单；坏块清单；正文合并要点（每章几条）；N 章新画板 token、节点数、连线数、preview/raw 自检结果；最终每章画板数。
