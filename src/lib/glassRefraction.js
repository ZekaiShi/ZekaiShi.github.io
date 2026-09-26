import { clamp } from "./liquidPhysics.js";
import { SURFACE_MARGIN } from "./liquidSurface.js";

// The normals belong to the current liquid boundary, never to the old rectangle.
export function surfaceDisplacement(geometry) {
  const { values, cols, rows, sx, sy } = geometry.field;
  const width = cols + 1;
  const height = rows + 1;
  const pixels = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const left = Math.max(0, x - 1);
      const right = Math.min(cols, x + 1);
      const top = Math.max(0, y - 1);
      const bottom = Math.min(rows, y + 1);
      const dx =
        (values[y * width + right] - values[y * width + left]) /
        ((right - left) * sx);
      const dy =
        (values[bottom * width + x] - values[top * width + x]) /
        ((bottom - top) * sy);
      const length = Math.hypot(dx, dy);
      const depth = Math.max(0, -values[i]);
      const t = clamp(depth / geometry.rim, 0, 1);
      // Extend the normal by one texel outside the clip to avoid a neutral-map seam
      // when the browser interpolates samples at the exact curved edge.
      const strength =
        values[i] < Math.max(sx, sy) && depth < geometry.rim
          ? Math.pow(1 - t, 1.6) * (0.65 + Math.sin(t * Math.PI) * 0.45)
          : 0;
      let bendX = (length > 0.0001 ? dx / length : 0) * strength;
      let bendY = (length > 0.0001 ? dy / length : 0) * strength;
      // A travelling convex bump survives absorption into the card. Its optical
      // curvature is independent of the silhouette, so it never becomes a ring.
      if (geometry.lens) {
        const lensX =
          (x * sx - SURFACE_MARGIN - geometry.lens.x) / geometry.lens.radius;
        const lensY =
          (y * sy - SURFACE_MARGIN - geometry.lens.y) / geometry.lens.radius;
        const r2 = lensX * lensX + lensY * lensY;
        const convex = r2 < 1 ? Math.pow(1 - r2, 1.25) * 1.35 : 0;
        bendX += lensX * convex;
        bendY += lensY * convex;
      }
      pixels[i * 4] = 128 - clamp(bendX, -1, 1) * 120;
      pixels[i * 4 + 1] = 128 - clamp(bendY, -1, 1) * 120;
      pixels[i * 4 + 2] = 128;
      pixels[i * 4 + 3] = 255;
    }
  }
  return { pixels, width, height };
}
