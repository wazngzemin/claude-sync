# TOB简单复杂仲裁 针对AI汽车升级

<!-- doc_id: NWfNdsJlCoxnYUxIQ1RcTPYonx1 -->
<!-- total_length: 51323 -->


<lark-table rows="6" cols="4" column-widths="117,117,109,665">

  <lark-tr>
    <lark-td>
      版本号
    </lark-td>
    <lark-td>
      变更时间
    </lark-td>
    <lark-td>
      变更人
    </lark-td>
    <lark-td>
      变更内容
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      V0.1
    </lark-td>
    <lark-td>
      12月24日
    </lark-td>
    <lark-td>
      郝晓伟
    </lark-td>
    <lark-td>
      1. 创建初版，优化条件任务（十分钟后提醒我下高速）、带记忆的任务（导航去上次那家川菜馆） 被简单过召的情况，对应第一版
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      V0.2
    </lark-td>
    <lark-td>
      1月9日
    </lark-td>
    <lark-td>
      郝晓伟
    </lark-td>
    <lark-td>
      1. 针对近期测试简单过召情况，更新方案，优化以下被简单过召的情况：
        1. face id注册（认识一下副驾的明骏） 相关的query
        1. 需要结合情景的query（车里有点吵，调安静点）
        1. 需要结合联网信息的query（导航去上海最高的建筑附近的停车场）
        1. 记忆有关的case（记一下我的新手机号是xxx）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      V0.3
    </lark-td>
    <lark-td>
      1月30日
    </lark-td>
    <lark-td>
      郝晓伟
    </lark-td>
    <lark-td>
      1. 更新仲裁&意图**长期方案**：
        1. 条件任务增删改查相关（eg. 十分钟后提醒我下高速）：简单复杂仲裁区分
        1. 持续任务增删改查相关（eg. 接下来行程里给我介绍介绍沿途风景）：简单复杂仲裁区分
        1. Face id增删改查相关（eg. 认识一下副驾的明骏）：意图区分
        1. 记忆增删改查相关（eg. 记一下我的新手机号是xxx）：意图区分
        1. 需要用到记忆的任务（eg. 导航去上次那家川菜馆）：简单复杂仲裁区分
        1. 需要结合情景及端状态推理的query（eg. 车里有点吵，调安静点）：简单复杂仲裁区分
        1. 需要结合联网信息的query（eg. 导航去上海最高的建筑附近的停车场）：简单复杂仲裁区分
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      V0.4
    </lark-td>
    <lark-td>
      2月2日
    </lark-td>
    <lark-td>
      郝晓伟
    </lark-td>
    <lark-td>
      1. 新增“取消所有任务”、“删除所有任务”等任务操作类query的处理逻辑
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

# 背景

在AI汽车项目中，为了保障性能，还是需要把简单指令快速分走执行，其余内容给planner（AI汽车项目中核心的推理模块）。

当前串通的链路里，直接复用了TOB的简单复杂仲裁模型&意图模型，但无法满足项目需求，需要升级。

目前已针对演示上线了短期方案。

# 长期方案

## 背景概述

仲裁模型的判断标准是句式的简单和复杂，并非通过意图区分。所以长期方案中，需要对问题进行分类，意图分类有关的问题还是由意图模块处理。

