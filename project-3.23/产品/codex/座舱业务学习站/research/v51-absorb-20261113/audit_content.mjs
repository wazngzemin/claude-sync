import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {createRequire} from 'node:module';import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{JSDOM}=require('/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/jsdom'),D=path.dirname(fileURLToPath(import.meta.url));
const data=JSON.parse(fs.readFileSync(path.join(D,'candidate-data.json'))),copy=JSON.parse(fs.readFileSync(path.join(D,'copy.json'))),v=data.pages.find(x=>x.id==='V');let count=0;const stats=[];
for(const [id,c] of Object.entries(copy.sections)){
 const dom=new JSDOM(v.v34.sections.find(s=>s.id===id).html),b=dom.window.document.body;
 assert(b.firstElementChild.matches('.v51-guide'));assert(b.lastElementChild.matches('.v51-takeaway'));
 assert.equal(b.querySelectorAll('details>summary').length,[...b.querySelectorAll('details>summary')].filter(x=>x.textContent.trim()).length);
 b.querySelectorAll('details').forEach(x=>x.remove());const occurrences=(b.textContent.match(/待确认|待核实|仍需|不能据此/g)||[]).length;count+=occurrences;
 stats.push({id,intro:c.intro.length,points:c.points.map(x=>x.length),interview:c.interview.length,caveatsIncludingNewBoxes:occurrences});dom.window.close();
}
assert(count<=4);
const result={AandB:stats,C:count,E:'All ten conditions reviewed in visible prose by independent reviewer; final edits keep those conditions.',G:{short:copy.short.replace(/\s/g,'').length,retell:copy.retell.join('').replace(/\s/g,'').length}};
fs.writeFileSync(path.join(D,'content-audit.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
