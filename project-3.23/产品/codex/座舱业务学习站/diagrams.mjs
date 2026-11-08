import fs from 'node:fs';
const source=fs.readFileSync('/Users/bytedance/.codex/skills/baoyu-diagram/references/svg-template.md','utf8');
const boilerplate=source.match(/```svg\n([\s\S]*?<\/defs>)/)[1];
const esc=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const width=(s,size=12)=>[...String(s)].reduce((a,c)=>a+(c.charCodeAt(0)>255?size+1:size*.58),0);
function wrap(s,max,size=12){
 let lines=[],line='';
 const tokens=(String(s).match(/[a-zA-Z0-9_./:-]+|[^\n]/g)||[]).flatMap(token=>width(token,size)>max?[...token]:[token]);
 for(const t of tokens){
  if(width(line+t,size)>max&&line){
   // Keep closing punctuation with the preceding word instead of starting a line with it.
   if(/^[，。；：！？、）】〕》〉”’,.;!?%)\]]+$/.test(t)){
    const match=line.match(/([a-zA-Z0-9_./:-]+|.)\s*$/u);
    const tail=match?.[0]||'';
    const before=line.slice(0,line.length-tail.length).trimEnd();
    if(before&&width(tail.trim()+t,size)<=max){lines.push(before);line=tail.trim()+t;continue;}
   }
   const opening=line.match(/[（【〔《〈“‘(\[]+$/u)?.[0]||'';
   const before=opening?line.slice(0,-opening.length):line;
   if(before.trim())lines.push(before.trimEnd());
   line=(opening+t).trimStart();
  }else line+=t;
 }
 if(line.trim())lines.push(line.trimEnd());
 return lines;
}
const text=(x,y,lines,cl='ts',anchor='start')=>lines.map((s,i)=>`<text class="${cl}" x="${x}" y="${y+i*19}" text-anchor="${anchor}" dominant-baseline="central">${esc(s)}</text>`).join('');
function svg(content,h,id){return boilerplate.replace('680 H','680 '+h).replaceAll('id="arrow"','id="arrow-'+id+'"')+content.replaceAll('url(#arrow)','url(#arrow-'+id+')')+'</svg>';}
const rectOverlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;

export function flowDiagram(page,flow){
 const nodeIndex=new Map(flow.nodes.map((n,i)=>[n.id,i]));
 const isAdjacent=e=>nodeIndex.get(e.to)===nodeIndex.get(e.from)+1;
 const branchOut=id=>flow.edges.filter(e=>e.from===id&&!isAdjacent(e));
 const branchIn=id=>flow.edges.filter(e=>e.to===id&&!isAdjacent(e));
 const sideNotes=n=>[...(n.phase?[n.phase]:[]),...(flow.annotateBranches?branchOut(n.id).map(e=>`E${flow.edges.indexOf(e)+1} · ${e.label}`):[])].map(note=>wrap(note,100,12));
 let pos=new Map(),y=flow.scopeLabel?142:106,geometry=[];
 for(const n of flow.nodes){const title=wrap(`${n.id} · ${n.title}`,306,14),body=(n.body||[]).flatMap((paragraph,index)=>[...(index?['']:[]),...wrap(paragraph,306,12)]);let h=32+title.length*21+body.length*19;const branches=branchOut(n.id).length+branchIn(n.id).length;const notes=sideNotes(n);const notesHeight=notes.reduce((total,lines)=>total+lines.length*19+12,0)+24;h=Math.max(78,h,branches?40+(branches+1)*24:0,notes.length?notesHeight:0);const p={x:180,y,w:340,h,title,body};pos.set(n.id,p);geometry.push({id:n.id,...p});const outgoing=flow.edges.find(e=>e.from===n.id&&isAdjacent(e));const labelHeight=outgoing?wrap('E'+(flow.edges.indexOf(outgoing)+1)+' · '+outgoing.label,230).length*19:0;y+=h+Math.max(80,labelHeight+26);}
 let connectors='',labels='',cards='',routes=[];
 flow.edges.forEach((e,i)=>{const a=pos.get(e.from),b=pos.get(e.to);if(!a||!b)throw Error('Missing flow endpoint '+flow.id+' '+e.from+' '+e.to);let pts;
  const adjacent=isAdjacent(e);
  if(adjacent)pts=[[350,a.y+a.h+4],[350,b.y-10]];
  else{const lane=30+i*10;const outgoing=branchOut(e.from),incoming=branchIn(e.to);const sy=a.y+20+(outgoing.indexOf(e)+1)*24,ty=b.y+b.h-20-(incoming.length-incoming.indexOf(e))*24;pts=[[a.x-4,sy],[lane,sy],[lane,ty],[b.x-10,ty]];}
  routes.push({from:e.from,to:e.to,points:pts});
  connectors+=`<polyline class="${e.planned?'arr-alt':'arr'}" fill="none" points="${pts.map(p=>p.join(',')).join(' ')}" marker-end="url(#arrow)"><title>${esc(e.from+' → '+e.to+'：'+e.label)}</title></polyline>`;
  const edgeText=adjacent?wrap('E'+(i+1)+' · '+e.label,230):['E'+(i+1)];
  labels+=text(adjacent?365:a.x-12,adjacent?(a.y+a.h+b.y)/2-(edgeText.length-1)*9:pts[0][1]-8,edgeText,'ts',adjacent?'start':'end');
  if(!adjacent)labels+=text(b.x-12,pts.at(-1)[1]+12,['E'+(i+1)],'ts','end');
 });
 for(const n of flow.nodes){const p=pos.get(n.id);cards+=`<g class="c-${n===flow.nodes[0]||n===flow.nodes.at(-1)||/规划|待|建议|未/.test(n.status||'')?'gray':'teal'}" role="link" tabindex="0" data-page="${esc(page.id)}" data-flow="${esc(flow.id)}" data-step="${esc(n.id)}" aria-label="${esc(n.title)}"><title>${esc((n.body||[]).join('；'))}</title><rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="6"/>${text(p.x+18,p.y+24,p.title,'th')}${text(p.x+18,p.y+31+p.title.length*21,p.body)}</g>`;let noteY=p.y+24;for(const note of sideNotes(n)){cards+=text(540,noteY,note,'anno');noteY+=note.length*19+12;}}
 let legendY=y+4;let legend=text(40,legendY,['连接条件与分支'],'th');legendY+=30;
 flow.edges.forEach((e,i)=>{const a=flow.nodes.find(n=>n.id===e.from),b=flow.nodes.find(n=>n.id===e.to);let lines=wrap(`E${i+1} ${a.title} → ${b.title}：${e.label}${e.planned?'〔规划/待核〕':''}`,600);legend+=text(40,legendY,lines);legendY+=lines.length*19+14;});
 const h=legendY+28,head=text(340,38,wrap(flow.title,580,20),'title','middle')+text(340,76,['实线：本流程关系　虚线：规划或待核关系'],'ts','middle')+(flow.scopeLabel?text(340,103,wrap(flow.scopeLabel,580,12),'anno','middle'):'');
 return {svg:svg(head+connectors+labels+cards+legend,h,flow.id),geometry,edges:flow.edges,routes,height:h};
}

export function overviewDiagram(){
 // A connected business map, not a claim that all supporting modules run serially.
 const rows=[
  ['V','听见并形成正式输入',[['W','可见即可说','当前页面的可操作词']]],
  ['R','确定入口与端云采信',[['I','插话与恢复','新话与旧工作分别处理']]],
  ['M','输入管理首期方案',[['EV','事件','已经发生的业务事实']]],
  ['C','准备本轮相关背景',[['B','信号与状态','当前值、时间与可信度'],['A','视觉感知','持续观察与主动问图'],['K','Memory 与身份','生产、检索、使用和管理']]],
  ['D','Planner / Director',[['F','能力准入','当前可用工具与协议'],['S','Advisor 主动服务','有价值且合时机的建议'],['T','长期任务','保存目标、等待和管理']]],
  ['E','执行工具并回流',[['DR','司机 Agent · 舱驾融合','智驾专项判断、交办和反馈'],['P','场景配置','条件、范围、发布和生效'],['G','云端触发器','检查条件并派发业务'],['L','端侧闭环','本地确认和实际结果']]],
  ['O','用户听见、看见、做成',[['U','任务中心与卡片','展示、确认、管理和补齐'],['H','静默展示与 PHUD','独立输出与曝光结果']]]
 ];
 let nodes=[],y=100;
 const mainBody={V:'收音、识别、判停，形成最终文本',R:'有效诉求分流与唯一执行采信',M:'组织用户请求、建议与事件',C:'取相关且被允许使用的本轮背景',D:'缺信息先查，再决定说什么、做什么',E:'按工具合同执行，回传真实结果',O:'实际播放、界面曝光和车辆效果'};
 for(const [id,title,side]of rows){nodes.push({id,title,body:mainBody[id],x:82,y:y+Math.max(0,(side.length-1)*48),w:248,h:74});side.forEach(([sid,st,sb],i)=>nodes.push({id:sid,title:st,body:sb,x:404,y:y+i*108,w:236,h:74}));y+=Math.max(1,side.length)*108+65;}
 nodes.push({id:'EL',title:'事件日志',body:'保存事实、查询证据与消费边界',x:82,y,w:248,h:74},{id:'SE',title:'自进化与专家知识',body:'知识准备、动态加载与评测',x:404,y,w:236,h:74});
 const es=[['V','R','正式请求'],['R','M','云端承接'],['M','C','本轮许可'],['C','D','相关背景'],['D','E','明确动作'],['E','O','真实结果核验']];
 for(const [id,,side]of rows)for(const [sid]of side)es.push([id,sid,'关联模块入口；并非固定调用顺序','reference']);
 es.push(['E','D','同步反馈保留原目标，续轮先取得输入管理许可，再调用 Director'],['D','O','话术与表情分支；不必经过工具，可与动作并行'],['EV','EL','按事件定义记录业务事实'],['EL','K','被允许的事实进入异步记忆生产'],['EL','SE','经筛选的交互与执行记录'],['SE','C','评测与发布后的知识/提示更新','planned']);
 const nm=new Map(nodes.map(n=>[n.id,n]));let lines='',cards='',routes=[];let legendY=y+130;
 es.forEach(([from,to,label,type],i)=>{const a=nm.get(from),b=nm.get(to);let pts;
  if(type==='reference')pts=[[a.x+a.w+4,a.y+37],[367,a.y+37],[367,b.y+37],[b.x-8,b.y+37]];
  else if(i<6)pts=[[a.x+a.w/2,a.y+a.h+3],[b.x+b.w/2,b.y-9]];
  else if(from==='E')pts=[[a.x-4,a.y+37],[48,a.y+37],[48,b.y+37],[b.x-9,b.y+37]];
  else if(from==='D'&&to==='O')pts=[[a.x-4,a.y+37],[66,a.y+37],[66,b.y+37],[b.x-9,b.y+37]];
  else if(from==='EV')pts=[[a.x+a.w+3,a.y+37],[652,a.y+37],[652,b.y-26],[206,b.y-26],[206,b.y-9]];
  else if(to==='K')pts=[[a.x-3,a.y+37],[20,a.y+37],[20,b.y+37],[b.x-9,b.y+37]];
  else if(from==='SE')pts=[[a.x+a.w+3,a.y+37],[672,a.y+37],[672,b.y-18],[206,b.y-18],[206,b.y-9]];
  else pts=[[a.x+a.w+3,a.y+37],[b.x-9,b.y+37]];
  routes.push({from,to,points:pts});
  const cl=type==='reference'?'leader':type==='planned'?'arr-alt':'arr';
  lines+=`<polyline class="${cl}" fill="none" points="${pts.map(p=>p.join(',')).join(' ')}" ${type==='reference'?'':'marker-end="url(#arrow)"'}><title>${esc(from+' → '+to+'：'+label)}</title></polyline>`;
  if(i<6)lines+=text(220,(a.y+a.h+b.y)/2,[label]);
  if(from==='E'&&to==='D')lines+=`<text class="ts" transform="translate(40 ${(a.y+b.y)/2}) rotate(-90)" text-anchor="middle">同步反馈 → 原目标续轮</text>`;
  if(from==='D'&&to==='O')lines+=`<text class="ts" transform="translate(76 ${(a.y+b.y)/2}) rotate(-90)" text-anchor="middle">话术与表情分支</text>`;
  if(type!=='reference'){const l=wrap(`${a.title} → ${b.title}：${label}${type==='planned'?'〔方向，非自动上线〕':''}`,600);lines+=text(40,legendY,l);legendY+=l.length*19+9;}
 });
 for(const n of nodes)cards+=`<g class="c-${['EV','EL','K','SE'].includes(n.id)?'teal':'gray'}" role="link" tabindex="0" data-page="${n.id}" aria-label="${esc(n.title)}"><rect x="${n.x}" y="${n.y}" width="${n.w}" height="74" rx="6"/>${text(n.x+14,n.y+23,wrap(n.title,n.w-28,14),'th')}${text(n.x+14,n.y+51,wrap(n.body,n.w-28,12))}</g>`;
 return {svg:svg(text(340,34,['从主链进入每个模块'],'title','middle')+text(340,65,['带箭头实线：主链/回流　带箭头虚线：改进方向'],'ts','middle')+text(340,84,['无箭头点线：相关模块入口，不代表固定调用顺序'],'ts','middle')+lines+cards,legendY+24,'overview'),nodes,edges:es,routes};
}

export function validateGeometry(diagram){
 let errors=[];const nodes=diagram.geometry||diagram.nodes;
 for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++)if(rectOverlap(nodes[i],nodes[j]))errors.push('overlap '+nodes[i].id+'/'+nodes[j].id);
 for(const r of diagram.routes||[])for(let i=1;i<r.points.length;i++){
  const [a,b]=[r.points[i-1],r.points[i]];
  for(const n of nodes){if(n.id===r.from||n.id===r.to)continue;
   const vertical=a[0]===b[0]&&a[0]>n.x&&a[0]<n.x+n.w&&Math.max(a[1],b[1])>n.y&&Math.min(a[1],b[1])<n.y+n.h;
   const horizontal=a[1]===b[1]&&a[1]>n.y&&a[1]<n.y+n.h&&Math.max(a[0],b[0])>n.x&&Math.min(a[0],b[0])<n.x+n.w;
   if(vertical||horizontal)errors.push('edge '+r.from+'→'+r.to+' crosses '+n.id);
  }
 }
 return errors;
}
