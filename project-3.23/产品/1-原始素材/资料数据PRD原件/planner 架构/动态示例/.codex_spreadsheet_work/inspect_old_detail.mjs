import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";
const input = await FileBlob.load("/Users/bytedance/Downloads/未命名多维表格.xlsx");
const workbook = await SpreadsheetFile.importXlsx(input);
const sheet = workbook.worksheets.getItemAt(0);
const values = sheet.getUsedRange().values;
console.log("headers", values[0].map((v, i) => `${i + 1}:${v}`).join("\n"));
const idx = values[0].findIndex((v) => v === "修复手段");
console.log("repair col", idx + 1, "dynamic rows", values.slice(1).filter((r) => r[idx] === "动态示例").length);
for (let r = 1; r < values.length; r++) {
  if (values[r][idx] === "动态示例") {
    console.log(JSON.stringify({row:r+1, query:values[r][0], repair:values[r][idx], note:values[r][3], summary:values[r][15], intro:values[r][18], input:values[r][19]}, (_,v)=>typeof v==='string'?v.slice(0,3000):v));
  }
}
