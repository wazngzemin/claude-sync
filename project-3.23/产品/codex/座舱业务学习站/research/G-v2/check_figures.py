"""Offline geometry/content checks for the eight G figures and exported original.

Run with Python 3. No browser is opened. Font metrics use the installed PingFang
SC face selected by fontconfig. Curves are subdivided at <= 1 SVG source unit.
"""
from pathlib import Path
from functools import lru_cache
from itertools import combinations
from math import cos, sin, tan, radians, sqrt, atan2, ceil, pi
import json
import re
import subprocess
from lxml import etree as ET
from PIL import ImageFont

ROOT = Path(__file__).resolve().parent
NS = {'s': 'http://www.w3.org/2000/svg'}
EXPECTED = ['g2-overview', 'g2-position', 'g2-condition', 'g2-wake',
            'g2-judge', 'g2-exits', 'g2-semantic', 'g2-debug']
BANNED = ['资料', 'PRD', '清单', '待确认', '口径', '没有展开', '未展开',
          'DT', '小模型', 'OnePage', '技术方案', '周报', '宣讲', '逐字稿',
          '《', '》', 'Director']
NUMBER = r'[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?'
IDENTITY = (1, 0, 0, 1, 0, 0)
FONT_PATH = subprocess.check_output(
    ['fc-match', 'PingFang SC', '-f', '%{file}'], text=True).strip()


def num(value, default=0):
    hit = re.search(NUMBER, str(value))
    return float(hit.group()) if hit else default


def mul(a, b):
    return (a[0]*b[0]+a[2]*b[1], a[1]*b[0]+a[3]*b[1],
            a[0]*b[2]+a[2]*b[3], a[1]*b[2]+a[3]*b[3],
            a[0]*b[4]+a[2]*b[5]+a[4], a[1]*b[4]+a[3]*b[5]+a[5])


def transform(value):
    result = IDENTITY
    for name, args in re.findall(r'(\w+)\s*\(([^)]*)\)', value or ''):
        v = list(map(float, re.findall(NUMBER, args)))
        if name == 'matrix':
            m = tuple(v)
        elif name == 'translate':
            m = (1, 0, 0, 1, v[0], v[1] if len(v) > 1 else 0)
        elif name == 'scale':
            m = (v[0], 0, 0, v[1] if len(v) > 1 else v[0], 0, 0)
        elif name == 'rotate':
            c, s = cos(radians(v[0])), sin(radians(v[0]))
            m = (c, s, -s, c, 0, 0)
            if len(v) == 3:
                m = mul(mul((1,0,0,1,v[1],v[2]), m), (1,0,0,1,-v[1],-v[2]))
        elif name == 'skewX':
            m = (1,0,tan(radians(v[0])),1,0,0)
        elif name == 'skewY':
            m = (1,tan(radians(v[0])),0,1,0,0)
        else:
            raise ValueError('Unsupported transform: '+name)
        result = mul(result, m)
    return result


def world(el):
    m = IDENTITY
    for item in list(el.iterancestors())[::-1]+[el]:
        m = mul(m, transform(item.get('transform')))
    return m


def point(m, p):
    return (m[0]*p[0]+m[2]*p[1]+m[4], m[1]*p[0]+m[3]*p[1]+m[5])


def bounds(m, b):
    pts = [point(m, (x,y)) for x in [b[0],b[2]] for y in [b[1],b[3]]]
    return (min(p[0] for p in pts), min(p[1] for p in pts),
            max(p[0] for p in pts), max(p[1] for p in pts))


def overlaps(a, b, eps=.25):
    return min(a[2],b[2])-max(a[0],b[0]) > eps and min(a[3],b[3])-max(a[1],b[1]) > eps


def inside(a, b, eps=.35):
    return a[0] >= b[0]-eps and a[1] >= b[1]-eps and a[2] <= b[2]+eps and a[3] <= b[3]+eps


def segment_hits(a, b, rect):
    """Liang-Barsky against an open rectangle; endpoints may touch boundaries."""
    eps = .15
    low, high = 0., 1.
    for p, d, mn, mx in [(a[0], b[0]-a[0], rect[0]+eps, rect[2]-eps),
                          (a[1], b[1]-a[1], rect[1]+eps, rect[3]-eps)]:
        if abs(d) < 1e-12:
            if not mn < p < mx:
                return False
        else:
            t1, t2 = sorted([(mn-p)/d, (mx-p)/d])
            low, high = max(low,t1), min(high,t2)
            if high <= low:
                return False
    return high > low


