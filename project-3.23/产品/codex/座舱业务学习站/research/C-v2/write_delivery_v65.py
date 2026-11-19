"""Write the reviewable delivery record from completed verification reports."""
from pathlib import Path
import hashlib
import json
import re

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
m = json.loads((HERE / 'build-manifest-v65.json').read_text())
v = json.loads((HERE / 'verification-v65.json').read_text())
s = json.loads((HERE / 'static-verification-v65.json').read_text())
a = json.loads((HERE / 'figure-review-v65.json').read_text())
assert v['passed'] and s['pass']
assert hashlib.sha256(Path(m['base']).read_bytes()).hexdigest() == m['baselineSha256']
assert hashlib.sha256(Path(m['output']).read_bytes()).hexdigest() == m['outputSha256']
c = v['counts']
n = v['narrativeComparison']
lines = [
    '# 豆包汽车业务学习站 v65 交付说明', '',
    f"网页：`{m['output']}`", '',
    '只替换 C 章。v64、part-1～4、figures-orig 和 figures 中的输入均未修改。全程未启动浏览器。', '',
    '## 数量', '',
    '| 项目 | 数量 |', '|---|---:|',
    f"| 正文 h2 | {c['h2']} |", f"| 正文 h3 | {c['h3']} |",
    f"| 含图框标题的 h3 | {c['h3IncludingFigures']} |",
    f"| SVG 实例 | {c['svg']} |", f"| 独立 SVG 资源 | {c['uniqueFigureAssets']} |",
    f"| 正文图位 | {c['figureSlots']} |", f"| 例子 | {c['examples']} |",
    f"| 案例 | {c['cases']} |", f"| details | {c['details']} |", '',
    '开篇和收尾的 c-overview 均显示；对照全图折叠再复用一张，因此共有 10 个 SVG 实例、8 张独立图。两个折叠默认关闭，分别为上下文全图和附二；样式、例子案例和缩放交互沿用 V/R/I/M。附二结尾复述保留在历史折叠内。', '',
    '## 正文逐字比对', '',
    f"full.md 与 part-1～4 顺序合并后的文本逐字一致，仅移除非 figure HTML 注释（{len(m['removedComments'])} 条），保留全部 9 个 figure 图位。",
    f"独立 CommonMark 渲染后，网页全部 {n['blocks']} 个正文块、标题和粗体文字逐字一致。移除图框、额外全图折叠和展示容器后，完整正文 DOM 一致；未归一化正文汉字、标点、数字。Markdown 标记与 HTML 标签是展示语法，不作为相同字节比较。", '',
    '## 本轮额外图中文字改动', '',
    '仅修改网页嵌入的 c-arch 副本；最终 SVG 另存 C-v2/figures-v65/c-arch.svg，源 SVG 未动。', '',
]
for f in m['figureAudit']:
    for change in f['changes']:
        lines.append(f"- {f['figure']}：{change['before']} → {change['after']}（SVG {change['occurrences']} 处）。")
lines += [
    '- c-arch 的网页图框副标题同步“现在各类信息分别筛选”（另 1 处）。',
    '- 其他 7 张图无需额外改字。“小模型”“本地模型”在全部输入清理图中均为 0 处，无须替换为“车上的 1.7B 模型”。',
    '- 8 张最终图的可见文字、title、desc、aria-label 和网页图框均已检查，无来源、日期注释、PRD、技术方案、口径、待确认、DT、小模型、本地模型、OnePage。图中“天气、日期、位置”的“日期”表示业务输入，予以保留。', '',
    '## 四张清理原图相对 v64 的全部文字差异', '',
    '以下列出提供的 figures-orig 清理版相对 v64 的差异。节点合并或重排以差异组列出；每个变更节点的旧值、新值均保留。上节的额外修改应用在清理版之上。', '',
]
for f in a['baselineChanges']['figures']:
    lines += [f"### {f['figure']}（{f['differenceBlocks']} 组）", '']
    for index, change in enumerate(f['changes'], 1):
        def describe(item):
            pos = f" ({item['x']},{item['y']})" if item.get('x') is not None else ''
            return f"{item['kind']}{pos}：{item['text']}"
        before = '；'.join(map(describe, change['before'])) or '（无）'
        after = '；'.join(map(describe, change['after'])) or '（删除）'
        lines += [f'{index}. 原：{before}', f'   新：{after}']
    lines.append('')
lines += ['## 最终图框标题与副标题', '', '| 图 | 标题 | 副标题 |', '|---|---|---|']
data = json.loads(re.search(r'const DATA=(.*?);\s*</script>', Path(m['output']).read_text(), re.S)[1])
page = next(p for p in data['pages'] if p['id'] == 'C')['v55']
for f in s['figures']:
    # Metadata in DATA is authoritative after the documented c-arch clean-up.
    key = f['key']
    lines.append('| ' + key + ' | ' + page['figureTitles'][key].replace('|', '\\|') + ' | ' + page['figureSubtitles'][key].replace('|', '\\|') + ' |')
lines += [
    '', '## 导航、编辑与其他章节', '',
    f"JSDOM {len(v['checks'])} 项检查全部通过。全部正文标题进入本页跳转、页面目录、章内目录和搜索；折叠内搜索跳转、旧 C 章锚点映射、各图内嵌缩放与放大阅读通过。重复总图的 DOM ID 无冲突。",
    '编辑输入、保存后重新加载、另存 HTML 后重新加载均通过。v65 路径存储及 revision=v65 与 v64 分离；同路径旧快照不会覆盖 v65，导出文件使用独立 revision。',
    '其余 23 章 DATA page 对象及渲染 DOM 与 v64 完全一致；其他 91 张 SVG、其他 DATA 属性、CSS 均相同。页面壳与应用脚本仅更新文档标题、编辑快照 revision 和另存文件名。v64 哈希未变。', '',
    '## 375px 与未完成项', '',
    '375px 静态约束通过：整页保留 overflow-x:clip，正文和图框受最大宽度约束，标题可换行；宽表格和放大 SVG 在各自容器内滚动。',
    '按要求未启动浏览器。JSDOM 不计算真实布局，因此未实测 375px 下 scrollWidth、字体和 SVG 视觉排版；不能把静态约束通过说成真实布局实测通过。原生 execCommand 排版按钮未实测，编辑、保存、导出链路已通过 JSDOM 事件验证。除此之外，无未完成项。', '',
    '## 复现与审查文件', '',
    '- C-v2/full.md：合并正文。',
    '- C-v2/build_v65.py、build-manifest-v65.json：生成脚本与输入输出哈希。',
    '- C-v2/verify_v65.mjs、verification-v65.json：JSDOM 验收。',
    '- C-v2/static-verification-v65.json：独立静态验收。',
    '- C-v2/figure-review-v65.json：图中文字逐节点差异与输入审计。',
    '- HTML/03-历史版本/豆包汽车-业务学习站-C章构建草稿-v65.html：日期标注清理前的中间构建稿，保留未覆盖。', '',
    f"v64 SHA-256：`{m['baselineSha256']}`", f"v65 SHA-256：`{m['outputSha256']}`", '',
]
out = ROOT / 'HTML/00-规范与模板/豆包汽车-业务学习站-v65-交付说明.md'
with out.open('x') as stream:
    stream.write('\n'.join(lines))
print(out)
