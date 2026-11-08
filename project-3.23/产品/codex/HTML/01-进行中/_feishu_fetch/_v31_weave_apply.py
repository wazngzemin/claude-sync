#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""v31 whole-site: woven first-mention glosses, no hard 名词解释 boxes."""
from __future__ import annotations
import json, re, copy
from pathlib import Path
from datetime import datetime, timezone, timedelta

HTML = Path("/Users/bytedance/Desktop/3.23/产品/codex/HTML/01-进行中/豆包汽车-业务学习站-v31-工作副本.html")
REPORT = Path("/Users/bytedance/Desktop/3.23/产品/codex/HTML/01-进行中/_feishu_fetch/_v31_weave_report.json")
TZ = timezone(timedelta(hours=8))
NOW = datetime.now(TZ)
TARGET = ["V", "R", "M", "C", "D", "E", "O", "I", "G", "L"]

# term -> gloss; aliases share seen-key
# format: (term, gloss, seen_key)
GLOSS = [
    ("Soft VAD", "软判停：短停顿先做准备，麦克风不停", "Soft VAD"),
    ("Hard VAD", "硬判停：较长停顿结束本段收音", "Hard VAD"),
    ("SingleInterrupt", "单人直接打断当前播报", "SingleInterrupt"),
    ("pre_query", "预请求：短停顿时提前跑无状态准备", "pre_query"),
    ("request_id", "请求编号：同一次说话的身份证", "request_id"),
    ("round_id", "轮次编号：同一次说话里第几次准备或提交", "round_id"),
    ("action_list", "本轮交给下游的动作列表", "action_list"),
    ("talk_content", "这一轮要对用户说的话", "talk_content"),
    ("talk_or_not", "这一轮要不要开口", "talk_or_not"),
    ("hotword", "热词：人名/地点/按钮等识别候选", "hotword"),
    ("OnePager", "一页纸总览，该链路机制基线", "OnePager"),
    ("Function Call", "功能调用：模型发出的结构化工具请求", "FC"),
    ("ReAct", "边推理边调工具、拿反馈再继续", "ReAct"),
    ("InputManager", "输入管理：把并发消息排成可推理的一轮", "InputManager"),
    ("AIDV", "座舱云：车端与识别/对话云之间的服务", "AIDV"),
    ("Speech", "语音识别服务", "Speech"),
    ("ASR", "语音识别：把声音写成字", "ASR"),
    ("VAD", "语音活动检测：看停了多久", "VAD"),
    ("AEC", "回声消除：减掉车机自己的播报", "AEC"),
    ("TTS", "语音合成播报", "TTS"),
    ("CER", "字错误率", "CER"),
    ("POI", "兴趣点，如商场餐厅", "POI"),
    ("NLG", "自然语言生成", "NLG"),
    ("NLU", "自然语言理解", "NLU"),
    ("OTA", "远程升级", "OTA"),
    ("CarPlay", "手机车载互联", "CarPlay"),
    ("Advisor", "主动服务顾问", "Advisor"),
    ("Trigger", "触发器", "Trigger"),
    ("Context", "上下文：推理前组织好人/车/历史/能力", "Context"),
    ("PRD", "产品需求文档", "PRD"),
    ("partial", "过程文字，还能改", "partial"),
    ("final", "定稿文字", "final"),
    ("FC", "结构化操作候选/功能调用", "FC"),
    ("DM", "对话管理", "DM"),
    # Planner / Director share one concept — gloss only once via Planner first if both appear
    ("Planner", "规划器；材料里也称 Director", "PlannerDirector"),
    ("Director", "规划器；材料里也称 Planner", "PlannerDirector"),
]

