# Claude Code 双机同步方案

## 原理

把 `~/.claude/` 中需要同步的内容集中到一个 Git 仓库，两台电脑通过 push/pull 保持同步。
机器本地状态（session、cache、daemon）不同步。

## 需要同步的内容

```
~/.claude/
├── CLAUDE.md              ← 全局指令
├── settings.json          ← 设置/环境变量/模型
├── skills/                ← 26个自定义技能 (216M)
├── plugins/               ← 已安装插件 (45M)
└── projects/
    └── */memory/          ← 每个项目的记忆文件
```

## 使用方法

1. 在当前电脑运行 `setup.sh` 初始化
2. 在新电脑运行 `setup-new-machine.sh` 克隆并链接
3. 日常使用 `sync.sh push` / `sync.sh pull` 同步
