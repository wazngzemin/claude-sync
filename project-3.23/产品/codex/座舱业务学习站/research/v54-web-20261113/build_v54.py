from pathlib import Path
from html import escape
import re,json,copy,hashlib,sys
from markdown_it import MarkdownIt
from lxml import html as LH

ROOT=Path('/Users/bytedance/Desktop/3.23/产品/codex')
HERE=Path(__file__).parent
RESEARCH=ROOT/'座舱业务学习站/research/v54-5w2h-20261113'
BASE=ROOT/'HTML/01-进行中/豆包汽车-业务学习站-v52.html'
TARGET=ROOT/'HTML/01-进行中/豆包汽车-业务学习站-v54.html'
MD=MarkdownIt('commonmark',{'html':True}).enable('table')
sources=json.loads((HERE/'source-index.json').read_text())
md=(RESEARCH/'content.md').read_text()
# A re-run replaces only the explicitly generated reference tables.
md=re.sub(r'\n<!--v54-unit-sources:start-->.*?<!--v54-unit-sources:end-->\n','\n',md,flags=re.S)
matches=list(re.finditer(r'^## (\d+)\. (.+)$',md,re.M))
assert [int(m[1]) for m in matches]==list(range(21))
preamble=md[:matches[0].start()]
units=[]
for n,m in enumerate(matches):
    full=md[m.start():matches[n+1].start() if n+1<len(matches) else len(md)]
    body=full[m.end()-m.start():].strip()
    core,historical=body.split('### 旧资料与历史口径（不用背，查的时候看）',1)
    # Diagram prose is replaced by its SVG, without rewriting the teaching text.
    core=re.sub(r'^# 用户已确认的样稿：.*\n','',core,flags=re.M)
    d=re.search(r'^#{2,3} 配图[^\n]*\n(.*?)(?=^#{2,3} 第一步)',core,re.M|re.S)
    assert d,(n,'missing drawing description')
    diagram_description=d[1].strip();core=core[:d.start()]+core[d.end():]
    units.append({'unit':n,'title':m[2],'core':core.strip(),'historical':historical.strip(),'diagram_description':diagram_description,'original_full':full})

REF=re.compile(r'V\d{2}-[FUC]\d+(?:(?:[–—~～-](?:V\d{2}-)?[FUC]?\d+)|(?:[/、][FUC]?\d+))*|LAT-F\d+')
def expand(raw):
    if raw.startswith('LAT-'):return [raw]
    m=re.match(r'(V\d{2}-)([FUC])(\d+)',raw);prefix,kind,start=m.groups();ids=[prefix+kind+start]
    rest=raw[m.end():]
    if rest and rest[0] in '–—~～-':
        end=re.search(r'(\d+)$',rest)[1];ids=[prefix+kind+str(i).zfill(len(start)) for i in range(int(start),int(end)+1)]
    elif rest:
        for piece in re.split('[/、]',rest)[1:]:
            z=re.match(r'([FUC])?(\d+)',piece);ids.append(prefix+(z[1] or kind)+z[2])
    return ids
def refs(text):
    result=[]
    for match in REF.finditer(text):result.extend(expand(match[0]))
    return list(dict.fromkeys(result))
def h(s):return escape(str(s),quote=True)
def loc_text(loc):return str(loc.get('url') or loc.get('path') or loc.get('label',''))+((':'+str(loc['line'])) if loc.get('line') else '')
def source_md_row(id):
    s=sources[id]
    locs=[x for x in s['source_locations'] if not x.get('fallback')] or s['source_locations']
    clean=lambda x:str(x).replace('|','\\|').replace('\n',' ')
    return '| '+' | '.join(map(clean,[id,s['source_title'],'；'.join(loc_text(x) for x in locs),s['status']]))+' |'
for u in units:
    used=refs(u['core'])
    # The verbatim approved sample has no inline IDs; its complete ledger is listed here.
    if u['unit']==4:used+=sorted(k for k in sources if k.startswith('V04-'))
    used=list(dict.fromkeys(used))
    assert all(k in sources for k in used),(u['unit'],[k for k in used if k not in sources])
    u['source_ids']=used
    source_md='\n<!--v54-unit-sources:start-->\n\n### 本单元引用来源\n\n| 编号 | 来源文档名 | 链接或文件路径及位置 | 状态 |\n|---|---|---|---|\n'+'\n'.join(source_md_row(k) for k in used)+'\n\n<!--v54-unit-sources:end-->\n'
    full=u['original_full'].replace('### 旧资料与历史口径（不用背，查的时候看）',source_md+'\n### 旧资料与历史口径（不用背，查的时候看）',1)
    u['updated_full']=full
(RESEARCH/'content.md').write_text(preamble+''.join(u['updated_full'] for u in units))

