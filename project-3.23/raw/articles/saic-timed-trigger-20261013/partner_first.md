# 【DNA\-530】动态advisor 一期 需求文档 OnePage

## 一、流程梳理

用模型生成创建订阅，创建订阅过程为异步\(因为耗时很长\),  同时要选context的筛选器

## 二、依赖梳理

### 开发依赖

**Planner**

看上去没有新的依赖需求



**Context**

看具体场景，需要支持演示场景包含的状态字段可筛选可查



**触发器**

1. 触发器的能力输出\(哪些信号状态是可用的，文字给到模型\) [触发器条件](https://bytedance.larkoffice.com/wiki/RskXwNWmEi0EQ3kaZPUcES9BnSg)

2. *新增开发需求：callback 类型，由注册场景时传入，条件达成后回调 *@吴仁杰

3. 两个条件触发同时触发执行（@吴仁杰430版本可以先follow触发器现有机制）

4. ~~新增订阅接口的需求~~

5. ~~新增取消订阅接口的需求~~

6. ~~事件触发接口：能够满足回传订阅的自定义事件~~

[触发器接口文档【对外】](https://bytedance.larkoffice.com/docx/KhxTdbvzioV8djxl9qpcnB1SnVc)

[触发器 DSL 定义【对外】](https://bytedance.larkoffice.com/docx/TuDldeM72o3ksNxtbLzc8q2tnBg)

@刘杨



**~~VQA服务~~**

1. ~~vqa是否支持json格式输出：可输入SP，返回格式如 \{\&\#34;result\&\#34;:True,\&\#34;description\&\#34;:\&\#34;后排小朋友睡的很香\&\#34;\}~~

2. ~~新增订阅接口的需求~~

3. ~~新增取消订阅接口的需求~~

4. ~~事件触发接口：能够满足回传订阅的自定义事件~~



**图片服务**

获取车内外指定位置的URL @吕鹏浩

[摄像头图片获取接口文档【对外】](https://bytedance.larkoffice.com/docx/ErFeds6TNouZohxaahUcTk3fnrc)



### 产品依赖

@郝晓伟

1. 重要的典型场景

2. 重要的knowhow

3. 重要的fewshot

4. ~~vqa的能力边界：什么样的场景适合vqa去做，什么样的是不适合~~

5. 怎么选订阅，哪类场景适合哪种事件订阅

6. \(可选\) 提示词迭代的深度参与



## 三、实现思路参考

1. 偏瞬时需要精准时间点review的走触发器\(此时不配置定时\)

2. 其它都走定时

3. 需vlm配合的，定时触发前捞vlm



## 四、动态Advisor 交互设计

### 一、创建阶段

#### v 0\.6（仅备份，见v1\.0）

#### v1\.0

### 二、执行阶段

- 任务岛提醒\&amp;状态栏

- 卡片提醒

- 卡片状态更新

## 五、产品必过集

<table><tbody>
<tr>
<td>

类型

</td>
<td>

Case

</td>
<td>

创建时要求

</td>
<td>

执行要求

</td>
</tr>
<tr>
<td>

定时任务

</td>
<td>

5分钟后帮我关闭空调

</td>
<td>

遵循通用交互逻辑

</td>
<td>

指定时间到达时能准确触发

</td>
</tr>
<tr>
<td>

条件任务

</td>
<td>

副驾上车时，和他开个玩笑，说他是通缉犯

</td>
<td>

遵循通用交互逻辑

</td>
<td>

指定条件发生时能准确触发

</td>
</tr>
<tr>
<td>



</td>
<td>

主驾下车时，和他说拜拜

</td>
<td>

遵循通用交互逻辑

</td>
<td>

指定条件发生时能准确触发

</td>
</tr>
<tr>
<td>



</td>
<td>

车内温度高于25 度时，帮我调低空调

</td>
<td>

遵循通用交互逻辑

</td>
<td>

指定条件发生时能准确触发

</td>
</tr>
<tr>
<td>



</td>
<td>

车速高于 80 时，提醒我慢点开

</td>
<td>

遵循通用交互逻辑

</td>
<td>

指定条件发生时能准确触发

</td>
</tr>
<tr>
<td>



</td>
<td>

任意位置车门打开时，提醒注意周边环境

</td>
<td>

遵循通用交互逻辑

</td>
<td>

指定条件发生时能准确触发

</td>
</tr>
<tr>
<td>

长时任务

</td>
<td>

帮我照看下主驾，如果他有什么异常行为请提示我

</td>
<td>

敏感权限需二次确认

</td>
<td>

结束时机判别

满足条件时提醒

</td>
</tr>
<tr>
<td>



</td>
<td>

每隔5分钟帮我播报下当前实时金价

</td>
<td>



</td>
<td>

结束时机判别

满足条件时提醒

正确字段传出

</td>
</tr>
<tr>
<td>

~~长程任务~~

</td>
<td>

~~帮我点杯咖啡到公司~~

</td>
<td>

~~成功绑定GUI Agent目标~~

</td>
<td>

~~明确结束后退出~~

</td>
</tr>
<tr>
<td colspan="4">

**其他亮点Case，不作为必过集**

</td>
</tr>
<tr>
<td colspan="4">

我想要冥想 ✅

</td>
</tr>
<tr>
<td colspan="4">

带我去兜风

</td>
</tr>
<tr>
<td colspan="4">

介绍下沿途的风景

</td>
</tr>
<tr>
<td colspan="4">

照顾下车上的老人/小孩

</td>
</tr>
<tr>
<td colspan="4">

陪我玩游戏

</td>
</tr>
<tr>
<td colspan="4">

帮我停到电梯口

</td>
</tr>
<tr>
<td colspan="4">

每海拔高100m，提醒用户一下

</td>
</tr>
<tr>
<td colspan="4">

体验下所有座椅的功能

</td>
</tr>
<tr>
<td colspan="4">

每天给我播放一次当日的各股指数

</td>
</tr>
</tbody></table>

## 六、冲刺阶段 Daily Log

[AiCar\-上汽DNA项目\-Badcase反馈问题表](https://bytedance.larkoffice.com/base/ZVlUb9tbcabDDzstcoyc2xAxnKf?from=from_copylink)

### 20250520

[20250520 动态 adv Bug 跟踪详情](https://pq3b44yw2t9.feishu.cn/wiki/IJT6wWV7BiQNYLkilpOcPtZUngd?from=from_copylink)

- 



## 七、VLM 测试 Case 汇总

<table><tbody>
<tr>
<td>

Case

</td>
<td>

位置

</td>
<td>

视觉条件

</td>
<td>

实车 10 次测试通过率

</td>
</tr>
<tr>
<td>

\{位置\}睡着了的话，帮他把空调调小、车窗关闭

</td>
<td>

主驾

</td>
<td>

主驾进入睡眠

</td>
<td>



</td>
</tr>
<tr>
<td>



</td>
<td>

副驾

</td>
<td>

副驾进入睡眠

</td>
<td>



</td>
</tr>
<tr>
<td>



</td>
<td>

后排左

</td>
<td>

后排座进入睡眠

</td>
<td>



</td>
</tr>
<tr>
<td>



</td>
<td>

后排右

</td>
<td>

后排右进入睡眠

</td>
<td>



</td>
</tr>
<tr>
<td>



</td>
<td>

后排中

</td>
<td>

后排右进入睡眠

</td>
<td>



</td>
</tr>
<tr>
<td>

\{位置\}把手伸出窗外的话，吐槽他不注意安全

</td>
<td>



</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>

等下我把手指向哪个位置，你就关闭那个位置的车窗

</td>
<td>



</td>
<td>



</td>
<td>



</td>
</tr>
</tbody></table>

## 八、笔记

**定时器：**

yt自己可以闭环



**触发器**

需要触发器模块支持，~~最好是输入一个文本，返回创建成功失败和事件类型~~。对齐该协议。

脚本生成的自然语言解析得我们自己做。

超然



**vlm**

只接vqa，不接端模。云对云对接，也是一个文本过去，甚至prompt，可以注入一个规则，比如判断后排小朋友是否睡着，返回 \{\&\#34;result\&\#34;:True,\&\#34;description\&\#34;:\&\#34;后排小朋友睡的很香\&\#34;\}

鹏浩



**固定触发**

定时一般要有（现在需要可以选择定时review的间隔，或者我给个分档，10s，30s，60s，。。。。。，创建时有模型去选，特殊情况在goal的目标中指明了间隔，要支持自定义。每10秒播报勇士的比分）

qa结束可以先放上去看效果



**订阅触发**

创建advisor时，模型去选触发器，生成条件



**通知**

沿用之前模拟器推事件给advisor的链路，但是不直接返回模拟器advice信息，advice统一由动态advisor直接推给planner



**触发优先级**

订阅的事件最高

其次是qa结束

其次是定时

高优先级的触发会打断低优的触发，反之不成立。



**最大任务数**

暂时还是保持2（gui、普通任务）

后面的趋势，全局一个实例，一个prompt去管理多个目标



**支持提示词迭代\(可选项\)**

取决于明骏的时间



**触发器如果生成不了**

走默认review逻辑，查context



## （非开发目标，Preview）非即时任务统一处理框架（长期方向）

目标：统一所有**条件（定时）任务、目标任务（当前的动态Advisor）、用户日程****~~、Plan Mode~~**

动机：以Agent驱动实现所有的非即时任务，作为统一的I/O，完成复杂的长时任务编排

Scope：

- 条件满足时才做的任务（十分钟后关闭车窗、到达收费站时降下主驾车窗），支持跨上下电

- 需要持续做，并且中途有澄清或播报需求的任务（GUI Agent、目标任务），不支持跨上下电，同一仅支持一个

- 用户日程，以及围绕日程的一些子日程。

    - 父日程是以时间和地点为隐含Trigger，进行状态更新或其他服务（如提醒）

        - 只有当时间和地点都满足时，才结束

        - 只满足时间时，可以理解为日程的变更

        - 只满足地点时，不视为日程的变更

        - 时间和地点都是区间

        - 父日程不是条件任务

- 子日程可以是以时间或地点为触发条件的条件任务

- ~~Plan Mode~~

本质：多任务异步执行

核心调度依据：用户注意力稀缺

功能：多任务同时发生时，播报策略的智能化



```Markdown
# 提示词结构
- 系统设定

- 任务清单
    - 当前已注册的条件任务
    - 当前正在执行的动态Advisor
    - 当前用户的日程
    
- 工具
    - 联网搜索
    - 记忆查询
    - Context查询
    - 清理任务
    - 执行任务
    - RUN_CODE
    
- AI-HMI
    - FAST_BUTTON
    - SMART_ICON
    
- 心跳机制说明
    - HEARTBEAT OK
    - 事件触发机制
    
- SKILL系统
    - 照看后排宝宝的业务逻辑
    - GUI Agent管理的业务逻辑
```

## 



## 八、


