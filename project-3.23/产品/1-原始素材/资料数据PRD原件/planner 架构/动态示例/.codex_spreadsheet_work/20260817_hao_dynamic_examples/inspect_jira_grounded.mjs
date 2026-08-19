import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const source = "【Director】动态示例(for badcases修复）.xlsx";
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(source));

for (const term of [
  "通讯录",
  "胎压",
  "手里拿",
  "拍照",
  "自动驻车",
  "当前位置",
  "我现在在哪",
  "音乐律动",
  "遮阳帘",
  "有点冷",
  "好冷",
  "有点热",
  "车内太热",
]) {
  const result = await workbook.inspect({
    kind: "match",
    searchTerm: term,
    options: { useRegex: false, maxResults: 100 },
    maxChars: 12000,
    summary: `${term} matches`,
  });
  console.log(JSON.stringify({ term, ndjson: result.ndjson }));
}

for (const range of ["A15:I20", "A360:I370", "A380:I385", "A398:I415", "A426:I431", "A454:I459", "A500:I521"]) {
  const result = await workbook.inspect({
    kind: "table",
    range: `'动态示例汇总表(SFT）'!${range}`,
    include: "values,formulas",
    tableMaxRows: 30,
    tableMaxCols: 10,
    maxChars: 18000,
  });
  console.log(JSON.stringify({ range, ndjson: result.ndjson }));
}
