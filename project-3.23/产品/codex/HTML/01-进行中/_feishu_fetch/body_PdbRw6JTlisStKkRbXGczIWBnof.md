# 版本信息

<grid cols="2">

  <column width="44">
    <callout emoji="alarm_clock">
    版本号：1.1
    </callout>

  </column>
  <column width="55">
    <callout emoji="calendar">
    创建日期：12.2
    </callout>

  </column>

</grid>

# 变更日志

<lark-table rows="6" cols="4" column-widths="169,117,116,399">

  <lark-tr>
    <lark-td>
      **时间** {align="center"}
    </lark-td>
    <lark-td>
      **版本号** {align="center"}
    </lark-td>
    <lark-td>
      **变更人** {align="center"}
    </lark-td>
    <lark-td>
      **主要变更内容** {align="center"}
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      20251115
    </lark-td>
    <lark-td>
      1.0
    </lark-td>
    <lark-td>
      <mention-user id="ou_b6a6a46c22ace88fcab983dd1f597a4f"/>
    </lark-td>
    <lark-td>
      基本内容
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      20251202
    </lark-td>
    <lark-td>
      1.1
    </lark-td>
    <lark-td>
      <mention-user id="ou_b6a6a46c22ace88fcab983dd1f597a4f"/>
    </lark-td>
    <lark-td>
      增加各类记忆的总结规则、人人对话记录机制、事件日志的拼接规则
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

# 相关文档

<mention-doc token="DPNiwHSRBizhR4kddSwcKa55nvc" type="wiki">记忆问题记录</mention-doc>

<mention-doc token="Gt9qwfzlHiIKLgkWKCfcqYsYngg" type="wiki">事件日志产品需求文档 </mention-doc>

<mention-doc token="OlUgw8jExieq1WkLzJrcHGQJnYP" type="wiki">Review材料 - 身份识别、记忆使用原则（终版）</mention-doc>

<mention-doc token="Mu9IdaiavogII9xwtZAceaQ2ncf" type="docx">【PRD】AI汽车1.0 - 记忆模块需求</mention-doc>

<mention-doc token="JQVqsIq3FhwrvNtYtlEclkG7nBh" type="sheet">记忆清单（12.19更新） </mention-doc>

# 一张图说明记忆体系

<image token="HNWEbw2t3o8liqxqvntciTesn9b" width="5504" height="3072" align="center"/>

<whiteboard token="JaUmwetyNhjwBbbRgEtc8d4lnGH"/>

# 模块说明

包含短期和长期记忆在内的情景记忆的设计遵循随着时间推移，数据量逐渐变小的原则。由具象到印象。“能看到森林而不仅仅是树木”。

## 事件日志

<mention-doc token="Gt9qwfzlHiIKLgkWKCfcqYsYngg" type="wiki">事件日志产品需求文档 </mention-doc>

## 瞬时记忆

使用最新发生的事件作为瞬时记忆，其数据量最大，保留细节最多。

示例及具体逻辑见事件日记PRD：<mention-doc token="Gt9qwfzlHiIKLgkWKCfcqYsYngg" type="wiki">事件日志产品需求文档 </mention-doc>

## 短期记忆

把有相关性的事件进行合并、总结，更便于理解。总结时遵循5W1H原则。数据量中等。保留类型、小类、主体、时间段和具体内容五个字段。支持下游按照字段进行检索。

将更新的事件与已有短期记忆进行更新总结。

总结规则如下：

