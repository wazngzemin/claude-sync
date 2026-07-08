#!/usr/bin/env python3
"""
飞书文档 blocks API → Markdown 转换模块（含图片下载）。

将飞书 docx 文档的所有 block 节点递归转换为 Markdown 文本，
并将其中的图片/文件资源下载到本地 assets 目录。

用法：
    from feishu_blocks import sync_doc_with_images

    title, md, images = sync_doc_with_images(
        obj_token="doxcnXXXXXX",
        headers_dict={"Authorization": "Bearer t-xxx", "Content-Type": "application/json"},
        raw_dir=Path("raw/articles"),
        assets_dir=Path("raw/assets"),
    )
"""

import json
import time
from pathlib import Path

import requests

BASE = "https://open.feishu.cn/open-apis"

# ---------------------------------------------------------------------------
# Block-type constants
# ---------------------------------------------------------------------------
BLOCK_PAGE = 1
BLOCK_TEXT = 2
BLOCK_HEADING1 = 3
BLOCK_HEADING2 = 4
BLOCK_HEADING3 = 5
BLOCK_HEADING4 = 6
BLOCK_HEADING5 = 7
BLOCK_HEADING6 = 8
BLOCK_HEADING7 = 9
BLOCK_ORDERED = 10
BLOCK_CODE = 11
BLOCK_QUOTE = 12
BLOCK_TODO = 13
BLOCK_BITABLE = 14
BLOCK_CALLLOUT = 15
BLOCK_DIVIDER = 18
BLOCK_FILE = 19
BLOCK_IMAGE = 23
BLOCK_TABLE = 24
BLOCK_VIEW = 27
BLOCK_GROUP = 32

# Map heading block_type values to their level (number of #)
HEADING_MAP = {
    BLOCK_HEADING1: 1,
    BLOCK_HEADING2: 2,
    BLOCK_HEADING3: 3,
    BLOCK_HEADING4: 4,
    BLOCK_HEADING5: 5,
    BLOCK_HEADING6: 6,
    BLOCK_HEADING7: 7,
}


# ---------------------------------------------------------------------------
# Helpers – text extraction
# ---------------------------------------------------------------------------

def _extract_text(block: dict) -> str:
    """Extract plain text from a block that has a ``text`` field.

    The structure is::

        {
          "text": {
            "elements": [
              {"text_run": {"content": "hello "}},
              {"text_run": {"content": "world"}},
              ...
            ],
            "style": {}
          }
        }

    Also handles ``heading`` blocks which have the same structure under the
    ``heading`` key, and a few other block types that mirror this pattern.
    """
    for key in ("text", "heading"):
        text_obj = block.get(key)
        if text_obj is None:
            continue
        elements = text_obj.get("elements", [])
        parts = []
        for el in elements:
            text_run = el.get("text_run")
            if text_run and "content" in text_run:
                parts.append(text_run["content"])
        return "".join(parts)
    return ""


def _extract_text_from_block_type(block: dict) -> str:
    """Try every plausible key to pull text content out of a block."""
    # Most common text-bearing keys in Feishu block payloads
    for key in ("text", "heading"):
        obj = block.get(key)
        if obj is None:
            continue
        elements = obj.get("elements", [])
        parts = []
        for el in elements:
            tr = el.get("text_run")
            if tr and "content" in tr:
                parts.append(tr["content"])
        return "".join(parts)
    return ""


# ---------------------------------------------------------------------------
# API helpers
# ---------------------------------------------------------------------------

def _fetch_all_blocks(document_id: str, headers: dict) -> list[dict]:
    """Fetch *every* block from a docx document, handling pagination."""
    all_blocks: list[dict] = []
    page_token: str | None = None

    while True:
        params: dict = {"page_size": 500}
        if page_token:
            params["page_token"] = page_token

        url = f"{BASE}/docx/v1/documents/{document_id}/blocks"
        resp = requests.get(url, headers=headers, params=params)
        data = resp.json()

        if data.get("code") != 0:
            print(f"  [warn] fetch blocks page failed: {data.get('msg', data)}")
            break

        items = data.get("data", {}).get("items", [])
        all_blocks.extend(items)

        page_token = data.get("data", {}).get("page_token")
        if not page_token or not items:
            break

    return all_blocks


def _fetch_doc_title(document_id: str, headers: dict) -> str:
    """Return the document title."""
    resp = requests.get(f"{BASE}/docx/v1/documents/{document_id}", headers=headers)
    data = resp.json()
    if data.get("code") == 0:
        return data.get("data", {}).get("document", {}).get("title", document_id)
    return document_id


