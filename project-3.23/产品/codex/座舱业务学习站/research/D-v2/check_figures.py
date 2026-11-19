#!/usr/bin/env python3
"""Offline SVG checks, using macOS CoreText glyph bounds (no browser)."""
from pathlib import Path
from lxml import etree as ET
import ctypes as C
import json, re, math, sys

BASE = Path(__file__).resolve().parent
COMMON = ['资料','PRD','清单','待确认','口径','没有展开','未展开','《','》']
ORIGINAL = COMMON + ['技术方案','宣讲','周报','逐字稿','DT','小模型','OnePage','明骏','黄赌毒']
EPS = 0.15

class Point(C.Structure):
    _fields_ = [('x', C.c_double), ('y', C.c_double)]
class Size(C.Structure):
    _fields_ = [('width', C.c_double), ('height', C.c_double)]
class Rect(C.Structure):
    _fields_ = [('origin',Point),('size',Size)]

CF = C.CDLL('/System/Library/Frameworks/CoreFoundation.framework/CoreFoundation')
CT = C.CDLL('/System/Library/Frameworks/CoreText.framework/CoreText')
CF.CFStringCreateWithCString.argtypes=[C.c_void_p,C.c_char_p,C.c_uint32]
CF.CFStringCreateWithCString.restype=C.c_void_p
CF.CFDictionaryCreate.argtypes=[C.c_void_p,C.POINTER(C.c_void_p),C.POINTER(C.c_void_p),C.c_long,C.c_void_p,C.c_void_p]
CF.CFDictionaryCreate.restype=C.c_void_p
CF.CFAttributedStringCreate.argtypes=[C.c_void_p,C.c_void_p,C.c_void_p]
CF.CFAttributedStringCreate.restype=C.c_void_p
CF.CFRelease.argtypes=[C.c_void_p]
CT.CTFontCreateWithName.argtypes=[C.c_void_p,C.c_double,C.c_void_p]
CT.CTFontCreateWithName.restype=C.c_void_p
CT.CTLineCreateWithAttributedString.argtypes=[C.c_void_p]
CT.CTLineCreateWithAttributedString.restype=C.c_void_p
CT.CTLineGetBoundsWithOptions.argtypes=[C.c_void_p,C.c_ulong]
CT.CTLineGetBoundsWithOptions.restype=Rect
CT.CTLineGetTypographicBounds.argtypes=[C.c_void_p,C.c_void_p,C.c_void_p,C.c_void_p]
CT.CTLineGetTypographicBounds.restype=C.c_double
FONTKEY=C.c_void_p.in_dll(CT,'kCTFontAttributeName')

def cfstr(s): return CF.CFStringCreateWithCString(None,s.encode('utf8'),0x08000100)

def measure(s,size,weight):
    name=cfstr('PingFangSC-Semibold' if weight>=600 else 'PingFangSC-Regular')
    font=CT.CTFontCreateWithName(name,size,None)
    string=cfstr(s)
    attrs=CF.CFDictionaryCreate(None,(C.c_void_p*1)(FONTKEY.value),(C.c_void_p*1)(font),1,None,None)
    attributed=CF.CFAttributedStringCreate(None,string,attrs)
    line=CT.CTLineCreateWithAttributedString(attributed)
    bounds=CT.CTLineGetBoundsWithOptions(line,1<<3)
    advance=CT.CTLineGetTypographicBounds(line,None,None,None)
    result=(bounds.origin.x,bounds.origin.y,bounds.size.width,bounds.size.height,advance)
    for item in [line,attributed,attrs,string,font,name]: CF.CFRelease(item)
    return result

def local(el): return ET.QName(el).localname
def nums(s): return [float(n) for n in re.findall(r'[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?',s or '')]
def number(s,default=0):
    ns=nums(str(s)); return ns[0] if ns else default
def box(el):
    if local(el)=='rect':
        x,y,w,h=[number(el.get(a)) for a in ['x','y','width','height']]
        return (x,y,x+w,y+h)
    if local(el)=='polygon':
        n=nums(el.get('points')); return (min(n[::2]),min(n[1::2]),max(n[::2]),max(n[1::2]))
    child=next((e for e in el if local(e) in ['rect','polygon']),None)
    return box(child) if child is not None else None
def intersect(a,b,tol=EPS): return min(a[2],b[2])-max(a[0],b[0])>tol and min(a[3],b[3])-max(a[1],b[1])>tol
def contains(a,b,tol=EPS): return a[0]-tol<=b[0] and a[1]-tol<=b[1] and a[2]+tol>=b[2] and a[3]+tol>=b[3]
def point_inside(p,b,strict=False):
    e=EPS if strict else -EPS
    return b[0]+e<p[0]<b[2]-e and b[1]+e<p[1]<b[3]-e
def polygon(el):
    if local(el)=='g': el=next((e for e in el if local(e) in ['rect','polygon']),None)
    if el is None: return []
    if local(el)=='polygon':
        n=nums(el.get('points')); return list(zip(n[::2],n[1::2]))
    b=box(el);return [(b[0],b[1]),(b[2],b[1]),(b[2],b[3]),(b[0],b[3])]
