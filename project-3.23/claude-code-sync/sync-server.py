#!/usr/bin/env python3
"""
Claude Code 同步管理服务器
启动后访问 http://localhost:9527
"""
import http.server
import json
import os
import subprocess
import threading
import time
from pathlib import Path
from urllib.parse import urlparse, parse_qs
from datetime import datetime

PORT = 9527
HOME = os.path.expanduser("~")
CLAUDE_DIR = os.path.join(HOME, ".claude")
PROJECT_DIR = os.path.join(HOME, "Desktop", "3.23")
SYNC_REPO = os.path.join(HOME, ".claude-sync")
DASHBOARD_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dashboard.html")

sync_lock = threading.Lock()
sync_log = []


def get_dir_size(path):
    if not os.path.exists(path):
        return 0
    try:
        result = subprocess.run(
            ["du", "-sk", path], capture_output=True, text=True, timeout=10
        )
        kb = int(result.stdout.split()[0])
        return kb * 1024
    except Exception:
        return 0


def format_size(size_bytes):
    if size_bytes < 1024:
        return f"{size_bytes}B"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.1f}K"
    elif size_bytes < 1024 * 1024 * 1024:
        return f"{size_bytes / (1024 * 1024):.1f}M"
    else:
        return f"{size_bytes / (1024 * 1024 * 1024):.1f}G"


def get_git_last_sync():
    try:
        result = subprocess.run(
            ["git", "log", "-1", "--format=%ar|||%s"],
            capture_output=True, text=True, cwd=SYNC_REPO, timeout=5
        )
        if result.returncode == 0 and result.stdout.strip():
            parts = result.stdout.strip().split("|||")
            return {"time": parts[0], "message": parts[1] if len(parts) > 1 else ""}
        return None
    except Exception:
        return None


def get_modules():
    modules = []

    # 1. CLAUDE.md
    p = os.path.join(CLAUDE_DIR, "CLAUDE.md")
    modules.append({
        "id": "claude-md",
        "name": "CLAUDE.md",
        "desc": "全局指令文件",
        "category": "claude-config",
        "icon": "📋",
        "size": format_size(os.path.getsize(p)) if os.path.exists(p) else "—",
        "exists": os.path.exists(p),
    })

    # 2. settings.json
    p = os.path.join(CLAUDE_DIR, "settings.json")
    modules.append({
        "id": "settings",
        "name": "settings.json",
        "desc": "设置 / 环境变量 / 模型偏好",
        "category": "claude-config",
        "icon": "⚙️",
        "size": format_size(os.path.getsize(p)) if os.path.exists(p) else "—",
        "exists": os.path.exists(p),
    })

    # 3. Skills
    skills_dir = os.path.join(CLAUDE_DIR, "skills")
    if os.path.isdir(skills_dir):
        skill_names = sorted([
            d for d in os.listdir(skills_dir)
            if os.path.isdir(os.path.join(skills_dir, d)) and not d.startswith(".")
        ])
        modules.append({
            "id": "skills",
            "name": f"Skills ({len(skill_names)} 个)",
            "desc": ", ".join(skill_names[:8]) + ("..." if len(skill_names) > 8 else ""),
            "category": "claude-config",
            "icon": "🧩",
            "size": format_size(get_dir_size(skills_dir)),
            "exists": True,
            "children": skill_names,
        })

    # 4. Plugins
    plugins_dir = os.path.join(CLAUDE_DIR, "plugins")
    modules.append({
        "id": "plugins",
        "name": "Plugins",
        "desc": "已安装插件 (claude-hud 等)",
        "category": "claude-config",
        "icon": "🔌",
        "size": format_size(get_dir_size(plugins_dir)) if os.path.isdir(plugins_dir) else "—",
        "exists": os.path.isdir(plugins_dir),
    })

    # 5. 项目记忆
    projects_dir = os.path.join(CLAUDE_DIR, "projects")
    memory_count = 0
    if os.path.isdir(projects_dir):
        for proj in os.listdir(projects_dir):
            mem = os.path.join(projects_dir, proj, "memory")
            if os.path.isdir(mem):
                memory_count += len([
                    f for f in os.listdir(mem) if f.endswith(".md")
                ])
    modules.append({
        "id": "memories",
        "name": f"项目记忆 ({memory_count} 个文件)",
        "desc": "跨会话持久化的记忆 (MEMORY.md + 记忆文件)",
        "category": "claude-config",
        "icon": "🧠",
        "size": format_size(get_dir_size(os.path.join(projects_dir))) if os.path.isdir(projects_dir) else "—",
        "exists": memory_count > 0,
    })

    # 6-N. 3.23 项目子目录
    if os.path.isdir(PROJECT_DIR):
        project_groups = {
            "产品文档": [],
            "场景知识": [],
            "Wiki & Raw": [],
            "脚本 & 工具": [],
            "其他": [],
        }
        skip = {
            "video-panel", "Recordly", ".whiteboard-build",
            "claude-code-sync", ".claude", "node_modules",
        }

        for item in sorted(os.listdir(PROJECT_DIR)):
            full = os.path.join(PROJECT_DIR, item)
            if item.startswith(".") and item != ".claude":
                continue
            if item in skip:
                continue

            if item.startswith("产品-"):
                project_groups["产品文档"].append(item)
            elif item.startswith("场景知识"):
                project_groups["场景知识"].append(item)
            elif item in ("wiki", "raw", "raw_cleaned"):
                project_groups["Wiki & Raw"].append(item)
            elif item.startswith("脚本") or item in ("video-panel", "whiteboard"):
                project_groups["脚本 & 工具"].append(item)
            else:
                project_groups["其他"].append(item)

        icons = {"产品文档": "📦", "场景知识": "🎯", "Wiki & Raw": "📚", "脚本 & 工具": "🛠️", "其他": "📁"}

        for group_name, items in project_groups.items():
            if not items:
                continue
            total_size = sum(
                get_dir_size(os.path.join(PROJECT_DIR, i))
                if os.path.isdir(os.path.join(PROJECT_DIR, i))
                else os.path.getsize(os.path.join(PROJECT_DIR, i))
                for i in items if os.path.exists(os.path.join(PROJECT_DIR, i))
            )
            modules.append({
                "id": f"project-{group_name}",
                "name": f"{group_name} ({len(items)} 项)",
                "desc": ", ".join(items[:5]) + ("..." if len(items) > 5 else ""),
                "category": "project",
                "icon": icons.get(group_name, "📁"),
                "size": format_size(total_size),
                "exists": True,
                "children": items,
            })

    return modules


