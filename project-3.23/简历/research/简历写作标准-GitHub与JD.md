# 本简历写作标准：GitHub 样例与具身 PM JD

日期：2026-11-17。任务范围：先学习、再审改 Markdown 正文；全程未启动浏览器、未修改 HTML、用户定稿或现有来源表。

**最终记录 71 个独立岗位，62 份实际读到职责及任职要求，其中 55 份为产品/模型评测岗位、7 份为相邻岗位；另 9 份仅有部分正文或摘要，不计入全文数。** 原有 36 份摘要全部重读，28 份补齐正文；新增 35 个岗位，34 份补齐正文。55 份产品/评测岗位包含自动驾驶、商业化以及校招/实习对照，不能统称适合本人投递的现招机器人 PM。

**重新打开原 12 个 GitHub 资源，新增 8 个，共 20 个资源；逐段学习 PM 简历全文 6 份。** 其中 5 份是 Aced 发布方标为真实、获面试的匿名案例，1 份是署名公开履历；本轮没有向雇主独立验证任职、数字或录用。虚构 AI PM 样例、模板、工具和改写示范另列，不混入真实全文数量。

没有核验到具有可信录用背书的中文大厂 PM 全文；中文大厂工程师履历只用于观察中文表达。没有读到的页面不猜内容。招聘点评的可读正文与作者招聘官身份分别判断；G12 的身份未独立确认。

## 本简历采用的 10 条标准

| 编号 | 可直接执行的一句话标准 | 学习依据 |
|---|---|---|
| S1 | 普通要点通常写 45–75 个可见字、核心要点最多 100 字，短结果不凑字，每条只证明一件主要事情。 | R01–R06；本稿两页篇幅约束 |
| S2 | 用“本人动作＋具体产品或问题＋真实结果或交付状态”组织要点，避免仅写负责范围或系统处理规则。 | G01/G02/G03；R01–R06 |
| S3 | 技术写到产品机制、方案选择或评测方法这一层，出现连续的准入条件、字段、参数及异常分支就删减或概括为交付方案。 | G11/G15；R02–R06；JD01/O06 |
| S4 | 陌生项目保留一行约 25–45 字背景，只交代用户问题和本人范围，后文不重复完整架构。 | G05/G16；R03/R06；JD01/O01 |
| S5 | 个人优势保留 3–4 条，用目标岗位能力搭配最强既有事实，不写性格自评，也不把公司规模当个人成绩。 | R01–R06；G13/G19；JD需求矩阵 |
| S6 | 核心项目放 3–5 条、较早或次要项目放 2–3 条，优先展示与目标岗位相关的新证据。 | R01–R06；G03/G17；本稿保留项目结构 |
| S7 | 每条自然嵌入 1–2 个有经历支撑的 JD 关键词，让任务规划、评测、数据或交付跟着实际动作出现。 | G01/G15/G19；JD01/S08/O06/P09/P10 |
| S8 | 结果数字保留原对象与前后值，目标继续标“目标”，方案、实验设计、评审、试点与上线分别表述。 | G03/G12；JD01/O06；v24c来源表 |
| S9 | 缺少收益数据时写已完成的方案、规范、评测资产或复测状态，不把工具数、用例数和信号数包装成效果提升。 | G03/G12；JD22/O03/P09；v24c来源表 |
| S10 | 全稿只选定稿及来源表已支持的经历与数字，保留本人和团队边界，并以不增加正文长度的方式维持两页篇幅。 | G19；用户事实与篇幅约束；本轮核验 |

字数是针对这份中文两页简历的编辑标准，并非英文词数换算或招聘方统一门槛。“可见字”统计排除空白及 Markdown 标记，保留汉字、字母、数字和标点；短而有结果的条目无需补长。

所谓“写成 PRD”，是读者只能看到系统在条件 A/B 下怎么做，却看不到候选人的动作、交付与实际状态；保留一个产品机制或取舍有价值，把白名单准入条件、多人输入合并窗口和敏感记忆集合规则写全则超出简历所需。

## GitHub 资源与简历全文学习

### 原 12 项逐一重开


下表“成功”指实际取得仓库说明或指定正文，页面导航出现 Sign in 不等于正文要求登录；仓库成功也不代表它引用的每份附件成功。

