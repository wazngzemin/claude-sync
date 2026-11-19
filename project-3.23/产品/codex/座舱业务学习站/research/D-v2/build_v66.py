"""Build D with C-v65's CommonMark renderer and unchanged shared presentation."""
from pathlib import Path
from markdown_it import MarkdownIt
import re, json, hashlib, xml.etree.ElementTree as ET

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
BASE = ROOT / 'HTML/01-进行中/豆包汽车-业务学习站-v65.html'
OUT = ROOT / 'HTML/01-进行中/豆包汽车-业务学习站-v66.html'
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
page = next(p for p in data['pages'] if p['id'] == 'D')
strong, strong_count = re.subn(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', full, flags=re.S)
assert '**' not in strong
tokens = md.parse(strong)
headings, counts = [], {'examples': 0, 'cases': 0}
for n,t in enumerate(tokens):
    if t.type == 'heading_open':
        assert t.tag in ('h2','h3')
        title = tokens[n+1].content
        key = f'd66-heading-{len(headings)+1:02d}'
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
# Keep the shared fold styles; show the cleaned D overview in the first fold.
overview = '<details class="voice-original" id="detailed-flow"><summary>对照：Planner 全图</summary>\n<!-- figure:d-overview -->\n</details>\n'
rendered = rendered.replace(heading+'\n<details>\n<summary>',overview+'<details class="voice-original v55-archive" id="d66-history"><summary>'+heading+'\n',1)
# Match I: keep the appendix closing recap inside the history fold.
rendered = ''.join(rendered.rsplit('</details>', 1)).rstrip('\n') + '\n</details>\n'
assert rendered.count('<details ') == rendered.count('</details>') == 2
keys = re.findall(r'<!--\s*figure:([\w-]+)\s*-->',full)
titles,subtitles,figure_audit = {},{},[]
for key in dict.fromkeys(keys):
    f = HERE / ('figures' if key.startswith('d2-') else 'figures-orig') / (key+'.svg')
    svg = f.read_text()
    changes = []
    adjusted = HERE / 'figures-v66' / f.name
    if adjusted.exists():
        svg = adjusted.read_text()
        changes.append({'kind':'cleaned-copy','path':str(adjusted),'reason':'remove residual date from accessible label; see figure-review-v66.json'})
    root = ET.fromstring(svg)
    texts = [''.join(el.itertext()) for el in root.iter() if el.tag.rsplit('}',1)[-1] in ['text','title','desc']]
    if key.startswith('d2-'):
        meta=json.loads(f.with_suffix('.json').read_text())
    else:
        visible=[''.join(el.itertext()) for el in root.iter() if el.tag.rsplit('}',1)[-1]=='text']
        meta={'title':root.find('{http://www.w3.org/2000/svg}title').text,'subtitle':visible[1]}
        assert meta['title']==visible[0]
    labels=[value for el in root.iter() for attr,value in el.attrib.items() if attr in ['aria-label','title','alt']]
    comments=re.findall(r'<!--([\s\S]*?)-->',svg)
    all_text='\n'.join(texts+labels+comments+[meta['title'],meta['subtitle']])
    banned=re.findall(r'来源|小模型|本地模型|PRD|技术方案|口径|待确认|DT|OnePage|明骏|黄赌毒',all_text)
    assert not banned,(key,banned)
    assert not re.search(r'20\d{2}\s*年|\d{1,2}\s*月|\d{1,2}/\d{1,2}',all_text),(key,'date annotation')
    assert not re.search(r'来源|20\d{2}[ 年./-]|\d{1,2}月\d{1,2}日|\d{1,2}/\d{1,2}',meta['title']+meta['subtitle'])
    titles[key],subtitles[key]=meta['title'],meta['subtitle']
    data['diagrams'][key] = svg
    figure_audit.append({'figure':key,'sha256':sha(svg.encode()),'textNodes':len(texts),'bannedMatches':banned,'changes':changes})
page['title']='D · Planner 怎样想清楚、说准确、办到位'
page['summary']='Planner 接住输入和背景，安排这一轮的话与动作，再根据真实结果继续判断。'
page['scenario']='主驾说“我好热，顺便找个附近能停车的咖啡店”。Planner 要分别安排降温与找店，并准确说明两件事的进度。'
page['v55'] = {'html':rendered,'headings':headings,'figureTitles':titles,'figureSubtitles':subtitles}
page.pop('v34',None);page['sections']=[];page['teaching']={'intro':[],'lessons':[],'closing':[]}
for field in ['flows','cases','terms','questions','metrics','roadmap','related','referenceTables','mainline','concepts']:
    if field in page: page[field]=[]
# Preserve inbound section links while making their destination a new heading.
target_groups = {
 '开篇　同一句话，Planner 要同时决定说什么和做什么':['d-map','d-lesson-1'],
 '一、一次调用：收什么、交什么':['d-s1','d-input','d-intake'],
 '二、先想清楚再动手':['d-s3','d-responsibility'],
 '三、四类任务怎么分':['d-task','d-tasks'],
 '四、同一轮一起发，有依赖的下一轮再发':['d-s5','d-plan','d-feedback','d-plan-one','d-react'],
 '五、边说边办：话术、表情和语气':['d-talk','d-s4'],
 '六、不越界、不假装办成':['d-capability'],
 '七、输出出了岔子怎么兜':['d-format'],
 '八、说明书、示例和训练，各修什么':['d-s2','d-plan-hallu','d-sp','d-offline'],
 '九、怎么评测、什么时候能上线':['d-plan-eval','d-eval'],
 '十、速度、成本和路由':['d-plan-lat'],
 '十一、怎么排查':['d-toolbox'],
 '收尾　把一次交办从头讲到真正办成':['d-recap','d-retell'],
 '附一　术语表':['d-glossary'],
}

targets={key:next(h['id'] for h in headings if h['title']==title) for title,keys_ in target_groups.items() for key in keys_}
targets['d-original']='detailed-flow'
old_d = next(p for p in old['pages'] if p['id']=='D')
old_html = old_d.get('v34',{}).get('intro','') + ''.join(s.get('html','') for s in old_d.get('v34',{}).get('sections',[]))
old_ids = re.findall(r'\bid=[\"\']([^\"\']+)',old_html)
old_ids += [s['id'] for s in old_d.get('v34',{}).get('sections',[])]
old_ids += [s['id'] for s in old_d.get('sections',[])]
old_ids += [s['id'] for s in old_d.get('teaching',{}).get('lessons',[])]
for key in old_ids: targets.setdefault(key,headings[0]['id'])
page['legacyChapterTargets']={**{k:targets.get(v,headings[0]['id']) for k,v in page.get('legacyChapterTargets',{}).items()},**targets}
assert all(p==next(q for q in data['pages'] if q['id']==p['id']) for p in old['pages'] if p['id']!='D')
assert all(v==data[k] for k,v in old.items() if k not in ['pages','diagrams'])
assert all(v==data['diagrams'][k] for k,v in old['diagrams'].items() if k not in keys)
def script(m):
    attrs,body=m[1],m[2]
    if 'id="learning-doc-data"' in attrs: body=json.dumps({'revision':'v66','pages':{}},ensure_ascii=False)
    elif re.match(r'\s*const DATA\s*=',body): body='\nconst DATA='+json.dumps(data,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')+';\n'
    elif 'function renderModule' in body:
        assert body.count("revision: 'v65'")==body.count('我的修订-v65.html')==1
        body=body.replace("revision: 'v65'","revision: 'v66'").replace('我的修订-v65.html','我的修订-v66.html')
    return '<script'+attrs+'>'+body+'</script>'
output=re.sub(r'<script([^>]*)>([\s\S]*?)</script>',script,base)
assert output.count('<title>豆包汽车业务学习站 v65</title>')==1
output=output.replace('<title>豆包汽车业务学习站 v65</title>','<title>豆包汽车业务学习站 v66</title>',1)
with OUT.open('x') as f: f.write(output)
assert BASE.read_bytes()==baseline
assert all((HERE/k).read_bytes()==v for k,v in inputs.items())
manifest={'base':str(BASE),'output':str(OUT),'baselineSha256':sha(baseline),'outputSha256':sha(output.encode()),'removedComments':removed,'inputsSha256':{k:sha(v) for k,v in inputs.items()},'sourceSha256':sha(full.encode()),'browserStarted':False,'h2':sum(h['level']==2 for h in headings),'h3':sum(h['level']==3 for h in headings),'headings':headings,'figureKeys':keys,'overviewFigure':'d-overview','uniqueFigureKeys':list(dict.fromkeys(keys)),'strongCount':strong_count,**counts,'figureAudit':figure_audit}
(HERE/'build-manifest-v66.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:manifest[k] for k in ['output','h2','h3','examples','cases','figureKeys']},ensure_ascii=False))
