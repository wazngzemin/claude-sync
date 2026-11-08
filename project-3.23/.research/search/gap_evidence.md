# 豆包汽车 缺口主题证据（第四轮，全部带出处）

> 本轮从知识空间 space 7554961122303098899 递归遍历得 953 节点，逐篇精读 gap 相关 OnePager/技术方案。状态：已读全文/部分阅读。

## 1. Advisor Creator / 动态 Advisor / Goals
- **静态 Advisor**：位置=aidv_trigger 识别机会→Extour 生成建议→AIDV 校验下发→Planner 规划执行。配置四要素=条件/动作/执行策略(总次数/单日/单次上电/间隔频控)/生效范围(测试车辆ID)。渠道差异：saic-dna 复用主对话；seres 增加 AI Bar 交互与结果回传。条件判断："有变更"=新值≠旧值，"变更为"=新值=目标值，不分析连续趋势。接口：车端 POST /aidv/v1/vehicle/resource，Extour POST /aidv/v1/recommend (source=static_advisor)，车端回流 vehicle_recommend_id，缓存 1 分钟。出处：静态 Advisor One-pager https://bytedance.larkoffice.com/wiki/Hzq8wR285io8qxkFYGscs5EAnMg 【已读全文】
- **动态 Advisor / Goal**：Goal 位于主对话与 Extour 目标引擎之间；Planner 选长时任务工具 add_goal/delete_goal 创建取消；Extour 维护目标判断触发；AIDV 回调经 Frontier 下发。Goal vs trigger：Goal 是持续管理目标，trigger 是其中一次触发通知，每次触发生成独立 recommend_id，循环 Goal 可多次触发。goal_status: creating/pending/running/done；scene 枚举: 出行/服务/娱乐/舒适/情感/内容/其他；component_type: button/switch。接口：/goal-list、/goal/detail、/goal/operate、/goal/lifecycle_callback(成功卡/失败消息/推荐消息三类)。出处：动态 Advisor One-pager https://bytedance.larkoffice.com/wiki/VvAMwHbxei6BSEkzoxjc9AbynNh 【已读全文】
- **Goal List 接口字段**：POST /aidv/v1/goal-list，channel=saic-dna，channel_app_id=99220，vehicle_type=ROEWE；goal_id int64 / goal_text / goal_detail / goal_headline / goal_sketch / icon_url / enabled。出处：https://bytedance.larkoffice.com/wiki/ExtGwiADMijNBDkXo2Xcmocdncg 【已读全文】
- **静态 Advisor 来源标识与 ActionList 透传**：单独文档 Es9YwYYRzijcWBkNJSyc20P6nyh【仅扫元数据】

## 2. 简单/复杂判断与介入判断（Director 快路径）
- Planner 在 Flow 编排中被**预启动**，基于 cloudwego/eino 的 ReAct 图。规则与简单意图在到达它之前被快路径截断：句法 RAG / SimpleIntent 规则快路径、Recommend 回流、intent_and_refusal 拒识命中即 cancel 预启动的 Planner，只有 AlwaysPlannerProcessor(OEM 强制)或最终回退 PlannerProcessor 放行，复杂任务才进完整闭环。DoPlan 等 MsgKeyPlannerContinue 信号。出处：AIDV Planner One Page https://bytedance.larkoffice.com/wiki/EWziwFVftiGvnlk0FA4cadqonud 【已读全文】
- 输入预处理：四音区 query 经 Redis 合并；操作手册类 IntentOperationManual 改写为"请查询后回答:…"；keepCheckShouldBreak 每 100ms 轮询新 query 打断，首 token 后不再打断。旁路异步：querySummary/RelevanceCheck，相关性结果流结束最多等 20ms。同上。
- 同主题相关：座舱 Planner 探索 K8Ihw3a4niaDNck7FEkcDXcOnfb、浅谈座舱 Planner 评测体系、云端和 planner 并行车控 sft 模型【仅扫元数据】

