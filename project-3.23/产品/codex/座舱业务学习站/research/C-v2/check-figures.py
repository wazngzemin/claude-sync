#!/usr/bin/env python3
"""Check C chapter SVGs without a browser, using librsvg's real text geometry."""
from __future__ import annotations

import argparse
import ctypes
import ctypes.util
import json
import re
import sys
import tempfile
from pathlib import Path

from lxml import etree as ET

BASE = Path(__file__).resolve().parent
NEW = ['c2-preload-vs-query', 'c2-now-vs-history',
       'c2-examples-knowledge', 'c2-prefix-cache']
OLD = ['c-overview', 'c-input', 'c-arch', 'c-history']
FORBIDDEN = ['资料', 'PRD', '清单', '待确认', '口径', '没有展开', '未展开', '《', '》']
OLD_FORBIDDEN = ['技术方案', '宣讲', '周报', '逐字稿', 'DT', '小模型', 'OnePage']
NS = {'s': 'http://www.w3.org/2000/svg'}


class Box(ctypes.Structure):
    _fields_ = [(name, ctypes.c_double) for name in ('x', 'y', 'width', 'height')]

    def tuple(self):
        return self.x, self.y, self.x + self.width, self.y + self.height


def tag(element):
    return ET.QName(element).localname


def contains(a, b, tolerance=0.15):
    return a[0] - tolerance <= b[0] and a[1] - tolerance <= b[1] and a[2] + tolerance >= b[2] and a[3] + tolerance >= b[3]


def overlap(a, b, epsilon=0.15):
    return min(a[2], b[2]) - max(a[0], b[0]) > epsilon and min(a[3], b[3]) - max(a[1], b[1]) > epsilon


def segment_crosses(a, b, rect):
    # Liang-Barsky clipping against the OPEN interior; touching a port is allowed.
    x0, y0, x1, y1 = rect
    x0 += .4
    y0 += .4
    x1 -= .4
    y1 -= .4
    dx, dy = b[0] - a[0], b[1] - a[1]
    lower, upper = 0., 1.
    for p, q in [(-dx, a[0]-x0), (dx, x1-a[0]), (-dy, a[1]-y0), (dy, y1-a[1])]:
        if abs(p) < 1e-10:
            if q < 0:
                return False
        else:
            v = q / p
            if p < 0:
                lower = max(lower, v)
            else:
                upper = min(upper, v)
            if lower > upper:
                return False
    return upper - lower > 1e-7


def path_segments(element):
    name = tag(element)
    if name == 'line':
        return [((float(element.get('x1', 0)), float(element.get('y1', 0))),
                 (float(element.get('x2', 0)), float(element.get('y2', 0))))]
    if name == 'polyline':
        values = list(map(float, re.findall(r'[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?', element.get('points', ''))))
        points = list(zip(values[::2], values[1::2]))
        return list(zip(points, points[1:]))
    tokens = re.findall(r'[A-Za-z]|[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?', element.get('d', ''))
    i, command, point, origin, result = 0, None, (0., 0.), (0., 0.), []
    while i < len(tokens):
        if tokens[i].isalpha():
            command = tokens[i]
            i += 1
        if command is None or command.upper() not in 'MLHVZ':
            raise ValueError('unsupported connector command ' + str(command))
        absolute = command.isupper()
        if command.upper() == 'Z':
            result.append((point, origin))
            point = origin
            command = None
            continue
        arity = 2 if command.upper() in 'ML' else 1
        values = list(map(float, tokens[i:i+arity]))
        i += arity
        if command.upper() in 'ML':
            dest = (values[0], values[1]) if absolute else (point[0]+values[0], point[1]+values[1])
        elif command.upper() == 'H':
            dest = (values[0] if absolute else point[0]+values[0], point[1])
        else:
            dest = (point[0], values[0] if absolute else point[1]+values[0])
        if command.upper() == 'M':
            origin = dest
            command = 'L' if absolute else 'l'
        else:
            result.append((point, dest))
        point = dest
    return result


class Renderer:
    def __init__(self):
        filename = ctypes.util.find_library('rsvg-2') or '/opt/homebrew/lib/librsvg-2.2.dylib'
        self.lib = ctypes.CDLL(filename)
        self.lib.rsvg_handle_new_from_file.argtypes = [ctypes.c_char_p, ctypes.c_void_p]
        self.lib.rsvg_handle_new_from_file.restype = ctypes.c_void_p
        self.lib.rsvg_handle_get_geometry_for_layer.argtypes = [ctypes.c_void_p, ctypes.c_char_p, ctypes.POINTER(Box), ctypes.POINTER(Box), ctypes.POINTER(Box), ctypes.c_void_p]
        self.lib.rsvg_handle_get_geometry_for_layer.restype = ctypes.c_int
        self.gobject = ctypes.CDLL(ctypes.util.find_library('gobject-2.0') or '/opt/homebrew/lib/libgobject-2.0.0.dylib')
        self.gobject.g_object_unref.argtypes = [ctypes.c_void_p]

    def open(self, root):
        self.temp = tempfile.NamedTemporaryFile(suffix='.svg', delete=False)
        self.temp.write(ET.tostring(root))
        self.temp.close()
        self.handle = self.lib.rsvg_handle_new_from_file(self.temp.name.encode(), None)
        if not self.handle:
            raise ValueError('librsvg rejected the SVG')
        view = list(map(float, root.get('viewBox').split()))
        self.viewport = Box(*view)

    def bbox(self, element, logical=False):
        ink, bounds = Box(), Box()
        success = self.lib.rsvg_handle_get_geometry_for_layer(self.handle, ('#'+element.get('id')).encode(), ctypes.byref(self.viewport), ctypes.byref(ink), ctypes.byref(bounds), None)
        if not success:
            raise ValueError('could not measure ' + element.get('id'))
        return (bounds if logical else ink).tuple()

    def close(self):
        self.gobject.g_object_unref(self.handle)
        Path(self.temp.name).unlink()


