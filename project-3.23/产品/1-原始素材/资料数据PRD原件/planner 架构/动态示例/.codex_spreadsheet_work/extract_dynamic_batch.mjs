import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const start = Number(process.argv[2] ?? 0);
const end = Number(process.argv[3] ?? 114);
const compactMode = process.argv[4] === "compact";
const workbook = await SpreadsheetFile.importXlsx(
  await FileBlob.load("/Users/bytedance/Desktop/工作簿1.xlsx"),
);
const sheet = workbook.worksheets.getItem("Sheet1");
const values = sheet.getUsedRange().values;
const clip = (value, max) => {
  if (value == null) return "";
  const text = String(value).replace(/\\n/g, "\n").replace(/\s+/g, " ").trim();
  return text.length > max ? text.slice(0, max - 1) + "…" : text;
};
const records = [];
for (let r = 0; r < values.length; r++) {
  const row = values[r] ?? [];
  if (row[2] !== "动态示例") continue;
  records.push({
    index: records.length + 1,
    rawRow: r + 1,
    query: clip(row[0], 500),
    issue: clip(row[5], 220),
    note: clip(row[6], 650),
    soundArea: clip(row[14], 100),
    summary: clip(row[15], 600),
    testId: row[16] ?? "",
    env: clip(row[17], 1000),
    intro: clip(row[18], 500),
    input: clip(row[19], 500),
    actions: clip(row[20], 1200),
    contextPlan: clip(row[22], 800),
    toolFeedback: clip(row[23], 700),
    goalList: clip(row[25], 500),
    expected: clip(row[27], 700),
    memory: clip(row[33], 500),
    output: clip(row[34], 800),
    logId: clip(row[8], 80),
  });
}
console.log("TOTAL=" + records.length + " BATCH=" + start + ":" + end);
for (const record of records.slice(start, end)) {
  if (!compactMode) {
    console.log(JSON.stringify(record));
    continue;
  }
  console.log(JSON.stringify({
    index: record.index,
    rawRow: record.rawRow,
    query: record.query,
    issue: record.issue,
    note: record.note,
    soundArea: record.soundArea,
    env: clip(record.env, 300),
    expected: clip(record.expected, 240),
    actions: clip(record.actions, 300),
  }));
}
