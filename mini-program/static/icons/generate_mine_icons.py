# -*- coding: utf-8 -*-
"""
生成"我的"模块菜单图标（统一线性风格）
意见反馈、更新日志、关于我们、切换主题
"""
from PIL import Image, ImageDraw
import os

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))
SIZE = 96       # 分辨率
COLOR = (64, 64, 64, 255)  # 深灰色 #404040
LW = 5           # 线宽

def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def draw_feedback(draw, color, size, lw):
    """意见反馈 - 铅笔+纸"""
    s = size
    # 纸（矩形）
    x1, y1 = s*0.20, s*0.20
    x2, y2 = s*0.72, s*0.80
    draw.rectangle([x1, y1, x2, y2], outline=color, width=lw)
    # 横线
    for i in range(4):
        y = y1 + s*0.12 + i * s*0.12
        draw.line([(x1+s*0.08, y), (x2-s*0.08, y)], fill=color, width=max(2, lw-1))
    # 铅笔（45度斜放）
    px, py = s*0.72, s*0.80  # 铅笔尖位置（纸右下角）
    pen_len = s*0.35
    # 笔身为斜线
    draw.line([(px, py), (px+pen_len*0.7, py-pen_len*0.7)], fill=color, width=lw)
    # 笔尖
    draw.line([(px, py), (px-pen_len*0.12, py+pen_len*0.08)], fill=color, width=lw)
    draw.line([(px, py), (px+pen_len*0.08, py-pen_len*0.12)], fill=color, width=lw)
    # 笔帽
    cap_x = px + pen_len*0.68
    cap_y = py - pen_len*0.68
    draw.line([(cap_x-s*0.06, cap_y-s*0.06), (cap_x+s*0.06, cap_y+s*0.06)], fill=color, width=lw)

def draw_changelog(draw, color, size, lw):
    """更新日志 - 时钟+分支线"""
    s = size
    cx, cy = s*0.50, s*0.48
    r = s*0.33
    # 圆圈
    draw.ellipse([cx-r, cy-r, cx+r, cy+r], outline=color, width=lw)
    # 圆心
    draw.ellipse([cx-s*0.04, cy-s*0.04, cx+s*0.04, cy+s*0.04], fill=color)
    # 时针（指向左）
    draw.line([(cx, cy), (cx-r*0.5, cy)], fill=color, width=lw)
    # 分针（指向下）
    draw.line([(cx, cy), (cx, cy+r*0.7)], fill=color, width=lw)
    # 分支线（右上角，表示版本分支）
    bx, by = cx+r*0.72, cy-r*0.72
    draw.line([(bx-s*0.08, by+s*0.08), (bx+s*0.10, by-s*0.10)], fill=color, width=lw)
    draw.ellipse([bx-s*0.08, by-s*0.12, bx+s*0.04, by], outline=color, width=lw-1)

def draw_about(draw, color, size, lw):
    """关于我们 - 信息圆圈+i"""
    s = size
    cx, cy = s*0.50, s*0.50
    r = s*0.33
    # 圆圈
    draw.ellipse([cx-r, cy-r, cx+r, cy+r], outline=color, width=lw)
    # i 字母
    # 竖线
    draw.line([(cx, cy-r*0.45), (cx, cy+r*0.25)], fill=color, width=lw)
    # 圆点
    draw.ellipse([cx-s*0.06, cy+r*0.40, cx+s*0.06, cy+r*0.52], fill=color)

def draw_theme(draw, color, size, lw):
    """切换主题 - 调色板"""
    s = size
    cx, cy = s*0.50, s*0.50
    r = s*0.34
    # 外圆
    draw.ellipse([cx-r, cy-r, cx+r, cy+r], outline=color, width=lw)
    # 中心灰点（转轴）
    draw.ellipse([cx-s*0.08, cy-s*0.08, cx+s*0.08, cy+s*0.08], fill=color)
    # 顶部小圆（调色笔位置）
    draw.ellipse([cx-s*0.10, cy-r-s*0.04, cx+s*0.10, cy-r+s*0.04], fill=color)
    # 调色笔杆
    draw.line([(cx, cy-r+s*0.06), (cx+s*0.18, cy-r-s*0.20)], fill=color, width=lw-1)
    # 六个颜色区段弧（简化为6个小圆）
    angles = [0, 60, 120, 180, 240, 300]
    small_r = s*0.09
    color_dots = [
        (255, 80, 80, 255),   # 红
        (255, 160, 50, 255),  # 橙
        (80, 200, 80, 255),   # 绿
        (80, 160, 255, 255),  # 蓝
        (160, 80, 255, 255),  # 紫
        (255, 120, 180, 255), # 粉
    ]
    import math
    for angle, dot_color in zip(angles, color_dots):
        rad = math.radians(angle)
        dx = cx + r*0.58 * math.cos(rad)
        dy = cy + r*0.58 * math.sin(rad)
        draw.ellipse([dx-small_r, dy-small_r, dx+small_r, dy+small_r], fill=dot_color)


def generate_all():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    icons = [
        ('icon-feedback', draw_feedback),
        ('icon-changelog', draw_changelog),
        ('icon-about', draw_about),
        ('icon-theme', draw_theme),
    ]

    for icon_name, draw_fn in icons:
        img = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
        d = ImageDraw.Draw(img)
        draw_fn(d, COLOR, SIZE, LW)
        out_path = os.path.join(OUTPUT_DIR, f'{icon_name}.png')
        img.save(out_path, 'PNG')
        print(f"Generated: {icon_name}.png")

    print("Done!")

if __name__ == '__main__':
    generate_all()