<lark-table rows="20" cols="10" column-widths="202,100,143,205,100,127,100,128,128,295">

  <lark-tr>
    <lark-td rowspan="2">
      规则 {align="center"}
    </lark-td>
    <lark-td rowspan="2">
      优先级
    </lark-td>
    <lark-td rowspan="2">
      相关事件二级分类
    </lark-td>
    <lark-td rowspan="2">
      输入
    </lark-td>
    <lark-td colspan="6">
      例子 {align="center"}
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      <text bgcolor="light-yellow">小类</text>
      <text bgcolor="light-yellow">（12月暂不做）</text> {color="LightYellowBackground"}
    </lark-td>
    <lark-td>
      主体
    </lark-td>
    <lark-td>
      开始时间
    </lark-td>
    <lark-td>
      结束时间
    </lark-td>
    <lark-td>
      具体内容
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      把跟导航相关的事件进行聚类，保留人物，到达、出发和停留时间和操作（收藏、POI搜索）、对话。每一次上电到下电聚到一起。中途取消的、调整前的地点不记录。
    </lark-td>
    <lark-td>
      P0
    </lark-td>
    <lark-td>
      导航应用、人机对话、对话
    </lark-td>
    <lark-td>
      2025年11月18日20点01分05秒，明骏：“导航回家，把山姆超市加到途径点”
      2025年11月18日20点10分05秒，抵达山姆超市（锦绣路店）
      2025年11月18日20点40分05秒，离开山姆超市（锦绣路店）
      2025年11月18日21点30分05秒，抵达家
    </lark-td>
    <lark-td>
      导航
    </lark-td>
    <lark-td>
      家、超市
      （是否能从高德获取 <mention-user id="ou_061bdcd2e8d94883dfd438676311b90f"/>）
    </lark-td>
    <lark-td>
      明骏
    </lark-td>
    <lark-td>
      2025年11月18日20点01分
    </lark-td>
    <lark-td>
      2025年11月18日21点30分
    </lark-td>
    <lark-td>
      2025年11月18日20点01分到2025年11月18日21点30分，明骏在公司停车场语音发起导航回家（XX小区），中间在山姆超市（锦绣路店）停留了30分钟
      注：使用端状态【目的地位置、途径点位置】的address字段，对于家、公司两类，标注家（具体位置）
      <text color="red">出行目的：通勤（根据出发点、目的地和时间推理）</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="3">
      与车控相关的事件进行聚类，保留人物信息与相关对话。包括引发车控的对话、动作和后续对话、操作等。由不同动因和目的产生的车控相关事件需分别记录
    </lark-td>
    <lark-td rowspan="3">
      P0
    </lark-td>
    <lark-td rowspan="3">
      车控操作、人机对话、对话、大幅动作、小幅动作、环境变化、执行反馈
    </lark-td>
    <lark-td>
      2025年11月18日20点04分05秒，明骏在打喷嚏
      2025年11月18日20点04分10秒，明骏在打喷嚏
      2025年11月18日20点05分10秒，豆包：“你是不是有点冷？我把空调和座椅加热打开吧？”，明骏：“好的”
      2025年11月18日20点05分10秒，豆包：“空调和座椅加热都打开了。“
    </lark-td>
    <lark-td>
      车控
    </lark-td>
    <lark-td>
      空调、座椅加热
      （有限集，车控范围）
    </lark-td>
    <lark-td>
      明骏
    </lark-td>
    <lark-td>
      2025年11月18日20点04分
    </lark-td>
    <lark-td>
      2025年11月18日20点05分
    </lark-td>
    <lark-td>
      2025年11月18日20点04分到2025年11月18日20点05分，明骏持续性打喷嚏，豆包经明骏同意后将座椅加热打开，并将空调调整至26度。
      <text color="red">动机：升温（推理：感到寒冷所以打喷嚏，那么需要提升车内温度）</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      2025年11月18日20点07分11秒，明骏："打开氛围灯到绿色。“豆包：”好的，已打开“
      2025年11月18日20点08分11秒，明骏：”这个颜色很有圣诞气息啊。“
    </lark-td>
    <lark-td>
      车控
    </lark-td>
    <lark-td>
      氛围灯
    </lark-td>
    <lark-td>
      明骏
    </lark-td>
    <lark-td>
      2025年11月18日20点07分
    </lark-td>
    <lark-td>
      2025年11月18日20点09分
    </lark-td>
    <lark-td>
      2025年11月18日20点07分到2025年11月18日20点09分，明骏语音打开了氛围灯，并把颜色调整成了绿色，并表示这个颜色很有圣诞氛围。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      略
    </lark-td>
    <lark-td>
      车控
    </lark-td>
    <lark-td>
      座椅、空调
    </lark-td>
    <lark-td>
      明骏
    </lark-td>
    <lark-td>
      2025年11月18日13点05分
    </lark-td>
    <lark-td>
      2025年11月18日13点40分
    </lark-td>
    <lark-td>
      2025年11月18日13点05分到2025年11月18日13点40分，明骏上车，放倒了主驾座椅，把空调调到28度，打开了小憩模式并在躺在座椅上闭上眼睛。
      <text color="red">上车目的：午睡（推理：结合时间和调节的车控，午睡小憩概率很大）</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      与多媒体相关的事件进行聚类，保留人物信息与相关对话。包括引发多媒体的对话、动作和后续对话、操作等。如中断后再次播放，需记录成两段
    </lark-td>
    <lark-td>
      P0
    </lark-td>
    <lark-td>
      内容消费相关、媒体控制、人机对话、对话、环境变化、车身硬件操作、APP操作、执行反馈
    </lark-td>
    <lark-td>
      2025年11月18日20点07分11秒，QQ音乐开始播放《千里之外》
      2025年11月18日20点11分11秒，QQ音乐开始播放《七里香》
      2025年11月18日20点14分11秒，明骏把七里香切歌了
    </lark-td>
    <lark-td>
      多媒体
    </lark-td>
    <lark-td>
      音乐（音乐、短视频、长视频、播客、新闻）
    </lark-td>
    <lark-td>
      明骏
    </lark-td>
    <lark-td>
      2025年11月18日20点07分
    </lark-td>
    <lark-td>
      2025年11月18日20点56分
    </lark-td>
    <lark-td>
      2025年11月18日20点07分到2025年11月18日20点56分，QQ音乐随机播放了《千里之外》（明骏点了收藏）、《七里香》（播到一半明骏切歌了）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      其他APP操作和相关的对话、操作。分APP进行聚类
    </lark-td>
    <lark-td>
      P2
    </lark-td>
    <lark-td>
      APP操作、人机对话、对话等
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      其他APP操作
    </lark-td>
    <lark-td>
      愤怒的小鸟
      （APP名称）
    </lark-td>
    <lark-td>
      明骏
    </lark-td>
    <lark-td>
      略
    </lark-td>
    <lark-td>
      略
    </lark-td>
    <lark-td>
      ……明骏在玩愤怒的小鸟游戏
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      系统设置及相关对话进行聚类，不同的系统设置无需聚类
    </lark-td>
    <lark-td>
      P2
    </lark-td>
    <lark-td>
      系统设置、人机对话、对话
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      系统设置
    </lark-td>
    <lark-td>
      通知
      （系统设置二级分类）
    </lark-td>
    <lark-td>
      明骏
    </lark-td>
    <lark-td>
      略
    </lark-td>
    <lark-td>
      略
    </lark-td>
    <lark-td>
      ……明骏把通知权限改为不接受任何通知
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      车身硬件操作及相关对话进行聚类，不同的车身硬件操作无需聚类
    </lark-td>
    <lark-td>
      P2
    </lark-td>
    <lark-td>
      车身硬件操作、人机对话、对话
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      车身硬件操作
    </lark-td>
    <lark-td>
      车门
      （硬件名称）
    </lark-td>
    <lark-td>
      雨晴
    </lark-td>
    <lark-td>
      略
    </lark-td>
    <lark-td>
      略
    </lark-td>
    <lark-td>
      ……雨晴打开车门上车，明骏说：“好久不见”
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      驾驶操作及相关对话进行聚类，不同的驾驶操作无需聚类
    </lark-td>
    <lark-td>
      P2
    </lark-td>
    <lark-td>
      驾驶操作、人机对话、对话
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      驾驶操作
    </lark-td>
    <lark-td>
      刹车
      （驾驶操作名称）
    </lark-td>
    <lark-td>
      明骏
    </lark-td>
    <lark-td>
      略
    </lark-td>
    <lark-td>
      略
    </lark-td>
    <lark-td>
      ……明骏刹车，说“我靠”
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      多端内容互传及相关对话进行聚类，不同的多端内容互传无需聚类
    </lark-td>
    <lark-td>
      P2
    </lark-td>
    <lark-td>
      多端内容互传、人机对话、对话
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      多端内容互传
    </lark-td>
    <lark-td>
      /
    </lark-td>
    <lark-td>
      明骏
    </lark-td>
    <lark-td>
      略
    </lark-td>
    <lark-td>
      略
    </lark-td>
    <lark-td>
      ……明骏小红书的攻略《XXX》发给了豆包
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      环境变化及相关对话进行聚类，不同的环境变化无需聚类
    </lark-td>
    <lark-td>
      P1
    </lark-td>
    <lark-td>
      环境变化、人机对话、对话
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      环境变化
    </lark-td>
    <lark-td>
      /
    </lark-td>
    <lark-td>
      雨晴
    </lark-td>
    <lark-td>
      略
    </lark-td>
    <lark-td>
      略
    </lark-td>
    <lark-td>
      ……突然下起了暴雨，雨晴：“糟了，我好像没关窗。”明骏：“没事，马上到家了”
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      路况变化及相关对话进行聚类，不同的路况变化无需聚类
    </lark-td>
    <lark-td>
      P1
    </lark-td>
    <lark-td>
      路况变化、人机对话、对话
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      路况变化
    </lark-td>
    <lark-td>
      /
    </lark-td>
    <lark-td>
      /
    </lark-td>
    <lark-td>
      略
    </lark-td>
    <lark-td>
      略
    </lark-td>
    <lark-td>
      ……堵车了
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      安全及相关对话进行聚类，不同的变化无需聚类
    </lark-td>
    <lark-td>
      P2
    </lark-td>
    <lark-td>
      安全、车况变化、车辆管理、人机对话、对话
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      安全
    </lark-td>
    <lark-td>
      /
    </lark-td>
    <lark-td>
      /
    </lark-td>
    <lark-td>
      略
    </lark-td>
    <lark-td>
      略
    </lark-td>
    <lark-td>
      ……智驾显示未接触的急刹
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      车况及相关对话进行聚类，不同的变化无需聚类
    </lark-td>
    <lark-td>
      P1
    </lark-td>
    <lark-td>
      安全、车况变化、车辆管理、人机对话、对话
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      车况
    </lark-td>
    <lark-td>
      /
    </lark-td>
    <lark-td>
      雨晴
    </lark-td>
    <lark-td>
      略
    </lark-td>
    <lark-td>
      略
    </lark-td>
    <lark-td>
      ……车机警告副驾没有系安全带，雨晴系上了安全带
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      车身硬件操作及相关对话进行聚类，不同的车身硬件操作无需聚类
    </lark-td>
    <lark-td>
      P2
    </lark-td>
    <lark-td>
      车身硬件操作、人机对话、对话
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      车身硬件操作
    </lark-td>
    <lark-td>
      /
    </lark-td>
    <lark-td>
      雨晴
    </lark-td>
    <lark-td>
      略
    </lark-td>
    <lark-td>
      略
    </lark-td>
    <lark-td>
      ……雨晴一边扇风一边摇下了车窗
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="3">
      <text bgcolor="light-yellow">按谈话主题将对话、人物动作、表情进行聚类（如主题已在上面的规则中出现过，无需重新记录）。如对话超过两轮，需对对话进行压缩总结</text>
    </lark-td>
    <lark-td rowspan="3">
      P0
    </lark-td>
    <lark-td rowspan="3">
      大幅动作、小幅动作、表情变化、手势、互动行为、人机对话、对话
    </lark-td>
    <lark-td>
      2025年11月18日20点11分11秒，明骏在打哈欠
      2025年11月18日20点11分25秒，明骏在打哈欠
      2025年11月18日20点11分30秒，雨晴：“你是不是没睡好啊”
      2025年11月18日20点12分30秒，明骏：“是呀，昨天加班失眠了”
    </lark-td>
    <lark-td>
      闲聊
    </lark-td>
    <lark-td>
      哈欠引发的对话
    </lark-td>
    <lark-td>
      明骏、雨晴
    </lark-td>
    <lark-td>
      略
    </lark-td>
    <lark-td>
      略
    </lark-td>
    <lark-td>
      ……明骏持续地打哈欠，雨晴：“你是不是没睡好啊”。明骏：“是呀，昨天加班失眠了”
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      2025年11月18日20点11分11秒，雨晴在咳嗽
      2025年11月18日20点12分11秒，雨晴在咳嗽
      2025年11月18日20点11分30秒，豆包：“你感冒还没好呀”
    </lark-td>
    <lark-td>
      闲聊
    </lark-td>
    <lark-td>
      感冒引发的对话
    </lark-td>
    <lark-td>
      雨晴
    </lark-td>
    <lark-td>
      略
    </lark-td>
    <lark-td>
      略
    </lark-td>
    <lark-td>
      ……雨晴一直咳嗽，豆包：“你感冒还没好呀”
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      2025年11月18日20点11分30秒，明骏：“你玩过卡坦岛吗？”
      2025年11月18日20点11分32秒，雨晴：“当然”
      2025年11月18日20点11分35秒，明骏：“我觉得占领关键资源地超级重要”
      2025年11月18日20点11分38秒，雨晴：“为啥”
      2025年11月18日20点11分41秒，明骏：“……”
      ……
    </lark-td>
    <lark-td>
      闲聊
    </lark-td>
    <lark-td>
      桌游
    </lark-td>
    <lark-td>
      明骏、雨晴
    </lark-td>
    <lark-td>
      略
    </lark-td>
    <lark-td>
      略
    </lark-td>
    <lark-td>
      ……明骏和雨晴讨论卡坦岛的游戏攻略，明骏认为占领关键资源地更重要，雨晴认为抽资源卡更重要
    </lark-td>
  </lark-tr>
