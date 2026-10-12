"""Turns the official logos in assets-src/logos/ into the badge images in public/img/logos/.

Each logo is separated from its own flat background (whatever colour its corner pixel is),
cropped to the artwork and flattened onto white, so every badge sits on the same white tile in
both themes. Square logos fit an 88x88 tile (2x the 44px badge) with a 6px margin. Wordmarks
(WIDE) keep their shape: a 112px-high tile (2x the 56px diploma badge) with an 8px margin, as wide
as the artwork needs up to 2.73:1 (120px wide at 44px high), so their lettering stays legible.

    python3 scripts/logos.py        # needs Pillow
"""
from pathlib import Path

from PIL import Image

SRC = Path('assets-src/logos')
OUT = Path('public/img/logos')
SIZE, MARGIN = 88, 6
WIDE = {'alnafi', 'eduqual'}
WIDE_H, WIDE_MARGIN, WIDE_MAX_RATIO = 112, 8, 120 / 44


def badge(path: Path, wide: bool) -> Image.Image:
    im = Image.open(path).convert('RGBA')
    bg = im.getpixel((0, 0))[:3]
    # Alpha from the distance to the background colour: soft edges, solid artwork.
    px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            d = max(abs(r - bg[0]), abs(g - bg[1]), abs(b - bg[2]))
            px[x, y] = (r, g, b, min(a, max(0, min(255, (d - 8) * 255 // 40))))
    im = im.crop(im.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox())
    if wide:
        max_w = round(WIDE_H * WIDE_MAX_RATIO) - 2 * WIDE_MARGIN
        box_h = WIDE_H - 2 * WIDE_MARGIN
        scale = min(box_h / im.height, max_w / im.width)
        im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
        tile = Image.new('RGBA', (im.width + 2 * WIDE_MARGIN, WIDE_H), (255, 255, 255, 255))
        tile.alpha_composite(im, (WIDE_MARGIN, (WIDE_H - im.height) // 2))
        return tile.convert('RGB')
    box = SIZE - 2 * MARGIN
    scale = min(box / im.width, box / im.height)
    im = im.resize((max(1, round(im.width * scale)), max(1, round(im.height * scale))), Image.LANCZOS)
    tile = Image.new('RGBA', (SIZE, SIZE), (255, 255, 255, 255))
    tile.alpha_composite(im, ((SIZE - im.width) // 2, (SIZE - im.height) // 2))
    return tile.convert('RGB')


OUT.mkdir(parents=True, exist_ok=True)
for path in sorted(SRC.iterdir()):
    out = OUT / f'{path.stem}.webp'
    img = badge(path, path.stem in WIDE)
    img.save(out, 'WEBP', quality=90, method=6)
    print(f'{path} -> {out} {img.size} ({out.stat().st_size} bytes)')
