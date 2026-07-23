#!/usr/bin/env python3
"""
Claude Code Session Panel（会话管理面板）
启动时预加载所有 session → 内存缓存 → API 秒返回
启动: python3 session_panel.py → http://localhost:8780
"""

import json
import http.server
import socketserver
import urllib.parse
import threading
import webbrowser
import sys
from pathlib import Path
from datetime import datetime, timezone

CLAUDE_DIR = Path.home() / ".claude"
PORT = 8780

_cached_sessions = []
_cache_json = "[]"


def _read_head_tail(filepath, head_bytes=16384, tail_bytes=16384):
    file_size = filepath.stat().st_size
    if file_size <= head_bytes + tail_bytes:
        with open(filepath, "r", encoding="utf-8", errors="replace") as f:
            return f.readlines()
    with open(filepath, "rb") as f:
        head_data = f.read(head_bytes).decode("utf-8", errors="replace")
        f.seek(max(0, file_size - tail_bytes))
        tail_data = f.read().decode("utf-8", errors="replace")
    head_lines = head_data.split("\n")
    if not head_data.endswith("\n"):
        head_lines = head_lines[:-1]
    tail_lines = tail_data.split("\n")
    if not tail_data.startswith("\n"):
        tail_lines = tail_lines[1:]
    return head_lines + tail_lines


def _extract_text(content):
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        for c in content:
            if isinstance(c, dict) and c.get("type") == "text":
                return c.get("text", "")
    return ""


import re

_TAG_RE = re.compile(r"<[^>]+>")
_IMG_RE = re.compile(r"\[Image[^\]]*\]")
_PATH_RE = re.compile(r"'/Users/[^']*'")
_ANSI_RE = re.compile(r"\[[\d;]*m")
_SKIP_STARTS = (
    "<system-reminder>", "<command-name>", "<local-command",
    "Set model to", "Resume cancelled", "Tip:",
    "article-forker", "deep-research",
)

def _clean_text(text):
    if not text:
        return ""
    text = text.strip()
    if text.startswith("<local-command"):
        idx = text.find("</local-command-caveat>")
        if idx > 0:
            text = text[idx + len("</local-command-caveat>"):].strip()
        else:
            return ""
    text = _TAG_RE.sub("", text).strip()
    text = _ANSI_RE.sub("", text).strip()
    text = _IMG_RE.sub("", text).strip()
    text = _PATH_RE.sub("", text).strip()
    text = re.sub(r"file:///\S+", "", text).strip()
    text = text.replace("\n", " ").replace("\r", " ")
    text = re.sub(r"\s+", " ", text).strip()
    for prefix in _SKIP_STARTS:
        if text.startswith(prefix):
            return ""
    if not text or text.startswith("/"):
        return ""
    if re.match(r"^https?://\S+$", text) and not any("一" <= c <= "鿿" for c in text):
        return ""
    return text


def _parse_ts(ts, fallback):
    if not ts:
        return fallback
    if isinstance(ts, str):
        return ts
    if isinstance(ts, (int, float)):
        return datetime.fromtimestamp(
            ts / 1000 if ts > 1e12 else ts, tz=timezone.utc
        ).isoformat()
    return fallback


def _format_size(n):
    if n < 1024:
        return f"{n}B"
    if n < 1048576:
        return f"{n/1024:.1f}KB"
    return f"{n/1048576:.1f}MB"


def _short_model(m):
    """claude-opus-4-8 → opus-4-8；剥掉厂商前缀"""
    if not m:
        return ""
    m = m.split("/")[-1].split(":")[0]
    return m.replace("claude-", "")


def _short_tool(name):
    """mcp__screenshot__screenshot_window → screenshot_window；取最后一段"""
    if not name:
        return "?"
    if "__" in name:
        return name.split("__")[-1]
    return name


