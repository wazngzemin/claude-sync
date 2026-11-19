"""Write v66 delivery notes after all script checks pass."""
from pathlib import Path
import json, hashlib
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[2]
m=json.loads((HERE/'build-manifest-v66.json').read_text())
v=json.loads((HERE/'verification-v66.json').read_text())
s=json.loads((HERE/'static-verification-v66.json').read_text())
a=json.loads((HERE/'figure-review-v66.json').read_text())
assert v['passed'] and s['pass'] and a['passed']
for key,field in [('base','baselineSha256'),('output','outputSha256')]:
    assert hashlib.sha256(Path(m[key]).read_bytes()).hexdigest()==m[field]
c=v['counts'];n=v['narrativeComparison']
lines=[
 '# 豆包汽车业务学习站 v66 交付说明','',
 f"网页：`{m['output']}`",'',
 '仅替换 D 章及其 5 张原图，新增 4 张图。v65 与 part-1～4 未改。清理后的原图均保留原文件；本轮额外清理另存 figures-v66/d-sp.svg。全程未启动浏览器。','',
 '## 数量','',
 '| 项目 | 数量 |','|---|---:|',
 f"| 正文 h2 | {c['h2']} |",f"| 正文 h3 | {c['h3']} |",f"| 含图框标题 h3 | {c['h3IncludingFigures']} |",
 f"| SVG 实例 | {c['svg']} |",f"| 独立 SVG | {c['uniqueFigureAssets']} |",f"| 正文图位 | {c['figureSlots']} |",f"| 例子 | {c['examples']} |",f"| 案例 | {c['cases']} |",f"| details | {c['details']} |",'',
 'd-overview 在开篇和收尾各显示一次，“对照：Planner 全图”折叠再显示一次。两个折叠默认关闭，分别为对照全图与附二；附二末尾复述放在历史折叠内。正文、图框、缩放、例子和案例沿用 C/V/R/I 的共有呈现方式。','',
 '## 正文逐字比对','',
 f"full.md 与 part-1～4 按顺序合并的结果逐字一致；仅允许删除非 figure 注释，本次此类注释为 {len(m['removedComments'])} 条。10 个正文 figure 图位全部保留。",
 f"独立 CommonMark 渲染后，网页全部 {n['blocks']} 个正文块逐字一致，差异块为 {len(n['differingBlocks'])}。标题、粗体及完整正文 DOM 比对通过。只剥离图框、额外全图折叠及展示容器；不改正文汉字、标点或数字。Markdown 标记和 HTML 标签属于展示语法。",'',
 '## 图中文字改动清单','',
 '下文完整记录 5 张原图相对 v65 的逐节点文字差异及网页图框标题、副标题。四张新图与提供的 SVG、JSON 完全相同，无改字。“小模型”“本地模型”在 9 张最终图及图框均为 0 处，因此本轮没有需要替换为“车上的 1.7B 模型”的条目。', '',
 '本轮额外修改仅一处：d-sp 的 aria-label 去掉“7 月 31 日”，与已清理的可见标题保持一致。最终 9 张图的文字、title、desc、aria-label 和图框均已检查，无指定禁词或日期注释。“日期天气”表示业务输入，保留。', '',
 (HERE/'图中文字改动-v66.md').read_text().replace('(figures-orig/changes.md)',str('('+str(HERE/'figures-orig/changes.md')+')')).replace('# v66 图中文字逐项记录','### 逐节点明细',1),
 '## 导航、编辑及其他章节','',
 f"JSDOM {len(v['checks'])} 项检查全部通过。全部 65 个正文标题进入本页跳转、页面目录、章内目录和搜索索引；折叠内目标跳转会自动展开。旧 D 锚点映射到新内容，重复总图 DOM ID 无冲突；内嵌缩放、适宽/可读切换与放大阅读通过。",
 '编辑输入、保存后重新加载、另存 HTML 后重新加载通过。v66 路径存储及 revision=v66 与 v65 隔离；旧 revision 即使出现在同路径也不会覆盖新正文，另存文件使用独立 revision。',
 f"其余 23 章 DATA page 对象及渲染 DOM 与 v65 一致，其他 {s['unchangedOtherDiagrams']} 张 SVG、其他 DATA 属性及 CSS 完全一致。页面壳与共享脚本仅更新文档标题、编辑 revision 和另存文件名；v65 SHA-256 未变。D 章标题、摘要和场景同步新正文。",'',
 '## 375px 与未完成项','',
 '375px 静态约束通过：整页保留 overflow-x:clip，正文、图框、SVG 容器限制在页面宽度内，图题允许换行，宽表和缩放图只在各自容器内滚动。SVG 的 CoreText 文字几何检查通过。',
 '按要求未启动浏览器。JSDOM 不计算真实布局，因此未实测 375px 的 scrollWidth、实际字体和视觉排版；静态检查不能等同真实布局验收。原生 execCommand 排版按钮未实测；编辑、保存和导出链路已用 JSDOM 事件验证。除此之外，无未完成项。', '',
 '## 审查文件','',
 '- D-v2/full.md：合并正文。',
 '- D-v2/build_v66.py、build-manifest-v66.json：生成与输入输出哈希。',
 '- D-v2/verify_v66.mjs、verification-v66.json、verification-v66.log：JSDOM 验收。',
 '- D-v2/static-verification-v66.json：独立静态检查。',
 '- D-v2/figure-review-v66.json、图中文字改动-v66.md：全部图文差异与几何审计。','',
 f"v65 SHA-256：`{m['baselineSha256']}`",f"v66 SHA-256：`{m['outputSha256']}`",'',
]
out=ROOT/'HTML/00-规范与模板/豆包汽车-业务学习站-v66-交付说明.md'
with out.open('x') as f:f.write('\n'.join(lines))
print(out)
