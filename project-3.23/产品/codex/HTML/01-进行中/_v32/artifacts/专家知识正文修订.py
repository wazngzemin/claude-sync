from pathlib import Path
import json,copy,shutil,datetime,re
R=Path('/Users/bytedance/Desktop/3.23/产品/codex/HTML/01-进行中');p=R/'豆包汽车-业务学习站-v31-工作副本.html';s=p.read_text();a=s.index('const DATA=')+11;d,n=json.JSONDecoder().raw_decode(s[a:]);old=copy.deepcopy(d);pg=next(x for x in d['pages'] if x['id']=='SE');t=pg['teaching'];D='https://bytedance.larkoffice.com/docx/WhbsdukLFo8Q5Hx9OsMccjFInef';T='https://bytedance.larkoffice.com/docx/V85Udy3G5oQLnHxw3Mqc6LZEnHe';M='https://bytedance.larkoffice.com/wiki/CbJVw4ACzilvvBkRxkqcQVfAnLh';changes=[]
def setlesson(lid,title,paragraphs):
 l=next(x for x in t['lessons'] if x['id']==lid);changes.append({'id':lid,'oldTitle':l['title'],'oldParagraphs':l['paragraphs'],'newTitle':title,'newParagraphs':paragraphs});l['title']=title;l['paragraphs']=paragraphs;l['sourceIds']=list(dict.fromkeys(l.get('sourceIds',[])+['FINAL-EXPERT-ORIGINAL','NEW-EXPERT-TRANSCRIPT0909']))
