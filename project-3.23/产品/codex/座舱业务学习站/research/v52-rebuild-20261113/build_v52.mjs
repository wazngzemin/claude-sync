import fs from 'node:fs';
import {createRequire} from 'node:module';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url),{JSDOM}=require('/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/jsdom');
const D=path.dirname(fileURLToPath(import.meta.url)),B=path.resolve(D,'../v51-absorb-20261113');
const basePath=path.resolve(D,'../../../HTML/01-进行中/豆包汽车-业务学习站-v50.html');
const base=fs.readFileSync(basePath,'utf8');
const scriptBodies=[...base.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)];
const dataBody=scriptBodies.find(m=>/^\s*const DATA\s*=/.test(m[2]))[2];
const data=Function(dataBody+';return DATA')();
const original=structuredClone(data),v=data.pages.find(p=>p.id==='V'),ledger=[];
const mainIds=['v39-s1','v39-s2','v39-s4','v39-s5','v39-s3'];
const intro={
'v39-s1':'这次请求从主驾的声音开始，系统还没有可交给后面判断的文字。车上先处理声音并标明说话位置，语音识别再逐步交出文字；这一段先看输入怎样变得可用。',
'v39-s2':'上一段已经交出过程文字和主驾音区，但“去游泳馆”还不是最终需求。现在由车上的判停观察主驾是否继续说，云端利用停顿提前准备判断；两边都要给后面的补话留出余地。',
'v39-s4':'上一段交出了完整的找餐厅请求，以及仍能复用的准备结果。现在还没有决定是否接话、由哪边处理：云端判断用户是不是在找豆包，车上判断本地能不能完成，不能把这两个问题混成一个。',
'v39-s5':'上一段已经接住找餐厅的请求，本地将它交给云端继续处理。现在缺的是游泳馆的具体地点：系统先给 Planner 带上背景，Planner 再判断信息是否够用，决定补查还是搜索。',
'v39-s3':'主线已经走到展示餐厅并保留结果。接着看一个有条件才发生的分支：豆包介绍餐厅时，用户又开口了；系统先判断要不要让出说话机会，再把新请求接回前面讲过的判停、受理与执行链路。'
};
const replacements={
'具体车型的线上数值和开关仍需核对，不能将本例直接当作两款车的当前配置。':'具体车型的线上数值和开关以项目配置为准。',
'线上复用采用文字完全一致还是相似度规则，仍待确认；这会影响补字、改字后能否安全使用旧结果。':'补字、改字后是否能复用，要按项目采用的匹配规则判断；不符合规则就重新计算。',
'结合句意判断是否说完是另一类方案，具体采用情况仍待确认。':'结合句意判断是否说完是另一类方案，使用时要按项目实际采用的方案区分。',
'每次实际带入多少轮历史仍待核实。':'',
'如果声音已经上云，之后又超时，本地 reject 是否采用仍待确认。':'声音已经上云又超时，本地“不该接”的结论要按项目的采纳规则处理。',
'云端也有“车控干预”这种快路：与最终拒识同时计算，拒识通过且命中干预时，直接返回车控指令。它在各项目是否已经上线仍待确认，不能把这条快路当成所有请求的既定步骤。':'云端“车控干预”方案还设计了这样一条快路：与最终拒识同时计算，拒识通过且命中干预时，直接返回车控指令。只有项目启用了这条快路，才按这条分支处理。',
'图展示的是这些信息的去向，不能据此认定每件车上发生的事都已经上报。':'图展示信息的去向；只有实际记录并交来的信息，才能参与这次判断。',
'这里说明的是应当如何处理信息缺口，不能据此承诺当前版本每次都会正确查询和澄清。':'这里讲的是信息缺口应怎样处理，实际体验还要检查有没有查对、问清。',
'具体生效版本仍需确认。':'实际采用的仲裁规则以项目生效版本为准。',
'已上云超时后，本地 reject（拒绝处理）的结果是否采纳仍待确认。':'',
'这是教学示例；人人对话记录怎样交给 DT 使用仍待接通，不能把已记录理解为 DT 已经会用。':'这是教学示例；记录还要接入 DT 的输入，才能用于理解请求。',
'两路计划汇入事件流，后面仍需把相关内容作为背景交给 DT。':'两路计划汇入事件流，后面还要把相关内容作为背景交给 DT。',
'图中停播后“继续收音”，也不能据此认定模型已停止后续调用。':'',
'还有两个接口边界待核实：流式判断实际采用在线还是离线的过程文字，以及停播后是否继续调用模型。前者影响断网时能否判断，后者影响重复调用；目前能确定的是停播后仍继续收音。':'停播后仍继续收音，直到拿到完整请求。断网时能否作流式判断，要看项目接入的文字来源。',
'具体车型用哪一版、是否复用同一份模型，目前还不能统一确认。':'模型职责要分别验收，具体使用哪份模型按项目区分。',
'若豆包正在播报，插话判断会利用当时可用的过程文字决定是否停播，具体取在线还是离线结果仍待核实；判停则继续观察主驾是否还会开口。':'判停继续观察主驾是否还会开口；若豆包正在播报，插话判断还会利用当时可用的过程文字决定是否停播，这个分支放在主线之后说明。',
};
const ref=t=>t.replace(/第([二三四五])段/g,(_,n)=>'第'+({二:'五',三:'二',四:'三',五:'四'}[n])+'段').replace('第四、五段','第三、四段');
for(const s of v.v34.sections){
 const dom=new JSDOM(s.html),doc=dom.window.document,b=doc.body,pending=[];
 if(mainIds.includes(s.id)){
  // Move only evidence caveats; every replaced source passage is retained verbatim in the ledger and disclosure.
  for(const el of [...b.querySelectorAll('p,div.v39-hand')]){
   if(el.closest('details'))continue;
   for(const [old,next]of Object.entries(replacements))if(el.innerHTML.includes(old)){
    el.innerHTML=el.innerHTML.replace(old,next);pending.push(old);ledger.push({type:'caveat',section:s.id,original:old,replacement:next,target:`v52-${s.id}-pending`});
   }
  }
  for(const el of [...b.querySelectorAll('.v39-hand')]){const p=doc.createElement('p');p.innerHTML=el.innerHTML;el.replaceWith(p);}
  b.insertAdjacentHTML('afterbegin',`<p>${intro[s.id]}</p>`);
 }
 // Group all supplements belonging to the same heading; source disclosures stay at segment end.
 let group=0;const groups=new Map(),sources=[];
 for(const node of [...b.children]){
  if(/^H[34]$/.test(node.tagName))group++;
  if(node.tagName!=='DETAILS')continue;
  const title=node.querySelector('summary')?.textContent||'';
  if(/本段.*(来源|依据)|本节来源/.test(title)){sources.push(node);continue;}
  // The late local-history note belongs to the streaming-model explanation.
  const key=node.id==='v50-stream-local-history'?2:group;
  if(!groups.has(key))groups.set(key,[]);groups.get(key).push(node);
 }
 for(const [g,items]of groups){
  if(items.length===1)continue;
  const first=items[0],last=items.at(-1),merged=doc.createElement('details');merged.className='v49-detail';merged.id=first.id;
  const titles=items.map(x=>x.querySelector('summary').textContent);
  const heading=[...b.children].filter(x=>/^H[34]$/.test(x.tagName))[g-1]?.textContent;
  const special={ 'v39-toolbox':'查排查分工、指标、未决方案和各环节口径','v39-plan-arb':'查仲裁规则演进、实测、车型差异与 30B 规划','v39-plan-mem':'查记忆窗口、更新周期、人员隔离与历史方案','v39-plan-sync':'查地址同步、文字记忆方案与尚缺材料','v39-plan-lat':'查分段耗时、提速收益、统计口径与异常','v39-map':'查流程图依据与车型差异'};
  const title=special[s.id]||(heading?`${heading}：查配置、评测与历史依据`:`查${titles[0].replace(/[？?]$/,'')}及相关记录`);
  merged.innerHTML='<summary></summary><div class="v49-detail-body"></div>';merged.querySelector('summary').textContent=title;
  const body=merged.lastElementChild;
  for(const item of items){const oldTitle=item.querySelector('summary').textContent;const block=doc.createElement('div');if(item.id!==merged.id)block.id=item.id;block.innerHTML='<h4></h4>';block.querySelector('h4').textContent=oldTitle;const content=item.querySelector('.v49-detail-body');block.insertAdjacentHTML('beforeend',content?content.innerHTML:[...item.children].filter(x=>x.tagName!=='SUMMARY').map(x=>x.outerHTML).join(''));body.append(block);ledger.push({type:'merge',section:s.id,from:item.id,title:oldTitle,target:merged.id,original:content?.innerHTML||''});}
  last.after(merged);items.forEach(x=>x.remove());
 }
 if(sources.length){const first=sources[0];first.querySelector('summary').textContent=mainIds.includes(s.id)?'资料来源':'本节资料来源';sources.forEach(x=>b.append(x));}
 if(mainIds.includes(s.id)&&pending.length){b.insertAdjacentHTML('beforeend',`<details class="v49-detail" id="v52-${s.id}-pending"><summary>本段尚未确认的事项</summary><div class="v49-detail-body"><ul>${pending.map(t=>'<li>'+t+'</li>').join('')}</ul></div></details>`);}
 // Update textual cross references without modifying SVG data or figure markers.
 const walk=doc.createTreeWalker(b,dom.window.NodeFilter.SHOW_TEXT);let n;while(n=walk.nextNode())n.nodeValue=ref(n.nodeValue);
 s.html=b.innerHTML;s.title=ref(s.title);dom.window.close();
}
const sections=v.v34.sections;
const byId=id=>sections.find(s=>s.id===id);
const branch=byId('v39-s3');branch.title='第五段｜分支：豆包正在说话时被打断（步骤 4）';
sections.splice(sections.indexOf(branch),1);sections.splice(sections.indexOf(byId('v39-s5'))+1,0,branch);
// Name each merged disclosure after the concrete information it contains.
const summaryNames={
'先收清楚声音，再记下从哪个座位传来':'查实车收音问题、云端识别选型与车型链路演进',
'识别开始前，把容易写错的名字交给它':'查 7 类热词来源与上限、配置生效、历史正确率和错词',
'主驾还在说，文字就开始出来，但还会改':'查首末字耗时、整句正确率与识别和切句坏例',
'长停顿收尾后，先拿整句话，再核对准备结果':'查准备结果复用规则、两遍识别成绩与耗时口径',
'要等得合适，也要让提前计算真正省到时间':'查预请求命中率、切句坏例、语义判停与 pre-VAD 方案',
'云端先确定：整句话该不该接':'查最终拒识模型、误判案例、训练与历次评测',
'有些明确场景，由规则直接决定接话':'查单人放行、人数误判与唤醒首句规则',
'车上尝试办事：先看固定说法，再看本地理解':'查固定说法清单、模型顺序、速度与谨慎执行要求',
'两边都算出了结果，仍要决定采用哪一路':'查端云采纳版本、超时 reject 冲突与云端车控快路',
'先把能找到的背景交给 DT，再判断还缺什么':'查四类背景、四层记忆、保留时间与图中历史名称',
'地点缺失时查记忆，查到后才搜附近餐厅':'查提前带入与主动查询的区别、耗时和记忆检索坏例',
'背景能否使用，还要看说话人和当前请求':'查已办事项丢失案例与输入管理方案',
'采用结果后回写，下一句才接得上':'查本地回写字段、同步失败补报与上下文对齐问题',
'车里人之间的话，可以补背景，但接入状态要分清':'查人人对话记录者、补报条件、项目范围与接入进展',
'每来一版过程文字，模型用当时的信息判断':'查短句和人数线索、测试标注标准与停播后拒识比例',
'停播以后，为什么还不能打开座椅加热':'查流式状态名、接口资料权限与尚缺依据',
'把停播、翻成车控指令、整句接话分清':'查三类模型的名称、部署、版本关系与训练演进',
'排查插话问题，先看停错了还是停慢了':'查打断时延、误停案例、识别来源与本地历史范围'
};
for(const section of sections)for(const [heading,title]of Object.entries(summaryNames))section.html=section.html.replace(heading+'：查配置、评测与历史依据',title);
// Opening overview: table order follows the reading order, not the original node numbering.
let dom=new JSDOM(byId('v39-map').html),doc=dom.window.document;
let tbody=doc.querySelector('tbody'),rows=[...tbody.children];[rows[0],rows[2],rows[3],rows[4],rows[1]].forEach((row,i)=>{row.firstElementChild.textContent=['一、把声音变成字','二、判断说完 + 提前准备','三、判断是否接话，保留本地与云端结果','四、带上背景交给 DT，仲裁，回写','五、分支：豆包说话时被打断'][i];tbody.append(row);});
byId('v39-map').html=doc.body.innerHTML.replace('正常找餐厅先沿主线读；第五段的插话流程只在豆包正在播报等条件满足时发生。','前四段连续走完找餐厅的主线；第五段再讲豆包正在播报时才会发生的插话分支。');dom.window.close();
v.v34.intro=v.v34.intro.replace('中间遇到豆包正在播报或网络不可用的情况，就沿对应分支继续。','前四段连续走完找餐厅的主线，再用第五段说明豆包正在播报时怎样接住插话。');
byId('v39-s3').html=byId('v39-s3').html.replace('第三段会接着讲','第三段已讲过').replace('第三段会讲本地怎样交出候选，第四段再讲怎样决定采用哪一路。','第三段已讲本地怎样交出候选，第四段已讲怎样决定采用哪一路。');
byId('v39-s5').html=byId('v39-s5').html.replace('交给下一章：DT 拿到请求和背景后，怎样决定下一步动作；工具结果回来后，怎样继续判断。','到这里，找餐厅主线已经交出真实结果及后续对话需要的记录；保留了列表，还不等于用户已经选中某一家或启动导航。下一段转入播报中的插话分支，看新开口怎样接回这条链路。');
// Retell the main case to completion before mentioning a new request during speech.
dom=new JSDOM(byId('v39-retell').html);doc=dom.window.document;const retell=doc.querySelector('.v34-retell');const bp=[...retell.children].find(x=>x.textContent.startsWith('如果豆包正在介绍餐厅'));retell.append(bp);byId('v39-retell').html=doc.body.innerHTML;dom.window.close();
function plain(h){const d=new JSDOM(h);const t=d.window.document.body.textContent;d.window.close();return t;}
v.sections=v.v34.sections.map(s=>({id:s.id,title:s.title,paragraphs:[plain(s.html)],sourceIds:[]}));v.teaching.intro=[plain(v.v34.intro)];v.teaching.lessons=v.sections;v.teaching.closing=[];
let app=scriptBodies.find(m=>m[2].includes('function renderModule'))[2].replaceAll("revision: 'v50'","revision: 'v52'").replaceAll('我的修订-v50.html','我的修订-v52.html');
let html=base.replace(/<script([^>]*)>([\s\S]*?)<\/script>/g,(all,attrs,body)=>{if(attrs.includes('id="learning-doc-data"'))body=JSON.stringify({revision:'v52',pages:{}});else if(/^\s*const DATA\s*=/.test(body))body='\nconst DATA='+JSON.stringify(data).replaceAll('</','<\\/')+';\n';else if(body.includes('function renderModule'))body=app;else return all;return '<script'+attrs+'>'+body+'</script>';}).replace('<title>豆包汽车业务学习站 v50</title>','<title>豆包汽车业务学习站 v52</title>');
const output=basePath.replace('v50.html','v52.html');fs.writeFileSync(output,html);fs.writeFileSync(path.join(D,'baseline-data.json'),JSON.stringify(original));fs.writeFileSync(path.join(D,'candidate-data.json'),JSON.stringify(data));fs.writeFileSync(path.join(D,'preservation-ledger.json'),JSON.stringify(ledger,null,2));fs.writeFileSync(path.join(D,'baseline-integrity.json'),JSON.stringify({path:basePath,output}));console.log(output);
