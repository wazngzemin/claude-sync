# SVG script checks

librsvg 2 / Pango / installed PingFang SC font geometry; no browser

| File | Nodes | Result |
|---|---:|---|
| figures/c2-preload-vs-query.svg | 6 | PASS |
| figures/c2-now-vs-history.svg | 4 | PASS |
| figures/c2-examples-knowledge.svg | 6 | PASS |
| figures/c2-prefix-cache.svg | 8 | PASS |
| figures-orig/c-overview.svg | 9 | PASS |
| figures-orig/c-input.svg | 9 | PASS |
| figures-orig/c-arch.svg | 8 | PASS |
| figures-orig/c-history.svg | 6 | PASS |

Exclusions: Only full-canvas background, <=26px legend swatches, and rectangles fully containing child rectangles are excluded from inferred business-node count. Every explicit data-node group must contain exactly one rectangle. Full rectangle containment is allowed, while partial rectangle intersection is rejected.

Limits: Checks the installed system font and current light style. Dark style shares geometry. Collision detection uses glyph bounding boxes; unmarked decorative paths are not interpreted as arrows. Unsupported transformed/curved arrow paths fail instead of silently passing.
