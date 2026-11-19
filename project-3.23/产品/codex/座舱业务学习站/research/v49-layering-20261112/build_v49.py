import json,re,hashlib
from pathlib import Path
from html.parser import HTMLParser
D=Path(__file__).parent
base=Path('/Users/bytedance/Desktop/3.23/产品/codex/HTML/02-已交付/豆包汽车-业务学习站-v48.html')
out=base.parent.parent/'01-进行中/豆包汽车-业务学习站-v49.html'
source=base.read_text(); data=json.loads((D/'baseline-data.json').read_text());v=next(p for p in data['pages'] if p['id']=='V')
original=json.loads(json.dumps(v['v34']))
patches={};intro=None
for name in ['root','flow','models','support']:
 p=json.loads((D/(name+'-patch.json')).read_text());patches.update({s['id']:s for s in p['sections']});intro=p.get('intro',intro)
v['v34']['sections']=[patches.get(s['id'],s) for s in original['sections']];v['v34']['intro']=intro
# Keep plain-text mirrors aligned with the actual displayed edition.
class Text(HTMLParser):
 def __init__(self):super().__init__();self.items=[]
 def handle_data(self,d):self.items.append(d)
def plain(h):
 p=Text();p.feed(h);return ' '.join(p.items)
v['sections']=[{'id':s['id'],'title':s['title'],'paragraphs':[plain(s['html'])],'sourceIds':[]} for s in v['v34']['sections']]
v['teaching']['intro']=[plain(intro)];v['teaching']['lessons']=v['sections'];v['teaching']['closing']=[]
app=(D/'baseline-app.js').read_text()
needle=' const page = pageOf(id), teaching = page.teaching || {};'
branch='''
 if(id==='V' && page.v34){
  const all=[];
  page.v34.sections.forEach(s=>{
   const holder=document.createElement('div');holder.innerHTML=s.html;
   all.push(holder.textContent);
   holder.querySelectorAll('details.v49-detail[id]').forEach(detail=>{
    index.push({type:'chapter',title:detail.querySelector('summary')?.textContent||s.title,body:detail.textContent,href:routeHref('module',id,'section',detail.id),id:detail.id,moduleId:id});
   });
   holder.querySelectorAll('details.v49-detail').forEach(detail=>detail.remove());
   index.push({type:'chapter',title:s.title,body:holder.textContent,href:routeHref('module',id,'section',s.id),id:s.id,moduleId:id});
  });
  const opening=document.createElement('div');opening.innerHTML=page.v34.intro;
  index.push({type:'module',title:page.title,shortTitle:titleOf(id),body:[opening.textContent,...all].join('\\n'),href:routeHref('module',id),id,moduleId:id});
  return;
 }
'''
assert app.count(needle)==1;app=app.replace(needle,needle+branch)
app=app.replace("revision: 'v48'","revision: 'v49'").replace('我的修订-v48.html','我的修订-v49.html')
# Specific scoped style; leave all diagram layout and zoom code untouched.
style='''<style id="v49-reading-layers">
.voice-lesson.v34 details.v49-detail{margin:1.15em 0 1.6em;border:1px solid #dbe4ee;border-radius:8px;background:#fafbfd;}
.voice-lesson.v34 details.v49-detail>summary{padding:16px 20px;color:#315677;font-weight:600;cursor:pointer;line-height:1.65;}
.voice-lesson.v34 .v49-detail-body{padding:0 22px 18px;border-top:1px solid #e5eaf0;}
.voice-lesson.v34 .v49-detail-body>p:first-child{margin-top:18px;}
.voice-lesson.v34 details.v49-detail:focus-within{outline:2px solid #94b5d9;outline-offset:2px;}
@media(max-width:700px){.voice-lesson.v34 details.v49-detail>summary{padding:14px;}.voice-lesson.v34 .v49-detail-body{padding:0 14px 14px;}}
</style>'''
scripts=list(re.finditer(r'<script([^>]*)>([\s\S]*?)</script>',source))
replacements=[]
for m in scripts:
 body=m.group(2)
 if 'id="learning-doc-data"' in m.group(1):new=json.dumps({'revision':'v49','pages':{}},ensure_ascii=False,separators=(',',':'))
 elif re.match(r'\s*const DATA\s*=',body):new='\nconst DATA='+json.dumps(data,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')+';\n'
 elif 'function renderModule' in body:new=app
 else:continue
 replacements.append((m.start(2),m.end(2),new))
for a,b,new in reversed(replacements):source=source[:a]+new+source[b:]
source=source.replace('</head>',style+'\n</head>',1)
source=source.replace('<title>豆包汽车业务学习站 v48</title>','<title>豆包汽车业务学习站 v49</title>',1)
out.write_text(source)
(D/'candidate-data.json').write_text(json.dumps(data,ensure_ascii=False))
(D/'candidate-v.json').write_text(json.dumps(v['v34'],ensure_ascii=False,indent=2))
(D/'candidate-app.js').write_text(app)
(D/'baseline-integrity.json').write_text(json.dumps({'path':str(base),'sha256':hashlib.sha256(base.read_bytes()).hexdigest(),'output':str(out)},ensure_ascii=False,indent=2))
print(str(out))
