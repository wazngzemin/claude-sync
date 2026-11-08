# 车载 Memory \&amp; Context 技术方案深度对比分析

<div class="callout">

调研文档：

[OpenClaw Context 与 Memory 技术实现深度解析](https://bytedance.larkoffice.com/docx/I4SAdyDjwouvLDxmnfgcg6Einlh)

[MOA Memory \&amp; Context 技术文档](https://bytedance.larkoffice.com/docx/PLXBdmOVzoIhugx0VxAc9R3xnxe)

https://bytetech\.info/articles/7623395599240396806?from=message\_bot\&amp;sender\_type=101\&amp;message\_id=7623611210777411622\&amp;column=follow\-follow\_author\#doxcnxWVgT6FriERnWV7uFNHsxh

</div>

# 一、引言

## 1\.1 文档目的

本文档对三套 Memory \&amp; Context 技术方案——**车载 Mem0**、**MOA Memory**、**OpenClaw Memory**——进行系统性的深度对比分析，聚焦车载多人对话场景的特殊需求，提出在现有车载 Mem0 方案基础上的改进方向和工程实施建议。

## 1\.2 分析范围

<table><tbody>
<tr>
<td>

方案

</td>
<td>

来源

</td>
<td>

定位

</td>
</tr>
<tr>
<td>

车载 Mem0

</td>
<td>

基于开源 Mem0 架构的车载适配方案

</td>
<td>

车载智能助手长期记忆模块

</td>
</tr>
<tr>
<td>

MOA Memory

</td>
<td>

SWALM MOA 多智能体框架内建记忆子模块

</td>
<td>

多 Agent 框架级记忆服务

</td>
</tr>
<tr>
<td>

OpenClaw

</td>
<td>

开源个人 AI Agent 平台的 Context \&amp; Memory 系统

</td>
<td>

以工作区为核心的全栈记忆方案

</td>
</tr>
</tbody></table>

## 1\.3 核心评估维度

- 架构设计哲学与数据模型

- 记忆写入机制（提取、决策、持久化）

- 记忆检索管线（检索方式、融合策略、质量优化）

- 上下文管理能力（Token 管理、Compaction、防丢失）

- 多用户 / Multi\-Agent 支持

- 车载场景适配性

---

# 二、三大方案架构总览

## 2\.1 设计哲学对比

<table><tbody>
<tr>
<td>

维度

</td>
<td>

车载 Mem0

</td>
<td>

MOA Memory

</td>
<td>

OpenClaw

</td>
</tr>
<tr>
<td>

**核心哲学**

</td>
<td>

语义驱动 \+ 非结构化存储，LLM 自主管理记忆生命周期

</td>
<td>

系统自动管理 \+ 多 Agent 共享记忆，全自动化 pipeline

</td>
<td>

文件即记忆，用户完全可控，透明可编辑

</td>
</tr>
<tr>
<td>

**Source of Truth**

</td>
<td>

Qdrant 向量数据库

</td>
<td>

SQLite（结构化主存储）

</td>
<td>

纯 Markdown 文件

</td>
</tr>
<tr>
<td>

**记忆粒度**

</td>
<td>

单条事实/偏好（非结构化文本）

</td>
<td>

三类结构化模型（偏好/任务/摘要）

</td>
<td>

分层文件体系（Bootstrap \+ 日志 \+ 精选层）

</td>
</tr>
<tr>
<td>

**Multi\-Agent**

</td>
<td>

未涉及

</td>
<td>

原生支持（MemoryContext 共享）

</td>
<td>

单 Agent 为主，跨 Session 协调

</td>
</tr>
<tr>
<td>

**用户可见性**

</td>
<td>

不可见、不可编辑

</td>
<td>

不可见、不可编辑

</td>
<td>

完全透明，用户可直接查看/编辑

</td>
</tr>
<tr>
<td>

**车载适配**

</td>
<td>

有初步规划（多模态、低延迟、隐私等）

</td>
<td>

未涉及车载场景

</td>
<td>

面向桌面/服务器场景

</td>
</tr>
</tbody></table>

## 2\.2 系统架构对比

**车载 Mem0** 采用两阶段闭环架构：

- **Extraction Phase（召回）**：用户输入 → Embedding → Qdrant 向量检索 → Top\-K 记忆 → 注入 System Prompt

- **Update Phase（更新）**：对话结束 → FACT\_RETRIEVAL\_PROMPT 事实提取 → 相似记忆检索 → Function Calling Prompt 增删改决策 → Qdrant 写入

**MOA Memory** [采用三通道接入架构：](https://bytedance.larkoffice.com/docx/PLXBdmOVzoIhugx0VxAc9R3xnxe#share-FhIrdG2gzouRQNxrXVocd3uanJb)

- **预注入通道**：会话启动时，用户偏好和近期摘要通过占位符一次性注入 System Prompt

- **按需检索通道**：模型可主动调用 search\_memory 工具检索历史任务

- **生命周期钩子通道**：每轮后置偏好抽取 \+ 任务完成时摘要生成 \+ 近期滚动摘要更新

**OpenClaw** [采用四层记忆 \+ 可插拔 Context Engine 架构：](https://bytedance.larkoffice.com/docx/I4SAdyDjwouvLDxmnfgcg6Einlh#share-GyAkd0jhKooYt7xRUfSc6bTwn8f)

- **Layer 1（Bootstrap Files）**：SOUL\.md / AGENTS\.md / MEMORY\.md 等，每次会话必读

- **Layer 2（Daily Files）**：按日期组织的对话日志，语义检索

- **Layer 3（Context Window）**：每轮动态重建的 System Prompt

- **Layer 4（Semantic Index）**：Vector \+ BM25 混合索引加速检索

---

# 三、记忆存储与数据模型深度对比

## 3\.1 存储后端选型

<table><tbody>
<tr>
<td>

维度

</td>
<td>

车载 Mem0

</td>
<td>

MOA Memory

</td>
<td>

OpenClaw

</td>
</tr>
<tr>
<td>

**主存储**

</td>
<td>

Qdrant 向量数据库

</td>
<td>

SQLite（WAL 模式）

</td>
<td>

Markdown 文件

</td>
</tr>
<tr>
<td>

**向量存储**

</td>
<td>

Qdrant 内置

</td>
<td>

ChromaDB（本地持久化）

</td>
<td>

SQLite\-vec

</td>
</tr>
<tr>
<td>

**全文索引**

</td>
<td>

无

</td>
<td>

SQLite LIKE（弱匹配）

</td>
<td>

FTS5 BM25（专业全文检索）

</td>
</tr>
<tr>
<td>

**隔离方式**

</td>
<td>

user\_id metadata 过滤

</td>
<td>

per\-user 独立 DB 文件

</td>
<td>

per\-agent 独立 workspace

</td>
</tr>
<tr>
<td>

**嵌入式部署**

</td>
<td>

需要部署 Qdrant 服务

</td>
<td>

嵌入式（SQLite \+ ChromaDB）

</td>
<td>

嵌入式（SQLite \+ 文件）

</td>
</tr>
</tbody></table>

**车载场景评估**：

- Qdrant 需要独立服务进程，对车载嵌入式环境增加运维复杂度

- SQLite \+ ChromaDB 嵌入式模式对车载更友好，但 ChromaDB 体积较大

- OpenClaw 的 SQLite\-vec 最轻量，适合车载资源受限环境

## 3\.2 数据模型对比

**车载 Mem0 — 扁平模型：**

<table><tbody>
<tr>
<td>

字段

</td>
<td>

类型

</td>
<td>

说明

</td>
</tr>
<tr>
<td>

id

</td>
<td>

UUID

</td>
<td>

记忆唯一标识

</td>
</tr>
<tr>
<td>

memory

</td>
<td>

String

</td>
<td>

记忆内容（自然语言文本）

</td>
</tr>
<tr>
<td>

hash

</td>
<td>

String

</td>
<td>

内容哈希，用于去重

</td>
</tr>
<tr>
<td>

metadata

</td>
<td>

JSON

</td>
<td>

可选元数据

</td>
</tr>
<tr>
<td>

score

</td>
<td>

Float

</td>
<td>

检索相似度得分

</td>
</tr>
<tr>
<td>

created\_at

</td>
<td>

Datetime

</td>
<td>

创建时间

</td>
</tr>
<tr>
<td>

updated\_at

</td>
<td>

Datetime

</td>
<td>

最后更新时间

</td>
</tr>
<tr>
<td>

user\_id

</td>
<td>

String

</td>
<td>

所属用户标识

</td>
</tr>
</tbody></table>

特点：所有记忆都是扁平存储，无类型区分，无层级结构。

**MOA Memory — 三类结构化模型：**

<table><tbody>
<tr>
<td>

模型

</td>
<td>

关键字段

</td>
<td>

用途

</td>
</tr>
<tr>
<td>

UserPreference

</td>
<td>

content, source, active

</td>
<td>

用户偏好/事实，支持软删除

</td>
</tr>
<tr>
<td>

TaskRecord

</td>
<td>

task\_desc, trace\_summary, full\_trace, artifact\_link, status

</td>
<td>

任务历史（含完整执行轨迹）

</td>
</tr>
<tr>
<td>

RecentSummary

</td>
<td>

content, window\_start, window\_end

</td>
<td>

近 7 天活动滚动摘要

</td>
</tr>
</tbody></table>

特点：结构化程度高，任务维度记忆组织独特，支持 Trace 级粒度检索。

**OpenClaw — 五层分级模型：**

<table><tbody>
<tr>
<td>

层级

</td>
<td>

名称

</td>
<td>

存储形式

</td>
<td>

加载策略

</td>
</tr>
<tr>
<td>

T0

</td>
<td>

Working

</td>
<td>

当前 Session 上下文

</td>
<td>

始终在内存

</td>
</tr>
<tr>
<td>

T1

</td>
<td>

Daily

</td>
<td>

memory/YYYY\-MM\-DD\.md

</td>
<td>

按需搜索

</td>
</tr>
<tr>
<td>

T2

</td>
<td>

Short\-term Compressed

</td>
<td>

LLM 压缩的 T1 摘要

</td>
<td>

按需搜索

</td>
</tr>
<tr>
<td>

T3

</td>
<td>

Long\-term Archived

</td>
<td>

低频访问归档

</td>
<td>

搜索权重 0\.5x

</td>
</tr>
<tr>
<td>

T4

</td>
<td>

Foundational

</td>
<td>

MEMORY\.md 核心偏好

</td>
<td>

每次会话注入

</td>
</tr>
</tbody></table>

特点：分层最成熟，含时间衰减和权重调节，精选层 \+ 日志层双层设计。

## 3\.3 数据模型小结

```Plain Text
车载 Mem0:    [Flat Memory Records] ──→ 简单但无生命周期管理
                     │
MOA Memory:   [Preference] + [TaskRecord] + [RecentSummary] ──→ 有类型但无层级
                     │
OpenClaw:     [T0-Working] → [T1-Daily] → [T2-Compressed] → [T3-Archived] → [T4-Core]
              ──→ 分层完善，含生命周期流转
```

---

# 四、记忆写入机制深度对比

## 4\.1 事实提取能力

<table><tbody>
<tr>
<td>

维度

</td>
<td>

车载 Mem0

</td>
<td>

MOA Memory

</td>
<td>

OpenClaw

</td>
</tr>
<tr>
<td>

**提取方式**

</td>
<td>

FACT\_RETRIEVAL\_PROMPT，专用 Prompt 驱动

</td>
<td>

PreferenceExtractor，LLM 抽取 \+ 去重

</td>
<td>

Agent 自主决策写入 Markdown

</td>
</tr>
<tr>
<td>

**提取时机**

</td>
<td>

每轮对话结束后

</td>
<td>

每轮后置（非阻塞 asyncio\.create\_task）

</td>
<td>

4 种时机：指令/实时/定时/按需

</td>
</tr>
<tr>
<td>

**信息分类**

</td>
<td>

7 类（个人偏好、重要信息、计划意图、活动服务、健康养生、职业信息、杂项）

</td>
<td>

无显式分类，LLM 自行判断

</td>
<td>

无显式分类，Agent 自行决策

</td>
</tr>
<tr>
<td>

**Few\-shot 示例**

</td>
<td>

有，多场景覆盖

</td>
<td>

有，嵌入 Prompt 模板中

</td>
<td>

无（依赖 Agent 基础能力）

</td>
</tr>
<tr>
<td>

**语言检测**

</td>
<td>

自动检测并使用相同语言记录

</td>
<td>

未明确提及

</td>
<td>

无（以文件写入语言为准）

</td>
</tr>
<tr>
<td>

**时间感知**

</td>
<td>

注入当日日期到 Prompt

</td>
<td>

未明确提及

</td>
<td>

有（UTC \+ 本地时间注入）

</td>
</tr>
</tbody></table>

**车载 Mem0 的 7 类信息分类是其 Prompt 工程的亮点**，为车载场景提供了结构化的提取框架。MOA 的后置非阻塞提取设计在工程实现上更优雅。

## 4\.2 增删改决策机制

<table><tbody>
<tr>
<td>

维度

</td>
<td>

车载 Mem0

</td>
<td>

MOA Memory

</td>
<td>

OpenClaw

</td>
</tr>
<tr>
<td>

**决策方式**

</td>
<td>

Function Calling Prompt，LLM 对比新旧记忆

</td>
<td>

LLM 同步判断 add/update \+ deactivate

</td>
<td>

Agent 直接文件操作，无显式 pipeline

</td>
</tr>
<tr>
<td>

**操作类型**

</td>
<td>

4 种：ADD / UPDATE / DELETE / NONE

</td>
<td>

2 种：add / update（deactivate 旧记忆）

</td>
<td>

文件级操作（追加/编辑/提炼）

</td>
</tr>
<tr>
<td>

**矛盾处理**

</td>
<td>

DELETE 矛盾记忆

</td>
<td>

deactivate 旧偏好（软删除）

</td>
<td>

人工或 Agent 自行判断覆盖

</td>
</tr>
<tr>
<td>

**信息丰富度**

</td>
<td>

UPDATE 时优先保留信息量更大的版本

</td>
<td>

同一 LLM 调用中完成去重/冲突处理

</td>
<td>

Agent 自行判断

</td>
</tr>
<tr>
<td>

**ID 管理**

</td>
<td>

ADD 生成新 ID，UPDATE/DELETE 保留原 ID

</td>
<td>

add 生成新 ID，update 先停用旧 ID 再新建

</td>
<td>

文件行级定位

</td>
</tr>
</tbody></table>

**车载 Mem0 的四操作决策模型最完整**，覆盖所有变更场景。MOA 的单次 LLM 调用完成抽取 \+ 去重 \+ 冲突处理更高效（减少 LLM 调用次数）。

## 4\.3 写入可靠性

<table><tbody>
<tr>
<td>

维度

</td>
<td>

车载 Mem0

</td>
<td>

MOA Memory

</td>
<td>

OpenClaw

</td>
</tr>
<tr>
<td>

**双写保障**

</td>
<td>

无（仅 Qdrant）

</td>
<td>

有（SQLite \+ ChromaDB，ChromaDB 失败可 keyword 兜底）

</td>
<td>

无（文件 \+ 索引分离，索引可重建）

</td>
</tr>
<tr>
<td>

**防丢失机制**

</td>
<td>

无

</td>
<td>

无

</td>
<td>

**Memory Flush**：Compaction 前自动提醒 Agent 保存重要信息

</td>
</tr>
<tr>
<td>

**操作日志**

</td>
<td>

建议引入（在技术风险章节提及）

</td>
<td>

无

</td>
<td>

完整历史保留在磁盘，Compaction 仅改变模型可见内容

</td>
</tr>
<tr>
<td>

**回滚能力**

</td>
<td>

无

</td>
<td>

无

</td>
<td>

Git 版本控制（Markdown 文件）

</td>
</tr>
</tbody></table>

---

# 五、记忆检索管线深度对比

## 5\.1 检索方式对比

<table><tbody>
<tr>
<td>

维度

</td>
<td>

车载 Mem0

</td>
<td>

MOA Memory

</td>
<td>

OpenClaw

</td>
</tr>
<tr>
<td>

**向量检索**

</td>
<td>

Qdrant Embedding \+ cosine similarity

</td>
<td>

ChromaDB \+ Azure OpenAI text\-embedding\-3\-large

</td>
<td>

多 Provider 支持 \+ sqlite\-vec

</td>
</tr>
<tr>
<td>

**关键词检索**

</td>
<td>

**无**

</td>
<td>

SQLite LIKE 模糊匹配

</td>
<td>

FTS5 BM25 全文索引

</td>
</tr>
<tr>
<td>

**混合检索**

</td>
<td>

**无**

</td>
<td>

RRF 融合（k=60）

</td>
<td>

Weighted Merge \+ Temporal Decay \+ MMR

</td>
</tr>
<tr>
<td>

**检索模式**

</td>
<td>

单一：向量 Top\-K

</td>
<td>

3 种：hybrid / vector / keyword

</td>
<td>

2 种工具：memory\_search \+ memory\_get

</td>
</tr>
</tbody></table>

## 5\.2 检索管线架构

**车载 Mem0 管线：**

```Plain Text
Query → Embedding → Qdrant cosine search → Top-K → 注入 Prompt
```

单一管线，无融合、无衰减、无去重。

**MOA Memory 管线：**

```Plain Text
Query → ┌─ SQLite LIKE (keyword) ─────────┐
        │                                        │
        └─ ChromaDB cosine (vector) ───────┼→ RRF Fusion (k=60) → Top-K
```

Hybrid 检索，但缺少时间衰减和去重。

**OpenClaw 管线：**

```Plain Text
Query → ┌─ BM25 Full-text (keyword) ──────┐
        │                                       │
        └─ Vector cosine (semantic) ───────┼→ Weighted Merge → Temporal Decay → Sort → MMR Dedup → Top-K
```

最完善的检索管线，多阶段优化。

## 5\.3 检索质量优化

<table><tbody>
<tr>
<td>

优化策略

</td>
<td>

车载 Mem0

</td>
<td>

MOA Memory

</td>
<td>

OpenClaw

</td>
</tr>
<tr>
<td>

**融合排序**

</td>
<td>

无

</td>
<td>

RRF（基于排名融合，天然兼容异构分数）

</td>
<td>

Weighted Merge（加权融合）

</td>
</tr>
<tr>
<td>

**时间衰减**

</td>
<td>

无

</td>
<td>

无

</td>
<td>

有（旧记忆权重自动降低）

</td>
</tr>
<tr>
<td>

**MMR 去重**

</td>
<td>

无

</td>
<td>

无

</td>
<td>

有（Maximal Marginal Relevance）

</td>
</tr>
<tr>
<td>

**层级权重**

</td>
<td>

无

</td>
<td>

无

</td>
<td>

有（T3 权重 0\.5x，T4 权重 1\.2x）

</td>
</tr>
<tr>
<td>

**Metadata 过滤**

</td>
<td>

user\_id 过滤

</td>
<td>

type \+ 时间范围 where 过滤

</td>
<td>

文件路径 \+ 元数据过滤

</td>
</tr>
<tr>
<td>

**时间范围查询**

</td>
<td>

无

</td>
<td>

支持 start\_date / end\_date

</td>
<td>

支持（文件名自带日期）

</td>
</tr>
</tbody></table>

## 5\.4 检索能力总评

<table><tbody>
<tr>
<td>

方案

</td>
<td>

检索成熟度

</td>
<td>

主要短板

</td>
</tr>
<tr>
<td>

车载 Mem0

</td>
<td>

★★☆☆☆

</td>
<td>

仅向量检索，无关键词匹配，无质量优化

</td>
</tr>
<tr>
<td>

MOA Memory

</td>
<td>

★★★☆☆

</td>
<td>

关键词搜索弱（LIKE），无时间衰减/去重

</td>
</tr>
<tr>
<td>

OpenClaw

</td>
<td>

★★★★★

</td>
<td>

最完善，BM25 \+ Vector \+ Decay \+ MMR

</td>
</tr>
</tbody></table>

---

# 六、上下文管理能力深度对比

## 6\.1 Context 组成对比

<table><tbody>
<tr>
<td>

组成部分

</td>
<td>

车载 Mem0

</td>
<td>

MOA Memory

</td>
<td>

OpenClaw

</td>
</tr>
<tr>
<td>

**System Prompt**

</td>
<td>

基础 \+ 检索记忆列表

</td>
<td>

基础 \+ 占位符注入偏好和摘要

</td>
<td>

动态重建（Bootstrap 文件 \+ 技能 \+ 工具定义）

</td>
</tr>
<tr>
<td>

**记忆注入**

</td>
<td>

检索结果直接拼入

</td>
<td>

预注入占位符 \+ 按需工具检索

</td>
<td>

多文件分层加载 \+ 语义检索结果

</td>
</tr>
<tr>
<td>

**对话历史**

</td>
<td>

无管理

</td>
<td>

无管理

</td>
<td>

带 Compaction 管理

</td>
</tr>
<tr>
<td>

**工具结果**

</td>
<td>

无管理

</td>
<td>

无管理

</td>
<td>

Session Pruning（软裁剪/硬清除）

</td>
</tr>
<tr>
<td>

**Token 计量**

</td>
<td>

无

</td>
<td>

无

</td>
<td>

精细化 per\-file/per\-tool/per\-skill 计量

</td>
</tr>
</tbody></table>

## 6\.2 Compaction 机制

<table><tbody>
<tr>
<td>

维度

</td>
<td>

车载 Mem0

</td>
<td>

MOA Memory

</td>
<td>

OpenClaw

</td>
</tr>
<tr>
<td>

**是否支持**

</td>
<td>

无

</td>
<td>

无

</td>
<td>

完整支持

</td>
</tr>
<tr>
<td>

**触发条件**

</td>
<td>

—

</td>
<td>

—

</td>
<td>

自动检测接近窗口上限 / 溢出错误 / 手动 /compact

</td>
</tr>
<tr>
<td>

**Pre\-Compaction 保护**

</td>
<td>

—

</td>
<td>

—

</td>
<td>

Memory Flush（自动提醒 Agent 保存重要信息到磁盘）

</td>
</tr>
<tr>
<td>

**压缩方式**

</td>
<td>

—

</td>
<td>

—

</td>
<td>

旧会话轮次摘要化为 Compact Entry

</td>
</tr>
<tr>
<td>

**近期消息保留**

</td>
<td>

—

</td>
<td>

—

</td>
<td>

最近消息保持完整

</td>
</tr>
<tr>
<td>

**配置能力**

</td>
<td>

—

</td>
<td>

—

</td>
<td>

可指定 Compaction 模型、聚焦主题

</td>
</tr>
</tbody></table>

## 6\.3 Token 预算管理

仅 OpenClaw 具备精细化 Token 预算管理：

```Plain Text
System prompt (run): ~9,603 tok
  ├── Project Context: ~5,976 tok
  │   ├── AGENTS.md: 436 tok
  │   ├── SOUL.md: 228 tok
  │   ├── TOOLS.md: 5,241 tok (截断自 13,553 tok)
  │   ├── IDENTITY.md: 53 tok
  │   └── USER.md: 97 tok
  ├── Skills list: ~546 tok (12 skills)
  ├── Tool list text: ~258 tok
  └── Tool schemas (JSON): ~7,997 tok
Session tokens (cached): 14,250 / ctx=32,000
```

车载 Mem0 和 MOA Memory 均无此能力，在长对话或多人对话场景下存在 Context 溢出风险。

## 6\.4 Context Engine 可插拔性

<table><tbody>
<tr>
<td>

维度

</td>
<td>

车载 Mem0

</td>
<td>

MOA Memory

</td>
<td>

OpenClaw

</td>
</tr>
<tr>
<td>

**可插拔性**

</td>
<td>

不可插拔

</td>
<td>

不可插拔

</td>
<td>

完全可插拔（Context Engine 插件）

</td>
</tr>
<tr>
<td>

**生命周期管理**

</td>
<td>

无

</td>
<td>

有 Agent 生命周期钩子

</td>
<td>

完整生命周期（Ingest → Assemble → Compact → After Turn）

</td>
</tr>
<tr>
<td>

**社区生态**

</td>
<td>

无

</td>
<td>

无

</td>
<td>

有社区插件（如 Lossless\-Claw\-Enhanced 修复 CJK 估算偏差）

</td>
</tr>
</tbody></table>

---

# 七、多用户 / Multi\-Agent 支持对比

## 7\.1 Multi\-Agent 记忆共享

<table><tbody>
<tr>
<td>

维度

</td>
<td>

车载 Mem0

</td>
<td>

MOA Memory

</td>
<td>

OpenClaw

</td>
</tr>
<tr>
<td>

**架构**

</td>
<td>

单 Agent

</td>
<td>

原生 Multi\-Agent

</td>
<td>

单 Agent 为主

</td>
</tr>
<tr>
<td>

**共享机制**

</td>
<td>

无

</td>
<td>

MemoryContext 容器，MainAgent 创建后引用传递到所有子 Agent

</td>
<td>

跨 Session Tools（sessions\_send/sessions\_history）

</td>
</tr>
<tr>
<td>

**工具自动注入**

</td>
<td>

无

</td>
<td>

SearchMemoryTool 自动注入每个子 Agent

</td>
<td>

无自动注入

</td>
</tr>
<tr>
<td>

**写入去重**

</td>
<td>

无

</td>
<td>

仅 Organizer 完成时触发任务持久化，避免子 Agent 重复写入

</td>
<td>

Agent 各自独立写入

</td>
</tr>
</tbody></table>

MOA 的 MemoryContext 传播链路设计精良：

```Plain Text
MainAgent (创建 MemoryContext)
    ├─ → OrganizeAgent（引用传递，共享同一 MemoryContext）
    │       ├─ → SubAgent A（引用传递）
    │       ├─ → SubAgent B（引用传递）
    │       └─ ...
    └─ 所有 Agent 均可使用 search_memory 工具
```

## 7\.2 多用户隔离

<table><tbody>
<tr>
<td>

维度

</td>
<td>

车载 Mem0

</td>
<td>

MOA Memory

</td>
<td>

OpenClaw

</td>
</tr>
<tr>
<td>

**隔离粒度**

</td>
<td>

user\_id metadata 过滤

</td>
<td>

per\-user 独立 DB 文件 \+ 独立 ChromaDB 目录

</td>
<td>

per\-agent workspace \+ Session 级隔离

</td>
</tr>
<tr>
<td>

**隔离强度**

</td>
<td>

弱（依赖查询时 filter）

</td>
<td>

强（物理文件隔离）

</td>
<td>

强（目录级 \+ Session 类型隔离）

</td>
</tr>
<tr>
<td>

**隐私保护**

</td>
<td>

无分级

</td>
<td>

无分级

</td>
<td>

有分级（MEMORY\.md 仅主会话加载，群聊/DM 不可见）

</td>
</tr>
<tr>
<td>

**泄露风险**

</td>
<td>

metadata 忘加过滤则泄露

</td>
<td>

无（物理隔离）

</td>
<td>

无（目录隔离 \+ Session 类型控制）

</td>
</tr>
</tbody></table>

OpenClaw 的隐私分级设计值得借鉴：Session 类型决定记忆加载策略，DM 和群聊不加载 MEMORY\.md 中的个人信息。

---

# 八、各方案优缺点总结

## 8\.1 车载 Mem0

**优点：**

- 两阶段（Extraction \+ Update）闭环架构清晰，实现成本低

- FACT\_RETRIEVAL\_PROMPT 的 7 类信息分类完善，Few\-shot 示例充分

- Function Calling Prompt 的 4 种操作（ADD/UPDATE/DELETE/NONE）覆盖完整

- 车载场景适配建议已有初步规划（多模态、低延迟、隐私安全、多用户隔离、离线能力）

- 自动化程度高，无需用户/Agent 主动干预

**缺点：**

- **无记忆生命周期管理**：无分层、无过期、无压缩，长期使用导致记忆膨胀

- **检索能力单一**：仅向量语义检索，缺少关键词精确匹配和混合检索

- **无 Context 管理**：不管理上下文窗口，不做 Compaction，长对话易溢出

- **无多用户交互建模**：仅以 user\_id 隔离，未考虑多人共存/对话场景

- **无防丢失机制**：上下文被截断时，重要信息可能丢失

- **Qdrant 部署负担**：需要独立服务进程，对嵌入式环境不友好

## 8\.2 MOA Memory

**优点：**

- Multi\-Agent 原生支持，MemoryContext 自动在主 Agent 和子 Agent 间共享

- 三类记忆模型清晰（偏好/任务记录/近期摘要），结构化程度高

- Hybrid 检索（keyword \+ vector \+ RRF 融合）已实现

- Trace 级检索能力独特，支持完整执行轨迹的 chunk 级语义搜索

- 全自动化 pipeline（偏好抽取、任务摘要、滚动摘要均后台非阻塞完成）

- 双写架构（SQLite \+ ChromaDB），结构化查询和语义检索兼顾

- per\-user 物理文件隔离，无泄露风险

**缺点：**

- 无记忆生命周期管理（无分层、无压缩、无过期清理，数据只增不减）

- 检索管线不够成熟（缺少时间衰减、MMR 去重、Tier 权重）

- 关键词搜索较弱（SQLite LIKE vs BM25）

- 无 Context 窗口管理（无 Compaction、无 Token 预算管理）

- 用户不可见/不可编辑

- 未涉及车载场景

## 8\.3 OpenClaw

**优点：**

- 记忆分层最成熟（T0\-T4 五层分级，精选层 \+ 日志层双层设计）

- 检索管线最完善（BM25 \+ Vector \+ Temporal Decay \+ MMR，多阶段质量优化）

- Context 管理最强（完整 Compaction \+ Session Pruning \+ Token 精细化计量）

- Memory Flush 防丢失机制（Compaction 前自动保护重要信息）

- 完全透明可控（Markdown 文件，用户可直接查看/编辑/版本控制）

- 高度可扩展（Memory Plugin \+ Context Engine 均可插拔）

- 隐私分级设计（Session 类型决定记忆加载策略）

**缺点：**

- 单 Agent 为主，缺乏内建的跨 Agent 记忆共享机制

- 依赖 Agent 主动写入，记忆质量高度依赖 LLM 的写入决策

- 面向个人桌面场景，文件系统模型不直接适配嵌入式/车载环境

- 文件 I/O \+ 索引重建在车载低延迟场景下可能有性能瓶颈

---

# 九、核心差异矩阵（一览表）

<table><tbody>
<tr>
<td>

能力维度

</td>
<td>

车载 Mem0

</td>
<td>

MOA Memory

</td>
<td>

OpenClaw

</td>
<td>

车载场景重要度

</td>
</tr>
<tr>
<td>

记忆分层

</td>
<td>

❌ 无

</td>
<td>

❌ 无（有类型区分）

</td>
<td>

✅ T0\-T4 五层

</td>
<td>

★★★★★

</td>
</tr>
<tr>
<td>

混合检索

</td>
<td>

❌ 纯向量

</td>
<td>

✅ RRF 融合

</td>
<td>

✅ BM25\+Vector\+Decay\+MMR

</td>
<td>

★★★★★

</td>
</tr>
<tr>
<td>

Context 管理

</td>
<td>

❌ 无

</td>
<td>

❌ 无

</td>
<td>

✅ Compaction\+Pruning

</td>
<td>

★★★★★

</td>
</tr>
<tr>
<td>

Multi\-Agent

</td>
<td>

❌ 无

</td>
<td>

✅ 原生支持

</td>
<td>

⚠️ 有限支持

</td>
<td>

★★★☆☆

</td>
</tr>
<tr>
<td>

多用户隔离

</td>
<td>

⚠️ 弱（metadata）

</td>
<td>

✅ 强（物理隔离）

</td>
<td>

✅ 强（目录\+Session）

</td>
<td>

★★★★★

</td>
</tr>
<tr>
<td>

隐私分级

</td>
<td>

❌ 无

</td>
<td>

❌ 无

</td>
<td>

✅ Session 级分级

</td>
<td>

★★★★★

</td>
</tr>
<tr>
<td>

防丢失机制

</td>
<td>

❌ 无

</td>
<td>

❌ 无

</td>
<td>

✅ Memory Flush

</td>
<td>

★★★★☆

</td>
</tr>
<tr>
<td>

时间衰减

</td>
<td>

❌ 无

</td>
<td>

❌ 无

</td>
<td>

✅ 有

</td>
<td>

★★★★☆

</td>
</tr>
<tr>
<td>

事实提取质量

</td>
<td>

✅ 7类\+Few\-shot

</td>
<td>

✅ 自动抽取\+去重

</td>
<td>

⚠️ Agent自主

</td>
<td>

★★★★☆

</td>
</tr>
<tr>
<td>

嵌入式友好度

</td>
<td>

⚠️ 需Qdrant服务

</td>
<td>

✅ SQLite\+ChromaDB

</td>
<td>

✅ 文件\+SQLite\-vec

</td>
<td>

★★★★★

</td>
</tr>
<tr>
<td>

Token 预算管理

</td>
<td>

❌ 无

</td>
<td>

❌ 无

</td>
<td>

✅ 精细化计量

</td>
<td>

★★★★☆

</td>
</tr>
<tr>
<td>

可插拔性

</td>
<td>

❌ 不可插拔

</td>
<td>

❌ 不可插拔

</td>
<td>

✅ 插件架构

</td>
<td>

★★★☆☆

</td>
</tr>
</tbody></table>

---

# 十、车载多人对话场景需求分析

## 10\.1 核心挑战

车内多人对话系统相比单人场景，面临以下特殊挑战：

<table><tbody>
<tr>
<td>

挑战

</td>
<td>

说明

</td>
<td>

影响的模块

</td>
</tr>
<tr>
<td>

**多说话人识别**

</td>
<td>

车内同时存在驾驶员、副驾、后排乘客，需要知道\&\#34;谁在说话\&\#34;

</td>
<td>

Context（speaker 标注）、Memory（写入归属）

</td>
</tr>
<tr>
<td>

**共享 vs 个人记忆**

</td>
<td>

家庭出行计划是共享记忆，个人音乐偏好是私有记忆

</td>
<td>

Memory（存储分层）、Retrieval（检索过滤）

</td>
</tr>
<tr>
<td>

**跨用户关系建模**



</td>
<td>

\&\#34;妈妈说的那个餐厅\&\#34;需要理解用户间关系

</td>
<td>

Memory（关系记忆）、Context（关系注入）

</td>
</tr>
<tr>
<td>

**多人意图冲突**

</td>
<td>

驾驶员说\&\#34;调高温度\&\#34;，副驾说\&\#34;太热了\&\#34;

</td>
<td>

Context（冲突检测）、决策逻辑

</td>
</tr>
<tr>
<td>

**Context 快速膨胀**

</td>
<td>

多人对话的 context 增长速度远超单人

</td>
<td>

Context（Compaction）、Token 管理

</td>
</tr>
<tr>
<td>

**隐私分级**

</td>
<td>

不同乘客的记忆可见性需要分级管理

</td>
<td>

Memory（读取权限）、Context（注入策略）

</td>
</tr>
<tr>
<td>

**说话人切换频率高**

</td>
<td>

车内对话切换频繁，记忆上下文需要快速切换

</td>
<td>

Context（动态加载）、性能优化

</td>
</tr>
</tbody></table>

## 10\.2 现有方案的差距

<table><tbody>
<tr>
<td>

需求

</td>
<td>

车载 Mem0 现状

</td>
<td>

差距

</td>
</tr>
<tr>
<td>

多说话人识别

</td>
<td>

仅 user\_id 隔离

</td>
<td>

无说话人实时切换，无多人同时在线

</td>
</tr>
<tr>
<td>

共享 vs 个人记忆

</td>
<td>

无 scope 概念

</td>
<td>

无法区分共享记忆和个人记忆

</td>
</tr>
<tr>
<td>

关系建模

</td>
<td>

无

</td>
<td>

完全缺失

</td>
</tr>
<tr>
<td>

意图冲突处理

</td>
<td>

无

</td>
<td>

完全缺失

</td>
</tr>
<tr>
<td>

Context 管理

</td>
<td>

无 Compaction

</td>
<td>

多人场景下更易溢出

</td>
</tr>
<tr>
<td>

隐私分级

</td>
<td>

无

</td>
<td>

完全缺失

</td>
</tr>
<tr>
<td>

检索精度

</td>
<td>

纯向量

</td>
<td>

关键词查询（如地点名、歌名）不准确

</td>
</tr>
</tbody></table>

---

# 十一、改进方案设计

## 11\.1 改进方向一：多用户记忆分层架构

在车载 Mem0 的扁平记忆模型基础上，引入**三维记忆空间**（Scope × Layer × Speaker）：

**Scope 维度（记忆所有权）：**

<table><tbody>
<tr>
<td>

Scope

</td>
<td>

说明

</td>
<td>

读权限

</td>
<td>

写权限

</td>
<td>

示例

</td>
</tr>
<tr>
<td>

`personal`

</td>
<td>

个人记忆

</td>
<td>

仅本人

</td>
<td>

仅本人

</td>
<td>

音乐偏好、个人行程

</td>
</tr>
<tr>
<td>

`shared`

</td>
<td>

车辆级共享记忆

</td>
<td>

所有乘客

</td>
<td>

驾驶员（或指定角色）

</td>
<td>

车辆设置、家庭出行计划

</td>
</tr>
<tr>
<td>

`relationship`

</td>
<td>

关系级记忆

</td>
<td>

关系内用户

</td>
<td>

关系内用户

</td>
<td>

\&\#34;爸爸妈妈常去的餐厅\&\#34;

</td>
</tr>
</tbody></table>

**Layer 维度（生命周期层级，借鉴 OpenClaw T0\-T4）：**

<table><tbody>
<tr>
<td>

层级

</td>
<td>

名称

</td>
<td>

TTL

</td>
<td>

检索权重

</td>
<td>

车载示例

</td>
</tr>
<tr>
<td>

T0

</td>
<td>

Working

</td>
<td>

当前会话

</td>
<td>

最高（1\.5x）

</td>
<td>

\&\#34;刚才说的那首歌\&\#34;

</td>
</tr>
<tr>
<td>

T1

</td>
<td>

Trip

</td>
<td>

本次行程

</td>
<td>

高（1\.2x）

</td>
<td>

\&\#34;这次旅行的目的地\&\#34;

</td>
</tr>
<tr>
<td>

T2

</td>
<td>

Recent

</td>
<td>

7 天

</td>
<td>

标准（1\.0x）

</td>
<td>

\&\#34;上周的通勤路线\&\#34;

</td>
</tr>
<tr>
<td>

T3

</td>
<td>

Long\-term

</td>
<td>

365 天

</td>
<td>

低（0\.5x）

</td>
<td>

\&\#34;去年的出行习惯\&\#34;

</td>
</tr>
<tr>
<td>

T4

</td>
<td>

Core

</td>
<td>

永久

</td>
<td>

提升（1\.2x）

</td>
<td>

\&\#34;空调永远24°C\&\#34;

</td>
</tr>
</tbody></table>

**实现要点：**

- 在 Qdrant metadata 中增加 `scope` 和 `layer` 字段

- 检索时根据当前说话人身份动态组合 filter 条件

- 层级自动流转：T0 → T1（行程结束）→ T2（每日压缩）→ T3（超期归档），高频召回记忆自动晋升 T4

## 11\.2 改进方向二：Hybrid 检索管线升级

当前车载 Mem0 仅有纯向量检索，建议升级为多阶段混合检索管线：

**目标管线：**

```Plain Text
Query → ┌─ Vector Search (Qdrant) ──────────┐
        │                                            │
        ├─ BM25/Keyword Search (新增引擎) ───────┼→ RRF Fusion → Temporal Decay → Speaker Filter → MMR Dedup → Top-K
        │                                            │
        └─ Metadata Filter (scope + layer) ─────┘
```

**各阶段说明：**

<table><tbody>
<tr>
<td>

阶段

</td>
<td>

功能

</td>
<td>

借鉴来源

</td>
<td>

实现建议

</td>
</tr>
<tr>
<td>

BM25 全文检索

</td>
<td>

精确关键词匹配（地点名、歌名、人名）

</td>
<td>

OpenClaw

</td>
<td>

引入 SQLite FTS5 或轻量级 BM25 库

</td>
</tr>
<tr>
<td>

RRF Fusion

</td>
<td>

异构分数融合排序

</td>
<td>

MOA（k=60）

</td>
<td>

RRF\_score = Σ\(1/\(k\+rank\)\)

</td>
</tr>
<tr>
<td>

Temporal Decay

</td>
<td>

旧记忆权重自动衰减

</td>
<td>

OpenClaw

</td>
<td>

score \*= exp\(\-λ \* days\_since\_update\)

</td>
</tr>
<tr>
<td>

Speaker Filter

</td>
<td>

优先匹配当前说话人记忆

</td>
<td>

新增

</td>
<td>

personal 记忆仅匹配本人，shared 全员可见

</td>
</tr>
<tr>
<td>

MMR Dedup

</td>
<td>

最大边际相关性去重

</td>
<td>

OpenClaw

</td>
<td>

去除语义高度重复的检索结果

</td>
</tr>
</tbody></table>

**关键参数建议：**

<table><tbody>
<tr>
<td>

参数

</td>
<td>

建议值

</td>
<td>

说明

</td>
</tr>
<tr>
<td>

RRF k 值

</td>
<td>

60

</td>
<td>

标准 RRF 常数

</td>
</tr>
<tr>
<td>

Temporal Decay λ

</td>
<td>

0\.023

</td>
<td>

半衰期约 30 天

</td>
</tr>
<tr>
<td>

MMR λ

</td>
<td>

0\.7

</td>
<td>

相关性 vs 多样性平衡

</td>
</tr>
<tr>
<td>

Vector Top\-K

</td>
<td>

2 × final\_top\_k

</td>
<td>

过采样后融合

</td>
</tr>
<tr>
<td>

BM25 Top\-K

</td>
<td>

2 × final\_top\_k

</td>
<td>

过采样后融合

</td>
</tr>
</tbody></table>

## 11\.3 改进方向三：Context 窗口管理与 Compaction

当前车载 Mem0 无任何 Context 管理能力。多人对话场景下 Context 膨胀速度更快（N 人对话约为单人的 N 倍），迫切需要引入管理机制。

**Speaker\-Aware Context Window 结构：**

<table><tbody>
<tr>
<td>

区域

</td>
<td>

Token 预算占比

</td>
<td>

说明

</td>
</tr>
<tr>
<td>

System Prompt \+ 车辆状态

</td>
<td>

15%

</td>
<td>

固定开销，含车辆设置和导航状态

</td>
</tr>
<tr>
<td>

共享记忆

</td>
<td>

10%

</td>
<td>

车辆级偏好、当前行程信息

</td>
</tr>
<tr>
<td>

当前说话人个人记忆

</td>
<td>

15%

</td>
<td>

根据说话人身份动态切换

</td>
</tr>
<tr>
<td>

多人对话历史

</td>
<td>

50%

</td>
<td>

带 speaker\_id 标注的对话轮次

</td>
</tr>
<tr>
<td>

工具结果 \+ 其他

</td>
<td>

10%

</td>
<td>

导航/音乐等工具返回值

</td>
</tr>
</tbody></table>

**Compaction 策略（借鉴 OpenClaw）：**

<table><tbody>
<tr>
<td>

阶段

</td>
<td>

触发条件

</td>
<td>

行为

</td>
</tr>
<tr>
<td>

监测

</td>
<td>

每轮对话后检测 Token 使用率

</td>
<td>

超过 85% 阈值进入预警

</td>
</tr>
<tr>
<td>

Memory Flush

</td>
<td>

Token \&gt; 85%

</td>
<td>

自动将 T0 中重要信息写入 T1，防止压缩丢失

</td>
</tr>
<tr>
<td>

智能压缩

</td>
<td>

Token \&gt; 90%

</td>
<td>

按说话人分组压缩旧对话，保留决策性轮次

</td>
</tr>
<tr>
<td>

紧急截断

</td>
<td>

模型返回溢出错误

</td>
<td>

强制压缩 \+ 重试

</td>
</tr>
</tbody></table>

**多人对话压缩特殊规则：**

- 多人协商的结论性轮次保留完整（不压缩）

- 意图冲突的对话轮次标记为高优先级保留

- 每个用户的历史可独立摘要压缩

## 11\.4 改进方向四：记忆生命周期自动管理

**生命周期流转规则：**

```Plain Text
T0 (Working)
  │  行程结束 / 会话结束
  ▼
T1 (Trip)
  │  每日凌晨压缩
  ▼
T2 (Recent, 7天窗口)
  │  超过 7 天
  ▼
T3 (Long-term, 365天)
  │  超过 365 天
  ▼
  ✗ 过期清理

  T2/T3 中高频被召回（≥5次）的记忆
  │  自动晋升
  ▼
T4 (Core, 永久)
```

**实现要点：**

- 每条记忆增加 `recall\_count`（召回次数）和 `last\_recalled\_at`（最后召回时间）

- 定时任务（参考 OpenClaw Heartbeat）每日执行层级流转

- T2 → T3 流转时，借鉴 MOA TaskSummarizer，用 LLM 对多条相似记忆做合并压缩

- T4 晋升条件：recall\_count ≥ 5 且记忆年龄 \&gt; 7 天

## 11\.5 改进方向五：多人对话特有能力

**说话人上下文动态切换：**

当声纹/人脸识别检测到说话人切换时：

1. 将当前说话人的个人记忆从 Context 中卸载

2. 加载新说话人的个人记忆（T4 Core 偏好 \+ 最近 T2 记忆）

3. 共享记忆保持不变

**冲突检测与解决：**

<table><tbody>
<tr>
<td>

冲突类型

</td>
<td>

检测方式

</td>
<td>

解决策略

</td>
</tr>
<tr>
<td>

偏好冲突（温度、音乐等）

</td>
<td>

语义相似但极性相反

</td>
<td>

驾驶员优先 / 多数优先 / 协商

</td>
</tr>
<tr>
<td>

目的地冲突

</td>
<td>

多人提出不同导航目标

</td>
<td>

提示冲突并请求确认

</td>
</tr>
<tr>
<td>

历史矛盾

</td>
<td>

不同用户对同一事实的记忆不同

</td>
<td>

以 updated\_at 最新为准

</td>
</tr>
</tbody></table>

**关系记忆建模：**

在 metadata 中增加 `relationship` 字段，以用户对为 key：

<table><tbody>
<tr>
<td>

字段

</td>
<td>

类型

</td>
<td>

说明

</td>
</tr>
<tr>
<td>

relationship\_id

</td>
<td>

String

</td>
<td>

关系标识（如 \&\#34;userA\_userB\&\#34;）

</td>
</tr>
<tr>
<td>

relationship\_type

</td>
<td>

String

</td>
<td>

关系类型（family/friend/colleague）

</td>
</tr>
<tr>
<td>

members

</td>
<td>

List\[String\]

</td>
<td>

关系内用户 ID 列表

</td>
</tr>
</tbody></table>

---

# 十二、工程实施建议（结合文件系统与 Harness Engineering）

## 12\.1 车载 Memory Workspace 目录结构

借鉴 OpenClaw 的文件系统思路，设计车载记忆的工程化目录：

```Plain Text
/vehicle_memory/
├── config/
│   ├── memory_config.yaml        # 记忆模块总配置
│   ├── speaker_profiles.yaml     # 声纹/人脸识别配置
│   ├── privacy_rules.yaml        # 隐私分级规则
│   └── retrieval_config.yaml     # 检索管线配置
├── shared/                        # 车辆级共享记忆
│   ├── vehicle_preferences.db    # 车辆设置偏好
│   ├── common_routes.db          # 常用路线
│   └── family_plans.db           # 家庭行程计划
├── users/                         # 用户级个人记忆
│   └── {user_id}/
│       ├── profile.json           # 用户档案
│       ├── preferences.db         # 个人偏好
│       ├── memory_layers/         # 分层记忆存储
│       │   ├── t0_working.db      # T0 当前会话
│       │   ├── t1_trip.db         # T1 行程级
│       │   ├── t2_recent.db       # T2 近期
│       │   ├── t3_archive.db      # T3 长期
│       │   └── t4_core.db         # T4 核心
│       └── history/               # 对话历史
│           └── YYYY-MM-DD/
├── relationships/                 # 关系级记忆
│   └── {relationship_id}.db
├── index/                         # 检索索引
│   ├── vector/                    # 向量索引（per-user + shared）
│   ├── bm25/                      # BM25 全文索引
│   └── metadata.db                # 索引元数据
└── logs/                          # 操作日志（支持回溯）
    └── YYYY-MM-DD.log
```

## 12\.2 Harness 生命周期钩子设计

借鉴 MOA 的 Agent 生命周期钩子和 OpenClaw 的 Context Engine 生命周期，设计车载记忆的 Harness 钩子：

<table><tbody>
<tr>
<td>

钩子名称

</td>
<td>

触发时机

</td>
<td>

行为

</td>
<td>

阻塞/异步

</td>
</tr>
<tr>
<td>

`on\_session\_start`

</td>
<td>

车辆启动/助手唤醒

</td>
<td>

初始化 MemoryContext，加载 T4 Core 记忆

</td>
<td>

阻塞

</td>
</tr>
<tr>
<td>

`on\_speaker\_identified`

</td>
<td>

声纹/人脸识别确认说话人

</td>
<td>

动态加载对应用户的个人记忆到 Context

</td>
<td>

异步

</td>
</tr>
<tr>
<td>

`on\_speaker\_change`

</td>
<td>

说话人切换

</td>
<td>

卸载旧用户记忆，加载新用户记忆

</td>
<td>

异步

</td>
</tr>
<tr>
<td>

`on\_turn\_end`

</td>
<td>

每轮对话结束

</td>
<td>

后台异步实时提取（借鉴 MOA PreferenceExtractor）

</td>
<td>

异步

</td>
</tr>
<tr>
<td>

`on\_trip\_start`

</td>
<td>

开始导航/出发

</td>
<td>

创建 T1 Trip 记忆空间，加载行程相关记忆

</td>
<td>

异步

</td>
</tr>
<tr>
<td>

`on\_trip\_end`

</td>
<td>

到达目的地/导航结束

</td>
<td>

T0 → T1 流转，生成行程摘要

</td>
<td>

异步

</td>
</tr>
<tr>
<td>

`on\_context\_warning`

</td>
<td>

Token 使用率 \&gt; 85%

</td>
<td>

触发 Memory Flush，保存 T0 重要信息到 T1

</td>
<td>

异步

</td>
</tr>
<tr>
<td>

`on\_context\_overflow`

</td>
<td>

Token 使用率 \&gt; 90%

</td>
<td>

触发 Compaction，按说话人分组压缩

</td>
<td>

阻塞

</td>
</tr>
<tr>
<td>

`on\_conflict\_detected`

</td>
<td>

检测到多人意图冲突

</td>
<td>

加载冲突解决规则，记录冲突历史

</td>
<td>

异步

</td>
</tr>
<tr>
<td>

`on\_daily\_maintenance`

</td>
<td>

每日凌晨

</td>
<td>

T1→T2 压缩，T2→T3 归档，T4 晋升评估

</td>
<td>

后台

</td>
</tr>
<tr>
<td>

`on\_session\_end`

</td>
<td>

车辆熄火/助手休眠

</td>
<td>

持久化所有 T0 记忆，释放内存

</td>
<td>

阻塞

</td>
</tr>
</tbody></table>

## 12\.3 配置化工程

**memory\_config\.yaml 核心配置：**

```YAML
memory:
  # 事实提取配置
  extraction:
    model: "lightweight-llm"       # 车载端侧小模型
    async: true                    # 非阻塞后台提取
    categories:                    # 车载专属信息类别
      - driving_preference
      - vehicle_setting
      - frequent_location
      - entertainment_preference
      - personal_info
      - trip_plan
      - relationship_fact
  
  # 检索管线配置
  retrieval:
    mode: "hybrid"                 # vector + bm25
    fusion_algorithm: "rrf"
    rrf_k: 60
    temporal_decay:
      enabled: true
      half_life_days: 30
    mmr:
      enabled: true
      lambda: 0.7
    speaker_aware: true
    default_top_k: 5
  
  # 记忆生命周期配置
  lifecycle:
    t0_to_t1_trigger: "trip_end"
    t1_to_t2_days: 1
    t2_to_t3_days: 7
    t3_max_days: 365
    t4_promote_threshold: 5        # 召回 ≥5 次晋升
    daily_maintenance_hour: 3      # 凌晨 3 点执行
  
  # 多用户配置
  multi_user:
    speaker_recognition: "voiceprint"
    privacy_level: "strict"
    shared_memory_write_role: "driver"
    conflict_resolution: "driver_priority"
  
  # Context 管理配置
  context:
    max_tokens: 8192
    compaction_threshold: 0.85
    overflow_threshold: 0.90
    budget:
      system_prompt: 0.15
      shared_memory: 0.10
      speaker_memory: 0.15
      conversation_history: 0.50
      tool_results: 0.10
  
  # 存储配置
  storage:
    backend: "sqlite"              # sqlite / qdrant
    vector_engine: "sqlite-vec"    # sqlite-vec / qdrant / chromadb
    bm25_engine: "fts5"            # fts5 / tantivy
    base_dir: "/vehicle_memory"
```

## 12\.4 核心接口设计

**MemoryManager 主接口：**

<table><tbody>
<tr>
<td>

方法

</td>
<td>

参数

</td>
<td>

返回

</td>
<td>

说明

</td>
</tr>
<tr>
<td>

`search`

</td>
<td>

query, speaker\_id, scope, top\_k

</td>
<td>

List\[MemoryRecord\]

</td>
<td>

混合检索，自动 speaker 过滤

</td>
</tr>
<tr>
<td>

`add`

</td>
<td>

content, speaker\_id, scope, layer

</td>
<td>

MemoryRecord

</td>
<td>

写入记忆，自动索引

</td>
</tr>
<tr>
<td>

`update`

</td>
<td>

memory\_id, content

</td>
<td>

MemoryRecord

</td>
<td>

更新记忆内容和索引

</td>
</tr>
<tr>
<td>

`delete`

</td>
<td>

memory\_id

</td>
<td>

bool

</td>
<td>

删除记忆和索引

</td>
</tr>
<tr>
<td>

`extract\_facts`

</td>
<td>

conversation, speaker\_id

</td>
<td>

List\[Fact\]

</td>
<td>

从对话中提取事实

</td>
</tr>
<tr>
<td>

`compact`

</td>
<td>

session\_id

</td>
<td>

CompactResult

</td>
<td>

执行 Context 压缩

</td>
</tr>
<tr>
<td>

`flush\_to\_disk`

</td>
<td>

session\_id

</td>
<td>

FlushResult

</td>
<td>

Memory Flush 防丢失

</td>
</tr>
<tr>
<td>

`lifecycle\_migrate`

</td>
<td>



</td>
<td>

MigrateResult

</td>
<td>

执行层级流转

</td>
</tr>
</tbody></table>

**ContextManager 接口：**

<table><tbody>
<tr>
<td>

方法

</td>
<td>

参数

</td>
<td>

返回

</td>
<td>

说明

</td>
</tr>
<tr>
<td>

`assemble`

</td>
<td>

speaker\_id, conversation

</td>
<td>

ContextPayload

</td>
<td>

动态组装 Context

</td>
</tr>
<tr>
<td>

`get\_token\_usage`

</td>
<td>



</td>
<td>

TokenReport

</td>
<td>

获取 Token 使用报告

</td>
</tr>
<tr>
<td>

`switch\_speaker`

</td>
<td>

old\_speaker, new\_speaker

</td>
<td>

bool

</td>
<td>

切换说话人上下文

</td>
</tr>
<tr>
<td>

`detect\_conflict`

</td>
<td>

messages

</td>
<td>

List\[Conflict\]

</td>
<td>

检测多人意图冲突

</td>
</tr>
<tr>
<td>

`compact`

</td>
<td>

focus\_topic

</td>
<td>

CompactResult

</td>
<td>

执行 Compaction

</td>
</tr>
</tbody></table>

---

# 十三、改进优先级与实施路线图

## 13\.1 优先级矩阵

<table><tbody>
<tr>
<td>

优先级

</td>
<td>

改进项

</td>
<td>

复杂度

</td>
<td>

预期收益

</td>
<td>

依赖关系

</td>
</tr>
<tr>
<td>

**P0**

</td>
<td>

Hybrid 检索（BM25 \+ 向量 \+ RRF）

</td>
<td>

中

</td>
<td>

大幅提升检索准确率

</td>
<td>

无

</td>
</tr>
<tr>
<td>

**P0**

</td>
<td>

多用户记忆隔离 \+ 共享记忆层

</td>
<td>

中

</td>
<td>

支撑多人对话核心场景

</td>
<td>

无

</td>
</tr>
<tr>
<td>

**P0**

</td>
<td>

Context 窗口管理 \+ Compaction

</td>
<td>

中

</td>
<td>

解决多人对话 Context 膨胀

</td>
<td>

无

</td>
</tr>
<tr>
<td>

**P1**

</td>
<td>

记忆生命周期分层（T0\-T4）

</td>
<td>

高

</td>
<td>

长期使用的记忆质量保障

</td>
<td>

P0 多用户隔离

</td>
</tr>
<tr>
<td>

**P1**

</td>
<td>

Speaker\-aware Context 动态切换

</td>
<td>

中

</td>
<td>

多人对话个性化体验

</td>
<td>

P0 多用户隔离

</td>
</tr>
<tr>
<td>

**P1**

</td>
<td>

Memory Flush 防丢失机制

</td>
<td>

低

</td>
<td>

防止 Compaction 丢失信息

</td>
<td>

P0 Context 管理

</td>
</tr>
<tr>
<td>

**P2**

</td>
<td>

Temporal Decay \+ MMR 去重

</td>
<td>

低

</td>
<td>

检索结果质量精细优化

</td>
<td>

P0 Hybrid 检索

</td>
</tr>
<tr>
<td>

**P2**

</td>
<td>

关系记忆建模

</td>
<td>

高

</td>
<td>

深度理解车内社交关系

</td>
<td>

P0 多用户隔离

</td>
</tr>
<tr>
<td>

**P2**

</td>
<td>

意图冲突检测与解决

</td>
<td>

高

</td>
<td>

多人场景体验完善

</td>
<td>

P1 Speaker\-aware

</td>
</tr>
<tr>
<td>

**P2**

</td>
<td>

Harness 生命周期钩子完整实现

</td>
<td>

中

</td>
<td>

工程化和可维护性

</td>
<td>

P0/P1 完成

</td>
</tr>
</tbody></table>

## 13\.2 分阶段实施建议

**Phase 1（P0，预计 3\-4 周）：** 补齐基础能力

- Week 1\-2：引入 BM25 \+ RRF Hybrid 检索管线

- Week 2\-3：实现多用户记忆 Scope 分层（personal / shared）

- Week 3\-4：实现基础 Context 管理（Token 计量 \+ 简单 Compaction）

**Phase 2（P1，预计 3\-4 周）：** 提升体验

- Week 5\-6：记忆生命周期分层（T0\-T4）\+ 自动流转

- Week 6\-7：Speaker\-aware Context 动态切换

- Week 7\-8：Memory Flush 防丢失机制

**Phase 3（P2，预计 4\-6 周）：** 深度优化

- Week 9\-10：Temporal Decay \+ MMR 检索优化

- Week 10\-12：关系记忆建模 \+ 意图冲突检测

- Week 12\-14：完整 Harness 钩子 \+ 配置化工程

---

# 十四、总结

当前车载 Mem0 方案作为 MVP 架构清晰、实现简洁，但面对车内多人对话场景存在明显短板。本文档通过与 MOA Memory 和 OpenClaw 的深度对比，明确了三个核心改进方向：

1. **从 MOA 借鉴**：Multi\-Agent 共享记忆的 MemoryContext 模式、双写架构（结构化 \+ 向量）、Hybrid 检索 \+ RRF 融合、全自动化非阻塞 pipeline

2. **从 OpenClaw 借鉴**：记忆分层（T0\-T4）、Compaction \+ Memory Flush 防丢失、完善的检索管线（BM25 \+ Temporal Decay \+ MMR）、可插拔的 Context Engine 架构、隐私分级设计

3. **车载场景独有**：多说话人记忆动态切换、共享 vs 个人记忆分层、关系记忆建模、行程级记忆生命周期、多人意图冲突处理

建议以 P0 优先级的三项改进（Hybrid 检索、多用户记忆架构、Context 管理）作为下一阶段的核心工作，快速补齐车载多人场景的基础能力，然后逐步推进 P1/P2 的体验优化和深度能力建设。

---

# Reference

<table><tbody>
<tr>
<td>



</td>
<td>

文档

</td>
<td>

备注

</td>
</tr>
<tr>
<td>

Mem0：

</td>
<td>

[记忆模块算法技术评审](https://bytedance.larkoffice.com/wiki/EmPiwvmd9icNgXkw8dIcmhhanzh)

</td>
<td>



</td>
</tr>
<tr>
<td>

MOA：

</td>
<td>

[MOA Memory 模块实现方案](https://bytedance.larkoffice.com/docx/QOWAdBBkBoAlUlxVfVxc5pUnnYg)

[MoA\(Mix\-of\-Agents\)：通用Agent场景中Sub\-Agent接入方案](https://bytedance.larkoffice.com/wiki/X8g3wOpPkiYJ7skFXRQcmoHznvc)

</td>
<td>



</td>
</tr>
<tr>
<td>

openClaw：

</td>
<td>

[OpenClaw进阶：不得不升级的记忆系统](https://bytedance.larkoffice.com/wiki/POiKwWD5iiP8RdkYL0GclxyCnqd)

[【产品调研】OpenClaw文件系统 / 记忆系统](https://bytedance.larkoffice.com/wiki/UDxGw3luAitEv3kxZ7ocCOKsnMc)

[OpenClaw \+ OpenViking 记忆模块分享](https://bytedance.sg.larkoffice.com/docx/HAR8d2Io9okWunxhS1llSyIygzd)

</td>
<td>



</td>
</tr>
<tr>
<td>

swalm

</td>
<td>

[Swalm Tutorial](https://bytedance.larkoffice.com/wiki/X3KLwVBYniDh9PkSjdFcjYbmnlv)

[Swalm One Pager](https://bytedance.larkoffice.com/wiki/HWuOwJ6laiPey5k7RmEcxAXknVc)

</td>
<td>



</td>
</tr>
</tbody></table>




