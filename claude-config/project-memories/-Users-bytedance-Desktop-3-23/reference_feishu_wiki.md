---
name: Feishu wiki node tokens
description: Node tokens and doc IDs for the ai-car wiki space used by article-forker and llm-wiki-lark
type: reference
originSessionId: 0d96cc10-9fce-4d0f-8c95-1ca03c596277
---
Wiki: ai car
- space_id: 7630463641124342714
- root_token: CGZqwzyTliv4ktktSEvcQAF7nbg
- INDEX doc_id: K5ujdRblCoSzFWx4eGzcjKUTnWb
- LOG doc_id: GfGZd0zD8ojXUNxfy59cAJ1en3c

Node tokens (for creating child docs):
- raw/articles: K6XUwFE9miGZ5PkhXvgcX6XwnNf
- wiki/sources: ZwZZwv089iMuhCku9qwcCJgfn7c
- wiki/concepts: OawKwNIAhiUR3skninDcTFnCnKc

Previously created fork docs (2026-05-20 AI时代还要读书么):
- Raw: ZzxJdDfFEo3joFxeKssckDhHn7h
- Source: YHQjdTYdro5mqXx2uHlc290EnPf
- Concept: ZmFndLO9RoPoqexUJ6tcyumxnif

Published methodology docs:
- 2026-05-26 Planner 评测方法论 (对外分享): doc_id=ZO8QdCgFvo86zSxpdF9cj5dqnOb, url=feishu.cn/wiki/MlUEwNZY1ixd0Eka1sGcCd1LnFe, under wiki/concepts node

Push lessons:
- Lark docx 不支持任意 HTML — div/span/td/br/inline-style 等会被剥成纯文本(仍有警告但不阻塞)
- 流程图/架构图必须改用飞书画板 DSL,不能用 HTML
- 大文档(>20KB)应分段 append,单段建议 < 25KB 以避开 argv 长度风险
