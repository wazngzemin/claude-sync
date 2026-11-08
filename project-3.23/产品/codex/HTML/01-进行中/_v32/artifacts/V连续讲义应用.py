from pathlib import Path
import json, re, shutil, datetime, hashlib
R=Path('/Users/bytedance/Desktop/3.23/产品/codex/HTML/01-进行中')
P=R/'豆包汽车-业务学习站-v31-工作副本.html'
s=P.read_text(encoding='utf-8'); original_text=s; a=s.index('const DATA=')+len('const DATA='); data,n=json.JSONDecoder().raw_decode(s[a:]); before=json.loads(json.dumps(data))
v=next(x for x in data['pages'] if x['id']=='V')
md=(R/'_v32/artifacts/V连续产品讲义.md').read_text(encoding='utf-8')
chunks=re.split(r'^## (.+)$',md,flags=re.M)
intro=[p.strip() for p in chunks[0].split('\n\n')[1:] if p.strip()]
lessons=[]
source_map={
'v-product-problem':['USER-CASE-VOICE','VOICE-ONEPAGE'],
'v-listen':['VOICE-VOICEPRD','VOICE-AIVA-DISABLE','VOICE-DISABLE','VOICE-ONEPAGE'],
'v-hotwords':['VOICE-ONEPAGE','VOICE-VOICEPRD'],
'v-text':['VOICE-ONEPAGE','VOICE-VOICEPRD'],
'v-interrupt-early':['VOICE-ONEPAGE','VOICE-INTERRUPT'],
'v-pause':['VOICE-ONEPAGE','V-VERIFIED-VAD'],
'v-prequery':['VOICE-ONEPAGE','V-VERIFIED-PREQUERY','V-VERIFIED-VAD'],
'v-supplement':['USER-CASE-VOICE','VOICE-ONEPAGE'],
'v-final':['VOICE-ONEPAGE','VOICE-VOICEPRD'],
'v-prequery-design':['V-VERIFIED-PREQUERY'],
'v-version-boundaries':['V-VERIFIED-VAD','VOICE-INTERRUPT','VOICE-ONEPAGE'],
'v-handoff':['USER-CASE-VOICE','VOICE-ONEPAGE','VOICE-VOICEPRD']}
for i in range(1,len(chunks),2):
    ident,title=chunks[i].split('|',1)
    ps=[p.strip() for p in chunks[i+1].split('\n\n') if p.strip()]
    lessons.append(dict(id=ident,title=title,paragraphs=ps,sourceIds=source_map[ident]))
lookup={x['id']:x for x in lessons}
# 用实际取得的来源 URL 保存核验口径，不改已有资料的地址。
new_sources=[
{'id':'V-VERIFIED-ONEPAGE','title':'语音基础体验 OnePager（本次回读正文）','url':'https://bytedance.larkoffice.com/docx/Ied8dT6LDoYpPkxauioc3aM4nBx'},
{'id':'V-VERIFIED-VAD','title':'多级 VAD 产品体验（含待评审与演示变更）','url':'https://bytedance.larkoffice.com/docx/H8ead1YfaoYRw9xIkX1cFKE9n1d'},
{'id':'V-VERIFIED-PREQUERY','title':'服务端技术评审：多级 VAD 策略','url':'https://bytedance.larkoffice.com/docx/Sekjdod9bo25h7x5uHccUww3njg'}]
for x in new_sources:
    if not any(y['id']==x['id'] for y in data['sources']):data['sources'].append(x)
for x in lessons:
    if 'VOICE-ONEPAGE' in x['sourceIds']:x['sourceIds'].append('V-VERIFIED-ONEPAGE')
