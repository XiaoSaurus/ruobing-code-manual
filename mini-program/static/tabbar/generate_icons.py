"""
生成微信小程序 TabBar 图标
尺寸: 81x81px, PNG 格式, 透明背景
"""
from PIL import Image, ImageDraw, ImageFont
import os

SIZE = 81
OUT_DIR = r"D:\AppData\QClaw\QClawData\workspace\ruobing-code-manual\mini-program\static\tabbar"

# Element Plus 风格配色
COLOR_NORMAL = (153, 153, 153)      # #999999 灰色
COLOR_ACTIVE = (64, 158, 255)      # #409EFF 主题蓝
COLOR_LINE = 3                      # 线条粗细

def make(size=SIZE, color=COLOR_NORMAL, filled=False):
    """创建画布并绘制"""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    return img, draw

def circle(draw, cx, cy, r, fill):
    draw.ellipse([cx-r, cy-r, cx+r, cy+r], fill=fill)

def rect(draw, xy, fill, radius=0):
    x1, y1, x2, y2 = xy
    if radius:
        draw.rounded_rectangle([x1,y1,x2,y2], radius=radius, fill=fill)
    else:
        draw.rectangle([x1,y1,x2,y2], fill=fill)

# ── 1. 首页 home ──────────────────────────────────────────────────────────────
def draw_home(draw, color, filled):
    c = SIZE // 2
    # 屋顶三角形
    draw.polygon([(c, 12), (18, 34), (63, 34)], fill=color)
    # 墙面
    draw.rectangle([24, 34, 57, 58], fill=color)
    # 门
    draw.rectangle([36, 44, 45, 58], fill=(0,0,0,0) if not filled else color)

def draw_home_active(draw, color, filled):
    draw_home(draw, color, filled)

# ── 2. 网页设计 code ─────────────────────────────────────────────────────────
def draw_code(draw, color, filled):
    # 括号 < >
    # 左括号 <
    draw.line([(18, 30), (10, 40), (18, 50)], fill=color, width=COLOR_LINE)
    # 右括号 >
    draw.line([(63, 30), (71, 40), (63, 50)], fill=color, width=COLOR_LINE)
    # 斜杠 /
    draw.line([(54, 22), (27, 58)], fill=color, width=COLOR_LINE)
    # 左括号 >
    draw.line([(18, 58), (10, 48), (18, 38)], fill=color, width=COLOR_LINE)
    # 右括号 <
    draw.line([(63, 58), (71, 48), (63, 38)], fill=color, width=COLOR_LINE)

# ── 3. 毕业设计 school ──────────────────────────────────────────────────────
def draw_school(draw, color, filled):
    # 帽子（矩形顶）
    draw.rectangle([24, 18, 57, 28], fill=color)
    # 帽子中装饰
    draw.rectangle([38, 14, 43, 22], fill=color)
    # 帽檐
    draw.rectangle([18, 28, 63, 34], fill=color)
    # 头
    draw.ellipse([(30, 36), (51, 56)], fill=color)
    # 袍子（梯形用矩形近似）
    draw.rectangle([22, 56, 59, 70], fill=color)
    # 袍子底部
    draw.rectangle([18, 68, 63, 74], fill=color)

# ── 4. 我的 mine ────────────────────────────────────────────────────────────
def draw_mine(draw, color, filled):
    # 头
    draw.ellipse([(32, 16), (49, 34)], fill=color)
    # 身体
    draw.ellipse([(22, 40), (59, 64)], fill=color)
    # 小圆点缀（表示个人）
    if filled:
        draw.ellipse([(35, 22), (46, 28)], fill=(255,255,255,200))

# ── 生成并保存 ────────────────────────────────────────────────────────────────
def generate():
    os.makedirs(OUT_DIR, exist_ok=True)

    icons = [
        ("home",          draw_home,          draw_home_active),
        ("code",          draw_code,          draw_code),
        ("school",        draw_school,        draw_school),
        ("mine",          draw_mine,          draw_mine),
    ]

    for name, fn_normal, fn_active in icons:
        # 普通状态
        img_n, draw_n = make()
        fn_normal(draw_n, COLOR_NORMAL, False)
        img_n.save(os.path.join(OUT_DIR, f"{name}.png"))

        # 选中状态
        img_a, draw_a = make()
        fn_active(draw_a, COLOR_ACTIVE, True)
        img_a.save(os.path.join(OUT_DIR, f"{name}-active.png"))

        print(f"OK: {name}.png + {name}-active.png")

if __name__ == "__main__":
    generate()
