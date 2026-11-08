#!/usr/bin/env python3
"""Standalone local web server for the Codex sync mirror.

Claude Code keeps using sync-server.py on port 9527.  This process owns only
the Codex page and Codex sync API on port 9528.
"""

import http.server
import json
import os
import shutil
import threading
from urllib.parse import parse_qs, unquote, urlparse

import codex_sync


PORT = int(os.environ.get("CODEX_SYNC_PORT", "9528"))
DASHBOARD = os.path.join(os.path.dirname(os.path.abspath(__file__)), "codex-dashboard.html")
sync_lock = threading.Lock()


class CodexHandler(http.server.BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def _json(self, value, status=200):
        body = json.dumps(value, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _body(self):
        try:
            length = int(self.headers.get("Content-Length", 0))
            return json.loads(self.rfile.read(length) or b"{}")
        except (ValueError, json.JSONDecodeError):
            raise codex_sync.CodexSyncError("请求 JSON 无效")

    def do_GET(self):
        request = urlparse(self.path)
        query = parse_qs(request.query)
        if request.path in ("/", "/dashboard"):
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            with open(DASHBOARD, "rb") as handle:
                shutil.copyfileobj(handle, self.wfile)
            return
        if request.path in ("/api/status", "/api/codex/status"):
            self._json(codex_sync.snapshot_status())
            return
        if request.path == "/api/codex/sidebar":
            try:
                value = codex_sync.sidebar(
                    query=query.get("q", [""])[0],
                    archived=query.get("archived", ["all"])[0],
                    limit=int(query.get("limit", [200])[0]),
                )
                self._json(value)
            except (ValueError, codex_sync.CodexSyncError) as exc:
                self._json({"error": str(exc)}, 409)
            return
        if request.path.startswith("/api/codex/thread/"):
            tail = unquote(request.path[len("/api/codex/thread/"):])
            try:
                if tail.endswith("/raw"):
                    thread_id = tail[:-4].rstrip("/")
                    paths = codex_sync.raw_thread_parts(codex_sync.SYNC_REPO_DEFAULT, thread_id)
                    self.send_response(200)
                    self.send_header("Content-Type", "application/gzip")
                    self.send_header("Content-Length", str(sum(path.stat().st_size for path in paths)))
                    self.send_header("Content-Disposition", f'attachment; filename="{thread_id}.jsonl.gz"')
                    self.end_headers()
                    for path in paths:
                        with path.open("rb") as handle:
                            shutil.copyfileobj(handle, self.wfile)
                else:
                    value = codex_sync.thread_detail(
                        codex_sync.SYNC_REPO_DEFAULT,
                        tail.strip("/"),
                        offset=int(query.get("offset", [0])[0]),
                        limit=int(query.get("limit", [200])[0]),
                    )
                    self._json(value)
            except (ValueError, codex_sync.CodexSyncError) as exc:
                self._json({"error": str(exc)}, 404)
            return
        self.send_error(404)

    def do_POST(self):
        request = urlparse(self.path)
        routes = ("/api/codex/export", "/api/codex/push", "/api/codex/pull", "/api/codex/import-native")
        if request.path not in routes:
            self.send_error(404)
            return
        try:
            body = self._body()
        except codex_sync.CodexSyncError as exc:
            self._json({"error": str(exc)}, 400)
            return
        if not sync_lock.acquire(blocking=False):
            self._json({"error": "正在同步中，请稍候"}, 409)
            return
        try:
            try:
                if request.path == "/api/codex/export":
                    result = codex_sync.export_snapshot(include_history=bool(body.get("include_history", True)))
                elif request.path == "/api/codex/push":
                    result = codex_sync.export_snapshot(include_history=bool(body.get("include_history", True)))
                    sensitive = result.get("snapshot", {}).get("sensitive_paths", [])
                    if not body.get("confirm_sensitive"):
                        result["needs_confirmation"] = True
                        result["message"] = "快照已生成；会话正文可能包含公司或第三方敏感信息，确认合规后再推送。"
                        result["sensitive_name_count"] = len(sensitive)
                    else:
                        result["push"] = codex_sync.git_push()
                elif request.path == "/api/codex/pull":
                    result = codex_sync.git_pull_and_restore(restore=bool(body.get("restore", True)))
                else:
                    result = codex_sync.native_import(
                        confirm_closed=bool(body.get("confirm_closed")),
                        replace_existing=bool(body.get("replace_existing")),
                    )
                self._json(result)
            except codex_sync.CodexSyncError as exc:
                self._json({"error": str(exc)}, 409)
            except Exception as exc:
                self._json({"error": str(exc)}, 500)
        finally:
            sync_lock.release()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()


if __name__ == "__main__":
    print(f"Codex 独立同步管理 · http://localhost:{PORT}", flush=True)
    # 导出/压缩快照可能持续较久，不能让一个慢请求阻塞状态接口和页面刷新。
    # 线程只负责 HTTP 请求；真正的同步写操作仍由 sync_lock 串行保护。
    server = http.server.ThreadingHTTPServer(("127.0.0.1", PORT), CodexHandler)
    server.daemon_threads = True
    server.serve_forever()