</lark-table>

注：

- 如某事件同时满足多个规则，可分别参与聚类（黄色高亮的规则除外）

示例：<mention-doc token="GZhtdDalToN5bJx4dqwcdC7HnDh" type="docx">短期记忆提示词few shot</mention-doc>

## 长期情景记忆

结构化记忆每日重要信息，数据量最小

长期情景记忆当中包含两类信息，一类是客观发生或经过证实的，一类是通过理解推理而出的。后者需要进行标记且说明原因。

长期情景记忆夜间固定更新，更新当日信息，无时效要求。

<lark-table rows="6" cols="4" column-widths="273,211,121,397">

  <lark-tr>
    <lark-td>
      信息
    </lark-td>
    <lark-td>
      输入
    </lark-td>
    <lark-td colspan="2">
      例子
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      日期、天气、日期属性（工作日/休息日/节日/纪念日/生日…）
      注：这一行的数据需要考虑联网信息和长期语义记忆
    </lark-td>
    <lark-td>
      /
    </lark-td>
    <lark-td>
      基础信息
    </lark-td>
    <lark-td>
      2025年11月18日，晴转暴雨（14度/4度），星期二
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      行程：不同行程（每一次上电到下电视为一段完整行程）需要单独记录，每段行程包括：起点（出发时间）、目的地（到达时间）、途经点（到达时间，出发时间）、出行目的、乘客
    </lark-td>
    <lark-td>
      2025年11月18日08点30分10秒到2025年11月18日09点21分10秒，李雷和韩梅梅从家出发抵达公司，在途径点XXX 汽车养护店停留20分钟
    </lark-td>
    <lark-td>
      行程
    </lark-td>
    <lark-td>
      行程1:从家（8:30）出发抵达公司（9:21），途径点XXX 汽车养护店停留了20分钟。<text bgcolor="light-yellow">通勤，中间洗了车（推理，通过出发时间和目的地）。</text>乘客：韩梅梅（妻子）。
      行程2:从公司（19:30）出发抵达家（20:45），无途径点。<text bgcolor="light-yellow">通勤（推理，通过出发时间和目的地推测）</text>李雷独自一人。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      车控：
      - 与用户生理和心理状态相关（如高兴、悲伤、情绪的变化，是否生病、感到不适）
			- 用户对车的正面 / 负面反馈
      注：无需保留功能的参数、档位（空调具体调到多少度、车窗打开到1/2等）。
    </lark-td>
    <lark-td>
      2025年11月18日20点04分10秒到2025年11月18日20点05分10秒，明骏持续性打喷嚏，豆包经明骏同意后将座椅加热打开，并将空调调整至26度。
      2025年11月18日20点07分10秒到2025年11月18日20点09分10秒，明骏语音打开了氛围灯，并把颜色调整成了绿色。
      2025年11月18日20点07分10秒到2025年11月18日20点56分10秒，明骏语音打开车窗到1/2，豆包成功打开了车窗。
    </lark-td>
    <lark-td>
      车控相关
    </lark-td>
    <lark-td>
      因为明骏持续性打喷嚏，豆包调整了座椅加热和空调。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      多媒体：
      - 与用户心理状态相关（如高兴、悲伤、情绪的变化）
      注：无需保留细节描述，如具体听了哪些歌
    </lark-td>
    <lark-td>
      2025年11月18日20点07分到2025年11月18日20点56分，QQ音乐随机播放了《千里之外》（明骏点了收藏）、《七里香》（播到一半明骏切歌了）
      2025年11月18日20点56分10秒到2025年11月18日20点56分13秒，明骏表示心情不好想听嗨歌，豆包分别播放了《伤心的人不听慢歌》、《恋爱ing》、《双节棍》
    </lark-td>
    <lark-td>
      多媒体相关
    </lark-td>
    <lark-td>
      明骏心情不好，听了一些嗨歌
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      闲聊：
      - 与用户生理和心理状态相关（如高兴、悲伤、情绪的变化，是否生病、感到不适）
			- 与车辆相关（如车辆故障、维修、洗车）
			- 与用户的烦心事、困惑、爱好相关
			- 用户对车的正面 / 负面反馈
			- 用户最近提到生活、工作上的关注点（如减肥、年终考核）
      注：无需保留原始对话
    </lark-td>
    <lark-td>
      2025年11月18日20点07分10秒到2025年11月18日20点56分10秒，李雷一直咳嗽，豆包：“你感冒还没好呀”。李雷：“是呀，已经咳了好久了。”
      2025年11月18日20点56分10秒到2025年11月18日20点56分13秒，李雷：“介绍下箱女这个游戏。豆包：“箱女是一个经典的日式桌游”李雷：“那箱人是个什么东西”……（省略2轮对话）
      2025年11月18日20点56分10秒到2025年11月18日20点56分13秒，李雷：“今天上证指数收盘价多少”豆包：“截止今日收盘，上证指数为3879点。”
      2025年11月18日20点56分10秒，李雷：“我总觉得这个头枕不舒服”
      2025年11月18日08点30分10秒到2025年11月18日09点21分10秒，李雷跟韩梅梅讨论卡坦岛的游戏攻略，明骏认为占领关键资源地更重要，雨晴认为抽资源卡更重要
      2025年11月18日20点11分30秒到2025年11月18日20点11分41秒，李雷跟韩梅梅讨论，讨论明天她生日庆祝的地点，最后定下来是佩姐重庆火锅
      025年11月18日19点11分30秒到2025年11月18日19点11分41秒，韩梅梅：“今天几点下班的。”李雷：“7点半吧。”
    </lark-td>
    <lark-td>
      闲聊总结
    </lark-td>
    <lark-td>
      李雷感冒了，咳嗽了一段时间。李雷对桌游箱女很感兴趣。李雷表示头枕不舒服。李雷跟韩梅梅在车上讨论了卡坦岛的游戏攻略，以及敲定明天韩梅梅的生日去佩姐重庆火锅。
    </lark-td>
  </lark-tr>
