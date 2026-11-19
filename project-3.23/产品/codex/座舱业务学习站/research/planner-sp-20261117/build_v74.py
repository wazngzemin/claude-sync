"""Build v74 from the immutable v73 shell, approved prose and supplied SVGs.

No browser is used. Four chapter rendering and reverse-fix verification are in
render_four_v74.py; runtime checks are in verify_v74.cjs.
"""
from pathlib import Path
from markdown_it import MarkdownIt
from html.parser import HTMLParser
import copy
import hashlib
import json
import re
import xml.etree.ElementTree as ET
from render_four_v74 import apply_four, SOURCES

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
BASE = ROOT / 'HTML/01-进行中/豆包汽车-业务学习站-v73.html'
OUT = ROOT / 'HTML/01-进行中/豆包汽车-业务学习站-v74.html'
sha = lambda b: hashlib.sha256(b).hexdigest()
BANNED = re.compile(r'资料|PRD|清单|待确认|口径|没有展开|未展开|技术方案|宣讲|周报|逐字稿|文字记录|纪要|DT|Director|小模型|OnePage|书名号|《|》')


class VisibleText(HTMLParser):
    """Compare text nodes without markup or indentation-only whitespace."""
    def __init__(self, value):
        super().__init__(convert_charrefs=True)
        self.parts = []
        self.feed(value)

    def handle_data(self, text):
        if text.strip():
            self.parts.append(text.strip('\n'))


