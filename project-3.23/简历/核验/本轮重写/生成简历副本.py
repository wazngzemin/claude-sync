from pathlib import Path
import json,re,html,hashlib
root=Path('/Users/bytedance/Desktop/3.23/简历')
work=root/'核验/本轮重写'
source=root/'简历-王泽民-具身智能产品经理.html'
original=source.read_text(encoding='utf-8')
patch=json.loads((work/'正文改写.json').read_text(encoding='utf-8'))
def render(s):
    parts=s.split('**')
    return ''.join(('<strong class="metric">'+html.escape(p)+'</strong>') if i%2 else html.escape(p) for i,p in enumerate(parts))
text=original
for key,value in patch.items():
    pattern=re.compile(r'(<(?P<tag>li|p)\b[^>]*data-evidence="'+re.escape(key)+r'"[^>]*>).*?(</(?P=tag)>)',re.S)
    text,n=pattern.subn(lambda m:m[1]+render(value)+m[3],text)
    assert n==1,(key,n)
text=text.replace('data-version="v25c"','data-version="v26"').replace('V25L','V26L')
# Preserve source mapping without putting audit notes into the printed resume.
attachment='https://aka.doubaocdn.com/s/KiJ6e0dTzO'
text=re.sub(r'data-evidence="(V26L\d{3})"',lambda m:m[0]+' data-source="'+attachment+'"',text)
text=text.replace('<title>王泽民｜具身智能产品经理 / AI Agent 产品经理</title>','<title>王泽民｜具身智能产品经理 / AI Agent 产品经理</title><link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 64 64%27%3E%3Crect width=%2764%27 height=%2764%27 fill=%27%23176477%27/%3E%3Ctext x=%2732%27 y=%2747%27 text-anchor=%27middle%27 fill=%27white%27 font-size=%2744%27%3E王%3C/text%3E%3C/svg%3E">')
# Keep original responsive template. Bold section labels remain dark, figures teal.
text=text.replace('strong.metric{color:#176477}','strong.metric{color:#176477}\nli>strong.metric:first-child{color:#26343a}')
output=root/'简历-王泽民-具身智能产品经理-v26.html'
assert not output.exists(),'Refuse to overwrite pre-existing version'
output.write_text(text,encoding='utf-8')
records=[]
for m in re.finditer(r'<(?P<tag>h1|h2|h3|h4|li|p)\b[^>]*data-evidence="(?P<id>V26L\d{3})"[^>]*>(?P<body>.*?)</(?P=tag)>',text,re.S):
    clean=html.unescape(re.sub('<[^>]+>','',m['body']))
    records.append({'id':m['id'],'text':clean,'chars':len(re.sub(r'\s','',clean))})
assert len(records)==74,len(records)
assert len(set(x['id'] for x in records))==74
assert '新手引导' not in ' '.join(x['text'] for x in records)
(work/'正文核验.json').write_text(json.dumps({'version':'v26','original_sha256':hashlib.sha256(original.encode()).hexdigest(),'new_sha256':hashlib.sha256(text.encode()).hexdigest(),'rewritten_lines':len(patch),'evidence_lines':len(records),'visible_chars':sum(x['chars'] for x in records),'records':records},ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'output':str(output),'rewritten_lines':len(patch),'visible_chars':sum(x['chars'] for x in records),'original_unchanged':source.read_text(encoding='utf-8')==original},ensure_ascii=False))
