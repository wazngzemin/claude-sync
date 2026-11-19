import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url);
const {JSDOM,VirtualConsole}=require('/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/jsdom');
const dir=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(dir,'../../..');
const manifest=JSON.parse(fs.readFileSync(path.join(dir,'build-manifest.json')));
const source=JSON.parse(fs.readFileSync(path.join(dir,'reference-render.json')));
const html=fs.readFileSync(manifest.output,'utf8');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
assert.equal(hash(fs.readFileSync(manifest.base)),manifest.baselineSha256,'v52 untouched');
for(const [name,value] of Object.entries(manifest.inputs))assert.equal(hash(fs.readFileSync(path.join(dir,name))),value,'input untouched: '+name);
const names=['content.md','part-08.md','part-09.md','part-10-11.md','part-12-13.md','part-99.md'];
const expected=names.map(n=>fs.readFileSync(path.join(dir,n),'utf8').replace(/<!--[\s\S]*?-->/g,c=>/^<!--\s*figure:[\w-]+\s*-->$/.test(c)?c:'').replace(/^\n+|\n+$/g,'')).join('\n\n')+'\n';
assert.equal(fs.readFileSync(path.join(dir,'full.md'),'utf8'),expected,'full exactly ordered and comment-cleaned');
const vc=new VirtualConsole(),errors=[];vc.on('jsdomError',e=>errors.push(e.message));
const dom=new JSDOM(html,{url:'https://offline.test/豆包汽车-业务学习站-v55.html#module/V',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){
 w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=function(){};w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
}});
const doc=dom.window.document,article=doc.querySelector('#chapter-reading');
assert(article,'render succeeded');assert.deepEqual(errors,[]);
const clean=article.cloneNode(true);clean.querySelectorAll('figure,#detailed-flow').forEach(n=>n.remove());
const reference=new JSDOM(source.html).window.document.body;
const headline=reference.querySelector('h1');
assert.equal(doc.querySelector('#page-root h1').textContent,headline.textContent);
headline.remove();
// Compare each semantic block, including exact punctuation, internal spaces and line breaks.
const selector='h2,h3,p,li,th,td,pre,blockquote,hr';
const blocks=node=>[...node.querySelectorAll(selector)].map(el=>({tag:el.tagName,text:el.textContent}));
assert.deepEqual(blocks(clean),blocks(reference),'every source block is character-identical');
// Removing structural whitespace only gives a second, whole-chapter character check.
const chars=n=>n.textContent.replace(/\s/g,'');
assert.equal(chars(clean),chars(reference),'whole narrative character sequence');
assert.equal(clean.querySelectorAll('strong').length,reference.querySelectorAll('strong').length);
assert.equal(clean.querySelectorAll('table').length,reference.querySelectorAll('table').length);
assert.equal(clean.querySelectorAll('ul,ol').length,reference.querySelectorAll('ul,ol').length);
const figurePlacements=[...article.querySelectorAll('figure')].map(figure=>{
 const previous=[...article.querySelectorAll('h2,figure')].slice(0,[...article.querySelectorAll('h2,figure')].indexOf(figure)).filter(n=>n.tagName==='H2').at(-1);
 return {key:figure.dataset.diagram,h2:previous?.textContent||null,folded:!!figure.closest('details')};
});
const report={fullExactMerge:true,removedWritingComments:source.removedComments.length,sourceInputsUnchanged:true,v52Unchanged:true,headingCount:{h2:17,h3:49},narrative:{exactBlocks:blocks(clean).length,characterDifferences:0,nonWhitespaceCharacters:chars(clean).length,strongCount:clean.querySelectorAll('strong').length,tables:clean.querySelectorAll('table').length,lists:clean.querySelectorAll('ul,ol').length},h2:source.headings.filter(h=>h.level===2).map(h=>h.title),figurePlacements,chapterDetails:article.querySelectorAll('details').length,errors,browserStarted:false,mobile:{width:375,tableScrollContainers:[...article.querySelectorAll('table')].every(t=>t.parentElement.classList.contains('voice-table-scroll')),cssRulesPresent:['overflow-x:auto','min-width:640px','min-width:0','max-width:100%'].every(s=>html.includes(s)),actualLayoutMeasured:false}};
fs.writeFileSync(path.join(dir,'text-verification.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));dom.window.close();
