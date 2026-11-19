from pathlib import Path
import json,re,hashlib,collections
from html.parser import HTMLParser

ROOT=Path('/Users/bytedance/Desktop/3.23/产品/codex')
OUT=ROOT/'座舱业务学习站/research/v54-5w2h-20261113'
RAW=OUT/'raw'
SAMPLE=RAW/'approved-hotword-sample.md'
SOURCE=ROOT/'HTML/01-进行中/豆包汽车-业务学习站-v52.html'
v=json.loads((RAW/'v52-V-extracted.json').read_text())
nodes=json.loads((RAW/'v52-V-node-map.json').read_text())
diagrams=json.loads((RAW/'v52-V-diagrams.json').read_text())
atoms=json.loads((OUT/'inputs/v54-atoms.json').read_text())

class Txt(HTMLParser):
    def __init__(self):super().__init__();self.intext=0;self.out=[]
    def handle_starttag(self,t,a):
        if t=='text':self.intext+=1
    def handle_endtag(self,t):
        if t=='text':self.intext-=1
    def handle_data(self,d):
        if self.intext and d.strip():self.out.append(d.strip())

node_units={'V13':1,'V1':2,'V14':2,'V15':2,'V16':4,'V17':3,'V2':3,'V3':3,'V18':3,'V4':5,'V5':6,'V6':6,'V7':5,'V8':3,'V9':6,'V10':5,'V11':6,'V12':12}
for n in nodes['nodes']:
    atoms.append({'loc':'original-node/'+n['id'],'section':n['title'],'text':n['title']+'；'+'；'.join(n['lines'])+'。'+n['detail'],'type':'node','unit':node_units[n['id']]})
figure_units={'v34-overview':0,'v34-hotword':4,'v34-timing':5,'v34-memory':13,'v34-edge':10,'v34-h2h':14,'v45-bargein':7,'v34-poi':15,'v34-seat':15}
for k,s in diagrams.items():
    p=Txt();p.feed(s)
    atoms.append({'loc':'diagram/'+k,'section':'配图 '+k,'text':'图内文字：'+'；'.join(p.out),'type':'diagram','unit':figure_units[k]})

def choose(i,a):
    if 'unit' in a:return a['unit']
    t=a['text'];loc=a['loc'];sec=loc.split('/')[0]
    if loc.startswith('nodeExplanations'):return node_units[loc.split('/')[1]]
    if sec=='v39-map':return 0
    if sec=='v39-original':return 0
    if sec=='v39-retell':return 19
    if sec=='v39-glossary':return 20
    if sec=='v39-launcher':return 16
    if sec=='v39-plan-sync':return 15
    if sec=='v39-plan-mem':return 14 if any(x in t for x in ['人人对话','瞬时记忆']) else 13
    if sec=='v39-plan-arb':return 11 if '30B' in t else 10
    if sec=='v39-plan-lat':return 18
    if sec=='v39-s1':
        if i in (17,18):return 1
        if i<=19:return 2
        if i==25:return 18
        if 26<=i<=46:return 4
        if i==63:return 7
        return 3
    if sec=='v39-s2':
        if 88<=i<=96 or 98<=i<=105 or 111<=i<=117 or i>=134:return 6
        if 97==i or 106<=i<=110:return 3
        return 5
    if sec=='v39-s4':
        if '30B' in t or '1.4B' in t or '基座' in t or '模型的大小' in t:return 11
        if any(x in t for x in ['拒识','首句','只有一个人','单人','误接','漏接']) and not any(x in t for x in ['unsupported','本地模型','本地小模型','FC','车上能不能']):return 8
        return 9
    if sec=='v39-s5':
        if any(x in t for x in ['回写','context/sync','执行结果','端云上下文']):return 17
        if any(x in t for x in ['仲裁','3 秒','白名单','车上固定','断网兜底']):return 10
        if any(x in t for x in ['人人对话','conv_001','10 句','30 秒','非人机']):return 14
        if any(x in t for x in ['记忆','摘要','历史','20 分钟','5 轮']):return 13
        return 12
    if sec=='v39-s3':
        if 291<=i<=305:return 11
        if 325<=i<=334:return 3
        return 7
    if sec in ('v39-toolbox','v39-recap'):
        pairs=[(16,['Launcher']),(15,['家和公司','座椅位置']),(11,['30B']),(17,['回写','恢复后','执行结果回写']),(14,['上报','人人对话']),(13,['记忆','摘要']),(10,['仲裁','弱网','两遍']),(4,['热词','专有名词']),(3,['识别','ASR']),(5,['判停','截断']),(6,['提前准备','预请求','复用']),(7,['快速拒识','打断']),(8,['最终拒识','误接','漏接']),(18,['整条链','第一个字','耗时'])]
        for u,ws in pairs:
            if any(w in t for w in ws):return u
        return 0
    return 0