CN = [
    ("流式拒识", "播报中边听边判断是不是在跟助手说话", "流式拒识"),
    ("全时免唤醒", "不用每次先喊名字也可能直接提需求", "全时免唤醒"),
    ("免唤醒", "满足条件时可直接提需求", "免唤醒"),
    ("唤醒词", "叫醒助手的固定叫法", "唤醒词"),
    ("正式拒识", "判断该不该由助手接住", "正式拒识"),
    ("端云采信", "本地与云端结果谁真正生效", "端云采信"),
    ("计算准入", "允许开始这一轮推理", "计算准入"),
    ("发布许可", "允许把动作真正发到车或工具", "发布许可"),
    ("预注入", "推理前先备好的常用背景", "预注入"),
    ("用户画像", "已注册用户的偏好键值摘要", "用户画像"),
    ("情景记忆", "发生过什么事的分层总结", "情景记忆"),
    ("语义记忆", "偏好与事实类可复用信息", "语义记忆"),
    ("建议卡", "先问用户再执行的确认卡片", "建议卡"),
    ("端侧触发", "规则和判断跑在车端", "端侧触发"),
    ("云端触发器", "条件和判断在云端", "云端触发器"),
    ("二遍识别", "用同一段录音再校正出定稿", "二遍识别"),
    ("二遍 ASR", "用同一段录音再校正出定稿", "二遍ASR"),
    ("预请求", "短停顿时提前跑的无状态准备", "预请求"),
    ("热词", "专有名识别候选", "热词"),
    ("音区", "声音来自哪一座，不等于认出是谁", "音区"),
    ("拒识", "判断该不该接这句话", "拒识"),
]

# Clean intro openings: plain teaching, terms explained in the sentence itself.
# Do NOT rely on auto-gloss for these openings; mark seen keys after insert.
INTRO_OPEN = {
    "R": (
        "入口这一章只钉两件事：这句话是不是在向豆包提需求，以及该由车上本地能力还是云端链路真正办理。"
        "判断该不该接，材料里叫拒识；两边都算出结果时谁真正生效、同一句话只执行一次，叫端云采信。"
    ),
    "M": (
        "输入管理负责把并发消息排成可推理的一轮，不替规划器理解意图："
        "它只决定谁先进入推理、旧候选还能不能取消、已经发出的车控会不会被新话重复触发。"
        "允许开始推理叫计算准入；允许把动作发到车或工具叫发布许可——两道门要分开看。"
    ),
    "C": (
        "Context 是正式推理前把人、车、历史和能力组织好的上下文：它准备背景，不创造缺失事实。"
        "推理前先备好的常用背景叫预注入；缺的地址仍要留给后面显式查询，不能在 Context 里猜补。"
    ),
    "D": (
        "Planner（规划器；材料里也称 Director）把用户目标与当前事实联系起来，生成本轮一致的回复与动作列表。"
        "它按 ReAct（边推理边调工具、拿反馈再继续）推进：缺地点就先查，查到再搜附近，选好再导航——不要求第一轮猜完所有结果。"
    ),
    "E": (
        "工具执行承接规划器交出的动作列表，核对身份与实现后真正跑到车或服务，再把逐项事实送回。"
        "发布许可通过才允许外发；接口回包成功不等于用户已经看见办完——受理、处理中、完成要分三态记账。"
    ),
    "O": (
        "输出层把「要不要说话」「要说的话」「要执行的动作」拆开交出；TTS（语音合成播报）只负责把选定的话念出来。"
        "声音、界面卡片和真实车控变化是三本账：文字已生成 ≠ 用户已听见 ≠ 车辆已改变。"
    ),
    "I": (
        "插话发生时，系统要同时处理：停什么声、保什么工作、新话是否有效指令、旧进度要不要恢复。"
        "播报中边听边判断是不是在跟助手说话，叫流式拒识；扬声器安静了，不等于导航已取消或工具已失败。"
    ),
    "G": (
        "云端触发器只做调度：把已登记的条件与新到信号对上，产生一次有业务归属的触发。"
        "它回答「该不该继续处理、通知谁」；真正说话和控车交给下游。条件命中 ≠ 已经对用户说完并控好车。"
    ),
    "L": (
        "端侧触发把规则和判断放在车端：自己盯条件、出建议卡（先问用户再执行），确认后控车，整条链路可不绕云端。"
        "它服务下电、断网或需立刻响应的场景；出了建议卡 ≠ 雾灯已经打开，也不要与云端触发混成一次执行。"
    ),
}