def superscript(raw,unit):
    ids=refs(raw)
    return ''.join(f'<sup class="v54-cite"><a href="#module/V/section/v54-source-{unit}-{id}" data-scroll-to="v54-source-{unit}-{id}" aria-label="来源 {id}：{h(sources[id]["source_title"])}">{id}</a></sup>' for id in ids)
def citationize(text,unit):
    placeholders=[]
    def hold(raw):
        mark=f'V54CITATIONPLACEHOLDER{len(placeholders)}END';placeholders.append(superscript(raw,unit));return mark
    text=re.sub(r'\[([^\]\n]+)\]',lambda m:hold(m[1]) if refs(m[1]) else m[0],text)
    text=REF.sub(lambda m:hold(m[0]),text)
    for i,s in enumerate(placeholders):text=text.replace(f'V54CITATIONPLACEHOLDER{i}END',s)
    return text
def teaching_markup(text,unit):
    text=re.sub(r'^\*\*[1-7]\.\s*((?:What|Why|Who|When|Where|How)[^*]+)\*\*',lambda m:'### '+m[1].strip()+'\n',text,flags=re.M)
    text=re.sub(r'^#{2,6}\s+', '### ',text,flags=re.M)
    return MD.render(citationize(text,unit))
def source_html(unit,ids):
    rows=[]
    for id in ids:
        s=sources[id];locs=[]
        for loc in s['source_locations']:
            target=loc.get('url') or loc.get('path')
            if not target:locs.append(h(loc.get('label','来源说明')));continue
            # Paths stay readable and copyable; file links are valid for the delivered local page.
            href=target if loc.get('url') else Path(target).as_uri()
            locs.append('<a href="'+h(href)+'" target="_blank" rel="noopener noreferrer">'+h(loc_text(loc))+'</a>')
        rows.append(f'<tr id="v54-source-{unit}-{id}" tabindex="-1"><th scope="row">{h(id)}</th><td>{h(s["source_title"])}</td><td>'+ '<br>'.join(locs)+f'</td><td><span class="v54-source-status">{h(s["status"])}</span></td></tr>')
    return '<div class="v54-source-list"><h3>本单元引用来源</h3><div class="table-scroll"><table><thead><tr><th>编号</th><th>来源文档名</th><th>链接或文件路径及位置</th><th>状态</th></tr></thead><tbody>'+''.join(rows)+'</tbody></table></div></div>'

old_map={0:['v34-overview','original-V'],4:['v34-hotword'],5:['v34-timing'],7:['v45-bargein'],10:['v34-edge'],13:['v34-memory'],14:['v34-h2h'],15:['v34-poi','v34-seat']}
old_titles={'v34-overview':'一句话从开口到 DT 开始思考：12 个步骤','v34-hotword':'热词：从哪来、在哪一步起作用、管不到什么','v34-timing':'补了一句话：判停计时、提前准备和正式提交怎样对上','v34-memory':'DT 拿到的“过去”：历史输入、摘要记忆、短期与长期记忆','v34-edge':'车上自己办，还是交给云端：本地链路与端云仲裁','v34-h2h':'人人对话怎样被记下来：两种状态，两条上报路线','v45-bargein':'同一句话，判断了四次：过程文字时间线','v34-poi':'“记住我家”：先把地点查准再记，以后“导航回家”不用再选点','v34-seat':'“记住我的驾驶位置”：车机存位置，豆包只记“哪个位置是干什么的”','original-V':'V 章原始完整 18 节点图'}
def marker(key,title):return '<!--v54-original-->' if key=='original-V' else '<!--fig:'+key+'|'+title+'-->'
diagrams=json.loads((HERE/'new-diagrams.json').read_text()) if (HERE/'new-diagrams.json').exists() else []
by_unit={d['unit']:d for d in diagrams}
if not diagrams:
    print('content.md 已补来源列表，等待 new-diagrams.json');sys.exit(0)
