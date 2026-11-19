import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {SpreadsheetFile,FileBlob} from '@oai/artifact-tool';
const dir=fileURLToPath(new URL('.',import.meta.url));
const wb=await SpreadsheetFile.importXlsx(await FileBlob.load(dir+'赛力斯端状态v1.3-Trigger本地任务表-v02.xlsx'));
console.log((await wb.inspect({kind:'table',range:"'Trigger任务表'!A33:C37",include:'values',tableMaxRows:5,tableMaxCols:3,maxChars:1500})).ndjson);
for(const [label,sheetName,range] of [
  ['v02-final-opening','Trigger任务表','A1:F11'],
  ['v02-final-logic','Trigger任务表','G21:K25'],
  ['v02-final-temperature','Trigger任务表','G33:K37']
]){
  const p=await wb.render({sheetName,range,scale:1,format:'png'});
  await fs.writeFile(dir+label+'.png',new Uint8Array(await p.arrayBuffer()));
}
console.log('FINAL_NATIVE_REOPENED');
