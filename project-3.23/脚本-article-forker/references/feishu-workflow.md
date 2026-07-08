# Feishu Workflow Notes

Use this only for the full article-forker knowledge-base workflow.

## Known Infrastructure

- wiki space_id: `7630463641124342714`
- INDEX doc_id: `K5ujdRblCoSzFWx4eGzcjKUTnWb`
- LOG doc_id: `GfGZd0zD8ojXUNxfy59cAJ1en3c`
- raw/articles node: `K6XUwFE9miGZ5PkhXvgcX6XwnNf`
- wiki/sources node: `ZwZZwv089iMuhCku9qwcCJgfn7c`
- wiki/concepts node: `OawKwNIAhiUR3skninDcTFnCnKc`

## Gotchas

- `lark-cli` may not accept absolute file paths. `cd` into the directory and pass relative paths.
- `--wiki-space` and `--wiki-node` are mutually exclusive in observed usage.
- Do not report upload complete until the primary doc id, wiki URL, and HTML insertion status are captured in `metadata.json`.
- If listing wiki content, check pagination fields such as `has_more`, `page_size`, and `page_token`.

## Upload Shape

Default: create **one primary Feishu document**. Do not create separate Source and Concept pages unless the user explicitly asks for archival separation.

Conflict rule: old prompts may still mention "Concept 文档", `source_doc_id`, `concept_doc_id`, or "Source + Concept". Ignore those stale fields unless the user explicitly asks to create two Feishu documents. The default and preferred workflow is one primary document with `primary_doc_id` / `primary_url`.

1. Create one primary fork document under the appropriate wiki node, usually wiki/concepts for reusable knowledge assets.
2. The document must begin with a top placeholder section:

```markdown
# <Fork title>

## 交互工具 / HTML 教程

> HTML 工具正在插入为飞书附件。插入完成后，点击下方文件卡片即可使用。

## 一句话结论

...

## 原文深度拆解

...

## 可复用方法论 / 教程

...
```

3. Insert `tool.html` at the top of this primary document, directly after the `## 交互工具 / HTML 教程` marker.
4. Put the complete article deep-read content and the reusable tutorial content below the tool section in the same document.
5. Append LOG entry.
6. Update local `forks/INDEX.md`.
7. Update `metadata.json` with primary doc id, URL, and HTML insertion status.

## Single Document Content Standard

The primary Feishu document should contain all work in one place:

1. `## 交互工具 / HTML 教程`: inserted `tool.html` file block.
2. `## 一句话结论`: high-density thesis and misread warning.
3. `## 原文深度拆解`: full `source.md` quality analysis, not a short summary.
4. `## 可复用方法论 / 教程`: full `concept.md` tutorial, including mapping to the user's Planner/SP/Agent context when verified or clearly inferred.
5. `## 操作 SOP`: step-by-step workflow with inputs, outputs, examples, and failure modes.
6. `## Prompt 模板 / Checklist / Rubric`: copyable assets.
7. `## 行动清单 / 判断标准`: what to do this week and how to know it worked.

The user should not need to open a second Feishu page to understand or use the fork.

## HTML Tool Insertion

The user wants the Feishu document itself to be the working surface. The top of the primary Feishu document must contain the generated HTML tutorial/tool as a Feishu file block.

Use `+media-insert` after the primary Feishu document exists:

```bash
cd "<fork-dir>"
lark-cli docs +media-insert --as user \
  --doc "<PRIMARY_DOC_ID_OR_URL>" \
  --type file \
  --file "tool.html" \
  --file-view card \
  --selection-with-ellipsis "## 交互工具 / HTML 教程"
```

If the insertion lands at the end, use a more specific selection or insert the HTML before the next section:

```bash
cd "<fork-dir>"
lark-cli docs +media-insert --as user \
  --doc "<PRIMARY_DOC_ID_OR_URL>" \
  --type file \
  --file "tool.html" \
  --file-view card \
  --selection-with-ellipsis "HTML 工具正在插入为飞书附件"
```

If `--file-view preview` works for HTML in the current Feishu tenant, prefer it; otherwise use `card`. Do not assume arbitrary HTML/JS executes inline inside the document. The acceptance bar is: the HTML file is attached/inserted at the top and can be clicked from the Feishu document.

Record this in `metadata.json`:

```json
"feishu": {
  "primary_doc_id": "...",
  "primary_url": "...",
  "tool_inserted": true,
  "tool_insert_method": "docs +media-insert --type file --file-view card"
}
```

If insertion fails:

- Do not say the workflow is complete.
- Keep the local `tool.html`.
- Report the exact command and error.
- Retry with `--file-view card` if `preview` or `inline` fails.
