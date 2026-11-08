from pathlib import Path
import re, math
from PIL import Image, ImageDraw, ImageFont
from docx import Document
from docx.shared import Inches, Pt, Cm, RGBColor
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

BASE = Path(__file__).resolve().parent
MD = BASE.parent / 'PRD-上汽定时任务与触发器整体流程-v01.md'
FONT = '/System/Library/Fonts/STHeiti Light.ttc'
BOLD = '/System/Library/Fonts/STHeiti Medium.ttc'
def font(size, bold=False): return ImageFont.truetype(BOLD if bold else FONT, size)
NAVY='#17354c'; BLUE='#e8f2f8'; GREEN='#e9f5ef'; ORANGE='#fff1df'; GREY='#f2f4f6'
def wrap(draw, s, f, width):
    rows=[]
    for para in s.split('\n'):
        row=''
        for ch in para:
            if row and draw.textlength(row+ch,font=f)>width:
                rows.append(row);row=ch
            else: row+=ch
        rows.append(row)
    return rows
def block(draw, rect, title, desc='', fill=BLUE):
    x,y,w,h=rect
    draw.rounded_rectangle((x,y,x+w,y+h),radius=20,fill=fill,outline='#aebfcb',width=2)
    f=font(34,True); rows=wrap(draw,title,f,w-50)
    dy=y+20
    for r in rows: draw.text((x+25,dy),r,font=f,fill=NAVY);dy+=44
    if desc:
        f=font(28)
        for r in wrap(draw,desc,f,w-50): draw.text((x+25,dy+8),r,font=f,fill='#4a6272');dy+=36
def arrow(draw,x1,y1,x2,y2):
    draw.line((x1,y1,x2,y2),fill='#648699',width=5)
    ang=math.atan2(y2-y1,x2-x1);n=18
    draw.polygon([(x2,y2),(x2-n*math.cos(ang-.5),y2-n*math.sin(ang-.5)),(x2-n*math.cos(ang+.5),y2-n*math.sin(ang+.5))],fill='#648699')
def header(draw,title,subtitle,w):
    draw.text((55,35),title,font=font(52,True),fill=NAVY)
    for i,row in enumerate(wrap(draw,subtitle,font(29),w-110)): draw.text((55,108+i*38),row,font=font(29),fill='#536a78')

im=Image.new('RGB',(2100,1480),'white'); d=ImageDraw.Draw(im)
header(d,'上汽任务业务架构：三条入口，两类等待','归属依据：上汽 SOR、DNA-530 与用户截图；部署版本、结果回写和异常规则另行确认。',2100)
lanes=[
 ('纯定时任务', [('用户提出未来任务','十分钟后关闭座椅加热',GREY),('Planner → 动态 Advisor','理解目标、解析时间与动作',BLUE),('弋途定时能力','保存时间规则；到点唤醒',ORANGE),('动态 Advisor','收到到点事件，提交执行建议',GREEN),('Planner → 工具 / 客户端','结合当前车况执行并反馈',BLUE)]),
 ('用户条件任务', [('用户提出条件任务','副驾上车时提醒系安全带',GREY),('Planner → 动态 Advisor','解析条件；向豆包注册场景',BLUE),('豆包条件触发器','接收车态信号；判断条件',ORANGE),('动态 Advisor','收到条件回调，提交执行建议',GREEN),('Planner → 工具 / 客户端','结合当前车况执行并反馈',BLUE)]),
 ('后台预置场景', [('产品人员配置场景','选择上汽渠道、条件与动作',GREY),('触发器后台场景配置','指定适用范围、下游和频控',BLUE),('豆包条件触发器','接收车态信号；判断条件',ORANGE),('场景配置的下游','例如指定的主动服务 Advisor',GREEN),('主动服务结果','按对应场景的执行链路呈现',BLUE)])]
