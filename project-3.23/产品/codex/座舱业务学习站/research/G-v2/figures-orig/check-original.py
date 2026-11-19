from pathlib import Path
from lxml import etree as E
from PIL import ImageFont, Image
import json,re,subprocess,functools,io,itertools
HERE=Path(__file__).resolve().parent;NS={'s':'http://www.w3.org/2000/svg'}
FONT=subprocess.check_output(['fc-match','PingFang SC','-f','%{file}'],text=True).strip()
SIZES={'v56-title':24,'v56-subtitle':14,'v56-node-title':16,'v56-node-sub':14,'v56-label':14}
@functools.lru_cache(None)
def font(n):return ImageFont.truetype(FONT,n)
def overlap(a,b):return min(a[2],b[2])-max(a[0],b[0])>.1 and min(a[3],b[3])-max(a[1],b[1])>.1
def hits(a,b,r):
 lo,hi=0.,1.
 for p,d,mn,mx in [(a[0],b[0]-a[0],r[0]+.01,r[2]-.01),(a[1],b[1]-a[1],r[1]+.01,r[3]-.01)]:
  if abs(d)<1e-9:
   if not mn<p<mx:return False
  else:
   q=sorted([(mn-p)/d,(mx-p)/d]);lo=max(lo,q[0]);hi=min(hi,q[1])
   if hi<=lo:return False
 return hi>lo

def run():
 r=E.parse(str(HERE/'g-base.svg')).getroot();view=list(map(float,r.get('viewBox').split()));issues=[]
 body=r.find('s:g[@id="g-base-original-render"]',NS);nums=list(map(float,re.findall(r'-?\d+(?:\.\d+)?',body.get('transform'))));tx,ty,s,x0,y0=nums
 def xy(e,x,y):return (tx+s*(x+x0),ty+s*(y+y0)) if body in e.iterancestors() else (x,y)
 def box(e):
  x,y,w,h=[float(e.get(k,'0')) for k in ['x','y','width','height']];a=xy(e,x,y);b=xy(e,x+w,y+h);return (*a,*b)
 nodes=r.xpath('.//s:g[@data-node]',namespaces=NS);nrect=[(g.get('data-node'),box(g.find('s:rect',NS))) for g in nodes]
 rects=[(e,box(e)) for e in r.xpath('.//s:rect',namespaces=NS)]
 for (a,ba),(b,bb) in itertools.combinations(rects,2):
  if overlap(ba,bb):issues.append({'check':'rectangle_overlap','a':a.getparent().get('data-node',a.getparent().get('data-edge','legend')),'b':b.getparent().get('data-node',b.getparent().get('data-edge','legend'))})
 lines=[]
 for t in r.xpath('.//s:text',namespaces=NS):
  size=round(float(t.get('font-size',SIZES.get(t.get('class'),14))));x=float(t.get('x','0'));y=float(t.get('y','0'));anchor=t.get('text-anchor','start')
  parts=list(t) if len(t) else [t]
  for sp in parts:
   if sp is not t:
    if sp.get('x'):x=float(sp.get('x'))
    if sp.get('y'):y=float(sp.get('y'))
    y+=float(sp.get('dy','0'))
   txt=''.join(sp.itertext());f=font(size);ink=f.getbbox(txt,anchor='ls');advance=f.getlength(txt)
   sx=x-advance/2 if anchor=='middle' else x-advance if anchor=='end' else x
   a=xy(t,sx+ink[0],y+ink[1]);b=xy(t,sx+ink[2],y+ink[3]);bb=(*a,*b);lines.append((txt,bb))
   if bb[0]<view[0] or bb[1]<view[1] or bb[2]>view[0]+view[2] or bb[3]>view[1]+view[3]:issues.append({'check':'text_outside_viewbox','text':txt,'box':bb})
 for (a,ba),(b,bb) in itertools.combinations(lines,2):
  if overlap(ba,bb):issues.append({'check':'text_overlap','a':a,'b':b})
 edges=r.xpath('.//s:g[@data-from]',namespaces=NS)
 for g in edges:
  pts=[xy(g,*map(float,p.split(','))) for p in g.findall('s:polyline',NS)[-1].get('points').split()]
  for a,b in zip(pts,pts[1:]):
   for nid,nr in nrect:
    if hits(a,b,nr):issues.append({'check':'arrow_crosses_node','edge':g.get('data-edge'),'node':nid})
   for text,bb in lines:
    if hits(a,b,bb):issues.append({'check':'arrow_crosses_text','edge':g.get('data-edge'),'text':text})
 rendered=subprocess.run(['rsvg-convert','-w','1200',str(HERE/'g-base.svg')],capture_output=True,check=True);Image.open(io.BytesIO(rendered.stdout)).verify()
 visible=''.join(''.join(e.itertext()) for e in r.xpath('.//s:text | ./s:title | ./s:desc',namespaces=NS))
 banned=re.findall(r'资料|PRD|清单|待确认|口径|没有展开|未展开|DT|小模型|OnePage|技术方案|周报|宣讲|逐字稿|[《》]|Director',visible,re.I)
 if banned:issues.append({'check':'banned_words','found':banned})
 # Compare directly to the actual original SVG rendering, applying only logged cleaning.
 import importlib.util
 spec=importlib.util.spec_from_file_location('exp',HERE/'export-original.py');exp=importlib.util.module_from_spec(spec);spec.loader.exec_module(exp)
 source=E.fromstring(exp.data['originalSvg'].encode());oldns={'s':source.nsmap[None]}
 for n in nodes:
  nid=n.get('data-node');old=source.xpath('./s:g[@data-node="'+nid+'"]',namespaces=oldns)[0]
  before=old.findall('s:text',oldns);after=n.findall('s:text',NS)
  if len(before)!=len(after):issues.append({'check':'text_blocks_preserved','node':nid})
  for i,(a,b) in enumerate(zip(before,after)):
   if re.sub(r'\s+','',exp.clean(''.join(a.itertext()),nid))!=re.sub(r'\s+','',''.join(b.itertext())):issues.append({'check':'title_points_paragraphs_preserved','node':nid,'block':i})
 if [(e.get('data-from'),e.get('data-to')) for e in edges]!=[(e['from'],e['to']) for e in exp.m['edges']]:issues.append({'check':'edge_relationships_preserved'})
 meta=json.loads((HERE/'g-base.json').read_text())
 if set(meta)!={'id','title','subtitle'} or meta['id']!='g-base':issues.append({'check':'JSON_metadata'})
 result={'file':'g-base.svg','method':'export','nodes':len(nodes),'edges':len(edges),'viewBox':view,'xml_parse':'pass','offline_rsvg_render':'pass','rectangles_checked':len(rects),'text_lines_measured':len(lines),'font':FONT,'rectangle_overlap':sum(x['check']=='rectangle_overlap' for x in issues),'text_overlap':sum(x['check']=='text_overlap' for x in issues),'text_outside_viewbox':sum(x['check']=='text_outside_viewbox' for x in issues),'arrow_crosses_node':sum(x['check']=='arrow_crosses_node' for x in issues),'arrow_crosses_text':sum(x['check']=='arrow_crosses_text' for x in issues),'banned_words':len(banned),'original_titles_points_paragraphs_edges':'pass' if not any(x['check'] in ['title_points_paragraphs_preserved','edge_relationships_preserved','text_blocks_preserved'] for x in issues) else 'fail','issues':issues,'passed':not issues}
 (HERE/'check-results.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps(result,ensure_ascii=False,indent=2));return result
if __name__=='__main__':raise SystemExit(0 if run()['passed'] else 1)
