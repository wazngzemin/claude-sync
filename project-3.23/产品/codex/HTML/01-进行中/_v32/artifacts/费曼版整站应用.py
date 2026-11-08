from pathlib import Path
import json,copy,re,datetime,shutil
R=Path('/Users/bytedance/Desktop/3.23/产品/codex/HTML/01-进行中');P=R/'豆包汽车-业务学习站-v31-工作副本.html';s=P.read_text();a=s.index('const DATA=')+11;d,n=json.JSONDecoder().raw_decode(s[a:]);before=copy.deepcopy(d)
chapters={}
for f in ['费曼正文一.json','费曼正文二.json','费曼正文三.json','费曼正文四.json']:
 x=json.loads((R/'_v32/artifacts'/f).read_text());assert not(set(x)&set(chapters));chapters.update(x)
assert set(chapters)=={x['id'] for x in d['pages']}
for pg in d['pages']:
 f=chapters[pg['id']];assert f['goal'] and f['retell']['a'] and len(f['transfer'])>=2
 assert len({x['id'] for x in f['sections']})==len(f['sections'])
 for q in f['transfer']:assert q['review'] in {x['id'] for x in f['sections']}
 f['sourceIds']=list(dict.fromkeys(pg.get('sourceIds',[])+pg['teaching'].get('sourceIds',[])))
 pg['feynman']=f