</lark-table>

## 长期语义记忆

语义记忆即用户的画像，包含偏好、习惯和关注点等信息。

长期语义记忆有三类更新机制。

**第一类：定时抽取记忆**

触发条件:每天夜间定时

从短期记忆中抽取相关信息进行语义记忆的增、删、改，如用户提到自己喜欢吃苹果，空调喜欢控制在26度。

<text underline="true">说明：不涉及任何推理的部分，即用户一周听了1000次千里之外，也不会总结他喜欢这首歌。</text>

<text bgcolor="light-yellow" underline="true">**第二类（12月范围）**</text>:用户明确表达希望记住某内容时，如：“你记住我喜欢吃香蕉。”

立即触发更新机制，更新相应内容。

**更新时机：**

用户明确表达了希望豆包现在立即记住某个内容，Planner会调用记忆模块，将query进行改写。示例如下：

- 你怎么总是记不住我不喜欢蓝色
- 你记一下，目的地是我的家（planner改写后：你记一下，芮婷的家是XX小区）
- 记住我喜欢粉色，以后氛围灯都开粉色

**更新内容：**

- 对于query所包含的内容是我们已定义的模块，如“你记住我喜欢吃苹果”，则在子模块【日常饮食习惯】需要即时更新一条记忆点“喜欢吃苹果”
- 对于query所包含的内容是我们未定义的模块，如“记得这是我女儿的辅导班”，则需要新增模块【收藏地点】，记忆点是“明骏女儿的辅导班的地址是星星辅导班（XX路店）”

