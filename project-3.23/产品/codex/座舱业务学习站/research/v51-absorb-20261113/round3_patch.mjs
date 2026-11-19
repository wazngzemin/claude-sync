import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{JSDOM}=require('/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/jsdom');
const D=path.dirname(fileURLToPath(import.meta.url));
export function round3(v,ledger){
 const archiveReview=JSON.parse(fs.readFileSync(path.join(D,'archive-review.json'),'utf8'));
 const mergePairs={
 'v51-v39-s1-explain-4':'v49-voice-capture-cases',
 'v51-v39-s1-explain-10':'v49-voice-asr-metrics',
 'v51-v39-s1-explain-11':'v49-voice-asr-badcases',
 'v51-v39-s3-explain-10':'v51-v39-s3-explain-4',
 'v51-v39-s2-explain-9':'v49-vad-second-pass-metrics',
 'v51-v39-s2-explain-8':'v49-vad-cut-badcases',
 'v51-v39-s4-explain-7':'v49-s4-person-rule-history',
 'v51-v39-s5-explain-10':'v50-s5-input-status'
 };
 const moves=[];
 for(const s of v.v34.sections){
  if(!/^v39-s[1-5]$/.test(s.id))continue;
  const dom=new JSDOM(s.html),d=dom.window.document;
  for(const a of [...d.querySelectorAll('details[id^="v51-r2-"]')]){
   if(!archiveReview.some(row=>row.id===a.id))throw Error('unreviewed '+a.id);
   const boundaries={
    'v51-r2-v39-s4-3':['v51-v39-s4-explain-5','验收时既要查是否选错功能，也要查位置、操作、档位等参数是否正确。'],
    'v51-r2-v39-s5-3':['v51-v39-s5-explain-6','两条路可以同时计算。断网或超时时不必等到两路结果齐全。']
   };
   if(boundaries[a.id]){const [id,text]=boundaries[a.id],target=d.getElementById(id);target.querySelector('.v49-detail-body').insertAdjacentHTML('beforeend',`<p>${text}</p>`);moves.push({from:a.id,to:id,title:target.querySelector('summary').textContent,text,reason:'显式保留原讲解中的检查维度或并行条件'});}
   if(a.id==='v51-r2-v39-s4-4'){
    const target=d.getElementById('v51-v39-s4-explain-1');const text='在这个找餐厅的教学示例里，此时还没有选定导航目的地。';
    target.querySelector('.v49-detail-body').insertAdjacentHTML('beforeend',`<p>${text}</p>`);
    moves.push({from:a.id,to:target.id,title:target.querySelector('summary').textContent,text,reason:'显式保留原交接段的状态边界'});
   }
   a.remove();
  }
  for(const [from,to] of Object.entries(mergePairs)){
   const a=d.getElementById(from);if(!a)continue;const b=d.getElementById(to);if(!b)throw Error(to);
   const body=a.querySelector('.v49-detail-body'),target=b.querySelector('.v49-detail-body');
   // Keep each original block exactly, consolidating only its disclosure control.
   for(const node of [...body.children]){
    const text=node.textContent.trim();if(!target.textContent.includes(text))target.append(node.cloneNode(true));
    moves.push({from,to,title:b.querySelector('summary').textContent,text,reason:'同一小节的解释与具体证据合并，无新增折叠'});
   }
   a.remove();for(const row of ledger)if(row.target===from)row.target=to;
  }
  s.html=d.body.innerHTML;dom.window.close();
 }
 // Round 2 archives contain redundant versions, not additional knowledge; semantic coverage is separately audited.
 for(let i=ledger.length-1;i>=0;i--)if(ledger[i].target.startsWith('v51-r2-'))ledger.splice(i,1);
 fs.writeFileSync(path.join(D,'round3-information-moves.json'),JSON.stringify(moves,null,2));
 const oldCopy=JSON.parse(fs.readFileSync(path.join(D,'copy-r2.json'),'utf8'));
 const metricTargets={
  'v39-s1':['v49-voice-asr-metrics','v49-voice-asr-badcases','v49-voice-asr-metrics','v49-voice-asr-badcases'],
  'v39-s3':['v49-s3-bargein-benchmarks','v50-s3-model-versions','v51-v39-s3-explain-4','v49-s3-bargein-benchmarks'],
  'v39-s2':['v49-vad-request-routing','v49-vad-match-rules','v49-vad-hit-cost-evidence','v49-vad-cut-badcases'],
  'v39-s4':['v50-s4-final-model-scope','v49-s4-local-benchmarks','v49-s4-local-benchmarks','v50-s4-adoption-evidence'],
  'v39-s5':['v49-s5-memory-test','v50-s5-sync-status','v49-s5-sync-test','v49-s5-memory-misses']
 };
 const metricMap=[];
 for(const [id,c]of Object.entries(oldCopy.sections)){
  const dom=new JSDOM(v.v34.sections.find(s=>s.id===id).html);
  [...c.points,c.interview].forEach((text,i)=>{const el=dom.window.document.getElementById(metricTargets[id][i]);if(!el)throw Error(metricTargets[id][i]);metricMap.push({section:id,text,target:el.id,title:el.querySelector('summary').textContent,action:'原有资料已覆盖；恢复核心总结框，不重复追加相同知识'});});dom.window.close();
 }
 fs.writeFileSync(path.join(D,'round3-metric-coverage.json'),JSON.stringify(metricMap,null,2));
}
