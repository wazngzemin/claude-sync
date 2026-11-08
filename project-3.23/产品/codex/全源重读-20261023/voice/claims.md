# 语音域：可入图业务主张与证据边界

日期：2026-10-23。覆盖声音输入、唤醒、ASR、VAD、预请求、拒识、端云采信、本地执行、多人打断、可见即可说、播报与声纹车外分支。

这是制图证据账，不是“全部已读完”的证明。5 组全量主题搜索去重 685 条元数据；48 次定向读取中，31 篇相关返回文字正文完整读完，7 篇权限拒绝，8 份表格仅返回 60K 字符前缀，1 份 slides 仅元数据，1 篇客服双周材料误命中已排除。文字正文完整不代表图片、画板或隐藏表格已核验。逐篇状态见 inventory.json；原始工具响应保留为 body-*.json 与 search-*.json。

## 1. 图上应当用的业务顺序

在车型允许语音时，麦克风声音与扬声器参考音进入声学处理，产出分音区的干净语音。语音识别（ASR）持续把声音转成过程文字；人声活动检测（VAD）同时观察停顿，二者不能串行画。短停顿只允许提前准备，最终文字到齐后进入正式输入。未激活免唤醒与已激活对话采用不同音频上云规则；本地确定性缓存、云端结果、本地模型兜底按具体版本采信，不是“先本地模型、再简单复杂仲裁、最后 Planner”的统一漏斗。

有效正式输入进入输入管理 → 补足上下文 → Director（Planner 的内部名称）判断 → 工具真实执行 → 真实结果回流 → 再判断是否继续及怎样输出。停止说话、输出卡片、取消任务、真实车辆状态是不同结果。可见即可说、本地 FC、车外语音、系统抢占及多人打断必须以明确分支接回主线，不能变成散落的小岛。

## 2. 入图主张：输入、判断、输出和失败边界

### C01 语音开关与可用性在模型之前

