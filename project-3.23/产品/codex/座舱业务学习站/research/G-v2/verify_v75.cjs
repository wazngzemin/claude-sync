/* Offline runtime checks. JSDOM executes the actual bundled reader/editor; no browser starts. */
'use strict';
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const {execFileSync} = require('child_process');
let jsdom;
for (const candidate of ['jsdom', '/Users/bytedance/.npm/_npx/f889f78786aac0bd/node_modules/jsdom', '/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/jsdom']) {
  try { jsdom = require(candidate); break; } catch (_) {}
}
assert(jsdom, 'Install or expose JSDOM before running this check');
const {JSDOM, VirtualConsole} = jsdom;
const here = __dirname;
const root = path.resolve(here, '../../..');
const output = path.join(root, 'HTML/01-进行中/豆包汽车-业务学习站-v75.html');
const baseline = path.join(root, 'HTML/01-进行中/豆包汽车-业务学习站-v74.html');
const source = fs.readFileSync(output, 'utf8');
const DATA = JSON.parse(source.match(/const DATA=([\s\S]*?);\s*<\/script>/)[1]);
const G = DATA.pages.find(p => p.id === 'G');
assert(G, 'G DATA exists');
const checks = {};
const partOrder = [1,2,3,5,4];
const mergedParts = partOrder.map(n => fs.readFileSync(path.join(here,`part-${n}.md`),'utf8')
  .replace(/<!--[\s\S]*?-->/g, comment => /^<!--\s*figure:[\w-]+\s*-->$/.test(comment) ? comment : '')
  .replace(/^\n+|\n+$/g,'')).join('\n\n')+'\n';
assert.equal(fs.readFileSync(path.join(here,'full.md'),'utf8'), mergedParts);
assert(mergedParts.startsWith('## 开篇：'));
checks.fullMdExactlyMatchesMergedParts = true;
assert.equal(DATA.diagrams['g-base'],fs.readFileSync(path.join(here,'figures-orig/g-base.svg'),'utf8'));
checks.originalSvgEmbeddedWithoutRenaming = true;
const oldSource=fs.readFileSync(baseline,'utf8');
const oldData=JSON.parse(oldSource.match(/const DATA=([\s\S]*?);\s*<\/script>/)[1]);
for(const page of oldData.pages.filter(p=>p.id!=='G')) assert.deepEqual(DATA.pages.find(p=>p.id===page.id),page);
for(const [key,value] of Object.entries(oldData.diagrams)) assert.equal(DATA.diagrams[key],value);
assert.equal([...source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m=>m[0]).join(''),[...oldSource.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m=>m[0]).join(''));
checks.otherChaptersIdentical=true;checks.cssIdentical=true;

const stage = label => console.error('[verify-v75] ' + label);
function rangeTextByOffsets() {
  const root = this.commonAncestorContainer;
  const offsets = new WeakMap();
  const chunks = [];
  let length = 0;
  function walk(node) {
    const start = length;
    if (node.nodeType === 3 || node.nodeType === 4) {
      chunks.push(node.data);
      length += node.data.length;
    } else {
      for (const child of node.childNodes) walk(child);
    }
    offsets.set(node, [start, length]);
  }
  walk(root);
  function boundary(container, offset) {
    const interval = offsets.get(container);
    if (container.nodeType === 3 || container.nodeType === 4) return interval[0] + offset;
    if (offset === 0) return interval[0];
    return offsets.get(container.childNodes[offset - 1])[1];
  }
  return chunks.join('').slice(
    boundary(this.startContainer, this.startOffset),
    boundary(this.endContainer, this.endOffset)
  );
}

