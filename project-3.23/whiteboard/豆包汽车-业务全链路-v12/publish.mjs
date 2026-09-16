import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const dir=path.dirname(fileURLToPath(import.meta.url));
const backup=JSON.parse(fs.readFileSync(path.join(dir,'backup-v11.json'),'utf8'));
const native=JSON.parse(fs.readFileSync(path.join(dir,'native-v12.json'),'utf8'));
if(backup.nodes.length!==1690||native.nodes.length<1400)throw Error('备份或新版不满足预检');
const cli='/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/.bin/whiteboard-cli';
const r=JSON.parse(execFileSync(cli,['-i','reset-anchor.svg','--to','openapi','--format','json'],{cwd:dir,maxBuffer:10*1024*1024}));
fs.writeFileSync(path.join(dir,'anchor-native.json'),JSON.stringify(r.data.result));
const tok='QZhsw6FUYhrke9bBIrIca69tnPb',prefix='doubao-v12-20260907';
function call(args){const out=execFileSync('lark-cli',args,{cwd:dir,maxBuffer:24*1024*1024,timeout:180000}).toString();const p=JSON.parse(out);if(!p.ok&&p.code!==0)throw Error(out);return p}
function update(file,key,overwrite=false){const args=['whiteboard','+update','--whiteboard-token',tok,'--source','@'+file,'--input_format','raw','--idempotent-token',key,'--yes','--as','user'];if(overwrite)args.push('--overwrite');return call(args)}
let cleared=false;
try{update('./anchor-native.json',prefix+'-anchor-01',true);cleared=true;const result=update('./native-v12.json',prefix+'-content-01');fs.writeFileSync(path.join(dir,'publish-result.json'),JSON.stringify(result,null,2));console.log(JSON.stringify({published:true,nativeNodes:native.nodes.length,backup:'backup-v11.json'}));}
catch(e){if(cleared){try{update('./anchor-native.json',prefix+'-rollback-anchor',true);update('./backup-v11.json',prefix+'-rollback-data');console.log(JSON.stringify({restored:true}));}catch(rollback){console.error('回滚失败 '+rollback.message)}}throw e}
const rename=call(['drive','files','patch','--params',JSON.stringify({file_token:'I0HkdlDbBo6Kk5xgnBlcH5benve',type:'docx'}),'--data',JSON.stringify({new_title:'豆包汽车｜业务全链路｜宽间距详细版 v12'}),'--yes','--as','user']);
console.log(JSON.stringify({renamed:rename.ok}));
const live=call(['whiteboard','+query','--whiteboard-token',tok,'--output_as','raw','--output','./live-v12','--as','user']);console.log(JSON.stringify({live:live.data}));
const img=call(['whiteboard','+query','--whiteboard-token',tok,'--output_as','image','--output','./live-v12','--as','user']);console.log(JSON.stringify({image:img.data}));
