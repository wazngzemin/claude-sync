from pathlib import Path
import json,copy,datetime,shutil,re
R=Path('/Users/bytedance/Desktop/3.23/产品/codex/HTML/01-进行中');P=R/'豆包汽车-业务学习站-v31-工作副本.html';s=P.read_text()
a=s.index('const DATA=')+11;d,n=json.JSONDecoder().raw_decode(s[a:]);before=copy.deepcopy(d)
B={
'V':"上一站什么都没有，只有声音。这一章把声音变成一份能交给别人的输入：先确认现在能不能听、是谁在说，再边听边出字，靠停顿判断说完没有，最后用整段录音定稿。它不查「昨天那家」是哪家，也不开导航——那份定稿文字交给下一章的入口。",
'R':"上一章交来一句定稿文字、说话音区和输入编号。这一章先回答「这句话该不该由豆包接」，再回答「接了之后本地算数还是云端算数」，最后拦住迟到的回包，不让同一个动作做两遍。判断完，它把一条有效请求交给输入管理排队。",
'M':"入口放行的请求不会一条一条来。这一章处理同时到达的四类东西：用户新话、主动建议、工具回执、打断事件；先看旧轮走到哪一步，再决定取消还是合并，最后用播放器的真实进度确认这一轮说完没有。它交出去的是「这一轮按什么顺序、带着哪些有效身份进入推理」。",
'C':"输入管理送来一条有效请求，Director 还没开始想。这一章先把推理要用的背景摆上桌：说话人是谁、车现在什么状态、刚才发生过什么、这个人有什么偏好、这辆车能做什么。常用背景提前备，缺的那一项等 Director 显式去查——背景不替它猜一个地址。",
'D':"背景备好，轮到这一章做决定。Director 先确认用户到底要达成什么，再判断缺的是地址、是选择，还是要澄清；能一轮办完的就发动作，依赖前一步结果的留到下一轮。它输出四样东西：说不说、说什么、什么表情、做哪些动作。",
'E':"Director 给出 action_list，这一章负责把它办成事实。先在本项目里找到真正启用的那个工具，确认这一轮仍有执行资格，再调用、收阶段回执，把每项的成功与失败分清。结果不在这里自行续写下一步，而是回到输入管理，交给同一个 Director。",
'O':"执行层回来了，接下来用户要听见、看见。这一章把文字变成声音：决定这一轮开不开口、走在线还是离线合成、按业务顺序播放、去抢车内音频焦点；同时把卡片、表情和状态动画对齐到同一件事。最后用播放器事件确认真的起播、真的播完。",
'I':"豆包正在说，车里有人插话。这一章先看旧请求走到哪一步：还没出首字可以合并，出了首字就打断；再判断新话是对豆包说的还是乘客闲聊；最后决定旧话要不要补、已经下发的动作要不要动。停声、停推理、取消任务、撤销已执行动作，是四件不同的事。",
'W':"屏幕上有一张餐厅卡，用户说「第二个」。这一章靠业务登记的名册把这句话对到一个控件：页面报上可点的元素，定稿文字按规则匹配，唯一目标才交给业务点下去，真实回执再写进历史。它不让模型看图猜按钮，也不给模型操作整块屏幕的权限。",
'F':"模型想调一个工具，先要问这辆车有没有。这一章讲工具怎么被准入：车型、渠道、账号、当前状态逐层过滤，缺一项这一轮就不出现；调用时按 Agent 协议带上身份和参数，回来时把计划、受理、执行三种进度分开。工具存在，不等于这台车能用。",
'K':"用户说「带我去昨天那家游泳馆」，系统得先知道「昨天那家」属于谁、存在哪里。这一章先解析车、账号、人脸三层身份，再分清历史输入、摘要、瞬时、短期、长期各自解决什么问题，最后讲写入、召回、删除、开关各改的是哪一份内容。查到记忆，不等于可以直接导航。",
'T':"用户交办的是一句未来才会发生的事。这一章把安排存成任务、把叫醒规则登记给触发器，等条件命中再产生一次运行；运行结果按这次执行记账，最后按结束策略关闭或继续等待。创建成功只说明安排被接住，不代表提醒已经送达。",
'B':"所有判断都要有事实垫底。这一章讲车况、乘员、视觉三类事实怎么采上来、怎么对齐到同一台车同一个时刻、过期了怎么标未知；同一份事实分三路给 Context、触发器和 Advisor。它不决定要不要提醒，只保证交出去的事实可信。",
'A':"有些需求要「看」。这一章分三种看：上电后一直跑的持续观察、用户交办的跟踪任务、当场问一句的视觉问答。看到的东西要带上座位、时间、来源才算证据；证据只到它到得了的那一层，不替决策模块下结论。",
'G':"一条场景配好了，谁来发现它该在什么时候发生。这一章先圈定适用车辆和信号，再判断条件是否达成，过次数与间隔限制后按配置好的出口交出去。它只通知「条件命中了」，不直接控车，也不替任务服务决定这条安排还在不在。",
'S':"用户没开口，但车里很热、后排孩子哭了。这一章讲主动服务：什么事件叫醒顾问、收集哪些依据、此刻值不值得打扰、建议带什么策略走哪条出口。它只提出建议，确认与执行仍回到 Director 和车控。",
'P':"产品经理在后台配一条规则，保存成功不等于上线。这一章走完从配置到发布：选模式、圈车辆和版本、把条件与动作连成判断图、配频控，再经校验、注册、范围核对下发；最后靠触发记录在目标车上确认它到底跑没跑。",
'L':"有些事等不了云端。这一章讲端侧闭环：车辆上电后就地装载规则、订阅信号、两级粗筛条件，命中后交原业务出卡，用户确认时再核一次车况，最后控车并回读真实状态。它不生成话术，也不理解用户意图。",
'H':"感知命中了，但用户没问任何问题。这一章讲两条安静的出口：中控上的一行固定文字，和风挡上的一个图形。两条通道各自下发、互不等待，也要分别确认真的曝光；文字出现了，不代表图形也接通。",
'U':"任务在后台跑，用户得在界面上找得到它。这一章讲任务中心、任务岛和交互卡：什么进列表、什么只弹一次、角标算哪些、三个编号怎么对齐，用户点了确认或取消之后，后台和界面按什么顺序收。界面显示，不等于后台真的做了。",
'EV':"车里发生的事大多没人开口。这一章讲什么变化值得写成一条业务事件：三类来源、统一的事件定义、按时间追加；写进去之后，触发器实时扫、记忆按天总结、Advisor 按主题取。事件是事实，不是判断。",
'EL':"事件写进去之后，要能查得到、查得清。这一章讲事件日志怎么按统一字段保存、下游各按自己的窗口取数、badcase 从哪一层开始反查。日志完整不等于记忆已经生成，也不等于用户已经被告知。",
'DR':"有些行程不是一句话能办完。这一章讲司机 Agent 怎么把导航、临停、泊车串成专项任务：先确定缺的是地点还是执行条件，再把停靠要求绑到具体的点和路线，最后把真实结果交回 Director 组织话术。",
'SE':"同一句「下次别这样」，可能是在存偏好、在改处理方法、也可能是在训练模型。这一章讲专家知识给的是处理方法，个人记忆给的是事实，模型训练改的是能力；一条改动要沿保存、适用、加载、采用、执行五步验证，才算真的生效。",
}
assert set(B)=={p['id'] for p in d['pages']}
for p in d['pages']:p['bridge']=B[p['id']]
d['meta']['readerEdition']='先读一条完整因果链，再看细节；复述与变式练习放在章末，可选'

