import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const input = await FileBlob.load("/Users/bytedance/Downloads/yx-files/工作簿1.xlsx");
const workbook = await SpreadsheetFile.importXlsx(input);
const sheet = workbook.worksheets.getItem("Sheet1");
const values = sheet.getUsedRange().values;
const caseStarts = [];
for (let i = 0; i < values.length; i++) {
  const row = values[i] ?? [];
  if (row.slice(0, 7).some(v => v !== null && v !== undefined && String(v).trim() !== "")) caseStarts.push(i);
}
const headers = Array.from({length:34}, (_,i)=>String.fromCharCode(65+i));
const out = [];
for (let n = 0; n < caseStarts.length; n++) {
  const start = caseStarts[n];
  const end = n + 1 < caseStarts.length ? caseStarts[n+1] : values.length;
  const byCol = {};
  for (let c=0;c<34;c++) {
    const cells=[];
    for (let r=start;r<end;r++) {
      const v=values[r]?.[c];
      if (v!==null && v!==undefined && String(v).trim()!=="") cells.push({row:r+1,text:String(v)});
    }
    if (cells.length) byCol[headers[c]]=cells;
  }
  out.push({case:n+1,startRow:start+1,endRow:end,query:String(values[start]?.[0]??""),issue:String(values[start]?.[6]??""),byCol});
}
await fs.writeFile("/Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/.codex_spreadsheet_work/case_blocks.json", JSON.stringify(out,null,2));
for (const item of out) {
  console.log(`\n===== CASE ${item.case} rows ${item.startRow}-${item.endRow} | ${item.query} | ${item.issue} =====`);
  for (const [col,cells] of Object.entries(item.byCol)) {
    if (!["H","I"].includes(col)) console.log(`${col}: ${cells.map(x=>`[${x.row}] ${x.text}`).join(" || ")}`);
  }
}
