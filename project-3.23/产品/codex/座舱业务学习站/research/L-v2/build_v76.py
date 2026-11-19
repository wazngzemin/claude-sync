"""Build the learning site's L chapter from v75 and the approved L-v2 inputs."""

from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
import json
import re
import xml.etree.ElementTree as ET

from markdown_it import MarkdownIt


HERE = Path(__file__).resolve().parent
HTML_DIR = HERE.parents[2] / "HTML" / "01-进行中"
BASE = HTML_DIR / "豆包汽车-业务学习站-v75.html"
OUT = HTML_DIR / "豆包汽车-业务学习站-v76.html"
PART_ORDER = (1, 2, 3, 5, 4)
FIGURE_MARKER = re.compile(r"<!--\s*figure:([\w-]+)\s*-->")
FIGURE_ORDER = (
    "l2-overview", "l2-split", "l2-vision", "l2-channels", "l2-weather",
    "l2-switches", "l2-debug", "l2-overview", "l-base",
)
ORIGINAL_INTRO = (
    "这是本章原来的全图，按一次本地闭环的先后排：先确认车辆和任务能运行、装入规则、"
    "等相关状态更新，再判断条件、出卡询问、收确认、复核执行，最后记下结果，仍开启的任务回到等待。"
)
APPENDIX = "附二　历史版本与关键数字"
APPENDIX_OPEN = f"<details><summary>{APPENDIX}</summary>"
BANNED = re.compile(
    r"资料|PRD|清单|待确认|口径|没有展开|未展开|技术方案|宣讲|周报|逐字稿|文字记录|"
    r"纪要|缺陷表|群聊|DT|Director|小模型|OnePage|书名号|[《》〈〉]"
)
GENERAL_TERMS = {
    "AI", "Advisor", "Agent", "Box", "Planner", "SDK", "TTS", "VLM",
    "JavaScript", "E68", "P0", "V1.2", "SP",
    *"ABCEGKLPRTUVW",
}
FLOW_LABEL = re.compile(r"(?:A|B|L|P|U|X)\d{2}")
DATA_SCRIPT = re.compile(r"const DATA=(.*?);\s*</script>", re.S)


def replace_once(text, old, new):
    assert text.count(old) == 1, f"Expected one occurrence of {old!r}"
    return text.replace(old, new, 1)


class TextNodes(HTMLParser):
    """Collect the prose without layout newlines, tags, or figure comments."""

    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.parts = []
        self.feed(html)
        self.close()

    def handle_data(self, text):
        if text.strip():
            self.parts.append(text.strip("\n"))


def check_terms(text, label, outside_appendix=False):
    assert not BANNED.search(text), (label, BANNED.findall(text))
    if outside_appendix:
        tokens = set(re.findall(r"[A-Za-z][A-Za-z0-9_.-]*", text))
        unexpected = {t for t in tokens - GENERAL_TERMS if not FLOW_LABEL.fullmatch(t)}
        assert not unexpected, (label, "Review English names outside appendix two", unexpected)


def merge_parts():
    def keep_figure(match):
        return match[0] if FIGURE_MARKER.fullmatch(match[0]) else ""

    parts = [(HERE / f"part-{n}.md").read_text(encoding="utf-8") for n in PART_ORDER]
    cleaned = [re.sub(r"<!--[\s\S]*?-->", keep_figure, part).strip("\n") for part in parts]
    full = "\n\n".join(cleaned) + "\n"
    assert tuple(FIGURE_MARKER.findall(full)) == FIGURE_ORDER
    check_terms(re.sub(r"<!--[\s\S]*?-->", "", full), "full.md")
    return full


def render_chapter(full):
    md = MarkdownIt("commonmark", {"html": True, "typographer": False}).enable("table")
    # CommonMark treats emphasis ending in a colon before Chinese text as literal.
    marked = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", full)
    assert "**" not in marked
    tokens = md.parse(marked)
    headings = []
    counts = Counter()
    for index, token in enumerate(tokens):
        if token.type == "heading_open":
            assert token.tag in ("h2", "h3")
            title = tokens[index + 1].content
            anchor = f"l76-heading-{len(headings) + 1:02d}"
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
    outside = source_html.split(APPENDIX_OPEN, 1)[0]
    assert "<code>" not in outside
    check_terms("".join(TextNodes(outside).parts), "L chapter prose", outside_appendix=True)
    rendered = source_html.replace("<table>", '<div class="voice-table-scroll" tabindex="0"><table>')
    rendered = rendered.replace("</table>", "</table></div>")
    rendered = replace_once(
        rendered, "<details><summary>原始全图</summary>",
        '<details class="voice-original" id="detailed-flow"><summary>原始全图</summary>',
    )
    extra_intro = f"<p>{ORIGINAL_INTRO}</p>\n"
    fig = "<!-- figure:l-base -->"
    rendered = replace_once(rendered, fig, extra_intro + fig)

    archive = next(h for h in headings if h["title"] == APPENDIX)
    heading = f'<h2 id="{archive["id"]}" data-section-title="{APPENDIX}">{APPENDIX}</h2>'
    rendered = replace_once(
        rendered, f"{APPENDIX_OPEN}\n{heading}",
        f'<details class="voice-original v55-archive" id="l76-history"><summary>{heading}</summary>',
    )
    assert tuple(FIGURE_MARKER.findall(rendered)) == FIGURE_ORDER
    assert '</details>\n<details class="voice-original v55-archive" id="l76-history">' in rendered

    # The heading is now the summary label, so the duplicate source label is
    # omitted when comparing prose. The original diagram introduction stays.
    expected = md.render(marked).replace(f"<summary>{APPENDIX}</summary>", "", 1)
    comparison = TextNodes(replace_once(rendered, extra_intro, "")).parts
    assert comparison == TextNodes(expected).parts
    return rendered, headings, counts, sum(map(len, comparison))