**第三类：定时分析、推理**

触发条件：每周五夜间定时

更新方式：对最近三个月的情景记忆进行分析、提炼形成语义记忆。比如李雷最近经常查瓷砖选购攻略、木工价格，推测他最近在搞装修。比如三个月内，李雷在午饭时间去了10次日料，推理出他喜欢吃日料。

结合端状态和其他上下文进行推理，比如李雷偏好车速快的时候听带劲的快歌，下班回家时爱听轻快的民谣，出游时爱听跟当前情景相关的歌。

**第四类：回顾**

触发条件：每周五夜间定时

更新方式：对于已经总结的长期语义记忆在短期记忆中回顾，遗忘掉不再重要的记忆。比如用户三个月前说自己在备婚，后面婚礼已经办完了，那么关注点中的备婚就可以更新掉。

<mention-doc token="OlUgw8jExieq1WkLzJrcHGQJnYP" type="wiki">Review材料 - 身份识别、记忆使用原则（终版）</mention-doc>

<mention-doc token="Mu9IdaiavogII9xwtZAceaQ2ncf" type="docx">【PRD】AI汽车1.0 - 记忆模块需求</mention-doc>

<mention-doc token="JQVqsIq3FhwrvNtYtlEclkG7nBh" type="sheet">记忆清单（持续更新） </mention-doc>

