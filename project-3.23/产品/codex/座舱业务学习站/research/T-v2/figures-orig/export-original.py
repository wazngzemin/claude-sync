from pathlib import Path
from lxml import etree as E
from PIL import ImageFont
import json,copy,re,subprocess,functools
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[3]
SOURCE=ROOT/'HTML/01-进行中/豆包汽车-业务学习站-v72.html'
# Resolve the project root from the named workspace rather than process cwd.
SOURCE=Path('/Users/bytedance/Desktop/3.23/产品/codex/HTML/01-进行中/豆包汽车-业务学习站-v72.html')
p=SOURCE.read_text();data=json.JSONDecoder().raw_decode(p[p.index('const DATA=')+11:])[0]
m=next(x for x in data['base']['modules'] if x['id']=='T')
raw=E.fromstring(data['originalSvg'].encode());NS=raw.nsmap[None];ns={'s':NS}
ids={n['id'] for n in m['nodes']}
fontpath=subprocess.check_output(['fc-match','PingFang SC','-f','%{file}']).decode()
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
def change(node,field,before,after):
 if before!=after:changes.append((node,field,before,after))
 return after

def clean(text,node='',field=''):
 v=text.replace('Director','Planner').replace('DT','Planner')
 v=v.replace('《','').replace('》','')
 return change(node,field,text,v)

out=E.Element('{%s}svg'%NS,nsmap={None:NS})
out.set('id','t-base');out.set('class','v56-figure');out.set('role','img');out.set('aria-labelledby','t-base-title t-base-desc')
# Keep original coordinates and routing. Expanded bounds retain labels clipped by the webpage crop.
view=[10450,14560,3270,6540]
out.set('viewBox',' '.join(map(str,view)));out.set('width',str(view[2]));out.set('height',str(view[3]))
out.set('font-family',raw.get('font-family'))
for tag,value in [('title',m['title']),('desc',m['subtitle'])]:
 e=E.SubElement(out,'{%s}%s'%(NS,tag));e.set('id','t-base-'+('title' if tag=='title' else 'desc'));e.text=value
style=E.SubElement(out,'{%s}style'%NS)
style.text='''svg.v56-figure{background:var(--v56-bg,#fff)}
.v56-pending{stroke-dasharray:7 5}
.v56-legend{font-family:PingFang SC,Microsoft YaHei,Noto Sans CJK SC,Arial,sans-serif;font-size:25px;fill:var(--muted,#617487)}'''
out.append(copy.deepcopy(raw.find('{%s}defs'%NS)))
E.SubElement(out,'{%s}path'%NS,d='M 10450 14560 H 13720 V 21100 H 10450 Z',fill='white',**{'data-decoration':'true'})
frame=copy.deepcopy(raw.xpath('./s:g[@data-module="T"]',namespaces=ns)[0]);out.append(frame)
for e in frame.xpath('./s:rect',namespaces=ns):e.set('data-decoration','true')
connections=E.SubElement(out,'{%s}g'%NS,id='connections')
labels=E.SubElement(out,'{%s}g'%NS,id='connection-labels')
for edge in raw.xpath('.//s:g[@data-from]',namespaces=ns):
 if edge.get('data-from') in ids and edge.get('data-to') in ids:
  connections.append(copy.deepcopy(edge))
  label=raw.xpath('.//s:g[@class="edge-label"][@data-edge="'+edge.get('data-edge')+'"]',namespaces=ns)[0]
  labels.append(copy.deepcopy(label))
