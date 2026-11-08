#!/usr/bin/env python3
"""Push the first Codex snapshot in GitHub-safe batches.

GitHub rejects a single push over 2 GiB.  This helper keeps the working tree
unchanged, creates deterministic commits of at most 900 MiB of files, and
pushes each commit before creating the next one.
"""

from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path


REPO = Path(sys.argv[1] if len(sys.argv) > 1 else "/Users/bytedance/.codex-sync").expanduser()


def batch_limit() -> int:
    value = os.environ.get("CODEX_SYNC_BATCH_MIB", "256")
    for arg in sys.argv[2:]:
        if arg.startswith("--batch-mib="):
            value = arg.split("=", 1)[1]
    try:
        mib = max(32, int(value))
    except ValueError:
        mib = 256
    return mib * 1024 * 1024


BATCH_LIMIT = batch_limit()


def run(args: list[str], *, input_bytes: bytes | None = None) -> subprocess.CompletedProcess[bytes]:
    print("$", " ".join(args), flush=True)
    return subprocess.run(args, cwd=REPO, input=input_bytes, check=False)


def changed_files() -> list[str]:
    result = subprocess.run(
        ["git", "status", "--porcelain=v1", "-z", "--untracked-files=all"],
        cwd=REPO,
        stdout=subprocess.PIPE,
        check=True,
    )
    paths: set[str] = set()
    for record in result.stdout.decode("utf-8", "surrogateescape").split("\0"):
        if not record:
            continue
        # Porcelain v1 uses two status bytes followed by a space.  Renames
        # have an extra old path; this snapshot contains no renames, but keep
        # the final path if one ever appears.
        paths.add(record[3:] if len(record) > 3 else record)
    return sorted(paths)


def path_size(path: str) -> int:
    target = REPO / path
    if target.is_file():
        return target.stat().st_size
    return 0


def batches(paths: list[str]) -> list[list[str]]:
    result: list[list[str]] = []
    current: list[str] = []
    current_size = 0
    for path in paths:
        size = path_size(path)
        if current and current_size + size > BATCH_LIMIT:
            result.append(current)
            current = []
            current_size = 0
        current.append(path)
        current_size += size
    if current:
        result.append(current)
    return result


def main() -> int:
    if not (REPO / ".git").is_dir():
        print(f"not a git repository: {REPO}", file=sys.stderr)
        return 1
    paths = changed_files()
    if not paths:
        print("working tree is clean")
        return 0
    groups = batches(paths)
    print(f"{len(paths)} changed files in {len(groups)} GitHub-safe batches", flush=True)
    if "--plan" in sys.argv[2:]:
        for index, group in enumerate(groups, 1):
            print(f"batch {index}: {len(group)} files, {sum(path_size(p) for p in group) / 1024 / 1024:.1f} MiB")
        return 0

    for index, group in enumerate(groups, 1):
        # Keep only this batch staged.  This resets the index, not the working
        # tree; all snapshot files remain on disk.
        reset = run(["git", "reset"])
        if reset.returncode:
            return reset.returncode
        payload = "\0".join(group).encode("utf-8", "surrogateescape") + b"\0"
        add = run(["git", "add", "-A", "--pathspec-from-file=-", "--pathspec-file-nul"], input_bytes=payload)
        if add.returncode:
            return add.returncode
        commit = run(["git", "commit", "-m", f"codex snapshot batch {index}/{len(groups)}"])
        if commit.returncode:
            return commit.returncode
        push = run(["git", "push", "-u", "origin", "main"])
        if push.returncode:
            print(f"batch {index} was committed locally but not pushed", file=sys.stderr)
            return push.returncode
        print(f"[ok] pushed batch {index}/{len(groups)}", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
