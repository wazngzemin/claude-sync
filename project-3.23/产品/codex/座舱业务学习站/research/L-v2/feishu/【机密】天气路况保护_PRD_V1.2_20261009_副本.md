# 【机密】天气路况保护_PRD_V1.2_20261009 副本（飞书原文转存；更新时间 2026-11-04T11:00:47+08:00）

来源链接：https://sai-seres.feishu.cn/wiki/OLTCwp864iIEZJkDe7kc2I07nFD

# 更新记录

<lark-table rows="6" cols="4" column-widths="88,111,492,173">

  <lark-tr>
    <lark-td>
      版本号
    </lark-td>
    <lark-td>
      **更新日期** {align="center"}
    </lark-td>
    <lark-td>
      **更新内容描述** {align="center"}
    </lark-td>
    <lark-td>
      **更新人** {align="center"}
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <text color="orange">V0.1</text>
    </lark-td>
    <lark-td>
      2025-11-19
    </lark-td>
    <lark-td>
      - 天气路况保护初版
    </lark-td>
    <lark-td>
      <mention-user id="ou_90647d816c7e8c2185fad923eea7d36a"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <text color="orange">V0.2</text>
    </lark-td>
    <lark-td>
      2026-01-22
    </lark-td>
    <lark-td>
      - 增加触发雾天、雨天、雪天机制后，用户【二次确认】；
			- 删除需求依赖和前置条件-策略统筹；
			- 增加并完善天气数据标注内容模版；
    </lark-td>
    <lark-td>
      <mention-user id="ou_90647d816c7e8c2185fad923eea7d36a"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <text color="orange">V1.0</text>
    </lark-td>
    <lark-td>
      2026-02-03
    </lark-td>
    <lark-td>
      - 流程图补充用户确认；
			- 补充非功能模块，性能指标等；
			- 用户二次确认执行步骤单独明确；
			- 补充雾灯、湿滑、雪地模式已开启条件判断；
			- 复合场景因涉及安全不合并处理；
    </lark-td>
    <lark-td>
      <mention-user id="ou_90647d816c7e8c2185fad923eea7d36a"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <text color="orange">V1.1</text>
    </lark-td>
    <lark-td>
      2026-06-16
    </lark-td>
    <lark-td>
      - 天气路况保护开关从【设置项】变更到【任务中心】；
    </lark-td>
    <lark-td>
      <mention-user id="ou_90647d816c7e8c2185fad923eea7d36a"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <text color="green">V1.2</text>
    </lark-td>
    <lark-td>
      <text color="green">2026-10-09</text>
    </lark-td>
    <lark-td>
      - <text color="green">完善模型策略=“晴天”；</text>
			- <text color="green">增加多标签处理优先级；</text>
			- <text color="green">增加隧道、停车场场景逻辑；</text>
			- <text color="green">增加雪地模式配置字判断条件</text>
    </lark-td>
    <lark-td>
      <text color="green"><mention-user id="ou_332f2f8cebe04a14a8be7d4fc97d573d"/></text>
    </lark-td>
  </lark-tr>
</lark-table>

# 参考资料

<lark-table rows="2" cols="3" column-widths="150,524,213">

  <lark-tr>
    <lark-td>
      序号
    </lark-td>
    <lark-td>
      **资料名称** {align="center"}
    </lark-td>
    <lark-td>
      **内容/链接** {align="center"}
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      1
    </lark-td>
    <lark-td>
      AI+安全意见
    </lark-td>
    <lark-td>
      <mention-doc token="LozAwiiPXi1yDIkd8WCchuNznmf" type="wiki">“AI+安全空间”专项</mention-doc>
    </lark-td>
  </lark-tr>
</lark-table>

# 特性概述

## 需求背景

用户开车时最担心的就是突变的天气。大雨、浓雾、或者突如其来的冰雪，会让大部分用户驾车手忙脚乱，无法冷静应对，行车危险剧增。用户希望有一个贴心的“司机管家”能够**主动、无感地**介入驾驶辅助，最大化主动保障形成安全；

## 特性定位

**用户场景：**

大雨驾车场景；

雾天驾车场景；

偶遇团雾场景；

雪天驾车场景；

## 特性价值

1. **降低事故风险：** 通过模型识别天气（如雪、雨、雾），系统能**先于驾驶员**采取主动提醒（如自动提醒切换进入雾灯打开/雪地/湿滑模式），显著降低因天气导致的打滑、追尾或失控等事故的概率。

