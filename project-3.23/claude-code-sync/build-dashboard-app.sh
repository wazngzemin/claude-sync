#!/bin/bash
# ============================================================
# 构建「Claude 同步管理」macOS App
# 双击打开 = 自动启动服务器 + 打开浏览器面板
# ============================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_NAME="Claude同步管理"
APP_PATH="$HOME/Desktop/${APP_NAME}.app"

# 把核心文件复制到 ~/.claude-sync/
mkdir -p "$HOME/.claude-sync"
cp "$SCRIPT_DIR/sync-engine.sh" "$HOME/.claude-sync/"
cp "$SCRIPT_DIR/sync-server.py" "$HOME/.claude-sync/"
cp "$SCRIPT_DIR/dashboard.html" "$HOME/.claude-sync/"
chmod +x "$HOME/.claude-sync/sync-engine.sh"

# 创建启动脚本
cat > "$HOME/.claude-sync/launch.sh" << 'LAUNCH'
#!/bin/bash
PORT=9527
SYNC_DIR="$HOME/.claude-sync"

# 检查是否已在运行
if lsof -i :$PORT -sTCP:LISTEN > /dev/null 2>&1; then
    # 已在运行，直接打开浏览器
    open "http://localhost:$PORT"
    exit 0
fi

# 启动服务器（后台）
cd "$SYNC_DIR"
python3 sync-server.py &
SERVER_PID=$!

# 等待服务器就绪
for i in $(seq 1 30); do
    if curl -s "http://localhost:$PORT/api/status" > /dev/null 2>&1; then
        break
    fi
    sleep 0.2
done

# 打开浏览器
open "http://localhost:$PORT"

# 写入 PID 以便后续清理
echo $SERVER_PID > "$SYNC_DIR/server.pid"
LAUNCH
chmod +x "$HOME/.claude-sync/launch.sh"

# 构建 macOS App
rm -rf "$APP_PATH"

osacompile -o "$APP_PATH" -e '
on run
    do shell script "bash $HOME/.claude-sync/launch.sh &>/dev/null &"
    delay 1
end run
'

# 替换 App 图标（可选 - 使用系统图标）
# 如果有自定义 icns 可以放到 APP_PATH/Contents/Resources/applet.icns

echo "================================================"
echo "[✓] 已创建: $APP_PATH"
echo ""
echo "使用方式:"
echo "  1. 双击桌面上的「${APP_NAME}」打开管理面板"
echo "  2. 把它拖到 Dock 栏，随时一键打开"
echo "  3. 在面板中勾选要同步的模块，点击推送/拉取"
echo ""
echo "首次使用需要:"
echo "  1. 在面板中点击「初始化仓库」"
echo "  2. 然后在终端中添加 GitHub 远程仓库:"
echo "     cd ~/.claude-sync"
echo "     git remote add origin git@github.com:你的用户名/claude-sync.git"
echo "     git branch -M main"
echo "     git push -u origin main"
echo "================================================"
