# impact_N3 — 简单复杂仲裁 / 输入管理 / DT 打断信息价值判断：资料有、副本可能缺的点

来源：d03 Director PRD v1.7、d07 座舱Planner探索、t20 S2S接入方案、d11 Director优化计划。

## 1. 离线 FC 模型+白名单 vs 云端拒识（最新仲裁口径）
- 离线 fc 模型对简单高频车控召回；命中白名单 → 优先端侧结果快速执行；未命中白名单 → 优先云端；云端超时无结果时，端上有结果用端上结果，端上无结果兜底；云端处理=未拒识或拒识超时时交给 Director 处理。
- 来源：https://bytedance.larkoffice.com/wiki/XRuKwJ0VPisdUhkxH0ecY1rRn9g【已确认 PRD，上汽 DNA】

## 2. 句法 RAG + 情景 RAG + Planner 混合仲裁（d07）
- 层层过滤：简单方法能处理的不漏到复杂模型；不同阶段选合适节点注入知识（从固定到泛化）；句法 RAG 可车厂配置、回流链路数据；Planner 前期当 teacher 收集数据回流。
- 来源：https://bytedance.larkoffice.com/wiki/K8Ihw3a4niaDNck7FEkcDXcOnfb【已确认设计】

## 3. DT 打断恢复的信息价值判断四规则（最新口径，DT 不展开）
- ① 信息价值判断：未说完只剩 1-3 个无关紧要字/纯粹语气词，或用户表现不想继续听 → 直接跳过不补；含实质信息（科普/新闻/天气/操作说明）→ 继续完成关键播报。
- ② 话题合并：新 query 与被打断话题相关 → 新旧合并成一个回答，不说"刚才被打断了我接着说"。
- ③ 长内容提炼：未说完 ≥3 句 → 续接只提炼核心（评分/距离/结论），并补上说话人称呼（"明骏你刚才让我讲的……"）。
- ④ 独立事件：剩余仅为执行结果确认（空调打开了一会儿就凉快了）→ 直接跳过不补。
- 打断信息返回 DT，由 DT 判断后续是否交互；v1.7 已补"emoji 打断恢复验收标准分场景细化"。
- 来源：d03【已确认 PRD】

## 4. RTC/文本链路的并行后仲裁（t20）
- RTC 建联后文本链路并行做后仲裁，直到 Planner 识别执行类指令 → 立刻断联切文本链路。
- 来源：https://bytedance.larkoffice.com/wiki/OngswPv99iudfekGoQycI18QnMd【已确认方案】

## 5. 输入管理：三类 SP 分化（d11）
- 主线基模 SP（PRD 一般要求+特殊演示场景+上下文+能力约束）、数据生成 SP（不考虑延迟、更丰富）、SFT SP（更精简、支持车型/项目差异配置）；上汽/赛力斯直接用对应 SP，东风/奥迪对齐中。
- 来源：https://bytedance.larkoffice.com/wiki/B1zHwD9Gmi2czGkunfocuzBenwd【计划口径】
