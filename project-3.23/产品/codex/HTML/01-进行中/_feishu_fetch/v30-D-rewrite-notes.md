# v30 D Planner/Director 改写说明

生成时间：2026-10-30 17:25（Asia/Shanghai）
目标文件：`豆包汽车-业务学习站-v30-工作副本.html`（未改 v29）
备份：同目录 `*.bak-rd-*` / `*.bak-rd-apply-*`

## 1. 是否已写入

**已完整写入。** 改动集中在：

- `DATA.base.modules[D]` 12 个节点 title / lines / detail / paragraphs / sourceIds（对齐 v15 05 章 + Director PRD）
- `DATA.pages[D].teaching` intro / lessons / closing；module title/subtitle
- SVG 等同名标题同步（title_map 中 D 的 12 条）
- sources 增补 `PLANNER-CABIN-EXPLORE`、`DIRECTOR-SHOWROOM`（展车 PRD 作补充口径，未并入主图节点）

## 2. 依据文档

| 标题 | URL | 更新时间（检索） | 用途 |
|---|---|---|---|
| 豆包汽车｜从一句话到车内结果：v15 全链路讲课版 | https://bytedance.larkoffice.com/docx/CYRndDwjDo7TvRxTshac5QWxnAg | 2026-10-30 17:15 | 05 章节点命名与讲法 |
| Director(对话推理引擎) PRD | https://bytedance.larkoffice.com/wiki/XRuKwJ0VPisdUhkxH0ecY1rRn9g | 2026-10-29 14:13 | 四类输入、talk_or_not/action_list、说做一致、条件任务合理性 |
| 座舱Planner探索 | https://bytedance.larkoffice.com/wiki/K8Ihw3a4niaDNck7FEkcDXcOnfb | 2026-10-29 14:12 | 历史/探索背景；不把未落地 multi-agent 画进现行主链 |
| AIDV Planner One Page | https://bytedance.larkoffice.com/wiki/EWziwFVftiGvnlk0FA4cadqonud | （已 fetch） | Planner 对客/对内职责对照 |
| 文字记录：AI汽车-产品宣讲3-DT | https://bytedance.larkoffice.com/docx/Is0mdygy3oQmEixHRUNcolvXnRb | 2026-10-22 | ReAct 替代意图分类/简单复杂仲裁 |
| PRD-增加展车引导director链路 | https://bytedance.larkoffice.com/wiki/EN6IwFXUtibm1vkkRVCcgxubnsm | 2026-10-30 11:59 | 展车独立配置；**未**并入日常主图节点 |
| 对话推理引擎/Director knowhow | https://bytedance.larkoffice.com/wiki/GlZhweru4i6naMkbGv4czFeFnGo | （已 fetch） | 工具/场景 knowhow；细节归 E 章 |
| Director 评测重点与打分指南 | （既有 EVAL-GUIDE） | — | 说做一致与走查三类错误 |

检索：`by_module/D/index_refreshed.json`。

## 3. 主要改了什么

- 节点标题对齐讲课版：如「缺可查询事实：只发查询这一步」「同轮放独立动作，依赖动作留下一轮」「输出一份说做一致的决策」等
- 写清 Planner=Director=DT；四类输入；ReAct 口径（宣讲）
- action_list **默认同轮并发**；数组顺序≠串行；依赖必须拆轮
- 输出四元组 talk_or_not / talk_content / emoji_id / action_list；下游不自主播报；同轮多工具等齐再统一说
- 条件任务合法性示例保留在 D5；展车/D13 等补充口径只在 lesson 注明「指回主路，不进未证实主图节点」

## 4. 图

- **保留** 12 节点主链；**改** 标题与文案；SVG 同步
- **未新增** D13+ 虚线补充节点、展车专用链路框——材料为专项/补充，写不清则不进主图

## 5. 跳过 / 失败

- 座舱Planner探索中的 multi-agent / RAG 愿景不写成现行落地
- 下游工具 sheet `NxMVwYmqLijlubkKE54cVHfrnib` 先前 fetch 失败，归 E 章
- knowhow 文档工具清单细节不在 D 章展开

## 6. 自检

- JSON 可 parse；D 节点含 talk_or_not、action_list、四类输入等表述
- 未触碰 v29；飞书只读
