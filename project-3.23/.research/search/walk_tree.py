import subprocess, json, time, sys
SPACE="7554961122303098899"
def node_list(parent=None):
    cmd=["lark-cli","wiki","+node-list","--space-id",SPACE,"--as","user","--page-all","--format","json"]
    if parent: cmd+=["--parent-node-token",parent]
    for attempt in range(3):
        p=subprocess.run(cmd,capture_output=True,text=True)
        try:
            d=json.loads(p.stdout)
            return d.get("data",{}).get("nodes",d.get("data",{}).get("items",[]))
        except Exception:
            time.sleep(2)
    return []
rows=[]
def walk(parent=None, depth=0):
    for n in node_list(parent):
        rows.append({
            "title":n.get("title"),
            "node_token":n.get("node_token"),
            "obj_token":n.get("obj_token"),
            "obj_type":n.get("obj_type"),
            "has_child":n.get("has_child"),
            "parent_node_token":n.get("parent_node_token") or "",
            "depth":depth,
            "url":f"https://bytedance.larkoffice.com/wiki/{n.get('node_token')}",
            "edit_time":n.get("obj_edit_time") or n.get("edit_time") or "",
        })
        if n.get("has_child"):
            walk(n.get("node_token"), depth+1)
walk()
with open("wiki_tree.jsonl","w") as f:
    for r in rows: f.write(json.dumps(r,ensure_ascii=False)+"\n")
print("TOTAL NODES:", len(rows))
from collections import Counter
print("types:", Counter(r["obj_type"] for r in rows))
