# 3.23 项目目录索引

整理时间：2026-05-27
整理原则：**全部铺到顶层、按前缀分组、中文命名**

---

## 一、`产品-*` —— 产品文档（11 个）

| 文件夹 | 内容概览 |
|---|---|
| `产品-AI-Car架构解读/` | `ai_car_arch_explained.html` |
| `产品-ainavi司机助手/` | ainavi SOP 会议总结 + 张政职责详解 |
| `产品-Planner-Prompt/` | prompt v1~v3 + 问题点 + 优化方案 |
| `产品-车书QA冲突修复/` | SP 修改方案 + 6 个 HTML 方案 |
| `产品-端侧触发器/` | 23 个文件（PRD 多版本 / 讲稿 / 评审 / 纪要 / diagrams 图） |
| `产品-会议纪要/` | 2 次会议纪要 / 3.30 / zhongziji |
| `产品-临停需求PRD/` | 临停需求 PRD v1.0 |
| `产品-培训资料/` | 司机 Agent / 舱驾融合培训等 4 个 HTML |
| `产品-术语字典/` | 车载 AI 术语全量汇总 .md + .html |
| `产品-司机Agent评测集/` | 统一评测集主文档 |
| `产品-图表资产/` | doubao AI car 架构 png/svg |

## 二、`场景知识-*` —— 场景知识 saic（10 个）

| 文件夹 | 内容 |
|---|---|
| `场景知识-Selector-SP版本/` | v11 主版本 4 个 + `_archive/`（v7~v10） |
| `场景知识-Optimized-Selector-Prompt/` | v8 主版本 + `_archive/`（v2~v7 老版本） |
| `场景知识-场景分类器SP变体/` | 6 个变体（标准 / 结构化 / 最小修改 / 最终补规则 / 组合 / system_message） |
| `场景知识-多轮对话示例/` | 3 个版本（标准 / 升级打样 / 真实版打样） |
| `场景知识-架构与逻辑图/` | 12 个 HTML（prompt-architecture / Demo / 知识检索优化 / 助手架构等） |
| `场景知识-测试与评测/` | doubao_test_result xlsx + 测试结果 + 评测规则 |
| `场景知识-数据表/` | 数据总览 xlsx（含原版备份） + 执行逻辑 JSON 示例 |
| `场景知识-资产/` | driver-agent-architecture png/svg |
| `场景知识-脚本/` | convert_h_examples / create_new_table / fix_all / trim_g（4 个 py） |
| `场景知识-其他/` | 5 个零散 md + `_claude-config/` |

## 三、`Prompts-*` —— Prompt 与文案模板（3 个）

| 文件夹 | 内容 |
|---|---|
| `Prompts-翻译/` | fanyi（精译重写） / fanyi-paper（学术论文） / fanyi-video（AI 视频） |
| `Prompts-小红书HTML替代Markdown/` | Claude-Code-HTML-文字版 + 2 个文案版本 |
| `Prompts-草仓/` | zuocang.md |

## 四、`脚本-*` —— 工具脚本（4 个）

| 文件夹 | 含义 |
|---|---|
| `脚本-article-forker/` | 文章 fork 工具（含 forker.py / prompts / static） |
| `脚本-feishu/` | 飞书同步脚本（upload / sync / oauth） |
| `脚本-fork-memo/` | fork-memo 项目（fork.py / data / examples） |
| `脚本-skills/` | Claude skills（llm-wiki-lark_1.0.7） |

## 五、`元数据-方法论/` —— 元数据与方法论（1 个）

`LLMVIKI.MD` / `AGENTS.md` / `_index_update.md` / `_log_update.md` / `fork方法论/`（3 个 fork-*.md） / `_empty_files/`

## 六、不动的（Karpathy LLM Wiki 与独立项目）

| 文件夹 | 说明 |
|---|---|
| `raw/` | 原始素材层（不可变）：articles/ 325 个 + assets/ 64 个 |
| `raw_cleaned/` | 清洗后的 PRD 与架构图 |
| `wiki/` | Wiki 层：concepts / entities / summaries / synthesis / comparisons / sp.md / index.md / log.md |
| `Recordly/` | 独立 Electron 录屏应用 |

## 七、顶层散文件

- `ai-car-sharing-presentation.html` —— AI Car 分享演示页
- `MIGRATION_LOG.md` —— 本次归档迁移流水
- `README.md` —— 本文件

---

## 命名规则

- **前缀分组**：`产品-` / `场景知识-` / `Prompts-` / `脚本-` / `元数据-`，Finder 字母序自动成簇
- **旧版本**：放在子目录 `_archive/` 下，全部保留不删
