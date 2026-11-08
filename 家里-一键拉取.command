#!/bin/bash
# 拉取和分发统一使用同步引擎，任何失败立即停止。
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
if [ "$DIR" != "$HOME/.claude-sync" ] || [ ! -d "$DIR/.git" ]; then
    echo "错误：请先将完整 Git 仓库克隆到 $HOME/.claude-sync；请看「家里首次设置.txt」。" >&2
    exit 1
fi
trap 'echo "拉取或安装失败，未完成。请保留上方报错；不要反复覆盖本机文件。" >&2' ERR
bash "$DIR/sync-engine.sh" pull
echo "完成：配置、技能、项目记忆和 3.23 工作文件已分发。聊天记录、账号登录和软件安装不在同步范围内。"
if [ -t 0 ]; then read -r -p "按回车关闭..." _ || true; fi
