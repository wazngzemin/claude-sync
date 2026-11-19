"""No-browser SVG checks using Pango's real glyph metrics and SVG geometry.

Run from any directory. Requires Homebrew Pango and librsvg. Report is saved
beside the two delivery directories. Structural backgrounds and tiny labels
are excluded from business-node counts, never from text-boundary checks.
"""
from pathlib import Path
import ctypes as C
import itertools
import json
import re
import subprocess
import tempfile
import xml.etree.ElementTree as ET

BASE=Path(__file__).resolve().parents[1]
NS='{http://www.w3.org/2000/svg}'
P=C.CDLL('/opt/homebrew/lib/libpango-1.0.dylib')
PC=C.CDLL('/opt/homebrew/lib/libpangocairo-1.0.dylib')
G=C.CDLL('/opt/homebrew/lib/libgobject-2.0.dylib')
def api(lib,name,args,restype=None):
    fn=getattr(lib,name);fn.argtypes=args;fn.restype=restype;return fn
ptr=C.c_void_p
fontmap=api(PC,'pango_cairo_font_map_get_default',[],ptr)
context=api(P,'pango_font_map_create_context',[ptr],ptr)(fontmap())
newlayout=api(P,'pango_layout_new',[ptr],ptr)
newfont=api(P,'pango_font_description_from_string',[C.c_char_p],ptr)
sizefont=api(P,'pango_font_description_set_absolute_size',[ptr,C.c_double])
weightfont=api(P,'pango_font_description_set_weight',[ptr,C.c_int])
setfont=api(P,'pango_layout_set_font_description',[ptr,ptr])
settext=api(P,'pango_layout_set_text',[ptr,C.c_char_p,C.c_int])
baseline=api(P,'pango_layout_get_baseline',[ptr],C.c_int)
unref=api(G,'g_object_unref',[ptr])
freefont=api(P,'pango_font_description_free',[ptr])
class Rect(C.Structure):
    _fields_=[('x',C.c_int),('y',C.c_int),('w',C.c_int),('h',C.c_int)]
extents=api(P,'pango_layout_get_pixel_extents',[ptr,C.POINTER(Rect),C.POINTER(Rect)])

def metrics(s,size,weight):
    layout=newlayout(context);font=newfont(b'PingFang SC,Microsoft YaHei,Noto Sans CJK SC,Arial,sans-serif')
    sizefont(font,size*1024);weightfont(font,weight);setfont(layout,font)
    settext(layout,s.encode(),-1)
    ink,logical=Rect(),Rect();extents(layout,C.byref(ink),C.byref(logical))
    result=(ink.x,ink.y-baseline(layout)/1024,ink.w,ink.h,logical.w)
    freefont(font);unref(layout)
    return result

def number(s,default=0):
    return float(re.search(r'-?[\d.]+',str(s)).group()) if s is not None else default

def overlap(a,b,eps=.5):
    return min(a[2],b[2])-max(a[0],b[0])>eps and min(a[3],b[3])-max(a[1],b[1])>eps

def contains(a,b,eps=1):
    return b[0]>=a[0]-eps and b[1]>=a[1]-eps and b[2]<=a[2]+eps and b[3]<=a[3]+eps

def parse_style(s):
    return dict((k.strip(),v.strip()) for k,v in re.findall(r'([\w-]+)\s*:\s*([^;{}]+)',s))

def cssrules(root):
    css='\n'.join(x.text or '' for x in root.iter(NS+'style'))
    return {name:parse_style(body) for name,body in re.findall(r'\.([\w-]+)\s*\{([^{}]*)\}',css)}

def all_elements(root):
    rules=cssrules(root)
    def walk(e, inherited, in_defs=False, node=None):
        st=dict(inherited)
        for cls in e.get('class','').split():st.update(rules.get(cls,{}))
        st.update(e.attrib);st.update(parse_style(e.get('style','')))
        in_defs=in_defs or e.tag==NS+'defs'
        if e.get('data-node')=='true':node=e
        yield e,st,in_defs,node
        for child in e:yield from walk(child,st,in_defs,node)
    return list(walk(root,{}))

def path_segments(d):
    # Delivery paths contain only straight M/L/H/V/Z commands.
    tokens=re.findall(r'[A-Za-z]|[-+]?(?:\d*\.)?\d+(?:[eE][-+]?\d+)?',d)
    i=0;cmd=None;x=y=0;start=None;segments=[]
    while i<len(tokens):
        if tokens[i].isalpha():cmd=tokens[i];i+=1
        if cmd in ('Z','z'):
            if start:segments.append(((x,y),start));x,y=start
            cmd=None;continue
        if cmd not in ('M','m','L','l','H','h','V','v'):return None
        relative=cmd.islower();upper=cmd.upper()
        if upper in ('M','L'):
            nx,ny=float(tokens[i]),float(tokens[i+1]);i+=2
            if relative:nx+=x;ny+=y
        elif upper=='H':
            nx=float(tokens[i])+(x if relative else 0);ny=y;i+=1
        else:
            nx=x;ny=float(tokens[i])+(y if relative else 0);i+=1
        if upper=='M':start=(nx,ny);cmd='l' if relative else 'L'
        else:segments.append(((x,y),(nx,ny)))
        x,y=nx,ny
    return segments

