#!/bin/bash
# ============================================================
# 构建 macOS 一键同步 App（放到 Dock 上用）
# 运行一次即可: bash build-app.sh
# 生成两个 App:
#   ~/Desktop/Claude同步-推送.app  — 办公室电脑用，一键推送
#   ~/Desktop/Claude同步-拉取.app  — 家里电脑用，一键拉取
# ============================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SYNC_ENGINE="$HOME/.claude-sync/sync-engine.sh"

# 确保 sync-engine.sh 在固定位置
mkdir -p "$HOME/.claude-sync"
cp "$SCRIPT_DIR/sync-engine.sh" "$SYNC_ENGINE"
chmod +x "$SYNC_ENGINE"

# ---- 构建推送 App ----
PUSH_APP="$HOME/Desktop/Claude同步-推送.app"
rm -rf "$PUSH_APP"

osacompile -o "$PUSH_APP" -e '
on run
    try
        display notification "正在收集文件并推送..." with title "Claude Sync" subtitle "⏳ 同步中"
        set result_text to do shell script "bash $HOME/.claude-sync/sync-engine.sh push 2>&1"

        -- 提取最后一行作为摘要
        set last_line to last paragraph of result_text
        display notification last_line with title "Claude Sync" subtitle "✅ 推送完成"

    on error errMsg
        display notification errMsg with title "Claude Sync" subtitle "❌ 推送失败"
        display dialog "同步失败：" & return & return & errMsg buttons {"确定"} default button 1 with icon stop
    end try
end run
'

echo "[✓] 已创建: $PUSH_APP"

# ---- 构建拉取 App ----
PULL_APP="$HOME/Desktop/Claude同步-拉取.app"
rm -rf "$PULL_APP"

osacompile -o "$PULL_APP" -e '
on run
    try
        display notification "正在从远程拉取..." with title "Claude Sync" subtitle "⏳ 同步中"
        set result_text to do shell script "bash $HOME/.claude-sync/sync-engine.sh pull 2>&1"

        set last_line to last paragraph of result_text
        display notification last_line with title "Claude Sync" subtitle "✅ 拉取完成"

    on error errMsg
        display notification errMsg with title "Claude Sync" subtitle "❌ 拉取失败"
        display dialog "同步失败：" & return & return & errMsg buttons {"确定"} default button 1 with icon stop
    end try
end run
'

echo "[✓] 已创建: $PULL_APP"

# ---- 构建状态查看 App ----
STATUS_APP="$HOME/Desktop/Claude同步-状态.app"
rm -rf "$STATUS_APP"

osacompile -o "$STATUS_APP" -e '
on run
    try
        set result_text to do shell script "bash $HOME/.claude-sync/sync-engine.sh status 2>&1"
        display dialog result_text buttons {"确定"} default button 1 with title "Claude Sync 状态"
    on error errMsg
        display dialog "错误：" & errMsg buttons {"确定"} default button 1 with icon stop
    end try
end run
'

echo "[✓] 已创建: $STATUS_APP"

echo ""
echo "================================================"
echo "三个 App 已生成到桌面："
echo ""
echo "  📤 Claude同步-推送.app  — 拖到 Dock，办公室用"
echo "  📥 Claude同步-拉取.app  — 拖到 Dock，家里用"
echo "  📊 Claude同步-状态.app  — 查看同步状态"
echo ""
echo "把 App 拖到 Dock 栏即可一键使用"
echo "================================================"
