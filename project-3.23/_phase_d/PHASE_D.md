# 第四轮规范：逐节点讲透、补齐缺失模块、全文顺读（所有子代理共用，硬约束）

## 用户原话（交付时按这段逐条核对）
“我总觉得这些流程图缺少信息，所以文档我一直读不顺，也不够详细，我要尽可能详细地讲。现在内容和可视化都有了，但为什么模块比之前少了？你之前也没认真读我发的飞书文档……而且不只这三篇，还要找其他的，还是不够详细。我让你读所有豆包汽车的文档，去飞书搜，全找出来再画。别偷懒。”

## 文档
- 副本（只写这一份）：https://bytedance.larkoffice.com/docx/CYRndDwjDo7TvRxTshac5QWxnAg 。现在有 36 个一级标题、56 张画板，结构依次为：总图/开篇课程 → 00 新旧架构对照 → 01–20 模块（每个模块下有原画板和一张补充细节图）→ 补充模块总览 → N1–N10 → 21 工具明细 → 附录 v15 原图 → 附录 已读资料清单。
- 原文档 DfiydEuaQoKDERx4PLEc9AA7nDf 只读，永远不改（现在是 revision 163，其中那一处修改是别人手动做的，与我们无关）。
- 现有画板一张都不能删。副本里的画板 token 和原文档相互独立，所以必要时可以在原画板空白处增补节点，但首选还是在原画板下方新增“补全图”或“补充细节图”。

## v14 全景图逐节点讲解（这是最低覆盖集，291 个节点必须全部在正文里讲到）
下面这些文件取自用户本地 v14 SVG，节点编号与副本里的 20 张模块画板一一对应。每份文件包含：节点编号、标题、要点、两段讲解、模块内连线（起点→终点及线上文字）、跨模块的进出连线。用 curl -sL 下载：
00 总览/图例/89 条跨模块连线 https://aka.doubaocdn.com/s/WYGsznBKs4
01 V https://aka.doubaocdn.com/s/C5QVshZ9M4 ｜02 R https://aka.doubaocdn.com/s/YX5D6InTQ5 ｜03 M https://aka.doubaocdn.com/s/GwEDtQSOR9 ｜04 C https://aka.doubaocdn.com/s/jkV8fiN9CH
05 D https://aka.doubaocdn.com/s/GZmBWzSqeq ｜06 E https://aka.doubaocdn.com/s/nrsxflqSnU ｜07 O https://aka.doubaocdn.com/s/ZyDvEoeOLb ｜08 I https://aka.doubaocdn.com/s/gAK2rFxV8i
09 W https://aka.doubaocdn.com/s/1DahZq8NGA ｜10 F https://aka.doubaocdn.com/s/lxpLpjc00S ｜11 K https://aka.doubaocdn.com/s/exfobDUPe8 ｜12 T https://aka.doubaocdn.com/s/RlEmR2JRrX
13 G https://aka.doubaocdn.com/s/H2eQYgzgAR ｜14 L https://aka.doubaocdn.com/s/icaaAoXkZV ｜15 S https://aka.doubaocdn.com/s/G83wnLDOGt ｜16 P https://aka.doubaocdn.com/s/pJNfygtj79
17 A https://aka.doubaocdn.com/s/SIIbwhVNqk ｜18 H https://aka.doubaocdn.com/s/jUGNLxVO4E ｜19 B https://aka.doubaocdn.com/s/ngtiqYFsEt ｜20 U https://aka.doubaocdn.com/s/PcbuPQ14tN
21 工具（40 条 + 6 项专项定义） https://aka.doubaocdn.com/s/l8hvkB6uCf
图例按图上原文：蓝 = 请求与动作；绿 = 结果回流；金 = 任务与触发；红 = 打断；虚线 = 规划或职责引用。节点底色（金 = 检查/判断关卡，绿 = 交出/回流，蓝 = 普通步骤）图例里没有写，是从节点内容推断的，写进文档时注明“从节点内容看”。
v14 的措辞是 10/26 的最新版本，和画板文字不一致时以 v14 为准；画板上没有、v14 上有的内容就补进去。不要新增任何没有出处的事实。

