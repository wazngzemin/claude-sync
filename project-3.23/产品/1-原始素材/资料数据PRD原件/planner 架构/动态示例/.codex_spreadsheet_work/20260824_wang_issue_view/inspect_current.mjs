import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const source = "outputs/01a00ece-74d6-7bc0-8908-98580aa0941b/【Director】动态示例-郝晓伟今日反馈-Jira核对修正版-20260817.xlsx";
const previewDir = ".codex_spreadsheet_work/20260824_wang_issue_view/previews-source";
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(source));

for (const term of [
  "向左变道", "后排座椅折叠", "儿童座椅", "双指滑动", "跟车距离", "跟车时距",
  "哨兵模式", "示廓灯", "发动机维修模式", "vehicle_manual_qa", "vehicle_basic_control", "auto_drive",
]) {
  const result = await workbook.inspect({
    kind: "match",
    searchTerm: term,
    options: { useRegex: false, maxResults: 100 },
    maxChars: 16000,
    summary: `${term} matches`,
  });
  console.log(JSON.stringify({ term, ndjson: result.ndjson }));
}

for (const range of ["A85:I92", "A136:I142", "A205:I215", "A288:I298", "A428:I440", "A518:I531"]) {
  const result = await workbook.inspect({
    kind: "table",
    range: `'动态示例汇总表(SFT）'!${range}`,
    include: "values,formulas",
    tableMaxRows: 30,
    tableMaxCols: 10,
    maxChars: 24000,
  });
  console.log(JSON.stringify({ range, ndjson: result.ndjson }));
}

await fs.mkdir(previewDir, { recursive: true });
for (const sheetName of ["动态示例汇总表(SFT）", "Sheet3"]) {
  const preview = await workbook.render({ sheetName, autoCrop: "all", scale: 0.55, format: "png" });
  await fs.writeFile(`${previewDir}/${sheetName.replaceAll("/", "_")}.png`, new Uint8Array(await preview.arrayBuffer()));
}
const endPreview = await workbook.render({ sheetName: "动态示例汇总表(SFT）", range: "A518:I531", scale: 1.2, format: "png" });
await fs.writeFile(`${previewDir}/A518-I531.png`, new Uint8Array(await endPreview.arrayBuffer()));
