import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const dir=path.dirname(fileURLToPath(import.meta.url));
const backup=JSON.parse(fs.readFileSync(path.join(dir,'backup-before-v13.json'))),native=JSON.parse(fs.readFileSync(path.join(dir,'native-v13.json'))),report=JSON.parse(fs.readFileSync(path.join(dir,'flow-verification.json')));
if(backup.nodes.length!==1442||native.nodes.length!==report.nativeNodes||report.errors.length||report.violations||report.disconnected.length)throw Error('备份或验收未通过，禁止更新');
const anchor=JSON.parse(fs.readFileSync(path.join(dir,'../豆包汽车-业务全链路-v12/anchor-native.json')));if(anchor.nodes.length!==1)throw Error('占位节点异常');fs.writeFileSync(path.join(dir,'anchor-native.json'),JSON.stringify(anchor));
const tok='QZhsw6FUYhrke9bBIrIca69tnPb',prefix='doubao-v13-20260907-visualfix1';
function call(args){const out=execFileSync('lark-cli',args,{cwd:dir,maxBuffer:32*1024*1024,timeout:180000}).toString(),r=JSON.parse(out);if(!r.ok&&r.code!==0)throw Error(out);return r;}
function update(file,key,overwrite=false){const args=['whiteboard','+update','--whiteboard-token',tok,'--source','@'+file,'--input_format','raw','--idempotent-token',key,'--yes','--as','user'];if(overwrite)args.push('--overwrite');return call(args);}
let reset=false;
try{update('./anchor-native.json',prefix+'-anchor',true);reset=true;console.log('旧版已备份，正在写入完整原生图。');const r=update('./native-v13.json',prefix+'-content');fs.writeFileSync(path.join(dir,'publish-result.json'),JSON.stringify(r,null,2));console.log(JSON.stringify({published:true,nativeNodes:native.nodes.length}));}
catch(e){if(reset){try{update('./anchor-native.json',prefix+'-rollback-anchor',true);update('./backup-before-v13.json',prefix+'-rollback-data');console.log('已恢复备份。');}catch(r){console.error('恢复失败：'+r.message)}}throw e;}
const renamed=call(['drive','files','patch','--params',JSON.stringify({file_token:'I0HkdlDbBo6Kk5xgnBlcH5benve',type:'docx'}),'--data',JSON.stringify({new_title:'豆包汽车｜完整业务架构流程图 v13'}),'--yes','--as','user']);console.log(JSON.stringify({renamed:renamed.code===0||renamed.ok===true}));
call(['whiteboard','+query','--whiteboard-token',tok,'--output_as','raw','--output','./live-v13','--as','user']);
const live=JSON.parse(fs.readFileSync(path.join(dir,'live-v13.json')));if(live.nodes.length!==native.nodes.length+1)throw Error('上线节点数不一致 '+live.nodes.length);
const texts=JSON.stringify(live.nodes.filter(n=>n.type==='text_shape'));for(const s of ['事件生产','dynamic_condition','20.1 理解完整诉求'])if(!texts.includes(s))throw Error('线上缺关键文本 '+s);
console.log(JSON.stringify({verified:true,liveNodes:live.nodes.length,backup:'backup-before-v13.json'}));
