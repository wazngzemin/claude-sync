# 【AICar】主线端侧VLM需求汇总（飞书原文转存；更新时间 2026-04-22T15:00:58+08:00）

来源链接：https://bytedance.larkoffice.com/docx/NkPcdPIcgoRFZzxOMbOcTNTvnYf

> 

# 整车Camera布局

<image token="DM4wbjR77oJP6ix9q1vcJFqznRf" width="820" height="425"/>

# PR&高感Case示例

[【飞书文档】【AI汽车】视觉场景梳理](https%3A%2F%2Fbytedance.larkoffice.com%2Fwiki%2FRSAiwOOySiPNuGkVnYkc0StgnGg)

# AlwaysOn舱内外感知任务

## 舱内持续感知

### 业务流程

<image token="KoRcbpM3eoaRXWxO7gRcMk7fnve" width="631" height="386"/>

### 功能列表

- 模型能力

<lark-table rows="12" cols="9" column-widths="100,100,100,100,100,100,100,100,100">

  <lark-tr>
    <lark-td colspan="3">
      维度
    </lark-td>
    <lark-td>
      原子信息点 (检查项)
    </lark-td>
    <lark-td>
      数据类型
    </lark-td>
    <lark-td>
      需求类型
    </lark-td>
    <lark-td>
      信息类型
    </lark-td>
    <lark-td>
      描述示例
    </lark-td>
    <lark-td>
      计分方式
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="11">
      舱内
    </lark-td>
    <lark-td rowspan="9">
      乘客相关
      （含动物）
    </lark-td>
    <lark-td rowspan="4">
      乘客识别
    </lark-td>
    <lark-td>
      数量与位置: 总人数是否正确？每位乘客的位置（如“驾驶位”,“后排左侧”）是否正确？
    </lark-td>
    <lark-td>
      enum
    </lark-td>
    <lark-td>
      精确
    </lark-td>
    <lark-td>
      静态
    </lark-td>
    <lark-td>
      主驾，副驾，二排左，二排中，二排右，三排左，三排中，三排右
    </lark-td>
    <lark-td rowspan="4">
      精确匹配=1, 错误/遗漏=0
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      乘客年龄：人的年龄识别是否准确
    </lark-td>
    <lark-td>
      str
    </lark-td>
    <lark-td>
      精确
    </lark-td>
    <lark-td>
      静态
    </lark-td>
    <lark-td rowspan="2">
      1. 一个成年男性
			2. 一位老年女性
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      乘客性别：人的性别识别是否准确
    </lark-td>
    <lark-td>
      str
    </lark-td>
    <lark-td>
      精确
    </lark-td>
    <lark-td>
      静态
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      动物及其类型：宠物颜色、种类
    </lark-td>
    <lark-td>
      str
    </lark-td>
    <lark-td>
      泛化
    </lark-td>
    <lark-td>
      静态
    </lark-td>
    <lark-td>
      1. 深色猫
			2. 斑点狗
			3. 浅色狗，拉布拉多
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="2">
      乘客属性
    </lark-td>
    <lark-td>
      着装 (类型与颜色): 每位乘客的关键衣物类型与颜色是否正确？
    </lark-td>
    <lark-td>
      str
    </lark-td>
    <lark-td>
      泛化
    </lark-td>
    <lark-td>
      静态
    </lark-td>
    <lark-td>
      1. 紫色毛衣外套
			2. 绿色套头衫带字母
			3. 深色高领毛衣
			4. 拼色卫衣
    </lark-td>
    <lark-td rowspan="2">
      类型与颜色均对=1, 对一个=0.5, 错误=0
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      发型头饰：每位乘客的发型发色和头饰描述是否正确
    </lark-td>
    <lark-td>
      str
    </lark-td>
    <lark-td>
      泛化
    </lark-td>
    <lark-td>
      静态
    </lark-td>
    <lark-td>
      1. 一头黑色齐肩长发
			2. 灰色的鸭舌帽，两侧露出浅色耳发
			3. 利落的短发，头戴白色的罩耳式耳机
			4. 戴无框眼镜
			5. 齐刘海短发
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="2">
      乘客状态
    </lark-td>
    <lark-td>
      核心动作: 每位乘客的主要动作（如“驾驶”,“睡觉”,“吃东西”）是否识别？
    </lark-td>
    <lark-td>
      str
    </lark-td>
    <lark-td>
      泛化
    </lark-td>
    <lark-td>
      动态
    </lark-td>
    <lark-td>
      1. 打盹
			2. 看手机
			3. 和他人谈笑
    </lark-td>
    <lark-td>
      主要动作正确=1, 动作识别不准但合理=0.5, 错误/遗漏=0
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      核心神态: 每位乘客的情绪/精神状态（如“疲惫”, “微笑着”）是否合理？
    </lark-td>
    <lark-td>
      str
    </lark-td>
    <lark-td>
      泛化
    </lark-td>
    <lark-td>
      动态
    </lark-td>
    <lark-td>
      1. 疲惫
			2. 愉快
			3. 有点烦躁
    </lark-td>
    <lark-td>
      完全一致=1, 合理但不准确=0.7, 错误/遗漏=0
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      安全相关
    </lark-td>
    <lark-td>
      关键安全状态: 安全带是否系好？是否存在危险品？
    </lark-td>
    <lark-td>
      str
    </lark-td>
    <lark-td>
      精确
    </lark-td>
    <lark-td>
      静态
    </lark-td>
    <lark-td>
      1. 安全带没系好
			2. 有压缩罐
    </lark-td>
    <lark-td>
      错误则触发Safety_Gate。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td colspan="2">
      物品相关
    </lark-td>
    <lark-td>
      位置和类型：是否可以描述清楚物品类型和其在陈内的相对位置
    </lark-td>
    <lark-td>
      str
    </lark-td>
    <lark-td>
      泛化
    </lark-td>
    <lark-td>
      静态
    </lark-td>
    <lark-td>
      1. 后排中央座椅缝隙处放置一本摊开的彩色图画书（黄底封面，含狮子等动物图案）
			2. 后排中央座椅靠背处放置一把收拢的黑色雨伞
			3. 右侧头枕旁有白色塑料杯，左侧椅背后有一深色外套
    </lark-td>
    <lark-td>
      精确匹配=1, 部分正确=0.5, 错误/遗漏=0
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td colspan="2">
      整体描述相关
    </lark-td>
    <lark-td>
      互动关系于氛围：概括车内人人（动物）之间、人物之间的互动关系，以及整体氛围
    </lark-td>
    <lark-td>
      str
    </lark-td>
    <lark-td>
      泛化
    </lark-td>
    <lark-td>
      动态
    </lark-td>
    <lark-td>
      1. 三人同乘，副驾部分入镜，后排两人各安其位：成人静默、孩童小憩，无明显互动但空间和谐，氛围安静日常
			2. 后排小孩正侧躺在后排左的腿上玩玩具；
			3. 主驾正接过副驾递的水瓶
    </lark-td>
    <lark-td>
      完全一致=1, 合理但不准确=0.7, 错误/遗漏=0
    </lark-td>
  </lark-tr>
