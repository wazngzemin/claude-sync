#!/bin/bash
# ============================================================
# Claude Code 同步 — 新电脑设置
# 在新电脑上运行，从 GitHub 拉取配置并链接到 ~/.claude/
# ============================================================
set -euo pipefail

SYNC_REPO="$HOME/.claude-sync"
CLAUDE_DIR="$HOME/.claude"

if [ -z "${1:-}" ]; then
    echo "用法: bash setup-new-machine.sh <你的GitHub仓库地址>"
    echo "例如: bash setup-new-machine.sh git@github.com:username/claude-code-sync.git"
    exit 1
fi

REMOTE_URL="$1"

echo "=== Claude Code 新电脑设置 ==="
echo ""

# 1. 克隆同步仓库
if [ -d "$SYNC_REPO/.git" ]; then
    echo "[信息] $SYNC_REPO 已存在，执行 pull..."
    cd "$SYNC_REPO" && git pull
else
    git clone "$REMOTE_URL" "$SYNC_REPO"
    echo "[✓] 克隆完成: $SYNC_REPO"
fi

# 2. 确保 ~/.claude 存在
mkdir -p "$CLAUDE_DIR"
mkdir -p "$CLAUDE_DIR/projects"

# 3. 链接核心配置文件
echo ""
echo "--- 链接配置文件 ---"

link_file() {
    local src="$1"
    local dst="$2"
    if [ -e "$src" ]; then
        if [ -L "$dst" ]; then
            rm "$dst"
        elif [ -e "$dst" ]; then
            mv "$dst" "${dst}.backup-$(date +%Y%m%d)"
            echo "  [备份] 已有 $dst → ${dst}.backup-*"
        fi
        ln -s "$src" "$dst"
        echo "[✓] $dst → $src"
    fi
}

link_file "$SYNC_REPO/CLAUDE.md" "$CLAUDE_DIR/CLAUDE.md"
link_file "$SYNC_REPO/settings.json" "$CLAUDE_DIR/settings.json"

# 4. 链接 skills 目录
echo ""
echo "--- 链接 skills ---"
if [ -d "$SYNC_REPO/skills" ]; then
    if [ -d "$CLAUDE_DIR/skills" ] && [ ! -L "$CLAUDE_DIR/skills" ]; then
        mv "$CLAUDE_DIR/skills" "$CLAUDE_DIR/skills.backup-$(date +%Y%m%d)"
        echo "  [备份] 已有 skills/ → skills.backup-*"
    fi
    [ -L "$CLAUDE_DIR/skills" ] && rm "$CLAUDE_DIR/skills"
    ln -s "$SYNC_REPO/skills" "$CLAUDE_DIR/skills"
    echo "[✓] skills/ 已链接"
fi

# 5. 链接 plugins 目录
echo ""
echo "--- 链接 plugins ---"
if [ -d "$SYNC_REPO/plugins" ]; then
    if [ -d "$CLAUDE_DIR/plugins" ] && [ ! -L "$CLAUDE_DIR/plugins" ]; then
        mv "$CLAUDE_DIR/plugins" "$CLAUDE_DIR/plugins.backup-$(date +%Y%m%d)"
        echo "  [备份] 已有 plugins/ → plugins.backup-*"
    fi
    [ -L "$CLAUDE_DIR/plugins" ] && rm "$CLAUDE_DIR/plugins"
    ln -s "$SYNC_REPO/plugins" "$CLAUDE_DIR/plugins"
    echo "[✓] plugins/ 已链接"
fi

# 6. 恢复项目记忆
echo ""
echo "--- 恢复项目记忆 ---"
if [ -d "$SYNC_REPO/project-memories" ]; then
    for mem_dir in "$SYNC_REPO/project-memories"/*/; do
        project_name=$(basename "$mem_dir")
        target="$CLAUDE_DIR/projects/$project_name/memory"
        mkdir -p "$CLAUDE_DIR/projects/$project_name"
        if [ -d "$target" ] && [ ! -L "$target" ]; then
            mv "$target" "${target}.backup-$(date +%Y%m%d)"
        fi
        [ -L "$target" ] && rm "$target"
        ln -s "${mem_dir%/}" "$target"
        echo "[✓] $project_name/memory 已链接"
    done
fi

echo ""
echo "============================================================"
echo "新电脑设置完成！"
echo ""
echo "注意事项:"
echo "  1. 项目记忆路径名含项目目录的绝对路径"
echo "     如果新电脑的项目放在不同路径，需要手动调整"
echo "     (如 -Users-bytedance-Desktop-3-23 对应 /Users/bytedance/Desktop/3.23)"
echo ""
echo "  2. settings.json 中的路径可能需要更新"
echo "     (如 statusLine 中的 /Users/bytedance/.bun/bin/bun)"
echo ""
echo "  3. 日常同步使用: bash sync.sh pull / bash sync.sh push"
echo "============================================================"