## 特性需求清单
<lark-table rows="6" cols="5" column-widths="103,125,162,401,64">

  <lark-tr>
    <lark-td>
      L1功能
    </lark-td>
    <lark-td>
      L2功能
    </lark-td>
    <lark-td>
      L3功能
    </lark-td>
    <lark-td>
      概述
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="5">
      <text color="green">天气路况保护</text>
    </lark-td>
    <lark-td>
      <text color="green">天气路况保护开关</text>
    </lark-td>
    <lark-td>
      -
    </lark-td>
    <lark-td>
      支持用户可以开启关闭该功能
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <text color="green">天气路况保护全局策略</text>
    </lark-td>
    <lark-td>
      -
    </lark-td>
    <lark-td>
      天气路况保护的判断、退出机制
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="3">
      <text color="green">天气路况保护机制推送</text>
    </lark-td>
    <lark-td>
      雾天路况保护
    </lark-td>
    <lark-td>
      用户用车过程中的雾天场景，开启后雾灯的保护策略；
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      雨天路况保护
    </lark-td>
    <lark-td>
      用户用车过程中的雨天场景，开启湿滑模式的保护策略；
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      雪天路况保护
    </lark-td>
    <lark-td>
      用户用车过程中的雪天场景，开启雪地模式的保护策略；
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

## 业务流程图

<whiteboard token="VsTjw3QfThhi0nbHliwcPeBdnig"/>

# 

# 详细需求描述

## 天气路况保护开关

<lark-table rows="8" cols="2" header-column="true" column-widths="141,730">

  <lark-tr>
    <lark-td>
      用户故事 {align="center"}
    </lark-td>
    <lark-td>
      作为用户，希望在**恶劣天气**下开启**自动识别天气路况的系统**，确保行车安全。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ~~需求依赖~~ {align="center"}
    </lark-td>
    <lark-td>
      1. ~~CDC正常工作~~
			1. ~~车辆电源管理系统~~
			1. ~~车外摄像头~~
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ~~前置条件~~ {align="center"}
    </lark-td>
    <lark-td>
      1. ~~车辆上电~~
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      执行步骤 {align="center"}
    </lark-td>
    <lark-td>
      1. ~~在“设置”界面→主动安全→天气路况保护【开关】。（考虑融合到统一总开关里且有备注开关说明）~~
			1. 天气路况保护开关在【任务中心】；
			1. 用户点击BTN或可通过语音“打开天气路况保护”进行开关。
			1. 出厂默认开启，支持开关记忆；
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      期望效果 {align="center"}
    </lark-td>
    <lark-td>
      1. 界面交互流畅，语音响应速度快。
			1. 点击BTN1[确认开启]：触发天气路况保护功能
			1. 点击BTN2[取消]：关闭天气路况保护功能
			1. 语音“打开或关闭”：触发或关闭天气路况保护功能
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      异常case {align="center"}
    </lark-td>
    <lark-td>
      车外摄像头等功能故障时，开关置灰并点击时有toast提醒；
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      流程图 {align="center"}
    </lark-td>
    <lark-td>
      无
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      其他说明 {align="center"}
    </lark-td>
    <lark-td>
      参考效果图：具体UI/UX以UI/UX工程师设计为准（UI/UX内容需要经产品企划部评审）。
    </lark-td>
  </lark-tr>
</lark-table>

## **天气路况**<text color="green">**全局策略**</text>