def parse_one(filepath, session_id, project_name):
    ai_title = ""
    last_prompt = ""
    first_user_msg = ""
    first_ts = None          # 首条带时间戳的消息
    last_ts = None           # 最后一条任意消息（真实"最近对话时间"）
    user_n = 0               # 全部 user 事件（含工具结果回传）
    user_prompts = 0         # 真实提问数（有正文文本的 user 消息）
    asst_n = 0
    cwd = ""
    git_branch = ""
    version = ""
    models = []              # 有序去重的真实模型列表
    tools = {}               # 工具名 → 调用次数
    user_msgs = []
    last_asst_text = ""      # Claude 最后说的话（预览）

    fsize = filepath.stat().st_size
    fmtime = datetime.fromtimestamp(filepath.stat().st_mtime, tz=timezone.utc).isoformat()

    # 全量读取：文件已缓存，全部 session 一次解析仅 ~2 秒，换来精确的轮数/工具/时间戳
    with open(filepath, "r", encoding="utf-8", errors="replace") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                obj = json.loads(line)
            except (json.JSONDecodeError, ValueError):
                continue

            # 元信息（任意行都可能带）
            if obj.get("gitBranch"):
                git_branch = obj["gitBranch"]
            if obj.get("version"):
                version = obj["version"]
            if obj.get("cwd") and not cwd:
                cwd = obj["cwd"]

            # 时间戳：取任意类型消息的时间，last_ts 记录最后一条
            ts = obj.get("timestamp")
            if ts:
                if first_ts is None:
                    first_ts = ts
                last_ts = ts

            t = obj.get("type", "")
            if t == "ai-title":
                ai_title = obj.get("aiTitle", ai_title)
            elif t == "last-prompt":
                last_prompt = obj.get("lastPrompt", "")
            elif t == "user":
                user_n += 1
                raw = _extract_text(obj.get("message", {}).get("content", ""))
                clean = _clean_text(raw)
                if clean:
                    user_prompts += 1
                    user_msgs.append(clean[:200])
                    if not first_user_msg:
                        first_user_msg = clean[:300]
            elif t == "assistant":
                asst_n += 1
                msg = obj.get("message", {})
                m = msg.get("model", "")
                if m and m != "<synthetic>" and m not in models:
                    models.append(m)
                content = msg.get("content", "")
                if isinstance(content, list):
                    for b in content:
                        if isinstance(b, dict):
                            if b.get("type") == "tool_use":
                                nm = b.get("name", "?")
                                tools[nm] = tools.get(nm, 0) + 1
                            elif b.get("type") == "text":
                                txt = _clean_text(b.get("text", ""))
                                if txt:
                                    last_asst_text = txt[:300]

    if user_n == 0 and asst_n == 0:
        return None

    has_cjk = lambda s: any("一" <= c <= "鿿" for c in s) if s else False
    clean_lp = _clean_text(last_prompt)

    if first_user_msg:
        title = first_user_msg[:80]
    elif clean_lp:
        title = clean_lp[:80]
    elif has_cjk(ai_title):
        title = ai_title
    elif ai_title:
        title = ai_title
    else:
        title = session_id[:8]

    subtitle = ""
    if ai_title and has_cjk(ai_title) and ai_title != title:
        subtitle = ai_title

    created = _parse_ts(first_ts, fmtime)
    updated = _parse_ts(last_ts, fmtime)
    # 时长（秒）
    duration = 0
    try:
        c = datetime.fromisoformat(created.replace("Z", "+00:00"))
        u = datetime.fromisoformat(updated.replace("Z", "+00:00"))
        duration = max(0, int((u - c).total_seconds()))
    except Exception:
        pass

    tool_total = sum(tools.values())
    # 工具明细：短名 + 次数，按次数降序
    tool_list = sorted(
        ({"name": _short_tool(k), "raw": k, "n": v} for k, v in tools.items()),
        key=lambda x: x["n"], reverse=True,
    )

    return {
        "session_id": session_id,
        "title": title,
        "ai_title": subtitle,
        "first_user_msg": first_user_msg[:500],
        "last_prompt": _clean_text(last_prompt)[:500],
        "last_assistant_msg": last_asst_text,
        "all_user_messages": user_msgs[:20],
        "project": project_name,
        "cwd": cwd,
        "git_branch": git_branch if git_branch and git_branch != "HEAD" else "",
        "version": version,
        "models": [_short_model(m) for m in models],
        "user_turns": user_prompts,
        "user_events": user_n,
        "assistant_turns": asst_n,
        "tool_total": tool_total,
        "tools": tool_list,
        "created_ts": created,
        "updated_ts": updated,
        "duration_sec": duration,
        "file_size": fsize,
        "file_size_human": _format_size(fsize),
    }


def load_all():
    global _cached_sessions, _cache_json
    sessions = []
    projects_dir = CLAUDE_DIR / "projects"
    if not projects_dir.exists():
        return

    total = 0
    for pd in projects_dir.iterdir():
        if not pd.is_dir():
            continue
        pname = pd.name.replace("-Users-bytedance-", "").replace("-", "/")
        jsonls = sorted(pd.glob("*.jsonl"), key=lambda f: f.stat().st_mtime, reverse=True)
        total += len(jsonls)
        for jf in jsonls:
            sid = jf.stem
            try:
                info = parse_one(jf, sid, pname)
                if info:
                    sessions.append(info)
            except Exception:
                pass

    sessions.sort(key=lambda s: s["updated_ts"], reverse=True)
    _cached_sessions = sessions
    _cache_json = json.dumps(sessions, ensure_ascii=False)
    print(f"  已加载 {len(sessions)}/{total} 个会话")


