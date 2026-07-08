你已经收到一篇文章的深度拆解结果。现在你要基于这个拆解，完成一组可落地的 fork 资产。

目标不是炫技生成一个网页，而是把文章变成用户未来能复用、能回测、能沉淀到 Planner/SP/Agent 工作里的知识资产。

# 1. 提取代码（extracted_code）

"代码"= 文章里可以被工具化的方法论或框架。像描述一个函数一样描述它：

- 方法名（给它一个简短的名字）
- 它解决什么问题（一句话）
- 输入（用户要提供什么）
- 输出（用户会得到什么）
- 步骤（像伪代码一样，每步一行，写清楚具体动作，不要泛泛说"分析内容"）
- 不适用场景（什么情况下这个方法不好用）

如果文章是纯观点/叙事型，没有可提取的方法论，直接说"这篇文章没有可直接 fork 的代码"。

# 2. 生成 Source 资产（source_asset）

生成 `source.md` 的正文内容，要求：

- 标题和一句话主旨
- 文章类型与 fork 价值判断
- 逐段深度拆解：原文定位、论证功能、核心主张、隐含假设、精彩或破绽、与 Planner/SP/Agent 工作的直接关联
- 论证链
- 全文隐含假设
- 边界条件
- 跨 fork 连接建议；不知道已有 fork 时可以写"待人工补充"

# 3. 生成 Concept 资产（concept_asset）

生成 `concept.md` 的正文内容，要求：

- 标题必须命名迁移后的概念，而不是复述文章标题
- 把文章场景映射到用户的 Planner/SP/Agent 工作
- 提炼 3-6 个原则、维度或步骤
- 给出至少一种 SOP、Checklist、评分 Rubric、Prompt 模板或 Badcase 诊断方法
- 给出"做对了的信号"和"仍停留在表层的信号"

# 4. 工具提案（tool_proposal）

基于提取的代码，提出一个具体的工具：
- 名称（简洁、好记）
- 一句话功能
- 形态（面向非技术用户优先选单个 HTML 文件，双击浏览器即可打开）
- 为什么这个形态最合适（一句话）
- MVP 核心功能（不超过 3 个）
- 典型使用场景（要具体到"你周三晚上读到一篇文章……"这种粒度）
- 第一次迭代可以加什么（只写 1 个）

# 5. 生成代码（generated_code）

生成一个**完整的、可以直接保存运行的**最小原型。

硬性要求：
- 必须是单个 HTML 文件（包含内联 CSS + JS），用户双击就能在浏览器打开
- 不依赖任何外部服务、API、CDN
- 如果功能需要 AI（比如生成分析、问题等），用**提示词模板**的方式：把 prompt 写好，用户点"复制提示词"按钮，粘贴到 Claude/ChatGPT 使用
- 界面干净、现代、深色主题（#0a0a0a 底色）
- 代码完整可运行，不能有 TODO、占位符、省略号
- 所有文字用中文
- 交互直觉化，非技术用户能直接用
- 如果文章没有足够可工具化的代码，仍可生成一个诊断卡/阅读工作台，但要在工具里承认它是"思维透镜"而不是硬工具

# 输出格式

严格 JSON。不要 markdown 代码块，不要前后解释：

{
  "extracted_code": {
    "method_name": "方法名",
    "problem_solved": "解决什么问题",
    "input": "输入",
    "output": "输出",
    "steps": ["步骤1", "步骤2"],
    "boundaries": ["不适用场景1"]
  },
  "source_asset": {
    "filename": "source.md",
    "content": "完整 source.md 正文"
  },
  "concept_asset": {
    "filename": "concept.md",
    "content": "完整 concept.md 正文"
  },
  "tool_proposal": {
    "name": "工具名",
    "one_liner": "一句话功能",
    "format": "形态",
    "why_this_format": "为什么选这个形态",
    "mvp_features": ["功能1", "功能2", "功能3"],
    "use_case": "具体使用场景",
    "first_iteration": "第一次迭代加什么"
  },
  "generated_code": {
    "filename": "文件名.html",
    "language": "html",
    "usage": "使用说明（写清楚：1.怎么打开 2.怎么用 3.结果在哪）",
    "code": "完整的 HTML 代码"
  },
  "metadata": {
    "article_title": "文章标题",
    "article_type": "文章类型",
    "category": "分类",
    "tags": ["标签1", "标签2"],
    "fork_outputs": ["source", "concept", "tool"]
  }
}

# 深度拆解结果

{{DEEP_READ}}

# 原文

{{CONTENT}}
