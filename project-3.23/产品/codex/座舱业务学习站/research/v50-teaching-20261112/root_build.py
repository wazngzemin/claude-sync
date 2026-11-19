import json,re
from pathlib import Path
D=Path(__file__).parent;v=json.loads((D/'baseline-v.json').read_text());base={s['id']:s for s in v['sections']};patch={};ledger=[]
def put(sid,title,h,dest):
 old=base[sid];patch[sid]={'id':sid,'title':title,'html':h};ledger.append({'section':sid,'knowledgeDestinations':dest,'oldTextPreservedInBaseline':True})
def fold(id,title,h):return '<details class="v49-detail" id="'+id+'"><summary>'+title+'</summary><div class="v49-detail-body">'+h+'</div></details>'
intro='<p>主驾说<b>“带我去昨天那家游泳馆”</b>，停了一下，又补充<b>“附近的餐厅”</b>。他要找的是餐厅，游泳馆只是位置参照。系统如果按前半句开始导航，就办错了；如果所有计算都等到他说完才开始，又会让他多等。</p><p>下面跟着这次请求，看系统怎样接住补话、找出游泳馆、返回附近餐厅，再接住下一句“第二个”。中间遇到豆包正在播报或网络不可用的情况，就沿对应分支继续。每个环节都要把结果交给下一环节，整条链路才算接上。</p>'
old=base['v39-map']['html'];marker=re.search(r'<!--fig:.*?-->',old).group();table=re.search(r'<div class="v34-table">.*?</table></div>',old).group();sources=re.search(r'<p class="v34-src">.*?</p>',old).group()
table=table.replace('<td>停止播报</td>','<td>停止当前播报，或继续播报</td>').replace('云端是否接话的判断；本地候选结果及其适用条件','云端接话判断；本地候选指令或无法办理的结果')
h='<p>这张图先把声音、文字、判断和执行结果连起来。沿着箭头看，每一步传出的内容，正是下一步继续处理所需要的信息。</p>'+marker
h+='<div class="v34-howto"><div class="v34-howto-h">沿着一次请求读这张图</div><p>从收音开始，声音送进语音识别，系统陆续得到“带我去”“带我去昨天那家游泳馆”等过程文字。此时还不知道后面会不会补话，所以识别继续听，判停同时观察停顿；如果豆包正在播报，还会判断新来的话是否需要让播报停下来。图里的编号帮助定位环节，这几项工作可以同时发生。</p><p>等用户补完“附近的餐厅”，定稿文字成为完整请求。系统继续判断是否应该接话，并把已有的对话、记忆等背景交给 Planner。Planner 也叫 DT 或 Director，负责理解需求、规划并调用工具。它需要先确定游泳馆的位置，才能继续搜索附近餐厅。</p><p>图中本地与云端两路会产生各自的处理结果。以赛力斯已激活的链路为例，两套识别同时运行，本地不等云端定稿才开始。采用哪一路由端云仲裁决定；固定规则命中可先执行，断网或超时时也可能采用有效本地候选。因此，图中仲裁的位置不能理解成所有情况都得等 DT 返回。后面的第四、五段会把这些分支接起来。</p></div>'
h+='<p>五段分别回答下面的问题。正常找餐厅先沿主线读；第二段的插话流程只在豆包正在播报等条件满足时发生。</p>'+table
h+=fold('v50-map-source','查图的依据与车型差异','<p>图的左右列表示部署位置，具体车型存在差异。上汽所引记录把流式拒识放在云端服务器，赛力斯所引方案在车上运行；端侧 FC 也能理解指令。职责与部署位置应分别核对，具体证据在第二段。</p>'+sources)
put('v39-map','先看整条链路：每一步为什么接得上',h,[{'knowledge':'12环节五段与输入输出','destination':'原表和新图下正文'},{'knowledge':'识别/判停/流式并行与本地独立启动','destination':'图下正文'},{'knowledge':'仲裁无需等待所有DT结果','destination':'图下正文，第四五段细讲'},{'knowledge':'上汽/赛力斯部署差异及原来源','destination':'v50-map-source'}])
# Keep reference material as lookup; remove report wording from visible opening.
s=base['v39-recap'];h=s['html'];first=re.search(r'^<p>.*?</p>',h).group();h=h.replace(first,'<p>需要检查某个交接时，查这一行：上一环交出了什么，下一环凭什么继续。</p>',1);h=h.replace('<div class="v49-detail-body">','<div class="v49-detail-body"><p>表中的数字与部署描述对应本章引用的方案；各车型当前生效配置仍需按项目核对。</p>',1)
put(s['id'],s['title'],h,[{'knowledge':'所有13行链路输入输出及项目范围','destination':'原v49-handoff-table，完整保留'}])
s=base['v39-toolbox'];h=s['html'].replace('<p>正文是按链路讲的。下面几张表把同样的内容换成“查问题、看指标、盯待定事项”的角度，用的时候直接对照。</p>','<p>遇到具体问题时，先找到出错环节，再核对它的输入、判断和输出。下面保留排查分工、指标及方案状态，供追问时查用。</p>')
put(s['id'],'查业务问题、指标与方案状态',h,[{'knowledge':'原4张表全部行、评测日期/口径及未决事项','destination':'原v49-reference-1至4，完整保留'}])
# A coherent spoken answer. Detail topics already taught stay in lookup rather than new side tracks.
s=base['v39-retell'];details=s['html'][s['html'].index('<details'):]
paras=[
'用户说“带我去昨天那家游泳馆”，停了一下，又补上“附近的餐厅”。这条需求最终要找餐厅，所以系统既要接完整句话，又要尽量缩短等待。',
'先处理输入。车上减少噪声和自播回声、确定说话音区；语音识别把声音变成文字。热词会提前提供人名、地名等候选词，帮助减少同音错字。但这次用户没说游泳馆的名字，识别正确也不代表系统已经知道是哪家。',
'识别文字还在更新时，判停同时观察停顿。按这里讲的固定判停方案，短停顿先发预请求，做不产生实际动作的准备；用户继续说，就接着听并重新计时。收尾得到定稿后，只复用与完整请求仍匹配的准备。用户补了“附近的餐厅”，就不能沿用“去游泳馆”的旧结果执行。没有有效定稿，也不能拿半句话继续办。',
'如果豆包正在介绍餐厅，主驾插话要求打开副驾座椅加热，还要先解决是否停播。满足触发条件后，流式拒识利用当时的过程文字作判断；需要接话就先停播、继续收音。之后云端最终拒识判断整句是否应该处理，端侧 FC 则尝试把车控请求解析成功能和参数。停播、接话和执行车控各有自己的条件。',
'回到找餐厅：云端接下请求后，为 Planner 带上可用背景。如果仍缺游泳馆的位置，Planner 先查询记忆；拿到具体地点，才能接着搜附近餐厅。没有查到就仍然缺信息，需要澄清，不能编一个地点。餐厅列表真正返回并展示后，下一句“第二个”才有明确对象。',
'本地和云端都可能产生候选结果，执行前还要决定采用谁。以这里讲的赛力斯方案为例，固定规则可先执行，其他情况优先有效云端结果，断网或超时时尝试有效本地车控候选。例如隧道里开空调，本地能办才能兜底；本地也办不了，就提示失败。本地已经执行后，迟到的云端结果不能再执行一次。',
'最后把真实结果接回后续对话。发出了指令不等于办成了，查询失败、执行失败也要保留。实际结果成功同步并被后续请求使用，用户接着说话时，系统才知道刚才发生了什么。评价这条链路，要同时看是否接准了完整需求、是否办成，以及用户实际等了多久。'
]
h='<div class="v34-retell">'+''.join('<p>'+p+'</p>' for p in paras)+'</div>'+details
put(s['id'],'讲给别人听：三分钟串起一次完整请求',h,[{'knowledge':'热词不能代替昨天地点查询，识别并行判停，预请求匹配和失败','destination':'口述第1至3段'},{'knowledge':'插话流式/最终拒识/端侧FC各职责','destination':'口述第4段及第二四段'},{'knowledge':'记忆补信息、查询返回列表、第二个承接','destination':'口述第5段'},{'knowledge':'仲裁固定规则/本地兜底/重复执行/结果回写','destination':'口述第6至7段'},{'knowledge':'300/600计时与具体模型包和版本证据','destination':'第三段及原v49-retell-check保留'},{'knowledge':'人人对话和AI Launcher','destination':'第五段与v39-launcher完整讲解，口述不再另起支线'},{'knowledge':'12条易混淆规则及未确认状态','destination':'原v49-retell-check完整保留'}])
s=base['v39-glossary'];h=s['html'].replace('<p>正文都用了产品语言。和研发、测试沟通或看日志时，会听到下面这些说法，对照着用就行。</p>','<p>查到一个不熟悉的缩写时，先把它对应回业务动作，再看它在链路的哪个位置。</p>')
put(s['id'],s['title'],h,[{'knowledge':'全部术语对照含记忆/AI Launcher/接口/模型','destination':'原v49-glossary完整保留'}])
(D/'root-patch.json').write_text(json.dumps({'intro':intro,'sections':list(patch.values())},ensure_ascii=False,indent=2))
(D/'root-ledger.json').write_text(json.dumps(ledger,ensure_ascii=False,indent=2))
