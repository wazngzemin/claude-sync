import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import vm from 'node:vm';
import {crossed} from './routes.mjs';
const dir=path.dirname(fileURLToPath(import.meta.url));
const svg=fs.readFileSync(path.join(dir,'业务全链路-v11.svg'),'utf8'),g=JSON.parse(fs.readFileSync(path.join(dir,'graph-v11.json'),'utf8'));
const report={nodes:g.nodes.length,edges:g.edges.length,toolCount:g.nodes.filter(n=>n.tool).length,errors:[]};
const seen=new Set();for(const n of g.nodes){if(seen.has(n.id))report.errors.push('duplicate '+n.id);seen.add(n.id);if(n.x<0||n.y<0||n.x+n.w>g.width||n.y+n.h>g.height)report.errors.push('outside '+n.id)}
for(const e of g.edges){if(!seen.has(e.from)||!seen.has(e.to))report.errors.push('missing endpoint');if(e.labelOmitted)report.errors.push('omitted label '+e.from+'-'+e.to);for(let i=1;i<e.points.length;i++){const a=e.points[i-1],b=e.points[i];if(a[0]!==b[0]&&a[1]!==b[1])report.errors.push('diagonal');for(const n of g.nodes)if(n.id!==e.from&&n.id!==e.to&&crossed(a,b,n))report.errors.push('node crossing '+e.from+'-'+e.to+':'+n.id)}}
report.isolated=g.nodes.filter(n=>n.role!=='annotation'&&!g.edges.some(e=>e.from===n.id||e.to===n.id)).map(n=>n.id);
const adjacency=new Map(g.nodes.map(n=>[n.id,g.edges.filter(e=>e.from===n.id).map(e=>e.to)]));
function reachable(a,b){const todo=[a],seen=new Set();while(todo.length){const n=todo.pop();if(n===b)return true;if(seen.has(n))continue;seen.add(n);todo.push(...adjacency.get(n)||[])}return false}
for(const [a,b] of [['V1','O9'],['D1','O1'],['F9','P7'],['P8','P1'],['T7','P7'],['T16m','X1'],['K6','K7'],['S6','G3'],['O5','O1'],['U9','X8']])if(!reachable(a,b))report.errors.push('unreachable '+a+'→'+b);
const html=fs.readFileSync('/Users/bytedance/Desktop/3.23/产品/codex/HTML/02-已交付/豆包汽车-业务全链路-v11.html','utf8');
for(const m of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g))if(!m[1].includes('application/json'))new vm.Script(m[2]);
report.htmlJavaScript='syntax checked; browser file access blocked, no browser interaction verification claimed';
const cli='/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/.bin/whiteboard-cli';
const conversion=JSON.parse(execFileSync(cli,['-i',path.join(dir,'业务全链路-v11.svg'),'--to','openapi','--format','json'],{maxBuffer:24*1024*1024}).toString());
const native=conversion.data?.result||conversion;
fs.writeFileSync(path.join(dir,'native-v11.json'),JSON.stringify(native,null,2));
report.nativeNodes=native.nodes.length;report.nativeTypes=native.nodes.reduce((a,n)=>(a[n.type]=(a[n.type]||0)+1,a),{});
if(report.nativeTypes.image_shape||report.nativeTypes.image)report.errors.push('native conversion produced image');
// Local vector rendering only; no browser workaround is used for the blocked file URL.
const crops=[['core',4100,1660,3210,1000],['voice-fast',35,2770,4085,1030],['tools-travel',1750,4500,1680,1800],['task',3650,700,4050,885],['card',35,3830,10100,510]];
for(const [name,x,y,w,h]of crops){const s=svg.replace(/width="[\d.]+" height="[\d.]+" viewBox="[^"]+"/,`width="${w}" height="${h}" viewBox="${x} ${y} ${w} ${h}"`);const f=path.join(dir,'preview-'+name+'.svg');fs.writeFileSync(f,s);execFileSync('/opt/homebrew/bin/rsvg-convert',['-w',String(Math.min(w,2600)),f,'-o',path.join(dir,'preview-'+name+'.png')])}
fs.writeFileSync(path.join(dir,'verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(report.errors.length)process.exitCode=1;
