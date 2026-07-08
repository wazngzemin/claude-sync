# Article Forker Quality Standard

This file captures the stronger standard that emerged from the 2026-05-27 article-forker session.

## Core Bar

The user rejected shallow summaries. A successful fork must help them deeply understand the article and reuse it in their own work.

Required qualities:

- Each logical section gets 3-5 sentences of independent analysis, not paraphrase.
- Each important claim includes hidden assumptions, boundaries, and possible failure cases.
- Planner/SP/Agent relevance is explicit and specific when applicable.
- Personalization must be evidence-bound: confirmed facts are okay; inferred transfer must be labeled; unknown project details must not be invented.
- The fork creates reusable assets: SOPs, checklists, prompts, diagnostics, comparison tables, or templates.
- Related prior forks are cross-linked when the new article extends the knowledge network.

## Anti-Garbage Bar

Reject and redo the fork when any of these are true:

- The output is mostly a generic template with the article's keywords swapped in.
- The concept page could apply equally to any AI article after changing the title.
- It names user-specific tools, counts, architecture, people, datasets, or product details not present in the provided source or verified local files.
- It explains "what the article says" but not why the argument works, where it is fragile, or how to test the transferred method.
- The HTML is only a decorated reading page and has no worksheet, prompt copier, scoring, diagnostic, decision aid, or other runnable interaction.
- The fork saves output into the installed skill folder (`~/.claude/skills/...`) instead of the user's article-forker project.

For high-value articles, the default target is not "concise"; it is "deep enough to reuse later". A short article can produce a short fork, but a method/framework article should normally yield a substantial `source.md` and `concept.md`.

## `source.md`

Purpose: expose the article's argument machinery.

Required structure:

- Title and one-sentence thesis.
- Article type and fork value judgment.
- 5-10 logical sections.
- For each section:
  - Original hint.
  - Argument function.
  - Core claim in 3-5 analytical sentences.
  - Hidden assumption.
  - Strong point or crack in the reasoning.
  - Direct relevance to the user's work, if applicable.
- Full argument chain in A -> B -> C form.
- Hidden assumptions list.
- Boundaries and counterexamples.
- Cross-fork connections when useful.

Depth requirements for high-value articles:

- Preserve 1-2 short source anchors per section (`original_hint` or quote-like phrase).
- Explain both local function ("what this section does here") and global function ("how it moves the whole argument").
- Include at least one "if this assumption is false..." consequence.
- Include a "misread warning" section when the article is easy to read into the wrong conclusion.

## `concept.md`

Purpose: turn the article into a reusable operating model.

Required structure:

- A title that names the transferred concept, not only the article.
- A precise mapping table from article scenario to the user's scenario.
- A small number of named principles or dimensions.
- Concrete methods:
  - SOP
  - checklist
  - scoring rubric
  - prompt template
  - review template
  - badcase diagnostic
- "60 vs 95" or "weak vs strong" contrasts when quality judgment matters.
- A final "how to know you are doing it" section with observable signals.

Personalization rules:

- Use the user's Planner/SP/Agent context only when it is provided or verified.
- If adapting without verified local details, write "在你的 Planner/SP 场景中，可以类比为..." rather than asserting exact facts.
- If exact traces/tool schemas/SP sections are required, add a "需要你补充的材料" block instead of inventing details.
- Every SOP should include inputs, steps, outputs, failure modes, and a way to evaluate whether it worked.

## `tool.html`

Purpose: make the concept runnable or inspectable.

Required qualities:

- Single HTML file with inline CSS, JS, and SVG.
- No CDN, API, external assets, or build step.
- Dark, clean visual system.
- Left navigation or clear module navigation for longer tools.
- Progress, quiz, scoring, copyable prompts, or interactive worksheets when useful.
- All Chinese UI text.
- Must be useful even if opened offline.

Not enough:

- A static article page with cards and charts.
- A navigation shell around the same text as `concept.md`.
- Pretty SVGs that do not help the user decide, diagnose, score, or execute.

At least one section should be runnable: a checklist, scorer, matrix, prompt builder, diagnostic form, or decision worksheet.

## Article Type Handling

- Method/framework: generate source, concept, tool.
- Case: extract reusable pattern first, then generate checklist or decision aid.
- Interview/transcript: split by concepts; preserve speaker-derived nuance.
- Opinion: generate source and concept only if it yields a reusable lens; create tool only when the lens can be operationalized.
- News/info: usually do not fork; summarize why it lacks reusable code unless the user insists.

## Quality Check Questions

- Could the user apply this to a real Planner/SP decision this week?
- Did we explain why the article is persuasive, not just what it says?
- Did we make the invisible assumptions visible?
- Is there at least one reusable prompt/checklist/SOP/rubric?
- Would the output still be useful three months later?
