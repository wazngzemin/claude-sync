#!/bin/bash
# ============================================================
#  建「Claude同步管理」桌面 App（带图标）
#  在办公室或家里，从 ~/.claude-sync 里运行一次即可
# ============================================================
set -e
SYNC="$HOME/.claude-sync"
cd "$SYNC"

# 保留已修复的 Claude 专用启动器，禁止重建旧的 Claude/Codex 混合启动流程。
if [ ! -f "$SYNC/launch.sh" ]; then
    echo "错误：缺少 $SYNC/launch.sh，请先恢复 Claude 专用启动脚本。" >&2
    exit 1
fi
bash -n "$SYNC/launch.sh"
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
