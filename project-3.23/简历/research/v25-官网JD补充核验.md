# v25 官网 JD 补充核验

核验日期：2026-11-17。范围：逐一尝试指定 16 家公司官网，补足原 36 条之外的岗位；全程仅用联网搜索、网页读取和官方公开职位 JSON，未启动浏览器、未登录或投递。

## 结果与口径

**新增读到职责及任职要求正文的独立岗位 15 条，其中明确 PM 10 条、相邻解决方案/数据运营/GTM 岗 5 条。** 10 条 PM 中，社招 5 条，校招或实习 5 条；校招与实习用于观察能力写法，不能据此判断用户符合申请资格。来源为官方公开 JSON 9 条、官网多岗位正文 3 条、公开转载 3 条。岗位发布时间、当前可读、是否仍在招分开记录；本轮不限定近一年首次发布，不把 API 的 publish_time 自动理解为最早发布日期。

网页 0 行与取得正文是两次不同的读取结果，二者都保留。飞书招聘使用公开的 `/api/v1/job/posts/{id}` 可返回 `code=0` 及 `description/requirement`，据此补足正文，未使用登录信息或绕过验证。星海图 3 岗在同一官网页面上，按不同岗位计数，同一页面反复打开不重复计。

原 JD01–JD23 / S01–S13 不再计入新增；智元四足产品经理、零售仓产品经理虽然同名，但官方 ID、城市与职责均不同，分别计数；优必选本次“产品经理”与原“人形产品经理”不同。

## 16 家官网逐一打开结果