parts={};preamble=''
for filename in ['/private/tmp/v54-root-opening.md','/private/tmp/v54-voice-content.md','/private/tmp/v54-memory-content.md','/private/tmp/v54-closing-content.md','/private/tmp/v54-root-ending.md']:
    text=(OUT/'inputs'/Path(filename).name).read_text();hits=list(re.finditer(r'^## (\d+)\. .+$',text,re.M))
    if filename.endswith('opening.md'):preamble=text[:hits[0].start()]
    for j,m in enumerate(hits):parts[int(m.group(1))]=text[m.start():hits[j+1].start() if j+1<len(hits) else len(text)].strip()
sample=SAMPLE.read_text();(RAW/'approved-hotword-sample.md').write_text(sample)
parts[4]='## 4. 热词\n\n'+sample
hotledger=(OUT/'inputs/v54-hotword-ledger.md').read_text()
note_at=hotledger.find('### 可放在原文之后的校注')
if note_at>=0:parts[4]+='\n\n'+hotledger[note_at:].replace('### 可放在原文之后的校注（不改样稿）','### 样稿外校注',1)
else:parts[4]+='\n\n### 样稿外校注\n\n原文按要求保留；样稿核验、适用边界及待确认项详见 facts-ledger.md 的 V04 条目。不要把样稿中的历史案例等同于当前上线状态。\n'
core=dict(parts)

def norm(t):return re.sub(r'[\s`，。；：、|]+','',t)
seen={};dest=[];archive=collections.defaultdict(list)
reviewed_merges={}
for name in ['root','voice','memory','closing']:
    p=OUT/'inputs'/('v54-'+name+'-merges.json')
    if p.exists():reviewed_merges.update(json.loads(p.read_text()))
structural_prefix=('| 段落 |','| 类别 |','| 看什么 |','| 时间 |','| 主驾此刻','| 方案 |','| 用户说的话','| 谁负责','| 阶段 |','| 豆包的状态','| 用户看到的问题','| 步骤 |','| 还没定的事','| 环节 |','| 正文里的说法')
for i,a in enumerate(atoms):
    a['unit']=choose(i,a);a['id']=f'K{i+1:04d}';a['source_line']=i+1
    key=norm(a['text'])
    if a['id'] in reviewed_merges:
        m=reviewed_merges[a['id']]
        assert m['evidence'] in core[m['unit']], (a['id'],m['evidence'])
        a['destination']='正文合并';a['merge']=f'单元 {m["unit"]} 正文';a['unit']=m['unit'];a['evidence']=m['evidence'];a['merge_reason']=m['reason'];seen[key]=a
    elif key in seen:
        a['destination']='合并';a['merge']=seen[key]['id'];a['unit']=seen[key]['unit']
    elif a['text'].startswith(structural_prefix):
        a['destination']='合并';a['merge']=f'单元 {a["unit"]} 对应表头（结构，不另计业务事实）'
    else:
        a['destination']='查阅区';seen[key]=a;archive[a['unit']].append(a)
    dest.append(a)

