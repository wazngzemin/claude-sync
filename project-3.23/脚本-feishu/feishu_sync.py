#!/usr/bin/env python3
"""
飞书文档同步到 LLM Wiki raw/articles/ 的脚本。
用法：
  python3 feishu_sync.py                          # 交互模式
  python3 feishu_sync.py ls [folder_token]         # 列出文件夹内容
  python3 feishu_sync.py sync <doc_url_or_id>      # 同步单个文档
  python3 feishu_sync.py sync-folder <folder_token> # 同步整个文件夹
  python3 feishu_sync.py oauth                     # OAuth 授权获取 user_access_token
  python3 feishu_sync.py search <关键词>           # 搜索飞书文档
"""

import os
import sys
import json
import re
import time
import hashlib
import base64
import secrets
import webbrowser
import requests
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / ".env")

APP_ID = os.getenv("FEISHU_APP_ID")
APP_SECRET = os.getenv("FEISHU_APP_SECRET")
RAW_DIR = Path(__file__).parent / "raw" / "articles"
TOKEN_FILE = Path(__file__).parent / ".feishu_tokens.json"
REDIRECT_URI = "http://localhost:3000/callback"

BASE = "https://open.feishu.cn/open-apis"


def get_app_access_token():
    resp = requests.post(f"{BASE}/auth/v3/app_access_token/internal",
                         json={"app_id": APP_ID, "app_secret": APP_SECRET})
    data = resp.json()
    if data.get("code") != 0:
        print(f"获取 app_access_token 失败: {data}")
        sys.exit(1)
    return data["app_access_token"]


def get_tenant_token():
    resp = requests.post(f"{BASE}/auth/v3/tenant_access_token/internal",
                         json={"app_id": APP_ID, "app_secret": APP_SECRET})
    data = resp.json()
    if data.get("code") != 0:
        print(f"获取 tenant_token 失败: {data}")
        sys.exit(1)
    return data["tenant_access_token"]


def load_user_token():
    """Load user_access_token from cache, refresh if needed."""
    if not TOKEN_FILE.exists():
        return None
    tokens = json.loads(TOKEN_FILE.read_text())
    if time.time() < tokens.get("expires_at", 0) - 300:
        return tokens["access_token"]

    # Try refresh
    refresh = tokens.get("refresh_token")
    if not refresh:
        return None
    try:
        app_token = get_app_access_token()
        resp = requests.post(
            f"{BASE}/authen/v1/oidc/refresh_access_token",
            headers={"Authorization": f"Bearer {app_token}", "Content-Type": "application/json"},
            json={"grant_type": "refresh_token", "refresh_token": refresh},
        )
        data = resp.json()
        if data.get("code") == 0:
            td = data["data"]
            TOKEN_FILE.write_text(json.dumps({
                "access_token": td["access_token"],
                "refresh_token": td.get("refresh_token", refresh),
                "expires_at": time.time() + td.get("expires_in", 7200),
                "token_type": "user_access_token",
            }, indent=2))
            return td["access_token"]
    except Exception:
        pass
    return None


def get_token():
    """Get the best available token: user_access_token > tenant_access_token."""
    user_token = load_user_token()
    if user_token:
        return user_token
    return get_tenant_token()


def headers():
    return {"Authorization": f"Bearer {get_token()}", "Content-Type": "application/json"}


