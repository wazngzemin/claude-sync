// Rectilinear routing: group corridors, node boundaries, and no text-box crossings.
const eps=.01;
const inside=(p,r)=>p[0]>r.x+eps&&p[0]<r.x+r.w-eps&&p[1]>r.y+eps&&p[1]<r.y+r.h-eps;
const expand=(r,d)=>({x:r.x-d,y:r.y-d,w:r.w+2*d,h:r.h+2*d});
export function crossed(a,b,r){
 if(a[0]===b[0])return a[0]>r.x+eps&&a[0]<r.x+r.w-eps&&Math.max(a[1],b[1])>r.y+eps&&Math.min(a[1],b[1])<r.y+r.h-eps;
 if(a[1]===b[1])return a[1]>r.y+eps&&a[1]<r.y+r.h-eps&&Math.max(a[0],b[0])>r.x+eps&&Math.min(a[0],b[0])<r.x+r.w-eps;
 return true;
}
function simplify(ps){const out=[];for(const p of ps){if(out.length&&p[0]===out.at(-1)[0]&&p[1]===out.at(-1)[1])continue;while(out.length>1&&((p[0]===out.at(-1)[0]&&p[0]===out.at(-2)[0])||(p[1]===out.at(-1)[1]&&p[1]===out.at(-2)[1])))out.pop();out.push(p)}return out}
class Heap{constructor(){this.a=[]}push(v){const a=this.a;a.push(v);let i=a.length-1;while(i){const p=(i-1)>>1;if(a[p].f<=v.f)break;a[i]=a[p];i=p}a[i]=v}pop(){const a=this.a,top=a[0],v=a.pop();if(a.length){let i=0;while(i*2+1<a.length){let c=i*2+1;if(c+1<a.length&&a[c+1].f<a[c].f)c++;if(a[c].f>=v.f)break;a[i]=a[c];i=c}a[i]=v}return top}get length(){return this.a.length}}
function astar(start,end,obstacles,bounds,prior){
 const xs=new Set([start[0],end[0],bounds.x,bounds.x+bounds.w]),ys=new Set([start[1],end[1],bounds.y,bounds.y+bounds.h]);
 const obs=obstacles.filter(r=>r.x<bounds.x+bounds.w&&r.x+r.w>bounds.x&&r.y<bounds.y+bounds.h&&r.y+r.h>bounds.y);
 for(const r of obs){for(const x of [r.x,r.x+r.w])if(x>=bounds.x&&x<=bounds.x+bounds.w)xs.add(x);for(const y of [r.y,r.y+r.h])if(y>=bounds.y&&y<=bounds.y+bounds.h)ys.add(y)}
 const X=[...xs].sort((a,b)=>a-b),Y=[...ys].sort((a,b)=>a-b),nx=X.length,ny=Y.length;
 const blocked=new Uint8Array(nx*ny);
 for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const p=[X[i],Y[j]];if(obs.some(r=>inside(p,r)))blocked[j*nx+i]=1}
 const si=Y.indexOf(start[1])*nx+X.indexOf(start[0]),ti=Y.indexOf(end[1])*nx+X.indexOf(end[0]);
 if(blocked[si]||blocked[ti])return null;
 const dist=new Float64Array(nx*ny*2);dist.fill(Infinity);const prev=new Int32Array(nx*ny*2);prev.fill(-1);const heap=new Heap();
 for(let d=0;d<2;d++){dist[si*2+d]=0;heap.push({i:si,d,g:0,f:Math.abs(start[0]-end[0])+Math.abs(start[1]-end[1])})}
 let found=-1;
 while(heap.length){const q=heap.pop(),key=q.i*2+q.d;if(q.g!==dist[key])continue;if(q.i===ti){found=key;break}const x=q.i%nx,y=Math.floor(q.i/nx),a=[X[x],Y[y]];
  for(const [xx,yy,d] of [[x-1,y,0],[x+1,y,0],[x,y-1,1],[x,y+1,1]]){
   if(xx<0||xx>=nx||yy<0||yy>=ny)continue;const i=yy*nx+xx;if(blocked[i])continue;const b=[X[xx],Y[yy]];if(obs.some(r=>crossed(a,b,r)))continue;
   const len=Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1]);
   let occupancy=0;for(const seg of prior){if(d===0&&seg.a[1]===seg.b[1]&&seg.a[1]===a[1]){const overlap=Math.min(Math.max(seg.a[0],seg.b[0]),Math.max(a[0],b[0]))-Math.max(Math.min(seg.a[0],seg.b[0]),Math.min(a[0],b[0]));if(overlap>0)occupancy+=Math.min(60,overlap*.15)}else if(d===1&&seg.a[0]===seg.b[0]&&seg.a[0]===a[0]){const overlap=Math.min(Math.max(seg.a[1],seg.b[1]),Math.max(a[1],b[1]))-Math.max(Math.min(seg.a[1],seg.b[1]),Math.min(a[1],b[1]));if(overlap>0)occupancy+=Math.min(60,overlap*.15)}}
   const cost=q.g+len+(d!==q.d?65:0)+occupancy,k=i*2+d;
   if(cost<dist[k]){dist[k]=cost;prev[k]=key;heap.push({i,d,g:cost,f:cost+Math.abs(b[0]-end[0])+Math.abs(b[1]-end[1])})}
  }
 }
 if(found<0)return null;const ps=[];for(let k=found;k>=0;k=prev[k]){const i=k>>1;ps.push([X[i%nx],Y[Math.floor(i/nx)]])}return simplify(ps.reverse());
}
function anchor(n,s){return s==='r'?[n.x+n.w,n.y+n.h/2]:s==='l'?[n.x,n.y+n.h/2]:s==='t'?[n.x+n.w/2,n.y]:[n.x+n.w/2,n.y+n.h]}
const delta={r:[1,0],l:[-1,0],t:[0,-1],b:[0,1]};
export function routeAll(graph){
 const nodes=new Map(graph.nodes.map(n=>[n.id,n])),groups=new Map(graph.groups.map(g=>[g.id,g]));const prior=[];let changed=0;
 for(const e of graph.edges){
  const a=nodes.get(e.from),b=nodes.get(e.to),sa=e.sa||((b.x>=a.x+a.w)?'r':b.x+b.w<=a.x?'l':b.y>a.y?'b':'t'),ta=e.ta||({r:'l',l:'r',t:'b',b:'t'}[sa]);
  const start=anchor(a,sa),end=anchor(b,ta),stub=10;
  const sp=start.map((v,i)=>v+delta[sa][i]*stub),tp=end.map((v,i)=>v+delta[ta][i]*stub);
  const obstacles=graph.nodes.map(n=>expand(n,8));
  for(const g of graph.groups){
   if(g.id!==a.group&&g.id!==b.group)obstacles.push(expand(g,10));
   else {obstacles.push({x:g.x+2,y:g.y+1,w:g.w-4,h:67});obstacles.push({x:g.x+12,y:g.y+g.h-120,w:g.w-24,h:108})}
  }
  let clean=true;for(let i=1;i<e.points.length;i++){const u=e.points[i-1],v=e.points[i];if(u[0]!==v[0]&&u[1]!==v[1]){clean=false;break}if(obstacles.some(r=>{if((i===1&&inside(start,r))||(i===e.points.length-1&&inside(end,r)))return false;return crossed(u,v,r)})){clean=false;break}}
  // Straight adjacent connections are already optimal and preserve aligned ports.
  if(clean&&e.points.length===2){e.points=[start,end]}else{
   const same=a.group===b.group,g=groups.get(a.group);
   let bounds=same?{x:g.x+10,y:g.y+70,w:g.w-20,h:g.h-192}:{x:34,y:146,w:graph.width-68,h:graph.height-180};
   let ps=astar(sp,tp,obstacles,bounds,prior);
   if(!ps&&same){bounds={x:g.x-24,y:g.y-24,w:g.w+48,h:g.h+48};ps=astar(sp,tp,obstacles,bounds,prior)}
   if(!ps)throw Error(`无法路由 ${e.from} → ${e.to} ports ${sa}/${ta}`);
   e.points=simplify([start,...ps,end]);changed++;
  }
  for(let i=1;i<e.points.length;i++)prior.push({a:e.points[i-1],b:e.points[i]});
 }
 const violations=[];for(const e of graph.edges)for(let i=1;i<e.points.length;i++){const a=e.points[i-1],b=e.points[i];if(a[0]!==b[0]&&a[1]!==b[1])violations.push(`diagonal:${e.from}-${e.to}`);for(const n of graph.nodes)if(n.id!==e.from&&n.id!==e.to&&crossed(a,b,n))violations.push(`cross:${e.from}-${e.to}:${n.id}`)}
 if(violations.length)throw Error(violations.join('\n'));return {rerouted:changed,violations:violations.length};
}
