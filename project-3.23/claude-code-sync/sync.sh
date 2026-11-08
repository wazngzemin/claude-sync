#!/bin/bash
# ============================================================
# Claude Code 日常同步
# 用法: bash sync.sh push   — 推送本机变更到远程
#       bash sync.sh pull   — 拉取远程变更到本机
#       bash sync.sh status — 查看同步状态
# ============================================================
set -euo pipefail

SYNC_REPO="$HOME/.claude-sync"
CLAUDE_DIR="$HOME/.claude"

if [ ! -d "$SYNC_REPO/.git" ]; then
    echo "[错误] 同步仓库不存在，请先运行 setup.sh 或 setup-new-machine.sh"
    exit 1
fi

# 如果是 symlink 方式（新电脑），文件已经在 SYNC_REPO 中，直接操作 git
# 如果是原始电脑（copy 方式），需要先把变更同步到 SYNC_REPO

sync_to_repo() {
    echo "--- 同步文件到仓库 ---"

    # 只有当文件不是 symlink 时才需要复制
    if [ ! -L "$CLAUDE_DIR/CLAUDE.md" ] && [ -f "$CLAUDE_DIR/CLAUDE.md" ]; then
        cp "$CLAUDE_DIR/CLAUDE.md" "$SYNC_REPO/CLAUDE.md"
    fi

    if [ ! -L "$CLAUDE_DIR/settings.json" ] && [ -f "$CLAUDE_DIR/settings.json" ]; then
        cp "$CLAUDE_DIR/settings.json" "$SYNC_REPO/settings.json"
    fi

    if [ ! -L "$CLAUDE_DIR/skills" ] && [ -d "$CLAUDE_DIR/skills" ]; then
        rsync -a --delete "$CLAUDE_DIR/skills/" "$SYNC_REPO/skills/"
    fi

    if [ ! -L "$CLAUDE_DIR/plugins" ] && [ -d "$CLAUDE_DIR/plugins" ]; then
        rsync -a --delete "$CLAUDE_DIR/plugins/" "$SYNC_REPO/plugins/"
    fi

    # 项目记忆
    if [ -d "$CLAUDE_DIR/projects" ]; then
        for memory_dir in "$CLAUDE_DIR/projects"/*/memory; do
            if [ -d "$memory_dir" ] && [ ! -L "$memory_dir" ]; then
                project_name=$(basename "$(dirname "$memory_dir")")
                mkdir -p "$SYNC_REPO/project-memories/$project_name"
                rsync -a "$memory_dir/" "$SYNC_REPO/project-memories/$project_name/"
            fi
        done
    fi

    echo "[✓] 文件同步完成"
}

case "${1:-}" in
    push)
        echo "=== 推送变更 ==="
        sync_to_repo
        cd "$SYNC_REPO"
        git add -A
        if git diff --cached --quiet; then
            echo "[信息] 没有新变更"
        else
            changed=$(git diff --cached --stat | tail -1)
            git commit -m "sync: $(hostname) $(date '+%Y-%m-%d %H:%M')"
            echo "[✓] 提交: $changed"
            git push
            echo "[✓] 推送完成"
        fi
        ;;

    pull)
        echo "=== 拉取变更 ==="
        cd "$SYNC_REPO"
        git pull
        echo "[✓] 拉取完成"

        # 如果是 copy 方式的原始电脑，需要把变更复制回去
        if [ ! -L "$CLAUDE_DIR/CLAUDE.md" ] && [ -f "$SYNC_REPO/CLAUDE.md" ]; then
            cp "$SYNC_REPO/CLAUDE.md" "$CLAUDE_DIR/CLAUDE.md"
        fi
        if [ ! -L "$CLAUDE_DIR/settings.json" ] && [ -f "$SYNC_REPO/settings.json" ]; then
            cp "$SYNC_REPO/settings.json" "$CLAUDE_DIR/settings.json"
        fi
        if [ ! -L "$CLAUDE_DIR/skills" ] && [ -d "$SYNC_REPO/skills" ]; then
            rsync -a --delete "$SYNC_REPO/skills/" "$CLAUDE_DIR/skills/"
        fi
        if [ ! -L "$CLAUDE_DIR/plugins" ] && [ -d "$SYNC_REPO/plugins" ]; then
            rsync -a --delete "$SYNC_REPO/plugins/" "$CLAUDE_DIR/plugins/"
        fi
        # 项目记忆
        if [ -d "$SYNC_REPO/project-memories" ]; then
            for mem_dir in "$SYNC_REPO/project-memories"/*/; do
                project_name=$(basename "$mem_dir")
                target="$CLAUDE_DIR/projects/$project_name/memory"
                if [ ! -L "$target" ]; then
                    mkdir -p "$CLAUDE_DIR/projects/$project_name"
                    rsync -a "${mem_dir}" "$target/"
                fi
            done
        fi
        echo "[✓] 本地文件已更新"
        ;;

    status)
        echo "=== 同步状态 ==="
        sync_to_repo
        cd "$SYNC_REPO"
        echo ""
        echo "--- 仓库大小 ---"
        du -sh "$SYNC_REPO" | awk '{print $1 " 总计"}'
        du -sh "$SYNC_REPO/skills" 2>/dev/null | awk '{print $1 " skills/"}'
        du -sh "$SYNC_REPO/plugins" 2>/dev/null | awk '{print $1 " plugins/"}'
        du -sh "$SYNC_REPO/project-memories" 2>/dev/null | awk '{print $1 " project-memories/"}'
        echo ""
        echo "--- 变更状态 ---"
        git status --short
        if [ -z "$(git status --short)" ]; then
            echo "(无未提交变更)"
        fi
        echo ""
        echo "--- 最近同步 ---"
        git log --oneline -5 2>/dev/null || echo "(无提交记录)"
        ;;

    *)
        echo "用法: bash sync.sh [push|pull|status]"
        echo ""
        echo "  push   — 把本机变更推送到远程"
        echo "  pull   — 从远程拉取变更到本机"
        echo "  status — 查看同步状态"
        exit 1
        ;;
esac
