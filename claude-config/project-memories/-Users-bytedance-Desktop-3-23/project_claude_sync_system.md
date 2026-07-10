---
name: project_claude_sync_system
description: "Cross-machine Claude Code + 3.23 sync system via private GitHub repo, controlled by a local web page"
metadata: 
  node_type: memory
  type: project
  originSessionId: 2d3a3686-33d4-4da5-8724-dbe12e686e30
---

用户搭了一套**办公室↔家里双机同步**系统(2026-07-08 做的),同步 Claude Code 配置 + 整个 3.23 工作目录。

**架构**:私有 GitHub 仓库 `git@github.com:wazngzemin/claude-sync.git` 做中转;本地控制台是一个网页 App。
- 同步仓库在 `~/.claude-sync/`(git repo),含 `claude-config/`(CLAUDE.md/settings/skills/plugins/project-memories) + `project-3.23/` + 页面代码。
- 控制台:`~/.claude-sync/sync-server.py`(Python HTTP,端口 9527)+ `dashboard.html`,由桌面「Claude同步管理.app」启动(`launch.sh` → 浏览器 localhost:9527)。App 图标 `AppIcon.icns`(蓝紫渐变+上下箭头)。
- 页面是**可展开文件树**:每行独立勾选,能钻到单个文件;勾文件夹=整个同步,展开勾单文件=只同步那一个。蓝「推送选中」=本机→云,绿「拉取选中」=云→本机。后端 `/api/roots` `/api/tree` `/api/sync`。

**关键坑/铁律**:
- `.env`(飞书 Lark 密钥)绝不能进仓库——已加 .gitignore + rsync 排除;GitHub push protection 会拦(GH013)。密钥没泄露过。
- 同步排除:.venv/node_modules/.git/媒体文件/video-panel output/Recordly大目录。曾因 114MB 的 .venv 撑爆 GitHub 100MB 上限,已清。
- 拉取用 `rsync -a`(**只加不删**),不会删掉某台多出来的技能(家里那台有 63 技能,办公室 25)。
- 两台内容会分叉(不同 CLAUDE.md/技能数);settings.json 拉取时自动把 `/Users/bytedance/` 改成当前用户路径。
- CLAUDE.md/技能/记忆是 **Claude Code 启动时才加载** → 拉取后必须完全退出重开。

**新机器设置**:`git clone <repo> ~/.claude-sync` → `cd ~/.claude-sync && bash build-dashboard-app.sh` → 双击桌面 App。之后就是双击 App → 勾 → 推送/拉取。

用户是非技术背景,要"点按钮"级别的简单;别再甩终端命令给他(除了一次性的新机器设置)。相关 [[user_profile]]。
