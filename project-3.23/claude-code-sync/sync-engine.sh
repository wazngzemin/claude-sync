#!/bin/bash
# ============================================================
# Claude Code 一键同步引擎
# 用法:
#   bash sync-engine.sh push    — 推送到远程
#   bash sync-engine.sh pull    — 从远程拉取
#   bash sync-engine.sh init    — 首次初始化
#   bash sync-engine.sh status  — 查看状态
# ============================================================
set -euo pipefail

SYNC_REPO="$HOME/.claude-sync"
CLAUDE_DIR="$HOME/.claude"
PROJECT_DIR="$HOME/Desktop/3.23"

# ---- 颜色 ----
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log()  { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
err()  { echo -e "${RED}[✗]${NC} $1"; }

# ---- 收集文件到同步仓库 ----
collect_files() {
    echo "收集文件中..."

    # --- Claude 配置 ---
    mkdir -p "$SYNC_REPO/claude-config"

    # CLAUDE.md
    [ -f "$CLAUDE_DIR/CLAUDE.md" ] && cp "$CLAUDE_DIR/CLAUDE.md" "$SYNC_REPO/claude-config/CLAUDE.md"

    # settings.json
    [ -f "$CLAUDE_DIR/settings.json" ] && cp "$CLAUDE_DIR/settings.json" "$SYNC_REPO/claude-config/settings.json"

    # skills（跳过嵌套 .git）
    if [ -d "$CLAUDE_DIR/skills" ]; then
        rsync -a --delete \
            --exclude='.git/' \
            --exclude='node_modules/' \
            "$CLAUDE_DIR/skills/" "$SYNC_REPO/claude-config/skills/"
    fi

    # plugins
    if [ -d "$CLAUDE_DIR/plugins" ]; then
        rsync -a --delete \
            --exclude='.git/' \
            --exclude='node_modules/' \
            "$CLAUDE_DIR/plugins/" "$SYNC_REPO/claude-config/plugins/"
    fi

    # 项目记忆
    mkdir -p "$SYNC_REPO/claude-config/project-memories"
    for memory_dir in "$CLAUDE_DIR/projects"/*/memory; do
        if [ -d "$memory_dir" ]; then
            pname=$(basename "$(dirname "$memory_dir")")
            mkdir -p "$SYNC_REPO/claude-config/project-memories/$pname"
            rsync -a "$memory_dir/" "$SYNC_REPO/claude-config/project-memories/$pname/"
        fi
    done

    log "Claude 配置已收集"

    # --- 3.23 项目 ---
    if [ -d "$PROJECT_DIR" ]; then
        rsync -a --delete \
            --exclude='.git/' \
            --exclude='node_modules/' \
            --exclude='video-panel/output/' \
            --exclude='video-panel/bin/' \
            --exclude='Recordly/.git/' \
            --exclude='Recordly/node_modules/' \
            --exclude='Recordly/.tmp/' \
            --exclude='.whiteboard-build/' \
            --exclude='claude-code-sync/' \
            --exclude='*.mp4' \
            --exclude='*.mp3' \
            --exclude='*.wav' \
            --exclude='*.tar.gz' \
            --exclude='.DS_Store' \
            --exclude='__pycache__/' \
            "$PROJECT_DIR/" "$SYNC_REPO/project-3.23/"
        log "3.23 项目已收集"
    fi
}

# ---- 分发文件到本地 ----
distribute_files() {
    echo "分发文件中..."

    # --- Claude 配置 ---
    local cfg="$SYNC_REPO/claude-config"

    [ -f "$cfg/CLAUDE.md" ] && cp "$cfg/CLAUDE.md" "$CLAUDE_DIR/CLAUDE.md"
    [ -f "$cfg/settings.json" ] && cp "$cfg/settings.json" "$CLAUDE_DIR/settings.json"

    if [ -d "$cfg/skills" ]; then
        mkdir -p "$CLAUDE_DIR/skills"
        rsync -a --delete "$cfg/skills/" "$CLAUDE_DIR/skills/"
    fi

    if [ -d "$cfg/plugins" ]; then
        mkdir -p "$CLAUDE_DIR/plugins"
        rsync -a --delete "$cfg/plugins/" "$CLAUDE_DIR/plugins/"
    fi

    # 项目记忆
    if [ -d "$cfg/project-memories" ]; then
        for mem_dir in "$cfg/project-memories"/*/; do
            pname=$(basename "$mem_dir")
            mkdir -p "$CLAUDE_DIR/projects/$pname/memory"
            rsync -a "${mem_dir}" "$CLAUDE_DIR/projects/$pname/memory/"
        done
    fi

    log "Claude 配置已分发"

    # --- 3.23 项目 ---
    if [ -d "$SYNC_REPO/project-3.23" ]; then
        mkdir -p "$PROJECT_DIR"
        rsync -a \
            --exclude='claude-code-sync/' \
            "$SYNC_REPO/project-3.23/" "$PROJECT_DIR/"
        log "3.23 项目已分发"
    fi
}

# ============================================================
# 主命令
# ============================================================
case "${1:-help}" in

    init)
        echo "=== 初始化同步仓库 ==="
        if [ -d "$SYNC_REPO/.git" ]; then
            warn "仓库已存在: $SYNC_REPO"
        else
            mkdir -p "$SYNC_REPO"
            cd "$SYNC_REPO"
            git init
            # .gitignore
            cat > .gitignore << 'EOF'
