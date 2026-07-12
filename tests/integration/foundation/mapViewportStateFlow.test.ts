import { describe, expect, test } from "vitest";
import { createInitialState, createDefaultMapViewState } from "../../../src/app/state/gameState";
import { createViewport, normalizeViewport } from "../../../src/engine/map/viewportMath";

describe("map viewport state foundation flow", () => {
  test("creates a persisted default view state for the active scenario", () => {
    const state = createInitialState("advanced-terrain-scenario");

    expect(state.mapViewState.viewport.zoomLevel).toBe(2);
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

    expect(nextView.viewport.zoomLevel).toBe(2);
    expect(nextView.isDefaultView).toBe(true);
  });
});
