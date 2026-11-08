# 专家知识与自学习增量取证

本轮不以旧生成学习站作为一手依据。用户提供的 9 月 9 日链接是 AI 纪要，已追到对应逐字稿，并结合原规划文档与动态知识检索需求解释实际信息交接。

## 内容定位

- `evolution-transcript.md`：完整取得逐字稿。00:05:54–00:13:47 回顾知识质量、检索与长步骤问题；00:13:47–00:38:20 讨论标准、点状与长时场景知识、使用模块；00:38:20–00:50:57 讨论口述调教与知识模板；00:50:57–01:01:30 明确动态 Advisor 验证前置、信号底座、自学习范围仍需专题对齐。
- `evolution-expert-plan.md`：完整取得规划正文。首节明确当时知识质量与使用问题，第三/四节为知识形态、模块承载和分月计划，不能视为全上线。
- `evolution-knowledge-retrieval.md`：完整取得需求正文。开头输入/输出定义与“二、知识的使用”支持 Query/Context → 知识编号增删 → 正文拼接 → knowledge 注入。长 Prompt 示例仅作该文档设计样例，不当实车效果。
- `evolution-dt-talk.md`：完整取得 10 月 22 日宣讲逐字稿。自学习仍用期望/构建能力的表述，成长性讨论是评测目标，不是上线证明。最后的 Context 问答明确前置记忆检索和显式工具查询两种方式。
- `evolution-expert-knowhow.json`：表格工具返回截断。未据此声称全表已读，也未将表内未具备条件的场景当真实能力。
- `evolution-self-learning.json`：读取成功但正文只有标题，不构成实现说明。
- `evolution-evolution-progress.json`：内容为 Argos/SRE，自汽车体系排除；临时登录参数已遮蔽。

## 搜索范围

三组工具返回 full pagination/scan_complete：自学习 reported 593、去重 580；专家知识 reported 609、去重 608；Reflector reported 582、去重 581。各集合重叠且混有大量其他业务，不能加总成汽车文档或已读文档数。完整清单保存在 `evolution-search-{self,expert,reflector}.json`，主题粗筛清单在 `evolution-filtered-*.json`。关键词筛选不是目标知识库树的完整枚举。

## 交付

`content/evolution-deepening-20261028.json` 提供 10 课、37 段连续讲解和 2 张图、15 个节点。新增段落不覆盖原 v23 的 24 模块/291 节点体系；两图延用现有 flow schema。sourceIds 与图几何校验无错误。

生成文字将“当场纠错 / 保存以后规则 / 下次检索使用”分开；将记忆、动态示例、专家知识和个人技能分开；把长时 Advisor 和口述调教明确放在当时设计范围里。没有重建未知的 Reflector 全链，也没有断言每次纠正会自动训练或发布。
