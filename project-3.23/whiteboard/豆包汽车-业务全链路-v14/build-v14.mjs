import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {modules as presentation,sources as psources} from './parts/presentation.mjs';
const root=path.dirname(fileURLToPath(import.meta.url));
const load=n=>JSON.parse(fs.readFileSync(path.join(root,'parts',n+'.json'),'utf8'));
const parts=['voice','director','async'].map(load), td=load('tools');
const modules=[...parts.flatMap(p=>p.modules),...presentation];
const sources=[...new Map([...parts.flatMap(p=>p.sources||[]),...psources,...td.sources].map(s=>[s.id,s])).values()];
sources.unshift(
 {id:'USER-LONGTERM',title:'豆包incar1.0-长期架构梳理（用户原始链接）',url:'https://bytedance.larkoffice.com/wiki/ZTAUwle0niQMWukBhzccHopRnff',note:'本次浏览器回看长期体验、从感知到认知到执行的两张架构画板及模块表。页面标记 2025-11-03 修改；包含未来体验与端云长期设想，不作为当前全量上线证明。'},
 {id:'USER-MAIN',title:'AI Car主链路架构（用户原始链接）',url:'https://bytedance.larkoffice.com/wiki/AZZdwsRmOiGWACkKwwHcqtOnnOe',note:'本次浏览器查看宏观、落地细化及更新架构画板。原图中的交互 Trigger 涵盖输入与交互门控，不能与条件触发器混为一个模块；反思、自我认知及 Reflector 属原图方向，需与当前建设状态分开。未声称逐字段核完全部子画板。'},
 {id:'USER-ROADMAP',title:'AI汽车2.6目标拆解（用户原始链接）',url:'https://bytedance.larkoffice.com/wiki/QiHywkYUeidVQwkhNDccCzPNndd',note:'本次浏览器核对 Roadmap 及语音、执行决策等目标行。旧表 soft/hard/语义 VAD 为 200/500/1000 ms 且有待讨论记录；不覆盖较新语音 OnePager 的 300/600 ms 口径。ACC、耗时和排期是目标，不是实测达成值。'}
);
// The old DT board remains evidence of the evolution, not the current Task implementation.
const dtflow=sources.find(s=>s.id==='ASY-DT-FLOW');
if(dtflow)dtflow.note='本次在浏览器打开原生画板，并放大查看 Director、goal_list_update、动态 Advisor、云端触发感知与 HMI 的连接。图仍保留动态 Advisor 旧职责、长程生态工具及有争议的视觉订阅模块；与 10 月 22 日宣讲及新 Task 方案对照，作为历史映射，不冒充当前上线架构。';
const ids=new Map(modules.map(m=>[m.id,m]));
// Context is assembled from parallel information supplies, not a mandatory serial query pipeline.
const cm=ids.get('C');
cm.edges=[...['C2','C3','C4','C5','C6','C7','C8','C9'].map(to=>({from:'C1',to,label:'按本轮需要选取'})),...['C2','C3','C4','C5','C6','C7','C8','C9'].map(from=>({from,to:'C10',label:'相关且实际可用'})),{from:'C10',to:'C11',label:'组装本轮背景'}];
cm.subtitle='背景信息按需汇入，不是逐个串行查一遍；显式记忆查询仍走工具与反馈闭环。';
cm.nodes.find(n=>n.id==='C10').lines=['检查相关、过期与缺失信息','这是产品验收责任','具体筛选算法按当前方案核对'];
// Remove misleading feedback shortcuts. Cross-module connectors below show the real return path.
ids.get('D').edges=ids.get('D').edges.filter(e=>!(e.from==='D11'&&e.to==='D12'));
ids.get('D').edges=ids.get('D').edges.map(e=>e.from==='D12'&&e.to==='D1'?{...e,to:'D3',label:'仍未完成：再判断缺什么'}:e);
ids.get('D').nodes.find(n=>n.id==='D9').lines=['无依赖且不冲突才同轮并行','先查地点再规划：分轮','同一导航状态操作按表串行'];
const em=ids.get('E');
em.nodes.find(n=>n.id==='E3').lines=['无依赖且不冲突才同轮并行','导航互斥操作按工具约束串行','下一步依赖结果则留待下一轮'];
em.nodes.find(n=>n.id==='E8').title='交回输入管理，等待下一窗口';
for(const n of em.nodes.filter(n=>['E9','E10','E11'].includes(n.id))){n.kind='reference';n.lines.unshift('此框指向同名职责，不是新引擎');n.lines=n.lines.slice(0,4);}
em.edges=em.edges.filter(e=>!['E8>E9','E9>E1','E9>E10','E9>E12','E10>E11','E11>E12'].includes(e.from+'>'+e.to));
const om=ids.get('O');
om.nodes.find(n=>n.id==='O07').kind='reference';
om.nodes.find(n=>n.id==='O07').title='结果话术引用同一反馈回路';
om.nodes.find(n=>n.id==='O07').lines=['E 收齐结果 → M 管理 → D 判断','此处不再等一次、不再推理一次','Director 新话术仍交同一个 TTS'];
om.nodes.find(n=>n.id==='O08').kind='reference';
om.nodes.find(n=>n.id==='O08').title='验收：用户真正看到了什么';
om.edges=om.edges.filter(e=>!['O02>O07','O06>O07','O07>O08','O08>O09','O04>O05','O05>O06'].includes(e.from+'>'+e.to));
om.edges.push({from:'O01',to:'O05',label:'并行呈现，不以音频为前提'},{from:'O04',to:'O06',label:'播放过程中监测新声音'},{from:'O04',to:'O09',label:'实际播放进度进入历史'});
om.nodes.push({id:'O10',title:'本轮不需要播报',lines:['仅跳过这一轮声音','D11 的动作列表仍独立处理','不能把不说话理解为不执行'],detail:'简单明确的控制请求可能不需要一个空洞的首轮应答。这个分支只跳过语音生成，工具仍由 Director 的动作列表独立下发。后面拿到真实结果后，是否再说一句、展示状态还是保持安静，由同一个 Director 按交互规则判断。它不是另一条工具等待回路，也不取消已经在执行的操作。',kind:'result',row:3,col:0});
om.nodes.push({id:'O11',title:'线下复盘：用真实案例改善链路',lines:['沿同一次请求还原失败位置','区分数据、规则、模型与执行','修改后用回归评测验证，不自动上线'],detail:'这是产品与研发的线下改进闭环，不是每次请求都会自动执行的新服务。收集一次真实失败的声音、输入、上下文、动作和反馈，先找断点：未听清、走错分流、缺背景、模型误判、工具失败或车端时序问题。再选择修改数据、策略、工具描述或示例，并跑正反例回归。不能把任意用户对话直接当作已完成训练的数据。',kind:'reference',row:3,col:1});
om.nodes.push({id:'O12',title:'长期方向：反思与自我认知',lines:['原宏观图保留 Reflector 等方向','长期人格与内心世界不等于现状','未验证能力不插入当前必经主链'],detail:'你给的宏观与更新架构图还包含反思、自我认知、内心 Agent、长期记忆与技能等方向，本图没有把它们悄悄当成不存在。但这些是不同阶段的架构目标，10 月 22 日宣讲也提到内心世界仍在建设。它们不应被画成当前每次语音请求都必经、已经全量可用的步骤；需要独立确认实现、触发方式、输出与验证结果。',kind:'reference',row:3,col:2});
om.sourceIds.push('USER-LONGTERM','USER-MAIN','USER-ROADMAP');
om.edges.push({from:'O09',to:'O11',label:'线下复盘依据，不表示自动训练',type:'reference'},{from:'O11',to:'O12',label:'区分当前改进与长期能力',type:'reference'});
om.edges.push({from:'O02',to:'O10',label:'不需要首轮声音'});
om.edges=om.edges.map(e=>e.from==='O07'?{...e,type:'reference'}:e);
for(const [mid,from,to,label] of [['T','T03','T05','无法承接：返回失败／澄清，不持久化'],['T','T07','T10','已取消／过期：丢弃旧回调，不执行'],['G','G02','G09','范围不符：不进入执行'],['L','L04','L03','未满足／未知：不发事件，等新信号'],['S','S04','S02','不值得建议：静默等相关变化'],['P','P07','P03','校验失败：修订，禁止发布'],['P','P02','P01','车型能力不满足：重新选择范围']])ids.get(mid).edges.push({from,to,label});
for(const [mid,nid] of [['L','L01'],['A','A01']])ids.get(mid).nodes.find(n=>n.id===nid).lines.push('无权限／不可用：不启动并留原因');
ids.get('T').edges=ids.get('T').edges.filter(e=>!(e.from==='T08'&&e.to==='T09'));
ids.get('T').nodes.find(n=>n.id==='T05').title='创建结果：成功持久化或明确失败';
ids.get('T').nodes.find(n=>n.id==='T05').lines=['成功：登记并回传任务结果','失败：不创建，给出明确原因','只有创建成功才进入等待'];
// These nodes point to the same global input/Director responsibilities, not duplicate engines.
for(const [mid,id] of [['I','I9'],['S','S07'],['E','E8']])ids.get(mid).nodes.find(n=>n.id===id).kind='reference';
const visionNext=ids.get('A').nodes.find(n=>n.id==='A11');
visionNext.kind='reference';visionNext.lines=['视觉反馈经输入管理回 Director','看不清时不能说已经确认','再确认或执行，走后续决策轮次'];
ids.get('A').edges=ids.get('A').edges.map(e=>e.to==='A11'?{...e,type:'reference',label:'此处解释返回后如何使用答案'}:e);
ids.get('A').edges=ids.get('A').edges.filter(e=>!(e.from==='A09'&&e.to==='A12'));
ids.get('I').edges=ids.get('I').edges.filter(e=>!['I7>I9','I8>I9','I8>I12'].includes(e.from+'>'+e.to));
// Four rows; the immediate-request path is a continuous snake across rows 1 and 2.
const grid=[['V','R','M','C'],['I','O','E','D'],['B','A','T','S'],['P','L','G','U']];
const MW=2140,MH=1900,GX=500,GY=400,PAD=140,TOP=300,NW=500,NH=300,SX=720,SY=410;
const W=PAD*2+MW*4+GX*3, toolY=TOP+(MH+GY)*4+100;
const color={ink:'#163352',blue:'#2463C5',line:'#627E9F',green:'#248171',gold:'#B07622',red:'#B85A59',muted:'#62758A'};
const esc=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const textWidth=(s,size)=>[...String(s)].reduce((w,c)=>w+(c.charCodeAt(0)>255?1:0.56)*size,0);
const wrap=(s,width,size)=>{let out=[],line='';for(const c of String(s)){if(c==='\n'||(textWidth(line+c,size)>width&&line)){out.push(line);line=c==='\n'?'':c;}else line+=c;}if(line)out.push(line);return out;};
function txt(x,y,lines,size=23,fill=color.ink,weight=400,anchor='start',lh=size*1.42){return `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${lines.map((l,i)=>`<tspan x="${x}" dy="${i?lh:0}">${esc(l)}</tspan>`).join('')}</text>`;}
const nodes=new Map();
for(let r=0;r<4;r++)for(let c=0;c<4;c++){
 const m=ids.get(grid[r][c]);if(!m)throw Error('missing '+grid[r][c]);
 Object.assign(m,{x:PAD+c*(MW+GX),y:TOP+r*(MH+GY),w:MW,h:MH,order:r*4+c});
 for(const n of m.nodes){Object.assign(n,{moduleId:m.id,x:m.x+100+n.col*SX,y:m.y+210+n.row*SY,w:NW,h:NH});if(nodes.has(n.id))throw Error('duplicate '+n.id);nodes.set(n.id,n);}
}
const mainIds=['V','R','M','C','D','E','O'];
const edges=[];for(const m of modules)for(const [i,e] of m.edges.entries())edges.push({...e,id:m.id+'-'+(i+1),moduleId:m.id,type:e.type||'internal'});
const semantic=edges.find(e=>e.from==='V7'&&e.to==='V10');if(semantic)semantic.type='reference';
const byTitle=(mid,search,fallback)=>ids.get(mid).nodes.find(n=>n.title.includes(search))?.id||fallback;
// Explicit hand-offs use actual nodes; no isolated module islands.
const cross=[];
const link=(from,to,label,type='handoff')=>cross.push({from,to,label,type,id:'X'+String(cross.length+1).padStart(2,'0')});
const voiceFinal='V12';
const routeIn=ids.get('R').nodes[0].id;
link(voiceFinal,routeIn,'最终识别文本，进入有效请求判定','main');
link('R8','M1','云端承接：用户原话与音区','main');
link('R12','C5','同步本地已执行动作与回复，不重做','feedback');
link('M9','C1','这一轮允许开始，准备相关背景','main');
link('C11','D1','有效输入与本轮上下文就绪','main');
link('D11','E1','action_list：本轮明确动作','main');
link('D11','O01','话术与表情：不等待动作才能生成','main');
link('E8','M1','tool_feedback：走输入管理再推理','feedback');
link('D1','D12','本轮输入若含反馈，先核对执行进度','feedback');
link('D12','O07','结果说明仍由同一个 Director 输出','reference');
link('E11','O08','同一验收职责，非已实现自动巡检','reference');
link('E9','D12','引用 Director 的反馈判断职责','reference');
link('E10','O07','引用统一播报，不另起一个播报器','reference');
link('D4','C12','显式记忆查询的说明入口，实际仍由 D11 下发','reference');
link('C12','E1','说明：user_memory_search 同样走动作与反馈','reference');
link('E4','T01','调用 task_agent：交办未来任务','trigger');
link('T04','G01','注册待观察的条件与触发要求','trigger');
link('G07','T07','条件满足：回调仍需检查任务有效性','trigger');
link('T08','M1','advice：请 Director 再决定如何做','trigger');
link('T05','E6','任务创建结果返回调用方，成功才等待','feedback');
link('E6','T09','按任务关联结果回写；具体回写协议需核','reference');
link('T12','U01','任务与生命周期展示','trigger');
link('U03','T11','用户管理操作返回原任务','trigger');
link('S06','M1','静态 Advisor 建议进入统一输入','trigger');
link('S07','D1','此处由同一个 Director 仲裁','reference');
link('S08','U01','AI 服务进入相应管理范围','trigger');
link('B06','C1','当前背景：按需取用，不必串行查遍','signal');
link('B07','G03','状态更新唤醒相关云端规则','signal');
link('B07','L03','本地规则消费对应端侧信号','signal');
link('B08','S02','相关情景变化唤醒预设 Advisor','signal');
link('B03','A01','视觉观察走资源与权限管理','signal');
link('A06','C4','完整视觉描述按需成为上下文','signal');
link('A09','G05','视觉语义判定交规则继续处理','trigger');
link('E4','A10','显式视觉问答：带问题看当前画面','handoff');
link('A10','E6','视觉问答结果返回原工具调用','feedback');
link('D12','A11','由同一 Director 使用视觉答案','reference');
link('A12','U04','静默展示是独立出口，按建设范围','trigger');
link('P08','G01','云端配置生效后才参与运行','trigger');
link('P08','L02','端云统一配置下发为后续项','planned');
link('G08','S02','需主动建议的场景交给 Advisor','trigger');
link('G08','U04','按配置选择展示／业务出口','trigger');
link('G08','A12','静默展示出口：规则通过后，按建设范围启用','planned');
link('L06','U06','原业务方注册并呈现卡片','trigger');
link('U07','L07','端侧业务确认回到所属场景','trigger');
link('L08','B09','真实车辆执行状态回流','feedback');
link('E6','B09','关联执行反馈和状态，具体通道按工具','reference');
link('O09','C5','后续轮次保留已发生的交互','feedback');
link('O11','C9','工具说明／示例修改后先回归评测，再按流程发布','reference');
link('O06',ids.get('I').nodes[0].id,'说话期间来了新声音','interrupt');
link('I7','M1','拒识后的恢复事件携带旧播报信息','interrupt');
link('I8','M1','有效新 query 携带已播未播与动作状态','interrupt');
link('D10','I9','同一个 Director 判断是否续接旧内容','reference');
link('I11','O03','需要续接：新话术交 TTS','interrupt');
link('I12','E1','明确取消任务：另发任务操作，不只是停播','handoff');
link('D7','I12','用户明确取消任务时的职责引用','reference');
// Endpoint local-control branch is kept independent of cloud Director.
link('R9','O08','本地控制也要验收真实结果','reference');
for(const e of cross){if(!nodes.has(e.from)||!nodes.has(e.to))throw Error('bad cross '+JSON.stringify(e));}
edges.push(...cross);

