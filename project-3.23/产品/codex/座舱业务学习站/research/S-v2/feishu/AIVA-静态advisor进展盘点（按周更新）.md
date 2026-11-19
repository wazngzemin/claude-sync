# AIVA-静态advisor进展盘点（按周更新）（飞书原文转存；更新时间 2026-11-17）

来源链接：https://pq3b44yw2t9.feishu.cn/docx/L3e6d2Cv1oW3F3xnz7nc3cxZneh

<callout emoji="gift_heart" background-color="light-purple" border-color="light-purple">

<mention-doc token="LTFWw9g1ViQo1OkP9Azc6W7vnah" type="wiki">【SLS 主动服务专项】11月攻坚目标</mention-doc>
</callout>

# 前提摘要： {folded="true"}

1. 需要大家关注的核心文档：
	1. 静态advisor核心的产品PRD：<mention-doc token="QU0PwxnaQiT9ZhkH2bwcwiuBnQg" type="wiki">【仅对内】静态 Advisor  PRD（ for AIVA）v0.6</mention-doc>
	1. 各种场景/依赖/进展/问题的汇总整理（本多维表格）：<mention-doc token="FsQWbFf1aa0SJus7m6gcKQhynuh" type="bitable">【AIVA】静态advisor（for 字节&弋途）</mention-doc>
	1. 交互文档：
	1. bug流转的多维表格：<mention-doc token="L6vfwYec2ir02BkC8ficWoNqngf" type="wiki">【SLS】【弋途-Bug跟踪表】</mention-doc>
1. 静态advisor其实就是主动服务，只是在赛力斯（AIVA）项目上并不是所有的主动服务都通过静态advisor的能力实现，有一部分通过<mention-user id="ou_d35304ddd7e37a06ebac58f7f60b6522"/>负责的系统预设条件任务实现。

<callout emoji="gift_heart" background-color="light-purple" border-color="light-purple">

在赛力斯项目上：

主动服务=静态advisor+系统预设条件任务
</callout>

1. 【合作共建！！！】完整静态advisor端到端的体验需要：弋途+字节+赛力斯，三方的紧密配合，其中：

  <lark-table rows="4" cols="2" column-widths="66,723">

    <lark-tr>
      <lark-td>
        负责人
      </lark-td>
      <lark-td>
        负责内容
      </lark-td>
    </lark-tr>
    <lark-tr>
      <lark-td>
        弋途
      </lark-td>
      <lark-td>
        1. 动态事件模块：根据事件日志、端状态等信息，通过推理生成需要进行主动服务的动态事件，触发舒适/出行/情感/内容adv进行推理。
				1. 舒适/出行/情感/内容adv：核心的Agent推理模块，输出给DT的advice
				1. 舒适AI bar/出行AI bar/内容AI bar-Agent：负责AI bar上展示内容的数据生产
      </lark-td>
    </lark-tr>
    <lark-tr>
      <lark-td>
        字节
      </lark-td>
      <lark-td>
        1. 触发器（云）模块：根据产品定义的事件逻辑，通过云端的触发器配置满足一定条件的预设事件，触发舒适/出行/情感/内容adv进行推理。
				1. context模块：模型推理所需的上下文，包含端状态、记忆（用户画像）、视觉描述、世界信息等等。
				1. DT模块：舒适/出行/情感/内容adv的重要下游，承接advice并输出最终和用户交互的内容/执行项
				1. AI bar的数据透传：将弋途侧产生的AI bar的数据传给赛力斯端侧
				1. 豆包即时交互卡：根据DT的output进行豆包即时交互卡的展示。
      </lark-td>
    </lark-tr>
    <lark-tr>
      <lark-td>
        赛力斯
      </lark-td>
      <lark-td>
        1. AI bar的交互实现：根据字节透传过去的数据，进行最终交互的实现
      </lark-td>
    </lark-tr>
  </lark-table>

1. 测试分工，之前弋途和字节双方的测试沟通，达成的一致分工结论为：
	1. 弋途侧负责：单模块的接口测试，保障弋途负责的几个模块的推理效果；
	1. 字节侧负责：端到端测试，保障从触发-推理-界面展示完整的测试；
1. 项目整体节奏
	1. 【915】全功能开发完成，全面进行测试
  <callout emoji="gift_heart" background-color="light-purple" border-color="light-purple">
  产品的目标：915之前，
  - 弋途侧至少进行一轮的接口测试-bug优化
	- 端到端链路上，字节测试推进端到端的测试，确保915前，链路层面均无问题。
  </callout>

  1. 【929】
	1. 【1020】

# 周会参会人员名单 {folded="true"}

<lark-table rows="3" cols="5" column-widths="100,156,156,215,141">

  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      项目
    </lark-td>
    <lark-td>
      产品
    </lark-td>
    <lark-td>
      研发
    </lark-td>
    <lark-td>
      测试
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      必须参会人
    </lark-td>
    <lark-td>
      弋途侧：<mention-user id="ou_3f23f014472a0a2a62e3ea4b314754a1"/>
      字节侧：<mention-user id="ou_735384320370d4aae3cbff794f953cbc"/>
    </lark-td>
    <lark-td>
      弋途侧：<mention-user id="ou_50222d018d90a9d2451f69f7426dd0c7"/>
      字节侧：<mention-user id="ou_5db39c36f6959ac9bb6e0128d774e9a9"/>
    </lark-td>
    <lark-td>
      弋途侧：<mention-user id="ou_2e1004f4a410346d7dce7bfd641804e6"/><mention-user id="ou_9eceba0a63e11bfb87f1038bae25626a"/>
      字节侧：<mention-user id="ou_a720ed79ce47022439b0c3d1bdc75146"/>
    </lark-td>
    <lark-td>
      弋途侧：<mention-user id="ou_fd56e68ee69800bcce6973255c560b32"/>
      字节侧：<mention-user id="ou_7106411f5b10518ccc6c4fdbef845d2c"/><mention-user id="ou_da74219ed70295531a8d932622712008"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      可选参会人
    </lark-td>
    <lark-td>
      弋途侧：/
      字节侧：<mention-user id="ou_3213b0a6b4a284c12111ab5604bd2e69"/>
    </lark-td>
    <lark-td>
      字节侧：
      弋途侧：<mention-user id="ou_662890a44db49ea22b4dfb23cf965e10"/><mention-user id="ou_98c775a39b48c6baa6cd8df17828b415"/>
    </lark-td>
    <lark-td>
      字节侧：
      弋途侧：
    </lark-td>
    <lark-td>
      字节侧：
      弋途侧：
    </lark-td>
  </lark-tr>
</lark-table>

# 重要依赖梳理 {folded="true"}

完整功能的实现，依赖多个模块能力的支持，整体梳理的情况如下

