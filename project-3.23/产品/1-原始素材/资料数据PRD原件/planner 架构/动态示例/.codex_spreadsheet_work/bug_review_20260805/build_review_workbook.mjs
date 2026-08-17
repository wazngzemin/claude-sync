import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";
import { updates } from "./decision_analysis_updates.mjs";

const sourcePath = "/Users/bytedance/Downloads/bug收集.xlsx";
const filteredPath = new URL("./filtered_rows.json", import.meta.url);
const mappingPath = new URL("./platform_mapping.json", import.meta.url);
const outputPath = "/Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/outputs/019fc6a1-b054-7f62-9424-21e3390f9d18/bug收集-非3分74条决策分析修订.xlsx";
const previewDir = new URL("./previews/", import.meta.url);

const payload = JSON.parse(await fs.readFile(filteredPath, "utf8"));
const mappingPayload = JSON.parse(await fs.readFile(mappingPath, "utf8"));
const mappingByQuery = new Map(mappingPayload.mappings.map((item) => [item.query, item.matches]));
const updateByRow = new Map(updates.map((item) => [item.row, item]));
const missingRows = payload.filtered_rows
  .map((item) => item.excel_row)
  .filter((row) => !updateByRow.has(row));
if (missingRows.length || updates.length !== payload.filtered_rows.length) {
  throw new Error(`Decision mapping mismatch. Missing rows: ${missingRows.join(", ")}`);
}

const reviewRows = payload.filtered_rows.map((item) => {
  const update = updateByRow.get(item.excel_row);
  const environment = item.env_info_output || item.env_info || "";
  const needsConfirmation = /证据冲突|环境状态与车型能力冲突|待确认|需车型资料复核|CD期待主驾目标，但实际端状态/.test(update.risk || "");
  const matches = mappingByQuery.get(String(item.query).trim()) || [];
  const platformStatus = needsConfirmation ? "待确认" : matches.length ? "待编辑" : "待新增";
  const existingAnalyses = matches.map((match) => `【ID ${match.id}｜${match.creator}】${match.analysis}`).join("\n---\n");
  const mappingNote = matches.length === 0
    ? "平台无精确Query，将新增。"
    : matches.length === 1
      ? "平台精确命中1条。"
      : `平台精确命中${matches.length}条，需同步处理全部记录，避免重复规则冲突。`;
  return {
    sourceRow: item.excel_row,
    query: item.query,
    soundArea: item.sound_area || "",
    environment,
    score: item.score || "",
    issueClass: item.issue_class || "",
    issueNote: item.issue_note || "",
    evidence: item.evidence_basis || "",
    oldAnalysis: item.current_dynamic_example || "",
    newAnalysis: update.analysis,
    risk: update.risk || "",
    platformStatus,
    platformIds: matches.map((match) => match.id).join(", "),
    platformCreators: [...new Set(matches.map((match) => match.creator))].join(", "),
    existingAnalyses,
    mappingNote,
  };
});

const consolidatedOverrides = new Map([
  ["打开天窗", "该车型天窗为固定式，无论speaker_position或P/N/D等档位均不能语音或手动开启；不调用任何工具，礼貌说明天窗不可开合，不提示车顶按键，也不牵连对应音区的车窗。"],
  ["关闭天窗", "该车型天窗为固定式，不存在可执行的关闭动作；无论speaker_position或P/N/R等档位均不调用工具，直接说明天窗不可语音或手动开合，不能把失败说成权限问题，也不提示物理按键。"],
  ["关闭天窗通风", "“关闭天窗通风”只指天窗通风，不得改写成关闭车窗或切换空调循环。该车型天窗固定且没有通风/翘起模式，无论音区和档位都不调用工具，只说明语音和手动均不支持。"],
  ["天窗开一半", "“天窗开一半”是天窗开度控制，不得改写成车窗。该车型天窗固定，无论speaker_position、车速或档位都不能语音或手动调到50%；不调用工具，也不提供车顶按键操作建议。"],
]);

