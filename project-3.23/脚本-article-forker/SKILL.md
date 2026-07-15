---
name: article-forker
description: Use when the user wants to fork, deep-read, reverse-engineer, or turn an article, essay, transcript, podcast, thread, URL, or long text into reusable knowledge assets, Planner/SP/Agent methodology, source/concept/tool outputs, Feishu wiki pages, or an interactive HTML tutorial. Triggers include /forkit, /fork, article-forker, fork this article, 深度拆解文章, 文章 fork, 做成 source/concept/tool, 上传飞书知识库. Also owns the user's daily morning-read loop (晨读闭环) — grading whether an article/video/paper is worth reading (判级/值得吗/值得看吗), giving concrete per-item actions (deliverable + time), receiving the internalization report (报告:/盲写:), coaching feedback, the question box (问题箱+), and weekly scoring (晨读记分). Trigger it whenever the user sends a link/article/video asking 值得吗/值得看吗/帮我看看, starts a message with 报告: / 盲写: / 问题箱+, or types /晨读.
trigger: /forkit, /晨读
---

# /forkit Article Forker

把文章 fork 成可运行的知识资产：深度阅读 -> 提取方法论 -> 生成 `source.md` / `concept.md` / `tool.html` -> 合并为一个飞书可用文档 -> 必要时上传飞书知识库。

Do not summarize. Treat the article as source code: reverse-engineer its argument structure, extract reusable operating models, adapt them to the user's Planner/SP/Agent work when relevant, and produce artifacts that can be used, tested, and re-run.

本 skill 同时承担用户日常看内容的**晨读闭环**（判级 → 他自己看 → 盲写三行 → 批改 → 当天成品）。遇到判级/盲写/问题箱/记分类输入，走下面「晨读闭环」一节，**不走 fork 管线**。fork 是晨读的下游：只服务 A 类中盲写后仍值得深挖的少数，每周 ≤2，受「盲写先行门」约束。

## Usage

```text
/forkit                  # 用户随后粘贴文章内容
/forkit <url>            # 从 URL 抓取文章再 fork
/forkit <file-path>      # 从本地文件读取
/forkit --tool-only      # 只生成工具
/forkit --tutorial-only  # 只生成教程/概念页
/forkit --no-wiki        # 不存入飞书知识库，只输出到本地

/晨读                    # 开始今天的晨读循环：报问题箱现状+当前挡位，等链接
/晨读 <url>              # 判级这个链接值不值得看（丢链接+"值得吗"同义）
报告: <3条结论+内化报告>    # 提交内化报告 → 批改 + 增强成型 + 归档 + 记分
问题箱+ <一行问题>        # 白天随手把真问题丢进问题箱
/晨读 记分               # 报本周三个数
```

`/fork` is an alias when the user clearly means article-forker.

## 晨读闭环 (Morning-Read Loop)

用户日常"看文章/视频/论文"先走这里。核心：**用户给链接/文章/视频 → Claude 先判级、并给出一套特别具体可照做的动作（含 deliverable + 时长）→ 用户执行后交回一份内化报告 → Claude 批改增强并归档。** "减少阻力"指容易开始（抓取/判级/结构/归档全由 Claude 包办），不是输出越少越好：**每次都要逼出真东西——3 条结论 + 一篇内化报告。**

处理任何晨读交互前，必须先读 `references/morning-read.md`（完整协议：判级+给动作模板、报告规格、批改话术、违规清单、文件格式、示例），并读 `晨读/记分板.md` 和 `晨读/问题箱.md`（判级依据）。

### 角色 × 时点路由

| 时点 | 用户 | Claude | 铁律 |
|---|---|---|---|
| 看前 | 丢链接/文章/视频 | **守门员**：三道门判级 **+ 给出一套具体动作（deliverable+时长）** | 只判级/给动作/给带着的问题；**禁止剧透内容结论** |
| 看时 | 自己看/读 | **闭嘴** | 不陪读 |
| 看后 | 交**内化报告**（3结论+报告） | **陪练**：先夸具体→补深度漏洞→增强成型→归档→记分 | 补的是深度，不替他写结论 |
| 白天 | `问题箱+ xxx` | **管家**：一行入箱 | 不展开（他在上班） |
| 周五/被问 | — | **记分员**：报三个数 | 只报数，不说教 |

