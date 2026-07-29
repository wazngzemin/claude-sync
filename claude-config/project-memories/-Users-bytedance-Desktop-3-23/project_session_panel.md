---
name: session-panel
description: "会话管理面板 session_panel.py（:8780）的维护规则——刷新必须全量最新；\"今天\"=今天打开过终端"
metadata: 
  node_type: memory
  type: project
  originSessionId: 62cd50a6-8f5d-458b-aa48-191996a04476
  modified: 2026-07-29T03:57:34.846Z
---

泽民的会话管理面板：`~/scripts/session_panel.py`（Desktop/3.23/session_panel.py 是指向它的软链）→ http://localhost:8780，扫描 `~/.claude/projects/*/*.jsonl`。

**已装 launchd 守护**（2026-07-29）：`~/Library/LaunchAgents/com.zemin.session-panel.plist`，RunAtLoad+KeepAlive，开机自启、挂了自动拉起，日志在 /tmp/session_panel.log。重启命令：`launchctl kickstart -k gui/$(id -u)/com.zemin.session-panel`。注意坑：脚本不能放 Desktop（macOS TCC 隐私保护会拦 launchd 进程读桌面，报 Operation not permitted），所以真身在 ~/scripts/；手动启动时 `sys.stdout.isatty()` 才自动开浏览器，守护模式不弹窗。

两条已拍板的规则（2026-07-29）：
1. **刷新 = 全部刷新出来**：任何时刻刷新页面都必须看到磁盘上全部会话的最新状态，不允许吃过期缓存。实现：`/api/sessions` 每次请求都走 `load_all()` 增量重扫（按 mtime+大小判断文件是否变化，只重解析变了的文件）。
2. **"今天"分组 = 今天打开/恢复过终端**（按文件 mtime，即 `active_ts`），不是"今天说过话"。早上 resume 的旧会话即使最后对话在昨晚，也要算进今天；卡片上仍显示真实最后对话时间。
3. **去重**：同项目 + 同标题 + 同一天活跃 → 只显示最近活跃的一个，卡片上加"⊕ 合并×N"标记。背景：技术上不存在真重复（resume 写入同一文件），重复感来自同一天反复开的同标题测试会话（"你好"×8、"nihao"×8 等）。

注意：只打开但一句话没说的空终端（1KB 空 jsonl）不显示，属正常。
