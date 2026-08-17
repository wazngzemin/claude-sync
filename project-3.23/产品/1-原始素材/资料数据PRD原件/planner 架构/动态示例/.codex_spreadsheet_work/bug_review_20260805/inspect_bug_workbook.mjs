import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const sourcePath = "/Users/bytedance/Downloads/bug收集.xlsx";
const input = await FileBlob.load(sourcePath);
const workbook = await SpreadsheetFile.importXlsx(input);

const summary = await workbook.inspect({
  kind: "workbook,sheet,table,drawing,definedName",
  maxChars: 12000,
  tableMaxRows: 8,
  tableMaxCols: 12,
  tableMaxCellChars: 120,
});
console.log("=== WORKBOOK SUMMARY ===");
console.log(summary.ndjson ?? summary);

const sheetSummary = await workbook.inspect({
  kind: "sheet",
  include: "id,name",
  maxChars: 12000,
});
console.log("=== SHEETS ===");
console.log(sheetSummary.ndjson ?? sheetSummary);

for (const sheet of workbook.worksheets.items) {
  const used = sheet.getUsedRange(true);
  console.log(`=== SHEET ${sheet.name} ===`);
  console.log(JSON.stringify({
    address: used?.address ?? null,
    rowCount: used?.rowCount ?? null,
    columnCount: used?.columnCount ?? null,
  }));

  const maxRows = Math.min(12, used?.rowCount ?? 12);
  const maxCols = Math.min(83, used?.columnCount ?? 83);
  if (maxRows > 0 && maxCols > 0) {
    const headerBlock = sheet.getRangeByIndexes(0, 0, maxRows, maxCols);
    console.log("=== TOP VALUES ===");
    console.log(JSON.stringify(headerBlock.values));
  }

  if ((used?.columnCount ?? 0) >= 83) {
    const maxTailRows = Math.min(30, used?.rowCount ?? 30);
    const tailBlock = sheet.getRangeByIndexes(0, 78, maxTailRows, 5);
    console.log("=== BY:CE SAMPLE ===");
    console.log(JSON.stringify(tailBlock.values));
  }
}
