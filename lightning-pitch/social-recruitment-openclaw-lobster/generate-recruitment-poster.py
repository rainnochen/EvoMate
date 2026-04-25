import re
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter


ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
ASSET_DIR = ROOT / "lightning-pitch" / "generated-cute-openclaw-lobster-images"
OUT = HERE / "evomate-openclaw-recruitment-iphone17pro.png"

WIDTH = 1206
HEIGHT = 2622

FONT_BOLD = "/System/Library/Fonts/STHeiti Medium.ttc"
FONT_REGULAR = "/System/Library/Fonts/STHeiti Light.ttc"
FONT_FALLBACK = "/System/Library/Fonts/Supplemental/Arial Unicode.ttf"


def font(size, bold=False):
    path = FONT_BOLD if bold else FONT_REGULAR
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.truetype(FONT_FALLBACK, size)


def text_size(draw, text, fnt):
    box = draw.textbbox((0, 0), text, font=fnt)
    return box[2] - box[0], box[3] - box[1]


def wrap_text(draw, text, fnt, max_width):
    token_pattern = r"[A-Za-z0-9_./×+-]+(?:\s+)?|[\u4e00-\u9fff]|[^\sA-Za-z0-9_\u4e00-\u9fff]"
    tokens = re.findall(token_pattern, text)
    lines = []
    current = ""
    for token in tokens:
        if token == "\n":
            if current:
                lines.append(current)
            current = ""
            continue
        trial = current + token
        if text_size(draw, trial, fnt)[0] <= max_width:
            current = trial
        else:
            if current:
                lines.append(current.rstrip())
            current = token.lstrip()
    if current:
        lines.append(current.rstrip())
    return lines


def draw_wrapped(draw, text, xy, fnt, fill, max_width, line_gap=12):
    x, y = xy
    for line in wrap_text(draw, text, fnt, max_width):
        draw.text((x, y), line, font=fnt, fill=fill)
        y += text_size(draw, line, fnt)[1] + line_gap
    return y


