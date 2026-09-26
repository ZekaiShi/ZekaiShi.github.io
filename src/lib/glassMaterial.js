import { liquidSurfaceOutline, SURFACE_MARGIN } from "./liquidSurface.js";

const restingShapes = new WeakMap();
const refractionPainters = new WeakMap();

export function registerGlassRefraction(element, paint) {
  refractionPainters.set(element, paint);
  return () => refractionPainters.delete(element);
}

// Resting, stretched and separated states all paint the same material nodes.
export function paintGlassOutline(element, geometry) {
  const plane = element.querySelector(".glass-tension");
  if (!plane) return;
  // Inherit one outline in the fill, glow and foreground relief clipping planes.
  element.style.setProperty("--tension-clip", `path("${geometry.path}")`);
  const outline = plane.querySelector("svg");
  outline.setAttribute("viewBox", `0 0 ${geometry.width} ${geometry.height}`);
  plane
    .querySelectorAll(".tension-rim path")
    .forEach((path) => path.setAttribute("d", geometry.path));
  refractionPainters.get(element)?.(geometry);
}

export function prepareGlassMaterial(
  element,
  width,
  height,
  radius,
  optics = {},
) {
  const plane = element.querySelector(".glass-tension");
  if (!plane) return;
  const geometry = liquidSurfaceOutline({ width, height, radius, ...optics });
  restingShapes.set(element, geometry);
  // Anchor light to the original surface, not the moving union's bounding box.
  const light = plane.querySelector("linearGradient");
  light.setAttribute("x1", SURFACE_MARGIN);
  light.setAttribute("y1", SURFACE_MARGIN);
  light.setAttribute("x2", SURFACE_MARGIN + width);
  light.setAttribute("y2", SURFACE_MARGIN + height);
  element.style.setProperty("--material-width", `${width}px`);
  element.style.setProperty("--material-height", `${height}px`);
  if (!element.dataset.tensionActive) paintGlassOutline(element, geometry);
}

export function restoreGlassMaterial(element) {
  const geometry = restingShapes.get(element);
  if (geometry) paintGlassOutline(element, geometry);
}

export function dropFitsSurface(drop, width, height) {
  const reach = drop.radius + 4;
  return (
    drop.x - reach > -SURFACE_MARGIN &&
    drop.y - reach > -SURFACE_MARGIN &&
    drop.x + reach < width + SURFACE_MARGIN &&
    drop.y + reach < height + SURFACE_MARGIN
  );
}
