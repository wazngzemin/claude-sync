# 归档迁移日志

**时间**：2026-05-27
**目标**：把根目录散文件 + `场景知识/` + `培训/` + `端侧触发器 - PRD_2026-05-06.../` 全部分类整理到顶层中文前缀目录

---

## 一、顶层骨架重整

| 旧位置 | 新位置 |
|---|---|
| `01_文档资料/端侧触发器/` + 根 `端侧触发器 - PRD_2026-05-06.../` | `产品-端侧触发器/`（合并铺平，23 个文件） |
| `01_文档资料/PRD/PRD.md` | `产品-临停需求PRD/临停需求PRD_v1.0.md` |
| `01_文档资料/PRD/司机Agent_统一评测集.md` | `产品-司机Agent评测集/` |
| `01_文档资料/PRD/1.md`（空） | `元数据-方法论/_empty_files/PRD-1.md` |
| `01_文档资料/Planner Prompt/` | `产品-Planner-Prompt/` |
| `01_文档资料/会议纪要/` | `产品-会议纪要/` |
| `01_文档资料/图表资产/` | `产品-图表资产/` |
| `01_文档资料/2 次会议纪要.md` | `产品-会议纪要/` |
| `培训/` | `产品-培训资料/`（含 `.claude/launch.json`） |
| `场景知识/`（63 个文件） | 拆分为 10 个 `场景知识-*/`（详见下表） |
| `02_应用代码/ai-car-sharing-presentation.html` | 顶层根目录 |
| `03_工具脚本/{article-forker,feishu,fork-memo,skills}/` | `脚本-*/` 各自独立 |
| `04_Prompts与文案/*` | `Prompts-*/` 提级 |
| `99_元数据与方法论/*` | `元数据-方法论/` |
| 根目录 25 个散 `.md / .html` | 按主题分到各 `产品-*` / `Prompts-*` / `元数据-方法论/` |

清空并删除的旧壳：`01_文档资料/`、`02_应用代码/`、`03_工具脚本/`、`04_Prompts与文案/`、`99_元数据与方法论/`、`培训/`、`场景知识/`、`端侧触发器 - PRD_2026-05-06 16-28-56/`。

---

## 二、根目录散文件去向

| 原文件 | 新位置 |
|---|---|
| `SP修改方案_车书QA冲突修复.md` | `产品-车书QA冲突修复/` |
| `车书QA冲突修复_骨架图与实例版.html` | 同上 |
| `车书QA冲突修复_可视化图表版.html` | 同上 |
| `车书QA冲突修复_深度分析版.html` | 同上 |
| `车书QA冲突修复_完整方案手册.html` | 同上 |
| `车书QA冲突修复_新方案探索.html` | 同上 |
| `车书QA冲突修复方案_详细版.html` | 同上 |
| `ainavi-sop-meeting-summary.html` | `产品-ainavi司机助手/` |
| `张政-ainavi-职责详解.html` | 同上 |
| `ai_car_arch_explained.html` | `产品-AI-Car架构解读/` |
| `车载AI术语全量汇总.html` | `产品-术语字典/` |
| `车载AI术语全量汇总.md` | 同上 |
| `fanyi.md` `fanyi-paper.md` `fanyi-video.md` | `Prompts-翻译/` |
| `Claude-Code-HTML-文字版.md` | `Prompts-小红书HTML替代Markdown/` |
| `小红书-深度解读-HTML替代Markdown.md` | 同上 |
| `小红书文案-HTML替代Markdown.md` | 同上 |
| `zuocang.md` | `Prompts-草仓/` |
| `LLMVIKI.MD` `AGENTS.md` `_index_update.md` `_log_update.md` | `元数据-方法论/` |
| `fork-concept.md` `fork-raw.md` `fork-source.md` | `元数据-方法论/fork方法论/` |

---

## 三、`场景知识/` → 10 个顶层目录

