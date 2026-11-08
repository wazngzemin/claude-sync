#!/usr/bin/env python3
"""Claude Code 同步管理 · 精细文件树版
访问 http://localhost:9527"""
import http.server, json, os, subprocess, threading, shutil, getpass, fcntl
from large_files import prepare as prepare_large_files, restore as restore_large_files
from urllib.parse import urlparse, parse_qs
from datetime import datetime

PORT = int(os.environ.get("CLAUDE_SYNC_PORT", "9527"))
HOME = os.path.expanduser("~")
CLAUDE_DIR = os.path.join(HOME, ".claude")
PROJECT_DIR = os.path.join(HOME, "Desktop", "3.23")
SYNC_REPO = os.path.join(HOME, ".claude-sync")
DASHBOARD = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dashboard.html")

# 持久化状态与错误日志放在同步仓库之外，避免被 git add -A 纳入同步范围
STATE_DIR = os.environ.get("CLAUDE_SYNC_STATE_DIR", os.path.join(HOME, ".claude-sync-state"))
STATE_FILE = os.path.join(STATE_DIR, "cloud-state.json")
ERROR_LOG = os.path.join(STATE_DIR, "push-errors.log")
LFS_LIMIT = 100 * 1024 ** 2          # GitHub 阻断阈值：单文件严格大于该大小
ERROR_LOG_MAX_LINES = 500

IGNORE = {".git", "node_modules", ".venv", "__pycache__", ".DS_Store"}
RSYNC_EX = ["--exclude=.git/", "--exclude=node_modules/", "--exclude=.venv/",
            "--exclude=.env", "--exclude=*.env", "--exclude=*.mp4", "--exclude=*.mp3",
            "--exclude=*.wav", "--exclude=*.tar.gz", "--exclude=__pycache__/",
            "--exclude=.DS_Store",
            "--exclude=video-panel/output/", "--exclude=video-panel/bin/",
            "--exclude=Recordly/.tmp/", "--exclude=.whiteboard-build/",
            "--exclude=claude-code-sync/"]
MIRROR = False   # 镜像模式：删除也同步（推送带 --delete，拉取按 git 精确删除）

SCOPES = {
    "project": {"local": PROJECT_DIR, "repo": os.path.join(SYNC_REPO, "project-3.23")},
    "skills":  {"local": os.path.join(CLAUDE_DIR, "skills"),  "repo": os.path.join(SYNC_REPO, "claude-config", "skills")},
    "plugins": {"local": os.path.join(CLAUDE_DIR, "plugins"), "repo": os.path.join(SYNC_REPO, "claude-config", "plugins")},
}
FILES = {
    "claude-md": {"local": os.path.join(CLAUDE_DIR, "CLAUDE.md"),     "repo": os.path.join(SYNC_REPO, "claude-config", "CLAUDE.md"),     "label": "CLAUDE.md",     "icon": "📋", "desc": "全局指令"},
    "settings":  {"local": os.path.join(CLAUDE_DIR, "settings.json"), "repo": os.path.join(SYNC_REPO, "claude-config", "settings.json"), "label": "settings.json", "icon": "⚙️", "desc": "设置 / 模型 / 环境变量"},
}

sync_lock = threading.Lock()        # 串行化 push/pull/delete 写操作
state_lock = threading.Lock()       # 云端持久化状态读写互斥，避免 GET/POST 撕裂
log_file_lock = threading.Lock()    # 错误日志追加互斥
log_lock = threading.Lock()         # 内存 sync_log 读写互斥
sync_log = []


def fsize(n):
    for unit, div in (("G", 1024**3), ("M", 1024**2), ("K", 1024)):
        if n >= div:
            return f"{n/div:.1f}{unit}"
    return f"{n}B"


def node_meta(full, isdir):
    """文件夹显示项数（快），文件显示大小。"""
    if isdir:
        try:
            return f"{sum(1 for n in os.listdir(full) if n not in IGNORE)} 项"
        except Exception:
            return "—"
    try:
        return fsize(os.path.getsize(full))
    except Exception:
        return "—"


def get_git_last_sync():
    """最近一次本地提交（仅作参考，不再作为“云端同步时间”）。"""
    try:
        r = subprocess.run(["git", "log", "-1", "--format=%ar|||%s"],
                           capture_output=True, text=True, cwd=SYNC_REPO, timeout=5)
        if r.returncode == 0 and r.stdout.strip():
            p = r.stdout.strip().split("|||")
            return {"time": p[0], "message": p[1] if len(p) > 1 else ""}
    except Exception:
        pass
    return None


