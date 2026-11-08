# 【AIVA\-PRD】PHUD 感知可视化产品需求文档

# 产品概述

<div class="callout">

**一句话讲清楚：**摄像头拍到车内/车外的情况后，PHUD上出现对应的动效提醒。比如驾驶员疲劳了，PHUD上就出现红色的疲劳动画。

[\[需求\]【SLS】PHUD感知可视化产品需求](https://meego.larkoffice.com/telematics/story/detail/7379941483)

</div>

## 产品定位

感知可视化是 PHUD 中间区域承载的 AI 感知表达能力，用来展示豆包生命体在 Always On 状态下的“所见”，展示对舱内外视觉、听觉信息的实时感知，以统一、抽象、低打扰的动效形式呈现在第一视线层。

<table><tbody><tr>
<td>

</td>
<td>

</td>
</tr></tbody></table>

<table><tbody><tr>
<td>

**产品目标**

1. 让用户感知到 AI 是“在场”的：豆包能够察言观色，持续理解环境。

2. 让感知能力可被用户理解：关键事件、主动服务、安全提醒不再是黑盒。

3. 保持驾驶安全优先：信息在第一视线层呈现，但不制造持续干扰。

</td>
<td>

**多屏联动原则**

PHUD 只表达豆包的“所见”，负责轻量、抽象、低打扰的感知可视化。

- 豆包交互屏：承接豆包形象、状态反馈、情绪回应。

- 中控屏：承接服务推荐、任务执行、复杂信息解释。

- 豆包闪念：承接部分日常感知、情绪氛围、高光环境等更完整的想法表达。

</td>
</tr></tbody></table>

**前置条件**

- 用户模式：convenience/driving

- 开关：AI always on 功能开关开，否则显示休眠态动效

- 隐私模式未开启



**核心链路**



**功能描述**

<div class="callout">

1. 统一描述豆包“看见/听见/感知到”的事件。

2. 支持安全报警、主动服务、事件分享、日常感知四类表现目标。

3. 支持短暂态、持续态、可插队、~~可恢复~~、~~可取消~~等展示逻辑。

4. 支持对象与方位表达，明确“谁/哪里/什么事”被感知。

5. **支持 15 分钟防重复、同级排队、舱内外优先级等仲裁规则。**

</div>

15分钟防重复

<div class="callout">

同一感知信号在 **15 分钟内**重复出现时，视为同一段感知信号，不重复播放。

</div>

判断维度需同时满足以下4个条件：

- 信号ID相同

- 主体对象相同

- 方位信息相同

- 两次触发间隔少于15分钟



## 1\.2 字节侧要做什么

1. **视觉接入**：把摄像头（DMS/OMS/热成像/舱外）的数据接进来

2. **大模型推理**：VLM识别画面里发生了什么情况

3. **标签协议**：翻译成PHUD能懂的标准格式（感知类型\+方位\+置信度\+优先级）

4. **下发通道**：把标签推给赛力斯PHUD端

## 1\.3 边界在哪

<div class="callout">

**字节侧不做：**

- 不做PHUD端的渲染和动效播放 — 赛力斯负责

- 不做优先级仲裁和队列管理 — 赛力斯负责

- 不做数据埋点 — 赛力斯负责

**字节侧只负责：**告诉赛力斯端\&\#34;发生了什么\&\#34;（输出标准标签），剩下的都是他们的事。

</div>

## 1\.4 关键指标

- **要快**：标签生成 ≤ 500ms（CV\)，下发 ≤ 200ms

- **要准**：置信度 ≥ 0\.6，模型精度 ≥ 85%（实际车机体验以后灵活标定）

- **要全**：13种感知类型全覆盖，（最终确认10种）插队规则

感知可视化角色分工（对齐SLS\-PRD）

<table><tbody>
<tr>
<td>

角色

</td>
<td>

职责

</td>
<td>

负责人

</td>
</tr>
<tr>
<td>

感知算法

</td>
<td>

输出原始识别结果，包括感知类型、置信度、主体、方位、开始/结束状态

</td>
<td>

字节（徐燃）

</td>
</tr>
<tr>
<td>

业务策略

</td>
<td>

判断感知结果是否可转化为用户可感知事件，补充表现目标、服务联动、是否持续、是否可插队，将不同来源信号统一封装为标准感知事件

</td>
<td>

字节

</td>
</tr>
<tr>
<td>

PHUD仲裁

</td>
<td>

负责优先级排序、队列管理、打断、恢复、防重复、取消

</td>
<td>

赛力斯

</td>
</tr>
<tr>
<td>

PHUD表现

</td>
<td>

根据事件类型、方位、动效模板完成视觉表达

</td>
<td>

赛力斯

</td>
</tr>
<tr>
<td>

数据埋点

</td>
<td>

记录事件触发、入队、展示、打断、取消、点击/联动结果等数据

</td>
<td>

赛力斯

</td>
</tr>
</tbody></table>

# 字节侧研发任务：感知标签生成与下发

<div class="callout">

**【字节侧核心工作章节】**本章是字节侧研发的核心工作内容。字节侧的职责不是\&\#34;转发数据\&\#34;，而是完成从原始感知结果到标准感知事件的完整业务转译：

1\. 接入4路感知源 → 2\. 大模型推理判断 → 3\. 封装标准化标签 → 4\. 下发到PHUD端

具体工作拆解见下方\&\#34;字节侧 4 项核心开发任务\&\#34;。

**字节研发重点（对齐赛力斯 PRD V1\.2\.2）**

字节侧核心工作是**输出标准化感知标签**，标签必须包含以下 3 个关键字段，PHUD 端据此仲裁播放：

**① 分类字段（必带）**：安全报警 / 主动服务 / 事件分享 / 日常感知（4 选 1）

**② 插队等级（必带）**：L1 = 疲劳/分心/危险动作/失能；L2 = FACE ID/体温极值/电话会议/隔空手势/睡觉；其他 = 无插队

**③ 持续性标记（必带）**：电话/会议、体温极值、睡觉 = 持续性感知（持续播放，高优先级打断后恢复）；其他 = 事件型（3\~8s 自动消失）

**PHUD 端播放顺序（字节无需处理，只需正确输出标签）**：安全报警 → L2 可插队 → 主动服务 → 事件分享 → 日常感知

</div>

**10月15日会议纪要：**

- 需求核心逻辑

    - 需求定位：属于主动服务范畴，非赛力斯定制化内容，支持云端可配置、热更新，无需硬编码开发。

    - 触发联动规则：识别到对应视觉条件时，同时触发pihead展示感知可视化图像、屏幕下发豆包碎碎念文字两个动作。

- 技术实现方案

    - 触发器改造

        - 新增执行项：新增P\-HUD图案展示执行项，通过动画ID调用对应接口，新增对应执行项协议。

        - ID规则要求：图案ID需遵循PHead提供的数据协议赋值，当前可选有限集待谢一鸣侧提供。

    - 链路设计：触发器监测端状态、VRM上报推理信号，条件成立后通过专属链路向端侧下发内容，端侧获取资源后完成展示。

    - ID配置方案：可选条件配置阶段开放式输入、平台预定义选项两种方案，标签集选用黄亚娜提及的标签集。

    - 分阶段优化

        - 第一期目标：优先搭通全链路，暂不做高频推理过滤优化，交付可体验版本验证整体效果。

        - 第二期优化：新增正则匹配前置拦截\+兜底模型校验、低成本BERT语义模型识别两类过滤机

