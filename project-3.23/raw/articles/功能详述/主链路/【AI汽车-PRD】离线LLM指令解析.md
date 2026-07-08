# 【AI汽车-PRD】离线LLM指令解析

<!-- doc_id: QUF5dKiuEoTug7xZpwEcWZ6gnYb -->
<!-- total_length: 8266 -->

#  背景与目标

## 背景  

随着智能网联汽车的普及，语音交互已成为车载系统的核心交互方式，用户通过语音指令实现导航控制、娱乐调节、车辆功能操作等需求的频率显著提升。当前主流车载语音交互多依赖在线云端解析，存在以下痛点：  

1. 网络依赖风险：在地下车库、偏远地区、隧道等弱网/无网环境下，语音指令响应延迟高甚至失效，影响用户体验；  
1.  隐私安全隐患：语音数据上传云端可能涉及用户隐私（如通话内容、目的地等），存在数据泄露风险；  
1. 实时性不足：在线解析需经过网络传输、云端处理等环节，响应延迟可能超过驾驶场景下的用户容忍阈值（如紧急调温、等）；  

## 目标  

构建车载离线语音指令解析模块，实现不依赖网络环境的本地化语音交互，核心目标包括：  

- 保障弱网/无网场景下的语音指令正常响应，响应延迟≤200ms；  
- 支持主流车载高频功能的语音控制，指令识别准确率≥95%（日常场景）；  

# 使用场景  

仅在车辆无网或者离在线仲裁后，需要走离线指令解析链路。

## 核心场景分类  

### 基础车辆控制场景  

日常通勤：用户驾驶中通过语音调节空调（“打开空调，设为24度”）、车窗（“降下主驾车窗”）、座椅（“座椅加热开三档”）、灯光（“打开近光灯”）（“打开双闪”）等，需离线解析快速响应，避免手动操作分散注意力。  

特殊环境：在地下车库（无网络）启动车辆时，语音指令“打开360度影像”需离线解析直接执行。 

### 导航与出行场景  

无网区域导航：在偏远山区（无网络覆盖），用户语音指令“导航到XX”“选择XX路线”，离线系统需基于本地缓存的地图数据解析指令并执行路线规划。  

导航基础控制：高速驾驶中（网络不稳定），用户指令“放大/缩小地图”“开始/取消当前导航”，离线解析需实时响应，避免因网络延迟导致路线失误。  

### 娱乐与通讯场景  

本地媒体控制：用户语音“播放U盘里歌”“暂停音乐”“上一首等”，离线系统直接调用本地媒体模块执行，无需联网。 

离线通讯：用户指令“拨打老婆的电话”（通讯录已本地缓存）“拨打道路救援”，离线解析识别联系人并触发拨号，避免依赖通讯录同步上云。  

# 功能范围  

## 包含范围  

### 指令解析能力  

支持的指令类型：<mention-doc token="QZgOsQquIh1M25teGcRcQ9V7nMd" type="sheet">【AI汽车】离线指令FC协议</mention-doc>

<lark-table rows="21" cols="3" column-widths="115,154,346">

  <lark-tr>
    <lark-td>
      领域
    </lark-td>
    <lark-td>
      一级功能
    </lark-td>
    <lark-td>
      二级功能
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="8">
      车辆控制类
    </lark-td>
    <lark-td>
      空调
    </lark-td>
    <lark-td>
      空调开关
      空调温度调节
      空调风量调节
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      座椅
    </lark-td>
    <lark-td>
      座椅按摩/通风/加热开关
      座椅按摩/通风/加热档位调节
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      灯光
    </lark-td>
    <lark-td>
      阅读灯/氛围灯开关
      氛围灯颜色调节（基础颜色）
      危险警报灯开关
      远近光灯开关
      雾灯开关
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      车窗控制
    </lark-td>
    <lark-td>
      车窗开关
      后备箱开关
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      雨刮
    </lark-td>
    <lark-td>
      雨刮开关
      雨刮档位调节
      玻璃清洗
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      方向盘
    </lark-td>
    <lark-td>
      方向盘加热开关
      方向盘加热档位调节
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      驾驶模式
    </lark-td>
    <lark-td>
      驾驶模式设置
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      倒车影像
    </lark-td>
    <lark-td>
      倒车影像开关
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="2">
      系统控制类
    </lark-td>
    <lark-td>
      声音调节
    </lark-td>
    <lark-td>
      音量大小调节（媒体/导航/语音/电话）
      低速行人提示音开关
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      屏幕亮度调节
    </lark-td>
    <lark-td>
      屏幕亮度调节
      屏幕显示模式调节（白天/黑夜）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="5">
      导航类
    </lark-td>
    <lark-td>
      目的地设置
    </lark-td>
    <lark-td>
      导航去具体地点
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      路线规划
    </lark-td>
    <lark-td>
      选择第几条路线
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      途经点添加
    </lark-td>
    <lark-td>
      添加具体地点为途经点
    </lark-td>
  </lark-tr>
  <lark-tr>
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
    <lark-td>
      应用控制
    </lark-td>
    <lark-td>
      应用开关
    </lark-td>
    <lark-td>
      打开/关闭应用（如：打开百度地图）
    </lark-td>
  </lark-tr>