</lark-table>

### 关联Camera及输入分辨率

<lark-table rows="2" cols="6" column-widths="122,122,122,122,122,122">

  <lark-tr>
    <lark-td>
      关联摄像头
    </lark-td>
    <lark-td>
      视角范围
    </lark-td>
    <lark-td>
      摄像头像素
    </lark-td>
    <lark-td>
      原始图像分辨率
    </lark-td>
    <lark-td>
      输入模型图像分辨率
    </lark-td>
    <lark-td>
      任务所需帧率
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      OMS
    </lark-td>
    <lark-td>
      水平FOV >=180°
    </lark-td>
    <lark-td>
      500w
    </lark-td>
    <lark-td>
      2592*1944
    </lark-td>
    <lark-td>
      TBD
    </lark-td>
    <lark-td>
      静态信息：单帧
      动态信息：多帧
    </lark-td>
  </lark-tr>
</lark-table>

### 任务评测指标

- 示例

<lark-table rows="3" cols="10" column-widths="100,100,100,100,100,100,100,100,100,100">

  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td rowspan="2">
      已知条件
    </lark-td>
    <lark-td rowspan="2">
      行为
    </lark-td>
    <lark-td rowspan="2">
      视频
    </lark-td>
    <lark-td rowspan="2">
      关键帧
    </lark-td>
    <lark-td rowspan="2">
      模型输出
    </lark-td>
    <lark-td colspan="2">
      Fidelity_Score
    </lark-td>
    <lark-td>
      Safety_Gate
    </lark-td>
    <lark-td rowspan="2">
      总分
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      汇总
    </lark-td>
    <lark-td>
      打分理由
    </lark-td>
    <lark-td>
      汇总
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      车内
    </lark-td>
    <lark-td>
      /
    </lark-td>
    <lark-td>
      看书，打哈欠，揉脖子，抠头皮，整理头发
    </lark-td>
    <lark-td>
      [主驾_159_1.mp4](https%3A%2F%2Finternal-api-drive-stream.larkoffice.com%2Fspace%2Fapi%2Fbox%2Fstream%2Fdownload%2Fpreview%2FMfcLbG2NxowcvfxFOKEcN2BSnxh%3Fmount_point%3Ddocx_file%26preview_type%3D16)
    </lark-td>
    <lark-td>
      <image token="RCtJbuvfRoZ8hmx8mtbcjQptnfd" width="1280" height="638"/>
    </lark-td>
    <lark-td>
      【主驾】戴圆框眼镜、穿米白拼接棕色外套，坐在主驾位（图右下），低头嘴巴微张似正出声或惊讶，神情专注投入；其余座位均无人。
      【物品】后排中央座椅靠背处放置一把收拢的黑色雨伞（带蓝色挂绳），右侧头枕旁有白色塑料杯（带盖），左侧椅背后有一深色外套。
      【整体描述】仅主驾1人入镜，情绪外显（如困倦/惊讶），其余座位空置；车内有雨伞、水杯、外套等生活物品，暗示短途出行或刚结束活动；氛围偏安静偶发动态，无他人互动，呈现独驾途中自然瞬间。
    </lark-td>
    <lark-td>
      5.7
    </lark-td>
    <lark-td>
      1+1+1+0.7+1+1
      当前应该是打哈欠，并不惊讶
    </lark-td>
    <lark-td>
      1
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

## 舱外持续感知

### 业务流程

<image token="FFM1bY41SoMe7Kx0BiEc0u4SnTb" width="631" height="386"/>

### 功能列表

<lark-table rows="8" cols="8" column-widths="100,100,100,100,100,100,100,100">

  <lark-tr>
    <lark-td colspan="2">
      维度
    </lark-td>
    <lark-td>
      原子信息点 (检查项)
    </lark-td>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      描述示例
    </lark-td>
    <lark-td>
      计分方式
    </lark-td>
    <lark-td>
      需求类型
    </lark-td>
    <lark-td>
      信息类型
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="7">
      舱外
    </lark-td>
    <lark-td rowspan="3">
      交通环境
    </lark-td>
    <lark-td>
      天气情况: 是晴天、阴天、雨天、雪天还是有雾？路面状况如何？
    </lark-td>
    <lark-td>
      str
    </lark-td>
    <lark-td>
      1. 当前为雨天,路面有明显积水
			2. 当前晴天,路面有强烈反光的冰面
			3. 当前阴天,路面平整但交通线模糊
    </lark-td>
    <lark-td>
      精确匹配=1, 相似天气=0.7, 错误=0
    </lark-td>
    <lark-td>
      精确
    </lark-td>
    <lark-td>
      静态
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      交通情况: 道路拥堵、畅通、缓行？周边车辆的关键信息（类型、颜色、数量）？特殊车辆是否用规定名称提及。包含特殊车辆识别（洒水车、救护车、消防车、警车、垃圾车、货车）
    </lark-td>
    <lark-td>
      str
    </lark-td>
    <lark-td>
      1. 道路上有多辆车,包括黄色出租车、红色SUV
			2. 道路畅通，对面来车是一辆消防车
    </lark-td>
    <lark-td>
      关键信息匹配度 > 80% = 1, 50-80% = 0.5, 否则=0
    </lark-td>
    <lark-td>
      泛化
    </lark-td>
    <lark-td>
      静态
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      自车情况：这辆所在环境
    </lark-td>
    <lark-td>
      str
    </lark-td>
    <lark-td>
      1. 位于停车场
      2.位于高架上，远处可见多个城市建筑
      3. 位于公路，左侧是山体遮挡了前方弯道，右侧是护栏
    </lark-td>
    <lark-td>
      识别到关键信息=1, 未识别=0
    </lark-td>
    <lark-td>
      泛化
    </lark-td>
    <lark-td>
      静态
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="3">
      交通元素
    </lark-td>
    <lark-td>
      交通信号灯: 颜色、形状（箭头/圆形）、倒计时是否准确？
    </lark-td>
    <lark-td>
      str
    </lark-td>
    <lark-td>
      1. 前方路口直行信号灯为红灯
			2. 前方路口左转和直行信号灯为绿灯，倒计时显示12秒
    </lark-td>
    <lark-td>
      信号灯颜色识别错误将直接触发Safety_Gate。其他部分错误=-1
    </lark-td>
    <lark-td>
      精确
    </lark-td>
    <lark-td>
      静态
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      交通标志: 限速、禁令、指示、警告标志的内容是否准确？
    </lark-td>
    <lark-td>
      str
    </lark-td>
    <lark-td>
      1. 右侧限速标识显示限速30公里每小时
			2. 前方路口标识有禁止驶入标志（红圈白底横杠）
    </lark-td>
    <lark-td>
      关键内容(如数字)错误=-1, 类型错误=0.5, 正确=1（无标志不提及视为正确）
    </lark-td>
    <lark-td>
      精确
    </lark-td>
    <lark-td>
      静态
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      动物：是否能识别可能影响驾驶的动物
    </lark-td>
    <lark-td>
      str
    </lark-td>
    <lark-td>
      1. 右后侧有羊群在缓慢靠近
			2. 左前方有2只牛正快速向本车前进方向行走
    </lark-td>
    <lark-td>
      正确识别=1, 未识别=0（没有时不提及，视为正确）
    </lark-td>
    <lark-td>
      泛化
    </lark-td>
    <lark-td>
      静态
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      地理信息
    </lark-td>
    <lark-td>
      环境/建筑与地标: 是否识别出关键参照物（建筑/环境/标识）、地标及其名称？
    </lark-td>
    <lark-td>
      str
    </lark-td>
    <lark-td>
      1. 道路左侧有一栋蓝色的建筑,上面写着“田林中学”
			2. 行驶前方有环岛，中间有颗巨大的树
    </lark-td>
    <lark-td>
      识别到关键信息=1, 未识别=0
    </lark-td>
    <lark-td>
      泛化
    </lark-td>
    <lark-td>
      静态
    </lark-td>
  </lark-tr>