<lark-table rows="8" cols="2" header-column="true" column-widths="141,730">

  <lark-tr>
    <lark-td>
      用户故事 {align="center"}
    </lark-td>
    <lark-td>
      作为用户，我希望系统能自动识别**雾、雨、雪**等恶劣天气及路况，以便及时获得雾灯打开提醒并自动切换动力模式，降低事故风险。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ~~需求依赖~~ {align="center"}
    </lark-td>
    <lark-td>
      1. ~~CDC正常工作~~
			1. ~~车辆电源管理系统~~
			1. ~~前视摄像头~~
			1. ~~车外天气融合识别算法~~
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ~~前置条件~~ {align="center"}
    </lark-td>
    <lark-td>
      1. ~~车辆上电~~
			1. ~~天气路况保护开关开启~~
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <text color="green">详细需求描述</text> {align="center"}
    </lark-td>
    <lark-td>
      1. <text color="green">天气感知与判断：</text>
				1. 车辆启动后，前摄像头识别前方天气路况；
				1. 前摄像头的视频图片信息传输到模型进行识别；
				1. 模型<text color="green">经过连续多次标签校验</text>输出结果：
					1. <text color="green">天气标签：浓雾、下雨、下雪</text>
					1. <text color="green">路况标签：道路湿滑，道路积雪</text>
					1. <text color="green">无标签：上述以外的天气或路况</text>
          <text color="green">下文天气类型表述统一：</text>
          1. <text color="green">雨天=</text><text color="green" bgcolor="light-yellow">连续8次</text><text color="green">（根据后续标定调整）下雨或</text><text color="green" bgcolor="light-yellow">连续8次</text><text color="green">（根据后续标定调整）道路湿滑</text>
					1. <text color="green">雾天=</text><text color="green" bgcolor="light-yellow">连续2次</text><text color="green">（根据后续标定调整）浓雾</text>
					1. <text color="green">雪天=</text><text color="green" bgcolor="light-yellow">连续8次</text><text color="green">（根据后续标定调整）下雪或</text><text color="green" bgcolor="light-yellow">连续8次</text><text color="green">（根据后续标定调整）道路积雪</text>
				1. <text color="green">识别到多类天气标签：</text>
					1. <text color="green">天气推荐提醒遵循先触发、先推荐原则：多个天气模式先后满足推荐条件时，优先推荐最先触发的模式，当前已开启的模式不再推送；当前已手动开启的天气保护模式不再推送</text>
					1. <text color="green">若同时达成，按雪天＞雨天＞雾天来推荐，推荐事件完成后重新再次计算是否达成下一类</text>
			1. 主动弹出服务卡片及语音询问，用户【二次确认】回复：“确认”，则打开对应推荐；回复“不”或无反馈，则不触发；
			1. 主动推荐及退出一次上电周期有效；
			1. <text color="green">退出：满足以下其中一个条件，退出天气路况保护触发的模式</text>
				1. 车辆熄火驻车后，退出天气路况保护触发的模式；再次启动，重新执行判断
				1. <text color="green">满足退出的</text><text color="green" bgcolor="light-yellow">标签次数条件</text><text color="green">后主动询问是否退出已打开的天气路况保护触发的模式，用户二次确认后退出该模式；</text>
        <text color="green" bgcolor="light-yellow">注：</text>
        1. <text color="green" bgcolor="light-yellow">车辆处于隧道、停车场内时不再继续计数</text><text color="green">，不触发退出机制（</text><text color="green" bgcolor="light-yellow">隧道、停车场标签的输出准确率：</text><text color="green" bgcolor="light-red">暂时以实现效果为准，如有问题，后期优化</text><text color="green">）</text>
				1. <text color="green">用户手动开启的后雾灯/湿滑模式/雪地模式不受本退出逻辑约束</text>
      <text color="green">其他规则：</text>
      1. <text color="green">仅在车辆行车速度</text><text color="green" bgcolor="light-yellow">大于30km/h（TBD，速度区间可标定）</text><text color="green">，触发主动推荐；</text><text color="green" bgcolor="light-yellow">拖车模式下不触发主动推荐</text>
			1. <text color="green" bgcolor="light-yellow">音区限制：仅主驾可控</text>
			1. <text color="green">雪天天气保护</text>
				1. <text color="green">需按配置字来判断有无，无雪地模式车型不触发雪天主动推荐</text>
				1. <text color="green">当前处于雪地模式下，不推荐触发雨天天气保护</text>
			1. <text color="green">~~雨天天气保护~~</text>
				1. <text color="green">~~洗车模式不推荐雨天天气保护~~</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      期望效果 {align="center"}
    </lark-td>
    <lark-td>
      模型能快速响应，目标1S内（TBD），最终以模型调试数据为准，不低3S。
      <whiteboard token="DQr5wMja7hihXrbaebnc4r0Oncs"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      异常case {align="center"}
    </lark-td>
    <lark-td>
      识别模型卡滞或故障时，增加通知提醒；
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      流程图 {align="center"}
    </lark-td>
    <lark-td>
      无
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      其他说明 {align="center"}
    </lark-td>
    <lark-td>
      参考示例内容：<mention-doc token="MmqFwCpK9ibCl7kdaqycRNbHnJd" type="wiki">VLM模型需要的场景描述示例</mention-doc>
      <text color="green">标签文言以模型最终输出为准</text>
    </lark-td>
  </lark-tr>
