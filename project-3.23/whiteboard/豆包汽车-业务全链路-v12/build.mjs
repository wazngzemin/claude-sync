import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {main,supplements,toolFamilies,learning,sources,examples,cases} from './content.mjs';
const dir=path.dirname(fileURLToPath(import.meta.url));
const W=13920, X=400, PW=1220, GAP=480, HY=920, HH=270;
const C={ink:'#19394D',sub:'#466174',blue:'#185DB7',deep:'#0D4FA8',pale:'#F2F6FC',line:'#A5B8C8',quiet:'#667F8C',white:'#FFFFFF',wash:'#F4F2EE'};
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const units=s=>[...s].reduce((n,c)=>n+(/[\x00-\xff]/.test(c)?.57:1),0);
function wrap(s,w,size){let a=[],l='';const parts=s.match(/[A-Za-z_][A-Za-z0-9_./-]*|\n|./gu)||[];for(const c of parts){if(c==='\n'){a.push(l);l=''}else if(units(l+c)*size>w&&l){if(/^[，。；：、！？）】]/u.test(c)){l+=c;continue}a.push(l);l=c}else l+=c}if(l)a.push(l);return a}
const bg=[],edges=[],fg=[],labels=[];
const graph={version:12,width:W,height:0,groups:[],nodes:[],edges:[],toolFamilies,learning,sources,cases,main:main.map(m=>m.id),mainSteps:main.flatMap(m=>m.steps.map(s=>s.id))};
function text(a,x,y,s,size=27,color=C.ink,weight=400,anchor='start'){a.push(`<text x="${x}" y="${y}" font-size="${size}px" font-weight="${weight}" fill="${color}" text-anchor="${anchor}">${esc(s)}</text>`)}
function rect(a,x,y,w,h,fill=C.white,stroke=C.line,sw=2,rx=8,extra=''){a.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" ${extra}/>`)}
function lines(a,x,y,s,w,size=27,lineH=42,color=C.ink,weight=400){const ls=wrap(s,w,size);ls.forEach((l,i)=>text(a,x,y+i*lineH,l,size,color,weight));return y+ls.length*lineH}
function bodyHeight(paras,w,size=27){return paras.reduce((n,[l,s])=>n+wrap(l+'｜'+s,w,size).length*42+22,0)}
function boxNode(step,g,x,y,w,h,opts={}){
 const n={...step,group:g.id,x,y,w,h,learn:g.learn||[],future:!!g.future,kind:opts.kind||'step',body:step.paras.map(([l,s])=>l+'：'+s)}; graph.nodes.push(n);
 rect(fg,x,y,w,h,C.white,C.line,2,8,`data-node-id="${step.id}"`);
 text(fg,x+36,y+52,step.title,31,C.deep,700);
 let cy=y+108;
 for(const [l,s] of step.paras){cy=lines(fg,x+36,cy,l+'｜'+s,w-72,27,42,C.ink);cy+=22}
 if(cy-22>y+h-24)throw Error('文字溢出 '+step.id+' '+(cy-y));
 n.textBottom=cy-22;
 return n;
}
function headerGroup(m,i,y,opts={}){
 const x=X+i*(PW+GAP),g={...m,x,y,w:PW,h:0};graph.groups.push(g);
 rect(fg,x,y,PW,HH,C.pale,C.blue,3,8,`data-node-id="H-${m.id}"`);
 text(fg,x+32,y+52,`${m.num||''} ${m.title}`.trim(),34,C.deep,750);
 if(m.owner)text(fg,x+32,y+99,m.owner,25,C.sub,500);
 lines(fg,x+32,y+(m.owner?148:110),m.intro,PW-64,27,41,C.ink);
 const n={id:'H-'+m.id,title:m.title,group:m.id,x,y,w:PW,h:HH,kind:'module',body:[m.intro],paras:[['模块职责',m.intro]],learn:m.learn||[],future:!!m.future};graph.nodes.push(n);
 return g;
}
function point(id,side='b',off=.5){const n=graph.nodes.find(n=>n.id===id);if(!n)throw Error('unknown '+id);return side==='t'?[n.x+n.w*off,n.y]:side==='b'?[n.x+n.w*off,n.y+n.h]:side==='r'?[n.x+n.w,n.y+n.h*off]:[n.x,n.y+n.h*off]}
function edge(id,from,to,points,label='',kind='flow',labelAt=null,width=null){
 const col=kind==='expand'?C.line:kind==='return'?C.quiet:C.blue,sw=width||(kind==='main'?5:kind==='expand'?2:3);
 graph.edges.push({id,from,to,points,label,kind});
 edges.push(`<polyline data-edge-id="${id}" data-from="${from}" data-to="${to}" points="${points.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${col}" stroke-width="${sw}" ${kind==='expand'?'stroke-dasharray="10 9"':''} marker-end="url(#arrow)"/>`);
 if(label&&labelAt){const ww=Math.min(1800,units(label)*25+48),ls=wrap(label,ww-30,25),hh=ls.length*36+18;rect(labels,labelAt[0]-ww/2,labelAt[1]-hh/2,ww,hh,C.white,C.white,0,4);ls.forEach((l,i)=>text(labels,labelAt[0],labelAt[1]-(ls.length-1)*18+9+i*36,l,25,col,650,'middle'))}
}
function chain(g,topId,steps,firstY,rowH,nodeH){
 let prev=topId;
 steps.forEach((s,j)=>{const display={...s,title:(g.num?g.num+'.'+(j+1)+'  ':String(j+1)+'. ')+s.title};const n=boxNode(display,g,g.x+64,firstY+j*rowH,PW-128,nodeH);let a=point(prev),b=point(n.id,'t');edge(`${g.id}-${j+1}`,prev,n.id,[a,b],'','inside');prev=n.id});return prev;
}
function footer(g,startY,keys){let y=startY;const ls=keys.map(k=>learning[k]).filter(Boolean);text(fg,g.x+34,y,'这一段怎样才算掌握',28,C.deep,700);y+=48;const d=[...new Set(ls.map(l=>l.depth))].join(' ');y=lines(fg,g.x+34,y,d,PW-68,27,42);y+=24;return y}

text(fg,400,84,'豆包汽车 · 一条请求怎样变成真实结果',52,C.deep,750);
text(fg,400,146,'贯穿例子：“我有点热，带我去昨天的游泳馆。”',30,C.ink,500);
text(fg,400,204,'粗蓝线＝跨模块交接；每列向下＝模块内部顺序；灰色回线＝结果/交互返回；虚线＝机制展开，不是额外执行步骤。',26,C.sub);
text(fg,400,257,'主线是业务分工，不等同进程部署；快路、纯问答、未来任务不是每次都经过全部模块。',26,C.sub);

const mainH=Math.ceil(Math.max(...main.flatMap(m=>m.steps.map(s=>bodyHeight(s.paras,PW-200)+150)))/20)*20;
const rowH=mainH+170,firstY=HY+HH+190;
const coreBottom=firstY+3*rowH+mainH+500;
const mainGroups=[];
main.forEach((m,i)=>{const g=headerGroup(m,i,HY);g.kind='main';mainGroups.push(g);chain(g,'H-'+m.id,m.steps,firstY,rowH,mainH);g.h=coreBottom-HY;footer(g,coreBottom-390,m.learn);rect(bg,g.x-28,HY-24,PW+56,g.h+48,C.white,'#D5DFE6',1.8,12)});

main.slice(1).forEach((m,i)=>{const a=point('H-'+main[i].id,'r',.30),b=point('H-'+m.id,'l',.30);edge('M'+(i+1),'H-'+main[i].id,'H-'+m.id,[a,b],main[i].out,'main',[(a[0]+b[0])/2,a[1]-48])});
// 两条嵌套回线各占独立高空通道；每个入口不共用同一个端口。
let a=point('H-feedback','t',.66),b=point('H-context','t',.58);
edge('R1','H-feedback','H-context',[a,[a[0],650],[b[0],650],b],'R1  尚未完成：带工具结果与剩余目标回 03，再由 04 决策','return',[(a[0]+b[0])/2,650],4);
a=point('H-output','t',.82);b=point('H-context','t',.22);
edge('U1','H-output','H-context',[a,[a[0],430],[b[0],430],b],'U1  用户选择 / 业务交互回流；新的完整语音仍从 01 进入','return',[(a[0]+b[0])/2,430],3);
// 快路径和无需工具的对话各有独立底部通道，避开所有正文。
a=point('H-route','r',.81);b=point('H-execute','l',.81);
const fastY=coreBottom+180,plainY=coreBottom+360;
edge('F1','H-route','H-execute',[a,[a[0]+120,a[1]],[a[0]+120,fastY],[b[0]-120,fastY],[b[0]-120,b[1]],b],'F1  选中端侧 / FC 快路：进入执行域，跳过云端 Planner','flow',[(a[0]+b[0])/2,fastY],4);
a=point('H-planner','r',.69);b=point('H-output','l',.69);
edge('T1','H-planner','H-output',[a,[a[0]+250,a[1]],[a[0]+250,plainY],[b[0]-250,plainY],[b[0]-250,b[1]],b],'T1  无需调用工具 / 需要用户澄清：直接组织交互，不虚构一次执行','flow',[(a[0]+b[0])/2,plainY],3);
a=point('H-execute','r',.93);b=point('H-output','l',.93);
edge('F2','H-execute','H-output',[a,[a[0]+350,a[1]],[a[0]+350,coreBottom+540],[b[0]-80,coreBottom+540],[b[0]-80,b[1]],b],'F2  端侧快路：本地结果直接反馈，不必等待云端再判断','flow',[(a[0]+b[0])/2,coreBottom+540],3);

const SY=coreBottom+740;
const supH=Math.ceil(Math.max(...supplements.flatMap(m=>m.steps.map(s=>bodyHeight(s.paras,PW-200)+150)))/20)*20;
const srH=supH+170, sfirst=SY+HH+190,sBottom=sfirst+3*srH+supH+260;
supplements.forEach((m,i)=>{const g=headerGroup(m,i,SY);g.kind='supplement';chain(g,'H-'+m.id,m.steps,sfirst,srH,supH);g.h=sBottom-SY;rect(bg,g.x-28,SY-24,PW+56,g.h+48,C.white,'#D5DFE6',1.8,12);
 // 展开线由模块边界引出，不从业务最后一步制造一个假的串行步骤。
 if(m.id!=='advisor'){const p1=[g.x+PW/2,coreBottom+24],p2=point('H-'+m.id,'t');edge('X'+i,'H-'+m.parent,'H-'+m.id,[p1,p2],'','expand')}
});
// 独立入口、任务唤醒和运行都接回主链；跨区连接走框外空白，保留起终点语义。
a=point('VL4','b');b=point('TK4','b');
edge('K1','VL4','TK4',[a,[a[0],sBottom+110],[b[0],sBottom+110],b],'K1  条件回调：找回原任务；命中不等于已执行','return',[(a[0]+b[0])/2,sBottom+110]);
a=point('TK4','r',.65);b=point('H-dispatch','l',.93);
const tx=mainGroups[3].x+PW+385;
edge('K2','TK4','H-dispatch',[a,[tx,a[1]],[tx,b[1]],b],'K2','flow',[tx,coreBottom+665]);
graph.edges.at(-1).description='新 Task 的通用执行分支；GUI / Provider 分支按自身流程执行。';
a=point('AD3','r',.8);b=point('H-context','l',.93);
const arx=mainGroups[6].x+PW+375,alx=mainGroups[2].x-230,ay=sBottom+330;
edge('A1','AD3','H-context',[a,[arx,a[1]],[arx,ay],[alx,ay],[alx,b[1]],b],'A1  静态 Advisor 建议回 03；与用户 Query 共用同一决策入口','return',[(arx+alx)/2,ay]);

// 工具是替代能力目录，不把 27 个工具串成必须执行的流水线。
const TY=sBottom+540;
text(fg,400,TY,'06 的工具能力展开 · 27 项定义，不是 27 个必经步骤',40,C.deep,750);
text(fg,400,TY+64,'实际调用只选择当前需要的工具；定义数、车型注入数、后端可用数和真实成功覆盖必须分开。',28,C.sub);
const familyW=2020, familyGap=250, fy=TY+230,toolH=1020,toolGap=150;
toolFamilies.forEach((f,i)=>{const x=X+i*(familyW+familyGap),g={id:'family-'+i,title:f.title,x,y:fy,w:familyW,h:0,kind:'family',learn:['orchestration']};graph.groups.push(g);
 const head={id:'H-family-'+i,title:f.title,paras:[['能力类别',f.question]]};boxNode(head,g,x,fy,familyW,300,{kind:'module'});
 f.tools.forEach((t,j)=>{const ex=examples[t.n],s={id:'T'+t.n,title:String(t.n).padStart(2,'0')+'  '+t.cn,paras:[['真实工具名',t.name],['接到什么',t.input.join('；')+'。'],['内部机制',t.mechanism.join(' → ')+'。这些是当前定义能支持的业务步骤；具体模型、服务与 SDK 的分工仍需实现证据。'],['结果与边界',t.result.join('；')+'。'],['用一个例子追',ex[0]+'。'+ex[1]],['至少要拿到的证据','原始输入、领域解析、实际下游调用、业务结果与反馈关联；权限、幂等、超时和取消未写明的部分，需要逐项补契约。']]};
 const h=Math.max(toolH,bodyHeight(s.paras,familyW-200)+180); if(h>toolH)throw Error('工具高度不足 '+t.n+' need '+h);
 boxNode(s,g,x+50,fy+440+j*(toolH+toolGap),familyW-100,toolH,{kind:'tool'});
 });g.h=440+f.tools.length*(toolH+toolGap)-toolGap+150;rect(bg,x-26,fy-24,familyW+52,g.h+48,C.white,'#D5DFE6',1.8,12);
});
const railY=TY+155;edge('catalogue','H-execute','H-family-2',[[mainGroups[5].x+PW/2,sBottom+24],[mainGroups[5].x+PW/2,railY],[X+2*(familyW+familyGap)+familyW/2,railY],[X+2*(familyW+familyGap)+familyW/2,fy]],'','expand');
for(let i=0;i<6;i++){const x=X+i*(familyW+familyGap)+familyW/2; if(i!==2)edge('family-link'+i,'H-execute','H-family-'+i,[[mainGroups[5].x+PW/2,railY],[x,railY],[x,fy]],'','expand')}

const LY=fy+440+6*(toolH+toolGap)+390;
text(fg,400,LY,'产品自测与验收 · 不是背模块名，而是能用证据判断做没做成',40,C.deep,750);
text(fg,400,LY+66,'下面是建议指标口径，不是已达成数据，也不是离职硬门槛；主责深入到定位、评测、改进和验收，相邻模块掌握输入输出与故障归属。',27,C.sub);
let maxLearningBottom=0;
main.forEach((m,i)=>{const x=X+i*(PW+GAP),y=LY+160,keys=[...new Set(m.learn)],ls=keys.map(k=>learning[k]),qs=[...new Set(ls.flatMap(l=>l.questions))],ms=ls.flatMap(l=>l.metrics);
 const g={id:'learn-'+m.id,title:m.num+' '+m.title+' · 自测',x,y,w:PW,h:0,kind:'learning',learn:keys};graph.groups.push(g);
 let cy=y+58;text(fg,x+32,cy,m.num+'  '+m.title,31,C.deep,700);cy+=60;
 cy=lines(fg,x+32,cy,'掌握程度｜'+ls.map(l=>l.depth).join(' '),PW-64,27,42);cy+=32;
 cy=lines(fg,x+32,cy,'为什么｜'+ls.map(l=>l.why).join(' '),PW-64,27,42);cy+=58;
 text(fg,x+32,cy,'逐条问自己：能给出日志或案例吗？',29,C.deep,700);cy+=56;
 qs.forEach((q,j)=>{cy=lines(fg,x+32,cy,(j+1)+'. '+q,PW-64,27,42);cy+=26});cy+=30;
 text(fg,x+32,cy,'验收指标：明确分子、分母与证据',29,C.deep,700);cy+=58;
 for(const mm of ms){cy=lines(fg,x+32,cy,mm.name,PW-64,28,43,C.deep,700);cy+=14;for(const [l,t] of [['分子',mm.numerator],['分母',mm.denominator],['怎么测',mm.measure]]){cy=lines(fg,x+32,cy,l+'｜'+t,PW-64,26,40);cy+=13}cy+=30}
 g.h=cy-y+40;rect(bg,x-26,y-24,PW+52,g.h+48,C.white,'#D5DFE6',1.8,12);graph.nodes.push({id:'L-'+m.id,title:g.title,group:g.id,x,y,w:PW,h:g.h,kind:'learning',body:qs,paras:[],learn:keys});maxLearningBottom=Math.max(maxLearningBottom,cy);
});
const H=maxLearningBottom+260;graph.height=H;graph.layout={mainNodeHeight:mainH,mainGap:170,columnGap:GAP,coreBottom,supplementTop:SY,supplementBottom:sBottom,toolTop:TY,learningTop:LY,mainHeaderY:HY};
rect(bg,0,0,W,H,C.white,C.white,0,0);
// 把整张白底放在第一个元素；层级顺序对飞书原生批量导入也重要。
bg.unshift(bg.pop());
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs><marker id="arrow" markerWidth="11" markerHeight="10" refX="9" refY="5" orient="auto" markerUnits="strokeWidth"><path d="M0 0 L10 5 L0 10 z" fill="${C.blue}"/></marker></defs>${bg.join('\n')}${edges.join('\n')}${fg.join('\n')}${labels.join('\n')}</svg>`;
fs.writeFileSync(path.join(dir,'业务全链路-v12.svg'),svg);
fs.writeFileSync(path.join(dir,'graph-v12.json'),JSON.stringify(graph,null,2));
console.log(JSON.stringify({width:W,height:H,nodes:graph.nodes.length,edges:graph.edges.length,layout:graph.layout,characters:graph.nodes.reduce((n,s)=>n+s.body.join('').length,0)},null,2));
