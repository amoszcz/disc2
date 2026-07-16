import { describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import { moveSelectedHero } from "../../../src/engine/map/heroActions";
import { advanceTurn, resetMovementForActivePlayer } from "../../../src/engine/turn/turnEngine";

describe("map turn flow", () => {
  test("hero movement consumes allowance and pickup collection updates gold", () => {
    const state = createInitialState();
    const moved = moveSelectedHero(state, { x: 1, y: 2 });

    expect(moved.ok).toBe(true);
    expect(state.scenario.heroes[0].remainingMovement).toBe(1);
    expect(state.scenario.players[0].resourceStockpile.gold).toBe(10);
    expect(state.scenario.resourcePickups[0].collectedState).toBe(true);
  });

  test("ending a turn preserves state and refreshes movement for the next active turn", () => {
    const state = createInitialState();
    moveSelectedHero(state, { x: 1, y: 2 });
    const nextPlayerId = advanceTurn(state.scenario, state.activePlayerId);
    resetMovementForActivePlayer(state.scenario, nextPlayerId);
    state.activePlayerId = nextPlayerId;

    expect(state.scenario.players[0].resourceStockpile.gold).toBe(10);
    expect(state.scenario.heroes[0].remainingMovement).toBe(2);
  });

  test("entering a cave trigger moves the hero into the linked submap without restarting the session", () => {
    const state = createInitialState("advanced-terrain-scenario");

    expect(moveSelectedHero(state, { x: 6, y: 10 }).ok).toBe(true);
    expect(moveSelectedHero(state, { x: 7, y: 10 }).ok).toBe(true);
    const result = moveSelectedHero(state, { x: 8, y: 10 });

    expect(result.ok).toBe(true);
    expect(state.scenario.heroes[0].mapId).toBe("cavern-depths");
    expect(state.scenario.heroes[0].mapPosition).toEqual({ x: 1, y: 4 });
    expect(state.mapTravelState.activeMapId).toBe("cavern-depths");
    expect(state.mapTravelState.lastMapId).toBe("surface");
    expect(state.mapTravelState.lastTravelLinkId).toBe("cave-entry-link");
    expect(state.sceneMode).toBe("map");
  });
});
