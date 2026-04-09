"""Generate 4 banner images for the mini-program homepage carousel."""
from PIL import Image, ImageDraw, ImageFont
import math

W, H = 750, 360
BANNERS = [
    {
        "gradient": [(102, 126, 234), (118, 75, 162)],
        "icon": "🎨",
        "title": "网页设计资源",
        "subtitle": "精选网页模板，灵感即开即用",
        "file": "banner-design.png",
    },
    {
        "gradient": [(67, 206, 162), (24, 90, 157)],
        "icon": "🎓",
        "title": "毕业设计专区",
        "subtitle": "完整项目源码，助力学业通关",
        "file": "banner-graduation.png",
    },
    {
        "gradient": [(238, 156, 167), (255, 221, 225)],
        "icon": "🎨",
        "title": "主题随心换",
        "subtitle": "多套配色方案，打造个性风格",
        "file": "banner-theme.png",
    },
    {
        "gradient": [(255, 154, 68), (255, 51, 102)],
        "icon": "⚡",
        "title": "每日持续更新",
        "subtitle": "新增资源不断，永不错过好内容",
        "file": "banner-update.png",
    },
]


def lerp_color(c1, c2, t):
    return tuple(int(a + (b - a) * t) for a, b in zip(c1, c2))


def draw_gradient(draw, w, h, c1, c2):
    for y in range(h):
        t = y / max(h - 1, 1)
        draw.line([(0, y), (w, y)], fill=lerp_color(c1, c2, t))


def draw_decorations(draw, w, h):
    """Add subtle geometric decorations."""
    # Circle top-right
    for r in range(120, 0, -1):
        alpha = int(25 * (1 - r / 120))
        draw.ellipse([w - 160 + r, -60 + r, w - 160 + 3 * r, -60 + 3 * r],
                     fill=(255, 255, 255, alpha))
    # Circle bottom-left
    for r in range(80, 0, -1):
        alpha = int(20 * (1 - r / 80))
        draw.ellipse([-40 + r, h - 100 + r, -40 + 3 * r, h - 100 + 3 * r],
                     fill=(255, 255, 255, alpha))
    # Dots
    for i in range(5):
        for j in range(3):
            x = w - 200 + j * 24
            y = h - 60 + i * 24
            draw.ellipse([x, y, x + 4, y + 4], fill=(255, 255, 255, 30))


def main():
    # Try to find a font that supports Chinese
    font_paths = [
        "C:/Windows/Fonts/msyh.ttc",
        "C:/Windows/Fonts/msyhbd.ttc",
        "C:/Windows/Fonts/simhei.ttf",
        "C:/Windows/Fonts/simsun.ttc",
    ]
    font_path = None
    for fp in font_paths:
        import os
        if os.path.exists(fp):
            font_path = fp
            break

    for b in BANNERS:
        img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)

        # Gradient background
        draw_gradient(draw, W, H, b["gradient"][0], b["gradient"][1])

        # Decorations
        draw_decorations(draw, W, H)

        # Icon (large emoji - draw as text)
        try:
            icon_font = ImageFont.truetype("C:/Windows/Fonts/seguiemj.ttf", 64) if os.path.exists("C:/Windows/Fonts/seguiemj.ttf") else None
        except:
            icon_font = None
        if icon_font:
            draw.text((60, 60), b["icon"], fill=(255, 255, 255, 230), font=icon_font)
        else:
            # Fallback: decorative circle
            draw.ellipse([60, 60, 140, 140], fill=(255, 255, 255, 40))

        # Title
        try:
            title_font = ImageFont.truetype(font_path, 52) if font_path else ImageFont.load_default()
            sub_font = ImageFont.truetype(font_path, 28) if font_path else ImageFont.load_default()
        except:
            title_font = ImageFont.load_default()
            sub_font = ImageFont.load_default()

        # Title with shadow
        draw.text((62, 142), b["title"], fill=(0, 0, 0, 40), font=title_font)
        draw.text((60, 140), b["title"], fill=(255, 255, 255, 245), font=title_font)

        # Subtitle
        draw.text((62, 222), b["subtitle"], fill=(0, 0, 0, 30), font=sub_font)
        draw.text((60, 220), b["subtitle"], fill=(255, 255, 255, 200), font=sub_font)

        # Right side decorative line
        draw.rounded_rectangle([W - 140, 40, W - 50, 44], radius=2, fill=(255, 255, 255, 60))
        draw.rounded_rectangle([W - 120, 56, W - 70, 60], radius=2, fill=(255, 255, 255, 40))

        # Save as PNG
        img = img.convert("RGB")
        img.save(b["file"], "PNG", quality=95)
        print(f"Created {b['file']}")


if __name__ == "__main__":
    main()
