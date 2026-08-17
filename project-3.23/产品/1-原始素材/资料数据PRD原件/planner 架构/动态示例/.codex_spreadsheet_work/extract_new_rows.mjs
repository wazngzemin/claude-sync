import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const input = await FileBlob.load("/Users/bytedance/Downloads/yx-files/工作簿1.xlsx");
const workbook = await SpreadsheetFile.importXlsx(input);
const sheet = workbook.worksheets.getItem("Sheet1");
const values = sheet.getUsedRange().values;
const cols = (row, indexes) => Object.fromEntries(indexes.map(i => [i, row[i] == null ? null : String(row[i])]));
const starts = [];
for (let i = 0; i < values.length; i++) {
  const row = values[i] ?? [];
  if (row.slice(0, 7).some(v => v !== null && v !== undefined && String(v).trim() !== "")) {
    starts.push({row:i+1, first7:cols(row,[0,1,2,3,4,5,6]), keyCols:cols(row,[13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33])});
  }
}
await fs.writeFile("/Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/.codex_spreadsheet_work/new_starts.json", JSON.stringify(starts, null, 2));
console.log(`starts=${starts.length}`);
for (const item of starts) console.log(JSON.stringify(item));
