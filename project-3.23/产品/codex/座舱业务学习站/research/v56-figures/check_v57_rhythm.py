"""Generate/validate the v57 rhythm figure without launching a browser."""
from pathlib import Path
import json, re, xml.etree.ElementTree as ET
from html import escape
from PIL import ImageFont

HERE = Path(__file__).resolve().parent
SVG = HERE / 'v57-rhythm.svg'
META = HERE / 'v57-rhythm.json'
REPORT = HERE / 'v57-rhythm-check.json'
W, H = 1200, 760
TITLE = '对话节奏管理，把这些时机放回一起看'
SUB = '七项能力共同管理车内对话节奏；功能清单没有展开的机制，在图中明确标出。'
CSS = re.search(r'<style>(.*?)</style>', (HERE/'v56-three-decisions.svg').read_text(), re.S)[1]
NODES = [
    ('vad', 32, 126, 340, 126, 'v56-local', [
        ('v56-node-title', 'VAD 判停'),
        ('v56-node-sub', '根据发声与停顿，判断这段话何时收尾。'),
        ('v56-label', 'VAD → 第四段')]),
    ('quick', 430, 126, 340, 126, 'v56-local', [
        ('v56-node-title', '快速接话'),
        ('v56-node-sub', '用预请求提前准备，减少接话等待。'),
        ('v56-label', '预请求 → 第四段')]),
    ('interrupt', 828, 126, 340, 126, 'v56-local', [
        ('v56-node-title', '语音打断'),
        ('v56-node-sub', '用户插话时让出话头，并衔接恢复。'),
        ('v56-label', '停播 → 第五段；恢复 → 第十三段')]),
    ('queue', 32, 326, 340, 126, 'v56-neutral', [
        ('v56-node-title', '多人插队'),
        ('v56-node-sub', '管理多人插入对话时的交互节奏。'),
        ('v56-label', '资料未展开')]),
    ('fallback', 32, 506, 340, 126, 'v56-neutral', [
        ('v56-node-title', '异常兜底'),
        ('v56-node-sub', '管理对话节奏出现异常时的兜底。'),
        ('v56-label', '资料未展开')]),
    ('merge', 828, 326, 340, 126, 'v56-neutral', [
        ('v56-node-title', '多任务反馈合并'),
        ('v56-node-sub', '管理多个任务的反馈怎样合并。'),
        ('v56-label', '资料未展开')]),
    ('stream', 828, 506, 340, 146, 'v56-neutral', [
        ('v56-node-title', '流式回复节奏'),
        ('v56-node-sub', '管理回复陆续输出时的节奏。'),
        ('v56-label', '节奏机制资料未展开'),
        ('v56-node-sub', '第十三段仅讲流式播放')]),
    ('center', 430, 350, 340, 192, 'v56-decision', [
        ('v56-node-title', '对话节奏管理'),
        ('v56-node-title', '（全双工流式判断）'),
        ('v56-node-sub', '让车内对话像自然交流。'),
        ('v56-node-sub', '统领判停、接话与后续回复时机。')]),
]
# Links describe membership only. Routes stay outside all non-endpoint nodes.
EDGES = [
 ('center', 'vad', [(470,350),(372,252)]),
 ('center', 'quick', [(600,350),(600,252)]),
 ('center', 'interrupt', [(730,350),(828,252)]),
 ('center', 'queue', [(430,400),(372,389)]),
 ('center', 'fallback', [(430,490),(372,569)]),
 ('center', 'merge', [(770,400),(828,389)]),
 ('center', 'stream', [(770,490),(828,579)]),
]

def generate():
    p=[f'<svg xmlns="http://www.w3.org/2000/svg" class="v56-figure" id="v57-rhythm" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-labelledby="v57-rhythm-title v57-rhythm-desc">',
       f'<title id="v57-rhythm-title">{TITLE}</title><desc id="v57-rhythm-desc">{SUB}</desc>',
       f'<style>{CSS}</style>',
       f'<text class="v56-title" x="32" y="44">{TITLE}</text>',
       f'<text class="v56-subtitle" x="32" y="72">{SUB}</text>']
    for source,target,points in EDGES:
        d='M '+' L '.join(f'{x} {y}' for x,y in points)
        p.append(f'<path class="v56-arrow" d="{d}" data-from="{source}" data-to="{target}"/>')
    for ident,x,y,w,h,cls,lines in NODES:
        p.append(f'<g data-node="true" data-id="{ident}"><rect class="{cls}" x="{x}" y="{y}" width="{w}" height="{h}" rx="8" stroke-width="1.6"/>')
        for i,(textcls,text) in enumerate(lines):
            tx=x+14;ty=y+28+i*25
            p.append(f'<text class="{textcls}" x="{tx}" y="{ty}" text-anchor="start">{escape(text)}</text>')
        p.append('</g>')
    p.append('<text class="v56-subtitle" x="32" y="708">连线表示能力归属，不表示执行先后；章节定位用于回看。</text>')
    p.append('</svg>')
    SVG.write_text('\n'.join(p)+'\n')
    META.write_text(json.dumps({
        'id':'v57-rhythm', 'title':TITLE, 'subtitle':SUB,
        'after_heading':'四、他说完了没有　短暂停顿先准备，正式收尾再交办 / 对话节奏管理，把这些时机放回一起看；在新增 h3 标题之后插入 <!-- figure:v57-rhythm -->。'
    }, ensure_ascii=False, indent=2)+'\n')