// Orthogonal visibility-grid routing. Lines never run through another node's rectangle.
function intersects(a,b,r,margin=14){let x1=Math.min(a[0],b[0]),x2=Math.max(a[0],b[0]),y1=Math.min(a[1],b[1]),y2=Math.max(a[1],b[1]);return x2>r.x-margin&&x1<r.x+r.w+margin&&y2>r.y-margin&&y1<r.y+r.h+margin;}
const usedSegments=[];
function congestion(a,b){let cost=0;for(const [c,d] of usedSegments){if(a[1]===b[1]&&c[1]===d[1]&&a[1]===c[1])cost+=Math.max(0,Math.min(Math.max(a[0],b[0]),Math.max(c[0],d[0]))-Math.max(Math.min(a[0],b[0]),Math.min(c[0],d[0])))*12;else if(a[0]===b[0]&&c[0]===d[0]&&a[0]===c[0])cost+=Math.max(0,Math.min(Math.max(a[1],b[1]),Math.max(c[1],d[1]))-Math.max(Math.min(a[1],b[1]),Math.min(c[1],d[1])))*12;}return cost;}
function route(start,end,rects,bounds,extraX=[],extraY=[]){
 let xs=[start[0],end[0],bounds.x,bounds.x+bounds.w,...extraX],ys=[start[1],end[1],bounds.y,bounds.y+bounds.h,...extraY];
 for(const r of rects){xs.push(r.x-28,r.x+r.w+28);ys.push(r.y-28,r.y+r.h+28);}
 xs=[...new Set(xs)].sort((a,b)=>a-b);ys=[...new Set(ys)].sort((a,b)=>a-b);
 const key=(x,y,d)=>x+','+y+','+d;let si=xs.indexOf(start[0]),sj=ys.indexOf(start[1]),ei=xs.indexOf(end[0]),ej=ys.indexOf(end[1]);
 let queue=[{x:si,y:sj,d:0,g:0,f:0,k:key(si,sj,0)}],cost=new Map([[key(si,sj,0),0]]),prev=new Map(),endKey;
 const blocked=new Map();const clear=(a,b)=>{let k=a+'|'+b;if(blocked.has(k))return blocked.get(k);let v=!rects.some(r=>intersects(a,b,r));blocked.set(k,v);return v;};
 const congestionCache=new Map();
 while(queue.length){queue.sort((a,b)=>b.f-a.f);let cur=queue.pop();if(cur.g!==cost.get(cur.k))continue;if(cur.x===ei&&cur.y===ej){endKey=cur.k;break;}for(const [dx,dy,d] of [[1,0,1],[-1,0,1],[0,1,2],[0,-1,2]]){let x=cur.x+dx,y=cur.y+dy;if(x<0||x>=xs.length||y<0||y>=ys.length)continue;let a=[xs[cur.x],ys[cur.y]],b=[xs[x],ys[y]];if(!clear(a,b))continue;let ck=a+'|'+b;if(!congestionCache.has(ck))congestionCache.set(ck,congestion(a,b));let g=cur.g+Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])+(cur.d&&cur.d!==d?45:0)+congestionCache.get(ck);let k=key(x,y,d);if(g>=(cost.get(k)??Infinity))continue;cost.set(k,g);prev.set(k,cur.k);queue.push({x,y,d,g,f:g+Math.abs(xs[x]-end[0])+Math.abs(ys[y]-end[1]),k});}}
 if(!endKey)return null;let out=[];for(let k=endKey;k; k=prev.get(k)){const [x,y]=k.split(',').map(Number);out.push([xs[x],ys[y]]);}return simplify(out.reverse());
}
function simplify(p){return p.filter((v,i)=>!i||i===p.length-1||!((p[i-1][0]===v[0]&&v[0]===p[i+1][0])||(p[i-1][1]===v[1]&&v[1]===p[i+1][1])));}
function ports(n){return [['r',[n.x+n.w,n.y+n.h/2],[n.x+n.w+28,n.y+n.h/2]],['l',[n.x,n.y+n.h/2],[n.x-28,n.y+n.h/2]],['b',[n.x+n.w/2,n.y+n.h],[n.x+n.w/2,n.y+n.h+28]],['t',[n.x+n.w/2,n.y],[n.x+n.w/2,n.y-28]]];}
function lanes(m){return {xs:[m.x+50,m.x+m.w-50,...[0,1].flatMap(c=>[60,110,160].map(d=>m.x+100+c*SX+NW+d))],ys:[m.y+170,m.y+m.h-100,...[0,1,2].flatMap(r=>[50,90].map(d=>m.y+210+r*SY+NH+d))]};}
function localRoute(a,b,m){
 const ll=lanes(m);
 let candidates=[];for(const p of ports(a))for(const q of ports(b)){let dist=Math.abs(p[2][0]-q[2][0])+Math.abs(p[2][1]-q[2][1]);candidates.push({p,q,dist});}candidates.sort((a,b)=>a.dist-b.dist);
 let best=null,score=Infinity;for(const {p,q} of candidates.slice(0,8)){const pts=route(p[2],q[2],m.nodes,{x:m.x+32,y:m.y+162,w:m.w-64,h:m.h-210},ll.xs,ll.ys);if(!pts)continue;const val=pts.reduce((v,b,i)=>v+(i?Math.abs(b[0]-pts[i-1][0])+Math.abs(b[1]-pts[i-1][1])+congestion(pts[i-1],b):0),0)+pts.length*40;if(val<score){best=[p[1],...pts,q[1]];score=val;}}if(!best)throw Error('unroutable '+a.id+' '+b.id);return simplify(best);
}
const globalPorts=new Map();function boundary(m,side,index){let offset=210+(index%20)*56;let max=side==='l'||side==='r'?m.h-160:m.w-160;offset=Math.min(max,offset);return side==='r'?[m.x+m.w,m.y+offset]:side==='l'?[m.x,m.y+offset]:side==='b'?[m.x+offset,m.y+m.h]:[m.x+offset,m.y+150];}
function sideFor(a,b){let dx=b.x-a.x,dy=b.y-a.y;return Math.abs(dx)>Math.abs(dy)?(dx>0?'r':'l'):'r';}
function routedCross(e,i){let a=nodes.get(e.from),b=nodes.get(e.to),ma=ids.get(a.moduleId),mb=ids.get(b.moduleId);if(ma===mb)return localRoute(a,b,ma);
 let sa=sideFor(ma,mb),sb=sideFor(mb,ma);if(e.type==='main'&&mb.y>ma.y&&ma.x===mb.x){sa='b';sb='l';}
 let ka=ma.id+sa,kb=mb.id+sb,ia=globalPorts.get(ka)||0,ib=globalPorts.get(kb)||0;globalPorts.set(ka,ia+1);globalPorts.set(kb,ib+1);
 let pa=boundary(ma,sa,ia),pb=boundary(mb,sb,ib);
 // Upper boundaries are below the frame title; external routing treats that as the module's routing envelope.
 const ob=m=>({x:m.x,y:m.y,w:m.w,h:m.h});
 const offset=(p,s,d)=>[p[0]+(s==='r'?d:s==='l'?-d:0),p[1]+(s==='b'?d:s==='t'?-d:0)];
 let ea=offset(pa,sa,36+(i%6)*16),eb=offset(pb,sb,36+(i%6)*16);
 function tail(n,m,p){let best;let ll=lanes(m);for(const po of ports(n)){let v=route(po[2],p,m.nodes,{x:m.x+26,y:m.y+152,w:m.w-52,h:m.h-170},ll.xs,ll.ys);if(v){let score=v.reduce((s,vv,i)=>s+(i?Math.abs(vv[0]-v[i-1][0])+Math.abs(vv[1]-v[i-1][1])+congestion(v[i-1],vv):0),0)+v.length*70;if(!best||score<best.score)best={score,p:[po[1],...v]};}}if(!best)throw Error('no tail '+n.id);return best.p;}
 let middle=route(ea,eb,modules.map(ob),{x:38,y:220,w:W-76,h:toolY-240},[...Array(4)].map((_,c)=>PAD+MW+c*(MW+GX)+GX/2),[...Array(4)].map((_,r)=>TOP+MH+r*(MH+GY)+GY/2));
 if(!middle)throw Error('no middle '+e.id);
 e.boundaryPorts={from:pa,to:pb};
 // Secondary cross-module handoffs stop at explicit labeled module ports. Their source
 // and destination node ids are printed both on the line and in the node footer.
 // This avoids drawing dozens of long wires through the local decision flow.
 return e.type==='main'?simplify([...tail(a,ma,pa),ea,...middle.slice(1),pb,...tail(b,mb,pb).reverse().slice(1)]):simplify([pa,ea,...middle.slice(1),pb]);
}
for(const [i,e] of edges.entries()){let a=nodes.get(e.from),b=nodes.get(e.to);e.points=e.type==='internal'?localRoute(a,b,ids.get(e.moduleId)):routedCross(e,i);for(let j=1;j<e.points.length;j++)usedSegments.push([e.points[j-1],e.points[j]]);}

