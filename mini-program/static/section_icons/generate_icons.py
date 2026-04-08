# -*- coding: utf-8 -*-
"""生成 section 头部图标（火焰=热门，新=最新）"""
import os
import sys
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

# 尝试导入 Pillow
try:
    from PIL import Image, ImageDraw, ImageFont
    HAS_PILLOW = True
except ImportError:
    HAS_PILLOW = False
    print("Pillow 未安装，尝试安装...")
    import subprocess
    subprocess.run(["pip", "install", "Pillow", "-q"], check=True)
    from PIL import Image, ImageDraw, ImageFont

out_dir = os.path.dirname(os.path.abspath(__file__))
print(f"输出目录: {out_dir}")

def draw_icon(filename, icon_char, bg_color, fg_color, size=48):
    """绘制一个圆形背景+图标的 PNG"""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 圆形背景
    padding = 4
    draw.ellipse([padding, padding, size - padding, size - padding],
                 fill=bg_color)

    # 绘制图标字符（居中）
    try:
        # 尝试系统字体
        font_size = int(size * 0.55)
        font = ImageFont.truetype("msyh.ttc", font_size)
    except Exception:
        try:
            font = ImageFont.truetype("C:/Windows/Fonts/seguiemj.ttf", font_size)
        except Exception:
            font = ImageFont.load_default()

    # 计算文字居中
    bbox = draw.textbbox((0, 0), icon_char, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    x = (size - text_w) // 2 - bbox[0]
    y = (size - text_h) // 2 - bbox[1]

    draw.text((x, y), icon_char, font=font, fill=fg_color)

    img.save(os.path.join(out_dir, filename), "PNG")
    print(f"  [OK] {filename}")


def draw_svg_icon(filename, icon_svg, size=48):
    """生成 SVG 格式图标（备用）"""
    svg_path = os.path.join(out_dir, filename.replace(".png", ".svg"))
    with open(svg_path, "w", encoding="utf-8") as f:
        f.write(icon_svg)
    print(f"  [OK] {filename.replace('.png','.svg')}")


# ── 火焰图标：热门推荐 ──
draw_icon(
    "section-hot.png",
    icon_char="🔥",
    bg_color=(255, 95, 47, 220),   # 橙红色
    fg_color=(255, 255, 255, 255)
)

# ── 新图标：最新更新 ──
draw_icon(
    "section-new.png",
    icon_char="N",
    bg_color=(78, 205, 196, 220),  # 青绿色
    fg_color=(255, 255, 255, 255)
)

# SVG 版本（备用）
hot_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="28" fill="#ff5f2f"/>
  <text x="32" y="42" font-size="32" text-anchor="middle" fill="white">🔥</text>
</svg>'''

new_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="28" fill="#4ecdc4"/>
  <text x="32" y="44" font-size="36" font-weight="bold" font-family="Arial" text-anchor="middle" fill="white">NEW</text>
</svg>'''

draw_svg_icon("section-hot.svg", hot_svg)
draw_svg_icon("section-new.svg", new_svg)

print("\n完成！")
