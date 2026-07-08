#!/usr/bin/env python3
"""Clean raw Feishu markdown for re-upload via lark-cli."""
import re, sys
from pathlib import Path

def lark_table_to_md(text: str) -> str:
    def replace_table(m):
        xml = m.group(0)
        rows = []
        for tr_match in re.finditer(r'<lark-tr>\s*(.*?)\s*</lark-tr>', xml, re.S):
            tr_content = tr_match.group(1)
            cells = re.findall(r'<lark-td>\s*(.*?)\s*</lark-td>', tr_content, re.S)
            cells = [re.sub(r'\s+', ' ', c).strip() for c in cells]
            rows.append(cells)
        if not rows:
            return m.group(0)
        num_cols = max(len(r) for r in rows)
        md_lines = []
        for i, row in enumerate(rows):
            row = row + [''] * (num_cols - len(row))
            md_lines.append('| ' + ' | '.join(row) + ' |')
            if i == 0:
                md_lines.append('|' + '|'.join(['---'] * num_cols) + '|')
        return '\n'.join(md_lines)
    text = re.sub(r'<lark-table[^>]*>.*?</lark-table>', replace_table, text, flags=re.S)
    return text

def clean(text: str) -> str:
    text = lark_table_to_md(text)
    # Remove HTML comments
    text = re.sub(r'<!--.*?-->', '', text, flags=re.S)
    # Remove mention-user tags
    text = re.sub(r'<mention-user[^/]*/>', '@用户', text)
    # Convert callout to blockquote
    def callout_to_quote(m):
        inner = m.group(1).strip()
        return '\n'.join('> ' + line for line in inner.split('\n'))
    text = re.sub(r'<callout[^>]*>(.*?)</callout>', callout_to_quote, text, flags=re.S)
    # Remove other unknown self-closing XML tags
    text = re.sub(r'<[a-zA-Z-]+[^>]*/>', '', text)
    # Collapse excessive blank lines
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip() + '\n'

def process(path: str, out_dir: Path):
    p = Path(path)
    text = p.read_text(encoding='utf-8')
    text = clean(text)
    out = out_dir / (p.stem + '.cleaned.md')
    out.write_text(text, encoding='utf-8')
    return out

if __name__ == '__main__':
    out_dir = Path('raw_cleaned')
    out_dir.mkdir(exist_ok=True)
    files = sorted(Path('raw/articles/功能详述').rglob('*.md'))
    for f in files:
        # Skip .converted.md artifacts from previous step
        if '.converted.' in f.name:
            continue
        out = process(str(f), out_dir)
        print(out)
