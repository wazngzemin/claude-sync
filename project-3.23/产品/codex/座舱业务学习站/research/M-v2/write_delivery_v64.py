"""Produce the delivery record after runtime and static verification passes."""
from pathlib import Path
import json, hashlib
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[2]
m=json.loads((HERE/'build-manifest-v64.json').read_text())
v=json.loads((HERE/'verification-v64.json').read_text())
s=json.loads((HERE/'static-verification-v64.json').read_text())
a=json.loads((HERE/'figure-audit-v64.json').read_text())
assert v['passed'] and s['passed']
assert hashlib.sha256(Path(m['base']).read_bytes()).hexdigest()==m['baselineSha256']
c=v['counts'];n=v['narrativeComparison']
lines=['# 豆包汽车业务学习站 v64 交付说明','',f"网页：`{m['output']}`",'',
'仅替换 M 章；v63、四份 part 原稿、figures-orig 六张清理图、figures 五张新图及 JSON 均未修改。全程未启动浏览器。','',
'## 数量','',
'| 项目 | 数量 |','|---|---:|',
f"| 正文 h2 | {c['h2']} |",f"| 正文 h3 | {c['h3']} |",f"| 含图框标题的 h3 | {c['h3IncludingFigures']} |",f"| SVG 实例 | {c['svg']} |",f"| 正文图位 | {c['figureSlots']} |",f"| 独立 SVG 资源 | {c['uniqueFigureAssets']} |",f"| 例子 | {c['examples']} |",f"| 案例 | {c['cases']} |",f"| details | {c['details']} |",'',
'正文 12 个图位，复用 11 张独立图；m-timeline 在第七段及收尾各显示一次。第一个折叠复用清理后的 m-overview，因此共 13 个 SVG 实例。两个折叠默认关闭，分别为输入管理全图和附二历史版本与关键数字；沿用 V/R/I/W 的样式。附二的结尾口述稿收在历史折叠内，与 I 章一致。','',
'## 正文逐字比对','',
f"full.md 与 part-1～4 按序合并的结果逐字一致，仅删除非 figure HTML 注释（本次 {len(m['removedComments'])} 条）；全部 figure 图位保留。",
f"网页正文经独立 CommonMark 渲染对比，{n['blocks']} 个正文块、全部标题、粗体文字均逐字一致。移除图框、额外全图折叠及展示容器后，完整正文 DOM 一致；未删除或归一化正文汉字、标点、数字。Markdown 标记与 HTML 标签属于展示语法，不按原始字节直接比较。",'',
'## 本轮图中文字的额外改动','',
'- m-evolution：从“各管各的”到统一输入管理：2026 年的几次转折 → 从“各管各的”到统一输入管理：几次转折。涉及 aria-label、SVG title、图上主标题，共 3 处；网页图框标题同步为清理后的标题。副本在 M-v2/figures-v64/m-evolution.svg。',
'- 其他 10 张图无额外改字；“小模型”“本地模型”均为 0 处，无需替换为“车上的 1.7B 模型”。',
'- 图中 4 处“来源”均用于说明输入来自谁，不是资料出处；演进时间轴日期属于业务内容，保留。所有来源/日期出处注释已清除。主副标题均无来源、日期、PRD、技术方案、口径、待确认、DT、Chat。','',
'## 六张原图相对 v63 的全部文字改动','',
'以下逐项列出本次嵌入清理版后相对 v63 的差异；来自已提供的 figures-orig 清理版，不表示本轮重新改写了原图。XML 标签上的 aria-label、title、desc 与可见 text 分别记录。部分是一组文字拆并，因此以差异组计数。','']
for f in a['figures']:
    if not f['historicalCleanup']:
        continue
    lines += ['### '+f['id'],'']
    for idx,change in enumerate(f['historicalCleanup'],1):
        before='；'.join(f"{x['kind']}：{x['text']}" for x in change['before']) or '（无）'
        after='；'.join(f"{x['kind']}：{x['text']}" for x in change['after']) or '（删除）'
        lines += [f'{idx}. 原：{before}',f'   新：{after}']
    lines.append('')
lines += ['## 图框和副标题','',
'六张原图的图框标题取自清理后 SVG title，副标题取自清理后 SVG 第二个 text；五张新图采用同名 JSON 的 title 和 subtitle。图框不再沿用 v63 的旧说明。','',
'| 图 | v64 图框标题 | 副标题 |','|---|---|---|']
for f in a['figures']:
    lines.append('| '+f['id']+' | '+f['title'].replace('|','\\|')+' | '+f['subtitle'].replace('|','\\|')+' |')
lines += ['', '## 导航、编辑与章节一致性','',
f"JSDOM {len(v['checks'])} 项验收通过，另有 {len(s['checks'])} 项静态复核通过。本页跳转、页面目录、章内目录、全部新标题搜索、折叠内搜索跳转、各图缩放/适应宽度/读细节/放大阅读均通过；旧 M 章节锚点全部映射到存在的新目标。",
'编辑启用、输入、保存后重开、另存 HTML 后重开均通过。v64 使用独立路径存储及 revision=v64；同路径的 v59/v63 快照不覆盖 v64，v64 快照不污染 v63；导出文件使用独立 revision。',
'其余 23 个 DATA page 对象与渲染 DOM 均和 v63 一致；所有非 M SVG、其他 DATA 顶层字段、CSS 和页面壳一致。全页应用脚本仅更新编辑 revision 与另存文件名，文档标题更新为 v64。v63 原文件哈希未变。','',
'## 375px 检查与未完成项','',
'375px 静态容纳约束检查通过：整页保留 overflow-x:clip；正文、图框、标题限制最大宽度并允许长字换行；宽表格及放大 SVG 只在各自容器内滚动。未启动浏览器。',
'JSDOM 不计算真实布局，未测真实 scrollWidth，因此不能将静态约束检查表述为已实测 375px 整页无横向滚动；也未做字体及 SVG 视觉验收。编辑流程通过输入事件验收，浏览器原生 execCommand 排版按钮未实测。交互测试为节省解析时间保留 SVG 外壳，全部完整 SVG 另经 XML、字词及原文一致性检查。其余请求项已完成。','',
'## 复现与审查文件','',
'- M-v2/full.md：按序合并正文。',
'- M-v2/build_v64.py、build-manifest-v64.json：生成脚本、输入/输出哈希。',
'- M-v2/verify_v64.mjs、verification-v64.json：JSDOM 验收脚本及结果。',
'- M-v2/static-verification-v64.json：额外静态复核。',
'- M-v2/figure-audit-v64.json：全部图中文字差异与禁词审查。','',
f"v63 SHA-256：`{m['baselineSha256']}`",f"v64 SHA-256：`{hashlib.sha256(Path(m['output']).read_bytes()).hexdigest()}`",'']
out=ROOT/'HTML/00-规范与模板/豆包汽车-业务学习站-v64-交付说明.md'
assert not out.exists()
out.write_text('\n'.join(lines))
print(json.dumps({'report':str(out),'counts':c,'runtimeChecks':len(v['checks']),'staticChecks':len(s['checks'])},ensure_ascii=False))