def do_oauth():
    """Interactive OAuth flow to get user_access_token."""
    code_verifier = secrets.token_urlsafe(32)
    code_challenge = base64.urlsafe_b64encode(
        hashlib.sha256(code_verifier.encode()).digest()
    ).rstrip(b"=").decode()
    state = secrets.token_urlsafe(16)

    scopes = "drive:drive:readonly wiki:wiki:readonly docx:document:readonly sheets:spreadsheet:readonly space:document:retrieve"
    auth_url = (
        f"{BASE}/authen/v1/authorize"
        f"?app_id={APP_ID}"
        f"&redirect_uri={requests.utils.quote(REDIRECT_URI)}"
        f"&state={state}"
        f"&scope={requests.utils.quote(scopes)}"
        f"&response_type=code"
        f"&code_challenge={code_challenge}"
        f"&code_challenge_method=S256"
    )

    auth_result = {"code": None}

    class Handler(BaseHTTPRequestHandler):
        def do_GET(self):
            parsed = urlparse(self.path)
            if parsed.path == "/callback":
                params = parse_qs(parsed.query)
                auth_result["code"] = params.get("code", [None])[0]
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.end_headers()
                msg = "<h1>授权成功！可以关闭此页面。</h1>" if auth_result["code"] else "<h1>授权失败</h1>"
                self.wfile.write(msg.encode())
            else:
                self.send_response(404)
                self.end_headers()
        def log_message(self, *a): pass

    server = HTTPServer(("localhost", 3000), Handler)
    server.timeout = 1

    print("正在打开浏览器进行授权...")
    webbrowser.open(auth_url)
    print(f"如未自动打开，手动访问:\n{auth_url}\n")

    print("等待授权（60秒超时）...")
    start = time.time()
    while time.time() - start < 60:
        server.handle_request()
        if auth_result["code"] is not None:
            break
    server.server_close()

    if not auth_result["code"]:
        print("授权超时")
        sys.exit(1)

    app_token = get_app_access_token()
    resp = requests.post(
        f"{BASE}/authen/v1/oidc/access_token",
        headers={"Authorization": f"Bearer {app_token}", "Content-Type": "application/json"},
        json={
            "grant_type": "authorization_code",
            "code": auth_result["code"],
            "code_verifier": code_verifier,
            "redirect_uri": REDIRECT_URI,
            "app_id": APP_ID,
        },
    )
    data = resp.json()
    if data.get("code") != 0:
        print(f"获取 token 失败: {json.dumps(data, ensure_ascii=False, indent=2)}")
        sys.exit(1)

    td = data["data"]
    TOKEN_FILE.write_text(json.dumps({
        "access_token": td["access_token"],
        "refresh_token": td.get("refresh_token", ""),
        "expires_at": time.time() + td.get("expires_in", 7200),
        "token_type": "user_access_token",
    }, indent=2))
    print(f"授权成功！Token 已保存到 {TOKEN_FILE}")


def list_folder(folder_token=None, page_size=50):
    params = {"page_size": page_size}
    if folder_token:
        params["folder_token"] = folder_token

    resp = requests.get(f"{BASE}/drive/v1/files", headers=headers(), params=params)
    data = resp.json()
    if data.get("code") != 0:
        print(f"列出文件夹失败: {data.get('msg', data)}")
        return []

    files = data.get("data", {}).get("files", [])
    for f in files:
        kind = f.get("type", "unknown")
        name = f.get("name", "无标题")
        token = f.get("token", "")
        print(f"  [{kind}] {name}  (token: {token})")
    return files


def get_doc_content(doc_id):
    resp = requests.get(f"{BASE}/docx/v1/documents/{doc_id}/raw_content", headers=headers())
    data = resp.json()
    if data.get("code") == 0:
        return data.get("data", {}).get("content", "")

    resp = requests.get(f"{BASE}/doc/v2/{doc_id}/raw_content", headers=headers())
    data = resp.json()
    if data.get("code") == 0:
        return data.get("data", {}).get("content", "")

    print(f"  获取文档内容失败: {data.get('msg', data)}")
    return None


def get_doc_title(doc_id):
    resp = requests.get(f"{BASE}/docx/v1/documents/{doc_id}", headers=headers())
    data = resp.json()
    if data.get("code") == 0:
        return data.get("data", {}).get("document", {}).get("title")
    return None


def get_sheet_content(sheet_token):
    resp = requests.get(f"{BASE}/sheets/v3/spreadsheets/{sheet_token}", headers=headers())
    data = resp.json()
    if data.get("code") != 0:
        print(f"  获取表格信息失败: {data}")
        return None

    spreadsheet = data.get("data", {}).get("spreadsheet", {})
    sheets = spreadsheet.get("sheets", [])
    result = f"# {spreadsheet.get('title', '未命名表格')}\n\n"
    for s in sheets:
        result += f"- Sheet: {s.get('title', '未命名')} (id: {s.get('sheet_id')})\n"

    if sheets:
        sheet_id = sheets[0].get("sheet_id")
        resp2 = requests.get(
            f"{BASE}/sheets/v2/spreadsheets/{sheet_token}/values/{sheet_id}",
            headers=headers(),
        )
        d2 = resp2.json()
        if d2.get("code") == 0:
            values = d2.get("data", {}).get("valueRange", {}).get("values", [])
            result += "\n## 内容\n\n"
            for row in values:
                cells = [str(c) if c else "" for c in row]
                result += "| " + " | ".join(cells) + " |\n"
            result += "\n"
    return result


def get_wiki_node_content(node_token):
    """Get wiki node info and then fetch the actual document content."""
    resp = requests.get(f"{BASE}/wiki/v2/spaces/get_node", headers=headers(),
                        params={"token": node_token})
    data = resp.json()
    if data.get("code") != 0:
        print(f"  获取 wiki node 失败: {data}")
        return None, None

    node = data.get("data", {}).get("node", {})
    obj_token = node.get("obj_token", "")
    obj_type = node.get("obj_type", "")
    title = node.get("title", "")

    if obj_type == "docx" or obj_type == "doc":
        content = get_doc_content(obj_token)
        return title or obj_token, content
    elif obj_type == "sheet":
        content = get_sheet_content(obj_token)
        return title or obj_token, content
    else:
        print(f"  不支持的 wiki 类型: {obj_type}")
        return title, None


