from pathlib import Path
import os, hashlib, json, sys
BASE=Path(__file__).resolve().parent
RAW=BASE.parent/'chapters/W/raw'
def append(name, text):
    fd=os.open(BASE/name,os.O_WRONLY|os.O_CREAT|os.O_APPEND,0o644)
    try: os.write(fd,(text.rstrip()+'\n\n').encode())
    finally: os.close(fd)
def audit(name, ids):
    b=(RAW/name).read_bytes()
    append('read-audit-core.md',f'- `{name}`：全文 {len(b.decode().splitlines())} 行；读取范围 1–{len(b.decode().splitlines())}；SHA256 `{hashlib.sha256(b).hexdigest()}`；提取 {ids}。')
if __name__=='__main__':
    obj=json.load(sys.stdin)
    for name,text in obj['outputs'].items(): append(name,text)
    audit(obj['source'],obj['ids'])