def load_figures():
    diagrams, titles, subtitles = {}, {}, {}
    for key in dict.fromkeys(FIGURE_ORDER):
        folder = "figures-orig" if key == "l-base" else "figures"
        path = HERE / folder / f"{key}.svg"
        svg = path.read_bytes().decode("utf-8")
        root = ET.fromstring(svg)
        assert root.tag == "{http://www.w3.org/2000/svg}svg" and root.get("viewBox")
        meta = json.loads(path.with_suffix(".json").read_text(encoding="utf-8"))
        label_text = " ".join(
            part
            for element in root.iter() if element.tag.rsplit("}", 1)[-1] != "style"
            for part in (element.text or "", element.get("aria-label", ""))
        )
        check_terms(svg, key)
        check_terms(" ".join([label_text, meta["title"], meta["subtitle"]]), key, outside_appendix=True)
        diagrams[key] = svg
        titles[key] = meta["title"]
        subtitles[key] = meta["subtitle"]
    return diagrams, titles, subtitles


def legacy_targets(headings, old_page):
    def section(prefix):
        return next(h["id"] for h in headings if h["title"].startswith(prefix))

    targets = {
        "l-ready": section("AI Box 跑模型"),
        "l-control-data": section("三、"),
        "l-resources": section("同一个摄像头有任务争用"),
        "l-local-business": section("触发器把建议交给天气业务"),
        "l-confirm": section("确认之后再读车况"),
        "l-lifecycle": section("六、"),
        "learn-l-ready": section("一、"),
        "learn-l-control": section("三、"),
        "learn-l-business": section("触发器把建议交给天气业务"),
        "learn-l-execute": section("确认之后再读车况"),
        "teach-back": section("收尾"),
        "guide-base-L": "detailed-flow",
    }
    for alias, target in old_page["legacyChapterTargets"].items():
        targets[alias] = targets[target]
    for lesson in old_page["teaching"]["lessons"]:
        key = lesson["id"]
        targets.setdefault(f"learn-{key}", targets[key])
    return targets


def build_html(base, full):
    data = json.loads(DATA_SCRIPT.search(base)[1])
    old_pages = list(data["pages"])
    index = next(i for i, page in enumerate(old_pages) if page["id"] == "L")
    old_page = old_pages[index]
    body, headings, counts, characters = render_chapter(full)
    diagrams, titles, subtitles = load_figures()
    assert not data["diagrams"].keys() & diagrams.keys()
    data["diagrams"].update(diagrams)
    data["pages"][index] = {
        "id": "L",
        "title": old_page["title"],
        "shortTitle": old_page["shortTitle"],
        "summary": "沿一次雾天提醒，看车上怎样观察、判断、询问主驾、开灯并读回灯态。",
        "v55": {
            "html": body, "headings": headings,
            "figureTitles": titles, "figureSubtitles": subtitles,
        },
        "legacyChapterTargets": legacy_targets(headings, old_page),
    }
    assert data["pages"][:index] == old_pages[:index]
    assert data["pages"][index + 1:] == old_pages[index + 1:]

    original_json = DATA_SCRIPT.search(base)[1]
    # Preserve the base serialization so the untouched chapters are byte-identical.
    def encode(value):
        return json.dumps(value, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")

    before = json.loads(original_json)
    assert encode(before) == original_json
    output = replace_once(base, original_json, encode(data))
    for old, new in (
        ("<title>豆包汽车业务学习站 v75</title>", "<title>豆包汽车业务学习站 v76</title>"),
        ('{"revision": "v75", "pages": {}}', '{"revision": "v76", "pages": {}}'),
        ("revision: 'v75'", "revision: 'v76'"),
        ("'cockpit-learning-document:' + location.pathname", "'cockpit-learning-document:v76:' + location.pathname"),
        ("我的修订-v75.html", "我的修订-v76.html"),
        ("['D','SP','E','G'].includes(page.id)", "['D','SP','E','G','L'].includes(page.id)"),
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