def crosses_rect(segment,b):
    # Liang-Barsky clipping, inset prevents endpoint contact being counted.
    x1,y1=segment[0];x2,y2=segment[1]
    left,top,right,bottom=b[0]+.8,b[1]+.8,b[2]-.8,b[3]-.8
    dx,dy=x2-x1,y2-y1;t0,t1=0,1
    for p,q in [(-dx,x1-left),(dx,right-x1),(-dy,y1-top),(dy,bottom-y1)]:
        if abs(p)<1e-9:
            if q<0:return False
        else:
            r=q/p
            if p<0:t0=max(t0,r)
            else:t1=min(t1,r)
    return t1>t0+1e-6

def check(path):
    errors=[];root=ET.parse(path).getroot();els=all_elements(root)
    vb=list(map(float,root.get('viewBox').split()));canvas=(vb[0],vb[1],vb[0]+vb[2],vb[1]+vb[3])
    rects=[];texts=[];nodes=[]
    for e,st,defs,node in els:
        if defs:continue
        if e.get('data-node')=='true':nodes.append(e)
        if e.tag==NS+'rect':
            x,y,w,h=(number(e.get(k)) for k in ('x','y','width','height'))
            rects.append((e,(x,y,x+w,y+h),node))
        if e.tag==NS+'text':
            s=''.join(e.itertext())
            if not s:continue
            size=number(st.get('font-size'),16);weight=int(number(st.get('font-weight'),400))
            ix,iy,iw,ih,lw=metrics(s,size,weight)
            x,y=number(e.get('x')),number(e.get('y'));anchor=st.get('text-anchor','start')
            x-=lw/2 if anchor=='middle' else lw if anchor=='end' else 0
            b=(x+ix,y+iy,x+ix+iw,y+iy+ih)
            texts.append((s,b,e,node))
            if not contains(canvas,b,0):errors.append(f'text outside viewBox: {s} {b}')
    if not 1<=len(nodes)<=9:errors.append(f'node count must be 1..9: {len(nodes)}')
    visible='\n'.join(''.join(e.itertext()) for e in root.iter() if e.tag in (NS+'text',NS+'title',NS+'desc'))+'\n'+root.get('aria-label','')
    forbidden=['资料','PRD','清单','待确认','口径','没有展开','未展开','《','》']
    if path.parent.name=='figures-orig':forbidden+=['技术方案','宣讲','周报','逐字稿','DT','Chat']
    for word in forbidden:
        if word in visible:errors.append(f'forbidden term: {word}')
    business=[]
    for e,b,node in rects:
        # Whole-canvas backgrounds, explicit legends, and white arrow-label
        # backplates do not represent business rectangles.
        if contains(b,canvas) or e.get('data-legend')=='true' or (b[2]-b[0]<=22 and b[3]-b[1]<=22):continue
        if e.get('data-container')=='true':continue
        if b[3]-b[1]<=22 and e.get('fill')=='#ffffff':continue
        business.append((e,b,node))
    for (e,a,_),(f,b,_) in itertools.combinations(business,2):
        if overlap(a,b):errors.append(f'rectangle overlap: {a} / {b}')
    for s,b,e,node in texts:
        if node is not None:
            own=[r for r,rb,rn in business if rn is node]
            if len(own)==1:
                rb=next(rb for r,rb,rn in business if r is own[0])
                if not contains(rb,b,0):errors.append(f'text outside own card: {s} {b} / {rb}')
    for a,b in itertools.combinations(texts,2):
        if overlap(a[1],b[1]):errors.append(f'text overlap: {a[0]} / {b[0]}')
    for e,st,defs,node in els:
        if defs or e.tag!=NS+'path' or not e.get('marker-end'):continue
        segs=path_segments(e.get('d',''))
        if segs is None:errors.append('unsupported arrow geometry');continue
        for rect,b,_ in business:
            # Timeline columns contain their own event -> action -> input
            # arrows. A complete arrow inside one card never crosses an
            # OTHER card; boundary-to-boundary connectors remain checked.
            if all(contains(b,(*p,*p),0) for segment in segs for p in segment):continue
            if any(crosses_rect(s,b) for s in segs):errors.append(f'arrow crosses card: {e.get("d")} / {b}')
    if path.parent.name=='figures':
        meta=json.loads(path.with_suffix('.json').read_text())
        if set(meta)!=set(['id','title','subtitle']):errors.append('invalid metadata keys')
        if meta['id']!=path.stem:errors.append('metadata id mismatch')
        if meta['title']!=root.find(NS+'title').text or meta['subtitle']!=root.find(NS+'desc').text:errors.append('metadata text mismatch')
    with tempfile.TemporaryDirectory(prefix='m-svg-check-') as tmp:
        proc=subprocess.run(['rsvg-convert','-o',str(Path(tmp)/'render.png'),str(path)],capture_output=True,text=True)
        if proc.returncode:errors.append(f'librsvg render failed: {proc.stderr}')
    return {'file':str(path.relative_to(BASE)),'nodes':len(nodes),'text_count':len(texts),'business_rectangles':len(business),'errors':errors,'passed':not errors}

if __name__=='__main__':
    files=sorted((BASE/'figures').glob('*.svg'))+sorted((BASE/'figures-orig').glob('*.svg'))
    results=[]
    for path in files:
        try:result=check(path)
        except Exception as e:result={'file':str(path),'errors':[str(e)],'passed':False}
        results.append(result)
        print(json.dumps(result,ensure_ascii=False))
    report={'method':'XML parse; Pango glyph bounds; viewBox/card containment; text and rectangle intersections; arrow/card clipping; forbidden text scan; librsvg render; metadata match','browser_started':False,'expected_svg_count':11,'actual_svg_count':len(files),'passed':len(files)==11 and all(x['passed'] for x in results),'results':results}
    (BASE/'validation-results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    raise SystemExit(0 if report['passed'] else 1)