assert len(diagrams)==20
base_text=BASE.read_text();match=re.search(r'const DATA\s*=\s*',base_text);baseline,end=json.JSONDecoder().raw_decode(base_text[match.end():]);data=copy.deepcopy(baseline)
vp=next(x for x in data['pages'] if x['id']=='V');sections=[];manifest=[]
for u in units:
    n=u['unit'];main=teaching_markup(u['core'],n)
    # Keep every teaching block visible. Only the history archive uses details.
    parsed=LH.fragment_fromstring(main,create_parent='div')
    reference=next((x for x in parsed if x.tag=='h3' and (x.text_content().startswith('查阅区'))),None)
    if reference is not None:
        idx=list(parsed).index(reference);reference_div=LH.Element('div',{'class':'v54-reference','aria-label':'查阅区'})
        for el in list(parsed)[idx:]:reference_div.append(el)
        parsed.append(reference_div)
    else:
        reference_div=LH.Element('div',{'class':'v54-reference','aria-label':'查阅区'});parsed.append(reference_div)
    reference_div.append(LH.fragment_fromstring(source_html(n,u['source_ids']),create_parent=False))
    old=old_map.get(n,[])
    main_fig=marker('v34-overview',old_titles['v34-overview']) if n==0 else marker(by_unit[n]['key'],by_unit[n]['title'])
    extra_old=[k for k in old if k!='v34-overview']
    old_html=''
    if extra_old:
        old_html='<div class="v54-original-diagrams"><h3>原流程图对照</h3>'+''.join(marker(k,old_titles[k]) for k in extra_old)+'</div>'
    history_html=teaching_markup(u['historical'],n)
    # References inside archived material point to this unit's source list too.
    historic_ids=refs(u['historical']);missing=[x for x in historic_ids if x not in u['source_ids']]
    if missing:
        u['source_ids']+=missing
        source_el=reference_div.find('.//div[@class="v54-source-list"]');source_el.getparent().replace(source_el,LH.fragment_fromstring(source_html(n,u['source_ids']),create_parent=False))
    main_html=''.join(LH.tostring(x,encoding='unicode') for x in parsed)
    archive=f'<details class="v49-detail v54-history" id="v54-history-{n}"><summary>旧资料与历史口径（不用背，查的时候看）</summary><div class="v49-detail-body">{history_html}</div></details>'
    section_html=main_fig+'<div class="v54-unit-body">'+main_html+'</div>'+old_html+archive
    sections.append({'id':f'v54-unit-{n:02d}','title':f'{n}. '+u['title'],'html':section_html})
    keys=(['v34-overview'] if n==0 else [by_unit[n]['key']])+extra_old
    manifest.append({'unit':n,'title':f'{n}. '+u['title'],'id':f'v54-unit-{n:02d}','svg_keys':keys,'svg_count':len(keys),'source_ids':u['source_ids'],'details_count':1,'seven_questions':len(re.findall(r'^\*\*[1-7]\.\s*(?:What|Why|Who|When|Where|How)',u['core'],re.M))})
    u['main_html']=main_html