// Native SVG: no foreignObject, CSS-only glyphs, or raster text.
const toolGroups=[...new Set(td.tools.map(t=>t.category))];
const TC=6,TW=(W-PAD*2-120*(TC-1))/TC,TH=670,TR=Math.ceil(td.tools.length/TC),H=toolY+190+TR*(TH+100)+200;
const meta={title:'豆包汽车｜语音请求到真实结果',version:'v14',baseline:'2026-10-22 正文与逐字稿核对版',width:W,height:H,modules,edges,sources,tools:td.tools,toolCountExplanation:td.countExplanation,coverage:td.coverageNote,additionalInventoryFindings:td.additionalInventoryFindings,mainIds};
const fontColor={process:color.ink,decision:'#775319',result:'#186757',reference:'#62758A',warning:'#8B4545'};
const fills={process:'#F4F8FE',decision:'#FFF8E8',result:'#EFF8F4',reference:'#F3F5F7',warning:'#FFF3F2'};
function nodeSvg(n){let title=wrap(n.title,448,26);let body=n.lines.flatMap(l=>wrap(l,448,22));if(title.length>2||body.length>6)throw Error('text overflow '+n.id+':'+title.length+'/'+body.length);let out=cross.filter(e=>e.from===n.id&&nodes.get(e.to).moduleId!==n.moduleId).map(e=>e.id+'→'+e.to),incoming=cross.filter(e=>e.to===n.id&&nodes.get(e.from).moduleId!==n.moduleId).map(e=>e.id);let footer=out.length?'交出 '+out.join('  '):incoming.length?'接入 '+incoming.join('  '):'';return `<g class="node" data-node="${n.id}" role="button" tabindex="0" aria-label="${esc(n.title)}"><rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="9" fill="${fills[n.kind]||fills.process}" stroke="${n.kind==='decision'?'#D6B577':n.kind==='result'?'#85B6A7':'#ABC2E0'}" stroke-width="2"/>${txt(n.x+22,n.y+28,[n.id],16,color.muted,600)}${txt(n.x+22,n.y+62,title,26,fontColor[n.kind]||color.ink,600,'start',34)}${txt(n.x+22,n.y+70+title.length*34,body,22,color.ink,400,'start',29)}${footer?txt(n.x+22,n.y+n.h-15,wrap(footer,448,16),16,color.blue):''}</g>`;}
function edgeColor(e){return e.type==='main'?color.blue:e.type==='feedback'?color.green:e.type==='trigger'||e.type==='planned'?color.gold:e.type==='interrupt'?color.red:e.type==='signal'?'#5C809D':e.type==='reference'?'#9EABB8':color.line;}
function edgeSvg(e){let col=edgeColor(e),main=e.type==='main';return `<g class="edge ${e.type}" data-edge="${e.id}" data-from="${e.from}" data-to="${e.to}"><polyline points="${e.points.map(p=>p.join(',')).join(' ')}" fill="none" stroke="white" stroke-width="${main?12:7}"/><polyline points="${e.points.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${col}" stroke-width="${main?5:2.5}"${['planned','reference'].includes(e.type)?' stroke-dasharray="9 7"':''} marker-end="url(#arr-${col.slice(1)})"/></g>`;}
// Edge numbers stay close to their own path. Full explanations are visible when selected in HTML.
const occupiedLabels=[];const labelWarnings=[];
function rectOverlap(a,b,pad=3){return a.x<b.x+b.w+pad&&a.x+a.w>b.x-pad&&a.y<b.y+b.h+pad&&a.y+a.h>b.y-pad;}
function labelSvg(e){
 const label=e.type==='internal'?e.label:`${e.id} ${e.from} → ${e.to} · ${e.label}`;
 let segments=e.points.slice(1).map((b,i)=>{let a=e.points[i];return {a,b,len:Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1]),horizontal:a[1]===b[1]}}).filter(s=>s.len>70).sort((a,b)=>b.len-a.len);
 const external=nodes.get(e.from).moduleId!==nodes.get(e.to).moduleId;
 let choice;const blocks=external?[...modules,...occupiedLabels]:[...nodes.values(),...modules.map(m=>({x:m.x,y:m.y,w:m.w,h:148})),...occupiedLabels];
 for(const s of segments){let ww=s.horizontal?Math.min(e.type==='internal'?300:450,s.len-32):Math.min(e.type==='internal'?260:420,Math.max(140,textWidth(label,17)+20));let lines=wrap(label,ww-16,17),h=lines.length*23+12;if(h>150)continue;
  for(const f of [.5,.28,.72,.15,.85]){let mid=[s.a[0]+(s.b[0]-s.a[0])*f,s.a[1]+(s.b[1]-s.a[1])*f];let options=s.horizontal?[9,35,62,-9-h,-35-h,-62-h].map(d=>[mid[0]-ww/2,mid[1]+d]):[[mid[0]+10,mid[1]-h/2],[mid[0]-ww-10,mid[1]-h/2],[mid[0]-ww/2,mid[1]-h/2]];
   for(const [x,y] of options){let r={x,y,w:ww,h};if(x<0||y<220||x+ww>W||blocks.some(b=>rectOverlap(r,b)))continue;choice={...r,lines};break;}if(choice)break;}if(choice)break;
 }
 if(!choice&&external){for(const s of segments){const ww=180,lines=wrap(label,164,17),h=lines.length*23+12;for(const f of [.5,.25,.75]){const mid=[s.a[0]+(s.b[0]-s.a[0])*f,s.a[1]+(s.b[1]-s.a[1])*f];for(const dx of [-90,-190,10])for(const dy of [-h-10,10,50,-h-50]){let r={x:mid[0]+dx,y:mid[1]+dy,w:ww,h};if(r.x<0||r.y<220||r.x+ww>W||blocks.some(b=>rectOverlap(r,b)))continue;choice={...r,lines};break;}if(choice)break;}if(choice)break;}}
 if(!choice){labelWarnings.push(e.id);let s=segments[0],mid=[(s.a[0]+s.b[0])/2,(s.a[1]+s.b[1])/2];choice={x:mid[0]+8,y:mid[1]+8,w:82,h:34,lines:[e.id]};}
 occupiedLabels.push(choice);e.labelBox={x:choice.x,y:choice.y,w:choice.w,h:choice.h};
 return `<g class="edge-label" data-edge="${e.id}"><rect x="${choice.x}" y="${choice.y}" width="${choice.w}" height="${choice.h}" rx="4" fill="white" fill-opacity="0.98"/>${txt(choice.x+8,choice.y+23,choice.lines,17,edgeColor(e),500,'start',23)}</g>`;
}
const colors=[...new Set(edges.map(edgeColor))];
const defs=`<defs>${colors.map(c=>`<marker id="arr-${c.slice(1)}" markerWidth="7" markerHeight="6" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L7,3 L0,6 Z" fill="${c}"/></marker>`).join('')}</defs>`;
const moduleFrames=modules.map(m=>`<g class="module-frame" data-module="${m.id}"><rect x="${m.x}" y="${m.y}" width="${m.w}" height="${m.h}" rx="14" fill="white" stroke="#9BB8DA" stroke-width="3"/><rect x="${m.x}" y="${m.y}" width="${m.w}" height="140" rx="14" fill="#EAF2FF"/>${txt(m.x+34,m.y+54,[m.title],36,color.ink,650)}${txt(m.x+34,m.y+100,wrap(m.subtitle,m.w-68,22),22,color.muted)}</g>`).join('');
const toolNodes=td.tools.map((t,i)=>{const x=PAD+(i%TC)*(TW+120),y=toolY+240+Math.floor(i/TC)*(TH+100);t.id='TOOL'+String(i+1).padStart(2,'0');Object.assign(t,{x,y,w:TW,h:TH});let lines=[...wrap('输入：'+t.input,TW-48,22),'',...wrap('机制：'+t.mechanism,TW-48,22),'',...wrap('输出：'+t.output,TW-48,22),'',...wrap('异常／边界：'+t.exception,TW-48,22)];if(116+(lines.length-1)*28>TH-125)throw Error('tool overflow '+t.name);return `<g class="tool-node" data-tool="${t.id}" role="button" tabindex="0"><rect x="${x}" y="${y}" width="${TW}" height="${TH}" rx="10" fill="#F5F8FD" stroke="#ABC2E0" stroke-width="2"/>${txt(x+24,y+36,[`${i+1} · ${t.label}`],28,color.ink,600)}${txt(x+24,y+73,wrap(t.name,TW-48,19),19,color.blue)}${txt(x+24,y+116,lines,22,color.ink,400,'start',28)}${txt(x+24,y+TH-82,wrap('范围：'+t.status,TW-48,20),20,'#8B652E')}</g>`;}).join('');
const toolConnector=`<polyline points="${em.x+em.w},${em.y+em.h-75} ${em.x+em.w+100},${em.y+em.h-75} ${em.x+em.w+100},${toolY+150} ${PAD+1200},${toolY+150}" fill="none" stroke="#627E9F" stroke-width="3" stroke-dasharray="10 7" marker-end="url(#arr-627E9F)"/>${txt(PAD+1250,toolY+135,['E2 的能力清单展开，不是另一层推理或独立执行流程'],22,color.muted)}`;
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${defs}<rect width="${W}" height="${H}" fill="#F8FAFD"/>${txt(PAD,80,[meta.title],52,color.ink,650)}${txt(PAD,135,['主链：语音 → 有效请求与端云路由 → 输入管理 → 上下文 → Director → 工具执行 → 反馈再判断 → 真实输出'],29,color.blue,500)}${txt(PAD,190,['蓝色＝请求与动作　绿色＝实际结果回流　金色＝任务与触发　红色＝打断　虚线＝规划项或同一职责引用；跨区线走框外，节点与线都标明交接编号'],23,color.muted)}${moduleFrames}<g id="connections">${edges.map(edgeSvg).join('')}</g><g id="connection-labels">${edges.map(labelSvg).join('')}</g>${[...nodes.values()].map(nodeSvg).join('')}${toolConnector}${txt(PAD,toolY+25,['E · 工具能力展开｜33 个业务条目，34 个英文标识；不是每辆车同时拥有 33 个工具'],36,color.ink,600)}${txt(PAD,toolY+73,['E2 选择本项目工具 → E4 承接动作 → E6 返回结果。高德两项测试中；后半段未核实的机制已标明。'],24,color.muted)}${toolNodes}</svg>`;
fs.writeFileSync(path.join(root,'业务全链路-v14.svg'),svg);
fs.writeFileSync(path.join(root,'graph-v14.json'),JSON.stringify(meta,null,2));
const outdir='/Users/bytedance/Desktop/3.23/产品/codex/HTML/01-进行中';
fs.mkdirSync(outdir,{recursive:true});
let template=fs.readFileSync(path.join(root,'viewer.html'),'utf8');
const safeJSON=JSON.stringify(meta).replace(/</g,'\\u003c');
template=template.replace('<!--SVG-->',svg).replace('/*DATA*/',`const DATA=${safeJSON};`);
const output=path.join(outdir,'豆包汽车-业务全链路-v14.html');fs.writeFileSync(output,template);
// Local focused SVG previews are generated without raster transformations.
const previews=path.join(root,'previews');fs.mkdirSync(previews,{recursive:true});
for(const m of modules){fs.writeFileSync(path.join(previews,m.id+'.svg'),svg.replace(`width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"`,`width="${m.w+80}" height="${m.h+80}" viewBox="${m.x-40} ${m.y-40} ${m.w+80} ${m.h+80}"`));}
fs.writeFileSync(path.join(root,'layout-report.json'),JSON.stringify({labelWarnings,nodes:nodes.size,edges:edges.length},null,2));
console.log(JSON.stringify({output,modules:modules.length,nodes:nodes.size,edges:edges.length,tools:td.tools.length,width:W,height:H,labelWarnings}));
