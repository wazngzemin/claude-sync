# impact_18H（输出/HMI/形象）——资料有、副本缺

## 缺：四屏分工总图（机器人/中控/PHUD/吸顶屏）
主交互框架 v1.0 明确：豆包机器人=AI座舱交互中枢和核心主体（IP人格具象+交互状态：观察/聆听/思考/反馈）；中控屏="任务即桌面"零层级、唯一交互窗口、AI任务岛、场景化桌面（导航=全屏地图、音乐=专辑封面）、豆包空间（自我 Agent 可视化：内心想法/记忆闪现）；PHUD=第一视线层极简主义+情景智能；吸顶屏=娱乐影音。
- 画板（中控屏布局）：顶部安全/驾驶信息条 + AI任务信息条；1 AI即时交互卡片（主副驾分区）；2 AI任务岛（会议中/去公司/凉爽舒适/通勤散单 + 临时任务/高频常驻行程舒适媒体卡片/快捷操作2槽位自定义）；3 豆包空间入口。
- 链接：https://bytedance.larkoffice.com/docx/Izf6dLypwo4cqRxvpevc7eiTn3g ｜ 状态：全文 ｜ 车型：通用（DNA 平台）

## 缺：PHUD 感知可视化的标签协议（赛力斯）
PHUD PRD：PHUD 只表达豆包 Always on 的"所见"，字节侧只出标准标签（≤500ms 生成、≤200ms 下发、置信度≥0.6），赛力斯负责渲染/仲裁/埋点。标签三必带字段：①分类（安全报警/主动服务/事件分享/日常感知）②插队等级（L1=疲劳/分心/危险动作/失能；L2=FaceID/体温极值/电话会议/隔空手势/睡觉；其他无插队）③持续性（电话会议/体温极值/睡觉=持续，其他事件型3~8s）。端侧播放顺序：安全报警→L2可插队→主动服务→事件分享→日常感知。15分钟防重复=信号ID+主体+方位+间隔四条件同时满足。
- 10 种感知类型：Always on 全时态/疲劳/分心/Face ID/电话/视线落点/手势/睡觉/宠物/头部温度；车外人脸已砍、充电待定。
- 链接：https://bytedance.larkoffice.com/docx/H5xDdjkpvoHLepxHshucQqMGn64 ｜ 状态：全文 ｜ 车型：赛力斯（SLS）

## 缺：屏幕静默展示卡的云端链路（触发器→AIDV→Frontier）
条件触发静默展示 PRD + Mock 链路技术方案：云端触发器命中条件→"豆包闪念卡"Action（doubao_flash_card，固定正文 content + effect_ids 白名单，小写 snake_case 如 cabin_always_on/driver_fatigue_alert）→SendNotificationCard RPC→AIDV 固定空标题构造 Widget→Frontier Widget(9)/TypeWidgetNew(1) QoS2 TTL5s→端侧系统通知卡。无按钮无交互回调、正文不推理；一期固定文案（1020版），二期把 VLM caption/标签/场景送推理动态生成差异化文案（睡着/遗留儿童/抽烟各给各提示）。
- 链接：https://bytedance.larkoffice.com/docx/J0Redv242ok9UzxFHzQcZRhJnvh ＋ https://bytedance.larkoffice.com/docx/KuzgdSIn8olLs1xHgvEcDMq6nQc ｜ 状态：全文 ｜ 车型：赛力斯

## 缺：豆包形象的原子化三组成（上汽 D6X）
D6X 机器人 PRD v13.1：形象=表情（必要）+配饰（从属，衣帽口罩放大镜）+背景（场景，天气音符红绿灯），三者全部原子化：表情33标签（smile/happy/laugh…tired/sick）、配饰17标签、背景17标签。具象/抽象态可设，抽象态下上车欢迎仍显示小女孩再恢复；持续场景（智驾/音乐/充电/宠物模式）保持小女孩。听声辨位云台角度经上汽人机工程实测从30°→24°→20°。
- 画板：角色层（车内用户↔豆包↔从属用车人）+硬件层（常态设备=机器人屏幕；瞬态=氛围灯；暂态=中控屏/后排屏）。
- 链接：https://pq3b44yw2t9.feishu.cn/wiki/MGyDwXANqi4ELqkNaX0cveLOnPc ｜ 状态：全文 v13.1 ｜ 车型：上汽 D6X

## 缺：形象流转与形象库双端同步
形象 PRD：豆包形象常态在车载机器人，非前排区域用户主动交互时形象**流转**到该屏；动画序列帧存"豆包形象库"（机器人和车机各一份），车机维护"人车交互状态获取模块"并同步给机器人，机器人调对应序列帧展示；云→形象更新→机器人库A+车机库B→屏幕/氛围灯。
- 表情触发规则细到：顶部/左/右触摸，1次开心、3次无奈、6次鄙视、9次生气；急加速复用担心/紧张/震惊/害怕。
- 链接：https://bytedance.larkoffice.com/wiki/CwWEwdYgnia2OKkEDuicTI2Tncg ｜ 状态：全文 ｜ 车型：通用（AI汽车1.0）

## 缺：形象调用通道三分类
AIBOT 形象调用规则：50+形象按交互状态/功能反馈/情感价值三类；触发通道=信号/语音/planner 三种；通道只是来源不是场景，场景触发看 PRD 4.2。
- 链接：https://pq3b44yw2t9.feishu.cn/wiki/YXL7wLim9it58RkUAKNcexkrndh ｜ 状态：全文 ｜ 车型：AIBOT 跨租户

## 缺：流式提槽喂给卡片的机制
表情与卡片提取：闲聊回复流式提取表情（14类闭集：认可/祝贺/否定/快乐/悲伤/愤怒/惊讶/厌恶/恐惧/轻蔑/羞耻/困惑/安慰/担心）；联网回复流式提取关键信息喂卡片（20/50/100/250/500/1000 token 各提一次，每 query 最多7次）；模型 doubao-1.5-lite-32k。
- 链接：https://bytedance.larkoffice.com/docx/H5WldI0FMoNRktxd39GcTXUxnR4 ｜ 状态：全文。

## 缺：生成式 HMI 场景清单（赛力斯）
六类场景：出行（时间轴行程/POI探索/风格化渲染道路/导游解说/停车场漫游）、舒适、娱乐（专辑封面70%屏/iPod画卷/多人游戏/亲子绘本）、停车（冥想星空/观影/办公）、惊喜（节日祝福卡片/露营全景/旅行回忆画册）、安全（紧急指引全屏步骤）。框架：主驾导航70%+副驾操作20%分屏；屏幕边缘多乘客状态图标（玩手机/看风景/打瞌睡）。
- 链接：https://bytedance.larkoffice.com/docx/HnKGdRI7jocGd3xntAAcjqQhnrd ｜ 状态：全文 ｜ 车型：赛力斯

## 缺：表情设计 SOP 优先级
形象场景梳理：高频持续+情绪细腻=3D设计；低频不循环+氛围=AI生成。P0=主线28表情直接迁移（804）、P1=高频交互状态15（818）、P2=AI强相关场景反馈15（915）、P3=其他功能反馈15。
- 链接：https://bytedance.larkoffice.com/docx/EZa3d60Suog35YxQKD2cCnkGnoh ｜ 状态：全文。
- 另有表情需求跟踪 sheet（上汽 V1.0 / 赛力斯 V0.9、V0.8 历史版）：https://bytedance.larkoffice.com/sheets/CnSUsyiVbhQ6oRtCAvnc7PuInwt ｜ 部分。
