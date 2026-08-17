import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "/Users/bytedance/Desktop/工作簿1.xlsx";
const outputPath = "/Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/outputs/019fc6a1-b054-7f62-9424-21e3390f9d18/工作簿1-全部114条动态示例.xlsx";

const inputWorkbook = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));
const outputWorkbook = await SpreadsheetFile.importXlsx(await FileBlob.load(outputPath));
const inputSheet = inputWorkbook.worksheets.getItem("Sheet1");
const outputSheet = outputWorkbook.worksheets.getItem("Sheet1");
const inputValues = inputSheet.getUsedRange().values;
const outputValues = outputSheet.getUsedRange().values;
const main = outputWorkbook.worksheets.getItem("动态示例-决策分析");
const audit = outputWorkbook.worksheets.getItem("动态示例-复核");
const mainValues = main.getUsedRange().values;
const auditValues = audit.getUsedRange().values;

const sameCell = (a, b) => String(a ?? "") === String(b ?? "");
let rawMismatches = 0;
for (const [r, row] of inputValues.entries()) {
  for (const [c, value] of row.entries()) {
    if (!sameCell(value, outputValues[r]?.[c])) rawMismatches++;
  }
}

const sourceDynamicRows = inputValues.filter((row) => row?.[2] === "动态示例");
const mainRows = mainValues.slice(4).filter((row) => String(row?.[0] ?? "").trim());
const auditRows = auditValues.slice(4).filter((row) => String(row?.[0] ?? "").trim());
const mainText = mainValues.flat().filter((value) => typeof value === "string").join("\n");
const auditRawRows = auditRows.map((row) => Number(row[1]));
const sourceRawRows = inputValues.map((row, index) => row?.[2] === "动态示例" ? index + 1 : null).filter(Boolean);
const rowMappingMismatches = sourceRawRows.filter((rawRow, index) => auditRawRows[index] !== rawRow);

const allowedTools = new Set([
  "vehicle_basic_control",
  "vehicle_system_settings",
  "vehicle_status_search",
  "weather_search",
  "poi_search",
  "route_planning",
  "navi_basic_control",
  "video_search",
  "music_search",
  "media_basic_control",
  "user_memory_search",
  "user_memory_operate",
  "face_id_register",
  "web_search",
  "goal_list_update",
  "ai_broadcast_generate",
  "broadcast_search",
  "auto_drive",
  "ambient_light_control",
  "vehicle_manual_qa",
  "car_care_qa",
  "audio_record",
  "image_generate",
  "visual_qa",
  "restaurant_reserve",
  "parking_fee_pay",
]);
const calledTools = [];
for (const row of mainRows) {
  const decision = String(row[1] ?? "");
  for (const match of decision.matchAll(/调用([a-z][a-z0-9_]*)/g)) calledTools.push(match[1]);
}
const unknownTools = [...new Set(calledTools.filter((tool) => !allowedTools.has(tool)))];
const duplicateAuditRawRows = auditRawRows.filter((value, index) => auditRawRows.indexOf(value) !== index);
const emptyDecisions = mainRows.filter((row) => !String(row[1] ?? "").trim()).length;

const checks = {
  inputDimensions: [inputValues.length, inputValues[0]?.length ?? 0],
  outputRawDimensions: [outputValues.length, outputValues[0]?.length ?? 0],
  rawSheetCellMismatches: rawMismatches,
  sourceDynamicRows: sourceDynamicRows.length,
  mainDecisionRows: mainRows.length,
  auditRows: auditRows.length,
  rowMappingMismatches: rowMappingMismatches.length,
  duplicateAuditRawRows: duplicateAuditRawRows.length,
  emptyDecisions,
  unknownTools,
  forbiddenWordingCells: /勿|禁止/.test(mainText),
  formulaErrorText: /#REF!|#DIV\/0!|#VALUE!|#NAME\\?|#N\/A/.test(mainText),
  firstAuditRawRow: auditRawRows[0],
  lastAuditRawRow: auditRawRows[auditRawRows.length - 1],
  firstDecision: mainRows[0],
  lastDecision: mainRows[mainRows.length - 1],
};
console.log(JSON.stringify(checks, null, 2));

if (rawMismatches !== 0) throw new Error("Raw Sheet1 changed");
if (sourceDynamicRows.length !== 114 || mainRows.length !== 114 || auditRows.length !== 114) throw new Error("114/114 coverage failed");
if (rowMappingMismatches.length || duplicateAuditRawRows.length || emptyDecisions) throw new Error("Row mapping or content validation failed");
if (unknownTools.length) throw new Error("Unknown tools: " + unknownTools.join(", "));
if (/勿|禁止/.test(mainText)) throw new Error("Forbidden wording found in main sheet");
