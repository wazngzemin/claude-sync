#!/usr/bin/env python3
"""Validate an article-forker output directory."""
import json
import sys
from pathlib import Path


REQUIRED = ["source.md", "concept.md", "tool.html", "metadata.json"]
SKILL_DIR_FRAGMENT = "/.claude/skills/article-forker/forks/"
MIN_SOURCE_CHARS = 3500
MIN_CONCEPT_CHARS = 4500
MIN_TOOL_CHARS = 8000


def fail(msg):
    print(f"FAIL: {msg}")
    return 1


def main():
    if len(sys.argv) != 2:
        return fail("usage: validate_fork.py <fork-dir>")

    fork_dir = Path(sys.argv[1])
    if not fork_dir.exists() or not fork_dir.is_dir():
        return fail(f"not a directory: {fork_dir}")

    fork_dir_str = str(fork_dir.resolve())
    if SKILL_DIR_FRAGMENT in fork_dir_str:
        return fail("output is inside the installed skill directory; save forks to the user's article-forker project instead")

    missing = [name for name in REQUIRED if not (fork_dir / name).exists()]
    if missing:
        return fail("missing files: " + ", ".join(missing))

    source = (fork_dir / "source.md").read_text(encoding="utf-8")
    concept = (fork_dir / "concept.md").read_text(encoding="utf-8")
    tool = (fork_dir / "tool.html").read_text(encoding="utf-8")

    checks = [
        (f"source.md too short for a high-value fork (<{MIN_SOURCE_CHARS} chars)", len(source.strip()) >= MIN_SOURCE_CHARS),
        (f"concept.md too short for a high-value fork (<{MIN_CONCEPT_CHARS} chars)", len(concept.strip()) >= MIN_CONCEPT_CHARS),
        (f"tool.html too short to be a meaningful standalone tool (<{MIN_TOOL_CHARS} chars)", len(tool.strip()) >= MIN_TOOL_CHARS),
        ("source.md should include argument chain", "论证链" in source),
        ("source.md should include hidden assumptions", "隐含假设" in source),
        ("source.md should include boundaries", "边界" in source),
        ("source.md should include source anchors", any(k in source for k in ["原文定位", "原文关键句", "original_hint"])),
        ("source.md should include misread/failure awareness", any(k in source for k in ["误读", "最容易", "破绽", "边界", "反例"])),
        ("concept.md should include SOP/checklist/prompt", any(k in concept for k in ["SOP", "检查清单", "Prompt", "模板"])),
        ("concept.md should include evaluation signals", any(k in concept for k in ["判断标准", "检查点", "衡量指标", "成功信号", "失败信号"])),
        ("concept.md should include failure modes or common mistakes", any(k in concept for k in ["常见错误", "失败模式", "风险", "边界", "不适用"])),
        ("tool.html should be a complete HTML file", "<html" in tool.lower() and "</html>" in tool.lower()),
        ("tool.html should not depend on CDN", "cdn." not in tool.lower()),
        ("tool.html should include runnable interaction", any(k in tool for k in ["copy", "复制", "score", "评分", "诊断", "checklist", "自测", "worksheet", "textarea", "input"])),
    ]
    failed = [name for name, ok in checks if not ok]
    if failed:
        return fail("; ".join(failed))

    try:
        meta = json.loads((fork_dir / "metadata.json").read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        return fail(f"metadata.json invalid JSON: {exc}")

    for key in ["article_title", "fork_date", "article_type", "category", "fork_outputs"]:
        if key not in meta:
            return fail(f"metadata.json missing key: {key}")

    feishu = meta.get("feishu", {})
    legacy_top = any(k in meta for k in ["source_doc_id", "source_url", "concept_doc_id", "concept_url"])
    legacy_nested = isinstance(feishu, dict) and any(k in feishu for k in ["source_doc_id", "source_url", "concept_doc_id", "concept_url"])
    if legacy_top or legacy_nested:
        if not (isinstance(feishu, dict) and feishu.get("primary_doc_id") and feishu.get("primary_url")):
            return fail("metadata uses legacy Source/Concept Feishu fields without primary_doc_id/primary_url; default workflow must create one primary Feishu document")
    if isinstance(feishu, dict) and feishu.get("primary_doc_id") and not feishu.get("tool_inserted"):
        return fail("primary Feishu doc exists but tool_inserted is not true")

    print(f"PASS: {fork_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
