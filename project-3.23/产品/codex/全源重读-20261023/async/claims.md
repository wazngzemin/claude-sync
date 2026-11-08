# 异步任务、触发器、视觉和输出：入图业务证据

日期：2026-10-23。本文件是逐条业务证据，不是全域文档已经读完的声明。inventory.json 单列正文审读、代码未审计、部分返回、仅抓取、访问失败与图像可视核验。数字目标和方案均不等于上线结果。

## C01 任务必须按渠道分叉，不能合并为一套新旧架构

- 实施状态：OnePager 当前范围，不是全渠道统一能力。
- 业务输入→判断→下游：Seres：Director 把可延期诉求交给自建 Task Service；服务负责任务规格、生命周期、每次执行记录、触发注册和任务视图。saic-dna：AIDV 调 Extour Goal；Extour 管 Goal 与条件，每次到点回调推荐，再经客户端回到 Director。“替代动态 Advisor”只在 Task Service 文档指定的 Seres 范围成立。
- 回调、失效与失败：把“十分钟后关加热”分别走一遍两渠道。创建、条件命中、建议消费、工具执行、UI 结束必须各自找到证据，不能用 add_goal 的 creating 当车辆已执行。
- 产品关键问题与验收：必须核对：渠道路由由谁决定？同一用户跨渠道是否迁移？验收指标应按渠道分别统计创建成功率、命中后建议到达率、真实执行成功率。
- 来源：[A03 Task Service OnePager](https://bytedance.larkoffice.com/wiki/A60Zwzy9eiiCtwkY8k2c0LKKnoc)；[A04 动态Advisor OnePager](https://bytedance.larkoffice.com/wiki/VvAMwHbxei6BSEkzoxjc9AbynNh)。原文保存在 bodies/ 对应编号。

## C02 Seres Task 是长期目标，Run 是一次执行

- 实施状态：一期技术说明；二期 Runtime/Script 明确未实现。
- 业务输入→判断→下游：创建时先理解和校验目标，再落任务、注册 Trigger，返回已创建；任务等条件，不占用一次对话一直推理。条件到达后验回调和执行前提，开一次 Run，下发 Recommend/Frontier，客户端回传推荐 ID 后 Director 才调用工具。周期任务的下一次触发开新的 Run；GUI 多步骤可同 Run。
- 回调、失效与失败：工具结构化结果更新 Run、写结果，再按次数/时间 EndPolicy 决定终止或继续等候。Run done 不等于 TTS 播完；任务视图通知失败不回滚任务。二期事件恢复、脚本 Runtime、复杂长运行不可画成现行稳定能力。
- 产品关键问题与验收：追问：一次失败算消耗执行次数吗？取消与回调并发怎么处理？指标：有效回调到 Run 创建率、Run 成功率、结果落库率、结束清理成功率；阈值未给。
- 来源：[A03 Task Service OnePager](https://bytedance.larkoffice.com/wiki/A60Zwzy9eiiCtwkY8k2c0LKKnoc)。原文保存在 bodies/ 对应编号。

## C03 上汽 Goal 的创建成功和创建失败走不同输出

- 实施状态：2026-09-08 OnePager 的 Extour Goal 路径。
- 业务输入→判断→下游：Director 调 add_goal 后，creating 只表示受理。Extour create_success 回调可直接发 Goal 卡片、不进入 Planner；show_card 决定卡按钮。create_failed 则把原因变成 recommend，客户端回传后由 Planner 向用户说明。触发回调也转 recommendation，带 goal 和建议。
- 回调、失效与失败：因此不能把所有任务回调都画成直接 TTS，也不能把创建卡片等同于条件达成。推荐 request 缓存 60 秒、recommendation 缓存 10 分钟是该版本链路口径，不能推广成全系统 TTL。
- 产品关键问题与验收：追问：create_success 卡没到时谁可查询恢复？指标按创建回调、卡片显示、推荐回流、真实执行四层分开。
- 来源：[A04 动态Advisor OnePager](https://bytedance.larkoffice.com/wiki/VvAMwHbxei6BSEkzoxjc9AbynNh)。原文保存在 bodies/ 对应编号。

## C04 消费、关闭、UI done、执行完成是四种不同状态

- 实施状态：Extour Goal 接口现状及 TODO。
- 业务输入→判断→下游：recommend consumed 表示建议已经进入 Planner；并非工具执行成功。close 需要关闭 Extour 目标并发 done。/goal/finish 只同步客户端 done，不改变 Extour 目标。update_goal_by_id 仅有服务包装，缺入口/协议仍 TODO。qa_finish 是对话结束后的异步 QA 同步，非消费确认。
- 回调、失效与失败：相同触发重试应复用去重身份；不同周期触发不能当同一次去重。登录身份校验、触发 occurrence 为正有明确口径。建议已消费回报完整路径仍需根代理架构文档互证。
- 产品关键问题与验收：追问：用户删除后迟到的 callback 是否继续播报？UI done 后下一周期会否仍来？指标：取消后幽灵触发率、重复建议率、消费/完成差异。
- 来源：[A04 动态Advisor OnePager](https://bytedance.larkoffice.com/wiki/VvAMwHbxei6BSEkzoxjc9AbynNh)。原文保存在 bodies/ 对应编号。

## C05 任务中心是展示与管理层，不是执行层

- 实施状态：任务中心 PRD v0.4，10/20 修订；不得当已集成验收。
- 业务输入→判断→下游：三类页签：我的任务、AI 服务、场景预设。我的任务上限 46（20 定时、20 条件、6 长时）；AI 服务和预设无该数上限。列表主显示 running/paused；完整说明把 waiting 写成 creating。早期任务技术方案的 waiting=等条件，不可合成一套状态图。
- 回调、失效与失败：云 push 更新，开机/登录拉取；退出登录明确清长时和条件，并非所有任务统一清空。一期删用户任务/AI 服务、暂停预设；周期任务暂停属于二期。AI Bar 两条边界未定义（>2 显图标、<2 不显）。
- 产品关键问题与验收：追问：46 是创建校验还是 UI 容量？离线删除如何达云？指标：任务列表与后台一致率、幽灵任务率、删除真正停触发率；PRD 没有验收实测值。
- 来源：[A01 任务中心 PRD](https://bytedance.larkoffice.com/wiki/LUKKwMTNaiAd53kdmpkc5oILn5e)。原文保存在 bodies/ 对应编号。

## C06 任务专属视觉与默认 AlwaysOn 是两条链路

- 实施状态：长时视觉技术方案 + 端侧触发 PRD，不代表已提测。
- 业务输入→判断→下游：默认 AlwaysOn 持续出舱内外描述供 Context/Trigger。任务专属视觉由 Task Service 创建 cabin_vision 目标，要求 AlwaysOn 开启且最多 3 个并发目标；既注册语义 Trigger，又通过 Frontier 下发 dynamic_watch_tasks 全量目标列表。
- 回调、失效与失败：新增、修改、删除都替换完整 UP 列表；不能只追加，否则取消的目标留在端侧。每项带 task_id/task_version/target。3 是该任务系统并发限制，不是所有视觉能力数量。
- 产品关键问题与验收：追问：已有 3 个任务再创建如何解释？关闭 AlwaysOn 现有目标是暂停还是取消？指标：目标列表端云一致率、下发到生效时延、旧目标残留率。
- 来源：[A06 TaskService车内视觉长时感知](https://bytedance.larkoffice.com/wiki/QeJkwlVkjiPZYwknFUecrjD9nxb)；[A13 端侧触发器PRD](https://bytedance.larkoffice.com/wiki/Q1RBwsEuliWvk6kv8Jxc1JB7nEc)；[A46 AIVA视觉信号上传端状态](https://bytedance.larkoffice.com/wiki/LwAlwQnmEiAJfDkYDyIcu42dn3f)。原文保存在 bodies/ 对应编号。

## C07 视觉结果先验任务，再逐项进 Trigger

- 实施状态：长时视觉技术方案，20 秒是该入口约束。
- 业务输入→判断→下游：AIService 返回多任务结果及 occurred_at；Task Service 按项调用 TriggerRun，一个失败不能阻塞其他项。已关闭任务只记录、不转发，并补发当前任务列表纠正端侧；超过 20 秒只存不转发。
- 回调、失效与失败：原文旧版本号丢弃规则被划掉，不可当已确定。接口 errno=0 但 forwarded=0、failed>0 可能存在，表示收到不表示逐项成功。异步记录失败不影响已接收业务结果。
- 产品关键问题与验收：追问：终止与结果并发按哪个时间裁决？20 秒端云时钟差怎么校准？指标：有效结果转发率、过期丢弃率、取消后回流率、逐项失败率。
- 来源：[A06 TaskService车内视觉长时感知](https://bytedance.larkoffice.com/wiki/QeJkwlVkjiPZYwknFUecrjD9nxb)。原文保存在 bodies/ 对应编号。

## C08 视觉任务达成后仍需 Task/Director 决定动作与生命周期

- 实施状态：产品/技术设计职责边界。
- 业务输入→判断→下游：语义 Trigger 回调 Task Service，后者沿既有 Recommend→客户端→Director 路径生成播报或工具动作。达到目标、任务关闭或目标对象离开后清目标并更新端侧完整列表；持续关怀可继续，周期汇报由定时触发另管。
- 回调、失效与失败：VLM/判断模型只提供观察或达成判断，不能自行结束所有任务、弹卡、删除目标或执行车控。“孩子睡着了”是事实，是否调小音量、是否提醒、任务是否结束是下游决定。
- 产品关键问题与验收：追问：持续任务的达成一次与最终完成怎么区分？指标：达成后建议到达率、服务动作正确率、任务正确收尾率。
- 来源：[A06 TaskService车内视觉长时感知](https://bytedance.larkoffice.com/wiki/QeJkwlVkjiPZYwknFUecrjD9nxb)；[A14 云端触发器模型解析VLM链路](https://bytedance.larkoffice.com/wiki/AmO3wnzrWiBjE3ks94icc0JjnJf)。原文保存在 bodies/ 对应编号。

## C09 云端语义判断只看文字 caption，不是再看图

- 实施状态：语义判断规格和推理 Trigger 技术方案。
- 业务输入→判断→下游：输入为目标和本次观察文本，匹配对象及座位，只依当前帧；输出“达成/未达成/无法判断”及最多 15 字依据，无置信度字段。证据不够是未达成，发烧/头痛这类本质不可视觉判断目标是无法判断。
- 回调、失效与失败：这三态不能与 Workflow 的 UNKNOWN（缺数据/超时等）混淆。模型不决定通知、任务结束或删除；解析到判断结果可尽早回调，依据只记日志。
- 产品关键问题与验收：追问：目标本身不可判断是在创建拦截还是一直等？指标：达成误报率、漏报率、对象/座位串扰率、不可判定目标拦截率；无默认百分比。
- 来源：[A14 云端触发器模型解析VLM链路](https://bytedance.larkoffice.com/wiki/AmO3wnzrWiBjE3ks94icc0JjnJf)；[A15 推理触发技术方案](https://bytedance.larkoffice.com/wiki/Q11CwtB7mitzckkxmnmcKvIDnNg)。原文保存在 bodies/ 对应编号。

## C10 推理触发的并发与过期策略有版本覆盖

- 实施状态：8/31 技术评审记录覆盖前文；尚无上线证明。
- 业务输入→判断→下游：文档前部有“中断旧请求/保留最新”等设想，评审落款明确不打断、并发推理；第一条达成后标记 scene achieved，不再发新模型请求/动作，等 Task 删除。3 分钟过期拒绝是该层暂定方案，不能覆盖 Task 入口的 20 秒。
- 回调、失效与失败：模型错误报警；费用尚 TODO，上市检查未勾完。Seed 测试模型标识、慢速/turbo 比较也不能画成全部量产固定模型。
- 产品关键问题与验收：追问：并发两个成功如何只回调一次？指标：每次业务触发的推理数、重复达成回调率、过期结果执行率、p95 推理耗时。
- 来源：[A15 推理触发技术方案](https://bytedance.larkoffice.com/wiki/Q11CwtB7mitzckkxmnmcKvIDnNg)。原文保存在 bodies/ 对应编号。

## C11 默认感知有控制状态和观察数据两条回执

- 实施状态：端侧 Trigger PRD + 视觉上云说明；10/15 会议确认基本上云链路已搭。
- 业务输入→判断→下游：SDK 启停模型任务后，一条回报 Trigger 的控制状态；另一条把原始视觉 JSON 经 AIService/DataCenter 上云，进入端状态、Context 与 Trigger。命令接受不等于模型运行；模型运行不等于结果已到云。
- 回调、失效与失败：周期数据弱网丢积压、保最新；单次任务有一次自动重试与离线缓存恢复要求。文档同时说本地即用即弃/不落 DB，缓存范围须澄清。P0/P1/P2 及历史 3 秒示例不能当全局实际频率。
- 产品关键问题与验收：追问：摄像头占用、盒子断联、隐私关闭分别回什么状态？指标：控制成功率、有效观察上传率、观察新鲜度、端侧资源占用。
- 来源：[A13 端侧触发器PRD](https://bytedance.larkoffice.com/wiki/Q1RBwsEuliWvk6kv8Jxc1JB7nEc)；[A46 AIVA视觉信号上传端状态](https://bytedance.larkoffice.com/wiki/LwAlwQnmEiAJfDkYDyIcu42dn3f)。原文保存在 bodies/ 对应编号。

## C12 赛力斯舱内 VQA 不上传图，失败也不转云推理

- 实施状态：赛力斯 VQA 技术选型；不是所有渠道统一事实。
- 业务输入→判断→下游：用户主动问“后排宝宝在干嘛”，先解析需要看哪路，再云端下发 SP/Query，端侧 VQA 直接调 AIBox VLM，文本结果回 Planner。该舱内链路无图片上云、失败不走云端兜底。
- 回调、失效与失败：舱外、LBS、通用识别、观影陪伴等可抓拍/上传 URI 再云工具处理。旧复用 TaskService 的舱内方案已划掉。测试小节与正文对观影/车辆识别有冲突，不能拼成统一方案。
- 产品关键问题与验收：追问：失败用户听到什么、是否重拍？指标：端侧识别正确率、抓拍成功率、文本结果回流率、p95 时延、错误转云率。
- 来源：[A49 赛力斯VQA技术链路](https://bytedance.larkoffice.com/docx/OT9bdwF59oWYaWxhptbceLsunkb)。原文保存在 bodies/ 对应编号。

## C13 云端触发器是唤醒—判断—动作，不是信号一到就执行

- 实施状态：平台改造 PRD/Trigger OnePager。
- 业务输入→判断→下游：配置含范围、条件、Workflow/动作、执行策略。动态条件指变更为，静态条件指当前值；有动态条件时其变化唤醒，否则所有条件唤醒，推理增加视觉订阅；账号切换仅读条件不唤醒。唤醒后仍检查场景范围、条件与策略。
- 回调、失效与失败：例如车已在 D 档，后排后来出现儿童，若只订阅档位变更就漏掉。需要明确谁能唤醒而不只写“档位=D 且有儿童”。空范围可不限，查询失败不能当不限。
- 产品关键问题与验收：追问：哪些输入变更会重算？指标：应唤醒未唤醒率、唤醒后正确拒绝率、跨账号误触发率。
- 来源：[A11 触发器OnePage](https://bytedance.larkoffice.com/wiki/Xk6xwM3l8iK4oCkXIMlcIo4hnFc)；[A19 触发器配置平台改造PRD](https://bytedance.larkoffice.com/wiki/TW0pwbGmyit1KGkVPazcX6mSnYb)。原文保存在 bodies/ 对应编号。

## C14 Workflow 是有向判断图，有独立 UNKNOWN

- 实施状态：配置平台目标方案，未证明全上线。
- 业务输入→判断→下游：条件节点可多输入 AND；推理节点只有一个目标+caption，不拿图片、不调 VQA、不生成用户文案。唯一 Sink，默认 AND；OR 至少两支，一支通过可继续，其他分支不取消，等待收敛并留 blockedBy。
- 回调、失效与失败：缺信号/查询失败/模型超时是 UNKNOWN，不是业务条件不满足的 REJECT。Workflow 保存后只读，修改复制新 ID；模式不允许原地切换。
- 产品关键问题与验收：追问：缺数据重试还是等待下一信号？指标：UNKNOWN 原因分布、节点耗时、重复 Sink 执行率、配置校验拒绝率。
- 来源：[A19 触发器配置平台改造PRD](https://bytedance.larkoffice.com/wiki/TW0pwbGmyit1KGkVPazcX6mSnYb)。原文保存在 bodies/ 对应编号。

## C15 配置发布不等于全部车生效

- 实施状态：平台 PRD 与全渠道权限新需求。
- 业务输入→判断→下游：区分 source 来源、普通/预设场景、车型/车辆/用户范围、测试/生产。预设可在任务中心展示；VLM 配置当前赛力斯，其他渠道不应保存成功。创建权限不自动含全渠道；只有指定管理员可设全渠道，前端禁用+后端拒绝。
- 回调、失效与失败：这是权限需求，不是对所有场景强制审批的证据。执行成功应分保存、注册/发布、目标端生效、下游接收、用户可见、车辆真实结果。
- 产品关键问题与验收：追问：配置复制后旧 scene 清理了吗？指标：配置下发一致率、越权范围拒绝率、灰度命中率、回滚后幽灵触发率。
- 来源：[A19 触发器配置平台改造PRD](https://bytedance.larkoffice.com/wiki/TW0pwbGmyit1KGkVPazcX6mSnYb)；[A23 触发器全渠道创建权限](https://bytedance.larkoffice.com/docx/LIbgdZRw8oCia8xm9bDcB487ndb)。原文保存在 bodies/ 对应编号。

## C16 本地预设：卡片回到原业务，点确认后再验状态

- 实施状态：系统预设框架 PRD；有内部冲突需联合定版。
- 业务输入→判断→下游：本地 Trigger 命中业务条件，业务注册模板、按钮、时效、语音词后发本地卡片，用户确认回到原业务，再检查条件与任务是否还有效，才调用车控并读真实状态。该本地路径不靠 Director 拉取/确认。
- 回调、失效与失败：取消、超时、场景已失效后再说“好的”，不能执行旧建议，应按新 Query 处理。开卡状态与车控 ACK 需区分，不能把所有预设统一改成云端推理。
- 产品关键问题与验收：追问：卡片过期和确认同时发生谁胜？指标：过期确认执行率、卡片点按成功率、确认到真实结果时延。
- 来源：[A21 系统预设任务配置端云框架](https://bytedance.larkoffice.com/wiki/R1OLwyfpTijHw7kQtnbcoZB4nff)。原文保存在 bodies/ 对应编号。

## C17 三项云端预设经 Recommend→Director 确认

- 实施状态：9/15 逐字稿会议结论；不是已上线证明。
- 业务输入→判断→下游：9/15 23:11 决定固定规则场景可由 Trigger 直接调 Recommend，无需先经过 Extour Advisor 推理；25:40–27:03 三项云预设（儿童锁/充电口盖/后视镜）走 Recommend→Director 出确认卡→用户确认。按钮配置由调用方给，Director 产话术，工程包装 UI。
- 回调、失效与失败：31–35 分钟讨论 advice 带策略“语音确认”、real_time_card/buttons。会中澄清 AI Bar 与即时交互卡不是一张卡。旧预设 PRD 直接动作/不确认等段落与会议结论冲突，须按来源版本标注。
- 产品关键问题与验收：追问：不用 Advisor 时是谁维护建议模板？指标：应确认却直接执行率、确认上下文丢失率、否定后仍执行率。
- 来源：[A24 系统预设任务到即时卡链路](https://bytedance.larkoffice.com/docx/QcXmd9dZsox6b8xWc9ocr4IjnPg)；[A21 系统预设任务配置端云框架](https://bytedance.larkoffice.com/wiki/R1OLwyfpTijHw7kQtnbcoZB4nff)；[A19 触发器配置平台改造PRD](https://bytedance.larkoffice.com/wiki/TW0pwbGmyit1KGkVPazcX6mSnYb)。原文保存在 bodies/ 对应编号。

## C18 充电识别的 VQA 是触发后的复核，不是所有视觉条件统一 VQA

- 实施状态：平台 PRD 场景要求，阈值示例/未接项须标明。
- 业务输入→判断→下游：充电示例先判断驻车、盖关闭、低电，再由 Director 用 VQA 确认充电设施，确认成立才问用户，用户同意后打开。20% 为示例，不可写既定线上阈值。儿童锁需儿童或宠物且锁未开再确认。
- 回调、失效与失败：后视镜状态待接；洗车退出未接；温湿差/湿度已在 10/9 删除，旧预设文档仍保留。P 档且车速<70 这一组合也需产品澄清，不能默认为合理。
- 产品关键问题与验收：追问：VQA 无法识别是否静默？指标：复核避免误提醒比例、错误设施识别率、确认后控车成功率。
- 来源：[A19 触发器配置平台改造PRD](https://bytedance.larkoffice.com/wiki/TW0pwbGmyit1KGkVPazcX6mSnYb)。原文保存在 bodies/ 对应编号。

## C19 开关不是一个全链路总闸

- 实施状态：10/8逐字稿、静态PRD与E68设置有分歧；10/14进展不能证明全链路实现。
- 业务输入→判断→下游：E68设置明确AI总关闭清理动态任务/静态子目标并停止相关触发，系统预设仍可触发但无TTS；持续观察子开关只影响舱内连续感知，不影响主动VQA/拍照或舱外。主动服务关停止推理/输出/Director消费。
- 回调、失效与失败：10/8会议把语音禁用与清空子目标相连，但静态PRD同日补充写语音禁用/车外语音保留子目标、不推理，不能把二者合并。10/14主动服务状态push缺、语音禁用/车外语音未开发，仍需版本和开关矩阵联合验收。
- 产品关键问题与验收：追问：关闭语音是否还视觉采集、是否继续出无声卡？指标：关闭后违规播报率、保留预设误停率、开关端云收敛时延。
- 来源：[A72 文字记录10月8日语音禁用静态Advisor](https://bytedance.larkoffice.com/docx/MQR1dCphVo3ZBkx2KkPcNwPFnNb)；[A52 静态Advisor进展盘点](https://pq3b44yw2t9.feishu.cn/docx/L3e6d2Cv1oW3F3xnz7nc3cxZneh)；[A51 静态Advisor PRD v0.6](https://pq3b44yw2t9.feishu.cn/wiki/QU0PwxnaQiT9ZhkH2bwcwiuBnQg)；[A84 E68 AI设置PRD](https://bytedance.larkoffice.com/wiki/D0cwwp6pzicNJBkU4x3cUPTpnle)。原文保存在 bodies/ 对应编号。

## C20 静态 Advisor 三个入口，输出仍是建议

- 实施状态：OnePager 与 10/14 进展；渠道及依赖范围需保留。
- 业务输入→判断→下游：预设事件由 Trigger 命中；动态事件模块从事件/状态/记忆推理需要服务的事件；子目标 review 定时检查持续需求。三者触发舒适/出行/情感/内容 Advisor，Advisor 获取 Context/画像/世界信息后输出 advice，Director 才做对话与工具执行。
- 回调、失效与失败：静态 Advisor≠静态规则：其内部也推理。主动服务=静态 Advisor+系统预设条件任务；不能把四 Advisor 当四个全链路工具。A52 明确弋途负责模型与 AI Bar 数据，字节负责 Trigger/Context/Director/透传，车企负责 AI Bar 展示。
- 产品关键问题与验收：追问：本次是哪个入口触发？推荐是否与现有任务/历史 advice 重复？指标：误触发率、重复打扰率、应静默未静默率、真正完成率。
- 来源：[A05 静态Advisor OnePager](https://bytedance.larkoffice.com/wiki/Hzq8wR285io8qxkFYGscs5EAnMg)；[A52 静态Advisor进展盘点](https://pq3b44yw2t9.feishu.cn/docx/L3e6d2Cv1oW3F3xnz7nc3cxZneh)。原文保存在 bodies/ 对应编号。

## C21 静态 Advisor 当前能力要按四层标状态

- 实施状态：10/14 周进展报告，不是全部端到端上线证明。
- 业务输入→判断→下游：25 条预设事件：10 条实车通过（40%）、3 测试中、6 待开发依赖端状态、6 依赖 VLM 预计 11 月。动态事件和子目标 review 国庆前实车链路通；长期记忆用户标签已接，短期会话记忆待开发；历史 advice+用户反馈接事件日志产品沟通中。
- 回调、失效与失败：10/14 单模块接口通过率不能当端到端：动态事件 45/74=60.81% 且只复测前轮失败集；舒适 189/283=66.78%；出行98.1%；情感241/270=89.26%；内容76.6%。同页端到端结果为空，不能给出综合完成率。
- 产品关键问题与验收：评审要问分母/样本版本/实车还是mock。指标分触发、推理、交互、使能；不要用一个漂亮总准确率遮住依赖缺口。
- 来源：[A52 静态Advisor进展盘点](https://pq3b44yw2t9.feishu.cn/docx/L3e6d2Cv1oW3F3xnz7nc3cxZneh)。原文保存在 bodies/ 对应编号。

## C22 即时交互卡由当前轮首个 Director 文案生成

- 实施状态：即时卡技术方案；与 AI Bar/闪念分离。
- 业务输入→判断→下游：Advisor/Trigger 给 real_time_card.enabled/buttons；服务从当前推荐缓存恢复配置并清理旧轮配置。解析合法且 Step0 时取首个 talk_content，去情绪标记/换行，非空才发卡。按钮可为空成纯文本卡。
- 回调、失效与失败：method=3/type=2 RecommendCard，不是 Widget method=9。按钮文案原样带回成 Query；卡片下发不再触发推荐回流。发卡失败不阻断主对话；首段话术可能早于工具最终结果，所以卡片不是执行完成凭证。
- 产品关键问题与验收：追问：工具失败时卡片是否更新/撤销？指标：空卡率、旧轮卡串扰率、按钮与当前上下文匹配率、发卡到展示率。
- 来源：[A30 主动服务即时卡技术方案](https://bytedance.larkoffice.com/wiki/P7NcwKeQhiFF2RkZbAscIYIcnNd)。原文保存在 bodies/ 对应编号。

## C23 AI Bar 透传展示与二次状态回填独立

- 实施状态：端侧静态 Advisor 技术方案。
- 业务输入→判断→下游：Extour 生成 UI payload，经 Nova/AiCarSDK/车辆进程/OEM SDK 到 AI Bar。need_confirm=false 可渲染并立即发 Query；true 等 UI confirm 再 IM。端回 show/update/remove 与 click/confirm/expose/dismiss 事件。
- 回调、失效与失败：AI Bar 展示 action_list 不意味着动作真实成功。根代理已核服务端 aircon 后续：Director 车控至少一项成功且上下文未过期才回 Extour 算 AI Bar，UI-only 再下发，无新文本；上报失败不回滚车控。该补充需引用根代理原文。
- 产品关键问题与验收：追问：卡片按钮点后未消失归哪个模块？指标：业务回调成功率、UI 更新一致率、执行成功但 UI 失败率。
- 来源：[A32 静态Advisor主动服务技术](https://bytedance.larkoffice.com/wiki/BGDJwVZjoi60tGku4pbcNDLOnXf)。原文保存在 bodies/ 对应编号。

## C24 闪念 Mock 是固定文本直达通知卡，不经过 Director

- 实施状态：10/16 Mock 技术文档仍待评审；10/20 是计划。
- 业务输入→判断→下游：信号/事件→条件 Trigger→doubao_flash_card Action→AIDV RPC→Widget→Frontier→端侧。技术文档锁空标题、固定正文、无按钮/无交互回调，不做模板变量或模型生成；相对 PRD “标题+正文”存在更新。
- 回调、失效与失败：RPC 正常返回不保证 Frontier 真受理（发送函数吞错）；Frontier 不等于显示。Mock 动效仅透传 ID，不含资源管理。弱网/超时不自动补发。展示时长、队列、消失、TTS打断待定。
- 产品关键问题与验收：指标必须三层：RPC 接受率、Frontier 内部发送率、端真实曝光率；每层 request_id 关联，禁止只看 errno=0。
- 来源：[A27 静默信息展示PRD](https://bytedance.larkoffice.com/docx/J0Redv242ok9UzxFHzQcZRhJnvh)；[A29 静默卡Mock技术方案](https://bytedance.larkoffice.com/docx/KuzgdSIn8olLs1xHgvEcDMq6nQc)。原文保存在 bodies/ 对应编号。

## C25 文字与 PHUD 并行，不是文字生成后才画动效

- 实施状态：10/15 逐字稿 37:05 + Mock 技术协议。
- 业务输入→判断→下游：同一条件命中可分两条消息：文字 Widget method=9；PHUD method=14。二者由各自 action/消息送端渲染，不是靠 Director 先说一句，再从这句话推导 PHUD。原 Mock 写一个 action 带两参数，元数据示例又拆 flash/phud 两个动作，需按最终协议核。
- 回调、失效与失败：10/15 19:43–30:47 明确 10/20 仅 Mock 普通条件→固定文字，真实视觉+PHUD 目标11/03，预设因此后延。不能把 Mock 成功验成视觉识别/模型判断能力已通。
- 产品关键问题与验收：追问：一边成功另一边失败如何显示？指标：双端配对一致率、先后时差、单支失败率；非串行整体耗时相加。
- 来源：[A29 静默卡Mock技术方案](https://bytedance.larkoffice.com/docx/KuzgdSIn8olLs1xHgvEcDMq6nQc)；[A70 文字记录10月15日感知可视化闪念](https://bytedance.larkoffice.com/docx/N65OdXnxfoRFf4xQOL0c8ZKmngh)。原文保存在 bodies/ 对应编号。

## C26 10/21 PHUD 一期设计收敛为 1/9/10/12 四类场景

- 实施状态：10/21 新技术方案，未见正式上线/验收。
- 业务输入→判断→下游：开头沿用 13 场景，Case 章节明确“仅需要支持场景1、9、10、12”：AlwaysOn、宠物、主副驾头部温度、大件行李。上报 VLM原始JSON→AIDV/Context→Trigger；结构化位置/性别/年龄走条件，caption走推理。其他视觉信号从 Context 补齐。
- 回调、失效与失败：推理成功不再硬编码回调 TaskService，而应进入统一 Action Dispatcher 执行场景动作。动效资源放 TOS，配置放 TCC 可加；与早期代码白名单/ID-only Mock 是版本演进。不能把示例“13场景”当实际一期全覆盖。
- 产品关键问题与验收：追问：头部温度源、行李舱外图源已接吗？下载/签名失效如何降级？指标：资源可取率、ID映射正确率、模型命中到PHUD展示时延。
- 来源：[A28 静默展示一期服务端](https://bytedance.larkoffice.com/docx/Bl4AdeDEqoyar7xAL7QcG3Bbnyh)。原文保存在 bodies/ 对应编号。

## C27 PHUD PRD 有仲裁/范围自相矛盾，必须保留决策缺口

- 实施状态：目标 PRD，不作为实测性能/已交付范围。
- 业务输入→判断→下游：PHUD 是感知标准标签→动画 ID→端仲裁→渲染；车企 CV 疲劳/分心可走本地，与字节 VLM 上云不是同一条。开关/隐私/驾驶场景为前置。文档 13/10类与表数量不一，舱外 FaceID 不支持但 SOP 有列，情绪暂不支持但后列 P0。
- 回调、失效与失败：同级先排队还是新打断旧、取消后恢复还是丢弃，前后段落冲突。15 分钟按ID+主体+方向+时间去重是该PRD要求，非Trigger全局间隔。500ms/200ms/0.6/85%/TTFT3s均目标或建议非测得。
- 产品关键问题与验收：追问：哪一版仲裁表为准？指标：遮挡重要告警率、重复动效率、过期动效率、端渲染时延、用户理解率；先定义口径再设阈值。
- 来源：[A26 PHUD感知可视化PRD](https://bytedance.larkoffice.com/docx/H5xDdjkpvoHLepxHshucQqMGn64)。原文保存在 bodies/ 对应编号。

## C28 状态与事件不是一个数据库盒子

- 实施状态：端信号/事件 OnePager 与迭代技术方案。
- 业务输入→判断→下游：状态回答“现在车窗开几成”，全量/增量/删除按时间与主键合并；事件回答“何时谁把车窗从关改开”。事件来源有 Trigger 规则、端用户操作、云业务；要定义资源ID、参数、自然语言格式、对象/权限。不是把所有高频遥测都记成事件。
- 回调、失效与失败：事件消费者分别是记忆、Context短窗、白名单UP事件、Extour订阅。10分钟/30条与20分钟查询是不同文档暂定值，不能统一当全局记忆窗口。人人对话是否可用必须看阶段证据。
- 产品关键问题与验收：追问：一次手动空调调整是否被端与Trigger重复记两次？指标：事件漏报/重复率、主体归属错误率、状态新鲜度、事件到消费者延迟。
- 来源：[A36 端状态事件日志OnePage](https://bytedance.larkoffice.com/wiki/PRf0wRd3Uic0omkiiiGc70wanQN)；[A38 事件生产与使用迭代技术](https://bytedance.larkoffice.com/wiki/SiedwOaRPiNhHpkLXjucucUgnBc)。原文保存在 bodies/ 对应编号。

## C29 事件进 Director 是白名单业务入口，不是每条信号都叫醒

- 实施状态：现有 MVP 事件 Query 说明。
- 业务输入→判断→下游：TTS被打断时端上传已播/未播片段及request_id并缓存；云端收到对应拒绝/打断流程后生成事件文本，经现有Advisor Frontier→客户端新Query→Planner。外层像query，业务语义仍是系统事实，不是用户又说了一句。
- 回调、失效与失败：上传与使用顺序存在竞态待明确。事件日志写入不意味着立即触发Director，普通车况更新更不能每次推理。
- 产品关键问题与验收：追问：打断事件到达前 Planner 已继续怎么办？指标：漏打断事件率、错误重复说话率、事件顺序异常率、错误用户意图归因率。
- 来源：[A39 事件触发新一轮query技术](https://bytedance.larkoffice.com/wiki/A3jYw2EFtiJSSqkRpJocFPQGnRg)。原文保存在 bodies/ 对应编号。

## C30 调试 client event 与业务事件日志必须分框

- 实施状态：客户端埋点技术说明。
- 业务输入→判断→下游：/client/event/report 收集 request_id/eventtime/任意params（上限8KB）用于排障检索；查询要求非时间筛选条件、20默认/50最大。这是调试遥测通道，不自动成为Director的业务上下文。
- 回调、失效与失败：若图把调试接口画成 Context 事件入口，会让 PM 误以为埋点加了就能被模型理解。真实业务事件仍需定义格式、归属、消费者与订阅。
- 产品关键问题与验收：追问：新增事件是仅日志可查还是模型真正拿到？指标：日志关联覆盖率、关键链路追踪完整率；不能用埋点上报率代替业务成功率。
- 来源：[A41 客户端事件上报查询接口](https://bytedance.larkoffice.com/wiki/NFJBwdPMpieDZNkailCcOYQtnqb)。原文保存在 bodies/ 对应编号。

## C31 10/15 确认默认视觉上云已通，不代表视觉主动服务已闭环

- 实施状态：逐字稿 34:40–35:15，与 19:43–30:47 分开。
- 业务输入→判断→下游：会议确认 AIBox 自取视频流周期推理，AlwaysOn 描述上云端状态链路已搭好。但同会仍把视觉判断→真实 PHUD 定为11/03目标，10/20只做普通条件 Mock。
- 回调、失效与失败：“上云通了”只证明感知产物可到达，不证明场景识别正确、触发条件合理、Action调度到位、终端展示或真实车辆动作完成。图应给每段独立状态，不能整条涂绿。
- 产品关键问题与验收：验收从同一 case 串起：观察时间→Context入库→Trigger判断→Action→下发→展示/车辆ACK。指标：全链路可追踪率、各段成功率和延迟。
- 来源：[A70 文字记录10月15日感知可视化闪念](https://bytedance.larkoffice.com/docx/N65OdXnxfoRFf4xQOL0c8ZKmngh)。原文保存在 bodies/ 对应编号。

## C32 任务岛不是任务中心全集；一次任务与长时任务呈现不同

- 实施状态：任务岛技术设计/任务中心v0.4；不等于HMI全链路准出。
- 业务输入→判断→下游：一次定时/条件任务创建仅即时任务卡，不进任务岛；循环时间、常规长时、舱内外视觉长时是即时任务卡+AI Bar；生态长流程只进AI Bar。TaskService method=13的create/close/update不同于Director即时卡method=3。开机可查询task/island/list恢复漏推，不能仅靠push。
- 回调、失效与失败：任务岛技术view为created/waiting/running/closed，与任务中心v0.4状态需映射；JSON创建示例message_type写2却字段表定义1，biz_type字段解释也与task_island示例不一致。对外cot应是可展示摘要，不是模型隐藏推理。
- 产品关键问题与验收：追问：哪类任务在哪张卡出现，任务消失是结束还是push漏了？验收分别看列表恢复率、卡片/后台一致率、完成/关闭通知到达率。
- 来源：[A10 AIDV任务岛即时交互卡](https://bytedance.larkoffice.com/wiki/HzAtw3ABQif5c8kwKS8cL1x9nhf)；[A01 任务中心 PRD](https://bytedance.larkoffice.com/wiki/LUKKwMTNaiAd53kdmpkc5oILn5e)。原文保存在 bodies/ 对应编号。

## C33 上汽创建与触发的两跳交互，不能并成一次播报

- 实施状态：7/1主交互改造方案；需与AIDV当前接入状态交叉，不当作全上线。
- 业务输入→判断→下游：Planner交长期任务，Extour同步creating+goal_id，创建前铺垫话术可播；creating和create_success禁止TTS，成功Goal卡直出，失败回Planner播原因。未来trigger第一跳Recommend卡不播报，点击推荐ID二次上行；方案还写无操作默认执行，具体等待/取消规则需UI确认。
- 回调、失效与失败：当时多次Recommend共用AdvisorTypeUnknown单槽，后到可能覆盖先到，前条等待TTS结束时也可能被判过期；没有多advice队列或合并承诺。consumed设计为送入Director；根架构缺消费回报接口路径，不把设计宣称已闭环。
- 产品关键问题与验收：追问：后到建议覆盖前条是设计还是丢事件？指标分别记录Goal创建率、建议保留率、二次上行率、真正执行率；不得用consumed充当执行成功。
- 来源：[A31 DNA主动服务主交互技术方案](https://bytedance.larkoffice.com/wiki/ApjawNFGuiHOl6kt3PwcNhYcnjh)；[A04 动态Advisor OnePager](https://bytedance.larkoffice.com/wiki/VvAMwHbxei6BSEkzoxjc9AbynNh)。原文保存在 bodies/ 对应编号。

## C34 上汽Goal查询与SeresTaskView不能强行共用状态名

- 实施状态：Goal查询接口有三类创建成功示例，未证明后续触发执行。
- 业务输入→判断→下游：saic-dna的goal-list查询当前账号有效Goal，输出原目标、进展、短标题、场景和button/switch控件；状态creating/pending/running/done，switch由enabled表示。样例确认3分钟提醒、距离目的地一公里、连续10天19点提醒的创建成功。
- 回调、失效与失败：文中字段统一enabled，示例却为enable，需协议定版；creating并非等待未来触发，pending才是该渠道等待。Seres任务中心另用running/paused，不能用一个状态字典掩盖差异，更不能把创建成功例子作为10天持续成功证据。
- 产品关键问题与验收：追问：跨账号查询隔离、开关回显、已结束目标是否仍列出？指标：状态映射错误率、幽灵目标率、跨账号泄漏率。
- 来源：[A59 上汽动态AdvisorGoalList接口](https://bytedance.larkoffice.com/wiki/ExtGwiADMijNBDkXo2Xcmocdncg)；[A01 任务中心 PRD](https://bytedance.larkoffice.com/wiki/LUKKwMTNaiAd53kdmpkc5oILn5e)；[A02 Task任务管理设计](https://bytedance.larkoffice.com/wiki/B2WYwXFOIigKzbk7aSYcJWmZn2E)。原文保存在 bodies/ 对应编号。

## C35 VQA先选意图/对象/渠道，LBS答案并不总由图像模型生成

- 实施状态：VQA PRD及赛力斯技术选型；10/15新增要求无权限。
- 业务输入→判断→下游：车识别、LBS、通用、舱内、观影/游戏各有路由。LBS图可用于UI，但地点答复可来自沿途建筑QA；问房价等联网事实需先识别对象再web检索。舱内每次新抓拍，车辆追问在槽位一致时允许复用结果。若Context足够直接答复，在旧评测口径也可算正确路由。
- 回调、失效与失败：本车参数应走说明书，堵车情况应查导航，不泛化成VQA。赛力斯舱内只回文本且不云兜底；旧VQA稿写AlwaysOn关需提示开启，与新设置PRD的主动VQA不受影响冲突。不能把错误相机/网络/旧图当识别错。
- 产品关键问题与验收：旧PRD目标：Planner路由及槽位95%；车识别/LBS90%、通用80%、舱内/观影85%；车识别P90 6秒/LBS2.5秒。这些是目标，不是现测成绩。
- 来源：[A44 VQA需求文档](https://bytedance.larkoffice.com/wiki/H80iw85YwiSS5Rkr6cccKAofnBc)；[A49 赛力斯VQA技术链路](https://bytedance.larkoffice.com/docx/OT9bdwF59oWYaWxhptbceLsunkb)。原文保存在 bodies/ 对应编号。

## C36 VQA摄像头能力必须按车型与功能列矩阵

- 实施状态：两sheet前200行非空内容已审，末3/5行未返回；不是全表/量产承诺。
- 业务输入→判断→下游：车辆识别两渠道都只列前方，左前/右前映射前方；LBS/通用DNA左右不支持，后向需DriveLevel=2，SLS左右后可列支持。DNA后排OMS取图受后排屏放下影响。观影表中SLS支持、DNA不支持。
- 回调、失效与失败：同一表主Sheet把SLS后排OMS写TBD，SP表却勾支持；SP工具仍残留不具备屏幕理解，而能力表有观影。需同版本校准工具描述、能力表和实际相机。表中存储字样不等于已授权保存用户图像。
- 产品关键问题与验收：追问：模型会不会误选不存在摄像头、旧SP是否拒绝已有功能？指标：不支持视角承诺率、位置映射正确率、旧图误复用率。
- 来源：[A88 VQA项目支持功能和视角清单](https://bytedance.larkoffice.com/sheets/Dt6esVS0dhmucLtbz3ncke6bnlg)；[A44 VQA需求文档](https://bytedance.larkoffice.com/wiki/H80iw85YwiSS5Rkr6cccKAofnBc)。原文保存在 bodies/ 对应编号。

## C37 信号规范是Context和Trigger共同依赖，不是后端小细节

- 实施状态：状态感知规范与二期建设；500ms/1Hz/30s属当时代码描述。
- 业务输入→判断→下游：五域车况/导航/媒体/座舱/车机；枚举字符串、数值单位、结构化位置主键、六类数据类型。信号分别供Context注入、状态查询工具、业务工具拉取/订阅。主驾和后排、温度单位、缺失值要统一，Trigger才能判对对象。
- 回调、失效与失败：规范接入和Trigger改动待技术对齐，不能把字段设计当所有车型已上报。频率章节写本期不涉及按代码；平台0.5天新增信号、订阅小于1秒是未来目标。部分字段命名/位置后缀示例还与原则矛盾，应对照协议定版。
- 产品关键问题与验收：追问：当前缺信号还是无该能力，什么时候用新值？指标：所需字段覆盖率、单位/枚举一致率、信号新鲜度、对象串扰率、消费侧收到率。
- 来源：[A47 状态感知需求文档](https://bytedance.larkoffice.com/docx/UFSIdVdaoot5ZNxXEprcF7HXn3d)；[A36 端状态事件日志OnePage](https://bytedance.larkoffice.com/wiki/PRf0wRd3Uic0omkiiiGc70wanQN)。原文保存在 bodies/ 对应编号。

## C38 静态Advisor按策略分出口，不是所有建议都先弹同一张卡

- 实施状态：静态PRDv0.6含10/12v0.7补充，保留待开发项。
- 业务输入→判断→下游：舒适可语音确认/告知执行/静默执行/界面确认，出行偏语音或界面确认；语音确认即时卡带按钮，告知执行可无按钮，静默执行不出即时卡。舒适/出行AI Bar点击把原建议+已确认交DT；内容界面确认只交内容UI，用户点击由车企播放首条内容，不能强行回DT。
- 回调、失效与失败：静态Advisor三个触发入口与四类策略不同维度。只有舒适/出行有子目标；有目标10分钟review，新事件重置。历史建议各自最近5条，30轮短记忆压缩是新增需求；反馈学习仍TBD，个人世界模型已划线。
- 产品关键问题与验收：追问：卡片上的按钮是谁生成、点击去了谁、是否需要真实动作回报？指标：策略选择正确率、未授权动作率、按钮回流关联率、实际播放/车控完成率。
- 来源：[A51 静态Advisor PRD v0.6](https://pq3b44yw2t9.feishu.cn/wiki/QU0PwxnaQiT9ZhkH2bwcwiuBnQg)；[A32 静态Advisor主动服务技术](https://bytedance.larkoffice.com/wiki/BGDJwVZjoi60tGku4pbcNDLOnXf)；[A30 主动服务即时卡技术方案](https://bytedance.larkoffice.com/wiki/P7NcwKeQhiFF2RkZbAscIYIcnNd)。原文保存在 bodies/ 对应编号。

## C39 E68设置按账号本地保存，但系统预设的车级开关另算

- 实施状态：设置PRD；不是所有状态push已实现证明。
- 业务输入→判断→下游：AI总开关默认关闭，需要登录及车企隐私/安全权限；关闭后子开关隐藏/重置且语音含离线不可用。设置按豆包账号本地存储，退登清理、新登录默认，不跨车同步。总关清动态任务和静态子目标，系统预设仍触发但不播TTS。
- 回调、失效与失败：持续观察子开关只管舱内连续观察，不含舱外与主动VQA/拍照。主动服务开关控制推理、输出、Director消费；不要把其账号本地保存与预设任务按车保存开关混同。语音禁用的子目标保留/清理尚有来源冲突。
- 产品关键问题与验收：追问：切账号后旧任务/旧建议还会触发吗？指标：开关端云一致率、禁用后违规播报/采集率、旧账号回调误执行率。
- 来源：[A84 E68 AI设置PRD](https://bytedance.larkoffice.com/wiki/D0cwwp6pzicNJBkU4x3cUPTpnle)；[A51 静态Advisor PRD v0.6](https://pq3b44yw2t9.feishu.cn/wiki/QU0PwxnaQiT9ZhkH2bwcwiuBnQg)；[A52 静态Advisor进展盘点](https://pq3b44yw2t9.feishu.cn/docx/L3e6d2Cv1oW3F3xnz7nc3cxZneh)。原文保存在 bodies/ 对应编号。

## C40 持续观察周期与用户汇报周期是两回事

- 实施状态：长时视觉PRD与技术方案；6–7秒为预计非SLA。
- 业务输入→判断→下游：Task最多下发3个动态观察目标，新增/修改/删除均全量替换，目标ID不得重复。高频VLM预计6–7秒产出可被资源占用影响；用户每分钟汇报由Task设定时器并使用最近有效观察，不是VLM每出结果就播报。
- 回调、失效与失败：关闭持续观察发空列表终止相关任务并告知；重新开启只恢复创建权限，不自动复活。超过20秒结果只存不转Trigger；一项转发失败不吞掉其他项，整体errno=0也要检查逐项数量。
- 产品关键问题与验收：追问：等待一分钟但最近图已经过期，告诉用户什么？指标：观察/汇报周期分别统计，配合新鲜度、过期执行率、全量目标收敛率。
- 来源：[A60 视觉长时TaskService PRD](https://bytedance.larkoffice.com/wiki/DBZxwnI62iavXJksT4ccNu78nOd)；[A06 TaskService车内视觉长时感知](https://bytedance.larkoffice.com/wiki/QeJkwlVkjiPZYwknFUecrjD9nxb)。原文保存在 bodies/ 对应编号。

## C41 旧Dyna感知订阅框架只用于演进说明

- 实施状态：历史设计，不并入当前主线同时执行。
- 业务输入→判断→下游：旧动态Advisor会调用感知订阅工具，模型解析成Trigger规则，再在命中时唤醒Advisor。类别覆盖视觉、车况、时间天气等，音频明确尚未接；曾有5分钟轮询等例子。Watcher云OMS Demo与Seed模型选型、远期omni也属于早期路线。
- 回调、失效与失败：最多一个视频观察者+prompt合并已划线；旧高优触发100%执行、不受优先级限制不应带入新Workflow；旧订阅每5分钟不是当前6–7秒AlwaysOn。取消条件仍有目标结束、用户取消、订阅更新、退出/下电，但应按当前任务政策重新核。
- 产品关键问题与验收：追问：图中旧模块是历史说明还是当前调用？指标：同一用户任务双系统登记率/重复执行率；历史性能目标不能当当前实测。
- 来源：[A86 Dyna-advisor感知框架](https://bytedance.larkoffice.com/wiki/QFUUwCpGziJeJ1kXfvzckBZ0ncf)；[A81 Watcher Always on感知PRD](https://bytedance.larkoffice.com/wiki/AzODwvQNaiinfLkX9zkc7X24nHg)。原文保存在 bodies/ 对应编号。

## C42 事件原始记录不自动含Task关联或状态快照

- 实施状态：2025事件PRD/技术评审与2026迭代需分层。
- 业务输入→判断→下游：事件是人可感知的行为/变化，不是全部高频遥测。事件自然语言按主体+动作+客体模板拼接，不必用模型。早期PRD列触发任务ID/所属任务ID，但明确本期任务部分不做；技术方案不把端状态/Watcher快照存事件库，消费者按人和事件时间另查。
- 回调、失效与失败：人人对话包括拒识ASR/电话会议是需求愿景，排除其他设备TTS、乱码及权限关闭内容，脱敏仍讨论；不能把表里示例当全部已采集可用。不要将“某人说要调空调”事件等同“车辆真的调好”。
- 产品关键问题与验收：追问：有事件日志是否足够复现当时证据？指标：事件来源/对象/时间完整率、跨源重复率、日志与实际状态一致率；敏感内容按权限与阶段核验。
- 来源：[A37 事件日志PRD](https://bytedance.larkoffice.com/wiki/Gt9qwfzlHiIKLgkWKCfcqYsYngg)；[A42 事件日志评审文档](https://bytedance.larkoffice.com/wiki/NVsHwbcdEiiGmokbSszcqutCn7d)；[A38 事件生产与使用迭代技术](https://bytedance.larkoffice.com/wiki/SiedwOaRPiNhHpkLXjucucUgnBc)。原文保存在 bodies/ 对应编号。

## C43 事件生产的时间戳、动作模板与渠道要准确

- 实施状态：事件生产技术方案；划线内容不作当前职责。
- 业务输入→判断→下游：Trigger生产预置事件时条件用有变更，匹配后把所需信号旧值/新值/位置交事件服务按模板拼接。触发时间是规则匹配成功时刻，不是端采样或上报时间；媒体名称和导航目的地变化也需可触发。信号协议分上汽DNA/赛力斯维护。
- 回调、失效与失败：30秒统一执行间隔已划线。主动服务开关/豆包登录态经Trigger同步弋途整节已标不需要Trigger做，不再照抄其旧步骤。模板字段也有before/after错写，须按原子信号定义联调。
- 产品关键问题与验收：追问：事件发生在第几秒和系统第几秒判断到为什么不同？指标：采样→上报→匹配→事件写入延迟分别统计，避免用一个时间戳掩盖链路慢。
- 来源：[A40 触发器生产事件日志技术](https://bytedance.larkoffice.com/wiki/Aowjw935OiMyEcki7FFco33QnTh)；[A38 事件生产与使用迭代技术](https://bytedance.larkoffice.com/wiki/SiedwOaRPiNhHpkLXjucucUgnBc)。原文保存在 bodies/ 对应编号。

## C44 总览文档的理想平台能力不能覆盖细化PRD的待建设边界

- 实施状态：主动服务OnePage概述与细化PRD并存。
- 业务输入→判断→下游：主动服务总览把系统预设定义为默认可用、长期等待、命中→交互→复核→真实车控回读，静态Advisor则推理开放需求。这是合理业务目标。具体本地规则由原业务执行，复杂云分支可经Director，必须按细化方案分支。
- 回调、失效与失败：总览写新增任务云下发、无需整车升级，但10月预设PRD仍明确端侧统一配置/下发后续建设；后视镜静默执行又与9/15三云场景语音确认结论冲突。不能因概述写得完整而当现在已做到。
- 产品关键问题与验收：追问：这个框是目标、开发中、单模块通还是实车验收？指标需要每场景的实际证据，不用概述中的“稳、准、完整”替代数据。
- 来源：[A25 主动服务onepage预设补充](https://bytedance.larkoffice.com/docx/QvAed4dQso6VvTxn70zcDt0enPd)；[A21 系统预设任务配置端云框架](https://bytedance.larkoffice.com/wiki/R1OLwyfpTijHw7kQtnbcoZB4nff)；[A19 触发器配置平台改造PRD](https://bytedance.larkoffice.com/wiki/TW0pwbGmyit1KGkVPazcX6mSnYb)。原文保存在 bodies/ 对应编号。