| 编号 | 原资源 URL | 本次打开结果与实际已读位置 | 类型与学到的写法 | 适用限制 |
|---|---|---|---|---|
| G01 | [yangshun/tech-interview-handbook](https://github.com/yangshun/tech-interview-handbook) | 成功；另读[简历章节](https://www.techinterviewhandbook.org/resume/)工作经历、精选成果、关键词 | 指南：把职责范围、关键动作、结果写成要点，并按目标岗位筛选 | 软件工程方向，不能把工程师技能清单当 PM 成果 |
| G02 | [geekcompany/ResumeSample](https://github.com/geekcompany/ResumeSample) | 成功；另读[etc.md](https://github.com/geekcompany/ResumeSample/blob/master/etc.md)“好简历”“工作经历” | 中文指南：具体问题、个人措施、前后变化，让读者自行判断能力 | 示例明确虚构；不是 PM 本人成功履历 |
| G03 | [reactive-resume/reactive-resume](https://github.com/reactive-resume/reactive-resume) | 成功；另读[bullet writer](https://github.com/reactive-resume/reactive-resume/blob/main/plugins/reactive-resume/skills/resume-bullet-writer/SKILL.md) | 工具内指南：把条目分为保留、补强、挖结果、删除；缺数字可用范围或定性结果 | 不安装工具，不采用其额外追问流程阻塞已授权任务 |
| G04 | [resumejob/awesome-resume](https://github.com/resumejob/awesome-resume) | 成功；读 README Checklist、中英文经历例句 | 例句库：倒序、具体对象、动作与规模 | 多为开发者示范；不能据此认证真实录用 |
| G05 | [cassidoo/getting-a-gig](https://github.com/cassidoo/getting-a-gig) | 成功；读 Your Resume | 求职指南：删除无关经历，不让读者猜项目或技能含义 | 面向学生，其一页建议不直接约束本次社招两页稿 |
| G06 | [dyweb/awesome-resume-for-chinese](https://github.com/dyweb/awesome-resume-for-chinese) | 成功；读中文模板索引 | 模板目录：中文排版与可读性参考，继续沿索引找到署名中文履历 | 模板受欢迎不证明内容优秀 |
| G07 | [posquit0/Awesome-CV](https://github.com/posquit0/Awesome-CV) | 成功；读 README What/Preview/How to Use | 排版模板：经历、教育等信息有稳定结构 | 本任务不改排版，不计 PM 全文 |
| G08 | [xitanggg/open-resume](https://github.com/xitanggg/open-resume) | 成功；读 Builder、Parser 说明 | 构建工具：简历能解析、顺序清晰是交付检查之一 | 解析通过不能证明经历有说服力，不计 PM 全文 |
| G09 | [msmanek/getting-a-gig-pm-edition](https://github.com/msmanek/getting-a-gig-pm-edition) | 成功；读 The Role、Your Resume | PM 指南：说明对哪块产品负责，连接业务问题与技术落地 | 个人观点，非机器人招聘方官方标准 |
| G10 | [sahandsorouri/senior-pm-resume](https://github.com/sahandsorouri/senior-pm-resume) | 成功；[署名 .tex 全文](https://github.com/sahandsorouri/senior-pm-resume/blob/main/Sahand%20Sorouri%20-%20Senior%20Product%20Manager.tex)成功 | 真实个人公开自述；详见样例 R06 | 原始下载链接 Cache miss；不影响 .tex 页面全文读取；任职与指标未独立确认 |
| G11 | [landedjobs/ai-engineer-resume-examples](https://github.com/landedjobs/ai-engineer-resume-examples) | 成功；[AI PM 全文](https://github.com/landedjobs/ai-engineer-resume-examples/blob/main/examples/08-ai-product-manager.md)成功 | 教学样例：产品采用、质量门槛、成本与发布判断一起写，机制只保留一层 | 开头明确人物、公司与数字均虚构；不计真实简历 |
| G12 | [Sahme115/chatgpt-resume-before-after-examples](https://github.com/Sahme115/chatgpt-resume-before-after-examples) | 根 README 成功；Hero 2 改前改后可读；[单例文件](https://github.com/Sahme115/chatgpt-resume-before-after-examples/blob/main/examples/product/03-growth-pm.md)为 Cache miss | 点评：结果必须连到具体改动；无据百分比撤回为真实交付事实 | 改后是作者示范；未独立核验“招聘官”身份，不计真实个人全文 |

### 新增搜索的 8 项 GitHub 资源

实际检索组合包含 product manager + resume + experience、AI Product Manager + resume、robotics + product manager + resume，以及“产品经理 简历 腾讯 阿里 百度”等中文组合。

| 编号 | 新资源 | 打开结果与实际已读位置 | 内容及用途 | 真实性分类 |
|---|---|---|---|---|
| G13 | [Shehabov/pm-resume-builder-skill](https://github.com/Shehabov/pm-resume-builder-skill) | README 成功；examples 内署名 PDF 的 blob 与 raw 链接均 Cache miss | 读到结果句、公司背景、质量/成本/时延取舍、事实约束；未推测打不开的 PDF | 工具与写作指南；PDF 不计样例 |
| G14 | [Adron/resume](https://github.com/Adron/resume) | 根页 Cache miss；[resume-long.md](https://github.com/Adron/resume/blob/main/Resume/resume-long.md)成功 | 署名长履历含 Hasura Principal PM；PM 段 2 条长要点另列 2 项发布，职责/过程占比高，用作篇幅反例 | 真实个人自述；未选为本次“优秀 PM”标准样例 |
| G15 | [ombharatiya/AI-for-Product-Managers](https://github.com/ombharatiya/AI-for-Product-Managers) | 根页与[resume-portfolio.md](https://github.com/ombharatiya/AI-for-Product-Managers/blob/main/08-career/resume-portfolio.md)成功 | AI PM 指南与教学对比：机制、产品判断与质量约束相连，关键词放在实际动作里 | 教学写法，不是个人真实履历 |
| G16 | [cv-make-offer/open-resume-guide](https://github.com/cv-make-offer/open-resume-guide) | 根页与[PM 写法](https://github.com/cv-make-offer/open-resume-guide/blob/main/by-role/product-manager.md)成功 | 中文 PM 指南：业务背景、判断、推进、结果；PRD 是工作产物，不能替代成果 | 商业写作指南，未冒称大厂官方 |
| G17 | [Amory-ZDF/pm-resume-builder](https://github.com/Amory-ZDF/pm-resume-builder) | README 成功 | 中文结构建议：每段挑 2–4 个重点、标签对应能力、真实性检查 | 工具；其一页规则适用实习/短履历，不能覆盖用户要求 |
| G18 | [madhavUF/madhavUF](https://github.com/madhavUF/madhavUF) | 仓库页 Cache miss；[GitHub 个人主页](https://github.com/madhavUF)成功 | 实际读到 robotics/AI PM 自述和项目简介；机器人与 AI、现实运营放同一定位中 | 个人简介，不是规范的整份简历，不计全文样例 |
| G19 | [coinluu/resume-jd-optimizer-cn](https://github.com/coinluu/resume-jd-optimizer-cn) | README 成功；搜索已读 role taxonomy | 中文指南：区分直接经历、可迁移能力、真实缺口；关键词必须绑定项目 | 指南，不计真实履历 |
| G20 | [Ovilia/cv](https://github.com/Ovilia/cv) | README 与[中文正文 cn.html 源码](https://github.com/Ovilia/cv/blob/gh-pages/cn.html)成功 | 署名中文履历包含阿里、百度、Intel，项目写具体作品与用途，便于查看实际产物 | 工程师本人公开自述；不是 PM，且版本较早，不计 PM 样例 |

中文检索确实找到“中文大厂相关履历”和“中文 PM 指南”，但未核验到同时满足“中文 PM 全文、可信录用背书”的公开样本；不能把 G20 工程师履历、G16 指南或 G17 工具冒充中文大厂 PM 成功简历。

### 6 份 PM 简历全文的结构

R01–R05 全文位于[Aced / 原 Exponent PM 简历指南](https://www.tryexponent.com/blog/how-to-write-the-perfect-product-manager-resume)的“Read this Product Manager resume as text”。该入口本次成功重定向至 Aced，直接访问 Aced 的第一次请求则为 403，两个结果同时保留。发布方称匿名候选人获得过面试，本轮未独立验证；公司与学校按发布方原文匿名。以下只做短结构归纳与自行计数，不复制完整样例。

长度统计口径为**英文按空白分词**，不把英文词数直接当中文字数；按自然分组计算工作经历，另外标出项目。

| 样例 | 全文身份与定位 | 各段要点数 | 单条英文词数 | 背景 / 动作 / 结果结构 | 技术细节层次与短证据 |
|---|---|---|---|---|---|
| R01 | 平台匿名：咨询转 PM | 3 / 2 / 3 / 3 / 2 | 27–35 | 行业背景；访谈、流程改动；效率结果 | 方法层；“Reduced onboarding” |
| R02 | 平台匿名：云工程转技术 PM | 4 / 4 / 4 / 4 / 3 | 12–18 | 岗位领域；集成、发布；成本与采用结果 | 集成层；“no-code installation wizard” |
| R03 | 平台匿名：支付转 B2B PM | 4 / 4 | 16–24 | 公司阶段；调研、路线图；增长结果 | API/分析方法层；“developer API activation” |
| R04 | 平台匿名：生物科技数据 PM | 工作 4 / 3 / 3；项目 2 / 1 | 25–30 | 用户群；需求与部署；采用变化 | 方案层；“tool adoption rate” |
| R05 | 平台匿名：AI PM 实习生 | 工作 3 / 3 / 3；项目 1 / 1 | 23–32 | 用户问题；研究、交付；效率结果 | 模型集成层；“manual creation time” |
| R06 | [Sahand Sorouri 署名 PM 全文](https://github.com/sahandsorouri/senior-pm-resume/blob/main/Sahand%20Sorouri%20-%20Senior%20Product%20Manager.tex) | 工作 4 / 3 / 4 / 3；独立项目 3 | 清理 TeX 后约 13–24 | 公司规模单列背景，个人要点写上线、优化与前后变化 | 保留 ML/CRM 等机制，不列字段与异常分支；“without impacting service-level standards” |

R06 区分“公司背景规模”与“本人结果”的方式值得采用；其中“战略目标提升”仍含糊，所以只借结构，不把每句话都当优质范本。R01–R05 个别要点也只有过程或过多指标，不能把入选和获面试等同于每句都最佳。

结构统计另见 [v25-优秀简历结构统计.json](v25-优秀简历结构统计.json)：R01 13 条经历要点，R02 19 条，R03 8 条，R04 工作与项目共 13 条，R05 工作与项目共 11 条；这里只保留计数和方法，不保存外部简历全文。

补充读到的[IGotAnOffer 实例点评](https://igotanoffer.com/blogs/product-manager/product-manager-resume)强调精选少量强成果、近期经历多写、较早经历少写；正文可读，但 Nicolas 的整页简历图片返回 Unsupported content-type，故其图片不计“已读全文”。



## JD 检索路径与指定官网覆盖

已尝试 BOSS、猎聘、拉勾、脉脉，并逐一核验公司招聘来源；平台和官网由不同代理并行读取，受限页面再用公开接口或转载补足。HTTP 公开职位接口属于正文读取，不启用浏览器、不使用登录信息；原网页失败与随后 API 成功均保留。

| 平台入口/岗位 | URL | 实际结果 |
|---|---|---|
| BOSS首页 | [打开来源](https://www.zhipin.com/) | 成功，公开首页可读；独立职位并不因此成功 |
| BOSS加速进化原岗 | [打开来源](https://m.zhipin.com/job_detail/8fcdea8a47ae700a0nVy3dS0FFJW.html) | 失败：请稍候，重定向security.html安全验证 |
| BOSS小米原岗 | [打开来源](https://www.zhipin.com/job_detail/9af2f86461d6bb7e0nJ50tm-F1NS.html) | 失败：is not accessible via this tool |
| 猎聘首页 | [打开来源](https://www.liepin.com/) | 成功，公开首页 |
| 猎聘追觅原岗 | [打开来源](https://www.liepin.com/job/1981438589.shtml) | 失败于读取原JD：该职位已暂停招聘；推荐职位未拼接 |
| 拉勾首页 | [打开来源](https://www.lagou.com/) | 失败：为了更好的访问体验，请进行验证；CF_APP_WAF |
| 拉勾具身PM搜索 | [打开来源](https://www.lagou.com/wn/jobs?kd=%E5%85%B7%E8%BA%AB%E6%99%BA%E8%83%BD%E4%BA%A7%E5%93%81%E7%BB%8F%E7%90%86) | 失败：is not accessible via this tool |
| 脉脉首页 | [打开来源](https://maimai.cn/) | 成功，公开首页 |
| 脉脉/jobs尝试 | [打开来源](https://maimai.cn/jobs) | 失败：is not accessible via this tool |
| 脉脉找工作真实入口 | [打开来源](https://maimai.cn/n/platform/homepage/jobs) | 失败：Cache miss |
| 脉脉高薪职位列表 | [打开来源](https://maimai.cn/n/platform/job-list) | 成功，公开列表及部分独立正文可读；未冒称全部要登录 |
| 脉脉匿名Agent岗 | [打开来源](https://maimai.cn/n/job/geo/--Zc59Xsrok0wmwt1WnkgQ) | 成功，职责+要求正文；实际文生图/视频评测Agent，雇主匿名，排除具身JD计数 |
| 猎聘熊蜂物理AI线索 | [打开来源](https://www.liepin.com/job/1984039907.shtml) | 失败：Cache miss，不计数 |

### 指定 16 家公司官网逐一打开

| 公司 | 实际来源 | 打开结果 | 处理 |
|---|---|---|---|
| 智元 | [原入口](https://agirobot.jobs.feishu.cn/) | 网页0行；具体职位官方公开JSON可读 | O01/O02/O03/O04/O07，原S01等不重计 |
| 银河通用 | [原入口](https://www.galbot.com/contact/) | 官网可读且找到招聘链接；Moka招聘入口Redirect loop detected | 未新增岗位，不从公司信息猜JD |
| 宇树 | [原入口](https://www.unitree.com/position/) | 招聘目录可读；研发项目经理详情只剩导航页/页脚，未读要求 | 不计新增JD |
| 星海图 | [原入口](https://galaxea-ai.com/en/jobs.html) | 成功，官网职责和任职要求均可读 | 新增O12/O13/O14；均是相邻岗位，未冒称PM |
| 傅利叶 | [原入口](https://fftai.com/fourier/join) | 官网加入页面0行；原始HTML为JS壳 | 未新增，不采用physicaldaily模板化岗位 |
| 小米 | [原入口](https://hr.xiaomi.com/website/opportunities.html) | 页面可读但共—个职位，未加载岗位正文 | 未新增 |
| 地平线 | [原入口](https://www.hotjob.cn/wt/Horizon/mobweb/v8/position/list) | 500；重定向目标不可访问，non-retryable error | 原地瓜机器人两岗由既有JD代理核验，不新增 |
| 字节Seed | [原入口](https://seed.bytedance.com/zh/career) | 官网招聘目录可读；具体具身评测岗位公开JSON成功 | 新增O06；原数据引擎岗不重计 |
| 追觅 | [原入口](https://dreame.zhiye.com/jobs) | 0行，无可读正文 | 未把其他智能硬件岗位当具身JD |
| 自变量 | [原入口](https://x2-robot.jobs.feishu.cn/index/position/list?current=1&limit=10) | 目录0行；具体职位官方公开JSON可读 | 新增O05/O08；转载O10/O15；原Agent/行业两岗不重计 |
| 逐际动力 | [原入口](https://career.limxdynamics.com/) | 根目录502；GTM页面Cache miss，公开JSON成功 | 新增O09商业化对照；原Agent/平台岗不重计 |
| 乐聚 | [原入口](https://www.lejurobot.com/zh) | 官网可读；未定位到独立官方产品岗正文 | 未新增；2021旧转载打开Cache miss |
| 优必选 | [原入口](https://zhaopin.ubtrobot.com/home) | 招聘首页Timeout fetching；公开转载具体产品岗全文可读 | 新增O11校招；与原人形产品经理不同 |
| Figure | [原入口](https://www.figure.ai/careers) | 官网介绍可读；See All Open Roles仍指回本页，未读具体PM正文 | 未新增；排除figure.com金融同名公司 |
| 1X | [原入口](https://www.1x.tech/careers) | 官方当前职位目录可读；未见可新计的PM全文 | 既有两岗不重计；不把Robot Operations Manager PM中的PM误作产品经理 |
| PI / Physical Intelligence | [原入口](https://www.physicalintelligence.company/careers) | 该路径工具不可访问；原PM Ashby页404 | 原S10不重计，也不从历史搜索索引补全现页内容 |

## 更新后的岗位需求矩阵

以下以 **55 份产品/模型评测正文**为主分母，相邻 7 岗另列扩展列；每个岗位每个能力最多计 1 次，9 份不完整材料不进入分母。频次是本次定向便利样本的描述，不能推成全国市场比例，也没有 HR 眼动或 ATS 权重数据；“HR 关键词”是从 JD 归纳的可识别表达。

| 能力 | 产品/评测正文 55 份 | 扩展正文 62 份 | 可扫描关键词 | 本简历必须用什么事实证明 |
|---|---:|---:|---|---|
| C02 产品规划与落地 | 55/55 | 62/62 | 产品定义、PRD、路线图、0到1 | 写本人负责的产品范围、形成的方案和交付阶段；字节的PRD/规划与理想已发布产品分开。 |
| C03 跨团队推进 | 55/55 | 62/62 | 跨团队、算法/软硬件协同、里程碑 | 写上汽、赛力斯、智驾伙伴之间落实的需求和责任边界，不能把对接写成全量量产成功。 |
| C01 场景与用户需求 | 51/55 | 56/62 | 用户调研、场景定义、需求优先级 | 用调研对象、场景与产品选择证明，例如理想32位深访/1500份问卷、司机停车场景定义；不能只写懂用户。 |
| C07 评测与问题闭环 | 38/55 | 44/62 | 评测体系、Benchmark、badcase、准出 | 同时写评测对象、本人改进与复测证据；59条示例中30条实车通过是结果，113条是设计用例。 |
| C09 系统与软硬件边界 | 38/55 | 41/62 | 端云协同、感知/决策/执行、系统约束 | 用车端/云端及座舱/智驾的交接范围证明；不新增ROS、传感器研发或机器人本体经历。 |
| C13 数据分析与实验 | 36/55 | 42/62 | 指标分析、实验、失败归因 | 用138条分诊、61%类别占比、四组实验设计和版本评测证明；实验设计不写成全部执行成功。 |
| C12 客户与商业交付 | 34/55 | 39/62 | 试点、客户交付、量产、ROI、GTM | 用i8/OTA发布、国网6省试点和既有平台使用数据证明；不从JD补造营收、ROI或机器人量产。 |
| C08 人机交互 | 29/55 | 30/62 | 多模态交互、语音交互、用户体验 | 写多人免唤醒、连续对话和视觉停车的交互方案；350ms/95%仍为验收目标。 |
| C04 模型与多模态 | 28/55 | 30/62 | LLM、VLM、多模态、模型产品化 | 用自然语言—视觉定位—智驾执行及训练评测经历证明；无VLA、世界模型训练事实，不能补成技能。 |
| C14 平台与复用 | 28/55 | 33/62 | 数据平台、开发者工具、API/MCP、多租户 | 用理想低代码/MCP、百度插件生态以及字节多项目治理规划证明；规划平台不等于已上线。 |
| C11 可靠性与安全 | 25/55 | 28/62 | 安全边界、异常处理、隐私、权限 | 写停车异常设计、执行前复核与记忆隐私方案；不写零事故或全链路安全验收完成。 |
| C06 数据与训练闭环 | 24/55 | 28/62 | 采集规范、标注、数据治理、SFT | 用国网12万QA/5万指令、5轮SFT、百度质检证明；司机22对象/110表达是规范，不是采集完成量。 |
| C10 仿真与真机验证 | 11/55 | 12/62 | 仿真、Sim2Real、测试覆盖 | 只有模拟器联动调试的规划，不能升级为已经建设机器人仿真平台、完成Sim2Real或掌握Isaac Sim。 |
| C15 英语与国际协作 | 5/55 | 7/62 | 英语、海外客户、跨时区 | 定稿与来源表无语言等级或海外交付事实，本轮不增加；不能因阅读英文JD就填写精通英语。 |
| C05 任务规划与Agent编排 | 4/55 | 6/62 | 任务拆解、工具调用、长程任务、执行反馈 | 用Planner四类任务、23项调度范围和真实复测证明；动作依赖只保留产品方法层。 |

直接最贴合的岗位是[逐际 Agent 产品](https://career.limxdynamics.com/api/v1/job/posts/7677884434582948106)、[Seed 具身评测](https://jobs.bytedance.com/api/v1/job/posts/7698644813525600565)、[思必驰具身语音](https://www.liepin.com/job/1982715841.shtml)及[乐享模型评测](https://www.liepin.com/job/1982539987.shtml)。需求高频不等于每条要点都要塞满同一组词；Planner 任务规划是定向差异点，不是所有具身 PM 的统一核心职责。

### 两项影响岗位解读的纠错

智元觅蜂产品经理某转载混入算法岗要求，本轮以[官方职责与要求](https://agirobot.jobs.feishu.cn/api/v1/job/posts/7662290681059051795)为准；Seed 评测的第三方旧标题与[官方当前标题](https://jobs.bytedance.com/api/v1/job/posts/7698644813525600565)按同一职位 ID 去重，不能算两份。

## 71 个岗位的逐项学习清单

F＝职责及任职要求已读；P＝部分或摘要，不计全文；相邻岗位明确标注。原岗位 ID 沿用旧报告，P01–P11、O01–O15、U01–U09 为新增。正文状态是阅读证据，不能证明持续在招。

| ID | 公司 / 岗位 | 样本层与正文状态 | 原页 / 已读正文来源 | 实际已读内容或限制 |
|---|---|---|---|---|
| JD01 | 逐际动力 / 具身智能产品经理（具身 Agent 方向） | 产品/评测；F 完整 | [原页](https://career.limxdynamics.com/index/position/7677884434582948106/detail)；[正文](https://career.limxdynamics.com/api/v1/job/posts/7677884434582948106) | 定义任务输入、上下文、计划生成、工具调用、执行反馈、异常恢复和多轮机制；设计打断续说、响应时机、语音与动作协同；以任务完成率、调用成功率、时延和恢复等评测推动问题归因与迭代。 要求：理解语音识别/合成、LLM 及多模态模型边界；具备评测集、主客观指标、人评质控或数据闭环经验；能把生成效果拆成具体场景、指标和需求，并推进复杂产品落地。 加分：相关计算机/AI/人机交互专业；Agent、AI 助手或模型评测产品经验。 |
| JD02 | 智元机器人 / 具身模型产品经理 | 产品/评测；F 完整 | [原页](https://agirobot.jobs.feishu.cn/socialrecruitment/position/7703783281803839794/detail)；[正文](https://agirobot.jobs.feishu.cn/api/v1/job/posts/7703783281803839794) | 把预训练、后训练、评测、部署与 API 组织为模型产品；定义能力、版本和数据验收；规划端云推理、私有化、API/SDK；用成功率、时延、成本和稳定性跟踪效果。 要求：技术相关背景及模型/算法平台/开发者产品经验；理解训练、评测、部署；能分析需求和数据、管理风险、读文档并调用 API。 加分：具身、VLA/WAM、多模态或机器人落地；模型平台、推理服务或 API/SDK 从 0 到 1。 |
| JD03 | 光轮智能 / 具身智能产品经理（EgoSuite 数据采集解决方案）（原页职称：具身智能产品经理） | 产品/评测；F 完整 | [原页](https://lightwheel.jobs.feishu.cn/index/position/7621379194652363034/detail)；[正文](https://lightwheel.jobs.feishu.cn/api/v1/job/posts/7621379194652363034) | 定义第一视角采集设备与多模态同步标准；把人类操作视频转成可训练数据；建设清洗、脱敏、标注及质检流水线，结合模型训练/评测反馈改进数据；规划跨场景采集并连接仿真闭环。 要求：研究生及以上，视觉/AI/机器人/数据等专业；理解相机、深度、IMU 与三维重建等技术；熟悉数据全生命周期、云架构；能用英语并统筹硬件、算法、运营。 加分：自动驾驶数据闭环、VR/AR 或大规模数据集经验；主流数据集建设、软硬结合产品落地、相关论文或开源贡献。 |
| JD04 | 银河通用 / 数据 APP 产品经理 | 产品/评测；F 完整 | [原页](https://app.mokahr.com/social-recruitment/yinhetongyong/165929)；[正文](https://jinliqiuzhi.com/jobs/936820) | 规划头环第一视角、UMI 夹爪采集 APP；打通任务下发、设备、续传、上传及云端质检/标注；定义有效时长、合格率、上传成功率和采集耗时；前置发现遮挡、抖动、丢帧及同步偏差。 要求：本科、3 年以上 PM；做过 APP 从 0 到 1 或核心迭代；理解采集、清洗、标注、训练；懂相机、IMU、深度与连接/编码基础；能深入采集现场并推进产研协作。 加分：软硬件结合经验；计算机、自动化、电子信息或工业设计等专业优先。 |
| JD05 | 汇洲智能 / 具身智能数据产品经理 | 产品/评测；F 完整 | [原页](https://www.hzitg.com/recruit) | 制定真机采集与仿真合成数据产品路线及商业化路径；定义采集标准、数据规格和交付规范；建设质量验收以及真机—仿真—训练—验证闭环；协调客户与研发迭代。 要求：本科及以上；2 年以上 AI 数据或机器人产品经验；熟悉具身智能产业链，具备需求拆解与协同能力。 加分：未单列。 |
| JD06 | 戴盟机器人 / 高级产品经理（遥操作产品） | 产品/评测；F 完整 | [原页](https://dmrobot.zhiye.com/job/detail?jobAdId=0e3981d1-873a-4b6e-bd08-f551739d1c83)；[正文](https://jobs.ivyea.com/jobs/20216) | 规划遥操作主端、控制软件和本体适配；定义延迟、运动映射、力/触觉反馈和数据同步；建设标准接口/SDK；用采集效率、成功率、疲劳度改进体验，并推进 POC 与交付。 要求：本科及以上；有完整产品周期；理解机器人运动学、控制、传感器、通信及 ROS/ROS2；能做 B 端协同、跨团队推进，英语可工作。 加分：遥操作、手术机器人、外骨骼、VR/力反馈经验；机械臂/灵巧手/人形产品；Isaac Sim/MuJoCo 或相关数据使用；新品类 0 到 1。 |
| JD07 | 星尘智能 / 解决方案产品经理 | 产品/评测；F 完整 | [原页](https://app.mokahr.com/social-recruitment/astribot/144861)；[正文](https://jinliqiuzhi.com/jobs/735988) | 调研客户场景并排优先级；整合自研、供应商软硬件与服务，评估可行性、成本和风险；输出 PRD、联调和验收；协调研发、销售、交付及客户预期。 要求：5 年以上 B 端产品/方案经历；有从客户需求到产品落地的独立案例；能写 PRD、推进系统集成，在无直接管理权时推动多方协作。 加分：机器人/硬件/IoT/系统集成；供应商与生态管理；技术背景；创业或 0 到 1。 |
| JD08 | Apptronik / Staff Product Manager, Applied AI | 产品/评测；F 完整 | [原页](https://job-boards.greenhouse.io/apptronik/jobs/6120107004) | 制定物理 AI 模型路线及发布；将客户任务转成模型能力和准出要求；推进基础模型适配/微调；联合数据与评测团队定义 benchmark、真机验证和采集策略，平衡能力、稳定性及安全。 要求：7 年以上 PM，同时另列 10 年以上产品/工程；理解模仿/强化学习；有模型集成、适配或微调实践；理解实体设备运行大模型的约束，能用数据决策并跨团队沟通。 加分：机器人/自动驾驶；仿真；基础模型训练/微调；遥操、标注；工业客户与机器人安全标准。 |
| JD09 | Apptronik / Senior Product Manager - Human Robot Interaction | 产品/评测；F 完整 | [原页](https://job-boards.greenhouse.io/apptronik/jobs/6017584004) | 规划机器人屏幕、对话和多模态交互；用动作、视线和信号表达意图，让行为可预测；按权限、用户熟练度、环境与任务适配；部署前通过用户研究验证，定义需求及价值优先级。 要求：官网当前 4 年以上 PM；理解交互/对话界面并有 HRI 经验；能追踪性能、用数据决策，把技术信息转成业务影响。 加分：自主机器人/自动驾驶；用仿真改进体验；终端与开发工具 UX；工业客户；机器人和功能安全标准。 |
| JD10 | Apptronik / Senior Product Manager - Simulation | 产品/评测；F 完整 | [原页](https://job-boards.greenhouse.io/apptronik/jobs/6007496004) | 制定仿真平台路线，为感知、自主和导航还原客户环境；支持部署前验证；让开发者容易创建、修改和分析测试场景；按商业价值、可行性及客户需求排优先级。 要求：当前官网要求 4 年以上产品或工程；有仿真、仿真在环或开发工具经历；理解物理引擎、仿真、渲染或数字孪生；具备分析和跨团队表达能力。 加分：机器人/自动驾驶；Unity、Isaac、MuJoCo；感知/自主/导航合成数据；开发工具 UX。 |
| JD11 | 1X / Lead Technical Product Manager - Data | 产品/评测；F 完整 | [原页](https://www.linkedin.com/jobs/view/lead-technical-product-manager-data-at-1x-4433392796)；[正文](https://jobs.type1ventures.com/companies/halodi-robotics/jobs/84350000-lead-technical-product-manager-data) | 负责世界模型团队的数据策略；改进遥操作、机器人机队及仿真数据的质量/覆盖；定义标注质量；建设家庭场景真机评测；按研究团队的模型短板决定采集优先级。 要求：3–5 年 PM，交付过数据/ML/基础设施产品；能定义指标并改善质量，与研究、工程深度协作；理解数据质量和分布如何影响模型；技术本科或等效实践为理想条件。 加分：机器人、世界模型或基础模型训练；遥操作、仿真及规模采集；标注运营和数据 benchmark。 |
| JD12 | 1X / Senior/Staff Technical Product Manager, Platform | 产品/评测；P 不完整 | [原页](https://jobs.ashbyhq.com/1x/6bfaa0a0-01b6-4b44-9984-6791a7744adf) | 仅重读原研究摘要；统筹机器人开发平台从需求到发布；对齐固件、应用、AI 软件和硬件计划；管理多团队依赖、里程碑、风险及阻塞。 要求：5 年以上软件工程或技术项目管理；推动过至少一个多团队软件项目从 0 到 1；能维护整体排期；计算机/工程本科或等效实践。 加分：硬件开发经历、项目管理工具经验；可见索引未显示其他项。 |
| JD13 | 地瓜机器人（地平线招聘体系） / 【地瓜机器人】具身业务产品经理（软硬件方向） | 产品/评测；P 不完整 | [原页](https://wecruit.hotjob.cn/SU6409ef49bef57c635fd390a6/pb/posDetail.html?postId=6ae30673f0cfabf2b40dce33&postType=society) | 仅重读原研究摘要；面向机器人量产定义计算平台与配套软件规格、版本和需求；抽象客户系统共性并排优先级；协同硬件、软件、测试改进稳定性和交付质量。 要求：相关工科本科；2 年以上机器人、嵌入式或智能硬件经验；懂机器人架构和软硬件配合，至少有一个方向的实际工程经验；能做需求定义和交付。 加分：机器人试产与量产经历。 |
| JD14 | 石头科技 / 软件产品经理（具身机器人）（原页职称：软件产品经理） | 产品/评测；P 不完整 | [原页](https://roborock.zhiye.com/social/jobs?LocId=%5B%7B%22id%22%3A%221100%22%2C%22label%22%3A%22%E5%8C%97%E4%BA%AC%E5%B8%82%22%7D%5D) | 仅重读原研究摘要；负责感知、导航、人机交互等软件需求与全生命周期；调研用户和竞品，输出功能清单及 PRD；按里程碑交付，并监测上市后的表现以改善体验。 要求：3 年以上相关经历；正文明确写 985、本科及以上；具备用户/竞品/行业/数据分析能力、需求洞察和技术理解力。 加分：可见部分未单列，不补推断。 |
| JD15 | 光轮智能 / Customer Product Manager | 产品/评测；F 完整 | [原页](https://lightwheel.jobs.feishu.cn/index/position/7660490800660973833/detail)；[正文](https://lightwheel.jobs.feishu.cn/api/v1/job/posts/7660490800660973833) | 澄清客户需求并形成产品方案、实施计划及验收标准；从售前到交付、售后推进项目；管理需求变更，沉淀行业场景、标准方案与问题库。 要求：具备客户访谈、方案表达、独立文档能力；熟悉企业级项目流程并能统筹销售、产研、运营和交付；愿意理解 AI、机器人及数据等复杂产品。 加分：AI/机器人/自动驾驶/数据服务经验；大客户、海外客户或交付管理经历；较好的英语。 |
| JD16 | 智平方 / 机器人应用产品经理 | 产品/评测；F 完整 | [原页](https://ggfw.hrss.gd.gov.cn/recruitment/internet/main/#/positionDetail?bbb911=1806240159253716993&bcb009=2095836339985383425)；[正文](https://www.glc.edu.cn/jyw/info/1030/69701.htm) | 从用户访谈和行为数据确定优先级；调研服务/工业场景，输出 PRD、原型及软硬件边界；与结构和电子团队定义传感器、运控规格，权衡性能与成本并按节点交付。 要求：理工科本科及以上；理解运控、传感器融合和人机交互；熟悉原型、项目管理工具；能做场景需求分析和系统级问题定位。 加分：相关理工科专业优先；未单列其他项。 |
| JD17 | 珞石机器人 / 产品经理（具身智能机器人）（原页职称：产品经理） | 产品/评测；F 完整 | [原页](https://career.hebut.edu.cn/home/correcruit/content/id/81308.html) | 负责具身机器人市场洞察、产品定义、上市与商业成功；分析场景、竞品和效益；定义软硬件规格并推进开发；制作销售工具与产品上市材料。 要求：正文硕士及以上，机器人/计算机/自动化等专业；熟悉产品开发及版本管理，具备需求分析、项目管理、文档和商业意识。 加分：移动、复合、轮式双臂或人形机器人产品开发经验。 |
| JD18 | 凡拓数创 / 具身智能产品经理 | 产品/评测；F 完整 | [原页](https://gdc.stu.edu.cn/Job/27173) | 制定路线图并负责需求、验证、研发到交付；从客户现场痛点形成场景方案；分析机器人运行效果并推进优化；协同研发、销售及售前探索行业应用。 要求：正文要求博士，机器人/AI/控制等相关专业优先；熟悉机器人软硬件及具身技术；有 To B 需求策划、客户沟通、项目推进能力。 加分：相关专业优先；未单列其他加分项。 |
| JD19 | 启元机器人 / 交互产品经理 | 产品/评测；F 完整 | [原页](https://primebot.jobs.feishu.cn/campusrecruitment/position/7706434706078648619/detail)；[正文](https://primebot.jobs.feishu.cn/api/v1/job/posts/7706434706078648619) | 设计家庭机器人语音、表情、动作、空间感知和主动交互；用交互流程、状态机与原型表达方案；在 PRD 中定义边界、异常与验收；开展可用性测试和体验指标迭代。 要求：本科及以上；能梳理复杂状态流转、理解用户体验；熟悉原型工具与 PRD；理解 LLM、语音及 VLM 的应用边界。 加分：家庭/陪伴机器人或智能音箱经验；端到端语音/VLM 实践；用 AIGC、Agent 编排快速制作可体验 Demo。 |
| JD20 | 思谋科技 / 产品经理（具身智能方向） | 产品/评测；F 完整 | [原页](https://www.career.zju.edu.cn/jyxt/sczp/zpztgl/ckZpgwXq.zf?zpxxbh=5E6AA3B5DA2BC78EE0653A68DD0E9B18) | 调研教育/工业机器人的行业、竞品与用户需求；参与 PRD 和原型；协同研发/设计跟进开发及功能测试；进入实验室或工厂收集反馈，改善体验。 要求：本科及以上；逻辑清晰，具备审美、表达、文档及同理心，能把复杂技术讲清楚并主动学习。 加分：机械/自动化/电子等理工科背景；在校创业、项目负责人经历，或持续关注机器人与 AI。 |
| JD21 | 星尘智能 / 软件产品经理 | 产品/评测；F 完整 | [原页](https://app.mokahr.com/campus-recruitment/astribot/144862)；[正文](https://jinliqiuzhi.com/jobs/692178) | 参与机器人 OS、云后台、遥操、采集与开发者套件规划；把场景任务转为功能和交互；调研、竞品及体验评估，并协同算法、工程、设计、测试迭代。 要求：理工科本科；理解架构、数据流与交互流程；能在信息不足时判断和推进，具备体验、表达及协作能力。 加分：软件/AI/工具产品作品或实习；编程和数据分析；持续研究具身、Agent 或人机交互。 |
| JD22 | 智元机器人 / 具身数据产品经理—觅蜂子公司 | 产品/评测；F 完整 | [原页](https://agirobot.jobs.feishu.cn/campusrecruitment/position/7673479382657665334/detail)；[正文](https://agirobot.jobs.feishu.cn/api/v1/job/posts/7673479382657665334) | 参与采集、标注、挖掘、分析、存储与复用平台；调研、原型及 PRD；探索 LLM/RAG 等技术改善数据服务；跨团队推进上线与用户反馈闭环。 要求：应届本科、工科优先，跨专业有项目亦可；理解数据处理、仓库及 AI 典型应用；能结构化拆问题，以原型或 AI 编程验证方案。 加分：SQL/Python 分析；AI 项目；机器人课程、竞赛或研究；产品实习与作品。 |
| JD23 | 优必选 / 人形产品经理（J18639） | 产品/评测；F 完整 | [原页](https://ubtrobot.zhiye.com/campus/detail?jobAdId=3969793c-141b-4674-858b-6c35bc972238)；[正文](https://jinliqiuzhi.com/jobs/83955) | 调研企业/个人用户及竞品；定义功能、交互、参数、PRD 与路线；协调算法、软件、硬件和测试交付；组织验收、场景测试和运营反馈，沉淀手册及方案支持交付。 要求：硕士及以上、产品/市场/计算机/机器人等相关专业；具备需求、文档、方案能力，能跨部门推进，兼有同理心与商业思维。 加分：了解工业/服务机器人；互联网或硬件产品实习、策划、竞赛及项目统筹。 |
| S01 | 智元机器人 / 具身智能产品经理 | 产品/评测；F 完整 | [原页](https://agirobot.jobs.feishu.cn/socialrecruitment/position/7680907313238100230/detail)；[正文](https://agirobot.jobs.feishu.cn/api/v1/job/posts/7680907313238100230) | 在酒店、零售、4S 店和家庭识别作业；将业务转成机器人任务、能力及验收；建设采集、超视距遥操和训练部署工具；定义交互、状态、异常和安全规则，开展真场景评测。 要求：3–5 年 PM；能独立调研、设计、推进和验收；理解 VLA、操作、数采、遥操或训练推理至少一项；能做场景抽象和软硬协同。 加分：机器人、自动驾驶、智能硬件、AI 或复杂软硬系统经验优先。 |
| S02 | 智元机器人 / 具身数据平台产品经理 | 产品/评测；F 完整 | [原页](https://agirobot.jobs.feishu.cn/socialrecruitment/position/7623604735216191785/detail)；[正文](https://agirobot.jobs.feishu.cn/api/v1/job/posts/7623604735216191785) | 建设采集、标注、挖掘、分析、存储复用平台；设计接入、质检和分析；探索从数据 SaaS 到 Agent，支持理解需求、任务调度、自主排查和主动推送。 要求：本科、5 年以上数据 PM；做过采集/标注/分析/中台；懂数仓、LLM 微调/提示设计和 RAG/NLP；能写 PRD、原型并推动多团队交付。 加分：自动驾驶/大模型业务；AI 数据平台或 Agent 项目。 |
| S03 | 自变量机器人 / Agent 产品经理（机器人方向） | 产品/评测；F 完整 | [原页](https://x2-robot.jobs.feishu.cn/index/position/7618147728040462611/detail)；[正文](https://x2-robot.jobs.feishu.cn/api/v1/job/posts/7618147728040462611) | 定义真机与仿真共用 Agent 的范围、架构、路线；设计低时延任务调度、技能接入及多模态处理；支持仿真训练与能力预演，做跨环境验证和风险管理。 要求：本科；3 年 AI PM、至少 2 年 Agent 落地；能梳理复杂模块、适配关系与系统方案，协调模型、仿真、硬件、生态和测试。 加分：研发背景；大厂 Agent 项目；通用/代码/虚拟世界 Agent；系统重构；跨虚实环境落地。 |
| S04 | 自变量机器人 / 行业产品经理 | 产品/评测；F 完整 | [原页](https://x2-robot.jobs.feishu.cn/index/position/7592928221445065023/detail)；[正文](https://x2-robot.jobs.feishu.cn/api/v1/job/posts/7592928221445065023) | 把客户定制需求拆成配置、适配和部署；统筹研发、生产、测试、安装调试；主导预验收/终验收，沉淀手册、报告及共性需求。 要求：本科；3 年产品交付/项目，至少 1 年机器人、智能装备或工业自动化交付；理解运控、导航、传感器、ROS；能识别风险并可出差。 加分：完整机器人交付案例；PMP/PRINCE2。 |
| S05 | 智元机器人 / 云平台产品经理 | 产品/评测；F 完整 | [原页](https://agirobot.jobs.feishu.cn/socialrecruitment/position/7683405483365976326/detail)；[正文](https://agirobot.jobs.feishu.cn/api/v1/job/posts/7683405483365976326) | 规划 GPU 开发、训练和文件平台；贯通资源申请到训练产物；定义权限、配额、审批和实验追踪；用任务成功率、使用率及资源效率迭代。 要求：本科；3 年 To B、至少 1 年相关平台；懂算力、存储、网络及训练；能定义状态、异常、验收并读接口文档；协调多团队取舍。 加分：GPU 云、AI 训练平台、MLflow；机器人研发工具或面向算法工程师产品。 |
| S06 | 逐际动力 / 具身智能产品经理（具身系统平台方向） | 产品/评测；F 完整 | [原页](https://career.limxdynamics.com/index/m/position/7677885208746723603/detail)；[正文](https://career.limxdynamics.com/api/v1/job/posts/7677885208746723603) | 理清模型、Agent、技能、配置、数据与环境的关系；规划环境管理、配置校验、权限、灰度、回滚；建立成功率、时延、资源、稳定性和版本回归评测。 要求：本科；4 年以上平台/AI/开发工具/复杂 B 端；有系统抽象、模型平台理解和数据分析能力；能平衡效果、时延、稳定性、成本及交付。 加分：计算机、软件工程、信息系统相关专业优先；其余未单列。 |
| S07 | 加速进化 / AI 产品经理 | 产品/评测；P 不完整 | [原页](https://m.zhipin.com/job_detail/8fcdea8a47ae700a0nVy3dS0FFJW.html) | 仅重读原研究摘要；可见部分涉及 AI 编程软件功能、机器人 AI Agent、模型中台、SDK 与开放平台。 要求：仅看到本科及 3–5 年元信息；详细要求未读到。 加分：未读到。 |
| S08 | 字节跳动 Seed / 具身数据引擎产品经理 - Seed Model | 产品/评测；F 完整 | [原页](https://jobs.bytedance.com/experienced/position/7657800968400488709/detail)；[正文](https://jobs.bytedance.com/api/v1/job/posts/7657800968400488709) | 规划具身模型数据引擎，贯通获取、处理、训练、评测和模型反馈；与算法/评测制定数据策略、质量体系及自动化工具；统筹模型、工程、硬件及合作方落地。 要求：本科；具备系统抽象、指标分析及推进能力；理解训练，对多模态模型、数据引擎、机器人/自动驾驶数据或强化学习至少一项有实践/深入理解。 加分：机器人、自动化、计算机、AI 相关专业优先；未单列其他项。 |
| S09 | 地瓜机器人（地平线招聘体系） / 【地瓜机器人】软件平台产品经理 | 产品/评测；F 完整 | [原页](https://wecruit.hotjob.cn/SU64819a4f2f9d2433ba8b043a/pb/posDetail.html?postId=6acdabb8fea5e04bda943461&postType=society)；[正文](https://watchjobs.net/zh/explore/job/c503-c0ec633ba8b79d40/%E5%9C%B0%E7%93%9C%E6%9C%BA%E5%99%A8%E4%BA%BA-%E8%BD%AF%E4%BB%B6%E5%B9%B3%E5%8F%B0%E4%BA%A7%E5%93%81%E7%BB%8F%E7%90%86-%E5%9C%B0%E5%B9%B3%E7%BA%BF) | 规划模型、数据、开发工具的云边端平台；把客户定制抽成组件；优化接入、调试、部署；对平台收入、客户与开发者规模负责。 要求：本科、5 年 PM；机器人/硬件/IoT 背景；既懂整机又做过软件/云平台，有平台抽象、完整周期与商业化经验。 加分：具身/机械臂/灵巧手；物流/零售等客户；大模型/Agent；开发者生态与开源社区。 |
| S10 | Physical Intelligence / Product Manager | 产品/评测；P 不完整 | [原页](https://jobs.ashbyhq.com/physicalintelligence/37e6a38f-71ff-4ff9-8151-ddbd20fcb6ae)；[正文](https://www.ziprecruiter.com/c/Physical-Intelligence/Job/Product-Manager/-in-San-Francisco%2CCA?jid=f8fd7cfc6051fce5) | 仅重读原研究摘要；为机器人数据、研究和部署建设运营产品；管理需求、资源、优先级、进展可见性与质量；把重复人工作业做成工具，以指标看板改善研发和生产运营效率。 要求：可读部分未单列要求；不补学历、年限或算法要求。 加分：未显示。 |
| S11 | 追觅科技 / 产品经理（机器人应用功能；原职称仅“产品经理”） | 产品/评测；P 不完整 | [原页](https://www.liepin.com/job/1981438589.shtml) | 仅重读原研究摘要；管理机器人从概念到推出；分析场景、竞品与效益；定义应用逻辑、交互、流程和行为；推进开发及定价、收益目标。 要求：工科本科；3 年以上智能硬件 PM；懂市场/竞品，英语口语及协调、沟通和问题解决。 加分：可见部分未单列。 |
| S12 | 小米 / 产品经理（机器人方向） | 产品/评测；P 不完整 | [原页](https://www.zhipin.com/job_detail/9af2f86461d6bb7e0nJ50tm-F1NS.html) | 仅重读原研究摘要；参与机器人软件战略、路线图和定义，负责 1–2 个子模块的全生命周期；后续内容未看到。 要求：仅见硕士、3–5 年元信息，详细要求不可见。 加分：未读到。 |
| S13 | NVIDIA / Senior Product Manager, Physical AI Robotics Data | 产品/评测；P 不完整 | [原页](https://nvidia.wd5.myworkdayjobs.com/en-US/NVIDIAExternalCareerSite/job/US-CA-Santa-Clara/Senior-Product-Manager--Physical-AI-Robotics-Data_JR2020922) | 仅重读原研究摘要；负责机器人训练数据策略、采集、质检和模型效果评估；建设格式、质量与分发标准；指导标注，联合研究团队制定采集计划和数据合作，优化采集整理工具。 要求：技术本科或等效实践；8 年以上机器人数据、软硬件或科技产品经历；能用数据实验验证假设，具备规模 AI 数据交付和沟通影响力。 加分：遥操作数据、标注整理质检、采集工作流、ML/机器人研究及产品组合交付。 |
| P01 | 缤果万境 / 具身智能产品经理 | 产品/评测；F 完整 | [原页](https://bingorobotics.cn/join/embodied-product-manager/) | 场景调研、具身大脑与本体联合方案、PRD和路线图、协同研发销售交付；要求3年以上AI/机器人产品，完整需求到交付能力，世界模型背景加分。 |
| P02 | 美团 / 具身智能产品经理 | 产品/评测；P 不完整 | [原页](https://www.zhaopin.com/jobdetail/CC383625320J40863601909.htm) | 可见职责覆盖产品路线、数据采集pipeline、软硬件一体和量产协同；要求硕士、3年以上硬件产品，采集与机械臂经验加分。职责要求均有内容，但页尾明确“登录查看完整内容”，保守部分。 |
| P03 | 众擎机器人 / 机器人产品经理 | 产品/评测；F 完整 | [原页](https://jobs.ivyea.com/jobs/19874) | 市场与客户洞察、产品规划、供应商协同、质量成本风险、用户反馈与经营结果；要求3年以上产品经验、软硬融合全周期，主导过上市硬件或商业化软件平台。 |
| P04 | 众擎机器人 / 具身智能产品经理 | 产品/评测；F 完整 | [原页](https://jobs.ivyea.com/jobs/19875) | 负责交互/导航/操作/运控/传感器的能力规划、分期、体验标准、验收与跨团队交付；要求3年以上经验，熟悉2-3个机器人能力方向，能讲边界优先级与实际交付。 |
| P05 | 戴盟机器人 / 高级产品经理（无本体数据采集设备） | 产品/评测；F 完整 | [原页](https://jobs.ivyea.com/jobs/20217) | 手套/UMI/ego采集系统全周期，覆盖传感器、同步、软件SDK、格式、质量指标与量产；要求5年以上PM、3年软硬一体和完整硬件上市，数据生命周期、英语；VLA数据要求加分。 |
| P06 | 光轮智能 / 具身智能数采设备产品经理 | 产品/评测；F 完整 | [原页](https://jobs.ivyea.com/jobs/19905) | 采集设备规划、头戴腕部手持设备设计，平衡佩戴体验/可靠性/成本，协同原型测试量产和反馈；要求3年以上硬件/机器人产品，懂相机IMU嵌入式通信，AI工具辅助数据分析。 |
| P07 | 乐享科技 / AI产品经理（AI Agent/虚拟角色方向） | 产品/评测；F 完整 | [原页](https://www.liepin.com/job/1982305071.shtml?d_sfrom=recom_jd) | AI角色与机器人硬件联动，角色记忆、人设一致、多轮互动与陪伴；要求3年以上游戏/AI陪伴/社交/内容经验，完整模块责任和跨算法研发美术运营硬件协作。 |
| P08 | 思必驰 / AI语音产品经理-具身机器人方向 | 产品/评测；F 完整 | [原页](https://www.liepin.com/job/1982715841.shtml) | 端侧语音AI机器人路线、多模态联动和情感交互、算法软硬件量产协同、定价GTM；要求3年以上硬件/AI产品、至少2年机器人/具身，有0到1量产优先。 |
| P09 | 乐享科技 / 模型评测产品岗（A51973） | 产品/评测；F 完整 | [原页](https://www.liepin.com/job/1982539987.shtml) | 建立感知-决策-执行评测、空间感知与指令遵循指标、自动与人工评测、Badcase报告、Benchmark及安全性能标准；要求1年以上模型评测或应用产品，用数据定位优化并联动算法工程业务。 |
| P10 | 51WORLD / 具身数据产品经理 | 产品/评测；F 完整 | [原页](https://jobs.ivyea.com/jobs/19565) | 数据接入解算质检标注及数据集交付，管线配置任务编排、权限版本追溯、自助流程、客户验证；要求5年以上复杂B端平台，能权衡质量效率成本，有Codex/Claude Code原型经验加分。 |
| P11 | 小鹏集团 / 机器人产品经理（具身智能方向） | 产品/评测；F 完整 | [原页](https://xiaopeng.jobs.feishu.cn/index/position/7668512735076632895/detail)；[正文](https://xiaopeng.jobs.feishu.cn/api/v1/job/posts/7668512735076632895) | 定义导航动作操作安全等核心能力，以可验收指标连接模型工程和体验；要求3年以上硬件/AI产品，数据管线与分析验证能力，AI工具熟练，Agent/VLA原理加分。 |
| O01 | 智元 / 产品经理（四足产品经理） | 产品/评测；PM-社招；F 完整 | [原页](https://agirobot.jobs.feishu.cn/index/position/7583144810032384307/detail)；[正文](https://agirobot.jobs.feishu.cn/api/v1/job/posts/7583144810032384307) | 研究四足机器人市场与用户需求，定义规格与生命周期；要求5年以上产品经验及消费硬件、座舱或机器人量产案例，能将技术能力转成用户功能。 |
| O02 | 智元 / 产品经理（零售仓产品经理） | 产品/评测；PM-社招；F 完整 | [原页](https://agirobot.jobs.feishu.cn/socialrecruitment/position/7698932878412351798/detail)；[正文](https://agirobot.jobs.feishu.cn/api/v1/job/posts/7698932878412351798) | 负责零售仓机器人产品及VLA、导航、规控、调度算法产品化；要求3年以上仓储/物流/机器人产品经验，理解软硬件协同并独立负责产品线。 |
| O03 | 智元 / 具身产品经理-觅蜂子公司（具身产品经理-觅蜂子公司） | 产品/评测；PM-校招；F 完整 | [原页](https://agirobot.jobs.feishu.cn/campusrecruitment/position/7662290681059051795/detail)；[正文](https://agirobot.jobs.feishu.cn/api/v1/job/posts/7662290681059051795) | 规划人类操作数据采集终端及数据服务，定义质量与交付标准并连接模型反馈；官方要求硕士及以上相关专业、理解感知/采集和软硬件约束。 |
| O04 | 智元 / 具身生态产品经理-觅蜂子公司（具身生态产品经理-觅蜂子公司） | 产品/评测；PM-校招；F 完整 | [原页](https://agirobot.jobs.feishu.cn/campusrecruitment/position/7673472974649870635/detail)；[正文](https://agirobot.jobs.feishu.cn/api/v1/job/posts/7673472974649870635) | 面向开发者做需求反馈、开源运营及技术活动；要求相关专业本科、开发者思维和Python/C，仿真、数据集和模型微调属于加分项。 |
| O05 | 自变量 / 具身智能教育线产品经理（具身智能教育线产品经理） | 产品/评测；PM-社招；F 完整 | [原页](https://x2-robot.jobs.feishu.cn/index/position/7673793445664409906/detail)；[正文](https://x2-robot.jobs.feishu.cn/api/v1/job/posts/7673793445664409906) | 把高校和职教实训需求转成机器人设备、软件、课程产品；要求3年以上产品经验且1年以上教育产品经验，理解多模态/世界模型/VLA及软硬件协同。 |
| O06 | 字节Seed / 具身评测产品经理 - Seed Model（具身数据评测产品经理） | 产品/评测；PM-社招；F 完整 | [原页](https://jobs.bytedance.com/experienced/position/7698644813525600565/detail)；[正文](https://jobs.bytedance.com/api/v1/job/posts/7698644813525600565) | 建设具身模型评测与版本准入，分析失败模式、评测可信度和能力退化，将发现变成数据与模型改进；要求训练评测理解、实验判断、问题优先级与跨团队推进。 |
| O07 | 智元 / 机器人交互产品经理实习生（机器人交互产品经理实习生） | 产品/评测；PM-实习；F 完整 | [原页](https://agirobot.jobs.feishu.cn/internrecruitment/position/7559518673171106067/detail)；[正文](https://agirobot.jobs.feishu.cn/api/v1/job/posts/7559518673171106067) | 参与人形机器人动作/语音/表情交互、数据标签和badcase版本对比；要求基础Python阅读、AI工具、审美与跨团队推进，实际项目优先。 |
| O08 | 自变量 / 具身机器人物流解决方案（具身机器人物流解决方案） | 相邻；相邻-解决方案；F 完整 | [原页](https://x2-robot.jobs.feishu.cn/index/position/7591767385671158035/detail)；[正文](https://x2-robot.jobs.feishu.cn/api/v1/job/posts/7591767385671158035) | 面向物流客户做需求、方案、演示、投标与项目导入；要求机器人/自动驾驶/智能硬件理解、成功落地和客户沟通，并非任务规划产品岗。 |
| O09 | 逐际动力 / GTM产品经理（GTM产品经理） | 产品/评测；PM-社招-商业化；F 完整 | [原页](https://career.limxdynamics.com/index/position/7688265867825875226/detail)；[正文](https://career.limxdynamics.com/api/v1/job/posts/7688265867825875226) | 规划巡检机器人定位、定价、渠道、POC及标准/定制边界；要求3–5年以上B/G端机器人或工业物联网产品经验、ROI与规模销售，作为商业化方向对照。 |
| O10 | 自变量机器人 / 产品经理实习生 | 产品/评测；PM-实习；F 完整 | [原页](https://www.shushuqiuzhi.com/job/513710) | 参与竞品/需求分析、功能验收、用户反馈和资料整理；要求相关专业本科、机器人项目优先、了解硬件流程和产品工具；只用作实习要求对照。 |
| O11 | 优必选 / 产品经理 | 产品/评测；PM-校招；F 完整 | [原页](https://www.shushuqiuzhi.com/job/488923) | 负责软硬件全生命周期、体验迭代、用户/市场数据和跨部门节奏；要求计算机相关硕士、逻辑分析与产品流程理解。与原JD23人形产品经理为两个不同职位。 |
| O12 | 星海图 / Senior Solutions Manager | 相邻；相邻-解决方案；F 完整 | [原页](https://galaxea-ai.com/en/jobs.html) | 统筹行业方案、选型、数据标准、现场部署和验收；要求相关本科及3年以上经验，机器人/自动驾驶落地、SaaS和具身数据运营优先。 |
| O13 | 星海图 / Data Operations Specialist – POV & UMI | 相邻；相邻-数据运营；F 完整 | [原页](https://galaxea-ai.com/en/jobs.html) | 负责POV/UMI采集、质检、供应商、流程标准和工具验收；要求相关数据运营经验、质量评价及把现场问题转成平台需求的能力。 |
| O14 | 星海图 / Director of Data Operations | 相邻；相邻-数据运营；F 完整 | [原页](https://galaxea-ai.com/en/jobs.html) | 统筹数据产能、可用率、单位成本、标注质检和平台需求；要求8年以上相关经验与团队管理，国际供应商经验是加分，偏运营管理。 |
| O15 | 自变量机器人 / GTM产品市场实习生 | 相邻；相邻-GTM实习；F 完整 | [原页](https://www.recruit.net/job/gtm-jobs/2DED776753FB5DD1) | 协助硬件/模型/服务上市节奏、用户访谈、定价和效果复盘；要求2026/2027届在读、Office、数据分析与把技术转成商业语言，只作市场岗位对照。 |
| U01 | Amazon Robotics / Sr. Product Manager - Tech, Amazon Robotics Product Management | 产品/评测；机器人产品；F 完整 | [原页](https://www.amazon.jobs/en/jobs/10592383/sr-product-manager-tech-amazon-robotics-product-management) | 从客户需求和竞品分析推进功能优先级、技术规格与发布，并衡量产品价值；要求路线图与技术取舍经验。 |
| U02 | Amazon Manufacturing Services / Senior Product Manager, Tech, Amazon Manufacturing Services | 相邻；工业自动化相邻PM；F 完整 | [原页](https://www.amazon.jobs/en/jobs/10523033/senior-product-manager-tech-amazon-manufacturing-services) | 围绕机器人制造现场规划调度、操作交互、设备接入和AI质量反馈，要求制造执行系统与数据分析经验；单列相邻岗位。 |
| U03 | Path Robotics / Product Manager, Technical Commercialization | 产品/评测；机器人产品；F 完整 | [原页](https://job-boards.greenhouse.io/pathrobotics/jobs/8571279002) | 将机器人和AI能力转为客户可用产品，统筹软硬件与上线反馈；要求从零到一发布和跨团队落地证据。 |
| U04 | FF Robotics / Faraday Future / Product Manager, Logistics Industry | 产品/评测；机器人产品；F 完整 | [原页](https://job-boards.greenhouse.io/faradayfuture/jobs/8035023003) | 从仓储物流场景定义机器人方案与PRD，协调算法、软硬件、销售和试点；重视客户交付与商业化。 |
| U05 | Waymo / Senior Product Manager, New Platform Discovery and Validation | 产品/评测；自动驾驶具身相邻PM；F 完整 | [原页](https://careers.withwaymo.com/jobs/senior-product-manager-new-platform-discovery-and-validation-mountain-view-california-united-states-san-francisco) | 负责新平台感知评测和部署前验证，协调车辆、算力与测试资源；要求跨软硬件系统判断及可追踪的验证指标。 |
| U06 | Waymo / Product Manager, Perception ML Foundations | 产品/评测；自动驾驶数据产品相邻PM；F 完整 | [原页](https://app.welcometothejungle.com/jobs/LXBMmkvT) | 规划感知模型训练数据和评测平台，推动模型开发与数据质量；属于已关闭岗位的写作研究样本。 |
| U07 | Waymo / Senior Product Manager, Simulation | 产品/评测；自动驾驶仿真相邻PM；F 完整 | [原页](https://careers.withwaymo.com/jobs/senior-product-manager-simulation-mountain-view-california-united-states-san-francisco) | 规划自动驾驶仿真器并评价逼真度与效率，协调研发、安全和运营；仿真经验需要真实项目证明。 |
| U08 | Waymo / Group Product Manager, DevAI & Agentic Workflows | 相邻；内部Agent工具相邻PM；不计纯机器人PM；F 完整 | [原页](https://careers.withwaymo.com/jobs/group-product-manager-devai-agentic-workflows-mountain-view-california-united-states-san-francisco) | 负责内部AI开发工具与Agent工作流，以采用、ROI和安全接入判断价值；不当作机器人动作规划岗位。 |
| U09 | Waymo / Group Product Manager, Depot Operations Automation | 产品/评测；机器人产品；F 完整 | [原页](https://careers.withwaymo.com/jobs/group-product-manager-depot-operations-automation-mountain-view-california-united-states-san-francisco) | 规划场站机器人充电、清洁和检查，从原型到规模部署；产品横跨车辆、调度和物理硬件并衡量经济性。 |

## 全部失败请求与未取得目标正文的来源（按 URL 去重 90 项）

“失败”记录的是本轮实际请求，包括 404、403、429、Cache miss、重定向、验证页、脚本壳和到达后没有目标正文；不是对网站永久状态的判断。后续取得可读备用来源的项目也保留首次失败，不把目录成功当作岗位全文成功。

| 关联资源/岗位 | 实际 URL | 错误原文或观察 | 后续结果/处理 |
|---|---|---|---|
| 简历 F01 | [实际请求](https://www.hustlebadger.com/what-do-product-teams-do/9x-product-manager-resume-examples/) | `(403) Forbidden` | 否；搜索有摘要但未以摘要替代全文，不计 9 份样例 |
| 简历 F02 | [实际请求](https://www.aced.io/blog/how-to-write-the-perfect-product-manager-resume) | 首次 `(403) Forbidden` | 是；https://www.tryexponent.com/blog/how-to-write-the-perfect-product-manager-resume 成功重定向并读到全文 |
| 简历 F03 | [实际请求](https://github.com/Adron/resume) | `Cache miss` | 是；https://github.com/Adron/resume/blob/main/Resume/resume-long.md 成功 |
| 简历 F04 | [实际请求](https://github.com/madhavUF/madhavUF) | `Cache miss` | 是；https://github.com/madhavUF 成功，读到自述和项目简介 |
| 简历 F05 | [实际请求](https://github.com/Shehabov/pm-resume-builder-skill/blob/main/examples/Shehab-Beram-Senior-PM-Resume.pdf) | `Cache miss` | 否；仓库 README 可读，PDF 内容未读、不计全文 |
| 简历 F06 | [实际请求](https://github.com/Shehabov/pm-resume-builder-skill/raw/refs/heads/main/examples/Shehab-Beram-Senior-PM-Resume.pdf) | `Cache miss` | 否，同上 |
| 简历 F07 | [实际请求](https://github.com/Sahme115/chatgpt-resume-before-after-examples/blob/main/examples/product/03-growth-pm.md) | `Cache miss` | 仅根 README Hero 2 可读；不声称单例全文可读 |
| 简历 F08 | [实际请求](https://d3no4ktch0fdq4.cloudfront.net/public/CACHE/images/blog-articles/content-images/2.1/5230dfa1fc6f7ab9ad2898289f925476.webp) | `(400) Unsupported content-type: application/octet-stream` | 文章点评可读，图片全文未读取，不计该样例 |
| 简历 F09 | [实际请求](https://github.com/sahandsorouri/senior-pm-resume/raw/refs/heads/main/Sahand%20Sorouri%20-%20Senior%20Product%20Manager.tex) | `Cache miss` | 是；GitHub blob 页面源码全文可读 |
| 简历 F10 | [实际请求](https://raw.githubusercontent.com/sahandsorouri/senior-pm-resume/main/Sahand%20Sorouri%20-%20Senior%20Product%20Manager.tex) | 普通 HTTP 获取在本地环境报 `URLError <urlopen error [Errno 8] nodename nor servname provided, or not known>` | 是；改用联网读取工具读 GitHub blob；此项是本地 DNS/网络失败，不推断资源不存在 |
| JD01 | [实际请求](https://career.limxdynamics.com/index/position/7677884434582948106/detail) | 无可读正文：This page has no readable lines. | 该岗最终：职责及要求完整 |
| JD02 | [实际请求](https://agirobot.jobs.feishu.cn/socialrecruitment/position/7703783281803839794/detail) | 工具不可访问：is not accessible via this tool | 该岗最终：职责及要求完整 |
| JD02 | [实际请求](https://jobs.ivyea.com/jobs/19677) | 首次工具不可访问；从相关链接click后重试成功，转载职责与要求正文 | 该岗最终：职责及要求完整 |
| JD03 | [实际请求](https://lightwheel.jobs.feishu.cn/index/position/7621379194652363034/detail) | 工具不可访问：is not accessible via this tool | 该岗最终：职责及要求完整 |
| JD03 | [实际请求](https://jobs.ivyea.com/jobs/6050) | 失败，is not accessible via this tool（两次） | 该岗最终：职责及要求完整 |
| JD04、官网补充 | [实际请求](https://app.mokahr.com/social-recruitment/yinhetongyong/165929) | 失败：(400) Redirect loop detected；(400) Redirect loop detected | 该岗最终：职责及要求完整；银河通用招聘官网链接，未取得新JD |
| JD06 | [实际请求](https://dmrobot.zhiye.com/job/detail?jobAdId=0e3981d1-873a-4b6e-bd08-f551739d1c83) | 工具不可访问：is not accessible via this tool | 该岗最终：职责及要求完整 |
| JD07 | [实际请求](https://app.mokahr.com/social-recruitment/astribot/144861) | 工具不可访问：is not accessible via this tool | 该岗最终：职责及要求完整 |
| JD10 | [实际请求](https://jobs.gritventures.com/companies/apptronik/jobs/82138897-senior-product-manager-simulation) | 失败：(400) Timeout fetching | 该岗最终：职责及要求完整 |
| JD11 | [实际请求](https://www.linkedin.com/jobs/view/lead-technical-product-manager-data-at-1x-4433392796) | 跳转过期岗位搜索列表：expired_jd_redirect，原岗正文丢失 | 该岗最终：职责及要求完整 |
| JD12 | [实际请求](https://jobs.ashbyhq.com/1x/6bfaa0a0-01b6-4b44-9984-6791a7744adf) | 失败：(404) Not Found；Error executing tool fetch: Failed to fetch https://jobs.ashbyhq.com/1x/6bfaa0a0-01b6-4b44-9984-6791a7744adf - status code 404 | 该岗最终：部分或摘要；不计全文 |
| JD12 | [实际请求](https://www.tealhq.com/job/senior-staff-technical-product-manager-platform_7ea1a9f2c646df125cbebffaf7d692a200206) | 失败：Cache miss | 该岗最终：部分或摘要；不计全文 |
| JD12 | [实际请求](https://secondsummit.ai/job-details/product-and-design/california/san-carlos/1x-senior-staff-technical-product-manager-platform-9a81ba/) | 工具不可访问：is not accessible via this tool | 该岗最终：部分或摘要；不计全文 |
| JD13 | [实际请求](https://wecruit.hotjob.cn/SU6409ef49bef57c635fd390a6/pb/posDetail.html?postId=6ae30673f0cfabf2b40dce33&postType=society) | 仅JS提示：You need to enable JavaScript to run this app. | 该岗最终：部分或摘要；不计全文 |
| JD14 | [实际请求](https://roborock.zhiye.com/social/jobs?LocId=%5B%7B%22id%22%3A%221100%22%2C%22label%22%3A%22%E5%8C%97%E4%BA%AC%E5%B8%82%22%7D%5D) | 无可读正文：This page has no readable lines. | 该岗最终：部分或摘要；不计全文 |
| JD14 | [实际请求](https://roborock.zhiye.com/social/jobs) | 失败于正文提取：Page failed to be simplified from HTML | 该岗最终：部分或摘要；不计全文 |
| JD15 | [实际请求](https://lightwheel.jobs.feishu.cn/index/position/7660490800660973833/detail) | 工具不可访问：is not accessible via this tool | 该岗最终：职责及要求完整 |
| JD16 | [实际请求](https://ggfw.hrss.gd.gov.cn/recruitment/internet/main/#/positionDetail?bbb911=1806240159253716993&bcb009=2095836339985383425) | 仅JS提示：does not work properly without JavaScript enabled | 该岗最终：职责及要求完整 |
| JD19 | [实际请求](https://primebot.jobs.feishu.cn/campusrecruitment/position/7706434706078648619/detail) | 工具不可访问：is not accessible via this tool | 该岗最终：职责及要求完整 |
| JD19 | [实际请求](https://jobs.ivyea.com/jobs/20056) | 失败，is not accessible via this tool（两次） | 该岗最终：职责及要求完整 |
| JD21 | [实际请求](https://app.mokahr.com/campus-recruitment/astribot/144862) | 工具不可访问：is not accessible via this tool | 该岗最终：职责及要求完整 |
| JD22 | [实际请求](https://agirobot.jobs.feishu.cn/campusrecruitment/position/7673479382657665334/detail) | 无可读正文：This page has no readable lines. | 该岗最终：职责及要求完整 |
| JD23 | [实际请求](https://ubtrobot.zhiye.com/campus/detail?jobAdId=3969793c-141b-4674-858b-6c35bc972238) | 工具不可访问：is not accessible via this tool | 该岗最终：职责及要求完整 |
| S01 | [实际请求](https://agirobot.jobs.feishu.cn/socialrecruitment/position/7680907313238100230/detail) | 无可读正文：This page has no readable lines. | 该岗最终：职责及要求完整 |
| S01、S05、官网补充 | [实际请求](https://jobs.ivyea.com/companies/agibot) | 失败，is not accessible via this tool；URL ... is not accessible via this tool. | 该岗最终：职责及要求完整；第三方公司页失败 |
| S02、官网补充 | [实际请求](https://agirobot.jobs.feishu.cn/socialrecruitment/position/7623604735216191785/detail) | 无可读正文：This page has no readable lines.；This page has no readable lines. | 该岗最终：职责及要求完整；原S02，不新增 |
| S03 | [实际请求](https://x2-robot.jobs.feishu.cn/index/position/7618147728040462611/detail) | 无可读正文：This page has no readable lines. | 该岗最终：职责及要求完整 |
| S03、S04、官网补充 | [实际请求](https://jobs.ivyea.com/companies/x2robot) | 失败，is not accessible via this tool；URL ... is not accessible via this tool. | 该岗最终：职责及要求完整；第三方公司页失败 |
| S04 | [实际请求](https://x2-robot.jobs.feishu.cn/index/position/7592928221445065023/detail) | 无可读正文：This page has no readable lines. | 该岗最终：职责及要求完整 |
| S05 | [实际请求](https://agirobot.jobs.feishu.cn/socialrecruitment/position/7683405483365976326/detail) | 无可读正文：This page has no readable lines. | 该岗最终：职责及要求完整 |
| S06 | [实际请求](https://career.limxdynamics.com/index/m/position/7677885208746723603/detail) | 失败：(400) Timeout fetching | 该岗最终：职责及要求完整 |
| S07、BOSS加速进化原岗 | [实际请求](https://m.zhipin.com/job_detail/8fcdea8a47ae700a0nVy3dS0FFJW.html) | 安全验证：请稍候，重定向 /web/passport/zp/security.html；失败：robots.txt 不允许自动抓取；页面跳转安全验证，未继续绕过；失败：请稍候，重定向security.html安全验证 | 该岗最终：部分或摘要；不计全文；阅读与投递、登录、在招状态分别判断 |
| S08 | [实际请求](https://jobs.bytedance.com/experienced/position/7657800968400488709/detail) | 工具不可访问：is not accessible via this tool | 该岗最终：职责及要求完整 |
| S09 | [实际请求](https://wecruit.hotjob.cn/SU64819a4f2f9d2433ba8b043a/pb/posDetail.html?postId=6acdabb8fea5e04bda943461&postType=society) | 仅JS提示：You need to enable JavaScript to run this app. | 该岗最终：职责及要求完整 |
| S10、官网补充 | [实际请求](https://jobs.ashbyhq.com/physicalintelligence/37e6a38f-71ff-4ff9-8151-ddbd20fcb6ae) | 失败：(404) Not Found；Error executing tool fetch: Failed to fetch https://jobs.ashbyhq.com/physicalintelligence/37e6a38f-71ff-4ff9-8151-ddbd20fcb6ae - status code 404；(404) Not Found | 该岗最终：部分或摘要；不计全文；旧S10，搜索索引仍有内容但原页未读，不新增 |
| S10 | [实际请求](https://jobspring.pro/company/physical-intelligence/) | 失败：Cache miss | 该岗最终：部分或摘要；不计全文 |
| S11、猎聘追觅原岗 | [实际请求](https://www.liepin.com/job/1981438589.shtml) | 页面成功但原岗正文不可读：该职位已暂停招聘；失败于读取原JD：该职位已暂停招聘；推荐职位未拼接 | 该岗最终：部分或摘要；不计全文；阅读与投递、登录、在招状态分别判断 |
| S12、BOSS小米原岗 | [实际请求](https://www.zhipin.com/job_detail/9af2f86461d6bb7e0nJ50tm-F1NS.html) | 工具不可访问：is not accessible via this tool；失败：robots.txt 不允许自动抓取；页面跳转安全验证，未继续绕过；失败：is not accessible via this tool | 该岗最终：部分或摘要；不计全文；阅读与投递、登录、在招状态分别判断 |
| S13 | [实际请求](https://nvidia.wd5.myworkdayjobs.com/en-US/NVIDIAExternalCareerSite/job/US-CA-Santa-Clara/Senior-Product-Manager--Physical-AI-Robotics-Data_JR2020922) | 无可读正文：This page has no readable lines.；Error executing tool fetch: Failed to fetch https://nvidia.wd5.myworkdayjobs.com/en-US/NVIDIAExternalCareerSite/job/US-CA-Santa-Clara/Senior-Product-Manager--Physical-AI-Robotics-Data_JR2020922 - status code 429 | 该岗最终：部分或摘要；不计全文 |
| S13 | [实际请求](https://www.newx.sg/job/detail/893396317123) | 失败：Cache miss | 该岗最终：部分或摘要；不计全文 |
| P11 | [实际请求](https://xiaopeng.jobs.feishu.cn/index/position/7668512735076632895/detail) | 网页0行；随后官方公开API正文成功 | 该岗最终：职责及要求完整 |
| 拉勾首页 | [实际请求](https://www.lagou.com/) | 失败：为了更好的访问体验，请进行验证；CF_APP_WAF | 阅读与投递、登录、在招状态分别判断 |
| 拉勾具身PM搜索 | [实际请求](https://www.lagou.com/wn/jobs?kd=%E5%85%B7%E8%BA%AB%E6%99%BA%E8%83%BD%E4%BA%A7%E5%93%81%E7%BB%8F%E7%90%86) | 失败：is not accessible via this tool | 阅读与投递、登录、在招状态分别判断 |
| 脉脉/jobs尝试 | [实际请求](https://maimai.cn/jobs) | 失败：is not accessible via this tool | 阅读与投递、登录、在招状态分别判断 |
| 脉脉找工作真实入口 | [实际请求](https://maimai.cn/n/platform/homepage/jobs) | 失败：Cache miss | 阅读与投递、登录、在招状态分别判断 |
| 猎聘熊蜂物理AI线索 | [实际请求](https://www.liepin.com/job/1984039907.shtml) | 失败：Cache miss，不计数 | 阅读与投递、登录、在招状态分别判断 |
| 官网补充 | [实际请求](https://agirobot.jobs.feishu.cn/) | This page has no readable lines. | 网页正文不可读；职位可由官方公开JSON挽救 |
| 官网补充 | [实际请求](https://agirobot.jobs.feishu.cn/socialrecruitment/?current=1&limit=10) | This page has no readable lines. | 目录不计JD |
| 官网补充 | [实际请求](https://agirobot.jobs.feishu.cn/index/position/7583144810032384307/detail) | This page has no readable lines. | O01公开JSON成功 |
| 官网补充 | [实际请求](https://agirobot.jobs.feishu.cn/socialrecruitment/position/7698932878412351798/detail) | Total lines: 0 | O02公开JSON成功 |
| 官网补充 | [实际请求](https://agirobot.jobs.feishu.cn/campusrecruitment/position/7662290681059051795/detail) | Total lines: 0 | O03公开JSON成功 |
| 官网补充 | [实际请求](https://agirobot.jobs.feishu.cn/campusrecruitment/position/7673472974649870635/detail) | Total lines: 0 | O04公开JSON成功 |
| 官网补充 | [实际请求](https://agirobot.jobs.feishu.cn/internrecruitment/position/7559518673171106067/detail) | This page has no readable lines. | O07公开JSON成功 |
| 官网补充 | [实际请求](https://www.unitree.com/position/1526099160422416384/) | 详情只返回导航与版权，没有目标岗位内容 | 研发项目经理职责在目录可见，要求未读，不计 |
| 官网补充 | [实际请求](https://www.unitree.com/cn/position/1526099160422416384/) | HTTP读取只返回版权、备案页脚 | 未取得完整JD |
| 官网补充 | [实际请求](https://www.fftai.cn/) | 重定向 https://fftai.com/ 后 This page has no readable lines. | JS壳 |
| 官网补充 | [实际请求](https://fftai.com/) | This page has no readable lines. | 原始HTML可取但不含JD |
| 官网补充 | [实际请求](https://fftai.com/fourier/join) | This page has no readable lines. | 从官网脚本定位到加入页；仍无JD正文 |
| 官网补充 | [实际请求](https://hr.xiaomi.com/website/opportunities.html) | 共 — 个职位；未加载岗位 | 内容不完整，首页可达不等于已读JD |
| 官网补充 | [实际请求](https://www.hotjob.cn/wt/Horizon/mobweb/v8/position/list) | (500) Redirected to https://wecruit.hotjob.cn/SU64819a4f2f9d2433ba8b043a/pb/custom.html?parentKey=section_0&pageType=customize_section_0 which is not accessible via this tool. (non-retryable error) | 未取得该目录正文 |
| 官网补充 | [实际请求](https://dreame.zhiye.com/jobs) | This page has no readable lines. | 无JD正文 |
| 官网补充 | [实际请求](https://x2-robot.jobs.feishu.cn/index/position/list?current=1&limit=10) | This page has no readable lines. | 目录不计JD；具体职位API可用 |
| 官网补充 | [实际请求](https://x2-robot.jobs.feishu.cn/index/position/7673793445664409906/detail) | 原始HTML约13万字符，只有脚本与站点配置，没有岗位职责/要求 | O05公开JSON成功 |
| 官网补充 | [实际请求](https://x2-robot.jobs.feishu.cn/index/position/7591767385671158035/detail) | (400) Timeout fetching | O08公开JSON成功 |
| 官网补充 | [实际请求](https://career.limxdynamics.com/) | (502) Bad Gateway | 招聘根目录失败 |
| 官网补充 | [实际请求](https://career.limxdynamics.com/index/position/7688265867825875226/detail) | Cache miss | O09公开JSON成功 |
| 官网补充 | [实际请求](https://zhaopin.ubtrobot.com/home) | (400) Timeout fetching | O11从公开转载读到正文 |
| 官网补充 | [实际请求](https://www.physicalintelligence.company/careers) | URL ... is not accessible via this tool. | 该路径失败，未宣称PI整个官网不可达 |
| 官网补充 | [实际请求](https://jobs.ivyea.com/companies/limxdynamics) | URL ... is not accessible via this tool. | 第三方公司页失败 |
| 官网补充 | [实际请求](https://www.10100.com/article/101443743) | Cache miss | 2021乐聚旧PM线索；未读全文，不计 |
| 官网补充 | [实际请求](https://x2-robot.jobs.feishu.cn/api/v1/search/job/posts?keyword=%E4%BA%A7%E5%93%81&limit=100&offset=0) | 返回通用猎头平台HTML，没有岗位清单JSON | 检索接口尝试未成功，不计 |
| 官网补充 | [实际请求](https://x2-robot.jobs.feishu.cn/api/v1/job/posts?keyword=%E4%BA%A7%E5%93%81&limit=100&offset=0) | 返回通用猎头平台HTML，没有岗位清单JSON | 检索接口尝试未成功，不计 |
| 海外补充 | [实际请求](https://nvidia.wd5.myworkdayjobs.com/en-US/NVIDIAExternalCareerSite/job/Product-Manager--Developer-Experience-and-Platform-Excellence---Edge-AI-and-Robotics_JR2025794-1) | This page has no readable lines. (Total lines: 0) | 未计入已读JD；没有用搜索索引替代正文 |
| 海外补充 | [实际请求](https://amazon.jobs/en/jobs/10556797/product-manager-tech-go-ai-technology-development-team) | (404) Not Found | 未计入已读JD；没有用搜索索引替代正文 |
| 海外补充 | [实际请求](https://www.amazon.jobs/en/jobs/10556797/product-manager-tech-go-ai-technology-development-team) | (404) Not Found | 未计入已读JD；没有用搜索索引替代正文 |
| 海外补充 | [实际请求](https://jobs.lever.co/ambirobotics/b9c943c3-212a-4d5a-9680-d04b1f9097e7) | (403) Forbidden | 未计入已读JD；没有用搜索索引替代正文 |
| 海外补充 | [实际请求](https://jobs.ashbyhq.com/worldengine/ad2831bd-cd33-4689-b9c0-d78979507d2f) | You need to enable JavaScript to run this app. | 未计入已读JD；没有用搜索索引替代正文 |
| 海外补充 | [实际请求](https://jobs.ashbyhq.com/robco/4693eec2-2e17-43c9-8785-e8dc1edc5fe6) | (404) Not Found | 未计入已读JD；没有用搜索索引替代正文 |
| 海外补充 | [实际请求](https://jobs.ashbyhq.com/genesis/5dace7e0-2496-4b20-9d99-d9baa5bd64b1) | You need to enable JavaScript to run this app. | 未计入已读JD；没有用搜索索引替代正文 |
| 海外补充 | [实际请求](https://job-boards.greenhouse.io/intrinsicrobotics/jobs/5543501004) | 重定向至https://www.intrinsic.ai/careers；仅招聘入口，无该岗位职责与要求。不是404，但未读到目标JD。 | 未计入已读JD；没有用搜索索引替代正文 |

### 仍未补齐全文的 9 个岗位

- JD12：1X / Senior/Staff Technical Product Manager, Platform；保留摘要或局部内容，不计入 62 份正文。
- JD13：地瓜机器人（地平线招聘体系） / 【地瓜机器人】具身业务产品经理（软硬件方向）；保留摘要或局部内容，不计入 62 份正文。
- JD14：石头科技 / 软件产品经理（具身机器人）（原页职称：软件产品经理）；保留摘要或局部内容，不计入 62 份正文。
- S07：加速进化 / AI 产品经理；保留摘要或局部内容，不计入 62 份正文。
- S10：Physical Intelligence / Product Manager；保留摘要或局部内容，不计入 62 份正文。
- S11：追觅科技 / 产品经理（机器人应用功能；原职称仅“产品经理”）；保留摘要或局部内容，不计入 62 份正文。
- S12：小米 / 产品经理（机器人方向）；保留摘要或局部内容，不计入 62 份正文。
- S13：NVIDIA / Senior Product Manager, Physical AI Robotics Data；保留摘要或局部内容，不计入 62 份正文。
- P02：美团 / 具身智能产品经理；保留摘要或局部内容，不计入 62 份正文。

傅利叶、宇树、乐聚、Figure 未取得新的独立 PM 正文，小米和 PI 的目标岗位也未补齐；星海图官网读到了相邻岗位，未冒称 PM。1X 数据岗及 Waymo 部分转载明确已关闭，仍可研究写法，不能当作现招推荐。

## 可复核材料

- [原 36 份研究](具身JD调研.md)、[本次原岗与平台核验](v25-既有JD与平台核验.md)、[16 家官网核验](v25-官网JD补充核验.md)、[简历样例核验](v25-优秀简历联网核验.md)。
- [71 岗合并编码数据](v25-jd-merged.json)、[全部失败 URL 数据](v25-access-failures.json)、[样例结构统计](v25-优秀简历结构统计.json)；官方 JSON 的原始返回保存在 v25-jd-fetch-evidence-*.json。
- 简历事实边界采用[当前来源对照](../简历-来源对照.md)，未用 JD 或外部简历补充个人经历。完整审改见[简历改写稿-v25.md](简历改写稿-v25.md)。
