from pathlib import Path
from lxml import etree as E
from PIL import ImageFont
import subprocess, re, json, itertools

ROOT=Path(__file__).resolve().parent
NS={'s':'http://www.w3.org/2000/svg'}
FONT=subprocess.check_output(['fc-match','PingFang SC','-f','%{file}'],text=True).strip()
SIZES={'v56-title':24,'v56-subtitle':14,'v56-node-title':16,'v56-node-sub':14,'v56-label':14,'v56-risk':14}
BANNED=['资料','PRD','清单','待确认','口径','没有展开','未展开','DT','小模型','OnePage','技术方案','周报','宣讲','逐字稿','《','》','Director']

def overlap(a,b):
    return min(a[2],b[2])-max(a[0],b[0])>0.5 and min(a[3],b[3])-max(a[1],b[1])>0.5

def seg_hits(a,b,r):
    # Open rectangle, so a connector may touch its source/target boundary.
    xmin,ymin,xmax,ymax=r; xmin+=.2;ymin+=.2;xmax-=.2;ymax-=.2
    lo,hi=0.,1.
    for p,d,mn,mx in [(a[0],b[0]-a[0],xmin,xmax),(a[1],b[1]-a[1],ymin,ymax)]:
        if abs(d)<1e-9:
            if not mn<p<mx:return False
        else:
            q=sorted([(mn-p)/d,(mx-p)/d]);lo=max(lo,q[0]);hi=min(hi,q[1])
            if hi<=lo:return False
    return hi>lo

def check(path):
    root=E.parse(str(path)).getroot(); errors=[]
    vb=list(map(float,root.get('viewBox').split()));vx,vy,w,h=vb
    text=''.join(root.xpath('//s:text//text() | //s:title/text() | //s:desc/text()',namespaces=NS))
    for word in BANNED:
        if word.lower() in text.lower():errors.append('banned '+word)
    rects=[];nodes=[];boxes=[]
    for r in root.xpath('//s:rect',namespaces=NS):
        x,y,rw,rh=[float(r.get(k,'0')) for k in ['x','y','width','height']]
        box=(x,y,x+rw,y+rh);rects.append(box)
        if r.getparent().get('data-node')=='true':nodes.append(box)
        if not(vx<=x and vy<=y and x+rw<=vx+w and y+rh<=vy+h):errors.append('rectangle outside viewBox')
    for a,b in itertools.combinations(rects,2):
        if overlap(a,b):errors.append('overlapping rectangles '+str((a,b)))
    for t in root.xpath('//s:text',namespaces=NS):
        cls=t.get('class','');size=float(t.get('font-size',SIZES.get(cls,14)))
        font=ImageFont.truetype(FONT,round(size))
        x=float(t.get('x','0'));y=float(t.get('y','0'));s=''.join(t.itertext())
        bb=font.getbbox(s,anchor='ls');length=font.getlength(s)
        if t.get('text-anchor')=='middle':x-=length/2
        elif t.get('text-anchor')=='end':x-=length
        box=(x+bb[0],y+bb[1],x+bb[2],y+bb[3]);boxes.append((box,s,t))
        if box[0]<vx or box[1]<vy or box[2]>vx+w or box[3]>vy+h:errors.append('text outside viewBox: '+s)
        parent=t.getparent()
        if parent.get('data-node')=='true':
            r=parent.find('s:rect',NS);rx,ry,rw,rh=[float(r.get(k)) for k in ['x','y','width','height']]
            if not(rx+8<=box[0] and ry+4<=box[1] and box[2]<=rx+rw-8 and box[3]<=ry+rh-4):errors.append('text outside own node: '+s)
    for (a,sa,ta),(b,sb,tb) in itertools.combinations(boxes,2):
        if overlap(a,b):errors.append('text overlap: '+sa+' / '+sb)
    arrows=root.xpath('//s:path[@marker-end]',namespaces=NS)
    for p in arrows:
        d=p.get('d'); nums=list(map(float,re.findall(r'-?\d+(?:\.\d+)?',d)))
        if re.search('[A-KN-Zac-z]',d):errors.append('unsupported arrow path '+d);continue
        points=list(zip(nums[::2],nums[1::2]))
        for a,b in zip(points,points[1:]):
            for r in nodes:
                if seg_hits(a,b,r):errors.append('arrow crosses node: '+d)
            for box,s,t in boxes:
                if seg_hits(a,b,box):errors.append('arrow crosses text: '+s)
    if path.parent.name=='figures' and len(nodes)>9:errors.append('more than nine nodes')
    meta=json.loads(path.with_suffix('.json').read_text())
    if set(meta)!={'id','title','subtitle'} or meta['id']!=path.stem:errors.append('invalid JSON metadata')
    return dict(file=str(path.relative_to(ROOT)),nodes=len(nodes),arrows=len(arrows),parse='pass',text_bounds='pass' if not any('outside' in x for x in errors) else 'fail',errors=errors)

if __name__=='__main__':
    results=[check(p) for p in sorted((ROOT/'figures').glob('*.svg'))]
    report={'font':FONT,'checks':['XML parse','text inside viewBox and own node','no text overlap','no rectangle overlap','no arrows through nodes or text','zero banned words','node limit','JSON metadata'],'results':results,'passed':all(not r['errors'] for r in results)}
    (ROOT/'figure-checks.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    for r in results: print(r['file'],r['nodes'],'nodes', 'PASS' if not r['errors'] else r['errors'])
    raise SystemExit(0 if report['passed'] else 1)