</lark-table>

### 关联Camera及输入分辨率

<lark-table rows="2" cols="6" column-widths="122,122,122,122,122,122">

  <lark-tr>
    <lark-td>
      关联摄像头
    </lark-td>
    <lark-td>
      视角范围
    </lark-td>
    <lark-td>
      摄像头像素
    </lark-td>
    <lark-td>
      原始图像分辨率
    </lark-td>
    <lark-td>
      输入模型图像分辨率
    </lark-td>
    <lark-td>
      任务所需帧率
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      智驾前视广角/DVR
    </lark-td>
    <lark-td>
      水平FOV >=120°
    </lark-td>
    <lark-td>
      800w
    </lark-td>
    <lark-td>
      3840x2160
    </lark-td>
    <lark-td>
      TBD
    </lark-td>
    <lark-td>
      均为静态信息：单帧
    </lark-td>
  </lark-tr>
</lark-table>

### 任务评测指标

<lark-table rows="3" cols="11" column-widths="100,100,100,100,100,100,100,100,100,100,100">

  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td rowspan="2">
      已知条件
    </lark-td>
    <lark-td rowspan="2">
      类型
    </lark-td>
    <lark-td rowspan="2">
      视频
    </lark-td>
    <lark-td rowspan="2">
      关键帧
    </lark-td>
    <lark-td rowspan="2">
      模型输出
    </lark-td>
    <lark-td colspan="2">
      Fidelity_Score
    </lark-td>
    <lark-td colspan="2">
      Safety_Gate
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      汇总
    </lark-td>
    <lark-td>
      打分理由
    </lark-td>
    <lark-td>
      汇总
    </lark-td>
    <lark-td>
      打分理由
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      车外
    </lark-td>
    <lark-td>
      车外温度==2度
    </lark-td>
    <lark-td>
      城市道路
    </lark-td>
    <lark-td>
      [city-road.mp4](https%3A%2F%2Finternal-api-drive-stream.larkoffice.com%2Fspace%2Fapi%2Fbox%2Fstream%2Fdownload%2Fpreview%2FKXdcbOHU7o4IRoxchiRc1EPan5f%3Fmount_point%3Ddocx_file%26preview_type%3D16)
    </lark-td>
    <lark-td>
      <image token="VYxOb7vM3ocq4TxCAfxc9O2VnRd" width="1280" height="592"/>
    </lark-td>
    <lark-td>
      当前为晴天，车辆行驶在城市道路上。前方路口直行信号灯为绿灯，车辆可以继续前行。道路上有多辆车，包括银色轿车、黑色轿车等，它们都在有序行驶。道路左侧有一栋蓝色的建筑，上面写着“江西银行”，旁边有一些树木和停放的非机动车；道路右侧是一些高楼大厦
    </lark-td>
    <lark-td>
      4.5
    </lark-td>
    <lark-td>
      1+0.5+1+0+1+1
      交通情况50%：没有提及右侧摩托车和右前轿车
    </lark-td>
    <lark-td>
      1
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

# 系统预设端侧闭环任务

## 增强哨兵

### 业务流程

<image token="Y7MLbgCzUo9JUOx7HkQczPKwnzc" width="2564" height="705"/>

- 基础哨兵触发条件

<lark-table rows="5" cols="4" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      风险等级
    </lark-td>
    <lark-td>
      记录标识
    </lark-td>
    <lark-td>
      描述
    </lark-td>
    <lark-td>
      应对策略
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      低风险
    </lark-td>
    <lark-td>
      /
    </lark-td>
    <lark-td>
      30-150cm内的目标物靠近
    </lark-td>
    <lark-td>
      - 循环记录
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      中风险
    </lark-td>
    <lark-td>
      关注
    </lark-td>
    <lark-td>
      发生在<30cm内的有人/物靠近风险，未发生接触
    </lark-td>
    <lark-td>
      - 记录
      <text bgcolor="light-yellow">（记录策略：静止物体排除）</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      高风险
    </lark-td>
    <lark-td>
      高危
    </lark-td>
    <lark-td>
      车辆发生震动
    </lark-td>
    <lark-td>
      - 车外闪灯警告
			- 手机消息提醒
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      高风险
    </lark-td>
    <lark-td>
      高危
    </lark-td>
    <lark-td>
      车辆发生位置偏移
    </lark-td>
    <lark-td>
      - 车外闪灯警告
			- 手机消息提醒
    </lark-td>
  </lark-tr>
</lark-table>

### 功能列表

