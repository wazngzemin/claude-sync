"""Expand the accepted V54 fact ledger into deterministic, local citation records.

This is a renderer input, not a new fact check: states and evidence are retained
verbatim. Every record also points back to its exact ledger row.
"""
from pathlib import Path
from collections import defaultdict, Counter
import json
import re

ROOT = Path('/Users/bytedance/Desktop/3.23/产品/codex')
RESEARCH = ROOT / '座舱业务学习站/research'
SOURCE_DIR = RESEARCH / 'v54-5w2h-20261113'
OUT = RESEARCH / 'v54-web-20261113'
LEDGER = SOURCE_DIR / 'facts-ledger.md'
LINE = r'\d+(?:[\-–—,、]\d+)*'
ID = r'(?:V\d{2}-[FUC]\d+|LAT-F\d+|K\d{4})'
ABS = re.compile(r'/(?:Users|private)/[^`\n|<>]*?\.(?:md|txt|json|html)(?![A-Za-z])')
REL = re.compile(r'(?<![\w/])([A-Za-z0-9_\-]+\.(?:md|txt|json|html))(?::('+LINE+r')|\s+L('+LINE+r'))?')
URL = re.compile(r'https?://[^\s`<>，；。）)"\|]+')
STATES = {'已确认', '待确认', '资料冲突'}

def table_cells(line):
    return [x.strip().replace(r'\|', '|') for x in re.split(r'(?<!\\)\|', line)[1:-1]]

lines = LEDGER.read_text().splitlines()
records = []
aliases = {}
for number, line in enumerate(lines, 1):
    if not line.startswith('| '):
        continue
    cells = table_cells(line)
    if cells and re.fullmatch(r'L\d+', cells[0]):
        aliases[cells[0]] = ' | '.join(cells[1:])
    if not cells or not re.fullmatch(ID, cells[0]):
        continue
    # The final unresolved index repeats IDs with a different column layout.
    if cells[1] in STATES:
        continue
    if cells[0].startswith('K'):
        claim, state, evidence, nature = cells[3], cells[4], cells[5], 'v52 旧稿二级材料留存'
    else:
        claim, state = cells[1:3]
        evidence = ' | '.join(cells[4:] if len(cells) >= 5 else cells[3:])
        nature = cells[3] if len(cells) >= 5 else '历史耗时核验'
    assert state in STATES, (number, cells)
    records.append(dict(id=cells[0], claim=claim, status=state, evidence_text=evidence,
                        nature=nature, ledger_line=number, ledger_raw_row=line))

path_by_name = defaultdict(set)
for line in lines:
    for match in ABS.finditer(line):
        path_by_name[Path(match[0]).name].add(match[0])
# Only add known, local research filenames missing from absolute citations.
for row in records:
    for match in REL.finditer(row['evidence_text']):
        name = match[1]
        if name not in path_by_name:
            for path in RESEARCH.rglob(name):
                if path.is_file():
                    path_by_name[name].add(str(path))

def known(name):
    paths = sorted(path_by_name.get(name, []))
    if len(paths) != 1:
        raise ValueError((name, paths))
    return paths[0]

VOICE = known('voice-onepage.md')
FRAMEWORK = known('framework-prd.txt')
PROBLEM = known('problem-flow.txt')
HMI = known('hmi-launcher-partial-readable.md')
PRODUCT = known('product-onepage.md')
VUI = known('aiva-vui-prd.md')
LOCAL = known('local-prd.txt')

