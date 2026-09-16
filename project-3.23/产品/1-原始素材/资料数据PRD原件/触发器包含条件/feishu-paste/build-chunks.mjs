// 把云端 PRD 底稿切成可粘贴到飞书的小块，输出 HTML + 清单
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.argv[2] || '..');
const SRC = path.join(ROOT, 'PRD-系统预设任务-云端章节飞书重写稿-v01.md');
const OUT = path.join(ROOT, 'feishu-paste', 'out');
const MAX = Number(process.argv[3] || 2600);

fs.mkdirSync(OUT, { recursive: true });
const md = fs.readFileSync(SRC, 'utf8').split(/\r?\n/);

// 取要写入飞书的章节：5.2 / 5.3 / 5.4 与 7.1~7.11
function sliceByHeading(startPat, endPat) {
  const s = md.findIndex((l) => startPat.test(l));
  let e = md.length;
  if (endPat) {
    for (let i = s + 1; i < md.length; i++) if (endPat.test(md[i])) { e = i; break; }
  }
  return s < 0 ? [] : md.slice(s, e);
}

const classification = sliceByHeading(/^### 5\.2 /, /^### 5\.3 /);
const solution = sliceByHeading(/^### 7\.1 /, /^## 8\. /);

const lines = [
  '## 5.2 云端任务先分两类，再分别选择交互与执行方式',
  ...classification.slice(1),
  '',
  ...solution
];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function inline(s) {
  let t = esc(s);
  t = t.replace(/`([^`]+)`/g, '<code>$1</code>');
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return t;
}

function mdToHtml(block) {
  const out = [];
  let i = 0;
  const isTableSep = (l) => /^\|?[\s:|-]+\|[\s:|-]*$/.test(l.trim()) && l.includes('-');
  while (i < block.length) {
    const raw = block[i];
    const line = raw.trim();
    if (!line) { i++; continue; }
    if (/^```/.test(line)) {
      const buf = []; i++;
      while (i < block.length && !/^```/.test(block[i].trim())) { buf.push(block[i]); i++; }
      i++;
      out.push('<pre>' + esc(buf.join('\n')) + '</pre>');
      continue;
    }
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) { out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`); i++; continue; }
    if (/^---+$/.test(line)) { out.push('<hr>'); i++; continue; }
    if (/^\|/.test(line) && i + 1 < block.length && isTableSep(block[i + 1])) {
      const cells = (l) => l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
      const head = cells(line); i += 2;
      const rows = [];
      while (i < block.length && /^\|/.test(block[i].trim())) { rows.push(cells(block[i].trim())); i++; }
      let t = '<table><thead><tr>' + head.map((c) => '<th>' + inline(c) + '</th>').join('') + '</tr></thead><tbody>';
      for (const r of rows) t += '<tr>' + r.map((c) => '<td>' + inline(c) + '</td>').join('') + '</tr>';
      t += '</tbody></table>';
      out.push(t);
      continue;
    }
    if (/^[*-]\s+/.test(line) || /^\d+\.\s+/.test(line)) {
      const ordered = /^\d+\.\s+/.test(line);
      const items = [];
      while (i < block.length && (/^[*-]\s+/.test(block[i].trim()) || /^\d+\.\s+/.test(block[i].trim()))) {
        items.push(block[i].trim().replace(/^([*-]|\d+\.)\s+/, '')); i++;
      }
      const tag = ordered ? 'ol' : 'ul';
      out.push(`<${tag}>` + items.map((t) => '<li>' + inline(t) + '</li>').join('') + `</${tag}>`);
      continue;
    }
    if (/^>\s?/.test(line)) {
      const buf = [];
      while (i < block.length && /^>\s?/.test(block[i].trim())) { buf.push(block[i].trim().replace(/^>\s?/, '')); i++; }
      out.push('<blockquote>' + buf.map((t) => '<p>' + inline(t) + '</p>').join('') + '</blockquote>');
      continue;
    }
    const buf = [raw]; i++;
    while (i < block.length) {
      const n = block[i].trim();
      if (!n || /^[#>|`]/.test(n) || /^[*-]\s+/.test(n) || /^\d+\.\s+/.test(n) || /^---+$/.test(n)) break;
      buf.push(block[i]); i++;
    }
    out.push('<p>' + inline(buf.join(' ')) + '</p>');
  }
  return out.join('\n');
}

// 按空行切块，超长时按空行二次分块
function chunkLines(src, max) {
  const chunks = [];
  let cur = [];
  const size = (a) => a.reduce((n, l) => n + l.length + 1, 0);
  for (let i = 0; i < src.length; i++) {
    const l = src[i];
    if (/^#{2,3}\s/.test(l) && cur.length && size(cur) > max * 0.5) { chunks.push(cur); cur = []; }
    cur.push(l);
    if (size(cur) > max) {
      let cut = -1;
      for (let j = cur.length - 1; j > 0; j--) if (!cur[j].trim()) { cut = j; break; }
      if (cut > 0) { chunks.push(cur.slice(0, cut)); cur = cur.slice(cut); }
    }
  }
  if (cur.length) chunks.push(cur);
  return chunks;
}

const chunks = chunkLines(lines, MAX).filter((c) => c.join('').trim());
const manifest = [];
chunks.forEach((c, i) => {
  const name = 'chunk-' + String(i).padStart(3, '0');
  const html = '<div>' + mdToHtml(c) + '</div>';
  fs.writeFileSync(path.join(OUT, name + '.html'), html, 'utf8');
  const title = (c.find((l) => /^#{2,4}\s/.test(l)) || c.find((l) => l.trim()) || '').slice(0, 60);
  manifest.push({ i, name, bytes: html.length, md: c.join('').length, title });
});
fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 1), 'utf8');

console.log('chunks=' + chunks.length + ' max=' + MAX);
for (const m of manifest) console.log(String(m.i).padStart(3, '0'), String(m.bytes).padStart(6), m.title);
