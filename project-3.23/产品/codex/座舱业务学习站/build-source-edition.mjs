import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {drawSourceFlow} from './source-diagrams.mjs';
const root=path.dirname(fileURLToPath(import.meta.url));
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const previous=read('site-data.json');
const packs=['main','async','support'].map(k=>read('content/source-rebuild-'+k+'.json'));
const groups=[{title:'用户请求与执行闭环',ids:['V','R','M','C','D','E','O']},{title:'专项执行',ids:['DR']},{title:'信息从哪里来',ids:['B','A','K','EV','EL']},{title:'持续任务与主动服务',ids:['T','G','L','S']},{title:'用户交互与展示',ids:['I','W','H','U']},{title:'配置与能力建设',ids:['F','P','SE']}];
const oldPages=new Map(previous.pages.map(p=>[p.id,p]));
const newPages=new Map(packs.flatMap(p=>p.pages).map(p=>[p.id,p]));
const pages=groups.flatMap(g=>g.ids.map(id=>({...newPages.get(id),id,title:oldPages.get(id).shortTitle||oldPages.get(id).title,category:g.title})));
const prose=read('content/source-rebuild-prose.json');for(const p of pages)for(const step of p.steps)if(prose[step.id])step.detail=prose[step.id];
const visualOrder=['A01','A02','A03','A04','A23','A05','A06','A07','A08','A09','A24','A25','A10','A11','A12','A13','A14','A15','A26','A16','A17','A18','A19','A20','A21','A22'];pages.find(p=>p.id==='A').steps.sort((a,b)=>visualOrder.indexOf(a.id)-visualOrder.indexOf(b.id));
const sources=previous.sources;
const ids=new Set(sources.map(s=>s.id));
for(const p of pages){if(!p.steps?.length)throw Error('missing page '+p.id);const nodeIds=new Set(p.steps.map(s=>s.id));if(nodeIds.size!==p.steps.length)throw Error('duplicate step '+p.id);for(const s of p.steps){for(const field of ['actor','title','detail','output','sourceIds'])if(!s[field])throw Error(p.id+' missing '+field);for(const id of s.sourceIds)if(!ids.has(id))throw Error('unknown source '+id);}for(const e of p.edges)if(!nodeIds.has(e.from)||!nodeIds.has(e.to))throw Error('bad endpoint '+JSON.stringify(e));}
const supplementalEdges=[
 ['R','O','快路径执行结果，不经 Planner'],['B','C','当前状态按需进入上下文'],['A','T','动态任务观察结果回传'],['T','A','下发动态视觉任务列表'],['T','G','注册条件与接收触发回调'],['G','T','任务场景的条件命中回调'],['A','E','按次问图结果回工具'],['K','C','画像、摘要与检索记忆'],['EV','EL','生产并记录业务事件'],['EL','C','按需查询事件历史'],['EL','K','供记忆生成读取'],['T','S','任务反馈进入主动推荐'],['S','M','建议或主动推荐回流'],['L','A','端侧任务生命周期与感知调用'],['P','G','发布规则配置'],['G','H','静默通知出口'],['U','T','查看、删除或暂停任务'],['T','U','任务状态供展示'],['W','R','未命中页面词时回普通链路'],['I','M','打断与后续输入'],['O','I','播报期间接收插话'],['F','E','工具注册与执行协议'],['F','D','可调用能力描述'],['SE','C','动态示例检索结果']
].map(([from,to,label])=>({from,to,label}));
const overviewEdges=[...packs[0].overviewEdges,...supplementalEdges];
const toolAuditFile=path.join(root,'content/source-rebuild-tool-audit.json');
const toolAudit=fs.existsSync(toolAuditFile)?read('content/source-rebuild-tool-audit.json'):{corrections:[],quarantine:[]};
const corrections=new Map(toolAudit.corrections.map(t=>[t.id,t]));
const quarantined=new Map(toolAudit.quarantine.map(t=>[t.id,t.reason]));
const tools=[...previous.base.tools,...previous.base.supplementalDefinitions].map(t=>({...t,...corrections.get(t.id)})).map(t=>quarantined.has(t.id)?{...t,intro:'此项在资料中有能力入口定义。',paragraphs:[],status:'当前资料只定义能力入口，尚未提供可核对的内部处理合同。'}:t);
let maxVersion=0;const htmlRoot=path.resolve(root,'../HTML');for(const dir of ['01-进行中','02-已交付','03-历史版本'])for(const f of fs.readdirSync(path.join(htmlRoot,dir))){const m=f.match(/^豆包汽车-业务学习站-v(\d+)\.html$/);if(m)maxVersion=Math.max(maxVersion,+m[1]);}
const version='v'+String(maxVersion+1).padStart(2,'0');
const diagrams={},geometry={},outDir=path.join(root,'diagrams',version+'-source');fs.mkdirSync(outDir,{recursive:true});
for(const p of pages){const d=await drawSourceFlow(p);diagrams[p.id]=d.svg;geometry[p.id]=d.geometry;fs.writeFileSync(path.join(outDir,p.id+'.svg'),d.svg);}
const overviewSteps=pages.map(p=>({id:p.id,title:p.title,actor:p.category,output:p.steps.slice(0,3).map(s=>s.title).join(' / ')}));
const mainIds=groups[0].ids;
for(const [id,steps,edges]of [['overview',overviewSteps,overviewEdges],['main',overviewSteps.filter(s=>mainIds.includes(s.id)),overviewEdges.filter(e=>mainIds.includes(e.from)&&mainIds.includes(e.to))]]){const d=await drawSourceFlow({id,title:id==='main'?'请求与反馈主链':'全部模块业务关系',steps,edges},{overview:true});diagrams[id]=d.svg;geometry[id]=d.geometry;fs.writeFileSync(path.join(outDir,id+'.svg'),d.svg);}
const data={version,pages,sources,tools,groups,mainIds,diagrams,overviewEdges,toolScope:packs[0].toolScope.description,sourceReadBoundary:'本版按核读的正式方案重建。部分主文档画板未在本轮完成浏览器回读，不代表全部飞书文档已读或所有车型已上线。'};
const css=fs.readFileSync(path.join(root,'source-reader.css'),'utf8'),script=fs.readFileSync(path.join(root,'source-reader.js'),'utf8');
const payload=JSON.stringify(data).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
const html=`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>豆包汽车 · 业务链路</title><style>${css}</style></head><body><div class="top"><button id="menu" aria-label="打开目录">☰</button><a class="brand" href="#home">豆包汽车 · 业务链路</a><form id="search"><input id="query" aria-label="搜索步骤和工具" placeholder="搜索步骤或工具"><button>搜索</button></form></div><div class="layout"><aside id="sidebar"><nav id="nav"></nav></aside><main id="content"></main></div><dialog id="dialog"><div class="dialog-tools"><button data-zoom="out">−</button><button data-zoom="in">＋</button><button data-zoom="fit">适合宽度</button><button data-zoom="actual">原始尺寸</button><button id="close">关闭</button></div><div class="canvas"></div></dialog><script>const DATA=${payload};</script><script>${script}</script></body></html>`;
const output=path.join(htmlRoot,'01-进行中',`豆包汽车-业务学习站-${version}.html`);fs.writeFileSync(output,html,{flag:'wx'});
fs.writeFileSync(path.join(root,'source-site-data.json'),JSON.stringify(data,null,2));
fs.writeFileSync(path.join(root,'source-diagram-geometry.json'),JSON.stringify(geometry,null,2));
const manifest={version,output,sha256:crypto.createHash('sha256').update(html).digest('hex'),pages:pages.length,steps:pages.reduce((n,p)=>n+p.steps.length,0),edges:pages.reduce((n,p)=>n+p.edges.length,0),tools:tools.length,quarantine:[...quarantined],diagramDir:outDir,builtAt:new Date().toISOString(),verification:'pending',sourceBoundary:data.sourceReadBoundary};
fs.writeFileSync(path.join(root,'source-latest-build.json'),JSON.stringify(manifest,null,2));console.log(JSON.stringify(manifest,null,2));
