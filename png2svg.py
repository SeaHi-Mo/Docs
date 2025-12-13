#!/usr/bin/env python3
from PIL import Image
import subprocess
import tempfile
import os
import numpy as np
import argparse

def png_to_svg_code(png_path, mode="basic", threshold=128, color_tolerance=30, min_area=50):
    """
    PNG 转 SVG 代码（Linux 专用，支持命令行传参）
    :param png_path: 输入 PNG 路径（命令行传入）
    :param mode: "basic"（黑白二值）或 "advanced"（多颜色）
    :param threshold: 二值化阈值（仅 basic 模式）
    :param color_tolerance: 颜色相似度（仅 advanced 模式）
    :param min_area: 忽略最小色块（仅 advanced 模式）
    :return: str - SVG 代码字符串
    """
    # 验证 PNG 文件存在且是合法文件
    if not os.path.exists(png_path):
        raise FileNotFoundError(f"错误：PNG 文件不存在 → {png_path}")
    if not png_path.lower().endswith((".png", ".PNG")):
        raise ValueError(f"错误：文件不是 PNG 格式 → {png_path}")
    
    # 检查系统 potrace 依赖
    try:
        subprocess.run(["potrace", "--version"], capture_output=True, check=True)
    except FileNotFoundError:
        raise RuntimeError("错误：未安装 potrace！请先执行：sudo apt-get install potrace")
    
    if mode == "basic":
        # 基础模式：黑白二值图转 SVG
        img = Image.open(png_path).convert("L")
        img_binary = img.point(lambda x: 255 if x > threshold else 0, mode="1")
        width, height = img_binary.size
        
        # 临时文件处理
        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as temp_png:
            img_binary.save(temp_png, format="PNG")
            temp_png_path = temp_png.name
        
        try:
            with tempfile.NamedTemporaryFile(suffix=".svg", delete=False) as temp_svg:
                temp_svg_path = temp_svg.name
            
            # 调用 potrace 命令
            cmd = [
                "potrace", temp_png_path,
                "-b", "svg", "-t", "2", "-o", temp_svg_path
            ]
            subprocess.run(cmd, check=True, capture_output=True)
            
            # 读取并优化 SVG 代码
            with open(temp_svg_path, "r", encoding="utf-8") as f:
                svg_code = f.read().strip().replace("\n", "").replace("  ", " ").replace("> <", "><")
            return svg_code
        
        finally:
            os.unlink(temp_png_path)
            os.unlink(temp_svg_path)
    
    elif mode == "advanced":
        # 进阶模式：多颜色 + 去背景
        img = Image.open(png_path).convert("RGBA")
        width, height = img.size
        img_np = np.array(img)
        
        # 提取非透明像素
        non_transparent = img_np[img_np[:, :, 3] > 0]
        if len(non_transparent) == 0:
            raise ValueError("错误：图片无有效非透明内容")
        
        # 颜色聚类函数
        def cluster_colors(pixels, tolerance):
            clusters = []
            for pixel in pixels:
                r, g, b = pixel[:3]
                matched = False
                for i, (cr, cg, cb, cnt) in enumerate(clusters):
                    if np.sqrt((r-cr)**2 + (g-cg)**2 + (b-cb)**2) < tolerance:
                        clusters[i] = ((cr*cnt + r)/(cnt+1), (cg*cnt + g)/(cnt+1), (cb*cnt + b)/(cnt+1), cnt+1)
                        matched = True
                        break
                if not matched:
                    clusters.append((r, g, b, 1))
            return [(int(cr), int(cg), int(cb)) for cr, cg, cb, _ in clusters]
        
        colors = cluster_colors(non_transparent, color_tolerance)
        print(f"提示：检测到 {len(colors)} 种主要颜色")
        
        svg_paths = []
        for color in colors:
            r, g, b = color
            # 生成颜色掩码
            mask = (
                (np.abs(img_np[:, :, 0] - r) < color_tolerance) &
                (np.abs(img_np[:, :, 1] - g) < color_tolerance) &
                (np.abs(img_np[:, :, 2] - b) < color_tolerance) &
                (img_np[:, :, 3] > 0)
            )
            
            if np.sum(mask) < min_area:
                continue
            
            # 临时文件处理
            mask_pil = Image.fromarray(~mask.astype(np.uint8)*255, mode="1")
            with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as temp_png:
                mask_pil.save(temp_png, format="PNG")
                temp_png_path = temp_png.name
            
            with tempfile.NamedTemporaryFile(suffix=".svg", delete=False) as temp_svg:
                temp_svg_path = temp_svg.name
            
            try:
                cmd = ["potrace", temp_png_path, "-b", "svg", "-t", "1", "-o", temp_svg_path]
                subprocess.run(cmd, check=True, capture_output=True)
                
                # 提取 path 标签的 d 属性
                with open(temp_svg_path, "r", encoding="utf-8") as f:
                    content = f.read()
                    if '<path d="' in content:
                        d_start = content.index('<path d="') + 9
                        d_end = content.index('"', d_start)
                        d_attr = content[d_start:d_end]
                        color_hex = f"#{r:02x}{g:02x}{b:02x}"
                        svg_paths.append(f'<path d="{d_attr}" fill="{color_hex}" stroke="none"/>')
            finally:
                os.unlink(temp_png_path)
                os.unlink(temp_svg_path)
        
        # 拼接完整 SVG 代码
        svg_code = (
            f'<svg width="{width}" height="{height}" xmlns="http://www.w3.org/2000/svg">'
            f'{"".join(svg_paths)}'
            f'</svg>'
        )
        return svg_code.strip()
    
    else:
        raise ValueError(f"错误：模式 {mode} 不支持！仅支持 'basic' 或 'advanced'")