## 待优化项

<lark-table rows="10" cols="3" column-widths="294,302,260">

  <lark-tr>
    <lark-td>
      模块
    </lark-td>
    <lark-td>
      需求
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="2">
      **使用用户画像以提供个性化服务**
    </lark-td>
    <lark-td>
      通过推理生成偏好/习惯
      - 用户行为总结
			- 用户行为/动机/目标分析
			- 用户表达分析
    </lark-td>
    <lark-td>
      - 用户行为总结
				- 常去的地点（山姆超市）、口头禅（包的）
				- 通勤时间（8点40左右）
			- 用户行为/动机/目标分析
				- 小憩频率和规律（一周午睡3-4次，每次半小时左右）
				- 本次上车目的（通勤）
				- 喜欢的运动（足球）
			- 用户表达分析
				- 喜欢使用反问句来表达不满
				- 重复某一表达时代表对结果不满意
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      新增用户关注点/重要事件等信息
    </lark-td>
    <lark-td>
      用户的关注点、身上发生的重要事件会随着时间变化，要根据最新的了解给到用户推荐和服务
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **豆包行为准则**
    </lark-td>
    <lark-td>
      豆包需要遵守用户提出的行为准则
      - 行为准则抽取、总结
			- 行为准则应用
    </lark-td>
    <lark-td>
      是豆包任务执行的“指导原则”，用户可以约束和引导豆包的行为
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      [**人物小传**](https%3A%2F%2Fbytedance.larkoffice.com%2Fsheets%2FJQVqsIq3FhwrvNtYtlEclkG7nBh%3Fsheet%3DEDsTab)
    </lark-td>
    <lark-td>
      回复用户时需要对用户本人基本情况、近期状况和本次出行重要信息有基本了解
    </lark-td>
    <lark-td>
      不以query变化而转移
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **场景化记忆**
    </lark-td>
    <lark-td>
      画像中应包含具体场景下的偏好和习惯
    </lark-td>
    <lark-td>
      记忆不是简单的标签，而是基于场景的立体刻画
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **反思与进步**
    </lark-td>
    <lark-td>
      用户给予正反馈和负反馈，需形成lesson&learn作用于后续服务中
      智能体复盘总结经验
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      时序/空间记忆
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      记忆的巩固和淡忘
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      视觉记忆
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

