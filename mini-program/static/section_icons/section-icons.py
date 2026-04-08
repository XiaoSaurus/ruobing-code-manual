# -*- coding: utf-8 -*-
"""生成 section 头部 PNG 图标（简洁几何风格）"""
import os
import sys
import math
sys.stdout.reconfigure(encoding='utf-8')

try:
    from PIL import Image, ImageDraw
except Exception:
    import subprocess
    subprocess.run(["pip", "install", "Pillow", "-q"])
    from PIL import Image, ImageDraw

out_dir = os.path.dirname(os.path.abspath(__file__))

def make_icon(filename, bg_rgba, shape_fn, size=64):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 圆形背景
    cx, cy = size // 2, size // 2
    r = size // 2 - 2
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=bg_rgba)

    # 绘制图形
    shape_fn(draw, cx, cy, size)

    path = os.path.join(out_dir, filename)
    img.save(path, "PNG")
    print(f"  [OK] {filename}")


# ── 热门推荐：火焰图形 ──
def hot_shape(draw, cx, cy, size):
    scale = size / 64
    # 外焰（暗橙色）
    draw.polygon([
        (cx, cy - 18 * scale), (cx + 13 * scale, cy + 5 * scale),
        (cx + 9 * scale, cy + 3 * scale), (cx + 14 * scale, cy + 14 * scale),
        (cx + 7 * scale, cy + 18 * scale), (cx, cy + 22 * scale),
        (cx - 7 * scale, cy + 18 * scale), (cx - 14 * scale, cy + 14 * scale),
        (cx - 9 * scale, cy + 3 * scale), (cx - 13 * scale, cy + 5 * scale),
    ], fill=(255, 87, 34, 255))
    # 内焰（亮橙黄）
    draw.polygon([
        (cx, cy - 9 * scale), (cx + 7 * scale, cy + 5 * scale),
        (cx, cy + 3 * scale), (cx - 7 * scale, cy + 5 * scale),
    ], fill=(255, 193, 7, 255))
    # 核心（白黄色）
    draw.polygon([
        (cx, cy - 2 * scale), (cx + 3 * scale, cy + 4 * scale),
        (cx, cy + 7 * scale), (cx - 3 * scale, cy + 4 * scale),
    ], fill=(255, 245, 157, 255))


# ── 最新更新：星形图形 ──
def new_shape(draw, cx, cy, size):
    scale = size / 64
    outer_r = 17 * scale
    inner_r = 7 * scale
    # 五角星
    pts = []
    for i in range(10):
        angle = math.pi * 2 * i / 10 - math.pi / 2
        r = outer_r if i % 2 == 0 else inner_r
        pts.append((cx + r * math.cos(angle), cy + r * math.sin(angle)))
    draw.polygon(pts, fill=(38, 198, 218, 255))
    # 中心高光
    draw.ellipse([cx - 3 * scale, cy - 3 * scale, cx + 3 * scale, cy + 3 * scale],
                 fill=(255, 255, 255, 220))


# 生成
make_icon("section-hot.png", (255, 245, 240, 255), hot_shape)
make_icon("section-new.png", (232, 251, 251, 255), new_shape)
print("\nDone!")
