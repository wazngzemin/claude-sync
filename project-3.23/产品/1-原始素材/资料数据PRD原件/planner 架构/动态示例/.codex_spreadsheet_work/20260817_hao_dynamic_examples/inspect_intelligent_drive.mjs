import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const source = "outputs/01a00ece-74d6-7bc0-8908-98580aa0941b/【Director】动态示例-郝晓伟今日反馈-Jira核对修正版-20260817.xlsx";
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(source));

for (const term of ["变道", "跟车距离", "巡航车速", "巡航速度", "ACC", "智能驾驶", "auto_drive"]) {
  const result = await workbook.inspect({
    kind: "match",
    searchTerm: term,
    options: { useRegex: false, maxResults: 100 },
    maxChars: 16000,
    summary: `${term} matches`,
  });
  console.log(JSON.stringify({ term, ndjson: result.ndjson }));
}

for (const range of ["A140:I150", "A205:I215", "A288:I298", "A428:I438", "A518:I531"]) {
  const result = await workbook.inspect({
    kind: "table",
    range: `'动态示例汇总表(SFT）'!${range}`,
    include: "values,formulas",
    tableMaxRows: 90,
    tableMaxCols: 10,
    maxChars: 30000,
  });
  console.log(JSON.stringify({ range, ndjson: result.ndjson }));
}

const toolMap = await workbook.inspect({
  kind: "match",
  searchTerm: "auto_drive",
  options: { useRegex: false, maxResults: 50 },
  maxChars: 12000,
  summary: "auto_drive tool mapping",
});
console.log(JSON.stringify({ toolMap: toolMap.ndjson }));