# Each source block is retained literally; current corrections are given before old wording.
corrections={
  15:'本单元正文已按本轮读取的 V1.1 需求更新。旧稿中“关闭记忆/离线仍待定”“家和公司只存豆包且未定稿”等属于旧时点，不能覆盖当前正文的 Profile 双向同步、车主分流及异常规则；三种方案选型与实际上线仍需区分。',
  13:'本轮读取的 PRD 在第 638 行写最多 28 轮；旧缓存 22 轮、会议口述 30 轮分别保留。它们不能作为同一车型同时生效的配置。',
  18:'旧稿约 117/215/275/1020/467 ms 数据对应 10 月 16～23 日冻结窗口，“11 月初”标期不准确；最后一项原指标为 TTS 首 Token，不等于用户听到首字。具体纠正见 facts-ledger.md 的 LAT 条目。',
  4:'样稿正文逐字保留。下面补齐 v52 的第七类识别背景“车辆当前位置”和历史测试，不改样稿原表。8 月 17 日“暂停视频”原始记录指向页面词匹配；冷热排序算法、95% 的原始计算值等仍按 V04 台账核对。',
  11:'这里只保留旧稿模型说法供追溯。职责、基座、部署与上线状态以本单元正文四列对照表为准；不能把模型规模当作云端 DT 已用型号。'
}
for u,rows in archive.items():
    extra='\n\n### 查阅区补充：v52 历史口径逐项保留\n\n'
    extra+='以下是旧稿的原文对照，不是新增的当前实现承诺。它们用于复盘历史指标、版本和旧方案；正文已核对的新口径优先。每项编号可在 destinations.md 找到原位置，在 facts-ledger.md 找到证据等级。\n\n'
    if u in corrections:extra+=corrections[u]+'\n\n'
    for a in rows:extra+=f'**{a["id"]}｜旧稿对照**\n\n'+a['text'].replace('\n','\n\n')+'\n\n'
    parts[u]+=extra

content=preamble+'\n\n'.join(parts[u].rstrip() for u in range(21))+'\n'
(OUT/'content.md').write_text(content)
(RAW/'v52-readable.txt').write_text('\n'.join(a['loc']+'\t'+a['text'].replace('\n',' ') for a in atoms)+'\n')
(RAW/'coverage-inventory.json').write_text(json.dumps(dest,ensure_ascii=False,indent=2))

def esc(s):return str(s).replace('|','\\|').replace('\n',' ')
def nums(s):return '；'.join(dict.fromkeys(re.findall(r'(?<![A-Za-z_])\d+(?:[.,]\d+)*(?:[%％]|[Bb]|\s*(?:ms|毫秒|秒|分钟|轮|句|条|个|token|月|日|年))?',s)))

desttext='# v52 V 章知识点去向\n\n'
desttext+='范围：v52 实际展示的 `pages[id=V].v34.sections` 全部正文与折叠内容、18 个节点的 `nodeExplanations`、原始 18 节点字段及本章引用的 9 张 SVG 图内文字。镜像字段 `sections`、`teaching.lessons` 与已替代的 `voiceEdition` 不重复计数；原始 HTML 未修改。\n\n'
desttext+='计数口径：以原文段落、表格数据行、节点说明或单图文字集合为“来源条目”；不声称这是去重后的概念数量。结构性表头和完全重复的条目标明合并；新正文已经完整解释的旧讲解由逐条审稿确认合并，并列出目标正文短摘，未用相似度猜测覆盖。独有历史数字、案例或条件仍落到对应单元查阅区。\n\n'
counts=collections.Counter(a['destination'] for a in dest)
desttext+=f'总计 {len(dest)} 条；正文合并 {counts["正文合并"]} 条；查阅区 {counts["查阅区"]} 条；重复/结构合并 {counts["合并"]} 条；无去向 0 条。正文概念与查阅材料共同组成该单元，统计不把正文的同义讲解再加一遍。\n\n'
desttext+='| 单元 | 正文合并 | 查阅条目 | 重复/结构合并 |\n|---|---:|---:|---:|\n'
for u in range(21):desttext+=f'| {u} | {sum(a["unit"]==u and a["destination"]=="正文合并" for a in dest)} | {sum(a["unit"]==u and a["destination"]=="查阅区" for a in dest)} | {sum(a["unit"]==u and a["destination"]=="合并" for a in dest)} |\n'
desttext+='\n| ID | v52 原文位置 | 知识点原文/摘要 | content.md 去向 | 处理 |\n|---|---|---|---|---|\n'
for a in dest:
    target=f'单元 {a["unit"]}／查阅区补充／{a["id"]}' if a['destination']=='查阅区' else f'合并到 {a["merge"]}'
    if a['destination']=='正文合并':target+='；正文定位：“'+a['evidence']+'”；'+a['merge_reason']
    desttext+=f'| {a["id"]} | {esc(a["loc"])}；raw/v52-readable.txt:{a["source_line"]} | {esc(a["text"])} | {target} | {a["destination"]} |\n'