## 需求详细内容
<lark-table rows="9" cols="4" column-widths="267,139,232,426">

  <lark-tr>
    <lark-td>
      **问题条目**
    </lark-td>
    <lark-td>
      **归属模块**
    </lark-td>
    <lark-td>
      **具体做法**
    </lark-td>
    <lark-td>
      **示例query**
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      条件和定时任务增删改查相关的query
    </lark-td>
    <lark-td>
      仲裁
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      - 条件任务新增：
        - 十分钟后帮我关掉座椅加热
        - 副驾上车后给她唱小星星
        - 车内温度超过28度之后让我凉快一下
        - 车内温度比较高时把我空调打开
        - 我比较累的时候给我放首歌
        - 世界毁灭时打开空调
        - 车内温度28度之后帮我把车炸了
      - 条件任务修改：
        - 把十分钟后关座椅加热的那个任务改成调小一档
        - 副驾上车后不用唱小星星了，改唱燃烧的爱火吧
      - 条件任务删除：
        - 把那个关座椅加热的任务删了吧
        - 取消副驾上车后唱歌的那个任务
        - 取消所有条件任务
      - 条件任务查询：
        - 现在开门之后会执行什么动作啊
        - 我刚跟你说我老婆上车后干啥来着
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      持续任务增删改查相关的query
    </lark-td>
    <lark-td>
      仲裁
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      - 持续任务新增：
        - 接下来的行程里给我介绍沿途的风景
        - 讲个笑话逗到我笑为止
      - 持续任务修改：
        - 5星以下的就别讲了，只介绍5星的吧
        - 算了你讲的笑话都不好听，还是别讲了，给我按按摩吧，带我把每个模式都体验一遍
      - 持续任务删除：
        - 不用再介绍风景了
        - 清除所有持续任务
        - 取消所有持续任务
      - 持续任务查询：
        - 现在我们有哪些持续任务啊
      <mention-doc token="WTPIwriowis0vNkETBfcpyTLnob" type="wiki">元旦后演示冲刺 planner种子数据&knowhow</mention-doc>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      任务操作（模糊）有关的query
    </lark-td>
    <lark-td>
      仲裁
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      - 取消所有任务
      - 删除所有任务
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      Face id增删改查相关的query
      <mention-user id="ou_f95ad20d270ef7eda6162a56846ee8b9"/>
    </lark-td>
    <lark-td>
      意图
    </lark-td>
    <lark-td>
      增加face id增删改查意图
    </lark-td>
    <lark-td>
      - Face id注册：
        - 认识一下坐在副驾的明骏，他是我的朋友
        - 认识一下坐在副驾的明骏
        - （音区）认识一下我、认识一下副驾
        - （人）认识一下明骏
        - （关系）认识一下我老婆
      - Face id修改：
        - 改名字：
          - 你以后喊白宇不要喊全名，叫他白白就好了
          - 副驾叫明骏，不是嘉锋，你记错了
        - 改关系：
          - 白宇是我的好朋友，不是我同事
          - 副驾是我老婆，不是我女朋友啦
      - Face id删除：不支持，需提示用户手动操作
        - 删掉xx的人脸信息
      - Face id查询：
        - 你知道副驾是谁么？
        - 你知道副驾和我是什么关系么？
        - 你知道明骏坐在那里么？
      更多可参考：<mention-doc token="WlF3wjCk9img8kkmBiEcxkbOnrr" type="wiki">Faceid 模块用户注册流程</mention-doc>4、说法枚举示例
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      记忆增删改查相关的query
    </lark-td>
    <lark-td>
      意图
    </lark-td>
    <lark-td>
      增加记忆增删改查意图
    </lark-td>
    <lark-td>
      - 记忆新增：
        - 帮我记一下我公司的地址是上海市闵行区漕河泾中心D栋
        - 帮我记一下我妈妈的新手机号是13888888888
      - 记忆修改：
        - 把我公司的地址改为上海市杨浦区新江湾广场T2 / 把我洗头的地址改为上海市杨浦区新江湾广场T2
        - 把我妈妈的手机号改成13999999999
      - 记忆删除：
        - 删掉我喜欢吃海底捞的记忆
        - 删掉我前女友相关的记忆
      - 记忆查询：
        - 我上次和你说的很好吃的那家店叫啥来着
        - 我老婆上次说让我给她买啥来着
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      需要结合记忆推理的query
    </lark-td>
    <lark-td>
      仲裁
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      - 去常去的那家咖啡店
      - 去我女儿辅导班的地方
      - 导航到我孩子的学校
      - 去上次加油的加油站
      - 导航到爸妈家
      - 去常去的健身房
      - 把氛围灯调到我喜欢的颜色
      - 播放我最喜欢歌手的歌
      - 导航到我预约的理发店
      - 播放我上次没听完的有声书
      - 导航去我今天早上去的那家包子店
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      需要结合情景以及端状态推理的query
    </lark-td>
    <lark-td>
      仲裁
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      - 车里好吵啊，调安静点
      - 外面好臭，帮我处理一下
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      需要结合联网信息推理的query
    </lark-td>
    <lark-td>
      仲裁
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      - 导航去上海最高的建筑附近的停车场
      - 播放我是歌手2024夺冠的那首歌
    </lark-td>
  </lark-tr>
</lark-table>

# 短期方案（已针对演示临时上线）

## 评测结果

<lark-table rows="51" cols="4" column-widths="127,237,244,224">

  <lark-tr>
    <lark-td>
      query类别
    </lark-td>
    <lark-td>
      query
    </lark-td>
    <lark-td>
      期望结果
    </lark-td>
    <lark-td>
      tob合并模型评测结果
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="4">
      模糊指令
    </lark-td>
    <lark-td>
      我屁股有点热
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      我腿都伸不直了
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      把车两边的耳朵收一收
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      把我头顶的布关上
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="2">
      条件和定时任务
    </lark-td>
    <lark-td>
      十分钟后帮我关掉座椅加热
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      我老婆上车后给她唱小星星
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="13">
      记忆类
    </lark-td>
    <lark-td>
      导航回家
    </lark-td>
    <lark-td>
      车控
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      导航去公司
    </lark-td>
    <lark-td>
      车控
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      去常去的那家咖啡店
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      去我女儿辅导班的地方
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      导航到我孩子的学校
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      去上次加油的加油站
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      导航到爸妈家
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      去常去的健身房
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      把氛围灯调到我喜欢的颜色
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      播放我最喜欢歌手的歌
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      导航到我预约的理发店
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      播放我上次没听完的有声书
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      导航去我今天早上去的那家包子店
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="9">
      人名类
    </lark-td>
    <lark-td>
      给明骏把座椅加热开了
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      让明骏凉快凉快
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      把明骏那边的空调打开
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      把我老婆那边的出风口关了
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      把我老婆那边的车窗打开
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      打开我老婆那边的车窗
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      打开我这边的车窗
    </lark-td>
    <lark-td>
      车控
    </lark-td>
    <lark-td>
      <text color="yellow">车控</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      打开张航的座椅按摩
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      打开我的座椅按摩
    </lark-td>
    <lark-td>
      车控
    </lark-td>
    <lark-td>
      <text color="yellow">车控</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="8">
      音乐相关
    </lark-td>
    <lark-td>
      播放林俊杰的小酒窝
    </lark-td>
    <lark-td>
      车控
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      赵雷有一首歌写的是张爱玲和渣男的故事，你知道是什么歌吗
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      有一首歌的歌词是请你不要到处扣扣，这是个什么歌
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      来点歌听听
    </lark-td>
    <lark-td>
      车控
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      推荐一些适合睡觉时听的歌
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      推荐一些林俊杰的歌听听
    </lark-td>
    <lark-td>
      车控
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      我想听林俊杰的咖啡调调专辑
    </lark-td>
    <lark-td>
      车控
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      给我来几个周深的专辑听听
    </lark-td>
    <lark-td>
      车控
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="5">
      多车控相关
    </lark-td>
    <lark-td>
      打开空调并打开座椅通风
    </lark-td>
    <lark-td>
      车控
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      打开空调并且把温度调到20度
    </lark-td>
    <lark-td>
      车控
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      打开车窗，关闭车内空调
    </lark-td>
    <lark-td>
      车控
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      导航到虹桥机场并播放音乐
    </lark-td>
    <lark-td>
      车控
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      播放音乐，并且把音量调小一点
    </lark-td>
    <lark-td>
      车控
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="5">
      多车控融合记忆
    </lark-td>
    <lark-td>
      导航回家并打开座椅通风
    </lark-td>
    <lark-td>
      车控
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      播放音乐，导航去常去的那家咖啡店
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      导航去公司，顺便给我老婆打个电话
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      去常去的那家咖啡店，顺便给我来点歌
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      导航到爸妈家，中间找个澡堂子
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="4">
      多意图
    </lark-td>
    <lark-td>
      打开空调，顺便找找附近有什么好吃的
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      开一下座椅通风，顺便给我讲个小兔子的故事
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      导航去爸妈家，顺便给我放点周董的歌听
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      打开车窗，学公鸡叫
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
  </lark-tr>
