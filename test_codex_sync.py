#!/usr/bin/env python3
"""Small stdlib-only regression tests for codex_sync.py."""

import gzip
import hashlib
import json
import os
import sqlite3
import sys
import tempfile
import unittest
from pathlib import Path


MODULE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(MODULE_DIR))
import codex_sync  # noqa: E402


STATE_SCHEMA = """
create table projects (id text primary key, name text not null, metadata text not null default '{}', position integer not null, created_at_ms integer not null, updated_at_ms integer not null);
create table thread_sections (id text primary key, name text not null, appearance text);
create table threads (
  id text primary key, rollout_path text not null, created_at integer not null, updated_at integer not null,
  source text not null, model_provider text not null, cwd text not null, title text not null,
  sandbox_policy text not null, approval_mode text not null, tokens_used integer not null default 0,
  has_user_event integer not null default 0, archived integer not null default 0, archived_at integer,
  git_sha text, git_branch text, git_origin_url text, cli_version text not null default '',
  first_user_message text not null default '', agent_nickname text, agent_role text,
  memory_mode text not null default 'enabled', model text, reasoning_effort text, agent_path text,
  created_at_ms integer, updated_at_ms integer, thread_source text, preview text not null default '',
  recency_at integer not null default 0, recency_at_ms integer not null default 0,
  history_mode text not null default 'legacy', name text, is_pinned integer not null default 0,
  thread_section_id text, section_position integer, section_entered_at_ms integer, project_id text,
  originator text, daybreak_enabled integer
);
"""

HISTORY_SCHEMA = """
create table thread_turns (thread_id text not null, turn_id text not null, rollout_ordinal integer not null, status text not null, error_json text, started_at integer, completed_at integer, duration_ms integer, first_user_item_id text, final_agent_item_id text, rollout_byte_offset integer, rollout_end_ordinal integer, rollout_end_byte_offset integer, primary key(thread_id, turn_id));
create table thread_items (thread_id text not null, turn_id text not null, item_id text not null, rollout_ordinal integer not null, created_at_ms integer not null, item_json text not null, item_type text not null default '', updated_at_ordinal integer not null default 0, primary key(thread_id, turn_id, item_id));
create table thread_realtime_items (thread_id text not null, item_id text not null, rollout_ordinal integer not null, created_at_ms integer not null, item_type text not null, item_json text not null, primary key(thread_id, item_id));
create table thread_history_projection_state (thread_id text primary key, next_rollout_byte_offset integer not null, next_rollout_ordinal integer not null);
"""


def make_db(path: Path, schema: str) -> None:
    conn = sqlite3.connect(path)
    conn.executescript(schema)
    conn.close()