## 3. Context 筛选打分压缩 / 架构演进
- Context 服务管理 9 类上下文源：情景描述(多模态)/事件日志(结构化)/短期历史压缩(上文压缩)/短期情景记忆(分钟或轮次)/长期情景记忆(按天时间线)/长期语义记忆(偏好自然语言)/用户画像(结构化标签)/端状态/联网基本信息。出处：Context OnePage https://bytedance.larkoffice.com/wiki/OjGMwBX8fiLS0ikDWqVceVjhnPg 【已读全文】
- **V1→V2 演进**：V1=写入-粗筛-精筛三步式，问题=集中式单一模型限输出 5 个有位置偏好(此源涨彼源降)、速度不达标(目标 P90 800ms 实际 1.2s，端状态筛选调两次模型是瓶颈)；V2(当前)=预注入+动态检索两阶段，筛选权下放各源。同上。白板 LDONw7Ujwhcsd3bWWjgcoqVlnfg【未导出预览】
- 配套：服务端技术方案【Context 优化 v1.0】JX3nwExopitdpKkToqdcv1hTnHT【仅扫元数据】

## 4. 动态示例平台 / 动态知识（Advisor Creator 类）
- **动态示例 scenario_sample**：基于 VikingDB 的 Few-shot RAG，按 query 语义检索 Top3 最相似 SFT Case，解决长尾 badcase 降 SP token；VikingDB+MySQL 双写补偿；pre-query 并行检索；SearchByText 文本+向量混合；注入 SP 变量 scenario_sample。
- **动态知识 knowledge**：基于 LLM Routing，小模型 Seed-2.0-mini 根据近两轮对话选场景 SOP(儿童安抚/车内观影/急速调温等 8 大核心场景 skillConfig)；director.prompt.select_skill 函数；注入 SP 变量 knowledge。
- 差异：动态示例=教模型如何调具体工具(原子案例)；动态知识=高阶业务逻辑多步骤 SOP。出处：动态示例与动态知识技术方案 https://bytedance.larkoffice.com/wiki/EIc5w4ljUiMeyEktcuycaB6In1f 【已读全文】

## 5. 链路性能 / 端到端耗时
- 0615 alex 实车：云端全流程 AVG 2550ms，合计 3310ms；ASR 结束到 TTS 开播 avg 3000ms，与云端差 500ms。
- 节点 AVG：VAD 500(固定) / ASR 完成 300(火山) / 上行 100 / 豆包 Chat 300(安全历史) / 云端其他 100 / 拒识 210(混合拒识全流程不含流式, 1/10 命中 soft vad 扮跑) / Context 除抢跑 250(1/10 命中 soft vad 抢跑) / Planner 首字 900 / TTS 首帧 450 / TTS 空音频帧 200。
- 0525-0528 上汽实车：P90 合计 7400ms，P90/AVG=2.03x；ASR P90 780 / 拒识 P90 740 / Context P90 850 / Planner 首字 P90 近 3s / TTS 首帧 P90 850。出处：端到端性能分析 https://bytedance.larkoffice.com/wiki/Sni4wDPIcizfHTkP0N4ccbq6nbg 【已读全文】
- 配套：AI 汽车 metrics 耗时打点指南、Trace 建设(AIDV 端云 Trace 数据与传输协议 KXIZwcX9JipRJdkmemyc0d9nn4b)、耗时周报【仅扫元数据】

## 6. 触发器 / 任务 / 模拟器
- 三类触发：条件触发(信号当前快照或"变更为"目标值)/定时触发(单次+Cron 周期)/推理触发(VLM 语义判车内视觉，如后排婴儿哭闹、儿童是否在车内)。四要素=条件/动作/执行策略/生效范围。边界：不做连续趋势(温度持续上升)、不自解析复杂规划指令。动作=Advisor 主动推荐或业务回调。出处：触发器 OnePage https://bytedance.larkoffice.com/wiki/Xk6xwM3l8iK4oCkXIMlcIo4hnFc 【已读全文】
- 配套：触发器 DSL 定义、触发器二期/定时功能/生产事件日志/推理触发、触发器端侧技术方案、模拟器 OnePage【仅扫元数据】