def rounded_rect(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def paste_cover(canvas, image_path, box, overlay=(255, 247, 235, 72)):
    src = Image.open(image_path).convert("RGB")
    target_w = box[2] - box[0]
    target_h = box[3] - box[1]
    scale = max(target_w / src.width, target_h / src.height)
    resized = src.resize((int(src.width * scale), int(src.height * scale)), Image.Resampling.LANCZOS)
    left = (resized.width - target_w) // 2
    top = (resized.height - target_h) // 2
    cropped = resized.crop((left, top, left + target_w, top + target_h)).convert("RGBA")
    shade = Image.new("RGBA", (target_w, target_h), overlay)
    cropped = Image.alpha_composite(cropped, shade)
    canvas.alpha_composite(cropped, (box[0], box[1]))


def draw_card(draw, box, title, subtitle, body, tags, accent):
    x1, y1, x2, y2 = box
    shadow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle((x1 + 10, y1 + 14, x2 + 10, y2 + 14), radius=34, fill=(122, 67, 30, 35))
    blurred = shadow.filter(ImageFilter.GaussianBlur(12))
    base.alpha_composite(blurred)

    rounded_rect(draw, box, 34, fill=(255, 255, 250, 242), outline=(250, 202, 165), width=3)
    rounded_rect(draw, (x1 + 28, y1 + 28, x1 + 116, y1 + 116), 28, fill=accent)
    draw.text((x1 + 55, y1 + 48), title.split("：")[0], font=font(38, True), fill=(255, 255, 255), anchor="mm")
    draw.text((x1 + 140, y1 + 26), title, font=font(37, True), fill=(67, 45, 35))
    draw.text((x1 + 140, y1 + 76), subtitle, font=font(28, True), fill=(203, 93, 62))
    y = draw_wrapped(draw, body, (x1 + 32, y1 + 134), font(30), (78, 60, 49), x2 - x1 - 64, 11)
    tag_x = x1 + 32
    tag_y = y + 16
    for tag in tags:
        tw, th = text_size(draw, tag, font(24, True))
        if tag_x + tw + 36 > x2 - 28:
            tag_x = x1 + 32
            tag_y += 52
        rounded_rect(draw, (tag_x, tag_y, tag_x + tw + 34, tag_y + 38), 19, fill=(255, 237, 216), outline=(245, 187, 143))
        draw.text((tag_x + 17, tag_y + 6), tag, font=font(24, True), fill=(119, 75, 50))
        tag_x += tw + 46


def draw_chip(draw, xy, text, fill, stroke=(255, 255, 255, 150)):
    x, y = xy
    fnt = font(25, True)
    tw, th = text_size(draw, text, fnt)
    rounded_rect(draw, (x, y, x + tw + 36, y + 44), 22, fill=fill, outline=stroke, width=2)
    draw.text((x + 18, y + 9), text, font=fnt, fill=(255, 255, 255))
    return x + tw + 48


base = Image.new("RGBA", (WIDTH, HEIGHT), (255, 247, 232, 255))
draw = ImageDraw.Draw(base)

# Warm vertical gradient.
for y in range(HEIGHT):
    t = y / HEIGHT
    r = int(255 * (1 - t) + 248 * t)
    g = int(247 * (1 - t) + 226 * t)
    b = int(232 * (1 - t) + 206 * t)
    draw.line((0, y, WIDTH, y), fill=(r, g, b, 255))

# Soft decorative blobs.
for ellipse, color in [
    ((-210, 180, 320, 720), (255, 167, 132, 70)),
    ((820, -120, 1340, 430), (113, 207, 206, 62)),
    ((850, 1780, 1350, 2360), (255, 180, 94, 70)),
    ((-180, 2050, 360, 2700), (96, 190, 182, 55)),
]:
    draw.ellipse(ellipse, fill=color)

paste_cover(base, ASSET_DIR / "01-cover-cute-lobster.png", (54, 78, 1152, 676), overlay=(255, 246, 228, 86))
draw = ImageDraw.Draw(base)
rounded_rect(draw, (54, 78, 1152, 676), 48, fill=None, outline=(255, 255, 255, 180), width=4)

# Hero text panel.
rounded_rect(draw, (94, 374, 1112, 636), 36, fill=(255, 255, 250, 232), outline=(255, 206, 157), width=3)
draw.text((126, 400), "EvoMate × OpenClaw", font=font(64, True), fill=(54, 47, 45))
draw.text((126, 478), "小龙虾实验室招募队友", font=font(58, True), fill=(226, 87, 55))
draw.text((128, 554), "把 Agent 从配置体，变成会遗传、会突变、会进化的数字生命。", font=font(30), fill=(79, 67, 58))

x = 92
x = draw_chip(draw, (x, 704), "红药丸赛道", (232, 93, 66, 235))
x = draw_chip(draw, (x, 704), "Build For Future", (48, 158, 159, 235))
draw_chip(draw, (x, 704), "Team Recruiting", (64, 61, 81, 235))

draw.text((92, 790), "Team 4 人，已有 1 位产品 idea 发起人", font=font(42, True), fill=(58, 45, 38))
draw.text((92, 848), "现在招募 3 位一起把 Agent 送进矩阵的队友。", font=font(35), fill=(91, 70, 56))

rounded_rect(draw, (92, 916, 1114, 1034), 32, fill=(255, 255, 250, 225), outline=(247, 196, 148), width=3)
draw.text((132, 946), "我们不是在做 Agent 宠物游戏。", font=font(36, True), fill=(60, 47, 39))
draw.text((132, 994), "我们在做 Agent Evolution Protocol：繁育、传承、重组、突变、评估。", font=font(29), fill=(92, 71, 58))

draw_card(
    draw,
    (92, 1096, 1114, 1392),
    "A：算法 / 策略",
    "负责 Agent Genome 与突变机制",
    "设计 Agent 之间的繁育、传承、重组、突变开放协议；定义 Child Agent 如何产生，以及如何判断它是否真的变强。EvoMate 偏去中心化进化协议，EvoMap 偏中心化进化地图。",
    ["Genome Protocol", "Mutation", "Evaluation"],
    (229, 93, 67, 255),
)

draw_card(
    draw,
    (92, 1430, 1114, 1726),
    "B：架构 / 平台",
    "负责接入、服务与 Arena 测试",
    "搭建 Agent 接入、服务和平台可视化；连接 OpenClaw / Evolver adapter；设计子代 Agent 生成后的标准化测试流程和 Arena 对比。",
    ["OpenClaw Gateway", "Runtime", "Arena"],
    (39, 158, 160, 255),
)

draw_card(
    draw,
    (92, 1764, 1114, 2060),
    "C：视觉 / 体验",
    "负责人类可观测的进化表达",
    "设计 Agent 身份资料扫描、DNA 融合过程、Child Reveal、突变警报、基因报告，以及社交裂变活动与分享海报。",
    ["DNA Fusion", "UX", "Share Poster"],
    (246, 147, 63, 255),
)

# Mini demo flow.
rounded_rect(draw, (92, 2118, 1114, 2350), 38, fill=(50, 45, 52, 238), outline=(255, 217, 171), width=3)
draw.text((132, 2150), "Demo 闭环", font=font(36, True), fill=(255, 241, 219))
flow = "父代 Agent 进入实验室 → DNA 融合 → Child Agent 诞生 → 继承 / 突变报告 → Arena 对比表现"
flow_end_y = draw_wrapped(draw, flow, (132, 2204), font(29, True), (255, 231, 203), 900, 10)
draw.text((132, flow_end_y + 12), "目标：30 秒让人听懂，2 分钟让人记住。", font=font(29, True), fill=(120, 230, 222))

# Footer CTA.
rounded_rect(draw, (92, 2392, 1114, 2546), 42, fill=(232, 86, 58, 246), outline=(255, 235, 205), width=4)
draw.text((603, 2430), "加入 EvoMate Lab", font=font(50, True), fill=(255, 255, 248), anchor="ma")
draw.text((603, 2492), "想一起写矩阵，来找我。今晚让小龙虾进化。", font=font(31, True), fill=(255, 247, 225), anchor="ma")

base = base.convert("RGB")
base.save(OUT, quality=96)
print(OUT)