# Resolve explicit shorthand in the accepted ledger. Each range remains literal.
SHORT = {
    'V04-F02': [(VOICE, '13,594')],
    'V04-F03': [(VOICE, '830-845')],
    'V04-F04': [(VOICE, '665-686')],
    'V04-F05': [(VOICE, '700-728')],
    'V04-F06': [(VOICE, '737-765')],
    'V04-F07': [(VOICE, '774-791')],
    'V04-F08': [(VOICE, '803-818')],
    'V04-F09': [(FRAMEWORK, '17-19'), (PROBLEM, '126-131')],
    'V04-F10': [(PROBLEM, '190-194')],
    'V04-F11': [(FRAMEWORK, '20-24,29-40'), (PROBLEM, '14-18')],
    'V04-F14': [(VOICE, '313-328')],
    'V04-F16': [(VOICE, '658,700-765')],
    'V04-F18': [(known('t-asr.txt'), '1560-1568,11848')],
    'V04-F20': [(str(SOURCE_DIR/'raw/approved-hotword-sample.md'), None)],
    'V04-F21': [(VOICE, '622-624'), (str(SOURCE_DIR/'raw/approved-hotword-sample.md'), None)],
    'V16-F02': [(PRODUCT, '2028-2057')],
    'V16-F05': [(HMI, '17-31,244-270,329-366,433-465,1003-1009')],
    'V16-F06': [(HMI, '5-7'), (PRODUCT, '2028-2033'), (VUI, '1033-1041')],
    'V17-F04': [(LOCAL, '117-120')],
    'V17-F05': [(LOCAL, '123-124')],
    'V18-F02': [(VOICE, '614-616')],
    'V18-F03': [(VOICE, '1121-1138')],
    'V18-F04': [(VOICE, '1171-1254,1283-1320')],
    'V18-F05': [(VOICE, '1261-1276,1327-1364')],
    'V18-F06': [(VOICE, '1371-1386')],
    'V18-F07': [(VOICE, '614-616')],
    'V15-F04': [(known('memory-sync-live.md'), '634-640')],
    'V15-F09': [(known('memory-sync-live.md'), '535-537,549-553')],
    'V15-F11': [(known('memory-sync-live.md'), '442,459-465')],
}

TITLES = {
    'v52-V-extracted.json': '豆包汽车业务学习站 v52：V 章正文抽取',
    'v52-V-node-map.json': '豆包汽车业务学习站 v52：原始 18 节点图',
    'v52-readable.txt': '豆包汽车业务学习站 v52：V 章逐条原文抽取',
    '豆包汽车-业务学习站-v52.html': '豆包汽车业务学习站 v52：V 章',
    'model-evidence.json': '奇瑞海外 AICAR 算法盘点及 H2 工程双周报原文摘录',
    'approved-hotword-sample.md': '用户已确认的热词样稿',
    'facts-ledger.md': 'V54 事实台账',
    'AGENTS.md': 'Karpathy LLM Wiki — 项目 Schema',
}
title_cache = {}
def file_title(path):
    if path in title_cache:
        return title_cache[path]
    p = Path(path)
    title = TITLES.get(p.name)
    if not title and p.exists():
        head = p.read_text(errors='replace')[:4000]
        for line in head.splitlines():
            if re.match(r'^#{1,3}\s+\S', line):
                title = re.sub(r'^#+\s+', '', line).replace('\\', '').strip()
                break
        if not title:
            first = next((s.strip() for s in head.splitlines() if s.strip()), '')
            if len(first) < 100 and not first.startswith(('{', '[', '<')):
                title = first
    title = title or p.name
    title_cache[path] = title
    return title

def line_after(text, end):
    tail = text[end:]
    m = re.match(r'(?::|`?\s*[，,]?\s*L)('+LINE+r')', tail)
    return m[1] if m else None

def path_location(path, line=None, label=None, **extra):
    value = {'label': label or file_title(path), 'path': path}
    if line is not None:
        value['line'] = line
    value.update(extra)
    return value

def dedupe(values):
    out = []
    seen = set()
    for value in values:
        key = (value.get('path'), value.get('url'), str(value.get('line', '')))
        if key not in seen:
            out.append(value); seen.add(key)
    return out

