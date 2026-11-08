# 学习站前端交接

## 文件边界

- `shell.html.template`：无构建依赖的页面骨架，含 `/*SITE_DATA*/`、`/*APP_STYLE*/`、`/*APP_SCRIPT*/` 三个替换位。
- `styles.css`：白底冷灰蓝 / 青的内容优先阅读布局，中文正文 17 px，正文、流程和原节点分层；没有 CDN、外部字体或外部图片依赖。
- `app.js`：本地路由、全文检索、图文跳读、工具合同、来源、学习进度与笔记。
- 不拥有 `build.mjs`、内容包、图生成器或最终 HTML；本前端工作者未创建最终 HTML、未开服务器、未打开浏览器。

设计依据：用户已明确选择“结构重塑”并要求详细可点击网站。采用 `qiaomu-design-advisor` 的内容优先、减少无意义卡片、清晰状态和键盘可达原则；没有增加阻塞性的风格确认。

## 组织方式

桌面左侧 5 组目录覆盖 23 个模块。首页先主链，再完整关联图与模块目录。模块文章顺序：场景 → 职责边界 → 流程与每一步解释 → 专题章节 → 原图全部节点 → 案例 → 异常 → 自测问题 → 指标 → 后续方向 → 术语 → 上下游关联 → 来源 → 本地笔记。

`#map` 先显示 23 模块的新关联总览，再保留旧详细图的全部 291 个节点和 40 + 6 工具。两张图均可缩放，支持全屏式放大、滚动、鼠标拖动空白处、节点跳读和 Esc 关闭。

每个旧模块即使已有短流程，仍另设“完整细节图”章节保留该模块全部 12–18 个原节点；短流程不替代完整机制。交接表遇到单独的原节点编号时自动显示可点击中文节点标题，编号与所属模块作为小字保留。图默认按可读尺寸展开，并提供“看全宽 / 读细节”；放大窗口对旧图至少用 68% 原始尺寸，不默认把数千像素内容压进窄栏。宽图允许横向滚动，图外正文始终可正常阅读。

如果某个旧模块没有 Page，使用原模块副标题、全部节点解释、问题、指标与来源作为明确标注的“原始节点资料版”，不导致空入口。新增模块如果没有正文，会明确显示资料未导入，不用假内容补齐。最终交付仍应由根代理确认 23 页均有实质正文，不应依赖该容错作为完成标准。

新章节 SVG 自带 `.t/.th/.ts/.title` 等样式；页面未使用这些通用类。系统暗色偏好下，仅新章节图的背景改为深色，匹配 SVG 内置暗色配色。旧 v15 SVG 保持白底和原颜色。

工具页保留原始 input / mechanism / output / exception / status / next；额外支持 decision / execution / completionEvidence / successCriteria。若未单列成功标准，页面明确指出字段缺口并要求按该工具返回合同核验，不自动捏造统一成功标准。是否能从原字段提炼更具体标准，应由内容负责人依据资料补充。

## 路由

| 地址 | 行为 |
|---|---|
| `#home` | 首页与全局目录 |
| `#module/K` | 模块文章 |
| `#module/K/section/<id>` | 模块章节；支持页面章节 id 和内容 sections 的原 id |
| `#module/K/flow/<flowId>/step/<stepId>` | 流程图节点对应的解释 |
| `#module/K/node/K01` | 模块中的原节点，自动展开 |
| `#module/K/question/0` | 特定自测问题 |
| `#module/K/term/0` | 特定术语 |
| `#node/K01` | 原节点独立解释与真实上下游 |
| `#node/K01/notes` | 节点笔记 |
| `#tools` | 工具分类目录，40 行和 6 项专项分开 |
| `#tool/TOOL01` | 工具输入、内部机制、返回、异常与下一跳 |
| `#tool/TOOL01/notes` | 工具笔记 |
| `#sources` / `#source/<sourceId>` | 证据覆盖 / 单份来源及引用位置 |
| `#roadmap` | 各模块后续方向汇总，保留状态 |
| `#study` | 自评掌握、问题勾选、本地笔记与导出 |
| `#search?q=tool_feedback` | 本地全文搜索结果 |

