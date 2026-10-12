"""Turns the official logos in assets-src/logos/ into the badge images in public/img/logos/.

Each logo is separated from its own flat background (whatever colour its corner pixel is),
cropped to the artwork, scaled to fit an 88x88 square (2x the 44px badge) with a 6px margin,
and flattened onto white, so every badge sits on the same white tile in both themes.

    python3 scripts/logos.py        # needs Pillow
"""
from pathlib import Path

from PIL import Image

SRC = Path('assets-src/logos')
OUT = Path('public/img/logos')
SIZE, MARGIN = 88, 6


def badge(path: Path) -> Image.Image:
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
    box = SIZE - 2 * MARGIN
    scale = min(box / im.width, box / im.height)
    im = im.resize((max(1, round(im.width * scale)), max(1, round(im.height * scale))), Image.LANCZOS)
    tile = Image.new('RGBA', (SIZE, SIZE), (255, 255, 255, 255))
    tile.alpha_composite(im, ((SIZE - im.width) // 2, (SIZE - im.height) // 2))
    return tile.convert('RGB')


OUT.mkdir(parents=True, exist_ok=True)
for path in sorted(SRC.iterdir()):
    out = OUT / f'{path.stem}.webp'
    badge(path).save(out, 'WEBP', quality=90, method=6)
    print(f'{path} -> {out} ({out.stat().st_size} bytes)')
