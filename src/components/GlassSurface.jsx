import { useRef } from "react";

// Only the material highlight follows the pointer; text remains stationary.
export default function GlassSurface({
  as: Element = "div",
  className = "",
  motion = true,
  children,
  ...props
}) {
  const ref = useRef(null);
  const onPointerMove = (event) => {
    if (!motion || event.pointerType !== "mouse") return;
    const bounds = ref.current.getBoundingClientRect();
    ref.current.style.setProperty(
      "--spot-x",
      `${event.clientX - bounds.left}px`,
    );
    ref.current.style.setProperty(
      "--spot-y",
      `${event.clientY - bounds.top}px`,
    );
  };
  return (
    <Element
      {...props}
      ref={ref}
      onPointerMove={onPointerMove}
      className={`glass-surface ${className}`}
    >
      {children}
    </Element>
  );
}