@lru_cache(None)
def font(size):
    # Oversampling retains fractional font sizes and reduces rounding error.
    return ImageFont.truetype(FONT_PATH, max(1, round(size*4)))


def css_rules(root):
    css = '\n'.join(root.xpath('.//s:style/text()', namespaces=NS))
    rules = {}
    for selectors, body in re.findall(r'([^{}]+)\{([^{}]*)\}', css):
        attrs = dict((k.strip(),v.strip()) for k,v in re.findall(r'([\w-]+)\s*:\s*([^;]+)',body))
        for selector in selectors.split(','):
            selector = selector.strip()
            if re.fullmatch(r'\.[\w-]+', selector):
                rules.setdefault(selector[1:],{}).update(attrs)
    return rules


def property_(el, key, rules, default=None):
    for item in [el]+list(el.iterancestors()):
        inline = dict((k.strip(),v.strip()) for k,v in re.findall(r'([\w-]+)\s*:\s*([^;]+)',item.get('style','')))
        if key in inline:
            return inline[key]
        for cls in reversed(item.get('class','').split()):
            if key in rules.get(cls,{}):
                return rules[cls][key]
        if item.get(key) is not None:
            return item.get(key)
    return default


def node_group(el):
    for item in [el]+list(el.iterancestors()):
        if item.get('data-node'):
            return item
    return None


def text_lines(text, rules):
    x, y = num(text.get('x')), num(text.get('y'))
    result = []
    chunks = list(text) if len(text) else [text]
    for el in chunks:
        if el is not text:
            if el.get('x') is not None:
                x = num(el.get('x'))
            if el.get('y') is not None:
                y = num(el.get('y'))
            x += num(el.get('dx'))
            y += num(el.get('dy'))
        s = ''.join(el.itertext())
        if not s.strip():
            continue
        size = num(property_(el,'font-size',rules,'14'),14)
        f = font(size)
        bb = [v/4 for v in f.getbbox(s,anchor='ls')]
        advance = f.getlength(s)/4
        anchor = property_(el,'text-anchor',rules,'start')
        shift = advance/2 if anchor == 'middle' else advance if anchor == 'end' else 0
        raw = (x-shift+bb[0], y+bb[1], x-shift+bb[2], y+bb[3])
        result.append((bounds(world(el),raw), s, text))
        x += advance
    return result


def bezier(pts):
    length = sum(sqrt((b[0]-a[0])**2+(b[1]-a[1])**2) for a,b in zip(pts,pts[1:]))
    steps = max(16, min(10000,ceil(length)))
    result = []
    for i in range(steps+1):
        t = i/steps
        row = list(pts)
        while len(row)>1:
            row = [(a[0]*(1-t)+b[0]*t,a[1]*(1-t)+b[1]*t) for a,b in zip(row,row[1:])]
        result.append(row[0])
    return result


def arc(start, v, end):
    rx, ry, angle, large, sweep = v
    rx,ry = abs(rx),abs(ry)
    if not rx or not ry or start == end:
        return [start,end]
    phi = radians(angle)
    c,s = cos(phi),sin(phi)
    dx,dy = (start[0]-end[0])/2,(start[1]-end[1])/2
    xp,yp = c*dx+s*dy,-s*dx+c*dy
    scale = xp*xp/(rx*rx)+yp*yp/(ry*ry)
    if scale > 1:
        rx *= sqrt(scale); ry *= sqrt(scale)
    fac = sqrt(max(0,(rx*rx*ry*ry-rx*rx*yp*yp-ry*ry*xp*xp)/(rx*rx*yp*yp+ry*ry*xp*xp)))
    if bool(large)==bool(sweep):
        fac = -fac
    cxp,cyp = fac*rx*yp/ry,-fac*ry*xp/rx
    cx,cy = c*cxp-s*cyp+(start[0]+end[0])/2,s*cxp+c*cyp+(start[1]+end[1])/2
    theta = atan2((yp-cyp)/ry,(xp-cxp)/rx)
    finish = atan2((-yp-cyp)/ry,(-xp-cxp)/rx)
    delta = (finish-theta)%(2*pi)
    if not sweep and delta>0:
        delta -= 2*pi
    steps = max(16,min(10000,ceil(abs(delta)*max(rx,ry))))
    return [(cx+c*rx*cos(theta+delta*i/steps)-s*ry*sin(theta+delta*i/steps),
             cy+s*rx*cos(theta+delta*i/steps)+c*ry*sin(theta+delta*i/steps)) for i in range(steps+1)]


