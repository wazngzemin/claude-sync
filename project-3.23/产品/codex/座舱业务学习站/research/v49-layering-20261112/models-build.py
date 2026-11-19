import json, re, hashlib
from pathlib import Path
from html.parser import HTMLParser

ROOT = Path(__file__).parent
baseline = json.loads((ROOT / 'baseline-v.json').read_text())

class Blocks(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=False)
        self.source, self.depth, self.blocks, self.start = source, 0, [], 0
        self.feed(source)
    def pos(self):
        line, col = self.getpos()
        return sum(map(len, self.source.splitlines(keepends=True)[:line-1])) + col
    def handle_starttag(self, tag, attrs):
        if not self.depth: self.start = self.pos()
        if tag not in ('br','hr','img','input','meta','link'): self.depth += 1
    def handle_endtag(self, tag):
        self.depth -= 1
        if not self.depth: self.blocks.append(self.source[self.start:self.pos()+len(tag)+3])
    def handle_comment(self, text):
        if not self.depth: self.blocks.append('<!--' + text + '-->')

def p(text): return '<p>' + text + '</p>'
def note(text): return '<div class="v39-note">' + text + '</div>'
def h(text): return '<h3 class="v39-h3">' + text + '</h3>'
def detail(id, question, body):
    return '<details class="v49-detail" id="'+id+'"><summary>'+question+'</summary><div class="v49-detail-body">'+body+'</div></details>'
def table(head, rows, id=''):
    return '<div class="v34-table"'+(' id="'+id+'"' if id else '')+'><table><thead><tr>'+''.join('<th>'+s+'</th>' for s in head)+'</tr></thead><tbody>'+''.join('<tr>'+''.join('<td>'+s+'</td>' for s in row)+'</tr>' for row in rows)+'</tbody></table></div>'
def link(url, title): return '<a href="'+url+'" target="_blank" rel="noopener noreferrer">'+title+'</a>'
INVENTORY = link('https://bytedance.larkoffice.com/wiki/TdCmwVDegialujkNe1FcQlmAnag?sheet=0f2928', '奇瑞海外 AICAR 算法盘点')
REGISTRY = link('https://bytedance.larkoffice.com/wiki/Cyjlwa7eIi7i0kkDlgkc6RFPnIe', 'AI 汽车模型资源维护')
WEEKLY = link('https://bytedance.larkoffice.com/wiki/MvTIwiTZGif70SkNdtrcrM0lnsg', 'H2 工程双周报')

