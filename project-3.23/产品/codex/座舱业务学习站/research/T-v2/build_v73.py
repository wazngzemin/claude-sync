"""Build T v73 from v72. Keep exact prose, eight assets and two standard folds."""
from pathlib import Path
from markdown_it import MarkdownIt
import argparse, re, json, hashlib, xml.etree.ElementTree as ET
import subprocess
from PIL import ImageFont

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
args = argparse.ArgumentParser()
args.add_argument('--base-version', type=int, default=72)
args.add_argument('--output-version', type=int, default=73)
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
page = next(p for p in data['pages'] if p['id'] == 'T')
old_page = json.loads(json.dumps(page))
inputs = {f'part-{n}.md': (HERE / f'part-{n}.md').read_bytes() for n in [1, 2, 3, 5, 4]}
# Verify the sole authorized source edit against the original byte hash.
review_deleted = (
    '**案例：8 月 4 日，三点五十八分的提醒没响** 用户已获准时承诺，实车到点却未提醒；第六段从创建、回调、回流到播放追查，并要求复测到实际听见。\n\n'
    '**案例：9 月联调，空任务列表仍有图标** 上汽联调时有效任务为空，状态栏仍显示图标；第九段先比查询返回与车端展示，再复测删除最后一项后的刷新和上电查询。\n\n'
)
review_before_sha = '97f8e9b415676dae437d38d6572321113c011021f23fa9b5a8e585b38361666c'
part4 = inputs['part-4.md'].decode()
assert review_deleted not in part4
before_review = part4.replace('\n</details>', '\n' + review_deleted + '</details>', 1)
assert sha(before_review.encode()) == review_before_sha, 'No other source edits allowed'
review_audit = {'file': 'part-4.md', 'deletedParagraphs': review_deleted.strip().split('\n\n'),
    'beforeSha256': review_before_sha, 'afterSha256': sha(inputs['part-4.md']),
    'onlyAuthorizedDeletion': True, 'extraBlankLinesRemoved': True}
removed = []
def comment(m):
    if re.fullmatch(r'<!--\s*figure:[\w-]+\s*-->', m[0]): return m[0]
    removed.append(m[0])
    return ''
merged = '\n\n'.join(re.sub(r'<!--[\s\S]*?-->', comment, b.decode()).strip('\n') for b in inputs.values()) + '\n'
full = merged
banned = re.compile(r'资料|PRD|清单|待确认|口径|没有展开|未展开|技术方案|宣讲|周报|逐字稿|文字记录|纪要|缺陷表|(?<![A-Za-z])DT(?![A-Za-z])|Director|小模型|OnePage|书名号|《|》')
assert not banned.search(full), banned.findall(full)
# English tool/field identifiers are confined to appendix two. Product names,
# model names and the Script concept are not tool or field identifiers.
body_source, appendix_source = full.split('## 附二', 1)
tool_fields = [name for name in re.findall(r'`([^`]+)`', appendix_source) if name != 'Script']
assert '`' not in body_source
assert not any(re.search(r'(?<![A-Za-z0-9_])' + re.escape(name) + r'(?![A-Za-z0-9_])', body_source)
               for name in tool_fields)
