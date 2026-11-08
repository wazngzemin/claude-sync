# 可见即可说 \- 问题分析流程
**主要判断**
- **功能定位**：把当前页面的可见控件文本注册为可说的快捷指令。
- **执行路径**：命中后按目标类型走无障碍点击或抖音 SDK 直调。
- **排查主线**：依次核对激活、ASR、上下文、匹配、执行和最终页面。
- **重要边界**：未命中只表示不触发快捷控制，不能默认会走 GUI Agent 兜底。
本文面向 AICar 客户端研发、测试和问题排查人员。内容以 2026\-09\-18 可访问的方案文档、知识库资料、项目空间元数据及 [flow/flow\_android](https://code.byted.org/flow/flow_android) 当前代码为依据。
---
## 一、功能定位
**“可见即可说”是一条面向当前页面的确定性快捷控制链路。**车机读取页面上的无障碍控件文本，把文本与控件或 SDK 动作建立映射并注册为热词。用户说出页面上可见的词或其归一化表达后，系统匹配目标并立即执行。
### 1\.1 它解决什么问题
- 用户无需记住固定命令，可以直接说出页面上已经展示的操作词，例如“暂停”“下一集”。
- 热词上下文提高页面词汇、专有名词的 ASR 识别准确率。
### 1\.2 对话系统的定位
在可见即可说业务中，对话系统**只负责接收页面的热词，接收 ASR 的结果和注册的热词进行匹配，以及返回匹配成功与否的结果**。
扫描热词并调用对话系统提供的接口进行注册的步骤由第三方实施
---
## 二、端到端流程
链路分为“初始化/页面更新”和“运行时”两部分。前者建立页面词到目标的映射，后者完成语音识别、归一化、匹配和执行。
### 2\.1 初始化与页面更新
1. **扫描页面**：车机系统通过无障碍能力读取当前页面可见控件文本。
2. **建立映射**：把控件文本映射到控件目标或 SDK 动作目标。
3. **注册热词**：将文本、目标类型、目标注册到豆包热词服务。
4. **动态刷新**：页面变化后更新 ASR Context，避免继续使用旧页面词表。
### 2\.2 运行时
1. 用户说出当前页面词或自然表达，例如“停一下”。
2. ASR 输出文本，热词上下文用于提升识别准确率。
3. 文本归一化/泛化把“停一下”归为标准指令“暂停”。
4. 标准文本与已注册热词匹配，返回命中状态、目标类型和目标。
5. 目标为控件时，通知车机并通过无障碍能力模拟点击。
6. 目标为 SDK 时，直接调用抖音视频 SDK，例如 `pause\(\)`。
### 2\.3 各阶段输入输出
阶段
输入
输出
失败时重点看
页面采集
当前窗口、无障碍节点
可见控件文本列表
权限、页面是否完成渲染、控件是否可访问
热词注册
控件文本与目标映射
热词列表、目标类型、目标
页面变化后是否刷新，Context 是否为空或过期
ASR/归一化
用户语音、热词上下文
ASR 文本、标准指令
识别文本、网络状态、归一化结果
匹配
标准指令、热词列表
命中状态、目标类型、目标
未命中、命中错词、目标映射失效
执行
控件目标或 SDK 动作
点击事件或 SDK 返回
事件是否送达、页面是否消费、SDK 返回是否成功
---
## 三、代码与系统映射
[flow/flow\_android](https://code.byted.org/flow/flow_android) 中可见即可说的核心代码逻辑
### 3\.1 关键模块
模块/类
关键入口
职责
NovaSawSayServiceImpl
registerSawSayList
removeSawSayList
notifyMatchResult
接收和移除第三方注册给对话系统的热词
通知第三方应用 可见即可说热词匹配的结果
VoiceAbility
`addGlobalHotWords`
onMatchHotWord
接收可见即可会说的热词 
返回 Query 与热词匹配的结果
SawSayQueryHandler
reportHistory
上报可见即可说热词匹配的结果
### 3\.2 相关但不同的服务链路
项目空间元数据确认，通用 GUI Agent 的关键服务接口是 `vehicle\.model\.aidv\_rpc\.ProcessGUITask`，方法级链路为 `vehicle\.agent\.gui\.Process → vehicle\.model\.aidv\_rpc\.ProcessGUITask → toutiao\.redis\.vehicle\_aidv`。这条链路用于单步 GUI 请求，不应直接当成“可见即可说”热词匹配链路。
### 3\.3 上汽与赛力斯分支取证基线
本节基于 2026\-09\-18 的两条分支快照逐文件比对：
- **上汽**：`vehicle/refactory\_ui\_dialogue\_10\.6\.0\_saic`，commit `7c40ae0833be67bb08bd0a29b5ba8fcfd1851a96`。
- **赛力斯**：`vehicle/seres\_main\_10\.6\.2`，commit `4a2150e98dd8b212427d4ca914ba44bd49c93753`。
对比对象是对应分支快照，不代表所有历史分支或已发布包；线上问题仍需先确认 APK 构建分支与 commit。
### 3\.4 两车型共有的 SawSay 主链路
1. **服务暴露**：`NovaRemoteAbilityBinder` 将 `ServiceType\.SERVICE\_SAW\_SAY` 映射到 `NovaSawSayServiceImpl`。
2. **热词注册**：业务侧调用 `registerPageHotWords\(pageId, words\)`，服务转换数据后调用 `VoiceAbility\.addPageHotWords\(pageId, \.\.\.\)`；离开页面时调用 `clearPageHotWords\(pageId\)`。
3. **ASR 命中**：语音 SDK 将可见即可说命中结果放入 `matchVC`；`AsrFloatWindow` 日志记录 `content`、`isFinal` 与 `matchVC`。
4. **进入对话请求**：`VehicleDialogueManagement` 把 `matchVC` 原样写入 `DialogueRequest\.isMatchSawSay`。
5. **本地拦截**：`SawSayQueryHandler` 在 `isMatchSawSay=true` 时记录拦截事件、上报一条“模拟点击了……”历史，并返回 `ResultCode\.INTERCEPTED`，不再进入普通对话链路。
6. **业务执行**：以抖音卡片为例，`DouYinResultCardController` 注册页面 `vehicle\_video\_douyin` 的预定义热词；命中后直接调用 `VoiceManager\.execute\(AoVoiceConst\.\*\)` 执行播放、暂停、上下条、点赞、关注、收藏、评论等动作。
**代码结论**：两车型在核心识别、命中、拦截和抖音 SDK 执行上高度一致。当前 vehicle 分支的直接证据是“业务页面注册热词 → ASR 返回 `matchVC` → 本地拦截/执行”，不是 develop/Obric 的 `ClickTalk \+ personal\_ctx \+ updateScreenshotForAsr` 链路，也未证明存在通用 View 树递归扫描。
---
## 四、问题分析指南
**诊断原则是逐层找证据，不从“页面没变化”直接跳到模型、无障碍或业务页面。**每一层都要回答两个问题：输入是否正确、输出是否到达下一层。
重点排查
1. 在 query 发起前是否有和query完全一致的热词注册进来
2. 在 query 发起前是否移除了和 query 完全一样的热词
### 4\.1 60 秒速查
1. 日志关键词：add hotwords,remove hotwords,onMatchHotWord,matchVC
2. 固定复现条件：记录原始 Query、精确时间、设备/车型、APK 版本、页面和账号。
3. 确认 ClickTalk/ASR 已激活，排除录音权限、麦克风占用、网络和登录问题。
4. 核对 ASR 原文与归一化结果，不要只看用户原话。
5. 核对页面控件文本、热词 Context、命中词、目标类型和目标。
6. 控件分支检查系统指针和 Accessibility 事件；SDK 分支检查调用参数与返回。
7. 以最终 UI 或业务状态为完成标准，不能只凭“动作已发出”判定成功。
### 4\.2 分阶段检查
阶段
典型现象
证据与日志
处理方向
入口
没有热词注册进来
add hotwords 没有和 query 相同的热词
和客户反馈对应的页面没有注册热词
ASR
识别错词
通过 add hotwords 日志发现客户有注册热词，但是因为 asr 识别错误导致热词匹配没有成功
核对 asr 识别结果的字和用户注册的热词是否想近。
SDK 执行
热词匹配成功，但是客户没有收到
对话系统的第三方应用的连接是不是断开了
查看 aicar sdk 是否发生了异常，或者客户的应用 crash 了
生命周期
在 query 发起前已经接收到了热词，但是在 query 发起中热词被移除了
add hotwords 有对应的热词，但是在 asr 识别的过程中收到了 remove hotwords 移除了对应的热词
和客户反馈对注册热词的生命周期有问题
### 4\.4 证据包
证据
最低要求
复现信息
原始 Query、标准指令、精确时间、设备/车型、APK/SDK 版本、账号、网络和前置页面。
页面证据
复现前后录屏、页面截图、页面控件文本、是否存在弹窗/遮挡/加载态。
语音证据
ASR 原文、归一化结果、热词 Context、Context 更新时间。
决策证据
是否命中、命中词、目标类型、目标、相关性判断结果。
执行证据
指针轨迹、Accessibility 事件或 SDK 入参/返回、最终 UI/业务状态。
关联标识
尽量用 `case\_id \+ timestamp \+ request/log id` 串联端侧、服务端与录屏。
### 4\.5 结论模板
- **现象**：用户说什么，页面实际发生了什么。
- **环境**：设备、版本、页面、账号、网络和复现概率。
- **故障层级**：入口 / ASR / Context / 匹配 / 控件执行 / SDK / 页面。
- **证据**：能证明输入正确、输出到达或未到达的日志与录屏。
- **结论**：已确认根因与仍待验证的推断分开写。
- **处理**：临时规避、永久修复和同条件回归结果。
### 4\.6 上汽/赛力斯 vehicle 分支排障路径
先确认问题 APK 来自 vehicle 分支，再按下表由前向后核对；不要直接套用 Obric/ClickTalk 的日志关键字。
阶段
关键证据
正常判据
异常时处理
1\. 页面注册
`NovaSawSayServiceImpl`：`registerPageHotWords: pageId:\.\.\.,words:\.\.\.`；抖音：`addPageHotWordsAndListener`
`pageId` 非空，热词列表非空，当前页面注册完成。
无日志则查 AIDL 调用方/页面生命周期；有日志但空列表则查页面热词生成方。
2\. ASR 命中
`AsrFloatWindow`：`onAsrResult: \.\.\. content:\.\.\., isFinal:\.\.\., matchVC:\.\.\.`
ASR 文本正确，最终结果 `matchVC=true`。
文本错查 ASR；文本对但 `matchVC=false` 查热词内容、页面清理时机及语音服务状态。
3\. DM 透传
`VehicleDialogueManagement` 将 `matchVC` 写入 `isMatchSawSay`。
请求保持相同 `taskId/requestId`，`isMatchSawSay=true`。
ASR 已命中但后续无拦截时，检查语音监听、请求构造及 Handler 注册顺序。
4\. SawSay 拦截
`InterceptorHandler`：`is intercepted by sawsay module \.\.\.`；DebugReporter 状态为 `intercepted`。
返回 `ResultCode\.INTERCEPTED`，普通对话链路不再继续。
无日志说明未进入 Handler 或标记丢失；有日志仍走普通对话则检查结果消费方。
5\. 命中回调/执行
`NovaSawSayServiceImpl onMatchHotWord`；抖音：`VoiceAbility onMatchHotWord id=\.\.\.,values=\.\.\.`
命中词/动作 ID 与当前页面一致，业务侧执行对应 `AoVoiceConst`。
服务有命中、业务无命中日志时查 Listener 注册和 Binder 存活；动作 ID 错则查热词资产映射。
6\. 业务结果
`DouYinResultCardController VoiceResultHandler onResult key=\.\.\. resultCode=\.\.\.`
`VoiceResult\.SUCCESS`，最终 UI/播放状态同步变化。
按 `FAILED`、`NO\_RESPONSE`、`NOT\_LOGIN\_IN`、`NOT\_SUPPORT`、`NETWORK\_INVALID`、到顶/到底分别处理。
7\. 展示层
窗口创建日志、windowType、遮挡关系、录屏。
动作已成功且卡片/登录窗在正确层级可见。
上汽重点核对 `2516/2515/2510`；赛力斯重点核对抖音卡片和登录窗 `2060`。
### 4\.7 分支专项判断
- **上汽历史上报异常**：检查 `DialogueEntity\.type` 是否为 `TYPE\_ADD`，同时 `from` 是否为 `HISTORY\_SAWSAY`；只改其中一个字段会导致语义不完整。
- **赛力斯历史上报异常**：检查 `DialogueEntity\.type` 是否为 `TYPE\_SAWSAY\_TASK`；`NovaDialogueNetClient` 会据此选择 SawSay agent id。
- **赛力斯免唤醒异常**：除 `matchVC` 外，检查预请求 `coordination\_info\.wakeup\_mode` 是否与 `awakeTask` 一致。
- **赛力斯 UI/上下文协同异常**：补查 `SERVICE\_UI\_CONTROL`、`SERVICE\_DOUBAO\_CONTEXT` 是否被发现、监听是否注册、上下文是否 ready。
- **命中但抖音没有动作**：两车型均优先按 SDK 链路排查 `onMatchHotWord → VoiceManager\.execute → VoiceResultHandler`，不应先查无障碍点击。
---
## 五、已知缺口\(TODO\)
- `flow/flow\_android` 的 vehicle/SAIC、vehicle/Seres 分支已经包含页面热词注册、命中回调、`matchVC` 透传、DM 拦截和抖音 SDK 执行；但当前仍未找到“页面无障碍节点递归扫描并自动生成完整热词映射”的实现。该能力如存在，应继续到热词调用方或外部 aiagent/SDK 仓库取证，不能由 `registerPageHotWords` 反推。
- 现有资料没有统一的“页面版本/Context 版本/命中结果/执行结果”关联 ID，也没有完整错误码表。
- 项目空间未召回“可见即可说”测试用例集，当前缺少统一的成功、未命中、误命中、页面变化和 SDK 失败回归集。
- 瑞幸 WebView 偶现无响应案例只完成故障域收敛，尚缺少 Chromium/JS 日志、稳定复现条件和修复版本回归结论。
---
## 六、来源
- [「上汽」\-「抖音短视频」\- 可见即可说方案](https://bytedance.larkoffice.com/wiki/Va9Fw4yqHiLwP8kpaIacwEZLnEd)
- [GUI Agent 核心工作流程解析](https://bytedance.larkoffice.com/wiki/LtzWwHqvtiyd5ukeuW6c2wMunwe)
- [GUI Agent](https://bytedance.larkoffice.com/wiki/P5yuwBK2jiCjrokLEnecdcohnlc)
- [\[技术方案\] GUI Agent Init](https://bytedance.larkoffice.com/wiki/Loa7wh5lBicqzskWcExcsl7Pngf)
- [GUI Agent App 自动化测试功能说明](https://bytedance.larkoffice.com/wiki/SpL0w9mBEiTjINk7djJcbPs4nnd)
- [AI 汽车问题反馈/排查](https://bytedance.larkoffice.com/wiki/KMNVwu51giBbgRkfmWDcTGpBnKb)
- [个别微信小程序偶现点击事件无响应问题](https://bytedance.larkoffice.com/wiki/OCSbwtIlUiGknJkU5IncNFIinHc)
- [车机 GUI Agent 咨询汇总](https://bytedance.larkoffice.com/wiki/KdViwjcdrirUqoktUywc6cFOncg)
- [flow/flow\_android](https://code.byted.org/flow/flow_android)
