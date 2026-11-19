from pathlib import Path
from lxml import etree as E
from PIL import ImageFont
import json, copy, re, subprocess, functools
HERE=Path(__file__).resolve().parent
SOURCE=HERE.parents[3]/'HTML/01-进行中/豆包汽车-业务学习站-v74.html'
p=SOURCE.read_text(); data=json.JSONDecoder().raw_decode(p[p.index('const DATA=')+11:])[0]
m=next(x for x in data['base']['modules'] if x['id']=='G')
raw=E.fromstring(data['originalSvg'].encode()); NS=raw.nsmap[None]; ns={'s':NS}
ids={n['id'] for n in m['nodes']}
fontpath=subprocess.check_output(['fc-match','PingFang SC','-f','%{file}'],text=True).strip()
@functools.lru_cache(None)
def font(size):return ImageFont.truetype(fontpath,size)
def wrap(text,width,size):
 out=[];line=''
 for c in text:
  if line and font(size).getlength(line+c)>width:out.append(line);line=''
  line+=c
 if line:out.append(line)
 return out
changes=[]
def clean(s,nid='',field=''):
 v=s.replace('Director','Planner').replace('DT','Planner').replace('Action','动作').replace('《','').replace('》','')
 if nid=='G11':
  v=v.replace('等待 Task Service 清理','等待任务服务删除场景')
  v=v.replace('语义层暂定用三分钟窗口拒绝旧上报，数值待联调调整；Task Service 入口另有二十秒检查，先筛掉过期任务观察。','旧上报会被拒收；任务服务入口另有二十秒检查，先筛掉过期任务观察。')
 v=v.replace('统一分发需确认场景实际接入','统一分发以场景实际接入为准')
 if s!=v:changes.append((nid,field,s,v))
 return v
TITLE='云端触发器，什么时候值得继续处理'
SUB='登记 → 叫醒 → 取态 → 判断 → 频控 → 派发；到时只回调业务，不直接控车。'
css=re.search(r'<style>(.*?)</style>',(HERE.parents[1]/'T-v2/figures/t2-overview.svg').read_text(),re.S).group(1)
out=E.Element('{%s}svg'%NS,nsmap={None:NS},id='g-base',**{'class':'v56-figure','role':'img','aria-labelledby':'g-base-title g-base-desc'})
# Normalize the original rendering to the required 1200-wide coordinate system.
S=1136/2980; X0=7250; Y0=22040
out.set('width','1200');out.set('height','1740');out.set('viewBox','0 0 1200 1740')
for tag,value in [('title',TITLE),('desc',SUB)]:
 t=E.SubElement(out,'{%s}%s'%(NS,tag),id='g-base-'+('title' if tag=='title' else 'desc'));t.text=value
E.SubElement(out,'{%s}style'%NS).text=css
out.append(copy.deepcopy(raw.find('s:defs',ns)))
for y,cls,text in [(44,'title',TITLE),(72,'subtitle',SUB)]:
 E.SubElement(out,'{%s}text'%NS,x='32',y=str(y),**{'class':'v56-'+cls}).text=text
body=E.SubElement(out,'{%s}g'%NS,id='g-base-original-render',transform=f'translate(32 108) scale({S}) translate({-X0} {-Y0})')
connections=E.SubElement(body,'{%s}g'%NS,id='connections');labels=E.SubElement(body,'{%s}g'%NS,id='connection-labels')
for edge in raw.xpath('.//s:g[@data-from]',namespaces=ns):
 if edge.get('data-from') in ids and edge.get('data-to') in ids:
  connections.append(copy.deepcopy(edge))
  label=copy.deepcopy(raw.xpath('.//s:g[@class="edge-label"][@data-edge="'+edge.get('data-edge')+'"]',namespaces=ns)[0]);labels.append(label)
  for t in label.findall('s:text',ns):
   for span in t:span.text=clean(span.text or '',edge.get('data-edge'),'连线文字')
