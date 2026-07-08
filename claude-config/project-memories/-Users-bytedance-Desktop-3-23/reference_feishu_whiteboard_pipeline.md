---
name: reference_feishu_whiteboard_pipeline
description: 把 HTML/SVG 流程图做成飞书文档 + 可编辑飞书画板的完整管线与踩坑（lark-cli + whiteboard-cli）
metadata: 
  node_type: memory
  type: reference
  originSessionId: 54f8aed9-f3d3-4731-bc66-34f82ab2d8c4
---

用 `beautiful-feishu-whiteboard` skill + lark-cli 把 PRD（正文+流程图）落成飞书文档、图用「飞书画板」形式（可编辑，非截图）的完整管线。2026-07-05 首次跑通，产物 PRD v6 六张画板飞书文档。

**飞书画板 = 只认原生形状的画布（硬约束，来自 skill 的 RULES.md，实测为准）**：
- `<polygon>` 菱形 / 曲线 `<path>` → 会被压成模糊的**扁平图片**。判断节点改用**琥珀色圆角矩形**（fill `#fef3c7` stroke `#d97706` + 标题带「?」）；连线只用 `<line>` 直线 / `<polyline>` 直角折线。
- 箭头**只能靠 `marker-end` 指向 defs 里一个 `<marker>`**（板子转成原生带箭头连接器，箭头取线的 stroke 颜色）；绝不能自己画 polygon 箭头。
- `opacity` 全部被忽略当纯不透明 → 泳道底色用**实色浅 hex**（如 `#fff7ed`），别用 alpha。
- 禁用 gradient/filter/pattern/clipPath/mask/blur；一个 marker 定义全图复用（stroke 换色即换箭头色）。
- 我沉淀的配色：入口紫 `#ede9fe`/动态 Adv 粉 `#fce7f3`/云端触发器橙 `#ffedd5`/判断琥珀 `#fef3c7`/信号蓝 `#dbeafe`/Advisor 紫 `#f3e8ff`/出口绿 `#dcfce7`/异常红 `#fef2f2`/灰 note `#f1f5f9`。连线：默认灰 `#475569`、Yes 绿 `#16a34a`、No 红虚线 `#dc2626`、数据蓝 `#2563eb`、云端下发紫 `#7c3aed`。

**六步管线**：
1. 预检 `bash ~/.claude/skills/beautiful-feishu-whiteboard/scripts/preflight.sh`（要 lark-cli 已 auth）。
2. 每张图写原生 SVG（≈1800 宽，泳道分层），本地渲染+lint：`npx -y @larksuite/whiteboard-cli@^0.2.11 -i x.svg -o x.png -f svg` 和 `... -f svg --check`（看 textOverflow/nodeOverlap；泳道 band 与内部节点必报 1 条 overlap=无害）。
3. 建文档带空白画板块：`cat doc.xml | lark-cli docs +create --api-version v2 --doc-format xml --content - --as user`。XML 支持 `<title><h1..h3><p><b><code><callout><ul><li><table><tr><td><whiteboard type="blank">`。返回 `data.document.new_blocks` 里 whiteboard 的 `block_token`**按文档出现顺序**排列。
4. 每块写图：`npx ... -i x.svg --to openapi --format json | lark-cli whiteboard +update --whiteboard-token <tok> --source - --input_format raw --idempotent-token <≥10位唯一> --overwrite --yes --as user`。
5. 取活板真图验收（**本地 png 会裁掉高画布，活板才是准的**）：`cd 目标目录 && lark-cli whiteboard +query --whiteboard-token <tok> --output_as image --output . --as user`。
6. 清理测试文档：`lark-cli drive +delete --file-token <docx_id> --type docx --yes --as user`。

**lark-cli 三个坑**：①先 `export LARK_CLI_NO_PROXY=1`（否则走本地代理告警）；②`@file` 只认「相对当前目录」路径，绝对路径报错 → 一律用 `-` 从 stdin 喂；③`+query --output` 也只认相对路径，得先 cd 到目标目录；④写操作要 `--yes`（high-risk-write）。

**把已有 HTML 文档搬进飞书 = 忠实转换，不许精简（2026-07-05 泽民纠错）**：第一版我把 v6 PRD「总结/改写」成精简飞书文档（50 表砍成 15、砍掉步骤 trace/JSON/多个 case），泽民立刻否："为什么和之前 PRD 不一样？我要的是和 v6 一模一样。" 正解=写 HTML→飞书 XML 转换器逐块搬运（`/tmp/html2feishu.py`：stdlib html.parser，h2→h1/h3→h2、table/pre/div.note/qcard 全保留、每个 `<svg>`→`<whiteboard>`、note 里嵌套 div/ol/li 要按 div 深度计数只在外层闭合、qcard 的 q-q/q-a 前缀【问】【答】）。校验口径：转换后 table/callout/h 数量必须与原 HTML 一致（v6=12 h2/48 h3/50 table/24 note）。同类铁律见 [[feedback_dont_delete_user_content]]（改文档≠删/重构）。

相关：[[feedback_trigger_diagram]]（画板内容规范：标准菱形/线上写为什么/泳道分色）、[[feedback_dont_delete_user_content]]、[[project_74_review]]。