for c,(title,items) in enumerate(lanes):
    x=55+c*680
    d.text((x,190),title,font=font(39,True),fill=NAVY)
    for j,(t,desc,fill) in enumerate(items):
        y=255+j*204
        block(d,(x,y,625,160),t,desc,fill)
        if j<4:arrow(d,x+312,y+166,x+312,y+198)
d.rounded_rectangle((55,1303,2040,1415),radius=15,fill=GREEN)
d.text((85,1324),'任务中心：承载用户任务的接入、状态、取消与记录；需与动态 Advisor 联动。',font=font(33),fill=NAVY)
d.text((85,1370),'后台预置场景不默认等于一条个人定时任务；条件频控不等于循环闹钟。',font=font(29),fill='#4a6272')
im.save(BASE/'01-业务架构.png')

def flow(name,title,subtitle,steps,foot):
    width=1600;height=240+len(steps)*180+155
    im=Image.new('RGB',(width,height),'white');d=ImageDraw.Draw(im)
    header(d,title,subtitle,width)
    for i,(t,desc,fill) in enumerate(steps):
        y=220+i*180
        block(d,(80,y,1440,138),f'{i+1}. {t}',desc,fill)
        if i<len(steps)-1:arrow(d,800,y+144,800,y+174)
    y=240+len(steps)*180
    for j,row in enumerate(wrap(d,foot,font(28),1440)):d.text((80,y+j*39),row,font=font(28),fill='#536a78')
    im.save(BASE/name)
flow('02-纯定时流程.png','纯定时任务：由弋途等待到点','产品流程；创建顺序、状态回写与取消防重需由各方对齐，不代表实车验收。',[
 ('Planner 识别未来任务','用户：十分钟后关闭主驾座椅加热；必要时澄清对象和时间。',BLUE),
 ('动态 Advisor 解析并登记','保存时间规则和执行内容；接入任务中心，登记弋途定时能力。',BLUE),
 ('返回创建结果','必要登记成功才展示可执行；失败需反馈并避免残留任务。',GREEN),
 ('弋途定时能力等待 → 到点','发出本轮唤醒；纯定时不向豆包条件触发器注册闹钟。',ORANGE),
 ('动态 Advisor 提交 advice','确认目标仍有效，向 Planner 提交本轮执行建议。',GREEN),
 ('Planner 判断并调用执行','使用当前车况；必要时确认；调用车控或安排提醒。',BLUE),
 ('根据真实结果更新任务','成功 / 失败 / 无需执行 / 错过分开；到点不是动作完成。',GREEN),
 ('收尾或等待下一轮','一次性结束；循环由弋途继续调度；取消须联动清理。',ORANGE)
],'端侧提醒与断网控车是不同能力；端云落点、下电与补发策略待确认。')
flow('03-条件任务流程.png','条件任务：豆包判断信号，弋途推进目标','用户任务注册与条件判定分开；后台预置可复用判定能力，但按自身配置选择下游。',[
 ('Planner 接收条件任务','用户：副驾上车时提醒他系安全带；创建后续目标。',BLUE),
 ('动态 Advisor 解析并校验','明确上车事件、座位和动作；核对上汽支持的条件。',BLUE),
 ('动态 Advisor 注册豆包条件场景','指定条件、适用车辆及回调；保存任务与场景关联。',GREEN),
 ('车辆上报 → 豆包条件判定','按注册规则检查变化与当前状态；命中后发起通知。',ORANGE),
 ('条件回调 → 动态 Advisor','回调表示条件满足；找到目标并检查任务仍有效。',GREEN),
 ('动态 Advisor → Planner','提交执行建议；Planner 根据当前信息安排播报或动作。',BLUE),
 ('结果记录与订阅收尾','一次性结束后清理监听；循环继续；取消同时清理关联场景。',GREEN)
],'条件注册失败不等于任务已生效；触发器回调成功不等于用户已听到提醒。')

