"""Mechanical Markdown delivery. Never launch a browser or overwrite a version."""
from pathlib import Path
import re, json, hashlib
from markdown_it import MarkdownIt

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
BASE = ROOT / 'HTML/01-进行中/豆包汽车-业务学习站-v52.html'
OUT = ROOT / 'HTML/01-进行中/豆包汽车-业务学习站-v55.html'
assert not OUT.exists(), 'v55 already exists; do not overwrite a version'
names = ['content.md', 'part-08.md', 'part-09.md', 'part-10-11.md', 'part-12-13.md', 'part-99.md']
inputs = {name: (HERE / name).read_text() for name in names}
removed = []
def clean_comment(match):
    if re.fullmatch(r'<!--\s*figure:[\w-]+\s*-->', match[0]):
        return match[0]
    removed.append(match[0])
    return ''
full = '\n\n'.join(re.sub(r'<!--[\s\S]*?-->', clean_comment, inputs[name]).strip('\n') for name in names) + '\n'
(HERE / 'full.md').write_text(full)
md = MarkdownIt('commonmark', {'html': True, 'typographer': False, 'breaks': False}).enable('table')
tokens = md.parse(full)
headings = []
for i, token in enumerate(tokens):
    if token.type == 'heading_open':
        text = tokens[i + 1].content
        if token.tag == 'h1':
            title = text
        else:
            assert token.tag in ('h2', 'h3')
            ident = f'v55-heading-{len(headings) + 1:02d}'
            token.attrSet('id', ident)
            token.attrSet('data-section-title', text)
            headings.append({'id': ident, 'level': int(token.tag[1]), 'title': text})
reference = md.render(full)
rendered = md.renderer.render(tokens, md.options, {})
assert rendered.startswith('<h1>')
rendered = re.sub(r'^<h1>.*?</h1>\n', '', rendered, count=1)
# A table's own scroll container keeps its intrinsic width inside the column.
rendered = rendered.replace('<table>', '<div class="voice-table-scroll" tabindex="0"><table>').replace('</table>', '</table></div>')
annex = next(h for h in headings if h['title'] == '附二　历史资料与待核对事项')
annex_open = re.search(r'<h2\b[^>]*id="' + annex['id'] + r'"[^>]*>.*?</h2>', rendered)[0]
# Keep the original h2 exactly once, as the native disclosure's heading.
rendered = rendered.replace(annex_open, '<!--original-v55--><details class="voice-original v55-archive" id="v55-history"><summary>' + annex_open + '</summary>', 1) + '</details>'
base = BASE.read_text()
data_match = re.search(r'const DATA=(.*?);\s*</script>', base, re.S)
data = json.loads(data_match[1])
page = next(p for p in data['pages'] if p['id'] == 'V')
figure_titles = dict(re.findall(r'<!--fig:([\w-]+)\|([^>]*?)-->', json.dumps(page, ensure_ascii=False)))
figure_keys = re.findall(r'<!--\s*figure:([\w-]+)\s*-->', full)
assert set(figure_keys) == set(figure_titles) and len(figure_keys) == 9
page['title'] = title
page['v55'] = {'html': rendered, 'headings': headings, 'figureTitles': figure_titles}
# Remove former V teaching text from the rendered/searchable chapter data.
page['v34'] = {'intro': '', 'sections': []}
page['sections'] = []
page['teaching'] = {'intro': [], 'lessons': [], 'closing': []}
page.pop('voiceEdition', None)
page['legacyChapterTargets'] = {}

render_function = r'''
 function renderVoiceV55(page,module){
  const lesson=page.v55;
  const body=lesson.html.replace(/<!--\s*figure:([\w-]+)\s*-->/g,(_,key)=>figure({key,title:lesson.figureTitles[key],svg:DATA.diagrams[key],pageId:'V',voiceLesson:true}))
   .replace('<!--original-v55-->',()=>'<details class="voice-original" id="detailed-flow"><summary>对照：原始 18 节点全图</summary>'+figure({key:'base-V',title:'V 章原始完整节点图',svg:DATA.originalSvg,crop:[module.x-35,module.y-35,module.w+70,module.h+70],pageId:'V'})+'</details>');
  return heading(page.title,'',{crumbs:[{label:page.shortTitle||page.title}]})+
   '<nav class="v55-chapter-toc" aria-label="本章目录"><b>本章目录</b><ol>'+lesson.headings.map(h=>'<li data-level="'+h.level+'"><a data-v55-target="'+h.id+'" href="'+routeHref('module','V','section',h.id)+'">'+esc(h.title)+'</a></li>').join('')+'</ol></nav>'+
   '<article class="voice-lesson v34 voice-v55" id="chapter-reading">'+body+'</article>';
 }
 function revealSection(target){
  if(!target)return;
  if(target.tagName==='DETAILS')target.open=true;
  for(let parent=target.parentElement;parent;parent=parent.parentElement)if(parent.tagName==='DETAILS')parent.open=true;
  target.scrollIntoView?.({block:'start',behavior:'auto'});
 }
'''
search_branch = r'''
 if(id==='V' && page.v55){
  const holder=document.createElement('div');holder.innerHTML=page.v55.html;
  holder.querySelectorAll('summary').forEach(s=>{if(!s.querySelector('h2,h3'))s.remove();});
  const hs=[...holder.querySelectorAll('h2[id],h3[id]')];
  hs.forEach((h,i)=>{
   const end=hs.slice(i+1).find(next=>h.tagName==='H3'||next.tagName==='H2');
   const range=document.createRange();range.setStartAfter(h);
   if(end)range.setEndBefore(end);else range.setEnd(holder,holder.childNodes.length);
   index.push({type:'chapter',title:h.textContent,body:range.toString(),href:routeHref('module',id,'section',h.id),id:h.id,moduleId:id});
  });
  index.push({type:'module',title:page.title,shortTitle:titleOf(id),body:holder.textContent,href:routeHref('module',id),id,moduleId:id});
  return;
 }
'''
scripts = list(re.finditer(r'<script([^>]*)>([\s\S]*?)</script>', base))
app = next(m[2] for m in scripts if 'function renderModule' in m[2])
def replace_once(old, new):
    global app
    assert app.count(old) == 1, (old[:80], app.count(old))
    app = app.replace(old, new, 1)