HTML_PAGE = r"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Claude Code 会话管理</title>
<style>
:root{
 --bg:#0a0d12;--bg2:#0d1117;--sf:#141a22;--sfh:#1a212b;--sfa:#1d2530;
 --bd:#242c38;--bd2:#30394a;--tx:#e6edf3;--t2:#9aa5b1;--t3:#6b7280;--td:#4a525e;
 --ac:#58a6ff;--acd:#1f6feb;--ab:rgba(88,166,255,.1);
 --gn:#3fb950;--or:#e3a008;--pp:#bc8cff;--cy:#39c5cf;--pk:#f778ba;--rd:#f85149;
 --r:10px;--rs:6px;
}
*{margin:0;padding:0;box-sizing:border-box}
::selection{background:rgba(88,166,255,.3)}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,"PingFang SC",sans-serif;background:var(--bg);color:var(--tx);line-height:1.5;-webkit-font-smoothing:antialiased}
::-webkit-scrollbar{width:10px;height:10px}
::-webkit-scrollbar-thumb{background:var(--bd2);border-radius:5px;border:2px solid var(--bg)}
::-webkit-scrollbar-thumb:hover{background:#3d4757}

/* 顶栏 */
.hd{padding:18px 24px 14px;border-bottom:1px solid var(--bd);background:linear-gradient(180deg,var(--bg2),var(--bg));position:sticky;top:0;z-index:100;backdrop-filter:blur(8px)}
.hd-top{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:14px;flex-wrap:wrap}
.brand{display:flex;align-items:center;gap:10px}
.brand .ic{width:30px;height:30px;background:linear-gradient(135deg,var(--ac),var(--pp));border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:15px;color:#fff;font-weight:800;box-shadow:0 2px 10px rgba(88,166,255,.35)}
.brand h1{font-size:17px;font-weight:650;letter-spacing:.2px}
.brand .sub{font-size:11px;color:var(--t3);margin-top:1px}

/* 统计瓦片 */
.tiles{display:flex;gap:10px;flex-wrap:wrap}
.tile{display:flex;align-items:center;gap:9px;padding:8px 13px;background:var(--sf);border:1px solid var(--bd);border-radius:var(--r);min-width:96px}
.tile .ti{width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.tile .ti svg{width:15px;height:15px}
.tile .tv{font-size:16px;font-weight:700;line-height:1.1;font-variant-numeric:tabular-nums}
.tile .tl{font-size:10.5px;color:var(--t3);margin-top:1px}
.tc-b{background:rgba(88,166,255,.14);color:var(--ac)}
.tc-g{background:rgba(63,185,80,.14);color:var(--gn)}
.tc-p{background:rgba(188,140,255,.14);color:var(--pp)}
.tc-o{background:rgba(227,160,8,.14);color:var(--or)}
.tc-c{background:rgba(57,197,207,.14);color:var(--cy)}

/* 搜索/控制 */
.sr{display:flex;gap:9px;flex-wrap:wrap}
.sb{flex:1;min-width:220px;position:relative}
.sb input{width:100%;padding:10px 34px 10px 36px;background:var(--bg2);border:1px solid var(--bd);border-radius:var(--r);color:var(--tx);font-size:13.5px;outline:none;transition:.18s}
.sb input:focus{border-color:var(--ac);box-shadow:0 0 0 3px var(--ab)}
.sb input::placeholder{color:var(--td)}
.sb .si{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--t3);display:flex}
.sb .si svg{width:15px;height:15px}
.sb .kb{position:absolute;right:10px;top:50%;transform:translateY(-50%);font-size:11px;color:var(--td);border:1px solid var(--bd);border-radius:4px;padding:1px 6px;pointer-events:none}
.btn{padding:0 14px;height:40px;background:var(--bg2);border:1px solid var(--bd);border-radius:var(--r);color:var(--t2);font-size:12.5px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:.15s;white-space:nowrap;font-weight:500}
.btn svg{width:14px;height:14px}
.btn:hover{border-color:var(--bd2);color:var(--tx);background:var(--sfh)}
.btn.on{background:var(--ab);border-color:var(--ac);color:var(--ac)}
.btn.pri{background:var(--acd);border-color:var(--acd);color:#fff}
.btn.pri:hover{background:#2a7fff}

/* 筛选面板 */
.fp{max-height:0;overflow:hidden;transition:max-height .25s ease,margin .25s ease;margin-top:0}
.fp.show{max-height:120px;margin-top:11px}
.fp-in{display:flex;gap:16px;flex-wrap:wrap;align-items:center;padding:11px 15px;background:var(--bg2);border:1px solid var(--bd);border-radius:var(--r)}
.fg{display:flex;align-items:center;gap:7px}
.fg label{font-size:11.5px;color:var(--t3);font-weight:500}
.fp select{padding:5px 8px;background:var(--sf);border:1px solid var(--bd);border-radius:var(--rs);color:var(--tx);font-size:12px;cursor:pointer;outline:none}
.fp select:focus{border-color:var(--ac)}

/* 列表 */
.ct{padding:16px 24px 60px;max-width:1180px;margin:0 auto}
.gh{display:flex;align-items:center;gap:8px;padding:14px 4px 8px;font-size:12px;font-weight:600;color:var(--t2);letter-spacing:.3px}
.gh .gc{font-size:11px;color:var(--t3);background:var(--sf);padding:1px 8px;border-radius:10px;font-weight:500}
.gh::after{content:"";flex:1;height:1px;background:var(--bd)}
.sl{display:flex;flex-direction:column;gap:7px}

.sc{background:var(--sf);border:1px solid var(--bd);border-radius:var(--r);cursor:pointer;transition:border-color .15s,background .15s,box-shadow .15s;overflow:hidden}
.sc:hover{background:var(--sfh);border-color:var(--bd2)}
.sc.ex{border-color:var(--acd);background:var(--sfa);box-shadow:0 4px 24px rgba(0,0,0,.3)}
.sc-h{display:grid;grid-template-columns:1fr auto;gap:14px;padding:13px 15px;align-items:center}
.sm{min-width:0}
.st{font-size:14px;font-weight:600;margin-bottom:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--tx)}
.sub{font-size:11.5px;color:var(--t3);margin:-3px 0 5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.smeta{display:flex;gap:7px;flex-wrap:wrap;align-items:center;font-size:11.5px;color:var(--t2)}
.tg{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:20px;background:var(--bg2);border:1px solid var(--bd);white-space:nowrap;font-variant-numeric:tabular-nums}
.tg svg{width:12px;height:12px;opacity:.75;flex-shrink:0}
.tg.act{color:var(--gn)}
.tg.act svg{opacity:1}
.tg.mdl{color:var(--pp)}
.tg.br{color:var(--cy);font-family:"SF Mono",ui-monospace,monospace;font-size:10.5px}
.pj{color:var(--t3)}

.tbar{display:flex;height:5px;border-radius:3px;overflow:hidden;margin-top:9px;background:var(--bg2);gap:1px}
.tbar i{height:100%;transition:.3s}

.sa{display:flex;align-items:center;gap:6px;flex-shrink:0}
.ab{padding:7px 12px;border-radius:var(--rs);border:1px solid var(--bd);background:var(--bg2);color:var(--t2);font-size:11.5px;cursor:pointer;transition:.13s;white-space:nowrap;display:inline-flex;align-items:center;gap:5px;font-weight:500}
.ab svg{width:13px;height:13px}
.ab:hover{border-color:var(--bd2);color:var(--tx);background:var(--sfh)}
.ab.p{background:rgba(88,166,255,.12);border-color:rgba(88,166,255,.4);color:var(--ac)}
.ab.p:hover{background:rgba(88,166,255,.2);border-color:var(--ac)}
.chev{width:20px;height:20px;color:var(--t3);transition:transform .25s;flex-shrink:0}
.sc.ex .chev{transform:rotate(180deg);color:var(--ac)}

/* 展开详情：grid-rows 高度动画 */
.sd-w{display:grid;grid-template-rows:0fr;transition:grid-template-rows .26s ease}
.sc.ex .sd-w{grid-template-rows:1fr}
.sd-in{overflow:hidden;min-height:0}
.sd{padding:4px 15px 15px;border-top:1px solid var(--bd)}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px 18px;margin:12px 0}
@media(max-width:640px){.grid2{grid-template-columns:1fr}}
.ds{min-width:0}
.dl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--t3);margin-bottom:5px;display:flex;align-items:center;gap:5px}
.dl svg{width:12px;height:12px;opacity:.7}
.dv{font-size:12.5px;color:var(--t2);word-break:break-word;line-height:1.55}
.dv.id{font-family:"SF Mono",ui-monospace,monospace;color:var(--ac);user-select:all;font-size:11.5px;background:var(--bg2);padding:6px 9px;border-radius:var(--rs);border:1px solid var(--bd);cursor:copy;display:inline-block}
.dv.id:hover{border-color:var(--ac)}
.msg{font-size:12.5px;color:var(--t2);line-height:1.6;background:var(--bg2);padding:9px 11px;border-radius:var(--rs);border:1px solid var(--bd);border-left:2px solid var(--bd2)}
.msg.u{border-left-color:var(--ac)}
.msg.a{border-left-color:var(--pp)}
.sec{margin-top:14px}

.tlist{display:flex;flex-direction:column;gap:5px;margin-top:8px}
.trow{display:grid;grid-template-columns:120px 1fr 42px;gap:9px;align-items:center;font-size:11.5px}
.tn{color:var(--t2);font-family:"SF Mono",ui-monospace,monospace;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ttrack{height:7px;background:var(--bg2);border-radius:4px;overflow:hidden}
.tfill{height:100%;border-radius:4px}
.tcnt{text-align:right;color:var(--t3);font-variant-numeric:tabular-nums;font-weight:600}

.ml{display:flex;flex-direction:column;gap:5px;margin-top:8px}
.mi{padding:6px 10px;background:var(--bg2);border:1px solid var(--bd);border-radius:var(--rs);font-size:11.5px;color:var(--t2);line-height:1.5}
.mi .mn{color:var(--td);margin-right:7px;font-variant-numeric:tabular-nums;font-size:10px}

.act-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px;padding-top:13px;border-top:1px solid var(--bd)}

.toast{position:fixed;bottom:26px;left:50%;transform:translateX(-50%) translateY(70px);padding:11px 20px;background:var(--sfa);border:1px solid var(--bd2);color:var(--tx);border-radius:var(--r);font-size:12.5px;font-weight:500;opacity:0;transition:.3s cubic-bezier(.2,.8,.2,1);z-index:200;pointer-events:none;box-shadow:0 8px 30px rgba(0,0,0,.5);display:flex;align-items:center;gap:9px}
.toast::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--gn)}
.toast.show{transform:translateX(-50%) translateY(0);opacity:1}
.toast code{font-family:"SF Mono",ui-monospace,monospace;color:var(--ac);font-size:11.5px}
.hl{background:rgba(227,160,8,.28);border-radius:2px;padding:0 2px;color:#fff}
.empty{text-align:center;padding:70px 20px;color:var(--t3);font-size:14px}
.empty svg{width:46px;height:46px;opacity:.3;margin-bottom:14px}
.loading{text-align:center;padding:90px 20px;color:var(--t2);font-size:14px}
.spin{display:inline-block;width:18px;height:18px;border:2px solid var(--bd);border-top-color:var(--ac);border-radius:50%;animation:sp .7s linear infinite;vertical-align:-4px;margin-right:9px}
@keyframes sp{to{transform:rotate(360deg)}}
@media(max-width:768px){.hd{padding:14px}.ct{padding:12px 12px 40px}.sc-h{grid-template-columns:1fr}.sa{justify-content:flex-end;margin-top:4px}.tiles{width:100%;overflow-x:auto}}
</style>
</head>
<body>
<div class="hd">
 <div class="hd-top">
  <div class="brand">
   <span class="ic">C</span>
   <div><h1>Claude Code 会话管理</h1><div class="sub">本地会话浏览 · 一键恢复</div></div>
  </div>
  <div class="tiles" id="tiles"></div>
 </div>
 <div class="sr">
  <div class="sb">
   <span class="si"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg></span>
   <input id="si" type="text" placeholder="搜索标题、消息内容、会话 ID、项目、工具…" autofocus />
   <span class="kb">/</span>
  </div>
  <button class="btn" id="fb" onclick="toggleF()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 3H2l8 9.5V19l4 2v-8.5z"/></svg> 筛选</button>
  <button class="btn" id="sb2" onclick="toggleS()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5h10M11 9h7M11 13h4M3 17l3 3 3-3M6 4v16"/></svg> <span id="slb">最近对话</span></button>
  <button class="btn pri" onclick="reload()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-2.6-6.4M21 3v6h-6"/></svg> 刷新</button>
 </div>
 <div class="fp" id="fp"><div class="fp-in">
  <div class="fg"><label>项目</label><select id="pf" onchange="run()"><option value="">全部</option></select></div>
  <div class="fg"><label>大小</label><select id="szf" onchange="run()">
   <option value="">全部</option><option value="l">大 &gt;1MB</option><option value="m">中 100KB–1MB</option><option value="s">小 &lt;100KB</option>
  </select></div>
  <div class="fg"><label>时间</label><select id="tf" onchange="run()">
   <option value="">全部</option><option value="1h">1 小时内</option><option value="today">今天</option><option value="3d">3 天内</option><option value="7d">7 天内</option>
  </select></div>
  <div class="fg"><label>模型</label><select id="mf" onchange="run()"><option value="">全部</option></select></div>
 </div></div>
</div>
<div class="ct">
 <div class="sl" id="sl"><div class="loading"><span class="spin"></span>正在加载会话…</div></div>
</div>
<div class="toast" id="toast"></div>

<script>
let D=[],SM='updated';
const $=id=>document.getElementById(id);

const IC={
 clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
 chat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.5 8.5 0 0 1-12 7.7L3 21l1.8-6A8.5 8.5 0 1 1 21 11.5z"/></svg>',
 tool:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.8 2.8-2-2z"/></svg>',
 disk:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6"/></svg>',
 folder:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
 cpu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/></svg>',
 branch:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="8" r="2.5"/><path d="M6 8.5v7M18 10.5c0 4-6 2-6 5.5"/></svg>',
 copy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
 play:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 5v14l11-7z"/></svg>',
 chev:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m6 9 6 6 6-6"/></svg>',
 hash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/></svg>',
 doc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>',
 empty:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
};

const TCOL={Bash:'#3fb950',Read:'#58a6ff',Edit:'#e3a008',Write:'#bc8cff',MultiEdit:'#d2a8ff',
 Grep:'#39c5cf',Glob:'#39c5cf',Task:'#f778ba',Agent:'#f778ba',Skill:'#f778ba',
 TodoWrite:'#8b949e',WebFetch:'#e3b341',WebSearch:'#e3b341',
 ToolSearch:'#7ee787',Workflow:'#ff7b72',AskUserQuestion:'#ffa657'};
const PAL=['#58a6ff','#3fb950','#e3a008','#bc8cff','#39c5cf','#f778ba','#ff7b72','#7ee787','#ffa657','#a5d6ff'];
function tcolor(name){if(TCOL[name])return TCOL[name];let h=0;for(const c of name)h=(h*31+c.charCodeAt(0))>>>0;return PAL[h%PAL.length]}

function toast(m){const t=$('toast');t.innerHTML=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2200)}

