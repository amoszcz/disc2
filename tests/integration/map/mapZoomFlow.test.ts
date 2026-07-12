import { describe, expect, test } from "vitest";
import { createViewport, screenPointToWorldPoint, zoomViewportAtPoint } from "../../../src/engine/map/viewportMath";

describe("map zoom flow", () => {
  test("zooms in toward the cursor while preserving the hovered world point", () => {
    const map = { width: 64, height: 64 };
    const viewport = createViewport(map);
    const anchor = { x: 120, y: 180 };
    const before = screenPointToWorldPoint(anchor, viewport, map);
    const zoomed = zoomViewportAtPoint(viewport, -120, anchor, map);
    const after = screenPointToWorldPoint(anchor, zoomed, map);

    expect(zoomed.zoomLevel).toBe(2.25);
    expect(Math.abs(after.x - before.x)).toBeLessThan(0.001);
    expect(Math.abs(after.y - before.y)).toBeLessThan(0.001);
  });

  test("clamps zoom within the supported range", () => {
    const map = { width: 64, height: 64 };
    let viewport = createViewport(map);

    for (let index = 0; index < 20; index += 1) {
      viewport = zoomViewportAtPoint(viewport, -120, { x: 200, y: 200 }, map);
    }
    expect(viewport.zoomLevel).toBe(viewport.maxZoom);

    for (let index = 0; index < 40; index += 1) {
      viewport = zoomViewportAtPoint(viewport, 120, { x: 200, y: 200 }, map);
    }
    expect(viewport.zoomLevel).toBe(viewport.minZoom);
  });
});