| 公司 | 实际尝试来源 | 打开结果 | 计数处理 |
|---|---|---|---|
| 智元 | [官网/招聘入口](https://agirobot.jobs.feishu.cn/) | 网页0行；具体职位官方公开JSON可读 | O01/O02/O03/O04/O07，原S01等不重计 |
| 银河通用 | [官网/招聘入口](https://www.galbot.com/contact/) | 官网可读且找到招聘链接；Moka招聘入口Redirect loop detected | 未新增岗位，不从公司信息猜JD |
| 宇树 | [官网/招聘入口](https://www.unitree.com/position/) | 招聘目录可读；研发项目经理详情只剩导航页/页脚，未读要求 | 不计新增JD |
| 星海图 | [官网/招聘入口](https://galaxea-ai.com/en/jobs.html) | 成功，官网职责和任职要求均可读 | 新增O12/O13/O14；均是相邻岗位，未冒称PM |
| 傅利叶 | [官网/招聘入口](https://fftai.com/fourier/join) | 官网加入页面0行；原始HTML为JS壳 | 未新增，不采用physicaldaily模板化岗位 |
| 小米 | [官网/招聘入口](https://hr.xiaomi.com/website/opportunities.html) | 页面可读但共—个职位，未加载岗位正文 | 未新增 |
| 地平线 | [官网/招聘入口](https://www.hotjob.cn/wt/Horizon/mobweb/v8/position/list) | 500；重定向目标不可访问，non-retryable error | 原地瓜机器人两岗由既有JD代理核验，不新增 |
| 字节Seed | [官网/招聘入口](https://seed.bytedance.com/zh/career) | 官网招聘目录可读；具体具身评测岗位公开JSON成功 | 新增O06；原数据引擎岗不重计 |
| 追觅 | [官网/招聘入口](https://dreame.zhiye.com/jobs) | 0行，无可读正文 | 未把其他智能硬件岗位当具身JD |
| 自变量 | [官网/招聘入口](https://x2-robot.jobs.feishu.cn/index/position/list?current=1&limit=10) | 目录0行；具体职位官方公开JSON可读 | 新增O05/O08；转载O10/O15；原Agent/行业两岗不重计 |
| 逐际动力 | [官网/招聘入口](https://career.limxdynamics.com/) | 根目录502；GTM页面Cache miss，公开JSON成功 | 新增O09商业化对照；原Agent/平台岗不重计 |
| 乐聚 | [官网/招聘入口](https://www.lejurobot.com/zh) | 官网可读；未定位到独立官方产品岗正文 | 未新增；2021旧转载打开Cache miss |
| 优必选 | [官网/招聘入口](https://zhaopin.ubtrobot.com/home) | 招聘首页Timeout fetching；公开转载具体产品岗全文可读 | 新增O11校招；与原人形产品经理不同 |
| Figure | [官网/招聘入口](https://www.figure.ai/careers) | 官网介绍可读；See All Open Roles仍指回本页，未读具体PM正文 | 未新增；排除figure.com金融同名公司 |
| 1X | [官网/招聘入口](https://www.1x.tech/careers) | 官方当前职位目录可读；未见可新计的PM全文 | 既有两岗不重计；不把Robot Operations Manager PM中的PM误作产品经理 |
| PI / Physical Intelligence | [官网/招聘入口](https://www.physicalintelligence.company/careers) | 该路径工具不可访问；原PM Ashby页404 | 原S10不重计，也不从历史搜索索引补全现页内容 |

## 新增岗位逐条清单

| 编号 | 公司 / 岗位 | 岗位性质 | 正文来源 / 打开结果 | 已读职责与要求 | 能力编码 |
|---|---|---|---|---|---|
| O01 | 智元 / 产品经理（四足产品经理） | PM-社招 | [原页](https://agirobot.jobs.feishu.cn/index/position/7583144810032384307/detail)；[正文](https://agirobot.jobs.feishu.cn/api/v1/job/posts/7583144810032384307)；网页0行；官方公开JSON成功code=0 | 研究四足机器人市场与用户需求，定义规格与生命周期；要求5年以上产品经验及消费硬件、座舱或机器人量产案例，能将技术能力转成用户功能。 | C01、C02、C03、C08、C09、C12、C13 |
| O02 | 智元 / 产品经理（零售仓产品经理） | PM-社招 | [原页](https://agirobot.jobs.feishu.cn/socialrecruitment/position/7698932878412351798/detail)；[正文](https://agirobot.jobs.feishu.cn/api/v1/job/posts/7698932878412351798)；网页0行；官方公开JSON成功code=0 | 负责零售仓机器人产品及VLA、导航、规控、调度算法产品化；要求3年以上仓储/物流/机器人产品经验，理解软硬件协同并独立负责产品线。 | C01、C02、C03、C04、C09、C12 |
| O03 | 智元 / 具身产品经理-觅蜂子公司 | PM-校招 | [原页](https://agirobot.jobs.feishu.cn/campusrecruitment/position/7662290681059051795/detail)；[正文](https://agirobot.jobs.feishu.cn/api/v1/job/posts/7662290681059051795)；网页0行；官方公开JSON成功code=0；转载要求混入算法岗内容，舍弃转载要求 | 规划人类操作数据采集终端及数据服务，定义质量与交付标准并连接模型反馈；官方要求硕士及以上相关专业、理解感知/采集和软硬件约束。 | C01、C02、C03、C04、C06、C07、C09、C12、C14 |
| O04 | 智元 / 具身生态产品经理-觅蜂子公司 | PM-校招 | [原页](https://agirobot.jobs.feishu.cn/campusrecruitment/position/7673472974649870635/detail)；[正文](https://agirobot.jobs.feishu.cn/api/v1/job/posts/7673472974649870635)；网页0行；官方公开JSON成功code=0 | 面向开发者做需求反馈、开源运营及技术活动；要求相关专业本科、开发者思维和Python/C，仿真、数据集和模型微调属于加分项。 | C01、C02、C03、C04、C06、C10、C13、C14 |
| O05 | 自变量 / 具身智能教育线产品经理 | PM-社招 | [原页](https://x2-robot.jobs.feishu.cn/index/position/7673793445664409906/detail)；[正文](https://x2-robot.jobs.feishu.cn/api/v1/job/posts/7673793445664409906)；官方公开JSON成功code=0；网页仅搜索索引可见正文，原HTML是脚本壳 | 把高校和职教实训需求转成机器人设备、软件、课程产品；要求3年以上产品经验且1年以上教育产品经验，理解多模态/世界模型/VLA及软硬件协同。 | C01、C02、C03、C04、C09、C12、C13 |
| O06 | 字节Seed / 具身评测产品经理 - Seed Model（具身数据评测产品经理） | PM-社招 | [原页](https://jobs.bytedance.com/experienced/position/7698644813525600565/detail)；[正文](https://jobs.bytedance.com/api/v1/job/posts/7698644813525600565)；官方公开JSON成功code=0；第三方标题仍为具身数据评测，现官方为具身评测 | 建设具身模型评测与版本准入，分析失败模式、评测可信度和能力退化，将发现变成数据与模型改进；要求训练评测理解、实验判断、问题优先级与跨团队推进。 | C01、C02、C03、C04、C06、C07、C11、C13 |
| O07 | 智元 / 机器人交互产品经理实习生 | PM-实习 | [原页](https://agirobot.jobs.feishu.cn/internrecruitment/position/7559518673171106067/detail)；[正文](https://agirobot.jobs.feishu.cn/api/v1/job/posts/7559518673171106067)；网页0行；官方公开JSON成功code=0 | 参与人形机器人动作/语音/表情交互、数据标签和badcase版本对比；要求基础Python阅读、AI工具、审美与跨团队推进，实际项目优先。 | C01、C02、C03、C04、C06、C07、C08、C09、C13 |
| O08 | 自变量 / 具身机器人物流解决方案 | 相邻-解决方案 | [原页](https://x2-robot.jobs.feishu.cn/index/position/7591767385671158035/detail)；[正文](https://x2-robot.jobs.feishu.cn/api/v1/job/posts/7591767385671158035)；网页Timeout fetching；官方公开JSON成功code=0 | 面向物流客户做需求、方案、演示、投标与项目导入；要求机器人/自动驾驶/智能硬件理解、成功落地和客户沟通，并非任务规划产品岗。 | C01、C02、C03、C09、C12、C13 |
| O09 | 逐际动力 / GTM产品经理 | PM-社招-商业化 | [原页](https://career.limxdynamics.com/index/position/7688265867825875226/detail)；[正文](https://career.limxdynamics.com/api/v1/job/posts/7688265867825875226)；网页Cache miss；官方公开JSON成功code=0 | 规划巡检机器人定位、定价、渠道、POC及标准/定制边界；要求3–5年以上B/G端机器人或工业物联网产品经验、ROI与规模销售，作为商业化方向对照。 | C01、C02、C03、C07、C11、C12、C13 |
| O10 | 自变量机器人 / 产品经理实习生 | PM-实习 | [原页](https://www.shushuqiuzhi.com/job/513710)；[正文](https://www.shushuqiuzhi.com/job/513710)；成功；公开转载正文477行，L453–465目标职位 | 参与竞品/需求分析、功能验收、用户反馈和资料整理；要求相关专业本科、机器人项目优先、了解硬件流程和产品工具；只用作实习要求对照。 | C01、C02、C03、C09、C12 |
| O11 | 优必选 / 产品经理 | PM-校招 | [原页](https://www.shushuqiuzhi.com/job/488923)；[正文](https://www.shushuqiuzhi.com/job/488923)；成功；公开转载正文228行，L204–216目标职位 | 负责软硬件全生命周期、体验迭代、用户/市场数据和跨部门节奏；要求计算机相关硕士、逻辑分析与产品流程理解。与原JD23人形产品经理为两个不同职位。 | C01、C02、C03、C08、C09、C12、C13 |
| O12 | 星海图 / Senior Solutions Manager | 相邻-解决方案 | [原页](https://galaxea-ai.com/en/jobs.html)；[正文](https://galaxea-ai.com/en/jobs.html)；成功；官网534行，L224–253 | 统筹行业方案、选型、数据标准、现场部署和验收；要求相关本科及3年以上经验，机器人/自动驾驶落地、SaaS和具身数据运营优先。 | C01、C02、C03、C06、C07、C09、C12、C14 |
| O13 | 星海图 / Data Operations Specialist – POV & UMI | 相邻-数据运营 | [原页](https://galaxea-ai.com/en/jobs.html)；[正文](https://galaxea-ai.com/en/jobs.html)；成功；官网534行，L256–291 | 负责POV/UMI采集、质检、供应商、流程标准和工具验收；要求相关数据运营经验、质量评价及把现场问题转成平台需求的能力。 | C02、C03、C06、C07、C13、C14 |
| O14 | 星海图 / Director of Data Operations | 相邻-数据运营 | [原页](https://galaxea-ai.com/en/jobs.html)；[正文](https://galaxea-ai.com/en/jobs.html)；成功；官网534行，L294–336 | 统筹数据产能、可用率、单位成本、标注质检和平台需求；要求8年以上相关经验与团队管理，国际供应商经验是加分，偏运营管理。 | C02、C03、C06、C07、C11、C13、C14、C15 |
| O15 | 自变量机器人 / GTM产品市场实习生 | 相邻-GTM实习 | [原页](https://www.recruit.net/job/gtm-jobs/2DED776753FB5DD1)；[正文](https://www.recruit.net/job/gtm-jobs/2DED776753FB5DD1)；成功；职责+要求在L63–76；投递另需登录，与阅读分开 | 协助硬件/模型/服务上市节奏、用户访谈、定价和效果复盘；要求2026/2027届在读、Office、数据分析与把技术转成商业语言，只作市场岗位对照。 | C01、C02、C03、C07、C12、C13、C15 |

### 两项会影响简历选材的核验纠错

- 智元“具身产品经理—觅蜂子公司”的 WatchJobs 转载把部分任职要求写成了扩散模型、论文、深度学习研发要求；官方公开 JSON 实读的要求是相关专业硕士、感知/采集理解、软硬件协同和项目推进。本报告只采用官方要求，不把转载的算法要求加入矩阵。[官方职位正文](https://agirobot.jobs.feishu.cn/api/v1/job/posts/7662290681059051795)
- 字节 Seed 的第三方页仍称“具身数据评测产品经理”，当前官方 JSON 标题为“具身评测产品经理 - Seed Model”；两者对应同一职位 ID，只计 1 条。该岗突出评测可信度、能力缺口、数据投入及改进效果，简历应呈现分析和决策结果，不能只列评测规则。[官方职位正文](https://jobs.bytedance.com/api/v1/job/posts/7698644813525600565)

## 新增样本需求编码

沿用原调研 C01–C15 定义。统计单位是独立岗位，每岗每项计 1 次；相邻岗位纳入此小样本统计时已明确标出，不把它们混称机器人 PM。全 15 岗频次供主代理合并，不代表市场占比。

| 编码 | 15 条新增岗出现次数 |
|---|---:|
| C01 | 13/15 |
| C02 | 15/15 |
| C03 | 15/15 |
| C04 | 6/15 |
| C06 | 7/15 |
| C07 | 8/15 |
| C08 | 3/15 |
| C09 | 9/15 |
| C10 | 1/15 |
| C11 | 3/15 |
| C12 | 10/15 |
| C13 | 11/15 |
| C14 | 5/15 |
| C15 | 2/15 |

对用户现有经历最有用的事实证明：

| HR 可扫描关键词 | 简历需要的事实 |
|---|---|
| 场景洞察 / 产品定义 / 版本落地 | 服务谁、解决什么问题、本人决定或负责什么、交付到什么阶段。 |
| 任务规划 / Agent / 多模态交互 | 一个明确的任务或交互改进，以及执行、反馈或用户体验发生的变化；保留模型/工具选择到能力层即可。 |
| 评测 / badcase / 数据闭环 | 评测对象、定位的问题、推动的改进及复测结果，目标和实测分别写。 |
| 数据采集 / 质量 / 平台产品 | 本人形成的采标/质量标准、平台功能及采用范围，不能把需求数量当成已采集数量。 |
| 软硬件协同 / 客户交付 / 跨团队推进 | 实际协作方、解决的依赖和验收阶段；不追加机器人本体、VLA训练或量产经验。 |
| 商业化 / GTM / 开发者生态 | 已有产品使用、活跃、供给或开发者规模结果；不从JD要求推导个人营收或ROI。 |

## 全部失败或内容不足的实际读取

“内容不足”包括可到达但未取得 JD；不是全部技术性打不开。后续 API 成功不删除原页面失败记录。

| 实际 URL | 原始错误 / 观察 | 后续处理 |
|---|---|---|
| [来源](https://agirobot.jobs.feishu.cn/) | This page has no readable lines. | 网页正文不可读；职位可由官方公开JSON挽救 |
| [来源](https://agirobot.jobs.feishu.cn/socialrecruitment/?current=1&limit=10) | This page has no readable lines. | 目录不计JD |
| [来源](https://agirobot.jobs.feishu.cn/index/position/7583144810032384307/detail) | This page has no readable lines. | O01公开JSON成功 |
| [来源](https://agirobot.jobs.feishu.cn/socialrecruitment/position/7623604735216191785/detail) | This page has no readable lines. | 原S02，不新增 |
| [来源](https://agirobot.jobs.feishu.cn/socialrecruitment/position/7698932878412351798/detail) | Total lines: 0 | O02公开JSON成功 |
| [来源](https://agirobot.jobs.feishu.cn/campusrecruitment/position/7662290681059051795/detail) | Total lines: 0 | O03公开JSON成功 |
| [来源](https://agirobot.jobs.feishu.cn/campusrecruitment/position/7673472974649870635/detail) | Total lines: 0 | O04公开JSON成功 |
| [来源](https://agirobot.jobs.feishu.cn/internrecruitment/position/7559518673171106067/detail) | This page has no readable lines. | O07公开JSON成功 |
| [来源](https://app.mokahr.com/social-recruitment/yinhetongyong/165929) | (400) Redirect loop detected | 银河通用招聘官网链接，未取得新JD |
| [来源](https://www.unitree.com/position/1526099160422416384/) | 详情只返回导航与版权，没有目标岗位内容 | 研发项目经理职责在目录可见，要求未读，不计 |
| [来源](https://www.unitree.com/cn/position/1526099160422416384/) | HTTP读取只返回版权、备案页脚 | 未取得完整JD |
| [来源](https://www.fftai.cn/) | 重定向 https://fftai.com/ 后 This page has no readable lines. | JS壳 |
| [来源](https://fftai.com/) | This page has no readable lines. | 原始HTML可取但不含JD |
| [来源](https://fftai.com/fourier/join) | This page has no readable lines. | 从官网脚本定位到加入页；仍无JD正文 |
| [来源](https://hr.xiaomi.com/website/opportunities.html) | 共 — 个职位；未加载岗位 | 内容不完整，首页可达不等于已读JD |
| [来源](https://www.hotjob.cn/wt/Horizon/mobweb/v8/position/list) | (500) Redirected to https://wecruit.hotjob.cn/SU64819a4f2f9d2433ba8b043a/pb/custom.html?parentKey=section_0&pageType=customize_section_0 which is not accessible via this tool. (non-retryable error) | 未取得该目录正文 |
| [来源](https://dreame.zhiye.com/jobs) | This page has no readable lines. | 无JD正文 |
| [来源](https://x2-robot.jobs.feishu.cn/index/position/list?current=1&limit=10) | This page has no readable lines. | 目录不计JD；具体职位API可用 |
| [来源](https://x2-robot.jobs.feishu.cn/index/position/7673793445664409906/detail) | 原始HTML约13万字符，只有脚本与站点配置，没有岗位职责/要求 | O05公开JSON成功 |
| [来源](https://x2-robot.jobs.feishu.cn/index/position/7591767385671158035/detail) | (400) Timeout fetching | O08公开JSON成功 |
| [来源](https://career.limxdynamics.com/) | (502) Bad Gateway | 招聘根目录失败 |
| [来源](https://career.limxdynamics.com/index/position/7688265867825875226/detail) | Cache miss | O09公开JSON成功 |
| [来源](https://zhaopin.ubtrobot.com/home) | (400) Timeout fetching | O11从公开转载读到正文 |
| [来源](https://www.physicalintelligence.company/careers) | URL ... is not accessible via this tool. | 该路径失败，未宣称PI整个官网不可达 |
| [来源](https://jobs.ashbyhq.com/physicalintelligence/37e6a38f-71ff-4ff9-8151-ddbd20fcb6ae) | (404) Not Found | 旧S10，搜索索引仍有内容但原页未读，不新增 |
| [来源](https://jobs.ivyea.com/companies/agibot) | URL ... is not accessible via this tool. | 第三方公司页失败 |
| [来源](https://jobs.ivyea.com/companies/x2robot) | URL ... is not accessible via this tool. | 第三方公司页失败 |
| [来源](https://jobs.ivyea.com/companies/limxdynamics) | URL ... is not accessible via this tool. | 第三方公司页失败 |
| [来源](https://www.10100.com/article/101443743) | Cache miss | 2021乐聚旧PM线索；未读全文，不计 |
| [来源](https://x2-robot.jobs.feishu.cn/api/v1/search/job/posts?keyword=%E4%BA%A7%E5%93%81&limit=100&offset=0) | 返回通用猎头平台HTML，没有岗位清单JSON | 检索接口尝试未成功，不计 |
| [来源](https://x2-robot.jobs.feishu.cn/api/v1/job/posts?keyword=%E4%BA%A7%E5%93%81&limit=100&offset=0) | 返回通用猎头平台HTML，没有岗位清单JSON | 检索接口尝试未成功，不计 |

另一次本地 HTTP 试读受到当前执行环境 DNS 限制，返回 `URLError <urlopen error [Errno 8] nodename nor servname provided, or not known>`；之后改用可用联网 HTTP 读取工具，不把本地通道错误写成目标网站宕机。工具一次无效 click 参数没有对应网页，属于工具调用失败，未增加网站失败数。

## 不计数的边界

- Figure 的招聘介绍页、1X 的当前目录、宇树目录和小米岗位壳均不等于具体 PM JD 全文。
- 不采用 Figure 同名金融公司、physicaldaily 模板化岗位或无法读取的 2021 乐聚旧条目凑数。
- 本轮未取得傅利叶、乐聚、宇树新的独立 PM 全文，明确保留缺口。
- 星海图 3 岗、自变量物流方案和 GTM 实习是相邻职能，作为需求对照单列；没有用算法工程师增加 PM 数。

