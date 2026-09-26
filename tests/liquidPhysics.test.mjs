import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import postcss from "postcss";
import {
  dropFitsSurface,
  paintGlassOutline,
  prepareGlassMaterial,
  registerGlassRefraction,
  restoreGlassMaterial,
} from "../src/lib/glassMaterial.js";
import {
  liquidSurfaceOutline,
  SURFACE_MARGIN,
  smoothUnion,
} from "../src/lib/liquidSurface.js";
import { roundedRectContact, springStep } from "../src/lib/liquidPhysics.js";
import { surfaceDisplacement } from "../src/lib/glassRefraction.js";

test("magnet contact follows straight edges and rounded corners", () => {
  const rect = { left: 10, top: 20, width: 200, height: 100 };
  const left = roundedRectContact(0, 70, rect, 20);
  assert.deepEqual(left, { x: 10, y: 70, nx: -1, ny: 0, distance: 10 });
  const inside = roundedRectContact(110, 30, rect, 20);
  assert.equal(inside.distance, -10);
  assert.equal(inside.y, 20);
  const corner = roundedRectContact(10, 20, rect, 20);
  assert.ok(Math.abs(corner.distance - (Math.sqrt(800) - 20)) < 1e-9);
  assert.ok(corner.x > 10 && corner.y > 20);
});

test("refraction is neutral in the center and bends opposite edges oppositely", () => {
  const geometry = liquidSurfaceOutline({
    width: 120,
    height: 80,
    radius: 16,
    step: 3,
  });
  const map = surfaceDisplacement(geometry);
  const channel = (x, y, c) => channelAt(geometry, map, x, y, c);
  assert.equal(channel(60, 40, 0), 128);
  assert.equal(channel(60, 40, 1), 128);
  assert.ok(channel(60, 3, 1) > 128);
  assert.ok(channel(60, 76, 1) < 128);
  assert.ok(channel(3, 40, 0) > 128);
  assert.ok(channel(116, 40, 0) < 128);
});

test("click spring overshoots and settles without exploding after a delayed frame", () => {
  const state = { value: 0.982, velocity: 0 };
  const values = [];
  for (let i = 0; i < 180; i++)
    values.push(springStep(state, 1.014, i === 5 ? 3 : 1 / 60, 290, 18));
  assert.ok(Math.max(...values) > 1.014);
  assert.ok(
    values.every(
      (value) => Number.isFinite(value) && value > 0.95 && value < 1.08,
    ),
  );
  assert.ok(Math.abs(state.value - 1.014) < 0.0001);
});

test("the card edge recoils inward after release and settles flat", () => {
  const state = { value: 9, velocity: 0 };
  const values = [];
  for (let i = 0; i < 180; i++)
    values.push(springStep(state, 0, 1 / 60, 240, 16));
  assert.ok(Math.min(...values) < -0.3);
  assert.ok(Math.abs(state.value) < 0.001);
});

const surface = {
  width: 300,
  height: 180,
  radius: 28,
  contact: { x: 0, y: 90 },
  step: 4,
};
test("surface tension pulls the card outline outward, not only the drop", () => {
  const resting = liquidSurfaceOutline(surface);
  const pulled = liquidSurfaceOutline({ ...surface, bulge: 12 });
  const minX = (shape) => Math.min(...shape.contours.flat().map((p) => p.x));
  assert.ok(Math.abs(minX(resting) - SURFACE_MARGIN) < 0.2);
  assert.ok(minX(pulled) < SURFACE_MARGIN - 10);
  assert.equal(pulled.contours.length, 1);
});

test("a shared contour connects nearby liquid and separates stretched liquid", () => {
  const near = liquidSurfaceOutline({
    ...surface,
    bulge: 7,
    blend: 80,
    drop: { x: -35, y: 90, radius: 17 },
  });
  const far = liquidSurfaceOutline({
    ...surface,
    bulge: 2,
    blend: 70,
    drop: { x: -85, y: 90, radius: 17 },
  });
  const absorbed = liquidSurfaceOutline({
    ...surface,
    blend: 80,
    drop: { x: 90, y: 90, radius: 17 },
  });
  assert.equal(near.contours.length, 1);
  assert.equal(far.contours.length, 2);
  assert.equal(absorbed.contours.length, 1);
  assert.ok(!near.path.includes("NaN") && !far.path.includes("NaN"));
});

