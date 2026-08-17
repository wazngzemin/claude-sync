import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const input = await FileBlob.load("/Users/bytedance/Downloads/动态知识.xlsx");
const workbook = await SpreadsheetFile.importXlsx(input);
const checks = {};

checks.style = (await workbook.inspect({
  kind: "computedStyle",
  sheetId: "Sheet1",
  range: "A1:I13",
  maxChars: 30000,
})).ndjson;

checks.threads = (await workbook.inspect({
  kind: "thread",
  sheetId: "Sheet1",
  range: "A1:I13",
  maxChars: 10000,
})).ndjson;

checks.matches = (await workbook.inspect({
  kind: "match",
  searchTerm: "删除|删掉|需删|废弃|停用",
  options: { useRegex: true, maxResults: 100 },
  maxChars: 10000,
})).ndjson;

checks.drawings = (await workbook.inspect({
  kind: "drawing",
  sheetId: "Sheet1",
  maxChars: 10000,
})).ndjson;

await fs.writeFile(new URL("marks.json", import.meta.url), JSON.stringify(checks, null, 2));
console.log(JSON.stringify(checks, null, 2));
