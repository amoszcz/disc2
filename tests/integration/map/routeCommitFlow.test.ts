import { describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import { confirmRoutePreview, plotRoutePreview } from "../../../src/engine/map/heroActions";

describe("route commit flow", () => {
  test("follows a plotted route to completion when movement is sufficient", () => {
    const state = createInitialState("advanced-terrain-scenario");
    plotRoutePreview(state, { x: 7, y: 11 });

    const result = confirmRoutePreview(state);

    expect(result.ok).toBe(true);
    expect(state.scenario.heroes[0].mapPosition).toEqual({ x: 7, y: 11 });
    expect(state.scenario.heroes[0].remainingMovement).toBe(6);
    expect(result.routeProgress?.traversedSteps).toHaveLength(2);
  });

  test("stops on the last affordable step and keeps continuation state", () => {
    const state = createInitialState("advanced-terrain-scenario");
    plotRoutePreview(state, { x: 20, y: 31 });

    const result = confirmRoutePreview(state);

    expect(result.ok).toBe(true);
    expect(result.routeProgress?.completionState).toBe("partial");
    expect(state.activeRoutePreview?.status).toBe("continuation");
    expect(state.activeRoutePreview?.steps.length).toBeGreaterThan(0);
    expect(state.scenario.heroes[0].mapPosition).not.toEqual({ x: 20, y: 31 });
  });
});
