#!/usr/bin/env python3
"""fork-memo: fork an article into sharp memory cards + spaced review.

Usage:
  fork.py ingest <file>          # extract sharp cards from a file
  fork.py ingest -                # extract from stdin
  fork.py review                  # review cards due today
  fork.py list                    # list all cards
  fork.py stats                   # show counts
"""
import json
import os
import re
import subprocess
import sys
import uuid
from datetime import date, datetime, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PROMPT_PATH = ROOT / "prompts" / "extract.md"
MEMORY_PATH = ROOT / "data" / "memory.json"

# SM-2-lite intervals (days) — index advances on "good"
INTERVAL_LADDER = [1, 3, 7, 14, 30, 60, 120, 240]


def today() -> str:
    return date.today().isoformat()


def load_memory() -> dict:
    if not MEMORY_PATH.exists():
        return {"cards": []}
    return json.loads(MEMORY_PATH.read_text(encoding="utf-8"))


def save_memory(mem: dict) -> None:
    MEMORY_PATH.parent.mkdir(parents=True, exist_ok=True)
    MEMORY_PATH.write_text(
        json.dumps(mem, ensure_ascii=False, indent=2), encoding="utf-8"
    )


def call_claude(prompt: str) -> str:
    """One-shot Claude call via the Claude Code CLI."""
    result = subprocess.run(
        ["claude", "-p", prompt],
        capture_output=True,
        text=True,
        timeout=180,
    )
    if result.returncode != 0:
        raise RuntimeError(f"claude -p failed:\n{result.stderr}")
    return result.stdout


def strip_fences(s: str) -> str:
    """Remove ```json ... ``` or ``` ... ``` wrapping if present."""
    s = s.strip()
    m = re.match(r"^```(?:json)?\s*(.*?)\s*```\s*$", s, re.DOTALL)
    return m.group(1) if m else s


def parse_cards(raw: str) -> list[dict]:
    text = strip_fences(raw)
    # Be forgiving: find the first '[' and last ']'.
    start, end = text.find("["), text.rfind("]")
    if start == -1 or end == -1:
        raise ValueError(f"no JSON array found in response:\n{raw[:400]}")
    return json.loads(text[start : end + 1])


# ---------- commands ----------


def cmd_ingest(target: str) -> None:
    if target == "-":
        content = sys.stdin.read()
        source_label = "<stdin>"
    else:
        path = Path(target).expanduser().resolve()
        content = path.read_text(encoding="utf-8")
        source_label = str(path)

    if not content.strip():
        sys.exit("empty content")

    prompt = PROMPT_PATH.read_text(encoding="utf-8").replace("{{CONTENT}}", content)
    print(f"[ingest] calling claude on {len(content)} chars from {source_label}...")
    raw = call_claude(prompt)
    cards = parse_cards(raw)

    mem = load_memory()
    now = today()
    for c in cards:
        mem["cards"].append(
            {
                "id": uuid.uuid4().hex[:8],
                "source": source_label,
                "q": c["q"],
                "a": c["a"],
                "type": c.get("type", "unknown"),
                "created": now,
                "next_review": now,  # due immediately on first review
                "interval_step": 0,
                "review_count": 0,
                "lapse_count": 0,
            }
        )
    save_memory(mem)

    print(f"[ingest] +{len(cards)} card(s). total now {len(mem['cards'])}.")
    for i, c in enumerate(cards, 1):
        print(f"\n  {i}. [{c.get('type','?')}] {c['q']}")
        print(f"     → {c['a']}")


def grade(card: dict, verdict: str) -> None:
    """Mutate card based on verdict: g=good, h=hard, a=again."""
    card["review_count"] += 1
    if verdict == "g":
        card["interval_step"] = min(card["interval_step"] + 1, len(INTERVAL_LADDER) - 1)
    elif verdict == "h":
        pass  # stay at same step
    elif verdict == "a":
        card["interval_step"] = 0
        card["lapse_count"] += 1
    interval = INTERVAL_LADDER[card["interval_step"]]
    card["next_review"] = (date.today() + timedelta(days=interval)).isoformat()


def cmd_review() -> None:
    mem = load_memory()
    today_str = today()
    due = [c for c in mem["cards"] if c["next_review"] <= today_str]

    if not due:
        print("nothing due. come back tomorrow.")
        return

    print(f"{len(due)} card(s) due. press enter to flip, then grade (g/h/a). q to quit.\n")
    for i, card in enumerate(due, 1):
        print(f"--- {i}/{len(due)}  [{card['type']}]")
        print(f"Q: {card['q']}")
        try:
            inp = input("(enter to flip) ").strip().lower()
        except EOFError:
            break
        if inp == "q":
            break
        print(f"A: {card['a']}")
        while True:
            try:
                verdict = input("grade [g=good / h=hard / a=again / q=quit]: ").strip().lower()
            except EOFError:
                verdict = "q"
            if verdict in {"g", "h", "a"}:
                grade(card, verdict)
                next_in = (datetime.fromisoformat(card["next_review"]).date() - date.today()).days
                print(f"  → next review in {next_in}d\n")
                break
            if verdict == "q":
                save_memory(mem)
                return
            print("  use g / h / a / q")
    save_memory(mem)
    print("done.")


def cmd_list() -> None:
    mem = load_memory()
    if not mem["cards"]:
        print("(no cards)")
        return
    today_str = today()
    for c in mem["cards"]:
        flag = "●" if c["next_review"] <= today_str else " "
        print(f"{flag} {c['id']} [{c['type'][:5]:5}] due={c['next_review']} reps={c['review_count']}")
        print(f"    {c['q'][:100]}")


def cmd_stats() -> None:
    mem = load_memory()
    cards = mem["cards"]
    today_str = today()
    due = sum(1 for c in cards if c["next_review"] <= today_str)
    by_type: dict[str, int] = {}
    for c in cards:
        by_type[c["type"]] = by_type.get(c["type"], 0) + 1
    print(f"total cards: {len(cards)}")
    print(f"due today:   {due}")
    print(f"by type:     {by_type}")


# ---------- entry ----------


def main(argv: list[str]) -> None:
    if len(argv) < 2:
        print(__doc__)
        sys.exit(1)
    cmd, *rest = argv[1:]
    if cmd == "ingest":
        if not rest:
            sys.exit("ingest needs a file path or '-'")
        cmd_ingest(rest[0])
    elif cmd == "review":
        cmd_review()
    elif cmd == "list":
        cmd_list()
    elif cmd == "stats":
        cmd_stats()
    else:
        print(__doc__)
        sys.exit(f"unknown command: {cmd}")


if __name__ == "__main__":
    main(sys.argv)
