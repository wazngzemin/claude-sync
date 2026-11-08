#!/usr/bin/env python3
"""Codex cross-device snapshot, mirror and guarded native import.

This module deliberately treats Codex's SQLite files as read-only sources.  The
portable sync payload contains metadata, exact compressed rollout JSONL files,
an optional normalized history export, context files and a personal-folder
archive.  It never copies a live SQLite database to the sync repository.
"""

from __future__ import annotations

import datetime as _dt
import gzip
import hashlib
import json
import os
import re
import shutil
import sqlite3
import subprocess
import sys
import tarfile
import tempfile
from pathlib import Path
from typing import Any, Dict, Iterable, Iterator, List, Optional, Sequence, Tuple


MANIFEST_VERSION = 1
ARCHIVE_PART_BYTES = 48 * 1024 * 1024
CODEX_HOME_DEFAULT = Path(os.environ.get("CODEX_HOME_DIR", str(Path.home() / ".codex"))).expanduser()
PERSONAL_DIR_DEFAULT = Path(os.environ.get("CODEX_PERSONAL_DIR", str(Path.home() / "Documents" / "ChatGPT" / "个人"))).expanduser()
SYNC_REPO_DEFAULT = Path(os.environ.get("CODEX_SYNC_REPO_DIR", str(Path.home() / ".codex-sync"))).expanduser()

THREAD_ID_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]{7,127}$")
SAFE_REL_RE = re.compile(r"^[A-Za-z0-9._/-]+$")

CONTEXT_DIRS = (
    ("memories", "memories", "memories"),
    ("rules", "rules", "rules"),
    ("plans", "plans", "plans"),
    ("agents", "agents", "agents"),
    ("vendor_imports/skills", "skills", "vendor_imports/skills"),
    ("skills", "skills-root", "skills"),
)
ARTIFACT_DIRS = (
    ("generated_images", "generated_images"),
    ("visualizations", "visualizations"),
)

NATIVE_STATE_TABLES = (
    "thread_spawn_edges",
    "thread_dynamic_tools",
    "thread_artifacts",
    "threads",
    "project_roots",
    "projects",
    "thread_sections",
)
NATIVE_HISTORY_TABLES = (
    "thread_realtime_items",
    "thread_items",
    "thread_turns",
    "thread_history_projection_state",
)
NATIVE_ROLLOUT_DIRS = ("sessions", "archived_sessions")

# The desktop sidebar layout (pinned order, project folders, group order) is
# not stored in SQLite on current Codex versions.  It lives in the app's
# persisted atom state, so the snapshot has to carry it separately.
GLOBAL_STATE_NAME = ".codex-global-state.json"
SIDEBAR_TOP_KEYS = (
    "project-order",
    "pinned-thread-ids",
    "local-projects",
    "thread-project-assignments",
    "projectless-thread-ids",
    "thread-projectless-output-directories",
    "app-server-migrated-pinned-thread-ids-by-host",
    "app-server-project-id-by-legacy-project-id-by-host",
    "app-server-projects-migration-by-host",
    "sidebar-project-thread-orders",
    "project-appearances",
    "thread-titles",
    "thread-writable-roots",
    "selected-project",
)
SIDEBAR_ATOM_KEYS = (
    "app-server-pinned-thread-order-v1",
    "app-server-migrated-pinned-thread-ids-by-host",
    "app-server-project-id-by-legacy-project-id-by-host",
    "app-server-projects-migration-by-host",
    "sidebar-project-thread-orders",
    "sidebar-collapsed-sections-v1",
    "sidebar-custom-sections-v3",
    "flat-project-sidebar-preferences-v1",
    "sidebar-project-list-expanded-v1",
)
SIDEBAR_ATOM_PREFIXES = ("sidebar-project-expanded-v1",)
HOST_SCOPED_KEYS = (
    "app-server-migrated-pinned-thread-ids-by-host",
    "app-server-project-id-by-legacy-project-id-by-host",
    "app-server-projects-migration-by-host",
)

SECRET_NAME_RE = re.compile(
    r"(^|[._-])(env|token|secret|credential|credentials|password|passwd|private|oauth|api[-_]?key)([._-]|$)",
    re.IGNORECASE,
)
EXCLUDED_CONTEXT_SUFFIXES = (".sqlite", ".sqlite-wal", ".sqlite-shm", ".db-wal", ".db-shm")


class CodexSyncError(RuntimeError):
    """A user-facing, non-traceback error."""


def _now() -> str:
    return _dt.datetime.now(_dt.timezone.utc).isoformat(timespec="seconds")


def _json_default(value: Any) -> Any:
    if isinstance(value, bytes):
        return {"__bytes__": value.hex()}
    if isinstance(value, (Path, _dt.datetime)):
        return str(value)
    return str(value)


def _json_object_hook(value: Dict[str, Any]) -> Any:
    if set(value) == {"__bytes__"} and isinstance(value.get("__bytes__"), str):
        try:
            return bytes.fromhex(value["__bytes__"])
        except ValueError:
            return value
    return value


def _json_load(path: Path, default: Any = None) -> Any:
    try:
        with path.open("r", encoding="utf-8") as fh:
            return json.load(fh, object_hook=_json_object_hook)
    except (FileNotFoundError, json.JSONDecodeError, OSError):
        return default


