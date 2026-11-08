"""Format reviewed Markdown for Feishu rich paste; visuals become insertion anchors."""
from pathlib import Path
import html
import re
import json

root = Path(__file__).resolve().parent.parent
source = root / 'PRD-触发器后台优化-完整图文评审版-v05.md'
text = source.read_text()
visuals = []

def inline(s):
    s = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', s)
    s = html.escape(s)
    s = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', s)
    s = re.sub(r'`([^`]+)`', r'<code>\1</code>', s)
    return s

parts = []
lines = text.splitlines()
i = 0
while i < len(lines):
    line = lines[i].strip()
    if not line:
        i += 1
        continue
    m = re.match(r'!\[([^\]]+)\]\(([^)]+)\)', line)
    if m:
        title, path = m.groups()
        key = Path(path).name.split('-')[0]
        marker = '【插图位置：' + key + '】'
        parts.append('<p>' + marker + '</p>')
        visuals.append({'key': key, 'title': title, 'marker': marker, 'path': str(root / path)})
        i += 1
        continue
    m = re.match(r'(#{1,6})\s+(.*)', line)
    if m:
        level = len(m[1])
        if level != 1:
            parts.append(f'<h{level}>' + inline(m[2]) + f'</h{level}>')
        i += 1
        continue
    if line.startswith('|'):
        rows = []
        while i < len(lines) and lines[i].strip().startswith('|'):
            cells = [c.strip() for c in lines[i].strip().strip('|').split('|')]
            if not all(re.fullmatch(r':?-{3,}:?', c) for c in cells):
                rows.append(cells)
            i += 1
        table = '<table><tbody>'
        for n, cells in enumerate(rows):
            tag = 'th' if n == 0 else 'td'
            table += '<tr>' + ''.join(f'<{tag}>' + inline(c) + f'</{tag}>' for c in cells) + '</tr>'
        parts.append(table + '</tbody></table>')
        continue
    if line.startswith('- '):
        items = []
        while i < len(lines) and lines[i].strip().startswith('- '):
            items.append('<li>' + inline(lines[i].strip()[2:]) + '</li>')
            i += 1
        parts.append('<ul>' + ''.join(items) + '</ul>')
        continue
    parts.append('<p>' + inline(line) + '</p>')
    i += 1

result = '<html><body>' + ''.join(parts) + '</body></html>'
assert '<a ' not in result and 'https://' not in result
Path('/tmp/trigger-prd-v05-feishu.html').write_text(result)
Path('/tmp/trigger-prd-v05-visuals.json').write_text(json.dumps(visuals, ensure_ascii=False))
backup = Path('/tmp/trigger-prd-live-before-v05.txt')
if backup.exists():
    (root / '触发器后台优化点-图文改版前正文备份-2026-10-08.md').write_text(backup.read_text())
print(json.dumps({'html_chars': len(result), 'visuals': len(visuals), 'tables': result.count('<table>')}, ensure_ascii=False))
