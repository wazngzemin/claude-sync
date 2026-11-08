# v30 R 入口管理（有效入口与端云采信）改写说明

生成时间：2026-10-30 17:25（Asia/Shanghai）
目标文件：`豆包汽车-业务学习站-v30-工作副本.html`（未改 v29）
备份：同目录 `*.bak-rd-*` / `*.bak-rd-apply-*`

## 1. 是否已写入

**已完整写入。** 改动集中在：

- `DATA.base.modules[R]` 18 个节点的 title / lines / detail / paragraphs / sourceIds（对齐 v15 讲课版节点名与本地对话 9/30 采信口径）
- `DATA.pages[R].teaching` intro / lessons / closing / guides 标题引用同步；module title/subtitle 更新
- `originalSvg` / overviewSvg / diagrams 内旧节点标题字符串同步替换（title_map 30 条中含 R 的 18 条）
- sources 确认含 `VOICE-V15-LECTURE` 等

## 2. 依据文档（本轮检索 + 精读）

| 标题 | URL | 更新时间（检索） | 用途 |
|---|---|---|---|
| 豆包汽车｜从一句话到车内结果：v15 全链路讲课版 | https://bytedance.larkoffice.com/docx/CYRndDwjDo7TvRxTshac5QWxnAg | 2026-10-30 17:15 | 02 章节点命名与产品讲法主基线 |
| 【AIVA-PRD】本地对话链路需求 | https://bytedance.larkoffice.com/wiki/JXC3wPYxziUiJLk9ZlOcYSZ2nsg | （已 fetch markdown） | attend 上云、9/30 后本地 FC 仅断网/超时采纳、音频已上云不采信本地 reject |
| 【AI汽车-PRD】多音区全时免唤醒交互 | https://bytedance.larkoffice.com/wiki/KSWtdjsmwoJ1TzxcIv4c57vinle | （已 fetch） | 免唤醒音区/上云策略边界 |
| 豆包 × AIDV 端云链路 OnePager | https://bytedance.larkoffice.com/wiki/DBRnwrLFNiPxV5kZZOXcBYxqnCl | 2026-10-27 | 客户端/豆包云/AIDV/Speech 分通道 |
| AI汽车语音基础体验链路OnePager | https://bytedance.larkoffice.com/wiki/GBcCw5c6xiWvGukPMQgcMiuKnEc | 2026-10-30 16:54 | 与 V 章交接：正式拒识边界 |
| 文字记录：AI汽车-产品宣讲3-DT | https://bytedance.larkoffice.com/docx/Is0mdygy3oQmEixHRUNcolvXnRb | 2026-10-22 | Director 替代旧漏斗口径 |
| 【AI汽车-PRD】离线LLM指令解析 | （既有 VOICE-OFFLINE） | — | 确定性缓存三条件 |
| 豆包汽车｜v15 主链路与模块详解（含原图） | https://bytedance.larkoffice.com/docx/DfiydEuaQoKDERx4PLEc9AA7nDf | 2026-10-26 | 画板对照；R19/R20 未落地者不进主图 |

检索索引：`by_module/R/index_refreshed.json`（多查询：入口管理/拒识/端云分流/路由/免唤醒/缓存/拒识方案）。

## 3. 主要改了什么

- 节点标题对齐讲课版：如「正式拒识：是对豆包的诉求吗」「断网或云端 3 秒超时」「本地候选分三类」「兜底后云端迟到：不得再次执行」等
- 采信口径写清 **9/30 后**：正则缓存优先 → 常规联网云端 Planner 优先 → 本地模型仅断网/云端 >3s 兜底；旧「本地 FC 直接采纳」不作现行
- 强调 **reject vs unsupported**、**attend 提前上云后不能用本地 reject 撤回**、**2s 心跳 vs 3s 业务超时不是同一计时器**
- 云端路径按 AIDV OnePager：ASR 通道与文本业务通道分责
- 与 V 章衔接：接收最终文字/音区/request_id；不在 R 章把预请求当执行

## 4. 图

- **保留** 现有 18 节点主链几何；**改** 全部节点标题与文案；SVG 同名标题同步
- **未新增** 讲课版提到的 R19（预请求作废，标 2.6）、R20（离线白名单独立框）——写不清/未全量落地不进主图
- guides 内引用旧标题已随 title_map 替换

## 5. 跳过 / 失败

- 多音区全时免唤醒 wiki markdown 较短（~4.6k），细节以讲课版 + 本地对话链路补齐；未把全部交互细则画进主图
- 网络恢复后补同步：材料标待核，正文保留「不能写成已上线」
- sheet 类（FeatureList/SOP）未当正文依据

## 6. 自检

- JSON 可 parse；R 节点含「3 秒」「正式拒识」「attend」等关键词
- 未触碰 v29；飞书只读 `feishu-personal-assistant`
