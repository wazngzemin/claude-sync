"""Build K from explicit source figure slots, retaining the selected base shell."""
from pathlib import Path
from markdown_it import MarkdownIt
import argparse, re, json, hashlib, xml.etree.ElementTree as ET

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
args = argparse.ArgumentParser()
args.add_argument('--base-version', type=int, default=69)
args.add_argument('--output-version', type=int, default=70)
versions = args.parse_args()
base_revision = f'v{versions.base_version}'
revision = f'v{versions.output_version}'
assert versions.output_version > versions.base_version
BASE = ROOT / f'HTML/01-进行中/豆包汽车-业务学习站-{base_revision}.html'
OUT = ROOT / f'HTML/01-进行中/豆包汽车-业务学习站-{revision}.html'
assert not OUT.exists(), 'Never overwrite an existing HTML version'
sha = lambda b: hashlib.sha256(b).hexdigest()
baseline = BASE.read_bytes()
base = baseline.decode()
data = json.loads(re.search(r'const DATA=(.*?);\s*</script>', base, re.S)[1])
old = json.loads(json.dumps(data))
page = next(p for p in data['pages'] if p['id'] == 'K')
old_page = json.loads(json.dumps(page))
inputs = {f'part-{n}.md': (HERE / f'part-{n}.md').read_bytes() for n in range(1, 5)}
removed = []
def comment(m):
    if re.fullmatch(r'<!--\s*figure:[\w-]+\s*-->', m[0]): return m[0]
    removed.append(m[0])
    return ''
