import { describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import { confirmRoutePreview, plotRoutePreview } from "../../../src/engine/map/heroActions";
import { markRoutePreviewForContinuation } from "../../../src/engine/map/routePreviewState";
import { advanceTurn, resetMovementForActivePlayer } from "../../../src/engine/turn/turnEngine";

describe("route persistence flow", () => {
  test("keeps an unfinished route active after ending the turn", () => {
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

    expect(state.activeRoutePreview?.steps.length).toBeGreaterThan(0);
    expect(state.activeRoutePreview?.status).toBe("continuation");
  });

  test("continues a persisted route on a later turn", () => {
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

    const result = confirmRoutePreview(state);

    expect(result.ok).toBe(true);
    expect(result.routeProgress?.traversedSteps.length).toBeGreaterThan(0);
  });
});
