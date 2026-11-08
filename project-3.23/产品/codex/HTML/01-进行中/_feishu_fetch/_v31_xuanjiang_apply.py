#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Restore dense teaching from base, strip audit talk, apply PM 宣讲 bilingual register."""
from __future__ import annotations
import json, re, copy
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HTML = ROOT / "豆包汽车-业务学习站-v31-工作副本.html"
BASE = Path(__file__).resolve().parent / "_v31_pages_teach_base.json"
TARGETS = ["V", "R", "M", "C", "D", "E", "O", "I", "G", "L"]

# --- bilingual gloss helpers: ensure EN（中文）form ---
GLOSS_ONCE = [
    # longer phrases first
    (r"(?<![A-Za-z])Soft\s*VAD(?!（)", "Soft VAD（软判停）"),
    (r"(?<![A-Za-z])Hard\s*VAD(?!（)", "Hard VAD（硬判停）"),
    (r"(?<![A-Za-z])语义\s*VAD(?!（)", "语义 VAD（语义判停）"),
    (r"(?<![A-Za-z])pre[_ ]?query(?!（)", "pre_query（预请求）"),
    (r"(?<![A-Za-z])request_id(?!（)", "request_id（请求编号）"),
    (r"(?<![A-Za-z])tool_feedback(?!（)", "tool_feedback（工具反馈）"),
    (r"(?<![A-Za-z])action_list(?!（)", "action_list（动作列表）"),
    (r"(?<![A-Za-z])talk_or_not(?!（)", "talk_or_not（是否开口）"),
    (r"(?<![A-Za-z])talk_content(?!（)", "talk_content（待播文字）"),
    (r"(?<![A-Za-z])hotword(?!（)", "hotword（热词）"),
    (r"(?<![A-Za-z])partial(?!（)", "partial（过程文字）"),
    (r"(?<![A-Za-z])final(?!（)(?!\s*识别)(?!\s*文字)", "final（定稿文字）"),
    (r"(?<![A-Za-z])ASR(?!（)", "ASR（语音识别）"),
    (r"(?<![A-Za-z])VAD(?!（)(?!\s*（)", "VAD（语音活动检测）"),
    (r"(?<![A-Za-z])TTS(?!（)", "TTS（语音合成）"),
    (r"(?<![A-Za-z])Context(?!（)", "Context（上下文）"),
    (r"(?<![A-Za-z])Director(?!（)", "Director（对话推理引擎）"),
    (r"(?<![A-Za-z])Planner(?!（)", "Planner（规划器，与 Director 同职能）"),
    (r"(?<![A-Za-z])Advisor(?!（)", "Advisor（顾问）"),
    (r"(?<![A-Za-z])Query(?!（)", "Query（用户请求）"),
]

# childish / audit patterns to neutralize
CHILD_PATTERNS = [
    (r"车上常用的?", ""),
    (r"读「热词」，不是\s*hotel「酒店」", ""),
    (r"不是\s*hotel「酒店」[，,]?", ""),
    (r"也就是把说话写成字", "把说话写成字"),
    (r"给\s*ASR（[^）]*）\s*塞", "注入 ASR（语音识别）"),
]

