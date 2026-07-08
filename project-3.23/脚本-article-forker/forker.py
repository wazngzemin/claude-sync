#!/usr/bin/env python3
"""article-forker: turn any article into a runnable tool.

Usage:
  python3 forker.py <file>       # fork from file
  python3 forker.py -            # fork from stdin (pbpaste | python3 forker.py -)
  python3 forker.py --serve      # launch web UI
"""
import json
import os
import re
import subprocess
import sys
import traceback
import webbrowser
from datetime import datetime
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DEEP_READ_PROMPT = ROOT / "prompts" / "deep-read.md"
BUILD_PROMPT = ROOT / "prompts" / "build.md"
FORKS_DIR = ROOT / "forks"
STATIC_DIR = ROOT / "static"
PORT = 8378


def call_claude(prompt: str) -> str:
    try:
        result = subprocess.run(
            ["claude", "-p", prompt],
            capture_output=True, text=True, timeout=300,
        )
    except subprocess.TimeoutExpired:
        raise RuntimeError("Claude 响应超时（5分钟）。文章可能太长，试试只粘贴核心段落。")
    if result.returncode != 0:
        raise RuntimeError(f"Claude 调用失败:\n{result.stderr[:500]}")
    return result.stdout


def strip_fences(s: str) -> str:
    s = s.strip()
    m = re.match(r"^```(?:json)?\s*(.*?)\s*```\s*$", s, re.DOTALL)
    return m.group(1) if m else s


def parse_result(raw: str) -> dict:
    text = strip_fences(raw)
    start, end = text.find("{"), text.rfind("}")
    if start == -1 or end == -1:
        raise ValueError(
            "Claude 返回了非 JSON 内容。可能是文章太短或内容不适合 fork。\n"
            f"原始响应前200字: {raw[:200]}"
        )
    try:
        return json.loads(text[start:end + 1])
    except json.JSONDecodeError as e:
        raise ValueError(f"JSON 解析失败: {e}\n内容前300字: {text[start:start+300]}")


def fork_article(content: str, on_progress=None) -> dict:
    # Step 1: Deep read only — all thinking power on analysis
    if on_progress:
        on_progress("deep_read")
    prompt1 = DEEP_READ_PROMPT.read_text(encoding="utf-8").replace("{{CONTENT}}", content)
    raw1 = call_claude(prompt1)
    deep_read = parse_result(raw1)

    # Step 2: Build — extract code + propose tool + generate, informed by deep read
    if on_progress:
        on_progress("build")
    deep_read_json = json.dumps(deep_read, ensure_ascii=False, indent=2)
    prompt2 = BUILD_PROMPT.read_text(encoding="utf-8") \
        .replace("{{DEEP_READ}}", deep_read_json) \
        .replace("{{CONTENT}}", content)
    raw2 = call_claude(prompt2)
    build_result = parse_result(raw2)

    # Merge into one result
    return {"deep_read": deep_read, **build_result}