setlesson('se-knowledge-purpose','专家知识给处理方法，个人记忆提供事实，二者不能混在一条记录里',[
 '用户说“找停车场不要推荐立体停车场”，提供的是自己的选择要求；品牌专家写“找停车场时先核车型尺寸和停车设施限制”，给的是可复用的判断方法。这两句都可能影响下一次推荐，但前者属于谁、在哪种条件下有效，后者依赖什么信息、怎样使用，需要分别说明。知识条目不能把某个用户、固定地点或一次经历当成所有人的前提。',
 f'9月9日讨论里，旧专家知识的第一个问题是把具体case直接写成通用知识。例如周末游条目固定小众地点和吃饭时刻，自驾游条目默认跨省山区；换一个用户或行程，这些前提就不成立。要保留的是处理原则和适用条件，实际地点、时刻、人数与路线由当前输入确定。[专家知识讨论00:07至00:09]({T})',
 f'第二个问题是知识要求了系统没有的感知与动作。条目写“知道停车位置后提醒步行路线”，但停车位置从哪得到、是否可靠、有没有步行路线能力，都未必接通。内容写得完整不能替代端状态、视觉、查询和执行接口。使用前必须核本车能取得什么；缺条件时说明未具备的环节，而不是让模型照例子补造。[专家知识原文·当前问题]({D})',
 f'第三个问题是know-how与考察点混在一起。know-how指怎样处理问题，考察点用于判断处理是否达标。比如“先确认会合点”是方法，“用户与被接人的会合点一致且可到达”是检查标准。知识作者要把二者分清，否则模型只能照着念步骤，测试也只能看有没有出现同样一句话。[专家知识讨论00:07:25、00:20:39]({T})',
 f'个人记忆的保存和使用在K章另讲。9月9日会议对自学习规则与个人记忆的边界仍要求专项对齐；不能把记住“不吃辣”直接说成已经生成一条可供所有车型使用的公共知识。用户要求、专家方法、公共示例各自明确主体和使用范围，再验证后续是否真的采用。[专家知识讨论01:00:40]({T}) [记忆系统 PRD]({M})'
])
setlesson('se-knowledge-types','点状技巧、长程场景标准与整段旅程体验，各自解释到什么程度',[
 f'原文讨论“点、面、体”，区分的是知识的粒度，不是记忆存储层。点状知识处理一次动作或一种行为的小技巧，例如搜歌什么时候直接用音乐搜索、什么时候补联网查询；它可以独立检索，不需要每次都展开完整行程。面状知识处理接机、照顾乘员等需要阶段推进的场景；体状知识讨论整段旅程的体验，形态尚未确定。[专家知识原文·整体结构]({D})',
 f'点状技巧把局部判断写清即可。比如明确歌名时直接查询可播资源，只有热点、歌词片段或复杂条件时先补线索。它改善的是当前这一步，不能保证接机全程都会完成。9月9日会中用“不推荐立体停车场”说明这种粒度：它是一条筛选依据，不包含路线、到达、会合与停车的完整步骤。[专家知识讨论00:22至00:29]({T})',
 f'面状知识比多个技巧拼在一起多了阶段关系和检查标准。接机不是导航到机场就结束：会合点需确认，路线需根据实际航班与时间调整，接近时如何通知，在哪一步等待新信息，都要能检查。每一步还要说明标准未满足的原因和下一种处理办法，不能把“做好接机服务”当成可执行判据。[专家知识讨论00:24:58、00:29:32]({T})',
 f'体状知识关注更长范围，例如一次自驾游是否轻松、有没有创造符合用户期待的体验。它可能覆盖多个面状场景，但逐字稿明确说尚未想清楚形态，依赖后续动态Advisor设计。因此当前不能画一套已经上线的三层调用树，也不能声称任何复杂行程都会自动分解成完善知识。[专家知识讨论00:26至00:27]({T})',
 f'会中后段倾向先按两种知识形态组织：游离的点状技巧和有步骤、标准、异常预案的场景知识，不必强建复杂嵌套层级。知识按什么粒度写、怎样检索、供Director还是动态Advisor使用，是相互关联的设计选择。这里保留讨论过程，不把最初三层想法与后段两类形态同时写成现行结构。[专家知识讨论00:34:49至00:36:40]({T})'
])
setlesson('se-point-knowledge','明确歌名直接查询，热点和歌词线索先补信息，再找可播资源',[
 '用户说“播放周杰伦的稻香”，已经给出歌手与歌名。下一步查可播资源，无需先联网证明歌曲存在。用户说“放那个天青色等烟雨的歌”，给的是歌词线索；需要先识别对应歌曲，再交音乐搜索。两种输入的未知信息不同，知识要教的是补哪项信息，不是机械规定每次先调用同一个工具。',
 f'原文音乐技巧把明确歌名、歌手、专辑及应用内指定歌单列为直接音乐搜索；热点、影视信息、歌词片段、复杂组合和抽象偏好列为先补联网线索。若音乐搜索返回的歌名或歌手不对，也可再补联网查询。这是该原文里的工具使用方法，具体工具名称、参数和可用资源还要对照本车接入版本。[专家知识原文·音乐搜索]({D})',
 '补查得到歌名不等于音乐已经播放。Director依据得到的线索选择音乐查询，查询返回版权可用的资源后再执行播放；若名称仍含糊，先澄清，若资源不可播，按真实限制回答。不能用联网搜到一条歌曲介绍，直接对用户说“已经放了”。执行与反馈的详细链路见E、O章。',
 f'这类点状知识应能在接机、通勤或休息场景复用，所以不要把某次接机航班或某个乘客写进通用搜歌规则。它提供当前动作的技巧，正在进行的接机目标是否继续由任务机制追踪；临时点歌不自动终止原安排。[专家知识讨论00:34:49]({T})'
])
setlesson('se-scene-knowledge','接机为什么需要持续回看，而不只是读一次步骤',[
 '用户说“去机场接我爸妈”，系统当前还不一定知道航班、到达时间和会合点。一次规划可以先澄清并建立安排，但航班延误、路线变化或用户改会合点，都可能改变后续步骤。把一段接机知识塞给Director，不能替代持续获取新信息和重新判断的机制。',
 f'9月9日会议指出旧知识即使加载，多步骤遵循效果仍差，插话与打断会进一步干扰；某些专家体验还要求持续追踪、发现问题和采取预案。Director需要的知识偏向澄清、拆任务与交互过渡；把复杂长程事情做到专家级，讨论倾向由动态Advisor承载更完整的场景知识。这是架构方向，不是证明当时所有接机任务都已支持。[专家知识讨论00:09至00:12]({T})',
 f'原文接人例子按会合点确认、规划路线、帮助说明所在位置、接近目的地通知等环节组织。标准需能由工具或数据检查，例如会合点是否明确、路线是否仍指向它。没有航班查询、地点信息或通知接口时，知识只能说明缺什么；不能把“应该通知”变成用户一定收到通知的承诺。[专家知识讨论00:20:39至00:24:58]({T})',
 '执行中用户说“先放首歌”，这次点歌可以办理，接机目标仍需保留；用户说“不接了，回家”，则是目标终止或变更。持续服务要区分插入需求与取消原任务，依据新目标和真实反馈调整下一步。知识说明处理原则，任务与Advisor生命周期负责何时再次启动，图中反馈回线不等于无条件重复执行。',
 f'验证应检查多个关键变化：会合点未确认、航班变化、途中插话、用户取消、工具失败。某个静态步骤序列走完，只证明那次条件下成功；还要看每阶段是否用到新信息、缺项时是否停止错误推进。专家知识的“好”应落在可观察结果与检查点上，不能只以回复长或听起来专业判断。[专家知识原文·期待及知识形态]({D})'
])
setlesson('se-knowledge-loading','先筛新增和移除的知识编号，再取正文进入本轮判断',[
 f'接机途中用户点歌，知识筛选要同时看当前点歌要求、进行中的接机目标、最新车况与已经加载的内容。原文提示模板还列近期10轮对话，这是该知识检索方案的输入口径，不是11月4日Director历史输入统一改成10轮。不同消费者的输入范围要分别核对。[专家知识原文·检索输入]({D})',
 f'筛选结果返回需要新增与移除的知识ID，以及对应理由。已加载的接机知识仍适用就保留，缺音乐技巧则新增；场景无法判断时新增列表可以为空，交下游进一步确认。这里做的是增量更新，不能把换话题简单解释为清空原有全部知识。[专家知识原文·筛选原则及输出]({D})',
 '编号只负责定位条目，下一步还要读取对应正文、移除指定旧项并组织本轮知识。日志里有某个ID，不能证明模型已读到处理方法。检查加载问题时要看最终请求中的正文，检查采用问题时再看Director怎样选动作，两种失败不能混成检索不准。',
 f'实际车辆状态优先于历史里已经过时的车况描述，是原文的输入规则。知识里的固定示例不能替本车补造目的地、身份或当前播放状态；工具有无与动作是否允许仍按本车规则检查。完成方法加载以后，Director结合当前输入选择动作，真实反馈再支持下一轮。[专家知识原文·车辆状态及场景绑定]({D})'
])
setlesson('se-teach-by-voice','口头教一条操作方法，与说出一项个人偏好，保存要求不同',[
 f'9月9日会议提出一个真实操作case：用户想同时看导航与歌词，但打开歌词总进全屏；人工教它先打开歌词、返回桌面、再进入分屏。这里教的是处理方法，不只是“喜欢看歌词”这一偏好。要保存的内容包括适用请求、步骤与预期结果，不能只抽出一个兴趣标签就宣称学会。[专家知识讨论00:45至00:48]({T})',
 '下一次用户要求同时看导航和歌词时，系统要先确认当前页面、应用能力与已知方法，再按依赖顺序执行。每一步实际界面回来才有依据继续；如果已经分屏就不必重做，用户改成“歌词全屏就好”就改变目标。记住一串点击步骤而不核当前页面，容易把旧状态当成现在。',
 f'会上希望把“人工整理动态示例”改为“车上口述纠正，后续生成并采用”，并区分内部调试的公共内容与用户个人规则。它是改造目标，不是已经证明用户随口教一次就能立即修改全车模型。是否生成、谁审核、适用范围和下次怎样检索，都需要对应实现验证。[专家知识讨论00:46至00:57]({T})',
 f'个人偏好另走记忆规则。用户说“以后找餐厅别推荐辣的”，可形成自己的明确要求；“今天不舒服先别吃辣”保留当下条件。个人记忆、可复用自学习规则和公共专家知识的边界在会上仍要求专门对齐，不能将一次个人意见扩成所有人的行为标准。[专家知识讨论01:00:40]({T}) [记忆系统 PRD]({M})',
 '验证口述教学至少追到下一次相近请求：纠正有没有被保存，适用内容有没有检索并加载，模型有没有按当前目标采用，动作有没有得到真实结果。还要试相反目标和已有终态，避免学会“同时看”以后连“只看歌词”也强制分屏。用户能否查看、修改和删除个人规则，应作为产品缺口明确核对。'
])
setlesson('se-lesson-release','先验证已有知识能被稳定遵循，再扩大生产与自学习范围',[
 f'9月9日讨论没有要求直接把旧知识全部废弃。短期挑出质量可靠的条目使用，长期重新明确结构、检索与承载；先验证现有方法能被稳定遵循、替换方法以后也能正确使用，再扩大自动沉淀。否则只是更快生成了一批没有适用条件、系统又不能稳定执行的文字。[专家知识讨论00:45:35、00:49:32]({T})',
 f'原文按阶段安排9月架构、10月结构与检索基础及手写实车验证、11月生产要求和批量测试。它是当时计划，到了11月不能由日期反推全部已完成。每项现在做到哪一步，需要新发布记录、输入日志和场景测试结果；模型评测成绩、知识生产数量和真实车上任务成功仍是不同指标。[专家知识原文·推进节奏]({D})',
 '发布后用同一个用户目标核对实际版本：请求进了哪条链路，读到哪份知识，生成哪项操作，工具与车端回了什么。输入完整却方法选错，要查知识或决策；方法没加载，要查检索和装载；选对动作而没有办成，要查执行。不能只拿一段正确的回复或接口返回成功替代用户可见结果。',
 f'1.7B FC、30B视觉任务和Edge_DT的部署与输入输出在R章单独讲，本章不把各模型版本和Launcher修复日志混作知识发布结果。知识装载、模型训练、端侧部署和业务启用要各有证据，不能由一个环节完成推断全部能力已经交付。[专家知识原文·放置位置及效果问题]({D})'
])
# Remove only generated repeats directly duplicating the lesson heading; keep useful substantive first sentences.
for l in t['lessons']:
 if l['paragraphs'] and l['paragraphs'][0].startswith('**'):
  m=re.match(r'^\*\*([^*]+)\*\*\s*',l['paragraphs'][0])
  if m and m.group(1).rstrip('。') in l['title']:l['paragraphs'][0]=l['paragraphs'][0][m.end():]
