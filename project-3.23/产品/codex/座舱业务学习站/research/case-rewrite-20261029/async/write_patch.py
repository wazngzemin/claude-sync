from pathlib import Path
import json,re
ROOT=Path('/Users/bytedance/Desktop/3.23/产品/codex/座舱业务学习站')
OUT=ROOT/'content/case-async-20261029.json'
PACK=json.loads((ROOT/'research/case-rewrite-20261029/async-packet.json').read_text())
BASE={p['id']:p for p in PACK['pages']}
def paras(text):
    return [p.strip() for p in text.strip().split('\n\n') if p.strip()]
def lesson(id,title,text,sources):
    return dict(id=id,title=title,paragraphs=paras(text),sourceIds=sources.split())
def save(id,intro,lessons,guide,sources,title=None):
    patch=json.loads(OUT.read_text()) if OUT.exists() else dict(pages=[],sources=[],baseNodePatches=[])
    page=dict(id=id,teaching=dict(intro=paras(intro),lessons=lessons,guides=dict(base=dict(title=title or '沿本章的业务过程读完整图',paragraphs=paras(guide),nodeIds=BASE[id]['teaching']['guides']['base']['nodeIds'])),closing=[],sourceIds=sources.split()),flows=[])
    patch['pages']=[p for p in patch['pages'] if p['id']!=id]+[page]
    patch['pages'].sort(key=lambda p:list(BASE).index(p['id']))
    OUT.write_text(json.dumps(patch,ensure_ascii=False,indent=2)+'\n')
    body=''.join(page['teaching']['intro'])+''.join(''.join(l['paragraphs']) for l in lessons)
    print(id,'body chars',len(body),'Chinese',len(re.findall(r'[\u4e00-\u9fff]',body)),'guide',sum(map(len,page['teaching']['guides']['base']['paragraphs'])))
