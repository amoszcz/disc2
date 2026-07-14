import { describe, expect, test } from "vitest";
import { createRoutePreview, isRoutePreviewOwnedByHero, isSameRouteDestination } from "../../src/engine/map/routePreviewState";

describe("route preview state contract", () => {
  test("first-click previews are owned by one hero and one destination", () => {
    const preview = createRoutePreview("hero-1", { x: 5, y: 10 }, { x: 6, y: 10 }, [
      { position: { x: 6, y: 10 }, movementCost: 1, terrainLabel: "Road", objectLabels: [] }
    ]);

    expect(preview.isAwaitingConfirmation).toBe(true);
    expect(isRoutePreviewOwnedByHero(preview, "hero-1")).toBe(true);
    expect(isSameRouteDestination(preview, { x: 6, y: 10 })).toBe(true);
  });

  test("preview ownership does not transfer to another hero implicitly", () => {
    const preview = createRoutePreview("hero-1", { x: 5, y: 10 }, { x: 6, y: 10 }, [
      { position: { x: 6, y: 10 }, movementCost: 1, terrainLabel: "Road", objectLabels: [] }
    ]);

    expect(isRoutePreviewOwnedByHero(preview, "hero-2")).toBe(false);
  });
});
