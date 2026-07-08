# -*- coding: utf-8 -*-
# 把"终版大图"按讲稿 12 段各自讲到的节点,裁出 12 张"聚焦局部图"
# 复用 gen_final.py 的节点坐标(REG)与全部 SVG 内容(L),只改 viewBox + 加焦点描边
import json, io, os
HERE=os.path.dirname(os.path.abspath(__file__))

# --- 跑一遍 gen_final.py,拿到 L(全部svg行) / REG(节点坐标) / W,H ---
ns={}
src=open(os.path.join(HERE,'gen_final.py'),encoding='utf-8').read()
exec(compile(src,'gen_final.py','exec'),ns)
L=ns['L']; REG=ns['REG']; W=ns['W']; H=ns['H']
inner='\n'.join(L[1:-1])   # 去掉最外层 <svg> 和 </svg>

P1='#2563eb';P2='#16a34a';P3='#ea580c';P4='#7c3aed';SIG='#a16207';NEU='#0f172a';CY='#0891b2'

# 每段: (焦点节点, 描边色, 是否全图)
SEG={
 1 :(['n9','n13','n15','n19','n20','n3','n4','n24','n26','n29'], NEU, True ),  # 全貌:解决什么问题
 2 :(['n1','n4','n13','n15','n22','n26','n29'],                  NEU, True ),  # 全貌:四区域
 3 :(['n1','n2','n3','n4','n11','n12','n9'],                     SIG, False),  # 入口
 4 :(['n9','n10','n11','n12','n30','n13','n5'],                  NEU, False),  # 9分流口
 5 :(['n9','n2','n5','n6','n7','n8'],                            P1 , False),  # 蓝线
 6 :(['n9','n19','n20','n21','n22','n23','n26','n27','n28','n29'],P2 , False), # 绿线
 7 :(['n9','n10','n13','n14','n15','n24','n20'],                 P3 , False),  # 橙线
 8 :(['n15'],                                                   P1 , False),  # 15引擎
 9 :(['n24'],                                                   P3 , False),  # 24引擎
 10:(['n17','n15','n24','n25'],                                 P4 , False),  # VLM链路
 11:(['n16','n17','n18','n19','n20','n21'],                     P4 , False),  # Advisor/Director/Context
 12:(['n22','n23','n26','n27','n28','n29'],                     P2 , False),  # 异常/降级/执行区
}

def crop(nodes, hl, full):
    if full:
        bx,by,bw,bh = 0,38,W,846
    else:
        xs=[REG[n][0] for n in nodes]; ys=[REG[n][1] for n in nodes]
        xr=[REG[n][0]+REG[n][2] for n in nodes]; yb=[REG[n][1]+REG[n][3] for n in nodes]
        pad=60; topx=26
        bx=max(0,min(xs)-pad); by=max(0,min(ys)-pad-topx)
        bxr=min(W,max(xr)+pad); byb=min(H,max(yb)+pad)
        bw=bxr-bx; bh=byb-by
    # 焦点描边(画在最上层)
    rings=[]
    if not full:
        for n in nodes:
            x,y,w,h=REG[n]
            rings.append(f'<rect x="{x-3}" y="{y-3}" width="{w+6}" height="{h+6}" rx="8" fill="none" stroke="{hl}" stroke-width="3.5" opacity="0.95"/>')
    svg=(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{bx:.0f} {by:.0f} {bw:.0f} {bh:.0f}" '
         f'width="100%" preserveAspectRatio="xMidYMid meet" '
         f'font-family="-apple-system,PingFang SC,Microsoft YaHei,sans-serif">\n'
         f'{inner}\n'+'\n'.join(rings)+'\n</svg>')
    return svg, (bw,bh)

manifest={}
for i in range(1,13):
    nodes,hl,full=SEG[i]
    svg,(bw,bh)=crop(nodes,hl,full)
    fn=os.path.join(HERE,f'seg{i:02d}.svg')
    open(fn,'w',encoding='utf-8').write(svg)
    manifest[i]=svg
    print(f'seg{i:02d}: nodes={nodes} viewBox≈{bw:.0f}x{bh:.0f}  ({"全图" if full else "局部"})')

json.dump({str(k):v for k,v in manifest.items()},
          open(os.path.join(HERE,'segments_manifest.json'),'w',encoding='utf-8'),ensure_ascii=False)
print('done -> segments_manifest.json')
