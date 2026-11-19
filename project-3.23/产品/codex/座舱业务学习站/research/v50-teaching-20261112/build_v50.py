import json,re,hashlib
from pathlib import Path
from html.parser import HTMLParser
D=Path(__file__).parent
integrity=json.loads((D/'baseline-integrity.json').read_text());base=Path(integrity['path']);assert hashlib.sha256(base.read_bytes()).hexdigest()==integrity['sha256']
out=base.with_name('豆包汽车-业务学习站-v50.html');source=base.read_text();data=json.loads((D/'baseline-data.json').read_text());v=next(p for p in data['pages'] if p['id']=='V');old=v['v34'];patches={};intro=old['intro']
for name in ['root','voice','models','context']:
 p=json.loads((D/(name+'-patch.json')).read_text())
 for s in p['sections']:
  assert s['id'] not in patches,s['id'];patches[s['id']]=s
 intro=p.get('intro',intro)
v['v34']={'intro':intro,'sections':[patches.get(s['id'],s) for s in old['sections']]}
class Text(HTMLParser):
 def __init__(self):super().__init__();self.items=[]
 def handle_data(self,d):self.items.append(d)
def plain(h):
 p=Text();p.feed(h);return ' '.join(p.items)
v['sections']=[{'id':s['id'],'title':s['title'],'paragraphs':[plain(s['html'])],'sourceIds':[]} for s in v['v34']['sections']]
v['teaching']['intro']=[plain(intro)];v['teaching']['lessons']=v['sections'];v['teaching']['closing']=[]
app=(D/'baseline-app.js').read_text().replace("revision: 'v49'","revision: 'v50'").replace('我的修订-v49.html','我的修订-v50.html')
replacements=[]
for m in re.finditer(r'<script([^>]*)>([\s\S]*?)</script>',source):
 body=m.group(2)
 if 'id="learning-doc-data"' in m.group(1):new=json.dumps({'revision':'v50','pages':{}},separators=(',',':'))
 elif re.match(r'\s*const DATA\s*=',body):new='\nconst DATA='+json.dumps(data,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')+';\n'
 elif 'function renderModule' in body:new=app
 else:continue
 replacements.append((m.start(2),m.end(2),new))
for a,b,new in reversed(replacements):source=source[:a]+new+source[b:]
source=source.replace('<title>豆包汽车业务学习站 v49</title>','<title>豆包汽车业务学习站 v50</title>',1)
out.write_text(source)
(D/'candidate-data.json').write_text(json.dumps(data,ensure_ascii=False));(D/'candidate-v.json').write_text(json.dumps(v['v34'],ensure_ascii=False,indent=2));(D/'candidate-app.js').write_text(app)
integrity['output']=str(out);(D/'baseline-integrity.json').write_text(json.dumps(integrity,ensure_ascii=False,indent=2))
print(out)