# ---------------- 云端持久化状态（仓库外，原子写） ----------------
def _atomic_write_json(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    os.replace(tmp, path)


def _default_state(kind="unknown", message="尚无云端记录", violations=None):
    return {"status": "unknown", "kind": kind, "message": message, "time": None,
            "direction": None, "head": None, "violations": violations or []}


def read_cloud_state():
    with state_lock:
        try:
            with open(STATE_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
            data.setdefault("kind", "last_result")
            data.setdefault("violations", [])
            return data
        except Exception:
            return _default_state()


def write_cloud_state(status, message, direction, head=None, kind="last_result",
                      violations=None, record_time=True):
    state = {
        "status": status,                       # ok / fail / unknown
        "kind": kind,                           # blocked=预检阻断；last_result=实际推送/拉取结果
        "message": _scrub_line(message or ""),
        "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S") if record_time else None,
        "direction": direction,
        "head": head,
        "violations": violations or [],
        "updated_at": datetime.now().isoformat(timespec="seconds"),
    }
    with state_lock:
        _atomic_write_json(STATE_FILE, state)
    return state


def _scrub_line(line):
    """脱敏：令牌、scp/https 远端仓库地址与账号、URL userinfo、邮箱；不做内容语义改写。"""
    import re
    line = re.sub(r"(ghp_[A-Za-z0-9]{8,}|gho_[A-Za-z0-9]{8,}|xox[baprs]-[A-Za-z0-9-]{8,}|sk-ant-[A-Za-z0-9-]{8,})",
                 "<REDACTED>", line)
    # scp 形态 git@host:owner/repo(.git)，整段仓库路径一并替换
    line = re.sub(r"[\w.-]+@[\w.-]+:[\w./-]+(?:\.git)?",
                 "git@<REDACTED-HOST>:<REDACTED-REPO>", line)
    # scheme://user:pass@host，先去掉 userinfo
    line = re.sub(r"([a-zA-Z][a-zA-Z0-9+.-]*://)[^/@:\s]+(?::[^/@\s]*)?@",
                 r"\1<REDACTED>@", line)
    # https 形态 host/owner/repo(.git)，隐藏 owner 与仓库名
    line = re.sub(r"([a-zA-Z][a-zA-Z0-9+.-]*://)?[\w.-]+\.[\w.-]+/[\w.-]+/[\w.-]+(?:\.git)?",
                 "<REDACTED-REPO-URL>", line)
    # 邮箱
    line = re.sub(r"[\w.+-]+@[\w-]+\.[\w.]+", "<REDACTED-EMAIL>", line)
    return line


def init_persistent_state():
    """启动时只读预检落初始状态：blocked（存在 >100 MiB 待推送对象）或 unknown；
    不伪造执行事件与成功时间。状态与错误日志均在同步仓库之外。"""
    os.makedirs(STATE_DIR, exist_ok=True)
    if os.path.exists(STATE_FILE):
        return
    scan = scan_large_objects(LFS_LIMIT)
    if scan["available"] and scan["items"]:
        brief = "预检阻断：存在 >100 MiB 对象，当前未执行推送"
        write_cloud_state("fail", brief, None, kind="blocked",
                          violations=scan["items"], record_time=False)
    elif not scan["available"]:
        write_cloud_state("unknown", scan["reason"], None, kind="blocked",
                          record_time=False)
    else:
        write_cloud_state("unknown", "尚无云端记录", None, kind="unknown", record_time=False)


def append_error_log(title, raw_text):
    lines = [_scrub_line(x.rstrip()) for x in (raw_text or "").splitlines()]
    lines = [x for x in lines if x.strip()]
    with log_file_lock:
        os.makedirs(os.path.dirname(ERROR_LOG), exist_ok=True)
        existing = []
        if os.path.isfile(ERROR_LOG):
            with open(ERROR_LOG, "r", encoding="utf-8", errors="replace") as f:
                existing = f.readlines()
        existing.append(f"\n===== {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} [{title}] =====\n")
        existing.extend(x + "\n" for x in lines)
        if len(existing) > ERROR_LOG_MAX_LINES:
            existing = existing[-ERROR_LOG_MAX_LINES:]
        with open(ERROR_LOG, "w", encoding="utf-8") as f:
            f.writelines(existing)


# ---------------- 推送前大对象预检 ----------------
def _git(args, timeout=30):
    return subprocess.run(["git"] + args, cwd=SYNC_REPO, capture_output=True,
                          text=True, timeout=timeout)


def _baseline_ref():
    r = _git(["rev-parse", "--verify", "origin/main"], timeout=5)
    return "origin/main" if r.returncode == 0 and r.stdout.strip() else None


def scan_large_objects(limit=LFS_LIMIT, include_pending=True):
    """覆盖待推送对象：
    1) 基线 origin/main..HEAD 范围内所有可达 blob（历史，仅查工作树不够）；
    2) 暂存区 index blob（文件暂存后工作树缩小也必须检出）；
    3) include_pending=True 时，再检查 git add -A 将纳入的未跟踪/已修改工作树文件。
    任一 git 查询失败、输出无法解析或本地统计异常都 fail closed：available=False，由调用方中止推送。
    GitHub 规则为单文件严格大于 100 MiB 才阻断，因此比较使用 size > limit。
    """
    baseline = _baseline_ref()
    if baseline is None:
        return {"available": False, "reason": "origin/main 跟踪引用缺失，无法核对远端基线，已中止预检",
                "baseline": None, "items": []}

    def unavailable(reason):
        return {"available": False, "reason": reason, "baseline": baseline, "items": []}

    violations = []
    try:
        r = _git(["rev-list", "--objects", f"{baseline}..HEAD"], timeout=120)
        if r.returncode != 0:
            return unavailable("rev-list 读取待推送历史失败: " + _scrub_line(r.stderr.strip())[:120])
        history = {}
        for line in r.stdout.splitlines():
            parts = line.split(" ", 1)
            if len(parts) == 2:
                history[parts[0]] = parts[1]

        staged = {}
        rs = _git(["ls-files", "--stage"], timeout=30)
        if rs.returncode != 0:
            return unavailable("读取暂存区失败: " + _scrub_line(rs.stderr.strip())[:120])
        for line in rs.stdout.splitlines():
            meta, _, path = line.partition("\t")
            cells = meta.split()
            if len(cells) == 3 and cells[1] not in staged:
                staged[cells[1]] = path

        objects = {}
        for sha, path in history.items():
            objects[sha] = ("history", path)
        for sha, path in staged.items():
            if sha not in objects:
                objects[sha] = ("staged", path)

        if objects:
            batch = subprocess.run(
                ["git", "cat-file", "--batch-check=%(objectname) %(objecttype) %(objectsize)"],
                input="\n".join(objects.keys()), cwd=SYNC_REPO,
                capture_output=True, text=True, timeout=120)
            if batch.returncode != 0:
                return unavailable("cat-file 批量读取对象失败: " + _scrub_line(batch.stderr.strip())[:120])
            for line in batch.stdout.splitlines():
                cells = line.split()
                if len(cells) != 3:
                    return unavailable("cat-file 输出解析失败: " + _scrub_line(line)[:120])
                sha, object_type, size_s = cells
                if object_type != "blob":
                    continue
                try:
                    size = int(size_s)
                except ValueError:
                    return unavailable("cat-file 对象大小解析失败: " + _scrub_line(line)[:120])
                if size > limit and sha in objects:
                    kind, path = objects[sha]
                    note = ("历史提交中的大对象；后续提交删除文件不能移除历史，需在推送前清理历史或改用 LFS"
                            if kind == "history" else
                            "暂存区中的大对象；即使工作树已缩小，index blob 仍会进入提交，请先移出同步范围或拆分")
                    violations.append({"kind": kind, "path": path,
                                       "size_bytes": size, "size": fsize(size), "note": note})

        if include_pending:
            pending = []
            for mode in ("--others", "--modified"):
                rr = _git(["ls-files", mode, "--exclude-standard"], timeout=30)
                if rr.returncode != 0:
                    return unavailable(f"ls-files {mode} 读取失败: " + _scrub_line(rr.stderr.strip())[:120])
                pending += [p for p in rr.stdout.splitlines() if p]
            for path in sorted(set(pending)):
                full = os.path.join(SYNC_REPO, path)
                try:
                    if os.path.isfile(full):
                        size = os.path.getsize(full)
                        if size > limit:
                            violations.append({
                                "kind": "input", "path": path,
                                "size_bytes": size, "size": fsize(size),
                                "note": "本次待同步的新增大文件；请先移出同步范围或压缩/拆分后再推送",
                            })
                except OSError as e:
                    return unavailable(f"读取待同步文件大小失败: {path}: {type(e).__name__}")
    except Exception as e:
        return unavailable(f"预检命令执行失败，已中止推送: {type(e).__name__}")

    violations.sort(key=lambda x: -x["size_bytes"])
    return {"available": True, "baseline": baseline, "items": violations}


def _is_divergence(text):
    """只有真正的分支分叉（non-fast-forward / fetch first）才允许自动合并重试。"""
    return ("non-fast-forward" in text or "fetch first" in text
            or "could not be fast-forwarded" in text)


def _classify_remote_error(err):
    low = err.lower()
    if "GH013" in err or "secret" in low or "push protection" in low:
        return "secret", "⚠️ 推送被拦：内容含密钥（完整错误见错误日志），未自动重试"
    if "GH001" in err or "file size limit" in low or "exceeds github" in low or "gh.io/lfs" in low:
        return "size", "⚠️ 推送被拦：文件超过 GitHub 100 MiB 限制（完整错误见错误日志），未自动重试"
    return "other", "推送失败（完整错误见错误日志），未自动重试"


def safe_rel(rel):
    rel = (rel or "").strip("/")
    if any(p == ".." for p in rel.split("/")):
        return None
    return rel


def source_path(scope, rel, direction):
    side = "local" if direction == "push" else "repo"
    if scope == "file":
        return FILES[rel][side]
    if scope == "memories":
        return os.path.join(CLAUDE_DIR, "projects") if side == "local" else os.path.join(SYNC_REPO, "claude-config", "project-memories")
    clean = safe_rel(rel)
    if clean is None:
        raise ValueError("非法路径")
    return os.path.join(SCOPES[scope][side], clean)


def availability(node):
    for side, direction in (("local", "push"), ("repo", "pull")):
        node[side + "_exists"] = os.path.exists(source_path(node["scope"], node.get("rel", ""), direction))
    return node


def list_children(scope, rel):
    """列出某 scope 下 rel 目录的直接子项（本机 + 仓库 取并集）。"""
    sc = SCOPES.get(scope)
    if not sc:
        return []
    rel = safe_rel(rel)
    if rel is None:
        return []
    seen = {}
    for base in (sc.get("local"), sc.get("repo")):
        if not base:
            continue
        d = os.path.join(base, rel) if rel else base
        if os.path.isdir(d):
            try:
                names = os.listdir(d)
            except Exception:
                continue
            for name in names:
                if name.startswith(".") or name in IGNORE or name.endswith(".env"):
                    continue
                full = os.path.join(d, name)
                if name not in seen:
                    isdir = os.path.isdir(full)
                    child_rel = (rel + "/" + name) if rel else name
                    seen[name] = {
                        "key": f"scope:{scope}:{child_rel}",
                        "name": name, "type": "dir" if isdir else "file",
                        "scope": scope, "rel": child_rel,
                        "expandable": isdir, "icon": "📁" if isdir else "📄",
                        "size": node_meta(full, isdir),
                    }
    items = [availability(n) for n in seen.values()]
    items.sort(key=lambda x: (x["type"] != "dir", x["name"].lower()))
    return items


def get_roots():
    claude_nodes = []
    for fid, f in FILES.items():
        p = f["local"] if os.path.exists(f["local"]) else f["repo"]
        claude_nodes.append({
            "key": f"file:{fid}", "label": f["label"], "name": f["label"], "icon": f["icon"], "desc": f["desc"],
            "type": "file", "scope": "file", "rel": fid, "expandable": False,
            "size": fsize(os.path.getsize(p)) if os.path.exists(p) else "—",
        })
    for scope, icon, label, desc in (
        ("skills", "🧩", "技能", "展开可勾选单个技能"),
        ("plugins", "🔌", "插件", "claude-hud 等"),
    ):
        sc = SCOPES[scope]
        base = sc["local"] if os.path.isdir(sc["local"]) else sc["repo"]
        claude_nodes.append({
            "key": f"scope:{scope}:", "label": label, "name": label, "icon": icon, "desc": desc,
            "type": "dir", "scope": scope, "rel": "", "expandable": True,
            "size": node_meta(base, True) if os.path.isdir(base) else "—",
        })
    memrepo = os.path.join(SYNC_REPO, "claude-config", "project-memories")
    claude_nodes.append({
        "key": "scope:memories:", "label": "记忆", "name": "记忆", "icon": "🧠", "desc": "MEMORY.md + 记忆文件",
        "type": "special", "scope": "memories", "rel": "", "expandable": False,
        "size": node_meta(memrepo, True) if os.path.isdir(memrepo) else "—",
    })

    project_nodes = list_children("project", "")
    for n in project_nodes:
        n["label"] = n["name"]

    return [
        {"section": "Claude 配置", "nodes": [availability(n) for n in claude_nodes]},
        {"section": "3.23 项目文件（可展开到单个文件）", "nodes": project_nodes},
    ]


# ---------------- 同步 ----------------
def _fix_user_paths(text):
    u = getpass.getuser()
    return text.replace("/Users/bytedance/", f"/Users/{u}/") if u != "bytedance" else text


def sync_memories(direction):
    repo_base = os.path.join(SYNC_REPO, "claude-config", "project-memories")
    projects = os.path.join(CLAUDE_DIR, "projects")
    cnt = 0
    if direction == "push":
        os.makedirs(repo_base, exist_ok=True)
        if os.path.isdir(projects):
            for proj in os.listdir(projects):
                m = os.path.join(projects, proj, "memory")
                if os.path.isdir(m):
                    dst = os.path.join(repo_base, proj)
                    os.makedirs(dst, exist_ok=True)
                    subprocess.run(["rsync", "-a", m + "/", dst + "/"], check=True, timeout=60)
                    cnt += 1
        return f"已推送 {cnt} 组记忆"
    else:
        u = getpass.getuser()
        if os.path.isdir(repo_base):
            for proj in os.listdir(repo_base):
                src = os.path.join(repo_base, proj)
                proj_local = proj.replace("-Users-bytedance-", f"-Users-{u}-") if u != "bytedance" else proj
                dst = os.path.join(projects, proj_local, "memory")
                os.makedirs(dst, exist_ok=True)
                subprocess.run(["rsync", "-a", src + "/", dst + "/"], check=True, timeout=60)
                cnt += 1
        return f"已拉取 {cnt} 组记忆"


def sync_item(scope, rel, direction):
    if scope == "file":
        f = FILES.get(rel)
        if not f:
            raise ValueError("未知文件")
        src, dst = (f["local"], f["repo"]) if direction == "push" else (f["repo"], f["local"])
        if not os.path.isfile(src):
            raise ValueError("源文件不存在")
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        if rel == "settings":
            with open(src, "r") as fh:
                data = json.loads(_fix_user_paths(fh.read()) if direction == "pull" else fh.read())
            sensitive = lambda key: any(word in key.upper() for word in ("TOKEN", "SECRET", "PASSWORD", "API_KEY"))
            data["env"] = {k: v for k, v in data.get("env", {}).items() if not sensitive(k)}
            if direction == "pull" and os.path.isfile(dst):
                with open(dst) as fh:
                    existing = json.load(fh)
                data["env"].update({k: v for k, v in existing.get("env", {}).items() if sensitive(k)})
            with open(dst, "w") as fh:
                json.dump(data, fh, ensure_ascii=False, indent=2)
        else:
            shutil.copy2(src, dst)
        return "已复制"
    if scope == "memories":
        return sync_memories(direction)
    sc = SCOPES.get(scope)
    if not sc:
        raise ValueError("未知范围")
    rel = safe_rel(rel)
    if rel is None:
        raise ValueError("非法路径")
    src_base, dst_base = (sc["local"], sc["repo"]) if direction == "push" else (sc["repo"], sc["local"])
    src = os.path.join(src_base, rel) if rel else src_base
    dst = os.path.join(dst_base, rel) if rel else dst_base
    if os.path.isdir(src):
        os.makedirs(dst, exist_ok=True)
        subprocess.run(["rsync", "-a"] + RSYNC_EX + [src + "/", dst + "/"], check=True, timeout=600)
        return "已同步文件夹"
    elif os.path.isfile(src):
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copy2(src, dst)
        return "已同步文件"
    raise ValueError("源不存在")


def delete_item(scope, rel):
    """删除本机 + 仓库里的该文件/文件夹（之后提交推送，另一台拉取时跟随删除）。"""
    if scope == "file":
        f = FILES.get(rel)
        if not f:
            raise ValueError("未知文件")
        for p in (f["local"], f["repo"]):
            if os.path.exists(p):
                os.remove(p)
        return "已删除"
    if scope == "memories":
        return "记忆不支持在此删除"
    sc = SCOPES.get(scope)
    if not sc:
        raise ValueError("未知范围")
    rel = safe_rel(rel)
    if not rel:
        return "不能删除整个根目录（请选具体文件/文件夹）"
    for base in (sc.get("local"), sc.get("repo")):
        if not base:
            continue
        p = os.path.join(base, rel)
        if os.path.exists(p):
            shutil.rmtree(p) if os.path.isdir(p) else os.remove(p)
    return "已删除"


def dedupe_items(items):
    """若已选中某文件夹，则其子项无需重复同步。"""
    sel = set((it["scope"], safe_rel(it.get("rel", "")) or "") for it in items if it["scope"] in SCOPES)
    out = []
    for it in items:
        scope = it["scope"]
        rel = safe_rel(it.get("rel", "")) or ""
        if scope in SCOPES and rel:
            parts = rel.split("/")
            covered = any((scope, "/".join(parts[:i])) in sel and "/".join(parts[:i]) != rel for i in range(len(parts)))
            if covered:
                continue
        out.append(it)
    return out


def _head_sha():
    r = _git(["rev-parse", "HEAD"], timeout=5)
    return r.stdout.strip() if r.returncode == 0 else None


def _format_violations(items):
    lines = []
    for v in items:
        lines.append(f"[{v['kind']}] {v['path']} — {v['size']} ({v['size_bytes']} B)；{v['note']}")
    return lines


def _preflight_history_index(results):
    """在任何 sync_item/delete_item 复制或删除前，只读检查历史可达 blob 与暂存区 blob。
    检查失败或发现超限对象都直接阻断，不触碰本地选择目录与仓库文件。"""
    scan = scan_large_objects(LFS_LIMIT, include_pending=False)
    if not scan["available"]:
        append_error_log("precheck-unavailable", scan["reason"])
        write_cloud_state("fail", scan["reason"], "push", kind="blocked", record_time=False)
        results.append({"item": "云端", "status": "fail", "msg": scan["reason"]})
        return False
    if scan["items"]:
        detail = _format_violations(scan["items"])
        append_error_log("precheck-large-objects", "\n".join(detail))
        head = _head_sha()
        shown = detail[:5]
        more = f"\n…另有 {len(detail) - 5} 项，完整清单见错误日志" if len(detail) > 5 else ""
        msg = "预检拦截：存在 >100 MiB 对象，未执行复制与推送。\n" + "\n".join(shown) + more
        write_cloud_state("fail", "预检拦截：存在 >100 MiB 对象，未执行推送", "push",
                          head, kind="blocked", violations=scan["items"])
        results.append({"item": "云端", "status": "fail", "msg": msg})
        return False
    return True


def _git_push_result(results):
    # 本地复制完成后的复检：历史 + 暂存区 + 新进入工作树的待同步输入；基线/查询失败直接中止，不盲推
    settings_path = FILES["settings"]["repo"]
    if os.path.isfile(settings_path):
        with open(settings_path) as fh:
            config = json.load(fh)
        config["env"] = {k: v for k, v in config.get("env", {}).items()
                         if not any(word in k.upper() for word in ("TOKEN", "SECRET", "PASSWORD", "API_KEY"))}
        with open(settings_path, "w") as fh:
            json.dump(config, fh, ensure_ascii=False, indent=2)
    prepare_large_files(SYNC_REPO)
    scan = scan_large_objects(LFS_LIMIT)
    if not scan["available"]:
        append_error_log("precheck-unavailable", scan["reason"])
        write_cloud_state("fail", scan["reason"], "push", kind="blocked", record_time=False)
        results.append({"item": "云端", "status": "fail", "msg": scan["reason"]})
        return
    if scan["items"]:
        detail = _format_violations(scan["items"])
        append_error_log("precheck-large-objects", "\n".join(detail))
        head = _head_sha()
        shown = detail[:5]
        more = f"\n…另有 {len(detail) - 5} 项，完整清单见错误日志" if len(detail) > 5 else ""
        msg = "复检拦截：存在 >100 MiB 对象，未执行推送。\n" + "\n".join(shown) + more
        write_cloud_state("fail", "复检拦截：存在 >100 MiB 对象，未执行推送", "push",
                          head, kind="blocked", violations=scan["items"])
        results.append({"item": "云端", "status": "fail", "msg": msg})
        return

    subprocess.run(["git", "add", "-A"], cwd=SYNC_REPO, timeout=120, check=True)
    diff = subprocess.run(["git", "diff", "--cached", "--stat"], capture_output=True, text=True, cwd=SYNC_REPO, timeout=10, check=True)
    if diff.stdout.strip():
        ts = datetime.now().strftime("%Y-%m-%d %H:%M")
        subprocess.run(["git", "commit", "-m", f"sync {ts}"], cwd=SYNC_REPO, timeout=30, check=True)
    remote = subprocess.run(["git", "remote"], capture_output=True, text=True, cwd=SYNC_REPO, timeout=5)
    if not remote.stdout.strip():
        write_cloud_state("fail", "已本地提交，但没配 GitHub 远程", "push", _head_sha())
        results.append({"item": "云端", "status": "fail", "msg": "已本地提交，但没配 GitHub 远程"})
        return

    push = subprocess.run(["git", "push", "origin", "main"], capture_output=True, text=True, cwd=SYNC_REPO, timeout=600)
    both = (push.stderr or "") + (push.stdout or "")
    retried = False
    # 分叉时保留双方版本，交由用户解决冲突，不自动选择覆盖。
    if push.returncode == 0:
        head = _head_sha()
        write_cloud_state("ok", "✅ 已推送到 GitHub", "push", head)
        results.append({"item": "云端", "status": "ok", "msg": "✅ 已推送到 GitHub"})
        return

    err = both.strip()
    tag, brief = _classify_remote_error(err)
    title = "push-rejected-after-retry" if retried else "push-rejected"
    append_error_log(f"{title} [{tag}]", err)
    head = _head_sha()
    write_cloud_state("fail", brief, "push", head)
    results.append({"item": "云端", "status": "fail", "msg": brief})


def repo_to_local(repo_path):
    if repo_path.startswith("project-3.23/"):
        return os.path.join(PROJECT_DIR, repo_path[len("project-3.23/"):])
    if repo_path.startswith("claude-config/skills/"):
        return os.path.join(CLAUDE_DIR, "skills", repo_path[len("claude-config/skills/"):])
    if repo_path.startswith("claude-config/plugins/"):
        return os.path.join(CLAUDE_DIR, "plugins", repo_path[len("claude-config/plugins/"):])
    if repo_path == "claude-config/CLAUDE.md":
        return os.path.join(CLAUDE_DIR, "CLAUDE.md")
    if repo_path == "claude-config/settings.json":
        return os.path.join(CLAUDE_DIR, "settings.json")
    return None


def apply_repo_deletions():
    """凡是'git 历史里被删过、且当前仓库已无'的文件，就从本机工作区删掉。
    本机自己新建、从未推送过的文件不在 git 历史里，绝不会被误删。"""
    deleted = subprocess.run(
        ["git", "-c", "core.quotepath=false", "log", "--diff-filter=D", "--name-only", "--format="],
        capture_output=True, text=True, cwd=SYNC_REPO, timeout=60).stdout
    current = subprocess.run(
        ["git", "-c", "core.quotepath=false", "ls-files"],
        capture_output=True, text=True, cwd=SYNC_REPO, timeout=60).stdout
    gone = set(p for p in deleted.splitlines() if p.strip()) - set(current.splitlines())
    n = 0
    for repo_path in gone:
        local = repo_to_local(repo_path)
        if local and os.path.exists(local):
            try:
                shutil.rmtree(local) if os.path.isdir(local) else os.remove(local)
                n += 1
            except Exception:
                pass
    return n


def _run_sync_impl(items, direction, all_items=False):
    results = []
    if not os.path.isdir(os.path.join(SYNC_REPO, ".git")):
        return [{"item": "错误", "status": "fail", "msg": "仓库未初始化"}]
    if direction not in ("push", "pull", "delete"):
        return [{"item": "错误", "status": "fail", "msg": "无效同步方向"}]
    items = dedupe_items(items)
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    if all_items and direction == "push":
        available = []
        for it in items:
            if os.path.exists(source_path(it["scope"], it.get("rel", ""), direction)):
                available.append(it)
            else:
                results.append({"item": it.get("label") or it.get("rel") or it["scope"],
                                "status": "skipped", "msg": "本机不存在，已跳过；仓库备份保留"})
        items = available
        if not items:
            return results + [{"item": "云端", "status": "fail", "msg": "本机没有可推送的内容"}]

    if direction in ("push", "delete"):
        prepare_large_files(SYNC_REPO)
        # 先做历史/暂存区只读预检；阻断时不执行任何 sync_item/delete_item 复制或删除
        if _preflight_history_index(results):
            for it in items:
                label = it.get("label") or it.get("rel") or it["scope"]
                try:
                    results.append({"item": label, "status": "ok",
                                    "msg": sync_item(it["scope"], it.get("rel", ""), "push")
                                          if direction == "push" else delete_item(it["scope"], it.get("rel", ""))})
                except Exception as e:
                    results.append({"item": label, "status": "fail", "msg": str(e)})
            try:
                if not any(r["status"] == "fail" for r in results):
                    _git_push_result(results)
                else:
                    write_cloud_state("fail", "本次文件收集失败，未上传；此前云端版本保留", direction, _head_sha())
            except Exception as e:
                write_cloud_state("fail", f"Git: {e}", direction, _head_sha())
                results.append({"item": "云端", "status": "fail", "msg": _scrub_line(str(e))})
    else:
        try:
            pull = subprocess.run(["git", "pull", "--ff-only", "origin", "main"],
                                  capture_output=True, text=True, cwd=SYNC_REPO, timeout=600)
            if pull.returncode == 0:
                write_cloud_state("ok", "✅ 已从 GitHub 拉取", "pull", _head_sha())
                results.append({"item": "云端", "status": "ok", "msg": "✅ 已从 GitHub 拉取"})
            else:
                err = (pull.stderr or pull.stdout).strip()
                append_error_log("pull-rejected", err)
                write_cloud_state("fail", "拉取失败，完整错误见错误日志", "pull", _head_sha())
                results.append({"item": "云端", "status": "fail", "msg": "拉取失败，完整错误见错误日志"})
        except Exception as e:
            write_cloud_state("fail", f"Git pull: {e}", "pull", _head_sha())
            results.append({"item": "云端", "status": "fail", "msg": f"Git pull: {e}"})
        if any(r["status"] == "fail" for r in results):
            return results
        try:
            restore_large_files(SYNC_REPO)
        except Exception as e:
            return results + [{"item": "大文件还原", "status": "fail", "msg": str(e)}]
        if MIRROR:
            try:
                dn = apply_repo_deletions()
                if dn:
                    results.append({"item": "删除同步", "status": "ok", "msg": f"已删除 {dn} 个云端移除的文件"})
            except Exception:
                pass
        # 在覆盖工作目录前保存可恢复副本；备份失败则停止。
        backup = os.path.join(STATE_DIR, "pull-backups", datetime.now().strftime("%Y%m%d-%H%M%S-%f"))
        try:
            for it in items:
                scope, rel = it["scope"], it.get("rel", "")
                if scope == "file":
                    src = FILES[rel]["local"]
                elif scope == "memories":
                    src = os.path.join(CLAUDE_DIR, "projects")
                else:
                    clean = safe_rel(rel)
                    if clean is None:
                        raise ValueError("非法路径")
                    src = os.path.join(SCOPES[scope]["local"], clean)
                if os.path.exists(src):
                    dst = os.path.join(backup, os.path.relpath(src, HOME))
                    os.makedirs(os.path.dirname(dst), exist_ok=True)
                    if os.path.isdir(src):
                        shutil.copytree(src, dst, dirs_exist_ok=True, symlinks=True)
                    else:
                        shutil.copy2(src, dst)
        except Exception as e:
            return results + [{"item": "备份", "status": "fail", "msg": str(e)}]
        for it in items:
            label = it.get("label") or it.get("rel") or it["scope"]
            try:
                results.append({"item": label, "status": "ok", "msg": sync_item(it["scope"], it.get("rel", ""), "pull")})
            except Exception as e:
                results.append({"item": label, "status": "fail", "msg": str(e)})

    return results


def run_sync(items, direction, all_items=False):
    """Every batch, including early failures, gets a durable result."""
    try:
        results = _run_sync_impl(items, direction, all_items)
    except Exception as exc:
        message = _scrub_line(str(exc))
        append_error_log("batch-failed", message)
        results = [{"item": "同步服务", "status": "fail", "msg": message}]
    if any(r.get("status") == "fail" for r in results):
        write_cloud_state("fail", "本次同步未完成，查看逐项结果；此前云端版本保留", direction, _head_sha())
    event = {"time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
             "direction": direction, "count": len(items), "results": results}
    with log_lock:
        sync_log.append(event)
        del sync_log[:-8]
        _atomic_write_json(os.path.join(STATE_DIR, "batch-results.json"), sync_log)
    return results


class H(http.server.BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def _json(self, d, s=200):
        self.send_response(s)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(d, ensure_ascii=False).encode())

    def do_GET(self):
        u = urlparse(self.path)
        q = parse_qs(u.query)
        if u.path in ("/", "/dashboard"):
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            with open(DASHBOARD, "rb") as f:
                self.wfile.write(f.read())
            return
        if u.path == "/api/roots":
            self._json(get_roots())
            return
        if u.path == "/api/tree":
            self._json(list_children(q.get("scope", [""])[0], q.get("rel", [""])[0]))
            return
        if u.path == "/api/status":
            has_remote = False
            try:
                r = subprocess.run(["git", "remote"], capture_output=True, text=True, cwd=SYNC_REPO, timeout=5)
                has_remote = bool(r.stdout.strip())
            except Exception:
                pass
            cloud = read_cloud_state()
            with log_lock:
                recent = list(sync_log[-8:])
                if not recent:
                    try:
                        with open(os.path.join(STATE_DIR, "batch-results.json")) as fh:
                            recent = json.load(fh)[-8:]
                    except (OSError, ValueError, TypeError):
                        recent = []
            self._json({
                "initialized": os.path.isdir(os.path.join(SYNC_REPO, ".git")),
                "has_remote": has_remote,
                "cloud_state": cloud,
                # last_sync 以云端持久化结果为准；本地提交时间单独放到 local_commit，不再混用
                "last_sync": {"time": cloud.get("time"), "message": cloud.get("message")} if cloud.get("time") else None,
                "local_commit": get_git_last_sync(),
                "log": recent,
            })
            return
        self.send_error(404)

    def do_POST(self):
        u = urlparse(self.path)
        if u.path == "/api/sync":
            try:
                n = int(self.headers.get("Content-Length", 0))
                if not 0 < n <= 1024 * 1024:
                    raise ValueError("请求大小不正确")
                body = json.loads(self.rfile.read(n))
                if not isinstance(body, dict) or not isinstance(body.get("items"), list):
                    raise ValueError("请求格式不正确")
            except (ValueError, TypeError) as exc:
                self._json({"error": str(exc)}, 400)
                return
            items = body.get("items", [])
            direction = body.get("direction", "push")
            if not items:
                self._json({"error": "没有选择任何文件/文件夹"}, 400)
                return
            if not sync_lock.acquire(blocking=False):
                self._json({"error": "正在同步中，请稍候"}, 409)
                return
            try:
                os.makedirs(STATE_DIR, exist_ok=True)
                with open(os.path.join(STATE_DIR, "upload.lock"), "w") as lock:
                    try:
                        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
                    except BlockingIOError:
                        self._json({"error": "另一个同步入口正在运行"}, 409)
                        return
                    self._json({"results": run_sync(items, direction, all_items=body.get("all") is True)})
            except Exception as exc:
                append_error_log("request-failed", str(exc))
                self._json({"error": "同步服务异常：" + _scrub_line(str(exc))}, 500)
            finally:
                sync_lock.release()
            return
        self.send_error(404)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()


if __name__ == "__main__":
    # 启动时按只读预检在仓库外落初始 blocked/unknown 状态，不伪造事件时间
    init_persistent_state()
    # 多线程处理请求：写操作仍由 sync_lock 串行；GET 只读接口不持锁，不再被长 POST 阻塞
    httpd = http.server.ThreadingHTTPServer(("127.0.0.1", PORT), H)
    httpd.daemon_threads = True
    print(f"Claude Code 同步管理 · http://localhost:{PORT}")
    httpd.serve_forever()
