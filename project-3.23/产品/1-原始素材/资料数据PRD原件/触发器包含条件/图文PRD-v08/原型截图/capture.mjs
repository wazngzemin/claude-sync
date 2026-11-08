import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from '/Users/bytedance/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const out = path.dirname(fileURLToPath(import.meta.url));
const source = '/Users/bytedance/Desktop/3.23/产品/codex/HTML/02-已交付/触发器配置平台-交互原型-v08.html';
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 1400, height: 1100 }, deviceScaleFactor: 1.5 });
const page = await context.newPage();
page.setDefaultTimeout(10000);
const errors = [];
const captures = [];
page.on('pageerror', e => errors.push(e.message));
page.on('dialog', d => d.accept());
await page.goto(pathToFileURL(source).href);
await page.evaluate(() => localStorage.clear());
await page.reload();
await page.waitForTimeout(200);

async function loadCaseUI(value) {
  await page.locator('#caseSelect').selectOption(value);
  if (await page.locator('#confirmCaseLoad').isVisible()) await page.locator('#confirmCaseLoad').click();
  if (await page.locator('#v8Confirm').isVisible()) await page.locator('#v8Confirm').click();
  await page.waitForTimeout(100);
}
async function shot(name, selector, details) {
  if (!selector.includes('v07Modal') && !selector.includes('wfTrialResult') && await page.locator('#v07Modal').isVisible()) throw new Error('Unexpected modal intercepts '+name);
  const locator = page.locator(selector).first();
  await locator.waitFor({ state: 'visible' });
  await locator.evaluate(el => {
    const rect = el.getBoundingClientRect();
    window.scrollTo({ top: window.scrollY + rect.y - 130, behavior: 'instant' });
  });
  await page.waitForTimeout(160);
  const box = await locator.boundingBox();
  await locator.screenshot({ path: path.join(out, name + '.png') });
  captures.push({ name, selector, width: Math.round(box.width), height: Math.round(box.height), ...details });
}
async function sectionPair(name, first, second, details) {
  await page.locator(first).evaluate(el => window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().y - 130, behavior: 'instant' }));
  await page.waitForTimeout(160);
  const a = await page.locator(first).boundingBox();
  const b = await page.locator(second).boundingBox();
  const scroll = await page.evaluate(() => ({ x: window.scrollX, y: window.scrollY }));
  const clip = { x: a.x + scroll.x, y: a.y + scroll.y, width: a.width, height: b.y + b.height - a.y };
  await page.screenshot({ path: path.join(out, name + '.png'), clip });
  captures.push({ name, selector: first + ' 至 ' + second, width: Math.round(clip.width), height: Math.round(clip.height), ...details });
}
async function closeModal() {
  await page.locator('#v07ModalClose').click();
}

