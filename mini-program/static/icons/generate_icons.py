# -*- coding: utf-8 -*-
"""生成小程序所有图标（统一风格：圆形背景 + 矢量图形）"""
import os, sys, math
sys.stdout.reconfigure(encoding='utf-8')

from PIL import Image, ImageDraw

OUT = os.path.dirname(os.path.abspath(__file__))
SIZE = 64   # 基础尺寸

os.makedirs(OUT, exist_ok=True)


def icon(name, bg_rgba, draw_fn, size=SIZE):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    cx, cy = size // 2, size // 2
    r = size // 2 - 2
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=bg_rgba)
    draw_fn(d, cx, cy, size)
    img.save(os.path.join(OUT, name), "PNG")
    print(f"  [OK] {name}")


# ── 搜索 🔍 ──────────────────────────────────────
def draw_search(d, cx, cy, s):
    sc = s / 64
    # 放大镜圆圈
    d.ellipse([cx - 16*sc, cy - 16*sc, cx + 16*sc, cy + 16*sc],
              outline=(255, 255, 255, 255), width=int(3*sc))
    # 放大镜手柄
    d.line([cx + 11*sc, cy + 11*sc, cx + 20*sc, cy + 20*sc],
           fill=(255, 255, 255, 255), width=int(3*sc))

icon("icon-search.png",  (255, 95, 47, 255), draw_search)   # 橙红


# ── 浏览/眼睛 👁 ──────────────────────────────────
def draw_eye(d, cx, cy, s):
    sc = s / 64
    # 眼眶（椭圆）
    d.ellipse([cx - 20*sc, cy - 10*sc, cx + 20*sc, cy + 10*sc],
              outline=(255, 255, 255, 255), width=int(3*sc))
    # 眼球
    d.ellipse([cx - 8*sc, cy - 7*sc, cx + 8*sc, cy + 7*sc],
              fill=(255, 255, 255, 255))
    # 高光点
    d.ellipse([cx - 3*sc, cy - 4*sc, cx + 3*sc, cy + 1*sc],
              fill=(50, 50, 50, 255))

icon("icon-eye.png",     (52, 152, 219, 255), draw_eye)    # 蓝色


# ── 点赞/心 ❤️ ───────────────────────────────────
def draw_heart(d, cx, cy, s):
    sc = s / 64
    w, h = 28*sc, 26*sc
    pts = [
        (cx, cy + h/2),                                # 下尖
        (cx - w/2, cy - h*0.1),
        (cx - w/2, cy - h*0.6),
        (cx, cy - h*0.85),                             # 上尖
        (cx + w/2, cy - h*0.6),
        (cx + w/2, cy - h*0.1),
    ]
    d.polygon(pts, fill=(255, 255, 255, 255))
    # 高光
    d.ellipse([cx - 8*sc, cy - h*0.5, cx - 2*sc, cy - h*0.3],
              fill=(255, 200, 200, 200))

icon("icon-heart.png",   (244, 67, 54, 255), draw_heart)  # 红色


# ── 收藏/星 ⭐ ───────────────────────────────────
def draw_star(d, cx, cy, s):
    sc = s / 64
    outer, inner = 20*sc, 9*sc
    pts = []
    for i in range(10):
        angle = math.pi * 2 * i / 10 - math.pi / 2
        r = outer if i % 2 == 0 else inner
        pts.append((cx + r * math.cos(angle), cy + r * math.sin(angle)))
    d.polygon(pts, fill=(255, 255, 255, 255))
    # 高光点
    d.ellipse([cx - 4*sc, cy - 10*sc, cx + 4*sc, cy - 4*sc],
              fill=(255, 248, 100, 200))

icon("icon-star.png",    (255, 193, 7, 255), draw_star)   # 橙黄


# ── 书籍 📚 ──────────────────────────────────────
def draw_book(d, cx, cy, s):
    sc = s / 64
    # 书本轮廓
    d.rectangle([cx - 22*sc, cy - 14*sc, cx + 22*sc, cy + 14*sc],
                fill=(255, 255, 255, 255))
    # 书脊
    d.line([cx - 22*sc, cy, cx + 22*sc, cy], fill=(200, 200, 200, 255), width=int(2*sc))
    # 书页横线（左）
    for i in range(3):
        y = cy - 9*sc + i * 6*sc
        d.line([cx - 19*sc, y, cx - 3*sc, y], fill=(180, 180, 180, 255), width=int(1.5*sc))
    # 书页横线（右）
    for i in range(3):
        y = cy - 9*sc + i * 6*sc
        d.line([cx + 3*sc, y, cx + 19*sc, y], fill=(180, 180, 180, 255), width=int(1.5*sc))

