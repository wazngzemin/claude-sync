import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
// 复用已验证的缩放、拖动、连线追踪与笔记交互；页面主体只展示新流程图。
let source=fs.readFileSync(path.join(dir,'../豆包汽车-业务全链路-v12/build-html.mjs'),'utf8');
source=source.replaceAll('v12','v13').replace('w:13920,h:22502','w:D.width,h:D.height');
function change(a,b){if(!source.includes(a))throw Error('找不到模板片段 '+a.slice(0,70));source=source.replace(a,b);}
change("const svg=fs.readFileSync(path.join(dir,'业务全链路-v13.svg'),'utf8');","const voice=graph.groups.find(g=>g.id==='voice'); const svg=fs.readFileSync(path.join(dir,'业务全链路-v13.svg'),'utf8').replace(/viewBox=\"[^\"]+\"/,'viewBox=\"'+(voice.x+35)+' '+(voice.y+205)+' '+(voice.w-70)+' 1070\"');");
change("const storeKey='doubao-business-v13-notes'","const storeKey='doubao-business-v13-notes'");
change("if(n.kind==='learning')fit({x:n.x,y:n.y,w:n.w,h:1300});else fit(n,48)","if(n.kind==='learning')fit({x:n.x,y:n.y,w:n.w,h:1300});else fit(n,85)");
change("else fit(n,85)","else fit(n,85)");
change("新 Task 演进设计，不代表所有车型已上线。","旧 Goal / 新 Task 或长期规划分区：按车型和版本选择，不代表全部同时上线。");
change("粗线连接模块，模块内从上到下阅读。","全部在同一张图上。分区内沿箭头阅读；跨区编号在起终点成对出现。交叉但无节点的线，不表示连接。");
const sourceStart=source.indexOf('function showSources()'),sourceEnd=source.indexOf('function showTools()',sourceStart);
source=source.slice(0,sourceStart)+`function showSources(){openPanel();ins.innerHTML='<h2>这张图依据哪些资料</h2><p>三份主资料的正文及原生画板、补充技术方案和两份已完整读取的会议逐字稿共同用于重画。旧版工具、Task、VLM 和页面语音契约沿用已核对内容；没有运行证据的事项不标成上线事实。</p>'+D.sources.map(s=>'<div class="source"><a href="'+esc(s.url)+'" target="_blank" rel="noreferrer">'+esc(s.title)+'</a><p>'+esc(s.status)+'</p></div>').join('')+'<p>固定工具为本地 SP 中 27 项定义快照。动态工具候选、每轮注入、车型可调用数量及原子能力数，不能混成同一个数。具体模型、SDK、状态码和实测性能仍以目标版本为准。</p><button id="back">返回流程图</button>';$('#back').onclick=renderPanel}\n`+source.slice(sourceEnd);
// 选模块直接展示其连续四个框，而不是只弹一个孤立定义。
change("focusNode(n.id)});","focusNode(n.id,false);focusGroup(b.dataset.module)});");
change("$('#start').onclick=()=>{caseId='full';$('#caseSelect').value='full';stepIndex=0;focusNode('V1')}","$('#start').onclick=()=>{caseId='full';$('#caseSelect').value='full';stepIndex=0;focusNode('V1',false);focusGroup('voice')}");
change("fit({x:200,y:350,w:13520,h:1080},20);toast('总览只看模块关系；点击一个模块，进入正常字号阅读。')","const gs=D.groups.filter(g=>D.main.includes(g.id));fit({x:gs[0].x,y:gs[0].y-60,w:gs.at(-1).x+gs.at(-1).w-gs[0].x,h:Math.max(...gs.map(g=>g.h))+120},20);toast('主链同一行由左到右。选上方模块名可看连续小框。')");
change("window.addEventListener('resize',()=>{const n=N.get(selected);if(n)fit(n,48)})","window.addEventListener('resize',()=>{const n=N.get(selected);if(n)fit(n,85)})");
change("requestAnimationFrame(()=>{const id=decodeURIComponent(location.hash.slice(1));focusNode(N.has(id)?id:'V1')});",`function focusGroup(id,whole=false){const g=G.get(id);if(!g)return;const ns=D.nodes.filter(n=>n.group===id);const rows=ns.slice(0,Math.min(4,ns.length));fit(whole?g:{x:g.x+35,y:g.y+205,w:g.w-70,h:Math.max(...rows.map(n=>n.y+n.h))-g.y-180},45);$('#groupSelect').value=id;}
$('#groupSelect').innerHTML='<option value="">定位完整业务分区…</option>'+D.groups.map(g=>'<option value="'+g.id+'">'+esc(g.title)+'</option>').join('');$('#groupSelect').onchange=e=>{const n=D.nodes.find(n=>n.group===e.target.value);if(n){focusNode(n.id,false);focusGroup(e.target.value)}};$('#fitGroup').onclick=()=>focusGroup(N.get(selected).group,true);$('#nearby').onclick=()=>focusGroup(N.get(selected).group);
document.body.classList.add('no-panel');$('#togglePanel').textContent='展开详细说明';
requestAnimationFrame(()=>{const id=decodeURIComponent(location.hash.slice(1));if(N.has(id))focusNode(id);else{focusNode('V1',false);focusGroup('voice')}});`);
change("window.flowState={data:D,focusNode,selectEdge,showTools,showLearning,showSources,","window.flowState={data:D,focusNode,focusGroup,selectEdge,showTools,showLearning,showSources,");
change("同一张完整流程图 · 从语音输入追到真实结果 · v13","30 个业务分区＋案例与自测 · 277 个细分框 · v13");
change('<button id="start">逐框阅读</button>','<button id="start">从语音开始</button><select id="groupSelect" aria-label="定位业务分区"></select>');
change('<body><header>','<body class="no-panel"><header>');
change('<button id="togglePanel" class="drawer-btn">收起说明</button>','<button id="togglePanel" class="drawer-btn">展开详细说明</button>');
change('<select id="groupSelect" aria-label="定位业务分区"></select>','<select id="groupSelect" aria-label="定位业务分区"><option value="">定位完整业务分区…</option>${graph.groups.map(g=>`<option value="${g.id}">${g.title}</option>`).join(\'\')}</select>');
change('<button id="tools">27 个工具</button>','<button id="tools">工具内部机制</button>');
change('<button id="fitCurrent">适配当前框</button>','<button id="fitCurrent">当前框</button><button id="nearby">相邻四框</button><button id="fitGroup">完整分区</button>');
change('点连线看起点终点 · 拖拽移动 · 滚轮缩放 · 双击框放大','拖拽整图 · 滚轮缩放 · 点线追上下游 · 双击小框放大');
change(".map{position:absolute;left:15px;bottom:15px;width:116px;height:185px", ".map{position:absolute;left:15px;bottom:15px;width:116px;height:165px");
change("$('.stage-nav').innerHTML=D.main.map((k,i)=>{const g=G.get(k);", "$('.stage-nav').innerHTML=D.main.map((k,i)=>{const g=G.get(k),names=['语音输入','拒识与分流','交互准入','真实上下文','Planner 决策','工具与反馈','真实执行','表达与回流'];g.navTitle=names[i];");
change("esc(g.title)+'</button>'","esc(g.navTitle||g.title)+'</button>'");
change("<title>豆包汽车业务全链路 v13 · 逐框阅读</title>","<title>豆包汽车业务全链路 v13 · 完整业务流程图</title>");
change("<h3>按模块展开完整问题与指标</h3>", "<h3>新增链路验收口径</h3>'+D.newMetrics.map(m=>'<section class=\"metric\"><strong>'+esc(m[0])+'</strong><p>'+esc(m[1])+'</p><p>'+esc(m[2])+'</p></section>').join('')+'<h3>按模块展开完整问题与指标</h3>");
const runfile=path.join(dir,'render-html-generated.mjs');fs.writeFileSync(runfile,source);await import(runfile);
