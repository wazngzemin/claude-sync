#!/usr/bin/env python3
"""Lossless large-file storage. Restore after clone/pull, prepare after collection.
Originals stay in the working tree but are excluded from the Git index.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import subprocess
import tempfile

LIMIT = 100 * 1024 * 1024
CHUNK_SIZE = 32 * 1024 * 1024
STORE = '.sync-large'
HEX = re.compile(r'^[0-9a-f]{64}$')


def _git(repo, *args):
    return subprocess.run(['git', '-C', str(repo), *args], check=True,
                          stdout=subprocess.PIPE, stderr=subprocess.PIPE).stdout


def _path(repo, rel):
    if not isinstance(rel, str) or '\\' in rel or '\n' in rel or '\r' in rel:
        raise ValueError('Invalid large-file path')
    parts = PurePosixPath(rel).parts
    if (not parts or parts[0] not in ('project-3.23', 'claude-config') or
            len(parts) < 2 or rel.startswith('/') or '..' in parts or '.' in rel.split('/') or
            '' in rel.split('/')):
        raise ValueError('Large-file path outside supported scopes: ' + rel)
    target = repo.joinpath(*parts)
    if not target.resolve().is_relative_to(repo.resolve()):
        raise ValueError('Large-file path escapes repository')
    if any(p.is_symlink() for p in [target, *target.parents] if p != repo.parent):
        # Includes parent symlinks: no materialization through aliases.
        raise ValueError('Symlink in large-file destination')
    return target


def _storage(repo):
    root = repo / STORE
    if root.is_symlink() or not root.resolve().is_relative_to(repo.resolve()):
        raise ValueError('Invalid chunk storage')
    return root


def _read(repo):
    file = _storage(repo) / 'manifest.json'
    if not file.exists():
        return {}
    if file.is_symlink():
        raise ValueError('Manifest must not be a symlink')
    data = json.loads(file.read_text(encoding='utf-8'))
    if data.get('version') != 1 or not isinstance(data.get('files'), dict):
        raise ValueError('Unsupported large-file manifest')
    for rel, entry in data['files'].items():
        _path(repo, rel)
        if not isinstance(entry, dict) or not HEX.fullmatch(str(entry.get('sha256', ''))):
            raise ValueError('Invalid large-file digest')
        size = entry.get('size')
        chunks = entry.get('chunks')
        if type(size) is not int or size <= 0 or not isinstance(chunks, list) or not chunks:
            raise ValueError('Invalid large-file metadata')
        total = 0
        for i, chunk in enumerate(chunks):
            if (not isinstance(chunk, dict) or chunk.get('name') != f'part-{i:05d}' or
                    not HEX.fullmatch(str(chunk.get('sha256', ''))) or
                    type(chunk.get('size')) is not int or not 0 < chunk['size'] <= CHUNK_SIZE):
                raise ValueError('Invalid chunk metadata')
            total += chunk['size']
        if total != size:
            raise ValueError('Inconsistent large-file size')
    return data['files']


def _write(repo, entries):
    root = _storage(repo)
    root.mkdir(exist_ok=True)
    fd, tmp = tempfile.mkstemp(prefix='manifest-', dir=root)
    try:
        with os.fdopen(fd, 'w', encoding='utf-8') as f:
            json.dump({'version': 1, 'files': entries}, f, ensure_ascii=False, indent=2)
            f.write('\n')
        os.replace(tmp, root / 'manifest.json')
    finally:
        if os.path.exists(tmp):
            os.unlink(tmp)


def _hash(path):
    h = hashlib.sha256()
    size = 0
    with path.open('rb') as f:
        for buf in iter(lambda: f.read(1024 * 1024), b''):
            h.update(buf)
            size += len(buf)
    return h.hexdigest(), size


def _exclude(repo, rel, add=True):
    raw = _git(repo, 'rev-parse', '--git-path', 'info/exclude').decode().strip()
    file = Path(raw)
    if not file.is_absolute():
        file = repo / file
    file.parent.mkdir(parents=True, exist_ok=True)
    # Anchor and escape gitignore metacharacters for one exact path.
    pattern = '/' + re.sub(r'([\\*?\[\] ])', r'\\\1', rel)
    lines = file.read_text().splitlines() if file.exists() else []
    if add and pattern not in lines:
        lines.append(pattern)
    if not add:
        lines = [line for line in lines if line != pattern]
    file.write_text('\n'.join(lines) + '\n')


def _assemble(repo, entry, output):
    base = _storage(repo) / entry['sha256']
    if base.is_symlink():
        raise ValueError('Symlink chunk directory')
    h = hashlib.sha256()
    size = 0
    with output.open('wb') as out:
        for chunk in entry['chunks']:
            file = base / chunk['name']
            if file.is_symlink() or not file.is_file():
                raise ValueError('Missing or invalid chunk: ' + str(file))
            ch = hashlib.sha256()
            count = 0
            with file.open('rb') as src:
                for buf in iter(lambda: src.read(1024 * 1024), b''):
                    count += len(buf)
                    if count > chunk['size']:
                        raise ValueError('Oversized chunk')
                    ch.update(buf)
                    h.update(buf)
                    out.write(buf)
            if count != chunk['size'] or ch.hexdigest() != chunk['sha256']:
                raise ValueError('Chunk checksum mismatch')
            size += count
        out.flush()
        os.fsync(out.fileno())
    if size != entry['size'] or h.hexdigest() != entry['sha256']:
        raise ValueError('Whole-file checksum mismatch')


def _pack(repo, source, originals):
    root = _storage(repo)
    root.mkdir(exist_ok=True)
    temp = Path(tempfile.mkdtemp(prefix='pack-', dir=root))
    try:
        h = hashlib.sha256()
        chunks = []
        size = 0
        with source.open('rb') as f:
            while True:
                buf = f.read(CHUNK_SIZE)
                if not buf:
                    break
                name = f'part-{len(chunks):05d}'
                (temp / name).write_bytes(buf)
                chunks.append({'name': name, 'size': len(buf), 'sha256': hashlib.sha256(buf).hexdigest()})
                h.update(buf)
                size += len(buf)
        digest = h.hexdigest()
        entry = {'sha256': digest, 'size': size, 'chunks': chunks}
        if _hash(source) != (digest, size):
            raise ValueError('Source changed while packaging')
        dest = root / digest
        if dest.exists():
            check = temp / 'verify'
            _assemble(repo, entry, check)
            check.unlink()
        else:
            os.replace(temp, dest)
        originals.mkdir(parents=True, exist_ok=True)
        backup = originals / digest
        if backup.exists():
            if backup.is_symlink() or _hash(backup) != (digest, size):
                raise ValueError('Original backup checksum mismatch')
        else:
            fd, name = tempfile.mkstemp(prefix='original-', dir=originals)
            os.close(fd)
            try:
                shutil.copy2(source, name)
                if _hash(Path(name)) != (digest, size):
                    raise ValueError('Backup verification failed')
                os.replace(name, backup)
            finally:
                if os.path.exists(name):
                    os.unlink(name)
        if _hash(source) != (digest, size):
            raise ValueError('Source changed after backup')
        return entry
    finally:
        if temp.exists():
            shutil.rmtree(temp)


def prepare(repo, originals_dir=None):
    repo = Path(repo).resolve()
    originals = Path(originals_dir) if originals_dir else Path.home() / '.claude-sync-state/large-originals'
    entries = _read(repo)
    candidates = set(_git(repo, 'ls-files', '-co', '--exclude-standard', '-z').decode('utf-8').split('\0'))
    candidates.discard('')
    # Previously ignored originals must still be inspected for edits or shrinkage.
    candidates.update(entries)
    packed, removed = [], []
    for rel in sorted(candidates):
        if rel.startswith(STORE + '/'):
            continue
        source = repo / rel
        if not source.is_file():
            if rel in entries:
                del entries[rel]
                _exclude(repo, rel, False)
                removed.append(rel)
            continue
        if source.stat().st_size <= LIMIT:
            if rel in entries:
                del entries[rel]
                _exclude(repo, rel, False)
                removed.append(rel)
            continue
        source = _path(repo, rel)
        entry = _pack(repo, source, originals)
        entries[rel] = entry
        # Publish recoverable manifest before excluding the original from Git.
        _write(repo, entries)
        _exclude(repo, rel)
        _git(repo, 'rm', '--cached', '-f', '--ignore-unmatch', '--', rel)
        if _hash(source) != (entry['sha256'], entry['size']):
            raise ValueError('Source changed before removal')
        packed.append(rel)
    _write(repo, entries)
    return {'packed': packed, 'removed': removed, 'count': len(entries)}


def restore(repo):
    repo = Path(repo).resolve()
    entries = _read(repo)
    restored = []
    # Validate every entry before modifying destinations.
    staged = []
    try:
        for rel, entry in entries.items():
            dest = _path(repo, rel)
            dest.parent.mkdir(parents=True, exist_ok=True)
            fd, name = tempfile.mkstemp(prefix='.sync-restore-', dir=dest.parent)
            os.close(fd)
            temp = Path(name)
            staged.append((rel, temp, dest, entry))
            _assemble(repo, entry, temp)
            if dest.exists() and _hash(dest) != (entry['sha256'], entry['size']):
                raise ValueError('Existing file differs; preserve it before restoring: ' + rel)
        for rel, temp, dest, entry in staged:
            _exclude(repo, rel)
            os.replace(temp, dest)
            restored.append(rel)
    finally:
        for _, temp, _, _ in staged:
            if temp.exists():
                temp.unlink()
    return {'restored': restored}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=['prepare', 'restore'])
    parser.add_argument('repo', nargs='?', default=str(Path.home() / '.claude-sync'))
    args = parser.parse_args()
    result = prepare(args.repo) if args.command == 'prepare' else restore(args.repo)
    print(json.dumps(result, ensure_ascii=False))


if __name__ == '__main__':
    main()
