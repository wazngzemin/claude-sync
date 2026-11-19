# T 章 v73 构建报告

- 底稿：`HTML/01-进行中/豆包汽车-业务学习站-v72.html`；底稿未改。
- 输出：`HTML/01-进行中/豆包汽车-业务学习站-v73.html`。
- 构建脚本：`research/T-v2/build_v73.py`。
- 合并顺序：part-1 → part-2 → part-3 → part-5 → part-4；生成同目录 full.md，仅去除非图位 HTML 注释。

## 唯一正文删改

part-4.md 附二末尾仅删除“8 月 4 日，三点五十八分的提醒没响”和“9 月联调，空任务列表仍有图标”两段及多余空行。通过重建删除前文件与 SHA-256 核验，其他文字一字未改。

- 删除前 SHA-256：`97f8e9b415676dae437d38d6572321113c011021f23fa9b5a8e585b38361666c`
- 删除后 SHA-256：`0f16487ad13ef00f9acd23eebc3556a296c37c0b92f31a65c90fbf21bb2131ee`

## 结构与一致性

| 项目 | 结果 |
|---|---|
| 正文 h2 / h3 | 16 / 57；含 9 个图题时 h3 为 66 |
| SVG | 8 种资产、页面 9 个；t2-overview 两处均显示 |
| 例子 / 案例 | 57 / 39 |
| details | 2：原始全图、附二 |
| 原始全图 | 附二之前，指定引导句，内嵌 t-base，可缩放 |
| 全文比对 | full.md 与五份合并输入一致；网页全部正文块、加粗和完整正文 DOM 逐字一致，差异 0；比对排除指定新增的原图折叠和图框 |
| 其他章节 | 其余 23 章 DATA 与实际运行 DOM 完全一致 |
| 旧 T 课程结构 | 已清除正文、问答、复述、课程分节等旧负载；19 个旧锚点映射到新标题 |
| 禁用词 | 正文、SVG 可见文本、元数据与辅助文本均为 0；真实人名复核未发现 |
| 工具和字段英文名 | 仅附二；Planner、Advisor、Frontier 等模型/系统名和 Script 概念别名按原稿保留 |

## 原图可见英文标注适配

原始 t-base.svg 仍含 goal_id、UpdateGoal、TaskView 等英文标注。构建时仅在网页内将其替换为对应中文，保留源 SVG 文件，保留节点、连线、坐标及业务含义。共 30 处 text 元素发生标注或必要换行调整；逐项映射及前后哈希记在 build-manifest-v73.json 的 originalFigureVisibleLabelTranslations 与 figureAudit 中。JSDOM 独立应用映射后比对完整 SVG DOM 通过。

7 张新图通过 XML、字体测量、重叠、边界与连线检查。网页内原图也经离线 rsvg 渲染与几何检查：文字重叠 0、越界 0、箭头穿节点 0。

## 运行验收与限制

JSDOM 共 206 项检查全部通过，运行错误 0：本页跳转、两级目录、全标题搜索、旧锚点、9 个图框缩放、编辑、保存后重开、另存 HTML 后重开、v72 / v73 双向编辑快照隔离。

未启动浏览器。375px 下的容纳规则、整页 overflow-x 限制、图框和表格独立滚动容器通过静态检查；JSDOM 不计算实际布局，因此未实际测量页面横向滚动宽度。

详细证据：build-manifest-v73.json、verification-v73.json、figure-checks.json、original-figure-geometry-v73.json。
