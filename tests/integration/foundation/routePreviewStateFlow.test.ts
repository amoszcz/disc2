import { describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import { findShortestRoute } from "../../../src/engine/map/routePathfinding";
import { createRoutePreview, isRoutePreviewOwnedByHero, isSameRouteDestination, markRoutePreviewForContinuation } from "../../../src/engine/map/routePreviewState";

describe("route preview foundation flow", () => {
  test("calculates a weighted route across the advanced terrain scenario", () => {
    const state = createInitialState("advanced-terrain-scenario");
    const route = findShortestRoute(state.scenario, "hero-1", { x: 5, y: 10 }, { x: 7, y: 11 });

    expect(route.ok).toBe(true);
    expect(route.steps.map((step) => step.position)).toEqual([
      { x: 6, y: 10 },
      { x: 7, y: 11 }
    ]);
    expect(route.totalMovementCost).toBe(2);
  });

  test("creates preview state with ownership and destination checks", () => {
    const preview = createRoutePreview("hero-1", { x: 5, y: 10 }, { x: 6, y: 10 }, [
      { position: { x: 6, y: 10 }, movementCost: 1, terrainLabel: "Road", objectLabels: [] }
    ]);

    expect(isRoutePreviewOwnedByHero(preview, "hero-1")).toBe(true);
    expect(isSameRouteDestination(preview, { x: 6, y: 10 })).toBe(true);
  });

  test("marks previews for continuation after partial traversal", () => {
    const preview = createRoutePreview("hero-1", { x: 5, y: 10 }, { x: 9, y: 10 }, [
      { position: { x: 6, y: 10 }, movementCost: 1, terrainLabel: "Road", objectLabels: [] },
      { position: { x: 7, y: 10 }, movementCost: 1, terrainLabel: "Road", objectLabels: [] }
    ]);

    const continuation = markRoutePreviewForContinuation(preview, { x: 6, y: 10 }, [
      { position: { x: 7, y: 10 }, movementCost: 1, terrainLabel: "Road", objectLabels: [] }
    ]);

    expect(continuation.status).toBe("continuation");
    expect(continuation.lastValidatedFromPosition).toEqual({ x: 6, y: 10 });
    expect(continuation.totalMovementCost).toBe(1);
  });
});
