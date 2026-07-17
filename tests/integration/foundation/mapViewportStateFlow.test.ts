import { describe, expect, test } from "vitest";
import { createInitialState, createDefaultMapViewState } from "../../../src/app/state/gameState";
import { createViewport, getScaledTileSize, getZoomScaleBaseline, normalizeViewport } from "../../../src/engine/map/viewportMath";

describe("map viewport state foundation flow", () => {
  test("creates a persisted default view state for the active scenario", () => {
    const state = createInitialState("advanced-terrain-scenario");
    const baseline = getZoomScaleBaseline();

    expect(getScaledTileSize(state.mapViewState.viewport, state.scenario.map)).toBe(baseline.minTileRenderSize);
    expect(state.mapViewState.panGesture).toBeNull();
    expect(state.mapViewState.lastSceneMode).toBe("map");
  });

  test("normalizes viewport bounds for the current scenario and canvas", () => {
    const viewport = normalizeViewport(
      {
        ...createViewport({ width: 64, height: 64 }),
        panOffsetX: 500,
        panOffsetY: 500
      },
      { width: 64, height: 64 }
    );

    expect(viewport.panOffsetX).toBeLessThan(64);
    expect(viewport.panOffsetY).toBeLessThan(64);
  });

  test("recreates a valid default view state for a scenario", () => {
    const state = createInitialState("advanced-terrain-scenario");
    const nextView = createDefaultMapViewState(state.scenario);
    const baseline = getZoomScaleBaseline();

    expect(getScaledTileSize(nextView.viewport, state.scenario.map)).toBe(baseline.minTileRenderSize);
    expect(nextView.isDefaultView).toBe(true);
  });
});
