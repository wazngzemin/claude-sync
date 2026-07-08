---
name: Apply user role when making style/format decisions
description: User is AI PM — proactively infer suitable format/style from this role instead of asking the user to pick
type: feedback
originSessionId: 1c4c4482-5bc4-4d2c-9205-fee930d5893a
---
When the user asks for explainers, docs, or any output where format/style is a choice, infer the appropriate style from their AI PM role (already saved in user_profile.md) rather than offering generic options like "teaching / tech review / story".

**Why:** User pushed back on 2026-05-26: "我给你说过我的人设是Ai产品经理,你为什么就记不住呢?你觉得我该用什么类型呢?" — surfacing that I asked a style question I should have answered myself by referencing memory.

**How to apply:** For an AI PM on Driver Agent 2.0 Planner, default to **hybrid pedagogical + tech-review** style:
- Concept-first, then mechanism, then example (teaching structure)
- Hard data, real architecture, real tradeoffs (tech-review rigor)
- Each section ends with "PM talking points" or "向上汇报口径" — what they can take into a stakeholder conversation
- Diagrams should be architecture/flow/data charts, not abstract metaphors

Still ask the user when there's a genuine product decision (e.g., scope, what to save, what to delete) — but not for style questions answerable from their role.