const platformRows = [];
for (const query of [...new Set(reviewRows.map((item) => String(item.query).trim()))]) {
  const rows = reviewRows.filter((item) => String(item.query).trim() === query);
  const first = rows[0];
  const matches = mappingByQuery.get(query) || [];
  const risks = [...new Set(rows.map((item) => item.risk).filter(Boolean))];
  const needsConfirmation = rows.some((item) => item.platformStatus === "待确认");
  const platformStatus = needsConfirmation ? "待确认" : matches.length ? "待编辑" : "待新增";
  platformRows.push({
    query,
    analysis: consolidatedOverrides.get(query) || first.newAnalysis,
    environments: [...new Set(rows.map((item) => item.environment).filter(Boolean))].join("\n---\n"),
    sourceRows: rows.map((item) => item.sourceRow).join(", "),
    soundAreas: [...new Set(rows.map((item) => item.soundArea).filter(Boolean))].join(", "),
    risk: risks.join("\n---\n"),
    platformStatus,
    platformIds: matches.map((match) => match.id).join(", "),
    platformCreators: [...new Set(matches.map((match) => match.creator))].join(", "),
    existingAnalyses: matches.map((match) => `【ID ${match.id}｜${match.creator}】${match.analysis}`).join("\n---\n"),
    mappingNote: matches.length === 0
      ? "无精确记录；确认后新增1条prod记录。"
      : matches.length === 1
        ? "精确命中1条；确认后编辑该记录。"
        : `精确命中${matches.length}条；确认后同步编辑全部精确记录，暂不删除重复项。`,
  });
}

const platformOperations = platformRows.flatMap((item) => {
  if (item.platformStatus === "待确认") return [];
  if (item.platformStatus === "待新增") {
    return [{ type: "add", query: item.query, analysis: item.analysis, environment: "prod", sourceRows: item.sourceRows }];
  }
  const matches = mappingByQuery.get(item.query) || [];
  return matches.map((match) => ({
    type: "edit",
    recordId: match.id,
    query: item.query,
    analysis: item.analysis,
    environment: match.env || "prod",
    creator: match.creator,
    previousAnalysis: match.analysis,
    sourceRows: item.sourceRows,
  }));
});

await fs.writeFile(new URL("./platform_operations.json", import.meta.url), JSON.stringify({
  generated_at: new Date().toISOString(),
  environment: "prod",
  summary: {
    unique_queries: platformRows.length,
    ready_add_queries: platformRows.filter((item) => item.platformStatus === "待新增").length,
    ready_edit_queries: platformRows.filter((item) => item.platformStatus === "待编辑").length,
    ready_write_operations: platformOperations.length,
    pending_confirmation_queries: platformRows.filter((item) => item.platformStatus === "待确认").length,
  },
  operations: platformOperations,
  pending: platformRows.filter((item) => item.platformStatus === "待确认"),
}, null, 2), "utf8");

const input = await FileBlob.load(sourcePath);
const workbook = await SpreadsheetFile.importXlsx(input);
const summary = workbook.worksheets.add("修订总览");
const detail = workbook.worksheets.add("修订清单");
const platform = workbook.worksheets.add("平台更新视图");

for (const sheet of [summary, detail, platform]) {
  sheet.showGridLines = false;
}

// 修订总览
summary.getRange("A1:H1").merge();
summary.getRange("A1").values = [["bug收集｜非3分 Query 决策分析修订"]];
summary.getRange("A1:H1").format = {
  fill: "#123B5D",
  font: { bold: true, color: "#FFFFFF", size: 18 },
  horizontalAlignment: "center",
  verticalAlignment: "center",
};
summary.getRange("A1:H1").format.rowHeight = 34;