</lark-table>

<whiteboard token="CbDZwnue5hbSdZbkvaTcFvdQnWb"/>

## 雾天路况保护机制
<lark-table rows="8" cols="2" header-column="true" column-widths="141,730">

  <lark-tr>
    <lark-td>
      用户故事 {align="center"}
    </lark-td>
    <lark-td>
      作为用户，我希望系统能自动识别**雾、雨、雪**等恶劣天气及路况，以便及时获得雾灯打开提醒并自动切换动力模式，降低事故风险。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ~~需求依赖~~ {align="center"}
    </lark-td>
    <lark-td>
      1. ~~CDC正常工作~~
			1. ~~车辆电源管理系统~~
			1. ~~车外摄像头~~
			1. ~~车外天气融合识别算法~~
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ~~前置条件~~ {align="center"}
    </lark-td>
    <lark-td>
      1. ~~车辆启动~~
			1. ~~天气路况保护开关开启~~
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      执行步骤 {align="center"}
    </lark-td>
    <lark-td>
      1. 车辆驾驶过程中监控前方300M（TBD）范围内天气路况，根据融合感知（能力），判断为前方雾天（需标注），主动弹出服务卡片及询问“前方行驶有雾，确认是否打开雾灯”，若雾灯已开不触发；
			1. 用户【二次确认】回复：“确认”，则打开后雾灯；回复“不”或无反馈，则不触发；
			1. 一个上电周期内有效；
			1. 车辆熄火驻车后，再次启动，退出天气路况保护触发的雾灯开启，重新执行判断；
			1. 当触发“雾天保护机制”后，车辆驾驶过程中监控前方300M(TBD)范围内天气路况，<text color="green">连续30次（次数可标定修改）输出天气为空标签，即触发已推荐模式的退出流程</text>，语音提示“该路程已<text color="green">无雾</text><text color="green">~~天晴~~</text>，确认是否帮你关闭后雾灯”（<text color="green">最终文言以语音tts清单技能为准</text>）<text color="green">；用户手动开启的后雾灯不受本退出逻辑约束</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      期望效果 {align="center"}
    </lark-td>
    <lark-td>
      1. 未开智驾同样生效；
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      异常case {align="center"}
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      流程图 {align="center"}
    </lark-td>
    <lark-td>
      无
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      其他说明 {align="center"}
    </lark-td>
    <lark-td>
      参考效果图：具体UI/UX以UI/UX工程师设计为准（UI/UX内容需要经产品企划部评审）。
    </lark-td>
  </lark-tr>
</lark-table>

## 雨天路况保护机制
<lark-table rows="8" cols="2" header-column="true" column-widths="141,730">

  <lark-tr>
    <lark-td>
      用户故事 {align="center"}
    </lark-td>
    <lark-td>
      作为用户，我希望系统能自动识别**雾、雨、雪**等恶劣天气及路况，以便及时获得雾灯打开提醒并自动切换动力模式，降低事故风险。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ~~需求依赖~~ {align="center"}
    </lark-td>
    <lark-td>
      1. ~~CDC正常工作~~
			1. ~~车辆电源管理系统~~
			1. ~~车外摄像头~~
			1. ~~车外天气融合识别算法~~
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ~~前置条件~~ {align="center"}
    </lark-td>
    <lark-td>
      1. ~~车辆启动~~
			1. ~~天气路况保护开关开启~~
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      执行步骤 {align="center"}
    </lark-td>
    <lark-td>
      1. 车辆驾驶过程中车辆驾驶过程中监控前方300M(TBD)范围内天气路况，根据融合感知（能力），判断为前方雨天（需标注），主动弹出服务卡片及询问“前方行驶有雨，确认是否切换为湿滑模式”，若湿滑模式已启用不触发；
			1. 用户【二次确认】回复：“确认”，则切换模式；回复“不”或无反馈，则不触发；
			1. 一个上电周期内有效；
			1. 车辆熄火驻车后，再次启动，退出天气路况保护触发的动力模式，重新执行判断；
			1. 当触发“雨天保护机制”后，车辆驾驶过程中监控前方300M(TBD)范围内天气路况，<text color="green">连续30次（次数可标定修改）无下雨且无道路湿滑标签即触发已推荐模式的退出流程</text>，语音提示“该路程已无雨，为你切换为常用驾驶模式，是否确认切换”<text color="green">；用户手动开启的湿滑模式不受本退出逻辑约束</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      期望效果 {align="center"}
    </lark-td>
    <lark-td>
      1. 未开智驾同样生效；
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      异常case {align="center"}
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      流程图 {align="center"}
    </lark-td>
    <lark-td>
      无
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      其他说明 {align="center"}
    </lark-td>
    <lark-td>
      参考效果图：具体UI/UX以UI/UX工程师设计为准（UI/UX内容需要经产品企划部评审）。
    </lark-td>
  </lark-tr>
