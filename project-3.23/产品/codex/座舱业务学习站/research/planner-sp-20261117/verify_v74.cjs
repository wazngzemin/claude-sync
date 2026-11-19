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
const output = path.join(root, 'HTML/01-进行中/豆包汽车-业务学习站-v74.html');
const baseline = path.join(root, 'HTML/01-进行中/豆包汽车-业务学习站-v73.html');
const source = fs.readFileSync(output, 'utf8');
const DATA = JSON.parse(source.match(/const DATA=([\s\S]*?);\s*<\/script>/)[1]);
const SP = DATA.pages.find(p => p.id === 'SP');
assert(SP, 'SP DATA exists');
const checks = {};
const stage = label => console.error('[verify-v74] ' + label);
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
function create(html, filename = output, route = '#module/SP', storage = {}) {
  // Retain every SP SVG in full. Other chapter SVG interiors are irrelevant to these UI actions.
  const start=html.indexOf('const DATA=')+11;
  const end=html.indexOf(';\n',start);
  const runtimeData=JSON.parse(html.slice(start,end));
  const light=svg=>(svg.match(/<svg\b[^>]*>/)?.[0]||'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">')+'</svg>';
  for(const key of Object.keys(runtimeData.diagrams)) if(!key.startsWith('sp2-')) runtimeData.diagrams[key]=light(runtimeData.diagrams[key]);
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
  stage('starting SP reader');
  const ctx = create(source); const {w,d} = ctx;
  await tick(); assertNoErrors(ctx);
  const api = w.CockpitLearningSite;
  assert(api, 'Reader starts');
  const group = [...d.querySelectorAll('#sidebar-content .nav-group')].find(g=>g.querySelector('a[href="#module/SP"]'));
  assert(group, 'SP in sidebar');
  const groupIds = [...group.querySelectorAll('a')].map(a=>a.getAttribute('href').split('/')[1]);
  assert.equal(groupIds[groupIds.indexOf('SP')-1], 'D');
  assert.equal(groupIds[groupIds.indexOf('SP')+1], 'E');
  assert.equal(group.querySelector('h2').textContent, '一句话到真实结果');
  stage('reader ready; checking SP navigation and body');
  checks.sidebar = {group: '一句话到真实结果', order: groupIds};
  const article = d.querySelector('#chapter-reading');
  const headings = [...article.querySelectorAll('h2[id],h3[id]')].filter(h=>!h.closest('figure'));
  assert.equal(headings.length, SP.v55.headings.length);
  assert.equal(d.querySelectorAll('.v55-chapter-toc a').length, headings.length);
  assert.equal(d.querySelectorAll('#page-toc a').length, headings.length);
  assert.equal(d.querySelectorAll('#page-section-select option').length - 1, headings.length);
  for (const h of headings) {
    assert(d.querySelector('.v55-chapter-toc a[data-v55-target="'+h.id+'"]'));
    assert(d.querySelector('#page-toc a[data-scroll-to="'+h.id+'"]'));
  }
  checks.toc = {chapter: headings.length, side: headings.length, dropdown: headings.length};
  const figures = [...article.querySelectorAll('figure[data-diagram]')];
  assert.equal(figures.length, 7);
  assert.equal(article.querySelectorAll('svg').length, 7);
  const keys = figures.map(f=>f.dataset.diagram.replace(/-\d+$/, ''));
  assert.equal(new Set(keys).size, 5);
  assert.equal(keys.filter(k=>k==='sp2-overview').length, 3);
  assert.equal(article.querySelectorAll('details').length, 2);
  assert.equal(article.querySelector('details > summary').textContent, '原始全图');
  checks.SP = {h2:headings.filter(h=>h.tagName==='H2').length,h3:headings.filter(h=>h.tagName==='H3').length, svg:figures.length, distinctSvg:new Set(keys).size, details:2, examples:article.querySelectorAll('.v58-example').length,cases:article.querySelectorAll('.v58-case').length};
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
  assert.equal(clean(actual.textContent),clean(expectedDoc.body.textContent),'SP body characters equal full.md after Markdown syntax, whitespace, diagram slots and generated fold labels are excluded');
  checks.sourceText = {equal:true,characters:clean(actual.textContent).length,normalization:'Markdown markup and layout whitespace excluded; diagram content and generated fold labels excluded'};
  const banned = /资料|PRD|清单|待确认|口径|没有展开|未展开|技术方案|宣讲|周报|逐字稿|文字记录|纪要|DT|Director|小模型|OnePage|书名号|《|》/g;
  assert.deepEqual(article.textContent.match(banned)||[],[]);
  assert.deepEqual(JSON.stringify(SP).match(banned)||[],[]);
  for(const key of new Set(keys)) assert.deepEqual(DATA.diagrams[key].match(banned)||[],[]);
  checks.bannedMatches=0;
  const sample=SP.v55.headings.find(h=>h.level===3);
  api.navigate('#module/SP/section/'+sample.id,true); await tick();
  assert(d.getElementById(sample.id).classList.contains('highlight-target'));
  const select=d.querySelector('#page-section-select'); select.value=sample.id; select.dispatchEvent(new w.Event('change',{bubbles:true}));
  assert(d.getElementById(sample.id).__scrolled);
  const results=api.search('现行系统提示词');
  assert(results.some(r=>r.moduleId==='SP'));
  assert(api.search('task_agent').some(r=>r.moduleId==='SP'));
  checks.sectionJumpAndSearch=true;
  for (const [id,links] of Object.entries({D:['#module/C','#module/SP'],SP:['#module/D','#module/E'],E:['#module/SP','#module/O']})) {
    api.navigate('#module/'+id,true); await tick(); assert.deepEqual(navLinks(d),links);
  }
  checks.previousNext={D:'C / SP',SP:'D / E',E:'SP / O'};
  api.navigate('#home',true);await tick();
  assert(d.querySelector('#directory a[href="#module/SP"]'));
  assert(d.querySelector('#main-chain a[href="#module/SP"]'));
  checks.homeDirectoryAndMainChain=true;
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
  api.navigate('#module/SP',true);await tick();
  stage('checking editor');
  const marker='运行验收临时文字v74';
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
  assert.equal(JSON.parse(saved[storageKey]).revision,'v74');
  assert(JSON.parse(saved[storageKey]).pages['module/SP']);
  stage('reloading saved snapshot');
  const reloaded=create(source,output,'#module/SP',saved);await tick();assertNoErrors(reloaded);
  assert(reloaded.d.querySelector('#chapter-reading').textContent.includes(marker));
  d.querySelector('#learning-doc-export').click();await tick();
  assert.equal(ctx.downloads.length,1);
  assert.equal(ctx.downloads[0].filename,'豆包汽车-业务学习站-我的修订-v74.html');
  const exportText=await ctx.downloads[0].blob.text();
  stage('reloading exported HTML');
  const exported=create(exportText,path.join(root,'我的修订-v74.html'));await tick();assertNoErrors(exported);
  assert(exported.d.querySelector('#chapter-reading').textContent.includes(marker));
  assert(exported.d.querySelectorAll('#chapter-reading svg').length===7);
  const baselineText=fs.readFileSync(baseline,'utf8');
  stage('checking v73/v74 storage isolation');
  const old=create(baselineText,baseline,'#module/V',saved);await tick();assertNoErrors(old);
  assert(!old.d.querySelector('#page-root').textContent.includes(marker));
  const wrongRevision=JSON.parse(saved[storageKey]); wrongRevision.revision='v73';
  const isolated=create(source,output,'#module/SP',{[storageKey]:JSON.stringify(wrongRevision)});await tick();assertNoErrors(isolated);
  assert(!isolated.d.querySelector('#chapter-reading').textContent.includes(marker));
  checks.editor={editable:true,save:true,reloadSavedSnapshot:true,exportStarts:true,exportedHtmlReloads:true,exportedFiguresPreserved:true,pathnameIsolation:true,revisionIsolation:true};
  checks.browserStarted=false;
  checks.interactionHarness='Actual bundled reader/editor and full SP SVGs; other chapter SVG interiors omitted only in memory; Range text traversal substituted after three native equivalence probes.';
  for(const win of windows) win.close();
  const report={output,passed:true,checks};
  fs.writeFileSync(path.join(here,'runtime-verification-v74.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report,null,2));
})().catch(error=>{for(const win of windows)win.close();console.error(error.stack||error);process.exitCode=1;});
