import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const sourcePath = "/Users/bytedance/Downloads/bug收集.xlsx";
const outputPath = new URL("./filtered_rows.json", import.meta.url);

function columnName(indexZeroBased) {
  let value = indexZeroBased + 1;
  let result = "";
  while (value > 0) {
    const remainder = (value - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    value = Math.floor((value - 1) / 26);
  }
  return result;
}

function isScoreThree(value) {
  if (typeof value === "number") return value === 3;
  const normalized = String(value ?? "")
    .trim()
    .replace(/\s+/g, "")
    .toLowerCase();
  return normalized === "3" || normalized.startsWith("3分");
}

function nonEmpty(value) {
  return value !== null && value !== undefined && String(value).trim() !== "";
}

const input = await FileBlob.load(sourcePath);
const workbook = await SpreadsheetFile.importXlsx(input);
const sheet = workbook.worksheets.getItem("Sheet1");
const used = sheet.getUsedRange(true);
const values = used.values;
const headers = values[0].map((value) => String(value ?? "").trim());

const allHeaderMatches = (name) => headers
  .map((header, index) => ({ header, index }))
  .filter((item) => item.header === name);
const exactIndex = (name) => headers.findIndex((header) => header === name);

const queryIndex = exactIndex("query");
const scoreIndex = exactIndex("模型输出评分（质检）");
if (queryIndex < 0 || scoreIndex < 0) {
  throw new Error("Required query/score headers were not found");
}

const issueClassIndex = scoreIndex + 1;
const issueNoteIndex = scoreIndex + 2;
const evidenceIndex = scoreIndex + 3;

const headerMap = headers.map((header, index) => ({
  column: columnName(index),
  index: index + 1,
  header,
}));

const field = (row, name, occurrence = "first") => {
  const matches = allHeaderMatches(name);
  if (matches.length === 0) return null;
  const match = occurrence === "last" ? matches[matches.length - 1] : matches[0];
  return row[match.index] ?? null;
};

const dataRows = values.slice(1).map((row, offset) => ({ row, excelRow: offset + 2 }));
const validRows = dataRows.filter(({ row }) => nonEmpty(row[queryIndex]));
const filtered = validRows
  .filter(({ row }) => !isScoreThree(row[scoreIndex]))
  .map(({ row, excelRow }) => ({
    excel_row: excelRow,
    query: row[queryIndex],
    original_owner: field(row, "问题分析人"),
    original_fix_method: field(row, "修复手段"),
    original_fix_note: field(row, "修复手段分类的备注"),
    original_issue_class: field(row, "问题分类-质检（BX）"),
    original_issue_note: field(row, "备注-质检", "first"),
    old_conversation_history: field(row, "对话历史_11"),
    old_log_id: field(row, "log_id_11"),
    sound_area: field(row, "sound_area"),
    test_id: field(row, "test_id"),
    env_info: field(row, "env_info"),
    context_build_idea: field(row, "context构造思路 或 工具返回构造思路"),
    multi_turn: field(row, "多轮"),
    status_old: field(row, "status_old"),
    memory: field(row, "memory"),
    seat_driver: field(row, "主驾"),
    seat_passenger: field(row, "副驾"),
    seat_left_rear: field(row, "左后"),
    seat_right_rear: field(row, "右后"),
    incar_visual_info: field(row, "incar_visual_info"),
    status: field(row, "status"),
    env_info_output: field(row, "env_info_output"),
    memory_output: field(row, "memory_output"),
    speaker: field(row, "speaker"),
    request_env: field(row, "request_env"),
    input: field(row, "input"),
    output: field(row, "output"),
    basic_world_info: field(row, "basic_world_info"),
    current_dynamic_example: field(row, "scenario_sample"),
    knowledge: field(row, "knowledge"),
    goal_list: field(row, "goal_list"),
    planner_input: field(row, "Planner的input"),
    up_user_query: field(row, "UP：user-query"),
    planner_preface: field(row, "Planner的铺垫话术"),
    planner_all_speech: field(row, "Planner的所有话术"),
    planner_summary: field(row, "Planner的总结话术"),
    planner_tool_calls: field(row, "Planner所有工具调用信息"),
    planner_tool_returns: field(row, "Planner所有工具返回信息"),
    conversation_history: field(row, "对话历史", "last"),
    assistant_content_1: field(row, "User-Now后Assistant内容1"),
    assistant_content_2: field(row, "User-Now后Assistant内容2"),
    assistant_content_3: field(row, "User-Now后Assistant内容3"),
    assistant_content_4: field(row, "User-Now后Assistant内容4"),
    assistant_content_5: field(row, "User-Now后Assistant内容5"),
    score: row[scoreIndex] ?? null,
    issue_class: row[issueClassIndex] ?? null,
    issue_note: row[issueNoteIndex] ?? null,
    evidence_basis: row[evidenceIndex] ?? null,
  }));

const countBy = (items, getter) => {
  const counts = new Map();
  for (const item of items) {
    const key = String(getter(item) ?? "<空>").trim() || "<空>";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-CN"))
    .map(([value, count]) => ({ value, count }));
};

const queryCounts = countBy(filtered, (item) => item.query);
const duplicateQueries = queryCounts.filter((item) => item.count > 1);
const windowRows = filtered.filter((item) => /车窗|窗户|窗|玻璃/.test(String(item.query)));

const payload = {
  source_path: sourcePath,
  sheet_name: sheet.name,
  used_range: used.address,
  header_map: headerMap,
  key_columns: {
    query: { column: columnName(queryIndex), header: headers[queryIndex] },
    score: { column: columnName(scoreIndex), header: headers[scoreIndex] },
    issue_class: { column: columnName(issueClassIndex), header: headers[issueClassIndex] },
    issue_note: { column: columnName(issueNoteIndex), header: headers[issueNoteIndex] },
    evidence_basis: { column: columnName(evidenceIndex), header: headers[evidenceIndex] },
  },
  counts: {
    workbook_rows_including_header: values.length,
    valid_query_rows: validRows.length,
    filtered_non_three_rows: filtered.length,
    score_three_rows: validRows.length - filtered.length,
    window_related_filtered_rows: windowRows.length,
    unique_filtered_queries: new Set(filtered.map((item) => String(item.query).trim())).size,
    duplicate_query_groups: duplicateQueries.length,
  },
  score_distribution: countBy(validRows, ({ row }) => row[scoreIndex]),
  issue_class_distribution_filtered: countBy(filtered, (item) => item.issue_class),
  duplicate_queries: duplicateQueries,
  filtered_rows: filtered,
};

await fs.writeFile(outputPath, JSON.stringify(payload, null, 2), "utf8");

console.log(JSON.stringify({
  key_columns: payload.key_columns,
  counts: payload.counts,
  score_distribution: payload.score_distribution,
  issue_class_distribution_filtered: payload.issue_class_distribution_filtered,
  duplicate_queries: payload.duplicate_queries,
}, null, 2));
