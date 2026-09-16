import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {toolFamilies,learning} from '../豆包汽车-业务全链路-v11/knowledge.mjs';
import {sources,original30,newMetrics} from './audit-data.mjs';
import {descriptions,additions,groupIntros} from './flow-content.mjs';
import {routeAll,crossed} from '../豆包汽车-业务全链路-v11/routes.mjs';
const dir=path.dirname(fileURLToPath(import.meta.url));
const old=JSON.parse(fs.readFileSync(path.join(dir,'../豆包汽车-业务全链路-v11/graph-v11.json')));
const recent=JSON.parse(fs.readFileSync(path.join(dir,'../豆包汽车-业务全链路-v12/graph-v12.json')));
const ledger=JSON.parse(fs.readFileSync(path.join(dir,'module-crosswalk.json')));
const byRecent=new Map(recent.nodes.map(n=>[n.id,n]));
const G={version:13,width:16600,height:0,groups:[],nodes:[],edges:[],toolFamilies,learning,sources:sources.map(s=>({...s,status:s.read+' '+s.version})),original30,newMetrics,main:['voice','route','rhythm','context','planner','orchestration','execution','output']};
const unit=s=>[...String(s)].reduce((a,c)=>a+(/[\x00-\xff]/.test(c)?.56:1),0);
function wrap(s,w,font=26){let a=[],l='';for(const c of String(s)){if(c==='\n'){a.push(l);l='';continue}if(unit(l+c)*font>w&&l){a.push(l);l=''}l+=c}if(l)a.push(l);return a}
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sourceByGroup=Object.fromEntries(ledger.groupAudit.map(a=>[a.id,a.refs]));
const newByGroup=new Map(additions.map(a=>[a.id,a]));
const futureGroup=new Set(['task','legacy','evolution']);
function oldNode(n){
 const map=ledger.nodeAudit.find(a=>a.id===n.id),extra=(map?.to||[]).flatMap(z=>byRecent.get(z.id)?.paras||[]);
 const paras=[['这个小模块做什么',descriptions[n.id]||n.body.join('；')],['原有职责细节',n.body.join('；')]];
 for(const p of extra)if(!paras.some(z=>z[1]===p[1]))paras.push(p);
 const group=['O1','O2','O3'].includes(n.id)?'execution':n.group;
 return {...n,group,kind:n.role==='decision'?'decision':'step',paras,learn:[n.group],refs:sourceByGroup[n.group]||'本地 SP 快照',future:futureGroup.has(group),detail:descriptions[n.id]||'',oldId:n.id};
}
G.nodes=old.nodes.map(oldNode);
G.nodes.find(n=>n.id==='F1').body=['工具名 + 参数 + 调用归属','具体关联字段以运行协议核验'];
G.nodes.find(n=>n.id==='O5').body=['候选、进度、实际显示与失败','模板卡片；生成界面按方案 / 车型'];
// 非执行性质节点保留，但标为验收/教学，防止误读成在线必经模块。
for(const n of G.nodes)if(['F11','F12','R8','O10'].includes(n.id))n.kind='check';
for(const a of additions)for(const [id,title,input,work,out] of a.nodes)G.nodes.push({id,group:a.id,title,kind:'step',body:[input,work,out],paras:[['输入 / 发生时机',input],['处理与判断',work],['输出 / 异常边界',out]],learn:[a.id==='rhythm'?'voice':a.id==='dynamic'?'orchestration':a.id==='memory'?'context':'signals'],refs:a.refs.join(','),future:!!a.future||id==='MI2',fresh:true});
const byId=new Map(G.nodes.map(n=>[n.id,n]));
// 正文恢复长说明；旧 Task / Advisor / Goal 节点仍各自独立。
for(const n of G.nodes)if(!n.detail&&!n.fresh&&!/^T\d/.test(n.id)&&!/^IN|^OUT|^M\d/.test(n.id)){
 const para=n.paras.find(([k,v],i)=>i>1&&v.length>40);if(para)n.detail=para[1];
}
// 图面不重复塞入同一模块的大段总论；保留到点击后的逐段说明。
for(const n of G.nodes){if(n.detail?.length>165)n.detail=n.detail.slice(0,165).replace(/[^。；]*$/,'');if(!n.detail)n.detail='';}
for(let fi=0;fi<toolFamilies.length;fi++)for(const t of toolFamilies[fi].tools){
 const a=byId.get('T'+t.n),b=byId.get('T'+t.n+'m'),c=byId.get('T'+t.n+'r');
 Object.assign(a,{title:t.n+'. '+t.cn,body:[t.name,...t.input],detail:'本轮工具入口：先明确操作对象、输入语义和适用范围。',paras:[['工具入口',t.name],['输入',t.input.join('；')],['内部处理',t.mechanism.join(' → ')],['结果与边界',t.result.join('；')]]});
 Object.assign(b,{title:'内部业务处理',body:t.mechanism,detail:'按该工具契约处理；具体模型、服务与 SDK 的当前实现需以运行接口核验。'});
 Object.assign(c,{title:'结果、状态与限制',body:t.result,detail:t.write?'存在副作用：受理与真实生效分开；超时先确认状态，再决定是否重试。':'将查到的事实/候选交回原调用；无结果、过期或不确定要明确返回。'});
}
// 平面布局：八列主链，一行控制/任务，下一行端侧/数据，最后逐工具展开。
const col=i=>180+i*2040, GW=1740,topY=500,mainY=4750,lowerY=9200,toolY=13200;
const placements=[
 ['config',0,topY],['cloud-trigger',1,topY],['task',2,topY],['legacy',3,topY],['advisor',4,topY],['knowledge',5,topY],['evolution',6,topY],['multi-input',7,topY],
 ...G.main.map((id,i)=>[id,i,mainY]),
 ['fast',0,lowerY],['signals',1,lowerY],['cloud-state',2,lowerY],['events',3,lowerY],['memory',4,lowerY],['dynamic',5,lowerY],['visible-ui',6,lowerY],['end-trigger',7,lowerY]
];
function linesFor(n,w){
 const title=wrap(n.title,w-52,30),body=n.body.flatMap(x=>wrap(x,w-52,25));
 const detail=n.detail?wrap(n.detail,w-52,25):[];
 return {title,body,detail,height:54+title.length*39+22+body.length*36+(detail.length?26+detail.length*36:0)+34};
}
function groupTitle(id){return id==='execution'?'28 实际业务执行与状态回读':id==='output'?'23 / 26–29 交互输出与用户回流':newByGroup.get(id)?.title||old.groups.find(g=>g.id===id)?.title||id}
function layoutRegular(id,x,y,w=GW){
 const ns=G.nodes.filter(n=>n.group===id),a=newByGroup.get(id),g={id,title:groupTitle(id),x,y,w,h:0,future:futureGroup.has(id),intro:groupIntros[id]||a?.nodes?.[0]?.[2]||'独立业务分区；沿箭头查看各个处理环节。',learn:[id],refs:a?.refs||sourceByGroup[id]};
 const nw=(w-220)/2, starts=[];let yy=y+235;
 for(let i=0;i<ns.length;i+=2){const pair=ns.slice(i,i+2);const row=pair.map(n=>linesFor(n,nw)),h=Math.max(...row.map(l=>l.height),390);
  pair.forEach((n,j)=>{const r=i/2,ci=r%2?1-j:j;Object.assign(n,{x:x+70+ci*(nw+80),y:yy,w:nw,h,layout:row[j]});});starts.push(yy);yy+=h+138;
 }
 g.h=yy-y+145;G.groups.push(g);return g;
}
for(const [id,c,y] of placements)layoutRegular(id,col(c),y);
// 工具分成输入、内部机制、结果三列；每一行完整对应同一工具。
for(let fi=0;fi<6;fi++){
 const id='family-'+fi,x=180+fi*2690,w=2370,g={id,title:old.groups.find(g=>g.id===id).title,x,y:toolY,w,h:0,intro:'选中工具 → 输入及前置 → 领域内部处理 → 结果与边界 → 返回原调用。',learn:['orchestration'],refs:'本地 sp.md 中 27 项唯一工具定义快照'};
 let yy=toolY+235;const put=(n,xx,ww,hmin=220)=>{const l=linesFor(n,ww);Object.assign(n,{x:xx,y:yy,w:ww,h:Math.max(hmin,l.height),layout:l});return n.h};
 yy+=put(byId.get('IN'+fi),x+70,w-140)+130;
 for(const t of toolFamilies[fi].tools){const ids=['T'+t.n,'T'+t.n+'m','T'+t.n+'r'],ww=(w-280)/3;let h=0;ids.forEach((nid,i)=>{const n=byId.get(nid);h=Math.max(h,put(n,x+70+i*(ww+70),ww,530));});ids.forEach(id=>byId.get(id).h=h);yy+=h+120;}
 const m=byId.get('M'+fi);if(m){yy+=put(m,x+70,w-140)+100;}
 yy+=put(byId.get('OUT'+fi),x+70,w-140)+180;g.h=yy-toolY;G.groups.push(g);
}
const lastY=Math.max(...G.groups.map(g=>g.y+g.h))+500;
layoutRegular('case',180,lastY,7770);layoutRegular('learning',8290,lastY,8030);
G.height=Math.max(...G.groups.map(g=>g.y+g.h))+300;
const groupById=new Map(G.groups.map(g=>[g.id,g]));
// 每条保留连线都重新确定语义与坐标，替换已纠正的跨区关系。
const remove=new Set(['R5>X8','R6>X1','F9>X8','A4>X1','A5>X1','H6>X1','K8>X1','S2>X2','S2>G2','V8>P12','O5>X8','O8>X8','U9>X8']);
let ei=0;
function edge(from,to,label='',kind='flow'){if(!byId.has(from)||!byId.has(to))throw Error('无端点 '+from+' '+to);if(G.edges.some(e=>e.from===from&&e.to===to))return;G.edges.push({id:'E'+String(++ei).padStart(3,'0'),from,to,label,description:label||'本模块按箭头进入后续处理；具体分支以节点文字为准。',kind,points:[]});}
for(const e of old.edges){if(remove.has(e.from+'>'+e.to))continue;const a=byId.get(e.from),b=byId.get(e.to);edge(e.from,e.to,e.label||'',a.group===b.group?'inside':/回|结果/.test(e.label)?'return':a.group.startsWith('family')||b.group.startsWith('family')?'expand':'flow');}
for(const a of additions){const ids=a.nodes.map(n=>n[0]);if(a.id==='events'){[['EV1','EV2'],['EV2','EV3'],['EV3','EV4'],['EV4','EV5'],['EV4','EV6'],['EV4','EV7'],['EV4','EV8']].forEach(p=>edge(...p,'按定义分发，消费者并行','inside'));}
 else if(a.id==='rhythm'){[['IM1','IM2'],['IM2','IM3'],['IM2','IM4'],['IM3','IM5'],['IM4','IM5'],['IM6','IM1']].forEach(p=>edge(...p,'按输入与当前状态选支路','inside'));}
 else if(a.id==='evolution'){[['RF1','RF2'],['RF2','RF3'],['RF3','RF6'],['RF4','RF6'],['RF5','RF6']].forEach(p=>edge(...p,'规划中的支撑/改进关系','planned'));}
 else if(a.id==='knowledge'){[['KN4','KN1'],['KN4','KN2'],['KN4','KN3']].forEach(p=>edge(...p,'版本化配置分别生效','inside'));}
 else if(a.id==='cloud-state'){[['CS1','CS2'],['CS2','CS3'],['CS2','CS4']].forEach(p=>edge(...p,'按消费者需要分发','inside'));}
 else if(a.id==='multi-input'){}else for(let i=0;i<ids.length-1;i++){if(a.id==='dynamic'&&ids[i]==='DY3')continue;edge(ids[i],ids[i+1],'','inside');}}