def run_sync(module_ids, direction):
    """执行同步"""
    results = []
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    if not os.path.isdir(os.path.join(SYNC_REPO, ".git")):
        return [{"module": "error", "status": "fail", "msg": "同步仓库未初始化，请先运行 init"}]

    for mid in module_ids:
        try:
            if direction == "push":
                msg = sync_push_module(mid)
            else:
                msg = sync_pull_module(mid)
            results.append({"module": mid, "status": "ok", "msg": msg})
        except Exception as e:
            results.append({"module": mid, "status": "fail", "msg": str(e)})

    # git commit + push/pull
    if direction == "push":
        try:
            subprocess.run(["git", "add", "-A"], cwd=SYNC_REPO, timeout=30)
            diff = subprocess.run(
                ["git", "diff", "--cached", "--stat"],
                capture_output=True, text=True, cwd=SYNC_REPO, timeout=10
            )
            if diff.stdout.strip():
                names = ", ".join(module_ids[:3])
                subprocess.run(
                    ["git", "commit", "-m", f"sync {names} ({timestamp})"],
                    cwd=SYNC_REPO, timeout=30
                )
                subprocess.run(["git", "push"], cwd=SYNC_REPO, timeout=120)
                results.append({"module": "git", "status": "ok", "msg": "已推送到远程"})
            else:
                results.append({"module": "git", "status": "ok", "msg": "无变更需要推送"})
        except Exception as e:
            results.append({"module": "git", "status": "fail", "msg": f"Git 操作失败: {e}"})
    else:
        try:
            subprocess.run(["git", "pull"], cwd=SYNC_REPO, timeout=120)
            results.append({"module": "git", "status": "ok", "msg": "已从远程拉取"})
        except Exception as e:
            results.append({"module": "git", "status": "fail", "msg": f"Git pull 失败: {e}"})

    sync_log.append({"time": timestamp, "direction": direction, "modules": module_ids, "results": results})
    return results