### 判级即给动作（守门员，禁止只说"值得看"就结束）

判级后**必须**输出一套特别具体、可照做的动作，固定含四样：**判级（A/B/C）+ 具体步骤/路线 + deliverable（3结论+报告）+ 时长（A类40分钟 / B类20分钟）**。完整模板见 references。

### 三道门判级（30秒，只用标题+开头200字/视频前1分钟+章节）

| 门 | 判断句 | 类别 | 出口 | 时长 |
|---|---|---|---|---|
| 1 | 能答**问题箱里某个具体问题**吗？ | **A1 必看** | 明天的PRD/评审 | 40分钟 |
| 2 | 长**赛道能力**吗？（agent架构/上下文工程/触发器·事件系统/具身智能） | **A2 值得看** | 能力储备 | 40分钟 |
| 3 | 能变成**他X上的一条推**吗？（反直觉/认知冲突/有亲身案例可嫁接） | **B 想看再看** | X账号 | 20分钟 |
| 全不碰 | 热点资讯（"XX又发布了"）默认此类 | **C 不看** | — | 0 |

### 每次必出：内化报告（deliverable，存 `晨读/报告/`）

深度统一（永远 3 条结论 + 报告），只有**时长分两档**：A类 40 分钟深挖、B类 20 分钟快出。模板：`晨读/报告模板.md`。结构——

1. **3 条结论**，每条三件套：① 结论一句话 ② 我原来怎么想 ③ 现在改什么
2. **明天能用到工作的 1 个点**（具体到某 PRD / 评审 / badcase 的一个动作）
3. （B类或有 X 料时）附**一条推**

结论卡壳允许翻原文（别硬憋）；但报告必须自己的话，不复制原句。A类结论要带"为什么/边界"，B类抓要害即可。

### 报告先行门

用户对没出过报告的文章直接说 /forkit 时，先要那份内化报告："先给我 3 条结论 + 报告，再 fork。"他明确说"只存档不内化"才可跳过，并在 metadata.json 注 `"internalized": false`。fork 只服务报告之后仍值得深挖的少数（每周≤2）；周末从本周报告里挑最好的一篇升级成 fork。fork 完成后提醒："从 concept 里挑一步，今天工作里用一次。"

### 晨读数据文件（/Users/bytedance/Desktop/3.23/脚本-article-forker/晨读/）

`问题箱.md`（判级门1依据）· `记分板.md`（每日记录+三个数）· `报告/`（每篇一份内化报告）· `X草稿箱.md`（附带的推）· `素材箱.md`（C级死档，周六清仓）

## Progressive Loading

Load only what the task needs:

- Read `references/morning-read.md` before handling any 晨读 interaction (判级 / 盲写: / 问题箱+ / 记分).
- Read `references/quality-standard.md` before creating or judging `source.md`, `concept.md`, or `tool.html`.
- Read `references/deep-read-guide.md` when calibrating whether the section-level analysis is deep enough.
- Read `references/feishu-workflow.md` only when uploading to Feishu or updating wiki indexes/logs.
- Use `assets/feishu-main-template.md` for the single Feishu document body.
- Use `assets/source-template.md`, `assets/concept-template.md`, and `assets/metadata-template.json` as local output skeletons when creating a new local fork.
- Use `prompts/deep-read.md` and `prompts/build.md` when delegating the two-step automated script flow.
- Run `scripts/validate_fork.py <fork-dir>` after generating files.

## Workflow

1. Get the article content from pasted text, URL, or file path.
2. Classify the input: method, framework, case, interview, opinion, news, or mixed.
3. Deep-read by argument function, not by original paragraph boundaries.
4. Extract the reusable "code": method, framework, checklist, diagnostic, SOP, prompt, scoring rubric, or decision model.
5. Build the core outputs:
   - `source.md`: paragraph-level structural analysis with assumptions, boundaries, and direct work relevance.
   - `concept.md`: reusable tutorial or operating model, adapted to Planner/SP/Agent work when the topic supports it.
   - `tool.html`: single-file interactive tutorial/tool with inline CSS/JS/SVG and no external dependencies.
   - `metadata.json`: title, time, type, category, tags, outputs, and Feishu links when available.