const newEdges=[
 ['R6','IM1','复杂 Query 进入统一准入'],['F9','IM1','tool_feedback 关联原轮次后再入场','return'],['A4','IM1','有效主动建议进入同一入口'],['A5','IM1','采纳或拒绝关联原建议'],['H6','IM1','旧目标建议回规划'],['K8','IM1','新任务：需要规划时恢复'],
 ['IM5','X1','已准入的本轮输入'],['IM4','P12','明确取消目标交决策与所属业务','return'],['V8','IM1','续说 / 插话 / 改目标'],['MI1','IM1','明确主动请求'],['MI1','EV1','已经发生的手动操作事实'],['MI2','IM1','有授权的跨设备请求','planned'],
 ['R5','EV1','允许留存的拒识背景事件'],['S2','CS1','按协议上报端状态'],['CS3','G2','为条件求值提供事实'],['CS3','X2','当前车况快照'],['CS4','EV1','定义范围内的状态变化'],['EV5','X2','相关事件事实，非自动推理','planned'],['EV6','ME2','并行：归属后生成记忆'],['EV7','IM6','并行：通知接入策略待对齐','planned'],
 ['V5','ME1','可用身份 / 音区信息'],['ME4','X3','适用记忆进入本轮'],['T14r','ME3','明确更正的后续记忆处理','return'],['KN1','X5','可用工具与车型约束'],['KN2','X5','场景方法，不是状态'],['KN3','X5','本轮检索示例'],['KN4','C1','版本化能力配置','planned'],
 ['U2','DY1','有效卡片随本轮 Query 传参'],['V7','DY1','只有新 Query 才携带本轮页面参数'],['DY3','X5','条件命中后注入工具'],['P4','DY4','Planner 选择页内语义工具'],['DY7','U9','回原业务按钮逻辑'],['DY8','IM1','关联结果回当前目标','return'],['U9','X8','点击结果更新本轮事实','return'],['O8','K2','Task 页面操作回任务入口'],['O5','X8','候选 / 页面事件回上下文','return'],
 ['O3','EV1','可记录的真实执行/状态事实'],['F8','RF1','运行结果与 badcase','planned'],['RF2','KN4','建议经评测发布再生效','planned'],['RF4','A1','规划中的主动追问候选','planned'],['RF5','F5','规划中的领域能力扩展','planned'],['P8','O10','逐目标完成证据核对'],['O10','O9','用户结果与真实完成一致'],['O12','O9','失败 / 等待 / 部分成功也有输出'],
 ['IN1','M1','工具依赖说明，不是一次调用步骤','expand'],['IN3','M3','身份与记忆边界展开','expand'],['IN4','M4','不同事实来源的对照说明','expand'],['IN5','M5','三种视觉路径的对照说明','expand'],
 ['P1','L1','主责模块的掌握与验收要求','expand'],['F5','L2','相邻模块的契约与责任边界','expand'],['O9','L3','用真实目标检验 AI 产品能力','expand'],['V1','Z1','案例阅读映射，不是运行旁路','expand']
];newEdges.forEach(e=>edge(...e));
// 为旧图的长期路径和新设计连线保留版本边界，不暗示同一请求同时进入两套任务系统。
for(const e of G.edges)if(futureGroup.has(byId.get(e.from).group)||futureGroup.has(byId.get(e.to).group))if(e.kind!=='inside')e.kind='planned';
// 路由分层：组内精细避障，跨组只走组外通道，再经专用端口进入小模块。
// 跨组不会穿过第三方分区；交叉处仅经过，没有连接点，点击线可单独追踪。
const cross=G.edges.filter(e=>byId.get(e.from).group!==byId.get(e.to).group),locals=G.edges.filter(e=>byId.get(e.from).group===byId.get(e.to).group);
let portCount=new Map();const portByEdge=new Map();
function port(n,e,which){const g=groupById.get(n.group),k=g.id,count=portCount.get(k)||0;portCount.set(k,count+1);const right=which==='out';const xx=right?g.x+g.w+24:g.x-34;const yy=g.y+245+count*64;
 const p={id:'PORT-'+e.id+'-'+which,group:g.id,x:xx,y:yy,w:10,h:10,title:e.label,kind:'port'};return p;}
