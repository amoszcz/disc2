import { describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import { moveSelectedHero } from "../../../src/engine/map/heroActions";
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

  test("repeated linked-map travel preserves progress and records travel history", () => {
    const state = createInitialState("advanced-terrain-scenario");

    moveSelectedHero(state, { x: 6, y: 10 });
    moveSelectedHero(state, { x: 7, y: 10 });
    moveSelectedHero(state, { x: 8, y: 10 });
    state.scenario.heroes[0].remainingMovement = 8;
    moveSelectedHero(state, { x: 0, y: 4 });
    expect(state.scenario.heroes[0].mapId).toBe("surface");
    expect(state.scenario.heroes[0].mapPosition).toEqual({ x: 12, y: 10 });

    state.scenario.heroes[0].remainingMovement = 8;
    moveSelectedHero(state, { x: 11, y: 10 });
    moveSelectedHero(state, { x: 12, y: 10 });
    expect(state.scenario.heroes[0].mapId).toBe("cavern-depths");
    expect(state.mapTravelState.travelHistory).toEqual([
      "cave-entry-link",
      "cavern-shortcut-exit",
      "teleport-entry-link"
    ]);
  });

  test("invalid links fail safely without leaving the current playable map", () => {
    const state = createInitialState("advanced-terrain-scenario");
    const caveLink = state.scenario.mapLinks?.find((link) => link.id === "cave-entry-link");
    if (!caveLink) {
      throw new Error("Cave link was not available.");
    }

    caveLink.destinationMapId = "missing-map";
    moveSelectedHero(state, { x: 6, y: 10 });
    moveSelectedHero(state, { x: 7, y: 10 });
    const result = moveSelectedHero(state, { x: 8, y: 10 });

    expect(result.ok).toBe(true);
    expect(state.scenario.heroes[0].mapId).toBe("surface");
    expect(state.scenario.heroes[0].mapPosition).toEqual({ x: 8, y: 10 });
    expect(state.mapTravelState.activeMapId).toBe("surface");
    expect(state.mapTravelState.lastTravelLinkId).toBeNull();
    expect(state.mapTravelState.transitionMessage).toBe("That linked passage is unavailable.");
  });
});
