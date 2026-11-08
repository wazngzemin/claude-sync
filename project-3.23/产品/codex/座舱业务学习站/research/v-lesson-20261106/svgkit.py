"""Tiny SVG helper for V-chapter teaching diagrams (v34)."""
from html import escape

PAL = {
    'car':   ('#eaf2fb', '#4f7ea9', '#1f4565'),
    'cloud': ('#eaf6ef', '#4a9670', '#1d4b35'),
    'mem':   ('#fdf2e6', '#c8873a', '#6a4314'),
    'plan':  ('#f6f7f8', '#98a3ad', '#4b5560'),
    'warn':  ('#fdeeee', '#c45c5c', '#6e2222'),
    'note':  ('#fffbe8', '#cdb35a', '#5c4c12'),
    'plain': ('#ffffff', '#9fb2c2', '#22384a'),
}
FONT = 'PingFang SC,Microsoft YaHei,Noto Sans CJK SC,Arial,sans-serif'


class Svg:
    def __init__(self, w, h, title, subtitle=''):
        self.w, self.h, self.title = w, h, title
        self.parts = []
        self.parts.append(f'<rect width="{w}" height="{h}" fill="#ffffff"/>')
        self.parts.append(self._t(32, 44, title, 24, '#16344a', 650))
        if subtitle:
            self.parts.append(self._t(32, 72, subtitle, 14, '#5d7183'))

    def _t(self, x, y, s, size=14, color='#22384a', weight=400, anchor='start'):
        return (f'<text x="{x}" y="{y}" font-size="{size}" fill="{color}" font-weight="{weight}" '
                f'text-anchor="{anchor}">{escape(s)}</text>')

    def text(self, x, y, s, size=14, color='#22384a', weight=400, anchor='start'):
        self.parts.append(self._t(x, y, s, size, color, weight, anchor))

    def lane(self, x, y, w, h, label, kind):
        fill, stroke, ink = PAL[kind]
        self.parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="{fill}" fill-opacity=".35" stroke="{stroke}" stroke-opacity=".45" stroke-dasharray="6 5"/>')
        self.parts.append(self._t(x + 14, y + 24, label, 15, ink, 650))

    def box(self, x, y, w, h, title, lines=(), kind='plain', dashed=False, num=None, tsize=16):
        fill, stroke, ink = PAL[kind]
        dash = ' stroke-dasharray="6 4"' if dashed or kind == 'plan' else ''
        self.parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{fill}" stroke="{stroke}" stroke-width="1.6"{dash}/>')
        tx = x + 14
        if num is not None:
            self.parts.append(f'<circle cx="{x+20}" cy="{y+22}" r="12" fill="{stroke}"/>')
            self.parts.append(self._t(x + 20, y + 27, str(num), 13, '#fff', 700, 'middle'))
            tx = x + 40
        self.parts.append(self._t(tx, y + 27, title, tsize, ink, 650))
        for i, line in enumerate(lines):
            self.parts.append(self._t(x + 14, y + 52 + i * 21, line, 14, '#33495b'))
        return (x, y, w, h)

    def diamond(self, cx, cy, w, h, lines, kind='note'):
        fill, stroke, ink = PAL[kind]
        pts = f'{cx},{cy-h/2} {cx+w/2},{cy} {cx},{cy+h/2} {cx-w/2},{cy}'
        self.parts.append(f'<polygon points="{pts}" fill="{fill}" stroke="{stroke}" stroke-width="1.6"/>')
        n = len(lines)
        for i, l in enumerate(lines):
            self.parts.append(self._t(cx, cy - (n - 1) * 10 + i * 20 + 5, l, 14, ink, 600, 'middle'))

    def arrow(self, pts, label='', at=None, dashed=False, color='#476c8d', lsize=13):
        d = 'M' + ' L'.join(f'{x},{y}' for x, y in pts)
        dash = ' stroke-dasharray="6 4"' if dashed else ''
        self.parts.append(f'<path d="{d}" fill="none" stroke="{color}" stroke-width="1.8"{dash} marker-end="url(#arr)"/>')
        if label:
            lx, ly = at if at else ((pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2 - 6)
            width = len(label) * lsize * 0.95 + 10
            self.parts.append(f'<rect x="{lx - width/2}" y="{ly - lsize - 2}" width="{width}" height="{lsize + 8}" rx="4" fill="#ffffff" fill-opacity=".92"/>')
            self.parts.append(self._t(lx, ly + 1, label, lsize, '#3c5a73', 500, 'middle'))

    def line(self, x1, y1, x2, y2, color='#c9d6e1', width=1, dashed=False):
        dash = ' stroke-dasharray="4 4"' if dashed else ''
        self.parts.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{width}"{dash}/>')

    def raw(self, s):
        self.parts.append(s)

    def render(self):
        head = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w}" height="{self.h}" '
                f'viewBox="0 0 {self.w} {self.h}" role="img" aria-label="{escape(self.title)}">'
                f'<title>{escape(self.title)}</title><defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" '
                f'markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" '
                f'stroke="#476c8d" stroke-width="1.8"/></marker></defs><g font-family="{FONT}">')
        return head + ''.join(self.parts) + '</g></svg>'
