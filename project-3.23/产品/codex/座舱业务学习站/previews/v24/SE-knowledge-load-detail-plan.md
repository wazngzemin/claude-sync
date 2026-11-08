# SE-knowledge-load-detail

位置：SE 模块。沿用 v14 的纵向流程卡片样式，侧边通道处理分支；每条线描述交接内容或判断条件。图下保留连续带读。

{
  "id": "SE-knowledge-load-detail",
  "title": "专家知识支线：从当前情景到 Director 的实际输入",
  "scopeLabel": "动态知识检索需求定义的处理链；不等于全部车型已部署",
  "annotateBranches": true,
  "caption": "动态知识检索需求定义的处理链；不等于全部车型已部署",
  "nodes": [
    {
      "id": "KL1",
      "title": "准备当前请求与背景",
      "body": [
        "Query、近期说话历史、目标队列、最新车况、已加载知识编号。"
      ]
    },
    {
      "id": "KL2",
      "title": "判断当前场景及持续目标",
      "body": [
        "对比哪些知识仍需要，哪些需要补充或移除。"
      ]
    },
    {
      "id": "KL3",
      "title": "场景不足时保持空新增",
      "body": [
        "说明需下游进一步确认；不凭空补成某类任务。"
      ]
    },
    {
      "id": "KL4",
      "title": "返回知识编号增删结果",
      "body": [
        "add_knowledge_ids、remove_knowledge_ids 及各自原因。"
      ]
    },
    {
      "id": "KL5",
      "title": "按编号取得并拼接知识正文",
      "body": [
        "保留仍支撑目标的知识，移除已不适用内容。"
      ]
    },
    {
      "id": "KL6",
      "title": "把正文装入 knowledge",
      "body": [
        "与本轮请求和其它背景一起成为 Director 输入。"
      ]
    },
    {
      "id": "KL7",
      "title": "Director 决定当前动作或澄清",
      "body": [
        "结合本次事实、用户意图和真实工具能力使用知识。"
      ]
    },
    {
      "id": "KL8",
      "title": "执行工具并返回实际结果",
      "body": [
        "结果回到当前推理；知识命中本身不是任务成功。"
      ]
    }
  ],
  "edges": [
    {
      "from": "KL1",
      "to": "KL2",
      "label": "交付本轮事实与已有知识清单"
    },
    {
      "from": "KL2",
      "to": "KL3",
      "label": "场景信息不足"
    },
    {
      "from": "KL2",
      "to": "KL4",
      "label": "能够判定相关知识"
    },
    {
      "from": "KL3",
      "to": "KL4",
      "label": "新增为空，并带回缺少信息的说明"
    },
    {
      "from": "KL4",
      "to": "KL5",
      "label": "知识编号与增删动作"
    },
    {
      "from": "KL5",
      "to": "KL6",
      "label": "选中的实际知识正文"
    },
    {
      "from": "KL6",
      "to": "KL7",
      "label": "本轮 SP 中的 knowledge"
    },
    {
      "from": "KL7",
      "to": "KL8",
      "label": "需要动作时下发 action_list"
    },
    {
      "from": "KL8",
      "to": "KL7",
      "label": "tool_feedback 支撑下一步判断"
    }
  ],
  "sourceIds": [
    "CORE-DYNAMIC-KNOWLEDGE",
    "NEW-EXPERT-TRANSCRIPT0909"
  ]
}
