# K-poi-two-entries

位置：K 模块。沿用 v14 的纵向流程卡片样式，侧边通道处理分支；每条线描述交接内容或判断条件。图下保留连续带读。

{
  "id": "K-poi-two-entries",
  "title": "“记住我家”与“设置我家”：短期同步中的两条入口",
  "caption": "依据 8 月短期方案与内审逐字稿梳理。9 月提出的统一 Profile 双向同步属于长期方案，不接入这张短期运行图。",
  "nodes": [
    {
      "id": "kpoi1",
      "title": "用户表达家或公司地址",
      "body": [
        "先保留说话人、具体地点与操作意图"
      ]
    },
    {
      "id": "kpoi2",
      "title": "Director 区分语义",
      "body": [
        "偏记忆，或明确要求地图设置"
      ]
    },
    {
      "id": "kpoi3",
      "title": "记忆操作工具",
      "body": [
        "接收记忆类表达",
        "家/公司语义分流给提槽模块"
      ]
    },
    {
      "id": "kpoi4",
      "title": "提取同步所需信息",
      "body": [
        "记忆主体、地点类型与目标地点",
        "工程校验输出是否可用于设置"
      ]
    },
    {
      "id": "kpoi5",
      "title": "核当前身份与地图账号",
      "body": [
        "按目标车型规则确认可操作范围",
        "车主未识别及账号切换逻辑需核实"
      ]
    },
    {
      "id": "kpoi6",
      "title": "导航基础控制入口",
      "body": [
        "接收明确地图设置要求",
        "偏设置的表达直接进入这一路"
      ]
    },
    {
      "id": "kpoi7",
      "title": "实际地图设置结果",
      "body": [
        "明确成功、失败或缺少信息",
        "设置结果不能用记忆受理代替"
      ]
    },
    {
      "id": "kpoi8",
      "title": "Director 依据结果答复",
      "body": [
        "若结果不足，补充信息或解释失败",
        "下一次“回家”再验证实际目的地"
      ]
    }
  ],
  "edges": [
    {
      "from": "kpoi1",
      "to": "kpoi2",
      "label": "用户 Query 与当前身份"
    },
    {
      "from": "kpoi2",
      "to": "kpoi3",
      "label": "偏记忆：记一下我家在…"
    },
    {
      "from": "kpoi3",
      "to": "kpoi4",
      "label": "家/公司相关语义"
    },
    {
      "from": "kpoi4",
      "to": "kpoi5",
      "label": "提取出的主体与地点"
    },
    {
      "from": "kpoi5",
      "to": "kpoi6",
      "label": "身份与参数满足该项目设置要求"
    },
    {
      "from": "kpoi2",
      "to": "kpoi6",
      "label": "偏设置：把这里设为家"
    },
    {
      "from": "kpoi6",
      "to": "kpoi7",
      "label": "提交地图设置并取得结果"
    },
    {
      "from": "kpoi7",
      "to": "kpoi8",
      "label": "真实设置反馈"
    }
  ],
  "sourceIds": [
    "MEM26-POI",
    "MEM26-REVIEW"
  ]
}