INTRO_SEEN = {
    "R": {"拒识", "端云采信"},
    "M": {"计算准入", "发布许可", "InputManager"},
    "C": {"Context", "预注入"},
    "D": {"PlannerDirector", "ReAct"},
    "E": {"发布许可"},
    "O": {"TTS"},
    "I": {"流式拒识"},
    "G": {"云端触发器", "Trigger"},
    "L": {"端侧触发", "建议卡"},
}

CLOSING_LINE = {
    "V": None,  # already has strong closing
    "R": "下次评审可直接说：入口章争的是「该不该接」和「端云谁生效」；不争规划器是否办完，也不争工具是否回执成功。",
    "M": "下次评审可直接说：输入管理争的是并发编排与两道门（计算准入 / 发布许可）；不争意图理解和车控结果。",
    "C": "下次评审可直接说：Context 争的是「背景是否带来处、缺事实是否显式留下」；不争地址已查到或动作已执行。",
    "D": "下次评审可直接说：Planner/Director 争的是「目标—缺失事实—本轮可执行动作」一致；动作列表发出 ≠ 车里已办成。",
    "E": "下次评审可直接说：工具章争的是真实执行与逐项回流；接口成功 ≠ 用户已感知办完。",
    "O": "下次评审可直接说：输出章争的是说/显/做三本账对齐；TTS 起播 ≠ 车辆状态已变。",
    "I": "下次评审可直接说：插话章争的是停声、交入、恢复的边界；安静了 ≠ 任务取消。",
    "G": "下次评审可直接说：云端触发器争的是匹配与派发归属；命中 ≠ 已播报已控车。",
    "L": "下次评审可直接说：端侧章争的是本地闭环资格与确认后执行；建议卡 ≠ 已控车，且不与云端触发重复执行。",
}


def already_glossed(s, term, i):
    aft = s[i + len(term) : i + len(term) + 1]
    return aft in ("（", "(")


def ascii_ok(s, term, i):
    if not (term.isascii() and any(c.isalpha() for c in term)):
        return True
    left_ok = i == 0 or not (s[i - 1].isalnum() or s[i - 1] == "_")
    right_ok = i + len(term) >= len(s) or not (s[i + len(term)].isalnum() or s[i + len(term)] == "_")
    return left_ok and right_ok


def weave(text: str, seen: set) -> str:
    if not isinstance(text, str) or not text:
        return text
    for term, gloss, key in GLOSS + CN:
        if key in seen:
            continue
        start = 0
        while True:
            i = text.find(term, start)
            if i < 0:
                break
            if already_glossed(text, term, i):
                seen.add(key)
                break
            if not ascii_ok(text, term, i):
                start = i + len(term)
                continue
            # skip if term is inside an existing fullwidth paren gloss of something else? rare
            text = text[: i + len(term)] + f"（{gloss}）" + text[i + len(term) :]
            seen.add(key)
            break
    return text


def weave_obj(obj, seen: set):
    if isinstance(obj, str):
        return weave(obj, seen)
    if isinstance(obj, list):
        return [weave_obj(x, seen) for x in obj]
    if isinstance(obj, dict):
        skip = {"id", "nodeIds", "sourceIds", "related", "svg", "geometry", "x", "y", "width", "height", "path", "d", "points"}
        return {k: (v if k in skip else weave_obj(v, seen)) for k, v in obj.items()}
    return obj


def fix_page(page: dict) -> dict:
    pid = page["id"]
    teach = dict(page.get("teaching") or {})
    seen: set = set()

    intro = list(teach.get("intro") or [])
    if pid in INTRO_OPEN and intro:
        open_ = INTRO_OPEN[pid]
        if open_[:18] not in intro[0]:
            intro[0] = open_ + intro[0]
        seen |= set(INTRO_SEEN.get(pid) or [])
    intro = [weave(p, seen) for p in intro]

    lessons = []
    for L in teach.get("lessons") or []:
        L2 = dict(L)
        L2["title"] = weave(L.get("title") or "", seen)
        L2["paragraphs"] = [weave(p, seen) for p in (L.get("paragraphs") or [])]
        lessons.append(L2)

    closing = [weave(p, seen) for p in (teach.get("closing") or [])]
    cl = CLOSING_LINE.get(pid)
    if cl and not any((cl[:14] in (c or "")) for c in closing):
        closing.append(weave(cl, seen))

    if teach.get("guides"):
        teach["guides"] = weave_obj(copy.deepcopy(teach["guides"]), seen)

    teach["intro"] = intro
    teach["lessons"] = lessons
    teach["closing"] = closing

    page2 = dict(page)
    page2["teaching"] = teach
    for f in ("summary", "scenario", "title", "shortTitle"):
        if isinstance(page2.get(f), str):
            page2[f] = weave(page2[f], seen)
    if "sections" in page2:
        page2["sections"] = weave_obj(copy.deepcopy(page2["sections"]), seen)
    return page2


