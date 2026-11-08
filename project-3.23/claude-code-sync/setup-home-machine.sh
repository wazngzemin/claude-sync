#!/bin/bash
# ============================================================
# 家里电脑一键设置
# 用法: bash setup-home-machine.sh git@github.com:用户名/claude-sync.git
# ============================================================
set -euo pipefail

SYNC_REPO="$HOME/.claude-sync"
CLAUDE_DIR="$HOME/.claude"
PROJECT_DIR="$HOME/Desktop/3.23"

if [ -z "${1:-}" ]; then
    echo "用法: bash setup-home-machine.sh <GitHub仓库地址>"
    echo "例如: bash setup-home-machine.sh git@github.com:username/claude-sync.git"
    exit 1
fi

REMOTE_URL="$1"

echo "=== 家里电脑设置 ==="
echo ""

# 1. 克隆同步仓库
if [ -d "$SYNC_REPO/.git" ]; then
    echo "[信息] 仓库已存在，拉取最新..."
    cd "$SYNC_REPO" && git pull
else
    echo "克隆仓库中（可能需要几分钟）..."
    git clone "$REMOTE_URL" "$SYNC_REPO"
    echo "[✓] 克隆完成"
fi

# 2. 安装同步引擎
chmod +x "$SYNC_REPO/sync-engine.sh"
echo "[✓] 同步引擎就绪"

# 3. 分发文件到本地
echo ""
echo "--- 分发 Claude 配置 ---"
mkdir -p "$CLAUDE_DIR" "$CLAUDE_DIR/projects"

CFG="$SYNC_REPO/claude-config"

[ -f "$CFG/CLAUDE.md" ] && cp "$CFG/CLAUDE.md" "$CLAUDE_DIR/CLAUDE.md" && echo "[✓] CLAUDE.md"
[ -f "$CFG/settings.json" ] && cp "$CFG/settings.json" "$CLAUDE_DIR/settings.json" && echo "[✓] settings.json"

if [ -d "$CFG/skills" ]; then
    mkdir -p "$CLAUDE_DIR/skills"
    rsync -a --delete "$CFG/skills/" "$CLAUDE_DIR/skills/"
    count=$(ls -d "$CLAUDE_DIR/skills"/*/ 2>/dev/null | wc -l | tr -d ' ')
    echo "[✓] skills/ ($count 个技能)"
fi

if [ -d "$CFG/plugins" ]; then
    mkdir -p "$CLAUDE_DIR/plugins"
    rsync -a --delete "$CFG/plugins/" "$CLAUDE_DIR/plugins/"
    echo "[✓] plugins/"
fi

if [ -d "$CFG/project-memories" ]; then
    for mem_dir in "$CFG/project-memories"/*/; do
        pname=$(basename "$mem_dir")
        mkdir -p "$CLAUDE_DIR/projects/$pname/memory"
        rsync -a "${mem_dir}" "$CLAUDE_DIR/projects/$pname/memory/"
        echo "[✓] 记忆: $pname"
    done
fi

# 4. 分发 3.23 项目
echo ""
echo "--- 分发 3.23 项目 ---"
if [ -d "$SYNC_REPO/project-3.23" ]; then
    mkdir -p "$PROJECT_DIR"
    rsync -a "$SYNC_REPO/project-3.23/" "$PROJECT_DIR/"
    echo "[✓] ~/Desktop/3.23/ 已就绪"
fi

# 5. 构建 Dock App
echo ""
echo "--- 构建 Dock App ---"

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
echo "[✓] Claude同步-拉取.app 已放到桌面"

PUSH_APP="$HOME/Desktop/Claude同步-推送.app"
rm -rf "$PUSH_APP"
osacompile -o "$PUSH_APP" -e '
on run
    try
        display notification "正在推送..." with title "Claude Sync" subtitle "⏳ 同步中"
        set result_text to do shell script "bash $HOME/.claude-sync/sync-engine.sh push 2>&1"
        set last_line to last paragraph of result_text
        display notification last_line with title "Claude Sync" subtitle "✅ 推送完成"
    on error errMsg
        display notification errMsg with title "Claude Sync" subtitle "❌ 推送失败"
        display dialog "同步失败：" & return & return & errMsg buttons {"确定"} default button 1 with icon stop
    end try
end run
'
echo "[✓] Claude同步-推送.app 已放到桌面"

# 6. 路径提醒
echo ""
echo "================================================"
echo "家里电脑设置完成！"
echo ""
echo "⚠️  settings.json 中可能有硬编码路径需要调整："
echo "   如 /Users/bytedance/.bun/bin/bun"
echo "   如果家里用户名不同，需手动改一下"
echo ""
echo "📥 把「Claude同步-拉取」拖到 Dock 栏"
echo "   每天回家点一下就能同步"
echo "================================================"