## <text bgcolor="light-yellow">验收标准</text>

# Q&A

<lark-table rows="5" cols="2" column-widths="322,439">

  <lark-tr>
    <lark-td>
      Q
    </lark-td>
    <lark-td>
      A
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      事件日志与埋点的区别和联系？
    </lark-td>
    <lark-td>
      埋点是事件日志的一个数据来源，除此之外，还会从watcher、CV、对话模块等数据源获取数据。
      相比埋点上报的是json等程序化信息，事件日志输出的是自然语言，下游模块可以即拿即用。
      总结：
      - 事件日志获取的数据维度更多，更立体，就像有个乘客坐在车上记录的一样
			- 自然语言形式，下游模块无需自行从数据中推理还原情景，即拿即用，注意力可以更专注在自己的任务上。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      相比传统标签式的用户画像体系，AI汽车的长期记忆有什么特点？
    </lark-td>
    <lark-td>
      - 无需定义精准标签和枚举值，只需给出大的方向（或分类）。灵活，好维护。
			- 用户一句话即可生成记忆（我不喜欢吃辣），无需漫长的构建过程
			- 维度更立体，考虑场景（时间、空间、目的）
			- 大模型推理：不仅采集表面信息，且可以进行深度挖掘
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      为什么记忆要随时间变化而衰退？
    </lark-td>
    <lark-td>
      - 遗忘记忆的细节是智慧生物进化的一个趋势，当你记不住细节时，大脑被迫进入抽象模式，看到"森林"而不只是"树木"。
			- 积累越多的记忆细节，会使模型陷入对细枝末节的分析，而忽略整体上的分析。
			- 出于成本的考量。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      为什么用20分钟（or 超过20条），1天作为记忆的转换时间点？
    </lark-td>
    <lark-td>
      - 根据艾宾浩斯记忆曲线，20分钟和1天分别是两个重要的“遗忘”节点。举个例子，用户很难想起要问1个小时之前听过的脱口秀细节，因为他在20分钟这个事件点就忘记了约60%的信息。
			- 如保留较多的瞬时记忆，会对下游的模块提出比较高的要求。因为需要它们剥丝抽茧找到相关的内容。结合Planner当前的能力，先把数据量定在20条（但保留可能调整的可能性）
			- 考虑到需要用大模型进行总结，太过频繁的总结成本过高。
      <image token="XhKLbSHOOo2lOnx13ZNcSueOnoc" width="1314" height="770" align="center"/>
    </lark-td>
  </lark-tr>
</lark-table>

# Out of scope

长期情景记忆

结构化记忆每日重要信息，数据量最小

长期情景记忆当中包含两类信息，一类是客观发生或经过证实的，一类是通过理解推理而出的。后者需要进行标记且说明原因。

长期情景记忆有两类更新点：

- 20分钟一次，更新<text bgcolor="light-yellow">当日</text>信息，如对应信息不存在或无法推理，空着即可。有时效要求（先摸底）
- 夜间固定更新，更新当日信息，无时效要求。