for node in raw.xpath('./s:g[@data-node]',namespaces=ns):
 if node.get('data-node') not in ids:continue
 g=copy.deepcopy(node);nid=g.get('data-node')
 g.set('data-node-id',nid)
 # Text cleaning preserves title and every original point row.
 for ti,t in enumerate(g.xpath('./s:text',namespaces=ns)):
  original=''.join(t.itertext());new=clean(original,nid,'文字 '+str(ti+1))
  if nid=='T12' and original.startswith('自建任务中心的容量方案'):
   new=change(nid,'规则数字与账号归属',original,'定时加循环定时最多 20 个；条件加循环条件最多 20 个，视觉观察另限同时 3 个。云端更新推送、上电后拉取用于同步状态。任务属于这个账号 × 这辆车；退出账号即清空，同车重登不恢复，换车不迁移。')
  if new!=original:
   size=int(float(t.get('font-size')));x=t.get('x');dy=t[1].get('dy') if len(t)>1 else str(size*1.38)
   for child in list(t):t.remove(child)
   for i,line in enumerate(wrap(new,668,size)):
    span=E.SubElement(t,'{%s}tspan'%NS,x=x,dy='0' if i==0 else dy);span.text=line
 if nid=='T17':
  g.find('{%s}rect'%NS).set('class','v56-pending')
  changes.append((nid,'边框','实线','虚线：消费通知与修改入口仍在接入'))
 out.append(g)
# Preserve original colors; explain their original meaning with an added legend.
legend=E.SubElement(out,'{%s}g'%NS,id='t-base-legend')
items=[(10786,'#F4F8FE','#ABC2E0','蓝：处理与等待'),(11430,'#FFF8E8','#D6B577','黄：检查与决定'),(12070,'#EFF8F4','#85B6A7','绿：结果与状态')]
for x,fill,stroke,text in items:
 E.SubElement(legend,'{%s}rect'%NS,x=str(x),y='21008',width='25',height='25',rx='8',fill=fill,stroke=stroke,**{'data-decoration':'true'})
 t=E.SubElement(legend,'{%s}text'%NS,x=str(x+38),y='21030',**{'class':'v56-legend'});t.text=text
line=E.SubElement(legend,'{%s}line'%NS,x1='10786',y1='21066',x2='10856',y2='21066',stroke='#8291a0',**{'stroke-dasharray':'7 5'})
t=E.SubElement(legend,'{%s}text'%NS,x='10876',y='21074',**{'class':'v56-legend'});t.text='虚线：部分能力仍在接入'
# Clean visible labels and accessibility attributes as well.
for el in out.iter():
 if el.text:el.text=clean(el.text,el.get('data-node',''),'文本')
 for key in ['aria-label','title']:
  if el.get(key):el.set(key,clean(el.get(key),el.get('data-node',''),key))
HERE.joinpath('t-base.svg').write_bytes(E.tostring(out,encoding='UTF-8',xml_declaration=False,pretty_print=True))
HERE.joinpath('t-base.json').write_text(json.dumps({'id':'t-base','title':m['title'],'subtitle':m['subtitle']},ensure_ascii=False,indent=2)+'\n')
md=['# 原图导出与清理记录','','- 方式：直接解析 v72 页面 DATA.originalSvg，提取 T 模块分组、18 个节点、30 条内部连线及其标签。沿用原 SVG 渲染产物；保留原三列六行位置、节点标题、全部要点行和连线关系。','- 未启动浏览器，未修改网页或正文。','- 独立 SVG 扩大 viewBox，完整保留网页裁剪区外的“用户管理”“未来条件触发”等连线文字。','- 保留原节点内已有解释，除下表所列规则更新和名称清理外不改写。','- 原 SVG 未含来源或日期出处；无需删除。原图中未出现真实人名。','- 加入颜色图例；部分能力仍在接入的 T17 节点使用虚线。','','| 位置 | 清理前 | 清理后 |','|---|---|---|']
for nid,field,b,a in changes:md.append('| '+nid+' · '+field+' | '+b.replace('|','／')+' | '+a.replace('|','／')+' |')
HERE.joinpath('changes.md').write_text('\n'.join(md)+'\n')
print('已导出 t-base：',len(ids),'节点，',len(connections),'连线；文字改动',len(changes),'项')
