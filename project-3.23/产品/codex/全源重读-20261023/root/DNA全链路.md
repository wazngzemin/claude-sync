# 【DNA1\.0】语音全链路/豆包能力产品架构和功能



**全****链路****架构：**

[AI汽车1\.0 架构图](https://bytedance.larkoffice.com/docx/UBPpd284hoRNMtxT7u3cvXIanIg)



**革新点：**

1. 是否唤醒无所谓，全时交互。

2. 方言和普通话混合识别。

3. 理解模型加入场景感知预测能力

    1. 长期记忆的补充  

    2. 模糊表达的主动询问和反馈

4. 交互表达

    1. 规则对话模块转向模型对话引擎

        1. VUI自生成：对话回复语，通过模型与场景匹配自生成（非人为编辑写死，可提供人设统一和回复多样性）

        2. GUI自生成：交互界面与场景结合模型生成（更简洁高效）

    2. 方言进，方言出（期望，待实验）

    3. 音色更拟人，有趣。

5. 持续反思（老师批改学生作业模式）

<table><tbody>
<tr>
<td colspan="3">

端到端语音链路Feature list

</td>
<td colspan="3">

PRD计划

</td>
</tr>
<tr>
<td>

功能L0

</td>
<td>

功能L1

</td>
<td>

功能L2

</td>
<td>

产品概览

</td>
<td>

初版PRD

</td>
<td>

终版PRD

</td>
</tr>
<tr>
<td>

端到端语音

</td>
<td>

基础能力

</td>
<td>

前端信号处理

</td>
<td>

6月中

</td>
<td>

6月中

</td>
<td>

6月下

</td>
</tr>
<tr>
<td>



</td>
<td>



</td>
<td>

语音唤醒

</td>
<td>

6月中

</td>
<td>

6月中

</td>
<td>

6月下

</td>
</tr>
<tr>
<td>



</td>
<td>



</td>
<td>

多音区同时交互

</td>
<td>

6月中

</td>
<td>

6月中

</td>
<td>

6月下

</td>
</tr>
<tr>
<td>



</td>
<td>



</td>
<td>

全时交互（全时全场景免唤醒）

</td>
<td>

6月中

</td>
<td>

6月中

</td>
<td>

6月下

</td>
</tr>
<tr>
<td>



</td>
<td>

模型服务

</td>
<td>

端侧语音识别模型

</td>
<td>

6月下

</td>
<td>

7月中

</td>
<td>

7月底

</td>
</tr>
<tr>
<td>



</td>
<td>



</td>
<td>

端侧语义理解模型

</td>
<td>

6月下

</td>
<td>

7月中

</td>
<td>

7月底

</td>
</tr>
<tr>
<td>



</td>
<td>



</td>
<td>

端侧语音合成模型

</td>
<td>

6月下

</td>
<td>

7月中

</td>
<td>

7月底

</td>
</tr>
<tr>
<td>



</td>
<td>



</td>
<td>

端侧视觉理解模型

</td>
<td>

6月下

</td>
<td>

7月中

</td>
<td>

7月底

</td>
</tr>
<tr>
<td>



</td>
<td>



</td>
<td>

端侧仲裁模型（离在线引擎结果仲裁，服务场景仲裁）

</td>
<td>

7月中

</td>
<td>

8月初

</td>
<td>

8月底

</td>
</tr>
<tr>
<td>



</td>
<td>



</td>
<td>

端侧对话管理服务模型（生成式对话）

</td>
<td>

7月中

</td>
<td>

8月初

</td>
<td>

8月底

</td>
</tr>
<tr>
<td>



</td>
<td>



</td>
<td>

端到端语音模型（云端）

</td>
<td>

7月中

</td>
<td>

8月初

</td>
<td>

8月底

</td>
</tr>
<tr>
<td>



</td>
<td>



</td>
<td>

主动服务推理模型（Alwasys on模式）

</td>
<td>

7月中

</td>
<td>

8月初

</td>
<td>

8月底

</td>
</tr>
<tr>
<td>



</td>
<td>



</td>
<td>

生成式交互反馈模型

</td>
<td>

8月底

</td>
<td>

9月初

</td>
<td>

9月底

</td>
</tr>
<tr>
<td>



</td>
<td>



</td>
<td>

长短期记忆模型

</td>
<td>

8月底

</td>
<td>

9月初

</td>
<td>

9月底

</td>
</tr>
<tr>
<td>



</td>
<td>



</td>
<td>

场景感知预测

</td>
<td>

8月底

</td>
<td>

9月初

</td>
<td>

9月底

</td>
</tr>
<tr>
<td>



</td>
<td>



</td>
<td>

反思迭代模型（快慢思考）

</td>
<td>

8月底

</td>
<td>

9月初

</td>
<td>

9月底

</td>
</tr>
<tr>
<td>



</td>
<td>



</td>
<td>

服务适配模块（对接系统服务）

</td>
<td>

7底

</td>
<td>

8月初

</td>
<td>

8月底

</td>
</tr>
<tr>
<td>



</td>
<td>



</td>
<td>

引擎对外服务（ASR，TTS）

</td>
<td>

8月底

</td>
<td>

9月初

</td>
<td>

9月底

</td>
</tr>
<tr>
<td>



</td>
<td>

用户体验

</td>
<td>

大模型助手形象（豆包形象）

</td>
<td>

7月中

</td>
<td>

8月初

</td>
<td>

8月底

</td>
</tr>
<tr>
<td>



</td>
<td>



</td>
<td>

大模型交互表达界面（对话HMI）

</td>
<td>

7月中

</td>
<td>

8月初

</td>
<td>

8月底

</td>
</tr>
<tr>
<td>



</td>
<td>



</td>
<td>

舒适用车智能体

</td>
<td>

NA

</td>
<td>

NA

</td>
<td>

NA

</td>
</tr>
<tr>
<td>



</td>
<td>



</td>
<td>

生态娱乐智能体

</td>
<td>

NA

</td>
<td>

NA

</td>
<td>

NA

</td>
</tr>
<tr>
<td>



</td>
<td>



</td>
<td>

出行服务智能体

</td>
<td>

NA

</td>
<td>

NA

</td>
<td>

NA

</td>
</tr>
<tr>
<td>



</td>
<td>



</td>
<td>

营销服务智能体

</td>
<td>

NA

</td>
<td>

NA

</td>
<td>

NA

</td>
</tr>
<tr>
<td>



</td>
<td>



</td>
<td>

第三方智能体

</td>
<td>

NA

</td>
<td>

NA

</td>
<td>

NA

</td>
</tr>
<tr>
<td>



</td>
<td>



</td>
<td>

其他等智能体

</td>
<td>

NA

</td>
<td>

NA

</td>
<td>

NA

</td>
</tr>
</tbody></table>




