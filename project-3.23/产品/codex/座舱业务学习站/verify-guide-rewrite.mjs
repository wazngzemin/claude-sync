import fs from 'node:fs';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{JSDOM,VirtualConsole}=require('/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/jsdom');
const work='research/guide-rewrite-20261030',m=JSON.parse(fs.readFileSync(work+'/candidate-manifest.json')),data=JSON.parse(fs.readFileSync(work+'/candidate-data.json')),before=JSON.parse(fs.readFileSync(work+'/baseline-data.json'));
const original=fs.readFileSync(m.baseline,'utf8'),script=fs.readFileSync(work+'/candidate-app.js','utf8');
const payload=JSON.stringify(data).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
const html=original.replace(/<script>const DATA=[\s\S]*?<\/script>/,()=>'<script>const DATA='+payload+';</script>').replace(/(<\/script>\s*<script>)[\s\S]*?(<\/script>\s*<\/body>)/,(_,a,b)=>a+script+b).replace('</style>',m.css+'\n</style>');
const errors=[],warnings=[],coverage=[];let checks=0;const check=(ok,message)=>{checks++;if(!ok)errors.push(message)},same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
check(crypto.createHash('sha256').update(html).digest('hex')===m.sha256,'candidate hash');check(m.guideCount===34,'all 34 guides updated');
const expectedBase=structuredClone(before.base);expectedBase.edges.find(e=>e.id==='I-2').label=m.edgeLabelCorrection.label;expectedBase.modules.find(m=>m.id==='I').edges.find(e=>e.from==='I13'&&e.to==='I8').label=m.edgeLabelCorrection.label;
check(same(data.base,expectedBase),'original nodes, tools and edges preserved except reviewed I-2 label');
const expectedSvg=before.originalSvg.replace('<tspan x="1060" dy="0">首 token 前：有效请求合并后</tspan><tspan x="1060" dy="28">重推理</tspan>','<tspan x="1060" dy="0">未发工具且无有效输出</tspan><tspan x="1060" dy="28">有效请求合并后重推理</tspan>');
check(same(data.diagrams,before.diagrams)&&data.originalSvg===expectedSvg,'SVGs preserved except reviewed I-2 label');
const allNodes=new Set(data.base.modules.flatMap(x=>x.nodes.map(n=>n.id))),sourceIds=new Set([...data.sources,...data.base.sources].map(x=>x.id));
const allGuideEdges=new Set(data.pages.flatMap(p=>Object.values(p.teaching.guides).flatMap(g=>g.sections.flatMap(s=>s.edgeIds||[]))));
for(const edge of data.base.edges)check(allGuideEdges.has(edge.id),'original connection explained in a guide '+edge.id);
for(const p of data.pages){
 const old=before.pages.find(x=>x.id===p.id);check(same(p.teaching.lessons,old.teaching.lessons)&&same(p.teaching.intro,old.teaching.intro),'chapter prose unchanged '+p.id);check(same(p.flows,old.flows),'flows unchanged '+p.id);
 for(const [key,g] of Object.entries(p.teaching.guides)){
  const id=p.id+'/'+key,flow=key==='base'?data.base.modules.find(x=>x.id===p.id):p.flows.find(x=>x.id===key),expected=flow.nodes.map(x=>x.id),covered=new Set(g.sections.flatMap(s=>s.nodeIds||[])),known=new Set([...allNodes,...expected]);
  check(g.sections.length>=3,'multiple reading stages '+id);check(same(g.paragraphs,g.sections.flatMap(s=>s.paragraphs)),'search/render prose consistent '+id);
  for(const n of expected)check(covered.has(n),'node explained '+id+'/'+n);
  for(const n of covered)check(known.has(n),'existing node reference '+id+'/'+n);
  for(const s of g.sections){check(s.title?.length>3&&s.paragraphs?.length>=2,'substantive stage '+id+'/'+s.title);check(s.paragraphs.every(x=>typeof x==='string'&&x.length>25),'nonempty explanatory paragraphs '+id+'/'+s.title);}
  for(const source of g.sourceIds||[])check(sourceIds.has(source),'known source '+id+'/'+source);
  const mapped=new Set(g.sections.flatMap(s=>s.edgeIds||[])),edges=key==='base'?data.base.edges.filter(e=>e.moduleId===p.id&&e.type==='internal'):(flow.edges||[]).map(e=>({...e,id:e.id||e.from+'>'+e.to})),missing=edges.filter(e=>!mapped.has(e.id));
  if(missing.length)warnings.push({id,unmappedEdges:missing.map(e=>({id:e.id,from:e.from,to:e.to,label:e.label}))});
  const text=g.paragraphs.join('\n'),oldText=old.teaching.guides[key].paragraphs.join('\n');check(text!==oldText,'guide rewritten '+id);
  check(!/(?:V\d+|R\d+|DR-\w+)\s*(?:→|->)/.test(text),'no bare-code narration '+id);
  coverage.push({id,nodes:expected.length,covered:expected.filter(n=>covered.has(n)).length,sections:g.sections.length,paragraphs:g.paragraphs.length,chars:text.length,previousChars:oldText.length});
 }
}
const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push('DOM '+e.message));
const options={url:'file://'+m.output,runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});}};
const dom=new JSDOM(html.replace('    mountFigures();','    /* offline guide validation */'),options),w=dom.window,d=w.document;
for(const p of data.pages){w.history.replaceState(null,'','#module/'+p.id);w.dispatchEvent(new w.HashChangeEvent('hashchange'));check(!w.__siteLastError,'route '+p.id);const root=d.querySelector('#page-root');
 check(!root.querySelector('#terms,#related,#whole-scenarios,#sources,.article-footer,textarea,.source-appendix'),'removed panels stay removed '+p.id);
 for(const [key,g] of Object.entries(p.teaching.guides)){const a=[...root.querySelectorAll('[data-diagram-guide]')].find(n=>n.dataset.diagramGuide===key);check(!!a,'guide mounted '+p.id+'/'+key);if(!a)continue;check(a.querySelectorAll('.diagram-guide-step').length===g.sections.length,'all reading stages visible '+p.id+'/'+key);check(a.querySelectorAll('p').length===g.paragraphs.length,'paragraphs shown once '+p.id+'/'+key);for(const s of g.sections){check([...a.querySelectorAll('h4')].some(h=>h.textContent===s.title),'stage title visible '+p.id+'/'+s.title);for(const para of s.paragraphs)check(a.textContent.includes(para),'full paragraph visible '+p.id+'/'+s.title);}}
}
dom.window.close();
const live=new JSDOM(html,options),lw=live.window,ld=lw.document;
for(const id of ['V','DR','SE']){lw.history.replaceState(null,'','#module/'+id);lw.dispatchEvent(new lw.HashChangeEvent('hashchange'));check(ld.querySelectorAll('.svg-shell svg').length>0,'diagram still mounts '+id);check(ld.querySelectorAll('.diagram-guide-step').length>0,'detailed prose with diagram '+id);ld.querySelector('[data-open-diagram]')?.click();check(!lw.__siteLastError,'open diagram '+id);ld.querySelector('[data-close-diagram],#diagram-close')?.click();}
live.window.close();
const report={version:m.version,contentHash:m.sha256,checks,errors,warnings,coverage,counts:{guides:coverage.length,sections:coverage.reduce((n,x)=>n+x.sections,0),paragraphs:coverage.reduce((n,x)=>n+x.paragraphs,0),coveredNodes:coverage.reduce((n,x)=>n+x.covered,0)},browserVisual:'Not performed: prior local browser policy block remains. This is offline DOM validation.'};
fs.writeFileSync(work+'/verification.json',JSON.stringify(report,null,2));console.log(JSON.stringify({checks,errors,warnings,counts:report.counts},null,2));if(errors.length)process.exitCode=1;
