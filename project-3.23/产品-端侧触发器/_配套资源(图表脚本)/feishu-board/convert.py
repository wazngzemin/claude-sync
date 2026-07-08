# -*- coding: utf-8 -*-
# 纯格式转换：终版.svg -> 画板原生 SVG，文字/坐标/字号一个不改
import re
src="/Users/bytedance/Desktop/3.23/产品-端侧触发器/diagrams-v2/触发器全模块大图-终版.svg"
svg=open(src,encoding='utf-8').read()
# 1) 去 font-family
svg=re.sub(r'\sfont-family="[^"]*"','',svg,count=1)
# 2) 去 filter 定义 + 引用（feDropShadow 画板不支持）
svg=re.sub(r'<filter id="sh".*?</filter>\s*','',svg,flags=re.S)
svg=svg.replace(' filter="url(#sh)"','')
# 3) 拆 defs（marker 保留，不动），只处理正文里的 <path>
i=svg.index('</defs>')+len('</defs>')
head,body=svg[:i],svg[i:]
def conv(m):
    t=m.group(0)
    d=re.search(r'\sd="([^"]*)"',t).group(1)
    pts=re.findall(r'(-?\d+\.?\d*),(-?\d+\.?\d*)',d)
    fill=(re.search(r'fill="([^"]*)"',t) or [None,'none'])[1]
    stroke=(re.search(r'stroke="([^"]*)"',t) or [None,'none'])[1]
    sw=(re.search(r'stroke-width="([^"]*)"',t) or [None,'1'])[1]
    mk=re.search(r'marker-end="([^"]*)"',t)
    mke=f' marker-end="{mk.group(1)}"' if mk else ''
    if fill!='none':           # 菱形（判定节点 9/6）→ 同包围盒矩形（文字本就是单独的<text>，不动）
        xs=[float(a) for a,b in pts]; ys=[float(b) for a,b in pts]
        x,y=min(xs),min(ys); w,h=max(xs)-x,max(ys)-y
        return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
    p=' '.join(f'{a},{b}' for a,b in pts)   # 连线 path → polyline（直线/折线=原生连接器）
    return f'<polyline points="{p}" fill="none" stroke="{stroke}" stroke-width="{sw}"{mke}/>'
body=re.sub(r'<path\s[^>]*/>',conv,body)
out=head+body
open('board_exact.svg','w',encoding='utf-8').write(out)
# 统计：确认没有残留 path（正文）、filter
print('残留正文<path>:',body.count('<path'))
print('残留 filter:',out.count('filter='))
print('rect数:',out.count('<rect'),' polyline数:',out.count('<polyline'),' text数:',out.count('<text'))
