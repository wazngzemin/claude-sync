from pathlib import Path
import json, copy, math, re, html, subprocess
ROOT=Path('/Users/bytedance/Desktop/3.23/产品/codex')
SRC=ROOT/'上汽定时任务-v04-delivery'; OUT=ROOT/'上汽定时任务-v04-assets'
names=['01-架构总览','02-创建与注册','03-定时到点执行','04-条件触发执行','05-修改与取消','06-状态与结果']
reports=[]
for i,name in enumerate(names,1):
 if i==1:continue
 source=SRC/f'{i:02}-latest-user-nodes.json'
 raw=json.loads(source.read_text())['nodes']; nodes=copy.deepcopy(raw)
 # Canvas-wide opaque rectangle is unnecessary on the native board, and may cover all prior nodes.
 removed=[n for n in nodes if n['type']=='composite_shape' and n['width']>=1800 and n['height']>=2000]
 nodes=[n for n in nodes if n not in removed]
 svg_to_diamond=[]
 for n in nodes:
  if n['type']=='svg':
   code=n['svg']['svg_code']; fill=re.search(r'fill="(#[0-9A-Fa-f]{6})"',code)
   n['type']='composite_shape';n['composite_shape']={'type':'diamond'};n.pop('svg');n['style']={'border_color':'#678198','border_color_type':1,'border_opacity':100,'border_style':'solid','border_width':'narrow','fill_color':fill[1] if fill else '#DCEEE3','fill_color_type':1,'fill_opacity':100};n['text']={'text':''};svg_to_diamond.append(n['id'])
 shapes=[n for n in nodes if n['type']=='composite_shape']
 merged={};unmerged=[]
 for t in [n for n in nodes if n['type']=='text_shape']:
  cx=t['x']+t['width']/2;cy=t['y']+t['height']/2
  candidates=[s for s in shapes if s['x']-4<=cx<=s['x']+s['width']+4 and s['y']-4<=cy<=s['y']+s['height']+4]
  if candidates:
   s=min(candidates,key=lambda s:s['width']*s['height']);merged.setdefault(s['id'],[]).append(t)
  else:unmerged.append(t['id'])
 deleted=set()
 for s in shapes:
  ts=sorted(merged.get(s['id'],[]),key=lambda t:(t['y'],t['x']))
  if ts:
   tx=copy.deepcopy(ts[0]['text']);tx['text']='\n'.join(t['text']['text'] for t in ts);tx['horizontal_align']='center';tx['vertical_align']='mid';tx['angle']=0;tx['text_color_type']=1;tx['text_color']='#1B3144';s['text']=tx;deleted.update(t['id'] for t in ts)
 nodes=[n for n in nodes if n['id'] not in deleted]
 # Feishu applies inner padding to composite shape text. Short caption backgrounds need
 # more height than the SVG text line; retain their centre so arrows and labels stay put.
 for n in nodes:
  if n['type']=='composite_shape' and n['height']<=65 and n.get('style',{}).get('fill_color','').lower()=='#ffffff':
   cx=n['x']+n['width']/2;cy=n['y']+n['height']/2
   n['width']+=24;n['height']=60;n['x']=cx-n['width']/2;n['y']=cy-30
 # There are no full-canvas backgrounds, and all inner texts are bound to their host shapes.
 def layer(n):
  if n['type']=='connector':return 0
  if n['type']=='composite_shape':
   return 1 if n['height']<=65 and n.get('style',{}).get('fill_color','').lower()=='#ffffff' else 2
  return 3
 nodes.sort(key=lambda n:(layer(n),n.get('z_index',0)))
 for z,n in enumerate(nodes):n['z_index']=z
 before='\n'.join(n.get('text',{}).get('text','') for n in raw if n.get('text',{}).get('text'))
 after='\n'.join(n.get('text',{}).get('text','') for n in nodes if n.get('text',{}).get('text'))
 norm=lambda s:re.sub(r'\s+','',s)
 from collections import Counter
 assert Counter(norm(before))==Counter(norm(after)),name
 (OUT/(name+'-native.json')).write_text(json.dumps({'nodes':nodes},ensure_ascii=False,indent=2))
 # Local rendering from the actual native payload, not from original SVG.
 W=1900;H=math.ceil(max(n['y']+n['height'] for n in nodes)+30)
 parts=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">','<defs><marker id="arrow" markerWidth="12" markerHeight="10" refX="10" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#42617D"/></marker></defs>',f'<rect width="{W}" height="{H}" fill="white"/>']
 for n in nodes:
  typ=n['type'];x,y,w,h=[n[k] for k in ('x','y','width','height')];style=n.get('style',{})
  if typ=='connector':
   c=n['connector'];a=c['start'].get('position',{'x':x,'y':y});b=c['end'].get('position',{'x':x+w,'y':y+h});pts=[a]+[{'x':p['x']+x,'y':p['y']+y} for p in c.get('turning_points',[])]+[b];ps=' '.join(f"{p['x']},{p['y']}" for p in pts); arrow=' marker-end="url(#arrow)"' if c['end'].get('arrow_style')!='none' else '';dash=' stroke-dasharray="8 6"' if style.get('border_style')=='dashed' else '';parts.append(f'<polyline points="{ps}" fill="none" stroke="{style.get("border_color","#42617D")}" stroke-width="2.8"{arrow}{dash}/>');continue
  if typ=='composite_shape':
   fill=style.get('fill_color','#FFFFFF');stroke=style.get('border_color','#678198') if style.get('border_style')!='none' else 'none'
   if n['composite_shape']['type']=='diamond':
    parts.append(f'<polygon points="{x+w/2},{y} {x+w},{y+h/2} {x+w/2},{y+h} {x},{y+h/2}" fill="{fill}" stroke="{stroke}" stroke-width="2"/>')
   else:parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="11" fill="{fill}" stroke="{stroke}" stroke-width="2"/>')
  tx=n.get('text',{});text=tx.get('text','')
  if not text:continue
  size=tx.get('font_size',24);lines=text.split('\n');anchor=tx.get('horizontal_align','center');anchor={'center':'middle','left':'start','right':'end'}.get(anchor,'middle');xx=x+w/2 if anchor=='middle' else (x if anchor=='start' else x+w)
  yy=y+h/2-(len(lines)-1)*size*1.38/2+size*.34 if typ=='composite_shape' else y+size
  parts.append(f'<text x="{xx}" y="{yy}" font-size="{size}" fill="{tx.get("text_color","#1B3144")}" text-anchor="{anchor}" font-weight="{700 if tx.get("font_weight")=="bold" else 400}">'+''.join(f'<tspan x="{xx}" dy="{0 if j==0 else size*1.38}">{html.escape(s)}</tspan>'for j,s in enumerate(lines))+'</text>')
 parts.append('</svg>');svg=OUT/(name+'-native-preview.svg');svg.write_text('\n'.join(parts));subprocess.run(['rsvg-convert','-o',str(OUT/(name+'-native-preview.png')),str(svg)],check=True)
 reports.append({'chart':name,'before_nodes':len(raw),'after_nodes':len(nodes),'removed_canvas':[n['id']for n in removed],'native_diamonds':len(svg_to_diamond),'bound_text_nodes':len(deleted),'standalone_text':len(unmerged),'preserved_text_characters':True,'height':H})
(OUT/'修复报告.json').write_text(json.dumps(reports,ensure_ascii=False,indent=2))
print(json.dumps(reports,ensure_ascii=False,indent=2))