<lark-table rows="12" cols="6" header-row="true" column-widths="73,83,100,206,60,476">

  <lark-tr>
    <lark-td>
      层级
    </lark-td>
    <lark-td>
      模块
    </lark-td>
    <lark-td>
      更新时间
    </lark-td>
    <lark-td>
      依赖内容
    </lark-td>
    <lark-td>
      状态
    </lark-td>
    <lark-td>
      当前情况
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      触发层
    </lark-td>
    <lark-td>
      触发器
    </lark-td>
    <lark-td>
      2026/08/26
    </lark-td>
    <lark-td>
      预设事件的实现，详见本多维表格的sheet：事件库
    </lark-td>
    <lark-td>
      <text bgcolor="light-yellow">黄灯</text>
    </lark-td>
    <lark-td>
      <mention-user id="ou_50222d018d90a9d2451f69f7426dd0c7"/><mention-user id="ou_d35304ddd7e37a06ebac58f7f60b6522"/>已针对全部要实现的场景进行了沟通，目前共计21个预设事件，其中：
      - <text color="red">9个事件需要</text><text color="red"><mention-user id="ou_d35304ddd7e37a06ebac58f7f60b6522"/></text><text color="red">评估能否支持（8月28日前反馈）</text>
			- 10个评估可以支持
				- 仅主驾/副驾上车事件实车已通，<text color="red">剩下的8个需要测试进行验证</text>
			- 2个事件触发器评估无法支持，需要和赛力斯澄清相关场景无法支持（等全部事件评估完一起澄清）。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      context
    </lark-td>
    <lark-td>
      事件日志
    </lark-td>
    <lark-td>
      2026/08/27
    </lark-td>
    <lark-td>
      作为动态事件模块的重要输入，应包含人人对话、人机对话、用户操作事件三大部分
    </lark-td>
    <lark-td>
      <text bgcolor="light-yellow">黄灯</text>
    </lark-td>
    <lark-td>
      【产品】人机对话、用户操作事件的格式已有，缺人人对话的，<text color="red">需要字节侧给出预期支持的时间。</text>
      【研发】双方研发对接中，26日字节侧刚提供http接口查询context事件日志的示例
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      端状态
    </lark-td>
    <lark-td>
      2026/08/27
      2026/09/09
    </lark-td>
    <lark-td>
      动态事件模块以及舒适/出行/情感/内容推理上下文必不可少的一部分
    </lark-td>
    <lark-td>
      <text bgcolor="light-yellow">黄灯</text>
    </lark-td>
    <lark-td>
      ~~【产品】已经有1期（0804）需支持的端状态清单，~~~~缺2期的端状态清单。~~~~其中有一些强诉求的端状态已和~~~~<mention-user id="ou_ebbc1adb62e07a4b75ac6a1c7818b3f0"/>~~~~传递，详见本多维表格的sheet：需要但是还没接入的端状态~~
      【产品】端状态的接入格式、方式有新的方案，目前AIVA-静态advisor还强需的端状态提报在<mention-doc token="JmKrbKlSNaYtyosFsnCcJcfdnDb" type="bitable">【仅对内】火山引擎_原子能力清单</mention-doc>，需要端状态继续接入
      【研发】1期的端状态清单已完成能力打通
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      用户画像
    </lark-td>
    <lark-td>
      2026/08/27
    </lark-td>
    <lark-td>
      使用记忆提槽后的记忆内容
    </lark-td>
    <lark-td>
      <text bgcolor="light-yellow">黄灯</text>
    </lark-td>
    <lark-td>
      【研发】当前仅支持能拿到一位人员的用户画像，需要能支持拿到车内所有人（有face_id）的用户画像,此需求之前和<mention-user id="ou_86010a55eb07891b35f657d63ab30198"/><mention-user id="ou_c0f9a2b79ab75dd680e31c0a0eed7f2b"/>已对齐。
      <text color="red">多个用户的方案，研发侧已完成开发，需要测试验证</text><text color="red"><mention-user id="ou_da74219ed70295531a8d932622712008"/></text>
      【测试】<text color="red">face_id的能力接入后，上车后是否能正常的拿到，并进行画像内容的消费，需要测试实车验证</text><text color="red"><mention-user id="ou_7106411f5b10518ccc6c4fdbef845d2c"/></text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      世界信息
    </lark-td>
    <lark-td>
      2026/08/27
    </lark-td>
    <lark-td>
      获取车辆当前位置的时间和网络天气
    </lark-td>
    <lark-td>
      <text bgcolor="green">绿色</text>
    </lark-td>
    <lark-td>
      /（已正常接入）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      视觉描述
    </lark-td>
    <lark-td>
      2026/08/27
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      <text bgcolor="red">红色</text>
    </lark-td>
    <lark-td>
      目前已经有初步的范围<mention-doc token="MN4JwSA64iCPQ8kn4YHcJ7bQnbc" type="wiki">【端状态】端侧模型格式梳理</mention-doc>，目前实车还没拿到，只是链路通了
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      tools
    </lark-td>
    <lark-td>
      AI-navi
    </lark-td>
    <lark-td>
      2026/08/27
    </lark-td>
    <lark-td>
      提供地图导航的搜索能力，如沿途搜、类型（充电站/停车场）搜
    </lark-td>
    <lark-td>
      <text bgcolor="green">绿色</text>
    </lark-td>
    <lark-td>
      【研发-弋途】已接入
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      高德目的地预测
    </lark-td>
    <lark-td>
      2026/08/27
    </lark-td>
    <lark-td>
      提供高德对于用户出行目的地的预测
    </lark-td>
    <lark-td>
      <text bgcolor="light-yellow">黄灯</text>
    </lark-td>
    <lark-td>
      1. 需要系统地图适配后该接口才能使用，<text color="red">依赖赛力斯提供接口</text><text color="red"><mention-user id="ou_3f23f014472a0a2a62e3ea4b314754a1"/></text>
			1. 需要端状态【自动切换驾驶员账号开关】接入后，出行advisor才可以正式接入——<text color="red">目前赛力斯反馈他们10月份才支持</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      内容编排
    </lark-td>
    <lark-td>
      2026/08/27
    </lark-td>
    <lark-td>
      提供音频内容的编排能力
    </lark-td>
    <lark-td>
      <text bgcolor="light-yellow">黄灯</text>
    </lark-td>
    <lark-td>
      【研发-弋途】<text color="red">内容advisor的能力已经接入，但内容编排tool本身能力还没建设完成，暂不支持测试。</text><text color="red"><mention-user id="ou_3f23f014472a0a2a62e3ea4b314754a1"/></text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      行程管家
    </lark-td>
    <lark-td>
      2026/08/27
    </lark-td>
    <lark-td>
      提供用户
    </lark-td>
    <lark-td>
      <text bgcolor="green">绿色</text>
    </lark-td>
    <lark-td>
      【研发-弋途】已接入
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      充电站状态查询
    </lark-td>
    <lark-td>
      2026/08/27
    </lark-td>
    <lark-td>
      提供针对某个明确充电站的站点情况的查询能力（营业时间、空桩情况）
    </lark-td>
    <lark-td>
      <text bgcolor="light-yellow">黄灯</text>
    </lark-td>
    <lark-td>
      ~~需要赛力斯侧提供这样的云端接口，已和赛力斯侧的~~~~<mention-user id="ou_72f6aeb92ae471172cc8fe2986370aa6"/>~~~~沟通提需，现等待反馈~~
      <text color="red">使用navi的能力（开发中），依赖赛力斯提供接口</text><text color="red"><mention-user id="ou_3f23f014472a0a2a62e3ea4b314754a1"/></text>
    </lark-td>
  </lark-tr>
</lark-table>

# 核心开发模块进展 {folded="true"}

<lark-table rows="14" cols="7" header-row="true" column-widths="73,117,76,88,100,61,483">

  <lark-tr>
    <lark-td>
      层级
    </lark-td>
    <lark-td>
      核心模块
    </lark-td>
    <lark-td>
      原定排期
    </lark-td>
    <lark-td>
      实现方
    </lark-td>
    <lark-td>
      更新时间
    </lark-td>
    <lark-td>
      状态
    </lark-td>
    <lark-td>
      当前情况
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      触发层
    </lark-td>
    <lark-td>
      触发器
    </lark-td>
    <lark-td>
      0804
    </lark-td>
    <lark-td>
      字节
    </lark-td>
    <lark-td>
      2026/08/27
    </lark-td>
    <lark-td>
      <text bgcolor="light-yellow">黄灯</text>
    </lark-td>
    <lark-td>
      - 上车事件实车已通
			- <text color="red">明确可行的需要有人牵头实车验证</text><text color="red"><mention-user id="ou_735384320370d4aae3cbff794f953cbc"/></text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      动态事件模块
    </lark-td>
    <lark-td>
      0915
    </lark-td>
    <lark-td>
      弋途
    </lark-td>
    <lark-td>
      2026/08/27
    </lark-td>
    <lark-td>
      <text bgcolor="light-yellow">黄灯</text>
    </lark-td>
    <lark-td>
      - 已开发完成
			- 完整的测试依赖事件日志模块的功能完善
			- <text color="red">单模块接口测试用例已有，本周出一版结果</text><text color="red"><mention-user id="ou_fd56e68ee69800bcce6973255c560b32"/></text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      子目标定时review触发
    </lark-td>
    <lark-td>
      0804
      0915
    </lark-td>
    <lark-td>
      弋途
    </lark-td>
    <lark-td>
      2026/08/27
    </lark-td>
    <lark-td>
      <text bgcolor="light-yellow">黄灯</text>
    </lark-td>
    <lark-td>
      - 能力已实现
			- 产生的子目标需要接入到任务中心（给用户展示，支持用户删除）<text color="red">——这个需要评估如何接入（目标915）</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      推理层
    </lark-td>
    <lark-td>
      舒适advisor
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      弋途
    </lark-td>
    <lark-td>
      2026/08/27
    </lark-td>
    <lark-td>
      <text bgcolor="light-yellow">黄灯</text>
    </lark-td>
    <lark-td>
      - 针对当前的FL弋途侧的开发均已完成
			- 测试进行中，基于测试的结果，逐步进行体验优化（prompt优化）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      出行advisor
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      弋途
    </lark-td>
    <lark-td>
      2026/08/27
    </lark-td>
    <lark-td>
      <text bgcolor="light-yellow">黄灯</text>
    </lark-td>
    <lark-td>
      - 除依赖的部分外，当前能开发的都开发了
			- 测试进行中，基于测试的结果，逐步进行体验优化（prompt优化）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      情感advisor
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      弋途
    </lark-td>
    <lark-td>
      2026/08/27
    </lark-td>
    <lark-td>
      <text bgcolor="light-yellow">黄灯</text>
    </lark-td>
    <lark-td>
      - 针对当前的FL弋途侧的开发均已完成
			- 测试进行中，基于测试的结果，逐步进行体验优化（prompt优化）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      内容advisor
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      弋途
    </lark-td>
    <lark-td>
      2026/08/27
    </lark-td>
    <lark-td>
      <text bgcolor="light-yellow">黄灯</text>
    </lark-td>
    <lark-td>
      - 除依赖的部分外，当前能开发的都开发了
			- 测试尚未启动
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      Director
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      字节
    </lark-td>
    <lark-td>
      2026/08/27
    </lark-td>
    <lark-td>
      /
    </lark-td>
    <lark-td>
      /
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      交互层
    </lark-td>
    <lark-td>
      舒适AI bar
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      弋途+字节
    </lark-td>
    <lark-td>
      2026/08/27
    </lark-td>
    <lark-td>
      <text bgcolor="light-yellow">黄灯</text>
    </lark-td>
    <lark-td>
      - 舒适AI bar-Agent弋途侧已开发完成
			- 仅展示实车链路已通，赛力侧侧交互实现问题已反馈，等待后续的回复（问题详见：体验问题汇总）
			- <text color="red">按钮态，用户点击后给到DT，需要开发，初步评估客户端投入——字节开发已完成，目前实车状态不通，需要和赛力斯联调。</text><text color="red"><mention-user id="ou_7106411f5b10518ccc6c4fdbef845d2c"/></text><text color="red">bug拉字节和赛力斯分析</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      出行AI bar
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      弋途+字节
    </lark-td>
    <lark-td>
      2026/08/27
    </lark-td>
    <lark-td>
      <text bgcolor="light-yellow">黄灯</text>
    </lark-td>
    <lark-td>
      - 出行AI bar-Agent弋途侧已开发完成
			- 目前数据层弋途能到字节云，<text color="red">但是实车上看不到，需要字节研发跟进进一步排查——目前赛力斯回复问题已解，需要测试</text><text color="red"><mention-user id="ou_da74219ed70295531a8d932622712008"/></text><text color="red">验证</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      内容AI bar
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      弋途+字节
    </lark-td>
    <lark-td>
      2026/08/27
    </lark-td>
    <lark-td>
      <text bgcolor="light-yellow">黄灯</text>
    </lark-td>
    <lark-td>
      - 内容AI bar-Agent弋途侧已开发完成
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      豆包即时交互卡
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      字节
    </lark-td>
    <lark-td>
      2026/08/27
    </lark-td>
    <lark-td>
      <text bgcolor="light-yellow">黄灯</text>
    </lark-td>
    <lark-td>
      - 待进行UI评审
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      skill-自进化
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      弋途
    </lark-td>
    <lark-td>
      2026/08/27
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      有初步的产品方案，待实验，预计下周开始启动实验
    </lark-td>
  </lark-tr>
