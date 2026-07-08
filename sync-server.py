#!/usr/bin/env python3
"""Claude Code 同步管理 · 精细文件树版
访问 http://localhost:9527"""
import http.server, json, os, subprocess, threading, shutil, getpass
from urllib.parse import urlparse, parse_qs
from datetime import datetime

PORT = 9527
HOME = os.path.expanduser("~")
CLAUDE_DIR = os.path.join(HOME, ".claude")
PROJECT_DIR = os.path.join(HOME, "Desktop", "3.23")
SYNC_REPO = os.path.join(HOME, ".claude-sync")
DASHBOARD = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dashboard.html")

IGNORE = {".git", "node_modules", ".venv", "__pycache__", ".DS_Store"}
RSYNC_EX = ["--exclude=.git/", "--exclude=node_modules/", "--exclude=.venv/",
            "--exclude=.env", "--exclude=*.env", "--exclude=*.mp4", "--exclude=*.mp3",
            "--exclude=*.wav", "--exclude=*.tar.gz", "--exclude=__pycache__/",
            "--exclude=.DS_Store",
            "--exclude=video-panel/output/", "--exclude=video-panel/bin/",
            "--exclude=Recordly/.tmp/", "--exclude=.whiteboard-build/",
            "--exclude=claude-code-sync/"]
MIRROR = True   # 镜像模式：删除也同步（推送带 --delete，拉取按 git 精确删除）

SCOPES = {
    "project": {"local": PROJECT_DIR, "repo": os.path.join(SYNC_REPO, "project-3.23")},
    "skills":  {"local": os.path.join(CLAUDE_DIR, "skills"),  "repo": os.path.join(SYNC_REPO, "claude-config", "skills")},
    "plugins": {"local": os.path.join(CLAUDE_DIR, "plugins"), "repo": os.path.join(SYNC_REPO, "claude-config", "plugins")},
}
FILES = {
    "claude-md": {"local": os.path.join(CLAUDE_DIR, "CLAUDE.md"),     "repo": os.path.join(SYNC_REPO, "claude-config", "CLAUDE.md"),     "label": "CLAUDE.md",     "icon": "📋", "desc": "全局指令"},
    "settings":  {"local": os.path.join(CLAUDE_DIR, "settings.json"), "repo": os.path.join(SYNC_REPO, "claude-config", "settings.json"), "label": "settings.json", "icon": "⚙️", "desc": "设置 / 模型 / 环境变量"},
}

sync_lock = threading.Lock()
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
    try:
        r = subprocess.run(["git", "log", "-1", "--format=%ar|||%s"],
                           capture_output=True, text=True, cwd=SYNC_REPO, timeout=5)
        if r.returncode == 0 and r.stdout.strip():
            p = r.stdout.strip().split("|||")
            return {"time": p[0], "message": p[1] if len(p) > 1 else ""}
    except Exception:
        pass
    return None


def safe_rel(rel):
    rel = (rel or "").strip("/")
    if any(p == ".." for p in rel.split("/")):
        return None
    return rel


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
    items = list(seen.values())
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
        {"section": "Claude 配置", "nodes": claude_nodes},
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
            return "未知文件"
        src, dst = (f["local"], f["repo"]) if direction == "push" else (f["repo"], f["local"])
        if not os.path.isfile(src):
            return "源文件不存在"
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        if rel == "settings" and direction == "pull":
            with open(src, "r") as fh:
                data = fh.read()
            with open(dst, "w") as fh:
                fh.write(_fix_user_paths(data))
        else:
            shutil.copy2(src, dst)
        return "已复制"
    if scope == "memories":
        return sync_memories(direction)
    sc = SCOPES.get(scope)
    if not sc:
        return "未知范围"
    rel = safe_rel(rel)
    if rel is None:
        return "非法路径"
    src_base, dst_base = (sc["local"], sc["repo"]) if direction == "push" else (sc["repo"], sc["local"])
    src = os.path.join(src_base, rel) if rel else src_base
    dst = os.path.join(dst_base, rel) if rel else dst_base
    if os.path.isdir(src):
        os.makedirs(dst, exist_ok=True)
        extra = ["--delete"] if (MIRROR and direction == "push") else []
        subprocess.run(["rsync", "-a"] + extra + RSYNC_EX + [src + "/", dst + "/"], check=True, timeout=600)
        return "已同步文件夹"
    elif os.path.isfile(src):
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copy2(src, dst)
        return "已同步文件"
    return "源不存在"


def delete_item(scope, rel):
    """删除本机 + 仓库里的该文件/文件夹（之后提交推送，另一台拉取时跟随删除）。"""
    if scope == "file":
        f = FILES.get(rel)
        if not f:
            return "未知文件"
        for p in (f["local"], f["repo"]):
            if os.path.exists(p):
                os.remove(p)
        return "已删除"
    if scope == "memories":
        return "记忆不支持在此删除"
    sc = SCOPES.get(scope)
    if not sc:
        return "未知范围"
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