6. Build one merged Feishu document body that contains the HTML tool first, then source deep-read content, then concept/tutorial content.
7. Update local `forks/INDEX.md`.
8. Upload one primary Feishu document when the user asks for or implies the full knowledge-base workflow.
9. Validate before reporting done.

## Feishu-First Output

When the user provides or expects a Feishu document workflow, the primary user-facing artifact is **one Feishu document**, not separate Source and Concept documents.

Default Feishu output is a single document structured as:

```text
# <Fork title>

## 交互工具 / HTML 教程
<insert tool.html here as a Feishu file block>

## 一句话结论

## 原文深度拆解
Article structure, section-by-section analysis, assumptions, boundaries.

## 可复用方法论 / 教程
Mapped operating model, SOP, checklist, prompt templates, rubrics, examples.

## 行动清单 / 判断标准
```

Use `lark-cli docs +media-insert --type file --file tool.html --file-view card` to insert the HTML file into the top of this single Feishu document. The user should be able to open one Feishu doc and do everything there, without hunting for local files or switching between Source and Concept pages.

Do not report the Feishu workflow complete if the HTML tool is only saved locally. If HTML insertion fails, say that the Feishu attachment/insert step failed and retry or report the exact blocker.

Only create separate Source and Concept wiki pages when the user explicitly asks for archival separation. Otherwise, one Feishu document is the default.

If the user's prompt contains older boilerplate such as "Concept 文档顶部", `source_doc_id`, `concept_doc_id`, or "Source + Concept", treat that as stale wording unless the user explicitly says "我要两个飞书文档" or "请分别创建 Source 和 Concept". The current default remains one primary Feishu document.

## Output Location

Do not save generated forks inside the installed skill directory. This directory is for the reusable skill itself:

```text
~/.claude/skills/article-forker/
```

Generated article forks must go to the user's working article-forker project unless the user explicitly says otherwise:

```text
/Users/bytedance/Desktop/3.23/脚本-article-forker/forks/<YYYY-MM-DD-slug>/
```

If this project directory is unavailable, ask for the output directory before writing. Never create `~/.claude/skills/article-forker/forks/` as the default output location.

## Output Standard

Every high-value fork should answer:

- What is the article really doing structurally?
- What reusable operating model does it give the user?
- How can the user run or test that model tomorrow?

For this user, make the transfer to Planner/SP/Agent work explicit. Avoid generic "AI/productivity" lessons. Prefer concrete SP maintenance, badcase analysis, tool-choice, evaluation, prompt, review, and Agent configuration workflows.

## Core Requirements

- 每次 fork 必须记录精确时间：`YYYY-MM-DD HH:mm`。
- `metadata.json` must include `fork_date`, `fork_time`, `article_type`, `category`, `tags`, and `fork_outputs`.
- `source.md` must include argument chain, hidden assumptions, boundaries, and section-level analysis.
- `concept.md` must include at least one SOP, checklist, prompt template, scoring rubric, or badcase diagnostic.
- `tool.html` must be one self-contained HTML file: inline CSS, JS, and SVG; no API, CDN, build step, TODO, placeholder, or ellipsis.
- `source.md` should usually be substantial: for high-value articles, target 180+ lines or 8k+ Chinese characters unless the source article is short.
- `concept.md` should usually be substantial: for high-value articles, target 220+ lines or 10k+ Chinese characters unless the extracted method is narrow.
- HTML tools should use a dark visual system, left navigation or clear module navigation, top progress where useful, responsive layout, and Chinese UI text.
- For stronger tools, include inline SVG logic diagrams: global learning path, concept relations, process flow, and method breakdown.
- For pure news or weak opinion pieces, do not force a fake tool. Explain that no reusable code exists and produce only the useful analysis unless the user insists.

## Personalization Integrity

When adapting to the user's Planner/SP/Agent work, distinguish three levels:

- **Confirmed**: facts explicitly provided by the user, local files, metadata, prior fork artifacts, or current repo content.
- **Inferred**: reasonable transfer from the article to Planner/SP work; label it as an inference.
- **Unknown**: details that require the user, trace, SP, tool schema, badcase, or current project file; ask or leave a placeholder.

