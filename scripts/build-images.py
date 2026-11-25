"""Export a transparent master cut-out into web-ready responsive variants.

Requires: pillow (with AVIF support).
Usage: python scripts/build-images.py <master.png> <out_dir> <name> [--widths 640,960,1440]

Writes <name>-<width>.avif / .webp for every width, plus a PNG fallback at the
middle width for browsers without AVIF/WebP support.
"""

import argparse
from pathlib import Path

from PIL import Image

AVIF_QUALITY = 62
WEBP_QUALITY = 82


def resize(master: Image.Image, width: int) -> Image.Image:
    if width >= master.width:
        return master
    height = round(master.height * width / master.width)
    # Resample premultiplied so transparent pixels never bleed into the edge.
    return master.convert("RGBa").resize((width, height), Image.LANCZOS).convert("RGBA")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("master", type=Path)
    parser.add_argument("out_dir", type=Path)
    parser.add_argument("name")
    parser.add_argument("--widths", default="640,960,1440")
    args = parser.parse_args()

    widths = [int(w) for w in args.widths.split(",")]
    args.out_dir.mkdir(parents=True, exist_ok=True)
    master = Image.open(args.master).convert("RGBA")

    for width in widths:
        image = resize(master, width)
        stem = args.out_dir / f"{args.name}-{width}"
        image.save(f"{stem}.avif", quality=AVIF_QUALITY)
        image.save(f"{stem}.webp", quality=WEBP_QUALITY, method=6, alpha_quality=90)
        print(f"{stem}.avif/.webp {image.width}x{image.height}")

    fallback_width = widths[len(widths) // 2]
    resize(master, fallback_width).save(args.out_dir / f"{args.name}-{fallback_width}.png", optimize=True)


if __name__ == "__main__":
    main()