## 证据（可以重复读）
- 用户点名的三篇：W1《豆包incar1.0-长期架构梳理》docx XM8GdtFsTok8CwxcMrKcywMmnQg（9 张画板）；W2《AI Car主链路架构》docx D74Nd1lY0ofA1fxpW0ccEAXHnEe（5 张画板：UXazwd8KUhzdXtbMOglcLI2FnKd 宏观三栏+基础能力、UeUuwvgqDhYKucbs5vRcKVBkn3d 落地链路细化、Xfa7wPCzvhDB1Wbe9MKcYfCQn9f ToB、JEFiwNjyDhMImubIhs2c804lnie 和 AosUw8RohhkPH3bZRnRcZ0f3nmh 豆包架构及分工，另有“链路性能”“车企协作链路架构”两节和 3 个引用）；W3《AI汽车2.6目标拆解》docx D6ardXGkWo2V0HxL8wpc8pdanhc（1 张画板 VfxMwPiVmhUV5abP78ZcaXMSnzg，54 个引用）。
- 上一轮的调研产物（如果你的环境能访问）：/home/user/.doubao/agent_mode/workspace/.sessions/38449669353554434/agents/o_000pB6zdtHF/scratch/research/{w1,w2,w3a,w3b,search}/digest.md，以及 search/module_gaps.md、mem_plan.md、ctx_rag.md。访问不到就直接用 lark-cli 重读原文，同时参考副本里已经写好的 N 章和补充图。
- 工具：lark-cli docs +fetch / +update；whiteboard +export --output-type preview（导出后用 Read 看图）或 raw；drive +search；wiki 相关命令；enterprise_agentic_search。没有权限的就跳过并记录，不申请，也不追问用户。会议纪要要读到底部的文字记录或逐字稿。证据优先级：逐字稿 > PRD/技术方案 > AI 纪要。

## 写法（读者与口吻）
读者是刚入职的豆包汽车座舱 AI 产品经理，零基础，负责触发器和 DT，也参与记忆工作。DT 不要展开缩写。
像老师上课：先讲读者会遇到什么问题、为什么会发生，再讲办法和例子。每段只讲一个意思。术语第一次出现时，要讲清它在链路里的位置、输入、输出和交给谁。不堆英文节点；ASR、VAD、TTS 这类名词保留，但要配中文解释。不能用“详见文档”代替解释。表格和列表只用于并列比较或操作步骤。
全文用同一个贯穿案例：“带我去昨天那家游泳馆”→ 在卡片上选“第二个”→ 副驾插话“别说了”→“快到时提醒我拿泳镜”。
新写入的每一项都要标状态：【长期愿景】【2.6目标】【已落地】【讨论中】【待核】，并标适用车型（路特斯/赛力斯/上汽/通用/未说明）。资料之间有冲突时写“资料冲突”，并写明各自出处。车型差异和待核项放在每节末尾的短补充段里，不打断主线。
badcase 按四类根因归类：规则设计缺陷 / 端侧资源限制 / 大模型输出不稳定 / 软硬件时序冲突。

## 逐节点讲解的标准（“尽可能详细”的验收口径）
每张图上的每个节点编号都要在正文里讲到，包括：它是什么；输入 → 判断 → 输出；分支条件和各自去向；一个具体例子，以及用户在车里的感受；最容易看错的地方。不允许有节点没讲。跨图引用的节点编号（例如在 R 图里出现 C5），第一次出现时就地用一句话说明它是哪张图的什么。
写法建议：在每个模块的“这张图怎么看”之后新增 H2“逐个节点讲透”，按主路顺序逐个讲解，每个节点用加粗编号开头，自成一段或一组段落；分支较多的节点用小表格列出“条件 / 去向 / 用户感受 / 例子”。如果原有正文已经把某个节点讲透，可以并入，但仍要保证每个编号都能在本节找到。

## 并发安全
只改自己负责的章节，也就是从本节 H1 到下一个 H1 之前，不改 H1 标题文字，不碰别人的章节。写入用 block_insert_after 或 block_replace，替换范围不能覆盖画板。动手前重新 fetch，取最新的 block id。写完回读本节，确认画板在位、导读紧跟画板、没有转义残留或乱码。画板改完要导出预览图检查：没有重叠、没有裁切、没有乱码，编号和正文一致。

## 交回（800 字以内）
每节写一行：v14 节点数 / 正文已覆盖数（必须相等），新增或修改的画板（block id / token），新增节点及出处，待核项，跳过项及原因。
