import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { toolFamilies, learning } from './knowledge.mjs';
import { routeAll, crossed } from './routes.mjs';

const dir=path.dirname(fileURLToPath(import.meta.url));
const W=10340,H=7090;
const C={ink:'#19354C',sub:'#486579',blue:'#185DB7',bp:'#EEF5FF',green:'#24745C',gp:'#EEF8F2',amber:'#9D6918',ap:'#FFF7E5',purple:'#775394',pp:'#F5F0FA',red:'#B94345',rp:'#FFF1F1',gray:'#6A7680',line:'#BCCBD6',white:'#FFFFFF'};
const tones={blue:[C.blue,C.bp],green:[C.green,C.gp],amber:[C.amber,C.ap],purple:[C.purple,C.pp],red:[C.red,C.rp],gray:[C.gray,'#F5F6F7']};
const graph={width:W,height:H,groups:[],nodes:[],edges:[],learning,tools:toolFamilies};
const B=[],E=[],N=[],L=[];
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function txt(layer,x,y,s,size=20,fill=C.ink,weight=500,anchor='start'){layer.push(`<text x="${x}" y="${y}" font-size="${size}px" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${esc(s)}</text>`)}
function box(layer,x,y,w,h,fill,stroke,sw=2,rx=8,dash=''){layer.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash?` stroke-dasharray="${dash}"`:''}/>`)}
function units(s){return [...s].reduce((a,c)=>a+(/[\x00-\xff]/.test(c)?.57:1),0)}
function wrap(s,width,size){let out=[],line='';for(const c of String(s)){if(c==='\n'){out.push(line);line='';continue}if(units(line+c)*size>width&&line){out.push(line);line=''}line+=c}if(line)out.push(line);return out}
function group(id,title,x,y,w,h,opts={}){
 const [stroke,fill]=tones[opts.tone||'blue'];const g={id,title,x,y,w,h,...opts};graph.groups.push(g);
 box(B,x,y,w,h,C.white,stroke,2.5,10,opts.future?'10 6':'');box(B,x,y,w,68,fill,stroke,2,10);
 txt(N,x+20,y+43,title,28,stroke,750);
 if(opts.status&&units(title)*28+units(opts.status)*19+70<w)txt(N,x+w-20,y+43,opts.status,19,stroke,650,'end');
 return g;
}
function node(id,g,x,y,w,h,title,body=[],opts={}){
 const [stroke,fill]=tones[opts.tone||'blue'];const info={id,group:typeof g==='string'?g:g.id,x,y,w,h,title,body,role:opts.role||'step',tone:opts.tone||'blue',...opts};graph.nodes.push(info);
 const titles=wrap(title,w-30,opts.titleSize||22), lines=body.flatMap(s=>wrap(s,w-30,opts.size||19));
 let th=titles.length*27;let needed=lines.length?23+th+9+(lines.length-1)*26+(opts.size||19)*.3+14:26+(titles.length-1)*27+(opts.titleSize||22)*.3+14;
 if(needed>h)throw Error(`文字超高 ${id}: need ${needed}, h ${h}`);
 box(N,x,y,w,h,opts.role==='decision'?C.ap:fill,opts.role==='decision'?C.amber:stroke,opts.main?3.5:1.8,opts.role==='decision'?3:7,opts.future?'8 5':'');
 N[N.length-1]=N[N.length-1].replace('<rect ',`<rect data-node-id="${id}" `);
 titles.forEach((s,i)=>txt(N,x+15,y+26+i*27,s,opts.titleSize||22,stroke,750));
 lines.forEach((s,i)=>txt(N,x+15,y+23+th+9+i*26,s,opts.size||19,C.ink,500));
 return id;
}
function at(id){const n=graph.nodes.find(n=>n.id===id);if(!n)throw Error('未知节点 '+id);return n}
function p(id,side){const n=at(id);return side==='l'?[n.x,n.y+n.h/2]:side==='r'?[n.x+n.w,n.y+n.h/2]:side==='t'?[n.x+n.w/2,n.y]:[n.x+n.w/2,n.y+n.h]}
function edge(a,b,opts={}){
 const na=at(a),nb=at(b);let sa=opts.sa||((nb.x>=na.x+na.w)?'r':nb.x+nb.w<=na.x?'l':nb.y>na.y?'b':'t');let ta=opts.ta||({r:'l',l:'r',t:'b',b:'t'}[sa]);
 const start=p(a,sa),end=p(b,ta);let pts=[start];
 if(opts.via)pts.push(...opts.via);else if(start[0]!==end[0]&&start[1]!==end[1]){if(sa==='r'||sa==='l'){const mx=(start[0]+end[0])/2;pts.push([mx,start[1]],[mx,end[1]])}else{const my=(start[1]+end[1])/2;pts.push([start[0],my],[end[0],my])}}
 pts.push(end);pts=pts.filter((q,i)=>!i||q[0]!==pts[i-1][0]||q[1]!==pts[i-1][1]);
 const color=tones[opts.tone||'blue'][0]; const item={from:a,to:b,points:pts,label:opts.label||'',...opts};graph.edges.push(item);
 E.push(`<polyline data-from="${a}" data-to="${b}" points="${pts.map(q=>q.join(',')).join(' ')}" fill="none" stroke="${color}" stroke-width="${opts.main?4.5:2.5}"${opts.dash?' stroke-dasharray="9 6"':''} marker-end="url(#arrow)"/>`);
 if(opts.label){const q=opts.labelAt||pts[Math.max(0,Math.floor((pts.length-1)/2))];const width=units(opts.label)*18+20;box(L,q[0]-width/2,q[1]-15,width,30,C.white,C.white,0,3);txt(L,q[0],q[1]+6,opts.label,18,color,650,'middle')}
}
function chain(ids,opts={}){ids.slice(1).forEach((id,i)=>edge(ids[i],id,opts))}
function grid(g,prefix,items,{cols=2,y=100,rowH=190,nodeH=145,gap=56,margin=36,tone='blue',future=false}={}){
 const nw=(g.w-margin*2-gap*(cols-1))/cols, ids=[];
 items.forEach((it,i)=>{const row=Math.floor(i/cols),raw=i%cols,col=row%2===0?raw:cols-1-raw;const id=it.id||`${prefix}${i+1}`;node(id,g,g.x+margin+col*(nw+gap),g.y+y+row*rowH,nw,nodeH,it[0],it[1]||[],{tone,future,...it[2]});ids.push(id)});
 return ids;
}
function note(g,lines){const y=g.y+g.h-96;E.push(`<line x1="${g.x+18}" y1="${y-18}" x2="${g.x+g.w-18}" y2="${y-18}" stroke="${C.line}" stroke-width="1.4"/>`);lines.forEach((s,i)=>txt(N,g.x+22,y+8+i*29,s,20,C.sub,550))}

box(B,0,0,W,H,C.white,C.white,0,0);
txt(N,70,62,'豆包汽车 · 语音请求到真实结果',44,C.ink,800);
txt(N,70,111,'先看粗蓝线：语音 → 端云分流 → Planner 决策 → 工具执行；再沿绿线：结果回流 → 再判断 → 用户结果',24,C.blue,650);
txt(N,6440,55,'蓝：请求/调用   绿：结果/状态   橙：判断/等待',22,C.sub,600);
txt(N,6440,97,'实线：资料中的业务契约   紫虚线：演进方案   红：异常/未闭合',22,C.sub,600);

// 云端：配置与异步任务围绕主链工作，所有子模块保留独立连接。
const cfg=group('config','13 规则与能力配置',70,190,1670,810,{status:'控制面',tone:'gray'});
let ids=grid(cfg,'C',[
 ['13.1 业务场景与适用范围',['车型 / 环境 / 版本','输入：明确触发条件和动作']],
 ['13.2 信号与动作注册',['signal / action 字典','校验类型、单位和能力范围']],
 ['13.3 条件表达与执行策略',['条件组合、持续时间、次数','冷却、优先级、适用范围']],
 ['13.4 发布校验',['格式 / 可感知 / 可执行','不可满足 → 返回配置失败'],{role:'decision'}],
 ['13.5 云端注册 / 更新',['注册场景与回调目标','记录配置状态及版本']],
 ['13.6 端侧配置同步',['规则下发、读取当前版本','热更新范围按版本核验']]
],{cols:2,rowH:196,nodeH:150});chain(ids);
note(cfg,['要会问：谁维护信号/动作？不同车型是否隔离？','验收：非法配置拦截、版本一致、回滚是否生效。']);

const trg=group('cloud-trigger','15 云端条件触发器',1840,190,1760,810,{status:'规则契约',tone:'amber'});
ids=grid(trg,'G',[
 ['15.1 接收规则订阅',['Task/旧动态 Advisor 注册','定时 / 周期 / 条件 / 视觉']],
 ['15.2 取得观察事实',['云信号库 / 端状态快照','视觉只读对应 task 的结果']],
 ['15.3 条件求值',['结构条件 → 比较 / 组合','视觉描述 → 语义 Y/N'],{role:'decision'}],
 ['15.4 命中与抑制',['范围 / 过期 / 冷却 / 去重','未命中：保留订阅继续观察'],{role:'decision'}],
 ['15.5 形成触发事件',['原任务 + 条件已满足','绑定 task_id / callback_id']],
 ['15.6 回调任务方',['触发 ≠ 动作已执行','按目标来源回旧链或新 Task','不是把一个命中发给两套执行']]
],{cols:2,rowH:196,nodeH:150,tone:'amber'});chain(ids);
edge('G4','G2',{sa:'r',ta:'r',via:[[3570,661],[3570,365]],label:'否：继续观察',labelAt:[3570,510],tone:'gray'});
note(trg,['要会问：命中一次怎样避免重复？取消后还会回调吗？','验收：误触发、漏触发、重复触发、命中到回调延迟。']);

const task=group('task','17–18 异步任务：Task Service',3700,190,3920,810,{status:'新方案 / 旧 Goal 链迁移',tone:'purple',future:true});
ids=grid(task,'K',[
 ['17.1 Task Agent 入口',['Planner 透传任务文本','入口不负责生成任务定义']],
 ['17.2 Ingress 接入',['恢复请求关联、幂等校验','语义请求 / 事件 / 查询分流']],
 ['17.3 Spec Builder',['模型识别创建/修改/取消','生成目标、条件、执行文本']],
 ['17.4 Manager 管理',['条件合理性、数量与冲突','创建/更新/取消生命周期']],
 ['17.5 Repository 存储',['Task / Run / Event / Binding','事务保存状态与外部关联']],
 ['17.6 Trigger Adapter',['规则转换、注册/取消订阅','waiting：等待触发事件']],
 ['17.7 激活与执行前判断',['回调去重 → 创建本次 Run','读取当前车况，决定做/跳过'],{role:'decision'}],
 ['17.8 Runtime 分发',['通用 → Planner / Agent','生态 → GUI/Provider 内部步骤']],
 ['17.9 Result Hook 回写',['结构化执行结果可靠回写','重试/补偿；不只靠 afterFlow']],
 ['17.10 结束还是再等？',['一次完成/取消 → closed','周期未结束 → waiting'],{role:'decision'}],
 ['18.1 Task Query',['生成只读 TaskView','任务状态供 Planner/HMI 查询']],
 ['18.2 Message Dispatcher',['状态变化 → 消息通道','Frontier / SSE → 车端任务中心']]
],{cols:4,rowH:196,nodeH:150,gap:56,tone:'purple',future:true});
chain(ids.slice(0,6),{tone:'purple',dash:true});chain(['K7','K8','K9','K10'],{tone:'purple',dash:true});chain(['K5','K11','K12'],{tone:'purple',dash:true});
edge('K10','K6',{tone:'purple',dash:true,sa:'b',ta:'b',via:[[5196,897],[5146,897],[5146,758],[5068,758]],label:'周期继续',labelAt:[5150,872]});
note(task,['旧链：goal_list_update → Goal List → 动态 Advisor → Trigger → 给 Planner 建议；Task 是迁移方向，不能把两套都写成当前唯一实现。','Task：waiting / running / closed；一次 Run：成功 / 失败 / 跳过 / 取消；等待用户或外部结果仍可能属于 running。']);

const adv=group('advisor','16 静态 Advisor：主动建议',7720,190,2410,810,{status:'独立主动服务',tone:'amber'});
ids=grid(adv,'A',[
 ['16.1 场景变化输入',['人 / 车 / 环境 / 记忆','默认视觉与历史交互']],
 ['16.2 四类场景推理',['舒适 / 出行 / 情感 / 内容','识别此时能帮助用户什么']],
 ['16.3 是否值得打扰？',['总开关、时机、频控、去重','用户当前 Query 优先'],{role:'decision'}],
 ['16.4 建议与交互等级',['给 Planner 建议，或 AI Bar','提议不等于执行成功']],
 ['16.5 用户接受/拒绝',['接受 → 对应业务调用','拒绝 → 记录，不反复打扰'],{role:'decision'}],
 ['16.6 结果与效果反馈',['实际行为、采纳与打扰','结果同步上下文，便于后续判断']]
],{cols:2,rowH:196,nodeH:150,tone:'amber'});chain(ids);
note(adv,['要会问：用户没说话时为什么触发？谁决定说、显示和执行？','验收：有效建议采纳率、负向打扰率、重复建议率。']);

// 云端核心决策链。
const route=group('route','9 拒识、意图与简单复杂分流',70,1160,1810,920,{status:'Director PRD 基线'});
ids=grid(route,'R',[
 ['9.1 云端收到本轮 Query',['文本 + 说话人 + 位置','与端侧候选存在并行计算']],
 ['9.2 是否对助手说？',['拒识：人与人对话/无效输入','拒识超时按 PRD 进入 Director'],{role:'decision'}],
 ['9.3 车控 + 指定意图？',['未拒识且满足约定意图','命中 → 云端 FC；否则 Planner'],{role:'decision'}],
 ['9.4 云端 FC 理解',['明确指令 → 原子动作候选','送端云仲裁，不能重复执行']],
 ['9.5 拒识内容入日志',['作为事件 / 对话背景','不是直接给助手的执行指令'],{tone:'gray'}],
 ['9.6 复杂请求转 Planner',['条件 / 持续 / 记忆 / 情景','需要推理、查信息或跨工具']],
 ['9.7 云端无结果？',['超时且端候选可用 → 端兜底','都无结果 → 明确失败/再问'],{role:'decision'}],
 ['9.8 路由结果可追踪',['命中路径、候选、等待时长','以实车 Trace 核对车型策略']]
],{cols:2,rowH:167,nodeH:143});chain(['R1','R2']);edge('R2','R3',{label:'不拒识',labelAt:[1450,1444]});edge('R3','R4',{label:'是',labelAt:[975,1500]});edge('R3','R6',{label:'否',labelAt:[1410,1610]});edge('R2','R5',{sa:'l',ta:'l',via:[[961,1331],[961,1740]],tone:'gray',label:'拒识',labelAt:[961,1630]});
note(route,['要会问：“十分钟后关加热”为什么不能被简单车控过召？','验收：复杂误分简单率、快路误执行、拒识错误与端云双执行。']);

const ctx=group('context','19 / 21 入口组装与 Context',1980,1160,2090,920,{status:'现有输入 + 治理方案'});
ids=grid(ctx,'X',[
 ['19.1 接入本轮事件',['user_query / advisor','tool_feedback / event']],
 ['21.1 车况、感知与事件',['端侧全量/增量状态、时间','手动操作、导航、媒体状态']],
 ['21.2 记忆与当前目标',['用户身份/偏好/历史事实','旧 Goal List / 新 TaskView']],
 ['21.3 对话历史',['近轮保留动作和工具结果','远区压缩方案须保留未完事项']],
 ['19.2 有效工具与示例',['按车型/环境/版本装配能力','动态示例、场景 knowhow']],
 ['21.4 筛选与新鲜度',['身份正确？状态过期/冲突？','缺失不补造；按需查工具'],{role:'decision',future:true}],
 ['19.3 组装模型输入',['系统规则 SP + 当前输入 UP','带上本轮事实、历史与可用工具']],
 ['21.5 形成下一轮上下文',['收工具反馈和手动操作事件','保留部分完成与待选结果'],{tone:'green'}]
],{cols:2,rowH:167,nodeH:143});chain(['X1','X2','X3','X4','X5','X6','X7']);edge('X8','X7',{tone:'green'});
note(ctx,['要会问：模型当时到底看到了什么？新状态是否被旧历史覆盖？','验收：必要事实覆盖、状态新鲜度、记忆隔离、压缩保真与输入长度。']);

const pl=group('planner','20 Planner / Director：同一个决策模块',4170,1160,3110,920,{status:'思考 → 行动 → 观察 → 再判断'});
ids=grid(pl,'P',[
 ['20.1 理解完整诉求',['解析对象、动作、约束和时间','例：降温 + 去昨天的游泳馆']],
 ['20.2 当前还缺什么？',['目的地/身份/车况是否已知','查得到 → 工具；需用户定 → 问'],{role:'decision'}],
 ['20.3 拆目标与依赖',['降温与查记忆可独立推进','拿到具体地点后才能规划路线']],
 ['20.4 选择工具并改写',['工具名、参数、位置与数值','改写须保留原意，且下游能接']],
 ['20.5 生成本轮输出',['talk_or_not / talk_content','emoji_id + action_list']],
 ['20.6 需要等待以后？',['条件/周期/长期 → 任务入口','即时工具仍按本轮 action 下发'],{role:'decision'}],
 ['20.7 观察返回结果',['成功、失败、候选或处理中','反馈不是用户的新指令'],{tone:'green'}],
 ['20.8 目标是否完成？',['逐个核对子目标，不抢报完成','未完：继续 / 换方案 / 问 / 等'],{role:'decision',tone:'green'}],
 ['20.9 输出用户可懂结果',['成功部分 + 尚未完成部分','必要时解释失败与下一步'],{tone:'green'}],
 ['20.10 澄清或让用户选',['多个地点/缺身份/不确定约束','等回复后接回原目标'],{tone:'amber'}],
 ['20.11 查询/补信息',['只调用缺少的信息类工具','记忆未找到不能自编目的地']],
 ['20.12 停止/取消/终止',['取消动作、终止当前目标','播报被打断不自动等于任务取消'],{tone:'red'}]
],{cols:3,rowH:167,nodeH:143,gap:64});chain(['P1','P2','P3','P4','P5']);edge('P5','P6');edge('P7','P8',{tone:'green'});edge('P8','P9',{tone:'green',label:'已完成',labelAt:[6810,1740]});
edge('P2','P11',{sa:'l',ta:'l',via:[[5170,1331],[5170,1850]],tone:'blue',label:'缺可查询事实',labelAt:[5170,1675]});
edge('P2','P10',{sa:'r',ta:'r',via:[[6270,1331],[6270,1838],[7242,1838],[7242,1835]],tone:'amber',label:'需用户确认',labelAt:[6270,1560]});
edge('P8','P1',{sa:'l',ta:'l',via:[[5160,1665],[5160,1225],[4190,1225],[4190,1331]],tone:'green',main:true,label:'未完：新一轮判断',labelAt:[4675,1225]});
note(pl,['要会问：为什么选这个工具？先后顺序的依赖是什么？成功反馈后为什么还要调用？','验收：完整目标成功率、工具/参数/依赖正确率、无依据动作、失败恢复、假完成和 P50/P95 时延。']);

const f=group('orchestration','22 工具调度与反馈入口',7380,1160,2750,920,{status:'按契约逐跳验收'});
ids=grid(f,'F',[
 ['22.1 接收 action_list',['action_id + tool_name + params','动作候选还没有实际执行']],
 ['22.2 能力/参数校验',['工具注册、车型支持、必填范围','统一校验层实现需核对'],{role:'decision',future:true}],
 ['22.3 权限与业务前置条件',['身份/座位/车态/用户确认','高副作用工具逐项约定'],{role:'decision',future:true}],
 ['22.4 本轮可执行动作',['独立动作可并行；依赖须等待','POI / route / navi 串行互斥']],
 ['22.5 Adapter / 领域 Agent',['自然语言指令 → 领域理解','工具内可再调 SFT/服务/SDK']],
 ['22.6 车端或云服务执行',['车控 / 导航 / 媒体 / 生态','下方 27 项逐个展开机制']],
 ['22.7 原始结果返回',['受理/候选/成功/失败/处理中','接口成功不自动代表物理生效'],{tone:'green'}],
 ['22.8 形成 tool_feedback',['当前 SP：tool_name + 结果文本','缺 action_id 等关联字段需补'],{tone:'green'}],
 ['22.9 下一轮输入队列',['保留所属用户/任务/调用关系','迟到、重复、取消后回报需处理'],{tone:'green',future:true}],
 ['22.10 可重试还是停止？',['查询可重试不代表订座可重试','确认副作用后重试或换方案'],{role:'decision',tone:'red'}],
 ['22.11 标准状态协议缺口',['缺状态码、可重试和任务关联','同名工具并行可能错绑'],{tone:'red'}],
 ['22.12 注册与示例不一致',['示例出现未注册工具','goal_list_update 参数冲突'],{tone:'red'}]
],{cols:3,rowH:167,nodeH:143,gap:56});chain(['F1','F2','F3','F4','F5','F6']);chain(['F7','F8','F9'],{tone:'green'});edge('F7','F10',{tone:'red',label:'失败',labelAt:[8345,1800]});
note(f,['要会问：哪一步是模型理解，哪一步真正改状态？结果能对应哪一次调用？','验收：工具业务成功率、超时率、错绑/重复执行、合法动作被拦、非法动作漏拦。']);

// 跨端云的主流程及数据回路。
E.push(`<line x1="45" y1="2190" x2="10280" y2="2190" stroke="#8BA4B8" stroke-width="2" stroke-dasharray="13 8"/>`);
txt(N,75,2153,'云端',26,C.blue,750);txt(N,75,2230,'车端',26,C.green,750);

const v=group('voice','1–2 语音输入 → 一轮 Query',70,2280,1810,920,{status:'从这里开始',tone:'green'});
ids=grid(v,'V',[
 ['1 用户说话',['“我有点热，带我去昨天的游泳馆”','输入：声音，不是完整文字'],{main:true}],
 ['2.1 麦克风/唤醒门控',['权限、语音开关、唤醒/免唤醒','未开启：不能继续当成有效请求']],
 ['2.2 音频处理',['回声消除、降噪、音区定位','区分播报声与用户说话']],
 ['2.3 ASR 语音识别',['音频 → 增量文本/最终文本','保留数字、否定、地点和人名']],
 ['2.4 说话人与位置',['音区 + face/身份/座位信息','分清“我”是哪位乘员']],
 ['2.5 判停与多输入处理',['VAD、续说、多人请求合并','先后次序与丢字会影响整条链']],
 ['2.6 封装本轮输入',['query / speaker_name / position','timestamp + 本轮会话关联'],{main:true}],
 ['2.7 用户再次发声/打断',['可能澄清、改目标、撤销动作','判断是否取消任务是另一件事']]
],{cols:2,rowH:167,nodeH:143,tone:'green'});chain(ids.slice(0,7),{main:true});edge('V8','V6',{tone:'green'});
note(v,['要会问：原音频、ASR 文本、说话人，哪一个已开始出错？','验收：关键实体/否定保真、音区正确、截断/合并错误、ASR 尾延迟。']);

const fast=group('fast','5–8 端侧 FC 与执行路由',1980,2280,2090,920,{status:'快路径 / 兜底',tone:'green'});
ids=grid(fast,'D',[
 ['5.1 端侧 FC 模型',['文本 → 本地可执行动作候选','补目标功能、位置与参数']],
 ['6 命中快路白名单？',['高频简单车控 + 合法动作','命中时优先端侧快速执行'],{role:'decision',main:true}],
 ['6.1 未命中：等待云结果',['有端候选也不立即抢执行','云端拒识/FC/Planner 分流']],
 ['6.2 端云最终仲裁',['只执行选定结果；抑制迟到重复','精确优先级/超时按车型核验'],{role:'decision'}],
 ['7.1 端候选能力检查',['功能支持、参数范围、车态','失败给明确原因'],{role:'decision'}],
 ['7.2 原子动作送车端执行',['不需要每次经过云端 Planner','也应同步真实结果和状态'],{main:true}],
 ['6.3 云无结果时端兜底',['端侧有有效候选 → 尝试执行','无候选 → 兜底反馈']],
 ['8 本地结果形成闭环',['动作生效 + 必要卡片/话术','不得只凭“模型理解了”报成功'],{tone:'green'}]
],{cols:2,rowH:167,nodeH:143,tone:'green'});chain(['D1','D2'],{main:true});edge('D2','D3',{label:'否',labelAt:[3590,2550]});chain(['D3','D4']);chain(['D5','D6','D8']);edge('D2','D5',{sa:'l',ta:'l',via:[[3000,2451],[3000,2867]],label:'是：优先端执行',labelAt:[3000,2707],main:true});edge('D4','D5');edge('D7','D5',{tone:'green'});
note(fast,['要会问：端云都返回时谁执行？云超时后迟到会不会又执行一次？','验收：白名单错命中、重复车控、离线成功率；简单请求与复杂请求分开统计。']);

const sig=group('signals','3–4 / 25 状态与三类视觉',4170,2280,1440,920,{status:'观察事实',tone:'green'});
ids=grid(sig,'S',[
 ['3 车/人/应用信号',['车辆、导航、媒体、手动操作','事件与时间戳']],
 ['4 端侧信号库',['统一当前快照、增量更新','向 Context / 本地 Trigger 供给']],
 ['25A 按需 VQA 采图',['用户视觉问题 → 选方向/对象','摄像头 → VLM 看图']],
 ['25A VQA 返回',['识别结果 → visual_qa 反馈','再回 Planner 回答用户']],
 ['25B 默认 AlwaysOn',['默认视觉观察 + OMS 标签','VLM → 端数据中心 → Context']],
 ['25C 动态观察任务',['Task 下发带 task_id 的观察','全量替换；最多 3 项']],
 ['25C 单任务观察返回',['各 task 分开上报 → 云语义判断','不进入通用 Context']],
 ['25C AlwaysOn 关闭',['拒绝新观察；下发 [] 清空','反馈任务不可用并停止观察'],{tone:'red'}]
],{cols:2,rowH:167,nodeH:143,gap:44,tone:'green',margin:28});chain(['S1','S2']);chain(['S3','S4']);edge('S5','S2',{sa:'l',ta:'t',via:[[4185,2790],[4185,2360],[5230,2360]],tone:'green'});edge('S6','S7',{tone:'purple',dash:true});
note(sig,['要会问：是主动问、默认感知，还是带任务的持续观察？','验收：帧新鲜度、任务错绑、漏报；不把观察当触发。']);

const et=group('end-trigger','24 端侧规则自闭环',5710,2280,1540,920,{status:'本地执行',tone:'green'});
ids=grid(et,'E',[
 ['24.1 本地配置仓库',['云同步规则、版本与适用范围','离线使用已生效配置']],
 ['24.2 订阅索引',['事件变化 → 找相关规则','信号来源统一接入信号库']],
 ['24.3 当前状态聚合',['读取本地最新信号快照','避免拼出不同时刻的假条件']],
 ['24.4 规则表达式求值',['结构化规则 → true / false','具体运行时/资源限制需核验'],{role:'decision'}],
 ['24.5 冲突/频控判断',['多规则命中、优先级、冷却','与云端执行的仲裁策略待统一'],{role:'decision'}],
 ['24.6 本地任务管理',['决定何时调用本地动作','具体能力按版本/落地情况核验']],
 ['24.7 本地 Function/UI/TTS',['原子执行 / 本地卡片 / 播报','离线规则可走本地闭环']],
 ['24.8 结果与日志',['端侧状态反馈、规则执行记录','结果上云链路覆盖需核验'],{tone:'green'}]
],{cols:2,rowH:167,nodeH:143,gap:44,tone:'green',margin:28});chain(ids);
note(et,['要会问：何时检查条件？误触发来自规则还是信号过期？','验收：命中、冷却、重复执行、断网恢复与规则冲突。']);

const ui=group('output','7 / 23 / 26–29 执行与用户可见结果',7380,2280,2750,920,{status:'做成与呈现分开核验',tone:'green'});
ids=grid(ui,'O',[
 ['28.1 执行适配入口',['FC 或工具下发的业务指令','车型 SDK / 应用 / 系统接口']],
 ['28.2 真实业务动作',['空调 / 车窗 / 导航 / 媒体','设备/服务实际发生变化']],
 ['28.3 回执与状态核对',['受理 ACK、执行结果、实际状态','按来源回云工具或本地闭环','回读覆盖与失败判定需核验'],{tone:'green'}],
 ['26.1 话术与播报',['Planner talk_content → TTS','部分下游自己播报，须去重']],
 ['26.2 卡片/屏幕反馈',['动作状态、候选、进度与失败','手点结果必须回流上下文']],
 ['27 数字人/形象反馈',['表情、动作、音区/屏幕协同','数字人不是所有车控必经节点']],
 ['23.1 任务中心视图',['待办 / 进行中 / 任务记录','业务方状态驱动 UI，UI 不编排']],
 ['23.2 任务中心操作',['操作事件回业务方或 Task','取消/删除能力按版本；不混状态']],
 ['29 用户获得真实结果',['听到、看到、实际状态一致','未完成部分清楚告知'],{tone:'green',main:true}],
 ['29.1 完成判定',['“受理成功”≠“操作已生效”','“一个动作成功”≠“整个目标完成”'],{role:'decision'}],
 ['29.2 用户追问或改主意',['重新入语音/交互入口','带已完成动作与未完目标']],
 ['29.3 失败也要有出口',['无法执行/信息不足/等待中','告诉原因与可行下一步'],{tone:'red'}]
],{cols:3,rowH:167,nodeH:143,gap:56,tone:'green'});chain(['O1','O2','O3'],{main:true});edge('O3','O10',{sa:'r',ta:'r',via:[[10100,2451],[10100,2952]],tone:'green'});chain(['O7','O8']);edge('O10','O9',{tone:'green'});edge('O4','O9',{sa:'r',ta:'r',via:[[10102,2618],[10102,2785]],tone:'green'});edge('O5','O9',{tone:'green'});edge('O6','O9',{sa:'l',ta:'b',via:[[7400,2618],[7400,2875],[9685,2875]],tone:'green'});edge('O12','O9',{tone:'red'});edge('O9','O11',{tone:'green'});
note(ui,['要会问：听到了成功但车没变，究竟是谁把成功报早了？手点第三条路线，Planner 是否知道？','验收：真实目标成功、说做一致、首播/首动作/最终完成时延、打断与恢复。']);

// 主线跨模块连接，线路走模块间通道。
edge('V7','D1',{sa:'r',ta:'l',via:[[1930,2952],[1930,2451]],main:true,label:'普通 Query（未命中专属入口）',labelAt:[1930,2670]});
edge('D3','R1',{sa:'l',ta:'b',via:[[1938,2618],[1938,2110],[546,2110]],main:true,label:'未命中：云端分流',labelAt:[1300,2110]});
edge('R4','D4',{sa:'b',ta:'t',via:[[546,2050],[1930,2050],[1930,2390],[2498,2390]],label:'云端 FC 候选',labelAt:[1930,2190]});
edge('R7','D7',{sa:'l',ta:'l',via:[[90,1995],[90,2225],[2000,2225],[2000,2952]],tone:'red',label:'云超时 → 端候选兜底',labelAt:[1090,2225]});
edge('R6','X1',{sa:'r',ta:'l',via:[[1920,1665],[1920,1331]],main:true,label:'复杂/未满足快路条件',labelAt:[1920,1480]});
edge('R5','X8',{sa:'b',ta:'l',via:[[546,2128],[1935,2128],[1935,1832]],tone:'gray',label:'拒识内容 → 事件日志',labelAt:[1200,2128]});
edge('X7','P1',{sa:'r',ta:'l',via:[[4120,1832],[4120,1331]],main:true,label:'SP + UP',labelAt:[4120,1480]});
edge('P5','F1',{sa:'r',ta:'l',via:[[6272,1500],[6272,1218],[7330,1218],[7330,1331]],main:true,label:'action_list',labelAt:[6790,1218]});
edge('P11','F1',{sa:'b',ta:'l',via:[[5725,2100],[7325,2100],[7325,1331]],label:'查缺失信息',labelAt:[6770,2100]});
edge('F9','X8',{sa:'b',ta:'b',via:[[9686,2145],[2450,2145]],tone:'green',main:true,label:'tool_feedback → 更新事实/未完目标 → 同一个 Planner 再判断',labelAt:[6390,2145]});
edge('X7','P7',{sa:'r',ta:'l',tone:'green',label:'本轮是工具返回'});
edge('F6','O1',{sa:'l',ta:'l',via:[[7398,1500],[7328,1500],[7328,2451]],main:true,label:'车端指令',labelAt:[7328,2250]});
edge('O3','F7',{sa:'r',ta:'r',via:[[10172,2451],[10172,1665],[10220,1665],[10220,2115],[7395,2115],[7395,1665]],tone:'green',label:'回执/真实状态',labelAt:[10172,2270]});
edge('D6','O1',{sa:'r',ta:'l',via:[[4116,2785],[4116,3260],[7328,3260],[7328,2451]],main:true,label:'端侧快路 / 本地执行，不绕 Planner',labelAt:[5590,3260]});
edge('E7','O1',{sa:'b',ta:'l',via:[[6880,3240],[7350,3240],[7350,2451]],tone:'green',label:'预设规则动作',labelAt:[7115,3240]});
edge('O11','V8',{sa:'b',ta:'b',via:[[8772,3300],[538,3300]],tone:'gray',label:'用户补充、追问、改目标 → 继续对话',labelAt:[4810,3300]});
edge('O8','X8',{sa:'b',ta:'b',via:[[8768,3280],[4095,3280],[4095,2165],[2450,2165]],tone:'green',label:'手动点击 / 取消 event 回流',labelAt:[4930,3280]});
edge('P9','O4',{sa:'r',ta:'r',via:[[7298,1665],[7298,2205],[10155,2205],[10155,2618]],tone:'green',label:'talk_content / emoji / 用户结果',labelAt:[9130,2205]});
edge('P10','O4',{sa:'r',ta:'l',via:[[7290,1832],[7290,2570],[9140,2570],[9140,2618]],tone:'amber',label:'澄清 / 选择 / 等待',labelAt:[8140,2570]});
edge('S2','X2',{sa:'t',ta:'b',via:[[5230,2230],[3630,2230],[3630,1430],[3550,1430]],tone:'green',label:'当前车况/状态',labelAt:[4440,2230]});
edge('S2','E2',{sa:'r',ta:'t',via:[[5660,2451],[5660,2358],[6860,2358]],tone:'green',label:'信号变化 + 最新快照',labelAt:[6140,2358]});
edge('C6','E1',{sa:'b',ta:'t',via:[[469,1060],[5672,1060],[5672,2220],[6100,2220]],tone:'gray',label:'版本化端规则下发',labelAt:[2760,1060]});
edge('C5','G1',{label:'注册场景',labelAt:[1785,757]});
edge('P6','K1',{sa:'t',ta:'b',via:[[4650,1110],[4125,1110]],tone:'purple',dash:true,label:'条件/持续：进入 Task Agent',labelAt:[4450,1110]});
edge('K6','G1',{sa:'l',ta:'t',via:[[3663,555],[3663,155],[2255,155]],tone:'purple',dash:true,label:'任务条件订阅',labelAt:[2920,155]});
edge('G6','K7',{sa:'r',ta:'l',via:[[3636,757],[3636,570]],tone:'purple',dash:true,label:'命中后 callback',labelAt:[3636,660]});
edge('K8','X1',{sa:'b',ta:'t',via:[[4125,1080],[2458,1080]],tone:'purple',dash:true,label:'通用任务：携最新 Context 恢复 Planner',labelAt:[3370,1080]});
edge('F8','K9',{sa:'t',ta:'r',via:[[8768,1090],[7660,1090],[7660,757]],tone:'purple',dash:true,label:'任务执行结果回写',labelAt:[8150,1090]});
edge('K12','O7',{sa:'r',ta:'r',via:[[7670,757],[7670,1098],[10202,1098],[10202,3220],[8290,3220],[8290,2785]],tone:'purple',dash:true,label:'TaskView / 状态通知',labelAt:[9020,1098]});
edge('K6','S6',{sa:'b',ta:'t',via:[[5050,1025],[5648,1025],[5648,2238],[4550,2238]],tone:'purple',dash:true,label:'dynamic_watch_tasks：观察任务列表',labelAt:[5090,1025]});
edge('S7','G3',{sa:'b',ta:'r',via:[[5230,3330],[5640,3330],[5640,1042],[3630,1042],[3630,555]],tone:'purple',dash:true,label:'按 task_id 的视觉观察 → 云语义 Y/N',labelAt:[5310,3330]});
edge('A4','X1',{sa:'l',ta:'t',via:[[7690,555],[7690,1070],[2458,1070]],tone:'amber',label:'advisor 建议进入同一决策入口',labelAt:[6430,1070]});
edge('S5','A1',{sa:'l',ta:'l',via:[[4150,2790],[4150,1105],[7690,1105],[7690,365]],tone:'green',label:'默认场景观察',labelAt:[5850,1105]});

// 27 项工具不是一个列表标题：每项都有输入、处理和输出节点，并接上共同调用/反馈总线。
txt(N,70,3380,'22 工具内部业务链：选中的工具才执行；每一行均接回上面的 tool_feedback',30,C.blue,750);
txt(N,70,3417,'本地 SP 快照 27 个唯一工具；运行时按车型 × 环境 × 版本注入。下游内部实现没有证据的部分明确标为待核。',22,C.sub,550);
const libY=3480, libH=1790, fw=1640,fgap=58;
toolFamilies.forEach((fam,fi)=>{
 const x=70+fi*(fw+fgap);const g=group('family-'+fi,`22.${fi+1} ${fam.title} · ${fam.tools.length}项`,x,libY,fw,libH,{tone:'blue'});
 const inid=`IN${fi}`,outid=`OUT${fi}`;
 node(inid,g,x+32,libY+82,fw-64,82,'工具选择入口',['只有 action_list 选中本项时，才进入该行'],{titleSize:21,size:18});
 const rowStart=libY+204,rowGap=204,nw=472,nh=162;
 fam.tools.forEach((t,i)=>{
  const yy=rowStart+i*rowGap,xx=x+52, id=`T${t.n}`;
  node(id,g,xx,yy,nw,nh,`${String(t.n).padStart(2,'0')} ${t.cn}`,[t.name,...t.input],{titleSize:21,size:18,tool:t.name});
  node(id+'m',g,xx+nw+40,yy,nw,nh,t.midTitle||'理解/处理/执行',t.mechanism,{titleSize:21,size:18});
  node(id+'r',g,xx+2*(nw+40),yy,nw,nh,'结果与边界',t.result,{titleSize:21,size:18,tone:t.write?'amber':'green'});
  chain([id,id+'m',id+'r']);
  edge(inid,id,{sa:'l',ta:'l',via:[[x+24,libY+123],[x+24,yy+nh/2]]});
 });
 const yafter=rowStart+fam.tools.length*rowGap;
 if(fam.tools.length<6){
  const h=(6-fam.tools.length)*rowGap-28;
  node(`M${fi}`,g,x+52,yafter,fw-104,h,fam.extraTitle,fam.extra,{tone:'gray',titleSize:22,size:20});
 }
 node(outid,g,x+32,libY+1457,fw-64,90,'返回统一反馈入口',['成功 / 失败 / 候选待选 / 处理中；保留调用关系'],{tone:'green',titleSize:21,size:18});
 fam.tools.forEach(t=>{const n=at(`T${t.n}r`);edge(`T${t.n}r`,outid,{sa:'r',ta:'r',via:[[x+fw-23,n.y+n.h/2],[x+fw-23,libY+1502]],tone:'green'})});
 note(g,[fam.question,fam.metric]);
});
// 独立的调用/返回干线，支线在家族入口汇合；内部节点沿箭头可逐个追踪。
toolFamilies.forEach((fam,fi)=>{
 const x=70+fi*(fw+fgap);edge('F6',`IN${fi}`,{sa:'r',ta:'t',via:[[10185,1500],[10185,3448],[x+fw/2,3448]],label:fi===0?'展开选中工具':'',labelAt:[6710,3448]});
 edge(`OUT${fi}`,'F7',{sa:'b',ta:'r',via:[[x+fw/2,5310],[10245,5310],[10245,2123],[8330,2123],[8330,1665]],tone:'green',label:fi===5?'各工具 result → 统一反馈 → Planner':'',labelAt:[8550,5310]});
});
edge('T26m','S3',{sa:'l',ta:'b',via:[[8578,3765],[8540,3765],[8540,3340],[4550,3340]],tone:'blue',label:'按需视觉采图',labelAt:[7610,3340]});

// 一次真实业务请求的状态变化与产品经理可验收的掌握深度。
const cases=group('case','贯穿案例：我有点热，带我去昨天的游泳馆',70,5390,6190,590,{tone:'blue'});
ids=grid(cases,'Z',[
 ['① 输入/路由',['“我”=主驾；“昨天”=历史事实','需记忆与推理 → 云端 Planner']],
 ['② 并行补齐',['车控/查车况 + 查询历史地点','先有依据才能调温和选目的地']],
 ['③ 等依赖/问用户',['记忆返回两个游泳馆 → 请选','没有结果 → 问名称，不编地址']],
 ['④ 串行执行',['具体 POI → route_planning','选路线后按工具契约自动导航']],
 ['⑤ 分目标确认',['降温是否生效？导航是否开始？','只完成一项时，不能说都完成']]
],{cols:5,y:107,rowH:190,nodeH:153,gap:48,margin:35});chain(ids,{main:true});
note(cases,['反向排错：音频本来正确但地点识别错 → ASR；没看到手点选择 → Context/事件；信息齐全却选错工具 → Planner；正确指令下游听不懂 → 工具适配。','产品验收记录必须同时留：原始 Query、实际输入、模型动作、下游返回、设备/服务结果、用户可见反馈。']);
const learn=group('learning','产品经理需要掌握到哪一步',6370,5390,3820,590,{tone:'green'});
node('L1',learn,6410,5498,1180,196,'主责模块：定位与验收',['Planner / Trigger：能解释决策','看真实 Trace 分清根因','提出改法、指标、回归集并验收'],{tone:'green',titleSize:24,size:21});
node('L2',learn,7640,5498,1180,196,'相邻模块：契约与边界',['ASR / VLM / Tool / HMI：','说清输入输出、错误表现与责任','不要求自己写全部模型或 SDK'],{tone:'blue',titleSize:24,size:21});
node('L3',learn,8870,5498,1280,196,'AI 能力：能让真实目标做成',['模型理解规划 + 可靠 Context','工具能执行 + 反馈能纠错','用质量、时延、成本证明改进'],{tone:'amber',titleSize:24,size:21});
note(learn,['建议自测：独立复盘 10 条完整链路、5 个跨模块 badcase，完成 1 次有对照评测的模块改进。','达到这些能力可开始评估机会；离职还取决于职责、成长、成果和下一份工作的匹配度。']);

// 补全条件与失败出口；灰虚线为诊断关联，不是运行时必经动作。
edge('R1','R7',{tone:'red',label:'云整体超时'});
edge('R2','R6',{tone:'amber',label:'拒识模型超时'});
edge('R3','R8',{tone:'gray',dash:true,label:'记录选路'});
edge('P5','O4',{tone:'blue',label:'有话术则播报；可以无动作'});
edge('V8','P12',{tone:'red',label:'明确取消语义'});
edge('P12','K1',{tone:'purple',dash:true,label:'取消持久任务'});
edge('P12','O12',{tone:'red',label:'告知停止结果'});
edge('F2','F10',{tone:'red',label:'校验未通过'});
edge('F3','F10',{tone:'red',label:'前置条件不满足'});
edge('F10','F9',{tone:'red',label:'失败原因回给决策方'});
edge('F8','F11',{tone:'red',dash:true,label:'待补关联契约'});
edge('F2','F12',{tone:'red',dash:true,label:'注册一致性检查'});
edge('S6','S8',{tone:'red',label:'观察开关关闭'});
edge('S8','K9',{tone:'purple',dash:true,label:'观察不可用回写'});
edge('G3','G2',{sa:'r',ta:'r',tone:'gray',label:'未满足'});
edge('E4','E2',{tone:'gray',label:'不满足，继续等'});
edge('E5','E2',{tone:'gray',label:'抑制'});
edge('D5','O12',{tone:'red',label:'本地不可执行'});
edge('O3','D8',{tone:'green',label:'本地动作结果'});
edge('D8','O4',{tone:'green',label:'端侧必要播报'});
edge('S2','G2',{tone:'green',label:'端状态上报'});
edge('O3','S1',{tone:'green',label:'实际车况更新'});
edge('O5','X8',{tone:'green',label:'候选选择 event'});
edge('P5','O5',{tone:'blue',label:'动作/候选卡片'});
// 修正部分边的含义，避免把候选、成功、抑制混成无条件直线。
for(const e of graph.edges){
 if(e.from==='P2'&&e.to==='P3')e.label='信息足够';
 if(e.from==='P5'&&e.to==='P6')e.label='异步目标';
 if(e.from==='P5'&&e.to==='F1')e.label='即时工具 action_list';
 if(e.from==='D3'&&e.to==='D4')e.label='云结果';
 if(e.from==='D4'&&e.to==='D5')e.label='FC 胜出';
 if(e.from==='X7'&&e.to==='P1')e.label='本轮是用户/建议输入';
 if(e.from==='F7'&&e.to==='F8')e.label='结果';
 if(e.from==='P2'&&e.to==='P11')e.label='查缺失事实';
 if(e.from==='P2'&&e.to==='P10')e.label='请用户确认';
 if(e.from==='P8'&&e.to==='P1')e.label='未完成，重判';
 if(e.from==='D2'&&e.to==='D5')e.label='是';
 if(e.from==='F8'&&e.to==='F11')e.label='关联缺口';
 if(e.from==='F2'&&e.to==='F12')e.label='注册缺口';
 if(e.from==='R2'&&e.to==='R6')e.label='拒识超时';
 if(e.from==='F3'&&e.to==='F10')e.label='不满足';
}
// 为旧 Goal/动态 Advisor 保留一整条实体链，而不是藏在新 Task 说明里。
const SHIFT=540;
for(const g of graph.groups)g.y+=SHIFT;
for(const n of graph.nodes)n.y+=SHIFT;
for(const e of graph.edges){e.points=e.points.map(([x,y])=>[x,y+SHIFT]);if(e.labelAt)e.labelAt[1]+=SHIFT;if(e.via)e.via=e.via.map(([x,y])=>[x,y+SHIFT])}
const shiftMarkup=s=>s.replace(/\b(y|y1|y2)="([\d.]+)"/g,(m,k,v)=>Number(v)>=146?`${k}="${Number(v)+SHIFT}"`:m);
for(const arr of [B,N])for(let i=0;i<arr.length;i++)arr[i]=shiftMarkup(arr[i]);
// 非连接器线条（模块脚注/端云边界）随画面移动；所有连接器随后重排。
const staticLines=E.filter(s=>!s.startsWith('<polyline')).map(shiftMarkup);
E.length=0;L.length=0;E.push(...staticLines);
const legacy=group('legacy','17–18 旧版等待任务主链：Goal List + 动态 Advisor',70,190,10060,440,{tone:'amber',status:'既有 PRD 契约，与下方新 Task 方案区分'});
ids=grid(legacy,'H',[
 ['17.0 目标管理工具被调用',['输入：延迟/条件/持续诉求','来自 Planner 的 goal_list_update']],
 ['18.0 Goal List 建立/更新',['合理性/数量/归属与目标内容','注册完成只代表进入等待']],
 ['17.1 动态 Advisor 跟进',['围绕一个目标持续评估','监控目标进展，不直接改车态']],
 ['17.2 订阅触发条件',['定时/周期/状态/视觉条件','注册到云端 Trigger 后等待']],
 ['17.3 命中后重新判断',['条件回调 + 当前 Context','是否仍需执行/目标是否已完成']],
 ['17.4 形成 Advisor 建议',['建议回到同一个 Planner','决定动作、等待或更新目标状态']]
],{cols:6,y:100,nodeH:154,gap:46,margin:34,tone:'amber'});chain(ids.slice(0,4),{tone:'amber'});chain(['H5','H6'],{tone:'amber'});
note(legacy,['旧链有独立 Goal 和动态 Advisor；新 Task 将异步目标、执行 Run、触发与状态持久化统一管理。不同车型/阶段的实际采用情况须以运行版本核验。','用户的“十分钟后关加热”必须先进入等待；到时条件满足后再判断并执行，创建目标成功不能说加热已经关闭。']);
edge('T16m','H1',{tone:'amber',label:'旧目标工具'});edge('H4','G1',{tone:'amber',label:'条件订阅'});edge('G6','H5',{tone:'amber',label:'旧目标回调'});edge('H6','X1',{tone:'amber',label:'advisor 输入'});edge('X3','H3',{tone:'gray',dash:true,label:'目标/状态参考'});
// 卡片确认属于主链的业务闭环，不藏在一条“UI 反馈”文字中。
for(const g of graph.groups)if(g.y>=3900)g.y+=500;
for(const n of graph.nodes)if(n.y>=3900)n.y+=500;
for(const e of graph.edges)e.points=e.points.map(([x,y])=>[x,y>=3900?y+500:y]);
const shiftUI=s=>s.replace(/\b(y|y1|y2)="([\d.]+)"/g,(m,k,v)=>Number(v)>=3900?`${k}="${Number(v)+500}"`:m);
for(const arr of [B,N,E])for(let i=0;i<arr.length;i++)arr[i]=shiftUI(arr[i]);
const u=group('visible-ui','26.3 卡片与可见即可说：展示 → 用户表达/点击 → 正常业务回调 → 再复核执行',70,3870,10060,440,{tone:'green',status:'界面框架契约；具体业务接入待核'});
ids=grid(u,'U',[
 ['① 卡片展示请求',['进入 VUI 准入/队列','排队/拒绝/超时不等于已展示']],
 ['② 卡片真实可见',['实际显示/隐藏/关闭/过期','只处理当前最顶层页面']],
 ['③ 界面元素解析',['车企/业务方解析可操作元素','提取显示文本、位置和对象']],
 ['④ 指令与元素 ID',['页面方维护文本—控件映射','页面变化立即更新，旧 ID 失效']],
 ['⑤ 本轮语音识别',['免唤醒纯离线；唤醒端云并行','动态词表增强，非再做一次 ASR']],
 ['⑥ 指令匹配',['字节语音：精确/模糊/局部','返回匹配指令及元素 ID']],
 ['⑦ 注册方消歧',['同名按钮用位置/上下文区分','无法唯一确定时不盲点'],{role:'decision'}],
 ['⑧ 手点 / 模拟点击',['实际调用页面操作','此处成功只是 UI 操作成功']],
 ['⑨ 正常按钮回调',['与手点走同一类业务事件','带回对应业务/运行关联']],
 ['⑩ 原业务执行前复核',['当前任务、车况、有效期仍成立？','通过后才进入真实执行层'],{role:'decision',future:true}]
],{cols:10,y:100,nodeH:154,gap:30,margin:30,tone:'green'});chain(ids,{tone:'green'});
note(u,['可见即可说只支持界面上的简单表达，没有业务推理能力；其语音结果应在对话历史标记为模拟点击事件。页面方、字节语音、注册方与原业务不是一个模块。','框架 PRD 优先级：用户自定义任务 → 可见即可说 → FAQ → 端侧 LLM → 云端 LLM；实际车型的注册、优先级和业务接入情况仍需对照运行版本。']);
edge('O5','U1',{tone:'blue',label:'展开卡片生命周期'});
edge('V2','U5',{tone:'green',label:'当前页面的语音操作'});
edge('U6','V7',{tone:'gray',label:'未匹配：继续普通语音路由'});
edge('U2','U8',{tone:'green',label:'用户直接手点'});
edge('U7','O12',{tone:'red',label:'消歧失败/元素失效'});
edge('U9','X8',{tone:'green',label:'点击事件进入历史'});
edge('U9','K2',{tone:'purple',dash:true,label:'Task 卡片关联回执'});
edge('U10','O1',{tone:'green',label:'复核通过，执行动作'});
edge('U10','O12',{tone:'red',label:'复核失败，不执行'});
edge('E7','U1',{tone:'green',label:'需要确认的本地卡片'});
edge('U9','E6',{tone:'green',label:'本地卡片回原业务'});
edge('A4','O5',{tone:'amber',label:'AI Bar / 建议卡片'});
edge('A5','X1',{tone:'amber',label:'用户接受建议'});
edge('A3','A6',{tone:'gray',label:'不宜打扰'});
for(const e of graph.edges){
 if(e.from==='O3'&&e.to==='F7')e.label='云工具动作结果';
 if(e.from==='O3'&&e.to==='D8')e.label='端侧 FC 结果';
 if(e.from==='A5'&&e.to==='A6')e.label='拒绝/负反馈';
 if(e.from==='P2'&&e.to==='P10')e.sa='b';
 if(e.from==='F2'&&e.to==='F10')e.sa='b';
 if(e.from==='F3'&&e.to==='F10')e.sa='r';
 if(e.from==='E5'&&e.to==='E2')e.sa='l';
 if(e.from==='F2'&&e.to==='F3'||e.from==='F3'&&e.to==='F4'||e.from==='E5'&&e.to==='E6')e.label='通过';
 if(e.from==='G3'&&e.to==='G4'||e.from==='E4'&&e.to==='E5')e.label='满足';
 if(e.from==='E7'&&e.to==='O1')e.label='无须确认的本地动作';
 if(e.from==='K8'&&e.to==='X1')e.label='需要 Planner 时携最新上下文恢复';
 if(e.from==='K8'&&e.to==='K9')e.label='领域/生态执行结果';
}
// 自测与机制注释不是业务步骤，不制造虚假的先后箭头。
for(const n of graph.nodes)if(/^M\d|^L\d/.test(n.id))n.role='annotation';
// 清除绘制阶段的临时线与标签，SVG 中只保留重路由后的唯一版本。
const keepLines=E.filter(s=>!s.startsWith('<polyline'));
E.length=0;E.push(...keepLines);L.length=0;
const routing=routeAll(graph);
// 标签置于真实线段上的空白处，禁止盖住任何小模块的正文。
const labelBoxes=[];
const overlaps=(r,o)=>r.x<o.x+o.w+2&&r.x+r.w>o.x-2&&r.y<o.y+o.h+2&&r.y+r.h>o.y-2;
const labelObstacles=[...graph.nodes,...graph.groups.map(g=>({x:g.x,y:g.y,w:g.w,h:68})),...graph.groups.map(g=>({x:g.x+12,y:g.y+g.h-121,w:g.w-24,h:108}))];
const arrowZones=graph.edges.map(e=>({edge:e,x:e.points.at(-1)[0]-17,y:e.points.at(-1)[1]-17,w:34,h:34}));
const edgePriority=e=>(e.label?100:0)+(at(e.from).group===at(e.to).group?50:0)+(e.points.length===2?20:0)-(e.dash?10:0);
for(const e of [...graph.edges].sort((a,b)=>edgePriority(b)-edgePriority(a))){
 const color=tones[e.tone||'blue'][0];
 E.push(`<polyline data-from="${e.from}" data-to="${e.to}" points="${e.points.map(q=>q.join(',')).join(' ')}" fill="none" stroke="${color}" stroke-width="${e.main?4.5:2.4}"${e.dash?' stroke-dasharray="9 6"':''} marker-end="url(#arrow-${e.tone||'blue'})"/>`);
 if(!e.label)continue;
 const font=16,rawW=units(e.label)*font+6,segments=e.points.slice(1).map((b,i)=>({a:e.points[i],b,len:Math.abs(e.points[i][0]-b[0])+Math.abs(e.points[i][1]-b[1])})).sort((a,b)=>b.len-a.len);let found;
 if(e.points.length===2&&at(e.from).group===at(e.to).group){
  const a=at(e.from),p=e.points[0],q=e.points[1],bodyLines=a.body.flatMap(s=>wrap(s,a.w-30,a.size||19)),titleLines=wrap(a.title,a.w-30,a.titleSize||22);
  const bottom=a.y+23+titleLines.length*27+9+Math.max(0,bodyLines.length-1)*26+(a.size||19)*.3;
  if(a.y+a.h-bottom>28&&rawW<a.w*.75){const x=q[0]>p[0]?a.x+a.w-rawW-12:q[0]<p[0]?a.x+12:a.x+a.w/2-rawW/2,r={x,y:a.y+a.h-23,w:rawW,h:20};if(!labelBoxes.some(o=>overlaps(r,o))){found={...r,lines:[e.label]};e.internalLabel=true}}
 }
 for(const maxw of [rawW,180,118,82,50,40]){
  if(found)break;const lines=wrap(e.label,maxw-6,font),w=Math.min(rawW,maxw),h=lines.length*20;
  for(const s of segments){
   for(const ratio of [.5,.3,.7,.18,.82]){
    for(const off of [0,4,-4,8,-8,12,-12,18,-18,24,-24]){
     const x=s.a[0]+(s.b[0]-s.a[0])*ratio+(s.a[0]===s.b[0]?off:0),y=s.a[1]+(s.b[1]-s.a[1])*ratio+(s.a[1]===s.b[1]?off:0),r={x:x-w/2,y:y-h/2,w,h};
     if(s.a[0]===s.b[0]&&Math.abs(off)>w/2-2||s.a[1]===s.b[1]&&Math.abs(off)>h/2-2)continue;
     if(labelObstacles.some(o=>overlaps(r,o))||labelBoxes.some(o=>overlaps(r,o))||arrowZones.some(o=>o.edge!==e&&overlaps(r,o)))continue;found={...r,lines};break;
    }if(found)break;
   }if(found)break;
  }
 }
 if(!found){
  const a=at(e.from),p=e.points[0],first=e.points[1];
  const bodyLines=a.body.flatMap(s=>wrap(s,a.w-30,a.size||19)),titleLines=wrap(a.title,a.w-30,a.titleSize||22);
  const bottom=a.y+23+titleLines.length*27+9+Math.max(0,bodyLines.length-1)*26+(a.size||19)*.3;
  // A branch label may sit in the unused bottom/right padding of its source node.
  let r;if(p[1]<first[1]&&a.y+a.h-bottom>28)r={x:a.x+a.w/2-rawW/2,y:a.y+a.h-23,w:rawW,h:20};
  else if(p[0]<first[0]){const textRight=a.x+15+Math.max(...bodyLines.map(s=>units(s)*(a.size||19)));if(a.x+a.w-textRight>rawW+22)r={x:a.x+a.w-rawW-10,y:p[1]-10,w:rawW,h:20}}
  if(r&&!labelBoxes.some(o=>overlaps(r,o))){found={...r,lines:[e.label]};e.internalLabel=true}
 }
 if(!found){e.labelOmitted=true;continue}
 labelBoxes.push(found);e.labelBox=found;
 box(L,found.x,found.y,found.w,found.h,C.white,C.white,0,2);
 found.lines.forEach((s,i)=>txt(L,found.x+found.w/2,found.y+15+i*20,s,font,color,600,'middle'));
}
const defs=Object.entries(tones).map(([name,[color]])=>`<marker id="arrow-${name}" markerWidth="8" markerHeight="7" refX="7" refY="3.5" orient="auto"><path d="M0 0 L8 3.5 L0 7 z" fill="${color}"/></marker>`).join('');
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${defs}</defs>${B.join('\n')}${E.join('\n')}${N.join('\n')}${L.join('\n')}</svg>`;
fs.writeFileSync(path.join(dir,'业务全链路-v11.svg'),svg);
fs.writeFileSync(path.join(dir,'graph-v11.json'),JSON.stringify(graph,null,2));
const toolCount=graph.nodes.filter(n=>n.tool).length;
const duplicateIds=graph.nodes.map(n=>n.id).filter((x,i,a)=>a.indexOf(x)!==i);
if(duplicateIds.length||toolCount!==27)throw Error(JSON.stringify({duplicateIds,toolCount}));
console.log(JSON.stringify({canvas:[W,H],groups:graph.groups.length,businessNodes:graph.nodes.length,edges:graph.edges.length,tools:toolCount,routing,omittedLabels:graph.edges.filter(e=>e.labelOmitted).map(e=>[e.from,e.to,e.label])}));