start=s.index(' function renderFeynman(page) {');end=s.index('\n function renderFlow(page,flow)',start)
new=r''' function renderChapterPractice(page){
 const f=page.feynman;if(!f)return '';
 return '<details class="chapter-practice" id="teach-back"><summary>想检验自己能不能讲出来？做一次复述</summary><div class="practice-body"><p>先合上讲义，用自己的话把这一章从头讲一遍。卡在哪个交接，就回到那一步补理解；不需要背原句。</p><button type="button" data-chapter-hide aria-pressed="false">合上讲义</button><h3>'+esc(f.retell.q)+'</h3><label for="chapter-note-'+esc(page.id)+'">写下你的讲法，或记下卡住的位置（只存在当前浏览器，不上传，不评分）</label><textarea id="chapter-note-'+esc(page.id)+'" data-chapter-note="'+esc(page.id)+'" rows="5" placeholder="此时还缺什么，因此谁做了什么，结果让下一步知道了什么……"></textarea><p class="practice-save" data-practice-save role="status">可以直接口头讲，也可以写在这里。</p><details class="practice-answer"><summary>讲完对照参考讲法</summary>'+para(f.retell.a)+'</details><div class="practice-transfer">'+f.transfer.map(q=>'<article><h3>'+esc(q.q)+'</h3><details class="practice-answer"><summary>先自己回答，再看原因</summary>'+para(q.a)+'<a href="'+routeHref('module',page.id,'section','learn-'+q.review)+'">回到对应解释</a></details></article>').join('')+'</div></div></details>';
 }
 function restoreChapterNotes(){
  $$('[data-chapter-note]',root).forEach(el=>{try{el.value=localStorage.getItem('cockpit-chapter-'+el.dataset.chapterNote)||'';}catch(_){const st=el.parentElement.querySelector('[data-practice-save]');if(st)st.textContent='此浏览器不能本地保存，可以先口头讲。';}});
 }
 function renderModule(id) {
 if (!pageIds.includes(id)) return renderMissing('没有这个模块', '请从目录选择已有模块。');
 const page=pageOf(id), module=moduleById.get(id), teaching=page.teaching, f=page.feynman;
 let html=heading(page.title,'',{crumbs:[{label:titleOf(id)}],actions:module?'<a class="button-link" href="'+routeHref('module',id,'section','detailed-flow')+'">对照本章原图</a>':''});
 if(page.bridge)html+='<div class="chapter-bridge"><p class="bridge-label">这一章接在哪儿</p><p>'+esc(page.bridge)+'</p></div>';
 html+='<div id="chapter-reading">';
 if(teaching){
  if(page.bridge)html+='<details class="chapter-opening"><summary>先看这一章要回答的问题</summary><div class="lecture-prose">'+teaching.intro.map(para).join('')+'</div></details>';
  else html+='<div class="lecture-prose lecture-opening">'+teaching.intro.map(para).join('')+'</div>';
  html+=teaching.lessons.map(lesson=>section(lesson.id,lesson.title,'<div class="lecture-prose" data-teaching-lesson="'+esc(lesson.id)+'">'+lesson.paragraphs.map(para).join('')+'</div>'+(arr(lesson.sourceIds).length?sourceStrip(lesson.sourceIds):''))).join('');
  if(arr(teaching.closing).length)html+='<div class="lecture-prose chapter-ending">'+teaching.closing.map(para).join('')+'</div>';
 } else if(f){html+='<div class="lecture-prose lecture-opening">'+para(f.scenario)+'</div>';}
 html+='</div>';
 if(module && DATA.originalSvg)html+=section('detailed-flow','把刚才的接力对回原图',figure({key:'base-'+id,title:page.title,svg:DATA.originalSvg,crop:[module.x-35,module.y-35,module.w+70,module.h+70],pageId:id})+'<details class="reference-archive"><summary>展开原图逐节点说明</summary><div class="reference-content">'+renderGuide(page,'base')+'</div></details>');
 if(arr(page.flows).length)html+=section('flows',module?'相关分支原图':'本章业务原图',page.flows.map(flow=>renderFlow(page,flow)).join(''));
 html+=renderChapterPractice(page);
 const refs=unique([...arr(page.sourceIds),...arr(teaching?.sourceIds),...arr(f?.sourceIds),...arr(teaching?.lessons).flatMap(l=>arr(l.sourceIds))]);
 if(refs.length)html+='<details class="reference-archive" id="chapter-sources"><summary>查看本章依据与原文链接</summary><div class="reference-content">'+renderSourceList(refs)+'</div></details>';
 return html;
 }
'''
s=s[:start]+new+s[end:]
css='''
.chapter-bridge{max-width:900px;margin:0 0 34px;padding:20px 22px;background:#f4f7fb;border-left:3px solid #245ca6}.chapter-bridge .bridge-label{margin:0 0 8px;font-size:13px;letter-spacing:.06em;color:#5a7191}.chapter-bridge p:last-child{margin:0;font-size:18px;line-height:1.95;color:#1c2b3d}.chapter-opening{margin:0 0 26px}.chapter-opening summary{cursor:pointer;color:#245ca6;font-size:15px;padding:10px 0;min-height:44px}.chapter-opening .lecture-prose{margin-top:10px;font-size:16px;color:#3a4859}.chapter-practice{margin:44px 0 10px;border-top:1px solid #dbe3ec;padding-top:18px}.chapter-practice>summary{cursor:pointer;font-size:17px;color:#245ca6;padding:12px 0;min-height:44px}.practice-body{font-size:16px;line-height:1.9}.practice-body>button{min-height:44px;margin:10px 0 18px}.practice-body label{display:block;margin:16px 0 8px}.practice-body textarea{display:block;width:100%;min-height:140px;padding:14px;font-size:16px;line-height:1.85;resize:vertical}.practice-save{font-size:13px;color:#68778a;margin-top:8px}.practice-answer{border-top:1px solid #e3e9f1;margin:16px 0;padding:10px 0}.practice-answer summary{cursor:pointer;color:#245ca6;padding:10px 0;min-height:44px}.practice-answer p{margin-top:14px;font-size:17px;line-height:1.95}.practice-transfer article{padding:14px 0;border-bottom:1px solid #e3e9f1}.practice-transfer h3{font-size:18px}.is-hidden{display:none!important}@media(max-width:760px){.chapter-bridge{padding:16px 16px}.chapter-bridge p:last-child{font-size:17px}.practice-body textarea{font-size:16px}}
'''
s=s.replace('</style>',css+'\n</style>',1)
s=s.replace(" root.innerHTML = content;"," root.innerHTML = content;\n restoreChapterNotes();",1)
click=''' const hideBtn=target.closest('[data-chapter-hide]');
 if(hideBtn){const box=document.getElementById('chapter-reading');if(!box)return;const hidden=box.classList.toggle('is-hidden');hideBtn.setAttribute('aria-pressed',String(hidden));hideBtn.textContent=hidden?'展开讲义':'合上讲义';if(hidden){$$('.practice-answer').forEach(x=>x.open=false);box.scrollIntoView({block:'start'});}return;}
'''
s=s.replace(" const svgLink = target.closest(",click+" const svgLink = target.closest(",1)
s=s.replace(" document.addEventListener('change', event => {",''' document.addEventListener('input',event=>{const el=event.target;if(!(el instanceof HTMLTextAreaElement)||!el.hasAttribute('data-chapter-note'))return;const st=el.parentElement.querySelector('[data-practice-save]');try{localStorage.setItem('cockpit-chapter-'+el.dataset.chapterNote,el.value);if(st)st.textContent='已保存在当前浏览器，不上传，也不自动判分。';}catch(_){if(st)st.textContent='本地保存不可用，请自行复制。';}});
 document.addEventListener('change', event => {''',1)
s=s.replace("title:lesson.title,body:lesson.paragraphs.join", "title:lesson.title,body:lesson.paragraphs.join",1)
a=s.index('const DATA=')+11;_,n=json.JSONDecoder().raw_decode(s[a:]);s=s[:a]+json.dumps(d,ensure_ascii=False,separators=(',',':'))+s[a+n:]
assert before['originalSvg']==d['originalSvg'] and before['diagrams']==d['diagrams'] and before['base']==d['base']
bk=R/'_backup'/('学习站-恢复完整讲义前-'+datetime.datetime.now().strftime('%Y%m%d%H%M%S')+'.html');shutil.copy2(P,bk);P.write_text(s)
(R/'_v32/artifacts/讲义恢复记录.json').write_text(json.dumps({'backup':str(bk),'pages':len(B),'mode':'full teaching default + chapter bridge + optional recall practice','figuresPreserved':True},ensure_ascii=False,indent=2));print('ok',len(s),bk)
