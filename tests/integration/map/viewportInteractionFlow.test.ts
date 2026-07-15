import { describe, expect, test } from "vitest";
import { createInitialState, setBattleState } from "../../../src/app/state/gameState";
import { createInteractionTarget, worldPointToScreenPoint } from "../../../src/engine/map/viewportMath";

describe("viewport interaction flow", () => {
  test("translates visible canvas coordinates into the intended world tile after pan and zoom", () => {
    const state = createInitialState("advanced-terrain-scenario");
    state.mapViewState.viewport.zoomLevel = 2;
    state.mapViewState.viewport.panOffsetX = 2;
    state.mapViewState.viewport.panOffsetY = 4;

    const screenPoint = worldPointToScreenPoint({ x: 5, y: 10 }, state.mapViewState.viewport, state.scenario.map);
    const target = createInteractionTarget(screenPoint, state.mapViewState.viewport, state.scenario.map);

    expect(target.worldPosition).toEqual({ x: 5, y: 10 });
  });

  test("preserves map view state across a scene change and return", () => {
    const state = createInitialState("advanced-terrain-scenario");
    state.mapViewState.viewport.zoomLevel = 2.75;
    state.mapViewState.viewport.panOffsetX = 7;
    state.mapViewState.viewport.panOffsetY = 9;

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

    expect(state.sceneMode).toBe("map");
    expect(state.mapViewState.viewport.zoomLevel).toBe(2.75);
    expect(state.mapViewState.viewport.panOffsetX).toBe(7);
    expect(state.mapViewState.viewport.panOffsetY).toBe(9);
  });
});
