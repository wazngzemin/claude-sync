# impact_misc：其他组与 core.json 补漏文档里有、副本缺的事实

> 每条带链接、状态、车型。主要补 05D/06C/09W/11K/12T/15S/17A/N9/N11，与 V/R/M/C 四节间接相关。

## 05 D Director / 12 T 任务生命周期：司机 Agent 与智驾融合【2.6目标｜赛力斯/上汽】
- 司机 Agent 承接智驾总控，分四类场景：无参照靠边停、POI 参照靠边停、路口参照临停、VLM 视觉参照物临停；另有 D2D 车位到车位（有图/无图自由组合）。
- 时延口径：端侧 LLM <800ms、VLM <2200ms、智驾控车 <200ms；提槽准确率 >98%；最终停到参照物距离综合准确率约 88%。
- 智驾激活需要二次确认卡片（通用卡片，15s 自动消失，可配）。
- 组合指令上限：转向 ≤3 个；转向+临停 1+1；纵向横向可并行。
- 豆包猎手（P1）：蹲车位长时任务，前视广角 120° 覆盖 6–7 个车位，空闲后自动泊入。
- 链接：https://bytedance.larkoffice.com/docx/HFQCdKoMUou0Pyx4YmNcbbxunIw

## 15 S 主动服务 / N2 Always On / 17 A 视觉：Watcher PRD【2.6目标｜路特斯 demo → 通用】
- Always On = 一路 OMS 云端感知；两能力：视觉感知（舱内人物表情行为/舱外道路风景）+ 注意力（融合记忆、端状态、历史情景判断要不要进一步思考）。
- 9 月底路特斯先做独立链路 demo；10 月全链路含 ≥2 个 Advisor。
- 长期：端侧 8B–10B 或 Omni 模型做感知；多路视频流；加 Voice 输入做多模态全时聆听，免唤醒、主动插话。
- 链接：https://bytedance.larkoffice.com/wiki/RU6sdBqpdoGRBSxv8wScZup3nlb

## N11 Advisor Creator / 动态 Advisor Goal List
- 上汽 Goal List 已有增删改查接口规范。
- Dyna-advisor 感知订阅接口：持续任务通过订阅监听事件，定时重发 attention。
- 链接：https://bytedance.larkoffice.com/docx/ExtGwiADMijNBDkXo2Xcmocdncg 、https://bytedance.larkoffice.com/docx/QFUUwCpGziJeJ1kXfvzckBZ0ncf

## 17 A VQA 链路调整【讨论中｜赛力斯】
- IR/RGB 图片分辨与颜色问询约束。
- 图像模糊场景拒答。
- 连续多轮语义判断（VQA 内部多轮上下文）。
- 后排 OMS 主动开启走语义判断；AlwaysOn 关闭时摄像头可临时开启。
- LBS 识别 Query 携带当前位置改写；图搜兜底。
- 链路参数：edge_vlm_up / picture_cache / picture_id / capture_time / car_heading 已纳入 function params。
- 链接：https://bytedance.larkoffice.com/wiki/LFY0wDplSitCuhkRmBcc4eTsnrg

## 06 C Context / 11 K 记忆 / N9 知识库：2B 全链路 RAG【ToB】
- 按模块/模型/插件干预结果；车控 NLG、车书、闲聊已有 RAG 接入（奔驰/奥迪/奔腾案例）。
- 知识切片按语意检索后给模型参考；不拼全量知识。
- 低代码 RAG 运维平台，客户或交付团队可自运维。
- 链接：https://bytedance.larkoffice.com/docx/HtkadRB8DocbSFx4NQNcjX8wnhg

## 09 W 可见即可说【2.6目标｜上汽】
- 总体框架：屏幕元素打标、词表、权限；抖音短视频在舱内屏的可见即可说已做单方案。
- 链接：https://bytedance.larkoffice.com/wiki/AxYjwUI8wiFCXWkdNsDcRae0nCf 、https://bytedance.larkoffice.com/wiki/Va9Fw4yqHiLwP8kpaIacwEZLnEd

## 07 O 表达层：豆包汽车如何更像人【讨论中｜通用】
- 感知层：口语化输入纠错（停顿/语气词/重复/语法），行业惯例是 ASR 结果阶段做口癖过滤+同音词/歧义校准，不是让 LLM 自己处理。
- 这与副本 01 V 节"ASR 文本上屏"的口径相关：上屏文本建议是清洗后版本，不是原始识别。
- 链接：https://bytedance.larkoffice.com/wiki/NIPuwAlCnilnmbkfyQVcQxdJnmf

## 跳过/未读说明
- 会议逐字稿（DT 宣讲、9/1 内审）按本轮范围未读。
- 发版记录、调试命令、HR 期权、评测集、海外 Playbook 与座舱 AI 主线弱相关，未展开。
- v13 架构图、Ai Car 架构合集是纯画板文档，已导出可后续看图。
