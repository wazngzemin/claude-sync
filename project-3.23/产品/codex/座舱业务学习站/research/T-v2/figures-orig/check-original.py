from pathlib import Path
from lxml import etree as E
from PIL import ImageFont
import json,re,subprocess,functools,io
from PIL import Image
HERE=Path(__file__).resolve().parent
SVG=HERE/'t-base.svg'
NS={'s':'http://www.w3.org/2000/svg'}
FONT_PATH=subprocess.check_output(['fc-match','PingFang SC','-f','%{file}']).decode()
@functools.lru_cache(None)
def font(size):return ImageFont.truetype(FONT_PATH,size)
def box(el):return tuple(float(el.get(k,'0')) for k in ['x','y','width','height'])
def overlap(a,b):return max(a[0],b[0])<min(a[0]+a[2],b[0]+b[2])-0.1 and max(a[1],b[1])<min(a[1]+a[3],b[1]+b[3])-0.1
def segment_hits(a,b,r):
 x,y,w,h=r
 if a[0]==b[0]:return x+0.01<a[0]<x+w-0.01 and max(min(a[1],b[1]),y+0.01)<min(max(a[1],b[1]),y+h-0.01)
 if a[1]==b[1]:return y+0.01<a[1]<y+h-0.01 and max(min(a[0],b[0]),x+0.01)<min(max(a[0],b[0]),x+w-0.01)
 raise AssertionError('非正交连线')
def run():
 r=E.parse(str(SVG)).getroot();view=list(map(float,r.get('viewBox').split()));issues=[]
 nodes=r.xpath('./s:g[@data-node]',namespaces=NS);nrect=[(g.get('data-node'),box(g.find('s:rect',NS))) for g in nodes]
 rects=[e for e in r.xpath('.//s:rect',namespaces=NS) if e.getparent().get('data-module')!='T']
 for i,a in enumerate(rects):
  for b in rects[i+1:]:
   if overlap(box(a),box(b)):issues.append({'check':'rectangle_overlap','a':dict(a.attrib),'b':dict(b.attrib)})
 lines=[]
 for t in r.xpath('.//s:text',namespaces=NS):
  size=round(float(t.get('font-size','25')));x=float(t.get('x','0'));y=float(t.get('y','0'));anchor=t.get('text-anchor','start')
  parts=list(t) if len(t) else [t]
  for s in parts:
   if s is not t:
    if s.get('x'):x=float(s.get('x'))
    if s.get('y'):y=float(s.get('y'))
    y+=float(s.get('dy','0'))
   txt=''.join(s.itertext());f=font(size);ink=f.getbbox(txt,anchor='ls');advance=f.getlength(txt)
   sx=x-advance/2 if anchor=='middle' else x-advance if anchor=='end' else x
   bb=(sx+ink[0],y+ink[1],ink[2]-ink[0],ink[3]-ink[1]);lines.append((txt,bb))
   if bb[0]<view[0] or bb[1]<view[1] or bb[0]+bb[2]>view[0]+view[2] or bb[1]+bb[3]>view[1]+view[3]:issues.append({'check':'text_outside_viewbox','text':txt,'box':bb})
 for i,(a,ba) in enumerate(lines):
  for b,bb in lines[i+1:]:
   if overlap(ba,bb):issues.append({'check':'text_overlap','a':a,'b':b})
 edges=r.xpath('.//s:g[@data-from]',namespaces=NS)
 for g in edges:
  pts=[list(map(float,p.split(','))) for p in g.findall('s:polyline',NS)[-1].get('points').split()]
  for a,b in zip(pts,pts[1:]):
   for nid,nr in nrect:
    if segment_hits(a,b,nr):issues.append({'check':'arrow_crosses_node','edge':g.get('data-edge'),'node':nid})
 rendered=subprocess.run(['rsvg-convert','-w','1400',str(SVG)],capture_output=True,check=True)
 Image.open(io.BytesIO(rendered.stdout)).verify()
 visible=''.join(''.join(e.itertext()) for e in r.xpath('.//s:text | ./s:title | ./s:desc',namespaces=NS))
 banned=re.findall(r'资料|PRD|清单|待确认|口径|没有展开|未展开|DT|小模型|OnePage|技术方案|周报|宣讲|逐字稿|[《》]|Director',visible,re.I)
 if banned:issues.append({'check':'banned_words','found':banned})
 original=Path('/Users/bytedance/Desktop/3.23/产品/codex/HTML/01-进行中/豆包汽车-业务学习站-v72.html').read_text();d=json.JSONDecoder().raw_decode(original[original.index('const DATA=')+11:])[0];m=next(x for x in d['base']['modules'] if x['id']=='T')
 for n in m['nodes']:
  g=next(x for x in nodes if x.get('data-node')==n['id']);texts=g.findall('s:text',NS)
  if ''.join((z.text or '').strip() for z in texts[1].iter())!=n['title']:issues.append({'check':'node_title_preserved','node':n['id']})
  expected=''.join(n['lines']);actual=''.join((z.text or '').strip() for z in texts[2].iter())
  if actual!=expected:issues.append({'check':'point_rows_preserved','node':n['id']})
 if [(e.get('data-from'),e.get('data-to')) for e in edges]!=[(e['from'],e['to']) for e in m['edges']]:issues.append({'check':'edge_relationships_preserved'})
 result={'file':'t-base.svg','method':'export','nodes':len(nodes),'edges':len(edges),'xml_parse':'pass','offline_rsvg_render':'pass','rectangles_checked':len(rects),'text_lines_measured':len(lines),'font':FONT_PATH,'rectangle_overlap':sum(x['check']=='rectangle_overlap' for x in issues),'text_overlap':sum(x['check']=='text_overlap' for x in issues),'text_outside_viewbox':sum(x['check']=='text_outside_viewbox' for x in issues),'arrow_crosses_node':sum(x['check']=='arrow_crosses_node' for x in issues),'banned_words':len(banned),'original_titles_points_edges':'pass' if not any(x['check'] in ['node_title_preserved','point_rows_preserved','edge_relationships_preserved'] for x in issues) else 'fail','issues':issues,'passed':not issues}
 HERE.joinpath('check-results.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps(result,ensure_ascii=False,indent=2))
 return result
if __name__=='__main__':raise SystemExit(0 if run()['passed'] else 1)
