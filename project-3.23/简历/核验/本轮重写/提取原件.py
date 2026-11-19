from pathlib import Path
import json,re,html
root=Path('/Users/bytedance/Desktop/3.23/简历/research/feishu')
out=Path('/Users/bytedance/Desktop/3.23/简历/核验/本轮重写')
names=['Director对话推理引擎PRD','主动服务onepage补充系统预设任务','触发器配置平台改造PRD','PRD-系统预设任务配置平台与端云交互框架','AI汽车后台权限管理PRD','后台平台化-v23-文字记录','planner动态示例后台PRD','sls系统预设任务需求外审','端侧自闭环需求任务拆解']
def body(data):
    if isinstance(data,dict):
        for key in ['markdown','content']:
            if isinstance(data.get(key),str):
                s=data[key]
                if s.startswith('{'):
                    try:return body(json.loads(s))
                    except ValueError:pass
                return s
        for key in ['data','document','linked_documents']:
            if key in data:
                value=body(data[key])
                if value:return value
    if isinstance(data,list):
        for item in data:
            value=body(item)
            if value:return value
    return ''
for name in names:
    text=body(json.loads((root/(name+'.json')).read_text(encoding='utf-8')))
    text=re.sub(r'</(?:lark-td|td|th)>',' | ',text)
    text=re.sub(r'</(?:lark-tr|tr|li|p)>','\n',text)
    text=re.sub(r'<br\s*/?>',' / ',text)
    text=re.sub(r'<[^>]*>','',text)
    text=html.unescape(text)
    text='\n'.join(line.strip() for line in text.splitlines() if line.strip())
    p=out/(name+'-可读原文.txt')
    p.write_text(text,encoding='utf-8')
    print(name,len(text),len(text.splitlines()))