# Move only three existing connector labels out of neighbouring connector paths.
for eid,nx,ny,nw in [('G-6',8650,23965,180),('G-8',7750,24030,180),('G-14',8250,24950,180)]:
 label=labels.xpath('./s:g[@data-edge="'+eid+'"]',namespaces=ns)[0]
 rect=label.find('s:rect',ns);ox=float(rect.get('x'));oy=float(rect.get('y'))
 dx,dy=nx-ox,ny-oy;rect.set('x',str(nx));rect.set('y',str(ny));rect.set('width',str(nw))
 for t in label.findall('s:text',ns):
  t.set('x',str(float(t.get('x'))+dx));t.set('y',str(float(t.get('y'))+dy))
  for sp in t:
   if sp.get('x'):sp.set('x',str(float(sp.get('x'))+dx))
 changes.append((eid,'标签位置','原位置','移至相邻空白处，避开其他连线；文字与连线关系不变'))
for node in raw.xpath('./s:g[@data-node]',namespaces=ns):
 if node.get('data-node') not in ids:continue
 g=copy.deepcopy(node);nid=g.get('data-node');g.set('data-node-id',nid)
 # Keep the actual rendered title, point rows, paragraphs, positions and connections.
 for ti,t in enumerate(g.findall('s:text',ns)):
  original=''.join(t.itertext());new=clean(original,nid,'文字 '+str(ti+1))
  if new!=original:
   size=int(float(t.get('font-size')));x=t.get('x');dy=t[1].get('dy') if len(t)>1 else str(size*1.38)
   for c in list(t):t.remove(c)
   for i,line in enumerate(wrap(new,668,size)):E.SubElement(t,'{%s}tspan'%NS,x=x,dy='0' if i==0 else dy).text=line
 g.set('aria-label',clean(g.get('aria-label',''),nid,'无障碍标题'))
 if nid=='G08':
  g.find('s:rect',ns).set('class','v56-pending');changes.append((nid,'边框','实线','虚线：统一动作分发按场景接入'))
 body.append(g)
# Original module framing is represented by the standalone title/subtitle. The large
# containing rectangles are omitted, avoiding overlap with actual node rectangles.
for x,kind,label in [(32,'local','蓝：接收、取态与等待'),(420,'decision','黄：条件判断与频控'),(805,'cloud','绿：结果与业务交接')]:
 E.SubElement(out,'{%s}rect'%NS,x=str(x),y='1644',width='18',height='18',rx='8',**{'class':'v56-'+kind,'data-decoration':'true'})
 E.SubElement(out,'{%s}text'%NS,x=str(x+28),y='1658',**{'class':'v56-subtitle'}).text=label
E.SubElement(out,'{%s}rect'%NS,x='32',y='1680',width='18',height='18',rx='8',**{'class':'v56-neutral v56-pending','data-decoration':'true'})
E.SubElement(out,'{%s}text'%NS,x='60',y='1694',**{'class':'v56-subtitle'}).text='虚线：统一动作分发按场景接入；灰：未派发的结果记录'
HERE.joinpath('g-base.svg').write_bytes(E.tostring(out,encoding='UTF-8',pretty_print=True))
HERE.joinpath('g-base.json').write_text(json.dumps({'id':'g-base','title':TITLE,'subtitle':SUB},ensure_ascii=False,indent=2)+'\n')
md=['# 原图导出与清理记录','','- 方式：直接提取 v74 页面的 DATA.originalSvg；沿用原 SVG 渲染产物。保留 12 个节点、16 条内部连线、所有可见标题、要点行、说明段与连线标签。','- 原图导出的依据是实际渲染产物；其可见要点和 base.modules[G].nodes.lines 存在差异，本次未用数据字段覆盖原图。','- 保留原三列四行分组与节点坐标、相对位置和连线路由。整体等比归一化到 viewBox 宽 1200；独立图题替代原模块页眉，去掉包围全部节点的装饰大框，补充颜色图例。','- 未启动浏览器，未修改网页与正文。','- G03 的组合条件与 G05 的且或判断文字照原样保留，没有增加支持任意组合的说法。','- 原渲染产物未包含出处、日期出处、书名号与真实人名；无需额外删除。','- G11 删除三分钟窗口和数值调整表述，保留旧上报拒收、任务服务入口二十秒检查。','','| 位置 | 清理前 | 清理后 |','|---|---|---|']
for nid,field,b,a in changes:md.append('| '+nid+' · '+field+' | '+b.replace('|','／')+' | '+a.replace('|','／')+' |')
HERE.joinpath('changes.md').write_text('\n'.join(md)+'\n')
print('已导出 g-base：',len(ids),'节点，',len(connections),'条连线；清理',len(changes),'项')
