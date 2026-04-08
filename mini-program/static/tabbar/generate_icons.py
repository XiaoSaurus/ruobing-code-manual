#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""生成小程序图标"""
from PIL import Image, ImageDraw, ImageFont
import os, sys

sys.stdout.reconfigure(encoding='utf-8')
d = r'D:\AppData\QClaw\QClawData\workspace\ruobing-code-manual\mini-program\static\tabbar'
os.makedirs(d, exist_ok=True)

def hex2rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def make_section_icon(fn, text, bg_hex, text_color='#FFFFFF'):
    sz = 64
    img = Image.new('RGBA', (sz, sz), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype('C:/Windows/Fonts/msyh.ttc', 36)
    except:
        font = ImageFont.load_default()
    draw.rounded_rectangle([(0, 0), (sz-1, sz-1)], radius=14, fill=hex2rgb(bg_hex))
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2]-bbox[0], bbox[3]-bbox[1]
    draw.text(((sz-tw)//2, (sz-th)//2 - 2), text, fill=hex2rgb(text_color), font=font)
    img.save(fn, 'PNG')

# Section 小图标
make_section_icon(os.path.join(d, 'icon-hot.png'), '热', '#ff6b6b')
make_section_icon(os.path.join(d, 'icon-new.png'), '新', '#ffd700', '#444444')
print('Section icons OK')

# ============ TabBar 图标 ============
def make_tabbar(fn, shape, color_hex, active=False):
    sz = 81
    img = Image.new('RGBA', (sz, sz), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    c = hex2rgb(color_hex)
    ic = (255, 255, 255) if active else c

    if shape == 'home':
        # 房子：屋顶三角形 + 墙体矩形 + 门
        draw.polygon([(10, 34), (40, 12), (71, 34)], fill=c)      # 屋顶
        draw.rectangle([18, 34, 63, 66], fill=c)                  # 墙体
        draw.rectangle([34, 48, 47, 66], fill=ic)                  # 门

    elif shape == 'code':
        # 代码括号 < / >
        try:
            f40 = ImageFont.truetype('C:/Windows/Fonts/consola.ttf', 42)
            f28 = ImageFont.truetype('C:/Windows/Fonts/consola.ttf', 30)
        except:
            f40 = f28 = ImageFont.load_default()
        draw.text((8, 16), '<', fill=c, font=f40)
        draw.text((46, 24), '/', fill=c, font=f28)
        draw.text((60, 16), '>', fill=c, font=f40)

    elif shape == 'school':
        # 学士帽：帽顶+帽尖+帽身+流苏
        draw.rectangle([15, 34, 66, 42], fill=c)                   # 帽顶
        draw.polygon([(10, 34), (40, 18), (71, 34)], fill=c)     # 帽尖
        draw.rectangle([28, 42, 53, 58], fill=c)                  # 帽身
        draw.polygon([(40, 58), (52, 74), (28, 74)], fill=c)     # 流苏

    elif shape == 'mine':
        # 头像：外圆 + 内圆（脸部）
        draw.ellipse([14, 14, 67, 67], fill=c)                    # 头部
        draw.ellipse([24, 20, 57, 53], fill=ic)                  # 脸部
        draw.ellipse([30, 60, 51, 74], fill=c)                   # 身体

    img.save(fn, 'PNG')

COLOR = '#409EFF'

# 普通状态
make_tabbar(os.path.join(d, 'home.png'),        'home',   COLOR)
make_tabbar(os.path.join(d, 'code.png'),        'code',   COLOR)
make_tabbar(os.path.join(d, 'school.png'),      'school', COLOR)
make_tabbar(os.path.join(d, 'mine.png'),        'mine',   COLOR)

# 选中状态
make_tabbar(os.path.join(d, 'home-active.png'),   'home',   COLOR, active=True)
make_tabbar(os.path.join(d, 'code-active.png'),   'code',   COLOR, active=True)
make_tabbar(os.path.join(d, 'school-active.png'), 'school', COLOR, active=True)
make_tabbar(os.path.join(d, 'mine-active.png'),   'mine',   COLOR, active=True)

print('TabBar icons OK')

# 验证尺寸
for fn in os.listdir(d):
    if fn.endswith('.png'):
        img = Image.open(os.path.join(d, fn))
        print(f'  {fn}: {img.size}')
