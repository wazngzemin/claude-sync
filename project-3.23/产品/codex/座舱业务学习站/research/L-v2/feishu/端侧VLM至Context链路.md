# 端侧VLM至Context链路（飞书原文转存；更新时间 2026-07-02T11:19:02+08:00）

来源链接：https://bytedance.larkoffice.com/wiki/UrlxwA0DkiKfnZkRDpKc1sOqnVp

1. 评审目标：
  <image token="HCPfbvWItoHZaBxX9VdcXOGAnRe" width="2388" height="306" align="center"/>

  1. 0701 目标：建立meego，确定评审时间
	1. 0703目标：完成产研评审
	1. 0704目标：完成排期
1. 评审范围：
	1. 梳理链路，与各方对齐vlm的输出可以满足使用场景，而需要评审的是 AI-Box 到 端侧信号库（后续的端侧信号库 到 云端context是不是由具体的产品再负责）ok
	1. 需要给到端侧信号库的信号 <mention-doc token="MN4JwSA64iCPQ8kn4YHcJ7bQnbc" type="wiki">【端状态】端侧模型格式梳理</mention-doc> 这个就可以了？新导入的交付时间就会延后？且0804是交付链路，信号的交付可以放到P1？ok
	1. 需要和端侧信号库的同学renjie约定上传的具体格式和内容，并导入开发去开发上传链路 
	1. 荣姐建议：把每一段都梳理清楚，明确owner，且明确当前交付的输入or触发是否有依赖，有的话是等还是 mock
1. 确定下评审细节：
	1. 流程图？
	1. 谁来评？
1. 视觉转换成触发器标签：依赖于phud那边的梳理结果，看有多少gap，然后判断是否有新导入标签 or 用云端模型来聚类
1. sls的端侧闭环应用需要更新到表格里，这里会有依赖，那么对应的优先级就会往后调整eg： P1 
1. 开关逻辑：所有的vlm任务都统一下开关逻辑，都由外部控制，控制源来于两类：一类是sls应用，一类是端侧触发器。（alwayson的开关也是由端侧触发器来执行的）

<whiteboard token="H0dWwNssZhEVUDbz0s8cB7B7nUd"/>

<lark-table rows="2" cols="7" column-widths="100,252,233,146,187,219,190">

  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      VLM 触发路线
    </lark-td>
    <lark-td>
      VLM 模型
    </lark-td>
    <lark-td>
      VLM 上传路线
    </lark-td>
    <lark-td>
      静态Advisor 触发路线
    </lark-td>
    <lark-td>
      动态Advisor消费路线
    </lark-td>
    <lark-td>
      系统预设任务
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      相关方
    </lark-td>
    <lark-td>
      触发源：
      1. 端侧触发器 + 云端触发器
			1. Sls 应用
      被触发：
      Yitu + VLM
    </lark-td>
    <lark-td>
      1. 0804要交付的范围：
      <mention-doc token="MN4JwSA64iCPQ8kn4YHcJ7bQnbc" type="wiki">【端状态】端侧模型格式梳理</mention-doc>
    </lark-td>
    <lark-td>
      1. <text color="red">发送方：</text>
      <text color="red">yitu+vlm</text>
      1. <text color="red">中继：</text>
      <text color="red">端侧信号库</text>
      1. 接收方：
      云端Context
    </lark-td>
    <lark-td>
      1. 触发源：云端context + 云端触发器
			1. 被触发者：静态Adv
    </lark-td>
    <lark-td>
      1. 既有信号可以cover：动态Adv + 云端触发器 + 云端Context
			1. 需要新拼sp解决的：动态Adv + 云端触发器 + 端侧触发器
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

<whiteboard token="UwQJwptBbhsi9TbgVXwcm4MBnOf"/>
