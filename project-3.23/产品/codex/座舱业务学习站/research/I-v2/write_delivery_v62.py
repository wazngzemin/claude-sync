from pathlib import Path
import json,re,hashlib
H=Path(__file__).resolve().parent
R=H.parent/'R-v2'
root=H.parents[2]
load=lambda p:json.loads(p.read_text())
m=load(H/'build-manifest-v62.json')
v=load(H/'verification-v62.json')
rv=load(R/'verification-r-v62.json')
rc=load(R/'changes-v62.json')
ic=load(H/'original-figure-changes-v62.json')
assert v['passed'] and rv['passed']
base=Path(m['base']);out=Path(m['output'])
assert hashlib.sha256(base.read_bytes()).hexdigest()==m['baselineSha256']
a,b=base.read_text(),out.read_text()
scripts=lambda s:re.findall(r'<script([^>]*)>([\s\S]*?)</script>',s)
assert scripts(a)[2][1].replace("revision: 'v61'","revision: 'v62'").replace('我的修订-v61.html','我的修订-v62.html')==scripts(b)[2][1]
mask=lambda s:re.sub(r'<script([^>]*)>[\s\S]*?</script>',r'<script\1>__CONTENT__</script>',s).replace('<title>豆包汽车业务学习站 v61</title>','<title>豆包汽车业务学习站 v62</title>')
assert mask(a)==mask(b)
c=v['counts'];n=v['narrativeComparison']
lines=['# 豆包汽车业务学习站 v62 交付说明','',f'输出：`{out}`','',
'已生成 v62；v61、I 章四份 part 原稿、R 章原 full.md、原 SVG 均未改。全程未启动浏览器。','',
'## I 章数量','',
'| 项目 | 数量 |','|---|---:|',
f"| 正文 h2 | {c['h2']} |",f"| 正文 h3 | {c['h3']} |",f"| 含图框标题的全部 h3 | {c['h3IncludingFigures']} |",f"| SVG 实例 | {c['svg']} |",f"| 正文图位 | {c['figureSlots']} |",f"| 正文独立图资源 | {c['uniqueFigureAssets']} |",f"| 例子 | {c['examples']} |",f"| 案例 | {c['cases']} |",f"| details | {c['details']} |",'',
'SVG 实例包含重复出现的 i-overview，以及第一个折叠中的原始 18 节点全图。两个折叠默认关闭：原始全图、附二历史版本与关键数字。','',
'## 正文逐字核对','',
f"I-v2/full.md 与 part-1～4 顺序合并的结果逐字一致，只移除非 figure HTML 注释；本轮移除 {len(m['removedComments'])} 条注释。所有 figure 图位保留。",
f"I 章独立 CommonMark 渲染后，{n['blocks']} 个正文块与网页逐字一致，粗体和标题全部一致；去除图框、原始图折叠与展示容器后，完整正文 DOM 一致。核对保留正文字符，不把 Markdown 标记和 HTML 标签当作相同字节。",
'R 章独立验收确认：v61 正文与原 full.md 一致，v62 正文与 full-v62.md 一致。12 个授权替换逆向还原后，原文逐字一致；其余文字未变。','',
'## 导航、样式与编辑验收','',
f"JSDOM 主验收 {len(v['checks'])} 项通过，R 章独立验收 {len(rv['checks'])} 项通过。",
'本页跳转、两处目录、各级标题搜索、折叠内搜索跳转、行内缩放、适应宽度、可读模式、放大窗口及窗口缩放均通过。新图标题、副标题与对应 JSON 一致。例子和案例复用 V/R 章左线样式。',
'编辑、保存后重开、另存 HTML 后重新解析并恢复修改均通过。v62 使用独立路径存储及 revision=v62；旧版本快照不能覆盖 v62，v62 快照不能污染 v61；导出快照另有独立 revision。',
'375px 静态检查通过：整页沿用 overflow-x:clip，正文/图框限制最大宽度，宽表格和宽 SVG 在内部容器滚动。JSDOM 不计算真实布局，未测量真实 scrollWidth，也未做浏览器视觉验收。','',
'## R 章正文原文与改后文字','',rc['scope'],'']
for i,x in enumerate(rc['proseChanges'],1):
    lines += [f"### {i}. {x['reason']}",'','原文：','```text',x['before'],'```','','改后：','```text',x['after'],'```','']
lines += ['## R 图文字清单','','图：r2-once-race；图框标题、副标题同步。原始 SVG/JSON 保留，修正版另存 figures-v62/r2-once-race.svg。','']
for i,x in enumerate(rc['figureChanges'],1):
    lines += [f"{i}. `{x['before']}` → `{x['after']}`（{x['occurrences']} 处）"]
lines += ['','所有节点文本保守估算宽度均在所属框内，XML 有效，图形几何和节点数量不变。','',
'## I 原图文字清单','',ic['fallbackReason'],'']
for i,x in enumerate(ic['changes'],1):
    lines += [f"{i}. **{x['figure']}**：`{x['original']}` → `{x['replacement']}`（SVG 中 {x['svgOccurrences']} 处）"]
lines += ['','五张原图中“小模型”“本地模型”均未出现，因此模型称谓替换为 0 处。原图来源及日期清理共 8 组，文字估算宽度均缩短，几何属性不变。历史业务规则文字按指定范围保留；本轮不另改其业务内容。','',
'## 其他章节一致性','',
'V 章与其他 21 章共 22 章：DATA 页面对象逐字序列化一致，JSDOM 渲染 DOM 一致。原始总图、除 r2-once-race 外所有原有 SVG、其他 DATA 顶层字段均一致。R 章原有标题锚点及历史折叠 ID 保留。',
'全页脚本外仅文档标题从 v61 更新为 v62；运行逻辑仅更新编辑默认 revision 和另存文件名，其他 JavaScript、CSS、页面壳均与 v61 一致。','',
'## 没做到的项','',
'未启动浏览器，因此未进行真实 375px 布局测量、字体渲染和 SVG 视觉验收。横向滚动仅完成静态约束检查；节点文字仅完成脚本宽度估算。其他要求均完成。','',
'## 验证与复现文件','',
'- I-v2/build_v62.py：生成脚本。','- I-v2/full.md：合并原稿。','- R-v2/full-v62.md：最小修正原稿。','- I-v2/build-manifest-v62.json：输入哈希、图位与标题清单。','- I-v2/verification-v62.json：主验收明细。','- R-v2/verification-r-v62.json：R 独立验收。','- I-v2/original-figure-changes-v62.json、R-v2/changes-v62.json：完整改动账本。','',
f"v61 SHA-256：`{m['baselineSha256']}`",f"v62 SHA-256：`{hashlib.sha256(out.read_bytes()).hexdigest()}`",'']
(H/'delivery-v62.md').write_text('\n'.join(lines))
print(json.dumps({'report':str(H/'delivery-v62.md'),'counts':c,'checks':len(v['checks']),'rChecks':len(rv['checks']),'passed':True},ensure_ascii=False))
