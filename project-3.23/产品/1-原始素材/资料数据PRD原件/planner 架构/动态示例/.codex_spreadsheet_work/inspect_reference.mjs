import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const paths = [
  "/Users/bytedance/Desktop/工作簿1.xlsx",
  "/Users/bytedance/Downloads/未命名多维表格.xlsx",
];

for (const path of paths) {
  const input = await FileBlob.load(path);
  const workbook = await SpreadsheetFile.importXlsx(input);
  console.log(`=== ${path} ===`);
  console.log((await workbook.inspect({ kind: "sheet,table", maxChars: 5000, tableMaxRows: 8, tableMaxCols: 12, tableMaxCellChars: 120 })).ndjson);
  for (const sheet of workbook.worksheets.items) {
    const values = sheet.getUsedRange().values;
    console.log(`sheet=${sheet.name} rows=${values.length} cols=${values[0]?.length ?? 0}`);
    for (let r = 0; r < Math.min(values.length, 10); r++) {
      console.log(`row ${r + 1}:`, JSON.stringify(values[r].slice(0, Math.min(values[r].length, 20)), (_, v) => typeof v === "string" ? v.slice(0, 500) : v));
    }
  }
}
