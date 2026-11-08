# v30 C Context — 改写记录

生成/更新：2026-10-30 17:35（Asia/Shanghai）
状态：**已整章写入 HTML**（节点 title/lines/detail + teaching + SVG 同名同步）

## 1. 依据 URL

| 材料 | URL |
|---|---|
| Context OnePage | https://bytedance.larkoffice.com/wiki/OjGMwBX8fiLS0ikDWqVceVjhnPg |
| 公共Context管理-豆包【AI car 1.0】 | https://bytedance.larkoffice.com/wiki/Ip1kwhsLhioyegkuf9bcIUspnpb |
| Director上下文调整-需求说明 | https://bytedance.larkoffice.com/wiki/Q75hww98KiC3KZkAUMRc5Bten9b |
| AI汽车记忆方案 | https://bytedance.larkoffice.com/wiki/PdbRw6JTlisStKkRbXGczIWBnof |
| v15 讲课版（04｜上下文准备） | https://bytedance.larkoffice.com/docx/CYRndDwjDo7TvRxTshac5QWxnAg |

落盘：`by_module/C/bodies/`；讲课章摘录 `v15_chapter_C.txt`

## 2. 已写入内容

### 模块/页
- module title →「Context｜按当前问题组装背景，缺哪项再查哪项」
- teaching 4 lessons：并行身份/车/情景；最新车况旁置；画像已注入 vs 情景画像待核；各源过滤后组装+显式查
- sourceIds：`NEW-CONTEXT-ONEPAGE` / `NEW-CONTEXT-PRD` / `CASE-CONTEXT-ADJUST` / `VOICE-V15-LECTURE` 等

### 节点标题（对齐讲课版 C1–C12；未扩 C13+）
1. 接本轮输入，按需要并行取背景
2. 确认当下说话人与操作对象
3. 取车辆此刻的值和时间
4. 取舱内外情景，不把视觉当身份
5. 接最近对话、工具事实和摘要
6. 带任务视图，区分旧 Goal 与新 Task
7. 第一路：推理前预取常用记忆
8. 注入本车型可用能力与知识
9. 选适用示例，不覆盖真实约束
10. 各来源各自过滤，保留未知
11. 组装本轮背景给同一个 Director
12. 第二路：Director 缺记忆才显式查

### 关键口径已写入
- Context **只组装不存储**原始长期数据
- **V2 现行**：预注入 + 动态检索；取消统一精筛；V1 三步式不写成现行
- 最新车况（env_info）优先于对话历史；goal_list 放本次请求旁
- 显式语义画像已固定注入；行为情景画像「当时未用于推理」并列待核
- 与 K/记忆章边界：体系细节不展开，本章只讲本轮取用
- P90 800ms / 实测 1.2s 等历史性能数字：**不写死为现行指标**

### SVG
- 12 个旧标题已同步替换

## 3. 故意跳过
- 不把 N6 筛选打分压缩算法塞进主图
- 不扩 C13–C17 进主 12 节点
- 记忆测试方案（MwYE…）仅作验收参考，未改产品主链表述
- Planner 探索稿（K8Ih…）不写成现行

## 4. 失败项
- 「上下文调整方案」精确搜曾 total=0；已用 CASE-CONTEXT-ADJUST + OnePage + 讲课版覆盖
