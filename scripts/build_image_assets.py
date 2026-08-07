from __future__ import annotations

import html
import shutil
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from PIL import Image, ImageChops, ImageCms, ImageDraw, ImageFilter, ImageFont, ImageStat


ROOT = Path(__file__).resolve().parents[1]
MASTER_DIR = ROOT / "assets" / "image-masters"
FONT_DIR = ROOT / "assets" / "fonts"
PUBLIC_DIR = ROOT / "public" / "images"
CONCEPT_DIR = ROOT / "assets" / "portfolio-concepts"
APP_DIR = ROOT / "src" / "app"

NAVY = "#102033"
BLUE = "#1769E0"
CYAN = "#00A3E0"
MAGENTA = "#E5007E"
YELLOW = "#F5D400"
WHITE = "#FFFFFF"
MUTED = "#52616F"
SRGB_PROFILE = ImageCms.ImageCmsProfile(ImageCms.createProfile("sRGB")).tobytes()


def make_static_fonts() -> tuple[Path, Path]:
    specs = [
        (FONT_DIR / "MiriamLibre-Variable.ttf", FONT_DIR / "MiriamLibre-Bold.ttf", 700),
        (FONT_DIR / "Heebo-Variable.ttf", FONT_DIR / "Heebo-Medium.ttf", 500),
    ]
    for source, target, weight in specs:
        font = TTFont(source)
        static = instantiateVariableFont(font, {"wght": weight}, inplace=False)
        static.save(target)
    return specs[0][1], specs[1][1]


def text_paths(font_path: Path, text: str, font_size: float, right: float, baseline: float) -> str:
    font = TTFont(font_path)
    glyph_set = font.getGlyphSet()
    cmap = font.getBestCmap()
    units = font["head"].unitsPerEm
    scale = font_size / units
    hmtx = font["hmtx"].metrics

    advances = []
    for char in text:
        glyph_name = cmap.get(ord(char), ".notdef")
        advances.append(hmtx[glyph_name][0] * scale)

    cursor = right
    result: list[str] = []
    for char, advance in zip(text, advances):
        cursor -= advance
        if char.isspace():
            continue
        glyph_name = cmap.get(ord(char), ".notdef")
        pen = SVGPathPen(glyph_set)
        transform = TransformPen(pen, (scale, 0, 0, -scale, cursor, baseline))
        glyph_set[glyph_name].draw(transform)
        commands = pen.getCommands()
        if commands:
            result.append(f'<path d="{html.escape(commands, quote=True)}"/>')
    return "".join(result)


def mark_svg(color_mode: str, size: int = 180) -> str:
    if color_mode == "full":
        tile_fill, glyph_fill, outline = NAVY, WHITE, None
    elif color_mode == "navy":
        tile_fill, glyph_fill, outline = "none", NAVY, NAVY
    else:
        tile_fill, glyph_fill, outline = "none", WHITE, WHITE

    outline_attr = f' stroke="{outline}" stroke-width="7"' if outline else ""
    # A deliberately simple, unmistakable Hebrew dalet. Its right-hand stem
    # remains legible at favicon size, unlike the typeface glyph at 16px.
    glyph = '<path d="M50 52H132V74H124V126H100V74H50Z"/>'
    strip = ""
    if color_mode == "full":
        strip = (
            f'<rect x="18" y="148" width="36" height="12" fill="{CYAN}"/>'
            f'<rect x="54" y="148" width="36" height="12" fill="{MAGENTA}"/>'
            f'<rect x="90" y="148" width="36" height="12" fill="{YELLOW}"/>'
            f'<rect x="126" y="148" width="36" height="12" fill="{BLUE}"/>'
        )
    else:
        strip = f'<rect x="18" y="148" width="144" height="12" fill="{glyph_fill}"/>'
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" role="img" aria-label="דפוס ראובן">'
        f'<rect x="18" y="18" width="144" height="142" rx="14" fill="{tile_fill}"{outline_attr}/>'
        f'<g fill="{glyph_fill}">{glyph}</g>{strip}</svg>\n'
    )


def lockup_svg(layout: str, color_mode: str) -> str:
    miriam = FONT_DIR / "MiriamLibre-Bold.ttf"
    heebo = FONT_DIR / "Heebo-Medium.ttf"
    foreground = WHITE if color_mode == "white" else NAVY
    if layout == "horizontal":
        width, height = 820, 190
        wordmark = text_paths(miriam, "דפוס ראובן", 88, 800, 92)
        tagline = text_paths(heebo, "עיצוב • דפוס • שילוט", 30, 800, 145)
        mark = mark_svg(color_mode).split(">", 1)[1].rsplit("</svg>", 1)[0]
        mark_group = f'<g transform="translate(8 5) scale(.98)">{mark}</g>'
    else:
        width, height = 540, 400
        wordmark = text_paths(miriam, "דפוס ראובן", 84, 510, 286)
        tagline = text_paths(heebo, "עיצוב • דפוס • שילוט", 28, 510, 340)
        mark = mark_svg(color_mode).split(">", 1)[1].rsplit("</svg>", 1)[0]
        mark_group = f'<g transform="translate(180 15)">{mark}</g>'
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img" aria-label="דפוס ראובן — עיצוב, דפוס ושילוט">'
        f'{mark_group}<g fill="{foreground}">{wordmark}</g><g fill="{foreground}" opacity=".78">{tagline}</g></svg>\n'
    )


