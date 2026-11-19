# K 补充材料逐文件去重与阅读覆盖

日期：2026-11-17。只研究；不写正文、不改网页、不启动浏览器。

指定补充材料 31 个文件，已登记 31 个，未覆盖 0 个；另读相关 evolution 正文/索引及 compact 同源副本，共 40 个追加批次；新增 93 条事实、41 条案例/设计场景、9 条部件候选。

去重方法：去空行、HTML表格包装、Markdown转义及链接装饰后，逐段比对正文；只对非重复部分提取，不以文件名相同或大小相近判重。会议的partial副本仅对照raw完整文本，不将其当完整会议。空文件和历史研究报告单独标明。

| 文件 | 阅读与去重处理 | 本批事实/案例/部件 |
| --- | --- | --- |
| `v-lesson-20261105/memory/memory-a-prd.md` | 全文阅读，旧A项目方案，和raw记忆系统非同文；简单/复杂版本均标待决策，不当现行权限。 | 11/2/1 |
| `v-lesson-20261105/memory/memory-design.md` | 全文分段阅读（含Out of scope、删除线）。2025-12-02旧方案，与raw记忆系统不同，重复clean-4后续登记。 | 10/17/2 |
| `v-lesson-20261105/memory/memory-server.md` | 全文阅读，技术接口旧说明；与raw memory-car-sync 不是同一文。 | 8/0/1 |
| `v-lesson-20261105/memory/memory-poi-sync.md` | 全文阅读，与raw/memory-poi-sync.txt是同一文的Markdown提取副本（标题、变更记录、短长方案相同），不重复抽取。 | 0/0/0 |
| `memory-evolution-20261028/README.md` | 全文阅读，已知读取边界登记：此前0819逐字稿截断、画像/测试另有源文、部分表格截断/空文档/失败，不能把历史研究汇总当实现证据。 | 0/0/0 |
| `memory-evolution-20261028/memory-clean-5.md` | 全文阅读，2025-07旧需求，草稿分割线及删除线已区分；与A项目部分重复，仅提独有。 | 7/2/0 |
| `memory-evolution-20261028/memory-clean-test.md` | 全文阅读；只记录指标和操作链，不抄录示例请求中的签名、鉴权键。测试方案给目标/当时数值，未给全量线上验收结论。 | 14/2/1 |
| `memory-evolution-20261028/memory-clean-profile.md` | 全文阅读，含260501/260519提示词、FAQ阈值、完整输入输出样例，主语污染示例与修复新版分开。 | 8/5/1 |
| `v-lesson-20261105/memory/context-runtime.md` | 全文阅读，卡片27已有主架构，K只提层次/版本数字差异。 | 4/0/0 |
| `v-lesson-20261105/memory/context-prd.md` | 全文阅读；旧公共Context范围较宽，B/T/S内容仅记边界。 | 3/1/0 |
| `memory-events/event-production-consumption-20261023.md` | 全文阅读技术方案，端状态生产/订阅触发只记K记忆原料与身份时序边界；暂定数字不当现行。 | 5/1/1 |
| `v-lesson-20261105/memory/event-report.md` | 全文阅读，当时上报现状；B章信号结构、视觉场景与T任务过程不展开。 | 3/0/0 |
| `v-lesson-20261105/memory/context-new-prd.md` | 先归一化文本逐段比对raw memory-prd；正文同源重复，独有Meego标题和未来迭代尾部已读，文件名与标题不符。 | 4/1/1 |
| `memory-events/memory-system-20261023.md` | 同源记忆系统大部分重复raw与context-new-prd；逐段比对定位独有1445-1539隐私摘要策略并读透，尾部未来方向已核对重复。 | 6/4/1 |
| `memory-evolution-20261028/memory-clean-0.md` | 归一化去重，比对raw记忆PRD及10/23记忆系统；仅独有页面由客户开发及未划除旧展示项，未来情绪项同已提来源。 | 2/0/0 |
| `memory-evolution-20261028/evolution-knowledge-retrieval.md` | 按身份/记忆/隐私关键词阅读工具与完整相关示例前后，S章动态知识主流程不提取；示例是设计非实测。 | 4/5/0 |
| `memory-evolution-20261028/evolution-expert-plan.md` | 关键词定位并阅读L1-65及相关场景表，主文专家知识属S，不把场景假设当可用能力。 | 1/0/0 |
| `memory-evolution-20261028/evolution-dt-talk.md` | 关键词定位并读完整记忆相关段落：目标/推理约束/评测/车型选择/末尾问答；非记忆章节未算全文。 | 3/1/0 |
| `v-lesson-20261105/memory/memory-onepage.md` | 归一化逐段核对，与chapters/K/raw/memory-onepage.txt同源正文重复，未发现独有业务段；不重复抽取。 | 0/0/0 |
| `v-lesson-20261105/memory/event-prd.md` | 归一化逐段核对，与chapters/K/raw/event-log-prd.txt同源正文重复，独有需求链接不代表新增实现；不重复抽取。 | 0/0/0 |
| `v-lesson-20261105/memory/memory-privacy.md` | 读取确认为仅换行空文件，没有可用正文；隐私依据改用raw及10/23完整副本。 | 0/0/0 |
| `v-lesson-20261105/memory/history-compression.md` | 读取确认为仅换行空文件，没有可用正文；摘要依据改用raw及会议文字。 | 0/0/0 |
| `memory-evolution-20261028/memory-clean-1.md` | 归一化逐段核对，与已全文读memory-poi-sync.md重复。 | 0/0/0 |
| `memory-evolution-20261028/memory-clean-2.md` | 归一化逐段核对，与raw memory-onepage及其Markdown副本重复。 | 0/0/0 |
| `memory-evolution-20261028/memory-clean-3.md` | 归一化逐段核对，与已全文读memory-server.md重复。 | 0/0/0 |
| `memory-evolution-20261028/memory-clean-4.md` | 归一化逐段核对，与已全文读memory-design.md重复。 | 0/0/0 |
| `memory-evolution-20261028/memory-clean-aprd.md` | 归一化逐段核对，与已全文读memory-a-prd.md重复。 | 0/0/0 |
| `memory-evolution-20261028/memory-meeting-partial.md` | 归一化逐段核对，已有部分08/19逐字稿与raw meeting-0819-review.txt重复，部分副本不替代raw完整会议。 | 0/0/0 |
| `memory-events/memory-poi-sync-20261023.md` | 全文核对，与raw memory-poi-sync.txt和memory-poi-sync.md重复，仅多采集来源与日期。 | 0/0/0 |
| `v-lesson-20261105/memory/RESEARCH-REPORT.md` | 全文分段读，研究汇总非原始证据；已核对层次混称、11/04讨论与11/05读取失败边界，事实回到raw而非二手报告。 | 0/0/0 |
| `v-lesson-20261105/memory/facts.json` | 完整解析所有26项claim/status/caveat/excerpt及limitations，均为已给原文的研究索引，不另造新事实；F25/F26是端侧非K核心。 | 0/0/0 |
| `memory-events/README.md` | 全文读，研究汇总只作定位与证据边界；发现账号与乘客OnePage路径已交父代理继续读取。 | 0/0/0 |
| `memory-evolution-20261028/evolution-readme.md` | 全文读，明确S章边界、空自学习文档、其他业务误命中和表格截断，未把这些当用户记忆实现。 | 0/0/0 |
| `memory-evolution-20261028/evolution-transcript.md` | 用记忆/画像/偏好定位并读9/9口述歌词分屏、内部全局与用户个人记忆讨论；与raw meeting-0909-expert-transcript.txt重复，由会议代理全文提取。 | 0/0/0 |
| `v-lesson-20261105/memory/context-new-prd-compact.md` | 去空行/HTML表格包装并对照同名非compact文件，属同源精简副本；无独有业务事实，按完整副本登记。 | 0/0/0 |
| `v-lesson-20261105/memory/event-prd-compact.md` | 去空行/HTML表格包装并对照同名非compact文件，属同源精简副本；无独有业务事实，按完整副本登记。 | 0/0/0 |
| `v-lesson-20261105/memory/event-report-compact.md` | 去空行/HTML表格包装并对照同名非compact文件，属同源精简副本；无独有业务事实，按完整副本登记。 | 0/0/0 |
| `v-lesson-20261105/memory/memory-design-compact.md` | 去空行/HTML表格包装并对照同名非compact文件，属同源精简副本；无独有业务事实，按完整副本登记。 | 0/0/0 |
| `v-lesson-20261105/memory/memory-onepage-compact.md` | 去空行/HTML表格包装并对照同名非compact文件，属同源精简副本；无独有业务事实，按完整副本登记。 | 0/0/0 |
| `v-lesson-20261105/memory/memory-server-compact.md` | 去空行/HTML表格包装并对照同名非compact文件，属同源精简副本；无独有业务事实，按完整副本登记。 | 0/0/0 |

