# Director评测集\-构建说明

<table><tbody>
<tr>
<td>

测试数据

</td>
<td>

目标

</td>
<td>

具体实施方案

</td>
<td>

负责人

</td>
<td>

排期

</td>
<td>

其他

</td>
</tr>
<tr>
<td>

产品种子数据圈定需求范围

</td>
<td>

构建200左右种子数据，覆盖主要的应用场景



</td>
<td>

对Director场景进行拆解，构建种子数据圈定需求范围



</td>
<td>

@郝晓伟

</td>
<td>

20260405（已完成初版）



</td>
<td>

[元旦后演示冲刺 planner种子数据\&amp;knowhow](https://bytedance.larkoffice.com/wiki/WTPIwriowis0vNkETBfcpyTLnob?sheet=eSIoyh)

</td>
</tr>
<tr>
<td>

CQC数据试标注



</td>
<td>

对数据进行试标注，构建200左右数据



</td>
<td>

找CQC同学试标注数据2人

</td>
<td>

@李强

</td>
<td>

20260405（已完成初版）



</td>
<td>

[Director测试数据\(小批量）](https://bytedance.larkoffice.com/wiki/HlLqwOcy0i5Z7tkIJklc5aR7n4f?sheet=MEUzwn)

</td>
</tr>
<tr>
<td rowspan="20">

第一期（测试集泛化\&amp;扩展）



</td>
<td rowspan="5">

基于产品种子数据构建测试集（1000条）



</td>
<td>

确定测试集泛化方法和规范（增加 query和context 的关联度，增加极值和corner cases覆盖度。）

</td>
<td>

@林满恕

@李强

</td>
<td>

20260409



</td>
<td>

[director数据标注规范](https://bytedance.larkoffice.com/wiki/CFXWwIh28iesBrksafMckKpJnzg)

</td>
</tr>
<tr>
<td>

确定测试数据的评价和归类方法



</td>
<td>

@李强@李华健

@林满恕

@郝晓伟

</td>
<td>

20260410



</td>
<td>

https://code\.byted\.org/auto/CockpitLM/blob/liqiang\-dev/src/difficulty\_scoring\.py?ref\_type=heads

</td>
</tr>
<tr>
<td>

CQC 人力协调，培训\&amp;试标注

跟CQC申请4个人

</td>
<td>

@李强

</td>
<td>

2026\.4\.13

</td>
<td>

4\.9已到位1人，4\.13再到位3人

</td>
</tr>
<tr>
<td>

测试集泛化质检\&amp;验收

基于晓伟的种子数据200条，进行泛化，每条泛化5条，共计泛化1000条；

按照每人天25条的生产率；4个人，每天100条；

1000条，合计10天（2周）

</td>
<td>

CQC的人

</td>
<td>

4\.13\~4\.25



</td>
<td>



</td>
</tr>
<tr>
<td>

对测试集进行归类、存档



</td>
<td>

@李强

@李华健

</td>
<td>

持续做，每天泛化的结果，及时进行归类

2026\.4\.27

</td>
<td>



</td>
</tr>
<tr>
<td>



</td>
<td>

对测试集进行验证（人工）



</td>
<td>

@李强

@王威

@罗丽

@梁浩杰

</td>
<td>

持续做，每天泛化的结果，及时进行抽检

2026\.4\.27

</td>
<td>



</td>
</tr>
<tr>
<td rowspan="6">

收集AI汽车日志数据构建测试集（500条）



</td>
<td>

收集AI汽车测试数据



</td>
<td>

@李强

</td>
<td>

4\.14

</td>
<td>

[1000条测试车非拒识数据](https://bytedance.larkoffice.com/sheets/X5OHsXZoIhy44Rti3Tncq5zwnve)
[planner问题分析\(0317\)](https://bytedance.larkoffice.com/wiki/H4HGwEavVi6cLVk5RcjcUMzvnxe?sheet=AEbk3Z)

</td>
</tr>
<tr>
<td>

数据构建（算法增加context信息，跑模型，出数据）

</td>
<td>

@李强

</td>
<td>

4\.15

</td>
<td>



</td>
</tr>
<tr>
<td>

CQC 人力协调，培训\&amp;试标注；2人

</td>
<td>

@李强

</td>
<td>

4\.16

</td>
<td>



</td>
</tr>
<tr>
<td>

CQC的人进行数据标注，25条/人天，每天50条，2周

</td>
<td>

CQC标注人员

</td>
<td>

4\.17\~4\.29

</td>
<td>



</td>
</tr>
<tr>
<td>

测试集质检\&amp;验收



</td>
<td>

@李强

@王威

@罗丽

@梁浩杰

</td>
<td>

4\.30

</td>
<td>



</td>
</tr>
<tr>
<td>

对测试集进行归类、校验、存档

</td>
<td>



</td>
<td>

4\.30

</td>
<td>



</td>
</tr>
<tr>
<td rowspan="7">

收集To B数据准备测试集（500条）



</td>
<td>

收集To B数据用于构建测试集

</td>
<td>

@赵磊

</td>
<td>

4\.16

</td>
<td>

[planner数据表格](https://bytedance.larkoffice.com/wiki/LN5BweEhLioZezktPtucAtSTnFg?sheet=Cy04r4)

</td>
</tr>
<tr>
<td>

筛选Director PE支持的不好的数据

</td>
<td>

@赵磊

</td>
<td>

4\.16

</td>
<td>



</td>
</tr>
<tr>
<td>

数据构建（算法增加context信息，跑模型，出数据）

</td>
<td>

@赵磊

</td>
<td>

4\.17

</td>
<td>



</td>
</tr>
<tr>
<td>

CQC 人力协调，培训\&amp;试标注：2人

</td>
<td>

@李强

</td>
<td>

4\.16

</td>
<td>



</td>
</tr>
<tr>
<td>

CQC的人进行数据标注，25条/人天，每天50条，2周

</td>
<td>

CQC

</td>
<td>

4\.18\~4\.29

</td>
<td>



</td>
</tr>
<tr>
<td>

测试集质检\&amp;验收



</td>
<td>

@赵磊

@王威

@罗丽

@梁浩杰

</td>
<td>

4\.30

</td>
<td>



</td>
</tr>
<tr>
<td>

对测试集进行归类、校验、存档

</td>
<td>

@赵磊

</td>
<td>

4\.30

</td>
<td>



</td>
</tr>
<tr>
<td>

测试集生成：对测试进行去重、抽样。



</td>
<td>

最终形成一个相对合理的分布：

- 复杂集约 100 \- 200 条

- 中等难度约 400 条

- 简单集约 1000 条



</td>
<td>

@李强

</td>
<td>

20260430

</td>
<td>



</td>
</tr>
<tr>
<td rowspan="2">

第二期（测试集泛化\&amp;补充）

</td>
<td>

基于PE mock视觉感知\+端状态\+记忆



</td>
<td>

- 算法基于端状态信息表 mock端状态。[【仅对内】「主线」场景感知状态信号库](https://bytedance.larkoffice.com/sheets/Pbw4sSfIRhhc2EthDUicfRr1nWb?sheet=75P8pj)、[状态协议拼接规则](https://bytedance.larkoffice.com/docx/IGnWdvMjroYXdrx8ZgjcgYaCnrc)

- 算法基于端侧场景感知prd、场景表等mock端侧视角感知。[Watcher（Always on感知） PRD【豆包 in car1\.0】](https://bytedance.larkoffice.com/docx/RU6sdBqpdoGRBSxv8wScZup3nlb)、[端侧感知场景状态现状和预期梳理](https://bytedance.larkoffice.com/wiki/DBDDwZZ9XiDI0Zk9pdTc9O55nIg?sheet=SEhHX1)

- 算法基于记忆prd mock记忆。[AI汽车记忆方案](https://bytedance.larkoffice.com/wiki/PdbRw6JTlisStKkRbXGczIWBnof)

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

根据第一期测试发现的问题，对测试集进行扩展和延伸。



</td>
<td>

最终形成一个相对合理的分布：

- 复杂集约 200 \- 300 条

- 中等难度约 800 条

- 简单集约 2000 条

</td>
<td>



</td>
<td>



</td>
<td>



</td>
</tr>
</tbody></table>

1、对下游工具，针对每个工具，产品这边输出20\~50条，工具的使用case（格式待梳理：类似多轮交互那种，站在Planner调用下游工具的视角来写：planner给的输入是啥，工具给的输出及格式符合要求）；@郝晓伟

<table><tbody>
<tr>
<td>

session

</td>
<td>

round

</td>
<td>

Tool\_name=gui\(定酒店）

</td>
</tr>
<tr>
<td>

1

</td>
<td>

1

</td>
<td>

Query1：

</td>
</tr>
<tr>
<td>

1

</td>
<td>

2

</td>
<td>

Tool\_feedback1

</td>
</tr>
<tr>
<td>

1

</td>
<td>

3

</td>
<td>

Query2：

</td>
</tr>
<tr>
<td>

1

</td>
<td>

4

</td>
<td>

Tool\_feedback2

</td>
</tr>
<tr>
<td>

2

</td>
<td>

1

</td>
<td>

Query1：

</td>
</tr>
<tr>
<td>

2

</td>
<td>

2

</td>
<td>

Tool\_feedback1

</td>
</tr>
<tr>
<td>

2

</td>
<td>

3

</td>
<td>

Query2：

</td>
</tr>
<tr>
<td>

2

</td>
<td>

4

</td>
<td>

Tool\_feedback2

</td>
</tr>
</tbody></table>


