# SE-dynamic-example-detail

位置：SE 模块。沿用 v14 的纵向流程卡片样式，侧边通道处理分支；每条线描述交接内容或判断条件。图下保留连续带读。

{
  "id": "SE-dynamic-example-detail",
  "title": "动态示例支线：从维护记录到下一次真实执行",
  "scopeLabel": "已明确的示例维护与运行使用机制；口述自动生成不并入此图",
  "annotateBranches": true,
  "caption": "已明确的示例维护与运行使用机制；口述自动生成不并入此图",
  "nodes": [
    {
      "id": "DX1",
      "title": "维护相应环境的示例",
      "body": [
        "保存用户表达与决策分析，保持真实工具和能力边界。"
      ]
    },
    {
      "id": "DX2",
      "title": "下一次收到用户请求",
      "body": [
        "当前 Query 进入检索，同时保留本轮身份与车况。"
      ]
    },
    {
      "id": "DX3",
      "title": "检索相关示例",
      "body": [
        "返回与当前表达相关的处理参考；未命中不代表用户没说过。"
      ]
    },
    {
      "id": "DX4",
      "title": "注入 scenario_sample",
      "body": [
        "核对实际请求里出现了哪条示例正文。"
      ]
    },
    {
      "id": "DX5",
      "title": "Director 结合本轮事实决策",
      "body": [
        "参考做法，不照抄示例里的地点、对象和返回结果。"
      ]
    },
    {
      "id": "DX6",
      "title": "按 action_list 调用真实工具",
      "body": [
        "执行对象、参数和前后依赖由本轮决策确定。"
      ]
    },
    {
      "id": "DX7",
      "title": "接回 tool_feedback",
      "body": [
        "根据成功、失败或缺少信息决定回复、补查或下一步。"
      ]
    }
  ],
  "edges": [
    {
      "from": "DX1",
      "to": "DX2",
      "label": "示例已维护，等待新的实际请求"
    },
    {
      "from": "DX2",
      "to": "DX3",
      "label": "当前用户 Query"
    },
    {
      "from": "DX3",
      "to": "DX4",
      "label": "检索得到的相关示例"
    },
    {
      "from": "DX4",
      "to": "DX5",
      "label": "scenario_sample 与本轮 Context"
    },
    {
      "from": "DX5",
      "to": "DX6",
      "label": "选择的工具及参数"
    },
    {
      "from": "DX6",
      "to": "DX7",
      "label": "执行方返回的真实结果"
    },
    {
      "from": "DX7",
      "to": "DX5",
      "label": "依据结果继续当前推理"
    }
  ],
  "sourceIds": [
    "DYNAMIC-EXAMPLE",
    "SE-DYNAMICPRD",
    "SE-DYNAMIC0805"
  ]
}
