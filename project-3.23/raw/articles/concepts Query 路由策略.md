[concepts] Query 路由策略
Query 路由策略
定义
系统处理临停相关 Query 的三层路由机制，根据语义复杂度选择不同处理通路，在延迟和智能之间做平衡。
三层路由
L1：句法 RAG（即时临停）
适用：固定句式（"靠边停车"、"停一下"、"让我下车"）
处理：关键词 + 正则模板匹配 → directExecute 直接调用 pullover_execute
延迟：< 500ms
关键：不过 Planner，保证紧急停车最低延迟
降级：句法未命中 → 无感降级到 L2 情景 RAG
L2：情景 RAG（条件/POI 目标临停）
适用：语义匹配（"到了下个服务区停"、"在前面星巴克停"）
处理：语义匹配 → Planner pipeline
延迟：< 1s
覆盖：有 POI 编码的请求、条件类请求
L3：云侧 Planner（视觉/手势/复杂组合）
适用：需要 LLM 推理的场景（"在大树旁停"、手势多模态）
处理：完整 LLM 推理链
延迟：1-3s
场景：视觉参照物、手势多模态、复杂条件组合
设计哲学
安全关键场景走最快通路：即时临停不经过 LLM 推理
语义复杂度决定路由层级：越复杂越深
降级方向单向：L1 → L2 → L3，不可逆
对现有系统的影响
新增临停句法模板为独立规则集，不影响现有句法 RAG 规则
Planner prompt 更新后需回归测试现有 Tool 调用
关联页面
pullover-feature
pullover-tools
director
sp-compression-strategy
