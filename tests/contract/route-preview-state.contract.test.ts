import { describe, expect, test } from "vitest";
import { createInitialState } from "../../src/app/state/gameState";
import { clearOwnedRoutePreview, plotRoutePreview } from "../../src/engine/map/heroActions";
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

  test("clicking the owning hero can clear the active route without moving the hero", () => {
    const state = createInitialState("advanced-terrain-scenario");
    const startingPosition = { ...state.scenario.heroes[0].mapPosition };
    expect(plotRoutePreview(state, { x: 7, y: 11 }).ok).toBe(true);

    const result = clearOwnedRoutePreview(state, "hero-1");

    expect(result.ok).toBe(true);
    expect(state.activeRoutePreview).toBeNull();
    expect(state.scenario.heroes[0].mapPosition).toEqual(startingPosition);
    expect(state.scenario.heroes[0].remainingMovement).toBe(8);
  });

  test("diagonal previews cost more than orthogonal previews across equivalent terrain", () => {
    const state = createInitialState("advanced-terrain-scenario");

    expect(plotRoutePreview(state, { x: 5, y: 11 }).ok).toBe(true);
    const orthogonalCost = state.activeRoutePreview?.totalMovementCost;

    expect(plotRoutePreview(state, { x: 6, y: 11 }).ok).toBe(true);
    const diagonalCost = state.activeRoutePreview?.totalMovementCost;

    expect(orthogonalCost).toBe(2);
    expect(diagonalCost).toBe(3);
    expect(diagonalCost).toBeGreaterThan(orthogonalCost ?? 0);
  });
});