replace_once(' function renderModule(id) {', render_function + '\n function renderModule(id) {')
replace_once(' if(page.v34)return renderVoiceV34(page,module);', " if(page.v55)return renderVoiceV55(page,module);\n if(page.v34)return renderVoiceV34(page,module);")
replace_once(" if(id==='V' && page.v34){", search_branch + "\n if(id==='V' && page.v34){")
replace_once(" const sections = $$('section[data-section-title]', root).filter(item => !item.closest('.reference-archive'));", " const isV55=currentRoute.name==='module'&&currentRoute.parts[0]==='V'&&pageOf('V').v55;\n const sections = isV55 ? $$('.voice-v55 h2[id],.voice-v55 h3[id]',root).filter(h=>!h.closest('figure')) : $$('section[data-section-title]', root).filter(item => !item.closest('.reference-archive'));")
replace_once("if (scroll) { event.preventDefault(); document.getElementById(scroll.dataset.scrollTo)?.scrollIntoView({ behavior: 'auto', block: 'start' }); return; }", "if (scroll) { event.preventDefault(); revealSection(document.getElementById(scroll.dataset.scrollTo)); return; }")
replace_once("if (event.target.id === 'page-section-select' && event.target.value) document.getElementById(event.target.value)?.scrollIntoView({ block: 'start', behavior: 'auto' });", "if (event.target.id === 'page-section-select' && event.target.value) revealSection(document.getElementById(event.target.value));")
# The snapshot editor re-derives navigation from edited headings too.
replace_once("   for (const link of $$('.v34-toc a[href^=\"#\"]', root)) {", "   for(const h of $$('.voice-v55 h2[id],.voice-v55 h3[id]',root)){if(!h.closest('figure')){h.dataset.sectionTitle=h.textContent;sections.set(h.id,h.textContent);}}\n   for(const link of $$('.v55-chapter-toc [data-v55-target]',root)){if(sections.has(link.dataset.v55Target))link.textContent=sections.get(link.dataset.v55Target);}\n   for (const link of $$('.v34-toc a[href^=\"#\"]', root)) {")
app = app.replace("revision: 'v52'", "revision: 'v55'").replace('我的修订-v52.html', '我的修订-v55.html')
def replace_script(match):
    attrs, body = match[1], match[2]
    if 'id="learning-doc-data"' in attrs:
        body = json.dumps({'revision': 'v55', 'pages': {}}, ensure_ascii=False)
    elif re.match(r'\s*const DATA\s*=', body):
        body = '\nconst DATA=' + json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/') + ';\n'
    elif 'function renderModule' in body:
        body = app
    return '<script' + attrs + '>' + body + '</script>'
output = re.sub(r'<script([^>]*)>([\s\S]*?)</script>', replace_script, base)
output = output.replace('<title>豆包汽车业务学习站 v52</title>', '<title>豆包汽车业务学习站 v55</title>')
css = '''
/* v55: scope all reading changes to the replacement chapter. */
.voice-v55{min-width:0;max-width:100%;overflow-wrap:anywhere}
.voice-v55 h2,.voice-v55 h3{scroll-margin-top:110px;overflow-wrap:anywhere}
.voice-v55 h2{margin-top:2em}.voice-v55 h3{margin-top:1.6em}
.voice-v55 .voice-table-scroll{display:block;width:100%;max-width:100%;min-width:0;overflow-x:auto}
.voice-v55 .voice-table-scroll table{width:100%;min-width:640px}
.voice-v55 pre{max-width:100%;overflow-x:auto}
.voice-v55 .flow-figure{min-width:0;max-width:100%}
.voice-v55 .figure-header{flex-wrap:wrap;min-width:0}
.voice-v55 .figure-tools{max-width:100%;flex-wrap:wrap}
.voice-v55 summary h2{display:inline;font-size:inherit;margin:0;padding:0}
.v55-chapter-toc{margin:8px 0 28px;max-width:100%;overflow-wrap:anywhere}
.v55-chapter-toc ol{columns:2;column-gap:32px}.v55-chapter-toc li[data-level="3"]{margin-left:1em}
@media(max-width:760px){.v55-chapter-toc ol{columns:1}.voice-v55{width:100%}}
'''
output = output.replace('</style>', css + '</style>', 1)
OUT.write_text(output)
(HERE / 'reference-render.json').write_text(json.dumps({'html': reference, 'headings': headings, 'figures': figure_keys, 'removedComments': removed}, ensure_ascii=False, indent=2))
(HERE / 'build-manifest.json').write_text(json.dumps({'base': str(BASE), 'output': str(OUT), 'baselineSha256': hashlib.sha256(BASE.read_bytes()).hexdigest(), 'inputs': {n: hashlib.sha256(s.encode()).hexdigest() for n,s in inputs.items()}, 'fullSha256': hashlib.sha256(full.encode()).hexdigest(), 'removedComments': len(removed), 'headings': headings}, ensure_ascii=False, indent=2))
print(json.dumps({'output': str(OUT), 'h2': sum(h['level']==2 for h in headings), 'h3': sum(h['level']==3 for h in headings), 'figures': len(figure_keys), 'removedComments': len(removed)}, ensure_ascii=False))
