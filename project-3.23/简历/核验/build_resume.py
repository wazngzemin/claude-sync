from pathlib import Path
from html import escape
import json
root=Path('/Users/bytedance/Desktop/3.23'); out=root/'简历'
R='docs/职业发展/豆包汽车到具身智能-证据评估与行动路线-v02.md'
P='docs/职业发展/证据附件-v02/Planner专项核查.md'
T='docs/职业发展/证据附件-v02/Trigger专项核查.md'
D='docs/职业发展/证据附件-v02/舱驾融合专项核查.md'
F='docs/职业发展/证据附件-v02/飞书读取快照/'
X='产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/【Director】动态示例(for badcases修复）.xlsx'
items=[]
def item(id,title,text,sources,kind='方案与推动',limit='未作为上线或完整验收成果。'):
    d=dict(id=id,title=title,text=text,sources=sources,kind=kind,limit=limit);items.append(d)
    return '<li data-evidence="'+id+'"><strong>'+escape(title)+'：</strong>'+escape(text)+'</li>'
def block(title,subtitle,body):
    return '<section><h3>'+title+'<span>'+subtitle+'</span></h3><ul>'+body+'</ul></section>'
a=''
a+=block('任务规划与工具编排','Planner · 根据目标与反馈决定下一步',
item('P1','多步任务','编写“连续取消途经点”决策示例：前一步删除成功后再下发下一步，避免并行打断；已形成示例，待复测。',[(X,'动态示例汇总表(SFT）!A464:H464'),(R,'§4.4')])+
item('P2','约束保留与评测','针对音乐平台选择、车辆能力边界提出 59 条动态示例；原表记载实车复测 30 条通过、7 条失败、22 条未标记。',[(X,'动态示例汇总表(SFT）!C411:C510、H411:H510；按提出人筛选'),(P,'“另外几个容易被包装成个人实绩的数字”')],'已确认结果','数字仅是该原表本人提出记录及复测标记，不是整体成功率、提升率或本次独立实车复验。')+
item('P3','Badcase（问题案例）分诊','提供车窗方向、风量与车况不一致的现象和日志，协同区分工具语义、当前状态与历史干扰，推动修正规则及复测。',[(P,'案例5、6'),('产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/planner bugg晚上 3 点.md','433–530、679–728、1301–1323行')]))
a+=block('触发器与主动服务','感知 → 条件判断 → 执行反馈',
item('T1','事件与状态机','推动接近、到达、离开事件及状态流转方案，区分距离持续满足与单次触发，减少重复提醒风险；执行分工待评审。',[(F+'embodied-meeting-poi.md','627–647、842–922行'),('产品/1-原始素材/资料数据PRD原件/advisor 架构/导航POI靠近触发需求 (1).html','179、191、222行；POI状态机与两方案')])+
item('T2','多信号误触发','组织“下车却触发按摩”排查，提出结合车门与座椅占用，核对注册条件和部署环境差异，安排后续复测。',[(R,'§4.1'),(F+'embodied-meeting-0923.md','33–73、174–199行')],limit='新注册方案与时间窗口不是本人独创；未取得后续部署、误触发改善的复测证据。')+
item('T3','常驻感知资源','针对 VLM（视觉语言模型）常驻任务，提出并发成本与整链路时延问题，推动固定标签与开放描述的方案取舍讨论。',[(R,'§4.3'),(F+'embodied-meeting-vlm0910.md','会议01:33、03:50、11:35–15:46')])+
item('T4','端侧自闭环','接手赛力斯天气保护预设任务，推动天气识别、车况条件、用户确认与端侧执行分工对齐；正式天气场景验收待补。',[(T,'案例1'),(F+'embodied-meeting-weather.md','16–37、151–172、176–242、281–392行')])+
item('T5','开关持久化','推动按车保存任务开关的分工对齐：车控应用本地保存、数据中心通知、触发器使用状态，回应重启后保持选择的需求。',[(R,'§4.2'),(F+'embodied-meeting-0922.md','715–827、862–896行')],limit='分工由会议协作形成；新增接入待开发验收，不宣称恢复机制已实测。')+
item('T6','执行反馈状态','针对设备未就绪后任务无结果，提出成功、空结果、失败、超时、打断反馈，参与澄清“送达”与“执行”的责任边界。',[('产品/1-原始素材/会议纪要/端侧预置任务-VLM相关链路.md','998–1068行，00:59:41–01:02:00'),(R,'§4.7')]))
a+=block('舱驾融合与参照物临停','2026.03 · 需求定义与评审方案',
item('D1','自然语言目标','署名起草舱驾融合初版 PRD（产品需求文档）及临停评审稿，拆解“在某人旁边停”等场景，明确目标理解与驾驶执行分工。',[(F+'embodied-prd-driver.md','33–72、170–237行'),(F+'embodied-prd-pullover.md','37–78行'),(D,'§1、§3')])+
item('D2','视觉目标与异常','参与自然语言目标到视觉对象、再到执行侧的链路定义，在临停评审稿梳理目标歧义、取消及执行反馈；保留方案验证边界。',[(R,'§4.6'),(D,'§2、§3'),(F+'embodied-prd-pullover.md','260–979行')],limit='参与场景与评审方案；不认领后续全部版本或视觉算法，不声称机器人/自动驾驶交付。'))
b=''
b+=block('动态示例平台与发布治理','模型行为配置 · 需求评审与范围取舍',
item('G1','审核与隔离','主持平台需求讨论，推进审核、批量检查、车企与环境隔离；将相似内容硬拦截调整为提示，避免误挡合理示例。',[(P,'案例7、8'),(F+'embodied-meeting-examples.md','13:00–21:00、22:00–40:00、46:00–50:00')])+
item('G2','追溯与回退','整理关键操作留痕、版本快照与回退治理需求，便于定位错误配置；回退作为后续方案，权限、粒度与生效规则待确认。',[('产品/codex/HTML/02-已交付/动态示例平台二期需求文档-v16.html','233行；第14章，516–527行')],limit='本地需求稿明确回滚仅为P1预览；仅能证明需求整理，不是正式定案或已交付。'))
b+=block('近期产品推进','2026.10—2026.11',
item('N1','上汽定时任务｜10 月','编写定时任务 PRD，区分计时、条件触发与执行职责，补齐修改取消、状态回写及异常验收条目；已形成跨团队评审稿。',[('产品/codex/PRD-上汽定时任务与触发器整体流程-v02.md','3–17、39–55、147–160行'),('wiki/synthesis/saic-timed-task-trigger.md','26–30行'),('wiki/log.md','2026-10-13交付记录')],limit='文档产出已确认；能力实现与联合验收未证，不把AI辅助文档整理写成独立发明团队方案。')+
item('N2','新手引导｜11 月','修订需求文档并列 A/B 方案，推进单模型相关性判断、触发器条件与计次、Planner 执行分工，补充场景与验收口径。',[('wiki/synthesis/onboarding-agent-prd.md','23–25、38–50行'),('wiki/log.md','2026-11-05 correction、11-06、11-09记录'),('raw/articles/onboarding-2026-11-05/11-06-semantic-trigger-alignment.md','29–57行')],limit='未建设独立Agent。文档并列A/B，推进方向依晚间纠正；计次11/4与11/11存在演进，不写已完成计次改造。')+
item('N3','触发器平台宣讲｜11 月','整理产品宣讲稿，说明动态与预设入口，以及送达、推理消费、播报、车辆执行的分层反馈，形成跨团队讲解材料。',[('wiki/synthesis/trigger-platform-lecture-v2-slim.md','21–25、37–55行'),('wiki/log.md','2026-11-11记录')],limit='稿件形成，不等于已举办培训或规划能力已上线。'))
mapping=[
('M1','事件定义','接近／到达／离开状态流转，以及上下车多信号误触发排查。','T1、T2'),
('M2','技能／工具契约与执行反馈','串行删除途经点等待前序结果，区分命令送达与执行结果。','P1、T6'),
('M3','多任务感知资源','围绕常驻视觉任务提出并发、成本及整链路时延取舍。','T3'),
('M4','状态持久化与恢复','推动任务开关按车保存及重启后使用的职责对齐，待验收。','T5'),
('M5','数据与评测','维护本人动态示例并对照复测记录，结合现象与日志参与问题分诊。','P2、P3')]
b+='<section class="mapping"><h3>与具身智能的能力映射<span>基于上述车载任务与交互经历</span></h3><ul>'
for id,title,txt,refs in mapping:
    b+=item(id,title,txt,[(refs,'复用对应经历来源；仅为能力迁移归纳')],'职责范围','映射到目标岗位的能力，不表示已拥有机器人项目经验。')
