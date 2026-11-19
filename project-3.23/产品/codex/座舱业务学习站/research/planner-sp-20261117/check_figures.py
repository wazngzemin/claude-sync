"""Offline geometry, typography, terminology and rendering checks. No browser."""
from pathlib import Path
import importlib.util
import json
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('f_checks', ROOT.parent / 'F-v2/check_figures.py')
base = importlib.util.module_from_spec(spec)
spec.loader.exec_module(base)
base.BASE = ROOT
base.COMMON = ['资料', 'PRD', '清单', '待确认', '口径', '没有展开', '未展开',
               'DT', 'Director', '小模型', 'OnePage', '技术方案', '周报', '宣讲',
               '逐字稿', '纪要', '《', '》', '明骏', '超然', '雨晴', '晓伟', '博总']


def check(path, render_dir):
    result = base.validate(path)
    tree = base.ET.parse(str(path))
    root = tree.getroot()
    result['viewBox'] = root.get('viewBox')
    if base.nums(root.get('viewBox'))[2] != 1200 or root.get('width') != '1200':
        result['errors'].append('Width must be 1200')
    runs = []
    sizes = {'v56-title': (24, 650), 'v56-subtitle': (14, 400),
             'v56-node-title': (16, 650), 'v56-node-sub': (14, 400),
             'v56-label': (14, 650), 'v56-risk': (14, 400)}
    for t in root.xpath('//*[local-name()="text"]'):
        size, weight = sizes[t.get('class')]
        s = ''.join(t.itertext())
        ox, oy, w, h, advance = base.measure(s, size, weight)
        x, y = float(t.get('x')), float(t.get('y'))
        if t.get('text-anchor') == 'middle': x -= advance / 2
        if t.get('text-anchor') == 'end': x -= advance
        b = (x + ox, y - oy - h, x + ox + w, y - oy)
        runs.append((s, [(b[0], b[1]), (b[2], b[1]), (b[2], b[3]), (b[0], b[3])]))
    for p in root.xpath('//*[local-name()="path"][@marker-end]'):
        for a, b in base.segments(p.get('d')):
            for s, poly in runs:
                if base.segment_enters(a, b, poly):
                    result['errors'].append('Arrow crosses text: ' + s)
    visible = '\n'.join(root.xpath('//*[local-name()="text" or local-name()="title" or local-name()="desc"]/text()'))
    result['forbidden_hits'] = [term for term in base.COMMON if term.casefold() in visible.casefold()]
    if result['forbidden_hits']:
        result['errors'].append('Forbidden words: ' + repr(result['forbidden_hits']))
    dest = render_dir / (path.stem + '.png')
    proc = subprocess.run(['rsvg-convert', '--width', '1200', '--output', str(dest), str(path)], capture_output=True, text=True)
    result['offline_render'] = proc.returncode == 0 and dest.is_file() and dest.read_bytes().startswith(b'\x89PNG\r\n\x1a\n')
    if not result['offline_render']: result['errors'].append('Offline render failed: ' + proc.stderr)
    result['checks']['arrows_do_not_cross_text'] = not any('Arrow crosses text' in e for e in result['errors'])
    return result


if __name__ == '__main__':
    paths = [ROOT / 'figures' / ('sp2-' + name + '.svg') for name in ['overview', 'structure', 'navi', 'safety', 'review']]
    render_dir = Path(tempfile.mkdtemp(prefix='sp2-render-'))
    results = [check(p, render_dir) for p in paths]
    report = {'method': 'XML parse; macOS CoreText PingFang SC glyph bounds; rectangle intersections; arrow segments versus node and text interiors; forbidden terms; 1200 width; <=9 nodes; exact JSON metadata; offline librsvg rendering.',
              'render_directory': str(render_dir), 'passed': all(not r['errors'] for r in results), 'files': results}
    (ROOT / 'figure-checks.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    for r in results:
        print(('PASS' if not r['errors'] else 'FAIL'), r['file'], 'viewBox=' + r['viewBox'], 'nodes=' + str(r['nodes']))
        for error in r['errors']: print('  ' + error)
    print('Offline renders:', render_dir)
    sys.exit(0 if report['passed'] else 1)
