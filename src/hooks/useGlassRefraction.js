import { useEffect } from "react";
import { surfaceDisplacement } from "../lib/glassRefraction.js";
import {
  prepareGlassMaterial,
  registerGlassRefraction,
} from "../lib/glassMaterial.js";

export function useGlassRefraction(
  surfaceRef,
  imageRef,
  filterRef,
  droplet = false,
) {
  useEffect(() => {
    const element = surfaceRef.current;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    let scheduled;
    let previousSize = "";
    let previousPaint = "";
    const unregister = registerGlassRefraction(element, (geometry) => {
      const paintKey = `${geometry.path}|${JSON.stringify(geometry.lens)}`;
      if (!context || paintKey === previousPaint) return;
      previousPaint = paintKey;
      // Reuse the low-resolution contour field and canvas. Only changed optics
      // uploads a lens map; no idle render loop or full-size texture allocation.
      const { pixels, width, height } = surfaceDisplacement(geometry);
      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;
      context.putImageData(new ImageData(pixels, width, height), 0, 0);
      const image = imageRef.current;
      const filter = filterRef.current;
      const { sx, sy } = geometry.field;
      // Field samples sit on grid vertices; put texture pixel centres on those
      // same vertices so the rim and its refraction cannot drift half a texel.
      image.setAttribute("x", -sx / 2);
      image.setAttribute("y", -sy / 2);
      image.setAttribute("width", geometry.width + sx);
      image.setAttribute("height", geometry.height + sy);
      filter.setAttribute("width", geometry.width);
      filter.setAttribute("height", geometry.height);
      filter
        .querySelector("feDisplacementMap")
        .setAttribute(
          "scale",
          Math.min(72, element.clientWidth * 0.7, element.clientHeight * 0.7),
        );
      image.setAttribute("href", canvas.toDataURL());
      element.dataset.refracting = "true";
    });
    const update = () => {
      const width = element.clientWidth;
      const height = element.clientHeight;
      const radius =
        parseFloat(getComputedStyle(element).borderTopLeftRadius) || 24;
      const size = `${width}:${height}:${radius}`;
      if (!width || !height || size === previousSize) return;
      previousSize = size;
      prepareGlassMaterial(
        element,
        width,
        height,
        radius,
        droplet
          ? {
              lens: {
                x: width / 2,
                y: height / 2,
                radius: Math.min(width, height) / 2,
              },
              step: 2,
            }
          : {},
      );
    };
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(scheduled);
      scheduled = requestAnimationFrame(update);
    });
    observer.observe(element);
    update();
    return () => {
      unregister();
      cancelAnimationFrame(scheduled);
      observer.disconnect();
      delete element.dataset.refracting;
    };
  }, [surfaceRef, imageRef, filterRef, droplet]);
}