def _git_push_result(results):
    subprocess.run(["git", "add", "-A"], cwd=SYNC_REPO, timeout=120)
    diff = subprocess.run(["git", "diff", "--cached", "--stat"], capture_output=True, text=True, cwd=SYNC_REPO, timeout=10)
    if not diff.stdout.strip():
        results.append({"item": "云端", "status": "ok", "msg": "无变更，无需推送"})
        return
    ts = datetime.now().strftime("%Y-%m-%d %H:%M")
    subprocess.run(["git", "commit", "-m", f"sync {ts}"], cwd=SYNC_REPO, timeout=30)
    remote = subprocess.run(["git", "remote"], capture_output=True, text=True, cwd=SYNC_REPO, timeout=5)
    if not remote.stdout.strip():
        results.append({"item": "云端", "status": "fail", "msg": "已本地提交，但没配 GitHub 远程"})
        return
    push = subprocess.run(["git", "push", "origin", "main"], capture_output=True, text=True, cwd=SYNC_REPO, timeout=600)
    if push.returncode == 0:
        results.append({"item": "云端", "status": "ok", "msg": "✅ 已推送到 GitHub"})
    else:
        err = (push.stderr or push.stdout).strip()
        if "GH013" in err or "secret" in err.lower() or "push protection" in err.lower():
            results.append({"item": "云端", "status": "fail", "msg": "⚠️ 推送被拦：内容含密钥。已本地提交，清理后重推"})
        else:
            results.append({"item": "云端", "status": "fail", "msg": f"推送失败: {err[:150]}"})


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


def apply_repo_deletions(before, after):
    """把云端本次新删掉的文件，同步删本机对应文件；本机独有(未推送)的文件不受影响。"""
    r = subprocess.run(["git", "diff", "--name-status", before, after],
                       capture_output=True, text=True, cwd=SYNC_REPO, timeout=30)
    n = 0
    for line in r.stdout.splitlines():
        parts = line.split("\t")
        if len(parts) >= 2 and parts[0].startswith("D"):
            local = repo_to_local(parts[1])
            if local and os.path.exists(local):
                try:
                    shutil.rmtree(local) if os.path.isdir(local) else os.remove(local)
                    n += 1
                except Exception:
                    pass
    return n


def run_sync(items, direction):
    results = []
    if not os.path.isdir(os.path.join(SYNC_REPO, ".git")):
        return [{"item": "错误", "status": "fail", "msg": "仓库未初始化"}]
    items = dedupe_items(items)
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    if direction == "push":
        for it in items:
            label = it.get("label") or it.get("rel") or it["scope"]
            try:
                results.append({"item": label, "status": "ok", "msg": sync_item(it["scope"], it.get("rel", ""), "push")})
            except Exception as e:
                results.append({"item": label, "status": "fail", "msg": str(e)})
        try:
            _git_push_result(results)
        except Exception as e:
            results.append({"item": "云端", "status": "fail", "msg": f"Git: {e}"})
    elif direction == "delete":
        for it in items:
            label = it.get("label") or it.get("rel") or it["scope"]
            try:
                results.append({"item": label, "status": "ok", "msg": delete_item(it["scope"], it.get("rel", ""))})
            except Exception as e:
                results.append({"item": label, "status": "fail", "msg": str(e)})
        try:
            _git_push_result(results)   # 提交删除并推送到云
        except Exception as e:
            results.append({"item": "云端", "status": "fail", "msg": f"Git: {e}"})
    else:
        before = ""
        try:
            before = subprocess.run(["git", "rev-parse", "HEAD"], capture_output=True, text=True, cwd=SYNC_REPO, timeout=5).stdout.strip()
        except Exception:
            pass
        try:
            pull = subprocess.run(["git", "pull", "origin", "main"], capture_output=True, text=True, cwd=SYNC_REPO, timeout=600)
            if pull.returncode == 0:
                results.append({"item": "云端", "status": "ok", "msg": "✅ 已从 GitHub 拉取"})
            else:
                results.append({"item": "云端", "status": "fail", "msg": f"拉取失败: {(pull.stderr or pull.stdout).strip()[:150]}"})
        except Exception as e:
            results.append({"item": "云端", "status": "fail", "msg": f"Git pull: {e}"})
        if MIRROR and before:
            try:
                after = subprocess.run(["git", "rev-parse", "HEAD"], capture_output=True, text=True, cwd=SYNC_REPO, timeout=5).stdout.strip()
                if after and after != before:
                    dn = apply_repo_deletions(before, after)
                    if dn:
                        results.append({"item": "删除同步", "status": "ok", "msg": f"跟随云端删除了 {dn} 项"})
            except Exception:
                pass
        for it in items:
            label = it.get("label") or it.get("rel") or it["scope"]
            try:
                results.append({"item": label, "status": "ok", "msg": sync_item(it["scope"], it.get("rel", ""), "pull")})
            except Exception as e:
                results.append({"item": label, "status": "fail", "msg": str(e)})

    sync_log.append({"time": ts, "direction": direction, "count": len(items), "results": results})
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
            self._json({"initialized": os.path.isdir(os.path.join(SYNC_REPO, ".git")),
                        "has_remote": has_remote, "last_sync": get_git_last_sync(), "log": sync_log[-8:]})
            return
        self.send_error(404)

    def do_POST(self):
        u = urlparse(self.path)
        if u.path == "/api/sync":
            n = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(n))
            items = body.get("items", [])
            direction = body.get("direction", "push")
            if not items:
                self._json({"error": "没有选择任何文件/文件夹"}, 400)
                return
            if not sync_lock.acquire(blocking=False):
                self._json({"error": "正在同步中，请稍候"}, 409)
                return
            try:
                self._json({"results": run_sync(items, direction)})
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
    print(f"Claude 同步管理 · http://localhost:{PORT}")
    http.server.HTTPServer(("127.0.0.1", PORT), H).serve_forever()
