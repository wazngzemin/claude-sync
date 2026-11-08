# v30 语音章改写说明

生成时间：2026-10-30 17:17（Asia/Shanghai）
目标文件：`豆包汽车-业务学习站-v30-工作副本.html`（未改 v29）
备份：同目录 `*.bak-voice-*`

## 1. 语音章是否已写入

已写入。改动集中在：

- `DATA.modules[V]` 18 个节点的 **title / lines / detail / paragraphs / sourceIds**（产品讲法对齐：热词、一遍 ASR、Soft VAD、预请求、Hard VAD、二遍 ASR）
- `DATA.pages[V].teaching` intro / lessons / sections / closing / guides 标题替换与正文加强
- `DATA.sources` 增补今日检索到的讲课版、AIDV OnePager、AIVA 禁用、宣讲 3-DT、产品 one page、面试手册、v15 含原图
- `originalSvg` 内同名节点标题字符串同步替换（避免图文标题漂移）

未大范围改 R/M/C/D/E/O 等其它模块正文。

## 2. 依据的飞书文档（语音章主依据）

| 标题 | URL | 更新时间（检索） | 用途 |
|---|---|---|---|
| AI汽车语音基础体验链路OnePager | https://bytedance.larkoffice.com/wiki/GBcCw5c6xiWvGukPMQgcMiuKnEc | 2026-10-30 16:54 | 主基线：200ms 帧、Soft 300/Hard 600、预请求、二遍、热词、流式拒识 |
| 豆包汽车｜从一句话到车内结果：v15 全链路讲课版 | https://bytedance.larkoffice.com/docx/CYRndDwjDo7TvRxTshac5QWxnAg | 2026-10-30 17:11 | 01 章节点命名与产品讲法 |
| 豆包 × AIDV 端云链路 OnePager | https://bytedance.larkoffice.com/wiki/DBRnwrLFNiPxV5kZZOXcBYxqnCl | 2026-10-27 | 端云数据形态与职责 |
| 【AI汽车-PRD】车内语音 | https://bytedance.larkoffice.com/wiki/UIcgwzzo9iCQ2tkDz44cSjXXnBf | （已 fetch） | 权限、声学、上屏/离在线文字 |
| 【AIVA-PRD】语音禁用和AI不可用场景 | https://bytedance.larkoffice.com/wiki/Ob2Xwk74MiAOYmkcvirciu84nTg | （已 fetch） | 不可用/禁用 |
| 【AI汽车-PRD】语音交互打断策略 | https://bytedance.larkoffice.com/wiki/FLlSwl1GoicNugkWWLCcFxtmnhl | （已 fetch） | 流式打断边界（细则归插话章） |
| 服务端技术评审-多级VAD策略 | https://bytedance.larkoffice.com/wiki/PJMUwwRCNiC2A8kjXCjcs4Bun7Y | （既有 source） | pre_query 字段与复用 |
| 【AI汽车-PRD】多级VAD产品体验 | https://bytedance.larkoffice.com/wiki/FzViwCNb2iF43QkB5eDcD3D2nJh | （既有 source） | 与 OnePager 阈值并列待核 |
| 文字记录：AI汽车-产品宣讲3-DT 2026年10月22日 | https://bytedance.larkoffice.com/docx/Is0mdygy3oQmEixHRUNcolvXnRb | 2026-10-22 | 打断恢复 event、输入分流口径 |
| AI汽车产品 one page | https://bytedance.larkoffice.com/docx/XNy1dc03QorjiOxnmC5cZy3fnhc | 2026-10-19 | 多音区/免唤醒/流式打断产品表述 |
| 语音产品经理面试备战手册 · 豆包汽车座舱版 | https://bytedance.larkoffice.com/docx/QdaXdDVTSopBdJxfnrWczBEYnof | 2026-10-21 | 预请求、唤醒/免唤醒边界 |
| 豆包汽车｜v15 主链路与模块详解（含原图） | https://bytedance.larkoffice.com/docx/DfiydEuaQoKDERx4PLEc9AA7nDf | 2026-10-26 | 画板/原图对照（未把未落地节点画进主图） |

本地宣讲样例（粒度）：`语音课堂研究-20261029/input-lecture.md`、`activation-lecture.md`，以及 `豆包座舱语音闭环-培训讲稿-v07.md`。

## 3. 图：删/改说明

- **保留** 现有 V 模块 18 节点主链图（授权→收音/声学/音区→热词∥一遍 ASR∥VAD→Soft 预请求→Hard→二遍→复用/重算→交接；失败出口 V18；语义判停 V10）。
- **改** 全部节点标题与关键 lines/detail，与 v15 讲课版 / OnePager 产品词对齐；SVG 内同名标题字符串同步替换。
- **未新增** 讲课版提到但标为 2.6/讨论中/待核的 V19–V24（多级时长并列、声纹、车外语音、口癖过滤、打断入口扩展、预请求作废独立框等）——写不清/未落地则不进主图。
- **未重画** 整张 originalSvg 几何布局；若个别长标题在框内换行溢出，需下一轮按 textLayout 调高或缩词。
- page.flows 仍为空：本章继续用 originalSvg 裁切 + 节点 disclosure，不另塞第三张说不清的分支大图。

## 4. 仍缺 / 故意跳过

- 热词技术方案部分 wiki 历史无权限（面试手册亦提及）；不编造命中阈值。
- 多级 VAD Soft300/Hard500/语义1000 与 OnePager 300/600 冲突：正文并列待核，不统一成单一现行值。
- 声纹隐性录入、车外语音完整能力、口癖过滤独立 PRD：材料不足，不写进主链为已落地。
- 最终拒识细则、端云采信、打断恢复完整状态机：属于 R/I 章，本章只交边界。
- `【AI汽车】下游工具输入输出整理`（sheet）fetch 失败，留待 E 章；不影响语音输入主链。
- 其它模块（D/E/T/G…）本轮完成检索索引 + 部分精读落盘，正文改写未铺开。

## 5. 检索覆盖（详见 module_coverage.json）

主链优先模块均已 search；V 另有多查询 `search_index.json`（unique≈89）及 bodies 精读。失败项见上。

## 6. 自检

- JSON：`modules[0]`、`pages[0]` 可重新 parse；节点含 Soft VAD / 一遍 ASR / 二遍 ASR 标题。
- 未触碰 v29。
- 飞书只读 profile `feishu-personal-assistant`，未 auth login、未发消息、未改飞书。