</lark-table>

# 产品需求池 {folded="true"}

<callout emoji="gift_heart" background-color="light-purple" border-color="light-purple">

持续收集产品侧的优化项和后续需求

SOP：持续收集-产品评估价值、紧急度、排期-产品PRD-需求内审/外审-正式开发

Tips：不是收集了登记了就会做，确认有价值再做，但是不做也需要有评估结论以及双方产品达成一致的结论
</callout>

<!-- Unsupported block type: 53 -->

# 会议记录

### 20260828（fix） {folded="true"}

会议议题：

- 整体对齐了当前静态advisor的整体分工、进展、状态、依赖。并定于每周三上午11-12点为固定的静态advisor的周例会（必须参会人必参加，其余人员按需参会）

会议待办：

1. 针对0915的目标，需要<mention-user id="ou_3f23f014472a0a2a62e3ea4b314754a1"/> <mention-user id="ou_735384320370d4aae3cbff794f953cbc"/> 推进每周的研发/测试目标的计划
1. 涉及视觉的预设事件，需要产品小范围先对齐推进<mention-user id="ou_5db39c36f6959ac9bb6e0128d774e9a9"/> <mention-user id="ou_50222d018d90a9d2451f69f7426dd0c7"/> 
1. 对于context的依赖，需要<mention-user id="ou_5db39c36f6959ac9bb6e0128d774e9a9"/> 牵头对字节内部各模块拉齐推进
1. 针对可支持的预设事件，需要测试进行实车验证，本周给出测试结论<mention-user id="ou_735384320370d4aae3cbff794f953cbc"/> <mention-user id="ou_7106411f5b10518ccc6c4fdbef845d2c"/> 
1. 按钮态，用户点击后给到DT，需要开发，初步评估客户端投入<mention-user id="ou_735384320370d4aae3cbff794f953cbc"/>
1. 目前出行adv数据层弋途能到字节云，字节云能给客户端，但是实车上看不到，需要字节客户端研发跟进进一步排查<mention-user id="ou_735384320370d4aae3cbff794f953cbc"/> 
1. 尽快对齐测试的范围、测试集。端到端测试的测试集由<mention-user id="ou_7106411f5b10518ccc6c4fdbef845d2c"/> 牵头，单模块接口测试由<mention-user id="ou_fd56e68ee69800bcce6973255c560b32"/> 牵头，产品<mention-user id="ou_5db39c36f6959ac9bb6e0128d774e9a9"/> <mention-user id="ou_50222d018d90a9d2451f69f7426dd0c7"/> 配合

### 20260902（fix） {folded="true"}

- [x] 端到端测试示例case的review，（19:30-20:30集中过）
	- [x] 舒适
	- [x] 出行
	- [x] 情感

<callout emoji="gift_heart" background-color="light-purple" border-color="light-purple">

测试流程：

1. 接口测试的进展：1期（P0已完成）、2期进行中
1. 端到端的测试范围：1期进行中
</callout>

<task task-id="e4ffb81a-17ee-498f-b649-690b85d88686"/>

验证目标：需要的预设事件（详见sheet：事件库）是否能触发对应advisor（马绿坡）

<task task-id="b77ec692-5f5f-44d5-a558-96734703005e"/>

当前以多维表格跟进，后续再考虑账号统一

<task task-id="c74bc94b-9535-4543-b5e8-b49c7e7bd67e"/>

### 20260909（fix） {folded="true"}

<callout emoji="gift_heart" background-color="light-purple" border-color="light-purple">

当前端到端的测试通过率：

- 舒适：22.7%
- 出行：28.1%
- 情感：12.7%
</callout>

<task task-id="0038263c-23d1-4af1-b44e-34cbaa0fe2fe"/>

<task task-id="a3699244-4fb1-4f0f-b7d8-69617aa17b6a"/>

<task task-id="71d39da9-2130-48fe-bab5-30cdffc84815"/>

<task task-id="60db91e8-e32a-4b54-b16b-c7a77e27a654"/>

<callout emoji="gift_heart" background-color="light-purple" border-color="light-purple">

0916:当前已经在开发中
</callout>

<task task-id="08150ee1-b18d-4b42-903d-d0800dae6e4f"/>

- [x] 【动态事件模块】单模块接口测试用例已有，本周出一版结果<text color="red"><mention-user id="ou_fd56e68ee69800bcce6973255c560b32"/></text>
- [x] 舒适AI bar<text color="red">按钮态，用户点击后给到DT，需要开发，初步评估客户端投入——字节开发已完成，目前实车状态不通，需要和赛力斯联调。</text><text color="red"><mention-user id="ou_7106411f5b10518ccc6c4fdbef845d2c"/></text><text color="red">bug拉字节和赛力斯分析</text>
- https://meego.larkoffice.com/telematics/issue/detail/7374631072?parentUrl=%2Ftelematics%2Fissue%2Fhomepage&openScene=1
- [x] 出行AI bar目前数据层弋途能到字节云，<text color="red">但是实车上看不到，需要字节研发跟进进一步排查——目前赛力斯回复问题已解，需要测试</text><text color="red"><mention-user id="ou_da74219ed70295531a8d932622712008"/></text><text color="red">验证</text>

### 20260916（fix） {folded="true"}

<callout emoji="gift_heart" background-color="light-purple" border-color="light-purple">

信息同步：

1. 【基于收藏点推荐“去兜风”】——删除该场景（原因：经产品内审认为该场景不合理）
1. 【AI导演功能推荐】接到消息delay到sop之后
</callout>

静态advisor-<text underline="true">**接口测试结果**</text><mention-user id="ou_fd56e68ee69800bcce6973255c560b32"/>

<lark-table rows="3" cols="6" column-widths="119,127,127,127,139,139">

  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      动态事件模块
    </lark-td>
    <lark-td>
      舒适adv
    </lark-td>
    <lark-td>
      出行adv
    </lark-td>
    <lark-td>
      情感adv
    </lark-td>
    <lark-td>
      内容adv
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      通过率
    </lark-td>
    <lark-td>
      60.42%
    </lark-td>
    <lark-td>
      整体通过率：20.97%
      座舱空气与通风调节、防雾与除雾调节——阻塞；
      驾驶清醒舒适辅助： 100%
    </lark-td>
    <lark-td>
      64.71%
    </lark-td>
    <lark-td>
      68.09%
    </lark-td>
    <lark-td>
      整体通过率：15%
      内容预编排、场景化内容触发、节目单动态调整——阻塞；
      驾驶清醒内容辅助：92.31%
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      重点问题/block
    </lark-td>
    <lark-td>
      1. block（需要的依赖）：
			- 人人对话暂不支持mock；
			1. 重点问题：
			- 预设事件没有作为input；
      ——已解决
    </lark-td>
    <lark-td>
      1. block（需要的依赖）：
			- 车外co2、pm2.5浓度；
			- 玻璃温度；
			- 露点温度；
      ——已解决
    </lark-td>
    <lark-td>
      1. block（需要的依赖）：
			- 平均能耗；
			1. 重点问题：
			- 针对某些应该给出建议的case，AI导游未给出建议；
    </lark-td>
    <lark-td>
      1. block（需要的依赖）：
			- 乘员上次上车时间；
			1. 重点问题：
			- 跨年时刻事件需要通过动态事件模块输出；
			- advice需要结合乘员动作（睡觉、打电话）；
      ——<mention-user id="ou_da74219ed70295531a8d932622712008"/>看一下实车支持情况
    </lark-td>
    <lark-td>
      1. block（需要的依赖）：
			- 内容编排tool；
      ——已解决
      - 节目单剩余时长；
			- ——持续关注
    </lark-td>
  </lark-tr>
</lark-table>

静态advisor-<text underline="true">**端到端测试结果**</text><mention-user id="ou_da74219ed70295531a8d932622712008"/>

