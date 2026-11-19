from pathlib import Path
import os,hashlib
BASE=Path(__file__).resolve().parent
RAW=BASE.parent/'chapters/W/raw'
def append(file,text):
 fd=os.open(BASE/file,os.O_WRONLY|os.O_APPEND|os.O_CREAT,0o644)
 try: os.write(fd,text.encode('utf-8'))
 finally: os.close(fd)
def audit(name,facts,cases,components):
 b=(RAW/name).read_bytes(); n=len(b.decode().splitlines())
 append('read-audit-meetings.md',f'- `{name}`：全文 L1-L{n}，{len(b)} 字节，SHA256 `{hashlib.sha256(b).hexdigest()}`；新增事实 {facts}、案例 {cases}、部件补充 {components}。\n')