async function load(){
 $('sl').innerHTML='<div class="loading"><span class="spin"></span>正在加载会话…</div>';
 try{const r=await fetch('/api/sessions');D=await r.json();fillProj();run()}
 catch(e){$('sl').innerHTML='<div class="empty">'+IC.empty+'<div>加载失败：'+esc(e.message)+'</div></div>'}
}
function reload(){$('sl').innerHTML='<div class="loading"><span class="spin"></span>正在重新扫描…</div>';fetch('/api/refresh').then(()=>load())}

function fillProj(){
 const ps=[...new Set(D.map(s=>s.project))].sort();
 $('pf').innerHTML='<option value="">全部</option>'+ps.map(p=>`<option>${esc(p)}</option>`).join('');
 const ms=[...new Set(D.flatMap(s=>s.models||[]))].sort();
 $('mf').innerHTML='<option value="">全部</option>'+ms.map(m=>`<option>${esc(m)}</option>`).join('');
}

function statTiles(){
 const t0=new Date().setHours(0,0,0,0);
 const today=D.filter(s=>new Date(s.updated_ts).getTime()>=t0).length;
 const turns=D.reduce((a,s)=>a+s.user_turns,0);
 const tools=D.reduce((a,s)=>a+(s.tool_total||0),0);
 const bytes=D.reduce((a,s)=>a+s.file_size,0);
 const tl=[
  ['tc-b',IC.chat,D.length,'会话总数'],
  ['tc-g',IC.clock,today,'今日活跃'],
  ['tc-p',IC.hash,fmtK(turns),'累计提问'],
  ['tc-o',IC.tool,fmtK(tools),'工具调用'],
  ['tc-c',IC.disk,fmtSize(bytes),'占用空间'],
 ];
 $('tiles').innerHTML=tl.map(([c,i,v,l])=>`<div class="tile"><span class="ti ${c}">${i}</span><div><div class="tv">${v}</div><div class="tl">${l}</div></div></div>`).join('');
}
function fmtK(n){return n>=1000?(n/1000).toFixed(n>=10000?0:1)+'k':n}
function fmtSize(n){return n<1048576?(n/1024).toFixed(0)+'KB':n<1073741824?(n/1048576).toFixed(0)+'MB':(n/1073741824).toFixed(1)+'GB'}