<lark-table rows="3" cols="5" column-widths="119,127,127,143,127">

  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      舒适adv
    </lark-td>
    <lark-td>
      出行adv
    </lark-td>
    <lark-td>
      情感adv
    </lark-td>
    <lark-td>
      内容adv
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      通过率
    </lark-td>
    <lark-td>
      22.7%
    </lark-td>
    <lark-td>
      36.5%
    </lark-td>
    <lark-td>
      34.55%
    </lark-td>
    <lark-td>
      未提测
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      重点问题/block
    </lark-td>
    <lark-td>
      - 触发了主动服务但实际车控没生效
			- 触发了主动服务且实际车控生效了但TTS播报没生效
    </lark-td>
    <lark-td>
      - 多目标出行预测阻塞<mention-user id="ou_da74219ed70295531a8d932622712008"/><mention-user id="ou_2e1004f4a410346d7dce7bfd641804e6"/>
      ——依赖记忆模块跟进
    </lark-td>
    <lark-td>
      - 模拟器中的世界信息模拟了不能被使用
             <mention-user id="ou_da74219ed70295531a8d932622712008"/>对测试产生重大block影响，开发和产品反馈无法解决<mention-user id="ou_735384320370d4aae3cbff794f953cbc"/>辛苦重点关注
      ——已解决
      - <text color="red">部分依赖记忆或记忆标签的内容</text>
      <text color="red"><mention-user id="ou_da74219ed70295531a8d932622712008"/></text><text color="red">和</text><text color="red"><mention-user id="ou_7106411f5b10518ccc6c4fdbef845d2c"/></text><text color="red">对齐</text>
      已对齐（世界信息配置时间，画像配置了相同的日期为结婚纪念日，没有给advice）
    </lark-td>
    <lark-td>
      未提测
      <mention-user id="ou_da74219ed70295531a8d932622712008"/>疲劳场景可测
    </lark-td>
  </lark-tr>
</lark-table>

<lark-table rows="3" cols="4" column-widths="119,127,127,127">

  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      舒适AI bar
    </lark-td>
    <lark-td>
      出行 AI bar
    </lark-td>
    <lark-td>
      内容AI bar
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      通过率
    </lark-td>
    <lark-td>
      22.7%
    </lark-td>
    <lark-td>
      /（没有单独用例）
    </lark-td>
    <lark-td>
      未提测
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      重点问题/block
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      - 点击后aiBar内容没有消失
    </lark-td>
    <lark-td>
      未提测
    </lark-td>
  </lark-tr>
</lark-table>

- [x] 【静态advisor对触发器的依赖/需求】需要<mention-user id="ou_d35304ddd7e37a06ebac58f7f60b6522"/>提meego，<mention-user id="ou_735384320370d4aae3cbff794f953cbc"/>跟进

### 20260923（fix）

#### 议题一：【固定议题】测试结果同步 {folded="true"}

静态advisor-<text underline="true">**接口测试结果**</text><mention-user id="ou_fd56e68ee69800bcce6973255c560b32"/>

<lark-table rows="3" cols="6" column-widths="119,127,162,186,139,139">

  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      动态事件模块（结合子目标&人人对话&历史建议）
    </lark-td>
    <lark-td>
      舒适adv（结合动态adv任务）
    </lark-td>
    <lark-td>
      出行adv（结合动态adv任务）
    </lark-td>
    <lark-td>
      情感adv
    </lark-td>
    <lark-td>
      内容adv
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      通过率
    </lark-td>
    <lark-td>
      49.7%
    </lark-td>
    <lark-td>
      61.98%
    </lark-td>
    <lark-td>
      80.41%
    </lark-td>
    <lark-td>
      /
    </lark-td>
    <lark-td>
      22.58%
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      重点问题/block
    </lark-td>
    <lark-td>
      1. 错误推理出预设事件；
			2. 新年时刻事件判断不准确，仅凭当前状态无法推理；
			3. 重复打扰：历史建议、当前 advice 和子目标之间存在重复推荐；
			4. 结合人人对话时会误触发：在无补能风险、续航充足、无需导航等情况下仍触发事件或技能；
    </lark-td>
    <lark-td>
      1. block（需要的依赖）：车外co2、pm2.5浓度、玻璃温度、露点温度）；
			1. 推荐了与正在执行任务相同的内容
			1. 实际场景需要内容推荐，但模型无输出
			1. 已有动态任务时仍重复给 advice：进行中、已过期或已执行的空调/座椅/车窗任务，仍被再次建议。
			1. 确认策略错误：除雾、开关阅读等场景应先确认，却直接告知执行。
			1. 子目标缺失：已明确存在舒适性问题或高温场景，却没有生成子目标。
			1. 任务信息结合不足：没有充分结合动态 advisor 任务，部分 advice 还比较啰嗦。
    </lark-td>
    <lark-td>
      1. block（需要的依赖）：平均能耗、ainavi工具；
			1. 推荐了与正在执行任务相同的内容
			1. 实际场景需要内容推荐，但模型无输出
			1. 未结合用户画像偏好进行推荐内容
			1. 时长 > 2h 就判定"存在疲劳信号"，system_control_0003.action=正常驾驶 被无视
			1. 当满电发起导航大于总续航时，触发混乱，AI 导游 3/10、补能 5/10、静默2/10
			1. 当 AI 导游、补能、休息，触发条件同时存在，触发混乱，AI 导游 8/10、补能 2/10、休息 0/10
    </lark-td>
    <lark-td>
      /
    </lark-td>
    <lark-td>
      1. block（需要的依赖）：内容编排tool、节目单剩余时长；
			1. 内容 advisor 推荐策略静默判定不一致，暴雨能正确静默，暴雨 10/10 静默，大雪 5/10 静默，但雾霾 0/10 静默。副驾/儿童睡觉也从不静默
    </lark-td>
  </lark-tr>
</lark-table>

静态advisor-<text underline="true">**端到端测试结果**</text><mention-user id="ou_da74219ed70295531a8d932622712008"/>

- 端侧测试换了一个固定的环境ppe_aidv_simulator_test，目前存在问题触发器请求的是弋途的pro_dna环境，<mention-user id="ou_709eabcc5b6d391d4222ba04fbaba531"/>9月22下午解决。——已解决
- 本周进度端侧先暂停测试，优先测试10月3号长测的用例 
- 关于上周阻塞端侧测试的模拟数据【世界信息】已经可以使用了（能被advisor拿到）
- 关于出行advisor阻塞
	- 1）关于充电站返回剩余空位没有的问题，导致静态advisor一直不给建议（关于补能）需要<mention-user id="ou_50222d018d90a9d2451f69f7426dd0c7"/>跟进赛力斯的对应开发；
  <callout emoji="gift_heart" background-color="light-purple" border-color="light-purple">
  已组织和赛力斯的专项群沟通
  </callout>

  - 2）关于多目标行程预测。目前<mention-user id="ou_2e1004f4a410346d7dce7bfd641804e6"/>反馈目前的画像数据解析出来很难被模型理解，需要<mention-user id="ou_50222d018d90a9d2451f69f7426dd0c7"/>和<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/>沟通关于画像的数据。
  <callout emoji="gift_heart" background-color="light-purple" border-color="light-purple">
  强依赖记忆模块迭代，已经和晓伟提需求，且反馈会纳入迭代范围。
  </callout>

#### 议题二：【固定议题】重点依赖进展跟进

<lark-table rows="3" cols="5" column-widths="81,157,100,165,121">

  <lark-tr>
    <lark-td>
      依赖模块
    </lark-td>
    <lark-td>
      待澄清问题
    </lark-td>
    <lark-td>
      跟进人
    </lark-td>
    <lark-td>
      本周进展
    </lark-td>
    <lark-td>
      下周计划
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      触发器
    </lark-td>
    <lark-td>
      - 预设事件的支持情况
    </lark-td>
    <lark-td>
      <mention-user id="ou_d35304ddd7e37a06ebac58f7f60b6522"/>
    </lark-td>
    <lark-td>
      - 新增多个事件，需测试接力实车验证
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      事件日志
    </lark-td>
    <lark-td>
      - 人人对话的开发进展。何时能完成
    </lark-td>
    <lark-td>
      <mention-user id="ou_735384320370d4aae3cbff794f953cbc"/>
    </lark-td>
    <lark-td>
      - 当前已经开发完了，等仁杰验收
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

#### 议题三：【固定议题】之前评审的需求开发进展同步 {folded="true"}

1. 静态advisor-使能相关的需求，<mention-user id="ou_2e1004f4a410346d7dce7bfd641804e6"/>跟进中
1. 豆包即时交互卡的需求，<mention-user id="ou_5db39c36f6959ac9bb6e0128d774e9a9"/>跟进中
1. 动态事件模块，何时可以接入实车？实车链路是通的吗？后续端到端测试会有专门的人？——<mention-user id="ou_da74219ed70295531a8d932622712008"/>

#### 议题四：【临时议题】后续产品需求进展同步

1. 目前正在重新review-专家任务集，涉及场景库的调整，会通过每周的周会和大家同步变动情况
	1. 情感advisor：黄金右脚场景暂时无法实现，原因：端状态评估暂时不会接入“本次行程的平均能耗”
1. 新需求：静态advisor-专属记忆&to B看台——产品侧已完成PRD梳理（产品内审推进中），计划周四组织相关产研测进行需求评审

To do：

<task task-id="9477b32a-fcaf-408d-bdb7-0522124f432f"/>

<task task-id="5a79ffc6-f072-4777-8c99-db3bedaa2bb6"/>

<task task-id="d9b8ff02-7848-4c49-ad3c-b05be23e96c5"/>

<task task-id="77be3a18-0d8d-407e-b280-2bb610310df6"/>

### 20261014 {folded="true"}

#### 议题一：【固定议题】整体情况概述

按照触发、推理、交互、使能四个板块跟进每周的重点问题

