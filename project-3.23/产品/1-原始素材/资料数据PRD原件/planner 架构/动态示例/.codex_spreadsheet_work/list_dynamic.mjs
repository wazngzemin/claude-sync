import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const input = await FileBlob.load("/Users/bytedance/Desktop/工作簿1.xlsx");
const workbook = await SpreadsheetFile.importXlsx(input);
const sheet = workbook.worksheets.getItem("Sheet1");
const values = sheet.getUsedRange().values;

const selected = [];
for (let r = 0; r < values.length; r++) {
  const row = values[r] ?? [];
  if (row[2] === "动态示例") {
    selected.push({
      row: r + 1,
      A: row[0],
      F: row[5],
      G: row[6],
      P: row[15],
      S: row[18],
      T: row[19],
      U: row[20],
    });
  }
}
console.log(`count=${selected.length}`);
for (const item of selected) {
  console.log(JSON.stringify(item, (_, v) => {
    if (v == null) return undefined;
    if (typeof v === "string") return v.slice(0, 500);
    return v;
  }));
}