md = MarkdownIt('commonmark', {'html': True, 'typographer': False, 'breaks': False}).enable('table')
strong, strong_count = re.subn(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', full, flags=re.S)
assert '**' not in strong
tokens = md.parse(strong)
headings, counts = [], {'examples': 0, 'cases': 0}
for n, t in enumerate(tokens):
    if t.type == 'heading_open':
        assert t.tag in ('h2', 'h3')
        title = tokens[n + 1].content
        key = f't73-heading-{len(headings) + 1:02d}'
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
overview = '<details class="voice-original" id="detailed-flow"><summary>原始全图</summary>\n<p>这是本章原来的全图，按一次长期任务的生命周期排：左边入口，中间创建与等待，右边触发与执行，赛力斯和上汽两条渠道在‘建议交回主链’处汇合。</p>\n<!-- figure:t-base -->\n</details>\n'
rendered = rendered.replace(heading + '\n<details>\n<summary>', overview + '<details class="voice-original v55-archive" id="t73-history"><summary>' + heading + '\n', 1)
rendered = ''.join(rendered.rsplit('</details>', 1)).rstrip('\n') + '\n</details>\n'
assert rendered.count('<details ') == rendered.count('</details>') == 2
keys = re.findall(r'<!--\s*figure:([\w-]+)\s*-->', full)
assert len(keys) == 8 and keys.count('t2-overview') == 2 and len(set(keys)) == 7
assert rendered.count(overview) == 1, 'Add exactly one original overview fold'
assert overview + '<details class="voice-original v55-archive"' in rendered, 'Original overview fold must immediately precede appendix two'
assert re.findall(r'<!--\s*figure:([\w-]+)\s*-->', rendered.replace(overview, '', 1)) == keys, 'Body figure slots must match full.md, plus exactly one original overview fold'
titles, subtitles, figure_audit = {}, {}, []
original_label_audit = []
label_names = {
    'vehicle_recommend_id': '车端推荐编号', 'recommend_id': '推荐编号', 'goal_id': '目标编号',
    'create_success': '创建成功', 'create_failed': '创建失败', 'UpdateGoal': '修改目标',
    'TaskView': '任务视图', 'Task Service': '任务服务', 'Extour Goal': '弋途目标引擎',
    'creating': '创建中', 'consumed': '已消费', 'waiting': '等待', 'trigger': '触发',
    'done': '已结束', 'advice': '建议', 'Task': '任务', 'Run': '运行', 'Event': '任务事件',
    'Goal': '目标', 'Extour': '弋途', 'Seres': '赛力斯', 'AIDV': '豆包接入侧', 'GUI': '界面操作',
}
font_path = subprocess.check_output(['fc-match', 'PingFang SC', '-f', '%{file}'], text=True).strip()
def localize_original(svg):
    """Translate visible legacy labels; preserve the supplied asset and geometry."""
    ns = '{http://www.w3.org/2000/svg}'
    root = ET.fromstring(svg)
    parent = {c: p for p in root.iter() for c in p}
    for el in root.iter(ns + 'text'):
        spans = list(el)
        if not spans: continue
        lines = [s.text or '' for s in spans]
        before = ''.join(lines)
        def translate(value):
            for english, chinese in label_names.items():
                value = re.sub(r'(?<![A-Za-z_])' + re.escape(english) + r'(?![A-Za-z_])', chinese, value)
            return value
        separate_lines = el.get('font-weight', '400') != '400'
        translated_lines = [translate(line) for line in lines]
        after = ''.join(translated_lines) if separate_lines else translate(before)
        if before == after: continue
        font = ImageFont.truetype(font_path, round(float(el.get('font-size', '25'))))
        ancestor = parent.get(el)
        while ancestor is not None and not ancestor.get('data-node'):
            ancestor = parent.get(ancestor)
        if ancestor is not None:
            rect = ancestor.find(ns + 'rect')
            available = float(rect.get('x')) + float(rect.get('width')) - float(el.get('x')) - 10
        else:
            label_rect = parent[el].find(ns + 'rect')
            available = float(label_rect.get('width')) - 20 if label_rect is not None else max(font.getlength(line) for line in lines)
        wrapped, line = [], ''
        for ch in after:
            if line and font.getlength(line + ch) > available:
                wrapped.append(line); line = ''
            line += ch
        if line: wrapped.append(line)
        if separate_lines:
            wrapped = translated_lines
            assert all(font.getlength(line) <= available for line in wrapped), before
        assert len(wrapped) <= len(lines), ('Original figure translation exceeds text box', before)
        for i, span in enumerate(spans): span.text = wrapped[i] if i < len(wrapped) else ''
        original_label_audit.append({'before': before, 'after': after, 'beforeLines': lines, 'afterLines': [s.text for s in spans]})
    ET.register_namespace('', 'http://www.w3.org/2000/svg')
    return ET.tostring(root, encoding='unicode')
for key in dict.fromkeys(keys + ['t-base']):
    f = HERE / ('figures' if key.startswith('t2-') else 'figures-orig') / (key + '.svg')
    original_svg = f.read_text()
    svg = localize_original(original_svg) if key == 't-base' else original_svg
    root = ET.fromstring(svg)
    meta = json.loads(f.with_suffix('.json').read_text())
    texts = [''.join(el.itertext()) for el in root.iter() if el.tag.rsplit('}', 1)[-1] in ['text', 'title', 'desc']]
    labels = [value for el in root.iter() for attr, value in el.attrib.items() if attr in ['aria-label', 'title', 'alt']]
    comments = re.findall(r'<!--([\s\S]*?)-->', svg)
    figure_text = '\n'.join(texts + labels + comments + [meta['title'], meta['subtitle']])
    assert not banned.search(figure_text), key
    figure_field_matches = [name for name in tool_fields if re.search(r'(?<![A-Za-z0-9_])' + re.escape(name) + r'(?![A-Za-z0-9_])', figure_text)]
    assert not figure_field_matches, (key, figure_field_matches)
    titles[key], subtitles[key] = meta['title'], meta['subtitle']
    data['diagrams'][key] = svg
    figure_audit.append({'figure': key, 'sha256': sha(svg.encode()), 'sourceSha256': sha(original_svg.encode()), 'bannedMatches': []})
page['title'] = 'T · 长期任务与目标管理'
page['shortTitle'] = '长期任务与目标管理'
page['summary'] = '沿一次接小宝提醒，说明未来安排怎样保存、等待、到点回流、记录结果，以及怎样修改、取消和同步车端状态。'
page['scenario'] = '主驾下午三点说“三十分钟后提醒我去接小宝”。任务系统保存并接下等待，三点半再交回 Planner，直到实际提醒和结果回写。'
page['v55'] = {'html': rendered, 'headings': headings, 'figureTitles': titles, 'figureSubtitles': subtitles}
# Remove the entire superseded course payload, including hidden retelling data.
for field in ['v34', 'feynman', 'bridge', 'converted', 'articleReading']:
    page.pop(field, None)
page['sections'] = []; page['teaching'] = {'intro': [], 'lessons': [], 'closing': []}
for field in ['flows', 'cases', 'terms', 'questions', 'metrics', 'roadmap', 'related', 'referenceTables', 'mainline', 'concepts']:
    if field in page: page[field] = []
# Old course URLs keep routing to the corresponding new narrative heading.
def segment(prefix):
    return next(h['id'] for h in headings if h['title'].startswith(prefix))
targets = {
    't-create': segment('三、'),
    't-wait-run': segment('六、'),
    't-channels-results': segment('五、'),
    't-manage': segment('八、'),
    't-goal-run-feedback-detail': segment('七、'),
    't-saic-goal-callbacks': segment('五、'),
    'learn-t-save': segment('三、'),
    'learn-t-wait': segment('六、'),
    'learn-t-run': segment('七、'),
    'learn-t-change': segment('八、'),
}
heading_ids = {h['id'] for h in headings}
for old_id, new_id in old_page.get('legacyChapterTargets', {}).items():
    targets[old_id] = new_id if new_id in heading_ids else targets.get(new_id, headings[0]['id'])
for s in old_page.get('feynman', {}).get('sections', []): targets.setdefault('learn-' + s['id'], headings[0]['id'])
targets['teach-back'] = next(h['id'] for h in headings if h['title'].startswith('收尾'))
page['legacyChapterTargets'] = targets
assert all(p == next(q for q in data['pages'] if q['id'] == p['id']) for p in old['pages'] if p['id'] != 'T')
assert all(v == data[k] for k, v in old.items() if k not in ['pages', 'diagrams'])
assert all(v == data['diagrams'][k] for k, v in old['diagrams'].items() if k not in keys + ['t-base'])
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
(HERE / 'full.md').write_text(full)
with OUT.open('x') as f: f.write(output)
manifest = {'base': str(BASE), 'output': str(OUT), 'baselineSha256': sha(baseline), 'outputSha256': sha(output.encode()),
    'inputsSha256': {k: sha(v) for k, v in inputs.items()}, 'sourceSha256': sha(full.encode()), 'removedComments': removed,
    'browserStarted': False, 'inputOrder': list(inputs), 'details': 2,
    'h2': sum(h['level'] == 2 for h in headings), 'h3': sum(h['level'] == 3 for h in headings), 'headings': headings,
    'figureKeys': keys, 'uniqueFigureKeys': list(dict.fromkeys(keys + ['t-base'])), 'referenceFoldFigure': 't-base', 'renderedSvgCount': len(keys) + 1,
    'strongCount': strong_count, **counts, 'figureAudit': figure_audit, 'otherChaptersIdentical': True,
    'sourceReviewEdit': review_audit, 'bannedMatches': [], 'toolAndFieldNamesOnlyInAppendixTwo': True}
manifest['originalFigureVisibleLabelTranslations'] = original_label_audit
manifest['originalFigureSourceUnchanged'] = True
(HERE / f'build-manifest-{revision}.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({k: manifest[k] for k in ['output', 'h2', 'h3', 'examples', 'cases', 'renderedSvgCount']}, ensure_ascii=False))
