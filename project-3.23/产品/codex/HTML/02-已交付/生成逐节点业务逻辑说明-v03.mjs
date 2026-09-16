import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { marked } = require('/Users/bytedance/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/marked');
const base = '/Users/bytedance/Desktop/3.23/产品/codex/HTML/02-已交付';
const mdPath = `${base}/云端系统预设任务-逐节点业务逻辑说明-v03.md`;
const htmlPath = `${base}/云端系统预设任务-逐节点业务逻辑说明-v03.html`;
const body = marked.parse(fs.readFileSync(mdPath, 'utf8'));
const html = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>云端系统预设任务｜逐节点业务逻辑说明 V03</title><style>
body{margin:0;background:#f5f7fb;color:#172033;font:15px/1.75 -apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif}main{max-width:1120px;margin:auto;padding:48px 56px 100px;background:white;box-shadow:0 0 32px #dfe5ef}h1{font-size:34px}h2{margin-top:54px;padding:16px 20px;background:#edf4ff;border-left:5px solid #3370ff}h3{margin-top:34px;padding-bottom:9px;border-bottom:1px solid #dfe5ef;color:#173b75}blockquote{margin:18px 0;padding:14px 18px;background:#fff7e6;border-left:4px solid #f5a623}li{margin:7px 0}strong{color:#0b3470}code{background:#eef2f8;padding:2px 5px;border-radius:4px}pre{padding:18px;overflow:auto;background:#111827;color:#e5e7eb;border-radius:8px}@media(max-width:760px){main{padding:24px 18px}h1{font-size:27px}}
</style></head><body><main>${body}</main></body></html>`;
fs.writeFileSync(htmlPath, html);
console.log(htmlPath);
