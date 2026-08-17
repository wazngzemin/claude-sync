import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "/Users/bytedance/Downloads/yx-files/工作簿1.xlsx";
const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);

const summary = await workbook.inspect({
  kind: "workbook,sheet,table",
  maxChars: 12000,
  tableMaxRows: 8,
  tableMaxCols: 12,
  tableMaxCellChars: 160,
});
console.log("=== SUMMARY ===");
console.log(summary.ndjson);

for (const sheet of workbook.worksheets.items) {
  const used = sheet.getUsedRange();
  const values = used?.values ?? [];
  console.log(`=== SHEET ${sheet.name} rows=${values.length} cols=${values[0]?.length ?? 0} ===`);
  for (let r = 0; r < Math.min(values.length, 12); r++) {
    console.log(JSON.stringify({row:r+1, values:values[r].map(v => v == null ? null : String(v).slice(0,1200))}));
  }
  const style = await workbook.inspect({
    kind: "computedStyle",
    sheetId: sheet.name,
    range: "A1:AZ12",
    maxChars: 16000,
  });
  console.log(`=== STYLES ${sheet.name} A1:AZ12 ===`);
  console.log(style.ndjson);
}
