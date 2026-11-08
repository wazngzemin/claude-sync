#!/bin/bash
set -euo pipefail
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
SYNC_DIR="$(cd "$(dirname "$0")" && pwd)"
STATE_DIR="$HOME/.claude-sync-state"
mkdir -p "$STATE_DIR"
exec >>"$STATE_DIR/launch.log" 2>&1
startup_error() {
  osascript -e 'display alert "Claude 同步管理启动失败" message "请查看 ~/.claude-sync-state/launch.log。"' || true
}
trap startup_error ERR
cd "$SYNC_DIR"
if ! curl --max-time 3 -fsS http://127.0.0.1:9527/api/status >/dev/null; then
  if lsof -tiTCP:9527 -sTCP:LISTEN >/dev/null 2>&1; then
    echo "9527 端口已被其他程序占用"; exit 1
  fi
  python3 - "$SYNC_DIR/sync-server.py" "$STATE_DIR/server.log" <<'PYLAUNCH'
import subprocess, sys
with open(sys.argv[2], "a") as log:
    subprocess.Popen([sys.executable, sys.argv[1]], stdin=subprocess.DEVNULL,
                     stdout=log, stderr=log, start_new_session=True)
PYLAUNCH
  for i in $(seq 1 60); do
    if curl --max-time 2 -fsS http://127.0.0.1:9527/api/status >/dev/null 2>&1; then break; fi
    sleep 0.3
  done
fi
curl --max-time 5 -fsS http://127.0.0.1:9527/api/status >/dev/null
open http://127.0.0.1:9527
