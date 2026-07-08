#!/bin/bash
# ============================================================
# Claude Code 迁移包 — 家里电脑双击安装
# 双击我就行，不用敲命令
# ============================================================
set -uo pipefail

# 找到本脚本所在目录（就是解压后的文件夹）
DIR="$(cd "$(dirname "$0")" && pwd)"
CLAUDE_DIR="$HOME/.claude"
PROJECT_DIR="$HOME/Desktop/3.23"

clear
echo "============================================================"
echo "   Claude Code 迁移安装"
echo "============================================================"
echo ""
echo "安装来源: $DIR"
echo "当前用户: $(whoami)"
echo ""

# ---- 用户名检查 ----
if [ "$(whoami)" != "bytedance" ]; then
    echo "⚠️  注意：办公室电脑用户名是 bytedance，你现在是 $(whoami)"
    echo "   项目记忆和 settings.json 里有硬编码路径 /Users/bytedance/"
    echo "   安装后 statusline 可能需要手动改路径（脚本会自动尝试修复）"
    echo ""
    read -p "   按回车继续，或 Ctrl+C 取消..." _
    echo ""
    FIX_PATHS=1
else
    FIX_PATHS=0
fi

mkdir -p "$CLAUDE_DIR" "$CLAUDE_DIR/projects"

# ---- 1. Claude 配置 ----
echo "--- 安装 Claude 配置 ---"
CFG="$DIR/claude-config"

if [ -f "$CFG/CLAUDE.md" ]; then
    [ -f "$CLAUDE_DIR/CLAUDE.md" ] && cp "$CLAUDE_DIR/CLAUDE.md" "$CLAUDE_DIR/CLAUDE.md.bak-$(date +%Y%m%d)"
    cp "$CFG/CLAUDE.md" "$CLAUDE_DIR/CLAUDE.md"
    echo "[✓] CLAUDE.md"
fi

if [ -f "$CFG/settings.json" ]; then
    [ -f "$CLAUDE_DIR/settings.json" ] && cp "$CLAUDE_DIR/settings.json" "$CLAUDE_DIR/settings.json.bak-$(date +%Y%m%d)"
    if [ "$FIX_PATHS" = "1" ]; then
        # 把 /Users/bytedance/ 换成当前用户路径
        sed "s|/Users/bytedance/|$HOME/|g" "$CFG/settings.json" > "$CLAUDE_DIR/settings.json"
        echo "[✓] settings.json (已修正路径为 $HOME)"
    else
        cp "$CFG/settings.json" "$CLAUDE_DIR/settings.json"
        echo "[✓] settings.json"
    fi
fi

if [ -d "$CFG/skills" ]; then
    mkdir -p "$CLAUDE_DIR/skills"
    rsync -a "$CFG/skills/" "$CLAUDE_DIR/skills/"
    n=$(ls -d "$CLAUDE_DIR/skills"/*/ 2>/dev/null | wc -l | tr -d ' ')
    echo "[✓] skills/ ($n 个技能)"
fi

if [ -d "$CFG/plugins" ]; then
    mkdir -p "$CLAUDE_DIR/plugins"
    rsync -a "$CFG/plugins/" "$CLAUDE_DIR/plugins/"
    echo "[✓] plugins/"
fi

if [ -d "$CFG/project-memories" ]; then
    for mem_dir in "$CFG/project-memories"/*/; do
        pname=$(basename "$mem_dir")
        # 如果用户名不同，替换记忆文件夹名里的路径编码
        if [ "$FIX_PATHS" = "1" ]; then
            pname_fixed=$(echo "$pname" | sed "s|-Users-bytedance-|-Users-$(whoami)-|")
        else
            pname_fixed="$pname"
        fi
        mkdir -p "$CLAUDE_DIR/projects/$pname_fixed/memory"
        rsync -a "$mem_dir" "$CLAUDE_DIR/projects/$pname_fixed/memory/"
        echo "[✓] 记忆: $pname_fixed"
    done
fi

# ---- 2. 3.23 项目文件 ----
echo ""
echo "--- 安装 3.23 项目文件 ---"
if [ -d "$DIR/project-3.23" ]; then
    mkdir -p "$PROJECT_DIR"
    rsync -a "$DIR/project-3.23/" "$PROJECT_DIR/"
    echo "[✓] ~/Desktop/3.23/ 已就绪"
fi

# ---- 3. 装管理面板（可选，用于以后同步）----
echo ""
echo "--- 安装同步管理面板 ---"
SYNC="$HOME/.claude-sync"
mkdir -p "$SYNC"
[ -f "$DIR/sync-server.py" ] && cp "$DIR/sync-server.py" "$SYNC/"
[ -f "$DIR/dashboard.html" ] && cp "$DIR/dashboard.html" "$SYNC/"
[ -f "$DIR/sync-engine.sh" ] && cp "$DIR/sync-engine.sh" "$SYNC/" && chmod +x "$SYNC/sync-engine.sh"

# 生成启动器
cat > "$SYNC/launch.sh" << 'LAUNCH'
#!/bin/bash
PORT=9527
cd "$HOME/.claude-sync"
if lsof -i :$PORT -sTCP:LISTEN > /dev/null 2>&1; then
    open "http://localhost:$PORT"; exit 0
fi
python3 sync-server.py &>/dev/null &
for i in $(seq 1 30); do
    curl -s "http://localhost:$PORT/api/status" > /dev/null 2>&1 && break
    sleep 0.2
done
open "http://localhost:$PORT"
LAUNCH
chmod +x "$SYNC/launch.sh"

# 生成桌面 App
APP="$HOME/Desktop/Claude同步管理.app"
rm -rf "$APP"
osacompile -o "$APP" -e 'on run
    do shell script "bash $HOME/.claude-sync/launch.sh &>/dev/null &"
    delay 1
end run' 2>/dev/null && echo "[✓] 桌面已生成「Claude同步管理.app」" || echo "[!] 管理面板 App 生成跳过"

echo ""
echo "============================================================"
echo "   ✅ 安装完成！"
echo ""
echo "   • Claude Code 配置、技能、记忆 → 已就位"
echo "   • 你的 3.23 工作文件 → 已放到 ~/Desktop/3.23/"
echo "   • 桌面上的「Claude同步管理.app」→ 以后同步用"
echo ""
echo "   现在打开 Claude Code 就是你熟悉的样子了。"
echo "============================================================"
echo ""
read -p "按回车关闭..." _
