import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{JSDOM}=require('/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/jsdom');
export function round2(v,ledger){
 const titles={
 'v39-s1':['噪声和音区错误怎样让后续办错事？','回声消除没做好会怎样？','主驾说话，为什么可能要操作副驾？','没反应时，怎样先排查声音输入？','热词从来源到本次识别经过哪里？','名字登记了，为什么仍要看识别结果？','过程文字怎样补长、纠错和更新页面？','补上“附近的餐厅”怎样改变请求？'],
 'v39-s3':['为什么不能逢人声就停止播报？','一次插话的文字会怎样逐次更新？','识别到“帮我把副驾”时可能怎样判断？','缺少乘员聊天历史会误判什么？','怎样沿时间图定位停播时刻？','停播后，整句话还要过哪些判断？','相同模型名称为什么不能代表相同职责？','副驾座椅加热怎样翻成函数和参数？'],
 'v39-s2':['停顿时提前收尾或一直等待，各有什么代价？','停满600毫秒，为什么意思还可能没说完整？','补话前后的两次准备怎样对应请求？','为什么预请求不能提前开始导航？','第二遍识别为什么不需要用户重说？','两次准备中哪一次可以用于正式请求？','预请求什么时候省不到计算和等待？','“打开／那个／设置”被切开会怎样？'],
 'v39-s4':['本地为何不必等云端定稿才开始？','固定说法与本地模型怎样处理不同车控？','“暂停播放”“就选它了”为何不适合固定说法？','哪些请求超出本地能力，需要交云端？','分错处理链路与填错座位怎样区分？'],
 'v39-s5':['用当前位置搜索为什么可能找错餐厅？','除了用户这句话，Planner还收到哪些背景？','记忆有哪些提前带入与主动查询的交接？','从搜索动作到用户看到列表还差哪几步？','返回顺序与展示顺序不一致会怎样？','仲裁图里的网络和等待条件怎样读？','餐厅列表与空调设置分别回写什么？','查记忆到下一轮指代，完整交接怎样复述？']
 };
 const addAfter={
 '排查插话问题，先看停错了还是停慢了':'乘客聊天让豆包停下，是误打断；主驾提问后豆包还在讲，是停播延迟，两类问题要分开查。比较效果时固定项目、模型版本和测试数据，同时观察两项指标。',
 '有些明确场景，由规则直接决定接话':'唤醒后首句在 5 秒内开口，直接召回；打开“全部位置免唤醒”时，其他座位不享受这条首句规则。单人不拒识规则生效时，会按车上的单人标记把结果改为召回；例如多人被错判为单人，也会接到不该接的话，因此要区分模型判错和人数判错。',
 '背景能否使用，还要看说话人和当前请求':'记忆按人隔离：记录带着当时在场的人，检索按当前车内人员筛选，避免把 A 的经历说给 B。被判为没对豆包说的话，不进入普通对话历史。'
 };
 for(const s of v.v34.sections){
  if(!titles[s.id])continue;
  const dom=new JSDOM(s.html),d=dom.window.document,b=d.body;
  // One archive per subsection: preserve replaced wording without scattering more generic folds.
  const archives=new Map();
  function preserve(el){
   let h=el.previousElementSibling;while(h&&!/^H[34]$/.test(h.tagName))h=h.previousElementSibling;
   const key=h?.textContent||'开场';
   let a=archives.get(key);
   if(!a){a=d.createElement('details');a.className='v49-detail';a.id=`v51-r2-${s.id}-${archives.size+1}`;a.innerHTML=`<summary>${key}：原讲解与复述对照</summary><div class="v49-detail-body"></div>`;archives.set(key,a);}
   a.lastElementChild.insertAdjacentHTML('beforeend',el.outerHTML);
   ledger.push({section:s.id,original:el.outerHTML,target:a.id});
  }
  function replace(prefix,text){const el=[...b.querySelectorAll('p,div.v39-hand')].find(x=>!x.closest('details,section')&&x.textContent.startsWith(prefix));if(!el)throw Error('missing '+prefix);preserve(el);if(text)el.textContent=text;else el.remove();}
  for(const det of b.querySelectorAll('details')){
   if(det.querySelector('summary')?.textContent==='展开看解释与例子'){
    const index=Number(det.id.match(/explain-(\d+)$/)[1])-1;const title=titles[s.id][index];if(!title)throw Error(det.id);det.querySelector('summary').textContent=title;
   }
  }
  for(const h of b.querySelectorAll('h3,h4'))if(addAfter[h.textContent]){const p=d.createElement('p');p.textContent=addAfter[h.textContent];h.after(p);}
  if(s.id==='v39-s1'){
   replace('云端收到声音','云端收到声音，仍可能把“副驾”写成“负价”、把“除雾”写成“储物”。因此，座舱云服务会在本次识别开始前送入热词表，收录需要重点考虑的名字和专用词。');
   replace('麦克风收音后','麦克风收音后，声学前端先压低噪声，并参考车机播放内容消除回声。例如回声没减干净，豆包会把自己的回答又听成一条用户请求。');
   replace('音区标明','音区标明主驾、副驾或后排在说话，供确定回复对象和使用记忆。主驾说“打开副驾座椅加热”，说话位置仍是主驾，操作位置则是副驾；人数还要结合人脸、座椅压力判断，不能只数音区。');
   replace('表里的词来自','热词来自联系人、导航地点、正在播放的内容、页面按钮、车控词、最近对话和车辆当前位置。页面换了就更新按钮名；各类词量要受限，带得太多会拖慢识别。');
   replace('如果希望把某个固定错词','固定错词直接改成指定词，属于替换词规则，要单独验收。“智驾”配了热词仍被写成“支架”，就不能靠“已经配过”判断问题解决。');
   replace('过程文字让其他模块','过程文字可交给停播判断；用户暂时停顿时，也可用于提前准备。与此同时，判停模块继续观察声音，和识别并行工作。');
   replace('现在交出的是','接下来分两条看：豆包正在播报时，进入插话判断；用户出现停顿时，进入判停与准备。');
  }
  if(s.id==='v39-s3'){
   replace('豆包介绍餐厅时','主驾在豆包介绍餐厅时插话：“帮我把副驾座椅加热打开。”副驾也在车里，这句话没有先叫“豆包”，需要走多人插话分支。');
   replace('这一段结束时：',null);
   // Read the diagram for the two-word trigger, leaving the full mechanism to adjacent prose.
   const how=b.querySelector('.v34-howto');if(how){preserve(how);how.innerHTML='<div class="v34-howto-h">怎么看这张图</div><p>图中“帮我”只有两个字，还没达到“超过两个字”的门槛。沿时间线找到触发判断的那版文字，再对照车上收到停播通知的时刻。</p>';}
  }
  if(s.id==='v39-s2'){
   replace('主驾说到“游泳馆”后','主驾先说“带我去昨天那家游泳馆”，约 400 毫秒后补上“附近的餐厅”。要找的是餐厅，游泳馆只是位置参照。');
   replace('300 毫秒触发准备','例如主驾说“我想去……”后停得足够久，固定时长仍会收尾。之后才开口的补充会成为新一段话，而识别定稿还要另行完成。');
   replace('图中 300 毫秒先准备','沿图对比两次准备面对的文字：前一次只有“去游泳馆”，后一次多了“附近的餐厅”，目标已经改变。');
   replace('同一句话的准备结果','同一句话的多次准备会关联保存，正式提交时可以找到对应记录。');
   replace('这次主驾的话顺利收齐后','完整需求已经接住；下一段处理是否接话和本地能力，第五段再解决“昨天那家”在哪里。');
  }
  if(s.id==='v39-s4'){
   const adoption=b.querySelector('#v50-s4-adoption');const example=d.createElement('p');example.textContent='以未命中固定说法的“副驾座椅加热开两档”为例，本地虽给出了候选指令，仍要等下面的采纳条件成立。';adoption.after(example);
   replace('这时需要分清两个问题：',null);
   replace('第二段的流式拒识','如果第三段提前算出的判断符合复用条件，这里可以采用它，省去重复计算；没有适用的结果，就按定稿判断。');
   replace('本地用固定说法','本地有两种办法：“打开空调”可匹配已配置的固定说法；“副驾座椅加热开两档”可由本地模型解析。前者只读本句，后者还读有限历史；各项目可能先后执行，也可能并行。');
   replace('端侧车控模型输出','端侧车控模型应把“副驾座椅加热开两档”解析成座椅加热功能、副驾位置和两档参数。还要核对车型是否接入该功能，不能只看模型会不会写指令。');
   replace('即使用户请求的是','用户请求车辆没有的功能时，只要确实在找豆包，就应接住并说明不支持。');
   replace('交给下一步：','本例继续交给云端。下一步为 DT 补充背景，确定游泳馆的位置，再搜索附近餐厅。');
  }
  if(s.id==='v39-s5'){
   replace('沿图区分提前带入',null);
   const conversation=[...b.querySelectorAll('.v34-howto')].find(x=>x.textContent.startsWith('沿两条路线'));
   if(conversation){preserve(conversation);conversation.innerHTML='<div class="v34-howto-h">沿两条路线区分记录位置</div><p>图的上面一路由云端判断后记录，下面一路由车上暂存后补报，两路计划汇入事件流。</p>';}

   replace('先区分四种','四种“过去”各有用途：历史对话保留最近原话和工具返回；对话摘要压缩较早的对话；短期记忆归纳今天的经历；长期记忆保存跨天经历和偏好。例如找“昨天那家游泳馆”，主要需要跨天经历。');
   replace('换成“打开空调”','本地已经执行之后，晚到的云端结果不再执行，否则同一个动作可能做两遍。');
   const how=[...b.querySelectorAll('.v34-howto')].find(x=>x.textContent.startsWith('沿图看何时'));if(how){preserve(how);how.innerHTML='<div class="v34-howto-h">沿图看何时有结果可用</div><p>例如“打开空调”命中固定说法后，本地可先办；图中另一路仍可能在计算。跟着被采用的箭头走，核对最后实际下发的是哪条指令。</p>';}
   replace('回写记录用户说了什么','回写要记录实际执行结果，执行失败也要记录。例如本地调空调后，云端要知道刚才的设置和执行结果，才能接住“再低一点”；只记发出的指令会把没办成的事当成已完成。回写后还要另一步总结记忆。');
   replace('本例依次补地点',null);
  }
  // Append original wording to the matching subsection, without moving any diagram marker.
  for(const [key,a] of archives){
   const h=[...b.children].find(x=>/^H[34]$/.test(x.tagName)&&x.textContent===key);
   let next=h?.nextElementSibling;while(next&&!/^H[34]$/.test(next.tagName)&&!next.matches('section.v51-takeaway,details[id$="-pending"]'))next=next.nextElementSibling;
   if(!h){const first=[...b.children].find(x=>/^H[34]$/.test(x.tagName));if(first)first.before(a);else b.append(a);}else if(next)next.before(a);else b.append(a);
  }
  s.html=b.innerHTML;dom.window.close();
 }
}