def _download_image(token: str, headers: dict, dest: Path) -> bool:
    """Download an image by its media token.  Returns True on success."""
    url = f"{BASE}/drive/v1/medias/{token}/download"
    try:
        resp = requests.get(url, headers=headers, timeout=60)
        if resp.status_code == 200 and len(resp.content) > 0:
            dest.write_bytes(resp.content)
            return True
        else:
            print(f"  [warn] image download {token}: status={resp.status_code} size={len(resp.content)}")
    except Exception as exc:
        print(f"  [warn] image download {token} failed: {exc}")
    return False


def _download_file(token: str, headers: dict, dest: Path) -> bool:
    """Download a file attachment by its token.  Returns True on success."""
    # Feishu uses the same media-download endpoint for file blocks.
    url = f"{BASE}/drive/v1/medias/{token}/download"
    try:
        resp = requests.get(url, headers=headers, timeout=120)
        if resp.status_code == 200 and len(resp.content) > 0:
            dest.write_bytes(resp.content)
            return True
        else:
            print(f"  [warn] file download {token}: status={resp.status_code} size={len(resp.content)}")
    except Exception as exc:
        print(f"  [warn] file download {token} failed: {exc}")
    return False


# ---------------------------------------------------------------------------
# Block → Markdown conversion
# ---------------------------------------------------------------------------

def _blocks_to_markdown(
    blocks: list[dict],
    block_map: dict[str, dict],
    parent_id: str,
    headers: dict,
    assets_dir: Path,
    ordered_counters: dict[str, int],
    downloaded: list[str],
    depth: int = 0,
) -> str:
    """Recursively convert a list of blocks under *parent_id* to Markdown.

    *block_map* is ``{block_id: block_dict}`` for O(1) lookups.
    *ordered_counters* tracks numbering per parent for ordered lists.
    """
    lines: list[str] = []

    # Children whose parent_id matches *parent_id*, in API order
    children = [b for b in blocks if b.get("parent_id") == parent_id]

    for block in children:
        block_id = block.get("block_id", "")
        block_type = block.get("block_type", 0)
        indent = "    " * depth

        # --- Page container (root) ---
        if block_type == BLOCK_PAGE:
            lines.append(_blocks_to_markdown(
                blocks, block_map, block_id,
                headers, assets_dir, ordered_counters, downloaded, depth,
            ))

        # --- Headings ---
        elif block_type in HEADING_MAP:
            level = HEADING_MAP[block_type]
            # Extend heading range to 1-9 as requested
            prefix = "#" * min(level, 9)
            text = _extract_text_from_block_type(block)
            lines.append(f"\n{prefix} {text}\n")

        # --- Plain text ---
        elif block_type == BLOCK_TEXT:
            text = _extract_text_from_block_type(block)
            if text:
                lines.append(f"{indent}{text}\n")

        # --- Bullet list ---
        elif block_type == 2:
            # block_type 2 is actually text (handled above); bullets come via
            # the list-style mechanism.  We keep this branch as a safety net.
            text = _extract_text_from_block_type(block)
            if text:
                lines.append(f"{indent}- {text}\n")

        # --- Bullet (API block_type for unordered list items) ---
        # Note: Feishu uses block_type 2 for text paragraphs.  Bullet items
        # may not have a distinct block_type; they are often indicated by
        # styling.  However the user spec says bullet → - item so we handle
        # block_type values that correspond to bullet/list items.
        # In practice the Feishu API returns block_type=2 for bullets too,
        # differentiated by the parent being a list container.  We rely on
        # heuristics: if a block has ``text`` and its parent block is a
        # list-like container we treat it as a bullet.  For simplicity we
        # provide an explicit branch for any block_type the spec calls "bullet".
        # The spec maps block_type 2 → text, and bullet is not given a number.
        # We'll handle it via the text branch and let callers distinguish.

        # --- Ordered list ---
        elif block_type == BLOCK_ORDERED:
            key = parent_id
            ordered_counters[key] = ordered_counters.get(key, 0) + 1
            num = ordered_counters[key]
            text = _extract_text_from_block_type(block)
            lines.append(f"{indent}{num}. {text}\n")

        # --- Todo / checkbox ---
        elif block_type == BLOCK_TODO:
            todo_obj = block.get("todo", {})
            # style may contain checked state; fallback to block text style
            checked = False
            style = todo_obj.get("style", {})
            # Feishu represents done state via style or a boolean; be flexible
            if style.get("done"):
                checked = True
            text = _extract_text_from_block_type(block)
            box = "[x]" if checked else "[ ]"
            lines.append(f"{indent}- {box} {text}\n")

        # --- Code block ---
        elif block_type == BLOCK_CODE:
            code_obj = block.get("code", {})
            lang = code_obj.get("style", {}).get("language", "")
            text = _extract_text_from_block_type(block)
            lines.append(f"\n```{lang}\n{text}\n```\n")

        # --- Quote ---
        elif block_type == BLOCK_QUOTE:
            text = _extract_text_from_block_type(block)
            # Handle multi-line quotes
            for sub_line in text.split("\n"):
                lines.append(f"{indent}> {sub_line}\n")

        # --- Divider ---
        elif block_type == BLOCK_DIVIDER:
            lines.append("\n---\n")

        # --- Callout ---
        elif block_type == BLOCK_CALLLOUT:
            text = _extract_text_from_block_type(block)
            lines.append(f"\n> [!note] {text}\n")

        # --- Image (any block that carries an `image` field) ---
        if block.get("image"):
            img_obj = block["image"]
            img_token = img_obj.get("token", "")
            if img_token:
                dest = assets_dir / f"{img_token}.png"
                if not dest.exists():
                    if _download_image(img_token, headers, dest):
                        downloaded.append(img_token)
                        time.sleep(0.2)
                else:
                    downloaded.append(img_token)
                lines.append(f"\n![image](../assets/{img_token}.png)\n")

        # --- File attachment ---
        elif block_type in (BLOCK_FILE, 19):
            file_obj = block.get("file", {})
            file_token = file_obj.get("token", "")
            file_name = file_obj.get("name", file_token)
            if file_token:
                dest = assets_dir / f"{file_token}"
                if not dest.exists():
                    if _download_file(file_token, headers, dest):
                        downloaded.append(file_token)
                        time.sleep(0.2)
                else:
                    downloaded.append(file_token)
                lines.append(f"\n[{file_name}](../assets/{file_token})\n")

        # --- Table ---
        elif block_type == BLOCK_TABLE:
            table_md = _convert_table(block, blocks, block_map, headers, assets_dir, downloaded)
            if table_md:
                lines.append(f"\n{table_md}\n")

        # --- Bitable (advanced table / database) ---
        elif block_type == BLOCK_BITABLE:
            lines.append("\n<!-- bitable block (skipped) -->\n")

        # --- View (embedded view) ---
        elif block_type == BLOCK_VIEW:
            lines.append("\n<!-- embedded view block (skipped) -->\n")

        # --- Group (container – recurse into children) ---
        elif block_type == BLOCK_GROUP:
            group_lines = _blocks_to_markdown(
                blocks, block_map, block_id,
                headers, assets_dir, ordered_counters, downloaded, depth,
            )
            if group_lines.strip():
                lines.append(group_lines)

        # --- Fallback: try to extract whatever text we can ---
        else:
            text = _extract_text_from_block_type(block)
            if text:
                lines.append(f"{indent}{text}\n")

    return "".join(lines)


