import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {modules as presentation,sources as psources} from './parts/presentation.mjs';
const root=path.dirname(fileURLToPath(import.meta.url));
const load=n=>JSON.parse(fs.readFileSync(path.join(root,'parts',n+'.json'),'utf8'));
const parts=['voice','director','async'].map(load),td=load('tools');
// The local transcript and cloud document are separate evidence records, never silently overwrite one.
for(const s of parts[0].sources||[])if(s.id==='DT-MEETING')s.id='DT-MEETING-LOCAL';
for(const m of parts[0].modules){m.sourceIds=(m.sourceIds||[]).map(id=>id==='DT-MEETING'?'DT-MEETING-LOCAL':id);for(const n of m.nodes)n.sourceIds=(n.sourceIds||[]).map(id=>id==='DT-MEETING'?'DT-MEETING-LOCAL':id);}
const modules=[...parts.flatMap(p=>p.modules),...presentation];
const sources=[...new Map([...parts.flatMap(p=>p.sources||[]),...psources,...(td.sources||[])].map(s=>[s.id,s])).values()];
sources.push({id:'ROOT-LONGTERM',title:'AI 汽车长期产品架构',url:'https://bytedance.larkoffice.com/wiki/ZTAUwle0niQMWukBhzccHopRnff',note:'用户原始材料；长期业务剧本与能力方向，不视作当前车型可执行清单。'}, {id:'ROOT-26GOAL',title:'AI 汽车 2.6 目标拆解',url:'https://bytedance.larkoffice.com/wiki/QiHywkYUeidVQwkhNDccCzPNndd',note:'用户原始材料；S5–S11 路线图、Demo 车约束与目标指标。与 10 月 PRD 分版本，不把目标当已测结果。'}, {id:'ROOT-INDEX',title:'AI 汽车核心资料索引',url:'https://bytedance.larkoffice.com/wiki/Zi6fwVKgvi6bo2k3UiCc90Ccntf',note:'本轮扩展检索入口，含约 165 个链接；目录扫描不等于所有链接正文审读。'});
const ids=new Map(modules.map(m=>[m.id,m]));
// Stable node IDs retain the original-module mapping; visual order follows business stages.
const visualOrder={O:['O01','O02','O10','O13','O14','O03','O15','O16','O17','O04','O06','O18','O05','O08','O09','O07','O11','O12']};
for(const m of modules){if(visualOrder[m.id])m.nodes.sort((a,b)=>visualOrder[m.id].indexOf(a.id)-visualOrder[m.id].indexOf(b.id));if(m.id!=='T')m.nodes.forEach((n,i)=>Object.assign(n,{row:Math.floor(i/3),col:Math.floor(i/3)%2?2-i%3:i%3}));}
const grid=[['V','R','M','C'],['I','O','E','D'],['W','F','K','T'],['B','A','G','S'],['P','L','H','U']];
const MW=2760,GX=760,GY=760,PAD=190,TOP=370,NW=720,NH=780,SX=910,SY=1010;
const W=PAD*2+MW*4+GX*3;
const rowBands=[];let rowY=TOP;
for(const row of grid){let max=Math.max(...row.map(id=>Math.ceil(ids.get(id).nodes.length/3)));let h=360+(max-1)*SY+NH+170;rowBands.push({y:rowY,h});rowY+=h+GY;}
const toolY=rowY+100;
const color={ink:'#163352',blue:'#2463C5',line:'#627E9F',green:'#248171',gold:'#B07622',red:'#B85A59',muted:'#62758A'};
const esc=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const textWidth=(s,size)=>[...String(s)].reduce((w,c)=>w+(c.charCodeAt(0)>255?1:0.56)*size,0);
const wrap=(s,width,size)=>{let out=[],line='';const tokens=String(s).match(/[A-Za-z0-9_/.:-]+|\n|[^\n]/g)||[];for(const token of tokens){const units=textWidth(token,size)>width?[...token]:[token];for(const c of units){if(c==='\n'||(textWidth(line+c,size)>width&&line)){out.push(line);line=c==='\n'?'':c;}else line+=c;}}if(line)out.push(line);return out;};
function txt(x,y,lines,size=25,fill=color.ink,weight=400,anchor='start',lh=size*1.42){return '<text x="'+x+'" y="'+y+'" font-size="'+size+'" font-weight="'+weight+'" fill="'+fill+'" text-anchor="'+anchor+'">'+lines.map((l,i)=>'<tspan x="'+x+'" dy="'+(i?lh:0)+'">'+esc(l)+'</tspan>').join('')+'</text>';}
const nodes=new Map();
for(let r=0;r<grid.length;r++)for(let c=0;c<4;c++){let m=ids.get(grid[r][c]);Object.assign(m,{x:PAD+c*(MW+GX),y:rowBands[r].y,w:MW,h:rowBands[r].h,nodeRows:Math.ceil(m.nodes.length/3),order:r*4+c});for(const n of m.nodes){Object.assign(n,{moduleId:m.id,x:m.x+100+n.col*SX,y:m.y+360+n.row*SY,w:NW,h:NH});if(nodes.has(n.id))throw Error('duplicate '+n.id);nodes.set(n.id,n);}}
const mainIds=['V','R','M','C','D','E','O'];
const edges=[];for(const m of modules)for(const [i,e] of m.edges.entries()){
 if(e.from==='E3'&&e.to==='F01')continue; // Capability admission happens before decisions, not after publication.
 const fixed={...e};
 if(e.from==='C7'&&e.to==='K07')Object.assign(fixed,{to:'K01',label:'预注入请求：先核可信身份与授权'});
 if(e.from==='C12'&&e.to==='K09')Object.assign(fixed,{to:'K01',label:'显式检索请求：先核可信身份与授权'});
 if(e.from==='P02'&&e.to==='P03')fixed.label='非全渠道：核本项目已授权范围';
 edges.push({...fixed,id:m.id+'-'+(i+1),moduleId:m.id,type:(e.from==='E4'&&e.to==='F08')?'reference':e.type||'internal'});
}
const cross=[];
const link=(from,to,label,type='handoff')=>cross.push({from,to,label,type,id:'X'+String(cross.length+1).padStart(2,'0')});
const voiceFinal='V12';
const routeIn=ids.get('R').nodes[0].id;
link(voiceFinal,routeIn,'最终文字：普通入口，可见即可说未接管时','main');
link('V3','R13','仅免唤醒路径：过程文字先做本地召回','signal');
link('R8','M1','云端承接：用户原话与音区','main');
link('R12','C5','同步本地已执行动作与回复，不重做','feedback');
link('M9','C1','这一轮允许开始，准备相关背景','main');
link('C11','D1','有效输入与本轮上下文就绪','main');
link('D11','E1','action_list：本轮明确动作','main');
link('D11','O01','话术与表情：不等待动作才能生成','main');
link('E8','M1','tool_feedback：走输入管理再推理','feedback');
link('D12','O07','结果说明仍由同一个 Director 输出','reference');
link('E4','T01','调用 task_agent：交办未来任务','trigger');
link('T04','G01','注册待观察的条件与触发要求','trigger');
link('G07','T07','条件满足：回调仍需检查任务有效性','trigger');
link('T08','M1','advice：请 Director 再决定如何做','trigger');
link('T06','E6','仅创建应答：已保存且注册成功，回本次调用','feedback');
link('T18','E6','有本次管理调用才回失败/取消；自然终止只更新状态','feedback');
link('T12','E6','仅本次语音查询：任务状态回原工具调用，不等于已执行','feedback');
link('T16','M1','上汽推荐 ID 经车端回流，才进入本轮处理','trigger');
link('E6','T09','按任务关联结果回写；具体回写协议需核','reference');
link('T12','U01','任务与生命周期展示','trigger');
link('U03','T11','用户管理操作返回原任务','trigger');
link('S06','M1','静态 Advisor 建议进入统一输入','trigger');
link('S08','U01','AI 服务进入相应管理范围','trigger');
link('B06','C1','当前背景：按需取用，不必串行查遍','signal');
link('B07','G03','状态更新唤醒相关云端规则','signal');
link('B07','L03','本地规则消费对应端侧信号','signal');
link('B08','S02','相关情景变化唤醒预设 Advisor','signal');
link('B03','A01','视觉观察走资源与权限管理','signal');
link('A06','C4','完整视觉描述按需成为上下文','signal');
link('E4','A01','显式问图：先核权限资源，再按主动 VQA 分路','handoff');
link('A11','E6','得到实际视觉答案后，回原工具调用','feedback');
link('A18','E6','问图失败/不可判断，也回原调用事实','feedback');
link('A12','H01','感知事件进入静默展示分支，按项目建设状态','trigger');
link('P08','G01','云端配置生效后才参与运行','trigger');
link('P08','L02','端侧配置仍按专属协议；统一下发是后续项','planned');
link('G08','S02','需主动建议的场景交给 Advisor','trigger');

