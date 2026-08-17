import fs from "node:fs/promises";

const base = new URL(".", import.meta.url);
const xuran = JSON.parse(await fs.readFile(new URL("xuran.json", base), "utf8"));
const dynamic = JSON.parse(await fs.readFile(new URL("dynamic.json", base), "utf8"));

const tests = xuran.sheets[0].values.slice(1).filter((row) => row[0] !== null && row[0] !== "");
const durations = tests.map((row) => Number(row[60])).sort((a, b) => a - b);
const percentileInc = (sorted, p) => {
  const index = (sorted.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const fraction = index - lower;
  return sorted[lower] + (sorted[upper] - sorted[lower]) * fraction;
};

const dynamicRows = dynamic.sheets[0].values.slice(1).filter((row) => row[0]);
const dynamicKnowledge = dynamicRows.map((row, index) => {
  const title = `${row[1]}-${row[2]}-${row[3]}-${row[4]}`;
  const reconstructed = [
    `场景名称：${title}`,
    `场景描述：${row[5] ?? ""}`,
    row[6] ?? "",
    row[7] ?? "",
  ].join("\n");
  return {
    excelRow: index + 2,
    id: row[0],
    title,
    reconstructed,
  };
});

const firstKnowledge = tests.flatMap((row, index) => {
  if (typeof row[33] !== "string" || !row[33].includes("场景名称：")) return [];
  return row[33]
    .split(/(?=场景名称：)/)
    .filter((value) => value.startsWith("场景名称："))
    .map((value) => ({ excelRow: index + 2, query: row[3], value }));
});

const compare = firstKnowledge.map((item) => {
  const title = item.value.split("\n", 1)[0].replace(/^场景名称：/, "");
  const current = dynamicKnowledge.find((entry) => entry.title === title);
  const firstLines = item.value.split("\n");
  const currentLines = current?.reconstructed.split("\n") ?? [];
  const onlyFirst = firstLines.filter((line) => !currentLines.includes(line));
  const onlyCurrent = currentLines.filter((line) => !firstLines.includes(line));
  return {
    firstExcelRow: item.excelRow,
    query: item.query,
    title,
    currentId: current?.id ?? null,
    currentExcelRow: current?.excelRow ?? null,
    exactMatch: current ? item.value === current.reconstructed : false,
    onlyFirst,
    onlyCurrent,
  };
});

const result = {
  testCount: tests.length,
  matchResultCounts: Object.fromEntries(
    Object.entries(Object.groupBy(tests, (row) => row[59] ?? "<blank>"))
      .map(([key, rows]) => [key, rows.length]),
  ),
  duration: {
    count: durations.length,
    mean: durations.reduce((a, b) => a + b, 0) / durations.length,
    p90PercentileInc: percentileInc(durations, 0.9),
    min: durations[0],
    max: durations.at(-1),
  },
  dynamicKnowledge: dynamicKnowledge.map(({ reconstructed, ...entry }) => entry),
  knowledgeComparisons: compare,
};

await fs.writeFile(new URL("analysis.json", base), JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
