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
PORT=9527
cd "$HOME/.claude-sync"
if lsof -i :$PORT -sTCP:LISTEN >/dev/null 2>&1; then open "http://localhost:$PORT"; exit 0; fi
nohup python3 sync-server.py </dev/null >/tmp/sync-server.log 2>&1 &
for i in $(seq 1 40); do curl -s "http://localhost:$PORT/api/status" >/dev/null 2>&1 && break; sleep 0.3; done
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
