# Karpathy LLM Wiki — 项目 Schema

本项目采用 Karpathy LLM Wiki 方法论，维护一个三层架构的知识库。

## 目录结构

```
raw/                    # 第 1 层：原始素材（不可变，LLM 只读不写）
├── assets/             # 图片、附件等本地资源
└── articles/           # 文章、网页剪藏等原始文件

wiki/                   # 第 2 层：Wiki 层（LLM 生成和维护）
├── index.md            # 内容索引：所有 wiki 页面的目录
├── log.md              # 操作日志：append-only 记录
├── entities/           # 实体页：人物、组织、工具、产品
├── concepts/           # 概念页：抽象概念、方法论、框架
├── comparisons/        # 对比分析页：A vs B 类型分析
├── summaries/          # 源文件摘要：每篇原始素材的摘要
└── synthesis/          # 综合分析：跨素材的深度综合

.Codex/AGENTS.md       # 第 3 层：Schema（本文件）
```

## 页面命名规范

- 使用小写英文 + 连字符：`my-topic.md`
- 中文主题可用拼音或英文翻译命名
- 文件名应简短、描述性强、可排序
- 同一主题的不同角度用子目录区分，不用后缀

## Frontmatter 格式

每个 wiki 页面必须包含以下 YAML frontmatter：

```yaml
---
title: 页面标题
date: YYYY-MM-DD          # 创建日期
updated: YYYY-MM-DD       # 最后更新日期
tags: [tag1, tag2]        # 分类标签
sources:                  # 引用的 raw/ 文件路径列表
  - raw/articles/xxx.md
status: draft | active | archived
---
```

### 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| title | 是 | 页面标题 |
| date | 是 | 创建日期 |
| updated | 否 | 最后更新日期，lint 时更新 |
| tags | 是 | 至少一个标签 |
| sources | 是 | 引用的 raw/ 文件，`synthesis/` 页面至少两个 |
| status | 是 | 生命周期状态 |

## 三种操作流程

### 1. Ingest（摄入）

当用户提供新的原始素材或要求处理已有素材时：

1. 将新素材存入 `raw/articles/`（如果是新文件）
2. 阅读素材内容
3. 在 `wiki/summaries/` 创建对应的摘要页
4. 提取关键实体，在 `wiki/entities/` 创建或更新实体页
5. 提取关键概念，在 `wiki/concepts/` 创建或更新概念页
6. 更新 `wiki/index.md` 中的索引表
7. 在 `wiki/log.md` 追加一条 ingest 记录

### 2. Query（查询）

当用户提问关于知识库中的内容时：

1. 搜索相关 wiki 页面（通过 index.md 定位）
2. 必要时回溯 raw/ 中的原始素材
3. 如果涉及多个素材的比较，在 `wiki/comparisons/` 创建对比页
4. 在 `wiki/log.md` 追加一条 query 记录

### 3. Lint（整理）

当用户要求整理知识库或定期维护时：

1. 检查所有 wiki 页面的 frontmatter 完整性
2. 更新 `index.md` 确保索引完整
3. 检查是否有孤立的 wiki 页面（无 incoming/outgoing links）
4. 标记长期未更新的页面为 `status: archived`
5. 在 `wiki/log.md` 追加一条 lint 记录

## index.md 更新规则

- 每次 ingest 操作后必须更新
- 每次 lint 操作后必须更新
- 保持表格格式，每行包含页面链接和一行摘要
- 按子目录分区展示

## log.md 更新规则

- **append-only**：永远不修改或删除已有条目
- 每次操作追加一行到表格末尾
- 格式：`| YYYY-MM-DD HH:MM | 操作类型 | 目标文件 | 简要说明 |`

## raw/ 不可变规则

- `raw/` 下的文件是原始素材，**LLM 绝不修改**
- 如果需要修正，在对应的 wiki 页面中添加注释
- 新素材只能追加，不能覆盖已有文件

## 标签体系

使用以下标签分类（可扩展）：

- `entity` — 实体类页面
- `concept` — 概念类页面
- `comparison` — 对比分析
- `summary` — 源文件摘要
- `synthesis` — 综合分析
- `technology` — 技术相关
- `product` — 产品相关
- `methodology` — 方法论
- `meeting` — 会议记录
- `architecture` — 架构设计