test("the shared outline handles rounded corners and zero-blend fallback", () => {
  const corner = liquidSurfaceOutline({
    ...surface,
    contact: { x: 8, y: 8 },
    bulge: 8,
    blend: 80,
    drop: { x: -12, y: -12, radius: 17 },
  });
  assert.equal(corner.contours.length, 1);
  assert.ok(corner.path.endsWith("Z"));
  assert.equal(smoothUnion(3, 7, 0), 3);
  assert.ok(smoothUnion(3, 3, 40) < 0);
});

test("drops at the interaction limit stay closed and are not cut into a box", () => {
  const drop = { x: -104, y: 90, radius: 19 };
  const result = liquidSurfaceOutline({ ...surface, drop, blend: 70 });
  assert.equal(dropFitsSurface(drop, surface.width, surface.height), true);
  assert.equal(result.contours.length, 2);
  assert.ok(
    result.contours
      .flat()
      .every(
        (p) =>
          p.x > 1 &&
          p.y > 1 &&
          p.x < result.width - 1 &&
          p.y < result.height - 1,
      ),
  );
  assert.equal(
    dropFitsSurface({ ...drop, x: -180 }, surface.width, surface.height),
    false,
  );
});

test("a clipped contour never receives an artificial straight closing edge", () => {
  const clipped = liquidSurfaceOutline({
    ...surface,
    drop: { x: -SURFACE_MARGIN, y: 90, radius: 17 },
    blend: 0,
  });
  assert.equal(clipped.contours.length, 1);
  assert.ok(
    Math.min(...clipped.contours.flat().map((p) => p.x)) >=
      SURFACE_MARGIN - 0.1,
  );
});

test("rest and fusion use identical paint nodes and restore the exact resting outline", () => {
  const node = () => ({
    attributes: {},
    setAttribute(name, value) {
      this.attributes[name] = value;
    },
  });
  const outline = node();
  const light = node();
  const paths = [node(), node()];
  const style = {
    values: {},
    setProperty(name, value) {
      this.values[name] = value;
    },
  };
  const plane = {
    style,
    querySelector: (selector) => (selector === "svg" ? outline : light),
    querySelectorAll: () => paths,
  };
  const element = { dataset: {}, style, querySelector: () => plane };
  const painted = [];
  const unregister = registerGlassRefraction(element, (geometry) =>
    painted.push(geometry.path),
  );
  prepareGlassMaterial(element, surface.width, surface.height, surface.radius);
  const restingPath = paths[0].attributes.d;
  const fixedLighting = { ...light.attributes };
  paintGlassOutline(
    element,
    liquidSurfaceOutline({
      ...surface,
      bulge: 8,
      blend: 80,
      drop: { x: -35, y: 90, radius: 17 },
    }),
  );
  assert.notEqual(paths[0].attributes.d, restingPath);
  assert.deepEqual(light.attributes, fixedLighting);
  restoreGlassMaterial(element);
  assert.equal(paths[0].attributes.d, restingPath);
  assert.equal(paths[1].attributes.d, restingPath);
  assert.equal(style.values["--tension-clip"], `path("${restingPath}")`);
  assert.deepEqual(painted, [restingPath, painted[1], restingPath]);
  assert.notEqual(painted[1], restingPath);
  unregister();
  restoreGlassMaterial(element);
  assert.equal(painted.length, 3);
});

function channelAt(geometry, map, x, y, channel = 0) {
  const column = Math.round((x + SURFACE_MARGIN) / geometry.field.sx);
  const row = Math.round((y + SURFACE_MARGIN) / geometry.field.sy);
  return map.pixels[(row * map.width + column) * 4 + channel];
}

test("refraction moves to the liquid edge and leaves no lens at the old rectangle", () => {
  const resting = liquidSurfaceOutline(surface);
  const pulled = liquidSurfaceOutline({
    ...surface,
    bulge: 9,
    blend: 96,
    drop: { x: -30, y: 90, radius: 17 },
  });
  const restMap = surfaceDisplacement(resting);
  const pulledMap = surfaceDisplacement(pulled);
  assert.ok(channelAt(resting, restMap, 2, 90) > 180);
  assert.ok(Math.abs(channelAt(pulled, pulledMap, 2, 90) - 128) <= 2);
  assert.ok(channelAt(pulled, pulledMap, -44, 90) > 170);
  assert.equal(channelAt(resting, restMap, -44, 90), 128);
  assert.equal(channelAt(pulled, pulledMap, 150, 90), 128);
  assert.equal(channelAt(pulled, pulledMap, 150, 90, 1), 128);
});