<lark-table rows="12" cols="5" column-widths="146,146,146,146,341">

  <lark-tr>
    <lark-td>
      功能名称
    </lark-td>
    <lark-td>
      一级功能
    </lark-td>
    <lark-td>
      二级功能
    </lark-td>
    <lark-td>
      三级功能
    </lark-td>
    <lark-td>
      详细描述
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="11">
      AI增强哨兵
    </lark-td>
    <lark-td rowspan="9">
      危险事件识别
    </lark-td>
    <lark-td rowspan="7">
      识别人相关的危险事件
    </lark-td>
    <lark-td>
      特殊人群识别
    </lark-td>
    <lark-td>
      - 外卖人员（穿制服：美团/饿了么/京东）
			- 快递员（穿制服：京东/顺丰等）
			- 在总结描述中描述特殊人员
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      划车事件
    </lark-td>
    <lark-td>
      - 人手持物品对车辆进行划伤，人手与车辆近距离产生位移
			- 不要求对物体的描述完全准确，要求判断划车动作
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      充电枪操作事件
    </lark-td>
    <lark-td>
      - 有人触碰充电枪的任何部位，在车辆充电的时候将充电枪试图拔走
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      踹车事件
    </lark-td>
    <lark-td>
      - 有人用脚与车辆侧面进行接触
			- 输入震动传感器的输入辅助判断
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      倚靠车辆事件
    </lark-td>
    <lark-td>
      - 有人将身体的各个部位与车辆发生接触
			- 窥视车内动作可识别为倚靠车辆
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      砸车事件
    </lark-td>
    <lark-td>
      - 有人使用物品向车辆投掷
			- 有人使用手持物品对车辆故意撞击
			- 输入震动传感器的输入辅助判断
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      交警执法事件
    </lark-td>
    <lark-td>
      - 车辆在非法停车位停放，识别到车外有交警正在贴罚单（附近车辆&本车车辆）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="2">
      识别车相关的危险事件
    </lark-td>
    <lark-td>
      碰撞剐蹭车辆
    </lark-td>
    <lark-td>
      - 对于两轮车、三轮车、四轮车等车辆的剐蹭事件进行识别
			- 对于车辆本身的种类描述可以模糊表达
			- 识别过程中需要描述是否是特殊人群
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      他车开门碰撞车辆
    </lark-td>
    <lark-td>
      - 周边车辆开车门有碰撞到自车的风险
			- 输入震动传感器的输入辅助判断
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="2">
      视频总结摘要
    </lark-td>
    <lark-td>
      基础哨兵视频整体总结
    </lark-td>
    <lark-td>
      整体视频概要总结
    </lark-td>
    <lark-td>
      - 哨兵录制单条视频里的整体总结
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      增强哨兵单次事件总结
    </lark-td>
    <lark-td>
      单次事件概括总结
    </lark-td>
    <lark-td>
      - 描述在一次处理的多帧图像中发生的危险事件
    </lark-td>
  </lark-tr>
</lark-table>

### 详细需求

#### 【碰撞场景】
<lark-table rows="6" cols="2" column-widths="365,505">

  <lark-tr>
    <lark-td>
      关键状态
    </lark-td>
    <lark-td>
      需求描述
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      场景定义
    </lark-td>
    <lark-td>
      - 对于两轮车、三轮车、四轮车等车辆的全车四周的碰撞与剐蹭事件进行识别
			- 对于车辆本身的种类描述可以模糊表达
			- ~~识别过程中需要描述是否是特殊人群~~
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      正常响应
    </lark-td>
    <lark-td>
      - 此场景在车辆四周都需要判断
			- 车辆仅靠近没有碰撞不需要提示，输入震动传感器的输入辅助判断
			- 根据模型图像输出【碰撞场景】标签，以及对事件的简要描述信息
			- 不需要准确描述剐蹭车辆的信息
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      场景示例
    </lark-td>
    <lark-td>
      <lark-table rows="1" cols="2" column-widths="365,365">
        <lark-tr>
          <lark-td>
            <image token="AmsebaExYohvJBxD1r3cYy4Yned" width="660" height="288"/>
          </lark-td>
          <lark-td>
            <image token="SvoRb28HNoD73nxpDFWcD6whnAb" width="642" height="400"/>
          </lark-td>
        </lark-tr>
      </lark-table>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      异常情况
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      KPI要求
    </lark-td>
    <lark-td>
      - 摘要描述中对事件判断的准确性要求
			- 白天明亮，200lux以上的环境
				- Pre 95%;
				- Recall 95%
			- 光线较暗，20~200lux的环境
				- Pre 90%;
				- Recall 88%
			- 夜晚微光，10~lux20lux的环境
				- Pre 85%;
				- Recall 80%
			- 场景识别速度 < 3s
    </lark-td>
  </lark-tr>
</lark-table>

#### 【他车开门碰撞车辆】
<lark-table rows="6" cols="2" column-widths="365,365">

  <lark-tr>
    <lark-td>
      关键状态
    </lark-td>
    <lark-td>
      需求描述
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      场景定义
    </lark-td>
    <lark-td>
      - 周边车辆开车门有碰撞到自车
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      正常响应
    </lark-td>
    <lark-td>
      - 此场景在车辆两侧都需要判断
			- 识别旁车前车门或后车门开门时有碰到自车的风险（不含后备箱开启碰撞风险）
			- 根据模型图像输出【开门碰撞事件】标签，以及对事件的简要描述信息
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      场景示例
    </lark-td>
    <lark-td>
      <image token="LAyibdb3DoyrAIxmIfCc2bJ3nhh" width="968" height="552"/>
      - 需要从车身视角
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      异常情况
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      KPI要求
    </lark-td>
    <lark-td>
      - 识别旁车开门碰撞
			- 白天明亮，200lux以上的环境
				- 精准率 > 95%;
				- 召回率 > 95%
			- 光线较暗，20~200lux的环境
				- 精准率 90%;
				- 召回率 88%
			- 夜晚微光，10~lux20lux的环境
				- Pre 85%;
				- Recall 80%
			- 性能要求
			- 识别速度 < 3s
    </lark-td>
  </lark-tr>
</lark-table>

#### 【出口被挡场景】

- “唯一出口”如何判断，待讨论

#### 【窥视事件】

- 待提供样张
- AVM视角无法看到玻璃窥探

#### 【充电枪操作事件】
<lark-table rows="6" cols="2" column-widths="365,365">

  <lark-tr>
    <lark-td>
      关键状态
    </lark-td>
    <lark-td>
      需求描述
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      场景定义
    </lark-td>
    <lark-td>
      - 有人伸手触碰充电枪，握住充电枪握柄或尝试拔出充电枪
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      正常响应
    </lark-td>
    <lark-td>
      - 此场景判断只针对充电口在车辆左右两侧的情况，不包含充电口在前引擎盖处车型
			- 在充电枪已插入成功状态下
			- 有人员用单手或双手接触充电枪
			- 不包含人其他部位碰到充电枪情况
			- 根据模型判断输出【疑似充电枪操作事件】标签，以及对事件的简要描述信息
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      场景示例
    </lark-td>
    <lark-td>
      - 单手/双手
			- 接触充电枪手柄/其他枪身部位
      <image token="Jc2FbSXUuoojHUxnBmgctaxJn6b" width="1864" height="458"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      异常情况
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      KPI要求
    </lark-td>
    <lark-td>
      - 白天明亮，200lux以上的环境
				- Pre 95%;
				- Recall 95%
			- 光线较暗，20~200lux的环境
				- Pre 90%;
				- Recall 88%
			- 夜晚微光，10~lux20lux的环境
				- Pre 85%;
				- Recall 80%
			- 场景识别速度 < 3s
    </lark-td>
  </lark-tr>
