# 座舱业务学习站

## 目标与边界

用户要一个详细的本地网站：从完整业务链路进入任意模块，阅读机制、流程图、具体案例、异常、产品验收和后续方向。重点单列 Memory、事件、事件日志、自进化。保留 v15 的全部 20 个模块、291 个节点及工具定义，不以少数精美页面替代全量内容。私有资料不上传公共服务；旧 HTML 不覆盖。

## 内容接口

源数据：`whiteboard/豆包汽车-业务全链路-v15/graph-v15.json`。

各内容包可包含 `{pages: Page[], pageAdditions: Record<string,Partial<Page>>, walkthroughs: Walkthrough[], sources: Source[], researchNotes: (string|object)[]}`；已有模块页面 id 用 V/R/M/C/D/E/O/I/W/F/K/T/B/A/G/S/P/L/H/U，新增 EV（事件）、EL（事件日志）、SE（自进化）、DR（司机 Agent 专项业务）。DR 不等于 Planner/Director，也不等于 auto_drive 工具。增量合并只追加指定数组，不覆盖历史来源。

Page 字段：

```ts
type Source = {id:string,title:string,url:string,note:string};
type Walkthrough = {
 id:string; title:string; query:string; scope:string; boundary:string; sourceIds:string[];
 steps:{id:string;title:string;actor:string;moduleIds:string[];known:string[];unknown:string[];
 input:string;decision:string;output:string;next:string;evidence:string;failure:string;sourceIds:string[]}[];
};
type Page = {
 id:string; title:string; shortTitle:string; summary:string; scenario:string;
 why:{problem:string,cause:string,value:string,boundary:string};
 sections:{id:string,title:string,paragraphs:string[],table?:{columns:string[],rows:string[][]},sourceIds:string[]}[];
 flows:{id:string,title:string,caption:string,nodes:{id:string,title:string,body:string[],status?:string}[],edges:{from:string,to:string,label:string,planned?:boolean}[],sourceIds:string[]}[];
 cases:{title:string,query:string,steps:{actor:string,action:string}[],failure:string,sourceIds:string[]}[];
 terms:{term:string,meaning:string}[];
 questions:{q:string,why:string,goodAnswer:string,evidence:string}[];
 metrics:{name:string,definition:string,segment:string,targetStatus:string}[];
 roadmap:{title:string,status:string,change:string,why:string,verify:string,sourceIds:string[]}[];
 related:{id:string,label:string,reason:string}[];
 sourceIds:string[];
};
```

每篇重点页面至少 6 个有实质内容的章节、2 个流程、2 个案例、5 个带参考答案的问题、4 个可操作指标、3 项标明状态的后续方向。不是用句子数达标：必须解释是谁在什么条件下拿到什么信息、作何判断、发给谁、什么才算完成、失败怎么办。图节点用短标题，图外有完整正文；流程不超过 12 节点，必要时分阶段图，同时提供全图和相互关系。模型输出、工具受理、任务状态、真实执行分开。

## 网站接口

前端 buildless，根代理生成单文件 HTML，数据通过 `/*SITE_DATA*/` 注入 `const DATA=...`。DATA = `{base: v15Graph, pages:Page[], walkthroughs:Walkthrough[], sources:Source[], overviewSvg:string, diagrams:Record<string,string>, originalSvg:string, coverage:object, meta:object}`。

前端文件：`app.js`、`styles.css`、`shell.html.template`，由网页工作者负责；根代理负责 `build.mjs`、`validate.mjs`、`data/` 合并和 `diagrams.mjs`。内容工作者只写 `content/memory-events.json`、`content/evolution.json` 和各自 research 子目录。

必须有：首页完整可点击链路、分组目录、全文搜索（模块/节点/工具/术语）、模块文章、原始节点展开、明确上下游、工具机制页、来源与证据状态、未来方向、学习进度与本地笔记导出、hash 深链接、浏览器返回前进。移动端导航可用，键盘可达。无需登录，不伪装在线 AI 问答。

完整场景走查保留全部前后步骤；定位某一步不折叠其他步骤。每一步呈现已知/未知、输入、判断、输出、下一跳、完成证据和失败去向。它是来源化教学，不是伪造的线上运行日志。模块正文可以反向进入场景所在步骤；章节与事件 ID 可检索并直接定位。资料清点页面单列完整检索元数据与已审读正文，清单分类不足时保持待判断。

## 验收

1. 全部 20 个旧模块和 4 个新增模块可进入、可解释、可追溯；没有空入口。
2. 291 个原节点可从模块打开，源合同 40 行 + 6 专项可检索，不将条目数当线上能力数。
3. Memory / EV / EL / SE 深读内容有一手正文依据，未来方案不宣称上线。
4. 图节点与章节互通，全部边端点存在，主链与事件日志/记忆/优化回流关系明确。
5. 搜索、路由、历史、笔记、导出、来源、移动菜单与键盘自动化覆盖；实际可用浏览器验证成功，或明确保留未验证项不宣称完成。
6. 本地 HTML 递增到新主题 v01，生成期间不覆盖历史交付。截图、程序检查与真实业务上线验收不混称。
