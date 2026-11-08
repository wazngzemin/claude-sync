# 端侧模型规划（8397 vs AI\-Box）

### 版本管理



# 总览





# VLM（30B\-MoE vs 4B\-Dense）

<table><tbody>
<tr>
<td>

产品

</td>
<td>

功能

</td>
<td>

**AIbox\-****30B MoE**

</td>
<td>

**QC8797\-****4B Dense**

</td>
<td>

输出

</td>
<td>

场景描述

</td>
<td>

要求

</td>
</tr>
<tr>
<td>

智驾增强



</td>
<td>

指令泊车

</td>
<td>

✅

</td>
<td>

❌

</td>
<td>

Grounding BBOX

</td>
<td>

视觉参照物临停/泊入        

1. 帮我留意一个靠电梯间/ 离出口近/ 充电桩的停车位

2. 停在阴凉的地方

3. 在前方红衣服拉行李箱的小女孩旁边停下

</td>
<td>

较高的模型泛化能力

较快的模型推理速度

</td>
</tr>
<tr>
<td>

VQA

</td>
<td>

VQA

舱内遗留问答

</td>
<td>

✅

</td>
<td>

✅

</td>
<td>

Caption

</td>
<td>

遗留物查询       

1. 看看我的保温杯放在车哪里了

2. 我手机放在车后排了么

3. 看看我的包是不是放在后排座位了

</td>
<td>

模型均可支持，对于信息描述的丰富度与物品识别的准确度会有区别

</td>
</tr>
<tr>
<td rowspan="2">

Always On

</td>
<td>

Always On  

舱内通用caption

</td>
<td>

✅

</td>
<td>

✅

</td>
<td>

Structured Caption

</td>
<td>

对舱内客观现状的自然语言复述 

对每个位置的乘客单独描述，内容包含：乘客的着装、位置、动作、神态（情绪、精神状态）；物品的位置和类型描述

</td>
<td>

模型均可支持，对于信息描述的丰富度与物品识别的准确度会有区别

</td>
</tr>
<tr>
<td>

Always On  

舱外通用caption

</td>
<td>

✅



</td>
<td>

❌

</td>
<td>

Structured Caption

</td>
<td>

对舱外客观现状的自然语言复述 

车外的天气情况、交通情况、建筑信息、交通信号灯、交通标志、路况信息，以及当前车的所在环境和其周围的动物、特殊车辆识别（洒水车、救护车、消防车、警车、垃圾车、货车）

</td>
<td>

较高的模型泛化能力

较快的模型推理速度

</td>
</tr>
<tr>
<td rowspan="2">

动态Advisor

</td>
<td>

舱外长时动态感知 

\-POI增强（景点介绍）

</td>
<td>

✅

</td>
<td>

❌

</td>
<td>

Caption

</td>
<td>

利用动态感知能力，查询周边有哪些景点，识别景点、景色、标志建筑、动物，作为导航POI信息的补充。以此作为检索依据

</td>
<td>

较高的模型泛化能力

较快的模型推理速度

多任务并发能力

</td>
</tr>
<tr>
<td>

舱内长时动态感知 

\-乘客照看（宝宝状态）

</td>
<td>

✅

</td>
<td>

❌



</td>
<td>

Caption

</td>
<td>

帮我照看一下后排小朋友，如果被子没盖好告诉我一下（观察后排是否有婴幼儿，观测他的状态，如睡眠、哭闹；以及车辆状态，如童锁等；孩子行为类监控：睡觉多久，玩手机多久，看后排屏幕多久，看窗外多久？）

</td>
<td>

较高的模型泛化能力

较快的模型推理速度

多任务并发能力

</td>
</tr>
<tr>
<td rowspan="4">

系统预设

端侧闭环任务



</td>
<td>

智能哨兵

</td>
<td>

✅

</td>
<td>

✅

</td>
<td>

Structured Label\+Caption

</td>
<td>

危险人物、车辆动作：划车、砸车、开门杀\.\.\. 远程通知/车控

</td>
<td>

理解带有畸变的Camera图像

视频输入动态多图响应速度高

</td>
</tr>
<tr>
<td>

停车寻车\+缴费

</td>
<td>

✅

</td>
<td>

✅

</td>
<td>

Structured Label\+Grounding



</td>
<td>

识别停车场二维码，显示在车机大屏，方便用户扫码缴费/发送到手机侧离场前提前缴费

识别车在商场 F2的A区3246车位（具体车位），以及明显的参照物：可以看到6号电梯厅入口

</td>
<td>

理解带有部分运动模糊的Camera图像

携带上下文信息进行推理结果输出

</td>
</tr>
<tr>
<td>

舱外迎宾

</td>
<td>

✅

</td>
<td>

✅

</td>
<td>

Structured

（Label非有限集）

</td>
<td>

识别舱外人员状态，如怀抱婴儿、行动不便、携带大件物品及重物

</td>
<td>

基于小模型grouding后图像进行详细识别

</td>
</tr>
<tr>
<td>

上下车安全

</td>
<td>

✅

</td>
<td>

✅

</td>
<td>

Structured

（Label非有限集）

</td>
<td>

识别妨碍上下车和开门的障碍物和异常路面

</td>
<td>

基于小模型grouding后图像进行详细识别

</td>
</tr>
</tbody></table>



<table><tbody>
<tr>
<td>

图（百万像素）

</td>
<td>

识别帧

</td>
<td>

标签输出 TT

（预处理\+prefill\+decoder2lasttoken）

</td>
<td>

Caption（100字）输出 TT

（预处理\+prefill\+decoder2lasttoken）

</td>
<td>

二维码输出

</td>
</tr>
<tr>
<td>

2M @1920\*1080  舱外

</td>
<td>

单帧

</td>
<td>

600ms

</td>
<td>

800ms

</td>
<td>

无此需求

</td>
</tr>
<tr>
<td>

2M @1920\*1080  舱外

</td>
<td>

连续5帧（不包含抽帧逻辑）

</td>
<td>

800ms

</td>
<td>

1000ms

</td>
<td>

无此需求

</td>
</tr>
<tr>
<td>

5M @2592\*1944  舱外

</td>
<td>

单帧

</td>
<td>

700ms

</td>
<td>

900ms

</td>
<td>

无此需求

</td>
</tr>
<tr>
<td>

5M @2592\*1944  舱外

</td>
<td>

连续5帧（不包含抽帧逻辑）

</td>
<td>

900ms

</td>
<td>

1100ms

</td>
<td>

无此需求

</td>
</tr>
<tr>
<td>

8M @3840\*2160  舱外

</td>
<td>

单帧（提取二维码）

</td>
<td>

无此需求

</td>
<td>

无此需求

</td>
<td>

1000ms

</td>
</tr>
</tbody></table>



# 支撑文档：

[【AI汽车】视觉场景梳理](https://bytedance.larkoffice.com/wiki/RSAiwOOySiPNuGkVnYkc0StgnGg?sheet=cmAgLF)

[【Always\-on】端侧多模态场景功能](https://bytedance.larkoffice.com/docx/JbFod2bavoG8JDxerzgcngrvnIp)

[端侧主流 VLM 模型市场调研报告](https://bytedance.larkoffice.com/docx/OlECdEPfGoWKE6x0WsQcfo0indH)

[【AlwaysOn】端侧感知任务：VLM优化方案设计](https://bytedance.larkoffice.com/wiki/GQyTw1N53i8iIck4RgSc2Vklnhe)

[智能座舱模型在 OrinY 上的性能及资源估算](https://bytedance.larkoffice.com/docx/IBhPd30QKoIp3hxx7YxcVevonQb)



# 历史版本