icon("icon-book.png",    (156, 39, 176, 255), draw_book)  # 紫色


# ── 电脑 🖥️ ─────────────────────────────────────
def draw_monitor(d, cx, cy, s):
    sc = s / 64
    # 屏幕
    d.rectangle([cx - 22*sc, cy - 18*sc, cx + 22*sc, cy + 8*sc],
                fill=(255, 255, 255, 255), outline=(255, 255, 255, 255), width=int(2*sc))
    # 屏幕内屏
    d.rectangle([cx - 18*sc, cy - 14*sc, cx + 18*sc, cy + 4*sc],
                fill=(66, 133, 244, 200))
    # 屏幕内容（横线）
    d.line([cx - 14*sc, cy - 6*sc, cx + 14*sc, cy - 6*sc], fill=(255,255,255,200), width=int(2*sc))
    d.line([cx - 14*sc, cy,      cx + 14*sc, cy],          fill=(255,255,255,200), width=int(2*sc))
    d.line([cx - 14*sc, cy + 6*sc, cx + 4*sc, cy + 6*sc],  fill=(255,255,255,200), width=int(2*sc))
    # 底座
    d.rectangle([cx - 10*sc, cy + 8*sc, cx + 10*sc, cy + 14*sc],
                fill=(255, 255, 255, 255))
    d.rectangle([cx - 16*sc, cy + 14*sc, cx + 16*sc, cy + 18*sc],
                fill=(255, 255, 255, 255))

icon("icon-monitor.png", (76, 175, 80, 255), draw_monitor) # 绿色


# ── 毕业帽 🎓 ────────────────────────────────────
def draw_cap(d, cx, cy, s):
    sc = s / 64
    # 帽顶（梯形）
    d.polygon([
        (cx - 22*sc, cy + 4*sc),
        (cx + 22*sc, cy + 4*sc),
        (cx + 16*sc, cy - 14*sc),
        (cx - 16*sc, cy - 14*sc),
    ], fill=(255, 255, 255, 255))
    # 帽檐（横条）
    d.rectangle([cx - 22*sc, cy + 4*sc, cx + 22*sc, cy + 10*sc],
                fill=(255, 255, 255, 255))
    # 帽穗垂坠
    d.line([cx + 10*sc, cy + 10*sc, cx + 14*sc, cy + 20*sc],
           fill=(255, 215, 0, 255), width=int(3*sc))
    d.ellipse([cx + 13*sc - 3*sc, cy + 20*sc - 3*sc,
               cx + 13*sc + 3*sc, cy + 20*sc + 3*sc],
              fill=(255, 215, 0, 255))
    # 帽顶中心圆扣
    d.ellipse([cx - 4*sc, cy - 8*sc, cx + 4*sc, cy],
              fill=(255, 215, 0, 200))

icon("icon-cap.png",     (103, 58, 183, 255), draw_cap)    # 深紫


# ── 灯泡 💡 ──────────────────────────────────────
def draw_bulb(d, cx, cy, s):
    sc = s / 64
    # 灯泡上半圆
    d.ellipse([cx - 16*sc, cy - 18*sc, cx + 16*sc, cy + 4*sc],
              fill=(255, 255, 255, 255))
    # 灯泡下半梯形
    d.polygon([
        (cx - 12*sc, cy + 4*sc),
        (cx + 12*sc, cy + 4*sc),
        (cx + 8*sc, cy + 14*sc),
        (cx - 8*sc, cy + 14*sc),
    ], fill=(255, 255, 255, 255))
    # 底座螺纹
    d.rectangle([cx - 10*sc, cy + 14*sc, cx + 10*sc, cy + 18*sc],
                fill=(255, 255, 255, 255))
    d.line([cx - 10*sc, cy + 16*sc, cx + 10*sc, cy + 16*sc],
           fill=(200, 200, 200, 255), width=int(1.5*sc))
    # 光线
    for angle in range(-60, 61, 30):
        rad = math.radians(angle)
        x1 = cx + 20*sc * math.cos(rad)
        y1 = cy - 20*sc * math.sin(rad) - 4*sc
        x2 = cx + 26*sc * math.cos(rad)
        y2 = cy - 26*sc * math.sin(rad) - 4*sc
        d.line([x1, y1, x2, y2], fill=(255, 255, 255, 200), width=int(2*sc))

icon("icon-bulb.png",    (255, 193, 7, 255), draw_bulb)   # 橙黄