test("refraction covers every contour and returns to the same resting map", () => {
  for (const distance of [30, 85, 104]) {
    const geometry = liquidSurfaceOutline({
      ...surface,
      drop: { x: -distance, y: 90, radius: 17 },
      blend: 70,
    });
    const map = surfaceDisplacement(geometry);
    assert.equal(map.width, geometry.field.cols + 1);
    assert.equal(map.height, geometry.field.rows + 1);
    assert.equal(map.pixels.length, map.width * map.height * 4);
    assert.ok(channelAt(geometry, map, -distance - 13, 90) > 160);
    assert.ok(channelAt(geometry, map, 298, 90) < 90);
  }
  const before = surfaceDisplacement(liquidSurfaceOutline(surface));
  const after = surfaceDisplacement(
    liquidSurfaceOutline({ ...surface, bulge: 0, blend: 0 }),
  );
  assert.deepEqual(before.pixels, after.pixels);
});

test("all painted material layers share one clip without an old rectangular background", () => {
  const css = postcss.parse(
    readFileSync(new URL("../src/index.css", import.meta.url), "utf8"),
  );
  const shared = new Set();
  let fills = 0;
  css.walkRules((rule) => {
    assert.ok(!rule.selector.includes(".glass-surface::after"));
    assert.ok(!rule.selector.includes(".glass-refraction"));
    assert.ok(!rule.selector.includes(".glass-material"));
    if (
      rule.nodes.some(
        (node) =>
          node.prop === "clip-path" && node.value.includes("--tension-clip"),
      )
    )
      rule.selectors.forEach((selector) => shared.add(selector));
    if (rule.selector === ".tension-fill" && rule.parent.type === "root") {
      fills++;
      assert.ok(
        !rule.nodes.some((node) =>
          ["background-size", "background-position"].includes(node.prop),
        ),
      );
    }
  });
  assert.equal(fills, 1);
  for (const selector of [
    ".tension-fill",
    ".tension-glow",
    ".glass-relief-layer",
  ])
    assert.ok(shared.has(selector));
});

test("the merged pointer keeps a convex lens even when the card outline is unchanged", () => {
  const resting = liquidSurfaceOutline(surface);
  const first = liquidSurfaceOutline({
    ...surface,
    lens: { x: 140, y: 90, radius: 25 },
  });
  const next = liquidSurfaceOutline({
    ...surface,
    lens: { x: 190, y: 90, radius: 25 },
  });
  assert.equal(first.path, resting.path);
  assert.equal(next.path, resting.path);
  const firstMap = surfaceDisplacement(first);
  const nextMap = surfaceDisplacement(next);
  assert.ok(channelAt(first, firstMap, 130, 90) > 150);
  assert.ok(channelAt(first, firstMap, 150, 90) < 106);
  assert.equal(channelAt(next, nextMap, 130, 90), 128);
  assert.ok(channelAt(next, nextMap, 180, 90) > 150);
  assert.notDeepEqual(firstMap.pixels, nextMap.pixels);
});

test("a standalone droplet has a convex lens, not only an edge outline", () => {
  const flat = liquidSurfaceOutline({
    width: 32,
    height: 32,
    radius: 16,
    step: 2,
  });
  const convex = liquidSurfaceOutline({
    width: 32,
    height: 32,
    radius: 16,
    step: 2,
    lens: { x: 16, y: 16, radius: 16 },
  });
  const flatMap = surfaceDisplacement(flat);
  const convexMap = surfaceDisplacement(convex);
  assert.equal(convex.path, flat.path);
  assert.ok(
    channelAt(convex, convexMap, 10, 16) >
      channelAt(flat, flatMap, 10, 16) + 20,
  );
  assert.ok(
    channelAt(convex, convexMap, 22, 16) <
      channelAt(flat, flatMap, 22, 16) - 20,
  );
});
