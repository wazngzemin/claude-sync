#!/bin/bash
# 安装前必须已有标准位置的完整仓库，避免创建无法同步的空壳。
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
SYNC="$HOME/.claude-sync"
if [ "$DIR" != "$SYNC" ] || [ ! -d "$SYNC/.git" ]; then
    echo "错误：安装需要 $SYNC 下的完整 Git 仓库。下载 ZIP 或单独复制 App 不足以同步。" >&2
    echo "请先按「家里首次设置.txt」配置仓库访问并克隆；已有目录请先保留，不要删除。" >&2
    exit 1
fi
for tool in git rsync python3 osacompile; do
    command -v "$tool" >/dev/null || { echo "缺少依赖：$tool" >&2; exit 1; }
done
for file in sync-engine.sh sync-server.py dashboard.html launch.sh; do
    [ -f "$SYNC/$file" ] || { echo "缺少程序文件：$file" >&2; exit 1; }
done
trap 'echo "安装失败，请保留上方报错。" >&2' ERR
bash "$SYNC/sync-engine.sh" pull
# 使用随仓库提供的启动脚本，不重写为旧版。
mkdir -p "$HOME/.claude-sync-state" "$HOME/Desktop"
BUILD_DIR=$(mktemp -d "$HOME/.claude-sync-state/app-build.XXXXXXXX")
osacompile -o "$BUILD_DIR/Claude同步管理.app" -e 'on run
    do shell script "bash \"$HOME/.claude-sync/launch.sh\" >/dev/null 2>&1 &"
    delay 1
end run'
APP="$HOME/Desktop/Claude同步管理.app"
if [ -e "$APP" ]; then
    mv "$APP" "$BUILD_DIR/Claude同步管理-安装前备份.app"
fi
mv "$BUILD_DIR/Claude同步管理.app" "$APP"
echo "安装完成：桌面 App 已创建。同步的是配置、技能、项目记忆和工作文件，不包含聊天记录或账号登录。"
if [ -t 0 ]; then read -r -p "按回车关闭..." _ || true; fi
