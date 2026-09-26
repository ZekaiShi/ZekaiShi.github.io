import { useId, useRef } from "react";
import { useGlassRefraction } from "../hooks/useGlassRefraction";
import { useSurfaceSpring } from "../hooks/useSurfaceSpring";
import { SURFACE_MARGIN } from "../lib/liquidSurface.js";

// Refraction is limited to the backdrop; content never passes through the lens.
export default function GlassSurface({
  as: Element = "div",
  className = "",
  motion = true,
  elastic = false,
  droplet = false,
  children,
  ...props
}) {
  const ref = useRef(null);
  const imageRef = useRef(null);
  const filterRef = useRef(null);
  const filterId = `glass-${useId().replace(/:/g, "")}`;
  useGlassRefraction(ref, imageRef, filterRef, droplet);
  const springEvents = useSurfaceSpring(ref, motion, elastic);
  const onPointerMove = (event) => {
    if (!motion || event.pointerType !== "mouse") return;
    const bounds = ref.current.getBoundingClientRect();
    ref.current.style.setProperty(
      "--spot-x",
      `${((event.clientX - bounds.left) * (ref.current.clientWidth + 2)) / bounds.width - 1}px`,
    );
    ref.current.style.setProperty(
      "--spot-y",
      `${((event.clientY - bounds.top) * (ref.current.clientHeight + 2)) / bounds.height - 1}px`,
    );
  };
  return (
    <Element
      {...props}
      ref={ref}
      {...springEvents}
      onPointerMove={onPointerMove}
      data-liquid-elastic={elastic || undefined}
      data-glass-droplet={droplet || undefined}
      className={`glass-surface ${className}`}
      style={{ ...props.style, "--surface-margin": `${SURFACE_MARGIN}px` }}
    >
      <svg
        className="glass-filter-definitions"
        aria-hidden="true"
        width="0"
        height="0"
        focusable="false"
      >
        <defs>
          <filter
            ref={filterRef}
            id={filterId}
            x="0"
            y="0"
            width="1"
            height="1"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feImage
              ref={imageRef}
              x="0"
              y="0"
              width="1"
              height="1"
              preserveAspectRatio="none"
              result="lens"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="lens"
              scale="54"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <span className="glass-tension" aria-hidden="true">
        <span
          className="tension-fill"
          style={{ "--refraction-filter": `url(#${filterId})` }}
        />
        <span className="tension-glow" />
        <svg
          className="tension-rim"
          width="100%"
          height="100%"
          focusable="false"
        >
          <defs>
            <linearGradient
              id={`${filterId}-rim`}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="var(--glass-rim)" stopOpacity=".8" />
              <stop
                offset=".28"
                stopColor="var(--glass-rim)"
                stopOpacity=".18"
              />
              <stop
                offset=".55"
                stopColor="var(--glass-bottom)"
                stopOpacity=".7"
              />
              <stop
                offset=".78"
                stopColor="var(--glass-rim)"
                stopOpacity=".4"
              />
              <stop offset="1" stopColor="var(--glass-rim)" stopOpacity=".16" />
            </linearGradient>
          </defs>
          <path className="tension-rim-shadow" />
          <path
            className="tension-rim-light"
            stroke={`url(#${filterId}-rim)`}
          />
        </svg>
      </span>
      <span className="glass-relief-layer" aria-hidden="true">
        <span className="glass-pointer-relief" />
      </span>
      {children}
    </Element>
  );
}
