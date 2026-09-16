#!/usr/bin/env python3
"""Convert rendered Mermaid SVG modules into a native editable draw.io canvas.

The converter intentionally targets the basic mxGraph primitives supported by
Feishu whiteboard import: containers, text-bearing rectangles/diamonds, and
orthogonal connectors. It keeps every business node as an independent cell.
"""

from __future__ import annotations

import argparse
import html
import re
import xml.etree.ElementTree as ET
from pathlib import Path


SVG = "{http://www.w3.org/2000/svg}"
XHTML = "{http://www.w3.org/1999/xhtml}"


def classes(el: ET.Element) -> set[str]:
    return set((el.attrib.get("class") or "").split())


def translate(value: str | None) -> tuple[float, float]:
    if not value:
        return 0.0, 0.0
    m = re.search(r"translate\(\s*([-\d.]+)(?:[ ,]+([-\d.]+))?\s*\)", value)
    return (float(m.group(1)), float(m.group(2) or 0)) if m else (0.0, 0.0)


def style_value(style: str, key: str, fallback: str) -> str:
    m = re.search(rf"(?:^|;)\s*{re.escape(key)}\s*:\s*([^;!]+)", style)
    return m.group(1).strip() if m else fallback


def clean_color(value: str, fallback: str) -> str:
    value = value.strip()
    if re.fullmatch(r"#[0-9a-fA-F]{3,8}", value):
        return value
    m = re.fullmatch(r"rgb\(\s*(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)\s*\)", value)
    if m:
        return "#" + "".join(f"{max(0,min(255,round(float(x)))):02X}" for x in m.groups())
    return fallback


def label_html(el: ET.Element) -> str:
    p = next(iter(el.findall(f".//{XHTML}p")), None)
    if p is None:
        text = "".join(el.itertext()).strip()
        return text

    out: list[str] = []

    def walk(node: ET.Element) -> None:
        if node.text:
            out.append(node.text)
        for child in node:
            if child.tag == f"{XHTML}br":
                out.append("<br>")
            else:
                walk(child)
            if child.tail:
                out.append(child.tail)

    walk(p)
    return "".join(out).strip()


def shape_bbox(node: ET.Element) -> tuple[float, float, float, float, str, str]:
    for child in node:
        tag = child.tag.rsplit("}", 1)[-1]
        if tag == "rect" and "label-container" in classes(child):
            x = float(child.attrib.get("x", 0)); y = float(child.attrib.get("y", 0))
            w = float(child.attrib.get("width", 180)); h = float(child.attrib.get("height", 70))
            return x, y, w, h, "rounded", child.attrib.get("style", "")
        if tag == "polygon":
            pts = [tuple(map(float, p.split(","))) for p in child.attrib.get("points", "").split() if "," in p]
            if pts:
                xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
                return min(xs), min(ys), max(xs)-min(xs), max(ys)-min(ys), "rhombus", child.attrib.get("style", "")
        if tag in {"circle", "ellipse"}:
            if tag == "circle":
                cx=float(child.attrib.get("cx",0)); cy=float(child.attrib.get("cy",0)); rx=ry=float(child.attrib.get("r",35))
            else:
                cx=float(child.attrib.get("cx",0)); cy=float(child.attrib.get("cy",0)); rx=float(child.attrib.get("rx",70)); ry=float(child.attrib.get("ry",35))
            return cx-rx, cy-ry, rx*2, ry*2, "ellipse", child.attrib.get("style", "")
        if tag == "path" and ("label-container" in classes(child) or "basic" in classes(child)):
            nums = [float(x) for x in re.findall(r"-?\d+(?:\.\d+)?", child.attrib.get("d", ""))]
            xs = nums[0::2]; ys = nums[1::2]
            if xs and ys:
                return min(xs), min(ys), max(xs)-min(xs), max(ys)-min(ys), "rounded", child.attrib.get("style", "")
    return -100, -35, 200, 70, "rounded", ""


