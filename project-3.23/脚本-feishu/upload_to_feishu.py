#!/usr/bin/env python3
"""
Upload local wiki markdown files to Feishu as docx wiki nodes.
Uses lark-cli docs +create with --markdown for full format support.

Usage:
    python3 upload_to_feishu.py <parent_node_token> <markdown_file_or_dir> [title_override]

Example:
    python3 upload_to_feishu.py CGZqwzyTliv4ktktSEvcQAF7nbg wiki/
"""

import json
import os
import re
import subprocess
import sys
import time
from pathlib import Path


def extract_frontmatter_and_body(text: str):
    """Remove YAML frontmatter and return (title, body)."""
    title = None
    if text.startswith("---"):
        parts = text.split("---", 2)
        if len(parts) >= 3:
            fm = parts[1]
            m = re.search(r"^title:\s*(.+)$", fm, re.M)
            if m:
                title = m.group(1).strip()
            body = parts[2].lstrip("\n")
            return title, body
    return None, text


def clean_wiki_links(text: str):
    """Convert [[name]] wiki links to plain text name."""
    return re.sub(r"\[\[([^\]]+)\]\]", r"\1", text)


def upload_file(parent_token: str, file_path: str, title_override: str = None):
    """Upload a single markdown file to Feishu wiki."""
    path = Path(file_path)
    content = path.read_text(encoding="utf-8")

    fm_title, body = extract_frontmatter_and_body(content)
    body = clean_wiki_links(body)

    if title_override:
        title = title_override
    elif fm_title:
        title = fm_title
    else:
        title = path.stem

    # Ensure unique title by prefixing directory if needed
    try:
        rel = path.relative_to(Path.cwd() / "wiki")
    except ValueError:
        rel = path
    if rel.parent.name and rel.parent.name != ".":
        display_title = f"[{rel.parent.name}] {title}"
    else:
        display_title = title

    print(f"Uploading: {rel} -> '{display_title}'")

    # Write cleaned markdown to a temp file in current dir for lark-cli
    tmp_name = f".tmp_upload_{path.stem}.md"
    tmp_path = Path(tmp_name)
    tmp_path.write_text(body, encoding="utf-8")

    try:
        cmd = [
            "lark-cli", "docs", "+create",
            "--wiki-node", parent_token,
            "--title", display_title,
            "--markdown", f"@{tmp_name}",
            "--as", "user",
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        try:
            resp = json.loads(result.stdout)
        except json.JSONDecodeError:
            print(f"  stdout: {result.stdout}")
            print(f"  stderr: {result.stderr}")
            raise RuntimeError(f"lark-cli failed: {result.stderr}")

        if not resp.get("ok", False):
            raise RuntimeError(f"API error: {resp.get('error', resp)}")

        doc_id = resp["data"]["doc_id"]
        doc_url = resp["data"]["doc_url"]
        print(f"  Created: {doc_id}")
        return doc_id, doc_url
    finally:
        if tmp_path.exists():
            tmp_path.unlink()


def upload_directory(parent_token: str, dir_path: str):
    """Upload all .md files in a directory tree."""
    base = Path(dir_path)
    files = sorted(base.rglob("*.md"))
    print(f"Found {len(files)} markdown files in {dir_path}")
    results = []
    for f in files:
        try:
            doc_id, doc_url = upload_file(parent_token, str(f))
            results.append({"file": str(f), "doc_id": doc_id, "doc_url": doc_url, "status": "ok"})
            time.sleep(0.5)
        except Exception as e:
            print(f"  ERROR uploading {f}: {e}")
            results.append({"file": str(f), "error": str(e), "status": "error"})
            time.sleep(0.5)
    return results


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)

    parent_token = sys.argv[1]
    target = sys.argv[2]
    title_override = sys.argv[3] if len(sys.argv) > 3 else None

    if os.path.isdir(target):
        results = upload_directory(parent_token, target)
    else:
        doc_id, doc_url = upload_file(parent_token, target, title_override)
        results = [{"file": target, "doc_id": doc_id, "doc_url": doc_url, "status": "ok"}]

    result_file = "upload_results.json"
    with open(result_file, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print(f"\nResults saved to {result_file}")

    ok_count = sum(1 for r in results if r.get("status") == "ok")
    err_count = len(results) - ok_count
    print(f"Summary: {ok_count} succeeded, {err_count} failed")


if __name__ == "__main__":
    main()
