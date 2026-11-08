"""把 V 章和 chapters/<ID>/ 下已完成的章节合进学习站。用法：python3 build_all.py vNN [ID ...]（不写 ID 则合入所有含 content.py 和 diagrams.json 的章节）"""
import json, re, sys, copy, html, importlib.util
from pathlib import Path
HERE = Path(__file__).parent
VDIR = HERE.parent / 'v-lesson-20261106'
sys.path.insert(0, str(VDIR))
import build_v34 as B          # 复用 CSS
import content_v39 as VC
HTMLDIR = HERE.parents[2] / 'HTML' / '01-进行中'
BASE = HTMLDIR / '豆包汽车-业务学习站-v33.html'

RENDER = r"""
 function renderVoiceV34(page,module){
  const v=page.v34;
  function body(h){
   return h.replace(/<!--fig:([\w-]+)\|([^>]*?)-->/g,(m,key,title)=>figure({key,title,svg:DATA.diagrams[key],pageId:page.id,voiceLesson:true}))
    .replace('<!--original-->',()=>module?('<details class="voice-original" id="detailed-flow"><summary>展开原始节点全图</summary>'+figure({key:'base-'+page.id,title:page.id+' 章原始完整节点图',svg:DATA.originalSvg,crop:[module.x-35,module.y-35,module.w+70,module.h+70],pageId:page.id})+'</details>'):'');
  }
  let out=heading(page.title,'',{crumbs:[{label:page.shortTitle||page.title}]});
  out+='<nav class="v34-toc" aria-label="本章目录"><b>本章目录</b><ol>'+v.sections.map(s=>'<li><a href="#'+esc(s.id)+'">'+esc(s.title)+'</a></li>').join('')+'</ol></nav>';
  out+='<article class="voice-lesson v34" id="chapter-reading"><div class="voice-opening">'+v.intro+'</div>';
  out+=v.sections.map(s=>section(s.id,s.title,'<div class="voice-prose">'+body(s.html)+'</div>')).join('');
  return out+'</article>';
 }
"""

def strip(h):
    return html.unescape(re.sub(r'<[^>]+>', '', re.sub(r'<!--.*?-->', '', h)))

def load(cid):
    d = HERE / cid
    spec = importlib.util.spec_from_file_location(f'ch_{cid}', d / 'content.py')
    mod = importlib.util.module_from_spec(spec); sys.path.insert(0, str(d)); spec.loader.exec_module(mod)
    return mod, json.loads((d / 'diagrams.json').read_text())

def apply(page, intro, sections, title=None, summary=None):
    if title: page['title'] = title
    if summary: page['summary'] = summary
    page['v34'] = dict(intro=intro, sections=sections)
    page['sections'] = [dict(id=s['id'], title=s['title'], paragraphs=[strip(x) for x in re.findall(r'<p>(.*?)</p>', s['html'])], sourceIds=[]) for s in sections]

def build(ver, ids):
    raw = BASE.read_text()
    d = json.loads(re.search(r'<script>\s*const DATA=([\s\S]*?);\s*</script>', raw)[1])
    pages = {p['id']: p for p in d['pages']}
    apply(pages['V'], VC.INTRO, VC.SECTIONS, 'V · 一句话从开口到交给 DT：沿链路讲一遍')
    d['diagrams'].update(json.loads((VDIR / 'v34-diagrams.json').read_text()))
    if not ids:
        ids = [p.name for p in HERE.iterdir() if (p / 'content.py').exists() and (p / 'diagrams.json').exists()]
    done = []
    for cid in ids:
        mod, dg = load(cid)
        apply(pages[cid], mod.INTRO, mod.SECTIONS, getattr(mod, 'TITLE', None), getattr(mod, 'SUMMARY', None))
        d['diagrams'].update(dg); done.append(cid)
    d['meta'].update(version=f'{ver}-chapters', previousVersion='v41', refinement='按 V 章标准重写：' + '、'.join(['V'] + done))
    app = re.search(r'</script>\s*<script>([\s\S]*?)</script>\s*</body>', raw)[1]
    app = app.replace(' function renderModule(id) {', RENDER + '\n function renderModule(id) {', 1)
    hook = 'if(page.voiceEdition)return renderVoiceEdition(page,module);'
    assert hook in app
    app = app.replace(hook, 'if(page.v34)return renderVoiceV34(page,module);\n  ' + hook, 1)
    prefix = raw[:re.search(r'<script>\s*const DATA=', raw).start()]
    prefix = prefix.replace('</style>', B.CSS + '\n</style>', 1)
    prefix = re.sub(r'<title>[^<]*</title>', f'<title>豆包汽车业务学习站 {ver}</title>', prefix, count=1)
    payload = json.dumps(d, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    out = HTMLDIR / f'豆包汽车-业务学习站-{ver}.html'
    with out.open('x') as f:
        f.write(prefix + '<script>\nconst DATA=' + payload + ';\n</script>\n<script>' + app + '</script>\n</body>\n</html>')
    print(out, done)

if __name__ == '__main__':
    build(sys.argv[1], sys.argv[2:])
