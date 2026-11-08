#!/bin/bash
set -euo pipefail
PORT=9528
SYNC_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SYNC_DIR"

if ! curl -fsS "http://localhost:$PORT/api/codex/status" >/dev/null 2>&1; then
  LISTENER_PID="$(lsof -tiTCP:$PORT -sTCP:LISTEN 2>/dev/null | head -1 || true)"
  if [ -n "$LISTENER_PID" ]; then
    LISTENER_CMD="$(ps -p "$LISTENER_PID" -o command= 2>/dev/null || true)"
    LISTENER_CWD="$(lsof -a -p "$LISTENER_PID" -d cwd -Fn 2>/dev/null | sed -n 's/^n//p' | head -1 || true)"
    if [[ "$LISTENER_CMD" == *"codex-server.py"* && "$LISTENER_CWD" == "$SYNC_DIR" ]]; then
      kill "$LISTENER_PID"; sleep 0.5
    else
      echo "端口 $PORT 已被其他程序占用：$LISTENER_CMD" >&2
      exit 1
    fi
  fi
  nohup python3 "$SYNC_DIR/codex-server.py" </dev/null >/tmp/codex-sync-server.log 2>&1 &
  for i in $(seq 1 40); do
    if curl -fsS "http://localhost:$PORT/api/codex/status" >/dev/null 2>&1; then break; fi
    sleep 0.3
  done
fi
open "http://localhost:$PORT"
