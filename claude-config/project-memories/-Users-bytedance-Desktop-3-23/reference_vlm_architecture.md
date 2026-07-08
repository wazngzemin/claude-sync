---
name: reference_vlm_architecture
description: VLM/VQA/感知器架构——感知器是调度器非VLM，VQA才是VLM，上汽云端/赛力斯端侧
metadata: 
  node_type: memory
  type: reference
  originSessionId: 380c05a0-2310-471c-bc2e-3a8f01a30938
---

**触发器系统里"VLM到底在哪"的标准答案**（讲解稿常被问、用户讲不清）：

- **摄像头** = 只拍图，不懂内容。
- **感知器（㉕，端侧，节点"感知订阅→感知器"）= 调度器，不是VLM。** 干两步：①定时去摄像头捞图(如每5秒拍二排宝宝)②把图送去问VQA。节点行"vlm定时捞图→VQA判事件"=定时捞图+送VQA判事件。
- **VQA = VLM（真正看懂图的AI）。** 给图+问题("宝宝睡了吗")→回答。这才是视觉解析模型。
- **VLM在哪取决于哪辆车：上汽无端侧VLM→图传云端走VQA(豆包视觉API)；赛力斯有端侧VLM→车端本地看、断网也跑。** 文档原话"VLM=云端VQA(不接端模)"、"赛力斯有端侧VLM→下发端侧；上汽无→留云端走VQA"。

**比喻：** 感知器=值班助理(定时拍照+拿去问)，VQA(VLM)=看图的AI专家。

丁斌=VLM owner。配置平台⑬的VLM条件需补7字段(camera_group/seat/query/interval/timeout/priority/mutex_group)，现为空占位=4处待改造之一(P0)。源：`产品-端侧触发器/触发器讲解稿-核对修正版.html` #advisor-vlm-aibox。关联 [[project_trigger_architecture]]、[[project_nav_trigger_prd]]、[[project_trigger_622_review]]。

**⚠ 2026-06-22 订正（编号坑）**：用户当前评审的业务大图(image #1)节点**只到 ㉔ 端侧触发器，没有 ㉕**。"㉕ 感知器"是旧版 v2.0 PRD/讲解稿里的编号，**不是当前评审图的节点**。用户口径：㉕→统一叫**端模/端侧VLM(AIBox)**，非编号节点。已把 触发器PRD-v2.html 里 81 处 ㉕、37 处"感知器"全替换为"端模"。**以后引用圈号前先拿用户给的那张图核对，别用旧文档的幽灵编号**（㉖ TTS/㉒ 工具库 也待核对）。
