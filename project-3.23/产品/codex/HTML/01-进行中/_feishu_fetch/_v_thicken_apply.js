#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");

const HTML =
  "/Users/bytedance/Desktop/3.23/产品/codex/HTML/01-进行中/豆包汽车-业务学习站-v30-工作副本.html";
const PAYLOAD = path.join(__dirname, "_v_thicken_payload.json");

const cnLen = (s) => String(s || "").replace(/\s+/g, "").length;
const sumParas = (arr) => (arr || []).reduce((n, x) => n + cnLen(x), 0);

function loadHtml() {
  const html = fs.readFileSync(HTML, "utf8");
  const re = /<script([^>]*)>([\s\S]*?)<\/script>/g;
  const scripts = [];
  let m;
  while ((m = re.exec(html))) {
    scripts.push({ attrs: m[1], body: m[2], index: m.index });
  }
  if (scripts.length !== 2) throw new Error("expected 2 scripts, got " + scripts.length);
  const DATA = new Function(scripts[0].body + "; return DATA;")();
  return { html, scripts, DATA };
}

function thickenGuides(baseGuide, guideExtra) {
  const sections = (baseGuide.sections || []).map((sec, i) => {
    const extra = guideExtra[String(i)] || guideExtra[i] || [];
    const existing = sec.paragraphs || [];
    const have = new Set(existing.map((p) => p.slice(0, 28)));
    const add = extra.filter((p) => !have.has(p.slice(0, 28)));
    return Object.assign({}, sec, { paragraphs: existing.concat(add) });
  });
  const flat = [];
  sections.forEach((s) => (s.paragraphs || []).forEach((p) => flat.push(p)));
  return Object.assign({}, baseGuide, { sections, paragraphs: flat });
}

function thickenNodes(nodes, extras) {
  return nodes.map((n) => {
    const para = extras[n.id];
    if (!para) return n;
    const paragraphs = (n.paragraphs || []).slice();
    if (!paragraphs.some((p) => p.slice(0, 20) === para.slice(0, 20))) {
      if (paragraphs.length >= 2) paragraphs.splice(paragraphs.length - 1, 0, para);
      else paragraphs.push(para);
    }
    return Object.assign({}, n, { paragraphs, detail: paragraphs.join("\n\n") });
  });
}

function main() {
  const payload = JSON.parse(fs.readFileSync(PAYLOAD, "utf8"));
  const { html, scripts, DATA } = loadHtml();
  const page = DATA.pages.find((p) => p.id === "V");
  if (!page) throw new Error("page V not found");
  const mod = DATA.base.modules.find((m) => m.id === "V");
  if (!mod) throw new Error("module V not found");

  const gBefore = ((page.teaching.guides || {}).base || {}).sections || [];
  const before = {
    intro: sumParas(page.teaching.intro),
    lessons: sumParas((page.teaching.lessons || []).flatMap((l) => l.paragraphs || [])),
    guides: sumParas(gBefore.flatMap((s) => s.paragraphs || [])),
    closing: sumParas(page.teaching.closing)
  };

  const lessons = payload.lessons;
  const teaching = Object.assign({}, page.teaching, {
    intro: payload.intro,
    lessons,
    closing: payload.closing,
    guides: Object.assign({}, page.teaching.guides, {
      base: thickenGuides(page.teaching.guides.base, payload.guideExtra)
    })
  });

  const sections = lessons.map((L, i) => {
    const old = (page.sections || [])[i] || {};
    return {
      id: old.id || L.id,
      title: L.title,
      paragraphs: L.paragraphs.slice(),
      teachingTarget: old.teachingTarget || L.title,
      sourceIds: L.sourceIds || old.sourceIds || []
    };
  });

  page.teaching = teaching;
  page.sections = sections;
  mod.nodes = thickenNodes(mod.nodes, payload.nodeExtras);

  const after = {
    intro: sumParas(page.teaching.intro),
    lessons: sumParas(page.teaching.lessons.flatMap((l) => l.paragraphs || [])),
    guides: sumParas(page.teaching.guides.base.sections.flatMap((s) => s.paragraphs || [])),
    closing: sumParas(page.teaching.closing),
    lessonParas: page.teaching.lessons.map((l) => (l.paragraphs || []).length),
    guideParas: page.teaching.guides.base.sections.map((s) => (s.paragraphs || []).length)
  };

  const newDataBody = "\nconst DATA=" + JSON.stringify(DATA, null, 2) + ";\n";
  const s0 = scripts[0];
  const openTag = "<script" + s0.attrs + ">";
  const start = html.indexOf(openTag);
  if (start < 0) throw new Error("script0 open not found");
  const bodyStart = start + openTag.length;
  const close = html.indexOf("</script>", bodyStart);
  const outHtml = html.slice(0, bodyStart) + newDataBody + html.slice(close);
  fs.writeFileSync(HTML, outHtml);

  const html2 = fs.readFileSync(HTML, "utf8");
  const scripts2 = [];
  const re = /<script([^>]*)>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html2))) scripts2.push(m[2]);
  if (scripts2.length !== 2) throw new Error("post scripts " + scripts2.length);
  if (/\}\s*\{\s*crumbs/.test(html2)) throw new Error("crumbs glue");
  new Function(scripts2[0] + "; return DATA;")();
  new Function(scripts2[1]);

  // node --check via child
  const { spawnSync } = require("child_process");
  const tmp1 = "/tmp/_v_s0_check.js";
  const tmp2 = "/tmp/_v_s1_check.js";
  fs.writeFileSync(tmp1, scripts2[0]);
  fs.writeFileSync(tmp2, scripts2[1]);
  for (const t of [tmp1, tmp2]) {
    const r = spawnSync("node", ["--check", t], { encoding: "utf8" });
    if (r.status !== 0) throw new Error("node --check fail " + t + " " + r.stderr);
  }

  const report = { before, after, ok: true };
  const reportPath =
    "/Users/bytedance/Desktop/3.23/产品/codex/HTML/01-进行中/_feishu_fetch/_v_thicken_report.json";
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}

main();
