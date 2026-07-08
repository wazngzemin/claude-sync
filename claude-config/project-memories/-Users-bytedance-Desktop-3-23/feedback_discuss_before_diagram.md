---
name: feedback-discuss-before-diagram
description: 优化架构图必须先讨论再动手，不能直接改完给用户看
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 5d066611-f113-49aa-89da-24d41e8a8f56
---

优化/重构架构图时，必须先跟用户讨论清楚再产出，不能自己判断完直接改。

**Why:** 用户说"你需要的是跟我一起讨论再产出这个图"——他是产品owner，图的每个模块包含关系、层级、边界都是产品决策，不是我能替他拍的。之前我直接改了⑮/㉔内部结构和感知器节点，没问他AIBox应该怎么画就自己加了个小节点，但实际AIBox应该是一个大容器盒子包住端侧所有内容。

**How to apply:** 
1. 先确认自己理解了每个模块的含义和包含关系
2. 提出优化方案（文字描述），等用户确认
3. 确认后再动手改图
4. 涉及模块层级/包含关系/边界这种结构性改动，必须讨论

Related: [[feedback_trigger_diagram]]
