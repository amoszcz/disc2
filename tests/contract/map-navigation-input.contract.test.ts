import { describe, expect, test } from "vitest";
import { createPanGesture, createViewport, panViewport } from "../../src/engine/map/viewportMath";

describe("map navigation input contract", () => {
  test("middle-mouse drag pans the viewport and stays within map bounds", () => {
    const map = { width: 64, height: 64 };
    const viewport = createViewport(map);
    const gesture = createPanGesture({ x: 200, y: 200 }, viewport);
    const moved = panViewport(viewport, gesture, { x: 120, y: 140 }, map);

    expect(moved.panOffsetX).toBeGreaterThan(0);
    expect(moved.panOffsetY).toBeGreaterThan(0);
    expect(moved.panOffsetX).toBeLessThanOrEqual(map.width);
    expect(moved.panOffsetY).toBeLessThanOrEqual(map.height);
  });
});