for(const e of cross){const a=port(byId.get(e.from),e,'out'),b=port(byId.get(e.to),e,'in');portByEdge.set(e.id,{a,b});}
for(const g of G.groups){const ns=G.nodes.filter(n=>n.group===g.id),ps=[],es=locals.filter(e=>byId.get(e.from).group===g.id);
 for(const e of cross){const p=portByEdge.get(e.id);if(p.a.group===g.id){ps.push(p.a);es.push({id:e.id+'-a',from:e.from,to:p.a.id,kind:'portlink',points:[]});}if(p.b.group===g.id){ps.push(p.b);es.push({id:e.id+'-b',from:p.b.id,to:e.to,kind:'portlink',points:[]});}}
 // 路由器的分区边界只用于障碍；端口在两侧保留的空白内。
 const routingGroup={...g,x:g.x-60,w:g.w+120,y:g.y,h:g.h+160};
 routeAll({width:G.width,height:G.height,nodes:[...ns,...ps],groups:[routingGroup],edges:es});
 for(const e of es)if(e.kind==='portlink'){const p=portByEdge.get(e.id.slice(0,-2));p[e.id.endsWith('-a')?'leadA':'leadB']=e.points;}
}
// 简化的全局网格最短路，只把分区看成障碍；避免以几百个文字框建巨网格。
function globalRoute(start,end,i){
 const margin=38+(i%7)*13,obs=G.groups.map(g=>({x:g.x-margin,y:g.y-30,w:g.w+margin*2,h:g.h+60}));
 const fromG=groupById.get(byId.get(cross[i].from).group),toG=groupById.get(byId.get(cross[i].to).group);
 const s=[fromG.x+fromG.w+margin+8,start[1]],t=[toG.x-margin-8,end[1]];
 const xs=[...new Set([50,G.width-50,s[0],t[0],...obs.flatMap(r=>[r.x-8,r.x+r.w+8])])].sort((a,b)=>a-b);
 const ys=[...new Set([320,G.height-60,s[1],t[1],...obs.flatMap(r=>[r.y-8,r.y+r.h+8])])].sort((a,b)=>a-b),nx=xs.length;
 const inside=(x,y)=>obs.some(r=>x>r.x&&x<r.x+r.w&&y>r.y&&y<r.y+r.h);
 const si=ys.indexOf(s[1])*nx+xs.indexOf(s[0]),ti=ys.indexOf(t[1])*nx+xs.indexOf(t[0]),dist=new Map([[si,0]]),prev=new Map(),open=new Set([si]),closed=new Set();
 while(open.size){let cur=-1,best=Infinity;for(const z of open){const x=xs[z%nx],y=ys[Math.floor(z/nx)],f=dist.get(z)+Math.abs(x-t[0])+Math.abs(y-t[1]);if(f<best){best=f;cur=z;}}
  if(cur===ti)break;open.delete(cur);closed.add(cur);const x=cur%nx,y=Math.floor(cur/nx),a=[xs[x],ys[y]];
  for(const [xx,yy] of [[x-1,y],[x+1,y],[x,y-1],[x,y+1]]){if(xx<0||xx>=nx||yy<0||yy>=ys.length)continue;const z=yy*nx+xx,b=[xs[xx],ys[yy]];if(closed.has(z)||inside(...b)||obs.some(r=>crossed(a,b,r)))continue;const d=dist.get(cur)+Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])+2;if(d<(dist.get(z)??Infinity)){dist.set(z,d);prev.set(z,cur);open.add(z);}}
 }
 if(!dist.has(ti))throw Error('跨分区无路径 '+cross[i].id);
 const p=[];for(let z=ti;z!==undefined;z=prev.get(z))p.push([xs[z%nx],ys[Math.floor(z/nx)]]);return [start,s,...p.reverse(),t,end];
}
function simplify(a){const out=[];for(const p of a){if(out.length&&p[0]===out.at(-1)[0]&&p[1]===out.at(-1)[1])continue;while(out.length>1&&((p[0]===out.at(-1)[0]&&p[0]===out.at(-2)[0])||(p[1]===out.at(-1)[1]&&p[1]===out.at(-2)[1])))out.pop();out.push(p);}return out;}
cross.forEach((e,i)=>{const p=portByEdge.get(e.id);e.points=simplify([...p.leadA,...globalRoute(p.leadA.at(-1),p.leadB[0],i),...p.leadB]);e.cross=true;});
// 检查正交性、非端点文字框穿线和完整旧节点保全。
const violations=[];for(const e of G.edges)for(let i=1;i<e.points.length;i++){const a=e.points[i-1],b=e.points[i];if(a[0]!==b[0]&&a[1]!==b[1])violations.push(e.id+':diagonal');for(const n of G.nodes)if(n.id!==e.from&&n.id!==e.to&&crossed(a,b,n))violations.push(e.id+':cross:'+n.id);}
if(violations.length)throw Error(violations.slice(0,30).join('\n'));
const overlaps=[];for(let i=0;i<G.groups.length;i++)for(let j=i+1;j<G.groups.length;j++){const a=G.groups[i],b=G.groups[j];if(a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y)overlaps.push(a.id+'/'+b.id)}if(overlaps.length)throw Error('分区重叠 '+overlaps.join(','));
G.cases=[
 {id:'full',title:'语音主链：从 Query 到真实结果',nodes:['V1','V2','V3','V4','V5','V6','V7','R1','R2','R3','R6','IM1','IM2','IM3','IM5','X1','X2','X3','X4','X5','X6','X7','P1','P2','P3','P4','P5','F1','F2','F3','F4','F5','F6','O1','O2','O3','F7','F8','F9','IM1','X8','X7','P7','P8','P9','O4','O5','O6','O9']},
 {id:'example',title:'案例：我热，去昨天游泳馆',nodes:['V1','V7','R6','IM5','X7','P1','P2','P3','T1','T1m','T1r','T12','T12m','T12r','P7','P10','P11','T6','T6m','T6r','T7','T7m','T7r','O3','P8','P9','O9']},
 {id:'fast',title:'端侧简单车控 / 超时兜底',nodes:['V7','D1','D2','D5','D6','O1','O2','O3','D8','O9','D3','R1','R7','D7','D4']},
 {id:'wait',title:'未来目标：旧 Goal 或新 Task',nodes:['P6','H1','H2','H3','H4','G1','G6','H5','H6','IM1','K1','K2','K3','K4','K5','K6','G1','G6','K7','K8','K9','K10','K11','K12','O7']},
 {id:'trigger',title:'规则配置 → 端云条件 → 执行',nodes:['C1','C2','C3','C4','C5','C6','E1','E2','E3','E4','E5','E6','E7','O1','O3','E8','G1','G2','G3','G4','G5','G6']},
 {id:'data',title:'状态 / 事件 / 记忆怎样供给模型',nodes:['S1','S2','CS1','CS2','CS3','CS4','EV1','EV2','EV3','EV4','EV5','X2','EV6','ME2','ME3','ME4','X3','EV7','IM6','X7']},
 {id:'card',title:'卡片：本地匹配与云端语义两路',nodes:['O5','U1','U2','U3','U4','U5','U6','U7','U8','U9','U10','DY1','DY2','DY3','X5','P4','DY4','DY5','DY6','DY7','DY8','O1','O3']},
 {id:'vision',title:'按需 VQA / 默认感知 / 动态观察',nodes:['T26','T26m','S3','S4','T26r','P7','S5','X2','K6','S6','S7','G3','G6','K7','S8','K9']},
 {id:'cancel',title:'澄清、取消、失败与恢复',nodes:['P2','P10','O4','V8','IM1','IM4','P12','K1','K2','K4','F10','F7','F8','F9','P7','P8','O12','O9']}
];
G.mainSteps=G.cases[0].nodes;G.layout={mainY,lowerY,toolY};G.coverage={oldNodes:old.nodes.length,preservedOldNodes:G.nodes.filter(n=>n.oldId).length,newNodes:G.nodes.filter(n=>n.fresh).length,groups:G.groups.length,edges:G.edges.length,crossEdges:cross.length,violations:0};
// 可编辑原生 SVG：每个句子保留文字，不转图片；箭头是原生连接器。
const s=[];function text(x,y,v,font=26,color='#203947',weight=450){s.push(`<text x="${x}" y="${y}" font-size="${font}px" fill="${color}" font-weight="${weight}">${esc(v)}</text>`)}
function rect(x,y,w,h,fill,stroke,sw=2,more=''){s.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" ${more}/>`)}
s.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${G.width}" height="${G.height}" viewBox="0 0 ${G.width} ${G.height}"><defs><marker id="arrow" markerWidth="12" markerHeight="12" refX="9" refY="4" orient="auto" markerUnits="strokeWidth"><path d="M0 0 L10 4 L0 8 z" fill="#185DB7"/></marker></defs>`);
rect(0,0,G.width,G.height,'#FFFFFF','#FFFFFF');text(180,125,'豆包汽车 · 从用户语音到真实结果的业务全链路',64,'#0D4FA8',750);text(180,205,'语音输入 → 分流与准入 → Context → Planner / Director → 工具 / 业务执行 → 结果回流 → 语音、界面与用户反馈',36,'#0D4FA8',550);text(180,277,'蓝色实线：业务处理 / 数据传递　　灰绿回线：结果回流　　虚线：版本方案或机制展开　　交叉无节点：仅经过，不相连',29,'#486579');
for(const g of G.groups){rect(g.x,g.y,g.w,g.h,'#FFFFFF',g.future?'#8E9179':'#B3C6DA',3,g.future?'stroke-dasharray="14 9"':'');rect(g.x,g.y,g.w,112,g.future?'#F4F2EE':'#EEF4FB',g.future?'#8E9179':'#185DB7',2);wrap(g.title,g.w-72,37).forEach((l,i)=>text(g.x+36,g.y+48+i*45,l,37,'#0D4FA8',750));wrap(g.intro,g.w-110,25).slice(0,2).forEach((l,i)=>text(g.x+55,g.y+159+i*35,l,25,'#486579'));}
for(const e of G.edges){const color=e.kind==='return'?'#72765B':e.kind==='planned'?'#8E9179':e.kind==='expand'?'#7D94AA':'#185DB7';const sw=e.cross?4:3;const points=e.points.map(p=>p.join(',')).join(' ');if(e.cross)s.push(`<polyline points="${points}" fill="none" stroke="#FFFFFF" stroke-width="10"/>`);s.push(`<polyline data-edge-id="${e.id}" points="${points}" fill="none" stroke="${color}" stroke-width="${sw}"${['planned','expand'].includes(e.kind)?' stroke-dasharray="13 8"':''} marker-end="url(#arrow)"/>`);}
for(const n of G.nodes){const l=n.layout,decision=n.kind==='decision'||n.title.includes('？'),fill=n.future?'#F4F2EE':decision||n.kind==='check'?'#F7F7F2':'#F3F7FD',stroke=n.future?'#8E9179':'#759CC8';rect(n.x,n.y,n.w,n.h,fill,stroke,2.2,`data-node-id="${n.id}" ${n.future?'stroke-dasharray="10 7"':''}`);let yy=n.y+43;l.title.forEach(z=>{text(n.x+26,yy,z,30,'#0D4FA8',750);yy+=39});yy+=22;l.body.forEach(z=>{text(n.x+26,yy,z,25,'#203947');yy+=36});if(l.detail.length){yy+=29;l.detail.forEach(z=>{text(n.x+26,yy,z,25,'#354F62');yy+=36});}if(yy>n.y+n.h-14)throw Error('文字溢出 '+n.id);}
// 两端重复同一个连接编号；不在拥挤路口放长句。
for(const e of cross){const ps=portByEdge.get(e.id);for(const [p,side] of [[ps.a,'out'],[ps.b,'in']]){const x=side==='out'?p.x+20:p.x-91,y=p.y-13;rect(x-4,y-24,86,30,'#FFFFFF','#FFFFFF',0);text(x,y,e.id,21,e.kind==='return'?'#72765B':'#185DB7',650);}}
s.push('</svg>');fs.writeFileSync(path.join(dir,'业务全链路-v13.svg'),s.join('\n'));fs.writeFileSync(path.join(dir,'graph-v13.json'),JSON.stringify(G,null,2));fs.writeFileSync(path.join(dir,'flow-verification.json'),JSON.stringify(G.coverage,null,2));console.log(JSON.stringify({...G.coverage,width:G.width,height:G.height}));
