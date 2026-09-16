import fs from "node:fs/promises";
import path from "node:path";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const outputDir = "/Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/触发器包含条件/outputs/01a08566-3003-7ee2-8dc2-409976556ae6";
const targetPath = "/Users/bytedance/Downloads/yx-files/【上汽DNA - AI汽车 1.0 - IS4PR】场景感知状态信号库v2.6.xlsx";
const triggerPath = "/Users/bytedance/Downloads/yx-files/触发器条件.xlsx";
const outputPath = path.join(outputDir, "上汽V2.7-触发器能力四列对齐预览-v02.xlsx");
const beforePreviewPath = path.join(outputDir, "saic-v27-before.png");
const afterPreviewPath = path.join(outputDir, "saic-v27-after.png");
const reportPath = path.join(outputDir, "saic-trigger-mapping-report.json");

const normalize = (value) => {
  if (value === null || value === undefined) return "";
  return String(value)
    .trim()
    .toLowerCase()
    .replaceAll("（", "(")
    .replaceAll("）", ")")
    .replaceAll("，", ",")
    .replace(/\s+/g, "");
};

const asText = (value) => value === null || value === undefined ? "" : String(value).trim();
const isNonBlank = (value) => value !== null && value !== undefined && String(value).trim() !== "";

async function importWorkbook(filePath) {
  return SpreadsheetFile.importXlsx(await FileBlob.load(filePath));
}

async function saveRender(workbook, sheetName, range, filePath) {
  const preview = await workbook.render({ sheetName, range, scale: 1, format: "png" });
  await fs.writeFile(filePath, new Uint8Array(await preview.arrayBuffer()));
}

async function previewBefore() {
  await fs.mkdir(outputDir, { recursive: true });
  const workbook = await importWorkbook(targetPath);
  await saveRender(workbook, "【New!!!】V2.7", "A1:AF18", beforePreviewPath);
  const overview = await workbook.inspect({
    kind: "sheet,table,region",
    sheetId: "【New!!!】V2.7",
    range: "A1:AF8",
    maxChars: 8000,
    tableMaxRows: 8,
    tableMaxCols: 32,
  });
  console.log(overview.ndjson);
  console.log(JSON.stringify({ beforePreviewPath }));
}

function buildSourceRows(values) {
  const rows = [];
  let category1 = "";
  let category2 = "";
  let signalName = "";

  for (let index = 1; index < values.length; index += 1) {
    const row = values[index] ?? [];
    if (!row.slice(0, 10).some(isNonBlank)) continue;
    if (isNonBlank(row[0])) category1 = asText(row[0]);
    if (isNonBlank(row[1])) category2 = asText(row[1]);
    if (isNonBlank(row[2])) signalName = asText(row[2]);
    rows.push({
      sourceRow: index + 1,
      category1,
      category2,
      signalName,
      parameter: asText(row[3]),
      parameterZh: asText(row[4]),
      type: asText(row[5]),
      valueRange: asText(row[6]),
      logic: asText(row[7]),
      multiKey: asText(row[8]),
      unit: asText(row[9]),
    });
  }
  return rows;
}

function buildTargetRows(values) {
  const rows = [];
  let category1 = "";
  let category2 = "";
  let signalId = "";
  let signalName = "";

  for (let index = 1; index < values.length; index += 1) {
    const row = values[index] ?? [];
    if (!row.slice(0, 32).some(isNonBlank)) continue;
    if (isNonBlank(row[0])) category1 = asText(row[0]);
    if (isNonBlank(row[1])) category2 = asText(row[1]);
    if (isNonBlank(row[2])) signalId = asText(row[2]);
    if (isNonBlank(row[5])) signalName = asText(row[5]);
    rows.push({
      targetRow: index + 1,
      category1,
      category2,
      signalId,
      signalName,
      parameter: asText(row[7]),
      parameterZh: asText(row[8]),
      type: asText(row[9]),
      valueRange: asText(row[10]),
    });
  }
  return rows;
}

function specialTarget(source, targets) {
  const bySignalAndZh = (name, zh) => targets.filter((target) =>
    normalize(target.signalName) === normalize(name) && normalize(target.parameterZh) === normalize(zh));

  if (source.signalName === "续航状态") {
    const match = bySignalAndZh("续航状态", source.parameterZh);
    if (match.length === 1) return { target: match[0], reason: "V2.7 参数改名，按中文参数对齐" };
  }

  if (source.signalName === "上下电状态" && source.parameterZh === "上下电") {
    const match = targets.filter((target) =>
      normalize(target.signalName) === normalize("上下电状态") && normalize(target.parameter) === normalize("states"));
    if (match.length === 1) return { target: match[0], reason: "触发器旧表缺参数 key，V2.7 为 states" };
  }

  if (source.signalName === "车内空调状态" && source.parameter === "states") {
    const automatic = source.valueRange.includes("低档") || source.valueRange.includes("中档") || source.valueRange.includes("高档");
    const marker = automatic ? "自动空调风量档位" : "手动空调风量档位";
    const match = targets.filter((target) =>
      normalize(target.signalName) === normalize("车内空调状态") &&
      normalize(target.parameter) === normalize("states") &&
      target.valueRange.includes(marker));
    if (match.length === 1) return { target: match[0], reason: `同名 states 拆分，按${marker}对齐` };
  }

  return null;
}

