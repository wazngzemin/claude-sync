[concepts] 临停状态机设计
临停状态机设计
设计原则
条件临停状态由工程侧代码维护，不依赖 Planner LLM 多轮上下文
Planner 仅在设定条件和取消条件时参与，持续监控由 condition_monitor 工程模块独立完成
所有状态机都有安全检查节点和超时处理
五大状态机
1. 即时临停
IDLE → COMMAND_RECEIVED → SAFETY_CHECK → EXECUTING → PARKED
                                            ↓ (不安全)
                                        DEFERRED → EXECUTING
PARKED → (继续/超时15min) → IDLE

句法 RAG 匹配后直走 directExecute
不安全时延迟至最近安全位置
2. 条件临停
IDLE → (Planner注册条件) → MONITORING → CONDITION_MET → EXECUTING → PARKED
                                ↓ (超时/不可达)          ↓ (不安全)
                        CONDITION_EXPIRED           DEFERRED

工程侧独立运行，不占 Planner 资源
单条件，超时 1h 自动取消
路线变更时重新评估可达性
3. POI 目标临停
IDLE → POI_SEARCHING → POI_FOUND → APPROACHING → SAFETY_CHECK → EXECUTING → PARKED
              ↓ (未找到)
        POI_NOT_FOUND → (重新指定/放弃)

有 POI 编码走地图检索，无编码走 VLM
POI 在对侧时就近同侧停靠
4. 视觉参照物临停
IDLE → VLM_DETECTING → REFERENCE_FOUND → APPROACHING → SAFETY_CHECK → EXECUTING → PARKED
              ↓ (失败/低置信/距离过远)                        ↓ (禁停)
        DETECTION_FAILED / LOW_CONFIDENCE / OUT_OF_RANGE  FALLBACK

VLM 端侧推理延迟 < 2s
夜间/恶劣天气降级为 POI 搜索
5. 手势多模态临停
IDLE → (检测手势) → 有语音? → GESTURE_RESOLVING → DIRECTION_CONFIRMED → TARGET_SEARCHING → EXECUTING → PARKED
                       ↓ (无语音)        ↓ (模糊)
                  VOICE_PROMPT      CLARIFY
                  (5s超时→IDLE)

强制双模态，纯手势 5s 超时回到 IDLE
手势+语音矛盾时以语音为准
关联页面
pullover-feature
pullover-tools
query-routing