b+='</ul></section>'
css='''*{box-sizing:border-box}html{background:#edf1f3;color:#202c32}body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei","Noto Sans CJK SC",sans-serif;font-size:14px;line-height:1.65}.page{width:210mm;min-height:297mm;margin:24px auto;padding:16mm 16mm 13mm;background:#fff;box-shadow:0 4px 24px #16353f12;position:relative}h1{font-size:32px;line-height:1.2;margin:0 0 7px;letter-spacing:2px}header{border-top:5px solid #176477;padding-top:18px}.target{font-size:16px;color:#176477;font-weight:650}.contact{display:flex;flex-wrap:wrap;gap:5px 20px;font-size:12px;color:#4d5a60;margin:12px 0}.pending{font-weight:700;color:#176477;background:#eaf3f5;padding:1px 3px}.profile{margin:13px 0 19px;font-size:14px}.job{padding:11px 0;border-top:1px solid #cddade;border-bottom:1px solid #cddade;margin-bottom:17px}.job h2{font-size:17px;margin:0}.job p{margin:3px 0 0;color:#526168;font-size:12px}h3{font-size:15px;color:#176477;line-height:1.4;margin:0 0 8px}h3 span{display:block;font-weight:400;color:#68777d;font-size:11px;margin-top:2px}section{margin:0 0 18px}ul{margin:0;padding-left:16px}li{padding-left:1px;margin:0 0 7px;overflow-wrap:anywhere;break-inside:avoid;page-break-inside:avoid}li::marker{color:#176477}strong{font-weight:650}.continuation{display:flex;justify-content:space-between;align-items:center;border-top:4px solid #176477;border-bottom:1px solid #cddade;padding:12px 0;margin-bottom:22px;color:#176477;font-weight:650}.continuation span{font-size:12px;font-weight:400}.mapping li{margin-bottom:6px}.education{border-top:1px solid #cddade;padding-top:12px}.education p{margin:6px 0}.page-number{position:absolute;bottom:8mm;right:16mm;color:#859398;font-size:10px}.small{font-size:12px;color:#5d6b71}@media(max-width:600px){html{background:#fff}.page{width:100%;min-height:0;margin:0;padding:24px 16px 32px;box-shadow:none}.page+.page{padding-top:0}h1{font-size:29px}.target{font-size:15px}.profile{font-size:14px}.job h2{font-size:16px}li{margin-bottom:11px}.page-number{display:none}.continuation{flex-wrap:wrap;gap:4px}.contact{gap:5px 12px}}@page{size:A4;margin:0}@media print{html,body{background:#fff;font-size:10.5pt;line-height:1.6;print-color-adjust:exact;-webkit-print-color-adjust:exact}.page{width:210mm;height:297mm;min-height:0;margin:0;padding:14mm 15mm 13mm;box-shadow:none;break-after:page}.page:last-child{break-after:auto}header{padding-top:13px}h1{font-size:25pt}.target{font-size:12pt}.contact{font-size:9pt;margin:9px 0}.profile{font-size:10.5pt;margin:10px 0 14px}.job{padding:8px 0;margin-bottom:13px}.job h2{font-size:12pt}.job p{font-size:9pt}h3{font-size:11.5pt;margin-bottom:6px}h3 span{font-size:8.5pt}section{margin-bottom:13px}li{margin-bottom:5px}h3,.job{break-after:avoid}section{break-inside:avoid}.continuation{margin-bottom:18px}.small{font-size:9pt}}'''
html='<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>王泽民｜具身智能产品经理（任务与交互方向）</title><style>'+css+'</style></head><body><main><article class="page"><header><h1>王泽民</h1><div class="target">求职方向：具身智能产品经理 · 任务与交互</div><div class="contact">电话 <b class="pending">【待填】</b>　邮箱 <b class="pending">【待填】</b>　现居地 <b class="pending">【待填】</b></div><p class="profile" data-evidence="S1">车载 AI Agent（智能体）的任务规划与主动服务产品经理，工作覆盖感知 → 任务决策 → 执行反馈闭环；希望将事件定义、工具编排与状态管理经验迁移到具身任务与交互产品。</p></header><div class="job" data-evidence="S2"><h2>字节跳动 · 豆包上车｜AI 产品经理</h2><p><b class="pending">【入职年月待填】</b> — 至今　｜　负责 Planner 任务规划与触发器产品，协调系统预设任务链路。</p></div>'+a+'<div class="page-number">王泽民 · 1 / 2</div></article><article class="page"><div class="continuation">工作经历（续）<span>王泽民 · 字节跳动 / 豆包上车</span></div>'+b+'<section class="education"><h3>教育与更早经历</h3><p>毕业院校 <b class="pending">【待填】</b>　学历 <b class="pending">【待填】</b><br>专业 <b class="pending">【待填】</b>　就读时间 <b class="pending">【待填】</b></p><p>更早工作经历 <b class="pending">【待填】</b></p></section><div class="page-number">王泽民 · 2 / 2</div></article></main></body></html>'
(out/'简历-王泽民-具身智能产品经理.html').write_text(html)
# One-to-one audit rows include original resume wording, classification, and exact locator.
head='''# 王泽民简历来源对照

核验日期：2026-11-13。对应 `简历-王泽民-具身智能产品经理.html`。仅供审查，不嵌入简历。

## 取证规则

最高优先依据：`docs/职业发展/豆包汽车到具身智能-证据评估与行动路线-v02.md`。本轮读取指定文档及本地原始逐字稿、飞书读取快照，重新统计动态示例 Excel；未实时读取远端飞书。因此项目状态均是所引证据能支持的状态，不暗示已取得最新验收。

“已确认结果”可以是有记录的数据结果，不等于整项目验收；“方案与推动”包括需求编写、协作对齐、评审；“职责范围”只说明负责范围；“设计目标”不作业绩。本稿没有采用目标数值或方案测算收益。AI 辅助整理的文档只证明文档产出，不用文件所有权推定独立原创。

## 定位、身份和时间

| ID | 简历文字 / 信息 | 分类 | 来源与边界 |
|---|---|---|---|
| S1 | 车载 AI Agent 的任务规划与主动服务产品经理；覆盖感知→任务决策→执行反馈，迁移到具身任务与交互 | 职责范围 | 最高优先报告“先给判断”、§2、§9；`wiki/comparisons/automotive-agent-to-embodied-product.md:14–20`。迁移为求职定位，不是机器人经验事实。 |
| S2 | 字节跳动·豆包上车 AI 产品经理；Planner 与触发器、系统预设任务链路 | 职责范围 | 用户本次身份及时间线要求；旧简历“工作经历”仅作身份参考；最高优先报告§2.1；`docs/职业发展/证据附件-v02/飞书读取快照/embodied-meeting-0818.md:171–192` 支持触发器与系统预设职责，不证明全部交付。 |
| S3 | 入职年月、电话、邮箱、现居地、学历、院校、专业、就读时间、更早经历 | 职责范围（信息占位） | 无可靠资料，按本次 A4 全部使用醒目【待填】；不由最早工作材料反推入职年月。 |
| S4 | 舱驾融合 2026.03 | 方案与推动 | `docs/职业发展/证据附件-v02/飞书读取快照/embodied-prd-driver.md:33–72`，3/25 初版署名；`embodied-prd-pullover.md:37–78`，3/31 评审稿署名。仅表示当期材料。 |
| S5 | 近期推进 2026.10—2026.11；10 月定时任务、11 月新手引导/宣讲 | 方案与推动 | `wiki/log.md` 2026-10-13、11-05 至 11-11 对应记录；详见 N1–N3。 |

## 经历和能力映射逐条对照

HTML 的 `data-evidence` 属性与下表 ID 对应，不在简历页面显示。

| ID | 简历原文 | 分类 | 来源文件与定位 | 限制 |
|---|---|---|---|---|
'''
rows=[]
for d in items:
    sources='<br>'.join('`'+p+'` — '+loc for p,loc in d['sources'])
    rows.append('| '+d['id']+' | '+d['title']+'：'+d['text']+' | '+d['kind']+' | '+sources+' | '+d['limit']+' |')