def strip_audit_talk(s: str) -> str:
    if not isinstance(s, str) or not s:
        return s
    out = s
    # remove 【待核】 markers and surrounding audit clauses
    out = out.replace("【待核】", "")
    # Soft/Hard conflict audit → clean teaching fact
    out = re.sub(
        r"机制以\s*OnePager\s*与车内语音\s*PRD\s*为准，\s*Soft≈300\s*ms\s*/\s*Hard≈600\s*ms\s*与旧稿[^。]*。",
        "判停按 Soft VAD（软判停）约 300 ms、Hard VAD（硬判停）约 600 ms 来讲；二者同起点起算，具体生效值以当前车型配置为准。",
        out,
    )
    out = re.sub(
        r"这是该链路的配置口径；具体车型还要结合语义判停（语义 VAD）版本，旧稿 Soft/Hard/语义约 500/1000\s*ms 与语义延长属演进资料，与 OnePager 300/600 并列，不能拼成全车型唯一现行值。",
        "语义 VAD（语义判停）可按车型配置参与「声停但意未完」时是否延长；讲课固定记 Soft≈300 ms、Hard≈600 ms，具体生效值以当前车型配置为准。",
        out,
    )
    out = re.sub(
        r"Hard≈600\s*ms（OnePager\s*/\s*时延基线）与多级 VAD PRD 暂定 Hard≈500\s*ms\s*\+\s*语义≈1000\s*ms 两口径并列[。]?",
        "Hard VAD（硬判停）按约 600 ms 收尾来讲；语义 VAD（语义判停）延长按车型配置。",
        out,
    )
    out = re.sub(
        r"OnePager\s*口径：",
        "",
        out,
    )
    out = re.sub(
        r"OnePager\s*写明",
        "材料写明",
        out,
    )
    out = re.sub(
        r"OnePager\s*把",
        "材料把",
        out,
    )
    out = re.sub(
        r"OnePager\s*列出",
        "材料列出",
        out,
    )
    out = re.sub(
        r"OnePager\s*也明确",
        "材料也明确",
        out,
    )
    out = re.sub(
        r"OnePager\s*/\s*时延基线",
        "时延基线",
        out,
    )
    out = re.sub(r"与\s*OnePager\s*", "与 ", out)
    out = re.sub(r"按\s*OnePager\s*", "按 ", out)
    out = re.sub(r"以\s*OnePager\s*", "以 ", out)
    out = re.sub(r"见\s*OnePager[^。；]*[。；]?", "", out)
    # PRD as document name in student prose
    out = re.sub(r"车内语音\s*PRD\s*", "车内语音要求", out)
    out = re.sub(r"多级\s*VAD\s*PRD\s*", "多级 VAD 方案", out)
    out = re.sub(r"PRD\s*要求", "产品要求", out)
    out = re.sub(r"PRD\s*常见", "常见目标口径", out)
    out = re.sub(r"相关\s*PRD\s*已给出", "材料已给出", out)
    out = re.sub(r"通用\s*PRD\s*", "通用要求", out)
    out = re.sub(r"(?<![A-Za-z])PRD(?![A-Za-z\-])", "需求材料", out)
    # 一页纸
    out = re.sub(r"一页纸核对[^。]*。?", "", out)
    out = re.sub(r"一页纸[^。；]*[。；]?", "", out)
    # childish
    for pat, rep in CHILD_PATTERNS:
        out = re.sub(pat, rep, out)
    # cleanup double spaces / empty parens artifacts
    out = re.sub(r"（\s*）", "", out)
    out = re.sub(r"\s{2,}", " ", out)
    out = re.sub(r"，{2,}", "，", out)
    out = re.sub(r"。{2,}", "。", out)
    out = re.sub(r"，。", "。", out)
    return out.strip() if out.strip() != s.strip() or True else s


