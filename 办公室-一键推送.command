#!/bin/bash
set -euo pipefail
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
if ! python3 "$HOME/.claude-sync/upload.py"; then
  echo "上传失败，错误见上方；内容仍保留在本机。"
  if [ -t 0 ]; then read -r -p "按回车关闭..." _ || true; fi
  exit 1
fi
if [ -t 0 ]; then read -r -p "按回车关闭..." _ || true; fi