class CodexSyncTest(unittest.TestCase):
    def test_large_archive_is_split_and_reassembled(self):
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            old_limit = codex_sync.ARCHIVE_PART_BYTES
            codex_sync.ARCHIVE_PART_BYTES = 10
            try:
                lines = [b"1234567890\n", b"abcdefghij\n", b"last\n"]
                info = codex_sync._gzip_write_lines(lines, root / "thread")
            finally:
                codex_sync.ARCHIVE_PART_BYTES = old_limit
            self.assertGreater(len(info["archive_parts"]), 1)
            rebuilt = b"".join(gzip.open(root / name, "rb").read() for name in info["archive_parts"])
            self.assertEqual(rebuilt, b"".join(lines))

    def test_raw_archive_preserves_missing_final_newline(self):
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            source = root / "rollout.jsonl"
            raw = b'{"type":"session_meta"}\n{"type":"response_item"}'
            source.write_bytes(raw)
            info = codex_sync._gzip_copy_jsonl(source, root / "thread")
            rebuilt = b"".join(gzip.open(root / name, "rb").read() for name in info["archive_parts"])
            self.assertEqual(rebuilt, raw)
            self.assertEqual(info["source_sha256"], hashlib.sha256(raw).hexdigest())

    def test_export_search_and_native_import(self):
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            source_home = root / "source-codex"
            source_home.mkdir()
            (source_home / "sessions" / "2026" / "01").mkdir(parents=True)
            personal = root / "personal"
            personal.mkdir()
            (personal / ".hidden.md").write_text("hidden", encoding="utf-8")
            (personal / "note.md").write_text("personal", encoding="utf-8")

            state_path = source_home / "state_1.sqlite"
            history_path = source_home / "thread_history_1.sqlite"
            make_db(state_path, STATE_SCHEMA)
            make_db(history_path, HISTORY_SCHEMA)
            thread_id = "01999999-aaaa-bbbb-cccc-000000000001"
            rollout = source_home / "sessions" / "2026" / "01" / f"rollout-{thread_id}.jsonl"
            raw_lines = [
                {"type": "session_meta", "payload": {"id": thread_id}},
                {"type": "response_item", "payload": {"role": "user", "content": [{"text": "找我的个人笔记"}]}},
                {"type": "response_item", "payload": {"role": "assistant", "content": [{"text": "我来帮你找个人笔记。"}]}},
            ]
            raw = b"".join((json.dumps(item, ensure_ascii=False) + "\n").encode("utf-8") for item in raw_lines)
            rollout.write_bytes(raw)

            conn = sqlite3.connect(state_path)
            conn.execute("insert into projects values (?, ?, ?, ?, ?, ?)", ("p1", "个人", "{}", 0, 1, 1))
            conn.execute("insert into thread_sections values (?, ?, ?)", ("s1", "Pinned", None))
            columns = [row[1] for row in conn.execute("pragma table_info(threads)")]
            values = {column: None for column in columns}
            values.update({
                "id": thread_id, "rollout_path": str(rollout), "created_at": 1, "updated_at": 2,
                "source": "test", "model_provider": "openai", "cwd": str(personal),
                "title": "找个人笔记", "sandbox_policy": "none", "approval_mode": "never",
                "tokens_used": 0, "has_user_event": 1, "archived": 0, "memory_mode": "enabled",
                "preview": "", "recency_at": 2, "recency_at_ms": 2, "history_mode": "legacy",
                "first_user_message": "",
                "is_pinned": 1, "thread_section_id": "s1",
                "project_id": "p1", "cli_version": "test", "memory_mode": "enabled",
            })
            names = ",".join(columns)
            placeholders = ",".join("?" for _ in columns)
            conn.execute(f"insert into threads ({names}) values ({placeholders})", [values[c] for c in columns])
            conn.commit()
            conn.close()

            conn = sqlite3.connect(history_path)
            for ordinal, item in enumerate(raw_lines):
                item_id = f"item-{ordinal}"
                conn.execute("insert into thread_items(thread_id,turn_id,item_id,rollout_ordinal,created_at_ms,item_json,item_type) values(?,?,?,?,?,?,?)", (thread_id, "turn-1", item_id, ordinal, ordinal, json.dumps(item, ensure_ascii=False), "message"))
            conn.execute("insert into thread_turns(thread_id,turn_id,rollout_ordinal,status) values(?,?,?,?)", (thread_id, "turn-1", 0, "completed"))
            conn.commit()
            conn.close()

            repo = root / "repo"
            status = codex_sync.export_snapshot(repo, source_home, personal, include_history=True)
            self.assertEqual(status["snapshot"]["thread_count"], 1)
            self.assertEqual(status["snapshot"]["raw_ok_count"], 1)
            parts = codex_sync.raw_thread_parts(repo, thread_id)
            self.assertTrue(parts)
            self.assertTrue(all(path.is_file() for path in parts))
            restored = b"".join(gzip.open(path, "rb").read() for path in parts)
            self.assertEqual(restored, raw)

            found = codex_sync.sidebar(repo, query="个人笔记")
            self.assertEqual(found["count"], 1)
            detail = codex_sync.thread_detail(repo, thread_id)
            self.assertEqual(detail["event_count"], 3)

            # A failed second export must not tear down the last good snapshot.
            old_manifest = json.loads((repo / "sidebar" / "manifest.json").read_text(encoding="utf-8"))
            rollout.write_bytes(raw + b"\n")
            original_copy = codex_sync._gzip_copy_jsonl
            codex_sync._gzip_copy_jsonl = lambda *_args, **_kwargs: (_ for _ in ()).throw(RuntimeError("synthetic export failure"))
            try:
                with self.assertRaises(RuntimeError):
                    codex_sync.export_snapshot(repo, source_home, personal, include_history=True)
            finally:
                codex_sync._gzip_copy_jsonl = original_copy
            current_manifest = json.loads((repo / "sidebar" / "manifest.json").read_text(encoding="utf-8"))
            self.assertEqual(current_manifest["threads"][0]["source_sha256"], old_manifest["threads"][0]["source_sha256"])
            self.assertEqual(b"".join(gzip.open(path, "rb").read() for path in parts), raw)

            target_home = root / "target-codex"
            target_home.mkdir()
            make_db(target_home / "state_2.sqlite", STATE_SCHEMA)
            make_db(target_home / "thread_history_2.sqlite", HISTORY_SCHEMA)
            original_process_check = codex_sync._codex_processes
            codex_sync._codex_processes = lambda: []
            try:
                imported = codex_sync.native_import(repo, target_home, root / "target-personal", confirm_closed=True)
            finally:
                codex_sync._codex_processes = original_process_check
            self.assertEqual(imported["status"], "ok", imported)
            target_state = sqlite3.connect(target_home / "state_2.sqlite")
            self.assertEqual(target_state.execute("select count(*) from threads").fetchone()[0], 1)
            target_state.close()
            self.assertTrue((target_home / "sessions" / "2026" / "01" / rollout.name).is_file())

    def test_missing_rollout_is_reconstructed(self):
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            codex_home = root / "codex"
            codex_home.mkdir()
            make_db(codex_home / "state.sqlite", STATE_SCHEMA)
            make_db(codex_home / "history.sqlite", HISTORY_SCHEMA)
            thread_id = "01999999-aaaa-bbbb-cccc-000000000002"
            conn = sqlite3.connect(codex_home / "state.sqlite")
            conn.execute("insert into threads(id,rollout_path,created_at,updated_at,source,model_provider,cwd,title,sandbox_policy,approval_mode) values(?,?,?,?,?,?,?,?,?,?)", (thread_id, str(codex_home / "sessions" / "missing.jsonl"), 1, 2, "test", "openai", str(root), "missing", "none", "never"))
            conn.commit(); conn.close()
            conn = sqlite3.connect(codex_home / "history.sqlite")
            conn.execute("insert into thread_items(thread_id,turn_id,item_id,rollout_ordinal,created_at_ms,item_json) values(?,?,?,?,?,?)", (thread_id, "turn", "item", 0, 0, json.dumps({"type": "response_item", "payload": {"role": "assistant", "content": [{"text": "重建内容"}]}})))
            conn.commit(); conn.close()
            status = codex_sync.export_snapshot(root / "repo", codex_home, root / "personal", include_history=False)
            self.assertEqual(status["snapshot"]["reconstructed_count"], 1)


if __name__ == "__main__":
    unittest.main(verbosity=2)
