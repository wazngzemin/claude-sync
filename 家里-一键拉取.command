#!/bin/bash
# ============================================================
#  家里电脑 · 一键拉取
#  从 GitHub 拉最新，并安装/更新到本机
#  第一次用请看仓库里的「家里首次设置说明.txt」
# ============================================================
set -uo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"   # 克隆下来的仓库目录
CLAUDE="$HOME/.claude"
PROJ="$HOME/Desktop/3.23"

clear
echo "============================================================"
echo "   家里 · 从 GitHub 拉取并安装"
echo "   本机: $(hostname -s)   用户: $(whoami)"
echo "============================================================"
echo ""

# 1. 拉最新
if [ -d "$DIR/.git" ]; then
    echo "--- 从云端拉取最新 (git pull) ---"
    cd "$DIR"
    if git pull; then
        echo "[✓] 已拉到最新"
    else
        echo "⚠️  拉取失败：检查网络，或首次需要配置 GitHub 登录（见说明文件）"
    fi
    echo ""
fi

# 2. 用户名不同则自动修路径
FIX=0
if [ "$(whoami)" != "bytedance" ]; then
    FIX=1
    echo "ℹ️  用户名是 $(whoami)（原机 bytedance），自动修正路径"
    echo ""
fi

mkdir -p "$CLAUDE" "$CLAUDE/projects" "$PROJ"
CFG="$DIR/claude-config"

echo "--- 安装 Claude 配置 ---"
if [ -f "$CFG/CLAUDE.md" ]; then
    cp "$CLAUDE/CLAUDE.md" "$CLAUDE/CLAUDE.md.bak" 2>/dev/null
    cp "$CFG/CLAUDE.md" "$CLAUDE/CLAUDE.md"; echo "[✓] CLAUDE.md"
fi
if [ -f "$CFG/settings.json" ]; then
    cp "$CLAUDE/settings.json" "$CLAUDE/settings.json.bak" 2>/dev/null
    if [ "$FIX" = 1 ]; then
        sed "s|/Users/bytedance/|$HOME/|g" "$CFG/settings.json" > "$CLAUDE/settings.json"
        echo "[✓] settings.json（已改成 $HOME 路径）"
    else
        cp "$CFG/settings.json" "$CLAUDE/settings.json"; echo "[✓] settings.json"
    fi
fi
[ -d "$CFG/skills" ]  && rsync -a "$CFG/skills/"  "$CLAUDE/skills/"  && echo "[✓] skills"
[ -d "$CFG/plugins" ] && rsync -a "$CFG/plugins/" "$CLAUDE/plugins/" && echo "[✓] plugins"
if [ -d "$CFG/project-memories" ]; then
    for md in "$CFG/project-memories"/*/; do
        p=$(basename "$md")
        [ "$FIX" = 1 ] && p=$(echo "$p" | sed "s|-Users-bytedance-|-Users-$(whoami)-|")
        mkdir -p "$CLAUDE/projects/$p/memory"
        rsync -a "$md" "$CLAUDE/projects/$p/memory/"
    done
    echo "[✓] 记忆"
fi

echo ""
echo "--- 安装 3.23 工作文件 ---"
[ -d "$DIR/project-3.23" ] && rsync -a "$DIR/project-3.23/" "$PROJ/" && echo "[✓] ~/Desktop/3.23/ 已更新"

echo ""
echo "============================================================"
echo "   ✅ 完成！打开 Claude Code 就是最新的样子了"
echo "============================================================"
echo ""
read -p "按回车关闭..." _