导航使用 hash；浏览器返回 / 前进触发实际路由。已读页面在会话内记录滚动位置。单独章节深链优先定位章节。

图元支持 `data-page`、`data-node`、`data-step` + `data-flow`、旧图的 `data-tool` 与 `data-module`。图元均转为键盘可达链接语义；Enter / 空格进入，整个图不是只可鼠标操作的图片。

## 本地状态

存储键：`doubao-learning-site-v01`。字段：`notes`、`completed`、`checks`、`visited`。打开模块仅记录“读过”；掌握状态必须主动标记，问题必须主动勾选。不改写旧 v15 笔记。

笔记自动保存，另有明确保存按钮。存储被浏览器拒绝时保留内存并提示导出，不宣称已经落盘。导出 Markdown 含个人自评、勾选问题与笔记，不包含私有原文全文；页面不会上传学习记录。

## 自动化 hooks

`window.CockpitLearningSite`：

- `getCounts()`：模块、节点、连接、工具、补充定义、来源与搜索项计数。
- `getPages()`：页面 id、标题、fallback / missing 状态。
- `getRoute()`、`parseRoute(hash)`、`navigate(hash)`、`render()`。
- `search(query, type)`：确定性本地检索；type 为 `all/module/node/tool/term/question/source`。
- `getState()`：状态只读副本；`getStorageAvailable()`。
- `getDiagramCount()`：本页挂载的图数。
- `exportNotes()`：导出并返回 Markdown；测试环境无下载 API 时仍返回正文。
- 每次渲染派发 `cockpit:render` 事件，detail 包含 route/title。
- 未捕获的页面数据错误记录在 `window.__siteLastError`；内容页会提供可见错误说明，不把失败隐藏成空白。

主要 DOM 选择器：

- `#global-search`、`#search-form`、`#page-search-form`、`.search-result`、`[data-search-filter]`。
- `[data-base-node]`、`[data-expand-nodes]`、`[data-question-check]`、`[data-complete]`。
- `[data-diagram]`、`[data-open-diagram]`、`[data-figure-zoom]`、`#diagram-modal`、`[data-modal-zoom]`。
- `[data-note-key]`、`[data-save-note]`、`[data-export-notes]`、`.saved-note`。
- `#menu-toggle`、`#nav-backdrop`、`.nav-item[aria-current=page]`。

## 已做与未做的验证

已在内存中用当前 `corePages(base)`、`flowDiagram`、`overviewDiagram` 和 v15 完整 SVG 合成 JSDOM 页面，不写最终 HTML。首轮 25 项、补充修订后 80 项检查全部通过，JavaScript 错误为 0：

- 23 模块入口、291 节点、459 连线；40 工具行与 6 专项。
- V/D/E/K/SE 路由可打开；V 的 18 个节点保留且可全部展开。
- 章节图节点进入精确步骤深链；原节点真实上下游存在。
- 工具机制与异常字段可读；全部 46 条工具入口可用。
- 全来源可见；`#map` 同时有新关联图与旧详细图；旧图工具点击进入详情。
- 笔记自动保存、学习页汇总；全文搜索结果。
- 图放大、Esc 关闭；移动菜单开关与 Esc。
- 23 个路由逐一打开；20 个旧模块的原节点数量逐一对应，全部保留独立完整细节图。
- 原图裁剪后只保留视窗内可聚焦节点；V 保留 18 个而非把不可见的其他节点也留在 Tab 顺序。
- 手工交接表编号替换为中文链接；移动端本页章节选择；旧细节图默认可读尺寸。
- 键盘 Enter 打开章节步骤和旧图工具；浏览器 history.back 恢复搜索路由。
- 笔记导出正文包含实际输入；工具成功标准缺口明确显示；首页有分层学习深度与自测走查。

这轮测试输入仅含当时可用的 19 篇 core Page，K / EV / EL / SE 使用容错状态；未把容错判为内容完成。根代理合并四个重点 Page 后需要重跑最终全量内容与交互验收。

这只是离线 DOM 行为验证，不等于真实浏览器布局、触控与截图验收。根代理还需对最终合并内容执行完整检查，真实浏览器检查桌面 / 移动端、长文、图缩放、历史返回、笔记导出下载与文件授权边界。
