#!/bin/bash
# $1=obj_token $2=outname
lark-cli docs +fetch --as user --doc "https://bytedance.larkoffice.com/docx/$1" 2>/dev/null | python3 -c "
import json,sys,re
try:
    d=json.load(sys.stdin); x=d['data']['document']['content']
except Exception as e:
    print('__FETCH_FAIL__'); sys.exit()
t=re.sub(r'<[^>]+>',' ',x); t=re.sub(r'\s+',' ',t)
print(t[:2600])
"