<lark-table rows="5" cols="3" column-widths="55,367,224">

  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      当前整体情况
    </lark-td>
    <lark-td>
      本周重点跟进
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      触发
    </lark-td>
    <lark-td>
      - **预设事件：共计25条预设事件（实车支持率：40%）**
				- 6条依赖VLM的能力，暂无法支持，预计11月才会逐步支持
				- 实车测试通过：10
				- <text color="blue">测试中：3  </text>
				- <text color="blue">待开发：6（依赖端状态支持）</text>
			- 动态事件（开发done）
				- 国庆节前已完成实车端到端链路打通，实车链路通
			- 子目标review（开发done）
				- 实车链路通
    </lark-td>
    <lark-td>
      1. 预设事件测试中的3个，需要有明确的结论 <mention-user id="ou_da74219ed70295531a8d932622712008"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      推理
    </lark-td>
    <lark-td>
      - 预设事件/动态事件/子目标-静态adv（开发done）
			- **context-端状态**
      <text color="blue">2期的正在接，3期的准备接。需要持续关注接入情况</text>
      <text color="red">预计时间？</text>
      - context-世界信息（开发done）
			- context-记忆
				- 已经接了长期记忆-用户标签
				- <text color="blue">还需要接临时记忆-短期会话记忆——待开发</text>
			- 事件日志
				- <text color="blue">需要接入历史advice+用户反馈——产品沟通中</text>
			- 动态adv-goal list（开发done）
    </lark-td>
    <lark-td>
      1. 端状态后续接入的时间目标是啥，有无计划<mention-user id="ou_735384320370d4aae3cbff794f953cbc"/>
			1. 和记忆模块/事件日志的对接，产品侧需要尽快完成对接、沟通 <mention-user id="ou_50222d018d90a9d2451f69f7426dd0c7"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      交互
    </lark-td>
    <lark-td>
      - 舒适AI bar（开发done）
			- 出行AI bar（开发done）
			- 内容AI bar（开发done）
			- 豆包即时交互卡（开发done）
			- 子目标接入任务中心（开发done）
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      使能
    </lark-td>
    <lark-td>
      - 主动服务开关状态
				- 主动查询链路已完成
				- 还差字节侧主动push的链路
			- 语音禁用状态/车外语音状态
				- 尚未开发——block（依赖端状态就位）
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

#### 议题二：【固定议题】静态advisor-单模块<text underline="true">**接口测试结果**</text>

<lark-table rows="3" cols="6" column-widths="119,176,211,186,186,190">

  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      动态事件模块 <mention-user id="ou_fd56e68ee69800bcce6973255c560b32"/>
    </lark-td>
    <lark-td>
      舒适adv <mention-user id="ou_fd56e68ee69800bcce6973255c560b32"/>
    </lark-td>
    <lark-td>
      出行adv <mention-user id="ou_78f68c80b0c8f90c1f4229baaff60765"/>
    </lark-td>
    <lark-td>
      情感adv <mention-user id="ou_fd56e68ee69800bcce6973255c560b32"/>
    </lark-td>
    <lark-td>
      内容adv <mention-user id="ou_78f68c80b0c8f90c1f4229baaff60765"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      通过率
    </lark-td>
    <lark-td>
      Total: 74, Failed: 29, Passed: 45, 通过率: 60.81%（针对上一轮fail用例）
    </lark-td>
    <lark-td>
      Total: 283, Failed: 94, Passed: 189, 通过率: 66.78%
    </lark-td>
    <lark-td>
      98.1%
    </lark-td>
    <lark-td>
      Total: 270, Failed: 29, Passed: 241, 通过率: 89.26%
    </lark-td>
    <lark-td>
      76.6%
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      重点问题/block
    </lark-td>
    <lark-td>
      1. 易推理出预设事件；
			2. “新年时刻”这一事件仅凭端状态无法推理得出；
			3. 已有子目标，所推理出的事件与子目标重复；
			4. 未结合历史建议，导致与历史建议重复。
    </lark-td>
    <lark-td>
      1. block（需要的依赖）：车外co2、pm2.5浓度、玻璃温度、露点温度）；
			1. 建议不符合测试用例预期；
			1. 推荐策略错误；
			1. 建议与历史建议重复；
			1. 建议与动态adv任务重复；
			1. cot字段内容与prd文档描述不符；
			1. 子目标review：服务不在时，子目标未删除；
			1. 子目标review：将空调温度调整到30度，更新后的子目标依然是主驾区域温度从34℃降至25℃；
			1. 子目标review：存在子目标未完成就被删除的情况；
    </lark-td>
    <lark-td>
      1. block：平均能耗；
			1. 阈值判定漂移：1.5km 已超 1km 触发阈值（PRD 停车规划判定 1km 以内），仍 4/5 建议——同一条 case 静默/建议之间漂移，阈值不严格
    </lark-td>
    <lark-td>
      1. 上车打招呼：主副驾关系不明确时，仍针对主驾结婚纪念日进行打招呼。
			1. 上车打招呼：副驾上车时，会针对主驾纪念日向主驾表达祝福。
			1. 分心驾驶提醒：一分钟内已存在历史建议时，仍重复给出了建议。
			1. 路况拥堵情绪安抚：主驾处于高兴唱歌状态时，仍给出了安抚建议。
    </lark-td>
    <lark-td>
      1. 睡觉不打扰失效：1、疲劳事件下副驾睡觉仍建议、think 明确看到副驾/儿童睡觉却判定"无禁止场景"继续推
			2. 天气抑制失效：雾霾、台风（复测 5/5 建议，完全无视）、
			3. 疲劳状态判定缺陷：明显疲劳（频繁闭眼）未移交休息规划、正常驾驶无疲劳仍建议、电子舞曲已提神仍建议切换
			4. 已摇滚音乐，仍建议切换为节奏明快的低负担提神音频辅助清醒
			5. 副驾通话仅降级界面确认，PRD 要求静默
    </lark-td>
  </lark-tr>
</lark-table>

#### 议题三：【固定议题】静态advisor-端到端测试结果<mention-user id="ou_da74219ed70295531a8d932622712008"/>

#### 议题四：【临时议题】场景库更新 {folded="true"}

<image token="DuBPbfAQRodjuUxaWrFcJm4jnXg" width="2206" height="76" align="center"/>

（删除原因：VLM无法识别满头大汗）

### 20261027

#### 议题一：【固定议题】整体情况概述

按照触发、推理、交互、使能四个板块跟进每周的重点问题

<lark-table rows="5" cols="3" column-widths="55,367,285">

  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      当前整体情况
    </lark-td>
    <lark-td>
      本周重点跟进
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      触发
    </lark-td>
    <lark-td>
      - **预设事件：共计24条预设事件（实车支持率：54%）**
				- 6条依赖VLM的能力，暂无法支持，预计11月才会逐步支持
				- 实车测试通过：13
				- <text color="blue">待开发：5（依赖端状态支持）</text>
			- 动态事件（开发done）
				- 本周根据产品路测等完成一轮优化
			- 子目标review（开发done）
				- 实车链路通
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      推理
      input
    </lark-td>
    <lark-td>
      - **context-端状态**
      <text color="blue">2期的正在接，3期的准备接。需要持续关注接入情况</text>
      - context-世界信息（开发done）
			- context-记忆
				- 已经接了长期记忆-用户标签
				- <text color="blue">还需要接临时记忆-短期会话记忆——待开发</text>
				- <text color="blue">长期记忆-用户标签-新key——待开发</text>
				- <text color="blue">长期记忆-用户标签-当前一些核心字段未有关联（P0 bug，block部分场景测试）——</text><text color="red">需求之前已澄清，晓伟反馈无人力</text>
				- https://meego.larkoffice.com/telematics/issue/detail/7383075185
			- 事件日志
				- <text color="blue">需要接入历史advice+用户反馈——待开发</text>
			- 动态adv-goal list（开发done）
			- Tools
				- navi：
					- 充电站/查询
				- 内容编排：
    </lark-td>
    <lark-td>
      1. 端状态后续接入的时间目标是啥，有无计划<mention-user id="ou_735384320370d4aae3cbff794f953cbc"/>
			- 全量端状态理想情况是11月才能接完
			- 1期的刚接完
			- 2期正在排期
			- [x] 和记忆模块/事件日志的对接，产品侧需要尽快完成对接、沟通 <mention-user id="ou_50222d018d90a9d2451f69f7426dd0c7"/>
				- [ ] 产品侧已完成澄清，当前排期？<mention-user id="ou_735384320370d4aae3cbff794f953cbc"/>和超然对一下
      <mention-doc token="QtDrwVdOcibytwkhzNYcrmRjnfh" type="wiki">「sls」场景感知状态信号库 </mention-doc>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      交互
    </lark-td>
    <lark-td>
      - 舒适AI bar（开发done）
			- 出行AI bar（开发done）
			- 内容AI bar（开发done）
			- 豆包即时交互卡（开发done）
			- 子目标接入任务中心（开发done）
    </lark-td>
    <lark-td>
      - 任务中心实车已上，测试的时候需要关注一下<mention-user id="ou_da74219ed70295531a8d932622712008"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      使能
    </lark-td>
    <lark-td>
      - 主动服务开关状态
				- 主动查询链路已完成
				- <text color="blue">还差字节侧主动push的链路</text>
			- 语音禁用状态/车外语音状态
				- <text color="red">尚未开发——block（依赖端状态就位）</text>
    </lark-td>
    <lark-td>
      <task task-id="08f66095-ae93-44f4-80a4-b8ae0d102cb0"/>
    </lark-td>
  </lark-tr>
</lark-table>

