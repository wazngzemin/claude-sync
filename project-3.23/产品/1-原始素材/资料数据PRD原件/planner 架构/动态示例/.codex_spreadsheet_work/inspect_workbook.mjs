import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "/Users/bytedance/Desktop/工作簿1.xlsx";
const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);

const summary = await workbook.inspect({
  kind: "workbook,sheet,table",
  maxChars: 8000,
  tableMaxRows: 5,
  tableMaxCols: 8,
  tableMaxCellChars: 100,
});
console.log("=== SUMMARY ===");
console.log(summary.ndjson);

for (const sheet of workbook.worksheets.items) {
  const used = sheet.getUsedRange();
  const values = used.values;
  console.log(`=== SHEET ${sheet.name} rows=${values.length} cols=${values[0]?.length ?? 0} ===`);
  const terms = [
    "动态示例",
    "播放我收藏的播客",
    "保存行车记录仪",
    "叫王总打招呼",
    "胎压怎么办",
    "窄道辅助灯",
    "最大风量",
    "晕车",
    "巡航",
    "打开美团",
  ];
  const hits = [];
  for (let r = 0; r < values.length; r++) {
    const row = values[r] ?? [];
    const joined = row.map((v) => (v == null ? "" : String(v))).join(" | ");
    if (terms.some((term) => joined.includes(term))) {
      hits.push({ row: r + 1, cells: row.map((v) => v == null ? null : String(v).slice(0, 800)) });
    }
  }
  console.log(`HITS ${hits.length}`);
  for (const hit of hits) console.log(JSON.stringify(hit, null, 0));

  const style = await workbook.inspect({
    kind: "computedStyle",
    sheetId: sheet.name,
    range: "A1:AI8",
    maxChars: 12000,
  });
  console.log("=== STYLES A1:AI8 ===");
  console.log(style.ndjson);
}
