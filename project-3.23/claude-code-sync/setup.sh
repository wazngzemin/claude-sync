#!/bin/bash
# ============================================================
# Claude Code 同步 — 当前电脑初始化
# 在已有配置的电脑上运行一次
# ============================================================
set -euo pipefail

SYNC_REPO="$HOME/.claude-sync"
CLAUDE_DIR="$HOME/.claude"

echo "=== Claude Code 同步初始化 ==="
echo ""

# 1. 创建同步仓库
if [ -d "$SYNC_REPO/.git" ]; then
    echo "[跳过] $SYNC_REPO 已存在"
else
    mkdir -p "$SYNC_REPO"
    cd "$SYNC_REPO"
    git init
    echo "[✓] 创建同步仓库: $SYNC_REPO"
fi

# 2. 复制需要同步的文件
echo ""
echo "--- 复制核心配置 ---"

# CLAUDE.md
cp "$CLAUDE_DIR/CLAUDE.md" "$SYNC_REPO/CLAUDE.md" 2>/dev/null && echo "[✓] CLAUDE.md" || echo "[跳过] CLAUDE.md 不存在"

# settings.json（不复制 settings.local.json，那是机器特有的）
cp "$CLAUDE_DIR/settings.json" "$SYNC_REPO/settings.json" 2>/dev/null && echo "[✓] settings.json" || echo "[跳过] settings.json 不存在"

# 3. 复制 skills
echo ""
echo "--- 复制 skills (可能需要几分钟) ---"
if [ -d "$CLAUDE_DIR/skills" ]; then
    rsync -a --delete "$CLAUDE_DIR/skills/" "$SYNC_REPO/skills/"
    skill_count=$(ls -d "$SYNC_REPO/skills"/*/ 2>/dev/null | wc -l | tr -d ' ')
    echo "[✓] skills/ ($skill_count 个技能)"
else
    echo "[跳过] skills/ 不存在"
fi

# 4. 复制 plugins
echo ""
echo "--- 复制 plugins ---"
if [ -d "$CLAUDE_DIR/plugins" ]; then
    rsync -a --delete "$CLAUDE_DIR/plugins/" "$SYNC_REPO/plugins/"
    echo "[✓] plugins/"
else
    echo "[跳过] plugins/ 不存在"
fi

# 5. 复制项目记忆（只复制 memory/ 子目录，不复制会话数据）
echo ""
echo "--- 复制项目记忆 ---"
mkdir -p "$SYNC_REPO/project-memories"
if [ -d "$CLAUDE_DIR/projects" ]; then
    for memory_dir in "$CLAUDE_DIR/projects"/*/memory; do
        if [ -d "$memory_dir" ]; then
            project_name=$(basename "$(dirname "$memory_dir")")
            mkdir -p "$SYNC_REPO/project-memories/$project_name"
            rsync -a "$memory_dir/" "$SYNC_REPO/project-memories/$project_name/"
            file_count=$(find "$SYNC_REPO/project-memories/$project_name" -type f | wc -l | tr -d ' ')
            echo "[✓] $project_name ($file_count 个记忆文件)"
        fi
    done
else
    echo "[跳过] 无项目记忆"
fi

# 6. 创建 .gitignore
cat > "$SYNC_REPO/.gitignore" << 'GITIGNORE'
# 编译缓存和临时文件
*.pyc
__pycache__/
node_modules/
.DS_Store

# skills 中的 git 子仓库（保留文件内容，忽略嵌套 .git）
skills/**/.git/
plugins/**/.git/
GITIGNORE

echo ""
echo "[✓] .gitignore"

# 7. 首次提交
cd "$SYNC_REPO"
git add -A
if git diff --cached --quiet; then
    echo ""
    echo "[信息] 没有新变更需要提交"
else
    git commit -m "初始化 Claude Code 同步"
    echo ""
    echo "[✓] 首次提交完成"
fi

# 8. 提示添加远程仓库
echo ""
echo "============================================================"
echo "初始化完成！同步仓库在: $SYNC_REPO"
echo ""
echo "下一步：创建 GitHub 私有仓库并推送"
echo ""
echo "  1. 去 GitHub 创建私有仓库 (如: claude-code-sync)"
echo "  2. 运行:"
echo "     cd $SYNC_REPO"
echo "     git remote add origin git@github.com:你的用户名/claude-code-sync.git"
echo "     git push -u origin main"
echo ""
echo "  3. 在新电脑上运行 setup-new-machine.sh"
echo "============================================================"
