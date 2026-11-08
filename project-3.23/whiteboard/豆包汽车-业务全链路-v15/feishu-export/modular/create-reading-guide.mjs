import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const dir=path.dirname(fileURLToPath(import.meta.url));
const graph=JSON.parse(fs.readFileSync(path.resolve(dir,'../../graph-v15.json'),'utf8'));
const esc=s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const para=s=>`<p>${esc(s)}</p>`;
const sourceById=new Map(graph.sources.map(s=>[s.id,s]));
const nodeById=new Map(graph.modules.flatMap(m=>m.nodes).map(n=>[n.id,n]));
const order=['V','R','M','C','D','E','O','I','W','F','K','T','G','L','S','P','A','H','B','U'];
const short={V:'声音成为正式请求',R:'有效入口与端云采信',M:'输入管理',C:'上下文准备',D:'Director 理解与规划',E:'工具执行与反馈',O:'播报、展示和真实结果',I:'多人插话、打断与恢复',W:'可见即可说',F:'工具准入与单 Agent 协议',K:'身份与记忆',T:'任务生命周期',G:'云端触发器',L:'端侧触发与本地闭环',S:'主动服务与 Advisor',P:'场景配置平台',A:'视觉感知',H:'静默展示与 PHUD',B:'信号与状态',U:'任务中心与卡片'};
const bridge={
V:['进入：用户说话；权限、车型交互状态、音区与音频先得到确认。','交出：最终采用的识别文字及说话归属，后续再经过有效性、路由与输入管理。过程文字只用于允许的准备。'],
R:['进入：识别文字与激活状态，需要判断是否应响应，以及由本地还是云端承接。','交出：被采纳的一路结果。云端请求进入输入管理；本地直接完成的请求也要回填历史，避免下一句丢上文。'],
M:['进入：用户请求、Advisor 建议、工具结果等不同输入。','交出：这一轮允许处理的输入与上下文准备请求。工具反馈通常经过这里回 Director，不能画成工具一成功就直接结束全部业务。'],
C:['进入：当前有效输入，同时准备车况、身份记忆、感知与目标等背景。','交出：Director 当前可用的背景。多路背景可以并行准备；资料不足时 Director 还可以显式调用工具查证。'],
D:['进入：当前输入、已有上下文、当前工具能力和历史结果。','交出：是否说话、说什么、调哪些动作，或者澄清、等待与结束。Planner 与 Director 是同一职能，不能画成两个串行大脑。'],
E:['进入：Director 的 action_list，先做能力、参数、权限和运行条件检查。','交出：逐项真实结果。普通反馈回输入管理，再由 Director 判断；配置允许 direct_return 的工具按对应合同直接返回。'],
O:['进入：可以对用户说的内容、应展示的内容，以及真实业务执行结果。','交出：用户实际听到、看到和设备实际完成。文字已生成、音频已生成、已起播、真实执行是不同验收点。'],
I:['贯穿声音、输入管理、规划与播放，不是每次请求必须额外串行经过的一站。','停声音、停推理、取消任务、撤销已下发动作分别处理；已经下发的工具仍要接收真实回执。'],
W:['进入：当前页面已注册的按钮或可说词，以及用户识别文字。','交出：业务方执行页面动作后的结果与历史。它不等于视觉模型读屏，不能把语音匹配成功当点击成功。'],
F:['这是工具执行模块内部的细化，不是第二个 Planner。','定义工具能做什么、何时可运行、怎样返回；普通反馈、直接返回和回退按具体渠道及版本区分。'],
K:['为上下文、工具检索与个性化回答提供身份和记忆依据。','先确认能使用谁的数据，再生成、过滤、检索、更新或删除；保存成功不代表本轮立刻可检索。'],
T:['进入：需要稍后、条件满足后或持续完成的用户目标。','先完成任务创建与注册，再等条件触发；触发后重新规划、执行并回写状态。创建成功不等于用户目标完成。'],
G:['进入：任务、Advisor、预设和显示等业务注册的条件。','交出：条件命中和策略允许后的动作出口。触发器负责判断何时继续，不代替 Director 规划或下游真实执行。'],
L:['进入：车端已部署的本地预设与当前本地信号。','交出：本地提示、卡片、确认后车控及状态回读；具体任务开发与后续统一配置方案分开看。'],
S:['进入：预设事件、动态事件或子目标 review，不是只靠用户主动开口。','顾问先判断是否值得帮助，再按策略去 Director 或 AI Bar；建议产生、建议消费和用户触达分别记录。'],
P:['产品先配置范围、条件判断、策略与动作，再发布和注册。','配置保存、结构校验、授权、生效和实车结果是不同环节。平台配置成功不代表端云或所有车型已经支持。'],
A:['默认观察、任务专属观察、主动问图是三条入口。','视觉结果交给对应的 Context、任务或展示消费者；看见、目标达成、建议产生和真实执行分开验收。'],
H:['进入：感知或车况对应的有效内容与展示策略。','文字与 PHUD 动效是两条并行输出；发送接受、消息下行与用户真正曝光分开记录。Mock 不证明真实视觉能力。'],
B:['持续提供车辆、位置、App、人员及感知等事实，不是每句话才启动。','消费时保留来源、对象和时间；缺失、过期、未知不能擅自当成确定事实。'],
U:['进入：任务创建、更新、暂停、取消和执行结果。','任务中心、即时卡与任务岛按类型分流；界面变化需要与服务状态、触发注册和真实执行对齐。']
};

