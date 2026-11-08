const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const measure=(s,size)=>[...s].reduce((n,c)=>n+(/[^\x00-\xff]/.test(c)?size:size*.56),0);
export function wrapCase(s,width,size=18){
 const lines=[];let line='';
 for(const c of String(s)){
  if(c==='\n'){lines.push(line);line='';continue;}
  if(line&&measure(line+c,size)>width&&!/[，。；：！？、）】》”’]/.test(c)){lines.push(line);line='';}
  line+=c;
 }if(line)lines.push(line);return lines;
}
const txt=(x,y,lines,size=18,color='#30485c',weight=400,lh=27)=>lines.map((s,i)=>`<text x="${x}" y="${y+i*lh}" font-size="${size}" fill="${color}" font-weight="${weight}">${esc(s)}</text>`).join('');
export function caseFlowDiagram(page,flow){
 const idx=new Map(flow.nodes.map((n,i)=>[n.id,i]));
 if(idx.size!==flow.nodes.length)throw Error('Duplicate nodes '+flow.id);
 const edges=flow.edges.map((e,i)=>({...e,index:i,adjacent:idx.get(e.to)===idx.get(e.from)+1}));
 for(const e of edges)if(!idx.has(e.from)||!idx.has(e.to))throw Error('Bad edge '+flow.id);
 const lateral=edges.filter(e=>!e.adjacent),lanes=[];
 for(const e of lateral){const span=[Math.min(idx.get(e.from),idx.get(e.to)),Math.max(idx.get(e.from),idx.get(e.to))];let lane=lanes.findIndex(items=>items.every(s=>s[1]<span[0]||span[1]<s[0]));if(lane<0){lane=lanes.length;lanes.push([]);}lanes[lane].push(span);e.lane=lane;}
 const x=lanes.length?300+lanes.length*28:48,w=660,width=x+w+48,positions=new Map(),geometry=[];
 const headingLines=wrapCase(flow.title,w,25),scopeLines=flow.scopeLabel?wrapCase(flow.scopeLabel,w,17):[];
 let y=40+headingLines.length*32+(scopeLines.length?scopeLines.length*25+12:0)+25;
 for(const n of flow.nodes){
  const title=wrapCase(n.title,w-48,22),body=[...(n.status?[...wrapCase(n.status,w-48,18),'']:[]),...arr(n.body).flatMap((s,i)=>[...(i?['']:[]),...wrapCase(s,w-48,18)])];
  const incident=lateral.filter(e=>e.from===n.id||e.to===n.id);let portY=35;
  const ports=new Map();for(const e of incident){const lines=wrapCase(e.label||'',200,16);const slot=Math.max(66,lines.length*23+20);ports.set(e.index,portY+slot/2);portY+=slot;}
  const h=Math.max(114,44+title.length*31+body.length*27+28,portY+20);
  const p={id:n.id,x,y,w,h,title,body,ports};positions.set(n.id,p);geometry.push({id:n.id,x,y,w,h});
  const next=edges.find(e=>e.from===n.id&&e.adjacent),labelHeight=next?wrapCase(next.label,280,16).length*23:0;
  y+=h+Math.max(100,labelHeight+55);
 }
 const palette=['#28716f','#a16b20','#446cb1','#85659d','#b45858','#5f7b42'];
 let paths='',labels='',cards='';const routes=[];
 for(const e of edges){
  const a=positions.get(e.from),b=positions.get(e.to),color=e.planned?'#7e8790':e.adjacent?'#44657f':palette[e.lane%palette.length];
  let points,labelX,labelY,labelLines;
  if(e.adjacent){points=[[x+w/2,a.y+a.h+4],[x+w/2,b.y-12]];labelLines=wrapCase(e.label,280,16);labelX=x+w/2+18;labelY=(a.y+a.h+b.y)/2-(labelLines.length-1)*11;}
  else{const lx=30+e.lane*28,sy=a.y+a.ports.get(e.index),ty=b.y+b.ports.get(e.index);points=[[x-3,sy],[lx,sy],[lx,ty],[x-12,ty]];labelLines=wrapCase(e.label,200,16);labelX=x-222;labelY=sy-(labelLines.length-1)*11-9;}
  routes.push({from:e.from,to:e.to,points});const list=points.map(p=>p.join(',')).join(' '),marker=`m-${flow.id}-${e.index}`;
  paths+=`<defs><marker id="${esc(marker)}" markerWidth="11" markerHeight="11" refX="9" refY="5.5" orient="auto"><path d="M0,1 L9,5.5 L0,10" fill="none" stroke="${color}" stroke-width="1.5"/></marker></defs><g class="business-edge"><title>${esc(a.id+' '+flow.nodes[idx.get(e.from)].title+' → '+flow.nodes[idx.get(e.to)].title+'；'+e.label)}</title><polyline points="${list}" fill="none" stroke="#fff" stroke-width="7"/><polyline points="${list}" fill="none" stroke="${color}" stroke-width="2.2" ${e.planned?'stroke-dasharray="8 6"':''} marker-end="url(#${esc(marker)})"/></g>`;
  const labelW=Math.min(e.adjacent?290:208,Math.max(20,...labelLines.map(s=>measure(s,16)))+10);labels+=`<rect x="${labelX-5}" y="${labelY-17}" width="${labelW}" height="${labelLines.length*23+5}" fill="#fff" rx="3"/>`+txt(labelX,labelY,labelLines,16,color,500,23);
 }
 for(const n of flow.nodes){const p=positions.get(n.id),kind=n.kind||(/是否|能否|满足|哪|判断|检查|选择/.test(n.title)?'decision':'process'),border=kind==='decision'?'#bc9154':'#80aaa6',fill=kind==='decision'?'#fff8eb':'#f0f8f6';cards+=`<g data-page="${esc(page.id)}" data-flow="${esc(flow.id)}" data-step="${esc(n.id)}" role="link" tabindex="0" aria-label="${esc(n.title)}"><rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="9" fill="${fill}" stroke="${border}" stroke-width="1.4"/>${txt(p.x+24,p.y+37,p.title,22,'#183b49',650,31)}${txt(p.x+24,p.y+53+p.title.length*31,p.body,18,'#30485c',400,27)}</g>`;}
 const height=y-45;
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" font-family="-apple-system,BlinkMacSystemFont,PingFang SC,Microsoft YaHei,sans-serif" role="img" aria-label="${esc(flow.title)}"><rect width="100%" height="100%" fill="#fff"/>${txt(x,40,headingLines,25,'#203949',650,32)}${txt(x,40+headingLines.length*32+4,scopeLines,17,'#526775',400,25)}${paths}${labels}${cards}</svg>`;
 return {svg,geometry,routes,edges,height,width};
}
function arr(x){return Array.isArray(x)?x:[];}
