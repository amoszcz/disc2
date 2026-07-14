import { describe, expect, test } from "vitest";
import { createInitialState } from "../../src/app/state/gameState";
import { confirmRoutePreview, plotRoutePreview } from "../../src/engine/map/heroActions";
import { markRoutePreviewForContinuation } from "../../src/engine/map/routePreviewState";
import { advanceTurn, resetMovementForActivePlayer } from "../../src/engine/turn/turnEngine";

describe("route persistence contract", () => {
  test("unfinished routes can survive end turn and stay owned by the same hero", () => {
    const state = createInitialState("advanced-terrain-scenario");
    plotRoutePreview(state, { x: 20, y: 31 });
    confirmRoutePreview(state);

    const nextPlayerId = advanceTurn(state.scenario, state.activePlayerId);
    resetMovementForActivePlayer(state.scenario, nextPlayerId);
    state.activePlayerId = nextPlayerId;
    if (state.activeRoutePreview) {
      state.activeRoutePreview = markRoutePreviewForContinuation(
        state.activeRoutePreview,
        state.scenario.heroes[0].mapPosition,
        state.activeRoutePreview.steps
      );
    }

    expect(state.activeRoutePreview?.status).toBe("continuation");
    expect(state.activeRoutePreview?.heroId).toBe("hero-1");
  });

  test("persistent routes can be replaced by plotting a different destination", () => {
    const state = createInitialState("advanced-terrain-scenario");
    plotRoutePreview(state, { x: 20, y: 31 });
    confirmRoutePreview(state);

    expect(plotRoutePreview(state, { x: 7, y: 11 }).ok).toBe(true);
    expect(state.activeRoutePreview?.destinationPosition).toEqual({ x: 7, y: 11 });
  });
});
