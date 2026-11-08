# 【SLS\-915】司机 Agent 终点泊车技术方案

# 当前文档已过时，见最新文档：[【SLS】司机 Agent 技术方案](https://bytedance.larkoffice.com/wiki/KdFFw73T8iR99tkkPM9cdVHUnXT)

<div class="callout">

**~~方案摘要~~**

- **~~范围~~**~~：915节点司机 Agent 仅处理终点泊车；非终点的靠边停车不在支持范围内。~~

- **~~技术评审决策~~**~~：统一采用方案 A：司机 Agent 先通过前置改写模型输出 AiNavi Query、智驾 Query 与互斥的澄清/兜底话术；正常链路先由智驾工具生成原始 FC，再通过 Request\.ext 传给 AiNavi；AiNavi 在终点确认和导航成功后完成 SDK 适配与下发。~~

</div>

---

# ~~1\. 需求背景~~

## ~~1\.1 需求简介~~

<table><tbody>
<tr>
<td>

~~项目~~

</td>
<td>

~~内容~~

</td>
</tr>
<tr>
<td>

~~需求类型~~

</td>
<td>

~~产品需求~~

</td>
</tr>
<tr>
<td>

~~Meego 链接~~

</td>
<td>



</td>
</tr>
<tr>
<td>

~~PRD 链接~~

</td>
<td>