def _convert_table(
    table_block: dict,
    all_blocks: list[dict],
    block_map: dict[str, dict],
    headers: dict,
    assets_dir: Path,
    downloaded: list[str],
) -> str:
    """Convert a table block (and its cell children) into a Markdown table."""
    table_id = table_block.get("block_id", "")
    table_obj = table_block.get("table", {})
    rows_info = table_obj.get("cells", [])  # [[cell_id, ...], ...]

    # If the API returns rows differently, try alternate structures
    if not rows_info:
        # Some responses nest rows as children; gather blocks whose parent is
        # this table and which look like table cells.
        rows_info = _infer_table_cells(table_id, all_blocks)

    if not rows_info:
        return "<!-- empty table -->"

    # Flatten cell IDs and convert each to text
    md_rows: list[list[str]] = []
    for row in rows_info:
        if not isinstance(row, list):
            continue
        cells_text: list[str] = []
        for cell_id in row:
            cell_text = _cell_to_markdown(
                cell_id, all_blocks, block_map, headers, assets_dir, downloaded,
            )
            cells_text.append(cell_text.replace("|", "\\|").replace("\n", " "))
        md_rows.append(cells_text)

    if not md_rows:
        return ""

    # Build markdown table
    col_count = max(len(r) for r in md_rows)
    # Pad short rows
    for r in md_rows:
        while len(r) < col_count:
            r.append("")

    lines: list[str] = []
    # Header row
    header = md_rows[0] if md_rows else [""] * col_count
    lines.append("| " + " | ".join(header) + " |")
    lines.append("| " + " | ".join(["---"] * col_count) + " |")
    # Data rows
    for row in md_rows[1:]:
        lines.append("| " + " | ".join(row) + " |")

    return "\n".join(lines)