if not any(x['id']=='FEYNMAN-USER-CASE' for x in d['sources']+d['base']['sources']):d['sources'].append({'id':'FEYNMAN-USER-CASE','title':'用户提供的完整链路讲解case','url':'https://aka.doubaocdn.com/s/zMpb2Ui1wC'})
next(x for x in d['pages'] if x['id']=='V')['feynman']['sourceIds'].append('FEYNMAN-USER-CASE')
d['meta']['readerEdition']='费曼学习：案例接力、因果解释、遮答案复述与变式练习'
d['meta']['validation']='本轮重写全24章默认因果讲解与复述练习；旧详细资料按版本折叠保留，不将历史审读扩展为全站全源通过。'
# Replace only default module rendering; retain existing data and the original routing/diagrams.
old_start=s.index(' function renderModule(id) {');old_end=s.index('\n function renderFlow(page,flow)',old_start)
new=r''' function renderFeynman(page) {
 const f=page.feynman, id=page.id;
 const intro='<div class="feynman-start"><p class="feynman-goal">读完要能讲清：'+esc(f.goal)+'</p><p class="feynman-scenario">'+esc(f.scenario)+'</p><details class="feynman-scope"><summary>本例采用的条件与版本范围</summary>'+para(f.scope)+'</details></div>';
 const reading='<div class="feynman-reading" id="feynman-reading-'+esc(id)+'">'+f.sections.map((step,i)=>section('learn-'+step.id,step.title,'<div class="lecture-prose">'+step.p.map(para).join('')+'</div>')).join('')+'</div>';
 const practice=section('teach-back','合上讲解，试着讲给别人听','<div class="feynman-practice"><p>先自己讲，不求背原句。卡在哪个交接，就回到那一步补理解。</p><button type="button" data-feynman-toggle aria-pressed="false" aria-controls="feynman-reading-'+esc(id)+'">遮住讲解，开始复述</button><h3>'+esc(f.retell.q)+'</h3><label for="feynman-note-'+esc(id)+'">写下你的讲法或卡住的位置（只保存在当前浏览器，不上传）</label><textarea id="feynman-note-'+esc(id)+'" data-feynman-note="'+esc(id)+'" rows="5" placeholder="试着连着讲：此时还缺什么，因此谁做了什么，结果让下一步知道了什么……"></textarea><p class="feynman-save" data-feynman-save role="status">可直接口头复述，也可在这里记录。不自动判分。</p><details class="feynman-answer"><summary>讲完后对照参考讲法</summary>'+para(f.retell.a)+'</details></div>');
 const variations=section('transfer','换一个条件，你还能解释吗？','<div class="feynman-variations">'+f.transfer.map((q,i)=>'<article><h3>'+esc(q.q)+'</h3><details class="feynman-answer"><summary>先回答，再展开原因</summary>'+para(q.a)+'<a href="'+routeHref('module',id,'section','learn-'+q.review)+'">回到对应解释</a></details></article>').join('')+'</div>');
 return '<div class="feynman-course" data-feynman-course="'+esc(id)+'">'+intro+reading+practice+variations+'</div>';
 }
 function restoreFeynmanNotes(){
 $$('[data-feynman-note]',root).forEach(el=>{try{el.value=localStorage.getItem('cockpit-feynman-'+el.dataset.feynmanNote)||'';}catch(_){const note=el.parentElement.querySelector('[data-feynman-save]');if(note)note.textContent='此浏览器无法本地保存，可先口头复述或自行复制。';}});
 }
 function renderModule(id) {
 if (!pageIds.includes(id)) return renderMissing('没有这个模块', '请从目录选择已有模块。');
 const page=pageOf(id), module=moduleById.get(id), teaching=page.teaching;
 let html=heading(page.title,'',{crumbs:[{label:titleOf(id)}],actions:'<a class="button-link" href="'+routeHref('module',id,'section','teach-back')+'">直接做复述练习</a>'+(module?'<a class="button-link" href="'+routeHref('module',id,'section','detailed-flow')+'">对照原图</a>':'')});
 if(page.feynman)html+=renderFeynman(page);
 else if(teaching)html+='<div class="lecture-opening lecture-prose">'+teaching.intro.map(para).join('')+'</div>';
 if(module&&DATA.originalSvg)html+=section('detailed-flow','把刚才的接力对回原图',figure({key:'base-'+id,title:page.title,svg:DATA.originalSvg,crop:[module.x-35,module.y-35,module.w+70,module.h+70],pageId:id})+'<details class="reference-archive"><summary>展开原图逐节点说明（含版本限定）</summary><div class="reference-content">'+renderGuide(page,'base')+'</div></details>');
 if(arr(page.flows).length)html+=section('flows',module?'相关分支原图':'本章业务原图',page.flows.map(flow=>renderFlow(page,flow)).join(''));
 if(teaching){
 const prior='<div class="lecture-prose">'+teaching.intro.map(para).join('')+'</div>'+teaching.lessons.map(lesson=>section(lesson.id,lesson.title,'<div class="lecture-prose" data-teaching-lesson="'+esc(lesson.id)+'">'+lesson.paragraphs.map(para).join('')+'</div>'+sourceStrip(lesson.sourceIds))).join('')+'<div class="lecture-prose chapter-ending">'+arr(teaching.closing).map(para).join('')+'</div>';
 html+='<details class="reference-archive feynman-reference" id="version-details"><summary>版本细则与原资料核对：接口、数值、异常和历史方案</summary><div class="reference-content"><p class="research-note">这里保留原有详细材料，便于查接口与版本差异；不是默认学习主线。资料中的规划、待核和历史状态不视为当前全车型已实现。先讲顺上方例子，再查影响具体判断的条件。</p>'+prior+'</div></details>';
 }
 const refs=unique([...arr(page.sourceIds),...arr(teaching?.sourceIds),...arr(page.feynman?.sourceIds),...arr(teaching?.lessons).flatMap(l=>arr(l.sourceIds))]);
 if(refs.length)html+='<details class="reference-archive" id="chapter-sources"><summary>查看本章依据与原文链接</summary><div class="reference-content">'+renderSourceList(refs)+'</div></details>';
 return html;
 }
'''
# Change code before replacing DATA to keep exact boundaries.
s=s[:old_start]+new+s[old_end:]
css='''
/* Feynman reading: one causal story, retrieval practice, then source detail. */
.feynman-start{max-width:900px;margin:0 0 40px;border-bottom:1px solid var(--line);padding-bottom:22px}.feynman-goal{font-size:18px;color:var(--ink);font-weight:600}.feynman-scenario{font-size:20px;line-height:1.85}.feynman-scope{font-size:14px;color:var(--muted);line-height:1.9}.feynman-scope summary{cursor:pointer;padding:8px 0}.feynman-scope p{margin-top:12px}.feynman-practice{font-size:16px;line-height:1.9}.feynman-practice>button{min-height:44px;margin:8px 0 22px}.feynman-practice label{display:block;margin:18px 0 8px}.feynman-practice textarea{display:block;resize:vertical;width:100%;min-height:150px;padding:14px;font-size:16px;line-height:1.9}.feynman-save{font-size:13px;color:var(--muted);margin-top:8px}.feynman-answer{border-top:1px solid var(--line);padding:12px 0;margin:18px 0}.feynman-answer summary{cursor:pointer;color:var(--blue);padding:10px 0;min-height:44px}.feynman-answer p{margin-top:15px;line-height:1.95;font-size:17px}.feynman-variations article{padding:16px 0 20px;border-bottom:1px solid var(--line)}.feynman-variations h3{font-size:19px}.feynman-course.is-recalling .feynman-reading{display:none}.feynman-course.is-recalling .feynman-start{display:none}.feynman-reference{margin-top:38px}#page-root.recall-mode>#detailed-flow,#page-root.recall-mode>#flows,#page-root.recall-mode>.reference-archive{display:none}@media(max-width:760px){.feynman-goal{font-size:16px}.feynman-scenario{font-size:18px}.feynman-answer p{font-size:16px}.feynman-scope{font-size:14px}.feynman-variations h3{font-size:18px}}
'''
s=s.replace('</style>',css+'\n</style>',1)
s=s.replace(" root.innerHTML = content;"," root.classList.remove('recall-mode');\n root.innerHTML = content;\n restoreFeynmanNotes();",1)
click=''' const recall=target.closest('[data-feynman-toggle]');
 if(recall){const course=recall.closest('[data-feynman-course]');const active=course.classList.toggle('is-recalling');root.classList.toggle('recall-mode',active);recall.setAttribute('aria-pressed',String(active));recall.textContent=active?'返回讲解，补上卡住的一步':'遮住讲解，开始复述';if(active){$$('.feynman-answer',course).forEach(x=>x.open=false);}document.getElementById('teach-back')?.scrollIntoView({block:'start'});return;}
'''
s=s.replace(" const svgLink = target.closest(",click+" const svgLink = target.closest(",1)
s=s.replace(" document.addEventListener('change', event => {",''' document.addEventListener('input',event=>{const el=event.target;if(!(el instanceof HTMLTextAreaElement)||!el.hasAttribute('data-feynman-note'))return;const note=el.parentElement.querySelector('[data-feynman-save]');try{localStorage.setItem('cockpit-feynman-'+el.dataset.feynmanNote,el.value);if(note)note.textContent='已保存在当前浏览器，不上传；这不是自动评分。';}catch(_){if(note)note.textContent='本地保存不可用，请自行复制记录。';}});
 document.addEventListener('change', event => {''',1)