def path_segments(d):
    tokens = re.findall(r'[a-zA-Z]|'+NUMBER,d)
    i=0; cmd=None; current=(0.,0.); start=current; previous_control=None; previous_cmd=None; segments=[]
    counts={'M':2,'L':2,'H':1,'V':1,'C':6,'S':4,'Q':4,'T':2,'A':7}
    while i<len(tokens):
        if re.fullmatch('[a-zA-Z]',tokens[i]):
            cmd=tokens[i]; i+=1
        up=cmd.upper()
        if up=='Z':
            segments.append((current,start)); current=start; cmd=None; continue
        if up not in counts:
            raise ValueError('Unsupported path command '+str(cmd))
        v=list(map(float,tokens[i:i+counts[up]])); i+=counts[up]
        relative=cmd.islower()
        def p(x,y):
            return (x+current[0],y+current[1]) if relative else (x,y)
        control=None
        if up=='M':
            current=p(*v);start=current;cmd='l' if relative else 'L';previous_control=None;previous_cmd='M';continue
        if up=='L':
            end=p(*v);points=[current,end]
        elif up=='H':
            end=(v[0]+current[0] if relative else v[0],current[1]);points=[current,end]
        elif up=='V':
            end=(current[0],v[0]+current[1] if relative else v[0]);points=[current,end]
        elif up in ['C','S','Q','T']:
            if up=='C':
                c1,c2,end=p(*v[:2]),p(*v[2:4]),p(*v[4:6]); controls=[c1,c2];control=c2
            elif up=='S':
                c1=(2*current[0]-previous_control[0],2*current[1]-previous_control[1]) if previous_cmd in ['C','S'] else current
                c2,end=p(*v[:2]),p(*v[2:]);controls=[c1,c2];control=c2
            elif up=='Q':
                c1,end=p(*v[:2]),p(*v[2:]);controls=[c1];control=c1
            else:
                c1=(2*current[0]-previous_control[0],2*current[1]-previous_control[1]) if previous_cmd in ['Q','T'] else current
                end=p(*v);controls=[c1];control=c1
            points=bezier([current]+controls+[end])
        elif up=='A':
            end=p(*v[-2:]);points=arc(current,v[:5],end)
        segments.extend(zip(points,points[1:]));current=end;previous_control=control;previous_cmd=up
    return segments


def in_defs(el):
    return any(ET.QName(a).localname in ['defs','marker','clipPath','mask'] for a in el.iterancestors())


