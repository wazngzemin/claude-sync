import importlib.util
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('large_files', Path(__file__).with_name('large_files.py'))
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)


class LargeFilesTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        self.repo = self.root / 'repo'
        self.repo.mkdir()
        subprocess.run(['git', 'init', '-q', str(self.repo)], check=True)
        self.dest = self.repo / 'project-3.23/test [one].html'
        self.dest.parent.mkdir()
        self.payload = bytes(range(256)) * 5
        self.dest.write_bytes(self.payload)
        self.limit = patch.object(m, 'LIMIT', 1024)
        self.chunk = patch.object(m, 'CHUNK_SIZE', 512)
        self.limit.start()
        self.chunk.start()

    def tearDown(self):
        self.limit.stop()
        self.chunk.stop()
        self.tmp.cleanup()

    def prepare(self):
        return m.prepare(self.repo, originals_dir=self.root / 'backups')

    def test_roundtrip_and_index_exclusion(self):
        subprocess.run(['git', '-C', str(self.repo), 'add', '.'], check=True)
        self.assertEqual(self.prepare()['count'], 1)
        self.assertEqual(self.dest.read_bytes(), self.payload)
        tracked = subprocess.check_output(['git', '-C', str(self.repo), 'ls-files']).decode()
        self.assertNotIn('test [one].html', tracked)
        self.dest.unlink()
        m.restore(self.repo)
        self.assertEqual(self.dest.read_bytes(), self.payload)
        self.assertEqual(self.prepare()['count'], 1)
        subprocess.run(['git', '-C', str(self.repo), 'add', '-A'], check=True)
        tracked = subprocess.check_output(['git', '-C', str(self.repo), 'ls-files']).decode()
        self.assertNotIn('test [one].html', tracked)

    def test_shrink_and_delete(self):
        self.prepare()
        self.dest.write_bytes(b'small')
        self.assertEqual(self.prepare()['count'], 0)
        m.restore(self.repo)
        self.assertEqual(self.dest.read_bytes(), b'small')
        self.dest.write_bytes(self.payload)
        self.prepare()
        self.dest.unlink()
        self.assertEqual(self.prepare()['count'], 0)
        m.restore(self.repo)
        self.assertFalse(self.dest.exists())

    def test_changed_original(self):
        self.prepare()
        self.dest.write_bytes(self.payload + b'changed')
        self.prepare()
        self.dest.unlink()
        m.restore(self.repo)
        self.assertEqual(self.dest.read_bytes(), self.payload + b'changed')

    def test_corrupt_chunk_does_not_replace(self):
        self.prepare()
        manifest = json.loads((self.repo / '.sync-large/manifest.json').read_text())
        entry = next(iter(manifest['files'].values()))
        (self.repo / '.sync-large' / entry['sha256'] / 'part-00000').write_bytes(b'bad')
        with self.assertRaises(ValueError):
            m.restore(self.repo)
        self.assertEqual(self.dest.read_bytes(), self.payload)

    def test_escape_rejected(self):
        self.prepare()
        file = self.repo / '.sync-large/manifest.json'
        data = json.loads(file.read_text())
        data['files']['project-3.23/../../outside'] = next(iter(data['files'].values()))
        file.write_text(json.dumps(data))
        with self.assertRaises(ValueError):
            m.restore(self.repo)
        self.assertFalse((self.root / 'outside').exists())

    def test_conflicting_original_preserved(self):
        self.prepare()
        self.dest.write_bytes(b'local edit')
        with self.assertRaises(ValueError):
            m.restore(self.repo)
        self.assertEqual(self.dest.read_bytes(), b'local edit')

    def test_missing_chunk(self):
        self.prepare()
        data = json.loads((self.repo / '.sync-large/manifest.json').read_text())
        entry = next(iter(data['files'].values()))
        (self.repo / '.sync-large' / entry['sha256'] / 'part-00000').unlink()
        self.dest.unlink()
        with self.assertRaises(ValueError):
            m.restore(self.repo)
        self.assertFalse(self.dest.exists())


if __name__ == '__main__':
    unittest.main()
