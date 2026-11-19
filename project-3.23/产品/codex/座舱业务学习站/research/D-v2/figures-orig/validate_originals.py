from pathlib import Path
import json,os,re,subprocess,xml.etree.ElementTree as E
ROOT=Path(__file__).resolve().parent;N='{http://www.w3.org/2000/svg}'
files=list(ROOT.glob('*.svg'));rows=[];texts=[]
for p in files:
 r=E.parse(p).getroot()
 for e in r.iter(N+'text'):
  texts.append((p.name,e));rows.append({'text':''.join(e.itertext()),'size':float(e.get('font-size','14'))})
env=dict(os.environ,SWIFT_MODULECACHE_PATH='/private/tmp/dorig-swift-cache',CLANG_MODULE_CACHE_PATH='/private/tmp/dorig-clang-cache')
res=subprocess.run(['swift',str(ROOT/'measure_text.swift')],input=json.dumps(rows),capture_output=True,text=True,check=True,env=env)
widths=json.loads(res.stdout);wm={id(e):row['width'] for (_,e),row in zip(texts,widths)}
report=[]
for p in files:
 r=E.parse(p).getroot();W,H=map(float,r.get('viewBox').split()[2:]);errors=[];boxes=[];rects=[]
 for e in r.iter(N+'rect'):
  x,y,w,h=[float(e.get(k,'0')) for k in ['x','y','width','height']];rects.append((x,y,x+w,y+h,e))
 for i,a in enumerate(rects):
  for b in rects[i+1:]:
   if min(a[2],b[2])>max(a[0],b[0]) and min(a[3],b[3])>max(a[1],b[1]):errors.append('rect overlap')
 for e in r.iter(N+'text'):
  t=''.join(e.itertext());sz=float(e.get('font-size','14'));tw=wm[id(e)];x=float(e.get('x'));y=float(e.get('y'));a=e.get('text-anchor','start');left=x-(tw/2 if a=='middle' else tw if a=='end' else 0);box=(left,y-sz,left+tw,y+sz*.25);boxes.append((box,t))
  if box[0]<0 or box[1]<0 or box[2]>W or box[3]>H:errors.append('text outside viewbox: '+t)
  for nx,ny,nr,nb,node in rects:
   if node.get('data-node')=='true' and nx<=x<=nr and ny<=y<=nb and (left<nx+4 or left+tw>nr-4 or y-sz<ny):errors.append('text outside node: '+t)
 for i,(a,t) in enumerate(boxes):
  for b,u in boxes[i+1:]:
   if min(a[2],b[2])-max(a[0],b[0])>1 and min(a[3],b[3])-max(a[1],b[1])>1:errors.append('text overlap: '+t+' / '+u)
 # Orthogonal arrows: verify no segment cuts the interior of an unrelated rectangular node.
 nodes=[q for q in rects if q[-1].get('data-node')=='true']
 for e in r.iter(N+'path'):
  if not e.get('marker-end'):continue
  vals=list(map(float,re.findall(r'[-+]?(?:\d*\.\d+|\d+)',e.get('d',''))));points=list(zip(vals[::2],vals[1::2]))
  for nx,ny,nr,nb,node in nodes:
   if any(nx-.1<=x<=nr+.1 and ny-.1<=y<=nb+.1 for x,y in [points[0],points[-1]]):continue
   for (x1,y1),(x2,y2) in zip(points,points[1:]):
    if abs(x1-x2)<.01 and nx+.1<x1<nr-.1 and min(y1,y2)<nb-.1 and max(y1,y2)>ny+.1:errors.append('arrow cuts node')
    if abs(y1-y2)<.01 and ny+.1<y1<nb-.1 and min(x1,x2)<nr-.1 and max(x1,x2)>nx+.1:errors.append('arrow cuts node')
 report.append({'file':p.name,'nodes':int(r.get('data-node-count')),'font_measurement':'macOS CoreText PingFang SC','xml_parse':'pass','viewbox_text':'pass' if not any('viewbox' in x for x in errors) else 'failed','text_in_node':'pass' if not any('outside node' in x for x in errors) else 'failed','text_overlap':'pass' if not any('text overlap' in x for x in errors) else 'failed','all_rect_overlap':'pass' if not any('rect overlap' in x for x in errors) else 'failed','arrow_crossing_rect_nodes':'pass' if not any('arrow cuts' in x for x in errors) else 'failed','errors':errors})
print(json.dumps(report,ensure_ascii=False,indent=2));(ROOT/'geometry-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
assert not any(x['errors'] for x in report)
