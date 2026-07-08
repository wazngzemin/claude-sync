---
name: Fork workflow preferences
description: Every fork must have timestamp, update INDEX.md, be systematic not fragmented, include SVG logic diagrams
type: feedback
originSessionId: 0d96cc10-9fce-4d0f-8c95-1ca03c596277
---
Every article fork must include exact timestamp (YYYY-MM-DD HH:mm) in metadata.json.

**Why:** User frequently gives articles for analysis and needs to retrieve past forks by date/time. Also wants a chronological record of all forks.

**How to apply:**
- metadata.json must have `fork_time` field with exact time
- After every fork, append a row to `forks/INDEX.md` with date, title, category, outputs, local path, wiki links
- HTML tool outputs must use systematic module-based layout with SVG logic diagrams, not fragmented card layouts
- Every module needs: learning objective → core diagram → steps → checkpoint
