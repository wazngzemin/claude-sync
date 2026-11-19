"""Mechanical v58 assembly using the v57 pipeline and embedded v57 figures."""
from pathlib import Path
from markdown_it import MarkdownIt
import re, json, hashlib

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
BASE = ROOT / 'HTML/01-进行中/豆包汽车-业务学习站-v57.html'
OUT = ROOT / 'HTML/01-进行中/豆包汽车-业务学习站-v58.html'
assert not OUT.exists(), 'Never overwrite an existing HTML version'
sha = lambda data: hashlib.sha256(data).hexdigest()
names = ['ex-A.md', 'ex-B.md', 'ex-C.md', 'ex-D.md', 'rw-E.md']
inputs = {name: (HERE / name).read_bytes() for name in names}
removed = []

def clean_comment(match):
    if re.fullmatch(r'<!--\s*figure:[\w-]+\s*-->', match[0]):
        return match[0]
    removed.append(match[0])
    return ''

full = '\n\n'.join(re.sub(r'<!--[\s\S]*?-->', clean_comment, value.decode()).strip('\n') for value in inputs.values()) + '\n'
with (HERE / 'full-v58.md').open('x') as f:
    f.write(full)
strong_source, count = re.subn(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', full, flags=re.S)
assert '**' not in strong_source
md = MarkdownIt('commonmark', {'html': True, 'typographer': False, 'breaks': False}).enable('table')
reference = md.render(strong_source)
tokens = md.parse(strong_source)
headings = []
paragraphs = {'v58-example': 0, 'v58-case': 0}
for i, token in enumerate(tokens):
    if token.type == 'heading_open':
        assert token.tag in ('h2', 'h3')
        text = tokens[i + 1].content
        ident = f'v58-heading-{len(headings) + 1:02d}'
        token.attrSet('id', ident)
        token.attrSet('data-section-title', text)
        headings.append({'id': ident, 'level': int(token.tag[1]), 'title': text})
    if token.type == 'paragraph_open':
        text = tokens[i + 1].content
        for prefix, cls in [('<strong>例子：', 'v58-example'), ('<strong>案例：', 'v58-case')]:
            if text.startswith(prefix):
                token.attrSet('class', cls)
                paragraphs[cls] += 1
rendered = md.renderer.render(tokens, md.options, {})
rendered = rendered.replace('<table>', '<div class="voice-table-scroll" tabindex="0"><table>').replace('</table>', '</table></div>')
annex = next(h for h in headings if h['title'] == '附二　历史版本与关键数字')
annex_open = re.search(r'<h2\b[^>]*id="' + annex['id'] + r'"[^>]*>.*?</h2>', rendered)[0]
rendered = rendered.replace(annex_open, '<!--original-v55--><details class="voice-original v55-archive" id="v58-history"><summary>' + annex_open + '</summary>', 1) + '</details>'
base_bytes = BASE.read_bytes()
base = base_bytes.decode()
data = json.loads(re.search(r'const DATA=(.*?);\s*</script>', base, re.S)[1])
page = next(p for p in data['pages'] if p['id'] == 'V')
old_lesson = page['v55']
figure_keys = re.findall(r'<!--\s*figure:([\w-]+)\s*-->', full)
assert len(figure_keys) == len(set(figure_keys)) == 22
assert figure_keys == re.findall(r'<!--\s*figure:([\w-]+)\s*-->', old_lesson['html'])
assert all(key in data['diagrams'] and key in old_lesson['figureTitles'] for key in figure_keys)
page['v55'] = {'html': rendered, 'headings': headings, 'figureTitles': old_lesson['figureTitles'], 'figureSubtitles': old_lesson['figureSubtitles']}

def replace_script(match):
    attrs, body = match[1], match[2]
    if 'id="learning-doc-data"' in attrs:
        body = json.dumps({'revision': 'v58', 'pages': {}}, ensure_ascii=False)
    elif re.match(r'\s*const DATA\s*=', body):
        body = '\nconst DATA=' + json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/') + ';\n'
    elif 'function renderModule' in body:
        assert body.count("revision: 'v57'") == 1
        body = body.replace("revision: 'v57'", "revision: 'v58'").replace('我的修订-v57.html', '我的修订-v58.html')
    return '<script' + attrs + '>' + body + '</script>'

output = re.sub(r'<script([^>]*)>([\s\S]*?)</script>', replace_script, base)
assert output.count('<title>豆包汽车业务学习站 v57</title>') == 1
output = output.replace('<title>豆包汽车业务学习站 v57</title>', '<title>豆包汽车业务学习站 v58</title>')
style = '''
/* v58: scan markers inherit readable text color in both themes. */
.voice-v55 p.v58-example,.voice-v55 p.v58-case{border-inline-start:2px solid currentColor;padding-inline-start:12px;margin-block:1em;min-width:0;max-width:100%;box-sizing:border-box;overflow-wrap:anywhere}
'''
output = output.replace('</head>', '<style id="v58-paragraph-markers">' + style + '</style>\n</head>', 1)
with OUT.open('x') as f:
    f.write(output)
manifest = {'base': str(BASE), 'output': str(OUT), 'source': str(HERE / 'full-v58.md'), 'baselineSha256': sha(base_bytes), 'sourceSha256': sha(full.encode()), 'inputsSha256': {name: sha(value) for name, value in inputs.items()}, 'svgSha256': {key: sha(data['diagrams'][key].encode()) for key in figure_keys}, 'removedComments': removed, 'headings': headings, 'figureKeys': figure_keys, 'expectedStrongCount': count, 'paragraphs': paragraphs, 'browserStarted': False}
(HERE / 'build-manifest-v58.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
(HERE / 'reference-render-v58.json').write_text(json.dumps({'html': reference}, ensure_ascii=False, indent=2) + '\n')
assert BASE.read_bytes() == base_bytes
assert all((HERE / name).read_bytes() == value for name, value in inputs.items())
print(json.dumps({'output': str(OUT), 'headings': len(headings), 'strong': count, 'figures': len(figure_keys), **paragraphs}, ensure_ascii=False))
