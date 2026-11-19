"""Render the approved full.md using v66's renderer; preserve all v67 figures."""
from pathlib import Path
from markdown_it import MarkdownIt
import re, json, hashlib

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
BASE = ROOT / 'HTML/01-进行中/豆包汽车-业务学习站-v67.html'
OUT = ROOT / 'HTML/01-进行中/豆包汽车-业务学习站-v68.html'
assert not OUT.exists(), 'Never overwrite an existing HTML version'
sha = lambda b: hashlib.sha256(b).hexdigest()
baseline = BASE.read_bytes()
base = baseline.decode()
source = (HERE / 'full.md').read_bytes()
full = source.decode()
part6 = (HERE / 'part-6.md').read_bytes()
assert part6.decode().strip() in full
data = json.loads(re.search(r'const DATA=(.*?);\s*</script>', base, re.S)[1])
old = json.loads(json.dumps(data))
page = next(p for p in data['pages'] if p['id'] == 'D')
old_page = next(p for p in old['pages'] if p['id'] == 'D')
old_headings = {h['title']: h['id'] for h in old_page['v55']['headings']}
old_headings['十二、怎么排查'] = old_headings['十一、怎么排查']
md = MarkdownIt('commonmark', {'html': True, 'typographer': False, 'breaks': False}).enable('table')
strong, strong_count = re.subn(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', full, flags=re.S)
assert '**' not in strong
tokens = md.parse(strong)
headings, counts = [], {'examples': 0, 'cases': 0}
for n, t in enumerate(tokens):
    if t.type == 'heading_open':
        assert t.tag in ('h2', 'h3')
        title = tokens[n + 1].content
        key = old_headings.get(title, f'd68-heading-{len(headings) + 1:02d}')
        t.attrSet('id', key)
        t.attrSet('data-section-title', title)
        headings.append({'id': key, 'level': int(t.tag[1]), 'title': title})
    if t.type == 'paragraph_open':
        for prefix, cls, count in [('<strong>例子：', 'v58-example', 'examples'), ('<strong>案例：', 'v58-case', 'cases')]:
            if tokens[n + 1].content.startswith(prefix):
                t.attrSet('class', cls)
                counts[count] += 1
assert len({h['id'] for h in headings}) == len(headings)
rendered = md.renderer.render(tokens, md.options, {})
rendered = rendered.replace('<table>', '<div class="voice-table-scroll" tabindex="0"><table>').replace('</table>', '</table></div>')
annex = next(h for h in headings if h['title'] == '附二　历史版本与关键数字')
heading = re.search(r'<h2\b[^>]*id="' + annex['id'] + r'"[^>]*>.*?</h2>', rendered)[0]
assert rendered.count('<details>') == rendered.count('</details>') == 1
overview = '<details class="voice-original" id="detailed-flow"><summary>对照：Planner 全图</summary>\n<!-- figure:d-overview -->\n</details>\n'
rendered = rendered.replace(heading + '\n<details>\n<summary>', overview + '<details class="voice-original v55-archive" id="d66-history"><summary>' + heading + '\n', 1)
rendered = ''.join(rendered.rsplit('</details>', 1)).rstrip('\n') + '\n</details>\n'
assert rendered.count('<details ') == rendered.count('</details>') == 2
keys = re.findall(r'<!--\s*figure:([\w-]+)\s*-->', full)
assert keys == re.findall(r'<!--\s*figure:([\w-]+)\s*-->', old_page['v55']['html'])[:-1]
# The extra overview fold is the final figure comment; all figure bytes and metadata stay untouched.
page['v55'] = {**old_page['v55'], 'html': rendered, 'headings': headings}
assert all(v in {h['id'] for h in headings} | {'detailed-flow'} for v in page['legacyChapterTargets'].values())
assert all(p == next(q for q in data['pages'] if q['id'] == p['id']) for p in old['pages'] if p['id'] != 'D')
assert data['diagrams'] == old['diagrams']
assert all(v == data[k] for k, v in old.items() if k != 'pages')

def script(m):
    attrs, body = m[1], m[2]
    if 'id="learning-doc-data"' in attrs:
        body = json.dumps({'revision': 'v68', 'pages': {}}, ensure_ascii=False)
    elif re.match(r'\s*const DATA\s*=', body):
        body = '\nconst DATA=' + json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/') + ';\n'
    elif 'function renderModule' in body:
        assert body.count("revision: 'v67'") == body.count('我的修订-v67.html') == 1
        body = body.replace("revision: 'v67'", "revision: 'v68'").replace('我的修订-v67.html', '我的修订-v68.html')
    return '<script' + attrs + '>' + body + '</script>'

output = re.sub(r'<script([^>]*)>([\s\S]*?)</script>', script, base)
assert output.count('<title>豆包汽车业务学习站 v67</title>') == 1
output = output.replace('<title>豆包汽车业务学习站 v67</title>', '<title>豆包汽车业务学习站 v68</title>', 1)
assert BASE.read_bytes() == baseline
assert (HERE / 'full.md').read_bytes() == source
assert (HERE / 'part-6.md').read_bytes() == part6
with OUT.open('x') as f:
    f.write(output)
manifest = {
    'base': str(BASE), 'output': str(OUT), 'baselineSha256': sha(baseline), 'outputSha256': sha(output.encode()),
    'sourceSha256': sha(source), 'part6Sha256': sha(part6), 'sourceMode': 'full.md directly; no part merge',
    'browserStarted': False, 'h2': sum(h['level'] == 2 for h in headings), 'h3': sum(h['level'] == 3 for h in headings),
    'headings': headings, 'figureKeys': keys, 'uniqueFigureKeys': list(dict.fromkeys(keys)),
    'figuresUnchanged': data['diagrams'] == old['diagrams'], 'figureMetadataUnchanged': all(page['v55'][k] == old_page['v55'][k] for k in ['figureTitles', 'figureSubtitles']),
    'strongCount': strong_count, **counts,
}
(HERE / 'build-manifest-v68.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({k: manifest[k] for k in ['output', 'h2', 'h3', 'examples', 'cases', 'figuresUnchanged']}, ensure_ascii=False))