#### 议题二：【固定议题】静态advisor-单模块<text underline="true">**接口测试结果**</text><text underline="true">**<mention-user id="ou_fd56e68ee69800bcce6973255c560b32"/>**</text>

- 核心推理模块

<lark-table rows="3" cols="6" column-widths="119,176,211,186,186,190">

  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      动态事件模块 <mention-user id="ou_fd56e68ee69800bcce6973255c560b32"/>
    </lark-td>
    <lark-td>
      舒适adv <mention-user id="ou_fd56e68ee69800bcce6973255c560b32"/>
    </lark-td>
    <lark-td>
      情感adv <mention-user id="ou_fd56e68ee69800bcce6973255c560b32"/>
    </lark-td>
    <lark-td>
      出行adv <mention-user id="ou_78f68c80b0c8f90c1f4229baaff60765"/>
    </lark-td>
    <lark-td>
      内容adv <mention-user id="ou_78f68c80b0c8f90c1f4229baaff60765"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      通过率
    </lark-td>
    <lark-td>
      Total：333，已测:30(新年陪伴), Failed：0，Passed：30，当前已测试通过率：100%
    </lark-td>
    <lark-td>
      Total：228，Failed：64，Passed：164，通过率：71.93%
    </lark-td>
    <lark-td>
      Total：198，Failed：56，Passed：142，通过率：71.72%
    </lark-td>
    <lark-td>
      Total: 549, Failed: 18, Passed: 531, 通过率: 96.72%
    </lark-td>
    <lark-td>
      Total: 125, Failed: 38, Passed: 87, 通过率: 69.60%
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      重点问题/block
    </lark-td>
    <lark-td>
      无
    </lark-td>
    <lark-td>
      1. **节日/节气/纪念日规则未生效（10 例）**：妇女节、春节、国庆、清明、大暑、冬至、结婚纪念日均未结合；
			1. **特殊日期判断错误（5 例）**：生日已过第 1/5 天仍输出"生日快乐"；结婚纪念日误输出生日祝福
			1. **提示词规则冲突、结果不稳定（4 例）**：基础问候"不夹带天气/节日/节气"与 must"需结合节日、节气、特殊日期"相互矛盾；同一 case 执行 5 次，3 次结合天气、2 次未结合
			1. **nice-to-have 上下文未结合（7 例）**：衣着（西服/骑行服）、导航目的地、拥堵路况、语音助手人设（毒舌/高冷）连续 5 次均未结合，提示词中亦无对应约束
			1. **情绪识别与安抚范围不足（6 例）**：正向情绪（高兴唱歌）仍触发安抚；多乘员烦躁场景仅覆盖主驾，遗漏副驾与后排
			1. **频控与语气适配不足（3 例）**："一分钟内仅提醒一次"未生效，5 次均输出建议；暴雨、深夜等场景仍使用"温和轻柔"语气，与场景不匹配
    </lark-td>
    <lark-td>
      1. **决策与动作映射错误（10 例）**：CO2/PM2.5 超标未给出"开启空气净化"；空调制冷未开启却建议"开启全车制热"；极速制冷模式下仍要求单独调节温度；"出风模式"与"制冷/制热"概念混用；子目标仅覆盖主驾却同时调整副驾温度
			1. **非必要建议/误触发（8 例）**：24℃ 建议开启座椅通风；车内 27–28℃ 已在舒适区间仍建议开空调、调温；空气净化已开启仍建议开启；"座椅通风保持当前中档"等无实际动作的建议
			1. **动作依据与推理链缺失（约 19 例，占比最高）**：关闭遮阳帘、关闭阅读灯、关闭车门、风量调至 2/3 档、座椅加热调 1 档等动作未说明理由；"为何不开空调""为何不关座椅加热""本次为何不给建议"亦未说明
			1. **策略与场景、端能力不匹配（约 6 例）**：车速 20km/h 仍采用"界面确认"策略；"风向避开眼睛、吹向上身附近"表述不可执行；疲劳场景下给出大幅舒适调节；吹脸改吹脚缺乏依据
			1. **阈值口径未定义（5 例）**：PM2.5/CO2 具体数值端侧无法模拟；"捂鼻子"等体征场景是否走空气净化路径待定
			1. **文案一致性与 Task List 协同（约 5 例）**：COT 描述"夜间"而 advice 为"白天晴天"；标点重复"。。"；running/waiting 任务与当前建议的抑制或补充关系、think 是否需说明"不给建议的原因"尚未明确
    </lark-td>
    <lark-td>
      1. 补能规划
      (1) 边界漂移
      同为"略低于 1.3×、差 5km"的边界场景，行为不一致：
      - NAV-124（跨城 300km / 续航 385，电量 82%）：1.3×300=390 安全续航390 相比 385 差 5km， 10 次 = 输出 3 / 静默 7，静默轮 think 自创"差值极小"豁免——PRD 无此条款
			- NAV-754（150km / 续航 190，电量 20%）：1.3×150=195 安全续航 195 ，同差 5km，却 10 次 测试 10 输出
      (2) 执行链中断
      - NAV-176（300km / 续航 350）：两轮 10 次 = 输出 6 / 静默 4；静默轮 think 已识别"350<390 存在补能风险"，却自创"本应触发补能查询……经重新核对暂不查询"门槛后中断
      (3) 满电起点补能
      - NAV-794（500km）/ NAV-795（600km），满电续航 400km：全部推荐起点附近 1.2~2.8km 充电站
			- 问题：满电立即补能补不进电、无法增加可用续航；正确行为 = 规划续航接近耗尽处（约 350~400km 沿线）的补能点
    </lark-td>
    <lark-td>
      1. 场景边界与稳定性
      (1) 恶劣天气未让位
      - 凌晨雾霾+疲劳（CT-017）、台风+静默 35min（CT-146）、雾霾+静默 35min（CT-147）、大雨+疲劳（CT-273）均输出建议，think 未评估天气因素（CT-273 的 think 已承认"大雨路面湿滑"仍输出）
      (2) 高唤醒节目触达漂移
      - CT-133（摇滚播放中）10 次 = 输出 7 / 静默 3；CT-135（电音播放中）10 次 = 输出 5 / 静默 5
			- 输出轮两种自相矛盾形态：
				- a) 建议"是否继续播放当前摇滚/电音"——think 自己写着"节奏明确无需切换"却仍触达
				- b) 建议"切换为节奏明快的提神音乐"——当前节目恰是节奏最明快的类型；CT-135 甚至建议"切换为节奏舒缓的音乐辅助提升清醒度"，舒缓与提神直接矛盾
    </lark-td>
  </lark-tr>
</lark-table>

<task task-id="155cb06e-086d-4210-a2f8-93321aa439e9"/>

<task task-id="b621fc83-aa22-4716-a30f-7938808fcd18"/>

- AI bar

<lark-table rows="3" cols="4" column-widths="119,176,211,186">

  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      舒适AI bar
    </lark-td>
    <lark-td>
      出行AI bar
    </lark-td>
    <lark-td>
      内容AI bar
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      通过率
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
      重点问题/block
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

#### 议题三：【固定议题】静态advisor-端到端测试结果<mention-user id="ou_da74219ed70295531a8d932622712008"/>

内容adv测试同步：

<mention-doc token="WS8ywYdwuiMIHlkCmMPcuOoLnpe" type="wiki">【赛力斯E68】测试集&测试报告</mention-doc>当前执行28条：通过18条、失败4条、阻塞6条

已提测场景中有需要模拟的场景在测试过程中都因为这俩缺陷阻塞了，我建议等这俩bug解决了再继续测试（不需要模拟的场景均端到端测试通过）