</lark-table>

#### 【打砸事件】

<lark-table rows="6" cols="2" column-widths="365,365">

  <lark-tr>
    <lark-td>
      关键状态
    </lark-td>
    <lark-td>
      需求描述
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      场景定义
    </lark-td>
    <lark-td>
      - 有人使用物品向车辆投掷
			- 有人使用手持物品对车辆故意撞击，需要输入震动传感器的输入辅助判断
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      正常响应
    </lark-td>
    <lark-td>
      - 此场景在车辆四周都需要判断
			- 根据模型图像输出【砸车事件】标签，以及对事件的简要描述信息
			- 不需要识别具体投掷的物品或人手持的物品是什么
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      场景示例
    </lark-td>
    <lark-td>
      <image token="VhtpbxMkPouwUUx9TuqcLWETn7c" width="1102" height="408"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      异常情况
    </lark-td>
    <lark-td>
      以下三部分需要通过振动传感器进行辅助区分
      - 有人使用手持物品对车辆故意撞击
			- 有人手持物品进行拍打车辆
			- 有人手持物品与车辆发生剐蹭
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      KPI要求
    </lark-td>
    <lark-td>
      - 摘要描述中对事件判断的准确性要求
			- 白天明亮，200lux以上的环境
				- Pre 95%;
				- Recall 95%
			- 光线较暗，20~200lux的环境
				- Pre 90%;
				- Recall 88%
			- 夜晚微光，10~lux20lux的环境
				- Pre 85%;
				- Recall 80%
			- 场景识别速度 < 3s
			- 手持物品与投掷物品的描述信息可模糊表述不用准确回答
    </lark-td>
  </lark-tr>
</lark-table>

#### 【划车事件】
<lark-table rows="6" cols="2" column-widths="365,365">

  <lark-tr>
    <lark-td>
      关键状态
    </lark-td>
    <lark-td>
      需求描述
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      场景定义
    </lark-td>
    <lark-td>
      - 人手持物品与车辆接触并移动
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      正常响应
    </lark-td>
    <lark-td>
      - 此场景仅判断 **车辆左右两侧车身的划车事件**
			- 根据模型判断输出【疑似划车事件】标签，以及对事件的简要描述信息
			- 重点关注手持树枝，尖锐物品，画笔，石子在车身划动场景
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      场景示例
    </lark-td>
    <lark-td>
      左右侧面划车判断支持范围：
      <image token="TngUbOUmDoh2qCxaSlNcH6DonKb" width="291" height="166"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      异常情况
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      KPI要求
    </lark-td>
    <lark-td>
      - 不要求对手持物品的描述完全准确，要求判断划车动作准确率
			- 白天明亮，200lux以上的环境
				- Pre 95%;
				- Recall 95%
			- 光线较暗，20~200lux的环境
				- Pre 90%;
				- Recall 88%
			- 夜晚微光，10~lux20lux的环境
				- Pre 85%;
				- Recall 80%
			- 场景识别速度 < 3s
    </lark-td>
  </lark-tr>
</lark-table>

#### 【踹车事件】
<lark-table rows="6" cols="2" column-widths="365,365">

  <lark-tr>
    <lark-td>
      关键状态
    </lark-td>
    <lark-td>
      需求描述
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      场景定义
    </lark-td>
    <lark-td>
      - 有人用 **脚**与车辆车身或轮胎发生碰撞
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      正常响应
    </lark-td>
    <lark-td>
      - 此场景仅判断 **车辆左右两侧车身的踹车事件**
			- 根据模型图像输出【疑似踹车事件】标签，以及对事件的简要描述信息
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      场景示例
    </lark-td>
    <lark-td>
      <image token="B4RxbBq7Mo2Q0yxwAgXcLsoJnnc" width="291" height="145"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      异常情况
    </lark-td>
    <lark-td>
      - 用户把脚放在轮胎处不动不属于踹车事件
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      KPI要求
    </lark-td>
    <lark-td>
      - 白天明亮，200lux以上的环境
				- Pre 95%;
				- Recall 95%
			- 光线较暗，20~200lux的环境
				- Pre 90%;
				- Recall 88%
			- 夜晚微光，10~lux20lux的环境
				- Pre 85%;
				- Recall 80%
			- 场景识别速度 < 3s
    </lark-td>
  </lark-tr>
</lark-table>

#### 【靠车事件】
<lark-table rows="6" cols="2" column-widths="365,365">

  <lark-tr>
    <lark-td>
      关键状态
    </lark-td>
    <lark-td>
      需求描述
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      场景定义
    </lark-td>
    <lark-td>
      - 人员除手部、脚部以外其他身体部位与车辆接触
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      正常响应
    </lark-td>
    <lark-td>
      - 此场景在车辆四周都需要判断
			- 根据模型图像输出【疑似依靠车辆事件】标签，以及对事件的简要描述信息
			- 如果人员仅用手部、脚部接触车辆不算做车辆倚靠事件
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      场景示例
    </lark-td>
    <lark-td>
      <image token="Wgagb3HRgoqZe1xR8E8ci7xHnWb" width="774" height="364"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      异常情况
    </lark-td>
    <lark-td>
      <image token="XHedbalcgoafoIxxiSWcueRtn9f" width="764" height="386"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      KPI要求
    </lark-td>
    <lark-td>
      - 白天明亮，200lux以上的环境
				- Pre 95%;
				- Recall 95%
			- 光线较暗，20~200lux的环境
				- Pre 90%;
				- Recall 88%
			- 夜晚微光，10~lux20lux的环境
				- Pre 85%;
				- Recall 80%
			- 场景识别速度 < 3s
    </lark-td>
  </lark-tr>
</lark-table>

#### 【交通执法场景】

- 车辆在非法停车位停放，识别到车外有交警正在贴罚单（附近车辆&本车车辆）
- 先确认整体大小模型串联流程，待讨论

### 关联Camera及输入分辨率

<lark-table rows="4" cols="8" column-widths="100,100,100,100,100,100,100,100">

  <lark-tr>
    <lark-td>
      任务类型
    </lark-td>
    <lark-td>
      处理Camera类型
    </lark-td>
    <lark-td>
      总相关Camera数量
    </lark-td>
    <lark-td>
      单次处理Camera
    </lark-td>
    <lark-td>
      建议帧间隔
    </lark-td>
    <lark-td>
      帧数
    </lark-td>
    <lark-td>
      图像分辨率
    </lark-td>
    <lark-td>
      备注
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="2">
      增强哨兵-非交警
    </lark-td>
    <lark-td>
      Option1：环视AVM摄像头
    </lark-td>
    <lark-td>
      4
    </lark-td>
    <lark-td>
      1
    </lark-td>
    <lark-td>
      250ms
    </lark-td>
    <lark-td>
      12
    </lark-td>
    <lark-td>
      448*448？TBD
    </lark-td>
    <lark-td>
      3s视频，4fps
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      Option2：环视&周视摄像头混合
    </lark-td>
    <lark-td>
      TBD
    </lark-td>
    <lark-td>
      1
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
  <lark-tr>
    <lark-td>
      增强哨兵-交警检测
      【待与SLS讨论】
    </lark-td>
    <lark-td>
      基于小模型处理后的Crop图像
    </lark-td>
    <lark-td>
      1
    </lark-td>
    <lark-td>
      1
    </lark-td>
    <lark-td>
      TBD
    </lark-td>
    <lark-td>
      TBD
    </lark-td>
    <lark-td>
      TBD
    </lark-td>
    <lark-td>
      任务目的：
      - 二次判断是否为交警
			- 识别交警当前的行为动作
    </lark-td>
  </lark-tr>
