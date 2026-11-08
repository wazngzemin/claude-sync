import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const work=path.join(root,'research/guide-rewrite-20261030');
const htmlRoot=path.resolve(root,'../HTML');
const baseline=path.join(htmlRoot,'01-进行中/豆包汽车-业务学习站-v28.html');
const original=fs.readFileSync(baseline,'utf8');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const css='\n/* Detailed diagram reading, preserving the existing chapter. */\n.diagram-guide-step{margin:30px 0 34px}.diagram-guide-step h4{font-size:20px;line-height:1.65;color:#20374c;margin:0 0 15px;font-weight:650}.diagram-guide-step p:last-child{margin-bottom:0}@media(max-width:760px){.diagram-guide-step h4{font-size:18px}.diagram-guide-step{margin:25px 0 30px}}\n';
function compose(data,script){
 const payload=JSON.stringify(data).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
 return original.replace(/<script>const DATA=[\s\S]*?<\/script>/,()=>'<script>const DATA='+payload+';</script>').replace(/(<\/script>\s*<script>)[\s\S]*?(<\/script>\s*<\/body>)/,(_,a,b)=>a+script+b).replace('</style>',css+'\n</style>');
}
if(process.argv.includes('--publish')){
 const manifest=JSON.parse(fs.readFileSync(path.join(work,'candidate-manifest.json')));
 const data=JSON.parse(fs.readFileSync(path.join(work,'candidate-data.json')));
 const script=fs.readFileSync(path.join(work,'candidate-app.js'),'utf8');
 const html=compose(data,script),v=JSON.parse(fs.readFileSync(path.join(work,'verification.json'))),review=JSON.parse(fs.readFileSync(path.join(work,'review-summary.json')));
 if(hash(html)!==manifest.sha256||v.contentHash!==manifest.sha256||v.errors.length||review.contentHash!==manifest.sha256||review.openFindings.length||review.reviewedGuides.length!==34)throw Error('Candidate not fully checked/reviewed');
 if(fs.existsSync(manifest.output)||fs.existsSync(manifest.svgOutput))throw Error('Version already exists');
 fs.writeFileSync(manifest.output,html,{flag:'wx'});
 fs.writeFileSync(manifest.svgOutput,data.originalSvg,{flag:'wx'});
 fs.writeFileSync(path.join(root,'guide-rewrite-latest.json'),JSON.stringify(manifest,null,2));
 console.log(JSON.stringify({version:manifest.version,output:manifest.output,sha256:manifest.sha256},null,2));process.exit(0);
}
const before=JSON.parse(fs.readFileSync(path.join(work,'baseline-data.json'))),data=structuredClone(before),stats=[],seen=new Set();
const correctedLabel='未发工具且无有效输出：有效请求合并后重推理';
data.base.edges.find(e=>e.id==='I-2').label=correctedLabel;
data.base.modules.find(m=>m.id==='I').edges.find(e=>e.from==='I13'&&e.to==='I8').label=correctedLabel;
const oldLabel='<tspan x="1060" dy="0">首 token 前：有效请求合并后</tspan><tspan x="1060" dy="28">重推理</tspan>';
if(!data.originalSvg.includes(oldLabel))throw Error('Expected I-2 label absent');
data.originalSvg=data.originalSvg.replace(oldLabel,'<tspan x="1060" dy="0">未发工具且无有效输出</tspan><tspan x="1060" dy="28">有效请求合并后重推理</tspan>');
for(const group of ['main','async','support']){
 const f=path.join(work,'guides-'+group+'.json');if(!fs.existsSync(f)){if(process.argv.includes('--partial'))continue;throw Error('Missing '+group);}
 const patch=JSON.parse(fs.readFileSync(f));
 for(const g of patch.guides){
  const page=data.pages.find(p=>p.id===g.pageId),prior=page?.teaching.guides[g.key],id=g.pageId+'/'+g.key;
  if(!prior||seen.has(id))throw Error('Unknown/duplicate guide '+id);seen.add(id);
  if(!g.sections?.length)throw Error('No reading sections '+id);
  const paragraphs=g.sections.flatMap(s=>s.paragraphs);
  page.teaching.guides[g.key]={...prior,title:g.title,sections:g.sections,paragraphs,nodeIds:[...new Set(g.sections.flatMap(s=>s.nodeIds||[]))],sourceIds:g.sourceIds?.length?g.sourceIds:prior.sourceIds};
  stats.push({id,sections:g.sections.length,paragraphs:paragraphs.length,chars:paragraphs.join('').length,previousChars:prior.paragraphs.join('').length,nodeIds:page.teaching.guides[g.key].nodeIds,edgeIds:[...new Set(g.sections.flatMap(s=>s.edgeIds||[]))]});
 }
}
if(!process.argv.includes('--partial')&&seen.size!==34)throw Error('Expected 34 guides, received '+seen.size);
let script=fs.readFileSync(path.join(work,'baseline-app.js'),'utf8');
const start=script.indexOf('  function renderGuide('),end=script.indexOf('  function svgMarkup(',start);
if(start<0||end<0)throw Error('Reader function absent');
script=script.slice(0,start)+String.raw`  function renderGuide(page,key) {
    const guide=page.teaching?.guides?.[key];
    if(!guide) return '';
    const id='guide-'+uid(key==='base'?'base-'+page.id:key);
    const body=guide.sections?.length?guide.sections.map((step,i)=>'<section class="diagram-guide-step" id="'+id+'-step-'+(i+1)+'" data-guide-step="'+(i+1)+'"><h4>'+esc(step.title)+'</h4>'+arr(step.paragraphs).map(p=>'<p>'+teachingText(p,page,guide,key==='base'?null:key)+'</p>').join('')+'</section>').join(''):arr(guide.paragraphs).map(p=>'<p>'+teachingText(p,page,guide,key==='base'?null:key)+'</p>').join('');
    return '<article class="diagram-lesson lecture-prose" id="'+id+'" data-diagram-guide="'+esc(key)+'"><h3>'+esc(guide.title)+'</h3>'+body+'</article>';
  }

`+script.slice(end);
let highest=0;for(const dir of ['01-进行中','02-已交付','03-历史版本'])for(const f of fs.readdirSync(path.join(htmlRoot,dir))){const m=f.match(/^豆包汽车-业务学习站-v(\d+)\.html$/);if(m)highest=Math.max(highest,+m[1]);}
const version='v'+String(highest+1).padStart(2,'0');data.meta={...data.meta,version,previousVersion:'v28',builtAt:new Date().toISOString(),refinement:'逐图按业务节点、判断分支和信息交接扩写带图讲解。'};
const html=compose(data,script),manifest={version,baseline,output:path.join(htmlRoot,'01-进行中','豆包汽车-业务学习站-'+version+'.html'),svgOutput:path.join(htmlRoot,'01-进行中','豆包汽车-全部模块节点与工具-全景图-'+version+'.svg'),sha256:hash(html),baselineSha256:hash(original),guides:stats,guideCount:seen.size,css,edgeLabelCorrection:{id:'I-2',label:correctedLabel,reason:'与未放行工具且无有效输出的合并条件一致，首token前不足以证明没有下游执行。'}};
fs.writeFileSync(path.join(work,'candidate-data.json'),JSON.stringify(data));fs.writeFileSync(path.join(work,'candidate-app.js'),script);fs.writeFileSync(path.join(work,'candidate-manifest.json'),JSON.stringify(manifest,null,2));
fs.writeFileSync(path.join(work,'candidate-guides.md'),data.pages.flatMap(p=>Object.entries(p.teaching.guides).map(([key,g])=>['# '+p.title+' / '+key,'## '+g.title,...(g.sections||[]).flatMap(s=>['### '+s.title,...s.paragraphs])].join('\n\n'))).join('\n\n'));
console.log(JSON.stringify({version,guides:seen.size,sections:stats.reduce((n,s)=>n+s.sections,0),paragraphs:stats.reduce((n,s)=>n+s.paragraphs,0)},null,2));
