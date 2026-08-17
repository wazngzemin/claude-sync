import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";
const input = await FileBlob.load("/Users/bytedance/Downloads/yx-files/工作簿1.xlsx");
const workbook = await SpreadsheetFile.importXlsx(input);
const values = workbook.worksheets.getItem("Sheet1").getUsedRange().values;
function col(n){let s="";n++;while(n){let r=(n-1)%26;s=String.fromCharCode(65+r)+s;n=Math.floor((n-1)/26);}return s;}
const starts=[];
for(let r=0;r<values.length;r++) if((values[r]??[]).slice(0,7).some(v=>v!==null&&v!==undefined&&String(v).trim()!=="")) starts.push(r);
for(let n=0;n<starts.length;n++){
 const s=starts[n],e=n+1<starts.length?starts[n+1]:values.length;
 console.log(`\n===== CASE ${n+1} ${values[s]?.[0]} =====`);
 for(let c=25;c<34;c++){
  const arr=[]; for(let r=s;r<e;r++){const v=values[r]?.[c];if(v!==null&&v!==undefined&&String(v).trim()!=="")arr.push(`[${r+1}] ${String(v).replaceAll("\n"," ")}`)}
  if(arr.length) console.log(`${col(c)}: ${arr.join(" || ")}`);
 }
}