# 来源在相关小节就地列出，文章主线不被参考资料重复覆盖。
guide={
 'title':'原图读法：沿输入看文字、停顿与准备的关系',
 'paragraphs':[
 '先看 V13（语音可用性检查）、V1（麦克风收音）、V14（声学前端）和 V15（音区定位）。它们把能否进入语音、可用声音和来源座位交代清楚。图上的排列是责任分解；真实运行中声学、定位与识别可以重叠，不要求每项处理全部结束才开始下一项。音区回答声音来自哪里，动作目标和身份授权不能由它推出来。',
 'V16（热词增强）连接 V2（一遍 ASR），表示名称候选供识别选字。按 OnePager，云端在识别建联时及上行信息中注入；这条连接不表示等用户停顿才提供热词。V17（识别来源与上屏规则）管理在线、离线文字与显示，不能被理解为本地业务取得执行权。V3（过程文字）仍允许随后续音频更新。',
 'V4（VAD 语音活动检测）与 V2（一遍 ASR）使用同一段音频、做不同工作。V4 观察声音活动与停顿，V2 产生文字。V5（软判停）为 V6（预请求）提供触发条件，V3（过程文字）为 V6 提供当前内容；有文字但未到触发条件，或者到时但文字尚未可用，都不能凭图上的一根箭头认定准备已经完成。',
 '本图采用 300/600 毫秒的解释主线。V5（软判停）只触发准备，仍继续收音；V7（硬判停）让本段收尾。用户在约 400 毫秒时补话，就重新进入声音活动，下一次停顿另起计时。V10（语义判停）提示还存在意思完整性的判断；原图的能力连接不证明各版本统一采用某一种门控先后或延长终值。',
 'V8（二遍 ASR）提供定稿，V6（预请求）保留前一份计算，两种结果在正式链路中的 V9（复用核对）发生关联。这里应先核同一次请求，再核前一轮文字是否完全相同和模块结果是否可用。不符走 V11（按最终文字重新准备）。重算的是尚未形成业务结果的前置计算，不是重新录音或撤销已经发出的导航。',
 'V12（正式输入交接）以后才继续由入口、输入管理、Context 和 Director 处理有效需求、背景与动作。V18（识别失败）提醒先区分无音频、空结果和超时，不默认以残缺文字办理。原图是全站已有架构资产，本轮未改图形或连线；正文中的版本边界比图上短标签更细，应以本章说明与对应车型资料共同理解。'
 ],
 'nodeIds':['V13','V1','V14','V15','V16','V17','V2','V3','V4','V5','V6','V7','V8','V9','V10','V11','V12','V18'],
 'sourceIds':['VOICE-ONEPAGE','V-VERIFIED-ONEPAGE','V-VERIFIED-VAD','V-VERIFIED-PREQUERY']}