</lark-table>

1227实车测试结果：

<lark-table rows="11" cols="4" column-widths="127,237,244,224">

  <lark-tr>
    <lark-td>
      query类别
    </lark-td>
    <lark-td>
      query
    </lark-td>
    <lark-td>
      期望结果
    </lark-td>
    <lark-td>
      tob合并模型评测结果
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      **车里好吵啊，调安静点**
    </lark-td>
    <lark-td>
      **推理**
    </lark-td>
    <lark-td>
      <text color="red">**车控**</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      **后排有小孩，帮我把相关设置打开，再给他一个舒适的环境**
    </lark-td>
    <lark-td>
      **推理**
    </lark-td>
    <lark-td>
      <text color="red">**车控**</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      有点饿了，带我去我喜欢吃的火锅
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      把座椅按摩位置和加热调成我常用的
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      **外面好吵，整安静点**
    </lark-td>
    <lark-td>
      **推理**
    </lark-td>
    <lark-td>
      <text color="red">**车控**</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      放个我喜欢的音乐再导航去常去的洗车店
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      导航去常去公园溜溜弯顺便给车充充电
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      **导航去上海最高的建筑附近的停车场**
    </lark-td>
    <lark-td>
      **推理**
    </lark-td>
    <lark-td>
      <text color="red">**车控**</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      电量还有多少，导航去常去充电站顺路找个便利店
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      导航回趟父母家，顺便去山姆买点礼品
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
  </lark-tr>
</lark-table>

## 评测结果总结

1. 条件和定时任务增删改查相关的query，期望进planner，当前tob仲裁模型有概率分到「车控」，另外无对应意图，从而导致被简单过召无法处理；
1. 持续任务增删改查相关的query，期望进planner，当前tob仲裁模型有概率分到「车控」，另外无对应意图，从而导致被简单过召无法处理；
1. Face id增删改查相关的query，期望进planner，当前tob仲裁模型有概率分到「车控」，另外无对应意图，从而导致被简单过召无法处理；
1. 记忆增删改查相关的query，期望进planner，当前tob仲裁模型有概率分到「车控」，另外无对应意图，从而导致被简单过召无法处理；
1. 需要用到记忆的query，期望分到「推理」，当前tob仲裁模型会分到「车控」；
1. 需要结合情景及端状态推理的query，期望分到「推理」，当前tob仲裁模型会分到「车控」；
1. 需要结合联网信息的query，期望分到「推理」，当前tob仲裁模型会分到「车控」。

上述几条也是本次的升级目标。

## 短期方案概述

短期方案为通过训练仲裁模型，满足AI汽车1.0的临时演示需求。

短期方案上线情况：

- [x] 条件和定时任务增删改查相关的query，期望进planner，当前tob仲裁模型有概率分到「车控」，另外无对应意图，从而导致被简单过召无法处理；
- [ ] 持续任务增删改查相关的query，期望进planner，当前tob仲裁模型有概率分到「车控」，另外无对应意图，从而导致被简单过召无法处理；
- [x] Face id增删改查相关的query，期望进planner，当前tob仲裁模型有概率分到「车控」，另外无对应意图，从而导致被简单过召无法处理；
- [x] 记忆增删改查相关的query，期望进planner，当前tob仲裁模型有概率分到「车控」，另外无对应意图，从而导致被简单过召无法处理；
- [x] 需要用到记忆的query，期望分到「推理」，当前tob仲裁模型会分到「车控」；
- [ ] 需要结合情景及端状态推理的query，期望分到「推理」，当前tob仲裁模型会分到「车控」；
- [x] 需要结合联网信息的query，期望分到「推理」，当前tob仲裁模型会分到「车控」。

## 仲裁PE及复测情况

<grid cols="4">

  <column width="25">
    当前tob sp
  </column>
  <column width="25">
    产品1224更新sp：
  </column>
  <column width="25">
    产品1230更新sp：
  </column>
  <column width="25">
    算法0106更新sp：
  </column>

</grid>