# ── 反馈/铅笔 📝 ─────────────────────────────────
def draw_pencil(d, cx, cy, s):
    sc = s / 64
    # 笔杆（倾斜矩形）
    d.polygon([
        (cx - 8*sc, cy - 20*sc),
        (cx + 4*sc, cy - 20*sc),
        (cx + 10*sc, cy + 4*sc),
        (cx + 6*sc, cy + 4*sc),
        (cx, cy - 16*sc),
        (cx - 2*sc, cy - 16*sc),
    ], fill=(255, 255, 255, 255))
    # 笔尖
    d.polygon([
        (cx - 2*sc, cy - 16*sc),
        (cx + 6*sc, cy + 4*sc),
        (cx + 2*sc, cy + 16*sc),
        (cx - 6*sc, cy + 16*sc),
        (cx - 10*sc, cy + 4*sc),
    ], fill=(255, 255, 255, 255))
    # 橡皮
    d.rectangle([cx - 6*sc, cy - 20*sc, cx + 4*sc, cy - 15*sc],
                fill=(200, 200, 200, 255))

icon("icon-pencil.png",  (76, 175, 80, 255), draw_pencil)  # 绿色


# ── 日志/时钟 🕐 ─────────────────────────────────
def draw_clock(d, cx, cy, s):
    sc = s / 64
    r = 20*sc
    # 外圈
    d.ellipse([cx - r, cy - r, cx + r, cy + r],
              outline=(255, 255, 255, 255), width=int(3*sc))
    # 时针
    d.line([cx, cy, cx + 10*sc, cy - 8*sc], fill=(255, 255, 255, 255), width=int(3*sc))
    # 分针
    d.line([cx, cy, cx - 2*sc, cy - 14*sc], fill=(255, 255, 255, 255), width=int(2.5*sc))
    # 中心点
    d.ellipse([cx - 3*sc, cy - 3*sc, cx + 3*sc, cy + 3*sc],
              fill=(255, 255, 255, 255))

icon("icon-clock.png",   (244, 67, 54, 255), draw_clock)  # 红色


# ── 关于/信息 ℹ️ ─────────────────────────────────
def draw_info(d, cx, cy, s):
    sc = s / 64
    r = 20*sc
    d.ellipse([cx - r, cy - r, cx + r, cy + r],
              outline=(255, 255, 255, 255), width=int(3*sc))
    # i 字母
    d.rectangle([cx - 3*sc, cy - 14*sc, cx + 3*sc, cy - 6*sc],
                fill=(255, 255, 255, 255))
    d.ellipse([cx - 3*sc, cy + 4*sc, cx + 3*sc, cy + 10*sc],
              fill=(255, 255, 255, 255))

icon("icon-info.png",    (33, 150, 243, 255), draw_info)  # 蓝色


# ── 主题/调色板 🎨 ───────────────────────────────
def draw_palette(d, cx, cy, s):
    sc = s / 64
    r = 20*sc
    d.ellipse([cx - r, cy - r, cx + r, cy + r],
              fill=(255, 255, 255, 255))
    # 调色盘上的颜色圆点
    for dx, dy, col in [
        (0,      -10*sc, (244, 67, 54, 255)),   # 红
        (-9*sc,  4*sc,  (255, 193, 7, 255)),   # 黄
        (9*sc,   4*sc,  (33, 150, 243, 255)),   # 蓝
        (0,      12*sc, (76, 175, 80, 255)),    # 绿
    ]:
        d.ellipse([cx + dx - 5*sc, cy + dy - 5*sc,
                   cx + dx + 5*sc, cy + dy + 5*sc], fill=col)
    # 中心灰色调色棒
    d.rectangle([cx - 3*sc, cy - 3*sc, cx + 3*sc, cy + 3*sc],
                fill=(180, 180, 180, 255))

icon("icon-palette.png", (156, 39, 176, 255), draw_palette) # 紫色


# ── 火焰（主题预览 🔥）────────────────────────────
def draw_fire(d, cx, cy, s):
    sc = s / 64
    d.polygon([
        (cx, cy - 20*sc), (cx + 14*sc, cy + 5*sc),
        (cx + 10*sc, cy + 3*sc), (cx + 16*sc, cy + 16*sc),
        (cx + 8*sc, cy + 20*sc), (cx, cy + 24*sc),
        (cx - 8*sc, cy + 20*sc), (cx - 16*sc, cy + 16*sc),
        (cx - 10*sc, cy + 3*sc), (cx - 14*sc, cy + 5*sc),
    ], fill=(255, 255, 255, 255))
    # 内焰
    d.polygon([
        (cx, cy - 9*sc), (cx + 7*sc, cy + 5*sc),
        (cx, cy + 3*sc), (cx - 7*sc, cy + 5*sc),
    ], fill=(255, 193, 7, 200))

icon("icon-fire.png",   (255, 95, 47, 255), draw_fire)   # 橙红


print("\nAll icons generated!")
