import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {createRequire} from 'node:module';import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{JSDOM}=require('/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/jsdom'),D=path.dirname(fileURLToPath(import.meta.url));
const get=f=>JSON.parse(fs.readFileSync(path.join(D,f),'utf8'));
const baseline=get('baseline-data.json').pages.find(x=>x.id==='V').v34, current=get('candidate-data.json').pages.find(x=>x.id==='V').v34;
const d=new JSDOM(current.sections.map(x=>'<section id="'+x.id+'">'+x.html+'</section>').join('')).window.document;
let originalDetailsRetained=0;for(const s of baseline.sections){const old=new JSDOM(s.html).window.document;for(const e of old.querySelectorAll('details[id]')){const now=d.getElementById(e.id);assert(now,e.id);assert(now.textContent.includes(e.textContent),e.id);originalDetailsRetained++;}}
const archives=get('archive-review.json');assert.equal(archives.length,18);for(const row of archives){assert(!d.getElementById(row.id));for(const info of row.information){assert(d.getElementById(info.target),info.target);}}
const moves=get('round3-information-moves.json');for(const m of moves){assert(d.getElementById(m.to).textContent.includes(m.text));assert(!d.getElementById(m.from));}
const metrics=get('round3-metric-coverage.json');assert.equal(metrics.length,20);metrics.forEach(x=>assert(d.getElementById(x.target)));
const report={originalDataExpansionsRetained:originalDetailsRetained,removedArchives:archives.length,explicitBoundaryMoves:moves.filter(x=>x.reason.startsWith('显式')).length,mergedOtherExpansions:new Set(moves.filter(x=>!x.reason.startsWith('显式')).map(x=>x.from)).size,previousMetricStatementsMapped:metrics.length};fs.writeFileSync(path.join(D,'round3-audit.json'),JSON.stringify(report,null,2));console.log(report);