summary.getRange("A3:B4").values = [
  ["源文件", sourcePath],
  ["筛选口径", "Query非空，且“模型输出评分（质检）”不是3分；评分字段实际位于CB，CC/CD/CE依次为问题分类、备注、标注依据。"],
];
summary.getRange("A3:A4").format = {
  fill: "#D9EAF7",
  font: { bold: true, color: "#123B5D" },
  verticalAlignment: "top",
};
summary.getRange("B3:B4").format = {
  fill: "#F7FAFC",
  font: { color: "#1F2937" },
  wrapText: true,
  verticalAlignment: "top",
};
summary.getRange("A3:B4").format.borders = { preset: "outside", style: "thin", color: "#B8C7D1" };

summary.getRange("A6:H6").values = [["需重写行", "", "车窗/天窗相关", "", "唯一Query", "", "证据冲突/待确认", ""]];
summary.getRange("A7:H7").values = [["", "", "", "", "", "", "", ""]];
summary.getRange("A6:B6").merge();
summary.getRange("C6:D6").merge();
summary.getRange("E6:F6").merge();
summary.getRange("G6:H6").merge();
summary.getRange("A7:B7").merge();
summary.getRange("C7:D7").merge();
summary.getRange("E7:F7").merge();
summary.getRange("G7:H7").merge();
summary.getRange("A7").formulas = [["=COUNTA('修订清单'!A2:A75)"]];
summary.getRange("C7").values = [[payload.counts.window_related_filtered_rows]];
summary.getRange("E7").values = [[payload.counts.unique_filtered_queries]];
summary.getRange("G7").formulas = [["=COUNTIF('修订清单'!L2:L75,\"待确认\")"]];
summary.getRange("A6:H6").format = {
  fill: "#D9EAF7",
  font: { bold: true, color: "#123B5D" },
  horizontalAlignment: "center",
};
summary.getRange("A7:H7").format = {
  fill: "#FFFFFF",
  font: { bold: true, color: "#0F766E", size: 20 },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  borders: { preset: "outside", style: "thin", color: "#B8C7D1" },
};
summary.getRange("A7:H7").format.rowHeight = 34;

summary.getRange("A9:H9").merge();
summary.getRange("A9").values = [["修订原则"]];
summary.getRange("A9:H9").format = {
  fill: "#0F766E",
  font: { bold: true, color: "#FFFFFF" },
};
summary.getRange("A10:H13").merge();
summary.getRange("A10").values = [[
  "1. 先读speaker/sound_area，再读显式位置；显式“全车/前排/右后”等优先于音区推断。\n" +
  "2. 用env_info判断当前状态：已到目标则no-op；缺状态则不能编造“已经开着/关着”。\n" +
  "3. 天窗按测试证据统一为固定式，语音和手动均不可开合；不得提示车顶按键。\n" +
  "4. 多意图只执行支持项，按工具归属并行；下游无明确function_code时不得声称成功。\n" +
  "5. 证据冲突、评分空白/NA仍保留在清单中，并在风险列单独标记。"
]];
summary.getRange("A10:H13").format = {
  fill: "#F0FDFA",
  font: { color: "#134E4A" },
  wrapText: true,
  verticalAlignment: "top",
  borders: { preset: "outside", style: "thin", color: "#99D5CE" },
};
summary.getRange("A10:H13").format.rowHeight = 28;
summary.getRange("A15:H15").merge();
summary.getRange("A15").values = [["平台只读映射（prod）"]];
summary.getRange("A15:H15").format = {
  fill: "#7C3AED",
  font: { bold: true, color: "#FFFFFF" },
};
summary.getRange("A16:H17").values = [
  ["平台总量（核对时）", mappingPayload.total_records_at_start, "无精确记录Query", mappingPayload.summary.noExactMatch, "精确命中Query", mappingPayload.summary.oneExactMatch + mappingPayload.summary.multipleExactMatches, "精确记录数", mappingPayload.summary.exactRecords],
  ["待新增Query", platformRows.filter((item) => item.platformStatus === "待新增").length, "待编辑Query", platformRows.filter((item) => item.platformStatus === "待编辑").length, "待确认Query", platformRows.filter((item) => item.platformStatus === "待确认").length, "重复命中Query", mappingPayload.summary.multipleExactMatches],
];
summary.getRange("A16:H17").format = {
  wrapText: true,
  verticalAlignment: "center",
  borders: { preset: "inside", style: "thin", color: "#D8B4FE" },
};
summary.getRange("A16:H17").conditionalFormats.add("containsText", {
  text: "待确认", format: { fill: "#FEF3C7", font: { color: "#92400E", bold: true } }
});
summary.getRange("A:H").format.columnWidth = 16;
summary.getRange("A:A").format.columnWidth = 20;
summary.getRange("B:B").format.columnWidth = 68;
summary.freezePanes.freezeRows(1);

