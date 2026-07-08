# fork-memo

把一篇文章 fork 成可运行的记忆工具。喂任意文本，生成**尖锐**的记忆问题，按间隔重复安排复习。

灵感：MindCode 周报 No.69《别再"读"文章，要"fork"文章》。这个工具本身就是那篇文章的 fork。

## 使用

```bash
# 从文件 fork
python3 fork.py ingest examples/mindcode-69-fork-articles.md

# 从粘贴 fork
pbpaste | python3 fork.py ingest -

# 复习（交互式）
python3 fork.py review

# 看看库里有什么
python3 fork.py list
python3 fork.py stats
```

复习时按键：
- `g` good → 间隔翻倍
- `h` hard → 间隔不变
- `a` again → 间隔重置到 1 天
- `q` 退出

## 依赖

只需要 `claude` CLI（Claude Code）。不需要 ANTHROPIC_API_KEY，不需要安装 SDK。

## 数据

卡片存在 `data/memory.json`，纯 JSON、可读、可手改。

## 为什么问题"尖锐"

prompt（`prompts/extract.md`）显式禁止表面复述题，强制每张卡必须是以下类型之一：

| 类型 | 干什么的 |
|------|---------|
| inversion | 把前提取反，问结论还成不成立 |
| application | 套到读者自己的具体情境 |
| contradiction | 暴露观点的边界或例外 |
| prediction | 推断文章没说的情况 |
| commitment | 要求本周可执行的具体动作 |

不满意？改 `prompts/extract.md` 就行——这就是 fork 的意义。
