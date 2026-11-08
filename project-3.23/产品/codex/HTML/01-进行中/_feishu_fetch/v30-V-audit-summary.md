# v30 V 章审稿摘要（给用户，1 页）

时间：2026-10-30 18:05–18:10（Asia/Shanghai）  
文件：仅 `豆包汽车-业务学习站-v30-工作副本.html` 的 V 章；**v29 未动**。

## 对照什么审
- 宣讲样例A（记忆）、宣讲3DT：场景开场 → 澄清概念 → 例子区分 → 边界（已实现/缺口/待核）→ 接到下一环；**不说培训元话语**。
- 清单：`v30-V-ready-for-audit.md`；明细：`v30-V-audit-findings.md`。

## 发现并已改
1. **notes 字数虚高**：guide 曾把 flat+sections 双计成 12594；真实可读 sections 合计当时约 **6209**。
2. **删废话类型**：课堂口令/板书/金句/北极星/黑话/「当着图念」/同义反复（互斥、三不、复用条件、交接清单、失败证据链等前后各写两遍）。
3. **按宣讲密度重写图下 guide**：保留游泳馆→餐厅主线；补 Soft/Hard **同起点时间线**、ASR∥VAD 四拍读图、预请求三不可观察行为、复用/重算分叉验收例、失败线与主链分读。无加水话。
4. **lessons / nodes**：刮掉课堂腔；intro 末段收成路线一句；page.sections 与 lessons 对齐。

## 字数（汉字，以代码实测）
| 区块 | 审稿后 |
|------|--------|
| intro | 424 |
| lessons（paragraphs） | 3302（仍 ≥ v29 3025） |
| guides.base **sections 合计** | **9002**（落在 9000–15000） |
| closing | 84 |

## 自检
- 2 个 `<script>`；无 `}{ crumbs`
- 两段 `node --check` OK；`new Function` OK
- 【待核】未统一；记忆/自进化/Director 仅交接边界
- 未改 SVG 几何；未改 v29

## 路径
- findings：`_feishu_fetch/v30-V-audit-findings.md`
- 本摘要：`_feishu_fetch/v30-V-audit-summary.md`
- 备份：`*.bak-v-audit-180552`