const sections=order.map((id,i)=>{
 const m=graph.modules.find(m=>m.id===id), num=String(i+1).padStart(2,'0');
 const heading=`${num}｜${short[id]}`;
 let html=`<h1>${esc(heading)}</h1>${para(m.title)}${para(m.subtitle)}`;
 html+=`<p><strong>这一模块在全链路中的位置</strong></p>${bridge[id].map(para).join('')}`;
 html+=para(`【模块图 ${num} ${id}】`);
 html+='<h2>按图逐步读懂</h2>';
 for(const n of m.nodes){html+=`<p><strong>${esc(n.id+' · '+n.title)}</strong></p><p>${n.lines.map(esc).join('；')}。</p>${para(n.detail)}`;}
 html+='<h2>上下游交接</h2>';
 const cross=graph.edges.filter(e=>nodeById.has(e.from)&&nodeById.has(e.to)&&nodeById.get(e.from).moduleId!==nodeById.get(e.to).moduleId&&(nodeById.get(e.from).moduleId===id||nodeById.get(e.to).moduleId===id));
 for(const e of cross){const a=nodeById.get(e.from),b=nodeById.get(e.to);html+=para(`${a.id}「${a.title}」 → ${b.id}「${b.title}」：${e.label||'按图交接'}`);}
 if(!cross.length)html+=para('上下游按上方模块定位与图内交接标签阅读。');
 html+='<h2>产品经理要问清什么</h2>';
 for(const q of m.questions||[]){html+=`<p><strong>${esc(q.q)}</strong><br/>为什么要问：${esc(q.why)}<br/>怎样证明已掌握：${esc(q.pass)}</p>`;}
 html+='<h2>验收指标和统计口径</h2>';
 for(const x of m.metrics||[]){html+=`<p><strong>${esc(x.name)}</strong><br/>统计口径：${esc(x.definition)}<br/>状态：${esc(x.status)}</p>`;}
 html+='<h2>原文入口</h2>';
 for(const sid of m.sourceIds||[]){const s=sourceById.get(sid);if(s)html+=`<p><a href="${esc(s.url)}">${esc(s.title)}</a>：${esc(s.note||'')}</p>`;}
 return {id,num,heading,marker:`【模块图 ${num} ${id}】`,nodeCount:m.nodes.length,html:html+'<p></p>'};
});
const categories=[...new Set(graph.tools.map(t=>t.category))];
const fields=[['input','输入是什么'],['mechanism','内部怎么做'],['output','交出什么'],['exception','失败与边界'],['status','版本与可用状态'],['next','下一步交给谁']];
const toolSections=categories.map((category,i)=>{
 let html=`<h2>工具 ${String(i+1).padStart(2,'0')}｜${esc(category)}</h2>`;
 const entries=graph.tools.filter(t=>t.category===category);
 for(const t of entries){html+=`<h3>${esc(t.label+' · '+t.name)}</h3>${para(`原表第 ${t.row} 行；${t.id}`)}`;for(const [k,label]of fields)if(t[k])html+=`<p><strong>${label}：</strong>${esc(t[k])}</p>`;if(t.states)html+=para('状态变化：'+t.states.join(' → '));const ids=t.sourceIds||[t.sourceId];html+=`<p>原文：${ids.filter(Boolean).map(id=>sourceById.get(id)).filter(Boolean).map(s=>`<a href="${esc(s.url)}">${esc(s.title)}</a>`).join('；')}</p>`;}
 return {category,count:entries.length,html:html+'<p></p>'};
});
let supplemental='<h2>补充定义｜不与工具表行数相加</h2>';
for(const t of graph.supplementalDefinitions){supplemental+=`<h3>${esc(t.label+' · '+(t.name||t.id))}</h3>`;for(const[k,label]of fields)if(t[k])supplemental+=`<p><strong>${label}：</strong>${esc(t[k])}</p>`;const s=sourceById.get(t.sourceId);if(s)supplemental+=`<p><a href="${esc(s.url)}">${esc(s.title)}</a></p>`;}
const reading='<h2>先把一条请求走通</h2>'+para('主链路：V 声音成为正式请求 → R 有效性与端云采信 → M 输入管理 → C 上下文 → D Director → E 工具执行 → O 用户输出与真实结果。')+para('普通工具结果要经过 E → M → D 的回路；查记忆后再导航、多动作部分失败、条件触发后再执行，都要让 Director 读到事实后继续决定。具体工具允许直接返回时，按项目合同走 direct_return。')+para('本地直接完成、可见即可说、主动服务、任务/触发与视觉是不同入口或支路，不要强迫每一次请求把 20 个模块串行跑一遍。')+para('掌握程度：先能拿一个真实请求说清谁拿到什么、每步判断什么、交给谁，再能解释失败分支和验证证据。不要求先学会所有模型训练细节；需要能区分输入缺失、路由错误、工具限制、模型判断错误和真实执行失败。')+para('下面的流程和原文边界来自保留的 v15 资料版本。指标包含建议口径、需求目标与待核项，不代表已达到或所有车型已上线。');
fs.writeFileSync(path.join(dir,'guide-clipboard.json'),JSON.stringify({documentUrl:'https://bytedance.larkoffice.com/docx/DfiydEuaQoKDERx4PLEc9AA7nDf',reading,sections,toolsIntro:`<h1>21｜工具明细，按业务类别查</h1>${para(graph.toolCountExplanation)}${graph.criticalUnknowns.map(para).join('')}<p></p>`,toolSections,supplemental:supplemental+'<p></p>',appendix:'<h1>附录｜保留的 v15 完整原图</h1><p>以下两张是上半、下半完整图。日常阅读请使用上面的主链路和模块章节；需要核对原版排布与全部连线时，再打开原图。</p><p></p>'},null,2));

