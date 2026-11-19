"""Build M with W-v63's CommonMark renderer and unchanged shared presentation."""
from pathlib import Path
from markdown_it import MarkdownIt
import re, json, hashlib, xml.etree.ElementTree as ET

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
BASE = ROOT / 'HTML/01-进行中/豆包汽车-业务学习站-v63.html'
OUT = ROOT / 'HTML/01-进行中/豆包汽车-业务学习站-v64.html'
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
page = next(p for p in data['pages'] if p['id'] == 'M')
strong, strong_count = re.subn(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', full, flags=re.S)
assert '**' not in strong
tokens = md.parse(strong)
headings, counts = [], {'examples': 0, 'cases': 0}
for n,t in enumerate(tokens):
    if t.type == 'heading_open':
        assert t.tag in ('h2','h3')
        title = tokens[n+1].content
        key = f'm64-heading-{len(headings)+1:02d}'
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
# Keep the shared fold styles; show the cleaned M overview in the first fold.
overview = '<details class="voice-original" id="detailed-flow"><summary>对照：输入管理全图</summary>\n<!-- figure:m-overview -->\n</details>\n'
rendered = rendered.replace(heading+'\n<details>\n<summary>',overview+'<details class="voice-original v55-archive" id="m64-history"><summary>'+heading+'\n',1)
# Match I: keep the appendix closing recap inside the history fold.
rendered = ''.join(rendered.rsplit('</details>', 1)).rstrip('\n') + '\n</details>\n'
assert rendered.count('<details ') == rendered.count('</details>') == 2
keys = re.findall(r'<!--\s*figure:([\w-]+)\s*-->',full)
titles,subtitles,figure_audit = {},{},[]
for key in dict.fromkeys(keys):
    f = HERE / ('figures' if key.startswith('m2-') else 'figures-orig') / (key+'.svg')
    svg = f.read_text()
    changes = []
    if key == 'm-evolution':
        before = '从“各管各的”到统一输入管理：2026 年的几次转折'
        after = '从“各管各的”到统一输入管理：几次转折'
        assert svg.count(before) == 3
        svg = svg.replace(before, after)
        changes.append({'before':before,'after':after,'occurrences':3,'reason':'remove date from title, including aria-label/title/text'})
        adjusted = HERE / 'figures-v64'; adjusted.mkdir(exist_ok=True)
        (adjusted / f.name).write_text(svg)
    for word in ['小模型','本地模型']:
        count=svg.count(word)
        if count:
            svg=svg.replace(word,'车上的 1.7B 模型')
            changes.append({'before':word,'after':'车上的 1.7B 模型','occurrences':count})
    root = ET.fromstring(svg)
    texts = [''.join(el.itertext()) for el in root.iter() if el.tag.rsplit('}',1)[-1] in ['text','title','desc']]
    if key.startswith('m2-'):
        meta=json.loads(f.with_suffix('.json').read_text())
    else:
        visible=[''.join(el.itertext()) for el in root.iter() if el.tag.rsplit('}',1)[-1]=='text']
        meta={'title':root.find('{http://www.w3.org/2000/svg}title').text,'subtitle':visible[1]}
        assert meta['title']==visible[0]
    all_text='\n'.join(texts+[meta['title'],meta['subtitle']])
    banned=re.findall(r'小模型|本地模型|PRD|技术方案|口径|待确认|\bDT\b|\bChat\b',all_text)
    assert not banned,(key,banned)
    assert not re.search(r'来源|20\d{2}[ 年./-]|\d{1,2}月\d{1,2}日|\d{1,2}/\d{1,2}',meta['title']+meta['subtitle'])
    titles[key],subtitles[key]=meta['title'],meta['subtitle']
    data['diagrams'][key] = svg
    figure_audit.append({'figure':key,'sha256':sha(svg.encode()),'textNodes':len(texts),'bannedMatches':banned,'changes':changes})
page['v55'] = {'html':rendered,'headings':headings,'figureTitles':titles,'figureSubtitles':subtitles}
page.pop('v34',None);page['sections']=[];page['teaching']={'intro':[],'lessons':[],'closing':[]}
for field in ['flows','cases','terms','questions','metrics','roadmap','related','referenceTables','mainline','concepts']:
    if field in page: page[field]=[]
# Preserve inbound section links while making their destination a new heading.
target_groups = {
 '开篇、车里只有一个豆包':['m-map','m-lesson-1'],
 '二、四路输入先报上名来':['m-s1'],
 '三、看对话现在在干什么':['m-s2','m-lesson-2'],
 '四、谁先进 Planner：准入':['m-s3','m-lesson-3','m-plan-p1'],
 '五、动作发出去了，旧话就不能重来':['m-plan-replay'],
 '六、这一轮交给 Planner 的是什么':['m-s4'],
 '七、谁的话能放出去：执行身份与许可':['m-s5'],
 '八、播完才算完':['m-s6'],
 '九、演进与灰度':['m-plan-evo'],
 '十、怎么评估、怎么排查':['m-toolbox','m-lesson-4'],
 '收尾、用找充电站，把这一章讲给别人听':['m-recap','m-retell'],
 '附一　术语表':['m-glossary'],
}
targets={key:next(h['id'] for h in headings if h['title']==title) for title,keys_ in target_groups.items() for key in keys_}
targets['m-original']='detailed-flow'
page['legacyChapterTargets']={**{k:targets.get(v,headings[0]['id']) for k,v in page.get('legacyChapterTargets',{}).items()},**targets}
assert all(p==next(q for q in data['pages'] if q['id']==p['id']) for p in old['pages'] if p['id']!='M')
assert all(v==data[k] for k,v in old.items() if k not in ['pages','diagrams'])
assert all(v==data['diagrams'][k] for k,v in old['diagrams'].items() if k not in keys)
def script(m):
    attrs,body=m[1],m[2]
    if 'id="learning-doc-data"' in attrs: body=json.dumps({'revision':'v64','pages':{}},ensure_ascii=False)
    elif re.match(r'\s*const DATA\s*=',body): body='\nconst DATA='+json.dumps(data,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')+';\n'
    elif 'function renderModule' in body:
        assert body.count("revision: 'v63'")==body.count('我的修订-v63.html')==1
        body=body.replace("revision: 'v63'","revision: 'v64'").replace('我的修订-v63.html','我的修订-v64.html')
    return '<script'+attrs+'>'+body+'</script>'
output=re.sub(r'<script([^>]*)>([\s\S]*?)</script>',script,base)
assert output.count('<title>豆包汽车业务学习站 v63</title>')==1
output=output.replace('<title>豆包汽车业务学习站 v63</title>','<title>豆包汽车业务学习站 v64</title>',1)
with OUT.open('x') as f: f.write(output)
assert BASE.read_bytes()==baseline
assert all((HERE/k).read_bytes()==v for k,v in inputs.items())
manifest={'base':str(BASE),'output':str(OUT),'baselineSha256':sha(baseline),'outputSha256':sha(output.encode()),'removedComments':removed,'inputsSha256':{k:sha(v) for k,v in inputs.items()},'sourceSha256':sha(full.encode()),'browserStarted':False,'h2':sum(h['level']==2 for h in headings),'h3':sum(h['level']==3 for h in headings),'headings':headings,'figureKeys':keys,'overviewFigure':'m-overview','uniqueFigureKeys':list(dict.fromkeys(keys)),'strongCount':strong_count,**counts,'figureAudit':figure_audit}
(HERE/'build-manifest-v64.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:manifest[k] for k in ['output','h2','h3','examples','cases','figureKeys']},ensure_ascii=False))
