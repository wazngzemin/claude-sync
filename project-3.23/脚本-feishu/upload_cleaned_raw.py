#!/usr/bin/env python3
"""Upload cleaned raw documents to Feishu."""
import json, subprocess, sys, time
from pathlib import Path

def upload(parent_token: str, file_path: str):
    path = Path(file_path)
    title = f"[原始] {path.stem.replace('.cleaned', '')}"
    cmd = [
        "lark-cli", "docs", "+create",
        "--wiki-node", parent_token,
        "--title", title,
        "--markdown", f"@{path.name}",
        "--as", "user",
    ]
    r = subprocess.run(cmd, capture_output=True, text=True, cwd=str(path.parent))
    if not r.stdout.strip():
        print(f"  FAIL {path.name}: empty stdout, stderr={r.stderr.strip()}")
        return None
    try:
        resp = json.loads(r.stdout)
    except json.JSONDecodeError as e:
        print(f"  FAIL {path.name}: JSON error {e}")
        return None
    if not resp.get("ok"):
        print(f"  FAIL {path.name}: API error {resp.get('error', resp)}")
        return None
    print(f"  OK: {title}")
    return resp["data"]["doc_id"]

base = Path("raw_cleaned")
files = sorted(base.glob("*.md"))
print(f"Uploading {len(files)} cleaned raw files...")
parent = sys.argv[1] if len(sys.argv) > 1 else "CGZqwzyTliv4ktktSEvcQAF7nbg"
for f in files:
    upload(parent, str(f))
    time.sleep(0.5)