def abs_transform_map(root: ET.Element) -> dict[ET.Element, tuple[float, float]]:
    out: dict[ET.Element, tuple[float, float]] = {}

    def visit(el: ET.Element, px: float, py: float) -> None:
        dx, dy = translate(el.attrib.get("transform"))
        x, y = px + dx, py + dy
        out[el] = (x, y)
        for child in el:
            visit(child, x, y)

    visit(root, 0, 0)
    return out


def parse_module(path: Path, prefix: str, ox: float, oy: float, scale: float):
    root = ET.parse(path).getroot()
    tmap = abs_transform_map(root)
    node_map: dict[str, str] = {}
    cells: list[str] = []
    clusters: list[str] = []
    edges_raw: list[tuple[str, str, str]] = []

    for idx, g in enumerate(root.iter(f"{SVG}g")):
        cls = classes(g)
        if "cluster" not in cls:
            continue
        rect = next((c for c in g if c.tag == f"{SVG}rect"), None)
        if rect is None:
            continue
        tx, ty = tmap[g]
        x=(tx+float(rect.attrib.get("x",0)))*scale+ox; y=(ty+float(rect.attrib.get("y",0)))*scale+oy
        w=float(rect.attrib.get("width",200))*scale; h=float(rect.attrib.get("height",100))*scale
        val=html.escape(label_html(g), quote=True)
        cid=f"{prefix}_cluster_{idx}"
        style="rounded=1;whiteSpace=wrap;html=1;verticalAlign=top;align=left;spacingTop=8;spacingLeft=10;fillColor=#F8FAFC;strokeColor=#CBD5E1;dashed=1;fontColor=#475467;fontSize=15;"
        clusters.append(f'<mxCell id="{cid}" value="{val}" style="{style}" vertex="1" parent="1"><mxGeometry x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" as="geometry"/></mxCell>')

    node_groups=[]
    for g in root.iter(f"{SVG}g"):
        if "node" in classes(g) and re.search(r"flowchart-(.+)-\d+$", g.attrib.get("id", "")):
            node_groups.append(g)

    for idx, g in enumerate(node_groups):
        m=re.search(r"flowchart-(.+)-\d+$", g.attrib.get("id", ""))
        source_id=m.group(1)
        cell_id=f"{prefix}_node_{idx}"
        node_map[source_id]=cell_id
        tx,ty=tmap[g]
        sx,sy,w,h,kind,raw_style=shape_bbox(g)
        x=(tx+sx)*scale+ox; y=(ty+sy)*scale+oy; w=max(80,w*scale); h=max(42,h*scale)
        label=html.escape(label_html(g), quote=True)
        fill=clean_color(style_value(raw_style,"fill","#FFFFFF"),"#FFFFFF")
        stroke=clean_color(style_value(raw_style,"stroke","#98A2B3"),"#98A2B3")
        class_list=classes(g)
        if "title" in class_list: fill,stroke="#0F172A","#0F172A"
        font="#FFFFFF" if "title" in class_list else "#172033"
        if "danger" in class_list or "risk" in class_list: fill,stroke,font="#FFF0F2","#D35D78","#6B2030"
        if kind=="rhombus": base="rhombus;"
        elif kind=="ellipse": base="ellipse;"
        else: base="rounded=1;arcSize=10;"
        dash="dashed=1;" if ("danger" in class_list or "risk" in class_list or "note" in class_list) else ""
        style=f"{base}whiteSpace=wrap;html=1;align=center;verticalAlign=middle;spacing=8;fillColor={fill};strokeColor={stroke};fontColor={font};fontSize=14;strokeWidth=1.5;{dash}"
        cells.append(f'<mxCell id="{cell_id}" value="{label}" style="{style}" vertex="1" parent="1"><mxGeometry x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" as="geometry"/></mxCell>')

    known=sorted(node_map,key=len,reverse=True)
    edge_labels={}
    for lab in root.iter(f"{SVG}g"):
        if "label" in classes(lab) and lab.attrib.get("data-id"):
            edge_labels[lab.attrib["data-id"]]=label_html(lab)

    for path_el in root.iter(f"{SVG}path"):
        data_id=path_el.attrib.get("data-id")
        if not data_id or not data_id.startswith("L_"):
            continue
        middle=re.sub(r"_\d+$","",data_id[2:])
        pair=None
        for a in known:
            marker=a+"_"
            if middle.startswith(marker):
                rest=middle[len(marker):]
                for b in known:
                    if rest==b or rest.startswith(b+"_"):
                        pair=(a,b); break
            if pair: break
        if pair and pair[0] in node_map and pair[1] in node_map:
            edges_raw.append((node_map[pair[0]],node_map[pair[1]],html.escape(edge_labels.get(data_id,""), quote=True)))

    for idx,(src,dst,label) in enumerate(edges_raw):
        eid=f"{prefix}_edge_{idx}"
        style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;strokeColor=#78909C;fontColor=#475467;fontSize=12;"
        cells.append(f'<mxCell id="{eid}" value="{label}" style="{style}" edge="1" parent="1" source="{src}" target="{dst}"><mxGeometry relative="1" as="geometry"/></mxCell>')
    return clusters + cells


