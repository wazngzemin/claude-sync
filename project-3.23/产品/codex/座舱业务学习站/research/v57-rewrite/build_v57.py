"""Mechanical v57 assembly. No narrative edits, no browser, no overwrite."""
from pathlib import Path
from markdown_it import MarkdownIt
import re, json, hashlib, xml.etree.ElementTree as ET

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
BASE = ROOT / 'HTML/01-进行中/豆包汽车-业务学习站-v56.html'
OUT = ROOT / 'HTML/01-进行中/豆包汽车-业务学习站-v57.html'
FIGURES = HERE.parent / 'v56-figures'
assert not OUT.exists(), 'Never overwrite an existing HTML version'
sha = lambda data: hashlib.sha256(data).hexdigest()
inputs = {f'rw-{letter}.md': (HERE / f'rw-{letter}.md').read_bytes() for letter in 'ABCDE'}
removed = []

def clean_comment(match):
    if re.fullmatch(r'<!--\s*figure:[\w-]+\s*-->', match[0]):
        return match[0]
    removed.append(match[0])
    return ''

full = '\n\n'.join(re.sub(r'<!--[\s\S]*?-->', clean_comment, value.decode()).strip('\n') for value in inputs.values()) + '\n'
(HERE / 'full.md').write_text(full)
assert full.count('**') == 266
strong_source, count = re.subn(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', full, flags=re.S)
assert count == 133 and '**' not in strong_source
md = MarkdownIt('commonmark', {'html': True, 'typographer': False, 'breaks': False}).enable('table')
reference = md.render(strong_source)
tokens = md.parse(strong_source)
headings = []
for i, token in enumerate(tokens):
    if token.type == 'heading_open':
        assert token.tag in ('h2', 'h3')
        text = tokens[i + 1].content
        ident = f'v57-heading-{len(headings) + 1:02d}'
        token.attrSet('id', ident)
        token.attrSet('data-section-title', text)
        headings.append({'id': ident, 'level': int(token.tag[1]), 'title': text})
assert sum(h['level'] == 2 for h in headings) == 17
assert sum(h['level'] == 3 for h in headings) == 68
rendered = md.renderer.render(tokens, md.options, {})
rendered = rendered.replace('<table>', '<div class="voice-table-scroll" tabindex="0"><table>').replace('</table>', '</table></div>')
annex = next(h for h in headings if h['title'] == '附二　历史版本与关键数字')
annex_open = re.search(r'<h2\b[^>]*id="' + annex['id'] + r'"[^>]*>.*?</h2>', rendered)[0]
rendered = rendered.replace(annex_open, '<!--original-v55--><details class="voice-original v55-archive" id="v57-history"><summary>' + annex_open + '</summary>', 1) + '</details>'
base_bytes = BASE.read_bytes()
base = base_bytes.decode()
data_match = re.search(r'const DATA=(.*?);\s*</script>', base, re.S)
data = json.loads(data_match[1])
page = next(p for p in data['pages'] if p['id'] == 'V')
figure_keys = re.findall(r'<!--\s*figure:([\w-]+)\s*-->', full)
assert len(figure_keys) == len(set(figure_keys)) == 22
titles, subtitles, figure_hashes = {}, {}, {}
for key in figure_keys:
    if key.startswith(('v34-', 'v45-')):
        assert key in data['diagrams']
        titles[key] = page['v55']['figureTitles'][key]
        if key in page['v55'].get('figureSubtitles', {}):
            subtitles[key] = page['v55']['figureSubtitles'][key]
    else:
        assert key.startswith(('v56-', 'v57-'))
        svg_path = FIGURES / (key + '.svg')
        raw = svg_path.read_text()
        ET.fromstring(raw)
        metadata = json.loads(svg_path.with_suffix('.json').read_text())
        data['diagrams'][key] = raw
        titles[key], subtitles[key] = metadata['title'], metadata['subtitle']
        figure_hashes[svg_path.name] = sha(svg_path.read_bytes())
page['v55'] = {'html': rendered, 'headings': headings, 'figureTitles': titles, 'figureSubtitles': subtitles}

def replace_script(match):
    attrs, body = match[1], match[2]
    if 'id="learning-doc-data"' in attrs:
        body = json.dumps({'revision': 'v57', 'pages': {}}, ensure_ascii=False)
    elif re.match(r'\s*const DATA\s*=', body):
        body = '\nconst DATA=' + json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/') + ';\n'
    elif 'function renderModule' in body:
        assert body.count("revision: 'v56'") == 1
        body = body.replace("revision: 'v56'", "revision: 'v57'").replace('我的修订-v56.html', '我的修订-v57.html')
    return '<script' + attrs + '>' + body + '</script>'

output = re.sub(r'<script([^>]*)>([\s\S]*?)</script>', replace_script, base)
assert output.count('<title>豆包汽车业务学习站 v56</title>') == 1
output = output.replace('<title>豆包汽车业务学习站 v56</title>', '<title>豆包汽车业务学习站 v57</title>')
with OUT.open('x') as f:
    f.write(output)
manifest = {'base': str(BASE), 'output': str(OUT), 'source': str(HERE / 'full.md'), 'baselineSha256': sha(base_bytes), 'sourceSha256': sha(full.encode()), 'inputsSha256': {name: sha(value) for name, value in inputs.items()}, 'svgSha256': figure_hashes, 'removedComments': removed, 'headings': headings, 'figureKeys': figure_keys, 'expectedStrongCount': count, 'browserStarted': False}
(HERE / 'build-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
(HERE / 'reference-render.json').write_text(json.dumps({'html': reference}, ensure_ascii=False, indent=2) + '\n')
assert BASE.read_bytes() == base_bytes
assert all((HERE / name).read_bytes() == value for name, value in inputs.items())
print(json.dumps({'output': str(OUT), 'h2': 17, 'h3': 68, 'strong': count, 'figures': len(figure_keys), 'originalGraph': 1}, ensure_ascii=False))
