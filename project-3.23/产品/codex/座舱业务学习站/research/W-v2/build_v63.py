"""Build W with I-v62's CommonMark renderer and unchanged shared presentation."""
from pathlib import Path
from markdown_it import MarkdownIt
import re, json, hashlib, xml.etree.ElementTree as ET

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
BASE = ROOT / 'HTML/01-进行中/豆包汽车-业务学习站-v62.html'
OUT = ROOT / 'HTML/01-进行中/豆包汽车-业务学习站-v63.html'
assert not OUT.exists(), 'Never overwrite an existing HTML version'
sha = lambda b: hashlib.sha256(b).hexdigest()
baseline = BASE.read_bytes()
base = baseline.decode()
data = json.loads(re.search(r'const DATA=(.*?);\s*</script>', base, re.S)[1])
old = json.loads(json.dumps(data))
inputs = {f'part-{n}.md': (HERE / f'part-{n}.md').read_bytes() for n in range(1,5)}
removed = []
def comment(m):
    if re.fullmatch(r'<!--\s*figure:[\w-]+\s*-->', m[0]): return m[0]
    removed.append(m[0])
    return ''
full = '\n\n'.join(re.sub(r'<!--[\s\S]*?-->', comment, b.decode()).strip('\n') for b in inputs.values()) + '\n'
(HERE / 'full.md').write_text(full)
md = MarkdownIt('commonmark', {'html': True, 'typographer': False, 'breaks': False}).enable('table')
page = next(p for p in data['pages'] if p['id'] == 'W')
strong, strong_count = re.subn(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', full, flags=re.S)
assert '**' not in strong
tokens = md.parse(strong)
headings, counts = [], {'examples': 0, 'cases': 0}
for n,t in enumerate(tokens):
    if t.type == 'heading_open':
        assert t.tag in ('h2','h3')
        title = tokens[n+1].content
        key = f'w63-heading-{len(headings)+1:02d}'
        t.attrSet('id',key); t.attrSet('data-section-title',title)
        headings.append({'id':key,'level':int(t.tag[1]),'title':title})
    if t.type == 'paragraph_open':
        for prefix,cls,count in [('<strong>例子：','v58-example','examples'),('<strong>案例：','v58-case','cases')]:
            if tokens[n+1].content.startswith(prefix):
                t.attrSet('class',cls); counts[count]+=1
rendered = md.renderer.render(tokens,md.options,{})
rendered = rendered.replace('<table>','<div class="voice-table-scroll" tabindex="0"><table>').replace('</table>','</table></div>')
annex = next(h for h in headings if h['title']=='附二　历史版本与关键数字')
heading = re.search(r'<h2\b[^>]*id="'+annex['id']+r'"[^>]*>.*?</h2>',rendered)[0]
assert rendered.count('<details>') == rendered.count('</details>') == 1
# Keep the two inherited folds, but use only a new W diagram in the overview fold.
overview = '<details class="voice-original" id="detailed-flow"><summary>对照：三条处理路径全图</summary>\n<!-- figure:w2-three-paths -->\n</details>\n'
rendered = rendered.replace(heading+'\n<details>\n<summary>',overview+'<details class="voice-original v55-archive" id="w63-history"><summary>'+heading+'\n',1)
# The source's closing tag already encloses its final conclusion.
assert rendered.count('<details ') == rendered.count('</details>') == 2
keys = re.findall(r'<!--\s*figure:([\w-]+)\s*-->',full)
titles,subtitles,figure_audit = {},{},[]
for key in dict.fromkeys(keys):
    assert key.startswith('w2-')
    f = HERE/'figures'/(key+'.svg')
    svg = f.read_text(); meta = json.loads(f.with_suffix('.json').read_text())
    root = ET.fromstring(svg)
    texts = [''.join(el.itertext()) for el in root.iter() if el.tag.rsplit('}',1)[-1] in ['text','title','desc']]
    all_text = '\n'.join(texts+[meta['title'],meta['subtitle']])
    banned = re.findall(r'小模型|本地模型|来源|出处|20\d{2}[年./-]|\d{1,2}月\d{1,2}日',all_text)
    assert not banned, (key,banned)
    titles[key],subtitles[key] = meta['title'],meta['subtitle']
    data['diagrams'][key] = svg
    figure_audit.append({'figure':key,'sha256':sha(svg.encode()),'textNodes':len(texts),'bannedMatches':banned,'changes':[]})
page['v55'] = {'html':rendered,'headings':headings,'figureTitles':titles,'figureSubtitles':subtitles}
page.pop('v34',None);page['sections']=[];page['teaching']={'intro':[],'lessons':[],'closing':[]}
for field in ['flows','cases','terms','questions','metrics','roadmap','related','referenceTables','mainline','concepts']:
    if field in page: page[field]=[]
# Preserve inbound section links while making their destination a new heading.
target_titles = {
 'w-lesson-register':'页面交给语音的，是可说的词和对应目标',
 'w-lesson-match':'页面匹配等最终文字，避免把半句话变成点击',
 'w-lesson-card-routing':'先看卡片承载什么，再决定按钮怎么接',
 'w-lesson-dynamic-tool':'当前有可操作对象，才把对应工具交给 Planner',
 'w-lesson-result':'匹配成功、选中按钮、执行成功，要分别检查',
}
targets = {k:next(h['id'] for h in headings if h['title']==v) for k,v in target_titles.items()}
page['legacyChapterTargets'] = {**{k:targets.get(v,headings[0]['id']) for k,v in page.get('legacyChapterTargets',{}).items()},**targets}
assert all(p==next(q for q in data['pages'] if q['id']==p['id']) for p in old['pages'] if p['id']!='W')
assert all(v==data[k] for k,v in old.items() if k not in ['pages','diagrams'])
assert all(v==data['diagrams'][k] for k,v in old['diagrams'].items())
def script(m):
    attrs,body=m[1],m[2]
    if 'id="learning-doc-data"' in attrs: body=json.dumps({'revision':'v63','pages':{}},ensure_ascii=False)
    elif re.match(r'\s*const DATA\s*=',body): body='\nconst DATA='+json.dumps(data,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')+';\n'
    elif 'function renderModule' in body:
        assert body.count("revision: 'v62'")==body.count('我的修订-v62.html')==1
        body=body.replace("revision: 'v62'","revision: 'v63'").replace('我的修订-v62.html','我的修订-v63.html')
    return '<script'+attrs+'>'+body+'</script>'
output=re.sub(r'<script([^>]*)>([\s\S]*?)</script>',script,base)
assert output.count('<title>豆包汽车业务学习站 v62</title>')==1
output=output.replace('<title>豆包汽车业务学习站 v62</title>','<title>豆包汽车业务学习站 v63</title>',1)
with OUT.open('x') as f: f.write(output)
assert BASE.read_bytes()==baseline
assert all((HERE/k).read_bytes()==v for k,v in inputs.items())
manifest={'base':str(BASE),'output':str(OUT),'baselineSha256':sha(baseline),'outputSha256':sha(output.encode()),'removedComments':removed,'inputsSha256':{k:sha(v) for k,v in inputs.items()},'sourceSha256':sha(full.encode()),'browserStarted':False,'h2':sum(h['level']==2 for h in headings),'h3':sum(h['level']==3 for h in headings),'headings':headings,'figureKeys':keys,'overviewFigure':'w2-three-paths','uniqueFigureKeys':list(dict.fromkeys(keys)),'strongCount':strong_count,**counts,'figureAudit':figure_audit}
(HERE/'build-manifest-v63.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:manifest[k] for k in ['output','h2','h3','examples','cases','figureKeys']},ensure_ascii=False))