try {
  if (process.argv.includes('--inspect')) {
    console.log(await page.locator('body').evaluate(body => [...body.querySelectorAll('select, button, section')].filter(x => x.getClientRects().length).map(x => ({ tag: x.tagName, id: x.id, class: x.className, aria: x.getAttribute('aria-label'), text: (x.tagName === 'SECTION' ? x.querySelector('h2')?.textContent : x.textContent)?.slice(0, 350) }))));
    await page.locator('#caseSelect').selectOption('child');
    console.log('CHILD', await page.locator('#sceneForm').evaluate(body => [...body.querySelectorAll('select, button, input, textarea')].filter(x => x.getClientRects().length).map(x => ({ tag: x.tagName, id: x.id, class: x.className, aria: x.getAttribute('aria-label'), text: x.textContent?.slice(0, 180), value: x.value }))));
    console.log('WF ROOT',await page.locator('.wf-layout').evaluate(x=>x.parentElement.outerHTML.slice(0,1800)));
  } else {
    await page.setViewportSize({ width: 1400, height: 1400 });
    await loadCaseUI('simple');
    await shot('S02-基础定义与适用范围', '#v8-section-0', { case: '简单：车速条件示例基础信息', point: '名称、优先级、分类、来源、类型；发布范围另见S02b。' });
    await shot('S02b-渠道车型版本环境与泳道', '#v8-section-1', { case: '简单：车速条件示例发布范围', point: '渠道、车型、版本、指定车辆、环境、泳道是不同维度。' });
    await shot('S03-简单条件字段级联', '#v8-section-2', { case: '简单：车速条件示例', point: '车状态信号、演示车速、字段、操作符、带单位值与启动依赖。' });

    await loadCaseUI('flash-simple');
    await shot('S04-简单视觉目标与VLM入口', '#v8-section-2', { case: '闪念（简单）', point: '视觉描述判断来源、目标、入口待接说明；这里不是主动调用摄像头。' });
    await shot('S09-闪念固定正文与普通通知', '#v8-section-3', { case: '闪念（简单）', point: '普通通知卡固定正文、即刻预览；无标题、按钮、TTS。' });
    await shot('S09b-共用执行策略', '#v8-section-4', { case: '闪念（简单）', point: '总次数、单次上电周期、自然日和最小间隔；30秒只是演示页面默认。' });
    await page.locator('#createScene').click();
    await shot('S11-校验与保存前摘要', '#v07Modal .modal', { case: '闪念（简单）', point: '保存范围、规模、输出及频控二次核对，不自动启用。' });
    await page.locator('#v8BackEdit').click();

    await page.locator('#openTrial').click();
    await page.locator('#v8TrialInput').fill('后排乘客闭着眼，但画面被遮挡，无法确定是否正在睡觉。');
    await page.locator('select[data-node]').first().selectOption('UNKNOWN');
    await page.locator('#v8TrialPolicy').selectOption('allow');
    await page.locator('#runManualWorkflow').click();
    await shot('S12a-试跑UNKNOWN阻止动作', '#v07Modal .modal', { case: '闪念（简单）', point: '人工无法判断时不发送通知；不把UNKNOWN当满足。' });
    await page.locator('select[data-node]').first().selectOption('PASS');
    await page.locator('#v8TrialInput').fill('已有舱内视觉描述：后排乘客闭着眼，靠在座椅上睡觉。');
    await page.locator('#v8TrialPolicy').selectOption('block');
    await page.locator('#runManualWorkflow').click();
    await shot('S12b-试跑PASS仍可能被频控拦截', '#v07Modal .modal', { case: '闪念（简单）', point: '判断通过但次数或间隔拦截时不发出Action。' });
    await page.locator('#v8TrialPolicy').selectOption('allow');
    await page.locator('#runManualWorkflow').click();
    await page.locator('#v8Trial-sendOk').click();
    await page.locator('#v8Trial-receiveOk').click();
    await page.locator('#v8Trial-showOk').click();
    await shot('S12c-普通通知发送接收展示分层', '#wfTrialResult', { case: '闪念（简单）', point: '普通通知只有发送、接收、展示，不出现确认、DT和车控步骤。' });
    await closeModal();
    await page.locator('#createScene').click();
    await page.locator('#v8CommitSave').click();

    await page.locator('#newScene').click();
    await page.getByRole('button', { name: 'Workflow：条件 / 模型推理判断图', exact: true }).click();
    await loadCaseUI('child');
    await page.locator('#fitGraph').click();
    await shot('S05-Workflow判断画布全貌', '#workflowConditions', { case: '儿童 / 宠物 OR 判断', point: '公共条件、儿童和宠物分支、唯一汇合节点；Action不在画布内。' });
    await page.setViewportSize({ width: 1180, height: 1100 });
    await shot('S06-条件节点完整属性', '#nodeProperties', { case: '公共前置节点上部', point: '节点名称、前驱汇合、节点内部条件和第一条信号字段级联；后续条目见S06b。' });
    await page.locator('#nodeProperties').evaluate(el => el.scrollTop = el.scrollHeight);
    await shot('S06b-条件节点后续条目', '#nodeProperties', { case: '公共前置节点下部', point: '实际滚动显示挡位、儿童锁等后续条目，不靠一张裁掉下半部分的截图解释整个节点。' });
    await page.setViewportSize({ width: 1400, height: 1400 });
    await page.locator('#workflowCanvas .wf-node').filter({ hasText: '后排儿童结构化判断' }).click();
    await page.setViewportSize({ width: 1180, height: 1100 });
    await shot('S06c-结构化VLM位置与年龄字段', '#nodeProperties', { case: '后排儿童结构化节点上部', point: 'Position多枚举选择和AgeRange来自同一后排乘客对象，不使用数值年龄阈值。' });
    await page.locator('#nodeProperties').evaluate(el => el.scrollTop = el.scrollHeight);
    await shot('S06d-同一对象的AgeRange枚举', '#nodeProperties', { case: '后排儿童结构化节点下部', point: '结构化视觉年龄类别的实际多选控件，演示字典不代表生产信号已接入。' });
    await page.setViewportSize({ width: 1400, height: 1400 });
    await page.locator('#workflowCanvas .wf-node').filter({ hasText: '后排宠物描述判断' }).click();
    await page.setViewportSize({ width: 1180, height: 1100 });
    await shot('S07a-推理节点输入来源与目标', '#nodeProperties', { case: '宠物描述判断', point: '已有Objects描述输入、goal与原始判断描述；不调用VQA。' });
    await page.locator('#nodeProperties').evaluate(el => el.scrollTop = el.scrollHeight);
    await shot('S07b-推理节点目标与UNKNOWN边界', '#nodeProperties', { case: '宠物描述判断', point: '补充原始判断描述与缺输入/过时/失败/无法解析的UNKNOWN规则。' });
    await page.setViewportSize({ width: 1400, height: 1400 });
    await page.locator('#workflowCanvas .wf-node').filter({ hasText: 'OR 汇合后复核任务有效' }).click();
    await page.setViewportSize({ width: 1180, height: 1100 });
    await shot('S08-前驱OR与节点内部AND', '#nodeProperties', { case: '唯一汇合节点', point: '前驱任一满足OR和本节点内部全部满足AND分开配置，汇合通过仍要判断本节点。' });
    await page.setViewportSize({ width: 1400, height: 1400 });
    await shot('S10-带卡动作仅演示按钮结构', '#v8-section-3', { case: '儿童 / 宠物 OR 判断', point: 'advisors_input、卡启用和buttons演示结构；正式PRD固定确认/取消、不能照搬成自由定制。' });
    await page.locator('#createScene').click();
    await page.locator('#v8CommitSave').click();
    await page.locator('#filterChannel').selectOption('全部');
    await page.locator('#refreshList').click();
    await page.locator('#advanced').click();
    await page.locator('#toast').waitFor({ state: 'hidden' });
    await shot('S01a-列表筛选与原有列', '#listPage', { case: '本地保存两种模式后的列表', point: '原有渠道与环境筛选，加模式、状态、分类、来源、类型，保持原有列。' });
    await page.locator('#listPage .tablewrap').evaluate(el => el.scrollLeft = el.scrollWidth);
    await shot('S01b-列表模式分类来源类型与操作', '#listPage', { case: '表格水平右滚后', point: '实际表格的右侧增量列，Workflow查看只读、复制独立草稿。' });

    await page.locator('[data-nav="触发记录"]').click();
    await page.locator('#recordChannel').selectOption('赛力斯');
    await page.locator('#recordVehicle').selectOption('DEMO-VEHICLE');
    await page.locator('#refreshRecords').click();
    await page.getByRole('button', { name: '查看简单判断', exact: true }).first().click();
    await shot('S13a-历史当次输入和定义快照', '#v07Modal .modal', { case: '闪念已展示人工试跑记录', point: '当次输入、当次定义和结果，未保存定义有提示，不伪造真实LogID。' });
    await shot('S13b-历史结果分层与操作时间线', '#v07Modal .v8-timeline', { case: '闪念已展示人工试跑记录', point: '判断、频控、Action、下游、展示和不适用交互/车控分别呈现。' });
    await page.getByText('查看当次操作时间线', { exact: true }).click();
    await shot('S13c-当次操作时间线', '#v07ModalBody details', { case: '闪念已展示人工试跑记录', point: '每次模拟发送、接收、展示各自留下操作时间，不替代线上耗时。' });
    await closeModal();
    await page.locator('[data-nav="场景管理"]').click();
    await page.locator('#newScene').click();
    await page.getByRole('button', { name: 'Workflow：条件 / 模型推理判断图', exact: true }).click();
    await loadCaseUI('flash');
    await page.setViewportSize({ width: 1180, height: 1100 });
    await shot('S07c-Workflow闪念Caption输入', '#nodeProperties', { case: 'Workflow闪念视觉目标节点', point: '舱内Caption预设入口待接、睡觉判定目标，与普通通知输出分开配置。' });
    await fs.writeFile(path.join(out, '截图检查结果.json'), JSON.stringify({ source, viewport: '1400×1400；属性特写1180×1100', deviceScaleFactor: 1.5, count: captures.length, captures, browserErrors: errors }, null, 2));
    console.log(JSON.stringify({ count: captures.length, captures, browserErrors: errors }, null, 2));
    if (errors.length) process.exitCode = 1;
  }
} finally {
  await browser.close();
}