def inspect(path, renderer):
    result = {'file': str(path.relative_to(BASE)), 'id': path.stem, 'checks': {}, 'issues': []}
    checks, issues = result['checks'], result['issues']

    def problem(check, message):
        checks[check] = False
        issues.append({'check': check, 'detail': message})

    if not path.exists():
        problem('exists', 'missing file')
        return result
    try:
        root = ET.parse(str(path)).getroot()
        view = list(map(float, root.get('viewBox').split()))
        canvas = (view[0], view[1], view[0]+view[2], view[1]+view[3])
        checks['xml_parse'] = True
    except Exception as error:
        problem('xml_parse', str(error))
        return result
    original_ids = {element: element.get('id') for element in root.iter()}
    for i, element in enumerate(root.iter()):
        if not element.get('id'):
            element.set('id', f'__c_check_{i}')
    visible = [e for e in root.iter() if tag(e) in ('text', 'tspan') and not any(tag(a) in ('defs', 'clipPath', 'mask') for a in e.iterancestors())]
    words = '\n'.join(''.join(e.itertext()) for e in visible)
    accessible = '\n'.join(''.join(e.itertext()) for e in root if tag(e) in ('title', 'desc'))
    checks['forbidden_words'] = True
    terms = FORBIDDEN + (OLD_FORBIDDEN if path.parent.name == 'figures-orig' else [])
    for word in terms:
        if word in words + accessible:
            problem('forbidden_words', word)
    renderer.open(root)
    try:
        for check in ('text_within_viewbox', 'rectangles_nonoverlap', 'node_text_containment', 'text_nonoverlap', 'arrows_avoid_nodes', 'arrows_avoid_text', 'node_limit'):
            checks[check] = True
        textboxes = []
        for element in visible:
            if not ''.join(element.itertext()).strip():
                continue
            box = renderer.bbox(element)
            content = ''.join(element.itertext())
            if not contains(canvas, box):
                problem('text_within_viewbox', f'{content}: {box}')
            if tag(element) == 'text':
                textboxes.append((element, box, content))
        rects = []
        for element in root.iter():
            if tag(element) != 'rect' or any(tag(a) in ('defs', 'clipPath', 'mask') for a in element.iterancestors()):
                continue
            box = renderer.bbox(element, logical=True)
            rects.append((element, box))
        backgrounds = [e for e, b in rects if contains(b, canvas, 1)]
        swatches = [e for e, b in rects if b[2]-b[0] <= 26 and b[3]-b[1] <= 26]
        containers = [e for e, b in rects if e not in backgrounds and any(e is not e2 and contains(b, b2) for e2, b2 in rects)]
        explicit = [e for e in root.iter() if e.get('data-node') == 'true']
        if explicit:
            node_rects = []
            for group in explicit:
                candidates = [(e, b) for e, b in rects if group in e.iterancestors() or group is e]
                if len(candidates) != 1:
                    problem('node_limit', f'data-node group has {len(candidates)} rectangles; cannot hide multiple nodes in one group')
                node_rects.extend(candidates)
        else:
            node_rects = [(e, b) for e, b in rects if e not in backgrounds and e not in swatches and e not in containers]
        result['node_count'] = len(node_rects)
        if len(node_rects) > 9:
            problem('node_limit', f'{len(node_rects)} > 9')
        result['measured_text_elements'] = len(visible)
        result['rectangles'] = len(rects)
        result['excluded_rectangles'] = {'canvas_backgrounds': len(backgrounds), 'legend_swatches': len(swatches), 'containing_regions': len(containers)}
        contained_pairs = 0
        for i, (e, b) in enumerate(rects):
            for e2, b2 in rects[i+1:]:
                if contains(b, b2) or contains(b2, b):
                    contained_pairs += 1
                elif overlap(b, b2):
                    problem('rectangles_nonoverlap', f'{b} intersects {b2}')
        result['allowed_containment_pairs'] = contained_pairs
        for element, box, content in textboxes:
            group = next((g for g in element.iterancestors() if g.get('data-node') == 'true'), None)
            owners = [(e, b) for e, b in node_rects if group is not None and (group in e.iterancestors() or group is e)]
            if not owners:
                try:
                    x, y = float(element.get('x', 0)), float(element.get('y', 0))
                    owners = [(e, b) for e, b in node_rects if b[0] <= x <= b[2] and b[1] <= y <= b[3]]
                except ValueError:
                    pass
            if owners and not any(contains(b, box, .25) for _, b in owners):
                problem('node_text_containment', f'{content}: {box} outside {[b for _, b in owners]}')
        for i, (_, box, content) in enumerate(textboxes):
            for _, box2, content2 in textboxes[i+1:]:
                if overlap(box, box2, .3):
                    problem('text_nonoverlap', f'{content} / {content2}')
        arrow_count = 0
        for element in root.iter():
            if tag(element) not in ('path', 'line', 'polyline') or any(tag(a) in ('defs', 'clipPath', 'mask') for a in element.iterancestors()):
                continue
            if not (element.get('marker-end') or element.get('marker-start') or 'arrow' in element.get('class', '') or element.get('data-arrow')):
                continue
            arrow_count += 1
            if any(a.get('transform') for a in [element, *element.iterancestors()]):
                problem('arrows_avoid_nodes', 'transformed connector requires additional geometry support')
                continue
            try:
                segments = path_segments(element)
                for _, box in node_rects:
                    if any(segment_crosses(a, b, box) for a, b in segments):
                        problem('arrows_avoid_nodes', f'{element.get("d", element.attrib)} crosses {box}')
                for _, box, content in textboxes:
                    if any(segment_crosses(a, b, box) for a, b in segments):
                        problem('arrows_avoid_text', f'{element.get("d", element.attrib)} crosses text: {content}')
            except ValueError as error:
                problem('arrows_avoid_nodes', str(error))
        result['checked_arrows'] = arrow_count
        if path.parent.name == 'figures':
            checks['json_metadata'] = True
            try:
                metadata = json.loads(path.with_suffix('.json').read_text())
                title = root.find('s:title', NS)
                visual_title = [text for element, _, text in textboxes if 'v56-title' in element.get('class', '').split()]
                visual_subtitle = [text for element, _, text in textboxes if 'v56-subtitle' in element.get('class', '').split()]
                assert set(metadata) == {'id', 'title', 'subtitle'}, 'metadata keys differ'
                assert metadata['id'] == path.stem == root.get('id'), 'id differs'
                assert title is not None and metadata['title'] == ''.join(title.itertext()), 'accessible title differs'
                assert visual_title == [metadata['title']], 'visible title differs'
                assert visual_subtitle and visual_subtitle[0] == metadata['subtitle'], 'visible subtitle differs'
            except Exception as error:
                problem('json_metadata', str(error))
    finally:
        renderer.close()
    result['passed'] = not issues
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('paths', nargs='*', type=Path)
    parser.add_argument('--allow-missing', action='store_true')
    args = parser.parse_args()
    paths = args.paths or [BASE / 'figures' / (name+'.svg') for name in NEW] + [BASE / 'figures-orig' / (name+'.svg') for name in OLD]
    if args.allow_missing:
        paths = [p for p in paths if p.exists()]
    renderer = Renderer()
    results = [inspect(path.resolve(), renderer) for path in paths]
    report = {
        'method': 'librsvg 2 / Pango / installed PingFang SC font geometry; no browser',
        'scope': 'XML; rendered text/tspan ink bounds; all rectangle pairs; node text containment; text collision; straight/polyline arrow interior intersection with nodes and text; forbidden words; new SVG JSON metadata; node count <= 9',
        'exclusions': 'Only full-canvas background, <=26px legend swatches, and rectangles fully containing child rectangles are excluded from inferred business-node count. Every explicit data-node group must contain exactly one rectangle. Full rectangle containment is allowed, while partial rectangle intersection is rejected.',
        'limitations': 'Checks the installed system font and current light style. Dark style shares geometry. Collision detection uses glyph bounding boxes; unmarked decorative paths are not interpreted as arrows. Unsupported transformed/curved arrow paths fail instead of silently passing.',
        'passed': bool(results) and all(r.get('passed', False) for r in results),
        'figures': results,
    }
    (BASE / 'check-figures-results.json').write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n')
    rows = ['# SVG script checks', '', report['method'], '', '| File | Nodes | Result |', '|---|---:|---|']
    for result in results:
        rows.append(f'| {result["file"]} | {result.get("node_count", "—")} | {"PASS" if result.get("passed") else "FAIL"} |')
    rows.extend(['', 'Exclusions: '+report['exclusions'], '', 'Limits: '+report['limitations']])
    for result in results:
        if result['issues']:
            rows.extend(['', '## '+result['file']])
            rows.extend('- '+issue['check']+': '+issue['detail'] for issue in result['issues'])
    (BASE / 'check-figures-results.md').write_text('\n'.join(rows)+'\n')
    print(json.dumps({'passed': report['passed'], 'figures': [{'file': r['file'], 'nodes': r.get('node_count'), 'passed': r.get('passed'), 'issues': r['issues']} for r in results]}, ensure_ascii=False, indent=2))
    return 0 if report['passed'] else 1


if __name__ == '__main__':
    sys.exit(main())