def plain(s):
    s=re.sub(r'\[([^\]]+)\]\(([^)]+)\)',lambda m:m.group(1)+' ('+m.group(2)+')',s)
    return s.replace('**','').replace('`','')
doc=Document();sec=doc.sections[0]
sec.top_margin=Cm(1.7);sec.bottom_margin=Cm(1.7);sec.left_margin=Cm(1.65);sec.right_margin=Cm(1.65)
styles=doc.styles
for style in ['Normal','Heading 1','Heading 2','Heading 3','Title']:
    styles[style].font.name='Arial'
    styles[style]._element.rPr.rFonts.set(qn('w:eastAsia'),'苹方')
styles['Normal'].font.size=Pt(10.5)
styles['Normal'].paragraph_format.space_after=Pt(7)
styles['Normal'].paragraph_format.line_spacing=1.18
for n,size in [('Title',24),('Heading 1',17),('Heading 2',14),('Heading 3',12)]:
    styles[n].font.size=Pt(size);styles[n].font.color.rgb=RGBColor.from_string('17354C')
    styles[n].paragraph_format.keep_with_next=True
doc.core_properties.title='上汽定时任务与触发器整体流程及产品定义'
doc.core_properties.subject='按赛力斯参考结构重写的上汽产品评审稿'
doc.core_properties.author='王泽民'
lines=MD.read_text().splitlines();i=0
while i<len(lines):
    line=lines[i].strip()
    if not line:i+=1;continue
    if line.startswith('|'):
        rows=[]
        while i<len(lines) and lines[i].strip().startswith('|'):
            cells=[c.strip() for c in lines[i].strip().strip('|').split('|')]
            if not all(re.fullmatch(r':?-+:?',c.replace(' ','')) for c in cells): rows.append(cells)
            i+=1
        table=doc.add_table(rows=1,cols=len(rows[0]));table.style='Light Shading Accent 1'
        for c,t in zip(table.rows[0].cells,rows[0]):c.text=plain(t)
        repeat=OxmlElement('w:tblHeader');table.rows[0]._tr.get_or_add_trPr().append(repeat)
        for vals in rows[1:]:
            for c,t in zip(table.add_row().cells,vals):c.text=plain(t)
        for row in table.rows:
            for c in row.cells:
                for p in c.paragraphs:
                    p.paragraph_format.space_after=Pt(4)
                    for run in p.runs:run.font.size=Pt(8.5)
        doc.add_paragraph();continue
    image=re.fullmatch(r'!\[([^\]]*)\]\(([^)]+)\)',line)
    if image:
        doc.add_picture(str(MD.parent/image.group(2)),width=Inches(6.6))
        p=doc.add_paragraph(image.group(1));p.paragraph_format.space_after=Pt(10)
    elif line.startswith('# '):doc.add_paragraph(line[2:],'Title')
    elif line.startswith('## '):doc.add_heading(line[3:],1)
    elif line.startswith('### '):doc.add_heading(line[4:],2)
    elif line.startswith('#### '):doc.add_heading(line[5:],3)
    elif re.match(r'^\d+\. ',line):doc.add_paragraph(plain(line))
    else:
        p=doc.add_paragraph()
        for j,part in enumerate(re.split(r'\*\*(.*?)\*\*',line)):
            run=p.add_run(plain(part));run.bold=bool(j%2)
    i+=1
footer=sec.footer.paragraphs[0]
footer.text='上汽定时任务 / 触发器产品定义 · v01 · 2026-10-13  |  '
field=OxmlElement('w:fldSimple');field.set(qn('w:instr'),'PAGE');footer._p.append(field)
out=MD.with_suffix('.docx');doc.save(out)
check=Document(out)
assert len(check.inline_shapes)==3
assert len(check.tables)==9
assert any('任务变更策略' in p.text for p in check.paragraphs)
print({'docx':str(out),'paragraphs':len(check.paragraphs),'tables':len(check.tables),'images':len(check.inline_shapes),'bytes':out.stat().st_size})
