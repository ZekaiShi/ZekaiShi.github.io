import { liquidSurfaceOutline } from "./liquidSurface.js";
import { clamp, springStep } from "./liquidPhysics.js";
import {
  dropFitsSurface,
  paintGlassOutline,
  restoreGlassMaterial,
} from "./glassMaterial.js";

// Only the material stretches. Text, layout and native hit targets stay unchanged.
export function createSurfaceTension() {
  const surfaces = new Map();
  const clear = (state) => {
    delete state.element.dataset.tensionActive;
    delete state.element.dataset.tensionBulge;
    delete state.element.dataset.tensionContours;
    delete state.element.dataset.tensionPointer;
    restoreGlassMaterial(state.element);
  };
  return {
    reset() {
      surfaces.forEach(clear);
      surfaces.clear();
    },
    render(target, drop, dt) {
      const element = target?.element;
      if (element && !surfaces.has(element)) {
        const plane = element.querySelector(".glass-tension");
        surfaces.set(element, {
          element,
          plane,
          bulge: { value: 0, velocity: 0 },
          blend: { value: 0, velocity: 0 },
          contact: { x: 0, y: 0 },
          connected: false,
        });
      }
      let drawn = false;
      let moving = false;
      for (const [key, state] of surfaces) {
        const selected = key === element;
        const bounds = state.element.getBoundingClientRect();
        const width = state.element.clientWidth;
        const height = state.element.clientHeight;
        const scaleX = bounds.width / (width + 2);
        const scaleY = bounds.height / (height + 2);
        const radius =
          parseFloat(getComputedStyle(state.element).borderTopLeftRadius) || 28;
        if (selected) {
          state.contact = {
            x: (target.x - bounds.left) / scaleX - 1,
            y: (target.y - bounds.top) / scaleY - 1,
          };
          if (target.distance < 44) state.connected = true;
          if (target.distance > 78) state.connected = false;
        }
        const reach = selected
          ? clamp(1 - Math.abs(target.distance) / 104, 0, 1)
          : 0;
        const pull = selected ? 9 * Math.pow(reach, 0.8) : 0;
        springStep(state.bulge, pull, dt, 240, 16);
        springStep(
          state.blend,
          selected ? (state.connected ? 96 : 70) : 0,
          dt,
          300,
          26,
        );
        const unsettled =
          Math.abs(state.bulge.velocity) > 0.025 ||
          Math.abs(state.bulge.value - pull) > 0.02 ||
          Math.abs(state.blend.velocity) > 0.025;
        moving ||= unsettled;
        if (!selected && Math.abs(state.bulge.value) < 0.025 && !unsettled) {
          clear(state);
          surfaces.delete(key);
          continue;
        }
        const localDrop = selected
          ? {
              x: (drop.x - bounds.left) / scaleX - 1,
              y: (drop.y - bounds.top) / scaleY - 1,
              radius: drop.radius / ((scaleX + scaleY) / 2),
            }
          : null;
        const includeDrop =
          localDrop && dropFitsSurface(localDrop, width, height);
        if (includeDrop) {
          state.element.dataset.tensionPointer = "true";
          state.element.style.setProperty("--spot-x", `${localDrop.x}px`);
          state.element.style.setProperty("--spot-y", `${localDrop.y}px`);
        } else {
          delete state.element.dataset.tensionPointer;
        }
        const geometry = liquidSurfaceOutline({
          width,
          height,
          radius,
          contact: state.contact,
          bulge: state.bulge.value,
          drop: includeDrop ? localDrop : null,
          blend: Math.max(0, state.blend.value),
          lens: includeDrop
            ? { ...localDrop, radius: localDrop.radius * 1.5 }
            : null,
        });
        paintGlassOutline(state.element, geometry);
        state.element.dataset.tensionActive = "true";
        state.element.dataset.tensionBulge = state.bulge.value.toFixed(2);
        state.element.dataset.tensionContours = String(
          geometry.contours.length,
        );
        if (selected && includeDrop) drawn = true;
      }
      return { drawn, moving };
    },
  };
}
