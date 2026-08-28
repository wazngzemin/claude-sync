import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const source = "【上汽DNA - AI汽车 1.0 - IS4PR】车控车设需求开发集成验证.xlsx";
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(source));

for (const term of ["发动机维修模式", "哨兵模式", "示廓灯", "维修模式", "跟车时距", "双指滑动"]) {
  const result = await workbook.inspect({
    kind: "match",
    searchTerm: term,
    options: { useRegex: false, maxResults: 100 },
    maxChars: 20000,
    summary: `${term} catalog matches`,
  });
  console.log(JSON.stringify({ term, ndjson: result.ndjson }));
}