# Two superseded purposes: dynamic examples are retrieved maintained records, not necessarily generated every request.
for l in t['lessons']:
 l['paragraphs']=[x.replace('动态示例是根据当前场景实时生成的参考。','动态示例从适用条目中检索并加载，当前场景决定采用哪条。').replace('动态示例根据当前场景实时生成。','动态示例由当前场景检索适用条目后加载。') for x in l['paragraphs']]
for g in t['guides'].values():
 g['paragraphs']=[x.replace('动态示例根据当前场景实时生成。','动态示例由当前场景检索适用条目后加载。') for x in g['paragraphs']]
# Synchronize titles and original aliases by explicit target; keep IDs and layout unchanged.
ls={l['id']:l for l in t['lessons']}
for sec in pg['sections']:
 if sec.get('teachingTarget') in ls:
  z=ls[sec['teachingTarget']];sec['title']=z['title'];sec['paragraphs']=copy.deepcopy(z['paragraphs']);sec['sourceIds']=copy.deepcopy(z.get('sourceIds',[]))
if not any(x['id']=='FINAL-EXPERT-ORIGINAL' for x in d['sources']+d['base']['sources']):d['sources'].append({'id':'FINAL-EXPERT-ORIGINAL','title':'专家知识-现状及后续规划思路讨论（原文）','url':D})
pg['sourceIds']=list(dict.fromkeys(pg['sourceIds']+['FINAL-EXPERT-ORIGINAL','NEW-EXPERT-TRANSCRIPT0909']))
t['sourceIds']=list(dict.fromkeys(t.get('sourceIds',[])+['FINAL-EXPERT-ORIGINAL','NEW-EXPERT-TRANSCRIPT0909']))
def svgs(x,path='D',out=None):
 if out is None:out={}
 if isinstance(x,dict):
  for k,v in x.items():svgs(v,path+'.'+k,out)
 elif isinstance(x,list):
  for i,v in enumerate(x):svgs(v,path+f'[{i}]',out)
 elif isinstance(x,str) and '<svg' in x:out[path]=x
 return out
assert svgs(old)==svgs(d)
backup=R/'_backup'/('学习站-专家正文修订前-'+datetime.datetime.now().strftime('%Y%m%d%H%M%S')+'.html');shutil.copy2(p,backup)
p.write_text(s[:a]+json.dumps(d,ensure_ascii=False,separators=(',',':'))+s[a+n:])
(R/'_v32/artifacts/专家知识修订记录.json').write_text(json.dumps({'backup':str(backup),'changes':changes},ensure_ascii=False,indent=2))
(R/'_v32/artifacts/专家知识修后全文.md').write_text('# SE 自进化与专家知识\n\n'+'\n\n'.join(t['intro'])+'\n\n'+'\n\n'.join('## '+l['id']+' '+l['title']+'\n\n'+'\n\n'.join(l['paragraphs']) for l in t['lessons'])+'\n\n'+'\n\n'.join('## '+g['title']+'\n\n'+'\n\n'.join(g['paragraphs']) for g in t['guides'].values()))
print('written',len(changes),'expert lessons; existing 13 lesson IDs and all SVG preserved')
