# v30 M 输入管理 — 改写记录

生成/更新：2026-10-30 17:35（Asia/Shanghai）
状态：**已整章写入 HTML**（节点 title/lines/detail + teaching + SVG 同名同步）

## 1. 依据 URL

| 材料 | URL |
|---|---|
| [技术方案]输入管理模块设计 | https://bytedance.larkoffice.com/wiki/UsHgwkm2Sig3blkAttBclYb0n4g |
| 输入管理模块及其策略 | https://bytedance.larkoffice.com/wiki/C6Ciwrfn0i1Vt7kw3kgcWluxnvh |
| v15 全链路讲课版（03｜输入管理） | https://bytedance.larkoffice.com/docx/CYRndDwjDo7TvRxTshac5QWxnAg |
| 宣讲 3-DT 文字记录 | https://bytedance.larkoffice.com/docx/Is0mdygy3oQmEixHRUNcolvXnRb |

落盘：`by_module/M/bodies/`；讲课章摘录 `v15_chapter_M.txt`；备份 `豆包汽车-业务学习站-v30-工作副本.html.bak-mc-*`

## 2. 已写入内容

### 模块/页
- module title →「输入管理｜把并发消息排成可交给 Director 的一轮」
- page teaching intro / 4 lessons / closing 按 TECH 八场景口径 + v15 宣讲句式重写
- sourceIds：`INPUT-TECH` / `INPUT-PRD` / `VOICE-V15-LECTURE` / `VOICE-XUANJIANG` / `DT-PRD` / `ME-INPUT`

### 节点标题（对齐讲课版 M1–M12；未扩 M13–M16 进主图）
1. 接住四类输入，保留来处
2. 核对正在算、正在说、已在做
3. 前台是否空闲，能否直接接入
4. 可重算吗：先看工具是否发出
5. 谁插入：用户优先，普通消息排队
6. 取消推理和声音，不抹掉已做的事
7. 组成这一轮输入，生成有效身份
8. 普通输入等待，避免重复和串单
9. 发计算许可，再看输出许可
10. 客户端报告真实播放进度
11. 等不到终态：解锁但不伪造成功
12. 故障恢复先防重复副作用

### 关键口径已写入
- 四类输入 query/advice/feedback/event；Adapter 标准化；request_id 非空
- ChatRuntimeState IDLE/PROCESSING/RESPONDING
- 执行重放边界：Tool call 已放行则旧 Input 不可重放，只作中断上下文
- P0 用户优先；高优抢占结构预留、本期非目标不启用
- P1 忙时排队 vs 合并：产品稿与 TECH 冲突处标**待核**，不擅自统一
- 计算准入 ≠ 对外发布；播放以客户端 STARTED/PROGRESS/FINISHED/ABORTED 为准
- 与 I 章边界：多人首 token / 打断恢复细节不展开

### SVG
- `originalSvg` / `diagrams` / `overviewSvg` 中 12 个旧标题均已替换为新标题（title_map 24 条含 C）

## 3. 故意跳过
- 不把 M13–M16（本地硬规则/跨拒识继承/埋点/验收）塞进主 12 节点图
- 不写死 Redis CAS/具体键名等工程细节
- 不展开 S1–S8 白板逐步伪代码；lessons 用场景句覆盖
- AIGC 独立推送、异步 callback 仅作非目标一句

## 4. 失败项
- 无新增失败；既有 sheet 归 E 章
