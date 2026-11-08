# v30 V 章加厚笔记（2026-10-30）

## 状态
- 加厚 payload + apply 脚本已备好；写入目标机 DXF00FQV07 曾断线，若本笔记与 HTML 同目录出现则表示已写回。
- 备份（写入前已做）：`豆包汽车-业务学习站-v30-工作副本.html.bak-v-thicken-205853`
- **未改 v29**

## 依据
- `lecture_style_20261030/clean/OnePager.md`（Soft300/Hard600、预请求、热词七类、request_id/round_id、流式拒识四前提）
- `lecture_style_20261030/clean/车内语音PRD.md`（二遍 ASR、热词≥3000、上屏/离在线）
- `lecture_style_20261030/clean/语音工作地图.md`（多级 VAD 冲突、预请求三不/不抢跑 FC/Planner/DM、复用苛刻条件、离线 ASR 实测）
- 宣讲样例A / 宣讲3DT（风格：场景→概念→机制→例子→边界→下一环）
- 既有：`v30-voice-rewrite-notes.md`、`v30-V-lecture-rewrite-notes.md`、`v30-V-audit-summary.md`

## 改了什么
1. **intro**：~650 字；补英文括注与【待核】提示
2. **lessons**：4 课各 9–10 段，合计目标 5500–7500；补热词七类数量、200ms 帧、流式拒识四前提、二遍 CER、离线 ASR 断点、预请求专用入口与三不+不抢跑、复用三条件与差一字、四段时延拆账、交接定义权
3. **guides.base.sections**：在原 10 节上追加机制段（不删原走读），目标合计 13000–16000；`paragraphs` 同步为 sections 拼接
4. **closing**：3 段评审定义权/归属话术 + 四件验收证据（原则第6条）
5. **节点 paragraphs/detail**：18 节点各补 1 段机制（不改 SVG 几何与 title）
6. **page.sections** 与 lessons 对齐

## 【待核】列表
1. Soft≈300 / Hard≈600（OnePager） vs Soft/Hard/语义≈500/1000（多级 VAD PRD）生效值
2. 语义判停与固定时长叠加/替代关系、延长多久
3. 预请求方案（端侧直连 AIDV vs extra 透传）现行排期与是否已解「二次打断/小云朵」
4. 热词回流冷热处理（技术方案历史无权限）
5. 离线 ASR 供应商/版本与有网偶发切离线开关现状
6. CarPlay 连接 vs Siri 抢麦：各车型提示/静默文案

## 脚本
- `_feishu_fetch/_v_thicken_apply.js`
- `_feishu_fetch/_v_thicken_payload.json`