// 修订清单
const detailHeaders = [
  "来源行", "Query", "speaker/sound_area", "实际环境", "原评分(CB)", "问题分类(CC)",
  "测试备注(CD)", "标注依据(CE)", "原动态示例", "新决策分析", "风险/证据边界", "平台状态",
  "平台记录ID", "平台现有决策分析", "映射备注"
];
const detailValues = reviewRows.map((item) => [
  item.sourceRow, item.query, item.soundArea, item.environment, item.score, item.issueClass,
  item.issueNote, item.evidence, item.oldAnalysis, item.newAnalysis, item.risk, item.platformStatus,
  item.platformIds, item.existingAnalyses, item.mappingNote
]);
detail.getRangeByIndexes(0, 0, 1, detailHeaders.length).values = [detailHeaders];
detail.getRangeByIndexes(1, 0, detailValues.length, detailHeaders.length).values = detailValues;
detail.getRange("A1:O1").format = {
  fill: "#123B5D",
  font: { bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
};
detail.getRange("A1:O1").format.rowHeight = 32;
detail.getRange("A2:O75").format = {
  verticalAlignment: "top",
  wrapText: true,
  font: { color: "#1F2937", size: 10 },
};
detail.getRange("A2:O75").format.rowHeight = 84;
detail.getRange("A:A").format.columnWidth = 10;
detail.getRange("B:B").format.columnWidth = 38;
detail.getRange("C:C").format.columnWidth = 16;
detail.getRange("D:D").format.columnWidth = 48;
detail.getRange("E:E").format.columnWidth = 30;
detail.getRange("F:F").format.columnWidth = 31;
detail.getRange("G:G").format.columnWidth = 42;
detail.getRange("H:H").format.columnWidth = 34;
detail.getRange("I:I").format.columnWidth = 64;
detail.getRange("J:J").format.columnWidth = 82;
detail.getRange("K:K").format.columnWidth = 48;
detail.getRange("L:L").format.columnWidth = 14;
detail.getRange("M:M").format.columnWidth = 18;
detail.getRange("N:N").format.columnWidth = 70;
detail.getRange("O:O").format.columnWidth = 36;
detail.freezePanes.freezeRows(1);
detail.freezePanes.freezeColumns(2);
const detailTable = detail.tables.add("A1:O75", true, "DecisionRevisionTable");
detailTable.style = "TableStyleMedium2";
detail.getRange("L2:L75").dataValidation = {
  rule: { type: "list", values: ["待新增", "待编辑", "待确认", "已更新", "无需更新"] }
};
detail.getRange("E2:E75").conditionalFormats.add("containsText", {
  text: "0分", format: { fill: "#FEE2E2", font: { color: "#B91C1C", bold: true } }
});
detail.getRange("E2:E75").conditionalFormats.add("containsText", {
  text: "1分", format: { fill: "#FFEDD5", font: { color: "#C2410C", bold: true } }
});
detail.getRange("E2:E75").conditionalFormats.add("containsText", {
  text: "2分", format: { fill: "#FEF3C7", font: { color: "#A16207", bold: true } }
});
detail.getRange("K2:K75").conditionalFormats.add("containsText", {
  text: "冲突", format: { fill: "#FDE68A", font: { color: "#92400E", bold: true } }
});
detail.getRange("L2:L75").conditionalFormats.add("containsText", {
  text: "待确认", format: { fill: "#FEF3C7", font: { color: "#92400E", bold: true } }
});

// 平台更新视图
const platformHeaders = ["Query", "决策分析（平台）", "实际测试环境（决策依据）", "来源行", "speaker/sound_area", "风险/证据边界", "平台处理", "平台记录ID", "创建人", "平台现有决策分析", "映射备注"];
const platformValues = platformRows.map((item) => [
  item.query, item.analysis, item.environments, item.sourceRows, item.soundAreas, item.risk, item.platformStatus,
  item.platformIds, item.platformCreators, item.existingAnalyses, item.mappingNote
]);
platform.getRangeByIndexes(0, 0, 1, platformHeaders.length).values = [platformHeaders];
platform.getRangeByIndexes(1, 0, platformValues.length, platformHeaders.length).values = platformValues;
platform.getRange("A1:K1").format = {
  fill: "#0F766E",
  font: { bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
};
platform.getRange("A1:K1").format.rowHeight = 32;
platform.getRange("A2:K63").format = {
  verticalAlignment: "top",
  wrapText: true,
  font: { color: "#1F2937", size: 10 },
};
platform.getRange("A2:K63").format.rowHeight = 96;
platform.getRange("A:A").format.columnWidth = 42;
platform.getRange("B:B").format.columnWidth = 92;
platform.getRange("C:C").format.columnWidth = 56;
platform.getRange("D:D").format.columnWidth = 10;
platform.getRange("E:E").format.columnWidth = 18;
platform.getRange("F:F").format.columnWidth = 48;
platform.getRange("G:G").format.columnWidth = 14;
platform.getRange("H:H").format.columnWidth = 18;
platform.getRange("I:I").format.columnWidth = 24;
platform.getRange("J:J").format.columnWidth = 72;
platform.getRange("K:K").format.columnWidth = 46;
platform.freezePanes.freezeRows(1);
platform.freezePanes.freezeColumns(1);
const platformTable = platform.tables.add("A1:K63", true, "PlatformUpdateTable");
platformTable.style = "TableStyleMedium4";
platform.getRange("G2:G63").dataValidation = {
  rule: { type: "list", values: ["待新增", "待编辑", "待确认", "已更新", "无需更新"] }
};
platform.getRange("G2:G63").conditionalFormats.add("containsText", {
  text: "待确认", format: { fill: "#FEF3C7", font: { color: "#92400E", bold: true } }
});

await fs.mkdir(new URL(".", `file://${outputPath}`).pathname, { recursive: true }).catch(() => {});
const exported = await SpreadsheetFile.exportXlsx(workbook);
await exported.save(outputPath);

await fs.mkdir(previewDir, { recursive: true });
for (const [fileName, sheetName, range] of [
  ["summary.png", "修订总览", "A1:H17"],
  ["platform-preview.png", "平台更新视图", "A1:G7"],
]) {
  const image = await workbook.render({ sheetName, range, format: "png", scale: 1, headers: true });
  await fs.writeFile(new URL(fileName, previewDir), new Uint8Array(await image.arrayBuffer()));
}

const inspect = await workbook.inspect({
  kind: "sheet,table,formula",
  maxChars: 12000,
  tableMaxRows: 5,
  tableMaxCols: 9,
  tableMaxCellChars: 160,
  options: { maxResults: 100 },
});
console.log(inspect.ndjson ?? inspect);
console.log(JSON.stringify({
  outputPath,
  rows: reviewRows.length,
  uniquePlatformQueries: platformRows.length,
  pendingConfirmation: platformRows.filter((item) => item.platformStatus === "待确认").length,
  pendingAdd: platformRows.filter((item) => item.platformStatus === "待新增").length,
  pendingEdit: platformRows.filter((item) => item.platformStatus === "待编辑").length,
}, null, 2));
