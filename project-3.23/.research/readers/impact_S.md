# 15 S 主动服务与 Advisor — 资料里有、副本需补/修正的事实点

## Advisor 触发器底座关系
- 动态 Advisor 的"照看宝宝""留意小狗"订阅任务、静态 Advisor 的"上车问候""低电量推荐"预设场景，都靠触发器做底座。
- 触发器画板 KKPlw 画了：Advisors（舒适/出行/情感）←Context，出"建议"→条件提槽&解析→Planner；Planner 再调触发器注册条件任务。
- 来源：CTA docx E2hFwX6s0iHBN3kSbCYcdZJ8nch。【2.6目标】

## 静态 Advisor 触发场景示例（副本 S 章可补具体 case）
- 上车打招呼+舒适环境：VLM 检测人物上车 → trigger 情感 advisor。
- 副驾睡眠关怀：副驾睡觉 AND 二排右无人 → trigger 舒适 advisor。
- 不舒适行为调整：擤鼻涕/按摩太阳穴/扇风 → trigger 舒适 advisor。
- 抽烟关怀：VLM 检测抽烟 → trigger 舒适 advisor。
- 状态关怀（睡觉/看书/看电脑/拿游戏机/喝水）：副驾或二排左中右 → trigger 舒适 advisor。
- 来源：CTA。【已落地】

## 任务中心与 Advisor 子目标
- 只有出行、舒适两类子目标出现在任务中心；内容、情感类不出（不产出子目标）。
- 来源：sls 任务中心技术文档。【2.6目标】

## 待核
- 动态 Advisor 注册场景到触发器的具体接口（N11 章 Advisor Creator 应展开）。
