import json,os,re,sys,time,shutil
ROOT="/Users/bytedance/Desktop/3.23/产品/codex/HTML/01-进行中"
HTML=os.path.join(ROOT,"豆包汽车-业务学习站-v31-工作副本.html")
s=open(HTML,encoding="utf-8").read()
start=s.index("const DATA=")+len("const DATA=")
depth=0
for j in range(start,len(s)):
    if s[j]=='{': depth+=1
    elif s[j]=='}':
        depth-=1
        if depth==0: break
DATA=json.loads(s[start:j+1])
outdir=os.path.join(ROOT,"_v32/out")
done=[]
for f in sorted(os.listdir(outdir)):
    if not f.endswith(".json"): continue
    o=json.load(open(os.path.join(outdir,f),encoding="utf-8"))
    pid=o["id"]
    pg=[x for x in DATA["pages"] if x["id"]==pid]
    if not pg:
        print("skip unknown page",pid); continue
    pg=pg[0]
    t=pg.setdefault("teaching",{})
    t["intro"]=o["intro"]
    t["lessons"]=o["lessons"]
    g=t.setdefault("guides",{})
    base=g.setdefault("base",{})
    base["title"]=o["guides"]["base"]["title"]
    base["paragraphs"]=o["guides"]["base"]["paragraphs"]
    base["sections"]=[]
    t["closing"]=o["closing"]
    done.append(pid)
meta=DATA.setdefault("meta",{})
meta["previousVersion"]=meta.get("version")
meta["version"]="v32"
meta["teachingEditedAt"]="v32-rewrite-"+time.strftime("%Y%m%d%H%M%S")
payload=json.dumps(DATA,ensure_ascii=False,separators=(",",":"))
news=s[:start]+payload+s[j+1:]
bak=HTML+".bak-v32-before-"+time.strftime("%Y%m%d%H%M%S")
shutil.copy2(HTML,bak)
open(HTML,"w",encoding="utf-8").write(news)
print(json.dumps({"merged":done,"count":len(done),"backup":bak,"size":len(news)},ensure_ascii=False))