| 新目录 | 原文件清单 |
|---|---|
| `场景知识-Selector-SP版本/` | v11 / v11-plaintext / original-minimal-fix / ultra-minimal-diff |
| `场景知识-Selector-SP版本/_archive/` | v7 / v7.txt / v8 / v9 / v9.json / v10 |
| `场景知识-Optimized-Selector-Prompt/` | v8 |
| `场景知识-Optimized-Selector-Prompt/_archive/` | 原始 / v2 / v3 / v4 / v5 / v6 / v6.2 / v6.3 / v6.4 / v6.5.json / v6.6 / v6.7.json / v6.8 / v7 |
| `场景知识-场景分类器SP变体/` | 标准 / 结构化 / 最小修改 / 最终只补规则 / 组合 / system_message（6 个） |
| `场景知识-多轮对话示例/` | 标准 / 升级打样 / 真实版打样（3 个） |
| `场景知识-架构与逻辑图/` | prompt-architecture / prompt-full-architecture / prompt-logic-skeleton / system-architecture / 助手架构图 / 助手架构详解-带案例 / 动态知识检索&使用需求说明 / 动态知识注入-逻辑讲解 / 全链路Demo_完整版 / 全链路模拟Demo / 知识检索优化方案 / 520任务拆解_流程图（12 个 HTML） |
| `场景知识-测试与评测/` | doubao_test_result-2026-05-20 xlsx / 测试结果 xlsx / Selector评测规则文档 md |
| `场景知识-数据表/` | 场景知识_数据总览（含原版备份） / 执行逻辑_JSON示例（3 个 xlsx） |
| `场景知识-资产/` | driver-agent-architecture png + svg |
| `场景知识-脚本/` | convert_h_examples / create_new_table / fix_all / trim_g（4 个 py） |
| `场景知识-其他/` | knowledge_entry_014 / knowledge_selector_sp_modified / knowledge-selector-optimization / prompt / schema重写范本（5 个 md） + `_claude-config/`（原 `场景知识/.claude/`） |

---

## 四、`端侧触发器/` 合并明细

`产品-端侧触发器/` 由两处合并得到，**全部铺平不分子目录**：

来源 A —— 原 `01_文档资料/PRD/端侧触发器/`：
- 端侧触发器PRD_v0.1.md / v0.2.md / v0.5_仿Planner版.md / v0.7_仿AICar版.md
- 端侧触发器PRD_独立版_v0.1.md / 评审版_v1.0.md / 完整版_v2.0.md
- 端侧触发器PRD_演示.html / 端侧触发器需求全景讲解.md

来源 B —— 原根 `端侧触发器 - PRD_2026-05-06 16-28-56/`：
- 2 次会议纪要.md（空文件，源 dump 保留）
- 【AICar】端侧VLM任务优先级.md / 【AI汽车】端侧视觉感知.html
- 触发器Condition-Trigger-Action.html
- 端侧触发器 - PRD.md / 评审讲稿.md / 完整PRD.md / 需求评审会讲稿.md
- 会议纪要.md
- 架构与流程详解 - 评审讲稿.md / 逐字评审稿.md
- 评审逐字稿 - 第二次评审.md
- diagrams/、images/（保留为子目录）

无文件名冲突。

---

## 五、未动区域

- `raw/`（articles 325 + assets 64） —— Karpathy 原始素材层，不可变
- `raw_cleaned/` —— 26 个清洗 .md + svg/png/html
- `wiki/` —— Karpathy Wiki 层（concepts/entities/summaries/synthesis/comparisons/sp.md/index.md/log.md）
- `Recordly/` —— 独立 Electron 应用项目
- `.claude/` `.trae/` `.env` `.feishu_tokens.json` `.sync_state.json` —— 隐藏配置

---

## 六、文件零丢失校验

迁移前根目录散文件 25 个 + `场景知识/` 63 个 + `培训/` 4 个 + `端侧触发器 - PRD_2026-05-06.../` 13 个文件/目录 = **共 105 个对象**，全部已分配到新目录，无删除（空文件 `1.md` 仅移位到 `元数据-方法论/_empty_files/`）。

旧版本统一进入相应 `_archive/` 子目录，**不删保留**。