index = {}
review = []
for row in records:
    text = row['evidence_text']
    locs = []
    absolute_spans = []
    issues = []
    for m in ABS.finditer(text):
        path = m[0]
        absolute_spans.append(m.span())
        loc = path_location(path, line_after(text, m.end()))
        if not Path(path).exists():
            issues.append('所引本地文件不存在：'+path)
        locs.append(loc)
    for m in REL.finditer(text):
        if any(a <= m.start() < b for a, b in absolute_spans):
            continue
        paths = sorted(path_by_name.get(m[1], []))
        if len(paths) == 1:
            locs.append(path_location(paths[0], m[2] or m[3]))
        elif len(paths) > 1:
            # Prefer an explicitly mentioned parent directory in this row.
            parents = {str(Path(x['path']).parent) for x in locs if 'path' in x}
            preferred = [x for x in paths if str(Path(x).parent) in parents]
            if len(preferred) == 1:
                locs.append(path_location(preferred[0], m[2] or m[3]))
            else:
                issues.append('相对文件名存在多个路径，未猜选：'+m[1])
    for path, number in SHORT.get(row['id'], []):
        locs.append(path_location(path, number, resolved_shorthand=True))
    # L1–L8 are named in a dedicated source table; use that table, not the last row.
    for m in re.finditer(r'\b(L\d+):('+LINE+r')', text):
        definition = aliases.get(m[1], '')
        paths = list(ABS.finditer(definition))
        title = re.search(r'《([^》]+)》', definition)
        if paths:
            locs.append(path_location(paths[0][0], m[2], title[1] if title else None, resolved_shorthand=m[1]))
        for url in URL.findall(definition):
            locs.append({'label': title[1] if title else m[1], 'url': url})
        if not paths:
            issues.append('未解析来源表代号：'+m[1])
    for url in URL.findall(text):
        titles = re.findall(r'《([^》]+)》', text)
        label = titles[0] if titles else (locs[0]['label'] if locs else '飞书原文')
        locs.append({'label': label, 'url': url})
    # Ledger references (e.g. LAT-F21 -> LAT-F02) are resolved in a second pass.
    row['referenced_fact_ids'] = sorted(set(re.findall(ID, text)) - {row['id']})
    locs = dedupe(locs)
    if row['id'].startswith('K'):
        title = '豆包汽车业务学习站 v52：V 章旧稿原文'
    elif locs:
        title = '；'.join(dict.fromkeys(x['label'] for x in locs if x.get('label')))
    elif row['id'] == 'V19-F01':
        title = '本轮用户要求：5W2H 单元结构与口述时长'
        issues.append('教学设计来源为会话要求，非外部业务文档；保留台账精确行')
    elif row['id'] == 'V20-F01':
        title = 'V54 术语索引：定义来源回指对应单元台账'
        issues.append('此条为跨单元索引，具体概念需按源单元条目核对')
    else:
        title = 'V54 事实台账所引证据（需结合原行核对）'
        issues.append('未从本行提取独立原文地址，保留台账精确行')
    row['source_title'] = title
    row['source_locations'] = locs
    row['review_notes'] = issues
    index[row['id']] = row

for row in index.values():
    if row['id'] == 'LAT-F21':
        ref = index.get('LAT-F02')
        if ref:
            row['source_locations'] += [dict(x, inherited_from='LAT-F02') for x in ref['source_locations']]
            row['source_title'] = ref['source_title']+'；800 ms 原始证据待确认'
    # Every row is recoverable even when a source link later moves or access changes.
    row['source_locations'].append(path_location(str(LEDGER), row['ledger_line'], 'V54 事实台账：'+row['id'], fallback=True))
    row['source_locations'] = dedupe(row['source_locations'])
    for issue in row['review_notes']:
        review.append({'id': row['id'], 'ledger_line': row['ledger_line'], 'issue': issue})

OUT.mkdir(parents=True, exist_ok=True)
(OUT/'source-index.json').write_text(json.dumps(index, ensure_ascii=False, indent=2)+'\n')
report = '# V54 网页来源索引自查\n\n'
report += f'共 {len(index)} 个独立编号；所有编号保留原台账状态、证据文字及精确台账行号。\n\n'
report += '同文、OnePager、HMI、VUI、框架需求和 L1–L8 均展开为完整文件路径。结构化不会改变事实确认状态。教学设计/索引类条目与原始业务证据分开。\n\n'
report += '| 需人工留意的编号 | 台账行 | 原因 |\n|---|---:|---|\n'
for item in review:
    report += f'| {item["id"]} | {item["ledger_line"]} | {item["issue"]} |\n'
report += '\n未开启浏览器，未修改 content.md、facts-ledger.md 或任何 HTML。\n'
(OUT/'source-review.md').write_text(report)
assert len(index) == len(records)
assert all(r['source_title'] and r['source_locations'] and r['status'] in STATES for r in index.values())
print(json.dumps({'records': len(index), 'states': dict(Counter(r['status'] for r in index.values())), 'review_count': len(review), 'review': review}, ensure_ascii=False))