<lark-table rows="14" cols="4" column-widths="273,211,121,397">

  <lark-tr>
    <lark-td>
      信息
    </lark-td>
    <lark-td>
      输入
    </lark-td>
    <lark-td colspan="2">
      例子
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      日期、天气、日期属性（工作日/休息日/节日/纪念日/生日…）
      注：这一行的数据需要考虑联网信息和长期语义记忆
    </lark-td>
    <lark-td>
      /
    </lark-td>
    <lark-td>
      基础信息
    </lark-td>
    <lark-td>
      2025年11月18日，晴转暴雨（14度/4度），星期二
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="2">
      行程关键信息：
      - 行程1（上电到下电，下同）:起点（出发时间）、目的地（到达时间）、途经点（到达时间，出发时间）、出行目的、乘客
			- 行程2:起点、目的地、途经点、出行目的、乘客
			- 行程3:起点、目的地、途经点、出行目的、乘客
			- ……
    </lark-td>
    <lark-td>
      2025年11月18日08点30分10秒到2025年11月18日09点21分10秒，李雷和韩梅梅从家出发抵达公司，在途径点XXX 汽车养护店停留20分钟
    </lark-td>
    <lark-td>
      行程
    </lark-td>
    <lark-td>
      从家（8:30）出发抵达公司（9:21），途径点XXX 汽车养护店停留了20分钟。<text bgcolor="light-yellow">通勤，中间洗了车（推理，通过出发时间和目的地）。</text>乘客：韩梅梅（妻子）。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      2025年11月18日19点30分10秒到2025年11月18日20点45分10秒，李雷从公司出发抵达家
    </lark-td>
    <lark-td>
      行程
    </lark-td>
    <lark-td>
      从公司（19:30）出发抵达家（20:45），无途径点。<text bgcolor="light-yellow">通勤（推理，通过出发时间和目的地推测）</text>李雷独自一人。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="3">
      重点关注情况：
      - 车辆相关：车辆故障、维修、洗车
			- 人相关：发生争执、交易、重要谈话内容（对话轮数大于等于5轮，或内容较为重要，如生病、还贷、装修和其他用户表达较为重要的事件）
			- 环境、路况相关：堵车、天气的剧烈变化等
    </lark-td>
    <lark-td>
      2025年11月18日08点30分10秒到2025年11月18日09点21分10秒，李雷和韩梅梅从家出发抵达公司，在途径点XXX 汽车养护店停留20分钟
    </lark-td>
    <lark-td>
      洗车
    </lark-td>
    <lark-td>
      李雷洗车了
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      2025年11月18日20点11分30秒到2025年11月18日20点11分41秒，李雷跟韩梅梅讨论，讨论明天她生日庆祝的地点，最后定下来是佩姐重庆火锅
    </lark-td>
    <lark-td>
      重要谈话内容
    </lark-td>
    <lark-td>
      李雷跟韩梅梅讨论，讨论明天她生日庆祝的地点，最后定下来是佩姐重庆火锅
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      2025年11月18日08点35分10秒，下起暴雨
    </lark-td>
    <lark-td>
      天气的剧烈变化
    </lark-td>
    <lark-td>
      回家路上下起暴雨
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="2">
      乘客生理和心理状态
      - 高兴、悲伤、情绪的变化
			- 是否生病、感到不适
    </lark-td>
    <lark-td>
      /
    </lark-td>
    <lark-td>
      情绪
    </lark-td>
    <lark-td>
      平静，无明显情绪体现
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      2025年11月18日20点07分10秒到2025年11月18日20点56分10秒，李雷一直咳嗽，豆包：“你感冒还没好呀”
    </lark-td>
    <lark-td>
      生理
    </lark-td>
    <lark-td>
      持续性打喷嚏、咳嗽，疑似感冒（<text bgcolor="light-yellow">推理</text>）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="2">
      ~~用户希望记住的内容~~
      - ~~用户主动显性提出的，希望豆包记住、改善的地方等~~
    </lark-td>
    <lark-td>
      ~~2025年11月18日20点56分10秒，李雷：“豆包，你不要总是突然说句话，很吓人”~~
    </lark-td>
    <lark-td>
      ~~用户希望记住的内容~~
    </lark-td>
    <lark-td>
      ~~李雷表示不喜欢豆包突然跳出来说话，有点受到惊吓~~
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ~~2025年11月18日20点56分10秒，李雷：“豆包，你记得我喜欢粉色”~~
    </lark-td>
    <lark-td>
      ~~用户希望记住的内容~~
    </lark-td>
    <lark-td>
      ~~李雷希望豆包记住自己喜欢粉色~~
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      和豆包重点谈话内容
      - 聊自己的烦心事、困惑、爱好等
			- 对话轮次大于等于5（深入讨论）
    </lark-td>
    <lark-td>
      2025年11月18日20点56分10秒,李雷：“箱女怎么玩”
      2025年11月18日20点56分13秒，豆包：“……”
      ……
    </lark-td>
    <lark-td>
      豆包重点谈话内容
    </lark-td>
    <lark-td>
      李雷仔细询问了桌游《箱女》的游戏规则
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      对车的正面 / 负面反馈
    </lark-td>
    <lark-td>
      2025年11月18日20点56分10秒，李雷：“我总觉得这个头枕不舒服”
    </lark-td>
    <lark-td>
      对车的正面 / 负面反馈
    </lark-td>
    <lark-td>
      李雷觉得头枕不太舒服
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      其他重要内容
      - 最近在减肥、马上要年终考核、纪念日、约会
    </lark-td>
    <lark-td>
      2025年11月18日20点56分10秒，李雷：“我下周要年终考核了”
    </lark-td>
    <lark-td>
      其他重要内容
    </lark-td>
    <lark-td>
      李雷马上要年终考核<text bgcolor="light-yellow">（通过电话内容推理）</text>
    </lark-td>
  </lark-tr>
</lark-table>