# ------------------- 命令行参数解析 -------------------
def parse_args():
    parser = argparse.ArgumentParser(description="PNG 转 SVG 代码（支持命令行传参）")
    
    # 必选参数：PNG 文件路径
    parser.add_argument("png_path", help="输入 PNG 文件的路径（相对路径或绝对路径），例如：./input.png 或 /home/user/test.png")
    
    # 可选参数
    parser.add_argument("-m", "--mode", 
                        choices=["basic", "advanced"], 
                        default="basic", 
                        help="转换模式：basic（黑白二值图，默认）、advanced（多颜色+去背景）")
    
    parser.add_argument("-t", "--threshold", 
                        type=int, 
                        default=150, 
                        choices=range(0, 256), 
                        help="二值化阈值（仅 basic 模式有效，0-255，默认 150）")
    
    parser.add_argument("-c", "--color-tolerance", 
                        type=int, 
                        default=25, 
                        help="颜色相似度阈值（仅 advanced 模式有效，越小越精准，默认 25）")
    
    parser.add_argument("-a", "--min-area", 
                        type=int, 
                        default=30, 
                        help="忽略的最小色块面积（仅 advanced 模式有效，默认 30）")
    
    return parser.parse_args()

# ------------------- 主函数 -------------------
if __name__ == "__main__":
    args = parse_args()  # 解析命令行参数
    
    try:
        # 调用转换函数（参数从命令行获取）
        svg_code = png_to_svg_code(
            png_path=args.png_path,
            mode=args.mode,
            threshold=args.threshold,
            color_tolerance=args.color_tolerance,
            min_area=args.min_area
        )
        
        # 输出结果
        print("\n" + "="*60)
        print("SVG 代码生成成功！完整代码如下：")
        print("="*60)
        print(svg_code)
        print("="*60 + "\n")
        
        # 保存代码到文本文件（方便复制）
        output_txt = "svg_code.txt"
        with open(output_txt, "w", encoding="utf-8") as f:
            f.write(svg_code)
        print(f"提示：SVG 代码已同步保存到 → {os.path.abspath(output_txt)}")
    
    except Exception as e:
        print(f"\n错误：{str(e)}")
        exit(1)  # 异常退出（返回非 0 状态码）