v['title']='语音输入与判停';v['summary']='按一次补话输入讲清收音、热词、一遍识别、判停、预请求、二遍定稿与复用的产品逻辑。'
v['teaching']={'intro':intro,'lessons':lessons,'guides':{'base':guide},'closing':[], 'sourceIds':list(dict.fromkeys(y for x in lessons for y in x['sourceIds']))}
v['sections']=[dict(x,teachingTarget=x['id']) for x in lessons]
v['articleReading']=True;v['converted']=False;v['mainline']=[];v['concepts']=[]
v.pop('feynman',None);v.pop('bridge',None)
v['sourceIds']=v['teaching']['sourceIds']
v['evidenceGaps']=['热词回流管理技术方案无权限，未使用未读正文反推权重、淘汰或过期算法。','当前车型生效阈值、语义门控顺序、Context各来源有效期与预请求在途等待策略需联调确认。']
aliases={'V-L1':'v-listen','V-L2':'v-hotwords','V-L3':'v-pause','V-L4':'v-final','v-handoff':'v-handoff','v-text':'v-text','v-pause':'v-pause','v-listen':'v-listen','concepts':'v-hotwords','raw-notes':'v-product-problem','teach-back':'v-handoff','learn-v-situation':'v-product-problem','learn-v-audio':'v-listen','learn-v-two-jobs':'v-text','learn-v-soft':'v-prequery','learn-v-add':'v-supplement','learn-v-final':'v-final','learn-v-reuse':'v-final'}
v['legacyChapterTargets']={**v.get('legacyChapterTargets',{}),**aliases}
# 不改 DATA.base/SVG，V 节点入口用同一篇讲义的对应解释覆盖旧文字。
node_refs={
'V13':('v-listen',[0,1,2]),'V1':('v-listen',[3]),'V14':('v-listen',[4,5]),'V15':('v-listen',[6]),
'V16':('v-hotwords',[0,1,2,3,4,5,6,7,8,9,10]),'V17':('v-text',[3,4]),'V2':('v-text',[0,1]),'V3':('v-text',[1,2,5]),
'V4':('v-pause',[0,1,3]),'V5':('v-pause',[2,4]),'V6':('v-prequery',[0,1,2,3,4,5,6,7,8,9,10]),
'V7':('v-final',[0]),'V8':('v-final',[1,2,3]),'V9':('v-final',[4,5,6,7]),'V10':('v-pause',[5,6]),'V11':('v-final',[5,7]),'V12':('v-final',[8]),'V18':('v-handoff',[0,1,2])}
v['nodeExplanations']={k:{'paragraphs':[lookup[l]['paragraphs'][i] for i in idx], 'sourceIds':lookup[l]['sourceIds']} for k,(l,idx) in node_refs.items()}
# 清掉只属于V旧复述稿的入口，不影响其余章节。
marker=" function renderModule(id) {"
assert s.count(marker)==1
renderer=''' function renderArticleModule(page,module) {
 const teaching=page.teaching;
 let html=heading(page.title,'',{crumbs:[{label:titleOf(page.id)}],actions:module?'<a class="button-link" href="'+routeHref('module',page.id,'section','detailed-flow')+'">对照本章原图</a>':''});
 html+='<div id="chapter-reading"><div class="lecture-prose lecture-opening">'+arr(teaching.intro).map(para).join('')+'</div>';
 html+=arr(teaching.lessons).map(lesson=>section(lesson.id,lesson.title,'<div class="lecture-prose" data-teaching-lesson="'+esc(lesson.id)+'">'+arr(lesson.paragraphs).map(para).join('')+'</div>'+sourceStrip(lesson.sourceIds))).join('');
 html+='</div>';
 if(module&&DATA.originalSvg)html+=section('detailed-flow','对照原图：文字、停顿和准备怎样衔接',figure({key:'base-'+page.id,title:page.title,svg:DATA.originalSvg,crop:[module.x-35,module.y-35,module.w+70,module.h+70],pageId:page.id})+renderGuide(page,'base'));
 html+='<details class="reference-archive" id="chapter-sources"><summary>查看本章依据与证据缺口</summary><div class="reference-content">'+renderSourceList(page.sourceIds)+'<h3>尚未确认的部分</h3>'+arr(page.evidenceGaps).map(para).join('')+'</div></details>';
 return html;
 }

'''
s=s.replace(marker,renderer+marker,1)
s=s.replace(" const page=pageOf(id), module=moduleById.get(id), teaching=page.teaching, f=page.feynman;"," const page=pageOf(id), module=moduleById.get(id), teaching=page.teaching, f=page.feynman;\n if(page.articleReading)return renderArticleModule(page,module);",1)
old=" const nodes = modules.flatMap(module => arr(module.nodes).map(node => ({ ...node, moduleId: node.moduleId || module.id })));"
new=" const nodes = modules.flatMap(module => arr(module.nodes).map(node => ({ ...node, ...suppliedPages.get(module.id)?.nodeExplanations?.[node.id], moduleId: node.moduleId || module.id })));"
assert old in s;s=s.replace(old,new,1)
s=s.replace("title:'版本细则：'+lesson.title","title:(page.articleReading?'':'版本细则：')+lesson.title",1)
# DATA位置在前面，插入渲染函数不影响原DATA的截断位置。
s=s[:a]+json.dumps(data,ensure_ascii=False,separators=(',',':')).replace('</script','<\\/script')+s[a+n:]
# 不变资产与未改章节的断言在写入前执行。
assert data['base']==before['base']
assert data['originalSvg']==before['originalSvg'] and data['diagrams']==before['diagrams'] and data['overviewSvg']==before['overviewSvg']
assert all(x==next(y for y in before['pages'] if y['id']==x['id']) for x in data['pages'] if x['id']!='V')
assert len(lessons)==12 and all(x['paragraphs'] for x in lessons)
# 防止异步写入覆盖本轮读取后的用户改动。
assert P.read_text(encoding='utf-8')==original_text
backup=R/'_backup'/('学习站-V连续讲义前-'+datetime.datetime.now().strftime('%Y%m%d%H%M%S')+'.html')
shutil.copy2(P,backup)
P.write_text(s,encoding='utf-8')
report={'onlyPageChanged':'V','lessons':len(lessons),'paragraphs':sum(len(x['paragraphs']) for x in lessons),'other23PagesUnchanged':True,'originalSvgAndBaseUnchanged':True,'backup':str(backup),'path':str(P)}
(R/'_v32/artifacts/V打磨写入记录.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(report,ensure_ascii=False))