## 重点独有信息

- 语义画像算法：260519新增主体过滤、日期/时段拆分，真实缺陷7308474701与7308445203；旧输出样例仍保留错误，需按新规则解读。
- 汽车记忆测试方案：生成/打标/画像/召回指标及准出条件、异步生成和实体映射排查链，全部保留“目标”与“当时值”区别。
- 10月23日记忆系统副本：新人加入清摘要敏感字段、8类敏感边界、未知乘客等量换人无法覆盖、换座误清风险。
- 2025旧方案：白名单、时长、更新规则均保留旧版本属性，不覆盖较新OnePage。
- Context新PRD文件实际是记忆系统；memory-privacy/history-compression为空，已显式登记。

## 冲突候选（供父级统一整理）

1. 旧A项目简单/复杂权限均待决策；旧2025-7白名单仅车控，与同文多人查导航/日程例子冲突；不可拼成现行授权。
2. 旧短期72小时/24小时未用车删除，与更新OnePage当天有效不是统一期限。
3. 旧20分钟/20条汇总、历史5轮、端轻历史30分钟10轮属于不同对象；Context旧事件10分钟30条暂定与现行3条亦不同。
4. 画像260519主语过滤规则与附录仍含妻子偏好的旧输出样例冲突。
5. 10/23源有完整摘要隐私段，当前raw未保留该段，不能仅据采集时间断言废止。
6. memory-clean-0里画像衍生偏好可展示项未删除，11/05副本已划除；页面露出范围需按更新材料分辨。
7. Context旧文P90 564毫秒、卡片27十月约360毫秒与测试P90≤500毫秒目标的对象与时间不同。
8. 旧火锅设计例把听说不错写成喜欢且未等导航确认，不能当正确行为范本。

## 未额外宣称

- 不宣称未见的嵌入图表内容已核验。
- 不把Meego链接标题“测完日期”当实际验收结果。
- 不从旧接口参数和提示词例子推出现行全车型运行配置。
- evolution JSON检索索引只作定位，同名md作为内容依据，详见supplement-evolution-json.md。
