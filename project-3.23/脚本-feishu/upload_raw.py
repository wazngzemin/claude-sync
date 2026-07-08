#!/usr/bin/env python3
"""Upload raw original documents to Feishu with [原始] prefix."""
import json, subprocess, sys, time, shlex
from pathlib import Path

def upload_raw_file(parent_token: str, file_path: str):
    path = Path(file_path)
    content = path.read_text(encoding="utf-8")
    title = f"[原始] {path.stem}"
    tmp = Path(f".tmp_raw_{path.stem}.md")
    tmp.write_text(content, encoding="utf-8")
    try:
        cmd = [
            "lark-cli", "docs", "+create",
            "--wiki-node", parent_token,
            "--title", title,
            "--markdown", f"@{tmp.name}",
            "--as", "user",
        ]
        r = subprocess.run(cmd, capture_output=True, text=True)
        if not r.stdout.strip():
            print(f"  FAIL {path.name}: empty stdout, stderr={r.stderr.strip()}")
            return None
        try:
            resp = json.loads(r.stdout)
        except json.JSONDecodeError as e:
            print(f"  FAIL {path.name}: JSON decode error: {e}, stdout={r.stdout[:200]}")
            return None
        if not resp.get("ok"):
            print(f"  FAIL {path.name}: API error: {resp.get('error', resp)}")
            return None
        print(f"  OK: {title}")
        return resp["data"]["doc_id"]
    finally:
        if tmp.exists():
            tmp.unlink()

base = Path("raw/articles/功能详述")
files = sorted(base.rglob("*.md"))
print(f"Uploading {len(files)} raw files...")
parent = sys.argv[1] if len(sys.argv) > 1 else "CGZqwzyTliv4ktktSEvcQAF7nbg"
for f in files:
    upload_raw_file(parent, str(f))
    time.sleep(0.5)