intro=re.sub(r'^# [^\n]+\n','',preamble,1).strip()
vp['title']='V · 一句话怎样被听完整、办正确，并成为下一轮可用的背景'
vp['shortTitle']='语音、模型与记忆的业务交接'
vp['v54']={'version':54,'format':'5W2H','unitCount':21}
vp['v34']={'intro':MD.render(citationize(intro,0)),'sections':sections}
vp['sections']=[{'id':s['id'],'title':s['title'],'paragraphs':[u['core']],'sourceIds':[]} for s,u in zip(sections,units)]
vp['teaching']={'intro':[],'lessons':vp['sections'],'guides':{},'closing':[],'sourceIds':vp.get('sourceIds',[])}
vp.pop('voiceEdition',None);vp['legacyChapterTargets']={}
for d in diagrams:data['diagrams'][d['key']]=d['svg']
data['meta']['version']='v54-5w2h';data['meta']['previousVersion']='v52';data['meta']['validation']='脚本与JSDOM自查；未启动浏览器，视觉验收交Claude。'
serialized=json.dumps(data,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')
page=base_text[:match.end()]+serialized+base_text[match.end()+end:]
page=page.replace('<title>豆包汽车业务学习站 v52</title>','<title>豆包汽车业务学习站 v54</title>',1)
page=page.replace('"revision":"v52","pages":{}','"revision":"v54","pages":{}',1)
page=page.replace("{ revision: 'v52', pages: {} }","{ revision: 'v54', pages: {} }",1)
page=page.replace("link.download = '豆包汽车-业务学习站-我的修订-v52.html';","link.download = '豆包汽车-业务学习站-我的修订-v54.html';",1)
render='''
 function renderVoiceV54(page,module){
  const v=page.v34;
  function body(h){return h.replace(/<!--fig:([\\w-]+)\\|([^>]*?)-->/g,(m,key,title)=>figure({key,title,svg:DATA.diagrams[key],pageId:page.id,voiceLesson:true}))
   .replace('<!--v54-original-->',()=>figure({key:'v54-original-V',title:'V 章原始完整 18 节点图',svg:DATA.originalSvg,crop:[module.x-35,module.y-35,module.w+70,module.h+70],pageId:'V'}));}
  let out=heading(page.title,'',{crumbs:[{label:page.shortTitle}]});
  out+='<nav class="v34-toc" aria-label="本章目录"><b>本章目录</b><ol>'+v.sections.map(s=>'<li><a href="'+routeHref('module','V','section',s.id)+'" data-scroll-to="'+esc(s.id)+'">'+esc(s.title)+'</a></li>').join('')+'</ol></nav>';
  out+='<article class="voice-lesson v34 v54" id="chapter-reading"><div class="voice-opening">'+v.intro+'</div>';
  out+=v.sections.map(s=>section(s.id,s.title,'<div class="voice-prose">'+body(s.html)+'</div>')).join('');
  return out+'</article>';
 }
'''
needle=' function renderModule(id) {'
assert page.count(needle)==1;page=page.replace(needle,render+'\n'+needle)
needle=' if(page.v34)return renderVoiceV34(page,module);'
assert page.count(needle)==1;page=page.replace(needle," if(page.id==='V' && page.v54)return renderVoiceV54(page,module);\n"+needle)
css='''
<style id="v54-style">
.voice-lesson.v54 .section{scroll-margin-top:100px}
.voice-lesson.v54 .voice-prose{max-width:100%}
.voice-lesson.v54 .v54-unit-body{max-width:1000px;margin:0 auto}
.voice-lesson.v54 .v54-unit-body h3{margin:1.8em 0 .8em;line-height:1.5}
.voice-lesson.v54 .v54-unit-body p,.voice-lesson.v54 .v54-unit-body li{line-height:1.9}
.voice-lesson.v54 table{border-collapse:collapse;width:100%;font-size:.95em;line-height:1.7}
.voice-lesson.v54 th,.voice-lesson.v54 td{padding:12px 14px;border:1px solid var(--line);vertical-align:top;overflow-wrap:anywhere}
.voice-lesson.v54 th{text-align:left;background:var(--soft)}
.voice-lesson.v54 blockquote{margin:20px 0;padding:16px 24px;border-left:4px solid var(--blue);background:var(--soft);border-radius:0 10px 10px 0}
.voice-lesson.v54 blockquote p{margin:.4em 0}
.voice-lesson.v54 .v54-reference{font-size:.85em;line-height:1.7;margin-top:30px;padding:18px 0;border-top:1px solid var(--line)}
.voice-lesson.v54 .v54-source-list{margin-top:20px}
.voice-lesson.v54 .v54-source-list td:nth-child(3){font-size:.87em;max-width:480px;word-break:break-word}
.voice-lesson.v54 .v54-source-list th[scope=row]{white-space:nowrap}
.voice-lesson.v54 .v54-cite{font-size:.66em;line-height:0;vertical-align:super;margin-left:.2em}
.voice-lesson.v54 .v54-cite a{text-decoration:none;font-weight:600;white-space:nowrap}
.voice-lesson.v54 .v54-source-status{font-weight:600;white-space:nowrap}
.voice-lesson.v54 [id^=v54-source-]{scroll-margin-top:110px}
.voice-lesson.v54 .v54-history{margin-top:24px;font-size:.9em}
.voice-lesson.v54 .v54-history>summary{cursor:pointer;font-weight:600;padding:16px}
.voice-lesson.v54 .v54-history .v49-detail-body{padding:0 18px 18px;overflow-wrap:anywhere}
.voice-lesson.v54 .v54-original-diagrams{margin:24px 0}
.voice-lesson.v54 .flow-figure{margin-top:14px}
@media(max-width:700px){.voice-lesson.v54 table{font-size:.88em}.voice-lesson.v54 th,.voice-lesson.v54 td{padding:9px}.voice-lesson.v54 .v54-source-list .table-scroll{overflow-x:auto}.voice-lesson.v54 .v54-source-list table{min-width:680px}}
</style>
'''
page=page.replace('</head>',css+'</head>',1)
(HERE/'candidate-page.json').write_text(json.dumps({'html':page},ensure_ascii=False))
(HERE/'candidate-data.json').write_text(json.dumps(data,ensure_ascii=False))
(HERE/'unit-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
(HERE/'render-inputs.json').write_text(json.dumps(units,ensure_ascii=False,indent=2))
assert all(x==next(y for y in data['pages'] if y['id']==x['id']) for x in baseline['pages'] if x['id']!='V')
assert data['originalSvg']==baseline['originalSvg']
assert all(data['diagrams'][k]==s for k,s in baseline['diagrams'].items())
if '--publish' in sys.argv:
    verification=json.loads((HERE/'verification.json').read_text())
    assert verification['passed'] and verification['candidate_sha256']==hashlib.sha256(page.encode()).hexdigest()
    with TARGET.open('x') as f:f.write(page)
    print('已创建',TARGET)
print(json.dumps({'units':len(units),'new_svg':len(diagrams),'total_v_svg':sum(x['svg_count'] for x in manifest),'other_pages_unchanged':23,'candidate_sha256':hashlib.sha256(page.encode()).hexdigest()},ensure_ascii=False))