<grid cols="4">

  <column width="25">
    ```python
    sp = """你的任务是判断用户的车控、媒体控制或导航指令应使用车控模型还是推理模型。
    车控模型用于处理和执行较为明确的指令。
    推理模型用于处理和执行较为复杂和模糊的指令，需要通过推理得出用户的真实意图。
    
    <车控模型介绍开始>
    ## 一、车控指令场景
    
    ### 明确指令
    示例：开一下空调
    声音开的太大了，调低一点
    
    ### 明确指令的反问表达
    示例：能不能给窗开一下
    
    ### 明确指令的否定表达
    示例：不用给我开窗了
    
    ### 单实体
    只有实体名称，虽然不完整，但属于车控。
    示例：车窗
    大钟寺2号楼
    
    ### 不完整表达
    指令缺少操作对象，虽然不完整，但属于车控。
    示例：调高一档
    向左调一点
    
    ### 明确指令的上下文继承
    定义：通过上下文信息可以得到用户当前的明确指令。
    示例：历史对话：座椅加热现在是几档。当前指令：换成3档
    
    ## 二、媒体控制场景
    
    ### 明确指令
    示例：
    声音开的太大了，调低一点
    暂停播放
    继续播放
    
    ### 明确指令的反问表达
    示例：
    能不能播放一下这首歌
    可以暂停吗
    
    ### 明确指令的否定表达
    示例：
    不用播放了
    不要暂停
    
    ### 不完整表达
    指令缺少操作对象，虽然不完整，但属于车控。
    示例：
    调高一点（在播放音乐的上下文中，指音量）
    暂停一下（在播放内容的上下文中）
    
    ### 明确指令的上下文继承
    定义：通过上下文信息可以得到用户当前的明确指令。
    示例：
    历史对话：正在播放周杰伦的歌曲。当前指令：调大一点（指音量）
    历史对话：刚刚播放的是哪首歌？当前指令：再播一遍
    
    ### 基于多媒体搜索的车控场景
    示例：
    基于语种搜索：我想听英文歌、播放一些粤语歌
    基于榜单搜索：我想听热歌榜的歌曲、放一些华语经典榜的歌
    基于奖项搜索：我想听格莱美奖的歌、可以放一些获得金曲奖的歌吗
    基于年代搜索：给我放些 80 年代的歌、我要听去年的歌曲
    基于风格搜索：放些古典歌曲、来点轻音乐听听
    基于乐器搜索：放点吉他曲听听、我要听钢琴曲
    基于主题搜索：我要听网络歌曲、我想来点经典老歌听听
    基于类别搜索：我想看些动画片、我想看电影
    基于标签搜索：我想看武侠片、给我推荐一些悬疑剧
    基于地区搜索：我想看美剧、播放一下港台剧
    基于年份搜索视频：有没有 20 年以后的电影播放看看、我想看最近一年的电视剧
    
    ## 三、导航指令场景
    
    ### 基于导航搜索的车控场景
    示例：
    普通导航指令：导航到xxx、去xxx
    导航设置：避开高速、避开收费
    导航查询：还有多远、剩余时间
    其他导航相关指令（除了路线体验相关）
    <车控模型介绍结束>
    
    <推理模型介绍开始>
    ## 一、车控指令场景
    
    ### 模糊指令
    定义：用户的车控指令模糊不清，或者过于口语。
    例如：打开头顶上的布
    给我捏捏背
    
    ### 表达感受
    定义：用户表达了感受，但没有明确的指令要求。
    如：声音怎么那么轻啊
    我腿有点伸不开了
    
    ### 需要额外信息推理
    例如：
    基于位置推理：开一下我女朋友那边的空调
    基于多媒体播放状态推理：我想听当前歌手的其他歌曲
    基于联网搜索推理：我想看沈腾最新演的电影
    基于人名推理：如打开沈腾的车窗
    
    ### 其他
    定义：不确定分类的指令。
    示例：你叫什么名字？
    
    ## 二、媒体控制场景
    
    ### 模糊指令
    定义：用户的媒体控制指令模糊不清，或者过于口语。
    例如：
    放点好听的
    来点音乐
    
    ### 表达感受
    定义：用户表达了感受，但没有明确的指令要求。
    如：
    声音怎么那么轻啊
    这首歌有点吵
    
    ### 需要额外信息推理
    例如：
    基于作词作曲搜索：播放方文山作词的歌曲、播放郭顶作曲的歌曲
    基于歌曲专辑搜索：播放 xxx 专辑里其他的歌
    基于歌词搜索：播放风吹啊吹啊我的骄傲、挖呀挖呀挖是什么歌放下听听
    基于影视剧主题曲搜索：我想听甄嬛传的主题曲、听一下十里桃花的片尾曲
    基于人群搜索：播放适合 2 岁小孩听的儿歌、播放适合老年人听的
    基于场景搜索：播放婚礼上放的歌、我要收听 25 年春晚的歌、我想听五月天在上海演唱会上唱的歌
    基于情感搜索：放点甜蜜的歌听听、播放治愈的音乐
    不完整歌名推理：播放那个著名的歌曲叫什么什么的集市、放一首最近抖音上特别火的那个什么白鸽
    不完整歌手推理：把回忆拼好给你我要听姓王的人唱的
    基于主演搜索：我想看沈腾最新演的电影、我想看刘德华最近演的片子
    基于导演搜索：播放张艺谋导演的电影、播放徐峥导演的片子
    基于出品方搜索：我想看 BBC 出品的电视剧、华纳兄弟的电影播放看看
    基于奖项搜索：我要看获得奥斯卡奖的电影
    不完整影视剧推理：我要看最近杨紫和李现演的古装剧、我要看女主角从一个普通秀女逐步成长为皇太后传奇故事的那个剧
    不完整季数/集数推理：我要看跑男有白鹿和周深作为嘉宾的那期
    
    ### 其他
    定义：不确定分类的指令。
    示例：你叫什么名字？
    
    ## 三、导航指令场景
    
    ### 需要额外信息推理
    例如：
    基于路线体验推理：
    前面堵得一动不动，有没有别的路
    怎么老让我走小巷子，会车都费劲
    这条路看着近，但红绿灯太多了，能不能少等点
    切换到路线躲避拥堵
    <推理模型介绍结束>
    
    要求
    请根据上下文，判断用户最后一轮的指令属于车控还是推理。"""
    ```

  </column>
  <column width="25">
    ```markdown
    sp = """你的任务是判断用户的车控、媒体控制或导航指令应使用车控模型还是推理模型。
    车控模型用于处理和执行较为明确的指令。
    推理模型用于处理和执行较为复杂和模糊的指令、带条件的指令，或者依赖用户记忆信息的指令，需要通过推理得出用户的真实意图。
    
    <车控模型介绍开始>
    ## 一、车控指令场景
    
    ### 明确指令
    示例：开一下空调
    声音开的太大了，调低一点
    
    ### 明确指令的反问表达
    示例：能不能给窗开一下
    
    ### 明确指令的否定表达
    示例：不用给我开窗了
    
    ### 单实体
    只有实体名称，虽然不完整，但属于车控。
    示例：车窗
    大钟寺2号楼
    
    ### 不完整表达
    指令缺少操作对象，虽然不完整，但属于车控。
    示例：调高一档
    向左调一点
    
    ### 明确指令的上下文继承
    定义：通过上下文信息可以得到用户当前的明确指令。
    示例：历史对话：座椅加热现在是几档。当前指令：换成3档
    
    ## 二、媒体控制场景
    
    ### 明确指令
    示例：
    声音开的太大了，调低一点
    暂停播放
    继续播放
    
    ### 明确指令的反问表达
    示例：
    能不能播放一下这首歌
    可以暂停吗
    
    ### 明确指令的否定表达
    示例：
    不用播放了
    不要暂停
    
    ### 不完整表达
    指令缺少操作对象，虽然不完整，但属于车控。
    示例：
    调高一点（在播放音乐的上下文中，指音量）
    暂停一下（在播放内容的上下文中）
    
    ### 明确指令的上下文继承
    定义：通过上下文信息可以得到用户当前的明确指令。
    示例：
    历史对话：正在播放周杰伦的歌曲。当前指令：调大一点（指音量）
    历史对话：刚刚播放的是哪首歌？当前指令：再播一遍
    
    ### 基于多媒体搜索的车控场景
    示例：
    基于语种搜索：我想听英文歌、播放一些粤语歌
    基于榜单搜索：我想听热歌榜的歌曲、放一些华语经典榜的歌
    基于奖项搜索：我想听格莱美奖的歌、可以放一些获得金曲奖的歌吗
    基于年代搜索：给我放些 80 年代的歌、我要听去年的歌曲
    基于风格搜索：放些古典歌曲、来点轻音乐听听
    基于乐器搜索：放点吉他曲听听、我要听钢琴曲
    基于主题搜索：我要听网络歌曲、我想来点经典老歌听听
    基于类别搜索：我想看些动画片、我想看电影
    基于标签搜索：我想看武侠片、给我推荐一些悬疑剧
    基于地区搜索：我想看美剧、播放一下港台剧
    基于年份搜索视频：有没有 20 年以后的电影播放看看、我想看最近一年的电视剧
    
    ## 三、导航指令场景
    
    ### 基于导航搜索的车控场景
    示例：
    普通导航指令：导航到xxx、去xxx（明确地址、家、公司）
    导航设置：避开高速、避开收费
    导航查询：还有多远、剩余时间
    其他导航相关指令（除了路线体验相关）
    
    ## 四、组合指令场景
    以上三类简单指令的组合指令。
    示例：
    打开空调并打开方向盘加热
    导航回家顺便播放林俊杰的小酒窝
    <车控模型介绍结束>
    
    <推理模型介绍开始>
    ## 一、车控指令场景
    
    ### 模糊指令
    定义：用户的车控指令模糊不清，或者过于口语。
    例如：打开头顶上的布
    给我捏捏背
    收一收车两边的耳朵
    
    ### 带触发条件的指令
    定义：需要满足一定条件后触发，非即时触发。
    例如：十分钟后打开座椅加热
    车内温度超过28度后打开空调
    副驾上车后给她打开座椅通风
    
    ### 表达感受
    定义：用户表达了感受，但没有明确的指令要求。
    如：声音怎么那么轻啊
    我腿有点伸不开了
    
    ### 需要额外信息推理
    例如：
    基于位置推理：开一下我的座椅通风、开一下我女朋友那边的空调
    基于多媒体播放状态推理：我想听当前歌手的其他歌曲
    基于联网搜索推理：我想看沈腾最新演的电影
    基于人名推理：如打开沈腾的车窗
    基于用户记忆和偏好推理：把座椅通风开到我喜欢的档位、氛围灯调到小美喜欢的颜色
    
    ### 其他
    定义：不确定分类的指令。
    示例：你叫什么名字？
    
    ## 二、媒体控制场景
    
    ### 模糊指令
    定义：用户的媒体控制指令模糊不清，或者过于口语。
    例如：
    放点好听的
    来点音乐
    
    ### 带触发条件的指令
    定义：需要满足一定条件后触发，非即时触发。
    例如：十分钟后播点歌听听
    车里人睡着之后把音乐关了
    
    ### 表达感受
    定义：用户表达了感受，但没有明确的指令要求。
    如：
    声音怎么那么轻啊
    这首歌有点吵
    
    ### 需要额外信息推理
    例如：
    基于作词作曲搜索：播放方文山作词的歌曲、播放郭顶作曲的歌曲
    基于歌曲专辑搜索：播放 xxx 专辑里其他的歌
    基于歌词搜索：播放风吹啊吹啊我的骄傲、挖呀挖呀挖是什么歌放下听听
    基于影视剧主题曲搜索：我想听甄嬛传的主题曲、听一下十里桃花的片尾曲
    基于人群搜索：播放适合 2 岁小孩听的儿歌、播放适合老年人听的
    基于场景搜索：播放婚礼上放的歌、我要收听 25 年春晚的歌、我想听五月天在上海演唱会上唱的歌
    基于情感搜索：放点甜蜜的歌听听、播放治愈的音乐
    不完整歌名推理：播放那个著名的歌曲叫什么什么的集市、放一首最近抖音上特别火的那个什么白鸽
    不完整歌手推理：把回忆拼好给你我要听姓王的人唱的
    基于主演搜索：我想看沈腾最新演的电影、我想看刘德华最近演的片子
    基于导演搜索：播放张艺谋导演的电影、播放徐峥导演的片子
    基于出品方搜索：我想看 BBC 出品的电视剧、华纳兄弟的电影播放看看
    基于奖项搜索：我要看获得奥斯卡奖的电影
    不完整影视剧推理：我要看最近杨紫和李现演的古装剧、我要看女主角从一个普通秀女逐步成长为皇太后传奇故事的那个剧
    不完整季数/集数推理：我要看跑男有白鹿和周深作为嘉宾的那期
    基于用户记忆和偏好推理：放点小美喜欢的音乐、播放我喜欢的歌手的歌
    
    ### 其他
    定义：不确定分类的指令。
    示例：你叫什么名字？
    
    ## 三、导航指令场景
    
    ### 带触发条件的指令
    定义：需要满足一定条件后触发，非即时触发。
    例如：早上我上车之后导航去公司
    晚上我上车之后导航回家
    
    ### 需要额外信息推理
    例如：
    基于路线体验推理：
    前面堵得一动不动，有没有别的路
    怎么老让我走小巷子，会车都费劲
    这条路看着近，但红绿灯太多了，能不能少等点
    切换到路线躲避拥堵
    
    基于用户记忆和偏好推理：
    去我女儿辅导班的地方
    导航去上次那家好吃的烤鸭店
    去常去的那家咖啡店
    导航去我爸妈家
    
    ## 四、组合指令场景
    包含任意一种复杂指令的组合指令。
    示例：
    播放林俊杰的小酒窝并导航到我爸妈家（爸妈家属于记忆信息）
    导航去上次那家烤肉店并打开空调（上次那家烤肉店属于记忆信息）
    导航去公司，顺便去常去的那家包子店（常去的包子店属于记忆信息）
    
    <推理模型介绍结束>
    
    要求
    请根据上下文，判断用户最后一轮的指令属于车控还是推理。如果是推理，直接说：推理；如果是车控，直接说：车控。不要输出其他内容。"""
    ```

  </column>
  <column width="25">
    ```shell
    sp = """你的任务是判断用户的指令应使用车控模型还是推理模型。
    车控模型用于处理和执行较为明确的指令。
    推理模型用于处理和执行较为复杂的指令、模糊的指令、带条件的指令，或者依赖用户记忆信息、当前情景、联网搜索信息的指令，需要通过推理得出用户的真实意图。
    
    <车控模型介绍开始>
    ## 一、车控指令场景
    
    ### 明确指令
    示例：开一下空调
    声音开的太大了，调低一点
    
    ### 明确指令的反问表达
    示例：能不能给窗开一下
    
    ### 明确指令的否定表达
    示例：不用给我开窗了
    
    ### 单实体
    只有实体名称，虽然不完整，但属于车控。
    示例：车窗
    大钟寺2号楼
    
    ### 不完整表达
    指令缺少操作对象，虽然不完整，但属于车控。
    示例：调高一档
    向左调一点
    
    ### 明确指令的上下文继承
    定义：通过上下文信息可以得到用户当前的明确指令。
    示例：历史对话：座椅加热现在是几档。当前指令：换成3档
    
    ## 二、媒体控制场景
    
    ### 明确指令
    示例：
    声音开的太大了，调低一点
    暂停播放
    继续播放
    
    ### 明确指令的反问表达
    示例：
    能不能播放一下这首歌
    可以暂停吗
    
    ### 明确指令的否定表达
    示例：
    不用播放了
    不要暂停
    
    ### 不完整表达
    指令缺少操作对象，虽然不完整，但属于车控。
    示例：
    调高一点（在播放音乐的上下文中，指音量）
    暂停一下（在播放内容的上下文中）
    
    ### 明确指令的上下文继承
    定义：通过上下文信息可以得到用户当前的明确指令。
    示例：
    历史对话：正在播放周杰伦的歌曲。当前指令：调大一点（指音量）
    历史对话：刚刚播放的是哪首歌？当前指令：再播一遍
    
    ### 基于多媒体搜索的车控场景
    示例：
    基于语种搜索：我想听英文歌、播放一些粤语歌
    基于榜单搜索：我想听热歌榜的歌曲、放一些华语经典榜的歌
    基于奖项搜索：我想听格莱美奖的歌、可以放一些获得金曲奖的歌吗
    基于年代搜索：给我放些 80 年代的歌、我要听去年的歌曲
    基于风格搜索：放些古典歌曲、来点轻音乐听听
    基于乐器搜索：放点吉他曲听听、我要听钢琴曲
    基于主题搜索：我要听网络歌曲、我想来点经典老歌听听
    基于类别搜索：我想看些动画片、我想看电影
    基于标签搜索：我想看武侠片、给我推荐一些悬疑剧
    基于地区搜索：我想看美剧、播放一下港台剧
    基于年份搜索视频：有没有 20 年以后的电影播放看看、我想看最近一年的电视剧
    
    ## 三、导航指令场景
    
    ### 基于导航搜索的车控场景
    示例：
    普通导航指令：导航到xxx、去xxx（明确地址、家、公司）
    导航设置：避开高速、避开收费
    导航查询：还有多远、剩余时间
    其他导航相关指令（除了路线体验相关）
    
    ## 四、组合指令场景
    以上三类简单指令的组合指令。
    示例：
    打开空调并打开方向盘加热
    导航回家顺便播放林俊杰的小酒窝
    <车控模型介绍结束>
    
    <推理模型介绍开始>
    ## 一、车控指令场景
    
    ### 模糊指令
    定义：用户的车控指令模糊不清，或者过于口语。
    例如：打开头顶上的布
    给我捏捏背
    收一收车两边的耳朵
    
    ### 带触发条件的指令
    定义：需要满足一定条件后触发，非即时触发。
    例如：十分钟后打开座椅加热
    车内温度超过28度后打开空调
    副驾上车后给她打开座椅通风
    
    ### 表达感受
    定义：用户表达了感受，但没有明确的指令要求。
    如：声音怎么那么轻啊
    我腿有点伸不开了
    
    ### 需要额外信息推理
    例如：
    基于位置推理：开一下我的座椅通风、开一下我女朋友那边的空调
    基于多媒体播放状态推理：我想听当前歌手的其他歌曲
    基于联网搜索推理：我想看沈腾最新演的电影
    基于人名推理：如打开沈腾的车窗
    基于用户记忆和偏好推理：把座椅通风开到我喜欢的档位、氛围灯调到小美喜欢的颜色
    基于当前情景推理：如车里好吵调安静点（有可能是关车窗、有可能是调音量，需要基于情景进行推理）
    
    ### 其他
    定义：不确定分类的指令。
    示例：你叫什么名字？
    
    ## 二、媒体控制场景
    
    ### 模糊指令
    定义：用户的媒体控制指令模糊不清，或者过于口语。
    例如：
    放点好听的
    来点音乐
    
    ### 带触发条件的指令
    定义：需要满足一定条件后触发，非即时触发。
    例如：十分钟后播点歌听听
    车里人睡着之后把音乐关了
    
    ### 表达感受
    定义：用户表达了感受，但没有明确的指令要求。
    如：
    声音怎么那么轻啊
    这首歌有点吵
    
    ### 需要额外信息推理
    例如：
    基于作词作曲搜索：播放方文山作词的歌曲、播放郭顶作曲的歌曲
    基于歌曲专辑搜索：播放 xxx 专辑里其他的歌
    基于歌词搜索：播放风吹啊吹啊我的骄傲、挖呀挖呀挖是什么歌放下听听
    基于影视剧主题曲搜索：我想听甄嬛传的主题曲、听一下十里桃花的片尾曲
    基于人群搜索：播放适合 2 岁小孩听的儿歌、播放适合老年人听的
    基于场景搜索：播放婚礼上放的歌、我要收听 25 年春晚的歌、我想听五月天在上海演唱会上唱的歌
    基于情感搜索：放点甜蜜的歌听听、播放治愈的音乐
    不完整歌名推理：播放那个著名的歌曲叫什么什么的集市、放一首最近抖音上特别火的那个什么白鸽
    不完整歌手推理：把回忆拼好给你我要听姓王的人唱的
    基于主演搜索：我想看沈腾最新演的电影、我想看刘德华最近演的片子
    基于导演搜索：播放张艺谋导演的电影、播放徐峥导演的片子
    基于出品方搜索：我想看 BBC 出品的电视剧、华纳兄弟的电影播放看看
    基于奖项搜索：我要看获得奥斯卡奖的电影
    不完整影视剧推理：我要看最近杨紫和李现演的古装剧、我要看女主角从一个普通秀女逐步成长为皇太后传奇故事的那个剧
    不完整季数/集数推理：我要看跑男有白鹿和周深作为嘉宾的那期
    基于用户记忆和偏好推理：放点小美喜欢的音乐、播放我喜欢的歌手的歌
    基于当前情景推理：找点符合车外风景氛围的歌听听
    
    ### 其他
    定义：不确定分类的指令。
    示例：你叫什么名字？
    
    ## 三、导航指令场景
    
    ### 带触发条件的指令
    定义：需要满足一定条件后触发，非即时触发。
    例如：早上我上车之后导航去公司
    晚上我上车之后导航回家
    
    ### 需要额外信息推理
    例如：
    基于路线体验推理：前面堵得一动不动，有没有别的路
    怎么老让我走小巷子，会车都费劲
    这条路看着近，但红绿灯太多了，能不能少等点
    切换到路线躲避拥堵
    
    基于用户记忆和偏好推理：
    去我女儿辅导班的地方
    导航去上次那家好吃的烤鸭店
    去常去的那家咖啡店
    导航去我爸妈家
    
    基于联网信息推理：
    我想去上海最高的楼
    我想去上海最大的湖
    
    ## 四、组合指令场景
    包含任意一种复杂指令的组合指令。
    示例：
    播放林俊杰的小酒窝并导航到我爸妈家（爸妈家属于记忆信息）
    导航去上次那家烤肉店并打开空调（上次那家烤肉店属于记忆信息）
    导航去公司，顺便去常去的那家包子店（常去的包子店属于记忆信息）
    
    <推理模型介绍结束>
    
    要求
    请根据上下文，判断用户最后一轮的指令属于车控还是推理。如果是推理，直接说：推理；如果是车控，直接说：车控。不要输出其他内容。"""
    ```

  </column>
  <column width="25">
    <mention-doc token="T9fZdOe6Vo2E6Mx4540cZ8N3noe" type="docx">【AI汽车】仲裁模型信息</mention-doc>
  </column>