## 字节侧 4 项核心开发任务

<table><tbody>
<tr>
<td>

编号

</td>
<td>

任务

</td>
<td>

做什么

</td>
<td>

关键要求

</td>
</tr>
<tr>
<td>

B1

</td>
<td>

视觉识别结果接入

</td>
<td>

接入 DMS/OMS/热成像/舱外视觉 4 路原始识别结果，统一汇聚为大模型可消费的输入格式

</td>
<td>

4 路数据对齐时间戳；丢帧/超时处理；输入字段与感知需求清单一致

</td>
</tr>
<tr>
<td>

B2

</td>
<td>

大模型标签推理服务

</td>
<td>

将视觉识别结果送入大模型，推理输出标准化感知标签（含感知类型、置信度、方位、持续时间等）

</td>
<td>

端侧模型优先（低延迟）；标签输出延迟≤500ms；置信度阈值可配；10 种感知类型全覆盖

</td>
</tr>
<tr>
<td>

B3

</td>
<td>

标签协议定义与输出

</td>
<td>

定义 10 种感知类型的标准化标签格式（字段名、枚举值、数据类型、取值范围），输出给 PHUD 端

</td>
<td>

标签格式稳定可扩展；新增类型不破坏旧协议；与 PHUD 端联调确认

</td>
</tr>
<tr>
<td>

B4

</td>
<td>

标签下发通道



</td>
<td>

将标准化标签通过车机总线/IPC 推送到 PHUD 渲染端，支持事件触发和持续态两种模式

</td>
<td>

事件型标签即时下发（≤200ms）；持续态标签周期刷新；通道断开重连；与 PHUD 端约定 ACK 机制

</td>
</tr>
</tbody></table>

## 13种感知类型标签清单

### CV/VLM 链路分工说明

PHUD 感知可视化用到两条模型链路，分工如下：

<table><tbody>
<tr>
<td>

**链路类型**

</td>
<td>

**负责感知类型**

</td>
<td>

**负责人**

</td>
<td>

**说明**

</td>
</tr>
<tr>
<td>

CV 链路（计算机视觉）

</td>
<td>

疲劳提醒、分心提醒、Face ID、打电话识别、手势识别、睡眠识别、舱外行人识别

</td>
<td>

赛力斯侧算法

</td>
<td>

基于传统 CV 模型，延迟低，适合实时安全类感知

</td>
</tr>
<tr>
<td>

VLM 链路（视觉语言大模型）

</td>
<td>

Always on（高频\+低频）、打电话、睡觉、宠物识别、迎宾空间大件物品识别

</td>
<td>

赛力斯侧算法

</td>
<td>

基于 VLM 大模型，语义理解强，适合复杂场景感知

</td>
</tr>
<tr>
<td>

CV \+ VLM 冗余

</td>
<td>

打电话、睡觉

</td>
<td>

赛力斯侧算法

</td>
<td>

两条链路互为冗余，提高识别准确率

**字节侧研发分工：**

- **张弛（工程）**：负责标签生成与下发的工程链路，包括感知数据接入、标签封装、下发通道

- **尹泽陆（端侧）**：负责端侧对接与联调，包括PHUD端标签接收、播放仲裁逻辑对齐

</td>
</tr>
</tbody></table>



