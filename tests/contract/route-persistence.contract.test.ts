import { describe, expect, test } from "vitest";
import { createInitialState } from "../../src/app/state/gameState";
import { plotRoutePreview } from "../../src/engine/map/heroActions";
import { autoAdvanceActiveRouteBeforeTurnEnd, advanceTurn, carryRoutePreviewAcrossTurn, resetMovementForActivePlayer } from "../../src/engine/turn/turnEngine";

describe("route persistence contract", () => {
  test("unfinished plotted routes can auto-advance at end turn and stay owned by the same hero", () => {
    const state = createInitialState("advanced-terrain-scenario");
    plotRoutePreview(state, { x: 20, y: 31 });

    const autoAdvance = autoAdvanceActiveRouteBeforeTurnEnd(state);
    const nextPlayerId = advanceTurn(state.scenario, state.activePlayerId);
    resetMovementForActivePlayer(state.scenario, nextPlayerId);
    state.activePlayerId = nextPlayerId;
    state.activeRoutePreview = carryRoutePreviewAcrossTurn(state.activeRoutePreview, state.scenario.heroes[0].mapPosition);

    expect(autoAdvance?.ok).toBe(true);
    expect(autoAdvance?.routeProgress?.triggerSource).toBe("end-turn");
    expect(state.activeRoutePreview?.status).toBe("continuation");
    expect(state.activeRoutePreview?.heroId).toBe("hero-1");
  });

  test("persistent routes can be replaced by plotting a different destination", () => {
    const state = createInitialState("advanced-terrain-scenario");
    plotRoutePreview(state, { x: 20, y: 31 });

    expect(plotRoutePreview(state, { x: 7, y: 11 }).ok).toBe(true);
    expect(state.activeRoutePreview?.destinationPosition).toEqual({ x: 7, y: 11 });
  });
});
