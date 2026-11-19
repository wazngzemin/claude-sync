import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import crypto from 'node:crypto';
const require=createRequire(import.meta.url);
const {JSDOM}=require('/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/jsdom');
const here=path.dirname(fileURLToPath(import.meta.url));
const workspace=path.resolve(here,'../../..');
const checks=[];
const check=(name,pass,detail=null)=>{checks.push({name,pass:!!pass,...(detail===null?{}:{detail})});console.log(JSON.stringify({name,pass:!!pass}));};
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const data=version=>JSON.parse(fs.readFileSync(path.join(workspace,`HTML/01-进行中/豆包汽车-业务学习站-v${version}.html`),'utf8').match(/const DATA=([\s\S]*?);\s*<\/script>/)[1]);
const report={method:'Independent CommonMark rendering, narrative DOM character comparison, reversible source replacement, chapter metadata and all R SVG byte comparison. No browser launched.',checks,browserStarted:false};
const instances=[];
try {
 const old=data(61),next=data(62),a=old.pages.find(p=>p.id==='R'),b=next.pages.find(p=>p.id==='R');
 const original=fs.readFileSync(path.join(here,'full.md'),'utf8'),revised=fs.readFileSync(path.join(here,'full-v62.md'),'utf8');
 const changes=JSON.parse(fs.readFileSync(path.join(here,'changes-v62.json'),'utf8'));
 let rebuilt=original;
 for(const c of changes.proseChanges){if(rebuilt.split(c.before).length!==2)throw new Error('Nonunique source span');rebuilt=rebuilt.replace(c.before,c.after);}
 check('R revised source has exactly the authorized 12 replacements and no other characters changed',changes.proseChanges.length===12&&rebuilt===revised);
 check('Original R source still has recorded SHA256',sha(original)===changes.sourceSha256);
 let undone=revised;for(const c of [...changes.proseChanges].reverse())undone=undone.replace(c.after,c.before);
 check('Reverse replacements recover original R source byte for byte',undone===original);
 const python="from markdown_it import MarkdownIt\nfrom pathlib import Path\nimport sys,re\ns=Path(sys.argv[1]).read_text()\ns=re.sub(r'\\*\\*(.+?)\\*\\*',r'<strong>\\1</strong>',s,flags=re.S)\nprint(MarkdownIt('commonmark',{'html':True,'typographer':False,'breaks':False}).enable('table').render(s),end='')";
 const compact=node=>{const structural=new Set(['BODY','ARTICLE','UL','OL','TABLE','THEAD','TBODY','TR']);const serial=n=>[...n.childNodes].map(c=>{if(c.nodeType===3){if(structural.has(n.nodeName)){if(/^\s*$/.test(c.data))return '';return c.data.replace(/^\n+|\n+$/g,'');}return c.data;}if(c.nodeType===1)return '<'+c.localName+'>'+serial(c)+'</'+c.localName+'>';return '';}).join('');return serial(node);};
 const normalize=node=>{node.querySelectorAll('details,summary,.voice-table-scroll').forEach(el=>el.replaceWith(...el.childNodes));node.querySelectorAll('*').forEach(el=>{for(const attr of [...el.attributes])el.removeAttribute(attr.name);});return node;};
 const blocks=node=>[...node.querySelectorAll('h2,h3,p,li,th,td,pre,blockquote,hr')].map(el=>({tag:el.tagName,text:el.textContent}));
 report.prose=[];
 for(const [version,page,filename] of [[61,a,'full.md'],[62,b,'full-v62.md']]){
  const rendered=spawnSync('python3',['-c',python,path.join(here,filename)],{encoding:'utf8',maxBuffer:20*1024*1024});if(rendered.status!==0)throw new Error(rendered.stderr);
  const ref=new JSDOM(rendered.stdout),actual=new JSDOM(page.v55.html);instances.push(ref,actual);
  const expectedBlocks=blocks(ref.window.document.body),actualBlocks=blocks(actual.window.document.body);
  check(`v${version} every R narrative block matches ${filename} character for character`,JSON.stringify(expectedBlocks)===JSON.stringify(actualBlocks),{expectedBlocks:expectedBlocks.length,actualBlocks:actualBlocks.length});
  check(`v${version} every strong span matches independent rendering`,JSON.stringify([...ref.window.document.querySelectorAll('strong')].map(n=>n.textContent))===JSON.stringify([...actual.window.document.querySelectorAll('strong')].map(n=>n.textContent)));
  const actualBody=normalize(actual.window.document.body),expectedBody=normalize(ref.window.document.body),actualText=compact(actualBody),expectedText=compact(expectedBody);
  check(`v${version} full narrative DOM matches after removing only presentation wrappers`,actualText===expectedText,{actualCharacters:actualText.length,expectedCharacters:expectedText.length});
  report.prose.push({version,source:filename,blocks:actualBlocks.length,characterIdentical:actualText===expectedText,sha256:sha(actualText)});
 }
 const without=(obj,keys)=>Object.fromEntries(Object.entries(obj).filter(([k])=>!keys.includes(k)));
 check('R page identity and all non-v55 fields unchanged',JSON.stringify(without(a,['v55']))===JSON.stringify(without(b,['v55'])));
 check('R v55 schema unchanged',JSON.stringify(Object.keys(a.v55))===JSON.stringify(Object.keys(b.v55)));
 check('R heading ids and levels retain r61 anchors',a.v55.headings.length===b.v55.headings.length&&a.v55.headings.every((h,i)=>h.id===b.v55.headings[i].id&&h.level===b.v55.headings[i].level&&h.id.startsWith('r61-heading-')));
 const changedHeading=a.v55.headings.map((h,i)=>h.title===b.v55.headings[i].title?null:{before:h.title,after:b.v55.headings[i].title}).filter(Boolean);
 check('Only authorized merge-boundary heading title changed',changedHeading.length===1&&changes.proseChanges.some(c=>c.before==='### '+changedHeading[0].before&&c.after==='### '+changedHeading[0].after),changedHeading);
 const oldDom=new JSDOM(a.v55.html),newDom=new JSDOM(b.v55.html);instances.push(oldDom,newDom);
 check('R history fold id remains r61-history',oldDom.window.document.querySelector('details')?.id==='r61-history'&&newDom.window.document.querySelector('details')?.id==='r61-history');
 const oldComments=[...a.v55.html.matchAll(/<!--[\s\S]*?-->/g)].map(m=>m[0]),newComments=[...b.v55.html.matchAll(/<!--[\s\S]*?-->/g)].map(m=>m[0]);
 check('Every R figure slot and fold marker stays in original order',JSON.stringify(oldComments)===JSON.stringify(newComments));
 for(const field of ['figureTitles','figureSubtitles']){
  check(`R ${field} changed only authorized figure`,JSON.stringify(without(a.v55[field],['r2-once-race']))===JSON.stringify(without(b.v55[field],['r2-once-race'])));
 }
 check('R figure frame title/subtitle use updated metadata',b.v55.figureTitles['r2-once-race']===changes.figureMetadata.title&&b.v55.figureSubtitles['r2-once-race']===changes.figureMetadata.subtitle);
 const newSvg=fs.readFileSync(path.join(here,'figures-v62/r2-once-race.svg'),'utf8'),originalSvg=fs.readFileSync(path.join(here,'figures/r2-once-race.svg'),'utf8');
 check('R race SVG exactly equals revised SVG file',next.diagrams['r2-once-race']===newSvg);
 check('R original SVG unchanged at recorded hash',sha(originalSvg)===changes.svgSourceSha256);
 let rebuiltSvg=old.diagrams['r2-once-race'];for(const c of changes.figureChanges)rebuiltSvg=rebuiltSvg.replaceAll(c.before,c.after);
 check('R race SVG differs from v61 only by recorded text changes',rebuiltSvg===newSvg);
 const xml=new JSDOM(newSvg,{contentType:'image/svg+xml'});instances.push(xml);check('Revised R SVG is valid XML',xml.window.document.documentElement.localName==='svg');
 const keys=Object.keys(old.diagrams).filter(k=>/^r(?:2)?-/.test(k)&&k!=='r2-once-race');
 check('All other R SVGs byte-identical to v61',keys.every(k=>old.diagrams[k]===next.diagrams[k]),keys);
 check('Node-label conservative width bounds all fit',changes.svgTextContainment.every(c=>c.pass_));
 report.authorizedProseReplacements=changes.proseChanges.length;report.figureChanges=changes.figureChanges.length;report.otherRSvgCount=keys.length;
} catch(error){check('Verification completed without error',false,error.stack);}
finally{instances.forEach(d=>d.window.close());report.passed=checks.every(c=>c.pass);fs.writeFileSync(path.join(here,'verification-r-v62.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({passed:report.passed,checks:checks.length,failed:checks.filter(c=>!c.pass)},null,2));if(!report.passed)process.exitCode=1;}
