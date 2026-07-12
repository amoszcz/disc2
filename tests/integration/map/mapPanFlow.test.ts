import { describe, expect, test } from "vitest";
import { createPanGesture, createViewport, panViewport } from "../../../src/engine/map/viewportMath";

describe("map pan flow", () => {
  test("updates viewport offsets from middle-mouse drag movement", () => {
    const map = { width: 64, height: 64 };
    const viewport = createViewport(map);
    const gesture = createPanGesture({ x: 300, y: 300 }, viewport);
    const panned = panViewport(viewport, gesture, { x: 200, y: 180 }, map);

    expect(panned.panOffsetX).toBeGreaterThan(0);
    expect(panned.panOffsetY).toBeGreaterThan(0);
  });

  test("clamps panning at map boundaries", () => {
    const map = { width: 64, height: 64 };
    const viewport = createViewport(map);
    const gesture = createPanGesture({ x: 0, y: 0 }, viewport);
    const panned = panViewport(viewport, gesture, { x: -10000, y: -10000 }, map);

    expect(panned.panOffsetX).toBeGreaterThanOrEqual(0);
    expect(panned.panOffsetY).toBeGreaterThanOrEqual(0);
    expect(panned.panOffsetX).toBeLessThan(map.width);
    expect(panned.panOffsetY).toBeLessThan(map.height);
  });
});