## 7. 工具执行三类 / Agent Server / 三方 Agent / GUI Agent
- **Agent Server**：最底层，对外通用方法调用各类 Agent，屏蔽细节；不负责 Planner 编排(LLM 调度模块管)。管理面(Agent 定义/租户隔离 channel+channel_app_id/版本环境/动态工具信息 Director 可见性)；控制面(工具发现准入 Planner 可见性过滤 DirectAgent 直调/控制指令 Redirect 最多两次 Interrupt/Fallback 无通用重规划/生命周期 Context 取消向下游)；数据面(协议适配 aidv/dpfm/doubao/ecology/internal_rpc；执行通道 HTTP/SSE/Kitex/MCP/Frontier/本地工具)。出处：Agent Server One Page https://bytedance.larkoffice.com/wiki/AQxOwJet9ieV5bkstANcvYHLn5f 【已读全文】
- **GUI Agent**：seed 1.8+自研链路，效果对齐 AutoGLM；无意图识别，独立模块闭环不耦合系统；命令三类=常规(点击/输入/滑动)/CLARIFY(用户输入不清需澄清)/APPROVE(发送需授权)；支持反思回退(发朋友圈误生成长按→反思发现不符→退回上层→短按发图+文)。出处：[技术方案] GUI Agent Init https://bytedance.larkoffice.com/wiki/Loa7wh5lBicqzskWcExcsl7Pngf 【已读全文】白板 Tr66wHONDhDSTebzYj9cv9GanEf【未导出预览】
- 三方 Agent 候选：具身 Agent OnePage JavJwBU4GiwqJrktZ8pcQLUvn2d、AI Navi One Page BClbwRuTtiCMHskj1p0cOYX6n2c、场景(含三方智能体)NDM3w3pyBiYIifkTmm9coNtenob(占位)【仅扫元数据】

## 8. 离在线仲裁 / 拒识 / 端侧
- 端侧离在线仲裁：客户端采集 N*Mic+N*Ref，离线语音 VehicleSpeech SDK 拆解每路 mic 做 WakeUp ASR；唤醒后豆包 APP 建 RTC/IM 通路+启动离线对话模块。难点：云端 VAD 须与端侧一致(否则 Speech 无法判停卡 RTC 超时)；端云同一轮任务靠 taskId 串联；端侧收云端任务三路径 Frontier/IM/RTC，云端先到需 block 等端侧 LLM。出处：端侧离在线仲裁技术方案 https://bytedance.larkoffice.com/wiki/PtGPwsX4iiFDAEkKMNYcUYYjnPh 【已读全文】
- 拒识(CztmwYrnsi7wlBkVaUPcP4bQnrV)：空占位文档【打不开/无内容】

## 9. 输入管理（M）
- Input Manager 位于输入入口与 Director 之间，将并发/乱序/多源输入组织成可串行执行的 Director 调用；同 Chat 同一时刻只允许一次 Director 执行。输入源=用户 Query/模拟 Query/主动消息/有效 Event/工具 Feedback。收敛：Adapter 标准化统一准入排队、统一结构化播放事件(开始/时长/完成/打断)、DirectorExecutionID 统一、Redis 原子许可裁决。出处：输入管理模块设计 https://bytedance.larkoffice.com/wiki/UsHgwkm2Sig3blkAttBclYb0n4g 【已读全文】

## 10. 记忆 / 身份 / 账号
- Context OnePage 已列 5 层记忆(瞬时事件日志/短期情景/长期情景/长期语义/画像)。记忆相关资料 MF9BwiTKWi19oUkmPHDcLkZsnLe、记忆 OnePage KAAMwb7vsiHpd0k7PVPctGfKnHf、MOA vs Mem0 记忆方案对比 D8crwA4BziukVYkbHQqcTsLRn6c、账号 QDEAwVNPziKwNekzTtHcmtOtnRU / AI 汽车账号与乘客 One Page QRhWwLLShiF5jIkuygfcc353nje【仅扫元数据，本轮新增定位】

## 11. 手车互联 / 运营 / ToB / 火山分工 / 车企协作
- 豆包互联@西钺 UV04wBqh7i1tluk28UVctf3DnjT、运营平台@韩杰 V67DwMn14ibvwckaZQrc9qvVnFd：父节点占位，正文未展开【仅扫元数据】
- Goal List 接口域名 api-vehicle.volcengine.com(火山)、ppe_aidv_advisor 环境——印证豆包/火山分工：AIDV 部署在火山引擎，渠道 channel_app_id=99220 对应上汽 DNA。出处：Goal List 接口文档
- 车企协作：seres 走 AI Bar 交互+encrypted_doubao_uid；saic-dna 走主对话回流。车企交付(研发/客户端/车企交付)【仅扫元数据】

