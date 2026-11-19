import json,pathlib,subprocess
ROOT=pathlib.Path(__file__).resolve().parent
THEMES=['1. 身份','2. 记忆分层','3. 记忆怎样产生','4. 记忆怎样被用','5. 记忆怎样被改','6. 隐私与权限','7. 记忆和车上功能的同步','8. 评测、测试、真实问题和排查','9. 演进','车型差异','指标与观测','排期与现状','资料冲突与证据缺口']
def save(n,source,note,facts=(),cases=(),components=()):
 b={'source':source,'read_note':note,'facts':[{'theme':THEMES[t-1],'text':v,'source':source+':L'+line} for t,v,line in facts],'cases':[{'title':title,'text':v,'source':source+':L'+line} for title,v,line in cases],'components':[{'title':title,'text':v,'source':source+':L'+line} for title,v,line in components]}
 p=ROOT/f'batch-supp-{n:02d}.json';p.write_text(json.dumps(b,ensure_ascii=False,indent=2));subprocess.run(['python3','-I',str(ROOT/'append_research.py'),str(p)],check=True)