def apply_gloss(s: str) -> str:
    if not isinstance(s, str) or not s:
        return s
    out = s
    for pat, rep in GLOSS_ONCE:
        out = re.sub(pat, rep, out)
    # avoid double-wrapping already glossed
    out = re.sub(r"（（+", "（", out)
    out = re.sub(r"））+", "）", out)
    # fix nested duplicates like Soft VAD（软判停）（软判停）
    out = re.sub(r"（软判停）（软判停）", "（软判停）", out)
    out = re.sub(r"（硬判停）（硬判停）", "（硬判停）", out)
    out = re.sub(r"（语音识别）（语音识别）", "（语音识别）", out)
    out = re.sub(r"（热词）（热词）", "（热词）", out)
    out = re.sub(r"（语音活动检测）（语音活动检测）", "（语音活动检测）", out)
    out = re.sub(r"（预请求）（预请求）", "（预请求）", out)
    out = re.sub(r"（请求编号）（请求编号）", "（请求编号）", out)
    out = re.sub(r"（过程文字）（过程文字）", "（过程文字）", out)
    out = re.sub(r"（定稿文字）（定稿文字）", "（定稿文字）", out)
    out = re.sub(r"（上下文）（上下文）", "（上下文）", out)
    out = re.sub(r"（对话推理引擎）（对话推理引擎）", "（对话推理引擎）", out)
    out = re.sub(r"（规划器，与 Director（对话推理引擎） 同职能）", "（规划器，与 Director 同职能）", out)
    out = re.sub(r"Planner（规划器，与 Director（对话推理引擎） 同职能）", "Planner（规划器，与 Director 同职能）", out)
    # Soft VAD（软判停）（软判停） already handled
    # Fix VAD gloss eating Soft/Hard: Soft VAD（语音活动检测） -> Soft VAD（软判停）
    out = re.sub(r"Soft VAD（语音活动检测）", "Soft VAD（软判停）", out)
    out = re.sub(r"Hard VAD（语音活动检测）", "Hard VAD（硬判停）", out)
    out = re.sub(r"语义 VAD（语音活动检测）", "语义 VAD（语义判停）", out)
    return out


def rewrite_text(s: str) -> str:
    if not isinstance(s, str):
        return s
    s2 = strip_audit_talk(s)
    s2 = apply_gloss(s2)
    # specific high-value rewrites for V Soft paragraph if residual audit remains
    s2 = re.sub(
        r"旧稿[^。]{0,40}500/1000[^。]{0,80}。",
        "讲课固定记 Soft≈300 ms、Hard≈600 ms，具体生效值以当前车型配置为准。",
        s2,
    )
    s2 = re.sub(r"历史有权限缺口时标，不编造命中率。", "不编造命中率；验收看当次注入与定稿是否改善。", s2)
    s2 = re.sub(r"回流技术方案，不编造命中率。", "回流方案里；不编造命中率。", s2)
    return s2


def walk_rewrite(obj):
    if isinstance(obj, str):
        return rewrite_text(obj)
    if isinstance(obj, list):
        return [walk_rewrite(x) for x in obj]
    if isinstance(obj, dict):
        return {k: walk_rewrite(v) for k, v in obj.items()}
    return obj


def rewrite_soft_intro_paragraph(paras: list) -> list:
    """Ensure Soft/Hard teaching sentence is clean in any intro that mentions it."""
    out = []
    for p in paras:
        if isinstance(p, str) and ("Soft" in p or "判停" in p) and ("300" in p or "600" in p):
            # if still messy, replace with clean teaching sentence appended carefully
            p2 = p
            if "冲突" in p2 or "并列" in p2 or "演进资料" in p2:
                p2 = re.sub(
                    r"[^。]*（?Soft|判停|VAD）[^。]*300[^。]*。",
                    "判停按 Soft VAD（软判停）约 300 ms 触发预请求（pre_query，只做允许的准备），Hard VAD（硬判停）约 600 ms 收尾；两段时间同起点起算，不是串行相加。",
                    p2,
                    count=1,
                )
            out.append(rewrite_text(p2))
        else:
            out.append(rewrite_text(p) if isinstance(p, str) else walk_rewrite(p))
    return out