merged = '\n\n'.join(re.sub(r'<!--[\s\S]*?-->', comment, b.decode()).strip('\n') for b in inputs.values()) + '\n'
# The requested real-name ban takes precedence over copying these example names.
name_map = {'陈奕迅': '歌手乙', '周杰伦': '歌手甲', '诸葛亮': '测试乘客甲'}
name_edits = {name: merged.count(name) for name in name_map}
full = merged
for name, replacement in name_map.items(): full = full.replace(name, replacement)
assert (HERE / 'full.md').read_text() == full, 'Approved full.md must remain unchanged'
banned = re.compile(r'资料|PRD|清单|待确认|口径|没有展开|未展开|技术方案|宣讲|周报|逐字稿|(?<![A-Za-z])DT(?![A-Za-z])|小模型|OnePage|书名号|《|》|' + '|'.join(name_map))
assert not banned.search(full), banned.findall(full)
md = MarkdownIt('commonmark', {'html': True, 'typographer': False, 'breaks': False}).enable('table')
strong, strong_count = re.subn(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', full, flags=re.S)
assert '**' not in strong
tokens = md.parse(strong)
headings, counts = [], {'examples': 0, 'cases': 0}
for n, t in enumerate(tokens):
    if t.type == 'heading_open':
        assert t.tag in ('h2', 'h3')
        title = tokens[n + 1].content
        key = f'k70-heading-{len(headings) + 1:02d}'
        t.attrSet('id', key); t.attrSet('data-section-title', title)
        headings.append({'id': key, 'level': int(t.tag[1]), 'title': title})
    if t.type == 'paragraph_open':
        for prefix, cls, count in [('<strong>例子：', 'v58-example', 'examples'), ('<strong>案例：', 'v58-case', 'cases')]:
            if tokens[n + 1].content.startswith(prefix):
                t.attrSet('class', cls); counts[count] += 1
rendered = md.renderer.render(tokens, md.options, {})
rendered = rendered.replace('<table>', '<div class="voice-table-scroll" tabindex="0"><table>').replace('</table>', '</table></div>')
annex = next(h for h in headings if h['title'] == '附二　历史版本与关键数字')
heading = re.search(r'<h2\b[^>]*id="' + annex['id'] + r'"[^>]*>.*?</h2>', rendered)[0]
assert rendered.count('<details>') == rendered.count('</details>') == 1
# Preserve the two standard folds: original overview, then historical appendix.
overview = '<details class="voice-original" id="detailed-flow"><summary>对照：身份与记忆全图</summary>\n<!-- figure:k2-overview -->\n</details>\n'
rendered = rendered.replace(heading + '\n<details>\n<summary>', overview + '<details class="voice-original v55-archive" id="k70-history"><summary>' + heading + '\n', 1)
rendered = ''.join(rendered.rsplit('</details>', 1)).rstrip('\n') + '\n</details>\n'
assert rendered.count('<details ') == rendered.count('</details>') == 2
keys = re.findall(r'<!--\s*figure:([\w-]+)\s*-->', full)
assert len(keys) == 7 and keys.count('k2-overview') == 2 and len(set(keys)) == 6
assert rendered.count(overview) == 1, 'Add exactly one original overview fold'
assert overview + '<details class="voice-original v55-archive"' in rendered, 'Original overview fold must immediately precede appendix two'
assert re.findall(r'<!--\s*figure:([\w-]+)\s*-->', rendered.replace(overview, '', 1)) == keys, 'Body figure slots must match full.md, plus exactly one original overview fold'
titles, subtitles, figure_audit = {}, {}, []
for key in dict.fromkeys(keys):
    f = HERE / 'figures' / (key + '.svg')
    svg = f.read_text(); root = ET.fromstring(svg)
    meta = json.loads(f.with_suffix('.json').read_text())
    texts = [''.join(el.itertext()) for el in root.iter() if el.tag.rsplit('}', 1)[-1] in ['text', 'title', 'desc']]
    labels = [value for el in root.iter() for attr, value in el.attrib.items() if attr in ['aria-label', 'title', 'alt']]
    comments = re.findall(r'<!--([\s\S]*?)-->', svg)
    assert not banned.search('\n'.join(texts + labels + comments + [meta['title'], meta['subtitle']])), key
    titles[key], subtitles[key] = meta['title'], meta['subtitle']
    data['diagrams'][key] = svg
    figure_audit.append({'figure': key, 'sha256': sha(svg.encode()), 'bannedMatches': []})
page['title'] = 'K · 身份与记忆：先认人，再用对记忆'
page['summary'] = '先确认谁说话、当前车辆与账号能用谁的记忆，再沿生成、取回、采用和车上结果逐段核对。'
page['scenario'] = '副驾老周说“先送我回家”，车主接着说“记一下，他喜欢喝冰美式”。先对齐人物，再核对地址和本人认可。'
page['v55'] = {'html': rendered, 'headings': headings, 'figureTitles': titles, 'figureSubtitles': subtitles}
# Remove the entire superseded course payload, including hidden retelling data.
for field in ['v34', 'feynman', 'bridge', 'converted', 'articleReading']:
    page.pop(field, None)
page['sections'] = []; page['teaching'] = {'intro': [], 'lessons': [], 'closing': []}
for field in ['flows', 'cases', 'terms', 'questions', 'metrics', 'roadmap', 'related', 'referenceTables', 'mainline', 'concepts']:
    if field in page: page[field] = []
target_titles = {
    'k-lesson-person': '二、认人：音区、人脸和声纹各说明什么',
    'k-lesson-produce': '四、记忆怎样产生',
    'k-lesson-use': '五、记忆怎样被用',
    'k-lesson-control': '六、记忆怎样被改和删',
    'k-lesson-cross-device': '七、车里有别人时：隐私和在场的人',
    'k-lesson-poi-sync': '八、记忆怎样用于地点和座椅',
    'k-lesson-profile': '标签帮助查找，画像多走了一步推断',
    'k-lesson-quality': '九、排查：用户说“你又忘了”，先查哪一层',
    'k-lesson-seat-mem': '八、记忆怎样用于地点和座椅',
}
# Use exact heading texts from the approved source for section-level mappings.
for key in ['k-lesson-poi-sync', 'k-lesson-seat-mem']:
    target_titles[key] = next(h['title'] for h in headings if h['title'].startswith('八、'))
target_titles['k-lesson-quality'] = next(h['title'] for h in headings if h['title'].startswith('九、'))
by_title = {h['title']: h['id'] for h in headings}
targets = {key: by_title[title] for key, title in target_titles.items()}
heading_ids = {h['id'] for h in headings}
for old_id, new_id in old_page.get('legacyChapterTargets', {}).items():
    targets[old_id] = new_id if new_id in heading_ids else targets.get(new_id, headings[0]['id'])
for s in old_page.get('feynman', {}).get('sections', []): targets.setdefault('learn-' + s['id'], headings[0]['id'])
targets['teach-back'] = next(h['id'] for h in headings if h['title'].startswith('收尾、'))
page['legacyChapterTargets'] = targets
assert all(p == next(q for q in data['pages'] if q['id'] == p['id']) for p in old['pages'] if p['id'] != 'K')
assert all(v == data[k] for k, v in old.items() if k not in ['pages', 'diagrams'])
assert all(v == data['diagrams'][k] for k, v in old['diagrams'].items())
assert not banned.search(rendered)
def script(m):
    attrs, body = m[1], m[2]
    if 'id="learning-doc-data"' in attrs: body = json.dumps({'revision': revision, 'pages': {}}, ensure_ascii=False)
    elif re.match(r'\s*const DATA\s*=', body): body = '\nconst DATA=' + json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/') + ';\n'
    elif 'function renderModule' in body:
        assert body.count(f"revision: '{base_revision}'") == body.count(f'我的修订-{base_revision}.html') == 1
        body = body.replace(f"revision: '{base_revision}'", f"revision: '{revision}'").replace(f'我的修订-{base_revision}.html', f'我的修订-{revision}.html')
    return '<script' + attrs + '>' + body + '</script>'
output = re.sub(r'<script([^>]*)>([\s\S]*?)</script>', script, base)
assert output.count(f'<title>豆包汽车业务学习站 {base_revision}</title>') == 1
output = output.replace(f'<title>豆包汽车业务学习站 {base_revision}</title>', f'<title>豆包汽车业务学习站 {revision}</title>', 1)
assert BASE.read_bytes() == baseline
assert all((HERE / k).read_bytes() == v for k, v in inputs.items())
with OUT.open('x') as f: f.write(output)
manifest = {'base': str(BASE), 'output': str(OUT), 'baselineSha256': sha(baseline), 'outputSha256': sha(output.encode()),
    'inputsSha256': {k: sha(v) for k, v in inputs.items()}, 'sourceSha256': sha(full.encode()), 'removedComments': removed,
    'nameReplacements': {k: {'replacement': name_map[k], 'count': n} for k, n in name_edits.items()}, 'browserStarted': False,
    'h2': sum(h['level'] == 2 for h in headings), 'h3': sum(h['level'] == 3 for h in headings), 'headings': headings,
    'figureKeys': keys, 'uniqueFigureKeys': list(dict.fromkeys(keys)), 'referenceFoldFigure': 'k2-overview', 'renderedSvgCount': len(keys) + 1,
    'strongCount': strong_count, **counts, 'figureAudit': figure_audit, 'otherChaptersIdentical': True}
(HERE / f'build-manifest-{revision}.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({k: manifest[k] for k in ['output', 'h2', 'h3', 'examples', 'cases', 'renderedSvgCount']}, ensure_ascii=False))
