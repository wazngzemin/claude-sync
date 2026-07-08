#!/usr/bin/env python3
"""
定时同步飞书 car Wiki 空间到 raw/articles/
自动检测新增文档并增量同步。
"""
import os, sys, json, time, requests, re
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / ".env")

APP_ID = os.getenv("FEISHU_APP_ID")
APP_SECRET = os.getenv("FEISHU_APP_SECRET")
RAW_DIR = Path(__file__).parent / "raw" / "articles"
TOKEN_FILE = Path(__file__).parent / ".feishu_tokens.json"
SYNC_STATE = Path(__file__).parent / ".sync_state.json"
BASE = "https://open.feishu.cn/open-apis"
CAR_SPACE_ID = "7630463641124342714"


def get_app_access_token():
    resp = requests.post(f"{BASE}/auth/v3/app_access_token/internal",
                         json={"app_id": APP_ID, "app_secret": APP_SECRET})
    return resp.json().get("app_access_token")


def load_user_token():
    if not TOKEN_FILE.exists():
        return None
    tokens = json.loads(TOKEN_FILE.read_text())
    if time.time() < tokens.get("expires_at", 0) - 300:
        return tokens["access_token"]
    refresh = tokens.get("refresh_token")
    if refresh:
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
                }, indent=2))
                return td["access_token"]
        except Exception:
            pass
    return None


def headers():
    token = load_user_token()
    if not token:
        print("ERROR: 无有效 token，请运行 python3 feishu_oauth.py")
        sys.exit(1)
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


def sanitize_filename(name):
    name = re.sub(r'[\\/:*?"<>|#\[\]{}]', '', name)
    name = name.strip()[:80]
    return name or "untitled"


def get_doc_content(doc_id):
    resp = requests.get(f"{BASE}/docx/v1/documents/{doc_id}/raw_content", headers=headers())
    data = resp.json()
    if data.get("code") == 0:
        return data.get("data", {}).get("content", "")
    resp = requests.get(f"{BASE}/doc/v2/{doc_id}/raw_content", headers=headers())
    data = resp.json()
    if data.get("code") == 0:
        return data.get("data", {}).get("content", "")
    return None


def get_sheet_content(sheet_token):
    resp = requests.get(f"{BASE}/sheets/v3/spreadsheets/{sheet_token}", headers=headers())
    data = resp.json()
    if data.get("code") != 0:
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
    return result


def get_doc_title(doc_id):
    resp = requests.get(f"{BASE}/docx/v1/documents/{doc_id}", headers=headers())
    data = resp.json()
    if data.get("code") == 0:
        return data.get("data", {}).get("document", {}).get("title")
    return None


def get_wiki_node_obj(node_token):
    resp = requests.get(f"{BASE}/wiki/v2/spaces/get_node", headers=headers(),
                        params={"token": node_token})
    data = resp.json()
    if data.get("code") != 0:
        return None, None, None
    node = data.get("data", {}).get("node", {})
    return node.get("obj_token"), node.get("obj_type"), node.get("title")


def list_all_wiki_nodes(space_id):
    """Get all nodes recursively."""
    all_nodes = {}

    def fetch_nodes(parent_token=None):
        params = {"page_size": 50}
        if parent_token:
            params["parent_node_token"] = parent_token
        page_token = None
        while True:
            if page_token:
                params["page_token"] = page_token
            resp = requests.get(f"{BASE}/wiki/v2/spaces/{space_id}/nodes",
                                headers=headers(), params=params)
            data = resp.json()
            if data.get("code") != 0:
                break
            items = data.get("data", {}).get("items", [])
            for n in items:
                node_token = n.get("node_token")
                all_nodes[node_token] = {
                    "title": n.get("title", ""),
                    "obj_type": n.get("obj_type", ""),
                    "node_token": node_token,
                    "obj_token": n.get("obj_token", ""),
                    "obj_edit_time": n.get("obj_edit_time", ""),
                }
                if n.get("has_child"):
                    fetch_nodes(node_token)
            page_token = data.get("data", {}).get("page_token")
            if not page_token or not items:
                break

    fetch_nodes()
    return all_nodes


def load_sync_state():
    if SYNC_STATE.exists():
        return json.loads(SYNC_STATE.read_text())
    return {}


def save_sync_state(state):
    SYNC_STATE.write_text(json.dumps(state, indent=2, ensure_ascii=False))


def sync_new_docs():
    """Check for new/updated docs and sync them."""
    print(f"[{time.strftime('%Y-%m-%d %H:%M')}] 开始检查 car Wiki 空间...")

    h = headers()
    remote_nodes = list_all_wiki_nodes(CAR_SPACE_ID)
    local_state = load_sync_state()

    new_count = 0
    updated_count = 0

    for node_token, node_info in remote_nodes.items():
        obj_type = node_info["obj_type"]
        title = node_info["title"]
        edit_time = node_info.get("obj_edit_time", "")
        obj_token = node_info.get("obj_token", node_token)

        if obj_type == "mindnote":
            continue

        prev = local_state.get(node_token)
        is_new = prev is None
        is_updated = prev and prev.get("obj_edit_time") != edit_time

        if not is_new and not is_updated:
            continue

        # Fetch content
        content = None
        if obj_type in ("docx", "doc"):
            content = get_doc_content(obj_token)
            if not title and content:
                pass  # keep empty
        elif obj_type in ("sheet", "xlsx"):
            content = get_sheet_content(obj_token)
        else:
            continue

        if not content:
            continue

        # Get title for filename
        if not title and obj_type in ("docx", "doc"):
            title = get_doc_title(obj_token) or obj_token

        filename = sanitize_filename(title or obj_token) + ".md"
        filepath = RAW_DIR / filename

        if is_new and filepath.exists():
            stem = filepath.stem
            filepath = RAW_DIR / f"{stem}-{int(time.time())}.md"

        filepath.write_text(content, encoding="utf-8")

        local_state[node_token] = {
            "title": title,
            "filename": filepath.name,
            "obj_type": obj_type,
            "obj_edit_time": edit_time,
            "synced_at": time.strftime("%Y-%m-%d %H:%M"),
        }

        if is_new:
            new_count += 1
            print(f"  新增: {title or filename}")
        else:
            updated_count += 1
            print(f"  更新: {title or filename}")

        time.sleep(0.3)

    save_sync_state(local_state)

    if new_count == 0 and updated_count == 0:
        print("  无新增或更新")
    else:
        print(f"  同步完成: {new_count} 新增, {updated_count} 更新")

    return new_count, updated_count


if __name__ == "__main__":
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    new, updated = sync_new_docs()

    # Append to log
    log_file = Path(__file__).parent / "wiki" / "log.md"
    if log_file.exists():
        with open(log_file, "a", encoding="utf-8") as f:
            from datetime import datetime
            now = datetime.now().strftime("%Y-%m-%d %H:%M")
            f.write(f"| {now} | sync-feishu | car Wiki 空间 | 新增{new}篇，更新{updated}篇 |\n")