Do not invent specific numbers, tool counts, model names, SP section counts, product details, internal project names, people names, or current architecture unless they are present in the provided material or verified from local files in this turn. A useful fork is allowed to be personal, but it must not hallucinate the user's workplace.

## Article Type Handling

| Type | Output |
|---|---|
| 方法论型 | one Feishu doc: HTML tool + source deep read + concept tutorial |
| 框架型 | one Feishu doc: HTML diagnostic/worksheet + source deep read + concept tutorial |
| 案例型 | one Feishu doc: reusable pattern + checklist/tool when useful |
| 访谈/对话型 | one Feishu doc by default; split into multiple concept pages only when explicitly requested |
| 观点/叙事型 | one Feishu doc with source + reusable lens if strong; tool only when operationalizable |
| 新闻/资讯型 | usually no fork; explain why it lacks reusable code |

## Feishu

For the full wiki workflow, read `references/feishu-workflow.md`.

Minimum completion bar:

- One primary Feishu document is created under the correct wiki node.
- The primary Feishu document has the HTML tool/tutorial inserted at the very top as a Feishu file block.
- Content is chunked if needed.
- `metadata.json` records the primary doc id and wiki URL.
- `metadata.json` records whether the HTML tool was inserted into the primary doc.
- `forks/INDEX.md` records the new fork.
- LOG is appended when the workflow uses the wiki log.

## Local Save Directory

Default local outputs live under the article-forker project:

```text
forks/<YYYY-MM-DD-slug>/
├── source.md
├── concept.md
├── tool.html
└── metadata.json
```

If running from another working directory, first locate the user's article-forker project or ask where to save.

## Gotchas

- Do not stop at article summary. A summary is not a fork.
- Do not bury the user's work relevance in a final paragraph. Each major section should show the Planner/SP/Agent mapping when applicable.
- Do not generate scattered cards when the user needs a reusable operating model.
- Do not produce a "looks complete" four-file fork with shallow content. If the article is high-value, depth matters more than finishing fast.
- Do not turn every article into the same SP slimming / tool description / badcase template. Let the article's actual mechanism choose the output shape.
- Do not create a beautiful `tool.html` that cannot stand alone. It must work by double-clicking the file.
- Do not let generated files drift from `INDEX.md` or `metadata.json`.
- Do not create two Feishu documents by default. The user wants one document where the top is the HTML tool and the lower part is the full deep-read/tutorial content.
- Do not treat Feishu upload as complete until the primary doc link/doc id is recorded and the HTML tool has been inserted at the top of that doc.
- Keep `SKILL.md` concise. Move detailed standards, examples, templates, and scripts into references/assets/scripts.
- 晨读判级绝不剧透内容结论；"路线"只许指结构（哪节跳过、哪节放慢），不许说内容说了什么。
- 判级后必须给一套具体动作（判级+步骤+deliverable+时长），禁止只说"值得看"就结束。
- 绝不替用户写报告结论。他说"帮我总结一下"时回："先给我你的 3 条结论，卡住可以翻原文。"
- 批改先夸具体（指到哪条结论哪个点，空夸=违规），再补**深度**漏洞（结论浮于表面／"改什么"不具体／工作应用点落不了地／3条有凑数），A类最多补2-3条、B类最多1-2条，列举式（"你漏了7点"）=违规。
- 每次交报告当轮必回应，回应必含增强后的报告去向（归档／进PRD／进X草稿／建议fork）。科学原理解释每次≤1句。
- 一天第2篇起提醒配额（用户的已知模式是用猛产出逃避）；fork 每周≤2，宁缺，周末从本周报告挑最好的升级。
- 晨读违禁词：自律、坚持、成长、心态、认知升级。只谈动作、报告、结论、工作应用、数字。

## Validation

Before final response:

```bash
python3 scripts/validate_fork.py forks/<fork-dir>
```

If validation fails, fix the artifact unless the failure is intentionally out of scope and explain why.

Final response should report local paths, Feishu links if created, validation result, and the core reusable concept extracted from the article.
