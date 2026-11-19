"""Mechanical R replacement. Preserve all source prose; never overwrite HTML."""
from pathlib import Path
from markdown_it import MarkdownIt
import re, json, hashlib, xml.etree.ElementTree as ET

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
BASE = ROOT / 'HTML/01-进行中/豆包汽车-业务学习站-v60.html'
OUT = ROOT / 'HTML/01-进行中/豆包汽车-业务学习站-v61.html'
assert not OUT.exists(), 'Never overwrite an existing HTML version'
sha = lambda value: hashlib.sha256(value).hexdigest()
base_bytes = BASE.read_bytes()
base = base_bytes.decode()
data = json.loads(re.search(r'const DATA=(.*?);\s*</script>', base, re.S)[1])
old_data = json.loads(json.dumps(data))
page = next(p for p in data['pages'] if p['id'] == 'R')
old_r = json.loads(json.dumps(page))
inputs = {f'part-{i}.md': (HERE / f'part-{i}.md').read_bytes() for i in range(1, 5)}
removed = []

def clean_comment(match):
    if re.fullmatch(r'<!--\s*figure:[\w-]+\s*-->', match[0]):
        return match[0]
    removed.append(match[0])
    return ''

full = '\n\n'.join(re.sub(r'<!--[\s\S]*?-->', clean_comment, value.decode()).strip('\n') for value in inputs.values()) + '\n'
(HERE / 'full.md').write_text(full)
strong_source, strong_count = re.subn(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', full, flags=re.S)
assert '**' not in strong_source
md = MarkdownIt('commonmark', {'html': True, 'typographer': False, 'breaks': False}).enable('table')
reference = md.render(strong_source)
tokens = md.parse(strong_source)
headings, paragraphs = [], {'v58-example': 0, 'v58-case': 0}
for i, token in enumerate(tokens):
    if token.type == 'heading_open':
        assert token.tag in ('h2', 'h3')
        text = tokens[i + 1].content
        ident = f'r61-heading-{len(headings) + 1:02d}'
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
annex_heading = re.search(r'<h2\b[^>]*id="' + annex['id'] + r'"[^>]*>.*?</h2>', rendered)[0]
assert rendered.count('<details>') == rendered.count('</details>') == 1
# Reuse the source's existing fold. Keep its summary words and all prose.
opening = annex_heading + '\n<details>\n<summary>'
assert opening in rendered
had_original = '<!--original-->' in json.dumps(old_r.get('v34', {}))
rendered = rendered.replace(opening, ('<!--original-v55-->' if had_original else '') + '<details class="voice-original v55-archive" id="r61-history"><summary>' + annex_heading + '\n', 1)
rendered = rendered.replace('</details>', '', 1).rstrip('\n') + '\n</details>\n'

figure_keys = re.findall(r'<!--\s*figure:([\w-]+)\s*-->', full)
titles, subtitles = {}, {}
original_titles = dict(re.findall(r'<!--fig:([\w-]+)\|([^>]*?)-->', json.dumps(old_r['v34'], ensure_ascii=False)))
changes = json.loads((HERE / 'original-figure-changes-v61.json').read_text())
for key in dict.fromkeys(figure_keys):
    if key.startswith('r2-'):
        source = HERE / 'figures' / (key + '.svg')
        meta = json.loads(source.with_suffix('.json').read_text())
        titles[key], subtitles[key] = meta['title'], meta['subtitle']
    else:
        source = HERE / 'original-figures-v61' / (key + '.svg')
        titles[key] = original_titles[key]
    raw = source.read_text()
    ET.fromstring(raw)
    data['diagrams'][key] = raw
page['v55'] = {'html': rendered, 'headings': headings, 'figureTitles': titles, 'figureSubtitles': subtitles}
# Retire only old R prose and presentation data; preserve its identity and sources.
page.pop('v34', None)
page['sections'] = []
page['teaching'] = {'intro': [], 'lessons': [], 'closing': []}
for field in ['flows', 'cases', 'terms', 'questions', 'metrics', 'roadmap', 'related', 'referenceTables', 'mainline', 'concepts']:
    if field in page:
        page[field] = []
page['legacyChapterTargets'] = {}

def replace_once(body, before, after):
    assert body.count(before) == 1, before
    return body.replace(before, after, 1)

def replace_script(match):
    attrs, body = match[1], match[2]
    if 'id="learning-doc-data"' in attrs:
        body = json.dumps({'revision': 'v61', 'pages': {}}, ensure_ascii=False)
    elif re.match(r'\s*const DATA\s*=', body):
        body = '\nconst DATA=' + json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/') + ';\n'
    elif 'function renderModule' in body:
        start = body.index(' function renderVoiceV55(')
        end = body.index(' function revealSection(', start)
        section = body[start:end]
        section = section.replace("pageId:'V'", 'pageId:page.id').replace("key:'base-V'", "key:'base-'+page.id").replace("title:'V 章原始完整节点图'", "title:page.id+' 章原始完整节点图'").replace("routeHref('module','V','section',h.id)", "routeHref('module',page.id,'section',h.id)")
        body = body[:start] + section + body[end:]
        body = replace_once(body, "if(id==='V' && page.v55){", 'if(page.v55){')
        body = replace_once(body, "currentRoute.name==='module'&&currentRoute.parts[0]==='V'&&pageOf('V').v55", "currentRoute.name==='module'&&pageOf(currentRoute.parts[0])?.v55")
        body = replace_once(body, "revision: 'v59'", "revision: 'v61'")
        body = replace_once(body, '我的修订-v59.html', '我的修订-v61.html')
    return '<script' + attrs + '>' + body + '</script>'

output = re.sub(r'<script([^>]*)>([\s\S]*?)</script>', replace_script, base)
output = replace_once(output, '<title>豆包汽车业务学习站 v59</title>', '<title>豆包汽车业务学习站 v61</title>')
# Wide tables and diagrams scroll inside their V-style frames, never the viewport.
mobile_style = '<style id="v61-mobile-containment">@media(max-width:760px){html,body{max-width:100%;overflow-x:clip}}</style>\n'
output = output.replace('</head>', mobile_style + '</head>', 1)
assert all(p == next(q for q in data['pages'] if q['id'] == p['id']) for p in old_data['pages'] if p['id'] != 'R')
assert all(value == data[key] for key, value in old_data.items() if key not in ['pages', 'diagrams'])
with OUT.open('x') as f:
    f.write(output)
manifest = {'base': str(BASE), 'output': str(OUT), 'source': str(HERE / 'full.md'), 'baselineSha256': sha(base_bytes), 'sourceSha256': sha(full.encode()), 'inputsSha256': {name: sha(value) for name, value in inputs.items()}, 'removedComments': removed, 'headings': headings, 'figureKeys': figure_keys, 'uniqueFigureKeys': list(dict.fromkeys(figure_keys)), 'svgSha256': {key: sha(data['diagrams'][key].encode()) for key in set(figure_keys)}, 'expectedStrongCount': strong_count, 'paragraphs': paragraphs, 'originalGraph': had_original, 'browserStarted': False}
(HERE / 'build-manifest-v61.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
(HERE / 'reference-render-v61.json').write_text(json.dumps({'html': reference}, ensure_ascii=False, indent=2) + '\n')
assert BASE.read_bytes() == base_bytes
assert all((HERE / name).read_bytes() == value for name, value in inputs.items())
print(json.dumps({'output': str(OUT), 'h2': sum(h['level'] == 2 for h in headings), 'h3': sum(h['level'] == 3 for h in headings), 'figurePlacements': len(figure_keys), 'uniqueFigures': len(set(figure_keys)), **paragraphs}, ensure_ascii=False))