function run(){
 const q=$('si').value.trim().toLowerCase();
 const pj=$('pf').value,sz=$('szf').value,tm=$('tf').value,mdl=$('mf').value;
 let f=D;
 if(q)f=f.filter(s=>{
  const hay=[s.title,s.ai_title||'',s.session_id,s.first_user_msg,s.last_prompt,s.last_assistant_msg,s.project,s.cwd,(s.models||[]).join(' '),(s.tools||[]).map(t=>t.name).join(' '),...(s.all_user_messages||[])].join(' ').toLowerCase();
  return q.split(/\s+/).every(w=>hay.includes(w));
 });
 if(pj)f=f.filter(s=>s.project===pj);
 if(mdl)f=f.filter(s=>(s.models||[]).includes(mdl));
 if(sz)f=f.filter(s=>sz==='l'?s.file_size>1048576:sz==='m'?(s.file_size>=102400&&s.file_size<=1048576):s.file_size<102400);
 if(tm){const now=Date.now(),cuts={'1h':3600000,'today':now-new Date().setHours(0,0,0,0),'3d':259200000,'7d':604800000},c=cuts[tm]||0;f=f.filter(s=>(now-new Date(s.updated_ts).getTime())<c)}
 f.sort((a,b)=>SM==='updated'?new Date(b.updated_ts)-new Date(a.updated_ts):SM==='created'?new Date(b.created_ts)-new Date(a.created_ts):SM==='size'?b.file_size-a.file_size:SM==='tools'?(b.tool_total||0)-(a.tool_total||0):(b.user_turns+b.assistant_turns)-(a.user_turns+a.assistant_turns));
 render(f,q);
}

