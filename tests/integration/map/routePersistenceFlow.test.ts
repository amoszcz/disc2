import { describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import { confirmRoutePreview, plotRoutePreview } from "../../../src/engine/map/heroActions";
import { autoAdvanceActiveRouteBeforeTurnEnd, advanceTurn, carryRoutePreviewAcrossTurn, resetMovementForActivePlayer } from "../../../src/engine/turn/turnEngine";

describe("route persistence flow", () => {
  test("auto-advances an unfinished route before ending the turn and keeps the remainder active", () => {
    const state = createInitialState("advanced-terrain-scenario");
    plotRoutePreview(state, { x: 20, y: 31 });
    const positionBeforeTurnEnd = { ...state.scenario.heroes[0].mapPosition };

    const turnEndResult = autoAdvanceActiveRouteBeforeTurnEnd(state);
    const nextPlayerId = advanceTurn(state.scenario, state.activePlayerId);
    resetMovementForActivePlayer(state.scenario, nextPlayerId);
    state.activePlayerId = nextPlayerId;
    state.activeRoutePreview = carryRoutePreviewAcrossTurn(state.activeRoutePreview, state.scenario.heroes[0].mapPosition);

    expect(turnEndResult?.ok).toBe(true);
    expect(turnEndResult?.routeProgress?.triggerSource).toBe("end-turn");
    expect(state.scenario.heroes[0].mapPosition).not.toEqual(positionBeforeTurnEnd);
    expect(state.activeRoutePreview?.steps.length).toBeGreaterThan(0);
    expect(state.activeRoutePreview?.status).toBe("continuation");
  });

  test("continues a persisted route on a later turn", () => {
    const state = createInitialState("advanced-terrain-scenario");
    plotRoutePreview(state, { x: 20, y: 31 });

    autoAdvanceActiveRouteBeforeTurnEnd(state);
    const nextPlayerId = advanceTurn(state.scenario, state.activePlayerId);
    resetMovementForActivePlayer(state.scenario, nextPlayerId);
    state.activePlayerId = nextPlayerId;
    state.activeRoutePreview = carryRoutePreviewAcrossTurn(state.activeRoutePreview, state.scenario.heroes[0].mapPosition);

    const result = confirmRoutePreview(state);

    expect(result.ok).toBe(true);
    expect(result.routeProgress?.traversedSteps.length).toBeGreaterThan(0);
  });
});
