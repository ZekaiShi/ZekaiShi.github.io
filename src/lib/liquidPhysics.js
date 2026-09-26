export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

// Signed distance and outward normal of a rounded rectangle, including corners.
export function roundedRectContact(x, y, rect, radius) {
  const halfW = rect.width / 2;
  const halfH = rect.height / 2;
  const r = Math.min(radius, halfW, halfH);
  const dx = x - rect.left - halfW;
  const dy = y - rect.top - halfH;
  const qx = Math.abs(dx) - halfW + r;
  const qy = Math.abs(dy) - halfH + r;
  const ox = Math.max(qx, 0);
  const oy = Math.max(qy, 0);
  const outside = Math.hypot(ox, oy);
  const distance = outside + Math.min(Math.max(qx, qy), 0) - r;
  let nx;
  let ny;
  if (outside > 0.0001) {
    nx = (ox / outside) * Math.sign(dx);
    ny = (oy / outside) * Math.sign(dy);
  } else {
    nx = qx > qy ? Math.sign(dx) || 1 : 0;
    ny = qx > qy ? 0 : Math.sign(dy) || 1;
  }
  return { x: x - nx * distance, y: y - ny * distance, nx, ny, distance };
}

export function springStep(state, target, dt, stiffness = 240, damping = 22) {
  // Substeps keep a delayed frame or restored background tab from exploding.
  const duration = clamp(dt, 0, 0.04);
  const count = Math.max(1, Math.ceil(duration / 0.008));
  const step = duration / count;
  for (let i = 0; i < count; i++) {
    state.velocity +=
      ((target - state.value) * stiffness - state.velocity * damping) * step;
    state.value += state.velocity * step;
  }
  return state.value;
}