def build():
    assert not OUT.exists(), 'Never overwrite an existing HTML version'
    baseline = BASE.read_bytes()
    base = baseline.decode()
    data = json.loads(re.search(r'const DATA=(.*?);\s*</script>', base, re.S)[1])
    old = copy.deepcopy(data)
    inputs = {f'part-{n}.md': (HERE / f'part-{n}.md').read_bytes() for n in [1, 2, 3, 5, 4]}
    chapter_inputs = {str(p): p.read_bytes() for p in SOURCES.values()}
    removed = []

    def clean_comment(match):
        if re.fullmatch(r'<!--\s*figure:[\w-]+\s*-->', match[0]):
            return match[0]
        removed.append(match[0])
        return ''

    full = '\n\n'.join(re.sub(r'<!--[\s\S]*?-->', clean_comment, b.decode()).strip('\n') for b in inputs.values()) + '\n'
    assert not BANNED.search(full), BANNED.findall(full)
    md = MarkdownIt('commonmark', {'html': True, 'typographer': False, 'breaks': False}).enable('table')
    strong, strong_count = re.subn(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', full, flags=re.S)
    assert '**' not in strong
    tokens = md.parse(strong)
    headings, counts = [], {'examples': 0, 'cases': 0}
    for n, token in enumerate(tokens):
        if token.type == 'heading_open':
            assert token.tag in ('h2', 'h3')
            title = tokens[n + 1].content
            key = f'sp74-heading-{len(headings) + 1:02d}'
            token.attrSet('id', key)
            token.attrSet('data-section-title', title)
            headings.append({'id': key, 'level': int(token.tag[1]), 'title': title})
        if token.type == 'paragraph_open':
            for prefix, cls, count in [('<strong>例子：', 'v58-example', 'examples'), ('<strong>案例：', 'v58-case', 'cases')]:
                if tokens[n + 1].content.startswith(prefix):
                    token.attrSet('class', cls)
                    counts[count] += 1
    source_html = md.renderer.render(tokens, md.options, {})
    rendered = source_html.replace('<table>', '<div class="voice-table-scroll" tabindex="0"><table>').replace('</table>', '</table></div>')
    annex = next(h for h in headings if h['title'] == '附二　历史版本与关键数字')
    heading = re.search(r'<h2\b[^>]*id="' + annex['id'] + r'"[^>]*>.*?</h2>', rendered)[0]
    assert rendered.count('<details>') == rendered.count('</details>') == 1
    overview = '<details class="voice-original" id="detailed-flow"><summary>原始全图</summary>\n<!-- figure:sp2-overview -->\n</details>\n'
    rendered = rendered.replace(heading + '\n<details>\n<summary>', overview + '<details class="voice-original v55-archive" id="sp74-history"><summary>' + heading + '\n', 1)
    rendered = ''.join(rendered.rsplit('</details>', 1)).rstrip('\n') + '\n</details>\n'
    assert rendered.count('<details ') == rendered.count('</details>') == 2
    assert overview + '<details class="voice-original v55-archive"' in rendered
    assert VisibleText(rendered.replace(overview, '', 1)).parts == VisibleText(source_html).parts, 'Every source text node must survive rendering exactly'
    keys = re.findall(r'<!--\s*figure:([\w-]+)\s*-->', full)
    final_keys = re.findall(r'<!--\s*figure:([\w-]+)\s*-->', rendered)
    assert len(keys) == 6 and len(set(keys)) == 5 and keys.count('sp2-overview') == 2
    assert len(final_keys) == 7 and final_keys.count('sp2-overview') == 3
    assert re.findall(r'<!--\s*figure:([\w-]+)\s*-->', rendered.replace(overview, '', 1)) == keys
    titles, subtitles, figures = {}, {}, []
    for key in dict.fromkeys(keys):
        asset = HERE / 'figures' / (key + '.svg')
        svg = asset.read_text()
        ET.fromstring(svg)
        meta = json.loads(asset.with_suffix('.json').read_text())
        # Scan the entire asset and both caption fields, including hidden labels.
        assert not BANNED.search(svg + meta['title'] + meta['subtitle']), key
        assert key not in data['diagrams']
        data['diagrams'][key] = svg
        titles[key], subtitles[key] = meta['title'], meta['subtitle']
        figures.append({'figure': key, 'sha256': sha(svg.encode()), 'bannedMatches': []})
    four = apply_four(data)
    page = {
        'id': 'SP',
        'title': 'SP · 现行系统提示词：Planner 每一轮读到什么、按什么规则做',
        'shortTitle': '现行系统提示词',
        'summary': '沿回家买花的一次交办，读懂现行提示词的输入、输出、工具分工、安全条件与每轮背景。',
        'scenario': '主驾说“今天情人节，先导航回家吧，路上顺道买束花”。先安排回家路线，导航成功后再找沿途花店。',
        'sourceIds': [], 'sections': [], 'teaching': {'intro': [], 'lessons': [], 'closing': []},
        'v55': {'html': rendered, 'headings': headings, 'figureTitles': titles, 'figureSubtitles': subtitles},
        'legacyChapterTargets': {'teach-back': next(h['id'] for h in headings if h['title'].startswith('收尾'))},
    }
    index = next(i for i, p in enumerate(data['pages']) if p['id'] == 'D')
    data['pages'].insert(index + 1, page)
    for p in old['pages']:
        updated = next(q for q in data['pages'] if q['id'] == p['id'])
        if p['id'] not in four:
            assert updated == p, p['id']
        else:
            expected = copy.deepcopy(p)
            expected['v55']['html'] = updated['v55']['html']
            assert expected == updated, p['id']
    assert all(data[k] == v for k, v in old.items() if k not in ['pages', 'diagrams'])
    assert all(data['diagrams'][k] == v for k, v in old['diagrams'].items())

    def replace_script(match):
        attrs, body = match[1], match[2]
        if 'id="learning-doc-data"' in attrs:
            body = json.dumps({'revision': 'v74', 'pages': {}}, ensure_ascii=False)
        elif re.match(r'\s*const DATA\s*=', body):
            body = '\nconst DATA=' + json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/') + ';\n'
        elif 'function renderModule' in body:
            assert body.count("revision: 'v73'") == body.count('我的修订-v73.html') == 1
            body = body.replace("revision: 'v73'", "revision: 'v74'").replace('我的修订-v73.html', '我的修订-v74.html')
            assert body.count("['V', 'R', 'M', 'C', 'D', 'E', 'O']") == 2
            body = body.replace("['V', 'R', 'M', 'C', 'D', 'E', 'O']", "['V', 'R', 'M', 'C', 'D', 'SP', 'E', 'O']")
            assert body.count("D: 'Planner / Director', E:") == 1
            body = body.replace("D: 'Planner / Director', E:", "D: 'Planner / Director', SP: '现行系统提示词', E:")
            # Only the three chapters at the new handoff gain navigation UI.
            start = body.index(' function renderVoiceV55(')
            end = body.index(' function revealSection(', start)
            segment = body[start:end]
            target = "'<article class=\"voice-lesson v34 voice-v55\" id=\"chapter-reading\">'+body+'</article>';"
            assert segment.count(target) == 1
            replacement = target[:-1] + "+(['D','SP','E'].includes(page.id)?renderSpNeighbors(page.id):'');"
            segment = segment.replace(target, replacement)
            helper = ''' function renderSpNeighbors(id){
  const i=canonicalIds.indexOf(id), before=canonicalIds[i-1], after=canonicalIds[i+1];
  return '<nav class="article-footer" aria-label="章节翻页">'+
   '<a rel="prev" href="'+routeHref('module',before)+'"><span>上一章</span>'+esc(titleOf(before))+'</a>'+
   '<a rel="next" href="'+routeHref('module',after)+'"><span>下一章</span>'+esc(titleOf(after))+'</a></nav>';
 }
'''
            body = body[:start] + helper + segment + body[end:]
        return '<script' + attrs + '>' + body + '</script>'

    output = re.sub(r'<script([^>]*)>([\s\S]*?)</script>', replace_script, base)
    assert output.count('<title>豆包汽车业务学习站 v73</title>') == 1
    output = output.replace('<title>豆包汽车业务学习站 v73</title>', '<title>豆包汽车业务学习站 v74</title>', 1)
    assert BASE.read_bytes() == baseline
    assert all((HERE / k).read_bytes() == v for k, v in inputs.items())
    assert all(Path(k).read_bytes() == v for k, v in chapter_inputs.items())
    (HERE / 'full.md').write_text(full)
    with OUT.open('x') as f:
        f.write(output)
    manifest = {
        'base': str(BASE), 'output': str(OUT), 'baselineSha256': sha(baseline), 'outputSha256': sha(output.encode()),
        'inputOrder': list(inputs), 'sourceSha256': sha(full.encode()), 'removedComments': removed,
        'h2': sum(h['level'] == 2 for h in headings), 'h3': sum(h['level'] == 3 for h in headings),
        **counts, 'details': 2, 'svgCount': 7, 'uniqueSvgCount': 5, 'figureKeys': final_keys,
        'headings': headings, 'strongCount': strong_count, 'figureAudit': figures, 'bannedMatches': [],
        'bodyTextNodesExactlyMatchFullMd': True, 'extraOriginalFoldExcludedFromTextComparison': True,
        'fourChapters': four, 'otherChaptersByteIdentical': True, 'existingDiagramsByteIdentical': True,
        'sidebarPosition': '一句话到真实结果：D → SP → E', 'browserStarted': False,
        'cssUnchanged': True,
    }
    (HERE / 'build-manifest-v74.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({k: manifest[k] for k in ['output', 'h2', 'h3', 'examples', 'cases', 'details', 'svgCount', 'uniqueSvgCount']}, ensure_ascii=False))


if __name__ == '__main__':
    build()
