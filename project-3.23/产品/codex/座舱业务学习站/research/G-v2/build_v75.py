"""Build G v75 from immutable v74; no browser, no edits to part/figure inputs."""
from pathlib import Path
from markdown_it import MarkdownIt
from html.parser import HTMLParser
import argparse, copy, hashlib, json, re, xml.etree.ElementTree as ET

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
BASE = ROOT / 'HTML/01-进行中/豆包汽车-业务学习站-v74.html'
OUT = ROOT / 'HTML/01-进行中/豆包汽车-业务学习站-v75.html'
BANNED = re.compile(r'资料|PRD|清单|待确认|口径|没有展开|未展开|技术方案|宣讲|周报|逐字稿|文字记录|纪要|缺陷表|群聊|DT|Director|小模型|OnePage|书名号|《|》')
sha = lambda b: hashlib.sha256(b).hexdigest()

class TextNodes(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.parts = []
        self.feed(html)
    def handle_data(self, value):
        if value.strip(): self.parts.append(value.strip('\n'))

def build(replace_existing=False):
    assert replace_existing or not OUT.exists(), 'Pass --replace-existing to regenerate v75'
    baseline = BASE.read_bytes()
    base = baseline.decode()
    data = json.loads(re.search(r'const DATA=(.*?);\s*</script>', base, re.S)[1])
    old = copy.deepcopy(data)
    old_page = next(p for p in old['pages'] if p['id'] == 'G')
    files = [HERE / f'part-{n}.md' for n in [1, 2, 3, 5, 4]]
    files += sorted(HERE.glob('figures*/*.svg')) + sorted(HERE.glob('figures*/*.json'))
    inputs = {str(f.relative_to(HERE)): f.read_bytes() for f in files}
    removed = []
    def comment(m):
        if re.fullmatch(r'<!--\s*figure:[\w-]+\s*-->', m[0]): return m[0]
        removed.append(m[0]); return ''
    merged = '\n\n'.join(re.sub(r'<!--[\s\S]*?-->', comment, inputs[f'part-{n}.md'].decode()).strip('\n') for n in [1,2,3,5,4]) + '\n'
    full = merged
    body, appendix = full.split('<details><summary>附二', 1)
    assert not BANNED.search(full), BANNED.findall(full)
    assert '`' not in body, 'Fields belong to appendix two'
    common_names = {'Planner', 'Advisor', 'Agent', 'AI', 'Context', 'PHUD', 'ID'}
    chapter_letters = set('A B C D E F G I K L M P R S SP T U V W'.split())
    plain_body = re.sub(r'<!--[\s\S]*?-->','',body)
    assert set(re.findall(r'[A-Za-z][A-Za-z0-9_.-]*', plain_body)) <= common_names | chapter_letters, 'Tool, field and interface names belong to appendix two'
    md = MarkdownIt('commonmark', {'html': True, 'typographer': False, 'breaks': False}).enable('table')
    strong, strong_count = re.subn(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', full, flags=re.S)
    assert '**' not in strong
    tokens = md.parse(strong)
    headings, counts = [], {'examples': 0, 'cases': 0}
    for i, t in enumerate(tokens):
        if t.type == 'heading_open':
            assert t.tag in ('h2','h3')
            title = tokens[i+1].content
            key = f'g75-heading-{len(headings)+1:02d}'
            t.attrSet('id', key); t.attrSet('data-section-title', title)
            headings.append({'id': key, 'level': int(t.tag[1]), 'title': title})
        if t.type == 'paragraph_open':
            for prefix, cls, key in [('<strong>例子：','v58-example','examples'),('<strong>案例：','v58-case','cases')]:
                if tokens[i+1].content.startswith(prefix): t.attrSet('class',cls); counts[key]+=1
    source_html = md.renderer.render(tokens, md.options, {})
    rendered = source_html.replace('<table>','<div class="voice-table-scroll" tabindex="0"><table>').replace('</table>','</table></div>')
    annex = next(h for h in headings if h['title']=='附二　历史版本与关键数字')
    heading = re.search(r'<h2\b[^>]*id="'+annex['id']+r'"[^>]*>.*?</h2>',rendered)[0]
    assert rendered.count('<details>') == rendered.count('</details>') == 1
    overview = '<details class="voice-original" id="detailed-flow"><summary>原始全图</summary>\n<p>这是本章原来的全图，按一次检查的先后排：先认场景和车辆范围，再看哪个信号叫醒、取状态、判断条件和频控，最后按登记交给任务服务或其他出口，并记下没触发的原因。</p>\n<!-- figure:g-base -->\n</details>\n'
    fold_start = '<details><summary>附二　历史版本与关键数字</summary>\n'+heading
    assert rendered.count(fold_start)==1
    rendered = rendered.replace(fold_start, overview+'<details class="voice-original v55-archive" id="g75-history"><summary>'+heading+'</summary>',1)
    # Moving the appendix heading into summary preserves its position in the text stream.
    expected = source_html.replace('<summary>附二　历史版本与关键数字</summary>','',1)
    assert TextNodes(rendered.replace(overview,'',1)).parts == TextNodes(expected).parts
    assert rendered.count('<details ') == rendered.count('</details>') == 2
    keys = re.findall(r'<!--\s*figure:([\w-]+)\s*-->',full)
    assert len(keys)==9 and len(set(keys))==8 and keys.count('g2-overview')==2
    assert re.findall(r'<!--\s*figure:([\w-]+)\s*-->',rendered.replace(overview,'',1)) == keys
    titles, subtitles, figures = {}, {}, []
    for key in dict.fromkeys(keys+['g-base']):
        asset = HERE / ('figures-orig' if key=='g-base' else 'figures') / (key+'.svg')
        original = asset.read_text()
        svg = original
        meta = json.loads(asset.with_suffix('.json').read_text())
        root = ET.fromstring(svg)
        assert not BANNED.search(svg+meta['title']+meta['subtitle']), key
        assert svg == original, 'Embed figure sources without renaming their text'
        assert key not in data['diagrams']
        data['diagrams'][key] = svg
        titles[key],subtitles[key] = meta['title'],meta['subtitle']
        figures.append({'figure':key,'sha256':sha(svg.encode()),'sourceSha256':sha(original.encode()),'bannedMatches':[]})
    def section(prefix): return next(h['id'] for h in headings if h['title'].startswith(prefix))
    targets = {'g-wake':section('二、'),'g-judge':section('五、'),'g-frequency':section('六、'),'g-dispatch':section('七、'),
               'g-scope':section('二、'),'g-state':section('三、'),'teach-back':section('收尾')}
    for old_id,new_id in old_page.get('legacyChapterTargets',{}).items(): targets[old_id]=targets.get(new_id,headings[0]['id'])
    for item in old_page.get('sections',[]): targets.setdefault(item['id'],headings[0]['id'])
    for item in old_page.get('feynman',{}).get('sections',[]): targets['learn-'+item['id']]=targets.get(item['id'],headings[0]['id'])
    for item in old_page.get('teaching',{}).get('lessons',[]): targets.setdefault('learn-'+item['id'],targets.get(item['id'],headings[0]['id']))
    page = {'id':'G','title':'G · 云端触发器','shortTitle':'云端触发器',
            'summary':'沿一次续航提醒，讲清规则登记、信号叫醒、条件判断、频控放行、出口交接和问题排查。',
            'scenario':'赛力斯主驾说“续航低于 100 公里的时候提醒我充电”。任务服务登记以后，触发器持续等待，再把成立结果交回任务服务。',
            'sourceIds':[],'sections':[],'teaching':{'intro':[],'lessons':[],'closing':[]},
            'v55':{'html':rendered,'headings':headings,'figureTitles':titles,'figureSubtitles':subtitles},'legacyChapterTargets':targets}
    data['pages'][next(i for i,p in enumerate(data['pages']) if p['id']=='G')] = page
    assert all(p==next(q for q in data['pages'] if q['id']==p['id']) for p in old['pages'] if p['id']!='G')
    assert all(v==data[k] for k,v in old.items() if k not in ('pages','diagrams'))
    assert all(v==data['diagrams'][k] for k,v in old['diagrams'].items())
    def script(m):
        attrs,body = m[1],m[2]
        if 'id="learning-doc-data"' in attrs: body=json.dumps({'revision':'v75','pages':{}},ensure_ascii=False)
        elif re.match(r'\s*const DATA\s*=',body): body='\nconst DATA='+json.dumps(data,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')+';\n'
        elif 'function renderModule' in body:
            assert body.count("revision: 'v74'")==body.count('我的修订-v74.html')==1
            body=body.replace("revision: 'v74'","revision: 'v75'").replace('我的修订-v74.html','我的修订-v75.html')
            assert body.count("['D','SP','E'].includes(page.id)")==1
            body=body.replace("['D','SP','E'].includes(page.id)","['D','SP','E','G'].includes(page.id)")
        return '<script'+attrs+'>'+body+'</script>'
    output = re.sub(r'<script([^>]*)>([\s\S]*?)</script>',script,base)
    output = output.replace('<title>豆包汽车业务学习站 v74</title>','<title>豆包汽车业务学习站 v75</title>',1)
    assert BASE.read_bytes()==baseline
    assert all((HERE/k).read_bytes()==v for k,v in inputs.items())
    (HERE/'full.md').write_text(full)
    with OUT.open('w' if replace_existing else 'x') as f: f.write(output)
    manifest={'base':str(BASE),'output':str(OUT),'baselineSha256':sha(baseline),'outputSha256':sha(output.encode()),
              'inputOrder':[f'part-{n}.md' for n in [1,2,3,5,4]],'inputsSha256':{k:sha(v) for k,v in inputs.items()},
              'sourceSha256':sha(full.encode()),'removedComments':removed,'englishPolicy':'preserve-source-common-names',
              'h2':sum(h['level']==2 for h in headings),'h3':sum(h['level']==3 for h in headings),**counts,
              'details':2,'svgCount':10,'uniqueSvgCount':9,'figureKeys':keys+['g-base'],'figureAudit':figures,
              'strongCount':strong_count,'bodyTextNodesExactlyMatchFullMd':True,'extraOriginalFoldExcludedFromTextComparison':True,
              'otherChaptersIdentical':True,'existingDiagramsIdentical':True,'cssUnchanged':True,'browserStarted':False,
              'inputFilesUnchanged':True,'bannedMatches':[],
              'sourceProseChanges':{'outsideAppendixTwo':{},'appendixTwoUnchanged':True},
              'fullMdExactlyMatchesMergedParts':full==merged,
              'commonNamesPreserved':True,'toolFieldInterfaceNamesOnlyInAppendixTwo':True,'chapterAndGearLettersRetained':True}
    (HERE/'build-manifest-v75.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({k:manifest[k] for k in ['output','h2','h3','examples','cases','details','svgCount','uniqueSvgCount']},ensure_ascii=False))

if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--replace-existing', action='store_true', help='Regenerate the explicitly requested v75 output')
    build(parser.parse_args().replace_existing)
