import ELK from '/Users/bytedance/.npm/_npx/668c188756b835f3/node_modules/elkjs/lib/elk.bundled.js';
const elk=new ELK();
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
function wrap(s,max=23){const out=[];let line='',w=0;for(const c of String(s??'')){const cw=/[\x00-\xff]/.test(c)?.55:1;if(w+cw>max||c==='\n'){out.push(line);line='';w=0;}if(c!=='\n'){line+=c;w+=cw;}}if(line)out.push(line);return out;}
const text=(lines,x,y,size,color,weight=400)=>`<text x="${x}" y="${y}" font-size="${size}" fill="${color}" font-weight="${weight}">${lines.map((l,i)=>`<tspan x="${x}" dy="${i?size*1.5:0}">${esc(l)}</tspan>`).join('')}</text>`;
export async function drawSourceFlow(page,{overview=false,component=false}={}){
 if(page.id==='A'&&!component){
  const queryIds=new Set(['A16','A17','A18','A19','A20','A21','A22']);
  const sets=[page.steps.filter(s=>!queryIds.has(s.id)),page.steps.filter(s=>queryIds.has(s.id))];
  const titles=['持续观察、周期汇报与任务停止','按次问图：本次问题，本次回答'];
  const results=[];let y=60,width=0;
  for(let i=0;i<sets.length;i++){const ids=new Set(sets[i].map(s=>s.id));const r=await drawSourceFlow({...page,steps:sets[i],edges:page.edges.filter(e=>ids.has(e.from)&&ids.has(e.to))},{component:true});results.push({r,y,title:titles[i]});y+=r.geometry.height+120;width=Math.max(width,r.geometry.width);}
  const geometry={width,height:y,children:[],edges:[]};
  let svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${y}" viewBox="0 0 ${width} ${y}" role="img"><rect width="100%" height="100%" fill="white"/>`;
  for(const {r,y,title}of results){svg+=`<text x="40" y="${y-16}" font-family="PingFang SC,Microsoft YaHei,sans-serif" font-size="24" font-weight="600" fill="#203b50">${title}</text>`+r.svg.replace('<svg ',`<svg y="${y}" `);geometry.children.push(...r.geometry.children.map(n=>({...n,y:n.y+y})));geometry.edges.push(...r.geometry.edges.map(e=>({...e,sections:(e.sections||[]).map(s=>({...s,startPoint:{x:s.startPoint.x,y:s.startPoint.y+y},endPoint:{x:s.endPoint.x,y:s.endPoint.y+y},bendPoints:(s.bendPoints||[]).map(p=>({x:p.x,y:p.y+y}))}))})));}
  return {svg:svg+'</svg>',geometry};
 }
 const nodeMap=new Map(page.steps.map((s,i)=>[s.id,{...s,index:i+1}]));
 const children=page.steps.map((s,i)=>{const title=wrap(s.title,19),actor=wrap(s.actor,27),output=wrap(s.output,26);return {id:s.id,width:390,height:104+title.length*30+actor.length*24+output.length*24,_title:title,_actor:actor,_output:output};});
 const edges=page.edges.map((e,i)=>{if(!nodeMap.has(e.from)||!nodeMap.has(e.to))throw Error(page.id+' invalid edge '+JSON.stringify(e));const lines=wrap(e.label,19);return {id:'edge-'+i,sources:[e.from],targets:[e.to],labels:[{text:e.label,width:Math.max(90,Math.min(285,...lines.map(l=>l.length*15))),height:lines.length*24+12,_lines:lines}],_source:e};});
 function closesCycle(edge){const seen=new Set(),queue=[edge.targets[0]];while(queue.length){const id=queue.shift();if(id===edge.sources[0])return true;if(seen.has(id))continue;seen.add(id);for(const e of edges)if(e!==edge&&e.sources[0]===id)queue.push(e.targets[0]);}return false;}
 const feedback=page.id==='overview'?[]:edges.filter(e=>nodeMap.get(e.sources[0]).index>=nodeMap.get(e.targets[0]).index&&closesCycle(e));
 const forward=edges.filter(e=>!feedback.includes(e));
 const g=await elk.layout({id:page.id,layoutOptions:{'elk.algorithm':'layered','elk.direction':page.id==='overview'?'RIGHT':'DOWN','elk.aspectRatio':'0.65','elk.edgeRouting':'ORTHOGONAL','elk.spacing.nodeNode':'70','elk.layered.spacing.nodeNodeBetweenLayers':'100','elk.layered.spacing.edgeNodeBetweenLayers':'38','elk.spacing.edgeNode':'30','elk.spacing.edgeEdge':'24','elk.padding':'[top=44,left=40,bottom=44,right=40]','elk.layered.nodePlacement.strategy':'NETWORK_SIMPLEX','elk.layered.crossingMinimization.strategy':'LAYER_SWEEP','elk.edgeLabels.inline':'false'},children,edges:forward});
 const position=new Map(g.children.map(n=>[n.id,n]));
 const width=g.width;
 feedback.forEach((e,i)=>{const a=position.get(e.sources[0]),b=position.get(e.targets[0]),track=width+35+i*45;const sy=Math.max(...g.children.filter(n=>Math.abs(n.y-a.y)<2).map(n=>n.y+n.height))+32;const ty=b.y-24;g.edges.push({...e,sections:[{startPoint:{x:a.x+a.width/2,y:a.y+a.height},bendPoints:[{x:a.x+a.width/2,y:sy},{x:track,y:sy},{x:track,y:ty},{x:b.x+b.width/2,y:ty}],endPoint:{x:b.x+b.width/2,y:b.y}}],labels:[{text:e.labels[0].text,x:track+12,y:sy+8,width:e.labels[0].width,height:e.labels[0].height}]});});
 if(feedback.length)g.width=width+feedback.length*45+370;
 let svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${g.width}" height="${g.height}" viewBox="0 0 ${g.width} ${g.height}" role="img" aria-label="${esc(page.title||page.id)}"><title>${esc(page.title||page.id)}</title><defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 1L8 5L0 9" fill="none" stroke="#52728b" stroke-width="1.7"/></marker></defs><rect width="100%" height="100%" fill="#fff"/><g font-family="PingFang SC,Microsoft YaHei,sans-serif">`;
 for(const e of g.edges){for(const s of e.sections||[]){const pts=[s.startPoint,...(s.bendPoints||[]),s.endPoint];svg+=`<path d="${pts.map((p,i)=>(i?'L':'M')+p.x+','+p.y).join(' ')}" fill="none" stroke="#52728b" stroke-width="1.6" marker-end="url(#arrow)"/>`;}
 for(const l of e.labels||[]){svg+=`<rect x="${l.x-5}" y="${l.y-4}" width="${l.width+10}" height="${l.height+8}" rx="3" fill="#fff"/>`+text(wrap(l.text,19),l.x,l.y+20,15,'#435c70');}}
 for(const n of g.children){const s=nodeMap.get(n.id),href=overview?'#module/'+s.id:'#module/'+page.id+'/step/'+s.id;let y=n.y+29;svg+=`<a href="${esc(href)}"><g data-step="${esc(s.id)}"><rect x="${n.x}" y="${n.y}" width="${n.width}" height="${n.height}" rx="8" fill="#f5f9fc" stroke="#a9bdcd"/><rect x="${n.x}" y="${n.y}" width="5" height="${n.height}" rx="2" fill="#326785"/>`+text([s.id],n.x+20,y,13,'#6b7d8b');y+=32;svg+=text(n._title,n.x+20,y,20,'#203b50',600);y+=n._title.length*30+12;svg+=text(n._actor,n.x+20,y,16,'#375b71');y+=n._actor.length*24+15;svg+=text(n._output,n.x+20,y,16,'#566975');svg+='</g></a>';}
 svg+='</g></svg>';return {svg,geometry:g};
}
