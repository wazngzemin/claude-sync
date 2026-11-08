# v30 业务学习站 — 审稿准备清单

生成时间：2026-10-30 17:45（Asia/Shanghai）（Asia/Shanghai）  
工作副本：`/Users/bytedance/Desktop/3.23/产品/codex/HTML/01-进行中/豆包汽车-业务学习站-v30-工作副本.html`  
约束提醒：只审/只改 v30 工作副本；绝不改 v29；飞书只读。

## 1. 已改章节与 notes 路径

| 章 | 状态 | notes |
|---|---|---|
| V 声音入口 | 已整章（更早轮次） | `_feishu_fetch/v30-voice-rewrite-notes.md`（若存在） |
| R 有效入口与端云采信 | 已整章 | `v30-R-rewrite-notes.md` |
| M 输入管理 | 已整章 | `v30-M-rewrite-notes.md` |
| C Context | 已整章 | `v30-C-rewrite-notes.md` |
| D Director | 已整章 | `v30-D-rewrite-notes.md` |
| E 工具执行 | 已整章 | `v30-E-rewrite-notes.md` |
| O 输出链路 | 已整章 | `v30-O-rewrite-notes.md` |
| I 插话与恢复 | **本轮已整章** | `v30-I-rewrite-notes.md` |
| G 云端触发器 | **本轮已整章** | `v30-G-rewrite-notes.md` |
| L 端侧触发 | **本轮已整章** | `v30-L-rewrite-notes.md` |

讲课章摘录：`v15_chapter_{R,M,C,D,E,O,I,G,L}.txt`（在 `_feishu_fetch/`）  
标题映射备份：`v30_*_title_map.json`、`*.bak-*-*` HTML 备份同目录。

尚未整章改写（若审稿范围扩展）：K 身份记忆、F 能力准入、T 任务、S 主动服务、P 配置、A 视觉、H 静默/PHUD、B 信号、U 任务中心、W 可见即可说 等。

## 2. 对照宣讲样例路径（风格基准）

请审稿 agent **对照下列样例的语言风格与句式**，而不是对照 v29：

1. **培训讲稿-v07（主样例）**  
   `/Users/bytedance/Desktop/3.23/产品/codex/HTML/01-进行中/豆包座舱语音闭环-培训讲稿-v07.md`  
   配套图文课堂：`…/豆包座舱语音闭环-图文课堂版-v07.html`

2. **讲课稿改写 / 语音课堂研究（用户指定的改写研究目录）**  
   - `/Users/bytedance/Desktop/3.23/产品/codex/讲课稿改写/`（含 `sample_jev.md`、`*-lecture.md`、`style_out.txt` 等）  
   - `/Users/bytedance/Desktop/3.23/产品/codex/语音课堂研究-20261029/`  
   - `/Users/bytedance/Desktop/3.23/产品/codex/语音课堂研究-20261022/`（若 29 日目录与 22 日并用）  
   - 补充：`/Users/bytedance/Desktop/3.23/产品/codex/语音课堂重构-20261023/course-content-v07.md`

产品讲解方向基准：飞书 v15 全链路讲课版  
https://bytedance.larkoffice.com/docx/CYRndDwjDo7TvRxTshac5QWxnAg

## 3. 已知待核 / 冲突清单（不得擅自统一）

| 主题 | 所在章 | 说明 |
|---|---|---|
| 热词 / Soft·Hard VAD 数值 | V / 语音入口 | OnePager 有 200ms 帧、Hard VAD 600ms 等；与旧版/项目定制并存处勿写死为唯一现行 |
| 流式拒识提前打断字数 / 打断时机多版方案 | I | OnePager 与历史 2.6 短期方案有演变；旧版数值不写死 |
| P1 忙时排队 vs 合并 | M | 产品稿与 INPUT-TECH 文档冲突，已标待核 |
| 高优 advice 抢占 | M | TECH 非目标：结构预留、本期不启用 |
| TTS 方言 vs 无网优先级 | O | 离在线 TTS 原文无完整统一答案，标待核 |
| TTS 首包 / 情感化耗时指标 | O | 工作地图并列数字，写不清现行不写死 |
| 未指定情绪时 Sami vs S2S 选路时期差异 | O | 早期技术稿与 OnePager 差异，按项目协议确认 |
| 播放四态旧端兼容回流 | O / M | 新链路四态≠所有车端现状 |
| 情景画像是否用于推理 | C | 宣讲口径：当时未用于推理；与已注入语义画像并列 |
| Context P90 800ms / 实测 1.2s | C | 历史性能，不写死为现行 |
| 可调用工具数量 / 下游工具字段表 | E | NxMVw sheet fetch 失败；数量待核 |
| AIVA 恢复门槛 vs 通用恢复 | I | AIVA VUI PRD 未全文接入；分开写、不合并 |
| 端云重复执行仲裁细则 | L / G | 离在线仲裁与任务归属，冲突标待核 |
| 触发器条件&执行项枚举 | G | KknG fetch 失败，不写死枚举 |
| 统一配置下发到端侧 | L | 属后续建设，不写成现行 |

## 4. 建议审稿 agent 检查项

1. **语言风格**：是否接近培训讲稿-v07 / 讲课稿改写样例的宣讲口语——短句、场景开头、少黑话堆叠；工程词出现时有没有用一句话说明用途。  
2. **句式**：节点 title 是否“动作+边界”短句；lines 是否可当板书；detail/teaching 是否先场景后规则。  
3. **产品讲解方向**：是否讲清“用户感知到什么 / 系统决定什么 / 不做什么”；有没有把非目标、待核写成已上线。  
4. **是否废话**：有无同义反复、有无把相邻章职责重讲一遍（如 I 重定义 M 的播放四态、G 重讲 S 的顾问话术）。  
5. **图文对齐**：`originalSvg` / `diagrams` 节点标题是否与 `modules[].nodes[].title` 一致；有无旧标题残留；图上分支是否与 teaching 叙述一致。  
6. **冲突处理**：文中【待核】是否保留；有无擅自选定冲突一侧。  
7. **边界**：I↔M、E↔O、G↔L↔S、C↔K 等章间指针是否清楚，有无越权承诺。

## 5. 本轮失败项（材料）
- NxMVw 下游工具 sheet、AzAx 体验优化、KknG 触发器条件表、FBsr AIVA VUI、YVdc 端侧评审记录：fetch 失败或未取全文 → 已跳过，未编造。