(OUT/'destinations.md').write_text(desttext)

ledger='# V54 事实台账\n\n'
ledger+='状态解释：已确认＝已读取的指定来源支持该表述；不等于所有车型现在已上线。待确认＝缺少原文、当前配置或验收，或材料本身未定。资料冲突＝来源并列口径尚不能统一，正文保留差异。文档需求、历史现状、评测、长期规划、讨论与待办另列。\n\n'
ledger+='证据分层：下方 Vxx/LAT 条目尽量回到 PRD、技术文档、测试原文或会议逐字稿；K 条目仅确认“v52 曾这样记载”，属于用户允许使用的旧稿材料，原始业务断言未全部重新独立验证，因此不用于追加当前实现结论。K 条目的已确认只指旧稿原文保留准确，绝不升级为一手事实。配图节点数、5W2H 的 7 问、30 秒/三分钟口述时长、示例假设与排查建议是本稿教学设计。\n\n'
ledger+='## 单元 0、19、20 与教学设计\n\n| ID | 事实/规则 | 状态 | 性质 | 来源与原文位置 |\n|---|---|---|---|---|\n'
ledger+=f'| V00-F01 | 沿用 v52 12 步总图及图标题；原始节点图另有18节点 | 已确认 | 旧稿图示索引 | {RAW}/v52-V-extracted.json，v34.sections[id=v39-map] 的 fig 注释；{RAW}/v52-V-node-map.json，nodes |\n'
ledger+=f'| V00-F02 | 流式识别与判停并行；软判停预准备、二遍定稿；提前停播不等于执行 | 已确认 | 方案规则 | {ROOT}/座舱业务学习站/research/v-lesson-20261105/voice-onepage.md:9-29,61-161；“用于实时判断，不代表最终文本” |\n'
ledger+=f'| V00-F03 | Director结合Context和反馈形成任务规划、执行反馈、动态修正闭环 | 已确认 | PRD | 《Director（对话推理引擎）PRD》{ROOT}/座舱业务学习站/research/v-lesson-20261105/director-prd.md:358-486；“需求解析—任务规划—执行反馈—动态修正” |\n'
ledger+=f'| V00-F04 | 车端/AIDV/豆包云/Speech分工，识别文本回车端后再正式发文本对话 | 已确认 | 链路说明 | 《豆包 × AIDV端云链路OnePager》{ROOT}/座舱业务学习站/research/v-lesson-20261105/aidv-onepage.md:1-38,52-98 |\n'
ledger+='| V19-F01 | 约三分钟主口述、30秒摘要及5W2H结构 | 已确认 | 用户要求/教学时长目标，非产品性能 | 本轮用户“每个单元固定结构”“三分钟讲给别人听”；未做实际录音计时 |\n'
ledger+='| V20-F01 | 术语表按输入、输出、步骤和部署解释已有概念 | 已确认 | 前文索引，不新增实现 | 每行“在哪一步”回指对应单元事实ID；模型与部署的未知仍保留 |\n'
for filename in ['voice','hotword','memory','closing','latency']:
    ledger+='\n'+(OUT/'inputs'/('v54-'+filename+'-ledger.md')).read_text()+'\n'
