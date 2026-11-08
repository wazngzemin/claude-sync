# 本轮补充阅读范围与交付

本轮交付沿用 v14 的页面和全景图，以 v23 为直接基线，生成 v25。24 个模块、291 个原图节点、46 项工具入口、4 条完整场景保留；新增 19 节讲解、6 张细节图，修正 1 张原图，扩写 4 节原课。24 条补丁课程包含 1 节原样保留的跨端课。

## 指定资料

- 用户的记忆链接是 2026-08-19 产品需求内审逐字稿，接口返回截断；本轮使用取得的记忆相关时段，并结合正式记忆系统、记忆 OnePage、画像算法、POI 同步及测试方案核对。
- 用户的自进化链接是 2026-09-09 AI 纪要，已继续阅读全文逐字稿 V85Udy3G5oQLnHxw3Mqc6LZEnHe，结合当日规划、动态知识检索需求和 10 月 22 日 DT 宣讲。没有把 AI 摘要独立用作会议结论。

## 知识库目录与全量边界

浏览器实际打开 space/7554961122303098899，落到「AI Car 主线 wiki」首页 AJBjwSgcXioim4koQOjc4GQ5nld。核对路径：产品 → 功能详述 → 主链路（基础语音、多人拒识、Context、任务拆解、回复、端侧模型、HMI、Agent 执行）；能力中台 → 身份识别、端状态、记忆、事件、知识。

记忆目录 AoFXwgHEdio7bUko6jIc4xznn3c 下三项逐一定位：旧 A 项目 PRD GIEpwy5boiTHnHks3QTcUMvQnAd，AI 汽车记忆方案 PdbRw6JTlisStKkRbXGczIWBnof，记忆清单 DSJkwJoxQiV4nCklGqkcbYbhnEg。前两篇正文返回成功，清单为部分表格；浏览器可见人物小传和个人 knowhow 页签标注草稿。

专项搜索覆盖记忆、自学习、专家知识、Reflector、Context、动态 Advisor、TaskService、事件日志。多组搜索完整翻页，但全局关键词结果包含其他业务，不能累加成目标空间总数或已读篇数。历史「1047 节点完整层级」入口本次返回截断，不能证明当前全树已枚举。**指定知识库所有文档全文仍未完成读取**；已读正文、表格截断、空文档和失败项分开保留。

正文来源清单如下。success 指该次接口返回的正文成功，不代表其中所有画板、附件、表格均已核验；源文档中的需求和讨论也不等于全车型上线。仅有标题的《自学习》未作为实现依据，Argos/SRE《自进化进展》已排除。

