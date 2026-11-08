#!/bin/bash
# ============================================================
#  建「Claude同步管理」桌面 App（带图标）
#  在办公室或家里，从 ~/.claude-sync 里运行一次即可
# ============================================================
set -e
SYNC="$HOME/.claude-sync"
cd "$SYNC"

# 启动器
cat > "$SYNC/launch.sh" << 'LAUNCH'
#!/bin/bash
set -euo pipefail
PORT=9527
CODEX_PORT=9528
SYNC_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SYNC_DIR"
if ! curl -fsS "http://localhost:$PORT/api/status" >/dev/null 2>&1; then
  LISTENER_PID="$(lsof -tiTCP:$PORT -sTCP:LISTEN 2>/dev/null | head -1 || true)"
  if [ -n "$LISTENER_PID" ]; then
    LISTENER_CMD="$(ps -p "$LISTENER_PID" -o command= 2>/dev/null || true)"
    LISTENER_CWD="$(lsof -a -p "$LISTENER_PID" -d cwd -Fn 2>/dev/null | sed -n 's/^n//p' | head -1 || true)"
    if [[ "$LISTENER_CMD" == *"sync-server.py"* && "$LISTENER_CWD" == "$SYNC_DIR" ]]; then
      kill "$LISTENER_PID"; sleep 0.5
    else
      echo "端口 $PORT 已被其他程序占用：$LISTENER_CMD" >&2; exit 1
    fi
  fi
  nohup python3 "$SYNC_DIR/sync-server.py" </dev/null >/tmp/claude-sync-server.log 2>&1 &
  for i in $(seq 1 40); do
    if curl -fsS "http://localhost:$PORT/api/status" >/dev/null 2>&1; then break; fi
    sleep 0.3
  done
fi
if ! curl -fsS "http://localhost:$CODEX_PORT/api/codex/status" >/dev/null 2>&1; then
  CODEX_PID="$(lsof -tiTCP:$CODEX_PORT -sTCP:LISTEN 2>/dev/null | head -1 || true)"
  if [ -n "$CODEX_PID" ]; then
    CODEX_CMD="$(ps -p "$CODEX_PID" -o command= 2>/dev/null || true)"
    CODEX_CWD="$(lsof -a -p "$CODEX_PID" -d cwd -Fn 2>/dev/null | sed -n 's/^n//p' | head -1 || true)"
    if [[ "$CODEX_CMD" == *"codex-server.py"* && "$CODEX_CWD" == "$SYNC_DIR" ]]; then
      kill "$CODEX_PID"; sleep 0.5
    else
      echo "端口 $CODEX_PORT 已被其他程序占用，Codex 页面未启动：$CODEX_CMD" >&2
      open "http://localhost:$PORT"; exit 0
    fi
  fi
  nohup python3 "$SYNC_DIR/codex-server.py" </dev/null >/tmp/codex-sync-server.log 2>&1 &
  for i in $(seq 1 40); do
    if curl -fsS "http://localhost:$CODEX_PORT/api/codex/status" >/dev/null 2>&1; then break; fi
    sleep 0.3
  done
fi
open "http://localhost:$PORT"
LAUNCH
chmod +x "$SYNC/launch.sh"

# 建 App
APP="$HOME/Desktop/Claude同步管理.app"
rm -rf "$APP"
osacompile -o "$APP" -e 'on run
    do shell script "bash $HOME/.claude-sync/launch.sh >/dev/null 2>&1 &"
    delay 1
end run'

# 装图标
if [ -f "$SYNC/AppIcon.icns" ]; then
    cp "$SYNC/AppIcon.icns" "$APP/Contents/Resources/applet.icns"
    touch "$APP"
fi

echo "[✓] 已生成桌面「Claude同步管理.app」（带图标）"
echo "    双击它就能打开同步页面"