def _write_json_atomic(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp_name = tempfile.mkstemp(prefix=f".{path.name}.", suffix=".tmp", dir=str(path.parent))
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as fh:
            json.dump(value, fh, ensure_ascii=False, indent=2, default=_json_default)
            fh.write("\n")
            fh.flush()
            os.fsync(fh.fileno())
        os.replace(tmp_name, path)
    finally:
        try:
            os.unlink(tmp_name)
        except FileNotFoundError:
            pass


def _sha256_file(path: Path, chunk_size: int = 1024 * 1024) -> Tuple[str, int]:
    digest = hashlib.sha256()
    total = 0
    with path.open("rb") as fh:
        while True:
            chunk = fh.read(chunk_size)
            if not chunk:
                break
            digest.update(chunk)
            total += len(chunk)
    return digest.hexdigest(), total


def _safe_child(root: Path, relative: str) -> Path:
    """Return a path under root or raise for traversal/absolute paths."""
    if not relative or relative.startswith("/") or "\\" in relative:
        raise CodexSyncError("非法同步路径")
    parts = Path(relative).parts
    if any(part in ("", ".", "..") for part in parts):
        raise CodexSyncError("非法同步路径")
    candidate = (root / Path(*parts)).resolve()
    root_real = root.resolve()
    try:
        common = os.path.commonpath([str(candidate), str(root_real)])
    except ValueError:
        common = ""
    if common != str(root_real):
        raise CodexSyncError("路径超出同步目录")
    return candidate


def _is_within(path: Path, root: Path) -> bool:
    try:
        return os.path.commonpath([str(path.resolve()), str(root.resolve())]) == str(root.resolve())
    except (ValueError, OSError):
        return False


def _sqlite_ro(path: Path) -> sqlite3.Connection:
    uri = "file:" + str(path).replace("\\", "/").replace("?", "%3F") + "?mode=ro"
    conn = sqlite3.connect(uri, uri=True, timeout=2)
    conn.row_factory = sqlite3.Row
    return conn


def _table_names(conn: sqlite3.Connection) -> set:
    rows = conn.execute("select name from sqlite_master where type='table'").fetchall()
    return {str(row[0]) for row in rows}


def _schema_signature(conn: sqlite3.Connection, tables: Sequence[str]) -> str:
    chunks: List[str] = []
    for table in sorted(tables):
        try:
            cols = conn.execute(f'pragma table_info("{table}")').fetchall()
        except sqlite3.DatabaseError:
            cols = []
        chunks.append(table)
        for row in cols:
            chunks.append("|".join(str(x) for x in row[:6]))
    return hashlib.sha256("\n".join(chunks).encode("utf-8")).hexdigest()


def discover_databases(codex_home: Path = CODEX_HOME_DEFAULT) -> Dict[str, Any]:
    """Find Codex DBs by schema, not by the current numeric suffix."""
    codex_home = Path(codex_home)
    candidates: List[Path] = []
    for pattern in ("*.sqlite", "*.db"):
        candidates.extend(p for p in codex_home.glob(pattern) if p.is_file())
        candidates.extend(p for p in (codex_home / "sqlite").glob(pattern) if p.is_file())
    # De-duplicate while preserving a deterministic order.
    candidates = sorted({p.resolve() for p in candidates})
    state_matches: List[Tuple[int, Path, List[str]]] = []
    history_matches: List[Tuple[int, Path, List[str]]] = []
    for candidate in candidates:
        try:
            conn = _sqlite_ro(candidate)
            tables = _table_names(conn)
            conn.close()
        except sqlite3.DatabaseError:
            continue
        try:
            mtime_ns = candidate.stat().st_mtime_ns
        except OSError:
            mtime_ns = 0
        if {"threads", "projects", "thread_sections"}.issubset(tables):
            state_matches.append((mtime_ns, candidate, sorted(tables)))
        if {"thread_items", "thread_turns"}.issubset(tables):
            history_matches.append((mtime_ns, candidate, sorted(tables)))
    # Codex can leave older schema-compatible databases behind after an
    # upgrade.  The desktop app uses the current/newest one, not the first
    # lexicographic filename.
    state = max(state_matches, default=None, key=lambda item: (item[0], str(item[1])))
    history = max(history_matches, default=None, key=lambda item: (item[0], str(item[1])))
    return {
        "state": str(state[1]) if state else None,
        "history": str(history[1]) if history else None,
        "state_tables": state[2] if state else [],
        "history_tables": history[2] if history else [],
        "state_candidates": [
            str(item[1]) for item in sorted(state_matches, key=lambda item: (item[0], str(item[1])), reverse=True)
        ],
        "history_candidates": [
            str(item[1]) for item in sorted(history_matches, key=lambda item: (item[0], str(item[1])), reverse=True)
        ],
    }


def _read_rows(conn: sqlite3.Connection, table: str) -> List[Dict[str, Any]]:
    rows = conn.execute(f'select * from "{table}"').fetchall()
    return [dict(row) for row in rows]


def _path_rel_to(root: Path, path: Path) -> Optional[str]:
    if not _is_within(path, root):
        return None
    return str(path.resolve().relative_to(root.resolve()))


def _relative_rollout_path(path: str, codex_home: Path) -> Optional[str]:
    if not path:
        return None
    candidate = Path(path).expanduser()
    if not candidate.is_absolute():
        candidate = codex_home / candidate
    if not _is_within(candidate, codex_home):
        return None
    return _path_rel_to(codex_home, candidate)


def _extract_text(value: Any) -> str:
    """Extract display/search text from common Codex message blocks."""
    if isinstance(value, str):
        return value
    if isinstance(value, list):
        return "\n".join(part for part in (_extract_text(item) for item in value) if part)
    if not isinstance(value, dict):
        return ""
    pieces: List[str] = []
    for key in ("text", "input_text", "output_text", "summary"):
        val = value.get(key)
        if isinstance(val, str) and val.strip():
            pieces.append(val)
    if pieces:
        return "\n".join(pieces)
    if "content" in value:
        return _extract_text(value.get("content"))
    return ""


def _search_text_from_event(event: Any) -> str:
    if not isinstance(event, dict):
        return ""
    event_type = event.get("type")
    payload = event.get("payload") if isinstance(event.get("payload"), dict) else event
    if event_type == "response_item" and isinstance(payload, dict):
        role = payload.get("role")
        if role in ("user", "assistant"):
            return _extract_text(payload.get("content"))
    if event_type in ("message", "agent_message"):
        return _extract_text(payload)
    return ""


def _iter_jsonl(path: Path) -> Iterator[Tuple[bytes, Optional[Any]]]:
    with path.open("rb") as fh:
        for raw in fh:
            try:
                parsed = json.loads(raw.decode("utf-8"))
            except (UnicodeDecodeError, json.JSONDecodeError):
                parsed = None
            yield raw, parsed


def _iter_gzip_jsonl(path: Path) -> Iterator[Tuple[bytes, Optional[Any]]]:
    with gzip.open(path, "rb") as fh:
        for raw in fh:
            try:
                parsed = json.loads(raw.decode("utf-8"))
            except (UnicodeDecodeError, json.JSONDecodeError):
                parsed = None
            yield raw, parsed


def _archive_part_name(base: Path, index: int) -> str:
    return f"{base.name}.part-{index:05d}.jsonl.gz"


def _remove_archive_parts(base: Path) -> None:
    for old in base.parent.glob(f"{base.name}.part-*.jsonl.gz"):
        try:
            old.unlink()
        except FileNotFoundError:
            pass
    # Remove snapshots created by the pre-chunking implementation.
    old_single = base.with_suffix(".jsonl.gz")
    if old_single.exists():
        old_single.unlink()


def _write_gzip_part(base: Path, index: int, lines: Iterable[bytes]) -> Tuple[str, int, int]:
    base.parent.mkdir(parents=True, exist_ok=True)
    name = _archive_part_name(base, index)
    target = base.parent / name
    fd, tmp_name = tempfile.mkstemp(prefix=f".{name}.", suffix=".part", dir=str(base.parent))
    raw_bytes = 0
    try:
        with os.fdopen(fd, "wb") as raw_out:
            with gzip.GzipFile(fileobj=raw_out, mode="wb", mtime=0) as gz:
                for raw in lines:
                    raw_bytes += len(raw)
                    gz.write(raw)
            raw_out.flush()
            os.fsync(raw_out.fileno())
        os.replace(tmp_name, target)
    finally:
        try:
            os.unlink(tmp_name)
        except FileNotFoundError:
            pass
    return name, raw_bytes, target.stat().st_size


def _gzip_lines_to_parts(lines: Iterable[bytes], target_base: Path) -> Dict[str, Any]:
    """Write concatenable gzip members, each below the remote-file limit."""
    _remove_archive_parts(target_base)
    digest = hashlib.sha256()
    total_raw = 0
    total_archive = 0
    part_index = 0
    part_lines: List[bytes] = []
    part_bytes = 0
    parts: List[str] = []

    def flush() -> None:
        nonlocal part_index, part_lines, part_bytes, total_archive
        if not part_lines:
            return
        name, _, archive_bytes = _write_gzip_part(target_base, part_index, part_lines)
        parts.append(name)
        total_archive += archive_bytes
        part_index += 1
        part_lines = []
        part_bytes = 0

    for raw in lines:
        digest.update(raw)
        total_raw += len(raw)
        if part_lines and part_bytes + len(raw) > ARCHIVE_PART_BYTES:
            flush()
        part_lines.append(raw)
        part_bytes += len(raw)
    flush()
    if not parts:
        name, _, archive_bytes = _write_gzip_part(target_base, 0, [])
        parts.append(name)
        total_archive += archive_bytes
    return {
        "source_sha256": digest.hexdigest(),
        "source_bytes": total_raw,
        "archive_bytes": total_archive,
        "archive_parts": parts,
    }


def _gzip_copy_jsonl(source: Path, target_base: Path) -> Dict[str, Any]:
    digest = hashlib.sha256()
    search_parts: List[str] = []

    def lines() -> Iterator[bytes]:
        for raw, parsed in _iter_jsonl(source):
            digest.update(raw)
            if parsed is not None:
                text = _search_text_from_event(parsed)
                if text:
                    search_parts.append(text)
            yield raw

    info = _gzip_lines_to_parts(lines(), target_base)
    info["source_sha256"] = digest.hexdigest()
    info["search_text"] = "\n".join(search_parts)[:200000]
    return info


def _gzip_write_lines(
    lines: Iterable[bytes], target_base: Path, collect_search: bool = False
) -> Dict[str, Any]:
    search_parts: List[str] = []

    def wrapped() -> Iterator[bytes]:
        for raw in lines:
            if collect_search:
                try:
                    parsed = json.loads(raw.decode("utf-8"))
                except (UnicodeDecodeError, json.JSONDecodeError):
                    parsed = None
                if parsed is not None:
                    text = _search_text_from_event(parsed)
                    if text:
                        search_parts.append(text)
            yield raw

    info = _gzip_lines_to_parts(wrapped(), target_base)
    if collect_search:
        info["search_text"] = "\n".join(search_parts)[:200000]
    return info


def _iter_archive_jsonl(paths: Sequence[Path]) -> Iterator[Tuple[bytes, Optional[Any]]]:
    for path in paths:
        yield from _iter_gzip_jsonl(path)


def _reconstructed_lines(history_conn: sqlite3.Connection, thread_id: str) -> Iterator[bytes]:
    rows = history_conn.execute(
        "select item_json from thread_items where thread_id=? order by rollout_ordinal, item_id",
        (thread_id,),
    )
    for row in rows:
        value = row[0]
        if isinstance(value, bytes):
            raw = value
        else:
            raw = str(value).encode("utf-8")
        if not raw.endswith(b"\n"):
            raw += b"\n"
        yield raw


def _copy_tree_filtered(source: Path, target: Path, excluded: Optional[List[str]] = None) -> Dict[str, Any]:
    """Copy a context/artifact tree while excluding credential/runtime files."""
    excluded = excluded or []
    count = 0
    bytes_total = 0
    warnings: List[str] = []
    if not source.exists():
        return {"exists": False, "files": 0, "bytes": 0, "warnings": []}
    target.mkdir(parents=True, exist_ok=True)
    for root, dirs, files in os.walk(source, topdown=True, followlinks=False):
        root_path = Path(root)
        rel_root = root_path.relative_to(source)
        kept_dirs: List[str] = []
        for dirname in dirs:
            if dirname in ("__pycache__", ".git") or SECRET_NAME_RE.search(dirname):
                warnings.append(str(rel_root / dirname))
                continue
            kept_dirs.append(dirname)
        dirs[:] = kept_dirs
        dest_root = target / rel_root
        dest_root.mkdir(parents=True, exist_ok=True)
        for filename in files:
            src = root_path / filename
            rel = rel_root / filename
            lower = filename.lower()
            if SECRET_NAME_RE.search(filename) or lower.endswith(EXCLUDED_CONTEXT_SUFFIXES):
                warnings.append(str(rel))
                continue
            if any(str(rel).startswith(prefix) for prefix in excluded):
                continue
            dst = dest_root / filename
            try:
                if src.is_symlink():
                    link_target = os.readlink(src)
                    if os.path.isabs(link_target) or ".." in Path(link_target).parts:
                        warnings.append(f"{rel}: rejected unsafe symlink")
                        continue
                    if dst.exists() or dst.is_symlink():
                        dst.unlink()
                    dst.symlink_to(link_target)
                else:
                    shutil.copy2(src, dst)
                    count += 1
                    bytes_total += src.stat().st_size
            except OSError as exc:
                warnings.append(f"{rel}: {exc}")
    return {"exists": True, "files": count, "bytes": bytes_total, "warnings": warnings}


def _safe_tar_extract(archive: Path, target: Path) -> int:
    target.mkdir(parents=True, exist_ok=True)
    count = 0
    target_real = target.resolve()
    with tarfile.open(archive, "r:gz") as tf:
        members = tf.getmembers()
        for member in members:
            candidate = (target / member.name).resolve()
            try:
                common = os.path.commonpath([str(candidate), str(target_real)])
            except ValueError:
                common = ""
            if common != str(target_real):
                raise CodexSyncError(f"个人目录压缩包包含非法路径: {member.name}")
        for member in members:
            tf.extract(member, target)
            count += 1
    return count


def _tar_personal(source: Path, target: Path) -> Dict[str, Any]:
    target.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp_name = tempfile.mkstemp(prefix=f".{target.name}.", suffix=".part", dir=str(target.parent))
    os.close(fd)
    file_count = 0
    try:
        with tarfile.open(tmp_name, "w:gz", dereference=False) as tf:
            if source.exists():
                def count_member(member: tarfile.TarInfo) -> tarfile.TarInfo:
                    nonlocal file_count
                    if member.isfile() or member.issym() or member.islnk():
                        file_count += 1
                    return member

                tf.add(str(source), arcname=".", recursive=True, filter=count_member)
        digest, size = _sha256_file(Path(tmp_name))
        os.replace(tmp_name, target)
    finally:
        try:
            os.unlink(tmp_name)
        except FileNotFoundError:
            pass
    return {"sha256": digest, "archive_bytes": size, "files": file_count}


def _table_row_by_id(rows: List[Dict[str, Any]], key: str = "id") -> Dict[str, Dict[str, Any]]:
    return {str(row[key]): row for row in rows if row.get(key) is not None}


def _load_existing_manifest(repo: Path) -> Dict[str, Any]:
    return _json_load(repo / "sidebar" / "manifest.json", {}) or {}


SNAPSHOT_DIRS = ("sidebar", "context", "artifacts", "personal")


def _seed_previous_raw(repo: Path, previous_manifest: Dict[str, Any], target: Path) -> None:
    """Seed a staging tree with hardlinks to reusable raw archive parts."""
    source = repo / "sidebar" / "threads"
    target.mkdir(parents=True, exist_ok=True)
    for entry in previous_manifest.get("threads", []):
        names = [Path(str(item)).name for item in entry.get("archive_parts", [])]
        if not names and entry.get("archive_path"):
            names = [Path(str(entry["archive_path"])).name]
        for name in names:
            old = source / name
            new = target / name
            if not old.is_file() or new.exists():
                continue
            try:
                os.link(old, new)
            except OSError:
                shutil.copy2(old, new)


def _seed_previous_history(repo: Path, previous_manifest: Dict[str, Any], target: Path) -> bool:
    """Reuse normalized history parts when the source history DB is unchanged."""
    history = previous_manifest.get("history") or {}
    if not history:
        return False
    source_root = repo / "sidebar"
    target.mkdir(parents=True, exist_ok=True)
    copied = 0
    for info in history.values():
        parts = info.get("parts", []) if isinstance(info, dict) else []
        if not parts and isinstance(info, dict) and info.get("path"):
            parts = [info["path"]]
        for part in parts:
            relative = Path(str(part))
            if relative.is_absolute() or ".." in relative.parts:
                return False
            old = source_root / relative
            new = target / relative.name
            if not old.is_file():
                return False
            try:
                os.link(old, new)
            except OSError:
                shutil.copy2(old, new)
            copied += 1
    return copied > 0


def _promote_snapshot(repo: Path, staging_root: Path) -> None:
    """Atomically swap generated top-level trees, with rollback on failure."""
    backup_root = Path(tempfile.mkdtemp(prefix=".codex-old-", dir=str(repo)))
    moved_old: List[str] = []
    moved_new: List[str] = []
    try:
        for name in SNAPSHOT_DIRS:
            old = repo / name
            backup = backup_root / name
            staged = staging_root / name
            if old.exists() or old.is_symlink():
                old.rename(backup)
                moved_old.append(name)
            if not staged.exists():
                raise CodexSyncError(f"快照缺少输出目录: {name}")
            staged.rename(repo / name)
            moved_new.append(name)
    except Exception:
        for name in reversed(moved_new):
            current = repo / name
            if current.exists() or current.is_symlink():
                current.rename(staging_root / name)
        for name in reversed(moved_old):
            backup = backup_root / name
            if backup.exists() or backup.is_symlink():
                backup.rename(repo / name)
        raise
    else:
        shutil.rmtree(backup_root, ignore_errors=True)


def _source_db_metadata(codex_home: Path, dbs: Dict[str, Any]) -> Dict[str, Any]:
    out: Dict[str, Any] = {"codex_home": str(codex_home), "discovered": dbs}
    for kind in ("state", "history"):
        path = dbs.get(kind)
        if path and Path(path).exists():
            stat = Path(path).stat()
            out[kind] = {"path": path, "size": stat.st_size, "mtime_ns": stat.st_mtime_ns}
    return out


def _copy_state_tables(state_conn: sqlite3.Connection) -> Dict[str, Any]:
    tables = _table_names(state_conn)
    wanted = (
        "projects",
        "project_roots",
        "thread_sections",
        "threads",
        "thread_dynamic_tools",
        "thread_artifacts",
        "thread_spawn_edges",
    )
    result: Dict[str, Any] = {}
    for table in wanted:
        if table in tables:
            result[table] = _read_rows(state_conn, table)
    return result


def _project_catalog(state_tables: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Build the sidebar project catalog, including roots used by older threads."""
    roots_by_project: Dict[str, List[Dict[str, Any]]] = {}
    for root in state_tables.get("project_roots", []):
        project_id = str(root.get("project_id") or "")
        path = str(root.get("path") or "")
        if project_id and path:
            roots_by_project.setdefault(project_id, []).append({
                "path": path,
                "position": root.get("position"),
            })
    catalog: List[Dict[str, Any]] = []
    for row in state_tables.get("projects", []):
        project_id = str(row.get("id") or "")
        if not project_id:
            continue
        catalog.append({
            "project_id": project_id,
            "name": row.get("name") or project_id,
            "position": row.get("position"),
            "metadata": row.get("metadata"),
            "roots": roots_by_project.get(project_id, []),
        })
    catalog.sort(key=lambda item: (
        int(item.get("position")) if isinstance(item.get("position"), (int, float)) else 10**9,
        str(item.get("name") or ""),
    ))
    return catalog


def _assign_project_metadata(entries: List[Dict[str, Any]], catalog: List[Dict[str, Any]]) -> None:
    """Recover project membership when threads store only their working directory.

    Current Codex versions can keep project_id NULL on old threads. The desktop
    sidebar still places those threads under a project by matching cwd to the
    project's root path, with the most specific root winning.
    """
    by_id = {str(item.get("project_id")): item for item in catalog}
    roots: List[Tuple[str, str, Dict[str, Any]]] = []
    for item in catalog:
        for root in item.get("roots", []):
            path = os.path.normpath(str(root.get("path") or ""))
            if path:
                roots.append((path, str(item.get("project_id")), item))
    roots.sort(key=lambda value: len(value[0]), reverse=True)
    for entry in entries:
        project_id = str(entry.get("project_id") or "")
        project = by_id.get(project_id)
        source = "thread_project_id" if project else None
        if project is None:
            cwd = os.path.normpath(str(entry.get("cwd") or ""))
            for root_path, _, candidate in roots:
                if cwd == root_path or cwd.startswith(root_path.rstrip(os.sep) + os.sep):
                    project = candidate
                    source = "cwd_project_root"
                    break
        if project is None:
            continue
        entry["project_id"] = project.get("project_id")
        entry["project_name"] = project.get("name")
        entry["project_position"] = project.get("position")
        entry["project_roots"] = [root.get("path") for root in project.get("roots", [])]
        entry["project_source"] = source


def _export_history_tables(history_conn: sqlite3.Connection, target_dir: Path) -> Dict[str, Any]:
    target_dir.mkdir(parents=True, exist_ok=True)
    tables = _table_names(history_conn)
    exported: Dict[str, Any] = {}
    for table in ("thread_turns", "thread_items", "thread_realtime_items", "thread_history_projection_state"):
        if table not in tables:
            continue
        target_base = target_dir / table

        def lines(table_name: str = table) -> Iterator[bytes]:
            cursor = history_conn.execute(f'select * from "{table_name}"')
            columns = [col[0] for col in cursor.description]
            for row in cursor:
                data = dict(zip(columns, row))
                yield (json.dumps(data, ensure_ascii=False, default=_json_default) + "\n").encode("utf-8")

        info = _gzip_write_lines(lines(), target_base)
        exported[table] = dict(
            info,
            parts=[str((target_dir / name).relative_to(target_dir.parent)) for name in info.get("archive_parts", [])],
        )
    return exported


def _sidebar_host_key(codex_home: Path) -> str:
    """The desktop app scopes its migrated sidebar state per Codex install."""
    return "local:" + str(Path(codex_home).expanduser())


def _scoped_payload(container: Any, host_key: str) -> Any:
    """Read a per-install payload that may or may not be wrapped by host key."""
    if not isinstance(container, dict):
        return None
    if host_key in container:
        return container[host_key]
    for key, value in container.items():
        if str(key).startswith("local:"):
            continue
        if isinstance(value, (dict, list)):
            return value
    return None


def _sidebar_layout(codex_home: Path, state_tables: Dict[str, Any]) -> Dict[str, Any]:
    """Collect the desktop sidebar layout, which current Codex keeps outside SQLite.

    Pinned order, project folders and the legacy-project -> app-server-project
    mapping live in the app state file.  The snapshot has to carry that file so
    the home machine can rebuild both the web mirror and the native sidebar.
    """
    codex_home = Path(codex_home).expanduser()
    layout: Dict[str, Any] = {
        "version": MANIFEST_VERSION,
        "available": False,
        "assignments_present": False,
        "source_codex_home": str(codex_home),
        "source_user_home": str(codex_home.parent),
        "host_key": _sidebar_host_key(codex_home),
        "projects": [],
        "pinned_thread_ids": [],
        "pinned_thread_ids_by_host": [],
        "project_order": [],
        "thread_project_ids": {},
        "projectless_thread_ids": [],
        "thread_sections": [],
        "top_level": {},
        "atoms": {},
        "warnings": [],
    }
    sections: List[Dict[str, Any]] = []
    for row in state_tables.get("thread_sections", []) or []:
        section_id = str(row.get("id") or "")
        if section_id:
            sections.append({
                "id": section_id,
                "name": row.get("name") or section_id,
                "appearance": row.get("appearance"),
            })
    layout["thread_sections"] = sections

    sqlite_roots: Dict[str, List[str]] = {}
    for root in state_tables.get("project_roots", []) or []:
        path = str(root.get("path") or "")
        if path:
            sqlite_roots.setdefault(str(root.get("project_id") or ""), []).append(path)
    sqlite_projects: List[Dict[str, Any]] = []
    for row in state_tables.get("projects", []) or []:
        project_id = str(row.get("id") or "")
        if not project_id:
            continue
        sqlite_projects.append({
            "legacy_project_id": None,
            "app_server_project_id": project_id,
            "name": row.get("name") or project_id,
            "position": row.get("position"),
            "root_paths": list(sqlite_roots.get(project_id, [])),
            "created_at_ms": row.get("created_at_ms"),
            "updated_at_ms": row.get("updated_at_ms"),
            "source": "sqlite",
        })
    sqlite_by_app = {item["app_server_project_id"]: item for item in sqlite_projects}

    data = _json_load(codex_home / GLOBAL_STATE_NAME, None)
    if not isinstance(data, dict):
        layout["projects"] = sqlite_projects
        layout["warnings"].append("未找到桌面端状态文件，项目分组回退到数据库")
        return layout

    atoms_raw = data.get("electron-persisted-atom-state")
    atoms = atoms_raw if isinstance(atoms_raw, dict) else {}
    host_key = str(layout["host_key"])

    def scoped(key: str) -> Any:
        for container in (data.get(key), atoms.get(key)):
            payload = _scoped_payload(container, host_key)
            if payload is not None:
                return payload
        return None

    app_server_map = scoped("app-server-project-id-by-legacy-project-id-by-host")
    if not isinstance(app_server_map, dict):
        app_server_map = {}
    app_server_map = {str(key): str(value) for key, value in app_server_map.items() if value}

    local_projects_raw = data.get("local-projects")
    local_projects = local_projects_raw if isinstance(local_projects_raw, dict) else {}
    raw_order = data.get("project-order")
    project_order = [str(item) for item in raw_order] if isinstance(raw_order, list) else []
    ordered_legacy = [item for item in project_order if item in local_projects]
    ordered_legacy += [item for item in sorted(local_projects) if item not in ordered_legacy]

    projects: List[Dict[str, Any]] = []
    seen_app: set = set()
    for position, legacy_id in enumerate(ordered_legacy):
        info = local_projects.get(legacy_id)
        if not isinstance(info, dict):
            info = {}
        app_id = app_server_map.get(legacy_id)
        if app_id:
            seen_app.add(app_id)
        root_paths = [str(item) for item in (info.get("rootPaths") or [])]
        fallback = sqlite_by_app.get(app_id) if app_id else None
        if fallback is not None and not root_paths:
            root_paths = list(fallback.get("root_paths") or [])
        projects.append({
            "legacy_project_id": legacy_id,
            "app_server_project_id": app_id,
            "name": info.get("name") or legacy_id,
            "position": position,
            "root_paths": root_paths,
            "created_at_ms": info.get("createdAt"),
            "updated_at_ms": info.get("updatedAt"),
            "source": "sidebar_state",
        })
    for project in sqlite_projects:
        if project["app_server_project_id"] in seen_app:
            continue
        entry = dict(project)
        entry["position"] = len(projects)
        projects.append(entry)

    assignments_raw = data.get("thread-project-assignments")
    thread_project_ids: Dict[str, Any] = {}
    if isinstance(assignments_raw, dict):
        for thread_id, info in assignments_raw.items():
            if not isinstance(info, dict):
                continue
            legacy_id = str(info.get("projectId") or "")
            thread_project_ids[str(thread_id)] = {
                "kind": str(info.get("projectKind") or ""),
                "legacy_project_id": legacy_id,
                "app_server_project_id": app_server_map.get(legacy_id),
            }

    atom_order = atoms.get("app-server-pinned-thread-order-v1")
    legacy_pinned = data.get("pinned-thread-ids")
    pinned: List[str] = []
    if isinstance(atom_order, list):
        pinned = [str(item) for item in atom_order if isinstance(item, str)]
    if not pinned and isinstance(legacy_pinned, list):
        pinned = [str(item) for item in legacy_pinned if isinstance(item, str)]
    pinned_by_host = scoped("app-server-migrated-pinned-thread-ids-by-host")
    if not isinstance(pinned_by_host, list):
        pinned_by_host = []
    projectless = data.get("projectless-thread-ids")
    if not isinstance(projectless, list):
        projectless = []

    top_level: Dict[str, Any] = {}
    for key in SIDEBAR_TOP_KEYS:
        if key in data:
            top_level[key] = data[key]
    atom_subset: Dict[str, Any] = {}
    for key, value in atoms.items():
        if key in SIDEBAR_ATOM_KEYS or str(key).startswith(SIDEBAR_ATOM_PREFIXES):
            atom_subset[key] = value

    layout.update({
        "available": True,
        "assignments_present": isinstance(assignments_raw, dict),
        "projects": projects,
        "pinned_thread_ids": pinned,
        "pinned_thread_ids_by_host": [str(item) for item in pinned_by_host],
        "project_order": ordered_legacy,
        "thread_project_ids": thread_project_ids,
        "projectless_thread_ids": [str(item) for item in projectless],
        "top_level": top_level,
        "atoms": atom_subset,
    })
    unresolved = {
        str(item.get("legacy_project_id"))
        for item in projects
        if not item.get("app_server_project_id")
    }
    stale = sorted({
        str(value.get("legacy_project_id"))
        for value in thread_project_ids.values()
        if str(value.get("legacy_project_id")) and str(value.get("legacy_project_id")) not in {str(item.get("legacy_project_id")) for item in projects}
    })
    if stale:
        layout["warnings"].append(f"{len(stale)} 个任务指向已删除的项目，已归入未归类任务")
    del unresolved
    return layout


def _decorate_sidebar_entries(
    entries: List[Dict[str, Any]],
    catalog: List[Dict[str, Any]],
    layout: Dict[str, Any],
) -> None:
    """Apply the authoritative sidebar layout to the mirrored thread entries."""
    if not isinstance(layout, dict) or not layout.get("available"):
        return
    project_by_legacy: Dict[str, Dict[str, Any]] = {}
    project_by_app: Dict[str, Dict[str, Any]] = {}
    for project in layout.get("projects") or []:
        legacy_id = project.get("legacy_project_id")
        app_id = project.get("app_server_project_id")
        if legacy_id:
            project_by_legacy[str(legacy_id)] = project
        if app_id:
            project_by_app[str(app_id)] = project
    pinned_order: Dict[str, int] = {}
    for index, thread_id in enumerate(layout.get("pinned_thread_ids") or []):
        pinned_order.setdefault(str(thread_id), index)
    assignments = layout.get("thread_project_ids") or {}
    authoritative = bool(layout.get("assignments_present"))
    for entry in entries:
        thread_id = str(entry.get("thread_id"))
        index = pinned_order.get(thread_id)
        entry["pinned"] = index is not None
        entry["is_pinned"] = index is not None
        if index is not None:
            entry["pinned_order"] = index
        assignment = assignments.get(thread_id)
        if not isinstance(assignment, dict):
            entry["sidebar_project_legacy_id"] = None
            entry["sidebar_project_matched"] = False
            if authoritative:
                entry["project_id"] = None
                entry["project_name"] = None
                entry["project_position"] = None
                entry["project_roots"] = []
                entry["project_source"] = "sidebar_unassigned"
            continue
        legacy_id = str(assignment.get("legacy_project_id") or "")
        project = project_by_legacy.get(legacy_id)
        if project is None and assignment.get("app_server_project_id"):
            project = project_by_app.get(str(assignment["app_server_project_id"]))
        entry["sidebar_project_legacy_id"] = legacy_id or None
        if project is None:
            entry["sidebar_project_matched"] = False
            if authoritative:
                entry["project_id"] = None
                entry["project_name"] = None
                entry["project_position"] = None
                entry["project_roots"] = []
                entry["project_source"] = "sidebar_project_removed"
            continue
        entry["sidebar_project_matched"] = True
        entry["project_id"] = project.get("app_server_project_id") or project.get("legacy_project_id")
        entry["project_name"] = project.get("name")
        entry["project_position"] = project.get("position")
        entry["project_roots"] = list(project.get("root_paths") or [])
        entry["project_source"] = "sidebar_assignment"


def _remap_text_paths(value: Any, replacements: Sequence[Tuple[str, str]]) -> Any:
    """Rewrite the source machine absolute paths onto the target machine."""
    if isinstance(value, str):
        for old, new in replacements:
            if old and new and old != new and value.startswith(old):
                return new + value[len(old):]
        return value
    if isinstance(value, list):
        return [_remap_text_paths(item, replacements) for item in value]
    if isinstance(value, dict):
        return {key: _remap_text_paths(item, replacements) for key, item in value.items()}
    return value


def _native_global_state_target(codex_home: Path, layout: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Build the merged desktop state file that restores pinned order and projects."""
    if not isinstance(layout, dict) or not layout.get("available"):
        return None
    top_level = layout.get("top_level") or {}
    atoms = layout.get("atoms") or {}
    if not top_level and not atoms:
        return None
    target_home = Path(codex_home).expanduser()
    replacements: List[Tuple[str, str]] = []
    source_home = str(layout.get("source_codex_home") or "")
    source_user = str(layout.get("source_user_home") or "")
    target_user = str(Path.home())
    if source_home and source_home != str(target_home):
        replacements.append((source_home, str(target_home)))
    if source_user and source_user != target_user:
        replacements.append((source_user, target_user))
    source_host = str(layout.get("host_key") or "")
    target_host = _sidebar_host_key(target_home)
    path = target_home / GLOBAL_STATE_NAME
    current = _json_load(path, None)
    state = dict(current) if isinstance(current, dict) else {}
    existing_atoms = state.get("electron-persisted-atom-state")
    state_atoms = dict(existing_atoms) if isinstance(existing_atoms, dict) else {}
    restored_top = 0
    restored_atoms = 0
    for key, value in top_level.items():
        if key in HOST_SCOPED_KEYS:
            payload = value.get(source_host) if isinstance(value, dict) else None
            if payload is None:
                continue
            payload = _remap_text_paths(payload, replacements)
            existing = state.get(key)
            target_map = dict(existing) if isinstance(existing, dict) else {}
            target_map[target_host] = payload
            state[key] = target_map
            restored_top += 1
            continue
        state[key] = _remap_text_paths(value, replacements)
        restored_top += 1
    for key, value in atoms.items():
        state_atoms[key] = _remap_text_paths(value, replacements)
        restored_atoms += 1
    if state_atoms:
        state["electron-persisted-atom-state"] = state_atoms
    if not restored_top and not restored_atoms:
        return None
    return {
        "path": path,
        "state": state,
        "restored_top_level": restored_top,
        "restored_atoms": restored_atoms,
    }


    target_dir.mkdir(parents=True, exist_ok=True)
    tables = _table_names(history_conn)
    exported: Dict[str, Any] = {}
    for table in ("thread_turns", "thread_items", "thread_realtime_items", "thread_history_projection_state"):
        if table not in tables:
            continue
        target_base = target_dir / table

        def lines(table_name: str = table) -> Iterator[bytes]:
            cursor = history_conn.execute(f'select * from "{table_name}"')
            columns = [col[0] for col in cursor.description]
            for row in cursor:
                data = dict(zip(columns, row))
                yield (json.dumps(data, ensure_ascii=False, default=_json_default) + "\n").encode("utf-8")

        info = _gzip_write_lines(lines(), target_base)
        exported[table] = dict(
            info,
            parts=[str((target_dir / name).relative_to(target_dir.parent)) for name in info.get("archive_parts", [])],
        )
    return exported


def _thread_source_entry(
    row: Dict[str, Any],
    codex_home: Path,
    raw_target: Path,
    history_conn: Optional[sqlite3.Connection],
    previous: Optional[Dict[str, Any]],
) -> Dict[str, Any]:
    thread_id = str(row.get("id") or "")
    rollout_path = str(row.get("rollout_path") or "")
    relative = _relative_rollout_path(rollout_path, codex_home)
    source_path = (codex_home / relative) if relative else None
    if source_path and source_path.is_file():
        stat = source_path.stat()
        target_base = raw_target / thread_id
        previous_parts = [Path(p).name for p in (previous or {}).get("archive_parts", [])]
        if not previous_parts and previous and previous.get("archive_path"):
            previous_parts = [Path(str(previous["archive_path"])).name]
        if (
            previous
            and previous.get("source_relpath") == relative
            and previous.get("source_size") == stat.st_size
            and previous.get("source_mtime_ns") == stat.st_mtime_ns
            and previous_parts
            and all((raw_target / name).is_file() for name in previous_parts)
        ):
            info = {
                "source_sha256": previous.get("source_sha256"),
                "source_bytes": previous.get("source_bytes", stat.st_size),
                "archive_bytes": sum((raw_target / name).stat().st_size for name in previous_parts),
                "archive_parts": previous_parts,
                "search_text": previous.get("search_text", ""),
                "reused": True,
            }
        else:
            info = _gzip_copy_jsonl(source_path, target_base)
            info["reused"] = False
        archive_parts = [Path(name).name for name in info.get("archive_parts", [])]
        archive_rel = f"sidebar/threads/{archive_parts[0]}" if archive_parts else None
        after = source_path.stat()
        stable = after.st_size == stat.st_size and after.st_mtime_ns == stat.st_mtime_ns
        status = "ok" if stable else "unstable"
        return {
            "thread_id": thread_id,
            "title": row.get("title") or row.get("name") or "",
            "created_at": row.get("created_at"),
            "updated_at": row.get("updated_at"),
            "created_at_ms": row.get("created_at_ms"),
            "updated_at_ms": row.get("updated_at_ms"),
            "recency_at": row.get("recency_at"),
            "recency_at_ms": row.get("recency_at_ms"),
            "archived": bool(row.get("archived", 0)),
            "is_pinned": bool(row.get("is_pinned", 0)),
            "thread_section_id": row.get("thread_section_id"),
            "section_position": row.get("section_position"),
            "project_id": row.get("project_id"),
            "cwd": row.get("cwd"),
            "model": row.get("model"),
            "model_provider": row.get("model_provider"),
            "reasoning_effort": row.get("reasoning_effort"),
            "cli_version": row.get("cli_version"),
            "source_rollout_path": rollout_path,
            "source_relpath": relative,
            "archive_path": archive_rel,
            "archive_parts": archive_parts,
            "coverage": status,
            "source_size": stat.st_size,
            "source_mtime_ns": stat.st_mtime_ns,
            "source_sha256": info.get("source_sha256"),
            "source_bytes": info.get("source_bytes", stat.st_size),
            "archive_bytes": info.get("archive_bytes"),
            "search_text": info.get("search_text", ""),
            "reused": info.get("reused", False),
        }

    # A missing rollout is reconstructed from normalized history when possible.
    target_base = raw_target / thread_id
    if history_conn is not None:
        info = _gzip_write_lines(_reconstructed_lines(history_conn, thread_id), target_base, collect_search=True)
        coverage = "reconstructed"
    else:
        info = _gzip_write_lines(
            [(json.dumps({"type": "missing_rollout", "thread_id": thread_id}, ensure_ascii=False) + "\n").encode("utf-8")],
            target_base,
        )
        coverage = "missing"
    archive_parts = [Path(name).name for name in info.get("archive_parts", [])]
    archive_rel = f"sidebar/threads/{archive_parts[0]}" if archive_parts else None
    return {
        "thread_id": thread_id,
        "title": row.get("title") or row.get("name") or "",
        "created_at": row.get("created_at"),
        "updated_at": row.get("updated_at"),
        "created_at_ms": row.get("created_at_ms"),
        "updated_at_ms": row.get("updated_at_ms"),
        "recency_at": row.get("recency_at"),
        "recency_at_ms": row.get("recency_at_ms"),
        "archived": bool(row.get("archived", 0)),
        "is_pinned": bool(row.get("is_pinned", 0)),
        "thread_section_id": row.get("thread_section_id"),
        "section_position": row.get("section_position"),
        "project_id": row.get("project_id"),
        "cwd": row.get("cwd"),
        "model": row.get("model"),
        "model_provider": row.get("model_provider"),
        "reasoning_effort": row.get("reasoning_effort"),
        "cli_version": row.get("cli_version"),
        "source_rollout_path": rollout_path,
        "source_relpath": None,
        "native_relpath": f"sessions/reconstructed/{thread_id}.jsonl",
        "archive_path": archive_rel,
        "archive_parts": archive_parts,
        "coverage": coverage,
        "source_size": 0,
        "source_mtime_ns": 0,
        "source_sha256": info.get("source_sha256"),
        "source_bytes": info.get("source_bytes", 0),
        "archive_bytes": info.get("archive_bytes"),
        "search_text": info.get("search_text", ""),
        "reused": False,
    }


def _sort_sidebar(entries: List[Dict[str, Any]]) -> None:
    def key(entry: Dict[str, Any]) -> Tuple[int, int, int, str]:
        pinned_order = entry.get("pinned_order")
        if isinstance(pinned_order, int):
            return 0, pinned_order, 0, str(entry.get("thread_id"))
        pinned = 0 if entry.get("is_pinned") else 1
        section_pos = entry.get("section_position")
        section_value = int(section_pos) if isinstance(section_pos, (int, float)) else 10**9
        recency = entry.get("recency_at_ms") or entry.get("updated_at_ms") or entry.get("updated_at") or 0
        try:
            recency_value = -int(recency)
        except (TypeError, ValueError):
            recency_value = 0
        return pinned, section_value, recency_value, str(entry.get("thread_id"))

    entries.sort(key=key)
    for index, entry in enumerate(entries):
        entry["sidebar_position"] = index


def _personal_sensitive_paths(personal: Path) -> List[str]:
    warnings: List[str] = []
    if not personal.exists():
        return warnings
    for root, dirs, files in os.walk(personal, topdown=True, followlinks=False):
        rel_root = Path(root).relative_to(personal)
        for name in list(dirs) + list(files):
            if SECRET_NAME_RE.search(name) or name.lower().endswith((".pem", ".key", ".p12", ".pfx")):
                warnings.append(str(rel_root / name))
    return warnings[:200]


def export_snapshot(
    repo: Path = SYNC_REPO_DEFAULT,
    codex_home: Path = CODEX_HOME_DEFAULT,
    personal_dir: Path = PERSONAL_DIR_DEFAULT,
    include_history: bool = True,
) -> Dict[str, Any]:
    """Export a portable snapshot into repo and return coverage statistics."""
    repo = Path(repo).expanduser()
    codex_home = Path(codex_home).expanduser()
    personal_dir = Path(personal_dir).expanduser()
    dbs = discover_databases(codex_home)
    if not dbs.get("state"):
        raise CodexSyncError(f"找不到 Codex state 数据库: {codex_home}")

    repo.mkdir(parents=True, exist_ok=True)
    staging_root = Path(tempfile.mkdtemp(prefix=".codex-export-", dir=str(repo)))
    sidebar_dir = staging_root / "sidebar"
    raw_dir = sidebar_dir / "threads"
    context_dir = staging_root / "context"
    artifacts_dir = staging_root / "artifacts"
    sidebar_dir.mkdir(parents=True, exist_ok=True)
    raw_dir.mkdir(parents=True, exist_ok=True)
    context_dir.mkdir(parents=True, exist_ok=True)
    artifacts_dir.mkdir(parents=True, exist_ok=True)

    previous_manifest = _load_existing_manifest(repo)
    previous_by_id = _table_row_by_id(previous_manifest.get("threads", []), "thread_id")
    _seed_previous_raw(repo, previous_manifest, raw_dir)
    state_conn: Optional[sqlite3.Connection] = None
    history_conn: Optional[sqlite3.Connection] = None
    try:
        state_conn = _sqlite_ro(Path(dbs["state"]))
        state_tables = _copy_state_tables(state_conn)
        thread_rows = state_tables.get("threads", [])
        state_schema = _schema_signature(state_conn, ("threads", "projects", "thread_sections"))
        if dbs.get("history"):
            try:
                history_conn = _sqlite_ro(Path(dbs["history"]))
            except sqlite3.DatabaseError:
                history_conn = None
        history_schema = _schema_signature(history_conn, ("thread_turns", "thread_items")) if history_conn else None

        entries: List[Dict[str, Any]] = []
        for row in thread_rows:
            entry = _thread_source_entry(row, codex_home, raw_dir, history_conn, previous_by_id.get(str(row.get("id"))))
            entries.append(entry)
        project_catalog = _project_catalog(state_tables)
        _assign_project_metadata(entries, project_catalog)
        # The desktop sidebar keeps pinned order and project folders outside the
        # databases, so the snapshot carries that layout separately.
        sidebar_layout = _sidebar_layout(codex_home, state_tables)
        _decorate_sidebar_entries(entries, project_catalog, sidebar_layout)
        projects_by_id = _table_row_by_id(state_tables.get("projects", []))
        sections_by_id = _table_row_by_id(state_tables.get("thread_sections", []))
        for entry in entries:
            project = projects_by_id.get(str(entry.get("project_id")))
            section = sections_by_id.get(str(entry.get("thread_section_id")))
            if project:
                entry["project_name"] = project.get("name") or project.get("title") or entry.get("project_id")
                entry["project_position"] = project.get("position")
            if section:
                entry["section_name"] = section.get("name") or entry.get("thread_section_id")
        _sort_sidebar(entries)

        state_payload = {
            "exported_at": _now(),
            "source": _source_db_metadata(codex_home, dbs),
            "schema": {"state": state_schema, "history": history_schema},
            "tables": state_tables,
        }
        _write_json_atomic(sidebar_dir / "state.json", state_payload)
        _write_json_atomic(sidebar_dir / "global_state.json", sidebar_layout)

        history_export: Dict[str, Any] = {}
        if include_history and history_conn is not None:
            current_history = (state_payload.get("source") or {}).get("history") or {}
            previous_history = (previous_manifest.get("source") or {}).get("history") or {}
            can_reuse_history = bool(
                current_history
                and previous_history
                and current_history.get("size") == previous_history.get("size")
                and current_history.get("mtime_ns") == previous_history.get("mtime_ns")
                and _seed_previous_history(repo, previous_manifest, sidebar_dir / "history")
            )
            if can_reuse_history:
                history_export = previous_manifest.get("history", {})
            else:
                history_dir = sidebar_dir / "history"
                if history_dir.exists():
                    shutil.rmtree(history_dir)
                history_export = _export_history_tables(history_conn, history_dir)

        index_entries = []
        for entry in entries:
            index_entry = dict(entry)
            index_entry.pop("source_rollout_path", None)
            index_entry.pop("search_text", None)
            index_entry["search_text"] = entry.get("search_text", "")
            index_entries.append(index_entry)
        index_payload = {"version": MANIFEST_VERSION, "generated_at": _now(), "entries": index_entries}
        _write_json_atomic(sidebar_dir / "index.json", index_payload)

        # Context/artifact directories are generated mirrors.  Rebuild them so
        # deleted local files do not remain in the next snapshot.
        for generated_dir in (context_dir, artifacts_dir):
            if generated_dir.exists():
                shutil.rmtree(generated_dir)
            generated_dir.mkdir(parents=True, exist_ok=True)

        current_thread_files = {
            part
            for entry in entries
            for part in entry.get("archive_parts", [])
        }
        for old_file in raw_dir.glob("*.jsonl.gz"):
            if old_file.name not in current_thread_files:
                old_file.unlink()

        context_stats: Dict[str, Any] = {}
        for source_rel, dest_rel, _ in CONTEXT_DIRS:
            context_stats[dest_rel] = _copy_tree_filtered(codex_home / source_rel, context_dir / dest_rel)
        artifact_stats: Dict[str, Any] = {}
        for source_rel, dest_rel in ARTIFACT_DIRS:
            artifact_stats[dest_rel] = _copy_tree_filtered(codex_home / source_rel, artifacts_dir / dest_rel)

        personal_archive = _tar_personal(personal_dir, staging_root / "personal" / "personal.tar.gz")
        sensitive = _personal_sensitive_paths(personal_dir)
        context_file_count = sum(int(value.get("files", 0)) for value in context_stats.values())
        artifact_file_count = sum(int(value.get("files", 0)) for value in artifact_stats.values())
        raw_archive_file_count = sum(len(entry.get("archive_parts", [])) for entry in entries)
        snapshot_file_count = raw_archive_file_count + context_file_count + artifact_file_count + int(personal_archive.get("files", 0))
        snapshot_bytes = sum(int(value.get("bytes", 0)) for value in context_stats.values())
        snapshot_bytes += sum(int(value.get("bytes", 0)) for value in artifact_stats.values())
        snapshot_bytes += sum(int(entry.get("archive_bytes", 0) or 0) for entry in entries)
        snapshot_bytes += int(personal_archive.get("archive_bytes", 0) or 0)
        missing_paths = [entry.get("source_rollout_path") or entry.get("thread_id") for entry in entries if entry.get("coverage") == "missing"]
        unstable_paths = [entry.get("source_rollout_path") or entry.get("thread_id") for entry in entries if entry.get("coverage") == "unstable"]
        manifest = {
            "version": MANIFEST_VERSION,
            "exported_at": _now(),
            "source": _source_db_metadata(codex_home, dbs),
            "schema": {"state": state_schema, "history": history_schema},
            "thread_count": len(entries),
            "raw_ok_count": sum(1 for e in entries if e.get("coverage") == "ok"),
            "reconstructed_count": sum(1 for e in entries if e.get("coverage") == "reconstructed"),
            "missing_count": sum(1 for e in entries if e.get("coverage") == "missing"),
            "unstable_count": sum(1 for e in entries if e.get("coverage") == "unstable"),
            "raw_source_bytes": sum(int(e.get("source_bytes") or 0) for e in entries),
            "raw_archive_bytes": sum(int(e.get("archive_bytes") or 0) for e in entries),
            "snapshot_file_count": snapshot_file_count,
            "snapshot_bytes": snapshot_bytes,
            "missing_paths": missing_paths[:200],
            "unstable_paths": unstable_paths[:200],
            "threads": entries,
            "history": history_export,
            "context": context_stats,
            "artifacts": artifact_stats,
            "personal": dict(personal_archive, path="personal/personal.tar.gz", source=str(personal_dir)),
            "sensitive_paths": sensitive,
            "warnings": [
                "原始会话来自当前 Codex 快照；不会复制 live SQLite。",
                "存在 unstable 或 reconstructed 记录时，原始覆盖率需要在推送前复核。",
            ],
            "projects": project_catalog,
            "sidebar_layout": {
                "version": sidebar_layout.get("version"),
                "available": sidebar_layout.get("available"),
                "host_key": sidebar_layout.get("host_key"),
                "source_codex_home": sidebar_layout.get("source_codex_home"),
                "source_user_home": sidebar_layout.get("source_user_home"),
                "pinned_count": len(sidebar_layout.get("pinned_thread_ids") or []),
                "project_count": len(sidebar_layout.get("projects") or []),
                "assignment_count": len(sidebar_layout.get("thread_project_ids") or {}),
                "projects": sidebar_layout.get("projects"),
                "warnings": sidebar_layout.get("warnings"),
            },
        }
        _write_json_atomic(sidebar_dir / "manifest.json", manifest)
        _promote_snapshot(repo, staging_root)
        return snapshot_status(repo, codex_home, personal_dir)
    finally:
        if state_conn is not None:
            state_conn.close()
        if history_conn is not None:
            history_conn.close()
        shutil.rmtree(staging_root, ignore_errors=True)


def _load_manifest(repo: Path) -> Dict[str, Any]:
    manifest = _json_load(Path(repo) / "sidebar" / "manifest.json")
    if not isinstance(manifest, dict) or not manifest.get("threads"):
        raise CodexSyncError("还没有 Codex 快照，请先导出")
    return manifest


def _git(repo: Path, args: Sequence[str], timeout: int = 600) -> subprocess.CompletedProcess:
    return subprocess.run(["git"] + list(args), cwd=str(repo), capture_output=True, text=True, timeout=timeout)


def _git_remote(repo: Path) -> bool:
    if not (repo / ".git").exists():
        return False
    result = _git(repo, ["remote"], timeout=10)
    return result.returncode == 0 and bool(result.stdout.strip())


def git_push(repo: Path = SYNC_REPO_DEFAULT) -> Dict[str, Any]:
    repo = Path(repo).expanduser()
    if not (repo / ".git").exists():
        return {"status": "fail", "message": f"Codex 同步仓库未初始化: {repo}"}
    # GitHub rejects a single push over 2 GiB.  The first snapshot can be
    # several GiB, so use the local batch helper whenever it is available.
    batch_helper = Path(__file__).with_name("codex_split_push.py")
    if batch_helper.is_file():
        try:
            result = subprocess.run(
                [sys.executable, str(batch_helper), str(repo)],
                cwd=str(repo),
                capture_output=True,
                text=True,
                timeout=4 * 60 * 60,
            )
        except subprocess.TimeoutExpired:
            return {"status": "fail", "message": "分批推送超过 4 小时，已停止等待；本地提交仍保留"}
        if result.returncode != 0:
            return {"status": "fail", "message": (result.stderr or result.stdout)[-1200:]}
        return {"status": "ok", "message": "已按 GitHub 限制分批推送 Codex 快照", "detail": result.stdout[-1200:]}
    add = _git(repo, ["add", "-A"], timeout=600)
    if add.returncode != 0:
        return {"status": "fail", "message": add.stderr[-500:]}
    diff = _git(repo, ["diff", "--cached", "--stat"], timeout=60)
    if not diff.stdout.strip():
        return {"status": "ok", "message": "没有变更，无需推送"}
    stamp = _dt.datetime.now().strftime("%Y-%m-%d %H:%M")
    commit = _git(repo, ["commit", "-m", f"codex snapshot {stamp}"], timeout=600)
    if commit.returncode != 0:
        return {"status": "fail", "message": commit.stderr[-500:] or commit.stdout[-500:]}
    if not _git_remote(repo):
        return {"status": "warn", "message": "已本地提交，但还没有配置远端仓库"}
    branch = _git(repo, ["branch", "--show-current"], timeout=10).stdout.strip() or "main"
    push = _git(repo, ["push", "-u", "origin", branch], timeout=1800)
    if push.returncode != 0:
        return {"status": "fail", "message": (push.stderr or push.stdout)[-800:]}
    return {"status": "ok", "message": "已推送到 Codex 私有仓库", "branch": branch}


def _backup_path() -> Path:
    return Path.home() / ".codex-sync-backups" / _dt.datetime.now().strftime("%Y%m%d-%H%M%S-%f")


def _backup_path_if_exists(source: Path, backup_root: Path, label: str) -> Optional[Path]:
    if not source.exists() and not source.is_symlink():
        return None
    target = backup_root / label
    target.parent.mkdir(parents=True, exist_ok=True)
    if source.is_dir() and not source.is_symlink():
        shutil.copytree(source, target, symlinks=True)
    else:
        shutil.copy2(source, target, follow_symlinks=False)
    return target


def _restore_context(repo: Path, codex_home: Path) -> Dict[str, Any]:
    copied = 0
    for _, repo_rel, target_rel in CONTEXT_DIRS:
        source = repo / "context" / repo_rel
        target = codex_home / target_rel
        if not source.exists():
            continue
        result = _copy_tree_filtered(source, target, excluded=[])
        copied += int(result.get("files", 0))
    for _, dest_rel in ARTIFACT_DIRS:
        source = repo / "artifacts" / dest_rel
        target = codex_home / dest_rel
        if not source.exists():
            continue
        result = _copy_tree_filtered(source, target, excluded=[])
        copied += int(result.get("files", 0))
    return {"files": copied}


def _restore_personal(repo: Path, personal_dir: Path, backup_root: Path) -> Dict[str, Any]:
    archive = repo / "personal" / "personal.tar.gz"
    if not archive.exists():
        return {"files": 0, "skipped": True}
    manifest = _json_load(repo / "sidebar" / "manifest.json", {}) or {}
    expected = ((manifest.get("personal") or {}).get("sha256"))
    if expected:
        actual, _ = _sha256_file(archive)
        if actual != expected:
            raise CodexSyncError("个人目录快照校验失败，拒绝恢复")
    personal_dir.parent.mkdir(parents=True, exist_ok=True)
    staging = Path(tempfile.mkdtemp(prefix=f".{personal_dir.name}.restore-", dir=str(personal_dir.parent)))
    old_target: Optional[Path] = None
    target_existed = personal_dir.exists() or personal_dir.is_symlink()
    try:
        count = _safe_tar_extract(archive, staging)
        if target_existed:
            _backup_path_if_exists(personal_dir, backup_root, "personal")
            old_holder = Path(tempfile.mkdtemp(prefix=f".{personal_dir.name}.old-", dir=str(personal_dir.parent)))
            old_target = old_holder.parent / f"{old_holder.name}.target"
            old_holder.rmdir()
            personal_dir.rename(old_target)
        staging.rename(personal_dir)
        if old_target and (old_target.exists() or old_target.is_symlink()):
            if old_target.is_dir() and not old_target.is_symlink():
                shutil.rmtree(old_target)
            else:
                old_target.unlink()
        return {"files": count, "skipped": False}
    except Exception:
        if (old_target is not None or not target_existed) and (personal_dir.exists() or personal_dir.is_symlink()):
            if personal_dir.is_dir() and not personal_dir.is_symlink():
                shutil.rmtree(personal_dir, ignore_errors=True)
            else:
                try:
                    personal_dir.unlink()
                except FileNotFoundError:
                    pass
        if old_target and (old_target.exists() or old_target.is_symlink()):
            old_target.rename(personal_dir)
        raise
    finally:
        if staging.exists() or staging.is_symlink():
            shutil.rmtree(staging, ignore_errors=True)


def git_pull_and_restore(
    repo: Path = SYNC_REPO_DEFAULT,
    codex_home: Path = CODEX_HOME_DEFAULT,
    personal_dir: Path = PERSONAL_DIR_DEFAULT,
    restore: bool = True,
) -> Dict[str, Any]:
    repo = Path(repo).expanduser()
    if not (repo / ".git").exists():
        return {"status": "fail", "message": f"Codex 同步仓库未初始化: {repo}"}
    if not _git_remote(repo):
        return {"status": "fail", "message": "Codex 同步仓库没有配置远端"}
    pull = _git(repo, ["pull", "--ff-only"], timeout=1800)
    if pull.returncode != 0:
        return {"status": "fail", "message": (pull.stderr or pull.stdout)[-800:]}
    status: Dict[str, Any] = {"status": "ok", "message": "已拉取 Codex 快照"}
    if restore:
        manifest = _load_manifest(repo)
        backup_root = _backup_path()
        status["context"] = _restore_context(repo, codex_home)
        status["personal"] = _restore_personal(repo, personal_dir, backup_root)
        status["backup"] = str(backup_root)
        status["message"] += "，已恢复个人目录和 Codex 上下文"
        status["snapshot"] = {
            "threads": manifest.get("thread_count", 0),
            "raw_archive_bytes": manifest.get("raw_archive_bytes", 0),
        }
    return status


def _remap_value(
    value: Any,
    source_home: str,
    target_home: Path,
    source_personal: str,
    target_personal: Path,
    source_user_home: str = "",
    target_user_home: Optional[Path] = None,
) -> Any:
    if not isinstance(value, str):
        return value
    pairs = (
        (source_home, str(target_home)),
        (source_personal, str(target_personal)),
        (source_user_home, str(target_user_home or Path.home())),
    )
    for old, new in pairs:
        if old and (value == old or value.startswith(old + os.sep)):
            return new + value[len(old):]
    return value


def _insert_rows(conn: sqlite3.Connection, table: str, rows: Iterable[Dict[str, Any]], remap=None) -> int:
    try:
        columns_info = conn.execute(f'pragma table_info("{table}")').fetchall()
    except sqlite3.DatabaseError:
        return 0
    columns = [str(row[1]) for row in columns_info]
    inserted = 0
    for original in rows:
        row = dict(original)
        if remap:
            row = remap(table, row)
        values = [(row.get(col)) for col in columns if col in row]
        names = [col for col in columns if col in row]
        if not names:
            continue
        placeholders = ",".join("?" for _ in names)
        quoted = ",".join(f'"{name}"' for name in names)
        conn.execute(f'insert into "{table}" ({quoted}) values ({placeholders})', values)
        inserted += 1
    return inserted


def _materialize_raw(repo: Path, codex_home: Path, manifest: Dict[str, Any]) -> List[Path]:
    created: List[Path] = []
    for entry in manifest.get("threads", []):
        thread_id = str(entry.get("thread_id") or "")
        if not THREAD_ID_RE.match(thread_id):
            continue
        rel = entry.get("source_relpath") or entry.get("native_relpath")
        if not rel:
            continue
        target = _safe_child(codex_home, rel)
        part_names = [Path(str(item)).name for item in entry.get("archive_parts", [])]
        if not part_names and entry.get("archive_path"):
            part_names = [Path(str(entry["archive_path"])).name]
        archives = [repo / "sidebar" / "threads" / name for name in part_names]
        if not archives or not all(path.is_file() for path in archives):
            continue
        target.parent.mkdir(parents=True, exist_ok=True)
        fd, tmp_name = tempfile.mkstemp(prefix=f".{target.name}.", suffix=".part", dir=str(target.parent))
        os.close(fd)
        try:
            digest = hashlib.sha256()
            with open(tmp_name, "wb") as dest:
                for archive in archives:
                    with gzip.open(archive, "rb") as source:
                        while True:
                            chunk = source.read(1024 * 1024)
                            if not chunk:
                                break
                            digest.update(chunk)
                            dest.write(chunk)
                dest.flush()
                os.fsync(dest.fileno())
            expected = entry.get("source_sha256")
            if expected and digest.hexdigest() != expected:
                raise CodexSyncError(f"会话校验失败，拒绝写入: {thread_id}")
            if target.exists():
                raise CodexSyncError(f"目标会话文件已存在，拒绝覆盖: {target}")
            os.replace(tmp_name, target)
            created.append(target)
        finally:
            try:
                os.unlink(tmp_name)
            except FileNotFoundError:
                pass
    return created


def _clear_native_tables(database: Path, tables: Sequence[str]) -> None:
    """Clear user data while preserving the installed Codex schema/migrations."""
    conn = sqlite3.connect(str(database), timeout=30)
    try:
        conn.execute("pragma foreign_keys=off")
        conn.execute("begin")
        existing = _table_names(conn)
        for table in tables:
            if table in existing:
                conn.execute(f'delete from "{table}"')
        conn.commit()
        # Avoid leaving an old WAL beside the newly imported database.
        conn.execute("pragma journal_mode=delete")
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def _move_native_rollout_dirs(codex_home: Path, backup_root: Path) -> List[Tuple[Path, Path]]:
    """Move existing native rollout directories into the import backup."""
    moved: List[Tuple[Path, Path]] = []
    for name in NATIVE_ROLLOUT_DIRS:
        source = codex_home / name
        if not (source.exists() or source.is_symlink()):
            continue
        target = backup_root / "native-rollouts" / name
        target.parent.mkdir(parents=True, exist_ok=True)
        source.rename(target)
        source.mkdir(parents=True, exist_ok=True)
        moved.append((source, target))
    return moved


def _codex_processes() -> List[str]:
    try:
        result = subprocess.run(["ps", "-axo", "command="], capture_output=True, text=True, timeout=5)
    except (OSError, subprocess.SubprocessError):
        return []
    found = []
    for line in result.stdout.splitlines():
        lower = line.lower()
        if "codex-sync" in lower or "codex_sync" in lower or "codex_sync.py" in lower:
            continue
        if "/codex.app/" in lower or "/chatgpt.app/" in lower or re.search(r"(^|[/ ])codex(?:$|[ /])", lower):
            found.append(line.strip())
    return found[:20]


def native_import(
    repo: Path = SYNC_REPO_DEFAULT,
    codex_home: Path = CODEX_HOME_DEFAULT,
    personal_dir: Path = PERSONAL_DIR_DEFAULT,
    confirm_closed: bool = False,
    replace_existing: bool = False,
) -> Dict[str, Any]:
    """Import into a schema-compatible local Codex install with a recoverable replace."""
    repo = Path(repo).expanduser()
    codex_home = Path(codex_home).expanduser()
    personal_dir = Path(personal_dir).expanduser()
    if not confirm_closed:
        return {"status": "fail", "message": "请先退出家里的 Codex，再确认导入"}
    processes = _codex_processes()
    if processes:
        return {"status": "fail", "message": "检测到 Codex/ChatGPT 仍在运行，请退出后重试", "processes": processes}
    manifest = _load_manifest(repo)
    dbs = discover_databases(codex_home)
    if not dbs.get("state") or not dbs.get("history"):
        return {"status": "fail", "message": "家里没有找到可导入的 Codex state/history 数据库"}
    source_schema = manifest.get("schema", {})
    target_state = Path(dbs["state"])
    target_history = Path(dbs["history"])
    state_conn = _sqlite_ro(target_state)
    history_conn = _sqlite_ro(target_history)
    try:
        state_tables = _table_names(state_conn)
        history_tables = _table_names(history_conn)
        state_counts = {
            table: state_conn.execute(f'select count(*) from "{table}"').fetchone()[0]
            for table in ("projects", "project_roots", "thread_sections", "threads", "thread_dynamic_tools", "thread_artifacts", "thread_spawn_edges")
            if table in state_tables
        }
        history_counts = {
            table: history_conn.execute(f'select count(*) from "{table}"').fetchone()[0]
            for table in ("thread_turns", "thread_items", "thread_realtime_items", "thread_history_projection_state")
            if table in history_tables
        }
        state_count = sum(int(value or 0) for value in state_counts.values())
        history_count = sum(int(value or 0) for value in history_counts.values())
        target_state_schema = _schema_signature(state_conn, ("threads", "projects", "thread_sections"))
        target_history_schema = _schema_signature(history_conn, ("thread_turns", "thread_items"))
    finally:
        state_conn.close()
        history_conn.close()
    if (state_count or history_count) and not replace_existing:
        return {
            "status": "confirm",
            "needs_replace_confirmation": True,
            "message": "家里的 Codex 不是空环境；继续操作会先备份，再用公司快照替换家里侧边栏。",
            "state_counts": state_counts,
            "history_counts": history_counts,
        }
    if source_schema.get("state") and source_schema.get("state") != target_state_schema:
        return {"status": "fail", "message": "state 数据库 schema 不兼容，保留网页镜像", "source": source_schema.get("state"), "target": target_state_schema}
    if source_schema.get("history") and source_schema.get("history") != target_history_schema:
        return {"status": "fail", "message": "history 数据库 schema 不兼容，保留网页镜像", "source": source_schema.get("history"), "target": target_history_schema}

    backup_root = _backup_path()
    backup_root.mkdir(parents=True, exist_ok=True)
    backup_state = _backup_path_if_exists(target_state, backup_root, target_state.name)
    backup_history = _backup_path_if_exists(target_history, backup_root, target_history.name)
    backup_sidecars: List[Tuple[Path, Optional[Path]]] = []
    for database in (target_state, target_history):
        for suffix in ("-wal", "-shm"):
            sidecar = Path(str(database) + suffix)
            backup_sidecars.append((sidecar, _backup_path_if_exists(sidecar, backup_root, sidecar.name)))
    # Pinned order and project folders live in the desktop state file, not in
    # SQLite, so replacing the sidebar has to back it up and rewrite it too.
    global_state_path = codex_home / GLOBAL_STATE_NAME
    backup_global_state = _backup_path_if_exists(global_state_path, backup_root, GLOBAL_STATE_NAME)
    global_state_applied = False
    created_raw: List[Path] = []
    moved_rollout_dirs: List[Tuple[Path, Path]] = []
    state_write: Optional[sqlite3.Connection] = None
    history_write: Optional[sqlite3.Connection] = None
    try:
        if replace_existing:
            _clear_native_tables(target_state, NATIVE_STATE_TABLES)
            _clear_native_tables(target_history, NATIVE_HISTORY_TABLES)
            moved_rollout_dirs = _move_native_rollout_dirs(codex_home, backup_root)
        created_raw = _materialize_raw(repo, codex_home, manifest)
        state_payload = _json_load(repo / "sidebar" / "state.json", {}) or {}
        tables = state_payload.get("tables", {})
        layout_payload = _json_load(repo / "sidebar" / "global_state.json", {}) or {}
        global_state = _native_global_state_target(codex_home, layout_payload)
        source_home = str((manifest.get("source") or {}).get("codex_home") or "")
        source_personal = str((manifest.get("personal") or {}).get("source") or personal_dir)
        source_user_home = str(Path(source_home).expanduser().parent) if source_home else ""
        target_user_home = Path.home()

        def remap(table: str, row: Dict[str, Any]) -> Dict[str, Any]:
            out = dict(row)
            for key in ("cwd", "rollout_path", "path", "git_origin_url", "first_user_message", "preview"):
                if key in out:
                    out[key] = _remap_value(
                        out[key],
                        source_home,
                        codex_home,
                        source_personal,
                        personal_dir,
                        source_user_home,
                        target_user_home,
                    )
            if table == "threads":
                thread_id = str(out.get("id") or "")
                entry = next((item for item in manifest.get("threads", []) if item.get("thread_id") == thread_id), None)
                if entry:
                    rel = entry.get("source_relpath") or entry.get("native_relpath")
                    if rel:
                        out["rollout_path"] = str(codex_home / rel)
            return out

        state_write = sqlite3.connect(str(target_state), timeout=30)
        state_write.execute("pragma foreign_keys=on")
        state_write.execute("begin")
        for table in ("projects", "thread_sections", "threads", "project_roots", "thread_dynamic_tools", "thread_artifacts", "thread_spawn_edges"):
            if table in tables:
                _insert_rows(state_write, table, tables[table], remap=remap)
        state_write.commit()
        state_write.close()
        state_write = None

        history_write = sqlite3.connect(str(target_history), timeout=30)
        history_write.execute("pragma foreign_keys=on")
        history_write.execute("begin")
        for table in ("thread_turns", "thread_items", "thread_realtime_items", "thread_history_projection_state"):
            info = manifest.get("history", {}).get(table)
            if not info:
                continue
            part_names = [Path(str(item)).name for item in info.get("parts", [])]
            if not part_names and info.get("path"):
                part_names = [Path(str(info["path"])).name]
            archives = [repo / "sidebar" / "history" / name for name in part_names]
            if not archives or not all(path.exists() for path in archives):
                continue
            rows: List[Dict[str, Any]] = []
            for archive in archives:
                with gzip.open(archive, "rt", encoding="utf-8") as fh:
                    for line in fh:
                        if line.strip():
                            rows.append(json.loads(line))
                            if len(rows) >= 5000:
                                _insert_rows(history_write, table, rows)
                                rows = []
            if rows:
                _insert_rows(history_write, table, rows)
        history_write.commit()
        history_write.close()
        history_write = None
        if global_state:
            _write_json_atomic(global_state["path"], global_state["state"])
            global_state_applied = True
        imported_threads = len(tables.get("threads", []))
        imported_projects = len(tables.get("projects", []))
        imported_sections = len(tables.get("thread_sections", []))
        return {
            "status": "ok",
            "message": (
                f"已导入家里 Codex 原生侧边栏：{imported_threads} 条任务、"
                f"{imported_projects} 个项目、{imported_sections} 个分组、"
                f"{len(layout_payload.get('pinned_thread_ids') or [])} 条置顶"
            ),
            "threads": imported_threads,
            "projects": imported_projects,
            "sections": imported_sections,
            "raw_files": len(created_raw),
            "backup": str(backup_root),
            "replaced_existing": bool(replace_existing),
            "sidebar": {
                "pinned": len(layout_payload.get("pinned_thread_ids") or []),
                "projects": len(layout_payload.get("projects") or []),
                "state_file": str(global_state_path),
                "restored_top_level": int((global_state or {}).get("restored_top_level") or 0),
                "restored_atoms": int((global_state or {}).get("restored_atoms") or 0),
            },
            "databases": {"state": str(target_state), "history": str(target_history)},
        }
    except Exception as exc:
        for conn in (history_write, state_write):
            if conn is None:
                continue
            try:
                conn.rollback()
            except sqlite3.Error:
                pass
            try:
                conn.close()
            except sqlite3.Error:
                pass
        for path in reversed(created_raw):
            try:
                path.unlink()
            except OSError:
                pass
        for original, moved in reversed(moved_rollout_dirs):
            try:
                if original.is_dir() and not original.is_symlink():
                    shutil.rmtree(original, ignore_errors=True)
                elif original.exists() or original.is_symlink():
                    original.unlink()
                if moved.exists() or moved.is_symlink():
                    moved.rename(original)
            except OSError:
                pass
        # Restore the database files when either side failed.  WAL/SHM files are
        # intentionally not created by this importer; Codex is required closed.
        for source, target in ((backup_state, target_state), (backup_history, target_history)):
            if source and source.exists():
                shutil.copy2(source, target)
        for target, source in backup_sidecars:
            try:
                target.unlink()
            except FileNotFoundError:
                pass
            if source and source.exists():
                shutil.copy2(source, target)
        try:
            if backup_global_state and backup_global_state.exists():
                shutil.copy2(backup_global_state, global_state_path)
            elif global_state_applied:
                global_state_path.unlink()
        except OSError:
            pass
        return {"status": "fail", "message": f"原生导入失败，已回滚: {exc}", "backup": str(backup_root)}


def snapshot_status(
    repo: Path = SYNC_REPO_DEFAULT,
    codex_home: Path = CODEX_HOME_DEFAULT,
    personal_dir: Path = PERSONAL_DIR_DEFAULT,
) -> Dict[str, Any]:
    repo = Path(repo).expanduser()
    manifest = _json_load(repo / "sidebar" / "manifest.json", {}) or {}
    codex_home = Path(codex_home).expanduser()
    personal_dir = Path(personal_dir).expanduser()
    dbs = discover_databases(codex_home)
    remote = _git_remote(repo)
    return {
        "repo": str(repo),
        "initialized": (repo / ".git").is_dir(),
        "has_remote": remote,
        "manifest_exists": bool(manifest.get("threads")),
        "mode": (_json_load(repo / "config.json", {}) or {}).get("mode", "unconfigured"),
        "codex_home": str(codex_home),
        "personal_dir": str(personal_dir),
        "databases": dbs,
        "snapshot": {
            "exported_at": manifest.get("exported_at"),
            "thread_count": manifest.get("thread_count", 0),
            "raw_ok_count": manifest.get("raw_ok_count", 0),
            "reconstructed_count": manifest.get("reconstructed_count", 0),
            "missing_count": manifest.get("missing_count", 0),
            "unstable_count": manifest.get("unstable_count", 0),
            "raw_source_bytes": manifest.get("raw_source_bytes", 0),
            "raw_archive_bytes": manifest.get("raw_archive_bytes", 0),
            "snapshot_file_count": manifest.get("snapshot_file_count", 0),
            "snapshot_bytes": manifest.get("snapshot_bytes", 0),
            "project_count": len(manifest.get("projects", [])),
            "sensitive_paths": manifest.get("sensitive_paths", []),
            "missing_paths": manifest.get("missing_paths", []),
            "unstable_paths": manifest.get("unstable_paths", []),
        },
        "remote_ready": remote and bool(manifest.get("threads")),
    }


def sidebar(repo: Path = SYNC_REPO_DEFAULT, query: str = "", archived: str = "all", limit: int = 200) -> Dict[str, Any]:
    manifest = _load_manifest(Path(repo).expanduser())
    entries = list(manifest.get("threads", []))
    query_lower = (query or "").strip().lower()
    if archived == "active":
        entries = [item for item in entries if not item.get("archived")]
    elif archived == "archived":
        entries = [item for item in entries if item.get("archived")]
    if query_lower:
        entries = [
            item
            for item in entries
            if query_lower in str(item.get("title", "")).lower()
            or query_lower in str(item.get("search_text", "")).lower()
        ]
    entries = entries[: max(1, min(int(limit or 200), 1000))]
    public_entries = []
    for item in entries:
        public_item = dict(item)
        public_item.pop("search_text", None)
        public_entries.append(public_item)
    return {
        "count": len(public_entries),
        "total": manifest.get("thread_count", len(manifest.get("threads", []))),
        "items": public_entries,
        "projects": manifest.get("projects", []),
        "snapshot": snapshot_status(Path(repo)).get("snapshot"),
    }


def _entry_archive_paths(repo: Path, entry: Dict[str, Any]) -> List[Path]:
    names = [Path(str(item)).name for item in entry.get("archive_parts", [])]
    if not names and entry.get("archive_path"):
        names = [Path(str(entry["archive_path"])).name]
    paths = []
    for name in names:
        if not name or name in (".", "..") or "/" in name or "\\" in name:
            raise CodexSyncError("快照包含非法会话分片路径")
        paths.append(repo / "sidebar" / "threads" / name)
    return paths


def thread_detail(repo: Path, thread_id: str, raw: bool = False, offset: int = 0, limit: int = 200) -> Dict[str, Any]:
    if not THREAD_ID_RE.match(thread_id):
        raise CodexSyncError("非法 thread id")
    repo = Path(repo).expanduser()
    manifest = _load_manifest(repo)
    entry = next((item for item in manifest.get("threads", []) if item.get("thread_id") == thread_id), None)
    if not entry:
        raise CodexSyncError("找不到该 Codex 任务")
    archives = _entry_archive_paths(repo, entry)
    if not archives or not all(path.is_file() for path in archives):
        raise CodexSyncError("该任务没有可读取的原始会话")
    events: List[Any] = []
    has_more = False
    if not raw:
        offset = max(0, int(offset or 0))
        limit = max(1, min(int(limit or 200), 1000))
        seen = 0
        for _, parsed in _iter_archive_jsonl(archives):
            if parsed is None:
                continue
            if seen < offset:
                seen += 1
                continue
            if len(events) >= limit:
                has_more = True
                break
            events.append(parsed)
            seen += 1
    public_meta = dict(entry)
    public_meta.pop("search_text", None)
    return {
        "meta": public_meta,
        "events": events,
        "raw_paths": [str(path) for path in archives],
        "event_count": len(events),
        "offset": max(0, int(offset or 0)),
        "limit": max(1, min(int(limit or 200), 1000)),
        "has_more": has_more,
        "next_offset": max(0, int(offset or 0)) + len(events),
    }


def raw_thread_parts(repo: Path, thread_id: str) -> List[Path]:
    if not THREAD_ID_RE.match(thread_id):
        raise CodexSyncError("非法 thread id")
    repo = Path(repo).expanduser()
    manifest = _load_manifest(repo)
    entry = next((item for item in manifest.get("threads", []) if item.get("thread_id") == thread_id), None)
    if not entry:
        raise CodexSyncError("找不到该任务")
    paths = _entry_archive_paths(repo, entry)
    if not paths or not all(path.is_file() for path in paths):
        raise CodexSyncError("找不到该任务的原始会话")
    return paths


def sensitive_warning(repo: Path = SYNC_REPO_DEFAULT) -> Dict[str, Any]:
    manifest = _json_load(Path(repo).expanduser() / "sidebar" / "manifest.json", {}) or {}
    return {
        "paths": manifest.get("sensitive_paths", []),
        "count": len(manifest.get("sensitive_paths", [])),
        "message": "会话正文可能包含公司或第三方敏感信息；推送前请确认合规。",
    }
