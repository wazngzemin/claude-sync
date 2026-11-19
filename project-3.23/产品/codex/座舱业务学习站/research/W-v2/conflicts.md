# W 章资料冲突、版本演进与未决差异

本表保留双方说法，不把需求、代码快照、会议讨论、服务端上线和整车准出合成一个“现状”。共 22 项；“演进/分层”可以按日期或作用对象解释，不代表两份资料互相否定。来源 raw/ 指 ../chapters/W/raw/。

| 编号 | 主题/类型 | 一边怎么说 | 另一边怎么说 | 研究处理 |
|---|---|---|---|---|
| C01 | 页面扫描／设计与实现不一致 | 3月框架要求实时无障碍扫描顶层页；`raw/framework-prd.txt:L8-L19`；问题流程概述也称扫描，`raw/problem-flow.txt:L11,L25` | 9月18日代码只证实业务主动注册，未找到全树扫描；`raw/problem-flow.txt:L129-L137,L309`；11月4日明确主线没有扫描，奇瑞另要扫描主/注册兜底；`raw/m1104n.txt:L322-L341` | 主线现状、框架原案、奇瑞拟议方案三层并列，不能统一写自动扫描 |
| C02 | 多命中／项目差异及缺口 | 框架要求全部结果交注册方消歧；`raw/framework-prd.txt:L34` | 奇瑞本期不支持多命中，讲述人还未确认主线支持情况；`raw/m1104n.txt:L340-L341` | 不把原案当全车型已实现 |
| C03 | 失败播报／同文直接冲突 | 写失败播“抱歉，没执行成功”并统一交豆包；`raw/framework-prd.txt:L43-L46` | 又写失败toast等系统提示、失败文言不播报；`raw/framework-prd.txt:L47-L49` | 场景分界缺失，双方保留，统一播报落地也缺代码证据 |
| C04 | 模块优先级／历史规则不同 | 3月排用户任务→可见即可说→FAQ→端侧LLM→云端LLM；`raw/framework-prd.txt:L51-L91` | 930后本地链路写固定缓存优先、在线听云、本地模型兜底，且没有规定页面匹配与缓存谁先；`raw/aiva-local.txt:L58-L88,L388-L404` | 不是同一张完整优先级表，W不补造页面匹配与固定缓存的先后 |
| C05 | 卡片注册／时间与路径差异 | 9月1日说所有卡片当时都未注册且优先云端闭环；`raw/m0901.txt:L1321-L1340` | 同会允许天气路况保护业务另提注册，VUI四路径中端侧通知用注册；`raw/m0901.txt:L1294-L1340`、`raw/vui-main-prd.txt:L483-L486` | 区分当时覆盖情况、默认原则与特定业务方案 |
| C06 | 泛化／定义层次不同 | 框架有前后缀、局部规则，问题流程举归一化；`raw/framework-prd.txt:L32-L35`、`raw/problem-flow.txt:L30-L33` | 动态工具称端侧只能白名单无泛化，9月1日不另供小模型，业务补词；`raw/dynamic-tools.txt:L3`、`raw/m0901.txt:L1327-L1328` | 有限规则扩展不等于自然语义理解，不能偷换成端侧小模型泛化 |
| C07 | 增强工具成熟度／进度演进 | 10月16日测试中、10月19日赛力斯实现但未准出；`raw/h2-biweekly.txt:L1797-L1804`、`raw/m1019.txt:L184-L188` | 10月22日服务端已上线；`raw/server-weekly.txt:L3074-L3081` | 日期可兼容，服务端上线不证明全车型接入或整车准出 |
| C08 | 模拟点击是否绕拒识／输入不同且未完成 | 9月讨论卡片语音“不跳过拒识”，拟补页面上下文；`raw/chat-clues-from-notes.txt:L3` | 最新周报有模拟点击生成Query跳过拒识事项，但写还未评审；`raw/server-weekly.txt:L414-L417` | 语音选择与手点生成Query分开，不能说已统一绕拒识 |
| C09 | 历史能力日期／不同改造层 | 11月5日消息称拦截历史上报0831上线，车上仍0806；`raw/msg-search-kjjks.txt:L1`，messages[8]、消息om_x100b61f0339490a4dc13d6e26af6a48 | 周报称QA改Planner toolcall于9月15日上线；`raw/server-weekly.txt:L4209-L4216` | 一个是开始上报，一个是云端格式改造；均不能证明具体车辆已升级 |
| C10 | SOP交付状态／层级不一致 | 一级任务交互卡片内部预研；Excel `全量功能清单!B18:G18`（详见sop-items.md） | 子功能即时任务卡和UI定制可量产，长时卡/任务中心仍预研；`【子功能】交互表达!J5:J8` | 保留各层级原值，不用父状态覆盖子项，也不推全车型量产 |
| C11 | 创建任务消息类型／同文直接冲突 | TypeCreateTask=1、TypeCloseTask=2；`raw/task-card-tech.txt:L582-L584` | 创建成功示例message_type=2；`raw/task-card-tech.txt:L941-L946` | 协议方尚需澄清，不直接照示例开发 |
| C12 | 任务关闭通知／范围未清 | 通知总览有创建/触发/关闭反馈即时卡及任务岛；`raw/task-card-tech.txt:L148-L169` | 关闭正文与例子主要只移除任务岛；`raw/task-card-tech.txt:L239-L241,L1028-L1054` | 不推所有关闭动作都弹即时卡 |
| C13 | 任务岛范围／分类演进 | VUI写长时长程、不含定时条件；`raw/vui-main-prd.txt:L644-L648` | 技术方案把循环定时归长时并纳入任务岛；`raw/task-card-tech.txt:L86-L96,L202-L206` | 按是否循环与实际任务类型解释，不把所有定时都排除 |
| C14 | 卡片相关性模型／版本与配置差异 | 上汽6月方案用doubao-seed-1.8；`raw/saic-interaction-cloud.txt:L99-L109` | 周报记8月5日相关性模型改2.1-turbo；`raw/server-weekly.txt:L9050-L9057` | 保留日期，缺车型最终配置，不把任一底座写为全车型当前值 |
| C15 | real_time_card／同名不同接口 | 主动出卡是enabled/buttons；`raw/proactive-card-tech.txt:L43-L59` | 动态选择上行是title/content/button/reason/card_id；`raw/dynamic-tools.txt:L155-L163` | 同名结构按接口方向分别解释，不拼成一套字段 |
| C16 | 卡片通道／作用不同 | 通用工具卡content_type=6，执行透传=9；`raw/agent-protocol.txt:L402-L448` | 主动卡Method=3/type=2；任务Method=13；`raw/proactive-card-tech.txt:L60,L119-L121`、`raw/task-card-tech.txt:L561-L585` | 展示数据、推荐卡、任务状态、执行指令分别管理，不是同一消息协议冲突 |
| C17 | 多屏展示／默认与例外不同 | VUI写独立展示、通知默认中控；`raw/vui-main-prd.txt:L729,L779,L794-L795` | 同文有出行接续原屏/相关联动；10月19日补观影时通知出吸顶屏；`raw/vui-main-prd.txt:L781-L790`、`raw/m1019.txt:L214-L215` | 按模式与业务例外说明，无法反推跨屏热词消歧已实现 |
| C18 | 手点跨屏同步／评审内撤回假定 | 评审最初假设手点后全屏联动 | 随后确认导航手点是event并非mock Query，徐洋撤回此前判断；`raw/m0901.txt:L301-L317`；上汽无通用点击事件模块，`raw/m0901w.txt:L739-L806` | 以文字记录后续澄清为准，不写所有按钮通用自动同步 |
| C19 | 卡片保持与计时／同文冲突及演进 | 延时聆听基础段60秒；相关性信号原希望早于Planner；`raw/vui-main-prd.txt:L167`、`raw/saic-interaction-cloud.txt:L87-L88` | 后文延时聆听30秒；相关性改ReAct后发，再建议端侧结束帧后消费；`raw/vui-main-prd.txt:L457,L1083`、`raw/saic-interaction-cloud.txt:L122-L126` | 30秒聆听、10秒卡片退出和7秒任务岛展示分别回指，保持信号按阶段标注 |
| C20 | 调度与恢复／旧规则对新章边界 | VUI保留首Token前advice合并用户任务、拒识后不恢复等旧说法；`raw/vui-main-prd.txt:L291-L306,L562-L573` | I章已有用户优先、输入合并更晚边界及按停止原因恢复；`../I-v2/full.md:L165-L266,L316-L388` | W只回指I；原始规则差异保留，不从旧VUI拼出另一套输入管理 |
| C21 | 任务卡/HMI进度／计划与实际不同 | 即时卡原计划9月15日；HMI双周报仍DOING；`raw/server-weekly.txt:L5809-L5816`、`raw/h2-biweekly.txt:L391-L403` | 任务卡测试被客户端/上云问题阻塞，后记10月13日上线；HMI后续DONE；`raw/h2-biweekly.txt:L3218-L3224,L1934-L1941`、`raw/server-weekly.txt:L356-L368` | 计划、云端完成、端云联调与实际发布不互相代替 |
| C22 | 旧W断言／独立证据缺失 | 旧W含任务中心不支持、Launcher字段、POI城市覆盖、页面快照/音区requestID留痕已落地等陈述，全部保存在destinations-base | 原笔记明确多项未找到原文；页面分析也缺统一关联ID，通用屏幕上下文仍HOLD；`../chapters/W/notes.md:L140-L149`、`raw/problem-flow.txt:L309-L311`、`raw/server-weekly.txt:L492-L497` | 登记旧点，不把缺证据陈述当事实；E章“开发中”仅属笔记转引，未读取E原章，不擅自修订 |

## 仍影响后续设计的 8 项证据缺口

1. 实际匹配消费哪路ASR文字，按车型分别是什么；见 facts ND01。
2. 本地拦截后在途云端请求取消/去重、页面匹配与固定缓存的先后；见 ND02—ND03。
3. 多命中在主线实际怎样处理，框架局部匹配“6个以上”对象是什么；见 FW08—FW09、MS040。
4. “第二个/就这个”的序号、指代、置信度、多屏消歧和过期卡片校验规则；见 DY18—DY19、VU32。
5. select_button 下发后的实际点击回执、失败分支及完整历史格式；见 DY17—DY20，不能拿is_finish当点击完成。
6. 专项线上命中率、误点率、端到端完成率和延迟；95%是历史ASR测试，不是点击成功率。
7. 本地msg-search副本60,000字符处截断且上汽抖音原图缺失；历史三条聊天只得转引，完整远端证据未获本轮确认。
8. 增强工具各车型接入和整车准出、统一失败播报具体实现；见 ND04—ND05。
