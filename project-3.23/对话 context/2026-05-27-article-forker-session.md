# Article Forker 对话记录 — 2026-05-27

> 本文档是 Claude Code 终端会话的完整上下文记录，包含前序会话摘要 + 本次会话的所有交互。

---

## 一、前序会话摘要（Context Compaction Summary）

本次会话是从一个超出上下文窗口的前序对话中延续过来的。以下是前序对话的完整摘要：

### 1. 用户身份与项目背景

用户是字节跳动的 AI 产品经理（豆包上车 Driver Agent 2.0 Planner），使用 `/forkit` article-forker skill 将文章 fork 成结构化知识资产。每次 fork 产出：
- `source.md`（逐段深度分析）
- `concept.md`（教程，连接文章洞察到用户的 Planner 工作）
- `tool.html`（交互式可视化教程，含 SVG 图、Quiz、Prompt 模板）
- `metadata.json`
- INDEX.md 更新
- 飞书 wiki 上传（含快速入口交叉链接）

### 2. 关键用户反馈

会话中期收到关键反馈："你给我整理的都不够详细啊,而且也不能让我深度理解这里面的文章,不能复用在自己身上"

此后所有 fork 都按更高标准执行：
- 逐段分析每段 3-5 句独立分析（非复述原文）
- 每段含"与你工作的直接关联"
- 包含具体可操作项（Prompt 模板、SOP、Checklist）
- 跨 fork 交叉引用

### 3. 前序已完成的 Fork

#### Fork 1: AGI时代产品战略判断框架（2026-05-25）
- 来源：李广密 + Hassabis 两篇访谈综合
- 产物：source×2, concept, tool
- 飞书：source-1 (X56Zd0XF7oWIkNxOiUQcNsD2n9d), source-2 (GyLDdEPv2o3seyxAn6ZcgLfCn9p), concept (Wt0jdFPVNocMVSxjUBicNGNAnab)
- 本地：`forks/2026-05-25-agi-roadmap/`

#### Fork 2: PM和设计师即将赢下AI时代 — Dan Shipper（2026-05-26）
- 来源：Dan Shipper × Lenny's Podcast
- 产物：source, concept, tool
- 飞书：source (UdqqdMvxRoCutvxIJ10cHsG6nhc), concept (E6n5dhCAwo4FY0xqObEcIVjAngg)
- 本地：`forks/2026-05-26-pm-designer-ai-era/`
- 关键内容：核心认知转变、Reach Test、养Agent SOP（日/周/Sprint/月）、Agent-Friendly检查清单6项、PM做实验4场景+Prompt模板

#### Fork 3: 不会用AI的产品经理，开始被清洗了（2026-05-26）
- 来源：MindCode 观点文章
- 产物：source, concept, tool
- 飞书：source (ToEkdczg0onLQKxvlYpcidUZn3f), concept (D92KdDjQEoSzUbxJV7pcn8dcnBe)
- 本地：`forks/2026-05-26-pm-ai-cleanup/`
- 关键内容：L0-L3分层定位、上下文四分法（业务/架构/历史/实时→SP映射）、三件套升级路径、10倍效率=回测循环

### 4. 技术细节

