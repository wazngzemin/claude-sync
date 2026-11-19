"""Write the delivery record only after the independent/runtime checks pass."""
from pathlib import Path
import json,re,hashlib
H=Path(__file__).resolve().parent
root=H.parents[2]
m=json.loads((H/'build-manifest-v63.json').read_text())
v=json.loads((H/'verification-v63.json').read_text())
assert v['passed'], 'Do not report success before verification passes'
base=Path(m['base']);out=Path(m['output'])
assert hashlib.sha256(base.read_bytes()).hexdigest()==m['baselineSha256']
a,b=base.read_text(),out.read_text()
scripts=lambda s:re.findall(r'<script([^>]*)>([\s\S]*?)</script>',s)
assert scripts(a)[2][1].replace("revision: 'v62'","revision: 'v63'").replace('我的修订-v62.html','我的修订-v63.html')==scripts(b)[2][1]
mask=lambda s:re.sub(r'<script([^>]*)>[\s\S]*?</script>',r'<script\1>__CONTENT__</script>',s).replace('<title>豆包汽车业务学习站 v62</title>','<title>豆包汽车业务学习站 v63</title>')
assert mask(a)==mask(b)
c=v['counts'];n=v['narrativeComparison']
lines=['# 豆包汽车业务学习站 v63 交付说明','',f'网页：`{out}`','',
'只替换 W 章。v62、四份 part 原稿、六张新图及同名 JSON 均未修改；全程未启动浏览器。','',
'## 数量','',
'| 项目 | 数量 |','|---|---:|',
f"| 正文 h2 | {c['h2']} |",f"| 正文 h3 | {c['h3']} |",f"| 含图框标题的全部 h3 | {c['h3IncludingFigures']} |",f"| SVG 实例 | {c['svg']} |",f"| 正文图位 | {c['figureSlots']} |",f"| 独立 SVG 资源 | {c['uniqueFigureAssets']} |",f"| 例子 | {c['examples']} |",f"| 案例 | {c['cases']} |",f"| details | {c['details']} |",'',
'正文有 7 个图位、6 张新图；w2-three-paths 在开篇和收尾各出现一次，第一个折叠再复用一次，共 8 个 SVG 实例。W 章没有挂载旧全图或其他旧图。两个折叠默认关闭，分别为三条处理路径全图、附二历史版本与关键数字；位置与 V/R/I 相同，复用原图框、缩放及折叠样式。','',
'## 正文逐字比对','',
f"full.md 与 part-1～4 按序合并的结果逐字一致；仅删除非 figure HTML 注释，本轮实际删除 {len(m['removedComments'])} 条，全部图位保留。",
f"独立 CommonMark 渲染后，{n['blocks']} 个正文块、全部标题及粗体文本与网页逐字一致。只移除图框、第一个路线图折叠及展示容器后，完整正文 DOM 一致。Markdown 语法与 HTML 标签不计为正文字符。",'',
'## 新图文字改动清单','',
'逐项检查 SVG 的 text/title/desc、原始代码及 JSON 标题/副标题：来源或日期注释 0 处，“小模型”0 处，“本地模型”0 处，因此图中文字改动为 0 处。以下六张图均按原始文件嵌入：','']
for x in m['figureAudit']:
    lines.append(f"- {x['figure']}：无禁用词，文字未改；SVG SHA-256 `{x['sha256']}`。")
lines += ['',
'## 导航、交互与章节一致性','',
f"JSDOM 验收 {len(v['checks'])} 项通过。正文跳转、两处目录、所有新标题的搜索索引、折叠内搜索跳转、图框缩放、适应宽度、可读模式和放大窗口均通过。旧 W 章节锚点已映射到对应新标题。例子与案例复用 V/R/I 的左线样式。",
'编辑启用、保存修改后重新打开、另存 HTML 后重新打开均通过；v63 使用独立路径存储与 revision=v63，旧 revision 即便置于相同路径也不会覆盖 v63，v63 快照不会污染 v62，导出文件另有独立 revision。',
'其余 23 章的 DATA 页面对象序列化一致，JSDOM 渲染 DOM 一致。全部旧 SVG、原始总图和其他 DATA 顶层字段一致。全局 CSS、页面壳逐字一致；全页脚本只更新 W 数据、编辑 revision、另存文件名，文档标题更新为 v63。','',
'## 375px 检查与未完成项','',
'375px 静态约束检查通过：沿用整页 overflow-x:clip，正文与图框限制最大宽度，长文字允许换行，宽表格与放大后的 SVG 在各自容器内滚动。未启动浏览器。',
'JSDOM 不计算真实布局，因此没有测量真实 scrollWidth，也未进行字体与 SVG 的视觉验收；不能将静态约束检查表述为已实测 375px 无横向滚动。JSDOM 编辑验收通过输入事件验证编辑、保存与导出，浏览器原生 execCommand 排版按钮未实测。交互测试为提高速度保留 SVG 外壳，所有完整 SVG 另经 XML 与原文一致性检查。其余请求项均完成。','',
'## 复现文件','',
'- W-v2/build_v63.py：生成脚本，沿用 I-v62 的 CommonMark 处理。',
'- W-v2/full.md：合并正文。',
'- W-v2/build-manifest-v63.json：输入哈希、图位、标题及新图审查。',
'- W-v2/verify_v63.mjs、verification-v63.json：脚本与验收结果。','',
f"v62 SHA-256：`{m['baselineSha256']}`",f"v63 SHA-256：`{hashlib.sha256(out.read_bytes()).hexdigest()}`",'']
report=root/'HTML/00-规范与模板/豆包汽车-业务学习站-v63-交付说明.md'
report.write_text('\n'.join(lines))
print(json.dumps({'report':str(report),'counts':c,'checks':len(v['checks']),'passed':True},ensure_ascii=False))