</grid>

<lark-table rows="51" cols="7" column-widths="127,237,244,224,207,207,218">

  <lark-tr>
    <lark-td>
      query类别
    </lark-td>
    <lark-td>
      query
    </lark-td>
    <lark-td>
      期望结果
    </lark-td>
    <lark-td>
      tob合并模型评测结果
    </lark-td>
    <lark-td>
      1224 PE测试结果（seed 1.6 flash基模）
    </lark-td>
    <lark-td>
      1230 PE测试结果（seed 1.6 flash基模）
    </lark-td>
    <lark-td>
      0106 PE测试结果（精调模型）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="4">
      模糊指令
    </lark-td>
    <lark-td>
      我屁股有点热
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      待补充
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      我腿都伸不直了
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      把车两边的耳朵收一收
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      把我头顶的布关上
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="2">
      条件和定时任务
    </lark-td>
    <lark-td>
      十分钟后帮我关掉座椅加热
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      我老婆上车后给她唱小星星
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="13">
      记忆类
    </lark-td>
    <lark-td>
      导航回家
    </lark-td>
    <lark-td>
      车控
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      导航去公司
    </lark-td>
    <lark-td>
      车控
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      去常去的那家咖啡店
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      去我女儿辅导班的地方
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      导航到我孩子的学校
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      去上次加油的加油站
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      导航到爸妈家
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      去常去的健身房
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      把氛围灯调到我喜欢的颜色
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      播放我最喜欢歌手的歌
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      导航到我预约的理发店
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      播放我上次没听完的有声书
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      导航去我今天早上去的那家包子店
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="9">
      人名类
    </lark-td>
    <lark-td>
      给明骏把座椅加热开了
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      让明骏凉快凉快
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      把明骏那边的空调打开
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      把我老婆那边的出风口关了
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      把我老婆那边的车窗打开
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      打开我老婆那边的车窗
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      打开我这边的车窗
    </lark-td>
    <lark-td>
      车控
    </lark-td>
    <lark-td>
      <text color="yellow">车控</text>
    </lark-td>
    <lark-td>
      <text color="yellow">车控</text>
    </lark-td>
    <lark-td>
      <text color="yellow">车控</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      打开张航的座椅按摩
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      打开我的座椅按摩
    </lark-td>
    <lark-td>
      车控
    </lark-td>
    <lark-td>
      <text color="yellow">车控</text>
    </lark-td>
    <lark-td>
      <text color="yellow">车控</text>
    </lark-td>
    <lark-td>
      <text color="yellow">车控</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="8">
      音乐相关
    </lark-td>
    <lark-td>
      播放林俊杰的小酒窝
    </lark-td>
    <lark-td>
      车控
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      赵雷有一首歌写的是张爱玲和渣男的故事，你知道是什么歌吗
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      有一首歌的歌词是请你不要到处扣扣，这是个什么歌
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      来点歌听听
    </lark-td>
    <lark-td>
      车控
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      推荐一些适合睡觉时听的歌
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      推荐一些林俊杰的歌听听
    </lark-td>
    <lark-td>
      车控
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      我想听林俊杰的咖啡调调专辑
    </lark-td>
    <lark-td>
      车控
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      给我来几个周深的专辑听听
    </lark-td>
    <lark-td>
      车控
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="5">
      多车控相关
    </lark-td>
    <lark-td>
      打开空调并打开座椅通风
    </lark-td>
    <lark-td>
      车控
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      打开空调并且把温度调到20度
    </lark-td>
    <lark-td>
      车控
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      打开车窗，关闭车内空调
    </lark-td>
    <lark-td>
      车控
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      导航到虹桥机场并播放音乐
    </lark-td>
    <lark-td>
      车控
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      播放音乐，并且把音量调小一点
    </lark-td>
    <lark-td>
      车控
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="5">
      多车控融合记忆
    </lark-td>
    <lark-td>
      导航回家并打开座椅通风
    </lark-td>
    <lark-td>
      车控
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
    <lark-td>
      <text color="green">车控</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      播放音乐，导航去常去的那家咖啡店
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      导航去公司，顺便给我老婆打个电话
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      去常去的那家咖啡店，顺便给我来点歌
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      导航到爸妈家，中间找个澡堂子
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="4">
      多意图
    </lark-td>
    <lark-td>
      打开空调，顺便找找附近有什么好吃的
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      开一下座椅通风，顺便给我讲个小兔子的故事
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      导航去爸妈家，顺便给我放点周董的歌听
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      打开车窗，学公鸡叫
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

