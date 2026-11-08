# Cockpit learning site Implementation Plan

> **For agentic workers:** Execute the independent tasks with the available collaboration tools; the optional superpowers execution skills are not installed. Preserve ownership and review each artifact against the specification.

**Goal:** Build the complete local, navigable cockpit business learning website requested by the user, including detailed Memory, events, event logs and self-evolution.

**Architecture:** Retain the v15 source-backed graph as the detailed reference layer. Add article-style module pages, linked mechanisms, case walkthroughs and a connected overview. Embed all assets and data into versioned local HTML without external requests.

**Tech Stack:** Buildless HTML/CSS/JavaScript, SVG, Node build and offline DOM tests.

**Spec:** `/Users/bytedance/Desktop/3.23/产品/codex/座舱业务学习站/spec.md`

## Global Constraints

- Internal material remains local; preserve old HTML and raw sources.
- Do not equate search hits, fetched bodies, reviewed text, inspected boards, published features and real execution.
- User-requested end state is all-module website, not another source inventory or diagram-only patch.
- Previous turn classification: progress — v15 authoritative output and verified local tests exist, but website objective is not yet achieved.

## Task 1: Source-backed deep chapters

Files: content/memory-events.json and content/evolution.json under the site directory. Interfaces: Page/Source in spec. Search Feishu for missing material, read originals and meeting transcripts, reuse reviewed local sources. Test each source id resolves and each page has real flows, cases, explanation, boundaries and next steps. Root reviews claims against primary files before merging.

## Task 2: Reader application

Files: app.js, styles.css, shell.html.template. Consumes DATA from spec; produces route-based local pages. Implement home, grouped module navigation, full flow, article tabs, searchable tools, clickable nodes, sources, local study notes/export and mobile navigation. Use semantic links, buttons and focus behavior. Root exercises every route and interaction with JSDOM and the supported browser if available.

## Task 3: Complete module coverage and diagrams

Files: content/core.json, diagrams.mjs, build.mjs, diagram-plan.md. Derive every existing module's handoff from v15 graph; add substantive teaching context and boundaries. Generate a connected overview and focused phase diagrams with linked explanations. Build output under 产品/codex/HTML/01-进行中 using a new version name. Original v15 remains unchanged.

## Task 4: Verify and hand off

Files: validate.mjs, completion-audit.json, delivery record. Run `node validate.mjs` after each build; test all routes, graph endpoints, source ids, substantive coverage, search and persistence. Render and inspect new diagrams. Inspect actual browser where allowed; do not bypass prior browser policy denial. Resolve failures, then publish only to local 已交付 directory with exclusive copy. Keep goal active if any explicit requirement lacks direct evidence.
