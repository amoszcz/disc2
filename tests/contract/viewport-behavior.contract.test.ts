import { describe, expect, test } from "vitest";
import { createViewport, screenPointToWorldPoint, zoomViewportAtPoint } from "../../src/engine/map/viewportMath";

describe("viewport behavior contract", () => {
  test("wheel zoom keeps the pointed-at map area stable", () => {
    const map = { width: 64, height: 64 };
    const viewport = createViewport(map);
    const anchor = { x: 200, y: 150 };
    const before = screenPointToWorldPoint(anchor, viewport, map);
    const zoomed = zoomViewportAtPoint(viewport, -100, anchor, map);
    const after = screenPointToWorldPoint(anchor, zoomed, map);

    expect(zoomed.zoomLevel).toBeGreaterThan(viewport.zoomLevel);
    expect(Math.abs(after.x - before.x)).toBeLessThan(0.001);
    expect(Math.abs(after.y - before.y)).toBeLessThan(0.001);
  });
});