- 输入：麦克风权限、AI 开关、当前音区、车辆/系统交互状态、唤醒词或按键事件。
- 判断：车内语音 PRD 要求每次语音初始化检测麦克风授权；未授权展示“去设置”。上汽禁用文档列出蓝牙通话、第三方语音、宠物模式、OTA 等不同禁止方式；有的 Toast，有的完全无反馈，不能统一成“拒识”。
- 输出：允许才进入语音交互；禁止时保持相应不可交互状态；已经交互中进入互斥场景，要退出声音和语音 UI。
- 边界：权限使用中变化在原 PRD 暂不处理；10 月 20 日会议提出移除无麦 K 歌禁用，蓝牙电话能否移除还依赖采音能力，不能写成两项已上线。
- 来源/状态：[【AI汽车-PRD】车内语音](https://bytedance.larkoffice.com/wiki/UIcgwzzo9iCQ2tkDz44cSjXXnBf) v0.3；[【AI汽车-上汽DNA】豆包语音禁止交互场景(含Carplay)](https://bytedance.larkoffice.com/wiki/AKJdwrR6LixFCQkJLNEcqTGdn0d) 6 月版本与 10 月待评审变更；[10 月 20 日需求评审逐字稿](https://bytedance.larkoffice.com/docx/YsMJd5BNMoKPO1xgya7coQC4n4b) 13:59–15:40。这是项目规则和变更讨论，不是全车型统一禁用表。

### C02 声学前端不是“ASR 的一个字”

- 输入：各座位麦克风原声，以及车机正在播放的音乐、导航、通话等扬声器参考音。
- 处理：降噪降低空调、轮胎、风雨等干扰；回声消除根据播放参考音压低“豆包把自己声音又听进去”的影响；供应商 SDK 产出可用于识别的分音区声音及唤醒等事件。
- 输出：干净音频与音区送语音识别和后续交互；不要用“声音已到云端”代替“用户原话被正确保留”。
- 失败：播报时听不进、音乐被当作用户、主驾躺平被定位成后排，分别归于回声/定位/识别，不应都归为大模型理解差。
- 来源/状态：[【AI汽车-PRD】车内语音](https://bytedance.larkoffice.com/wiki/UIcgwzzo9iCQ2tkDz44cSjXXnBf)；[端侧离在线仲裁技术方案](https://bytedance.larkoffice.com/wiki/PtGPwsX4iiFDAEkKMNYcUYYjnph)。降噪 ≤50 ms、信噪比 ≥20 dB、定位 ±20 cm 是 PRD 要求；5/6 座音区能力是需求范围，不可冒充当前 AIVA 4 音区实现。外界电子设备抑制/车窗外唤醒抑制含 TBD 或供应商不支持。

### C03 唤醒、激活、有效 Query 是三件事

- 输入：标准唤醒词、AI 按键、带“豆包”的连续指令、免唤醒语音、主动消息。
- 判断：AIVA VUI 中标准唤醒/按键先进入聆听，免唤醒有效指令可直接进入思考；按键归属主驾不等于只开放主驾收音。
- 输出：激活状态决定过程文字是否上屏、哪些音区可交互、聆听倒计时是否开始；拒识通过后才高亮有效文字。
- 失败：把旁人闲聊当作 Query；把“唤醒成功”当作需求已经被模型接受；将旧文档已删除的主驾免唤醒章节画为当前主线。
- 来源/状态：[【AIVA-PRD】VUI主交互需求](https://bytedance.larkoffice.com/wiki/FBsrwA734iaFzZkrZExcHHBtn3d)；[10 月 19 日主交互会议逐字稿](https://bytedance.larkoffice.com/docx/W9VLd0csvoMXj4xVNSsclU0wn8Z)。详细条款与会议采用 30 秒聆听，正文概述仍有 60 秒，须按版本核对；卡片 10 秒与聆听 30 秒是不同计时器。

### C04 ASR 和 VAD 并行消费同一段声音

- 输入：持续采样的用户音频，OnePager 以 200 ms 分帧上送。
- ASR：一遍流式识别陆续返回 partial，二遍识别在本段收尾后修正为 final；final 仅代表定稿，不代表绝对正确。
- VAD：同时判断人声活动与停顿；不是等 ASR 完成后才开始计时。OnePager 的 Soft 300 ms 与 Hard 600 ms 从同一次停顿起算，不是 300 + 600。
- 输出：过程文字供流式判断和前置准备；最终文字才用于正式业务语义处理。自然停顿可能尚未讲完，必须分别看截断和等待。
- 来源/状态：[AI汽车语音基础体验链路OnePager](https://bytedance.larkoffice.com/wiki/GBcCw5c6xiWvGukPMQgcMiuKnEc)；[【AI汽车-PRD】车内语音](https://bytedance.larkoffice.com/wiki/UIcgwzzo9iCQ2tkDz44cSjXXnBf)。OnePager 更新于 10 月 21 日；旧 VAD PRD 写 300/500/1000 暂定值，不得拼为统一现网配置。

### C05 Soft 预请求可准备，不可造成实际副作用

- 输入：短停顿时的当前文字、本次 request_id、递增 round_id。
- 处理：OnePager 允许拒识、Context 等无状态准备；技术方案建议预请求直达 AIDV，绕过正式文本入口，避免抢占当前会话、污染历史或显示“思考中”。
- 输出：仅保存前置计算结果，返回准备确认；收音仍继续，用户补话后可再次 Soft 触发。
- 失败：提前开车窗、开始导航、播正式答案、写正式用户轮次；这些都不能因“预测正确率高”被接受。
- 来源/状态：[AI汽车语音基础体验链路OnePager](https://bytedance.larkoffice.com/wiki/GBcCw5c6xiWvGukPMQgcMiuKnEc)；[服务端技术评审-多级VAD策略](https://bytedance.larkoffice.com/wiki/PJMUwwRCNiC2A8kjXCjcs4Bun7Y)；[【AI汽车-PRD】多级VAD产品体验](https://bytedance.larkoffice.com/wiki/FzViwCNb2iF43QkB5eDcD3D2nJh)。旧 PRD 只列拒识/意图/简单复杂仲裁，不含 Planner/FC；新 OnePager 允许项以其正文为准，不能把旧简单复杂模块自动加回现行链路。

### C06 复用需要同一输入编号和精确文字，不是“像就行”

- 输入：正式 final、本次 request_id、前一轮预请求文字与结果。
- 判断：同 request_id 且最终文字与前一轮预请求文字完全一致，支持预请求的模块才可复用；否则重算。
- 输出：正式输入用的究竟是哪一轮准备结果要可追踪；旧准备结果迟到不能进入新的业务请求。
- 失败例：先说“打开车窗”，再补“不要”；先说“游泳馆”，后补“附近餐厅”，都不能沿用旧指令。
- 来源/状态：[AI汽车语音基础体验链路OnePager](https://bytedance.larkoffice.com/wiki/GBcCw5c6xiWvGukPMQgcMiuKnEc)。[服务端技术评审-多级VAD策略](https://bytedance.larkoffice.com/wiki/PJMUwwRCNiC2A8kjXCjcs4Bun7Y) 的历史 TTL 2 分钟与 [eval-rejection](https://bytedance.larkoffice.com/wiki/ZAzVwONf6iTe9rknEw7cPQfanSg) 的 0.75 相似度/历史 demo 是不同版本机制。不得将相似度命中说成当前精确复用。

### C07 热词需要“数据进字典、字典进 ASR、最终真的识别到”三段验证

- 输入：车辆状态、联系人/Face 名字、最近导航地点、媒体名、当前页面可见控件、历史对话及位置信息。
- 处理：相关来源经热词管理供在线/离线识别增强；OnePager 给出名字 1000、导航 500、媒体 1000、可见控件 500、车控 1000 等分类上限及历史 5 轮口径。
- 输出：ASR 最终文字更可能命中特有名字，但加热不是 100% 保证；词表不是工具列表，不能把热词条数当工具数。
- 失败：配置保存成功但未注入请求；旧页面热词未退场；音区/用户姓名串用；识别纠错与“根据上下文理解梅花的梅”是两层事。
- 来源/状态：[AI汽车语音基础体验链路OnePager](https://bytedance.larkoffice.com/wiki/GBcCw5c6xiWvGukPMQgcMiuKnEc)；[【AI汽车-PRD】车内语音](https://bytedance.larkoffice.com/wiki/UIcgwzzo9iCQ2tkDz44cSjXXnBf)；[eval-hotword](https://bytedance.larkoffice.com/wiki/NRH8wCzdiiR0wbk4Op1czO87nYg) 报告 SFfIxD 行 6–9。3 月 28 日配置异常 321/378，4 月 1 日修正后 365/378 为历史样本，不能用作现网达标值。热词技术方案 [原文链接](https://bytedance.larkoffice.com/wiki/IMpVw1X28iDRUnkb7gUc70JYnEc) 权限拒绝，注册/失效的完整工程协议仍缺证。

### C08 未激活免唤醒：先判断是否值得上传整段声音

- 输入：未激活状态下，端侧持续 ASR 与流式拒识输出。
- 判断：AIVA 本地链路中，流式 attend 可提前上传并启动云端 ASR/拒识；未 attend 就等端侧 final。最终拒识且从未上云则静默丢弃；本地 FC 或 unsupported 需补整段声音上云。
- 输出：已上传后由云端最终结果决定召回/拒识；不能因端侧最后 reject 再撤销已发出的云端请求。
- 失败：图画成“端侧 final 拒识后才开始所有云端动作”，会漏掉提前上云与端云结果冲突；把 unsupported 当无关闲聊则漏有效需求。
- 来源/状态：[【AIVA-PRD】本地对话链路需求](https://bytedance.larkoffice.com/wiki/JXC3wPYxziUiJLk9ZlOcYSZ2nsg) 2026-09-30 改版及 10 月补充；[【AI汽车-PRD】多音区全时免唤醒交互](https://bytedance.larkoffice.com/wiki/W7kxwMqwmitpjSkv9BAcakO1nSR) 是 2025 年演进方案，强召回、5 轮拒识主题摘要等不能无标签拼入当前 AIVA。

### C09 已激活：本地与云端可同时准备，但只有采信结果能执行

- 输入：相同请求的本地/云端音频、文字、候选语义结果与网络状态。
- 当前材料口径：AIVA 9 月 30 日改为“本地正则缓存 > 云端 Planner > 本地 LLM 兜底”。本地 LLM 不是有结果就抢先执行；断网或云端 3 秒未返回时才作为兜底。
- 输出：缓存命中可不调用本地模型；常规联网等待云端；3 秒兜底后迟到云端结果不得再执行。
- 失败：本地与云端各开一次窗；云端超时答复后又补一个动作；把旧 2 秒心跳判断当当前 3 秒业务结果超时。
- 来源/状态：[【AIVA-PRD】本地对话链路需求](https://bytedance.larkoffice.com/wiki/JXC3wPYxziUiJLk9ZlOcYSZ2nsg) 9 月 30 日 callout 覆盖其正文残留旧规则；[【AI汽车-PRD】离在线仲裁](https://bytedance.larkoffice.com/wiki/DZzYwDOiviwAqHkeVx1cSFKinnh) 旧白名单与 2 秒心跳；[10 月 20 日逐字稿](https://bytedance.larkoffice.com/docx/YsMJd5BNMoKPO1xgya7coQC4n4b) 01:34–11:44 表明弱网判据/恢复同步仍在讨论。规则写入 PRD 不等于所有车型已上线。

### C10 三种返回不能混淆：拒识、可执行 FC、能力不支持

- 拒识：认为不是对助手的诉求，静默结束，不做车控。
- FC：把操作写成结构化设备、位置、动作、参数，由项目采信和执行方校验后真正执行；FC 输出不是物理动作完成。
- unsupported：是在对助手说，但本地能力无法完成，如联网搜索、多步规划；联网继续云端，兜底无能力则提示网络异常。
- 断网/超时：AIVA 本地 FC 或 reject 可采信；unsupported 播“网络异常，请稍后再试”，同一次唤醒周期最多一次，不无限重播。
- 来源/状态：[【AIVA-PRD】本地对话链路需求](https://bytedance.larkoffice.com/wiki/JXC3wPYxziUiJLk9ZlOcYSZ2nsg)；[【AI汽车-PRD】离线LLM指令解析](https://bytedance.larkoffice.com/wiki/IkRFwEv2biq6igkvlMtcfOiNnjb)。本地模型支持列表以正式协议表为准；100% 缓存准确率、50 ms、LLM 200 ms/95% 为需求目标，非实测。

### C11 本地缓存只有“上下文无关且唯一”的指令适合优先命中

- 输入：final 文本与明确的缓存/正则配置。
- 判断：单轮不依赖历史且意图槽位唯一才缓存；“暂停”“继续”“就选它”等含对象依赖的表达不能泛化为安全白名单。
- 输出：缓存得到可执行候选，仍需协议/能力/状态检查。缓存命中率不能凌驾于错误执行率。
- 继承：本地 LLM 可继承位置、对象、功能；新动作夹带复杂继承须交云端。中间被拒识的闲聊不应抹除上一轮有效控制上文。
- 来源/状态：[【AI汽车-PRD】离线LLM指令解析](https://bytedance.larkoffice.com/wiki/IkRFwEv2biq6igkvlMtcfOiNnjb)；[【AIVA-PRD】本地对话链路需求](https://bytedance.larkoffice.com/wiki/JXC3wPYxziUiJLk9ZlOcYSZ2nsg)。不要将可见即可说的历史 P0–P4 模块顺序拿来替代 AIVA 9 月采信优先级。

### C12 本地执行完成后，需要把真实历史同步给云端

- 输入：同一 request_id/session_id、sound_zone、本地/云端文字、final_result_type、function_name/arguments、nlg、时间和实际结果。
- 处理：只同步采信后的正确版本，包含 Query、Answer、Observation；记录拒识/FC/unsupported 结果，支撑后续指代和重复请求判断。
- 输出：下一句“再调低一点”能知道刚才调的是副驾温度；不应只同步“我已调好”却没有真实执行状态。
- 失败：只在下一次 Query 时同步导致离线期间断层；网络恢复没有补同步；重复回传造成重复历史。10 月 20 日会议讨论恢复时主动同步和重新查询网络，尚不能当已交付。
- 来源/状态：[AI汽车语音基础体验链路OnePager](https://bytedance.larkoffice.com/wiki/GBcCw5c6xiWvGukPMQgcMiuKnEc)；[【AIVA-PRD】本地对话链路需求](https://bytedance.larkoffice.com/wiki/JXC3wPYxziUiJLk9ZlOcYSZ2nsg)；[云端离在线仲裁技术方案](https://bytedance.larkoffice.com/wiki/BRtRwHgo4ivfr3k46LSciQi7nyd)；[10 月 20 日逐字稿](https://bytedance.larkoffice.com/docx/YsMJd5BNMoKPO1xgya7coQC4n4b)。

### C13 拒识的职责明确，但部署位置不能凭想象补

- 正式拒识解决“是不是向助手发出的有效请求”，不是“简单还是复杂”，也不是业务能力/安全检查的替代。
- 流式拒识解决播报中需不需要提前停声；最终拒识决定这段 final 是否作为正式需求。它们不能共用一个“识别成功”状态。
- OnePager 一处写云端流式拒识，另一处写端侧做；AIVA 本地链路明确有端侧流式模块；4 份独立拒识文档本轮都权限拒绝。
- 图应画职责、条件、通过/拒绝出口，并把服务侧别标为按车型/待核，不应画一个确定的“云端拒识 API”宣称全量核实。
- 来源/状态：[AI汽车语音基础体验链路OnePager](https://bytedance.larkoffice.com/wiki/GBcCw5c6xiWvGukPMQgcMiuKnEc)；[【AIVA-PRD】本地对话链路需求](https://bytedance.larkoffice.com/wiki/JXC3wPYxziUiJLk9ZlOcYSZ2nsg)。拒识 OnePage、重复拒识、V2、一体化方案的链接和权限错误均在 inventory.json。

### C14 有效 Query 合并取决于时机，不能“多人说话就叠数组”

- 输入：前后两条有效请求、说话人/音区、Director 是否已输出首 token、当前工具是否已下发。
- 10 月 19 日讨论：首 token 前可取消未开始输出的旧推理并合并有效输入；首 token 后作为新一轮打断。被拒识的新话不应取消正在办理的有效请求。
- 输出：保留每位说话人和意图归属；冲突控制需要澄清，不能默认后说者覆盖，也不能无条件主驾优先。
- 边界：历史多人 PRD 用“FC 下发前”且提最多 4 条暂定；主交互云端方案另将卡片语义相关判断移动到 end frame。合并窗口、卡片相关性返回、工具撤销是三件不同事。
- 来源/状态：[10 月 19 日逐字稿](https://bytedance.larkoffice.com/docx/W9VLd0csvoMXj4xVNSsclU0wn8Z) 15:30、58:18；[【AI汽车-PRD】多人同时语音交互体验](https://bytedance.larkoffice.com/wiki/U4xLwmQNki1Pu5kpyAGcHWtmngf)；[上汽主交互新方案-云端技术方案](https://bytedance.larkoffice.com/wiki/BCjPwn2FtiiYR2kG0IzcpLaenkg)；[多人同时场景走查case](https://bytedance.larkoffice.com/wiki/D9nWwlntMiG1Sik94ZrcyHgfnEh)。旧 walk-through 提到快速双导航本期不解决，不应画成通用冲突合并已经完善。

### C15 多音区识别是“谁说话”，动作位置是“操作谁的设备”

- 输入的 sound_zone 决定用户说话位置、交互卡片/屏幕归属和原回答对象；车控槽位 position 决定设备目标，两者不总是相同。
- 例：主驾说“打开副驾座椅加热”，卡片来源仍主驾，设备目标为副驾；副驾插话也不能把主驾旧天气问题改名归到副驾。
- 云端推理、卡片、音频焦点以及机器人转头分别保留必要归属；whole-car TTS 不代表全车对话历史可随意混用。
- 来源/状态：[【AIVA-PRD】VUI主交互需求](https://bytedance.larkoffice.com/wiki/FBsrwA734iaFzZkrZExcHHBtn3d)；[10 月 19 日逐字稿](https://bytedance.larkoffice.com/docx/W9VLd0csvoMXj4xVNSsclU0wn8Z) 35:15、38:13；[【AI汽车-PRD】车内语音](https://bytedance.larkoffice.com/wiki/UIcgwzzo9iCQ2tkDz44cSjXXnBf)。音区声纹、FaceID 与操控权限不可直接等同。

### C16 先停声再处理插话，不代表已取消动作

- 输入：TTS 正播、partial、新旧说话人、车内人数、是否以“豆包”开头。
- OnePager：多人且非“豆包”开头时，ASR 超过 2 字、TTS 正播等前提下使用流式拒识；多人带“豆包”可及时打断；单人超过 2 字有直接停播规则。
- 输出：播放器真正停止并记录中断原因、已说/未说内容、归属请求。停止播放不等于停止推理，更不等于撤销已经下发的车控。
- 失败：噪声导致误停、旁人聊天停止但不恢复、音频 buffer 未停止仍多说半句；应分别记录停播判定和实际静音时间。
- 来源/状态：[AI汽车语音基础体验链路OnePager](https://bytedance.larkoffice.com/wiki/GBcCw5c6xiWvGukPMQgcMiuKnEc)；[【AI汽车-PRD】语音交互打断策略](https://bytedance.larkoffice.com/wiki/FLlSwl1GoicNugkWWLCcFxtmnhl)。旧 2.6/2 月 demo 的 1.5 秒等待、PCM 续播和简单车控不打断不应充当现行规则。

### C17 恢复要过“工程原因门槛”和“信息价值判断”两关

- 工程门槛：OnePager 只有 NotRejectQuery、StreamNotRefusal、MultiPersonSayStartWithDoubao 等允许进入恢复；低功耗、第三方停止、新 TTS 替换、离线 FC、退出、单人打断等不恢复。
- 最终拒识：按通用 OnePager 构造 event，说明谁打断、说到哪里、剩什么，交 Director 决定是否补。
- 最终有效：新 Query 带上旧回复剩余内容，Director 决定合并、提炼、补充或跳过，而不是原音频从头复读。
- **冲突边界**：AIVA VUI 9 月条款明确流式打断后最终拒识不恢复；通用 OnePager 不能覆盖这个项目规则。10 月 20 日的 200 ms 淡出只是讨论，当前立即停声与拟议淡出需分开。
- 来源/状态：[AI汽车语音基础体验链路OnePager](https://bytedance.larkoffice.com/wiki/GBcCw5c6xiWvGukPMQgcMiuKnEc)；[【AIVA-PRD】VUI主交互需求](https://bytedance.larkoffice.com/wiki/FBsrwA734iaFzZkrZExcHHBtn3d)；[10 月 20 日逐字稿](https://bytedance.larkoffice.com/docx/YsMJd5BNMoKPO1xgya7coQC4n4b) 11:44–13:49。旧 v14 引用用户给出的 10 月 22 日逐字稿价值判断应由 root 总图统一引用，不要把配套 PRD 链接伪装成逐字稿链接。

### C18 “别说了”“不做了”“取消提醒”需要三种反馈

- “别说了”：停止当前声音，已完成车控仍保持原状态。
- “不做了”：如尚未下发可停止未完成推理；已下发动作要看执行方能否取消或补偿，不得只收到意图就称取消成功。
- “取消十分钟后的提醒”：必须确认具体任务，再调用任务操作，读取取消回执与后续是否不再触发。
- 工具已经下发时 Director 可空闲处理新 Query；工具后来返回需按归属合并结果，而不是因为旧语音被打断就丢弃真实反馈。
- 来源/状态：[10 月 19 日逐字稿](https://bytedance.larkoffice.com/docx/W9VLd0csvoMXj4xVNSsclU0wn8Z) 58:18–1:01:35；[AI汽车语音基础体验链路OnePager](https://bytedance.larkoffice.com/wiki/GBcCw5c6xiWvGukPMQgcMiuKnEc)。会上指出长任务自动恢复主线尚未完成，不应对客户承诺为当前能力。

### C19 可见即可说：界面业务方负责控件，豆包负责识别和统一反馈

- 界面显示后，OEM/业务扫描最上层可交互控件，注册显示文字、泛化词、控件 ID；随当前页面维护有效控件。
- 字典进入在线/离线 ASR 热词；用户 final 文本再与已注册控件匹配；全文/局部/模糊匹配应按规范，不是所有屏幕文字都能点。
- 命中后把 ID 交回注册方；若多个控件匹配返回多个，业务方负责选择/消歧，不能私自点第一个。
- 业务方模拟点击并返回成功/失败及播报内容；点击 UI、动画、失败 Toast 与统一 TTS 分别生效；历史注明“模拟点击”，避免 Director 误认为正常问答。
- 来源/状态：[【AI汽车】可见即可说框架需求文档](https://bytedance.larkoffice.com/wiki/AxYjwUI8wiFCXWkdNsDcRae0nCf)，每页最多 500 词为需求上限；“6 个以上连续匹配 4 个字”等边界需原图/负责人澄清。高级可见即可说在 10 月 19 日讨论仍未准出，不等于所有项目均已具备。

### C20 可见即可说有“静态页面”和“生成卡片”两种入口

- 静态控件由页面注册；主交互生成结果卡片时，还可通过动态 selector 注册按钮/选项，卡片退场要删除注册。
- 用户说“第二个”“就选它”依赖可见卡片与近期上下文；不应放入无上下文 FC 缓存，也不应拿旧页面控件执行。
- 四类卡片：Planner 工具结果、静态 Advisor、带动态 selector 的第三方、可见即可说/关键本地提醒；卡片来源不同，但最终都要交互事件回流。
- 点击不能只更新屏幕；它改变了用户选择，应同步历史/事件供下一轮理解。静态 Advisor 点击有模拟 Query，本地关键通知可直接处理，需按卡片来源标清。
- 来源/状态：[【AIVA-PRD】VUI主交互需求](https://bytedance.larkoffice.com/wiki/FBsrwA734iaFzZkrZExcHHBtn3d)；[10 月 19 日逐字稿](https://bytedance.larkoffice.com/docx/W9VLd0csvoMXj4xVNSsclU0wn8Z) 24:29–33:00；[上汽主交互新方案-云端技术方案](https://bytedance.larkoffice.com/wiki/BCjPwn2FtiiYR2kG0IzcpLaenkg)。三种点击通路不能统一画为一个 Planner 工具调用。

### C21 不支持车控不是直接答“这车没有”

- 输入：FC 能力表明确的语控不支持，或执行反馈告知相关能力不可用。
- 处理：查本车型车书，区分“功能存在但语音不支持”和“资料未查到”；有依据时告诉用户手动入口。
- 输出：支持的子动作照常执行；不支持项逐项给真实原因。无资料时用“未查询到可用信息，可能未配备或暂不支持语控”，不编功能缺失。
- 失败：调用返回 unsupported 就断言车辆没有配置；混合控制只说“好了”掩盖失败；车书搜不到就变成假的车型知识。
- 来源/状态：[【AI汽车-PRD】车控不支持指令播报和车书打通](https://bytedance.larkoffice.com/wiki/SatlwpKqXiuwqnkxqplcJzjxnpe) SOP 话术覆盖早期猜测；[【AI汽车-PRD】车控TTS播报策略](https://bytedance.larkoffice.com/wiki/GQvHwQJGriFRoKkNjnIcRkBrn1f)。车书查证是一条有条件工具分支，不应成为每个车控必经步骤。

### C22 TTS 是文字到音频，播报管理决定何时、在哪、是否真的出声

- 输入：Director/本地/工具返回的话术、情感标记、音频优先级、车型/网络/登录状态。
- OnePager 将“情绪标记”段送 Sami；含“唱”的段聚合唱段给 S2S；分段需保持顺序。旧情感答疑“参数不支持、改历史”等旧约束不得照搬。
- 在线/离线 TTS 服务按网络等条件选路，系统警告可强制离线，方言/耳语等风格约束强制在线；断网同时要求在线风格的冲突未给统一方案，必须标待确认。
- 输出：合成音频被取回、按音频焦点采纳、实际播放并结束，才证明用户听到；first packet 不等于可听首声。导航 TTS 不驱动豆包机器人/灯效，助手对话才驱动。
- 来源/状态：[AI汽车语音基础体验链路OnePager](https://bytedance.larkoffice.com/wiki/GBcCw5c6xiWvGukPMQgcMiuKnEc)；[[技术方案]-文本链路接入 Sami 情感化 TTS](https://bytedance.larkoffice.com/wiki/T7IrwTjgYihcGmk6TCCcOtT9nxb)；[【AI汽车-PRD】离在线车载TTS服务](https://bytedance.larkoffice.com/wiki/KlRgwueVKipbeLkdzkGcO15inKh) v1.4 10 月 19 日；[ASR与TTS 日志排查及问题整理](https://bytedance.larkoffice.com/wiki/WwpFwoUNLikhxmkIhKwciSCEnYy)。Sami 预生成预计节省约 100 ms 是设计预期，不是测量结果。

### C23 播报缓存、抢占与多段顺序均要独立节点

- 缓存：TTS 服务文档只缓存在线合成音频；同文字与相同配置可复用。固定缓存 ≤500、动态 ≤1500（暂定）；本地对话文档另写动态 1000，不能合成一个全局容量。
- 优先级：车厂音频管理 P0–P5；高优先级抢占，低优先级到来时可拒播；助手、导航、通话媒体的声道及 duck/恢复单独验收。
- 多段：文本/音频生成可并行，但不允许后段先播；日志文档列统一生成器或 index 队列等方案，不代表二者同时是现行实现。
- 失败：音频生成成功但没有拉取、被抢占、队列乱序或通道提前关；不是模型“不想说”。
- 来源/状态：[【AI汽车-PRD】离在线车载TTS服务](https://bytedance.larkoffice.com/wiki/KlRgwueVKipbeLkdzkGcO15inKh)；[【AIVA-PRD】本地对话链路需求](https://bytedance.larkoffice.com/wiki/JXC3wPYxziUiJLk9ZlOcYSZ2nsg)；[ASR与TTS 日志排查及问题整理](https://bytedance.larkoffice.com/wiki/WwpFwoUNLikhxmkIhKwciSCEnYy)；[10 月 20 日逐字稿](https://bytedance.larkoffice.com/docx/YsMJd5BNMoKPO1xgya7coQC4n4b) 15:40。在线转离线断点续播明确不在 TTS 服务范围。

### C24 声纹注册与车外鉴权是两条前置业务，不是所有语音的必经步骤

- 注册：AI 开启、单车少于 5 个声纹、用户同意用途并选择位置 → 录制 3 次 → 噪声/长度/速度/位置校验 → 模型保存成功 → 有效唯一昵称 → 才占一个名额。
- 失败：单次录音不合格重录；同声纹重复不新增；模型保存失败不能在 UI 显示完成；删除有确认和实际成功反馈，失败保留。
- 车外：可用性/隐私/档位/状态门禁后，钥匙匹配在范围内或车辆解锁，并且声纹匹配，才开始交互；边界距离可提示靠近后重新唤醒。
- 边界：当前车外声纹用于唤醒鉴权，不对每句后续发言做身份筛选；不等于 FaceID，也不代表车内上下文识人都已接入。
- 来源/状态：[【AIVA\-对内】声纹注册PRD](https://bytedance.larkoffice.com/docx/NbXgdTVOeopa1wxrkOMc8cr2nyd) 9 月 29 日；[【AIVA-对内】车外语音PRD](https://bytedance.larkoffice.com/wiki/U1P7wWnpbii8qdkRP5dcPG1YnCf) v0.5；[10 月 20 日逐字稿](https://bytedance.larkoffice.com/docx/YsMJd5BNMoKPO1xgya7coQC4n4b) 45:32–1:00:51。

### C25 车内外互斥、车外音区和执行回馈不能臆造

- 车外有前后左右音区，默认目标或操作歧义需按场景确认；多个子需求分别执行与报告，不能全成功/全失败地概括。
- PRD 表格仍有车内有人时禁车外的旧项，但“人数作为双向互斥唯一条件”章节已划掉；10 月 20 日结论先不加，待供应商能量判别确认。
- 车外灯效/屏显：SOP 仅前部 ISD 等有明确范围；10 月 20 日记录“接口已打通”不代表端到端效果已验收。
- 图上把它画成一条特殊入口接回正式查询，不要和车内 4 音区、全车 TTS 假设混用。
- 来源/状态：[【AIVA-对内】车外语音PRD](https://bytedance.larkoffice.com/wiki/U1P7wWnpbii8qdkRP5dcPG1YnCf)；[10 月 20 日逐字稿](https://bytedance.larkoffice.com/docx/YsMJd5BNMoKPO1xgya7coQC4n4b)。车外指标里 500/1200 ms 与另段 200 ms 不同口径，不能取其中最低值做统一承诺。

### C26 状态与日志必须贯穿，不靠一个“语音成功”指标验收

- 语音：原始录音、处理后录音、ASR partial/final、VAD 时刻、request_id/round_id。
- 采信：端云候选、最终采纳方、reject/FC/unsupported、缓存命中或重算。
- 执行：工具调用/执行回执/真实车辆状态；本地历史同步与云端输入归属。
- 播报：话术、合成任务、首个非空音频帧、tts_audio_id、fetch_request_id、实际播放/抢占/结束。
- 故障定位：先看错在哪一层，避免把 ASR 听错、旧请求迟到执行、声音被抢占统称“AI 能力弱”。
- 来源/状态：[ASR与TTS 日志排查及问题整理](https://bytedance.larkoffice.com/wiki/WwpFwoUNLikhxmkIhKwciSCEnYy)；[【AIVA-PRD】本地对话链路需求](https://bytedance.larkoffice.com/wiki/JXC3wPYxziUiJLk9ZlOcYSZ2nsg)；[云端离在线仲裁技术方案](https://bytedance.larkoffice.com/wiki/BRtRwHgo4ivfr3k46LSciQi7nyd)；[端侧离在线仲裁技术方案](https://bytedance.larkoffice.com/wiki/PtGPwsX4iiFDAEkKMNYcUYYjnph)。

## 3. 不允许直接相加或择优取用的指标

| 指标 | 来源已有口径 | 入图要求 |
|---|---|---|
| 唤醒事件时延 | 车内 PRD：最后唤醒词到事件 ≤350 ms | 需求目标；与首声口径分开 |
| 唤醒响应音时延 | 评测标准：唤醒词结束到第一声 ≤500 ms | 不是同一个终点，不得称冲突只挑小值 |
| 唤醒准确/误唤醒 | PRD 安静 ≥98%、噪声 ≥95%、≤1 次/12h；出厂表另有 10h | 项目/版本、噪声条件和样本需齐全 |
| ASR 首尾字 | 车内 PRD：首字 ≤200、尾字 ≤500 ms | 指文字上屏，不是完整任务耗时 |
| Soft/Hard VAD | OnePager 300/600；旧 PRD 300/500/1000 暂定 | 两阈值同次停顿，不能相加 |
| 本地 LLM/缓存 | 离线 PRD：解析 ≤200 ms、准确 ≥95%；缓存 50 ms、100% 精度 | 需求非测量，不把旧删除值复活 |
| 云端兜底 | AIVA 9 月 30 日 3 秒；旧方案心跳 2 秒 | 业务等待与网络心跳不同，不能互换 |
| TTS 可听首声 | 10 月服务 PRD：缓存 <100、离线 <300、在线 <500 ms | 起点文字输入，终点真实首声 |
| TTS 拉取首包 | 出厂表 P50 70、P90 80 ms | 起点拉取请求，终点首包，不代替端到端 |
| 恢复正确率 | 无统一实测值 | 建议按应补/应省/应摘要/应融合分别验收 |
| 重复执行 | 无统一实测值 | 同 request_id 的实际动作次数与迟到结果处理 |
| 热词生效 | 历史 365/378 等 | 分配置、请求注入、识别结果；不是现网达标 |

建议新增而非伪称资料已有：按车型/版本/网络/噪声/音区分层的误拒率与误召回率；过早截断率与多等待时长；预请求错误复用率；旁人聊天误打断率；停播后关键内容遗漏/重复率；多音区归属错误率；卡片点击执行及回流闭环率；TTS 生成→拉取→播放丢失率；超时后云端迟到二次执行率；本地历史同步后指代成功率。

历史评测不能直接当现网：ASR 评测文件多为动态测试集；拒识需求测试含 PPE/dev/demo；唤醒有摸底、台架与实车差别；出厂标准部分行样本总数自身不一致。所有完整性限制均在 inventory.json。

## 4. 必须交给 root 浏览器核验的图片

| 文档 | 具体位置 | 影响 |
|---|---|---|
| 可见即可说 | root 已于 10 月 23 日浏览器查看“可见即可说完整流程” | 确认车企解析/注册/执行，字节识别/匹配；无 VLM 读屏或 GUI Agent |
| Sami 情感 TTS | 当前链路、整体架构、业务流程 | 并行预合成与取音频边界 |
| 车书不支持指令 | “整体的流程” | FC 能力判断与车书关系 |
| VUI 主交互 | 概述、附录状态机流转 | 聆听/思考/工具/播报重叠 |
| OnePager | ASR 热词处理、打断恢复处理 | 所属服务与回流门控 |
| 多级 VAD 技术方案 | 总览、交互时序 | pre/final 缓存及接口时序 |
| 云端/端侧仲裁 | 架构图、业务流程图 | ID 关联与采信关系 |
| ASR/TTS 日志 | TTS 实现流程 | 合成/拉取/队列/播放 |
| 主交互云端方案 | 整体链路 | end frame 与卡片更新 |
| 供应商 SOW/功能清单 | 功能和性能图表 | 正文不能替代隐藏表格 |
| 思必驰 V9.0 slides | 全部方案页，正文接口不支持 | 尚未读完，不得当证据 |
| S2S 融合方案 | 多个历史架构图 | 仅历史演进面板需要，不入当前事实主线 |

## 5. 留待责任人回答的关键问题

1. 哪个车型、软件版本采纳哪份 300/600 配置？语义不完整如何延长、上限多长？二遍失败如何处理？
2. 流式与最终拒识各部署在哪一侧？OnePager 自相矛盾与 4 篇无权材料如何补齐？
3. 9 月 30 日缓存→云端→本地兜底采信是否已在目标版本生效？3 秒计时起止与云端迟到是否真的隔离？
4. 断网恢复的 Context 重同步是否交付？队列、重复回传、旧 request_id 怎样处理？
5. 多人输入合并以首 token、FC 下发还是 end frame 为界？分别对应输入合并、卡片清理还是工具不可撤销点？
6. 目标车型最终拒识后恢复还是不恢复？200 ms 淡出有无定稿和生效版本？
7. 可见即可说每页 500 词是否全量支持？模糊匹配多命中、旧页面注销、动态 selector 消失后如何禁止旧点击？
8. 本地可执行函数清单目前多少项？子动作/车型适配器/Planner 工具是不同计数，需以真实协议表逐行盘点，不能拿 23 个 Planner 工具替代。
9. 当前 TTS 固定/动态缓存容量究竟是哪版？强制在线风格遇到断网怎么办？音频焦点抢占后是否及如何恢复？
10. 声纹是否仅车外唤醒？车内外互斥能力最终如何验收？接口连通与实车灯效/播报是否已分别通过？


