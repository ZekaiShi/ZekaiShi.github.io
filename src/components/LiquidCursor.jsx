import { useEffect, useRef } from "react";
import GlassSurface from "./GlassSurface";
import { clamp, roundedRectContact, springStep } from "../lib/liquidPhysics";
import { createSurfaceTension } from "../lib/surfaceTension";

export default function LiquidCursor({ motion }) {
  const overlayRef = useRef(null);
  const positionRef = useRef(null);
  const hotspotRef = useRef(null);

  useEffect(() => {
    if (!motion) return;
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const contrast = window.matchMedia(
      "(prefers-contrast: more), (prefers-reduced-transparency: reduce)",
    );
    const overlay = overlayRef.current;
    const position = positionRef.current;
    const hotspot = hotspotRef.current;
    let targets = [
      ...document.querySelectorAll(".glass-surface:not(.liquid-drop)"),
    ];
    const tension = createSurfaceTension();
    const x = { value: 0, velocity: 0 };
    const y = { value: 0, velocity: 0 };
    const size = { value: 1, velocity: 0 };
    let pointer = { x: 0, y: 0 };
    let frame = 0;
    let previous = 0;
    let visible = false;
    let pressed = false;
    let dirty = true;
    let measurements = [];
    let mergedTarget = null;

    const reset = () => {
      visible = false;
      pressed = false;
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
      overlay.dataset.visible = "false";
      delete document.documentElement.dataset.liquidCursor;
      if (mergedTarget) delete mergedTarget.dataset.cursorMerged;
      mergedTarget = null;
      tension.reset();
    };
    const measure = () => {
      // Content updates / React hot replacement can swap card nodes without
      // remounting this overlay. Never keep a detached surface as the target.
      const current = [
        ...document.querySelectorAll(".glass-surface:not(.liquid-drop)"),
      ];
      targets.forEach((target) => {
        if (!current.includes(target)) observer.unobserve(target);
      });
      current.forEach((target) => {
        if (!targets.includes(target)) observer.observe(target);
      });
      targets = current;
      measurements = targets.map((element) => ({
        element,
        rect: element.getBoundingClientRect(),
        radius: parseFloat(getComputedStyle(element).borderTopLeftRadius) || 24,
      }));
      dirty = false;
    };
    const render = (time) => {
      if (!visible) {
        frame = 0;
        return;
      }
      const dt = previous ? (time - previous) / 1000 : 1 / 60;
      previous = time;
      if (dirty) measure();
      const insideTarget = document
        .elementFromPoint(pointer.x, pointer.y)
        ?.closest(".glass-surface:not(.liquid-drop)");
      const inside = Boolean(insideTarget);
      if (mergedTarget !== insideTarget) {
        if (mergedTarget) delete mergedTarget.dataset.cursorMerged;
        mergedTarget = insideTarget;
        if (mergedTarget) mergedTarget.dataset.cursorMerged = "true";
      }
      if (inside) {
        const bounds = insideTarget.getBoundingClientRect();
        insideTarget.style.setProperty(
          "--spot-x",
          `${((pointer.x - bounds.left) * (insideTarget.clientWidth + 2)) / bounds.width - 1}px`,
        );
        insideTarget.style.setProperty(
          "--spot-y",
          `${((pointer.y - bounds.top) * (insideTarget.clientHeight + 2)) / bounds.height - 1}px`,
        );
      }
      let nearest;
      let distance = 110;
      for (const item of measurements) {
        if (item.rect.bottom < 0 || item.rect.top > window.innerHeight)
          continue;
        if (insideTarget && item.element !== insideTarget) continue;
        const contact = roundedRectContact(
          pointer.x,
          pointer.y,
          item.rect,
          item.radius,
        );
        if (
          item.element === insideTarget ||
          Math.abs(contact.distance) < distance
        ) {
          distance = Math.abs(contact.distance);
          nearest = { ...contact, element: item.element, radius: item.radius };
        }
      }
      if (nearest) {
        const rect = nearest.element.getBoundingClientRect();
        nearest = {
          ...nearest,
          ...roundedRectContact(pointer.x, pointer.y, rect, nearest.radius),
        };
        if (!inside && Math.abs(nearest.distance) > 104) nearest = null;
      }
      const proximity = nearest
        ? clamp(1 - Math.abs(nearest.distance) / 104, 0, 1)
        : 0;
      const pull = inside ? 0 : proximity * 0.14;
      const targetX =
        pointer.x + ((nearest?.x ?? pointer.x) - pointer.x) * pull;
      const targetY =
        pointer.y + ((nearest?.y ?? pointer.y) - pointer.y) * pull;
      springStep(x, targetX, dt, 780, 42);
      springStep(y, targetY, dt, 780, 42);
      springStep(size, pressed ? 0.78 : 1, dt, 340, 17);
      const speed = Math.hypot(x.velocity, y.velocity);
      const stretch = clamp(speed / 2100, 0, 0.35);
      const angle = speed > 20 ? Math.atan2(y.velocity, x.velocity) : 0;
      position.style.transform = `translate3d(${x.value.toFixed(2)}px,${y.value.toFixed(2)}px,0) rotate(${angle.toFixed(3)}rad) scale(${(size.value * (1 + stretch)).toFixed(3)},${(size.value / (1 + stretch * 0.58)).toFixed(3)})`;
      hotspot.style.transform = `translate3d(${pointer.x}px,${pointer.y}px,0)`;
      const surface = tension.render(
        nearest,
        {
          x: inside ? pointer.x : x.value,
          y: inside ? pointer.y : y.value,
          radius: 17 * size.value,
        },
        dt,
      );
      // The shared contour now contains the droplet. Never draw a second circle on top.
      position.style.opacity = surface.drawn || inside ? "0" : "1";
      hotspot.style.opacity = inside ? "0" : "1";
      overlay.dataset.state = inside
        ? "merged"
        : pressed
          ? "pressed"
          : surface.drawn
            ? "tension"
            : "free";
      const moving =
        speed > 0.25 ||
        Math.abs(x.value - targetX) > 0.05 ||
        Math.abs(y.value - targetY) > 0.05 ||
        Math.abs(size.velocity) > 0.002 ||
        surface.moving;
      if (moving) frame = requestAnimationFrame(render);
      else {
        frame = 0;
        previous = 0;
      }
    };
    const wake = () => {
      if (visible && !frame) frame = requestAnimationFrame(render);
    };
    const move = (event) => {
      if (
        !media.matches ||
        contrast.matches ||
        event.pointerType !== "mouse" ||
        event.target.closest?.('input, textarea, [contenteditable="true"]')
      ) {
        reset();
        return;
      }
      pointer = { x: event.clientX, y: event.clientY };
      if (!visible) {
        x.value = pointer.x;
        y.value = pointer.y;
        x.velocity = 0;
        y.velocity = 0;
        visible = true;
        dirty = true;
        overlay.dataset.visible = "true";
        document.documentElement.dataset.liquidCursor = "true";
      }
      wake();
    };
    const down = (event) => {
      if (event.pointerType !== "mouse") {
        reset();
        return;
      }
      if (event.button === 0 && visible) {
        pressed = true;
        wake();
      }
    };
    const up = () => {
      if (pressed) {
        size.value = Math.min(size.value, 0.86);
        size.velocity = 2.4;
      }
      pressed = false;
      wake();
    };
    const leave = (event) => {
      if (!event.relatedTarget) reset();
    };
    const keyboard = (event) => {
      if (event.key === "Tab") reset();
    };
    const relayout = () => {
      dirty = true;
      wake();
    };
    const visibility = () => {
      if (document.hidden) reset();
    };
    const observer = new ResizeObserver(relayout);
    targets.forEach((target) => observer.observe(target));
    const contentObserver = new MutationObserver(relayout);
    contentObserver.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", reset);
    window.addEventListener("pointerout", leave);
    window.addEventListener("blur", reset);
    window.addEventListener("keydown", keyboard);
    window.addEventListener("scroll", relayout, { passive: true });
    window.addEventListener("resize", relayout);
    document.addEventListener("visibilitychange", visibility);
    media.addEventListener("change", reset);
    contrast.addEventListener("change", reset);
    return () => {
      reset();
      observer.disconnect();
      contentObserver.disconnect();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", reset);
      window.removeEventListener("pointerout", leave);
      window.removeEventListener("blur", reset);
      window.removeEventListener("keydown", keyboard);
      window.removeEventListener("scroll", relayout);
      window.removeEventListener("resize", relayout);
      document.removeEventListener("visibilitychange", visibility);
      media.removeEventListener("change", reset);
      contrast.removeEventListener("change", reset);
    };
  }, [motion]);

  return (
    <div
      className="liquid-cursor"
      ref={overlayRef}
      data-visible="false"
      aria-hidden="true"
    >
      <div className="liquid-drop-position" ref={positionRef}>
        <GlassSurface className="liquid-drop" droplet motion={false} />
      </div>
      <span className="liquid-hotspot" ref={hotspotRef} />
    </div>
  );
}
