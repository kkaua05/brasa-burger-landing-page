"""Cut a product photo out of a known backdrop and save a true-alpha PNG.

Two backdrops are supported:

* white:   a flat white studio background.
* checker: the grey/white checkerboard that "free PNG" sites bake into JPGs
           (no real transparency). The grid period, phase and the vertical
           fade of the grey squares are fitted from the image margins, so the
           exact backdrop colour is known at every pixel.

Known-backdrop matting:

1. Background = pixels matching the backdrop that touch the image border,
   plus enclosed gaps (auto-detected for the checker, or given with --hole).
2. Pixels inside the product are fully opaque, so cream sesame, onion, mayo
   and glossy highlights are never punched out.
3. Only a thin band along the silhouette gets fractional alpha. A pixel that
   is a blend of product and backdrop B keeps the direction of (colour - B),
   so the most saturated neighbour along that direction is taken as its pure
   colour. Alpha is the projection onto the B-to-colour line, and the colour
   is un-mixed from B, which removes halos instead of hiding them.
4. --defringe: where the band borders light product, edge pixels take the
   colour of the nearby interior and alpha never drops below a distance
   feather. Needed for photos that carry a grey ring from an earlier cut-out.
5. Tiny grey specks (dust on the backdrop) are dropped.

Requires: pillow, numpy, scipy.
Usage:
  python scripts/remove-background.py <input> <output.png>
         [--backdrop white|checker] [--size 2048] [--hole x,y ...] [--defringe]
"""

import argparse

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

BACKGROUND_TOLERANCE = 12  # max distance from the backdrop still treated as backdrop
CHECKER_MAX_CHROMA = 4  # the checkerboard is perfectly neutral; food is not
HOLE_TOLERANCE = 8  # stricter match for enclosed gaps
HOLE_MIN_AREA = 40  # enclosed gaps smaller than this are kept (highlights)
EDGE_BAND_PX = 3.0  # width of the silhouette band that receives soft alpha
SEARCH_RADIUS_PX = 4  # neighbourhood searched for a band pixel's pure colour
SAME_HUE_COSINE = 0.96  # how parallel (neighbour - B) must be to (pixel - B)
ALPHA_FLOOR = 0.05  # removes JPEG ringing around crumbs and splashes
DEFRINGE_REACH_PX = 4  # band pixels this close to the interior borrow its colour
LIGHT_INTERIOR_MIN = 110  # interior whose darkest channel is above this is "light"
SPECK_MAX_AREA = 8  # isolated blobs up to this size...
SPECK_MAX_CHROMA = 28  # ...and this grey are dust, not crumbs
PADDING_PX = 6
CHECKER_MARGIN = 0.1  # side margins assumed free of product when fitting the grid


# ---------------------------------------------------------------- backdrops


def white_backdrop(rgb: np.ndarray) -> np.ndarray:
    return np.full(rgb.shape[:2], 255.0, dtype=np.float32)


def _crossings(profile: np.ndarray) -> np.ndarray:
    low, high = np.percentile(profile, 5), np.percentile(profile, 95)
    middle = (low + high) / 2
    above = profile > middle
    positions = []
    for i in np.where(above[1:] != above[:-1])[0]:
        a, b = profile[i], profile[i + 1]
        positions.append(i + (middle - a) / (b - a) if b != a else i + 0.5)
    return np.array(positions)


