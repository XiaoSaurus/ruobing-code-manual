# -*- coding: utf-8 -*-
"""
生成多主题 TabBar 图标 v2
重新设计：网页设计、毕业设计、我的
"""
from PIL import Image, ImageDraw
import os

# 主题配置
THEMES = {
    'blue':   {'color': '#66B1FF', 'name': '科技蓝'},
    'purple': {'color': '#B388FF', 'name': '优雅紫'},
    'green':  {'color': '#85CE61', 'name': '清新绿'},
    'orange': {'color': '#F0C78A', 'name': '活力橙'},
    'red':    {'color': '#F78989', 'name': '中国红'},
    'pink':   {'color': '#F4B8C5', 'name': '少女粉'},
    'dark':   {'color': '#67C23A', 'name': '极客黑'},
}

# 尺寸
SIZE = 81
LINE_WIDTH = 4

def hex_to_rgb(hex_color):
    """十六进制转 RGB"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def draw_home(draw, color, size):
    """首页图标 - 简洁房子"""
    s = size
    lw = LINE_WIDTH
    # 房顶三角形轮廓
    draw.polygon([(s*0.5, s*0.18), (s*0.15, s*0.48), (s*0.85, s*0.48)], outline=color, width=lw)
    # 房身矩形轮廓
    draw.rectangle([s*0.22, s*0.48, s*0.78, s*0.82], outline=color, width=lw)
    # 门
    draw.rectangle([s*0.40, s*0.58, s*0.60, s*0.82], outline=color, width=lw)

def draw_code(draw, color, size):
    """网页设计图标 - 代码窗口"""
    s = size
    lw = LINE_WIDTH
    # 窗口框架
    draw.rectangle([s*0.12, s*0.15, s*0.88, s*0.85], outline=color, width=lw)
    # 顶栏分割线
    draw.line([(s*0.12, s*0.30), (s*0.88, s*0.30)], fill=color, width=lw)
    # 三个小点（窗口按钮）
    for i, x in enumerate([s*0.22, s*0.32, s*0.42]):
        draw.ellipse([x-s*0.03, s*0.20, x+s*0.03, s*0.26], fill=color)
    # 代码符号 < />
    # <
    draw.line([(s*0.25, s*0.52), (s*0.38, s*0.42)], fill=color, width=lw)
    draw.line([(s*0.25, s*0.52), (s*0.38, s*0.62)], fill=color, width=lw)
    # /
    draw.line([(s*0.45, s*0.38), (s*0.55, s*0.66)], fill=color, width=lw)
    # >
    draw.line([(s*0.62, s*0.42), (s*0.75, s*0.52)], fill=color, width=lw)
    draw.line([(s*0.62, s*0.62), (s*0.75, s*0.52)], fill=color, width=lw)

def draw_school(draw, color, size):
    """毕业设计图标 - 书本"""
    s = size
    lw = LINE_WIDTH
    # 左边书页
    draw.polygon([(s*0.5, s*0.18), (s*0.12, s*0.28), (s*0.12, s*0.78), (s*0.5, s*0.68)], outline=color, width=lw)
    # 右边书页
    draw.polygon([(s*0.5, s*0.18), (s*0.88, s*0.28), (s*0.88, s*0.78), (s*0.5, s*0.68)], outline=color, width=lw)
    # 中线
    draw.line([(s*0.5, s*0.18), (s*0.5, s*0.68)], fill=color, width=lw)
    # 左页线条
    draw.line([(s*0.22, s*0.38), (s*0.42, s*0.33)], fill=color, width=lw-1)
    draw.line([(s*0.22, s*0.50), (s*0.42, s*0.45)], fill=color, width=lw-1)
    draw.line([(s*0.22, s*0.62), (s*0.42, s*0.57)], fill=color, width=lw-1)
    # 右页线条
    draw.line([(s*0.58, s*0.33), (s*0.78, s*0.38)], fill=color, width=lw-1)
    draw.line([(s*0.58, s*0.45), (s*0.78, s*0.50)], fill=color, width=lw-1)
    draw.line([(s*0.58, s*0.57), (s*0.78, s*0.62)], fill=color, width=lw-1)

def draw_mine(draw, color, size):
    """我的图标 - 用户头像"""
    s = size
    lw = LINE_WIDTH
    # 头部圆圈
    draw.ellipse([s*0.32, s*0.15, s*0.68, s*0.51], outline=color, width=lw)
    # 身体圆弧
    draw.arc([s*0.10, s*0.45, s*0.90, s*1.05], start=200, end=340, fill=color, width=lw)

def draw_home_filled(draw, color, size):
    """首页图标 - 填充版"""
    s = size
    color_rgba = color + (255,)
    # 房顶填充
    draw.polygon([(s*0.5, s*0.15), (s*0.15, s*0.48), (s*0.85, s*0.48)], fill=color_rgba)
    # 房身填充
    draw.rectangle([s*0.22, s*0.48, s*0.78, s*0.85], fill=color_rgba)
    # 门（白色）
    draw.rectangle([s*0.38, s*0.58, s*0.62, s*0.85], fill=(255, 255, 255, 255))

def draw_code_filled(draw, color, size):
    """网页设计图标 - 填充版"""
    s = size
    color_rgba = color + (255,)
    lw = 3
    # 窗口框架填充
    draw.rectangle([s*0.12, s*0.15, s*0.88, s*0.85], fill=color_rgba)
    # 顶栏白色
    draw.rectangle([s*0.14, s*0.17, s*0.86, s*0.28], fill=(255, 255, 255, 255))
    # 三个小点
    for i, x in enumerate([s*0.22, s*0.32, s*0.42]):
        draw.ellipse([x-s*0.03, s*0.195, x+s*0.03, s*0.255], fill=color_rgba)
    # 代码符号
    draw.line([(s*0.25, s*0.52), (s*0.38, s*0.42)], fill=(255,255,255,255), width=lw)
    draw.line([(s*0.25, s*0.52), (s*0.38, s*0.62)], fill=(255,255,255,255), width=lw)
    draw.line([(s*0.45, s*0.38), (s*0.55, s*0.66)], fill=(255,255,255,255), width=lw)
    draw.line([(s*0.62, s*0.42), (s*0.75, s*0.52)], fill=(255,255,255,255), width=lw)
    draw.line([(s*0.62, s*0.62), (s*0.75, s*0.52)], fill=(255,255,255,255), width=lw)

def draw_school_filled(draw, color, size):
    """毕业设计图标 - 填充版"""
    s = size
    color_rgba = color + (255,)
    # 左边书页
    draw.polygon([(s*0.5, s*0.18), (s*0.12, s*0.28), (s*0.12, s*0.78), (s*0.5, s*0.68)], fill=color_rgba)
    # 右边书页
    draw.polygon([(s*0.5, s*0.18), (s*0.88, s*0.28), (s*0.88, s*0.78), (s*0.5, s*0.68)], fill=color_rgba)

def draw_mine_filled(draw, color, size):
    """我的图标 - 填充版"""
    s = size
    color_rgba = color + (255,)
    # 头部填充
    draw.ellipse([s*0.32, s*0.15, s*0.68, s*0.51], fill=color_rgba)
    # 身体填充
    draw.pieslice([s*0.10, s*0.45, s*0.90, s*1.05], start=200, end=340, fill=color_rgba)

def generate_icons():
    """生成所有图标"""
    output_dir = os.path.dirname(os.path.abspath(__file__))
    
    icons = [
        ('home', draw_home, draw_home_filled),
        ('code', draw_code, draw_code_filled),
        ('school', draw_school, draw_school_filled),
        ('mine', draw_mine, draw_mine_filled),
    ]
    
    # 生成灰色未选中图标
    gray = (153, 153, 153, 255)  # #999999
    for icon_name, draw_outline, draw_filled in icons:
        # 未选中 - 灰色轮廓
        img = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
        d = ImageDraw.Draw(img)
        draw_outline(d, gray[:3], SIZE)
        img.save(os.path.join(output_dir, f'{icon_name}.png'), 'PNG')
        print(f"Generated: {icon_name}.png (gray outline)")
    
    # 生成各主题选中图标
    for theme_id, theme_config in THEMES.items():
        color_rgb = hex_to_rgb(theme_config['color'])
        
        for icon_name, draw_outline, draw_filled in icons:
            # 选中 - 主题色填充
            img = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
            d = ImageDraw.Draw(img)
            draw_filled(d, color_rgb, SIZE)
            
            filename = f"{icon_name}-{theme_id}.png"
            img.save(os.path.join(output_dir, filename), 'PNG')
            print(f"Generated: {filename}")
    
    print("\nAll icons generated!")

if __name__ == '__main__':
    generate_icons()
