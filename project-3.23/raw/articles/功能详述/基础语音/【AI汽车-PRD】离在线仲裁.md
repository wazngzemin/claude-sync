# 【AI汽车-PRD】离在线仲裁

<!-- doc_id: Tup7d7WyKodCFvxlo7UcCydWnCe -->
<!-- total_length: 4295 -->

# 版本管理

<lark-table rows="3" cols="5" header-row="true" column-widths="100,351,143,100,204">

  <lark-tr>
    <lark-td>
      版本
    </lark-td>
    <lark-td>
      变更记录
    </lark-td>
    <lark-td>
      变更日期
    </lark-td>
    <lark-td>
      变更人
    </lark-td>
    <lark-td>
      状态
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      v0.1
    </lark-td>
    <lark-td>
      撰写需求初始版本
    </lark-td>
    <lark-td>
      2025-09-15
    </lark-td>
    <lark-td>
      <mention-user id="ou_5234bbf5abd4f16914e588e5093d0742"/>
    </lark-td>
    <lark-td>
      <text bgcolor="light-yellow">**已评审**</text>
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
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

# 离在线仲裁

## 需求简述

在各种复杂环境下决定用户的需求什么时候用本地（离线）处理，什么时候用云端（在线）。

无网络时强离线模式，简单高频车控优先离线处理，复杂/内容检索类强在线处理，模糊类内容混合策略根据结果和时间进行仲裁。

## 离在线仲裁目标

离线仲裁的主要目标是提升性能，减少对响应速度、CPU 或资源的消耗，同时提高最终结果的准确率。

## 详细需求

### 车机无网络场景

车机无网络时，选择离线的结果，离线结果无法理解时，将提示兜底话术（如：没有网络时，我只能支持一些基础功能）

### 车机网络正常场景

#### 语音非全时免唤醒（正常唤醒交互场景）

1. 用户语音交互的音频分别给到「离线链路」和「在线链路」并行处理。
1. 离线指令看是否命中端侧白名单功能，如命中则立刻执行「白名单结果」
1. 如未命中白名单，则车端等待云端结果，监听端云链路是否正常，如2S内，无心跳，则进行端侧非白名单内容兜底。云端的根据不同的场景/意图/Agent，定义超时时间，如超时，将结果同步至端侧。端侧进行非白名单功能及兜底降级处理

补充策略：

 端侧输出的意图=feel的时候，需要等云端结果，不是直接用端上的结果。（feel的意图，一般表达是：我有点冷。  这种表达感受类的query，云端会走planner根据端状态结果来执行）。 

<image token="Y8gAbsgxSofepHx9QcfcqbKsnrd" width="1492" height="1806" align="center"/>

离线白名单选择逻辑：

1）用户的query无需结果“情景信息”即可判断出准确意图和执行的结果 2）在线的ASR识别效果会更好。

白名单包括：

<lark-table rows="12" cols="3" column-widths="100,172,412">

  <lark-tr>
    <lark-td colspan="3">
      示例
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="2">
      通讯录
    </lark-td>
    <lark-td>
      本地通讯录拨号
    </lark-td>
    <lark-td>
      拨打具体联系人的电话
      拨打具体号码的电话
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      紧急电话播放
    </lark-td>
    <lark-td>
      拨打道路救援电话
      拨打紧急救援电话
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="2">
      娱乐类
    </lark-td>
    <lark-td>
      本地音乐播放
    </lark-td>
    <lark-td>
      播放U盘/蓝牙音乐
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      媒体源切换
    </lark-td>
    <lark-td>
      暂停/播放/上一首/下一首
      播放模式设置
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="2">
      基础控制
    </lark-td>
    <lark-td>
      退出语音
    </lark-td>
    <lark-td>
      退出语音
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      应用开关
    </lark-td>
    <lark-td>
      打开/关闭应用（如：打开应用APP名词）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      导航类
    </lark-td>
    <lark-td>
      地图控制
    </lark-td>
    <lark-td>
      放大/缩小地图
      开始/结束导航
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      导航设置
    </lark-td>
    <lark-td>
      播报模式设置
      路线偏好设置
      路况开关
      限行开关
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="2">
      车控类
    </lark-td>
    <lark-td>
      倒车影像
    </lark-td>
    <lark-td>
      倒车影像开关
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      灯光
    </lark-td>
    <lark-td>
      危险警报灯开关
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td colspan="3">
      **详细信息参考：**<mention-doc token="QZgOsQquIh1M25teGcRcQ9V7nMd" type="sheet">【AI汽车】离线指令FC协议</mention-doc><text bgcolor="light-yellow">**已标注是否在白名单里**</text>
    </lark-td>
  </lark-tr>
</lark-table>

<view type="2">

  <file token="O1URbboK6oo1X1xQ9Pgcf9bYnrh" name="【仅对内】座舱大模型主线全域FC协议 - 飞书云文档.xlsx"/>

</view>

<view type="2">

  <file token="EDqlbe5Wcojq0lx9CP4cY9XonEb" name="【AI汽车】离线指令FC协议 - 飞书云文档.xlsx"/>

</view>

<callout emoji="💡" background-color="light-orange" border-color="light-orange">

<text color="purple">~~为什么没有把常规的车控放在白名单里？~~</text>

~~答：1）想把对话做的更智能一些，结合多模态信息做综合的理解。~~

~~示例1：「在大夏天非常热，用户说 “打开座椅加热”」->「不应该直接开启，而是要结合情景信息，来和用户做友好的互动，如：哎呀，您确定要在三十多度的大夏天体验一下‘温暖’的关怀吗？😄 我猜您可能是想让我帮您打开座椅通风」~~

~~示例2:「后排用户上车，说把车里空调温度调到最低」-->「记忆模块知道：副驾驶的感冒了？，那要副驾驶区域空调温度不应该被调节」~~

~~2）如果这套通过「规则来做」定义太过死板，而产品经理也无法穷举各类case的组合。~~
</callout>

#### 语音全时免唤醒场景

语音always on时，考虑用户流量和云端请求流量消耗token较大，将在端侧进行提前预处理，处理完成后再进行后续的端云链路。

<image token="OlelbqhmRoVlZKxNGuFcKqVdn9Y" width="2228" height="1322" align="center"/>

<image token="C5hsbEjrDoZgxQxSUmecp6q7n5b" width="821" height="996" align="center"/>
