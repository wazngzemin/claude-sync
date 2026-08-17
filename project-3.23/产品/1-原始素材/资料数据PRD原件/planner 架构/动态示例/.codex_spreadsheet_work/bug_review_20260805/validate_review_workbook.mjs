import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";
import { updates } from "./decision_analysis_updates.mjs";

const outputPath = "/Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/outputs/019fc6a1-b054-7f62-9424-21e3390f9d18/bug收集-非3分74条决策分析修订.xlsx";
const input = await FileBlob.load(outputPath);
const workbook = await SpreadsheetFile.importXlsx(input);

const errors = [];
for (const sheetName of ["修订总览", "修订清单", "平台更新视图"]) {
  const sheet = workbook.worksheets.getItem(sheetName);
  const used = sheet.getUsedRange(true);
  used.values.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      if (typeof value === "string" && /#REF!|#DIV\/0!|#VALUE!|#NAME\?|#N\/A/.test(value)) {
        errors.push({ sheet: sheetName, row: rowIndex + 1, column: colIndex + 1, value });
      }
    });
  });
}

const platform = workbook.worksheets.getItem("平台更新视图");
const exportedRows = platform.getRange("A2:D63").values;
const expectedByRow = new Map(updates.map((item) => [item.row, item.analysis]));
const mismatches = exportedRows
  .map((row) => ({ query: row[0], analysis: row[1], sourceRow: row[3] }))
  .filter((item) => {
    const sourceRows = String(item.sourceRow).split(",").map((value) => Number(value.trim())).filter(Number.isFinite);
    const expected = expectedByRow.get(sourceRows[0]);
    const isConsolidatedSunroof = ["打开天窗", "关闭天窗", "关闭天窗通风", "天窗开一半"].includes(item.query);
    return !isConsolidatedSunroof && expected !== item.analysis;
  });

const summaryValues = workbook.worksheets.getItem("修订总览").getRange("A7:G7").values[0];
const result = {
  sheets: workbook.worksheets.items.map((sheet) => sheet.name),
  platformRows: exportedRows.length,
  formulaErrors: errors,
  decisionMismatches: mismatches,
  summary: {
    rows: summaryValues[0],
    windowRelated: summaryValues[2],
    uniqueQueries: summaryValues[4],
    pendingConfirmation: summaryValues[6],
  },
};

console.log(JSON.stringify(result, null, 2));
if (errors.length || mismatches.length || exportedRows.length !== 62) process.exit(1);
