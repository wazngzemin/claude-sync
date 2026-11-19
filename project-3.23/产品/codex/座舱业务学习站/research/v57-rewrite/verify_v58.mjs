import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const { JSDOM, VirtualConsole } = require('/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/jsdom');
const here = path.dirname(fileURLToPath(import.meta.url));
const workspace = '/Users/bytedance/Desktop/3.23/产品/codex';
const basePath = path.join(workspace, 'HTML/01-进行中/豆包汽车-业务学习站-v57.html');
const outputPath = path.join(workspace, 'HTML/01-进行中/豆包汽车-业务学习站-v58.html');
const source = fs.readFileSync(path.join(here,'full-v58.md'),'utf8');
const expectedHeadings = [...source.matchAll(/^(##|###) (.+)$/gm)].map(m => ({ level: m[1].length, text: m[2] }));
const report = { generatedAt: new Date().toISOString(), method: 'JSDOM only; unchanged SVG interiors omitted during runtime checks; exact SVG source and XML checked separately; no browser launched', checks: [], limitations: ['375px: static CSS containment checks only; JSDOM does not compute visual layout and no browser was launched.'], runtimeErrors: [] };
const instances = [];
function check(name, pass, detail = null) { report.checks.push({ name, pass: !!pass, ...(detail === null ? {} : { detail }) }); if (true) console.log(JSON.stringify({check:report.checks.length,name,pass:!!pass})); }
function dataOf(html) { const begin = html.indexOf('const DATA=') + 'const DATA='.length; return JSON.parse(html.slice(begin, html.indexOf(';\n', begin))); }
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
async function make(html, pathname, stored = {}) {
 // Source bytes and SVG XML are checked separately. Keep original SVG root attributes
 // for interaction checks while avoiding repeated parsing of unchanged SVG interiors.
 const runtimeData=dataOf(html);
 const lightSvg=svg=>(svg.match(/<svg\b[^>]*>/)?.[0]||'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">')+'</svg>';
 for(const key of Object.keys(runtimeData.diagrams))runtimeData.diagrams[key]=lightSvg(runtimeData.diagrams[key]);
 runtimeData.originalSvg=lightSvg(runtimeData.originalSvg);
 const start=html.indexOf('const DATA=')+'const DATA='.length,end=html.indexOf(';\n',start);
 html=html.slice(0,start)+JSON.stringify(runtimeData).replaceAll('</','<\\/')+html.slice(end);

 const errors = [], blobs = [];
 const vc = new VirtualConsole();
 vc.on('jsdomError', error => errors.push(error.message));
 console.log('JSDOM constructing '+pathname+' chars='+html.length);
 const dom = new JSDOM(html, { url: 'https://local.test/' + pathname + '#module/V', runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc,
  beforeParse(w) {
   w.scrollTo = () => {};
   w.HTMLElement.prototype.scrollIntoView = function() { w.__lastScrolledId = this.id; };
   w.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
   w.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
   w.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
   w.confirm = () => true;
   w.document.execCommand = () => true;
   w.URL.createObjectURL = blob => { blobs.push(blob); return 'blob:https://local.test/' + blobs.length; };
   w.URL.revokeObjectURL = () => {};
   const click = w.HTMLAnchorElement.prototype.click;
   w.HTMLAnchorElement.prototype.click = function() { if (!this.download) click.call(this); };
   for (const [key, value] of Object.entries(stored)) w.localStorage.setItem(key, value);
  }
 });
 console.log('JSDOM constructed '+pathname);
 instances.push(dom);
 await pause(35);
 return { dom, w: dom.window, doc: dom.window.document, errors, blobs };
}
async function go(site, hash) { site.w.CockpitLearningSite.navigate(hash, true); await pause(15); }
function rootOf(site) { return site.doc.querySelector('#page-root'); }
function headingsOf(site) { return [...rootOf(site).querySelectorAll('h2,h3')].filter(el => !el.closest('figure,[data-diagram]')); }
async function blobText(site, blob) { return await new Promise((resolve,reject) => { const reader = new site.w.FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsText(blob); }); }
function storageOf(site) { return Object.fromEntries(Array.from({ length: site.w.localStorage.length }, (_,i) => site.w.localStorage.key(i)).map(key => [key, site.w.localStorage.getItem(key)])); }
let base, next;
try {
 const baseHtml = fs.readFileSync(basePath,'utf8'), nextHtml = fs.readFileSync(outputPath,'utf8');
 const oldData = dataOf(baseHtml), newData = dataOf(nextHtml);
 const otherPages = oldData.pages.filter(page => page.id !== 'V');
 check('DATA other 23 pages identical', otherPages.length === 23 && otherPages.every(page => JSON.stringify(page) === JSON.stringify(newData.pages.find(item => item.id === page.id))), { compared: otherPages.map(page => page.id) });
 check('DATA diagrams original strings identical', Object.entries(oldData.diagrams).every(([key,value]) => newData.diagrams[key] === value));
 check('DATA originalSvg original string identical', oldData.originalSvg === newData.originalSvg);
 base = await make(baseHtml, 'v57.html'); next = await make(nextHtml, 'v58.html');
 check('v58 renders without site error', !!next.w.CockpitLearningSite && !next.w.__siteLastError, next.w.__siteLastError || null);
 const headings = headingsOf(next), actualHeadings = headings.map(el => ({ level: Number(el.tagName[1]), text: el.textContent }));
 check('V narrative headings exactly match 17 h2 and 68 h3', JSON.stringify(expectedHeadings) === JSON.stringify(actualHeadings), { expected: expectedHeadings.length, actual: actualHeadings.length, h2: headings.filter(el => el.tagName === 'H2').length, h3: headings.filter(el => el.tagName === 'H3').length });
 const details = [...rootOf(next).querySelectorAll('details')];
 check('V exactly two details closed by default', details.length === 2 && details.every(el => !el.open), details.map(el => ({ id:el.id, summary:el.querySelector('summary')?.textContent, open:el.open })));
 const wholeGraph = details.find(el => el.querySelector('summary')?.textContent === '对照：原始 18 节点全图');
 const appendix = details.find(el => el.textContent.includes('附二　历史版本与关键数字'));
 check('Original graph immediately precedes appendix 2', !!wholeGraph && !!appendix && wholeGraph.nextElementSibling === appendix);
 const inlineGraphs = [...rootOf(next).querySelectorAll('figure[data-diagram]')];
 check('22 figures plus original graph mounted', inlineGraphs.length === 23 && inlineGraphs.every(el => !!el.querySelector('svg')), { count:inlineGraphs.length });
 report.counts={svg:rootOf(next).querySelectorAll('svg').length,strong:rootOf(next).querySelector('#chapter-reading').querySelectorAll('strong').length,examples:rootOf(next).querySelectorAll('p.v58-example').length,cases:rootOf(next).querySelectorAll('p.v58-case').length,details:details.length};
 check('55 examples and 41 cases have matching strong prefixes',report.counts.examples===55&&report.counts.cases===41&&[...rootOf(next).querySelectorAll('p.v58-example,p.v58-case')].every(el=>el.firstElementChild?.tagName==='STRONG'&&el.firstElementChild.textContent.startsWith(el.classList.contains('v58-example')?'例子：':'案例：')),report.counts);
 const markerStyle=next.doc.querySelector('#v58-paragraph-markers').textContent;
 check('Markers have thin currentColor line, spacing, no background, and width containment',markerStyle.includes('2px solid currentColor')&&markerStyle.includes('margin-block:1em')&&markerStyle.includes('box-sizing:border-box')&&markerStyle.includes('overflow-wrap:anywhere')&&!markerStyle.includes('background'));
 for(const theme of ['light','dark']){next.doc.documentElement.dataset.theme=theme;const sample=rootOf(next).querySelector('p.v58-example');check('Marker rule applies in '+theme+' theme',next.w.getComputedStyle(sample).paddingInlineStart==='12px');}
 const options = [...next.doc.querySelectorAll('#page-section-select option')].filter(el => el.value);
 const tocLinks = [...next.doc.querySelectorAll('#page-toc [data-scroll-to]')];
 const chapterLinks = [...rootOf(next).querySelectorAll('nav.v55-chapter-toc [data-v55-target]')];
 const targets = headings.map(el => el.id || el.closest('[id]')?.id);
 check('Mobile jump covers all 85 narrative headings', options.length === 85 && targets.every(id => options.some(option => option.value === id)), { count:options.length });
 check('Chapter TOC covers all 85 narrative headings', tocLinks.length === 85 && targets.every(id => tocLinks.some(link => link.dataset.scrollTo === id)), { count:tocLinks.length });
 check('In chapter navigation covers all 85 narrative headings', chapterLinks.length === 85 && targets.every(id => chapterLinks.some(link => link.dataset.v55Target === id)), { count:chapterLinks.length });
 const unmatchedSearch = expectedHeadings.filter(item => !next.w.CockpitLearningSite.search(item.text).some(result => result.moduleId === 'V' && result.title === item.text));
 check('Search index covers all 85 narrative headings', unmatchedSearch.length === 0, unmatchedSearch);
 const manifest = JSON.parse(fs.readFileSync(path.join(here,'build-manifest-v58.json')));
 const ref = JSON.parse(fs.readFileSync(path.join(here,'reference-render-v58.json')));
 const combined = ['ex-A.md','ex-B.md','ex-C.md','ex-D.md','rw-E.md'].map(name=>fs.readFileSync(path.join(here,name),'utf8').replace(/<!--[\s\S]*?-->/g,m=>/^<!--\s*figure:[\w-]+\s*-->$/.test(m)?m:'').replace(/^\n+|\n+$/g,'')).join('\n\n')+'\n';
 check('full.md equals ordered inputs with only permitted comment removal', source===combined);
 check('All five Markdown inputs unchanged',Object.entries(manifest.inputsSha256).every(([name,digest])=>hash(fs.readFileSync(path.join(here,name)))===digest));
 check('v57 baseline and full.md unchanged', hash(fs.readFileSync(manifest.base)) === manifest.baselineSha256 && hash(fs.readFileSync(manifest.source)) === manifest.sourceSha256);
 const article = rootOf(next).querySelector('#chapter-reading');
 const clean = article.cloneNode(true);
 clean.querySelectorAll('figure,#detailed-flow').forEach(el=>el.remove());
 const reference = new JSDOM(ref.html);
 [reference.window.document.body,...reference.window.document.querySelectorAll('body *')].forEach(el=>{for(const n of [...el.childNodes])if(n.nodeType===8)n.remove();});
 const blocks = node => [...node.querySelectorAll('h2,h3,p,li,th,td,pre,blockquote,hr')].map(el=>({tag:el.tagName,text:el.textContent}));
 const actualBlocks=blocks(clean),expectedBlocks=blocks(reference.window.document.body);
 check('Every narrative block character-identical to full.md',JSON.stringify(actualBlocks)===JSON.stringify(expectedBlocks),{blocks:actualBlocks.length,differingBlocks:actualBlocks.filter((b,i)=>JSON.stringify(b)!==JSON.stringify(expectedBlocks[i])).length});
 const strong=[...clean.querySelectorAll('strong')].map(el=>el.textContent);
 check('229 strong spans character-identical to full.md',strong.length===229 && JSON.stringify(strong)===JSON.stringify([...reference.window.document.querySelectorAll('strong')].map(el=>el.textContent)),{count:strong.length});
 // Remove only presentation wrappers/heading attributes, then compare the entire DOM serialization.
 clean.querySelectorAll('details,summary,.voice-table-scroll').forEach(el=>el.replaceWith(...el.childNodes));
 clean.querySelectorAll('p.v58-example,p.v58-case').forEach(el=>el.removeAttribute('class'));
 clean.querySelectorAll('h2,h3').forEach(el=>{el.removeAttribute('id');el.removeAttribute('data-section-title');});
 check('Entire narrative HTML identical after removing presentation wrappers',clean.innerHTML===reference.window.document.body.innerHTML,{actualCharacters:clean.innerHTML.length,expectedCharacters:reference.window.document.body.innerHTML.length});
 reference.window.close();
 const figureReport=[];
 for(const key of manifest.figureKeys){
  const oldLesson=oldData.pages.find(p=>p.id==='V').v55;
  const meta={title:oldLesson.figureTitles[key],subtitle:oldLesson.figureSubtitles[key]};
  const fig=[...rootOf(next).querySelectorAll('figure')].find(el=>el.dataset.diagram.startsWith(key+'-'));
  check(key+' SVG source preserved', newData.diagrams[key]===oldData.diagrams[key]);
  check(key+' title/subtitle and SVG mounted', !!fig && fig.querySelector('h3').textContent===meta.title && fig.querySelector('[data-figure-subtitle]')?.textContent===meta.subtitle && !!fig.querySelector('svg'));
  if(!fig)continue;
  const before=[...article.querySelectorAll('h2,h3,figure')].slice(0,[...article.querySelectorAll('h2,h3,figure')].indexOf(fig)).filter(el=>!el.closest('figure'));
  const h2=before.filter(el=>el.tagName==='H2').at(-1), lastH2=before.lastIndexOf(h2);
  const h3=before.slice(lastH2+1).filter(el=>el.tagName==='H3').at(-1);
  figureReport.push({key,h2:h2?.textContent,h3:h3?.textContent||null,previous:fig.previousElementSibling?.textContent.slice(0,100),next:fig.nextElementSibling?.textContent.slice(0,100)});
  const svg=fig.querySelector('svg'), width=svg.style.width;
  fig.querySelector('[data-figure-zoom="in"]').click();
  const zoomed=svg.style.width;
  fig.querySelector('[data-figure-zoom="out"]').click();
  fig.querySelector('[data-figure-mode="fit"]').click();
  fig.querySelector('[data-figure-mode="readable"]').click();
  check(key+' inline scale/fit/readable controls', width!==zoomed && !!svg.style.width);
  fig.querySelector('[data-open-diagram]').click(); await pause(20);
  const modal=next.doc.querySelector('#diagram-modal'), modalSvg=next.doc.querySelector('#diagram-canvas svg');
  const beforeZoom=modalSvg?.style.width;
  next.doc.querySelector('[data-modal-zoom="in"]').click();
  check(key+' enlarged view and zoom', !modal.hidden && !!modalSvg && beforeZoom!==modalSvg.style.width);
  next.doc.querySelector('#diagram-close').click();
 }
 report.figurePlacements=figureReport;
 const rhythm=headings.find(h=>h.textContent==='对话节奏管理，把收尾、插话和回复接成一段交谈');
 const rhythmOption=options.find(el=>el.value===rhythm.id);
 next.doc.querySelector('#page-section-select').value=rhythmOption.value;
 next.doc.querySelector('#page-section-select').dispatchEvent(new next.w.Event('change',{bubbles:true}));
 check('New rhythm heading jump control scrolls to target', next.w.__lastScrolledId===rhythm.id);
 const rhythmLink=chapterLinks.find(el=>el.dataset.v55Target===rhythm.id);
 rhythmLink.click(); await pause(20);
 check('New rhythm chapter link navigates to heading', next.w.location.hash.includes(rhythm.id));
 const styleText=[...next.doc.querySelectorAll('style')].map(el=>el.textContent).join('\n');
 check('375px static width containment rules', ['.voice-v55{min-width:0;max-width:100%', '.voice-v55 .flow-figure{min-width:0;max-width:100%}', '.voice-v55 .svg-shell{min-width:0;max-width:100%}', '.voice-v55 .voice-table-scroll{display:block;width:100%;max-width:100%;min-width:0;overflow-x:auto}', '.voice-v55 .figure-header>h3{min-width:0;max-width:100%;overflow-wrap:anywhere}', '@media(max-width:375px){.site-header{gap:6px;padding:0 8px}}'].every(rule=>styleText.includes(rule)) && [...article.querySelectorAll('table')].every(el=>el.parentElement.classList.contains('voice-table-scroll')));
 report.mobile={width:375,staticContainmentChecked:true,layoutMeasured:false,browserStarted:false};
 if (inlineGraphs.length) {
  const fig = rootOf(next).querySelector('figure[data-diagram]'), svg = fig.querySelector('svg'), initialWidth = svg.style.width;
  fig.querySelector('[data-figure-zoom="in"]').click();
  const zoomInWidth = svg.style.width;
  fig.querySelector('[data-figure-zoom="out"]').click();
  check('Inline zoom buttons work', initialWidth !== zoomInWidth && fig.dataset.scale === '1', { initialWidth, zoomInWidth, afterOut:svg.style.width });
  fig.querySelector('[data-open-diagram]').click(); await pause(20);
  const modal = next.doc.querySelector('#diagram-modal'), modalSvg = next.doc.querySelector('#diagram-canvas svg');
  const before = modalSvg?.style.width;
  next.doc.querySelector('[data-modal-zoom="in"]').click();
  check('Enlarge modal and modal zoom work', !modal.hidden && !!modalSvg && before !== modalSvg.style.width);
  next.doc.querySelector('#diagram-close').click();
  check('Diagram modal close works', modal.hidden);
 }
 const appendixHeading = headings.find(el => el.closest('details') === appendix && el.tagName === 'H3');
 if (appendixHeading) {
  const query = appendixHeading.textContent;
  const result = next.w.CockpitLearningSite.search(query).find(item => item.moduleId === 'V' && item.title === query);
  await go(next, '#search?q=' + encodeURIComponent(query));
  const resultLink = [...rootOf(next).querySelectorAll('.search-result a')].find(link => link.getAttribute('href') === result?.href);
  resultLink?.click(); await pause(35);
  const currentAppendix = [...rootOf(next).querySelectorAll('details')].find(el => el.textContent.includes('附二　历史版本与关键数字'));
  check('Click appendix search result auto expands details', !!resultLink && !!currentAppendix?.open, { query, result:result?.href, route:next.w.location.hash });
 } else check('Click appendix search result auto expands details', false, 'No appendix h3 found');
 const expectedRuntime=baseHtml.match(/<script([^>]*)>([\s\S]*?)<\/script>/g).find(s=>s.includes('function renderModule')).replace("revision: 'v57'","revision: 'v58'").replace('我的修订-v57.html','我的修订-v58.html');
 const actualRuntime=nextHtml.match(/<script([^>]*)>([\s\S]*?)<\/script>/g).find(s=>s.includes('function renderModule'));
 check('Runtime changes limited to independent snapshot revision and download filename',expectedRuntime===actualRuntime);
 const changed = [];
 for (const page of otherPages) { await go(base, '#module/' + page.id); await go(next, '#module/' + page.id); if (rootOf(base).innerHTML !== rootOf(next).innerHTML) changed.push(page.id); }
 check('Other 23 rendered chapter DOMs identical', changed.length === 0, { changed });
 await go(next, '#module/V');
 const token = '独立验收编辑保存-' + Date.now();
 next.doc.querySelector('#learning-doc-edit').click();
 const paragraph = rootOf(next).querySelector('#chapter-reading p') || rootOf(next).querySelector('p');
 paragraph.append(next.doc.createTextNode(token));
 rootOf(next).dispatchEvent(new next.w.Event('input', { bubbles:true }));
 next.doc.querySelector('#learning-doc-save').click(); await pause(30);
 const storage = storageOf(next), storageEntries = Object.entries(storage).filter(([key]) => key.startsWith('cockpit-learning-document:'));
 check('Edit and save persists independently with revision v58', storageEntries.length === 1 && storageEntries[0][0].endsWith('/v58.html') && JSON.parse(storageEntries[0][1]).revision === 'v58' && JSON.stringify(storageEntries).includes(token), storageEntries.map(([key,value]) => ({ key, revision:JSON.parse(value).revision })));
 const reloaded = await make(nextHtml, 'v58.html', storage);
 check('Saved edit survives reopening v58', rootOf(reloaded).textContent.includes(token));
 const staleStorage=Object.fromEntries(Object.entries(storage).map(([key,value])=>[key,JSON.stringify({...JSON.parse(value),revision:'v57'})]));
 const staleReloaded=await make(nextHtml,'v58.html',staleStorage);
 check('v58 rejects stale v57 revision even at same path',!rootOf(staleReloaded).textContent.includes(token));
 const oldReloaded = await make(baseHtml, 'v57.html', storage);
 check('v58 saved edit does not change v57', !rootOf(oldReloaded).textContent.includes(token));
 next.doc.querySelector('#learning-doc-export').click(); await pause(20);
 check('Save as HTML produces Blob', next.blobs.length > 0);
 if (next.blobs.length) {
  const exportedHtml = await blobText(next, next.blobs.at(-1));
  const exported = await make(exportedHtml, 'exported-v58.html');
  const bundled = JSON.parse(exported.doc.querySelector('#learning-doc-data').textContent);
  check('Exported HTML includes edited snapshot', exportedHtml.includes(token) && rootOf(exported).textContent.includes(token));
  check('Exported HTML has independent revision', typeof bundled.revision === 'string' && bundled.revision !== 'v58' && bundled.revision !== 'v57', bundled.revision);
 }
 for (const site of [base,next]) report.runtimeErrors.push(...site.errors);
 check('No JSDOM runtime errors', report.runtimeErrors.length === 0, report.runtimeErrors);
} catch (error) { check('Verification completed', false, error.stack); }
finally {
 for (const dom of instances) dom.window.close();
 report.passed = report.checks.every(item => item.pass);
 fs.writeFileSync(path.join(here, 'independent-verification-v58.json'), JSON.stringify(report,null,2) + '\n');
 console.log(JSON.stringify({ passed:report.passed, checks:report.checks.length, failed:report.checks.filter(item => !item.pass), report:path.join(here,'independent-verification-v58.json') }, null, 2));
 if (!report.passed) process.exitCode = 1;
}
