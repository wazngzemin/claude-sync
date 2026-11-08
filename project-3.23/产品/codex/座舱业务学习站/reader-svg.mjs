import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {JSDOM}=require('/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/jsdom');
const NS='http://www.w3.org/2000/svg';
const widthOf=(text,size)=>[...text].reduce((sum,c)=>sum+(/[^\x00-\xff]/.test(c)?1:/[MW@]/.test(c)?.8:/[il .,]/.test(c)?.3:.56)*size,0);
export function wrapReaderText(text,width,size){
 const lines=[];let line='';
 for(const char of String(text)){
  if(char==='\n'){if(line)lines.push(line);line='';continue;}
  if(line&&widthOf(line+char,size)>width&&!/[，。；、！？）”’]/.test(char)){lines.push(line);line='';}
  line+=char;
 }
 if(line)lines.push(line);
 return lines;
}

export function readerOriginalSvg(original,base){
 const dom=new JSDOM(original,{contentType:'image/svg+xml'}),doc=dom.window.document;
 const report={nodes:[],tools:[],errors:[]};
 const text=(group,content,x,y,width,size=25,weight=400,color='#163352',lineHeight=size*1.4)=>{
  const lines=Array.isArray(content)?content.flatMap(s=>wrapReaderText(s,width,size)):wrapReaderText(content,width,size);
  const el=doc.createElementNS(NS,'text');
  for(const [key,value]of Object.entries({x,y,'font-size':size,'font-weight':weight,fill:color}))el.setAttribute(key,String(value));
  lines.forEach((line,i)=>{const span=doc.createElementNS(NS,'tspan');span.setAttribute('x',String(x));span.setAttribute('dy',String(i?lineHeight:0));span.textContent=line;el.appendChild(span);});
  group.appendChild(el);return y+Math.max(0,lines.length-1)*lineHeight;
 };
 for(const module of base.modules){
  const frame=doc.querySelector(`.module-frame[data-module="${module.id}"]`);
  if(frame){const lines=[...frame.children].filter(n=>n.tagName==='text');if(lines[1]){const el=lines[1];const x=+el.getAttribute('x'),y=+el.getAttribute('y');el.remove();text(frame,module.subtitle,x,y,module.w-80,25);}}
  for(const node of module.nodes){
   const group=doc.querySelector(`g.node[data-node="${node.id}"]`);
   if(!group)throw Error('Original SVG missing '+node.id);
   const border=group.querySelector('rect').cloneNode(true);
   group.replaceChildren(border);group.setAttribute('aria-label',node.title);
   const x=node.x+26,w=node.w-52,bottom=node.y+node.h-44;
   text(group,node.id,x,node.y+32,w,18,600,'#62758A');
   const titleEnd=text(group,node.title,x,node.y+76,w,30,600);
   const linesEnd=text(group,node.lines,x,titleEnd+52,w,25,500);
   let size=25,detailStart=linesEnd+54,last=0;
   const measure=s=>node.paragraphs.reduce((height,p)=>height+wrapReaderText(p,w,s).length*s*1.38+14,-14);
   while(size>21&&detailStart+measure(size)>bottom)size-=.5;
   let y=detailStart;
   for(const paragraph of node.paragraphs){last=text(group,paragraph,x,y,w,size,400,'#163352',size*1.38);y=last+size*1.38+14;}
   if(last>bottom)report.errors.push({id:node.id,last,bottom});
   report.nodes.push({id:node.id,size,last,bottom});
  }
 }
 for(const edge of base.edges){
  const group=doc.querySelector(`.edge-label[data-edge="${edge.id}"]`);if(!group)continue;
  const el=group.querySelector('text');if(!el)continue;
  if(['V-14','I-11','I-12','I-13','X33'].includes(edge.id)){
   const rect=group.querySelector('rect'),x=+el.getAttribute('x'),y=+el.getAttribute('y'),size=+el.getAttribute('font-size');
   el.remove();text(group,edge.label,x,y,+rect.getAttribute('width')-20,size,400,'#163352');
  }
 }
 for(const tool of [...base.tools,...base.supplementalDefinitions]){
  const group=doc.querySelector(`g[data-tool="${tool.id}"]`);if(!group)throw Error('SVG missing tool '+tool.id);
  const border=group.querySelector('rect').cloneNode(true);group.replaceChildren(border);
  const x=tool.x+30,w=tool.w-60,bottom=tool.y+tool.h-35;
  let y=text(group,tool.label||tool.name,x,tool.y+51,w,33,600)+45;
  y=text(group,tool.name,x,y,w,23,400,'#2463C5')+50;
  let size=25;const paragraphs=[tool.intro,...tool.paragraphs,tool.status];
  const measure=s=>paragraphs.reduce((height,p)=>height+wrapReaderText(p,w,s).length*s*1.4+18,-18);
  while(size>21&&y+measure(size)>bottom)size-=.5;
  let last=y;
  for(const paragraph of paragraphs){last=text(group,paragraph,x,y,w,size);y=last+size*1.4+18;}
  if(last>bottom)report.errors.push({id:tool.id,last,bottom});
  report.tools.push({id:tool.id,size,last,bottom});
 }
 if(report.errors.length)throw Error('Reader diagram text overflow '+JSON.stringify(report.errors));
 const root=doc.documentElement;root.setAttribute('aria-label','豆包汽车业务完整图，节点文字与课堂正文同步');
 root.setAttribute('font-family','-apple-system, BlinkMacSystemFont, PingFang SC, Microsoft YaHei, sans-serif');
 const output=root.outerHTML;dom.window.close();
 return {svg:output,report};
}
