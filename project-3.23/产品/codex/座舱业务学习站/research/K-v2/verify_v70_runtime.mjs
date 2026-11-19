import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const require=createRequire(import.meta.url);
const {JSDOM,VirtualConsole}=require('/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/jsdom');
const here=path.dirname(fileURLToPath(import.meta.url));
const workspace='/Users/bytedance/Desktop/3.23/产品/codex';
const basePath=path.join(workspace,'HTML/01-进行中/豆包汽车-业务学习站-v69.html');
const outputPath=path.join(workspace,'HTML/01-进行中/豆包汽车-业务学习站-v70.html');
const report={generatedAt:new Date().toISOString(),method:'JSDOM runtime verification plus independent Markdown rendering and SVG XML inspection; Full K SVG retained during interaction tests; other chapter SVG interiors omitted; JSDOM Range.toString uses cached text offsets to avoid slow native traversal; no browser launched',checks:[],limitations:['375px containment is checked statically. JSDOM does not compute actual page layout, so absence of horizontal page scrolling cannot be visually or geometrically certified.'],runtimeErrors:[]};
const instances=[];
const rangeProbe=new JSDOM('<div id="x"><h2>题一</h2><p>中文 1.7B <strong>加粗</strong> 尾</p><details><summary><h2>附二</h2>原说明</summary><h3>小标题</h3><p>历史</p></details></div>');
const probeX=rangeProbe.window.document.querySelector('#x'),probeHs=probeX.querySelectorAll('h2,h3');report.rangeCompatibilityProbe=[];
for(let i=0;i<3;i++){const r=rangeProbe.window.document.createRange();r.setStartAfter(probeHs[i]);if(i<2)r.setEndBefore(probeHs[i+1]);else r.setEnd(probeX,probeX.childNodes.length);const native=r.toString(),substitute=r.cloneContents().textContent;report.rangeCompatibilityProbe.push({i,native,substitute,identical:native===substitute});}rangeProbe.window.close();
const check=(name,pass,detail=null)=>{report.checks.push({name,pass:!!pass,...(detail===null?{}:{detail})});console.log(JSON.stringify({name,pass:!!pass}));};
check('JSDOM Range text substitute matches native results in three boundary cases',report.rangeCompatibilityProbe.every(p=>p.identical),report.rangeCompatibilityProbe);
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const dataOf=html=>{const b=html.indexOf('const DATA=')+11;return JSON.parse(html.slice(b,html.indexOf(';\n',b)));};
async function make(html,pathname,stored={},route='#module/K',lightAll=false){
 const runtimeData=dataOf(html);
 const lightSvg=svg=>(svg.match(/<svg\b[^>]*>/)?.[0]||'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">')+'</svg>';
 for(const key of Object.keys(runtimeData.diagrams))if(lightAll||!/^k2-/.test(key))runtimeData.diagrams[key]=lightSvg(runtimeData.diagrams[key]);
 runtimeData.originalSvg=lightSvg(runtimeData.originalSvg);
 const start=html.indexOf('const DATA=')+11,end=html.indexOf(';\n',start);
 html=html.slice(0,start)+JSON.stringify(runtimeData).replaceAll('</','<\\/')+html.slice(end);
 const errors=[],blobs=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 console.log('Constructing '+pathname+' for '+route);
 const dom=new JSDOM(html,{url:'https://local.test/'+pathname+route,runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){
  const offsetsCache=new WeakMap();
  w.Range.prototype.toString=function(){
   const root=this.startContainer.getRootNode();let cached=offsetsCache.get(root);
   if(!cached){const positions=new WeakMap();let all='';const visit=n=>{const start=all.length;if(n.nodeType===3||n.nodeType===4)all+=n.data;else for(const c of n.childNodes)visit(c);positions.set(n,{start,end:all.length});};visit(root);cached={positions,all};offsetsCache.set(root,cached);}
   const at=(n,i)=>n.nodeType===3||n.nodeType===4?cached.positions.get(n).start+i:i<n.childNodes.length?cached.positions.get(n.childNodes[i]).start:cached.positions.get(n).end;
   return cached.all.slice(at(this.startContainer,this.startOffset),at(this.endContainer,this.endOffset));
  };
  Object.defineProperty(w,'innerWidth',{value:375,configurable:true});w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=function(){w.__lastScrolledId=this.id;};
  w.matchMedia=()=>({matches:false,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}});
  w.ResizeObserver=class{observe(){}unobserve(){}disconnect(){}};
  w.IntersectionObserver=class{observe(){}unobserve(){}disconnect(){}};
  w.confirm=()=>true;w.document.execCommand=()=>true;
  w.URL.createObjectURL=blob=>{blobs.push(blob);return 'blob:https://local.test/'+blobs.length;};w.URL.revokeObjectURL=()=>{};
  const click=w.HTMLAnchorElement.prototype.click;w.HTMLAnchorElement.prototype.click=function(){if(!this.download)click.call(this);};
  for(const [key,value]of Object.entries(stored))w.localStorage.setItem(key,value);
 }});console.log('constructed '+pathname);instances.push(dom);await pause(30);return{dom,w:dom.window,doc:dom.window.document,errors,blobs};
}
async function go(site,route){site.w.CockpitLearningSite.navigate(route,true);await pause(30);}
const rootOf=site=>site.doc.querySelector('#page-root');
const storageOf=site=>Object.fromEntries(Array.from({length:site.w.localStorage.length},(_,i)=>site.w.localStorage.key(i)).map(key=>[key,site.w.localStorage.getItem(key)]));
async function blobText(site,blob){return new Promise((resolve,reject)=>{const reader=new site.w.FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsText(blob);});}