ledger+='\n## 逐条旧稿留存台账（K 条目）\n\n每条列出原句中的数字/版本字面量；模型名与规则完整保留在断言列。证据等级统一为旧稿二级材料，来源是 v52 的原文抽取，不能与上方一手核验等量使用。\n\n'
ledger+='| ID | 单元 | 数字/日期/版本字面量 | 保留的原文断言 | 状态 | 证据与限制 |\n|---|---|---|---|---|---|\n'
for a in dest:
    t=a['text'];status='已确认'
    if any(w in t for w in ['待确认','待核','待定','尚未定','没有找到原文','没有读取权限','不确定','仍待','待统一']):status='待确认'
    if any(w in t for w in ['资料冲突','对不上','资料不一致','两份资料分别','口径不一']):status='资料冲突'
    if a['loc']=='v39-plan-lat/6':status='资料冲突'
    if a['id']=='K0361':status='已确认' # 文风“对不上”不是资料口径冲突
    if a['id']=='K0376':status='待确认' # 不同发布日期是待核计划，未证明当前规则冲突
    a['status']=status
    desc='仅确认旧稿记录；不代表当前值。'
    if a['unit']==15:desc+='已被新方案补充/修订的部分以 V15 正文为准。'
    if a['unit']==18:desc+='历史计时口径纠正参见 LAT 条目。'
    ledger+=f'| {a["id"]} | {a["unit"]} | {esc(nums(t)) or "—"} | {esc(t)} | {status} | v52《豆包汽车-业务学习站》V章；{RAW}/v52-readable.txt:{a["source_line"]}；原JSON位置 {esc(a["loc"])}。{desc} |\n'

# Detailed unresolved index, including all primary and legacy rows, is generated from status cells.
unresolved=[]
for line in ledger.splitlines():
    if not line.startswith('| '):continue
    cells=re.split(r'(?<!\\)\|',line)[1:-1];cells=[x.strip() for x in cells]
    if not cells or not re.match(r'^(?:V\d{2}-[FCU]\d+|LAT[-A-Za-z0-9]*|K\d{4})$',cells[0]):continue
    status=next((x for x in cells if x in ('待确认','资料冲突')),None)
    if status:unresolved.append((cells[0],status,cells[1] if not cells[0].startswith('K') else cells[3]))
ledger+='\n## 待确认与资料冲突完整索引\n\n| ID | 状态 | 事项 |\n|---|---|---|\n'
for id,status,claim in unresolved:ledger+=f'| {id} | {status} | {esc(claim)} |\n'
ledger+='\n## 本轮读取范围与证据缺口\n\n- 已实时搜索飞书并读取《豆包记忆和车机记忆打通方案》及《记忆系统》全文，原文和返回状态保存在 raw/。\n- 11 月 10 日同步讨论纪要直读返回 forBidden；11 月 11 日 minutes 链接不被该读取接口识别，妙记检索无命中。详细文档搜索命中 15 条相关材料，不表示已读全部正文；没有拿到这两场逐字稿，未据 AI 纪要追加会议结论。\n- 已用本地可读逐字稿核对对应 11 月 3/4 日、10 月 12/21/22/27 日等条目；每条实际使用位置列在上方，未以会议计划证明发布。\n- 未修改任何 HTML；只读取 v52 并保存其抽取副本。\n'
(OUT/'facts-ledger.md').write_text(ledger)

stats=[]
for u in range(21):
    body=core[u]
    stats.append({'unit':u,'title':body.splitlines()[0].split('. ',1)[1],'chinese_characters':len(re.findall(r'[\u4e00-\u9fff]',body)),'nonwhitespace_characters':len(re.sub(r'\s','',body)),'with_reference_characters':len(re.sub(r'\s','',parts[u])),'reference_entries':len(archive[u])})
result={'source_sha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'sample_sha256':hashlib.sha256(SAMPLE.read_bytes()).hexdigest(),'sample_exact_substring':sample in content,'coverage_total':len(dest),'coverage_distribution':dict(counts),'unmapped':0,'stats':stats,'unresolved':unresolved}
(RAW/'delivery-stats.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
print(json.dumps({'coverage_total':len(dest),'distribution':dict(counts),'sample_exact':sample in content,'units':len(parts),'files_chars':{n:len((OUT/n).read_text()) for n in ['content.md','facts-ledger.md','destinations.md']},'unresolved_count':len(unresolved)},ensure_ascii=False))