def main():
    html = HTML.read_text(encoding="utf-8")
    start = html.find("const DATA=") + len("const DATA=")
    decoder = json.JSONDecoder()
    DATA, end = decoder.raw_decode(html, start)
    base = json.loads(BASE.read_text(encoding="utf-8"))

    report = {"modules": {}, "before": {}, "after": {}}

    # snapshot before for V intro
    pageV = next(p for p in DATA["pages"] if p["id"] == "V")
    report["before"]["V_intro1"] = (pageV["teaching"]["intro"][1] if len(pageV["teaching"]["intro"])>1 else "")[:180]
    report["before"]["V_L0P3"] = ""
    for L in pageV["teaching"]["lessons"]:
        for p in L["paragraphs"]:
            if "热词" in p:
                report["before"]["V_L0P3"] = p[:200]
                break
        if report["before"]["V_L0P3"]:
            break

    for pid in TARGETS:
        page = next(p for p in DATA["pages"] if p["id"] == pid)
        b = base[pid]
        # restore teaching + sections from base (dense, pre-childish)
        new_teaching = walk_rewrite(copy.deepcopy(b["teaching"]))
        # extra pass on intro for Soft
        if isinstance(new_teaching.get("intro"), list):
            new_teaching["intro"] = rewrite_soft_intro_paragraph(new_teaching["intro"])
        for L in new_teaching.get("lessons") or []:
            if isinstance(L.get("paragraphs"), list):
                L["paragraphs"] = rewrite_soft_intro_paragraph(L["paragraphs"])
        if "guides" in new_teaching:
            new_teaching["guides"] = walk_rewrite(new_teaching["guides"])

        page["teaching"] = new_teaching
        if b.get("sections"):
            page["sections"] = walk_rewrite(copy.deepcopy(b["sections"]))
        if b.get("summary"):
            page["summary"] = rewrite_text(b["summary"])
        if b.get("title"):
            # keep page title structure; only rewrite if provided
            pass

        blob = json.dumps(new_teaching, ensure_ascii=False)
        report["modules"][pid] = {
            "chars": len(blob),
            "PRD": blob.count("PRD"),
            "待核": blob.count("【待核】"),
            "车上常用": blob.count("车上常用"),
            "hotel": blob.count("hotel"),
            "OnePager": blob.count("OnePager"),
            "一页纸": blob.count("一页纸"),
        }

    # clean dumbed phrases in module node details for targets
    node_hits = 0
    for mod in DATA["base"]["modules"]:
        if mod["id"] not in TARGETS:
            continue
        for node in mod.get("nodes") or []:
            for key in ("detail", "title"):
                if key in node and isinstance(node[key], str):
                    before = node[key]
                    node[key] = rewrite_text(before)
                    if node[key] != before:
                        node_hits += 1
            if isinstance(node.get("lines"), list):
                node["lines"] = [rewrite_text(x) if isinstance(x, str) else x for x in node["lines"]]
    report["node_rewrites"] = node_hits

    # version bump note
    DATA["base"]["version"] = "v15-v31-xuanjiang"

    pageV = next(p for p in DATA["pages"] if p["id"] == "V")
    report["after"]["V_intro1"] = (pageV["teaching"]["intro"][1] if len(pageV["teaching"]["intro"])>1 else "")[:220]
    report["after"]["V_L0P3"] = ""
    for L in pageV["teaching"]["lessons"]:
        for p in L["paragraphs"]:
            if "热词" in p:
                report["after"]["V_L0P3"] = p[:240]
                break
        if report["after"]["V_L0P3"]:
            break
    # Soft para
    for L in pageV["teaching"]["lessons"]:
        for p in L["paragraphs"]:
            if "Soft VAD" in p and "300" in p:
                report["after"]["V_soft"] = p[:280]
                break

    new_json = json.dumps(DATA, ensure_ascii=False, indent=1)
    # original used compact indent=1? check - const DATA={ with space after colon often indent 1
    # The original parse worked; dumping with indent=1 may enlarge file a lot.
    # Prefer compact separators matching original style: check first 100 chars after =
    # Original: const DATA={\n "base": {
    new_json = json.dumps(DATA, ensure_ascii=False, indent=1)
    html2 = html[:start] + new_json + html[end:]
    HTML.write_text(html2, encoding="utf-8")
    report["html_bytes"] = HTML.stat().st_size
    Path(__file__).resolve().parent.joinpath("_v31_xuanjiang_report.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(json.dumps(report, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()