<lark-table rows="11" cols="7" column-widths="127,237,244,224,207,207,218">

  <lark-tr>
    <lark-td>
      query类别
    </lark-td>
    <lark-td>
      query
    </lark-td>
    <lark-td>
      期望结果
    </lark-td>
    <lark-td>
      tob合并模型评测结果
    </lark-td>
    <lark-td>
      1224 PE测试结果（seed 1.6 flash基模）
    </lark-td>
    <lark-td>
      1230 PE测试结果（seed 1.6 flash基模）
    </lark-td>
    <lark-td>
      0106 PE测试结果（精调模型）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="4">
    </lark-td>
    <lark-td>
      车里好吵啊，调安静点
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
      待补充
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      后排有小孩，帮我把相关设置打开，再给他一个舒适的环境
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      有点饿了，带我去我喜欢吃的火锅
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      把座椅按摩位置和加热调成我常用的
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      外面好吵，整安静点
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      放个我喜欢的音乐再导航去常去的洗车店
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      导航去常去公园溜溜弯顺便给车充充电
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      导航去上海最高的建筑附近的停车场
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      电量还有多少，导航去常去充电站顺路找个便利店
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      导航回趟父母家，顺便去山姆买点礼品
    </lark-td>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      <text color="red">车控</text>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      <text color="green">推理</text>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

<lark-table rows="2" cols="7" column-widths="127,237,244,224,207,207,218">

  <lark-tr>
    <lark-td>
      query类别
    </lark-td>
    <lark-td>
      query
    </lark-td>
    <lark-td>
      期望结果
    </lark-td>
    <lark-td>
      tob合并模型评测结果
    </lark-td>
    <lark-td>
      1224 PE测试结果（seed 1.6 flash基模）
    </lark-td>
    <lark-td>
      1230 PE测试结果（seed 1.6 flash基模）
    </lark-td>
    <lark-td>
      0106 PE测试结果（精调模型）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      Face id注册相关
    </lark-td>
    <lark-td>
      <mention-doc token="WlF3wjCk9img8kkmBiEcxkbOnrr" type="wiki">Faceid 模块用户注册流程</mention-doc>4、说法枚举示例（点击会自动跳转）
    </lark-td>
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