- 飞书 wiki space_id: 7630463641124342714
- lark-cli 用于飞书操作（docs +create, +update --mode append）
- 已知问题：lark-cli 不支持绝对路径（需 cd 后用相对路径）；--wiki-space 和 --wiki-node 互斥
- HTML 工具标准：深色主题(#0b0f1a)、左侧固定导航、顶部进度条、模块化编号、inline SVG图、响应式

### 5. 前序会话中断时的状态

Fork 4（王建硕：Markdown 是新时代的编程语言）已创建 source.md，但 concept.md、tool.html、metadata.json、INDEX.md 更新、飞书上传均未完成。

---

## 二、本次会话交互记录

### 2.1 继续完成 Fork 4：王建硕 Markdown 是新时代的编程语言

#### Claude 读取已有 source.md

读取了 `forks/2026-05-27-markdown-is-programming/source.md`，确认内容完整（8段逐段拆解：层的革命、5分钟闭环、PM Agent、Agent团队、几万行.md=源代码、聊天≠编程、抬轿子/车/驾驶员、Token是GDP）。

目录当时只有 `source.md` 一个文件。

#### Claude 创建 concept.md

创建了 `forks/2026-05-27-markdown-is-programming/concept.md`：

标题：**SP即源代码——用编程思维重新定义你的SP维护工作**

内容结构：
1. **核心范式转换**：传统编程 → 王建硕新编程 → 你的SP维护，三栏精确映射表（12行对照：源代码/编译器/编译产物/运行时/Bug/修Bug/测试/版本控制/Review/重构/技术债/依赖管理）
2. **"手写自然语言量=控制颗粒度"**：SP各部分token占比量化（示例50%、工具定义25%、设备知识9%等），自检方法（随机抽规则能否说出来源badcase）
3. **四个行为转变**：
   - 转变1：SP修改=commit（含SP Changelog模板）
   - 转变2：回测=单元测试（3步SOP+Prompt模板）
   - 转变3：SP评审=Code Review（6项检查清单+Prompt模板）
   - 转变4：技术债清理=重构（5种SP技术债类型表）
4. **5分钟闭环愿景**：当前迭代瓶颈分析（发现1-3天/分析1-2天/写修改几小时/回测不做/上线走流程），3个短期可做的加速点，Badcase自动分类Prompt模板，SP修改方案生成Prompt模板
5. **聊天vs编程**：消耗型vs积累型对比表，"你当前的聊天行为"列表，判断标准
6. **SP目录结构类比**：SP十个组成部分 ↔ 代码项目目录结构，6条工程实践映射
7. **五篇fork综合行动表**：7层（认知/定位/框架/方法/度量/战略/风险）+ 本周P0/P1/P2行动清单
8. **判断标准**：在"编程"的5个信号 vs 在"写文档"的5个信号

#### Claude 创建 tool.html

创建了 `forks/2026-05-27-markdown-is-programming/tool.html`（56KB）：

- 8个模块（M0-M7）
- 7个 inline SVG 图：
  - 图0：五篇fork知识体系全局图
  - 图1：层的革命三栏对比（传统编程 vs 王建硕 vs 你的工作）
  - 图2：SP Token分布图（各组成部分占比）
  - 图3：SP工程化操作流程（6步循环+定期重构）
  - 图4：迭代速度对比（王建硕5分钟 vs 你当前2-3周 vs 目标1-2天）
  - 图5：聊天vs编程对比（消耗型 vs 积累型）
  - 图6：SP目录结构类比（monospace树形图）
  - 图7：五篇fork知识网络（中心辐射图）
- 3个可复制 Prompt 模板（SP changelog/Badcase分类/SP修改方案生成），带"复制"按钮
- 2个自测 Quiz
- 深色主题、左侧固定导航、顶部进度条、滚动高亮、响应式

#### Claude 创建 metadata.json

```json
{
  "article_title": "王建硕：Markdown 是新时代的编程语言",
  "fork_date": "2026-05-27",
  "fork_time": "2026-05-27 10:00",
  "article_type": "框架型+方法论型",
  "category": "框架",
  "tags": ["Markdown即编程", "SP=源代码", "LLM=编译器", "手写量=控制力", "聊天vs编程", "5分钟闭环", "Token是GDP", "Agent团队"],
  "fork_outputs": ["source", "concept", "tool"],
  "feishu": {
    "source_doc_id": "WnQFdVuKtodqGoxUyJ0clpLan3d",
    "source_url": "https://www.feishu.cn/wiki/WtB5wBYHsiiTyCkaORVcDgcFnpd",
    "concept_doc_id": "RLxWdE9kfoBQpNxcOMNcWfBwnJe",
    "concept_url": "https://www.feishu.cn/wiki/Q1zTwZaGwiuslOkZPtycyYUfnQH"
  }
}
```

#### Claude 更新 INDEX.md

在 `forks/INDEX.md` 顶部追加了一行：

```
| 2026-05-27 | 王建硕：Markdown 是新时代的编程语言 | 框架 | source, concept, tool | [2026-05-27-markdown-is-programming](2026-05-27-markdown-is-programming/) | [Source](https://www.feishu.cn/wiki/WtB5wBYHsiiTyCkaORVcDgcFnpd) · [Concept](https://www.feishu.cn/wiki/Q1zTwZaGwiuslOkZPtycyYUfnQH) |
```

#### Claude 上传到飞书

1. **Source 页面**：`lark-cli docs +create` 创建于 wiki/sources 节点下
   - doc_id: `WnQFdVuKtodqGoxUyJ0clpLan3d`
   - url: `https://www.feishu.cn/wiki/WtB5wBYHsiiTyCkaORVcDgcFnpd`
   - 内容分3次 append（摘要+关键要点 → 第1-2段 → 第3-5段 → 第6-8段+论证链+假设+边界）

2. **Concept 页面**：`lark-cli docs +create` 创建于 wiki/concepts 节点下
   - doc_id: `RLxWdE9kfoBQpNxcOMNcWfBwnJe`
   - url: `https://www.feishu.cn/wiki/Q1zTwZaGwiuslOkZPtycyYUfnQH`
   - 内容分2次 append

3. **LOG 更新**：`lark-cli docs +update --mode append` 追加记录

#### Claude 输出总结

```
Fork 完成！生成了以下内容：

本地文件：
- source.md — 8段逐段拆解
- concept.md — "SP即源代码"教程
- tool.html — 8模块可视化教程（7个SVG图）
- metadata.json — 含飞书链接

飞书知识库：
- Source: https://www.feishu.cn/wiki/WtB5wBYHsiiTyCkaORVcDgcFnpd
- Concept: https://www.feishu.cn/wiki/Q1zTwZaGwiuslOkZPtycyYUfnQH

核心命题：你的SP就是王建硕说的"几万行.md"——你已经在"编程"了，
只需要用编程的标准对待它：版本控制（changelog）、测试（回测）、
Code Review（6项检查）、重构（技术债清理）。
```

---

### 2.2 用户发送新文章：Agent感知差距

用户粘贴了完整文章：

> **最大的风险：别人的Agent很强，但你感知不到**
>
> 我有个 Agent ，用得很顺手，虽然偶尔也犯蠢。
>
> 上周我给家人也搭了个Agent，底座模型一样，但时间关系，我很多个性化配置 …没来得及配给它。
>
> 家人用了几天这个新Agent，跟我说，"效果非常不错"，"帮了我大忙了！"。
>
> 起初我觉得意料之中，毕竟，用的是很强的模型，必不会差。
>
> 直到前几天，我因为一些原因把两个Agent拉到同一个群里，我才发现新Agent笨得不行。
>
> 具体怎么笨就不说了，关键在于，为什么我觉得新Agent很笨，但我家里人不觉得？
>
> 原因很简单：没用过聪明的，你就区分不出笨的。
>
> 今天，AI驱动的Agent的那种"笨"你已经很难察觉。它回答可以很流畅，逻辑很通顺，能完成你指定的很多任务。
>
> 笨的Agent弱在哪里？ 弱在它的思维深度、指令遵循能力、元认知、工具选择和使用、关键任务技巧…
>
> 问题是，这是些很难清晰看见和准确评估的特质，它们真实存在，影响Agent表现，但往往只给你一种模糊的"不踏实的感觉"而不是非黑即白的"笨"。
>
> 偏偏Agent 还有个通病，一个任务它做不出来，它会给你一个听起来非常合理的解释。
>
> 除非你能对比，否则你很难知道做不出来到底是客观上不行，还是Agent能力有问题。
>
> 这件事让我很警觉，因为这种"不知道"其实是很吓人，它等于在说：你自以为跟别人在同一起跑线，但保不齐你俩完全不在一个level。
>
> 再强调一遍：在我这个例子里，两个Agent背后的大模型是一样的。所以，这个差距是可以跟大模型无关的！
>
> 不知道自己是领先还是落后，这对领先者和落后者都是问题。你用60 分的 agent，你不会知道别人95 分的 agent 是什么体验。反过来也一样。
>
> 更为要命的是，随着Agent正在成为我们的助手，Agent之间的差距最终会成为人和人之间的差距。
>
> 一开始，Agent之间的差距尽管显著，但你偏偏就是感知不到，而当你能感知到时，已经晚了，它已经变成你和对方人之间的差距。
>
> 这让我想起了一句话：你的超常发挥，也许不过是别人的吃饭饮水。
>
> 不过我写这个不是让你焦虑，首先，也许你的Agent很强，只是强得你不知道呢？
>
> 其次，这里面有机会，且不止一个：
>
> 第一个，███…。
> 我觉得最大的机会是第二个，███…。【"关键一句话"已加密，限会员解锁】
>
> （MindCode日刊）
>
> a）【重要】最大的风险：别人的Agent很强,但你感知不到
>
> i，没用过聪明的，你就区分不出笨的。今天，AI驱动的Agent的那种"笨"，你已经很难察觉。
>
> 它的回答可以很流畅，逻辑很通顺，能完成你指定的很多任务。
> 笨的Agent弱在哪里？ 弱在它的思维深度、指令遵循能力、元认知、工具选择和使用、关键任务技巧……问题是，这是些很难清晰看见、准确评估的特质。
> 偏偏Agent 还有个通病：一个任务它做不出来，会给你一个听起来非常合理的解释。
> 所以，除非你自己能对比，否则你很难知道，做不出来，到底是客观上不行，还是Agent能力有问题。
>
> ii，这件事让我很警觉，因为这种"不知道"其实是很吓人，它等于在说：你自以为跟别人在同一起跑线，但保不齐你俩完全不在一个level。
>
> 不知道自己是领先还是落后，这对领先者和落后者，都是问题。
> 你用60 分的 agent，你不会知道别人95 分的 agent 是什么体验。反过来也一样。
>
> 黄钊hanniman评注：Anthropic内部，那么多顶级聪明、价值观还正的人，用领先外部6～18个月的模型，还有最AI- native的组织文化和协作模式——外部跟Anthropic的差距，细思极恐。

---

### 2.3 Fork 5：Agent感知差距

#### Claude 分类判断

> 这是一篇**观点+框架型**文章——核心是"Agent感知差距"这个诊断框架。对你的Planner工作高度相关：你怎么知道你的SP是60分还是95分？我会生成 source + concept + tool，开始了。

#### Claude 创建 source.md

创建了 `forks/2026-05-27-agent-perception-gap/source.md`：

**7段逐段拆解：**

1. **亲身经历——"同一个模型，两种体验"**
   - 功能：叙事钩子
   - 深度分析：受控实验设计——同底座、不同配置、不同使用者。A/B对比才能暴露差距。
   - 隐含假设：配置差距在对比时一眼可见
   - Planner关联：把"两个Agent"替换成"两版SP"，车主就是"家人"

2. **核心命题——"没用过聪明的，就区分不出笨的"**
   - 功能：提炼核心诊断
   - 深度分析：人类用"见过的最好的"作为上限，而非"理论上最好的"
   - Planner关联：你有"理想Planner行为"的定义吗？

3. **"笨"的不可见性——五个维度**
   - 功能：分析框架
   - 五维度：思维深度、指令遵循、元认知、工具选择、关键任务技巧
   - 关键洞察：差距不表现为"答错了"，而是"答得说得过去但不够精彩"

4. **"合理解释"通病**
   - 功能：加深问题严重性
   - Agent"做不到"时不崩溃，给"合理解释"——优雅失败比崩溃失败更危险

5. **60分vs95分——感知不到的恐惧**
   - 功能：情感升级
   - 核心不等式：感知到的差距 ≪ 实际差距

6. **Agent差距→人的差距**
   - 功能：后果推演
   - 传导链：Agent质量差距→输出差距→产出差距→竞争力差距

7. **Hanniman评注——Anthropic的隐形领先**
   - 功能：外部验证
   - 三重叠加：模型+人才+文化

**论证链**："同模型不同配置→差距" → "没用过聪明的区分不出笨的" → "五维度不可见" → "合理解释更难发现" → "你以为同起跑线" → "Agent差距→人的差距" → "Anthropic领先你感知不到"

**跨fork网络关系表**：6条连接到前5篇fork

#### Claude 创建 concept.md

标题：**Planner感知差距诊断——你的SP是60分还是95分？**

内容结构：
1. **核心问题**：文章角色→你的场景精确映射表（6行）
2. **"笨"的五维度→Planner评估指标**：每个维度含60分vs95分对照表和"怎么测"
   - 维度1：思维深度→多步规划质量（4种case类型）
   - 维度2：指令遵循→SP规则执行一致性（诊断方法：20case看遵循率）
   - 维度3：元认知→"知道自己不确定"（3种场景）
   - 维度4：工具选择→23个工具调用精确度（量化方法）
   - 维度5：关键任务技巧→安全/情感/长对话（6种case）
3. **"合理解释"识别方法**：4种Planner优雅失败表现+排查Prompt模板
4. **三种对比基准**：
   - 基准1：内部纵向（历史版本/badcase趋势/覆盖率）
   - 基准2：外部横向（竞品/同行/公开评测）
   - 基准3：理论上限（定义"完美回答"→差距分析→理想SP反推）— 最重要
5. **月度SP健康度体检SOP**（6步4小时）：准备评测集→跑SP→打分→排查优雅失败→差距分析→定优化方向
6. **六篇Fork综合公式**：PM价值 = SP编程能力（前5篇）× 差距感知能力（本篇）
7. **判断标准**：有差距感知能力的5个信号 vs 感知不到差距的5个信号

#### Claude 创建 tool.html

创建了 `forks/2026-05-27-agent-perception-gap/tool.html`（41KB）：

- 7个模块（M0-M6）
- 6个 inline SVG 图：
  - 图0：全局地图——从"感知不到差距"到"量化诊断"三步路径（含分数光谱）
  - 图1：文章场景→你的场景精确映射（双栏对比）
  - 图2：Agent质量五维雷达图（五边形三环 = 60/80/95分）
  - 图3：三种失败模式对比（崩溃/明显做错/优雅失败★）
  - 图4：三种对比基准（纵向×横向×理论上限）
  - 图5：月度体检6步流程图+评分模板
  - 图6：六篇fork完整公式（两个支柱：能力建设×差距诊断）
- 1个可复制 Prompt 模板（排查"优雅失败"）
- 2个 Quiz（SP打分自测 + 优雅失败判断题）
- 分数条可视化（0-60/60-75/75-85/85-95/95+）
- "理想Planner输出"填写表格（5个场景）

#### Claude 创建 metadata.json

```json
{
  "article_title": "最大的风险：别人的Agent很强，但你感知不到",
  "fork_date": "2026-05-27",
  "fork_time": "2026-05-27 11:00",
  "article_type": "观点+框架",
  "category": "框架",
  "tags": ["感知差距", "Agent质量评估", "五维度", "优雅失败", "对比基准", "SP体检"],
  "fork_outputs": ["source", "concept", "tool"],
  "feishu": {
    "source_doc_id": "ZTpudrONxoh94ixlmvVcBltFnBd",
    "source_url": "https://www.feishu.cn/wiki/XxFZwdbxaiRM7gkOACMcbElFnFb",
    "concept_doc_id": "A0pHdUIcPoVpkoxs9sacoBQBneb",
    "concept_url": "https://www.feishu.cn/wiki/YF25wtd0GiuqAlkTnhXc8mqTnXg"
  }
}
```

#### Claude 更新 INDEX.md

在 `forks/INDEX.md` 顶部追加：

```
| 2026-05-27 | 最大的风险：别人的Agent很强，但你感知不到 | 框架 | source, concept, tool | [2026-05-27-agent-perception-gap](2026-05-27-agent-perception-gap/) | [Source](https://www.feishu.cn/wiki/XxFZwdbxaiRM7gkOACMcbElFnFb) · [Concept](https://www.feishu.cn/wiki/YF25wtd0GiuqAlkTnhXc8mqTnXg) |
```

#### Claude 上传到飞书

1. **Source 页面**：
   - doc_id: `ZTpudrONxoh94ixlmvVcBltFnBd`
   - url: `https://www.feishu.cn/wiki/XxFZwdbxaiRM7gkOACMcbElFnFb`
   - 内容分2次（create + append逐段拆解）

2. **Concept 页面**：
   - doc_id: `A0pHdUIcPoVpkoxs9sacoBQBneb`
   - url: `https://www.feishu.cn/wiki/YF25wtd0GiuqAlkTnhXc8mqTnXg`
   - 内容分2次（create + append）

3. **LOG 更新**：追加 ingest 记录

#### Claude 输出总结

```
Fork 完成！生成了以下内容：

本地文件（forks/2026-05-27-agent-perception-gap/）：
- source.md — 7段逐段拆解，每段含深度分析+隐含假设+与Planner直接关联+跨六篇fork网络关系表
- concept.md — "Planner感知差距诊断"教程：五维度评估框架、"优雅失败"诊断、三种对比基准、月度SP体检SOP
- tool.html — 7模块可视化教程（6个SVG图），2个Quiz，1个Prompt模板，"理想Planner输出"填写表格
- metadata.json — 含飞书链接

飞书知识库：
- Source: https://www.feishu.cn/wiki/XxFZwdbxaiRM7gkOACMcbElFnFb
- Concept: https://www.feishu.cn/wiki/YF25wtd0GiuqAlkTnhXc8mqTnXg

本篇补上的关键缺口：前五篇教你"怎么让SP变好"（能力建设），
本篇教你"怎么知道SP够不够好"（差距诊断）。
完整公式：你的PM价值 = SP编程能力 × 差距感知能力。
```

---

## 三、当前 INDEX.md 完整状态（截至本次会话结束）

| 日期 | 文章标题 | 分类 | 产物 | 本地路径 | 飞书链接 |
|------|----------|------|------|----------|----------|
| 2026-05-27 | 最大的风险：别人的Agent很强，但你感知不到 | 框架 | source, concept, tool | 2026-05-27-agent-perception-gap/ | [Source](https://www.feishu.cn/wiki/XxFZwdbxaiRM7gkOACMcbElFnFb) · [Concept](https://www.feishu.cn/wiki/YF25wtd0GiuqAlkTnhXc8mqTnXg) |
| 2026-05-27 | 王建硕：Markdown 是新时代的编程语言 | 框架 | source, concept, tool | 2026-05-27-markdown-is-programming/ | [Source](https://www.feishu.cn/wiki/WtB5wBYHsiiTyCkaORVcDgcFnpd) · [Concept](https://www.feishu.cn/wiki/Q1zTwZaGwiuslOkZPtycyYUfnQH) |
| 2026-05-26 | 不会用AI的产品经理，开始被清洗了 | 观点 | source, concept, tool | 2026-05-26-pm-ai-cleanup/ | [Source](https://www.feishu.cn/wiki/R5mgwZDnLiSsyfkgII0cBAI7nTe) · [Concept](https://www.feishu.cn/wiki/BDv2wuc1pinOh8kO3e2c9RBLnTq) |
| 2026-05-26 | PM和设计师即将赢下AI时代（Dan Shipper） | 访谈 | source, concept, tool | 2026-05-26-pm-designer-ai-era/ | [Source](https://www.feishu.cn/wiki/AUbNwXAOqi37qOkwlpCctUv9nQc) · [Concept](https://www.feishu.cn/wiki/GThBwNjJAiXE1fkWsAxcKH0ZncN) |
| 2026-05-25 | AGI时代产品战略判断框架（李广密+Hassabis） | 访谈 | source×2, concept, tool | 2026-05-25-agi-roadmap/ | Source1 · Source2 · Concept |
| 2026-05-21 | 双原生架构（Dual-Native Architecture） | 框架 | source, concept, tool | 2026-05-21-dual-native-arch/ | Source · Concept |
| 2026-05-20 | AI时代还要读书么？ | 框架+观点 | source, concept, tool | 2026-05-20-ai-reading/ | Source · Concept |

---

## 四、飞书文档 ID 汇总

| Fork | Source doc_id | Concept doc_id |
|------|--------------|----------------|
| 2026-05-27 Agent感知差距 | ZTpudrONxoh94ixlmvVcBltFnBd | A0pHdUIcPoVpkoxs9sacoBQBneb |
| 2026-05-27 Markdown即编程 | WnQFdVuKtodqGoxUyJ0clpLan3d | RLxWdE9kfoBQpNxcOMNcWfBwnJe |
| 2026-05-26 PM清洗 | ToEkdczg0onLQKxvlYpcidUZn3f | D92KdDjQEoSzUbxJV7pcn8dcnBe |
| 2026-05-26 Dan Shipper | UdqqdMvxRoCutvxIJ10cHsG6nhc | E6n5dhCAwo4FY0xqObEcIVjAngg |
| 2026-05-25 AGI路线图 | X56Zd0XF7oWIkNxOiUQcNsD2n9d / GyLDdEPv2o3seyxAn6ZcgLfCn9p | Wt0jdFPVNocMVSxjUBicNGNAnab |

Wiki 基础设施：
- space_id: `7630463641124342714`
- INDEX doc_id: `K5ujdRblCoSzFWx4eGzcjKUTnWb`
- LOG doc_id: `GfGZd0zD8ojXUNxfy59cAJ1en3c`
- raw/articles node: `K6XUwFE9miGZ5PkhXvgcX6XwnNf`
- wiki/sources node: `ZwZZwv089iMuhCku9qwcCJgfn7c`
- wiki/concepts node: `OawKwNIAhiUR3skninDcTFnCnKc`

---

## 五、六篇Fork的知识网络（跨fork连接）

```
AGI路线图(战略层)
├── AlphaFold三条件 → Planner评估
├── 壁垒窗口0.5-1年 → 场景know-how不可替代
└── Coding是环境 → .md是人操作AI的接口
    │
    ├── Dan Shipper(认知层)
    │   ├── PM核心价值=判断力
    │   ├── 养Agent SOP(日/周/Sprint/月)
    │   └── Reach Test → 对比基准雏形
    │       │
    │       ├── PM清洗篇(方法层)
    │       │   ├── L0-L3分层定位
    │       │   ├── 上下文四分法 → SP质量维度
    │       │   └── 三件套(工具+上下文+Skill)
    │       │       │
    │       │       ├── Markdown即编程(执行层)
    │       │       │   ├── SP=源代码
    │       │       │   ├── 4个行为转变(commit/测试/review/重构)
    │       │       │   ├── 手写量=控制颗粒度
    │       │       │   └── 聊天vs编程
    │       │       │       │
    │       │       │       └── Agent感知差距(诊断层) ← 本次新增
    │       │       │           ├── 五维度评估框架
    │       │       │           ├── 优雅失败诊断
    │       │       │           ├── 三种对比基准
    │       │       │           └── 月度SP体检SOP
    │       │       │
    │       │       └── 完整公式：PM价值 = SP编程能力 × 差距感知能力
```

---

*文档生成时间：2026-05-27*
*生成方式：Claude Code 终端会话上下文整理*
