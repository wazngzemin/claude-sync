AGENTS

本文档定义此 LLM Wiki 的结构约定和行为规范。LLM 在执行 ingest/query/lint 操作时必须遵循这些规则。用户和 LLM 共同维护此文档，随着知识库演进持续完善。
页面类型


类型

标题前缀

存放目录

说明

source

Source:

wiki/sources/

对 raw/ 素材的分析摘要

entity

Entity:

wiki/entities/

人物、组织、工具、项目等

concept

Concept:

wiki/concepts/

方法论、模式、理论等

comparison

Comparison:

wiki/comparisons/

对比分析（通常由 query 产出）

overview

Overview:

wiki/overviews/

主题综述（通常由 query 产出）
命名规范
标题前缀严格遵循上表
Entity 以名词命名，Concept 以主题命名
Source 标题取原文标题，过长时适当缩写
引用规范
文档内所有对云盘文档/文件的引用统一使用 <mention-doc token="doc_id 或 file_token" type="docx">标题</mention-doc>
禁止在文档内容中使用云盘文档/文件的原始 URL（外部链接不受此限制）
INDEX 页面注册表的 Doc 列同样使用 mention-doc 格式
工作流规则
ingest: 用户将素材放入 raw/ 后通知 LLM → LLM 从 raw/ 读取内容 → 在 wiki/ 创建 Source 摘要和关联页面 → Source 页的「原始来源」用 mention-doc 引用 raw/ 下的素材
query: 从 INDEX 定位相关页面 → fetch 并综合回答 → 有价值的回答归档为 Overview/Comparison 回流到 wiki
lint: 检查矛盾、过时声明、孤立页、缺失页面、断链、交叉引用缺失 → 生成报告 → 建议新问题和新源
领域约定
以下为默认配置，可根据使用习惯调整
提取粒度: 精选（仅提取有充分信息支撑的实体/概念，≥3 条关键事实）
摄入模式: 交互式（提取前展示预览并等待确认）
归档策略: 推荐归档（对比分析和综述主动推荐，用户一键确认）
领域关键词: （用户填写，帮助 LLM 识别领域内的重要实体和概念）
（由用户和 LLM 在使用过程中逐步补充，例如：）（- 本知识库聚焦的领域和范围）（- 特定术语的翻译或命名约定）