def build_logos() -> None:
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
    for mode in ("full", "navy", "white"):
        (PUBLIC_DIR / f"logo-mark-{mode}.svg").write_text(mark_svg(mode), encoding="utf-8")
        for layout in ("horizontal", "stacked"):
            (PUBLIC_DIR / f"logo-{layout}-{mode}.svg").write_text(
                lockup_svg(layout, mode), encoding="utf-8"
            )
    shutil.copyfile(PUBLIC_DIR / "logo-horizontal-full.svg", PUBLIC_DIR / "logo.svg")
    shutil.copyfile(PUBLIC_DIR / "logo-mark-full.svg", APP_DIR / "icon.svg")

    canvas = Image.new("RGB", (180, 180), NAVY)
    draw = ImageDraw.Draw(canvas)
    draw.polygon(((50, 52), (132, 52), (132, 74), (124, 74), (124, 126), (100, 126), (100, 74), (50, 74)), fill=WHITE)
    for index, color in enumerate((CYAN, MAGENTA, YELLOW, BLUE)):
        draw.rectangle((0 + index * 45, 156, 45 + index * 45, 180), fill=color)
    canvas.save(APP_DIR / "apple-icon.png", format="PNG", optimize=True)


def target_size(name: str) -> tuple[int, int]:
    if name.startswith("svc-"):
        return 1600, 1000
    if name == "hero-collage":
        return 1800, 1440
    if name == "og-image":
        return 1200, 630
    return 1600, 1200


def center_crop_to_ratio(image: Image.Image, ratio: float) -> Image.Image:
    width, height = image.size
    current = width / height
    if current > ratio:
        crop_width = int(round(height * ratio))
        left = (width - crop_width) // 2
        return image.crop((left, 0, left + crop_width, height))
    crop_height = int(round(width / ratio))
    top = (height - crop_height) // 2
    return image.crop((0, top, width, top + crop_height))


def fit_without_upscale(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    target_w, target_h = size
    ratio = target_w / target_h
    cropped = center_crop_to_ratio(image, ratio)
    if cropped.width > target_w or cropped.height > target_h:
        scale = min(target_w / cropped.width, target_h / cropped.height)
        cropped = cropped.resize(
            (int(round(cropped.width * scale)), int(round(cropped.height * scale))),
            Image.Resampling.LANCZOS,
        )
    if cropped.size == size:
        return cropped

    # Extend the photographed surface into the small retina-size margins while
    # preserving the generated subject at native resolution.
    sample = max(24, min(cropped.size) // 18)
    corner_boxes = (
        (0, 0, sample, sample),
        (cropped.width - sample, 0, cropped.width, sample),
        (0, cropped.height - sample, sample, cropped.height),
        (cropped.width - sample, cropped.height - sample, cropped.width, cropped.height),
    )
    corner_colors = [ImageStat.Stat(cropped.crop(box)).median for box in corner_boxes]
    surface = tuple(round(sum(color[channel] for color in corner_colors) / 4) for channel in range(3))
    background = Image.new("RGB", size, surface)
    noise = Image.effect_noise(size, 4).convert("RGB")
    neutral_noise = Image.new("RGB", size, (128, 128, 128))
    noise = ImageChops.subtract(noise, neutral_noise, scale=8, offset=128)
    background = Image.blend(background, noise, 0.025)
    x = (target_w - cropped.width) // 2
    y = (target_h - cropped.height) // 2
    feather = max(18, min(56, min(cropped.size) // 18))
    mask = Image.new("L", cropped.size, 255)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rectangle((0, 0, cropped.width - 1, cropped.height - 1), outline=0, width=feather)
    mask = mask.filter(ImageFilter.GaussianBlur(feather / 2))
    background.paste(cropped, (x, y), mask)
    return background


def add_og_type(image: Image.Image) -> None:
    draw = ImageDraw.Draw(image)
    title_font = ImageFont.truetype(str(FONT_DIR / "MiriamLibre-Bold.ttf"), 76)
    tagline_font = ImageFont.truetype(str(FONT_DIR / "Heebo-Medium.ttf"), 28)
    title = "ןבואר סופד"
    tagline = "טוליש • סופד • בוציע"
    right = 470
    title_box = draw.textbbox((0, 0), title, font=title_font)
    tagline_box = draw.textbbox((0, 0), tagline, font=tagline_font)
    draw.text((right - (title_box[2] - title_box[0]), 232), title, font=title_font, fill=NAVY)
    draw.rectangle((right - 158, 327, right, 334), fill=BLUE)
    draw.text((right - (tagline_box[2] - tagline_box[0]), 355), tagline, font=tagline_font, fill=MUTED)


def save_webp(image: Image.Image, destination: Path, max_bytes: int) -> None:
    working = image
    for blur_radius in (0, 0.18, 0.28, 0.38, 0.5, 0.65):
        candidate = working if blur_radius == 0 else image.filter(ImageFilter.GaussianBlur(blur_radius))
        candidate.save(
            destination,
            format="WEBP",
            quality=80,
            method=6,
            exact=True,
            icc_profile=SRGB_PROFILE,
        )
        if destination.stat().st_size <= max_bytes:
            return
    raise RuntimeError(f"{destination.name} exceeds {max_bytes // 1024} KB at q80")


def build_photos() -> None:
    CONCEPT_DIR.mkdir(parents=True, exist_ok=True)
    for source in sorted(MASTER_DIR.glob("*.png")):
        name = source.stem
        size = target_size(name)
        image = Image.open(source).convert("RGB")
        image = fit_without_upscale(image, size)
        if name == "og-image":
            add_og_type(image)
        max_bytes = 400 * 1024 if name == "hero-collage" else 250 * 1024
        # Portfolio frames are speculative art-direction concepts, not evidence
        # of completed client work. Keep them out of the public site until a real
        # archive photo can replace each one.
        destination_dir = CONCEPT_DIR if name.startswith("portfolio-") else PUBLIC_DIR
        save_webp(image, destination_dir / f"{name}.webp", max_bytes)


def main() -> None:
    make_static_fonts()
    build_logos()
    build_photos()


if __name__ == "__main__":
    main()
