import { describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import { advanceRoutePreviewStep, plotRoutePreview } from "../../../src/engine/map/heroActions";

describe("route traversal flow", () => {
  test("reaches a route destination over separate one-step advances", () => {
    const state = createInitialState("advanced-terrain-scenario");
    plotRoutePreview(state, { x: 7, y: 11 });
    advanceRoutePreviewStep(state);
    const final = advanceRoutePreviewStep(state);

    expect(final.routeProgress?.completionState).toBe("completed");
    expect(state.scenario.heroes[0].mapPosition).toEqual({ x: 7, y: 11 });
    expect(state.activeRoutePreview).toBeNull();
  });
});
