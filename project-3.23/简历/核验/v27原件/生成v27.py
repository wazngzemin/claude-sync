from pathlib import Path
from html.parser import HTMLParser
import json, re, hashlib
ROOT=Path('/Users/bytedance/Desktop/3.23/简历')
WORK=ROOT/'核验/v27原件'
SRC=ROOT/'简历-王泽民-具身智能产品经理-v26-完整重写.html'
OUT=ROOT/'简历-王泽民-具身智能产品经理-v27.html'
class Text(HTMLParser):
    def __init__(self): super().__init__(); self.out=[]; self.skip=0
    def handle_starttag(self,t,a):
        if t in ('script','style'): self.skip+=1
    def handle_endtag(self,t):
        if t in ('script','style'): self.skip-=1
    def handle_data(self,s):
        if not self.skip:self.out.append(s)
def visible(s):
    p=Text();p.feed(s);return ''.join(p.out)
changes=json.loads((WORK/'正文重写.json').read_text())
source=SRC.read_text();new=source
for num,content in changes.items():
    key='V26L'+num
    pattern=r'(<(?P<tag>h[1-4]|p|li)\b[^>]*data-evidence="'+key+r'"[^>]*>)(.*?)(</(?P=tag)>)'
    matches=list(re.finditer(pattern,new,re.S))
    assert len(matches)==1,(key,len(matches))
    m=matches[0];new=new[:m.start()]+m.group(1)+content+m.group(4)+new[m.end():]
new=new.replace('V26L','V27L').replace('v26l','v27l').replace('简历-来源对照-v26.md','简历-来源对照-v27.md').replace('data-version="v26-final"','data-version="v27"')
# Preserve the responsive source, physical font size and original visual system.
assert not OUT.exists(),'Refuse to overwrite an existing version'
OUT.write_text(new)
info={'version':'v27','source_sha256':hashlib.sha256(source.encode()).hexdigest(),'html_sha256':hashlib.sha256(new.encode()).hexdigest(),'changed_nodes':len(changes),'total_nodes':len(re.findall(r'data-evidence=',new)),'visible_nonspace_chars':len(re.sub(r'\s','',visible(new))),'changed_lengths':{k:len(re.sub(r'\s','',visible(v))) for k,v in changes.items()}}
(WORK/'内容核验.json').write_text(json.dumps(info,ensure_ascii=False,indent=2))
print(json.dumps(info,ensure_ascii=False,indent=2))
