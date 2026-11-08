import { loadEnvFile } from 'node:process';
import { readFileSync, writeFileSync } from 'node:fs';
import { createService } from '/Users/bytedance/Documents/Codex/2026-08-04/w/feishu-knowledge-assistant/src/server.ts';
loadEnvFile('.env');
const s = createService();
const userId = 'ou_d35304ddd7e37a06ebac58f7f60b6522';
const [path, method, input, output] = process.argv.slice(2);
void (async () => { try {
  const r = await s.api.requestJson(path, {token:'user',userId,method:method as any,...(input !== '-' ? {body:JSON.parse(readFileSync(input,'utf8'))}:{})});
  writeFileSync(output, JSON.stringify(r,null,2));
  console.log(JSON.stringify({ok:true, output, keys:Object.keys(r as any)}));
  process.exit(0);
} catch(e) {
  console.error(String(e));
  process.exit(1);
} })();
