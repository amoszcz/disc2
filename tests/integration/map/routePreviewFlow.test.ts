import { describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import { clearOwnedRoutePreview, plotRoutePreview } from "../../../src/engine/map/heroActions";

describe("route preview flow", () => {
  test("plots a reachable route without spending movement", () => {
    const state = createInitialState("advanced-terrain-scenario");

    const result = plotRoutePreview(state, { x: 7, y: 11 });

    expect(result.ok).toBe(true);
    expect(state.scenario.heroes[0].remainingMovement).toBe(8);
    expect(state.activeRoutePreview?.destinationPosition).toEqual({ x: 7, y: 11 });
    expect(state.activeRoutePreview?.steps).toHaveLength(2);
    expect(state.routeFeedback?.routeMode).toBe("preview");
  });

  test("replaces an existing route preview when a different destination is chosen", () => {
    const state = createInitialState("advanced-terrain-scenario");

    expect(plotRoutePreview(state, { x: 6, y: 10 }).ok).toBe(true);
    expect(plotRoutePreview(state, { x: 7, y: 11 }).ok).toBe(true);

    expect(state.activeRoutePreview?.destinationPosition).toEqual({ x: 7, y: 11 });
    expect(state.activeRoutePreview?.steps).toHaveLength(2);
  });

  test("reports unreachable destinations without creating a route", () => {
    const state = createInitialState("advanced-terrain-scenario");

    const result = plotRoutePreview(state, { x: 20, y: 10 });

    expect(result.ok).toBe(false);
    expect(state.activeRoutePreview).toBeNull();
    expect(state.routeFeedback?.blockedReason).toBe("No legal route could be plotted to that destination.");
  });

  test("clears an active route when the owning hero is clicked", () => {
    const state = createInitialState("advanced-terrain-scenario");
    const startingPosition = { ...state.scenario.heroes[0].mapPosition };
    expect(plotRoutePreview(state, { x: 7, y: 11 }).ok).toBe(true);

    const result = clearOwnedRoutePreview(state, "hero-1");

    expect(result.ok).toBe(true);
    expect(state.activeRoutePreview).toBeNull();
    expect(state.routeFeedback).toBeNull();
    expect(state.scenario.heroes[0].mapPosition).toEqual(startingPosition);
  });
});
