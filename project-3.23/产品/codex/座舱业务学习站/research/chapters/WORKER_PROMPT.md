你负责为“豆包汽车业务学习站”重写 {ID} 章（{TITLE}：{SCOPE}）。

必须先完整阅读并严格遵守写作规范：/Users/bytedance/Desktop/3.23/产品/codex/座舱业务学习站/research/chapters/SPEC.md 。标杆是 V 章（research/v-lesson-20261106/content_v39.py、diagrams.py、svgkit.py），写之前通读。research/chapters/ 下已完成的 R、M、C、D 章（content.py、diagrams.py、notes.md、review.md、selfcheck.md）是通过审核的同级样例，参考结构和写法，并读它们的 review.md 避免同类错误（常见错：引号内非原话、开发中/讨论中写成已上线、端云和上汽/赛力斯不分、AI 纪要当证据、图文数字不一致、与相邻章口径冲突）。旧版本章内容在 research/chapters/{ID}/old-page.json（只作线索，不作证据）。与相邻章（{NEIGHBORS}）的事实和叫法必须一致，读它们已有的 content.py；发现冲突在 notes.md 里列出。

研究要求：按 SPEC 第三节查全飞书原文（PRD、技术方案、OnePager、评测、badcase、周报/双周报、会议文字记录逐字稿、群聊），重点 2026 年 8 月以后的最新版本。全程只读，绝不发消息或做写操作。lark-cli 每条命令前 export LARK_CLI_NO_PROXY=1；也可用 ToolSearch 加载 select:mcp__feishu-readonly__feishu_search_documents,mcp__feishu-readonly__feishu_read_link,mcp__feishu-readonly__feishu_search_minutes,mcp__feishu-readonly__feishu_search_messages 。读到的原文副本存到 research/chapters/{ID}/raw/。读不到的记录为缺口，不能编。

产出放在 research/chapters/{ID}/ ：notes.md、content.py（INTRO、SECTIONS，id 前缀 {id}-）、diagrams.py → diagrams.json + svg/ + png/（用 rsvg-convert 渲染 PNG 逐张自查压字/穿线/溢出）、selfcheck.md。完成后验证：python3 能 import content.py，所有 <!--fig:key|...--> 的 key 都在 diagrams.json 里。不要修改其他章节目录和 HTML 文件。最后简要汇报：章节结构、图清单、关键事实与出处、与旧版/相邻章冲突、缺口。

## 2026-11-11 追加（必须遵守）
- 细度标杆已提高：按 SPEC.md 第五节“详细程度标杆”写。最新样板是 V 章 v47：research/v-lesson-20261106/s2_v45.py（第二段）和 s_v46.py（第一、三、四、五段）。每讲一个机制都要：先说它不是什么、和谁易混；用同一个例子在不同时刻的状态讲过程；说清输入实际有什么、没有什么；模型讲到读什么、输出什么、样本、数据、标注、训练、评测、版本数字、短板；对比用表格；每段结尾有“把这一段串起来”和“交给下一步”。
- 先读 research/v-lesson-20261106/review-v46.md，里面是 V 章被查出的 12 类典型错误（把个人看法写成会议结论、把被质疑的反馈当定论、口径和分母自己拼、引号里加字、测试集来源当训练数据来源、状态过期、没分项目等），本章不得再犯。
- 本章目录下如果已有 raw/、notes.md 或其他半成品，是上一次中断留下的，先读它们接着做，不要重复抓取；发现半成品有错直接改。
- 引用别的章节时，V 章口径以 v47 源码为准（如：车上判的拒识只在断网、云端超时、全时聆听未上云时生效；人数是模型外的规则；人人对话只在赛力斯，是否已发版待确认）。
