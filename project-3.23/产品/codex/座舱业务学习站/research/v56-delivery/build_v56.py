"""Mechanical v56 delivery; preserve source and v55; no browser."""
from pathlib import Path
from markdown_it import MarkdownIt
import re, json, hashlib, xml.etree.ElementTree as ET

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
SOURCE = HERE.parent / 'v55-narrative-20261113/full-v57.md'
FIGURES = HERE.parent / 'v56-figures'
BASE = ROOT / 'HTML/01-进行中/豆包汽车-业务学习站-v55.html'
OUT = ROOT / 'HTML/01-进行中/豆包汽车-业务学习站-v56.html'
assert not OUT.exists(), 'Never overwrite a version'
sha = lambda b: hashlib.sha256(b).hexdigest()
original = SOURCE.read_text()
full = original
removed_bold = [
    '主驾插话“帮我把副驾座椅加热打开”，办完这件事，最后说“第二个”。',
    '业务工具再交回实际结果。', '具体车型取值需要看配置。', '它结合画面和文字理解场景。',
]
added_bold = [
    '多人一句话以“豆包”开头，规则可以立即打断；单人时，ASR 超过两个字也可以直接打断。',
    '最终拒识用定稿文字和相应背景判断整句话是否属于助手交互。',
    'ASR 即使把每个字都写对，热词也补不出“昨天那家”的具体地址；这份未知，要留给后面的历史与记忆查询解决。',
]
for text in removed_bold:
    assert full.count('**' + text + '**') == 1, text
    full = full.replace('**' + text + '**', text, 1)
for text in added_bold:
    assert full.count(text) == 1 and '**' + text + '**' not in full, text
    full = full.replace(text, '**' + text + '**', 1)
assert full.replace('**', '') == original.replace('**', '')
multi_rule = '多人、正在播报、ASR 超过两个字，且句首没有“豆包”'
assert '触发条件是**' + multi_rule + '**。' in full

md = MarkdownIt('commonmark', {'html': True, 'typographer': False, 'breaks': False}).enable('table')
def explicit_strong(text):
    # CommonMark's punctuation boundary rule leaves some CJK ** spans literal.
    # The delivery contract explicitly requires every supplied pair as strong.
    assert text.count('**') % 2 == 0
    converted, count = re.subn(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text, flags=re.S)
    assert count * 2 == text.count('**') and '**' not in converted
    return converted
original_reference = md.render(explicit_strong(original))
adjusted_reference = md.render(explicit_strong(full))
tokens = md.parse(full)
headings = []
for i, token in enumerate(tokens):
    if token.type == 'heading_open':
        text = tokens[i + 1].content
        if token.tag == 'h1':
            title = text
        else:
            assert token.tag in ('h2', 'h3')
            ident = f'v56-heading-{len(headings) + 1:02d}'
            token.attrSet('id', ident)
            token.attrSet('data-section-title', text)
            headings.append({'id': ident, 'level': int(token.tag[1]), 'title': text})