def list_wiki_space(space_id, page_size=50):
    """List all nodes in a wiki space."""
    nodes = []
    page_token = None
    while True:
        params = {"page_size": page_size}
        if page_token:
            params["page_token"] = page_token
        resp = requests.get(f"{BASE}/wiki/v2/spaces/{space_id}/nodes",
                            headers=headers(), params=params)
        data = resp.json()
        if data.get("code") != 0:
            print(f"  获取 wiki 列表失败: {data.get('msg', data)}")
            break
        items = data.get("data", {}).get("items", [])
        for n in items:
            title = n.get("title", "无标题")
            token = n.get("node_token", "")
            obj_type = n.get("obj_type", "")
            print(f"  [{obj_type}] {title}  (node: {token})")
            nodes.append(n)
        page_token = data.get("data", {}).get("page_token")
        if not page_token or not items:
            break
    return nodes


def list_wiki_children(space_id, parent_token, page_size=50):
    """List child nodes of a wiki node."""
    nodes = []
    page_token = None
    while True:
        params = {"parent_node_token": parent_token, "page_size": page_size}
        if page_token:
            params["page_token"] = page_token
        resp = requests.get(f"{BASE}/wiki/v2/spaces/{space_id}/nodes",
                            headers=headers(), params=params)
        data = resp.json()
        if data.get("code") != 0:
            break
        items = data.get("data", {}).get("items", [])
        for n in items:
            title = n.get("title", "无标题")
            token = n.get("node_token", "")
            obj_type = n.get("obj_type", "")
            has_child = n.get("has_child", False)
            nodes.append(n)
            if has_child:
                nodes.extend(list_wiki_children(space_id, token))
        page_token = data.get("data", {}).get("page_token")
        if not page_token or not items:
            break
    return nodes


def list_wiki_all(space_id):
    """List ALL nodes in a wiki space recursively."""
    print(f"获取 Wiki 空间 {space_id} 所有节点...")
    top_nodes = list_wiki_space(space_id)
    all_nodes = []
    for n in top_nodes:
        all_nodes.append(n)
        if n.get("has_child"):
            children = list_wiki_children(space_id, n.get("node_token"))
            all_nodes.extend(children)
    # Deduplicate by node_token
    seen = set()
    unique = []
    for n in all_nodes:
        t = n.get("node_token")
        if t not in seen:
            seen.add(t)
            unique.append(n)
    for n in unique:
        indent = "    " if n.get("parent_node_token") else "  "
        print(f"{indent}[{n.get('obj_type')}] {n.get('title', '无标题')}  (node: {n.get('node_token')})")
    return unique


def sanitize_filename(name):
    name = re.sub(r'[\\/:*?"<>|#\[\]{}]', '', name)
    name = name.strip()[:80]
    return name or "untitled"


def sync_doc(token, doc_type="doc"):
    print(f"正在获取文档 {token} (类型: {doc_type})...")

    if doc_type == "sheet" or doc_type == "xlsx":
        content = get_sheet_content(token)
        title = None
    elif doc_type == "wiki":
        title, content = get_wiki_node_content(token)
    else:
        content = get_doc_content(token)
        title = get_doc_title(token) if content else None

    if not content:
        return False

    filename = sanitize_filename(title or token) + ".md"
    filepath = RAW_DIR / filename

    if filepath.exists():
        stem = filepath.stem
        filepath = RAW_DIR / f"{stem}-{int(time.time())}.md"

    filepath.write_text(content, encoding="utf-8")
    print(f"  已保存到: {filepath}")
    return True


def sync_folder(folder_token):
    print(f"\n同步文件夹 {folder_token} ...")
    files = list_folder(folder_token, page_size=100)
    success = 0
    for f in files:
        ftype = f.get("type", "")
        token = f.get("token", "")
        name = f.get("name", "")
        print(f"\n处理: {name} ({ftype})")

        if ftype in ("doc", "docx", "wiki"):
            if sync_doc(token, "doc"):
                success += 1
        elif ftype in ("sheet", "xlsx"):
            if sync_doc(token, "sheet"):
                success += 1
        elif ftype == "folder":
            print(f"  跳过子文件夹（使用 sync-folder 单独同步）")
        else:
            print(f"  跳过不支持的类型: {ftype}")

        time.sleep(0.5)

    print(f"\n同步完成: {success}/{len(files)} 个文件成功")
    return success