</lark-table>

### 任务评测指标

<lark-table rows="3" cols="3" column-widths="244,244,244">

  <lark-tr>
    <lark-td>
      场景任务
    </lark-td>
    <lark-td>
      准召要求
    </lark-td>
    <lark-td>
      性能要求
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      非交警相关
    </lark-td>
    <lark-td>
      - 白天明亮，200lux以上的环境
				- Pre 95%;
				- Recall 95%
			- 光线较暗，20~200lux的环境
				- Pre 90%;
				- Recall 88%
			- 夜晚微光，10~lux20lux的环境
				- Pre 85%;
				- Recall 80%
    </lark-td>
    <lark-td>
      单次单Camera处理<3s
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      交警相关
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      < 800ms
    </lark-td>
  </lark-tr>
</lark-table>

<lark-table rows="3" cols="3" column-widths="244,244,244">

  <lark-tr>
    <lark-td>
      **输入Camera图像样例**
      **（当前没有视频/多图，给单图参考）**
    </lark-td>
    <lark-td>
      **产品目标输出**
    </lark-td>
    <lark-td>
      **评价标准**
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <image token="P03kbu1kyoOCSZxJywCcaVvEnti" width="2550" height="1478"/>
    </lark-td>
    <lark-td>
      1. 事件标签
      -> 拔充电枪-普通人
      2. 事件概括
      ->有可疑人员在车辆充电口的位置操作充电枪
    </lark-td>
    <lark-td rowspan="2">
      1. 事件标签
      两个字段需要分别统计
      事件：0或1分
      人员类型：0或1分
      2. 事件概括
      包含事件类型以及发生的方向：1分
      仅包含事件类型方向错误：0.5分
      均为描述：0分
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <image token="FOt1bXEvMoK50MxnVpdc6qP3nTf" width="2538" height="1480"/>
    </lark-td>
    <lark-td>
      1. 事件标签
      -> 无危险事件-无/普通人
      2. 事件概括
      ->有人员的衣服在摄像头区域内，分辨不清具体行为动作
      【测试集中要包含混淆和非危险的事件】
    </lark-td>
  </lark-tr>
</lark-table>

## 舱外迎宾

### 业务流程

<image token="LBrCbcWN7oVb43x82mncdfYSncd" width="2564" height="460"/>

### 功能列表

<lark-table rows="4" cols="4" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td rowspan="4">
      迎宾空间
    </lark-td>
    <lark-td>
      舱外人员识别
    </lark-td>
    <lark-td>
      识别老人/行动不便者/怀抱婴儿
    </lark-td>
    <lark-td>
      10米内的行为识别，识别老人/行动不便者上车，开启辅助模式
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      舱外人员状态识别
    </lark-td>
    <lark-td>
      识别双手持物
    </lark-td>
    <lark-td>
      检测用户双手被占用时自动开门/开启后备箱
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      下车安全提醒
    </lark-td>
    <lark-td>
      识别舱外障碍
    </lark-td>
    <lark-td>
      有积水泥泞路面：明显水洼或水面反光
      有坑或不平整的路面：明显坑洞、塌陷或严重不平整
      有妨碍车门打开的障碍物：锥桶、广告牌、墙体等实体物体
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ~~离车关怀~~
    </lark-td>
    <lark-td>
      ~~识别遗留物品~~
    </lark-td>
    <lark-td>
      ~~区分手机、包、钥匙等高价值物~~
    </lark-td>
  </lark-tr>
</lark-table>

### 关联Camera及输入分辨率

<lark-table rows="3" cols="6" column-widths="122,122,122,122,122,122">

  <lark-tr>
    <lark-td>
      处理Camera类型
    </lark-td>
    <lark-td>
      总相关Camera数量
    </lark-td>
    <lark-td>
      单次处理Camera
    </lark-td>
    <lark-td>
      帧数
    </lark-td>
    <lark-td>
      图像分辨率
    </lark-td>
    <lark-td>
      备注
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      环视左侧、右侧
    </lark-td>
    <lark-td>
      2
    </lark-td>
    <lark-td>
      1
    </lark-td>
    <lark-td>
      1
    </lark-td>
    <lark-td>
      TBD
    </lark-td>
    <lark-td>
      图片中与下车相关的区域需要标注
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      智驾前视、左侧视、右侧视、后视
    </lark-td>
    <lark-td>
      4
    </lark-td>
    <lark-td>
      1
    </lark-td>
    <lark-td>
      1
    </lark-td>
    <lark-td>
      TBD
    </lark-td>
    <lark-td>
      图片中的熟人需要用矩形框标记
    </lark-td>
  </lark-tr>
</lark-table>

### 任务评测指标

<lark-table rows="2" cols="3" column-widths="244,244,244">

  <lark-tr>
    <lark-td>
      场景任务
    </lark-td>
    <lark-td>
      准召要求
    </lark-td>
    <lark-td>
      性能要求
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      迎宾&下车
    </lark-td>
    <lark-td>
      - 白天明亮，200lux以上的环境
				- Pre 95%;
				- Recall 95%
			- 光线较暗，20~200lux的环境
				- Pre 90%;
				- Recall 88%
			- 夜晚微光，10~lux20lux的环境（黑天是否能支持？）
				- Pre 85%;
				- Recall 80%
    </lark-td>
    <lark-td>
      单次单Camera处理<800ms
    </lark-td>
  </lark-tr>
</lark-table>