# Source-line insertions retain all narrative bytes. Keys select exactly the
# headings/paragraphs named in their paired JSON rather than approximate matches.
placements = {
    'v56-entry': ('一、开口之前', '赛力斯的《本地对话链路需求》把全时未激活路线写得很具体。', 'after'),
    'v56-zone': ('二、先把声音听清', '说话音区也不能直接当作操作位置。', 'after'),
    'v56-asr-axes': ('三、声音变成文字', '“在线、离线”回答在哪里识别，“过程、最终”回答这一次识别走到了哪里。', 'after'),
    'v56-three-decisions': ('说完整以后，谁来最后把关', '最终拒识用定稿文字和相应背景判断', 'before'),
    'v56-local-outcomes': ('六、谁来办', '本地输出里有三个需要特别分开的方向。', 'after'),
    'v56-model-map': ('七、这些模型分别是谁', '先把各自接手的事情放在一起看。', 'after'),
    'v56-planner-loop': ('动作清单交出去以后，Planner 还要等工具把结果交回来', '刚才的补查和搜索', 'before'),
    'v56-second-item': ('座椅指令办完，“第二个”要接回刚才那份餐厅列表', '主驾最后说“第二个”', 'after'),
    'v56-memory-which': ('记忆分层，是为了既接住下一句，也找回较早的事', '<!-- figure:v34-memory -->', 'after'),
    'v56-launcher': ('点击怎样交办，要看这张卡片约定走哪条路', '《VUI主交互需求》中的 VUI', 'after'),
    'v56-resume': ('新话最终被拒识，允许恢复时还要发起一次请求', '豆包正介绍餐厅', 'before'),
    'v56-journey': ('收尾　三分钟讲给别人听', '我会用主驾的一段话解释这条链路', 'before'),
}
svg_paths = sorted(FIGURES.glob('*.svg'))
assert len(svg_paths) == 13
metadata = {p.stem: json.loads(p.with_suffix('.json').read_text()) for p in svg_paths}
lines = full.splitlines(keepends=True)
insertions, placement_report = [], []
for key, (heading_prefix, start, mode) in placements.items():
    sections = [(i, t) for i, t in enumerate(tokens) if t.type == 'heading_open' and tokens[i + 1].content.startswith(heading_prefix)]
    assert len(sections) == 1, (key, heading_prefix)
    at, ht = sections[0]
    end = next((j for j in range(at + 1, len(tokens)) if tokens[j].type == 'heading_open' and int(tokens[j].tag[1]) <= int(ht.tag[1])), len(tokens))
    candidates = [t for t in tokens[at:end] if t.map and t.type in ('paragraph_open', 'html_block') and ''.join(lines[t.map[0]:t.map[1]]).replace('**', '').startswith(start)]
    assert len(candidates) == 1, (key, start)
    target = candidates[0]
    line = target.map[1 if mode == 'after' else 0]
    insertions.append((line, f'\n<!-- figure:{key} -->\n\n'))
    placement_report.append({'key': key, 'heading': tokens[at + 1].content, 'mode': mode, 'anchor': start, 'sourceLine': line, 'fallback': False, 'after_heading': metadata[key]['after_heading']})
for line, marker in sorted(insertions, reverse=True):
    lines.insert(line, marker)
full_with_figures = ''.join(lines)
assert full_with_figures.count('<!-- figure:v57-rhythm -->') == 1
placement_report.append({'key': 'v57-rhythm', 'heading': '对话节奏管理，把这些时机放回一起看', 'mode': 'existing-marker', 'fallback': False, 'after_heading': metadata['v57-rhythm']['after_heading']})

tokens = md.parse(explicit_strong(full_with_figures))
heading_index = 0
for i, token in enumerate(tokens):
    if token.type == 'heading_open' and token.tag != 'h1':
        h = headings[heading_index]
        assert tokens[i + 1].content == h['title']
        token.attrSet('id', h['id'])
        token.attrSet('data-section-title', h['title'])
        heading_index += 1
rendered = md.renderer.render(tokens, md.options, {})
rendered = re.sub(r'^<h1>.*?</h1>\n', '', rendered, count=1)
rendered = rendered.replace('<table>', '<div class="voice-table-scroll" tabindex="0"><table>').replace('</table>', '</table></div>')
annex = next(h for h in headings if h['title'] == '附二　历史资料与待核对事项')
annex_open = re.search(r'<h2\b[^>]*id="' + annex['id'] + r'"[^>]*>.*?</h2>', rendered)[0]
rendered = rendered.replace(annex_open, '<!--original-v55--><details class="voice-original v55-archive" id="v56-history"><summary>' + annex_open + '</summary>', 1) + '</details>'
base = BASE.read_text()
data_match = re.search(r'const DATA=(.*?);\s*</script>', base, re.S)
data = json.loads(data_match[1])
page = next(p for p in data['pages'] if p['id'] == 'V')
figure_titles = dict(page['v55']['figureTitles'])
for p in svg_paths:
    raw = p.read_text()
    ET.fromstring(raw)
    assert p.stem not in data['diagrams']
    data['diagrams'][p.stem] = raw
    figure_titles[p.stem] = metadata[p.stem]['title']
