# N11 Advisor Creator / 动态 Advisor / Goals — 资料里有、副本需补的事实点

## 动态 Advisor 注册场景到触发器
- 动态 Advisor 的"照看宝宝""留意小狗"订阅任务，通过触发器注册场景；触发器三类链路里"条件触发"的三入口之一就是动态 Advisor。
- Planner 推理出条件任务→任务语句规整→调触发器注册；触发器解析器拆条件项，执行项默认"通知 Planner 任务触发"。
- 来源：CTA docx E2hFwX6s0iHBN3kSbCYcdZJ8nch + KvUUwo9 画板。【2.6目标】

## Planner 条件任务示例（N11 可作贯穿案例）
- "我下车时提醒我拿手机" → 条件：主驾下车；执行：通知 planner。
- "一会儿八点播上海音乐广播" → 条件：time==2025-12-06 08:00；执行：通知 planner。
- "副驾上车后给她唱小星星" → 条件：副驾占座=有人 AND 副驾安全带=插入；执行：通知 planner。
- "我比较累的时候给我放首歌" → 条件：VLM 人物列表 主驾 打哈欠；执行：通知 planner。
- 来源：CTA。【已落地】

## 待核
- Advisor Creator 的可视化配置流程（配置平台改造 PRD TW0pwb 提了 Workflow 画布）与 N11 现有动态 Advisor 内容如何对齐，需补一节。