<lark-table rows="5" cols="3" column-widths="244,244,244">

  <lark-tr>
    <lark-td>
      **输入Camera图像样例**
    </lark-td>
    <lark-td>
      **产品目标输出**
    </lark-td>
    <lark-td>
      **评价标准**
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <image token="V6Zabbyeeo51B2xvCAJcs0HUn6c" width="900" height="730"/>
    </lark-td>
    <lark-td>
      标签输出：“有积水泥泞路面”
    </lark-td>
    <lark-td rowspan="2">
      标签输出：需要输出完全正确，只有0分和1分
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <image token="AsXsbBRbRomVjkxxoJ6cmqJOn1c" width="896" height="732"/>
    </lark-td>
    <lark-td>
      标签输出：“有积水泥泞路面”
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <image token="UwNBbP96LoHBYpxOO2ScQV3TnBd" width="1308" height="908"/>
    </lark-td>
    <lark-td>
      大件物品-否-否
    </lark-td>
    <lark-td rowspan="2">
      标签输出：
      三个字段分别评分，每个字段只有0分和1分
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <image token="B92kbQiiQoafxix8Bn8cdtdhnch" width="1450" height="882"/>
    </lark-td>
    <lark-td>
      大件物品-否-是
    </lark-td>
  </lark-tr>
</lark-table>

## 停车寻车  <text color="red">+ 缴费</text>

### 业务流程

<image token="NLTPbHmgUouwuRxiGv1cf0tgnKh" width="2566" height="2006"/>

### 功能列表

<lark-table rows="7" cols="3" column-widths="244,244,244">

  <lark-tr>
    <lark-td>
      **需求名称**
    </lark-td>
    <lark-td>
      **详细需求**
    </lark-td>
    <lark-td>
      **信息类型**
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="3">
      提供停车详细位置信息
    </lark-td>
    <lark-td>
      - 准确的地理位置
    </lark-td>
    <lark-td>
      GPS信息
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      - 准确的楼号、楼层、区域信息
    </lark-td>
    <lark-td>
      VLM返回标签
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      - 准确的车位号
    </lark-td>
    <lark-td>
      VLM返回标签
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      提取缴费二维码信息
    </lark-td>
    <lark-td>
      - 准确识别缴费二维码
			- 保存并在APP和车机中控大屏中投射缴费二维码
    </lark-td>
    <lark-td>
      图片
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="2">
      提供停车相对参照物
    </lark-td>
    <lark-td rowspan="2">
      - 可供找车的区域颜色、电梯口
			- 周边静态建筑
			- 最近的出入口或明显店铺
			- 显著的图案或立柱
    </lark-td>
    <lark-td rowspan="2">
      自然语言描述
    </lark-td>
  </lark-tr>
  <lark-tr>
  </lark-tr>
</lark-table>

### 关联Camera及输入分辨率

<lark-table rows="2" cols="6" column-widths="122,122,122,122,122,122">

  <lark-tr>
    <lark-td>
      关联摄像头
    </lark-td>
    <lark-td>
      视角范围
    </lark-td>
    <lark-td>
      摄像头像素
    </lark-td>
    <lark-td>
      原始图像分辨率
    </lark-td>
    <lark-td>
      输入模型图像分辨率
    </lark-td>
    <lark-td>
      任务所需帧率
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      智驾前视广角/DVR
    </lark-td>
    <lark-td>
      水平FOV >=120°
    </lark-td>
    <lark-td>
      800w
    </lark-td>
    <lark-td>
      3840x2160
    </lark-td>
    <lark-td>
      TBD
    </lark-td>
    <lark-td>
      静态信息：单帧
      动态信息：多帧
    </lark-td>
  </lark-tr>
</lark-table>

### 任务测评指标（待数据采集完成）

## 下车安全

### 业务流程

<image token="R8rub1OrvoaFYQxHJaGcyUaVn3g" width="2564" height="460"/>

### 功能列表

<lark-table rows="3" cols="4" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      迎宾空间
    </lark-td>
    <lark-td>
      下车安全提醒
    </lark-td>
    <lark-td rowspan="3">
      识别舱外障碍
    </lark-td>
    <lark-td>
      有积水泥泞路面：明显水洼或水面反光
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      有坑或不平整的路面：明显坑洞、塌陷或严重不平整
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      有妨碍车门打开的障碍物：锥桶、广告牌、墙体等实体物体
    </lark-td>
  </lark-tr>
</lark-table>

# 长时动态感知任务

## 长时任务

### 业务流程

<whiteboard token="LYyVwun1ghrm8sbVoxhcSfZLnUe"/>

### 功能列表

<lark-table rows="7" cols="3" column-widths="244,244,244">

  <lark-tr>
    <lark-td>
      **一级功能**
    </lark-td>
    <lark-td>
      **二级功能**
    </lark-td>
    <lark-td>
      **任务示例**
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="3">
      舱内视觉感知相关
    </lark-td>
    <lark-td>
      情感陪伴类任务
    </lark-td>
    <lark-td>
      帮我照看一下后排小朋友
      看着后排宝宝的毯子，如果没盖好告诉我一下 等下我女朋友上车，你要根据她的打扮，夸一夸她
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      舱内安全类任务
    </lark-td>
    <lark-td>
      如果驾驶员犯困了，就多陪他聊聊天
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      个性化提醒任务
    </lark-td>
    <lark-td>
      如果一会儿有女生上车，祝她女生节快乐 如果看到车里有人抽烟，就diss他一下
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="3">
      舱外视觉感知相关
    </lark-td>
    <lark-td>
      便捷辅助类任务
    </lark-td>
    <lark-td>
      帮我留意一个靠电梯间近的停车位 看看周围有没有万达影城的标识
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      行程陪伴类任务
    </lark-td>
    <lark-td>
      如果看到路边有小动物出现就拍张照片记录一下 一会儿路过看到天安门的时候放一首我爱你中国 我想兜兜风，路上要是路过有意思的地方，你给我介绍介绍
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      个性化提醒任务
    </lark-td>
    <lark-td>
      如果开始下雪了，提醒我下车的时候抬起来雨刷 路上有进隧道的话，把远关灯关一下
    </lark-td>
  </lark-tr>
</lark-table>

### 关联Camera及输入分辨率

<lark-table rows="3" cols="6" column-widths="122,122,122,122,122,122">

  <lark-tr>
    <lark-td>
      关联摄像头
    </lark-td>
    <lark-td>
      视角范围
    </lark-td>
    <lark-td>
      摄像头像素
    </lark-td>
    <lark-td>
      原始图像分辨率
    </lark-td>
    <lark-td>
      输入模型图像分辨率
    </lark-td>
    <lark-td>
      任务所需帧率
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      智驾前视广角/DVR
    </lark-td>
    <lark-td>
      水平FOV >=120°
    </lark-td>
    <lark-td>
      800w
    </lark-td>
    <lark-td>
      3840x2160
    </lark-td>
    <lark-td>
      TBD
    </lark-td>
    <lark-td>
      静态信息：单帧
      动态信息：多帧
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      OMS
    </lark-td>
    <lark-td>
      水平FOV >=180°
    </lark-td>
    <lark-td>
      500w
    </lark-td>
    <lark-td>
      2592*1944
    </lark-td>
    <lark-td>
      TBD
    </lark-td>
    <lark-td>
      静态信息：单帧
      动态信息：多帧
    </lark-td>
  </lark-tr>
</lark-table>