figure_keys = re.findall(r'<!--\s*figure:([\w-]+)\s*-->', full_with_figures)
assert set(figure_keys) == set(figure_titles) and len(figure_keys) == 22
page['title'] = title
page['v55'] = {'html': rendered, 'headings': headings, 'figureTitles': figure_titles, 'figureSubtitles': {key: value['subtitle'] for key, value in metadata.items()}}

def replace_script(match):
    attrs, body = match[1], match[2]
    if 'id="learning-doc-data"' in attrs:
        body = json.dumps({'revision': 'v56', 'pages': {}}, ensure_ascii=False)
    elif re.match(r'\s*const DATA\s*=', body):
        body = '\nconst DATA=' + json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/') + ';\n'
    elif 'function renderModule' in body:
        old = "(_,key)=>figure({key,title:lesson.figureTitles[key],svg:DATA.diagrams[key],pageId:'V',voiceLesson:true})"
        new = "(_,key)=>{const frame=figure({key,title:lesson.figureTitles[key],svg:DATA.diagrams[key],pageId:'V',voiceLesson:true});return lesson.figureSubtitles?.[key]?frame.replace('</figure>','<div class=\"figure-caption\" data-figure-subtitle=\"'+esc(key)+'\">'+esc(lesson.figureSubtitles[key])+'</div></figure>'):frame;}"
        assert body.count(old) == 1
        body = body.replace(old, new, 1)
        assert body.count("revision: 'v55'") == 1
        body = body.replace("revision: 'v55'", "revision: 'v56'").replace('我的修订-v55.html', '我的修订-v56.html')
    return '<script' + attrs + '>' + body + '</script>'
output = re.sub(r'<script([^>]*)>([\s\S]*?)</script>', replace_script, base)
output = output.replace('<title>豆包汽车业务学习站 v55</title>', '<title>豆包汽车业务学习站 v56</title>')
css = '''
/* v56: bound reading frames; only the V chapter receives these rules. */
.voice-v55 .figure-caption{min-width:0;max-width:100%;overflow-wrap:anywhere}
.voice-v55 .svg-shell{min-width:0;max-width:100%}
.voice-v55 .figure-header>h3{min-width:0;max-width:100%;overflow-wrap:anywhere}
@media(max-width:760px){.voice-v55 .figure-tools{min-width:0;max-width:100%;flex-wrap:wrap}.voice-v55 .voice-table-scroll{width:100%;max-width:100%;overflow-x:auto}}
'''
output = output.replace('</style>', css + '</style>', 1)
# All validation evidence lives beside this build, without changing v55 inputs.
(HERE / 'reference-render.json').write_text(json.dumps({'originalHtml': original_reference, 'adjustedHtml': adjusted_reference, 'headings': headings}, ensure_ascii=False, indent=2))
manifest = {'base': str(BASE), 'output': str(OUT), 'source': str(SOURCE), 'baselineSha256': sha(BASE.read_bytes()), 'sourceSha256': sha(SOURCE.read_bytes()), 'svgSha256': {p.name: sha(p.read_bytes()) for p in svg_paths}, 'placements': placement_report, 'boldRemoved': removed_bold, 'boldAdded': added_bold, 'boldUnchangedException': multi_rule, 'expectedStrongCount': 103, 'headings': headings, 'sourceOnlyBoldMarkersChanged': full.replace('**','') == original.replace('**',''), 'browserStarted': False}
(HERE / 'build-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2))
with OUT.open('x') as f:
    f.write(output)
print(json.dumps({'output': str(OUT), 'newSvg': 13, 'chapterSvg': 23, 'headings': len(headings), 'h2': sum(h['level']==2 for h in headings), 'h3': sum(h['level']==3 for h in headings)}, ensure_ascii=False))
