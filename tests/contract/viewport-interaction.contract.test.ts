import { describe, expect, test } from "vitest";
import { createInitialState, setBattleState } from "../../src/app/state/gameState";
import { createInteractionTarget } from "../../src/engine/map/viewportMath";

describe("viewport interaction contract", () => {
  test("restores the same view state after leaving and returning to the map", () => {
    const state = createInitialState("advanced-terrain-scenario");
    state.mapViewState.viewport.panOffsetX = 4;
    state.mapViewState.viewport.panOffsetY = 6;
    state.mapViewState.viewport.zoomLevel = 2.5;

    setBattleState(
      state,
      {
        id: "battle-1",
        attackingHeroId: "hero-1",
        defendingForceId: "guard-force-1",
        participants: [],
        formation: {
          rows: 3,
          columns: 4,
          attackerSlots: [],
          defenderSlots: []
        },
        turnQueue: [],
        activeUnitId: "",
        targetingState: null,
        defendStates: [],
        battleState: "active",
        outcome: null
      }
    );
    setBattleState(state, null);

    expect(state.mapViewState.viewport.zoomLevel).toBe(2.5);
    expect(state.mapViewState.viewport.panOffsetX).toBe(4);
    expect(state.mapViewState.viewport.panOffsetY).toBe(6);
  });

  test("maps a visible screen point back to the intended tile", () => {
    const state = createInitialState("advanced-terrain-scenario");
    state.mapViewState.viewport.zoomLevel = 2;
    const target = createInteractionTarget({ x: 110, y: 210 }, state.mapViewState.viewport, state.scenario.map);

    expect(target.worldPosition).toEqual({ x: 5, y: 10 });
  });
});