def inpoly(p,poly):
    crosses=[]
    for a,b in zip(poly,poly[1:]+poly[:1]):
        c=(b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0])
        crosses.append(c)
    return all(x>EPS for x in crosses) or all(x<-EPS for x in crosses)
def segment_enters(a,b,poly):
    # Convex polygon clipping, test the open interior, so touching borders passes.
    ts=[0,1]
    vx,vy=b[0]-a[0],b[1]-a[1]
    for p,q in zip(poly,poly[1:]+poly[:1]):
        wx,wy=q[0]-p[0],q[1]-p[1]
        den=vx*wy-vy*wx
        if abs(den)<1e-9: continue
        t=((p[0]-a[0])*wy-(p[1]-a[1])*wx)/den
        u=((p[0]-a[0])*vy-(p[1]-a[1])*vx)/den
        if -1e-8<=t<=1+1e-8 and -1e-8<=u<=1+1e-8: ts.append(max(0,min(1,t)))
    ts=sorted(set(ts))
    return any(inpoly((a[0]+vx*(t+u)/2,a[1]+vy*(t+u)/2),poly) for t,u in zip(ts,ts[1:]) if u-t>1e-6)

def segments(d):
    tokens=re.findall(r'[A-Za-z]|[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?',d or '')
    out=[];i=0;cmd=None;p=(0,0);start=p
    while i<len(tokens):
        if tokens[i].isalpha(): cmd=tokens[i];i+=1
        if cmd not in ['M','m','L','l','H','h','V','v','Z','z']: raise ValueError('unsupported path command '+str(cmd))
        if cmd in ['Z','z']:
            out.append((p,start));p=start;cmd=None;continue
        count=1 if cmd.upper() in ['H','V'] else 2
        n=[float(v) for v in tokens[i:i+count]];i+=count
        if cmd.upper()=='H': q=(n[0]+(p[0] if cmd.islower() else 0),p[1])
        elif cmd.upper()=='V':q=(p[0],n[0]+(p[1] if cmd.islower() else 0))
        else:q=(n[0]+(p[0] if cmd.islower() else 0),n[1]+(p[1] if cmd.islower() else 0))
        if cmd.upper()=='M':start=q;cmd='l' if cmd.islower() else 'L'
        else:out.append((p,q))
        p=q
    return out