const W=1600,H=1880,cells=[],svg=[],panels=[];let seq=0;
svg.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#4673AA"/></marker></defs><rect width="1600" height="1880" fill="#F8FAFD"/>`);
const rect=(x,y,w,h,fill,stroke='#BDD0E6')=>{panels.push({id:`panel${panels.length+1}`,x,y,w,h});svg.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`);cells.push(`<mxCell id="o${++seq}" parent="1" vertex="1" style="rounded=1;arcSize=12;fillColor=${fill};strokeColor=${stroke};strokeWidth=2;"><mxGeometry x="${x}" y="${y}" width="${w}" height="${h}" as="geometry"/></mxCell>`);};
const text=(x,y,s,size=28,bold=false,color='#203A57')=>{svg.push(`<text x="${x}" y="${y}" font-size="${size}" font-weight="${bold?700:400}" fill="${color}">${esc(s)}</text>`);cells.push(`<mxCell id="o${++seq}" parent="1" vertex="1" value="${esc(s)}" style="text;align=left;verticalAlign=top;whiteSpace=nowrap;overflow=visible;spacing=0;fontSize=${size};fontStyle=${bold?1:0};fontColor=${color};fillColor=none;strokeColor=none;"><mxGeometry x="${x}" y="${y-size}" width="${Math.max(60,Array.from(s).length*size)}" height="${size*1.3}" as="geometry"/></mxCell>`);};
const edge=(points,color='#4673AA',dash=false)=>{svg.push(`<polyline points="${points.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${color}" stroke-width="3"${dash?' stroke-dasharray="8 6"':''} marker-end="url(#arrow)"/>`);cells.push(`<mxCell id="o${++seq}" parent="1" edge="1" style="edgeStyle=none;rounded=0;startArrow=none;endArrow=classic;endFill=1;strokeWidth=3;strokeColor=${color};dashed=${dash?1:0};"><mxGeometry relative="1" as="geometry"><mxPoint x="${points[0][0]}" y="${points[0][1]}" as="sourcePoint"/><mxPoint x="${points.at(-1)[0]}" y="${points.at(-1)[1]}" as="targetPoint"/>${points.length>2?'<Array as="points">'+points.slice(1,-1).map(p=>`<mxPoint x="${p[0]}" y="${p[1]}"/>`).join('')+'</Array>':''}</mxGeometry></mxCell>`);};
text(90,80,'一条语音请求，怎样走到真实结果',44,true);
const stages=[
['01 · V 声音成为正式请求','先有权限、音区与干净音频；识别和判停并行。','过程文字只做准备；最终文字进入后续入口判断。'],
['02 · R 有效性与端云采信','判断是否对助手说话，以及采用本地还是云端结果。','同一输入只允许一次真实执行；本地结果也要同步。'],
['03 · M 输入管理','接收用户请求、建议与工具反馈，管理排队和打断。','决定本轮处理哪些输入，不代替模型理解用户目标。'],
['04 · C 上下文准备','并行准备车况、身份记忆、视觉和目标等背景。','背景缺失时，Director 仍可显式调用工具查证。'],
['05 · D Director 理解与规划','Planner 与 Director 是同一职能。结合事实判断。','输出是否说话、说什么、调哪些动作或先澄清。'],
['06 · E 工具执行与反馈','先验能力、参数与权限，再由下游落实具体动作。','逐项返回真实结果，受理成功不等于业务完成。'],
['07 · O 用户输出与真实结果','分别核验卡片、语音实际播放与车辆/服务结果。','部分成功要如实说明，不能只凭模型话术报成功。']
];
for(let i=0;i<stages.length;i++){const y=150+i*230;rect(100,y,980,175,i===5?'#EEF8F4':'#F0F5FC');text(128,y+48,stages[i][0],34,true);text(128,y+96,stages[i][1],27);text(128,y+139,stages[i][2],27);if(i<6)edge([[590,y+175],[590,y+230]]);}
text(620,1280,'有动作需要执行，才调用工具',22);
text(620,1510,'真实结果；直返按工具合同',22);
edge([[1080,1157],[1110,1157],[1110,1675],[1080,1675]],'#8265A8');
text(1135,1745,'D 也可直接回答或先澄清',24,true,'#705191');
edge([[1080,1387],[1145,1387],[1145,697],[1080,697]],'#B17826');
text(1170,495,'普通工具反馈',27,true,'#8F611D');text(1170,537,'E → M → D',28,true,'#8F611D');text(1170,578,'读结果后再决定',25,false,'#8F611D');
edge([[100,467],[45,467],[45,1640],[100,1640]],'#2C8B78');
rect(1190,160,360,265,'#EFF8F4','#B7DCCE');
text(1214,205,'本地直接完成支路',27,true);text(1214,252,'按当前车型与版本采信',24);text(1214,294,'完成后仍需回填历史',24);text(1214,336,'不让端云各执行一次',24);text(1214,378,'对应模块：R、L、O',24);
rect(1190,740,360,265,'#F4F0FA','#D5C7E8');
text(1214,786,'任务与主动服务支路',27,true);text(1214,834,'安排任务或先注册条件',24);text(1214,876,'命中后再进入规划执行',24);text(1214,918,'创建、触发、完成分开',24);text(1214,960,'对应：T、G、S、U',24);
rect(1190,1080,360,245,'#FFF7E9','#E6D2A5');
text(1214,1127,'背景持续供给',27,true);text(1214,1173,'身份记忆、信号和视觉',24);text(1214,1215,'不是每轮全部重跑一遍',24);text(1214,1257,'对应：K、B、A、C',24);
rect(1190,1410,360,255,'#FCEFF0','#E7BDC5');
text(1214,1456,'插话与恢复贯穿全程',26,true);text(1214,1504,'分清停声、停推理和取消',23);text(1214,1546,'已下发的动作仍要接回执',23);text(1214,1588,'对应：I、M、E、O',24);
svg.push('</svg>');
const svgText=svg.join('');fs.writeFileSync(path.join(dir,'00-主链路.svg'),svgText);
const grouped=cells.map(c=>{if(!c.includes('vertex="1"'))return c;const a=c.match(/<mxGeometry x="([\d.]+)" y="([\d.]+)"/);if(!a)return c;const x=+a[1],y=+a[2],p=panels.find(p=>x>=p.x&&x<p.x+p.w&&y>=p.y&&y<p.y+p.h);return p?c.replace('parent="1"',`parent="${p.id}"`).replace(a[0],`<mxGeometry x="${x-p.x}" y="${y-p.y}"`):c;});
const groups=panels.map(p=>`<mxCell id="${p.id}" parent="1" vertex="1" connectable="0" style="group;connectable=0;recursiveResize=0;collapsible=0;fillColor=none;strokeColor=none;"><mxGeometry x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" as="geometry"/></mxCell>`).join('');
const model=`<mxGraphModel grid="0" page="0" background="#F8FAFD" pageWidth="${W}" pageHeight="${H}"><root><mxCell id="0"/><mxCell id="1" parent="0"/>${groups}${grouped.join('')}</root></mxGraphModel>`;
const drawio=`<mxfile host="app.diagrams.net"><diagram id="v15-reading-overview" name="语音请求到真实结果">${zlib.deflateRawSync(Buffer.from(encodeURIComponent(model))).toString('base64')}</diagram></mxfile>`;
fs.writeFileSync(path.join(dir,'00-主链路.drawio'),drawio);
fs.writeFileSync(path.join(dir,'overview-validation.json'),JSON.stringify({editableCells:cells.length,noEmbeddedImages:!/<image|shape=image|data:image/i.test(drawio),stageOrder:order.slice(0,7),sourceGraphSha256:crypto.createHash('sha256').update(fs.readFileSync(path.resolve(dir,'../../graph-v15.json'))).digest('hex'),feishuImportVerified:false},null,2));
console.log(JSON.stringify({sections:sections.length,nodes:sections.reduce((n,s)=>n+s.nodeCount,0),toolCategories:toolSections.length,toolRows:graph.tools.length,supplemental:graph.supplementalDefinitions.length,clipboardChars:JSON.stringify(sections).length,overviewEditableCells:cells.length}));