def sync_push_module(mid):
    """推送单个模块到同步仓库"""
    os.makedirs(SYNC_REPO, exist_ok=True)

    if mid == "claude-md":
        src = os.path.join(CLAUDE_DIR, "CLAUDE.md")
        dst = os.path.join(SYNC_REPO, "claude-config", "CLAUDE.md")
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        subprocess.run(["cp", src, dst], check=True, timeout=10)
        return "已复制"

    elif mid == "settings":
        src = os.path.join(CLAUDE_DIR, "settings.json")
        dst = os.path.join(SYNC_REPO, "claude-config", "settings.json")
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        subprocess.run(["cp", src, dst], check=True, timeout=10)
        return "已复制"

    elif mid == "skills":
        src = os.path.join(CLAUDE_DIR, "skills") + "/"
        dst = os.path.join(SYNC_REPO, "claude-config", "skills") + "/"
        os.makedirs(dst, exist_ok=True)
        subprocess.run([
            "rsync", "-a", "--delete",
            "--exclude=.git/", "--exclude=node_modules/",
            src, dst
        ], check=True, timeout=120)
        return "已同步"

    elif mid == "plugins":
        src = os.path.join(CLAUDE_DIR, "plugins") + "/"
        dst = os.path.join(SYNC_REPO, "claude-config", "plugins") + "/"
        os.makedirs(dst, exist_ok=True)
        subprocess.run([
            "rsync", "-a", "--delete",
            "--exclude=.git/", "--exclude=node_modules/",
            src, dst
        ], check=True, timeout=60)
        return "已同步"

    elif mid == "memories":
        projects_dir = os.path.join(CLAUDE_DIR, "projects")
        dst_base = os.path.join(SYNC_REPO, "claude-config", "project-memories")
        os.makedirs(dst_base, exist_ok=True)
        count = 0
        if os.path.isdir(projects_dir):
            for proj in os.listdir(projects_dir):
                mem = os.path.join(projects_dir, proj, "memory")
                if os.path.isdir(mem):
                    dst = os.path.join(dst_base, proj) + "/"
                    os.makedirs(dst, exist_ok=True)
                    subprocess.run(["rsync", "-a", mem + "/", dst], check=True, timeout=30)
                    count += 1
        return f"已同步 {count} 个项目的记忆"

    elif mid.startswith("project-"):
        group_name = mid.replace("project-", "")
        return sync_push_project_group(group_name)

    else:
        return f"未知模块: {mid}"


def sync_push_project_group(group_name):
    """推送项目子目录组"""
    dst_base = os.path.join(SYNC_REPO, "project-3.23")
    os.makedirs(dst_base, exist_ok=True)

    skip = {"video-panel", "Recordly", ".whiteboard-build", "claude-code-sync", ".claude", "node_modules"}
    count = 0

    for item in os.listdir(PROJECT_DIR):
        if item in skip or item.startswith("."):
            continue

        belongs = False
        if group_name == "产品文档" and item.startswith("产品-"):
            belongs = True
        elif group_name == "场景知识" and item.startswith("场景知识"):
            belongs = True
        elif group_name == "Wiki & Raw" and item in ("wiki", "raw", "raw_cleaned"):
            belongs = True
        elif group_name == "脚本 & 工具" and (item.startswith("脚本") or item in ("whiteboard",)):
            belongs = True
        elif group_name == "其他":
            is_other = (
                not item.startswith("产品-")
                and not item.startswith("场景知识")
                and item not in ("wiki", "raw", "raw_cleaned")
                and not item.startswith("脚本")
                and item not in ("whiteboard",)
            )
            belongs = is_other

        if not belongs:
            continue

        src_path = os.path.join(PROJECT_DIR, item)
        dst_path = os.path.join(dst_base, item)

        if os.path.isdir(src_path):
            os.makedirs(dst_path, exist_ok=True)
            subprocess.run([
                "rsync", "-a", "--delete",
                "--exclude=node_modules/", "--exclude=.git/",
                "--exclude=*.mp4", "--exclude=*.mp3", "--exclude=*.wav",
                src_path + "/", dst_path + "/"
            ], check=True, timeout=120)
        else:
            subprocess.run(["cp", src_path, dst_path], check=True, timeout=10)
        count += 1

    return f"已同步 {count} 项"


