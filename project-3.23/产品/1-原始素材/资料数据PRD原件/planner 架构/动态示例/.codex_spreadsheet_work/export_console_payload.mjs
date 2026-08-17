import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath =
  "/Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/outputs/019fc6a1-b054-7f62-9424-21e3390f9d18/工作簿1-全部114条动态示例.xlsx";
const outputPath =
  "/Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/.codex_spreadsheet_work/dynamic_examples_114.json";

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));
const sheet = workbook.worksheets.getItem("动态示例-决策分析");
const values = sheet.getUsedRange().values.slice(4);

const records = values
  .map((row, index) => ({
    index: index + 1,
    sourceRow: index + 5,
    query: String(row?.[0] ?? "").trim(),
    analysis: String(row?.[1] ?? "").trim(),
  }))
  .filter((record) => record.query || record.analysis)
  .map((record, index) => ({ ...record, index: index + 1 }));

const blankRows = records.filter((record) => !record.query || !record.analysis);
if (records.length === 0 || blankRows.length > 0) {
  throw new Error(
    `Expected complete records, got ${records.length}; incomplete rows: ${blankRows
      .map((record) => record.sourceRow)
      .join(", ")}`,
  );
}

await fs.writeFile(outputPath, JSON.stringify(records, null, 2), "utf8");

console.log(
  JSON.stringify({
    count: records.length,
    outputPath,
    first: records[0],
    middle: records[56],
    last: records.at(-1),
  }),
);
