/* Local, dependency-free reader. Data and SVG assets are injected by build.mjs. */
(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const arr = value => Array.isArray(value) ? value : [];
  const str = value => value == null ? '' : String(value);
  const esc = value => str(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const fmt = value => esc(value).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  const para = value => `<p>${fmt(value)}</p>`;
  const uid = value => str(value).replace(/[^\w\u4e00-\u9fff-]/g, '-');
  const unique = values => [...new Set(values.filter(Boolean))];
  const safeUrl = value => /^https?:\/\//i.test(str(value)) ? str(value) : '';
  const enc = value => encodeURIComponent(str(value));
  const base = DATA.base || {};
  const modules = arr(base.modules);
  const moduleById = new Map(modules.map(module => [module.id, module]));
  const extraPages = arr(DATA.pages);
  const suppliedPages = new Map(extraPages.map(page => [page.id, page]));
  const walkthroughs = arr(DATA.walkthroughs);
  const walkthroughById = new Map(walkthroughs.map(item => [item.id, item]));
  const nodes = modules.flatMap(module => arr(module.nodes).map(node => ({ ...node, moduleId: node.moduleId || module.id })));
  const nodeById = new Map(nodes.map(node => [node.id, node]));
  const edges = arr(base.edges).length ? arr(base.edges) : modules.flatMap(module => arr(module.edges));
  const tools = arr(base.tools).map((tool, index) => ({ ...tool, id: tool.id || `TOOL${String(index + 1).padStart(2, '0')}`, supplemental: false }));
  const supplements = arr(base.supplementalDefinitions).map((tool, index) => ({ ...tool, id: tool.id || `SUP${String(index + 1).padStart(2, '0')}`, supplemental: true }));
  const allTools = [...tools, ...supplements];
  const toolById = new Map(allTools.map(tool => [tool.id, tool]));
  const sources = [...new Map([...arr(base.sources), ...arr(DATA.sources)].map(source => [source.id, source])).values()];
  const sourceById = new Map(sources.map(source => [source.id, source]));
  const groups = [
    { title: '一句话到真实结果', ids: ['V', 'R', 'M', 'C', 'D', 'E', 'O'] },
    { title: '专项业务执行', ids: ['DR'] },
    { title: '身份、感知与事实', ids: ['K', 'B', 'A', 'EV', 'EL'] },
    { title: '持续任务与主动服务', ids: ['T', 'G', 'L', 'S'] },
    { title: '交互、界面与打断', ids: ['I', 'W', 'H', 'U'] },
    { title: '能力建设与持续改进', ids: ['F', 'P', 'SE'] },
  ];
  const labels = {
    V: '语音识别与说话结束', R: '入口与端云采信', M: '输入管理', C: '上下文 Context',
    D: 'Planner / Director', E: '工具执行与反馈', DR: '司机 Agent · 舱驾融合', O: '输出与真实结果', K: '身份与 Memory',
    B: '信号与当前状态', A: '视觉感知与问图', EV: '事件 Event', EL: '事件日志',
    T: '任务与生命周期', G: '云端触发器', L: '端侧触发与本地闭环', S: 'Advisor 主动服务',
    I: '打断、插话与恢复', W: '可见即可说', H: '静默展示与 PHUD', U: '任务中心与卡片',
    F: '能力准入与 Agent 协议', P: '配置平台', SE: '自进化与评测闭环',
  };
  const canonicalIds = groups.flatMap(group => group.ids);
  const pageIds = unique([...canonicalIds, ...modules.map(module => module.id), ...extraPages.map(page => page.id)]);
  const mainIds = ['V', 'R', 'M', 'C', 'D', 'E', 'O'];
  const kindLabels = { process: '处理', decision: '判断', result: '结果', exception: '异常 / 边界', source: '来源', planned: '方案' };
  const root = $('#page-root');
  const sidebar = $('#sidebar-content');
  const toc = $('#page-toc');
  const toast = $('#toast');
  const diagramRegistry = new Map();
  const svgCache = new Map();
  let diagramSequence = 0;
  let currentRoute = { name: 'home', parts: [] };
  let currentPageId = null;
  let tocObserver = null;
  let toastTimer = null;
  let searchLimit = 60;
  let searchFilter = 'all';
  let previousFocus = null;
  let modalState = null;
  let lastRenderedHash = null;
  const scrollPositions = new Map();
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';







  function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = false;
    toastTimer = setTimeout(() => { toast.hidden = true; }, 3500);
  }

  function pageOf(id) {
    const supplied = suppliedPages.get(id);
    const module = moduleById.get(id);
    if (supplied) return { ...supplied, title: supplied.title || module?.title || labels[id] || id, shortTitle: supplied.shortTitle || labels[id] || supplied.title, sourceIds: unique([...arr(supplied.sourceIds), ...arr(module?.sourceIds)]) };
    if (!module) return { id, title: labels[id] || id, shortTitle: labels[id] || id, summary: '此模块尚未导入可核验的学习正文。请先查看关联模块与资料边界；这里不以通用概念冒充本产品实现。', sections: [], flows: [], cases: [], questions: [], metrics: [], roadmap: [], sourceIds: [], missing: true, fallback: true };
    return {
      id, title: module.title, shortTitle: labels[id] || module.title,
      summary: module.subtitle || '', scenario: '',
      why: null, sections: [], flows: [], cases: [], terms: [],
      questions: arr(module.questions).map(question => ({ q: question.q, why: question.why, goodAnswer: question.goodAnswer || question.pass, evidence: question.evidence || '' })),
      metrics: arr(module.metrics).map(metric => ({ ...metric, targetStatus: metric.targetStatus || metric.status, segment: metric.segment || '' })),
      roadmap: [], related: [], sourceIds: arr(module.sourceIds), fallback: true,
    };
  }

  function titleOf(id) { return labels[id] || pageOf(id).shortTitle || id; }
  function routeHref(name, ...parts) { return `#${name}${parts.length ? '/' + parts.map(enc).join('/') : ''}`; }
  function moduleLink(id, label) { return `<a href="${routeHref('module', id)}">${esc(label || titleOf(id))}</a>`; }
  function nodeLink(id, label) { const node = nodeById.get(id); return node ? `<a href="${routeHref('node', id)}">${esc(label || `${id} · ${node.title}`)}</a>` : `<span>${esc(label || id)}</span>`; }
  function crumb(items = []) { return `<nav class="breadcrumbs" aria-label="当前位置"><a href="#home">业务学习站</a>${items.map(item => `<span aria-hidden="true">/</span>${item.href ? `<a href="${esc(item.href)}">${esc(item.label)}</a>` : `<span aria-current="page">${esc(item.label)}</span>`}`).join('')}</nav>`; }
  function heading(title, lead, options = {}) {
    return `<header class="page-header">${crumb(options.crumbs || [{ label: title }])}${options.eyebrow ? `<p class="eyebrow">${esc(options.eyebrow)}</p>` : ''}<h1>${esc(title)}</h1>${lead ? `<p class="page-lead">${fmt(lead)}</p>` : ''}${options.meta ? `<div class="page-meta">${options.meta}</div>` : ''}${options.actions ? `<div class="page-actions">${options.actions}</div>` : ''}</header>`;
  }
  function section(id, title, content, intro = '') { return `<section class="section" id="${esc(id)}" data-section-title="${esc(title)}"><h2>${esc(title)}</h2>${intro ? `<p class="section-intro">${fmt(intro)}</p>` : ''}${content}</section>`; }
  function label(text, type = '') { return `<span class="inline-label ${esc(type)}">${esc(text)}</span>`; }
  function sourceStrip() { return ''; }

  function statusClass(status) { return /待|计划|方案|设计|后续|建议|讨论|目标|历史/.test(str(status)) ? 'planned' : /失败|未定义|冲突|弃用|停用/.test(str(status)) ? 'warning' : ''; }
  function basicTable(table) {
    if (!table || !arr(table.columns).length) return '';
    const cellContent = value => {
      const node = nodeById.get(str(value).trim());
      return node ? `${nodeLink(node.id, node.title)}<br><span class="relation-meta">${esc(node.id)} · ${esc(titleOf(node.moduleId))}</span>` : fmt(value);
    };
    return `<div class="table-scroll" tabindex="0" role="region" aria-label="可横向滚动的数据表"><table><thead><tr>${table.columns.map(column => `<th scope="col">${esc(column)}</th>`).join('')}</tr></thead><tbody>${arr(table.rows).map(row => `<tr>${arr(row).map(cell => `<td>${cellContent(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }

  function renderSidebar() {
    const selected = currentRoute.name === 'module' ? currentRoute.parts[0] : currentRoute.name === 'node' ? nodeById.get(currentRoute.parts[0])?.moduleId : null;
    const navItem = (href, title, code = '', active = false) => `<a class="nav-item" href="${href}"${active ? ' aria-current="page"' : ''}>${code ? `<span class="nav-code">${esc(code)}</span>` : ''}<span class="nav-title">${esc(title)}</span></a>`;
    sidebar.innerHTML = `<nav aria-label="模块导航"><div class="nav-group">${navItem('#home', '从完整链路开始', '', currentRoute.name === 'home')}${navItem('#walkthrough', '同一句话完整走查', '', currentRoute.name === 'walkthrough')}${navItem('#map', '完整业务架构图', '', currentRoute.name === 'map')}${navItem('#tools', '工具与执行机制', '', ['tools', 'tool'].includes(currentRoute.name))}</div>${groups.map(group => `<div class="nav-group"><h2 class="nav-group-title">${esc(group.title)}</h2>${group.ids.map(id => navItem(routeHref('module', id), titleOf(id), id, selected === id)).join('')}</div>`).join('')}<div class="nav-group">${navItem('#roadmap', '后续方向', '', currentRoute.name === 'roadmap')}${navItem('#sources', '参考资料', '', ['sources', 'source'].includes(currentRoute.name))}</div></nav>`;
  }

  function renderHome() {
    let html = heading('从一句话，读懂整套座舱 AI', '从用户开口，到车辆或服务真的把事情办成。沿着同一条链，读清每个模块为什么出现、拿到什么、做完后交给谁。', { crumbs: [], actions: '<a class="button-link primary" href="#module/V">从语音开始</a><a class="button-link" href="#map">查看完整图</a>' });
    html += renderCourseLecture();
    html += section('main-chain', '沿着这条主链继续读', `<div class="reading-path" aria-label="主链路阅读顺序">${mainIds.map((id, index) => `${index ? '<span class="path-arrow" aria-hidden="true">→</span>' : ''}<a class="path-link" href="${routeHref('module', id)}"><span class="path-number">${index + 1}</span>${esc(titleOf(id))}</a>`).join('')}</div>${DATA.overviewSvg ? figure({ key: 'overview', title: '从语音到执行与反馈', caption: '箭头串起主链与反馈；点线提供相关模块的阅读入口。', svg: DATA.overviewSvg, pageId: 'home' }) : ''}`);
    if (walkthroughs.length) html += section('walkthrough-entry', '换成具体场景，从头走一遍', renderWalkthroughList(walkthroughs, true));
    html += section('directory', '按你卡住的问题找模块', groups.map(group => `<div class="directory-group"><h3>${esc(group.title)}</h3>${group.ids.map(id => `<a class="directory-row" href="${routeHref('module', id)}"><span class="directory-name">${esc(titleOf(id))}<span class="directory-code">${esc(id)}</span></span><p>${fmt(pageOf(id).summary)}</p><span class="arrow" aria-hidden="true">↗</span></a>`).join('')}</div>`).join(''));
    html += section('learning-rule', '产品经理需要懂到什么程度', `<div class="lecture-prose"><p>你需要能从一条真实请求讲到最终结果，再对自己负责的 Planner 和触发器深入到能够评审、定位和验收。其他模块先掌握交接条件：它要哪些输入、会返回什么、什么时候会失败，以及由谁负责修正。这样遇到问题时，你就知道该追哪一段。</p><p>拿“去昨天那家游泳馆”练习：先说明系统是否知道地点；不知道时怎么查，查到多个候选时怎么问；地址明确后谁规划路线，什么反馈允许继续导航。接着再解释，如果用户中途改口，哪些计算要停止、哪些已发动作需要取消、最后要给用户什么反馈。</p><p>AI 能力就落在这些判断中：能否理解意图、发现信息缺口、选对工具、安排动作依赖、理解返回结果。产品经理还要设计能检验这些能力的正反例，把模型问题与规则、状态缺失、资源限制、执行时序问题区分开，再证明改动有效。</p></div>${basicTable({columns:['学习范围','做到什么程度','拿什么检验自己'],rows:[['整条主链','说明每次交接由谁负责，成功后去哪，失败后怎么办。','用同一次请求的输入、判断、工具反馈和用户结果，完整复盘。'],['主责 Planner 与触发器','能够独立评审条件、工具依赖、任务状态、取消及异常分支。','拿出可复现的问题、正反例和验收口径，推动真实结果改善。'],['协作模块','说清输入、输出、权限、时效和完成条件，知道该找谁。','能提出具体交接要求，知道缺少哪条信息会影响判断。']]})}<div class="lecture-prose"><p>是否考虑下一份工作，不必以“所有底层实现都学完”为门槛。更有价值的判断是：你是否已经独立负责过一段完整业务，能解释关键取舍，并用结果说明自己的贡献。做到了，再结合新岗位能给你的责任与成长机会作选择。</p></div>`);
    return html;
  }

  function renderCourseLecture() {
    return section('course-lecture', '先把这一次出行，完整讲给你听', `<div class="lecture-prose course-lecture">
      <p>假设你坐在车里说“去昨天那家游泳馆，十分钟后提醒我休息”。我们用这句话理解整条业务链。它包含一个现在要办的导航目标，以及一个要留到未来的提醒目标；这是教学场景，实际能办哪些事，要看这辆车已接入的能力。</p>
      <h3>先让一句声音，成为可以交办的请求</h3>
      <p>麦克风最先收到声音。${moduleLink('V', '语音模块')}清理噪声、判断声音来自哪个座位，再一边识别文字，一边观察你是否说完。中间停一下，系统可以提前准备；最后一句定稿，才把完整文字交出去。如果屏幕上先出现“去昨天那家游泳馆”，这时你又补“附近的餐厅”，后面的系统必须以最后的意思为准。</p>
      <p>${moduleLink('R', '入口与端云采信')}接着判断这句话有没有被助手接纳，以及本地或云端谁来承接。两边同时算出结果也只能按规则采用，不能让同一句指令执行两次。若你是在说屏幕上一个按钮，${moduleLink('W', '可见即可说')}还会核对它是否属于当前页面的有效词。没有匹配到，再回普通业务入口继续处理。</p>
      <h3>Planner 开始决定之前，先把缺的事实找出来</h3>
      <p>有效输入到达${moduleLink('M', '输入管理')}时，系统可能仍在播上一句，或者等待旧工具结果。输入管理先安排新旧输入如何合并、等待或开启下一轮。随后，${moduleLink('C', 'Context 上下文')}把当前车况、相关历史和必要事实交给 Planner。这里最重要的未知项是“昨天那家”到底是哪一家。${moduleLink('K', '身份与记忆')}负责让系统查到当前用户相关的记录；没有查到，或者查到两家，就还不能擅自选一个地址。</p>
      <p>${moduleLink('D', 'Planner，也叫 Director')}据此决定下一步。需要先查记忆，就在 action_list，也就是本轮动作清单里列出查询；等查询结果回来，再决定是澄清还是规划路线。它可以先告诉你正在查，但这句话不表示目的地已经确定。路线需要明确地址，只有前一步提供了足够信息，后一步才能继续。</p>
      <h3>动作清单怎样变成用户真正得到的结果</h3>
      <p>${moduleLink('E', '工具执行层')}接到动作后，把参数交给对应的导航、车控或其他服务。${moduleLink('F', '能力准入与 Agent 协议')}约束这辆车能调用什么、参数怎样表达，以及反馈如何返回。若进入已接入的舱驾协同场景，才进一步由${moduleLink('DR', '司机 Agent')}处理相关导航、驾驶或停泊车协作；普通导航不能自动等同于启动智驾。</p>
      <p>下游用 tool_feedback，也就是工具处理反馈，把发生的事情交回来。Planner 看到“找到地址”，可以继续规划；看到“路线失败”，就要处理失败；只看到“已受理”，还不能把目标写成完成。${moduleLink('O', '输出模块')}再把合适的话、卡片或其他结果送到用户面前。文字生成、声音播完、车辆动作完成要分别看。如果你中途说“等等，换一家”，${moduleLink('I', '打断与恢复')}还要分别处理停播、旧计算和已经发出的动作，停止声音本身不会撤销已经发生的车辆变化。</p>
      <h3>十分钟后才做的事，怎样留在系统里</h3>
      <p>“十分钟后提醒我休息”不能只留在模型的一句回答里。${moduleLink('T', '任务服务')}要保存后续目标、条件和生命周期，再由合适的${moduleLink('G', '云端触发器')}或${moduleLink('L', '端侧触发器')}负责观察条件。${moduleLink('P', '配置平台')}提供可发布的场景规则，${moduleLink('B', '信号与当前状态')}提供实际发生的时间、车辆或环境变化。十分钟到了，只能先确认条件命中；后面还要有人接到通知，决定执行什么，最后用户才会收到提醒。</p>
      <p>如果把条件换成“看到孩子睡着时提醒我”，则还需要${moduleLink('A', '视觉感知')}提供相应事实。${moduleLink('S', 'Advisor 主动服务')}可以结合环境提出建议，是否采纳仍要回到本轮决策。${moduleLink('U', '任务中心与卡片')}帮助用户看见、管理任务，${moduleLink('H', '静默展示与 PHUD')}处理适合轻提示的输出。后台条件成立、卡片出现和声音真正播放，是这段链路里不同的结果。</p>
      <h3>发生过的事，怎样让下一次判断更可靠</h3>
      <p>在这些过程里，系统会产生${moduleLink('EV', '事件')}，例如用户改了目的地、任务状态改变或某个观察结果到达。事件把变化告诉需要它的模块。${moduleLink('EL', '事件日志')}则保留可回查的记录，让后续能回答“当时看到了什么，为什么走了这条路”。它们和记忆用途不同，不能把每一条临时事件都当成用户长期偏好。</p>
      <p>如果这次结果不对，沿同一次请求找断点，就能分清声音听错、上下文缺失、Planner 计划错误，还是工具没有把动作做成。${moduleLink('SE', '评测与自进化')}把这些问题变成样本和可比较的验证，再决定改提示、规则、工具或模型。你的产品能力，也体现在能否把一个坏结果追到具体环节，并证明改动之后这类问题真的减少。</p>
      <p>有了这条主线，再进每一课就不必从零猜模块。先读这一课承接了什么，再顺着图下的讲解走节点，最后看它把什么交回主链。你可以先从语音一路读到输出，再回头深入自己负责的 Planner 和触发器。</p>
    </div>`);
  }

  function renderWalkthroughList(items, compact = false) {
    return `<div class="walkthrough-list${compact ? ' compact' : ''}">${arr(items).map((item, index) => `<article class="walkthrough-summary" data-walkthrough-entry="${esc(item.id)}"><div class="walkthrough-summary-number">${String(index + 1).padStart(2, '0')}</div><div><${compact ? 'h3' : 'h2'}><a href="${routeHref('walkthrough', item.id)}">${esc(item.title)}</a></${compact ? 'h3' : 'h2'}><p class="walkthrough-summary-query">${fmt(item.query)}</p><a href="${routeHref('walkthrough', item.id)}">从头走一遍 →</a></div></article>`).join('')}</div>`;
  }

  function renderWalkthroughIndex() {
    return heading('跟着一句话，把事情办完', '选一个场景，从用户开口开始，沿着每次判断、等待和反馈读到结果。', { crumbs: [{ label: '完整场景走查' }] }) + section('walkthrough-catalog', '从具体诉求开始', renderWalkthroughList(walkthroughs));
  }

  function walkthroughStepDomId(walkthroughId, stepId) { return `walkthrough-${uid(walkthroughId)}-step-${uid(stepId)}`; }

  function renderWalkthrough(id) {
    const item = walkthroughById.get(id);
    if (!item) return renderMissing('没有找到这条场景', '请从场景目录重新选择。');
    const steps = arr(item.steps);
    const allSourceIds = unique([...arr(item.sourceIds), ...steps.flatMap(step => arr(step.sourceIds))]);
    let html = heading(item.title, '', { crumbs: [{ label: '完整场景走查', href: '#walkthrough' }, { label: item.title }] });
    html += `<div class="lecture-prose walkthrough-opening">${arr(item.intro).map(para).join('')}</div>`;
    html += `<nav class="walkthrough-step-nav" aria-label="本场景步骤"><ol>${steps.map((step, index) => `<li><a href="${routeHref('walkthrough', id, 'step', step.id)}"><span class="walkthrough-nav-number">${String(index + 1).padStart(2, '0')}</span><strong>${esc(step.title)}</strong></a></li>`).join('')}</ol></nav>`;
    html += steps.map((step, index) => renderWalkthroughStep(item, step, index)).join('');
    html += `<div class="lecture-prose walkthrough-closing">${arr(item.closing).map(para).join('')}</div>`;
    html += `<details class="reference-archive source-appendix"><summary>参考资料</summary><div class="reference-content">${renderSourceList(allSourceIds)}</div></details>`;
    return html;
  }

  function renderWalkthroughStep(item, step, index) {
    return `<section class="section walkthrough-step" id="${walkthroughStepDomId(item.id, step.id)}" data-walkthrough-step="${esc(step.id)}" data-section-title="${index + 1}. ${esc(step.title)}" tabindex="-1"><div class="walkthrough-step-heading"><span class="walkthrough-step-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><h2>${esc(step.title)}</h2></div><div class="lecture-prose">${arr(step.paragraphs).map(para).join('')}</div><div class="walkthrough-module-links">${arr(step.moduleIds).filter(id => pageIds.includes(id)).map(id => moduleLink(id)).join('')}</div></section>`;
  }

  function figure(options) {
    const key = `${options.key || 'diagram'}-${++diagramSequence}`;
    diagramRegistry.set(key, options);
    const caption = options.caption ? options.deferCaption ? `<details class="figure-evidence"><summary>图的阅读说明</summary><p>${fmt(options.caption)}</p></details>` : `<p>${fmt(options.caption)}</p>` : '';
    return `<figure class="flow-figure" data-diagram="${esc(key)}" data-diagram-theme="${options.svg === DATA.originalSvg ? 'original' : 'adaptive'}"><figcaption class="figure-header"><div><h3>${esc(options.title)}</h3>${caption}</div><div class="figure-tools"><button type="button" data-figure-zoom="out" aria-label="缩小此图">−</button><output aria-label="图形缩放比例">100%</output><button type="button" data-figure-zoom="in" aria-label="放大此图">+</button><button type="button" data-figure-mode="fit">看全宽</button><button type="button" data-figure-mode="readable">读细节</button><button type="button" data-open-diagram="${esc(key)}">放大阅读</button></div></figcaption><div class="svg-shell" tabindex="0" role="region" aria-label="${esc(options.title)}，可滚动并点击节点"></div><div class="figure-caption">${options.deferCaption ? '图下有连续讲解，可对照编号沿箭头阅读。放大阅读可查看图中文字。' : options.crop ? '完整原图的当前模块视窗。默认按可读字号展开，可横向与纵向滚动；“看全宽”用于定位，全节点解释在下方保留。' : '图内节点可点击；“看全宽”用于定位，“读细节”或“放大阅读”查看清晰文字。'}</div></figure>`;
  }

  function teachingText(value, page, guide, flowId) {
    const ids = arr(guide?.nodeIds).slice().sort((a, b) => b.length - a.length);
    if (!ids.length) return fmt(value);
    const pattern = new RegExp(`(^|[^A-Za-z0-9_-])(${ids.map(id => id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})(?=$|[^A-Za-z0-9_-])`, 'g');
    let output = '', cursor = 0;
    for (const match of str(value).matchAll(pattern)) {
      const start = match.index + match[1].length, id = match[2];
      output += fmt(str(value).slice(cursor, start));
      const node = nodeById.get(id);
      const href = flowId ? routeHref('module', page.id, 'flow', flowId, 'step', id) : node ? routeHref('module', node.moduleId, 'node', id) : routeHref('module', page.id);
      output += `<a class="guide-node-link" href="${href}" title="查看 ${esc(id)} 的具体说明">${esc(id)}</a>`;
      cursor = start + id.length;
    }
    return output + fmt(str(value).slice(cursor));
  }

  function renderGuide(page, key) {
    const guide = page.teaching?.guides?.[key];
    if (!guide) return '';
    return `<article class="diagram-lesson lecture-prose" id="guide-${uid(key === 'base' ? 'base-' + page.id : key)}" data-diagram-guide="${esc(key)}"><h3>${esc(guide.title)}</h3>${arr(guide.paragraphs).map(text => `<p>${teachingText(text, page, guide, key === 'base' ? null : key)}</p>`).join('')}</article>`;
  }

  function svgMarkup(options, prefix) {
    const raw = str(options.svg);
    if (!raw.trim()) return '';
    const cacheKey = `${options.key}|${options.crop ? options.crop.join(',') : ''}`;
    let cached = svgCache.get(cacheKey);
    if (!cached || cached.raw !== raw) {
      const parsed = new DOMParser().parseFromString(raw, 'image/svg+xml');
      const svg = parsed.documentElement;
      if (svg.tagName.toLowerCase() !== 'svg' || parsed.querySelector('parsererror')) return '<p class="error-box">这张图无法解析。请先阅读下面的节点解释。</p>';
      $$('script,foreignObject,iframe,object,embed', svg).forEach(element => element.remove());
      $$('*', svg).forEach(element => {
        [...element.attributes].forEach(attribute => {
          const name = attribute.name.toLowerCase();
          if (name.startsWith('on') || ((name === 'href' || name === 'xlink:href') && !attribute.value.startsWith('#'))) element.removeAttribute(attribute.name);
        });
      });
      const width = Number(svg.getAttribute('width')) || Number(svg.getAttribute('viewBox')?.split(/\s+/)[2]) || 1000;
      const height = Number(svg.getAttribute('height')) || Number(svg.getAttribute('viewBox')?.split(/\s+/)[3]) || 600;
      if (!svg.getAttribute('viewBox')) svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      if (options.crop) svg.setAttribute('viewBox', options.crop.join(' '));
      if (options.crop && options.svg === DATA.originalSvg) {
        const [x, y, w, h] = options.crop;
        const intersects = box => box && box.x < x + w && box.x + box.w > x && box.y < y + h && box.y + box.h > y;
        $$('[data-node]', svg).forEach(element => { if (!intersects(nodeById.get(element.getAttribute('data-node')))) element.remove(); });
        $$('[data-tool]', svg).forEach(element => { if (!intersects(toolById.get(element.getAttribute('data-tool')))) element.remove(); });
        $$('[data-module]', svg).forEach(element => { if (!intersects(moduleById.get(element.getAttribute('data-module')))) element.remove(); });
      }
      svg.removeAttribute('width'); svg.removeAttribute('height');
      svg.setAttribute('role', 'group'); svg.setAttribute('aria-label', options.title || '业务流程图');
      $$('[data-page],[data-node],[data-step],[data-tool],[data-module]', svg).forEach(element => {
        element.setAttribute('tabindex', '0'); element.setAttribute('role', 'link');
        const text = element.querySelector('text')?.textContent || element.getAttribute('data-page') || element.getAttribute('data-node') || element.getAttribute('data-step') || element.getAttribute('data-tool') || element.getAttribute('data-module');
        element.setAttribute('aria-label', `阅读：${text}`);
      });
      cached = { raw, markup: new XMLSerializer().serializeToString(svg) };
      svgCache.set(cacheKey, cached);
    }
    const ids = [];
    let markup = cached.markup.replace(/(\s)id="([^"]+)"/g, (_, space, id) => { ids.push(id); return `${space}id="${prefix}-${id}"`; });
    for (const id of ids) {
      const pattern = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      markup = markup.replace(new RegExp(`url\\(#${pattern}\\)`, 'g'), `url(#${prefix}-${id})`).replace(new RegExp(`(href=")#${pattern}("|')`, 'g'), `$1#${prefix}-${id}$2`);
    }
    return markup;
  }

  function mountFigures(scope = root) {
    $$('[data-diagram]', scope).forEach((element, index) => {
      const options = diagramRegistry.get(element.dataset.diagram);
      if (!options) return;
      const shell = $('.svg-shell', element);
      shell.innerHTML = svgMarkup(options, `inline-${index}-${diagramSequence}`);
      const svg = $('svg', shell);
      if (svg) {
        const intrinsicWidth = Number(svg.getAttribute('viewBox').split(/\s+/)[2]) || 680;
        const fitWidth = Math.max(280, shell.clientWidth - 28) || 680;
        const readableWidth = Math.max(fitWidth, intrinsicWidth * (options.svg === DATA.originalSvg ? .68 : 1));
        element.dataset.readableWidth = String(readableWidth);
        element.dataset.fitWidth = String(fitWidth);
        svg.style.minWidth = '0';
        svg.style.width = `${readableWidth}px`;
      }
      element.dataset.scale = '1';
    });
  }

  function renderModule(id) {
    if (!pageIds.includes(id)) return renderMissing('没有这个模块', '请从目录选择已有模块。');
    const page = pageOf(id), module = moduleById.get(id), teaching = page.teaching;
    let html = heading(page.title, teaching ? '' : page.summary, { eyebrow: `豆包汽车 · 第 ${pageIds.indexOf(id) + 1} 课`, crumbs: [{ label: titleOf(id) }], actions: `<a class="button-link" href="${routeHref('module', id, 'section', module ? 'detailed-flow' : 'flows')}">看图与讲解</a><a class="button-link" href="${routeHref('module', id, 'section', 'questions')}">关键问题</a>` });
    if (teaching) {
      html += `<div class="lecture-opening lecture-prose" data-teaching-intro="${esc(id)}">${teaching.intro.map(para).join('')}</div>`;
      html += teaching.lessons.map(lesson => section(lesson.id, lesson.title, `<div class="lecture-prose" data-teaching-lesson="${esc(lesson.id)}">${lesson.paragraphs.map(para).join('')}</div>`)).join('');
    }
    if (module && DATA.originalSvg) html += section('detailed-flow', '把刚才的过程放回完整图', figure({ key: `base-${id}`, title: module.title, caption: module.subtitle, deferCaption: true, svg: DATA.originalSvg, crop: [module.x - 35, module.y - 35, module.w + 70, module.h + 70], pageId: id }) + renderGuide(page, 'base'));
    if (arr(page.flows).length) html += section('flows', module ? '把关键分支再走一遍' : '沿图把整个过程走一遍', page.flows.map(flow => renderFlow(page, flow)).join(''));
    if (teaching) html += section('continue-chain', '这一课的结果，接着交给谁', `<div class="lecture-prose" data-teaching-closing="${esc(id)}">${teaching.closing.map(para).join('')}</div>`);
    if (module) html += section('nodes', '查一个具体节点', `<details class="reference-archive"><summary>展开节点说明</summary><div class="reference-content"><div class="page-actions"><button type="button" data-expand-nodes="all">展开全部节点</button><button type="button" data-expand-nodes="none">收起节点</button></div><div class="node-list">${module.nodes.map(renderNodeDisclosure).join('')}</div></div></details>`);
    if (arr(page.cases).length) html += section('cases', '多练几个场景', `<details class="reference-archive"><summary>展开场景讲解</summary><div class="reference-content">${page.cases.map(renderCase).join('')}</div></details>`);
    if (arr(page.questions).length) html += section('questions', '你需要能回答的关键问题', renderQuestions(id, page.questions));
    if (arr(page.metrics).length) html += section('metrics', '用什么指标检查效果', renderMetrics(page.metrics));
    if (arr(page.roadmap).length) html += section('roadmap', '接下来可以怎样改进', renderRoadmap(page.roadmap));
    if (arr(page.referenceTables).length) html += section('reference-tables', '需要逐项对照时，打开这张表', `<details class="reference-archive"><summary>展开字段与规则对照</summary><div class="reference-content">${page.referenceTables.map(item => section(`content-${uid(item.id)}`, item.title, basicTable(item.table))).join('')}</div></details>`);
    if (arr(page.terms).length) html += section('terms', '术语解释', `<details class="reference-archive"><summary>展开术语</summary><dl class="term-list reference-content">${page.terms.map((term, index) => `<div class="term-item" id="term-${index}"><dt>${esc(term.term)}</dt><dd>${fmt(term.meaning)}</dd></div>`).join('')}</dl></details>`);
    const related = relationships(id, page);
    if (related.length) html += section('related', '继续看前后相连的模块', related.map(item => `<div class="related-row">${moduleLink(item.id, item.label || titleOf(item.id))}<p>${fmt(item.reason)}</p></div>`).join(''));
    const sceneLinks = walkthroughs.flatMap(item => { const step = arr(item.steps).find(step => arr(step.moduleIds).includes(id)); return step ? [{ item, step }] : []; });
    if (sceneLinks.length) html += section('whole-scenarios', '放回完整场景理解', `<ul class="relation-list">${sceneLinks.map(({ item, step }) => `<li><a href="${routeHref('walkthrough', item.id, 'step', step.id)}">${esc(item.title)}</a></li>`).join('')}</ul>`);
    html += `<details class="reference-archive source-appendix" id="sources"><summary>参考资料</summary><div class="reference-content">${renderSourceList(page.sourceIds)}</div></details>`;
    const index = pageIds.indexOf(id);
    html += `<footer class="article-footer">${index > 0 ? `<a href="${routeHref('module', pageIds[index - 1])}"><span>上一模块</span>← ${esc(titleOf(pageIds[index - 1]))}</a>` : '<span></span>'}${index < pageIds.length - 1 ? `<a href="${routeHref('module', pageIds[index + 1])}"><span>下一模块</span>${esc(titleOf(pageIds[index + 1]))} →</a>` : '<a href="#home">返回全部模块 →</a>'}</footer>`;
    return html;
  }

  function renderFlow(page, flow) {
    const flowId = flow.id || `flow-${page.id}`;
    const diagram = DATA.diagrams?.[flowId];
    const frame = diagram ? figure({ key: flowId, title: flow.title, caption: flow.caption, deferCaption: !!page.teaching, svg: diagram, pageId: page.id, flowId }) : `<div class="fallback-notice">${esc(flow.title)}：图形尚未注入；下面保留完整步骤与分支，不影响逐步阅读。</div>`;
    const steps = `<div class="flow-step-list">${arr(flow.nodes).map(node => `<article class="flow-step" id="step-${uid(flowId)}-${uid(node.id)}"><h4>${esc(node.title)} ${node.status ? label(node.status, statusClass(node.status)) : ''}</h4>${arr(node.body).map(para).join('')}${arr(flow.edges).some(edge => edge.from === node.id) ? `<div class="step-outgoing">${flow.edges.filter(edge => edge.from === node.id).map(edge => { const target = flow.nodes.find(candidate => candidate.id === edge.to); return `<div>${edge.planned ? '方案分支 · ' : ''}${fmt(edge.label || '下一步')} → <a href="${routeHref('module', page.id, 'flow', flowId, 'step', edge.to)}">${esc(target?.title || edge.to)}</a></div>`; }).join('')}</div>` : ''}</article>`).join('')}</div>${sourceStrip(flow.sourceIds)}`;
    return `<div class="flow-section" id="flow-${uid(flowId)}">${frame}${renderGuide(page, flowId)}${page.teaching ? `<details class="reference-archive flow-reference"><summary>需要核对某一格时，展开节点与连线记录</summary><div class="reference-content">${steps}</div></details>` : steps}</div>`;
  }

  function renderNodeDisclosure(node) {
    return `<details class="node-detail" id="base-node-${uid(node.id)}" data-base-node="${esc(node.id)}"><summary><span class="node-id">${esc(node.id)}</span><span class="node-title">${esc(node.title)}</span></summary><div class="node-body lecture-prose">${arr(node.paragraphs).map(para).join('')}<div class="node-links"><a href="${routeHref('node', node.id)}">看这一环的前后连接 →</a></div></div></details>`;
  }

  function renderCase(item) {
    return `<article class="case-article"><h3>${esc(item.title)}</h3>${item.query ? `<blockquote class="query-block">${fmt(item.query)}</blockquote>` : ''}<ol class="case-steps">${arr(item.steps).map(step => `<li><span class="actor">${esc(step.actor)}</span><span>${fmt(step.action)}</span></li>`).join('')}</ol>${item.failure ? `<div class="case-failure"><strong>失败与边界</strong><br>${fmt(item.failure)}</div>` : ''}${sourceStrip(item.sourceIds)}</article>`;
  }

  function renderQuestions(id, questions) {
    return `<div class="question-list">${arr(questions).map((question, index) => `<article class="question-item" id="question-${index}"><h3>${esc(question.q)}</h3>${question.why ? para(question.why) : ''}<details class="answer-disclosure"><summary>看参考回答</summary><div class="answer-body lecture-prose">${para(question.goodAnswer || question.pass || '')}${question.evidence ? para(question.evidence) : ''}</div></details></article>`).join('')}</div>`;
  }

  function renderMetrics(metrics) {
    return `<div class="table-scroll" tabindex="0" role="region" aria-label="指标定义与适用边界"><table class="metric-table"><thead><tr><th scope="col">指标</th><th scope="col">怎么定义与观察</th><th scope="col">要分哪些情况</th><th scope="col">证据 / 目标状态</th></tr></thead><tbody>${arr(metrics).map(metric => `<tr><td>${esc(metric.name)}</td><td>${fmt(metric.definition)}</td><td>${fmt(metric.segment || '按车辆配置和实际场景分别检查。')}</td><td>${fmt(metric.targetStatus || metric.status || '需结合项目实际测量')}</td></tr>`).join('')}</tbody></table></div>`;
  }

  function renderRoadmap(items) {
    return arr(items).map(item => `<article class="roadmap-item"><div class="roadmap-heading"><h3>${esc(item.title)}</h3>${label(item.status || '状态待核', statusClass(item.status || '待核'))}</div><p><span class="roadmap-label">改变什么</span>${fmt(item.change)}</p>${item.why ? `<p><span class="roadmap-label">为什么需要</span>${fmt(item.why)}</p>` : ''}${item.verify ? `<p><span class="roadmap-label">怎样才算做成</span>${fmt(item.verify)}</p>` : ''}${sourceStrip(item.sourceIds)}</article>`).join('');
  }

  function relationships(id, page) {
    const manual = arr(page.related).filter(item => pageIds.includes(item.id));
    const known = new Set(manual.map(item => item.id));
    const inferred = [];
    for (const edge of edges) {
      const from = nodeById.get(edge.from);
      const to = nodeById.get(edge.to);
      if (!from || !to || from.moduleId === to.moduleId) continue;
      const other = from.moduleId === id ? to.moduleId : to.moduleId === id ? from.moduleId : null;
      if (!other || known.has(other)) continue;
      known.add(other);
      inferred.push({ id: other, label: titleOf(other), reason: `${from.moduleId === id ? '本模块交出' : '本模块接收'}：${from.title} → ${to.title}。${edge.label || ''}${edge.relation === 'future' || edge.type === 'planned' ? '（方案关联，不作为当前必经链路。）' : ''}` });
    }
    return [...manual, ...inferred];
  }

  function renderNode(id) {
    const node = nodeById.get(id);
    if (!node) return renderMissing('找不到这个节点', '请从完整图或模块目录重新选择。');
    const module = moduleById.get(node.moduleId), page = pageOf(node.moduleId);
    const sourceIds = arr(node.sourceIds).length ? node.sourceIds : module?.sourceIds;
    let html = heading(node.title, '', { eyebrow: node.id, crumbs: [{ label: titleOf(node.moduleId), href: routeHref('module', node.moduleId) }, { label: node.id }], actions: `<a class="button-link" href="${routeHref('module', node.moduleId, 'node', id)}">回到这一课</a>` });
    html += section('explanation', '这一环发生了什么', `<div class="lecture-prose">${arr(node.paragraphs).map(para).join('')}</div>`);
    html += section('connections', '从哪来，往哪去', `<div class="relation-columns"><div><h3>上游交给它什么</h3>${renderEdgeList(edges.filter(edge => edge.to === id), 'from')}</div><div><h3>它再交给谁</h3>${renderEdgeList(edges.filter(edge => edge.from === id), 'to')}</div></div>`);
    if (DATA.originalSvg) {
      const guide = page.teaching?.guides?.base;
      const pattern = new RegExp('(^|[^A-Za-z0-9_-])' + id + '(?=$|[^A-Za-z0-9_-])');
      const paragraphs = arr(guide?.paragraphs).filter(text => pattern.test(text));
      html += section('position', '对照图继续读', figure({ key: `node-${id}`, title: `${id} 在 ${titleOf(node.moduleId)} 中的位置`, caption: '点击相邻节点，可以继续追踪前后的处理。', svg: DATA.originalSvg, crop: [Math.max(0, node.x - 380), Math.max(0, node.y - 260), node.w + 760, node.h + 520], pageId: node.moduleId }) + `<div class="lecture-prose">${paragraphs.map(text => `<p>${teachingText(text, page, guide)}</p>`).join('')}</div>`);
    }
    html += `<details class="reference-archive source-appendix"><summary>参考资料</summary><div class="reference-content">${renderSourceList(sourceIds)}</div></details>`;
    return html;
  }

  function renderEdgeList(items, endpoint) {
    if (!items.length) return '<p class="research-note">当前图没有这一方向的连接。可返回本课继续读完整过程。</p>';
    return `<ul class="relation-list">${items.map(edge => { const target = nodeById.get(edge[endpoint]); const relation = edge.relation || edge.type || '业务交接'; const status = { future: '后续方案', source_design: '业务方案', reference: '参考关系', planned: '方案连线', signal: '数据供给', data: '数据供给', internal: '模块内交接', cross: '跨模块交接' }[relation] || '业务交接'; return `<li>${nodeLink(edge[endpoint])}${target ? `<div class="relation-meta">${esc(titleOf(target.moduleId))} · ${esc(status)}</div>` : ''}<p>${fmt(edge.label || '沿此连接交给下一环。')}</p></li>`; }).join('')}</ul>`;
  }

  function renderTools() {
    const categories = unique(tools.map(tool => tool.category || '其他'));
    let html = heading('工具怎样把事情办成', '从具体用途开始，读清它需要哪些信息、内部怎样处理、反馈回来后谁继续接手。', { crumbs: [{ label: '工具与执行机制' }] });
    html += `<p class="prose">${fmt(base.toolCountExplanation)}</p><nav class="tools-categories" aria-label="工具分类">${categories.map((category, index) => `<a href="#tools/category/${index}">${esc(category)}</a>`).join('')}<a href="#tools/supplemental">专项能力</a></nav>`;
    html += categories.map((category, index) => section(`tool-category-${index}`, category, `<ul class="tool-list">${tools.filter(tool => (tool.category || '其他') === category).map(renderToolRow).join('')}</ul>`)).join('');
    html += section('supplemental', '专项能力', `<ul class="tool-list">${supplements.map(renderToolRow).join('')}</ul>`);
    return html;
  }

  function renderToolRow(tool) {
    return `<li class="tool-row"><div><h3><a href="${routeHref('tool', tool.id)}">${esc(tool.label || tool.name)}</a></h3><div class="tool-name">${esc(tool.name)} · ${esc(tool.id)}</div></div><p>${fmt(tool.status || '需确认该车是否已接入')}</p><a href="${routeHref('tool', tool.id)}" aria-label="查看${esc(tool.label || tool.name)}完整机制">读机制 →</a></li>`;
  }

  function renderTool(id) {
    const tool = toolById.get(id) || allTools.find(item => item.name === id);
    if (!tool) return renderMissing('找不到这个工具', '请搜索英文标识或中文用途。');
    let html = heading(tool.label || tool.name, '', { crumbs: [{ label: '工具与执行机制', href: '#tools' }, { label: tool.label || tool.name }], meta: `<code>${esc(tool.name)}</code>` });
    html += `<div class="lecture-prose">${para(tool.intro)}</div>`;
    html += section('mechanism', '从调用开始，一直读到结果', `<div class="lecture-prose">${arr(tool.paragraphs).map(para).join('')}</div>`);
    html += section('scope', '使用条件', `<div class="lecture-prose">${para(tool.status)}</div>`);
    html += section('in-chain', '把这个工具接回主链', `<div class="related-row">${moduleLink('D')}<p>看 Planner 怎样明确目标、补齐信息并选中这个工具。</p></div><div class="related-row">${moduleLink('E')}<p>看动作怎样下发，反馈怎样回来，以及何时继续下一步。</p></div>`);
    html += `<details class="reference-archive source-appendix"><summary>参考资料</summary><div class="reference-content">${renderSourceList(unique([...arr(tool.sourceIds), tool.sourceId]))}</div></details>`;
    return html;
  }

  function sourceConsumers(id) {
    return pageIds.filter(pageId => { const page = pageOf(pageId); return arr(page.sourceIds).includes(id) || arr(page.sections).some(section => arr(section.sourceIds).includes(id)) || arr(page.flows).some(flow => arr(flow.sourceIds).includes(id)); });
  }
  function renderSourceList(ids, showConsumers = false) {
    const list = unique(arr(ids)).map(id => sourceById.get(id)).filter(Boolean);
    if (!list.length) return '';
    return `<ul class="source-list">${list.map(source => `<li class="source-item" id="source-${uid(source.id)}"><h3>${safeUrl(source.url) ? `<a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.title)} ↗</a>` : esc(source.title)}</h3>${showConsumers ? `<div class="source-consumers">${sourceConsumers(source.id).map(id => moduleLink(id)).join('')}</div>` : ''}</li>`).join('')}</ul>`;
  }

  function renderSources() {
    return heading('参考资料', '这里集中保留原文入口，方便需要时对照具体定义。', { crumbs: [{ label: '参考资料' }] }) + section('all-sources', '按原文查找', renderSourceList(sources.map(source => source.id), true));
  }

  function renderSource(id) {
    const source = sourceById.get(id);
    if (!source) return renderMissing('没有这个来源条目', '请从参考资料目录选择。');
    const consumers = sourceConsumers(id);
    const relatedTools = allTools.filter(tool => tool.sourceId === id || arr(tool.sourceIds).includes(id));
    let html = heading(source.title, '', { crumbs: [{ label: '参考资料', href: '#sources' }, { label: source.title }], actions: safeUrl(source.url) ? `<a class="button-link primary" href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">打开原文 ↗</a>` : '' });
    if (consumers.length) html += section('source-use', '相关课程', consumers.map(id => `<div class="related-row">${moduleLink(id)}<p>${fmt(pageOf(id).summary)}</p></div>`).join(''));
    if (relatedTools.length) html += section('source-tools', '相关工具', `<ul class="tool-list">${relatedTools.map(renderToolRow).join('')}</ul>`);
    return html;
  }

  function renderMap() {
    let html = heading('完整业务架构图', '沿着箭头看交接；点开节点，再读这一环的解释和前后连接。', { crumbs: [{ label: '完整业务架构图' }] });
    if (DATA.overviewSvg) html += section('overview', '先沿主链找到位置', figure({ key: 'map-overview', title: '从语音到执行与反馈', caption: '箭头表示主链和回流；点线提供相关模块入口。', svg: DATA.overviewSvg, pageId: 'home' }));
    if (DATA.originalSvg) html += section('original', '全部模块、节点与工具', figure({ key: 'original-map', title: '完整业务流程', caption: '放大到具体节点后，沿连线继续追踪。', svg: DATA.originalSvg, pageId: 'map' }));
    html += section('module-viewports', '打开具体模块', `<div class="tools-categories">${pageIds.map(id => `<a href="${routeHref('module', id)}">${esc(titleOf(id))}</a>`).join('')}</div>`);
    return html;
  }

  function renderAllRoadmap() {
    let html = heading('后续可以怎样改进', '先看用户在哪一步受阻，再看改动能改善什么，以及怎样验证效果。', { crumbs: [{ label: '后续方向' }] });
    html += pageIds.map(pageOf).filter(page => arr(page.roadmap).length).map(page => section(`roadmap-${page.id}`, titleOf(page.id), `<p>${moduleLink(page.id, '回到这一课 →')}</p>${renderRoadmap(page.roadmap)}`)).join('');
    return html;
  }

  function renderMissing(title, description) { return heading(title, description, { eyebrow: '当前版本未找到' }) + '<div class="page-actions"><a class="button-link primary" href="#home">回到模块目录</a><a class="button-link" href="#search">搜索资料</a><a class="button-link" href="#map">查看完整图</a></div>'; }

  /* Search is deterministic local text retrieval, not an AI answer service. */
  function buildSearchIndex() {
    const index = [];
    pageIds.forEach(id => {
      const page = pageOf(id), teaching = page.teaching || {};
      const body = [...arr(teaching.intro), ...arr(teaching.lessons).flatMap(lesson => [lesson.title, ...arr(lesson.paragraphs)]), ...arr(teaching.closing)].join('\n');
      index.push({type:'module',title:page.title,shortTitle:titleOf(id),body,href:routeHref('module',id),id,moduleId:id});
      arr(teaching.lessons).forEach(lesson => index.push({type:'chapter',title:lesson.title,body:lesson.paragraphs.join('\n'),href:routeHref('module',id,'section',lesson.id),id:lesson.id,moduleId:id}));
      Object.entries(teaching.guides || {}).forEach(([key,guide]) => index.push({type:'chapter',title:guide.title,body:guide.paragraphs.join('\n'),href:routeHref('module',id,'section',`guide-${key === 'base' ? 'base-'+id : key}`),id:'guide-'+id+'-'+key,moduleId:id}));
      arr(page.referenceTables).forEach(table => index.push({type:'chapter',title:table.title,body:table.table.rows.flat().join('\n'),href:routeHref('module',id,'section',table.id),id:table.id,moduleId:id}));
      arr(page.flows).forEach(flow => arr(flow.nodes).forEach(node => index.push({type:'chapter',title:node.title,body:arr(node.body).join('\n'),href:routeHref('module',id,'flow',flow.id,'step',node.id),id:flow.id+'-'+node.id,moduleId:id})));
      arr(page.terms).forEach((term,n) => index.push({type:'term',title:term.term,body:term.meaning,href:routeHref('module',id,'term',String(n)),id:`${id}-term-${n}`,moduleId:id}));
      arr(page.questions).forEach((question,n) => index.push({type:'question',title:question.q,body:[question.why,question.goodAnswer||question.pass,question.evidence].filter(Boolean).join('\n'),href:routeHref('module',id,'question',String(n)),id:`${id}-question-${n}`,moduleId:id}));
      arr(page.metrics).forEach((metric,n) => index.push({type:'metric',title:metric.name,body:[metric.definition,metric.segment,metric.targetStatus||metric.status].filter(Boolean).join('\n'),href:routeHref('module',id,'section','metrics'),id:`${id}-metric-${n}`,moduleId:id}));
    });
    walkthroughs.forEach(item => {
      index.push({type:'walkthrough',title:item.title,body:[item.query,...arr(item.intro),...arr(item.steps).flatMap(step=>[step.title,...arr(step.paragraphs)]),...arr(item.closing)].join('\n'),href:routeHref('walkthrough',item.id),id:item.id,walkthroughId:item.id});
      arr(item.steps).forEach((step,n) => index.push({type:'walkthrough',title:`${item.title} · 第 ${n+1} 步：${step.title}`,body:step.paragraphs.join('\n'),href:routeHref('walkthrough',item.id,'step',step.id),id:item.id+':'+step.id,walkthroughId:item.id,stepId:step.id}));
    });
    nodes.forEach(node => index.push({type:'node',title:node.title,body:node.paragraphs.join('\n'),href:routeHref('node',node.id),id:node.id,moduleId:node.moduleId}));
    allTools.forEach(tool => index.push({type:'tool',title:`${tool.label||''} · ${tool.name}`,body:[tool.intro,...arr(tool.paragraphs),tool.status].join('\n'),href:routeHref('tool',tool.id),id:tool.id,supplemental:tool.supplemental}));
    sources.forEach(source => index.push({type:'source',title:source.title,body:'',href:routeHref('source',source.id),id:source.id}));
    return index.map(item=>({...item,normalizedTitle:`${item.title} ${item.shortTitle||''} ${item.id}`.toLocaleLowerCase(),normalizedBody:str(item.body).toLocaleLowerCase()}));
  }

  const searchIndex = buildSearchIndex();
  const typeLabels = {module:'模块',chapter:'讲解与图',walkthrough:'完整场景',node:'流程节点',tool:'工具',term:'术语',question:'关键问题',metric:'指标',source:'参考资料'};

  function search(query, type = 'all') {
    const terms = str(query).toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return searchIndex.filter(item => type === 'all' ? item.type !== 'source' : item.type === type).map(item => {
      let score = 0;
      for (const term of terms) {
        if (item.normalizedTitle === term) score += 40;
        else if (item.normalizedTitle.includes(term)) score += 15;
        else if (item.normalizedBody.includes(term)) score += 3;
        else return null;
      }
      if (item.type === 'module') score += 2;
      return { ...item, score };
    }).filter(Boolean).sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'zh-CN'));
  }

  function highlight(text, query) {
    const terms = str(query).trim().split(/\s+/).filter(Boolean).map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    if (!terms.length) return esc(text);
    const pattern = new RegExp(terms.join('|'), 'gi');
    let output = '', cursor = 0;
    for (const match of str(text).matchAll(pattern)) { output += esc(str(text).slice(cursor, match.index)) + `<mark>${esc(match[0])}</mark>`; cursor = match.index + match[0].length; }
    return output + esc(str(text).slice(cursor));
  }

  function snippet(text, query) {
    const source = str(text).replace(/\s+/g, ' ');
    const first = str(query).toLocaleLowerCase().trim().split(/\s+/)[0];
    const position = source.toLocaleLowerCase().indexOf(first);
    const begin = position > 60 ? position - 45 : 0;
    return `${begin ? '…' : ''}${source.slice(begin, begin + 180)}${source.length > begin + 180 ? '…' : ''}`;
  }

  function renderSearch(query) {
    const result = search(query, searchFilter);
    const allResult = search(query);
    let html = heading('搜索你真正卡住的那一步', '可以搜场景、动作、工具名称或节点编号，直接找到对应讲解。', { eyebrow: '全文搜索' });
    html += `<form class="search-page-form" id="page-search-form" role="search"><label class="sr-only" for="page-search-input">输入搜索词</label><input id="page-search-input" type="search" value="${esc(query)}" placeholder="例如：memory、取消任务、tool_feedback" autocomplete="off"><button type="submit" class="primary">查找</button></form>`;
    if (!query.trim()) return html + `<div class="empty-state"><h2>先输入一个模块、动作或现象</h2><p>可以搜中文用途，也可以搜英文工具标识。多个词用空格分开，结果需同时包含这些词。</p><div class="search-suggestions">${['Memory', '事件日志', '自进化', 'tool_feedback', '取消', '播放结束', '权限'].map(term => `<a href="#search?q=${enc(term)}">${esc(term)}</a>`).join('')}</div></div>`;
    html += `<div class="search-filters" role="group" aria-label="结果类型"><button type="button" data-search-filter="all" aria-pressed="${searchFilter === 'all'}">全部 ${allResult.length}</button>${Object.entries(typeLabels).map(([type, title]) => `<button type="button" data-search-filter="${type}" aria-pressed="${searchFilter === type}">${title} ${type === 'source' ? search(query, 'source').length : allResult.filter(item => item.type === type).length}</button>`).join('')}</div><p class="search-summary" role="status">“${esc(query)}” · ${result.length} 个匹配${result.length > searchLimit ? `，先显示 ${searchLimit} 个` : ''}</p>`;
    if (!result.length) return html + '<div class="empty-state"><h2>当前内容没有匹配项</h2><p>试试更短的词、中文业务动作或工具英文标识。没有搜到不代表产品不支持；它也可能是资料缺口、命名差异或未导入内容。</p><a href="#sources">查看参考资料 →</a></div>';
    html += `<div id="search-results">${result.slice(0, searchLimit).map(item => `<article class="search-result"><div class="result-category">${esc(typeLabels[item.type])}${item.supplemental ? ' · 专项补充' : ''}${item.moduleId ? ` · ${esc(titleOf(item.moduleId))}` : ''}</div><h3><a href="${esc(item.href)}">${highlight(item.title, query)}</a></h3><p>${highlight(snippet(item.body, query), query)}</p><div class="result-footer">${esc(item.id)}</div></article>`).join('')}</div>${result.length > searchLimit ? `<div class="search-more"><button type="button" data-more-search>继续显示后 ${Math.min(60, result.length - searchLimit)} 个结果</button></div>` : ''}`;
    return html;
  }

  function parseRoute(hash = location.hash) {
    const value = str(hash).replace(/^#/, '') || 'home';
    const split = value.indexOf('?');
    const path = split < 0 ? value : value.slice(0, split);
    const params = new URLSearchParams(split < 0 ? '' : value.slice(split + 1));
    let parts;
    try { parts = path.split('/').filter(Boolean).map(decodeURIComponent); }
    catch (_) { parts = ['invalid']; }
    return { name: parts.shift() || 'home', parts, query: params.get('q') || '' };
  }

  function navigate(hash, replace = false) {
    if (!hash.startsWith('#')) hash = `#${hash}`;
    if (location.hash === hash) { render(); return; }
    if (replace) { history.replaceState(null, '', hash); render(); }
    else location.hash = hash;
  }

  function render() {
    const scrollYBefore = window.scrollY || 0;
    if (lastRenderedHash) scrollPositions.set(lastRenderedHash, scrollYBefore);
    const routeHash = location.hash || '#home';
    const oldRoute = currentRoute;
    currentRoute = parseRoute();
    if (currentRoute.name === 'search' && currentRoute.query !== oldRoute.query) { searchFilter = 'all'; searchLimit = 60; }
    currentPageId = currentRoute.name === 'module' ? currentRoute.parts[0] : null;
    closeMenu(false);
    closeDiagram(false);
    diagramRegistry.clear();
    diagramSequence = 0;
    if (tocObserver) tocObserver.disconnect();
    let content;
    try {
      switch (currentRoute.name) {
        case 'home': content = renderHome(); break;
        case 'walkthrough': content = currentRoute.parts[0] ? renderWalkthrough(currentRoute.parts[0]) : renderWalkthroughIndex(); break;
        case 'module': content = renderModule(currentRoute.parts[0]); break;
        case 'node': content = renderNode(currentRoute.parts[0]); break;
        case 'tool': content = renderTool(currentRoute.parts[0]); break;
        case 'tools': content = renderTools(); break;
        case 'source': content = renderSource(currentRoute.parts[0]); break;
        case 'sources': content = renderSources(); break;
        case 'map': content = renderMap(); break;
        case 'roadmap': content = renderAllRoadmap(); break;
        case 'study': content = renderHome(); break;
        case 'search': content = renderSearch(currentRoute.query); break;
        default: content = renderMissing('这个页面地址不在当前网站中', '可能来自旧版本或未导入内容。原始数据没有被删除，你可以从目录或搜索重新定位。');
      }
    } catch (error) {
      content = renderMissing('这一页暂时无法显示', '请返回目录重新打开，或查看下方诊断信息。') + `<details class="answer-disclosure"><summary>查看诊断信息</summary><p class="error-box">${esc(error.message)}</p></details>`;
      window.__siteLastError = { message: error.message, route: currentRoute };
    }
    root.innerHTML = content;
    renderSidebar();
    mountFigures();
    buildToc();
    $('#global-search').value = currentRoute.name === 'search' ? currentRoute.query : '';
    const title = $('h1', root)?.textContent || '业务学习站';
    document.title = `${title} · 豆包汽车业务学习站`;
    const samePage = oldRoute.name === currentRoute.name && oldRoute.parts[0] === currentRoute.parts[0];
    const destination = routeDestination(currentRoute);
    if (destination) {
      const target = document.getElementById(destination);
      if (target) {
        if (target.tagName === 'DETAILS') target.open = true;
        for (let ancestor = target.parentElement; ancestor; ancestor = ancestor.parentElement) {
          if (ancestor.tagName === 'DETAILS') ancestor.open = true;
        }
        target.classList.add('highlight-target');
        if (currentRoute.name === 'walkthrough' && target.matches('[data-walkthrough-step]')) target.focus({ preventScroll: true });
        requestAnimationFrame(() => { target.scrollIntoView?.({ block: 'start', behavior: 'auto' }); });
      }
    } else if (samePage && ['search', 'study'].includes(currentRoute.name)) {
      requestAnimationFrame(() => window.scrollTo?.({ top: scrollYBefore, behavior: 'auto' }));
    } else if (scrollPositions.has(routeHash)) {
      requestAnimationFrame(() => window.scrollTo?.({ top: scrollPositions.get(routeHash), behavior: 'auto' }));
    } else {
      window.scrollTo?.({ top: 0, behavior: 'auto' });
      $('#main-content').focus({ preventScroll: true });
    }
    lastRenderedHash = routeHash;
    window.dispatchEvent(new CustomEvent('cockpit:render', { detail: { route: currentRoute, title } }));
  }

  function routeDestination(route) {
    const p = route.parts;
    if (route.name === 'walkthrough' && p[1] === 'step' && arr(walkthroughById.get(p[0])?.steps).some(step => step.id === p[2])) return walkthroughStepDomId(p[0], p[2]);
    if (route.name === 'module') {
      if (p[1] === 'section') {
        if (document.getElementById(p[2])) return p[2];
        if (document.getElementById(`content-${uid(p[2])}`)) return `content-${uid(p[2])}`;
        return pageOf(p[0]).legacyChapterTargets?.[p[2]] || null;
      }
      if (p[1] === 'node') return `base-node-${uid(p[2])}`;
      if (p[1] === 'flow' && p[3] === 'step') return `step-${uid(p[2])}-${uid(p[4])}`;
      if (p[1] === 'flow') return `flow-${uid(p[2])}`;
      if (p[1] === 'term') return `term-${p[2]}`;
      if (p[1] === 'question') return `question-${p[2]}`;
    }
    if (route.name === 'tools' && p[0] === 'category') return `tool-category-${p[1]}`;
    if (route.name === 'tools' && p[0] === 'supplemental') return 'supplemental';
    return null;
  }

  function buildToc() {
    const sections = $$('section[data-section-title]', root).filter(item => !item.closest('.reference-archive'));
    const moduleId = currentRoute.name === 'module' ? currentRoute.parts[0] : null;
    const walkthroughId = currentRoute.name === 'walkthrough' ? currentRoute.parts[0] : null;
    const tocHref = item => moduleId ? routeHref('module', moduleId, 'section', item.id) : walkthroughId && item.dataset.walkthroughStep ? routeHref('walkthrough', walkthroughId, 'step', item.dataset.walkthroughStep) : walkthroughId ? routeHref('walkthrough', walkthroughId) : '#' + currentRoute.name;
    if (sections.length) {
      const header = $('.page-header', root);
      header?.insertAdjacentHTML('afterend', `<nav class="mobile-page-toc" aria-label="跳到本页章节"><label for="page-section-select">本页跳转</label><select id="page-section-select"><option value="">选择要看的部分…</option>${sections.map(item => `<option value="${esc(item.id)}">${esc(item.dataset.sectionTitle)}</option>`).join('')}</select></nav>`);
    }
    toc.innerHTML = `<div class="toc-title">本页目录</div>${sections.map(item => `<a class="toc-link" href="${tocHref(item)}" data-scroll-to="${esc(item.id)}">${esc(item.dataset.sectionTitle)}</a>`).join('')}`;
    if (typeof IntersectionObserver === 'function') {
      tocObserver = new IntersectionObserver(entries => {
        const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (!visible.length) return;
        $$('.toc-link', toc).forEach(link => link.classList.toggle('active', link.dataset.scrollTo === visible[0].target.id));
      }, { rootMargin: '-100px 0px -65% 0px', threshold: 0 });
      sections.forEach(item => tocObserver.observe(item));
    }
  }

  function openMenu() {
    document.body.classList.add('nav-open'); $('#nav-backdrop').hidden = false;
    $('#menu-toggle').setAttribute('aria-expanded', 'true'); $('#menu-toggle').setAttribute('aria-label', '关闭模块目录');
    $('.nav-item[aria-current="page"]', sidebar)?.focus();
  }
  function closeMenu(restore = true) {
    const wasOpen = document.body.classList.contains('nav-open');
    document.body.classList.remove('nav-open'); $('#nav-backdrop').hidden = true;
    $('#menu-toggle').setAttribute('aria-expanded', 'false'); $('#menu-toggle').setAttribute('aria-label', '打开模块目录');
    if (wasOpen && restore) $('#menu-toggle').focus();
  }

  function openDiagram(key) {
    const options = diagramRegistry.get(key);
    if (!options) return;
    previousFocus = document.activeElement;
    const modal = $('#diagram-modal');
    $('#diagram-dialog-title').textContent = options.title || '流程图';
    $('#diagram-dialog-caption').textContent = options.caption || '沿着箭头追踪交接，对照旁边的讲解阅读。';
    $('#diagram-evidence').open = false;
    const page = suppliedPages.has(options.pageId) ? pageOf(options.pageId) : null;
    const guideKey = options.flowId || 'base';
    const guide = page?.teaching?.guides?.[guideKey];
    const reading = $('#diagram-reading');
    reading.hidden = !guide;
    reading.innerHTML = guide ? `<h3>${esc(guide.title)}</h3>${guide.paragraphs.map(text => `<p>${teachingText(text, page, guide, options.flowId)}</p>`).join('')}` : '';
    reading.scrollTop = 0;
    $('#diagram-content').classList.toggle('has-reading', !!guide);
    $('#diagram-reading-toggle').hidden = !guide;
    $('#diagram-reading-toggle').textContent = '收起讲解';
    $('#diagram-reading-toggle').setAttribute('aria-expanded', String(!!guide));
    const canvas = $('#diagram-canvas');
    canvas.innerHTML = svgMarkup(options, 'modal-svg');
    canvas.dataset.diagramTheme = options.svg === DATA.originalSvg ? 'original' : 'adaptive';
    const svg = $('svg', canvas);
    if (!svg) { showToast('当前图形无法打开，请阅读图下节点解释。'); return; }
    const viewBox = svg.getAttribute('viewBox').split(/\s+/).map(Number);
    modalState = { options, svg, baseWidth: viewBox[2], scale: 1, fitWidth: 1000 };
    modal.hidden = false; document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => { if (!modalState) return; modalState.fitWidth = Math.max(280, canvas.clientWidth - 48); setModalScale('readable', false); $('#diagram-close').focus(); });
  }

  function setModalScale(action, preserveCenter = true) {
    if (!modalState) return;
    const canvas = $('#diagram-canvas');
    const oldWidth = Number.parseFloat(modalState.svg.style.width) || modalState.fitWidth;
    const oldCenterX = canvas.scrollLeft + canvas.clientWidth / 2;
    const oldCenterY = canvas.scrollTop + canvas.clientHeight / 2;
    let width = oldWidth;
    if (action === 'fit') width = modalState.fitWidth;
    else if (action === 'readable') width = Math.max(modalState.fitWidth, modalState.baseWidth * (modalState.options.svg === DATA.originalSvg ? .68 : 1));
    else if (action === 'actual') width = modalState.baseWidth;
    else if (action === 'in') width = Math.min(modalState.baseWidth * 2, oldWidth * 1.35);
    else if (action === 'out') width = Math.max(240, oldWidth / 1.35);
    modalState.svg.style.width = `${width}px`;
    modalState.scale = width / modalState.baseWidth;
    $('#diagram-zoom-label').textContent = `${Math.round(modalState.scale * 100)}%`;
    const ratio = width / oldWidth;
    canvas.scrollLeft = preserveCenter ? oldCenterX * ratio - canvas.clientWidth / 2 : 0;
    canvas.scrollTop = preserveCenter ? oldCenterY * ratio - canvas.clientHeight / 2 : 0;
  }

  function closeDiagram(restore = true) {
    const modal = $('#diagram-modal');
    const wasOpen = !modal.hidden;
    modal.hidden = true; document.body.style.overflow = ''; modalState = null;
    $('#diagram-canvas').innerHTML = '';
    $('#diagram-reading').innerHTML = '';
    if (wasOpen && restore && previousFocus?.isConnected) previousFocus.focus();
  }



  function handleSvgLink(element) {
    const pageId = element.dataset.page;
    const nodeId = element.dataset.node;
    const stepId = element.dataset.step;
    const toolId = element.dataset.tool;
    const moduleId = element.dataset.module;
    const figureElement = element.closest('[data-diagram]');
    const options = figureElement ? diagramRegistry.get(figureElement.dataset.diagram) : modalState?.options;
    if (toolId && toolById.has(toolId)) { navigate(routeHref('tool', toolId)); return true; }
    if (nodeId && nodeById.has(nodeId)) { navigate(routeHref('node', nodeId)); return true; }
    if (nodeId && toolById.has(nodeId)) { navigate(routeHref('tool', nodeId)); return true; }
    if (stepId) {
      const targetPage = pageId || options?.pageId || currentPageId;
      const flowId = element.dataset.flow || options?.flowId;
      if (targetPage && flowId) { navigate(routeHref('module', targetPage, 'flow', flowId, 'step', stepId)); return true; }
      if (nodeById.has(stepId)) { navigate(routeHref('node', stepId)); return true; }
    }
    if (pageId && pageIds.includes(pageId)) { navigate(routeHref('module', pageId)); return true; }
    if (moduleId && pageIds.includes(moduleId)) { navigate(routeHref('module', moduleId)); return true; }
    if (nodeId) { showToast('这个图形节点没有对应文章，请先看所在模块的步骤解释。'); return true; }
    return false;
  }

  document.addEventListener('click', event => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const svgLink = target.closest('svg [data-page],svg [data-node],svg [data-step],svg [data-tool],svg [data-module]');
    if (svgLink && handleSvgLink(svgLink)) { event.preventDefault(); return; }
    const open = target.closest('[data-open-diagram]'); if (open) { openDiagram(open.dataset.openDiagram); return; }
    const modalZoom = target.closest('[data-modal-zoom]'); if (modalZoom) { setModalScale(modalZoom.dataset.modalZoom); return; }
    const zoom = target.closest('[data-figure-zoom]');
    if (zoom) {
      const figureElement = zoom.closest('[data-diagram]'); const svg = $('svg', figureElement); if (!svg) return;
      const scale = Number(figureElement.dataset.scale || 1) * (zoom.dataset.figureZoom === 'in' ? 1.25 : .8);
      const next = Math.max(.15, Math.min(5, scale)); figureElement.dataset.scale = String(next); svg.style.width = `${Number(figureElement.dataset.readableWidth || 680) * next}px`; $('output', figureElement).textContent = `${Math.round(next * 100)}%`; return;
    }
    const figureMode = target.closest('[data-figure-mode]');
    if (figureMode) {
      const figureElement = figureMode.closest('[data-diagram]'); const svg = $('svg', figureElement); if (!svg) return;
      const width = Number(figureMode.dataset.figureMode === 'fit' ? figureElement.dataset.fitWidth : figureElement.dataset.readableWidth);
      const scale = width / Number(figureElement.dataset.readableWidth || width); svg.style.width = `${width}px`; figureElement.dataset.scale = String(scale); $('output', figureElement).textContent = `${Math.round(scale * 100)}%`; return;
    }
    if (target.closest('#diagram-reading-toggle')) {
      const reading = $('#diagram-reading');
      reading.hidden = !reading.hidden;
      $('#diagram-content').classList.toggle('has-reading', !reading.hidden);
      $('#diagram-reading-toggle').textContent = reading.hidden ? '展开讲解' : '收起讲解';
      $('#diagram-reading-toggle').setAttribute('aria-expanded', String(!reading.hidden));
      requestAnimationFrame(() => { if (modalState) modalState.fitWidth = Math.max(280, $('#diagram-canvas').clientWidth - 48); });
      return;
    }
    const scroll = target.closest('[data-scroll-to]'); if (scroll) { event.preventDefault(); document.getElementById(scroll.dataset.scrollTo)?.scrollIntoView({ behavior: 'auto', block: 'start' }); return; }
    const expand = target.closest('[data-expand-nodes]'); if (expand) { $$('.node-detail', root).forEach(detail => { detail.open = expand.dataset.expandNodes === 'all'; }); return; }
    const filter = target.closest('[data-search-filter]'); if (filter) { searchFilter = filter.dataset.searchFilter; searchLimit = 60; render(); return; }
    if (target.closest('[data-more-search]')) { searchLimit += 60; render(); return; }
    if (target.closest('.skip-link')) { event.preventDefault(); $('#main-content').focus(); $('#main-content').scrollIntoView({ block: 'start' }); }
  });

  document.addEventListener('change', event => {
    if (event.target.id === 'page-section-select' && event.target.value) document.getElementById(event.target.value)?.scrollIntoView({ block: 'start', behavior: 'auto' });
  });
  document.addEventListener('submit', event => {
    if (!['search-form', 'page-search-form'].includes(event.target.id)) return;
    event.preventDefault();
    const input = event.target.id === 'search-form' ? $('#global-search') : $('#page-search-input');
    searchFilter = 'all'; searchLimit = 60;
    navigate(`#search?q=${enc(input.value.trim())}`);
  });
  $('#menu-toggle').addEventListener('click', () => document.body.classList.contains('nav-open') ? closeMenu() : openMenu());
  $('#nav-backdrop').addEventListener('click', () => closeMenu());
  $('#diagram-close').addEventListener('click', () => closeDiagram());
  $('#diagram-modal').addEventListener('click', event => { if (event.target === $('#diagram-modal')) closeDiagram(); });

  document.addEventListener('keydown', event => {
    const input = /INPUT|TEXTAREA|SELECT/.test(event.target.tagName) || event.target.isContentEditable;
    if (event.key === '/' && !input && !event.metaKey && !event.ctrlKey && !event.altKey) { event.preventDefault(); $('#global-search').focus(); }
    if (event.key === 'Escape') { if (!$('#diagram-modal').hidden) closeDiagram(); else if (document.body.classList.contains('nav-open')) closeMenu(); else if (event.target.id === 'global-search') { event.target.blur(); $('#main-content').focus(); } }
    if (['Enter', ' '].includes(event.key) && event.target.matches('svg [data-page],svg [data-node],svg [data-step],svg [data-tool],svg [data-module]')) { if (handleSvgLink(event.target)) event.preventDefault(); }
    if (!$('#diagram-modal').hidden) {
      if ((event.key === '+' || event.key === '=') && !input) { event.preventDefault(); setModalScale('in'); }
      if (event.key === '-' && !input) { event.preventDefault(); setModalScale('out'); }
      if (event.key === 'Tab') {
        const focusable = $$('button,[href],[tabindex="0"]', $('#diagram-modal')).filter(element => !element.disabled);
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    } else if (document.body.classList.contains('nav-open') && event.key === 'Tab') {
      const links = $$('a[href],button', sidebar); const first = links[0], last = links[links.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
  });

  let drag = null;
  $('#diagram-canvas').addEventListener('pointerdown', event => {
    if (event.button !== 0 || event.target.closest('[data-page],[data-node],[data-step],[data-tool],[data-module]')) return;
    if (event.pointerType === 'touch') return;
    const canvas = event.currentTarget; drag = { id: event.pointerId, x: event.clientX, y: event.clientY, left: canvas.scrollLeft, top: canvas.scrollTop };
    canvas.setPointerCapture?.(event.pointerId); canvas.classList.add('dragging');
  });
  $('#diagram-canvas').addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    event.currentTarget.scrollLeft = drag.left - event.clientX + drag.x; event.currentTarget.scrollTop = drag.top - event.clientY + drag.y;
  });
  const stopDrag = event => { if (drag) event.currentTarget.releasePointerCapture?.(drag.id); drag = null; event.currentTarget.classList.remove('dragging'); };
  $('#diagram-canvas').addEventListener('pointerup', stopDrag);
  $('#diagram-canvas').addEventListener('pointercancel', stopDrag);
  window.addEventListener('hashchange', render);

  /* Read-only hooks plus normal UI actions for root verification; no private state upload. */
  window.CockpitLearningSite = {
    version: '1.1.0',
    getCounts: () => ({ modules: pageIds.length, nodes: nodes.length, edges: edges.length, tools: tools.length, supplements: supplements.length, sources: sources.length, searchEntries: searchIndex.length, walkthroughs: walkthroughs.length, walkthroughSteps: walkthroughs.reduce((total, item) => total + arr(item.steps).length, 0) }),
    getRoute: () => JSON.parse(JSON.stringify(currentRoute)),
    getPages: () => pageIds.map(id => ({ id, title: pageOf(id).title, fallback: !!pageOf(id).fallback, missing: !!pageOf(id).missing })),
    getWalkthroughs: () => walkthroughs.map(item => ({ id: item.id, title: item.title, steps: arr(item.steps).map(step => ({ id: step.id, title: step.title })) })),
    search: (query, type) => search(query, type).map(({ normalizedBody, normalizedTitle, ...item }) => item),
    parseRoute,
    navigate,
    render,
    getDiagramCount: () => diagramRegistry.size,
  };
  render();
})();