def fix_module(mod: dict) -> dict:
    seen: set = set()
    mod2 = dict(mod)
    for f in ("title", "subtitle", "summary"):
        if isinstance(mod2.get(f), str):
            mod2[f] = weave(mod2[f], seen)
    nodes = []
    for n in mod.get("nodes") or []:
        n2 = dict(n)
        for f in ("title", "detail", "summary", "label"):
            if isinstance(n2.get(f), str):
                n2[f] = weave(n2[f], seen)
        if "paragraphs" in n2:
            n2["paragraphs"] = [weave(p, seen) for p in (n2["paragraphs"] or [])]
        nodes.append(n2)
    mod2["nodes"] = nodes
    return mod2


def main():
    text = HTML.read_text(encoding="utf-8")
    m = re.search(r"const DATA=", text)
    start = m.end()
    data, end = json.JSONDecoder().raw_decode(text, start)

    meta = data.get("meta") or {}
    meta["version"] = "v31"
    meta["previousVersion"] = "v30"
    meta["teachingEditedAt"] = NOW.strftime("%Y-%m-%d")
    meta["builtAt"] = NOW.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"
    meta["refinement"] = (
        "v31：去掉硬塞术语框；目标章按宣讲逻辑把白话解释织进术语首次出现处；"
        "保留【待核】与机制事实，不新增无依据结论。"
    )
    data["meta"] = meta
    data.setdefault("base", {})["version"] = "v15-v31-weave"

    data["pages"] = [fix_page(p) if p.get("id") in TARGET else p for p in data.get("pages") or []]
    data["base"]["modules"] = [
        fix_module(m) if m.get("id") in TARGET else m for m in data["base"].get("modules") or []
    ]

    new_json = json.dumps(data, ensure_ascii=False, indent=2)
    HTML.write_text(text[:start] + new_json + text[end:], encoding="utf-8")

    # verify
    t2 = HTML.read_text(encoding="utf-8")
    d2, _ = json.JSONDecoder().raw_decode(t2, re.search(r"const DATA=", t2).end())
    samples = []
    for pid in ["V", "R", "D", "G"]:
        p = next(x for x in d2["pages"] if x["id"] == pid)
        samples.append({"page": pid, "intro0": p["teaching"]["intro"][0][:260]})
        # lesson first para sample for V
        if pid == "V":
            samples.append({"page": "V-L1-P1", "text": p["teaching"]["lessons"][0]["paragraphs"][1][:220]})

    forbidden = {k: t2.count(k) for k in ["名词解释｜", "【名词解释】", "本课新增/改写要点", "本轮可见改写", "名词解释"]}
    # teaching-only forbidden
    teach_blob = json.dumps([p.get("teaching") for p in d2["pages"] if p["id"] in TARGET], ensure_ascii=False)
    teach_forb = {k: teach_blob.count(k) for k in forbidden}

    report = {
        "at": NOW.isoformat(),
        "meta": d2["meta"]["version"],
        "forbidden_file": forbidden,
        "forbidden_teaching": teach_forb,
        "samples": samples,
        "V_intro_len": sum(len(re.sub(r"\s+", "", x)) for x in next(p for p in d2["pages"] if p["id"]=="V")["teaching"]["intro"]),
        "V_lesson_len": sum(len(re.sub(r"\s+", "", x)) for L in next(p for p in d2["pages"] if p["id"]=="V")["teaching"]["lessons"] for x in L["paragraphs"]),
    }
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
