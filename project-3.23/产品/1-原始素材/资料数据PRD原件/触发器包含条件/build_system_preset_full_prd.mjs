import fs from 'node:fs';
import path from 'node:path';

const source = '/Users/bytedance/Desktop/3.23/产品/codex/HTML/02-已交付/系统预设任务端云一体架构-v05.html';
const output = '/Users/bytedance/Desktop/3.23/产品/codex/HTML/01-进行中/系统预设任务端云一体完整PRD-v01.html';

let html = fs.readFileSync(source, 'utf8');

html = html
  .replace(/<link rel="preconnect"[\s\S]*?<\/style>/, (block) => block
    .replace(/\s*<link rel="preconnect"[^>]*>\s*/g, '\n')
    .replace(/\s*<link href="https:\/\/fonts\.googleapis\.com[^>]*>\s*/g, '\n')
    .replace('</style>', String.raw`
    .toolbar{position:fixed;right:18px;bottom:18px;z-index:12;display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;max-width:430px}
    .toolbar button{appearance:none;border:1px solid #385475;background:rgba(10,24,42,.96);color:#dceafd;border-radius:10px;padding:9px 12px;font:700 11px/1 "JetBrains Mono","PingFang SC",sans-serif;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.25)}
    .toolbar button:hover{border-color:var(--cyan);color:white}.copy-btn{float:right;margin:-4px 0 8px 12px;appearance:none;border:1px solid #31546f;background:#0f2b3b;color:#a9ecf7;border-radius:7px;padding:6px 9px;font:700 10px/1 system-ui;cursor:pointer}
    .progress{position:fixed;left:0;top:0;height:3px;background:linear-gradient(90deg,var(--cyan),var(--violet),var(--green));z-index:30;width:0}
    .map-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:14px}.doc-map{display:grid;gap:10px}.doc-row{display:grid;grid-template-columns:150px 1fr auto;gap:12px;align-items:center;padding:12px 14px;border:1px solid var(--line);border-radius:12px;background:#0b182a}.doc-row b{color:#fff}.doc-row span{color:var(--muted);font-size:12px}.flow-ribbon{display:flex;align-items:stretch;gap:7px;overflow:auto;padding:10px 0}.flow-ribbon .flow-box{min-width:150px;max-width:190px;border:1px solid #36506d;border-radius:11px;background:#0d1d32;padding:12px;font-size:11px}.flow-ribbon .flow-box b{display:block;font-size:12px;color:#eef5ff;margin-bottom:4px}.flow-ribbon .flow-arr{align-self:center;color:#6b86aa;font-size:18px}
    .contract-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.contract-card{border:1px solid var(--line);border-radius:14px;padding:15px;background:#0b1729}.contract-card .contract-id{font-size:10px;letter-spacing:.08em;color:var(--cyan);font-weight:900}.contract-card h3{margin:6px 0}.contract-card p{font-size:12px;color:#b9c9dd}.contract-card .route{font-size:11px;color:#89a1c0;border-top:1px solid #203550;padding-top:8px;margin-top:8px}
    .equation{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;gap:10px;align-items:center;margin:14px 0}.equation .eq-node{border:1px solid #355172;border-radius:14px;padding:16px;background:#0c1b30;text-align:center}.equation .eq-node b{display:block;font-size:16px;color:#fff}.equation .eq-node span{font-size:11px;color:var(--muted)}.equation .neq{font-size:24px;font-weight:900;color:var(--rose)}.equation .equals{font-size:24px;font-weight:900;color:var(--green)}
    .state-legend{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}.state-legend span{border:1px solid #36506d;background:#0e1d31;border-radius:999px;padding:4px 9px;font-size:10px;color:#c7d5e7}.decision-tree{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.decision-tree .branch{border:1px solid var(--line);border-radius:14px;padding:15px;background:#0c182a}.decision-tree .branch b{display:block;margin-bottom:6px;color:#fff}.decision-tree .branch p{font-size:12px;color:#b8c9dd}.state-table td:first-child{font-weight:800;color:#e8f4ff}
    .lane-title{font-size:11px;color:var(--cyan);letter-spacing:.08em;font-weight:900;margin:18px 0 6px}.review-script{font-size:14px;line-height:1.8;border:1px solid #6f59a3;border-left:4px solid var(--violet);border-radius:12px;background:#1b1830;padding:15px;color:#eadfff}
    @media(max-width:1050px){.map-grid,.contract-grid,.decision-tree{grid-template-columns:1fr}.doc-row{grid-template-columns:1fr}.equation{grid-template-columns:1fr}.equation .neq,.equation .equals{transform:rotate(90deg);text-align:center}}
    @media(max-width:650px){html,body{max-width:100%;overflow-x:hidden}body{padding-bottom:64px}.shell,header,section{min-width:0;max-width:100%}.section-head{flex-direction:column;gap:10px}.eyebrow,h1,.subtitle,.hero-statement,.section-head h2,.section-head p{overflow-wrap:anywhere;word-break:break-word}.toolbar{right:10px;bottom:10px;max-width:none}.toolbar button:not([data-action="top"]){display:none}.toolbar button{padding:10px 12px}.copy-btn{float:none;margin:0 0 8px 0}.flow-ribbon .flow-box{min-width:132px}.contract-card{padding:13px}}
    @media print{.toolbar,.progress,.copy-btn{display:none!important}}
  </style>`))
  .replace('<title>系统预设任务 · 从任务中心到车控闭环 · 框架专项评审稿 v05</title>', '<title>系统预设任务端云一体完整PRD v01｜框架、双链路、卡片与车控闭环</title>')
  .replace('SYSTEM PRESET TASKS · EDGE / CLOUD · REVIEW PLAYBOOK · V05', 'SYSTEM PRESET TASKS · MASTER PRD · EDGE / CLOUD · V01')
  .replace('系统预设任务：从任务中心按钮到真实车况回读', '系统预设任务端云一体完整 PRD')
  .replace('框架专项评审稿：按“谁负责、在哪里、收到什么、判断什么、如何判断、输出什么、失败怎么办”逐步展开端侧与云端链路。本文可直接用于评审讲解；黄色项必须会上拍板，不能作为已实现或排期承诺。', '唯一主PRD：从配置平台和任务中心开始，连续展开端侧自闭环、云端规则型、云端推理型、即时交互卡、端侧复核、车控与真实状态回读。每一步都说明谁负责、在哪里做、输入输出、判断和失败处理；黄色项必须专项拍板。')
  .replace('一句话需求：用户只负责在任务中心决定“允许不允许”；端侧或云端 Trigger 负责持续判断“现在是不是合适时机”；需要确认时由即时交互卡询问；真正车控前必须在端侧复核，并以车辆真实状态回读作为最终结果。', '一句话需求：配置平台定义“这是什么任务”；任务中心记录“用户允不允许”；端侧或云端 Trigger 判断“现在该不该发生”；即时交互卡只负责“怎么问、用户怎么选”；端侧执行层在车控前复核，最终只以车辆真实状态作为成功。')
  .replace('文档版本：V1.1 / HTML v05', '文档版本：PRD V1.0 / HTML v01')
  .replace('日期：2026-09-02', '日期：2026-09-03')
  .replace('系统预设任务端云双链路框架专项评审稿 · HTML v05 · 结合2026-07-28、08-11、08-27与09-01评审证据 · 黄项非实现承诺', '系统预设任务端云一体完整PRD · HTML v01 · 唯一主入口 · 端侧与云端专项稿为附录 · 手动沙盘仅用于理解与验收演示')
  .replace('</nav>', String.raw`</nav>

    <section id="prd-reading" class="read-first">
      <div class="section-head"><div><div class="kicker">MASTER PRD · HOW TO READ</div><h2>这是一份唯一主PRD：框架、端侧、云端和卡片不再分散</h2><p>先评公共骨架，再评三类运行链，最后评统一合同、异常与发布。专项稿只用于展开细节；手动沙盘只帮助理解，不能反向定义正式接口。</p></div><span class="status proposal">唯一产品事实源候选</span></div>
      <div class="map-grid">
        <div class="doc-map">
          <div class="doc-row"><b>本文件｜主PRD</b><span>定义公共模型、端云边界、三类运行链、卡片合同、执行合同、四任务映射和验收。</span><span class="status ok">评审入口</span></div>
          <div class="doc-row"><b>端侧专项 v01</b><span>只展开 Edge Trigger、端侧数据中心、可见即可说和天气样例。</span><span class="status build">技术附录</span></div>
          <div class="doc-row"><b>云端专项 v01</b><span>只展开 Cloud Trigger、Advisor/Planner、DT/VQA、点击/语音路由。</span><span class="status build">技术附录</span></div>
          <div class="doc-row"><b>手动沙盘 v03</b><span>人工输入、点击和观察数据流；它是教学/验收演示，不代表接口已经实现。</span><span class="status tbd">非事实源</span></div>
        </div>
        <article class="card violet">
          <h3>评审只按这 6 步走</h3>
          <ol style="padding-left:20px;font-size:12.5px;color:#c7d5e8"><li>先确认“系统预设任务”统一对象与模块边界。</li><li>确认任务中心的真实状态如何进入运行时。</li><li>分别评端侧、云端规则型、云端推理型。</li><li>确认卡片请求、用户结果、执行授权和真实回读合同。</li><li>用四条任务验证框架，没有私有断点。</li><li>把黄色问题落成结论、DRI、日期、Meego和验收证据。</li></ol>
          <div class="callout warn"><b>事实等级：</b>绿色=会议/正式资料已明确；紫色=本PRD产品方案；黄色=技术合同待确认；红色=材料冲突或阻塞。</div>
        </article>
      </div>
      <div class="flow-ribbon" aria-label="主PRD阅读顺序">
        <div class="flow-box"><b>01 公共框架</b>定义、实例、运行事件</div><div class="flow-arr">→</div>
        <div class="flow-box"><b>02 任务入口</b>任务中心→真实有效状态</div><div class="flow-arr">→</div>
        <div class="flow-box"><b>03 运行分流</b>端侧 / 云端规则 / 云端推理</div><div class="flow-arr">→</div>
        <div class="flow-box"><b>04 交互/静默</b>卡片、TTS、语音、点击</div><div class="flow-arr">→</div>
        <div class="flow-box"><b>05 端侧收口</b>复核、车控、真实回读</div><div class="flow-arr">→</div>
        <div class="flow-box"><b>06 验收治理</b>异常、日志、灰度、回滚</div>
      </div>
    </section>`)
  .replace('<a href="#read-first">评审先讲这里</a>', '<a href="#prd-reading">主PRD阅读</a><a href="#read-first">评审先讲这里</a>')
  .replace('<a href="#configuration">配置平台</a>', '<a href="#framework-master">总框架</a><a href="#configuration">配置平台</a>')
  .replace('<a href="#runtime">状态与生命周期</a>', '<a href="#runtime">仲裁</a><a href="#state-machine">统一状态机</a>')
  .replace('<a href="#owners">责任矩阵</a><a href="#contracts">数据契约</a>', '<a href="#owners">责任矩阵</a><a href="#contracts">数据契约</a><a href="#contract-model">公共合同</a>');

html = html.replace('<a href="#release">发布计划</a>', '<a href="#current-target">当前与目标</a><a href="#release">发布计划</a>');

const frameworkSection = String.raw`
    <section id="framework-master">
      <div class="section-head"><div><div class="kicker">04 · MASTER ARCHITECTURE</div><h2>系统预设任务总框架：两个控制入口、三类运行链、一个端侧收口</h2><p>配置平台和任务中心都在“任务开始之前”工作，但职责不同；运行时再按任务定义分为端侧自闭环、云端规则型和云端推理型。三条链最终都不能绕过端侧安全复核和真实状态回读。</p></div><span class="status proposal">To-Be 产品框架</span></div>
      <div class="diagram-scroll">
        <svg viewBox="0 0 1500 840" role="img" aria-label="系统预设任务端云一体总框架">
          <defs><marker id="arrowMaster" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#7892b5"/></marker></defs>
          <rect width="1500" height="840" fill="#07101e"/>
          <rect x="20" y="20" width="1460" height="135" rx="15" class="lane"/><text x="42" y="48" class="svg-title">A. 设计与用户控制面｜定义“是什么”与“允不允许”</text>
          <rect x="20" y="175" width="1460" height="175" rx="15" class="lane-alt"/><text x="42" y="203" class="svg-title">B. 状态与信号面｜把任务有效状态和最新场景输入送到正确运行时</text>
          <rect x="20" y="370" width="1460" height="195" rx="15" class="lane"/><text x="42" y="398" class="svg-title">C. 运行与决策面｜端侧、云端规则型、云端推理型</text>
          <rect x="20" y="585" width="1460" height="220" rx="15" class="lane-alt"/><text x="42" y="613" class="svg-title">D. 交互、执行与反馈面｜统一卡片容器；统一端侧安全收口</text>

          <path d="M295 90 H425" class="arr"/><path d="M675 90 H805" class="arr arr-tbd"/><path d="M1055 90 H1190" class="arr arr-tbd"/>
          <path d="M300 255 H430" class="arr"/><path d="M680 255 H810" class="arr"/><path d="M1060 255 H1195" class="arr"/>
          <path d="M250 470 H390" class="arr arr-byte"/><path d="M640 470 H760" class="arr arr-cloud"/><path d="M1010 470 H1130" class="arr arr-cloud"/>
          <path d="M515 510 V650 H390" class="arr arr-byte"/><path d="M885 510 V650 H700" class="arr arr-cloud"/><path d="M1255 510 V650 H700" class="arr arr-cloud"/>
          <path d="M540 680 H860" class="arr"/><path d="M1110 680 H1225" class="arr"/><path d="M1335 720 V770 H1040" class="arr arr-tbd"/><path d="M860 770 H520" class="arr arr-tbd"/>

          <rect x="70" y="58" width="225" height="70" rx="10" class="b b-byte"/><text x="182" y="84" text-anchor="middle" class="svg-title">配置平台</text><text x="182" y="104" text-anchor="middle" class="svg-text">TaskDefinition / 版本 / 发布</text><text x="182" y="120" text-anchor="middle" class="svg-small">当前仅部分能力可配</text>
          <rect x="425" y="58" width="250" height="70" rx="10" class="b b-data"/><text x="550" y="84" text-anchor="middle" class="svg-title">任务定义发布</text><text x="550" y="104" text-anchor="middle" class="svg-text">EDGE / CLOUD / HYBRID + 规则</text><text x="550" y="120" text-anchor="middle" class="svg-small">端侧统一下发为长期目标</text>
          <rect x="805" y="58" width="250" height="70" rx="10" class="b b-seres"/><text x="930" y="84" text-anchor="middle" class="svg-title">任务中心</text><text x="930" y="104" text-anchor="middle" class="svg-text">展示 / 用户启停 / 等待ACK</text><text x="930" y="120" text-anchor="middle" class="svg-small">按钮不是业务事实源</text>
          <rect x="1190" y="58" width="240" height="70" rx="10" class="b b-tbd"/><text x="1310" y="84" text-anchor="middle" class="svg-title">任务状态业务</text><text x="1310" y="104" text-anchor="middle" class="svg-text">TaskInstance真实有效状态</text><text x="1310" y="120" text-anchor="middle" class="svg-small">承载模块 / Push-Pull待定</text>

          <rect x="70" y="225" width="230" height="70" rx="10" class="b b-seres"/><text x="185" y="251" text-anchor="middle" class="svg-title">车辆 / VLM / 系统事件</text><text x="185" y="271" text-anchor="middle" class="svg-text">值 + 时间戳 + 质量 + 来源</text><text x="185" y="287" text-anchor="middle" class="svg-small">UNKNOWN/过期不可触发</text>
          <rect x="430" y="225" width="250" height="70" rx="10" class="b b-data"/><text x="555" y="251" text-anchor="middle" class="svg-title">端侧数据中心 / 状态适配</text><text x="555" y="271" text-anchor="middle" class="svg-text">变更事件 + 最新一致快照</text><text x="555" y="287" text-anchor="middle" class="svg-small">不做业务规则判断</text>
          <rect x="810" y="225" width="250" height="70" rx="10" class="b b-shared"/><text x="935" y="251" text-anchor="middle" class="svg-title">最小必要状态上行</text><text x="935" y="271" text-anchor="middle" class="svg-text">车辆/任务/事件/时间/质量</text><text x="935" y="287" text-anchor="middle" class="svg-small">断网不使用旧结果补执行</text>
          <rect x="1195" y="225" width="235" height="70" rx="10" class="b b-tbd"/><text x="1312" y="251" text-anchor="middle" class="svg-title">统一追踪与配置状态</text><text x="1312" y="271" text-anchor="middle" class="svg-text">definition / instance / run_event</text><text x="1312" y="287" text-anchor="middle" class="svg-small">正式字段名待技术签字</text>

          <rect x="85" y="430" width="165" height="78" rx="10" class="b b-byte"/><text x="167" y="456" text-anchor="middle" class="svg-title">端侧主链</text><text x="167" y="476" text-anchor="middle" class="svg-text">固定规则 / 低时延</text><text x="167" y="493" text-anchor="middle" class="svg-small">例：天气保护</text>
          <rect x="390" y="430" width="250" height="78" rx="10" class="b b-byte"/><text x="515" y="456" text-anchor="middle" class="svg-title">Edge Trigger</text><text x="515" y="476" text-anchor="middle" class="svg-text">订阅→快照→规则→去重</text><text x="515" y="493" text-anchor="middle" class="svg-small">创建一次run_event</text>
          <rect x="760" y="430" width="250" height="78" rx="10" class="b b-shared"/><text x="885" y="456" text-anchor="middle" class="svg-title">Cloud Trigger｜规则型</text><text x="885" y="476" text-anchor="middle" class="svg-text">确定性云规则 / 静默候选</text><text x="885" y="493" text-anchor="middle" class="svg-small">例：后视镜加热</text>
          <rect x="1130" y="430" width="250" height="78" rx="10" class="b b-shared"/><text x="1255" y="456" text-anchor="middle" class="svg-title">云端编排｜推理型</text><text x="1255" y="476" text-anchor="middle" class="svg-text">Advisor/Planner + DT/VQA</text><text x="1255" y="493" text-anchor="middle" class="svg-small">例：充电设备识别</text>

          <rect x="130" y="645" width="260" height="76" rx="10" class="b b-shared"/><text x="260" y="671" text-anchor="middle" class="svg-title">即时交互卡｜可选</text><text x="260" y="691" text-anchor="middle" class="svg-text">展示 / TTS / 点击 / 语音入口</text><text x="260" y="708" text-anchor="middle" class="svg-small">端侧可见即可说；云端Planner</text>
          <rect x="540" y="645" width="160" height="76" rx="10" class="b b-action"/><text x="620" y="671" text-anchor="middle" class="svg-title">用户授权</text><text x="620" y="691" text-anchor="middle" class="svg-text">CONFIRM/REJECT</text><text x="620" y="708" text-anchor="middle" class="svg-small">不是执行成功</text>
          <rect x="860" y="645" width="250" height="76" rx="10" class="b b-byte"/><text x="985" y="671" text-anchor="middle" class="svg-title">端侧执行前复核</text><text x="985" y="691" text-anchor="middle" class="svg-text">任务 / 车况 / 结果 / 授权仍有效</text><text x="985" y="708" text-anchor="middle" class="svg-small">唯一公共安全门禁待定承载层</text>
          <rect x="1225" y="645" width="210" height="76" rx="10" class="b b-seres"/><text x="1330" y="671" text-anchor="middle" class="svg-title">赛力斯车控</text><text x="1330" y="691" text-anchor="middle" class="svg-text">执行原子动作</text><text x="1330" y="708" text-anchor="middle" class="svg-small">RPC结果 ≠ 最终成功</text>
          <rect x="860" y="748" width="310" height="60" rx="10" class="b b-data"/><text x="1015" y="773" text-anchor="middle" class="svg-title">真实状态回读 → ActionResult</text><text x="1015" y="793" text-anchor="middle" class="svg-text">目标达到才SUCCESS；否则失败/未知</text>
          <rect x="320" y="748" width="200" height="60" rx="10" class="b b-tbd"/><text x="420" y="773" text-anchor="middle" class="svg-title">卡片 / 日志 / 冷却</text><text x="420" y="793" text-anchor="middle" class="svg-text">结果同步协议待定</text>
        </svg>
      </div>
      <p class="diagram-note">箭头方向是数据流，不代表模块调用协议已经全部确定。黄色虚线节点与箭头必须在专项评审中确认正式承载模块、协议和Owner。</p>
      <div class="three-grid" style="margin-top:14px">
        <article class="card green"><h3>端侧自闭环</h3><p>本地固定规则 + 本地卡片/静默 + 本地确认 + 端侧执行。价值是低时延、弱网可用和最接近真实车辆状态。</p></article>
        <article class="card cyan"><h3>云端规则型</h3><p>云端确定性规则命中后下发候选，端侧复核执行。价值是策略迭代快；代价是断网可能漏掉一次便利任务。</p></article>
        <article class="card violet"><h3>云端推理型</h3><p>云端需要Planner、DT/VQA或上下文才能判断，再请求用户确认并下发执行授权。价值是复杂理解；代价是延迟、网络和结果时效。</p></article>
      </div>
    </section>
`;

html = html.replace('    <section id="background">', frameworkSection + '\n    <section id="background">');

const stateSection = String.raw`
    <section id="state-machine">
      <div class="section-head"><div><div class="kicker">COMMON · UNIFIED STATE MACHINE</div><h2>公共状态机：端、云、卡片和车控用同一个运行事件对齐</h2><p>状态属于一次 run_event，不属于长期任务模板。云端推理型比其他链路多一个 INFERENCE；静默任务绕过 CARD_ACTIVE 和 AUTHORIZED，但不能绕过 PRECHECKING。</p></div><span class="status proposal">产品统一建议</span></div>
      <div class="diagram-scroll">
        <svg viewBox="0 0 1500 610" role="img" aria-label="系统预设任务统一状态机">
          <defs><marker id="arrowState" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#7892b5"/></marker></defs>
          <rect width="1500" height="610" fill="#07101e"/>
          <rect x="30" y="30" width="1440" height="130" rx="14" class="lane"/><text x="50" y="58" class="svg-title">长期任务实例状态｜由任务有效状态控制</text>
          <rect x="30" y="180" width="1440" height="190" rx="14" class="lane-alt"/><text x="50" y="208" class="svg-title">一次运行事件｜端侧和云端共同业务状态</text>
          <rect x="30" y="390" width="1440" height="180" rx="14" class="lane"/><text x="50" y="418" class="svg-title">失败、取消与恢复｜任何拒绝都不得绕回执行</text>
          <path d="M280 100 H460" class="arr"/><path d="M630 100 H800" class="arr arr-tbd"/><path d="M975 100 H1160" class="arr"/>
          <path d="M180 275 H330" class="arr"/><path d="M500 275 H650" class="arr arr-cloud"/><path d="M820 275 H970" class="arr"/><path d="M1140 275 H1280" class="arr"/>
          <path d="M415 315 V465 H300" class="arr arr-stop"/><path d="M735 315 V465 H590" class="arr arr-stop"/><path d="M1055 315 V465 H880" class="arr arr-stop"/><path d="M1360 315 V465 H1180" class="arr arr-stop"/>
          <path d="M1320 505 H1050" class="arr arr-tbd"/><path d="M880 505 H710" class="arr arr-tbd"/><path d="M590 505 H420" class="arr arr-tbd"/><path d="M300 505 H180 V315" class="arr arr-tbd"/>
          <rect x="90" y="70" width="190" height="64" rx="10" class="b b-neutral"/><text x="185" y="96" text-anchor="middle" class="svg-title">DISABLED</text><text x="185" y="116" text-anchor="middle" class="svg-small">任务不允许运行</text>
          <rect x="460" y="70" width="170" height="64" rx="10" class="b b-byte"/><text x="545" y="96" text-anchor="middle" class="svg-title">WAITING</text><text x="545" y="116" text-anchor="middle" class="svg-small">等待新的有效事件</text>
          <rect x="800" y="70" width="175" height="64" rx="10" class="b b-tbd"/><text x="887" y="96" text-anchor="middle" class="svg-title">STATE UNKNOWN</text><text x="887" y="116" text-anchor="middle" class="svg-small">禁止新触发；恢复方式待定</text>
          <rect x="1160" y="70" width="205" height="64" rx="10" class="b b-neutral"/><text x="1262" y="96" text-anchor="middle" class="svg-title">DISABLED</text><text x="1262" y="116" text-anchor="middle" class="svg-small">关闭时在途事件分态处理</text>
          <rect x="80" y="240" width="100" height="70" rx="10" class="b b-byte"/><text x="130" y="270" text-anchor="middle" class="svg-title">CANDIDATE</text><text x="130" y="290" text-anchor="middle" class="svg-small">条件命中</text>
          <rect x="330" y="240" width="170" height="70" rx="10" class="b b-shared"/><text x="415" y="270" text-anchor="middle" class="svg-title">INFERENCE</text><text x="415" y="290" text-anchor="middle" class="svg-small">仅云端推理型</text>
          <rect x="650" y="240" width="170" height="70" rx="10" class="b b-shared"/><text x="735" y="270" text-anchor="middle" class="svg-title">CARD_ACTIVE</text><text x="735" y="290" text-anchor="middle" class="svg-small">卡片有效等待选择</text>
          <rect x="970" y="240" width="170" height="70" rx="10" class="b b-action"/><text x="1055" y="270" text-anchor="middle" class="svg-title">AUTHORIZED</text><text x="1055" y="290" text-anchor="middle" class="svg-small">授权有效；尚未执行</text>
          <rect x="1280" y="240" width="160" height="70" rx="10" class="b b-byte"/><text x="1360" y="270" text-anchor="middle" class="svg-title">PRECHECKING</text><text x="1360" y="290" text-anchor="middle" class="svg-small">读取最新车况</text>
          <rect x="1120" y="450" width="200" height="70" rx="10" class="b b-seres"/><text x="1220" y="480" text-anchor="middle" class="svg-title">EXECUTING</text><text x="1220" y="500" text-anchor="middle" class="svg-small">调用车控并等待回读</text>
          <rect x="880" y="450" width="170" height="70" rx="10" class="b b-data"/><text x="965" y="480" text-anchor="middle" class="svg-title">RESULT</text><text x="965" y="500" text-anchor="middle" class="svg-small">成功/失败/未知</text>
          <rect x="590" y="450" width="170" height="70" rx="10" class="b b-neutral"/><text x="675" y="480" text-anchor="middle" class="svg-title">COOLDOWN</text><text x="675" y="500" text-anchor="middle" class="svg-small">频控后回Waiting</text>
          <rect x="210" y="450" width="210" height="70" rx="10" class="b b-action"/><text x="315" y="480" text-anchor="middle" class="svg-title">CANCELLED / DROPPED</text><text x="315" y="500" text-anchor="middle" class="svg-small">拒绝/超时/过期/条件变化</text>
        </svg>
      </div>
      <div class="callout"><b>两条特殊跳转：</b>云端规则型静默任务可从 CANDIDATE 直接到 PRECHECKING；端侧确认型可从 CANDIDATE 直接到 CARD_ACTIVE。两者都要创建 run_event 并进入统一结果、日志和冷却。</div>
      <div class="table-wrap"><table class="state-table"><thead><tr><th>状态</th><th>进入条件</th><th>离开条件</th><th>必须记录</th><th>禁止行为</th></tr></thead><tbody>
        <tr><td>WAITING</td><td>任务真实状态ENABLED且规则可加载</td><td>新事件导致条件命中</td><td>定义版本、实例状态版本</td><td>不能因为开关刚打开就假装命中</td></tr>
        <tr><td>CANDIDATE</td><td>信号有效、条件、防抖、去重通过</td><td>进入推理、交互或静默复核</td><td>run_event、命中子场景、输入快照</td><td>不能把候选当车控授权</td></tr>
        <tr><td>INFERENCE</td><td>任务需要Planner/DT/VQA</td><td>有效结果或失败/过期</td><td>请求、帧时间、结果、有效期</td><td>UNKNOWN/ERROR不得当FOUND</td></tr>
        <tr><td>CARD_ACTIVE</td><td>卡片真实展示且在有效期</td><td>确认、拒绝、关闭、超时、被替换</td><td>card_id、展示ACK、交互通道</td><td>排队中不能开始等待用户授权</td></tr>
        <tr><td>AUTHORIZED</td><td>同run_event的有效确认</td><td>复核通过或授权过期/场景变化</td><td>option、渠道、授权时间、TTL</td><td>不能把确认直接显示为成功</td></tr>
        <tr><td>PRECHECKING</td><td>即将执行</td><td>所有最新安全门禁通过或失败</td><td>最新快照、差异、失败原因</td><td>云端旧状态不能覆盖车端最新状态</td></tr>
        <tr><td>EXECUTING / RESULT</td><td>复核通过后调用车控</td><td>真实目标状态达到或超时/失败</td><td>请求幂等键、RPC、回读值和时间</td><td>RPC accepted不能当SUCCESS</td></tr>
        <tr><td>COOLDOWN</td><td>本轮已完成或结束</td><td>冷却到期且任务仍ENABLED</td><td>结束原因、下次允许时间</td><td>不能因持续状态反复弹卡</td></tr>
      </tbody></table></div>
      <details><summary>沙盘阶段与正式业务状态如何对应</summary><div><div class="table-wrap"><table><thead><tr><th>手动沙盘阶段</th><th>正式业务状态</th><th>说明</th></tr></thead><tbody><tr><td>OFF / SYNCING</td><td>DISABLED / 状态同步过程</td><td>SYNCING只是演示步骤，不建议成为业务状态枚举</td></tr><tr><td>QUERY_DRAFT / PLANNER / DT_WAIT</td><td>CANDIDATE / INFERENCE</td><td>是云端内部步骤，不属于所有任务</td></tr><tr><td>CARD_DRAFT / CARD_ACTIVE</td><td>CANDIDATE / CARD_ACTIVE</td><td>只有收到展示ACK才进入CARD_ACTIVE</td></tr><tr><td>AUTHORIZED / RECHECK</td><td>AUTHORIZED / PRECHECKING</td><td>只在调用车控前做一次最终安全复核</td></tr><tr><td>RPC / READBACK / DONE</td><td>EXECUTING / RESULT</td><td>最终以真实状态回读判定成功</td></tr></tbody></table></div></div></details>
    </section>
`;

html = html.replace('    <section id="tasks">', stateSection + '\n    <section id="tasks">');

const contractSection = String.raw`
    <section id="contract-model">
      <div class="section-head"><div><div class="kicker">CONTRACT · END-TO-END PRODUCT CONTRACT</div><h2>公共数据合同：业务要给谁什么，对方必须返回什么</h2><p>这里定义产品语义和最小信息，不冒充正式IDL。研发可以改变字段名和物理通道，但不能删掉对象之间的关联、有效期、幂等和真实状态。</p></div><span class="status tbd">正式Schema待技术专项</span></div>
      <div class="contract-grid">
        <article class="contract-card"><div class="contract-id">CONTRACT 01</div><h3>TaskOperation</h3><p>用户在任务中心的启停意图：定义/实例标识、ENABLE或DISABLE、状态版本、车辆/账号、操作时间和幂等键。</p><div class="route">任务中心 → 任务状态业务</div></article>
        <article class="contract-card"><div class="contract-id">CONTRACT 02</div><h3>TaskStateAck / EffectiveState</h3><p>保存是否成功及真实ENABLED/DISABLED/UNKNOWN；携状态版本、更新时间和原因。Trigger需要启动快照与变更事件。</p><div class="route">状态业务 → 任务中心 + Edge/Cloud Trigger</div></article>
        <article class="contract-card"><div class="contract-id">CONTRACT 03</div><h3>RunEvent</h3><p>一次条件命中：run_event、任务定义/实例、规则版本、子场景、输入快照引用、创建时间、有效期和去重键。</p><div class="route">Edge/Cloud Trigger → 后续交互或执行</div></article>
        <article class="contract-card"><div class="contract-id">CONTRACT 04</div><h3>InteractionRequest</h3><p>卡片内容、选项、TTS、source_type、voice_route、click_route、优先级、有效期、回调目标和同一run_event。</p><div class="route">Trigger / 云端编排 → 即时交互卡</div></article>
        <article class="contract-card"><div class="contract-id">CONTRACT 05</div><h3>CardAdmissionAck + InteractionResult</h3><p>先返回DISPLAYED/QUEUED/REJECTED/FAILED，再返回CONFIRM/REJECT/关闭/超时/打断/过期及输入渠道。</p><div class="route">即时交互卡 → 原业务 / Planner上下文</div></article>
        <article class="contract-card"><div class="contract-id">CONTRACT 06</div><h3>ExecutionRequest</h3><p>有效授权或静默执行依据、目标action、run_event、幂等键、结果/授权有效期、最新复核要求和目标状态。</p><div class="route">Trigger / 云端编排 → 端侧执行层</div></article>
        <article class="contract-card"><div class="contract-id">CONTRACT 07</div><h3>ActionResult</h3><p>端侧执行事实：RPC结果、真实状态、开始/结束时间、错误、是否达到目标。它是业务最终结论来源。</p><div class="route">端侧执行层 → 原业务 / 云端编排 / 日志</div></article>
        <article class="contract-card"><div class="contract-id">CONTRACT 08</div><h3>ActionUpdate</h3><p>供卡片展示：处理中、成功、失败、取消和用户可读原因；从ActionResult映射，不反向决定真实执行状态。</p><div class="route">原业务 / 云端编排 → 即时交互卡</div></article>
        <article class="contract-card"><div class="contract-id">CONTRACT 09</div><h3>TraceEnvelope</h3><p>用同一trace关联definition、instance、run_event、card、inference、execution和回读，支持端云排障。</p><div class="route">所有模块 → 可观测平台</div></article>
      </div>

      <h3 style="margin-top:22px">卡片合同：端侧与云端共用一套容器，只扩展不同路由</h3>
      <div class="table-wrap xwide"><table><thead><tr><th>信息</th><th>公共必需</th><th>端侧确认型扩展</th><th>云端确认型扩展</th><th>为什么需要</th><th>事实等级</th></tr></thead><tbody>
        <tr><td>三层身份</td><td>definition、instance、run_event、trace</td><td>同上</td><td>同上</td><td>防止旧卡、串车、串事件和重复执行</td><td><span class="status proposal">字段建议</span></td></tr>
        <tr><td>来源与交互</td><td>source_type、interaction_mode</td><td>EDGE_TRIGGER + CONFIRM_LOCAL</td><td>CLOUD_ADVISOR + CONFIRM_CLOUD</td><td>决定结果回给谁、语音走哪里</td><td><span class="status ok">业务语义明确</span> <span class="status tbd">枚举待定</span></td></tr>
        <tr><td>展示内容</td><td>标题、正文、选项、option_id、TTS策略</td><td>固定词条和按钮同义词</td><td>Planner上下文引用、推理结果引用</td><td>卡片负责问问题，但不负责生成业务判断</td><td><span class="status ok">能力方向明确</span></td></tr>
        <tr><td>输入路由</td><td>voice_route、click_route、callback</td><td>可见即可说/点击 → 原端侧业务</td><td>语音→Planner；点击→业务并同步Planner已消费</td><td>点击和语音物理路径不同，但业务结果要统一</td><td><span class="status conflict">云端点击通道待定</span></td></tr>
        <tr><td>时间与仲裁</td><td>created_at、expires_at、priority</td><td>卡失效注销本地词条</td><td>卡失效注销动态选择上下文</td><td>防止过期“好的”执行旧动作</td><td><span class="status proposal">统一合同建议</span></td></tr>
        <tr><td>展示ACK</td><td>DISPLAYED / QUEUED / REJECTED / FAILED + card_id</td><td>DISPLAYED后才注册词条</td><td>DISPLAYED后才开放卡片上下文</td><td>接口调用成功不等于用户已经看到卡</td><td><span class="status tbd">协议需确认</span></td></tr>
        <tr><td>用户/生命周期结果</td><td>CONFIRM、REJECT、CLOSE、TIMEOUT、INTERRUPTED、EXPIRED、REPLACED</td><td>回Edge Trigger</td><td>回云端业务并同步Planner</td><td>每种结束原因影响频控和恢复</td><td><span class="status proposal">产品最小枚举</span></td></tr>
      </tbody></table></div>

      <h3 style="margin-top:22px">ExecutionRequest：补上“卡片以后、车控以前”的正式断点</h3>
      <div class="table-wrap"><table><thead><tr><th>字段语义</th><th>必须携带</th><th>端侧如何判断</th><th>拒绝条件</th></tr></thead><tbody>
        <tr><td>身份与幂等</td><td>run_event、action_request_id、trace、dedupe_key</td><td>首次消费且属于当前任务实例</td><td>重复、串事件、实例已关闭</td></tr>
        <tr><td>授权依据</td><td>CONFIRM结果引用；静默任务则带approved_policy/version</td><td>授权方式符合该任务Profile</td><td>高风险任务缺授权或策略未签字</td></tr>
        <tr><td>推理依据</td><td>如DT结果引用、frame_time、valid_until</td><td>同run_event、结果有效、FOUND</td><td>NOT_FOUND/UNKNOWN/ERROR/过期</td></tr>
        <tr><td>目标动作</td><td>ability/action、参数、预期目标状态</td><td>车型和版本支持；参数合法</td><td>能力不存在、状态已经相反或不安全</td></tr>
        <tr><td>安全快照要求</td><td>任务、挡位、速度、目标状态等复核项</td><td>重新读取本地最新状态，而非复用云端旧快照</td><td>任一UNKNOWN、过期或条件已变化</td></tr>
      </tbody></table></div>

      <div class="equation" aria-label="最终成功判定">
        <div class="eq-node"><b>用户 CONFIRM</b><span>只表示授权</span></div><div class="neq">≠</div>
        <div class="eq-node"><b>RPC ACCEPTED</b><span>只表示调用被受理</span></div><div class="neq">≠</div>
        <div class="eq-node" style="border-color:#43d99e"><b>业务 SUCCESS</b><span>真实车辆状态达到目标</span></div>
      </div>
      <div class="callout danger"><b>唯一成功口径：</b>用户点了“确认”、Planner识别为YES、DT返回FOUND、RPC返回成功，都不能直接让卡片显示“已完成”。只有端侧读到后雾灯ON、驾驶模式已切换、充电口盖OPEN等真实目标状态，才生成SUCCESS。</div>
    </section>
`;

html = html.replace('    <section id="quality">', contractSection + '\n    <section id="quality">');

const currentTargetSection = String.raw`
    <section id="current-target">
      <div class="section-head"><div><div class="kicker">RELEASE INPUT · AS-IS / TARGET / RELEASE BOUNDARY</div><h2>当前、最小闭环、长期平台化：三层不要混成一个承诺</h2><p>会议明确当前配置平台只能配置一部分；端侧仍依赖研发代码；TTS、二次确认、卡片和端云同步尚未完整平台化。下表用于防止评审把长期方向误听成本期已有能力。</p></div><span class="status ok">会议现状已核对</span></div>
      <div class="table-wrap xwide"><table><thead><tr><th>能力域</th><th>当前会议可确认</th><th>最小可交付闭环</th><th>长期目标</th><th>本次要拍板</th></tr></thead><tbody>
        <tr><td>任务定义</td><td>四条任务散落在表格和PRD；统一模型未完全落地</td><td>用同一Task模型补齐四任务</td><td>模板、能力目录、版本、灰度、回滚统一</td><td>三层对象、字段语义和唯一事实源</td></tr>
        <tr><td>任务中心状态</td><td>有展示/启停产品能力；预设任务到Trigger的正式Push/Pull未找到</td><td>状态保存、ACK、启动快照、变更、重启恢复可验收</td><td>端云统一实例状态和审计</td><td>郝晓伟/任务中心与Trigger关闭协议</td></tr>
        <tr><td>云端Trigger</td><td>条件/动作可配置一部分</td><td>后视镜或充电硬条件按正式信号运行</td><td>高频任务优先配置而非重复开发</td><td>能力覆盖、Owner和接口</td></tr>
        <tr><td>端侧Trigger</td><td>天气链路开发中；端侧任务仍需端侧研发实现</td><td>天气从任务有效到回读闭环跑通</td><td>配置平台下发规则包，端侧解释执行</td><td>当前实现证据与长期加载协议边界</td></tr>
        <tr><td>即时卡/TTS/二次确认</td><td>通用容器和基础能力存在；业务注册、标准回调、平台原子能力未完整</td><td>天气本地确认、充电在线确认各跑通一条</td><td>标准Profile可组合、可发布、可观测</td><td>InteractionRequest/Result/生命周期和正式路由</td></tr>
        <tr><td>执行与真实回读</td><td>车控原子能力存在与否需逐任务核；统一ExecutionRequest/ActionResult缺失</td><td>复核、幂等、回读、失败文案和日志统一</td><td>端云一致的执行安全门禁与治理</td><td>唯一承载层、接口、超时和错误码</td></tr>
      </tbody></table></div>
      <div class="review-script"><b>评审时照读：</b>“今天我们不是宣布平台已经端云统一。当前云端能配一部分，端侧仍需研发实现，卡片/TTS/二次确认也没有完整沉淀。今天先确认公共模型和最小闭环：天气验证端侧确认链，后视镜验证云端静默链，充电口验证云端推理确认链，儿童锁作为安全阻塞案例。长期再把高频能力注册到平台并向端侧下发。”</div>
    </section>
`;

html = html.replace('    <section id="release">', currentTargetSection + '\n    <section id="release">');

html = html.replace('    <div class="foot">', String.raw`    <div class="toolbar" aria-label="文档工具"><button type="button" data-action="expand">展开全部</button><button type="button" data-action="collapse">收起全部</button><button type="button" data-action="print">打印 / 导出PDF</button><button type="button" data-action="top">返回顶部</button></div>
    <div class="progress" aria-hidden="true"></div>
    <div class="foot">`);

html = html.replace('</body>', String.raw`<script>
  (() => {
    const $ = (s, root=document) => root.querySelector(s);
    const qsa = (s, root=document) => Array.from(root.querySelectorAll(s));
    qsa('pre.mermaid-source, .mermaid-source pre, details pre').forEach((pre) => {
      const button = document.createElement('button');
      button.className = 'copy-btn';
      button.type = 'button';
      button.textContent = '复制源码';
      button.addEventListener('click', async () => {
        const code = pre.innerText.trim();
        try { await navigator.clipboard.writeText(code); button.textContent = '已复制'; }
        catch { button.textContent = '请手动复制'; }
        setTimeout(() => button.textContent = '复制源码', 1400);
      });
      pre.parentElement.insertBefore(button, pre);
    });
    $('[data-action="expand"]')?.addEventListener('click', () => qsa('details').forEach(d => d.open = true));
    $('[data-action="collapse"]')?.addEventListener('click', () => qsa('details').forEach(d => d.open = false));
    $('[data-action="print"]')?.addEventListener('click', () => window.print());
    $('[data-action="top"]')?.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));
    const progress = $('.progress');
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      progress.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + '%';
    };
    addEventListener('scroll', update, {passive:true}); update();
    if (location.hash) document.querySelector(location.hash)?.scrollIntoView({block:'start'});
  })();
</script>
</body>`);

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, html);
console.log(output);
console.log(`${Buffer.byteLength(html)} bytes`);
