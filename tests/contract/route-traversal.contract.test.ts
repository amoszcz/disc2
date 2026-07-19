import { describe, expect, test } from "vitest";
import { createInitialState } from "../../src/app/state/gameState";
import { advanceRoutePreviewStep, plotRoutePreview } from "../../src/engine/map/heroActions";

describe("route traversal contract", () => {
  test("advances exactly one legal route tile and retains the remaining route", () => {
    const state = createInitialState("advanced-terrain-scenario");
    plotRoutePreview(state, { x: 7, y: 11 });

    const result = advanceRoutePreviewStep(state);

    expect(result.ok).toBe(true);
    expect(result.routeProgress?.traversedSteps).toHaveLength(1);
    expect(result.routeProgress?.remainingSteps).toHaveLength(1);
    expect(state.scenario.heroes[0].mapPosition).toEqual({ x: 6, y: 10 });
    expect(state.activeRoutePreview?.status).toBe("continuation");
  });
});
