import pathlib,json,copy,shutil,datetime
R=pathlib.Path('/Users/bytedance/Desktop/3.23/产品/codex/HTML/01-进行中');P=R/'豆包汽车-业务学习站-v31-工作副本.html'
s=P.read_text();i=s.index('const DATA=')+11;d,n=json.JSONDecoder().raw_decode(s[i:]);old=copy.deepcopy(d)
pages={p['id']:p for p in d['pages']};u=pages['U'];l=next(l for l in u['teaching']['lessons'] if l['id']=='u-launcher')
URL='https://bytedance.larkoffice.com/docx/PPh7dXheZoKp9DxXCkCck3zqnKd'
l['title']='AI Launcher 怎样把上车推荐变成一次明确的操作'
l['paragraphs']=[
 f'上车后不一定先说话，用户也可能先在桌面看到豆包给出的推荐，点一句「开启全车极速降温」或一个音乐播放按钮。AI Launcher是这类首页推荐和技能入口的承载界面。它给用户一个可以发起需求的入口，后面仍由已有业务链路处理；不能把推荐气泡、正在执行的任务岛和后台可管理的任务当成同一个对象。[AI launcher 展示字段逻辑说明]({URL})',
 f'字段说明把首页内容分成三类：场景推荐引导语、场景推荐任务、技能清单。引导语在上电时生成，方案共7条，其中3条常用指令结合用户记忆和历史行为，从导航、车控、多媒体、系统应用设置等域提炼；4条场景推荐结合当前场景和车内乘客状态。每次上电变化是该方案的生成规则，不能改写成每次点击或每句话都重新生成，也不保证必须推某个固定动作。[字段说明·场景推荐引导语]({URL})',
 f'气泡展示文字和实际触发内容分开。guiding_content是用户看到的文案，query是点击后交入业务的请求，guiding_id用于辨认是哪条引导，guiding_type区分常用指令和场景推荐。emoji是可选展示项。点击气泡由系统传入对应请求，用户不用照着文案再说一遍；这也不代表要把文本重新当作一段麦克风录音去识别。验收先看点了哪条、送出了什么，再看下游是否按相同目标处理。[字段说明·引导语字段]({URL})',
 f'场景推荐任务面向可执行目标，按导航、音乐、车控、其他四类给出按钮。导航卡显示具体目的地和导航按钮，音乐显示推荐音乐和播放按钮，车控显示执行按键。scene_type决定展示类别，query提供点击按钮触发的链接、请求或指令。卡片已经生成只是有了候选，点击以后才进入相应办理链路；导航有没有真正启动、音乐有没有播放、车控有没有完成，需要执行结果，不能拿卡片出现当作成功。[字段说明·场景推荐任务]({URL})',
 f'卡片还带scene_id、title、可选desc、icon，以及track、element等展示字段。track和element控制运动轨迹及元素效果，文档建议客户端对不支持的枚举保留默认显示，避免云端新增类型时老客户端无法呈现。它们是界面兼容规则，不是车辆动作轨迹。生成内容的缓存策略另行定义，不能借技能清单采用本地缓存就推断全部推荐也使用同样缓存。[字段说明·场景任务字段]({URL})',
 f'技能清单展示能力入口，字段说明写的是当时固定本地缓存、后续支持云端更新。skill_name和category用于名称与分类，query是送到云端的触发请求。排序先放最近一次使用，再放3个偏好推荐位，其余技能按未使用靠前、已使用靠后处理。use_status和last_use_time分别支持使用标记与最近使用排序。这里的3个推荐位不是前面3条常用指令，两组数字对应不同区域。[字段说明·技能Skill]({URL})',
 f'推荐入口与任务管理按目标性质衔接。点音乐播放按钮，可以形成当次播放请求；点一个需要持续观察或未来触发的技能，后续才可能创建可管理任务。是否需要任务卡、任务岛或中心条目，应按对应业务的实际状态判断，不能因为首页也叫「场景推荐任务」就认定它全部常驻在任务中心。这个字段文档描述的是输入与展示契约，没有给出全部任务生命周期或全车型上线范围。[字段说明]({URL})'
]
for sec in u['sections']:
 if sec.get('teachingTarget')=='u-launcher' or sec['id']=='u-launcher':sec['title']=l['title'];sec['paragraphs']=copy.deepcopy(l['paragraphs']);sec['sourceIds']=['RESUME-LAUNCHER-FIELDS']
l['sourceIds']=['RESUME-LAUNCHER-FIELDS'];u['sourceIds']=list(dict.fromkeys(u['sourceIds']+['RESUME-LAUNCHER-FIELDS']))
d['sources'].append({'id':'RESUME-LAUNCHER-FIELDS','title':'AI launcher 展示字段逻辑说明（原始字段文档）','url':URL})
f=pages['F']['teaching'];fl=next(l for l in f['lessons'] if l['id']=='f-lesson-exceptions');fl['paragraphs']=[p for p in fl['paragraphs'] if not (p.startswith('AI Launcher 是桌面首页') or p.startswith('11 月 4 日发版修复了'))]
f['guides']['base']['paragraphs'][3]='工具是否在项目启用、当前渠道是否接入和当前操作是否有权限，需要分别核验。首页的AI Launcher只提供推荐与技能入口，它的生成、字段和点击流程见U章，不用首页推荐数量判断工具准入。'
for sec in pages['F']['sections']:
 target=sec.get('teachingTarget');ll=next((l for l in f['lessons'] if l['id']==target),None)
 if ll:sec['paragraphs']=copy.deepcopy(ll['paragraphs'])
assert old['originalSvg']==d['originalSvg']
# Per-lesson citations now render instead of a no-op, using the existing sanitized source renderer.
suffix=s[i+n:];suffix=suffix.replace("function sourceStrip() { return ''; }", "function sourceStrip(ids) { const list = unique(arr(ids)).filter(id => sourceById.has(id)); return list.length ? '<div class=\"lesson-sources\"><h3>对应原文</h3>' + renderSourceList(list) + '</div>' : ''; }")
assert 'function sourceStrip(ids)' in suffix
bk=P.with_name(P.name+'.bak-launcher-'+datetime.datetime.now().strftime('%Y%m%d%H%M%S'));shutil.copy2(P,bk)
P.write_text(s[:i]+json.dumps(d,ensure_ascii=False,separators=(',',':'))+suffix)
print('updated launcher, removed misplaced F content, lesson source links enabled','backup',bk)
