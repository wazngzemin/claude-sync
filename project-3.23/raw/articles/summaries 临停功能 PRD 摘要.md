[summaries] 临停功能 PRD 摘要
临停功能 PRD 摘要
来源：PRD-智能座舱.md（64KB），版本 v1.0，2026-03-31
产品定位
豆包车载 AI 助手的临停（临时靠边停车）功能，覆盖智驾场景下三种停车模式：即时临停、条件临停、目标临停（POI/视觉/手势）。
三大场景


场景

触发方式

路由

延迟要求

即时临停

"靠边停车"

句法RAG → directExecute

≤ 3s

条件临停

"到了下个服务区停"

情景RAG → Planner → condition_monitor

条件触发后 ≤ 3s

目标临停

"在前面星巴克停" / "在大树旁停" / 手势+语音

情景RAG/云侧Planner

≤ 5s
核心架构决策
即时临停不过 Planner——句法 RAG 直接调 pullover_execute，保证 < 500ms
条件临停用工程侧状态机——不依赖 Planner LLM 多轮记忆（决策#3）
POI 有编码走地图，无编码走 VLM——双通路分流（决策#1）
手势必须配合语音——纯手势不触发，安全考量（决策#4）
"对面停"就近同侧——跨车道不执行（决策#5）
新增 5 个 Tool
poi_search → visual_reference_detect → gesture_direction_resolve → condition_monitor → pullover_execute
详见 → pullover-tools
状态机设计
每个场景独立状态机，详见 → pullover-state-machines
里程碑


里程碑

交付内容

M1

即时临停全流程 + pullover_execute Tool

M2

条件临停 + POI 目标临停

M3

视觉参照物 + 手势多模态

M4

全场景异常降级完善 + 评测达标
评测覆盖
51 条评测 Query（即时 17 + 条件 17 + 目标 17）
30 种异常降级路径（5 场景 × 6 种）
7 张 Mermaid 流程图
5 个 Tool JSON Schema 完整定义
已锁定 9 项决策 + 5 项开放问题
详见 PRD 原文 §7
关联页面
pullover-feature
query-routing
pullover-state-machines
pullover-tools
director
planner
