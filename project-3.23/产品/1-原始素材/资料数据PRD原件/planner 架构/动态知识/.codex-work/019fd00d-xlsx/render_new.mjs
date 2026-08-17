import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const input = await FileBlob.load("/Users/bytedance/Downloads/动态知识.xlsx");
const workbook = await SpreadsheetFile.importXlsx(input);
const preview = await workbook.render({
  sheetName: "Sheet1",
  range: "A1:I13",
  scale: 1,
  format: "png",
});
await fs.writeFile(new URL("dynamic-new.png", import.meta.url), new Uint8Array(await preview.arrayBuffer()));
