"""将同源页面讲解转换为飞书正文；原详细规格不覆盖，保留为附录。"""
from pathlib import Path
import html
import re

root = Path(__file__).resolve().parent
source = root / '触发器配置平台-页面讲解与精简评审稿-v06.md'
outdir = Path('/Users/bytedance/Desktop/3.23/产品/codex/HTML/01-进行中')

def inline(s):
    s = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', s)
    s = html.escape(s)
    s = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', s)
    return re.sub(r'`([^`]+)`', r'<code>\1</code>', s)

parts = ['<h1>评审主稿：先看这六页</h1>',
         '<p>可点击原型见下方 HTML 附件：下载后用浏览器打开。P1—P6 截图均来自同版 HTML；页面内容、热点编号和讲解一一对应。所有保存、校验和运行结果均为本地演示，不提交真实配置。</p>',
         '<p>【HTML附件位置：交互原型】</p>']
lines = source.read_text().splitlines()
for line in lines:
    line = line.strip()
    if not line or line.startswith('# '):
        continue
    image = re.match(r'!\[P([1-6])[^\]]*\]\([^)]+\)', line)
    if image:
        parts.append('<p>【截图位置：P'+image[1]+'】</p>')
        continue
    m = re.match(r'(#{2,6})\s+(.*)', line)
    if m:
        level = len(m[1])
        parts.append(f'<h{level}>'+inline(m[2])+f'</h{level}>')
    elif line.startswith('|'):
        if not re.match(r'\|\s*---', line):
            cells = [x.strip() for x in line.strip('|').split('|')]
            if cells[0] != '任务':
                parts.append('<p><strong>'+inline(cells[0])+'</strong>：正向——'+inline(cells[1])+'；反向／未知——'+inline(cells[2])+'</p>')
    else:
        parts.append('<p>'+inline(line)+'</p>')
parts += ['<h1>详细规格附录（备用）</h1>',
          '<p>以下保留原架构画板、字段及验收细节，供研发查阅，不作为本轮逐页演讲正文。旧静态原型编号与带卡编辑项以主稿 P1—P6 为准；本期带按钮 Action 只填写建议 Query，确认／取消自动提供，不要求手填 enabled、按钮协议、卡片正文或 TTS。原型中的演示值不替代业务阈值确认。</p>',
          '<h2>一、背景与目标</h2>']
target = outdir / '触发器配置平台-飞书主稿粘贴-v06.html'
target.write_text('<html><body>'+''.join(parts)+'</body></html>')
print(target)