def sync_wiki_space(space_id):
    """Sync all docs in a wiki space (recursively)."""
    print(f"\n同步 Wiki 空间 {space_id} ...")
    nodes = list_wiki_all(space_id)
    success = 0
    for n in nodes:
        token = n.get("node_token", "")
        title = n.get("title", "")
        obj_type = n.get("obj_type", "")
        print(f"\n处理: {title} ({obj_type})")

        if obj_type in ("docx", "doc"):
            if sync_doc(token, "wiki"):
                success += 1
        elif obj_type == "sheet":
            obj_token = n.get("obj_token", token)
            if sync_doc(obj_token, "sheet"):
                success += 1
        else:
            print(f"  跳过: {obj_type}")

        time.sleep(0.5)

    print(f"\n同步完成: {success}/{len(nodes)} 个文档成功")
    return success


def list_wiki_spaces():
    """List all wiki spaces."""
    resp = requests.get(f"{BASE}/wiki/v2/spaces", headers=headers(), params={"page_size": 50})
    data = resp.json()
    if data.get("code") != 0:
        print(f"获取 wiki 空间失败: {data}")
        return []
    items = data.get("data", {}).get("items", [])
    for s in items:
        print(f"  {s.get('name', '未命名')} (id: {s.get('space_id')})")
    return items


def search_docs(query, count=10):
    resp = requests.post(
        f"{BASE}/drive/v1/files/search",
        headers=headers(),
        json={"search_key": query, "count": count},
    )
    data = resp.json()
    if data.get("code") != 0:
        print(f"搜索失败: {data}")
        return []
    files = data.get("data", {}).get("files", [])
    for f in files:
        print(f"  [{f.get('type')}] {f.get('name')}  (token: {f.get('token')})")
    return files


def parse_url(url):
    m = re.search(r'/((?:docx?|wiki|sheets?|sheet|drive)/([A-Za-z0-9]+))', url)
    if m:
        return m.group(2)
    return url.strip()


def interactive():
    print("=" * 50)
    print("飞书 → LLM Wiki 同步工具")
    print("=" * 50)

    # Check token type
    user_token = load_user_token()
    if user_token:
        print("认证: user_access_token (可访问个人文档)")
    else:
        print("认证: tenant_access_token (仅可访问共享文档)")
        print("提示: 运行 'oauth' 命令获取个人文档访问权限")

    print("\n可用命令：")
    print("  ls [folder_token]         列出文件夹（不传则列出根目录）")
    print("  sync <doc_url_or_token>   同步单个文档")
    print("  sync-folder <token>       同步整个文件夹")
    print("  wiki-spaces               列出所有 Wiki 空间")
    print("  wiki-ls <space_id>        列出 Wiki 空间内容")
    print("  sync-wiki <space_id>      同步整个 Wiki 空间")
    print("  search <关键词>           搜索飞书文档")
    print("  oauth                     OAuth 授权")
    print("  quit                      退出")
    print()

    while True:
        try:
            cmd = input("> ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\n再见！")
            break

        if not cmd:
            continue

        parts = cmd.split(maxsplit=1)
        action = parts[0]
        arg = parts[1] if len(parts) > 1 else ""

        if action == "quit":
            print("再见！")
            break
        elif action == "oauth":
            do_oauth()
        elif action == "ls":
            list_folder(arg if arg else None)
        elif action == "sync" and arg:
            sync_doc(parse_url(arg))
        elif action == "sync-folder" and arg:
            sync_folder(arg)
        elif action == "wiki-spaces":
            list_wiki_spaces()
        elif action == "wiki-ls" and arg:
            list_wiki_all(arg)
        elif action == "sync-wiki" and arg:
            sync_wiki_space(arg)
        elif action == "search" and arg:
            search_docs(arg)
        else:
            print("未知命令，输入 ls/sync/sync-folder/wiki-spaces/wiki-ls/sync-wiki/search/oauth/quit")


if __name__ == "__main__":
    RAW_DIR.mkdir(parents=True, exist_ok=True)

    if len(sys.argv) == 1:
        interactive()
    else:
        action = sys.argv[1]
        if action == "oauth":
            do_oauth()
        elif action == "sync" and len(sys.argv) > 2:
            sync_doc(parse_url(sys.argv[2]))
        elif action == "sync-folder" and len(sys.argv) > 2:
            sync_folder(sys.argv[2])
        elif action == "sync-wiki" and len(sys.argv) > 2:
            sync_wiki_space(sys.argv[2])
        elif action == "ls":
            list_folder(sys.argv[2] if len(sys.argv) > 2 else None)
        elif action == "search" and len(sys.argv) > 2:
            search_docs(sys.argv[2])
        elif action == "wiki-spaces":
            list_wiki_spaces()
        elif action == "wiki-ls" and len(sys.argv) > 2:
            list_wiki_space(sys.argv[2])
        else:
            print(__doc__)