const rangeProbe = new JSDOM('<div id="probe"><h2>标题</h2><p>中文 <b>加粗</b> 尾</p><details><summary><h2>附二</h2>说明</summary><h3>子题</h3><p>历史</p></details></div>');
const probeRoot=rangeProbe.window.document.querySelector('#probe');
const probeHeads=probeRoot.querySelectorAll('h2,h3');
for(let i=0;i<3;i++) { const range=rangeProbe.window.document.createRange();range.setStartAfter(probeHeads[i]);if(i<2)range.setEndBefore(probeHeads[i+1]);else range.setEnd(probeRoot,probeRoot.childNodes.length);assert.equal(range.toString(),rangeTextByOffsets.call(range));}
rangeProbe.window.close();
checks.rangeTextCompatibilityProbe={cases:3,allEqual:true};
const errors = [];
const windows = [];
const tick = () => new Promise(resolve => setTimeout(resolve, 25));
const clean = s => s.replace(/\s+/gu, '');
function create(html, filename = output, route = '#module/G', storage = {}) {
  // Retain every G SVG in full. Other chapter SVG interiors are irrelevant to these UI actions.
  const start=html.indexOf('const DATA=')+11;
  const end=html.indexOf(';\n',start);
  const runtimeData=JSON.parse(html.slice(start,end));
  const light=svg=>(svg.match(/<svg\b[^>]*>/)?.[0]||'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">')+'</svg>';
  for(const key of Object.keys(runtimeData.diagrams)) if(!key.startsWith('g2-') && key!=='g-base') runtimeData.diagrams[key]=light(runtimeData.diagrams[key]);
  runtimeData.originalSvg=light(runtimeData.originalSvg);
  html=html.slice(0,start)+JSON.stringify(runtimeData).replaceAll('</','<\\/')+html.slice(end);
  const localErrors = [];
  const downloads = [];
  const blobs = new Map();
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', e => localErrors.push(e.message));
  const dom = new JSDOM(html, {
    url: 'https://offline.test/' + encodeURIComponent(path.basename(filename)) + route,
    runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole,
    beforeParse(w) {
      w.Range.prototype.toString=rangeTextByOffsets;
      Object.defineProperty(w, 'innerWidth', {value: 375, configurable: true});
      w.scrollTo = () => {};
      w.HTMLElement.prototype.scrollIntoView = function () { this.__scrolled = true; };
      w.document.execCommand = () => true;
      w.confirm = () => true;
      w.Blob = globalThis.Blob;
      w.URL.createObjectURL = blob => {const key = 'blob:offline-' + blobs.size; blobs.set(key, blob); return key;};
      w.URL.revokeObjectURL = () => {};
      w.HTMLAnchorElement.prototype.click = function () {
        if (this.download) downloads.push({filename: this.download, blob: blobs.get(this.href)});
        else this.dispatchEvent(new w.MouseEvent('click', {bubbles: true, cancelable: true}));
      };
      for (const [k,v] of Object.entries(storage)) w.localStorage.setItem(k,v);
    }
  });
  windows.push(dom.window);
  return {dom, w: dom.window, d: dom.window.document, localErrors, downloads};
}
function captureStorage(w) {
  return Object.fromEntries(Array.from({length:w.localStorage.length}, (_,i) => {
    const k=w.localStorage.key(i); return [k,w.localStorage.getItem(k)];
  }));
}
function navLinks(d) {return [...d.querySelectorAll('.article-footer a')].map(a=>a.getAttribute('href'));}
function assertNoErrors(ctx) {
  assert(!ctx.w.__siteLastError, JSON.stringify(ctx.w.__siteLastError));
  assert.equal(ctx.localErrors.length, 0, ctx.localErrors.join('\n'));
}
(async () => {
  stage('starting G reader');
  const ctx = create(source); const {w,d} = ctx;
  await tick(); assertNoErrors(ctx);
  const api = w.CockpitLearningSite;
  assert(api, 'Reader starts');
  const group = [...d.querySelectorAll('#sidebar-content .nav-group')].find(g=>g.querySelector('a[href="#module/G"]'));
  assert(group, 'G in sidebar');
  const groupIds = [...group.querySelectorAll('a')].map(a=>a.getAttribute('href').split('/')[1]);
  assert.equal(groupIds[groupIds.indexOf('G')-1], 'T');
  assert.equal(groupIds[groupIds.indexOf('G')+1], 'L');
  assert.equal(group.querySelector('h2').textContent, '持续任务与主动服务');
  stage('reader ready; checking G navigation and body');
  checks.sidebar = {group: '持续任务与主动服务', order: groupIds};
  const article = d.querySelector('#chapter-reading');
  const headings = [...article.querySelectorAll('h2[id],h3[id]')].filter(h=>!h.closest('figure'));
  assert.equal(headings.length, G.v55.headings.length);
  assert.equal(d.querySelectorAll('.v55-chapter-toc a').length, headings.length);
  assert.equal(d.querySelectorAll('#page-toc a').length, headings.length);
  assert.equal(d.querySelectorAll('#page-section-select option').length - 1, headings.length);
  for (const h of headings) {
    assert(d.querySelector('.v55-chapter-toc a[data-v55-target="'+h.id+'"]'));
    assert(d.querySelector('#page-toc a[data-scroll-to="'+h.id+'"]'));
  }
  checks.toc = {chapter: headings.length, side: headings.length, dropdown: headings.length};
  const figures = [...article.querySelectorAll('figure[data-diagram]')];
  assert.equal(figures.length, 10);
  assert.equal(article.querySelectorAll('svg').length, 10);
  const keys = figures.map(f=>f.dataset.diagram.replace(/-\d+$/, ''));
  assert.equal(new Set(keys).size, 9);
  assert.equal(keys.filter(k=>k==='g2-overview').length, 2);
  assert.equal(article.querySelectorAll('details').length, 2);
  assert.equal(article.querySelector('details > summary').textContent, '原始全图');
  checks.G = {h2:headings.filter(h=>h.tagName==='H2').length,h3:headings.filter(h=>h.tagName==='H3').length, svg:figures.length, distinctSvg:new Set(keys).size, details:2, examples:article.querySelectorAll('.v58-example').length,cases:article.querySelectorAll('.v58-case').length};
  const actual = article.cloneNode(true);
  actual.querySelectorAll('figure,details#detailed-flow').forEach(el=>el.remove());
  // Appendix summary is a generated fold label; its h2 heading remains part of the source body.
  actual.querySelectorAll('summary').forEach(el=>{
    const h=el.querySelector('h2,h3'); if (h) el.replaceWith(h); else el.remove();
  });
  const expectedHTML = execFileSync('python3',['-c',
    'from pathlib import Path\nfrom markdown_it import MarkdownIt\nimport re\np=Path(__import__("sys").argv[1])\ns=p.read_text()\ns=re.sub(r"\\*\\*(.+?)\\*\\*",r"<strong>\\1</strong>",s,flags=re.S)\nprint(MarkdownIt("commonmark", {"html":True,"typographer":False,"breaks":False}).enable("table").render(s))', path.join(here,'full.md')],{maxBuffer:5e6}).toString();
  const expectedDoc = new JSDOM(expectedHTML).window.document;
  expectedDoc.querySelectorAll('summary').forEach(el=>el.remove());
  const textNodes = root => {
    const walk = root.ownerDocument.createTreeWalker(root,4), parts=[];
    while(walk.nextNode()) if(walk.currentNode.data.trim()) parts.push(walk.currentNode.data.replace(/^\n+|\n+$/g,''));
    return parts;
  };
  assert.deepEqual(textNodes(actual),textNodes(expectedDoc.body),'Every nonempty body text node equals Markdown-rendered full.md, including internal spaces and punctuation');
  checks.sourceText = {equal:true,characters:textNodes(actual).join('').length,normalization:'Markdown rendered before comparison; only empty layout text nodes, diagram content and generated fold labels excluded; internal spaces and punctuation compared exactly'};
  checks.commonNameCorrection = {};
  for(const term of ['规划决策模型','主动建议模型','智能体']) {
    const pageCount=article.textContent.split(term).length-1;
    const partCount=mergedParts.split(term).length-1;
    assert.equal(pageCount,partCount,term+' matches original parts');
    checks.commonNameCorrection[term]={page:pageCount,parts:partCount};
  }
  const banned = /资料|PRD|清单|待确认|口径|没有展开|未展开|技术方案|宣讲|周报|逐字稿|文字记录|纪要|缺陷表|群聊|DT|Director|小模型|OnePage|书名号|《|》/g;
  assert.deepEqual(article.textContent.match(banned)||[],[]);
  assert.deepEqual((G.title+G.summary+G.scenario+G.v55.html).match(banned)||[],[]);
  for(const key of new Set(keys)) assert.deepEqual(DATA.diagrams[key].match(banned)||[],[]);
  checks.bannedMatches=0;
  assert.equal(article.querySelectorAll('.voice-table-scroll table').length,9);
  assert.equal(article.querySelectorAll('table').length,9);
  assert.equal(article.querySelectorAll('strong').length,165);
  assert(!article.textContent.includes('**'));
  assert.equal(d.querySelectorAll('#chapter-reading textarea').length,0);
  assert.equal(article.querySelector('details#detailed-flow').nextElementSibling.id,'g75-history');
  assert(article.querySelector('details#detailed-flow figure').dataset.diagram.startsWith('g-base-'));
  assert(!article.querySelector('details#detailed-flow').open);
  assert(!article.querySelector('details#g75-history').open);
  // Exercise the original figure's actual bundled inline and modal controls.
  const original=article.querySelector('details#detailed-flow'); original.open=true;
  const figure=original.querySelector('figure'), svg=figure.querySelector('svg');
  figure.querySelector('[data-figure-zoom="in"]').click();
  assert.equal(figure.querySelector('output').textContent,'125%');
  figure.querySelector('[data-figure-mode="fit"]').click();
  assert.equal(parseFloat(svg.style.width),Number(figure.dataset.fitWidth));
  figure.querySelector('[data-figure-mode="readable"]').click();
  assert.equal(parseFloat(svg.style.width),Number(figure.dataset.readableWidth));
  figure.querySelector('[data-open-diagram]').click();await tick();
  assert(!d.querySelector('#diagram-modal').hidden);
  const modalSvg=d.querySelector('#diagram-canvas svg'), beforeWidth=parseFloat(modalSvg.style.width);
  d.querySelector('[data-modal-zoom="in"]').click();
  assert(parseFloat(modalSvg.style.width)>beforeWidth);
  d.querySelector('#diagram-close').click();assert(d.querySelector('#diagram-modal').hidden);
  original.open=false;
  checks.originalFigureInteraction={inlineZoom:true,fit:true,readable:true,modalZoom:true};
  for(const [oldId,newId] of Object.entries(G.legacyChapterTargets)) {
    assert(G.v55.headings.some(h=>h.id===newId),oldId+' maps to current heading');
  }
  checks.legacyTargets=Object.keys(G.legacyChapterTargets).length;
  const sample=G.v55.headings.find(h=>h.level===3);
  api.navigate('#module/G/section/'+sample.id,true); await tick();
  assert(d.getElementById(sample.id).classList.contains('highlight-target'));
  const select=d.querySelector('#page-section-select'); select.value=sample.id; select.dispatchEvent(new w.Event('change',{bubbles:true}));
  assert(d.getElementById(sample.id).__scrolled);
  const results=api.search('云端触发器');
  assert(results.some(r=>r.moduleId==='G'));
  assert(api.search('execute_policy').some(r=>r.moduleId==='G'));
  checks.sectionJumpAndSearch=true;
  assert.deepEqual(navLinks(d), ['#module/T','#module/L']);
  checks.previousNext={G:'T / L'};
  api.navigate('#home',true);await tick();
  assert(d.querySelector('#directory a[href="#module/G"]'));
  checks.homeDirectory=true;
  stage('checking all module renders');
  for (const page of api.getPages()) {
    stage('module ' + page.id);
    api.navigate('#module/'+page.id,true);await tick();assertNoErrors(ctx);
    assert(d.querySelector('#page-root h1'));
    for (const table of d.querySelectorAll('#chapter-reading table')) assert(table.closest('.voice-table-scroll,.table-scroll,.v34-table'),page.id+' table has scroll container');
  }
  checks.allModulesRender={count:api.getPages().length,errors:0};
  // JSDOM does not calculate layout widths; check the existing containment rules instead.
  const css=[...d.querySelectorAll('style')].map(s=>s.textContent).join('\n');
  for(const fragment of [
    '.site-layout{display:grid;grid-template-columns:var(--sidebar) minmax(0,1fr)',
    '#main-content{min-width:0;',
    '.voice-v55{min-width:0;max-width:100%;overflow-wrap:anywhere}',
    '.voice-v55 .voice-table-scroll{display:block;width:100%;max-width:100%;min-width:0;overflow-x:auto}',
    '.voice-v55 pre{max-width:100%;overflow-x:auto}',
    '.voice-v55 .svg-shell{min-width:0;max-width:100%}',
    '@media(max-width:375px)'
  ]) assert(css.includes(fragment),'mobile containment rule: '+fragment);
  checks.mobile375={viewport:375,containmentRules:true,tablesInScrollContainers:true,realLayoutMeasured:false,limitation:'JSDOM has no layout engine; document scrollWidth at 375px cannot be measured reliably without a browser.'};
  api.navigate('#module/G',true);await tick();
  stage('checking editor');
  const marker='运行验收临时文字v75';
  d.querySelector('#learning-doc-edit').click();
  const editable=d.querySelector('#page-root');
  assert.equal(editable.getAttribute('contenteditable'),'true');
  editable.querySelector('#chapter-reading p').append(d.createTextNode(marker));
  editable.dispatchEvent(new w.Event('input',{bubbles:true}));
  d.querySelector('#learning-doc-save').click();await tick();
  assert(d.querySelector('#chapter-reading').textContent.includes(marker));
  assert.notEqual(editable.getAttribute('contenteditable'),'true');
  const saved=captureStorage(w);
  const storageKey='cockpit-learning-document:'+w.location.pathname;
  assert.equal(JSON.parse(saved[storageKey]).revision,'v75');
  assert(JSON.parse(saved[storageKey]).pages['module/G']);
  stage('reloading saved snapshot');
  const reloaded=create(source,output,'#module/G',saved);await tick();assertNoErrors(reloaded);
  assert(reloaded.d.querySelector('#chapter-reading').textContent.includes(marker));
  d.querySelector('#learning-doc-export').click();await tick();
  assert.equal(ctx.downloads.length,1);
  assert.equal(ctx.downloads[0].filename,'豆包汽车-业务学习站-我的修订-v75.html');
  const exportText=await ctx.downloads[0].blob.text();
  stage('reloading exported HTML');
  const exported=create(exportText,path.join(root,'我的修订-v75.html'));await tick();assertNoErrors(exported);
  assert(exported.d.querySelector('#chapter-reading').textContent.includes(marker));
  assert(exported.d.querySelectorAll('#chapter-reading svg').length===10);
  const baselineText=fs.readFileSync(baseline,'utf8');
  stage('checking v74/v75 storage isolation');
  const old=create(baselineText,baseline,'#module/V',saved);await tick();assertNoErrors(old);
  assert(!old.d.querySelector('#page-root').textContent.includes(marker));
  const wrongRevision=JSON.parse(saved[storageKey]); wrongRevision.revision='v74';
  const isolated=create(source,output,'#module/G',{[storageKey]:JSON.stringify(wrongRevision)});await tick();assertNoErrors(isolated);
  assert(!isolated.d.querySelector('#chapter-reading').textContent.includes(marker));
  checks.editor={editable:true,save:true,reloadSavedSnapshot:true,exportStarts:true,exportedHtmlReloads:true,exportedFiguresPreserved:true,pathnameIsolation:true,revisionIsolation:true};
  checks.browserStarted=false;
  checks.interactionHarness='Actual bundled reader/editor and full G SVGs; other chapter SVG interiors omitted only in memory; Range text traversal substituted after three native equivalence probes.';
  for(const win of windows) win.close();
  const report={output,passed:true,checks};
  fs.writeFileSync(path.join(here,'runtime-verification-v75.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report,null,2));
})().catch(error=>{for(const win of windows)win.close();console.error(error.stack||error);process.exitCode=1;});