</lark-table>

#### 不包含范围  

- 依赖实时网络的功能：如实时路况查询、在线音乐搜索、闲聊联网、复杂Agent等，此类指令需联网处理，离线模式下不支持；  如不属于离线范围时，离线模型输出「其他」

### 离线拒识模块

#### 概述

离线拒识模块是**用于在车辆无网/弱网情况下，判断人机对话中用户意图是否明确，并决定是否响应的交互策略工具**，核心目标是提升自然对话交互体验（减少过拒）和精准指令响应准确性（减少漏拒）。

离线拒识先支持纯文本拒识能力

#### 类型

- **单轮拒识**：针对单次对话（无上下文关联）的意图判断
- **多轮拒识**：针对多轮对话（需上下文关联）的意图判断

#### 基础判断标准

**需召回的正例（不拒识）**：

- 单轮：意图明确的场景对话（如功能控制、功能发起）。
- 多轮：上下文关联的对话（如代词 / 指示词指代、陈述 / 提问类继承），且主体、对象、动作、描述与上文强相关（例：“打开空调” 与 “调到23度吧” 关联）。

**需拒识的正例**：

- 非通顺对话（如 “嗯嗯呀”“继续防晒要走”）；
- 非人机指向（如 “你晚上别和孩子玩太晚”，非指向车机）；
- 上下文无关 query（主体、对象等与上文无关联，例：“这个拒识效果还行” 与 “这台车的功能” 无关）。

### 离线指令缓存

根据高频的指令进行提前的指令缓存，使其提升响应速度，命中cache的准确率要求100%，响应时间目标在50ms。

**离线指令缓存的定义原则**

为了保证离线缓存解析路径的性能与确定性，所有设计与实现必须遵循以下核心原则：

- **单轮解析**：离线缓存指令的解析严格限定在**单轮**交互内完成。系统不应，也无法引用任何历史对话内容来辅助理解当前指令。
- **上下文无关**：解析过程**与历史会话状态无关**。诸如“暂停播放”、“继续播放”、“就选它了”等依赖上下文的指令，不应纳入缓存解析的范畴。
- **结果唯一**：每一条纳入缓存集的指令，在离线命中路径上必须映射到**唯一的意图与槽位组合**。任何可能产生歧义或需要二次澄清才能决策的指令，都应被排除在缓存集之外，回退至其他解析路径。

**缓存指令清单**

##### （初始预设，支持后续迭代更新）
<lark-table rows="30" cols="2" header-row="true" column-widths="200,451">

  <lark-tr>
    <lark-td>
      功能
    </lark-td>
    <lark-td>
      **缓存指令**说法
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      电话
    </lark-td>
    <lark-td>
      查看通话记录
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      电话
    </lark-td>
    <lark-td>
      打开通讯录
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      播放控制
    </lark-td>
    <lark-td>
      播放下一首
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      播放控制
    </lark-td>
    <lark-td>
      播放上一首
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      播放控制
    </lark-td>
    <lark-td>
      打开歌词
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      音乐
    </lark-td>
    <lark-td>
      播放蓝牙音乐
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      音乐
    </lark-td>
    <lark-td>
      播放本地音乐
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      音乐
    </lark-td>
    <lark-td>
      播放收藏的歌
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      音乐
    </lark-td>
    <lark-td>
      收藏音乐
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      系统控制
    </lark-td>
    <lark-td>
      返回桌面
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      系统控制
    </lark-td>
    <lark-td>
      打开爱奇艺
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      系统控制
    </lark-td>
    <lark-td>
      打开行车记录仪
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      系统控制
    </lark-td>
    <lark-td>
      打开设置
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      系统控制
    </lark-td>
    <lark-td>
      媒体音量小一点
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      导航
    </lark-td>
    <lark-td>
      导航去公司
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      导航
    </lark-td>
    <lark-td>
      导航回家
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      导航
    </lark-td>
    <lark-td>
      退出导航
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      导航
    </lark-td>
    <lark-td>
      打开全览
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      导航
    </lark-td>
    <lark-td>
      退出全览
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      导航
    </lark-td>
    <lark-td>
      放大地图
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      导航
    </lark-td>
    <lark-td>
      缩小地图
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      导航
    </lark-td>
    <lark-td>
      刷新路线
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      车辆控制
    </lark-td>
    <lark-td>
      打开空调
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      车辆控制
    </lark-td>
    <lark-td>
      关闭空调
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      车辆控制
    </lark-td>
    <lark-td>
      空调调到23度
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      车辆控制
    </lark-td>
    <lark-td>
      打开座椅按摩
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      车辆控制
    </lark-td>
    <lark-td>
      打开车窗
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      车辆控制
    </lark-td>
    <lark-td>
      打开全景影像
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      语音控制
    </lark-td>
    <lark-td>
      退出语音
    </lark-td>
  </lark-tr>
</lark-table>
