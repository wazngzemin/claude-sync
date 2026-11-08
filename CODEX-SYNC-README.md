# Codex 跨电脑同步

Codex 使用独立页面和独立服务，不会和 Claude Code 的上传页面混在一起：

- Claude Code：`http://localhost:9527/`
- Codex：`http://localhost:9528/`
- Claude 仓库：继续使用现有 `~/.claude-sync`
- Codex 仓库：单独使用 `~/.codex-sync`

## 首次设置

先在 GitHub/GitLab 等位置创建一个空的私有 `codex-sync` 仓库（不要把公司会话仓库设为公开）。有远端地址后，两台电脑都建议直接克隆：

```bash
git clone <你的 codex-sync 私有仓库地址> ~/.codex-sync
```

如果目录已经存在但还没有 Git 元数据，再执行下面三行；不要重复执行 `remote add`：

```bash
mkdir -p ~/.codex-sync
git -C ~/.codex-sync init -b main
git -C ~/.codex-sync remote add origin <你的 codex-sync 私有仓库地址>
git -C ~/.codex-sync remote -v
```

运行 `/Users/bytedance/.claude-sync/launch.sh` 会启动两个本地服务并打开 Claude 页面；也可以单独运行 `/Users/bytedance/.claude-sync/codex-launch.sh` 打开 Codex 页面。

公司电脑在 `9528` 页面选择「导出并推送」；家里电脑选择「拉取并恢复」。两台电脑都只访问自己的 `localhost`，不会把 9527 或 9528 端口暴露到公网。

## 数据范围

快照包括：

- Codex 侧边栏元数据和归档任务；
- `sessions`、`archived_sessions` 中按 thread id 找到的原始 JSONL；
- `memories`、`rules`、`plans`、`agents` 和个人 Skill；
- `generated_images`、`visualizations`；
- `/Users/bytedance/Documents/ChatGPT/个人` 的完整压缩快照。

不会把 live SQLite、WAL/SHM、缓存、OAuth、API Key 或锁文件放进同步仓库。大型会话会压缩并拆成小于远端单文件限制的 gzip 分片，家里读取或原生导入时再按顺序拼回原始 JSONL。

## 原生导入限制

家里 Codex 必须完全退出，并且目标数据库必须为空、schema 与公司电脑兼容。导入前会自动备份目标数据库；不兼容或非空时只保留网页镜像，不覆盖家里数据。

原生导入恢复的是历史记录和侧边栏状态，不会把公司电脑上正在运行的任务、终端进程或工具执行状态迁移到家里。

## 环境变量

需要不同目录时，可以在启动同步服务前设置：

```bash
export CODEX_HOME_DIR=/path/to/.codex
export CODEX_PERSONAL_DIR=/path/to/个人
export CODEX_SYNC_REPO_DIR=/path/to/.codex-sync
```

## 本地回归测试

```bash
python3 /Users/bytedance/.claude-sync/test_codex_sync.py
```

测试使用临时数据库和临时目录，不会读取真实 Codex 历史。
