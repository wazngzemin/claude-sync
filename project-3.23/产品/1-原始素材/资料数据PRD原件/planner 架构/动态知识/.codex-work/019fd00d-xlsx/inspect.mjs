import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const files = [
  "/Users/bytedance/Downloads/场景知识更换模型.xlsx",
  "/Users/bytedance/Downloads/动态知识.xlsx",
];

for (const path of files) {
  const input = await FileBlob.load(path);
  const workbook = await SpreadsheetFile.importXlsx(input);
  const sheetInspect = await workbook.inspect({
    kind: "sheet",
    include: "id,name",
    maxChars: 20000,
  });
  const workbookInspect = await workbook.inspect({
    kind: "workbook,sheet,table,definedName",
    maxChars: 50000,
    tableMaxRows: 10,
    tableMaxCols: 15,
    tableMaxCellChars: 120,
  });

  const sheets = [];
  for (let i = 0; i < workbook.worksheets.items.length; i += 1) {
    const sheet = workbook.worksheets.getItemAt(i);
    const used = sheet.getUsedRange();
    const values = used?.values ?? [];
    const formulas = used?.formulas ?? [];
    const rows = values;
    sheets.push({
      index: i,
      name: sheet.name,
      rowCount: rows.length,
      colCount: rows.reduce((max, row) => Math.max(max, row.length), 0),
      values: rows,
      formulas,
    });
  }

  const result = {
    path,
    sheetInspect: sheetInspect.ndjson,
    workbookInspect: workbookInspect.ndjson,
    sheets,
  };
  const outName = path.includes("场景知识更换模型") ? "xuran.json" : "dynamic.json";
  await fs.writeFile(new URL(outName, import.meta.url), JSON.stringify(result, null, 2));
  console.log(JSON.stringify({ path, sheets: sheets.map(({ name, rowCount, colCount }) => ({ name, rowCount, colCount })) }));
}