async function build() {
  await fs.mkdir(outputDir, { recursive: true });
  const [workbook, triggerWorkbook] = await Promise.all([
    importWorkbook(targetPath),
    importWorkbook(triggerPath),
  ]);

  const targetSheet = workbook.worksheets.getItem("【New!!!】V2.7");
  const triggerSheet = triggerWorkbook.worksheets.getItem("全量（已有）");
  const targetValues = targetSheet.getRange("A1:AF400").values;
  const sourceValues = triggerSheet.getRange("A1:J200").values;

  const destinationExisting = targetSheet.getRange("AG1:AJ8").values;
  if (destinationExisting.flat().some(isNonBlank)) {
    throw new Error("目标列 AG:AJ 已有内容，为避免覆盖已停止。");
  }

  const sources = buildSourceRows(sourceValues);
  const targets = buildTargetRows(targetValues);
  const index = new Map();
  for (const target of targets) {
    const key = `${normalize(target.signalName)}::${normalize(target.parameter)}`;
    if (!index.has(key)) index.set(key, []);
    index.get(key).push(target);
  }

  const writes = Array.from({ length: 272 }, () => [null, null, null, null]);
  writes[0] = ["触发器是否支持", "逻辑表达式", "支持多选主key", "默认单位"];
  const matched = [];
  const manualMappings = [];
  const unmatched = [];
  const usedTargetRows = new Set();

  // The trigger condition sheet is the supported whitelist. Valid endpoint-state parameter rows
  // default to N and are upgraded to Y when a trigger record maps to them.
  for (const target of targets) {
    writes[target.targetRow - 1][0] = "N";
  }

  for (const source of sources) {
    const key = `${normalize(source.signalName)}::${normalize(source.parameter)}`;
    const candidates = index.get(key) ?? [];
    let target = null;
    let reason = "信号名称 + 参数 key 精确匹配";

    if (candidates.length === 1) {
      target = candidates[0];
    } else {
      const special = specialTarget(source, targets);
      if (special) {
        target = special.target;
        reason = special.reason;
        manualMappings.push({ source, target, reason });
      }
    }

    if (!target) {
      unmatched.push({
        sourceRow: source.sourceRow,
        signalName: source.signalName,
        parameter: source.parameter,
        parameterZh: source.parameterZh,
        logic: source.logic,
        reason: candidates.length > 1 ? "一对多，且无法按类型/值域唯一对齐" : "V2.7 中未找到对应信号参数",
      });
      continue;
    }

    if (usedTargetRows.has(target.targetRow)) {
      unmatched.push({
        sourceRow: source.sourceRow,
        signalName: source.signalName,
        parameter: source.parameter,
        parameterZh: source.parameterZh,
        logic: source.logic,
        reason: `目标行 ${target.targetRow} 已被其他条件占用，需人工复核`,
      });
      continue;
    }

    usedTargetRows.add(target.targetRow);
    writes[target.targetRow - 1] = ["Y", source.logic || null, source.multiKey || null, source.unit || null];
    matched.push({
      sourceRow: source.sourceRow,
      targetRow: target.targetRow,
      signalId: target.signalId,
      signalName: target.signalName,
      parameter: target.parameter,
      parameterZh: target.parameterZh,
      logic: source.logic,
      multiKey: source.multiKey,
      unit: source.unit,
      reason,
    });
  }

  // Extend the adjacent QA style first, then replace every copied value with the mapped result.
  targetSheet.getRange("AD1:AF272").copyTo(targetSheet.getRange("AG1:AI272"), "all");
  targetSheet.getRange("AF1:AF272").copyTo(targetSheet.getRange("AJ1:AJ272"), "all");
  targetSheet.getRange("AG1:AJ272").values = writes;
  targetSheet.getRange("AG1:AJ1").format.wrapText = true;
  targetSheet.getRange("AG1:AJ1").format.font = { bold: true };
  targetSheet.getRange("AG:AG").format.columnWidth = 15;
  targetSheet.getRange("AH:AH").format.columnWidth = 22;
  targetSheet.getRange("AI:AI").format.columnWidth = 16;
  targetSheet.getRange("AJ:AJ").format.columnWidth = 12;

  workbook.recalculate();

  const report = {
    source: {
      triggerExport: triggerPath,
      triggerRows: sources.length,
      targetBaseline: targetPath,
      targetSheet: "【New!!!】V2.7",
    },
    destinationColumns: ["AG 触发器是否支持", "AH 逻辑表达式", "AI 支持多选主key", "AJ 默认单位"],
    supportedCount: matched.length,
    unsupportedCount: targets.length - matched.length,
    matchedCount: matched.length,
    manualMappingCount: manualMappings.length,
    unmatchedCount: unmatched.length,
    manualMappings,
    unmatched,
  };

  await fs.writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");
  await saveRender(workbook, "【New!!!】V2.7", "A1:AJ18", afterPreviewPath);

  const verification = await workbook.inspect({
    kind: "table",
    sheetId: "【New!!!】V2.7",
    range: "A1:AJ18",
    include: "values,formulas",
    tableMaxRows: 18,
    tableMaxCols: 36,
    maxChars: 16000,
  });
  console.log(verification.ndjson);

  const errors = await workbook.inspect({
    kind: "match",
    searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!",
    options: { useRegex: true, maxResults: 300 },
    summary: "final formula error scan",
  });
  console.log(errors.ndjson);

  const output = await SpreadsheetFile.exportXlsx(workbook);
  await output.save(outputPath);
  console.log(JSON.stringify({ outputPath, afterPreviewPath, reportPath, matched: matched.length, manualMappings: manualMappings.length, unmatched }));
}

const mode = process.argv[2] ?? "preview";
if (mode === "preview") await previewBefore();
else if (mode === "build") await build();
else throw new Error(`Unknown mode: ${mode}`);