function grpKey(s){
 const t=new Date(SM==='created'?s.created_ts:s.updated_ts).getTime();
 const t0=new Date().setHours(0,0,0,0);
 if(t>=t0)return '今天';
 if(t>=t0-86400000)return '昨天';
 if(t>=t0-6*86400000)return '近 7 天';
 if(t>=t0-29*86400000)return '近 30 天';
 return '更早';
}

function esc(t){const d=document.createElement('div');d.textContent=t==null?'':t;return d.innerHTML}
function hl(t,q){if(!q||!t)return esc(t||'');let r=esc(t);q.toLowerCase().split(/\s+/).filter(Boolean).forEach(w=>{const re=new RegExp('('+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi');r=r.replace(re,'<span class="hl">$1</span>')});return r}

function rt(iso){if(!iso)return '—';const d=Date.now()-new Date(iso).getTime(),m=Math.floor(d/60000);if(m<1)return '刚刚';if(m<60)return m+' 分钟前';const h=Math.floor(m/60);if(h<24)return h+' 小时前';const dy=Math.floor(h/24);if(dy<30)return dy+' 天前';const mo=Math.floor(dy/30);if(mo<12)return mo+' 个月前';return Math.floor(mo/12)+' 年前'}
function abs(iso){if(!iso)return '—';const d=new Date(iso);return d.toLocaleString('zh-CN',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'})}
function fmtDur(sec){if(!sec)return '—';if(sec<60)return sec+' 秒';const m=Math.floor(sec/60);if(m<60)return m+' 分钟';const h=Math.floor(m/60),mm=m%60;if(h<24)return mm?`${h} 小时 ${mm} 分`:`${h} 小时`;const d=Math.floor(h/24);return `${d} 天 ${h%24} 小时`}

function tbar(tools){
 if(!tools||!tools.length)return '';
 return '<div class="tbar">'+tools.slice(0,12).map(t=>`<i style="flex:${t.n};background:${tcolor(t.name)}" title="${esc(t.name)} ×${t.n}"></i>`).join('')+'</div>';
}

function render(ss,q){
 statTiles();
 const el=$('sl');
 if(!ss.length){el.innerHTML='<div class="empty">'+IC.empty+'<div>没有匹配的会话</div></div>';return}
 const grouped=(SM==='updated'||SM==='created');
 let html='',lastG=null;
 ss.forEach((s,i)=>{
  if(grouped){const g=grpKey(s);if(g!==lastG){lastG=g;const cnt=ss.filter(x=>grpKey(x)===g).length;html+=`<div class="gh">${esc(g)}<span class="gc">${cnt}</span></div>`}}
  html+=card(s,i,q);
 });
 el.innerHTML=html;
}

function card(s,i,q){
 const models=(s.models||[]).slice(0,3);
 return `<div class="sc" id="c${i}" onclick="tog(${i})">
  <div class="sc-h">
   <div class="sm">
    <div class="st">${hl(s.title,q)}</div>
    ${s.ai_title&&s.first_user_msg?`<div class="sub">${esc(s.ai_title)}</div>`:''}
    <div class="smeta">
     <span class="tg" title="${abs(s.updated_ts)}">${IC.clock}${rt(s.updated_ts)}</span>
     <span class="tg" title="你提问 ${s.user_turns} 次 · Claude ${s.assistant_turns} 步">${IC.chat}${s.user_turns} 轮</span>
     ${s.tool_total?`<span class="tg act">${IC.tool}${s.tool_total} 次工具</span>`:''}
     <span class="tg">${IC.disk}${esc(s.file_size_human)}</span>
     <span class="tg pj">${IC.folder}${esc(s.project)}</span>
     ${models.map(m=>`<span class="tg mdl">${IC.cpu}${esc(m)}</span>`).join('')}
     ${s.git_branch?`<span class="tg br">${IC.branch}${esc(s.git_branch)}</span>`:''}
    </div>
    ${tbar(s.tools)}
   </div>
   <div class="sa">
    <button class="ab" onclick="event.stopPropagation();cid('${s.session_id}')">${IC.copy} ID</button>
    <button class="ab p" onclick="event.stopPropagation();crs('${s.session_id}')">${IC.play} 恢复</button>
    <span class="chev">${IC.chev}</span>
   </div>
  </div>
  <div class="sd-w"><div class="sd-in"><div class="sd">
   <div class="grid2">
    <div class="ds"><div class="dl">${IC.hash} 会话 ID（点击复制）</div><div class="dv id" onclick="event.stopPropagation();cid('${s.session_id}')">${s.session_id}</div></div>
    <div class="ds"><div class="dl">${IC.folder} 工作目录</div><div class="dv">${esc(s.cwd||'—')}</div></div>
    <div class="ds"><div class="dl">${IC.clock} 创建于</div><div class="dv">${abs(s.created_ts)}</div></div>
    <div class="ds"><div class="dl">${IC.clock} 最近对话</div><div class="dv">${abs(s.updated_ts)} · ${rt(s.updated_ts)}</div></div>
    <div class="ds"><div class="dl">${IC.hash} 对话轮次</div><div class="dv">你提问 ${s.user_turns} 次 · Claude ${s.assistant_turns} 步 · 持续 ${fmtDur(s.duration_sec)}</div></div>
    <div class="ds"><div class="dl">${IC.cpu} 模型 / 版本</div><div class="dv">${(s.models||[]).join('、')||'—'}${s.version?' · CLI '+esc(s.version):''}${s.git_branch?' · 分支 '+esc(s.git_branch):''}</div></div>
   </div>
   ${s.tools&&s.tools.length?`<div class="sec"><div class="dl">${IC.tool} 工具调用明细（共 ${s.tool_total} 次）</div><div class="tlist">${toolRows(s.tools)}</div></div>`:''}
   ${s.first_user_msg?`<div class="sec"><div class="dl">${IC.chat} 首条消息</div><div class="msg u">${hl(s.first_user_msg,q)}</div></div>`:''}
   ${s.last_prompt&&s.last_prompt!==s.first_user_msg?`<div class="sec"><div class="dl">${IC.chat} 最后一条提问</div><div class="msg u">${hl(s.last_prompt,q)}</div></div>`:''}
   ${s.last_assistant_msg?`<div class="sec"><div class="dl">${IC.doc} Claude 最后回复</div><div class="msg a">${hl(s.last_assistant_msg,q)}</div></div>`:''}
   ${s.all_user_messages&&s.all_user_messages.length>1?`<div class="sec"><div class="dl">${IC.chat} 你的消息（前 ${s.all_user_messages.length} 条）</div><div class="ml">${s.all_user_messages.map((m,j)=>`<div class="mi"><span class="mn">${j+1}</span>${hl(m,q)}</div>`).join('')}</div></div>`:''}
   <div class="act-row">
    <button class="ab p" onclick="event.stopPropagation();crs('${s.session_id}')">${IC.play} 复制恢复命令</button>
    <button class="ab" onclick="event.stopPropagation();cid('${s.session_id}')">${IC.copy} 复制会话 ID</button>
    <button class="ab" onclick="event.stopPropagation();ccwd(${i})">${IC.folder} 复制“进目录+恢复”</button>
   </div>
  </div></div></div>
 </div>`;
}

function toolRows(tools){
 const max=Math.max(...tools.map(t=>t.n))||1;
 return tools.map(t=>`<div class="trow"><span class="tn" title="${esc(t.raw)}">${esc(t.name)}</span><div class="ttrack"><div class="tfill" style="width:${Math.max(4,t.n/max*100)}%;background:${tcolor(t.name)}"></div></div><span class="tcnt">${t.n}</span></div>`).join('');
}

let CUR=[];
function tog(i){$('c'+i).classList.toggle('ex')}
function crs(id){navigator.clipboard.writeText('claude --resume '+id);toast('已复制恢复命令 <code>claude --resume '+id.slice(0,8)+'…</code>')}
function cid(id){navigator.clipboard.writeText(id);toast('已复制会话 ID')}
function ccwd(i){const s=CUR[i];if(!s)return;const cmd=s.cwd?`cd "${s.cwd}" && claude --resume ${s.session_id}`:`claude --resume ${s.session_id}`;navigator.clipboard.writeText(cmd);toast('已复制“进目录 + 恢复”命令')}
function toggleF(){$('fp').classList.toggle('show');$('fb').classList.toggle('on')}
function toggleS(){const ms=['updated','created','tools','size','turns'],lb={updated:'最近对话',created:'创建时间',tools:'工具用量',size:'文件大小',turns:'对话轮数'};SM=ms[(ms.indexOf(SM)+1)%ms.length];$('slb').textContent=lb[SM];run()}

const _origRender=render;
render=function(ss,q){CUR=ss;_origRender(ss,q)};

document.addEventListener('keydown',e=>{
 if(e.key==='/'&&document.activeElement.tagName!=='INPUT'){e.preventDefault();$('si').focus()}
 if(e.key==='Escape'){if($('si').value){$('si').value='';run()}$('si').blur()}
});
$('si').addEventListener('input',run);
load();
</script>
</body>
</html>"""


class Handler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        p = urllib.parse.urlparse(self.path).path
        if p == "/api/sessions":
            self._json(_cache_json)
        elif p == "/api/refresh":
            load_all()
            self._json('{"ok":true}')
        elif p in ("/", "/index.html"):
            self._html(HTML_PAGE)
        else:
            self.send_response(404)
            self.end_headers()

    def _json(self, data):
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(data.encode("utf-8") if isinstance(data, str) else data)

    def _html(self, data):
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        self.wfile.write(data.encode("utf-8"))

    def log_message(self, fmt, *args):
        pass


def main():
    print("正在扫描 session 文件...")
    load_all()
    print(f"启动服务: http://localhost:{PORT}")
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        httpd.allow_reuse_address = True
        threading.Timer(0.3, lambda: webbrowser.open(f"http://localhost:{PORT}")).start()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n已停止")


if __name__ == "__main__":
    main()