.DS_Store
__pycache__/
*.pyc
node_modules/
*.mp4
*.mp3
*.wav
*.tar.gz
EOF
            log "仓库已创建"
        fi

        collect_files

        cd "$SYNC_REPO"
        git add -A
        git commit -m "初始化 Claude Code 同步" || true

        echo ""
        echo "================================================"
        echo "初始化完成！仓库在: $SYNC_REPO"
        echo ""
        echo "下一步 — 创建 GitHub 私有仓库后运行:"
        echo "  cd $SYNC_REPO"
        echo "  git remote add origin git@github.com:你的用户名/claude-sync.git"
        echo "  git branch -M main"
        echo "  git push -u origin main"
        echo "================================================"
        ;;

    push)
        echo "=== 推送同步 ==="
        collect_files
        cd "$SYNC_REPO"
        git add -A
        if git diff --cached --quiet; then
            log "没有新变更"
            SUMMARY="无变更"
        else
            SUMMARY=$(git diff --cached --stat | tail -1)
            git commit -m "sync $(hostname -s) $(date '+%m-%d %H:%M')"
            log "已提交: $SUMMARY"
            git push 2>&1
            log "推送完成"
        fi
        echo "$SUMMARY"
        ;;

    pull)
        echo "=== 拉取同步 ==="
        cd "$SYNC_REPO"
        OUTPUT=$(git pull 2>&1)
        echo "$OUTPUT"
        if echo "$OUTPUT" | grep -q "Already up to date"; then
            log "已是最新"
        else
            distribute_files
            log "拉取并分发完成"
        fi
        ;;

    status)
        echo "=== 同步状态 ==="
        collect_files
        cd "$SYNC_REPO"
        echo ""
        echo "--- 仓库大小 ---"
        du -sh "$SYNC_REPO" | awk '{print "  总计: " $1}'
        du -sh "$SYNC_REPO/claude-config" 2>/dev/null | awk '{print "  Claude配置: " $1}'
        du -sh "$SYNC_REPO/project-3.23" 2>/dev/null | awk '{print "  3.23项目: " $1}'
        echo ""
        echo "--- 未提交变更 ---"
        CHANGES=$(git status --short | wc -l | tr -d ' ')
        if [ "$CHANGES" = "0" ]; then
            echo "  (无)"
        else
            git status --short | head -20
            [ "$CHANGES" -gt 20 ] && echo "  ... 还有 $((CHANGES - 20)) 个文件"
        fi
        echo ""
        echo "--- 最近同步 ---"
        git log --oneline --format='  %h  %s  (%ar)' -5 2>/dev/null || echo "  (无记录)"
        ;;

    help|*)
        echo "Claude Code 一键同步"
        echo ""
        echo "用法: bash sync-engine.sh [命令]"
        echo ""
        echo "  init    首次初始化同步仓库"
        echo "  push    收集文件并推送到远程"
        echo "  pull    从远程拉取并分发到本地"
        echo "  status  查看同步状态"
        ;;
esac
