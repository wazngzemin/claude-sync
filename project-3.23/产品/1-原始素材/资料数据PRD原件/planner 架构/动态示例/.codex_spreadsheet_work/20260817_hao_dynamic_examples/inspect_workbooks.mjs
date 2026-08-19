import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const files = process.argv.slice(2);

for (const file of files) {
  const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(file));
  const sheets = await workbook.inspect({
    kind: "sheet",
    include: "id,name",
    maxChars: 4000,
  });
  console.log(JSON.stringify({ file, sheets: sheets.ndjson }));

  for (const term of ["遮阳帘", "胎压", "冷", "热", "PQCP-32735", "PQCP-33098"]) {
    const matches = await workbook.inspect({
      kind: "match",
      searchTerm: term,
      options: { useRegex: false, maxResults: 40 },
      maxChars: 8000,
      summary: `${term} matches`,
    });
    if (matches.ndjson && !matches.ndjson.includes('"count":0')) {
      console.log(JSON.stringify({ file, term, matches: matches.ndjson }));
    }
  }
}