def save_fork(result: dict) -> Path:
    FORKS_DIR.mkdir(parents=True, exist_ok=True)
    ts = datetime.now().strftime("%Y%m%d-%H%M%S")
    today = datetime.now().strftime("%Y-%m-%d")
    name = result.get("tool_proposal", {}).get("name", "unnamed")
    safe_name = re.sub(r"[^\w\-]", "", name.replace(" ", "-"))[:30]
    fork_dir = FORKS_DIR / f"{ts}-{safe_name}"
    fork_dir.mkdir()

    # Save full analysis
    (fork_dir / "analysis.json").write_text(
        json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    # Save generated tool file
    code_info = result.get("generated_code", {})
    if code_info.get("code"):
        filename = code_info.get("filename", "tool.html")
        (fork_dir / filename).write_text(code_info["code"], encoding="utf-8")
        if filename != "tool.html":
            (fork_dir / "tool.html").write_text(code_info["code"], encoding="utf-8")

    # Save high-standard article-forker assets when the prompt provides them.
    source_asset = result.get("source_asset", {})
    if source_asset.get("content"):
        (fork_dir / "source.md").write_text(source_asset["content"], encoding="utf-8")

    concept_asset = result.get("concept_asset", {})
    if concept_asset.get("content"):
        (fork_dir / "concept.md").write_text(concept_asset["content"], encoding="utf-8")

    metadata = result.get("metadata", {})
    if metadata:
        metadata.setdefault("fork_date", today)
        metadata.setdefault("fork_time", datetime.now().strftime("%Y-%m-%d %H:%M"))
        metadata.setdefault("fork_outputs", ["source", "concept", "tool"])
        metadata.setdefault("feishu", {
            "source_doc_id": "",
            "source_url": "",
            "concept_doc_id": "",
            "concept_url": "",
        })
        (fork_dir / "metadata.json").write_text(
            json.dumps(metadata, ensure_ascii=False, indent=2), encoding="utf-8"
        )

    # Save README
    dr = result.get("deep_read", {})
    ec = result.get("extracted_code", {})
    tp = result.get("tool_proposal", {})
    gc = result.get("generated_code", {})

    readme_lines = [
        f"# Fork: {tp.get('name', '?')}",
        f"",
        f"**核心论点:** {dr.get('argument_chain', '?') if isinstance(dr.get('argument_chain'), str) else '?'}",
        f"",
        f"**提取的方法:** {ec.get('method_name', '?')} — {ec.get('problem_solved', '?')}",
        f"",
        f"**生成的工具:** `{gc.get('filename', '?')}` — {tp.get('one_liner', '?')}",
        f"",
        f"**使用方法:** {gc.get('usage', '?')}",
        f"",
        f"---",
        f"Forked at {ts}",
    ]
    (fork_dir / "README.md").write_text("\n".join(readme_lines), encoding="utf-8")

    update_index(fork_dir, result, today)

    return fork_dir


def update_index(fork_dir: Path, result: dict, today: str) -> None:
    """Append a local index row if this is a full source/concept/tool fork."""
    if not (fork_dir / "source.md").exists():
        return

    index = FORKS_DIR / "INDEX.md"
    if not index.exists():
        return

    meta = result.get("metadata", {})
    title = meta.get("article_title") or result.get("tool_proposal", {}).get("name", fork_dir.name)
    category = meta.get("category") or meta.get("article_type") or result.get("deep_read", {}).get("article_type", "?")
    outputs = ", ".join(meta.get("fork_outputs", ["source", "concept", "tool"]))
    row = f"| {today} | {title} | {category} | {outputs} | [{fork_dir.name}]({fork_dir.name}/) | 待上传 |"

    text = index.read_text(encoding="utf-8")
    if fork_dir.name in text:
        return
    marker = "|------|----------|------|------|----------|----------|"
    if marker in text:
        text = text.replace(marker, marker + "\n" + row, 1)
    else:
        text = text.rstrip() + "\n" + row + "\n"
    index.write_text(text, encoding="utf-8")


# ---- CLI mode ----

def cmd_fork(target: str):
    if target == "-":
        content = sys.stdin.read()
    else:
        content = Path(target).expanduser().resolve().read_text(encoding="utf-8")

    if not content.strip():
        sys.exit("内容为空")

    print(f"[forker] 正在深度阅读 {len(content)} 字...")
    result = fork_article(content)
    fork_dir = save_fork(result)

    dr = result.get("deep_read", {})
    ec = result.get("extracted_code", {})
    tp = result.get("tool_proposal", {})
    gc = result.get("generated_code", {})

    print(f"\n{'='*60}")
    print(f"📖 深度阅读")
    print(f"{'='*60}")
    for s in dr.get("sections", []):
        print(f"\n  [{s.get('function','')}] {s.get('title','')}")
        print(f"  → {s.get('core_claim','')}")
        if s.get("hidden_assumption"):
            print(f"    假设: {s['hidden_assumption']}")
        if s.get("commentary"):
            print(f"    评注: {s['commentary']}")

    print(f"\n  论证链: {dr.get('argument_chain', '?')}")

    print(f"\n{'='*60}")
    print(f"🔧 提取的代码: {ec.get('method_name','?')}")
    print(f"{'='*60}")
    print(f"  解决: {ec.get('problem_solved','?')}")
    print(f"  输入: {ec.get('input','?')}")
    print(f"  输出: {ec.get('output','?')}")
    for i, s in enumerate(ec.get("steps", []), 1):
        print(f"  {i}. {s}")

    print(f"\n{'='*60}")
    print(f"💡 工具: {tp.get('name','?')} — {tp.get('one_liner','')}")
    print(f"{'='*60}")
    print(f"  形态: {tp.get('format','?')}")
    for f in tp.get("mvp_features", []):
        print(f"  ✓ {f}")

    print(f"\n{'='*60}")
    print(f"📦 已保存到: {fork_dir}/")
    print(f"{'='*60}")
    if gc.get("filename"):
        print(f"  打开工具: open \"{fork_dir / gc['filename']}\"")
    print(f"  使用方法: {gc.get('usage','?')}")


# ---- Web server mode ----

class ForkHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(STATIC_DIR), **kwargs)

    def do_POST(self):
        if self.path == "/api/fork":
            length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(length))
            content = body.get("content", "")
            if not content.strip():
                self._json({"error": "内容为空，请粘贴文章全文"}, 400)
                return
            try:
                result = fork_article(content)
                fork_dir = save_fork(result)
                result["_saved_to"] = str(fork_dir)
                self._json(result)
            except Exception as e:
                traceback.print_exc()
                self._json({"error": str(e)}, 500)
        else:
            self.send_error(404)

    def do_GET(self):
        if self.path == "/api/forks":
            forks = []
            if FORKS_DIR.exists():
                for d in sorted(FORKS_DIR.iterdir(), reverse=True):
                    if d.is_dir() and (d / "analysis.json").exists():
                        try:
                            analysis = json.loads((d / "analysis.json").read_text(encoding="utf-8"))
                            forks.append({
                                "dir": d.name,
                                "name": analysis.get("tool_proposal", {}).get("name", "?"),
                                "one_liner": analysis.get("tool_proposal", {}).get("one_liner", ""),
                                "thesis": analysis.get("deep_read", {}).get("argument_chain", ""),
                            })
                        except (json.JSONDecodeError, IOError):
                            continue
            self._json(forks)
        else:
            super().do_GET()

    def _json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):
        pass


def cmd_serve():
    server = HTTPServer(("127.0.0.1", PORT), ForkHandler)
    url = f"http://127.0.0.1:{PORT}"
    print(f"Article Forker running at {url}")
    print("Ctrl+C to stop\n")
    webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nbye.")


# ---- entry ----

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    arg = sys.argv[1]
    if arg == "--serve":
        cmd_serve()
    else:
        cmd_fork(arg)