extra='''

## 每个业绩数字的复核

唯一量化业绩组是 P2：59、30、7、22。使用 openpyxl 只读解析原工作簿，工作表 `动态示例汇总表(SFT）`，筛选 C 列提出人为王泽民；共 59 行。H 列原始标记为 `0723实车复测pass` 30 行、`0723实车复测Fail` 7 行、空白 22 行。四数属于「已确认结果（原表记录）」。59 是提出记录行数，不是59条已修复；30/7 是标记，不是本轮实车重测；22 不能归为通过或失败。不计算整体成功率或因果提升。

筛中原始行号：411–438、440–448、459、460、464、465、468、475–477、479、496、498–504、506–510。第 464 行无复测标记，故 P1 明确待复测。复核详情见 `核验/数字复核.json`。

页码 1 / 2、2 / 2 仅为版面编号。2026.03、2026.10、2026.11 为材料时间，出处见 S4/S5，不代替任职起止日期。

## 旧简历数字及夸大表述处理

| 原稿项 | 本轮处理及依据 |
|---|---|
| 量产落地、完整走过全链路、车就是最大量产机器人 | 删除；最高优先报告§1–4和§10明确不支持这种个人成果及迁移等同。 |
| 20+ 工具、3万+ tokens、10大组件 | 不纳入个人业绩；团队系统规模不能证明本人贡献，且不影响本简历判断。 |
| 40%–70%、10%、19% | 删除；最高优先报告§9及 Planner 专项“数字逐项核实”：方案假设/数学推算，不是实测。 |
| 138条修复、33典型案例、35%非Planner | 删除；138仅分诊表记录数，个人完成及关单无证；33不作个人业绩；35%无原始统计支持。 |
| 1200+、首批近百条 | 删除，替换为本轮回原表核实的59条本人记录；缺线上库存快照。 |
| ≥90%、≥93%、P50 500ms / P90 800ms | 不保留；旧稿指标不是个人实测收益，且本人制定归属不充分。 |
| 距离500m、连续3周期15s、雪>雨>雾 | 不保留参数和独创归属；只保留有逐字稿支持的产品推动。 |
| 51函数、≤200ms、≥95%、50ms、10+角色 | 不保留：团队能力、目标和角色数量不证明个人实现；离线模型工程贡献不足。 |
| 113条司机评测、22对象/110表达 | 未引入：设计资产无逐条实跑结果及完整本人归属，见舱驾专项。 |

## 关键边界与待补

1. 新手引导：已读 `wiki/log.md` correction、`wiki/synthesis/onboarding-agent-prd.md` 和 `wiki/summaries/onboarding-meetings-2026-11-04.md`；按晚间方向修正，不写已建设独立 Agent。A/B 在需求文档中并列用于评审；DT 即 Director，与 Planner 为同一规划模块，简历统一写 Planner，避免误读成两个连续模块。11/4 对应推理计次与11/11实际播报后按账号计次存在方案演进，端侧回执待确认，未作为上线事实。
2. 新手引导原始证据补核：`raw/articles/onboarding-2026-11-05/11-06-semantic-trigger-alignment.md:29–57`，本人澄清入口及推进对齐；`raw/articles/onboarding-2026-11-09/11-09-navigation-trigger-conditions.md:11–28`，本人核对信号可得性。未将同事提出的具体触发组合认领为本人独创。
3. 触发器平台：宣讲稿已形成不代表实际开展培训；其中排期与新增能力均不写上线结果。
4. 内核：`wiki/summaries/agent-kernel-2026-11-04.md:16、46` 无法可靠认定本人发言/贡献，未收录。
5. 动态示例回退：本地 v16 第14章明确为后续方案预览，未见远端定案或验收。简历仅写整理需求；若面试要求已上线项目，不能拿此条作上线案例。
6. 需补个人基本信息，以及按版本/车辆/时间可追溯的后续复测、任务开关接入、正式天气场景和临停验收证据；若后续补齐，应另建版本，不覆盖当前交付。
'''
(out/'简历-来源对照.md').write_text(head+'\n'.join(rows)+extra)
(out/'核验/内容清单.json').write_text(json.dumps(items,ensure_ascii=False,indent=2))
print('Created HTML and source mapping;',len(items),'mapped experience/skill items')
