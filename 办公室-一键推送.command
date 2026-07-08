#!/bin/bash
# ============================================================
#  办公室 · 一键推送
#  收集本机最新内容 → 提交 → 推送到 GitHub
#  走之前双击我一下，回家就能拉到
# ============================================================
set -uo pipefail

SYNC="$HOME/.claude-sync"
CLAUDE="$HOME/.claude"
PROJ="$HOME/Desktop/3.23"

clear
echo "============================================================"
echo "   办公室 · 一键推送到 GitHub"
echo "   本机: $(hostname -s)"
echo "============================================================"
echo ""

cd "$SYNC" || { echo "❌ 找不到 ~/.claude-sync"; read -p "回车关闭"; exit 1; }

# --- 收集 Claude 配置 ---
CFG="$SYNC/claude-config"
mkdir -p "$CFG" "$CFG/project-memories"
cp "$CLAUDE/CLAUDE.md"     "$CFG/" 2>/dev/null && echo "[✓] CLAUDE.md"
cp "$CLAUDE/settings.json" "$CFG/" 2>/dev/null && echo "[✓] settings.json"
rsync -a --delete --exclude='.git/' --exclude='node_modules/' --exclude='.venv/' "$CLAUDE/skills/"  "$CFG/skills/"  2>/dev/null && echo "[✓] skills"
rsync -a --delete --exclude='.git/' --exclude='node_modules/' --exclude='.venv/' "$CLAUDE/plugins/" "$CFG/plugins/" 2>/dev/null && echo "[✓] plugins"
for m in "$CLAUDE/projects"/*/memory; do
    [ -d "$m" ] || continue
    p=$(basename "$(dirname "$m")")
    mkdir -p "$CFG/project-memories/$p"
    rsync -a "$m/" "$CFG/project-memories/$p/"
done
echo "[✓] 记忆"

# --- 收集 3.23 工作文件 ---
rsync -a --delete \
    --exclude='.git/' --exclude='node_modules/' --exclude='.venv/' \
    --exclude='video-panel/output/' --exclude='video-panel/bin/' \
    --exclude='Recordly/.git/' --exclude='Recordly/node_modules/' --exclude='Recordly/.tmp/' \
    --exclude='.whiteboard-build/' --exclude='claude-code-sync/' \
    --exclude='*.mp4' --exclude='*.mp3' --exclude='*.wav' --exclude='*.tar.gz' \
    --exclude='.DS_Store' --exclude='__pycache__/' \
    "$PROJ/" "$SYNC/project-3.23/" 2>/dev/null
echo "[✓] 3.23 工作文件"

# --- 提交 + 推送 ---
echo ""
git add -A
if git diff --cached --quiet; then
    echo "[i] 没有新变更，无需推送"
else
    git commit -q -m "sync $(hostname -s) $(date '+%Y-%m-%d %H:%M')"
    echo "--- 推送到 GitHub（大改动会久点）---"
    if git push -q origin main; then
        echo ""
        echo "============================================================"
        echo "   ✅ 已推送到 GitHub！"
        echo "   回家双击「家里-一键拉取」就能拿到最新"
        echo "============================================================"
    else
        echo ""
        echo "⚠️  推送失败，检查网络后再双击我一次"
    fi
fi
echo ""
read -p "按回车关闭..." _
