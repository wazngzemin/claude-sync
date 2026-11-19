"""Write v67 notes from completed browserless verification reports."""
from pathlib import Path
import json,hashlib
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[2]
m=json.loads((HERE/'build-manifest-v67.json').read_text())
v=json.loads((HERE/'verification-v67.json').read_text())
s=json.loads((HERE/'static-verification-v67.json').read_text())
assert v['passed']
assert all(s[k] for k in ['otherPagesExactlyEqual','globalDataExceptPagesAndDiagramsEqual','otherDiagramsExactlyEqual','cssExactlyEqual','documentOutsideDataOnlyVersionChanges','fullMergeExactlyEqual'])
assert all(f['embeddedExactlyEqualsSource'] and not f['bannedTextHits'] and not f['dateTextHits'] for f in s['figures'])
assert all(s['mobile375StaticConstraints'].values())
for path,field in [('base','baselineSha256'),('output','outputSha256')]:
    assert hashlib.sha256(Path(m[path]).read_bytes()).hexdigest()==m[field]
c=v['counts'];n=v['narrativeComparison']
lines=[
 '# 豆包汽车业务学习站 v67 交付说明','',
 f"网页：`{m['output']}`",'',
 '仅替换 E 章，使用清理后的 5 张原图和 4 张新图。v66 文件保持原样。全程未启动浏览器。','',
 '## 数量','',
 '| 项目 | 数量 |','|---|---:|',
 *[f'| {label} | {c[key]} |' for key,label in [('h2','正文 h2'),('h3','正文 h3'),('h3IncludingFigures','含图框标题 h3'),('svg','SVG 实例'),('uniqueFigureAssets','独立 SVG'),('figureSlots','正文图位'),('examples','例子'),('cases','案例'),('details','details')]],'',
 'e-overview 在开篇和收尾各出现一次；“对照：工具执行全图”折叠内再显示一次。两个折叠默认关闭，分别为对照全图和附二。附二末尾复述随历史内容一起折叠。图框、缩放、例子和案例使用 V/R/I/D 的共有样式。','',
 '## 正文逐字比对','',
 f"full.md 按 part-1、part-2、part-3、part-5、part-4 顺序合并，逐字检查通过；仅去掉非图位 HTML 注释（{len(m['removedComments'])} 条），保留全部 {len(m['figureKeys'])} 个图位。",
 f"独立 CommonMark 渲染后，网页 {n['blocks']} 个正文块逐字一致，差异块 {len(n['differingBlocks'])}。标题、粗体和完整正文 DOM 对比通过。仅剥离展示容器、图框和额外全图折叠，不改正文文字或标点。Markdown 标记和 HTML 标签属于展示语法。",
 '生成前仅修正文一处：part-3 的“正在播放《红颜旧》”改为“正在播放红颜旧这首歌”；5 段正文无书名号残留。','',
 '## 图中文字改动清单','',
 '下面先收录原图清理记录，再列出本轮补修和相对 v66 的逐节点核对。图框标题、副标题取清理后原图的 title 和可见副标题，新图取同名 JSON。正文两次总图以及折叠总图均复用清理后原图。', '',
 (HERE/'figures-orig/changes.md').read_text(),'',
 (HERE/'图中文字改动-v67.md').read_text(),'',
 '最终 9 张 SVG、全部图框、无障碍标题、描述、文本属性及注释已复查，无指定禁用词或来源日期注释。新图原文件及 JSON 无需改字；“小模型”“本地模型”均无命中，因此本次没有需改成“车上的 1.7B 模型”的条目。','',
 '## 导航、编辑和版本隔离','',
 f"JSDOM {len(v['checks'])} 项检查通过。全部 {c['h2']+c['h3']} 个正文标题已进入本页跳转、页面目录、章内目录及搜索索引；旧 E 锚点映射到新标题。折叠内搜索和跳转自动展开。重复图 ID 无冲突，所有图内嵌缩放、适宽/可读切换和放大阅读通过。",
 '编辑模式输入、保存后重载、另存 HTML 后重载均通过。快照使用 v67 路径和 revision=v67；旧路径或旧 revision 不会污染 v67，v67 也不会污染 v66。另存文件使用独立 revision。JSDOM 对 execCommand 使用桩，原生文字格式按钮未实测。','',
 '## 其余章节','',
 '其余 23 章的 DATA page 对象和运行时正文 DOM 均与 v66 一致。其他 SVG、全局 DATA 与 CSS 保持一致；页面壳和共享脚本仅更新文档标题、编辑 revision、另存文件名。v66 SHA-256 未变。','',
 '## 375px 与未实测项','',
 '375px 静态防溢出约束通过：整页 overflow-x:clip，正文、图框及 SVG 容器限制最大宽度，图题允许换行；宽表和缩放图在各自容器内滚动。CSS 与 v66 一致。',
 '按要求未启动浏览器。JSDOM 不计算真实布局，因此尚未实测 375px 的 scrollWidth、实际字体与视觉排版；静态通过不能等同真实布局验收。原生 execCommand 文字格式按钮也未实测。编辑、保存、另存重载已通过 JSDOM 事件测试。除此以外无未完成项。','',
 '## 验证文件','',
 '- E-v2/full.md：合并正文。',
 '- E-v2/build_v67.py、build-manifest-v67.json：构建及哈希。',
 '- E-v2/verify_v67.mjs、verification-v67.json、verification-v67.log：运行检查。',
 '- E-v2/static-verification-v67.json：独立静态审查。',
 '- E-v2/图中文字改动-v67.md、figures-orig/changes.md：逐项文字改动。','',
 f"v66 SHA-256：`{m['baselineSha256']}`",f"v67 SHA-256：`{m['outputSha256']}`",'',
]
out=ROOT/'HTML/00-规范与模板/豆包汽车-业务学习站-v67-交付说明.md'
with out.open('x') as f:f.write('\n'.join(lines))
print(out)