def checker_backdrop(rgb: np.ndarray) -> np.ndarray:
    """Fits the baked-in checkerboard: square period, phase and grey fade."""
    lum = rgb.mean(axis=2)
    height, width = lum.shape

    columns = _crossings(lum[6:20].mean(axis=0))
    period0 = np.median(np.diff(columns))
    k = np.round((columns - columns[0]) / period0)
    period, offset_x = np.linalg.lstsq(np.vstack([k, np.ones_like(k)]).T, columns, rcond=None)[0]

    # Squares are square: reuse the period, fit only the vertical phase near
    # the top, before the fade weakens the contrast.
    rows = _crossings(lum[: int(height * 0.3), 6:20].mean(axis=1))
    offset_y = np.median(rows - np.round((rows - rows[0]) / period) * period)

    # Crossings are measured between sample indices; the model below works
    # with pixel centres (index + 0.5).
    offset_x += 0.5
    offset_y += 0.5

    xs = np.arange(width) + 0.5
    ys = np.arange(height) + 0.5
    cell_x = np.floor((xs - offset_x) / period).astype(int)
    cell_y = np.floor((ys - offset_y) / period).astype(int)
    parity = (cell_x[None, :] + cell_y[:, None]) % 2
    grey_parity = parity[5, 5] if lum[2:12, 2:12].mean() < 250 else 1 - parity[5, 5]

    # Grey level per row, read from the side margins away from square borders.
    edge_x = np.minimum((xs - offset_x) % period, period - (xs - offset_x) % period)
    edge_y = np.minimum((ys - offset_y) % period, period - (ys - offset_y) % period)
    margin = np.zeros(width, bool)
    margin[: int(width * CHECKER_MARGIN)] = True
    margin[int(width * (1 - CHECKER_MARGIN)) :] = True
    sample = (parity == grey_parity) & (edge_x[None, :] > 3) & (edge_y[:, None] > 3) & margin[None, :]
    grey = np.array([np.median(lum[y][sample[y]]) if sample[y].any() else np.nan for y in range(height)])
    known = ~np.isnan(grey)
    grey = np.interp(np.arange(height), np.where(known)[0], grey[known])
    grey = ndi.median_filter(grey, 9)

    backdrop = np.where(parity == grey_parity, grey[:, None], 255.0)
    # Matches the soft square borders left by resampling.
    return ndi.gaussian_filter(backdrop, 0.6).astype(np.float32)


BACKDROPS = {"white": white_backdrop, "checker": checker_backdrop}


# ---------------------------------------------------------------- matting


def distance_to_backdrop(rgb, backdrop):
    """Distance to the backdrop values found in the 3x3 neighbourhood, so the
    soft borders between checker squares never read as product."""
    low = ndi.minimum_filter(backdrop, 3)[..., None]
    high = ndi.maximum_filter(backdrop, 3)[..., None]
    return np.maximum(np.maximum(low - rgb, rgb - high), 0.0).max(axis=2)


def find_background(rgb, backdrop, holes, checker):
    distance = distance_to_backdrop(rgb, backdrop)
    chroma = rgb.max(axis=2) - rgb.min(axis=2)
    candidates = distance <= BACKGROUND_TOLERANCE
    if checker:
        candidates &= chroma <= CHECKER_MAX_CHROMA

    labels, count = ndi.label(candidates, structure=np.ones((3, 3)))
    border = np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]])
    background_labels = (set(np.unique(border)) | {labels[y, x] for x, y in holes}) - {0}

    if checker:
        # Enclosed gaps where the checkerboard shows through the product.
        index = np.arange(1, count + 1)
        area = ndi.sum(np.ones_like(distance), labels, index)
        fit = ndi.mean(distance, labels, index)
        background_labels |= set(index[(area >= HOLE_MIN_AREA) & (fit <= HOLE_TOLERANCE)])

    return np.isin(labels, list(background_labels))


def pure_colour_of_blends(rgb, backdrop, background):
    """Most saturated neighbour lying on the same backdrop-to-colour line."""
    height, width, _ = rgb.shape
    r = SEARCH_RADIUS_PX
    base = backdrop[..., None]
    offset = rgb - base
    length = np.linalg.norm(offset, axis=2)
    direction = offset / np.maximum(length, 1e-6)[..., None]

    padded_rgb = np.pad(rgb, ((r, r), (r, r), (0, 0)), mode="edge")
    padded_bg = np.pad(background, r, constant_values=True)

    best_len = length.copy()
    best_rgb = rgb.copy()
    for dy in range(-r, r + 1):
        for dx in range(-r, r + 1):
            if dx * dx + dy * dy > r * r or (dx == 0 and dy == 0):
                continue
            window = (slice(r + dy, r + dy + height), slice(r + dx, r + dx + width))
            neighbour = padded_rgb[window]
            towards = neighbour - base
            neighbour_len = np.linalg.norm(towards, axis=2)
            cosine = (towards * direction).sum(axis=2) / np.maximum(neighbour_len, 1e-6)
            better = (neighbour_len > best_len) & (cosine >= SAME_HUE_COSINE) & ~padded_bg[window]
            best_len = np.where(better, neighbour_len, best_len)
            best_rgb = np.where(better[..., None], neighbour, best_rgb)
    return best_rgb


