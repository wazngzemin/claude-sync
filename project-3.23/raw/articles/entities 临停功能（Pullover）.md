[entities] 临停功能（Pullover）
临停功能（Pullover）
定义
豆包车载 AI 助手在智驾场景下的临时靠边停车功能。横跨语音交互层、Planner 决策层、工具执行层和智驾控制层。
业务流
用户语音/手势 → ASR/手势识别 → Query 路由 → Tool 调用 → 智驾 Action → HMI 反馈

MVP 范围
纳入
即时临停全流程（句法RAG → directExecute）
条件临停（工程侧状态机：POI/距离/时间/地理围栏/目的地接近）
POI 目标临停（有 POI 编码走地图检索）
视觉参照物临停（VLM 识别）
手势+语音双模态目标临停
排除
阴凉处/积水处停车（环境感知不足）
纯手势触发（误触率高）
"对面停"跨车道（安全风险）
Planner LLM 多轮记忆维护条件状态（不稳定）
多条件并发监控（MVP 仅单条件）
成功指标


指标

目标值

即时临停识别准确率

≥ 95%

条件临停匹配准确率

≥ 90%

目标临停端到端成功率

≥ 85%

即时响应延迟

≤ 3s

目标响应延迟

≤ 5s

异常降级 TTS 覆盖

100%
架构约束（AC-1~AC-6）
5 个新 Tool 与现有 AgentTool 体系兼容
条件状态由工程侧显式状态机维护
POI 有编码走地图，无编码走 VLM
手势必须配合语音
跨车道指令就近同侧停靠
所有异常路径必须有 TTS 降级
关联页面
prd-pullover
query-routing
pullover-tools
pullover-state-machines
director
planner
