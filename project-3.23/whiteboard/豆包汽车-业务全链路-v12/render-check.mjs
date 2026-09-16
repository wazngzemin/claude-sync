import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const dir=path.dirname(fileURLToPath(import.meta.url)),svg=fs.readFileSync(path.join(dir,'业务全链路-v12.svg'),'utf8'),g=JSON.parse(fs.readFileSync(path.join(dir,'graph-v12.json'),'utf8'));
const report={errors:[],nodeCount:g.nodes.length,edgeCount:g.edges.length,tools:g.nodes.filter(n=>n.kind==='tool').length,columnsGap:g.layout.columnGap,localStepGap:g.layout.mainGap};
const ids=new Set(g.nodes.map(n=>n.id));
if(ids.size!==g.nodes.length)report.errors.push('重复节点');
function crossed(a,b,n){if(a[0]===b[0])return a[0]>n.x+2&&a[0]<n.x+n.w-2&&Math.max(a[1],b[1])>n.y+2&&Math.min(a[1],b[1])<n.y+n.h-2;if(a[1]===b[1])return a[1]>n.y+2&&a[1]<n.y+n.h-2&&Math.max(a[0],b[0])>n.x+2&&Math.min(a[0],b[0])<n.x+n.w-2;return false}
for(const e of g.edges){if(!ids.has(e.from)||!ids.has(e.to))report.errors.push('悬空连接 '+e.id);for(let j=1;j<e.points.length;j++){const a=e.points[j-1],b=e.points[j];if(a[0]!==b[0]&&a[1]!==b[1])report.errors.push('斜线 '+e.id);for(const n of g.nodes)if(n.id!==e.from&&n.id!==e.to&&crossed(a,b,n))report.errors.push('连接穿框 '+e.id+' '+n.id)}}
for(const n of g.nodes)if(n.x<0||n.y<0||n.x+n.w>g.width||n.y+n.h>g.height)report.errors.push('越界 '+n.id);
const cuts=[['main-overview',200,320,13520,4900,3100],['planner-pair',5380,900,3100,1720,2600],['first-node',400,1350,1220,1060,1220],['feedback-return',3760,350,10000,1150,2800],['task',5380,5750,1460,3900,1460],['tool-memory',7210,10830,2020,2250,1500]];
for(const [name,x,y,w,h,pw] of cuts){const cut=svg.replace(/width="[\d.]+" height="[\d.]+" viewBox="[^"]+"/,`width="${w}" height="${h}" viewBox="${x} ${y} ${w} ${h}"`);const fp=path.join(dir,'preview-'+name+'.svg');fs.writeFileSync(fp,cut);execFileSync('/opt/homebrew/bin/rsvg-convert',['-w',String(pw),fp,'-o',path.join(dir,'preview-'+name+'.png')])}
const cli='/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/.bin/whiteboard-cli';
const cv=JSON.parse(execFileSync(cli,['-i',path.join(dir,'业务全链路-v12.svg'),'--to','openapi','--format','json'],{maxBuffer:48*1024*1024}));
if(cv.code!==0)throw Error(JSON.stringify(cv).slice(0,1000));
const native=cv.data.result;fs.writeFileSync(path.join(dir,'native-v12.json'),JSON.stringify(native,null,2));
report.nativeNodes=native.nodes.length;report.nativeTypes=native.nodes.reduce((a,n)=>(a[n.type]=(a[n.type]||0)+1,a),{});
if(report.nativeTypes.image_shape||report.nativeTypes.image)report.errors.push('不可编辑图片元素');
fs.writeFileSync(path.join(dir,'verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
if(report.errors.length)process.exitCode=1;