## 12. 2.6 Roadmap / 各 FT 目标
- 继承 W3 结论：7 FT 分组 S5(11.14)-S11(2.6)；本轮空间树未新增独立 Roadmap FT 文档(产品规划/Roadmap@嘉锋、战略目标@张航 未展开读)【仅扫元数据】

---

## 13. OnePager 内嵌画板亲眼看笔记（第五轮，9 张全看）

> 来源：副本各章"原文入口"指向的 9 张 OnePager 内嵌画板，已用 whiteboard +export preview 导出逐张亲眼看（wb/ 目录同名 .jpg）。每条注明节点/分支/颜色，以及应被副本哪一章引用。

### 13.1 AIDV Planner 主链路总图（PaDGwv0L7hKa06biwdWcDfe8nEc）
- **分区**：端侧(座舱App：座舱SDK/豆包SDK)｜座舱云(云端数据中心：事件/状态/端侧历史/VLM + Context)｜豆包云(flow.im.conversation/flow.chat.gateway/flow.chat.alice.chat/Agent)｜座舱云(ASR→火山引擎豆包语音产品；TTS→Speech云 Sami/S2S)。
- **三色链路（颜色即语义）**：蓝色实线=Query 交互主链路；黑色实线=触发器主动推荐；红色=Advisor 主动推荐。
- **主链路数字标号**：0.事件上报(HTTP)/0.获取会话ID → 1.ASR → 1.0 检索数据(Context) → 1.1 下发建议(Advisor) → 2.0 文本链路(HTTP&SSE) → 2.1 文本请求 → 2.2 Query→Gateway→动态RAG匹配→句法RAG → 2.4.1 简单/复杂分类·拒识判定 → 分类相识 → 2.4.2 Planner 拆任务 → 2.4.3 构建上下文 → Planner(橙色高亮) → 2.5 Agent 工具调用 → Agents Server → 2.5.1 豆包一方工具/2.5.2 座舱自工具/2.5.3 S2S工具/2.5.4 外部Agent → 2.6 生成TTS；2.5.2.2 车况指令下发。
- **Advisor 子图**：Advisor→Watcher→目标管理；触发器→1.0 同步数据→2.0 下发建议 query/任务id→1.1 下发建议。
- **应引用章节**：D/Director 总图章、G/云端触发器章、S/Advisor 章、E/工具执行章、C/Context 章。这是全系统主链路唯一一张端云全景图。

### 13.2 Agent Server 在链路中的位置（VzZKwVM23hkH45bCtw9cUh6qnYl）
- Client→豆包Server→座舱Gateway→Planner→任务调度→**Agent Server(红高亮)**。Context 虚线同时喂 Adviser 和 Agent Server。旁路：S2S 链路、其它链路(直接调用指定Agent)→Agent Server。输出三类：生态Agent/座舱Agent/豆包Agent。
- **应引用章节**：E/工具执行章。

### 13.3 Agent Server 三层架构（YlygwKteZhzMXDboatPcLOr2nDb）
- **接入层**：座舱 Planner、座舱 Context。**框架层**：Agent/Tools 信息管理(注册/反注册、基础信息维护、信息获取) + Context 获取(历史/长短期记忆/端状态/SysPrompt 更新/UserPrompt 更新) + 协议转换(内部协议↔豆包/座舱/生态 Agent 协议) + 观测模块(LLM Trace/Metrics/Log)。**基础设施层**：Redis/RDS/Frontier/Maas/Fornax/Logs-Metrics。
- **应引用章节**：E/工具执行章。

### 13.4 Agent Server 总体流程（Ls4lwkItyhtSMab93izc2urXnhh）
- 任务调度→预处理(Agent 信息获取→Context 信息获取→请求参数简化→加转换后处理 Process)→按 Agent 信息匹选 Executor **并行**调用：豆包Agent Executor(调豆包服务接口)/座舱Agent Executor(调DPFM服务)/三方Agent(HTTP)Executor(调三方服务)/内部Executor。后处理=通用Processes→特殊业务Processes→Agent历史存储→回任务调度。Agent 信息←管理平台维护。
- **应引用章节**：E/工具三类章（控制/查询/复杂 agent 的执行分流在这里）。

