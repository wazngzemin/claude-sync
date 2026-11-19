"""Build E with D-v66's CommonMark renderer and unchanged shared presentation."""
from pathlib import Path
from markdown_it import MarkdownIt
import re, json, hashlib, xml.etree.ElementTree as ET

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
BASE = ROOT / 'HTML/01-进行中/豆包汽车-业务学习站-v66.html'
OUT = ROOT / 'HTML/01-进行中/豆包汽车-业务学习站-v67.html'
assert not OUT.exists(), 'Never overwrite an existing HTML version'
sha = lambda b: hashlib.sha256(b).hexdigest()
baseline = BASE.read_bytes()
base = baseline.decode()
data = json.loads(re.search(r'const DATA=(.*?);\s*</script>', base, re.S)[1])
old = json.loads(json.dumps(data))
inputs = {f'part-{n}.md': (HERE / f'part-{n}.md').read_bytes() for n in [1,2,3,5,4]}
removed = []
def comment(m):
    if re.fullmatch(r'<!--\s*figure:[\w-]+\s*-->', m[0]): return m[0]
    removed.append(m[0])
    return ''
full = '\n\n'.join(re.sub(r'<!--[\s\S]*?-->', comment, b.decode()).strip('\n') for b in inputs.values()) + '\n'
(HERE / 'full.md').write_text(full)
md = MarkdownIt('commonmark', {'html': True, 'typographer': False, 'breaks': False}).enable('table')
page = next(p for p in data['pages'] if p['id'] == 'E')
strong, strong_count = re.subn(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', full, flags=re.S)
assert '**' not in strong
tokens = md.parse(strong)
headings, counts = [], {'examples': 0, 'cases': 0}
for n,t in enumerate(tokens):
    if t.type == 'heading_open':
        assert t.tag in ('h2','h3')
        title = tokens[n+1].content
        key = f'e67-heading-{len(headings)+1:02d}'
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
# Keep the shared fold styles; show the cleaned E overview in the first fold.
overview = '<details class="voice-original" id="detailed-flow"><summary>对照：工具执行全图</summary>\n<!-- figure:e-overview -->\n</details>\n'
rendered = rendered.replace(heading+'\n<details>\n<summary>',overview+'<details class="voice-original v55-archive" id="e67-history"><summary>'+heading+'\n',1)
# Match I: keep the appendix closing recap inside the history fold.
rendered = ''.join(rendered.rsplit('</details>', 1)).rstrip('\n') + '\n</details>\n'
assert rendered.count('<details ') == rendered.count('</details>') == 2
keys = re.findall(r'<!--\s*figure:([\w-]+)\s*-->',full)
titles,subtitles,figure_audit = {},{},[]
for key in dict.fromkeys(keys):
    f = HERE / ('figures' if key.startswith('e2-') else 'figures-orig') / (key+'.svg')
    svg = f.read_text()
    changes = []
    root = ET.fromstring(svg)
    texts = [''.join(el.itertext()) for el in root.iter() if el.tag.rsplit('}',1)[-1] in ['text','title','desc']]
    if key.startswith('e2-'):
        meta=json.loads(f.with_suffix('.json').read_text())
    else:
        visible=[''.join(el.itertext()) for el in root.iter() if el.tag.rsplit('}',1)[-1]=='text']
        meta={'title':root.find('{http://www.w3.org/2000/svg}title').text,'subtitle':visible[1]}
        assert meta['title']==visible[0]
    labels=[value for el in root.iter() for attr,value in el.attrib.items() if attr in ['aria-label','title','alt']]
    comments=re.findall(r'<!--([\s\S]*?)-->',svg)
    all_text='\n'.join(texts+labels+comments+[meta['title'],meta['subtitle']])
    banned=re.findall(r'来源|小模型|本地模型|PRD|技术方案|口径|待确认|DT|OnePage|明骏|黄赌毒|待定|开发中|路测日期|日期',all_text)
    assert not banned,(key,banned)
    assert not re.search(r'20\d{2}\s*年|\d{1,2}\s*月|\d{1,2}/\d{1,2}',all_text),(key,'date annotation')
    assert not re.search(r'来源|20\d{2}[ 年./-]|\d{1,2}月\d{1,2}日|\d{1,2}/\d{1,2}',meta['title']+meta['subtitle'])
    titles[key],subtitles[key]=meta['title'],meta['subtitle']
    data['diagrams'][key] = svg
    figure_audit.append({'figure':key,'sha256':sha(svg.encode()),'textNodes':len(texts),'bannedMatches':banned,'changes':changes})
page['title']='E · 工具执行与回流：从交出动作到带回真实结果'
page['summary']='Planner 交出动作以后，工具找到这辆车的实现，执行并带回实际结果；云端收齐这一批，再交回 Planner 继续判断。'
page['scenario']='主驾说“我好热，顺便找个附近能停车的咖啡店”。查车况、开空调、调风量和搜咖啡店分别交办，再逐项带回真实结果。'
page['v55'] = {'html':rendered,'headings':headings,'figureTitles':titles,'figureSubtitles':subtitles}
page.pop('v34',None);page['sections']=[];page['teaching']={'intro':[],'lessons':[],'closing':[]}
for field in ['flows','cases','terms','questions','metrics','roadmap','related','referenceTables','mainline','concepts']:
    if field in page: page[field]=[]
# Preserve inbound section links while making their destination a new heading.
target_groups = {
 '开篇、Planner 交出四个动作以后':['e-map','e-lesson-1','e-action'],
 '一、动作交出去以后，谁接手':['e-s1','e-permit'],
 '二、同一个工具名，怎样找到这辆车的实现':['e-s2','e-routing'],
 '三、按工具家族，看清谁在干活、各回什么':['e-lesson-3'],
 '四、车控：一句话怎样变成车能执行的函数，以及不经过 Planner 的快路':['e-plan-check'],
 '五、下发到车，车上回话':['e-s3'],
 '六、回执怎样变成 Planner 读到的那句话':['e-s4','e-plan-dm','e-lesson-2','e-result'],
 '七、一批结果怎样收齐，超时和重复怎么办':['e-s5','e-plan-async','e-return'],
 '八、谁来说结果：车控播报和不支持的指令':['e-lesson-4'],
 '九、执行这一侧的假成功':['e-plan-fake'],
 '十、问题反馈工具：一个要走好几步的应用工具':['e-lesson-5'],
 '十一、怎么排查':['e-toolbox'],
 '收尾、沿着四个动作，把执行这一侧讲给别人听':['e-recap','e-retell'],
 '附一　术语表':['e-glossary'],
}

targets={key:next(h['id'] for h in headings if h['title']==title) for title,keys_ in target_groups.items() for key in keys_}
targets['e-original']='detailed-flow'
old_e = next(p for p in old['pages'] if p['id']=='E')
old_html = old_e.get('v34',{}).get('intro','') + ''.join(s.get('html','') for s in old_e.get('v34',{}).get('sections',[]))
old_ids = re.findall(r'\bid=[\"\']([^\"\']+)',old_html)
old_ids += [s['id'] for s in old_e.get('v34',{}).get('sections',[])]
old_ids += [s['id'] for s in old_e.get('sections',[])]
old_ids += [s['id'] for s in old_e.get('teaching',{}).get('lessons',[])]
for key in old_ids: targets.setdefault(key,headings[0]['id'])
page['legacyChapterTargets']={**{k:targets.get(v,headings[0]['id']) for k,v in page.get('legacyChapterTargets',{}).items()},**targets}
assert all(p==next(q for q in data['pages'] if q['id']==p['id']) for p in old['pages'] if p['id']!='E')
assert all(v==data[k] for k,v in old.items() if k not in ['pages','diagrams'])
assert all(v==data['diagrams'][k] for k,v in old['diagrams'].items() if k not in keys)
def script(m):
    attrs,body=m[1],m[2]
    if 'id="learning-doc-data"' in attrs: body=json.dumps({'revision':'v67','pages':{}},ensure_ascii=False)
    elif re.match(r'\s*const DATA\s*=',body): body='\nconst DATA='+json.dumps(data,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')+';\n'
    elif 'function renderModule' in body:
        assert body.count("revision: 'v66'")==body.count('我的修订-v66.html')==1
        body=body.replace("revision: 'v66'","revision: 'v67'").replace('我的修订-v66.html','我的修订-v67.html')
    return '<script'+attrs+'>'+body+'</script>'
output=re.sub(r'<script([^>]*)>([\s\S]*?)</script>',script,base)
assert output.count('<title>豆包汽车业务学习站 v66</title>')==1
output=output.replace('<title>豆包汽车业务学习站 v66</title>','<title>豆包汽车业务学习站 v67</title>',1)
with OUT.open('x') as f: f.write(output)
assert BASE.read_bytes()==baseline
assert all((HERE/k).read_bytes()==v for k,v in inputs.items())
manifest={'base':str(BASE),'output':str(OUT),'baselineSha256':sha(baseline),'outputSha256':sha(output.encode()),'removedComments':removed,'inputsSha256':{k:sha(v) for k,v in inputs.items()},'sourceSha256':sha(full.encode()),'browserStarted':False,'h2':sum(h['level']==2 for h in headings),'h3':sum(h['level']==3 for h in headings),'headings':headings,'figureKeys':keys,'overviewFigure':'e-overview','uniqueFigureKeys':list(dict.fromkeys(keys)),'strongCount':strong_count,**counts,'figureAudit':figure_audit}
(HERE/'build-manifest-v67.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:manifest[k] for k in ['output','h2','h3','examples','cases','figureKeys']},ensure_ascii=False))
