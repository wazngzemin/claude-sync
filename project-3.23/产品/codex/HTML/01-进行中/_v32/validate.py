import json,re,sys,os
ROOT=os.path.dirname(os.path.abspath(__file__))
pid=sys.argv[1]
inp=json.load(open(f"{ROOT}/inputs/page_{pid}.json",encoding="utf-8"))
path=f"{ROOT}/out/{pid}.json"
if not os.path.exists(path):
    print(json.dumps({"ok":False,"error":"missing out file"},ensure_ascii=False)); sys.exit(1)
try:
    out=json.load(open(path,encoding="utf-8"))
except Exception as e:
    print(json.dumps({"ok":False,"error":f"json parse: {e}"},ensure_ascii=False)); sys.exit(1)
issues=[];warn=[]
def add(m): issues.append(m)
if out.get("id")!=pid: add(f"id mismatch {out.get('id')} != {pid}")
want=[l["id"] for l in inp["lessons"]]
got=[l.get("id") for l in out.get("lessons") or []]
if want!=got: add(f"lesson ids mismatch: want {want} got {got}")
intro=out.get("intro") or []
if not(2<=len(intro)<=5): add(f"intro paragraphs {len(intro)} not 3-5")
for p in intro:
    if not(110<=len(p)<=420): add(f"intro para len {len(p)}")
for l in out.get("lessons") or []:
    ps=l.get("paragraphs") or []
    if not(2<=len(ps)<=12): add(f"lesson {l.get('id')} paragraphs {len(ps)}")
    for p in ps:
        if not(110<=len(p)<=520): warn.append(f"lesson {l.get('id')} para len {len(p)}")
gb=(out.get("guides") or {}).get("base") or {}
gps=gb.get("paragraphs") or []
if not(5<=len(gps)<=10): add(f"guides.base paragraphs {len(gps)} not 6-12")
for p in gps:
    if not(110<=len(p)<=460): warn.append(f"guide para len {len(p)}")
close=out.get("closing") or []
if not(1<=len(close)<=4): add(f"closing {len(close)}")
alltext="\n".join(intro+gps+close+[p for l in out.get("lessons") or [] for p in l.get("paragraphs") or []])
total=len(alltext)
if not(4500<=total<=16000): add(f"total chars {total} not 4500-16000")
# forbidden meta / labels
for pat in ["本节","本文","接下来我们","下面来看","值得注意的是","我们可以看到","是什么：","为何需要","不是什么：","车内例子：","用户感知：","系统决定：","明确不做什么：","这张图怎么看","逐个节点"]:
    if pat in alltext: add(f"banned phrase: {pat}")
# parentheses
citefree=re.sub(r"(?:SE|EV|EL|DR|V|R|M|C|D|E|O|I|W|F|K|T|G|L|S|P|A|H|B|U)\d{1,2}（[^）]{1,40}）","",alltext)
for m in re.finditer(r"（([^）]{0,120})）",citefree):
    if len(m.group(1))>14: add(f"long paren: （{m.group(1)[:40]}…）")
    if re.search(r"[A-Za-z]",m.group(1)) and re.search(r"[\u4e00-\u9fa5]",m.group(1)): add(f"en-zh gloss: （{m.group(1)}）")
# repeated identical gloss
glosses=re.findall(r"（([^）]{2,14})）",alltext)
for g in set(glosses):
    if glosses.count(g)>=3 and re.search(r"[A-Za-z]",g): add(f"gloss repeated {glosses.count(g)}x: （{g}）")
# node citation
nodes=inp["node_titles"]
cite=re.findall(r"(?<![A-Za-z])((?:SE|EV|EL|DR|V|R|M|C|D|E|O|I|W|F|K|T|G|L|S|P|A|H|B|U)\d{1,2})（([^）]{1,40})）",alltext)
seen=set()
for nid,name in cite:
    if nid not in nodes: add(f"unknown node id {nid}"); continue
    real=nodes[nid]["title"]
    def norm(x): return re.sub(r"[A-Za-z]","",re.sub(r"（[^）]*）","",x)).replace("：","").replace(":","").replace(" ","").strip()
    a,b=set(norm(name)),set(norm(real))
    if not a or not b or len(a&b)/min(len(a),len(b))<0.6: add(f"node name mismatch {nid}: cited「{name}」 real「{real}」")
    seen.add(nid)
if len(seen)<6: add(f"node citations only {len(seen)} (<6)")
# digits sanity: any number must appear in v15 or input
v15="\n".join((inp.get("v15") or {}).values())
cur=json.dumps(inp.get("lessons"),ensure_ascii=False)
nums=set(re.findall(r"\d+(?:\.\d+)?\s*(?:毫秒|秒|分钟|轮|次|%|条|个|米)",alltext))
for n in nums:
    key=n.replace(" ","")
    if key not in v15.replace(" ","") and key not in cur.replace(" ",""):
        warn.append(f"number not found in sources: {n}")
print(json.dumps({"ok":not issues,"page":pid,"total_chars":total,"lessons":len(got),"guide_paras":len(gps),"node_cites":len(seen),"issues":issues,"warnings":warn[:20]},ensure_ascii=False,indent=1))
sys.exit(0 if not issues else 1)