</lark-table>

## 雪天路况保护机制
<lark-table rows="8" cols="2" header-column="true" column-widths="141,730">

  <lark-tr>
    <lark-td>
      用户故事 {align="center"}
    </lark-td>
    <lark-td>
      作为用户，我希望系统能自动识别**雾、雨、雪**等恶劣天气及路况，以便及时获得雾灯打开提醒并自动切换动力模式，降低事故风险。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ~~需求依赖~~ {align="center"}
    </lark-td>
    <lark-td>
      1. ~~CDC正常工作~~
			1. ~~车辆电源管理系统~~
			1. ~~车外摄像头~~
			1. ~~车外天气融合识别算法~~
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ~~前置条件~~ {align="center"}
    </lark-td>
    <lark-td>
      1. ~~车辆启动~~
			1. ~~天气路况保护开关开启~~
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      执行步骤 {align="center"}
    </lark-td>
    <lark-td>
      1. 车辆驾驶过程中监控前方300M(TBD)范围内天气路况，根据融合感知（能力），判断为~~前方下雪或路段有雪~~雪天（需标注），主动弹出服务卡片及询问“前方行驶路段有雪，确认是否提前开启雪地模式”，若雪地模式已启用不触发；
			1. 用户【二次确认】回复：“确认”，则切换模式；回复“不”或无反馈，则不触发；
			1. 一个上电周期内有效；
			1. 车辆熄火驻车后，再次启动，退出天气路况保护触发的动力模式，重新执行判断；
			1. 当触发“雪天保护机制”后，车辆驾驶过程中监控前方300M(TBD)范围内天气路况，<text color="green">连续30次（次数可标定修改）无下雪且无道路积雪标签即触发已推荐模式的退出流程</text>，语音提示“该路程已无雪，为你切换为常用驾驶模式，是否确认切换”<text color="green">；用户手动开启的雪地模式不受本退出逻辑约束</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      期望效果 {align="center"}
    </lark-td>
    <lark-td>
      1. 未开智驾同样生效；
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      异常case {align="center"}
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      流程图 {align="center"}
    </lark-td>
    <lark-td>
      无
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      其他说明 {align="center"}
    </lark-td>
    <lark-td>
      参考效果图：具体UI/UX以UI/UX工程师设计为准（UI/UX内容需要经产品企划部评审）。
    </lark-td>
  </lark-tr>
</lark-table>

# 非功能需求描述

## 5.1 数据分析需求

期望围绕这个特性需要查看的数据指标，需包含指标名称、指标描述、计算方式、统计维度等。

<lark-table rows="7" cols="4" column-widths="200,200,200,200">

  <lark-tr>
    <lark-td>
      指标名称
    </lark-td>
    <lark-td>
      指标描述
    </lark-td>
    <lark-td>
      计算方式
    </lark-td>
    <lark-td>
      统计维度
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      功能使用率
    </lark-td>
    <lark-td>
      使用车辆的所有用户中，用过该特性的用户占比
    </lark-td>
    <lark-td>
      使用功能的车辆数/上电车辆数
    </lark-td>
    <lark-td>
      时间：天/周/月
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      天气识别准确率
    </lark-td>
    <lark-td>
      模型识别天气类型的准确程度
    </lark-td>
    <lark-td>
      正确识别次数/总识别次数
    </lark-td>
    <lark-td>
      天气类型（雾/雨/雪）、时间：天/周
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      保护机制触发率
    </lark-td>
    <lark-td>
      识别到恶劣天气后，触发保护机制的比例
    </lark-td>
    <lark-td>
      触发保护机制次数/识别到恶劣天气次数
    </lark-td>
    <lark-td>
      天气类型、时间：天/周
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户确认率
    </lark-td>
    <lark-td>
      触发保护机制后，用户确认执行的比例
    </lark-td>
    <lark-td>
      用户确认次数/触发保护机制次数
    </lark-td>
    <lark-td>
      天气类型、时间：天/周
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      平均响应时间
    </lark-td>
    <lark-td>
      从识别到天气到弹出服务卡片的平均时间
    </lark-td>
    <lark-td>
      累计响应时间/触发次数
    </lark-td>
    <lark-td>
      天气类型、时间：天/周
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      功能关闭率
    </lark-td>
    <lark-td>
      用户主动关闭天气路况保护功能的比例
    </lark-td>
    <lark-td>
      关闭功能用户数/总用户数
    </lark-td>
    <lark-td>
      时间：天/周/月
    </lark-td>
  </lark-tr>