def main() -> None:
    ap=argparse.ArgumentParser()
    ap.add_argument("output", type=Path)
    ap.add_argument("inputs", nargs="+", type=Path)
    ap.add_argument("--scale", type=float, default=1.0)
    ap.add_argument("--gap", type=float, default=260.0)
    ap.add_argument("--layout", choices=["vertical", "dashboard"], default="vertical")
    args=ap.parse_args()

    dims=[]
    for path in args.inputs:
        root=ET.parse(path).getroot(); vb=[float(x) for x in root.attrib.get("viewBox","0 0 1000 600").split()]
        dims.append((vb[2]*args.scale,vb[3]*args.scale))

    placements=[]
    if args.layout=="dashboard" and len(args.inputs)==5:
        w1,h1=dims[0]; w2,h2=dims[1]; w3,h3=dims[2]; w4,h4=dims[3]; w5,h5=dims[4]
        row1_w=w1+args.gap+w2; row2_w=w3+args.gap+w4; canvas_w=max(row1_w,row2_w,w5)
        y2=max(h1,h2)+args.gap; y3=y2+max(h3,h4)+args.gap
        placements=[(0,0),(w1+args.gap,0),(0,y2),(w3+args.gap,y2),((canvas_w-w5)/2,y3)]
        max_w=canvas_w; y=y3+h5+args.gap
    else:
        y=0.0; max_w=max((w for w,_ in dims),default=0.0)
        for w,h in dims:
            placements.append(((max_w-w)/2,y)); y+=h+args.gap

    all_cells=[]
    for idx,(path,(x0,y0)) in enumerate(zip(args.inputs,placements),1):
        all_cells.extend(parse_module(path,f"m{idx}",x0,y0,args.scale))

    model_attrs='dx="1200" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="0" pageScale="1" pageWidth="1600" pageHeight="900" math="0" shadow="0"'
    body=''.join(all_cells)
    xml=f'<?xml version="1.0" encoding="UTF-8"?><mxfile host="app.diagrams.net" modified="2026-09-03T00:00:00.000Z" agent="Codex" version="26.0.0"><diagram id="driver-agent-v07" name="02-05 详细链路"><mxGraphModel {model_attrs}><root><mxCell id="0"/><mxCell id="1" parent="0"/>{body}</root></mxGraphModel></diagram></mxfile>'
    args.output.write_text(xml,encoding="utf-8")
    print(f"wrote {args.output} cells={len(all_cells)} canvas={max_w:.0f}x{y:.0f}")


if __name__ == "__main__":
    main()
