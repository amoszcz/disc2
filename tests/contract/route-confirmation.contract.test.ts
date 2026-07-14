import { describe, expect, test } from "vitest";
import { createInitialState } from "../../src/app/state/gameState";
import { confirmRoutePreview, plotRoutePreview } from "../../src/engine/map/heroActions";

describe("route confirmation contract", () => {
  test("second confirmation click follows the stored route and clears it on completion", () => {
    const state = createInitialState("advanced-terrain-scenario");
    plotRoutePreview(state, { x: 7, y: 11 });

    const result = confirmRoutePreview(state);

    expect(result.ok).toBe(true);
    expect(result.routeProgress?.completionState).toBe("completed");
    expect(state.activeRoutePreview).toBeNull();
  });

  test("partial traversal retains an unfinished route for later continuation", () => {
    const state = createInitialState("advanced-terrain-scenario");
    plotRoutePreview(state, { x: 20, y: 31 });

    const result = confirmRoutePreview(state);

    expect(result.ok).toBe(true);
    expect(result.routeProgress?.completionState).toBe("partial");
    expect(state.activeRoutePreview?.status).toBe("continuation");
  });
});