def sync_pull_module(mid):
    """从同步仓库拉取单个模块"""
    if mid == "claude-md":
        src = os.path.join(SYNC_REPO, "claude-config", "CLAUDE.md")
        dst = os.path.join(CLAUDE_DIR, "CLAUDE.md")
        if os.path.exists(src):
            subprocess.run(["cp", src, dst], check=True, timeout=10)
            return "已恢复"
        return "远程无此文件"

    elif mid == "settings":
        src = os.path.join(SYNC_REPO, "claude-config", "settings.json")
        dst = os.path.join(CLAUDE_DIR, "settings.json")
        if os.path.exists(src):
            subprocess.run(["cp", src, dst], check=True, timeout=10)
            return "已恢复"
        return "远程无此文件"

    elif mid == "skills":
        src = os.path.join(SYNC_REPO, "claude-config", "skills") + "/"
        dst = os.path.join(CLAUDE_DIR, "skills") + "/"
        if os.path.isdir(src):
            os.makedirs(dst, exist_ok=True)
            subprocess.run(["rsync", "-a", "--delete", src, dst], check=True, timeout=120)
            return "已恢复"
        return "远程无此目录"

    elif mid == "plugins":
        src = os.path.join(SYNC_REPO, "claude-config", "plugins") + "/"
        dst = os.path.join(CLAUDE_DIR, "plugins") + "/"
        if os.path.isdir(src):
            os.makedirs(dst, exist_ok=True)
            subprocess.run(["rsync", "-a", "--delete", src, dst], check=True, timeout=60)
            return "已恢复"
        return "远程无此目录"

    elif mid == "memories":
        src_base = os.path.join(SYNC_REPO, "claude-config", "project-memories")
        count = 0
        if os.path.isdir(src_base):
            for proj in os.listdir(src_base):
                src = os.path.join(src_base, proj) + "/"
                dst = os.path.join(CLAUDE_DIR, "projects", proj, "memory") + "/"
                os.makedirs(dst, exist_ok=True)
                subprocess.run(["rsync", "-a", src, dst], check=True, timeout=30)
                count += 1
        return f"已恢复 {count} 个项目的记忆"

    elif mid.startswith("project-"):
        src_base = os.path.join(SYNC_REPO, "project-3.23")
        if os.path.isdir(src_base):
            os.makedirs(PROJECT_DIR, exist_ok=True)
            subprocess.run([
                "rsync", "-a", src_base + "/", PROJECT_DIR + "/"
            ], check=True, timeout=120)
            return "已恢复"
        return "远程无此目录"

    return f"未知模块: {mid}"


class SyncHandler(http.server.BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

    def _json(self, data, status=200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode())

    def _html(self, path):
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        with open(path, "rb") as f:
            self.wfile.write(f.read())

    def do_GET(self):
        parsed = urlparse(self.path)

        if parsed.path == "/" or parsed.path == "/dashboard":
            self._html(DASHBOARD_PATH)

        elif parsed.path == "/api/modules":
            self._json(get_modules())

        elif parsed.path == "/api/status":
            last_sync = get_git_last_sync()
            has_remote = False
            try:
                r = subprocess.run(
                    ["git", "remote", "-v"],
                    capture_output=True, text=True, cwd=SYNC_REPO, timeout=5
                )
                has_remote = "origin" in r.stdout
            except Exception:
                pass
            self._json({
                "initialized": os.path.isdir(os.path.join(SYNC_REPO, ".git")),
                "has_remote": has_remote,
                "last_sync": last_sync,
                "log": sync_log[-10:],
            })

        else:
            self.send_error(404)

    def do_POST(self):
        parsed = urlparse(self.path)

        if parsed.path == "/api/sync":
            length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(length))
            module_ids = body.get("modules", [])
            direction = body.get("direction", "push")

            if not module_ids:
                self._json({"error": "没有选择模块"}, 400)
                return

            if not sync_lock.acquire(blocking=False):
                self._json({"error": "同步正在进行中，请稍候"}, 409)
                return

            try:
                results = run_sync(module_ids, direction)
                self._json({"results": results})
            finally:
                sync_lock.release()

        elif parsed.path == "/api/init":
            try:
                os.makedirs(SYNC_REPO, exist_ok=True)
                if not os.path.isdir(os.path.join(SYNC_REPO, ".git")):
                    subprocess.run(["git", "init"], cwd=SYNC_REPO, check=True, timeout=10)
                    gitignore = os.path.join(SYNC_REPO, ".gitignore")
                    with open(gitignore, "w") as f:
                        f.write(".DS_Store\n__pycache__/\n*.pyc\nnode_modules/\n*.mp4\n*.mp3\n*.wav\n*.tar.gz\n")
                self._json({"status": "ok", "path": SYNC_REPO})
            except Exception as e:
                self._json({"error": str(e)}, 500)

        else:
            self.send_error(404)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()


if __name__ == "__main__":
    server = http.server.HTTPServer(("127.0.0.1", PORT), SyncHandler)
    print(f"Claude Code 同步管理器运行中: http://localhost:{PORT}")
    print("按 Ctrl+C 停止")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n已停止")
        server.server_close()
