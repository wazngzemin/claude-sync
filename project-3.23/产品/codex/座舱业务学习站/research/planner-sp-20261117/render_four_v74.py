"""Pure re-rendering of V/D/E/T, with a reverse-fix-log byte comparison to v73."""
from pathlib import Path
from markdown_it import MarkdownIt
import re, json, hashlib, difflib

HERE = Path(__file__).resolve().parent
RESEARCH = HERE.parent
ROOT = HERE.parents[2]
SOURCES = {'V': RESEARCH/'v57-rewrite/full-v59.md', 'D': RESEARCH/'D-v2/full.md', 'E': RESEARCH/'E-v2/full.md', 'T': RESEARCH/'T-v2/full.md'}


def logged_edits():
    log = (HERE/'fix-log.md').read_text()
    edits = {k: [] for k in SOURCES}
    for block in re.split(r'(?m)^### ', log)[1:]:
        match = re.search(r'- 文件：`([^`]+)`', block)
        if not match: continue
        ident = next((k for k,p in SOURCES.items() if str(p) == match[1]), None)
        if ident is None: continue
        before = re.search(r'改前：\s*```markdown\n([\s\S]*?)\n```',block)[1]
        after = re.search(r'改后：\s*```markdown\n([\s\S]*?)\n```',block)[1]
        edits[ident].append((before, after))
    assert {k: len(v) for k,v in edits.items()} == {'V':8,'D':4,'E':8,'T':2}
    return edits


def render_chapter(ident, full, lesson):
    """Use the historical CommonMark pipeline, stable heading IDs and fold markup."""
    md = MarkdownIt('commonmark', {'html': True, 'typographer': False, 'breaks': False}).enable('table')
    strong = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', full, flags=re.S)
    assert '**' not in strong
    tokens = md.parse(strong)
    headings = []
    for n,t in enumerate(tokens):
        if t.type == 'heading_open':
            title = tokens[n+1].content
            old = lesson['headings'][len(headings)]
            assert title == old['title'] and int(t.tag[1]) == old['level'], (ident,title,old)
            t.attrSet('id',old['id']); t.attrSet('data-section-title',title)
            headings.append(dict(old))
        if t.type == 'paragraph_open':
            for prefix,cls in [('<strong>例子：','v58-example'),('<strong>案例：','v58-case')]:
                if tokens[n+1].content.startswith(prefix): t.attrSet('class',cls)
    assert headings == lesson['headings']
    rendered = md.renderer.render(tokens,md.options,{})
    rendered = rendered.replace('<table>','<div class="voice-table-scroll" tabindex="0"><table>').replace('</table>','</table></div>')
    annex = next(h for h in headings if h['title']=='附二　历史版本与关键数字')
    heading = re.search(r'<h2\b[^>]*id="'+annex['id']+r'"[^>]*>.*?</h2>',rendered)[0]
    if ident == 'V':
        rendered = rendered.replace(heading,'<!--original-v55--><details class="voice-original v55-archive" id="v59-history"><summary>'+heading+'</summary>',1)+'</details>'
    else:
        # Recover exactly the existing original-map fold, including its explanation.
        overview = re.search(r'<details class="voice-original" id="detailed-flow">[\s\S]*?</details>\n',lesson['html'])[0]
        history = {'D':'d66-history','E':'e67-history','T':'t73-history'}[ident]
        assert rendered.count('<details>') == rendered.count('</details>') == 1
        rendered = rendered.replace(heading+'\n<details>\n<summary>',overview+'<details class="voice-original v55-archive" id="'+history+'"><summary>'+heading+'\n',1)
        rendered = ''.join(rendered.rsplit('</details>',1)).rstrip('\n')+'\n</details>\n'
    return rendered


def apply_four(data):
    edits = logged_edits()
    report = {}
    for ident,path in SOURCES.items():
        page = next(p for p in data['pages'] if p['id']==ident)
        full = path.read_text()
        before = full
        for original, changed in edits[ident]:
            assert before.count(changed) == 1, (ident,'not unique after',changed)
            if original == '（无，新增）':
                assert before.count(changed+'\n\n') == 1
                before = before.replace(changed+'\n\n','',1)
            else: before = before.replace(changed,original,1)
        baseline = page['v55']['html']
        restored = render_chapter(ident,before,page['v55'])
        if restored != baseline:
            delta = '\n'.join(difflib.unified_diff(baseline.splitlines(),restored.splitlines(),fromfile='v73',tofile='reverse-fix-render'))
            raise AssertionError(ident+' reversed source differs from v73:\n'+delta[:10000])
        new_html = render_chapter(ident,full,page['v55'])
        page['v55']['html'] = new_html
        report[ident] = {'loggedEdits':len(edits[ident]),'reverseFixRenderByteIdentical':True,
            'onlyLoggedChanges':True,'headingIDsUnchanged':True,'figuresAndFoldsUnchanged':True,
            'sourceSha256':hashlib.sha256(full.encode()).hexdigest(),
            'oldHtmlSha256':hashlib.sha256(baseline.encode()).hexdigest(),
            'newHtmlSha256':hashlib.sha256(new_html.encode()).hexdigest()}
    return report

if __name__ == '__main__':
    base = (ROOT/'HTML/01-进行中/豆包汽车-业务学习站-v73.html').read_text()
    data = json.loads(re.search(r'const DATA=(.*?);\s*</script>',base,re.S)[1])
    print(json.dumps(apply_four(data),ensure_ascii=False,indent=2))