[E68 感知需求清单](https://sai-seres.feishu.cn/wiki/Ui4Cw6UiXie9tbkHuMrcZRpFnFf?sheet=OVeoJj)（前期客户的详细的感知需求清单）

### **一期最终感知清单如下：**

**注意：绿色部分是字节做，白色部分赛力斯实现，红色部分目前沟通中。**

<table><tbody>
<tr>
<td>

**序号**

</td>
<td>

**分类**

</td>
<td>

**感知类型**

</td>
<td>

**是否支持**

</td>
<td>

**标签字段（建议）**

</td>
<td>

**数据来源**

</td>
<td>

**PHUD 画面**

</td>
<td>

**场景感知信号\-参数描述**

</td>
<td>

**感知源**

</td>
<td>

**上报周期**

</td>
<td>

**动效ID**

</td>
</tr>
<tr>
<td>

1



</td>
<td>

日常感知

</td>
<td>

Always on（全时态感知）



</td>
<td>

是



</td>
<td>

perception\_type=always\_on, occupant\_mask, ambient\_state



</td>
<td>

OMS

</td>
<td>

背景绿色粒子\+乘员方位常显

✅

\[Always On\_默认态\.mp4\]

**默认态**

\[Always On\_唤醒态\.mp4\]

**唤醒态**

</td>
<td>

默认态：

dle：待机，仅侦听唤醒词，未激活会话



唤醒态
Listening：聆听中，唤醒成功，正在拾音
Recognizing：识别中，ASR 语音转文字
Thinking：理解推理，NLP 意图解析
Speaking：播报中，TTS 输出


</td>
<td>

VLM：舱内AlwaysOn（高频\+低频）



</td>
<td>

高频约 5 秒

低频约 5min



</td>
<td>

**`cabin\_always\_on`**



</td>
</tr>
<tr>
<td>

2



</td>
<td>

安全报警

</td>
<td>

疲劳提醒

</td>
<td>

是



</td>
<td>

perception\_type=fatigue, level=MILD/MODERATE/SEVERE, perclos\_value

</td>
<td>

DMS

</td>
<td>

红色脉冲遮罩\+疲劳动效



</td>
<td>



</td>
<td>

CV：疲劳提醒（持续闭眼/打哈欠）



</td>
<td>

待补充

</td>
<td>

**`driver\_fatigue\_alert`**

</td>
</tr>
<tr>
<td>

3

</td>
<td>

安全报警



</td>
<td>

分心提醒

</td>
<td>

是



</td>
<td>

perception\_type=distraction, level=MILD/SEVERE, gaze\_zone

</td>
<td>

DMS

</td>
<td>

分心强提醒动效

</td>
<td>



</td>
<td>

CV：分心提醒（猫头鹰式/蜥蜴式）

</td>
<td>

待补充

</td>
<td>

**`driver\_distraction\_alert`**

</td>
</tr>
<tr>
<td>

4

</td>
<td>

主动服务



</td>
<td>

车内人脸识别（Face ID）

</td>
<td>

是



</td>
<td>

perception\_type=face\_id, seat=driver/passenger/rear\_left/rear\_right, user\_id, confidence

</td>
<td>

DMS/OMS

</td>
<td>

扫描线\+光点汇聚动效

✅

\[Always On\_用户识别\.mp4\]

</td>
<td>



</td>
<td>

CV：人脸识别（DMS）\+ FACEID（OMS）

</td>
<td>

待补充



</td>
<td>

**`cabin\_face\_identification`**

</td>
</tr>
<tr>
<td>

5

</td>
<td>

主动服务



</td>
<td>

电话提醒



</td>
<td>

是



</td>
<td>

perception\_type=phone\_call, seat=driver/passenger, state=ongoing/ended

</td>
<td>

DMS/OMS

</td>
<td>

声波震动蓝色持续态

✅

\[Always On\_电话\.mp4\]

</td>
<td>



</td>
<td>

CV：危险动作\-打电话识别；

VLM：舱内AlwaysOn\-高频\-打电话



</td>
<td>

CV：待补充；VLM：约5秒



</td>
<td>

**`front\_occupant\_phone\_call\_alert`**



</td>
</tr>
<tr>
<td>

6



</td>
<td>

日常感知

</td>
<td>

驾驶员头部/视线落点



</td>
<td>

是



</td>
<td>

perception\_type=gaze, head\_pose=\{pitch,yaw,roll\}, gaze\_target=road/screen/passenger/\.\.\.

</td>
<td>

DMS



</td>
<td>

视线方向指示\+头部姿态

✅

\[Always On\_视线\.mp4\]

</td>
<td>



</td>
<td>

—



</td>
<td>

—

</td>
<td>

**`driver\_gaze\_tracking`**



</td>
</tr>
<tr>
<td>

7

</td>
<td>

日常感知

</td>
<td>

多模态控车（手势）



</td>
<td>

是



</td>
<td>

perception\_type=multimodal\_control, gesture=point/swipe/pinch, target\_object

</td>
<td>

OMS/舱外视觉

</td>
<td>

手势识别反馈动效

✅

\[alwaysON\-手势\-OK\.mp4\]



\[alwaysON\-手势\-挥手\.mp4\]

</td>
<td>



</td>
<td>

CV：静态手势/动态手势（OMS全舱）

</td>
<td>

待补充

</td>
<td>

**`vehicle\_gesture\_control`**

</td>
</tr>
<tr>
<td>

8

</td>
<td>

主动服务

</td>
<td>

睡觉

</td>
<td>

是

</td>
<td>

perception\_type=sleeping, seat=driver/passenger/rear\_left/rear\_right, state=start/ongoing/end

</td>
<td>

OMS



</td>
<td>

Z字\+呼吸绿色持续态



</td>
<td>



</td>
<td>

CV：乘员睡眠识别（OMS全舱）；

VLM：舱内AlwaysOn\-高频\-睡觉



</td>
<td>

CV：待补充；VLM：约5秒

</td>
<td>

**`cabin\_occupant\_sleep`**

</td>
</tr>
<tr>
<td>

9



</td>
<td>

日常感知

P0

</td>
<td>

猫狗（宠物）



</td>
<td>

是



</td>
<td>

perception\_type=pet, type=cat/dog, seat/rear\_zone, confidence

</td>
<td>

OMS



</td>
<td>

爪印跳跃橙色动效

\[20261027172231\_rec\_\.mp4\]

\[20261027172153\_rec\_\.mp4\]

区分猫狗

</td>
<td>



</td>
<td>

VLM：舱内AlwaysOn\-低频识别（动物/物品识别）



</td>
<td>

约5min

</td>
<td>

**`cabin\_pet\_presence`**



</td>
</tr>
<tr>
<td>

10



</td>
<td>

主动服务

</td>
<td>

主副驾头部温度



</td>
<td>

是



</td>
<td>

perception\_type=head\_temp, seat=driver/passenger, temp\_value, extreme\_flag=normal/high/low

</td>
<td>

热成像

</td>
<td>

热浪红光晕/冰晶蓝光晕

\[20261027172417\_rec\_\.mp4\]

\[20261027172611\_rec\_\.mp4\]

</td>
<td>

33\-35为面部常规温度

低于33展示低温，高于35展示高温

</td>
<td>

—



</td>
<td>

—



</td>
<td>

**front\_occupant\_head\_temperature**

**driver\_head\_temperature\_high**

**driver\_head\_temperature\_low**

**front\_passenger\_head\_temperature\_high**

**front\_passenger\_head\_temperature\_low**

</td>
</tr>
<tr>
<td>

11



</td>
<td>

事件分享



</td>
<td>

车外人脸识别

识别动作

是否是舱内注册人人（人流密集区可能会有遗漏风险）晚上暗光不支持@代超@徐鹏@黄亚娜@刘嘉毅

</td>
<td>

同12



</td>
<td>

perception\_type=outside\_face, direction=front/left/right/rear, distance, user\_id?



</td>
<td>

舱外视觉

</td>
<td>

方向箭头流\+人员轮廓



</td>
<td>



</td>
<td>

CV：舱外行人识别FACE\_ID（6个周视）

</td>
<td>

待补充



</td>
<td>

**`exterior\_face\_identification`**

</td>
</tr>
<tr>
<td>

12



</td>
<td>

事件分享



</td>
<td>

车外手持行李箱（大件）



</td>
<td>

是



</td>
<td>

perception\_type=outside\_luggage, direction, distance, person\_detected

</td>
<td>

舱外视觉



</td>
<td>

舱外物品感知动效

\[20261028104322\_rec\_\.mp4\]



</td>
<td>



</td>
<td>

VLM：迎宾空间\-识别大件物品



</td>
<td>

约0\.6秒（非周期上报）



</td>
<td>

**`exterior\_luggage\_detection`**



</td>
</tr>
<tr>
<td>

13



</td>
<td>

事件分享



</td>
<td>

充电设施

@丁彬



</td>
<td>

待定



</td>
<td>

perception\_type=charging\_station, state=detected/connecting/charging, soc, power

</td>
<td>

舱外视觉\+车辆CAN

</td>
<td>

充电状态感知动效



</td>
<td>



</td>
<td>

—



</td>
<td>

—



</td>
<td>

**`exterior\_charging\_station\_detection`**



</td>
</tr>
</tbody></table>



**10月27日待确认项**：

1. 拉齐**最终感知清单（字节\&amp;客户）**

2. 客户和字节侧分别负责哪几部分**（字节\&amp;客户）13要dingbin确认**

3. 白色部分（客户），是否需要字节侧来通过端状态接入，不需要字节来做？@宋学波

4. 【已解决】事件分享车外人脸识别（11）客户无法做的原因是什么。@宋学波

5. 动画资源有缺失，需要客户帮忙推进补充@刘嘉毅设计师是@薛恒



## 标签协议规范（建议）

<table><tbody>
<tr>
<td>

字段

</td>
<td>

类型

</td>
<td>

说明

</td>
</tr>
<tr>
<td>

perception\_type

</td>
<td>

enum

</td>
<td>

感知类型，10 种枚举值，必填

</td>
</tr>
<tr>
<td>

timestamp

</td>
<td>

int64

</td>
<td>

标签生成时间戳（ms），必填

</td>
</tr>
<tr>
<td>

confidence

</td>
<td>

float

</td>
<td>

置信度 0\~1，\&lt;0\.6 PHUD 端不展示

</td>
</tr>
<tr>
<td>

seat / direction

</td>
<td>

enum

</td>
<td>

方位：车内=座位，车外=方向

</td>
</tr>
<tr>
<td>

level / state

</td>
<td>

enum

</td>
<td>

等级或状态，按感知类型定义

</td>
</tr>
<tr>
<td>

duration\_mode

</td>
<td>

enum

</td>
<td>

event=事件型（展示3\~8s），continuous=持续态（持续至状态结束）

</td>
</tr>
<tr>
<td>

extra

</td>
<td>

object

</td>
<td>

扩展字段，各感知类型自定义（如 temp\_value、perclos、gaze\_target 等）

</td>
</tr>
</tbody></table>

## 与 PHUD 端的对接约定

1. **PHUD 端职责**：接收标签 → 按 perception\_type 匹配预定义感知画面 → 按 duration\_mode 控制展示时长 → 按优先级仲裁（L1安全报警 \&gt; L2可插队 \&gt; 主动服务 \&gt; 事件分享 \&gt; 日常感知）

2. **字节侧职责**：视觉接入 \+ 大模型推理 \+ 标签输出 \+ 下发通道，不负责 PHUD 端渲染

3. **联调要点**：标签协议需双方确认；10 种类型逐一联调验证；事件型/持续态两种模式均需测试；置信度阈值联调确认

4. **扩展机制**：新增感知类型只需在协议中增加枚举值，PHUD 端预配画面即可，不影响已有类型

<table><tbody>
<tr>
<td>

需求项

</td>
<td>

备注

</td>
</tr>
<tr>
<td>

危险动作提醒（吸烟）

</td>
<td>

L1 插队，仅感知展示

</td>
</tr>
<tr>
<td>

驾驶员无响应（失能）

</td>
<td>

需求待定，智驾主导

</td>
</tr>
<tr>
<td>

遗留物品提醒

</td>
<td>

配合显示物品及方位

</td>
</tr>
<tr>
<td>

异常天气识别

</td>
<td>

雨/雪；雾待定

</td>
</tr>
<tr>
<td>

地标建筑识别

</td>
<td>

试点剪影态

</td>
</tr>
<tr>
<td>

其他情绪行为

</td>
<td>

难过/哭泣/哭闹/打哈欠

</td>
</tr>
<tr>
<td>

多场景组合优化

</td>
<td>

情绪化组合/沉浸态动效细化

</td>
</tr>
<tr>
<td>

隔空手势反馈

</td>
<td>

待业务对齐后定义

</td>
</tr>
</tbody></table>

- 字节大模型：TTFT \&lt; 3s，TPS \&gt; 50 token/s，一次大模型识别 5s 内完成

- 模型精度：85% 以上精度（字节支持项）

- Always on 模型：乘员方位、年龄、性别、行为等依赖持续运行

- 情绪识别置信度阈值：≥ 0\.6 才展示

<table><tbody>
<tr>
<td>

硬件/能力

</td>
<td>

限制说明

</td>
</tr>
<tr>
<td>

舱外 FaceID

</td>
<td>

停车摄像头启动慢（约 1 分钟）；前视 800 万 3 米内，侧视 300 万 1 米内；AVM 畸变

</td>
</tr>
<tr>
<td>

OMS 视线

</td>
<td>

位置较高仅头姿估计，无法精确视线；豆包屏与中控无法区分

</td>
</tr>
<tr>
<td>

体态识别

</td>
<td>

受衣物影响不准确，不支持

</td>
</tr>
<tr>
<td>

豆包屏遮挡

</td>
<td>

遮挡 PHUD 中间区域，设计已规避

</td>
</tr>
<tr>
<td>

图标数量

</td>
<td>

建议 6 个，最高不超过 9 个

</td>
</tr>
<tr>
<td>

PHUD 分辨率

</td>
<td>

待赛力斯确认，坐标规范基于建议值推导

</td>
</tr>
</tbody></table>

<div class="callout">

**本章面向研发工程师**，将 PRD 转化为可执行的开发任务清单。按 6 大模块划分，每个任务标注优先级、依赖关系和对应验收标准。P0 为 SOP 必交付，P1 为 OTA 交付。

</div>

<table><tbody>
<tr>
<td>

模块

</td>
<td>

职责

</td>
<td>

技术方向

</td>
<td>

优先级

</td>
</tr>
<tr>
<td>

M1 渲染引擎

</td>
<td>

PHUD 画面渲染、布局、卡片系统、多版本仪表

</td>
<td>

前端渲染（OpenGL/Vulkan/自研）

</td>
<td>

P0

</td>
</tr>
<tr>
<td>

M2 数据接入层

</td>
<td>

订阅各感知服务数据，解析、校验、缓存

</td>
<td>

中间件/IPC（SOME\-IP/DDS）

</td>
<td>

P0

</td>
</tr>
<tr>
<td>

M3 状态机与仲裁

</td>
<td>

7 种状态管理、事件优先级仲裁、多事件并发处理

</td>
<td>

业务逻辑层

</td>
<td>

P0

</td>
</tr>
<tr>
<td>

M4 动效系统

</td>
<td>

粒子引擎、15 种感知动效、状态切换动效、性能降级

</td>
<td>

前端动画引擎

</td>
<td>

P0（核心）/P1（扩展）

</td>
</tr>
<tr>
<td>

M5 自定义配置

</td>
<td>

卡片拖拽、方向盘按键切换、配置持久化

</td>
<td>

前端 \+ 本地存储

</td>
<td>

P0（基础）/P1（完整）

</td>
</tr>
<tr>
<td>

M6 异常与监控

</td>
<td>

感知模块心跳、数据校验、降级执行、性能监控、日志埋点

</td>
<td>

全栈

</td>
<td>

P0

</td>
</tr>
</tbody></table>

<table><tbody>
<tr>
<td>

编号

</td>
<td>

任务

</td>
<td>

关键要求

</td>
<td>

优先级

</td>
<td>

依赖

</td>
</tr>
<tr>
<td>

M1\-1

</td>
<td>

三分区布局渲染

</td>
<td>

左仪表\(40%\)/中感知\(40%\)/右自定义\(20%\)，按坐标规范实现；安全边距 ≥5%

</td>
<td>

P0

</td>
<td>

PHUD 硬件规格确认（TBD\-1）

</td>
</tr>
<tr>
<td>

M1\-2

</td>
<td>

法规常显层

</td>
<td>

车速、档位、法规灯位独立渲染层，z\-index 最高，任何状态不遮挡；上部灯位区 14 个灯位

</td>
<td>

P0

</td>
<td>

无

</td>
</tr>
<tr>
<td>

M1\-3

</td>
<td>

卡片渲染系统

</td>
<td>

支持小卡\(280×200\)/中卡\(400×280\)/大卡\(560×400\)三种尺寸；右侧区域最多 2 小卡或 1 中大卡

</td>
<td>

P0

</td>
<td>

M1\-1

</td>
</tr>
<tr>
<td>

M1\-4

</td>
<td>

仪表多版本切换

</td>
<td>

经典/智驾/地图三版本，切换动画 ≤500ms；智驾版融合 SR 环境重建

</td>
<td>

P0

</td>
<td>

M1\-1, M2\-6（智驾数据）

</td>
</tr>
<tr>
<td>

M1\-5

</td>
<td>

Boost 模式渲染

</td>
<td>

三屏同步切换驾驶内容，右侧自定义区隐藏；退出后复原

</td>
<td>

P0

</td>
<td>

M1\-1, M3（Boost 状态）

</td>
</tr>
<tr>
<td>

M1\-6

</td>
<td>

驻车沉浸态渲染

</td>
<td>

媒体卡扩展大卡显示歌词/封面；档位车速常显不遮挡；挂挡 500ms 内退出

</td>
<td>

P1

</td>
<td>

M1\-3, M4

</td>
</tr>
</tbody></table>

<table><tbody>
<tr>
<td>

编号

</td>
<td>

任务

</td>
<td>

关键要求

</td>
<td>

优先级

</td>
<td>

依赖

</td>
</tr>
<tr>
<td>

M2\-1

</td>
<td>

DMS 数据接入

</td>
<td>

订阅 DMS 服务 10Hz；解析 11 字段（fatigue\_level/perclos/yawn/distraction/gaze\_zone/smoking/phone\_call/unresponsive/face\_id/head\_pose）；延迟 ≤100ms

</td>
<td>

P0

</td>
<td>

DMS 团队接口对齐

</td>
</tr>
<tr>
<td>

M2\-2

</td>
<td>

OMS 数据接入

</td>
<td>

订阅 OMS 服务 5Hz；解析 12 字段（occupant\_mask/age/gender/emotion\+confidence/behavior/gaze\_target/pet/leftover\_items）；延迟 ≤200ms

</td>
<td>

P0

</td>
<td>

OMS 团队接口对齐

</td>
</tr>
<tr>
<td>

M2\-3

</td>
<td>

热成像数据接入

</td>
<td>

订阅热成像服务 2Hz；解析 5 字段（face\_temp/arm\_temp\_l/arm\_temp\_r/temp\_extreme\_flag）；延迟 ≤500ms

</td>
<td>

P0

</td>
<td>

热成像团队接口对齐

</td>
</tr>
<tr>
<td>

M2\-4

</td>
<td>

舱外视觉数据接入

</td>
<td>

驻车事件触发/行车 1Hz；解析 10 字段（outside\_person距离方位face\_id/group\_type/carrying\_items/charging\_station/environment/weather/security\_event）

</td>
<td>

P0

</td>
<td>

舱外视觉团队接口对齐

</td>
</tr>
<tr>
<td>

M2\-5

</td>
<td>

语音对话状态接入

</td>
<td>

订阅语音服务唤醒/全时免唤醒状态、延时聆听计时；延迟 ≤50ms

</td>
<td>

P0

</td>
<td>

语音团队接口对齐

</td>
</tr>
<tr>
<td>

M2\-6

</td>
<td>

车辆状态接入

</td>
<td>

订阅 CAN 信号：车速、档位、智驾状态、导航状态、媒体状态、电量/续航、Boost 触发、驻车信号；10\~50Hz 按信号

</td>
<td>

P0

</td>
<td>

整车/智驾/导航/媒体团队

</td>
</tr>
<tr>
<td>

M2\-7

</td>
<td>

数据缓存与超时检测

</td>
<td>

每路数据维护最近有效值；超过上报周期 2 倍标记超时；超过 10s 标记模块不可用；触发 M6 降级

</td>
<td>

P0

</td>
<td>

M2\-1\~M2\-6

</td>
</tr>
</tbody></table>

<table><tbody>
<tr>
<td>

编号

</td>
<td>

任务

</td>
<td>

关键要求

</td>
<td>

优先级

</td>
<td>

依赖

</td>
</tr>
<tr>
<td>

M3\-1

</td>
<td>

状态机实现

</td>
<td>

7 种状态（S0常态/S1感知/S2警示/S3对话/S4Boost/S5沉浸/S6编辑）；状态互斥，同时仅一种；按状态流转规则表实现 12 条流转

</td>
<td>

P0

</td>
<td>

M2\-5, M2\-6

</td>
</tr>
<tr>
<td>

M3\-2

</td>
<td>

优先级仲裁

</td>
<td>

L1 安全 \&gt; 对话 \&gt; L2 感知 \&gt; 氛围；S2 警示态不可被任何状态打断；高级别打断低级别时低级别挂起，条件仍成立则恢复

</td>
<td>

P0

</td>
<td>

M3\-1

</td>
</tr>
<tr>
<td>

M3\-3

</td>
<td>

多事件并发处理

</td>
<td>

同级别后到打断先到（不排队）；同一感知源 500ms 内多次上报合并为一次取最新值；感知事件 \&lt;500ms 视为抖动丢弃

</td>
<td>

P0

</td>
<td>

M3\-1

</td>
</tr>
<tr>
<td>

M3\-4

</td>
<td>

状态切换动画触发

</td>
<td>

按状态切换动效表触发对应动画；警示切入 ≤200ms，常态↔感知 300\~500ms，Boost 500ms，沉浸 1000ms

</td>
<td>

P0

</td>
<td>

M3\-1, M4

</td>
</tr>
<tr>
<td>

M3\-5

</td>
<td>

自定义编辑态

</td>
<td>

用户进入自定义模式时切换 S6；编辑期间暂停感知事件展示；确认/退出后恢复并保存配置

</td>
<td>

P1

</td>
<td>

M3\-1, M5

</td>
</tr>
</tbody></table>

<table><tbody>
<tr>
<td>

编号

</td>
<td>

任务

</td>
<td>

关键要求

</td>
<td>

优先级

</td>
<td>

依赖

</td>
</tr>
<tr>
<td>

M4\-1

</td>
<td>

粒子引擎

</td>
<td>

单帧粒子 ≤500；GPU ≤15%；帧率 ≥30fps；支持渐入渐出、颜色、形态、运动轨迹参数化配置

</td>
<td>

P0

</td>
<td>

M1\-1

</td>
</tr>
<tr>
<td>

M4\-2

</td>
<td>

安全警示动效

</td>
<td>

疲劳/分心：红色脉冲波纹\+闪烁，≤200ms 切入，持续至解除；吸烟：橙色烟雾粒子上升，5s

</td>
<td>

P0

</td>
<td>

M4\-1, M2\-1

</td>
</tr>
<tr>
<td>

M4\-3

</td>
<td>

FACE ID 动效

</td>
<td>

扫描线\+光点汇聚，蓝色，400ms 进入，3s 持续，300ms 退出；人员变化时触发

</td>
<td>

P0

</td>
<td>

M4\-1, M2\-1/M2\-4

</td>
</tr>
<tr>
<td>

M4\-4

</td>
<td>

情绪感知动效

</td>
<td>

开心：花朵绽放\+金黄粒子，500ms/8s；难过：雨滴\+冷蓝，500ms/8s；平静：缓慢漂浮灰粒子背景态；置信度 ≥0\.6 才展示

</td>
<td>

P0

</td>
<td>

M4\-1, M2\-2

</td>
</tr>
<tr>
<td>

M4\-5

</td>
<td>

行为感知动效

</td>
<td>

睡觉：Z字\+呼吸节奏绿色，持续至醒来；电话：声波震动蓝色，持续至通话结束；其他行为按动效规格表

</td>
<td>

P0

</td>
<td>

M4\-1, M2\-2

</td>
</tr>
<tr>
<td>

M4\-6

</td>
<td>

温感极值动效

</td>
<td>

发烧：热浪\+红光晕；很冷：冰晶\+蓝光晕；400ms 进入，持续至恢复

</td>
<td>

P0

</td>
<td>

M4\-1, M2\-3

</td>
</tr>
<tr>
<td>

M4\-7

</td>
<td>

乘员方位\+宠物动效

</td>
<td>

座位轮廓光点（蓝色，持续 Always on）；宠物：爪印\+跳跃橙色，5s

</td>
<td>

P0

</td>
<td>

M4\-1, M2\-2

</td>
</tr>
<tr>
<td>

M4\-8

</td>
<td>

舱外感知动效

</td>
<td>

人员靠近：方向箭头粒子流；行车环境：场景剪影粒子（山/海/森林），800ms/10s；视线看豆包：目光连线\+豆包屏联动

</td>
<td>

P1

</td>
<td>

M4\-1, M2\-4/M2\-1

</td>
</tr>
<tr>
<td>

M4\-9

</td>
<td>

状态切换动效

</td>
<td>

常态→感知：粒子扩散\+卡片透明度 30%；任意→警示：红色脉冲全屏；Boost：三屏同步左移缩放；沉浸：氛围渐入

</td>
<td>

P0

</td>
<td>

M4\-1, M3\-4

</td>
</tr>
<tr>
<td>

M4\-10

</td>
<td>

性能降级

</td>
<td>

帧率 20\~30fps：粒子减半关闭次级动效；\&lt;20fps：仅保留安全动效，其他用静态图标；降级阈值可配置

</td>
<td>

P0

</td>
<td>

M4\-1, M6\-4

</td>
</tr>
</tbody></table>

<table><tbody>
<tr>
<td>

编号

</td>
<td>

任务

</td>
<td>

关键要求

</td>
<td>

优先级

</td>
<td>

依赖

</td>
</tr>
<tr>
<td>

M5\-1

</td>
<td>

卡片数据模型

</td>
<td>

7 种卡片类型定义；每种卡片的尺寸、数据源、刷新频率、优先级配置化；支持启用/禁用

</td>
<td>

P0

</td>
<td>

M1\-3

</td>
</tr>
<tr>
<td>

M5\-2

</td>
<td>

方向盘按键切换

</td>
<td>

方向盘按键循环切换右侧卡片组合；按键事件接入与防抖

</td>
<td>

P0

</td>
<td>

M5\-1, M2\-6

</td>
</tr>
<tr>
<td>

M5\-3

</td>
<td>

中控拖拽配置

</td>
<td>

中控屏卡片拖拽到 PHUD 预览区；实时预览；确认后下发配置

</td>
<td>

P1

</td>
<td>

M5\-1, 中控屏团队

</td>
</tr>
<tr>
<td>

M5\-4

</td>
<td>

配置持久化

</td>
<td>

用户配置本地存储；车辆重启后恢复；支持多用户配置（关联 FACE ID）；恢复出厂默认

</td>
<td>

P0

</td>
<td>

M5\-1

</td>
</tr>
<tr>
<td>

M5\-5

</td>
<td>

自动轮换逻辑

</td>
<td>

媒体播放中自动切媒体卡；导航中地图卡最高优先；低电量能耗卡自动弹出；按卡片显示与轮换规则实现

</td>
<td>

P0

</td>
<td>

M5\-1, M3

</td>
</tr>
</tbody></table>

<table><tbody>
<tr>
<td>

编号

</td>
<td>

任务

</td>
<td>

关键要求

</td>
<td>

优先级

</td>
<td>

依赖

</td>
</tr>
<tr>
<td>

M6\-1

</td>
<td>

感知模块心跳检测

</td>
<td>

DMS/OMS 连续 3s 无数据标记不可用；热成像/舱外视觉连续 5s 无数据标记不可用；不可用时隐藏对应感知内容，不提示用户

</td>
<td>

P0

</td>
<td>

M2\-7

</td>
</tr>
<tr>
<td>

M6\-2

</td>
<td>

数据有效性校验

</td>
<td>

字段超范围丢弃；情绪/行为置信度 \&lt;0\.6 不展示；感知事件 \&lt;500ms 视为抖动丢弃；模型推理 \&gt;5s 丢弃本次

</td>
<td>

P0

</td>
<td>

M2\-1\~M2\-4

</td>
</tr>
<tr>
<td>

M6\-3

</td>
<td>

降级策略执行

</td>
<td>

按异常与降级策略表执行：模块不可用→隐藏对应内容；性能降级→粒子减半/静态图标；Boost 模式→暂停感知动效

</td>
<td>

P0

</td>
<td>

M6\-1, M4\-10

</td>
</tr>
<tr>
<td>

M6\-4

</td>
<td>

性能监控

</td>
<td>

实时监控帧率、GPU 占用、内存（≤200MB）；触发降级阈值时上报；性能日志可导出

</td>
<td>

P0

</td>
<td>

M4\-1

</td>
</tr>
<tr>
<td>

M6\-5

</td>
<td>

日志埋点

</td>
<td>

感知事件触发/展示/丢弃全链路埋点；状态切换埋点；用户自定义操作埋点；异常/降级埋点；支持问题回溯

</td>
<td>

P0

</td>
<td>

无

</td>
</tr>
</tbody></table>

<table><tbody>
<tr>
<td>

对接团队

</td>
<td>

对接内容

</td>
<td>

对应任务

</td>
</tr>
<tr>
<td>

DMS 团队

</td>
<td>

疲劳/分心/吸烟/电话/FACE ID/头姿数据接口，10Hz

</td>
<td>

M2\-1

</td>
</tr>
<tr>
<td>

OMS 团队

</td>
<td>

乘员/年龄/性别/情绪/行为/宠物/遗留物数据接口，5Hz

</td>
<td>

M2\-2

</td>
</tr>
<tr>
<td>

热成像团队

</td>
<td>

面部/手臂温度数据接口，2Hz

</td>
<td>

M2\-3

</td>
</tr>
<tr>
<td>

舱外视觉团队

</td>
<td>

舱外人员/充电桩/环境/天气/安全事件数据接口

</td>
<td>

M2\-4

</td>
</tr>
<tr>
<td>

语音团队

</td>
<td>

唤醒状态、全时免唤醒、延时聆听状态接口

</td>
<td>

M2\-5

</td>
</tr>
<tr>
<td>

智驾团队

</td>
<td>

ACC/LCC/NOA 状态、SR 环境重建数据、接管提醒

</td>
<td>

M2\-6, M1\-4

</td>
</tr>
<tr>
<td>

导航团队

</td>
<td>

导航路线、转向提示、车道级引导、到达时间

</td>
<td>

M2\-6, 地图卡

</td>
</tr>
<tr>
<td>

媒体团队

</td>
<td>

播放状态、歌曲信息、进度、歌词

</td>
<td>

M2\-6, 媒体卡

</td>
</tr>
<tr>
<td>

整车控制团队

</td>
<td>

车速、档位、电量、续航、Boost 信号、驻车信号、CAN 信号

</td>
<td>

M2\-6

</td>
</tr>
<tr>
<td>

中控屏团队

</td>
<td>

卡片拖拽配置界面、配置下发通道

</td>
<td>

M5\-3

</td>
</tr>
<tr>
<td>

硬件团队

</td>
<td>

PHUD 实际分辨率、显示区域、色域、豆包屏遮挡坐标

</td>
<td>

M1\-1（TBD\-1/TBD\-2）

</td>
</tr>
</tbody></table>

## 2\.5 条件触发@张嘉锋

在触发器后台预设推理触发的场景，触发器会监测vlm上报的低频、高频、舱外数据，判定预设场景中的目标是否达成，如果目标达成会下发配置好的PHUD动效列表到端侧

[条件触发屏幕系统静默信息展示 PRD](https://bytedance.larkoffice.com/docx/J0Redv242ok9UzxFHzQcZRhJnvh)

# 关联模块

- 设置项：Always On 开关控制感知可视化默认态/休眠态

- 感知模块：提供标准感知事件上游信号

- 主动服务：承接具备服务闭环的感知事件

- 豆包闪念：承接日常感知、情绪氛围、高光环境等内容

然后再写“待确认：主动服务是否与感知项一一对应；豆包闪念的触发边界”。字节侧串链路工作梳理



# 验收标准

## 功能验收

<table><tbody>
<tr>
<td>

验收项

</td>
<td>

验收条件

</td>
<td>

优先级

</td>
</tr>
<tr>
<td>

三分区框架

</td>
<td>

左仪表/中感知/右自定义三区正确显示，比例符合设计

</td>
<td>

P0

</td>
</tr>
<tr>
<td>

仪表多版本切换

</td>
<td>

经典/智驾/地图三版本可切换，切换动画 ≤ 500ms

</td>
<td>

P0

</td>
</tr>
<tr>
<td>

自定义卡片

</td>
<td>

方向盘按键和中控拖拽两种方式均可自定义，配置持久化保存

</td>
<td>

P0

</td>
</tr>
<tr>
<td>

疲劳提醒

</td>
<td>

perclos \&gt; 0\.4 时 ≤ 200ms 内触发警示动效，仪表弹窗不取消

</td>
<td>

P0

</td>
</tr>
<tr>
<td>

分心提醒

</td>
<td>

分心等级 SEVERE 时触发强提醒，MILD 时仅仪表显示

</td>
<td>

P0

</td>
</tr>
<tr>
<td>

FACE ID

</td>
<td>

识别到注册用户时 3s 内展示识别动效，人员变化时触发

</td>
<td>

P0

</td>
</tr>
<tr>
<td>

情绪感知

</td>
<td>

置信度 ≥ 0\.6 时展示对应情绪动效，持续 8s 后渐出

</td>
<td>

P0

</td>
</tr>
<tr>
<td>

睡觉检测

</td>
<td>

识别到睡觉时展示持续态动效，醒来后 500ms 内渐出

</td>
<td>

P0

</td>
</tr>
<tr>
<td>

温感极值

</td>
<td>

体温 ≥ 38℃ 或 ≤ 32\.9℃ 时触发极值动效（体表温度口径，与面部正常范围 33\~35℃ 对齐，避免正常人群误触发冷动画）

</td>
<td>

P0

</td>
</tr>
<tr>
<td>

状态机流转

</td>
<td>

7 种状态按定义流转，S2 警示态不可被打断

</td>
<td>

P0

</td>
</tr>
<tr>
<td>

Boost 模式

</td>
<td>

触发后三屏同步切换驾驶内容，退出后复原

</td>
<td>

P0

</td>
</tr>
<tr>
<td>

异常降级

</td>
<td>

感知模块断开时按降级策略隐藏对应内容，不崩溃不黑屏

</td>
<td>

P0

</td>
</tr>
</tbody></table>

## 性能验收

<div class="callout">

**【字节侧研发关注 \- 技术指标】**以下性能指标是字节侧需要保障的：

• 标签生成延迟：≤500ms（根据实际情况来）

• 标签下发延迟：≤200ms（端到端）

• 置信度阈值：≥0\.6（低于此值不输出标签，根据实际情况调整）

• 模型精度：≥85%（字节侧支持项）

• TTFT \&lt; 3s，TPS \&gt; 50 token/s

</div>

<table><tbody>
<tr>
<td>

指标

</td>
<td>

验收标准

</td>
</tr>
<tr>
<td>

感知事件响应延迟

</td>
<td>

从数据接收到动效开始展示 ≤ 200ms（L1 安全事件）/ ≤ 500ms（L2 感知事件）

</td>
</tr>
<tr>
<td>

动效帧率

</td>
<td>

正常状态 ≥ 30fps，重度降级 ≥ 20fps

</td>
</tr>
<tr>
<td>

GPU 占用

</td>
<td>

正常状态 ≤ 15%，重度降级 ≤ 25%

</td>
</tr>
<tr>
<td>

状态切换动画

</td>
<td>

常态↔感知态 ≤ 500ms，任意→警示态 ≤ 200ms

</td>
</tr>
<tr>
<td>

数据超时处理

</td>
<td>

感知数据超时后按降级策略处理，不出现冻结帧

</td>
</tr>
<tr>
<td>

内存占用

</td>
<td>

PHUD 渲染模块 ≤ 200MB

</td>
</tr>
</tbody></table>

## 2\.3 感知可视化测试重点项（对齐SLS\-PRD）

<table><tbody>
<tr>
<td>

编号

</td>
<td>

测试重点

</td>
<td>

验证方式

</td>
</tr>
<tr>
<td>

T1

</td>
<td>

所有 P0 感知项均能转化为标准感知事件

</td>
<td>

逐一验证10种感知类型标签输出

</td>
</tr>
<tr>
<td>

T2

</td>
<td>

安全报警可打断低优先级感知动画



</td>
<td>

模拟L1安全事件触发，验证低优先级动画被打断

</td>
</tr>
<tr>
<td>

T3

</td>
<td>

安全类L2 插队项优先于主动服务、事件分享、日常感知

</td>
<td>

模拟L2事件与普通事件同时触发，验证L2优先展示

</td>
</tr>
<tr>
<td>

T4

</td>
<td>

持续性感知项被打断后，在信号仍有效时可恢复



</td>
<td>

模拟持续态（睡觉/电话）被高优事件打断，高优结束后验证恢复

</td>
</tr>
<tr>
<td>

T5

</td>
<td>

同一信号 15 分钟内不重复播放



</td>
<td>

模拟同一感知信号15分钟内重复触发，验证不重复播放

</td>
</tr>
<tr>
<td>

T6

</td>
<td>

信号失效且尚未播放时，从队列中取消

</td>
<td>

模拟事件入队后信号失效，验证从队列中取消

</td>
</tr>
<tr>
<td>

T7

</td>
<td>

睡觉、充电设施、物品等方位相关感知能表达主体/方位

</td>
<td>

验证方位相关感知事件携带主体与方位信息



</td>
</tr>
<tr>
<td>

T8

</td>
<td>

隐私模式下敏感事件不在 PHUD 展示

</td>
<td>

开启隐私模式，验证敏感感知事件不展示

</td>
</tr>
<tr>
<td>

T9

</td>
<td>

关键链路埋点完整上报



</td>
<td>

验证事件触发、入队、展示、打断、取消全链路埋点

</td>
</tr>
</tbody></table>

## 2\.4交互验收

<table><tbody>
<tr>
<td>

验收项

</td>
<td>

验收条件

</td>
</tr>
<tr>
<td>

法规常显

</td>
<td>

任何状态下档位、车速、法规灯位不被遮挡

</td>
</tr>
<tr>
<td>

警示优先级

</td>
<td>

S2 警示态触发时，所有其他动效立即让行

</td>
</tr>
<tr>
<td>

多事件仲裁

</td>
<td>

同级别后到打断先到，不同级别高级别打断低级别

</td>
</tr>
<tr>
<td>

语音联动

</td>
<td>

对话激活时感知区域联动豆包屏，对话结束后恢复

</td>
</tr>
<tr>
<td>

自定义持久化

</td>
<td>

用户自定义配置在车辆重启后保持

</td>
</tr>
<tr>
<td>

沉浸态安全

</td>
<td>

驻车沉浸态下挂挡行驶时 500ms 内退出沉浸态

</td>
</tr>
</tbody></table>

# 优先级汇总

## SOP 必交付（客户P0）

<table><tbody>
<tr>
<td>

分类

</td>
<td>

需求项

</td>
<td>

备注

</td>
</tr>
<tr>
<td rowspan="2">

安全警示

</td>
<td>

疲劳提醒

</td>
<td>

L1 插队

</td>
</tr>
<tr>
<td>

分心提醒

</td>
<td>

L1 插队，分强弱

</td>
</tr>
<tr>
<td rowspan="3">

身份感知

</td>
<td>

FACE ID（DMS\+OMS）

</td>
<td>

L2 插队

</td>
</tr>
<tr>
<td>

乘员方位

</td>
<td>

实时检测

</td>
</tr>
<tr>
<td>

舱外 FACE ID 迎宾

</td>
<td>

限定注册人员

</td>
</tr>
<tr>
<td rowspan="2">

行为感知

</td>
<td>

睡觉检测

</td>
<td>

L2 插队，有持续态

</td>
</tr>
<tr>
<td>

电话/会议状态

</td>
<td>

L2 插队，有持续态

</td>
</tr>
<tr>
<td>

情绪感知

</td>
<td>

情绪识别（开心/难过/平静）

</td>
<td>

粒子动效

</td>
</tr>
<tr>
<td>

视线感知

</td>
<td>

看豆包/中控弱提示

</td>
<td>

四载体联合动效

</td>
</tr>
<tr>
<td>

物品识别

</td>
<td>

宠物类别（猫/狗）

</td>
<td>

特殊乘客

</td>
</tr>
<tr>
<td>

温感

</td>
<td>

人体温区极值

</td>
<td>

L2 插队，有持续态

</td>
</tr>
<tr>
<td>

框架能力

</td>
<td>

三分区框架\+四层级\+自定义\+状态机

</td>
<td>

仪表多版本切换

</td>
</tr>
<tr>
<td rowspan="2">

舱外感知

</td>
<td>

充电设施识别

</td>
<td>

配合无感开盖

</td>
</tr>
<tr>
<td>

行车环境识别

</td>
<td>

限定场景

</td>
</tr>
<tr>
<td>

工程能力

</td>
<td>

异常降级\+性能监控\+验收达标

</td>
<td>

不崩溃不黑屏

</td>
</tr>
</tbody></table>

### 温度感知细节说明（对齐张嘉锋输入）

**体表温度与冷热感知：**体表温度反应乘车人员的冷热感知状况。成年人正常面部体温在 33\.0℃ \- 35\.0℃ 之间，裸露的手臂温度会略低一些，在 32\.0℃ \- 34\.0℃ 之间。高温或低温环境会使得这个值上下浮动，运动后也会略有提升，此时应采取一些温度调整策略达到舒适的环境。人群差异：小孩的体温略高于正常值，老人的体温略低于正常值，女性的体温略低于男性。

**座椅表面温度区间（体感分级参考）：**

<table><tbody>
<tr>
<td>

**区间**

</td>
<td>

**定义**

</td>
<td>

**体感描述**

</td>
</tr>
<tr>
<td>

低于 18 ℃

</td>
<td>

明显偏冷区

</td>
<td>

坐上去会有冷刺激，尤其是真皮、金属附近、短裤/薄裤时更明显

</td>
</tr>
<tr>
<td>

18\-24 ℃

</td>
<td>

偏冷但可接受区

</td>
<td>

会觉得凉，但多数人仍能接受，适合冬季刚启动、车内仍在回暖阶段

</td>
</tr>
<tr>
<td>

24\-32 ℃

</td>
<td>

舒适区

</td>
<td>

接触感最自然，既没有明显冷感，也不会有热压感，通常最适合长时间乘坐

</td>
</tr>
<tr>
<td>

32\-36 ℃

</td>
<td>

偏热但可接受区

</td>
<td>

开始有温热感，短时间可以接受，但长坐会逐步觉得闷

</td>
</tr>
<tr>
<td>

36\-40 ℃

</td>
<td>

不舒服区

</td>
<td>

热感明显，背部、大腿接触面会开始觉得发烫或黏

</td>
</tr>
<tr>
<td>

高于 40 ℃

</td>
<td>

明显异常区

</td>
<td>

热感强烈，需及时调整（对应温感极值动效触发）

</td>
</tr>
</tbody></table>

**面部温度分级（双动画方案，体表温度口径）：**

<table><tbody>
<tr>
<td>

**等级**

</td>
<td>

**温度区间**

</td>
<td>

**extreme\_flag**

</td>
<td>

**动画**

</td>
</tr>
<tr>
<td>

极冷

</td>
<td>

\&lt; 31℃

</td>
<td>

low

</td>
<td>

冷动画（冰晶蓝光晕）

</td>
</tr>
<tr>
<td>

偏冷

</td>
<td>

31 \~ 32\.9℃

</td>
<td>

low

</td>
<td>

冷动画（冰晶蓝光晕）

</td>
</tr>
<tr>
<td>

正常

</td>
<td>

33 \~ 37℃

</td>
<td>

normal

</td>
<td>

无动画

</td>
</tr>
<tr>
<td>

偏热（过渡带）

</td>
<td>

37\.1 \~ 37\.9℃

</td>
<td>

high

</td>
<td>

无动画（仅打标签）

</td>
</tr>
<tr>
<td>

热

</td>
<td>

≥ 38℃

</td>
<td>

high

</td>
<td>

热动画（热浪红光晕）

</td>
</tr>
</tbody></table>

以成年人正常面部体表温度 33\~35℃ 为基准：冷动画阈值卡在正常下限以下（≤32\.9℃），热动画对齐发烧标准（≥38℃），正常区间 33\~37℃ 不播动画。37\.1\~37\.9℃ 为偏热过渡带，仅打 high 标签、不播动画。

## 项目人员与需求分工

### 人员分工

<table><tbody>
<tr>
<td>

角色

</td>
<td>

姓名

</td>
<td>

所属方

</td>
<td>

职责

</td>
</tr>
<tr>
<td>

产品负责人

</td>
<td>

黄亚娜

</td>
<td>

字节

</td>
<td>

PHUD 感知可视化产品需求定义、优先级管理、跨方对接（原徐洋负责，现由黄亚娜代替）

</td>
</tr>
<tr>
<td>

交互设计

</td>
<td>

尹尧

</td>
<td>

字节

</td>
<td>

PHUD 感知可视化交互设计

</td>
</tr>
<tr>
<td>

研发协作

</td>
<td>

赵衍

</td>
<td>

字节

</td>
<td>

感知可视化研发协作

</td>
</tr>
<tr>
<td>

研发协作

</td>
<td>

谢一鸣

</td>
<td>

字节

</td>
<td>

感知可视化研发协作

</td>
</tr>
<tr>
<td>

研发协作

</td>
<td>

张驰

</td>
<td>

字节

</td>
<td>

感知可视化研发协作

</td>
</tr>
<tr>
<td>

感知算法



</td>
<td>

徐燃



</td>
<td>

字节

</td>
<td>

输出原始识别结果，包括感知类型、置信度、主体、方位、开始/结束状态

</td>
</tr>
<tr>
<td>

赛力斯侧对接

</td>
<td>

柳雷

</td>
<td>

字节

</td>
<td>

赛力斯侧测试对接

</td>
</tr>
<tr>
<td>

赛力斯侧对接

</td>
<td>

于俊

</td>
<td>

字节

</td>
<td>

赛力斯侧项目对接

</td>
</tr>
<tr>
<td>

产品

</td>
<td>

李想

</td>
<td>

赛力斯

</td>
<td>

PHUD CRD 详细需求定义

</td>
</tr>
<tr>
<td>

产品

</td>
<td>

刘嘉毅

</td>
<td>

赛力斯

</td>
<td>

PHUD PRD 概述需求

</td>
</tr>
<tr>
<td>

交互设计

</td>
<td>

陈曦

</td>
<td>

赛力斯

</td>
<td>

PHUD 交互设计

</td>
</tr>
</tbody></table>