[https://meego.larkoffice.com/telematics/issue/detail/7384203447](https%3A%2F%2Fmeego.larkoffice.com%2Ftelematics%2Fissue%2Fdetail%2F7384203447)

[https://meego.larkoffice.com/telematics/issue/detail/7384211012](https%3A%2F%2Fmeego.larkoffice.com%2Ftelematics%2Fissue%2Fdetail%2F7384211012)

出行/情感/舒适 本周无更新

#### 议题四：【临时议题】场景库更新 {folded="true"}

舒适&内容

<grid cols="2">

  <column width="37">
    <image token="BwQ4bOjhfoGrd6xsl3EcZOJnnpg" width="1560" height="1258" align="center"/>

  </column>
  <column width="62">
    <image token="NOdRb5Afsowo0hxtW0vcl73Inte" width="1788" height="864" align="center"/>

  </column>

</grid>

### 20261103 {folded="true"}

#### 议题一：【固定议题】整体情况概述 {folded="true"}

按照触发、推理、交互、使能四个板块跟进每周的重点问题

<lark-table rows="5" cols="3" column-widths="55,367,285">

  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      当前整体情况
    </lark-td>
    <lark-td>
      本周重点跟进
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      触发
    </lark-td>
    <lark-td>
      - **预设事件：共计24条预设事件（实车支持率：54%）**
				- 6条依赖VLM的能力，暂无法支持，预计11月才会逐步支持
				- 实车测试通过：13
				- <text color="blue">待开发：5（依赖端状态支持）</text>
			- 动态事件（开发done）
				- 本周根据产品路测等完成一轮优化
			- 子目标review（开发done）
				- 实车链路通
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      推理
      input
    </lark-td>
    <lark-td>
      - **context-端状态**
				- 1期的刚接完（11月3日）
				- 2期目标11月13日接完
				- 3期目标11月底接完
			- context-世界信息（开发done）
			- context-记忆
				- 已经接了长期记忆-用户标签
				- <text color="blue">还需要接临时记忆-短期会话记忆——待开发</text><text color="blue">（11/10）</text>
				- <text color="blue">长期记忆-用户标签-新key——待开发</text>
				- <text color="blue">长期记忆-用户标签-当前一些核心字段未有关联（P0 bug，block部分场景测试）——</text><text color="red">需求之前已澄清，晓伟反馈无人力</text>
				- https://meego.larkoffice.com/telematics/issue/detail/7383075185
			- 事件日志
				- <text color="blue">需要接入历史advice+用户反馈——待开发（预计下周开始）</text>
			- 动态adv-goal list（开发done）
			- Tools
				- navi：
					- 高德目的地预测——done
					- 查询行程管家数据——done
					- 周边搜（充电站/停车场）——done
					- 沿途搜（充电站/停车场）——done
					- POI详情查询（for 充电站信息）——done
					- 当前位置到A的算路——待接入
					- <text color="blue">位置A到B的算路——需navi开发</text>
				- 内容编排——done
    </lark-td>
    <lark-td>
      1. 1期、2期、3期的端状态清单<mention-user id="ou_735384320370d4aae3cbff794f953cbc"/>
			1. 
			- [x] 和记忆模块/事件日志的对接，产品侧需要尽快完成对接、沟通 <mention-user id="ou_50222d018d90a9d2451f69f7426dd0c7"/>
				- [ ] 产品侧已完成澄清，当前排期？<mention-user id="ou_735384320370d4aae3cbff794f953cbc"/>和超然对一下
      <mention-doc token="QtDrwVdOcibytwkhzNYcrmRjnfh" type="wiki">「sls」场景感知状态信号库 </mention-doc>
      - [ ] <text color="blue">长期记忆-用户标签-新key——待开发</text><text color="blue"><mention-user id="ou_50222d018d90a9d2451f69f7426dd0c7"/></text><text color="blue">找晓伟再明确一下，需要他给内部提meego</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      交互
    </lark-td>
    <lark-td>
      - 舒适AI bar（开发done）
			- 出行AI bar（开发done）
			- 内容AI bar（开发done）
			- 豆包即时交互卡（开发done）
			- 子目标接入任务中心（开发done）
    </lark-td>
    <lark-td>
      - 任务中心实车已上，测试的时候需要关注一下<mention-user id="ou_da74219ed70295531a8d932622712008"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      使能
    </lark-td>
    <lark-td>
      - 主动服务开关状态
				- 主动查询链路已完成
				- <text color="blue">还差字节侧主动push的链路</text>
			- 语音禁用状态/车外语音状态
				- <text color="red">尚未开发——block（依赖端状态就位）</text>
    </lark-td>
    <lark-td>
      <task task-id="08f66095-ae93-44f4-80a4-b8ae0d102cb0"/>
    </lark-td>
  </lark-tr>
</lark-table>

#### 议题二：【固定议题】静态advisor-单模块<text underline="true">**接口测试结果**</text><text underline="true">**<mention-user id="ou_fd56e68ee69800bcce6973255c560b32"/>**</text> {folded="true"}

- 核心推理模块

<lark-table rows="3" cols="6" column-widths="119,176,84,84,97,97">

  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      动态事件模块 <mention-user id="ou_fd56e68ee69800bcce6973255c560b32"/>
    </lark-td>
    <lark-td>
      舒适adv <mention-user id="ou_fd56e68ee69800bcce6973255c560b32"/>
    </lark-td>
    <lark-td>
      情感adv <mention-user id="ou_fd56e68ee69800bcce6973255c560b32"/>
    </lark-td>
    <lark-td>
      出行adv <mention-user id="ou_78f68c80b0c8f90c1f4229baaff60765"/>
    </lark-td>
    <lark-td>
      内容adv <mention-user id="ou_78f68c80b0c8f90c1f4229baaff60765"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      通过率
    </lark-td>
    <lark-td>
      Total: 154, Failed: 13, Passed: 141, 通过率: 91.56%
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
      重点问题/block
    </lark-td>
    <lark-td>
      1.建议与推理脱节：推理结论为「温感偏好未满足」，最终建议却是「关闭阅读灯」，CO₂ 偏高应切换外循环，建议中却额外加入了无关的「关闭阅读灯」。并且，不应该操作阅读灯。
      2.事件判定错误：新年陪伴事件不在祝福窗口按预期不应触发，实际却误触发了祝福。
      3.阈值判断错误：已连续驾驶 2.2 小时（超过 2 小时阈值），却判定为「未达休息阈值」，未触发休息规划。
      4.漏触发：连续切歌、通风换气、阳光热感、话题推荐等应给出建议的明确场景，均未产生建议。
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

<task task-id="b621fc83-aa22-4716-a30f-7938808fcd18"/>

- AI bar

<lark-table rows="3" cols="4" column-widths="119,176,211,186">

  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      舒适AI bar
    </lark-td>
    <lark-td>
      出行AI bar
    </lark-td>
    <lark-td>
      内容AI bar
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      通过率
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
      重点问题/block
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

#### 议题三：【固定议题】静态advisor-端到端测试结果<mention-user id="ou_da74219ed70295531a8d932622712008"/> {folded="true"}

本周无更新

后续看：端到端通过率

#### 议题四：【临时议题】场景库更新

<image token="A2JkbzHtsoMpYGx6AtQcbTtXngf" width="1690" height="656" align="center"/>

### 20261110

#### 议题一：【固定议题】整体情况概述

按照触发、推理、交互、使能四个板块跟进每周的重点问题

<lark-table rows="5" cols="3" column-widths="55,367,285">

  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      当前整体情况
    </lark-td>
    <lark-td>
      本周重点跟进
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      触发
    </lark-td>
    <lark-td>
      - **预设事件：共计24条预设事件（实车支持率：54%）**
				- 6条依赖VLM的能力，暂无法支持，预计11月才会逐步支持
				- 实车测试通过：13
				- <text color="blue">待开发：5（依赖端状态支持）</text>
			- 动态事件（开发done）
				- 本周根据产品路测等完成一轮优化
			- 子目标review（开发done）
				- 实车链路通
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      推理
      input
    </lark-td>
    <lark-td>
      - **context-端状态**
				- 1期的刚接完（11月3日）
				- 2期目标11月13日接完
				- 3期目标11月底接完
			- context-世界信息（开发done）
			- context-记忆
				- 已经接了长期记忆-用户标签
				- <text color="blue">还需要接临时记忆-短期会话记忆——待开发（11/10）</text>
				- <text color="blue">长期记忆-用户标签-新key——待开发</text>
				- <text color="blue">长期记忆-用户标签-当前一些核心字段未有关联（P0 bug，block部分场景测试）——</text><text color="red">需求之前已澄清，晓伟反馈无人力</text>
				- https://meego.larkoffice.com/telematics/issue/detail/7383075185
			- 事件日志
				- <text color="blue">需要接入历史advice+用户反馈——待开发（预计下周开始）</text>
			- 动态adv-goal list（开发done）
			- Tools
				- navi：
					- 高德目的地预测——done
					- 查询行程管家数据——done
					- 周边搜（充电站/停车场）——done
					- 沿途搜（充电站/停车场）——done
					- POI详情查询（for 充电站信息）——done
					- 当前位置到A的算路——待接入
					- <text color="blue">位置A到B的算路——需navi开发</text>
				- 内容编排——done
    </lark-td>
    <lark-td>
      1. 1期、2期、3期的端状态清单<mention-user id="ou_735384320370d4aae3cbff794f953cbc"/>
			1. 
			- [x] 和记忆模块/事件日志的对接，产品侧需要尽快完成对接、沟通 <mention-user id="ou_50222d018d90a9d2451f69f7426dd0c7"/>
				- [ ] 产品侧已完成澄清，当前排期？<mention-user id="ou_735384320370d4aae3cbff794f953cbc"/>和超然对一下
      <mention-doc token="QtDrwVdOcibytwkhzNYcrmRjnfh" type="wiki">「sls」场景感知状态信号库 </mention-doc>
      - [x] <text color="blue">长期记忆-用户标签-新key——待开发</text><text color="blue"><mention-user id="ou_50222d018d90a9d2451f69f7426dd0c7"/></text><text color="blue">找晓伟再明确一下，需要他给内部提meego</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      交互
    </lark-td>
    <lark-td>
      - 舒适AI bar（开发done）
			- 出行AI bar（开发done）
			- 内容AI bar（开发done）
			- 豆包即时交互卡（开发done）
			- 子目标接入任务中心（开发done）
    </lark-td>
    <lark-td>
      - 任务中心实车已上，测试的时候需要关注一下<mention-user id="ou_da74219ed70295531a8d932622712008"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      使能
    </lark-td>
    <lark-td>
      - 主动服务开关状态
				- 主动查询链路已完成
				- <text color="blue">还差字节侧主动push的链路</text>
			- 语音禁用状态/车外语音状态
				- <text color="red">尚未开发——block（依赖端状态就位）</text>
    </lark-td>
    <lark-td>
      <task task-id="08f66095-ae93-44f4-80a4-b8ae0d102cb0"/>
    </lark-td>
  </lark-tr>
</lark-table>

#### 议题二：【固定议题】静态advisor-单模块<text underline="true">**接口测试结果**</text><text underline="true">**<mention-user id="ou_fd56e68ee69800bcce6973255c560b32"/>**</text>

- 核心推理模块

<lark-table rows="3" cols="6" column-widths="119,106,165,241,97,98">

  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      动态事件模块 <mention-user id="ou_fd56e68ee69800bcce6973255c560b32"/>
    </lark-td>
    <lark-td>
      情感adv <mention-user id="ou_fd56e68ee69800bcce6973255c560b32"/>
    </lark-td>
    <lark-td>
      舒适adv <mention-user id="ou_fd56e68ee69800bcce6973255c560b32"/>
    </lark-td>
    <lark-td>
      出行adv <mention-user id="ou_78f68c80b0c8f90c1f4229baaff60765"/>
    </lark-td>
    <lark-td>
      内容adv <mention-user id="ou_78f68c80b0c8f90c1f4229baaff60765"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      通过率
    </lark-td>
    <lark-td>
      无更新
    </lark-td>
    <lark-td>
      Total: 221, Failed: 9, Passed: 212, 通过率: 95.93%
    </lark-td>
    <lark-td>
      Total: 221, Failed: 30, Passed: 191, 通过率: 86.43%
    </lark-td>
    <lark-td>
      无更新
    </lark-td>
    <lark-td>
      无更新
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      重点问题/block
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      1. 未结合导航目的地；
			1. 结合天气给出的建议表述需要优化；
			1. 无face id时不应该结合母亲节、儿童节、父亲节打招呼；
    </lark-td>
    <lark-td>
      1. 温感调节没有结合宠物狗的舒适区间；
			1. 冬季场景下给出的关于遮阳帘的建议不合理；
			1. 冬季场景下给出的关于驾驶员清醒辅助的建议不合理；
			1. 冬季场景下关于空调风向的建议不合理；
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

- AI bar-Agent

<lark-table rows="3" cols="4" column-widths="119,298,324,220">

  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      舒适AI bar
    </lark-td>
    <lark-td>
      出行AI bar
    </lark-td>
    <lark-td>
      内容AI bar
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      通过率
    </lark-td>
    <lark-td>
      - 舒适：238 条，pass 204 / fail 34，85.7%
    </lark-td>
    <lark-td>
      - 出行：503 条，pass 491 / fail 12，97.6%
    </lark-td>
    <lark-td>
      - 内容：144 条，pass 139 / fail 5，96.5%
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      重点问题/block
    </lark-td>
    <lark-td>
      舒适·多动作输入（34 条 fail 全属此类）
      核心：system_prompt 里没有任何"输入多个动作时怎么办"的规则，导致三个表现：①cot 梳理动作时漏项——5 轮中 ≥3 轮遗漏某些独立动作（如 9 项动作只提制冷）；②text 不会概括、只挑一个具体动作写（如三动作输入写"风量调2档"而不是"调整空调设置"）；③执行后阶段偶把 execution 里明确"执行失败"的动作写成按钮文案。根因一句话：提示词只有单动作示例，无多动作的覆盖、概括、成败筛选规则。
    </lark-td>
    <lark-td>
      出行·分段任务（11 条 fail）
      核心：输入是"先…再…"双目标链（先送学再上班、先补能再上班）时，提示词没有分段表达规则，text 只能表达其中一段：8 条 5 轮只写第一段（送豆豆去学校，上班段从不出现），其余出现首段/后段随机漂移、"去补能再上班"拼接尝试、"去学校上班"畸形硬拼。根因一句话：提示词按"单一目标"写文案，遇到双目标链无规则可依。
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

#### 议题三：【固定议题】静态advisor-端到端测试结果<mention-user id="ou_da74219ed70295531a8d932622712008"/>

看：端到端通过率

### 20261117

#### 议题一：【固定议题】整体情况概述

按照触发、推理、交互、使能四个板块跟进每周的重点问题

<lark-table rows="5" cols="3" column-widths="55,367,285">

  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      当前整体情况
    </lark-td>
    <lark-td>
      本周重点跟进
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      触发
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      推理
      input
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      交互
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      使能
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

#### 议题二：【固定议题】静态advisor-单模块<text underline="true">**接口测试结果**</text><text underline="true">**<mention-user id="ou_fd56e68ee69800bcce6973255c560b32"/>**</text>

- 核心推理模块

<lark-table rows="3" cols="6" column-widths="119,106,165,241,205,196">

  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      动态事件模块 <mention-user id="ou_fd56e68ee69800bcce6973255c560b32"/>
    </lark-td>
    <lark-td>
      情感adv <mention-user id="ou_fd56e68ee69800bcce6973255c560b32"/>
    </lark-td>
    <lark-td>
      舒适adv <mention-user id="ou_fd56e68ee69800bcce6973255c560b32"/>
    </lark-td>
    <lark-td>
      出行adv <mention-user id="ou_78f68c80b0c8f90c1f4229baaff60765"/>
    </lark-td>
    <lark-td>
      内容adv <mention-user id="ou_78f68c80b0c8f90c1f4229baaff60765"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      通过率
    </lark-td>
    <lark-td>
      无更新
    </lark-td>
    <lark-td>
      Total: 266, Failed: 23, Passed: 243, 通过率: 91.35%
      上车打招呼:89.50%
      超长红灯等待安抚：100%
      路线拥堵安抚:100%
      分心驾驶提醒：100%
    </lark-td>
    <lark-td>
      Total: 216, Failed: 63, Passed: 153, 通过率: 70.83%
      温感调节:75.41%
      座舱空气与通风调节：62.5%
      防雾与除雾调节：79.17%
      驾驶清醒舒适辅助：65.00%
      香氛调节：93.33%
    </lark-td>
    <lark-td>
      Total: 374 条。通过率 93.03%；
      行前预测 100%
      AI导游推荐 98.89%
      停车规划 95.74%
      补能规划 90.62%
      休息规划 83.08%
    </lark-td>
    <lark-td>
      Total: 200 条，153 pass / 47 fail，76.50%（；
      驾驶清醒内容辅助 92.79%
      场景化内容触达 59.62%
      节目单动态调整 51.43%
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      重点问题/block
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      1. 今天不是春节、中秋、清明、端午，却给出了“节日快乐”这类问候，节日日期的判断有问题；
			1. 天气相关的建议偏固定，不同天气出来的话术差别不大；
			1. 极端天气下打招呼的方向和 PRD 写的不一致，得按 PRD 逐条对一遍；
			1. faceid 未知时，不该结合七夕、情人节、儿童节打招呼；
			1. faceid 有值时，父亲节、母亲节、情人节、七夕、妇女节这几个节日的打招呼策略需要澄清；
			1. 同一天主驾和副驾都命中特殊日期时，只结合了其中一个处理；
    </lark-td>
    <lark-td>
      1. 推荐策略和执行动作对不上：触发条件是主驾睡着，落到的策略却是界面确认，人已经睡着了，这个确认动作没人能完成。
			1. 温感调节没有考虑宠物的适宜温度区间。
			1. 建议内容本身不合理，集中出现在下面几条：
				- 已经有人睡着了，还建议把副驾座椅通风开到3档，噪声太大；
				- 把电动风口的能力套到了空调出风模式上，这两件事不是一回事；
				- 给出了“维持当前现状”这种没有动作的建议；
				- P档状态下建议关闭阅读灯；
				- 主驾睡着时建议把主驾方向盘加热从2档调到3档等。
				- etc.
    </lark-td>
    <lark-td>
      1. 补能规划
      (1) 频控失效
      PRD 要求"避免重复建议"——短时差（≤2h）内已给过同类补能建议后不应再输出同类建议；补能频控族 11 条全部重复输出：
      - NAV-790~800（时距采样 10/30/60/90/110min）+ NAV-113/122，共 11 条 ×5 全部重复输出同类补能站建议，think 全程不引用"最近历史建议"
      (2) 附近补能未接入（环境阻塞）
      - PRD 准出条款：没有导航时必须优先判断附近补能、家充或后续计划；当前未导航形态附近补能搜索工具调用 100% 失败（响应 500），该分支及依赖它的家充/后续计划判断链路全部不可测：9 条环境阻塞，think 均写"工具执行失败，未获取到可用站点信息"后静默，属工具链未接入而非模型缺陷；
			1. 休息规划
      (1) 短时差重复建议
      已给过同类休息建议后，短时差（≤2h）内再次触发疲劳场景仍重复输出同类休息建议：
      - NAV-980~989 两条触发路径（2h 连续驾驶规则/疲劳检测）× 时距采样（59s/60s/61s/29min59s/30min）共 10 条 ×5 = 50/50 轮全部重复输出
    </lark-td>
    <lark-td>
      1. 内容 advisor
      (1) 频控失效
      内容侧 4 个 skill 中 3 个（触达/清醒辅助/节目单）频控全部失效，短时差 ≤2h 内同类内容建议重复输出：
      - CT-023/039/077/081/084/093/237/281/347/348/349 共 11 条 ×5 全部 fail，
    </lark-td>
  </lark-tr>
</lark-table>

- AI bar-Agent

<lark-table rows="3" cols="4" column-widths="119,298,324,220">

  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      舒适AI bar
    </lark-td>
    <lark-td>
      出行AI bar
    </lark-td>
    <lark-td>
      内容AI bar
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      通过率
    </lark-td>
    <lark-td>
      - 舒适：217 条，pass 217 / fail 0，100%
    </lark-td>
    <lark-td>
      - 出行：291 条，pass 291 / fail 0，100%
    </lark-td>
    <lark-td>
      - 内容：50 条，pass 45 / fail 5，90%
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      重点问题/block
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      字数超出限制导致fail
    </lark-td>
  </lark-tr>
</lark-table>

#### 议题三：【固定议题】静态advisor-端到端测试结果<mention-user id="ou_da74219ed70295531a8d932622712008"/>

看：端到端通过率
