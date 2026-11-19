"""Build the S chapter of the learning site from v76 and the S-v2 files."""

from collections import Counter
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import xml.etree.ElementTree as ET

from markdown_it import MarkdownIt


HERE = Path(__file__).resolve().parent
HTML_DIR = HERE.parents[2] / "HTML" / "01-进行中"
BASE = HTML_DIR / "豆包汽车-业务学习站-v76.html"
OUT = HTML_DIR / "豆包汽车-业务学习站-v77.html"
PART_ORDER = (1, 2, 3, 5, 4)
COMMENT = re.compile(r"<!--[\s\S]*?-->")
FIGURE_MARKER = re.compile(r"<!--\s*figure:([\w-]+)\s*-->")
FIGURE_ORDER = (
    "s2-overview", "s2-roles", "s2-judge", "s2-strategy", "s2-delivery",
    "s2-followup", "s2-debug", "s2-overview", "s-base",
)
ORIGINAL_INTRO = (
    "这是本章原来的全图，按一次主动服务的先后排：先发现机会，再判断建议内容和打扰方式，"
    "交到用户面前并接回 Planner，执行后更新 AI Bar，最后决定继续关注还是结束。"
)
APPENDIX = "附二　历史版本与关键数字"
APPENDIX_OPEN = f"<details><summary>{APPENDIX}</summary>"
ARCHIVE_OPEN = '<details class="voice-original v55-archive" id="s77-history">'
DATA_SCRIPT = re.compile(r"const DATA=(.*?);\s*</script>", re.S)
BANNED = re.compile(
    r"资料|清单|待确认|口径|没有展开|未展开|技术方案|宣讲|周报|逐字稿|文字记录|纪要|"
    r"缺陷表|群聊|小模型|书名号|真实人名|[《》〈〉]|"
    r"(?<![A-Za-z0-9_])(?:PRD|DT|Director|OnePage)(?![A-Za-z0-9_])",
    re.IGNORECASE,
)
GENERAL_TERMS = {
    "AI", "Advisor", "Bar", "Context", "PHUD", "Planner", "UI",
    "Bad", "Frontier", "Good", "GSB", "Same", "SP",
    *"ABCDEFGHIKLMOPRSTUVWX",
}
FLOW_LABEL = re.compile(r"[A-Z]\d{1,2}")

# Translate labels on embedding. The input drawings and their geometry stay intact.
FIGURE_LABELS = {
    "s2-roles": {"advisor 输入": "建议输入"},
    "s2-delivery": {
        "把 advisor 输入当作建议，可只采纳部分": "把收到的内容当作建议，可只采纳部分",
        "advisor 输入": "建议输入",
    },
    "s2-debug": {"advisor 输入": "建议输入"},
    "s-base": {
        "10分钟或新事件review": "10分钟或新事件复查",
        "用户Task/Goal作上下文": "用户已有任务作上下文",
        "已有 Task 或 Goal": "已有任务或目标",
        "Advisor 在 real_time_card ": "Advisor 在即时交互卡配置",
        ">query 上行。": ">用户输入上行。",
        "另用 need_confirm 控制": "另用确认标记控制",
        "以 advice 类型进入": "以建议类型进入",
        "用户有效 Query 可以": "用户有效输入可以",
        "。ActionList </tspan>": "。</tspan>",
        ">透传方案要求": ">回写方案要求",
        "ActionList 透传方案先": "逐项回传方案先",
        "与用户 Task</tspan>": "与用户任务</tspan>",
        "> 或 Goal 分别": ">或目标分别",
        "上汽 Goal 与自建 Task": "上汽目标与自建任务",
        "由 Task Service 或 Extour": "由任务服务或弋途",
        "> Goal 托管。": ">目标引擎托管。",
        "一起回给 Planne</tspan>": "一起回给</tspan>",
        ">r，Planner 因此知道确认的是哪个对象、哪项操作，再生成": (
            ">Planner，Planner 因此知道确认的是哪个对象、哪项操作，"
        ),
        ">本轮工具调用。</tspan>": ">再生成本轮工具调用。</tspan>",
        ">advice 只说明": ">建议只说明",
    },
}


def replace_once(text, old, new):
    assert text.count(old) == 1, f"Expected one occurrence of {old!r}"
    return text.replace(old, new, 1)