[~~司机Agent\_SLS导航\&amp;泊车D2D相关场景~~](https://bytedance.larkoffice.com/docx/G9mjdQ5Zlouy1tx2UM5cbsePnWc)

</td>
</tr>
<tr>
<td>

~~PM~~

</td>
<td>

@徐汇文

</td>
</tr>
<tr>
<td>

~~研发 Owner~~

</td>
<td>

@吕鹏浩@董均@李鑫

</td>
</tr>
<tr>
<td>

~~需求群~~

</td>
<td>

</td>
</tr>
</tbody></table>

~~本方案服务 SLS 导航与 D2D 终点泊车：用户可在一句话中表达导航目的地与终点车位泊车诉求；长期规划是将智驾相关的场景统一收口到司机Agent中，Planner不再感知智驾工具。~~

### ~~1\.1\.1 目标~~

- ~~司机Agent 负责终点泊车语义识别与原始 FC 封装，并将导航 Query 与原始 FC 下发给 AiNavi；AiNavi 完成路线选择并成功发起导航后，通过 SDK 适配层对接智驾 SDK。~~

- ~~本期司机 Agent 只支持终点泊车相关场景，非终点泊车\+导航的场景不处理智驾相关指令。~~

### ~~1\.1\.2 范围与 Non\-goals~~

<table><tbody>
<tr>
<td>

~~场景~~

</td>
<td>

~~915范围~~

</td>
<td>

~~处理原则~~

</td>
</tr>
<tr>
<td>

~~目的地导航\&amp;终点泊车类~~

</td>
<td>

~~✅~~

</td>
<td>

~~司机Agent 拆分导航与终点泊车语义，封装原始 FC，并在调用 AiNavi 时携带；AiNavi 在导航成功后负责 SDK 字段适配与智驾 SDK 对接。~~

</td>
</tr>
<tr>
<td>

~~目的地/途径点导航\&amp;激活智驾~~

</td>
<td>

~~✅~~

</td>
<td>

~~司机Agent 拆分导航与智驾语义并封装原始 FC；具体执行链路按对应智驾能力约定处理，不复用终点泊车 SDK 适配定义。~~

</td>
</tr>
<tr>
<td>

~~目的地\+途径点导航\&amp;途径点泊车类~~

</td>
<td>

~~❌~~



</td>
<td>

~~SOP前暂不支持，司机Agent返回对应话术~~

</td>
</tr>
<tr>
<td>

~~新增、取消、变更泊车位~~

</td>
<td>

~~✅~~

</td>
<td>

~~司机Agent拆分Query给智驾工具处理~~

</td>
</tr>
<tr>
<td>

~~车位泊入变更为靠边停车~~

</td>
<td>

~~✅~~

</td>
<td>

~~司机Agent拆分Query给智驾工具处理~~

</td>
</tr>
<tr>
<td>

~~单停泊车指令~~

</td>
<td>

~~✅~~

</td>
<td>

~~司机Agent拆分Query给智驾工具处理~~

</td>
</tr>
<tr>
<td>

~~导航POI临停~~

</td>
<td>

~~❌~~

</td>
<td>

~~915先不支持，SOP前保持途径点默认临停~~

</td>
</tr>
<tr>
<td>

~~其它智驾指令~~

</td>
<td>

~~✅~~

</td>
<td>

~~司机Agent拆分Query给智驾工具处理~~

</td>
</tr>
</tbody></table>

## ~~1\.2 需求合作方~~

<table><tbody>
<tr>
<td>

~~合作方~~

</td>
<td>

~~接口人~~

</td>
<td>

~~责任~~

</td>
</tr>
<tr>
<td>

~~DT / Director~~

</td>
<td>

@郝晓伟@王兴

</td>
<td>

~~意图路由、上下文、澄清与用户反馈~~

</td>
</tr>
<tr>
<td>

~~AI Navi~~

</td>
<td>

~~弋途~~

</td>
<td>

~~路线规划与导航、导航上下文绑定；方案 A 在导航成功后通过 SDK 适配层对接智驾 SDK，方案 B 将语义 FC 与导航上下文交给车控 / 导航泊车 App 后置适配。~~

</td>
</tr>
<tr>
<td>

~~智驾工具~~

</td>
<td>

@韩杰@吕鹏浩

</td>
<td>

~~输出智驾相关FC~~

</td>
</tr>
<tr>
<td>

~~车控APP？~~

</td>
<td>

@陈果果

</td>
<td>

~~技术支持~~

</td>
</tr>
<tr>
<td>

~~系统导航 / 泊车 App~~

</td>
<td>

~~SLS~~

</td>
<td>

~~地图与车位映射~~

</td>
</tr>
<tr>
<td>

~~智驾ADC~~

</td>
<td>

~~SLS~~

</td>
<td>

~~执行智驾命令与返回~~

</td>
</tr>
</tbody></table>

## ~~1\.3 需求点提炼~~

1. ~~导航\&amp;终点泊车任务应关联并限定在一次导航交互中。~~

2. ~~终点未确认时只能等待或澄清，不得将智驾指令下发给泊车APP。~~

## ~~1\.4 名词解释~~

<table><tbody>
<tr>
<td>

**~~名词~~**

</td>
<td>

**~~说明~~**

</td>
</tr>
<tr>
<td>

~~司机Agent~~

</td>
<td>

~~智驾/舱驾融合垂域agent，承接智驾任务，具备模型推理、任务管理、工具调用等能力~~

</td>
</tr>
<tr>
<td>

~~AI Navi~~

</td>
<td>

~~Navi工具，具备模糊地点搜索、算路、导航控制等能力~~

</td>
</tr>
<tr>
<td>

~~智驾工具~~

</td>
<td>

~~auto\_drive工具（车控LLM），用于智能驾驶相关控制，少有推理能力~~

</td>
</tr>
<tr>
<td>

~~DT~~

</td>
<td>

~~对话推理引擎，即Director，曾用名Planner，负责用户交互、需求解析、任务规划、执行反馈、动态修正。~~

</td>
</tr>
<tr>
<td>

~~D2D~~

</td>
<td>

~~Door to Door 或E2E End to End，即车位到车位~~

</td>
</tr>
<tr>
<td>

~~智驾ADC~~

</td>
<td>

~~ADAS Domain Controller，智能驾驶域控制器，也常写作 ADCU（处理摄像头、雷达、激光雷达数据，跑智驾算法，输出转向、加减速指令，实现 ACC、LCC、NOA、泊车等智驾功能）~~

</td>
</tr>
</tbody></table>

---

# ~~2\. 整体架构~~

## ~~2\.1 业务架构~~

### ~~2\.1\.1 业务视图~~

~~司机 Agent 915只负责目的地导航\&amp;终点泊车或导航\&amp;激活智驾任务域；AI Navi 拥有导航相关的能力，智驾SDK负责封装智驾相关实现\&amp;地图与车位映射，智驾ADC负责执行，车控APP有FC的协议映射能力。~~

~~业务流程图~~

### ~~2\.1\.2 业务不变量~~

- ~~未确认唯一导航终点时，AiNavi 不得触发智驾 SDK 执行终点泊车。~~

- ~~目的地变更、导航取消或任务取消后，旧的泊车FC不应该下发。~~

- ~~非终点请求不得通过默认补全进入终点泊车链路。~~

## ~~2\.2 系统架构~~

### ~~2\.2\.1 推荐链路~~

**~~方案 A 的目标链路~~**~~：司机Agent 识别终点泊车语义并封装原始 FC，通过 AiNavi Request\.ext 下发；AiNavi 发起导航并绑定导航任务与已确认终点，随后在 SDK 适配层完成字段适配并对接智驾 SDK；ADC 执行结果。方案 A 不经过车控App 做中间协议转换。~~

### ~~2\.2\.2 模块边界~~

<table><tbody>
<tr>
<td>

~~模块~~

</td>
<td>

~~负责~~

</td>
<td>

~~不负责~~

</td>
</tr>
<tr>
<td>

~~司机 Agent~~

</td>
<td>

~~终点泊车语义识别、原始 FC 封装、任务生命周期~~

</td>
<td>

~~通用导航、SDK 字段适配、智驾 Proto / 枚举维护、地图车位猜测~~

</td>
</tr>
<tr>
<td>

~~AI Navi~~

</td>
<td>

~~终点确认、导航任务与变更；方案 A 的 智驾FC与智驾 SDK 对接~~

</td>
<td>

~~开放式重释泊车语义~~

</td>
</tr>
<tr>
<td>

~~智驾工具~~

</td>
<td>

~~智驾Query相关的FC生成~~

</td>
<td>

~~重新理解用户自然语言~~

</td>
</tr>
<tr>
<td>

~~车控APP~~

</td>
<td>

~~方案 B 的 智驾FC与智驾 SDK 对接~~

</td>
<td>



</td>
</tr>
<tr>
<td>

~~智驾SDK~~

</td>
<td>

~~地图与车位映射~~

</td>
<td>



</td>
</tr>
</tbody></table>

## ~~2\.3 影响范围~~

~~本期方案的开发范围仅包含司机 Agent的导航\&amp;目的地泊车和导航\&amp;激活智驾两个场景；对DT来说新增一个司机Agent需要注意落域；AINavi需要适配复合Query下的导航任务及智驾指令对接。~~

## ~~2\.4 典型Case~~

### ~~2\.4\.1 导航\&amp;终点泊车~~

~~Q1: 导航去大钟寺广场1号楼，车停到负二层充电车位~~

~~Q2: 确认选择第一条路线~~

### ~~2\.4\.2 导航\&amp;激活智驾~~

~~Q1: 导航去大钟寺广场1号楼，激活智驾~~

~~Q2: 选择第二条路线~~

### ~~2\.4\.5 目标归属不明确：澄清~~

~~Q1: 先去国贸接人，再去首都机场，到了停到充电车位~~

~~Q2: 在首都机场停到充电车位~~

### ~~2\.4\.6 非终点泊车：能力兜底~~

~~Q1: 导航去公司，途经西门时停到路边等我~~

~~Q2: 那就只导航去公司~~

### ~~2\.4\.7 目的地变更或取消~~

~~Q1: 导航到大钟寺，到了停到充电车位~~

~~Q2: 不去大钟寺了，改去五道口~~

~~前一个任务完成后，此Q当成新任务处理~~

### ~~2\.4\.8 搜索\&amp;终点泊车~~

~~Q1: 找下大钟寺广场附近的海底捞，停到停车场车位~~

~~Q2:就选择第一家海底捞~~

### ~~2\.4\.9 模型输出异常：解析兜底~~

~~Q1: 开车去公司，到了停到地库充电车位~~

~~Q2: 开车去公司，停到地库充电车位~~

### ~~2\.4\.10 语音发起导航操作\&amp;手动操作确认~~

~~Q1: 导航去大钟寺广场1号楼，车停到负二层充电车位~~

~~手动确认目的地并发起导航~~

### ~~2\.4\.11 导航\+确认\&amp;终点泊车追加~~

~~Q1: 导航去大钟寺广场1号楼~~

~~Q2: 确认选择第一条路线，然后车停到负二层充电车位~~



---

# ~~3\. 详细方案~~

## ~~3\.1 领域边界与路由~~

### ~~3\.1\.1 准入规则~~

~~司机 Agent 仅在动作是泊入目标车位、目标明确为当前或本轮待确认导航终点、且车型能力支持时接管。当前位置、途经点、临停、靠边停、纯导航和独立激活智驾由DT优先分流至智驾工具；当司机Agent发现需要用户澄清或不支持的符合指令时返回对应话术由 DT 澄清。~~

<table><tbody>
<tr>
<td>

~~条件~~

</td>
<td>

~~结果~~

</td>
<td>

~~动作~~

</td>
</tr>
<tr>
<td>

~~明确为导航终点泊车~~

</td>
<td>

~~处理~~

</td>
<td>

~~调用智驾工具生成FC，然后再调用AINavi并传递FC~~

</td>
</tr>
<tr>
<td>

~~目标归属不明确~~

</td>
<td>

~~澄清~~

</td>
<td>

~~司机Agent生成澄清话术~~

</td>
</tr>
<tr>
<td>

~~纯导航或独立激活智驾等智驾命令漏到司机Agent~~

</td>
<td>

~~处理？~~

</td>
<td>

~~处理并只调用智驾工具？~~

</td>
</tr>
</tbody></table>

## ~~3\.2 AiNavi 调用约定~~

~~司机Agent 只负责识别终点泊车语义、封装原始 FC，并通过 AiNavi Request 的 ~~~~`ext\[\&\#34;intelligent\_driving\_fc\&\#34;\]`~~~~ 发起调用。调用前校验场景必须为终点泊车，并校验目的地与泊车偏好等原始语义；司机Agent 不依赖智驾 Proto、执行端枚举、智驾 SDK 请求字段或错误码。~~

~~AiNavi 负责导航任务绑定，并在方案 A 中通过 SDK 适配层完成字段适配与智驾 SDK 对接；方案 B 则将语义 FC 与导航上下文交给车控 / 导航泊车 App 后置适配。司机Agent 只消费 AiNavi 返回的受理结果与必要状态，并向 DT 返回结构化结果；具体智驾 SDK API、请求字段和错误码由 AiNavi / 智驾侧另行确认，本文不定义。~~

## ~~3\.3 FC 链路 A/B 选型~~

**~~两套候选链路展开~~**~~：方案 A、B 的共同输入均为 司机Agent 封装的原始语义 FC；差异仅在 SDK 适配位置与导航上下文的使用方式。当前推荐方案 A。~~

**~~方案 A / B 同图对比~~**~~：以“开智驾去漕河泾中心 D 栋，车停到负二层充电车位”为例，司机Agent 先拆解为辅助驾驶开关、单目的地导航和指定车位泊车三个 FC。两套方案的分叉点是 SDK 适配位置与导航上下文使用方式。~~

**~~字段适配边界~~**~~：司机Agent 只保留原始 FC 中的终点泊车语义，不映射智驾 SDK 请求字段、Proto 或枚举。方案 A 由 AiNavi 的 SDK 适配层结合已确认导航上下文完成字段适配；方案 B 由车控 / 导航泊车 App 后置适配。具体字段映射由对应适配方与智驾侧确认，本文不定义。~~

### ~~3\.3\.1 硬约束~~

- ~~只有已确认导航终点才能产生可执行泊车下发。~~

- ~~目的地变更或取消后，旧任务不得执行。~~

- ~~原始 FC、导航上下文与 SDK 适配边界清晰，字段来源权威。~~

- ~~下发具备幂等、取消、查询、错误码和全链路追踪。~~

- ~~安全失败默认停止，不静默切换驾驶动作。~~

### ~~3\.3\.2 对比~~

<table><tbody>
<tr>
<td>

~~维度~~

</td>
<td>

~~方案 A~~

</td>
<td>

~~方案 B~~

</td>
<td>

~~判断与适用条件~~

</td>
</tr>
<tr>
<td>

~~链路~~

</td>
<td>

~~原始 FC 经 AiNavi 绑定导航上下文，由 AiNavi 适配并对接智驾 SDK~~

</td>
<td>

~~语义 FC 经 AiNavi 绑定后交车控适配~~

</td>
<td>

~~A 由 AiNavi 直接适配；B 增加后置适配方~~

</td>
</tr>
<tr>
<td>

~~字段就绪~~

</td>
<td>

~~司机Agent 仅需提供原始终点泊车语义~~

</td>
<td>

~~允许导航与映射阶段逐步补齐~~

</td>
<td>

~~两者都依赖导航后上下文；差异在适配方~~

</td>
</tr>
<tr>
<td>

~~时延与故障面~~

</td>
<td>

~~AiNavi 直接对接智驾 SDK，链路较短~~

</td>
<td>

~~多一跳车控，增加超时和重试复杂度~~

</td>
<td>

~~A 占优；差异需同环境实测~~

</td>
</tr>
<tr>
<td>

~~一致性~~

</td>
<td>

~~AiNavi 在已确认导航上下文中完成适配~~

</td>
<td>

~~绑定终点后再适配协议~~

</td>
<td>

~~两者均使用导航上下文；Owner 不同~~

</td>
</tr>
<tr>
<td>

~~协议演进~~

</td>
<td>

~~SDK 变化收敛在 AiNavi 的适配层~~

</td>
<td>

~~车控集中适配，下游变化少扩散~~

</td>
<td>

~~按 SDK 适配层长期维护位置选择~~

</td>
</tr>
<tr>
<td>

~~幂等与状态~~

</td>
<td>

~~AiNavi 统一管理适配、下发与状态~~

</td>
<td>

~~AiNavi 与车控需统一任务避免接收错误指令~~

</td>
<td>

~~A 状态链更短；B 需跨后置适配方治理~~

</td>
</tr>
<tr>
<td>

~~适用场景~~

</td>
<td>

~~AiNavi 可直接维护 SDK 适配，减少中间链路~~

</td>
<td>

~~导航后数据成熟、协议多版本、长期演进优先~~

</td>
<td>

~~当前职责约束下推荐 A；B 作为后置适配备选~~

</td>
</tr>
</tbody></table>

## ~~3\.4 接口设计~~

### ~~3\.4\.1 通用协议~~

**~~AiNavi Request\.ext 承载约定~~**~~：调用 AiNavi 时沿用《~~[~~三方 Agent 接入协议~~](https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d)~~》的 Request 结构，其中 ~~~~`ext`~~~~ 类型为 ~~~~`map\[string\]string`~~~~。终点泊车 FC 使用以下固定键值约定。~~

<table><tbody>
<tr>
<td>

~~项目~~

</td>
<td>

~~约定~~

</td>
<td>

~~说明~~

</td>
</tr>
<tr>
<td>

~~Ext Key~~

</td>
<td>

~~`intelligent\_driving\_fc`~~



</td>
<td>

~~终点泊车 FC 的本文约定命名空间；是否作为正式 Key 由 AiNavi 接口评审确认。~~

</td>
</tr>
<tr>
<td>

~~Ext Value~~

</td>
<td>

~~UTF\-8 JSON 序列化字符串~~

</td>
<td>

~~由于 ~~~~`ext`~~~~ 的 Value 是 string，FC 对象必须先序列化为紧凑 JSON 字符串；不得直接传嵌套 Object，不做二次 URL 编码。~~

</td>
</tr>
<tr>
<td>

~~空值规则~~

</td>
<td>

~~无 FC 时不传该 Key~~

</td>
<td>

~~不使用空字符串、~~~~`null`~~~~ 或 ~~~~`\{\}`~~~~ 表示无任务，避免接收方误判为格式错误。~~

</td>
</tr>
</tbody></table>

<table><tbody>
<tr>
<td>

~~Value 字段~~

</td>
<td>

~~类型~~

</td>
<td>

~~必填~~

</td>
<td>

~~语义~~

</td>
</tr>
<tr>
<td>

~~`payload`~~

</td>
<td>

~~object~~

</td>
<td>

~~是~~

</td>
<td>

~~承载原始终点泊车语义 FC，需要端上适配成SLS的智驾协议~~

</td>
</tr>
</tbody></table>

**~~解析规则~~**~~：AiNavi 先按 ~~~~`intelligent\_driving\_fc`~~~~ 取值，再执行一次 JSON 反序列化。方案 A 里的 payload 是原始 FC ，需要适配转换成SLS的智驾协议。正式 SDK API、请求字段、错误码及校验规则由 AiNavi / 智驾侧确认，本文不定义。~~

~~协议依据：~~[~~三方 Agent 接入协议~~](https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d)~~，~~[E68\_语音控车\_协议接口【外部】](https://rqk9rsooi4.feishu.cn/docx/VuRvdvSkQo7KIzx77T6cSfWWnbe)

## ~~3\.5 前置改写模型~~

**~~定位~~**~~：改写模型是司机 Agent 的语义契约层。它把一条复合指令拆成 AiNavi 可消费的导航 Query、智驾工具可消费的智驾 Query，以及互斥的澄清或兜底话术。它不直接执行工具，不生成智驾 SDK 字段，也不猜测车位地图信息。~~

### ~~3\.5\.1 输入~~

- ~~当前用户 Query、必要的多轮对话历史与已确认槽位。~~

- ~~当前导航任务：任务 ID、目的地、途经点、导航状态和最近一次变更。~~

- ~~车辆能力与渠道配置：是否支持终点泊车、激活智驾及对应能力版本。~~

- ~~路由上下文：DT 已识别的候选域、当前 Agent、~~~~`logid`~~~~ 与会话标识。~~

~~历史信息只用于消解本轮省略，不得覆盖本轮明确表达；目的地变更、取消等新指令优先级最高。~~

### ~~3\.5\.2 输出协议~~

```json
~~{~~
~~  "ainavi_query": "导航到大钟寺广场1号楼",~~
~~  "auto_drive_query": "到达导航终点后泊入负二层充电车位"~~
~~}~~
```

```json
~~{~~
~~  "reply": "你想在国贸还是首都机场停到充电车位？"~~
~~}~~
```

<table><tbody>
<tr>
<td>

~~字段~~

</td>
<td>

~~出现条件~~

</td>
<td>

~~约束~~

</td>
</tr>
<tr>
<td>

~~`ainavi\_query`~~

</td>
<td>

~~执行~~

</td>
<td>

~~只包含目的地、途经点和导航动作。~~

</td>
</tr>
<tr>
<td>

~~`auto\_drive\_query`~~

</td>
<td>

~~执行~~

</td>
<td>

~~只包含智驾动作及用户明确的泊车偏好。~~

</td>
</tr>
<tr>
<td>

~~`reply`~~

</td>
<td>

~~不执行~~

</td>
<td>

~~承载澄清或能力兜底话术，与两个 Query 互斥。~~

</td>
</tr>
</tbody></table>

~~澄清与兜底的错误码、任务绑定、schema 版本和场景分类均由服务端根据路由结果与校验结果补齐，不消耗模型输出 Token。~~

### ~~3\.5\.3 字段互斥与校验~~

- ~~`ainavi\_query`~~~~ 与 ~~~~`auto\_drive\_query`~~~~ 必须同时出现，表示进入执行链路。~~

- ~~`reply`~~~~ 与两个 Query 互斥，表示本轮只返回澄清或兜底话术。~~

- ~~只返回一个 Query、三个字段同时出现或全部缺失，均按解析失败处理。~~

- ~~服务端负责 JSON 合法性、字段长度和组合约束校验，不从残缺结果中拼接请求。~~

### ~~3\.5\.4 Prompt 约束~~

- ~~可执行时只输出两个 Query；需要追问或拒绝时只输出 ~~~~`reply`~~~~。~~

- ~~保留用户明确约束，不补充楼层、车位类型和路线偏好等未提供信息。~~

- ~~指代只有在历史中存在唯一候选时才能继承，否则通过 ~~~~`reply`~~~~ 澄清。~~

- ~~途经点泊车、当前位置泊车和非终点靠边停车通过 ~~~~`reply`~~~~ 返回能力边界。~~

- ~~只输出 JSON，不输出解释、Markdown 或代码围栏。~~

## ~~3\.6 端到端执行链路~~

1. **~~DT 路由~~**~~：识别复合导航/智驾候选意图，将原始 Query 与上下文交给司机 Agent。~~

2. **~~前置改写~~**~~：司机 Agent 调用改写模型并校验 ~~~~`DriverRewriteResult`~~~~。~~

3. **~~短路判断~~**~~：~~~~`clarify`~~~~、~~~~`fallback`~~~~、~~~~`cancel\_previous`~~~~ 直接进入对应分支，不调用新工具。~~

4. **~~生成原始 FC~~**~~：使用 ~~~~`auto\_drive\_query`~~~~ 调用智驾工具；该调用只产出语义 FC，不直接触发 ADC 执行。~~

5. **~~调用 AiNavi~~**~~：用 ~~~~`ainavi\_query`~~~~ 覆盖工具侧 Query，将原始 FC 序列化到 ~~~~`Request\.ext\[\&\#34;intelligent\_driving\_fc\&\#34;\]`~~~~。~~

6. **~~绑定任务~~**~~：AiNavi 将 FC 绑定到导航任务和唯一已确认终点；目的地变更、取消或任务过期使绑定失效。~~

7. **~~适配与下发~~**~~：导航成功后，AiNavi SDK 适配层把语义 FC 转为 SLS 智驾协议并调用智驾 SDK。~~

8. **~~结果回传~~**~~：执行状态经 AiNavi 返回司机 Agent，再由 DT 生成面向用户的最终反馈。~~

### ~~3\.6\.1 调用顺序与失败处理~~

<table><tbody>
<tr>
<td>

~~失败点~~

</td>
<td>

~~系统动作~~

</td>
<td>

~~用户侧处理~~

</td>
</tr>
<tr>
<td>

~~改写超时/解析失败~~

</td>
<td>

~~不调用任何工具~~

</td>
<td>

~~返回重新表达目的地与停车位置的兜底话术。~~

</td>
</tr>
<tr>
<td>

~~需要澄清~~

</td>
<td>

~~保存最小待确认上下文~~

</td>
<td>

~~只追问阻塞执行的槽位，不播报“正在导航”。~~

</td>
</tr>
<tr>
<td>

~~智驾 FC 生成失败~~

</td>
<td>

~~不携带空 FC 调 AiNavi~~

</td>
<td>

~~说明泊车能力暂不可用；是否继续纯导航由 DT 决策。~~

</td>
</tr>
<tr>
<td>

~~AiNavi 导航失败~~

</td>
<td>

~~取消本轮 FC 绑定~~

</td>
<td>

~~沿用导航失败话术，不承诺终点泊车。~~

</td>
</tr>
<tr>
<td>

~~SDK 适配/下发失败~~

</td>
<td>

~~记录状态并禁止盲重试~~

</td>
<td>

~~返回具体可理解的失败提示；重试由唯一 Owner 发起。~~

</td>
</tr>
<tr>
<td>

~~目的地变更/取消~~

</td>
<td>

~~旧任务与旧 FC 同时失效~~

</td>
<td>

~~确认变更后重新规划，不继承旧泊车偏好。~~

</td>
</tr>
</tbody></table>

## ~~3\.7 对话响应语义~~

<table><tbody>
<tr>
<td>

~~模型输出~~

</td>
<td>

~~服务端判定~~

</td>
<td>

~~工具调用~~

</td>
<td>

~~响应约定~~

</td>
</tr>
<tr>
<td>

~~两个 Query~~

</td>
<td>

~~执行~~

</td>
<td>

~~智驾工具 → AiNavi~~

</td>
<td>

~~最终由 DT 汇总导航与智驾结果。~~

</td>
</tr>
<tr>
<td>

~~`reply`~~

</td>
<td>

~~澄清~~

</td>
<td>

~~无~~

</td>
<td>

~~服务端结合路由上下文写入 ~~~~`ErrorModelAskMore`~~~~，并保留待确认上下文。~~

</td>
</tr>
<tr>
<td>

~~`reply`~~

</td>
<td>

~~能力兜底~~

</td>
<td>

~~无~~

</td>
<td>

~~服务端写入 ~~~~`ErrorUnsupportedFunc`~~~~；需要转域时生成 Redirect Command。~~

</td>
</tr>
<tr>
<td>

~~非法组合~~

</td>
<td>

~~解析失败~~

</td>
<td>

~~无~~

</td>
<td>

~~返回 ~~~~`ErrorPlannerAnalyze`~~~~ 和固定安全话术。~~

</td>
</tr>
<tr>
<td>

~~两个 Query~~

</td>
<td>

~~下游失败~~

</td>
<td>

~~停止后续步骤~~

</td>
<td>

~~`Content`~~~~ 放用户话术，~~~~`ModelContent`~~~~ 保留结构化失败信息。~~

</td>
</tr>
</tbody></table>

~~`reply`~~~~ 只承担用户沟通，不参与工具参数解析；澄清还是兜底由服务端根据准入规则和当前任务状态判定。~~

## ~~3\.8 aidv 代码改造~~

~~当前仓库没有独立的 司机Agent Processor；导航与智驾主要复用 ~~~~`AgentVehicleControl`~~~~。Planner 已具备 ~~~~`action\_list\[\]\.params\.query`~~~~ 覆盖工具 Query 的能力，DPFM 参数也预留了 ~~~~`Extra`~~~~，因此建议复用现有调度能力，新增司机 Agent 的编排层。~~

<table><tbody>
<tr>
<td>

~~位置~~

</td>
<td>

~~改动~~

</td>
<td>

~~说明~~

</td>
</tr>
<tr>
<td>

~~`biz/service/driver\_agent/`~~

</td>
<td>

~~新增~~

</td>
<td>

~~新增 ~~~~`DriverRewriteResult`~~~~、JSON Schema 校验、动作分支和任务绑定状态；与 DPFM 传输结构解耦。~~

</td>
</tr>
<tr>
<td>

~~`biz/service/agent\_server/executor/dpfm/rewrite\.go`~~

</td>
<td>

~~复用/扩展~~

</td>
<td>

~~参考现有 ~~~~`RewriteQuery`~~~~ 封装司机 Agent 专用改写调用；不要复用自由文本返回，强制结构化协议。~~

</td>
</tr>
<tr>
<td>

~~`biz/service/flow/orchestrator\.go`~~

</td>
<td>

~~接入~~

</td>
<td>

~~在复合导航/智驾候选域进入司机 Agent；纯导航、独立智驾和非支持场景仍按现有路由处理。~~

</td>
</tr>
<tr>
<td>

~~`biz/service/planner/types\.go`~~

</td>
<td>

~~最小扩展~~

</td>
<td>

~~沿用 ~~~~`action\_list\[\]\.params\.query`~~~~；如需让 Planner 显式调用司机 Agent，只新增 Agent 动作定义，不把双 Query 平铺到通用 Action。~~

</td>
</tr>
<tr>
<td>

~~`biz/service/agent\_server/runner\.go`~~

</td>
<td>

~~复用~~

</td>
<td>

~~保留 params 中 ~~~~`query`~~~~ 覆盖原请求的机制；司机 Agent 生成两个子调用时分别写入对应 Query。~~

</td>
</tr>
<tr>
<td>

~~`biz/service/agent\_server/executor/dpfm/define\.go`~~

</td>
<td>

~~修改~~

</td>
<td>

~~在 ~~~~`RequestTrans`~~~~ 中建立受控的 ~~~~`ChatRequest\.Ext → PluginFuncParams\.Extra`~~~~ 白名单映射，至少覆盖 ~~~~`intelligent\_driving\_fc`~~~~、任务 ID 和 schema 版本。~~

</td>
</tr>
<tr>
<td>

~~`biz/service/agent\_server/executor/dpfm/agent\_list/`~~

</td>
<td>

~~新增 Processor~~

</td>
<td>

~~新增独立 ~~~~`driver\_agent\.go`~~~~ 负责“智驾工具生成 FC → AiNavi 调用”的编排；避免修改 ~~~~`vehicle\_control\.go`~~~~ 的通用执行语义。~~

</td>
</tr>
<tr>
<td>

~~`biz/types/response\.go`~~~~、~~~~`biz/constant/error\.go`~~

</td>
<td>

~~复用优先~~

</td>
<td>

~~澄清、不支持、模型解析和下游失败优先复用现有 Chunk、Command 与错误码；只有监控无法区分时再增加司机 Agent 子码。~~

</td>
</tr>
<tr>
<td>

~~Fornax Prompt 配置~~

</td>
<td>

~~新增/调整~~

</td>
<td>

~~为司机 Agent 改写模型配置独立 Prompt 和 JSON Schema；Planner Prompt 只负责落域，不重复承担双 Query 拆分。~~

</td>
</tr>
</tbody></table>

### ~~3\.8\.1 简易代码~~

```go
~~rewrite, err := driverRewriter.Rewrite(ctx, req)~~
~~if err != nil || !rewrite.Valid() {~~
~~    return buildRewriteFallback(req)~~
~~}~~

~~if rewrite.Reply != "" {~~
~~    return buildDriverReply(req, rewrite.Reply)~~
~~}~~

~~fc, err := autoDrive.GenerateFC(ctx, rewrite.AutoDriveQuery)~~
~~if err != nil {~~
~~    return buildAutoDriveFallback(err)~~
~~}~~
~~return aiNavi.Execute(ctx, rewrite.AiNaviQuery, map[string]string{~~
~~    "intelligent_driving_fc": marshalFC(fc),~~
~~})~~
```

## ~~3\.9 测试与观测~~

- **~~改写单测~~**~~：覆盖双 Query 拆分、指代继承、目标歧义、非终点泊车、取消与非法 JSON；断言两个 Query 成对出现，reply 与 Query 互斥。~~

- **~~编排单测~~**~~：Mock 智驾工具与 AiNavi，验证先生成 FC、后调 AiNavi；任一步失败后不会继续调用。~~

- **~~协议测试~~**~~：验证 Request\.ext 序列化、按需字段、非法组合与超长 Query 拦截。~~

- **~~多轮测试~~**~~：覆盖澄清后补槽、目的地变更、任务取消、重复请求幂等和旧 FC 失效。~~

- **~~指标~~**~~：记录落域量、执行/澄清/兜底分布、改写解析失败率、FC 生成失败率、AiNavi 受理率和旧任务拦截次数。~~

~~单测可沿用仓库的 ~~~~`testify/assert`~~~~ 与 fake tool 模式；响应链路重点验证 ~~~~`Content`~~~~、~~~~`ModelContent`~~~~、~~~~`ErrorCode`~~~~、Redirect Command 和 TTS 控制字段的一致性。~~

---

# ~~4\. 评审记录~~

## ~~4\.1 一审记录~~

### ~~4\.1\.1 历史决策~~

- 

### ~~4\.1\.2 本次评审待办~~

<table><tbody>
<tr>
<td>

~~事项~~

</td>
<td>

~~负责人~~

</td>
<td>

~~截止时间~~

</td>
<td>

~~状态~~

</td>
</tr>
<tr>
<td>



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



</td>
<td>



</td>
<td>



</td>
<td>



</td>
</tr>
</tbody></table>

### ~~4\.1\.3 当前评审结论~~