### 13.5 GUI Agent 整体架构（Tr66wHONDhDSTebzYj9cv9GanEf）
- **云端 Task Manager**：激活任务→Context 召回整理(Planner 不是主线 planner；输入 SysPrompt/Query/History/ScreenShot/Few Shot黄块/Location/AppList/VehicleInfo)→call VLM(UI-Tars + CoT)；旁路规则加速 RPA→Result(Thought→Action)。**State Machine**：Active/Pending/Completed/Timeout/Max step/Security。存储 History/Knowledge/UserProfile/Sample/TOS。
- **客户端 Exec Engine**：tap/double_tap/long_press/swipe/input/scroll/open_app/back/home + Clarify/Approve/Handoff。手车互联&投屏反控+小程序；14.Log→Sample 闭环。
- **应引用章节**：N8 GUI Agent 章、G 章（RPA 旁路加速）。

### 13.6 Context 选择/压缩 V1（LDONw7Ujwhcsd3bWWjgcoqVlnfg）
- 调用方(agent/planner)输入 query + vehicle_user_id→context 模块→读取五路(长期记忆/短期记忆/端状态/联网信息/etc)→按定制需求做总结→回调用方。这是 V1 粗筛精筛，五路并行。
- **应引用章节**：C/Context 章。

### 13.7 端侧离在线仲裁·客户端架构（KF8qw4R0vhwJPDbbou0ckqDEnih）
- 豆包APP AI Service：VehicleDialogueManager(DialogConfig/SessionHandler/HistoryHandler)→OnlineHandler(在线逻辑) vs LocalLMHandler(端侧模型输出)→**Arbitration 仲裁块(ArbirationStrategy + WhiteList白名单 + TaskAlignHandler任务对齐)**→DialogueTaskDispatcher。NovaService→Flow AV SDK→Speech/Video/Message/RTC-SAMI Link/IM/RTC SDK。
- 云端：豆包Server火山网关数据转发→Speech Gateway(供应商ASR粉块/Doubao ASR虚线/TTS/Speech V3 Strategy)→Flow Engine(通话状态感知/RTC交互/链接状态管理/音频交互)。弋途车控Server(车控SDK Adapter/车控Service)。
- **三通路**：RTC Gateway 上行信令、文本 Http&SSE(Message)、Frontier(FC) 下行。
- **应引用章节**：R/离在线仲裁章、M/输入管理章。

### 13.8 触发器系统与三类业务链路（KvUUwo9phh9auXbwm8Ecbg9Dnag）
- 核心：[核心服务]触发器(场景匹配·调度·推理判断·动作执行)；依赖=管理后台(入口)/ByteScheduler(定时延时)；任务系统(注册场景/转发/定时上报)、端状态(上报)、端侧VLM(上报)、Context(注入)；弋途侧=静态Advisor/动态Advisor。
- **三条链路（颜色即类型）**：条件触发(蓝：管理后台/动态Advisor/任务系统三入口注册→端状态上报→触发器匹配→执行)；定时触发(紫：任务系统注册→触发器向ByteScheduler建任务→回调→执行)；推理触发(绿：任务系统注册→端侧VLM定时上报→任务系统转发→触发器推理判断目标达成→执行)。
- **应引用章节**：G/云端触发器章、L/端侧触发器章、S/Advisor 章（动态 Advisor 注册场景是触发器入口之一）。

### 13.9 端侧离在线仲裁·业务交互时序图（Nuu3wIyWFhUQOQbziC9cY4J1n9e）
- 泳道：车机系统/WakeUp/VAD/ASR/Office Dll/仲裁模块/AI Service/RDK/Speech Server/Agent&Chat。
- **两条采纳路径（黄底"白名单检出&采纳离线策略"块内）**：路径1=自名单检出成功，端侧 LLM 引擎直接出 FC 结果，经 IM/Frontier 返回(带 requestid)；路径2=端侧处理不了，**Block 住等待云端结果仲裁**，云端回后更新上下文再走 FC。另有"黑台线 ASR 仲裁 + ASR 纠错"红块。
- **关键分支**：端侧 FC 协议先问"能不能处理/车控协议"，能走路径1、不能走路径2——这就是介入判断/离在线分流的运行时裁决点。
- **应引用章节**：R/离在线仲裁章、D/简单复杂判断章（端侧先判、云端兜底的运行时依据）。