class TextNodes(HTMLParser):
    def __init__(self, markup):
        super().__init__(convert_charrefs=True)
        self.parts = []
        self.feed(markup)
        self.close()

    def handle_data(self, text):
        if text.strip():
            self.parts.append(text.strip("\n"))


def check_terms(text, label, outside_appendix=False):
    assert not BANNED.search(text), (label, BANNED.findall(text))
    if outside_appendix:
        tokens = set(re.findall(r"[A-Za-z][A-Za-z0-9_.-]*", text))
        unexpected = {t for t in tokens - GENERAL_TERMS if not FLOW_LABEL.fullmatch(t)}
        assert not unexpected, (label, "Review technical identifiers outside appendix two", unexpected)


def merge_parts():
    parts = [(HERE / f"part-{number}.md").read_text(encoding="utf-8") for number in PART_ORDER]
    cleaned = [
        COMMENT.sub(lambda match: match[0] if FIGURE_MARKER.fullmatch(match[0]) else "", part).strip("\n")
        for part in parts
    ]
    full = "\n\n".join(cleaned) + "\n"
    assert tuple(FIGURE_MARKER.findall(full)) == FIGURE_ORDER
    check_terms(COMMENT.sub("", full), "full.md")
    return full


def render_chapter(full):
    md = MarkdownIt("commonmark", {"html": True, "typographer": False}).enable("table")
    # Match v76's emphasis handling for labels like **例子：** followed by Chinese prose.
    marked = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", full)
    assert "**" not in marked
    tokens = md.parse(marked)
    headings = []
    counts = Counter()
    for index, token in enumerate(tokens):
        if token.type == "heading_open":
            assert token.tag in ("h2", "h3")
            title = tokens[index + 1].content
            anchor = f"s77-heading-{len(headings) + 1:02d}"
            token.attrSet("id", anchor)
            token.attrSet("data-section-title", title)
            headings.append({"id": anchor, "level": int(token.tag[1]), "title": title})
            counts[token.tag] += 1
        elif token.type == "paragraph_open":
            content = tokens[index + 1].content
            if content.startswith("<strong>例子："):
                token.attrSet("class", "v58-example")
                counts["examples"] += 1
            elif content.startswith("<strong>案例："):
                token.attrSet("class", "v58-case")
                counts["cases"] += 1

    source_html = md.renderer.render(tokens, md.options, {})
    assert source_html.count("<details>") == source_html.count("</details>") == 2
    outside, appendix = source_html.split(APPENDIX_OPEN, 1)
    assert "<code>" not in outside
    check_terms(" ".join(TextNodes(outside).parts), "S chapter prose", outside_appendix=True)
    check_terms(" ".join(TextNodes(appendix).parts), "S chapter appendix")

    rendered = source_html.replace("<table>", '<div class="voice-table-scroll" tabindex="0"><table>')
    rendered = rendered.replace("</table>", "</table></div>")
    rendered = replace_once(
        rendered, "<details><summary>原始全图</summary>",
        '<details class="voice-original" id="detailed-flow"><summary>原始全图</summary>',
    )
    archive = next(heading for heading in headings if heading["title"] == APPENDIX)
    heading = f'<h2 id="{archive["id"]}" data-section-title="{APPENDIX}">{APPENDIX}</h2>'
    rendered = replace_once(
        rendered, f"{APPENDIX_OPEN}\n{heading}", f"{ARCHIVE_OPEN}<summary>{heading}</summary>",
    )
    assert f"</details>\n{ARCHIVE_OPEN}" in rendered
    diagram = "<!-- figure:s-base -->"
    introduction = f"<p>{ORIGINAL_INTRO}</p>\n"
    rendered = replace_once(rendered, diagram, introduction + diagram)
    assert tuple(FIGURE_MARKER.findall(rendered)) == FIGURE_ORDER
    check_terms(ORIGINAL_INTRO, "Original figure introduction", outside_appendix=True)

    # In v76's layout the appendix heading serves as the summary label.
    expected = replace_once(source_html, f"<summary>{APPENDIX}</summary>", "")
    comparison = TextNodes(replace_once(rendered, introduction, "")).parts
    assert comparison == TextNodes(expected).parts
    return rendered, headings, counts, sum(map(len, comparison))


