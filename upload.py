#!/usr/bin/env python3
"""与面板共享上传逻辑；--pending 只上传已有待同步快照。"""
import importlib.util, sys, json, fcntl
from pathlib import Path
root = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("sync_server", root / "sync-server.py")
server = importlib.util.module_from_spec(spec)
spec.loader.exec_module(server)
Path(server.STATE_DIR).mkdir(exist_ok=True)
with open(Path(server.STATE_DIR) / "upload.lock", "w") as lock:
    fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
    try:
        if "--pending" in sys.argv:
            results = []
            server._git_push_result(results)
        else:
            items = [{"scope": scope} for scope in server.SCOPES]
            items += [{"scope": "file", "rel": key} for key in server.FILES]
            items.append({"scope": "memories"})
            results = server.run_sync(items, "push", all_items=True)
        print(json.dumps(results, ensure_ascii=False, indent=2))
        sys.exit(1 if any(x["status"] == "fail" for x in results) else 0)
    except Exception as exc:
        server.write_cloud_state("fail", str(exc), "push", server._head_sha())
        print(str(exc), file=sys.stderr)
        sys.exit(1)
