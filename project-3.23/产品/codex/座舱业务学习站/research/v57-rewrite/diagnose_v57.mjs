import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const { JSDOM, VirtualConsole } = require('/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/jsdom');
const here = path.dirname(fileURLToPath(import.meta.url));
const workspace = '/Users/bytedance/Desktop/3.23/产品/codex';
const basePath = path.join(workspace, 'HTML/01-进行中/豆包汽车-业务学习站-v56.html');
const outputPath = path.join(workspace, 'HTML/01-进行中/豆包汽车-业务学习站-v57.html');
const source = fs.readFileSync(path.join(here,'full.md'),'utf8');
const expectedHeadings = [...source.matchAll(/^(##|###) (.+)$/gm)].map(m => ({ level: m[1].length, text: m[2] }));
const report = { generatedAt: new Date().toISOString(), method: 'JSDOM only; no browser launched', checks: [], limitations: ['375px: static CSS containment checks only; JSDOM does not compute visual layout and no browser was launched.'], runtimeErrors: [] };
const instances = [];
function check(name, pass, detail = null) { report.checks.push({ name, pass: !!pass, ...(detail === null ? {} : { detail }) }); if (!pass || report.checks.length % 10 === 0) console.log(JSON.stringify({check:report.checks.length,name,pass:!!pass})); }
function dataOf(html) { const begin = html.indexOf('const DATA=') + 'const DATA='.length; return JSON.parse(html.slice(begin, html.indexOf(';\n', begin))); }
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
async function make(html, pathname, stored = {}) {
 const errors = [], blobs = [];
 const vc = new VirtualConsole();
 vc.on('jsdomError', error => errors.push(error.message));
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
 instances.push(dom);
 await pause(35);
 return { dom, w: dom.window, doc: dom.window.document, errors, blobs };
}
async function go(site, hash) { site.w.CockpitLearningSite.navigate(hash, true); await pause(15); }
function rootOf(site) { return site.doc.querySelector('#page-root'); }
function headingsOf(site) { return [...rootOf(site).querySelectorAll('h2,h3')].filter(el => !el.closest('figure,[data-diagram]')); }
async function blobText(site, blob) { return await new Promise((resolve,reject) => { const reader = new site.w.FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsText(blob); }); }
function storageOf(site) { return Object.fromEntries(Array.from({ length: site.w.localStorage.length }, (_,i) => site.w.localStorage.key(i)).map(key => [key, site.w.localStorage.getItem(key)])); }
const html=fs.readFileSync(outputPath,'utf8');const data=dataOf(html);for(const key of Object.keys(data.diagrams))data.diagrams[key]='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"></svg>';data.originalSvg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"></svg>';
const light=html.replace(/const DATA=[\s\S]*?;\s*<\/script>/,'const DATA='+JSON.stringify(data).replaceAll('</','<\\/')+';\n</script>');const site=await make(light,'v57-diagnostic.html');const clean=rootOf(site).querySelector('#chapter-reading').cloneNode(true);clean.querySelectorAll('figure,#detailed-flow').forEach(el=>el.remove());clean.querySelectorAll('details,summary,.voice-table-scroll').forEach(el=>el.replaceWith(...el.childNodes));clean.querySelectorAll('h2,h3').forEach(el=>{el.removeAttribute('id');el.removeAttribute('data-section-title');});const ref=new JSDOM(JSON.parse(fs.readFileSync(path.join(here,'reference-render.json'))).html);[ref.window.document.body,...ref.window.document.querySelectorAll('body *')].forEach(el=>{for(const n of [...el.childNodes])if(n.nodeType===8)n.remove();});const a=clean.innerHTML,b=ref.window.document.body.innerHTML;let i=0;while(i<a.length&&a[i]===b[i])i++;const result={passed:a===b,method:'JSDOM runtime with lightweight placeholder diagrams; all figure SVGs and interactions separately tested in full verification',actualCharacters:a.length,expectedCharacters:b.length,firstDiff:i};fs.writeFileSync(path.join(here,'narrative-dom-verification.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));for(const dom of instances)dom.window.close();ref.window.close();
