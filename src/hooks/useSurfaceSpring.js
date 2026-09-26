import { useEffect, useRef } from "react";
import { springStep } from "../lib/liquidPhysics";

export function useSurfaceSpring(ref, motion, elastic) {
  const controller = useRef(null);
  useEffect(() => {
    const element = ref.current;
    if (!motion || !elastic) return;
    let frame = 0;
    let previous = 0;
    let hover = false;
    let pressed = false;
    const scale = { value: 1, velocity: 0 };
    const lift = { value: 0, velocity: 0 };
    const render = (time) => {
      const dt = previous ? (time - previous) / 1000 : 1 / 60;
      previous = time;
      const target = pressed ? 0.982 : hover ? 1.014 : 1;
      springStep(scale, target, dt, 290, 18);
      springStep(lift, pressed ? 0 : hover ? -3 : 0, dt, 250, 21);
      element.style.setProperty("--surface-scale", scale.value.toFixed(5));
      element.style.setProperty("--surface-lift", `${lift.value.toFixed(3)}px`);
      if (
        Math.abs(scale.value - target) > 0.00005 ||
        Math.abs(scale.velocity) > 0.0001 ||
        Math.abs(lift.velocity) > 0.01
      )
        frame = requestAnimationFrame(render);
      else {
        frame = 0;
        previous = 0;
      }
    };
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    const release = () => {
      if (!pressed) return;
      pressed = false;
      // Preserve a visible compression/rebound even when a click is shorter than one frame.
      scale.value = Math.min(scale.value, 0.989);
      scale.velocity = 0.2;
      element.dataset.pressed = "false";
      wake();
    };
    controller.current = {
      enter(event) {
        hover = event.pointerType === "mouse";
        wake();
      },
      leave() {
        hover = false;
        wake();
      },
      down(event) {
        if (event.button !== 0) return;
        pressed = true;
        element.dataset.pressed = "true";
        wake();
      },
    };
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    window.addEventListener("blur", release);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      window.removeEventListener("blur", release);
      element.style.removeProperty("--surface-scale");
      element.style.removeProperty("--surface-lift");
      delete element.dataset.pressed;
      controller.current = null;
    };
  }, [ref, motion, elastic]);
  return {
    onPointerEnter: (event) => controller.current?.enter(event),
    onPointerLeave: () => controller.current?.leave(),
    onPointerDown: (event) => controller.current?.down(event),
  };
}