| 文档 | 读取状态 | 原始返回 |
|---|---|---|
| [事件生产与使用迭代-技术方案](https://bytedance.larkoffice.com/wiki/SiedwOaRPiNhHpkLXjucucUgnBc) | success | [library-read-event-tech.json](library-read-event-tech.json) |
| [动态 Advisor One-pager](https://bytedance.larkoffice.com/wiki/VvAMwHbxei6BSEkzoxjc9AbynNh) | success | [library-read-advisor.json](library-read-advisor.json) |
| [动态知识检索&amp;使用 需求说明](https://bytedance.larkoffice.com/wiki/EZ0PwsuFjiCg85kJqu8cmQRinLb) | success | [evolution-knowledge-retrieval.json](evolution-knowledge-retrieval.json) |
| [事件日志产品需求文档 ](https://bytedance.larkoffice.com/wiki/Gt9qwfzlHiIKLgkWKCfcqYsYngg) | success | [library-read-events.json](library-read-events.json) |
| [公共Context管理-豆包 【AI car 1.0】](https://bytedance.larkoffice.com/wiki/Ip1kwhsLhioyegkuf9bcIUspnpb) | success | [library-read-context-prd.json](library-read-context-prd.json) |
| [记忆模块 - PRD【A项目】](https://bytedance.larkoffice.com/wiki/GIEpwy5boiTHnHks3QTcUMvQnAd) | success | [memory-aprd.json](memory-aprd.json) |
| [文字记录：专家知识-现状及计划讨论 2026年9月9日](https://bytedance.larkoffice.com/docx/V85Udy3G5oQLnHxw3Mqc6LZEnHe) | success | [evolution-transcript.json](evolution-transcript.json) |
| [语义记忆画像算法方案](https://bytedance.larkoffice.com/docx/PdfEdR6Mzo77xvx6MpIcbyfWn4e) | success | [memory-profile.json](memory-profile.json) |
| [记忆系统](https://bytedance.larkoffice.com/wiki/CbJVw4ACzilvvBkRxkqcQVfAnLh) | success | [memory-read-0.json](memory-read-0.json) |
| [自学习](https://bytedance.larkoffice.com/wiki/Go50wbE5xiYK6qkvOZ5cTix4nSc) | success | [evolution-self-learning.json](evolution-self-learning.json) |
| [memory-list1219](https://bytedance.larkoffice.com/wiki/DSJkwJoxQiV4nCklGqkcbYbhnEg) | partial / 截断 | [memory-list1219.json](memory-list1219.json) |
| [记忆和车机POI同步方案](https://bytedance.larkoffice.com/wiki/N2uLwZYAgisDSakvYx4ckplTnvh) | success | [memory-read-1.json](memory-read-1.json) |
| [AiCar-汽车记忆测试方案](https://bytedance.larkoffice.com/wiki/MwYEwrYOMi5mfRkwqZHc1MyIn1e) | success | [memory-test.json](memory-test.json) |
| [Task Service One-pager](https://bytedance.larkoffice.com/wiki/A60Zwzy9eiiCtwkY8k2c0LKKnoc) | success | [library-read-task.json](library-read-task.json) |
| [专家知识-现状及后续规划思路讨论](https://bytedance.larkoffice.com/wiki/JduBwPusEi2Ai0kf7uKc1WXDnBf) | success | [evolution-expert-plan.json](evolution-expert-plan.json) |
| [Context OnePage](https://bytedance.larkoffice.com/wiki/OjGMwBX8fiLS0ikDWqVceVjhnPg) | success | [library-read-context.json](library-read-context.json) |
| memory-score | failed | [memory-score.json](memory-score.json) |
| [evolution-expert-knowhow](https://bytedance.larkoffice.com/wiki/Ew67wKzi3ihf8WkpwsTcFAO9ncd) | partial / 截断 | [evolution-expert-knowhow.json](evolution-expert-knowhow.json) |
| [记忆 OnePage](https://bytedance.larkoffice.com/wiki/KAAMwb7vsiHpd0k7PVPctGfKnHf) | success | [memory-read-2.json](memory-read-2.json) |
| [记忆模块-产品内同步](https://bytedance.larkoffice.com/wiki/CWhuwbJ9giyTYpk6G6Cch5lGnLb) | success | [memory-read-3.json](memory-read-3.json) |
| memory-tags | failed | [memory-tags.json](memory-tags.json) |
| [AI汽车记忆方案](https://bytedance.larkoffice.com/wiki/PdbRw6JTlisStKkRbXGczIWBnof) | success | [memory-read-4.json](memory-read-4.json) |
| [library-read-tree](https://bytedance.larkoffice.com/docx/LjU2dK8c5oYdMPx3knwcHimqnVc) | partial / 截断 | [library-read-tree.json](library-read-tree.json) |
| library-read-context-model | failed | [library-read-context-model.json](library-read-context-model.json) |
| [事件(event)触发新一轮query技术方案](https://bytedance.larkoffice.com/docx/OcTWdh3teo9SSOxjZlXcfDKEnfb) | success | [library-read-event-query.json](library-read-event-query.json) |
| [文字记录：AI汽车-产品宣讲3-DT 2026年10月22日](https://bytedance.larkoffice.com/docx/Is0mdygy3oQmEixHRUNcolvXnRb) | success | [evolution-dt-talk.json](evolution-dt-talk.json) |
| [【PRD】AI汽车1.0 - 记忆模块需求](https://bytedance.larkoffice.com/docx/Mu9IdaiavogII9xwtZAceaQ2ncf) | success | [memory-read-5.json](memory-read-5.json) |
| memory-rename | failed | [memory-rename.json](memory-rename.json) |
| [端状态&amp;事件日志上报 One Page](https://bytedance.larkoffice.com/wiki/PRf0wRd3Uic0omkiiiGc70wanQN) | success | [library-read-signals.json](library-read-signals.json) |

## 检查结果

982 项离线检查通过：原节点位置与连线、模块/节点/工具/场景路由、课程保留、来源 ID、细节图端点及图下带读。7 张新增或修正 SVG 已渲染，抽查 POI 同步、知识加载、Context 回流的局部预览。整页浏览器视觉验收尚未完成，未绕过此前本地文件浏览限制。