link('L06','U06','原业务方注册并呈现卡片','trigger');
link('U07','L07','端侧业务确认回到所属场景','trigger');
link('L08','B09','真实车辆执行状态回流','feedback');
link('E6','B09','关联执行反馈和状态，具体通道按工具','reference');
link('O09','C5','后续轮次保留已发生的交互','feedback');
link('O11','C9','工具说明／示例修改后先回归评测，再按流程发布','reference');
link('O06','I1','说话期间来了新声音','interrupt');
link('O04','M10','真实 STARTED/PROGRESS/FINISHED/ABORTED 事件','feedback');
link('E6','I15','插话时旧工具已发：仍保留原调用结果','reference');
link('I7','M1','拒识后的恢复事件携带旧播报信息','interrupt');
link('I8','M1','有效新 query 携带已播未播与动作状态','interrupt');
link('I11','O03','需要续接：新话术交 TTS','interrupt');
link('I12','E1','明确取消任务：另发任务操作，不只是停播','handoff');
// Endpoint local-control branch is kept independent of cloud Director.
link('R9','O08','本地控制也要验收真实结果','reference');

const optional=(from,to,label,type='handoff')=>{if(nodes.has(from)&&nodes.has(to)&&!edges.some(e=>e.from===from&&e.to===to)&&!cross.some(e=>e.from===from&&e.to===to))link(from,to,label,type);};
optional('U06','W01','支持的卡片出现：页面业务解析可操作控件','signal');
optional('U09','W12','卡片退场/页面变化：更新或注销词表','signal');
optional('V12','W04','项目已启用且有有效词表：用最终文字匹配','handoff');
optional('W03','V16','有效可见词供 ASR 热词，不直接执行','signal');
optional('W05','R1','无匹配：回普通语音入口，继续有效性判断','handoff');
optional('W09','O13','真实执行结果与可播文本交统一语音服务','feedback');
optional('W11','C5','模拟点击作为已发生事件写入历史','feedback');
optional('C2','K01','可信账号、车辆和座位决定记忆读取范围','signal');
optional('E4','K01','选中记忆类工具：先验可信身份与操作范围','reference');
optional('K03','K13','10/19删除需求：车主与删除权限通过；批量先由 D 确认','planned');
optional('K13','D5','批量未确认先澄清；用户确认仍从 M/C 进入下一轮，不在此删','reference');
optional('K14','E6','删除实现待核：只将本次接口实际结果/失败回原调用','planned');
optional('K10','C11','预注入：相关且授权的记忆供本轮判断','signal');
optional('K10','E6','显式检索：答案返回原工具调用','feedback');
optional('F11','E5','标准化结果交回当前工具调用','feedback');
optional('C8','F01','推理前展开：哪些能力可出现在本轮','reference');
optional('F06','C11','仅把满足条件的工具描述注入本轮背景','signal');
optional('E2','F07','工具被选中后，再核对明确参数','reference');
optional('D4','C12','缺记忆时展开显式检索；动作仍经 D11/E','reference');
optional('F13','M1','Fallback：不会做且不知下一跳，交回主链判断','feedback');
optional('F12','O01','按 direct_return 配置直接交付，不再强制推理','handoff');
optional('B12','U06','按消息类型交给所属卡片业务','trigger');
optional('H12','O08','静默文字和 PHUD 真实曝光分别验收，不是语音成功','reference');
optional('U11','T11','总开关按项目清理任务；语音子开关另判','interrupt');
optional('U12','T11','删除/取消回任务服务撤销后续活动','interrupt');
optional('E6','O08','同一次操作核对真实履约，不拿受理当完成','reference');
for(const p of parts)for(const e of p.crossModuleEdges||[]){
 const type=['future','source_design'].includes(e.relation)?'planned':e.relation==='reference'?'reference':e.relation==='data'?'signal':e.type||'trigger';
 const old=cross.find(x=>x.from===e.from&&x.to===e.to);
 if(old)Object.assign(old,{label:e.label,type,relation:e.relation});else optional(e.from,e.to,e.label,type);
}
for(const e of cross){if(!nodes.has(e.from)||!nodes.has(e.to))throw Error('bad cross '+JSON.stringify(e));}
edges.push(...cross);
const unique=new Set();for(let i=edges.length-1;i>=0;i--){let k=edges[i].from+'>'+edges[i].to+'|'+edges[i].label;if(unique.has(k))edges.splice(i,1);else unique.add(k);}
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
function lanes(m){return {xs:[m.x+50,m.x+m.w-50,...[0,1].flatMap(c=>[60,110,160].map(d=>m.x+100+c*SX+NW+d))],ys:[m.y+210,m.y+265,m.y+m.h-100,...Array.from({length:m.nodeRows},(_,r)=>r).flatMap(r=>[60,110,160].map(d=>m.y+360+r*SY+NH+d))]};}
function localRoute(a,b,m){
 const ll=lanes(m);
 let candidates=[];for(const p of ports(a))for(const q of ports(b)){let dist=Math.abs(p[2][0]-q[2][0])+Math.abs(p[2][1]-q[2][1]);candidates.push({p,q,dist});}candidates.sort((a,b)=>a.dist-b.dist);
 let best=null,score=Infinity;for(const {p,q} of candidates.slice(0,8)){const pts=route(p[2],q[2],m.nodes,{x:m.x+32,y:m.y+180,w:m.w-64,h:m.h-220},ll.xs,ll.ys);if(!pts)continue;const val=pts.reduce((v,b,i)=>v+(i?Math.abs(b[0]-pts[i-1][0])+Math.abs(b[1]-pts[i-1][1])+congestion(pts[i-1],b):0),0)+pts.length*40;if(val<score){best=[p[1],...pts,q[1]];score=val;}}if(!best)throw Error('unroutable '+a.id+' '+b.id);return simplify(best);
}
const globalPorts=new Map();function boundary(m,side,index){let offset=210+(index%20)*56;let max=side==='l'||side==='r'?m.h-160:m.w-160;offset=Math.min(max,offset);return side==='r'?[m.x+m.w,m.y+offset]:side==='l'?[m.x,m.y+offset]:side==='b'?[m.x+offset,m.y+m.h]:[m.x+offset,m.y+180];}
function sideFor(a,b){let dx=b.x-a.x,dy=b.y-a.y;return Math.abs(dx)>Math.abs(dy)?(dx>0?'r':'l'):'r';}
function routedCross(e,i){let a=nodes.get(e.from),b=nodes.get(e.to),ma=ids.get(a.moduleId),mb=ids.get(b.moduleId);if(ma===mb)return localRoute(a,b,ma);
 let sa=sideFor(ma,mb),sb=sideFor(mb,ma);if(e.type==='main'&&mb.y>ma.y&&ma.x===mb.x){sa='b';sb='l';}
 let ka=ma.id+sa,kb=mb.id+sb,ia=globalPorts.get(ka)||0,ib=globalPorts.get(kb)||0;globalPorts.set(ka,ia+1);globalPorts.set(kb,ib+1);
 let pa=boundary(ma,sa,ia),pb=boundary(mb,sb,ib);
 // Upper boundaries are below the frame title; external routing treats that as the module's routing envelope.
 const ob=m=>({x:m.x,y:m.y,w:m.w,h:m.h});
 const offset=(p,s,d)=>[p[0]+(s==='r'?d:s==='l'?-d:0),p[1]+(s==='b'?d:s==='t'?-d:0)];
 let ea=offset(pa,sa,36+(i%6)*16),eb=offset(pb,sb,36+(i%6)*16);
 function tail(n,m,p){let best;let ll=lanes(m);for(const po of ports(n)){let v=route(po[2],p,m.nodes,{x:m.x+26,y:m.y+180,w:m.w-52,h:m.h-200},ll.xs,ll.ys);if(v){let score=v.reduce((s,vv,i)=>s+(i?Math.abs(vv[0]-v[i-1][0])+Math.abs(vv[1]-v[i-1][1])+congestion(v[i-1],vv):0),0)+v.length*70;if(!best||score<best.score)best={score,p:[po[1],...v]};}}if(!best)throw Error('no tail '+n.id);return best.p;}
 let middle=route(ea,eb,modules.map(ob),{x:38,y:220,w:W-76,h:toolY-240},[...Array(4)].map((_,c)=>PAD+MW+c*(MW+GX)+GX/2),rowBands.map(r=>r.y+r.h+GY/2));
 if(!middle)throw Error('no middle '+e.id);
 e.boundaryPorts={from:pa,to:pb};
 // Secondary cross-module handoffs stop at explicit labeled module ports. Their source
 // and destination node ids are printed both on the line and in the node footer.
 // This avoids drawing dozens of long wires through the local decision flow.
 return simplify([...tail(a,ma,pa),ea,...middle.slice(1),pb,...tail(b,mb,pb).reverse().slice(1)]);
}
for(const [i,e] of edges.entries()){let a=nodes.get(e.from),b=nodes.get(e.to);e.points=a.moduleId===b.moduleId?localRoute(a,b,ids.get(a.moduleId)):routedCross(e,i);for(let j=1;j<e.points.length;j++)usedSegments.push([e.points[j-1],e.points[j]]);}


