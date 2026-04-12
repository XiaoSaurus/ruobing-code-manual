# -*- coding: utf-8 -*-
"""
生成「我的」模块菜单图标：统一线宽、深灰描边、画布内居中。
个人资料 / 意见反馈 / 更新日志 / 关于我们 / 切换主题
"""
from PIL import Image, ImageDraw
import math
import os

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))
SIZE = 96
COLOR = (64, 64, 64, 255)  # #404040
LW = 5


def _line(draw, pts, color, lw, curve=True):
    """折线；多点时尽量用圆角连接（Pillow 8.2+）。"""
    if len(pts) < 2:
        return
    kw = {"fill": color, "width": lw}
    if curve and len(pts) > 2:
        kw["joint"] = "curve"
    draw.line(pts, **kw)


def draw_profile(draw, color, size, lw):
    """个人资料：头圆 + 肩弧（椭圆底拱）"""
    s = size
    cx = s * 0.50
    cy_h = s * 0.39
    hr = s * 0.185
    rx, ry = s * 0.39, s * 0.28
    cy_e = cy_h + hr * 0.35
    span = 1.08
    n = 46
    pts = []
    for i in range(n + 1):
        u = i / n
        t = (math.pi / 2 - span) + (2 * span) * u
        x = cx + rx * math.cos(t)
        y = cy_e + ry * math.sin(t)
        pts.append((x, y))
    _line(draw, pts, color, lw)
    draw.ellipse([cx - hr, cy_h - hr, cx + hr, cy_h + hr], outline=color, width=lw)


def draw_feedback(draw, color, size, lw):
    """意见反馈：圆角对话气泡 + 内横线（语义清晰，与其它项体量一致）"""
    s = size
    x1, y1 = s * 0.18, s * 0.22
    x2, y2 = s * 0.78, s * 0.62
    r = s * 0.08
    try:
        draw.rounded_rectangle([x1, y1, x2, y2], radius=r, outline=color, width=lw)
    except AttributeError:
        draw.rectangle([x1, y1, x2, y2], outline=color, width=lw)
    # 小尖角
    tx = s * 0.30
    tail = [(tx - s * 0.06, y2), (tx, s * 0.72), (tx + s * 0.08, y2)]
    _line(draw, tail + [tail[0]], color, lw, curve=False)
    w2 = max(2, lw - 1)
    for i in range(3):
        yy = y1 + s * 0.14 + i * s * 0.11
        draw.line([(x1 + s * 0.10, yy), (x2 - s * 0.10, yy)], fill=color, width=w2)


def draw_changelog(draw, color, size, lw):
    """更新日志：文档 + 右上角小钟面（强调「时间 / 版本」）"""
    s = size
    x1, y1 = s * 0.18, s * 0.20
    x2, y2 = s * 0.68, s * 0.78
    draw.rectangle([x1, y1, x2, y2], outline=color, width=lw)
    # 折角
    fold = s * 0.12
    wfold = max(2, lw - 1)
    draw.line([(x2 - fold, y1), (x2, y1)], fill=color, width=wfold)
    draw.line([(x2, y1), (x2, y1 + fold)], fill=color, width=wfold)
    w2 = max(2, lw - 1)
    for i in range(4):
        yy = y1 + s * 0.18 + i * s * 0.11
        draw.line([(x1 + s * 0.08, yy), (x2 - s * 0.22, yy)], fill=color, width=w2)
    # 小钟
    cx, cy = s * 0.76, s * 0.30
    cr = s * 0.12
    draw.ellipse([cx - cr, cy - cr, cx + cr, cy + cr], outline=color, width=max(2, lw - 1))
    draw.line([(cx, cy), (cx, cy - cr * 0.55)], fill=color, width=w2)
    draw.line([(cx, cy), (cx + cr * 0.45, cy)], fill=color, width=w2)


def draw_about(draw, color, size, lw):
    """关于我们：圆环 + i（信息）"""
    s = size
    cx, cy = s * 0.50, s * 0.50
    r = s * 0.32
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=color, width=lw)
    w2 = max(2, lw - 1)
    draw.line([(cx, cy - r * 0.42), (cx, cy + r * 0.28)], fill=color, width=w2)
    dot_r = s * 0.045
    draw.ellipse(
        [cx - dot_r, cy + r * 0.34, cx + dot_r, cy + r * 0.52],
        fill=color,
    )


def draw_theme(draw, color, size, lw):
    """切换主题：三档滑条（单色，与列表里彩色圆点呼应，不抢色）"""
    s = size
    y1, y2, y3 = s * 0.26, s * 0.50, s * 0.74
    x0, x1 = s * 0.18, s * 0.82
    kr = s * 0.065
    w2 = max(2, lw - 1)
    for y, kx in [(y1, 0.64), (y2, 0.38), (y3, 0.58)]:
        draw.line([(x0, y), (x1, y)], fill=color, width=w2)
        kcx = s * kx
        draw.ellipse(
            [kcx - kr, y - kr, kcx + kr, y + kr],
            outline=color,
            width=w2,
        )


def generate_all():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    icons = [
        ("icon-profile", draw_profile),
        ("icon-feedback", draw_feedback),
        ("icon-changelog", draw_changelog),
        ("icon-about", draw_about),
        ("icon-theme", draw_theme),
    ]

    for icon_name, draw_fn in icons:
        img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
        d = ImageDraw.Draw(img)
        draw_fn(d, COLOR, SIZE, LW)
        out_path = os.path.join(OUTPUT_DIR, f"{icon_name}.png")
        img.save(out_path, "PNG")
        print(f"Generated: {icon_name}.png")

    print("Done!")


if __name__ == "__main__":
    generate_all()