let base,next;
try{
 const baseHtml=fs.readFileSync(basePath,'utf8'),nextHtml=fs.readFileSync(outputPath,'utf8'),source=fs.readFileSync(path.join(here,'full.md'),'utf8');
 const combined=[1,2,3,4].map(n=>fs.readFileSync(path.join(here,`part-${n}.md`),'utf8').replace(/<!--[\s\S]*?-->/g,m=>/^<!--\s*figure:[\w-]+\s*-->$/.test(m)?m:'').replace(/^\n+|\n+$/g,'')).join('\n\n').replaceAll('陈奕迅','歌手乙').replaceAll('周杰伦','歌手甲').replaceAll('诸葛亮','测试乘客甲')+'\n';
 check('full.md equals ordered parts with writing comments removed and prohibited names anonymized',source===combined);
 check('Only figure comments remain in full.md',[...source.matchAll(/<!--[\s\S]*?-->/g)].every(m=>/^<!--\s*figure:[\w-]+\s*-->$/.test(m[0])));
 const expectedHeadings=[...source.matchAll(/^(##|###) (.+)$/gm)].map(m=>({level:m[1].length,text:m[2]}));
 const figureKeys=[...source.matchAll(/<!--\s*figure:([\w-]+)\s*-->/g)].map(m=>m[1]);
 const oldData=dataOf(baseHtml),newData=dataOf(nextHtml),others=oldData.pages.filter(p=>!['K'].includes(p.id));
 check('Other 23 DATA pages identical',others.length===23&&others.every(p=>JSON.stringify(p)===JSON.stringify(newData.pages.find(n=>n.id===p.id))),others.map(p=>p.id));
 check('Original global diagram retained byte for byte',oldData.originalSvg===newData.originalSvg);
 const unmodifiedDiagrams=Object.keys(oldData.diagrams).filter(k=>!figureKeys.includes(k));
 check('All pre-existing unchanged diagrams identical',unmodifiedDiagrams.every(k=>oldData.diagrams[k]===newData.diagrams[k]));
 check('Shared page shell and application code unchanged except version',baseHtml.replace(/const DATA=[\s\S]*?;\s*<\/script>/,'const DATA=OMITTED;</script>').replaceAll('v69','VERSION')===nextHtml.replace(/const DATA=[\s\S]*?;\s*<\/script>/,'const DATA=OMITTED;</script>').replaceAll('v70','VERSION'));
 check('Non-page DATA fields unchanged',Object.keys(oldData).filter(k=>!['pages','diagrams'].includes(k)).every(k=>JSON.stringify(oldData[k])===JSON.stringify(newData[k])));
 base=await make(baseHtml,'v69.html');next=await make(nextHtml,'v70.html');
 check('K renders without application error',!!next.w.CockpitLearningSite&&!next.w.__siteLastError,next.w.__siteLastError||null);
 const root=rootOf(next),article=root.querySelector('#chapter-reading');
 check('K uses V chapter presentation wrapper',!!article?.classList.contains('voice-v55'));
 const headings=[...article.querySelectorAll('h2,h3')].filter(el=>!el.closest('figure'));
 check('Every narrative heading equals full.md character for character',JSON.stringify(headings.map(h=>({level:Number(h.tagName[1]),text:h.textContent})))===JSON.stringify(expectedHeadings));
 const details=[...article.querySelectorAll('details')],figures=[...article.querySelectorAll('figure[data-diagram]')];
 const original=article.querySelector('#detailed-flow'),annex=details.find(d=>d!==original&&d.textContent.includes('附二　历史版本与关键数字'));
 report.counts={h2:headings.filter(h=>h.tagName==='H2').length,h3:headings.filter(h=>h.tagName==='H3').length,h2IncludingFigures:article.querySelectorAll('h2').length,h3IncludingFigures:article.querySelectorAll('h3').length,svg:article.querySelectorAll('svg').length,figureSlots:figureKeys.length,uniqueFigureAssets:new Set(figureKeys).size,examples:article.querySelectorAll('p.v58-example').length,cases:article.querySelectorAll('p.v58-case').length,details:details.length};
 for(const detail of details){detail.open=true;detail.open=false;}
 check('Exactly two initially closed folds',details.length===2&&details.every(d=>!d.open),details.map(d=>({id:d.id,summary:d.querySelector('summary')?.textContent})));
 check('New overview fold immediately precedes appendix 2',!!original&&!!annex&&original.nextElementSibling===annex);
 check('Appendix conclusion is inside appendix fold',!!annex&&[...annex.querySelectorAll('p')].at(-1)?.textContent.startsWith('这一段讲给别人听，可以这样说：我会把早期窗口'));
 check('Every source example and case gets the inherited left-line class',report.counts.examples===(source.match(/^\*\*例子：/gm)||[]).length&&report.counts.cases===(source.match(/^\*\*案例：/gm)||[]).length);
 const expectedRender=spawnSync('python3',['-c',"from pathlib import Path\nfrom markdown_it import MarkdownIt\nimport re,sys\ns=Path(sys.argv[1]).read_text()\ns=re.sub(r'\\*\\*(.+?)\\*\\*',r'<strong>\\1</strong>',s,flags=re.S)\nprint(MarkdownIt('commonmark',{'html':True,'typographer':False,'breaks':False}).enable('table').render(s),end='')",path.join(here,'full.md')],{encoding:'utf8',maxBuffer:10*1024*1024});
 if(expectedRender.status!==0)throw new Error(expectedRender.stderr);
 const ref=new JSDOM(expectedRender.stdout),clean=article.cloneNode(true);clean.querySelectorAll('figure,#detailed-flow').forEach(el=>el.remove());
 const blocks=node=>[...node.querySelectorAll('h2,h3,p,li,th,td,pre,blockquote,hr')].map(el=>({tag:el.tagName,text:el.textContent}));
 const actualBlocks=blocks(clean),expectedBlocks=blocks(ref.window.document.body);
 const diffs=actualBlocks.map((a,i)=>JSON.stringify(a)===JSON.stringify(expectedBlocks[i])?null:{index:i,actual:a,expected:expectedBlocks[i]}).filter(Boolean);
 report.narrativeComparison={method:'Independent CommonMark rendering; compare all narrative blocks and every strong span without modifying text',characterIdentical:JSON.stringify(actualBlocks)===JSON.stringify(expectedBlocks),blocks:actualBlocks.length,referenceBlocks:expectedBlocks.length,differingBlocks:diffs};
 check('All narrative blocks match full.md character for character',report.narrativeComparison.characterIdentical,{actual:actualBlocks.length,expected:expectedBlocks.length,diffs:diffs.slice(0,3)});
 check('All bold text matches full.md character for character',JSON.stringify([...clean.querySelectorAll('strong')].map(el=>el.textContent))===JSON.stringify([...ref.window.document.querySelectorAll('strong')].map(el=>el.textContent)));
 const proseSummary=[...ref.window.document.querySelectorAll('summary')].map(el=>el.textContent);
 check('Original appendix summary wording retained',proseSummary.every(s=>clean.textContent.includes(s)),proseSummary);
 const strip=node=>{node.querySelectorAll('details,summary,.voice-table-scroll').forEach(el=>el.replaceWith(...el.childNodes));node.querySelectorAll('*').forEach(el=>{for(const a of [...el.attributes])el.removeAttribute(a.name);});const walker=node.ownerDocument.createTreeWalker(node,128);const comments=[];while(walker.nextNode())comments.push(walker.currentNode);comments.forEach(n=>n.remove());return node;};
 strip(clean);strip(ref.window.document.body);
 const compact=node=>{const structural=new Set(['BODY','ARTICLE','UL','OL','TABLE','THEAD','TBODY','TR']);const serial=n=>[...n.childNodes].map(c=>{if(c.nodeType===3){if(structural.has(n.nodeName)){if(/^\s*$/.test(c.data))return '';return c.data.replace(/^\n+|\n+$/g,'');}return c.data;}if(c.nodeType===1)return '<'+c.localName+'>'+serial(c)+'</'+c.localName+'>';return '';}).join('');return serial(node);};
 check('Full prose DOM matches after removing only presentation wrappers',compact(clean)===compact(ref.window.document.body),{actualCharacters:compact(clean).length,expectedCharacters:compact(ref.window.document.body).length});
 ref.window.close();
 const opts=[...next.doc.querySelectorAll('#page-section-select option')].filter(o=>o.value),toc=[...next.doc.querySelectorAll('#page-toc [data-scroll-to]')],links=[...root.querySelectorAll('.v55-chapter-toc [data-v55-target]')];
 check('Page jump contains every new K heading',opts.length===headings.length&&headings.every(h=>opts.some(o=>o.value===h.id)));
 check('Page directory contains every new K heading',toc.length===headings.length&&headings.every(h=>toc.some(o=>o.dataset.scrollTo===h.id)));
 check('Chapter directory contains every new K heading',links.length===headings.length&&headings.every(h=>links.some(o=>o.dataset.v55Target===h.id)));
 check('Chapter directory routes stay in E',links.every(a=>a.getAttribute('href').startsWith('#module/K/')));
 const unmatched=expectedHeadings.filter(h=>!next.w.CockpitLearningSite.search(h.text).some(r=>r.moduleId==='K'&&r.title===h.text));
 check('Search index includes every new K heading',unmatched.length===0,unmatched);
 for(const o of opts){next.doc.querySelector('#page-section-select').value=o.value;next.doc.querySelector('#page-section-select').dispatchEvent(new next.w.Event('change',{bubbles:true}));if(next.w.__lastScrolledId!==o.value)throw new Error('Jump failed '+o.value);}
 check('Every page jump scrolls to its matching K heading',true);
 check('Source figure count plus new overview mounted',figures.length===figureKeys.length+1&&figures.every(f=>f.querySelector('svg')),{actual:figures.length,expected:figureKeys.length+1});
 check('Overview fold uses only a new K figure',original.querySelector('figure[data-diagram]')?.dataset.diagram.startsWith('k2-overview')&&![...figures].some(f=>f.dataset.diagram.startsWith('base-K')));
 const seen=new Map();
 for(const key of [...figureKeys, 'k2-overview']){
  const occurrence=seen.get(key)||0;seen.set(key,occurrence+1);
  const matches=figures.filter(f=>f.dataset.diagram===key||f.dataset.diagram.startsWith(key+'-'));
  const fig=matches[occurrence];check(key+' occurrence '+(occurrence+1)+' mounted',!!fig);
  if(!fig)continue;
  const meta=key.startsWith('k2-')?JSON.parse(fs.readFileSync(path.join(here,'figures',key+'.json'),'utf8')):null;
  if(meta)check(key+' metadata exact',fig.querySelector('h3')?.textContent===meta.title&&fig.querySelector('[data-figure-subtitle]')?.textContent===meta.subtitle);
  if(meta)check(key+' new SVG exact',newData.diagrams[key]===fs.readFileSync(path.join(here,'figures',key+'.svg'),'utf8'));
  const svg=fig.querySelector('svg'),width=svg.style.width;fig.querySelector('[data-figure-zoom="in"]').click();const zoom=svg.style.width;fig.querySelector('[data-figure-zoom="out"]').click();fig.querySelector('[data-figure-mode="fit"]').click();fig.querySelector('[data-figure-mode="readable"]').click();
  check(key+' inline zoom fit/readable work',width!==zoom&&!!svg.style.width);
  fig.querySelector('[data-open-diagram]').click();await pause(6);const modal=next.doc.querySelector('#diagram-modal'),modalSvg=next.doc.querySelector('#diagram-canvas svg'),prior=modalSvg?.style.width;next.doc.querySelector('[data-modal-zoom="in"]').click();check(key+' enlarged modal zoom works',!modal.hidden&&!!modalSvg&&prior!==modalSvg.style.width);next.doc.querySelector('#diagram-close').click();
 }
 for(const key of new Set(figureKeys)){
  const xml=new JSDOM(newData.diagrams[key],{contentType:'image/svg+xml'});
  check(key+' complete SVG valid XML',xml.window.document.documentElement.localName==='svg'&&!xml.window.document.querySelector('parsererror'));
  if(!key.startsWith('k2-')){
   const adjustedPath=path.join(here,'figures-v70',key+'.svg');
   const cleaned=fs.readFileSync(fs.existsSync(adjustedPath)?adjustedPath:path.join(here,'figures-orig',key+'.svg'),'utf8');
   const title=xml.window.document.querySelector('title')?.textContent,visible=[...xml.window.document.querySelectorAll('text')].map(e=>e.textContent);
   const page=newData.pages.find(p=>p.id==='K');
   check(key+' cleaned original SVG retained exactly',newData.diagrams[key]===cleaned);
   check(key+' original frame uses cleaned SVG title and subtitle',page.v55.figureTitles[key]===title&&title===visible[0]&&page.v55.figureSubtitles[key]===visible[1]);
  }
  xml.window.close();
 }
 const manifest=JSON.parse(fs.readFileSync(path.join(here,'build-manifest-v70.json'),'utf8'));
 const ePage=newData.pages.find(p=>p.id==='K');
 check('Every legacy K anchor has an existing target',Object.values(ePage.legacyChapterTargets).every(id=>article.querySelector('#'+id)));
 for(const [legacy,target] of Object.entries(ePage.legacyChapterTargets)){
  await go(next,'#module/K/section/'+legacy);
  check('Legacy route '+legacy+' reveals '+target,next.w.__lastScrolledId===target&&!!rootOf(next).querySelector('#'+target));
 }
 await go(next,'#module/K');

 check('Both narrative overview occurrences and overview fold render',figures.filter(f=>f.dataset.diagram.startsWith('k2-overview-')).length===3);
 for(const fig of figures){const key=fig.dataset.diagram.replace(/-\d+$/,'');check(key+' clean frame metadata',fig.querySelector('h3')?.textContent===ePage.v55.figureTitles[key]&&fig.querySelector('[data-figure-subtitle]')?.textContent===ePage.v55.figureSubtitles[key]);}
 const allIds=[...article.querySelectorAll('[id]')].map(el=>el.id);
 check('K DOM IDs unique with repeated overview',new Set(allIds).size===allIds.length);
 const banned=/资料|PRD|清单|待确认|口径|没有展开|未展开|技术方案|宣讲|周报|逐字稿|(?<![A-Za-z])DT(?![A-Za-z])|小模型|OnePage|书名号|《|》|陈奕迅|周杰伦|诸葛亮/;
 check('All K figure text and frame captions clear forbidden annotations',figures.every(f=>!banned.test(f.textContent)));
 check('All K prose clear forbidden words and known real names',!banned.test(source)&&!banned.test(article.textContent));
 check('No superseded course payload survives in K',!ePage.feynman&&!ePage.v34&&!ePage.bridge&&ePage.sections.length===0&&ePage.teaching.lessons.length===0&&ePage.questions.length===0&&ePage.cases.length===0);
 for(const key of new Set(figureKeys)){
  const xml=new JSDOM(newData.diagrams[key],{contentType:'image/svg+xml'});
  const text=[...xml.window.document.querySelectorAll('text,title,desc')].map(e=>e.textContent).concat([...xml.window.document.querySelectorAll('[aria-label]')].map(e=>e.getAttribute('aria-label'))).join('\n');
  check(key+' SVG titles description accessibility text clean',!banned.test(text));
  xml.window.close();
 }

 check('v69 baseline file hash retained',manifest.baselineSha256===spawnSync('shasum',['-a','256',basePath],{encoding:'utf8'}).stdout.split(' ')[0]);
 const annexHeading=headings.find(h=>h.closest('details')===annex&&h.tagName==='H3');
 if(annexHeading){const result=next.w.CockpitLearningSite.search(annexHeading.textContent).find(r=>r.moduleId==='K'&&r.title===annexHeading.textContent);await go(next,'#search?q='+encodeURIComponent(annexHeading.textContent));const link=[...rootOf(next).querySelectorAll('.search-result a')].find(a=>a.getAttribute('href')===result?.href);link?.click();await pause(20);check('Search result reveals folded appendix target',!!link&&rootOf(next).querySelector('#'+annexHeading.id)?.closest('details')?.open);}
 else check('Search result reveals folded appendix target',false);
 const styles=[...next.doc.querySelectorAll('style')].map(s=>s.textContent).join('\n');
 check('375px page overflow clipping guard present',styles.includes('@media(max-width:760px){html,body{max-width:100%;overflow-x:clip}}'));
 check('375px inherited containment rules retained',['.voice-v55{min-width:0;max-width:100%','.voice-v55 .flow-figure{min-width:0;max-width:100%}','.voice-v55 .svg-shell{min-width:0;max-width:100%}','.voice-v55 .voice-table-scroll{display:block;width:100%;max-width:100%;min-width:0;overflow-x:auto}','.voice-v55 .figure-header>h3{min-width:0;max-width:100%;overflow-wrap:anywhere}','@media(max-width:375px){.site-header{gap:6px;padding:0 8px}}'].every(s=>styles.includes(s)));
 await go(next,'#module/K');
 check('Every wide table contained in a horizontal scrolling frame',[...rootOf(next).querySelectorAll('table')].every(t=>t.parentElement.classList.contains('voice-table-scroll')));
 check('Example/case inherited rule uses currentColor and two-pixel line',styles.includes('border-inline-start:2px solid currentColor')&&styles.includes('padding-inline-start:12px'));
 const changed=[];for(const p of others){await go(base,'#module/'+p.id);await go(next,'#module/'+p.id);if(rootOf(base).innerHTML!==rootOf(next).innerHTML)changed.push(p.id);}
 check('All other 23 rendered chapter DOMs identical',changed.length===0,{changed});
 await go(next,'#module/K');const token='v70独立编辑保存验收-'+Date.now();next.doc.querySelector('#learning-doc-edit').click();
 check('Edit enables K content editing',rootOf(next).getAttribute('contenteditable')==='true');
 rootOf(next).querySelector('#chapter-reading p').append(next.doc.createTextNode(token));rootOf(next).dispatchEvent(new next.w.Event('input',{bubbles:true}));next.doc.querySelector('#learning-doc-save').click();await pause(15);
 const storage=storageOf(next),entries=Object.entries(storage).filter(([k])=>k.startsWith('cockpit-learning-document:'));
 check('Save uses independent v70 path and revision',entries.length===1&&entries[0][0].endsWith('/v70.html')&&JSON.parse(entries[0][1]).revision==='v70'&&JSON.stringify(entries).includes(token),entries.map(([key,v])=>({key,revision:JSON.parse(v).revision})));
 const reloaded=await make(nextHtml,'v70.html',storage);check('Saved K edit survives reopening v70',rootOf(reloaded).textContent.includes(token));
 for(const revision of ['v59','v69']){const stale=Object.fromEntries(entries.map(([key,v])=>[key,JSON.stringify({...JSON.parse(v),revision})]));const staleReloaded=await make(nextHtml,'v70.html',stale);check('v70 rejects '+revision+' snapshot even at same path',!rootOf(staleReloaded).textContent.includes(token));}
 const legacy=await make(baseHtml,'v69.html',storage);check('v70 snapshot cannot contaminate v69',!rootOf(legacy).textContent.includes(token));
 const legacyEntries=Object.fromEntries(entries.map(([key,v])=>[key.replace('v70.html','v69.html'),JSON.stringify({...JSON.parse(v),revision:'v59'})]));const legacyMixed=await make(nextHtml,'v70.html',legacyEntries);check('v69 path snapshot cannot contaminate v70',!rootOf(legacyMixed).textContent.includes(token));
 next.doc.querySelector('#learning-doc-export').click();await pause(12);check('Save as HTML creates a downloadable Blob',next.blobs.length>0);
 if(next.blobs.length){const exportedHtml=await blobText(next,next.blobs.at(-1)),exported=await make(exportedHtml,'exported-v70.html');const bundled=JSON.parse(exported.doc.querySelector('#learning-doc-data').textContent);check('Exported HTML reopens with saved K edit',exportedHtml.includes(token)&&rootOf(exported).textContent.includes(token));check('Exported snapshot has its own independent revision',!['v59','v69','v70'].includes(bundled.revision),bundled.revision);}
 for(const site of [base,next])report.runtimeErrors.push(...site.errors);check('No JSDOM runtime errors',report.runtimeErrors.length===0,report.runtimeErrors);
 report.mobile={width:375,staticContainmentChecked:true,layoutMeasured:false,browserStarted:false};
}catch(error){check('Verification completed',false,error.stack);}
finally{for(const dom of instances)dom.window.close();report.passed=report.checks.every(c=>c.pass);fs.writeFileSync(path.join(here,'runtime-verification-v70.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({passed:report.passed,counts:report.counts,checks:report.checks.length,failed:report.checks.filter(c=>!c.pass)},null,2));if(!report.passed)process.exitCode=1;}
