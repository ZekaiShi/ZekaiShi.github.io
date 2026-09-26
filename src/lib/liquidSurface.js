import { clamp } from "./liquidPhysics.js";

// Accommodate the 104px interaction reach, drop radius and the outward tension.
export const SURFACE_MARGIN = 144;

export function roundedBoxDistance(x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  const dx = Math.abs(x - width / 2) - width / 2 + r;
  const dy = Math.abs(y - height / 2) - height / 2 + r;
  return (
    Math.hypot(Math.max(dx, 0), Math.max(dy, 0)) +
    Math.min(Math.max(dx, dy), 0) -
    r
  );
}

export function smoothUnion(a, b, amount) {
  if (amount <= 0.001) return Math.min(a, b);
  const h = Math.max(amount - Math.abs(a - b), 0) / amount;
  return Math.min(a, b) - h * h * amount * 0.25;
}

// A shared distance field changes the card silhouette itself, not just the cursor.
// Marching squares preserves separate droplets before/after the liquid neck breaks.
export function liquidSurfaceOutline({
  width,
  height,
  radius,
  contact,
  bulge = 0,
  drop = null,
  blend = 0,
  lens = null,
  step = 6,
}) {
  const margin = SURFACE_MARGIN;
  const totalWidth = width + margin * 2;
  const totalHeight = height + margin * 2;
  const cols = Math.ceil(totalWidth / step);
  const rows = Math.ceil(totalHeight / step);
  const sx = totalWidth / cols;
  const sy = totalHeight / rows;
  const field = (px, py) => {
    const x = px - margin;
    const y = py - margin;
    let card = roundedBoxDistance(x, y, width, height, radius);
    if (contact && Math.abs(bulge) > 0.001) {
      const dx = x - contact.x;
      const dy = y - contact.y;
      card -= bulge * Math.exp(-(dx * dx + dy * dy) / (2 * 34 * 34));
    }
    return drop
      ? smoothUnion(
          card,
          Math.hypot(x - drop.x, y - drop.y) - drop.radius,
          blend,
        )
      : card;
  };
  const values = new Float32Array((cols + 1) * (rows + 1));
  for (let y = 0; y <= rows; y++) {
    for (let x = 0; x <= cols; x++)
      values[y * (cols + 1) + x] = field(x * sx, y * sy);
  }
  const nodes = new Map();
  const patterns = [
    [],
    [3, 0],
    [0, 1],
    [3, 1],
    [1, 2],
    [],
    [0, 2],
    [3, 2],
    [2, 3],
    [0, 2],
    [],
    [1, 2],
    [3, 1],
    [0, 1],
    [3, 0],
    [],
  ];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = y * (cols + 1) + x;
      const v = [
        values[i],
        values[i + 1],
        values[i + cols + 2],
        values[i + cols + 1],
      ];
      const code =
        (v[0] < 0 ? 1 : 0) |
        (v[1] < 0 ? 2 : 0) |
        (v[2] < 0 ? 4 : 0) |
        (v[3] < 0 ? 8 : 0);
      if (code === 0 || code === 15) continue;
      let pairs = patterns[code];
      if (code === 5 || code === 10) {
        const centerInside = field((x + 0.5) * sx, (y + 0.5) * sy) < 0;
        pairs = (code === 5) === centerInside ? [0, 1, 2, 3] : [3, 0, 1, 2];
      }
      const edge = (side) => {
        const corners = [
          [0, 1],
          [1, 2],
          [3, 2],
          [0, 3],
        ][side];
        const a = v[corners[0]];
        const b = v[corners[1]];
        const t = clamp(a / (a - b), 0, 1);
        const horizontal = side === 0 || side === 2;
        const ex = x + (side === 1 ? 1 : 0);
        const ey = y + (side === 2 ? 1 : 0);
        const key = `${horizontal ? "h" : "v"}${ex}:${ey}`;
        if (!nodes.has(key))
          nodes.set(key, {
            point: {
              x: (ex + (horizontal ? t : 0)) * sx,
              y: (ey + (horizontal ? 0 : t)) * sy,
            },
            adjacent: [],
          });
        return key;
      };
      for (let p = 0; p < pairs.length; p += 2) {
        const a = edge(pairs[p]);
        const b = edge(pairs[p + 1]);
        nodes.get(a).adjacent.push(b);
        nodes.get(b).adjacent.push(a);
      }
    }
  }
  const visited = new Set();
  const contours = [];
  for (const start of nodes.keys()) {
    if (visited.has(start)) continue;
    const points = [];
    let current = start;
    let previous;
    while (current && !visited.has(current)) {
      visited.add(current);
      const node = nodes.get(current);
      points.push(node.point);
      const next = node.adjacent.find((key) => key !== previous);
      previous = current;
      current = next;
    }
    // Never close an outline cut by the sampling boundary with an artificial straight edge.
    if (points.length > 3 && current === start) contours.push(points);
  }
  const number = (value) => value.toFixed(2);
  const paths = contours.map((points) => {
    const mid = (a, b) =>
      `${number((a.x + b.x) / 2)},${number((a.y + b.y) / 2)}`;
    let d = `M${mid(points.at(-1), points[0])}`;
    points.forEach((point, index) => {
      d += `Q${number(point.x)},${number(point.y)} ${mid(point, points[(index + 1) % points.length])}`;
    });
    return `${d}Z`;
  });
  return {
    path: paths.join(""),
    contours,
    width: totalWidth,
    height: totalHeight,
    // Reuse the exact silhouette field for the optical layer, including the neck/drop.
    field: { values, cols, rows, sx, sy },
    rim: Math.min(26, height / 3),
    lens,
  };
}
