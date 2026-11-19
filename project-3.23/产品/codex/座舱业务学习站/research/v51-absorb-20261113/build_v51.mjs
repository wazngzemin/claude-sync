import fs from 'node:fs';
import {round2} from './round2_patch.mjs';
import {round3} from './round3_patch.mjs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{JSDOM}=require('/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/jsdom');
const D=path.dirname(fileURLToPath(import.meta.url));
const read=f=>fs.readFileSync(path.join(D,f),'utf8');
const data=JSON.parse(read('baseline-data.json')),copy=JSON.parse(read('copy.json'));
const v=data.pages.find(p=>p.id==='V');
const ledger=[];
// Original prose is retained beside its concise replacement. Evidence caveats are grouped at each segment's end.
const edits={
'麦克风把车内的声音收进来':'麦克风收音后，声学前端先压低噪声，并参考车机播放内容消除回声，避免把音乐或豆包播报当成用户请求。',
'车上同时判断声音来自':'音区标明主驾、副驾或后排在说话，供确定回复对象和使用记忆。说话位置不等于操作位置；判断人数还要结合人脸、座椅压力，不能只数音区。',
'固定说法也叫高频缓存':'固定说法（高频缓存或正则缓存）把说法对应到指令。优先执行要求：意思明确、不依赖前文和情境，匹配正确、在已启用白名单内且车辆能力已接入。',

'主驾说“带我去昨天那家游泳馆”时':'车内噪声、车机播放和其他乘员的声音，都可能混进主驾的请求。第一步要听清这句话，并认准说话位置。',
'所以，“豆包没反应”':'“豆包没反应”先查收音、回声消除和音区，不能直接归因于 Planner。',
'图里沿着来源':'沿图看热词从哪里来、怎样进入本次识别。',
'回到“昨天那家游泳馆”，图左边':'热词只影响识别倾向，解决不了“昨天那家”是哪家。验收要查本次识别有没有带上词、最终有没有写对。',
'第一遍识别随着声音持续进行':'识别会陆续返回“带我去”“带我去昨天那家游泳馆”等过程文字。它会补长、修订，可更新页面或辅助判断，但不能据此执行，也不算正式提交或写入对话历史。',
'在主驾停顿的这一刻':'400 毫秒后主驾补上“附近的餐厅”，最终目标随之改变。识别必须接住补话。',
'豆包正在介绍刚搜到的餐厅':'豆包介绍餐厅时，主驾插话：“帮我把副驾座椅加热打开。”车里还有副驾：一直播报会抢话，逢人声就停又会被乘员聊天误打断。',
'主驾这句话可能依次被识别成':'同一次插话会产生多版过程文字，可能从“帮我”补成整句，也可能修正“副价”等错字；字数和更新次数不固定。',
'当文字变成“帮我把副驾”时':'例如识别到“帮我把副驾”时，模型结合最近对话判断；拿不准就等下一版，判为召回就通知车上停播。示例不代表每次都在这几个字时停。',
'模型只能根据实际收到的信息判断。':'模型只能用实际收到的有限历史。乘员刚聊过的餐厅没进入输入，就无法帮助判断“第二家呢”在问谁。复盘要还原当时输入，不能用后来的整句替代。',
'这张时间图跟着同一次插话':'沿图看哪版文字触发停播，以及为什么还要继续收音。',
'停播让主驾能够继续说完':'流式拒识只决定是否停播，停播不等于执行车控。系统继续收齐整句话，再由最终拒识决定接不接。',
'同一句“帮我把副驾座椅加热打开”，会涉及':'同一句车控请求涉及下面三项职责，模型名相近也不能混为一项。',
'“把话翻成函数和参数”叫':'FC（函数调用）把话转成具体功能和参数：座椅加热、副驾、打开。功能和参数都对，才有正确的候选指令；候选仍不等于执行成功。',
'主驾说到“游泳馆”后停了约':'主驾说到“游泳馆”后停了约 400 毫秒，又补“附近的餐厅”。判停太早会拆错需求，等太久又慢；提前准备利用停顿先算判断。',
'因此，300 毫秒时发出准备请求':'300 毫秒触发准备不等于说完，600 毫秒收尾也不保证句意完整。收尾后的补话会成为新一段；收尾后还要等识别定稿。',
'沿主驾这一行看':'图中 300 毫秒先准备，400 毫秒补话便重新计时；补话后再到 300 毫秒准备、600 毫秒收尾。两次准备面对不同需求，不能混用。',
'这些准备不会启动 DT':'预请求不启动 DT 规划、不翻译车控执行指令、不调用工具、不播报、不写对话历史。此时按“去游泳馆”导航，就会错过后面的餐厅需求。',
'主驾补完“附近的餐厅”，停满':'补话后停满本例的 600 毫秒，车上收尾。云端用整段录音做第二遍识别，修正并交出定稿；用户不用重说，定稿仍可能出错。',
'顺利时，这次交出的定稿':'定稿应是“带我去昨天那家游泳馆附近的餐厅”。正式提交时核对请求归属和文字匹配：第二次准备适用才复用，第一次不能替代整句判断；不匹配就重算。',
'主例有一次明显停顿':'不停顿就没有提前准备机会；定稿改字也可能导致重算。评估要同时看复用比例、实际节省等待和额外计算成本。',
'另一类问题出在收尾太早':'“那你帮我打开／那个／设置的地方”若被切成三段，每段都缺信息，可能被拒识。要连着切句和上下文一起查，不能只提高最后一段通过率。',
'回到主例，主驾已经说完':'完整请求是“带我去昨天那家游泳馆附近的餐厅”。云端判断是否接话，本地用自己的识别文字判断能不能办；两路可同时计算。',
'本地有两种处理办法':'本地用固定说法匹配指令，或用车控模型理解更多说法。固定说法只读本句，模型还读有限历史；各项目可能先规则后模型，也可能并行。',
'本地适合简单车控':'本地适合简单车控、系统设置、导航基础操作、本地音乐、通讯录拨号和打开应用。开放问答、联网搜索、多步规划、大量车况或长期记忆查询要交云端；本例本地办不了，不代表产品办不了。',
'本例如果被本地判为能办':'把查记忆、搜餐厅判成本地能办，是分流错误；把副驾加热翻成主驾加热，是参数错误。验收应分开统计。',
'主驾说完“带我去昨天那家游泳馆附近的餐厅”，系统':'请求和说话人已知，游泳馆的具体地点仍缺失。先补地点再搜餐厅，直接按车辆当前位置搜索可能找错。',
'DT（Director，也叫 Planner':'DT（Director，也叫 Planner）理解需求、安排步骤并调用工具。它收到请求和 Context（上下文）：位置、导航状态、时间、说话人、相关对话及记忆。背景能辅助理解，不能凭空补地址。',
'这张图区分系统提前':'沿图区分提前带入的记忆和 DT 发现缺口后主动查询的记忆。',
'DT 把搜索动作放进':'DT 通过 action_list（动作清单）安排搜索；工具用 tool_feedback（工具返回结果）交回真实餐厅列表，再展示给用户。决定搜索不等于已展示；查不到或工具失败，不能说“已经找到”。',
'用户接着说“第二个”时':'“第二个”依赖实际展示的列表及顺序。DT 要据此取第二家餐厅的地点；返回顺序与展示不一致，或列表没进入下一轮上下文，都会选错。',
'这张图把本地与云端':'沿图看固定说法、正常联网、断网超时分别采用哪路结果。',
'回写是把这一轮发生的事':'回写记录用户说了什么、采用哪路、实际执行及展示了什么。“第二个”要保留真实列表和顺序；“再低一点”要保留刚才的设置和执行结果。回写后还需另一步总结记忆。',
'这次请求的交接应当能说清':'本例依次补地点、搜餐厅、展示真实列表、保留顺序。仲裁决定执行哪路，回写记录实际结果，执行失败也要记录。'
};
for(const s of v.v34.sections){
 if(!copy.sections[s.id])continue;
 const dom=new JSDOM(s.html),doc=dom.window.document,b=doc.body;let seq=0;const caveats=[];
 function archive(el,old,title='展开看解释与例子'){
 const detail=doc.createElement('details');detail.className='v49-detail';detail.id=`v51-${s.id}-explain-${++seq}`;detail.innerHTML=`<summary>${title}</summary><div class="v49-detail-body">${old}</div>`;el.after(detail);ledger.push({section:s.id,original:old,target:detail.id});
 }
 for(const el of [...b.querySelectorAll('p,div.v39-hand')]){
  if(el.closest('details'))continue;
  const old=el.outerHTML, txt=el.textContent;
  const key=Object.keys(edits).find(k=>txt.startsWith(k));
  if(key){el.textContent=edits[key];archive(el,old);}
 }
 // Keep the reading budget conservative: count diagram labels as visible body too.
 const foldRules=[
 ['如果豆包处于全时聆听','未唤醒时，声音什么时候上云？'],
 ['检查这一段的体验','识别速度与正确率怎样一起验收？'],
 ['如果最终文字错了','怎样区分识别错字和切句错误？'],
 ['“帮我”“打开”这样的说法','相同措辞为什么可能在对不同的人说？'],
 ['乘客之间聊天却让豆包停下','怎样复盘误打断和停播延迟？'],
 ['用户刚叫醒豆包','唤醒首句有什么直接接话规则？'],
 ['车上只有一个人时，还有','单人不拒识怎样生效，怎样排查？'],
 ['本地对“不该接”和“能办”','本地给出拒识或指令要有多大把握？'],
 ['记忆按人隔离','哪些历史能带入，哪些要隔离？'],
 ['同一时刻，用户的新话','多种输入同时到达时由谁安排？'],
 ['如果本地办成功但同步失败','实际执行与同步结果不一致，会出什么问题？'],
 ['模型只能用实际收到的有限历史','为什么复盘必须还原当时收到的历史？'],
 ['第二遍识别的收益','第二遍识别的准确率与耗时怎样比较？']
 ];
 for(const el of [...b.querySelectorAll('p')]){if(el.closest('details'))continue;const rule=foldRules.find(([prefix])=>el.textContent.startsWith(prefix));if(rule){archive(el,el.outerHTML,rule[1]);el.remove();}}

 // Keep exact original caveat sentences, including surrounding scope, at segment end.
 for(const el of [...b.querySelectorAll('p,div.v39-hand')]){
  if(el.closest('details'))continue;
  const original=el.outerHTML;
  let sentences=el.innerHTML.match(/[^。！？]*[。！？]|[^。！？]+$/g)||[];
  let removed=[];
  sentences=sentences.filter(t=>{
   if(/待确认|待核实|仍需|不能据此/.test(t)&&!t.includes('不能据此执行')){removed.push(t);return false;}return true;
  });
  if(removed.length){caveats.push(original);el.innerHTML=sentences.join('');ledger.push({section:s.id,original,target:`v51-${s.id}-pending`});}
 }
 for(const el of [...b.querySelectorAll('p,div.v39-hand')]){
  if(el.closest('details'))continue;
  if(el.textContent.startsWith('前者影响断网')){el.remove();continue;}
  el.innerHTML=el.innerHTML.replace('两条判断都不能','停播判断和判停都不能').replace('它和“超时采用本地车控候选”是两个不同的边界，第五段会继续解释。','').replace('云端也有“车控干预”这种快路','云端“车控干预”方案设计了一条快路');
 }
 // Explicit version limits are preserved when the shortened prose no longer repeats them.
 if(s.id==='v39-s3')caveats.push('<p>具体车型用哪一版、是否复用同一份模型，目前还不能统一确认。</p>');
 if(s.id==='v39-s5'){
  const p=[...b.querySelectorAll('p')].find(p=>!p.closest('details')&&p.textContent.startsWith('端云仲裁负责'));
  p.innerHTML=p.innerHTML.replace('云端超过等待时间','云端超时（3 秒）');
 }
 for(const el of [...b.querySelectorAll('p,div')].reverse())if(!el.textContent.trim()&&!el.querySelector('img,svg,table'))el.remove();
 const c=copy.sections[s.id];
 const intro=doc.createElement('section');intro.className='v51-guide';intro.id=`v51-${s.id}-purpose`;intro.dataset.sectionTitle=s.title.slice(0,3)+' · 这一段解决什么';intro.innerHTML=`<h3>这一段解决什么</h3><p>${c.intro}</p>`;b.prepend(intro);
 const pending=doc.createElement('details');pending.className='v49-detail';pending.id=`v51-${s.id}-pending`;pending.innerHTML=`<summary>本段尚未确认的事项</summary><div class="v49-detail-body">${caveats.join('')||'<p>本段正文未另列未确认项；既有测试范围和配置限制见上方对应展开项。</p>'}</div>`;b.append(pending);
 const end=doc.createElement('section');end.className='v51-takeaway';end.id=`v51-${s.id}-remember`;end.dataset.sectionTitle=s.title.slice(0,3)+' · 记住这三句';end.innerHTML=`<h3>记住这三句</h3><ul>${c.points.map(p=>`<li>${p}</li>`).join('')}</ul><p><b>面试这样说：</b>${c.interview}</p>`;b.append(end);
 s.html=b.innerHTML.replace(/\n\s*\n/g,'\n');dom.window.close();
}
const retell=v.v34.sections.find(s=>s.id==='v39-retell');
const oldRetell=retell.html.match(/<div class="v34-retell">([\s\S]*?)<\/div>/)[0];
retell.html=retell.html.replace(oldRetell,`<div class="v34-retell">${copy.retell.map(t=>`<p>${t}</p>`).join('')}</div><details class="v49-detail" id="v51-retell-original"><summary>展开看原版讲解</summary><div class="v49-detail-body">${oldRetell}</div></details>`);
v.v34.sections.splice(v.v34.sections.indexOf(retell),0,{id:'v51-short',title:'30 秒版',html:`<div class="v51-guide"><p>${copy.short}</p></div>`});
round2(v,ledger);
round3(v,ledger);
function plain(h){const d=new JSDOM(h);const t=d.window.document.body.textContent;d.window.close();return t;}
v.sections=v.v34.sections.map(s=>({id:s.id,title:s.title,paragraphs:[plain(s.html)],sourceIds:[]}));v.teaching.intro=[plain(v.v34.intro)];v.teaching.lessons=v.sections;v.teaching.closing=[];
fs.writeFileSync(path.join(D,'candidate-data.json'),JSON.stringify(data));fs.writeFileSync(path.join(D,'preservation-ledger.json'),JSON.stringify(ledger,null,2));
let app=read('baseline-app.js').replaceAll("revision: 'v50'","revision: 'v51'").replaceAll('我的修订-v50.html','我的修订-v51.html');
app=app.replace("v.sections.map(s=>'<li><a href=\"#'+esc(s.id)+'\">'+esc(s.title)+'</a></li>').join('')",`v.sections.map(s=>{const holder=document.createElement('div');holder.innerHTML=s.html;return '<li><a href="#'+esc(s.id)+'">'+esc(s.title)+'</a>'+[...holder.querySelectorAll('.v51-guide[id],.v51-takeaway[id]')].map(n=>'<div><a href="#'+esc(n.id)+'">'+esc(n.dataset.sectionTitle)+'</a></div>').join('')+'</li>';}).join('')`);
app=app.replace("holder.querySelectorAll('details.v49-detail[id]').forEach(detail=>{","holder.querySelectorAll('details.v49-detail[id],.v51-guide[id],.v51-takeaway[id]').forEach(detail=>{");
app=app.replace("detail.querySelector('summary')?.textContent||s.title","detail.querySelector('summary,h3')?.textContent||s.title");
fs.writeFileSync(path.join(D,'candidate-app.js'),app);
let integrity=JSON.parse(read('baseline-integrity.json')),html=fs.readFileSync(integrity.path,'utf8');
html=html.replace(/<script([^>]*)>([\s\S]*?)<\/script>/g,(all,attrs,body)=>{
 if(attrs.includes('id="learning-doc-data"'))body=JSON.stringify({revision:'v51',pages:{}});
 else if(/^\s*const DATA\s*=/.test(body))body='\nconst DATA='+JSON.stringify(data).replaceAll('</','<\\/')+';\n';
 else if(body.includes('function renderModule'))body=app;else return all;
 return '<script'+attrs+'>'+body+'</script>';
}).replace('<title>豆包汽车业务学习站 v50</title>','<title>豆包汽车业务学习站 v51</title>');
html=html.replace('</head>',`<style id="v51-reading-style">.voice-lesson .v51-guide,.voice-lesson .v51-takeaway{border:1px solid var(--line);border-left:4px solid var(--blue);border-radius:12px;padding:16px 20px;margin:18px 0;background:var(--soft);color:var(--ink);min-width:0;overflow-wrap:anywhere}.voice-lesson .v51-guide h3,.voice-lesson .v51-takeaway h3{margin:0 0 8px}.voice-lesson .v51-guide p,.voice-lesson .v51-takeaway p{margin:8px 0}.voice-lesson .v51-takeaway li{margin:6px 0}.v34-toc li>div{font-size:.9em;margin:4px 0 4px 12px}</style></head>`);
const out=integrity.path.replace('v50.html','v51.html');fs.writeFileSync(out,html);integrity.output=out;fs.writeFileSync(path.join(D,'baseline-integrity.json'),JSON.stringify(integrity,null,2));console.log(out);
