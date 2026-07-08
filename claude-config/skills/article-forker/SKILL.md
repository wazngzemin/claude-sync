---
name: article-forker
description: Use when the user wants to fork, deep-read, reverse-engineer, or turn an article, essay, transcript, podcast, thread, URL, or long text into reusable knowledge assets, Planner/SP/Agent methodology, source/concept/tool outputs, Feishu wiki pages, or an interactive HTML tutorial. Triggers include /forkit, /fork, article-forker, fork this article, 深度拆解文章, 文章 fork, 做成 source/concept/tool, 上传飞书知识库.
trigger: /forkit
---

# /forkit Article Forker

把文章 fork 成可运行的知识资产：深度阅读 -> 提取方法论 -> 生成 `source.md` / `concept.md` / `tool.html` -> 合并为一个飞书可用文档 -> 必要时上传飞书知识库。

Do not summarize. Treat the article as source code: reverse-engineer its argument structure, extract reusable operating models, adapt them to the user's Planner/SP/Agent work when relevant, and produce artifacts that can be used, tested, and re-run.

## Usage

```text
/forkit                  # 用户随后粘贴文章内容
/forkit <url>            # 从 URL 抓取文章再 fork
/forkit <file-path>      # 从本地文件读取
/forkit --tool-only      # 只生成工具
/forkit --tutorial-only  # 只生成教程/概念页
/forkit --no-wiki        # 不存入飞书知识库，只输出到本地
```

`/fork` is an alias when the user clearly means article-forker.

## Progressive Loading

Load only what the task needs:

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

## Validation

Before final response:

```bash
python3 scripts/validate_fork.py forks/<fork-dir>
```

If validation fails, fix the artifact unless the failure is intentionally out of scope and explain why.

Final response should report local paths, Feishu links if created, validation result, and the core reusable concept extracted from the article.