def validate(path):
    errors=[];warnings=[]
    result={'file':str(path.relative_to(BASE)),'errors':errors,'warnings':warnings}
    try:root=ET.parse(str(path)).getroot()
    except Exception as e: errors.append('XML: '+str(e));return result
    result['xml_parse']=True
    vb=nums(root.get('viewBox')); canvas=(vb[0],vb[1],vb[0]+vb[2],vb[1]+vb[3])
    styles={}
    for style in root.xpath('//*[local-name()="style"]'):
        for selector,body in re.findall(r'([^{}]+)\{([^{}]*)\}',style.text or ''):
            for cls in re.findall(r'\.([\w-]+)',selector):
                styles.setdefault(cls,{}).update(dict(re.findall(r'([\w-]+)\s*:\s*([^;]+)',body)))
    def props(el):
        lineage=list(el.iterancestors())[::-1]+[el];out={}
        for e in lineage:
            out.update({k:v for k,v in e.attrib.items() if k in ['font-size','font-weight','text-anchor','font-family']})
            for cls in e.get('class','').split():out.update(styles.get(cls,{}))
            out.update(dict(re.findall(r'([\w-]+)\s*:\s*([^;]+)',e.get('style',''))))
        return out
    if root.xpath('//*[@transform]'):errors.append('Transforms require explicit geometry support')
    nodeels=root.xpath('//*[@data-node="true"]')
    nodes=[(e,box(e),polygon(e)) for e in nodeels]
    result['nodes']=len(nodes)
    if not 1<=len(nodes)<=9:errors.append(f'Node count {len(nodes)} is outside 1..9')
    allrects=[e for e in root.xpath('//*[local-name()="rect"]') if not any(local(a) in ['defs','marker','clipPath'] for a in e.iterancestors())]
    for i,a in enumerate(allrects):
        ba=box(a)
        if not contains(canvas,ba):errors.append('Rectangle outside viewBox: '+str(ba))
        for b in allrects[i+1:]:
            bb=box(b)
            if not intersect(ba,bb):continue
            # Only explicit decoration may enclose other shapes.
            if (a.get('data-decoration')=='true' and contains(ba,bb)) or (b.get('data-decoration')=='true' and contains(bb,ba)):continue
            errors.append(f'Rectangle overlap {ba} <> {bb}')
    # A meaningful unmarked box is a likely count error; tiny legend chips/bars are decorations.
    for e in allrects:
        b=box(e)
        if e.get('data-decoration')=='true' or any(a.get('data-node')=='true' for a in [e]+list(e.iterancestors())):continue
        if b[2]-b[0]>100 and b[3]-b[1]>40:errors.append('Unmarked semantic rectangle: '+str(b))
    forbidden=ORIGINAL if path.parent.name=='figures-orig' else COMMON
    visible=[];runs=[]
    for el in root.xpath('//*[local-name()="text"]'):
        if any(local(a) in ['defs','marker','clipPath'] for a in el.iterancestors()):continue
        p=props(el);x=number(el.get('x'));y=number(el.get('y'))
        pieces=[]
        if el.text and el.text.strip():pieces.append((el,el.text,x,y))
        for child in el:
            if local(child)!='tspan':continue
            x=number(child.get('x'),x)+number(child.get('dx'));y=number(child.get('y'),y)+number(child.get('dy'))
            pieces.append((child,''.join(child.itertext()),x,y))
        for e,s,x,y in pieces:
            if not s.strip():continue
            visible.append(s)
            ep=props(e);size=number(ep.get('font-size'),16);weight=number(ep.get('font-weight'),400)
            ox,oy,w,h,advance=measure(s,size,weight)
            anchor=ep.get('text-anchor','start')
            dx=advance*(.5 if anchor=='middle' else 1 if anchor=='end' else 0)
            b=(x-dx+ox,y-oy-h,x-dx+ox+w,y-oy)
            desc=f'{s!r} @ ({x:g},{y:g})'
            if not contains(canvas,b):errors.append('Text outside viewBox: '+desc+' '+str(b))
            owner=next((a for a in e.iterancestors() if a.get('data-node')=='true'),None)
            if owner is not None: candidates=[n for n in nodes if n[0] is owner]
            else:candidates=[n for n in nodes if point_inside((x,y),n[1])]
            if candidates:
                n=min(candidates,key=lambda n:(n[1][2]-n[1][0])*(n[1][3]-n[1][1]))
                if not contains(n[1],b):errors.append('Text exceeds node box: '+desc+' '+str(b)+' node '+str(n[1]))
                elif local(n[0])=='polygon' and not all(inpoly(corner,n[2]) for corner in [(b[0],b[1]),(b[2],b[1]),(b[2],b[3]),(b[0],b[3])]):
                    errors.append('Text exceeds polygon node: '+desc+' '+str(b))
            runs.append((b,desc))
    for i,(a,da) in enumerate(runs):
        for b,db in runs[i+1:]:
            if intersect(a,b):errors.append('Text overlap: '+da+' <> '+db)
    accessible=[str(e.text or '') for e in root if local(e) in ['title','desc']]
    accessible += [v for k,v in root.attrib.items() if k in ['aria-label','aria-description']]
    text='\n'.join(visible+accessible)
    for term in forbidden:
        if term in text:errors.append('Forbidden text: '+term)
    for el in root.xpath('//*[local-name()="path"]'):
        if any(local(a) in ['defs','marker','clipPath'] for a in el.iterancestors()):continue
        if not el.get('marker-end') and not el.get('marker-start'):continue
        try:segs=segments(el.get('d'))
        except ValueError as e:errors.append(str(e));continue
        for a,b in segs:
            for node,nb,poly in nodes:
                if segment_enters(a,b,poly):errors.append(f'Arrow crosses node {nb}: {a} -> {b}')
    if path.parent.name=='figures':
        try:
            meta=json.loads(path.with_suffix('.json').read_text())
            expected={'id':root.get('id'),'title':root.find('{*}title').text,'subtitle':root.find('{*}desc').text}
            if meta!=expected:errors.append('Metadata mismatch: '+repr(meta)+' != '+repr(expected))
        except Exception as e:errors.append('Metadata: '+str(e))
    result.update(text_runs=len(runs),rectangles=len(allrects),checks={'text_in_viewBox':not any('outside viewBox' in e and e.startswith('Text') for e in errors),'text_no_overlap':not any('Text overlap' in e for e in errors),'text_within_node':not any('exceeds node' in e for e in errors),'rectangles_no_overlap':not any('Rectangle overlap' in e for e in errors),'arrows_do_not_cross_nodes':not any('Arrow crosses' in e for e in errors),'forbidden_words_absent':not any('Forbidden' in e for e in errors),'nodes_at_most_9':len(nodes)<=9})
    return result

def main():
    paths=[Path(p) for p in sys.argv[1:]] if len(sys.argv)>1 else sorted((BASE/'figures').glob('*.svg'))+sorted((BASE/'figures-orig').glob('*.svg'))
    results=[validate(p) for p in paths]
    report={'method':'XML + CoreText PingFang SC glyph-path bounds; axis-aligned rect intersections; M/L/H/V arrow segments versus convex node interiors. No browser. Explicit background/container decorations may contain children.','passed':all(not r['errors'] for r in results),'files':results}
    (BASE/'check-results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    for r in results:
        print(('PASS' if not r['errors'] else 'FAIL')+' '+r['file']+' nodes='+str(r.get('nodes','?')))
        for e in r['errors']:print('  '+e)
    return 0 if report['passed'] else 1

if __name__=='__main__':sys.exit(main())
