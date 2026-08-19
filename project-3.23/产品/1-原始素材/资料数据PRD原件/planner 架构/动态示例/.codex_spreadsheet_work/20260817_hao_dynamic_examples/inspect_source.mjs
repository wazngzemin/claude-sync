import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const source = "【Director】动态示例(for badcases修复）.xlsx";
const outDir = ".codex_spreadsheet_work/20260817_hao_dynamic_examples/previews-before";
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(source));

for (const range of ["A1:I12", "A360:I370", "A500:I521"]) {
  const result = await workbook.inspect({
    kind: "table",
    range: `'动态示例汇总表(SFT）'!${range}`,
    include: "values,formulas",
    tableMaxRows: 30,
    tableMaxCols: 12,
    maxChars: 12000,
  });
  console.log(JSON.stringify({ range, ndjson: result.ndjson }));
}

for (const term of ["冻", "冰窖", "好冷", "太冷", "冷死", "热死", "车内太热", "晒得好热"]) {
  const matches = await workbook.inspect({
    kind: "match",
    searchTerm: term,
    options: { useRegex: false, maxResults: 50 },
    maxChars: 9000,
    summary: `${term} matches`,
  });
  console.log(JSON.stringify({ term, matches: matches.ndjson }));
}

for (const range of ["A1:I6", "A515:I521"]) {
  const styles = await workbook.inspect({
    kind: "computedStyle",
    sheetId: "动态示例汇总表(SFT）",
    range,
    maxChars: 7000,
  });
  console.log(JSON.stringify({ range, styles: styles.ndjson }));
}

await fs.mkdir(outDir, { recursive: true });
for (const sheetName of ["动态示例汇总表(SFT）", "Sheet3"]) {
  const preview = await workbook.render({ sheetName, autoCrop: "all", scale: 0.7, format: "png" });
  await fs.writeFile(`${outDir}/${sheetName.replaceAll("/", "_")}.png`, new Uint8Array(await preview.arrayBuffer()));
}

for (const range of ["A1:I12", "A360:I370", "A500:I521"]) {
  const preview = await workbook.render({ sheetName: "动态示例汇总表(SFT）", range, scale: 1.5, format: "png" });
  await fs.writeFile(`${outDir}/${range.replace(":", "-")}.png`, new Uint8Array(await preview.arrayBuffer()));
}
