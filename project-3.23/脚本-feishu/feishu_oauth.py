#!/usr/bin/env python3
"""飞书 OAuth 手动流程：获取 user_access_token"""
import os, sys, json, hashlib, base64, secrets, time, webbrowser
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import requests
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).parent / ".env")

APP_ID = os.getenv("FEISHU_APP_ID")
APP_SECRET = os.getenv("FEISHU_APP_SECRET")
REDIRECT_URI = "http://localhost:3000/callback"
BASE = "https://open.feishu.cn/open-apis"

# PKCE helpers
def gen_code_verifier():
    return secrets.token_urlsafe(32)

def gen_code_challenge(verifier):
    digest = hashlib.sha256(verifier.encode()).digest()
    return base64.urlsafe_b64encode(digest).rstrip(b"=").decode()

def get_app_access_token():
    resp = requests.post(f"{BASE}/auth/v3/app_access_token/internal",
                         json={"app_id": APP_ID, "app_secret": APP_SECRET})
    data = resp.json()
    if data.get("code") != 0:
        print(f"获取 app_access_token 失败: {data}")
        sys.exit(1)
    return data["app_access_token"]

# Global to store the auth code
auth_result = {"code": None}

class OAuthCallbackHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/callback":
            params = parse_qs(parsed.query)
            code = params.get("code", [None])[0]
            state = params.get("state", [None])[0]
            error = params.get("error", [None])[0]

            if error:
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.end_headers()
                self.wfile.write(f"<h1>授权失败</h1><p>{error}</p>".encode())
                auth_result["code"] = "ERROR"
                return

            auth_result["code"] = code
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write("<h1>授权成功！</h1><p>可以关闭此页面了。</p>".encode())
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        pass  # Suppress logs

def main():
    # Step 1: Generate PKCE
    code_verifier = gen_code_verifier()
    code_challenge = gen_code_challenge(code_verifier)
    state = secrets.token_urlsafe(16)

    # Scopes needed for document access
    scopes = [
        "drive:drive:readonly",
        "wiki:wiki:readonly",
        "docx:document:readonly",
        "docx:document",
        "docs:doc:readonly",
        "docs:doc",
        "sheets:spreadsheet:readonly",
        "sheets:spreadsheet",
        "space:document:retrieve",
        "wiki:space:retrieve",
    ]
    scope_str = " ".join(scopes)

    # Step 2: Build authorization URL
    auth_url = (
        f"https://open.feishu.cn/open-apis/authen/v1/authorize"
        f"?app_id={APP_ID}"
        f"&redirect_uri={requests.utils.quote(REDIRECT_URI)}"
        f"&state={state}"
        f"&scope={requests.utils.quote(scope_str)}"
        f"&response_type=code"
        f"&code_challenge={code_challenge}"
        f"&code_challenge_method=S256"
    )

    # Step 3: Start local server
    server = HTTPServer(("localhost", 3000), OAuthCallbackHandler)
    server.timeout = 1

    print("=" * 50)
    print("飞书 OAuth 授权")
    print("=" * 50)
    print(f"\n正在打开浏览器进行授权...")
    print("(如未自动打开，请手动复制以下链接)\n")
    print(auth_url)
    print()

    webbrowser.open(auth_url)

    # Step 4: Wait for callback
    print("等待授权中（60秒超时）...")
    start = time.time()
    while time.time() - start < 60:
        server.handle_request()
        if auth_result["code"] is not None:
            break

    server.server_close()

    if auth_result["code"] == "ERROR" or auth_result["code"] is None:
        print("授权失败或超时")
        sys.exit(1)

    auth_code = auth_result["code"]
    print(f"授权码: {auth_code[:10]}...")

    # Step 5: Exchange for user_access_token
    print("\n正在交换 user_access_token...")
    app_token = get_app_access_token()

    resp = requests.post(
        f"{BASE}/authen/v1/oidc/access_token",
        headers={
            "Authorization": f"Bearer {app_token}",
            "Content-Type": "application/json",
        },
        json={
            "grant_type": "authorization_code",
            "code": auth_code,
            "code_verifier": code_verifier,
            "redirect_uri": REDIRECT_URI,
            "app_id": APP_ID,
        },
    )
    data = resp.json()

    if data.get("code") != 0:
        print(f"获取 user_access_token 失败: {json.dumps(data, ensure_ascii=False, indent=2)}")
        sys.exit(1)

    token_data = data.get("data", {})
    user_token = token_data.get("access_token", "")
    refresh_token = token_data.get("refresh_token", "")

    print(f"\n{'=' * 50}")
    print("授权成功！")
    print(f"user_access_token: {user_token[:20]}...")
    print(f"expires_in: {token_data.get('expires_in')}s")

    # Save tokens
    token_file = Path(__file__).parent / ".feishu_tokens.json"
    token_file.write_text(json.dumps({
        "access_token": user_token,
        "refresh_token": refresh_token,
        "expires_at": time.time() + token_data.get("expires_in", 7200),
        "token_type": "user_access_token",
    }, indent=2), encoding="utf-8")
    print(f"\nToken 已保存到: {token_file}")

if __name__ == "__main__":
    main()