sections, ledger = [], []
for old in baseline['sections']:
    sid = old['id']
    if sid not in ('v39-s3','v39-s4'): continue
    b = Blocks(old['html']).blocks
    assert ''.join(b) == old['html']
    out = {i:s for i,s in enumerate(b)}
    entries = {}
    def mark(indices, action, dest, reason):
        for i in indices:
            entries[i] = {'action':action,'destination':dest,'reason':reason}
    def fold(start,end,id,question,body=None):
        out[start] = detail(id,question,body if body is not None else ''.join(b[start:end+1]))
        for i in range(start+1,end+1): out[i]=''
        mark(range(start,end+1),'就地折叠',id,'保留独有知识，首次阅读不展开历史或评测细节')
    if sid == 'v39-s3':
        out[2]=p('先看系统拿到了什么字、凭什么判断是在跟豆包说，以及判定后会发生什么。训练和历史成绩放在对应位置，排查问题时可以展开。')
        mark([2],'修正','正文','按分层阅读调整引导，不改变业务顺序')
        # Separate ASR performance/vendor history from current responsibility and state rules.
        tr=re.findall(r'<tr>.*?</tr>',b[13])
        head=tr[0]
        moved=[r for r in tr[1:] if any(k in r for k in ['是谁家的','准不准'])]
        kept=[r for r in tr[1:] if r not in moved]
        out[13]='<div class="v34-table"><table><thead>'+head+'</thead><tbody>'+''.join(kept)+'</tbody></table></div>'
        out[18]=p('本段的例子属于第二种：豆包正在播报，已经是激活状态，两套识别都在跑。')
        out[20]=b[20]+detail('v49-s3-asr-project-history','各车型用了哪家识别，历史测试和日志说明了什么？','<div class="v34-table"><table><thead>'+head+'</thead><tbody>'+''.join(moved)+'</tbody></table></div>'+p('10 月 12 日查赛力斯日志的记录是“大部分命中的都是在线”，只有少部分车控最后采用了离线识别的字。这是该次日志的观察，不代表所有项目都如此。'))
        mark([13,18],'正文及就地折叠','正文 / v49-s3-asr-project-history','职责和激活状态正文保留；供应商、芯片、历史成绩、日志移入就地折叠')
        mark([20],'正文及就地折叠','正文 / v49-s3-asr-project-history','项目适用范围正文保留')
        out[32]=detail('v49-s3-recall-test-rules','测试集用哪四条标准标记“应该接话”？',b[32])
        mark([32],'就地折叠','v49-s3-recall-test-rules','前文实例已交代核心判断，评测标准保留供查阅')
        out[35]=b[35].replace('不是每次有人开口都要请模型。大部分情况靠规则就能定，模型只在最难的情况出场。','系统先看当前有没有播报、是否明确叫了豆包，再决定是否请模型判断。')
        mark([35],'修正','正文','去掉未经量化的“大部分”，保留四项触发条件')
        out[37]=p('“车上几个人”本身也是判断出来的，人数判错，这张表就会走错行。人数信号如何从人脸扩展到音区、座椅压力，以及当时出现的问题，放在第四段的规则记录里。')
        mark([37],'合并','v49-s4-person-rule-history','历史日期和信号组合与第四段重复，正文保留分支影响')
        out[42]=b[42]+p('这是本地对话 PRD 的判断原则，不能据此认定每次流式拒识都实际收到了人数和视线。它们有没有进入模型输入，要按对应项目的请求记录核对。')
        mark([42],'修正','正文','把产品原则与实际输入区分，避免暗示所有版本均接入')
        out[48]=detail('v49-s3-output-label-history','INCOMPLETE、IGNORE、Wait、Attend 在不同方案里各指什么？',b[48]+b[51])
        out[51]=''
        mark([48,51],'就地折叠','v49-s3-output-label-history','标签沿革和四合一实验合并一处，正文保留信息不足要等的处理')
        out[52]=h('三个职责分开看：停播、给车控指令、决定整句接不接')
        out[53]=p('主驾说“帮我把副驾座椅加热打开”时，流式拒识先决定豆包要不要停播；等他说完，端侧车控模型可以尝试把整句翻成指令，云端最终拒识判断整句是否该接。<b>流式拒识和端侧车控是两项不同的处理职责。</b>都写着 1.7B，只能说明参数规模相同，不能据此把它们当成同一个调用，也不能据此认定一定有两个独立模型包。')
        out[54]=table(['职责','何时处理、读什么','交出什么','能否执行车辆动作','模型与部署范围'],[
            ['流式拒识：先判断要不要停播','用户还在说，满足本段规则后；读当前过程文字和实际带入的最近对话','接话、拒识或继续等；接话时通知车上停播','只影响当前播报，不能凭半句话开座椅加热','资料涉及 Qwen3 1.7B。赛力斯本地对话方案在车上判断；H2 双周报记录上汽这项能力在 H20 云端服务器部署'],
            ['端侧车控：把整句变成车辆指令','本地拿到识别文字后，按本地链路准入；读本地文字和有限的对话历史','能办：函数及参数；不该接：拒识；超出能力或拿不准：交云端','给出指令还要过端云采纳规则。车上模型的结果通常用于断网或云端超时兜底，第四、五段展开','国内端侧 LLM 盘点也写 Qwen3 1.7B；各项目版本继续演进，不能按参数规模认定与流式拒识共用当前权重'],
            ['云端最终拒识：决定整句接不接','正式请求阶段；读定稿文字和对话历史，符合条件时复用提前准备的结果','这句话接或不接；另受单人、唤醒首句等外部规则影响','通过后仍需 Planner 和下游判断能力并执行；拒识本身不输出车控动作','盘点中的普通拒识为 Doubao-Seed-2.0-lite 260428/SFT，部署在云端；不能与 H20 上的流式拒识混为一项']
        ],'v49-model-role-comparison')
        out[55]=p('这里要把“基座”和“项目版本”分开。基座是开始训练时使用的模型，'+INVENTORY+'把端侧 LLM 写为基于 Qwen3 1.7B（约 17 亿参数），覆盖车控、通用拒识、流式拒识，流式拒识栏还写了“同端侧 LLM”。同一份表也明确写着“尚无统一主线模型，主要随项目演进”。因此，这些文字支持多任务训练与复用关系，<b>还不足以证明上汽、赛力斯的流式拒识与车控在当前版本使用同一份训练参数或同一个交付包</b>。具体版本需要核对'+REGISTRY+'，本轮读取无权限。')+p('部署位置则有直接记录：'+WEEKLY+'在 10 月 20 日至 11 月 2 日一节写“上汽端侧流式拒识模型 h20 部署，与 sls 最新版端侧模型对齐”，sls 指赛力斯。上汽这一路需要联网；赛力斯本地方案在车上运行，但断网时是否仍能完成当前判断，还取决于模型当时拿到的是哪一路识别文字。不能只看到“端侧模型”四个字就判定它一定在车里运行。')
        out[56]=''
        mark([52,53,54,55],'修正','正文 / v49-model-role-comparison','改为三个业务职责，拆开基座、训练版本、部署位置；撤销共用同权重的无范围断言；算力不足这一旧解释移到接口缺口内标为未独立核实')
        mark([56],'合并及修正','v39-s4 本地模型松紧原则','9/15逐字稿谈本地整句拒识和云端严格准入，不直接证明流式打断偏宽')
        out[57]=p('车上模型在用户说完后也会给整句结论。按 AIVA 本地对话 PRD 的 9 月 30 日修改口径，有网且声音已上云时，本地给出“能办”或“拒识”都不能直接替代云端结果；断网时可走本地能力，全时聆听且声音尚未上云时，本地拒识可使系统继续不唤醒、不上云。云端 3 秒超时后，本地车控指令可作兜底；<b>已上云但超时的本地“拒识”能否采纳，PRD 两处写法有冲突，仍待确认</b>。')
        mark([57],'修正','正文','不把存在冲突的超时拒识写成确定生效条件；保留端云执行界限')
        out[58]=p('两次判断可能不一致：先停播，整句出来后又被云端拒识。这时被打断的话要不要接着说，见 I 章“插话、打断与恢复”。')+detail('v49-s3-stop-then-reject','先停播、整句又被拒识，在赛力斯记录中占多少？',b[58])
        mark([58],'正文及就地折叠','正文 / v49-s3-stop-then-reject','分支结果正文保留，30%历史批次指标折叠')
        history=''.join(b[60:68])
        history=history.replace('这个端侧模型是分步合起来的：','以下是旧稿按历史双周报整理的任务合并过程，只说明相应时期的研发演进，不代表各项目当前交付同一份权重：')
        history=history.replace('H2 双周报的最新数字：','旧稿引用的 H2 双周报批次数字：')
        history+=note('“二合一”“三合一”讲的是把哪些训练任务合并。具体车上或服务器加载哪一版，需要车型、版本号和交付包一起核对；上面的历史合并过程不能替代这个核对。10 月 12 日版本差异一项本轮未重读对应测试周会逐字稿，作为历史记录保留，不据此认定当前部署。')
        fold(59,67,'v49-s3-training-history','样本从哪来，怎样训练，二合一和三合一经历了什么？',history)
        evolution=''.join(b[69:72]).replace('长期方案（现在的做法）','长期方案及后续落地方式')
        fold(68,71,'v49-s3-bargein-evolution','为什么从说完再停，改成边听边判断？',evolution)
        out[72]=h('验收时同时看停得快不快、该不该停')
        out[73]=p('停得慢，用户会觉得豆包抢话；停错了，乘客之间聊天也会让豆包频繁断句。评估必须固定项目、模型版本和同一批测试数据，再分别看两类问题。')+detail('v49-s3-bargein-benchmarks','历次打断延迟、误停案例和准确率分别是什么口径？',''.join(b[73:79]).replace('同一个模型，在不同数据上数字差别很大：','不同时间、项目和数据集得到的数字差别很大，不能视为同一模型版本：').replace('74.75% 是上汽最新也最严格的一组线上数据','74.75% 是这里列出的 10 月 10–12 日上汽线上回流数据结果'))
        for i in range(74,79):out[i]=''
        mark(range(72,79),'正文及就地折叠','正文 / v49-s3-bargein-benchmarks','保留验收问题，日期、数字、案例和统计限制原位折叠；撤销“最新”泛称')
        out[79]=b[79].replace('只压其中一个，另一个就会变差。','调整一个指标时，要同时检查另一个有没有变差。')
        mark([79],'修正','正文','不把经验上的权衡写成必然关系')
        out[81]=b[81].replace('两套识别同时把声音变成字，在线识别的过程文字一版版传回车上。','按赛力斯激活态方案，两套识别同时把声音变成字，过程文字逐次更新。').replace('端侧 1.7B 小模型读','负责流式拒识的模型读')
        out[83]=p('本段还有两个接口问题未核清：流式打断实际采用在线还是离线的过程文字；召回后是否停止后续流式调用。它们影响断网可用性和重复调用，不能用整句车控的输入规则代替。')+detail('v49-s3-stream-interface-gap','哪些接口描述没有原文权限，当前依据是什么？',b[83]+p('原稿把上汽的 H20 部署解释为车上算力不够。本轮可直接核实的是部署位置与版本对齐记录，具体硬件原因尚未独立核实，不能据此概括所有上汽车型。'))
        mark([81,83],'修正及就地折叠','正文 / v49-s3-stream-interface-gap','消除主例对在线过程文字的过度断言，核心缺口正文可见')
        out[84]=b[84]+p('补核：'+INVENTORY+'（已读完整表格，修订号 211）；'+REGISTRY+'（2026 年 11 月 12 日读取返回 131006，无权限）。')
        mark([84],'正文','来源区','原有来源完整保留，增补本轮事实核验来源')
    else:
        out[4]=b[4].replace('<td>端侧 1.7B 小模型</td>','<td>Qwen3 1.7B 流式拒识，部署按项目区分</td>')
        mark([4],'修正','正文','比较的是流式和最终拒识，不再把所有 1.7B 调用写成一个端侧模型')
        train=''.join(b[8:17]).replace('云端这个模型和第二段讲的车上 1.7B 不是同一个，它是在豆包 Seed-2.0-Lite 上专门训练的。','这份历史记录中的云端最终拒识基于豆包 Seed-2.0-Lite 训练，和前面 Qwen3 1.7B 的流式拒识分开看。')
        train=train.replace('调拒识就是在两头之间找平衡，没有“都降到零”的做法。','这几版结果说明当时的修改有取舍，必须同时检查两类错误。')
        fold(7,16,'v49-s4-final-training-history','云端最终拒识历次版本、评测集和训练方式是什么？',train)
        out[7]=p('云端最终拒识使用专门训练的语义拒识模型。'+INVENTORY+'把普通拒识列为 Doubao-Seed-2.0-lite 260428/SFT；这是基于该基座训练出的判断能力，负责整句接不接，不负责生成车辆执行指令。一次判断带多少轮历史，当前值仍待核实。')+out[7]
        mark(range(7,17),'正文及就地折叠','正文 / v49-s4-final-training-history','正文保留职责、基座和输入缺口，完整历史成绩、训练、采样口径就地折叠')
        history=''.join(b[20:23]).replace('还是给模型的人数错了','还是模型外规则使用的人数信号错了')
        fold(20,22,'v49-s4-person-rule-history','单人不拒识如何形成，人数信号和准确率发生过什么问题？',history)
        out[20]=p('这里要分开查两个故障：模型把用户的话判错了，或者人数被判错，导致外部规则把结果改写了。“人数参与规则”也不等于“人数已传给模型”。单人不拒识的开关和项目版本要单独核对。')+out[20]
        mark(range(20,23),'正文及就地折叠','正文 / v49-s4-person-rule-history','正文保留规则边界，日期、评测、会议观点折叠')
        out[25]=h('车上这条路：固定说法和本地车控模型各做什么')
        out[26]=p('同一时间，车上用本地识别文字处理自己的链路，不等云端定稿。AIVA 本地对话 PRD 的顺序是先匹配固定说法，未命中再请求本地模型；'+INVENTORY+'则把端侧算法写成规则与模型并行。两份资料描述的范围不同，下面按业务职责解释：固定说法负责确定性指令，本地模型负责理解更多说法，最终是否执行都看对应项目的采纳规则。')
        out[27]=table(['','固定说法','端侧车控模型（1.7B）'],[
            ['是什么','预先配好的“说法 → 指令”对照表，研发叫高频缓存、正则缓存','把本地识别文字翻成函数与参数，研发叫 FC（函数调用）；同时判断不该接或本地办不了'],
            ['读什么、交出什么','只读本句；匹配成功后交出配置好的指令','读本句与车上的有限历史；交出能办、不该接、办不了三类结果之一'],
            ['何时能执行','只有属于该项目已启用白名单并符合采纳规则，才能抢先执行','产出指令后仍要过端云仲裁。9 月 30 日修改口径下，模型车控主要在断网或云端 3 秒超时时兜底'],
            ['例子','“打开空调”“空调调到23度”“导航回家”“放大地图”“退出语音”，初始约 30 条','“副驾座椅加热开两档”']
        ])
        oldrows=re.findall(r'<tr>.*?</tr>',b[27])
        perf=[r for r in oldrows if '<td>快慢</td>' in r or '<td>准不准</td>' in r]
        out[27]+=detail('v49-s4-local-latency-history','固定说法和本地模型曾测到多快、多准？','<div class="v34-table"><table><thead><tr><th>指标</th><th>固定说法</th><th>本地模型</th></tr></thead><tbody>'+''.join(perf)+'</tbody></table></div>'+p('这些是各批次测试或目标值；本地模型详细效果见本段后面的评测记录。'))
        mark([25,26,27],'修正及就地折叠','正文 / v49-s4-local-latency-history','删除“第二段讲过的那个模型”，FC职责和执行门槛留正文，测速折叠；交代串行/并行资料范围差异')
        out[28]=b[28].replace('<b>固定说法为什么敢直接执行？</b>','<b>固定说法怎样取得优先执行资格？</b>').replace('满足这三条的说法，对上了就不会错。','这些门槛用于降低误匹配；实际执行前仍要确认说法与指令配置正确、车辆能力已接入。')
        mark([28],'修正','正文','保留三项准入标准，撤销“不会错”绝对结论')
        out[29]=b[29]+p('这里的“能办”是本地模型给出的候选结论，不能直接当成动作已经完成。盘点写模型训练覆盖 600 多个车控函数，工程链路实际生效不足 100 个；训练时见过的功能，也要等项目接入后才能执行。')
        mark([29],'修正','正文','补足模型覆盖与项目可执行能力的差别')
        out[32]=b[32].replace('9 月 15 日周会上的原话：','9 月 15 日产品周会文字记录 01:12:29 对本地拒识的要求是：')
        mark([32],'正文','正文','已核逐字稿，保留引文真实范围，不再推导流式打断松紧')
        out[35]=p('本地模型有时会把超出能力的请求判成能办，或把能办的请求交给云端。因此要分别验收“归不归本地办”和“函数、参数写得对不对”，不能只看一个总准确率。')
        out[34]=h('验收本地模型：分清分流错误和指令错误')
        fold(36,37,'v49-s4-local-benchmarks','赛力斯本地车控与拒识评测，各批次数字和问题分布是什么？',''.join(b[36:38]).replace('那是另一种算法','那是另一种统计口径').replace('<b>主要瓶颈不是“翻译指令”，而是“判断这件事归不归我”</b>','<b>该批错误主要集中在“判断这件事归不归我”</b>'))
        mark([34,35],'修正','正文','保留业务验收问题，避免把某批成绩当跨项目现状')
        out[38]=b[38]
        out[40]=b[40].replace('定稿文字“带我去昨天那家游泳馆附近的餐厅”出来后，两条路同时开跑。','用户说完后，云端用定稿文字“带我去昨天那家游泳馆附近的餐厅”判断，车上也用本地识别文字处理。').replace('1.7B 小模型判断','端侧车控模型判断')
        mark([40],'修正','正文','与本地不等云端定稿保持一致，并明确车控职责')
        out[44]=b[44]+p('补核：'+INVENTORY+'（修订号 211）。9 月 15 日关于本地拒识松紧的原话已对照文字记录；折叠中的其余历史会议条目本轮未重新取逐字稿，保留为历史记录，不用来确认当前车型上线情况。')
        mark([44],'正文','来源区','原有来源保留，明确本轮会议复核范围')
    html=''.join(out[i] for i in range(len(b)))
    sections.append({'id':sid,'title':old['title'],'html':html})
    for i, block in enumerate(b):
        entry={'section_id':sid,'old_block_index':i,'old_tag':block.split('>',1)[0]+'>','old_excerpt':re.sub('<[^>]+>',' ',block)[:180], 'old_sha256':hashlib.sha256(block.encode()).hexdigest()}
        entry.update(entries.get(i,{'action':'正文','destination':'原段落','reason':'职责、输入输出、触发条件、执行边界、图解或来源保持可见'}))
        ledger.append(entry)
    assert re.findall(r'<!--fig:.*?-->',old['html'])==re.findall(r'<!--fig:.*?-->',html)
    for content in re.findall(r'<details\b.*?</details>',html,re.S): assert '<!--fig:' not in content
    assert set(re.findall(r'https://[^"<> ]+',old['html'])) <= set(re.findall(r'https://[^"<> ]+',html))

(ROOT/'models-patch.json').write_text(json.dumps({'sections':sections},ensure_ascii=False,indent=2))
(ROOT/'models-ledger.json').write_text(json.dumps({'schema':'one entry per old top-level HTML block; indices are zero-based','sections':['v39-s3','v39-s4'],'entries':ledger},ensure_ascii=False,indent=2))
print(json.dumps({'sections':len(sections),'old_blocks':len(ledger),'details':sum(s['html'].count('<details ') for s in sections),'figures':sum(s['html'].count('<!--fig:') for s in sections)},ensure_ascii=False))
