import { useEffect, useRef } from "react";

export default function Atmosphere({ motion, theme }) {
  const canvasRef = useRef(null);
  const fieldRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;
    let frame;
    let width;
    let height;
    let lastFrame = 0;
    const points = Array.from({ length: 42 }, (_, i) => ({
      x: ((i * 137.508) % 997) / 997,
      y: ((i * 271.83) % 991) / 991,
      phase: i * 0.8,
    }));
    const draw = (time = 0) => {
      context.clearRect(0, 0, width, height);
      context.fillStyle = theme === "light" ? "#416f51" : "#bba6ff";
      context.strokeStyle = theme === "light" ? "#416f51" : "#9684e6";
      const positions = points.map((point) => ({
        x: point.x * width + Math.sin(time * 0.00012 + point.phase) * 12,
        y: point.y * height + Math.cos(time * 0.0001 + point.phase) * 14,
      }));
      positions.forEach((point, i) => {
        context.globalAlpha = 0.38;
        context.beginPath();
        context.arc(point.x, point.y, i % 4 === 0 ? 1.8 : 1, 0, Math.PI * 2);
        context.fill();
        for (let j = i + 1; j < positions.length; j++) {
          const other = positions[j];
          const distance = Math.hypot(point.x - other.x, point.y - other.y);
          if (distance > 155) continue;
          context.globalAlpha = (1 - distance / 155) * 0.2;
          context.beginPath();
          context.moveTo(point.x, point.y);
          context.lineTo(other.x, other.y);
          context.stroke();
        }
      });
    };
    const tick = (time) => {
      if (time - lastFrame >= 40) {
        draw(time);
        lastFrame = time;
      }
      frame = requestAnimationFrame(tick);
    };
    const resize = () => {
      width = window.innerWidth;
      height = Math.min(window.innerHeight, 1100);
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw();
    };
    const visibility = () => {
      cancelAnimationFrame(frame);
      if (motion && !document.hidden) frame = requestAnimationFrame(tick);
    };
    resize();
    visibility();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [motion, theme]);

  useEffect(() => {
    if (!motion || !window.matchMedia("(pointer: fine)").matches) return;
    const pointerMove = (event) => {
      fieldRef.current?.style.setProperty("--pointer-x", `${event.clientX}px`);
      fieldRef.current?.style.setProperty("--pointer-y", `${event.clientY}px`);
    };
    window.addEventListener("pointermove", pointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", pointerMove);
  }, [motion]);
  return (
    <div className="atmosphere" ref={fieldRef} aria-hidden="true">
      <div className="ambient-orb orb-one" />
      <div className="ambient-orb orb-two" />
      <div className="ambient-orb orb-three" />
      <div className="ambient-grid" />
      <canvas ref={canvasRef} />
      <div className="pointer-glow" />
      <div className="ambient-wordmark">GEO_LAB</div>
    </div>
  );
}
