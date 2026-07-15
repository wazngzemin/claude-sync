#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
JIRA 一键流转面板  ——  王泽民 / Planner Bug
把 analyze→repair→fix 三步流转表单平铺在一个页面，填一次点提交，
服务端自动依次调 JIRA 接口完成流转，并可上传复测图片到评论。

运行:  python3 jira_panel.py
然后浏览器会自动打开 http://localhost:8770
Cookie 失效时，在页面顶部粘贴新的 JSESSIONID 即可。
"""
import json, os, base64, urllib.request, urllib.parse, urllib.error, webbrowser, threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from datetime import datetime

PORT = 8770
BASE = 'http://jira.z-onesoftware.com:8080'
API  = BASE + '/rest/api/2'
HERE = os.path.dirname(os.path.abspath(__file__))
COOKIE_FILE = os.path.join(HERE, '.jira_cookie')
TRIAGE_CSV  = os.path.join(HERE, 'jira_bug_triage_2026-07-14.csv')

# 含已闭环：去掉状态限制，显示我名下(pwhcoy)、字节两类责任方的全部 Bug（任意状态）
JQL = ('project in (DNA, DNAVC) AND issuetype = Bug '
       'AND "问题责任方" in (字节跳动, 字节跳动-大模型) AND assignee = pwhcoy ORDER BY updated DESC')

# 线性流转链: 下标 = 状态所处阶段
STATUS_ORDER = ['DRAFT', 'ANALYZING', 'Repairing', 'Fixed']
STEP_SEQ = [  # 每一步: (流转名, 到达状态)
    ('analyze',  'ANALYZING'),
    ('repair',   'Repairing'),
    ('fix',      'Fixed'),
]

def today(): return datetime.now().strftime('%Y-%m-%d')

# ---------------- cookie ----------------
_cookie = {'v': '7715DCBECA3F6678A802019443EB4DF6'}
if os.path.exists(COOKIE_FILE):
    try: _cookie['v'] = open(COOKIE_FILE).read().strip() or _cookie['v']
    except: pass
def cookie_hdr(): return 'JSESSIONID=' + _cookie['v']
def set_cookie(v):
    _cookie['v'] = v.strip().replace('JSESSIONID=', '')
    try: open(COOKIE_FILE, 'w').write(_cookie['v'])
    except: pass

# ---------------- JIRA helpers ----------------
def jget(path):
    r = urllib.request.Request(API + path, headers={'Cookie': cookie_hdr(), 'Accept': 'application/json'})
    with urllib.request.urlopen(r, timeout=40) as resp:
        return json.load(resp)

def jpost(path, body):
    data = json.dumps(body).encode('utf-8')
    r = urllib.request.Request(API + path, data=data, method='POST',
        headers={'Cookie': cookie_hdr(), 'Accept': 'application/json',
                 'Content-Type': 'application/json', 'X-Atlassian-Token': 'no-check'})
    with urllib.request.urlopen(r, timeout=40) as resp:
        b = resp.read()
        return json.loads(b) if b.strip() else {}

def jattach(key, filename, raw_bytes):
    boundary = '----jirapanelBOUNDARY7715'
    ct = 'application/octet-stream'
    lo = filename.lower()
    if lo.endswith('.png'): ct = 'image/png'
    elif lo.endswith(('.jpg', '.jpeg')): ct = 'image/jpeg'
    elif lo.endswith('.gif'): ct = 'image/gif'
    pre = (f'--{boundary}\r\nContent-Disposition: form-data; name="file"; filename="{filename}"\r\n'
           f'Content-Type: {ct}\r\n\r\n').encode('utf-8')
    post = (f'\r\n--{boundary}--\r\n').encode('utf-8')
    data = pre + raw_bytes + post
    r = urllib.request.Request(f'{API}/issue/{key}/attachments', data=data, method='POST',
        headers={'Cookie': cookie_hdr(), 'X-Atlassian-Token': 'no-check',
                 'Content-Type': f'multipart/form-data; boundary={boundary}'})
    with urllib.request.urlopen(r, timeout=60) as resp:
        return json.load(resp)

def load_triage():
    m = {}
    if os.path.exists(TRIAGE_CSV):
        import csv
        with open(TRIAGE_CSV, encoding='utf-8-sig') as fp:
            for row in csv.DictReader(fp):
                m[row['Key']] = (row.get('子类', ''), row.get('根因/处置', ''))
    return m

# ---------------- 业务 ----------------
def fetch_list():
    d = jget('/search?' + urllib.parse.urlencode({
        'jql': JQL, 'maxResults': 300,
        'fields': 'key,summary,status,customfield_13903,customfield_11032'}))
    tri = load_triage()
    out = []
    for i in d['issues']:
        f = i['fields']; k = i['key']
        cat, reason = tri.get(k, ('', ''))
        out.append({'key': k, 'summary': f.get('summary', ''),
                    'status': (f.get('status') or {}).get('name', ''),
                    'module': (f.get('customfield_13903') or {}).get('value', '') if isinstance(f.get('customfield_13903'), dict) else '',
                    'freq': (f.get('customfield_11032') or {}).get('value', '') if isinstance(f.get('customfield_11032'), dict) else '',
                    'cat': cat, 'reason': reason})
    return out

def opt_id(v):
    if isinstance(v, list) and v: return v[0].get('id')
    if isinstance(v, dict): return v.get('id')
    return None

def fetch_issue(key):
    f = jget(f'/issue/{key}?fields=summary,status,priority,customfield_10616,customfield_11425,customfield_11033,customfield_15367')['fields']
    st = (f.get('status') or {}).get('name', '')
    repro = f.get('customfield_11033') or ''
    note  = f.get('customfield_15367') or ''
    # analyze 预填(保持现值)
    prio = (f.get('priority') or {})
    comp_id = opt_id(f.get('customfield_10616')) or '11741'
    comp_val = (f.get('customfield_10616') or [{}])[0].get('value', '无法确定') if f.get('customfield_10616') else '无法确定'
    resp_id = opt_id(f.get('customfield_11425')) or '25453'
    resp_val = (f.get('customfield_11425') or [{}])[0].get('value', '字节跳动-大模型') if f.get('customfield_11425') else '字节跳动-大模型'
    # 计算从当前态到 Fixed 需要哪些步骤
    try: cur = STATUS_ORDER.index(st)
    except ValueError: cur = None
    steps = [s[0] for s in STEP_SEQ[cur:]] if cur is not None else []
    # 原因分析默认值：优先用该 bug 的分诊根因，否则通用兜底
    tri = load_triage().get(key, ('', ''))
    cause = tri[1] or '模型侧推理问题，未正确下发工具调用（详见问题描述）'
    return {'key': key, 'summary': f.get('summary', ''), 'status': st,
            'repro': repro, 'note': note, 'steps': steps, 'linear': cur is not None,
            'prefill': {'priority_name': prio.get('name', 'Medium'), 'priority_id': prio.get('id', '3'),
                        'comp_id': comp_id, 'comp_val': comp_val,
                        'resp_id': resp_id, 'resp_val': resp_val},
            'defaults': {'long_fix': 'sft方案解决', 'plan_date': today(), 'baseline': 'P',
                         'owner': 'pwhcoy', 'done_date': today(), 'cause': cause,
                         'sw_ver': 'ppe_aidv_saic_dev', 'part_ver': 'ppe_aidv_saic_dev'}}

def find_trans(key, name):
    trs = jget(f'/issue/{key}/transitions')['transitions']
    for t in trs:
        if t['name'].strip().lower() == name.lower():
            return t['id'], t['to']['name']
    return None, None

def do_submit(payload):
    key = payload['key']
    target = payload.get('target', 'Fixed')
    fields = payload.get('fields', {})
    comment = (payload.get('comment') or '').strip()
    img = payload.get('image')            # {name, b64}
    log = []

    # 1) 附件(如有)
    img_markup = ''
    if img and img.get('b64'):
        try:
            raw = base64.b64decode(img['b64'])
            res = jattach(key, img.get('name', 'retest.png'), raw)
            fn = res[0]['filename'] if res else img.get('name')
            img_markup = f'\n!{fn}|thumbnail!'
            log.append(('附件', 'ok', f'已上传 {fn}'))
        except Exception as e:
            log.append(('附件', 'err', str(e)))

    full_comment = (comment + img_markup).strip()

    # 2) 仅评论模式
    if target == 'comment_only':
        if full_comment:
            try:
                jpost(f'/issue/{key}/comment', {'body': full_comment})
                log.append(('评论', 'ok', '已添加复测评论'))
            except Exception as e:
                log.append(('评论', 'err', str(e)))
        else:
            log.append(('评论', 'skip', '评论为空'))
        return {'key': key, 'log': log}

    # 3) 流转链
    try: tgt_idx = STATUS_ORDER.index(target)
    except ValueError: tgt_idx = len(STEP_SEQ)
    cur = fetch_issue(key)['status']
    try: cur_idx = STATUS_ORDER.index(cur)
    except ValueError:
        log.append(('流转', 'err', f'当前状态“{cur}”不在线性链路，请在 JIRA 手动处理')); return {'key': key, 'log': log}

    plan = STEP_SEQ[cur_idx:tgt_idx]          # [(name,to),...]
    if not plan:
        log.append(('流转', 'skip', f'{cur} 已达到或超过目标 {target}'))
    for idx, (name, to_status) in enumerate(plan):
        tid, to_name = find_trans(key, name)
        if not tid:
            log.append((name, 'err', f'当前无“{name}”流转（可能状态已变）')); break
        body = {'transition': {'id': tid}, 'fields': fields.get(name, {})}
        # 评论放在最后一步
        if full_comment and idx == len(plan) - 1:
            body['update'] = {'comment': [{'add': {'body': full_comment}}]}
        try:
            jpost(f'/issue/{key}/transitions', body)
            log.append((name, 'ok', f'→ {to_name or to_status}'))
        except urllib.error.HTTPError as e:
            detail = e.read().decode('utf-8', 'ignore')[:500]
            log.append((name, 'err', f'HTTP{e.code} {detail}')); break
        except Exception as e:
            log.append((name, 'err', str(e))); break
    return {'key': key, 'log': log}

def build_fields(prefill, defaults, form):
    """把前端表单值组装成 JIRA fields（按步骤）"""
    def g(k, d=''): return (form.get(k) or d)
    analyze = {
        'priority': {'id': prefill['priority_id']},
        'customfield_10616': [{'id': prefill['comp_id']}],
        'customfield_11425': [{'id': prefill['resp_id']}],
    }
    if g('analyze_progress'): analyze['customfield_10647'] = g('analyze_progress')
    analyze['customfield_10792'] = g('analyze_cause', defaults.get('cause', '模型侧推理问题'))  # 必填:原因分析
    analyze['customfield_11145'] = [{'value': g('root_cause', '云端问题')}]                     # 必填:Root Cause分类
    repair = {
        'customfield_10646': g('long_fix', defaults['long_fix']),
        'customfield_11037': g('plan_date', defaults['plan_date']),
        'customfield_11475': {'value': g('baseline', defaults['baseline'])},
        'customfield_11018': {'name': g('owner', defaults['owner'])},
    }
    if g('short_fix'): repair['customfield_10645'] = g('short_fix')
    fix = {
        'customfield_11019': g('done_date', defaults['done_date']),
        'customfield_11030': g('sw_ver', defaults['sw_ver']),
        'customfield_11031': g('part_ver', defaults['part_ver']),
    }
    if g('ewo'): fix['customfield_14203'] = g('ewo')
    return {'analyze': analyze, 'repair': repair, 'fix': fix}

# ---------------- HTTP ----------------
class H(BaseHTTPRequestHandler):
    def _send(self, code, body, ctype='application/json'):
        b = body if isinstance(body, bytes) else (json.dumps(body, ensure_ascii=False).encode('utf-8') if ctype == 'application/json' else body.encode('utf-8'))
        self.send_response(code); self.send_header('Content-Type', ctype)
        self.send_header('Content-Length', str(len(b))); self.end_headers(); self.wfile.write(b)
    def log_message(self, *a): pass

    def do_GET(self):
        p = urllib.parse.urlparse(self.path)
        try:
            if p.path == '/':
                self._send(200, HTML, 'text/html; charset=utf-8')
            elif p.path == '/api/list':
                self._send(200, {'ok': True, 'data': fetch_list()})
            elif p.path == '/api/issue':
                key = urllib.parse.parse_qs(p.query).get('key', [''])[0]
                self._send(200, {'ok': True, 'data': fetch_issue(key)})
            else:
                self._send(404, {'ok': False, 'err': 'not found'})
        except urllib.error.HTTPError as e:
            self._send(200, {'ok': False, 'err': f'JIRA HTTP{e.code} — Cookie 可能已过期，请在顶部更新 JSESSIONID'})
        except Exception as e:
            self._send(200, {'ok': False, 'err': str(e)})

    def do_POST(self):
        ln = int(self.headers.get('Content-Length', 0))
        raw = self.rfile.read(ln) if ln else b'{}'
        try: body = json.loads(raw.decode('utf-8'))
        except: body = {}
        p = urllib.parse.urlparse(self.path)
        try:
            if p.path == '/api/cookie':
                set_cookie(body.get('cookie', '')); self._send(200, {'ok': True})
            elif p.path == '/api/prepare':
                iss = fetch_issue(body['key'])
                fields = build_fields(iss['prefill'], iss['defaults'], body.get('form', {}))
                self._send(200, {'ok': True, 'fields': fields, 'status': iss['status'], 'steps': iss['steps']})
            elif p.path == '/api/submit':
                iss = fetch_issue(body['key'])
                fields = build_fields(iss['prefill'], iss['defaults'], body.get('form', {}))
                res = do_submit({'key': body['key'], 'target': body.get('target', 'Fixed'),
                                 'fields': fields, 'comment': body.get('comment', ''), 'image': body.get('image')})
                self._send(200, {'ok': True, 'result': res})
            else:
                self._send(404, {'ok': False, 'err': 'not found'})
        except urllib.error.HTTPError as e:
            self._send(200, {'ok': False, 'err': f'JIRA HTTP{e.code} {e.read().decode("utf-8","ignore")[:300]}'})
        except Exception as e:
            self._send(200, {'ok': False, 'err': str(e)})

HTML = r'''<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>JIRA 一键流转面板</title><style>
:root{--bg:#0f172a;--card:#1e293b;--line:#334155;--txt:#e2e8f0;--mut:#94a3b8;--acc:#38bdf8;--ok:#22c55e;--err:#ef4444}
*{box-sizing:border-box}body{margin:0;font-family:-apple-system,"PingFang SC","Microsoft YaHei",sans-serif;background:var(--bg);color:var(--txt);font-size:13px}
.top{display:flex;gap:10px;align-items:center;padding:10px 16px;background:#0b1220;border-bottom:1px solid var(--line);position:sticky;top:0;z-index:20}
.top h1{font-size:15px;margin:0;white-space:nowrap}.top .sp{flex:1}
#ck{background:var(--card);border:1px solid var(--line);border-radius:7px;padding:7px 10px;color:var(--txt);width:340px;font-family:ui-monospace,monospace;font-size:11px}
button{background:var(--acc);border:0;color:#0b1220;font-weight:700;border-radius:7px;padding:7px 13px;cursor:pointer}
button.gh{background:var(--card);color:var(--txt);border:1px solid var(--line);font-weight:600}
.wrap{display:flex;height:calc(100vh - 53px)}
.left{width:390px;border-right:1px solid var(--line);overflow:auto;flex-shrink:0}
#q{width:100%;background:#0b1220;border:0;border-bottom:1px solid var(--line);padding:10px 14px;color:var(--txt);font-size:13px;position:sticky;top:0}
.item{padding:9px 14px;border-bottom:1px solid #26334a;cursor:pointer}
.item:hover{background:#243146}.item.on{background:#1d3a5f}
.item .k{color:var(--acc);font-weight:700;font-family:ui-monospace,monospace}
.item .cat{display:inline-block;background:#3b1d1d;color:#fca5a5;border-radius:4px;padding:0 5px;font-size:10px;font-weight:700;margin-left:5px}
.item .st{float:right;font-size:10px;color:var(--mut);border:1px solid var(--line);border-radius:4px;padding:0 5px}
.item .sm{color:#cbd5e1;font-size:11px;margin-top:3px;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.right{flex:1;overflow:auto;padding:18px 22px}
.empty{color:var(--mut);text-align:center;margin-top:80px}
.hd{display:flex;align-items:center;gap:10px;margin-bottom:6px}.hd a{color:var(--acc);font-weight:700;text-decoration:none;font-family:ui-monospace,monospace;font-size:15px}
.badge{background:#1d3a5f;border:1px solid var(--acc);color:var(--acc);border-radius:5px;padding:1px 8px;font-size:11px}
.repro{background:#0b1220;border:1px solid var(--line);border-radius:8px;padding:10px 12px;white-space:pre-wrap;font-size:11px;color:#cbd5e1;max-height:130px;overflow:auto;margin-bottom:14px;font-family:ui-monospace,Menlo,monospace}
.pathbar{display:flex;gap:6px;align-items:center;margin:10px 0 16px;flex-wrap:wrap}
.pill{background:var(--card);border:1px solid var(--line);border-radius:20px;padding:4px 12px;font-size:11px;color:var(--mut)}
.pill.act{border-color:var(--acc);color:var(--acc)}.pill.done{background:#14321f;border-color:var(--ok);color:#86efac}
.step{background:var(--card);border:1px solid var(--line);border-left:3px solid var(--acc);border-radius:10px;padding:14px 16px;margin-bottom:14px}
.step h3{margin:0 0 10px;font-size:13px}.step h3 small{color:var(--mut);font-weight:400;margin-left:6px}
.grid{display:grid;grid-template-columns:150px 1fr;gap:9px 12px;align-items:center}
.grid label{color:var(--mut);text-align:right;font-size:12px}
.grid input,.grid textarea,.grid select{width:100%;background:#0b1220;border:1px solid var(--line);border-radius:6px;padding:7px 9px;color:var(--txt);font-size:12px}
.grid textarea{min-height:52px;resize:vertical}
.req{color:#fca5a5}
.cmt textarea{min-height:70px}
.drop{border:1.5px dashed var(--line);border-radius:8px;padding:14px;text-align:center;color:var(--mut);cursor:pointer;background:#0b1220}
.drop.hi{border-color:var(--acc);color:var(--acc)}
#thumb{max-height:120px;border-radius:6px;margin-top:8px;display:none}
.actions{display:flex;gap:10px;align-items:center;margin-top:6px;position:sticky;bottom:0;background:var(--bg);padding:12px 0}
.tgt{background:#0b1220;border:1px solid var(--line);border-radius:6px;padding:7px 9px;color:var(--txt)}
.big{font-size:14px;padding:10px 22px;background:var(--ok)}
#log{margin-top:14px}
.lg{display:flex;gap:8px;align-items:center;padding:6px 10px;border-radius:6px;margin-bottom:5px;font-size:12px;background:var(--card);border:1px solid var(--line)}
.lg.ok{border-left:3px solid var(--ok)}.lg.err{border-left:3px solid var(--err)}.lg.skip{border-left:3px solid var(--mut)}
.lg .t{font-weight:700;width:70px}.lg.ok .t{color:#86efac}.lg.err .t{color:#fca5a5}
.hint{color:var(--mut);font-size:11px;margin:2px 0 12px}
.warn{background:#3a2a0b;border:1px solid #a16207;color:#fde68a;border-radius:7px;padding:8px 11px;font-size:11px;margin-bottom:12px;display:none}
</style></head><body>
<div class="top"><h1>🩺 JIRA 一键流转面板</h1>
  <span class="hint" id="me"></span><span class="sp"></span>
  <input id="ck" placeholder="Cookie 失效时粘贴新 JSESSIONID 值"><button class="gh" onclick="saveCk()">更新Cookie</button>
  <button class="gh" onclick="loadList()">刷新列表</button>
</div>
<div class="wrap">
  <div class="left"><input id="q" placeholder="🔍 搜索 Key / 摘要 / 模块"><div id="list"></div></div>
  <div class="right" id="right"><div class="empty">← 左侧选一个 bug 开始</div></div>
</div>
<script>
let ALL=[],CUR=null,IMG=null;
async function api(u,m,b){const o={method:m||'GET'};if(b){o.headers={'Content-Type':'application/json'};o.body=JSON.stringify(b)}
  const ctl=new AbortController();const tid=setTimeout(()=>ctl.abort(),120000);o.signal=ctl.signal;
  try{const r=await fetch(u,o);return r.json()}finally{clearTimeout(tid)}}
async function saveCk(){const v=document.getElementById('ck').value.trim();if(!v)return;await api('/api/cookie','POST',{cookie:v});document.getElementById('ck').value='';loadList()}
async function loadList(){
  const box=document.getElementById('list');document.getElementById('me').textContent='加载中…';
  try{
    const r=await api('/api/list');
    if(!r.ok){box.innerHTML='<div class="hint" style="padding:14px;color:#fca5a5">'+esc(r.err)+'</div>';document.getElementById('me').textContent='加载失败';return}
    ALL=r.data;render(ALL);document.getElementById('me').textContent='共 '+ALL.length+' 条（含已闭环）';
  }catch(e){
    box.innerHTML='<div class="hint" style="padding:14px;color:#fca5a5">刷新失败：'+esc(String(e))+'<br>服务可能在重启，稍等几秒再点；或按 ⌘⇧R 硬刷新本页</div>';
    document.getElementById('me').textContent='加载失败';
  }
}
function render(rows){
  document.getElementById('list').innerHTML=rows.map(x=>`<div class="item" data-k="${x.key}" onclick="pick('${x.key}')">
    <span class="k">${x.key}</span>${x.cat?`<span class="cat">${x.cat}</span>`:''}<span class="st">${x.status}</span>
    <div class="sm">${esc(x.summary)}</div></div>`).join('');
}
function esc(s){return (s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
document.getElementById('q').oninput=e=>{const t=e.target.value.toLowerCase();
  render(ALL.filter(x=>(x.key+x.summary+x.module+x.status).toLowerCase().includes(t)))}
const STEPMETA={analyze:['analyze → ANALYZING','分析'],repair:['repair → Repairing','修复'],fix:['fix → Fixed','已修复']};
async function pick(key){
  document.querySelectorAll('.item').forEach(e=>e.classList.toggle('on',e.dataset.k===key));
  const R=document.getElementById('right');R.innerHTML='<div class="empty">加载中…</div>';
  const r=await api('/api/issue?key='+key);if(!r.ok){R.innerHTML='<div class="empty">'+r.err+'</div>';return}
  CUR=r.data;IMG=null;
  const d=CUR.defaults,p=CUR.prefill;const steps=CUR.steps;
  const path=STATUS_ORDER_UI(CUR.status);
  let h=`<div class="hd"><a href="${BASE}${key}" target="_blank">${key}</a>
    <span class="badge">当前 ${CUR.status}</span></div>
    <div class="hint">${esc(CUR.summary)}</div>
    ${CUR.repro?`<div class="repro">${esc(CUR.repro)}</div>`:''}
    <div class="pathbar">${path}</div>`;
  if(!CUR.linear){h+=`<div class="warn" style="display:block">当前状态“${CUR.status}”不在 analyze→repair→fix 线性链上，只能用“仅加复测评论”。</div>`}
  // analyze
  if(steps.includes('analyze')) h+=`<div class="step"><h3>① analyze <small>→ ANALYZING（必填项保持现值即可）</small></h3>
    <div class="grid">
    <label>优先级</label><input value="${p.priority_name}" disabled>
    <label>Components</label><input value="${esc(p.comp_val)}" disabled>
    <label>问题责任方</label><input value="${esc(p.resp_val)}" disabled>
    <label>进展</label><input id="analyze_progress" placeholder="选填">
    <label><span class="req">*</span>原因分析</label><textarea id="analyze_cause">${esc(d.cause||'')}</textarea>
    <label><span class="req">*</span>Root Cause分类</label><select id="root_cause">${['云端问题','产品需求定义问题','软件开发实施基线未拉齐','UIUE设计问题','人员能力问题','基线未拉齐','整车EFL基线目标未拉齐','供应商问题'].map(o=>`<option${o=='云端问题'?' selected':''}>${o}</option>`).join('')}</select>
    </div></div>`;
  // repair
  if(steps.includes('repair')) h+=`<div class="step"><h3>② repair <small>→ Repairing</small></h3>
    <div class="grid">
    <label><span class="req">*</span>长期解决措施</label><textarea id="long_fix">${d.long_fix}</textarea>
    <label><span class="req">*</span>计划完成时间</label><input id="plan_date" value="${d.plan_date}" placeholder="YYYY-MM-DD">
    <label><span class="req">*</span>目标修复基线</label><select id="baseline">${['P','P bugfix','PP','PPV','EP','SOP','SOP bugfix'].map(o=>`<option${o==d.baseline?' selected':''}>${o}</option>`).join('')}</select>
    <label><span class="req">*</span>解决措施责任人</label><input id="owner" value="${d.owner}">
    <label>短期解决措施</label><input id="short_fix" placeholder="选填">
    </div></div>`;
  // fix
  if(steps.includes('fix')) h+=`<div class="step"><h3>③ fix <small>→ Fixed</small></h3>
    <div class="grid">
    <label><span class="req">*</span>实际完成时间</label><input id="done_date" value="${d.done_date}" placeholder="YYYY-MM-DD">
    <label><span class="req">*</span>修复的软件版本</label><input id="sw_ver" value="${d.sw_ver}">
    <label><span class="req">*</span>修复的零件版本</label><input id="part_ver" value="${d.part_ver}">
    <label>EWO编号(PQCP)</label><input id="ewo" placeholder="选填">
    </div></div>`;
  // 复测评论+图片
  h+=`<div class="step" style="border-left-color:#a855f7"><h3>④ 复测评论 + 图片 <small>（加到最后一步的评论里）</small></h3>
    <div class="cmt"><textarea id="comment" style="width:100%" placeholder="复测结论，如：复测通过，见附图"></textarea></div>
    <div class="drop" id="drop" onclick="document.getElementById('file').click()">📎 点此选文件 / 拖拽 / 直接 ⌘V 粘贴 复测截图</div>
    <input type="file" id="file" accept="image/*" style="display:none">
    <img id="thumb"><div class="hint" style="margin-top:6px">支持：点击选文件 · 拖拽 · <b style="color:var(--acc)">直接 ⌘V / Ctrl+V 粘贴截图</b></div></div>`;
  // 提交
  h+=`<div class="actions">
    <label class="hint">流转到：</label>
    <select class="tgt" id="target">
      <option value="Fixed" selected>Fixed（走完三步·推荐）</option>
      <option value="Repairing">Repairing（到修复中）</option>
      <option value="ANALYZING">ANALYZING（仅分析）</option>
      <option value="comment_only">仅加复测评论(不流转)</option>
    </select>
    <button class="big" onclick="submit()">🚀 确认并提交</button>
    <span class="hint" id="ing"></span>
  </div><div id="log"></div>`;
  R.innerHTML=h;
  bindDrop();
}
function STATUS_ORDER_UI(cur){const seq=['DRAFT','ANALYZING','Repairing','Fixed'];const ci=seq.indexOf(cur);
  return seq.map((s,i)=>`<span class="pill ${i<ci?'done':i==ci?'act':''}">${s}</span>`+(i<seq.length-1?'<span style="color:#475569">→</span>':'')).join('')}
function loadImage(file){if(!file)return;const th=document.getElementById('thumb'),drop=document.getElementById('drop');
  const rd=new FileReader();rd.onload=()=>{IMG={name:file.name||('paste-'+Date.now()+'.png'),b64:rd.result.split(',')[1]};
    if(th){th.src=rd.result;th.style.display='block'}if(drop){drop.textContent='✅ '+IMG.name+'（点击更换 / 也可重新⌘V粘贴）'}};rd.readAsDataURL(file)}
function bindDrop(){
  const f=document.getElementById('file'),drop=document.getElementById('drop');
  f.onchange=e=>loadImage(e.target.files[0]);
  ;['dragover','dragenter'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.add('hi')}));
  ;['dragleave','drop'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.remove('hi')}));
  drop.addEventListener('drop',e=>loadImage(e.dataTransfer.files[0]));
}
// 全局粘贴：截图后任意位置 ⌘V/Ctrl+V 即可（仅当右侧表单已打开时生效）
document.addEventListener('paste',e=>{if(!document.getElementById('drop'))return;
  const items=(e.clipboardData||{}).items;if(!items)return;
  for(const it of items){if(it.type&&it.type.indexOf('image')===0){const f=it.getAsFile();if(f){e.preventDefault();loadImage(f)}return}}});
function gv(id){const el=document.getElementById(id);return el?el.value:''}
async function submit(){
  if(!CUR)return;
  const target=gv('target');
  const form={analyze_progress:gv('analyze_progress'),analyze_cause:gv('analyze_cause'),root_cause:gv('root_cause'),
    long_fix:gv('long_fix'),plan_date:gv('plan_date'),baseline:gv('baseline'),owner:gv('owner'),short_fix:gv('short_fix'),
    done_date:gv('done_date'),sw_ver:gv('sw_ver'),part_ver:gv('part_ver'),ewo:gv('ewo')};
  const comment=gv('comment');
  const tmap={Fixed:'analyze→repair→fix 三步',Repairing:'到 Repairing',ANALYZING:'到 ANALYZING','comment_only':'仅加评论'};
  if(!confirm(`确认对 ${CUR.key} 执行：${tmap[target]}${comment?'\n评论：'+comment:''}${IMG?'\n附图：'+IMG.name:''}\n\n这是真实写入 JIRA 的操作。`))return;
  document.getElementById('ing').textContent='提交中…';
  const box=document.getElementById('log');box.innerHTML='';
  try{
    const r=await api('/api/submit','POST',{key:CUR.key,target,form,comment,image:IMG});
    document.getElementById('ing').textContent='';
    if(!r.ok){box.innerHTML=`<div class="lg err"><span class="t">失败</span>${esc(r.err||'未知错误')}</div>`;return}
    box.innerHTML=r.result.log.map(([t,s,m])=>`<div class="lg ${s}"><span class="t">${t}</span>${s=='ok'?'✅':s=='err'?'❌':'⏭'} ${esc(m)}</div>`).join('');
    if(r.result.log.length && r.result.log.every(l=>l[1]!='err')){setTimeout(loadList,900)}
  }catch(e){
    document.getElementById('ing').textContent='';
    box.innerHTML=`<div class="lg err"><span class="t">异常</span>请求失败：${esc(String(e))}（Cookie 可能过期→点右上角"更新Cookie"，或服务已停）</div>`;
  }
}
const BASE='__BASE__';
loadList();
</script></body></html>'''.replace('__BASE__', BASE + '/browse/')

def daemonize():
    """双 fork 脱离控制终端与会话，成为独立守护进程，避免被父会话回收。"""
    if os.fork() > 0: os._exit(0)
    os.setsid()
    if os.fork() > 0: os._exit(0)
    logf = open('/tmp/jira_panel.log', 'a')
    os.dup2(logf.fileno(), 1); os.dup2(logf.fileno(), 2)
    devnull = open(os.devnull, 'r')
    os.dup2(devnull.fileno(), 0)

def main():
    if os.environ.get('JIRA_PANEL_DAEMON'):
        daemonize()
    srv = ThreadingHTTPServer(('127.0.0.1', PORT), H)
    url = f'http://localhost:{PORT}'
    print(f'\n  🩺 JIRA 一键流转面板已启动 →  {url}')
    print(f'  Cookie 失效时在页面顶部粘贴新的 JSESSIONID 即可\n  Ctrl+C 停止\n')
    if not os.environ.get('JIRA_PANEL_NOOPEN'):
        threading.Timer(0.8, lambda: webbrowser.open(url)).start()
    try: srv.serve_forever()
    except KeyboardInterrupt: print('\n已停止')

if __name__ == '__main__':
    main()