# Index the causal lessons and practice; leave historical search reachable but labelled.
needle=" const page = pageOf(id), teaching = page.teaching || {};"
insert=needle+"\n if(page.feynman){const f=page.feynman;f.sections.forEach(x=>index.push({type:'chapter',title:'因果讲解：'+x.title,body:x.p.join('\\n'),href:routeHref('module',id,'section','learn-'+x.id),id:'learn-'+x.id,moduleId:id}));index.push({type:'chapter',title:'复述练习：'+page.title,body:[f.goal,f.retell.q,f.retell.a,...f.transfer.flatMap(q=>[q.q,q.a])].join('\\n'),href:routeHref('module',id,'section','teach-back'),id:'teach-back-'+id,moduleId:id});}"
assert needle in s;s=s.replace(needle,insert,1)
s=s.replace("title:lesson.title,body:lesson.paragraphs.join", "title:'版本细则：'+lesson.title,body:lesson.paragraphs.join",1)
# Favicon matches existing D brand; does not replace any original figure.
s=s.replace(' <title>豆包汽车 · 业务学习站</title>',' <title>豆包汽车 · 业务学习站</title>\n <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 64 64\'%3E%3Crect width=\'64\' height=\'64\' rx=\'10\' fill=\'%23eaf2fc\'/%3E%3Ctext x=\'32\' y=\'46\' text-anchor=\'middle\' font-size=\'44\' fill=\'%23245ca6\'%3ED%3C/text%3E%3C/svg%3E">',1)
a=s.index('const DATA=')+11;_,n=json.JSONDecoder().raw_decode(s[a:]);s=s[:a]+json.dumps(d,ensure_ascii=False,separators=(',',':'))+s[a+n:]
assert before['originalSvg']==d['originalSvg'] and before['diagrams']==d['diagrams'] and before['base']==d['base']
backup=R/'_backup'/('学习站-费曼版改前-'+datetime.datetime.now().strftime('%Y%m%d%H%M%S')+'.html');shutil.copy2(P,backup);P.write_text(s)
(R/'_v32/artifacts/费曼版改写记录.json').write_text(json.dumps({'backup':str(backup),'pages':len(chapters),'sections':sum(len(x['sections']) for x in chapters.values()),'retell':len(chapters),'transfer':sum(len(x['transfer']) for x in chapters.values()),'originalFiguresPreserved':True,'oldDetailsPreserved':True},ensure_ascii=False,indent=2));print('written',P,'chapters',len(chapters))