### 任务评测指标（TBD待与云端打合）

- 端侧模型指标（非端到端功能指标）
	- 用户体验指标
		- **时机合理性**：1–5 分，评估提醒 / 交互是否在合适时机触发（如进隧道关远光灯、下雪提醒抬雨刷）。
		- **内容匹配度**：1–5 分，评估系统输出内容与用户指令 / 场景的匹配程度（如介绍路过的景点）。
		- **满意度评分**：1–5 分，用户对任务完成效果的整体评价。
	- 技术指标
		- **事件识别准确率**：准确率=总测试次数正确识别次数×100%例：后排儿童识别、驾驶员疲劳识别、路边小动物识别等。
		- **首响应延迟**：从视觉触发条件满足到系统首次输出响应 / 动作的时间（ms）。
		- **任务处理能力：**每秒可处理的视觉帧或任务数，衡量并发与吞吐能力。
		- **召回率**：召回率=实际存在的目标数识别到的目标数×100%例：停车位识别、万达影城标识识别等。

# VQA舱内问答任务

## 舱内问答

### 业务流程

<image token="VWlxbitZlojMbjxVfvvcjp9nnCb" width="820" height="173"/>

### 功能列表

<lark-table rows="3" cols="5" column-widths="146,146,146,146,146">

  <lark-tr>
    <lark-td>
      场景
    </lark-td>
    <lark-td>
      句式主要构成
    </lark-td>
    <lark-td>
      示例Query
    </lark-td>
    <lark-td>
      提槽模型
    </lark-td>
    <lark-td>
      工程处理
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      人物相关问询
    </lark-td>
    <lark-td>
      【位置】+人状态/动作表情/性别/年龄/穿搭等
    </lark-td>
    <lark-td>
      你猜一下副驾的年龄是多少
      后排那个女生正在做什么
      评价一下我今天的打扮
    </lark-td>
    <lark-td>
      Camera=舱内
    </lark-td>
    <lark-td rowspan="2">
      均按时间戳获取用户提问时舱内OMS摄像头图像
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      物品相关问询
    </lark-td>
    <lark-td>
      车内+【物品】位置/状态
      > 为防止大量的误召，此类表达可以限定用户问的是“车内/车里”物品情况
    </lark-td>
    <lark-td>
      看看我的保温杯放在车哪里了
      我手机放在车后排了么
      看看我的包是不是放在后排座位了
    </lark-td>
    <lark-td>
      Camera=舱内
    </lark-td>
  </lark-tr>
</lark-table>

### 关联Camera及输入分辨率

<lark-table rows="2" cols="6" column-widths="122,122,122,122,122,122">

  <lark-tr>
    <lark-td>
      关联摄像头
    </lark-td>
    <lark-td>
      视角范围
    </lark-td>
    <lark-td>
      摄像头像素
    </lark-td>
    <lark-td>
      原始图像分辨率
    </lark-td>
    <lark-td>
      输入模型图像分辨率
    </lark-td>
    <lark-td>
      任务所需帧率
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      OMS
    </lark-td>
    <lark-td>
      水平FOV >=180°
    </lark-td>
    <lark-td>
      500w
    </lark-td>
    <lark-td>
      2592*1944
    </lark-td>
    <lark-td>
      TBD
    </lark-td>
    <lark-td>
      单帧
    </lark-td>
  </lark-tr>
</lark-table>

### 任务评测指标

<lark-table rows="6" cols="6" column-widths="122,122,122,122,122,122">

  <lark-tr>
    <lark-td>
      指标类型
    </lark-td>
    <lark-td>
      指标名称
    </lark-td>
    <lark-td>
      指标定义
    </lark-td>
    <lark-td>
      目标
    </lark-td>
    <lark-td>
      计算方法
    </lark-td>
    <lark-td>
      示例
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      主观指标
    </lark-td>
    <lark-td>
      端到端满足度
    </lark-td>
    <lark-td>
      指用户通过语音 **交互发起**的需求从发出指令到最终 **得到满足**的全过程中，用户对结果的整体满意程度，是衡量语音交互系统整体服务质量的综合性指标。
    </lark-td>
    <lark-td>
      90分
    </lark-td>
    <lark-td>
      满足（1分）：planner分发正确+提槽模型准确+介绍信息准确合理
      不满足（0分）：planner分发错误/提槽模型错误/介绍信息不准确合理
      > 因拍摄不清楚导致回答不知道，可获得0.5分
      公式=满足得分/测试集数量
      > 测试集按照场景优先级准备（比例暂定）
      > 前车识别：LBS识别：通用识别：舱内识别=4:4:1:1
    </lark-td>
    <lark-td>
      **副驾坐着的人睡着了吗（睡着了）**
      1分：副驾坐着的人睡着了呢，让我们小声点……
      0分：副驾坐着的人看起来没睡可精神了……
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="4">
      客观指标
    </lark-td>
    <lark-td>
      planner准确率
    </lark-td>
    <lark-td>
      指用户发起以上视觉查询指令，planner正确判别属于VQA-Agent处理范围
    </lark-td>
    <lark-td>
      95%
    </lark-td>
    <lark-td>
      准确：planner分发准确
      不准确：planner分发错误
      > 如果context有足够信息，planner自行回答，也属于准确
    </lark-td>
    <lark-td>
      NA
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      提槽模型准确率
    </lark-td>
    <lark-td>
      指用户发起以上视觉查询指令，模型提槽正确判别属于哪类场景，并正确提出摄像头方位选择和识别对象
    </lark-td>
    <lark-td>
      95%
    </lark-td>
    <lark-td>
      准确：提槽模型结果准确
      不准确：提槽模型结果错误
    </lark-td>
    <lark-td>
      NA
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      舱内识别准确率
    </lark-td>
    <lark-td>
      指用户发起“后排小孩睡着了吗”等舱内人物或物品信息和状态查询时，系统识别出的信息与实际信息的一致程度，是衡量舱内识别功能精准性的核心指标。
    </lark-td>
    <lark-td>
      85%
    </lark-td>
    <lark-td>
      准确：人物/物品识别和描述准确
      不准确：人物/物品识别或描述错误
    </lark-td>
    <lark-td>
      **副驾坐着的人睡着了吗（睡着了）**
      准确：副驾坐着的人睡着了呢，让我们小声点……
      不准确：副驾坐着的人看起来没睡可精神了……
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      舱内识别响应速度指标
    </lark-td>
    <lark-td>
      从用户完成语音指令输入（如停止说话）到系统返回首字结果的耗时。
    </lark-td>
    <lark-td>
      3s内
    </lark-td>
    <lark-td>
      根据端到端响应速度做耗时拆解
      端到端响应速度=planner耗时+Agent耗时（含端模处理时长）+工程链路速度
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

# 智驾相关VLM任务

- 待补充

# 屏幕识别VLM任务

- 待补充
