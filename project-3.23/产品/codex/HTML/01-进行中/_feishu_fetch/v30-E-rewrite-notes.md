# v30 E 工具执行 — 改写记录

生成/更新：2026-10-30 17:40（Asia/Shanghai）
状态：**已整章写入 HTML**（节点 title/lines/detail + teaching + SVG 同名同步）

## 1. 依据 URL

| 材料 | URL |
|---|---|
| v15 讲课版 06｜工具执行与反馈 | https://bytedance.larkoffice.com/docx/CYRndDwjDo7TvRxTshac5QWxnAg |
| v15 主链路与模块详解 | https://bytedance.larkoffice.com/docx/DfiydEuaQoKDERx4PLEc9AA7nDf |
| 智能座舱语音链路·资料梳理 | https://bytedance.larkoffice.com/wiki/TxPxdqyNwo5miZxBRPOc5SarnGd |
| Director PRD | https://bytedance.larkoffice.com/wiki/XRuKwJ0VPisdUhkxH0ecY1rRn9g |
| 【AI汽车】下游工具输入输出整理 | https://bytedance.larkoffice.com/wiki/NxMVwYmqLijlubkKE54cVHfrnib |

落盘：`by_module/E/bodies/`；摘录 `v15_chapter_E.txt`；备份 `*.bak-eo-*`

## 2. 已写入内容

### 模块/页
- module title →「工具执行｜把动作真正跑出去，再把事实收回来」
- teaching 4 lessons：进门核对；受理/完成分层；同批汇集经输入管理回流；话语权+真实结果+失败出口
- sourceIds：`VOICE-V15-LECTURE` / `DT-PRD` / `VOICE-CHAIN-NOTES` 等

### 节点标题（对齐讲课版 E1–E12；未扩 E13+）
1. 接动作列表，核对调用身份
2. 找本项目已发布可用实现
3. 获得发布许可，按同轮规则发出
4. 交单个 Agent 执行内部业务
5. 返回的是受理、处理中还是完成
6. 把执行事实返回，保留错误原因
7. 同批反馈汇集，迟到和缺失有归属
8. 反馈只经输入管理回到 Director
9. 结果核对口：交给 D12 判断还差哪一步
10. 统一话语权，按项目保留直返例外
11. 核对用户真正获得的结果
12. 失败出口：少承诺，不盲目重试

### 关键口径
- 进门四件核对；定义≠实现；找不到不换相似名
- 受理 ≠ 流结束 ≠ 业务完成 ≠ 用户听见
- 反馈只经输入管理回 Director；续轮仍须准入；异步 callback 一期缺口如实标注
- 可调用工具数量【待核】；NxMVw sheet 正文未取到，不写死字段表
- E13+（离线白名单/无自主播报/事件流等）不进主图

## 3. 故意跳过
- 不写 Redis/具体 AgentType 六类工程表进主节点
- 不把下游工具 sheet 字段编造进 HTML
- 失败话术七类模板不塞主图

## 4. 失败项（沿用）
- NxMVw… sheet fetch 仍失败；正文跳过不编造