const tc=4,TW=MW,toolRows=[],expandedTools=[...td.tools,...td.supplementalDefinitions];let nextTY=toolY+240;
for(let start=0;start<expandedTools.length;start+=tc){if(start===40)nextTY+=200;let ts=expandedTools.slice(start,start+tc),hs=ts.map(t=>180+['input','mechanism','output','exception'].reduce((sum,k)=>sum+Math.max(100,wrap(t[k]||'待补充',TW-150,25).length*35+76)+46,0)+Math.max(100,wrap(t.status||'',TW-80,22).length*31+40));let h=Math.max(...hs);toolRows.push({y:nextTY,h});nextTY+=h+150;}
const H=nextTY+200;
const coveragePath=path.join(root,'research-coverage.json');
const researchCoverage=fs.existsSync(coveragePath)?JSON.parse(fs.readFileSync(coveragePath,'utf8')):null;
const meta={title:'豆包汽车｜从一句话到真实执行的业务全链路',version:'v15',baseline:'2026-10-23 原文、协议与画板核对版',width:W,height:H,modules,edges,sources,tools:td.tools,toolCounts:td.counts,toolCountExplanation:td.countExplanation,coverage:td.criticalUnknowns.join('；'),supplementalDefinitions:td.supplementalDefinitions,criticalUnknowns:td.criticalUnknowns,mainIds,researchCoverage};
const fontColor={process:color.ink,decision:'#775319',result:'#186757',reference:'#62758A',warning:'#8B4545'};
const fills={process:'#F4F8FE',decision:'#FFF8E8',result:'#EFF8F4',reference:'#F3F5F7',warning:'#FFF3F2'};
function nodeSvg(n){
 let title=wrap(n.title,NW-52,30),body=n.lines.flatMap(l=>wrap(l,NW-52,25)),detail=wrap(n.detail,NW-52,25);
 let bodyY=n.y+89+title.length*39,detailY=bodyY+body.length*34+28,last=detailY+(detail.length-1)*34;
 if(title.length>2||body.length>9||last>n.y+NH-64)throw Error('text overflow '+n.id+': title '+title.length+', body '+body.length+', detail '+detail.length+', bottom '+(last-n.y));
 n.textLayout={titleLines:title.length,bodyLines:body.length,detailLines:detail.length,lastTextY:last};
 let outgoing=edges.filter(e=>e.from===n.id&&nodes.get(e.to).moduleId!==n.moduleId).map(e=>e.to),incoming=edges.filter(e=>e.to===n.id&&nodes.get(e.from).moduleId!==n.moduleId).map(e=>e.from);
 let footer=outgoing.length?'交出 → '+[...new Set(outgoing)].join(' / '):incoming.length?'接入 ← '+[...new Set(incoming)].join(' / '):'';
 return '<g class="node" data-node="'+n.id+'" role="button" tabindex="0" aria-label="'+esc(n.title)+'"><rect x="'+n.x+'" y="'+n.y+'" width="'+n.w+'" height="'+n.h+'" rx="9" fill="'+(fills[n.kind]||fills.process)+'" stroke="'+(n.kind==='decision'?'#D6B577':n.kind==='result'?'#85B6A7':'#ABC2E0')+'" stroke-width="2"/>'+txt(n.x+26,n.y+32,[n.id],18,color.muted,600)+txt(n.x+26,n.y+76,title,30,fontColor[n.kind]||color.ink,600,'start',39)+txt(n.x+26,bodyY,body,25,color.ink,500,'start',34)+'<line x1="'+(n.x+26)+'" y1="'+(detailY-33)+'" x2="'+(n.x+NW-26)+'" y2="'+(detailY-33)+'" stroke="#CAD8E6" stroke-width="1"/>'+txt(n.x+26,detailY,detail,25,color.ink,400,'start',34)+(footer?txt(n.x+26,n.y+n.h-24,wrap(footer,NW-52,18),18,color.blue):'')+'</g>';
}
function edgeColor(e){return e.type==='main'?color.blue:e.type==='feedback'?color.green:e.type==='trigger'||e.type==='planned'?color.gold:e.type==='interrupt'?color.red:e.type==='signal'?'#5C809D':e.type==='reference'?'#9EABB8':color.line;}
function edgeSvg(e){let col=edgeColor(e),main=e.type==='main';return '<g class="edge '+e.type+'" data-edge="'+e.id+'" data-from="'+e.from+'" data-to="'+e.to+'"><polyline points="'+e.points.map(p=>p.join(',')).join(' ')+'" fill="none" stroke="white" stroke-width="'+(main?14:9)+'"/><polyline points="'+e.points.map(p=>p.join(',')).join(' ')+'" fill="none" stroke="'+col+'" stroke-width="'+(main?6:3)+'"'+(['planned','reference'].includes(e.type)?' stroke-dasharray="10 8"':'')+' marker-end="url(#arr-'+col.slice(1)+')"/></g>';}
const occupiedLabels=[],labelWarnings=[];
function rectOverlap(a,b,pad=5){return a.x<b.x+b.w+pad&&a.x+a.w>b.x-pad&&a.y<b.y+b.h+pad&&a.y+a.h>b.y-pad;}
function labelSvg(e){
 const external=nodes.get(e.from).moduleId!==nodes.get(e.to).moduleId;
 const label=external?e.id+' '+e.from+' → '+e.to+' · '+e.label:e.label;
 let segments=e.points.slice(1).map((b,i)=>{let a=e.points[i];return {a,b,len:Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1]),horizontal:a[1]===b[1]}}).filter(s=>s.len>85).sort((a,b)=>b.len-a.len);
 let choice;let blocks=[...nodes.values(),...modules.map(m=>({x:m.x,y:m.y,w:m.w,h:180})),...occupiedLabels];
 const tryOn=(s,ww)=>{let lines=wrap(label,ww-20,20),h=lines.length*28+16;if(h>185)return;
  for(const f of [.5,.25,.75,.125,.375,.625,.875,.1,.9,.2,.4,.6,.8]){let mid=[s.a[0]+(s.b[0]-s.a[0])*f,s.a[1]+(s.b[1]-s.a[1])*f];let options=s.horizontal?[12,48,86,-12-h,-48-h,-86-h].map(d=>[mid[0]-ww/2,mid[1]+d]):[[mid[0]+12,mid[1]-h/2],[mid[0]-ww-12,mid[1]-h/2],[mid[0]-ww/2,mid[1]-h/2]];
   for(const [x,y] of options){let rr={x,y,w:ww,h};if(x<0||y<270||x+ww>W||blocks.some(b=>rectOverlap(rr,b)))continue;choice={...rr,lines};return;}}};
 for(const s of segments){tryOn(s,Math.min(external?500:340,s.horizontal?s.len-36:external?420:300));if(choice)break;}
 if(!choice)for(const s of segments){tryOn(s,210);if(choice)break;}
 if(!choice)for(const s of segments){tryOn(s,150);if(choice)break;}
 if(!choice)for(const s of segments){
  const mid=[(s.a[0]+s.b[0])/2,(s.a[1]+s.b[1])/2],ww=300,lines=wrap(label,ww-20,20),h=lines.length*28+16;
  for(const off of [210,-210,360,-360,510,-510]){
   const rr=s.horizontal?{x:mid[0]-ww/2,y:mid[1]+off,w:ww,h}:{x:off>0?mid[0]+off:mid[0]+off-ww,y:mid[1]-h/2,w:ww,h};
   const end=s.horizontal?[mid[0],off>0?rr.y:rr.y+rr.h]:[off>0?rr.x:rr.x+rr.w,mid[1]];
   if(rr.x<0||rr.y<270||rr.x+ww>W||blocks.some(b=>rectOverlap(rr,b))||[...nodes.values()].some(n=>intersects(mid,end,n)))continue;
   choice={...rr,lines,leader:[mid,end]};break;
  }if(choice)break;
 }
 if(!choice){labelWarnings.push(e.id);const s=segments[0],mid=[(s.a[0]+s.b[0])/2,(s.a[1]+s.b[1])/2];choice={x:mid[0]+10,y:mid[1]+10,w:100,h:42,lines:[e.id]};}
 occupiedLabels.push(choice);e.labelBox={x:choice.x,y:choice.y,w:choice.w,h:choice.h};
 if(choice.leader)e.labelLeader=choice.leader;
 return '<g class="edge-label" data-edge="'+e.id+'">'+(choice.leader?'<polyline points="'+choice.leader.map(p=>p.join(',')).join(' ')+'" fill="none" stroke="'+edgeColor(e)+'" stroke-width="1.5"/>':'')+'<rect x="'+choice.x+'" y="'+choice.y+'" width="'+choice.w+'" height="'+choice.h+'" rx="5" fill="white"/>'+txt(choice.x+10,choice.y+28,choice.lines,20,edgeColor(e),500,'start',28)+'</g>';
}
const colors=[...new Set([...edges.map(edgeColor),color.line,color.blue,color.green])];
const defs='<defs>'+colors.map(c=>'<marker id="arr-'+c.slice(1)+'" markerWidth="7" markerHeight="6" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L7,3 L0,6 Z" fill="'+c+'"/></marker>').join('')+'</defs>';
const moduleFrames=modules.map(m=>'<g class="module-frame" data-module="'+m.id+'"><rect x="'+m.x+'" y="'+m.y+'" width="'+m.w+'" height="'+m.h+'" rx="14" fill="white" stroke="#9BB8DA" stroke-width="3"/><rect x="'+m.x+'" y="'+m.y+'" width="'+m.w+'" height="165" rx="14" fill="#EAF2FF"/>'+txt(m.x+36,m.y+59,[m.id+' · '+m.title],39,color.ink,650)+txt(m.x+36,m.y+111,wrap(m.subtitle,m.w-72,24),24,color.muted)+'</g>').join('');
let toolPanels=[];
for(const [i,t] of expandedTools.entries()){
 const x=PAD+(i%tc)*(TW+GX),row=toolRows[Math.floor(i/tc)],y=row.y,h=row.h;
 t.id=(i<40?'TOOL':'SUP')+String(i<40?i+1:i-39).padStart(2,'0');Object.assign(t,{x,y,w:TW,h});
 if(i===40)toolPanels.push(txt(PAD,y-120,['另列专项定义｜6 项，不计入上方 40 行，也不代表当前已上线'],41,color.ink,600));
 let content='<rect x="'+x+'" y="'+y+'" width="'+TW+'" height="'+h+'" rx="12" fill="white" stroke="#9BB8DA" stroke-width="3"/>'+txt(x+30,y+51,[(t.row?'表第 '+t.row+' 行 · ':String(i+1)+' · ')+t.label],33,color.ink,600)+txt(x+30,y+96,wrap(t.name,TW-60,23),23,color.blue);
 let yy=y+160;
 for(const [key,title] of [['input','接收什么'],['mechanism','内部处理／能力边界'],['output','交回什么结果'],['exception','异常、限制与用户下一步']]){
  const lines=wrap(t[key]||'该表未给出，需核专项协议',TW-150,25),hh=Math.max(100,lines.length*35+76);
  content+='<rect x="'+(x+30)+'" y="'+yy+'" width="'+(TW-60)+'" height="'+hh+'" rx="7" fill="'+(key==='exception'?'#FFF8E8':key==='output'?'#EFF8F4':'#F4F8FE')+'" stroke="#C3D2E5" stroke-width="2"/>'+txt(x+55,yy+33,[title],21,color.muted,600)+txt(x+55,yy+72,lines,25,color.ink,400,'start',35);
  if(key!=='exception')content+='<line x1="'+(x+TW/2)+'" y1="'+(yy+hh)+'" x2="'+(x+TW/2)+'" y2="'+(yy+hh+40)+'" stroke="#627E9F" stroke-width="3" marker-end="url(#arr-627E9F)"/>';
  yy+=hh+46;
 }
 content+=txt(x+32,yy+10,wrap('适用范围与状态：'+t.status,TW-64,22),22,'#775319');
 toolPanels.push('<g class="tool-node" data-tool="'+t.id+'" role="button" tabindex="0">'+content+'</g>');
}
const em=ids.get('E');
const toolConnector='<polyline points="'+[ [em.x+em.w,em.y+em.h-55],[W-80,em.y+em.h-55],[W-80,toolY+110],[PAD+500,toolY+110] ].map(p=>p.join(',')).join(' ')+'" fill="none" stroke="#627E9F" stroke-width="3" stroke-dasharray="10 8" marker-end="url(#arr-627E9F)"/>'+txt(PAD+600,toolY+98,['E/F 所选能力的详细展开；不是每次请求顺序调用全部工具'],25,color.muted);
const svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'">'+defs+'<rect width="'+W+'" height="'+H+'" fill="#F8FAFD"/>'+txt(PAD,90,[meta.title],58,color.ink,650)+txt(PAD,160,['语音 → 有效请求／端云采信 → 输入管理 → 相关背景 → Director 决策 → 工具执行 → 结果回流再判断'],34,color.blue,500)+txt(PAD,228,['蓝：请求与动作　绿：结果回流　金：任务与触发　红：打断　虚线：规划或职责引用'],27,color.muted)+moduleFrames+'<g id="connections">'+edges.map(edgeSvg).join('')+'</g><g id="connection-labels">'+edges.map(labelSvg).join('')+'</g>'+[...nodes.values()].map(nodeSvg).join('')+toolConnector+txt(PAD,toolY+20,['工具机制展开｜'+td.tools.length+' 个表内业务条目，包含重复标识和弃用项'],41,color.ink,600)+txt(PAD,toolY+66,['可用集合由车型、渠道、版本、权限和当轮动态条件决定；Task Agent 等另有专项定义，不把表行数当可调用数量。'],26,color.muted)+toolPanels.join('')+'</svg>';
fs.writeFileSync(path.join(root,'业务全链路-v15.svg'),svg);
fs.writeFileSync(path.join(root,'graph-v15.json'),JSON.stringify(meta,null,2));
fs.mkdirSync(path.join(root,'previews'),{recursive:true});
for(const m of modules)fs.writeFileSync(path.join(root,'previews',m.id+'.svg'),svg.replace('width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'"','width="'+(m.w+100)+'" height="'+(m.h+100)+'" viewBox="'+(m.x-50)+' '+(m.y-50)+' '+(m.w+100)+' '+(m.h+100)+'"'));
const outdir='/Users/bytedance/Desktop/3.23/产品/codex/HTML/01-进行中';fs.mkdirSync(outdir,{recursive:true});
const template=fs.readFileSync('/Users/bytedance/Desktop/3.23/产品/codex/HTML/00-规范与模板/豆包汽车-画布模板-v15.html','utf8').replace('<!--SVG-->',svg).replace('/*DATA*/','const DATA='+JSON.stringify(meta).replace(/</g,'\\u003c')+';');
const output=path.join(outdir,'豆包汽车-业务全链路-v15.html');fs.writeFileSync(output,template);
fs.writeFileSync(path.join(root,'layout-report.json'),JSON.stringify({labelWarnings,nodes:nodes.size,edges:edges.length},null,2));
console.log(JSON.stringify({output,modules:modules.length,nodes:nodes.size,edges:edges.length,tools:td.tools.length,width:W,height:H,labelWarnings}));

