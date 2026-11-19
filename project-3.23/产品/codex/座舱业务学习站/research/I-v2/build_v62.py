"""Reuse R-v61's mechanical CommonMark chapter renderer, without changing v61."""
from pathlib import Path
from markdown_it import MarkdownIt
import re, json, hashlib, xml.etree.ElementTree as ET

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
R = HERE.parent / 'R-v2'
BASE = ROOT / 'HTML/01-进行中/豆包汽车-业务学习站-v61.html'
OUT = ROOT / 'HTML/01-进行中/豆包汽车-业务学习站-v62.html'
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
manifest = {'base': str(BASE), 'output': str(OUT), 'baselineSha256': sha(baseline), 'removedComments': removed, 'inputsSha256': {k: sha(v) for k,v in inputs.items()}, 'chapters': {}, 'browserStarted': False}

def chapter(ident, source):
    page = next(p for p in data['pages'] if p['id'] == ident)
    strong, strong_count = re.subn(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', source, flags=re.S)
    assert '**' not in strong
    tokens = md.parse(strong)
    headings, counts = [], {'examples': 0, 'cases': 0}
    for n,t in enumerate(tokens):
        if t.type == 'heading_open':
            assert t.tag in ('h2','h3')
            title = tokens[n+1].content
            key = f'{ident.lower()}{61 if ident=="R" else 62}-heading-{len(headings)+1:02d}'
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
    rendered = rendered.replace(heading+'\n<details>\n<summary>','<!--original-v55--><details class="voice-original v55-archive" id="'+ident.lower()+('61' if ident=='R' else '62')+'-history"><summary>'+heading+'\n',1)
    rendered = rendered.replace('</details>','',1).rstrip('\n')+'\n</details>\n'
    keys = re.findall(r'<!--\s*figure:([\w-]+)\s*-->',source)
    titles,subtitles = {},{}
    originals = json.loads((HERE.parent/'chapters/I/diagrams.json').read_text()) if ident=='I' else {}
    for key in dict.fromkeys(keys):
        if ident=='I':
            if key.startswith('i2-'):
                f=HERE/'figures'/(key+'.svg'); meta=json.loads(f.with_suffix('.json').read_text())
                titles[key],subtitles[key]=meta['title'],meta['subtitle']
            else:
                f=HERE/'original-figures-v62'/(key+'.svg')
                titles[key]=ET.fromstring(f.read_text()).find('{http://www.w3.org/2000/svg}title').text
            svg=f.read_text()
        else:
            titles[key]=page['v55']['figureTitles'][key]
            if key in page['v55']['figureSubtitles']: subtitles[key]=page['v55']['figureSubtitles'][key]
            svg=(R/'figures-v62/r2-once-race.svg').read_text() if key=='r2-once-race' else data['diagrams'][key]
            if key=='r2-once-race':
                meta=json.loads((R/'changes-v62.json').read_text())['figureMetadata']
                titles[key],subtitles[key]=meta['title'],meta['subtitle']
        ET.fromstring(svg);data['diagrams'][key]=svg
    page['v55']={'html':rendered,'headings':headings,'figureTitles':titles,'figureSubtitles':subtitles}
    if ident=='I':
        page.pop('v34',None);page['sections']=[];page['teaching']={'intro':[],'lessons':[],'closing':[]}
        for field in ['flows','cases','terms','questions','metrics','roadmap','related','referenceTables','mainline','concepts']:
            if field in page: page[field]=[]
        page['legacyChapterTargets']={}
    manifest['chapters'][ident]={'sourceSha256':sha(source.encode()),'headings':headings,'h2':sum(h['level']==2 for h in headings),'h3':sum(h['level']==3 for h in headings),'figureKeys':keys,'uniqueFigureKeys':list(dict.fromkeys(keys)),'strongCount':strong_count,**counts}

chapter('I',full)
chapter('R',(R/'full-v62.md').read_text())
assert all(p==next(q for q in data['pages'] if q['id']==p['id']) for p in old['pages'] if p['id'] not in ['I','R'])
assert all(v==data[k] for k,v in old.items() if k not in ['pages','diagrams'])
assert all(v==data['diagrams'][k] for k,v in old['diagrams'].items() if k!='r2-once-race')
def script(m):
    attrs,body=m[1],m[2]
    if 'id="learning-doc-data"' in attrs: body=json.dumps({'revision':'v62','pages':{}},ensure_ascii=False)
    elif re.match(r'\s*const DATA\s*=',body): body='\nconst DATA='+json.dumps(data,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')+';\n'
    elif 'function renderModule' in body:
        assert body.count("revision: 'v61'")==body.count('我的修订-v61.html')==1
        body=body.replace("revision: 'v61'","revision: 'v62'").replace('我的修订-v61.html','我的修订-v62.html')
    return '<script'+attrs+'>'+body+'</script>'
output=re.sub(r'<script([^>]*)>([\s\S]*?)</script>',script,base)
assert output.count('<title>豆包汽车业务学习站 v61</title>')==1
output=output.replace('<title>豆包汽车业务学习站 v61</title>','<title>豆包汽车业务学习站 v62</title>',1)
with OUT.open('x') as f:f.write(output)
assert BASE.read_bytes()==baseline
assert all((HERE/k).read_bytes()==v for k,v in inputs.items())
(HERE/'build-manifest-v62.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'output':str(OUT),'chapters':{k:{a:b for a,b in v.items() if a in ['h2','h3','examples','cases','figureKeys']} for k,v in manifest['chapters'].items()}},ensure_ascii=False))