def check(path):
    errors=[]
    def issue(kind, **info):
        errors.append(dict(check=kind,**info))
    root=ET.parse(str(path)).getroot()
    rules=css_rules(root)
    vx,vy,w,h=map(float,root.get('viewBox').replace(',',' ').split())
    viewport=(vx,vy,vx+w,vy+h)
    if w!=1200:
        issue('viewbox_width',width=w)
    groups=root.xpath('.//s:g[@data-node]',namespaces=NS)
    if path.stem=='g-base' and len(groups)!=12:
        issue('node_count',expected=12,actual=len(groups))
    elif path.stem!='g-base' and len(groups)>9:
        issue('node_count',maximum=9,actual=len(groups))
    rectangles=[];nodes=[]
    for r in root.xpath('.//s:rect',namespaces=NS):
        if in_defs(r):
            continue
        x,y,rw,rh=[num(r.get(k)) for k in ['x','y','width','height']]
        box=bounds(world(r),(x,y,x+rw,y+rh))
        group=node_group(r)
        nodeid=group.get('id',group.get('data-node')) if group is not None else None
        decoration=r.get('data-decoration')=='true' or any(a.get('data-module') for a in r.iterancestors())
        rectangles.append((box,nodeid,decoration,r))
        if group is not None:
            nodes.append((box,nodeid,group))
        if not inside(box,viewport):
            issue('rectangle_outside_viewbox',box=box,node=nodeid)
    for a,b in combinations(rectangles,2):
        if overlaps(a[0],b[0]):
            # Original module backgrounds and other explicitly decorative frames
            # may contain content, but partial rectangle overlaps always fail.
            if (a[2] and inside(b[0],a[0])) or (b[2] and inside(a[0],b[0])):
                continue
            issue('rectangle_overlap',a=a[1] or str(a[0]),b=b[1] or str(b[0]))
    lines=[]
    for t in root.xpath('.//s:text',namespaces=NS):
        if in_defs(t):
            continue
        lines.extend(text_lines(t,rules))
    for box,s,t in lines:
        if not inside(box,viewport):
            issue('text_outside_viewbox',text=s,box=box)
        group=node_group(t)
        if group is not None:
            own=[b for b,n,g in nodes if g is group]
            if own and not any(inside(box,b) for b in own):
                issue('text_outside_own_node',text=s,node=group.get('id',group.get('data-node')))
    for (a,sa,_),(b,sb,_) in combinations(lines,2):
        if overlaps(a,b):
            issue('text_overlap',a=sa,b=sb)
    arrows=[]
    for el in root.xpath('.//s:path | .//s:polyline | .//s:line',namespaces=NS):
        if in_defs(el):
            continue
        marker=property_(el,'marker-end',rules) or property_(el,'marker-start',rules)
        if not marker or marker=='none':
            continue
        tag=ET.QName(el).localname
        if tag=='path':
            segments=path_segments(el.get('d',''))
        elif tag=='polyline':
            nums=list(map(float,re.findall(NUMBER,el.get('points',''))))
            points=list(zip(nums[::2],nums[1::2]));segments=list(zip(points,points[1:]))
        else:
            segments=[((num(el.get('x1')),num(el.get('y1'))),(num(el.get('x2')),num(el.get('y2'))))]
        m=world(el);segments=[(point(m,a),point(m,b)) for a,b in segments]
        label=el.get('id') or el.getparent().get('data-edge') or str(len(arrows)+1)
        arrows.append(el)
        for box,nodeid,_ in nodes:
            if any(segment_hits(a,b,box) for a,b in segments):
                issue('arrow_crosses_node',arrow=label,node=nodeid)
        for box,s,t in lines:
            if any(segment_hits(a,b,box) for a,b in segments):
                issue('arrow_crosses_text',arrow=label,text=s)
    content='\n'.join(root.xpath('.//s:text//text() | ./s:title/text() | ./s:desc/text()',namespaces=NS))
    banned=[word for word in BANNED if re.search(re.escape(word),content,re.I)]
    if re.search(r'\bAction\b',content,re.I):
        banned.append('Action')
    if banned:
        issue('banned_words',words=banned)
    meta=json.loads(path.with_suffix('.json').read_text())
    if set(meta)!={'id','title','subtitle'} or meta.get('id')!=path.stem:
        issue('json_metadata')
    else:
        if root.findtext('s:title',namespaces=NS)!=meta['title'] or root.findtext('s:desc',namespaces=NS)!=meta['subtitle']:
            issue('json_title_subtitle_mismatch')
    checks={name:sum(e['check']==name for e in errors) for name in [
        'viewbox_width','node_count','rectangle_outside_viewbox','rectangle_overlap',
        'text_outside_viewbox','text_outside_own_node','text_overlap',
        'arrow_crosses_node','arrow_crosses_text','banned_words','json_metadata',
        'json_title_subtitle_mismatch']}
    return dict(file=str(path.relative_to(ROOT)),nodes=len(groups),arrows=len(arrows),
                text_lines=len(lines),rectangles=len(rectangles),xml_parse='pass',
                viewBox=[vx,vy,w,h],banned_words=banned,checks=checks,issues=errors,passed=not errors)


def main():
    paths=[ROOT/'figures'/f'{name}.svg' for name in EXPECTED]+[ROOT/'figures-orig/g-base.svg']
    results=[]
    for path in paths:
        try:
            result=check(path)
        except Exception as e:
            result=dict(file=str(path.relative_to(ROOT)),passed=False,issues=[dict(check='parse_or_file_error',error=f'{type(e).__name__}: {e}')])
        results.append(result)
        print(result['file'],str(result.get('nodes','?'))+' nodes', 'PASS' if result['passed'] else 'FAIL')
        for issue in result['issues']:
            print(' ',json.dumps(issue,ensure_ascii=False))
    report=dict(font=FONT_PATH,curve_sampling='at most 1 source SVG unit per segment',
                human_names='requires manual content review',results=results,passed=all(r['passed'] for r in results))
    (ROOT/'figure-checks.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    return 0 if report['passed'] else 1


if __name__=='__main__':
    raise SystemExit(main())
