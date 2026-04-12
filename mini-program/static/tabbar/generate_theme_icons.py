# -*- coding: utf-8 -*-
"""
生成多主题 TabBar 图标
每个主题生成一套选中状态的图标
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

# 图标类型
ICONS = ['home', 'code', 'school', 'mine']

# 尺寸
SIZE = 81

def hex_to_rgb(hex_color):
    """十六进制转 RGB"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def draw_home(draw, color, size):
    """首页图标 - 房子"""
    s = size
    # 房顶（三角形）
    points = [(s*0.5, s*0.15), (s*0.15, s*0.5), (s*0.85, s*0.5)]
    draw.polygon(points, fill=color)
    # 房身
    draw.rectangle([s*0.25, s*0.5, s*0.75, s*0.85], fill=color)
    # 门
    door_color = (255, 255, 255, 255)
    draw.rectangle([s*0.4, s*0.6, s*0.6, s*0.85], fill=door_color)

def draw_code(draw, color, size):
    """代码图标 - </>"""
    s = size
    # < 符号
    draw.polygon([(s*0.25, s*0.5), (s*0.4, s*0.3), (s*0.45, s*0.35), (s*0.33, s*0.5), (s*0.45, s*0.65), (s*0.4, s*0.7)], fill=color)
    # / 符号
    draw.rectangle([s*0.48, s*0.25, s*0.52, s*0.75], fill=color)
    # > 符号
    draw.polygon([(s*0.75, s*0.5), (s*0.6, s*0.3), (s*0.55, s*0.35), (s*0.67, s*0.5), (s*0.55, s*0.65), (s*0.6, s*0.7)], fill=color)

def draw_school(draw, color, size):
    """毕业设计图标 - 学士帽"""
    s = size
    # 帽顶
    points = [(s*0.5, s*0.2), (s*0.15, s*0.4), (s*0.5, s*0.55), (s*0.85, s*0.4)]
    draw.polygon(points, fill=color)
    # 帽身
    draw.rectangle([s*0.3, s*0.55, s*0.7, s*0.75], fill=color)
    # 流苏
    draw.line([(s*0.5, s*0.55), (s*0.5, s*0.85)], fill=color, width=3)
    draw.ellipse([s*0.45, s*0.82, s*0.55, s*0.92], fill=color)

def draw_mine(draw, color, size):
    """我的图标 - 人像"""
    s = size
    # 头部
    draw.ellipse([s*0.35, s*0.18, s*0.65, s*0.48], fill=color)
    # 身体
    draw.ellipse([s*0.15, s*0.55, s*0.85, s*1.0], fill=color)

def generate_icons():
    """生成所有主题图标"""
    output_dir = os.path.dirname(os.path.abspath(__file__))
    
    for theme_id, theme_config in THEMES.items():
        color = hex_to_rgb(theme_config['color'])
        color_with_alpha = color + (255,)  # RGBA
        
        for icon_name in ICONS:
            # 创建透明背景图片
            img = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
            draw = ImageDraw.Draw(img)
            
            # 绘制图标
            if icon_name == 'home':
                draw_home(draw, color_with_alpha, SIZE)
            elif icon_name == 'code':
                draw_code(draw, color_with_alpha, SIZE)
            elif icon_name == 'school':
                draw_school(draw, color_with_alpha, SIZE)
            elif icon_name == 'mine':
                draw_mine(draw, color_with_alpha, SIZE)
            
            # 保存
            filename = f"{icon_name}-{theme_id}.png"
            filepath = os.path.join(output_dir, filename)
            img.save(filepath, 'PNG')
            print(f"Generated: {filename}")
    
    print("\nAll icons generated successfully!")

if __name__ == '__main__':
    generate_icons()