</lark-table>

## 5.2 埋点需求
<lark-table rows="8" cols="3" column-widths="200,200,400">

  <lark-tr>
    <lark-td>
      埋点事件
    </lark-td>
    <lark-td>
      触发时机
    </lark-td>
    <lark-td>
      上报字段
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      开关状态变更
    </lark-td>
    <lark-td>
      用户开启/关闭天气路况保护
    </lark-td>
    <lark-td>
      开关状态、操作方式（点击/语音）、时间戳
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      天气识别结果
    </lark-td>
    <lark-td>
      VLM模型输出识别结果
    </lark-td>
    <lark-td>
      识别天气类型、置信度、时间戳、位置信息
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      保护机制触发
    </lark-td>
    <lark-td>
      系统判定需要触发保护提醒
    </lark-td>
    <lark-td>
      天气类型、当前车速等
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户确认操作
    </lark-td>
    <lark-td>
      用户点击确认/取消/超时
    </lark-td>
    <lark-td>
      操作类型、天气类型、响应时间
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      功能执行结果
    </lark-td>
    <lark-td>
      系统执行开启雾灯/切换模式
    </lark-td>
    <lark-td>
      执行动作、执行结果、时间戳
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      天气恢复检测
    </lark-td>
    <lark-td>
      系统识别天气恢复晴天
    </lark-td>
    <lark-td>
      原天气类型、持续时间、时间戳
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      异常事件
    </lark-td>
    <lark-td>
      发生异常case时
    </lark-td>
    <lark-td>
      异常类型、错误码、时间戳
    </lark-td>
  </lark-tr>
</lark-table>

## 5.3 安全需求
<lark-table rows="6" cols="3" column-widths="200,252,200">

  <lark-tr>
    <lark-td>
      需求类别
    </lark-td>
    <lark-td>
      安全需求
    </lark-td>
    <lark-td>
      适用功能章节
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      功能安全
    </lark-td>
    <lark-td>
      天气识别结果仅作为辅助参考，不替代驾驶员判断
    </lark-td>
    <lark-td>
      全部
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      功能安全
    </lark-td>
    <lark-td>
      用户确认时限内无响应，默认不执行操作
    </lark-td>
    <lark-td>
      4.3/4.4/4.5
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      数据安全
    </lark-td>
    <lark-td>
      视频数据仅在车端处理，不上传云端
    </lark-td>
    <lark-td>
      4.2
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      数据安全
    </lark-td>
    <lark-td>
      识别结果和埋点数据脱敏后上传
    </lark-td>
    <lark-td>
      5.2
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      信息安全
    </lark-td>
    <lark-td>
      异常事件需记录详细日志供故障排查
    </lark-td>
    <lark-td>
      全部
    </lark-td>
  </lark-tr>
</lark-table>

## 5.4 性能需求

影响该特性核心体验的性能指标，可作为验收标准

<lark-table rows="5" cols="3" column-widths="200,252,200">

  <lark-tr>
    <lark-td>
      指标名称
    </lark-td>
    <lark-td>
      指标需求
    </lark-td>
    <lark-td>
      适用功能章节
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      识别响应时间
    </lark-td>
    <lark-td>
      ≤3s（目标1s）
    </lark-td>
    <lark-td>
      4.2
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      提醒弹出响应
    </lark-td>
    <lark-td>
      ≤50ms（TBD）
    </lark-td>
    <lark-td>
      4.3/4.4/4.5
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      语音响应时间
    </lark-td>
    <lark-td>
      参照语音主特性要求
    </lark-td>
    <lark-td>
      4.1
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      识别准确率
    </lark-td>
    <lark-td>
      雾天≥98%，雨天≥98%，雪天≥98%，晴天≥98%（TBD）
    </lark-td>
    <lark-td>
      4.2
    </lark-td>
  </lark-tr>
</lark-table>

---
