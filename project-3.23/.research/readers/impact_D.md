# impact_D — Director（理解与规划）：资料有、副本可能缺的点

来源：d03 Director PRD v1.7（wiki 10/24）、d07 座舱Planner探索、d10 Director knowhow、d11 Director优化计划、d12 逐字稿 2026-03-26、d01/d08 Planner PRD。

## 1. Director 的输入四类形态（PRD 明示）
- user input（query+speaker_name+speaker_position+timestamp）、advice（advisor 建议，数组）、tool feedback（tool_feedback+tool_name）、event（打断事件：已播/未播内容），以及 user input+advice 拼接数组。
- 来源：https://bytedance.larkoffice.com/wiki/XRuKwJ0VPisdUhkxH0ecY1rRn9g 【已确认 PRD 口径，上汽 DNA】

## 2. Director 输出结构（与副本 action_list 一致但更完整）
- talk_or_not / talk_content / emoji_id / action_list（action_id+action_content+tool_name）。
- 模型名按车型分：上汽 `planner.task.analyze_text_saic_dna`、赛力斯 `planner.task.analyze_text_seres`。
- 来源：d03 同上【已确认】

## 3. Director 对客架构图（画板亲验）
- user query + advisor input → Director（流式对话响应 → 任务拆解 → 结构化任务序列 task1/2/3；总结和反思）→ tool call → 11 类 agent/tool（车控fc/s2s/poi及导航/音乐/视频/车书/gui/vqa/联网/状态查询/记忆/face id/条件任务）→ tool response（执行结果反馈）回流"总结和反思"。
- 三阶段路线图：Step1 引入 Director 替代意图分类/简单复杂仲裁/NLG；Step2 内心世界/人格情绪/自学习；Step3 更强推理+更小窗口+上限。
- 来源：d03 画板 token KDOyw81n5hosfSbYzvEcaz2In4e / YxUCwdme0hyW7Bb9IWjcqudKnVe【已确认】

## 4. context 结合推理的六大类案例（PRD 给出完整 case 表）
- 结合情景（下雨不开窗/拥堵嘈杂不开窗/后排老人宝宝不开大风量）；结合端状态（空调已最低不调低/车窗已关不关窗/氛围灯已开不开）；结合记忆（不喜欢吹风/讨厌紫色氛围灯/昨天烤鸭店地址）；结合人名改写（"给明骏开座椅加热"→打开副驾座椅加热）；结合方位（"右边一排座椅通风"→副驾+二排右；"我右边窗户"→副驾车窗）；结合人人对话（聊火锅时"附近找个评分高点的"→补全为火锅店）。
- 来源：d03【已确认 PRD 口径】

## 5. 任务类型 × 典型 query 演绎（即时/定时/条件/持续）
- 持续任务要求：可打断恢复、用户已手动操作成功就跳过该功能介绍、用户关注点迁移后不长篇讲当前 part。
- 条件任务合理性仲裁五问：能否被感知/有无触发可能/价值观/可执行性/条件动作是否矛盾。
- 来源：d03【已确认】

## 6. 打断恢复信息回传 DT 的完整两态示例
- 已被拒识 event 示例与未被拒识的 last_talk_content+query 示例；dt 判断后续交互。
- 来源：d03【已确认 PRD】

## 7. 性能目标
- P50 首 token ≤500ms、P90 ≤800ms（与副本现有口径一致，可交叉确认）。
- 来源：d03【已确认】；d11 给出上汽 DT 上线节奏：2.1lite 10/20、两次模型 10/23 与 11/6、上汽 DT 上线目标 11/20【计划口径】

## 8. Director 现存四类问题（逐字稿，badcase 走查素材）
- PE 变长性能不稳定：POI 返回顺序与播报顺序不一致、多任务混合丢中间项、编造用户记忆幻觉；上游 context 召回（记忆滞后/向量召回不全）；下游工具能力层次不一（GUI 类特殊格式调试贵，AI Navi GUI 生图）；缺工具结果 mock 能力污染记忆历史。
- 来源：https://bytedance.larkoffice.com/docx/LKeJdGB8ZoiZD3xDsEocvnnHnBg【会议记录，当时现状】

## 9. Planner 架构定位的演进口径
- 句法 RAG（毫秒级、规则、可车厂配置）→ 情景 RAG+仲裁 → Planner；前期 Planner 当 teacher 回流数据训练 RAG 闭环；模型 doubao-1.8 效果优于 kimi-k2，s07 用 kimi、12.18 s08 切 doubao-1.8；Planner 特殊工具 plan describe/search memory/search env status/plan update。
- 来源：https://bytedance.larkoffice.com/wiki/K8Ihw3a4niaDNck7FEkcDXcOnfb【已确认设计方向】

## 10. 多车型 knowhow 数值（赛力斯 M9）
- 空调 16.0(lo)-31.0(hi) 步长 0.5；前排风量 9 档（0-9）后排 7 档（0-7）；座椅通风/加热/按摩位置=主驾/副驾/左后/右后；媒体音量 20 以上影响对话、35 吵、50 刺耳；氛围灯 6 色。
- 来源：https://bytedance.larkoffice.com/wiki/GlZhweru4i6naMkbGv4czFeFnGo【已确认，赛力斯 M9】
