# 火山引擎座舱大模型「信号中枢」产品方案

# 背景文档

[端状态架构讨论](https://bytedance.larkoffice.com/docx/WMdIdS2cqoGNMMxV2X1c1axDnpc)

# **概念定义**

<table><tbody>
<tr>
<td>

**名称**

</td>
<td>

**定义**

</td>
<td>

**核心作用**

</td>
<td>

**示例**

</td>
</tr>
<tr>
<td>

触发事件



</td>
<td>

车辆整车信号、驾驶操作、车辆状态发生指定变化，作为整条逻辑流程启动的前置触发信号；

</td>
<td>

决定逻辑什么时候开始校验，是整套规则的启动开关

</td>
<td>

档位切换为 D 档



</td>
</tr>
<tr>
<td>

条件



</td>
<td>

触发事件生效后，系统同步检测车辆当前多项状态，需全部满足预设判定标准，才允许执行后续动作；任意一项不满足则跳过动作，不输出任何反馈。

</td>
<td>

对触发场景做场景过滤，避免无意义误触发

</td>
<td>

车窗未关闭



</td>
</tr>
<tr>
<td>

动作



</td>
<td>

触发事件发生、所有校验条件均成立后，车载座舱 / 整车系统执行的响应行为，包含语音、弹窗、灯光、仪表提示等各类输出交互。

</td>
<td>

满足场景后对外输出提醒 / 控制反馈，是规则最终执行结果。

</td>
<td>

TTS 播报 “行车中关闭车窗可以降低能耗哦”

</td>
</tr>
<tr>
<td>

状态

</td>
<td>

车载终端本地实时采集、存储、上报的车辆 / 设备当前运行瞬时状态数据，是本地可读取、可用于规则判断的静态 / 动态变量

</td>
<td>

用户模型了解当前状态

</td>
<td>

空调开关=打开

</td>
</tr>
<tr>
<td>

事件日志

</td>
<td>

基于车上关键的触发事件记录下相关的信息形成日志统称为事件日志

</td>
<td>

以时间维度记录座舱发生的重要的事情

</td>
<td>

X点X分XX切换了音乐

</td>
</tr>
</tbody></table>

<div class="callout">

简要说明：基于端状态的变化作为事件触发，同时支持校验状态的值（条件），最终执行某个动作。动作可以是调用Advisor，可以是生成事件日志，可以是执行其他动作。

</div>

# **信号中枢功能说明**

[火山\_信号中枢全功能清单](https://bytedance.larkoffice.com/base/JmKrbKlSNaYtyosFsnCcJcfdnDb?table=tbl2YFQP3GsurF5D&view=vewtnGsdK8)

<table><tbody>
<tr>
<td>

sheet名称

</td>
<td>

说明

</td>
<td>

content

（车辆状态）

</td>
<td>

content

（视觉感知）

</td>
<td>

Advisor



</td>
<td>

事件日志

</td>
</tr>
<tr>
<td>

触发事件



</td>
<td>

主要来源于状态，被订阅后可以进入到「触发事件」sheet

同时支持非状态变化的事件，例如通过埋点获取的点击时间

</td>
<td>



</td>
<td>



</td>
<td>

√

</td>
<td>

√

</td>
</tr>
<tr>
<td>

条件



</td>
<td>

主要来源于状态，被订阅后进入到「条件」sheet

支持数值判断，是/非判断，例如车速大于XX，空调开关是否为开

</td>
<td>



</td>
<td>



</td>
<td>

√

</td>
<td>

√

</td>
</tr>
<tr>
<td>

状态查询

</td>
<td>

端状态清单，来源于车辆软件、硬件及aibox等信号

</td>
<td>

√

</td>
<td>

√

</td>
<td>



</td>
<td>



</td>
</tr>
</tbody></table>

<div class="callout">

触发事件\+条件=原触发器条件[触发器条件](https://bytedance.larkoffice.com/wiki/RskXwNWmEi0EQ3kaZPUcES9BnSg?sheet=RxCjRc)

</div>

**合入统一表格管理原因：**

触发器条件绝大多数触发及条件均来源于状态查询，方便统一管理（名称定义，关联的信号ID、取值定义）

**原触发器条件拆分为「触发事件」\+条件的原因（并行条件判断改为复合条件判断）：**

- Advisor\+事件日志均需要一个明确的触发理由，触发事件独立可以方便工程方式快速拼接事件名称

- 并行链路轮询所有信号，算力、总线开销大，改为串行逐步过滤，大幅减少信号读取

- 并行链路仅适合简单规则，车载场景条件复杂需要用到延时等长时处理

- 「规则引擎」会作为火山座舱标准化产品模块，后续配置平台会升级为运营平台提供第三方使用（workflow的用户使用成本较低）

配置平台原型：**https://99d930688eca\.aime\-app\.bytedance\.net/**

<table><tbody><tr>
<td>

Before



</td>
<td>

After



</td>
</tr></tbody></table>

# **需求明细**

<table><tbody>
<tr>
<td>

需求名称

</td>
<td>

产品

</td>
<td>

研发

</td>
</tr>
<tr>
<td>

sls端状态信号（含AIbox接入），支持context调用

</td>
<td>

@韩杰

</td>
<td>



</td>
</tr>
<tr>
<td>

场景配置平台接入触发事件\&amp;条件

一阶段：平台前端\&amp;后端先不改，先把sls需要的触发信息能运行通

二阶段：基于触发事件\+条件\+动作的架构重新调整平台

</td>
<td>

@王泽民



</td>
<td>



</td>
</tr>
<tr>
<td>

场景配置平台增加动作\-「生成事件日志」平台配置后可以通过context导入Director

</td>
<td>

@韩杰

</td>
<td>



</td>
</tr>
</tbody></table>

# **需求说明**

## 状态查询更改项

<div class="callout">

状态查询和端状态筛选是2个功能，需求也解耦，涉及到端状态筛选部分由context定义。

</div>

<table><tbody>
<tr>
<td>

变更内容

</td>
<td>

变更类型

</td>
<td>

变更说明

</td>
</tr>
<tr>
<td>

信号范围

</td>
<td>

缩减



</td>
<td>

1. 故障灯收敛为1个信号，所有故障通过一个状态查询获取

2. 车内温度\+车外温度单独作为单独信号

3. 新增短途小计里程

[sls端状态one page](https://bytedance.larkoffice.com/docx/IDJ7dHQRZo6mNrxvtW4cCDwvnff)

</td>
</tr>
<tr>
<td>

信号变化频率

信号时效

</td>
<td>

删除



</td>
<td>

这里是底层信号的刷新逻辑，各个车企对接时都会有差异，后续不做产品需求定义，由研发接入信号时定义。

**产品仅要求每次调用时数据为最新数据**

</td>
</tr>
<tr>
<td>

信号ID



</td>
<td>

重新定义



</td>
<td>

由类型\+序号方式（signal\_light\_0004）转化为与功能名称一一对应的小驼峰标识（rearFogLightState）

</td>
</tr>
<tr>
<td>

协议示例

</td>
<td>

新增

</td>
<td>

新增协议示例，针对较为复杂的格式定义，便于端云对接使用

</td>
</tr>
<tr>
<td>

图案

信号图案描述

相关query示例

</td>
<td>

删除



</td>
<td>

低频使用



</td>
</tr>
<tr>
<td>

支持多选主Key

</td>
<td>

删除（待定）

</td>
<td>



</td>
</tr>
</tbody></table>

## 触发事件表头说明

<table><tbody>
<tr>
<td>

名称

</td>
<td>

说明

</td>
</tr>
<tr>
<td>

分类

</td>
<td>

所属的分类，基本与状态查询一致

</td>
</tr>
<tr>
<td>

唯一标识

</td>
<td>

唯一代码表示，一般以「tri」开头，后缀一般与对应状态查询保持一致

</td>
</tr>
<tr>
<td>

关联状态查询

</td>
<td>

触发事件如来源于状态查询对应的信号需填入

触发事件支持非信号状态变化生成，例如通过埋点获取的点击事件，此时关联状态查询为空

</td>
</tr>
<tr>
<td>

触发事件名称

</td>
<td>

事件名称，与变化的状态绑定，应用于前端页面显示名称及生成事件描述拼接

</td>
</tr>
<tr>
<td>

参数名

</td>
<td>

参数名称，含是否为必填参数，应用于前端页面显示名称及生成事件描述拼接

</td>
</tr>
<tr>
<td>

参数值取值范围

</td>
<td>

每一个参数提供穷举范围或数值范围，数值类型需标注调整幅度及单位

</td>
</tr>
<tr>
<td>

事件描述

</td>
<td>

固定规则通过事件名称\+参数名生成，用于生成事件日志及调用Advisor

</td>
</tr>
</tbody></table>

## 条件表头说明

<table><tbody>
<tr>
<td>

名称

</td>
<td>

说明

</td>
</tr>
<tr>
<td>

分类

</td>
<td>

所属的分类，基本与状态查询一致

</td>
</tr>
<tr>
<td>

唯一标识

</td>
<td>

唯一代码表示，一般以「con」开头，后缀一般与对应状态查询保持一致

</td>
</tr>
<tr>
<td>

关联状态查询

</td>
<td>

条件如来源于状态查询对应的信号需填入

</td>
</tr>
<tr>
<td>

条件名称

</td>
<td>

与状态的当前值绑定

</td>
</tr>
<tr>
<td>

参数名

</td>
<td>

参数名称，含是否为必填参数

</td>
</tr>
<tr>
<td>

参数值取值范围

</td>
<td>

每一个参数提供穷举范围或数值范围，数值类型需标注调整幅度及单位

</td>
</tr>
</tbody></table>