def build_alpha(rgb, backdrop, holes, checker, defringe):
    background = find_background(rgb, backdrop, holes, checker)

    distance_to_background = ndi.distance_transform_edt(~background)
    band = ~background & (distance_to_background <= EDGE_BAND_PX)
    core = ~background & ~band

    reference = pure_colour_of_blends(rgb, backdrop, background)
    base = backdrop[..., None]
    to_reference = reference - base
    to_pixel = rgb - base
    denominator = np.maximum((to_reference**2).sum(axis=2), 1.0)
    projected = np.clip((to_pixel * to_reference).sum(axis=2) / denominator, 0.0, 1.0)
    projected = np.clip((projected - ALPHA_FLOOR) / (1.0 - ALPHA_FLOOR), 0.0, 1.0)

    distance_to_core, (iy, ix) = ndi.distance_transform_edt(~core, return_indices=True)
    interior_colour = rgb[iy, ix]

    if defringe:
        light_interior = interior_colour.min(axis=2) >= LIGHT_INTERIOR_MIN
        near_core = band & light_interior & (distance_to_core <= DEFRINGE_REACH_PX)
    else:
        near_core = np.zeros_like(band)
    feather = np.clip((distance_to_background - 0.5) / 1.5, 0.0, 1.0)

    band_alpha = np.where(near_core, np.maximum(projected, feather), projected)
    alpha = np.where(core, 1.0, np.where(band, band_alpha, 0.0))

    safe_alpha = np.maximum(alpha, 1e-3)[..., None]
    unmixed = np.clip(base + (rgb - base) / safe_alpha, 0.0, 255.0)
    weight = np.clip((alpha - 0.15) / 0.35, 0.0, 1.0)[..., None]
    thin_edge_colour = unmixed * weight + reference * (1.0 - weight)
    edge_colour = np.where(near_core[..., None], interior_colour, thin_edge_colour)
    colour = np.where(band[..., None], edge_colour, rgb)

    alpha = drop_specks(alpha, rgb)

    # Transparent pixels carry the nearest product colour so lossy encoders
    # and resamplers never blend dark or light fringes into the edge.
    colour = np.where((alpha == 0)[..., None], interior_colour, colour)
    return alpha, colour


def drop_specks(alpha, rgb):
    labels, count = ndi.label(alpha > 0, structure=np.ones((3, 3)))
    index = np.arange(1, count + 1)
    area = ndi.sum(np.ones_like(alpha), labels, index)
    chroma = ndi.mean(rgb.max(axis=2) - rgb.min(axis=2), labels, index)
    specks = index[(area <= SPECK_MAX_AREA) & (chroma <= SPECK_MAX_CHROMA)]
    return np.where(np.isin(labels, specks), 0.0, alpha)


def crop_to_content(rgba):
    ys, xs = np.where(rgba[..., 3] > 8)
    top = max(ys.min() - PADDING_PX, 0)
    bottom = min(ys.max() + PADDING_PX + 1, rgba.shape[0])
    left = max(xs.min() - PADDING_PX, 0)
    right = min(xs.max() + PADDING_PX + 1, rgba.shape[1])
    return rgba[top:bottom, left:right]


def parse_point(value):
    x, y = value.split(",")
    return int(x), int(y)


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("input")
    parser.add_argument("output")
    parser.add_argument("--backdrop", choices=sorted(BACKDROPS), default="white")
    parser.add_argument("--size", type=int, help="work at this width (downscales the source first)")
    parser.add_argument("--hole", type=parse_point, action="append", default=[],
                        help="x,y of an enclosed gap that is background (working coordinates)")
    parser.add_argument("--defringe", action="store_true", help="remove a grey ring around light edges")
    args = parser.parse_args()

    image = Image.open(args.input).convert("RGB")
    if args.size and image.width > args.size:
        image = image.resize((args.size, round(image.height * args.size / image.width)), Image.LANCZOS)
    rgb = np.asarray(image).astype(np.float32)

    backdrop = BACKDROPS[args.backdrop](rgb)
    alpha, colour = build_alpha(rgb, backdrop, args.hole, args.backdrop == "checker", args.defringe)

    rgba = np.dstack([colour, alpha * 255.0]).round().astype(np.uint8)
    rgba = crop_to_content(rgba)

    Image.fromarray(rgba, "RGBA").save(args.output, optimize=True)
    print(f"saved {args.output} {rgba.shape[1]}x{rgba.shape[0]}")


if __name__ == "__main__":
    main()
