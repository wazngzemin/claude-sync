---
name: project_yihong_scenes_x_hanjie_atomic
description: 益红7条触发场景×韩杰原子能力清单核对结果：端状态8/8有/事件缺途经点变更tri_passbyPoint/找韩杰3件事/益红表2漏洞
metadata: 
  node_type: memory
  type: project
  originSessionId: b9f9683a-8a8a-435b-9c62-8085d5212032
---

2026-07-23 核对完成（产物：`2-AI产出-最新/7.23-益红场景×韩杰原子能力-核对与填写指南-v2.html`，8条场景版）。

益红给泽民 8 条触发场景（低电量/到达目的地1000米/发起导航/目的地变更/途经点变更/多人入座/下电清子目标/开充电口盖），韩杰给《火山引擎_原子能力清单.xlsx》（状态查询112行/条件34/触发事件38/动作9）。

**核对结论**：
- 端状态 9 个原料全有出处（电量=rangeState.percentage_ev、距离=destLocState.distance、导航=navState、途经点=passbyPointState、占座=seatOccupancyStatus、档位=VehDriveState、上下电=vehiclePowerStatus、充电口盖="车身_充电口盖状态"挂在 vehiclePowerStatus 的 sls 清单里）
- 积木缺 2：①**途经点变更没有触发事件** → 新增 tri_passbyPoint；②**充电口盖状态没上架**（原料有、无独立状态参数/条件）→ 加 chargePortCoverState + con_chargePortCover
- 数据源缺 1：**AI主动服务开关不在韩杰表**（非车端信号，问益红/任务中心确认存在哪、引擎能否读到）
- 动作：提示类用 生成事件/Advisor/主动服务卡 全覆盖；"点按钮直开充电口盖"的车控执行待确认（或加 act_chargePortCover）
- 场景8"看后视有没有充电桩"= 舱外 VLM 任务（走泽民 VLM 条件任务链路），后视识别充电桩可行性找丁彬/西钺
- 频次策略不在韩杰表 = 规则层属性，归泽民触发器侧

**找韩杰 4+1**：①加 tri_passbyPoint ②充电口盖状态上架（chargePortCoverState + con_chargePortCover）③条件表29行"电量"补 con_battery（场景1用≤0.2、场景8用≤0.19，且"速度：[0-1]"是笔误）④确认 tri_seatOccupancy 位置是否多选 ⑤钉 tri_navigation 与 tri_destination 互斥。

**益红表 2 漏洞 + 1 确认**：①低电量场景条件漏"导航状态=未发起导航" ②多人出游漏"多人"判断（con_occupancy 副驾/二排有人）③场景8的"AI主动服务=开启"开关数据源确认。

**口径转换**：电量20%→0.2（0-1制）；1000米→地理围栏填1（km）；档位"等于P"→类型"是"；左后/右后→二排左/二排右；事件层不写"变更为"（积木已封装）。

相关：[[reference_trigger_operators]]、[[project_710_signal_hub_review]]
