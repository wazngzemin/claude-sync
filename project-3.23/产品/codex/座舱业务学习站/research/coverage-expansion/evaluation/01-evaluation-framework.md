# 豆包汽车评测体系

- sourceId: CE-EVAL-FRAMEWORK
- 来源：https://bytedance.larkoffice.com/wiki/VHmHwIlhei7HWhkci1ic61vtn1R
- 读取日期：2026-10-23
- 状态：接口成功，返回正文已读
- 源对象最后编辑时间：2026-10-20T06:51:05.000Z
- 边界：10 月 20 日更新的方案正文；自动评测、自动归因、看板与埋点仍包含待办。正文已读不证明这些方案已上线。

---

# 豆包汽车评测体系

# 整体框架

<table><tbody>
<tr>
<td>

模块

</td>
<td>

子事项

</td>
<td>

痛点

</td>
<td>

解决方案/待办项

</td>
</tr>
<tr>
<td rowspan="4">

评测集

</td>
<td>

基础集：日常用车场景中高频使用的需求

</td>
<td>

需要根据线上数据持续补充

其case比例和context需尽量贴合用户实际情况

</td>
<td>

持续更新

</td>
</tr>
<tr>
<td>

项目集：针对项目特殊功能模块设计的评测集

</td>
<td>

需要by到项目更新

</td>
<td>

持续更新

</td>
</tr>
<tr>
<td>

专家集（挑战集）：需要推理的复杂任务评测集

</td>
<td>

随着模型/链路升级而难度进化

</td>
<td>

持续更新

</td>
</tr>
<tr>
<td>

专项集：针对豆包重点域的专项评测集，如安全、信任

</td>
<td>

需要根据线上数据持续补充

</td>
<td>

持续更新

</td>
</tr>
<tr>
<td rowspan="3">

Rubric



</td>
<td>

**基础需求rubric搭建**

</td>
<td>

**需在产研范围内统一标准，包括算法模型训练、测试、评测及其他相关工作**

</td>
<td>

**梳理评分体系细则**[评分标准](https://bytedance.larkoffice.com/wiki/POj4whzWginFzBkomm0cYAFGnQe?sheet=VvSzrM)

</td>
</tr>
<tr>
<td>

**复杂需求rubric搭建**

</td>
<td>

**复杂需求往往涉及多轮对话，构建评测集和rubric难度较大（涉及不同分支的构建）**

</td>
<td>

**需选取一批重点的复杂需求，以二元rubric的形式构建检查点**

</td>
</tr>
<tr>
<td>

**主观需求rubric搭建**

</td>
<td>

**主观需求千人千面且抽象，很难具象rubric**

</td>
<td>

[主观评测体系](https://bytedance.larkoffice.com/wiki/U2NnwS3SZiQ2yHkzRL3c0IZKnvd)



</td>
</tr>
<tr>
<td rowspan="2">

回测

</td>
<td>

Dt评测

</td>
<td>

缺少有一致性的真值标注标准（依赖上述rubric搭建）

</td>
<td>



</td>
</tr>
<tr>
<td>

**e2e评测**

</td>
<td>

**纯人工上车评测效率低下**

</td>
<td>

**搭建自动化评测体系，辅助配置人工e2e评测**

</td>
</tr>
<tr>
<td rowspan="3">

线上评测与在线监控

</td>
<td>

**用户反馈\&amp;挖掘：根据用户显性反馈（上报问题）和隐性反馈（你TM是个傻子吧）定位问题**



</td>
<td>

**纯人工review效率低下**



</td>
<td>

**自动化问题定位工具**

**问题挖掘：问题定义、自动化问题挖掘工具**

**问题上报工具**

</td>
</tr>
<tr>
<td>

数据仪表盘



</td>
<td>



</td>
<td>

定义需观测的数据

数据展示

</td>
</tr>
<tr>
<td>

人工随机抽查

</td>
<td>



</td>
<td>

Once a week，每周期从活跃用户中抽取10位进行数据观察

</td>
</tr>
<tr>
<td>

信号发现

</td>
<td>

通过线上数据发现潜在问题，如用户负向反馈增加、平均连续对话数降低等

</td>
<td>



</td>
<td>

定义benchmark和警示线

</td>
</tr>
<tr>
<td>

Case挖掘与归因

</td>
<td>



</td>
<td>

缺少必要数据埋点

缺少自动分析工具

</td>
<td>

埋点：事后端状态、除端状态以外的context记录等等

</td>
</tr>
</tbody></table>