def overlap(a,b):
    return a[0]<b[2] and a[2]>b[0] and a[1]<b[3] and a[3]>b[1]

def crosses(a,b,r):
    # Liang–Barsky; shrink rectangle so touching a boundary is allowed.
    x0,y0=a;x1,y1=b;dx=x1-x0;dy=y1-y0
    left,top,right,bottom=(r[0]+.01,r[1]+.01,r[2]-.01,r[3]-.01)
    t0,t1=0.,1.
    for pp,qq in [(-dx,x0-left),(dx,right-x0),(-dy,y0-top),(dy,bottom-y0)]:
        if pp==0:
            if qq<0:return False
        else:
            t=qq/pp
            if pp<0:t0=max(t0,t)
            else:t1=min(t1,t)
            if t0>t1:return False
    return True

def check():
    root=ET.parse(SVG).getroot();ns='{http://www.w3.org/2000/svg}'
    fontpaths=list(Path('/System/Library/AssetsV2/com_apple_MobileAsset_Font7').glob('*/AssetData/PingFang.ttc'))
    fontpath=fontpaths[0] if fontpaths else Path('/System/Library/Fonts/STHeiti Light.ttc')
    sizes={key:int(size) for key,size in re.findall(r'\.(v56-[\w-]+)\{font-size:(\d+)px',CSS)}
    fonts={size:ImageFont.truetype(str(fontpath),size) for size in sizes.values()}
    nodes=[];texts=[];issues=[]
    for node in root.findall(f'{ns}g'):
        rect=node.find(f'{ns}rect');x=float(rect.attrib['x']);y=float(rect.attrib['y'])
        box=(x,y,x+float(rect.attrib['width']),y+float(rect.attrib['height']))
        nodes.append((node.attrib['data-id'],box))
    parents={el:node for node in root.findall(f'{ns}g') for el in node.findall(f'{ns}text')}
    for el in root.iter(f'{ns}text'):
        text=''.join(el.itertext());font=fonts[sizes[el.attrib['class']]]
        x=float(el.attrib['x']);y=float(el.attrib['y'])
        l,t,r,b=font.getbbox(text,anchor='ls')
        # Pad measured ink by 2px to cover weight/font fallback variation.
        box=(x+l-2,y+t-2,x+r+2,y+b+2)
        texts.append((text,box))
        if box[0]<0 or box[1]<0 or box[2]>W or box[3]>H:issues.append(['canvas-overflow',text])
        parent=parents.get(el)
        if parent is not None:
            nodeid=parent.attrib['data-id'];nodebox=dict(nodes)[nodeid]
            if not(nodebox[0]+8<=box[0] and box[2]<=nodebox[2]-8 and nodebox[1]+8<=box[1] and box[3]<=nodebox[3]-8):issues.append(['node-overflow',nodeid,text])
            for otherid,otherbox in nodes:
                if otherid!=nodeid and overlap(box,otherbox):issues.append(['text-crosses-node',text,otherid])
    for i,(a,boxa) in enumerate(nodes):
        for b,boxb in nodes[i+1:]:
            if overlap(boxa,boxb):issues.append(['node-overlap',a,b])
    for i,(a,boxa) in enumerate(texts):
        for b,boxb in texts[i+1:]:
            if overlap(boxa,boxb):issues.append(['text-overlap',a,b])
    for source,target,points in EDGES:
        for a,b in zip(points,points[1:]):
            for ident,box in nodes:
                if ident not in (source,target) and crosses(a,b,box):issues.append(['link-crosses-node',source,target,ident])
    data={'id':'v57-rhythm','node_count':len(nodes),'text_count':len(texts),'font':str(fontpath),'font_padding_px':2,'canvas':[W,H],'checks':['SVG/XML parse','text inside canvas','node text inside its node','all text boxes pairwise non-overlapping','all node boxes pairwise non-overlapping','text does not cross other nodes','links do not cross unrelated nodes'],'issues':issues,'passed':not issues,'browser_started':False,'source':'【子功能】输入触发管理!B12:C12'}
    REPORT.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(data,ensure_ascii=False))
    assert len(nodes)==8
    assert not issues,issues

if __name__=='__main__':
    generate()
    check()
