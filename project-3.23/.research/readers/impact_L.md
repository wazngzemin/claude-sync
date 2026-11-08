# 14 L 端侧触发与本地闭环 — 资料里有、副本需补/修正的事实点

## 端侧触发器三通道（副本 L 画板未拆出这三条通道）
- **触发推理通道**：触发器→VLM SDK，下发运行推理指令。
- **控制通道**：VLM SDK→触发器，状态回调 success/empty/timeout/failed。
- **数据通道**：VLM SDK→数据中心，完整 JSON 按 topic 发布。
- 来源：端侧触发器 PRD docx Q1RBwsEuliWvk6kv8Jxc1JB7nEc。【2.6目标·赛力斯】

## 状态回调分两层（副本没画这个同步/异步区分）
- 触发状态（同步）：调用当下立即回指令送达没（成功/失败）。
- 工作状态（异步）：VLM 跑完 1-2 秒后回调执行成败（已启动/success/empty/timeout/failed/已停止）。
- 用途：确认开关真生效、OneShot 重试决策（timeout/failed 重试一次→二次失败停止+告警）、超时守卫释放互斥（VLM_FRONT 摄像头）、异常告警上报、维护任务状态表。
- 来源：端侧触发器 PRD。【2.6目标】

## AlwaysOn 三任务与开关链路（副本 N2 有 AlwaysOn，但没画端侧任务启停状态机）
- 三任务：舱外 AlwaysOn（前视 caption，3s 周期）/舱内动态（5s 周期）/舱内静态。
- 开关条件：power==on && Awake Button 开 → start；power==off 或 Button 关 → stop。
- 画板 PrmxwnAVFhcbinbME9NcRJxjnzb 画了舱外/舱内两条状态机分支。
- 来源：端侧触发器 PRD。【2.6目标·赛力斯】

## 雾天雾灯完整案例（可作为 L 章贯穿案例补全）
- 系统上电→端侧触发器加载预置规则→读上电信号→power==on→开 AlwaysOn→组装运行指令（task_id/camera=前视/priority=P3/timeout=3s/mutex_group=舱外任务组/execution_type=周期）→同步调 VLM SDK→前视拍帧→VLM 推理→控制通道回状态→数据通道发 topic→数据中心整包透传→云端端状态解析→注入 Context/Advisor。
- 规则1：vLM 舱外天气=雾天 AND 后雾灯=关闭 → 开雾灯；规则2：vLM=非雾天 AND 后雾灯=开启 → 关雾灯（恢复策略）。
- 来源：端侧触发器 PRD 画板 UG6RwjlBdh8QCobrIe9cUugsnni。【2.6目标·赛力斯】

## 上传异常分级（副本没画）
- 周期类（时效优先）：网络异常丢积压包，仅轮询上报最新。
- One-shot 类（成功率优先）：漏传自动补传，断网本地暂存，恢复后断点续传。
- 来源：端侧触发器 PRD。【2.6目标】

## 端侧功能清单优先级（副本 L 章可作路线图）
- P0 AlwaysOn 任务开关管理；P1 天气端侧自闭环（雾灯/湿滑/雪地）/任务中心管理/SP 拼接/动态 Advisor 视觉任务下发/VLM 结果解析/语义条件判断；P2 充电桩链式触发（R→P+oneshot VLM）/地理围栏/本地定时器/规则接收+本地持久化。
- 来源：端侧触发器 PRD。【2.6目标·赛力斯 804】

## 待核
- 任务中心开关不需要告诉云端（逐字稿 Mijvdy2hJo9Pv5x1ATRcvn0BnEe）——与 G 章"端云同步"是否冲突待核。