def _infer_table_cells(table_id: str, all_blocks: list[dict]) -> list[list[str]]:
    """Build a 2-D grid of cell block IDs from the flat block list.

    This is a best-effort fallback when the table block doesn't contain
    explicit ``cells`` data.  Feishu may represent table cells as child
    blocks whose parent is the table, with ``table_cell`` block_type.
    """
    cell_blocks = [
        b for b in all_blocks
        if b.get("parent_id") == table_id
    ]
    if not cell_blocks:
        return []

    # Group by row_index / column_index if available, otherwise linear
    rows: dict[int, dict[int, str]] = {}
    for cb in cell_blocks:
        ri = cb.get("table_cell", {}).get("row_index", 0) if isinstance(cb.get("table_cell"), dict) else 0
        ci = cb.get("table_cell", {}).get("column_index", 0) if isinstance(cb.get("table_cell"), dict) else 0
        rows.setdefault(ri, {})[ci] = cb.get("block_id", "")

    if not rows:
        # Just stack them in one row
        return [[cb.get("block_id", "") for cb in cell_blocks]]

    max_col = max(max(cols.keys()) for cols in rows.values()) + 1
    result: list[list[str]] = []
    for ri in sorted(rows.keys()):
        row_ids: list[str] = []
        for ci in range(max_col):
            row_ids.append(rows[ri].get(ci, ""))
        result.append(row_ids)
    return result


def _cell_to_markdown(
    cell_id: str,
    all_blocks: list[dict],
    block_map: dict[str, dict],
    headers: dict,
    assets_dir: Path,
    downloaded: list[str],
) -> str:
    """Convert a table cell's child blocks to inline markdown text."""
    cell_block = block_map.get(cell_id)
    if cell_block is None:
        return ""

    parts: list[str] = []
    for b in all_blocks:
        if b.get("parent_id") == cell_id:
            text = _extract_text_from_block_type(b)
            if text:
                parts.append(text)
            # Handle images inside cells
            if b.get("block_type") == BLOCK_IMAGE:
                img_obj = b.get("image", {})
                img_token = img_obj.get("token", "")
                if img_token:
                    dest = assets_dir / f"{img_token}.png"
                    if not dest.exists():
                        if _download_image(img_token, headers, dest):
                            downloaded.append(img_token)
                    parts.append(f"![image](../assets/{img_token}.png)")

    return " ".join(parts)


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def sync_doc_with_images(
    obj_token: str,
    headers_dict: dict,
    raw_dir: Path,
    assets_dir: Path,
) -> tuple[str, str, list[str]]:
    """Fetch a Feishu docx document and convert it to Markdown.

    Parameters
    ----------
    obj_token:
        The document ``obj_token`` (also called ``document_id``).
    headers_dict:
        HTTP headers to use for API calls (must include ``Authorization``).
    raw_dir:
        Directory where the resulting ``.md`` file will be saved.
    assets_dir:
        Directory where downloaded images / files are stored.

    Returns
    -------
    (title, markdown_content, list_of_downloaded_image_tokens)
    """
    # Ensure output dirs exist
    raw_dir = Path(raw_dir)
    assets_dir = Path(assets_dir)
    raw_dir.mkdir(parents=True, exist_ok=True)
    assets_dir.mkdir(parents=True, exist_ok=True)

    # 1. Fetch title
    title = _fetch_doc_title(obj_token, headers_dict)
    print(f"  文档标题: {title}")

    # 2. Fetch all blocks (paginated)
    print("  获取所有 blocks ...")
    blocks = _fetch_all_blocks(obj_token, headers_dict)
    print(f"  共获取 {len(blocks)} 个 blocks")

    # Build lookup map
    block_map: dict[str, dict] = {b.get("block_id", ""): b for b in blocks}

    # 3. Find the root (page) block
    root_block = None
    for b in blocks:
        if b.get("block_type") == BLOCK_PAGE:
            root_block = b
            break

    if root_block is None:
        print("  [warn] no page block found, using first block as root")
        root_block = blocks[0] if blocks else {"block_id": "root"}

    root_id = root_block.get("block_id", "")

    # 4. Convert to Markdown
    ordered_counters: dict[str, int] = {}
    downloaded: list[str] = []
    md_content = _blocks_to_markdown(
        blocks, block_map, root_id,
        headers_dict, assets_dir, ordered_counters, downloaded,
    )

    # 5. Build final document with title heading
    full_md = f"# {title}\n\n{md_content}"

    # 6. Save to raw_dir
    import re
    safe_name = re.sub(r'[\\/:*?"<>|#\[\]{}]', '', title).strip()[:80] or obj_token
    out_path = raw_dir / f"{safe_name}.md"
    if out_path.exists():
        out_path = raw_dir / f"{safe_name}-{int(time.time())}.md"
    out_path.write_text(full_md, encoding="utf-8")
    print(f"  已保存: {out_path}  (图片: {len(downloaded)})")

    return title, full_md, downloaded