def load_figures():
    diagrams, titles, subtitles = {}, {}, {}
    for key in dict.fromkeys(FIGURE_ORDER):
        folder = "figures-orig" if key == "s-base" else "figures"
        path = HERE / folder / f"{key}.svg"
        svg = path.read_text(encoding="utf-8")
        for original, label in FIGURE_LABELS.get(key, {}).items():
            assert original in svg, (key, original)
            svg = svg.replace(original, label)
        root = ET.fromstring(svg)
        assert root.tag == "{http://www.w3.org/2000/svg}svg" and root.get("viewBox")
        meta = json.loads(path.with_suffix(".json").read_text(encoding="utf-8"))
        assert meta["id"] == key
        visible = [
            text
            for element in root.iter() if element.tag.rsplit("}", 1)[-1] != "style"
            for text in (element.text or "", element.get("title", ""), element.get("aria-label", ""))
        ]
        check_terms(" ".join([meta["title"], meta["subtitle"], *visible]), key, outside_appendix=True)
        diagrams[key], titles[key], subtitles[key] = svg, meta["title"], meta["subtitle"]
    return diagrams, titles, subtitles


def legacy_targets(headings, old_page):
    def section(prefix):
        return next(heading["id"] for heading in headings if heading["title"].startswith(prefix))

    targets = {
        "s-origin": section("开篇"),
        "s-strategy": section("四、"),
        "s-routing": section("五、"),
        "s-result": section("六、"),
        "s-followup": section("七、"),
        "s-expert-review-detail": section("专家知识讲怎样算做好"),
        "learn-s-opportunity": section("上车只是一个机会"),
        "learn-s-evidence": section("先定照顾谁"),
        "teach-back": section("收尾"),
        "guide-base-S": "detailed-flow",
    }
    for lesson in old_page["teaching"]["lessons"]:
        key = lesson["id"]
        targets[f"learn-{key}"] = targets[key]
    for alias, target in old_page["legacyChapterTargets"].items():
        targets[alias] = targets[target]
    return targets


def encode_data(data):
    return json.dumps(data, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")


def build_html(base, full):
    original = DATA_SCRIPT.search(base)
    assert original
    data = json.loads(original[1])
    assert encode_data(data) == original[1]
    old_pages = list(data["pages"])
    index = next(i for i, page in enumerate(old_pages) if page["id"] == "S")
    old_page = old_pages[index]
    body, headings, counts, characters = render_chapter(full)
    diagrams, titles, subtitles = load_figures()
    assert not data["diagrams"].keys() & diagrams.keys()
    data["diagrams"].update(diagrams)
    data["pages"][index] = {
        "id": "S",
        "title": old_page["title"],
        "shortTitle": old_page["shortTitle"],
        "summary": "从主驾上车到 24 度，沿一次主动降温读懂 Advisor 的判断、交接和跟进。",
        "v55": {
            "html": body, "headings": headings,
            "figureTitles": titles, "figureSubtitles": subtitles,
        },
        "legacyChapterTargets": legacy_targets(headings, old_page),
    }
    assert data["pages"][:index] == old_pages[:index]
    assert data["pages"][index + 1:] == old_pages[index + 1:]

    output = base[:original.start(1)] + encode_data(data) + base[original.end(1):]
    for old, new in (
        ("<title>豆包汽车业务学习站 v76</title>", "<title>豆包汽车业务学习站 v77</title>"),
        ('{"revision": "v76", "pages": {}}', '{"revision": "v77", "pages": {}}'),
        ("revision: 'v76'", "revision: 'v77'"),
        ("'cockpit-learning-document:v76:'", "'cockpit-learning-document:v77:'"),
        ("我的修订-v76.html", "我的修订-v77.html"),
        ("['D','SP','E','G','L'].includes(page.id)", "['D','SP','E','G','L','S'].includes(page.id)"),
    ):
        output = replace_once(output, old, new)
    return output, {
        **counts, "svg": len(FIGURE_ORDER), "distinctSvg": len(diagrams), "details": 2,
        "matchingTextCharacters": characters, "otherChaptersIdentical": len(old_pages) - 1,
    }


def main():
    full = merge_parts()
    output, counts = build_html(BASE.read_bytes().decode("utf-8"), full)
    payload = output.encode("utf-8")
    if OUT.exists():
        assert OUT.read_bytes() == payload, f"Refusing to overwrite {OUT}"
    else:
        with OUT.open("xb") as file:
            file.write(payload)
    (HERE / "full.md").write_text(full, encoding="utf-8")
    print(json.dumps({"output": str(OUT), **counts}, ensure_ascii=False))


if __name__ == "__main__":
    main()
