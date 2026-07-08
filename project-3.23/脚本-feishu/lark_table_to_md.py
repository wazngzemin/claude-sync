#!/usr/bin/env python3
"""Convert <lark-table> XML tags back to standard markdown tables."""
import re, sys
from pathlib import Path

def lark_table_to_md(text: str) -> str:
    def replace_table(m):
        xml = m.group(0)
        # Extract rows
        rows = []
        for tr_match in re.finditer(r'<lark-tr>\s*(.*?)\s*</lark-tr>', xml, re.S):
            tr_content = tr_match.group(1)
            cells = re.findall(r'<lark-td>\s*(.*?)\s*</lark-td>', tr_content, re.S)
            # Clean cell content: collapse internal whitespace/newlines to single space
            cells = [re.sub(r'\s+', ' ', c).strip() for c in cells]
            rows.append(cells)
        if not rows:
            return m.group(0)
        num_cols = max(len(r) for r in rows)
        md_lines = []
        for i, row in enumerate(rows):
            # Pad row to num_cols
            row = row + [''] * (num_cols - len(row))
            md_lines.append('| ' + ' | '.join(row) + ' |')
            if i == 0:
                md_lines.append('|' + '|'.join(['---'] * num_cols) + '|')
        return '\n'.join(md_lines)

    # Match entire <lark-table>...</lark-table> block
    text = re.sub(r'<lark-table[^>]*>.*?</lark-table>', replace_table, text, flags=re.S)
    return text


def convert_file(path: str):
    p = Path(path)
    text = p.read_text(encoding="utf-8")
    # Remove doc_id / total_length HTML comments from sync artifacts
    text = re.sub(r'<!--\s*doc_id:\s*[^>]+-->', '', text)
    text = re.sub(r'<!--\s*total_length:\s*[^>]+-->', '', text)
    text = lark_table_to_md(text)
    out = p.with_suffix('.converted.md')
    out.write_text(text, encoding="utf-8")
    print(f"Converted: {out}")


if __name__ == "__main__":
    for f in sys.argv[1:]:
        convert_file(f)
